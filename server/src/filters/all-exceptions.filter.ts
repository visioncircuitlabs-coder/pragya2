import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
    Injectable,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { Request, Response } from 'express';
import { LoggerService } from '../logger/logger.service';
import { requestContext } from '../logger/request-context';

/**
 * Global Exception Filter
 * Catches ALL exceptions and logs them properly
 * Returns consistent error response format
 */
@Catch()
@Injectable()
export class AllExceptionsFilter implements ExceptionFilter {
    private readonly isProd: boolean;

    constructor(
        private readonly httpAdapterHost: HttpAdapterHost,
        private readonly logger: LoggerService,
    ) {
        this.isProd = process.env.NODE_ENV === 'production';
    }

    catch(exception: unknown, host: ArgumentsHost): void {
        const { httpAdapter } = this.httpAdapterHost;
        const ctx = host.switchToHttp();
        const request = ctx.getRequest<Request>();
        const response = ctx.getResponse<Response>();

        // Determine status code
        const httpStatus =
            exception instanceof HttpException
                ? exception.getStatus()
                : HttpStatus.INTERNAL_SERVER_ERROR;

        // Get exception message
        let message = 'Internal server error';
        let errorCode = 'INTERNAL_ERROR';

        if (exception instanceof HttpException) {
            const exceptionResponse = exception.getResponse();
            if (typeof exceptionResponse === 'string') {
                message = exceptionResponse;
            } else if (typeof exceptionResponse === 'object') {
                message = (exceptionResponse as any).message || message;
                errorCode = (exceptionResponse as any).error || errorCode;
            }
        } else if (exception instanceof Error) {
            message = this.isProd ? 'Internal server error' : exception.message;
        }

        // Get context
        const reqContext = requestContext.get();
        const correlationId = reqContext?.correlationId || (request as any).correlationId;

        // Build response body
        const responseBody = {
            success: false,
            statusCode: httpStatus,
            message: Array.isArray(message) ? message[0] : message,
            error: errorCode,
            timestamp: new Date().toISOString(),
            path: request.url,
            correlationId,
            // Only include details in development
            ...(this.isProd ? {} : { stack: exception instanceof Error ? exception.stack : undefined }),
        };

        // Log the exception
        this.logger.logException(exception instanceof Error ? exception : new Error(String(exception)), 'ExceptionFilter', {
            method: request.method,
            url: request.url,
            statusCode: httpStatus,
            userId: reqContext?.userId,
            ip: request.ip,
        });

        // Log security events for specific status codes
        if (httpStatus === 401 || httpStatus === 403) {
            this.logger.logSecurityEvent('UNAUTHORIZED_ACCESS', {
                severity: 'medium',
                details: {
                    method: request.method,
                    url: request.url,
                    statusCode: httpStatus,
                    ip: request.ip,
                },
            });
        }

        httpAdapter.reply(response, responseBody, httpStatus);
    }
}
