import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

/**
 * Comprehensive Scoring Service for Pragya 360° Assessment
 * 
 * Calculates scores for all 4 assessment modules:
 * 1. Aptitude: Percentage correct per section
 * 2. RIASEC: Sum per type → Holland Code (top 3)
 * 3. Employability: Weighted scoring by section
 * 4. Personality: Average per trait category
 */

// Section groupings for scoring
const APTITUDE_SECTIONS = [
    'Logical & Analytical Reasoning',
    'Numerical Reasoning',
    'Verbal Reasoning',
    'Spatial & Visual Reasoning',
    'Attention & Speed',
    'Work-Style Problem Solving',
];

// Student assessment aptitude sections
const STUDENT_APTITUDE_SECTIONS = [
    'Numerical Reasoning',
    'Verbal Reasoning',
    'Abstract-Fluid Reasoning',
    'Spatial Ability',
    'Mechanical Reasoning',
    'Processing Speed & Accuracy',
];

// Student section weights for composite scoring (total = 100%)
const STUDENT_SECTION_WEIGHTS: Record<string, number> = {
    'Numerical Reasoning': 0.20,        // Core academic - 20%
    'Verbal Reasoning': 0.20,           // Core academic - 20%
    'Abstract-Fluid Reasoning': 0.20,   // Core academic - 20%
    'Spatial Ability': 0.15,            // Supplementary - 15%
    'Mechanical Reasoning': 0.15,       // Supplementary - 15%
    'Processing Speed & Accuracy': 0.10, // Supplementary - 10%
};

// Combined sections for flexible scoring
const ALL_APTITUDE_SECTIONS = [...new Set([...APTITUDE_SECTIONS, ...STUDENT_APTITUDE_SECTIONS])];

const RIASEC_SECTIONS = [
    'REALISTIC',
    'INVESTIGATIVE',
    'ARTISTIC',
    'SOCIAL',
    'ENTERPRISING',
    'CONVENTIONAL',
];

const EMPLOYABILITY_SECTIONS = [
    'Core Skills',
    'Functional Skills',
    'Behavioral Skills',
];

const PERSONALITY_SECTIONS = [
    'Work Discipline & Task Reliability',
    'Stress Tolerance & Emotional Regulation',
    'Learning & Change Orientation',
    'Social Engagement & Task Focus',
    'Team Compatibility & Cooperation',
    'Integrity & Responsibility',
];

export interface AptitudeScores {
    [section: string]: {
        correct: number;
        total: number;
        percentage: number;
    };
    overall: {
        correct: number;
        total: number;
        percentage: number;
    };
}

export interface RiasecScores {
    R: number; // Realistic
    I: number; // Investigative
    A: number; // Artistic
    S: number; // Social
    E: number; // Enterprising
    C: number; // Conventional
}

export interface EmployabilityScores {
    [section: string]: {
        score: number;
        maxScore: number;
        percentage: number;
    };
    overall: {
        score: number;
        maxScore: number;
        percentage: number;
    };
}

export interface PersonalityScores {
    [trait: string]: {
        score: number;
        maxScore: number;
        average: number; // 1-5 scale
    };
}

export interface ComprehensiveScores {
    aptitude: AptitudeScores;
    riasec: RiasecScores;
    riasecCode: string; // Top 3 letters, e.g., "IRS"
    employability: EmployabilityScores;
    personality: PersonalityScores;
    clarityIndex: number; // 0-100 career direction clarity
}

// Student-specific scores (aptitude-only assessments)
export interface StudentScores {
    aptitude: AptitudeScores;
    weightedScore: number; // Weighted composite score (0-100)
    performanceLevel: 'EXCELLENT' | 'GOOD' | 'AVERAGE' | 'NEEDS_IMPROVEMENT';
    academicReadinessIndex: number; // 0-100, similar to clarityIndex for job seekers
    topStrengths: string[]; // Top 2 performing sections
    areasForImprovement: string[]; // Bottom 2 performing sections
}

@Injectable()
export class ScoringService {
    constructor(private prisma: PrismaService) { }

