import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AiAnalysisService } from '../ai-analysis/ai-analysis.service';
import * as React from 'react';
import { renderToFile } from '@react-pdf/renderer';
import * as fs from 'fs';
import * as path from 'path';
import { LoggerService } from '../logger/logger.service';
import { ReportData, StudentReportData } from './pdf-styles';
import { StudentReportDocument } from './student-report';
import { JobSeekerReportDocument } from './job-seeker-report';

@Injectable()
export class ReportsService {
    private readonly reportsDir: string;

    constructor(
        private prisma: PrismaService,
        private logger: LoggerService,
        private aiAnalysisService: AiAnalysisService,
    ) {
        this.logger.setContext('ReportsService');
        this.reportsDir = path.join(process.cwd(), 'reports');
        if (!fs.existsSync(this.reportsDir)) {
            fs.mkdirSync(this.reportsDir, { recursive: true });
        }
    }

    async generateReport(userAssessmentId: string): Promise<string> {
        const assessment = await this.prisma.userAssessment.findUnique({
            where: { id: userAssessmentId },
            include: {
                user: {
                    include: {
                        jobSeekerProfile: true,
                        studentProfile: true,
                    },
                },
                assessment: true,
            },
        });

        if (!assessment) {
            throw new NotFoundException('Assessment not found');
        }

        const isStudentAssessment = assessment.assessment.allowedRoles.includes('STUDENT')
            && !assessment.assessment.allowedRoles.includes('JOB_SEEKER');

        let assessmentData = assessment as any;

        // Re-generate AI insights if they are stale (missing new comprehensive fields)
        const aiInsights = assessmentData.aiInsights as any;
        const isStaleJobSeekerAI = !isStudentAssessment && aiInsights && (
            !aiInsights.detailedTraitInterpretation ||
            !aiInsights.developmentRoadmap ||
            !aiInsights.employabilitySummary ||
            (aiInsights.employabilitySummary && aiInsights.employabilitySummary.length < 100)
        );
        const isStaleStudentAI = isStudentAssessment && aiInsights && !aiInsights.sectorRecommendations;

        if (isStaleJobSeekerAI) {
            this.logger.log(`Detected stale AI insights for ${userAssessmentId}, regenerating comprehensive text...`);
            try {
                const scores = {
                    aptitude: assessmentData.aptitudeScores || {},
                    riasec: assessmentData.riasecScores || { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 },
                    riasecCode: assessmentData.riasecCode || 'SCA',
                    employability: assessmentData.employabilityScores || {},
                    personality: assessmentData.personalityScores || {},
                    clarityIndex: assessmentData.clarityIndex || 50,
                };
                const careers = (assessmentData.careerMatches || []) as { title: string; matchScore: number }[];
                const freshAI = this.aiAnalysisService.getFallbackAnalysis(scores as any, careers as any);
                await this.aiAnalysisService.saveAnalysis(userAssessmentId, freshAI);
                assessmentData = { ...assessmentData, aiInsights: freshAI };
                this.logger.log(`AI insights regenerated successfully for ${userAssessmentId}`);
            } catch (err) {
                this.logger.warn(`Failed to regenerate AI insights: ${err instanceof Error ? err.stack : err}`);
            }
        }

        if (isStaleStudentAI) {
            this.logger.log(`Detected stale student AI insights for ${userAssessmentId}, regenerating with Gemini...`);
            try {
                const studentProfile = assessment.user.studentProfile;
                const freshAI = await this.aiAnalysisService.generateStudentAnalysis(
                    {
                        fullName: studentProfile?.fullName || 'Student',
                        grade: studentProfile?.grade || undefined,
                        schoolName: studentProfile?.schoolName || undefined,
                        location: studentProfile?.location || undefined,
                    },
                    assessmentData.aptitudeScores || {},
                    assessmentData.riasecScores || {},
                    assessmentData.riasecCode || 'RIA',
                    assessmentData.personalityScores || {},
                    assessmentData.employabilityScores || {},
                );
                if (freshAI) {
                    await this.aiAnalysisService.saveStudentAnalysis(userAssessmentId, freshAI);
                    assessmentData = { ...assessmentData, aiInsights: freshAI };
                    this.logger.log(`Student AI insights regenerated successfully for ${userAssessmentId}`);
                }
            } catch (err) {
                this.logger.warn(`Failed to regenerate student AI insights: ${err instanceof Error ? err.stack : err}`);
            }
        }

        // ─── Malayalam Content ─────────────────────────────────────────────────
        const currentAI = assessmentData.aiInsights as Record<string, any> | null;

        if (isStudentAssessment && currentAI && !currentAI.analysis_ml) {
            // For students: generate native Malayalam career analysis narrative
            this.logger.log(`Generating native Malayalam analysis for ${userAssessmentId}...`);
            try {
                const studentProfile = assessment.user.studentProfile;
                const mlAnalysis = await this.aiAnalysisService.generateStudentMalayalamAnalysis(
                    {
                        fullName: studentProfile?.fullName || 'Student',
                        grade: studentProfile?.grade || undefined,
                        schoolName: studentProfile?.schoolName || undefined,
                        location: studentProfile?.location || undefined,
                    },
                    assessmentData.aptitudeScores || {},
                    assessmentData.riasecScores || {},
                    assessmentData.riasecCode || 'RIA',
                    assessmentData.personalityScores || {},
                    assessmentData.employabilityScores || {},
                    assessmentData.careerMatches || [],
                    assessmentData.sectorMatches || [],
                );
                if (mlAnalysis) {
                    const mergedInsights = { ...currentAI, ...mlAnalysis };
                    await this.prisma.userAssessment.update({
                        where: { id: userAssessmentId },
                        data: { aiInsights: JSON.parse(JSON.stringify(mergedInsights)) },
                    });
                    assessmentData = { ...assessmentData, aiInsights: mergedInsights };
                    this.logger.log(`Native Malayalam analysis cached for ${userAssessmentId}`);
                }
            } catch (err) {
                this.logger.warn(`Malayalam analysis failed (non-fatal): ${err instanceof Error ? err.message : err}`);
            }
        } else if (!isStudentAssessment && currentAI && !currentAI.employabilitySummary_ml) {
            // For job seekers: keep existing field-by-field translation approach
            this.logger.log(`Generating Malayalam translations for ${userAssessmentId}...`);
            try {
                const mlTranslations = await this.aiAnalysisService.translateInsightsToMalayalam(
                    currentAI, 'jobseeker',
                );
                if (Object.keys(mlTranslations).length > 0) {
                    const mergedInsights = { ...currentAI, ...mlTranslations };
                    await this.prisma.userAssessment.update({
                        where: { id: userAssessmentId },
                        data: { aiInsights: JSON.parse(JSON.stringify(mergedInsights)) },
                    });
                    assessmentData = { ...assessmentData, aiInsights: mergedInsights };
                    this.logger.log(`Malayalam translations cached for ${userAssessmentId} (${Object.keys(mlTranslations).length} fields)`);
                }
            } catch (err) {
                this.logger.warn(`Malayalam translation failed (non-fatal): ${err instanceof Error ? err.message : err}`);
            }
        }

        let pdfDocument: any;
        let reportName: string;

        if (isStudentAssessment) {
            const studentProfile = assessment.user.studentProfile;
            const studentReportData: StudentReportData = {
                studentName: studentProfile?.fullName || 'Student',
                grade: studentProfile?.grade || undefined,
                schoolName: studentProfile?.schoolName || undefined,
                gender: studentProfile?.gender || undefined,
                location: studentProfile?.location || undefined,
                assessmentDate: assessmentData.completedAt || new Date(),
                aptitudeScores: (assessmentData.aptitudeScores as Record<string, { correct: number; total: number; percentage: number }>) || {},
                weightedScore: assessmentData.totalScore || 0,
                performanceLevel: assessmentData.performanceLevel || 'AVERAGE',
                academicReadinessIndex: assessmentData.academicReadinessIndex || 50,
                topStrengths: assessmentData.topStrengths || [],
                areasForImprovement: assessmentData.areasForImprovement || [],
                riasecCode: assessmentData.riasecCode || undefined,
                riasecScores: (assessmentData.riasecScores as Record<string, number>) || undefined,
                personalityScores: (assessmentData.personalityScores as Record<string, { score: number; maxScore: number; level: string }>) || undefined,
                readinessScores: (assessmentData.employabilityScores as Record<string, { score: number; maxScore: number; percentage: number }>) || undefined,
                careerMatches: (assessmentData.careerMatches as { title: string; matchScore: number }[]) || undefined,
                sectorMatches: (assessmentData.sectorMatches as { name: string; matchScore: number }[]) || undefined,
                aiInsights: assessmentData.aiInsights as any,
            };

            pdfDocument = React.createElement(StudentReportDocument, { data: studentReportData });
            reportName = studentReportData.studentName;
        } else {
            const profile = assessment.user.jobSeekerProfile;
            const reportData: ReportData = {
                candidateName: profile?.fullName || 'Candidate',
                age: profile?.dateOfBirth
                    ? Math.floor((Date.now() - new Date(profile.dateOfBirth).getTime()) / (365.25 * 24 * 60 * 60 * 1000))
                    : undefined,
                gender: profile?.gender || undefined,
                location: profile?.location || undefined,
                education: profile?.educationLevel || undefined,
                currentRole: profile?.currentStatus || undefined,
                assessmentDate: assessmentData.completedAt || new Date(),
                aptitudeScores: (assessmentData.aptitudeScores as Record<string, { percentage: number }>) || {},
                riasecScores: (assessmentData.riasecScores as any) || { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 },
                riasecCode: assessmentData.riasecCode || 'SCA',
                employabilityScores: (assessmentData.employabilityScores as Record<string, { percentage: number }>) || {},
                personalityScores: (assessmentData.personalityScores as Record<string, { average: number }>) || {},
                clarityIndex: assessmentData.clarityIndex || 50,
                aiInsights: assessmentData.aiInsights as any,
                careerMatches: (assessmentData.careerMatches as { title: string; matchScore: number }[]) || [],
                sectorMatches: assessmentData.sectorMatches as any,
            };

            pdfDocument = React.createElement(JobSeekerReportDocument, { data: reportData });
            reportName = reportData.candidateName;
        }

        const startTime = Date.now();
        const reportType = isStudentAssessment ? 'student' : 'employability';
        const fileName = `pragya_${reportType}_report_${userAssessmentId}_${Date.now()}.pdf`;
        const filePath = path.join(this.reportsDir, fileName);

        await renderToFile(pdfDocument, filePath);

        const fileSize = fs.statSync(filePath).size;
        const duration = Date.now() - startTime;

        await this.prisma.userAssessment.update({
            where: { id: userAssessmentId },
            data: {
                reportUrl: filePath,
                reportGeneratedAt: new Date(),
            } as any,
        });

        this.logger.logBusinessEvent('PDF_REPORT_GENERATED', {
            userAssessmentId,
            reportType,
            name: reportName,
            filePath,
            fileSizeKB: Math.round(fileSize / 1024),
            duration: `${duration}ms`,
        });

        return filePath;
    }

    async getReportPath(userAssessmentId: string, userId: string): Promise<string> {
        const assessment = await this.prisma.userAssessment.findUnique({
            where: { id: userAssessmentId },
        });

        if (!assessment) {
            throw new NotFoundException('Assessment not found');
        }

        if (assessment.userId !== userId) {
            throw new NotFoundException('Assessment not found');
        }

        // Always generate a fresh report to ensure latest layout and AI text
        this.logger.log(`Generating fresh report for assessment ${userAssessmentId}`);
        return this.generateReport(userAssessmentId);
    }
}
