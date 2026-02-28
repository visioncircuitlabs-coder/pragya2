'use client';

import Link from 'next/link';
import { Lock, ArrowLeft } from 'lucide-react';

export default function Register() {
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
                </div>

                <div className="bg-white px-6 py-12 shadow-xl rounded-3xl border border-gray-100 sm:px-10 text-center">
                    <div className="flex justify-center mb-6">
                        <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center">
                            <Lock className="w-8 h-8 text-amber-600" />
                        </div>
                    </div>

                    <h2 className="text-2xl font-bold text-gray-900 mb-3">Registration Coming Soon</h2>
                    <p className="text-gray-600 mb-2">
                        We are currently undergoing payment verification and will open registration shortly.
                    </p>
                    <p className="text-gray-500 text-sm mb-8">
                        If you already have an account, you can sign in below.
                    </p>

                    <div className="space-y-4">
                        <Link
                            href="/login"
                            className="w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-[#0e6957] hover:bg-[#0a4f41] shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5"
                        >
                            Sign in to your account
                        </Link>
                        <Link
                            href="/"
                            className="w-full flex justify-center items-center py-3.5 px-4 border-2 border-gray-200 text-sm font-bold rounded-xl text-gray-700 hover:bg-gray-50 transition-all duration-200"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Home
                        </Link>
                    </div>
                </div>

                <div className="mt-8 text-center text-sm text-gray-500 space-x-6">
                    <Link href="/" className="hover:text-gray-900 transition-colors">Home</Link>
                    <Link href="/privacy" className="hover:text-gray-900 transition-colors">Privacy</Link>
                    <Link href="/terms" className="hover:text-gray-900 transition-colors">Terms</Link>
                </div>
            </div>
        </div>
    );
}
