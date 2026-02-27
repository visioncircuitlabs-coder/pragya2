import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AiAnalysisService } from '../ai-analysis/ai-analysis.service';
import * as React from 'react';
import { Document, Page, Text, View, StyleSheet, renderToFile } from '@react-pdf/renderer';
import * as fs from 'fs';
import * as path from 'path';
import { LoggerService } from '../logger/logger.service';

/**
 * PDF Report Generation Service
 * Creates comprehensive, multi-page Pragya 360° Employability Reports
 */

// PDF Styles - Modern, compact design matching Pragya web UI
const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        backgroundColor: '#FFFFFF',
        padding: 30,
        paddingBottom: 50,
        fontFamily: 'Helvetica',
        fontSize: 9,
    },
    header: {
        marginBottom: 14,
        backgroundColor: '#0a4f41',
        marginHorizontal: -30,
        marginTop: -30,
        paddingHorizontal: 30,
        paddingTop: 20,
        paddingBottom: 14,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 3,
        letterSpacing: 0.5,
    },
    subtitle: {
        fontSize: 10,
        color: '#a7d8cc',
    },
    pageTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#0e6957',
        marginBottom: 8,
        marginTop: 4,
        paddingBottom: 4,
        borderBottom: '1.5 solid #c8e4dd',
        textTransform: 'uppercase',
        letterSpacing: 0.3,
    },
    section: {
        marginBottom: 8,
        padding: 8,
        backgroundColor: '#fafcfb',
        borderRadius: 4,
        borderLeft: '2.5 solid #0e6957',
    },
    sectionTitle: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#0a4f41',
        marginBottom: 5,
        textTransform: 'uppercase',
        letterSpacing: 0.2,
    },
    sectionContent: {
        fontSize: 9,
        lineHeight: 1.5,
        color: '#2d4a44',
    },
    profileRow: {
        flexDirection: 'row',
        marginBottom: 3,
    },
    profileLabel: {
        fontSize: 9,
        fontWeight: 'bold',
        width: 80,
        color: '#3d6158',
    },
    profileValue: {
        fontSize: 9,
        color: '#1a3530',
    },
    scoreGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 4,
        marginTop: 5,
    },
    scoreItem: {
        width: '48%',
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 3,
        paddingVertical: 2,
        paddingHorizontal: 5,
        backgroundColor: '#e8f4f1',
        borderRadius: 3,
    },
    scoreName: {
        fontSize: 8,
        color: '#3d6158',
        flex: 1,
    },
    scoreBar: {
        width: 60,
        height: 5,
        backgroundColor: '#d4ede7',
        borderRadius: 3,
        marginHorizontal: 4,
    },
    scoreBarFill: {
        height: 5,
        backgroundColor: '#0e6957',
        borderRadius: 3,
    },
    scoreValue: {
        fontSize: 8,
        fontWeight: 'bold',
        color: '#0e6957',
        width: 28,
        textAlign: 'right',
    },
    riasecContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginVertical: 6,
        backgroundColor: '#e8f4f1',
        paddingVertical: 8,
        borderRadius: 4,
    },
    riasecItem: {
        alignItems: 'center',
    },
    riasecCode: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#0e6957',
    },
    riasecLabel: {
        fontSize: 7,
        color: '#4a7c72',
        marginTop: 1,
    },
    riasecScore: {
        fontSize: 8,
        color: '#2d4a44',
        fontWeight: 'bold',
    },
    sectorCard: {
        marginBottom: 5,
        padding: 7,
        backgroundColor: '#e8f4f1',
        borderRadius: 4,
        borderLeft: '2.5 solid #0e6957',
    },
    sectorName: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#0a4f41',
        marginBottom: 2,
    },
    sectorScore: {
        fontSize: 9,
        fontWeight: 'bold',
        color: '#0e6957',
    },
    sectorDetail: {
        fontSize: 8,
        color: '#3d6158',
        lineHeight: 1.3,
    },
    roleTag: {
        fontSize: 7,
        color: '#4a7c72',
        backgroundColor: '#d4ede7',
        paddingHorizontal: 5,
        paddingVertical: 2,
        borderRadius: 3,
        marginRight: 3,
        marginBottom: 2,
    },
    careerItem: {
        fontSize: 9,
        marginBottom: 3,
        color: '#2d4a44',
        paddingLeft: 8,
    },
    clarityBadge: {
        backgroundColor: '#0e6957',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 4,
        alignSelf: 'flex-start',
    },
    clarityText: {
        fontSize: 11,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    traitRow: {
        marginBottom: 4,
        paddingBottom: 3,
        borderBottom: '0.5 solid #e8f4f1',
    },
    traitName: {
        fontSize: 8,
        fontWeight: 'bold',
        color: '#0a4f41',
        marginBottom: 1,
    },
    traitInterpretation: {
        fontSize: 8,
        color: '#4a7c72',
        lineHeight: 1.4,
    },
    footer: {
        position: 'absolute',
        bottom: 15,
        left: 30,
        right: 30,
        textAlign: 'center',
        borderTop: '1 solid #c8e4dd',
        paddingTop: 6,
    },
    footerText: {
        fontSize: 7,
        color: '#4a7c72',
    },
    dimensionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
        paddingVertical: 3,
        paddingHorizontal: 6,
        backgroundColor: '#e8f4f1',
        borderRadius: 3,
    },
    dimensionName: {
        fontSize: 8,
        fontWeight: 'bold',
        color: '#3d6158',
        width: '22%',
    },
    dimensionScore: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#0e6957',
        width: '8%',
        textAlign: 'right',
    },
    dimensionDesc: {
        fontSize: 7,
        color: '#4a7c72',
        width: '65%',
        lineHeight: 1.3,
    },
    personaCard: {
        marginBottom: 8,
        padding: 10,
        backgroundColor: '#0a4f41',
        borderRadius: 6,
    },
});

