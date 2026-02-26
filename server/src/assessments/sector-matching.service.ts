import { Injectable } from '@nestjs/common';
import { RiasecScores, AptitudeScores, EmployabilityScores, PersonalityScores } from './scoring.service';

/**
 * Sector-Based Career Matching Service
 * 
 * World-class matching algorithm using:
 * - Cosine similarity on RIASEC 6D vectors (35%)
 * - Career-specific aptitude weights (30%)
 * - Personality-career fit profiles (20%)
 * - Employability readiness (15%)
 */

// ─── Sector Definitions ─────────────────────────────────────────────

export interface SectorProfile {
    id: string;
    name: string;
    nameMl: string;      // Malayalam name
    description: string;
    icon: string;        // Emoji for frontend use
    // Ideal RIASEC vector for this sector (each 0-32)
    idealRiasec: RiasecScores;
    // Aptitude weight profile (how much each aptitude matters, sums to 1.0)
    aptitudeWeights: Record<string, number>;
    // Ideal personality trait averages (1-5 scale expectations)
    idealPersonality: Record<string, number>;
    // Example roles within this sector
    exampleRoles: string[];
    // Growth potential and market info
    growthOutlook: 'High' | 'Medium' | 'Steady';
    avgSalaryRange: string;
}

export interface SectorMatch {
    sector: SectorProfile;
    matchScore: number;     // 0-100 overall match
    riasecFit: number;      // 0-100 cosine similarity
    aptitudeFit: number;    // 0-100 weighted aptitude match
    personalityFit: number; // 0-100 personality alignment
    employabilityFit: number; // 0-100 job readiness
    matchReasons: string[];
    readinessLevel: 'Ready' | 'Developing' | 'Needs Preparation';
}

export interface SectorMatchResult {
    topSectors: SectorMatch[];
    riasecCode: string;
    overallReadiness: number;
}

// ─── 12 Industry Sectors with Ideal Profiles ─────────────────────────

