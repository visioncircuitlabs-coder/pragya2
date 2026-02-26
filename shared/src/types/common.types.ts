/**
 * API Response Wrapper
 */
export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    message?: string;
    error?: ApiError;
    meta?: ResponseMeta;
}

/**
 * API Error Structure
 */
export interface ApiError {
    code: string;
    message: string;
    details?: any;
    timestamp: Date;
}

/**
 * Pagination Meta
 */
export interface ResponseMeta {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
}

/**
 * Pagination Parameters
 */
export interface PaginationParams {
    page: number;
    limit: number;
}

/**
 * Common HTTP Status Codes
 */
export const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    UNPROCESSABLE_ENTITY: 422,
    INTERNAL_SERVER_ERROR: 500
} as const;

/**
 * Error Codes
 */
export const ERROR_CODES = {
    // Authentication
    INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
    TOKEN_EXPIRED: 'TOKEN_EXPIRED',
    UNAUTHORIZED_ACCESS: 'UNAUTHORIZED_ACCESS',
    EMAIL_NOT_VERIFIED: 'EMAIL_NOT_VERIFIED',

    // User
    USER_NOT_FOUND: 'USER_NOT_FOUND',
    USER_ALREADY_EXISTS: 'USER_ALREADY_EXISTS',
    WEAK_PASSWORD: 'WEAK_PASSWORD',

    // Assessment
    ASSESSMENT_NOT_FOUND: 'ASSESSMENT_NOT_FOUND',
    ASSESSMENT_ALREADY_COMPLETED: 'ASSESSMENT_ALREADY_COMPLETED',
    ASSESSMENT_EXPIRED: 'ASSESSMENT_EXPIRED',
    INVALID_ASSESSMENT_RESPONSE: 'INVALID_ASSESSMENT_RESPONSE',

    // Payment
    PAYMENT_FAILED: 'PAYMENT_FAILED',
    PAYMENT_ALREADY_PROCESSED: 'PAYMENT_ALREADY_PROCESSED',
    INVALID_PAYMENT_SIGNATURE: 'INVALID_PAYMENT_SIGNATURE',

    // Job
    JOB_NOT_FOUND: 'JOB_NOT_FOUND',
    APPLICATION_ALREADY_EXISTS: 'APPLICATION_ALREADY_EXISTS',

    // Generic
    VALIDATION_ERROR: 'VALIDATION_ERROR',
    INTERNAL_ERROR: 'INTERNAL_ERROR',
    RESOURCE_NOT_FOUND: 'RESOURCE_NOT_FOUND'
} as const;

/**
 * Success Messages
 */
export const SUCCESS_MESSAGES = {
    LOGIN_SUCCESS: 'Login successful',
    REGISTRATION_SUCCESS: 'Registration successful',
    LOGOUT_SUCCESS: 'Logout successful',
    PROFILE_UPDATED: 'Profile updated successfully',
    ASSESSMENT_STARTED: 'Assessment started',
    ASSESSMENT_SUBMITTED: 'Assessment submitted successfully',
    PAYMENT_SUCCESS: 'Payment successful',
    JOB_CREATED: 'Job posted successfully',
    APPLICATION_SUBMITTED: 'Application submitted successfully'
} as const;
