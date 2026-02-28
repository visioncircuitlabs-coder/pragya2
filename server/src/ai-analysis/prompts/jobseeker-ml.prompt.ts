import { ComprehensiveScores } from '../../assessments/scoring.service';
import { CareerMatch } from '../../assessments/careers.service';
import { CandidateProfile } from '../ai-analysis.service';
import { SectorMatchResult } from '../../assessments/sector-matching.service';

const RIASEC_NAMES: Record<string, string> = {
    R: 'Realistic',
    I: 'Investigative',
    A: 'Artistic',
    S: 'Social',
    E: 'Enterprising',
    C: 'Conventional',
};

/**
 * Builds the Gemini prompt for generating a native Malayalam career analysis
 * for job-seekers. Produces a comprehensive, conversational Malayalam narrative
 * in a single Gemini call (same pattern as buildStudentMalayalamPrompt).
 */
export function buildJobSeekerMalayalamPrompt(
    profile: CandidateProfile,
    scores: ComprehensiveScores,
    careerMatches: CareerMatch[],
    sectorMatches?: SectorMatchResult,
): string {
    // Aptitude lines
    const aptitudeLines = Object.entries(scores.aptitude)
        .filter(([key]) => key !== 'overall')
        .map(([section, data]: [string, any]) => `- ${section}: ${data.percentage}% (${data.correct}/${data.total} correct)`)
        .join('\n');
    const overallAptitude = scores.aptitude.overall?.percentage || 0;

    // RIASEC lines
    const riasecLines = (['R', 'I', 'A', 'S', 'E', 'C'] as const)
        .map(code => `- ${RIASEC_NAMES[code]} (${code}): ${scores.riasec[code]}/32`)
        .join('\n');
    const hollandCodeExpanded = scores.riasecCode.split('').map(c => RIASEC_NAMES[c] || c).join('-');

    // Employability lines
    const employabilityLines = Object.entries(scores.employability)
        .filter(([key]) => key !== 'overall')
        .map(([section, data]: [string, any]) => `- ${section}: ${data.percentage}%`)
        .join('\n');
    const overallEmployability = scores.employability.overall?.percentage || 0;

    // Personality lines
    const personalityLines = Object.entries(scores.personality)
        .map(([trait, data]: [string, any]) => `- ${trait}: ${data.average}/5.0 (${data.level})`)
        .join('\n');

    // Composite score
    const personalityAverages = Object.values(scores.personality).map((p: any) => p.average);
    const avgPersonality = personalityAverages.length > 0
        ? personalityAverages.reduce((a: number, b: number) => a + b, 0) / personalityAverages.length
        : 0;
    const personalityPct = Math.round(((avgPersonality - 1) / 4) * 100);
    const compositeScore = Math.round(
        overallAptitude * 0.35 +
        overallEmployability * 0.35 +
        personalityPct * 0.30,
    );

    // Sector match lines
    const topSectors = sectorMatches?.topSectors?.slice(0, 6) || [];
    const sectorLines = topSectors.length > 0
        ? topSectors.map((sm, i) =>
            `${i + 1}. ${sm.sector.name} — ${sm.matchScore}% match (Interest: ${sm.riasecFit}%, Aptitude: ${sm.aptitudeFit}%, Personality: ${sm.personalityFit}%, Readiness: ${sm.employabilityFit}%)\n   Example roles: ${sm.sector.exampleRoles.join(', ')}`
        ).join('\n')
        : '';

    // Career match lines
    const careerLines = careerMatches.slice(0, 8)
        .map(c => `- ${c.title} (${c.matchScore}% match)`)
        .join('\n');

    return `You are a SENIOR CAREER COUNSELOR in Kerala, speaking DIRECTLY to a job-seeker/professional.
Write the ENTIRE analysis in Malayalam as a warm, encouraging, conversational career guidance narrative.

## CRITICAL LANGUAGE RULES:
1. Write EVERYTHING in Malayalam script. The ONLY English allowed is:
   - Numbers and percentages (e.g., 75%, 6/32)
   - Holland Code letters (e.g., RIA, RIASEC)
   - Career titles and sector names (e.g., Software Developer, Healthcare & Medicine)
   - Section names from the assessment (e.g., Numerical Reasoning, Stress Tolerance)
2. Use simple, conversational Malayalam — as if you are sitting with the candidate and explaining their results face-to-face
3. NEVER use negative language. "Average" is the FLOOR — use "ശരാശരി" or "വളരുന്ന" for lower scores, NEVER "ദുർബലം" or "മോശം"
4. Reference actual scores and data naturally in the text — do not be vague
5. Address the candidate directly using "നിങ്ങൾ" / "നിങ്ങളുടെ"

## CANDIDATE PROFILE
Name: ${profile.fullName}
${profile.age ? `Age: ${profile.age}` : ''}
${profile.gender ? `Gender: ${profile.gender}` : ''}
${profile.location ? `Location: ${profile.location}` : ''}
${profile.education ? `Education: ${profile.education}` : ''}
${profile.currentRole ? `Current Role: ${profile.currentRole}` : ''}

## MODULE 1: APTITUDE TEST RESULTS (0-100%)
${aptitudeLines}
- Overall Aptitude: ${overallAptitude}%

## MODULE 2: CAREER INTEREST INVENTORY (RIASEC)
Holland Code: ${scores.riasecCode} (${hollandCodeExpanded})
${riasecLines}

## MODULE 3: EMPLOYABILITY SKILLS (0-100%)
${employabilityLines}
- Overall Employability: ${overallEmployability}%

## MODULE 4: PERSONALITY TRAITS (1-5 scale, higher = stronger)
${personalityLines}

## COMPOSITE PERFORMANCE SCORE: ${compositeScore}/100
## CAREER DIRECTION CLARITY INDEX: ${scores.clarityIndex}/100

${sectorLines ? `## MATCHED SECTORS\n${sectorLines}` : ''}
${careerLines ? `## MATCHED CAREERS\n${careerLines}` : ''}

## WRITE THE ANALYSIS WITH THESE SECTIONS (use these exact Malayalam headers):

1. **നിങ്ങളെ കുറിച്ച്** — Professional persona, what makes their combination unique. Give them a creative persona title (in English, like "The Strategic Analyst") and explain in Malayalam what makes them special. ~120-180 words.

2. **ബൗദ്ധിക കഴിവുകൾ** — Aptitude analysis per section. Highlight strongest and developing areas. What do these scores mean for their career path? ~120-150 words.

3. **കരിയർ താൽപ്പര്യങ്ങൾ** — RIASEC / Holland Code interpretation. Explain what ${scores.riasecCode} (${hollandCodeExpanded}) means in simple Malayalam. What kind of work environments and activities suit them? ~100-120 words.

4. **വ്യക്തിത്വ ഗുണങ്ങൾ** — Personality traits analysis. What do their strong/moderate/emerging traits mean for their career and workplace effectiveness? ~100-120 words.

5. **തൊഴിൽ സന്നദ്ധത** — Employability skills readiness. Which skills are job-ready? Which need development? Practical suggestions. ~100-120 words.

6. **ശുപാർശ ചെയ്യുന്ന മേഖലകൾ** — Recommended SECTORS first (industry sectors like "IT & Software", "Healthcare"), then specific career roles within those sectors. Reference actual matched sectors and careers from the data. Explain WHY each sector fits. ~150-200 words.

7. **വളർച്ചയ്ക്കുള്ള നിർദ്ദേശങ്ങൾ** — Development roadmap with three phases: immediate (1-3 months), short-term (3-6 months), medium-term (6-12 months). Actionable, specific, tied to their weakest areas. ~120-150 words.

8. **അടുത്ത ഘട്ടങ്ങൾ** — 4-5 immediate, actionable next steps the candidate can take right now. ~80-100 words.

## OUTPUT FORMAT:
Return ONLY a JSON object with exactly these two keys:
{
  "title_ml": "A creative persona title in English (e.g., 'The Strategic Analyst') followed by a one-line Malayalam description",
  "analysis_ml": "The full Malayalam narrative with section headers. Use **header** format for section titles. Separate sections with two newlines."
}

Total analysis_ml length: approximately 1200-1800 words in Malayalam.`;
}