const SECTORS: SectorProfile[] = [
    {
        id: 'healthcare',
        name: 'Healthcare & Medicine',
        nameMl: 'ആരോഗ്യ സേവനം & വൈദ്യശാസ്ത്രം',
        description: 'Patient care, diagnostics, pharmacy, and allied health professions requiring strong analytical thinking and empathy.',
        icon: '🏥',
        idealRiasec: { R: 10, I: 28, A: 5, S: 25, E: 8, C: 15 },
        aptitudeWeights: {
            'Verbal Reasoning': 0.20,
            'Numerical Reasoning': 0.25,
            'Abstract-Fluid Reasoning': 0.10,
            'Logical & Analytical Reasoning': 0.25,
            'Spatial & Visual Reasoning': 0.10,
            'Spatial Ability': 0.10,
            'Processing Speed & Accuracy': 0.15,
            'Mechanical Reasoning': 0.05,
        },
        idealPersonality: {
            'Work Discipline & Task Reliability': 4.5,
            'Stress Tolerance & Emotional Regulation': 4.5,
            'Learning & Change Orientation': 4.0,
            'Social Engagement & Task Focus': 3.5,
            'Team Compatibility & Cooperation': 4.0,
            'Integrity & Responsibility': 4.8,
        },
        exampleRoles: ['Doctor / Physician', 'Pharmacist', 'Nurse', 'Lab Technician', 'Physiotherapist', 'Medical Research'],
        growthOutlook: 'High',
        avgSalaryRange: '₹3-30 LPA',
    },
    {
        id: 'technology',
        name: 'Technology & IT',
        nameMl: 'സാങ്കേതികവിദ്യ & ഐ.ടി',
        description: 'Software development, data science, cybersecurity, and IT infrastructure — for logical thinkers who love solving complex problems.',
        icon: '💻',
        idealRiasec: { R: 12, I: 30, A: 10, S: 8, E: 10, C: 18 },
        aptitudeWeights: {
            'Verbal Reasoning': 0.10,
            'Numerical Reasoning': 0.20,
            'Abstract-Fluid Reasoning': 0.15,
            'Logical & Analytical Reasoning': 0.35,
            'Spatial & Visual Reasoning': 0.05,
            'Spatial Ability': 0.05,
            'Processing Speed & Accuracy': 0.15,
            'Mechanical Reasoning': 0.05,
        },
        idealPersonality: {
            'Work Discipline & Task Reliability': 4.0,
            'Stress Tolerance & Emotional Regulation': 3.5,
            'Learning & Change Orientation': 4.8,
            'Social Engagement & Task Focus': 3.0,
            'Team Compatibility & Cooperation': 3.5,
            'Integrity & Responsibility': 4.0,
        },
        exampleRoles: ['Software Engineer', 'Data Scientist', 'Cybersecurity Analyst', 'Cloud Architect', 'Full-Stack Developer', 'AI/ML Engineer'],
        growthOutlook: 'High',
        avgSalaryRange: '₹4-40 LPA',
    },
    {
        id: 'creative_media',
        name: 'Creative & Media',
        nameMl: 'ക്രിയേറ്റീവ് & മീഡിയ',
        description: 'Design, content creation, animation, and visual storytelling — ideal for expressive minds with strong spatial and artistic talents.',
        icon: '🎨',
        idealRiasec: { R: 8, I: 12, A: 30, S: 10, E: 15, C: 5 },
        aptitudeWeights: {
            'Verbal Reasoning': 0.15,
            'Numerical Reasoning': 0.05,
            'Abstract-Fluid Reasoning': 0.20,
            'Logical & Analytical Reasoning': 0.05,
            'Spatial & Visual Reasoning': 0.30,
            'Spatial Ability': 0.30,
            'Processing Speed & Accuracy': 0.05,
            'Mechanical Reasoning': 0.00,
        },
        idealPersonality: {
            'Work Discipline & Task Reliability': 3.0,
            'Stress Tolerance & Emotional Regulation': 3.0,
            'Learning & Change Orientation': 4.5,
            'Social Engagement & Task Focus': 3.5,
            'Team Compatibility & Cooperation': 3.5,
            'Integrity & Responsibility': 3.5,
        },
        exampleRoles: ['Graphic Designer', 'UI/UX Designer', 'Content Writer', 'Video Editor', 'Animator', 'Photographer'],
        growthOutlook: 'High',
        avgSalaryRange: '₹3-15 LPA',
    },
    {
        id: 'education',
        name: 'Education & Training',
        nameMl: 'വിദ്യാഭ്യാസം & പരിശീലനം',
        description: 'Teaching, mentoring, curriculum design, and academic administration — for those who thrive on helping others learn and grow.',
        icon: '📚',
        idealRiasec: { R: 5, I: 15, A: 12, S: 30, E: 12, C: 10 },
        aptitudeWeights: {
            'Verbal Reasoning': 0.35,
            'Numerical Reasoning': 0.10,
            'Abstract-Fluid Reasoning': 0.10,
            'Logical & Analytical Reasoning': 0.15,
            'Spatial & Visual Reasoning': 0.05,
            'Spatial Ability': 0.05,
            'Processing Speed & Accuracy': 0.10,
            'Mechanical Reasoning': 0.00,
        },
        idealPersonality: {
            'Work Discipline & Task Reliability': 4.0,
            'Stress Tolerance & Emotional Regulation': 4.0,
            'Learning & Change Orientation': 4.5,
            'Social Engagement & Task Focus': 4.5,
            'Team Compatibility & Cooperation': 4.5,
            'Integrity & Responsibility': 4.5,
        },
        exampleRoles: ['School Teacher', 'College Lecturer', 'Corporate Trainer', 'Educational Counselor', 'Curriculum Designer', 'EdTech Specialist'],
        growthOutlook: 'Steady',
        avgSalaryRange: '₹2.5-10 LPA',
    },
    {
        id: 'business_finance',
        name: 'Business & Finance',
        nameMl: 'ബിസിനസ് & ധനകാര്യം',
        description: 'Accounting, banking, financial planning, and business strategy — for number-oriented individuals with strong organizational skills.',
        icon: '📊',
        idealRiasec: { R: 5, I: 15, A: 5, S: 10, E: 28, C: 28 },
        aptitudeWeights: {
            'Verbal Reasoning': 0.15,
            'Numerical Reasoning': 0.35,
            'Abstract-Fluid Reasoning': 0.05,
            'Logical & Analytical Reasoning': 0.25,
            'Spatial & Visual Reasoning': 0.00,
            'Spatial Ability': 0.00,
            'Processing Speed & Accuracy': 0.20,
            'Mechanical Reasoning': 0.00,
        },
        idealPersonality: {
            'Work Discipline & Task Reliability': 4.8,
            'Stress Tolerance & Emotional Regulation': 4.0,
            'Learning & Change Orientation': 3.5,
            'Social Engagement & Task Focus': 3.5,
            'Team Compatibility & Cooperation': 4.0,
            'Integrity & Responsibility': 4.8,
        },
        exampleRoles: ['Accountant', 'Financial Analyst', 'Bank Manager', 'Investment Advisor', 'Tax Consultant', 'Auditor'],
        growthOutlook: 'Steady',
        avgSalaryRange: '₹3-20 LPA',
    },
    {
        id: 'engineering',
        name: 'Engineering & Manufacturing',
        nameMl: 'എഞ്ചിനീയറിംഗ് & നിർമ്മാണം',
        description: 'Mechanical, civil, electrical engineering and industrial manufacturing — for hands-on problem solvers with strong technical aptitude.',
        icon: '⚙️',
        idealRiasec: { R: 30, I: 25, A: 5, S: 5, E: 10, C: 18 },
        aptitudeWeights: {
            'Verbal Reasoning': 0.05,
            'Numerical Reasoning': 0.25,
            'Abstract-Fluid Reasoning': 0.10,
            'Logical & Analytical Reasoning': 0.20,
            'Spatial & Visual Reasoning': 0.15,
            'Spatial Ability': 0.15,
            'Processing Speed & Accuracy': 0.10,
            'Mechanical Reasoning': 0.30,
        },
        idealPersonality: {
            'Work Discipline & Task Reliability': 4.5,
            'Stress Tolerance & Emotional Regulation': 3.5,
            'Learning & Change Orientation': 3.5,
            'Social Engagement & Task Focus': 3.0,
            'Team Compatibility & Cooperation': 4.0,
            'Integrity & Responsibility': 4.5,
        },
        exampleRoles: ['Mechanical Engineer', 'Civil Engineer', 'Electrical Engineer', 'Automobile Engineer', 'Welder', 'CNC Operator'],
        growthOutlook: 'Medium',
        avgSalaryRange: '₹2.5-15 LPA',
    },
    {
        id: 'social_services',
        name: 'Social Work & Counseling',
        nameMl: 'സാമൂഹ്യ സേവനം & കൗൺസിലിംഗ്',
        description: 'Mental health, social welfare, community development, and counseling — for empathetic individuals driven to make a human impact.',
        icon: '🤝',
        idealRiasec: { R: 5, I: 12, A: 15, S: 30, E: 10, C: 8 },
        aptitudeWeights: {
            'Verbal Reasoning': 0.30,
            'Numerical Reasoning': 0.05,
            'Abstract-Fluid Reasoning': 0.15,
            'Logical & Analytical Reasoning': 0.15,
            'Spatial & Visual Reasoning': 0.00,
            'Spatial Ability': 0.00,
            'Processing Speed & Accuracy': 0.05,
            'Mechanical Reasoning': 0.00,
        },
        idealPersonality: {
            'Work Discipline & Task Reliability': 3.5,
            'Stress Tolerance & Emotional Regulation': 4.8,
            'Learning & Change Orientation': 4.0,
            'Social Engagement & Task Focus': 4.8,
            'Team Compatibility & Cooperation': 4.8,
            'Integrity & Responsibility': 4.5,
        },
        exampleRoles: ['Psychologist', 'Social Worker', 'Career Counselor', 'NGO Program Manager', 'Community Development Officer', 'HR Specialist'],
        growthOutlook: 'Medium',
        avgSalaryRange: '₹2-10 LPA',
    },
    {
        id: 'legal_governance',
        name: 'Legal & Governance',
        nameMl: 'നിയമം & ഭരണനിർവ്വഹണം',
        description: 'Law, public administration, compliance, and policy — for detail-oriented individuals who champion fairness and structure.',
        icon: '⚖️',
        idealRiasec: { R: 5, I: 18, A: 8, S: 15, E: 25, C: 22 },
        aptitudeWeights: {
            'Verbal Reasoning': 0.35,
            'Numerical Reasoning': 0.10,
            'Abstract-Fluid Reasoning': 0.10,
            'Logical & Analytical Reasoning': 0.30,
            'Spatial & Visual Reasoning': 0.00,
            'Spatial Ability': 0.00,
            'Processing Speed & Accuracy': 0.15,
            'Mechanical Reasoning': 0.00,
        },
        idealPersonality: {
            'Work Discipline & Task Reliability': 4.5,
            'Stress Tolerance & Emotional Regulation': 4.5,
            'Learning & Change Orientation': 3.5,
            'Social Engagement & Task Focus': 3.5,
            'Team Compatibility & Cooperation': 3.5,
            'Integrity & Responsibility': 5.0,
        },
        exampleRoles: ['Lawyer / Advocate', 'Civil Services (IAS/IPS)', 'Legal Advisor', 'Compliance Officer', 'Paralegal', 'Public Policy Analyst'],
        growthOutlook: 'Steady',
        avgSalaryRange: '₹3-25 LPA',
    },
    {
        id: 'hospitality_tourism',
        name: 'Hospitality & Tourism',
        nameMl: 'ആതിഥ്യ മേഖല & ടൂറിസം',
        description: 'Hotels, travel, food service, and event management — for energetic, people-oriented individuals who enjoy dynamic environments.',
        icon: '🏨',
        idealRiasec: { R: 10, I: 5, A: 12, S: 25, E: 28, C: 12 },
        aptitudeWeights: {
            'Verbal Reasoning': 0.25,
            'Numerical Reasoning': 0.15,
            'Abstract-Fluid Reasoning': 0.05,
            'Logical & Analytical Reasoning': 0.10,
            'Spatial & Visual Reasoning': 0.05,
            'Spatial Ability': 0.05,
            'Processing Speed & Accuracy': 0.15,
            'Mechanical Reasoning': 0.00,
        },
        idealPersonality: {
            'Work Discipline & Task Reliability': 4.0,
            'Stress Tolerance & Emotional Regulation': 4.0,
            'Learning & Change Orientation': 3.5,
            'Social Engagement & Task Focus': 4.8,
            'Team Compatibility & Cooperation': 4.5,
            'Integrity & Responsibility': 4.0,
        },
        exampleRoles: ['Hotel Manager', 'Tour Guide', 'Event Planner', 'Chef / Culinary Expert', 'Travel Consultant', 'F&B Manager'],
        growthOutlook: 'High',
        avgSalaryRange: '₹2-12 LPA',
    },
    {
        id: 'agriculture_environment',
        name: 'Agriculture & Environment',
        nameMl: 'കൃഷി & പരിസ്ഥിതി',
        description: 'Farming science, environmental management, sustainability, and natural resource conservation — for nature-oriented professionals.',
        icon: '🌱',
        idealRiasec: { R: 28, I: 22, A: 8, S: 10, E: 8, C: 12 },
        aptitudeWeights: {
            'Verbal Reasoning': 0.10,
            'Numerical Reasoning': 0.15,
            'Abstract-Fluid Reasoning': 0.10,
            'Logical & Analytical Reasoning': 0.15,
            'Spatial & Visual Reasoning': 0.15,
            'Spatial Ability': 0.15,
            'Processing Speed & Accuracy': 0.05,
            'Mechanical Reasoning': 0.20,
        },
        idealPersonality: {
            'Work Discipline & Task Reliability': 4.0,
            'Stress Tolerance & Emotional Regulation': 3.5,
            'Learning & Change Orientation': 4.0,
            'Social Engagement & Task Focus': 3.0,
            'Team Compatibility & Cooperation': 3.5,
            'Integrity & Responsibility': 4.0,
        },
        exampleRoles: ['Agricultural Scientist', 'Environmental Engineer', 'Forest Officer', 'Agri-Business Manager', 'Soil Scientist', 'Sustainability Consultant'],
        growthOutlook: 'Medium',
        avgSalaryRange: '₹2-10 LPA',
    },
    {
        id: 'sales_marketing',
        name: 'Sales & Marketing',
        nameMl: 'വിൽപ്പന & മാർക്കറ്റിംഗ്',
        description: 'Brand management, digital marketing, sales strategy, and market research — for persuasive communicators with business acumen.',
        icon: '📣',
        idealRiasec: { R: 5, I: 10, A: 18, S: 18, E: 30, C: 10 },
        aptitudeWeights: {
            'Verbal Reasoning': 0.30,
            'Numerical Reasoning': 0.15,
            'Abstract-Fluid Reasoning': 0.10,
            'Logical & Analytical Reasoning': 0.15,
            'Spatial & Visual Reasoning': 0.10,
            'Spatial Ability': 0.10,
            'Processing Speed & Accuracy': 0.10,
            'Mechanical Reasoning': 0.00,
        },
        idealPersonality: {
            'Work Discipline & Task Reliability': 3.5,
            'Stress Tolerance & Emotional Regulation': 3.5,
            'Learning & Change Orientation': 4.0,
            'Social Engagement & Task Focus': 4.8,
            'Team Compatibility & Cooperation': 4.0,
            'Integrity & Responsibility': 3.5,
        },
        exampleRoles: ['Marketing Manager', 'Digital Marketing Specialist', 'Brand Strategist', 'Sales Executive', 'Market Research Analyst', 'Public Relations Officer'],
        growthOutlook: 'High',
        avgSalaryRange: '₹3-20 LPA',
    },
    {
        id: 'skilled_trades',
        name: 'Skilled Trades & Services',
        nameMl: 'വൈദഗ്ധ്യ തൊഴിലുകൾ',
        description: 'Electricians, plumbers, carpenters, beauticians, and other skill-based trades — for practical, hands-on workers who take pride in craftsmanship.',
        icon: '🔧',
        idealRiasec: { R: 30, I: 8, A: 10, S: 12, E: 15, C: 15 },
        aptitudeWeights: {
            'Verbal Reasoning': 0.05,
            'Numerical Reasoning': 0.10,
            'Abstract-Fluid Reasoning': 0.05,
            'Logical & Analytical Reasoning': 0.10,
            'Spatial & Visual Reasoning': 0.20,
            'Spatial Ability': 0.20,
            'Processing Speed & Accuracy': 0.10,
            'Mechanical Reasoning': 0.35,
        },
        idealPersonality: {
            'Work Discipline & Task Reliability': 4.5,
            'Stress Tolerance & Emotional Regulation': 3.5,
            'Learning & Change Orientation': 3.0,
            'Social Engagement & Task Focus': 3.0,
            'Team Compatibility & Cooperation': 3.5,
            'Integrity & Responsibility': 4.5,
        },
        exampleRoles: ['Electrician', 'Plumber', 'Carpenter', 'Beautician', 'Automobile Mechanic', 'Construction Supervisor'],
        growthOutlook: 'Medium',
        avgSalaryRange: '₹1.5-6 LPA',
    },
];

