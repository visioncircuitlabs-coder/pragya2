import { Injectable, UnauthorizedException, ConflictException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import { randomBytes } from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../email/email.service';
import { LoggerService } from '../logger/logger.service';
import { RegisterDto, LoginDto } from './dto';
import { UserRole } from '@prisma/client';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
        private configService: ConfigService,
        private emailService: EmailService,
        private logger: LoggerService,
    ) {
        this.logger.setContext('AuthService');
    }

    async register(dto: RegisterDto) {
        const startTime = Date.now();

        // Check if user exists
        const existingUser = await this.prisma.user.findUnique({
            where: { email: dto.email.toLowerCase() },
        });

        if (existingUser) {
            this.logger.logSecurityEvent('REGISTRATION_DUPLICATE_EMAIL', {
                severity: 'low',
                details: { email: dto.email.toLowerCase(), role: dto.role },
            });
            throw new ConflictException('User with this email already exists');
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(dto.password, 12);

        // Create user
        const user = await this.prisma.user.create({
            data: {
                email: dto.email.toLowerCase(),
                password: hashedPassword,
                role: dto.role,
            },
        });

        // Create profile based on role
        await this.createProfile(user.id, dto);

        // Generate email verification token
        const verificationToken = await this.createEmailVerificationToken(user.id);

        // Send verification email (non-blocking)
        this.emailService.sendVerificationEmail(user.email, verificationToken).catch(console.error);

        // Generate tokens
        const tokens = await this.generateTokens(user.id, user.email, user.role);

        // Log successful registration
        this.logger.logAuthEvent('REGISTER', {
            userId: user.id,
            email: user.email,
        });

        return {
            user: this.sanitizeUser(user),
            ...tokens,
            message: 'Registration successful. Please verify your email.',
        };
    }

    async login(dto: LoginDto) {
        const startTime = Date.now();

        const user = await this.prisma.user.findUnique({
            where: { email: dto.email.toLowerCase() },
        });

        if (!user) {
            this.logger.logAuthEvent('LOGIN_FAILED', {
                email: dto.email.toLowerCase(),
                reason: 'User not found',
            });
            throw new UnauthorizedException('Invalid credentials');
        }

        if (!user.isActive) {
            this.logger.logAuthEvent('LOGIN_FAILED', {
                userId: user.id,
                email: user.email,
                reason: 'Account deactivated',
            });
            throw new UnauthorizedException('Account is deactivated');
        }

        const isPasswordValid = await bcrypt.compare(dto.password, user.password);
        if (!isPasswordValid) {
            this.logger.logAuthEvent('LOGIN_FAILED', {
                userId: user.id,
                email: user.email,
                reason: 'Invalid password',
            });
            throw new UnauthorizedException('Invalid credentials');
        }

        const tokens = await this.generateTokens(user.id, user.email, user.role);

        // Log successful login
        this.logger.logAuthEvent('LOGIN', {
            userId: user.id,
            email: user.email,
        });

        return {
            user: this.sanitizeUser(user),
            ...tokens,
        };
    }

    async refreshToken(refreshToken: string) {
        const storedToken = await this.prisma.refreshToken.findUnique({
            where: { token: refreshToken },
            include: { user: true },
        });

        if (!storedToken || storedToken.expiresAt < new Date()) {
            this.logger.logSecurityEvent('TOKEN_REFRESH_FAILED', {
                severity: 'low',
                details: { reason: storedToken ? 'Token expired' : 'Token not found' },
            });
            throw new UnauthorizedException('Invalid or expired refresh token');
        }

        // Delete old token
        await this.prisma.refreshToken.delete({
            where: { id: storedToken.id },
        });

        // Generate new tokens
        const tokens = await this.generateTokens(
            storedToken.user.id,
            storedToken.user.email,
            storedToken.user.role,
        );

        this.logger.logAuthEvent('TOKEN_REFRESH', {
            userId: storedToken.user.id,
            email: storedToken.user.email,
        });

        return {
            user: this.sanitizeUser(storedToken.user),
            ...tokens,
        };
    }

    async logout(userId: string, refreshToken?: string) {
        if (refreshToken) {
            await this.prisma.refreshToken.deleteMany({
                where: { token: refreshToken },
            });
        } else {
            // Delete all refresh tokens for user
            await this.prisma.refreshToken.deleteMany({
                where: { userId },
            });
        }

        this.logger.logAuthEvent('LOGOUT', {
            userId,
        });

        return { message: 'Logged out successfully' };
    }

    async verifyEmail(token: string) {
        const verification = await this.prisma.emailVerification.findUnique({
            where: { token },
            include: { user: true },
        });

        if (!verification) {
            this.logger.logSecurityEvent('EMAIL_VERIFICATION_INVALID_TOKEN', {
                severity: 'medium',
                details: { tokenPrefix: token.substring(0, 8) + '...' },
            });
            throw new BadRequestException('Invalid verification token');
        }

        if (verification.expiresAt < new Date()) {
            await this.prisma.emailVerification.delete({ where: { id: verification.id } });
            this.logger.logSecurityEvent('EMAIL_VERIFICATION_EXPIRED', {
                severity: 'low',
                details: { userId: verification.userId },
            });
            throw new BadRequestException('Verification token has expired');
        }

        // Update user as verified
        await this.prisma.user.update({
            where: { id: verification.userId },
            data: { emailVerified: true },
        });

        // Delete verification token
        await this.prisma.emailVerification.delete({
            where: { id: verification.id },
        });

        this.logger.logBusinessEvent('EMAIL_VERIFIED', {
            userId: verification.userId,
            email: verification.user.email,
        });

        return { message: 'Email verified successfully' };
    }

    async resendVerification(email: string) {
        const user = await this.prisma.user.findUnique({
            where: { email: email.toLowerCase() },
        });

        if (!user) {
            // Don't reveal if user exists
            this.logger.log(`Verification resend attempted for non-existent email: ${email.substring(0, 3)}...`);
            return { message: 'If this email exists, a verification link has been sent' };
        }

        if (user.emailVerified) {
            throw new BadRequestException('Email is already verified');
        }

        // Delete old tokens
        await this.prisma.emailVerification.deleteMany({
            where: { userId: user.id },
        });

        // Create new token
        const verificationToken = await this.createEmailVerificationToken(user.id);
        await this.emailService.sendVerificationEmail(user.email, verificationToken);

        this.logger.logBusinessEvent('VERIFICATION_EMAIL_RESENT', {
            userId: user.id,
            email: user.email,
        });

        return { message: 'If this email exists, a verification link has been sent' };
    }

    async getMe(userId: string) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: {
                studentProfile: true,
                jobSeekerProfile: true,
                employerProfile: true,
            },
        });

        if (!user) {
            throw new UnauthorizedException('User not found');
        }

        return this.sanitizeUser(user);
    }

    // Helper methods
    private async createProfile(userId: string, dto: RegisterDto) {
        switch (dto.role) {
            case UserRole.STUDENT:
                await this.prisma.studentProfile.create({
                    data: {
                        userId,
                        fullName: dto.fullName || '',
                    },
                });
                break;
            case UserRole.JOB_SEEKER:
                await this.prisma.jobSeekerProfile.create({
                    data: {
                        userId,
                        fullName: dto.fullName || '',
                    },
                });
                break;
            case UserRole.EMPLOYER:
                await this.prisma.employerProfile.create({
                    data: {
                        userId,
                        companyName: dto.companyName || '',
                    },
                });
                break;
            // ADMIN doesn't need a profile
        }
    }

    private async generateTokens(userId: string, email: string, role: UserRole) {
        const payload = { sub: userId, email, role };

        const accessToken = this.jwtService.sign(payload, {
            secret: this.configService.get('JWT_SECRET'),
            expiresIn: this.configService.get('JWT_EXPIRES_IN') || '15m',
        });

        const refreshToken = randomBytes(40).toString('hex');
        const refreshExpiresAt = new Date();
        refreshExpiresAt.setDate(refreshExpiresAt.getDate() + 7); // 7 days

        await this.prisma.refreshToken.create({
            data: {
                userId,
                token: refreshToken,
                expiresAt: refreshExpiresAt,
            },
        });

        return { accessToken, refreshToken };
    }

    private async createEmailVerificationToken(userId: string): Promise<string> {
        const token = randomBytes(32).toString('hex');
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 24); // 24 hours

        await this.prisma.emailVerification.create({
            data: {
                userId,
                token,
                expiresAt,
            },
        });

        return token;
    }

    private sanitizeUser(user: any) {
        const { password, ...sanitized } = user;
        return sanitized;
    }
}

