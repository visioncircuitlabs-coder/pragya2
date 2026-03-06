'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import { UserRole } from '@pragya/shared';
import {
    ChevronLeft,
    ChevronRight,
    AlertCircle,
    Loader2,
    Brain,
    Target,
    GraduationCap,
    Send,
    BookOpen,
} from 'lucide-react';

interface Option {
    id: string;
    text: string;
    textMl?: string;
    orderIndex: number;
}

interface Question {
    id: string;
    section: string;
    text: string;
    textMl?: string;
    orderIndex: number;
    options: Option[];
}

interface Assessment {
    id: string;
    title: string;
    description?: string;
    type: string;
    timeLimit?: number;
    totalQuestions: number;
}

interface UserAssessment {
    id: string;
    status: string;
    startedAt?: string;
}

// Section information for better UX
const SECTION_INFO: Record<string, { icon: React.ReactNode; color: string; description: string }> = {
    'Numerical Reasoning': {
        icon: <span className="text-2xl">🔢</span>,
        color: 'from-blue-500 to-indigo-600',
        description: 'Problem solving with numbers and patterns',
    },
    'Verbal Reasoning': {
        icon: <span className="text-2xl">📖</span>,
        color: 'from-purple-500 to-violet-600',
        description: 'Logical deduction and verbal analysis',
    },
    'Abstract-Fluid Reasoning': {
        icon: <span className="text-2xl">🧩</span>,
        color: 'from-pink-500 to-rose-600',
        description: 'Pattern recognition and abstract thinking',
    },
    'Spatial Ability': {
        icon: <span className="text-2xl">📐</span>,
        color: 'from-cyan-500 to-teal-600',
        description: '3D visualization and spatial relationships',
    },
    'Mechanical Reasoning': {
        icon: <span className="text-2xl">⚙️</span>,
        color: 'from-orange-500 to-amber-600',
        description: 'Physical principles and mechanical concepts',
    },
    'Processing Speed & Accuracy': {
        icon: <span className="text-2xl">⚡</span>,
        color: 'from-green-500 to-emerald-600',
        description: 'Quick recognition and attention to detail',
    },
};


