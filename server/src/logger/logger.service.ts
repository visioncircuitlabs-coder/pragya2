import { Injectable, LoggerService as NestLoggerService, Scope } from '@nestjs/common';
import * as winston from 'winston';
import * as DailyRotateFile from 'winston-daily-rotate-file';
import * as path from 'path';
import * as fs from 'fs';
import { requestContext } from './request-context';
import { sanitize, sanitizeError } from './sanitizer';

/**
 * Production-Ready Logger Service
 *
 * Features:
 * - Structured JSON logging
 * - Request correlation IDs
 * - Security-aware (no sensitive data)
 * - Different behavior for dev vs prod
 * - Daily log rotation with 6-month retention
 * - Separate error logs
 */
@Injectable()
export class LoggerService implements NestLoggerService {
    private logger: winston.Logger;
    private context?: string;
    private readonly isProd: boolean;

    constructor() {
        this.isProd = process.env.NODE_ENV === 'production';
        this.logger = this.createLogger();
    }

    private createLogger(): winston.Logger {
        const logsDir = path.join(process.cwd(), 'logs');

        // Ensure logs directory exists
        if (!fs.existsSync(logsDir)) {
            fs.mkdirSync(logsDir, { recursive: true });
        }

        // Base format with correlation ID
        const baseFormat = winston.format.combine(
            winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
            winston.format.errors({ stack: true }),
            winston.format((info) => {
                // Add correlation ID and user context
                const ctx = requestContext.get();
                if (ctx) {
                    info.correlationId = ctx.correlationId;
                    if (ctx.userId) info.userId = ctx.userId;
                    if (ctx.userRole) info.userRole = ctx.userRole;
                }
                return info;
            })(),
        );

        // JSON format for files (production-ready, searchable)
        const jsonFormat = winston.format.combine(baseFormat, winston.format.json());

        // Pretty format for console (development)
        const consoleFormat = winston.format.combine(
            baseFormat,
            winston.format.colorize({ all: true }),
            winston.format.printf((info) => {
                const { timestamp, level, message, correlationId, context, userId, ...meta } = info;
                const ctx = context ? `[${context}]` : '';
                const cid = correlationId ? `[${String(correlationId).substring(0, 8)}]` : '';
                const uid = userId ? `[User:${String(userId).substring(0, 8)}]` : '';
                const metaStr = Object.keys(meta).length > 0 ? ` ${JSON.stringify(meta)}` : '';
                return `${timestamp} ${level} ${cid}${uid}${ctx} ${message}${metaStr}`;
            }),
        );

        // Transports
        const transports: winston.transport[] = [];

        // File transports (always active)
        transports.push(
            // Combined logs - all levels
            new DailyRotateFile({
                filename: path.join(logsDir, 'app-%DATE%.log'),
                datePattern: 'YYYY-MM-DD',
                zippedArchive: true,
                maxSize: '50m',
                maxFiles: '180d', // 6 months
                level: 'info',
                format: jsonFormat,
            }),

            // Error logs - errors only
            new DailyRotateFile({
                filename: path.join(logsDir, 'error-%DATE%.log'),
                datePattern: 'YYYY-MM-DD',
                zippedArchive: true,
                maxSize: '50m',
                maxFiles: '180d', // 6 months
                level: 'error',
                format: jsonFormat,
            }),
        );

        // Debug logs only in development
        if (!this.isProd) {
            transports.push(
                new DailyRotateFile({
                    filename: path.join(logsDir, 'debug-%DATE%.log'),
                    datePattern: 'YYYY-MM-DD',
                    maxSize: '100m',
                    maxFiles: '7d', // 1 week
                    level: 'debug',
                    format: jsonFormat,
                }),
            );
        }

        // Console transport
        transports.push(
            new winston.transports.Console({
                level: this.isProd ? 'info' : 'debug',
                format: this.isProd ? jsonFormat : consoleFormat,
            }),
        );

        return winston.createLogger({
            level: process.env.LOG_LEVEL || (this.isProd ? 'info' : 'debug'),
            defaultMeta: { service: 'pragya-api' },
            transports,
        });
    }

    // ==================== NestJS Logger Interface ====================

    setContext(context: string): this {
        this.context = context;
        return this;
    }

