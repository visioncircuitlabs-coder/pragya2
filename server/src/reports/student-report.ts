import * as React from 'react';
import { Document, Page, Text, View } from '@react-pdf/renderer';
import {
    styles, COLORS, RIASEC_COLORS, RIASEC_NAMES,
    getPerformanceInfo, toStringArray, getAcademicStreams,
    StudentReportData, stripEmoji, getBarColor, getTraitLevel,
    getPageStyle,
} from './pdf-styles';
import {
    RadarChart, HorizontalBarChart, CircularProgress,
    ScoreRing, HollandCodeDisplay, PageFooter, MiniBar,
} from './pdf-charts';
import { t, aiText, type Lang } from './i18n';

const h = React.createElement;
const REPORT_TYPE = 'Student Career Report';

// Section heading style override for Malayalam pages
const sectionTitleStyle = (lang: Lang) => lang === 'ml'
    ? { ...styles.sectionTitle, fontFamily: 'NotoSansMalayalam' }
    : styles.sectionTitle;
const pageTitleStyle = (lang: Lang) => lang === 'ml'
    ? { ...styles.pageTitle, fontFamily: 'NotoSansMalayalam' }
    : styles.pageTitle;

// ─── Helpers ─────────────────────────────────────────────────────────────────
const normalizeCareers = (ai: StudentReportData['aiInsights']) => {
    if (!ai?.careerGuidance || typeof ai.careerGuidance === 'string') {
        return { suggestedCareers: [], skillsToDevelop: [], careerText: typeof ai?.careerGuidance === 'string' ? ai.careerGuidance : '' };
    }
    return {
        suggestedCareers: ai.careerGuidance.suggestedCareers || [],
        skillsToDevelop: ai.careerGuidance.skillsToDevelop || [],
        careerText: '',
    };
};

// Generate fallback analysis from data when AI text is missing or short
const generateOverviewText = (data: StudentReportData, lang: Lang = 'en'): string => {
    const apt = data.aptitudeScores['overall'];
    const aptPct = apt ? Math.round(apt.percentage) : 0;
    const readiness = data.readinessScores?.['overall'];
    const readPct = readiness ? Math.round(readiness.percentage) : 0;
    const code = data.riasecCode || '';
    const codeNames = code.split('').map(c => RIASEC_NAMES[c] || c).join(', ');
    const perfInfo = getPerformanceInfo(data.performanceLevel, lang);

    if (lang === 'ml') {
        return `ഈ സമഗ്ര 360° മൂല്യാങ്കനം നിങ്ങളുടെ ബൗദ്ധിക കഴിവുകൾ, കരിയർ താൽപ്പര്യങ്ങൾ, വ്യക്തിത്വ ഗുണങ്ങൾ, കരിയർ സന്നദ്ധത എന്നിവ വിവിധ മാനങ്ങളിൽ വിലയിരുത്തുന്നു. ` +
            `നിങ്ങളുടെ മൊത്തം പ്രകടന സ്കോർ ${data.weightedScore}% (${perfInfo.label}) ആണ്, അഭിരുചി സ്കോർ ${aptPct}%, കരിയർ സന്നദ്ധത ${readPct}%. ` +
            (code ? `നിങ്ങളുടെ ഹോളണ്ട് കോഡ് ${code} (${codeNames}) ആണ്, ഇത് നിങ്ങളുടെ പ്രാഥമിക കരിയർ താൽപ്പര്യ മേഖലകൾ സൂചിപ്പിക്കുന്നു. ` : '') +
            `നിങ്ങളുടെ അക്കാദമിക് സന്നദ്ധത സൂചിക ${data.academicReadinessIndex}% ആണ്, ഇത് അക്കാദമിക്, കരിയർ വെല്ലുവിളികൾക്കുള്ള നിങ്ങളുടെ സന്നദ്ധത പ്രതിഫലിപ്പിക്കുന്നു.`;
    }
    return `This comprehensive 360° assessment evaluates your cognitive abilities, career interests, personality traits, and career readiness across multiple dimensions. ` +
        `Your overall performance score is ${data.weightedScore}% (${perfInfo.label}), with an aptitude score of ${aptPct}% and career readiness of ${readPct}%. ` +
        (code ? `Your Holland Code is ${code} (${codeNames}), indicating your primary career interest areas. ` : '') +
        `Your Academic Readiness Index stands at ${data.academicReadinessIndex}%, reflecting your preparedness for academic and career challenges ahead.`;
};

const generateAptitudeText = (data: StudentReportData, lang: Lang = 'en'): string => {
    const entries = Object.entries(data.aptitudeScores).filter(([k]) => k !== 'overall');
    const sorted = [...entries].sort((a, b) => b[1].percentage - a[1].percentage);
    const strongest = sorted[0];
    const weakest = sorted[sorted.length - 1];
    const apt = data.aptitudeScores['overall'];
    const aptPct = apt ? Math.round(apt.percentage) : 0;

    if (lang === 'ml') {
        return `നിങ്ങളുടെ ബൗദ്ധിക അഭിരുചി മൂല്യാങ്കനം ${aptPct}% മൊത്തം സ്കോർ കാണിക്കുന്നു. ` +
            (strongest ? `നിങ്ങളുടെ ഏറ്റവും ശക്തമായ മേഖല ${strongest[0]} ആണ്, ${Math.round(strongest[1].percentage)}% സ്കോറോടെ. ` : '') +
            (weakest ? `${weakest[0]} ${Math.round(weakest[1].percentage)}% ആണ് നിങ്ങളുടെ പ്രധാന വളർച്ചാ അവസരം. ` : '') +
            `ലക്ഷ്യബോധമായ പരിശീലനത്തിലൂടെ ദുർബല അഭിരുചി മേഖലകൾ വികസിപ്പിക്കുന്നത് കൂടുതൽ സമതുലിതമായ ബൗദ്ധിക പ്രൊഫൈൽ സൃഷ്ടിക്കും.`;
    }
    return `Your cognitive aptitude assessment reveals an overall score of ${aptPct}%. ` +
        (strongest ? `Your strongest area is ${strongest[0]} at ${Math.round(strongest[1].percentage)}%, demonstrating solid capability in this domain. ` : '') +
        (weakest ? `${weakest[0]} at ${Math.round(weakest[1].percentage)}% represents your primary growth opportunity. ` : '') +
        `Developing your weaker aptitude areas through targeted practice will create a more balanced cognitive profile and open doors to a wider range of career pathways.`;
};

const generatePersonalityText = (data: StudentReportData, lang: Lang = 'en'): string => {
    if (!data.personalityScores) return '';
    const entries = Object.entries(data.personalityScores);
    const strong = entries.filter(([, v]) => v.level === 'Strong').map(([k]) => k);
    const moderate = entries.filter(([, v]) => v.level === 'Moderate').map(([k]) => k);
    const emerging = entries.filter(([, v]) => v.level === 'Emerging').map(([k]) => k);

    if (lang === 'ml') {
        let text = '';
        if (strong.length > 0) text += `നിങ്ങളുടെ വ്യക്തിത്വ പ്രൊഫൈൽ ${strong.join(', ')} എന്നിവയിൽ ശക്തമായ വികസനം കാണിക്കുന്നു. `;
        if (moderate.length > 0) text += `${moderate.join(', ')} മിതമായ നിലവാരത്തിലാണ്, കൂടുതൽ ശക്തിപ്പെടുത്താവുന്ന ഉറച്ച അടിത്തറ കാണിക്കുന്നു. `;
        if (emerging.length > 0) text += `${emerging.join(', ')} ഇപ്പോഴും വളരുന്ന ഘട്ടത്തിലാണ്, വ്യക്തിഗത വളർച്ചയ്ക്കുള്ള പ്രധാന മേഖലകളാണ്. `;
        text += `ഈ ഗുണങ്ങൾ ഒരുമിച്ച് നിങ്ങൾ വെല്ലുവിളികളെ എങ്ങനെ നേരിടുന്നു, മറ്റുള്ളവരുമായി എങ്ങനെ ഇടപെടുന്നു, തീരുമാനങ്ങൾ എങ്ങനെ എടുക്കുന്നു എന്നിവ രൂപപ്പെടുത്തുന്നു.`;
        return text;
    }
    let text = '';
    if (strong.length > 0) text += `Your personality profile shows strong development in ${strong.join(' and ')}, indicating maturity and consistency in these qualities. `;
    if (moderate.length > 0) text += `${moderate.join(', ')} ${moderate.length === 1 ? 'is' : 'are'} at a moderate level, showing a solid foundation that can be further strengthened. `;
    if (emerging.length > 0) text += `${emerging.join(', ')} ${emerging.length === 1 ? 'is' : 'are'} still emerging and represent key areas for personal growth. `;
    text += `Together, these traits shape how you approach challenges, interact with others, and make decisions — all critical factors in career success.`;
    return text;
};

