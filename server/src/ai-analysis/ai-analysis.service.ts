import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { ComprehensiveScores } from '../assessments/scoring.service';
import { SectorMatchResult } from '../assessments/sector-matching.service';
import { CareerMatch } from '../assessments/careers.service';
import { LoggerService } from '../logger/logger.service';
import { buildJobSeekerPrompt } from './prompts/job-seeker.prompt';
import { buildStudentPrompt as buildStudentPromptFn } from './prompts/student.prompt';

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

// Student-specific AI analysis result (aptitude-focused)
export interface StudentAiAnalysisResult {
    studentPersona: {
        title: string;      // e.g., "The Logical Architect"
        description: string; // "You tackle problems with logic and structure..."
        superpower: string;  // "Visualizing complex systems"
    };
    overallSummary: string;
    strengthsAnalysis: string;
    areasForGrowth: string;
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
    private readonly apiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-001:generateContent';

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
            const response = await fetch(`${this.apiUrl}?key=${this.apiKey}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [
                        {
                            parts: [{ text: prompt }],
                        },
                    ],
                    generationConfig: {
                        temperature: 0.7,
                        maxOutputTokens: 4096,
                        responseMimeType: 'application/json',
                    },
                }),
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

    // Original inline prompt moved to: prompts/job-seeker.prompt.ts
    // This reduces service size by ~90 lines

    /**
        const topCareers = careerMatches.slice(0, 5).map(c => c.title).join(', ');

        return `You are a professional career counselor generating a personalized employability report.

## CANDIDATE PROFILE
Name: ${profile.fullName}
${profile.age ? `Age: ${profile.age}` : ''}
${profile.gender ? `Gender: ${profile.gender}` : ''}
${profile.location ? `Location: ${profile.location}` : ''}
${profile.education ? `Education: ${profile.education}` : ''}
${profile.currentRole ? `Current Role: ${profile.currentRole}` : ''}

## ASSESSMENT RESULTS

### APTITUDE SCORES (percentage correct)
${Object.entries(scores.aptitude)
                .filter(([key]) => key !== 'overall')
                .map(([section, data]: [string, any]) => `- ${section}: ${data.percentage}%`)
                .join('\n')}
- Overall: ${scores.aptitude.overall.percentage}%

### CAREER INTEREST (RIASEC)
Holland Code: ${scores.riasecCode}
- Realistic: ${scores.riasec.R}/32
- Investigative: ${scores.riasec.I}/32
- Artistic: ${scores.riasec.A}/32
- Social: ${scores.riasec.S}/32
- Enterprising: ${scores.riasec.E}/32
- Conventional: ${scores.riasec.C}/32

### EMPLOYABILITY SKILLS
${Object.entries(scores.employability)
                .filter(([key]) => key !== 'overall')
                .map(([section, data]: [string, any]) => `- ${section}: ${data.percentage}%`)
                .join('\n')}
- Overall: ${scores.employability.overall.percentage}%

### PERSONALITY TRAITS (1-5 scale)
${Object.entries(scores.personality)
                .map(([trait, data]: [string, any]) => `- ${trait}: ${data.average}`)
                .join('\n')}

### TOP CAREER MATCHES
${topCareers}

### CAREER DIRECTION CLARITY INDEX
Score: ${scores.clarityIndex}/100

## GENERATE THE FOLLOWING SECTIONS

1. **Employability Profile Summary** (3-4 sentences summarizing overall job readiness)
2. **Cognitive & Aptitude Analysis** (2-3 sentences highlighting cognitive strengths)
3. **Career Interest Alignment** (2-3 sentences interpreting RIASEC code ${scores.riasecCode})
4. **Work Personality Snapshot** (2-3 sentences on key personality traits)
5. **Employability Skill Readiness** (2-3 sentences on skills)
6. **Best-Fit Career Role Clusters**:
   - Primary Fit Roles: [3-4 roles matching their profile]
   - Growth Roles (with upskilling): [2-3 roles they could grow into]
   - Roles to avoid: [brief note on mismatched careers]
7. **Career Development Guidance** (2-3 sentences on short/mid-term focus areas)
8. **Career Direction Clarity Index** (ONE word: LOW, MEDIUM, or HIGH based on score ${scores.clarityIndex}/100 + brief justification)

Respond in this exact JSON format:
{
  "employabilitySummary": "...",
  "aptitudeAnalysis": "...",
  "careerInterestAlignment": "...",
  "personalitySnapshot": "...",
  "skillReadiness": "...",
  "careerRecommendations": {
    "primaryRoles": ["...", "...", "..."],
    "growthRoles": ["...", "..."],
    "rolesToAvoid": "..."
  },
  "developmentGuidance": "...",
  "clarityIndex": {
    "level": "HIGH",
    "justification": "..."
  }
}`;
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

        // Composite score
        const compositeScore = Math.round(aptPct * 0.35 + empPct * 0.35 + (avgPers / 5) * 100 * 0.30);

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
                    score: Math.min(10, Math.round((avgPers / 5) * 10)),
                    description: `Your personality assessment shows an average trait score of ${avgPers.toFixed(1)}/5.0, with ${topTraits[0].trait} (${topTraits[0].avg.toFixed(1)}/5) as your standout interpersonal quality. ${avgPers >= 3.5 ? 'This indicates strong social and collaborative skills.' : 'There is good potential to further develop interpersonal effectiveness.'}`,
                },
                growthTrajectory: {
                    score: Math.min(10, Math.round(compositeScore / 10)),
                    description: `Your composite performance score of ${compositeScore}/100 (combining aptitude, employability, and personality) places you in the ${compositeScore >= 70 ? 'high-growth' : compositeScore >= 50 ? 'moderate-growth' : 'developing'} trajectory. Targeted improvement in ${weakAptitude[0].name} and ${weakEmp[0].name} would have the highest impact on your overall profile.`,
                },
            },
            employabilitySummary: `Your overall employability profile presents a composite score of ${compositeScore}/100, combining cognitive aptitude (${aptPct}%), employability skills (${empPct}%), and personality fit (${Math.round((avgPers / 5) * 100)}%). Your strongest cognitive ability lies in ${topAptitude[0].name} (${topAptitude[0].pct}%), followed by ${topAptitude[1].name} (${topAptitude[1].pct}%), indicating ${topAptitude[0].pct >= 50 ? 'a strong foundation in these reasoning domains' : 'developing competence with clear pathways for growth'}. On the employability front, ${topEmp[0].name} (${topEmp[0].pct}%) stands out as your most developed professional competency. Your Holland Code of ${scores.riasecCode} (${topCodes.join('-')}) suggests you thrive in environments that emphasize ${topCodeDescriptions[0]} and ${topCodeDescriptions[1]}. To maximize your career potential, prioritizing development in ${weakAptitude[0].name} and ${weakEmp[0].name} would create the most significant improvement in your overall readiness.`,

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
     * Generate AI analysis specifically for student aptitude assessments
     */
    async generateStudentAnalysis(
        profile: StudentProfile,
        aptitudeScores: Record<string, { correct: number; total: number; percentage: number }>,
    ): Promise<StudentAiAnalysisResult | null> {
        if (!this.apiKey) {
            this.logger.warn('AI analysis skipped - no API key configured');
            return this.getStudentFallbackAnalysis(aptitudeScores);
        }

        const startTime = Date.now();
        const prompt = this.buildStudentPrompt(profile, aptitudeScores);

        this.logger.logBusinessEvent('GEMINI_STUDENT_API_REQUEST', {
            student: profile.fullName,
            promptLength: prompt.length,
        });

        try {
            const response = await fetch(`${this.apiUrl}?key=${this.apiKey}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }],
                    generationConfig: {
                        temperature: 0.7,
                        maxOutputTokens: 2048,
                        responseMimeType: 'application/json',
                    },
                }),
            });

            const duration = Date.now() - startTime;

            if (!response.ok) {
                const error = await response.text();
                this.logger.error(`Gemini API error: ${error}`, undefined, 'AiAnalysisService');
                return this.getStudentFallbackAnalysis(aptitudeScores);
            }

            const data = await response.json();
            const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;

            if (!generatedText) {
                this.logger.warn('Empty response from Gemini');
                return this.getStudentFallbackAnalysis(aptitudeScores);
            }

            const analysis = JSON.parse(generatedText) as StudentAiAnalysisResult;

            this.logger.logBusinessEvent('GEMINI_STUDENT_API_SUCCESS', {
                student: profile.fullName,
                duration: `${duration}ms`,
            });

            return analysis;
        } catch (error) {
            this.logger.error(`Student AI analysis failed: ${error}`, undefined, 'AiAnalysisService');
            return this.getStudentFallbackAnalysis(aptitudeScores);
        }
    }

    /**
     * Build student-focused AI prompt
     * Delegates to extracted prompt builder for maintainability
     */
    private buildStudentPrompt(
        profile: StudentProfile,
        aptitudeScores: Record<string, { correct: number; total: number; percentage: number }>,
    ): string {
        return buildStudentPromptFn(profile, aptitudeScores);
    }

    // Original inline prompt moved to: prompts/student.prompt.ts
    // This reduces service size by ~80 lines

    /**
        const scoreLines = Object.entries(aptitudeScores)
            .filter(([key]) => key !== 'overall')
            .map(([section, data]) => `- ${section}: ${data.percentage}%`)
            .join('\n');

        const overallScore = aptitudeScores['overall']?.percentage || 0;

        return `You are a warm, encouraging, but direct senior career mentor and teacher for school students. 
Generate a personalized "Student Persona" and career guidance based on their aptitude test scores.

## CORE RULES (CRITICAL):
1. **"AVERAGE" IS THE FLOOR**: NEVER use words like "Weak", "Poor", "Bad", "Low", or "Below Average". 
   - If a score is low, describe it as "**Average**", "**Developing**", or "**Ready for Growth**".
   - Example: Instead of "Low numerical skills", say "Your numerical skills are developing and can be improved with practice."
2. **TEACHER TONE**: Be specific, actionable, and inspiring. Talk *to* the student, not *about* them.
3. **SMART CAREER MATCHING**: Suggest careers that:
   - **MAXIMIZE** their high-scoring areas.
   - **MINIMIZE** reliance on their lower-scoring areas.
   - Example: High Verbal + "Average" Math -> Suggest Law, Journalism, Psychology (Avoid Engineering/Finance).
4. **NO GENERIC ADVICE**: Instead of "Improve time management", say "Try the Pomodoro technique (25 min work, 5 min break)."

## STUDENT PROFILE
Name: ${profile.fullName}
${profile.grade ? `Grade: ${profile.grade}` : ''}
${profile.schoolName ? `School: ${profile.schoolName}` : ''}
${profile.location ? `Location: ${profile.location}` : ''}

## APTITUDE TEST RESULTS (0-100%)
${scoreLines}
- Overall Score: ${overallScore}%

## GENERATE THE FOLLOWING IN JSON FORMAT:

1. **studentPersona**:
   - **title**: A creative, positive title summarizing their brain type (e.g., "The Logical Architect", "The Emerging Explorer", "The Creative Strategist").
   - **description**: 2 sentences explaining their learning style based on their score mix.
   - **superpower**: One unique strength derived from their highest scores (or "Curiosity" if scores are balanced).
2. **overallSummary**: 2-3 sentences summarizing their cognitive profile (Warm tone).
3. **strengthsAnalysis**: Highlight 2-3 strongest areas.
4. **areasForGrowth**: 2-3 areas to develop (Use "Developing" or "Focus Area" language only).
5. **academicStreams**: 
   - recommended: Array of 2-3 streams (e.g., "Science with Math", "Humanities", "Commerce").
   - reasoning: Why these fit their detailed profile.
6. **careerGuidance**:
   - **suggestedCareers**: Array of objects with:
     - "role": Job title
     - "fitReason": Specific reason linking to their scores (e.g., "Good fit because it uses your high Verbal skill but doesn't require complex Math").
   - **skillsToDevelop**: 4-5 actionable skills.
7. **studyTips**: Specific, actionable study techniques.
8. **nextSteps**: Immediate recommended actions.

Respond ONLY in this JSON format:
{
  "studentPersona": {
    "title": "...",
    "description": "...",
    "superpower": "..."
  },
  "overallSummary": "...",
  "strengthsAnalysis": "...",
  "areasForGrowth": "...",
  "academicStreams": {
    "recommended": ["...", "..."],
    "reasoning": "..."
  },
  "careerGuidance": {
    "suggestedCareers": [
      { "role": "...", "fitReason": "..." },
      { "role": "...", "fitReason": "..." }
    ],
    "skillsToDevelop": ["...", "..."]
  },
  "studyTips": "...",
  "nextSteps": "..."
}`;
    }

    /**
     * Fallback analysis for students when AI is unavailable
     */
    private getStudentFallbackAnalysis(
        aptitudeScores: Record<string, { correct: number; total: number; percentage: number }>,
    ): StudentAiAnalysisResult {
        // Find top strengths
        const sections = Object.entries(aptitudeScores)
            .filter(([key]) => key !== 'overall')
            .sort((a, b) => b[1].percentage - a[1].percentage);

        const topStrengths = sections.slice(0, 2).map(([name]) => name);
        const weakAreas = sections.slice(-2).map(([name]) => name);
        const overallScore = aptitudeScores['overall']?.percentage || 0;

        // Determine academic streams based on strengths
        const streams: string[] = [];
        if (topStrengths.some(s => s.includes('Numerical') || s.includes('Mechanical'))) {
            streams.push('Science with Mathematics');
        }
        if (topStrengths.some(s => s.includes('Verbal') || s.includes('Abstract'))) {
            streams.push('Humanities');
        }
        if (topStrengths.some(s => s.includes('Spatial') || s.includes('Mechanical'))) {
            streams.push('Engineering');
        }
        if (streams.length === 0) streams.push('Commerce', 'Humanities');

        return {
            studentPersona: {
                title: overallScore >= 70 ? 'The Analytical Achiever' : 'The Practical Learner',
                description: `You approach problems with ${topStrengths[0] ? 'structured thinking' : 'curiosity'} and learn best through ${topStrengths.includes('Spatial') ? 'visual aids' : 'practical application'}.`,
                superpower: topStrengths[0] || 'Adaptability'
            },
            overallSummary: `Based on your assessment results, you demonstrate ${overallScore >= 70 ? 'strong' : overallScore >= 50 ? 'moderate' : 'developing'} cognitive abilities. Your profile shows particular strength in ${topStrengths.join(' and ')}.`,
            strengthsAnalysis: `You excel in ${topStrengths.join(' and ')}, which indicates strong ${topStrengths.includes('Numerical') ? 'logical-mathematical' : 'analytical'} thinking abilities. These skills are valuable for many academic and career paths.`,
            areasForGrowth: `You have an opportunity to further develop your ${weakAreas.join(' and ')} skills. Consistent practice in these areas will round out your profile.`,
            academicStreams: {
                recommended: streams.slice(0, 3),
                reasoning: `Based on your strength in ${topStrengths[0]}, these streams align well with your natural abilities and interests.`,
            },
            careerGuidance: {
                suggestedCareers: this.getSuggestedCareers(topStrengths).map(role => ({
                    role,
                    fitReason: `Matches your strength in ${topStrengths[0] || 'general aptitude'}`
                })),
                skillsToDevelop: ['Critical Thinking', 'Problem Solving', 'Time Management', 'Communication', 'Digital Literacy'],
            },
            studyTips: `Focus on consistent practice in your developing areas while leveraging your strengths. Use visual aids and practical examples to reinforce learning.`,
            nextSteps: `Discuss these results with your school counselor. Explore extracurricular activities that align with your strengths and consider career orientation programs.`,
        };
    }

    /**
     * Get suggested careers based on aptitude strengths
     */
    private getSuggestedCareers(topStrengths: string[]): string[] {
        const careerMap: Record<string, string[]> = {
            'Numerical Reasoning': ['Data Scientist', 'Financial Analyst', 'Accountant', 'Actuary'],
            'Verbal Reasoning': ['Lawyer', 'Journalist', 'Content Writer', 'Public Relations'],
            'Abstract-Fluid Reasoning': ['Research Scientist', 'Software Developer', 'Strategic Consultant'],
            'Spatial Ability': ['Architect', 'Industrial Designer', 'Pilot', 'Surgeon'],
            'Mechanical Reasoning': ['Mechanical Engineer', 'Automobile Engineer', 'Quality Engineer'],
            'Processing Speed & Accuracy': ['Air Traffic Controller', 'Trader', 'Emergency Responder'],
        };

        const careers: string[] = [];
        for (const strength of topStrengths) {
            const matches = careerMap[strength] || [];
            careers.push(...matches.slice(0, 2));
        }

        // Add some general careers if not enough
        if (careers.length < 5) {
            careers.push('Business Analyst', 'Project Manager', 'Entrepreneur');
        }

        return [...new Set(careers)].slice(0, 6);
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
                    academicStreams: analysis.academicStreams,
                    careerGuidance: analysis.careerGuidance,
                    studyTips: analysis.studyTips,
                    nextSteps: analysis.nextSteps,
                })),
                aiAnalyzedAt: new Date(),
            },
        });

        this.logger.log(`Student AI analysis saved for assessment ${userAssessmentId}`);
    }
}
