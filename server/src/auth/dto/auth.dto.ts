import { IsEmail, IsEnum, IsNotEmpty, IsString, MinLength, IsOptional, Matches } from 'class-validator';
import { UserRole } from '@prisma/client';

export class RegisterDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @MinLength(8, { message: 'Password must be at least 8 characters' })
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
        message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)'
    })
    password: string;

    @IsEnum(UserRole)
    role: UserRole;

    @IsString()
    @IsOptional()
    fullName?: string;

    // For employers
    @IsString()
    @IsOptional()
    companyName?: string;
}

export class LoginDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;
}

export class RefreshTokenDto {
    @IsString()
    @IsNotEmpty()
    refreshToken: string;
}

export class VerifyEmailDto {
    @IsString()
    @IsNotEmpty()
    token: string;
}

export class ResendVerificationDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;
}
