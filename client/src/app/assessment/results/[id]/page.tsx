'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';

import {
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    Radar,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
} from 'recharts';
import {
    Download,
    Brain,
    Target,
    Loader2,
    AlertCircle,
    Compass,
    TrendingUp,
    Users,
    Briefcase,
    Award,
    ArrowLeft,
    Sparkles,
} from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

// Color palette
const COLORS = {
    primary: '#0e6957',
    secondary: '#10b981',
    accent: '#6366f1',
    warning: '#f59e0b',
    riasec: {
        R: '#ef4444',
        I: '#3b82f6',
        A: '#8b5cf6',
        S: '#10b981',
        E: '#f59e0b',
        C: '#06b6d4',
    },
};

// RIASEC type names
const RIASEC_NAMES: Record<string, string> = {
    R: 'Realistic',
    I: 'Investigative',
    A: 'Artistic',
    S: 'Social',
    E: 'Enterprising',
    C: 'Conventional',
};

interface PerformanceDimension {
    score: number;
    description: string;
}

interface AssessmentResult {
    id: string;
    assessmentId: string;
    assessmentType?: string;
    status: string;
    startedAt?: string;
    completedAt?: string;
    totalScore?: number;
    aptitudeScores?: Record<string, { percentage: number; correct: number; total: number }>;
    riasecScores?: { R: number; I: number; A: number; S: number; E: number; C: number };
    riasecCode?: string;
    employabilityScores?: Record<string, { percentage: number; score?: number; maxScore?: number }>;
    personalityScores?: Record<string, { average?: number; score?: number; maxScore?: number; level?: string }>;
    clarityIndex?: number;
    careerMatches?: Array<{
        id: string;
        title: string;
        matchScore: number;
        matchReasons: string[];
        industry: string;
    }>;
    sectorMatches?: Array<{
        id: string;
        name: string;
        nameMl: string;
        icon: string;
        description: string;
        matchScore: number;
        riasecFit: number;
        aptitudeFit: number;
        personalityFit: number;
        employabilityFit: number;
        matchReasons: string[];
        readinessLevel: 'Ready' | 'Developing' | 'Needs Preparation';
        exampleRoles: string[];
        growthOutlook: string;
        avgSalaryRange: string;
    }>;
    aiSummary?: string;
    aiInsights?: {
        // Job Seeker persona & dimensions
        professionalPersona?: {
            title: string;
            description: string;
            superpower: string;
        };
        performanceDimensions?: {
            cognitiveAgility: PerformanceDimension;
            professionalReadiness: PerformanceDimension;
            careerAlignment: PerformanceDimension;
            interpersonalImpact: PerformanceDimension;
            growthTrajectory: PerformanceDimension;
        };
        // Job Seeker fields
        employabilitySummary?: string;
        aptitudeAnalysis?: string;
        careerInterestAlignment?: string;
        personalitySnapshot?: string;
        skillReadiness?: string;
        careerRecommendations?: {
            primaryRoles: string[];
            growthRoles: string[];
            rolesToAvoid: string;
        };
        sectorRecommendations?: {
            primarySectors?: { name: string; explanation: string }[];
            growthSectors?: { name: string; explanation: string }[];
            sectorsToAvoid?: string;
            topSectors?: string[];
            reasoning?: string;
        };
        developmentGuidance?: string;
        developmentRoadmap?: string;
        clarityIndex?: { level: string; justification: string };
        detailedTraitInterpretation?: Record<string, string>;
        // Student-specific fields
        studentPersona?: {
            title: string;
            description: string;
            superpower: string;
        };
        strengthsAnalysis?: string;
        areasForGrowth?: string;
        riasecAnalysis?: string;
        personalityAnalysis?: string;
        readinessAnalysis?: string;
        academicStreams?: {
            recommended: string[];
            reasoning: string;
        };
        careerGuidance?: {
            suggestedCareers: (string | { role: string; fitReason: string })[];
            skillsToDevelop: string[];
        };
        studyTips?: string;
        nextSteps?: string;
    };
    academicReadinessIndex?: number;
    performanceLevel?: 'EXCELLENT' | 'GOOD' | 'AVERAGE' | 'NEEDS_IMPROVEMENT';
    topStrengths?: string[];
    areasForImprovement?: string[];
}