const generateReadinessText = (data: StudentReportData, lang: Lang = 'en'): string => {
    if (!data.readinessScores) return '';
    const entries = Object.entries(data.readinessScores).filter(([k]) => k !== 'overall');
    const sorted = [...entries].sort((a, b) => b[1].percentage - a[1].percentage);
    const overall = data.readinessScores['overall'];
    const overallPct = overall ? Math.round(overall.percentage) : 0;

    if (lang === 'ml') {
        let text = `നിങ്ങളുടെ മൊത്തം കരിയർ സന്നദ്ധത സൂചിക ${overallPct}% ആണ്. `;
        if (sorted.length > 0) text += `നിങ്ങളുടെ ഏറ്റവും ശക്തമായ കഴിവ് ${sorted[0][0]} ആണ്, ${Math.round(sorted[0][1].percentage)}%. `;
        if (sorted.length > 1) text += `${sorted[1][0]} ${Math.round(sorted[1][1].percentage)}% ആണ്. `;
        if (sorted.length > 0) {
            const weakest = sorted[sorted.length - 1];
            text += `${weakest[0]} ${Math.round(weakest[1].percentage)}% ആണ് നിങ്ങളുടെ പ്രധാന വികസന മേഖല. `;
        }
        text += `കരിയർ സന്നദ്ധത കഴിവുകൾ തൊഴിൽദാതാക്കളും അക്കാദമിക് സ്ഥാപനങ്ങളും ഒരുപോലെ വിലമതിക്കുന്നു, പരിശീലനം, വർക്ക്ഷോപ്പുകൾ, പ്രായോഗിക പദ്ധതികൾ എന്നിവയിലൂടെ വികസിപ്പിക്കാം.`;
        return text;
    }
    let text = `Your overall career readiness index is ${overallPct}%. `;
    if (sorted.length > 0) text += `Your strongest skill is ${sorted[0][0]} at ${Math.round(sorted[0][1].percentage)}%. `;
    if (sorted.length > 1) text += `${sorted[1][0]} follows at ${Math.round(sorted[1][1].percentage)}%. `;
    if (sorted.length > 0) {
        const weakest = sorted[sorted.length - 1];
        text += `${weakest[0]} at ${Math.round(weakest[1].percentage)}% is your primary area for development. `;
    }
    text += `Career readiness skills are highly valued by employers and academic institutions alike, and can be developed through practice, workshops, and real-world projects.`;
    return text;
};

const generateStrengthsText = (data: StudentReportData, lang: Lang = 'en'): string => {
    if (data.topStrengths.length === 0) return '';
    if (lang === 'ml') {
        return `നിങ്ങളുടെ മൂല്യാങ്കനം ${data.topStrengths.length} പ്രധാന ശക്തികൾ തിരിച്ചറിയുന്നു: ${data.topStrengths.join(', ')}. ` +
            `ഈ ശക്തികൾ നിങ്ങളുടെ മത്സര നേട്ടങ്ങളാണ് — നിങ്ങളെ വ്യത്യസ്തരാക്കുന്ന സ്വാഭാവിക കഴിവുകളും വികസിത കഴിവുകളും. ` +
            `നിങ്ങളുടെ അക്കാദമിക്, കരിയർ തിരഞ്ഞെടുപ്പുകളിൽ ഈ ശക്തികൾ പ്രയോജനപ്പെടുത്തുന്നത് മികച്ച പ്രകടനം നടത്താനും കൂടുതൽ സംതൃപ്തി കണ്ടെത്താനും സഹായിക്കും.`;
    }
    return `Your assessment identifies ${data.topStrengths.length} key strengths: ${data.topStrengths.join(', ')}. ` +
        `These strengths represent your competitive advantages — the natural abilities and developed skills that set you apart. ` +
        `Leveraging these strengths in your academic and career choices will help you perform at your best and find greater satisfaction in your work.`;
};

const generateGrowthText = (data: StudentReportData, lang: Lang = 'en'): string => {
    if (data.areasForImprovement.length === 0) return '';
    if (lang === 'ml') {
        return `ഇനിപ്പറയുന്ന മേഖലകൾ മെച്ചപ്പെടുത്തലിനുള്ള ഏറ്റവും വലിയ സാധ്യത നൽകുന്നു: ${data.areasForImprovement.join(', ')}. ` +
            `ഇവ ദൗർബല്യങ്ങളല്ല, മറിച്ച് വളർച്ചയ്ക്കുള്ള അവസരങ്ങളാണ്. ` +
            `ഘടനാപരമായ പഠനം, പരിശീലന പ്രവർത്തനങ്ങൾ, മെന്ററിംഗ് എന്നിവയിലൂടെ ഈ മേഖലകളിൽ ശ്രദ്ധ കേന്ദ്രീകരിക്കുന്നത് നിങ്ങളുടെ മൊത്തം പ്രൊഫൈൽ ഗണ്യമായി മെച്ചപ്പെടുത്തും.`;
    }
    return `The following areas offer the greatest potential for improvement: ${data.areasForImprovement.join(', ')}. ` +
        `These are not weaknesses but rather opportunities for growth. ` +
        `Focused effort in these areas — through structured learning, practice exercises, and mentorship — will significantly enhance your overall profile and expand your career options.`;
};

const generateSectorText = (data: StudentReportData, lang: Lang = 'en'): string => {
    if (!data.sectorMatches || data.sectorMatches.length === 0) return '';
    const top = data.sectorMatches.slice(0, 3).map(s => stripEmoji(s.name));
    if (lang === 'ml') {
        return `നിങ്ങളുടെ താൽപ്പര്യങ്ങൾ, അഭിരുചി, വ്യക്തിത്വം, സന്നദ്ധത സ്കോറുകൾ എന്നിവയുടെ സംയോജിത വിശകലനത്തിന്റെ അടിസ്ഥാനത്തിൽ, നിങ്ങളുടെ പ്രൊഫൈലുമായി ഏറ്റവും അനുയോജ്യമായ സെക്ടറുകൾ ${top.join(', ')} ആണ്. ` +
            `ഈ സെക്ടറുകൾ നിങ്ങളുടെ ഹോളണ്ട് കോഡ് ${data.riasecCode || ''} മായി യോജിക്കുന്നു. ` +
            `ഈ സെക്ടറുകളിൽ ഇന്റേൺഷിപ്പുകൾ, പ്രോജക്ടുകൾ, മെന്ററിംഗ് അവസരങ്ങൾ എന്നിവ പര്യവേക്ഷണം ചെയ്യുന്നത് വിവരമുള്ള കരിയർ തീരുമാനങ്ങൾ എടുക്കാൻ സഹായിക്കും.`;
    }
    return `Based on the combined analysis of your interests, aptitude, personality, and readiness scores, the sectors that best match your profile are ${top.join(', ')}. ` +
        `These sectors align with your Holland Code ${data.riasecCode || ''} and leverage your cognitive strengths. ` +
        `Exploring internships, projects, or mentorship opportunities in these sectors will help you make informed career decisions.`;
};

