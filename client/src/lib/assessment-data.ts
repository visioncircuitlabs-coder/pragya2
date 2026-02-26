
export type QuestionType = 'MCQ' | 'SCALE';
export type AssessmentType = 'APTITUDE' | 'PERSONALITY';

export interface Option {
    id: string;
    text: string;
    value?: number; // For personality scores
    isCorrect?: boolean; // For aptitude tests
}

export interface Question {
    id: string;
    section: string; // e.g., "Logical & Analytical Reasoning" or "REALISTIC"
    text: string;
    type: QuestionType;
    options: Option[];
}

export interface Assessment {
    id: string;
    title: string;
    type: AssessmentType;
    description: string;
    timeLimit?: number; // in minutes
    questions: Question[];
}

export const assessments: Assessment[] = [
    {
        id: 'aptitude-test',
        title: 'Adult Aptitude Assessment',
        description: 'Evaluate your logical, numerical, and verbal reasoning skills.',
        type: 'APTITUDE',
        timeLimit: 45,
        questions: [
            // A) Logical & Analytical Reasoning
            {
                id: 'A1',
                section: 'Logical & Analytical Reasoning',
                text: 'If safety risk is high → stop work. Today risk is high. What should happen?',
                type: 'MCQ',
                options: [
                    { id: 'A', text: 'Stop work', isCorrect: true },
                    { id: 'B', text: 'Work faster', isCorrect: false },
                    { id: 'C', text: 'Inform later only', isCorrect: false },
                    { id: 'D', text: 'Continue silently', isCorrect: false },
                ]
            },
            {
                id: 'A2',
                section: 'Logical & Analytical Reasoning',
                text: 'All "certified workers" are allowed inside. Raju is certified. What is correct?',
                type: 'MCQ',
                options: [
                    { id: 'A', text: 'Raju is allowed', isCorrect: true },
                    { id: 'B', text: 'Raju is not allowed', isCorrect: false },
                    { id: 'C', text: 'No one is allowed', isCorrect: false },
                    { id: 'D', text: 'Cannot be known', isCorrect: false },
                ]
            },
            {
                id: 'A3',
                section: 'Logical & Analytical Reasoning',
                text: 'If fragile → top layer. If wet → separate box. Which item needs separate box AND top layer?',
                type: 'MCQ',
                options: [
                    { id: 'A', text: 'Dry non-fragile', isCorrect: false },
                    { id: 'B', text: 'Wet fragile', isCorrect: true },
                    { id: 'C', text: 'Dry fragile', isCorrect: false },
                    { id: 'D', text: 'Wet non-fragile', isCorrect: false },
                ]
            },
            {
                id: 'A4',
                section: 'Logical & Analytical Reasoning',
                text: '"If overheated, it slows down." The machine is NOT slowing down. Means:',
                type: 'MCQ',
                options: [
                    { id: 'A', text: 'Machine is overheated', isCorrect: false },
                    { id: 'B', text: 'Machine is NOT overheated', isCorrect: true },
                    { id: 'C', text: 'Machine is broken', isCorrect: false },
                    { id: 'D', text: 'Cannot say', isCorrect: false },
                ]
            },
            {
                id: 'A5',
                section: 'Logical & Analytical Reasoning',
                text: 'P is faster than Q. R is slower than Q. Who is slowest?',
                type: 'MCQ',
                options: [
                    { id: 'A', text: 'P', isCorrect: false },
                    { id: 'B', text: 'Q', isCorrect: false },
                    { id: 'C', text: 'R', isCorrect: true },
                    { id: 'D', text: 'Cannot say', isCorrect: false },
                ]
            },
            // B) Numerical Reasoning
            {
                id: 'B1',
                section: 'Numerical Reasoning',
                text: 'You earn ₹900 for 9 hours. Pay per hour?',
                type: 'MCQ',
                options: [
                    { id: 'A', text: '₹80', isCorrect: false },
                    { id: 'B', text: '₹90', isCorrect: false },
                    { id: 'C', text: '₹100', isCorrect: true },
                    { id: 'D', text: '₹120', isCorrect: false },
                ]
            },
            {
                id: 'B2',
                section: 'Numerical Reasoning',
                text: 'A worker makes 6 pieces in 1 hour. In 2 hours, how many?',
                type: 'MCQ',
                options: [
                    { id: 'A', text: '8', isCorrect: false },
                    { id: 'B', text: '10', isCorrect: false },
                    { id: 'C', text: '12', isCorrect: true },
                    { id: 'D', text: '18', isCorrect: false },
                ]
            },
            // C) Verbal Reasoning
            {
                id: 'C1',
                section: 'Verbal Reasoning',
                text: '"Helmet compulsory in this area." Best action:',
                type: 'MCQ',
                options: [
                    { id: 'A', text: 'Wear helmet', isCorrect: true },
                    { id: 'B', text: 'Carry', isCorrect: false },
                    { id: 'C', text: 'Wear later', isCorrect: false },
                    { id: 'D', text: 'Ignore', isCorrect: false },
                ]
            },
            // ... (I will add all questions from the files here, abbreviated for this artifact step)
        ]
    },
    {
        id: 'career-interest',
        title: 'Career Interest Inventory',
        description: 'Discover your career personality type (RIASEC).',
        type: 'PERSONALITY',
        questions: [
            // SECTION 1: REALISTIC (R)
            {
                id: 'R1',
                section: 'REALISTIC',
                text: 'I enjoy working with tools, equipment, or physical materials to get a task done.',
                type: 'SCALE',
                options: [
                    { id: 'A', text: 'Strongly Dislike', value: 1 },
                    { id: 'B', text: 'Dislike', value: 2 },
                    { id: 'C', text: 'Like', value: 3 },
                    { id: 'D', text: 'Strongly Like', value: 4 },
                ]
            },
            {
                id: 'R2',
                section: 'REALISTIC',
                text: 'I prefer tasks where I can build, fix, assemble, or operate something tangible.',
                type: 'SCALE',
                options: [
                    { id: 'A', text: 'Strongly Dislike', value: 1 },
                    { id: 'B', text: 'Dislike', value: 2 },
                    { id: 'C', text: 'Like', value: 3 },
                    { id: 'D', text: 'Strongly Like', value: 4 },
                ]
            },
            // SECTION 2: INVESTIGATIVE (I)
            {
                id: 'I1',
                section: 'INVESTIGATIVE',
                text: 'I enjoy analyzing information to understand patterns, causes, or solutions.',
                type: 'SCALE',
                options: [
                    { id: 'A', text: 'Strongly Dislike', value: 1 },
                    { id: 'B', text: 'Dislike', value: 2 },
                    { id: 'C', text: 'Like', value: 3 },
                    { id: 'D', text: 'Strongly Like', value: 4 },
                ]
            },
            // ... (Adding representative samples for structure)
        ]
    }
];
