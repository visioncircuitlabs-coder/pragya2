const fs = require('fs');

const inputFile = 'c:/Users/lenovo/Desktop/Vision Circuit LAbs/Pragya/Pragya2/career_assessment_test/STUDENT_ASSESSMENT_TEST.txt';
const outputFile = 'c:/Users/lenovo/Desktop/Vision Circuit LAbs/Pragya/Pragya2/server/prisma/seed-data/student-aptitude-questions.ts';

const content = fs.readFileSync(inputFile, 'utf8');

// Section mappings
const sectionMap = {
    'numerical reasoning': 'Numerical Reasoning',
    'verbal reasoning': 'Verbal Reasoning',
    'abstract': 'Abstract-Fluid Reasoning',
    'fluid reasoning': 'Abstract-Fluid Reasoning',
    'spatial ability': 'Spatial Ability',
    'mechanical reasoning': 'Mechanical Reasoning',
    'processing speed': 'Processing Speed & Accuracy',
};

function detectSection(line) {
    const lower = line.toLowerCase();
    for (const [key, value] of Object.entries(sectionMap)) {
        if (lower.includes(key)) return value;
    }
    return null;
}

function parseQuestions(content) {
    const lines = content.split('\n').map(l => l.trim()).filter(l => l);
    const questions = [];
    let currentSection = '';
    let i = 0;

    while (i < lines.length) {
        const line = lines[i];

        // Check for section header
        const section = detectSection(line);
        if (section && (line.includes('Questions') || line.includes('Reasoning') || line.includes('Ability') || line.includes('Speed'))) {
            currentSection = section;
            i++;
            continue;
        }

        // Check for Item
        if (line.match(/^Item\s*\d+/i) || line.match(/^\*\*Item\s*\d+/i)) {
            const question = parseItem(lines, i, currentSection);
            if (question) {
                questions.push(question);
                // Skip ahead
                i = question._endIndex || (i + 1);
            } else {
                i++;
            }
        } else {
            i++;
        }
    }

    return questions;
}

