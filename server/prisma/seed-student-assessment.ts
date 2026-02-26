import { PrismaClient, AssessmentType, UserRole } from '@prisma/client';
import { studentAptitudeQuestions } from './seed-data/student-aptitude-questions';

const prisma = new PrismaClient();

/**
 * PRAGYA 360° CAREER ASSESSMENT (For School Students)
 * 
 * Total: 60 questions across 6 aptitude sections
 * - Numerical Reasoning: 10 questions
 * - Verbal Reasoning: 10 questions  
 * - Abstract/Fluid Reasoning: 10 questions
 * - Spatial Ability: 10 questions
 * - Mechanical Reasoning: 10 questions
 * - Processing Speed & Accuracy: 10 questions
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
            description: `Comprehensive aptitude assessment for school students covering 6 key areas:

1. **Numerical Reasoning** (10 questions)
   - Problem solving with numbers
   - Pattern recognition
   - Mathematical logic

2. **Verbal Reasoning** (10 questions)
   - Logical deduction
   - Verbal analogies
   - Critical analysis

3. **Abstract/Fluid Reasoning** (10 questions)
   - Pattern completion
   - Logical sequences
   - Non-verbal reasoning

4. **Spatial Ability** (10 questions)
   - 3D visualization
   - Mental rotation
   - Spatial relationships

5. **Mechanical Reasoning** (10 questions)
   - Physical principles
   - Cause and effect
   - Mechanical concepts

6. **Processing Speed & Accuracy** (10 questions)
   - Quick recognition
   - Symbol matching
   - Attention to detail

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

    // Seed all questions
    console.log('🔄 Seeding questions...');
    let orderIndex = 1;
    let createdCount = 0;

    for (const q of studentAptitudeQuestions) {
        const questionData = q as any; // Cast to handle optional fields
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

        // Progress indicator every 10 questions
        if (createdCount % 10 === 0) {
            console.log(`   ✅ ${createdCount}/${studentAptitudeQuestions.length} questions created...`);
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
