/**
 * Student Personality Traits Assessment (36 Questions)
 * 6 Trait Categories, 6 questions each
 * 3-point scale: A = 1 (Emerging), B = 2 (Moderate), C = 3 (Strong)
 *
 * Scoring interpretation per trait (6-18 points):
 *   6-10: Emerging Tendency
 *   11-15: Moderate Tendency
 *   16-18: Strong Tendency
 */

export const studentPersonalityQuestions = [
    // ===== 1. RESPONSIBILITY & DISCIPLINE (6 questions) =====
    {
        section: 'Responsibility & Discipline',
        text: 'I usually complete my school work:',
        textMl: 'ഞാൻ സാധാരണയായി സ്കൂൾ ജോലികൾ പൂർത്തിയാക്കുന്നത്:',
        options: [
            { text: 'Only when reminded many times', textMl: 'പലതവണ ഓർമ്മിപ്പിക്കുമ്പോൾ മാത്രം', isCorrect: false, scoreValue: 1 },
            { text: 'Most of the time', textMl: 'മിക്കവാറും സമയങ്ങളിൽ', isCorrect: false, scoreValue: 2 },
            { text: 'On time without reminders', textMl: 'ഓർമ്മിപ്പിക്കാതെ തന്നെ കൃത്യസമയത്ത്', isCorrect: false, scoreValue: 3 },
        ],
    },
    {
        section: 'Responsibility & Discipline',
        text: 'When I get homework or tasks:',
        textMl: 'എനിക്ക് ഹോംവർക്കോ ജോലികളോ ലഭിക്കുമ്പോൾ:',
        options: [
            { text: 'I delay starting', textMl: 'തുടങ്ങാൻ മടി കാണിക്കുന്നു', isCorrect: false, scoreValue: 1 },
            { text: 'I start after some time', textMl: 'കുറച്ചു കഴിഞ്ഞു തുടങ്ങുന്നു', isCorrect: false, scoreValue: 2 },
            { text: 'I plan and start early', textMl: 'ആസൂത്രണം ചെയ്ത് നേരത്തെ തുടങ്ങുന്നു', isCorrect: false, scoreValue: 3 },
        ],
    },
    {
        section: 'Responsibility & Discipline',
        text: "A project is given with 2 weeks' time. You:",
        textMl: '2 ആഴ്ച സമയമുള്ള ഒരു പ്രോജക്റ്റ് ലഭിച്ചാൽ നിങ്ങൾ:',
        options: [
            { text: 'Start at the last moment', textMl: 'അവസാന നിമിഷം തുടങ്ങുന്നു', isCorrect: false, scoreValue: 1 },
            { text: 'Do it in parts', textMl: 'ഭാഗങ്ങളായി ചെയ്തു തീർക്കുന്നു', isCorrect: false, scoreValue: 2 },
            { text: 'Plan and finish early', textMl: 'ആസൂത്രണം ചെയ്ത് നേരത്തെ തീർക്കുന്നു', isCorrect: false, scoreValue: 3 },
        ],
    },
    {
        section: 'Responsibility & Discipline',
        text: 'Your teacher is not checking notebooks regularly. You:',
        textMl: 'ടീച്ചർ നോട്ട്ബുക്ക് കൃത്യമായി പരിശോധിക്കുന്നില്ലെങ്കിൽ നിങ്ങൾ:',
        options: [
            { text: 'Stop maintaining properly', textMl: 'ശരിയായി എഴുതുന്നത് നിർത്തുന്നു', isCorrect: false, scoreValue: 1 },
            { text: 'Maintain sometimes', textMl: 'ചിലപ്പോൾ മാത്രം എഴുതുന്നു', isCorrect: false, scoreValue: 2 },
            { text: 'Maintain consistently', textMl: 'എപ്പോഴും കൃത്യമായി എഴുതുന്നു', isCorrect: false, scoreValue: 3 },
        ],
    },
    {
        section: 'Responsibility & Discipline',
        text: 'Even when no marks are given, you:',
        textMl: 'മാർക്ക് ലഭിക്കില്ലെങ്കിലും നിങ്ങൾ ആ ജോലി:',
        options: [
            { text: 'Do minimum work', textMl: 'കുറഞ്ഞ അളവിൽ മാത്രം ചെയ്യുന്നു', isCorrect: false, scoreValue: 1 },
            { text: 'Do required work', textMl: 'ആവശ്യമായ രീതിയിൽ ചെയ്യുന്നു', isCorrect: false, scoreValue: 2 },
            { text: 'Do your best', textMl: 'ഏറ്റവും മികച്ച രീതിയിൽ ചെയ്യുന്നു', isCorrect: false, scoreValue: 3 },
        ],
    },
    {
        section: 'Responsibility & Discipline',
        text: 'When you feel bored with routine tasks:',
        textMl: 'ഒരേപോലെയുള്ള ജോലികൾ ചെയ്ത് മടുപ്പ് തോന്നുമ്പോൾ നിങ്ങൾ:',
        options: [
            { text: 'Avoid them', textMl: 'അവ ഒഴിവാക്കുന്നു', isCorrect: false, scoreValue: 1 },
            { text: 'Finish them slowly', textMl: 'പതുക്കെ പൂർത്തിയാക്കുന്നു', isCorrect: false, scoreValue: 2 },
            { text: 'Finish them responsibly', textMl: 'ഉത്തരവാദിത്തത്തോടെ പൂർത്തിയാക്കുന്നു', isCorrect: false, scoreValue: 3 },
        ],
    },

    // ===== 2. STRESS TOLERANCE (6 questions) =====
    {
        section: 'Stress Tolerance',
        text: 'When exams approach, you usually feel:',
        textMl: 'പരീക്ഷകൾ അടുക്കുമ്പോൾ നിങ്ങൾക്ക് സാധാരണയായി തോന്നുന്നത്:',
        options: [
            { text: 'Very disturbed', textMl: 'വളരെയധികം അസ്വസ്ഥത', isCorrect: false, scoreValue: 1 },
            { text: 'Slightly tense', textMl: 'ചെറിയ തോതിൽ ടെൻഷൻ', isCorrect: false, scoreValue: 2 },
            { text: 'Mostly manageable', textMl: 'നിയന്ത്രിക്കാൻ കഴിയുന്ന തരത്തിൽ', isCorrect: false, scoreValue: 3 },
        ],
    },
    {
        section: 'Stress Tolerance',
        text: 'When something goes wrong, you:',
        textMl: 'കാര്യങ്ങൾ വിചാരിച്ച പോലെ നടന്നില്ലെങ്കിൽ നിങ്ങൾ:',
        options: [
            { text: 'Get upset quickly', textMl: 'പെട്ടെന്ന് വിഷമിക്കുന്നു', isCorrect: false, scoreValue: 1 },
            { text: 'Take time to settle', textMl: 'സാധാരണ നിലയിലാകാൻ സമയമെടുക്കുന്നു', isCorrect: false, scoreValue: 2 },
            { text: 'Stay calm', textMl: 'ശാന്തത പാലിക്കുന്നു', isCorrect: false, scoreValue: 3 },
        ],
    },
    {
        section: 'Stress Tolerance',
        text: 'You make a mistake in class. You:',
        textMl: 'ക്ലാസ്സിൽ നിങ്ങൾക്ക് ഒരു തെറ്റ് പറ്റിയാൽ നിങ്ങൾ:',
        options: [
            { text: 'Feel very embarrassed', textMl: 'വളരെയധികം നാണക്കേട് തോന്നുന്നു', isCorrect: false, scoreValue: 1 },
            { text: 'Feel uncomfortable but recover', textMl: 'അസ്വസ്ഥത തോന്നുമെങ്കിലും വേഗത്തിൽ സാധാരണ നിലയിലാകുന്നു', isCorrect: false, scoreValue: 2 },
            { text: 'Learn and move on', textMl: 'അതിൽ നിന്ന് പഠിച്ച് മുന്നോട്ട് പോകുന്നു', isCorrect: false, scoreValue: 3 },
        ],
    },
    {
        section: 'Stress Tolerance',
        text: 'You get lower marks than expected. You:',
        textMl: 'പ്രതീക്ഷിച്ചതിലും കുറഞ്ഞ മാർക്ക് ലഭിച്ചാൽ നിങ്ങൾ:',
        options: [
            { text: 'Feel demotivated for long', textMl: 'കുറേക്കാലം മടുപ്പ് തോന്നുന്നു', isCorrect: false, scoreValue: 1 },
            { text: 'Feel upset but continue', textMl: 'വിഷമം തോന്നുമെങ്കിലും പഠനം തുടരുന്നു', isCorrect: false, scoreValue: 2 },
            { text: 'Try to improve', textMl: 'മെച്ചപ്പെടുത്താൻ ശ്രമിക്കുന്നു', isCorrect: false, scoreValue: 3 },
        ],
    },
    {
        section: 'Stress Tolerance',
        text: 'Under pressure, you usually:',
        textMl: 'സമ്മർദ്ദമുണ്ടാകുമ്പോൾ നിങ്ങൾ സാധാരണയായി:',
        options: [
            { text: 'Lose focus', textMl: 'ശ്രദ്ധ കേന്ദ്രീകരിക്കാൻ കഴിയുന്നില്ല', isCorrect: false, scoreValue: 1 },
            { text: 'Manage with effort', textMl: 'പ്രയാസപ്പെട്ട് കൈകാര്യം ചെയ്യുന്നു', isCorrect: false, scoreValue: 2 },
            { text: 'Perform steadily', textMl: 'സ്ഥിരതയോടെ പ്രവർത്തിക്കുന്നു', isCorrect: false, scoreValue: 3 },
        ],
    },
    {
        section: 'Stress Tolerance',
        text: 'When many tasks come together:',
        textMl: 'ഒരുപാട് ജോലികൾ ഒരുമിച്ച് വരുമ്പോൾ നിങ്ങൾ:',
        options: [
            { text: 'Feel overwhelmed', textMl: 'ആകെ തളർന്നുപോകുന്നു', isCorrect: false, scoreValue: 1 },
            { text: 'Feel stressed but manage', textMl: 'സമ്മർദ്ദമുണ്ടെങ്കിലും കൈകാര്യം ചെയ്യുന്നു', isCorrect: false, scoreValue: 2 },
            { text: 'Stay organized', textMl: 'ചിട്ടയോടെ ചെയ്യുന്നു', isCorrect: false, scoreValue: 3 },
        ],
    },

    // ===== 3. CURIOSITY & OPENNESS (6 questions) =====
    {
        section: 'Curiosity & Openness',
        text: 'You enjoy learning topics that are:',
        textMl: 'നിങ്ങൾ പഠിക്കാൻ ഇഷ്ടപ്പെടുന്നത് എങ്ങനെയുള്ള കാര്യങ്ങളാണ്:',
        options: [
            { text: 'Already familiar', textMl: 'പരിചിതമായ കാര്യങ്ങൾ', isCorrect: false, scoreValue: 1 },
            { text: 'Somewhat new', textMl: 'കുറച്ചൊക്കെ പുതിയ കാര്യങ്ങൾ', isCorrect: false, scoreValue: 2 },
            { text: 'Completely new', textMl: 'തികച്ചും പുതിയ കാര്യങ്ങൾ', isCorrect: false, scoreValue: 3 },
        ],
    },
    {
        section: 'Curiosity & Openness',
        text: 'You like asking questions when:',
        textMl: 'നിങ്ങൾ ചോദ്യങ്ങൾ ചോദിക്കാൻ ഇഷ്ടപ്പെടുന്നത്:',
        options: [
            { text: 'Only when forced', textMl: 'മറ്റൊരാൾ നിർബന്ധിക്കുമ്പോൾ മാത്രം', isCorrect: false, scoreValue: 1 },
            { text: 'Sometimes', textMl: 'ചിലപ്പോൾ മാത്രം', isCorrect: false, scoreValue: 2 },
            { text: 'Often', textMl: 'എപ്പോഴും/പലപ്പോഴും', isCorrect: false, scoreValue: 3 },
        ],
    },
    {
        section: 'Curiosity & Openness',
        text: 'A topic is not in the textbook. You:',
        textMl: 'പാഠപുസ്തകത്തിൽ ഇല്ലാത്ത ഒരു കാര്യമാണെങ്കിൽ നിങ്ങൾ:',
        options: [
            { text: 'Ignore it', textMl: 'അത് ശ്രദ്ധിക്കാതിരിക്കുന്നു', isCorrect: false, scoreValue: 1 },
            { text: 'Explore if needed', textMl: 'ആവശ്യമെങ്കിൽ മാത്രം അന്വേഷിക്കുന്നു', isCorrect: false, scoreValue: 2 },
            { text: 'Explore out of interest', textMl: 'താൽപ്പര്യത്തോടെ അന്വേഷിക്കുന്നു', isCorrect: false, scoreValue: 3 },
        ],
    },
    {
        section: 'Curiosity & Openness',
        text: 'Your teacher introduces a new method. You:',
        textMl: 'ടീച്ചർ പുതിയൊരു രീതി അവതരിപ്പിച്ചാൽ നിങ്ങൾ:',
        options: [
            { text: 'Resist change', textMl: 'മാറ്റത്തെ എതിർക്കുന്നു', isCorrect: false, scoreValue: 1 },
            { text: 'Adjust slowly', textMl: 'പതുക്കെ ശീലിക്കുന്നു', isCorrect: false, scoreValue: 2 },
            { text: 'Feel excited', textMl: 'ആവേശത്തോടെ സ്വീകരിക്കുന്നു', isCorrect: false, scoreValue: 3 },
        ],
    },
    {
        section: 'Curiosity & Openness',
        text: 'Even if a topic is difficult, you:',
        textMl: 'ഒരു വിഷയം പ്രയാസകരമാണെങ്കിലും നിങ്ങൾ:',
        options: [
            { text: 'Avoid it', textMl: 'അത് ഒഴിവാക്കുന്നു', isCorrect: false, scoreValue: 1 },
            { text: 'Try if required', textMl: 'ആവശ്യമെങ്കിൽ ശ്രമിക്കുന്നു', isCorrect: false, scoreValue: 2 },
            { text: 'Try to understand deeply', textMl: 'ആഴത്തിൽ മനസ്സിലാക്കാൻ ശ്രമിക്കുന്നു', isCorrect: false, scoreValue: 3 },
        ],
    },
    {
        section: 'Curiosity & Openness',
        text: 'You prefer learning that is:',
        textMl: 'നിങ്ങൾ ഇഷ്ടപ്പെടുന്ന പഠനരീതി:',
        options: [
            { text: 'Fixed and familiar', textMl: 'മാറ്റങ്ങളില്ലാത്തതും പരിചിതവുമായത്', isCorrect: false, scoreValue: 1 },
            { text: 'Mixes old and new', textMl: 'പഴയതും പുതിയതും കലർന്നത്', isCorrect: false, scoreValue: 2 },
            { text: 'Exploratory', textMl: 'അന്വേഷണാത്മകമായ രീതി', isCorrect: false, scoreValue: 3 },
        ],
    },

    // ===== 4. SOCIAL INTERACTION (6 questions) =====
    {
        section: 'Social Interaction',
        text: 'In class, you usually:',
        textMl: 'ക്ലാസ്സിൽ നിങ്ങൾ സാധാരണയായി:',
        options: [
            { text: 'Stay quiet', textMl: 'മിണ്ടാതിരിക്കുന്നു', isCorrect: false, scoreValue: 1 },
            { text: 'Speak sometimes', textMl: 'ചിലപ്പോൾ സംസാരിക്കുന്നു', isCorrect: false, scoreValue: 2 },
            { text: 'Participate actively', textMl: 'സജീവമായി പങ്കെടുക്കുന്നു', isCorrect: false, scoreValue: 3 },
        ],
    },
    {
        section: 'Social Interaction',
        text: 'You feel comfortable when:',
        textMl: 'നിങ്ങൾക്ക് കൂടുതൽ ആശ്വാസം തോന്നുന്നത്:',
        options: [
            { text: 'Alone', textMl: 'ഒറ്റയ്ക്ക് ഇരിക്കുമ്പോൾ', isCorrect: false, scoreValue: 1 },
            { text: 'With few people', textMl: 'കുറച്ചുപേരുടെ കൂടെ ഇരിക്കുമ്പോൾ', isCorrect: false, scoreValue: 2 },
            { text: 'With many people', textMl: 'ധാരാളം ആളുകളുടെ കൂടെ ഇരിക്കുമ്പോൾ', isCorrect: false, scoreValue: 3 },
        ],
    },
    {
        section: 'Social Interaction',
        text: 'During group discussions, you:',
        textMl: 'ഗ്രൂപ്പ് ചർച്ചകളിൽ നിങ്ങൾ:',
        options: [
            { text: 'Avoid speaking', textMl: 'സംസാരിക്കുന്നത് ഒഴിവാക്കുന്നു', isCorrect: false, scoreValue: 1 },
            { text: 'Speak when needed', textMl: 'ആവശ്യമുള്ളപ്പോൾ മാത്രം സംസാരിക്കുന്നു', isCorrect: false, scoreValue: 2 },
            { text: 'Share ideas freely', textMl: 'അഭിപ്രായങ്ങൾ മടികൂടാതെ പങ്കുവെക്കുന്നു', isCorrect: false, scoreValue: 3 },
        ],
    },
    {
        section: 'Social Interaction',
        text: 'In school activities, you prefer:',
        textMl: 'സ്കൂൾ ആക്ടിവിറ്റികളിൽ നിങ്ങൾ ഇഷ്ടപ്പെടുന്നത്:',
        options: [
            { text: 'Individual roles', textMl: 'ഒറ്റയ്ക്കുള്ള ചുമതലകൾ', isCorrect: false, scoreValue: 1 },
            { text: 'Mixed roles', textMl: 'കൂട്ടായും ഒറ്റയ്ക്കുമുള്ള ചുമതലകൾ', isCorrect: false, scoreValue: 2 },
            { text: 'Interaction-based roles', textMl: 'മറ്റുള്ളവരുമായി ഇടപഴകിക്കൊണ്ടുള്ള ചുമതലകൾ', isCorrect: false, scoreValue: 3 },
        ],
    },
    {
        section: 'Social Interaction',
        text: 'Even if you feel shy, you:',
        textMl: 'ലജ്ജ തോന്നിയാലും നിങ്ങൾ:',
        options: [
            { text: 'Stay silent', textMl: 'മിണ്ടാതിരിക്കുന്നു', isCorrect: false, scoreValue: 1 },
            { text: 'Speak with effort', textMl: 'ശ്രമപ്പെട്ട് സംസാരിക്കുന്നു', isCorrect: false, scoreValue: 2 },
            { text: 'Express confidently', textMl: 'ആത്മവിശ്വാസത്തോടെ സംസാരിക്കുന്നു', isCorrect: false, scoreValue: 3 },
        ],
    },
    {
        section: 'Social Interaction',
        text: 'When meeting new people, you:',
        textMl: 'പുതിയ ആളുകളെ പരിചയപ്പെടുമ്പോൾ നിങ്ങൾ:',
        options: [
            { text: 'Take long to open up', textMl: 'അടുത്തു പെരുമാറാൻ സമയമെടുക്കുന്നു', isCorrect: false, scoreValue: 1 },
            { text: 'Adjust slowly', textMl: 'പതുക്കെ ശീലിക്കുന്നു', isCorrect: false, scoreValue: 2 },
            { text: 'Connect easily', textMl: 'പെട്ടെന്ന് ചങ്ങാത്തത്തിലാകുന്നു', isCorrect: false, scoreValue: 3 },
        ],
    },

    // ===== 5. TEAM VS INDEPENDENT STYLE (6 questions) =====
    {
        section: 'Team vs Independent Style',
        text: 'You prefer working:',
        textMl: 'നിങ്ങൾ ജോലി ചെയ്യാൻ ഇഷ്ടപ്പെടുന്നത്:',
        options: [
            { text: 'Alone', textMl: 'ഒറ്റയ്ക്ക്', isCorrect: false, scoreValue: 1 },
            { text: 'Sometimes alone, sometimes in team', textMl: 'ചിലപ്പോൾ ഒറ്റയ്ക്കും ചിലപ്പോൾ ടീമായും', isCorrect: false, scoreValue: 2 },
            { text: 'Mostly in team', textMl: 'കൂടുതലും ടീമായി', isCorrect: false, scoreValue: 3 },
        ],
    },
    {
        section: 'Team vs Independent Style',
        text: 'Group tasks make you feel:',
        textMl: 'ഗ്രൂപ്പ് ജോലികൾ ചെയ്യുമ്പോൾ നിങ്ങൾക്ക് തോന്നുന്നത്:',
        options: [
            { text: 'Uncomfortable', textMl: 'അസ്വസ്ഥത', isCorrect: false, scoreValue: 1 },
            { text: 'Neutral', textMl: 'പ്രത്യേകിച്ച് മാറ്റമില്ല', isCorrect: false, scoreValue: 2 },
            { text: 'Comfortable', textMl: 'ആശ്വാസം/സന്തോഷം', isCorrect: false, scoreValue: 3 },
        ],
    },
    {
        section: 'Team vs Independent Style',
        text: 'In group projects, you:',
        textMl: 'ഗ്രൂപ്പ് പ്രോജക്റ്റുകളിൽ നിങ്ങൾ:',
        options: [
            { text: 'Avoid involvement', textMl: 'ഇടപെടുന്നത് ഒഴിവാക്കുന്നു', isCorrect: false, scoreValue: 1 },
            { text: 'Do assigned part', textMl: 'തനിക്ക് കിട്ടിയ ഭാഗം മാത്രം ചെയ്യുന്നു', isCorrect: false, scoreValue: 2 },
            { text: 'Collaborate actively', textMl: 'മറ്റുള്ളവരുമായി ചേർന്ന് സജീവമായി പ്രവർത്തിക്കുന്നു', isCorrect: false, scoreValue: 3 },
        ],
    },
    {
        section: 'Team vs Independent Style',
        text: 'When working alone, you:',
        textMl: 'ഒറ്റയ്ക്ക് ജോലി ചെയ്യുമ്പോൾ നിങ്ങൾക്ക്:',
        options: [
            { text: 'Feel unsure', textMl: 'ആത്മവിശ്വാസക്കുറവ് തോന്നുന്നു', isCorrect: false, scoreValue: 1 },
            { text: 'Manage fine', textMl: 'കുഴപ്പമില്ലാതെ കൊണ്ടുപോകുന്നു', isCorrect: false, scoreValue: 2 },
            { text: 'Feel confident', textMl: 'ആത്മവിശ്വാസം തോന്നുന്നു', isCorrect: false, scoreValue: 3 },
        ],
    },
    {
        section: 'Team vs Independent Style',
        text: 'Even if teamwork is challenging, you:',
        textMl: 'ടീം വർക്ക് പ്രയാസകരമാണെങ്കിലും നിങ്ങൾ:',
        options: [
            { text: 'Avoid it', textMl: 'അത് ഒഴിവാക്കുന്നു', isCorrect: false, scoreValue: 1 },
            { text: 'Adjust when needed', textMl: 'ആവശ്യാനുസരണം സഹകരിക്കുന്നു', isCorrect: false, scoreValue: 2 },
            { text: 'Engage actively', textMl: 'സജീവമായി ഇടപെടുന്നു', isCorrect: false, scoreValue: 3 },
        ],
    },
    {
        section: 'Team vs Independent Style',
        text: 'You perform best when work is:',
        textMl: 'എങ്ങനെയുള്ള ജോലികളിലാണ് നിങ്ങൾ മികച്ച രീതിയിൽ പ്രവർത്തിക്കുന്നത്:',
        options: [
            { text: 'Fully independent', textMl: 'പൂർണ്ണമായും ഒറ്റയ്ക്ക് ചെയ്യുമ്പോൾ', isCorrect: false, scoreValue: 1 },
            { text: 'Partly shared', textMl: 'ചില ഭാഗങ്ങൾ മറ്റുള്ളവരുമായി പങ്കുവെക്കുമ്പോൾ', isCorrect: false, scoreValue: 2 },
            { text: 'Fully collaborative', textMl: 'പൂർണ്ണമായും കൂട്ടായി ചെയ്യുമ്പോൾ', isCorrect: false, scoreValue: 3 },
        ],
    },

    // ===== 6. DECISION-MAKING STYLE (6 questions) =====
    {
        section: 'Decision-Making Style',
        text: 'When making decisions, you:',
        textMl: 'തീരുമാനങ്ങൾ എടുക്കുമ്പോൾ നിങ്ങൾ:',
        options: [
            { text: 'Avoid deciding', textMl: 'തീരുമാനമെടുക്കുന്നത് ഒഴിവാക്കുന്നു', isCorrect: false, scoreValue: 1 },
            { text: 'Decide after thinking', textMl: 'ചിന്തിച്ച ശേഷം തീരുമാനിക്കുന്നു', isCorrect: false, scoreValue: 2 },
            { text: 'Decide confidently', textMl: 'ആത്മവിശ്വാസത്തോടെ തീരുമാനിക്കുന്നു', isCorrect: false, scoreValue: 3 },
        ],
    },
    {
        section: 'Decision-Making Style',
        text: 'You prefer decisions that are:',
        textMl: 'നിങ്ങൾ ഇഷ്ടപ്പെടുന്ന തീരുമാനങ്ങൾ:',
        options: [
            { text: 'Made by others', textMl: 'മറ്റുള്ളവർ എടുക്കുന്നത്', isCorrect: false, scoreValue: 1 },
            { text: 'Shared', textMl: 'മറ്റുള്ളവരുമായി ചേർന്ന് എടുക്കുന്നത്', isCorrect: false, scoreValue: 2 },
            { text: 'Made by you', textMl: 'നിങ്ങൾ തന്നെ എടുക്കുന്നത്', isCorrect: false, scoreValue: 3 },
        ],
    },
    {
        section: 'Decision-Making Style',
        text: 'You must choose between two options. You:',
        textMl: 'രണ്ട് ഓപ്ഷനുകളിൽ നിന്ന് ഒന്നു തിരഞ്ഞെടുക്കേണ്ടി വരുമ്പോൾ നിങ്ങൾ:',
        options: [
            { text: 'Delay decision', textMl: 'തീരുമാനമെടുക്കാൻ വൈകിപ്പിക്കുന്നു', isCorrect: false, scoreValue: 1 },
            { text: 'Think and decide', textMl: 'ആലോചിച്ച് തീരുമാനിക്കുന്നു', isCorrect: false, scoreValue: 2 },
            { text: 'Decide quickly', textMl: 'പെട്ടെന്ന് തീരുമാനിക്കുന്നു', isCorrect: false, scoreValue: 3 },
        ],
    },
    {
        section: 'Decision-Making Style',
        text: 'Before deciding, you usually:',
        textMl: 'ഒരു തീരുമാനമെടുക്കുന്നതിന് മുൻപ് നിങ്ങൾ സാധാരണയായി:',
        options: [
            { text: 'Depend fully on others', textMl: 'മറ്റുള്ളവരെ പൂർണ്ണമായും ആശ്രയിക്കുന്നു', isCorrect: false, scoreValue: 1 },
            { text: 'Take advice', textMl: 'ഉപദേശം തേടുന്നു', isCorrect: false, scoreValue: 2 },
            { text: 'Trust your judgment', textMl: 'സ്വന്തം തീരുമാനത്തിൽ വിശ്വസിക്കുന്നു', isCorrect: false, scoreValue: 3 },
        ],
    },
    {
        section: 'Decision-Making Style',
        text: 'Under pressure, your decisions are:',
        textMl: 'സമ്മർദ്ദമുള്ളപ്പോൾ നിങ്ങളുടെ തീരുമാനങ്ങൾ:',
        options: [
            { text: 'Confused', textMl: 'ആശയക്കുഴപ്പം നിറഞ്ഞത്', isCorrect: false, scoreValue: 1 },
            { text: 'Careful', textMl: 'വളരെ ജാഗ്രതയോടെയുള്ളത്', isCorrect: false, scoreValue: 2 },
            { text: 'Clear', textMl: 'വ്യക്തമായത്', isCorrect: false, scoreValue: 3 },
        ],
    },
    {
        section: 'Decision-Making Style',
        text: 'Even if others disagree, you:',
        textMl: 'മറ്റുള്ളവർ എതിർത്താലും നിങ്ങൾ:',
        options: [
            { text: 'Change decision easily', textMl: 'തീരുമാനം എളുപ്പത്തിൽ മാറ്റുന്നു', isCorrect: false, scoreValue: 1 },
            { text: 'Reconsider', textMl: 'വീണ്ടും ആലോചിക്കുന്നു', isCorrect: false, scoreValue: 2 },
            { text: 'Stand by your choice', textMl: 'തീരുമാനത്തിൽ ഉറച്ചുനിൽക്കുന്നു', isCorrect: false, scoreValue: 3 },
        ],
    },
];
