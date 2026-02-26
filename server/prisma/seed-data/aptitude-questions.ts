import { PrismaClient, AssessmentType, UserRole } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * PRAGYA 360° EMPLOYABILITY ASSESSMENT - Complete Seed Data
 * Total: 142 questions across 4 modules
 * - Adult Aptitude: 40 questions (6 sections)
 * - RIASEC Career Interest: 48 questions (6 sections)
 * - Employability Skills: 24 questions (3 sections)
 * - Personality Traits: 30 questions (6 sections)
 */

// ============================================================
// SECTION 1: ADULT APTITUDE ASSESSMENT (40 Questions)
// ============================================================

const aptitudeQuestions = [
    // A) Logical & Analytical Reasoning (8 questions)
    {
        section: 'Logical & Analytical Reasoning',
        text: 'If safety risk is high → stop work. Today risk is high. What should happen?',
        textMl: 'സുരക്ഷാ ഭീഷണി കൂടുതലാണെങ്കിൽ ജോലി നിർത്തുക എന്നതാണ് നിയമം. ഇന്ന് ഭീഷണി കൂടുതലാണ്. എന്ത് ചെയ്യണം?',
        options: [
            { text: 'Stop work', textMl: 'ജോലി നിർത്തുക', isCorrect: true, scoreValue: 1 },
            { text: 'Work faster', textMl: 'വേഗത്തിൽ ജോലി ചെയ്യുക', isCorrect: false, scoreValue: 0 },
            { text: 'Inform later only', textMl: 'പിന്നീട് അറിയിക്കുക', isCorrect: false, scoreValue: 0 },
            { text: 'Continue silently', textMl: 'ശബ്ദമില്ലാതെ തുടരുക', isCorrect: false, scoreValue: 0 },
        ],
    },
    {
        section: 'Logical & Analytical Reasoning',
        text: 'All "certified workers" are allowed inside. Raju is certified. What is correct?',
        textMl: 'എല്ലാ "സർട്ടിഫൈഡ് തൊഴിലാളികൾക്കും" ഉള്ളിൽ പ്രവേശിക്കാം. രാജു സർട്ടിഫൈഡ് ആണ്. ഏതാണ് ശരി?',
        options: [
            { text: 'Raju is allowed', textMl: 'രാജുവിന് അനുമതിയുണ്ട്', isCorrect: true, scoreValue: 1 },
            { text: 'Raju is not allowed', textMl: 'രാജുവിന് അനുമതിയില്ല', isCorrect: false, scoreValue: 0 },
            { text: 'No one is allowed', textMl: 'ആർക്കും അനുമതിയില്ല', isCorrect: false, scoreValue: 0 },
            { text: 'Cannot be known', textMl: 'പറയാൻ കഴിയില്ല', isCorrect: false, scoreValue: 0 },
        ],
    },
    {
        section: 'Logical & Analytical Reasoning',
        text: 'If fragile → top layer. If wet → separate box. Which item needs separate box AND top layer?',
        textMl: 'പൊട്ടാൻ സാധ്യതയുള്ളവ ഏറ്റവും മുകളിൽ വെക്കണം. നനഞ്ഞവ പ്രത്യേക ബോക്സിൽ വെക്കണം.',
        options: [
            { text: 'Dry non-fragile', textMl: 'ഉണങ്ങിയ പൊട്ടാത്ത വസ്തു', isCorrect: false, scoreValue: 0 },
            { text: 'Wet fragile', textMl: 'നനഞ്ഞ പൊട്ടാൻ സാധ്യതയുള്ള വസ്തു', isCorrect: true, scoreValue: 1 },
            { text: 'Dry fragile', textMl: 'ഉണങ്ങിയ പൊട്ടാൻ സാധ്യതയുള്ള വസ്തു', isCorrect: false, scoreValue: 0 },
            { text: 'Wet non-fragile', textMl: 'നനഞ്ഞ പൊട്ടാത്ത വസ്തു', isCorrect: false, scoreValue: 0 },
        ],
    },
    {
        section: 'Logical & Analytical Reasoning',
        text: '"If overheated, it slows down." The machine is NOT slowing down. This means:',
        textMl: '"ചൂട് കൂടിയാൽ മെഷീൻ വേഗത കുറയ്ക്കും." മെഷീൻ വേഗത കുറയ്ക്കുന്നില്ല. ഇതിനർത്ഥം:',
        options: [
            { text: 'Machine is overheated', textMl: 'ചൂട് കൂടുതലാണ്', isCorrect: false, scoreValue: 0 },
            { text: 'Machine is NOT overheated', textMl: 'ചൂട് കൂടിയിട്ടില്ല', isCorrect: true, scoreValue: 1 },
            { text: 'Machine is broken', textMl: 'മെഷീൻ കേടാണ്', isCorrect: false, scoreValue: 0 },
            { text: 'Cannot say', textMl: 'പറയാൻ കഴിയില്ല', isCorrect: false, scoreValue: 0 },
        ],
    },
    {
        section: 'Logical & Analytical Reasoning',
        text: 'P is faster than Q. R is slower than Q. Who is slowest?',
        textMl: 'P, Q-വിനേക്കാൾ വേഗമുള്ളവനാണ്. R, Q-വിനേക്കാൾ വേഗത കുറഞ്ഞവനാണ്. ഏറ്റവും വേഗത കുറഞ്ഞത് ആര്?',
        options: [
            { text: 'P', textMl: 'P', isCorrect: false, scoreValue: 0 },
            { text: 'Q', textMl: 'Q', isCorrect: false, scoreValue: 0 },
            { text: 'R', textMl: 'R', isCorrect: true, scoreValue: 1 },
            { text: 'Cannot say', textMl: 'പറയാൻ കഴിയില്ല', isCorrect: false, scoreValue: 0 },
        ],
    },
    {
        section: 'Logical & Analytical Reasoning',
        text: 'If C2 fails, product must not go to C3. Today C2 failed. What is correct?',
        textMl: 'C2 പരാജയപ്പെട്ടാൽ ഉൽപ്പന്നം C3-ലേക്ക് അയക്കാൻ പാടില്ല. ഇന്ന് C2 പരാജയപ്പെട്ടു. ഏതാണ് ശരി?',
        options: [
            { text: 'Send to C3', textMl: 'C3-ലേക്ക് അയക്കുക', isCorrect: false, scoreValue: 0 },
            { text: 'Skip C3', textMl: 'C3 ഒഴിവാക്കുക', isCorrect: true, scoreValue: 1 },
            { text: 'Repeat C1', textMl: 'C1 വീണ്ടും ചെയ്യുക', isCorrect: false, scoreValue: 0 },
            { text: 'No action', textMl: 'ഒന്നും ചെയ്യേണ്ടതില്ല', isCorrect: false, scoreValue: 0 },
        ],
    },
    {
        section: 'Logical & Analytical Reasoning',
        text: 'Start Task B only if Task A is finished AND power is stable. Today: A finished, power unstable.',
        textMl: 'ടാസ്ക് A കഴിയുകയും പവർ സ്റ്റേബിൾ ആയിരിക്കുകയും ചെയ്താൽ മാത്രം B തുടങ്ങുക. ഇന്ന്: A കഴിഞ്ഞു, പവർ അസ്ഥിരമാണ്.',
        options: [
            { text: 'Start Task B', textMl: 'B തുടങ്ങുക', isCorrect: false, scoreValue: 0 },
            { text: "Don't start Task B", textMl: 'B തുടങ്ങരുത്', isCorrect: true, scoreValue: 1 },
            { text: 'Start Task B slowly', textMl: 'പതുക്കെ തുടങ്ങുക', isCorrect: false, scoreValue: 0 },
            { text: 'Start and inform later', textMl: 'തുടങ്ങുക, ശേഷം അറിയിക്കുക', isCorrect: false, scoreValue: 0 },
        ],
    },
    {
        section: 'Logical & Analytical Reasoning',
        text: 'Reject if (small AND metal) OR (large AND cracked). Which will be accepted?',
        textMl: 'ചെറുതും ലോഹവും ആയവ, അല്ലെങ്കിൽ വലുതും വിള്ളലുള്ളതും ആയവ ഒഴിവാക്കുക. ഏത് സ്വീകരിക്കും?',
        options: [
            { text: 'Small metal', textMl: 'ചെറിയ ലോഹം', isCorrect: false, scoreValue: 0 },
            { text: 'Large cracked', textMl: 'വലിയ വിള്ളലുള്ളത്', isCorrect: false, scoreValue: 0 },
            { text: 'Small plastic', textMl: 'ചെറിയ പ്ലാസ്റ്റിക്', isCorrect: true, scoreValue: 1 },
            { text: 'Large cracked but clean', textMl: 'വൃത്തിയുള്ള വലിയ വിള്ളലുള്ള വസ്തു', isCorrect: false, scoreValue: 0 },
        ],
    },

    // B) Numerical Reasoning (8 questions)
    {
        section: 'Numerical Reasoning',
        text: 'You earn ₹900 for 9 hours. Pay per hour?',
        textMl: '9 മണിക്കൂർ ജോലിക്ക് ₹900 ലഭിക്കുന്നു. ഒരു മണിക്കൂർ കൂലി എത്ര?',
        options: [
            { text: '₹80', textMl: '₹80', isCorrect: false, scoreValue: 0 },
            { text: '₹90', textMl: '₹90', isCorrect: false, scoreValue: 0 },
            { text: '₹100', textMl: '₹100', isCorrect: true, scoreValue: 1 },
            { text: '₹120', textMl: '₹120', isCorrect: false, scoreValue: 0 },
        ],
    },
    {
        section: 'Numerical Reasoning',
        text: 'A worker makes 6 pieces in 1 hour. In 2 hours, how many?',
        textMl: 'ഒരു തൊഴിലാളി 1 മണിക്കൂറിൽ 6 എണ്ണം നിർമ്മിക്കുന്നു. 2 മണിക്കൂറിൽ എത്ര എണ്ണം?',
        options: [
            { text: '8', textMl: '8', isCorrect: false, scoreValue: 0 },
            { text: '10', textMl: '10', isCorrect: false, scoreValue: 0 },
            { text: '12', textMl: '12', isCorrect: true, scoreValue: 1 },
            { text: '18', textMl: '18', isCorrect: false, scoreValue: 0 },
        ],
    },
    {
        section: 'Numerical Reasoning',
        text: 'Buy for ₹240, sell for ₹300. What is the gain?',
        textMl: '₹240-ന് വാങ്ങി ₹300-ന് വിറ്റു. ലാഭം എത്ര?',
        options: [
            { text: '₹40', textMl: '₹40', isCorrect: false, scoreValue: 0 },
            { text: '₹50', textMl: '₹50', isCorrect: false, scoreValue: 0 },
            { text: '₹60', textMl: '₹60', isCorrect: true, scoreValue: 1 },
            { text: '₹80', textMl: '₹80', isCorrect: false, scoreValue: 0 },
        ],
    },
    {
        section: 'Numerical Reasoning',
        text: 'Bus A: 120 km in 3 hrs. Bus B: 150 km in 4 hrs. Which is faster?',
        textMl: 'ബസ് A: 3 മണിക്കൂറിൽ 120 കി.മീ. ബസ് B: 4 മണിക്കൂറിൽ 150 കി.മീ. വേഗത കൂടുതൽ ഏതിന്?',
        options: [
            { text: 'A', textMl: 'A', isCorrect: true, scoreValue: 1 },
            { text: 'B', textMl: 'B', isCorrect: false, scoreValue: 0 },
            { text: 'Same', textMl: 'തുല്യം', isCorrect: false, scoreValue: 0 },
            { text: 'Cannot say', textMl: 'പറയാൻ കഴിയില്ല', isCorrect: false, scoreValue: 0 },
        ],
    },
    {
        section: 'Numerical Reasoning',
        text: '4 people take 8 hours. 8 people (same speed) take how long?',
        textMl: '4 പേർക്ക് ഒരു ജോലി തീർക്കാൻ 8 മണിക്കൂർ വേണം. എങ്കിൽ 8 പേർക്ക് എത്ര സമയം വേണം?',
        options: [
            { text: '2 hrs', textMl: '2 മണിക്കൂർ', isCorrect: false, scoreValue: 0 },
            { text: '4 hrs', textMl: '4 മണിക്കൂർ', isCorrect: true, scoreValue: 1 },
            { text: '6 hrs', textMl: '6 മണിക്കൂർ', isCorrect: false, scoreValue: 0 },
            { text: '8 hrs', textMl: '8 മണിക്കൂർ', isCorrect: false, scoreValue: 0 },
        ],
    },
    {
        section: 'Numerical Reasoning',
        text: '5 screen guards used per day. A pack of 60 lasts about:',
        textMl: 'ദിവസം 5 സ്ക്രീൻ ഗാർഡുകൾ ഉപയോഗിക്കുന്നു. 60 എണ്ണമുള്ള ഒരു പാക്കറ്റ് എത്ര ദിവസം വരും?',
        options: [
            { text: '10 days', textMl: '10 ദിവസം', isCorrect: false, scoreValue: 0 },
            { text: '12 days', textMl: '12 ദിവസം', isCorrect: true, scoreValue: 1 },
            { text: '15 days', textMl: '15 ദിവസം', isCorrect: false, scoreValue: 0 },
            { text: '20 days', textMl: '20 ദിവസം', isCorrect: false, scoreValue: 0 },
        ],
    },
    {
        section: 'Numerical Reasoning',
        text: 'Output drops from 40 to 30 units/day. For 300 units, extra days needed?',
        textMl: 'ഉൽപ്പാദനം പ്രതിദിനം 40-ൽ നിന്ന് 30-ലേക്ക് കുറഞ്ഞു. 300 എണ്ണം തീർക്കാൻ എത്ര അധികം ദിവസം വേണം?',
        options: [
            { text: '1 day', textMl: '1 ദിവസം', isCorrect: false, scoreValue: 0 },
            { text: '2 days', textMl: '2 ദിവസം', isCorrect: true, scoreValue: 1 },
            { text: '3 days', textMl: '3 ദിവസം', isCorrect: false, scoreValue: 0 },
            { text: '4 days', textMl: '4 ദിവസം', isCorrect: false, scoreValue: 0 },
        ],
    },
    {
        section: 'Numerical Reasoning',
        text: 'Price increases by 25%. How much of earlier quantity can you buy with same money?',
        textMl: 'വില 25% കൂടി. അതേ പണം കൊണ്ട് പഴയ അളവിന്റെ എത്ര ഭാഗം വാങ്ങാൻ കഴിയും?',
        options: [
            { text: 'Same', textMl: 'അതേപോലെ', isCorrect: false, scoreValue: 0 },
            { text: '80%', textMl: '80%', isCorrect: true, scoreValue: 1 },
            { text: '60%', textMl: '60%', isCorrect: false, scoreValue: 0 },
            { text: '40%', textMl: '40%', isCorrect: false, scoreValue: 0 },
        ],
    },

    // C) Verbal Reasoning (8 questions)
    {
        section: 'Verbal Reasoning',
        text: '"Helmet compulsory in this area." Best action:',
        textMl: '"ഈ ഭാഗത്ത് ഹെൽമെറ്റ് നിർബന്ധമാണ്." ഏറ്റവും നല്ല നടപടി:',
        options: [
            { text: 'Wear helmet', textMl: 'ധരിക്കുക', isCorrect: true, scoreValue: 1 },
            { text: 'Carry', textMl: 'കൈയ്യിൽ പിടിക്കുക', isCorrect: false, scoreValue: 0 },
            { text: 'Wear later', textMl: 'പിന്നീട് ധരിക്കുക', isCorrect: false, scoreValue: 0 },
            { text: 'Ignore', textMl: 'അവഗണിക്കുക', isCorrect: false, scoreValue: 0 },
        ],
    },
    {
        section: 'Verbal Reasoning',
        text: '"Submit report by 5 PM." means:',
        textMl: '"റിപ്പോർട്ട് വൈകുന്നേരം 5 മണിക്ക് മുൻപായി നൽകുക" എന്നാൽ:',
        options: [
            { text: 'Anytime', textMl: 'എപ്പോഴെങ്കിലും', isCorrect: false, scoreValue: 0 },
            { text: 'Before 5 PM', textMl: '5 PM മുൻപ്', isCorrect: true, scoreValue: 1 },
            { text: 'After 5 PM', textMl: '5 PM ശേഷം', isCorrect: false, scoreValue: 0 },
            { text: 'Next day', textMl: 'അടുത്ത ദിവസം', isCorrect: false, scoreValue: 0 },
        ],
    },
    {
        section: 'Verbal Reasoning',
        text: '"Do not switch on until indicator turns green." It is red now. What to do?',
        textMl: '"ഇൻഡിക്കേറ്റർ പച്ചയാകുന്നതുവരെ ഓൺ ചെയ്യരുത്." ഇപ്പോൾ ചുവപ്പാണ്. എന്ത് ചെയ്യണം?',
        options: [
            { text: 'Switch on', textMl: 'ഓൺ ചെയ്യുക', isCorrect: false, scoreValue: 0 },
            { text: 'Wait', textMl: 'കാത്തിരിക്കുക', isCorrect: true, scoreValue: 1 },
            { text: 'Shake', textMl: 'കുലുക്കുക', isCorrect: false, scoreValue: 0 },
            { text: 'Call someone', textMl: 'ആരെയെങ്കിലും വിളിക്കുക', isCorrect: false, scoreValue: 0 },
        ],
    },
    {
        section: 'Verbal Reasoning',
        text: '"If delays continue, delivery will be rescheduled." Delays continue. What happens?',
        textMl: '"താമസം തുടർന്നാൽ ഡെലിവറി സമയം മാറ്റും." താമസം തുടരുന്നു. എന്ത് സംഭവിക്കും?',
        options: [
            { text: 'Earlier', textMl: 'നേരത്തെയാകും', isCorrect: false, scoreValue: 0 },
            { text: 'Cancelled', textMl: 'റദ്ദാവും', isCorrect: false, scoreValue: 0 },
            { text: 'Rescheduled', textMl: 'സമയം മാറ്റും', isCorrect: true, scoreValue: 1 },
            { text: 'Guaranteed', textMl: 'ഉറപ്പാണ്', isCorrect: false, scoreValue: 0 },
        ],
    },
    {
        section: 'Verbal Reasoning',
        text: 'Which is the clearest instruction?',
        textMl: 'ഏറ്റവും വ്യക്തമായ നിർദ്ദേശം ഏതാണ്?',
        options: [
            { text: 'Do it neatly', textMl: 'നന്നായി ചെയ്യുക', isCorrect: false, scoreValue: 0 },
            { text: 'Do it quickly', textMl: 'വേഗം ചെയ്യുക', isCorrect: false, scoreValue: 0 },
            { text: 'Put labels on all boxes', textMl: 'എല്ലാ ബോക്സിലും ലേബൽ ഒട്ടിക്കുക', isCorrect: true, scoreValue: 1 },
            { text: 'Handle carefully', textMl: 'ശ്രദ്ധയോടെ കൈകാര്യം ചെയ്യുക', isCorrect: false, scoreValue: 0 },
        ],
    },
    {
        section: 'Verbal Reasoning',
        text: '"Finish this first. Then help others if time remains." Correct priority?',
        textMl: '"ആദ്യം ഇത് തീർക്കുക. സമയം ബാക്കിയുണ്ടെങ്കിൽ മാത്രം മറ്റുള്ളവരെ സഹായിക്കുക." ശരിയായ ക്രമം?',
        options: [
            { text: 'Help others first', textMl: 'മറ്റുള്ളവരെ ആദ്യം സഹായിക്കുക', isCorrect: false, scoreValue: 0 },
            { text: 'Finish your work first', textMl: 'സ്വന്തം ജോലി ആദ്യം തീർക്കുക', isCorrect: true, scoreValue: 1 },
            { text: 'Both at same time', textMl: 'രണ്ടും ഒരുമിച്ച്', isCorrect: false, scoreValue: 0 },
            { text: 'Skip', textMl: 'ഒഴിവാക്കുക', isCorrect: false, scoreValue: 0 },
        ],
    },
    {
        section: 'Verbal Reasoning',
        text: '"Inform me if the issue repeats." The issue repeats 3 times. What to do?',
        textMl: '"പ്രശ്നം ആവർത്തിച്ചാൽ അറിയിക്കുക." അത് 3 തവണ ആവർത്തിച്ചു. എന്ത് ചെയ്യണം?',
        options: [
            { text: 'Wait', textMl: 'കാത്തിരിക്കുക', isCorrect: false, scoreValue: 0 },
            { text: 'Inform now', textMl: 'ഉടൻ അറിയിക്കുക', isCorrect: true, scoreValue: 1 },
            { text: 'Fix silently', textMl: 'മൗനമായി ശരിയാക്കുക', isCorrect: false, scoreValue: 0 },
            { text: 'Ignore', textMl: 'അവഗണിക്കുക', isCorrect: false, scoreValue: 0 },
        ],
    },
    {
        section: 'Verbal Reasoning',
        text: '"I didn\'t break the tool, but I used it last." This means:',
        textMl: '"ഞാനല്ല ഇത് പൊട്ടിച്ചത്, പക്ഷെ അവസാനം ഉപയോഗിച്ചത് ഞാനാണ്." ഇതിനർത്ഥം:',
        options: [
            { text: 'He broke it', textMl: 'അവൻ പൊട്ടിച്ചു', isCorrect: false, scoreValue: 0 },
            { text: 'Someone else may have broken it', textMl: 'മറ്റാരെങ്കിലുമാകാം പൊട്ടിച്ചത്', isCorrect: true, scoreValue: 1 },
            { text: 'Not broken', textMl: 'പൊട്ടിയിട്ടില്ല', isCorrect: false, scoreValue: 0 },
            { text: 'Never used', textMl: 'ഉപയോഗിച്ചിട്ടില്ല', isCorrect: false, scoreValue: 0 },
        ],
    },

    // D) Spatial & Visual Reasoning (8 questions)
    {
        section: 'Spatial & Visual Reasoning',
        text: 'Rotation: ▲ → ▶ → ▼ → ?',
        textMl: 'കറക്കം: ▲ → ▶ → ▼ → ?',
        options: [
            { text: '◀', textMl: '◀', isCorrect: true, scoreValue: 1 },
            { text: '▲', textMl: '▲', isCorrect: false, scoreValue: 0 },
            { text: '■', textMl: '■', isCorrect: false, scoreValue: 0 },
            { text: '○', textMl: '○', isCorrect: false, scoreValue: 0 },
        ],
    },
    {
        section: 'Spatial & Visual Reasoning',
        text: 'Pattern: ⬛ ▢ ⬛ ▢ ⬛ ?',
        textMl: 'പാറ്റേൺ: ⬛ ▢ ⬛ ▢ ⬛ ?',
        options: [
            { text: '⬛', textMl: '⬛', isCorrect: false, scoreValue: 0 },
            { text: '▢', textMl: '▢', isCorrect: true, scoreValue: 1 },
            { text: '△', textMl: '△', isCorrect: false, scoreValue: 0 },
            { text: '○', textMl: '○', isCorrect: false, scoreValue: 0 },
        ],
    },
    {
        section: 'Spatial & Visual Reasoning',
        text: 'Adds one side each: Triangle (3) → Square (4) → Pentagon (5) → ?',
        textMl: 'ഓരോ വശം കൂടി വരുന്നു: ത്രികോണം (3) → ചതുരം (4) → പഞ്ചഭുജം (5) → ?',
        options: [
            { text: 'Triangle', textMl: 'ത്രികോണം', isCorrect: false, scoreValue: 0 },
            { text: 'Hexagon (6)', textMl: 'ഷഡ്ഭുജം (6)', isCorrect: true, scoreValue: 1 },
            { text: 'Octagon', textMl: 'അഷ്ടഭുജം', isCorrect: false, scoreValue: 0 },
            { text: 'Circle', textMl: 'വൃത്തം', isCorrect: false, scoreValue: 0 },
        ],
    },
    {
        section: 'Spatial & Visual Reasoning',
        text: 'Mirror → rotate 90°. Start: ▶. Result?',
        textMl: 'പ്രതിബിംബം → 90° തിരിക്കുക. തുടക്കം: ▶',
        options: [
            { text: '▲', textMl: '▲', isCorrect: true, scoreValue: 1 },
            { text: '▼', textMl: '▼', isCorrect: false, scoreValue: 0 },
            { text: '▶', textMl: '▶', isCorrect: false, scoreValue: 0 },
            { text: '◀', textMl: '◀', isCorrect: false, scoreValue: 0 },
        ],
    },
    {
        section: 'Spatial & Visual Reasoning',
        text: 'Outer same, inner changes: □• □× □• □× ?',
        textMl: 'പുറമെ ഒരേപോലെ, ഉള്ളിലെ അടയാളം മാറുന്നു. അടുത്തത് ഏത്?',
        options: [
            { text: '□•', textMl: '□•', isCorrect: true, scoreValue: 1 },
            { text: '□×', textMl: '□×', isCorrect: false, scoreValue: 0 },
            { text: '○•', textMl: '○•', isCorrect: false, scoreValue: 0 },
            { text: '△•', textMl: '△•', isCorrect: false, scoreValue: 0 },
        ],
    },
    {
        section: 'Spatial & Visual Reasoning',
        text: 'Which pair does NOT follow the rule?',
        textMl: 'ഏതാണ് നിയമം പാലിക്കാത്ത ജോഡി?',
        options: [
            { text: '⬜→◻︎', textMl: '⬜→◻︎', isCorrect: false, scoreValue: 0 },
            { text: '⬛→◼︎', textMl: '⬛→◼︎', isCorrect: false, scoreValue: 0 },
            { text: '△→▲', textMl: '△→▲', isCorrect: false, scoreValue: 0 },
            { text: '⬜→◼︎', textMl: '⬜→◼︎', isCorrect: true, scoreValue: 1 },
        ],
    },
    {
        section: 'Spatial & Visual Reasoning',
        text: 'Rotates 90° AND alternates fill. Start: ◻︎ (hollow), Step 1: ◼︎ (filled). Step 2?',
        textMl: '90° തിരിയുന്നു, ഒപ്പം നിറം മാറുന്നു. ഘട്ടം 2 എന്തായിരിക്കും?',
        options: [
            { text: '◻︎ (hollow)', textMl: '◻︎ (പൊള്ള)', isCorrect: true, scoreValue: 1 },
            { text: '◼︎ (filled)', textMl: '◼︎ (നിറഞ്ഞ)', isCorrect: false, scoreValue: 0 },
            { text: '△', textMl: '△', isCorrect: false, scoreValue: 0 },
            { text: '○', textMl: '○', isCorrect: false, scoreValue: 0 },
        ],
    },
    {
        section: 'Spatial & Visual Reasoning',
        text: 'Row: Shape 1 + Shape 2 = Shape 3. (Same = filled). ◻︎ + ◻︎ = ?',
        textMl: 'വരി: 1 + 2 = 3. (ഒരേ രൂപം വന്നാൽ ഉള്ളിൽ നിറയുന്നു). ◻︎ + ◻︎ = ?',
        options: [
            { text: '◻︎', textMl: '◻︎', isCorrect: false, scoreValue: 0 },
            { text: '◼︎', textMl: '◼︎', isCorrect: true, scoreValue: 1 },
            { text: '△', textMl: '△', isCorrect: false, scoreValue: 0 },
            { text: '○', textMl: '○', isCorrect: false, scoreValue: 0 },
        ],
    },

    // E) Attention & Speed (8 questions)
    {
        section: 'Attention & Speed',
        text: 'Find the exactly identical pair:',
        textMl: 'കൃത്യമായി ഒരുപോലെയുള്ള ജോഡി കണ്ടെത്തുക:',
        options: [
            { text: 'ABBA - ABAB', textMl: 'ABBA - ABAB', isCorrect: false, scoreValue: 0 },
            { text: 'ABAB - BABA', textMl: 'ABAB - BABA', isCorrect: false, scoreValue: 0 },
            { text: 'ABBA - ABBA', textMl: 'ABBA - ABBA', isCorrect: true, scoreValue: 1 },
            { text: 'AABB - ABAB', textMl: 'AABB - ABAB', isCorrect: false, scoreValue: 0 },
        ],
    },
    {
        section: 'Attention & Speed',
        text: 'Which is different in pattern type?',
        textMl: 'ക്രമത്തിൽ വ്യത്യാസമുള്ളത് ഏത്?',
        options: [
            { text: '7-7-7', textMl: '7-7-7', isCorrect: false, scoreValue: 0 },
            { text: '4-4-4', textMl: '4-4-4', isCorrect: false, scoreValue: 0 },
            { text: '9-9-9', textMl: '9-9-9', isCorrect: false, scoreValue: 0 },
            { text: '8-9-8', textMl: '8-9-8', isCorrect: true, scoreValue: 1 },
        ],
    },
    {
        section: 'Attention & Speed',
        text: 'Which violates the rule "+2 each step"?',
        textMl: '"+2 വീതം കൂടുക" എന്ന നിയമം തെറ്റിക്കുന്നത് ഏത്?',
        options: [
            { text: '3,5,8,9', textMl: '3,5,8,9', isCorrect: true, scoreValue: 1 },
            { text: '2,4,6,8', textMl: '2,4,6,8', isCorrect: false, scoreValue: 0 },
            { text: '6,8,10,12', textMl: '6,8,10,12', isCorrect: false, scoreValue: 0 },
            { text: '1,3,5,7', textMl: '1,3,5,7', isCorrect: false, scoreValue: 0 },
        ],
    },
    {
        section: 'Attention & Speed',
        text: 'Rule: Circle after Triangle; Triangle after Square. Square, Triangle, Circle, Square, Triangle, ___?',
        textMl: 'നിയമം: ത്രികോണത്തിന് ശേഷം വട്ടം; ചതുരത്തിന് ശേഷം ത്രികോണം. വിട്ട ഭാഗം പൂരിപ്പിക്കുക.',
        options: [
            { text: 'Square', textMl: 'ചതുരം', isCorrect: false, scoreValue: 0 },
            { text: 'Triangle', textMl: 'ത്രികോണം', isCorrect: false, scoreValue: 0 },
            { text: 'Circle', textMl: 'വട്ടം', isCorrect: true, scoreValue: 1 },
            { text: 'Stop', textMl: 'നിർത്തുക', isCorrect: false, scoreValue: 0 },
        ],
    },
    {
        section: 'Attention & Speed',
        text: "Which string has exactly two 'A's?",
        textMl: "കൃത്യം രണ്ട് 'A' ഉള്ളത് ഏതിൽ?",
        options: [
            { text: 'BBAAB', textMl: 'BBAAB', isCorrect: true, scoreValue: 1 },
            { text: 'ABAAA', textMl: 'ABAAA', isCorrect: false, scoreValue: 0 },
            { text: 'AABAA', textMl: 'AABAA', isCorrect: false, scoreValue: 0 },
            { text: 'BBBBB', textMl: 'BBBBB', isCorrect: false, scoreValue: 0 },
        ],
    },
    {
        section: 'Attention & Speed',
        text: 'Middle symbol is different from both sides:',
        textMl: 'നടുവിലത്തെ ചിഹ്നം രണ്ട് വശങ്ങളിൽ നിന്നും വ്യത്യസ്തമായത് ഏത്?',
        options: [
            { text: '○○○', textMl: '○○○', isCorrect: false, scoreValue: 0 },
            { text: '▲▲▲', textMl: '▲▲▲', isCorrect: false, scoreValue: 0 },
            { text: '■□■', textMl: '■□■', isCorrect: true, scoreValue: 1 },
            { text: '●●●', textMl: '●●●', isCorrect: false, scoreValue: 0 },
        ],
    },
    {
        section: 'Attention & Speed',
        text: "If two same in a row, choose 'STOP'. Scan: A B C C D E",
        textMl: "അടുത്തടുത്തായി രണ്ട് ഒരേ അക്ഷരങ്ങൾ കണ്ടാൽ 'STOP' തിരഞ്ഞെടുക്കുക. ഇതിൽ ഏതാണ് ഉത്തരം?",
        options: [
            { text: 'GO', textMl: 'GO', isCorrect: false, scoreValue: 0 },
            { text: 'STOP', textMl: 'STOP', isCorrect: true, scoreValue: 1 },
            { text: 'REPEAT', textMl: 'REPEAT', isCorrect: false, scoreValue: 0 },
            { text: 'IGNORE', textMl: 'IGNORE', isCorrect: false, scoreValue: 0 },
        ],
    },
    {
        section: 'Attention & Speed',
        text: 'Pattern: 1st and 3rd same, 2nd and 4th same. Which is correct?',
        textMl: 'ക്രമം: ഒന്നും മൂന്നും ഒരേപോലെ, രണ്ടും നാലും ഒരേപോലെ. ഏതാണ് ശരി?',
        options: [
            { text: 'A B A B', textMl: 'A B A B', isCorrect: true, scoreValue: 1 },
            { text: 'A A B B', textMl: 'A A B B', isCorrect: false, scoreValue: 0 },
            { text: 'A B B A', textMl: 'A B B A', isCorrect: false, scoreValue: 0 },
            { text: 'A A A B', textMl: 'A A A B', isCorrect: false, scoreValue: 0 },
        ],
    },

    // F) Work-Style Problem Solving (8 questions)
    {
        section: 'Work-Style Problem Solving',
        text: 'Mistake fixable safely in 1 minute. Best action:',
        textMl: 'ഒരു തെറ്റ് 1 മിനിറ്റിൽ സുരക്ഷിതമായി തിരുത്താം. എന്ത് ചെയ്യണം?',
        options: [
            { text: 'Fix safely and inform', textMl: 'തിരുത്തി അറിയിക്കുക', isCorrect: true, scoreValue: 1 },
            { text: 'Ignore', textMl: 'അവഗണിക്കുക', isCorrect: false, scoreValue: 0 },
            { text: 'Wait', textMl: 'കാത്തിരിക്കുക', isCorrect: false, scoreValue: 0 },
            { text: 'Tell others', textMl: 'മറ്റുള്ളവരോട് പറയുക', isCorrect: false, scoreValue: 0 },
        ],
    },
    {
        section: 'Work-Style Problem Solving',
        text: 'Material is missing and work will stop. Best first step:',
        textMl: 'സാമഗ്രികൾ തീർന്നതിനാൽ ജോലി തടസ്സപ്പെടുന്നു. ആദ്യം എന്ത് ചെയ്യണം?',
        options: [
            { text: 'Continue wrongly', textMl: 'തെറ്റായി തുടരുക', isCorrect: false, scoreValue: 0 },
            { text: 'Inform supervisor', textMl: 'മേലധികാരിയെ അറിയിക്കുക', isCorrect: true, scoreValue: 1 },
            { text: 'Leave', textMl: 'പോകുക', isCorrect: false, scoreValue: 0 },
            { text: 'Wait silently', textMl: 'മൗനമായി കാത്തിരിക്കുക', isCorrect: false, scoreValue: 0 },
        ],
    },
    {
        section: 'Work-Style Problem Solving',
        text: 'A customer gives unclear requirements. Best action:',
        textMl: 'ഉപഭോക്താവ് വ്യക്തമല്ലാത്ത ആവശ്യങ്ങൾ നൽകുന്നു. എന്ത് ചെയ്യണം?',
        options: [
            { text: 'Guess', textMl: 'ഊഹിക്കുക', isCorrect: false, scoreValue: 0 },
            { text: 'Ask clear questions', textMl: 'ചോദിച്ച് വ്യക്തത വരുത്തുക', isCorrect: true, scoreValue: 1 },
            { text: 'Start and change later', textMl: 'തുടങ്ങി പിന്നീട് മാറ്റുക', isCorrect: false, scoreValue: 0 },
            { text: 'Avoid', textMl: 'ഒഴിവാക്കുക', isCorrect: false, scoreValue: 0 },
        ],
    },
    {
        section: 'Work-Style Problem Solving',
        text: 'A coworker repeats the same error daily. Best approach:',
        textMl: 'സഹപ്രവർത്തകൻ എന്നും ഒരേ തെറ്റ് ആവർത്തിക്കുന്നു. എന്ത് ചെയ്യണം?',
        options: [
            { text: 'Mock them', textMl: 'പരിഹസിക്കുക', isCorrect: false, scoreValue: 0 },
            { text: 'Explain politely', textMl: 'മര്യാദയോടെ പറഞ്ഞു കൊടുക്കുക', isCorrect: true, scoreValue: 1 },
            { text: 'Ignore', textMl: 'അവഗണിക്കുക', isCorrect: false, scoreValue: 0 },
            { text: 'Report immediately', textMl: 'ഉടൻ റിപ്പോർട്ട് ചെയ്യുക', isCorrect: false, scoreValue: 0 },
        ],
    },
    {
        section: 'Work-Style Problem Solving',
        text: 'A new method is introduced. You are unsure. Best action:',
        textMl: 'പുതിയൊരു രീതി അവതരിപ്പിച്ചു. നിങ്ങൾക്ക് ഉറപ്പില്ല. എന്ത് ചെയ്യണം?',
        options: [
            { text: 'Continue old method', textMl: 'പഴയ രീതി തുടരുക', isCorrect: false, scoreValue: 0 },
            { text: 'Confirm steps and proceed', textMl: 'ചോദിച്ച് ഉറപ്പുവരുത്തി തുടങ്ങുക', isCorrect: true, scoreValue: 1 },
            { text: 'Refuse', textMl: 'നിരസിക്കുക', isCorrect: false, scoreValue: 0 },
            { text: 'Delay', textMl: 'വൈകിപ്പിക്കുക', isCorrect: false, scoreValue: 0 },
        ],
    },
    {
        section: 'Work-Style Problem Solving',
        text: 'Quality is dropping because of speed pressure. Best decision:',
        textMl: 'വേഗത്തിൽ ചെയ്യാനുള്ള സമ്മർദ്ദം കാരണം ഗുണനിലവാരം കുറയുന്നു. എന്ത് ചെയ്യണം?',
        options: [
            { text: 'Maintain quality and communicate', textMl: 'ഗുണനിലവാരം ഉറപ്പാക്കി സമയം അറിയിക്കുക', isCorrect: true, scoreValue: 1 },
            { text: 'Hide defects', textMl: 'പിഴവുകൾ മറയ്ക്കുക', isCorrect: false, scoreValue: 0 },
            { text: 'Skip checks', textMl: 'പരിശോധന ഒഴിവാക്കുക', isCorrect: false, scoreValue: 0 },
            { text: 'Rush', textMl: 'തിരക്കുക', isCorrect: false, scoreValue: 0 },
        ],
    },
    {
        section: 'Work-Style Problem Solving',
        text: 'A machine makes unusual sound. Stopping it may delay delivery. Best action:',
        textMl: 'മെഷീൻ അസാധാരണമായ ശബ്ദമുണ്ടാക്കുന്നു. നിർത്തിയാൽ ഡെലിവറി വൈകും. എന്ത് ചെയ്യണം?',
        options: [
            { text: 'Continue', textMl: 'തുടരുക', isCorrect: false, scoreValue: 0 },
            { text: 'Stop safely and report', textMl: 'നിർത്തി ഉടൻ റിപ്പോർട്ട് ചെയ്യുക', isCorrect: true, scoreValue: 1 },
            { text: 'Increase speed', textMl: 'വേഗത കൂട്ടുക', isCorrect: false, scoreValue: 0 },
            { text: 'Ask customer', textMl: 'ഉപഭോക്താവിനോട് ചോദിക്കുക', isCorrect: false, scoreValue: 0 },
        ],
    },
    {
        section: 'Work-Style Problem Solving',
        text: 'If output doubles while cost rises slightly, efficiency:',
        textMl: 'ചെലവ് അല്പം മാത്രം കൂടിയപ്പോൾ ഉൽപ്പാദനം ഇരട്ടിയായെങ്കിൽ, കാര്യക്ഷമത:',
        options: [
            { text: 'Decreases', textMl: 'കുറയുന്നു', isCorrect: false, scoreValue: 0 },
            { text: 'Stays same', textMl: 'മാറ്റമില്ല', isCorrect: false, scoreValue: 0 },
            { text: 'Improves', textMl: 'കൂടുന്നു/മെച്ചപ്പെടുന്നു', isCorrect: true, scoreValue: 1 },
            { text: 'Cannot say', textMl: 'പറയാൻ കഴിയില്ല', isCorrect: false, scoreValue: 0 },
        ],
    },
];

// Export for use in main seed function
export { aptitudeQuestions };