// Strip emoji/special chars that Helvetica can't render
const stripEmoji = (str: string): string =>
    str.replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{FE00}-\u{FE0F}\u{1F000}-\u{1FFFF}\u{200D}\u{20E3}\u{E0020}-\u{E007F}]/gu, '').trim();

const getClarityColor = (level: string): string => {
    switch (level) {
        case 'HIGH': return '#0e6957';
        case 'MEDIUM': return '#d97706';
        case 'LOW': return '#dc2626';
        default: return '#4a7c72';
    }
};

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

// Student-specific report data
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
    };
}

// Score bar helper - creates a visual progress bar for scores
const ScoreBar = ({ name, value, max, suffix }: { name: string; value: number; max: number; suffix: string }) => {
    const pct = Math.min(100, Math.round((value / max) * 100));
    return React.createElement(View, { style: styles.scoreItem },
        React.createElement(Text, { style: styles.scoreName }, name),
        React.createElement(View, { style: styles.scoreBar },
            React.createElement(View, { style: { ...styles.scoreBarFill, width: `${pct}%` } })
        ),
        React.createElement(Text, { style: styles.scoreValue }, `${value}${suffix}`)
    );
};

// ──── PAGE 1: Header + Profile + Persona + Summary + Dimensions + Aptitude ────
const ReportPage1 = ({ data }: { data: ReportData }) => {
    const persona = data.aiInsights?.professionalPersona;

    return React.createElement(Page, { size: 'A4', style: styles.page },
        // Dark gradient header
        React.createElement(View, { style: styles.header },
            React.createElement(Text, { style: styles.title }, 'PRAGYA 360° Employability Report'),
            React.createElement(Text, { style: styles.subtitle },
                `${data.candidateName} | ${data.assessmentDate.toLocaleDateString('en-IN', {
                    day: 'numeric', month: 'long', year: 'numeric'
                })}`
            )
        ),

        // Candidate Profile (compact inline)
        React.createElement(View, { style: { ...styles.section, paddingVertical: 6 } },
            React.createElement(Text, { style: styles.sectionTitle }, 'Candidate Profile'),
            React.createElement(View, { style: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 } },
                React.createElement(View, { style: styles.profileRow },
                    React.createElement(Text, { style: styles.profileLabel }, 'Name:'),
                    React.createElement(Text, { style: styles.profileValue }, data.candidateName)
                ),
                ...(data.age ? [React.createElement(View, { style: styles.profileRow, key: 'age' },
                    React.createElement(Text, { style: styles.profileLabel }, 'Age:'),
                    React.createElement(Text, { style: styles.profileValue }, `${data.age} years`)
                )] : []),
                ...(data.education ? [React.createElement(View, { style: styles.profileRow, key: 'edu' },
                    React.createElement(Text, { style: styles.profileLabel }, 'Education:'),
                    React.createElement(Text, { style: styles.profileValue }, data.education)
                )] : []),
                ...(data.location ? [React.createElement(View, { style: styles.profileRow, key: 'loc' },
                    React.createElement(Text, { style: styles.profileLabel }, 'Location:'),
                    React.createElement(Text, { style: styles.profileValue }, data.location)
                )] : [])
            )
        ),

        // Professional Persona - dark card
        persona && React.createElement(View, { style: styles.personaCard },
            React.createElement(Text, { style: { fontSize: 13, fontWeight: 'bold', color: '#a7d8cc', marginBottom: 2 } }, persona.title),
            React.createElement(Text, { style: { fontSize: 8, lineHeight: 1.4, color: '#d4ede7', marginBottom: 4 } }, persona.description),
            React.createElement(Text, { style: { fontSize: 7, color: '#7bc4b1', fontWeight: 'bold' } }, `✦ Superpower: ${persona.superpower}`)
        ),

        // Employability Summary
        data.aiInsights?.employabilitySummary && React.createElement(View, { style: styles.section },
            React.createElement(Text, { style: styles.sectionTitle }, 'Employability Profile Summary'),
            React.createElement(Text, { style: styles.sectionContent }, data.aiInsights.employabilitySummary)
        ),

        // Performance Dimensions with score bars
        data.aiInsights?.performanceDimensions && React.createElement(View, { style: styles.section },
            React.createElement(Text, { style: styles.sectionTitle }, 'Performance Dimensions'),
            ...Object.entries(data.aiInsights.performanceDimensions).map(([key, dim]) =>
                React.createElement(View, { style: styles.dimensionRow, key },
                    React.createElement(Text, { style: styles.dimensionName },
                        key.replace(/([A-Z])/g, ' $1').replace(/^./, (s: string) => s.toUpperCase()).trim()
                    ),
                    React.createElement(View, { style: { ...styles.scoreBar, width: 50 } },
                        React.createElement(View, { style: { ...styles.scoreBarFill, width: `${dim.score * 10}%` } })
                    ),
                    React.createElement(Text, { style: styles.dimensionScore }, `${dim.score}/10`),
                    React.createElement(Text, { style: styles.dimensionDesc }, dim.description)
                )
            )
        ),

        // Cognitive & Aptitude Analysis with visual bars
        React.createElement(View, { style: styles.section },
            React.createElement(Text, { style: styles.sectionTitle }, 'Cognitive & Aptitude Analysis'),
            data.aiInsights?.aptitudeAnalysis && React.createElement(Text, { style: { ...styles.sectionContent, marginBottom: 5 } }, data.aiInsights.aptitudeAnalysis),
            React.createElement(View, { style: styles.scoreGrid },
                ...Object.entries(data.aptitudeScores || {}).map(([section, scores]) =>
                    React.createElement(ScoreBar, { key: section, name: section, value: scores.percentage, max: 100, suffix: '%' })
                )
            )
        ),

        React.createElement(View, { style: styles.footer, fixed: true },
            React.createElement(Text, { style: styles.footerText, render: ({ pageNumber }: { pageNumber: number }) => `PRAGYA 360° Employability Report | Vision Circuit Labs | Page ${pageNumber} | Confidential` })
        )
    );
};

