import { PrismaClient, AssessmentType, UserRole } from '@prisma/client';
import { aptitudeQuestions } from './seed-data/aptitude-questions';
import { riasecQuestions } from './seed-data/riasec-questions-part1';
import { riasecQuestionsPart2 } from './seed-data/riasec-questions-part2';
import { employabilityQuestions } from './seed-data/employability-questions';
import { personalityQuestions } from './seed-data/personality-questions';

const prisma = new PrismaClient();

/**
 * PRAGYA 360° EMPLOYABILITY ASSESSMENT
 * 
 * Total: 142 questions across 4 assessment modules
 * - Adult Aptitude: 40 questions (6 sections)
 * - RIASEC Career Interest: 48 questions (6 sections)  
 * - Employability Skills: 24 questions (3 sections)
 * - Personality Traits: 30 questions (6 sections)
 * 
 * Features:
 * - NO time limit
 * - Pause/Continue support (user can leave and resume)
 * - Single session containing all 4 modules
 */

async function seedAssessments() {
    console.log('🌱 Starting Pragya 360° Assessment Seeding...\n');

    // Clear existing data
    console.log('🗑️  Clearing existing assessment data...');
    await prisma.userResponse.deleteMany({});
    await prisma.userAssessment.deleteMany({});
    await prisma.option.deleteMany({});
    await prisma.question.deleteMany({});
    await prisma.assessment.deleteMany({});
    console.log('✅ Cleared existing data\n');

    // Create the main assessment - NO TIME LIMIT
    console.log('📝 Creating Pragya 360° Employability Assessment...');
    const assessment = await prisma.assessment.create({
        data: {
            title: 'Pragya 360° Employability Assessment',
            description: `Comprehensive employability assessment covering 4 key areas:
      
1. **Adult Aptitude Assessment** (40 questions)
   - Logical & Analytical Reasoning
   - Numerical Reasoning  
   - Verbal Reasoning
   - Spatial & Visual Reasoning
   - Attention & Speed
   - Work-Style Problem Solving

2. **Career Interest Inventory - RIASEC** (48 questions)
   - Realistic, Investigative, Artistic
   - Social, Enterprising, Conventional

3. **Employability Skills Assessment** (24 questions)
   - Core Skills (Communication, Problem-Solving, Critical Thinking)
   - Functional Skills (Data Handling, Customer Interaction)
   - Behavioral Skills (Teamwork, Accountability, Initiative)

4. **Work Context Personality Traits** (30 questions)
   - Work Discipline & Task Reliability
   - Stress Tolerance & Emotional Regulation
   - Learning & Change Orientation
   - Social Engagement & Task Focus
   - Team Compatibility & Cooperation
   - Integrity & Responsibility

**Note:** No time limit. You can pause and continue anytime.`,
            type: AssessmentType.PERSONALITY, // Mixed type assessment
            timeLimit: null, // NO TIME LIMIT - users can pause/continue
            passingScore: null, // No passing score - comprehensive evaluation
            isActive: true,
            allowedRoles: [UserRole.JOB_SEEKER],
        },
    });
    console.log(`✅ Created assessment: ${assessment.title} (ID: ${assessment.id})\n`);

    // Combine all RIASEC questions
    const allRiasecQuestions = [...riasecQuestions, ...riasecQuestionsPart2];

    // Combine all questions with parent section markers
    const allQuestions = [
        ...aptitudeQuestions.map(q => ({ ...q, parentSection: 'APTITUDE' })),
        ...allRiasecQuestions.map(q => ({ ...q, parentSection: 'RIASEC' })),
        ...employabilityQuestions.map(q => ({ ...q, parentSection: 'EMPLOYABILITY' })),
        ...personalityQuestions.map(q => ({ ...q, parentSection: 'PERSONALITY' })),
    ];

    console.log(`📊 Question Distribution:`);
    console.log(`   • Aptitude: ${aptitudeQuestions.length} questions`);
    console.log(`   • RIASEC: ${allRiasecQuestions.length} questions`);
    console.log(`   • Employability: ${employabilityQuestions.length} questions`);
    console.log(`   • Personality: ${personalityQuestions.length} questions`);
    console.log(`   • TOTAL: ${allQuestions.length} questions\n`);

    // Seed all questions
    console.log('🔄 Seeding questions...');
    let orderIndex = 1;
    let createdCount = 0;

    for (const q of allQuestions) {
        await prisma.question.create({
            data: {
                assessmentId: assessment.id,
                section: q.section,
                text: q.text,
                textMl: q.textMl,
                orderIndex: orderIndex++,
                options: {
                    create: q.options.map((opt, idx) => ({
                        text: opt.text,
                        textMl: opt.textMl,
                        orderIndex: idx + 1,
                        isCorrect: opt.isCorrect || false,
                        scoreValue: opt.scoreValue || 0,
                    })),
                },
            },
        });
        createdCount++;

        // Progress indicator every 20 questions
        if (createdCount % 20 === 0) {
            console.log(`   ✅ ${createdCount}/${allQuestions.length} questions created...`);
        }
    }

    console.log(`\n✅ Successfully created ${createdCount} questions with options\n`);

    // Verification
    const questionCount = await prisma.question.count({
        where: { assessmentId: assessment.id },
    });
    const optionCount = await prisma.option.count();

    console.log('📊 Verification:');
    console.log(`   • Questions in DB: ${questionCount}`);
    console.log(`   • Options in DB: ${optionCount}`);
    console.log(`   • Assessment ID: ${assessment.id}`);

    // Section breakdown
    const sectionCounts = await prisma.question.groupBy({
        by: ['section'],
        where: { assessmentId: assessment.id },
        _count: { section: true },
        orderBy: { section: 'asc' },
    });

    console.log('\n📋 Section Breakdown:');
    for (const section of sectionCounts) {
        console.log(`   • ${section.section}: ${section._count.section} questions`);
    }

    console.log('\n🎉 Pragya 360° Assessment seeding completed successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
}

seedAssessments()
    .then(async () => {
        await prisma.$disconnect();
        process.exit(0);
    })
    .catch(async (e) => {
        console.error('❌ Error seeding assessments:', e);
        await prisma.$disconnect();
        process.exit(1);
    });