// ─── PAGE 1: Cover + Profile + Persona + Overview + Summary ─────────────────
const StudentPage1 = ({ data, lang = 'en' }: { data: StudentReportData; lang?: Lang }) => {
    const ai = data.aiInsights;
    const performanceInfo = getPerformanceInfo(data.performanceLevel, lang);
    const overviewText = (lang === 'ml' ? aiText(ai as any, 'overallSummary', lang) : '') || ai?.overallSummary || generateOverviewText(data, lang);
    const apt = data.aptitudeScores['overall'];
    const readiness = data.readinessScores?.['overall'];

    return h(Page, { size: 'A4', style: getPageStyle(lang) },
        // Header
        h(View, { style: styles.header },
            h(Text, { style: { ...styles.headerTitle, fontFamily: 'Nunito' } },
                'PRAGYA 360\u00B0 Student Career Report',
                lang === 'ml' ? h(Text, { style: { fontFamily: 'NotoSansMalayalam', fontSize: 16 } }, ' (\u0D2E\u0D32\u0D2F\u0D3E\u0D33\u0D02)') : null),
            h(Text, { style: styles.headerSubtitle },
                `Generated on ${data.assessmentDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}`
            )
        ),

        // Student Persona card
        ai?.studentPersona && h(View, { style: styles.personaCard },
            h(Text, { style: { ...styles.personaTitle, fontFamily: 'Nunito' } }, ai.studentPersona.title),
            h(Text, { style: styles.personaDesc },
                (lang === 'ml' ? aiText(ai as any, 'studentPersona_description', lang) : '') || ai.studentPersona.description),
            h(Text, { style: { ...styles.personaSuperpower, fontFamily: 'Nunito' } }, `${t('label_superpower', lang)}: ${ai.studentPersona.superpower}`)
        ),

        // Profile grid
        h(View, { style: { ...styles.section, paddingVertical: 8 } },
            h(Text, { style: sectionTitleStyle(lang) }, t('student_profile', lang)),
            h(View, { style: styles.profileGrid },
                h(View, { style: styles.profileItem },
                    h(Text, { style: styles.profileLabel }, t('label_name', lang)),
                    h(Text, { style: styles.profileValue }, data.studentName)
                ),
                ...(data.grade ? [h(View, { style: styles.profileItem, key: 'grade' },
                    h(Text, { style: styles.profileLabel }, t('label_grade', lang)),
                    h(Text, { style: styles.profileValue }, data.grade)
                )] : []),
                ...(data.schoolName ? [h(View, { style: styles.profileItem, key: 'school' },
                    h(Text, { style: styles.profileLabel }, t('label_school', lang)),
                    h(Text, { style: styles.profileValue }, data.schoolName)
                )] : []),
                ...(data.gender ? [h(View, { style: styles.profileItem, key: 'gender' },
                    h(Text, { style: styles.profileLabel }, t('label_gender', lang)),
                    h(Text, { style: styles.profileValue }, data.gender)
                )] : []),
                ...(data.location ? [h(View, { style: styles.profileItem, key: 'loc' },
                    h(Text, { style: styles.profileLabel }, t('label_location', lang)),
                    h(Text, { style: styles.profileValue }, data.location)
                )] : []),
                ...(data.riasecCode ? [h(View, { style: styles.profileItem, key: 'holland' },
                    h(Text, { style: styles.profileLabel }, t('label_holland_code', lang)),
                    h(Text, { style: styles.profileValue },
                        `${data.riasecCode} (${data.riasecCode.split('').map(c => RIASEC_NAMES[c] || c).join('-')})`
                    )
                )] : []),
                h(View, { style: styles.profileItem, key: 'date' },
                    h(Text, { style: styles.profileLabel }, t('label_assessed_on', lang)),
                    h(Text, { style: styles.profileValue }, data.assessmentDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }))
                ),
                h(View, { style: styles.profileItem, key: 'perf' },
                    h(Text, { style: styles.profileLabel }, t('label_performance', lang)),
                    h(Text, { style: { ...styles.profileValue, color: performanceInfo.color, fontWeight: 700 } }, performanceInfo.label)
                )
            )
        ),

        // Overview Score Rings
        h(View, { style: { ...styles.section, padding: 10 } },
            h(Text, { style: sectionTitleStyle(lang) }, t('performance_overview', lang)),
            h(View, { style: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'flex-start', marginTop: 2 } },
                h(ScoreRing, { value: data.weightedScore, max: 100, label: t('label_overall_score', lang), color: performanceInfo.color }),
                h(View, { style: { alignItems: 'center', width: 84 } },
                    h(View, {
                        style: {
                            backgroundColor: performanceInfo.color,
                            paddingHorizontal: 12,
                            paddingVertical: 6,
                            borderRadius: 6,
                        }
                    },
                        h(Text, { style: { fontSize: 11, fontWeight: 700, color: '#FFFFFF', textAlign: 'center' } }, performanceInfo.label)
                    ),
                    h(Text, { style: { fontSize: 7, fontWeight: 600, color: COLORS.TEXT_DARK, textAlign: 'center', marginTop: 4 } }, t('label_performance_level', lang))
                ),
                apt && h(ScoreRing, { value: Math.round(apt.percentage), max: 100, label: t('label_aptitude', lang) }),
                readiness && h(ScoreRing, { value: Math.round(readiness.percentage), max: 100, label: t('label_readiness', lang) }),
                h(ScoreRing, { value: data.academicReadinessIndex, max: 100, label: t('label_academic_readiness', lang) })
            )
        ),

        // Overall Summary - AI analysis
        h(View, { style: styles.section },
            h(Text, { style: sectionTitleStyle(lang) }, t('overall_assessment_summary', lang)),
            h(Text, { style: styles.sectionContent }, overviewText)
        ),

        // Key Highlights row
        h(View, { style: { ...styles.section, padding: 8 } },
            h(Text, { style: sectionTitleStyle(lang) }, t('key_highlights', lang)),
            h(View, { style: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 } },
                h(View, { style: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.BG_ACCENT, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 } },
                    h(Text, { style: { fontSize: 7, color: COLORS.TEXT_MUTED } }, t('label_strongest_aptitude', lang)),
                    h(Text, { style: { fontSize: 7, fontWeight: 700, color: COLORS.PRIMARY } },
                        (() => {
                            const entries = Object.entries(data.aptitudeScores).filter(([k]) => k !== 'overall');
                            const sorted = [...entries].sort((a, b) => b[1].percentage - a[1].percentage);
                            return sorted[0] ? `${sorted[0][0]} (${Math.round(sorted[0][1].percentage)}%)` : 'N/A';
                        })()
                    )
                ),
                data.personalityScores && h(View, { style: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.BG_ACCENT, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 } },
                    h(Text, { style: { fontSize: 7, color: COLORS.TEXT_MUTED } }, t('label_strongest_trait', lang)),
                    h(Text, { style: { fontSize: 7, fontWeight: 700, color: COLORS.PRIMARY } },
                        (() => {
                            const entries = Object.entries(data.personalityScores!);
                            const sorted = [...entries].sort((a, b) => b[1].score - a[1].score);
                            return sorted[0] ? `${sorted[0][0]} (${sorted[0][1].level})` : 'N/A';
                        })()
                    )
                ),
                data.riasecCode && h(View, { style: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.BG_ACCENT, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 } },
                    h(Text, { style: { fontSize: 7, color: COLORS.TEXT_MUTED } }, t('label_interest_type', lang)),
                    h(Text, { style: { fontSize: 7, fontWeight: 700, color: RIASEC_COLORS[data.riasecCode[0]] || COLORS.PRIMARY } },
                        `${RIASEC_NAMES[data.riasecCode[0]] || data.riasecCode[0]}`
                    )
                ),
                data.topStrengths.length > 0 && h(View, { style: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.BG_ACCENT, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 } },
                    h(Text, { style: { fontSize: 7, color: COLORS.TEXT_MUTED } }, t('label_top_strength', lang)),
                    h(Text, { style: { fontSize: 7, fontWeight: 700, color: COLORS.PRIMARY } }, data.topStrengths[0])
                )
            )
        ),

        h(PageFooter, { reportType: REPORT_TYPE, lang })
    );
};