// ──── PAGE 2: RIASEC + Sector Matches + Personality ────
const ReportPage2 = ({ data }: { data: ReportData }) => {
    const riasecNames: Record<string, string> = {
        R: 'Realistic', I: 'Investigative', A: 'Artistic',
        S: 'Social', E: 'Enterprising', C: 'Conventional',
    };
    const allCodes: (keyof typeof riasecNames)[] = ['R', 'I', 'A', 'S', 'E', 'C'];

    return React.createElement(Page, { size: 'A4', style: styles.page },
        React.createElement(Text, { style: styles.pageTitle }, 'Career Interest & Sector Analysis'),

        // RIASEC with all 6 codes
        React.createElement(View, { style: styles.section },
            React.createElement(Text, { style: styles.sectionTitle }, `Career Interest Alignment (RIASEC — ${data.riasecCode})`),
            data.aiInsights?.careerInterestAlignment && React.createElement(Text, { style: { ...styles.sectionContent, marginBottom: 4 } }, data.aiInsights.careerInterestAlignment),
            React.createElement(View, { style: styles.riasecContainer },
                ...allCodes.map((code) =>
                    React.createElement(View, { style: styles.riasecItem, key: code },
                        React.createElement(Text, { style: { ...styles.riasecCode, color: data.riasecCode.includes(code) ? '#0e6957' : '#b0c4bf' } }, code),
                        React.createElement(Text, { style: styles.riasecLabel }, riasecNames[code]),
                        React.createElement(Text, { style: styles.riasecScore }, `${data.riasecScores[code as keyof typeof data.riasecScores]}/32`)
                    )
                )
            )
        ),

        // Sector Matches with score bars
        data.sectorMatches && data.sectorMatches.length > 0 && React.createElement(View, { style: styles.section },
            React.createElement(Text, { style: styles.sectionTitle }, 'Industry Sector Matches'),
            ...data.sectorMatches.slice(0, 5).map((sector) =>
                React.createElement(View, { style: styles.sectorCard, key: sector.id },
                    React.createElement(View, { style: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' } },
                        React.createElement(Text, { style: styles.sectorName }, stripEmoji(sector.name)),
                        React.createElement(Text, { style: styles.sectorScore }, `${sector.matchScore}%`)
                    ),
                    React.createElement(View, { style: { ...styles.scoreBar, width: '100%', marginVertical: 2 } },
                        React.createElement(View, { style: { ...styles.scoreBarFill, width: `${sector.matchScore}%` } })
                    ),
                    React.createElement(Text, { style: styles.sectorDetail },
                        `Interest: ${sector.riasecFit}% | Aptitude: ${sector.aptitudeFit}% | Personality: ${sector.personalityFit}% | Readiness: ${sector.employabilityFit}%`
                    ),
                    React.createElement(View, { style: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 2 } },
                        ...sector.exampleRoles.slice(0, 4).map(role =>
                            React.createElement(Text, { style: styles.roleTag, key: role }, role)
                        )
                    ),
                    React.createElement(Text, { style: { fontSize: 7, color: '#4a7c72', marginTop: 1 } },
                        `Readiness: ${sector.readinessLevel} | Growth: ${sector.growthOutlook} | Salary: ${sector.avgSalaryRange}`
                    )
                )
            )
        ),

        React.createElement(View, { style: styles.footer, fixed: true },
            React.createElement(Text, { style: styles.footerText, render: ({ pageNumber }: { pageNumber: number }) => `PRAGYA 360° Employability Report | Vision Circuit Labs | Page ${pageNumber} | Confidential` })
        )
    );
};

// ──── PAGE 3: Personality + Employability + AI Sector Insights ────
const ReportPage3 = ({ data }: { data: ReportData }) => {
    return React.createElement(Page, { size: 'A4', style: styles.page },
        React.createElement(Text, { style: styles.pageTitle }, 'Personality & Employability Profile'),

        // Personality Snapshot with visual bars
        React.createElement(View, { style: styles.section },
            React.createElement(Text, { style: styles.sectionTitle }, 'Work Personality Profile'),
            data.aiInsights?.personalitySnapshot && React.createElement(Text, { style: { ...styles.sectionContent, marginBottom: 4 } }, data.aiInsights.personalitySnapshot),
            React.createElement(View, { style: styles.scoreGrid },
                ...Object.entries(data.personalityScores || {}).map(([trait, scores]) =>
                    React.createElement(ScoreBar, { key: trait, name: trait, value: scores.average, max: 5, suffix: '/5' })
                )
            ),
            // Detailed trait interpretations
            data.aiInsights?.detailedTraitInterpretation &&
            React.createElement(View, { style: { marginTop: 6 } },
                React.createElement(Text, { style: { fontSize: 9, fontWeight: 'bold', color: '#0a4f41', marginBottom: 4 } }, 'Detailed Trait Analysis:'),
                ...Object.entries(data.aiInsights.detailedTraitInterpretation).map(([trait, interpretation]) =>
                    React.createElement(View, { style: styles.traitRow, key: trait },
                        React.createElement(Text, { style: styles.traitName }, trait),
                        React.createElement(Text, { style: styles.traitInterpretation }, interpretation)
                    )
                )
            )
        ),

        // Employability Skills with visual bars
        React.createElement(View, { style: styles.section },
            React.createElement(Text, { style: styles.sectionTitle }, 'Employability Skill Readiness'),
            data.aiInsights?.skillReadiness && React.createElement(Text, { style: { ...styles.sectionContent, marginBottom: 4 } }, data.aiInsights.skillReadiness),
            React.createElement(View, { style: styles.scoreGrid },
                ...Object.entries(data.employabilityScores || {}).map(([section, scores]) =>
                    React.createElement(ScoreBar, { key: section, name: section, value: scores.percentage, max: 100, suffix: '%' })
                )
            )
        ),

        // AI Sector Recommendations
        data.aiInsights?.sectorRecommendations && React.createElement(View, { style: styles.section },
            React.createElement(Text, { style: styles.sectionTitle }, 'AI-Powered Sector Guidance'),
            React.createElement(Text, { style: { fontSize: 9, fontWeight: 'bold', color: '#0e6957', marginBottom: 3 } }, 'Primary Sectors:'),
            ...(data.aiInsights.sectorRecommendations.primarySectors || []).map((sector, i) =>
                React.createElement(View, { style: { marginBottom: 3 }, key: `ps-${i}` },
                    React.createElement(Text, { style: { fontSize: 9, fontWeight: 'bold', color: '#2d4a44' } }, `• ${sector.name}`),
                    React.createElement(Text, { style: { fontSize: 8, color: '#4a7c72', paddingLeft: 8 } }, sector.explanation)
                )
            ),
            React.createElement(Text, { style: { fontSize: 9, fontWeight: 'bold', color: '#0e6957', marginTop: 5, marginBottom: 3 } }, 'Growth Sectors:'),
            ...(data.aiInsights.sectorRecommendations.growthSectors || []).map((sector, i) =>
                React.createElement(Text, { style: { ...styles.careerItem, fontSize: 8 }, key: `gs-${i}` }, `• ${sector.name} — ${sector.explanation}`)
            ),
            data.aiInsights.sectorRecommendations.sectorsToAvoid &&
            React.createElement(Text, { style: { ...styles.sectionContent, marginTop: 4, fontStyle: 'italic', fontSize: 8 } },
                `Note: ${data.aiInsights.sectorRecommendations.sectorsToAvoid}`
            )
        ),

        React.createElement(View, { style: styles.footer, fixed: true },
            React.createElement(Text, { style: styles.footerText, render: ({ pageNumber }: { pageNumber: number }) => `PRAGYA 360° Employability Report | Vision Circuit Labs | Page ${pageNumber} | Confidential` })
        )
    );
};

