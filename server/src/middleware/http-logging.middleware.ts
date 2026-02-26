import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { LoggerService } from '../logger/logger.service';
import { sanitizeBody, sanitizeHeaders } from '../logger/sanitizer';

/**
 * HTTP Logging Middleware
 * Logs all incoming requests and outgoing responses
 * Must run AFTER RequestIdMiddleware
 */
@Injectable()
export class HttpLoggingMiddleware implements NestMiddleware {
    constructor(private readonly logger: LoggerService) { }

    use(req: Request, res: Response, next: NextFunction): void {
        const startTime = Date.now();
        const { method, originalUrl, ip } = req;
        const userAgent = req.get('user-agent') || '';

        // Log request (skip health checks and static assets)
        if (!this.shouldSkip(originalUrl)) {
            this.logger.logHttpRequest({
                method,
                url: originalUrl,
                ip,
                userAgent,
                body: ['POST', 'PUT', 'PATCH'].includes(method) ? sanitizeBody(req.body) : undefined,
            });
        }

        // Capture response
        res.on('finish', () => {
            if (this.shouldSkip(originalUrl)) return;

            const durationMs = Date.now() - startTime;
            const contentLength = parseInt(res.get('content-length') || '0', 10);

            this.logger.logHttpResponse({
                method,
                url: originalUrl,
                statusCode: res.statusCode,
                durationMs,
                contentLength,
            });

            // Performance warning for slow requests
            if (durationMs > 3000) {
                this.logger.logPerformance('Slow HTTP Request', durationMs, {
                    method,
                    url: originalUrl,
                    statusCode: res.statusCode,
                });
            }
        });

        next();
    }

    private shouldSkip(url: string): boolean {
        const skipPaths = ['/health', '/favicon.ico', '/_next', '/static'];
        return skipPaths.some((path) => url.startsWith(path));
    }
}
