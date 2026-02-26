import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserRole } from '@prisma/client';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) { }

    async getProfile(userId: string) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: {
                studentProfile: true,
                jobSeekerProfile: true,
                employerProfile: true,
            },
        });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        const { password, ...sanitized } = user;
        return sanitized;
    }

    async updateStudentProfile(userId: string, data: any) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });

        if (!user || user.role !== UserRole.STUDENT) {
            throw new ForbiddenException('Invalid user role');
        }

        return this.prisma.studentProfile.upsert({
            where: { userId },
            update: data,
            create: { userId, fullName: data.fullName || '', ...data },
        });
    }

    async updateJobSeekerProfile(userId: string, data: any) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });

        if (!user || user.role !== UserRole.JOB_SEEKER) {
            throw new ForbiddenException('Invalid user role');
        }

        return this.prisma.jobSeekerProfile.upsert({
            where: { userId },
            update: data,
            create: { userId, fullName: data.fullName || '', ...data },
        });
    }

    async updateEmployerProfile(userId: string, data: any) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });

        if (!user || user.role !== UserRole.EMPLOYER) {
            throw new ForbiddenException('Invalid user role');
        }

        return this.prisma.employerProfile.upsert({
            where: { userId },
            update: data,
            create: { userId, companyName: data.companyName || '', ...data },
        });
    }

    // Admin: List all users
    async listUsers(page = 1, limit = 10, role?: UserRole) {
        const skip = (page - 1) * limit;

        const where = role ? { role } : {};

        const [users, total] = await Promise.all([
            this.prisma.user.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                select: {
                    id: true,
                    email: true,
                    role: true,
                    emailVerified: true,
                    isActive: true,
                    createdAt: true,
                },
            }),
            this.prisma.user.count({ where }),
        ]);

        return {
            users,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        };
    }

    // Admin: Toggle user active status
    async toggleUserStatus(userId: string, adminId: string) {
        if (userId === adminId) {
            throw new ForbiddenException('Cannot deactivate yourself');
        }

        const user = await this.prisma.user.findUnique({ where: { id: userId } });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        return this.prisma.user.update({
            where: { id: userId },
            data: { isActive: !user.isActive },
            select: {
                id: true,
                email: true,
                isActive: true,
            },
        });
    }
}
