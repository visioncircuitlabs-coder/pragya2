import { Controller, Get, Patch, Body, UseGuards, Query, Param } from '@nestjs/common';
import { UsersService } from './users.service';
// TODO: Re-enable EmailVerifiedGuard once email verification is active
import { JwtAuthGuard, RolesGuard } from '../auth/guards';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';
import { UpdateStudentProfileDto, UpdateJobSeekerProfileDto, UpdateEmployerProfileDto } from './dto/update-profile.dto';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
    constructor(private usersService: UsersService) { }

    @Get('profile')
    async getProfile(@CurrentUser('id') userId: string) {
        return this.usersService.getProfile(userId);
    }

    @Patch('profile/student')
    @Roles(UserRole.STUDENT)
    @UseGuards(RolesGuard)
    async updateStudentProfile(
        @CurrentUser('id') userId: string,
        @Body() dto: UpdateStudentProfileDto,
    ) {
        return this.usersService.updateStudentProfile(userId, dto);
    }

    @Patch('profile/job-seeker')
    @Roles(UserRole.JOB_SEEKER)
    @UseGuards(RolesGuard)
    async updateJobSeekerProfile(
        @CurrentUser('id') userId: string,
        @Body() dto: UpdateJobSeekerProfileDto,
    ) {
        return this.usersService.updateJobSeekerProfile(userId, dto);
    }

    @Patch('profile/employer')
    @Roles(UserRole.EMPLOYER)
    @UseGuards(RolesGuard)
    async updateEmployerProfile(
        @CurrentUser('id') userId: string,
        @Body() dto: UpdateEmployerProfileDto,
    ) {
        return this.usersService.updateEmployerProfile(userId, dto);
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
        const pageNum = Math.max(1, Math.min(10000, parseInt(page || '1') || 1));
        const limitNum = Math.max(1, Math.min(100, parseInt(limit || '10') || 10));
        return this.usersService.listUsers(pageNum, limitNum, role);
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
