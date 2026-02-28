import { StyleSheet, Font } from '@react-pdf/renderer';
import * as path from 'path';
import type { Lang } from './i18n';

// ─── Font Registration ───────────────────────────────────────────────────────
Font.register({
    family: 'Nunito',
    fonts: [
        { src: path.join(__dirname, 'fonts/Nunito-Regular.ttf'), fontWeight: 400 },
        { src: path.join(__dirname, 'fonts/Nunito-Italic.ttf'), fontWeight: 400, fontStyle: 'italic' },
        { src: path.join(__dirname, 'fonts/Nunito-SemiBold.ttf'), fontWeight: 600 },
        { src: path.join(__dirname, 'fonts/Nunito-Bold.ttf'), fontWeight: 700 },
        { src: path.join(__dirname, 'fonts/Nunito-BoldItalic.ttf'), fontWeight: 700, fontStyle: 'italic' },
    ],
});

Font.register({
    family: 'NotoSansMalayalam',
    fonts: [
        { src: path.join(__dirname, 'fonts/NotoSansMalayalam-Regular.ttf'), fontWeight: 400 },
        { src: path.join(__dirname, 'fonts/NotoSansMalayalam-Regular.ttf'), fontWeight: 400, fontStyle: 'italic' },
        { src: path.join(__dirname, 'fonts/NotoSansMalayalam-Bold.ttf'), fontWeight: 700 },
        { src: path.join(__dirname, 'fonts/NotoSansMalayalam-Bold.ttf'), fontWeight: 700, fontStyle: 'italic' },
    ],
});

// Disable hyphenation to avoid odd word breaks
Font.registerHyphenationCallback(word => [word]);

// ─── Color Palette (matching web UI) ─────────────────────────────────────────
export const COLORS = {
    PRIMARY: '#0e6957',
    PRIMARY_DARK: '#0a4f41',
    PRIMARY_LIGHT: '#a7d8cc',
    BG_LIGHT: '#f0fdf9',
    BG_ACCENT: '#e8f4f1',
    BG_WHITE: '#FFFFFF',
    TEXT_DARK: '#1a3530',
    TEXT_BODY: '#2d4a44',
    TEXT_MUTED: '#4a7c72',
    ACCENT: '#6366f1',
    WARNING: '#d97706',
    DANGER: '#dc2626',
    SUCCESS: '#22c55e',
    BORDER_LIGHT: '#c8e4dd',
    BORDER_ACCENT: '#d4ede7',
    AMBER_BG: '#fefce8',
    AMBER_TEXT: '#92400e',
} as const;

export const RIASEC_COLORS: Record<string, string> = {
    R: '#ef4444',
    I: '#3b82f6',
    A: '#8b5cf6',
    S: '#10b981',
    E: '#f59e0b',
    C: '#06b6d4',
};

export const RIASEC_NAMES: Record<string, string> = {
    R: 'Realistic',
    I: 'Investigative',
    A: 'Artistic',
    S: 'Social',
    E: 'Enterprising',
    C: 'Conventional',
};

// ─── Helper Functions ────────────────────────────────────────────────────────
export const stripEmoji = (str: string): string =>
    str.replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{FE00}-\u{FE0F}\u{1F000}-\u{1FFFF}\u{200D}\u{20E3}\u{E0020}-\u{E007F}]/gu, '').trim();

export const getBarColor = (pct: number): string => {
    if (pct >= 70) return COLORS.PRIMARY;
    if (pct >= 40) return '#2da88e';
    return COLORS.WARNING;
};

export const getPerformanceInfo = (level: string, lang?: Lang): { color: string; label: string } => {
    const labels: Record<string, Record<string, string>> = {
        en: { EXCELLENT: 'Excellent', GOOD: 'Good', AVERAGE: 'Average', NEEDS_IMPROVEMENT: 'Needs Improvement' },
        ml: { EXCELLENT: 'മികച്ചത്', GOOD: 'നല്ലത്', AVERAGE: 'ശരാശരി', NEEDS_IMPROVEMENT: 'മെച്ചപ്പെടുത്തേണ്ടതുണ്ട്' },
    };
    const l = lang || 'en';
    switch (level) {
        case 'EXCELLENT': return { color: COLORS.PRIMARY, label: labels[l].EXCELLENT };
        case 'GOOD': return { color: COLORS.SUCCESS, label: labels[l].GOOD };
        case 'AVERAGE': return { color: COLORS.WARNING, label: labels[l].AVERAGE };
        case 'NEEDS_IMPROVEMENT': return { color: COLORS.DANGER, label: labels[l].NEEDS_IMPROVEMENT };
        default: return { color: COLORS.TEXT_MUTED, label: level };
    }
};