// ─── Matching Algorithm ──────────────────────────────────────────────

@Injectable()
export class SectorMatchingService {

    /**
     * Match user's assessment profile to industry sectors
     */
    findMatchingSectors(
        riasecScores: RiasecScores,
        riasecCode: string,
        aptitudeScores: AptitudeScores,
        personalityScores: PersonalityScores,
        employabilityScores: EmployabilityScores,
    ): SectorMatchResult {
        const sectorMatches: SectorMatch[] = SECTORS.map(sector => {
            const riasecFit = this.cosineSimilarity(riasecScores, sector.idealRiasec);
            const aptitudeFit = this.weightedAptitudeMatch(aptitudeScores, sector.aptitudeWeights);
            const personalityFit = this.personalityFitScore(personalityScores, sector.idealPersonality);
            const employabilityFit = this.employabilityReadiness(employabilityScores);

            // Weighted composite: RIASEC 35%, Aptitude 30%, Personality 20%, Employability 15%
            const matchScore = Math.round(
                riasecFit * 0.35 +
                aptitudeFit * 0.30 +
                personalityFit * 0.20 +
                employabilityFit * 0.15
            );

            const matchReasons = this.generateMatchReasons(
                sector, riasecFit, aptitudeFit, personalityFit, employabilityFit, riasecScores
            );

            const readinessLevel = employabilityFit >= 65
                ? 'Ready' as const
                : employabilityFit >= 40
                    ? 'Developing' as const
                    : 'Needs Preparation' as const;

            return {
                sector,
                matchScore: Math.min(100, Math.max(0, matchScore)),
                riasecFit: Math.round(riasecFit),
                aptitudeFit: Math.round(aptitudeFit),
                personalityFit: Math.round(personalityFit),
                employabilityFit: Math.round(employabilityFit),
                matchReasons,
                readinessLevel,
            };
        });

        // Sort by match score (highest first)
        sectorMatches.sort((a, b) => b.matchScore - a.matchScore);

        // Overall workplace readiness
        const overallReadiness = Math.round(
            sectorMatches.reduce((sum, s) => sum + s.employabilityFit, 0) / sectorMatches.length
        );

        return {
            topSectors: sectorMatches, // Return ALL sectors ranked
            riasecCode,
            overallReadiness,
        };
    }

