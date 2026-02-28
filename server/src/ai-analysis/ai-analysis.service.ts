import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { ComprehensiveScores, StudentRiasecScores, StudentPersonalityScores, StudentReadinessScores, AptitudeScores } from '../assessments/scoring.service';
import { SectorMatchResult } from '../assessments/sector-matching.service';
import { CareerMatch } from '../assessments/careers.service';
import { LoggerService } from '../logger/logger.service';
import { buildJobSeekerPrompt } from './prompts/job-seeker.prompt';
import { buildJobSeekerMalayalamPrompt } from './prompts/jobseeker-ml.prompt';
import { buildStudentPrompt as buildStudentPromptFn } from './prompts/student.prompt';
import { buildStudentMalayalamPrompt } from './prompts/student-ml.prompt';

/**
 * AI Analysis Service using Google Gemini
 * Generates personalized insights and narratives for assessment results
 */

export interface PerformanceDimension {
    score: number;
    description: string;
}

export interface AiAnalysisResult {
    professionalPersona?: {
        title: string;
        description: string;
        superpower: string;
    };
    performanceDimensions?: {
        cognitiveAgility: PerformanceDimension;
        professionalReadiness: PerformanceDimension;
        careerAlignment: PerformanceDimension;
        interpersonalImpact: PerformanceDimension;
        growthTrajectory: PerformanceDimension;
    };
    employabilitySummary: string;
    aptitudeAnalysis: string;
    careerInterestAlignment: string;
    personalitySnapshot: string;
    skillReadiness: string;
    sectorRecommendations?: {
        primarySectors: { name: string; explanation: string }[];
        growthSectors: { name: string; explanation: string }[];
        sectorsToAvoid: string;
    };
    careerRecommendations: {
        primaryRoles: string[];
        growthRoles: string[];
        rolesToAvoid: string;
    };
    developmentGuidance?: string;  // Legacy — kept for backward compatibility
    developmentRoadmap?: string;   // New — thorough development plan
    clarityIndex: {
        level: 'LOW' | 'MEDIUM' | 'HIGH';
        justification: string;
    };
    detailedTraitInterpretation?: Record<string, string>;
}

export interface CandidateProfile {
    fullName: string;
    age?: number;
    gender?: string;
    location?: string;
    education?: string;
    currentRole?: string;
}

// Student-specific AI analysis result (comprehensive 4-module)
export interface StudentAiAnalysisResult {
    studentPersona: {
        title: string;      // e.g., "The Logical Architect"
        description: string; // "You tackle problems with logic and structure..."
        superpower: string;  // "Visualizing complex systems"
    };
    overallSummary: string;
    strengthsAnalysis: string;
    areasForGrowth: string;
    riasecAnalysis: string;         // Holland Code interpretation
    personalityAnalysis: string;    // Personality trait interpretation
    readinessAnalysis: string;      // Skill & career readiness interpretation
    academicStreams: {
        recommended: string[];
        reasoning: string;
    };
    careerGuidance: {
        suggestedCareers: {
            role: string;
            fitReason: string; // "Fits your High Logic + Moderate Social..."
        }[];
        skillsToDevelop: string[];
    };
    sectorRecommendations?: {
        topSectors: string[];
        reasoning: string;
    };
    studyTips: string;
    nextSteps: string;
}

// Student profile for AI context
export interface StudentProfile {
    fullName: string;
    grade?: string;
    schoolName?: string;
    location?: string;
}

@Injectable()
export class AiAnalysisService {
    private readonly apiKey: string;
    private readonly apiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

    constructor(
        private prisma: PrismaService,
        private configService: ConfigService,
        private logger: LoggerService,
    ) {
        this.logger.setContext('AiAnalysisService');
        this.apiKey = this.configService.get<string>('GEMINI_API_KEY') || '';
        if (!this.apiKey) {
            this.logger.warn('GEMINI_API_KEY not configured - AI analysis will be disabled');
        }
    }

