import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
/* eslint-disable @typescript-eslint/no-var-requires */
const compression = require('compression');
const helmet = require('helmet');
import { AppModule } from './app.module';
import { LoggerService } from './logger/logger.service';

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        bufferLogs: true,
    });

    // Use custom logger globally
    const logger = app.get(LoggerService);
    logger.setContext('Bootstrap');
    app.useLogger(logger);

    // Response compression (gzip) - reduces payload size by 60-80%
    app.use(compression({
        threshold: 1024, // Only compress responses > 1KB
        level: 6,        // Balanced compression level (1-9)
    }));

    // Security headers (XSS, clickjacking, MIME sniffing protection)
    app.use(helmet({
        contentSecurityPolicy: process.env.NODE_ENV === 'production' ? undefined : false,
        crossOriginEmbedderPolicy: false, // Allow embedding for development
    }));

    // CORS configuration
    const isProd = process.env.NODE_ENV === 'production';
    const allowedOrigins = isProd
        ? (process.env.ALLOWED_ORIGINS || 'https://pragya.in').split(',')
        : ['http://localhost:3001', 'http://localhost:3000'];

    app.enableCors({
        origin: allowedOrigins,
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-ID'],
        exposedHeaders: ['Content-Disposition', 'Content-Length'],
    });

    // Global validation pipe
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
        }),
    );

    // Health check (before global prefix so it's at /health)
    const httpAdapter = app.getHttpAdapter();
    httpAdapter.get('/health', (_req: any, res: any) => {
        res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
    });

    // API prefix
    app.setGlobalPrefix('api/v1');

    // Graceful shutdown (close DB connections, finish requests)
    app.enableShutdownHooks();

    const port = process.env.PORT || 4000;
    await app.listen(port);

    // Startup logs
    logger.logBusinessEvent('SERVER_STARTED', {
        port,
        environment: isProd ? 'production' : 'development',
        nodeVersion: process.version,
        securityFeatures: ['helmet', 'rate-limiting', 'cors', 'validation', 'compression'],
    });

    logger.log(`🚀 Pragya API running on http://localhost:${port}/api/v1`);
    logger.log(`📝 Logs: ./logs/ | Retention: 6 months`);
    logger.log(`🔒 Mode: ${isProd ? 'PRODUCTION' : 'DEVELOPMENT'}`);
    logger.log(`🛡️ Security: Helmet + Rate Limiting enabled`);
    logger.log(`📦 Performance: Gzip compression enabled`);
}

bootstrap();

