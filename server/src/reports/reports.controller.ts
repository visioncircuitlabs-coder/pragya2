import { Controller, Get, Param, Res, UseGuards, Logger } from '@nestjs/common';
import { Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserRole } from '@prisma/client';

interface JwtUser {
    id: string;
    email: string;
    role: UserRole;
    emailVerified: boolean;
}

@Controller('reports')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ReportsController {
    private readonly logger = new Logger(ReportsController.name);

    constructor(private readonly reportsService: ReportsService) { }

    /**
     * Download PDF report for a completed assessment
     */
    @Get(':userAssessmentId/download')
    @Roles(UserRole.JOB_SEEKER, UserRole.STUDENT)
    async downloadReport(
        @Param('userAssessmentId') userAssessmentId: string,
        @CurrentUser() user: JwtUser,
        @Res() res: Response,
    ): Promise<void> {
        this.logger.log(`Downloading report for assessment: ${userAssessmentId}, user: ${user?.id}`);

        const reportPath = await this.reportsService.getReportPath(userAssessmentId, user.id);

        const fileName = `pragya_report_${userAssessmentId}.pdf`;
        const stat = fs.statSync(reportPath);
        const fileStream = fs.createReadStream(reportPath);

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
        res.setHeader('Content-Length', stat.size);
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');

        fileStream.pipe(res);
    }

    /**
     * Generate report (can be called to regenerate)
     */
    @Get(':userAssessmentId/generate')
    @Roles(UserRole.JOB_SEEKER, UserRole.STUDENT)
    async generateReport(
        @Param('userAssessmentId') userAssessmentId: string,
        @CurrentUser() user: JwtUser,
    ): Promise<{ reportUrl: string }> {
        this.logger.log(`Generating report for assessment: ${userAssessmentId}, user: ${user?.id}`);

        // First verify ownership
        await this.reportsService.getReportPath(userAssessmentId, user.id);

        // Generate new report
        const reportPath = await this.reportsService.generateReport(userAssessmentId);

        return { reportUrl: `/reports/${userAssessmentId}/download` };
    }
}
