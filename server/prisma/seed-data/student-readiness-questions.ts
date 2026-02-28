/**
 * Student Skill & Career Readiness Assessment (36 Questions)
 * 6 Sections, 6 questions each
 * 4-point scale: A = 4 (Best), B = 3, C = 2, D = 1 (Lowest)
 *
 * Sections:
 *   1. Communication & Expression
 *   2. Problem-Solving Approach
 *   3. Creativity & Idea Generation
 *   4. Adaptability
 *   5. Time Management & Responsibility
 *   6. Digital Awareness
 */

export const studentReadinessQuestions = [
    // ===== SECTION 1: COMMUNICATION & EXPRESSION (6 questions) =====
    {
        section: 'Communication & Expression',
        text: 'When a teacher asks a question, I usually:',
        textMl: 'ടീച്ചർ ഒരു ചോദ്യം ചോദിക്കുമ്പോൾ ഞാൻ സാധാരണയായി:',
        options: [
            { text: 'Answer confidently', textMl: 'ആത്മവിശ്വാസത്തോടെ ഉത്തരം പറയും', isCorrect: false, scoreValue: 4 },
            { text: 'Answer with some hesitation', textMl: 'ചെറിയ മടിയോടെ ഉത്തരം പറയും', isCorrect: false, scoreValue: 3 },
            { text: 'Answer only if forced', textMl: 'നിർബന്ധിച്ചാൽ മാത്രം പറയും', isCorrect: false, scoreValue: 2 },
            { text: 'Stay silent', textMl: 'മിണ്ടാതിരിക്കും', isCorrect: false, scoreValue: 1 },
        ],
    },
    {
        section: 'Communication & Expression',
        text: 'When talking to friends, I can explain my ideas clearly:',
        textMl: 'കൂട്ടുകാരോട് സംസാരിക്കുമ്പോൾ എന്റെ ഐഡിയകൾ വ്യക്തമായി പറയാൻ എനിക്ക് പറ്റാറുണ്ട്:',
        options: [
            { text: 'Very clearly', textMl: 'വളരെ വ്യക്തമായി', isCorrect: false, scoreValue: 4 },
            { text: 'Clearly but slowly', textMl: 'വ്യക്തമായി, പക്ഷെ കുറച്ചു പതുക്കെ', isCorrect: false, scoreValue: 3 },
            { text: 'Only partly', textMl: 'ചില ഭാഗങ്ങൾ മാത്രം', isCorrect: false, scoreValue: 2 },
            { text: 'With difficulty', textMl: 'പറയാൻ പ്രയാസപ്പെടാറുണ്ട്', isCorrect: false, scoreValue: 1 },
        ],
    },
    {
        section: 'Communication & Expression',
        text: 'A classmate missed school and asks for help. I:',
        textMl: 'സഹായം ചോദിക്കുന്ന കൂട്ടുകാരന് ഞാൻ കാര്യങ്ങൾ വിശദീകരിക്കുന്നത്:',
        options: [
            { text: 'Explain in my own words', textMl: 'എന്റെ സ്വന്തം ശൈലിയിൽ പറഞ്ഞു കൊടുക്കും', isCorrect: false, scoreValue: 4 },
            { text: 'Read from the textbook', textMl: 'പുസ്തകം നോക്കി വായിച്ചു കൊടുക്കും', isCorrect: false, scoreValue: 3 },
            { text: 'Ask someone else to explain', textMl: 'വേറെ ആരോടെങ്കിലും ചോദിക്കാൻ പറയും', isCorrect: false, scoreValue: 2 },
            { text: 'Avoid explaining', textMl: 'പറഞ്ഞു കൊടുക്കുന്നത് ഒഴിവാക്കും', isCorrect: false, scoreValue: 1 },
        ],
    },
    {
        section: 'Communication & Expression',
        text: 'In group activities, I usually:',
        textMl: 'ഗ്രൂപ്പ് വർക്കുകളിൽ ഞാൻ സാധാരണയായി:',
        options: [
            { text: 'Share ideas actively', textMl: 'ഐഡിയകൾ സജീവമായി പങ്കുവെക്കും', isCorrect: false, scoreValue: 4 },
            { text: 'Support quietly', textMl: 'ബഹളമില്ലാതെ കൂടെ നിൽക്കും', isCorrect: false, scoreValue: 3 },
            { text: 'Only listen', textMl: 'മറ്റുള്ളവർ പറയുന്നത് കേട്ടിരിക്കും', isCorrect: false, scoreValue: 2 },
            { text: 'Stay disconnected', textMl: 'താൽപ്പര്യം കാണിക്കാറില്ല', isCorrect: false, scoreValue: 1 },
        ],
    },
    {
        section: 'Communication & Expression',
        text: 'I am asked to speak before unfamiliar students:',
        textMl: 'അപരിചിതരായ കുട്ടികൾക്ക് മുൻപിൽ സംസാരിക്കാൻ പറഞ്ഞാൽ:',
        options: [
            { text: 'Try even if nervous', textMl: 'പേടിയുണ്ടെങ്കിലും ഞാൻ ശ്രമിക്കും', isCorrect: false, scoreValue: 4 },
            { text: 'Speak briefly with preparation', textMl: 'തയ്യാറെടുപ്പോടെ കുറച്ചു മാത്രം സംസാരിക്കും', isCorrect: false, scoreValue: 3 },
            { text: 'Ask to avoid speaking', textMl: 'ഒഴിവാക്കാൻ ശ്രമിക്കും', isCorrect: false, scoreValue: 2 },
            { text: 'Refuse', textMl: 'ഒരിക്കലും ചെയ്യില്ല', isCorrect: false, scoreValue: 1 },
        ],
    },
    {
        section: 'Communication & Expression',
        text: 'If my opinion is different from others:',
        textMl: 'എന്റെ അഭിപ്രായം മറ്റുള്ളവരിൽ നിന്ന് വ്യത്യസ്തമാണെങ്കിൽ:',
        options: [
            { text: 'Explain calmly', textMl: 'ശാന്തമായി കാര്യം വിശദീകരിക്കും', isCorrect: false, scoreValue: 4 },
            { text: 'Say it softly', textMl: 'പതിയെ ഒന്ന് പറഞ്ഞു നോക്കും', isCorrect: false, scoreValue: 3 },
            { text: 'Keep quiet', textMl: 'മിണ്ടാതിരിക്കും', isCorrect: false, scoreValue: 2 },
            { text: 'Change opinion', textMl: 'എന്റെ അഭിപ്രായം മാറ്റും', isCorrect: false, scoreValue: 1 },
        ],
    },

    // ===== SECTION 2: PROBLEM-SOLVING APPROACH (6 questions) =====
    {
        section: 'Problem-Solving Approach',
        text: 'When I face a difficult question:',
        textMl: 'പ്രയാസമുള്ള ഒരു ചോദ്യം നേരിടുമ്പോൾ ഞാൻ:',
        options: [
            { text: 'Try different ways', textMl: 'പല വഴികളിലൂടെ പരിഹരിക്കാൻ നോക്കും', isCorrect: false, scoreValue: 4 },
            { text: 'Ask for help', textMl: 'സഹായം ചോദിക്കും', isCorrect: false, scoreValue: 3 },
            { text: 'Skip it', textMl: 'അത് മാറ്റിവെക്കും', isCorrect: false, scoreValue: 2 },
            { text: 'Give up', textMl: 'ഉപേക്ഷിക്കും', isCorrect: false, scoreValue: 1 },
        ],
    },
    {
        section: 'Problem-Solving Approach',
        text: 'If something goes wrong:',
        textMl: 'കാര്യങ്ങൾ തെറ്റായി സംഭവിച്ചാൽ:',
        options: [
            { text: 'Think what to do next', textMl: 'അടുത്തത് എന്ത് ചെയ്യണമെന്ന് ചിന്തിക്കും', isCorrect: false, scoreValue: 4 },
            { text: 'Feel worried', textMl: 'വിഷമിച്ചിരിക്കും', isCorrect: false, scoreValue: 3 },
            { text: 'Blame luck', textMl: 'ഭാഗ്യത്തെ പഴിക്കും', isCorrect: false, scoreValue: 2 },
            { text: 'Stop trying', textMl: 'ശ്രമം നിർത്തും', isCorrect: false, scoreValue: 1 },
        ],
    },
    {
        section: 'Problem-Solving Approach',
        text: 'Power goes off during study time:',
        textMl: 'പഠിച്ചുകൊണ്ടിരിക്കുമ്പോൾ കറന്റ് പോയാൽ:',
        options: [
            { text: 'Change plan and continue', textMl: 'വേറെ വഴി നോക്കി പഠനം തുടരും', isCorrect: false, scoreValue: 4 },
            { text: 'Study a little', textMl: 'കുറച്ചു നേരം കൂടി നോക്കും', isCorrect: false, scoreValue: 3 },
            { text: 'Wait for power', textMl: 'കറന്റ് വരാൻ കാത്തിരിക്കും', isCorrect: false, scoreValue: 2 },
            { text: 'Stop studying', textMl: 'പഠനം നിർത്തും', isCorrect: false, scoreValue: 1 },
        ],
    },
    {
        section: 'Problem-Solving Approach',
        text: "In exams, if I don't know an answer:",
        textMl: 'പരീക്ഷയ്ക്ക് ഉത്തരം അറിയില്ലെങ്കിൽ:',
        options: [
            { text: 'Write what I know', textMl: 'അറിയാവുന്ന കാര്യങ്ങൾ എഴുതും', isCorrect: false, scoreValue: 4 },
            { text: 'Leave blank', textMl: 'ഒന്നും എഴുതാതെ വിടും', isCorrect: false, scoreValue: 3 },
            { text: 'Panic', textMl: 'പരിഭ്രമിക്കും', isCorrect: false, scoreValue: 2 },
            { text: 'Copy', textMl: 'മറ്റുള്ളവരെ നോക്കി എഴുതാൻ ശ്രമിക്കും', isCorrect: false, scoreValue: 1 },
        ],
    },
    {
        section: 'Problem-Solving Approach',
        text: 'I face a new type of problem:',
        textMl: 'പുതിയൊരു പ്രശ്നം നേരിടുമ്പോൾ ഞാൻ:',
        options: [
            { text: 'Break it into steps', textMl: 'ചെറിയ ഭാഗങ്ങളായി തിരിച്ച് പരിഹരിക്കും', isCorrect: false, scoreValue: 4 },
            { text: 'Try something', textMl: 'എന്തെങ്കിലും ചെയ്തു നോക്കും', isCorrect: false, scoreValue: 3 },
            { text: 'Wait for guidance', textMl: 'ആരെങ്കിലും പറഞ്ഞു തരാൻ കാത്തിരിക്കും', isCorrect: false, scoreValue: 2 },
            { text: 'Avoid it', textMl: 'അത് ഒഴിവാക്കും', isCorrect: false, scoreValue: 1 },
        ],
    },
    {
        section: 'Problem-Solving Approach',
        text: 'If my solution fails:',
        textMl: 'ഞാൻ കണ്ടെത്തിയ മാർഗ്ഗം പരാജയപ്പെട്ടാൽ:',
        options: [
            { text: 'Try again differently', textMl: 'വേറെ വഴി പരീക്ഷിക്കും', isCorrect: false, scoreValue: 4 },
            { text: 'Ask others', textMl: 'മറ്റുള്ളവരോട് ചോദിക്കും', isCorrect: false, scoreValue: 3 },
            { text: 'Feel frustrated', textMl: 'ദേഷ്യമോ മടുപ്പോ തോന്നും', isCorrect: false, scoreValue: 2 },
            { text: 'Quit', textMl: 'വിട്ടു കൊടുക്കും', isCorrect: false, scoreValue: 1 },
        ],
    },

    // ===== SECTION 3: CREATIVITY & IDEA GENERATION (6 questions) =====
    {
        section: 'Creativity & Idea Generation',
        text: 'I enjoy tasks that involve:',
        textMl: 'ഞാൻ ചെയ്യാൻ ഇഷ്ടപ്പെടുന്നത് എങ്ങനെയുള്ള ജോലികളാണ്:',
        options: [
            { text: 'New ideas', textMl: 'പുതിയ ഐഡിയകൾ ഉള്ളവ', isCorrect: false, scoreValue: 4 },
            { text: 'Some creativity', textMl: 'കുറച്ചു സർഗ്ഗാത്മകത വേണ്ടവ', isCorrect: false, scoreValue: 3 },
            { text: 'Fixed steps', textMl: 'കൃത്യമായ രീതികളുള്ളവ', isCorrect: false, scoreValue: 2 },
            { text: 'Repeating work', textMl: 'ഒരേ കാര്യം തന്നെ ചെയ്യുന്നത്', isCorrect: false, scoreValue: 1 },
        ],
    },
    {
        section: 'Creativity & Idea Generation',
        text: 'In free time, I prefer:',
        textMl: 'ഒഴിവുസമയത്ത് ഞാൻ കൂടുതൽ ഇഷ്ടപ്പെടുന്നത്:',
        options: [
            { text: 'Creating something', textMl: 'പുതിയ എന്തെങ്കിലും നിർമ്മിക്കാൻ', isCorrect: false, scoreValue: 4 },
            { text: 'Watching others', textMl: 'മറ്റുള്ളവർ ചെയ്യുന്നത് നോക്കി നിൽക്കാൻ', isCorrect: false, scoreValue: 3 },
            { text: 'Routine work', textMl: 'പതിവ് കാര്യങ്ങൾ ചെയ്യാൻ', isCorrect: false, scoreValue: 2 },
            { text: 'Doing nothing', textMl: 'ഒന്നും ചെയ്യാതിരിക്കാൻ', isCorrect: false, scoreValue: 1 },
        ],
    },
    {
        section: 'Creativity & Idea Generation',
        text: 'In projects, I usually:',
        textMl: 'പ്രോജക്റ്റുകളിൽ ഞാൻ സാധാരണയായി:',
        options: [
            { text: 'Add new ideas', textMl: 'എന്റേതായ പുതിയ ഐഡിയകൾ ചേർക്കും', isCorrect: false, scoreValue: 4 },
            { text: 'Improve existing ideas', textMl: 'ഉള്ള ഐഡിയകൾ മെച്ചപ്പെടുത്തും', isCorrect: false, scoreValue: 3 },
            { text: 'Follow instructions', textMl: 'പറയുന്നത് പോലെ മാത്രം ചെയ്യും', isCorrect: false, scoreValue: 2 },
            { text: 'Let others decide', textMl: 'മറ്റുള്ളവർ തീരുമാനിക്കട്ടെ എന്ന് വെക്കും', isCorrect: false, scoreValue: 1 },
        ],
    },
    {
        section: 'Creativity & Idea Generation',
        text: 'When choosing a topic:',
        textMl: 'ഒരു വിഷയം തിരഞ്ഞെടുക്കുമ്പോൾ ഞാൻ:',
        options: [
            { text: 'Pick something interesting', textMl: 'താൽപ്പര്യമുള്ള വിഷയം എടുക്കും', isCorrect: false, scoreValue: 4 },
            { text: 'Pick easy topic', textMl: 'എളുപ്പമുള്ള വിഷയം എടുക്കും', isCorrect: false, scoreValue: 3 },
            { text: 'Pick common topic', textMl: 'എല്ലാവരും ചെയ്യുന്ന വിഷയം എടുക്കും', isCorrect: false, scoreValue: 2 },
            { text: 'Let teacher choose', textMl: 'ടീച്ചർ പറയട്ടെ എന്ന് വെക്കും', isCorrect: false, scoreValue: 1 },
        ],
    },
    {
        section: 'Creativity & Idea Generation',
        text: 'A problem has no clear answer:',
        textMl: 'വ്യക്തമായ ഉത്തരമില്ലാത്ത ഒരു പ്രശ്നമുണ്ടായാൽ:',
        options: [
            { text: 'Suggest many ideas', textMl: 'പലതരം ഐഡിയകൾ പറയും', isCorrect: false, scoreValue: 4 },
            { text: 'Suggest one idea', textMl: 'ഒരു ഐഡിയ പറയും', isCorrect: false, scoreValue: 3 },
            { text: 'Wait for others', textMl: 'മറ്റുള്ളവർ പറയട്ടെ എന്ന് വെക്കും', isCorrect: false, scoreValue: 2 },
            { text: 'Avoid discussion', textMl: 'ചർച്ചയിൽ നിന്ന് മാറി നിൽക്കും', isCorrect: false, scoreValue: 1 },
        ],
    },
    {
        section: 'Creativity & Idea Generation',
        text: 'If my idea is criticized:',
        textMl: 'എന്റെ ഐഡിയയെ ആരെങ്കിലും വിമർശിച്ചാൽ:',
        options: [
            { text: 'Improve it', textMl: 'അത് മെച്ചപ്പെടുത്താൻ നോക്കും', isCorrect: false, scoreValue: 4 },
            { text: 'Explain it', textMl: 'കാര്യം വിശദീകരിക്കും', isCorrect: false, scoreValue: 3 },
            { text: 'Drop it', textMl: 'അത് ഉപേക്ഷിക്കും', isCorrect: false, scoreValue: 2 },
            { text: 'Feel discouraged', textMl: 'മടുപ്പ് തോന്നും', isCorrect: false, scoreValue: 1 },
        ],
    },

    // ===== SECTION 4: ADAPTABILITY (6 questions) =====
    {
        section: 'Adaptability',
        text: 'Learning new topics makes me feel:',
        textMl: 'പുതിയ കാര്യങ്ങൾ പഠിക്കുന്നത് എന്നിൽ ഉണ്ടാക്കുന്നത്:',
        options: [
            { text: 'Curious', textMl: 'ആകാംക്ഷ/താൽപ്പര്യം', isCorrect: false, scoreValue: 4 },
            { text: 'Slightly nervous', textMl: 'ചെറിയൊരു പേടി', isCorrect: false, scoreValue: 3 },
            { text: 'Confused', textMl: 'ആശയക്കുഴപ്പം', isCorrect: false, scoreValue: 2 },
            { text: 'Uninterested', textMl: 'താൽപ്പര്യക്കുറവ്', isCorrect: false, scoreValue: 1 },
        ],
    },
    {
        section: 'Adaptability',
        text: 'When rules change:',
        textMl: 'നിയമങ്ങളിൽ മാറ്റം വരുമ്പോൾ ഞാൻ:',
        options: [
            { text: 'Adjust quickly', textMl: 'വേഗത്തിൽ പൊരുത്തപ്പെടും', isCorrect: false, scoreValue: 4 },
            { text: 'Take time', textMl: 'സമയമെടുക്കും', isCorrect: false, scoreValue: 3 },
            { text: 'Feel uncomfortable', textMl: 'അസ്വസ്ഥത തോന്നും', isCorrect: false, scoreValue: 2 },
            { text: 'Resist', textMl: 'എതിർക്കും', isCorrect: false, scoreValue: 1 },
        ],
    },
    {
        section: 'Adaptability',
        text: 'A new subject is introduced:',
        textMl: 'പുതിയൊരു വിഷയം പഠിക്കാൻ വരുമ്പോൾ:',
        options: [
            { text: 'Try to understand', textMl: 'മനസ്സിലാക്കാൻ ശ്രമിക്കും', isCorrect: false, scoreValue: 4 },
            { text: 'Wait for teacher', textMl: 'ടീച്ചർ പറഞ്ഞു തരാൻ കാത്തിരിക്കും', isCorrect: false, scoreValue: 3 },
            { text: 'Feel stressed', textMl: 'സമ്മർദ്ദം തോന്നും', isCorrect: false, scoreValue: 2 },
            { text: 'Ignore', textMl: 'അത് മൈൻഡ് ചെയ്യില്ല', isCorrect: false, scoreValue: 1 },
        ],
    },
    {
        section: 'Adaptability',
        text: 'When feedback is given:',
        textMl: 'ആരെങ്കിലും എന്റെ തെറ്റുകൾ തിരുത്തി തന്നാൽ:',
        options: [
            { text: 'Use it to improve', textMl: 'സ്വയം മെച്ചപ്പെടാൻ ഉപയോഗിക്കും', isCorrect: false, scoreValue: 4 },
            { text: 'Listen politely', textMl: 'മര്യാദയ്ക്ക് കേട്ടിരിക്കും', isCorrect: false, scoreValue: 3 },
            { text: 'Feel upset', textMl: 'വിഷമം തോന്നും', isCorrect: false, scoreValue: 2 },
            { text: 'Ignore', textMl: 'ശ്രദ്ധിക്കില്ല', isCorrect: false, scoreValue: 1 },
        ],
    },
    {
        section: 'Adaptability',
        text: 'I fail in something important:',
        textMl: 'പ്രധാനപ്പെട്ട കാര്യത്തിൽ പരാജയപ്പെട്ടാൽ:',
        options: [
            { text: 'Learn from it', textMl: 'അതിൽ നിന്ന് പാഠം പഠിക്കും', isCorrect: false, scoreValue: 4 },
            { text: 'Try again slowly', textMl: 'പതുക്കെ വീണ്ടും ശ്രമിക്കും', isCorrect: false, scoreValue: 3 },
            { text: 'Feel stuck', textMl: 'മുന്നോട്ട് പോകാൻ പറ്റാത്ത അവസ്ഥ', isCorrect: false, scoreValue: 2 },
            { text: 'Stop trying', textMl: 'ശ്രമം നിർത്തും', isCorrect: false, scoreValue: 1 },
        ],
    },
    {
        section: 'Adaptability',
        text: 'New learning method (online/self-study):',
        textMl: 'പുതിയ പഠനരീതികളോട് (ഓൺലൈൻ പോലെ) ഞാൻ:',
        options: [
            { text: 'Adjust well', textMl: 'നന്നായി പൊരുത്തപ്പെടും', isCorrect: false, scoreValue: 4 },
            { text: 'Try with help', textMl: 'സഹായത്തോടെ ശ്രമിക്കും', isCorrect: false, scoreValue: 3 },
            { text: 'Struggle', textMl: 'പ്രയാസപ്പെടും', isCorrect: false, scoreValue: 2 },
            { text: 'Avoid', textMl: 'അത് ഒഴിവാക്കും', isCorrect: false, scoreValue: 1 },
        ],
    },

    // ===== SECTION 5: TIME MANAGEMENT & RESPONSIBILITY (6 questions) =====
    {
        section: 'Time Management & Responsibility',
        text: 'I complete homework:',
        textMl: 'ഞാൻ ഹോംവർക്കുകൾ പൂർത്തിയാക്കുന്നത്:',
        options: [
            { text: 'On time', textMl: 'കൃത്യസമയത്ത്', isCorrect: false, scoreValue: 4 },
            { text: 'Slightly late', textMl: 'കുറച്ചു വൈകി', isCorrect: false, scoreValue: 3 },
            { text: 'Often late', textMl: 'പലപ്പോഴും വൈകി', isCorrect: false, scoreValue: 2 },
            { text: 'Rarely', textMl: 'വല്ലപ്പോഴും മാത്രം', isCorrect: false, scoreValue: 1 },
        ],
    },
    {
        section: 'Time Management & Responsibility',
        text: 'I remember my responsibilities:',
        textMl: 'എന്റെ ഉത്തരവാദിത്തങ്ങൾ ഞാൻ ഓർമ്മിക്കുന്നത്:',
        options: [
            { text: 'Very well', textMl: 'വളരെ കൃത്യമായി', isCorrect: false, scoreValue: 4 },
            { text: 'With reminders', textMl: 'ഓർമ്മിപ്പിക്കുമ്പോൾ മാത്രം', isCorrect: false, scoreValue: 3 },
            { text: 'Sometimes', textMl: 'ചിലപ്പോൾ മാത്രം', isCorrect: false, scoreValue: 2 },
            { text: 'Often forget', textMl: 'പലപ്പോഴും മറന്നുപോകും', isCorrect: false, scoreValue: 1 },
        ],
    },
    {
        section: 'Time Management & Responsibility',
        text: 'Exams and activities clash:',
        textMl: 'പരീക്ഷകളും മറ്റ് തിരക്കുകളും ഒരുമിച്ച് വന്നാൽ:',
        options: [
            { text: 'Plan ahead', textMl: 'നേരത്തെ പ്ലാൻ ചെയ്യും', isCorrect: false, scoreValue: 4 },
            { text: 'Do urgent one', textMl: 'അത്യാവശ്യമുള്ളത് ചെയ്യും', isCorrect: false, scoreValue: 3 },
            { text: 'Feel confused', textMl: 'ആകെ കൺഫ്യൂഷനാകും', isCorrect: false, scoreValue: 2 },
            { text: 'Miss both', textMl: 'രണ്ടും ചെയ്യാൻ പറ്റില്ല', isCorrect: false, scoreValue: 1 },
        ],
    },
    {
        section: 'Time Management & Responsibility',
        text: 'Given an important task:',
        textMl: 'ഒരു പ്രധാന ചുമതല ലഭിച്ചാൽ ഞാൻ:',
        options: [
            { text: 'Take it seriously', textMl: 'ഗൗരവത്തോടെ ചെയ്യും', isCorrect: false, scoreValue: 4 },
            { text: 'Do with reminders', textMl: 'ഓർമ്മിപ്പിക്കുമ്പോൾ ചെയ്യും', isCorrect: false, scoreValue: 3 },
            { text: 'Delay', textMl: 'വൈകിപ്പിക്കും', isCorrect: false, scoreValue: 2 },
            { text: 'Ignore', textMl: 'ശ്രദ്ധിക്കില്ല', isCorrect: false, scoreValue: 1 },
        ],
    },
    {
        section: 'Time Management & Responsibility',
        text: 'Managing studies + personal work:',
        textMl: 'പഠനവും മറ്റ് കാര്യങ്ങളും ഒരുമിച്ച് കൊണ്ടുപോകാൻ:',
        options: [
            { text: 'Balance both', textMl: 'രണ്ടും ബാലൻസ് ചെയ്യും', isCorrect: false, scoreValue: 4 },
            { text: 'Manage with stress', textMl: 'സമ്മർദ്ദത്തോടെ മാനേജ് ചെയ്യും', isCorrect: false, scoreValue: 3 },
            { text: 'Drop one', textMl: 'ഒന്ന് ഉപേക്ഷിക്കും', isCorrect: false, scoreValue: 2 },
            { text: 'Avoid planning', textMl: 'പ്ലാൻ ചെയ്യില്ല', isCorrect: false, scoreValue: 1 },
        ],
    },
    {
        section: 'Time Management & Responsibility',
        text: 'Without supervision, I:',
        textMl: 'ആരും ശ്രദ്ധിക്കാനില്ലാത്തപ്പോഴും ഞാൻ:',
        options: [
            { text: 'Stay responsible', textMl: 'ഉത്തരവാദിത്തത്തോടെ പ്രവർത്തിക്കും', isCorrect: false, scoreValue: 4 },
            { text: 'Try to manage', textMl: 'നോക്കി നടത്താൻ ശ്രമിക്കും', isCorrect: false, scoreValue: 3 },
            { text: 'Get distracted', textMl: 'ശ്രദ്ധ മാറിപ്പോകും', isCorrect: false, scoreValue: 2 },
            { text: 'Lose control', textMl: 'സമയം വെറുതെ കളയും', isCorrect: false, scoreValue: 1 },
        ],
    },

    // ===== SECTION 6: DIGITAL AWARENESS (6 questions) =====
    {
        section: 'Digital Awareness',
        text: 'I use digital tools mainly for:',
        textMl: 'ഡിജിറ്റൽ ഉപകരണങ്ങൾ ഞാൻ ഉപയോഗിക്കുന്നത്:',
        options: [
            { text: 'Learning + fun', textMl: 'പഠനത്തിനും വിനോദത്തിനും', isCorrect: false, scoreValue: 4 },
            { text: 'Mostly fun', textMl: 'കൂടുതലും വിനോദത്തിന്', isCorrect: false, scoreValue: 3 },
            { text: 'Time pass', textMl: 'സമയം കളയാൻ', isCorrect: false, scoreValue: 2 },
            { text: 'No specific purpose', textMl: 'പ്രത്യേകിച്ച് ഒരു ഉദ്ദേശ്യവുമില്ല', isCorrect: false, scoreValue: 1 },
        ],
    },
    {
        section: 'Digital Awareness',
        text: 'Online information:',
        textMl: 'ഇന്റർനെറ്റിൽ കാണുന്ന വിവരങ്ങൾ:',
        options: [
            { text: 'Must be checked', textMl: 'ഉറപ്പുവരുത്തണം', isCorrect: false, scoreValue: 4 },
            { text: 'Is sometimes wrong', textMl: 'ചിലപ്പോൾ തെറ്റാകാം', isCorrect: false, scoreValue: 3 },
            { text: 'Is always correct', textMl: 'എപ്പോഴും ശരിയാണ്', isCorrect: false, scoreValue: 2 },
            { text: 'Is confusing', textMl: 'ആകെ കൺഫ്യൂഷനാണ്', isCorrect: false, scoreValue: 1 },
        ],
    },
    {
        section: 'Digital Awareness',
        text: 'For a project, I:',
        textMl: 'പ്രോജക്റ്റിനായി വിവരങ്ങൾ തേടുമ്പോൾ ഞാൻ:',
        options: [
            { text: 'Use many sources', textMl: 'പല വെബ്സൈറ്റുകൾ നോക്കും', isCorrect: false, scoreValue: 4 },
            { text: 'Use first result', textMl: 'ആദ്യം കാണുന്ന റിസൾട്ട് എടുക്കും', isCorrect: false, scoreValue: 3 },
            { text: 'Copy content', textMl: 'ഉള്ളത് പകർത്തിയെഴുതും', isCorrect: false, scoreValue: 2 },
            { text: 'Avoid searching', textMl: 'തിരയാൻ മടി കാണിക്കും', isCorrect: false, scoreValue: 1 },
        ],
    },
    {
        section: 'Digital Awareness',
        text: 'Social media usage:',
        textMl: 'എന്റെ സോഷ്യൽ മീഡിയ ഉപയോഗം:',
        options: [
            { text: 'Controlled', textMl: 'കൃത്യമായി നിയന്ത്രിക്കുന്നു', isCorrect: false, scoreValue: 4 },
            { text: 'Some control', textMl: 'കുറച്ചൊക്കെ നിയന്ത്രണമുണ്ട്', isCorrect: false, scoreValue: 3 },
            { text: 'Overuse', textMl: 'കൂടുതലായി ഉപയോഗിക്കുന്നു', isCorrect: false, scoreValue: 2 },
            { text: 'Lose track', textMl: 'നിയന്ത്രണമില്ലാതെ ഉപയോഗിക്കുന്നു', isCorrect: false, scoreValue: 1 },
        ],
    },
    {
        section: 'Digital Awareness',
        text: 'I get unclear info online:',
        textMl: 'വ്യക്തതയില്ലാത്ത വിവരങ്ങൾ ഓൺലൈനിൽ കണ്ടാൽ ഞാൻ:',
        options: [
            { text: 'Verify it', textMl: 'ഉറപ്പുവരുത്തും', isCorrect: false, scoreValue: 4 },
            { text: 'Ask someone', textMl: 'ആരോടെങ്കിലും ചോദിക്കും', isCorrect: false, scoreValue: 3 },
            { text: 'Believe it', textMl: 'വിശ്വസിക്കും', isCorrect: false, scoreValue: 2 },
            { text: 'Share it', textMl: 'മറ്റുള്ളവർക്ക് ഷെയർ ചെയ്യും', isCorrect: false, scoreValue: 1 },
        ],
    },
    {
        section: 'Digital Awareness',
        text: 'Learning something new digitally:',
        textMl: 'പുതിയ ഡിജിറ്റൽ കാര്യങ്ങൾ പഠിക്കാൻ എനിക്ക്:',
        options: [
            { text: 'Explore confidently', textMl: 'ആത്മവിശ്വാസത്തോടെ ശ്രമിക്കും', isCorrect: false, scoreValue: 4 },
            { text: 'Try slowly', textMl: 'പതുക്കെ ശ്രമിക്കും', isCorrect: false, scoreValue: 3 },
            { text: 'Feel confused', textMl: 'ആശയക്കുഴപ്പം തോന്നും', isCorrect: false, scoreValue: 2 },
            { text: 'Avoid tools', textMl: 'അത് ഒഴിവാക്കും', isCorrect: false, scoreValue: 1 },
        ],
    },
];
