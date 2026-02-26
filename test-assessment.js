const API = 'http://localhost:4000/api/v1';

async function run() {
    const email = `testjobseeker_${Date.now()}@test.com`;
    const password = 'Test@1234';

    // 1. Register JOB_SEEKER
    console.log('1. Registering job seeker...');
    const regRes = await fetch(`${API}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role: 'JOB_SEEKER', fullName: 'Test Job Seeker' }),
    });
    const regData = await regRes.json();
    if (!regRes.ok) throw new Error(`Register failed: ${JSON.stringify(regData)}`);
    console.log('   Registered:', email);

    // 2. Login
    console.log('2. Logging in...');
    const loginRes = await fetch(`${API}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    });
    const loginData = await loginRes.json();
    if (!loginRes.ok) throw new Error(`Login failed: ${JSON.stringify(loginData)}`);
    const token = loginData.accessToken;
    console.log('   Got token');

    const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };

    // 3. Get available assessments
    console.log('3. Finding 360° assessment...');
    const assessRes = await fetch(`${API}/assessments`, { headers });
    const assessments = await assessRes.json();
    const assessment360 = assessments.find(a => a.title.includes('360'));
    if (!assessment360) throw new Error('360° assessment not found');
    console.log(`   Found: ${assessment360.title} (${assessment360.questionCount} questions)`);

    // 4. Get questions
    console.log('4. Fetching questions...');
    const qRes = await fetch(`${API}/assessments/${assessment360.id}/questions`, { headers });
    const qData = await qRes.json();
    console.log(`   Got ${qData.questions.length} questions`);

    // 5. Start assessment
    console.log('5. Starting assessment...');
    const startRes = await fetch(`${API}/assessments/start`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ assessmentId: assessment360.id }),
    });
    const startData = await startRes.json();
    if (!startRes.ok) throw new Error(`Start failed: ${JSON.stringify(startData)}`);
    const userAssessmentId = startData.userAssessmentId;
    console.log(`   Started: ${userAssessmentId}`);

    // 6. Build answers - pick strategically varied options
    const answers = qData.questions.map((q, i) => {
        const opts = q.options;
        let pickIdx;
        const section = q.section;

        if (section.includes('REALISTIC') || section.includes('SOCIAL') || section.includes('INVESTIGATIVE')) {
            pickIdx = Math.min(3, opts.length - 1); // High score for RSI
        } else if (section.includes('ARTISTIC') || section.includes('ENTERPRISING') || section.includes('CONVENTIONAL')) {
            pickIdx = Math.min(1, opts.length - 1); // Medium score for others
        } else if (section.includes('Core Skills') || section.includes('Functional') || section.includes('Behavioral')) {
            pickIdx = Math.min(2, opts.length - 1); // Moderate employability
        } else if (section.includes('Discipline') || section.includes('Stress') || section.includes('Learning') ||
                   section.includes('Social Engagement') || section.includes('Team') || section.includes('Integrity')) {
            pickIdx = Math.min(3, opts.length - 1); // High personality
        } else {
            // Aptitude - pick randomly with slight bias toward correct
            pickIdx = i % opts.length;
        }

        return { questionId: q.id, selectedOptionId: opts[pickIdx].id };
    });

    // 7. Submit
    console.log('6. Submitting assessment...');
    const submitRes = await fetch(`${API}/assessments/submit`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ userAssessmentId, answers }),
    });
    const submitData = await submitRes.json();
    if (!submitRes.ok) throw new Error(`Submit failed: ${JSON.stringify(submitData)}`);
    console.log('   Assessment submitted!');

    // 8. Get results
    console.log('7. Fetching results...');
    const resultRes = await fetch(`${API}/assessments/results/${userAssessmentId}`, { headers });
    const resultData = await resultRes.json();
    console.log(`   Total Score: ${resultData.totalScore}%`);
    console.log(`   Holland Code: ${resultData.riasecCode}`);
    console.log(`   Performance Level: ${resultData.performanceLevel}`);
    console.log(`   Top Strengths: ${resultData.topStrengths?.join(', ')}`);
    console.log(`   Clarity Index: ${resultData.clarityIndex}`);
    console.log(`   Career Matches: ${resultData.careerMatches?.length || 0}`);
    console.log(`   AI Summary: ${resultData.aiSummary ? 'Yes' : 'No'}`);

    // Output for browser use
    console.log('\n--- RESULTS ---');
    console.log(`EMAIL=${email}`);
    console.log(`PASSWORD=${password}`);
    console.log(`TOKEN=${token}`);
    console.log(`RESULT_ID=${userAssessmentId}`);
    console.log(`RESULT_URL=http://localhost:3001/assessment/results/${userAssessmentId}`);
}

run().catch(e => { console.error('ERROR:', e.message); process.exit(1); });
