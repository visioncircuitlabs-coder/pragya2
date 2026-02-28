'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import { UserRole, AssessmentStatus } from '@pragya/shared';
import {
    Clock,
    ChevronLeft,
    ChevronRight,
    CheckCircle2,
    AlertCircle,
    Loader2,
    Brain,
    Target,
    Send,
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
    status: AssessmentStatus;
    startedAt?: string;
}

export default function AssessmentPage() {
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
    const [timeLeft, setTimeLeft] = useState<number | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [completed, setCompleted] = useState(false);
    const [result, setResult] = useState<unknown>(null);

    // Fetch assessment and questions
    const fetchAssessment = useCallback(async () => {
        try {
            setLoading(true);

            // Get available assessments
            const assessmentsRes = await api.get('/assessments');
            const availableAssessments = assessmentsRes.data as { id: string }[];

            if (!availableAssessments || availableAssessments.length === 0) {
                setError('No assessments available for your role.');
                return;
            }

            // Use the first available assessment (Employability)
            const assessmentId = availableAssessments[0].id;

            // Get questions — API returns flat { id, title, timeLimit, questions, ... }
            const questionsRes = await api.get(
                `/assessments/${assessmentId}/questions`
            );

            const assessmentData = questionsRes.data;
            setAssessment({
                id: assessmentData.id,
                title: assessmentData.title,
                description: assessmentData.description,
                type: assessmentData.type,
                timeLimit: assessmentData.timeLimit,
                totalQuestions: assessmentData.questions?.length || 0,
            });
            setQuestions(assessmentData.questions || []);

            // Restore saved progress
            if (assessmentData.savedAnswers) {
                setAnswers(assessmentData.savedAnswers);
            }
            if (assessmentData.lastQuestionIndex !== undefined) {
                setCurrentQuestionIndex(assessmentData.lastQuestionIndex);
            }

            // Start the assessment
            const startRes = await api.post(
                '/assessments/start',
                { assessmentId }
            );

            // Map response: backend returns { userAssessmentId } but we need { id }
            const startData = startRes.data;
            setUserAssessment({
                id: startData.userAssessmentId || startData.id,
                status: startData.status,
                startedAt: startData.startedAt,
            });

            // Set timer if time limit exists
            if (assessmentData.timeLimit) {
                setTimeLeft(assessmentData.timeLimit * 60);
            }

        } catch (err: unknown) {
            console.error('Error fetching assessment:', err);
            const errorData = err as { response?: { data?: { message?: string } } };
            setError(errorData.response?.data?.message || 'Failed to load assessment');
        } finally {
            setLoading(false);
        }
    }, []);

    // Timer countdown
    useEffect(() => {
        if (timeLeft === null || timeLeft <= 0 || completed) return;

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev && prev <= 1) {
                    clearInterval(timer);
                    handleSubmit(); // Auto-submit when time runs out
                    return 0;
                }
                return prev ? prev - 1 : 0;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft, completed, handleSubmit]); // Added handleSubmit to dependencies

    // Load assessment on mount
    useEffect(() => {
        if (!authLoading && isAuthenticated && (user?.role === UserRole.JOB_SEEKER || user?.role === UserRole.STUDENT)) {
            fetchAssessment();
        } else if (!authLoading && !isAuthenticated) {
            router.push('/login');
        } else if (!authLoading && user?.role !== UserRole.JOB_SEEKER && user?.role !== UserRole.STUDENT) {
            setError('This assessment is available for Job Seekers and Students.');
            setLoading(false);
        }
    }, [authLoading, isAuthenticated, user, fetchAssessment, router]);

    // Handle answer selection
    const handleSelectOption = async (questionId: string, optionId: string) => {
        setAnswers((prev) => ({
            ...prev,
            [questionId]: optionId,
        }));

        // Auto-save progress immediately
        if (userAssessment) {
            try {
                await api.post(
                    '/assessments/save-progress',
                    {
                        userAssessmentId: userAssessment.id,
                        questionId,
                        selectedOptionId: optionId,
                        currentQuestionIndex,
                    }
                );
            } catch (err) {
                console.error('Failed to auto-save progress', err);
            }
        }
    };

    // Navigate questions
    const goToQuestion = (index: number) => {
        if (index >= 0 && index < questions.length) {
            setCurrentQuestionIndex(index);
        }
    };

    // Submit assessment
    // eslint-disable-next-line react-hooks/exhaustive-deps
    async function handleSubmit() {
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

            setResult(res.data);
            setCompleted(true);
        } catch (err: unknown) {
            console.error('Error submitting assessment:', err);
            const errorData = err as { response?: { data?: { message?: string } } };
            setError(errorData.response?.data?.message || 'Failed to submit assessment');
        } finally {
            setSubmitting(false);
        }
    }

    // Format time
    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    // Calculate progress
    const answeredCount = Object.keys(answers).length;
    const progress = questions.length > 0 ? (answeredCount / questions.length) * 100 : 0;

    // Current question
    const currentQuestion = questions[currentQuestionIndex];

    // Module grouping for multi-module assessments (student 4-module)
    const MODULE_SECTION_MAP: Record<string, string> = {
        // Aptitude sections
        'Numerical Reasoning': 'Aptitude',
        'Verbal Reasoning': 'Aptitude',
        'Abstract-Fluid Reasoning': 'Aptitude',
        'Spatial Ability': 'Aptitude',
        'Mechanical Reasoning': 'Aptitude',
        'Processing Speed & Accuracy': 'Aptitude',
        // Job seeker aptitude sections
        'Logical & Analytical Reasoning': 'Aptitude',
        'Attention & Speed': 'Aptitude',
        'Work-Style Problem Solving': 'Aptitude',
        // RIASEC sections
        'REALISTIC': 'Career Interests',
        'INVESTIGATIVE': 'Career Interests',
        'ARTISTIC': 'Career Interests',
        'SOCIAL': 'Career Interests',
        'ENTERPRISING': 'Career Interests',
        'CONVENTIONAL': 'Career Interests',
        // Personality sections
        'Responsibility & Discipline': 'Personality',
        'Stress Tolerance': 'Personality',
        'Curiosity & Openness': 'Personality',
        'Social Interaction': 'Personality',
        'Team vs Independent Style': 'Personality',
        'Decision-Making Style': 'Personality',
        // Job seeker personality sections
        'Work Discipline & Task Reliability': 'Personality',
        'Stress Tolerance & Emotional Regulation': 'Personality',
        'Learning & Change Orientation': 'Personality',
        'Social Engagement & Task Focus': 'Personality',
        'Team Compatibility & Cooperation': 'Personality',
        'Integrity & Responsibility': 'Personality',
        // Readiness sections
        'Communication & Expression': 'Career Readiness',
        'Problem-Solving Approach': 'Career Readiness',
        'Creativity & Idea Generation': 'Career Readiness',
        'Adaptability': 'Career Readiness',
        'Time Management & Responsibility': 'Career Readiness',
        'Digital Awareness': 'Career Readiness',
        // Job seeker employability sections
        'Core Skills': 'Employability',
        'Functional Skills': 'Employability',
        'Behavioral Skills': 'Employability',
    };

    // Derive ordered modules from the actual questions
    const modules = (() => {
        const seen = new Set<string>();
        const result: { name: string; startIdx: number; endIdx: number; questionCount: number }[] = [];
        let currentModule = '';
        let startIdx = 0;

        questions.forEach((q, idx) => {
            const mod = MODULE_SECTION_MAP[q.section] || q.section;
            if (mod !== currentModule) {
                if (currentModule && !seen.has(currentModule)) {
                    seen.add(currentModule);
                    result.push({ name: currentModule, startIdx, endIdx: idx - 1, questionCount: idx - startIdx });
                }
                currentModule = mod;
                startIdx = idx;
            }
        });
        // Push last module
        if (currentModule && !seen.has(currentModule)) {
            result.push({ name: currentModule, startIdx, endIdx: questions.length - 1, questionCount: questions.length - startIdx });
        }
        return result;
    })();

    const currentModuleName = currentQuestion ? (MODULE_SECTION_MAP[currentQuestion.section] || currentQuestion.section) : '';
    const currentModuleIndex = modules.findIndex(m => m.name === currentModuleName);
    const isMultiModule = modules.length > 1;

    // Loading state
    if (authLoading || loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 animate-spin text-[#0e6957] mx-auto mb-4" />
                    <p className="text-gray-600">Loading assessment...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md text-center">
                    <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Error</h2>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <button
                        onClick={() => router.push('/dashboard')}
                        className="px-6 py-3 bg-[#0e6957] text-white rounded-xl font-semibold hover:bg-[#0a4f41] transition-colors"
                    >
                        Return to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    // Completed state - Results View
    if (completed && result) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 py-12 px-4">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12">
                        {/* Success Header */}
                        <div className="text-center mb-10">
                            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <CheckCircle2 className="w-10 h-10 text-emerald-600" />
                            </div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">Assessment Complete!</h1>
                            <p className="text-gray-600">Your responses have been recorded and analyzed.</p>
                        </div>

                        {/* Score Overview */}
                        {result && typeof result === 'object' && 'totalScore' in result && result.totalScore !== null && (
                            <div className="bg-gradient-to-r from-[#0e6957] to-emerald-600 rounded-2xl p-6 text-white text-center mb-8">
                                <p className="text-emerald-100 text-sm uppercase tracking-wide mb-1">Overall Score</p>
                                <p className="text-5xl font-bold">{(result.totalScore as number).toFixed(1)}%</p>
                            </div>
                        )}

                        {/* AI Analysis Notice */}
                        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl p-6 mb-8">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                    <Brain className="w-6 h-6 text-purple-600" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-2">AI Career Insights Generated</h3>
                                    <p className="text-gray-600 text-sm">
                                        Your personalized career analysis is ready! View your RIASEC profile,
                                        aptitude scores, personality insights, and career recommendations.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button
                                onClick={() => router.push(`/assessment/results/${(result as { id: string }).id}`)}
                                className="px-8 py-3 bg-[#0e6957] text-white rounded-xl font-semibold hover:bg-[#0a4f41] transition-colors flex items-center justify-center gap-2"
                            >
                                <Target className="w-5 h-5" />
                                View Full Report
                            </button>
                            <button
                                onClick={() => router.push('/dashboard')}
                                className="px-8 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                            >
                                Go to Dashboard
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Assessment Wizard UI
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Header with Timer */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
                <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-bold text-gray-900">{assessment?.title}</h1>
                        <p className="text-sm text-gray-500">
                            Question {currentQuestionIndex + 1} of {questions.length}
                        </p>
                    </div>

                    {/* Timer */}
                    {timeLeft !== null && (
                        <div
                            className={`flex items-center gap-2 px-4 py-2 rounded-full ${timeLeft < 300 ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'
                                }`}
                        >
                            <Clock className="w-5 h-5" />
                            <span className="font-mono font-bold">{formatTime(timeLeft)}</span>
                        </div>
                    )}
                </div>

                {/* Progress Bar */}
                <div className="h-1 bg-gray-200">
                    <div
                        className="h-full bg-[#0e6957] transition-all duration-300"
                        style={{ width: `${progress}%` }}
                    />
                </div>

                {/* Module Stepper - for multi-module assessments */}
                {isMultiModule && (
                    <div className="bg-gray-50 border-t border-gray-100 px-4 py-2">
                        <div className="max-w-5xl mx-auto flex items-center gap-2 overflow-x-auto">
                            {modules.map((mod, idx) => {
                                const isActive = idx === currentModuleIndex;
                                const isCompleted = idx < currentModuleIndex;
                                // Count answered questions in this module
                                const moduleQuestions = questions.slice(mod.startIdx, mod.endIdx + 1);
                                const moduleAnswered = moduleQuestions.filter(q => answers[q.id]).length;
                                const moduleComplete = moduleAnswered === moduleQuestions.length;
                                return (
                                    <React.Fragment key={mod.name}>
                                        {idx > 0 && (
                                            <div className={`flex-shrink-0 w-6 h-0.5 ${isCompleted || isActive ? 'bg-[#0e6957]' : 'bg-gray-300'}`} />
                                        )}
                                        <button
                                            onClick={() => goToQuestion(mod.startIdx)}
                                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                                                isActive
                                                    ? 'bg-[#0e6957] text-white'
                                                    : moduleComplete || isCompleted
                                                        ? 'bg-emerald-100 text-emerald-700'
                                                        : 'bg-gray-200 text-gray-500 hover:bg-gray-300'
                                            }`}
                                        >
                                            {(moduleComplete || isCompleted) && !isActive && (
                                                <CheckCircle2 className="w-3 h-3" />
                                            )}
                                            <span>{mod.name}</span>
                                            <span className="opacity-70">({moduleAnswered}/{moduleQuestions.length})</span>
                                        </button>
                                    </React.Fragment>
                                );
                            })}
                        </div>
                    </div>
                )}
            </header>

            {/* Main Content */}
            <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-8">
                {currentQuestion && (
                    <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
                        {/* Section Badge */}
                        <div className="inline-block px-3 py-1 bg-emerald-100 text-emerald-700 text-sm font-medium rounded-full mb-4">
                            {currentQuestion.section}
                        </div>

                        {/* Question Text */}
                        <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-2">
                            {currentQuestion.text}
                        </h2>
                        {currentQuestion.textMl && (
                            <p className="text-gray-500 text-sm mb-6 italic">{currentQuestion.textMl}</p>
                        )}

                        {/* Options */}
                        <div className="space-y-3 mt-6">
                            {currentQuestion.options.map((option) => {
                                const isSelected = answers[currentQuestion.id] === option.id;
                                return (
                                    <button
                                        key={option.id}
                                        onClick={() => handleSelectOption(currentQuestion.id, option.id)}
                                        className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 ${isSelected
                                            ? 'border-[#0e6957] bg-emerald-50 shadow-md'
                                            : 'border-gray-200 hover:border-emerald-300 hover:bg-gray-50'
                                            }`}
                                    >
                                        <div className="flex items-start gap-3">
                                            <div
                                                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${isSelected
                                                    ? 'border-[#0e6957] bg-[#0e6957]'
                                                    : 'border-gray-300'
                                                    }`}
                                            >
                                                {isSelected && (
                                                    <CheckCircle2 className="w-4 h-4 text-white" />
                                                )}
                                            </div>
                                            <div>
                                                <span className="font-medium text-gray-900">{option.text}</span>
                                                {option.textMl && (
                                                    <span className="block text-sm text-gray-500 mt-1">{option.textMl}</span>
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
                                        ? 'bg-[#0e6957] text-white'
                                        : isAnswered
                                            ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
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
                            className="flex items-center gap-2 px-6 py-2 bg-[#0e6957] text-white rounded-xl font-semibold hover:bg-[#0a4f41] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
                            className="flex items-center gap-2 px-4 py-2 text-[#0e6957] hover:text-[#0a4f41] font-semibold"
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
