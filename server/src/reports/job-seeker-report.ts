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
import { t, aiText, type Lang } from './i18n';

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
                'PRAGYA Employability Report',
                lang === 'ml' ? h(Text, { style: { fontFamily: 'NotoSansMalayalam', fontSize: 16 } }, ' (\u0D2E\u0D32\u0D2F\u0D3E\u0D33\u0D02)') : null),
            h(Text, { style: styles.headerSubtitle },
                `${data.candidateName} | ${data.assessmentDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}`
            )
        ),

        // Professional Persona
        persona && h(View, { style: styles.personaCard },
            h(Text, { style: { ...styles.personaTitle, fontFamily: 'Nunito' } }, persona.title),
            h(Text, { style: styles.personaDesc },
                (lang === 'ml' ? aiText(data.aiInsights as any, 'professionalPersona_description', lang) : '') || persona.description),
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
                (lang === 'ml' ? aiText(data.aiInsights as any, 'employabilitySummary', lang) : '') || data.aiInsights.employabilitySummary)
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

    const aptitudeAnalysisText = (lang === 'ml' ? aiText(ai as any, 'aptitudeAnalysis', lang) : '') || ai?.aptitudeAnalysis || '';

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
                (lang === 'ml' ? aiText(ai as any, 'careerInterestAlignment', lang) : '') || ai?.careerInterestAlignment || '')
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
                (lang === 'ml' ? aiText(ai as any, 'personalitySnapshot', lang) : '') || ai?.personalitySnapshot || '')
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
                (lang === 'ml' ? aiText(ai as any, 'skillReadiness', lang) : '') || ai?.skillReadiness || ''),
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

// ─── PAGE 5: Career Guidance + Clarity Index ─────────────────────────────────
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
                        (lang === 'ml' ? aiText(ai as any, 'clarityIndex_justification', lang) : '') || ai?.clarityIndex?.justification || '')
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

        h(PageFooter, { reportType: REPORT_TYPE, lang })
    );
};