// ─── PAGE 2: Aptitude + RIASEC ───────────────────────────────────────────────
const StudentPage2 = ({ data, lang = 'en' }: { data: StudentReportData; lang?: Lang }) => {
    const ai = data.aiInsights;

    // Prepare aptitude bar data
    const aptitudeEntries = Object.entries(data.aptitudeScores)
        .filter(([key]) => key !== 'overall')
        .map(([name, score]) => ({
            name,
            value: Math.round(score.percentage),
            max: 100,
        }));

    // Overall aptitude
    const overallAptitude = data.aptitudeScores['overall'];
    const overallPct = overallAptitude ? Math.round(overallAptitude.percentage) : 0;
    const aptitudeText = (lang === 'ml' ? aiText(ai as any, 'strengthsAnalysis', lang) : '') || ai?.strengthsAnalysis || generateAptitudeText(data, lang);

    return h(Page, { size: 'A4', style: getPageStyle(lang) },
        h(Text, { style: pageTitleStyle(lang) }, t('page_aptitude_career', lang)),

        // Aptitude Section
        h(View, { style: styles.section },
            h(Text, { style: sectionTitleStyle(lang) }, t('aptitude_test_results', lang)),
            overallPct > 0 && h(View, { style: { flexDirection: 'row', alignItems: 'center', marginBottom: 6, gap: 8 } },
                h(View, { style: { backgroundColor: COLORS.PRIMARY, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 4 } },
                    h(Text, { style: { fontSize: 12, fontWeight: 700, color: '#FFFFFF' } }, `${overallPct}%`)
                ),
                h(Text, { style: { fontSize: 9, color: COLORS.TEXT_MUTED } }, t('label_overall_aptitude_score', lang)),
                h(Text, { style: { fontSize: 8, color: COLORS.TEXT_MUTED, marginLeft: 'auto' } },
                    `${overallAptitude?.correct || 0} ${t('label_correct_out_of_questions', lang)} ${overallAptitude?.total || 0} ${t('label_questions', lang)}`)
            ),
            aptitudeEntries.length > 0 && h(HorizontalBarChart, { data: aptitudeEntries }),
            h(Text, { style: { ...styles.sectionContent, marginTop: 6 } }, aptitudeText),
            // Per-section detail
            h(View, { style: { marginTop: 6 } },
                h(Text, { style: { fontSize: 8, fontWeight: 700, color: COLORS.PRIMARY_DARK, marginBottom: 3 } }, t('section_breakdown', lang)),
                ...Object.entries(data.aptitudeScores)
                    .filter(([key]) => key !== 'overall')
                    .sort((a, b) => b[1].percentage - a[1].percentage)
                    .map(([name, score], i) =>
                        h(View, { key: `apt-${i}`, style: { flexDirection: 'row', alignItems: 'center', marginBottom: 2, gap: 4 } },
                            h(View, { style: { width: 6, height: 6, borderRadius: 3, backgroundColor: getBarColor(score.percentage) } }),
                            h(Text, { style: { fontSize: 7, color: COLORS.TEXT_BODY, flex: 1 } },
                                `${name}: ${score.correct}/${score.total} (${Math.round(score.percentage)}%) — ${score.percentage >= 70 ? t('level_strong', lang) : score.percentage >= 40 ? t('level_average', lang) : t('level_needs_practice', lang)}`
                            )
                        )
                    )
            )
        ),

        // RIASEC Section
        data.riasecScores && h(View, { style: styles.section },
            h(Text, { style: sectionTitleStyle(lang) }, t('career_interest_riasec', lang)),
            h(View, { style: { flexDirection: 'row', gap: 12, alignItems: 'flex-start' } },
                // Radar chart
                h(View, { style: { flex: 1, alignItems: 'center' } },
                    h(RadarChart, {
                        scores: data.riasecScores as Record<string, number>,
                        maxScore: 8,
                        size: 155,
                    })
                ),
                // Holland code + details
                h(View, { style: { flex: 1 } },
                    data.riasecCode && h(View, { style: { marginBottom: 6 } },
                        h(Text, { style: { fontSize: 8, fontWeight: 600, color: COLORS.TEXT_MUTED, marginBottom: 4 } }, t('label_your_holland_code', lang)),
                        h(HollandCodeDisplay, { code: data.riasecCode })
                    ),
                    // Score list with descriptions
                    ...Object.entries(data.riasecScores)
                        .sort((a, b) => (b[1] as number) - (a[1] as number))
                        .map(([code, score]) =>
                            h(View, { key: code, style: { flexDirection: 'row', alignItems: 'center', marginBottom: 3, gap: 4 } },
                                h(View, { style: { width: 8, height: 8, borderRadius: 4, backgroundColor: RIASEC_COLORS[code] || COLORS.TEXT_MUTED } }),
                                h(Text, { style: { fontSize: 8, color: COLORS.TEXT_BODY, flex: 1 } }, `${RIASEC_NAMES[code] || code}`),
                                h(Text, { style: { fontSize: 8, fontWeight: 700, color: RIASEC_COLORS[code] || COLORS.PRIMARY } }, `${score}/8`)
                            )
                        )
                )
            ),
            h(Text, { style: { ...styles.sectionContent, marginTop: 6 } },
                (lang === 'ml' ? aiText(ai as any, 'riasecAnalysis', lang) : '') || ai?.riasecAnalysis || (data.riasecCode ?
                    `Your Holland Code ${data.riasecCode} (${data.riasecCode.split('').map(c => RIASEC_NAMES[c] || c).join('-')}) indicates that you are most drawn to ${RIASEC_NAMES[data.riasecCode[0]] || ''} activities. ` +
                    `This means you thrive in environments that emphasize ${data.riasecCode[0] === 'R' ? 'hands-on, practical work' : data.riasecCode[0] === 'I' ? 'analytical thinking and research' : data.riasecCode[0] === 'A' ? 'creative expression and innovation' : data.riasecCode[0] === 'S' ? 'helping and mentoring others' : data.riasecCode[0] === 'E' ? 'leadership and persuasion' : 'organization and data management'}. ` +
                    `Your secondary interest in ${RIASEC_NAMES[data.riasecCode[1]] || ''} activities complements this by adding ${data.riasecCode[1] === 'R' ? 'practical skills' : data.riasecCode[1] === 'I' ? 'research capability' : data.riasecCode[1] === 'A' ? 'creative thinking' : data.riasecCode[1] === 'S' ? 'interpersonal skills' : data.riasecCode[1] === 'E' ? 'leadership ability' : 'organizational skills'}.` : '')
            )
        ),

        h(PageFooter, { reportType: REPORT_TYPE, lang })
    );
};