function parseItem(lines, startIndex, section) {
    let i = startIndex;
    let englishText = '';
    let malayalamText = '';
    let options = [];
    let answerText = '';

    // Parse until next Item or section
    while (i < lines.length) {
        const line = lines[i];

        // Stop conditions
        if (i > startIndex && (line.match(/^Item\s*\d+/i) || line.match(/^\*\*Item\s*\d+/i))) {
            break;
        }
        if (i > startIndex && line.includes('________________')) {
            break;
        }
        if (detectSection(line) && line.includes('Questions')) {
            break;
        }

        // Parse English
        if (line.includes('English:') || line.includes('**English**:')) {
            englishText = line.replace(/\*?\*?\s*English:?\s*\*?\*?/i, '').replace(/^\*\s*/, '').trim();
        }

        // Parse Malayalam
        if (line.includes('Malayalam:') || line.includes('**Malayalam**:')) {
            malayalamText = line.replace(/\*?\*?\s*Malayalam:?\s*\*?\*?/i, '').replace(/^\*\s*/, '').trim();
        }

        // Parse Options
        if (line.includes('Options:') || line.includes('**Options**:')) {
            const optionContent = line.replace(/\*?\*?\s*Options:?\s*\*?\*?/i, '').replace(/^\*\s*/, '').trim();
            if (optionContent) {
                // Options on same line, comma-separated
                const optParts = optionContent.split(',').map(o => o.trim()).filter(o => o);
                if (optParts.length >= 2) {
                    options = optParts.map(o => ({ text: cleanOption(o), textMl: '', isCorrect: false }));
                }
            }
            // Look for numbered options on subsequent lines
            let j = i + 1;
            while (j < lines.length) {
                const optLine = lines[j];
                if (optLine.match(/^\d+\.\s/) || optLine.match(/^[A-D]\.\s/i)) {
                    const optText = optLine.replace(/^\d+\.\s*/, '').replace(/^[A-D]\.\s*/i, '').trim();
                    options.push({ text: cleanOption(optText), textMl: extractMalayalam(optText), isCorrect: false });
                    j++;
                } else if (optLine.startsWith('*') && !optLine.includes('Answer:') && !optLine.includes('Logic:')) {
                    // Might be a bold option
                    const optText = optLine.replace(/^\*+\s*/, '').replace(/\*+\s*$/, '').trim();
                    if (optText && !optText.includes(':')) {
                        options.push({ text: cleanOption(optText), textMl: extractMalayalam(optText), isCorrect: false });
                        j++;
                    } else {
                        break;
                    }
                } else {
                    break;
                }
            }
        }

        // Parse Answer
        if (line.includes('Answer:') || line.includes('**Answer**:')) {
            answerText = line.replace(/\*?\*?\s*Answer:?\s*\*?\*?/i, '').replace(/^\*\s*/, '').trim();
            // Clean up answer text
            answerText = answerText.replace(/\*\*/g, '').trim();
        }

        i++;
    }

    // If no options parsed from numbered lines, try to extract from simple comma list
    if (options.length < 2 && englishText) {
        // Search backward for options
        for (let j = startIndex; j < Math.min(startIndex + 15, lines.length); j++) {
            if (lines[j].includes('Options:')) {
                const optLine = lines[j].replace(/\*?\*?\s*Options:?\s*\*?\*?/i, '').replace(/^\*\s*/, '').trim();
                if (optLine) {
                    const opts = optLine.split(',').map(o => o.trim()).filter(o => o);
                    if (opts.length >= 2) {
                        options = opts.map(o => {
                            const clean = cleanOption(o);
                            return { text: clean, textMl: extractMalayalam(o), isCorrect: false };
                        });
                        break;
                    }
                }
            }
        }
    }

    // Mark correct answer
    if (answerText && options.length > 0) {
        const answerClean = answerText.toLowerCase().replace(/[^\w\s]/g, '').trim();
        for (let opt of options) {
            const optClean = opt.text.toLowerCase().replace(/[^\w\s]/g, '').trim();
            if (answerClean.includes(optClean) || optClean.includes(answerClean)) {
                opt.isCorrect = true;
                break;
            }
        }
        // If no match found, try partial match on first words
        if (!options.some(o => o.isCorrect)) {
            const answerWords = answerClean.split(/\s+/).slice(0, 3).join(' ');
            for (let opt of options) {
                const optWords = opt.text.toLowerCase().replace(/[^\w\s]/g, '').split(/\s+/).slice(0, 3).join(' ');
                if (answerWords.includes(optWords) || optWords.includes(answerWords)) {
                    opt.isCorrect = true;
                    break;
                }
            }
        }
    }

    if (!englishText || options.length < 2) {
        return null;
    }

    return {
        section,
        text: englishText,
        textMl: malayalamText || undefined,
        options: options.slice(0, 4),
        _endIndex: i
    };
}

function cleanOption(text) {
    // Remove Malayalam text in parentheses for the main text field
    let clean = text.replace(/\([\u0D00-\u0D7F\s]+\)/g, '').trim();
    // Remove bold markers
    clean = clean.replace(/\*\*/g, '').trim();
    // Remove leading numbers/letters
    clean = clean.replace(/^\d+\.\s*/, '').replace(/^[A-D]\.\s*/i, '').trim();
    return clean;
}

function extractMalayalam(text) {
    // Extract Malayalam text from parentheses
    const match = text.match(/\(([\u0D00-\u0D7F][^)]+)\)/);
    return match ? match[1].trim() : '';
}

const questions = parseQuestions(content);

// Remove internal properties
const cleanQuestions = questions.map(q => {
    const { _endIndex, ...rest } = q;
    return rest;
});

console.log(`Parsed ${cleanQuestions.length} questions`);

// Section breakdown
const sections = {};
for (const q of cleanQuestions) {
    sections[q.section] = (sections[q.section] || 0) + 1;
}
console.log('\nSection breakdown:');
for (const [s, count] of Object.entries(sections)) {
    console.log(`  ${s}: ${count}`);
}

// Check correct answers
const correctCount = cleanQuestions.filter(q => q.options.some(o => o.isCorrect)).length;
console.log(`\nQuestions with correct answer marked: ${correctCount}/${cleanQuestions.length}`);

// Show sample
console.log('\nSample question:');
console.log(JSON.stringify(cleanQuestions[0], null, 2));

// Write output
const output = `export const studentAptitudeQuestions = ${JSON.stringify(cleanQuestions, null, 4)};
`;

fs.writeFileSync(outputFile, output, 'utf8');
console.log(`\nWritten to: ${outputFile}`);
