import axios from 'axios';

const API_URL = 'http://localhost:4000/api/v1';

async function completeAssessment() {
    console.log('🤖 Automating Pragya 360° Employability Assessment...\n');

    try {
        // 1. Log in as Job Seeker
        console.log('🔑 Logging in...');
        const loginRes = await axios.post(`${API_URL}/auth/login`, {
            email: 'lorin@gmail.com',
            password: 'Pragya@123',
        });

        const token = loginRes.data.accessToken;
        const headers = { Authorization: `Bearer ${token}` };
        console.log('✅ Logged in successfully.\n');

        // 2. Fetch available assessments and start
        console.log('📋 Fetching available assessments...');
        const availRes = await axios.get(`${API_URL}/assessments`, { headers });
        const assessmentId = availRes.data[0].id;

        console.log(`🚀 Starting assessment ID: ${assessmentId}`);
        const startRes = await axios.post(`${API_URL}/assessments/start`, { assessmentId }, { headers });
        const userAssessmentId = startRes.data.userAssessmentId || startRes.data.id;
        console.log(`📝 User Assessment ID: ${userAssessmentId}\n`);

        // 3. Fetch questions
        console.log('📚 Fetching questions...');
        const questionsRes = await axios.get(`${API_URL}/assessments/${assessmentId}/questions`, { headers });
        const questions = questionsRes.data.questions;
        console.log(`✅ Fetched ${questions.length} questions.\n`);

        // 4. Generate pseudo-random realistic answers for all questions
        console.log('✏️ Answering all questions...');
        let answers = [];

        for (let i = 0; i < questions.length; i++) {
            const q = questions[i];

            // Just select the first option for simplicity
            // or we could select random options. Let's select random options to avoid 0 scores everywhere, though it's 360 assessment so any answer is valid for RIASEC/Personality.
            // For Employability, better to pick randomly.
            const randomOptionIndex = Math.floor(Math.random() * q.options.length);
            const selectedOption = q.options[randomOptionIndex];

            answers.push({
                questionId: q.id,
                selectedOptionId: selectedOption.id
            });

            if ((i + 1) % 50 === 0) {
                console.log(`   Checked ${i + 1} questions...`);
            }
        }
        console.log('\n✅ All questions answered in memory.\n');

        // 5. Submit assessment
        console.log('📤 Submitting assessment...');
        const submitRes = await axios.post(
            `${API_URL}/assessments/submit`,
            {
                userAssessmentId,
                answers,
            },
            { headers }
        );

        console.log('🎉 Assessment submitted successfully!');
        console.log('Response:', submitRes.data);

    } catch (error: any) {
        console.error('❌ Error in automation script:');
        if (error.response) {
            console.error(error.response.data);
        } else {
            console.error(error.message);
        }
    }
}

completeAssessment();