// ──── PAGE 4: Career Roles + Development Roadmap + Clarity ────
const ReportPage4 = ({ data }: { data: ReportData }) => {
    const clarityLevel = data.aiInsights?.clarityIndex?.level ||
        (data.clarityIndex >= 70 ? 'HIGH' : data.clarityIndex >= 40 ? 'MEDIUM' : 'LOW');

    return React.createElement(Page, { size: 'A4', style: styles.page },
        React.createElement(Text, { style: styles.pageTitle }, 'Career Guidance & Development Plan'),

        // Career Roles — two columns
        React.createElement(View, { style: styles.section },
            React.createElement(Text, { style: styles.sectionTitle }, 'Best-Fit Career Roles'),
            React.createElement(View, { style: { flexDirection: 'row', gap: 8 } },
                React.createElement(View, { style: { flex: 1 } },
                    React.createElement(Text, { style: { fontSize: 9, fontWeight: 'bold', color: '#0e6957', marginBottom: 3 } }, 'Primary Fit:'),
                    ...(data.aiInsights?.careerRecommendations?.primaryRoles || data.careerMatches.slice(0, 4).map(c => c.title)).map((role, i) =>
                        React.createElement(Text, { style: { ...styles.careerItem, fontSize: 8 }, key: `pr-${i}` }, `• ${role}`)
                    )
                ),
                React.createElement(View, { style: { flex: 1 } },
                    React.createElement(Text, { style: { fontSize: 9, fontWeight: 'bold', color: '#3b82f6', marginBottom: 3 } }, 'Growth Roles:'),
                    ...(data.aiInsights?.careerRecommendations?.growthRoles || data.careerMatches.slice(4, 7).map(c => c.title)).map((role, i) =>
                        React.createElement(Text, { style: { ...styles.careerItem, fontSize: 8 }, key: `gr-${i}` }, `• ${role}`)
                    )
                )
            ),
            data.aiInsights?.careerRecommendations?.rolesToAvoid && React.createElement(Text, { style: { ...styles.sectionContent, marginTop: 4, fontStyle: 'italic', fontSize: 8 } },
                `Note: ${data.aiInsights.careerRecommendations.rolesToAvoid}`
            )
        ),

        // Development Roadmap
        (data.aiInsights?.developmentRoadmap || data.aiInsights?.developmentGuidance) && React.createElement(View, { style: styles.section },
            React.createElement(Text, { style: styles.sectionTitle }, 'Development Roadmap'),
            React.createElement(Text, { style: styles.sectionContent },
                data.aiInsights?.developmentRoadmap || data.aiInsights?.developmentGuidance || ''
            )
        ),

        // Clarity Index
        React.createElement(View, { style: styles.section },
            React.createElement(Text, { style: styles.sectionTitle }, 'Career Direction Clarity Index'),
            React.createElement(View, { style: { flexDirection: 'row', alignItems: 'center', gap: 8 } },
                React.createElement(View, { style: { ...styles.clarityBadge, backgroundColor: getClarityColor(clarityLevel) } },
                    React.createElement(Text, { style: styles.clarityText }, `${clarityLevel} (${data.clarityIndex}/100)`)
                ),
                React.createElement(Text, { style: { ...styles.sectionContent, flex: 1 } },
                    data.aiInsights?.clarityIndex?.justification || `Score: ${data.clarityIndex}/100`
                )
            )
        ),

        // Disclaimer
        React.createElement(View, { style: { ...styles.section, backgroundColor: '#fefce8', borderLeftColor: '#d97706', marginTop: 6, padding: 6 } },
            React.createElement(Text, { style: { fontSize: 8, fontWeight: 'bold', color: '#92400e', marginBottom: 2 } }, 'Disclaimer'),
            React.createElement(Text, { style: { fontSize: 7, color: '#92400e', lineHeight: 1.4 } },
                'This report is generated based on standardized psychometric assessments and AI analysis. It provides career guidance ' +
                'and should be used as one of many inputs in career decision-making. Consider consulting with a qualified career counselor. ' +
                'Results reflect the candidate\'s state at the time of assessment.'
            )
        ),

        React.createElement(View, { style: styles.footer, fixed: true },
            React.createElement(Text, { style: styles.footerText, render: ({ pageNumber }: { pageNumber: number }) => `PRAGYA 360° Employability Report | Vision Circuit Labs | Page ${pageNumber} | Confidential` })
        )
    );
};

