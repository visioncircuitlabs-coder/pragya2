import * as React from 'react';
import { Document, Page, Text, View } from '@react-pdf/renderer';
import {
    styles, COLORS, RIASEC_COLORS, RIASEC_NAMES,
    getClarityColor, stripEmoji, ReportData,
    getPageStyle,
} from './pdf-styles';
import {
    RadarChart, HorizontalBarChart, CircularProgress,
    ScoreRing, HollandCodeDisplay, MiniBar, PageFooter,
} from './pdf-charts';
import { t, type Lang } from './i18n';

const h = React.createElement;
const REPORT_TYPE = 'Employability Report';

// Section heading style override: always Nunito so headings stay in English on ML pages
const sectionTitleStyle = (lang: Lang) => lang === 'ml'
    ? { ...styles.sectionTitle, fontFamily: 'Nunito' }
    : styles.sectionTitle;
const pageTitleStyle = (lang: Lang) => lang === 'ml'
    ? { ...styles.pageTitle, fontFamily: 'Nunito' }
    : styles.pageTitle;

// ─── PAGE 1: Cover + Profile + Persona + Summary + Dimensions ────────────────
const JobSeekerPage1 = ({ data, lang = 'en' }: { data: ReportData; lang?: Lang }) => {
    const persona = data.aiInsights?.professionalPersona;
    const dims = data.aiInsights?.performanceDimensions;

    return h(Page, { size: 'A4', style: getPageStyle(lang) },
        // Header
        h(View, { style: styles.header },
            h(Text, { style: { ...styles.headerTitle, fontFamily: 'Nunito' } },
                'PRAGYA Employability Report'),
            h(Text, { style: styles.headerSubtitle },
                `${data.candidateName} | ${data.assessmentDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}`
            )
        ),

        // Professional Persona
        persona && h(View, { style: styles.personaCard },
            h(Text, { style: { ...styles.personaTitle, fontFamily: 'Nunito' } }, persona.title),
            h(Text, { style: styles.personaDesc },
                persona.description),
            h(Text, { style: { ...styles.personaSuperpower, fontFamily: 'Nunito' } }, `Superpower: ${persona.superpower}`)
        ),

        // Profile grid
        h(View, { style: { ...styles.section, paddingVertical: 8 } },
            h(Text, { style: sectionTitleStyle(lang) }, 'Candidate Profile'),
            h(View, { style: styles.profileGrid },
                h(View, { style: styles.profileItem },
                    h(Text, { style: styles.profileLabel }, 'Name:'),
                    h(Text, { style: styles.profileValue }, data.candidateName)
                ),
                ...(data.age ? [h(View, { style: styles.profileItem, key: 'age' },
                    h(Text, { style: styles.profileLabel }, 'Age:'),
                    h(Text, { style: styles.profileValue }, `${data.age} years`)
                )] : []),
                ...(data.gender ? [h(View, { style: styles.profileItem, key: 'gender' },
                    h(Text, { style: styles.profileLabel }, 'Gender:'),
                    h(Text, { style: styles.profileValue }, data.gender)
                )] : []),
                ...(data.location ? [h(View, { style: styles.profileItem, key: 'loc' },
                    h(Text, { style: styles.profileLabel }, 'Location:'),
                    h(Text, { style: styles.profileValue }, data.location)
                )] : []),
                ...(data.education ? [h(View, { style: styles.profileItem, key: 'edu' },
                    h(Text, { style: styles.profileLabel }, 'Education:'),
                    h(Text, { style: styles.profileValue }, data.education)
                )] : []),
                ...(data.currentRole ? [h(View, { style: styles.profileItem, key: 'role' },
                    h(Text, { style: styles.profileLabel }, 'Current Role:'),
                    h(Text, { style: styles.profileValue }, data.currentRole)
                )] : [])
            )
        ),

        // Performance Dimensions as circular progress indicators
        dims && h(View, { style: styles.section },
            h(Text, { style: sectionTitleStyle(lang) }, 'Performance Dimensions'),
            h(View, {
                style: {
                    flexDirection: 'row',
                    justifyContent: 'space-around',
                    flexWrap: 'wrap',
                    gap: 6,
                    marginTop: 4,
                }
            },
                ...Object.entries(dims).map(([key, dim]) =>
                    h(CircularProgress, {
                        key,
                        value: dim.score,
                        max: 10,
                        label: key.replace(/([A-Z])/g, ' $1').replace(/^./, (s: string) => s.toUpperCase()).trim(),
                        size: 55,
                    })
                )
            ),
            // Brief dim descriptions
            h(View, { style: { marginTop: 6 } },
                ...Object.entries(dims).slice(0, 3).map(([key, dim]) =>
                    h(View, { key, style: styles.dimensionRow },
                        h(Text, { style: styles.dimensionName },
                            key.replace(/([A-Z])/g, ' $1').replace(/^./, (s: string) => s.toUpperCase()).trim()
                        ),
                        h(Text, { style: styles.dimensionDesc }, dim.description)
                    )
                )
            )
        ),

        // Employability Summary
        data.aiInsights?.employabilitySummary && h(View, { style: styles.section },
            h(Text, { style: sectionTitleStyle(lang) }, 'Employability Profile'),
            h(Text, { style: styles.sectionContent },
                data.aiInsights.employabilitySummary)
        ),

        h(PageFooter, { reportType: REPORT_TYPE, lang })
    );
};

