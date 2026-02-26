import { AsyncLocalStorage } from 'async_hooks';
import { randomUUID } from 'crypto';

/**
 * Request Context for Correlation ID tracking
 * Uses AsyncLocalStorage to maintain context across async operations
 */
export interface RequestContext {
    correlationId: string;
    userId?: string;
    userRole?: string;
    startTime: number;
    path?: string;
    method?: string;
}

class RequestContextStorage {
    private storage = new AsyncLocalStorage<RequestContext>();

    /**
     * Run a function with a new request context
     */
    run<T>(context: RequestContext, fn: () => T): T {
        return this.storage.run(context, fn);
    }

    /**
     * Get the current request context
     */
    get(): RequestContext | undefined {
        return this.storage.getStore();
    }

    /**
     * Get correlation ID from current context or generate a new one
     */
    getCorrelationId(): string {
        return this.get()?.correlationId || randomUUID();
    }

    /**
     * Get user ID from current context
     */
    getUserId(): string | undefined {
        return this.get()?.userId;
    }

    /**
     * Update user info in current context (after auth)
     */
    setUser(userId: string, userRole?: string): void {
        const ctx = this.get();
        if (ctx) {
            ctx.userId = userId;
            ctx.userRole = userRole;
        }
    }

    /**
     * Create a new context with a correlation ID
     */
    createContext(correlationId?: string): RequestContext {
        return {
            correlationId: correlationId || randomUUID(),
            startTime: Date.now(),
        };
    }
}

export const requestContext = new RequestContextStorage();
