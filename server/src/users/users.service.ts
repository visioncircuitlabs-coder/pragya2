import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserRole } from '@prisma/client';
import { UpdateStudentProfileDto, UpdateJobSeekerProfileDto, UpdateEmployerProfileDto } from './dto/update-profile.dto';

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

    async updateStudentProfile(userId: string, dto: UpdateStudentProfileDto) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });

        if (!user || user.role !== UserRole.STUDENT) {
            throw new ForbiddenException('Invalid user role');
        }

        return this.prisma.studentProfile.upsert({
            where: { userId },
            update: {
                ...(dto.fullName !== undefined && { fullName: dto.fullName }),
                ...(dto.grade !== undefined && { grade: dto.grade }),
                ...(dto.schoolName !== undefined && { schoolName: dto.schoolName }),
                ...(dto.gender !== undefined && { gender: dto.gender }),
                ...(dto.location !== undefined && { location: dto.location }),
            },
            create: {
                userId,
                fullName: dto.fullName || '',
                grade: dto.grade,
                schoolName: dto.schoolName,
                gender: dto.gender,
                location: dto.location,
            },
        });
    }

    async updateJobSeekerProfile(userId: string, dto: UpdateJobSeekerProfileDto) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });

        if (!user || user.role !== UserRole.JOB_SEEKER) {
            throw new ForbiddenException('Invalid user role');
        }

        return this.prisma.jobSeekerProfile.upsert({
            where: { userId },
            update: {
                ...(dto.fullName !== undefined && { fullName: dto.fullName }),
                ...(dto.gender !== undefined && { gender: dto.gender }),
                ...(dto.location !== undefined && { location: dto.location }),
                ...(dto.state !== undefined && { state: dto.state }),
                ...(dto.phone !== undefined && { phone: dto.phone }),
                ...(dto.educationLevel !== undefined && { educationLevel: dto.educationLevel }),
                ...(dto.fieldOfStudy !== undefined && { fieldOfStudy: dto.fieldOfStudy }),
                ...(dto.currentStatus !== undefined && { currentStatus: dto.currentStatus }),
                ...(dto.yearsOfExperience !== undefined && { yearsOfExperience: dto.yearsOfExperience }),
            },
            create: {
                userId,
                fullName: dto.fullName || '',
                gender: dto.gender,
                location: dto.location,
                state: dto.state,
                phone: dto.phone,
                educationLevel: dto.educationLevel,
                fieldOfStudy: dto.fieldOfStudy,
                currentStatus: dto.currentStatus,
                yearsOfExperience: dto.yearsOfExperience,
            },
        });
    }

    async updateEmployerProfile(userId: string, dto: UpdateEmployerProfileDto) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });

        if (!user || user.role !== UserRole.EMPLOYER) {
            throw new ForbiddenException('Invalid user role');
        }

        return this.prisma.employerProfile.upsert({
            where: { userId },
            update: {
                ...(dto.companyName !== undefined && { companyName: dto.companyName }),
                ...(dto.industry !== undefined && { industry: dto.industry }),
                ...(dto.companySize !== undefined && { companySize: dto.companySize }),
                ...(dto.website !== undefined && { website: dto.website }),
                ...(dto.contactPerson !== undefined && { contactPerson: dto.contactPerson }),
                ...(dto.phone !== undefined && { phone: dto.phone }),
                ...(dto.address !== undefined && { address: dto.address }),
            },
            create: {
                userId,
                companyName: dto.companyName || '',
                industry: dto.industry,
                companySize: dto.companySize,
                website: dto.website,
                contactPerson: dto.contactPerson,
                phone: dto.phone,
                address: dto.address,
            },
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