// ─── PAGE 3: Personality + Strengths & Growth ───────────────────────────────
const StudentPage3 = ({ data, lang = 'en' }: { data: StudentReportData; lang?: Lang }) => {
    const ai = data.aiInsights;

    // Personality circular progress data
    const personalityEntries = Object.entries(data.personalityScores || {});
    const personalityText = (lang === 'ml' ? aiText(ai as any, 'personalityAnalysis', lang) : '') || ai?.personalityAnalysis || generatePersonalityText(data, lang);

    return h(Page, { size: 'A4', style: getPageStyle(lang) },
        h(Text, { style: pageTitleStyle(lang) }, t('page_personality_strengths', lang)),

        // Personality Section
        data.personalityScores && h(View, { style: styles.section },
            h(Text, { style: sectionTitleStyle(lang) }, t('personality_traits', lang)),
            h(View, {
                style: {
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    justifyContent: 'space-around',
                    gap: 6,
                    marginTop: 2,
                    marginBottom: 4,
                }
            },
                ...personalityEntries.map(([trait, info]) =>
                    h(CircularProgress, {
                        key: trait,
                        value: info.score,
                        max: info.maxScore,
                        label: trait,
                        sublabel: info.level,
                        size: 52,
                    })
                )
            ),
            h(Text, { style: styles.sectionContent }, personalityText),
            // Individual trait interpretations
            h(View, { style: { marginTop: 6 } },
                h(Text, { style: { fontSize: 8, fontWeight: 700, color: COLORS.PRIMARY_DARK, marginBottom: 4 } }, t('trait_analysis', lang)),
                ...personalityEntries.map(([trait, info]) => {
                    const pct = Math.round((info.score / info.maxScore) * 100);
                    const level = getTraitLevel(pct);

                    // Trait interpretation key mapping
                    const traitKeyMap: Record<string, string> = {
                        'Stress Tolerance': 'stress',
                        'Social Interaction': 'social',
                        'Curiosity & Openness': 'curiosity',
                        'Decision-Making Style': 'decision',
                        'Team vs Independent Style': 'team',
                        'Responsibility & Discipline': 'responsibility',
                    };
                    const traitKey = traitKeyMap[trait];
                    const levelKey = level.level.toLowerCase(); // 'strong', 'moderate', 'emerging'
                    const traitInterp = traitKey
                        ? t(`trait_${traitKey}_${levelKey}`, lang)
                        : `Your ${trait} score of ${info.score}/${info.maxScore} places you at the ${level.level} level.`;

                    return h(View, { key: `ti-${trait}`, style: { marginBottom: 3, paddingLeft: 4 } },
                        h(View, { style: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 1 } },
                            h(View, { style: { width: 6, height: 6, borderRadius: 3, backgroundColor: level.color } }),
                            h(Text, { style: { fontSize: 8, fontWeight: 700, color: COLORS.PRIMARY_DARK } }, `${trait} (${info.score}/${info.maxScore} — ${level.level})`),
                        ),
                        h(Text, { style: { fontSize: 7, color: COLORS.TEXT_MUTED, lineHeight: 1.3, paddingLeft: 10 } }, traitInterp)
                    );
                })
            )
        ),

        // Strengths & Growth Areas — two columns
        h(View, { style: styles.section },
            h(Text, { style: sectionTitleStyle(lang) }, t('strengths_growth_areas', lang)),
            h(View, { style: styles.twoCol },
                // Strengths
                h(View, { style: styles.col },
                    h(Text, { style: { fontSize: 9, fontWeight: 700, color: COLORS.PRIMARY, marginBottom: 3 } }, t('top_strengths', lang)),
                    ...data.topStrengths.map((s, i) =>
                        h(View, { key: `s-${i}`, style: styles.strengthItem },
                            h(Text, { style: { ...styles.strengthDot, color: COLORS.SUCCESS } }, '\u2022'),
                            h(Text, { style: styles.strengthText }, s)
                        )
                    ),
                    h(Text, { style: { ...styles.sectionContent, marginTop: 3, fontSize: 7 } },
                        (lang === 'ml' ? aiText(ai as any, 'strengthsAnalysis', lang) : '') || ai?.strengthsAnalysis || generateStrengthsText(data, lang))
                ),
                // Growth areas
                h(View, { style: styles.col },
                    h(Text, { style: { fontSize: 9, fontWeight: 700, color: COLORS.WARNING, marginBottom: 3 } }, t('areas_for_growth', lang)),
                    ...data.areasForImprovement.map((a, i) =>
                        h(View, { key: `a-${i}`, style: styles.strengthItem },
                            h(Text, { style: { ...styles.strengthDot, color: COLORS.WARNING } }, '\u2022'),
                            h(Text, { style: styles.strengthText }, a)
                        )
                    ),
                    h(Text, { style: { ...styles.sectionContent, marginTop: 3, fontSize: 7 } },
                        (lang === 'ml' ? aiText(ai as any, 'areasForGrowth', lang) : '') || ai?.areasForGrowth || generateGrowthText(data, lang))
                )
            )
        ),

        h(PageFooter, { reportType: REPORT_TYPE, lang })
    );
};

// ─── PAGE 4: Readiness + Sectors + Academic Streams ─────────────────────────
const StudentPage4 = ({ data, lang = 'en' }: { data: StudentReportData; lang?: Lang }) => {
    const ai = data.aiInsights;
    const academicStreams = getAcademicStreams(ai?.academicStreams);

    // Readiness bar data
    const readinessEntries = Object.entries(data.readinessScores || {})
        .filter(([key]) => key !== 'overall')
        .map(([name, info]) => ({
            name,
            value: Math.round(info.percentage),
            max: 100,
        }));
    const overallReadiness = data.readinessScores?.['overall'];
    const readinessText = (lang === 'ml' ? aiText(ai as any, 'readinessAnalysis', lang) : '') || ai?.readinessAnalysis || generateReadinessText(data, lang);

    return h(Page, { size: 'A4', style: getPageStyle(lang) },
        h(Text, { style: pageTitleStyle(lang) }, t('page_readiness_sector', lang)),

        // Skill & Career Readiness
        data.readinessScores && h(View, { style: styles.section },
            h(Text, { style: sectionTitleStyle(lang) }, t('skill_career_readiness', lang)),
            overallReadiness && h(View, { style: { flexDirection: 'row', alignItems: 'center', marginBottom: 6, gap: 8 } },
                h(View, { style: { backgroundColor: COLORS.PRIMARY, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 4 } },
                    h(Text, { style: { fontSize: 12, fontWeight: 700, color: '#FFFFFF' } }, `${Math.round(overallReadiness.percentage)}%`)
                ),
                h(Text, { style: { fontSize: 9, color: COLORS.TEXT_MUTED } }, t('label_overall_readiness', lang))
            ),
            readinessEntries.length > 0 && h(HorizontalBarChart, { data: readinessEntries }),
            h(Text, { style: { ...styles.sectionContent, marginTop: 6 } }, readinessText)
        ),

        // Sector Recommendations
        (ai?.sectorRecommendations?.topSectors || (data.sectorMatches && data.sectorMatches.length > 0)) && h(View, { style: styles.section },
            h(Text, { style: sectionTitleStyle(lang) }, t('sector_recommendations', lang)),
            ai?.sectorRecommendations?.topSectors && h(View, { style: { flexDirection: 'row', flexWrap: 'wrap', gap: 4, marginBottom: 4 } },
                ...ai.sectorRecommendations.topSectors.map((sector, i) =>
                    h(View, {
                        key: `sec-${i}`,
                        style: {
                            backgroundColor: COLORS.BG_ACCENT,
                            paddingHorizontal: 10,
                            paddingVertical: 5,
                            borderRadius: 4,
                            borderLeft: `2 solid ${COLORS.PRIMARY}`,
                        }
                    },
                        h(Text, { style: { fontSize: 9, fontWeight: 700, color: COLORS.PRIMARY_DARK } }, stripEmoji(sector))
                    )
                )
            ),
            // Sector match scores with bars
            data.sectorMatches && data.sectorMatches.length > 0 && h(View, { style: { marginTop: 4 } },
                ...data.sectorMatches.slice(0, 6).map((sector, i) =>
                    h(View, { key: `sm-${i}`, style: { flexDirection: 'row', alignItems: 'center', marginBottom: 3 } },
                        h(Text, { style: { fontSize: 8, color: COLORS.TEXT_BODY, width: 130 } }, stripEmoji(sector.name)),
                        h(View, { style: { flex: 1, height: 7, backgroundColor: '#e2e8f0', borderRadius: 3, marginRight: 6 } },
                            h(View, { style: { width: `${sector.matchScore}%`, height: 7, backgroundColor: getBarColor(sector.matchScore), borderRadius: 3 } })
                        ),
                        h(Text, { style: { fontSize: 8, fontWeight: 700, color: COLORS.PRIMARY, width: 32, textAlign: 'right' } }, `${sector.matchScore}%`)
                    )
                )
            ),
            h(Text, { style: { ...styles.sectionContent, marginTop: 4 } },
                ai?.sectorRecommendations?.reasoning || generateSectorText(data, lang))
        ),

        // Academic Streams
        academicStreams.length > 0 && h(View, { style: styles.section },
            h(Text, { style: sectionTitleStyle(lang) }, t('recommended_streams', lang)),
            h(View, { style: { flexDirection: 'row', flexWrap: 'wrap', gap: 4, marginBottom: 4 } },
                ...academicStreams.map((stream, i) =>
                    h(View, {
                        key: `stream-${i}`,
                        style: {
                            backgroundColor: COLORS.ACCENT + '15',
                            paddingHorizontal: 10,
                            paddingVertical: 5,
                            borderRadius: 12,
                            borderWidth: 1,
                            borderColor: COLORS.ACCENT + '40',
                        }
                    },
                        h(Text, { style: { fontSize: 8, fontWeight: 600, color: COLORS.ACCENT } }, stream)
                    )
                )
            ),
            h(Text, { style: styles.sectionContent },
                (ai?.academicStreams && typeof ai.academicStreams === 'object' && 'reasoning' in ai.academicStreams && ai.academicStreams.reasoning)
                    ? ai.academicStreams.reasoning
                    : (data.riasecCode ? `Based on your Holland Code ${data.riasecCode} and your cognitive aptitude profile, the recommended academic streams align with both your natural interests and demonstrated abilities. These streams offer the best pathway to careers that match your personality and skills, providing a strong foundation for future professional success.` : '')
            )
        ),

        // Career Clarity
        h(View, { style: { ...styles.section, padding: 8 } },
            h(Text, { style: sectionTitleStyle(lang) }, t('career_direction_clarity', lang)),
            h(View, { style: { flexDirection: 'row', alignItems: 'center', gap: 12 } },
                h(ScoreRing, { value: data.academicReadinessIndex, max: 100, label: t('label_clarity_index', lang), size: 60, color: data.academicReadinessIndex >= 60 ? COLORS.PRIMARY : data.academicReadinessIndex >= 40 ? COLORS.WARNING : COLORS.DANGER }),
                h(View, { style: { flex: 1 } },
                    h(Text, { style: { fontSize: 9, fontWeight: 700, color: data.academicReadinessIndex >= 60 ? COLORS.PRIMARY : data.academicReadinessIndex >= 40 ? COLORS.WARNING : COLORS.DANGER, marginBottom: 2 } },
                        data.academicReadinessIndex >= 60 ? t('clarity_good_title', lang) : data.academicReadinessIndex >= 40 ? t('clarity_developing_title', lang) : t('clarity_needs_focus_title', lang)),
                    h(Text, { style: { fontSize: 8, color: COLORS.TEXT_BODY, lineHeight: 1.4 } },
                        data.academicReadinessIndex >= 60
                            ? t('clarity_good_text', lang)
                            : data.academicReadinessIndex >= 40
                                ? t('clarity_developing_text', lang)
                                : t('clarity_needs_focus_text', lang)
                    )
                )
            )
        ),

        h(PageFooter, { reportType: REPORT_TYPE, lang })
    );
};