// Main Report Component (4 pages, compact flowing layout)
const PragyaReport = ({ data }: { data: ReportData }) => {
    return React.createElement(Document, {},
        React.createElement(ReportPage1, { data }),
        React.createElement(ReportPage2, { data }),
        React.createElement(ReportPage3, { data }),
        React.createElement(ReportPage4, { data })
    );
};

// Student Report component (kept unchanged for backward compatibility)
const getPerformanceInfo = (level: string): { color: string; label: string } => {
    switch (level) {
        case 'EXCELLENT': return { color: '#0e6957', label: 'Excellent' };
        case 'GOOD': return { color: '#22c55e', label: 'Good' };
        case 'AVERAGE': return { color: '#d97706', label: 'Average' };
        case 'NEEDS_IMPROVEMENT': return { color: '#dc2626', label: 'Needs Improvement' };
        default: return { color: '#4a7c72', label: level };
    }
};

const RIASEC_FULL_NAMES: Record<string, string> = {
    R: 'Realistic', I: 'Investigative', A: 'Artistic',
    S: 'Social', E: 'Enterprising', C: 'Conventional',
};

// Helper to normalize studyTips/nextSteps which can be string or string[]
const toStringArray = (val: string | string[] | undefined): string[] => {
    if (!val) return [];
    if (Array.isArray(val)) return val;
    return val.split(/\n|(?:\d+\.\s)/).map(s => s.trim()).filter(Boolean);
};

// Helper to get academic streams as string[]
const getAcademicStreams = (val: { recommended: string[]; reasoning: string } | string[] | undefined): string[] => {
    if (!val) return [];
    if (Array.isArray(val)) return val;
    return val.recommended || [];
};

