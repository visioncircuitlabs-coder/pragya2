'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import { UserRole } from '@pragya/shared';
import {
    ChevronLeft,
    ChevronRight,
    CheckCircle2,
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

interface AssessmentResult {
    id: string;
    assessmentId?: string;
    status?: string;
    totalScore?: number;
    sectionScores?: Record<string, number>;
    completedAt?: string;
    aiInsights?: {
        studentPersona?: { title: string; description: string; superpower: string };
        academicStreams?: { recommended: string[] };
        careerGuidance?: { suggestedCareers: (string | { role: string; fitReason?: string })[]; skillsToDevelop: string[] };
    };
}

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
    const [, setCompleted] = useState(false);
    const [result, setResult] = useState<AssessmentResult | null>(null);
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
                    // User already completed - show results directly
                    setAssessment(studentAssessment as unknown as Assessment);
                    setResult(existingResult as unknown as AssessmentResult);
                    setCompleted(true);
                    setShowIntro(false);
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

            setAssessment(questionsRes.data.assessment);
            setQuestions(questionsRes.data.questions);

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
                    const assessmentResult = (resultsRes.data as { assessmentId: string }[]).find(
                        (r) => r.assessmentId === assessment.id
                    );

                    if (assessmentResult) {
                        setResult(assessmentResult as unknown as AssessmentResult);
                        setCompleted(true);
                        setShowIntro(false);
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

            setResult(res.data);
            setCompleted(true);
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

    // Completed - Show Results
    if (result) {
        const sectionScores = result.sectionScores || {};
        const sortedSections = Object.entries(sectionScores)
            .sort(([, a], [, b]) => (Number(b) || 0) - (Number(a) || 0));
        const topStrengths = sortedSections.slice(0, 3);
        const areasForGrowth = sortedSections.slice(-2).reverse();

        // Career recommendations based on top aptitudes
        const careerRecommendations: Record<string, { streams: string[]; careers: string[]; skills: string[] }> = {
            'Numerical Reasoning': {
                streams: ['Commerce', 'Science (PCM)', 'Economics', 'Statistics'],
                careers: ['Data Analyst', 'Accountant', 'Financial Planner', 'Actuary', 'Economist'],
                skills: ['Excel & Spreadsheets', 'Statistical Analysis', 'Financial Modeling']
            },
            'Verbal Reasoning': {
                streams: ['Humanities', 'Law', 'Journalism', 'Literature'],
                careers: ['Lawyer', 'Content Writer', 'Journalist', 'Teacher', 'Public Relations'],
                skills: ['Critical Reading', 'Debate', 'Creative Writing']
            },
            'Abstract-Fluid Reasoning': {
                streams: ['Science', 'Engineering', 'Research', 'Philosophy'],
                careers: ['Researcher', 'Data Scientist', 'Strategic Consultant', 'Scientist', 'Software Developer'],
                skills: ['Problem Solving', 'Logical Thinking', 'Pattern Recognition']
            },
            'Spatial Ability': {
                streams: ['Architecture', 'Design', 'Engineering', 'Fine Arts'],
                careers: ['Architect', 'Interior Designer', 'Civil Engineer', 'Game Designer', 'Animator'],
                skills: ['CAD Software', '3D Modeling', 'Technical Drawing']
            },
            'Mechanical Reasoning': {
                streams: ['Engineering', 'Technology', 'Automobile', 'Manufacturing'],
                careers: ['Mechanical Engineer', 'Robotics Engineer', 'Technician', 'Product Designer', 'Mechanic'],
                skills: ['Technical Skills', 'Hardware Knowledge', 'Problem Diagnosis']
            },
            'Processing Speed & Accuracy': {
                streams: ['Computer Science', 'Administration', 'Quality Control', 'Operations'],
                careers: ['Software Developer', 'Quality Analyst', 'Data Entry Specialist', 'Air Traffic Controller', 'Surgeon'],
                skills: ['Attention to Detail', 'Speed Typing', 'Quality Assurance']
            }
        };

        // Get recommendations based on top strength
        const topSection = topStrengths[0]?.[0] || '';
        const recommendations = careerRecommendations[topSection] || { streams: [], careers: [], skills: [] };

        return (
            <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-indigo-50 py-8 px-4">
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-lg mb-6">
                            <CheckCircle2 className="w-10 h-10 text-white" />
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                            Your Career Assessment Report
                        </h1>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Based on the Pragya Career Assessment • Completed on {result.completedAt ? new Date(result.completedAt).toLocaleDateString('en-IN', { dateStyle: 'long' }) : 'Today'}
                        </p>
                    </div>

                    {/* Overall Score Banner */}
                    <div className="bg-gradient-to-r from-violet-600 to-purple-600 rounded-3xl shadow-xl p-8 mb-8 text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
                        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                            <div>
                                <p className="text-violet-200 text-sm mb-1">Overall Aptitude Score</p>
                                <p className="text-6xl font-black">
                                    {result.totalScore !== undefined ? `${Math.round(result.totalScore)}%` : 'N/A'}
                                </p>
                                <p className="text-violet-200 mt-2">
                                    {(result.totalScore || 0) >= 80 ? 'Excellent Performance!' :
                                        (result.totalScore || 0) >= 60 ? 'Good Performance!' :
                                            (result.totalScore || 0) >= 40 ? 'Average Performance' : 'Needs Improvement'}
                                </p>
                            </div>
                            <div className="text-center md:text-right">
                                <p className="text-violet-200 text-sm mb-2">Top Aptitude</p>
                                <div className="flex items-center gap-3 bg-white/20 rounded-xl px-4 py-3">
                                    {SECTION_INFO[topSection]?.icon || <span className="text-2xl">🎯</span>}
                                    <span className="text-xl font-bold">{topSection}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Student Persona Section - NEW */}
                    {result.aiInsights?.studentPersona && (
                        <div className="bg-white rounded-3xl shadow-xl p-8 mb-8 border-l-8 border-violet-600 relative overflow-hidden">
                            <div className="relative z-10">
                                <span className="inline-block px-4 py-1 bg-violet-100 text-violet-700 rounded-full text-sm font-bold mb-4">
                                    Your Learning Persona
                                </span>
                                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                                    {result.aiInsights.studentPersona.title}
                                </h2>
                                <p className="text-lg text-gray-700 leading-relaxed max-w-3xl mb-6">
                                    {result.aiInsights.studentPersona.description}
                                </p>
                                <div className="flex items-center gap-3 bg-violet-50 rounded-xl p-4 w-fit">
                                    <span className="text-2xl">⚡</span>
                                    <div>
                                        <p className="text-xs text-uppercase font-bold text-violet-500 tracking-wider">SUPERPOWER</p>
                                        <p className="font-bold text-gray-900">{result.aiInsights.studentPersona.superpower}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="absolute -right-20 -bottom-20 opacity-5">
                                <Brain className="w-96 h-96" />
                            </div>
                        </div>
                    )}

                    <div className="grid md:grid-cols-3 gap-6 mb-8">
                        {/* Strengths */}
                        <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-green-500">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                                    <span className="text-lg">💪</span>
                                </div>
                                <h3 className="font-bold text-gray-900">Your Strengths</h3>
                            </div>
                            <div className="space-y-3">
                                {topStrengths.map(([section, score], idx) => (
                                    <div key={section} className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-bold text-green-600">#{idx + 1}</span>
                                            <span className="text-sm text-gray-700">{section}</span>
                                        </div>
                                        <span className="text-sm font-bold text-green-600">{Math.round(Number(score))}%</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Recommended Streams */}
                        <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-violet-500">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-8 h-8 rounded-lg bg-violet-100 flex items-center justify-center">
                                    <GraduationCap className="w-5 h-5 text-violet-600" />
                                </div>
                                <h3 className="font-bold text-gray-900">Recommended Streams</h3>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {result.aiInsights?.academicStreams?.recommended ? (
                                    (result.aiInsights.academicStreams.recommended as string[]).map((stream: string) => (
                                        <span key={stream} className="px-3 py-1.5 bg-violet-50 text-violet-700 rounded-full text-sm font-medium">
                                            {stream}
                                        </span>
                                    ))
                                ) : (
                                    recommendations.streams.map((stream) => (
                                        <span key={stream} className="px-3 py-1.5 bg-violet-50 text-violet-700 rounded-full text-sm font-medium">
                                            {stream}
                                        </span>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Areas for Growth */}
                        <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-amber-500">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
                                    <span className="text-lg">📈</span>
                                </div>
                                <h3 className="font-bold text-gray-900">Areas for Growth</h3>
                            </div>
                            <div className="space-y-3">
                                {areasForGrowth.map(([section, score]) => (
                                    <div key={section} className="flex items-center justify-between">
                                        <span className="text-sm text-gray-700">{section}</span>
                                        <span className="text-sm font-medium text-amber-600">{Math.round(Number(score))}%</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Detailed Section Analysis */}
                    <div className="bg-white rounded-3xl shadow-xl p-6 md:p-8 mb-8">
                        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <Brain className="w-6 h-6 text-violet-600" />
                            Detailed Aptitude Analysis
                        </h2>
                        <div className="grid md:grid-cols-2 gap-4">
                            {sortedSections.map(([section, score], idx) => {
                                const sectionInfo = SECTION_INFO[section];
                                const scoreNum = Number(score) || 0;
                                const isStrength = idx < 3;
                                return (
                                    <div key={section} className={`p-5 rounded-xl border-2 transition-all ${isStrength ? 'border-green-200 bg-green-50/50' : 'border-gray-100 bg-gray-50/50'}`}>
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center gap-3">
                                                {sectionInfo?.icon || <span className="text-2xl">📊</span>}
                                                <div>
                                                    <span className="font-semibold text-gray-900">{section}</span>
                                                    <p className="text-xs text-gray-500">{sectionInfo?.description}</p>
                                                </div>
                                            </div>
                                            <span className={`text-2xl font-black ${scoreNum >= 70 ? 'text-green-600' : scoreNum >= 40 ? 'text-amber-600' : 'text-red-500'}`}>
                                                {Math.round(scoreNum)}%
                                            </span>
                                        </div>
                                        <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full rounded-full bg-gradient-to-r ${sectionInfo?.color || 'from-violet-500 to-purple-600'}`}
                                                style={{ width: `${Math.min(100, scoreNum)}%` }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Career Pathways */}
                    <div className="bg-white rounded-3xl shadow-xl p-6 md:p-8 mb-8">
                        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <Target className="w-6 h-6 text-violet-600" />
                            Career Pathways for You
                        </h2>
                        <p className="text-gray-600 mb-6">
                            Based on your top aptitude in <span className="font-bold text-violet-600">{topSection}</span>, here are career paths that align with your natural abilities:
                        </p>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {result.aiInsights?.careerGuidance?.suggestedCareers ? (
                                // AI Data (Detailed objects or strings)
                                (result.aiInsights.careerGuidance.suggestedCareers as (string | { role: string; fitReason?: string })[]).map((career, idx: number) => (
                                    <div key={idx} className="flex flex-col gap-3 p-5 bg-gradient-to-r from-violet-50 to-purple-50 rounded-xl border border-violet-100">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-violet-600 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                                                {idx + 1}
                                            </div>
                                            <span className="font-bold text-gray-800 text-lg">
                                                {typeof career === 'string' ? career : career.role}
                                            </span>
                                        </div>
                                        {typeof career !== 'string' && career.fitReason && (
                                            <p className="text-sm text-gray-600 italic border-l-2 border-violet-200 pl-3">
                                                &quot;{career.fitReason}&quot;
                                            </p>
                                        )}
                                    </div>
                                ))
                            ) : (
                                // Fallback Static Data (Strings)
                                recommendations.careers.map((career, idx) => (
                                    <div key={career} className="flex items-center gap-3 p-4 bg-gradient-to-r from-violet-50 to-purple-50 rounded-xl border border-violet-100">
                                        <div className="w-8 h-8 rounded-full bg-violet-600 text-white flex items-center justify-center text-sm font-bold">
                                            {idx + 1}
                                        </div>
                                        <span className="font-medium text-gray-800">{career}</span>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Skills to Develop */}
                    <div className="bg-gradient-to-r from-indigo-600 to-violet-600 rounded-3xl shadow-xl p-6 md:p-8 mb-8 text-white">
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <span className="text-2xl">🎯</span>
                            Skills to Develop
                        </h2>
                        <p className="text-indigo-100 mb-6">
                            Focus on building these skills to excel in your chosen career path:
                        </p>
                        <div className="flex flex-wrap gap-3">
                            {result.aiInsights?.careerGuidance?.skillsToDevelop ? (
                                (result.aiInsights.careerGuidance.skillsToDevelop as string[]).map((skill: string) => (
                                    <span key={skill} className="px-4 py-2 bg-white/20 rounded-full font-medium">
                                        {skill}
                                    </span>
                                ))
                            ) : (
                                recommendations.skills.map((skill) => (
                                    <span key={skill} className="px-4 py-2 bg-white/20 rounded-full font-medium">
                                        {skill}
                                    </span>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Next Steps */}
                    <div className="bg-white rounded-3xl shadow-xl p-6 md:p-8 mb-8">
                        <h2 className="text-xl font-bold text-gray-900 mb-6">What&apos;s Next?</h2>
                        <div className="grid md:grid-cols-3 gap-4">
                            <div className="p-5 bg-violet-50 rounded-xl text-center">
                                <div className="w-12 h-12 bg-violet-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                                    <span className="text-2xl">📚</span>
                                </div>
                                <h3 className="font-bold text-gray-900 mb-2">Explore Courses</h3>
                                <p className="text-sm text-gray-600">Find courses aligned with your aptitudes</p>
                            </div>
                            <div className="p-5 bg-purple-50 rounded-xl text-center">
                                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                                    <span className="text-2xl">💼</span>
                                </div>
                                <h3 className="font-bold text-gray-900 mb-2">Career Counseling</h3>
                                <p className="text-sm text-gray-600">Get personalized guidance from experts</p>
                            </div>
                            <div className="p-5 bg-indigo-50 rounded-xl text-center">
                                <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                                    <span className="text-2xl">🎓</span>
                                </div>
                                <h3 className="font-bold text-gray-900 mb-2">Skill Building</h3>
                                <p className="text-sm text-gray-600">Develop skills for your dream career</p>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                            onClick={() => router.push('/dashboard')}
                            className="px-8 py-4 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-xl font-semibold hover:from-violet-700 hover:to-purple-700 transition-all shadow-lg"
                        >
                            Go to Dashboard
                        </button>
                        <button
                            onClick={() => router.push('/career')}
                            className="px-8 py-4 border-2 border-violet-600 text-violet-600 rounded-xl font-semibold hover:bg-violet-50 transition-colors"
                        >
                            Explore All Careers
                        </button>
                        <button
                            onClick={() => window.print()}
                            className="px-8 py-4 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                        >
                            Download Report
                        </button>
                    </div>
                </div>
            </div>
        );
    }

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
