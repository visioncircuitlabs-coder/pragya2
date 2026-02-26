import { Controller, Get, Patch, Body, UseGuards, Query, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard, RolesGuard, EmailVerifiedGuard } from '../auth/guards';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
    constructor(private usersService: UsersService) { }

    @Get('profile')
    async getProfile(@CurrentUser('id') userId: string) {
        return this.usersService.getProfile(userId);
    }

    @Patch('profile/student')
    @UseGuards(EmailVerifiedGuard)
    @Roles(UserRole.STUDENT)
    @UseGuards(RolesGuard)
    async updateStudentProfile(
        @CurrentUser('id') userId: string,
        @Body() body: any,
    ) {
        return this.usersService.updateStudentProfile(userId, body);
    }

    @Patch('profile/job-seeker')
    @UseGuards(EmailVerifiedGuard)
    @Roles(UserRole.JOB_SEEKER)
    @UseGuards(RolesGuard)
    async updateJobSeekerProfile(
        @CurrentUser('id') userId: string,
        @Body() body: any,
    ) {
        return this.usersService.updateJobSeekerProfile(userId, body);
    }

    @Patch('profile/employer')
    @UseGuards(EmailVerifiedGuard)
    @Roles(UserRole.EMPLOYER)
    @UseGuards(RolesGuard)
    async updateEmployerProfile(
        @CurrentUser('id') userId: string,
        @Body() body: any,
    ) {
        return this.usersService.updateEmployerProfile(userId, body);
    }

    // Admin endpoints
    @Get('admin/list')
    @Roles(UserRole.ADMIN)
    @UseGuards(RolesGuard)
    async listUsers(
        @Query('page') page?: string,
        @Query('limit') limit?: string,
        @Query('role') role?: UserRole,
    ) {
        return this.usersService.listUsers(
            page ? parseInt(page) : 1,
            limit ? parseInt(limit) : 10,
            role,
        );
    }

    @Patch('admin/:userId/toggle-status')
    @Roles(UserRole.ADMIN)
    @UseGuards(RolesGuard)
    async toggleUserStatus(
        @Param('userId') userId: string,
        @CurrentUser('id') adminId: string,
    ) {
        return this.usersService.toggleUserStatus(userId, adminId);
    }
}
