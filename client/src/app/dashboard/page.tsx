'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import { UserRole, AssessmentStatus } from '@pragya/shared';
import {
    User,
    Briefcase,
    GraduationCap,
    Building2,
    CheckCircle2,
    AlertCircle,
    ArrowRight,
    BarChart3,
    Eye,
} from 'lucide-react';

const roleLabels: Record<string, string> = {
    [UserRole.STUDENT]: 'Student',
    [UserRole.JOB_SEEKER]: 'Job Seeker',
    [UserRole.EMPLOYER]: 'Employer',
    [UserRole.ADMIN]: 'Administrator',
};

interface UserAssessment {
    id: string;
    status: AssessmentStatus;
    completedAt?: string;
    totalScore?: number;
    lastQuestionIndex?: number;
    assessment?: { _count?: { questions: number } };
    _count?: { responses: number };
}

export default function DashboardPage() {
    const router = useRouter();
    const { user, isLoading, isAuthenticated } = useAuth();
    const [assessments, setAssessments] = useState<UserAssessment[]>([]);

    // Fetch all assessments (completed + in-progress)
    useEffect(() => {
        const fetchAssessments = async () => {
            if (!isAuthenticated || !user || (user.role !== UserRole.JOB_SEEKER && user.role !== UserRole.STUDENT)) return;

            try {
                const res = await api.get('/assessments/my-results');
                setAssessments(res.data);
            } catch (err) {
                console.error('Error fetching assessments:', err);
            }
        };

        if (!isLoading && isAuthenticated) {
            fetchAssessments();
        }
    }, [isLoading, isAuthenticated, user]);

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push('/login');
        }
    }, [isLoading, isAuthenticated, router]);


    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0e6957]" role="status"><span className="sr-only">Loading dashboard</span></div>
            </div>
        );
    }

    if (!user) {
        return null;
    }

    // Determine actions based on role
    const getQuickActions = () => {
        switch (user.role) {
            case 'STUDENT':
                return [
                    {
                        title: 'Career Assessment',
                        description: 'Discover your ideal career path based on your strengths.',
                        href: '/students/assessment',
                        icon: GraduationCap,
                        primary: true
                    },
                    {
                        title: 'Browse Library',
                        description: 'Explore our extensive digital career library.',
                        href: '/career-library',
                        icon: Briefcase,
                        primary: false
                    }
                ];
            case 'JOB_SEEKER':
                return [
                    {
                        title: 'Employability Assessment',
                        description: 'Complete your comprehensive career assessment and get AI-powered insights.',
                        href: '/assessment',
                        icon: CheckCircle2,
                        primary: true
                    },
                    {
                        title: 'Find Jobs',
                        description: 'Search for opportunities matching your profile.',
                        href: '/jobs',
                        icon: Briefcase,
                        primary: false
                    }
                ];
            case 'EMPLOYER':
                return [
                    {
                        title: 'Explore Talent Insights',
                        description: 'Access assessment-backed candidate profiles and talent analytics.',
                        href: '/employer-portal',
                        icon: Building2,
                        primary: true
                    },
                    {
                        title: 'View Applicants',
                        description: 'Manage applications for your posted jobs.',
                        href: '/employer-portal/applicants',
                        icon: User,
                        primary: false
                    }
                ];
            default:
                return [];
        }
    };

    const actions = getQuickActions();

    return (
        <div className="min-h-screen bg-gray-50 pt-8 pb-20">
            <div className="max-w-7xl mx-auto px-4 lg:px-8">

                {/* Welcome Section */}
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-5 sm:p-8 mb-8 overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>

                    <div className="relative z-10">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            Welcome back, <span className="text-[#0e6957]">{user.fullName || user.email?.split('@')[0]}</span>!
                        </h1>
                        <p className="text-gray-600 max-w-2xl">
                            Track your progress, manage your profile, and explore opportunities tailored for you.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Left Column: Profile & Status */}
                    <div className="space-y-8">

                        {/* Profile Summary */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center text-[#0e6957] overflow-hidden">
                                    {(user as any).gender?.toLowerCase() === 'female' ? (
                                        <svg viewBox="0 0 64 64" className="w-16 h-16">
                                            <circle cx="32" cy="32" r="32" fill="#d1fae5" />
                                            <circle cx="32" cy="26" r="10" fill="#065f46" />
                                            <ellipse cx="32" cy="52" rx="16" ry="14" fill="#065f46" />
                                            <path d="M22 20c0-8 4-14 10-14s10 6 10 14" fill="#1a1a2e" />
                                            <path d="M18 22c-2 4-2 10 0 14" stroke="#1a1a2e" strokeWidth="2" fill="none" />
                                            <path d="M46 22c2 4 2 10 0 14" stroke="#1a1a2e" strokeWidth="2" fill="none" />
                                        </svg>
                                    ) : (user as any).gender?.toLowerCase() === 'male' ? (
                                        <svg viewBox="0 0 64 64" className="w-16 h-16">
                                            <circle cx="32" cy="32" r="32" fill="#d1fae5" />
                                            <circle cx="32" cy="26" r="10" fill="#065f46" />
                                            <ellipse cx="32" cy="52" rx="16" ry="14" fill="#065f46" />
                                            <path d="M20 22c0-8 5-14 12-14s12 6 12 14" fill="#1a1a2e" />
                                        </svg>
                                    ) : (
                                        <User className="w-8 h-8" />
                                    )}
                                </div>
                                <div>
                                    <div className="font-bold text-lg text-gray-900">{user.fullName || user.email?.split('@')[0] || 'User'}</div>
                                    <div className="text-sm text-gray-500">{user.email}</div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between items-center py-2 border-b border-gray-50">
                                    <span className="text-gray-500 text-sm">Account Type</span>
                                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-[#0e6957]">
                                        {roleLabels[user.role]}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-gray-50">
                                    <span className="text-gray-500 text-sm">Joined</span>
                                    <span className="text-gray-900 text-sm font-medium">
                                        {new Date(user.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center py-2">
                                    <span className="text-gray-500 text-sm">Status</span>
                                    <span className={`flex items-center gap-1.5 text-sm font-medium ${user.emailVerified ? 'text-emerald-600' : 'text-amber-500'}`}>
                                        {user.emailVerified ? (
                                            <><CheckCircle2 className="w-4 h-4" /> Verified</>
                                        ) : (
                                            <><AlertCircle className="w-4 h-4" /> Unverified</>
                                        )}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Verification Warning */}
                        {!user.emailVerified && (
                            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
                                <div className="flex items-start gap-4">
                                    <div className="p-2 bg-amber-100 rounded-lg text-amber-600 shrink-0">
                                        <AlertCircle className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 mb-1">Verify your email</h3>
                                        <p className="text-sm text-gray-600 mb-3">
                                            Please verify your email address to unlock all features of the platform.
                                        </p>
                                        <button
                                            onClick={() => router.push('/verify-email')}
                                            className="text-sm font-semibold text-amber-700 hover:text-amber-800 underline"
                                        >
                                            Verify Email
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Column: Quick Actions & Content */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* Quick Actions Grid */}
                        <div>
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Recommended Actions</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {actions.map((action, index) => (
                                    <Link
                                        key={index}
                                        href={action.href}
                                        className={`group p-6 rounded-2xl border transition-all duration-300 ${action.primary
                                            ? 'bg-[#0e6957] border-[#0e6957] text-white shadow-lg shadow-emerald-900/10 hover:shadow-xl hover:bg-[#0a4f41]'
                                            : 'bg-white border-gray-200 hover:border-[#0e6957]/50 hover:shadow-md'
                                            }`}
                                    >
                                        <div className="flex justify-between items-start mb-4">
                                            <div className={`p-3 rounded-xl ${action.primary ? 'bg-white/20' : 'bg-emerald-50 text-[#0e6957]'}`}>
                                                <action.icon className="w-6 h-6" />
                                            </div>
                                            <ArrowRight className={`w-5 h-5 transition-transform group-hover:translate-x-1 ${action.primary ? 'text-white/80' : 'text-gray-400 group-hover:text-[#0e6957]'}`} />
                                        </div>
                                        <h3 className={`text-lg font-bold mb-2 ${action.primary ? 'text-white' : 'text-gray-900'}`}>
                                            {action.title}
                                        </h3>
                                        <p className={`text-sm leading-relaxed ${action.primary ? 'text-emerald-100' : 'text-gray-500'}`}>
                                            {action.description}
                                        </p>
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Assessments Activity */}
                        {assessments.length > 0 ? (
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <BarChart3 className="w-5 h-5 text-[#0e6957]" />
                                    Your Assessments
                                </h3>
                                <div className="space-y-3">
                                    {assessments.map((assessment) => {
                                        const isCompleted = assessment.status === AssessmentStatus.COMPLETED;
                                        const isInProgress = assessment.status === AssessmentStatus.IN_PROGRESS;
                                        const totalQuestions = assessment.assessment?._count?.questions || 180;
                                        const answeredCount = assessment._count?.responses || 0;
                                        const progressPct = isInProgress ? Math.round((answeredCount / totalQuestions) * 100) : 0;

                                        return (
                                            <div key={assessment.id} className="p-4 bg-gray-50 rounded-xl">
                                                <div className="flex items-center justify-between gap-3">
                                                    <div className="min-w-0">
                                                        <p className="font-medium text-gray-900 truncate">
                                                            {user.role === 'STUDENT' ? 'Career Assessment' : 'Pragya Assessment'}
                                                        </p>
                                                        {isCompleted && (
                                                            <p className="text-sm text-gray-500 truncate">
                                                                Completed {assessment.completedAt && new Date(assessment.completedAt).toLocaleDateString()}
                                                                {assessment.totalScore !== undefined && ` • Score: ${assessment.totalScore.toFixed(0)}%`}
                                                            </p>
                                                        )}
                                                        {isInProgress && (
                                                            <p className="text-sm text-amber-600 truncate">
                                                                In Progress • {answeredCount}/{totalQuestions} answered ({progressPct}%)
                                                            </p>
                                                        )}
                                                    </div>
                                                    <Link
                                                        href={isCompleted ? `/assessment/results/${assessment.id}` : (user?.role === 'STUDENT' ? '/students/assessment' : '/assessment')}
                                                        className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg font-medium transition-colors shrink-0 whitespace-nowrap text-sm sm:text-base ${
                                                            isCompleted
                                                                ? 'bg-[#0e6957] text-white hover:bg-[#0a4f41]'
                                                                : 'bg-amber-500 text-white hover:bg-amber-600'
                                                        }`}
                                                    >
                                                        {isCompleted ? (
                                                            <>
                                                                <Eye className="w-4 h-4" />
                                                                <span className="hidden sm:inline">View Results</span>
                                                                <span className="sm:hidden">View</span>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <ArrowRight className="w-4 h-4" />
                                                                <span className="hidden sm:inline">Continue</span>
                                                                <span className="sm:hidden">Resume</span>
                                                            </>
                                                        )}
                                                    </Link>
                                                </div>
                                                {isInProgress && (
                                                    <div className="mt-3 w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-amber-500 rounded-full transition-all"
                                                            style={{ width: `${progressPct}%` }}
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ) : (
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center py-16">
                                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                                    <Briefcase className="w-8 h-8" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 mb-2">No Recent Activity</h3>
                                <p className="text-gray-500 max-w-md mx-auto">
                                    Your recent applications, test results, and saved items will appear here once you start using the platform.
                                </p>
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </div>
    );
}