// ─── PAGE 5: Career Guidance + Study Tips ────────────────────────────────────
const StudentPage5 = ({ data, lang = 'en' }: { data: StudentReportData; lang?: Lang }) => {
    const ai = data.aiInsights;
    const { suggestedCareers, skillsToDevelop, careerText } = normalizeCareers(ai);
    const studyTips = toStringArray(ai?.studyTips);
    const nextSteps = toStringArray(ai?.nextSteps);

    return h(Page, { size: 'A4', style: getPageStyle(lang) },
        h(Text, { style: pageTitleStyle(lang) }, t('page_career_guidance', lang)),

        // Suggested Careers (2-col grid)
        (suggestedCareers.length > 0 || careerText || (data.careerMatches && data.careerMatches.length > 0)) && h(View, { style: styles.section },
            h(Text, { style: sectionTitleStyle(lang) }, t('suggested_careers', lang)),
            careerText && h(Text, { style: { ...styles.sectionContent, marginBottom: 4 } }, careerText),
            suggestedCareers.length > 0 && h(View, { style: { flexDirection: 'row', flexWrap: 'wrap', gap: 5 } },
                ...suggestedCareers.map((c, i) =>
                    h(View, { key: `c-${i}`, style: { ...styles.careerCard, width: '48%' } },
                        h(Text, { style: styles.careerTitle }, c.role),
                        c.fitReason && h(Text, { style: styles.careerReason }, c.fitReason)
                    )
                )
            ),
            // Career matches from scoring
            (!suggestedCareers.length && data.careerMatches && data.careerMatches.length > 0) &&
                h(View, { style: { flexDirection: 'row', flexWrap: 'wrap', gap: 5 } },
                    ...data.careerMatches.slice(0, 8).map((c, i) =>
                        h(View, { key: `cm-${i}`, style: { ...styles.careerCard, width: '48%' } },
                            h(Text, { style: styles.careerTitle }, c.title),
                            h(Text, { style: styles.careerReason }, `${t('label_match_score', lang)}: ${c.matchScore}%`)
                        )
                    )
                )
        ),

        // Skills to Develop
        skillsToDevelop.length > 0 && h(View, { style: styles.section },
            h(Text, { style: sectionTitleStyle(lang) }, t('skills_to_develop', lang)),
            ...skillsToDevelop.map((skill, i) =>
                h(View, { key: `sk-${i}`, style: styles.actionItem },
                    h(Text, { style: styles.actionNumber }, `${i + 1}.`),
                    h(Text, { style: styles.actionText }, skill)
                )
            )
        ),

        // Study Tips
        studyTips.length > 0 && h(View, { style: styles.section },
            h(Text, { style: sectionTitleStyle(lang) }, t('study_tips', lang)),
            ...studyTips.map((tip, i) =>
                h(View, { key: `tip-${i}`, style: { ...styles.careerCard, borderLeft: `2 solid ${COLORS.ACCENT}`, marginBottom: 3 } },
                    h(Text, { style: { fontSize: 8, color: COLORS.TEXT_BODY, lineHeight: 1.4 } }, `${i + 1}. ${tip}`)
                )
            )
        ),

        // Next Steps
        nextSteps.length > 0 && h(View, { style: styles.section },
            h(Text, { style: sectionTitleStyle(lang) }, t('recommended_next_steps', lang)),
            ...nextSteps.map((step, i) =>
                h(View, { key: `step-${i}`, style: styles.actionItem },
                    h(Text, { style: styles.actionNumber }, `${i + 1}.`),
                    h(Text, { style: styles.actionText }, step)
                )
            )
        ),

        // Fallback: if no study tips or next steps, add general guidance
        (studyTips.length === 0 && nextSteps.length === 0) && h(View, { style: styles.section },
            h(Text, { style: sectionTitleStyle(lang) }, t('general_guidance', lang)),
            h(Text, { style: styles.sectionContent },
                t('general_guidance_intro', lang) + '\n\n' +
                `1. ${t('general_guidance_1', lang)}\n` +
                `2. ${lang === 'ml'
                    ? (data.riasecCode ? `നിങ്ങളുടെ ${RIASEC_NAMES[data.riasecCode[0]] || ''} താൽപ്പര്യങ്ങൾ` : 'കരിയർ താൽപ്പര്യങ്ങൾ') + ' പാഠ്യേതര പ്രവർത്തനങ്ങൾ, ക്ലബ്ബുകൾ, ഓൺലൈൻ കോഴ്സുകൾ എന്നിവയിലൂടെ പര്യവേക്ഷണം ചെയ്യുക.'
                    : `Explore your ${data.riasecCode ? `${RIASEC_NAMES[data.riasecCode[0]] || ''} interests` : 'career interests'} through extracurricular activities, clubs, and online courses.`}\n` +
                `3. ${t('general_guidance_3', lang)}\n` +
                `4. ${t('general_guidance_4', lang)}\n` +
                `5. ${t('general_guidance_5', lang)}`
            )
        ),

        h(PageFooter, { reportType: REPORT_TYPE, lang })
    );
};

