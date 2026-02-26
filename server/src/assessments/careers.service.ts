import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RiasecScores, AptitudeScores } from './scoring.service';

/**
 * Career Matching Service
 * Matches candidates to careers based on RIASEC profile, aptitude, and personality
 */

export interface CareerMatch {
    id: string;
    title: string;
    titleMl: string | null;
    description: string;
    industry: string;
    category: string;
    riasecCodes: string;
    matchScore: number; // 0-100 based on RIASEC alignment
    matchReasons: string[];
    averageSalary: string | null;
    growthProspect: string | null;
    workEnvironment: string | null;
    keySkills: string | null;
    educationLevel: string;
}

export interface CareerMatchResult {
    topMatches: CareerMatch[];
    industryDistribution: Record<string, number>;
    riasecCode: string;
}

@Injectable()
export class CareersService {
    constructor(private prisma: PrismaService) { }

    /**
     * Find matching careers based on RIASEC profile and aptitude scores
     * @param riasecCode Holland Code (e.g., "IRS")
     * @param riasecScores Full RIASEC scores
     * @param aptitudeScores Optional aptitude percentages for filtering
     */
    async findMatchingCareers(
        riasecCode: string,
        riasecScores: RiasecScores,
        aptitudeScores?: AptitudeScores,
    ): Promise<CareerMatchResult> {
        // Get all active careers
        const careers = await this.prisma.career.findMany({
            where: { isActive: true },
        });

        // Calculate match score for each career
        const matchedCareers: CareerMatch[] = careers.map(career => {
            const { score, reasons } = this.calculateCareerMatchScore(
                career,
                riasecCode,
                riasecScores,
                aptitudeScores,
            );

            return {
                id: career.id,
                title: career.title,
                titleMl: career.titleMl,
                description: career.description,
                industry: career.industry,
                category: career.category,
                riasecCodes: career.riasecCodes,
                matchScore: score,
                matchReasons: reasons,
                averageSalary: career.averageSalary,
                growthProspect: career.growthProspect,
                workEnvironment: career.workEnvironment,
                keySkills: career.keySkills,
                educationLevel: career.educationLevel,
            };
        });

        // Sort by match score (highest first)
        matchedCareers.sort((a, b) => b.matchScore - a.matchScore);

        // Take top 10 matches
        const topMatches = matchedCareers.slice(0, 10);

        // Calculate industry distribution for top matches
        const industryDistribution: Record<string, number> = {};
        for (const match of topMatches) {
            industryDistribution[match.industry] = (industryDistribution[match.industry] || 0) + 1;
        }

        return {
            topMatches,
            industryDistribution,
            riasecCode,
        };
    }

    /**
     * Calculate match score (0-100) between candidate and career
     */
    private calculateCareerMatchScore(
        career: any,
        riasecCode: string,
        riasecScores: RiasecScores,
        aptitudeScores?: AptitudeScores,
    ): { score: number; reasons: string[] } {
        let score = 0;
        const reasons: string[] = [];

        const candidateCodes = riasecCode.split('');
        const careerCodes = career.riasecCodes.split('');

        // 1. Primary RIASEC Code Match (up to 40 points)
        if (candidateCodes[0] === careerCodes[0]) {
            score += 40;
            reasons.push('Strong alignment with primary interest');
        } else if (candidateCodes.includes(careerCodes[0])) {
            score += 25;
            reasons.push('Career matches one of your top interests');
        } else if (careerCodes.includes(candidateCodes[0])) {
            score += 15;
            reasons.push('Your primary interest is relevant to this career');
        }

        // 2. Secondary/Tertiary Code Match (up to 30 points)
        let secondaryMatches = 0;
        for (let i = 1; i < Math.min(candidateCodes.length, 3); i++) {
            if (careerCodes.includes(candidateCodes[i])) {
                secondaryMatches++;
            }
        }
        if (secondaryMatches >= 2) {
            score += 30;
            reasons.push('Multiple interests align with this career');
        } else if (secondaryMatches === 1) {
            score += 15;
            reasons.push('Secondary interest matches career profile');
        }

        // 3. RIASEC Score Strength (up to 15 points)
        // Check if candidate has strong scores in career's required types
        const careerPrimaryCode = career.primaryCode as keyof RiasecScores;
        const candidateScoreForCareer = riasecScores[careerPrimaryCode] || 0;
        const maxPossibleScore = 32; // 8 questions × 4 max points
        const scoreStrength = candidateScoreForCareer / maxPossibleScore;

        if (scoreStrength >= 0.75) {
            score += 15;
            reasons.push('Strong aptitude in career\'s primary area');
        } else if (scoreStrength >= 0.5) {
            score += 10;
        }

        // 4. Aptitude Requirements (up to 15 points)
        if (aptitudeScores) {
            let aptitudeMatch = true;

            if (career.minLogicalScore && aptitudeScores['Logical & Analytical Reasoning']) {
                if (aptitudeScores['Logical & Analytical Reasoning'].percentage < career.minLogicalScore) {
                    aptitudeMatch = false;
                }
            }
            if (career.minNumericalScore && aptitudeScores['Numerical Reasoning']) {
                if (aptitudeScores['Numerical Reasoning'].percentage < career.minNumericalScore) {
                    aptitudeMatch = false;
                }
            }
            if (career.minVerbalScore && aptitudeScores['Verbal Reasoning']) {
                if (aptitudeScores['Verbal Reasoning'].percentage < career.minVerbalScore) {
                    aptitudeMatch = false;
                }
            }
            if (career.minSpatialScore && aptitudeScores['Spatial & Visual Reasoning']) {
                if (aptitudeScores['Spatial & Visual Reasoning'].percentage < career.minSpatialScore) {
                    aptitudeMatch = false;
                }
            }

            if (aptitudeMatch) {
                score += 15;
                reasons.push('Meets cognitive aptitude requirements');
            } else {
                // Reduce score if doesn't meet requirements
                score = Math.max(0, score - 10);
            }
        }

        return { score: Math.min(100, score), reasons };
    }

    /**
     * Get career by ID with full details
     */
    async getCareerById(id: string) {
        return this.prisma.career.findUnique({
            where: { id },
        });
    }

    /**
     * Get careers by industry
     */
    async getCareersByIndustry(industry: string) {
        return this.prisma.career.findMany({
            where: {
                industry,
                isActive: true,
            },
            orderBy: { title: 'asc' },
        });
    }

    /**
     * Get all industries with career counts
     */
    async getIndustryStats() {
        const stats = await this.prisma.career.groupBy({
            by: ['industry'],
            where: { isActive: true },
            _count: { industry: true },
            orderBy: { industry: 'asc' },
        });

        return stats.map(s => ({
            industry: s.industry,
            count: s._count.industry,
        }));
    }
}