export default function ResultsPage() {
    const router = useRouter();
    const params = useParams();
    const { isAuthenticated, isLoading: authLoading } = useAuth();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [result, setResult] = useState<AssessmentResult | null>(null);
    const [downloading, setDownloading] = useState(false);

    // Get auth token
    const getAuthHeaders = useCallback(() => {
        const token = localStorage.getItem('accessToken');
        return {
            headers: { Authorization: `Bearer ${token}` },
        };
    }, []);

    // Fetch result
    useEffect(() => {
        const fetchResult = async () => {
            if (!params?.id) return;

            try {
                setLoading(true);
                const res = await axios.get(
                    `${API_URL}/assessments/results/${params.id}`,
                    getAuthHeaders()
                );
                setResult(res.data);
            } catch (err: unknown) {
                console.error('Error fetching result:', err);
                const errorData = err as { response?: { data?: { message?: string } } };
                setError(errorData.response?.data?.message || 'Failed to load results');
            } finally {
                setLoading(false);
            }
        };

        if (!authLoading && isAuthenticated) {
            fetchResult();
        } else if (!authLoading && !isAuthenticated) {
            router.push('/login');
        }
    }, [params?.id, authLoading, isAuthenticated, getAuthHeaders, router]);

    // Download PDF report
    const handleDownload = () => {
        if (!result?.id) return;

        setDownloading(true);
        const token = localStorage.getItem('accessToken');
        const downloadUrl = `/api/download-report/${result.id}?token=${token}`;

        // Use a hidden iframe to trigger a native browser download.
        // This is the most reliable method — the browser processes
        // Content-Disposition: attachment natively without any JS blob involvement.
        let iframe = document.getElementById('pdf-download-frame') as HTMLIFrameElement | null;
        if (!iframe) {
            iframe = document.createElement('iframe');
            iframe.id = 'pdf-download-frame';
            iframe.style.display = 'none';
            document.body.appendChild(iframe);
        }
        iframe.src = downloadUrl;

        // Reset downloading state after a delay
        setTimeout(() => setDownloading(false), 4000);
    };

    // Loading state
    if (authLoading || loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 animate-spin text-[#0e6957] mx-auto mb-4" />
                    <p className="text-gray-600">Loading your results...</p>
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

    if (!result) return null;

    // Detect assessment type: students have studentPersona in AI insights; job seekers have professionalPersona
    const isStudentAssessment = !!result.aiInsights?.studentPersona || result.assessmentType === 'STUDENT';

    // Prepare chart data
    const riasecMaxScore = isStudentAssessment ? 8 : 32;
    const riasecChartData = result?.riasecScores
        ? Object.entries(result.riasecScores).map(([code, score]) => ({
            type: RIASEC_NAMES[code],
            score: score,
            fullMark: riasecMaxScore,
        }))
        : [];

    const aptitudeChartData = result?.aptitudeScores
        ? Object.entries(result.aptitudeScores)
            .filter(([key]) => key !== 'overall')
            .map(([section, data]) => ({
                section: section.split(' ')[0],
                percentage: data.percentage,
                fullSection: section,
            }))
        : [];

    // Job seeker personality: average (1-5 scale)
    // Student personality: score/maxScore with level (Emerging/Moderate/Strong)
    const personalityChartData = result?.personalityScores
        ? Object.entries(result.personalityScores).map(([trait, data]) => ({
            trait: trait.split(' ')[0],
            average: data.average ?? (data.score && data.maxScore ? (data.score / data.maxScore) * 5 : 0),
            score: data.score,
            maxScore: data.maxScore,
            level: data.level,
            fullTrait: trait,
        }))
        : [];

    // Student readiness data (from employabilityScores field reused for students)
    const readinessChartData = isStudentAssessment && result?.employabilityScores
        ? Object.entries(result.employabilityScores)
            .filter(([key]) => key !== 'overall')
            .map(([section, data]) => ({
                section: section.split(' ')[0],
                percentage: data.percentage,
                fullSection: section,
            }))
        : [];
    const overallReadiness = isStudentAssessment
        ? result?.employabilityScores?.['overall']?.percentage || 0
        : 0;

    // Performance level display helper
    const getPerformanceLevelInfo = (level?: string) => {
        switch (level) {
            case 'EXCELLENT': return { label: 'Excellent', color: 'text-emerald-600', bg: 'bg-emerald-100' };
            case 'GOOD': return { label: 'Good', color: 'text-green-600', bg: 'bg-green-100' };
            case 'AVERAGE': return { label: 'Average', color: 'text-amber-600', bg: 'bg-amber-100' };
            case 'NEEDS_IMPROVEMENT': return { label: 'Needs Improvement', color: 'text-red-600', bg: 'bg-red-100' };
            default: return { label: level || 'N/A', color: 'text-gray-600', bg: 'bg-gray-100' };
        }
    };

    // Client-side fallback: derive performance level from existing data if not stored
    const derivedPerformanceLevel = (() => {
        if (result.performanceLevel) return result.performanceLevel;
        if (!isStudentAssessment) {
            const apt = result.totalScore || 0;
            const emp = result.employabilityScores?.['overall']?.percentage || 0;
            const persVals = result.personalityScores
                ? Object.values(result.personalityScores).map(p => p.average || 0)
                : [];
            const avgPers = persVals.length > 0
                ? persVals.reduce((a, b) => a + b, 0) / persVals.length
                : 0;
            const composite = Math.round(apt * 0.35 + emp * 0.35 + (avgPers / 5) * 100 * 0.30);
            if (composite >= 80) return 'EXCELLENT' as const;
            if (composite >= 60) return 'GOOD' as const;
            if (composite >= 40) return 'AVERAGE' as const;
            return 'NEEDS_IMPROVEMENT' as const;
        }
        return undefined;
    })();

    // Client-side fallback: derive top strengths from aptitude sections
    const derivedTopStrengths = (() => {
        if (result.topStrengths && result.topStrengths.length > 0) return result.topStrengths;
        if (result.aptitudeScores) {
            return Object.entries(result.aptitudeScores)
                .filter(([key]) => key !== 'overall')
                .sort((a, b) => b[1].percentage - a[1].percentage)
                .slice(0, 3)
                .map(([name]) => name);
        }
        return [];
    })();

    // Client-side fallback: derive areas for improvement
    const derivedAreasForImprovement = (() => {
        if (result.areasForImprovement && result.areasForImprovement.length > 0) return result.areasForImprovement;
        if (result.aptitudeScores) {
            return Object.entries(result.aptitudeScores)
                .filter(([key]) => key !== 'overall')
                .sort((a, b) => a[1].percentage - b[1].percentage)
                .slice(0, 2)
                .map(([name]) => name);
        }
        return [];
    })();

    // Persona from AI or fallback
    const persona = isStudentAssessment
        ? result.aiInsights?.studentPersona
        : result.aiInsights?.professionalPersona;

    const fallbackPersonaTitle = (() => {
        if (persona?.title) return persona.title;
        const score = result.totalScore || 0;
        if (isStudentAssessment) {
            if (score >= 70) return 'The Analytical Achiever';
            if (score >= 40) return 'The Emerging Explorer';
            return 'The Curious Explorer';
        }
        const emp = result.employabilityScores?.['overall']?.percentage || 0;
        if (score >= 70 && emp >= 70) return 'The Strategic Achiever';
        if (score >= 50) return 'The Emerging Professional';
        return 'The Curious Explorer';
    })();

    const personaTitle = persona?.title || fallbackPersonaTitle;
    const personaDescription = persona?.description ||
        (isStudentAssessment
            ? 'Your journey has just begun. Embrace learning opportunities to discover and sharpen your true potential.'
            : 'Your professional journey is taking shape. Leverage your strengths and invest in growth areas to unlock your full potential.');

    const performanceInfo = getPerformanceLevelInfo(derivedPerformanceLevel);

    const clarityLevel = result.aiInsights?.clarityIndex?.level ||
        (result.clarityIndex && result.clarityIndex >= 70 ? 'HIGH' : result.clarityIndex && result.clarityIndex >= 40 ? 'MEDIUM' : 'LOW');

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-emerald-50">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
                    <button
                        onClick={() => router.push('/dashboard')}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span className="font-medium">Back to Dashboard</span>
                    </button>

                    <button
                        onClick={handleDownload}
                        disabled={downloading}
                        className="flex items-center gap-2 px-4 py-2 bg-[#0e6957] text-white rounded-xl font-semibold hover:bg-[#0a4f41] disabled:opacity-50 transition-colors"
                    >
                        {downloading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Generating...
                            </>
                        ) : (
                            <>
                                <Download className="w-5 h-5" />
                                Download PDF
                            </>
                        )}
                    </button>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 py-8">
                {/* Title Section */}
                <div className="text-center mb-10">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                        {isStudentAssessment
                            ? "PRAGYA Student Career Assessment Results"
                            : "PRAGYA Assessment Results"
                        }
                    </h1>
                    <p className="text-gray-600">
                        Completed on {result.completedAt && new Date(result.completedAt).toLocaleDateString('en-IN', {
                            day: 'numeric', month: 'long', year: 'numeric'
                        })}
                    </p>
                </div>

                {/* Persona Banner - Unified for both types */}
                <div className="bg-gradient-to-r from-[#0e6957] to-emerald-600 rounded-3xl p-6 md:p-8 text-white mb-8">
                    <div className="flex flex-col md:flex-row items-center gap-6">
                        <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center flex-shrink-0">
                            <Sparkles className="w-8 h-8 text-yellow-300" />
                        </div>
                        <div className="flex-1 text-center md:text-left">
                            <h2 className="text-2xl md:text-3xl font-bold mb-1">{personaTitle}</h2>
                            <p className="text-emerald-100 text-sm max-w-2xl">{personaDescription}</p>
                            {persona?.superpower && (
                                <p className="text-emerald-200 text-xs mt-2 flex items-center justify-center md:justify-start gap-1">
                                    <Award className="w-3 h-3" />
                                    Superpower: {persona.superpower}
                                </p>
                            )}
                        </div>
                        <div className="flex-shrink-0">
                            <div className="w-24 h-24 rounded-full bg-white/20 flex flex-col items-center justify-center border-4 border-white/30">
                                <span className="text-3xl font-bold">{result.totalScore?.toFixed(0) || 0}</span>
                                <span className="text-[10px] text-emerald-200 uppercase tracking-wider">Overall %</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Holland Code - Both types (students now have RIASEC too) */}
                {result.riasecCode && (
                    <div className="bg-gradient-to-r from-[#0e6957] to-emerald-600 rounded-3xl p-6 md:p-8 text-white text-center mb-8">
                        <Compass className="w-12 h-12 mx-auto mb-4 opacity-80" />
                        <p className="text-emerald-100 text-sm uppercase tracking-wider mb-2">Your Holland Code</p>
                        <div className="flex justify-center gap-4 mb-4">
                            {result.riasecCode.split('').map((code) => (
                                <div key={code} className="text-center">
                                    <div className="text-5xl md:text-6xl font-bold">{code}</div>
                                    <div className="text-xs text-emerald-200 mt-1">{RIASEC_NAMES[code]}</div>
                                </div>
                            ))}
                        </div>
                        {/* Job seeker: show careerInterestAlignment; Student: show riasecAnalysis */}
                        {(result.aiInsights?.careerInterestAlignment || result.aiInsights?.riasecAnalysis) && (
                            <p className="text-emerald-100 text-sm max-w-2xl mx-auto">
                                {isStudentAssessment
                                    ? result.aiInsights?.riasecAnalysis
                                    : result.aiInsights?.careerInterestAlignment}
                            </p>
                        )}
                    </div>
                )}

                {/* Stats Grid - Shows all relevant metrics */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                    {/* Aptitude */}
                    <div className="bg-white rounded-2xl p-5 shadow-sm">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                                <Brain className="w-5 h-5 text-blue-600" />
                            </div>
                            <span className="text-sm text-gray-500">Aptitude</span>
                        </div>
                        <p className="text-2xl font-bold text-gray-900">
                            {result.totalScore?.toFixed(0) || 0}%
                        </p>
                    </div>

                    {/* Career Clarity */}
                    <div className="bg-white rounded-2xl p-5 shadow-sm">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center">
                                <Target className="w-5 h-5 text-orange-600" />
                            </div>
                            <span className="text-sm text-gray-500">Career Clarity</span>
                        </div>
                        <p className="text-2xl font-bold text-gray-900">
                            {result.clarityIndex || 0}/100
                        </p>
                    </div>

                    {/* Readiness (Student) / Employability (Job Seeker) */}
                    <div className="bg-white rounded-2xl p-5 shadow-sm">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                                <Briefcase className="w-5 h-5 text-emerald-600" />
                            </div>
                            <span className="text-sm text-gray-500">
                                {isStudentAssessment ? 'Career Readiness' : 'Employability'}
                            </span>
                        </div>
                        <p className="text-2xl font-bold text-gray-900">
                            {isStudentAssessment
                                ? `${overallReadiness.toFixed(0)}%`
                                : `${result.employabilityScores?.['overall']?.percentage?.toFixed(0) || 0}%`
                            }
                        </p>
                    </div>

                    {/* Performance Level - Both */}
                    <div className="bg-white rounded-2xl p-5 shadow-sm">
                        <div className="flex items-center gap-3 mb-2">
                            <div className={`w-10 h-10 rounded-xl ${performanceInfo.bg} flex items-center justify-center`}>
                                <Award className={`w-5 h-5 ${performanceInfo.color}`} />
                            </div>
                            <span className="text-sm text-gray-500">Performance</span>
                        </div>
                        <p className={`text-2xl font-bold ${performanceInfo.color}`}>
                            {performanceInfo.label}
                        </p>
                    </div>

                    {/* Top Strength - Both */}
                    <div className="bg-white rounded-2xl p-5 shadow-sm">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                                <TrendingUp className="w-5 h-5 text-purple-600" />
                            </div>
                            <span className="text-sm text-gray-500">Top Strength</span>
                        </div>
                        <p className="text-lg font-bold text-gray-900 truncate">
                            {derivedTopStrengths[0] || 'N/A'}
                        </p>
                    </div>

                    {/* Holland Code badge */}
                    {result.riasecCode && (
                        <div className="bg-white rounded-2xl p-5 shadow-sm">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center">
                                    <Compass className="w-5 h-5 text-indigo-600" />
                                </div>
                                <span className="text-sm text-gray-500">Holland Code</span>
                            </div>
                            <div className="flex gap-1">
                                {result.riasecCode.split('').map((code) => (
                                    <span key={code} className="text-2xl font-bold" style={{ color: COLORS.riasec[code as keyof typeof COLORS.riasec] || COLORS.primary }}>
                                        {code}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Charts Row */}
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                    {/* RIASEC Radar Chart - Both types */}
                    {riasecChartData.length > 0 && (
                        <div className="bg-white rounded-2xl p-6 shadow-sm">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <Compass className="w-5 h-5 text-[#0e6957]" />
                                Career Interests (RIASEC)
                            </h3>
                            <ResponsiveContainer width="100%" height={300}>
                                <RadarChart data={riasecChartData}>
                                    <PolarGrid />
                                    <PolarAngleAxis dataKey="type" tick={{ fontSize: 12 }} />
                                    <PolarRadiusAxis angle={30} domain={[0, riasecMaxScore]} tick={{ fontSize: 10 }} />
                                    <Radar
                                        name="Score"
                                        dataKey="score"
                                        stroke={COLORS.primary}
                                        fill={COLORS.primary}
                                        fillOpacity={0.3}
                                        strokeWidth={2}
                                    />
                                    <Tooltip formatter={(value: unknown) => [`${value}/${riasecMaxScore}`, 'Score']} />
                                </RadarChart>
                            </ResponsiveContainer>
                        </div>
                    )}

                    {/* Aptitude Bar Chart */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <Brain className="w-5 h-5 text-[#0e6957]" />
                            {isStudentAssessment ? "Aptitude Scores" : "Cognitive Aptitude"}
                        </h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={aptitudeChartData} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis type="number" domain={[0, 100]} tickFormatter={(v: number) => `${v}%`} />
                                <YAxis type="category" dataKey="section" width={70} tick={{ fontSize: 11 }} />
                                <Tooltip
                                    formatter={(value: unknown) => [`${Number(value).toFixed(1)}%`, 'Score']}
                                    labelFormatter={(label) => aptitudeChartData.find(d => d.section === String(label))?.fullSection || String(label)}
                                />
                                <Bar dataKey="percentage" fill={COLORS.secondary} radius={[0, 4, 4, 0]}>
                                    {aptitudeChartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.percentage >= 60 ? COLORS.secondary : COLORS.warning} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Strengths & Areas for Improvement - Both types */}
                {(derivedTopStrengths.length > 0 || derivedAreasForImprovement.length > 0) && (
                    <div className="bg-white rounded-2xl p-6 shadow-sm mb-8">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-[#0e6957]" />
                            Strengths & Growth Areas
                        </h3>
                        <div className="grid md:grid-cols-2 gap-6">
                            {derivedTopStrengths.length > 0 && (
                                <div>
                                    <h4 className="font-medium text-emerald-700 mb-3 flex items-center gap-2">
                                        <Award className="w-4 h-4" />
                                        Your Top Strengths
                                    </h4>
                                    <ul className="space-y-2">
                                        {derivedTopStrengths.map((strength, i) => (
                                            <li key={i} className="flex items-center gap-2 text-gray-600">
                                                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                                {strength}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                            {derivedAreasForImprovement.length > 0 && (
                                <div>
                                    <h4 className="font-medium text-amber-700 mb-3 flex items-center gap-2">
                                        <Target className="w-4 h-4" />
                                        Areas to Develop
                                    </h4>
                                    <ul className="space-y-2">
                                        {derivedAreasForImprovement.map((area, i) => (
                                            <li key={i} className="flex items-center gap-2 text-gray-600">
                                                <div className="w-2 h-2 rounded-full bg-amber-500" />
                                                {area}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Personality Traits - Both types */}
                {personalityChartData.length > 0 && (
                    <div className="bg-white rounded-2xl p-6 shadow-sm mb-8">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <Users className="w-5 h-5 text-[#0e6957]" />
                            Personality Profile
                        </h3>
                        {result.aiInsights?.personalityAnalysis && (
                            <p className="text-sm text-gray-600 mb-4">{result.aiInsights.personalityAnalysis}</p>
                        )}
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                            {personalityChartData.map((item) => {
                                const pct = isStudentAssessment && item.score && item.maxScore
                                    ? (item.score / item.maxScore)
                                    : (item.average / 5);
                                const displayValue = isStudentAssessment
                                    ? `${item.score}/${item.maxScore}`
                                    : item.average.toFixed(1);
                                const levelColor = item.level === 'Strong' ? 'text-emerald-600'
                                    : item.level === 'Moderate' ? 'text-amber-600'
                                        : item.level === 'Emerging' ? 'text-orange-500'
                                            : '';
                                return (
                                    <div key={item.trait} className="text-center p-4 bg-gray-50 rounded-xl">
                                        <div className="relative w-16 h-16 mx-auto mb-3">
                                            <svg className="w-16 h-16 transform -rotate-90">
                                                <circle
                                                    className="text-gray-200"
                                                    strokeWidth="4"
                                                    stroke="currentColor"
                                                    fill="transparent"
                                                    r="28"
                                                    cx="32"
                                                    cy="32"
                                                />
                                                <circle
                                                    className="text-[#0e6957]"
                                                    strokeWidth="4"
                                                    strokeLinecap="round"
                                                    stroke="currentColor"
                                                    fill="transparent"
                                                    r="28"
                                                    cx="32"
                                                    cy="32"
                                                    strokeDasharray={`${pct * 176} 176`}
                                                />
                                            </svg>
                                            <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-gray-900">
                                                {displayValue}
                                            </span>
                                        </div>
                                        <p className="text-xs text-gray-600 font-medium">{item.fullTrait}</p>
                                        {item.level && (
                                            <span className={`text-[10px] font-semibold ${levelColor}`}>{item.level}</span>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Student: Skill & Career Readiness Bars */}
                {isStudentAssessment && readinessChartData.length > 0 && (
                    <div className="bg-white rounded-2xl p-6 shadow-sm mb-8">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-[#0e6957]" />
                            Skill & Career Readiness
                        </h3>
                        {result.aiInsights?.readinessAnalysis && (
                            <p className="text-sm text-gray-600 mb-4">{result.aiInsights.readinessAnalysis}</p>
                        )}
                        <div className="space-y-4">
                            {readinessChartData.map((item) => (
                                <div key={item.section}>
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-sm font-medium text-gray-700">{item.fullSection}</span>
                                        <span className="text-sm font-semibold text-gray-900">{item.percentage.toFixed(0)}%</span>
                                    </div>
                                    <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full rounded-full transition-all ${item.percentage >= 70 ? 'bg-emerald-500' : item.percentage >= 50 ? 'bg-amber-500' : 'bg-orange-400'
                                                }`}
                                            style={{ width: `${item.percentage}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                            <div className="mt-4 pt-4 border-t border-gray-100">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-semibold text-gray-900">Overall Readiness</span>
                                    <span className={`text-lg font-bold ${overallReadiness >= 70 ? 'text-emerald-600' : overallReadiness >= 50 ? 'text-amber-600' : 'text-orange-500'}`}>
                                        {overallReadiness.toFixed(0)}%
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Sector Matches - Both types when available */}
                {result.sectorMatches && result.sectorMatches.length > 0 && (
                    <div className="bg-white rounded-2xl p-6 shadow-sm mb-8">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
                            <Briefcase className="w-5 h-5 text-[#0e6957]" />
                            Top Sector Matches
                        </h3>
                        <p className="text-sm text-gray-500 mb-6">Industries that best align with your interests, aptitude, personality, and readiness.</p>
                        <div className="space-y-4">
                            {result.sectorMatches.slice(0, 6).map((sector, index) => (
                                <div key={sector.id} className={`p-5 rounded-xl border-2 transition-all ${index === 0 ? 'border-[#0e6957] bg-emerald-50/50' :
                                    index < 3 ? 'border-emerald-200 bg-gray-50' : 'border-gray-100 bg-gray-50'
                                    }`}>
                                    <div className="flex items-start gap-4">
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 ${index === 0 ? 'bg-[#0e6957] text-white' :
                                            index < 3 ? 'bg-emerald-100' : 'bg-gray-200'
                                            }`}>
                                            {index === 0 ? '🏆' : sector.icon}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between mb-1">
                                                <h4 className="font-semibold text-gray-900">{sector.name}</h4>
                                                <span className={`text-lg font-bold ${sector.matchScore >= 70 ? 'text-emerald-600' :
                                                    sector.matchScore >= 50 ? 'text-amber-600' : 'text-gray-500'
                                                    }`}>{sector.matchScore}%</span>
                                            </div>
                                            <p className="text-sm text-gray-600 mb-3">{sector.description}</p>

                                            {/* Score Breakdown */}
                                            <div className="grid grid-cols-4 gap-2 mb-3">
                                                {[
                                                    { label: 'Interest', value: sector.riasecFit, color: 'bg-blue-500' },
                                                    { label: 'Aptitude', value: sector.aptitudeFit, color: 'bg-purple-500' },
                                                    { label: 'Personality', value: sector.personalityFit, color: 'bg-amber-500' },
                                                    { label: 'Readiness', value: sector.employabilityFit, color: 'bg-emerald-500' },
                                                ].map(metric => (
                                                    <div key={metric.label} className="text-center">
                                                        <div className="h-1.5 bg-gray-200 rounded-full mb-1">
                                                            <div className={`h-full ${metric.color} rounded-full transition-all`} style={{ width: `${metric.value}%` }} />
                                                        </div>
                                                        <span className="text-[10px] text-gray-500">{metric.label} {metric.value}%</span>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Example Roles + Readiness Badge */}
                                            <div className="flex items-center justify-between">
                                                <div className="flex flex-wrap gap-1">
                                                    {sector.exampleRoles.slice(0, 4).map(role => (
                                                        <span key={role} className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">{role}</span>
                                                    ))}
                                                </div>
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${sector.readinessLevel === 'Ready' ? 'bg-emerald-100 text-emerald-700' :
                                                    sector.readinessLevel === 'Developing' ? 'bg-amber-100 text-amber-700' :
                                                        'bg-red-100 text-red-700'
                                                    }`}>{sector.readinessLevel}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Career Matches (shown below sectors if available) */}
                {!result.sectorMatches?.length && result.careerMatches && result.careerMatches.length > 0 && (
                    <div className="bg-white rounded-2xl p-6 shadow-sm mb-8">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <Briefcase className="w-5 h-5 text-[#0e6957]" />
                            Top Career Matches
                        </h3>
                        <div className="grid md:grid-cols-2 gap-4">
                            {result.careerMatches.slice(0, 6).map((career, index) => (
                                <div key={career.id} className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold ${index < 3 ? 'bg-[#0e6957]' : 'bg-gray-400'
                                        }`}>
                                        {index + 1}
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-semibold text-gray-900">{career.title}</h4>
                                        <p className="text-sm text-gray-500 mb-2">{career.industry}</p>
                                        <div className="flex items-center gap-2">
                                            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-[#0e6957] rounded-full transition-all"
                                                    style={{ width: `${career.matchScore}%` }}
                                                />
                                            </div>
                                            <span className="text-sm font-medium text-gray-700">{career.matchScore}%</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Performance Dimensions - Job Seekers */}
                {!isStudentAssessment && result.aiInsights?.performanceDimensions && (
                    <div className="bg-white rounded-2xl p-6 shadow-sm mb-8">
                        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-[#0e6957]" />
                            Performance Dimensions
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                            {[
                                { key: 'cognitiveAgility', label: 'Cognitive Agility', icon: Brain, color: 'blue' },
                                { key: 'professionalReadiness', label: 'Professional Readiness', icon: Briefcase, color: 'emerald' },
                                { key: 'careerAlignment', label: 'Career Alignment', icon: Compass, color: 'purple' },
                                { key: 'interpersonalImpact', label: 'Interpersonal Impact', icon: Users, color: 'amber' },
                                { key: 'growthTrajectory', label: 'Growth Trajectory', icon: TrendingUp, color: 'rose' },
                            ].map(({ key, label, icon: Icon, color }) => {
                                const dim = result.aiInsights?.performanceDimensions?.[key as keyof typeof result.aiInsights.performanceDimensions];
                                if (!dim) return null;
                                const pct = (dim.score / 10) * 100;
                                return (
                                    <div key={key} className="text-center p-4 bg-gray-50 rounded-xl">
                                        <div className="relative w-16 h-16 mx-auto mb-3">
                                            <svg className="w-16 h-16 transform -rotate-90">
                                                <circle className="text-gray-200" strokeWidth="4" stroke="currentColor" fill="transparent" r="28" cx="32" cy="32" />
                                                <circle className={`text-${color}-500`} strokeWidth="4" strokeLinecap="round" stroke="currentColor" fill="transparent" r="28" cx="32" cy="32"
                                                    strokeDasharray={`${(pct / 100) * 176} 176`}
                                                    style={{ color: color === 'blue' ? '#3b82f6' : color === 'emerald' ? '#10b981' : color === 'purple' ? '#8b5cf6' : color === 'amber' ? '#f59e0b' : '#f43f5e' }}
                                                />
                                            </svg>
                                            <span className="absolute inset-0 flex items-center justify-center text-lg font-bold text-gray-900">
                                                {dim.score}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-center gap-1 mb-1">
                                            <Icon className="w-3 h-3 text-gray-500" />
                                            <p className="text-xs font-semibold text-gray-700">{label}</p>
                                        </div>
                                        <p className="text-[10px] text-gray-500 leading-tight">{dim.description}</p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* AI Insights Section */}
                {(result.aiSummary || result.aiInsights) && (
                    <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl p-6 md:p-8 mb-8">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                                <Sparkles className="w-6 h-6 text-purple-600" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">AI-Powered Insights</h3>
                                <p className="text-sm text-gray-500">Personalized analysis of your assessment</p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            {result.aiSummary && (
                                <div className="bg-white/60 rounded-xl p-5">
                                    <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                                        <Award className="w-4 h-4 text-purple-600" />
                                        {isStudentAssessment ? "Performance Summary" : "Employability Summary"}
                                    </h4>
                                    <p className="text-gray-600">{result.aiSummary}</p>
                                </div>
                            )}

                            {/* Job Seeker: Aptitude + Personality + Skills Analysis */}
                            {!isStudentAssessment && (result.aiInsights?.aptitudeAnalysis || result.aiInsights?.personalitySnapshot || result.aiInsights?.skillReadiness) && (
                                <div className="grid md:grid-cols-3 gap-4">
                                    {result.aiInsights?.aptitudeAnalysis && (
                                        <div className="bg-white/60 rounded-xl p-4">
                                            <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2 text-sm">
                                                <Brain className="w-4 h-4 text-blue-600" />
                                                Cognitive Analysis
                                            </h4>
                                            <p className="text-gray-600 text-sm">{result.aiInsights.aptitudeAnalysis}</p>
                                        </div>
                                    )}
                                    {result.aiInsights?.personalitySnapshot && (
                                        <div className="bg-white/60 rounded-xl p-4">
                                            <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2 text-sm">
                                                <Users className="w-4 h-4 text-amber-600" />
                                                Personality Snapshot
                                            </h4>
                                            <p className="text-gray-600 text-sm">{result.aiInsights.personalitySnapshot}</p>
                                        </div>
                                    )}
                                    {result.aiInsights?.skillReadiness && (
                                        <div className="bg-white/60 rounded-xl p-4">
                                            <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2 text-sm">
                                                <TrendingUp className="w-4 h-4 text-emerald-600" />
                                                Skill Readiness
                                            </h4>
                                            <p className="text-gray-600 text-sm">{result.aiInsights.skillReadiness}</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {result.aiInsights?.developmentGuidance && (
                                <div className="bg-white/60 rounded-xl p-5">
                                    <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                                        <Compass className="w-4 h-4 text-indigo-600" />
                                        Development Guidance
                                    </h4>
                                    <p className="text-gray-600">{result.aiInsights.developmentGuidance}</p>
                                </div>
                            )}

                            {result.aiInsights?.developmentRoadmap && (
                                <div className="bg-white/60 rounded-xl p-5">
                                    <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                                        <TrendingUp className="w-4 h-4 text-emerald-600" />
                                        Development Roadmap
                                    </h4>
                                    <p className="text-gray-600">{result.aiInsights.developmentRoadmap}</p>
                                </div>
                            )}

                            {result.aiInsights?.careerRecommendations && (
                                <div>
                                    <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                                        <Briefcase className="w-4 h-4 text-emerald-600" />
                                        Career Guidance
                                    </h4>

                                    {/* Sector Recommendations from AI */}
                                    {result.aiInsights?.sectorRecommendations && (
                                        <div className="mb-4">
                                            <p className="text-sm font-medium text-emerald-700 mb-2">Recommended Sectors</p>
                                            <div className="space-y-2 mb-3">
                                                {result.aiInsights.sectorRecommendations.primarySectors?.map((sector, i) => (
                                                    <div key={i} className="bg-white/60 rounded-lg p-3">
                                                        <span className="text-sm font-semibold text-gray-800">{sector.name}</span>
                                                        <p className="text-xs text-gray-500 mt-1">{sector.explanation}</p>
                                                    </div>
                                                ))}
                                            </div>
                                            {result.aiInsights.sectorRecommendations.sectorsToAvoid && (
                                                <p className="text-xs text-gray-400 italic">
                                                    ⚠️ {result.aiInsights.sectorRecommendations.sectorsToAvoid}
                                                </p>
                                            )}
                                        </div>
                                    )}

                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="bg-white/60 rounded-xl p-4">
                                            <p className="text-sm font-medium text-emerald-700 mb-2">Primary Fit Roles</p>
                                            <ul className="space-y-1">
                                                {result.aiInsights.careerRecommendations.primaryRoles.map((role, i) => (
                                                    <li key={i} className="text-sm text-gray-600 flex items-center gap-2">
                                                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                                                        {role}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                        <div className="bg-white/60 rounded-xl p-4">
                                            <p className="text-sm font-medium text-blue-700 mb-2">Growth Roles (with upskilling)</p>
                                            <ul className="space-y-1">
                                                {result.aiInsights.careerRecommendations.growthRoles.map((role, i) => (
                                                    <li key={i} className="text-sm text-gray-600 flex items-center gap-2">
                                                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                                                        {role}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Student-Specific AI Insights */}
                            {isStudentAssessment && (result.aiInsights?.strengthsAnalysis || result.aiInsights?.areasForGrowth) && (
                                <div className="grid md:grid-cols-2 gap-4">
                                    {result.aiInsights?.strengthsAnalysis && (
                                        <div className="bg-white/60 rounded-xl p-5">
                                            <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                                                <Award className="w-4 h-4 text-emerald-600" />
                                                Your Strengths
                                            </h4>
                                            <p className="text-gray-600 text-sm">{result.aiInsights.strengthsAnalysis}</p>
                                        </div>
                                    )}
                                    {result.aiInsights?.areasForGrowth && (
                                        <div className="bg-white/60 rounded-xl p-5">
                                            <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                                                <Target className="w-4 h-4 text-amber-600" />
                                                Areas for Growth
                                            </h4>
                                            <p className="text-gray-600 text-sm">{result.aiInsights.areasForGrowth}</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {result.aiInsights?.academicStreams && (
                                <div className="bg-white/60 rounded-xl p-5">
                                    <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                                        <Brain className="w-4 h-4 text-blue-600" />
                                        Recommended Academic Streams
                                    </h4>
                                    <div className="flex flex-wrap gap-2 mb-2">
                                        {result.aiInsights.academicStreams.recommended.map((stream, i) => (
                                            <span key={i} className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium">
                                                {stream}
                                            </span>
                                        ))}
                                    </div>
                                    <p className="text-sm text-gray-500">{result.aiInsights.academicStreams.reasoning}</p>
                                </div>
                            )}

                            {result.aiInsights?.careerGuidance && (
                                <div>
                                    <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                                        <Briefcase className="w-4 h-4 text-emerald-600" />
                                        Career Guidance
                                    </h4>

                                    {/* Student sector recommendations from AI */}
                                    {isStudentAssessment && result.aiInsights?.sectorRecommendations?.topSectors && (
                                        <div className="mb-4 bg-white/60 rounded-xl p-4">
                                            <p className="text-sm font-medium text-indigo-700 mb-2">Recommended Sectors</p>
                                            <div className="flex flex-wrap gap-2 mb-2">
                                                {result.aiInsights.sectorRecommendations.topSectors.map((sector, i) => (
                                                    <span key={i} className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium">
                                                        {sector}
                                                    </span>
                                                ))}
                                            </div>
                                            <p className="text-xs text-gray-500">{result.aiInsights.sectorRecommendations.reasoning}</p>
                                        </div>
                                    )}

                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="bg-white/60 rounded-xl p-4">
                                            <p className="text-sm font-medium text-purple-700 mb-2">Suggested Careers</p>
                                            <ul className="space-y-2">
                                                {(result.aiInsights.careerGuidance.suggestedCareers as (string | { role: string; fitReason?: string })[]).map((career, i) => {
                                                    const roleName = typeof career === 'string' ? career : career.role;
                                                    const fitReason = typeof career === 'object' && career.fitReason ? career.fitReason : null;
                                                    return (
                                                        <li key={i} className="text-sm text-gray-600">
                                                            <div className="flex items-center gap-2">
                                                                <span className="w-1.5 h-1.5 bg-purple-500 rounded-full flex-shrink-0"></span>
                                                                <span className="font-medium text-gray-800">{roleName}</span>
                                                            </div>
                                                            {fitReason && (
                                                                <p className="text-xs text-gray-400 ml-4 mt-0.5">{fitReason}</p>
                                                            )}
                                                        </li>
                                                    );
                                                })}
                                            </ul>
                                        </div>
                                        <div className="bg-white/60 rounded-xl p-4">
                                            <p className="text-sm font-medium text-amber-700 mb-2">Skills to Develop</p>
                                            <ul className="space-y-1">
                                                {result.aiInsights.careerGuidance.skillsToDevelop.map((skill, i) => (
                                                    <li key={i} className="text-sm text-gray-600 flex items-center gap-2">
                                                        <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
                                                        {skill}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {result.aiInsights?.studyTips && (
                                <div className="bg-white/60 rounded-xl p-5">
                                    <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                                        <Brain className="w-4 h-4 text-blue-600" />
                                        Study Tips
                                    </h4>
                                    <p className="text-gray-600">{result.aiInsights.studyTips}</p>
                                </div>
                            )}

                            {result.aiInsights?.nextSteps && (
                                <div className="bg-white/60 rounded-xl p-5">
                                    <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                                        <Compass className="w-4 h-4 text-indigo-600" />
                                        Next Steps
                                    </h4>
                                    <p className="text-gray-600">{result.aiInsights.nextSteps}</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
                {/* Clarity Index */}
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-[#0e6957]" />
                        Career Direction Clarity
                    </h3>
                    <div className="flex items-center gap-6">
                        <div className={`px-6 py-3 rounded-xl text-xl font-bold ${clarityLevel === 'HIGH' ? 'bg-emerald-100 text-emerald-700' :
                            clarityLevel === 'MEDIUM' ? 'bg-amber-100 text-amber-700' :
                                'bg-red-100 text-red-700'
                            }`}>
                            {clarityLevel}
                        </div>
                        <div className="flex-1">
                            <p className="text-gray-600">
                                {result.aiInsights?.clarityIndex?.justification ||
                                    `Your career direction clarity score is ${result.clarityIndex}/100. ${clarityLevel === 'HIGH' ? 'You have a clear understanding of your career interests.' :
                                        clarityLevel === 'MEDIUM' ? 'Consider exploring more career options.' :
                                            'More exploration may help clarify your career direction.'
                                    }`}
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