export const getClarityColor = (level: string): string => {
    switch (level) {
        case 'HIGH': return COLORS.PRIMARY;
        case 'MEDIUM': return COLORS.WARNING;
        case 'LOW': return COLORS.DANGER;
        default: return COLORS.TEXT_MUTED;
    }
};

export const toStringArray = (val: string | string[] | undefined): string[] => {
    if (!val) return [];
    if (Array.isArray(val)) return val;
    return val.split(/\n|(?:\d+\.\s)/).map(s => s.trim()).filter(Boolean);
};

export const getAcademicStreams = (val: { recommended: string[]; reasoning: string } | string[] | undefined): string[] => {
    if (!val) return [];
    if (Array.isArray(val)) return val;
    return val.recommended || [];
};

export const getTraitLevel = (pct: number, lang?: Lang): { level: string; color: string } => {
    const labels = lang === 'ml'
        ? { strong: 'ശക്തം', moderate: 'മിതമായ', emerging: 'വളരുന്ന' }
        : { strong: 'Strong', moderate: 'Moderate', emerging: 'Emerging' };
    if (pct >= 75) return { level: labels.strong, color: COLORS.PRIMARY };
    if (pct >= 45) return { level: labels.moderate, color: COLORS.WARNING };
    return { level: labels.emerging, color: COLORS.DANGER };
};

// ─── Language Helpers ────────────────────────────────────────────────────────
export const getFontFamily = (lang: Lang): string =>
    lang === 'ml' ? 'NotoSansMalayalam' : 'Nunito';

export const getPageStyle = (lang: Lang) => ({
    flexDirection: 'column' as const,
    backgroundColor: COLORS.BG_WHITE,
    padding: lang === 'ml' ? 26 : 30,
    paddingBottom: lang === 'ml' ? 44 : 50,
    fontFamily: getFontFamily(lang),
    fontSize: lang === 'ml' ? 9 : 9,
    lineHeight: lang === 'ml' ? 1.35 : undefined,
    color: COLORS.TEXT_BODY,
});

