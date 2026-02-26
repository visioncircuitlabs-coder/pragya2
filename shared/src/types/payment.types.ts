/**
 * Payment Status Enumeration
 */
export enum PaymentStatus {
    PENDING = 'PENDING',
    SUCCESS = 'SUCCESS',
    FAILED = 'FAILED',
    REFUNDED = 'REFUNDED'
}

/**
 * Payment Type
 */
export enum PaymentType {
    ASSESSMENT = 'ASSESSMENT',
    SUBSCRIPTION = 'SUBSCRIPTION',
    JOB_POSTING = 'JOB_POSTING'
}

/**
 * Payment Gateway
 */
export enum PaymentGateway {
    RAZORPAY = 'RAZORPAY',
    STRIPE = 'STRIPE'
}

/**
 * Payment Interface
 */
export interface Payment {
    id: string;
    userId: string;
    amount: number;
    currency: string;
    paymentGateway: PaymentGateway;
    gatewayPaymentId?: string;
    gatewayOrderId?: string;
    status: PaymentStatus;
    paymentType: PaymentType;
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}

/**
 * Razorpay Order Creation
 */
export interface CreateRazorpayOrderDTO {
    amount: number;
    currency?: string;
    receipt?: string;
    notes?: Record<string, any>;
}

/**
 * Razorpay Order Response
 */
export interface RazorpayOrderResponse {
    id: string;
    entity: string;
    amount: number;
    amount_paid: number;
    amount_due: number;
    currency: string;
    receipt: string | null;
    status: string;
    attempts: number;
    notes: Record<string, any>;
    created_at: number;
}

/**
 * Payment Verification DTO
 */
export interface VerifyPaymentDTO {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
}

/**
 * Payment Response for Frontend
 */
export interface PaymentResponse {
    success: boolean;
    payment: Payment;
    message: string;
}

/**
 * Razorpay Webhook Event
 */
export interface RazorpayWebhookEvent {
    entity: string;
    account_id: string;
    event: string;
    contains: string[];
    payload: {
        payment: {
            entity: {
                id: string;
                amount: number;
                currency: string;
                status: string;
                order_id: string;
                email: string;
                contact: string;
                created_at: number;
            };
        };
    };
    created_at: number;
}
