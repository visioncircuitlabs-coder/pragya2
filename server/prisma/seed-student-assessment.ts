import { PrismaClient, AssessmentType, UserRole } from '@prisma/client';
import { studentAptitudeQuestions } from './seed-data/student-aptitude-questions';
import { studentRiasecQuestions } from './seed-data/student-riasec-questions';
import { studentPersonalityQuestions } from './seed-data/student-personality-questions';
import { studentReadinessQuestions } from './seed-data/student-readiness-questions';

const prisma = new PrismaClient();

/**
 * PRAGYA 360° CAREER ASSESSMENT (For School Students)
 *
 * Total: 180 questions across 4 modules:
 *
 * MODULE 1: Aptitude (60 questions)
 *   - Numerical Reasoning, Verbal Reasoning, Abstract-Fluid Reasoning
 *   - Spatial Ability, Mechanical Reasoning, Processing Speed & Accuracy
 *
 * MODULE 2: Career Interest Inventory / RIASEC (48 questions)
 *   - 8 binary forced-choice questions per RIASEC type
 *
 * MODULE 3: Personality Traits (36 questions)
 *   - 6 traits × 6 questions, 3-point scale
 *
 * MODULE 4: Skill & Career Readiness (36 questions)
 *   - 6 sections × 6 questions, 4-point scale
 *
 * Features:
 * - NO time limit
 * - Pause/Continue support (user can leave and resume)
 * - Bilingual support (English + Malayalam)
 * - For STUDENT role only
 */

async function seedStudentAssessment() {
    console.log('🌱 Starting Pragya 360° Student Career Assessment Seeding...\n');

    const forceReseed = process.argv.includes('--force');

    // Check if student assessment already exists
    const existingAssessment = await prisma.assessment.findFirst({
        where: {
            title: 'Pragya 360° Career Assessment',
            allowedRoles: { has: UserRole.STUDENT },
        },
    });

    if (existingAssessment) {
        if (forceReseed) {
            console.log('🗑️  Force reseed: Deleting existing assessment and questions...');

            // Delete options first (due to FK constraints)
            await prisma.option.deleteMany({
                where: { question: { assessmentId: existingAssessment.id } }
            });

            // Delete questions
            await prisma.question.deleteMany({
                where: { assessmentId: existingAssessment.id }
            });

            // Delete user responses and attempts
            await prisma.userResponse.deleteMany({
                where: { userAssessment: { assessmentId: existingAssessment.id } }
            });
            await prisma.userAssessment.deleteMany({
                where: { assessmentId: existingAssessment.id }
            });

            // Delete the assessment
            await prisma.assessment.delete({
                where: { id: existingAssessment.id }
            });

            console.log('✅ Deleted old assessment. Reseeding...\n');
        } else {
            console.log('⚠️  Student Career Assessment already exists. Skipping...');
            console.log(`   Assessment ID: ${existingAssessment.id}`);
            console.log('   Use --force to reseed');
            return;
        }
    }

    // Create the student assessment - NO TIME LIMIT
    console.log('📝 Creating Pragya 360° Career Assessment for Students...');
    const assessment = await prisma.assessment.create({
        data: {
            title: 'Pragya 360° Career Assessment',
            description: `Comprehensive 360° career assessment for school students with 4 modules:

**Module 1: Aptitude** (60 questions)
Numerical, Verbal, Abstract, Spatial, Mechanical, and Processing Speed.

**Module 2: Career Interest Inventory (RIASEC)** (48 questions)
Discover your Holland Code — Realistic, Investigative, Artistic, Social, Enterprising, Conventional.

**Module 3: Personality Traits** (36 questions)
Responsibility, Stress Tolerance, Curiosity, Social Interaction, Teamwork, Decision-Making.

**Module 4: Skill & Career Readiness** (36 questions)
Communication, Problem-Solving, Creativity, Adaptability, Time Management, Digital Awareness.

**Note:** No time limit. You can pause and continue anytime.
Available in English and Malayalam.`,
            type: AssessmentType.APTITUDE,
            timeLimit: null, // NO TIME LIMIT
            passingScore: null, // No passing score
            isActive: true,
            allowedRoles: [UserRole.STUDENT],
        },
    });
    console.log(`✅ Created assessment: ${assessment.title} (ID: ${assessment.id})\n`);

    // Combine all 4 modules into one question list
    const allQuestions = [
        ...studentAptitudeQuestions,
        ...studentRiasecQuestions,
        ...studentPersonalityQuestions,
        ...studentReadinessQuestions,
    ];
    const totalQuestions = allQuestions.length;

    console.log(`🔄 Seeding ${totalQuestions} questions across 4 modules...`);
    console.log(`   • Aptitude: ${studentAptitudeQuestions.length}`);
    console.log(`   • RIASEC: ${studentRiasecQuestions.length}`);
    console.log(`   • Personality: ${studentPersonalityQuestions.length}`);
    console.log(`   • Readiness: ${studentReadinessQuestions.length}\n`);

    let orderIndex = 1;
    let createdCount = 0;

    for (const q of allQuestions) {
        const questionData = q as any;
        await prisma.question.create({
            data: {
                assessmentId: assessment.id,
                section: questionData.section,
                text: questionData.text,
                textMl: questionData.textMl || null,
                orderIndex: orderIndex++,
                options: {
                    create: questionData.options.map((opt: any, idx: number) => ({
                        text: opt.text,
                        textMl: opt.textMl || null,
                        orderIndex: idx + 1,
                        isCorrect: opt.isCorrect || false,
                        scoreValue: opt.scoreValue || 0,
                    })),
                },
            },
        });
        createdCount++;

        if (createdCount % 20 === 0) {
            console.log(`   ✅ ${createdCount}/${totalQuestions} questions created...`);
        }
    }

    console.log(`\n✅ Successfully created ${createdCount} questions with options\n`);

    // Verification
    const questionCount = await prisma.question.count({
        where: { assessmentId: assessment.id },
    });
    const optionCount = await prisma.option.count({
        where: { question: { assessmentId: assessment.id } },
    });

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

    console.log('\n🎉 Student Career Assessment seeding completed successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
}

seedStudentAssessment()
    .then(async () => {
        await prisma.$disconnect();
        process.exit(0);
    })
    .catch(async (e) => {
        console.error('❌ Error seeding student assessments:', e);
        await prisma.$disconnect();
        process.exit(1);
    });