// ─── Shared Styles ───────────────────────────────────────────────────────────
export const styles = StyleSheet.create({
    // Page base
    page: {
        flexDirection: 'column',
        backgroundColor: COLORS.BG_WHITE,
        padding: 30,
        paddingBottom: 50,
        fontFamily: 'Nunito',
        fontSize: 9,
        color: COLORS.TEXT_BODY,
    },

    // Gradient header banner
    header: {
        marginBottom: 12,
        backgroundColor: COLORS.PRIMARY_DARK,
        marginHorizontal: -30,
        marginTop: -30,
        paddingHorizontal: 30,
        paddingTop: 20,
        paddingBottom: 14,
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: 700,
        color: COLORS.BG_WHITE,
        marginBottom: 3,
        letterSpacing: 0.5,
        lineHeight: 1.4,
    },
    headerSubtitle: {
        fontSize: 10,
        color: COLORS.PRIMARY_LIGHT,
        lineHeight: 1.4,
    },

    // Page title (for subsequent pages)
    pageTitle: {
        fontSize: 14,
        fontWeight: 700,
        color: COLORS.PRIMARY,
        marginBottom: 10,
        paddingBottom: 4,
        borderBottom: `1.5 solid ${COLORS.BORDER_LIGHT}`,
        textTransform: 'uppercase',
        letterSpacing: 0.3,
    },

    // Section card with left accent border
    section: {
        marginBottom: 8,
        padding: 10,
        backgroundColor: COLORS.BG_LIGHT,
        borderRadius: 4,
        borderLeft: `3 solid ${COLORS.PRIMARY}`,
    },
    sectionTitle: {
        fontSize: 11,
        fontWeight: 700,
        color: COLORS.PRIMARY_DARK,
        marginBottom: 6,
        textTransform: 'uppercase',
        letterSpacing: 0.3,
    },
    sectionContent: {
        fontSize: 9,
        lineHeight: 1.5,
        color: COLORS.TEXT_BODY,
    },

    // Persona card (dark background)
    personaCard: {
        marginBottom: 10,
        padding: 12,
        backgroundColor: COLORS.PRIMARY_DARK,
        borderRadius: 6,
    },
    personaTitle: {
        fontSize: 16,
        fontWeight: 700,
        color: COLORS.PRIMARY_LIGHT,
        marginBottom: 8,
    },
    personaDesc: {
        fontSize: 9,
        lineHeight: 1.4,
        color: COLORS.BORDER_ACCENT,
        marginBottom: 4,
    },
    personaSuperpower: {
        fontSize: 8,
        color: '#7bc4b1',
        fontWeight: 700,
    },

    // Profile grid (2 col)
    profileGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 6,
        marginBottom: 4,
    },
    profileItem: {
        width: '48%',
        flexDirection: 'row',
        paddingVertical: 2,
    },
    profileLabel: {
        fontSize: 8,
        fontWeight: 700,
        width: 72,
        color: COLORS.TEXT_MUTED,
    },
    profileValue: {
        fontSize: 8,
        color: COLORS.TEXT_DARK,
        flex: 1,
    },

    // Score grid (2 col)
    scoreGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 4,
        marginTop: 4,
    },

    // Two-column layout
    twoCol: {
        flexDirection: 'row',
        gap: 10,
    },
    col: {
        flex: 1,
    },

    // Badges / chips
    badge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 10,
        backgroundColor: COLORS.BG_ACCENT,
    },
    badgeText: {
        fontSize: 8,
        fontWeight: 600,
        color: COLORS.PRIMARY,
    },
    chip: {
        fontSize: 7,
        color: COLORS.TEXT_MUTED,
        backgroundColor: COLORS.BORDER_ACCENT,
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 3,
        marginRight: 3,
        marginBottom: 2,
    },

    // Bullet text
    bulletItem: {
        fontSize: 9,
        marginBottom: 3,
        color: COLORS.TEXT_BODY,
        paddingLeft: 8,
    },

    // Footer
    footer: {
        position: 'absolute',
        bottom: 15,
        left: 30,
        right: 30,
        textAlign: 'center',
        borderTop: `1 solid ${COLORS.BORDER_LIGHT}`,
        paddingTop: 6,
    },
    footerText: {
        fontSize: 7,
        color: COLORS.TEXT_MUTED,
    },

    // Disclaimer
    disclaimer: {
        padding: 8,
        backgroundColor: COLORS.AMBER_BG,
        borderRadius: 4,
        borderLeft: `3 solid ${COLORS.WARNING}`,
        marginTop: 6,
    },
    disclaimerTitle: {
        fontSize: 9,
        fontWeight: 700,
        color: COLORS.AMBER_TEXT,
        marginBottom: 2,
    },
    disclaimerText: {
        fontSize: 7,
        color: COLORS.AMBER_TEXT,
        lineHeight: 1.4,
    },

    // Sector card
    sectorCard: {
        marginBottom: 6,
        padding: 8,
        backgroundColor: COLORS.BG_ACCENT,
        borderRadius: 4,
        borderLeft: `3 solid ${COLORS.PRIMARY}`,
    },
    sectorName: {
        fontSize: 10,
        fontWeight: 700,
        color: COLORS.PRIMARY_DARK,
        marginBottom: 2,
    },
    sectorScore: {
        fontSize: 9,
        fontWeight: 700,
        color: COLORS.PRIMARY,
    },
    sectorDetail: {
        fontSize: 7,
        color: COLORS.TEXT_MUTED,
        lineHeight: 1.3,
    },

    // Trait row
    traitRow: {
        marginBottom: 4,
        paddingBottom: 3,
        borderBottom: `0.5 solid ${COLORS.BG_ACCENT}`,
    },
    traitName: {
        fontSize: 8,
        fontWeight: 700,
        color: COLORS.PRIMARY_DARK,
        marginBottom: 1,
    },
    traitInterpretation: {
        fontSize: 8,
        color: COLORS.TEXT_MUTED,
        lineHeight: 1.4,
    },

    // Career item card
    careerCard: {
        padding: 6,
        marginBottom: 4,
        backgroundColor: COLORS.BG_ACCENT,
        borderRadius: 3,
    },
    careerTitle: {
        fontSize: 9,
        fontWeight: 700,
        color: COLORS.PRIMARY_DARK,
    },
    careerReason: {
        fontSize: 7,
        color: COLORS.TEXT_MUTED,
        marginTop: 1,
    },

    // Roadmap timeline item
    roadmapPhase: {
        marginBottom: 8,
        paddingLeft: 10,
        borderLeft: `2 solid ${COLORS.PRIMARY}`,
    },
    roadmapTitle: {
        fontSize: 10,
        fontWeight: 700,
        color: COLORS.PRIMARY,
        marginBottom: 3,
    },

    // Dimension row (performance dims)
    dimensionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
        paddingVertical: 3,
        paddingHorizontal: 6,
        backgroundColor: COLORS.BG_ACCENT,
        borderRadius: 3,
    },
    dimensionName: {
        fontSize: 8,
        fontWeight: 700,
        color: COLORS.TEXT_MUTED,
        width: '22%',
    },
    dimensionScore: {
        fontSize: 10,
        fontWeight: 700,
        color: COLORS.PRIMARY,
        width: '8%',
        textAlign: 'right',
    },
    dimensionDesc: {
        fontSize: 7,
        color: COLORS.TEXT_MUTED,
        width: '65%',
        lineHeight: 1.3,
    },

    // Holland code letters
    hollandRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 4,
        marginVertical: 6,
    },
    hollandLetter: {
        fontSize: 28,
        fontWeight: 700,
        textAlign: 'center',
    },
    hollandDash: {
        fontSize: 20,
        fontWeight: 700,
        color: COLORS.TEXT_MUTED,
    },

    // Numbered action item
    actionItem: {
        flexDirection: 'row',
        marginBottom: 4,
        paddingLeft: 4,
    },
    actionNumber: {
        fontSize: 9,
        fontWeight: 700,
        color: COLORS.PRIMARY,
        width: 16,
    },
    actionText: {
        fontSize: 9,
        color: COLORS.TEXT_BODY,
        flex: 1,
        lineHeight: 1.4,
    },

    // Strength/growth list item
    strengthItem: {
        flexDirection: 'row',
        marginBottom: 3,
        paddingLeft: 4,
    },
    strengthDot: {
        fontSize: 9,
        fontWeight: 700,
        width: 12,
    },
    strengthText: {
        fontSize: 9,
        color: COLORS.TEXT_BODY,
        flex: 1,
    },
});