    /** Fetch from Gemini with a 15-second timeout */
    private async geminiRequest(body: object): Promise<Response> {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000);
        try {
            const response = await fetch(`${this.apiUrl}?key=${this.apiKey}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                signal: controller.signal,
                body: JSON.stringify(body),
            });
            return response;
        } finally {
            clearTimeout(timeoutId);
        }
    }

    /**
     * Generate comprehensive AI analysis for assessment results
     */
    async generateAnalysis(
        profile: CandidateProfile,
        scores: ComprehensiveScores,
        careerMatches: CareerMatch[],
        sectorMatches?: SectorMatchResult,
    ): Promise<AiAnalysisResult | null> {
        if (!this.apiKey) {
            this.logger.warn('AI analysis skipped - no API key configured');
            return null;
        }

        const startTime = Date.now();
        const prompt = this.buildPrompt(profile, scores, careerMatches, sectorMatches);

        this.logger.logBusinessEvent('GEMINI_API_REQUEST', {
            candidate: profile.fullName,
            hollandCode: scores.riasecCode,
            promptLength: prompt.length,
        });

        try {
            const response = await this.geminiRequest({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 4096,
                    responseMimeType: 'application/json',
                },
            });

            const duration = Date.now() - startTime;

            if (!response.ok) {
                const error = await response.text();
                this.logger.error(`Gemini API error: ${error}`, undefined, 'AiAnalysisService');
                this.logger.logSecurityEvent('GEMINI_API_ERROR', {
                    severity: 'medium',
                    details: {
                        statusCode: response.status,
                        error: error.substring(0, 200),
                        duration: `${duration}ms`,
                    },
                });
                return this.getFallbackAnalysis(scores, careerMatches);
            }

            const data = await response.json();
            const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;

            if (!generatedText) {
                this.logger.warn('Empty response from Gemini');
                return this.getFallbackAnalysis(scores, careerMatches);
            }

            // Parse JSON response
            const analysis = JSON.parse(generatedText) as AiAnalysisResult;

            this.logger.logBusinessEvent('GEMINI_API_SUCCESS', {
                candidate: profile.fullName,
                duration: `${duration}ms`,
                responseLength: generatedText.length,
                clarityLevel: analysis.clarityIndex?.level,
            });

            return analysis;
        } catch (error) {
            const duration = Date.now() - startTime;
            this.logger.error(`AI analysis failed: ${error}`, undefined, 'AiAnalysisService');
            this.logger.logSecurityEvent('GEMINI_API_EXCEPTION', {
                severity: 'medium',
                details: {
                    error: String(error).substring(0, 200),
                    duration: `${duration}ms`,
                },
            });
            return this.getFallbackAnalysis(scores, careerMatches);
        }
    }

    /**
     * Build Gemini prompt with assessment data
     * Delegates to extracted prompt builder for maintainability
     */
    private buildPrompt(
        profile: CandidateProfile,
        scores: ComprehensiveScores,
        careerMatches: CareerMatch[],
        sectorMatches?: SectorMatchResult,
    ): string {
        return buildJobSeekerPrompt(profile, scores, careerMatches, sectorMatches);
    }

    /**
     * Fallback analysis when AI is unavailable
     * Generates comprehensive, personalized narratives from actual score data
     */
    public getFallbackAnalysis(
        scores: ComprehensiveScores,
        careerMatches: CareerMatch[],
    ): AiAnalysisResult {
        const riasecNames: Record<string, string> = {
            R: 'Realistic',
            I: 'Investigative',
            A: 'Artistic',
            S: 'Social',
            E: 'Enterprising',
            C: 'Conventional',
        };
        const riasecDescriptions: Record<string, string> = {
            R: 'hands-on, practical problem-solving',
            I: 'analytical thinking and research',
            A: 'creative expression and innovation',
            S: 'helping others and interpersonal connection',
            E: 'leadership, persuasion, and entrepreneurship',
            C: 'organization, structure, and systematic processes',
        };

        const topCodes = scores.riasecCode.split('').map(c => riasecNames[c] || c);
        const topCodeDescriptions = scores.riasecCode.split('').map(c => riasecDescriptions[c] || '');
        const topCareers = careerMatches.slice(0, 4).map(c => c.title);
        const growthCareers = careerMatches.slice(4, 7).map(c => c.title);

        let clarityLevel: 'LOW' | 'MEDIUM' | 'HIGH';
        if (scores.clarityIndex >= 70) clarityLevel = 'HIGH';
        else if (scores.clarityIndex >= 40) clarityLevel = 'MEDIUM';
        else clarityLevel = 'LOW';

        const aptPct = scores.aptitude.overall.percentage;
        const empPct = scores.employability.overall.percentage;

        // Sort aptitude sections by score to identify strengths and weaknesses
        const aptSections = Object.entries(scores.aptitude)
            .filter(([key]) => key !== 'overall')
            .map(([name, data]: [string, any]) => ({ name, pct: data.percentage }))
            .sort((a, b) => b.pct - a.pct);
        const topAptitude = aptSections.slice(0, 2);
        const weakAptitude = aptSections.slice(-2);

        // Sort employability sections
        const empSections = Object.entries(scores.employability)
            .filter(([key]) => key !== 'overall')
            .map(([name, data]: [string, any]) => ({ name, pct: data.percentage }))
            .sort((a, b) => b.pct - a.pct);
        const topEmp = empSections.slice(0, 2);
        const weakEmp = empSections.slice(-2);

        // Sort personality traits
        const personalityEntries = Object.entries(scores.personality)
            .map(([trait, data]: [string, any]) => ({ trait, avg: data.average }))
            .sort((a, b) => b.avg - a.avg);
        const topTraits = personalityEntries.slice(0, 2);
        const developingTraits = personalityEntries.slice(-2);
        const avgPers = personalityEntries.length > 0
            ? personalityEntries.reduce((sum, t) => sum + t.avg, 0) / personalityEntries.length
            : 0;

        // Composite score (normalize personality: min=1, max=5 → [0,100])
        const compositeScore = Math.round(aptPct * 0.35 + empPct * 0.35 + ((avgPers - 1) / 4) * 100 * 0.30);

        // Dynamic persona title
        const personaTitle = compositeScore >= 75 ? 'The Strategic Achiever'
            : compositeScore >= 60 ? 'The Emerging Professional'
                : compositeScore >= 45 ? 'The Aspiring Builder'
                    : 'The Curious Explorer';

        return {
            professionalPersona: {
                title: personaTitle,
                description: `Your assessment reveals a distinctive blend of ${topCodes[0]} and ${topCodes[1]} orientations, meaning you are naturally drawn to ${topCodeDescriptions[0]} and ${topCodeDescriptions[1]}. With an overall aptitude score of ${aptPct}% and employability readiness at ${empPct}%, you are ${compositeScore >= 60 ? 'building a strong professional foundation' : 'at an exciting stage of professional development with clear growth pathways ahead'}. Your strongest cognitive area is ${topAptitude[0].name} (${topAptitude[0].pct}%), which reflects your natural ability to process and apply information in this domain.`,
                superpower: `${topAptitude[0].name} — scoring ${topAptitude[0].pct}% in this area demonstrates a clear cognitive strength`,
            },
            performanceDimensions: {
                cognitiveAgility: {
                    score: Math.min(10, Math.round(aptPct / 10)),
                    description: `Your cognitive aptitude score of ${aptPct}% reflects ${aptPct >= 60 ? 'strong analytical capabilities' : 'developing reasoning skills with room for growth'}. Your strongest area is ${topAptitude[0].name} at ${topAptitude[0].pct}%, while ${weakAptitude[0].name} at ${weakAptitude[0].pct}% offers the most opportunity for improvement.`,
                },
                professionalReadiness: {
                    score: Math.min(10, Math.round(empPct / 10)),
                    description: `With an employability score of ${empPct}%, you demonstrate ${empPct >= 60 ? 'solid workplace competencies' : 'foundational professional skills that are ready for further development'}. ${topEmp[0].name} (${topEmp[0].pct}%) is your strongest professional skill area.`,
                },
                careerAlignment: {
                    score: Math.min(10, Math.round(scores.clarityIndex / 10)),
                    description: `Your Career Clarity Index of ${scores.clarityIndex}/100 indicates ${clarityLevel.toLowerCase()} clarity in career direction. Your ${topCodes[0]}-${topCodes[1]}-${topCodes[2]} Holland Code pattern ${scores.clarityIndex >= 60 ? 'shows focused career interests' : 'suggests you are still exploring your professional identity, which is perfectly normal'}.`,
                },
                interpersonalImpact: {
                    score: Math.min(10, Math.round(((avgPers - 1) / 4) * 10)),
                    description: `Your personality assessment shows an average trait score of ${avgPers.toFixed(1)}/5.0, with ${topTraits[0].trait} (${topTraits[0].avg.toFixed(1)}/5) as your standout interpersonal quality. ${avgPers >= 3.5 ? 'This indicates strong social and collaborative skills.' : 'There is good potential to further develop interpersonal effectiveness.'}`,
                },
                growthTrajectory: {
                    score: Math.min(10, Math.round(compositeScore / 10)),
                    description: `Your composite performance score of ${compositeScore}/100 (combining aptitude, employability, and personality) places you in the ${compositeScore >= 70 ? 'high-growth' : compositeScore >= 50 ? 'moderate-growth' : 'developing'} trajectory. Targeted improvement in ${weakAptitude[0].name} and ${weakEmp[0].name} would have the highest impact on your overall profile.`,
                },
            },
            employabilitySummary: `Your overall employability profile presents a composite score of ${compositeScore}/100, combining cognitive aptitude (${aptPct}%), employability skills (${empPct}%), and personality fit (${Math.round(((avgPers - 1) / 4) * 100)}%). Your strongest cognitive ability lies in ${topAptitude[0].name} (${topAptitude[0].pct}%), followed by ${topAptitude[1].name} (${topAptitude[1].pct}%), indicating ${topAptitude[0].pct >= 50 ? 'a strong foundation in these reasoning domains' : 'developing competence with clear pathways for growth'}. On the employability front, ${topEmp[0].name} (${topEmp[0].pct}%) stands out as your most developed professional competency. Your Holland Code of ${scores.riasecCode} (${topCodes.join('-')}) suggests you thrive in environments that emphasize ${topCodeDescriptions[0]} and ${topCodeDescriptions[1]}. To maximize your career potential, prioritizing development in ${weakAptitude[0].name} and ${weakEmp[0].name} would create the most significant improvement in your overall readiness.`,

            aptitudeAnalysis: `Your cognitive aptitude assessment reveals a differentiated profile across reasoning domains, with an overall score of ${aptPct}%. Your strongest area is ${topAptitude[0].name} at ${topAptitude[0].pct}%, demonstrating ${topAptitude[0].pct >= 50 ? 'solid capability' : 'emerging competence'} in this domain. ${topAptitude[1].name} follows at ${topAptitude[1].pct}%, rounding out your ${topAptitude[0].pct >= 40 ? 'core cognitive strengths' : 'developing skill set'}. On the other end, ${weakAptitude[0].name} (${weakAptitude[0].pct}%) and ${weakAptitude[1].name} (${weakAptitude[1].pct}%) represent your primary areas for cognitive development. This pattern suggests you may find tasks requiring ${topAptitude[0].name.toLowerCase().replace(/&/g, 'and')} more intuitive, while tasks relying on ${weakAptitude[0].name.toLowerCase().replace(/&/g, 'and')} may require more deliberate effort and practice.`,

            careerInterestAlignment: `Your Holland Code ${scores.riasecCode} reveals a primary orientation toward ${topCodes[0]} (${riasecDescriptions[scores.riasecCode[0]]}), supported by ${topCodes[1]} (${riasecDescriptions[scores.riasecCode[1]]}) and ${topCodes[2]} (${riasecDescriptions[scores.riasecCode[2]]}) tendencies. This three-letter code combination indicates you are most fulfilled in work environments that combine ${topCodeDescriptions[0]} with ${topCodeDescriptions[1]}. Your RIASEC scores show ${scores.riasecCode[0]} at ${scores.riasec[scores.riasecCode[0] as keyof typeof scores.riasec]}/32, ${scores.riasecCode[1]} at ${scores.riasec[scores.riasecCode[1] as keyof typeof scores.riasec]}/32, and ${scores.riasecCode[2]} at ${scores.riasec[scores.riasecCode[2] as keyof typeof scores.riasec]}/32. Careers in sectors that align with this profile include ${topCareers.slice(0, 3).join(', ')}, among others, where your natural interests and aptitude intersect most productively.`,

            personalitySnapshot: `Your personality profile reveals several distinctive traits that shape how you engage in professional environments. Your strongest trait is ${topTraits[0].trait} (${topTraits[0].avg.toFixed(1)}/5.0), indicating a natural tendency toward ${topTraits[0].avg >= 3.5 ? 'high reliability and consistency in this area' : 'developing patterns that can be further strengthened'}. ${topTraits[1].trait} (${topTraits[1].avg.toFixed(1)}/5.0) is another notable strength, suggesting ${topTraits[1].avg >= 3.5 ? 'well-developed professional maturity' : 'a solid foundation for growth'}. On the development side, ${developingTraits[0].trait} (${developingTraits[0].avg.toFixed(1)}/5.0) could benefit from targeted attention, particularly in high-pressure work situations. Overall, your average personality score of ${avgPers.toFixed(1)}/5.0 reflects a ${avgPers >= 4.0 ? 'highly mature' : avgPers >= 3.0 ? 'balanced and adaptable' : 'developing'} professional temperament.`,

            skillReadiness: `Your employability skills assessment shows an overall readiness of ${empPct}%, with strengths in ${topEmp[0].name} (${topEmp[0].pct}%) and ${topEmp[1].name} (${topEmp[1].pct}%). These areas indicate ${empPct >= 60 ? 'practical workplace competencies that employers actively seek' : 'foundational skills that are ready for acceleration with focused effort'}. Areas requiring further development include ${weakEmp[0].name} (${weakEmp[0].pct}%) and ${weakEmp[1].name} (${weakEmp[1].pct}%), which are common growth areas and can be improved through structured practice, mentoring, or short-term training programs. Strengthening these skills would significantly enhance your overall employability profile and confidence in professional settings.`,

            careerRecommendations: {
                primaryRoles: topCareers.length > 0 ? topCareers : ['Customer Service', 'Administrative Support', 'Sales Associate'],
                growthRoles: growthCareers.length > 0 ? growthCareers : ['Team Lead', 'Specialist Roles'],
                rolesToAvoid: `Roles that heavily depend on ${weakAptitude[0].name.toLowerCase()} and ${weakAptitude[1].name.toLowerCase()} may present initial challenges without additional preparation. Consider building these skills before pursuing roles in these areas.`,
            },
            sectorRecommendations: {
                primarySectors: [
                    { name: `${topCodes[0]}-aligned sectors`, explanation: `Your strong ${topCodes[0]} (${riasecDescriptions[scores.riasecCode[0]]}) orientation suggests natural fit in industries that value these competencies. Your ${topAptitude[0].name} strength further supports success in this sector.` },
                    { name: `${topCodes[1]}-aligned sectors`, explanation: `Your secondary ${topCodes[1]} interest combined with ${topEmp[0].name} skills creates a strong foundation for roles in this area.` },
                ],
                growthSectors: [
                    { name: `${topCodes[2]}-adjacent sectors`, explanation: `With targeted skill development, your ${topCodes[2]} tendencies could open doors in these growing industries.` },
                ],
                sectorsToAvoid: `Sectors that primarily require strong ${weakAptitude[0].name.toLowerCase()} skills may feel challenging until these areas are further developed.`,
            },
            developmentGuidance: `Focus on strengthening ${weakAptitude[0].name} and ${weakEmp[0].name} in the short term. Consider certification programs aligned with ${topCodes[0]} interests for career advancement.`,
            developmentRoadmap: `In the immediate term (1-3 months), focus on building your ${weakAptitude[0].name} skills through online courses or practice exercises — even 20 minutes of daily practice can yield significant improvement. Simultaneously, work on ${weakEmp[0].name} by seeking opportunities for real-world application, whether through volunteer work, part-time roles, or structured projects. In the short term (3-6 months), pursue a certification or training program aligned with your ${topCodes[0]} interests — this will formalize your natural strengths and make you more competitive. Look for mentors or professionals working in ${topCareers[0] || 'your target field'} who can provide guidance and industry insights. Over the medium term (6-12 months), aim to gain practical experience through internships, freelance projects, or entry-level positions in your target sector. Continue building your ${developingTraits[0].trait.toLowerCase()} through mindful practice and seek feedback regularly. By following this structured approach, your composite score of ${compositeScore}/100 has strong potential to rise significantly.`,

            clarityIndex: {
                level: clarityLevel,
                justification: `Your Career Clarity Index of ${scores.clarityIndex}/100 reflects ${clarityLevel === 'HIGH' ? 'a focused and consistent set of career interests that point clearly toward specific professional pathways' : clarityLevel === 'MEDIUM' ? 'a developing sense of career direction with some consistency in your interests — further exploration and informational interviews can help sharpen your focus' : 'an early-stage exploration of career options, which is a natural part of the career discovery process — consider career counseling, job shadowing, or internships to help clarify your direction'}.`,
            },
            detailedTraitInterpretation: Object.fromEntries(
                personalityEntries.map(({ trait, avg }) => [
                    trait,
                    avg >= 4.0
                        ? `Your score of ${avg.toFixed(1)}/5.0 in ${trait} is a notable strength. This indicates you consistently demonstrate this quality in professional and personal settings, which colleagues and employers are likely to recognize and value.`
                        : avg >= 3.0
                            ? `Your ${trait} score of ${avg.toFixed(1)}/5.0 reflects a balanced, average level of this quality. You demonstrate this trait reliably in most situations, with room to develop it further for high-pressure or leadership scenarios.`
                            : `Your score of ${avg.toFixed(1)}/5.0 in ${trait} suggests this is a developing area. With conscious effort and practice — such as setting specific goals around this trait — you can strengthen it meaningfully over time.`
                ]),
            ),
        };
    }

    /**
     * Store AI analysis results in database
     */
    async saveAnalysis(
        userAssessmentId: string,
        analysis: AiAnalysisResult,
    ): Promise<void> {
        await this.prisma.userAssessment.update({
            where: { id: userAssessmentId },
            data: {
                aiSummary: analysis.employabilitySummary,
                aiInsights: JSON.parse(JSON.stringify({
                    professionalPersona: analysis.professionalPersona,
                    performanceDimensions: analysis.performanceDimensions,
                    aptitudeAnalysis: analysis.aptitudeAnalysis,
                    careerInterestAlignment: analysis.careerInterestAlignment,
                    personalitySnapshot: analysis.personalitySnapshot,
                    skillReadiness: analysis.skillReadiness,
                    sectorRecommendations: analysis.sectorRecommendations,
                    careerRecommendations: analysis.careerRecommendations,
                    developmentGuidance: analysis.developmentGuidance,
                    developmentRoadmap: analysis.developmentRoadmap,
                    clarityIndex: analysis.clarityIndex,
                    detailedTraitInterpretation: analysis.detailedTraitInterpretation,
                })),
                aiAnalyzedAt: new Date(),
            },
        });

        this.logger.log(`AI analysis saved for assessment ${userAssessmentId}`);
    }

    /**
     * Generate AI analysis for student 4-module assessment
     * Modules: Aptitude, RIASEC, Personality, Readiness
     */
    async generateStudentAnalysis(
        profile: StudentProfile,
        aptitudeScores: AptitudeScores,
        riasecScores: StudentRiasecScores,
        riasecCode: string,
        personalityScores: StudentPersonalityScores,
        readinessScores: StudentReadinessScores,
    ): Promise<StudentAiAnalysisResult | null> {
        if (!this.apiKey) {
            this.logger.warn('AI analysis skipped - no API key configured');
            return this.getStudentFallbackAnalysis(aptitudeScores, riasecScores, riasecCode, personalityScores, readinessScores);
        }

        const startTime = Date.now();
        const prompt = this.buildStudentPrompt(profile, aptitudeScores, riasecScores, riasecCode, personalityScores, readinessScores);

        this.logger.logBusinessEvent('GEMINI_STUDENT_API_REQUEST', {
            student: profile.fullName,
            hollandCode: riasecCode,
            promptLength: prompt.length,
        });

        try {
            const response = await this.geminiRequest({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 4096,
                    responseMimeType: 'application/json',
                },
            });

            const duration = Date.now() - startTime;

            if (!response.ok) {
                const error = await response.text();
                this.logger.error(`Gemini API error: ${error}`, undefined, 'AiAnalysisService');
                return this.getStudentFallbackAnalysis(aptitudeScores, riasecScores, riasecCode, personalityScores, readinessScores);
            }

            const data = await response.json();
            const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;

            if (!generatedText) {
                this.logger.warn('Empty response from Gemini');
                return this.getStudentFallbackAnalysis(aptitudeScores, riasecScores, riasecCode, personalityScores, readinessScores);
            }

            const analysis = JSON.parse(generatedText) as StudentAiAnalysisResult;

            this.logger.logBusinessEvent('GEMINI_STUDENT_API_SUCCESS', {
                student: profile.fullName,
                hollandCode: riasecCode,
                duration: `${duration}ms`,
            });

            return analysis;
        } catch (error) {
            this.logger.error(`Student AI analysis failed: ${error}`, undefined, 'AiAnalysisService');
            return this.getStudentFallbackAnalysis(aptitudeScores, riasecScores, riasecCode, personalityScores, readinessScores);
        }
    }

    /**
     * Build student-focused AI prompt (4-module)
     * Delegates to extracted prompt builder for maintainability
     */
    private buildStudentPrompt(
        profile: StudentProfile,
        aptitudeScores: AptitudeScores,
        riasecScores: StudentRiasecScores,
        riasecCode: string,
        personalityScores: StudentPersonalityScores,
        readinessScores: StudentReadinessScores,
    ): string {
        return buildStudentPromptFn(profile, aptitudeScores, riasecScores, riasecCode, personalityScores, readinessScores);
    }

    /**
     * Fallback analysis for students when AI is unavailable
     * Uses all 4 modules to generate meaningful narratives
     */
    private getStudentFallbackAnalysis(
        aptitudeScores: AptitudeScores,
        riasecScores: StudentRiasecScores,
        riasecCode: string,
        personalityScores: StudentPersonalityScores,
        readinessScores: StudentReadinessScores,
    ): StudentAiAnalysisResult {
        const riasecNames: Record<string, string> = {
            R: 'Realistic', I: 'Investigative', A: 'Artistic',
            S: 'Social', E: 'Enterprising', C: 'Conventional',
        };
        const riasecDescriptions: Record<string, string> = {
            R: 'hands-on, practical problem-solving',
            I: 'analytical thinking and research',
            A: 'creative expression and innovation',
            S: 'helping others and interpersonal connection',
            E: 'leadership, persuasion, and entrepreneurship',
            C: 'organization, structure, and systematic processes',
        };

        // Aptitude analysis
        const aptSections = Object.entries(aptitudeScores)
            .filter(([key]) => key !== 'overall')
            .map(([name, data]) => ({ name, pct: data.percentage }))
            .sort((a, b) => b.pct - a.pct);
        const topApt = aptSections.slice(0, 2);
        const weakApt = aptSections.slice(-2);
        const overallApt = aptitudeScores['overall']?.percentage || 0;

        // RIASEC analysis
        const topCodes = riasecCode.split('').map(c => riasecNames[c] || c);
        const topCodeDesc = riasecCode.split('').map(c => riasecDescriptions[c] || '');

        // Personality analysis
        const personalityEntries = Object.entries(personalityScores)
            .map(([trait, data]) => ({ trait, ...data }))
            .sort((a, b) => b.score - a.score);
        const topTraits = personalityEntries.slice(0, 2);
        const developingTraits = personalityEntries.filter(t => t.level === 'Emerging');

        // Readiness analysis
        const readinessEntries = Object.entries(readinessScores)
            .filter(([key]) => key !== 'overall')
            .map(([section, data]) => ({ section, ...data }))
            .sort((a, b) => b.percentage - a.percentage);
        const topReadiness = readinessEntries.slice(0, 2);
        const weakReadiness = readinessEntries.slice(-2);
        const overallReadiness = readinessScores['overall']?.percentage || 0;

        // Dynamic persona
        const compositeScore = Math.round(overallApt * 0.4 + overallReadiness * 0.3 + (topTraits[0]?.score / topTraits[0]?.maxScore || 0.5) * 100 * 0.3);
        const personaTitle = compositeScore >= 75 ? 'The Strategic Achiever'
            : compositeScore >= 60 ? 'The Emerging Professional'
                : compositeScore >= 45 ? 'The Aspiring Builder'
                    : 'The Curious Explorer';

        // Academic streams based on RIASEC + aptitude
        const streams: string[] = [];
        if (riasecCode.includes('I') || topApt.some(a => a.name.includes('Numerical') || a.name.includes('Abstract'))) {
            streams.push('Science with Mathematics');
        }
        if (riasecCode.includes('A') || topApt.some(a => a.name.includes('Verbal'))) {
            streams.push('Humanities & Liberal Arts');
        }
        if (riasecCode.includes('E') || riasecCode.includes('C')) {
            streams.push('Commerce & Business Studies');
        }
        if (riasecCode.includes('R') || topApt.some(a => a.name.includes('Spatial') || a.name.includes('Mechanical'))) {
            streams.push('Engineering & Technology');
        }
        if (riasecCode.includes('S')) {
            streams.push('Social Sciences & Education');
        }
        if (streams.length === 0) streams.push('Commerce', 'Humanities');

        // Career suggestions using RIASEC + aptitude
        const suggestedCareers = this.getSuggestedCareersFromRiasec(riasecCode, topApt.map(a => a.name));

        // Skill gaps from readiness
        const skillsToDevelop = weakReadiness.map(r => r.section);
        if (skillsToDevelop.length < 4) {
            if (developingTraits.length > 0) skillsToDevelop.push(`${developingTraits[0].trait} awareness`);
            skillsToDevelop.push('Critical Thinking');
        }

        // Sector recommendations based on RIASEC
        const sectorMap: Record<string, string[]> = {
            R: ['Manufacturing & Engineering', 'Construction & Infrastructure'],
            I: ['Technology & IT', 'Healthcare & Life Sciences', 'Research & Development'],
            A: ['Creative Arts & Design', 'Media & Entertainment'],
            S: ['Education & Training', 'Healthcare & Social Services', 'NGO & Community Development'],
            E: ['Business & Management', 'Finance & Banking', 'Sales & Marketing'],
            C: ['Government & Administration', 'Finance & Accounting', 'Logistics & Supply Chain'],
        };
        const topSectors = [...new Set(riasecCode.split('').flatMap(c => (sectorMap[c] || []).slice(0, 2)))].slice(0, 4);

        return {
            studentPersona: {
                title: personaTitle,
                description: `You have a ${topCodes[0]}-${topCodes[1]} orientation, meaning you are drawn to ${topCodeDesc[0]} and ${topCodeDesc[1]}. Your strongest cognitive area is ${topApt[0].name} (${topApt[0].pct}%), which reflects your natural ability to process information in this domain.`,
                superpower: `${topApt[0].name} combined with your ${topCodes[0]} interest`,
            },
            overallSummary: `Your comprehensive assessment reveals a ${topCodes.join('-')} career interest profile (Holland Code: ${riasecCode}) with an overall aptitude of ${overallApt}% and career readiness of ${overallReadiness}%. Your personality profile shows strong ${topTraits[0]?.trait || 'adaptive'} tendencies, and your top cognitive strength is ${topApt[0].name}. This combination points toward career paths that blend ${topCodeDesc[0]} with ${topCodeDesc[1]}.`,
            strengthsAnalysis: `Your top cognitive strengths are ${topApt[0].name} (${topApt[0].pct}%) and ${topApt[1].name} (${topApt[1].pct}%). On the personality front, your ${topTraits[0]?.trait || 'leading trait'} is rated "${topTraits[0]?.level || 'Strong'}", indicating maturity in this area. In career readiness, you score highest in ${topReadiness[0]?.section || 'general skills'} (${topReadiness[0]?.percentage || 0}%). Your ${riasecCode} Holland Code confirms interests that align well with these strengths.`,
            areasForGrowth: `Your developing areas include ${weakApt[0].name} (${weakApt[0].pct}%) in aptitude and ${weakReadiness[0]?.section || 'general readiness'} (${weakReadiness[0]?.percentage || 0}%) in career readiness. ${developingTraits.length > 0 ? `Your ${developingTraits[0].trait} trait is at the "Emerging" level, offering room for growth.` : 'Your personality traits are well-balanced.'} Focused practice in these areas will significantly strengthen your overall profile.`,
            riasecAnalysis: `Your Holland Code ${riasecCode} (${topCodes.join('-')}) reveals you are most fulfilled in environments that emphasize ${topCodeDesc[0]} and ${topCodeDesc[1]}. Your top RIASEC score is ${topCodes[0]} at ${riasecScores[riasecCode[0] as keyof StudentRiasecScores]}/8, suggesting a clear preference for ${riasecDescriptions[riasecCode[0]]}. This combination is well-suited for careers in ${topSectors.slice(0, 2).join(' and ')}.`,
            personalityAnalysis: `Your strongest personality trait is ${topTraits[0]?.trait || 'Responsibility'} (${topTraits[0]?.level || 'Strong'}), which indicates ${topTraits[0]?.level === 'Strong' ? 'a high level of maturity and consistency in this quality' : 'developing patterns that can be further strengthened'}. ${topTraits[1]?.trait || 'Your secondary trait'} is also notable at the "${topTraits[1]?.level || 'Moderate'}" level. Together, these traits suggest you work well in ${topTraits[0]?.trait?.includes('Team') ? 'collaborative settings' : topTraits[0]?.trait?.includes('Decision') ? 'structured decision-making roles' : 'disciplined environments'}.`,
            readinessAnalysis: `Your overall career readiness is ${overallReadiness}%, with your strongest skill being ${topReadiness[0]?.section || 'Communication'} at ${topReadiness[0]?.percentage || 0}%. ${overallReadiness >= 70 ? 'You demonstrate solid preparedness for career-related challenges.' : overallReadiness >= 50 ? 'You have a moderate foundation that can be strengthened with targeted practice.' : 'You are building foundational skills — consistent effort will accelerate your readiness.'} Focus on developing ${weakReadiness[0]?.section || 'adaptability'} to round out your skill profile.`,
            academicStreams: {
                recommended: streams.slice(0, 3),
                reasoning: `Based on your ${riasecCode} Holland Code and strength in ${topApt[0].name}, these streams align with both your natural interests and cognitive abilities.`,
            },
            careerGuidance: {
                suggestedCareers,
                skillsToDevelop: skillsToDevelop.slice(0, 5),
            },
            sectorRecommendations: {
                topSectors,
                reasoning: `Your ${riasecCode} interest profile and ${topApt[0].name} aptitude strength point toward these industry sectors as strong fits.`,
            },
            studyTips: `Leverage your strength in ${topApt[0].name} by tackling challenging problems in this area to build confidence. For ${weakApt[0].name}, start with fundamentals and practice 15-20 minutes daily using structured exercises. Your ${topTraits[0]?.trait || 'disciplined'} personality trait means you can sustain a consistent study routine — use this to your advantage with techniques like spaced repetition and active recall.`,
            nextSteps: `1. Discuss these results with your school counselor, focusing on your ${riasecCode} Holland Code and stream recommendations. 2. Explore extracurricular activities in ${topSectors[0] || 'your interest area'}. 3. Work on strengthening ${weakReadiness[0]?.section || 'your developing skills'} through practical projects or workshops. 4. Consider career orientation programs or job shadowing in ${topCodes[0]}-oriented fields.`,
        };
    }

    /**
     * Get suggested careers based on RIASEC code + aptitude strengths
     */
    private getSuggestedCareersFromRiasec(
        riasecCode: string,
        topAptitudes: string[],
    ): { role: string; fitReason: string }[] {
        const riasecCareers: Record<string, { role: string; fit: string }[]> = {
            R: [
                { role: 'Mechanical Engineer', fit: 'hands-on problem-solving' },
                { role: 'Civil Engineer', fit: 'practical, structured work' },
                { role: 'Agricultural Scientist', fit: 'applied science in real settings' },
            ],
            I: [
                { role: 'Data Scientist', fit: 'analytical and research-oriented' },
                { role: 'Research Scientist', fit: 'deep investigation and discovery' },
                { role: 'Software Developer', fit: 'logical problem-solving' },
            ],
            A: [
                { role: 'UX/UI Designer', fit: 'creative visual thinking' },
                { role: 'Content Creator', fit: 'creative expression' },
                { role: 'Architect', fit: 'blending creativity with structure' },
            ],
            S: [
                { role: 'Teacher / Professor', fit: 'helping and mentoring others' },
                { role: 'Psychologist', fit: 'understanding people' },
                { role: 'Social Worker', fit: 'community impact' },
            ],
            E: [
                { role: 'Business Manager', fit: 'leadership and strategy' },
                { role: 'Entrepreneur', fit: 'initiative and persuasion' },
                { role: 'Marketing Manager', fit: 'influence and communication' },
            ],
            C: [
                { role: 'Chartered Accountant', fit: 'systematic, detail-oriented work' },
                { role: 'Financial Analyst', fit: 'organized data processing' },
                { role: 'Operations Manager', fit: 'process optimization' },
            ],
        };

        const careers: { role: string; fitReason: string }[] = [];
        const seen = new Set<string>();

        // Add careers from top 3 RIASEC codes
        for (const code of riasecCode.split('')) {
            const matches = riasecCareers[code] || [];
            for (const m of matches.slice(0, 2)) {
                if (!seen.has(m.role)) {
                    seen.add(m.role);
                    careers.push({
                        role: m.role,
                        fitReason: `Matches your ${code} interest (${m.fit}) and strength in ${topAptitudes[0] || 'general aptitude'}`,
                    });
                }
            }
        }

        return careers.slice(0, 6);
    }

    /**
     * Translate AI insight text fields to Malayalam via Gemini.
     * Collects all translatable string fields, sends a single Gemini call,
     * returns an object with `_ml` suffixed keys.
     * On failure: returns empty object (graceful degradation — English shown).
     */
    async translateInsightsToMalayalam(
        aiInsights: Record<string, any>,
        reportType: 'student' | 'jobseeker',
    ): Promise<Record<string, string>> {
        if (!this.apiKey) {
            this.logger.warn('Malayalam translation skipped — no Gemini API key');
            return {};
        }

        // Collect translatable text fields (strings only, skip objects/arrays)
        const translatableFields: string[] = reportType === 'student'
            ? [
                'overallSummary', 'strengthsAnalysis', 'areasForGrowth',
                'riasecAnalysis', 'personalityAnalysis', 'readinessAnalysis',
                'studyTips', 'nextSteps',
            ]
            : [
                'employabilitySummary', 'aptitudeAnalysis', 'careerInterestAlignment',
                'personalitySnapshot', 'skillReadiness', 'developmentRoadmap',
                'developmentGuidance',
            ];

        // Also translate nested string fields
        const nestedFields: { parent: string; child: string }[] = reportType === 'student'
            ? [{ parent: 'studentPersona', child: 'description' }]
            : [
                { parent: 'professionalPersona', child: 'description' },
                { parent: 'clarityIndex', child: 'justification' },
            ];

        const sourceDict: Record<string, string> = {};
        for (const field of translatableFields) {
            const val = aiInsights[field];
            if (typeof val === 'string' && val.length > 20) {
                sourceDict[field] = val;
            }
        }
        for (const { parent, child } of nestedFields) {
            const parentObj = aiInsights[parent];
            if (parentObj && typeof parentObj[child] === 'string' && parentObj[child].length > 20) {
                sourceDict[`${parent}_${child}`] = parentObj[child];
            }
        }

        // Also translate detailedTraitInterpretation values (job seeker)
        if (reportType === 'jobseeker' && aiInsights.detailedTraitInterpretation) {
            for (const [trait, text] of Object.entries(aiInsights.detailedTraitInterpretation)) {
                if (typeof text === 'string' && text.length > 20) {
                    sourceDict[`detailedTraitInterpretation_${trait}`] = text;
                }
            }
        }

        if (Object.keys(sourceDict).length === 0) {
            return {};
        }

        const prompt = `You are a professional English-to-Malayalam translator for a career assessment report.

Translate the following JSON dictionary values from English to Malayalam.

RULES:
- Translate ONLY the descriptive text to Malayalam
- Keep ALL technical terms, proper nouns, names, numbers, percentages, scores, RIASEC codes, Holland Codes, career titles, sector names, and English abbreviations in English within the Malayalam text
- Use formal Malayalam suitable for an official career guidance report
- Return a JSON object with the EXACT SAME KEYS, but with Malayalam translations as values
- Do NOT add or remove any keys

Input JSON:
${JSON.stringify(sourceDict, null, 2)}`;

        const startTime = Date.now();
        try {
            const response = await this.geminiRequest({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: {
                    temperature: 0.3,
                    maxOutputTokens: 8192,
                    responseMimeType: 'application/json',
                },
            });

            const duration = Date.now() - startTime;

            if (!response.ok) {
                const error = await response.text();
                this.logger.warn(`Malayalam translation Gemini error (${duration}ms): ${error.substring(0, 200)}`);
                return {};
            }

            const data = await response.json();
            const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;
            if (!generatedText) {
                this.logger.warn('Empty response from Gemini for Malayalam translation');
                return {};
            }

            const translated = JSON.parse(generatedText) as Record<string, string>;

            // Convert to _ml suffixed keys
            const result: Record<string, string> = {};
            for (const [key, value] of Object.entries(translated)) {
                if (typeof value === 'string') {
                    result[`${key}_ml`] = value;
                }
            }

            this.logger.logBusinessEvent('MALAYALAM_TRANSLATION_SUCCESS', {
                reportType,
                fieldsTranslated: Object.keys(result).length,
                duration: `${duration}ms`,
            });

            return result;
        } catch (error) {
            const duration = Date.now() - startTime;
            this.logger.warn(`Malayalam translation failed (${duration}ms): ${error instanceof Error ? error.message : error}`);
            return {};
        }
    }

    /**
     * Save student AI analysis to database
     */
    async saveStudentAnalysis(
        userAssessmentId: string,
        analysis: StudentAiAnalysisResult,
    ): Promise<void> {
        await this.prisma.userAssessment.update({
            where: { id: userAssessmentId },
            data: {
                aiSummary: analysis.overallSummary,
                aiInsights: JSON.parse(JSON.stringify({
                    studentPersona: analysis.studentPersona,
                    strengthsAnalysis: analysis.strengthsAnalysis,
                    areasForGrowth: analysis.areasForGrowth,
                    riasecAnalysis: analysis.riasecAnalysis,
                    personalityAnalysis: analysis.personalityAnalysis,
                    readinessAnalysis: analysis.readinessAnalysis,
                    academicStreams: analysis.academicStreams,
                    careerGuidance: analysis.careerGuidance,
                    sectorRecommendations: analysis.sectorRecommendations,
                    studyTips: analysis.studyTips,
                    nextSteps: analysis.nextSteps,
                })),
                aiAnalyzedAt: new Date(),
            },
        });

        this.logger.log(`Student AI analysis saved for assessment ${userAssessmentId}`);
    }

    /**
     * Generate a native Malayalam career analysis narrative for student reports.
     * Instead of translating English insights field-by-field, this produces a
     * comprehensive, conversational Malayalam narrative in a single Gemini call.
     */
    async generateStudentMalayalamAnalysis(
        profile: StudentProfile,
        aptitudeScores: AptitudeScores,
        riasecScores: StudentRiasecScores,
        riasecCode: string,
        personalityScores: StudentPersonalityScores,
        readinessScores: StudentReadinessScores,
        careerMatches?: { title: string; matchScore: number }[],
        sectorMatches?: { name: string; matchScore: number }[],
    ): Promise<{ title_ml: string; analysis_ml: string } | null> {
        if (!this.apiKey) {
            this.logger.warn('Malayalam analysis skipped — no Gemini API key');
            return this.getStudentMalayalamFallback(
                profile, aptitudeScores, riasecScores, riasecCode,
                personalityScores, readinessScores, careerMatches, sectorMatches,
            );
        }

        const startTime = Date.now();
        const prompt = buildStudentMalayalamPrompt(
            profile, aptitudeScores, riasecScores, riasecCode,
            personalityScores, readinessScores, careerMatches, sectorMatches,
        );

        this.logger.logBusinessEvent('GEMINI_STUDENT_ML_REQUEST', {
            student: profile.fullName,
            hollandCode: riasecCode,
            promptLength: prompt.length,
        });

        try {
            const response = await this.geminiRequest({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 8192,
                    responseMimeType: 'application/json',
                },
            });

            const duration = Date.now() - startTime;

            if (!response.ok) {
                const error = await response.text();
                this.logger.warn(`Malayalam analysis Gemini error (${duration}ms): ${error.substring(0, 200)}`);
                return this.getStudentMalayalamFallback(
                    profile, aptitudeScores, riasecScores, riasecCode,
                    personalityScores, readinessScores, careerMatches, sectorMatches,
                );
            }

            const data = await response.json();
            const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;

            if (!generatedText) {
                this.logger.warn('Empty response from Gemini for Malayalam analysis');
                return this.getStudentMalayalamFallback(
                    profile, aptitudeScores, riasecScores, riasecCode,
                    personalityScores, readinessScores, careerMatches, sectorMatches,
                );
            }

            const result = JSON.parse(generatedText) as { title_ml: string; analysis_ml: string };

            if (!result.title_ml || !result.analysis_ml) {
                this.logger.warn('Incomplete Malayalam analysis from Gemini');
                return this.getStudentMalayalamFallback(
                    profile, aptitudeScores, riasecScores, riasecCode,
                    personalityScores, readinessScores, careerMatches, sectorMatches,
                );
            }

            this.logger.logBusinessEvent('GEMINI_STUDENT_ML_SUCCESS', {
                student: profile.fullName,
                duration: `${duration}ms`,
                analysisLength: result.analysis_ml.length,
            });

            return result;
        } catch (error) {
            const duration = Date.now() - startTime;
            this.logger.warn(`Malayalam analysis failed (${duration}ms): ${error instanceof Error ? error.message : error}`);
            return this.getStudentMalayalamFallback(
                profile, aptitudeScores, riasecScores, riasecCode,
                personalityScores, readinessScores, careerMatches, sectorMatches,
            );
        }
    }

    /**
     * Template-based Malayalam fallback when Gemini is unavailable.
     * Generates structured Malayalam text from raw score data.
     */
    private getStudentMalayalamFallback(
        profile: StudentProfile,
        aptitudeScores: AptitudeScores,
        riasecScores: StudentRiasecScores,
        riasecCode: string,
        personalityScores: StudentPersonalityScores,
        readinessScores: StudentReadinessScores,
        careerMatches?: { title: string; matchScore: number }[],
        sectorMatches?: { name: string; matchScore: number }[],
    ): { title_ml: string; analysis_ml: string } {
        const riasecNames: Record<string, string> = {
            R: 'Realistic', I: 'Investigative', A: 'Artistic',
            S: 'Social', E: 'Enterprising', C: 'Conventional',
        };
        const riasecMl: Record<string, string> = {
            R: 'പ്രായോഗിക പ്രശ്‌നപരിഹാരം',
            I: 'വിശകലന ചിന്തയും ഗവേഷണവും',
            A: 'സർഗ്ഗാത്മക ആവിഷ്‌കാരവും നവീകരണവും',
            S: 'മറ്റുള്ളവരെ സഹായിക്കലും വ്യക്തിബന്ധങ്ങളും',
            E: 'നേതൃത്വവും സംരംഭകത്വവും',
            C: 'സംഘടനയും വ്യവസ്ഥാപിത പ്രക്രിയകളും',
        };

        // Aptitude analysis
        const aptSections = Object.entries(aptitudeScores)
            .filter(([key]) => key !== 'overall')
            .map(([name, data]) => ({ name, pct: data.percentage }))
            .sort((a, b) => b.pct - a.pct);
        const overallApt = aptitudeScores['overall']?.percentage || 0;

        // RIASEC
        const topCodes = riasecCode.split('');
        const hollandExpanded = topCodes.map(c => riasecNames[c] || c).join('-');

        // Personality
        const personalityEntries = Object.entries(personalityScores)
            .map(([trait, data]) => ({ trait, ...data }))
            .sort((a, b) => b.score - a.score);
        const strongTraits = personalityEntries.filter(t => t.level === 'Strong');
        const emergingTraits = personalityEntries.filter(t => t.level === 'Emerging');

        // Readiness
        const readinessEntries = Object.entries(readinessScores)
            .filter(([key]) => key !== 'overall')
            .map(([section, data]) => ({ section, ...data }))
            .sort((a, b) => b.percentage - a.percentage);
        const overallReadiness = readinessScores['overall']?.percentage || 0;

        // Composite for persona
        const compositeScore = Math.round(overallApt * 0.4 + overallReadiness * 0.3 + (personalityEntries[0]?.score / personalityEntries[0]?.maxScore || 0.5) * 100 * 0.3);
        const personaTitle = compositeScore >= 75 ? 'The Strategic Achiever'
            : compositeScore >= 60 ? 'The Emerging Professional'
                : compositeScore >= 45 ? 'The Aspiring Builder'
                    : 'The Curious Explorer';

        const sections: string[] = [];

        // Section 1: About you
        sections.push(
            `**നിങ്ങളെ കുറിച്ച്**\n\n` +
            `പ്രിയ ${profile.fullName}, നിങ്ങളുടെ സമഗ്ര മൂല്യാങ്കനത്തിന്റെ ഫലങ്ങൾ വളരെ രസകരമാണ്. ` +
            `നിങ്ങളുടെ ഹോളണ്ട് കോഡ് ${riasecCode} (${hollandExpanded}) ആണ്, ` +
            `ഇത് ${riasecMl[topCodes[0]] || ''} എന്നിവയിലുള്ള നിങ്ങളുടെ താൽപ്പര്യം കാണിക്കുന്നു. ` +
            `${aptSections[0]?.name || ''} (${Math.round(aptSections[0]?.pct || 0)}%) നിങ്ങളുടെ ഏറ്റവും ശക്തമായ ബൗദ്ധിക മേഖലയാണ്. ` +
            `നിങ്ങളുടെ മൊത്തം പ്രകടനം ${compositeScore >= 70 ? 'മികച്ചതാണ്' : compositeScore >= 50 ? 'നല്ലതാണ്' : 'വളരുന്ന ഘട്ടത്തിലാണ്'}.`
        );

        // Section 2: Aptitude
        const aptitudeDetail = aptSections.map(a =>
            `${a.name}: ${Math.round(a.pct)}% — ${a.pct >= 70 ? 'ശക്തം' : a.pct >= 40 ? 'ശരാശരി' : 'വളരുന്ന'}`
        ).join(', ');
        sections.push(
            `**ബൗദ്ധിക കഴിവുകൾ**\n\n` +
            `നിങ്ങളുടെ മൊത്തം ബൗദ്ധിക അഭിരുചി സ്കോർ ${Math.round(overallApt)}% ആണ്. ` +
            `വിവിധ മേഖലകളിലെ നിങ്ങളുടെ പ്രകടനം: ${aptitudeDetail}. ` +
            `${aptSections[0]?.name || ''} നിങ്ങളുടെ ഏറ്റവും ശക്തമായ മേഖലയാണ്, ` +
            `ഇത് ഈ മേഖലയിൽ വിവരങ്ങൾ പ്രോസസ്സ് ചെയ്യാനും പ്രയോഗിക്കാനുമുള്ള നിങ്ങളുടെ സ്വാഭാവിക കഴിവ് പ്രതിഫലിപ്പിക്കുന്നു. ` +
            `${aptSections.length > 1 ? `${aptSections[aptSections.length - 1].name} (${Math.round(aptSections[aptSections.length - 1].pct)}%) വളർച്ചയ്ക്കുള്ള പ്രധാന അവസരമാണ്.` : ''}`
        );

        // Section 3: RIASEC
        const riasecDetail = Object.entries(riasecScores)
            .sort((a, b) => (b[1] as number) - (a[1] as number))
            .map(([code, score]) => `${riasecNames[code] || code} (${code}): ${score}/8`)
            .join(', ');
        sections.push(
            `**കരിയർ താൽപ്പര്യങ്ങൾ**\n\n` +
            `നിങ്ങളുടെ ഹോളണ്ട് കോഡ് ${riasecCode} (${hollandExpanded}) ആണ്. ` +
            `ഇതിനർത്ഥം നിങ്ങൾ ${riasecMl[topCodes[0]] || ''} ഊന്നൽ നൽകുന്ന തൊഴിൽ ചുറ്റുപാടുകളിൽ ഏറ്റവും സംതൃപ്തരാണ് എന്നാണ്. ` +
            `നിങ്ങളുടെ RIASEC സ്കോറുകൾ: ${riasecDetail}. ` +
            `${topCodes[1] ? `${riasecNames[topCodes[1]] || topCodes[1]} താൽപ്പര്യം ഇത് ${riasecMl[topCodes[1]] || ''} ചേർക്കുന്നു.` : ''}`
        );

        // Section 4: Personality
        sections.push(
            `**വ്യക്തിത്വ ഗുണങ്ങൾ**\n\n` +
            (strongTraits.length > 0
                ? `നിങ്ങളുടെ ഏറ്റവും ശക്തമായ വ്യക്തിത്വ ഗുണങ്ങൾ ${strongTraits.map(t => `${t.trait} (${t.score}/${t.maxScore})`).join(', ')} ആണ്. ` +
                  `ഇത് ഈ ഗുണങ്ങളിൽ ഉയർന്ന പക്വതയും സ്ഥിരതയും സൂചിപ്പിക്കുന്നു. `
                : `നിങ്ങളുടെ വ്യക്തിത്വ ഗുണങ്ങൾ സമതുലിതമായ വികസനം കാണിക്കുന്നു. `) +
            (emergingTraits.length > 0
                ? `${emergingTraits.map(t => t.trait).join(', ')} ഇപ്പോഴും വളരുന്ന ഘട്ടത്തിലാണ്, ബോധപൂർവ്വമായ ശ്രമത്തിലൂടെ ഇവ ശക്തിപ്പെടുത്താം. `
                : '') +
            `ഈ ഗുണങ്ങൾ നിങ്ങൾ വെല്ലുവിളികളെ എങ്ങനെ നേരിടുന്നു, മറ്റുള്ളവരുമായി എങ്ങനെ ഇടപെടുന്നു എന്നിവ രൂപപ്പെടുത്തുന്നു.`
        );

        // Section 5: Readiness
        sections.push(
            `**കരിയർ സന്നദ്ധത**\n\n` +
            `നിങ്ങളുടെ മൊത്തം കരിയർ സന്നദ്ധത ${Math.round(overallReadiness)}% ആണ്. ` +
            (readinessEntries.length > 0
                ? `ഏറ്റവും ശക്തമായ കഴിവ് ${readinessEntries[0].section} (${Math.round(readinessEntries[0].percentage)}%) ആണ്. ` +
                  (readinessEntries.length > 1 ? `${readinessEntries[readinessEntries.length - 1].section} (${Math.round(readinessEntries[readinessEntries.length - 1].percentage)}%) നിങ്ങളുടെ പ്രധാന വികസന മേഖലയാണ്. ` : '')
                : '') +
            `കരിയർ സന്നദ്ധത കഴിവുകൾ പരിശീലനം, വർക്ക്ഷോപ്പുകൾ, പ്രായോഗിക പദ്ധതികൾ എന്നിവയിലൂടെ വികസിപ്പിക്കാം.`
        );

        // Section 6: Career recommendations
        const careerList = (careerMatches || []).slice(0, 6);
        const sectorList = (sectorMatches || []).slice(0, 4);
        sections.push(
            `**ശുപാർശ ചെയ്യുന്ന കരിയറുകൾ**\n\n` +
            (careerList.length > 0
                ? `നിങ്ങളുടെ പ്രൊഫൈലുമായി ഏറ്റവും അനുയോജ്യമായ കരിയറുകൾ: ${careerList.map(c => `${c.title} (${c.matchScore}%)`).join(', ')}. `
                : `നിങ്ങളുടെ ${riasecCode} ഹോളണ്ട് കോഡ് അനുസരിച്ച് ${riasecMl[topCodes[0]] || ''} ഊന്നൽ നൽകുന്ന കരിയറുകൾ നിങ്ങൾക്ക് അനുയോജ്യമാണ്. `) +
            (sectorList.length > 0
                ? `ശുപാർശ ചെയ്യുന്ന സെക്ടറുകൾ: ${sectorList.map(s => s.name).join(', ')}. `
                : '') +
            `നിങ്ങളുടെ ${aptSections[0]?.name || ''} അഭിരുചി ശക്തിയും ${riasecCode} താൽപ്പര്യ പ്രൊഫൈലും ഈ കരിയറുകളിൽ വിജയത്തിന് സഹായിക്കും.`
        );

        // Section 7: Growth suggestions
        sections.push(
            `**വളർച്ചയ്ക്കുള്ള നിർദ്ദേശങ്ങൾ**\n\n` +
            `നിങ്ങളുടെ ${aptSections[0]?.name || ''} ശക്തി പ്രയോജനപ്പെടുത്തി വെല്ലുവിളിനിറഞ്ഞ പ്രശ്‌നങ്ങൾ പരിഹരിക്കുക. ` +
            (aptSections.length > 1 ? `${aptSections[aptSections.length - 1].name} മെച്ചപ്പെടുത്താൻ ദിവസവും 15-20 മിനിറ്റ് ഘടനാപരമായ പരിശീലനം ചെയ്യുക. ` : '') +
            (readinessEntries.length > 0 ? `${readinessEntries[readinessEntries.length - 1]?.section || ''} കഴിവ് വികസിപ്പിക്കാൻ പ്രായോഗിക പദ്ധതികളിൽ പങ്കെടുക്കുക. ` : '') +
            `സ്‌പേസ്ഡ് റിപ്പറ്റിഷൻ, ആക്ടീവ് റീകോൾ പോലുള്ള പഠന സാങ്കേതിക വിദ്യകൾ ഉപയോഗിക്കുക.`
        );

        // Section 8: Next steps
        sections.push(
            `**അടുത്ത ഘട്ടങ്ങൾ**\n\n` +
            `1. ഈ ഫലങ്ങൾ നിങ്ങളുടെ സ്കൂൾ കൗൺസിലറുമായി ചർച്ച ചെയ്യുക, ${riasecCode} ഹോളണ്ട് കോഡ് കേന്ദ്രീകരിച്ച്.\n` +
            `2. ${topCodes[0] ? `${riasecNames[topCodes[0]] || ''} താൽപ്പര്യങ്ങളുമായി ബന്ധപ്പെട്ട` : ''} പാഠ്യേതര പ്രവർത്തനങ്ങൾ പര്യവേക്ഷണം ചെയ്യുക.\n` +
            `3. ${readinessEntries.length > 0 ? readinessEntries[readinessEntries.length - 1].section : 'വികസന മേഖലകൾ'} മെച്ചപ്പെടുത്താൻ വർക്ക്ഷോപ്പുകളിൽ പങ്കെടുക്കുക.\n` +
            `4. കരിയർ ഓറിയന്റേഷൻ പ്രോഗ്രാമുകളിൽ അല്ലെങ്കിൽ ജോബ് ഷാഡോയിംഗിൽ പങ്കെടുക്കുക.`
        );

        return {
            title_ml: `${personaTitle} — ${riasecMl[topCodes[0]] || ''} ${aptSections[0]?.name || ''} കഴിവുകൾ ഒത്തുചേരുന്ന നിങ്ങൾ`,
            analysis_ml: sections.join('\n\n'),
        };
    }

    /**
     * Generate a native Malayalam career analysis narrative for job-seeker reports.
     * Instead of translating English insights field-by-field, this produces a
     * comprehensive, conversational Malayalam narrative in a single Gemini call.
     */
    async generateJobSeekerMalayalamAnalysis(
        profile: CandidateProfile,
        scores: ComprehensiveScores,
        careerMatches: CareerMatch[],
        sectorMatches?: SectorMatchResult,
    ): Promise<{ title_ml: string; analysis_ml: string } | null> {
        if (!this.apiKey) {
            this.logger.warn('Job-seeker Malayalam analysis skipped — no Gemini API key');
            return this.getJobSeekerMalayalamFallback(profile, scores, careerMatches, sectorMatches);
        }

        const startTime = Date.now();
        const prompt = buildJobSeekerMalayalamPrompt(profile, scores, careerMatches, sectorMatches);

        this.logger.logBusinessEvent('GEMINI_JOBSEEKER_ML_REQUEST', {
            candidate: profile.fullName,
            hollandCode: scores.riasecCode,
            promptLength: prompt.length,
        });

        try {
            const response = await this.geminiRequest({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 8192,
                    responseMimeType: 'application/json',
                },
            });

            const duration = Date.now() - startTime;

            if (!response.ok) {
                const error = await response.text();
                this.logger.warn(`Job-seeker Malayalam Gemini error (${duration}ms): ${error.substring(0, 200)}`);
                return this.getJobSeekerMalayalamFallback(profile, scores, careerMatches, sectorMatches);
            }

            const data = await response.json();
            const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;

            if (!generatedText) {
                this.logger.warn('Empty response from Gemini for job-seeker Malayalam analysis');
                return this.getJobSeekerMalayalamFallback(profile, scores, careerMatches, sectorMatches);
            }

            const result = JSON.parse(generatedText) as { title_ml: string; analysis_ml: string };

            if (!result.title_ml || !result.analysis_ml) {
                this.logger.warn('Incomplete job-seeker Malayalam analysis from Gemini');
                return this.getJobSeekerMalayalamFallback(profile, scores, careerMatches, sectorMatches);
            }

            this.logger.logBusinessEvent('GEMINI_JOBSEEKER_ML_SUCCESS', {
                candidate: profile.fullName,
                duration: `${duration}ms`,
                analysisLength: result.analysis_ml.length,
            });

            return result;
        } catch (error) {
            const duration = Date.now() - startTime;
            this.logger.warn(`Job-seeker Malayalam analysis failed (${duration}ms): ${error instanceof Error ? error.message : error}`);
            return this.getJobSeekerMalayalamFallback(profile, scores, careerMatches, sectorMatches);
        }
    }

    /**
     * Template-based Malayalam fallback for job-seekers when Gemini is unavailable.
     * Generates structured Malayalam text from raw score data.
     */
    private getJobSeekerMalayalamFallback(
        profile: CandidateProfile,
        scores: ComprehensiveScores,
        careerMatches: CareerMatch[],
        sectorMatches?: SectorMatchResult,
    ): { title_ml: string; analysis_ml: string } {
        const riasecNames: Record<string, string> = {
            R: 'Realistic', I: 'Investigative', A: 'Artistic',
            S: 'Social', E: 'Enterprising', C: 'Conventional',
        };
        const riasecMl: Record<string, string> = {
            R: 'പ്രായോഗിക പ്രശ്‌നപരിഹാരം',
            I: 'വിശകലന ചിന്തയും ഗവേഷണവും',
            A: 'സർഗ്ഗാത്മക ആവിഷ്‌കാരവും നവീകരണവും',
            S: 'മറ്റുള്ളവരെ സഹായിക്കലും വ്യക്തിബന്ധങ്ങളും',
            E: 'നേതൃത്വവും സംരംഭകത്വവും',
            C: 'സംഘടനയും വ്യവസ്ഥാപിത പ്രക്രിയകളും',
        };

        const topCodes = scores.riasecCode.split('');
        const hollandExpanded = topCodes.map(c => riasecNames[c] || c).join('-');

        // Aptitude analysis
        const aptSections = Object.entries(scores.aptitude)
            .filter(([key]) => key !== 'overall')
            .map(([name, data]: [string, any]) => ({ name, pct: data.percentage }))
            .sort((a, b) => b.pct - a.pct);
        const overallApt = scores.aptitude.overall?.percentage || 0;

        // Employability
        const empSections = Object.entries(scores.employability)
            .filter(([key]) => key !== 'overall')
            .map(([name, data]: [string, any]) => ({ name, pct: data.percentage }))
            .sort((a, b) => b.pct - a.pct);
        const overallEmp = scores.employability.overall?.percentage || 0;

        // Personality
        const personalityEntries = Object.entries(scores.personality)
            .map(([trait, data]: [string, any]) => ({ trait, average: data.average, level: data.level }))
            .sort((a, b) => b.average - a.average);
        const strongTraits = personalityEntries.filter(t => t.level === 'Strong' || t.average >= 3.5);
        const emergingTraits = personalityEntries.filter(t => t.level === 'Developing' || t.average < 2.5);

        // Composite
        const personalityAverages = personalityEntries.map(p => p.average);
        const avgPersonality = personalityAverages.length > 0
            ? personalityAverages.reduce((a, b) => a + b, 0) / personalityAverages.length
            : 0;
        const personalityPct = Math.round(((avgPersonality - 1) / 4) * 100);
        const compositeScore = Math.round(overallApt * 0.35 + overallEmp * 0.35 + personalityPct * 0.30);

        const personaTitle = compositeScore >= 75 ? 'The Strategic Achiever'
            : compositeScore >= 60 ? 'The Emerging Professional'
                : compositeScore >= 45 ? 'The Aspiring Builder'
                    : 'The Curious Explorer';

        // Sector data
        const topSectors = sectorMatches?.topSectors?.slice(0, 4) || [];

        const sections: string[] = [];

        // Section 1: About you
        sections.push(
            `**നിങ്ങളെ കുറിച്ച്**\n\n` +
            `പ്രിയ ${profile.fullName}, നിങ്ങളുടെ സമഗ്ര മൂല്യാങ്കനത്തിന്റെ ഫലങ്ങൾ വളരെ രസകരമാണ്. ` +
            `നിങ്ങളുടെ ഹോളണ്ട് കോഡ് ${scores.riasecCode} (${hollandExpanded}) ആണ്, ` +
            `ഇത് ${riasecMl[topCodes[0]] || ''} എന്നിവയിലുള്ള നിങ്ങളുടെ താൽപ്പര്യം കാണിക്കുന്നു. ` +
            `${aptSections[0]?.name || ''} (${Math.round(aptSections[0]?.pct || 0)}%) നിങ്ങളുടെ ഏറ്റവും ശക്തമായ ബൗദ്ധിക മേഖലയാണ്. ` +
            `നിങ്ങളുടെ മൊത്തം പ്രകടനം ${compositeScore >= 70 ? 'മികച്ചതാണ്' : compositeScore >= 50 ? 'നല്ലതാണ്' : 'വളരുന്ന ഘട്ടത്തിലാണ്'}, ` +
            `കോമ്പോസിറ്റ് സ്കോർ ${compositeScore}/100 ആണ്.`,
        );

        // Section 2: Aptitude
        const aptitudeDetail = aptSections.map(a =>
            `${a.name}: ${Math.round(a.pct)}% — ${a.pct >= 70 ? 'ശക്തം' : a.pct >= 40 ? 'ശരാശരി' : 'വളരുന്ന'}`,
        ).join(', ');
        sections.push(
            `**ബൗദ്ധിക കഴിവുകൾ**\n\n` +
            `നിങ്ങളുടെ മൊത്തം ബൗദ്ധിക അഭിരുചി സ്കോർ ${Math.round(overallApt)}% ആണ്. ` +
            `വിവിധ മേഖലകളിലെ നിങ്ങളുടെ പ്രകടനം: ${aptitudeDetail}. ` +
            `${aptSections[0]?.name || ''} നിങ്ങളുടെ ഏറ്റവും ശക്തമായ മേഖലയാണ്, ` +
            `ഇത് ഈ മേഖലയിൽ വിവരങ്ങൾ പ്രോസസ്സ് ചെയ്യാനും പ്രയോഗിക്കാനുമുള്ള നിങ്ങളുടെ സ്വാഭാവിക കഴിവ് പ്രതിഫലിപ്പിക്കുന്നു. ` +
            `${aptSections.length > 1 ? `${aptSections[aptSections.length - 1].name} (${Math.round(aptSections[aptSections.length - 1].pct)}%) വളർച്ചയ്ക്കുള്ള പ്രധാന അവസരമാണ്.` : ''}`,
        );

        // Section 3: RIASEC
        const riasecDetail = (['R', 'I', 'A', 'S', 'E', 'C'] as ('R' | 'I' | 'A' | 'S' | 'E' | 'C')[])
            .sort((a, b) => (scores.riasec[b] || 0) - (scores.riasec[a] || 0))
            .map(code => `${riasecNames[code]} (${code}): ${scores.riasec[code]}/32`)
            .join(', ');
        sections.push(
            `**കരിയർ താൽപ്പര്യങ്ങൾ**\n\n` +
            `നിങ്ങളുടെ ഹോളണ്ട് കോഡ് ${scores.riasecCode} (${hollandExpanded}) ആണ്. ` +
            `ഇതിനർത്ഥം നിങ്ങൾ ${riasecMl[topCodes[0]] || ''} ഊന്നൽ നൽകുന്ന തൊഴിൽ ചുറ്റുപാടുകളിൽ ഏറ്റവും സംതൃപ്തരാണ് എന്നാണ്. ` +
            `നിങ്ങളുടെ RIASEC സ്കോറുകൾ: ${riasecDetail}. ` +
            `${topCodes[1] ? `${riasecNames[topCodes[1]] || topCodes[1]} താൽപ്പര്യം ഇത് ${riasecMl[topCodes[1]] || ''} ചേർക്കുന്നു.` : ''}`,
        );

        // Section 4: Personality
        sections.push(
            `**വ്യക്തിത്വ ഗുണങ്ങൾ**\n\n` +
            (strongTraits.length > 0
                ? `നിങ്ങളുടെ ഏറ്റവും ശക്തമായ വ്യക്തിത്വ ഗുണങ്ങൾ ${strongTraits.map(t => `${t.trait} (${t.average.toFixed(1)}/5.0)`).join(', ')} ആണ്. ` +
                  `ഇത് ഈ ഗുണങ്ങളിൽ ഉയർന്ന പക്വതയും സ്ഥിരതയും സൂചിപ്പിക്കുന്നു. `
                : `നിങ്ങളുടെ വ്യക്തിത്വ ഗുണങ്ങൾ സമതുലിതമായ വികസനം കാണിക്കുന്നു. `) +
            (emergingTraits.length > 0
                ? `${emergingTraits.map(t => t.trait).join(', ')} ഇപ്പോഴും വളരുന്ന ഘട്ടത്തിലാണ്, ബോധപൂർവ്വമായ ശ്രമത്തിലൂടെ ഇവ ശക്തിപ്പെടുത്താം. `
                : '') +
            `ഈ ഗുണങ്ങൾ നിങ്ങൾ ജോലിസ്ഥലത്ത് വെല്ലുവിളികളെ എങ്ങനെ നേരിടുന്നു, സഹപ്രവർത്തകരുമായി എങ്ങനെ ഇടപെടുന്നു എന്നിവ രൂപപ്പെടുത്തുന്നു.`,
        );

        // Section 5: Employability
        const empDetail = empSections.map(e =>
            `${e.name}: ${Math.round(e.pct)}%`,
        ).join(', ');
        sections.push(
            `**തൊഴിൽ സന്നദ്ധത**\n\n` +
            `നിങ്ങളുടെ മൊത്തം തൊഴിൽ സന്നദ്ധത സ്കോർ ${Math.round(overallEmp)}% ആണ്. ` +
            `വിവിധ കഴിവുകളിലെ നിങ്ങളുടെ പ്രകടനം: ${empDetail}. ` +
            (empSections.length > 0
                ? `${empSections[0].name} (${Math.round(empSections[0].pct)}%) നിങ്ങളുടെ ഏറ്റവും ശക്തമായ തൊഴിൽ കഴിവാണ്. `
                : '') +
            (empSections.length > 1
                ? `${empSections[empSections.length - 1].name} (${Math.round(empSections[empSections.length - 1].pct)}%) നിങ്ങളുടെ പ്രധാന വികസന മേഖലയാണ്. `
                : '') +
            `ഈ കഴിവുകൾ വർക്ക്ഷോപ്പുകൾ, പ്രായോഗിക പദ്ധതികൾ എന്നിവയിലൂടെ വികസിപ്പിക്കാം.`,
        );

        // Section 6: Sector & Career recommendations
        sections.push(
            `**ശുപാർശ ചെയ്യുന്ന മേഖലകൾ**\n\n` +
            (topSectors.length > 0
                ? `നിങ്ങളുടെ പ്രൊഫൈലുമായി ഏറ്റവും അനുയോജ്യമായ മേഖലകൾ: ${topSectors.map(s => `${s.sector.name} (${s.matchScore}%)`).join(', ')}. ` +
                  `${topSectors[0]?.sector.name || ''} ൽ നിങ്ങളുടെ താൽപ്പര്യവും അഭിരുചിയും ഏറ്റവും നന്നായി ഒത്തുചേരുന്നു. `
                : `നിങ്ങളുടെ ${scores.riasecCode} ഹോളണ്ട് കോഡ് അനുസരിച്ച് ${riasecMl[topCodes[0]] || ''} ഊന്നൽ നൽകുന്ന മേഖലകൾ നിങ്ങൾക്ക് അനുയോജ്യമാണ്. `) +
            (careerMatches.length > 0
                ? `ശുപാർശ ചെയ്യുന്ന കരിയറുകൾ: ${careerMatches.slice(0, 5).map(c => `${c.title} (${c.matchScore}%)`).join(', ')}. `
                : '') +
            `നിങ്ങളുടെ ${aptSections[0]?.name || ''} അഭിരുചി ശക്തിയും ${scores.riasecCode} താൽപ്പര്യ പ്രൊഫൈലും ഈ മേഖലകളിൽ വിജയത്തിന് സഹായിക്കും.`,
        );

        // Section 7: Growth roadmap
        sections.push(
            `**വളർച്ചയ്ക്കുള്ള നിർദ്ദേശങ്ങൾ**\n\n` +
            `ഉടനടി (1-3 മാസം): നിങ്ങളുടെ ${aptSections[aptSections.length - 1]?.name || ''} കഴിവ് മെച്ചപ്പെടുത്താൻ ദിവസവും 20-30 മിനിറ്റ് ഘടനാപരമായ പരിശീലനം ചെയ്യുക. ` +
            (empSections.length > 0 ? `${empSections[empSections.length - 1]?.name || ''} കഴിവ് വികസിപ്പിക്കാൻ ഓൺലൈൻ കോഴ്‌സുകൾ ആരംഭിക്കുക. ` : '') +
            `ഹ്രസ്വകാലം (3-6 മാസം): ${topSectors[0]?.sector?.name || 'നിങ്ങളുടെ താൽപ്പര്യ മേഖല'} ൽ ഇന്റേൺഷിപ്പ് അല്ലെങ്കിൽ പ്രായോഗിക പരിചയം നേടുക. ` +
            `മധ്യകാലം (6-12 മാസം): ${topSectors[0]?.sector?.exampleRoles?.[0] || 'ലക്ഷ്യ കരിയർ'} റോളിലേക്ക് സജീവമായി അപേക്ഷിക്കുക, പോർട്ട്‌ഫോളിയോ നിർമ്മിക്കുക.`,
        );

        // Section 8: Next steps
        sections.push(
            `**അടുത്ത ഘട്ടങ്ങൾ**\n\n` +
            `1. ഈ ഫലങ്ങൾ ഒരു കരിയർ കൗൺസിലറുമായി ചർച്ച ചെയ്യുക, ${scores.riasecCode} ഹോളണ്ട് കോഡ് കേന്ദ്രീകരിച്ച്.\n` +
            `2. ${topCodes[0] ? `${riasecNames[topCodes[0]] || ''} താൽപ്പര്യങ്ങളുമായി ബന്ധപ്പെട്ട` : ''} പ്രൊഫഷണൽ നെറ്റ്‌വർക്കിംഗ് ഇവന്റുകളിൽ പങ്കെടുക്കുക.\n` +
            `3. ${empSections.length > 0 ? empSections[empSections.length - 1].name : 'വികസന മേഖലകൾ'} മെച്ചപ്പെടുത്താൻ ഓൺലൈൻ സർട്ടിഫിക്കേഷൻ പ്രോഗ്രാമുകളിൽ ചേരുക.\n` +
            `4. LinkedIn പ്രൊഫൈൽ അപ്ഡേറ്റ് ചെയ്ത് ${topSectors[0]?.sector?.name || 'ലക്ഷ്യ മേഖല'} ൽ പ്രൊഫഷണലുകളുമായി ബന്ധപ്പെടുക.\n` +
            `5. നിങ്ങളുടെ ശക്തമായ ${aptSections[0]?.name || ''} കഴിവ് ഉപയോഗിച്ച് ഒരു പ്രായോഗിക പദ്ധതി തയ്യാറാക്കുക.`,
        );

        return {
            title_ml: `${personaTitle} — ${riasecMl[topCodes[0]] || ''} ${aptSections[0]?.name || ''} കഴിവുകൾ ഒത്തുചേരുന്ന നിങ്ങൾ`,
            analysis_ml: sections.join('\n\n'),
        };
    }
}