// ─── PAGE 6: Development Roadmap + Disclaimer ───────────────────────────────
const JobSeekerPage6 = ({ data, lang = 'en' }: { data: ReportData; lang?: Lang }) => {
    const ai = data.aiInsights;
    const roadmapText = (lang === 'ml' ? aiText(ai as any, 'developmentRoadmap', lang) : '') || ai?.developmentRoadmap || ai?.developmentGuidance || '';

    // Try to parse roadmap into phases
    const phases = parseRoadmapPhases(roadmapText);

    return h(Page, { size: 'A4', style: getPageStyle(lang) },
        h(Text, { style: pageTitleStyle(lang) }, 'Development Roadmap'),

        // Structured roadmap
        phases.length > 0
            ? h(View, { style: styles.section },
                h(Text, { style: sectionTitleStyle(lang) }, 'Your Development Timeline'),
                ...phases.map((phase, i) =>
                    h(View, { key: `phase-${i}`, style: styles.roadmapPhase },
                        h(Text, { style: styles.roadmapTitle }, phase.title),
                        ...phase.items.map((item, j) =>
                            h(View, { key: `item-${j}`, style: styles.actionItem },
                                h(Text, { style: styles.actionNumber }, `${j + 1}.`),
                                h(Text, { style: styles.actionText }, item)
                            )
                        )
                    )
                )
            )
            : roadmapText && h(View, { style: styles.section },
                h(Text, { style: sectionTitleStyle(lang) }, 'Development Guidance'),
                h(Text, { style: styles.sectionContent }, roadmapText)
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
                    // Top scoring aptitude areas
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
                    // Bottom scoring aptitude areas
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

// ─── Roadmap text parser ─────────────────────────────────────────────────────
function parseRoadmapPhases(text: string): { title: string; items: string[] }[] {
    if (!text) return [];

    const phases: { title: string; items: string[] }[] = [];

    // Try to split by phase markers like "Immediate", "Short-term", "Medium-term"
    const phasePatterns = [
        /(?:immediate|phase\s*1|1-3\s*months?)/i,
        /(?:short[\s-]*term|phase\s*2|3-6\s*months?)/i,
        /(?:medium[\s-]*term|phase\s*3|6-12\s*months?|long[\s-]*term)/i,
    ];
    const phaseNames = [
        'Immediate (1-3 months)',
        'Short-term (3-6 months)',
        'Medium-term (6-12 months)',
    ];

    // Split into lines and try to group
    const lines = text.split('\n').map(l => l.trim()).filter(Boolean);

    let currentPhase = -1;
    for (const line of lines) {
        // Check if this line is a phase header
        let matched = false;
        for (let i = 0; i < phasePatterns.length; i++) {
            if (phasePatterns[i].test(line)) {
                currentPhase = i;
                if (!phases[currentPhase]) {
                    phases[currentPhase] = { title: phaseNames[i], items: [] };
                }
                matched = true;
                break;
            }
        }
        if (!matched && currentPhase >= 0) {
            const cleaned = line.replace(/^[-*\u2022\d+.)\s]+/, '').trim();
            if (cleaned) {
                phases[currentPhase].items.push(cleaned);
            }
        }
    }

    // If no phases detected, create a single "Action Items" phase
    if (phases.length === 0 && lines.length > 0) {
        const items = lines
            .map(l => l.replace(/^[-*\u2022\d+.)\s]+/, '').trim())
            .filter(Boolean);
        if (items.length > 0) {
            phases.push({ title: 'Action Items', items });
        }
    }

    return phases.filter(Boolean);
}

// ─── MALAYALAM COVER PAGE ────────────────────────────────────────────────────
const JobSeekerMalayalamCoverPage = ({ data }: { data: ReportData }) => {
    const ai = data.aiInsights;
    const personalityAverages = Object.values(data.personalityScores).map((p: any) => p.average || 0);
    const avgPersonality = personalityAverages.length > 0
        ? personalityAverages.reduce((a, b) => a + b, 0) / personalityAverages.length
        : 0;
    const personalityPct = Math.round(((avgPersonality - 1) / 4) * 100);
    const avgApt = Math.round(Object.values(data.aptitudeScores).reduce((s, v) => s + v.percentage, 0) / Math.max(1, Object.keys(data.aptitudeScores).length));
    const avgEmp = Math.round(Object.values(data.employabilityScores).reduce((s, v) => s + v.percentage, 0) / Math.max(1, Object.keys(data.employabilityScores).length));
    const clarityLevel = ai?.clarityIndex?.level ||
        (data.clarityIndex >= 70 ? 'HIGH' : data.clarityIndex >= 40 ? 'MEDIUM' : 'LOW');

    return h(Page, { size: 'A4', style: getPageStyle('ml') },
        // Header
        h(View, { style: styles.header },
            h(Text, { style: { ...styles.headerTitle, fontFamily: 'Nunito' } },
                'PRAGYA ',
                h(Text, { style: { fontFamily: 'NotoSansMalayalam', fontSize: 16 } },
                    '\u0D24\u0D4A\u0D34\u0D3F\u0D7D \u0D38\u0D28\u0D4D\u0D28\u0D26\u0D4D\u0D27\u0D24\u0D3E \u0D31\u0D3F\u0D2A\u0D4D\u0D2A\u0D4B\u0D7C\u0D1F\u0D4D\u0D1F\u0D4D')
            ),
            h(Text, { style: { ...styles.headerSubtitle, fontFamily: 'NotoSansMalayalam' } },
                `${data.assessmentDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })} \u0D28\u0D4D \u0D24\u0D2F\u0D4D\u0D2F\u0D3E\u0D31\u0D3E\u0D15\u0D4D\u0D15\u0D3F\u0D2F\u0D24\u0D4D`
            )
        ),

        // Persona card with title_ml
        ai?.title_ml && h(View, { style: styles.personaCard },
            h(Text, { style: { ...styles.personaTitle, fontFamily: 'NotoSansMalayalam', fontSize: 13 } }, ai.title_ml)
        ),

        // Profile card
        h(View, { style: { ...styles.section, paddingVertical: 8 } },
            h(Text, { style: { ...styles.sectionTitle, fontFamily: 'NotoSansMalayalam' } }, '\u0D2A\u0D4D\u0D30\u0D4A\u0D2B\u0D48\u0D7D'),
            h(View, { style: styles.profileGrid },
                h(View, { style: styles.profileItem },
                    h(Text, { style: { ...styles.profileLabel, fontFamily: 'NotoSansMalayalam' } }, t('label_name', 'ml')),
                    h(Text, { style: styles.profileValue }, data.candidateName)
                ),
                ...(data.age ? [h(View, { style: styles.profileItem, key: 'age' },
                    h(Text, { style: { ...styles.profileLabel, fontFamily: 'NotoSansMalayalam' } }, '\u0D2A\u0D4D\u0D30\u0D3E\u0D2F\u0D02:'),
                    h(Text, { style: styles.profileValue }, `${data.age}`)
                )] : []),
                ...(data.education ? [h(View, { style: styles.profileItem, key: 'edu' },
                    h(Text, { style: { ...styles.profileLabel, fontFamily: 'NotoSansMalayalam' } }, '\u0D35\u0D3F\u0D26\u0D4D\u0D2F\u0D3E\u0D2D\u0D4D\u0D2F\u0D3E\u0D38\u0D02:'),
                    h(Text, { style: styles.profileValue }, data.education)
                )] : []),
                ...(data.location ? [h(View, { style: styles.profileItem, key: 'loc' },
                    h(Text, { style: { ...styles.profileLabel, fontFamily: 'NotoSansMalayalam' } }, t('label_location', 'ml')),
                    h(Text, { style: styles.profileValue }, data.location)
                )] : []),
                ...(data.riasecCode ? [h(View, { style: styles.profileItem, key: 'holland' },
                    h(Text, { style: { ...styles.profileLabel, fontFamily: 'NotoSansMalayalam' } }, t('label_holland_code', 'ml')),
                    h(Text, { style: styles.profileValue },
                        `${data.riasecCode} (${data.riasecCode.split('').map(c => RIASEC_NAMES[c] || c).join('-')})`
                    )
                )] : []),
            )
        ),

        // Performance Overview Rings
        h(View, { style: { ...styles.section, padding: 10 } },
            h(Text, { style: { ...styles.sectionTitle, fontFamily: 'NotoSansMalayalam' } }, t('performance_overview', 'ml')),
            h(View, { style: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'flex-start', marginTop: 2 } },
                h(ScoreRing, { value: avgApt, max: 100, label: t('label_aptitude', 'ml') }),
                h(ScoreRing, { value: avgEmp, max: 100, label: '\u0D24\u0D4A\u0D34\u0D3F\u0D7D \u0D38\u0D28\u0D4D\u0D28\u0D26\u0D4D\u0D27\u0D24' }),
                h(ScoreRing, { value: Math.round(personalityPct), max: 100, label: '\u0D35\u0D4D\u0D2F\u0D15\u0D4D\u0D24\u0D3F\u0D24\u0D4D\u0D35\u0D02' }),
                h(ScoreRing, {
                    value: data.clarityIndex,
                    max: 100,
                    label: '\u0D38\u0D4D\u0D2A\u0D37\u0D4D\u0D1F\u0D24',
                    color: getClarityColor(clarityLevel),
                })
            )
        ),

        // Holland Code display
        data.riasecCode && h(View, { style: { ...styles.section, padding: 8 } },
            h(Text, { style: { ...styles.sectionTitle, fontFamily: 'NotoSansMalayalam' } }, t('label_holland_code', 'ml')),
            h(HollandCodeDisplay, { code: data.riasecCode })
        ),

        h(PageFooter, { reportType: REPORT_TYPE, lang: 'ml' })
    );
};

