import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { EmailModule } from './email/email.module';
import { AssessmentsModule } from './assessments/assessments.module';
import { AiAnalysisModule } from './ai-analysis/ai-analysis.module';
import { ReportsModule } from './reports/reports.module';
import { LoggerModule } from './logger/logger.module';
import { RequestIdMiddleware } from './middleware/request-id.middleware';
import { HttpLoggingMiddleware } from './middleware/http-logging.middleware';
import { AllExceptionsFilter } from './filters/all-exceptions.filter';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        // Rate limiting - prevents brute force and DoS attacks
        ThrottlerModule.forRoot([{
            name: 'default',
            ttl: 60000,   // 1 minute window
            limit: 100,   // 100 requests per minute per IP
        }, {
            name: 'auth',
            ttl: 60000,   // 1 minute window
            limit: 10,    // 10 auth attempts per minute (stricter for login/register)
        }]),
        LoggerModule, // Global logging
        PrismaModule,
        AuthModule,
        UsersModule,
        EmailModule,
        AssessmentsModule,
        AiAnalysisModule,
        ReportsModule,
    ],
    providers: [
        // Global rate limiting guard
        {
            provide: APP_GUARD,
            useClass: ThrottlerGuard,
        },
        // Global exception filter
        {
            provide: APP_FILTER,
            useClass: AllExceptionsFilter,
        },
    ],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            // Request ID middleware MUST be first (creates correlation context)
            .apply(RequestIdMiddleware)
            .forRoutes('*')
            // HTTP logging middleware second (logs within context)
            .apply(HttpLoggingMiddleware)
            .forRoutes('*');
    }
}
