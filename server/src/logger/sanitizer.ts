/**
 * Data Sanitizer for Logging
 * Ensures sensitive data like passwords, tokens, and cards are never logged
 */

// Fields that should be completely redacted
const SENSITIVE_FIELDS = new Set([
    'password',
    'newPassword',
    'oldPassword',
    'confirmPassword',
    'secret',
    'token',
    'accessToken',
    'refreshToken',
    'apiKey',
    'api_key',
    'authorization',
    'cookie',
    'creditCard',
    'cardNumber',
    'cvv',
    'ssn',
    'socialSecurityNumber',
    'pin',
    'otp',
]);

// Headers that should be redacted
const SENSITIVE_HEADERS = new Set([
    'authorization',
    'cookie',
    'x-api-key',
    'x-auth-token',
]);

/**
 * Deep clone and sanitize an object, redacting sensitive fields
 */
export function sanitize(obj: any, depth = 0): any {
    // Prevent infinite recursion
    if (depth > 10) return '[MAX_DEPTH]';

    if (obj === null || obj === undefined) return obj;

    // Handle primitives
    if (typeof obj !== 'object') return obj;

    // Handle arrays
    if (Array.isArray(obj)) {
        return obj.map((item) => sanitize(item, depth + 1));
    }

    // Handle objects
    const sanitized: Record<string, any> = {};

    for (const [key, value] of Object.entries(obj)) {
        const lowerKey = key.toLowerCase();

        if (SENSITIVE_FIELDS.has(lowerKey)) {
            sanitized[key] = '[REDACTED]';
        } else if (typeof value === 'string' && lowerKey.includes('email')) {
            // Partially mask emails
            sanitized[key] = maskEmail(value);
        } else if (typeof value === 'object') {
            sanitized[key] = sanitize(value, depth + 1);
        } else {
            sanitized[key] = value;
        }
    }

    return sanitized;
}

/**
 * Sanitize HTTP headers for logging
 */
export function sanitizeHeaders(headers: Record<string, any>): Record<string, any> {
    const sanitized: Record<string, any> = {};

    for (const [key, value] of Object.entries(headers)) {
        const lowerKey = key.toLowerCase();

        if (SENSITIVE_HEADERS.has(lowerKey)) {
            // For auth header, show type but redact token
            if (lowerKey === 'authorization' && typeof value === 'string') {
                const parts = value.split(' ');
                sanitized[key] = parts.length > 1 ? `${parts[0]} [REDACTED]` : '[REDACTED]';
            } else {
                sanitized[key] = '[REDACTED]';
            }
        } else {
            sanitized[key] = value;
        }
    }

    return sanitized;
}

/**
 * Mask email address for logging
 */
function maskEmail(email: string): string {
    if (!email || !email.includes('@')) return email;

    const [local, domain] = email.split('@');
    if (local.length <= 2) return `**@${domain}`;

    return `${local[0]}${'*'.repeat(local.length - 2)}${local[local.length - 1]}@${domain}`;
}

/**
 * Sanitize request body for logging
 */
export function sanitizeBody(body: any): any {
    if (!body) return undefined;

    // Don't log large bodies
    const bodyStr = JSON.stringify(body);
    if (bodyStr.length > 5000) {
        return { _truncated: true, _size: bodyStr.length };
    }

    return sanitize(body);
}

/**
 * Sanitize error for logging (remove sensitive stack info in prod)
 */
export function sanitizeError(error: Error, isProd: boolean): Record<string, any> {
    return {
        name: error.name,
        message: error.message,
        stack: isProd ? undefined : error.stack,
    };
}