const StudentReport = ({ data }: { data: StudentReportData }) => {
    const performanceInfo = getPerformanceInfo(data.performanceLevel);
    const ai = data.aiInsights;

    // Normalize career guidance
    const suggestedCareers: { role: string; fitReason?: string }[] =
        ai?.careerGuidance && typeof ai.careerGuidance === 'object' && 'suggestedCareers' in ai.careerGuidance
            ? ai.careerGuidance.suggestedCareers : [];
    const skillsToDevelop: string[] =
        ai?.careerGuidance && typeof ai.careerGuidance === 'object' && 'skillsToDevelop' in ai.careerGuidance
            ? ai.careerGuidance.skillsToDevelop : [];
    const careerGuidanceText = typeof ai?.careerGuidance === 'string' ? ai.careerGuidance : '';

    const academicStreams = getAcademicStreams(ai?.academicStreams);
    const studyTips = toStringArray(ai?.studyTips);
    const nextSteps = toStringArray(ai?.nextSteps);

    const label = { fontSize: 10, fontWeight: 'bold' as const, color: '#0a4f41', marginBottom: 4 };
    const body = styles.sectionContent;
    const bullet = styles.careerItem;

    // Page 1: Profile + Overall + Aptitude
    const page1 = React.createElement(Page, { size: 'A4', style: styles.page },
        React.createElement(View, { style: styles.header },
            React.createElement(Text, { style: styles.title }, 'PRAGYA 360° Student Career Report'),
            React.createElement(Text, { style: styles.subtitle },
                `Generated on ${data.assessmentDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}`
            )
        ),
        // Student Persona
        ai?.studentPersona && React.createElement(View, { style: { ...styles.section, backgroundColor: '#f0fdf9', padding: 10, borderRadius: 4 } },
            React.createElement(Text, { style: { fontSize: 14, fontWeight: 'bold', color: '#0e6957', marginBottom: 4 } }, ai.studentPersona.title),
            React.createElement(Text, { style: { fontSize: 10, color: '#2d4a44', marginBottom: 2 } }, ai.studentPersona.description),
            React.createElement(Text, { style: { fontSize: 10, color: '#0e6957', fontWeight: 'bold' } }, `Superpower: ${ai.studentPersona.superpower}`)
        ),
        // Profile
        React.createElement(View, { style: styles.section },
            React.createElement(Text, { style: styles.sectionTitle }, '1. Student Profile'),
            React.createElement(View, { style: styles.profileRow },
                React.createElement(Text, { style: styles.profileLabel }, 'Name:'),
                React.createElement(Text, { style: styles.profileValue }, data.studentName)
            ),
            data.grade && React.createElement(View, { style: styles.profileRow },
                React.createElement(Text, { style: styles.profileLabel }, 'Grade:'),
                React.createElement(Text, { style: styles.profileValue }, data.grade)
            ),
            data.schoolName && React.createElement(View, { style: styles.profileRow },
                React.createElement(Text, { style: styles.profileLabel }, 'School:'),
                React.createElement(Text, { style: styles.profileValue }, data.schoolName)
            ),
            data.riasecCode && React.createElement(View, { style: styles.profileRow },
                React.createElement(Text, { style: styles.profileLabel }, 'Holland Code:'),
                React.createElement(Text, { style: styles.profileValue },
                    `${data.riasecCode} (${data.riasecCode.split('').map(c => RIASEC_FULL_NAMES[c] || c).join('-')})`
                )
            )
        ),
        // Overall Performance
        React.createElement(View, { style: styles.section },
            React.createElement(Text, { style: styles.sectionTitle }, '2. Overall Performance'),
            React.createElement(View, { style: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 10 } },
                React.createElement(View, { style: { alignItems: 'center' } },
                    React.createElement(View, { style: { ...styles.clarityBadge, backgroundColor: performanceInfo.color } },
                        React.createElement(Text, { style: styles.clarityText }, `${data.weightedScore}%`)
                    ),
                    React.createElement(Text, { style: { fontSize: 9, color: '#4a7c72', marginTop: 4 } }, 'Overall Score')
                ),
                React.createElement(View, { style: { alignItems: 'center' } },
                    React.createElement(View, { style: { ...styles.clarityBadge, backgroundColor: performanceInfo.color } },
                        React.createElement(Text, { style: styles.clarityText }, performanceInfo.label)
                    ),
                    React.createElement(Text, { style: { fontSize: 9, color: '#4a7c72', marginTop: 4 } }, 'Performance Level')
                ),
                React.createElement(View, { style: { alignItems: 'center' } },
                    React.createElement(View, { style: styles.clarityBadge },
                        React.createElement(Text, { style: styles.clarityText }, `${data.academicReadinessIndex}/100`)
                    ),
                    React.createElement(Text, { style: { fontSize: 9, color: '#4a7c72', marginTop: 4 } }, 'Academic Readiness')
                )
            ),
            ai?.overallSummary && React.createElement(Text, { style: { ...body, marginTop: 8 } }, ai.overallSummary)
        ),
        // Aptitude Scores
        React.createElement(View, { style: styles.section },
            React.createElement(Text, { style: styles.sectionTitle }, '3. Aptitude Test Results'),
            React.createElement(View, { style: styles.scoreGrid },
                ...Object.entries(data.aptitudeScores)
                    .filter(([key]) => key !== 'overall')
                    .map(([name, score]) =>
                        React.createElement(View, { style: styles.scoreItem, key: name },
                            React.createElement(Text, { style: styles.scoreName }, name),
                            React.createElement(Text, { style: styles.scoreValue },
                                `${score.correct}/${score.total} (${Math.round(score.percentage)}%)`
                            )
                        )
                    )
            )
        ),
        React.createElement(View, { style: styles.footer, fixed: true },
            React.createElement(Text, { style: styles.footerText }, 'PRAGYA 360° Student Career Report | Page 1 | Confidential')
        )
    );

    // Page 2: RIASEC + Personality + Readiness
    const page2 = React.createElement(Page, { size: 'A4', style: styles.page },
        // RIASEC Scores
        data.riasecScores && React.createElement(View, { style: styles.section },
            React.createElement(Text, { style: styles.sectionTitle }, '4. Career Interest Inventory (RIASEC)'),
            React.createElement(View, { style: styles.scoreGrid },
                ...Object.entries(data.riasecScores).map(([code, score]) =>
                    React.createElement(View, { style: styles.scoreItem, key: code },
                        React.createElement(Text, { style: styles.scoreName }, `${RIASEC_FULL_NAMES[code] || code} (${code})`),
                        React.createElement(Text, { style: styles.scoreValue }, `${score}/8`)
                    )
                )
            ),
            ai?.riasecAnalysis && React.createElement(Text, { style: { ...body, marginTop: 6 } }, ai.riasecAnalysis)
        ),
        // Personality Traits
        data.personalityScores && React.createElement(View, { style: styles.section },
            React.createElement(Text, { style: styles.sectionTitle }, '5. Personality Traits'),
            React.createElement(View, { style: styles.scoreGrid },
                ...Object.entries(data.personalityScores).map(([trait, info]) =>
                    React.createElement(View, { style: styles.scoreItem, key: trait },
                        React.createElement(Text, { style: styles.scoreName }, trait),
                        React.createElement(Text, { style: styles.scoreValue }, `${info.score}/${info.maxScore} — ${info.level}`)
                    )
                )
            ),
            ai?.personalityAnalysis && React.createElement(Text, { style: { ...body, marginTop: 6 } }, ai.personalityAnalysis)
        ),
        // Readiness Scores
        data.readinessScores && React.createElement(View, { style: styles.section },
            React.createElement(Text, { style: styles.sectionTitle }, '6. Skill & Career Readiness'),
            React.createElement(View, { style: styles.scoreGrid },
                ...Object.entries(data.readinessScores)
                    .filter(([key]) => key !== 'overall')
                    .map(([section, info]) =>
                        React.createElement(View, { style: styles.scoreItem, key: section },
                            React.createElement(Text, { style: styles.scoreName }, section),
                            React.createElement(Text, { style: styles.scoreValue }, `${info.score}/${info.maxScore} (${Math.round(info.percentage)}%)`)
                        )
                    )
            ),
            ai?.readinessAnalysis && React.createElement(Text, { style: { ...body, marginTop: 6 } }, ai.readinessAnalysis)
        ),
        // Strengths & Growth
        React.createElement(View, { style: styles.section },
            React.createElement(Text, { style: styles.sectionTitle }, '7. Strengths & Growth Areas'),
            data.topStrengths.length > 0 && React.createElement(View, { style: { marginBottom: 8 } },
                React.createElement(Text, { style: { ...label, color: '#0e6957' } }, 'Top Strengths:'),
                ...data.topStrengths.map((s, i) =>
                    React.createElement(Text, { style: { fontSize: 10, color: '#2d4a44', paddingLeft: 10 }, key: `s-${i}` }, `• ${s}`)
                )
            ),
            data.areasForImprovement.length > 0 && React.createElement(View, {},
                React.createElement(Text, { style: { ...label, color: '#d97706' } }, 'Areas to Develop:'),
                ...data.areasForImprovement.map((a, i) =>
                    React.createElement(Text, { style: { fontSize: 10, color: '#2d4a44', paddingLeft: 10 }, key: `a-${i}` }, `• ${a}`)
                )
            )
        ),
        React.createElement(View, { style: styles.footer, fixed: true },
            React.createElement(Text, { style: styles.footerText }, 'PRAGYA 360° Student Career Report | Page 2 | Confidential')
        )
    );

    // Page 3: Career Guidance + Sectors + Study Tips + Next Steps
    const page3 = React.createElement(Page, { size: 'A4', style: styles.page },
        // Academic Streams
        academicStreams.length > 0 && React.createElement(View, { style: styles.section },
            React.createElement(Text, { style: styles.sectionTitle }, '8. Recommended Academic Streams'),
            ...academicStreams.map((stream, i) =>
                React.createElement(Text, { style: bullet, key: `stream-${i}` }, `• ${stream}`)
            ),
            ai?.academicStreams && typeof ai.academicStreams === 'object' && 'reasoning' in ai.academicStreams && ai.academicStreams.reasoning &&
                React.createElement(Text, { style: { ...body, marginTop: 4 } }, ai.academicStreams.reasoning)
        ),
        // Career Guidance
        (suggestedCareers.length > 0 || careerGuidanceText) && React.createElement(View, { style: styles.section },
            React.createElement(Text, { style: styles.sectionTitle }, '9. Career Guidance'),
            careerGuidanceText && React.createElement(Text, { style: body }, careerGuidanceText),
            suggestedCareers.length > 0 && React.createElement(View, { style: { marginBottom: 8 } },
                React.createElement(Text, { style: label }, 'Suggested Careers:'),
                ...suggestedCareers.map((c, i) =>
                    React.createElement(View, { style: { marginBottom: 4, paddingLeft: 10 }, key: `c-${i}` },
                        React.createElement(Text, { style: { fontSize: 10, fontWeight: 'bold', color: '#2d4a44' } }, `• ${c.role}`),
                        c.fitReason && React.createElement(Text, { style: { fontSize: 9, color: '#4a7c72', paddingLeft: 12 } }, c.fitReason)
                    )
                )
            ),
            skillsToDevelop.length > 0 && React.createElement(View, {},
                React.createElement(Text, { style: label }, 'Skills to Develop:'),
                ...skillsToDevelop.map((s, i) =>
                    React.createElement(Text, { style: bullet, key: `sk-${i}` }, `• ${s}`)
                )
            )
        ),
        // Sector Recommendations
        ai?.sectorRecommendations?.topSectors && React.createElement(View, { style: styles.section },
            React.createElement(Text, { style: styles.sectionTitle }, '10. Sector Recommendations'),
            ...ai.sectorRecommendations.topSectors.map((s, i) =>
                React.createElement(Text, { style: bullet, key: `sec-${i}` }, `• ${s}`)
            ),
            ai.sectorRecommendations.reasoning &&
                React.createElement(Text, { style: { ...body, marginTop: 4 } }, ai.sectorRecommendations.reasoning)
        ),
        // Study Tips
        studyTips.length > 0 && React.createElement(View, { style: styles.section },
            React.createElement(Text, { style: styles.sectionTitle }, '11. Study Tips'),
            ...studyTips.map((tip, i) =>
                React.createElement(Text, { style: bullet, key: `tip-${i}` }, `• ${tip}`)
            )
        ),
        // Next Steps
        nextSteps.length > 0 && React.createElement(View, { style: styles.section },
            React.createElement(Text, { style: styles.sectionTitle }, '12. Recommended Next Steps'),
            ...nextSteps.map((step, i) =>
                React.createElement(Text, { style: bullet, key: `step-${i}` }, `${i + 1}. ${step}`)
            )
        ),
        React.createElement(View, { style: styles.footer, fixed: true },
            React.createElement(Text, { style: styles.footerText }, 'PRAGYA 360° Student Career Report | Page 3 | Confidential')
        )
    );

    return React.createElement(Document, {}, page1, page2, page3);
};

