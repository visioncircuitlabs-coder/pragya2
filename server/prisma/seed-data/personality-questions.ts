/**
 * Work Context Personality Traits Assessment (30 Questions)
 * 6 Trait Categories, 5 Likert Scale (1-5)
 * 
 * Includes 10 reverse-scored items (marked with isReversed: true)
 * to prevent social desirability bias and acquiescence bias.
 * Reverse-scored items: Strongly Agree = 1 (low), Strongly Disagree = 5 (high)
 */

const personalityQuestions = [
    // WORK DISCIPLINE & TASK RELIABILITY (5 questions - 2 reverse-scored)
    {
        section: 'Work Discipline & Task Reliability',
        text: 'I complete tasks on time even if I am not supervised.',
        textMl: 'മേൽനോട്ടമില്ലെങ്കിലും ഞാൻ സമയത്ത് ജോലികൾ പൂർത്തിയാക്കുന്നു.',
        options: [
            { text: 'Strongly Disagree', textMl: 'ശക്തമായി വിയോജിക്കുന്നു', isCorrect: false, scoreValue: 1 },
            { text: 'Disagree', textMl: 'വിയോജിക്കുന്നു', isCorrect: false, scoreValue: 2 },
            { text: 'Neutral', textMl: 'നിഷ്പക്ഷം', isCorrect: false, scoreValue: 3 },
            { text: 'Agree', textMl: 'യോജിക്കുന്നു', isCorrect: false, scoreValue: 4 },
            { text: 'Strongly Agree', textMl: 'ശക്തമായി യോജിക്കുന്നു', isCorrect: false, scoreValue: 5 },
        ],
    },
    {
        section: 'Work Discipline & Task Reliability',
        text: 'I follow workplace rules and guidelines consistently.',
        textMl: 'ഞാൻ ജോലിസ്ഥലത്തെ നിയമങ്ങളും മാർഗ്ഗനിർദ്ദേശങ്ങളും സ്ഥിരമായി പാലിക്കുന്നു.',
        options: [
            { text: 'Strongly Disagree', textMl: 'ശക്തമായി വിയോജിക്കുന്നു', isCorrect: false, scoreValue: 1 },
            { text: 'Disagree', textMl: 'വിയോജിക്കുന്നു', isCorrect: false, scoreValue: 2 },
            { text: 'Neutral', textMl: 'നിഷ്പക്ഷം', isCorrect: false, scoreValue: 3 },
            { text: 'Agree', textMl: 'യോജിക്കുന്നു', isCorrect: false, scoreValue: 4 },
            { text: 'Strongly Agree', textMl: 'ശക്തമായി യോജിക്കുന്നു', isCorrect: false, scoreValue: 5 },
        ],
    },
    {
        section: 'Work Discipline & Task Reliability',
        text: 'I take pride in doing my work carefully and correctly.',
        textMl: 'എന്റെ ജോലി ശ്രദ്ധാപൂർവ്വവും കൃത്യമായും ചെയ്യുന്നതിൽ ഞാൻ അഭിമാനിക്കുന്നു.',
        options: [
            { text: 'Strongly Disagree', textMl: 'ശക്തമായി വിയോജിക്കുന്നു', isCorrect: false, scoreValue: 1 },
            { text: 'Disagree', textMl: 'വിയോജിക്കുന്നു', isCorrect: false, scoreValue: 2 },
            { text: 'Neutral', textMl: 'നിഷ്പക്ഷം', isCorrect: false, scoreValue: 3 },
            { text: 'Agree', textMl: 'യോജിക്കുന്നു', isCorrect: false, scoreValue: 4 },
            { text: 'Strongly Agree', textMl: 'ശക്തമായി യോജിക്കുന്നു', isCorrect: false, scoreValue: 5 },
        ],
    },
    // REVERSE-SCORED: Agreeing = low discipline
    {
        section: 'Work Discipline & Task Reliability',
        text: 'I sometimes leave tasks unfinished when I lose interest.',
        textMl: 'താൽപ്പര്യം നഷ്ടപ്പെടുമ്പോൾ ചിലപ്പോൾ ഞാൻ ടാസ്ക്കുകൾ പൂർത്തിയാക്കാതെ വിടാറുണ്ട്.',
        options: [
            { text: 'Strongly Disagree', textMl: 'ശക്തമായി വിയോജിക്കുന്നു', isCorrect: false, scoreValue: 5 },
            { text: 'Disagree', textMl: 'വിയോജിക്കുന്നു', isCorrect: false, scoreValue: 4 },
            { text: 'Neutral', textMl: 'നിഷ്പക്ഷം', isCorrect: false, scoreValue: 3 },
            { text: 'Agree', textMl: 'യോജിക്കുന്നു', isCorrect: false, scoreValue: 2 },
            { text: 'Strongly Agree', textMl: 'ശക്തമായി യോജിക്കുന്നു', isCorrect: false, scoreValue: 1 },
        ],
    },
    // REVERSE-SCORED: Agreeing = low punctuality
    {
        section: 'Work Discipline & Task Reliability',
        text: 'I often struggle to meet deadlines without reminders.',
        textMl: 'ഓർമ്മപ്പെടുത്തലുകൾ ഇല്ലാതെ സമയപരിധി പാലിക്കാൻ ഞാൻ പലപ്പോഴും ബുദ്ധിമുട്ടാറുണ്ട്.',
        options: [
            { text: 'Strongly Disagree', textMl: 'ശക്തമായി വിയോജിക്കുന്നു', isCorrect: false, scoreValue: 5 },
            { text: 'Disagree', textMl: 'വിയോജിക്കുന്നു', isCorrect: false, scoreValue: 4 },
            { text: 'Neutral', textMl: 'നിഷ്പക്ഷം', isCorrect: false, scoreValue: 3 },
            { text: 'Agree', textMl: 'യോജിക്കുന്നു', isCorrect: false, scoreValue: 2 },
            { text: 'Strongly Agree', textMl: 'ശക്തമായി യോജിക്കുന്നു', isCorrect: false, scoreValue: 1 },
        ],
    },

    // STRESS TOLERANCE & EMOTIONAL REGULATION (5 questions - 2 reverse-scored)
    {
        section: 'Stress Tolerance & Emotional Regulation',
        text: 'I stay calm when work pressure increases.',
        textMl: 'ജോലി സമ്മർദ്ദം വർധിക്കുമ്പോൾ ഞാൻ ശാന്തമായിരിക്കുന്നു.',
        options: [
            { text: 'Strongly Disagree', textMl: 'ശക്തമായി വിയോജിക്കുന്നു', isCorrect: false, scoreValue: 1 },
            { text: 'Disagree', textMl: 'വിയോജിക്കുന്നു', isCorrect: false, scoreValue: 2 },
            { text: 'Neutral', textMl: 'നിഷ്പക്ഷം', isCorrect: false, scoreValue: 3 },
            { text: 'Agree', textMl: 'യോജിക്കുന്നു', isCorrect: false, scoreValue: 4 },
            { text: 'Strongly Agree', textMl: 'ശക്തമായി യോജിക്കുന്നു', isCorrect: false, scoreValue: 5 },
        ],
    },
    {
        section: 'Stress Tolerance & Emotional Regulation',
        text: 'I can manage my emotions even when things go wrong.',
        textMl: 'കാര്യങ്ങൾ തെറ്റാകുമ്പോഴും എന്റെ വികാരങ്ങൾ നിയന്ത്രിക്കാൻ എനിക്ക് കഴിയുന്നു.',
        options: [
            { text: 'Strongly Disagree', textMl: 'ശക്തമായി വിയോജിക്കുന്നു', isCorrect: false, scoreValue: 1 },
            { text: 'Disagree', textMl: 'വിയോജിക്കുന്നു', isCorrect: false, scoreValue: 2 },
            { text: 'Neutral', textMl: 'നിഷ്പക്ഷം', isCorrect: false, scoreValue: 3 },
            { text: 'Agree', textMl: 'യോജിക്കുന്നു', isCorrect: false, scoreValue: 4 },
            { text: 'Strongly Agree', textMl: 'ശക്തമായി യോജിക്കുന്നു', isCorrect: false, scoreValue: 5 },
        ],
    },
    {
        section: 'Stress Tolerance & Emotional Regulation',
        text: 'I recover quickly from disappointments or setbacks.',
        textMl: 'നിരാശകളിൽ നിന്നോ പരാജയങ്ങളിൽ നിന്നോ ഞാൻ വേഗം കരകയറുന്നു.',
        options: [
            { text: 'Strongly Disagree', textMl: 'ശക്തമായി വിയോജിക്കുന്നു', isCorrect: false, scoreValue: 1 },
            { text: 'Disagree', textMl: 'വിയോജിക്കുന്നു', isCorrect: false, scoreValue: 2 },
            { text: 'Neutral', textMl: 'നിഷ്പക്ഷം', isCorrect: false, scoreValue: 3 },
            { text: 'Agree', textMl: 'യോജിക്കുന്നു', isCorrect: false, scoreValue: 4 },
            { text: 'Strongly Agree', textMl: 'ശക്തമായി യോജിക്കുന്നു', isCorrect: false, scoreValue: 5 },
        ],
    },
    // REVERSE-SCORED: Agreeing = low stress tolerance
    {
        section: 'Stress Tolerance & Emotional Regulation',
        text: 'I tend to get anxious when facing unexpected changes at work.',
        textMl: 'ജോലിയിൽ അപ്രതീക്ഷിത മാറ്റങ്ങൾ നേരിടുമ്പോൾ ഞാൻ ഉത്കണ്ഠാകുലനാകാറുണ്ട്.',
        options: [
            { text: 'Strongly Disagree', textMl: 'ശക്തമായി വിയോജിക്കുന്നു', isCorrect: false, scoreValue: 5 },
            { text: 'Disagree', textMl: 'വിയോജിക്കുന്നു', isCorrect: false, scoreValue: 4 },
            { text: 'Neutral', textMl: 'നിഷ്പക്ഷം', isCorrect: false, scoreValue: 3 },
            { text: 'Agree', textMl: 'യോജിക്കുന്നു', isCorrect: false, scoreValue: 2 },
            { text: 'Strongly Agree', textMl: 'ശക്തമായി യോജിക്കുന്നു', isCorrect: false, scoreValue: 1 },
        ],
    },
    // REVERSE-SCORED: Agreeing = poor emotional regulation
    {
        section: 'Stress Tolerance & Emotional Regulation',
        text: 'Criticism from others often affects my mood for the rest of the day.',
        textMl: 'മറ്റുള്ളവരിൽ നിന്നുള്ള വിമർശനം പലപ്പോഴും ദിവസത്തെ ബാക്കി സമയത്ത് എന്റെ മാനസികാവസ്ഥയെ ബാധിക്കാറുണ്ട്.',
        options: [
            { text: 'Strongly Disagree', textMl: 'ശക്തമായി വിയോജിക്കുന്നു', isCorrect: false, scoreValue: 5 },
            { text: 'Disagree', textMl: 'വിയോജിക്കുന്നു', isCorrect: false, scoreValue: 4 },
            { text: 'Neutral', textMl: 'നിഷ്പക്ഷം', isCorrect: false, scoreValue: 3 },
            { text: 'Agree', textMl: 'യോജിക്കുന്നു', isCorrect: false, scoreValue: 2 },
            { text: 'Strongly Agree', textMl: 'ശക്തമായി യോജിക്കുന്നു', isCorrect: false, scoreValue: 1 },
        ],
    },

    // LEARNING & CHANGE ORIENTATION (5 questions - 2 reverse-scored)
    {
        section: 'Learning & Change Orientation',
        text: 'I am open to learning new skills or methods.',
        textMl: 'പുതിയ കഴിവുകളോ രീതികളോ പഠിക്കാൻ ഞാൻ തയ്യാറാണ്.',
        options: [
            { text: 'Strongly Disagree', textMl: 'ശക്തമായി വിയോജിക്കുന്നു', isCorrect: false, scoreValue: 1 },
            { text: 'Disagree', textMl: 'വിയോജിക്കുന്നു', isCorrect: false, scoreValue: 2 },
            { text: 'Neutral', textMl: 'നിഷ്പക്ഷം', isCorrect: false, scoreValue: 3 },
            { text: 'Agree', textMl: 'യോജിക്കുന്നു', isCorrect: false, scoreValue: 4 },
            { text: 'Strongly Agree', textMl: 'ശക്തമായി യോജിക്കുന്നു', isCorrect: false, scoreValue: 5 },
        ],
    },
    {
        section: 'Learning & Change Orientation',
        text: 'I adapt quickly when there are changes in procedures.',
        textMl: 'നടപടിക്രമങ്ങളിൽ മാറ്റങ്ങൾ വരുമ്പോൾ ഞാൻ വേഗത്തിൽ പൊരുത്തപ്പെടുന്നു.',
        options: [
            { text: 'Strongly Disagree', textMl: 'ശക്തമായി വിയോജിക്കുന്നു', isCorrect: false, scoreValue: 1 },
            { text: 'Disagree', textMl: 'വിയോജിക്കുന്നു', isCorrect: false, scoreValue: 2 },
            { text: 'Neutral', textMl: 'നിഷ്പക്ഷം', isCorrect: false, scoreValue: 3 },
            { text: 'Agree', textMl: 'യോജിക്കുന്നു', isCorrect: false, scoreValue: 4 },
            { text: 'Strongly Agree', textMl: 'ശക്തമായി യോജിക്കുന്നു', isCorrect: false, scoreValue: 5 },
        ],
    },
    // REVERSE-SCORED: Agreeing = resistance to change
    {
        section: 'Learning & Change Orientation',
        text: 'I prefer sticking to methods I already know rather than trying new ones.',
        textMl: 'പുതിയ രീതികൾ പരീക്ഷിക്കുന്നതിനേക്കാൾ ഞാൻ ഇതിനകം അറിയുന്ന രീതികൾ പിന്തുടരാൻ ഇഷ്ടപ്പെടുന്നു.',
        options: [
            { text: 'Strongly Disagree', textMl: 'ശക്തമായി വിയോജിക്കുന്നു', isCorrect: false, scoreValue: 5 },
            { text: 'Disagree', textMl: 'വിയോജിക്കുന്നു', isCorrect: false, scoreValue: 4 },
            { text: 'Neutral', textMl: 'നിഷ്പക്ഷം', isCorrect: false, scoreValue: 3 },
            { text: 'Agree', textMl: 'യോജിക്കുന്നു', isCorrect: false, scoreValue: 2 },
            { text: 'Strongly Agree', textMl: 'ശക്തമായി യോജിക്കുന്നു', isCorrect: false, scoreValue: 1 },
        ],
    },
    {
        section: 'Learning & Change Orientation',
        text: 'I welcome feedback as an opportunity to improve.',
        textMl: 'മെച്ചപ്പെടാനുള്ള അവസരമായി ഞാൻ ഫീഡ്ബാക്ക് സ്വാഗതം ചെയ്യുന്നു.',
        options: [
            { text: 'Strongly Disagree', textMl: 'ശക്തമായി വിയോജിക്കുന്നു', isCorrect: false, scoreValue: 1 },
            { text: 'Disagree', textMl: 'വിയോജിക്കുന്നു', isCorrect: false, scoreValue: 2 },
            { text: 'Neutral', textMl: 'നിഷ്പക്ഷം', isCorrect: false, scoreValue: 3 },
            { text: 'Agree', textMl: 'യോജിക്കുന്നു', isCorrect: false, scoreValue: 4 },
            { text: 'Strongly Agree', textMl: 'ശക്തമായി യോജിക്കുന്നു', isCorrect: false, scoreValue: 5 },
        ],
    },
    // REVERSE-SCORED: Agreeing = avoids learning from failure
    {
        section: 'Learning & Change Orientation',
        text: 'I find it hard to accept when my approach turns out to be wrong.',
        textMl: 'എന്റെ സമീപനം തെറ്റാണെന്ന് മനസ്സിലാകുമ്പോൾ അത് അംഗീകരിക്കാൻ എനിക്ക് ബുദ്ധിമുട്ടാണ്.',
        options: [
            { text: 'Strongly Disagree', textMl: 'ശക്തമായി വിയോജിക്കുന്നു', isCorrect: false, scoreValue: 5 },
            { text: 'Disagree', textMl: 'വിയോജിക്കുന്നു', isCorrect: false, scoreValue: 4 },
            { text: 'Neutral', textMl: 'നിഷ്പക്ഷം', isCorrect: false, scoreValue: 3 },
            { text: 'Agree', textMl: 'യോജിക്കുന്നു', isCorrect: false, scoreValue: 2 },
            { text: 'Strongly Agree', textMl: 'ശക്തമായി യോജിക്കുന്നു', isCorrect: false, scoreValue: 1 },
        ],
    },

    // SOCIAL ENGAGEMENT & TASK FOCUS BALANCE (5 questions - 1 reverse-scored)
    {
        section: 'Social Engagement & Task Focus',
        text: 'I enjoy interacting with colleagues during work.',
        textMl: 'ജോലി സമയത്ത് സഹപ്രവർത്തകരുമായി ഇടപഴകുന്നത് ഞാൻ ആസ്വദിക്കുന്നു.',
        options: [
            { text: 'Strongly Disagree', textMl: 'ശക്തമായി വിയോജിക്കുന്നു', isCorrect: false, scoreValue: 1 },
            { text: 'Disagree', textMl: 'വിയോജിക്കുന്നു', isCorrect: false, scoreValue: 2 },
            { text: 'Neutral', textMl: 'നിഷ്പക്ഷം', isCorrect: false, scoreValue: 3 },
            { text: 'Agree', textMl: 'യോജിക്കുന്നു', isCorrect: false, scoreValue: 4 },
            { text: 'Strongly Agree', textMl: 'ശക്തമായി യോജിക്കുന്നു', isCorrect: false, scoreValue: 5 },
        ],
    },
    {
        section: 'Social Engagement & Task Focus',
        text: 'I can work independently without needing constant guidance.',
        textMl: 'നിരന്തരമായ മാർഗ്ഗനിർദ്ദേശം ആവശ്യമില്ലാതെ സ്വതന്ത്രമായി പ്രവർത്തിക്കാൻ എനിക്ക് കഴിയുന്നു.',
        options: [
            { text: 'Strongly Disagree', textMl: 'ശക്തമായി വിയോജിക്കുന്നു', isCorrect: false, scoreValue: 1 },
            { text: 'Disagree', textMl: 'വിയോജിക്കുന്നു', isCorrect: false, scoreValue: 2 },
            { text: 'Neutral', textMl: 'നിഷ്പക്ഷം', isCorrect: false, scoreValue: 3 },
            { text: 'Agree', textMl: 'യോജിക്കുന്നു', isCorrect: false, scoreValue: 4 },
            { text: 'Strongly Agree', textMl: 'ശക്തമായി യോജിക്കുന്നു', isCorrect: false, scoreValue: 5 },
        ],
    },
    {
        section: 'Social Engagement & Task Focus',
        text: 'I balance socializing and task completion effectively.',
        textMl: 'സാമൂഹിക ഇടപെടലും ടാസ്ക് പൂർത്തീകരണവും ഫലപ്രദമായി സന്തുലിതമാക്കാൻ എനിക്ക് കഴിയുന്നു.',
        options: [
            { text: 'Strongly Disagree', textMl: 'ശക്തമായി വിയോജിക്കുന്നു', isCorrect: false, scoreValue: 1 },
            { text: 'Disagree', textMl: 'വിയോജിക്കുന്നു', isCorrect: false, scoreValue: 2 },
            { text: 'Neutral', textMl: 'നിഷ്പക്ഷം', isCorrect: false, scoreValue: 3 },
            { text: 'Agree', textMl: 'യോജിക്കുന്നു', isCorrect: false, scoreValue: 4 },
            { text: 'Strongly Agree', textMl: 'ശക്തമായി യോജിക്കുന്നു', isCorrect: false, scoreValue: 5 },
        ],
    },
    // REVERSE-SCORED: Agreeing = easily distracted
    {
        section: 'Social Engagement & Task Focus',
        text: 'I get easily distracted by conversations happening around me.',
        textMl: 'എന്റെ ചുറ്റും നടക്കുന്ന സംഭാഷണങ്ങളാൽ ഞാൻ എളുപ്പത്തിൽ ശ്രദ്ധ തിരിക്കപ്പെടാറുണ്ട്.',
        options: [
            { text: 'Strongly Disagree', textMl: 'ശക്തമായി വിയോജിക്കുന്നു', isCorrect: false, scoreValue: 5 },
            { text: 'Disagree', textMl: 'വിയോജിക്കുന്നു', isCorrect: false, scoreValue: 4 },
            { text: 'Neutral', textMl: 'നിഷ്പക്ഷം', isCorrect: false, scoreValue: 3 },
            { text: 'Agree', textMl: 'യോജിക്കുന്നു', isCorrect: false, scoreValue: 2 },
            { text: 'Strongly Agree', textMl: 'ശക്തമായി യോജിക്കുന്നു', isCorrect: false, scoreValue: 1 },
        ],
    },
    {
        section: 'Social Engagement & Task Focus',
        text: 'I prefer structured work over open-ended discussions.',
        textMl: 'തുറന്ന ചർച്ചകളേക്കാൾ ഘടനാപരമായ ജോലിയാണ് എനിക്കിഷ്ടം.',
        options: [
            { text: 'Strongly Disagree', textMl: 'ശക്തമായി വിയോജിക്കുന്നു', isCorrect: false, scoreValue: 1 },
            { text: 'Disagree', textMl: 'വിയോജിക്കുന്നു', isCorrect: false, scoreValue: 2 },
            { text: 'Neutral', textMl: 'നിഷ്പക്ഷം', isCorrect: false, scoreValue: 3 },
            { text: 'Agree', textMl: 'യോജിക്കുന്നു', isCorrect: false, scoreValue: 4 },
            { text: 'Strongly Agree', textMl: 'ശക്തമായി യോജിക്കുന്നു', isCorrect: false, scoreValue: 5 },
        ],
    },

    // TEAM COMPATIBILITY & COOPERATION (5 questions - 1 reverse-scored)
    {
        section: 'Team Compatibility & Cooperation',
        text: 'I cooperate willingly even when tasks are difficult.',
        textMl: 'ടാസ്ക്കുകൾ ബുദ്ധിമുട്ടുള്ളപ്പോഴും ഞാൻ മനസ്സോടെ സഹകരിക്കുന്നു.',
        options: [
            { text: 'Strongly Disagree', textMl: 'ശക്തമായി വിയോജിക്കുന്നു', isCorrect: false, scoreValue: 1 },
            { text: 'Disagree', textMl: 'വിയോജിക്കുന്നു', isCorrect: false, scoreValue: 2 },
            { text: 'Neutral', textMl: 'നിഷ്പക്ഷം', isCorrect: false, scoreValue: 3 },
            { text: 'Agree', textMl: 'യോജിക്കുന്നു', isCorrect: false, scoreValue: 4 },
            { text: 'Strongly Agree', textMl: 'ശക്തമായി യോജിക്കുന്നു', isCorrect: false, scoreValue: 5 },
        ],
    },
    {
        section: 'Team Compatibility & Cooperation',
        text: 'I respect diverse opinions in a team.',
        textMl: 'ഒരു ടീമിലെ വ്യത്യസ്ത അഭിപ്രായങ്ങളെ ഞാൻ ബഹുമാനിക്കുന്നു.',
        options: [
            { text: 'Strongly Disagree', textMl: 'ശക്തമായി വിയോജിക്കുന്നു', isCorrect: false, scoreValue: 1 },
            { text: 'Disagree', textMl: 'വിയോജിക്കുന്നു', isCorrect: false, scoreValue: 2 },
            { text: 'Neutral', textMl: 'നിഷ്പക്ഷം', isCorrect: false, scoreValue: 3 },
            { text: 'Agree', textMl: 'യോജിക്കുന്നു', isCorrect: false, scoreValue: 4 },
            { text: 'Strongly Agree', textMl: 'ശക്തമായി യോജിക്കുന്നു', isCorrect: false, scoreValue: 5 },
        ],
    },
    {
        section: 'Team Compatibility & Cooperation',
        text: 'I help colleagues without expecting anything in return.',
        textMl: 'പ്രതിഫലം പ്രതീക്ഷിക്കാതെ ഞാൻ സഹപ്രവർത്തകരെ സഹായിക്കുന്നു.',
        options: [
            { text: 'Strongly Disagree', textMl: 'ശക്തമായി വിയോജിക്കുന്നു', isCorrect: false, scoreValue: 1 },
            { text: 'Disagree', textMl: 'വിയോജിക്കുന്നു', isCorrect: false, scoreValue: 2 },
            { text: 'Neutral', textMl: 'നിഷ്പക്ഷം', isCorrect: false, scoreValue: 3 },
            { text: 'Agree', textMl: 'യോജിക്കുന്നു', isCorrect: false, scoreValue: 4 },
            { text: 'Strongly Agree', textMl: 'ശക്തമായി യോജിക്കുന്നു', isCorrect: false, scoreValue: 5 },
        ],
    },
    // REVERSE-SCORED: Agreeing = poor team player
    {
        section: 'Team Compatibility & Cooperation',
        text: 'I find it frustrating when team members work at a slower pace than me.',
        textMl: 'ടീം അംഗങ്ങൾ എന്നേക്കാൾ പതുക്കെ ജോലി ചെയ്യുമ്പോൾ എനിക്ക് നിരാശ തോന്നാറുണ്ട്.',
        options: [
            { text: 'Strongly Disagree', textMl: 'ശക്തമായി വിയോജിക്കുന്നു', isCorrect: false, scoreValue: 5 },
            { text: 'Disagree', textMl: 'വിയോജിക്കുന്നു', isCorrect: false, scoreValue: 4 },
            { text: 'Neutral', textMl: 'നിഷ്പക്ഷം', isCorrect: false, scoreValue: 3 },
            { text: 'Agree', textMl: 'യോജിക്കുന്നു', isCorrect: false, scoreValue: 2 },
            { text: 'Strongly Agree', textMl: 'ശക്തമായി യോജിക്കുന്നു', isCorrect: false, scoreValue: 1 },
        ],
    },
    {
        section: 'Team Compatibility & Cooperation',
        text: 'I put team goals above personal preferences.',
        textMl: 'വ്യക്തിപരമായ മുൻഗണനകളേക്കാൾ ടീം ലക്ഷ്യങ്ങൾക്ക് ഞാൻ മുൻഗണന നൽകുന്നു.',
        options: [
            { text: 'Strongly Disagree', textMl: 'ശക്തമായി വിയോജിക്കുന്നു', isCorrect: false, scoreValue: 1 },
            { text: 'Disagree', textMl: 'വിയോജിക്കുന്നു', isCorrect: false, scoreValue: 2 },
            { text: 'Neutral', textMl: 'നിഷ്പക്ഷം', isCorrect: false, scoreValue: 3 },
            { text: 'Agree', textMl: 'യോജിക്കുന്നു', isCorrect: false, scoreValue: 4 },
            { text: 'Strongly Agree', textMl: 'ശക്തമായി യോജിക്കുന്നു', isCorrect: false, scoreValue: 5 },
        ],
    },

    // INTEGRITY & RESPONSIBILITY (5 questions - 2 reverse-scored)
    {
        section: 'Integrity & Responsibility',
        text: 'I admit my mistakes rather than hiding them.',
        textMl: 'തെറ്റുകൾ മറച്ചുവെക്കുന്നതിനുപകരം ഞാൻ അവ സമ്മതിക്കുന്നു.',
        options: [
            { text: 'Strongly Disagree', textMl: 'ശക്തമായി വിയോജിക്കുന്നു', isCorrect: false, scoreValue: 1 },
            { text: 'Disagree', textMl: 'വിയോജിക്കുന്നു', isCorrect: false, scoreValue: 2 },
            { text: 'Neutral', textMl: 'നിഷ്പക്ഷം', isCorrect: false, scoreValue: 3 },
            { text: 'Agree', textMl: 'യോജിക്കുന്നു', isCorrect: false, scoreValue: 4 },
            { text: 'Strongly Agree', textMl: 'ശക്തമായി യോജിക്കുന്നു', isCorrect: false, scoreValue: 5 },
        ],
    },
    {
        section: 'Integrity & Responsibility',
        text: 'I follow ethical practices even when no one is watching.',
        textMl: 'ആരും നോക്കുന്നില്ലെങ്കിലും ഞാൻ ധാർമ്മിക സമ്പ്രദായങ്ങൾ പിന്തുടരുന്നു.',
        options: [
            { text: 'Strongly Disagree', textMl: 'ശക്തമായി വിയോജിക്കുന്നു', isCorrect: false, scoreValue: 1 },
            { text: 'Disagree', textMl: 'വിയോജിക്കുന്നു', isCorrect: false, scoreValue: 2 },
            { text: 'Neutral', textMl: 'നിഷ്പക്ഷം', isCorrect: false, scoreValue: 3 },
            { text: 'Agree', textMl: 'യോജിക്കുന്നു', isCorrect: false, scoreValue: 4 },
            { text: 'Strongly Agree', textMl: 'ശക്തമായി യോജിക്കുന്നു', isCorrect: false, scoreValue: 5 },
        ],
    },
    // REVERSE-SCORED: Agreeing = avoids responsibility
    {
        section: 'Integrity & Responsibility',
        text: 'I sometimes bend rules if I think no one will find out.',
        textMl: 'ആരും കണ്ടെത്തില്ലെന്ന് തോന്നിയാൽ ഞാൻ ചിലപ്പോൾ നിയമങ്ങൾ വളയ്ക്കാറുണ്ട്.',
        options: [
            { text: 'Strongly Disagree', textMl: 'ശക്തമായി വിയോജിക്കുന്നു', isCorrect: false, scoreValue: 5 },
            { text: 'Disagree', textMl: 'വിയോജിക്കുന്നു', isCorrect: false, scoreValue: 4 },
            { text: 'Neutral', textMl: 'നിഷ്പക്ഷം', isCorrect: false, scoreValue: 3 },
            { text: 'Agree', textMl: 'യോജിക്കുന്നു', isCorrect: false, scoreValue: 2 },
            { text: 'Strongly Agree', textMl: 'ശക്തമായി യോജിക്കുന്നു', isCorrect: false, scoreValue: 1 },
        ],
    },
    {
        section: 'Integrity & Responsibility',
        text: 'I keep confidential information private.',
        textMl: 'രഹസ്യ വിവരങ്ങൾ ഞാൻ സ്വകാര്യമായി സൂക്ഷിക്കുന്നു.',
        options: [
            { text: 'Strongly Disagree', textMl: 'ശക്തമായി വിയോജിക്കുന്നു', isCorrect: false, scoreValue: 1 },
            { text: 'Disagree', textMl: 'വിയോജിക്കുന്നു', isCorrect: false, scoreValue: 2 },
            { text: 'Neutral', textMl: 'നിഷ്പക്ഷം', isCorrect: false, scoreValue: 3 },
            { text: 'Agree', textMl: 'യോജിക്കുന്നു', isCorrect: false, scoreValue: 4 },
            { text: 'Strongly Agree', textMl: 'ശക്തമായി യോജിക്കുന്നു', isCorrect: false, scoreValue: 5 },
        ],
    },
    // REVERSE-SCORED: Agreeing = blames others
    {
        section: 'Integrity & Responsibility',
        text: 'When something goes wrong, my first thought is about who else might be responsible.',
        textMl: 'എന്തെങ്കിലും തെറ്റാകുമ്പോൾ, മറ്റാരെങ്കിലും ഉത്തരവാദിയാണോ എന്നതാണ് എന്റെ ആദ്യ ചിന്ത.',
        options: [
            { text: 'Strongly Disagree', textMl: 'ശക്തമായി വിയോജിക്കുന്നു', isCorrect: false, scoreValue: 5 },
            { text: 'Disagree', textMl: 'വിയോജിക്കുന്നു', isCorrect: false, scoreValue: 4 },
            { text: 'Neutral', textMl: 'നിഷ്പക്ഷം', isCorrect: false, scoreValue: 3 },
            { text: 'Agree', textMl: 'യോജിക്കുന്നു', isCorrect: false, scoreValue: 2 },
            { text: 'Strongly Agree', textMl: 'ശക്തമായി യോജിക്കുന്നു', isCorrect: false, scoreValue: 1 },
        ],
    },
];

export { personalityQuestions };