    /**
     * Cosine similarity between user RIASEC vector and sector ideal vector (0-100)
     * 
     * This measures how closely the *shape* of the user's interest profile
     * matches the sector's ideal, regardless of absolute magnitude.
     */
    private cosineSimilarity(user: RiasecScores, ideal: RiasecScores): number {
        const keys: (keyof RiasecScores)[] = ['R', 'I', 'A', 'S', 'E', 'C'];

        let dotProduct = 0;
        let userMag = 0;
        let idealMag = 0;

        for (const key of keys) {
            dotProduct += user[key] * ideal[key];
            userMag += user[key] * user[key];
            idealMag += ideal[key] * ideal[key];
        }

        const magnitude = Math.sqrt(userMag) * Math.sqrt(idealMag);
        if (magnitude === 0) return 0;

        // Cosine similarity is [-1, 1], map to [0, 100]
        const similarity = dotProduct / magnitude;
        return Math.round(similarity * 100);
    }

    /**
     * Weighted aptitude match — uses sector-specific aptitude importance weights
     * to calculate how well the user's cognitive abilities match sector requirements.
     */
    private weightedAptitudeMatch(
        aptitude: AptitudeScores,
        weights: Record<string, number>,
    ): number {
        let weightedScore = 0;
        let totalWeight = 0;

        for (const [section, weight] of Object.entries(weights)) {
            if (weight <= 0) continue;

            // Find matching aptitude section (handle slight naming differences)
            const userSection = Object.entries(aptitude).find(
                ([key]) => key !== 'overall' && (key === section || key.includes(section.split(' ')[0]))
            );

            if (userSection) {
                const sectionData = userSection[1] as any;
                const percentage = sectionData?.percentage || 0;
                weightedScore += percentage * weight;
                totalWeight += weight;
            }
        }

        return totalWeight > 0 ? Math.round(weightedScore / totalWeight) : 0;
    }