// ─── MALAYALAM ANALYSIS PAGES ───────────────────────────────────────────────
const parseMalayalamSections = (text: string): { header: string; body: string }[] => {
    if (!text) return [];
    const parts = text.split(/\n*\*\*([^*]+)\*\*\n*/);
    const sections: { header: string; body: string }[] = [];
    for (let i = 1; i < parts.length; i += 2) {
        const header = parts[i]?.trim();
        const body = parts[i + 1]?.trim();
        if (header && body) {
            sections.push({ header, body });
        }
    }
    return sections;
};

const JobSeekerMalayalamAnalysisPages = ({ data }: { data: ReportData }): React.ReactElement[] => {
    const ai = data.aiInsights;
    const analysisMl = ai?.analysis_ml || '';
    const sections = parseMalayalamSections(analysisMl);

    if (sections.length === 0) {
        return [
            h(Page, { key: 'ml-analysis-1', size: 'A4', style: getPageStyle('ml') },
                h(Text, { style: { ...styles.pageTitle, fontFamily: 'NotoSansMalayalam', textTransform: 'none' } },
                    '\u0D15\u0D30\u0D3F\u0D2F\u0D7C \u0D35\u0D3F\u0D36\u0D15\u0D32\u0D28\u0D02'),
                h(View, { style: styles.section },
                    h(Text, { style: { ...styles.sectionContent, fontFamily: 'NotoSansMalayalam' } },
                        '\u0D2E\u0D32\u0D2F\u0D3E\u0D33\u0D02 \u0D35\u0D3F\u0D36\u0D15\u0D32\u0D28\u0D02 \u0D32\u0D2D\u0D4D\u0D2F\u0D2E\u0D32\u0D4D\u0D32. \u0D26\u0D2F\u0D35\u0D3E\u0D2F\u0D3F \u0D07\u0D02\u0D17\u0D4D\u0D32\u0D40\u0D37\u0D4D \u0D2A\u0D24\u0D3F\u0D2A\u0D4D\u0D2A\u0D4D \u0D2A\u0D30\u0D3F\u0D36\u0D4B\u0D27\u0D3F\u0D15\u0D4D\u0D15\u0D41\u0D15.')
                ),
                h(PageFooter, { reportType: REPORT_TYPE, lang: 'ml' })
            ),
        ];
    }

    const midpoint = Math.ceil(sections.length / 2);
    const page1Sections = sections.slice(0, midpoint);
    const page2Sections = sections.slice(midpoint);

    const renderSections = (secs: { header: string; body: string }[]) =>
        secs.map((sec, i) =>
            h(View, { key: `ml-sec-${i}`, style: { ...styles.section, marginBottom: 6 } },
                h(Text, { style: { ...styles.sectionTitle, fontFamily: 'NotoSansMalayalam', fontSize: 11, textTransform: 'none' } }, sec.header),
                ...sec.body.split('\n').map((para, pi) =>
                    h(Text, {
                        key: `ml-p-${i}-${pi}`,
                        style: {
                            fontSize: 9,
                            lineHeight: 1.4,
                            color: COLORS.TEXT_BODY,
                            fontFamily: 'NotoSansMalayalam',
                            marginBottom: 3,
                        },
                    }, para.trim())
                )
            )
        );

    const pages: React.ReactElement[] = [];

    pages.push(
        h(Page, { key: 'ml-analysis-1', size: 'A4', style: getPageStyle('ml') },
            h(Text, { style: { ...styles.pageTitle, fontFamily: 'NotoSansMalayalam', textTransform: 'none' } },
                '\u0D15\u0D30\u0D3F\u0D2F\u0D7C \u0D35\u0D3F\u0D36\u0D15\u0D32\u0D28\u0D02'),
            ...renderSections(page1Sections),
            h(PageFooter, { reportType: REPORT_TYPE, lang: 'ml' })
        )
    );

    if (page2Sections.length > 0) {
        pages.push(
            h(Page, { key: 'ml-analysis-2', size: 'A4', style: getPageStyle('ml') },
                h(Text, { style: { ...styles.pageTitle, fontFamily: 'NotoSansMalayalam', textTransform: 'none' } },
                    '\u0D15\u0D30\u0D3F\u0D2F\u0D7C \u0D35\u0D3F\u0D36\u0D15\u0D32\u0D28\u0D02 (\u0D24\u0D41\u0D1F\u0D7C\u0D1A\u0D4D\u0D1A)'),
                ...renderSections(page2Sections),

                // Disclaimer
                h(View, { style: { ...styles.disclaimer, marginTop: 8 } },
                    h(Text, { style: { ...styles.disclaimerTitle, fontFamily: 'NotoSansMalayalam' } }, t('disclaimer_title', 'ml')),
                    h(Text, { style: { ...styles.disclaimerText, fontFamily: 'NotoSansMalayalam' } }, t('disclaimer_jobseeker', 'ml'))
                ),

                // Branding footer
                h(View, { style: { marginTop: 'auto', alignItems: 'center', paddingTop: 8 } },
                    h(Text, { style: { fontSize: 11, fontWeight: 700, color: COLORS.PRIMARY, marginBottom: 2, fontFamily: 'Nunito' } }, 'PRAGYA'),
                    h(Text, { style: { fontSize: 7, color: COLORS.TEXT_MUTED, fontFamily: 'NotoSansMalayalam' } }, t('ecosystem_tagline', 'ml')),
                    h(Text, { style: { fontSize: 7, color: COLORS.TEXT_MUTED, fontFamily: 'NotoSansMalayalam', marginTop: 2 } }, t('powered_by', 'ml'))
                ),

                h(PageFooter, { reportType: REPORT_TYPE, lang: 'ml' })
            )
        );
    }

    return pages;
};

// ─── MAIN DOCUMENT ───────────────────────────────────────────────────────────
export const JobSeekerReportDocument = ({ data }: { data: ReportData }) => {
    return h(Document, {},
        // English pages (1-6)
        h(JobSeekerPage1, { data, lang: 'en' }),
        h(JobSeekerPage2, { data, lang: 'en' }),
        h(JobSeekerPage3, { data, lang: 'en' }),
        h(JobSeekerPage4, { data, lang: 'en' }),
        h(JobSeekerPage5, { data, lang: 'en' }),
        h(JobSeekerPage6, { data, lang: 'en' }),
        // Malayalam pages (cover + 1-2 analysis pages)
        h(JobSeekerMalayalamCoverPage, { data }),
        ...JobSeekerMalayalamAnalysisPages({ data }),
    );
};
