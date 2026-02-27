import {
    Injectable,
    BadRequestException,
    ForbiddenException,
    NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ScoringService } from './scoring.service';
import { CareersService } from './careers.service';
import { SectorMatchingService } from './sector-matching.service';
import { AiAnalysisService } from '../ai-analysis/ai-analysis.service';
import { UserRole, AssessmentStatus } from '@prisma/client';
import { LoggerService } from '../logger/logger.service';

/**
 * Assessments Service
 * Handles assessment lifecycle: start, questions, submit, results
 */
@Injectable()
export class AssessmentsService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly scoringService: ScoringService,
        private readonly careersService: CareersService,
        private readonly sectorMatchingService: SectorMatchingService,
        private readonly aiAnalysisService: AiAnalysisService,
        private readonly logger: LoggerService,
    ) {
        this.logger.setContext('Assessments');
    }

    /**
     * Get all assessments available for a user based on their role
     */
    async getAvailableAssessments(userId: string, role: UserRole) {
        const assessments = await this.prisma.assessment.findMany({
            where: {
                isActive: true,
                allowedRoles: { has: role },
            },
            select: {
                id: true,
                title: true,
                description: true,
                type: true,
                timeLimit: true,
                _count: { select: { questions: true } },
            },
        });

        // Get user's existing attempts
        const userAssessments = await this.prisma.userAssessment.findMany({
            where: { userId },
            select: { assessmentId: true, status: true, completedAt: true },
        });

        const attemptMap = new Map(
            userAssessments.map(ua => [ua.assessmentId, ua]),
        );

        return assessments.map(assessment => ({
            ...assessment,
            questionCount: assessment._count.questions,
            userStatus: attemptMap.get(assessment.id)?.status || null,
            completedAt: attemptMap.get(assessment.id)?.completedAt || null,
        }));
    }

    /**
     * Get assessment questions (without correct answers - security)
     */
    async getAssessmentQuestions(assessmentId: string, userId: string, role: UserRole) {
        const assessment = await this.prisma.assessment.findUnique({
            where: { id: assessmentId },
            include: {
                questions: {
                    orderBy: { orderIndex: 'asc' },
                    include: {
                        options: {
                            orderBy: { orderIndex: 'asc' },
                            select: {
                                id: true,
                                text: true,
                                textMl: true,
                                orderIndex: true,
                                // SECURITY: Never send isCorrect or scoreValue
                            },
                        },
                    },
                },
            },
        });

        if (!assessment) {
            throw new NotFoundException('Assessment not found');
        }

        if (!assessment.allowedRoles.includes(role)) {
            throw new ForbiddenException('You do not have access to this assessment');
        }

        // Check if user has an active attempt
        const userAssessment = await this.prisma.userAssessment.findUnique({
            where: {
                userId_assessmentId: { userId, assessmentId },
            },
            include: {
                responses: true, // Fetch saved responses
            },
        });

        // Format saved responses as a Record<questionId, selectedOptionId>
        const savedAnswers: Record<string, string> = {};
        if (userAssessment?.responses) {
            userAssessment.responses.forEach(r => {
                savedAnswers[r.questionId] = r.selectedOptionId;
            });
        }

        return {
            id: assessment.id,
            title: assessment.title,
            description: assessment.description,
            type: assessment.type,
            timeLimit: assessment.timeLimit,
            userAssessmentId: userAssessment?.id || null,
            status: userAssessment?.status || null,
            lastQuestionIndex: userAssessment?.lastQuestionIndex || 0,
            savedAnswers,
            questions: assessment.questions.map(q => ({
                id: q.id,
                section: q.section,
                text: q.text,
                textMl: q.textMl,
                options: q.options,
            })),
        };
    }

    /**
     * Start a new assessment attempt
     */
    async startAssessment(
        assessmentId: string,
        userId: string,
        role: UserRole,
        ipAddress?: string,
        userAgent?: string,
    ) {
        const assessment = await this.prisma.assessment.findUnique({
            where: { id: assessmentId },
        });

        if (!assessment) {
            throw new NotFoundException('Assessment not found');
        }

        if (!assessment.allowedRoles.includes(role)) {
            throw new ForbiddenException('You do not have access to this assessment');
        }

        // Check for existing attempt
        const existing = await this.prisma.userAssessment.findUnique({
            where: {
                userId_assessmentId: { userId, assessmentId },
            },
        });

        if (existing) {
            if (existing.status === AssessmentStatus.COMPLETED) {
                throw new BadRequestException('You have already completed this assessment');
            }
            // Return existing in-progress attempt
            return {
                userAssessmentId: existing.id,
                status: existing.status,
                startedAt: existing.startedAt,
                lastQuestionIndex: existing.lastQuestionIndex,
            };
        }

        // Create new attempt
        const userAssessment = await this.prisma.userAssessment.create({
            data: {
                userId,
                assessmentId,
                status: AssessmentStatus.IN_PROGRESS,
                startedAt: new Date(),
                ipAddress: ipAddress?.toString() || null,
                userAgent: userAgent || null,
            },
        });

        this.logger.logBusinessEvent('ASSESSMENT_STARTED', {
            userId,
            assessmentId,
            userAssessmentId: userAssessment.id,
        });

        return {
            userAssessmentId: userAssessment.id,
            status: userAssessment.status,
            startedAt: userAssessment.startedAt,
            lastQuestionIndex: userAssessment.lastQuestionIndex,
        };
    }

    /**
     * Save progress (single answer + current index)
     */
    async saveProgress(
        userAssessmentId: string,
        userId: string,
        questionId: string,
        selectedOptionId: string,
        currentQuestionIndex: number,
    ) {
        const userAssessment = await this.prisma.userAssessment.findUnique({
            where: { id: userAssessmentId },
        });

        if (!userAssessment) {
            throw new NotFoundException('Assessment attempt not found');
        }

        if (userAssessment.userId !== userId) {
            throw new ForbiddenException('You can only save your own assessment');
        }

        if (userAssessment.status === AssessmentStatus.COMPLETED) {
            throw new BadRequestException('Assessment already submitted');
        }

        // Upsert the response
        await this.prisma.userResponse.upsert({
            where: {
                userAssessmentId_questionId: {
                    userAssessmentId,
                    questionId,
                },
            },
            update: {
                selectedOptionId,
                answeredAt: new Date(),
            },
            create: {
                userAssessmentId,
                questionId,
                selectedOptionId,
            },
        });

        // Update the last question index
        await this.prisma.userAssessment.update({
            where: { id: userAssessmentId },
            data: {
                lastQuestionIndex: currentQuestionIndex,
                updatedAt: new Date(),
            },
        });

    }

    /**
     * Submit assessment answers and calculate results
     */
    async submitAssessment(
        userAssessmentId: string,
        userId: string,
        answers: Array<{ questionId: string; selectedOptionId: string }>,
    ) {
        const userAssessment = await this.prisma.userAssessment.findUnique({
            where: { id: userAssessmentId },
            include: { assessment: true, user: true },
        });

        if (!userAssessment) {
            throw new NotFoundException('Assessment attempt not found');
        }

        if (userAssessment.userId !== userId) {
            throw new ForbiddenException('You can only submit your own assessment');
        }

        if (userAssessment.status === AssessmentStatus.COMPLETED) {
            throw new BadRequestException('Assessment already submitted');
        }

        // Save all responses
        await this.prisma.userResponse.createMany({
            data: answers.map(a => ({
                userAssessmentId,
                questionId: a.questionId,
                selectedOptionId: a.selectedOptionId,
            })),
            skipDuplicates: true,
        });

        // Calculate scores based on user role
        const isStudent = userAssessment.user.role === UserRole.STUDENT;

        if (isStudent) {
            return this.processStudentAssessment(userAssessmentId, userId);
        } else {
            return this.processJobSeekerAssessment(userAssessmentId, userId);
        }
    }

    /**
     * Process student assessment (comprehensive 4-module)
     */
    private async processStudentAssessment(userAssessmentId: string, userId: string) {
        const studentScores = await this.scoringService.calculateStudentScores(userAssessmentId);

        // Get user profile for AI
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: { studentProfile: true },
        });

        // Get career matches using RIASEC data
        let careerMatches = null;
        let sectorMatches = null;
        if (studentScores.riasecCode) {
            careerMatches = await this.careersService.findMatchingCareers(
                studentScores.riasecCode,
                studentScores.riasec as any,
                studentScores.aptitude,
            );
            // Convert student personality (4-point scale) to job-seeker format (5-point scale)
            // so sector matching can compute meaningful personalityFit scores
            const studentToJobSeekerTraitMap: Record<string, string> = {
                'Responsibility & Discipline': 'Work Discipline & Task Reliability',
                'Stress Tolerance': 'Stress Tolerance & Emotional Regulation',
                'Curiosity & Openness': 'Learning & Change Orientation',
                'Social Interaction': 'Social Engagement & Task Focus',
                'Team vs Independent Style': 'Team Compatibility & Cooperation',
                'Decision-Making Style': 'Integrity & Responsibility',
            };
            const convertedPersonality: Record<string, { score: number; maxScore: number; average: number }> = {};
            for (const [studentTrait, jobSeekerTrait] of Object.entries(studentToJobSeekerTraitMap)) {
                const traitData = studentScores.personality[studentTrait];
                if (traitData) {
                    // Student: 6 questions × 4-point scale (score range 6-24, avg 1-4)
                    // Sector ideal: 1-5 scale. Map 1-4 → 1-5: mapped = 1 + (avg - 1) * (4/3)
                    const avgPerQuestion = traitData.score / 6;
                    const mappedAverage = 1 + (avgPerQuestion - 1) * (4 / 3);
                    convertedPersonality[jobSeekerTrait] = {
                        score: traitData.score,
                        maxScore: traitData.maxScore,
                        average: Math.round(mappedAverage * 100) / 100,
                    };
                }
            }

            sectorMatches = this.sectorMatchingService.findMatchingSectors(
                studentScores.riasec as any,
                studentScores.riasecCode,
                studentScores.aptitude,
                convertedPersonality as any,
                studentScores.readiness as any,
            );
        }

        // Generate AI analysis with all 4 modules
        let aiAnalysis = null;
        if (user?.studentProfile) {
            aiAnalysis = await this.aiAnalysisService.generateStudentAnalysis(
                {
                    fullName: user.studentProfile.fullName,
                    grade: user.studentProfile.grade || undefined,
                    schoolName: user.studentProfile.schoolName || undefined,
                    location: user.studentProfile.location || undefined,
                },
                studentScores.aptitude,
                studentScores.riasec,
                studentScores.riasecCode,
                studentScores.personality,
                studentScores.readiness,
            );

            if (aiAnalysis) {
                await this.aiAnalysisService.saveStudentAnalysis(userAssessmentId, aiAnalysis);
            }
        }

        // Serialize sector matches for storage
        const sectorMatchesForStorage = sectorMatches?.topSectors?.slice(0, 6).map((sm: any) => ({
            id: sm.sector.id,
            name: sm.sector.name,
            nameMl: sm.sector.nameMl,
            icon: sm.sector.icon,
            description: sm.sector.description,
            matchScore: sm.matchScore,
            riasecFit: sm.riasecFit,
            aptitudeFit: sm.aptitudeFit,
            personalityFit: sm.personalityFit,
            employabilityFit: sm.employabilityFit,
            matchReasons: sm.matchReasons,
            readinessLevel: sm.readinessLevel,
            exampleRoles: sm.sector.exampleRoles,
            growthOutlook: sm.sector.growthOutlook,
            avgSalaryRange: sm.sector.avgSalaryRange,
        })) || [];

        // Update user assessment with all scores
        await this.prisma.userAssessment.update({
            where: { id: userAssessmentId },
            data: {
                status: AssessmentStatus.COMPLETED,
                completedAt: new Date(),
                totalScore: studentScores.weightedScore,
                aptitudeScores: studentScores.aptitude as any,
                riasecScores: studentScores.riasec as any,
                riasecCode: studentScores.riasecCode,
                personalityScores: studentScores.personality as any,
                employabilityScores: studentScores.readiness as any, // Reuse field for readiness
                clarityIndex: studentScores.clarityIndex,
                careerMatches: careerMatches?.topMatches as any || null,
                sectorMatches: sectorMatchesForStorage as any,
                academicReadinessIndex: studentScores.academicReadinessIndex,
                performanceLevel: studentScores.performanceLevel,
                topStrengths: studentScores.topStrengths,
                areasForImprovement: studentScores.areasForImprovement,
            },
        });

        this.logger.logBusinessEvent('ASSESSMENT_COMPLETED', {
            userId,
            userAssessmentId,
            type: 'STUDENT',
            score: studentScores.weightedScore,
            riasecCode: studentScores.riasecCode,
        });

        return {
            status: 'COMPLETED',
            scores: studentScores,
            careerMatches: careerMatches?.topMatches || [],
            sectorMatches: sectorMatchesForStorage,
            aiAnalysis,
        };
    }

    /**
     * Process job seeker assessment (full comprehensive)
     */
    private async processJobSeekerAssessment(userAssessmentId: string, userId: string) {
        const scores = await this.scoringService.calculateAllScores(userAssessmentId);

        // Get career matches (legacy, kept for backward compatibility)
        const careerMatches = await this.careersService.findMatchingCareers(
            scores.riasecCode,
            scores.riasec,
            scores.aptitude,
        );

        // Get sector matches (new, world-class algorithm)
        const sectorMatches = this.sectorMatchingService.findMatchingSectors(
            scores.riasec,
            scores.riasecCode,
            scores.aptitude,
            scores.personality,
            scores.employability,
        );

        // Get user profile for AI
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: { jobSeekerProfile: true },
        });

        // Generate AI analysis with sector data
        let aiAnalysis = null;
        if (user?.jobSeekerProfile) {
            aiAnalysis = await this.aiAnalysisService.generateAnalysis(
                {
                    fullName: user.jobSeekerProfile.fullName,
                    education: user.jobSeekerProfile.educationLevel || undefined,
                    currentRole: user.jobSeekerProfile.currentStatus || undefined,
                    location: user.jobSeekerProfile.location || undefined,
                },
                scores,
                careerMatches.topMatches,
                sectorMatches, // Pass sector data for AI context
            );

            if (aiAnalysis) {
                await this.aiAnalysisService.saveAnalysis(userAssessmentId, aiAnalysis);
            }
        }

        const perfMetrics = this.scoringService.calculateJobSeekerPerformanceMetrics(scores);

        // Serialize sector matches for storage (top 6 sectors)
        const sectorMatchesForStorage = sectorMatches.topSectors.slice(0, 6).map(sm => ({
            id: sm.sector.id,
            name: sm.sector.name,
            nameMl: sm.sector.nameMl,
            icon: sm.sector.icon,
            description: sm.sector.description,
            matchScore: sm.matchScore,
            riasecFit: sm.riasecFit,
            aptitudeFit: sm.aptitudeFit,
            personalityFit: sm.personalityFit,
            employabilityFit: sm.employabilityFit,
            matchReasons: sm.matchReasons,
            readinessLevel: sm.readinessLevel,
            exampleRoles: sm.sector.exampleRoles,
            growthOutlook: sm.sector.growthOutlook,
            avgSalaryRange: sm.sector.avgSalaryRange,
        }));

        // Update user assessment
        await this.prisma.userAssessment.update({
            where: { id: userAssessmentId },
            data: {
                status: AssessmentStatus.COMPLETED,
                completedAt: new Date(),
                totalScore: scores.aptitude.overall.percentage,
                sectionScores: this.scoringService.getSectionScoresForStorage(scores),
                aptitudeScores: scores.aptitude as any,
                riasecScores: scores.riasec as any,
                riasecCode: scores.riasecCode,
                employabilityScores: scores.employability as any,
                personalityScores: scores.personality as any,
                clarityIndex: scores.clarityIndex,
                careerMatches: careerMatches.topMatches as any,
                sectorMatches: sectorMatchesForStorage as any,
                performanceLevel: perfMetrics.performanceLevel,
                topStrengths: perfMetrics.topStrengths,
                areasForImprovement: perfMetrics.areasForImprovement,
            },
        });

        this.logger.logBusinessEvent('ASSESSMENT_COMPLETED', {
            userId,
            userAssessmentId,
            type: 'JOB_SEEKER',
            riasecCode: scores.riasecCode,
            topSector: sectorMatchesForStorage[0]?.name,
        });

        return {
            status: 'COMPLETED',
            scores,
            careerMatches: careerMatches.topMatches,
            sectorMatches: sectorMatchesForStorage,
            aiAnalysis,
        };
    }

    /**
     * Get a user's assessment result
     */
    async getUserAssessmentResult(userAssessmentId: string, userId: string) {
        const result = await this.prisma.userAssessment.findUnique({
            where: { id: userAssessmentId },
            include: {
                assessment: {
                    select: { title: true, type: true },
                },
            },
        });

        if (!result) {
            throw new NotFoundException('Assessment result not found');
        }

        if (result.userId !== userId) {
            throw new ForbiddenException('You can only view your own results');
        }

        if (result.status !== AssessmentStatus.COMPLETED) {
            throw new BadRequestException('Assessment not completed yet');
        }

        return {
            id: result.id,
            assessmentTitle: result.assessment.title,
            assessmentType: result.assessment.type,
            completedAt: result.completedAt,
            totalScore: result.totalScore,
            aptitudeScores: result.aptitudeScores,
            riasecScores: result.riasecScores,
            riasecCode: result.riasecCode,
            employabilityScores: result.employabilityScores,
            personalityScores: result.personalityScores,
            clarityIndex: result.clarityIndex,
            careerMatches: result.careerMatches,
            sectorMatches: (result as any).sectorMatches,
            aiSummary: result.aiSummary,
            aiInsights: result.aiInsights,
            academicReadinessIndex: result.academicReadinessIndex,
            performanceLevel: result.performanceLevel,
            topStrengths: result.topStrengths,
            areasForImprovement: result.areasForImprovement,
        };
    }

    /**
     * Get all assessments for a user
     */
    async getUserAssessments(userId: string) {
        return this.prisma.userAssessment.findMany({
            where: { userId },
            include: {
                assessment: {
                    select: { title: true, type: true },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
}
