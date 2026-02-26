'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Loader2, ChevronRight, Eye, EyeOff, Lock, Mail } from 'lucide-react';

export default function Login() {
    const router = useRouter();
    const { login } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await login(formData.email, formData.password);
            router.push('/dashboard');
        } catch (err: unknown) {
            const errorData = err as { response?: { data?: { message?: string } }; message?: string };
            const errorMessage = typeof errorData === 'string' ? errorData :
                (errorData?.response?.data?.message || errorData?.message || 'Invalid email or password');
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

            <div className="sm:mx-auto sm:w-full sm:max-w-[420px] z-10">
                <div className="text-center mb-10">
                    <h1 className="font-samarkan text-5xl text-[#0e6957] mb-2">pragya</h1>
                    <h2 className="text-2xl font-bold text-gray-900">Welcome Back</h2>
                    <p className="mt-2 text-gray-600">Sign in to continue to your dashboard</p>
                </div>

                <div className="bg-white px-6 py-10 shadow-xl rounded-3xl border border-gray-100 sm:px-10 relative">

                    <form className="space-y-6" onSubmit={handleSubmit}>

                        <div className="space-y-5">
                            <div>
                                <label htmlFor="email" className="block text-sm font-semibold text-gray-700">Email address</label>
                                <div className="mt-1 relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Mail className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        required
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="block w-full rounded-xl border-gray-300 shadow-sm focus:border-[#0e6957] focus:ring-[#0e6957] pl-10 px-4 py-3 bg-gray-50 border hover:bg-white transition-colors"
                                        placeholder="you@example.com"
                                    />
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center justify-between">
                                    <label htmlFor="password" className="block text-sm font-semibold text-gray-700">Password</label>
                                    <div className="text-sm">
                                        <a href="#" className="font-semibold text-[#0e6957] hover:text-[#0a4f41]">Forgot password?</a>
                                    </div>
                                </div>
                                <div className="mt-1 relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        id="password"
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        autoComplete="current-password"
                                        required
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="block w-full rounded-xl border-gray-300 shadow-sm focus:border-[#0e6957] focus:ring-[#0e6957] pl-10 px-4 py-3 bg-gray-50 border hover:bg-white transition-colors pr-10"
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
                        </div>

                        {error && (
                            <div className="rounded-xl bg-red-50 p-4 border border-red-100">
                                <div className="flex">
                                    <div className="ml-3">
                                        <h3 className="text-sm font-medium text-red-800">Login Failed</h3>
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
                                        Sign In <ChevronRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
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
                                <span className="px-4 bg-white text-gray-500 font-medium">New to Pragya?</span>
                            </div>
                        </div>

                        <div className="mt-6 flex justify-center">
                            <Link href="/register" className="text-[#0e6957] font-bold hover:text-[#0a4f41] hover:underline text-base">
                                Create an account
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