// ─── PAGE 6: Summary Dashboard + Disclaimer ─────────────────────────────────
const StudentPage6 = ({ data, lang = 'en' }: { data: StudentReportData; lang?: Lang }) => {
    const performanceInfo = getPerformanceInfo(data.performanceLevel, lang);

    // Gather all key metrics for summary
    const aptitudeOverall = data.aptitudeScores['overall'];
    const readinessOverall = data.readinessScores?.['overall'];

    return h(Page, { size: 'A4', style: getPageStyle(lang) },
        h(Text, { style: pageTitleStyle(lang) }, t('summary_dashboard', lang)),

        // Summary grid with score rings
        h(View, { style: { ...styles.section, padding: 12 } },
            h(Text, { style: sectionTitleStyle(lang) }, t('key_metrics', lang)),
            h(View, { style: { flexDirection: 'row', justifyContent: 'space-around', flexWrap: 'wrap', gap: 8, marginTop: 4 } },
                h(ScoreRing, { value: data.weightedScore, max: 100, label: t('label_overall_score', lang), color: performanceInfo.color }),
                h(ScoreRing, { value: data.academicReadinessIndex, max: 100, label: t('label_academic_readiness', lang) }),
                aptitudeOverall && h(ScoreRing, { value: Math.round(aptitudeOverall.percentage), max: 100, label: t('label_aptitude', lang) }),
                readinessOverall && h(ScoreRing, { value: Math.round(readinessOverall.percentage), max: 100, label: t('label_readiness', lang) })
            )
        ),

        // Comprehensive overview table
        h(View, { style: styles.section },
            h(Text, { style: sectionTitleStyle(lang) }, t('complete_overview', lang)),
            // Aptitude summary
            h(View, { style: { marginBottom: 6 } },
                h(Text, { style: { fontSize: 9, fontWeight: 700, color: COLORS.PRIMARY, marginBottom: 3 } }, t('cognitive_aptitude_scores', lang)),
                h(View, { style: { flexDirection: 'row', flexWrap: 'wrap', gap: 4 } },
                    ...Object.entries(data.aptitudeScores)
                        .filter(([key]) => key !== 'overall')
                        .map(([name, score]) =>
                            h(View, {
                                key: name,
                                style: {
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    backgroundColor: COLORS.BG_ACCENT,
                                    paddingHorizontal: 6,
                                    paddingVertical: 3,
                                    borderRadius: 3,
                                }
                            },
                                h(Text, { style: { fontSize: 7, color: COLORS.TEXT_BODY } }, `${name}: `),
                                h(Text, { style: { fontSize: 7, fontWeight: 700, color: getBarColor(score.percentage) } }, `${Math.round(score.percentage)}%`)
                            )
                        )
                )
            ),
            // RIASEC summary
            data.riasecCode && h(View, { style: { marginBottom: 6 } },
                h(Text, { style: { fontSize: 9, fontWeight: 700, color: COLORS.PRIMARY, marginBottom: 3 } }, t('holland_riasec_scores', lang)),
                h(View, { style: { flexDirection: 'row', gap: 4, alignItems: 'center' } },
                    ...data.riasecCode.split('').map((letter, i) =>
                        h(View, {
                            key: `h-${i}`,
                            style: {
                                backgroundColor: RIASEC_COLORS[letter] || COLORS.TEXT_MUTED,
                                width: 22,
                                height: 22,
                                borderRadius: 11,
                                alignItems: 'center',
                                justifyContent: 'center',
                            }
                        },
                            h(Text, { style: { fontSize: 11, fontWeight: 700, color: '#FFFFFF' } }, letter)
                        )
                    ),
                    h(Text, { style: { fontSize: 8, color: COLORS.TEXT_MUTED, marginLeft: 4 } },
                        data.riasecCode.split('').map(c => RIASEC_NAMES[c] || c).join(' - '))
                ),
                data.riasecScores && h(View, { style: { flexDirection: 'row', flexWrap: 'wrap', gap: 4, marginTop: 4 } },
                    ...Object.entries(data.riasecScores).map(([code, score]) =>
                        h(View, {
                            key: `rs-${code}`,
                            style: {
                                flexDirection: 'row',
                                alignItems: 'center',
                                backgroundColor: COLORS.BG_ACCENT,
                                paddingHorizontal: 6,
                                paddingVertical: 3,
                                borderRadius: 3,
                            }
                        },
                            h(View, { style: { width: 6, height: 6, borderRadius: 3, backgroundColor: RIASEC_COLORS[code], marginRight: 3 } }),
                            h(Text, { style: { fontSize: 7, color: COLORS.TEXT_BODY } }, `${RIASEC_NAMES[code]}: `),
                            h(Text, { style: { fontSize: 7, fontWeight: 700, color: RIASEC_COLORS[code] } }, `${score}/8`)
                        )
                    )
                )
            ),
            // Personality summary
            data.personalityScores && h(View, { style: { marginBottom: 6 } },
                h(Text, { style: { fontSize: 9, fontWeight: 700, color: COLORS.PRIMARY, marginBottom: 3 } }, t('personality_profile_label', lang)),
                h(View, { style: { flexDirection: 'row', flexWrap: 'wrap', gap: 4 } },
                    ...Object.entries(data.personalityScores).map(([trait, info]) => {
                        const pct = Math.round((info.score / info.maxScore) * 100);
                        return h(View, {
                            key: trait,
                            style: {
                                flexDirection: 'row',
                                alignItems: 'center',
                                backgroundColor: COLORS.BG_ACCENT,
                                paddingHorizontal: 6,
                                paddingVertical: 3,
                                borderRadius: 3,
                            }
                        },
                            h(View, { style: { width: 6, height: 6, borderRadius: 3, backgroundColor: getTraitLevel(pct).color, marginRight: 3 } }),
                            h(Text, { style: { fontSize: 7, color: COLORS.TEXT_BODY } }, `${trait}: `),
                            h(Text, { style: { fontSize: 7, fontWeight: 700, color: getTraitLevel(pct).color } }, `${info.level} (${info.score}/${info.maxScore})`)
                        );
                    })
                )
            ),
            // Readiness summary
            data.readinessScores && h(View, { style: { marginBottom: 6 } },
                h(Text, { style: { fontSize: 9, fontWeight: 700, color: COLORS.PRIMARY, marginBottom: 3 } }, t('career_readiness_skills', lang)),
                h(View, { style: { flexDirection: 'row', flexWrap: 'wrap', gap: 4 } },
                    ...Object.entries(data.readinessScores)
                        .filter(([k]) => k !== 'overall')
                        .map(([name, info]) =>
                            h(View, {
                                key: name,
                                style: {
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    backgroundColor: COLORS.BG_ACCENT,
                                    paddingHorizontal: 6,
                                    paddingVertical: 3,
                                    borderRadius: 3,
                                }
                            },
                                h(Text, { style: { fontSize: 7, color: COLORS.TEXT_BODY } }, `${name}: `),
                                h(Text, { style: { fontSize: 7, fontWeight: 700, color: getBarColor(info.percentage) } }, `${Math.round(info.percentage)}%`)
                            )
                        )
                )
            ),
            // Top strengths & growth
            h(View, { style: { flexDirection: 'row', gap: 10 } },
                h(View, { style: { flex: 1 } },
                    h(Text, { style: { fontSize: 8, fontWeight: 700, color: COLORS.SUCCESS, marginBottom: 2 } }, t('label_strengths', lang)),
                    ...data.topStrengths.map((s, i) =>
                        h(Text, { key: `ss-${i}`, style: { fontSize: 7, color: COLORS.TEXT_BODY, marginBottom: 1 } }, `\u2022 ${s}`)
                    )
                ),
                h(View, { style: { flex: 1 } },
                    h(Text, { style: { fontSize: 8, fontWeight: 700, color: COLORS.WARNING, marginBottom: 2 } }, t('label_growth_areas', lang)),
                    ...data.areasForImprovement.map((a, i) =>
                        h(Text, { key: `sa-${i}`, style: { fontSize: 7, color: COLORS.TEXT_BODY, marginBottom: 1 } }, `\u2022 ${a}`)
                    )
                )
            )
        ),

        // Closing remarks
        h(View, { style: styles.section },
            h(Text, { style: sectionTitleStyle(lang) }, t('final_remarks', lang)),
            h(Text, { style: styles.sectionContent },
                `${t('final_remarks_prefix', lang)} ${data.studentName} ${t('final_remarks_suffix', lang)} ${data.assessmentDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}. ` +
                t('final_remarks_body', lang)
            )
        ),

        // Disclaimer
        h(View, { style: styles.disclaimer },
            h(Text, { style: styles.disclaimerTitle }, t('disclaimer_title', lang)),
            h(Text, { style: styles.disclaimerText }, t('disclaimer_student', lang))
        ),

        // Branding footer
        h(View, { style: { marginTop: 'auto', alignItems: 'center', paddingTop: 8 } },
            h(Text, { style: { fontSize: 11, fontWeight: 700, color: COLORS.PRIMARY, marginBottom: 2, fontFamily: 'Nunito' } }, 'PRAGYA'),
            h(Text, { style: { fontSize: 7, color: COLORS.TEXT_MUTED } }, t('ecosystem_tagline', lang)),
            h(Text, { style: { fontSize: 7, color: COLORS.TEXT_MUTED, marginTop: 2 } }, t('powered_by', lang))
        ),

        h(PageFooter, { reportType: REPORT_TYPE, lang })
    );
};