// ─── Interfaces (exported for report files) ──────────────────────────────────
export interface ReportData {
    candidateName: string;
    age?: number;
    gender?: string;
    location?: string;
    education?: string;
    currentRole?: string;
    assessmentDate: Date;
    aptitudeScores: Record<string, { percentage: number }>;
    riasecScores: { R: number; I: number; A: number; S: number; E: number; C: number };
    riasecCode: string;
    employabilityScores: Record<string, { percentage: number }>;
    personalityScores: Record<string, { average: number }>;
    clarityIndex: number;
    aiInsights?: {
        professionalPersona?: { title: string; description: string; superpower: string };
        performanceDimensions?: Record<string, { score: number; description: string }>;
        employabilitySummary?: string;
        aptitudeAnalysis?: string;
        careerInterestAlignment?: string;
        personalitySnapshot?: string;
        skillReadiness?: string;
        sectorRecommendations?: {
            primarySectors: { name: string; explanation: string }[];
            growthSectors: { name: string; explanation: string }[];
            sectorsToAvoid: string;
        };
        careerRecommendations?: {
            primaryRoles: string[];
            growthRoles: string[];
            rolesToAvoid: string;
        };
        developmentGuidance?: string;
        developmentRoadmap?: string;
        clarityIndex?: { level: string; justification: string };
        detailedTraitInterpretation?: Record<string, string>;
    };
    careerMatches: { title: string; matchScore: number }[];
    sectorMatches?: {
        id: string;
        name: string;
        icon: string;
        matchScore: number;
        riasecFit: number;
        aptitudeFit: number;
        personalityFit: number;
        employabilityFit: number;
        readinessLevel: string;
        exampleRoles: string[];
        growthOutlook: string;
        avgSalaryRange: string;
    }[];
}

export interface StudentReportData {
    studentName: string;
    grade?: string;
    schoolName?: string;
    gender?: string;
    location?: string;
    assessmentDate: Date;
    aptitudeScores: Record<string, { correct: number; total: number; percentage: number }>;
    weightedScore: number;
    performanceLevel: 'EXCELLENT' | 'GOOD' | 'AVERAGE' | 'NEEDS_IMPROVEMENT';
    academicReadinessIndex: number;
    topStrengths: string[];
    areasForImprovement: string[];
    riasecCode?: string;
    riasecScores?: Record<string, number>;
    personalityScores?: Record<string, { score: number; maxScore: number; level: string }>;
    readinessScores?: Record<string, { score: number; maxScore: number; percentage: number }>;
    careerMatches?: { title: string; matchScore: number }[];
    sectorMatches?: { name: string; matchScore: number }[];
    aiInsights?: {
        studentPersona?: { title: string; description: string; superpower: string };
        overallSummary?: string;
        strengthsAnalysis?: string;
        areasForGrowth?: string;
        riasecAnalysis?: string;
        personalityAnalysis?: string;
        readinessAnalysis?: string;
        academicStreams?: { recommended: string[]; reasoning: string } | string[];
        careerGuidance?: { suggestedCareers: { role: string; fitReason?: string }[]; skillsToDevelop: string[] } | string;
        sectorRecommendations?: { topSectors: string[]; reasoning: string };
        studyTips?: string | string[];
        nextSteps?: string | string[];
        title_ml?: string;
        analysis_ml?: string;
    };
}
