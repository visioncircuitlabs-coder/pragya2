const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

const STUDENTS = [
    { name: 'Sajitha', phone: '7510941782' },
    { name: 'Rajitha', phone: '9947789673' },
    { name: 'Nisha Udhayan', phone: '9747189699' },
    { name: 'Kalaranjini', phone: '9744494672' },
    { name: 'Bindhu Sreeraman', phone: '8606402014' },
    { name: 'Beena K', phone: '8157815033' },
    { name: 'Samitha', phone: '9544691652' },
    { name: 'Sulu Sadheesh', phone: '9747135695' },
    { name: 'Savithri', phone: '9747497285' },
    { name: 'Subha', phone: '9207250732' },
    { name: 'Leela', phone: '9605731527' },
    { name: 'Manju', phone: '9847742012' },
    { name: 'Divya', phone: '8086155399' },
    { name: 'Reji', phone: '7559801037' },
];

const PASSWORD = 'Student@1234';

async function seedStudents() {
    console.log('Creating 14 student accounts...\n');

    const hashedPassword = await bcrypt.hash(PASSWORD, 12);
    let created = 0;
    let skipped = 0;

    for (const student of STUDENTS) {
        const email = `${student.phone}@pragya.in`;

        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing) {
            console.log(`  SKIP: ${student.name} (${email}) - already exists`);
            skipped++;
            continue;
        }

        await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                role: 'STUDENT',
                emailVerified: true,
                isActive: true,
                studentProfile: {
                    create: {
                        fullName: student.name,
                        phone: student.phone,
                    },
                },
            },
        });

        console.log(`  OK: ${student.name} (${email})`);
        created++;
    }

    console.log(`\nDone. Created: ${created}, Skipped: ${skipped}`);
    console.log(`Password for all accounts: ${PASSWORD}`);
    console.log('Login with phone number on the login page.');
}

seedStudents()
    .catch((e) => {
        console.error('Error:', e);
        process.exit(1);
    })
    .finally(() => prisma.$disconnect());
