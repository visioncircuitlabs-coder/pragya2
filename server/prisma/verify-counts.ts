import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function verify() {
    const total = await prisma.question.count();
    console.log('Total questions:', total);

    const sections = await prisma.question.groupBy({
        by: ['section'],
        _count: { section: true },
        orderBy: { section: 'asc' },
    });

    console.log('\nSection breakdown:');
    sections.forEach(s => console.log(`  ${s.section}: ${s._count.section}`));

    await prisma.$disconnect();
}

verify();
