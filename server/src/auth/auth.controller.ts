import { Controller, Post, Body, Get, UseGuards, Req, HttpCode, HttpStatus, ForbiddenException } from '@nestjs/common';
import { Throttle, SkipThrottle } from '@nestjs/throttler';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto, RefreshTokenDto, VerifyEmailDto, ResendVerificationDto } from './dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    // TODO: Re-enable registration after Razorpay verification is approved
    // Registration is temporarily disabled for demo/verification phase
    @Post('register')
    @Throttle({ default: { limit: 5, ttl: 60000 } })
    async register(@Body() dto: RegisterDto) {
        throw new ForbiddenException('Registration is temporarily closed. We are currently undergoing verification. Please check back soon.');
    }

    // Strict rate limit: 5 login attempts per minute (prevents brute force)
    @Post('login')
    @Throttle({ default: { limit: 5, ttl: 60000 } })
    @HttpCode(HttpStatus.OK)
    async login(@Body() dto: LoginDto) {
        return this.authService.login(dto);
    }

    @Post('refresh')
    @HttpCode(HttpStatus.OK)
    async refresh(@Body() dto: RefreshTokenDto) {
        return this.authService.refreshToken(dto.refreshToken);
    }

    @Post('logout')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.OK)
    async logout(@CurrentUser('id') userId: string, @Body() body: { refreshToken?: string }) {
        return this.authService.logout(userId, body.refreshToken);
    }

    @Post('verify-email')
    @Throttle({ default: { limit: 5, ttl: 600000 } })
    @HttpCode(HttpStatus.OK)
    async verifyEmail(@Body() dto: VerifyEmailDto) {
        return this.authService.verifyEmail(dto.token);
    }

    @Post('resend-verification')
    @Throttle({ default: { limit: 5, ttl: 600000 } })
    @HttpCode(HttpStatus.OK)
    async resendVerification(@Body() dto: ResendVerificationDto) {
        return this.authService.resendVerification(dto.email);
    }

    @Get('me')
    @UseGuards(JwtAuthGuard)
    async getMe(@CurrentUser('id') userId: string) {
        return this.authService.getMe(userId);
    }
}