// ─── PAGE 2: Aptitude + RIASEC ───────────────────────────────────────────────
const JobSeekerPage2 = ({ data, lang = 'en' }: { data: ReportData; lang?: Lang }) => {
    const ai = data.aiInsights;

    // Aptitude bar data
    const aptitudeData = Object.entries(data.aptitudeScores || {}).map(([name, scores]) => ({
        name,
        value: Math.round(scores.percentage),
        max: 100,
    }));

    const aptitudeAnalysisText = ai?.aptitudeAnalysis || '';

    return h(Page, { size: 'A4', style: getPageStyle(lang) },
        h(Text, { style: pageTitleStyle(lang) }, 'Cognitive & Career Interests'),

        // Cognitive Aptitude
        h(View, { style: styles.section },
            h(Text, { style: sectionTitleStyle(lang) }, 'Cognitive Aptitude Analysis'),
            aptitudeAnalysisText && h(Text, { style: { ...styles.sectionContent, marginBottom: 6 } }, aptitudeAnalysisText),
            aptitudeData.length > 0 && h(HorizontalBarChart, { data: aptitudeData })
        ),

        // RIASEC
        h(View, { style: styles.section },
            h(Text, { style: sectionTitleStyle(lang) }, `Career Interest Profile (RIASEC \u2014 ${data.riasecCode})`),
            h(View, { style: { flexDirection: 'row', gap: 16, alignItems: 'flex-start' } },
                // Radar chart
                h(View, { style: { flex: 1, alignItems: 'center' } },
                    h(RadarChart, {
                        scores: data.riasecScores as Record<string, number>,
                        maxScore: 32,
                        size: 170,
                    })
                ),
                // Holland code + scores
                h(View, { style: { flex: 1 } },
                    h(Text, { style: { fontSize: 8, fontWeight: 600, color: COLORS.TEXT_MUTED, marginBottom: 4 } }, 'Your Holland Code:'),
                    h(HollandCodeDisplay, { code: data.riasecCode }),
                    h(View, { style: { marginTop: 8 } },
                        ...(['R', 'I', 'A', 'S', 'E', 'C'] as const).map(code =>
                            h(View, { key: code, style: { flexDirection: 'row', alignItems: 'center', marginBottom: 3, gap: 4 } },
                                h(View, { style: { width: 8, height: 8, borderRadius: 4, backgroundColor: RIASEC_COLORS[code] } }),
                                h(Text, { style: { fontSize: 8, color: COLORS.TEXT_BODY, flex: 1 } }, RIASEC_NAMES[code]),
                                h(Text, { style: { fontSize: 8, fontWeight: 700, color: COLORS.PRIMARY } },
                                    `${data.riasecScores[code]}/32`
                                )
                            )
                        )
                    )
                )
            ),
            h(Text, { style: { ...styles.sectionContent, marginTop: 8 } },
                ai?.careerInterestAlignment || '')
        ),

        h(PageFooter, { reportType: REPORT_TYPE, lang })
    );
};

