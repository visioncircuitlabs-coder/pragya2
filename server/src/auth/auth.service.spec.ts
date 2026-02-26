import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { EmailService } from '../email/email.service';
import { LoggerService } from '../logger/logger.service';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

// Mock bcrypt
jest.mock('bcryptjs', () => ({
    hash: jest.fn().mockResolvedValue('hashedPassword'),
    compare: jest.fn(),
}));

describe('AuthService', () => {
    let service: AuthService;
    let prismaService: PrismaService;
    let jwtService: JwtService;

    const mockPrismaService = {
        user: {
            findUnique: jest.fn(),
            create: jest.fn(),
        },
        studentProfile: {
            create: jest.fn(),
        },
        jobSeekerProfile: {
            create: jest.fn(),
        },
        employerProfile: {
            create: jest.fn(),
        },
        emailVerification: {
            create: jest.fn(),
        },
        refreshToken: {
            create: jest.fn(),
        },
    };

    const mockJwtService = {
        sign: jest.fn().mockReturnValue('mockToken'),
        signAsync: jest.fn().mockResolvedValue('mockToken'),
    };

    const mockConfigService = {
        get: jest.fn((key: string) => {
            const config: Record<string, string> = {
                JWT_SECRET: 'test-secret',
                JWT_EXPIRES_IN: '15m',
                JWT_REFRESH_SECRET: 'test-refresh-secret',
                JWT_REFRESH_EXPIRES_IN: '7d',
            };
            return config[key];
        }),
    };

    const mockEmailService = {
        sendVerificationEmail: jest.fn().mockResolvedValue(undefined),
    };

    const mockLoggerService = {
        setContext: jest.fn(),
        log: jest.fn(),
        logAuthEvent: jest.fn(),
        logSecurityEvent: jest.fn(),
        logPerformance: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                { provide: PrismaService, useValue: mockPrismaService },
                { provide: JwtService, useValue: mockJwtService },
                { provide: ConfigService, useValue: mockConfigService },
                { provide: EmailService, useValue: mockEmailService },
                { provide: LoggerService, useValue: mockLoggerService },
            ],
        }).compile();

        service = module.get<AuthService>(AuthService);
        prismaService = module.get<PrismaService>(PrismaService);
        jwtService = module.get<JwtService>(JwtService);

        // Reset all mocks before each test
        jest.clearAllMocks();
    });

    describe('register', () => {
        const registerDto = {
            email: 'test@example.com',
            password: 'Test123!@#',
            role: 'JOB_SEEKER' as const,
            fullName: 'Test User',
        };

        it('should successfully register a new user', async () => {
            mockPrismaService.user.findUnique.mockResolvedValue(null);
            mockPrismaService.user.create.mockResolvedValue({
                id: 'user-123',
                email: 'test@example.com',
                password: 'hashedPassword',
                role: 'JOB_SEEKER',
                emailVerified: false,
                isActive: true,
            });
            mockPrismaService.jobSeekerProfile.create.mockResolvedValue({});
            mockPrismaService.emailVerification.create.mockResolvedValue({ token: 'verify-token' });
            mockPrismaService.refreshToken.create.mockResolvedValue({});

            const result = await service.register(registerDto);

            expect(result).toHaveProperty('user');
            expect(result).toHaveProperty('accessToken');
            expect(result).toHaveProperty('refreshToken');
            expect(result.message).toBe('Registration successful. Please verify your email.');
            expect(mockPrismaService.user.create).toHaveBeenCalled();
        });

        it('should throw ConflictException if user already exists', async () => {
            mockPrismaService.user.findUnique.mockResolvedValue({
                id: 'existing-user',
                email: 'test@example.com',
            });

            await expect(service.register(registerDto)).rejects.toThrow(ConflictException);
        });

        it('should hash the password before storing', async () => {
            mockPrismaService.user.findUnique.mockResolvedValue(null);
            mockPrismaService.user.create.mockResolvedValue({
                id: 'user-123',
                email: 'test@example.com',
                password: 'hashedPassword',
                role: 'JOB_SEEKER',
            });
            mockPrismaService.jobSeekerProfile.create.mockResolvedValue({});
            mockPrismaService.emailVerification.create.mockResolvedValue({ token: 'verify-token' });
            mockPrismaService.refreshToken.create.mockResolvedValue({});

            await service.register(registerDto);

            expect(bcrypt.hash).toHaveBeenCalledWith(registerDto.password, 12);
        });
    });

    describe('login', () => {
        const loginDto = {
            email: 'test@example.com',
            password: 'Test123!@#',
        };

        it('should successfully login a valid user', async () => {
            mockPrismaService.user.findUnique.mockResolvedValue({
                id: 'user-123',
                email: 'test@example.com',
                password: 'hashedPassword',
                role: 'JOB_SEEKER',
                isActive: true,
            });
            (bcrypt.compare as jest.Mock).mockResolvedValue(true);
            mockPrismaService.refreshToken.create.mockResolvedValue({});

            const result = await service.login(loginDto);

            expect(result).toHaveProperty('user');
            expect(result).toHaveProperty('accessToken');
            expect(result).toHaveProperty('refreshToken');
        });

        it('should throw UnauthorizedException for invalid credentials', async () => {
            mockPrismaService.user.findUnique.mockResolvedValue({
                id: 'user-123',
                email: 'test@example.com',
                password: 'hashedPassword',
                role: 'JOB_SEEKER',
                isActive: true,
            });
            (bcrypt.compare as jest.Mock).mockResolvedValue(false);

            await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
        });

        it('should throw UnauthorizedException if user not found', async () => {
            mockPrismaService.user.findUnique.mockResolvedValue(null);

            await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
        });

        it('should throw UnauthorizedException if user is inactive', async () => {
            mockPrismaService.user.findUnique.mockResolvedValue({
                id: 'user-123',
                email: 'test@example.com',
                password: 'hashedPassword',
                role: 'JOB_SEEKER',
                isActive: false,
            });

            await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
        });
    });
});
