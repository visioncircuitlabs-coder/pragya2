import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    UseGuards,
    Req,
    HttpCode,
    HttpStatus,
} from '@nestjs/common';
import { Request } from 'express';
import { AssessmentsService } from './assessments.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserRole } from '@prisma/client';
import { StartAssessmentDto, SubmitAssessmentDto, SaveProgressDto } from './dto';

// The JWT strategy returns this user object
interface JwtUser {
    id: string;       // Changed from userId to id
    email: string;
    role: UserRole;
    emailVerified: boolean;
}

// Extended request with user info
interface AuthenticatedRequest extends Request {
    user: JwtUser;
}

@Controller('assessments')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AssessmentsController {
    constructor(private readonly assessmentsService: AssessmentsService) { }

    /**
     * Get all assessments available for the current user
     * Protected: Requires authentication
     */
    @Get()
    async getAvailableAssessments(@CurrentUser() user: JwtUser) {
        return this.assessmentsService.getAvailableAssessments(user.id, user.role);
    }

    /**
     * Get assessment questions (without correct answers)
     * Protected: JOB_SEEKER only for Employability Assessment
     */
    @Get(':id/questions')
    @Roles(UserRole.JOB_SEEKER, UserRole.STUDENT)
    async getAssessmentQuestions(
        @Param('id') assessmentId: string,
        @CurrentUser() user: JwtUser,
    ) {
        return this.assessmentsService.getAssessmentQuestions(assessmentId, user.id, user.role);
    }

    /**
     * Start an assessment attempt
     * Protected: Role-based access
     */
    @Post('start')
    @HttpCode(HttpStatus.OK)
    @Roles(UserRole.JOB_SEEKER, UserRole.STUDENT)
    async startAssessment(
        @Body() dto: StartAssessmentDto,
        @CurrentUser() user: JwtUser,
        @Req() req: AuthenticatedRequest,
    ) {
        const ipAddress = req.ip || req.headers['x-forwarded-for']?.toString();
        const userAgent = req.headers['user-agent'];

        return this.assessmentsService.startAssessment(
            dto.assessmentId,
            user.id,
            user.role,
            ipAddress,
            userAgent,
        );
    }

    /**
     * Save progress (auto-save during assessment)
     * Protected: Only the owner can save
     */
    @Post('save-progress')
    @HttpCode(HttpStatus.OK)
    @Roles(UserRole.JOB_SEEKER, UserRole.STUDENT)
    async saveProgress(
        @Body() dto: SaveProgressDto,
        @CurrentUser() user: JwtUser,
    ) {
        return this.assessmentsService.saveProgress(
            dto.userAssessmentId,
            user.id,
            dto.questionId,
            dto.selectedOptionId,
            dto.currentQuestionIndex,
        );
    }

    /**
     * Submit assessment answers and get results
     * Protected: Only the owner can submit
     * SECURITY: Scoring happens server-side only
     */
    @Post('submit')
    @HttpCode(HttpStatus.OK)
    @Roles(UserRole.JOB_SEEKER, UserRole.STUDENT)
    async submitAssessment(
        @Body() dto: SubmitAssessmentDto,
        @CurrentUser() user: JwtUser,
    ) {
        return this.assessmentsService.submitAssessment(
            dto.userAssessmentId,
            user.id,
            dto.answers,
        );
    }

    /**
     * Get user's assessment result
     * Protected: Only owner can view
     */
    @Get('results/:id')
    async getResult(
        @Param('id') userAssessmentId: string,
        @CurrentUser() user: JwtUser,
    ) {
        return this.assessmentsService.getUserAssessmentResult(userAssessmentId, user.id);
    }

    /**
     * Get all assessment results for current user
     */
    @Get('my-results')
    async getMyResults(@CurrentUser() user: JwtUser) {
        return this.assessmentsService.getUserAssessments(user.id);
    }
}
