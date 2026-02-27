import { StudentProfile } from '../ai-analysis.service';
import { AptitudeScores, StudentRiasecScores, StudentPersonalityScores, StudentReadinessScores } from '../../assessments/scoring.service';

const RIASEC_NAMES: Record<string, string> = {
    R: 'Realistic',
    I: 'Investigative',
    A: 'Artistic',
    S: 'Social',
    E: 'Enterprising',
    C: 'Conventional',
};

/**
 * Builds the Gemini prompt for student 4-module career assessment
 * Modules: Aptitude, RIASEC, Personality Traits, Skill & Career Readiness
 */
export function buildStudentPrompt(
    profile: StudentProfile,
    aptitudeScores: AptitudeScores,
    riasecScores: StudentRiasecScores,
    riasecCode: string,
    personalityScores: StudentPersonalityScores,
    readinessScores: StudentReadinessScores,
): string {
    // Aptitude lines
    const aptitudeLines = Object.entries(aptitudeScores)
        .filter(([key]) => key !== 'overall')
        .map(([section, data]) => `- ${section}: ${data.percentage}%`)
        .join('\n');
    const overallAptitude = aptitudeScores['overall']?.percentage || 0;

    // RIASEC lines
    const riasecLines = Object.entries(riasecScores)
        .map(([code, score]) => `- ${RIASEC_NAMES[code] || code} (${code}): ${score}/8`)
        .join('\n');
    const hollandCodeExpanded = riasecCode.split('').map(c => RIASEC_NAMES[c] || c).join('-');

    // Personality lines
    const personalityLines = Object.entries(personalityScores)
        .map(([trait, data]) => `- ${trait}: ${data.score}/${data.maxScore} — ${data.level}`)
        .join('\n');

    // Readiness lines
    const readinessLines = Object.entries(readinessScores)
        .filter(([key]) => key !== 'overall')
        .map(([section, data]) => `- ${section}: ${data.score}/${data.maxScore} (${data.percentage}%)`)
        .join('\n');
    const overallReadiness = readinessScores['overall']?.percentage || 0;

    return `You are a warm, encouraging, but direct senior career mentor and teacher for school students.
Generate a comprehensive personalized career guidance report based on their 4-module assessment.

## CORE RULES (CRITICAL):
1. **"AVERAGE" IS THE FLOOR**: NEVER use words like "Weak", "Poor", "Bad", "Low", or "Below Average".
   - If a score is low, describe it as "**Average**", "**Developing**", or "**Ready for Growth**".
2. **TEACHER TONE**: Be specific, actionable, and inspiring. Talk *to* the student, not *about* them.
3. **USE ALL 4 MODULES**: Your analysis MUST incorporate data from ALL modules — Aptitude, RIASEC, Personality, AND Readiness. Do not ignore any module.
4. **SMART CAREER MATCHING**: Suggest careers that:
   - **MAXIMIZE** their high-scoring areas and Holland Code.
   - **MINIMIZE** reliance on their lower-scoring areas.
   - Use their personality traits and readiness skills to refine fit.
5. **NO GENERIC ADVICE**: Be specific. Instead of "Improve time management", say "Try the Pomodoro technique (25 min work, 5 min break)."

## STUDENT PROFILE
Name: ${profile.fullName}
${profile.grade ? `Grade: ${profile.grade}` : ''}
${profile.schoolName ? `School: ${profile.schoolName}` : ''}
${profile.location ? `Location: ${profile.location}` : ''}

## MODULE 1: APTITUDE TEST RESULTS (0-100%)
${aptitudeLines}
- Overall Score: ${overallAptitude}%

## MODULE 2: CAREER INTEREST INVENTORY (RIASEC)
Holland Code: ${riasecCode} (${hollandCodeExpanded})
${riasecLines}

## MODULE 3: PERSONALITY TRAITS (3-point scale per question, 6 questions per trait)
${personalityLines}

## MODULE 4: SKILL & CAREER READINESS (4-point scale per question, 6 questions per section)
${readinessLines}
- Overall Readiness: ${overallReadiness}%

## GENERATE THE FOLLOWING IN JSON FORMAT:

1. **studentPersona**:
   - **title**: A creative, positive title combining aptitude + RIASEC insight (e.g., "The Logical Architect", "The Creative Diplomat", "The Analytical Explorer").
   - **description**: 2 sentences explaining their learning style, personality, and interests.
   - **superpower**: One unique strength derived from their top aptitude + RIASEC code.
2. **overallSummary**: 3-4 sentences summarizing their complete 4-module profile. Mention Holland Code, top aptitude areas, personality strengths, and readiness.
3. **strengthsAnalysis**: Highlight 3-4 strongest areas across ALL modules.
4. **areasForGrowth**: 2-3 areas to develop (Use "Developing" or "Focus Area" language only).
5. **riasecAnalysis**: 2-3 sentences interpreting their Holland Code ${riasecCode} (${hollandCodeExpanded}). What work environments, activities, and values does this suggest?
6. **personalityAnalysis**: 2-3 sentences interpreting their personality profile. What do their strongest traits mean for their academic and career path?
7. **readinessAnalysis**: 2-3 sentences on their skill readiness. Where are they career-ready, and what skills need development?
8. **academicStreams**:
   - recommended: Array of 2-3 academic streams informed by RIASEC + aptitude.
   - reasoning: Why these fit their combined profile.
9. **careerGuidance**:
   - **suggestedCareers**: Array of 4-6 objects with:
     - "role": Job title
     - "fitReason": Specific reason linking to their RIASEC code, aptitude scores, and personality (e.g., "Fits your ${riasecCode} code + high ${Object.entries(aptitudeScores).filter(([k]) => k !== 'overall').sort((a, b) => b[1].percentage - a[1].percentage)[0]?.[0] || 'aptitude'}")
   - **skillsToDevelop**: 4-5 actionable skills based on readiness gaps.
10. **sectorRecommendations**:
    - **topSectors**: 3-4 industry sectors (e.g., "Technology", "Healthcare", "Creative Arts").
    - **reasoning**: Brief explanation of why.
11. **studyTips**: Specific, actionable study techniques tailored to their personality and aptitude profile.
12. **nextSteps**: Immediate recommended actions.

Respond ONLY in this JSON format:
{
  "studentPersona": {
    "title": "...",
    "description": "...",
    "superpower": "..."
  },
  "overallSummary": "...",
  "strengthsAnalysis": "...",
  "areasForGrowth": "...",
  "riasecAnalysis": "...",
  "personalityAnalysis": "...",
  "readinessAnalysis": "...",
  "academicStreams": {
    "recommended": ["...", "..."],
    "reasoning": "..."
  },
  "careerGuidance": {
    "suggestedCareers": [
      { "role": "...", "fitReason": "..." },
      { "role": "...", "fitReason": "..." }
    ],
    "skillsToDevelop": ["...", "..."]
  },
  "sectorRecommendations": {
    "topSectors": ["...", "..."],
    "reasoning": "..."
  },
  "studyTips": "...",
  "nextSteps": "..."
}`;
}