    log(message: any, context?: string): void {
        this.logger.info(message, { context: context || this.context });
    }

    error(message: any, trace?: string, context?: string): void {
        this.logger.error(message, {
            context: context || this.context,
            stack: trace,
        });
    }

    warn(message: any, context?: string): void {
        this.logger.warn(message, { context: context || this.context });
    }

    debug(message: any, context?: string): void {
        this.logger.debug(message, { context: context || this.context });
    }

    verbose(message: any, context?: string): void {
        this.logger.verbose(message, { context: context || this.context });
    }

    // ==================== HTTP Request Logging ====================

    logHttpRequest(data: {
        method: string;
        url: string;
        ip?: string;
        userAgent?: string;
        body?: any;
    }): void {
        this.logger.info('HTTP Request', {
            context: 'HTTP',
            type: 'request',
            method: data.method,
            url: data.url,
            ip: data.ip,
            userAgent: data.userAgent,
            body: data.body ? sanitize(data.body) : undefined,
        });
    }

    logHttpResponse(data: {
        method: string;
        url: string;
        statusCode: number;
        durationMs: number;
        contentLength?: number;
    }): void {
        const level = data.statusCode >= 500 ? 'error' : data.statusCode >= 400 ? 'warn' : 'info';

        this.logger.log(level, 'HTTP Response', {
            context: 'HTTP',
            type: 'response',
            method: data.method,
            url: data.url,
            statusCode: data.statusCode,
            durationMs: data.durationMs,
            contentLength: data.contentLength,
        });
    }

    // ==================== Auth Event Logging ====================

    logAuthEvent(
        event: 'LOGIN' | 'LOGOUT' | 'REGISTER' | 'LOGIN_FAILED' | 'TOKEN_REFRESH' | 'PASSWORD_RESET',
        data: {
            userId?: string;
            email?: string;
            reason?: string;
            ip?: string;
        },
    ): void {
        const level = event.includes('FAILED') ? 'warn' : 'info';

        this.logger.log(level, `Auth: ${event}`, {
            context: 'Auth',
            type: 'auth',
            event,
            userId: data.userId,
            email: data.email ? this.maskEmail(data.email) : undefined,
            reason: data.reason,
            ip: data.ip,
        });
    }

    // ==================== Security Event Logging ====================

    logSecurityEvent(
        event: string,
        data: {
            severity: 'low' | 'medium' | 'high' | 'critical';
            details?: Record<string, any>;
        },
    ): void {
        const level = data.severity === 'critical' || data.severity === 'high' ? 'error' : 'warn';

        this.logger.log(level, `Security: ${event}`, {
            context: 'Security',
            type: 'security',
            event,
            severity: data.severity,
            ...sanitize(data.details || {}),
        });
    }

    // ==================== Business Event Logging ====================

    logBusinessEvent(
        event: string,
        data?: Record<string, any>,
    ): void {
        this.logger.info(`Business: ${event}`, {
            context: 'Business',
            type: 'business',
            event,
            ...sanitize(data || {}),
        });
    }

    // ==================== Error Logging ====================

    logException(error: Error, context?: string, additionalData?: Record<string, any>): void {
        const sanitizedError = sanitizeError(error, this.isProd);

        this.logger.error(`Exception: ${error.message}`, {
            context: context || this.context || 'Exception',
            type: 'exception',
            error: sanitizedError,
            ...sanitize(additionalData || {}),
        });
    }

    // ==================== Performance Logging ====================

    logPerformance(
        operation: string,
        durationMs: number,
        data?: Record<string, any>,
    ): void {
        const level = durationMs > 3000 ? 'warn' : 'debug';

        this.logger.log(level, `Performance: ${operation}`, {
            context: 'Performance',
            type: 'performance',
            operation,
            durationMs,
            slow: durationMs > 3000,
            ...sanitize(data || {}),
        });
    }

    // ==================== Helpers ====================

    private maskEmail(email: string): string {
        if (!email || !email.includes('@')) return email;
        const [local, domain] = email.split('@');
        if (local.length <= 2) return `**@${domain}`;
        return `${local[0]}${'*'.repeat(local.length - 2)}${local[local.length - 1]}@${domain}`;
    }
}