// ─── PAGE 3: Personality + Employability Skills ──────────────────────────────
const JobSeekerPage3 = ({ data, lang = 'en' }: { data: ReportData; lang?: Lang }) => {
    const ai = data.aiInsights;

    // Personality circular data
    const personalityEntries = Object.entries(data.personalityScores || {});

    // Employability bar data
    const employabilityData = Object.entries(data.employabilityScores || {}).map(([name, scores]) => ({
        name,
        value: Math.round(scores.percentage),
        max: 100,
    }));

    return h(Page, { size: 'A4', style: getPageStyle(lang) },
        h(Text, { style: pageTitleStyle(lang) }, 'Personality & Employability'),

        // Personality Profile
        h(View, { style: styles.section },
            h(Text, { style: sectionTitleStyle(lang) }, 'Work Personality Profile'),
            h(View, {
                style: {
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    justifyContent: 'space-around',
                    gap: 8,
                    marginTop: 4,
                    marginBottom: 6,
                }
            },
                ...personalityEntries.map(([trait, scores]) => {
                    const pct = Math.round((scores.average / 5) * 100);
                    return h(CircularProgress, {
                        key: trait,
                        value: scores.average,
                        max: 5,
                        label: trait,
                        size: 55,
                    });
                })
            ),
            h(Text, { style: styles.sectionContent },
                ai?.personalitySnapshot || '')
        ),

        // Detailed Trait Interpretations
        ai?.detailedTraitInterpretation && h(View, { style: styles.section },
            h(Text, { style: sectionTitleStyle(lang) }, 'Detailed Trait Analysis'),
            ...Object.entries(ai.detailedTraitInterpretation).map(([trait, interpretation]) =>
                h(View, { style: styles.traitRow, key: trait },
                    h(Text, { style: styles.traitName }, trait),
                    h(Text, { style: styles.traitInterpretation }, interpretation)
                )
            )
        ),

        // Employability Skills
        h(View, { style: styles.section },
            h(Text, { style: sectionTitleStyle(lang) }, 'Employability Skill Readiness'),
            h(Text, { style: { ...styles.sectionContent, marginBottom: 6 } },
                ai?.skillReadiness || ''),
            employabilityData.length > 0 && h(HorizontalBarChart, { data: employabilityData })
        ),

        h(PageFooter, { reportType: REPORT_TYPE, lang })
    );
};

// ─── PAGE 4: Sector Analysis ─────────────────────────────────────────────────
const JobSeekerPage4 = ({ data, lang = 'en' }: { data: ReportData; lang?: Lang }) => {
    const ai = data.aiInsights;
    const sectors = data.sectorMatches || [];

    return h(Page, { size: 'A4', style: getPageStyle(lang) },
        h(Text, { style: pageTitleStyle(lang) }, 'Industry Sector Analysis'),

        // Top Sectors
        sectors.length > 0 && h(View, { style: styles.section },
            h(Text, { style: sectionTitleStyle(lang) }, 'Top Industry Sectors'),
            ...sectors.slice(0, 5).map((sector, i) =>
                h(View, { style: styles.sectorCard, key: sector.id || `s-${i}` },
                    h(View, { style: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 } },
                        h(Text, { style: styles.sectorName }, stripEmoji(sector.name)),
                        h(View, { style: { backgroundColor: COLORS.PRIMARY, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10 } },
                            h(Text, { style: { fontSize: 9, fontWeight: 700, color: '#FFFFFF' } }, `${sector.matchScore}%`)
                        )
                    ),
                    // 4 mini bars
                    h(View, { style: { flexDirection: 'row', gap: 8, marginBottom: 4 } },
                        h(View, { style: { flex: 1 } },
                            h(MiniBar, { label: 'Interest', value: sector.riasecFit }),
                            h(MiniBar, { label: 'Aptitude', value: sector.aptitudeFit })
                        ),
                        h(View, { style: { flex: 1 } },
                            h(MiniBar, { label: 'Personality', value: sector.personalityFit }),
                            h(MiniBar, { label: 'Readiness', value: sector.employabilityFit })
                        )
                    ),
                    // Example roles as chips
                    h(View, { style: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 2 } },
                        ...sector.exampleRoles.slice(0, 4).map(role =>
                            h(Text, { style: styles.chip, key: role }, role)
                        )
                    ),
                    h(Text, { style: styles.sectorDetail },
                        `${sector.readinessLevel} | Growth: ${sector.growthOutlook} | Salary: ${sector.avgSalaryRange}`
                    )
                )
            )
        ),

        // AI Sector Recommendations
        ai?.sectorRecommendations && h(View, { style: styles.section },
            h(Text, { style: sectionTitleStyle(lang) }, 'AI Sector Guidance'),
            // Primary
            h(Text, { style: { fontSize: 9, fontWeight: 700, color: COLORS.PRIMARY, marginBottom: 3 } }, 'Primary Sectors:'),
            ...(ai.sectorRecommendations.primarySectors || []).map((sector, i) =>
                h(View, { style: { marginBottom: 3, paddingLeft: 4 }, key: `ps-${i}` },
                    h(Text, { style: { fontSize: 8, fontWeight: 700, color: COLORS.TEXT_DARK } }, `\u2022 ${sector.name}`),
                    h(Text, { style: { fontSize: 7, color: COLORS.TEXT_MUTED, paddingLeft: 10 } }, sector.explanation)
                )
            ),
            // Growth
            h(Text, { style: { fontSize: 9, fontWeight: 700, color: COLORS.ACCENT, marginTop: 4, marginBottom: 3 } }, 'Growth Sectors:'),
            ...(ai.sectorRecommendations.growthSectors || []).map((sector, i) =>
                h(Text, { style: { fontSize: 8, color: COLORS.TEXT_BODY, paddingLeft: 4, marginBottom: 2 }, key: `gs-${i}` },
                    `\u2022 ${sector.name} \u2014 ${sector.explanation}`
                )
            ),
            ai.sectorRecommendations.sectorsToAvoid &&
                h(Text, { style: { ...styles.sectionContent, marginTop: 4, fontStyle: 'italic', fontSize: 8 } },
                    `Note: ${ai.sectorRecommendations.sectorsToAvoid}`
                )
        ),

        h(PageFooter, { reportType: REPORT_TYPE, lang })
    );
};

