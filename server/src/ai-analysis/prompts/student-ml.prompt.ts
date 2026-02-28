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
 * Builds the Gemini prompt for generating a native Malayalam career analysis.
 * Instead of translating English insights, this produces a comprehensive
 * career counselor narrative written directly in Malayalam.
 */
export function buildStudentMalayalamPrompt(
    profile: StudentProfile,
    aptitudeScores: AptitudeScores,
    riasecScores: StudentRiasecScores,
    riasecCode: string,
    personalityScores: StudentPersonalityScores,
    readinessScores: StudentReadinessScores,
    careerMatches?: { title: string; matchScore: number }[],
    sectorMatches?: { name: string; matchScore: number }[],
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

    // Career matches
    const careerLines = (careerMatches || []).slice(0, 8)
        .map(c => `- ${c.title} (${c.matchScore}% match)`)
        .join('\n');

    // Sector matches
    const sectorLines = (sectorMatches || []).slice(0, 6)
        .map(s => `- ${s.name} (${s.matchScore}% match)`)
        .join('\n');

    return `You are a SENIOR CAREER COUNSELOR in Kerala, speaking DIRECTLY to a school student.
Write the ENTIRE analysis in Malayalam as a warm, encouraging, conversational career guidance narrative.

## CRITICAL LANGUAGE RULES:
1. Write EVERYTHING in Malayalam script. The ONLY English allowed is:
   - Numbers and percentages (e.g., 75%, 6/8)
   - Holland Code letters (e.g., RIA, RIASEC)
   - Career titles (e.g., Software Developer, Data Scientist)
   - Section names from the assessment (e.g., Numerical Reasoning, Stress Tolerance)
2. Use simple, conversational Malayalam — as if you are sitting with the student and explaining their results face-to-face
3. NEVER use negative language. "Average" is the FLOOR — use "ശരാശരി" or "വളരുന്ന" for lower scores, NEVER "ദുർബലം" or "മോശം"
4. Reference actual scores and data naturally in the text — do not be vague
5. Address the student directly using "നിങ്ങൾ" / "നിങ്ങളുടെ"

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

## MODULE 3: PERSONALITY TRAITS (4-point scale per question, 6 questions per trait)
${personalityLines}

## MODULE 4: SKILL & CAREER READINESS (4-point scale per question, 6 questions per section)
${readinessLines}
- Overall Readiness: ${overallReadiness}%

${careerLines ? `## MATCHED CAREERS\n${careerLines}` : ''}
${sectorLines ? `## MATCHED SECTORS\n${sectorLines}` : ''}

## WRITE THE ANALYSIS WITH THESE SECTIONS (use these exact Malayalam headers):

1. **നിങ്ങളെ കുറിച്ച്** — Who is this student? What is their unique combination? Give them a creative persona title (in English, like "The Logical Architect") and explain in Malayalam what makes them special. ~100-150 words.

2. **ബൗദ്ധിക കഴിവുകൾ** — Aptitude analysis. Discuss each section's score, highlight the strongest and developing areas. What do these scores mean for their academic path? ~100-150 words.

3. **കരിയർ താൽപ്പര്യങ്ങൾ** — RIASEC / Holland Code interpretation. Explain what ${riasecCode} (${hollandCodeExpanded}) means in simple Malayalam. What kind of work environments and activities suit them? ~100-120 words.

4. **വ്യക്തിത്വ ഗുണങ്ങൾ** — Personality traits analysis. What do their strong/moderate/emerging traits mean for their career and life? ~100-120 words.

5. **കരിയർ സന്നദ്ധത** — Career readiness skills analysis. Which skills are strong? Which need development? Practical suggestions. ~100-120 words.

6. **ശുപാർശ ചെയ്യുന്ന കരിയറുകൾ** — Recommended careers, sectors, and academic streams. Reference actual matched careers and sectors from the data. Explain WHY each fits. ~150-200 words.

7. **വളർച്ചയ്ക്കുള്ള നിർദ്ദേശങ്ങൾ** — Specific skills to develop, study techniques suited to their personality, practical improvement tips. ~100-150 words.

8. **അടുത്ത ഘട്ടങ്ങൾ** — 4-5 immediate, actionable next steps the student can take. ~80-100 words.

## OUTPUT FORMAT:
Return ONLY a JSON object with exactly these two keys:
{
  "title_ml": "A creative persona title in English (e.g., 'The Analytical Explorer') followed by a one-line Malayalam description",
  "analysis_ml": "The full Malayalam narrative with section headers. Use **header** format for section titles. Separate sections with two newlines."
}

Total analysis_ml length: approximately 1000-1500 words in Malayalam.`;
}