// ─── MALAYALAM COVER PAGE ────────────────────────────────────────────────────
const MalayalamCoverPage = ({ data }: { data: StudentReportData }) => {
    const ai = data.aiInsights;
    const performanceInfo = getPerformanceInfo(data.performanceLevel, 'ml');
    const apt = data.aptitudeScores['overall'];
    const readiness = data.readinessScores?.['overall'];

    return h(Page, { size: 'A4', style: getPageStyle('ml') },
        // Header
        h(View, { style: styles.header },
            h(Text, { style: { ...styles.headerTitle, fontFamily: 'Nunito' } },
                'PRAGYA 360\u00B0 ',
                h(Text, { style: { fontFamily: 'NotoSansMalayalam', fontSize: 16 } }, 'വിദ്യാർത്ഥി കരിയർ റിപ്പോർട്ട്')
            ),
            h(Text, { style: { ...styles.headerSubtitle, fontFamily: 'NotoSansMalayalam' } },
                `${data.assessmentDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })} ന് തയ്യാറാക്കിയത്`
            )
        ),

        // Persona card with title_ml
        ai?.title_ml && h(View, { style: styles.personaCard },
            h(Text, { style: { ...styles.personaTitle, fontFamily: 'NotoSansMalayalam', fontSize: 13 } }, ai.title_ml)
        ),

        // Student Profile
        h(View, { style: { ...styles.section, paddingVertical: 8 } },
            h(Text, { style: { ...styles.sectionTitle, fontFamily: 'NotoSansMalayalam' } }, 'വിദ്യാർത്ഥി പ്രൊഫൈൽ'),
            h(View, { style: styles.profileGrid },
                h(View, { style: styles.profileItem },
                    h(Text, { style: { ...styles.profileLabel, fontFamily: 'NotoSansMalayalam' } }, t('label_name', 'ml')),
                    h(Text, { style: styles.profileValue }, data.studentName)
                ),
                ...(data.grade ? [h(View, { style: styles.profileItem, key: 'grade' },
                    h(Text, { style: { ...styles.profileLabel, fontFamily: 'NotoSansMalayalam' } }, t('label_grade', 'ml')),
                    h(Text, { style: styles.profileValue }, data.grade)
                )] : []),
                ...(data.schoolName ? [h(View, { style: styles.profileItem, key: 'school' },
                    h(Text, { style: { ...styles.profileLabel, fontFamily: 'NotoSansMalayalam' } }, t('label_school', 'ml')),
                    h(Text, { style: styles.profileValue }, data.schoolName)
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
                h(View, { style: styles.profileItem, key: 'perf' },
                    h(Text, { style: { ...styles.profileLabel, fontFamily: 'NotoSansMalayalam' } }, t('label_performance', 'ml')),
                    h(Text, { style: { ...styles.profileValue, color: performanceInfo.color, fontWeight: 700, fontFamily: 'NotoSansMalayalam' } }, performanceInfo.label)
                )
            )
        ),

        // Performance Overview Rings
        h(View, { style: { ...styles.section, padding: 10 } },
            h(Text, { style: { ...styles.sectionTitle, fontFamily: 'NotoSansMalayalam' } }, t('performance_overview', 'ml')),
            h(View, { style: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'flex-start', marginTop: 2 } },
                h(ScoreRing, { value: data.weightedScore, max: 100, label: t('label_overall_score', 'ml'), color: performanceInfo.color }),
                h(View, { style: { alignItems: 'center', width: 84 } },
                    h(View, {
                        style: {
                            backgroundColor: performanceInfo.color,
                            paddingHorizontal: 12,
                            paddingVertical: 6,
                            borderRadius: 6,
                        }
                    },
                        h(Text, { style: { fontSize: 10, fontWeight: 700, color: '#FFFFFF', textAlign: 'center', fontFamily: 'NotoSansMalayalam' } }, performanceInfo.label)
                    ),
                    h(Text, { style: { fontSize: 7, fontWeight: 600, color: COLORS.TEXT_DARK, textAlign: 'center', marginTop: 4, fontFamily: 'NotoSansMalayalam' } }, t('label_performance_level', 'ml'))
                ),
                apt && h(ScoreRing, { value: Math.round(apt.percentage), max: 100, label: t('label_aptitude', 'ml') }),
                readiness && h(ScoreRing, { value: Math.round(readiness.percentage), max: 100, label: t('label_readiness', 'ml') }),
                h(ScoreRing, { value: data.academicReadinessIndex, max: 100, label: t('label_academic_readiness', 'ml') })
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
/**
 * Parse the analysis_ml text into sections based on **header** markers.
 * Returns array of { header, body } objects.
 */
const parseMalayalamSections = (text: string): { header: string; body: string }[] => {
    if (!text) return [];
    // Split on lines that start with ** (section headers)
    const parts = text.split(/\n*\*\*([^*]+)\*\*\n*/);
    const sections: { header: string; body: string }[] = [];
    // parts[0] is text before first header (usually empty)
    // Then alternating: header, body, header, body...
    for (let i = 1; i < parts.length; i += 2) {
        const header = parts[i]?.trim();
        const body = parts[i + 1]?.trim();
        if (header && body) {
            sections.push({ header, body });
        }
    }
    return sections;
};

/**
 * Renders 1-2 pages of Malayalam narrative analysis.
 * Splits content across pages to avoid overflow.
 */
const MalayalamAnalysisPages = ({ data }: { data: StudentReportData }): React.ReactElement[] => {
    const ai = data.aiInsights;
    const analysisMl = ai?.analysis_ml || '';
    const sections = parseMalayalamSections(analysisMl);

    if (sections.length === 0) {
        // No analysis available — render a single placeholder page
        return [
            h(Page, { key: 'ml-analysis-1', size: 'A4', style: getPageStyle('ml') },
                h(Text, { style: { ...styles.pageTitle, fontFamily: 'NotoSansMalayalam' } },
                    'കരിയർ വിശകലനം'),
                h(View, { style: styles.section },
                    h(Text, { style: { ...styles.sectionContent, fontFamily: 'NotoSansMalayalam' } },
                        'മലയാളം വിശകലനം ലഭ്യമല്ല. ദയവായി ഇംഗ്ലീഷ് പതിപ്പ് പരിശോധിക്കുക.')
                ),
                h(PageFooter, { reportType: REPORT_TYPE, lang: 'ml' })
            ),
        ];
    }

    // Split sections into two groups for two pages
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

    // Page 1 of analysis
    pages.push(
        h(Page, { key: 'ml-analysis-1', size: 'A4', style: getPageStyle('ml') },
            h(Text, { style: { ...styles.pageTitle, fontFamily: 'NotoSansMalayalam', textTransform: 'none' } },
                'കരിയർ വിശകലനം'),
            ...renderSections(page1Sections),
            h(PageFooter, { reportType: REPORT_TYPE, lang: 'ml' })
        )
    );

    // Page 2 of analysis (if content remains)
    if (page2Sections.length > 0) {
        pages.push(
            h(Page, { key: 'ml-analysis-2', size: 'A4', style: getPageStyle('ml') },
                h(Text, { style: { ...styles.pageTitle, fontFamily: 'NotoSansMalayalam', textTransform: 'none' } },
                    'കരിയർ വിശകലനം (തുടർച്ച)'),
                ...renderSections(page2Sections),

                // Disclaimer
                h(View, { style: { ...styles.disclaimer, marginTop: 8 } },
                    h(Text, { style: { ...styles.disclaimerTitle, fontFamily: 'NotoSansMalayalam' } }, t('disclaimer_title', 'ml')),
                    h(Text, { style: { ...styles.disclaimerText, fontFamily: 'NotoSansMalayalam' } }, t('disclaimer_student', 'ml'))
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
export const StudentReportDocument = ({ data }: { data: StudentReportData }) => {
    return h(Document, {},
        // English pages (1-6)
        h(StudentPage1, { data, lang: 'en' }),
        h(StudentPage2, { data, lang: 'en' }),
        h(StudentPage3, { data, lang: 'en' }),
        h(StudentPage4, { data, lang: 'en' }),
        h(StudentPage5, { data, lang: 'en' }),
        h(StudentPage6, { data, lang: 'en' }),
        // Malayalam pages (cover + 1-2 analysis pages)
        h(MalayalamCoverPage, { data }),
        ...MalayalamAnalysisPages({ data }),
    );
};
