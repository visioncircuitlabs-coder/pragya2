'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { authApi } from '@/lib/api';
import { Loader2, Mail, RefreshCw } from 'lucide-react';

export default function VerifyEmailPage() {
    const router = useRouter();
    const { user, isLoading, isAuthenticated, refreshUser } = useAuth();
    const [otp, setOtp] = useState<string[]>(Array(6).fill(''));
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [resendCooldown, setResendCooldown] = useState(0);
    const [resendMessage, setResendMessage] = useState('');
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    // Guards: redirect if not logged in or already verified
    useEffect(() => {
        if (isLoading) return;
        if (!isAuthenticated) {
            router.push('/register');
            return;
        }
        if (user?.emailVerified) {
            router.push('/dashboard');
        }
    }, [isLoading, isAuthenticated, user, router]);

    // Resend cooldown timer
    useEffect(() => {
        if (resendCooldown <= 0) return;
        const timer = setTimeout(() => setResendCooldown((c) => c - 1), 1000);
        return () => clearTimeout(timer);
    }, [resendCooldown]);

    const handleChange = (index: number, value: string) => {
        // Only allow digits
        if (value && !/^\d$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
        setError('');

        // Auto-advance to next input
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
        if (!pasted) return;

        const newOtp = Array(6).fill('');
        for (let i = 0; i < pasted.length; i++) {
            newOtp[i] = pasted[i];
        }
        setOtp(newOtp);
        setError('');

        // Focus the next empty input or the last one
        const focusIndex = Math.min(pasted.length, 5);
        inputRefs.current[focusIndex]?.focus();
    };

    const handleSubmit = useCallback(async () => {
        const code = otp.join('');
        if (code.length !== 6) {
            setError('Please enter all 6 digits');
            return;
        }

        setSubmitting(true);
        setError('');

        try {
            await authApi.verifyEmail(code);
            await refreshUser();
            router.push('/dashboard');
        } catch (err: any) {
            const message = err.response?.data?.message || 'Invalid verification code. Please try again.';
            setError(message);
            setOtp(Array(6).fill(''));
            inputRefs.current[0]?.focus();
        } finally {
            setSubmitting(false);
        }
    }, [otp, refreshUser, router]);

    // Auto-submit when all 6 digits entered
    useEffect(() => {
        if (otp.every((d) => d !== '') && !submitting) {
            handleSubmit();
        }
    }, [otp, submitting, handleSubmit]);

    const handleResend = async () => {
        if (resendCooldown > 0 || !user?.email) return;

        try {
            await authApi.resendVerification(user.email);
            setResendMessage('A new code has been sent to your email');
            setResendCooldown(60);
            setError('');
            setOtp(Array(6).fill(''));
            inputRefs.current[0]?.focus();
        } catch (err: any) {
            const message = err.response?.data?.message || 'Failed to resend code. Please try again.';
            setError(message);
        }

        // Clear resend message after 5s
        setTimeout(() => setResendMessage(''), 5000);
    };

    if (isLoading || !user) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0e6957]"></div>
            </div>
        );
    }

    if (user.emailVerified) {
        return null;
    }

    return (
        <div className="min-h-screen bg-white flex flex-col justify-center py-12 px-6 lg:px-8">
            {/* Background Decorative Elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-50 rounded-full blur-3xl -mr-32 -mt-32 opacity-70"></div>
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-teal-50 rounded-full blur-3xl -ml-20 -mb-20 opacity-70"></div>
            </div>

            <div className="sm:mx-auto sm:w-full sm:max-w-[480px] z-10">
                <div className="text-center mb-10">
                    <h1 className="font-samarkan text-5xl text-[#0e6957] mb-2">pragya</h1>
                    <h2 className="text-2xl font-bold text-gray-900">Verify your email</h2>
                    <p className="mt-2 text-gray-600">
                        We sent a 6-digit code to <span className="font-semibold text-gray-900">{user.email}</span>
                    </p>
                </div>

                <div className="bg-white px-6 py-10 shadow-xl rounded-3xl border border-gray-100 sm:px-10">
                    <div className="flex justify-center mb-8">
                        <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center">
                            <Mail className="w-8 h-8 text-[#0e6957]" />
                        </div>
                    </div>

                    {/* OTP Input Boxes */}
                    <div className="flex justify-center gap-3 mb-6" onPaste={handlePaste}>
                        {otp.map((digit, index) => (
                            <input
                                key={index}
                                ref={(el) => { inputRefs.current[index] = el; }}
                                type="text"
                                inputMode="numeric"
                                maxLength={1}
                                value={digit}
                                onChange={(e) => handleChange(index, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(index, e)}
                                className={`w-12 h-14 text-center text-2xl font-bold rounded-xl border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#0e6957]/20 ${
                                    error
                                        ? 'border-red-300 bg-red-50'
                                        : digit
                                        ? 'border-[#0e6957] bg-emerald-50'
                                        : 'border-gray-200 bg-gray-50 hover:border-gray-300'
                                } focus:border-[#0e6957]`}
                                disabled={submitting}
                                autoFocus={index === 0}
                            />
                        ))}
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="rounded-xl bg-red-50 p-4 border border-red-100 mb-6">
                            <p className="text-sm text-red-700 text-center">{error}</p>
                        </div>
                    )}

                    {/* Success Message */}
                    {resendMessage && (
                        <div className="rounded-xl bg-emerald-50 p-4 border border-emerald-100 mb-6">
                            <p className="text-sm text-emerald-700 text-center">{resendMessage}</p>
                        </div>
                    )}

                    {/* Submit Button */}
                    <button
                        onClick={handleSubmit}
                        disabled={submitting || otp.some((d) => d === '')}
                        className="w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-[#0e6957] hover:bg-[#0a4f41] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0e6957] disabled:opacity-70 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                        {submitting ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            'Verify Email'
                        )}
                    </button>

                    {/* Resend Section */}
                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-500 mb-2">Didn&apos;t receive the code?</p>
                        <button
                            onClick={handleResend}
                            disabled={resendCooldown > 0}
                            className="inline-flex items-center gap-2 text-sm font-semibold text-[#0e6957] hover:text-[#0a4f41] disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
                        >
                            <RefreshCw className={`w-4 h-4 ${resendCooldown > 0 ? '' : 'group-hover:rotate-180 transition-transform'}`} />
                            {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend Code'}
                        </button>
                    </div>

                    <p className="mt-6 text-center text-xs text-gray-400">
                        Code expires in 10 minutes
                    </p>
                </div>
            </div>
        </div>
    );
}
