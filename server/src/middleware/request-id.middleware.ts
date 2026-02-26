import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'crypto';
import { requestContext } from '../logger/request-context';

/**
 * Request ID Middleware
 * Adds a correlation ID to every request for tracing
 * Must be the FIRST middleware in the chain
 */
@Injectable()
export class RequestIdMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction): void {
        // Check for existing correlation ID from headers (for distributed tracing)
        const existingId = req.headers['x-correlation-id'] || req.headers['x-request-id'];
        const correlationId = typeof existingId === 'string' ? existingId : randomUUID();

        // Store in request object for later use
        (req as any).correlationId = correlationId;

        // Set response header so clients can trace their requests
        res.setHeader('X-Correlation-Id', correlationId);

        // Create context and run the rest of the request within it
        const context = requestContext.createContext(correlationId);
        context.path = req.path;
        context.method = req.method;

        requestContext.run(context, () => {
            next();
        });
    }
}
