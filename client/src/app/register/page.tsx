'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Loader2, User as UserIcon, Building2, Briefcase, ChevronRight, Eye, EyeOff } from 'lucide-react';
import { UserRole } from '@pragya/shared';

export default function Register() {
    const router = useRouter();
    const { register } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        fullName: '',
        role: UserRole.STUDENT as UserRole,
        companyName: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleRoleSelect = (role: UserRole) => {
        setFormData(prev => ({ ...prev, role }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (formData.password.length < 8) {
            setError('Password must be at least 8 characters');
            return;
        }

        setLoading(true);

        try {
            await register({
                email: formData.email,
                password: formData.password,
                role: formData.role,
                fullName: formData.fullName,
                companyName: formData.role === UserRole.EMPLOYER ? formData.companyName : undefined
            });
            router.push('/dashboard');
        } catch (err: unknown) {
            const errorData = err as { response?: { data?: { message?: string } }; message?: string };
            const errorMessage = typeof errorData === 'string' ? errorData :
                (errorData?.response?.data?.message || errorData?.message || 'Registration failed');
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

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
                    <h2 className="text-2xl font-bold text-gray-900">Create your account</h2>
                    <p className="mt-2 text-gray-600">Join the career ecosystem tailored for you</p>
                </div>

                <div className="bg-white px-6 py-10 shadow-xl rounded-3xl border border-gray-100 sm:px-10 relative">

                    <form className="space-y-6" onSubmit={handleSubmit}>

                        {/* Role Selection */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-3">I am a...</label>
                            <div className="grid grid-cols-2 gap-3">
                                {[
                                    { id: UserRole.STUDENT, label: 'Student', icon: UserIcon },
                                    { id: UserRole.JOB_SEEKER, label: 'Job Seeker', icon: Briefcase },
                                ].map((role) => (
                                    <button
                                        type="button"
                                        key={role.id}
                                        onClick={() => handleRoleSelect(role.id as UserRole)}
                                        className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all duration-200 ${formData.role === role.id
                                                ? 'bg-[#0e6957] border-[#0e6957] text-white shadow-md transform scale-105'
                                                : 'bg-white border-gray-200 text-gray-600 hover:border-[#0e6957]/50 hover:bg-emerald-50'
                                            }`}
                                    >
                                        <role.icon className={`w-5 h-5 mb-1 ${formData.role === role.id ? 'text-white' : 'text-gray-500'}`} />
                                        <span className="text-xs font-semibold">{role.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Form Fields */}
                        <div className="space-y-5">
                            <div>
                                <label htmlFor="fullName" className="block text-sm font-semibold text-gray-700">Full Name</label>
                                <div className="mt-1">
                                    <input
                                        id="fullName"
                                        name="fullName"
                                        type="text"
                                        required
                                        value={formData.fullName}
                                        onChange={handleChange}
                                        className="block w-full rounded-xl border-gray-300 shadow-sm focus:border-[#0e6957] focus:ring-[#0e6957] px-4 py-3 bg-gray-50 border hover:bg-white transition-colors"
                                        placeholder="e.g. John Doe"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-sm font-semibold text-gray-700">Email address</label>
                                <div className="mt-1">
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        required
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="block w-full rounded-xl border-gray-300 shadow-sm focus:border-[#0e6957] focus:ring-[#0e6957] px-4 py-3 bg-gray-50 border hover:bg-white transition-colors"
                                        placeholder="you@example.com"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <label htmlFor="password" className="block text-sm font-semibold text-gray-700">Password</label>
                                    <div className="mt-1 relative">
                                        <input
                                            id="password"
                                            name="password"
                                            type={showPassword ? "text" : "password"}
                                            autoComplete="new-password"
                                            required
                                            value={formData.password}
                                            onChange={handleChange}
                                            className="block w-full rounded-xl border-gray-300 shadow-sm focus:border-[#0e6957] focus:ring-[#0e6957] px-4 py-3 bg-gray-50 border hover:bg-white transition-colors pr-10"
                                            placeholder="********"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                        >
                                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700">Confirm Password</label>
                                    <div className="mt-1">
                                        <input
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            type="password"
                                            autoComplete="new-password"
                                            required
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            className="block w-full rounded-xl border-gray-300 shadow-sm focus:border-[#0e6957] focus:ring-[#0e6957] px-4 py-3 bg-gray-50 border hover:bg-white transition-colors"
                                            placeholder="********"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {error && (
                            <div className="rounded-xl bg-red-50 p-4 border border-red-100">
                                <div className="flex">
                                    <div className="ml-3">
                                        <h3 className="text-sm font-medium text-red-800">Registration Failed</h3>
                                        <div className="mt-2 text-sm text-red-700">
                                            <p>{error}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="group relative w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-[#0e6957] hover:bg-[#0a4f41] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0e6957] disabled:opacity-70 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5"
                            >
                                {loading ? (
                                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                                ) : (
                                    <span className="flex items-center">
                                        Create Account <ChevronRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </span>
                                )}
                            </button>
                        </div>
                    </form>

                    <div className="mt-8">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-200" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-4 bg-white text-gray-500 font-medium">Already have an account?</span>
                            </div>
                        </div>

                        <div className="mt-6 flex justify-center">
                            <Link href="/login" className="text-[#0e6957] font-bold hover:text-[#0a4f41] hover:underline text-base">
                                Sign in to your account
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Footer Links */}
                <div className="mt-8 text-center text-sm text-gray-500 space-x-6">
                    <Link href="/" className="hover:text-gray-900 transition-colors">Home</Link>
                    <Link href="/privacy" className="hover:text-gray-900 transition-colors">Privacy</Link>
                    <Link href="/terms" className="hover:text-gray-900 transition-colors">Terms</Link>
                </div>

            </div>
        </div>
    );
}
