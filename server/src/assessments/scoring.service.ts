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

// Student personality trait sections (4-point scale)
const STUDENT_PERSONALITY_SECTIONS = [
    'Responsibility & Discipline',
    'Stress Tolerance',
    'Curiosity & Openness',
    'Social Interaction',
    'Team vs Independent Style',
    'Decision-Making Style',
];

// Student readiness sections (4-point scale)
const STUDENT_READINESS_SECTIONS = [
    'Communication & Expression',
    'Problem-Solving Approach',
    'Creativity & Idea Generation',
    'Adaptability',
    'Time Management & Responsibility',
    'Digital Awareness',
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

// Student RIASEC scores (binary forced-choice, max 8 per type)
export interface StudentRiasecScores {
    R: number;
    I: number;
    A: number;
    S: number;
    E: number;
    C: number;
}

// Student Personality scores (4-point scale, 6 questions per trait)
export interface StudentPersonalityScores {
    [trait: string]: {
        score: number;
        maxScore: number; // 24 per trait (6 questions × 4 max)
        level: 'Emerging' | 'Moderate' | 'Strong';
    };
}

// Student Readiness scores (4-point scale, 6 questions per section)
export interface StudentReadinessScores {
    [section: string]: {
        score: number;
        maxScore: number; // 24 per section (6 questions × 4 max)
        percentage: number;
    };
    overall: {
        score: number;
        maxScore: number;
        percentage: number;
    };
}

// Student-specific scores (comprehensive 4-module assessment)
export interface StudentScores {
    aptitude: AptitudeScores;
    riasec: StudentRiasecScores;
    riasecCode: string; // Holland Code (top 3)
    personality: StudentPersonalityScores;
    readiness: StudentReadinessScores;
    weightedScore: number; // Weighted composite score (0-100)
    performanceLevel: 'EXCELLENT' | 'GOOD' | 'AVERAGE' | 'NEEDS_IMPROVEMENT';
    academicReadinessIndex: number; // 0-100
    clarityIndex: number; // 0-100 career direction clarity
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

        // Generate Holland Code (top 3 highest scores, canonical RIASEC order for ties)
        const canonicalOrder = ['R', 'I', 'A', 'S', 'E', 'C'];
        const sortedCodes = (Object.entries(scores) as [keyof RiasecScores, number][])
            .sort((a, b) => {
                if (b[1] !== a[1]) return b[1] - a[1]; // Primary: higher score first
                return canonicalOrder.indexOf(a[0]) - canonicalOrder.indexOf(b[0]); // Tie-breaker: canonical order
            })
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
     * Calculate comprehensive scores for student assessments (4 modules)
     */
    async calculateStudentScores(userAssessmentId: string): Promise<StudentScores> {
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

        // Module 1: Aptitude
        const aptitude = this.calculateAptitudeScores(responsesBySection);

        // Module 2: RIASEC (binary scoring)
        const { scores: riasec, hollandCode: riasecCode } = this.calculateStudentRiasecScores(responsesBySection);

        // Module 3: Personality (3-point scale)
        const personality = this.calculateStudentPersonalityScores(responsesBySection);

        // Module 4: Readiness (4-point scale)
        const readiness = this.calculateStudentReadinessScores(responsesBySection);

        // Composite metrics
        const weightedScore = this.calculateWeightedStudentScore(aptitude, readiness, personality, riasec);
        const performanceLevel = this.getPerformanceLevel(weightedScore);
        const academicReadinessIndex = this.calculateAcademicReadinessIndex(aptitude, readiness);
        const clarityIndex = this.calculateStudentClarityIndex(riasec, personality);
        const { topStrengths, areasForImprovement } = this.getStudentStrengthsAndWeaknesses(aptitude, personality, readiness);

        return {
            aptitude,
            riasec,
            riasecCode,
            personality,
            readiness,
            weightedScore,
            performanceLevel,
            academicReadinessIndex,
            clarityIndex,
            topStrengths,
            areasForImprovement,
        };
    }

    /**
     * Student RIASEC: Binary forced-choice (scoreValue 0 or 1), sum per type
     */
    private calculateStudentRiasecScores(
        responsesBySection: Map<string, any[]>,
    ): { scores: StudentRiasecScores; hollandCode: string } {
        const scores: StudentRiasecScores = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };

        const sectionToCode: Record<string, keyof StudentRiasecScores> = {
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

        // Canonical RIASEC order for tie-breaking
        const canonicalOrder = ['R', 'I', 'A', 'S', 'E', 'C'];
        const sortedCodes = (Object.entries(scores) as [keyof StudentRiasecScores, number][])
            .sort((a, b) => {
                if (b[1] !== a[1]) return b[1] - a[1]; // Primary: higher score first
                return canonicalOrder.indexOf(a[0]) - canonicalOrder.indexOf(b[0]); // Tie-breaker: canonical order
            })
            .map(([code]) => code);
        const hollandCode = sortedCodes.slice(0, 3).join('');

        return { scores, hollandCode };
    }

    /**
     * Student Personality: 4-point scale (A=1, B=2, C=3, D=4), 6 questions per trait
     */
    private calculateStudentPersonalityScores(
        responsesBySection: Map<string, any[]>,
    ): StudentPersonalityScores {
        const scores: StudentPersonalityScores = {};

        for (const trait of STUDENT_PERSONALITY_SECTIONS) {
            const responses = responsesBySection.get(trait) || [];
            if (responses.length === 0) continue;

            const score = responses.reduce((sum, r) => sum + (r.selectedOption.scoreValue || 0), 0);
            const maxScore = responses.length * 4; // 4-point scale
            const minScore = responses.length; // All 1s = minimum possible

            // Normalized: 0% = all 1s (worst), 100% = all 4s (best)
            const percentage = (score - minScore) / (maxScore - minScore) * 100;

            let level: 'Emerging' | 'Moderate' | 'Strong';
            if (percentage < 40) level = 'Emerging';
            else if (percentage < 75) level = 'Moderate';
            else level = 'Strong';

            scores[trait] = { score, maxScore, level };
        }

        return scores;
    }

    /**
     * Student Readiness: 4-point scale (A=4, B=3, C=2, D=1), 6 questions per section
     */
    private calculateStudentReadinessScores(
        responsesBySection: Map<string, any[]>,
    ): StudentReadinessScores {
        const scores: StudentReadinessScores = {
            overall: { score: 0, maxScore: 0, percentage: 0 },
        };

        for (const section of STUDENT_READINESS_SECTIONS) {
            const responses = responsesBySection.get(section) || [];
            if (responses.length === 0) continue;

            const score = responses.reduce((sum, r) => sum + (r.selectedOption.scoreValue || 0), 0);
            const maxScore = responses.length * 4; // 4-point scale
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
     * Student Clarity Index (0-100)
     * Measures career direction focus purely from RIASEC data:
     * Part 1 (0-60): RIASEC std dev — how differentiated interests are
     * Part 2 (0-40): Top-3 Dominance — how much top 3 dominate over bottom 3
     */
    private calculateStudentClarityIndex(
        riasec: StudentRiasecScores,
        _personality: StudentPersonalityScores,
    ): number {
        const riasecValues = Object.values(riasec);
        const totalRiasec = riasecValues.reduce((a, b) => a + b, 0);

        // Part 1 (0-60): RIASEC Focus — std dev of 6 scores
        const riasecMean = totalRiasec / riasecValues.length;
        const riasecVariance = riasecValues.reduce((sum, val) => sum + Math.pow(val - riasecMean, 2), 0) / riasecValues.length;
        const riasecStdDev = Math.sqrt(riasecVariance);
        // Max std dev for binary (0/1) scoring with 8 questions per type ≈ 3.3
        const maxStdDev = 3.3;
        const riasecFocus = Math.min(60, Math.round((riasecStdDev / maxStdDev) * 60));

        // Part 2 (0-40): Top-3 Dominance — ratio of top 3 scores to total
        let top3Dominance = 0;
        if (totalRiasec > 0) {
            const sorted = [...riasecValues].sort((a, b) => b - a);
            const top3Sum = sorted[0] + sorted[1] + sorted[2];
            // Ratio ranges from 0.5 (equal) to 1.0 (all in top 3)
            // Normalize: 0.5 → 0 points, 1.0 → 40 points
            const ratio = top3Sum / totalRiasec;
            top3Dominance = Math.min(40, Math.round(Math.max(0, (ratio - 0.5) / 0.5) * 40));
        }

        return Math.min(100, riasecFocus + top3Dominance);
    }

    /**
     * Calculate weighted composite score for students (0-100)
     * Aptitude (40%), Readiness (30%), Personality (30%)
     * RIASEC focus is reported separately as Clarity Index — not mixed into composite.
     */
    private calculateWeightedStudentScore(
        aptitude: AptitudeScores,
        readiness?: StudentReadinessScores,
        personality?: StudentPersonalityScores,
        _riasec?: StudentRiasecScores,
    ): number {
        // Module 1: Aptitude (40%) — weighted average of section percentages
        let aptitudeScore = 0;
        let aptitudeWeight = 0;
        for (const [section, weight] of Object.entries(STUDENT_SECTION_WEIGHTS)) {
            if (aptitude[section]) {
                aptitudeScore += aptitude[section].percentage * weight;
                aptitudeWeight += weight;
            }
        }
        if (aptitudeWeight > 0 && aptitudeWeight < 1) {
            aptitudeScore = aptitudeScore / aptitudeWeight;
        }

        // Module 2: Readiness (30%) — overall readiness percentage
        const readinessScore = readiness?.overall?.percentage || 0;

        // Module 3: Personality (30%) — normalized trait score as percentage
        // Normalize: min possible = questionsPerTrait * 1, max = questionsPerTrait * scaleMax
        let personalityScore = 0;
        if (personality) {
            const traits = Object.values(personality);
            if (traits.length > 0) {
                personalityScore = traits.reduce((sum, t) => {
                    const minScore = t.maxScore / 4; // number of questions (maxScore / scaleMax)
                    return sum + ((t.score - minScore) / (t.maxScore - minScore)) * 100;
                }, 0) / traits.length;
            }
        }

        const composite = Math.round(
            aptitudeScore * 0.40 +
            readinessScore * 0.30 +
            personalityScore * 0.30
        );

        return Math.min(100, composite);
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
     * 1. Aptitude performance (40 points)
     * 2. Skill readiness (40 points)
     * 3. Consistency across aptitude sections (20 points)
     */
    private calculateAcademicReadinessIndex(aptitude: AptitudeScores, readiness?: StudentReadinessScores): number {
        const sections = Object.entries(aptitude)
            .filter(([key]) => key !== 'overall' && STUDENT_SECTION_WEIGHTS[key])
            .map(([, data]) => data.percentage);

        if (sections.length === 0) return 0;

        // 1. Aptitude Score (0-40)
        const avgAptitude = sections.reduce((a, b) => a + b, 0) / sections.length;
        const aptitudePoints = Math.round((avgAptitude / 100) * 40);

        // 2. Readiness Score (0-40)
        const readinessPercentage = readiness?.overall?.percentage || 0;
        const readinessPoints = Math.round((readinessPercentage / 100) * 40);

        // 3. Consistency Score (0-20): Low variance in aptitude = high consistency
        const mean = avgAptitude;
        const variance = sections.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / sections.length;
        const stdDev = Math.sqrt(variance);
        const consistencyPoints = Math.round(Math.max(0, 20 - (stdDev * 0.4)));

        return Math.min(100, aptitudePoints + readinessPoints + consistencyPoints);
    }

    /**
     * Get top 2 strengths and bottom 2 areas for improvement (aptitude only, for job seekers)
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
     * Get student strengths and growth areas across all 4 modules
     */
    private getStudentStrengthsAndWeaknesses(
        aptitude: AptitudeScores,
        personality: StudentPersonalityScores,
        readiness: StudentReadinessScores,
    ): { topStrengths: string[]; areasForImprovement: string[] } {
        // Collect all scoreable items as { name, percentage }
        const allItems: { name: string; percentage: number }[] = [];

        // Aptitude sections
        for (const [name, data] of Object.entries(aptitude)) {
            if (name !== 'overall' && STUDENT_SECTION_WEIGHTS[name]) {
                allItems.push({ name: `${name} (Aptitude)`, percentage: data.percentage });
            }
        }

        // Personality traits
        for (const [trait, data] of Object.entries(personality)) {
            allItems.push({ name: `${trait} (Personality)`, percentage: Math.round((data.score / data.maxScore) * 100) });
        }

        // Readiness sections
        for (const [section, data] of Object.entries(readiness)) {
            if (section !== 'overall') {
                allItems.push({ name: `${section} (Readiness)`, percentage: data.percentage });
            }
        }

        // Sort by percentage
        allItems.sort((a, b) => b.percentage - a.percentage);

        const topStrengths = allItems.slice(0, 3).map(i => i.name);
        const areasForImprovement = allItems.slice(-3).map(i => i.name);

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
