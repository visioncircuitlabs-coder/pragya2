'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
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
    CheckCircle2,
    Clock,
    Lightbulb,
    Heart,
    Sparkles,
    Timer,
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

// ─── Module classification for break detection ─────────────────────────────
const APTITUDE_SECTIONS = new Set([
    'Numerical Reasoning', 'Verbal Reasoning', 'Abstract-Fluid Reasoning',
    'Spatial Ability', 'Mechanical Reasoning', 'Processing Speed & Accuracy',
]);
const RIASEC_SECTIONS = new Set([
    'REALISTIC', 'INVESTIGATIVE', 'ARTISTIC', 'SOCIAL', 'ENTERPRISING', 'CONVENTIONAL',
]);
const PERSONALITY_SECTIONS = new Set([
    'Responsibility & Discipline', 'Curiosity & Openness', 'Stress Tolerance',
    'Social Interaction', 'Team vs Independent Style', 'Decision-Making Style',
]);

type ModuleName = 'APTITUDE' | 'INTEREST' | 'PERSONALITY' | 'SKILL';

const getModule = (section: string): ModuleName => {
    if (APTITUDE_SECTIONS.has(section)) return 'APTITUDE';
    if (RIASEC_SECTIONS.has(section)) return 'INTEREST';
    if (PERSONALITY_SECTIONS.has(section)) return 'PERSONALITY';
    return 'SKILL';
};

interface BreakInfo {
    type: '2min' | '5min';
    key: string;
    label: string;
}

/**
 * Detects whether a mandatory break should trigger when moving forward.
 * - 2-min break: between aptitude subsections
 * - 5-min break: between main modules (Aptitude→Interest, Interest→Personality, Personality→Skill)
 */
const detectBreak = (fromIdx: number, toIdx: number, qs: Question[]): BreakInfo | null => {
    if (toIdx <= fromIdx || !qs[fromIdx] || !qs[toIdx]) return null;

    const fromSection = qs[fromIdx].section;
    const toSection = qs[toIdx].section;
    if (fromSection === toSection) return null;

    const fromModule = getModule(fromSection);
    const toModule = getModule(toSection);

    if (fromModule !== toModule) {
        const MODULE_LABELS: Record<ModuleName, string> = {
            APTITUDE: 'Aptitude', INTEREST: 'Interest',
            PERSONALITY: 'Personality Traits', SKILL: 'Skill',
        };
        return {
            type: '5min',
            key: `module:${fromModule}->${toModule}`,
            label: `Great work finishing ${MODULE_LABELS[fromModule]}! Take a 5-minute break before starting ${MODULE_LABELS[toModule]}.`,
        };
    }

    if (fromModule === 'APTITUDE') {
        return {
            type: '2min',
            key: `aptitude:${fromSection}->${toSection}`,
            label: `You just finished ${fromSection}. Take a short 2-minute break before moving on to ${toSection}.`,
        };
    }

    return null;
};

