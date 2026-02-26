/**
 * Assessment Type Enumeration
 */
export enum AssessmentType {
    APTITUDE = 'APTITUDE',
    SKILLS = 'SKILLS',
    PERSONALITY = 'PERSONALITY',
    FULL_360 = 'FULL_360'
}

/**
 * Assessment Status
 */
export enum AssessmentStatus {
    NOT_STARTED = 'NOT_STARTED',
    IN_PROGRESS = 'IN_PROGRESS',
    COMPLETED = 'COMPLETED',
    EXPIRED = 'EXPIRED'
}

/**
 * Assessment Category
 */
export enum AssessmentCategory {
    LOGICAL = 'LOGICAL',
    NUMERICAL = 'NUMERICAL',
    VERBAL = 'VERBAL',
    SPATIAL = 'SPATIAL',
    COMMUNICATION = 'COMMUNICATION',
    DIGITAL_LITERACY = 'DIGITAL_LITERACY',
    PROBLEM_SOLVING = 'PROBLEM_SOLVING',
    CREATIVITY = 'CREATIVITY',
    LEADERSHIP = 'LEADERSHIP',
    TEAMWORK = 'TEAMWORK'
}

/**
 * Assessment Interface
 */
export interface Assessment {
    id: string;
    userId: string;
    assessmentType: AssessmentType;
    status: AssessmentStatus;
    startedAt?: Date;
    completedAt?: Date;
    totalScore?: number;
    createdAt: Date;
    updatedAt: Date;
}

/**
 * Assessment Result
 */
export interface AssessmentResult {
    id: string;
    assessmentId: string;
    category: AssessmentCategory;
    score: number;
    percentile?: number;
    rawData?: Record<string, any>;
    createdAt: Date;
}

/**
 * Assessment Question
 */
export interface AssessmentQuestion {
    id: string;
    category: AssessmentCategory;
    questionText: string;
    options?: string[];
    correctAnswer?: string | number;
    difficulty: 'EASY' | 'MEDIUM' | 'HARD';
    timeLimit?: number; // in seconds
}

/**
 * Assessment Response
 */
export interface AssessmentResponse {
    questionId: string;
    answer: string | number | string[];
    timeSpent: number; // in seconds
}

/**
 * Assessment Report
 */
export interface AssessmentReport {
    assessment: Assessment;
    results: AssessmentResult[];
    overallScore: number;
    overallPercentile: number;
    strengths: string[];
    areasForImprovement: string[];
    careerRecommendations: string[];
    generatedAt: Date;
}

/**
 * Assessment Pricing
 */
export const ASSESSMENT_PRICING = {
    [AssessmentType.FULL_360]: 999,
    [AssessmentType.APTITUDE]: 299,
    [AssessmentType.SKILLS]: 299,
    [AssessmentType.PERSONALITY]: 299
} as const;