// ─── PAGE 5: Career Guidance + Clarity Index + Key Takeaways ────────────────
const JobSeekerPage5 = ({ data, lang = 'en' }: { data: ReportData; lang?: Lang }) => {
    const ai = data.aiInsights;
    const clarityLevel = ai?.clarityIndex?.level ||
        (data.clarityIndex >= 70 ? 'HIGH' : data.clarityIndex >= 40 ? 'MEDIUM' : 'LOW');

    return h(Page, { size: 'A4', style: getPageStyle(lang) },
        h(Text, { style: pageTitleStyle(lang) }, 'Career Guidance & Clarity'),

        // Career Roles — two columns
        h(View, { style: styles.section },
            h(Text, { style: sectionTitleStyle(lang) }, 'Best-Fit Career Roles'),
            h(View, { style: styles.twoCol },
                // Primary Fit
                h(View, { style: styles.col },
                    h(Text, { style: { fontSize: 9, fontWeight: 700, color: COLORS.PRIMARY, marginBottom: 4 } }, 'Primary Fit'),
                    ...(ai?.careerRecommendations?.primaryRoles || data.careerMatches.slice(0, 4).map(c => c.title)).map((role, i) =>
                        h(View, { key: `pr-${i}`, style: styles.strengthItem },
                            h(Text, { style: { ...styles.strengthDot, color: COLORS.SUCCESS } }, '\u2022'),
                            h(Text, { style: styles.strengthText }, role)
                        )
                    )
                ),
                // Growth Roles
                h(View, { style: styles.col },
                    h(Text, { style: { fontSize: 9, fontWeight: 700, color: COLORS.ACCENT, marginBottom: 4 } }, 'Growth Roles'),
                    ...(ai?.careerRecommendations?.growthRoles || data.careerMatches.slice(4, 7).map(c => c.title)).map((role, i) =>
                        h(View, { key: `gr-${i}`, style: styles.strengthItem },
                            h(Text, { style: { ...styles.strengthDot, color: COLORS.ACCENT } }, '\u2022'),
                            h(Text, { style: styles.strengthText }, role)
                        )
                    )
                )
            ),
            ai?.careerRecommendations?.rolesToAvoid &&
                h(Text, { style: { ...styles.sectionContent, marginTop: 4, fontStyle: 'italic', fontSize: 8 } },
                    `Note: ${ai.careerRecommendations.rolesToAvoid}`
                )
        ),

        // Career Direction Clarity
        h(View, { style: styles.section },
            h(Text, { style: sectionTitleStyle(lang) }, 'Career Direction Clarity'),
            h(View, { style: { flexDirection: 'row', alignItems: 'center', gap: 12 } },
                h(ScoreRing, {
                    value: data.clarityIndex,
                    max: 100,
                    label: 'Clarity Index',
                    color: getClarityColor(clarityLevel),
                    size: 70,
                }),
                h(View, { style: { flex: 1 } },
                    h(View, {
                        style: {
                            backgroundColor: getClarityColor(clarityLevel),
                            paddingHorizontal: 10,
                            paddingVertical: 4,
                            borderRadius: 4,
                            alignSelf: 'flex-start',
                            marginBottom: 4,
                        }
                    },
                        h(Text, { style: { fontSize: 10, fontWeight: 700, color: '#FFFFFF' } }, clarityLevel)
                    ),
                    h(Text, { style: styles.sectionContent },
                        ai?.clarityIndex?.justification || '')
                )
            )
        ),

        // Composite Score breakdown
        h(View, { style: styles.section },
            h(Text, { style: sectionTitleStyle(lang) }, 'Composite Score Overview'),
            h(View, { style: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 4 } },
                h(ScoreRing, {
                    value: Math.round(Object.values(data.aptitudeScores).reduce((s, v) => s + v.percentage, 0) / Math.max(1, Object.keys(data.aptitudeScores).length)),
                    max: 100,
                    label: 'Avg Aptitude',
                    size: 60,
                }),
                h(ScoreRing, {
                    value: Math.round(Object.values(data.employabilityScores).reduce((s, v) => s + v.percentage, 0) / Math.max(1, Object.keys(data.employabilityScores).length)),
                    max: 100,
                    label: 'Avg Employability',
                    size: 60,
                }),
                h(ScoreRing, {
                    value: Math.round((Object.values(data.personalityScores).reduce((s, v) => s + v.average, 0) / Math.max(1, Object.keys(data.personalityScores).length)) * 20),
                    max: 100,
                    label: 'Avg Personality',
                    size: 60,
                }),
                h(ScoreRing, {
                    value: data.clarityIndex,
                    max: 100,
                    label: 'Clarity',
                    color: getClarityColor(clarityLevel),
                    size: 60,
                })
            )
        ),

        // Key takeaways summary
        h(View, { style: styles.section },
            h(Text, { style: sectionTitleStyle(lang) }, 'Key Takeaways'),
            h(View, { style: styles.twoCol },
                h(View, { style: styles.col },
                    h(Text, { style: { fontSize: 9, fontWeight: 700, color: COLORS.PRIMARY, marginBottom: 4 } }, 'Your Strengths'),
                    h(Text, { style: { fontSize: 8, color: COLORS.TEXT_BODY, lineHeight: 1.4 } },
                        `Holland Code: ${data.riasecCode} (${data.riasecCode.split('').map(c => RIASEC_NAMES[c] || c).join(', ')})`
                    ),
                    h(Text, { style: { fontSize: 8, color: COLORS.TEXT_BODY, lineHeight: 1.4 } },
                        `Clarity Index: ${data.clarityIndex}/100`
                    ),
                    ...Object.entries(data.aptitudeScores)
                        .sort((a, b) => b[1].percentage - a[1].percentage)
                        .slice(0, 3)
                        .map(([name, score], i) =>
                            h(Text, { key: `apt-${i}`, style: { fontSize: 8, color: COLORS.TEXT_BODY, lineHeight: 1.4 } },
                                `${name}: ${Math.round(score.percentage)}%`
                            )
                        )
                ),
                h(View, { style: styles.col },
                    h(Text, { style: { fontSize: 9, fontWeight: 700, color: COLORS.ACCENT, marginBottom: 4 } }, 'Focus Areas'),
                    ...Object.entries(data.aptitudeScores)
                        .sort((a, b) => a[1].percentage - b[1].percentage)
                        .slice(0, 3)
                        .map(([name, score], i) =>
                            h(Text, { key: `low-${i}`, style: { fontSize: 8, color: COLORS.TEXT_BODY, lineHeight: 1.4 } },
                                `${name}: ${Math.round(score.percentage)}%`
                            )
                        )
                )
            )
        ),

        // Disclaimer
        h(View, { style: styles.disclaimer },
            h(Text, { style: styles.disclaimerTitle }, t('disclaimer_title', lang)),
            h(Text, { style: styles.disclaimerText }, t('disclaimer_jobseeker', lang))
        ),

        // Branding
        h(View, { style: { marginTop: 'auto', alignItems: 'center', paddingTop: 12 } },
            h(Text, { style: { fontSize: 11, fontWeight: 700, color: COLORS.PRIMARY, marginBottom: 2, fontFamily: 'Nunito' } }, 'PRAGYA'),
            h(Text, { style: { fontSize: 7, color: COLORS.TEXT_MUTED } }, t('ecosystem_tagline', lang)),
            h(Text, { style: { fontSize: 7, color: COLORS.TEXT_MUTED, marginTop: 2 } }, t('powered_by', lang))
        ),

        h(PageFooter, { reportType: REPORT_TYPE, lang })
    );
};

// ─── MAIN DOCUMENT ───────────────────────────────────────────────────────────
export const JobSeekerReportDocument = ({ data }: { data: ReportData }) => {
    return h(Document, {},
        h(JobSeekerPage1, { data, lang: 'en' }),
        h(JobSeekerPage2, { data, lang: 'en' }),
        h(JobSeekerPage3, { data, lang: 'en' }),
        h(JobSeekerPage4, { data, lang: 'en' }),
        h(JobSeekerPage5, { data, lang: 'en' }),
    );
};