// ─── Break Overlay Component ────────────────────────────────────────────────
function BreakOverlay({ breakInfo, onContinue }: { breakInfo: BreakInfo; onContinue: () => void }) {
    const totalSeconds = breakInfo.type === '5min' ? 5 * 60 : 2 * 60;
    const [secondsLeft, setSecondsLeft] = useState(totalSeconds);

    useEffect(() => {
        if (secondsLeft <= 0) return;
        const timer = setInterval(() => setSecondsLeft((s) => s - 1), 1000);
        return () => clearInterval(timer);
    }, [secondsLeft]);

    // Auto-continue when timer finishes
    useEffect(() => {
        if (secondsLeft <= 0) onContinue();
    }, [secondsLeft, onContinue]);

    const mins = Math.floor(secondsLeft / 60);
    const secs = secondsLeft % 60;
    const canContinue = secondsLeft <= 0;
    const progress = ((totalSeconds - secondsLeft) / totalSeconds) * 100;

    return (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label="Assessment break">
            <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-5 md:p-8 text-center">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-violet-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Timer className="w-8 h-8 md:w-10 md:h-10 text-violet-600" />
                </div>

                <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">
                    {breakInfo.type === '5min' ? 'Section Complete!' : 'Quick Break'}
                </h2>
                <p className="text-sm md:text-base text-gray-600 mb-6 leading-relaxed">
                    {breakInfo.label}
                </p>

                {/* Timer Display */}
                <div className="mb-6">
                    <div className="text-4xl md:text-5xl font-bold text-violet-600 font-mono mb-3">
                        {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-violet-500 to-purple-500 transition-all duration-1000"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>

                {/* Tips during break */}
                <div className="bg-violet-50 rounded-xl p-4 mb-6 text-left">
                    <p className="text-sm text-violet-700 font-medium mb-2">While you wait:</p>
                    <ul className="text-xs text-violet-600 space-y-1">
                        <li>- Take a few deep breaths</li>
                        <li>- Look away from the screen for a moment</li>
                        <li>- Stretch your hands and shoulders</li>
                    </ul>
                </div>

                <button
                    onClick={onContinue}
                    disabled={!canContinue}
                    className={`w-full py-3 rounded-xl font-semibold text-lg transition-all ${
                        canContinue
                            ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white hover:from-violet-700 hover:to-purple-700 shadow-lg'
                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                >
                    {canContinue ? 'Continue Assessment' : 'Please wait...'}
                </button>
            </div>
        </div>
    );
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

    // Track visited question indices (for skipped question detection)
    const visitedIndicesRef = useRef<Set<number>>(new Set());

    // Break timer state
    const [activeBreak, setActiveBreak] = useState<BreakInfo | null>(null);
    const [pendingNavIndex, setPendingNavIndex] = useState<number | null>(null);

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
                    const resumeIdx = data.lastQuestionIndex || 0;
                    setCurrentQuestionIndex(resumeIdx);
                    // Mark all questions up to resumeIdx as visited
                    for (let i = 0; i <= resumeIdx; i++) {
                        visitedIndicesRef.current.add(i);
                    }
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

    // Mark current question as visited
    useEffect(() => {
        visitedIndicesRef.current.add(currentQuestionIndex);
    }, [currentQuestionIndex]);

    // Handle answer selection — auto-save to server
    const handleSelectOption = (questionId: string, optionId: string) => {
        setAnswers((prev) => ({
            ...prev,
            [questionId]: optionId,
        }));

        // Fire-and-forget save to server so progress persists across sessions
        if (userAssessment?.id) {
            api.post('/assessments/save-progress', {
                userAssessmentId: userAssessment.id,
                questionId,
                selectedOptionId: optionId,
                currentQuestionIndex,
            }).catch((err) => {
                console.warn('Auto-save failed:', err);
            });
        }
    };

    // Navigate questions (with break detection for forward navigation)
    const goToQuestion = useCallback((index: number) => {
        if (index < 0 || index >= questions.length) return;

        // Only check breaks when moving forward to an unvisited question
        // If the target question was already visited, skip break entirely
        if (index > currentQuestionIndex && questions.length > 0 && !visitedIndicesRef.current.has(index)) {
            const breakInfo = detectBreak(currentQuestionIndex, index, questions);
            if (breakInfo) {
                setActiveBreak(breakInfo);
                setPendingNavIndex(index);
                return; // Don't navigate yet — show break overlay
            }
        }

        setCurrentQuestionIndex(index);
    }, [currentQuestionIndex, questions]);

    // Called when break timer finishes
    const handleBreakComplete = useCallback(() => {
        setActiveBreak(null);
        if (pendingNavIndex !== null) {
            setCurrentQuestionIndex(pendingNavIndex);
            setPendingNavIndex(null);
        }
    }, [pendingNavIndex]);

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

    // Compute skipped questions: visited but not answered (excluding current)
    const skippedQuestions = questions.length > 0
        ? Array.from(visitedIndicesRef.current)
            .filter((idx) => idx !== currentQuestionIndex && questions[idx] && !answers[questions[idx].id])
            .sort((a, b) => a - b)
        : [];

    // Loading state
    if (authLoading || loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-violet-50 to-indigo-50 flex items-center justify-center">
                <div className="text-center" role="status">
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
        const SESSION_CARDS = [
            { num: '1', label: 'Aptitude', questions: 60, icon: <Brain className="w-6 h-6" />, color: 'from-blue-500 to-indigo-600', bg: 'bg-blue-50' },
            { num: '2', label: 'Interest', questions: 48, icon: <Heart className="w-6 h-6" />, color: 'from-emerald-500 to-teal-600', bg: 'bg-emerald-50' },
            { num: '3', label: 'Personality Traits', questions: 36, icon: <Sparkles className="w-6 h-6" />, color: 'from-purple-500 to-violet-600', bg: 'bg-purple-50' },
            { num: '4', label: 'Skill', questions: 36, icon: <Target className="w-6 h-6" />, color: 'from-orange-500 to-amber-600', bg: 'bg-orange-50' },
        ];

        return (
            <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-indigo-50 py-8 md:py-12 px-4">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-8 md:mb-10">
                        <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl shadow-lg mb-5">
                            <GraduationCap className="w-8 h-8 md:w-10 md:h-10 text-white" />
                        </div>
                        <h1 className="text-2xl md:text-4xl font-bold text-gray-900 mb-3">
                            Discover Your True Career Direction
                        </h1>
                        <p className="text-sm md:text-base text-gray-600 max-w-2xl mx-auto leading-relaxed">
                            Choosing the right career should not be based only on marks, trends, or others&apos; opinions.
                            The PRAGYA Career Assessment helps you understand your natural strengths, interests, personality,
                            and future readiness using a scientifically designed evaluation system. Instead of guessing your future,
                            you will gain clear insights about the paths that may suit you best.
                        </p>
                    </div>

                    <div className="bg-white rounded-3xl shadow-xl p-5 md:p-10 mb-8">
                        {/* What This Assessment Helps You Discover */}
                        <div className="mb-8">
                            <h3 className="font-bold text-gray-900 text-lg mb-4 flex items-center gap-2">
                                <Lightbulb className="w-5 h-5 text-violet-600" />
                                What This Assessment Helps You Discover
                            </h3>
                            <div className="space-y-3">
                                {[
                                    'Your natural thinking and problem-solving strengths',
                                    'The type of careers and work environments you may enjoy',
                                    'Your learning style and work preferences',
                                    'Your readiness for future careers and skills',
                                    'Career pathways that may match your profile',
                                ].map((item, i) => (
                                    <div key={i} className="flex items-start gap-3">
                                        <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                                        <p className="text-gray-700 text-sm md:text-base">{item}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Assessment Overview — 4 Session Cards */}
                        <div className="mb-8">
                            <h3 className="font-bold text-gray-900 text-lg mb-4 flex items-center gap-2">
                                <BookOpen className="w-5 h-5 text-violet-600" />
                                Assessment Overview
                            </h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-4">
                                {SESSION_CARDS.map((card) => (
                                    <div key={card.num} className={`${card.bg} rounded-xl p-4 text-center`}>
                                        <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center text-white mx-auto mb-2`}>
                                            {card.icon}
                                        </div>
                                        <p className="font-semibold text-gray-900 text-sm md:text-base">{card.label}</p>
                                        <p className="text-xs md:text-sm text-gray-500">{card.questions} items</p>
                                    </div>
                                ))}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-50 rounded-lg px-4 py-3">
                                <Clock className="w-4 h-4 flex-shrink-0" />
                                <p><span className="font-medium text-gray-700">Estimated Time:</span> No time limits. You can complete section by section with breaks in between.</p>
                            </div>
                        </div>

                        {/* Important Instructions */}
                        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 md:p-5 mb-8">
                            <h4 className="font-semibold text-amber-800 mb-3 flex items-center gap-2">
                                <AlertCircle className="w-5 h-5" />
                                Important Instructions
                            </h4>
                            <ul className="text-sm text-amber-700 space-y-2">
                                <li className="flex items-start gap-2">
                                    <span className="font-bold">1.</span>
                                    <span>Read each question carefully and choose the answer that feels most natural to you.</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="font-bold">2.</span>
                                    <span>There are no right or wrong answers — this is about understanding you.</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="font-bold">3.</span>
                                    <span>You will get short breaks between sections. Use them to relax before continuing.</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="font-bold">4.</span>
                                    <span>Answer all items before submitting. You can go back to previous items.</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="font-bold">5.</span>
                                    <span>Questions are available in both English and Malayalam.</span>
                                </li>
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
                            <h1 className="text-base md:text-lg font-bold text-gray-900 truncate max-w-[180px] sm:max-w-none">{currentQuestion?.section}</h1>
                            <p className="text-sm text-gray-500">
                                Item {currentQuestion ? questions.slice(0, currentQuestionIndex + 1).filter(q => q.section === currentQuestion.section).length : 0} of {currentQuestion ? questions.filter(q => q.section === currentQuestion.section).length : 0}
                            </p>
                        </div>
                    </div>

                    <div className="text-right">
                        <p className="text-sm text-gray-500">Answered</p>
                        <p className="font-bold text-violet-600">{currentQuestion ? questions.filter(q => q.section === currentQuestion.section && answers[q.id]).length : 0}/{currentQuestion ? questions.filter(q => q.section === currentQuestion.section).length : 0}</p>
                    </div>
                </div>

                {/* Progress Bar — section-relative */}
                <div className="h-1 bg-gray-200">
                    <div
                        className="h-full bg-gradient-to-r from-violet-500 to-purple-500 transition-all duration-300"
                        style={{ width: `${currentQuestion ? (questions.filter(q => q.section === currentQuestion.section && answers[q.id]).length / questions.filter(q => q.section === currentQuestion.section).length) * 100 : 0}%` }}
                    />
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-6 md:py-8">
                {currentQuestion && (
                    <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
                        {/* Question Text */}
                        <div className="mb-6">
                            <h2 className="text-xl md:text-2xl font-semibold text-gray-900 leading-relaxed">
                                {currentQuestion.text}
                            </h2>
                            {currentQuestion.textMl && (
                                <p className="mt-2 text-base md:text-lg text-gray-600 leading-relaxed" style={{ fontFamily: 'Noto Sans Malayalam, Manjari, sans-serif' }}>
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

                {/* Skipped Questions */}
                {skippedQuestions.length > 0 && (
                    <div className="mt-4 bg-amber-50 border border-amber-200 rounded-2xl p-4 md:p-5">
                        <h3 className="text-sm font-semibold text-amber-800 mb-3">
                            Skipped Questions ({skippedQuestions.length})
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {skippedQuestions.map((idx) => (
                                <button
                                    key={idx}
                                    onClick={() => goToQuestion(idx)}
                                    className="w-9 h-9 rounded-lg bg-white border border-amber-300 text-amber-700 text-sm font-medium hover:bg-amber-100 transition-colors"
                                >
                                    {idx + 1}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

            </main>

            {/* Footer Navigation */}
            <footer className="bg-white border-t border-gray-200 sticky bottom-0 z-10">
                <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
                    <button
                        onClick={() => goToQuestion(currentQuestionIndex - 1)}
                        disabled={currentQuestionIndex === 0}
                        className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
                    >
                        <ChevronLeft className="w-5 h-5" />
                        <span className="hidden sm:inline">Previous</span>
                    </button>

                    <div className="text-xs sm:text-sm text-gray-500 text-center min-w-0">
                        {currentQuestion ? questions.filter(q => q.section === currentQuestion.section && answers[q.id]).length : 0}/{currentQuestion ? questions.filter(q => q.section === currentQuestion.section).length : 0}
                        <span className="hidden sm:inline"> answered</span>
                    </div>

                    {currentQuestionIndex === questions.length - 1 ? (
                        <button
                            onClick={handleSubmit}
                            disabled={submitting || answeredCount < questions.length}
                            className="flex items-center gap-1 sm:gap-2 px-4 sm:px-6 py-2 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-xl font-semibold hover:from-violet-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shrink-0"
                        >
                            {submitting ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    <span className="hidden sm:inline">Submitting...</span>
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
                            className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 text-violet-600 hover:text-violet-800 font-semibold shrink-0"
                        >
                            Next
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    )}
                </div>
            </footer>

            {/* Break Timer Overlay */}
            {activeBreak && (
                <BreakOverlay breakInfo={activeBreak} onContinue={handleBreakComplete} />
            )}
        </div>
    );
}
