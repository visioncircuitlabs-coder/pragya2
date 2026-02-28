import { ComprehensiveScores } from '../../assessments/scoring.service';
import { CareerMatch } from '../../assessments/careers.service';
import { CandidateProfile } from '../ai-analysis.service';
import { SectorMatchResult } from '../../assessments/sector-matching.service';

/**
 * Builds the Gemini prompt for job seeker employability analysis
 * Enhanced with sector-based matching data for world-class career guidance
 */
export function buildJobSeekerPrompt(
  profile: CandidateProfile,
  scores: ComprehensiveScores,
  careerMatches: CareerMatch[],
  sectorMatches?: SectorMatchResult,
): string {
  const personalityAverages = Object.values(scores.personality).map((p: any) => p.average);
  const avgPersonality = personalityAverages.length > 0
    ? personalityAverages.reduce((a: number, b: number) => a + b, 0) / personalityAverages.length
    : 0;
  // Normalized: 1.0 → 0%, 5.0 → 100% (removes Likert floor)
  const personalityPct = Math.round(((avgPersonality - 1) / 4) * 100);
  const compositeScore = Math.round(
    scores.aptitude.overall.percentage * 0.35 +
    scores.employability.overall.percentage * 0.35 +
    personalityPct * 0.30
  );

  // Build sector match context
  const topSectors = sectorMatches?.topSectors?.slice(0, 6) || [];
  const sectorContext = topSectors.length > 0
    ? topSectors.map((sm, i) =>
      `${i + 1}. ${sm.sector.name} — ${sm.matchScore}% match (Interest: ${sm.riasecFit}%, Aptitude: ${sm.aptitudeFit}%, Personality: ${sm.personalityFit}%, Readiness: ${sm.employabilityFit}%)\n   Example roles: ${sm.sector.exampleRoles.join(', ')}\n   Readiness: ${sm.readinessLevel}`
    ).join('\n')
    : 'No sector data available — use RIASEC code to infer sectors.';

  return `You are an expert career counselor, psychometrician, and workforce development specialist creating a comprehensive, professional-grade employability report. This report will be downloaded as a PDF and shared with educators, parents, and career mentors. You must write with depth, specificity, and empathy.

## CRITICAL RULES:
1. **"AVERAGE" IS THE FLOOR**: NEVER use "Weak", "Poor", "Bad", "Low", or "Below Average". Use "Developing", "Emerging", or "Building Foundation" for low scores.
2. **SECTOR-FIRST, NOT JOB-TITLE-FIRST**: Your career recommendations must focus on INDUSTRY SECTORS (e.g., "Creative & Media", "Healthcare & Medicine"), NOT specific job titles. You may mention example roles WITHIN sectors, but the primary guidance is sector-based.
3. **BE THOROUGH**: Each text section should be 3-6 sentences. This is a professional report, not a summary. Provide depth.
4. **BE SPECIFIC TO THEIR DATA**: Reference actual score values, specific trait names, and concrete observations. Avoid generic advice.
5. **PROFESSIONAL BUT WARM**: Talk TO the candidate, by name when possible. Be empowering and actionable.

## CANDIDATE PROFILE
Name: ${profile.fullName}
${profile.age ? `Age: ${profile.age}` : ''}
${profile.gender ? `Gender: ${profile.gender}` : ''}
${profile.location ? `Location: ${profile.location}` : ''}
${profile.education ? `Education: ${profile.education}` : ''}
${profile.currentRole ? `Current Role: ${profile.currentRole}` : ''}

## ASSESSMENT DATA

### APTITUDE SCORES (percentage correct per section)
${Object.entries(scores.aptitude)
      .filter(([key]) => key !== 'overall')
      .map(([section, data]: [string, any]) => `- ${section}: ${data.percentage}% (${data.correct}/${data.total} correct)`)
      .join('\n')}
- Overall Aptitude: ${scores.aptitude.overall.percentage}%

### CAREER INTEREST PROFILE (RIASEC)
Holland Code: ${scores.riasecCode}
- Realistic (hands-on, practical): ${scores.riasec.R}/32
- Investigative (analytical, research): ${scores.riasec.I}/32
- Artistic (creative, expressive): ${scores.riasec.A}/32
- Social (helping, teaching): ${scores.riasec.S}/32
- Enterprising (leadership, persuasion): ${scores.riasec.E}/32
- Conventional (organized, systematic): ${scores.riasec.C}/32

### EMPLOYABILITY SKILLS
${Object.entries(scores.employability)
      .filter(([key]) => key !== 'overall')
      .map(([section, data]: [string, any]) => `- ${section}: ${data.percentage}%`)
      .join('\n')}
- Overall Employability: ${scores.employability.overall.percentage}%

### PERSONALITY TRAITS (1-5 scale, higher = stronger)
${Object.entries(scores.personality)
      .map(([trait, data]: [string, any]) => `- ${trait}: ${data.average}/5.0 (${data.level})`)
      .join('\n')}

### SECTOR MATCH RESULTS (Algorithm-Calculated)
${sectorContext}

### CAREER DIRECTION CLARITY INDEX: ${scores.clarityIndex}/100
### COMPOSITE PERFORMANCE SCORE: ${compositeScore}/100 (Aptitude 35% + Employability 35% + Personality 30%)

## GENERATE THE FOLLOWING (JSON FORMAT)

1. **professionalPersona**: Create a meaningful professional identity:
   - **title**: A creative, empowering persona title (e.g., "The Strategic Analyst", "The Empathetic Innovator", "The Creative Craftsman"). Base this on their strongest RIASEC type and personality traits.
   - **description**: 3-4 sentences describing their professional identity, work style, and what makes them unique. Reference their actual scores.
   - **superpower**: One specific professional strength backed by their best score.

2. **performanceDimensions**: Rate these 5 dimensions (1-10 with 2-sentence justification each):
   - **cognitiveAgility**: Based on aptitude scores — how well they process, reason, and solve problems
   - **professionalReadiness**: Based on employability scores — functional workplace competencies
   - **careerAlignment**: Based on RIASEC focus + clarity index — how focused their career direction is
   - **interpersonalImpact**: Based on personality traits — teamwork, communication, social engagement
   - **growthTrajectory**: Overall growth potential combining all scores

3. **employabilitySummary**: 4-6 sentences providing a thorough overview of their job readiness, key strengths, and areas to develop. Be specific to their scores.

4. **aptitudeAnalysis**: 4-5 sentences analyzing their cognitive abilities. Mention specific sections by name and score, identify patterns (e.g., "strong verbal but developing numerical").

5. **careerInterestAlignment**: 4-5 sentences interpreting their RIASEC code "${scores.riasecCode}". Explain what this combination means for their career direction, and how strongly differentiated their interests are.

6. **personalitySnapshot**: 4-5 sentences about their personality traits. Identify their 2 strongest traits and how they'd manifest in a workplace. Mention any notable patterns.

7. **skillReadiness**: 3-4 sentences on employability skills readiness. Identify which workplace skills are strongest and what needs development.

8. **sectorRecommendations**: Based on the sector match data provided above, recommend sectors (NOT individual jobs):
   - **primarySectors**: Top 2-3 sectors with brief (2-sentence) explanation of why they fit
   - **growthSectors**: 2 sectors they could grow into with upskilling (1-sentence each)
   - **sectorsToAvoid**: Brief note on which sectors are least suited and why (1-2 sentences)

9. **careerRecommendations**: Within the recommended sectors, suggest specific roles:
   - **primaryRoles**: [3-4 specific roles from top sectors] — these are roles where their current profile is a natural fit
   - **growthRoles**: [2-3 roles] — roles they could pursue after targeted development
   - **rolesToAvoid**: Brief note on roles that conflict with their profile

10. **developmentRoadmap**: 5-8 sentences providing a structured development plan. Include:
    - Immediate actions (next 1-3 months)
    - Short-term goals (3-6 months)
    - Medium-term vision (6-12 months)
    This should be actionable, specific, and tied to their weakest areas.

11. **clarityIndex**: { level: "LOW" | "MEDIUM" | "HIGH", justification: "2 sentences explaining" }

12. **detailedTraitInterpretation**: For each personality trait, provide a 2-sentence interpretation of what their score means in a work context. Return as an object with trait names as keys and interpretation strings as values.

Respond in this exact JSON format:
{
  "professionalPersona": {
    "title": "...",
    "description": "... (3-4 sentences)",
    "superpower": "..."
  },
  "performanceDimensions": {
    "cognitiveAgility": { "score": 7, "description": "... (2 sentences)" },
    "professionalReadiness": { "score": 6, "description": "... (2 sentences)" },
    "careerAlignment": { "score": 5, "description": "... (2 sentences)" },
    "interpersonalImpact": { "score": 8, "description": "... (2 sentences)" },
    "growthTrajectory": { "score": 7, "description": "... (2 sentences)" }
  },
  "employabilitySummary": "... (4-6 sentences)",
  "aptitudeAnalysis": "... (4-5 sentences)",
  "careerInterestAlignment": "... (4-5 sentences)",
  "personalitySnapshot": "... (4-5 sentences)",
  "skillReadiness": "... (3-4 sentences)",
  "sectorRecommendations": {
    "primarySectors": [
      { "name": "...", "explanation": "... (2 sentences)" }
    ],
    "growthSectors": [
      { "name": "...", "explanation": "... (1 sentence)" }
    ],
    "sectorsToAvoid": "... (1-2 sentences)"
  },
  "careerRecommendations": {
    "primaryRoles": ["...", "...", "..."],
    "growthRoles": ["...", "..."],
    "rolesToAvoid": "..."
  },
  "developmentRoadmap": "... (5-8 sentences)",
  "clarityIndex": {
    "level": "HIGH",
    "justification": "... (2 sentences)"
  },
  "detailedTraitInterpretation": {
    "Work Discipline & Task Reliability": "... (2 sentences)",
    "Stress Tolerance & Emotional Regulation": "... (2 sentences)",
    "Learning & Change Orientation": "... (2 sentences)",
    "Social Engagement & Task Focus": "... (2 sentences)",
    "Team Compatibility & Cooperation": "... (2 sentences)",
    "Integrity & Responsibility": "... (2 sentences)"
  }
}`;
}
