import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';

export interface JwtPayload {
    sub: string;
    email: string;
    role: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private configService: ConfigService,
        private prisma: PrismaService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get('JWT_SECRET'),
        });
        console.log('--- JwtStrategy Initialized ---');
        console.log('Secret present:', !!configService.get('JWT_SECRET'));
        console.log('Secret length:', configService.get('JWT_SECRET')?.length);
    }

    async validate(payload: JwtPayload) {
        console.log('--- JWT Validate Start ---');
        console.log('Payload:', payload);
        const user = await this.prisma.user.findUnique({
            where: { id: payload.sub },
        });

        console.log('User found:', user ? user.id : null);

        if (!user || !user.isActive) {
            console.log('User invalid or inactive. Details:', user);
            throw new UnauthorizedException('User not found or inactive');
        }

        console.log('--- JWT Validate Success ---');
        return {
            id: user.id,
            email: user.email,
            role: user.role,
            emailVerified: user.emailVerified,
        };
    }
}