    /**
     * Calculate all scores for a completed assessment
     */
    async calculateAllScores(userAssessmentId: string): Promise<ComprehensiveScores> {
        // Get all user responses with question and option details
        const responses = await this.prisma.userResponse.findMany({
            where: { userAssessmentId },
            include: {
                question: true,
                selectedOption: true,
            },
        });

        // Group responses by section
        const responsesBySection = new Map<string, typeof responses>();
        for (const response of responses) {
            const section = response.question.section;
            if (!responsesBySection.has(section)) {
                responsesBySection.set(section, []);
            }
            responsesBySection.get(section)!.push(response);
        }

        // Calculate scores for each module
        const aptitude = this.calculateAptitudeScores(responsesBySection);
        const { scores: riasec, hollandCode: riasecCode } = this.calculateRiasecScores(responsesBySection);
        const employability = this.calculateEmployabilityScores(responsesBySection);
        const personality = this.calculatePersonalityScores(responsesBySection);
        const clarityIndex = this.calculateClarityIndex(riasec, personality);

        return {
            aptitude,
            riasec,
            riasecCode,
            employability,
            personality,
            clarityIndex,
        };
    }

    /**
     * Aptitude: Count correct answers per section as percentage
     */
    private calculateAptitudeScores(
        responsesBySection: Map<string, any[]>,
    ): AptitudeScores {
        const scores: AptitudeScores = {
            overall: { correct: 0, total: 0, percentage: 0 },
        };

        for (const section of ALL_APTITUDE_SECTIONS) {
            const responses = responsesBySection.get(section) || [];
            // Skip sections with no responses (different assessment type)
            if (responses.length === 0) continue;

            const correct = responses.filter(r => r.selectedOption.isCorrect).length;
            const total = responses.length;
            const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;

            scores[section] = { correct, total, percentage };
            scores.overall.correct += correct;
            scores.overall.total += total;
        }

        scores.overall.percentage =
            scores.overall.total > 0
                ? Math.round((scores.overall.correct / scores.overall.total) * 100)
                : 0;

        return scores;
    }

    /**
     * RIASEC: Sum scoreValue per type, return Holland Code (top 3)
     */
    private calculateRiasecScores(
        responsesBySection: Map<string, any[]>,
    ): { scores: RiasecScores; hollandCode: string } {
        const scores: RiasecScores = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };

        // Map section names to RIASEC codes
        const sectionToCode: Record<string, keyof RiasecScores> = {
            REALISTIC: 'R',
            INVESTIGATIVE: 'I',
            ARTISTIC: 'A',
            SOCIAL: 'S',
            ENTERPRISING: 'E',
            CONVENTIONAL: 'C',
        };

        for (const section of RIASEC_SECTIONS) {
            const responses = responsesBySection.get(section) || [];
            const code = sectionToCode[section];
            scores[code] = responses.reduce((sum, r) => sum + (r.selectedOption.scoreValue || 0), 0);
        }

        // Generate Holland Code (top 3 highest scores)
        const sortedCodes = (Object.entries(scores) as [keyof RiasecScores, number][])
            .sort((a, b) => b[1] - a[1])
            .map(([code]) => code);
        const hollandCode = sortedCodes.slice(0, 3).join('');