export default function StudentsAssessmentPage() {
    const router = useRouter();
    const { user, isAuthenticated, isLoading: authLoading } = useAuth();

    // State
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [assessment, setAssessment] = useState<Assessment | null>(null);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [userAssessment, setUserAssessment] = useState<UserAssessment | null>(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [submitting, setSubmitting] = useState(false);
    const [showIntro, setShowIntro] = useState(true);

    // Fetch assessment and questions
    const fetchAssessment = useCallback(async () => {
        try {
            setLoading(true);

            // Get available assessments
            const assessmentsRes = await api.get('/assessments');
            const availableAssessments = assessmentsRes.data as { title: string; id: string }[];

            if (!availableAssessments || availableAssessments.length === 0) {
                setError('No assessments available for your role. Please make sure you are registered as a Student.');
                return;
            }

            // Find the career assessment for students
            const studentAssessment = availableAssessments.find(
                (a) => a.title.includes('Career Assessment') || a.title.includes('Student')
            ) || availableAssessments[0];

            const assessmentId = studentAssessment.id;

            // Check if user has already completed this assessment
            try {
                const resultsRes = await api.get('/assessments/my-results');

                const existingResult = (resultsRes.data as { assessmentId: string; status: string }[]).find(
                    (r) => r.assessmentId === assessmentId && r.status === 'COMPLETED'
                );

                if (existingResult) {
                    // User already completed - redirect to the full results page
                    const raw = existingResult as Record<string, unknown>;
                    router.push(`/assessment/results/${raw.id as string}`);
                    return;
                }
            } catch {
                // No existing results, continue loading assessment
                console.log('No existing results found');
            }

            // Get questions
            const questionsRes = await api.get(
                `/assessments/${assessmentId}/questions`
            );

            const data = questionsRes.data;
            setAssessment(data as unknown as Assessment);
            setQuestions(data.questions);

            // Restore in-progress attempt if it exists
            if (data.userAssessmentId) {
                setUserAssessment({ id: data.userAssessmentId, status: data.status || 'IN_PROGRESS' });
                setShowIntro(false);

                // Restore saved answers
                if (data.savedAnswers && Object.keys(data.savedAnswers).length > 0) {
                    setAnswers(data.savedAnswers);
                    setCurrentQuestionIndex(data.lastQuestionIndex || 0);
                }
            }

        } catch (err: unknown) {
            console.error('Error fetching assessment:', err);
            const errorData = err as { response?: { status?: number; data?: { message?: string } } };
            if (errorData.response?.status === 401) {
                setError('Please login to access the assessment.');
            } else if (errorData.response?.status === 403) {
                setError('This assessment is only available for Students. Please register as a Student.');
            } else {
                setError(errorData.response?.data?.message || 'Failed to load assessment');
            }
        } finally {
            setLoading(false);
        }
    }, []);

    // Start the assessment
    const startAssessment = async () => {
        if (!assessment) return;

        try {
            setLoading(true);
            const startRes = await api.post(
                '/assessments/start',
                { assessmentId: assessment.id }
            );

            setUserAssessment(startRes.data);
            setShowIntro(false);
        } catch (err: unknown) {
            console.error('Error starting assessment:', err);
            const errorData = err as { response?: { data?: { message?: string } } };
            if (errorData.response?.data?.message?.includes('already completed')) {
                // Fetch existing results instead of showing error
                try {
                    const resultsRes = await api.get('/assessments/my-results');

                    // Find the result for this assessment
                    const assessmentResult = (resultsRes.data as { assessmentId: string; id: string }[]).find(
                        (r) => r.assessmentId === assessment.id
                    );

                    if (assessmentResult) {
                        router.push(`/assessment/results/${assessmentResult.id}`);
                    } else {
                        setError('You have already completed this assessment. Check your results in the dashboard.');
                    }
                } catch {
                    setError('You have already completed this assessment. Check your results in the dashboard.');
                }
            } else {
                setError(errorData.response?.data?.message || 'Failed to start assessment');
            }
        } finally {
            setLoading(false);
        }
    };

    // Load assessment on mount
    useEffect(() => {
        if (!authLoading && isAuthenticated && user?.role === UserRole.STUDENT) {
            fetchAssessment();
        } else if (!authLoading && !isAuthenticated) {
            router.push('/login?redirect=/students/assessment');
        } else if (!authLoading && user?.role !== UserRole.STUDENT) {
            setError('This assessment is only available for Students. Please register as a Student to access.');
            setLoading(false);
        }
    }, [authLoading, isAuthenticated, user, fetchAssessment, router]);

    // Handle answer selection
    const handleSelectOption = (questionId: string, optionId: string) => {
        setAnswers((prev) => ({
            ...prev,
            [questionId]: optionId,
        }));
    };

    // Navigate questions
    const goToQuestion = (index: number) => {
        if (index >= 0 && index < questions.length) {
            setCurrentQuestionIndex(index);
        }
    };

    // Submit assessment
    const handleSubmit = async () => {
        if (!userAssessment) return;

        setSubmitting(true);
        try {
            const answersArray = Object.entries(answers).map(([questionId, selectedOptionId]) => ({
                questionId,
                selectedOptionId,
            }));

            const res = await api.post(
                '/assessments/submit',
                {
                    userAssessmentId: userAssessment.id,
                    answers: answersArray,
                }
            );

            // Redirect to the full results page
            router.push(`/assessment/results/${userAssessment.id}`);
        } catch (err: unknown) {
            console.error('Error submitting assessment:', err);
            const errorData = err as { response?: { data?: { message?: string } } };
            setError(errorData.response?.data?.message || 'Failed to submit assessment');
        } finally {
            setSubmitting(false);
        }
    };

    // Calculate progress
    const answeredCount = Object.keys(answers).length;
    const progress = questions.length > 0 ? (answeredCount / questions.length) * 100 : 0;

    // Current question
    const currentQuestion = questions[currentQuestionIndex];

    // Get unique sections
    const sections = [...new Set(questions.map((q) => q.section))];

    // Get current section info
    const currentSectionInfo = currentQuestion ? SECTION_INFO[currentQuestion.section] : null;

    // Loading state
    if (authLoading || loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-violet-50 to-indigo-50 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 animate-spin text-violet-600 mx-auto mb-4" />
                    <p className="text-gray-600">Loading assessment...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-violet-50 to-indigo-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md text-center">
                    <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Error</h2>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <button
                            onClick={() => router.push('/dashboard')}
                            className="px-6 py-3 bg-violet-600 text-white rounded-xl font-semibold hover:bg-violet-700 transition-colors"
                        >
                            Go to Dashboard
                        </button>
                        <button
                            onClick={() => router.push('/register')}
                            className="px-6 py-3 border-2 border-violet-600 text-violet-600 rounded-xl font-semibold hover:bg-violet-50 transition-colors"
                        >
                            Register as Student
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Results are shown on the dedicated results page at /assessment/results/[id]
    // The page redirects there after submission or when completed results are found
    // (see fetchAssessment and handleSubmit above)
    // Intro/Welcome Screen
    if (showIntro && assessment) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-indigo-50 py-12 px-4">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl shadow-lg mb-6">
                            <GraduationCap className="w-10 h-10 text-white" />
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                            {assessment.title}
                        </h1>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Discover your aptitudes and find the career path that&apos;s right for you
                        </p>
                    </div>

                    {/* Assessment Info Card */}
                    <div className="bg-white rounded-3xl shadow-xl p-6 md:p-10 mb-8">
                        <div className="grid md:grid-cols-3 gap-6 mb-8">
                            <div className="text-center p-4 bg-violet-50 rounded-xl">
                                <BookOpen className="w-8 h-8 text-violet-600 mx-auto mb-2" />
                                <p className="text-2xl font-bold text-gray-900">{assessment.totalQuestions}</p>
                                <p className="text-sm text-gray-600">Questions</p>
                            </div>
                            <div className="text-center p-4 bg-purple-50 rounded-xl">
                                <Target className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                                <p className="text-2xl font-bold text-gray-900">{sections.length}</p>
                                <p className="text-sm text-gray-600">Sections</p>
                            </div>
                            <div className="text-center p-4 bg-indigo-50 rounded-xl">
                                <Brain className="w-8 h-8 text-indigo-600 mx-auto mb-2" />
                                <p className="text-2xl font-bold text-gray-900">No Limit</p>
                                <p className="text-sm text-gray-600">Time</p>
                            </div>
                        </div>

                        {/* Sections Preview */}
                        <h3 className="font-semibold text-gray-900 mb-4">Assessment Sections:</h3>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                            {sections.map((section) => {
                                const info = SECTION_INFO[section];
                                return (
                                    <div
                                        key={section}
                                        className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl"
                                    >
                                        <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${info?.color || 'from-gray-400 to-gray-500'} flex items-center justify-center text-white`}>
                                            {info?.icon || '📝'}
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900 text-sm">{section}</p>
                                            <p className="text-xs text-gray-500">{info?.description || ''}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Instructions */}
                        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8">
                            <h4 className="font-semibold text-amber-800 mb-2">📋 Instructions</h4>
                            <ul className="text-sm text-amber-700 space-y-1">
                                <li>• Read each question carefully before answering</li>
                                <li>• You can navigate between questions using the navigation panel</li>
                                <li>• There is no time limit - take your time</li>
                                <li>• Answer all questions before submitting</li>
                                <li>• Questions are available in English and Malayalam</li>
                            </ul>
                        </div>

                        {/* Start Button */}
                        <button
                            onClick={startAssessment}
                            disabled={loading}
                            className="w-full py-4 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-xl font-semibold text-lg hover:from-violet-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Starting...
                                </span>
                            ) : (
                                'Start Assessment'
                            )}
                        </button>
                    </div>
                </div>
            </div>
        );
    }


    // Assessment Wizard UI
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
                <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        {currentSectionInfo && (
                            <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${currentSectionInfo.color} flex items-center justify-center text-white shadow`}>
                                {currentSectionInfo.icon}
                            </div>
                        )}
                        <div>
                            <h1 className="text-lg font-bold text-gray-900">{currentQuestion?.section}</h1>
                            <p className="text-sm text-gray-500">
                                Question {currentQuestionIndex + 1} of {questions.length}
                            </p>
                        </div>
                    </div>

                    <div className="text-right">
                        <p className="text-sm text-gray-500">Answered</p>
                        <p className="font-bold text-violet-600">{answeredCount}/{questions.length}</p>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="h-1 bg-gray-200">
                    <div
                        className="h-full bg-gradient-to-r from-violet-500 to-purple-500 transition-all duration-300"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-8">
                {currentQuestion && (
                    <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
                        {/* Question Text */}
                        <div className="mb-6">
                            <h2 className="text-xl md:text-2xl font-semibold text-gray-900 leading-relaxed">
                                {currentQuestion.text}
                            </h2>
                            {currentQuestion.textMl && (
                                <p className="mt-2 text-lg text-gray-600 leading-relaxed" style={{ fontFamily: 'Noto Sans Malayalam, Manjari, sans-serif' }}>
                                    {currentQuestion.textMl}
                                </p>
                            )}
                        </div>

                        {/* Options */}
                        <div className="space-y-3">
                            {currentQuestion.options.map((option, idx) => {
                                const isSelected = answers[currentQuestion.id] === option.id;
                                const optionLabels = ['A', 'B', 'C', 'D'];
                                return (
                                    <button
                                        key={option.id}
                                        onClick={() => handleSelectOption(currentQuestion.id, option.id)}
                                        className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 ${isSelected
                                            ? 'border-violet-500 bg-violet-50 shadow-md'
                                            : 'border-gray-200 hover:border-violet-300 hover:bg-gray-50'
                                            }`}
                                    >
                                        <div className="flex items-start gap-3">
                                            <div
                                                className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 font-semibold ${isSelected
                                                    ? 'bg-violet-500 text-white'
                                                    : 'bg-gray-100 text-gray-600'
                                                    }`}
                                            >
                                                {optionLabels[idx]}
                                            </div>
                                            <div className="flex-1">
                                                <span className={`font-medium ${isSelected ? 'text-violet-900' : 'text-gray-700'}`}>
                                                    {option.text}
                                                </span>
                                                {option.textMl && (
                                                    <span className={`block mt-1 text-sm ${isSelected ? 'text-violet-700' : 'text-gray-500'}`} style={{ fontFamily: 'Noto Sans Malayalam, Manjari, sans-serif' }}>
                                                        {option.textMl}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Question Navigator */}
                <div className="mt-6 bg-white rounded-xl shadow p-4">
                    <p className="text-sm text-gray-500 mb-3">Jump to question:</p>
                    <div className="flex flex-wrap gap-2">
                        {questions.map((q, idx) => {
                            const isAnswered = answers[q.id];
                            const isCurrent = idx === currentQuestionIndex;
                            return (
                                <button
                                    key={q.id}
                                    onClick={() => goToQuestion(idx)}
                                    className={`w-10 h-10 rounded-lg text-sm font-medium transition-all ${isCurrent
                                        ? 'bg-violet-600 text-white shadow-lg'
                                        : isAnswered
                                            ? 'bg-violet-100 text-violet-700 hover:bg-violet-200'
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                >
                                    {idx + 1}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </main>

            {/* Footer Navigation */}
            <footer className="bg-white border-t border-gray-200 sticky bottom-0">
                <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
                    <button
                        onClick={() => goToQuestion(currentQuestionIndex - 1)}
                        disabled={currentQuestionIndex === 0}
                        className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <ChevronLeft className="w-5 h-5" />
                        Previous
                    </button>

                    <div className="text-sm text-gray-500">
                        {answeredCount} of {questions.length} answered
                    </div>

                    {currentQuestionIndex === questions.length - 1 ? (
                        <button
                            onClick={handleSubmit}
                            disabled={submitting || answeredCount < questions.length}
                            className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-xl font-semibold hover:from-violet-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
                        >
                            {submitting ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Submitting...
                                </>
                            ) : (
                                <>
                                    <Send className="w-5 h-5" />
                                    Submit
                                </>
                            )}
                        </button>
                    ) : (
                        <button
                            onClick={() => goToQuestion(currentQuestionIndex + 1)}
                            className="flex items-center gap-2 px-4 py-2 text-violet-600 hover:text-violet-800 font-semibold"
                        >
                            Next
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    )}
                </div>
            </footer>
        </div>
    );
}
