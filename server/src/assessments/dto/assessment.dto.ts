import { IsString, IsNotEmpty, IsArray, ValidateNested, IsUUID, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

// DTO for starting an assessment
export class StartAssessmentDto {
    @IsString()
    @IsNotEmpty()
    assessmentId: string;
}

// DTO for submitting a single answer
export class SubmitAnswerDto {
    @IsString()
    @IsNotEmpty()
    questionId: string;

    @IsString()
    @IsNotEmpty()
    selectedOptionId: string;
}

// DTO for auto-saving progress
export class SaveProgressDto {
    @IsString()
    @IsNotEmpty()
    userAssessmentId: string;

    @IsString()
    @IsNotEmpty()
    questionId: string;

    @IsString()
    @IsNotEmpty()
    selectedOptionId: string;

    @IsNumber()
    currentQuestionIndex: number;
}

// DTO for submitting all answers at once (bulk submit)
export class SubmitAssessmentDto {
    @IsString()
    @IsNotEmpty()
    userAssessmentId: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => SubmitAnswerDto)
    answers: SubmitAnswerDto[];
}

// Response DTOs (what we send to client - NO correct answers!)
export class QuestionResponseDto {
    id: string;
    section: string;
    text: string;
    textMl?: string;
    orderIndex: number;
    options: OptionResponseDto[];
}

export class OptionResponseDto {
    id: string;
    text: string;
    textMl?: string;
    orderIndex: number;
    // NOTE: isCorrect and scoreValue are NEVER included here
}

export class AssessmentResponseDto {
    id: string;
    title: string;
    description?: string;
    type: string;
    timeLimit?: number;
    totalQuestions: number;
}

export class UserAssessmentResponseDto {
    id: string;
    assessmentId: string;
    status: string;
    startedAt?: Date;
    completedAt?: Date;
    totalScore?: number;
    sectionScores?: Record<string, number>;

    // AI Analysis (populated after completion)
    aiSummary?: string;
    aiInsights?: {
        strengths: string[];
        areasToImprove: string[];
        careerSuggestions: string[];
        personalityProfile?: string;
    };
    aiAnalyzedAt?: Date;
}