        return { scores, hollandCode };
    }

    /**
     * Employability: Sum scores per section, calculate percentage
     * Max score = 4 points per question (best answer)
     */
    private calculateEmployabilityScores(
        responsesBySection: Map<string, any[]>,
    ): EmployabilityScores {
        const scores: EmployabilityScores = {
            overall: { score: 0, maxScore: 0, percentage: 0 },
        };

        for (const section of EMPLOYABILITY_SECTIONS) {
            const responses = responsesBySection.get(section) || [];
            const score = responses.reduce((sum, r) => sum + (r.selectedOption.scoreValue || 0), 0);
            const maxScore = responses.length * 4; // 4 is max per question
            const percentage = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;

            scores[section] = { score, maxScore, percentage };
            scores.overall.score += score;
            scores.overall.maxScore += maxScore;
        }

        scores.overall.percentage =
            scores.overall.maxScore > 0
                ? Math.round((scores.overall.score / scores.overall.maxScore) * 100)
                : 0;

        return scores;
    }

    /**
     * Personality: Average score per trait (1-5 Likert scale)
     */
    private calculatePersonalityScores(
        responsesBySection: Map<string, any[]>,
    ): PersonalityScores {
        const scores: PersonalityScores = {};

        for (const trait of PERSONALITY_SECTIONS) {
            const responses = responsesBySection.get(trait) || [];
            const score = responses.reduce((sum, r) => sum + (r.selectedOption.scoreValue || 0), 0);
            const maxScore = responses.length * 5; // 5-point Likert scale
            const average = responses.length > 0 ? Math.round((score / responses.length) * 10) / 10 : 0;

            scores[trait] = { score, maxScore, average };
        }

        return scores;
    }

    /**
     * Career Direction Clarity Index (0-100)
     * 
     * Measures how focused the candidate's interests and traits are:
     * - High clarity = strong preferences in 1-2 RIASEC types + consistent personality
     * - Low clarity = scattered interests across many types
     */
    private calculateClarityIndex(
        riasec: RiasecScores,
        personality: PersonalityScores,
    ): number {
        // 1. RIASEC Focus Score (0-50)
        // Use standard deviation to measure how focused interests are
        // Higher std dev = more differentiated/focused interests = clearer direction
        const riasecValues = Object.values(riasec);
        const riasecMean = riasecValues.reduce((a, b) => a + b, 0) / riasecValues.length;
        const riasecVariance = riasecValues.reduce((sum, val) => sum + Math.pow(val - riasecMean, 2), 0) / riasecValues.length;
        const riasecStdDev = Math.sqrt(riasecVariance);
        // Max possible std dev with 6 RIASEC types, 8 questions, 4-point scale (max=32 per type)
        // Theoretical max std dev ≈ 13 (all points in one category)
        const maxPossibleStdDev = 13;
        const riasecFocus = Math.min(50, Math.round((riasecStdDev / maxPossibleStdDev) * 50));


        // 2. Personality Consistency Score (0-50)
        // Higher average across all traits = more work-ready
        const personalityAverages = Object.values(personality).map(p => p.average);
        const avgPersonality = personalityAverages.length > 0
            ? personalityAverages.reduce((a, b) => a + b, 0) / personalityAverages.length
            : 0;
        const personalityScore = Math.round((avgPersonality / 5) * 50);

        return Math.min(100, riasecFocus + personalityScore);
    }

    /**
     * Get section scores for display (simplified format)
     */
    getSectionScoresForStorage(scores: ComprehensiveScores): Record<string, number> {
        const result: Record<string, number> = {};

        // Aptitude sections (includes both job seeker and student sections)
        for (const section of ALL_APTITUDE_SECTIONS) {
            if (scores.aptitude[section]) {
                result[section] = scores.aptitude[section].percentage;
            }
        }

        // RIASEC scores
        result.RIASEC_R = scores.riasec.R;
        result.RIASEC_I = scores.riasec.I;
        result.RIASEC_A = scores.riasec.A;
        result.RIASEC_S = scores.riasec.S;
        result.RIASEC_E = scores.riasec.E;
        result.RIASEC_C = scores.riasec.C;

        // Employability percentages
        for (const section of EMPLOYABILITY_SECTIONS) {
            if (scores.employability[section]) {
                result[section] = scores.employability[section].percentage;
            }
        }

        // Personality averages
        for (const trait of PERSONALITY_SECTIONS) {
            if (scores.personality[trait]) {
                result[trait] = scores.personality[trait].average;
            }
        }

        return result;
    }

    /**
     * Calculate scores specifically for student assessments (aptitude-only)
     * Uses weighted scoring and calculates academic readiness index
     */
    async calculateStudentScores(userAssessmentId: string): Promise<StudentScores> {
        // Get all user responses with question and option details
        const responses = await this.prisma.userResponse.findMany({
            where: { userAssessmentId },
            include: {
                question: true,
                selectedOption: true,
            },
        });

        // Group responses by section
        const responsesBySection = new Map<string, typeof responses>();
        for (const response of responses) {
            const section = response.question.section;
            if (!responsesBySection.has(section)) {
                responsesBySection.set(section, []);
            }
            responsesBySection.get(section)!.push(response);
        }

        // Calculate aptitude scores
        const aptitude = this.calculateAptitudeScores(responsesBySection);

        // Calculate weighted composite score
        const weightedScore = this.calculateWeightedStudentScore(aptitude);

        // Determine performance level
        const performanceLevel = this.getPerformanceLevel(weightedScore);

        // Calculate academic readiness index
        const academicReadinessIndex = this.calculateAcademicReadinessIndex(aptitude);

        // Find top strengths and areas for improvement
        const { topStrengths, areasForImprovement } = this.getStrengthsAndWeaknesses(aptitude);

        return {
            aptitude,
            weightedScore,
            performanceLevel,
            academicReadinessIndex,
            topStrengths,
            areasForImprovement,
        };
    }

    /**
     * Calculate weighted composite score for students (0-100)
     */
    private calculateWeightedStudentScore(aptitude: AptitudeScores): number {
        let weightedSum = 0;
        let totalWeight = 0;

        for (const [section, weight] of Object.entries(STUDENT_SECTION_WEIGHTS)) {
            if (aptitude[section]) {
                weightedSum += aptitude[section].percentage * weight;
                totalWeight += weight;
            }
        }

        // Normalize if not all sections were answered
        if (totalWeight > 0 && totalWeight < 1) {
            weightedSum = weightedSum / totalWeight;
        }

        return Math.round(weightedSum);
    }

    /**
     * Get performance level based on weighted score
     */
    private getPerformanceLevel(score: number): 'EXCELLENT' | 'GOOD' | 'AVERAGE' | 'NEEDS_IMPROVEMENT' {
        if (score >= 80) return 'EXCELLENT';
        if (score >= 60) return 'GOOD';
        if (score >= 40) return 'AVERAGE';
        return 'NEEDS_IMPROVEMENT';
    }

    /**
     * Calculate Academic Readiness Index (0-100) for students
     * Based on:
     * 1. Overall performance (50 points)
     * 2. Balance across sections - consistent performance (50 points)
     */
    private calculateAcademicReadinessIndex(aptitude: AptitudeScores): number {
        const sections = Object.entries(aptitude)
            .filter(([key]) => key !== 'overall' && STUDENT_SECTION_WEIGHTS[key])
            .map(([, data]) => data.percentage);

        if (sections.length === 0) return 0;

        // 1. Performance Score (0-50): Based on overall average
        const avgPerformance = sections.reduce((a, b) => a + b, 0) / sections.length;
        const performanceScore = Math.round((avgPerformance / 100) * 50);

        // 2. Consistency Score (0-50): Low variance = high consistency
        const mean = avgPerformance;
        const variance = sections.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / sections.length;
        const stdDev = Math.sqrt(variance);
        // Max std dev is around 50 for extreme cases (0 and 100 scores)
        // Low std dev (< 10) = high consistency
        const consistencyScore = Math.round(Math.max(0, 50 - stdDev));

        return Math.min(100, performanceScore + consistencyScore);
    }

    /**
     * Get top 2 strengths and bottom 2 areas for improvement
     */
    private getStrengthsAndWeaknesses(aptitude: AptitudeScores): {
        topStrengths: string[];
        areasForImprovement: string[];
    } {
        const sections = Object.entries(aptitude)
            .filter(([key]) => key !== 'overall' && STUDENT_SECTION_WEIGHTS[key])
            .sort((a, b) => b[1].percentage - a[1].percentage);

        const topStrengths = sections.slice(0, 2).map(([name]) => name);
        const areasForImprovement = sections.slice(-2).map(([name]) => name);

        return { topStrengths, areasForImprovement };
    }

    /**
     * Calculate extended performance metrics for job seekers
     * Computes a composite score, performance level, top strengths, and areas for improvement
     */
    calculateJobSeekerPerformanceMetrics(scores: ComprehensiveScores): {
        compositeScore: number;
        performanceLevel: 'EXCELLENT' | 'GOOD' | 'AVERAGE' | 'NEEDS_IMPROVEMENT';
        topStrengths: string[];
        areasForImprovement: string[];
    } {
        const aptitudeOverall = scores.aptitude.overall.percentage;
        const employabilityOverall = scores.employability.overall.percentage;

        const personalityAverages = Object.values(scores.personality).map(p => p.average);
        const avgPersonality = personalityAverages.length > 0
            ? personalityAverages.reduce((a, b) => a + b, 0) / personalityAverages.length
            : 0;
        const personalityPct = (avgPersonality / 5) * 100;

        const compositeScore = Math.round(
            aptitudeOverall * 0.35 + employabilityOverall * 0.35 + personalityPct * 0.30
        );

        const performanceLevel = this.getPerformanceLevel(compositeScore);

        const aptitudeSections = Object.entries(scores.aptitude)
            .filter(([key]) => key !== 'overall')
            .sort((a, b) => b[1].percentage - a[1].percentage);

        const topStrengths = aptitudeSections.slice(0, 3).map(([name]) => name);
        const areasForImprovement = aptitudeSections.slice(-2).map(([name]) => name);

        return { compositeScore, performanceLevel, topStrengths, areasForImprovement };
    }
}
