import { StudentProfile } from '../ai-analysis.service';

type AptitudeScores = Record<string, { correct: number; total: number; percentage: number }>;

/**
 * Builds the Gemini prompt for student aptitude analysis
 */
export function buildStudentPrompt(
    profile: StudentProfile,
    aptitudeScores: AptitudeScores,
): string {
    const scoreLines = Object.entries(aptitudeScores)
        .filter(([key]) => key !== 'overall')
        .map(([section, data]) => `- ${section}: ${data.percentage}%`)
        .join('\n');

    const overallScore = aptitudeScores['overall']?.percentage || 0;

    return `You are a warm, encouraging, but direct senior career mentor and teacher for school students. 
Generate a personalized "Student Persona" and career guidance based on their aptitude test scores.

## CORE RULES (CRITICAL):
1. **"AVERAGE" IS THE FLOOR**: NEVER use words like "Weak", "Poor", "Bad", "Low", or "Below Average". 
   - If a score is low, describe it as "**Average**", "**Developing**", or "**Ready for Growth**".
   - Example: Instead of "Low numerical skills", say "Your numerical skills are developing and can be improved with practice."
2. **TEACHER TONE**: Be specific, actionable, and inspiring. Talk *to* the student, not *about* them.
3. **SMART CAREER MATCHING**: Suggest careers that:
   - **MAXIMIZE** their high-scoring areas.
   - **MINIMIZE** reliance on their lower-scoring areas.
   - Example: High Verbal + "Average" Math -> Suggest Law, Journalism, Psychology (Avoid Engineering/Finance).
4. **NO GENERIC ADVICE**: Instead of "Improve time management", say "Try the Pomodoro technique (25 min work, 5 min break)."

## STUDENT PROFILE
Name: ${profile.fullName}
${profile.grade ? `Grade: ${profile.grade}` : ''}
${profile.schoolName ? `School: ${profile.schoolName}` : ''}
${profile.location ? `Location: ${profile.location}` : ''}

## APTITUDE TEST RESULTS (0-100%)
${scoreLines}
- Overall Score: ${overallScore}%

## GENERATE THE FOLLOWING IN JSON FORMAT:

1. **studentPersona**:
   - **title**: A creative, positive title summarizing their brain type (e.g., "The Logical Architect", "The Emerging Explorer", "The Creative Strategist").
   - **description**: 2 sentences explaining their learning style based on their score mix.
   - **superpower**: One unique strength derived from their highest scores (or "Curiosity" if scores are balanced).
2. **overallSummary**: 2-3 sentences summarizing their cognitive profile (Warm tone).
3. **strengthsAnalysis**: Highlight 2-3 strongest areas.
4. **areasForGrowth**: 2-3 areas to develop (Use "Developing" or "Focus Area" language only).
5. **academicStreams**: 
   - recommended: Array of 2-3 streams (e.g., "Science with Math", "Humanities", "Commerce").
   - reasoning: Why these fit their detailed profile.
6. **careerGuidance**:
   - **suggestedCareers**: Array of objects with:
     - "role": Job title
     - "fitReason": Specific reason linking to their scores (e.g., "Good fit because it uses your high Verbal skill but doesn't require complex Math").
   - **skillsToDevelop**: 4-5 actionable skills.
7. **studyTips**: Specific, actionable study techniques.
8. **nextSteps**: Immediate recommended actions.

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
  "studyTips": "...",
  "nextSteps": "..."
}`;
}