@Injectable()
export class ReportsService {
    private readonly reportsDir: string;

    constructor(
        private prisma: PrismaService,
        private logger: LoggerService,
        private aiAnalysisService: AiAnalysisService,
    ) {
        this.logger.setContext('ReportsService');
        this.reportsDir = path.join(process.cwd(), 'reports');
        if (!fs.existsSync(this.reportsDir)) {
            fs.mkdirSync(this.reportsDir, { recursive: true });
        }
    }

    async generateReport(userAssessmentId: string): Promise<string> {
        const assessment = await this.prisma.userAssessment.findUnique({
            where: { id: userAssessmentId },
            include: {
                user: {
                    include: {
                        jobSeekerProfile: true,
                        studentProfile: true,
                    },
                },
                assessment: true,
            },
        });

        if (!assessment) {
            throw new NotFoundException('Assessment not found');
        }

        const isStudentAssessment = assessment.assessment.allowedRoles.includes('STUDENT')
            && !assessment.assessment.allowedRoles.includes('JOB_SEEKER');

        let assessmentData = assessment as any;

        // Re-generate AI insights if they are stale (missing new comprehensive fields)
        const aiInsights = assessmentData.aiInsights as any;
        const isStaleJobSeekerAI = !isStudentAssessment && aiInsights && (
            !aiInsights.detailedTraitInterpretation ||
            !aiInsights.developmentRoadmap ||
            !aiInsights.employabilitySummary ||
            (aiInsights.employabilitySummary && aiInsights.employabilitySummary.length < 100)
        );
        // Student insights are stale if they lack sectorRecommendations (fallback-generated before Gemini fix)
        const isStaleStudentAI = isStudentAssessment && aiInsights && !aiInsights.sectorRecommendations;

        if (isStaleJobSeekerAI) {
            this.logger.log(`Detected stale AI insights for ${userAssessmentId}, regenerating comprehensive text...`);
            try {
                const scores = {
                    aptitudeScores: assessmentData.aptitudeScores || {},
                    riasec: assessmentData.riasecScores || { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 },
                    riasecCode: assessmentData.riasecCode || 'SCA',
                    employabilityScores: assessmentData.employabilityScores || {},
                    personalityScores: assessmentData.personalityScores || {},
                    clarityIndex: assessmentData.clarityIndex || 50,
                };
                const careers = (assessmentData.careerMatches || []) as { title: string; matchScore: number }[];
                const freshAI = this.aiAnalysisService.getFallbackAnalysis(scores as any, careers as any);
                await this.aiAnalysisService.saveAnalysis(userAssessmentId, freshAI);
                assessmentData = { ...assessmentData, aiInsights: freshAI };
                this.logger.log(`AI insights regenerated successfully for ${userAssessmentId}`);
            } catch (err) {
                this.logger.warn(`Failed to regenerate AI insights: ${err instanceof Error ? err.stack : err}`);
            }
        }

        if (isStaleStudentAI) {
            this.logger.log(`Detected stale student AI insights for ${userAssessmentId}, regenerating with Gemini...`);
            try {
                const studentProfile = assessment.user.studentProfile;
                const freshAI = await this.aiAnalysisService.generateStudentAnalysis(
                    {
                        fullName: studentProfile?.fullName || 'Student',
                        grade: studentProfile?.grade || undefined,
                        schoolName: studentProfile?.schoolName || undefined,
                        location: studentProfile?.location || undefined,
                    },
                    assessmentData.aptitudeScores || {},
                    assessmentData.riasecScores || {},
                    assessmentData.riasecCode || 'RIA',
                    assessmentData.personalityScores || {},
                    assessmentData.employabilityScores || {}, // readiness stored in employabilityScores
                );
                if (freshAI) {
                    await this.aiAnalysisService.saveStudentAnalysis(userAssessmentId, freshAI);
                    assessmentData = { ...assessmentData, aiInsights: freshAI };
                    this.logger.log(`Student AI insights regenerated successfully for ${userAssessmentId}`);
                }
            } catch (err) {
                this.logger.warn(`Failed to regenerate student AI insights: ${err instanceof Error ? err.stack : err}`);
            }
        }

        let pdfDocument: any;
        let reportName: string;

        if (isStudentAssessment) {
            const studentProfile = assessment.user.studentProfile;
            const studentReportData: StudentReportData = {
                studentName: studentProfile?.fullName || 'Student',
                grade: studentProfile?.grade || undefined,
                schoolName: studentProfile?.schoolName || undefined,
                gender: studentProfile?.gender || undefined,
                location: studentProfile?.location || undefined,
                assessmentDate: assessmentData.completedAt || new Date(),
                aptitudeScores: (assessmentData.aptitudeScores as Record<string, { correct: number; total: number; percentage: number }>) || {},
                weightedScore: assessmentData.totalScore || 0,
                performanceLevel: assessmentData.performanceLevel || 'AVERAGE',
                academicReadinessIndex: assessmentData.academicReadinessIndex || 50,
                topStrengths: assessmentData.topStrengths || [],
                areasForImprovement: assessmentData.areasForImprovement || [],
                riasecCode: assessmentData.riasecCode || undefined,
                riasecScores: (assessmentData.riasecScores as Record<string, number>) || undefined,
                personalityScores: (assessmentData.personalityScores as Record<string, { score: number; maxScore: number; level: string }>) || undefined,
                readinessScores: (assessmentData.employabilityScores as Record<string, { score: number; maxScore: number; percentage: number }>) || undefined,
                careerMatches: (assessmentData.careerMatches as { title: string; matchScore: number }[]) || undefined,
                sectorMatches: (assessmentData.sectorMatches as { name: string; matchScore: number }[]) || undefined,
                aiInsights: assessmentData.aiInsights as any,
            };

            pdfDocument = React.createElement(StudentReport, { data: studentReportData });
            reportName = studentReportData.studentName;
        } else {
            const profile = assessment.user.jobSeekerProfile;
            const reportData: ReportData = {
                candidateName: profile?.fullName || 'Candidate',
                age: profile?.dateOfBirth
                    ? Math.floor((Date.now() - new Date(profile.dateOfBirth).getTime()) / (365.25 * 24 * 60 * 60 * 1000))
                    : undefined,
                gender: profile?.gender || undefined,
                location: profile?.location || undefined,
                education: profile?.educationLevel || undefined,
                currentRole: profile?.currentStatus || undefined,
                assessmentDate: assessmentData.completedAt || new Date(),
                aptitudeScores: (assessmentData.aptitudeScores as Record<string, { percentage: number }>) || {},
                riasecScores: (assessmentData.riasecScores as any) || { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 },
                riasecCode: assessmentData.riasecCode || 'SCA',
                employabilityScores: (assessmentData.employabilityScores as Record<string, { percentage: number }>) || {},
                personalityScores: (assessmentData.personalityScores as Record<string, { average: number }>) || {},
                clarityIndex: assessmentData.clarityIndex || 50,
                aiInsights: assessmentData.aiInsights as any,
                careerMatches: (assessmentData.careerMatches as { title: string; matchScore: number }[]) || [],
                sectorMatches: assessmentData.sectorMatches as any,
            };

            pdfDocument = React.createElement(PragyaReport, { data: reportData });
            reportName = reportData.candidateName;
        }

        const startTime = Date.now();
        const reportType = isStudentAssessment ? 'student' : 'employability';
        const fileName = `pragya_${reportType}_report_${userAssessmentId}_${Date.now()}.pdf`;
        const filePath = path.join(this.reportsDir, fileName);

        await renderToFile(pdfDocument, filePath);

        const fileSize = fs.statSync(filePath).size;
        const duration = Date.now() - startTime;

        await this.prisma.userAssessment.update({
            where: { id: userAssessmentId },
            data: {
                reportUrl: filePath,
                reportGeneratedAt: new Date(),
            } as any,
        });

        this.logger.logBusinessEvent('PDF_REPORT_GENERATED', {
            userAssessmentId,
            reportType,
            name: reportName,
            filePath,
            fileSizeKB: Math.round(fileSize / 1024),
            duration: `${duration}ms`,
        });

        return filePath;
    }

    async getReportPath(userAssessmentId: string, userId: string): Promise<string> {
        const assessment = await this.prisma.userAssessment.findUnique({
            where: { id: userAssessmentId },
        });

        if (!assessment) {
            throw new NotFoundException('Assessment not found');
        }

        if (assessment.userId !== userId) {
            throw new NotFoundException('Assessment not found');
        }

        // Always generate a fresh report to ensure latest layout and AI text
        this.logger.log(`Generating fresh report for assessment ${userAssessmentId}`);
        return this.generateReport(userAssessmentId);
    }
}