    /**
     * Personality fit — measures how closely the user's trait averages
     * match the sector's ideal personality requirements.
     * Uses inverse distance scoring (closer = higher score).
     */
    private personalityFitScore(
        personality: PersonalityScores,
        idealPersonality: Record<string, number>,
    ): number {
        let totalDiff = 0;
        let traitCount = 0;

        for (const [trait, idealAvg] of Object.entries(idealPersonality)) {
            const userTrait = (personality as any)[trait];
            if (userTrait?.average !== undefined) {
                // Absolute difference from ideal, max possible diff is 4 (range 1-5)
                const diff = Math.abs(userTrait.average - idealAvg);
                totalDiff += diff;
                traitCount++;
            }
        }

        if (traitCount === 0) return 50; // Default if no data

        // Average difference, then convert to 0-100 (0 diff = 100%, 4 diff = 0%)
        const avgDiff = totalDiff / traitCount;
        return Math.round(Math.max(0, (1 - avgDiff / 4) * 100));
    }

    /**
     * Employability readiness — overall job-readiness score based on
     * employability skills assessment results.
     */
    private employabilityReadiness(employability: EmployabilityScores): number {
        return employability?.overall?.percentage || 0;
    }

    /**
     * Generate human-readable match reasons for each sector match
     */
    private generateMatchReasons(
        sector: SectorProfile,
        riasecFit: number,
        aptitudeFit: number,
        personalityFit: number,
        employabilityFit: number,
        riasecScores: RiasecScores,
    ): string[] {
        const reasons: string[] = [];

        // RIASEC alignment
        if (riasecFit >= 85) {
            reasons.push(`Your interests strongly align with ${sector.name}`);
        } else if (riasecFit >= 70) {
            reasons.push(`Good interest alignment with ${sector.name}`);
        } else if (riasecFit >= 55) {
            reasons.push(`Moderate interest alignment — worth exploring`);
        }

        // Aptitude match
        if (aptitudeFit >= 70) {
            reasons.push('Strong cognitive abilities for this sector');
        } else if (aptitudeFit >= 50) {
            reasons.push('Developing aptitude that can be strengthened');
        }

        // Personality fit
        if (personalityFit >= 75) {
            reasons.push('Your personality traits suit this work environment');
        } else if (personalityFit >= 55) {
            reasons.push('Some personality traits align well');
        }

        // Readiness
        if (employabilityFit >= 65) {
            reasons.push('Job-ready for entry-level roles in this sector');
        } else if (employabilityFit >= 40) {
            reasons.push('Building workplace skills for this sector');
        }

        // Specific RIASEC type highlights
        const keys: (keyof RiasecScores)[] = ['R', 'I', 'A', 'S', 'E', 'C'];
        const riasecNames: Record<string, string> = {
            R: 'Realistic (hands-on)',
            I: 'Investigative (analytical)',
            A: 'Artistic (creative)',
            S: 'Social (people-oriented)',
            E: 'Enterprising (leadership)',
            C: 'Conventional (organized)',
        };

        const highestUserType = keys.reduce((a, b) => riasecScores[a] > riasecScores[b] ? a : b);
        const sectorIdeal = sector.idealRiasec;
        const highestSectorType = keys.reduce((a, b) => sectorIdeal[a] > sectorIdeal[b] ? a : b);

        if (highestUserType === highestSectorType) {
            reasons.push(`Primary ${riasecNames[highestUserType]} interest matches sector core`);
        }

        return reasons.length > 0 ? reasons : ['Consider exploring this sector to broaden your options'];
    }

    /**
     * Get all sector definitions (for frontend display or documentation)
     */
    getAllSectors(): SectorProfile[] {
        return SECTORS;
    }
}
