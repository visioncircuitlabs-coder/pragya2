/**
 * English static text dictionary for PDF reports.
 * Keys are referenced by t(key, lang) in report components.
 */
export const en: Record<string, string> = {
    // ─── Common / Footer ─────────────────────────────────────────────────────
    footer_confidential: 'Confidential',
    powered_by: 'Powered by Vision Circuit Labs',
    ecosystem_tagline: "India's Pioneer Youth-Developed Career Ecosystem",

    // ─── Disclaimer ──────────────────────────────────────────────────────────
    disclaimer_title: 'Disclaimer',
    disclaimer_student:
        'This report is generated based on standardized psychometric assessments and AI-powered analysis. ' +
        'It provides career guidance and should be used as one of many inputs in career decision-making. ' +
        "Results reflect the student's state at the time of assessment and may change as skills develop and interests evolve. " +
        'The assessment is designed for educational guidance purposes and should not be used as the sole basis for major academic or career decisions. ' +
        'Consider consulting with a qualified career counselor for personalized advice.',
    disclaimer_jobseeker:
        'This report is generated based on standardized psychometric assessments and AI analysis. It provides career guidance ' +
        'and should be used as one of many inputs in career decision-making. Consider consulting with a qualified career counselor. ' +
        "Results reflect the candidate's state at the time of assessment.",

    // ─── Final Remarks (Student Page 6) ──────────────────────────────────────
    final_remarks_prefix: "This report provides a comprehensive snapshot of",
    final_remarks_suffix:
        "'s cognitive abilities, career interests, personality traits, and career readiness as of",
    final_remarks_body:
        'The findings should be used as a guide for academic planning, career exploration, and personal development. ' +
        'We recommend discussing these results with a qualified career counselor who can provide personalized guidance based on the student\'s unique circumstances, goals, and aspirations. ' +
        'Remember that interests, abilities, and personality continue to evolve — periodic reassessment can help track progress and refine career direction.',

    // ─── Student Trait Interpretations ────────────────────────────────────────
    trait_stress_strong:
        'You handle pressure well and maintain composure in challenging situations. This resilience is valuable in demanding academic and professional settings.',
    trait_stress_moderate:
        'You manage stress reasonably well but may benefit from developing additional coping strategies for high-pressure situations.',
    trait_stress_emerging:
        'Building stress management techniques will help you navigate academic pressures and future workplace demands more effectively.',

    trait_social_strong:
        'You are naturally comfortable in social settings and communicate effectively with others. This skill supports teamwork and networking.',
    trait_social_moderate:
        'You have a balanced approach to social interaction, comfortable in groups while also valuing independent time.',
    trait_social_emerging:
        'Developing your social confidence through group activities and collaborative projects can enhance your interpersonal effectiveness.',

    trait_curiosity_strong:
        'Your intellectual curiosity drives you to explore new ideas and perspectives. This trait fuels continuous learning and innovation.',
    trait_curiosity_moderate:
        'You show healthy curiosity with a preference for familiar approaches. Pushing your comfort zone can unlock new opportunities.',
    trait_curiosity_emerging:
        'Cultivating greater openness to new experiences and ideas will expand your horizons and enrich your academic journey.',

    trait_decision_strong:
        'You make thoughtful, well-reasoned decisions and commit to your choices confidently. This clarity supports effective goal-setting.',
    trait_decision_moderate:
        'You approach decisions carefully but may sometimes hesitate. Practice making quicker decisions in low-stakes situations to build confidence.',
    trait_decision_emerging:
        'Developing a structured decision-making framework will help you approach choices with greater confidence and clarity.',

    trait_team_strong:
        'You adapt well between team and independent work, understanding when to collaborate and when to work alone.',
    trait_team_moderate:
        'You show a balanced preference between teamwork and independent work, adapting based on the situation.',
    trait_team_emerging:
        'Exploring both collaborative and independent work styles will help you discover your most productive mode of working.',

    trait_responsibility_strong:
        'You demonstrate strong self-discipline and take ownership of your commitments. This reliability is highly valued in any career.',
    trait_responsibility_moderate:
        'You show reasonable discipline in meeting obligations. Building consistent habits will further strengthen this trait.',
    trait_responsibility_emerging:
        'Developing structured routines and accountability systems will help you build stronger discipline over time.',

    // ─── Career Clarity Descriptions (Student Page 4) ─────────────────────────
    clarity_good_title: 'Good Career Direction',
    clarity_good_text:
        'Your assessment results show a coherent pattern between your interests, aptitudes, and personality — suggesting you have a reasonably clear sense of career direction. Continue refining your path through exploration and mentorship.',
    clarity_developing_title: 'Developing Career Direction',
    clarity_developing_text:
        'Your career direction is developing. There are some areas of alignment between your interests and abilities, but further exploration through career counseling, internships, and informational interviews will help crystallize your path.',
    clarity_needs_focus_title: 'Career Direction Needs Focus',
    clarity_needs_focus_text:
        'Your career direction would benefit from focused exploration. Consider career counseling, aptitude-based workshops, and shadowing professionals in fields that interest you to build clarity.',

    // ─── Student Fallback General Guidance (Page 5) ───────────────────────────
    general_guidance_intro:
        'Based on your assessment profile, here are key recommendations for your academic and career journey:',
    general_guidance_1:
        'Focus on strengthening your weaker aptitude areas through daily practice exercises (15-20 minutes per day).',
    general_guidance_3:
        'Discuss these results with your school counselor to align your academic choices with your interest profile.',
    general_guidance_4:
        'Seek mentorship from professionals working in your top-matched sectors.',
    general_guidance_5:
        'Build your career readiness skills through practical projects, volunteering, and skill-development workshops.',

    // ─── Job Seeker Roadmap Phase Names ───────────────────────────────────────
    phase_immediate: 'Immediate (1-3 months)',
    phase_shortterm: 'Short-term (3-6 months)',
    phase_mediumterm: 'Medium-term (6-12 months)',
    phase_action_items: 'Action Items',

    // ─── Student Report: Profile & Overview Labels ────────────────────────────
    student_profile: 'Student Profile',
    label_name: 'Name:',
    label_grade: 'Grade:',
    label_school: 'School:',
    label_gender: 'Gender:',
    label_location: 'Location:',
    label_holland_code: 'Holland Code:',
    label_assessed_on: 'Assessed On:',
    label_performance: 'Performance:',
    performance_overview: 'Performance Overview',
    label_overall_score: 'Overall Score',
    label_performance_level: 'Performance Level',
    label_aptitude: 'Aptitude',
    label_readiness: 'Readiness',
    label_academic_readiness: 'Academic Readiness',
    overall_assessment_summary: 'Overall Assessment Summary',
    key_highlights: 'Key Highlights',
    label_strongest_aptitude: 'Strongest Aptitude: ',
    label_strongest_trait: 'Strongest Trait: ',
    label_interest_type: 'Interest Type: ',
    label_top_strength: 'Top Strength: ',
    label_superpower: 'Superpower',

    // ─── Performance Levels ─────────────────────────────────────────────────
    perf_excellent: 'Excellent',
    perf_good: 'Good',
    perf_average: 'Average',
    perf_needs_improvement: 'Needs Improvement',

    // ─── Aptitude & RIASEC Page ─────────────────────────────────────────────
    page_aptitude_career: 'Aptitude & Career Interests',
    aptitude_test_results: 'Aptitude Test Results',
    label_overall_aptitude_score: 'Overall Aptitude Score',
    label_correct_out_of_questions: 'correct out of',
    label_questions: 'questions',
    section_breakdown: 'Section-wise Breakdown:',
    level_strong: 'Strong',
    level_average: 'Average',
    level_needs_practice: 'Needs Practice',
    career_interest_riasec: 'Career Interest Profile (RIASEC)',
    label_your_holland_code: 'Your Holland Code:',

    // ─── Personality & Strengths Page ───────────────────────────────────────
    page_personality_strengths: 'Personality & Strengths',
    personality_traits: 'Personality Traits',
    trait_analysis: 'Trait-by-Trait Analysis:',
    strengths_growth_areas: 'Strengths & Growth Areas',
    top_strengths: 'Top Strengths',
    areas_for_growth: 'Areas for Growth',

    // ─── Readiness & Sector Page ────────────────────────────────────────────
    page_readiness_sector: 'Career Readiness & Sector Analysis',
    skill_career_readiness: 'Skill & Career Readiness',
    label_overall_readiness: 'Overall Readiness Score',
    sector_recommendations: 'Sector Recommendations',
    recommended_streams: 'Recommended Academic Streams',
    career_direction_clarity: 'Career Direction Clarity',
    label_clarity_index: 'Clarity Index',

    // ─── Career Guidance Page ───────────────────────────────────────────────
    page_career_guidance: 'Career Guidance & Action Plan',
    suggested_careers: 'Suggested Careers',
    skills_to_develop: 'Skills to Develop',
    study_tips: 'Study Tips & Learning Strategies',
    recommended_next_steps: 'Recommended Next Steps',
    general_guidance: 'General Guidance',
    label_match_score: 'Match Score',

    // ─── Summary Dashboard Page ─────────────────────────────────────────────
    summary_dashboard: 'Summary Dashboard',
    key_metrics: 'Key Metrics at a Glance',
    complete_overview: 'Complete Assessment Overview',
    cognitive_aptitude_scores: 'Cognitive Aptitude Scores',
    holland_riasec_scores: 'Holland Code & RIASEC Scores',
    personality_profile_label: 'Personality Profile',
    career_readiness_skills: 'Career Readiness Skills',
    label_strengths: 'Strengths',
    label_growth_areas: 'Growth Areas',
    final_remarks: 'Final Remarks',

    // ─── Malayalam Section Header ─────────────────────────────────────────────
    malayalam_header_student: 'PRAGYA 360\u00B0 Student Career Report (\u0D2E\u0D32\u0D2F\u0D3E\u0D33\u0D02)',
    malayalam_header_jobseeker: 'PRAGYA 360\u00B0 Employability Report (\u0D2E\u0D32\u0D2F\u0D3E\u0D33\u0D02)',
};
