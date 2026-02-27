/**
 * Student RIASEC Career Interest Inventory (48 Questions)
 * Based on Holland's RIASEC Model — Student Version
 * Binary forced-choice: Option A = interest match (scoreValue: 1), Option B = no match (scoreValue: 0)
 * 8 questions per RIASEC type
 */

export const studentRiasecQuestions = [
    // ===== REALISTIC (8 questions) =====
    {
        section: 'REALISTIC',
        text: 'Which activity sounds more enjoyable?',
        textMl: 'ഏത് കാര്യമാണ് നിങ്ങൾക്ക് കൂടുതൽ ഇഷ്ടം?',
        options: [
            { text: 'Fixing or assembling something with tools', textMl: 'ടൂൾസ് ഉപയോഗിച്ച് എന്തെങ്കിലും നന്നാക്കുകയോ നിർമ്മിക്കുകയോ ചെയ്യുന്നത്', isCorrect: false, scoreValue: 1 },
            { text: 'Reading about famous people', textMl: 'പ്രശസ്തരായ ആളുകളെക്കുറിച്ച് വായിക്കുന്നത്', isCorrect: false, scoreValue: 0 },
        ],
    },
    {
        section: 'REALISTIC',
        text: 'During free time, you prefer:',
        textMl: 'ഒഴിവ് സമയത്ത് നിങ്ങൾ ഇതിൽ ഏതാണ് ഇഷ്ടപ്പെടുക?',
        options: [
            { text: 'Helping with physical work (cleaning, arranging, repairing)', textMl: 'വീട്ടുജോലികളിലോ സാധനങ്ങൾ അടുക്കി വെക്കുന്നതിലോ സഹായിക്കുന്നത്', isCorrect: false, scoreValue: 1 },
            { text: 'Watching videos or scrolling on phone', textMl: 'വീഡിയോകൾ കാണുന്നതോ ഫോൺ ഉപയോഗിക്കുന്നതോ', isCorrect: false, scoreValue: 0 },
        ],
    },
    {
        section: 'REALISTIC',
        text: 'In school activities, you like tasks that involve:',
        textMl: 'സ്കൂളിലെ പരിപാടികളിൽ നിങ്ങൾക്കിഷ്ടം:',
        options: [
            { text: 'Doing things with your hands', textMl: 'കൈകൾ കൊണ്ട് എന്തെങ്കിലും പണികൾ ചെയ്യുന്നത്', isCorrect: false, scoreValue: 1 },
            { text: 'Talking or writing about ideas', textMl: 'ആശയങ്ങളെക്കുറിച്ച് സംസാരിക്കുന്നതോ എഴുതുന്നതോ', isCorrect: false, scoreValue: 0 },
        ],
    },
    {
        section: 'REALISTIC',
        text: 'You can choose one activity:',
        textMl: 'ഒരു കാര്യം തിരഞ്ഞെടുക്കാൻ പറഞ്ഞാൽ നിങ്ങൾ ഏത് എടുക്കും?',
        options: [
            { text: 'Setting up equipment for an event', textMl: 'ഒരു പരിപാടിക്കായി സ്റ്റേജോ മറ്റ് സൗകര്യങ്ങളോ ഒരുക്കുന്നത്', isCorrect: false, scoreValue: 1 },
            { text: 'Designing posters for the event', textMl: 'ആ പരിപാടിയുടെ പോസ്റ്ററുകൾ ഡിസൈൻ ചെയ്യുന്നത്', isCorrect: false, scoreValue: 0 },
        ],
    },
    {
        section: 'REALISTIC',
        text: 'In a group project, you prefer to:',
        textMl: 'ഒരു ഗ്രൂപ്പ് പ്രോജക്റ്റിൽ നിങ്ങൾ ഏത് ഭാഗം ചെയ്യാനാണ് ഇഷ്ടപ്പെടുക?',
        options: [
            { text: 'Build, arrange, or manage materials', textMl: 'സാധനങ്ങൾ ഉണ്ടാക്കുകയോ അടുക്കി വെക്കുകയോ ചെയ്യുന്നത്', isCorrect: false, scoreValue: 1 },
            { text: 'Plan ideas and explain them', textMl: 'ഐഡിയകൾ പ്ലാൻ ചെയ്യുന്നതും അത് വിവരിച്ചു കൊടുക്കുന്നതും', isCorrect: false, scoreValue: 0 },
        ],
    },
    {
        section: 'REALISTIC',
        text: 'Which feels more satisfying?',
        textMl: 'ഇതിൽ ഏതാണ് നിങ്ങൾക്ക് കൂടുതൽ സംതൃപ്തി നൽകുക?',
        options: [
            { text: 'Completing a physical task correctly', textMl: 'ഒരു പണി കൃത്യമായി ചെയ്തു തീർക്കുന്നത്', isCorrect: false, scoreValue: 1 },
            { text: 'Explaining how something works', textMl: 'ഒരു സാധനം എങ്ങനെയാണ് പ്രവർത്തിക്കുന്നത് എന്ന് വിവരിക്കുന്നത്', isCorrect: false, scoreValue: 0 },
        ],
    },
    {
        section: 'REALISTIC',
        text: 'Even if it takes time and effort, you prefer tasks where you:',
        textMl: 'സമയമെടുത്താലും നിങ്ങൾക്കിഷ്ടം:',
        options: [
            { text: 'Learn by doing and practicing', textMl: 'സ്വന്തമായി ചെയ്തു പഠിക്കുന്നത്', isCorrect: false, scoreValue: 1 },
            { text: 'Learn by reading and discussing', textMl: 'വായിച്ചും ചർച്ച ചെയ്തും പഠിക്കുന്നത്', isCorrect: false, scoreValue: 0 },
        ],
    },
    {
        section: 'REALISTIC',
        text: 'If marks are not given, you would still enjoy:',
        textMl: 'മാർക്കിന് വേണ്ടിയല്ലെങ്കിൽ പോലും നിങ്ങൾ ചെയ്യാൻ ഇഷ്ടപ്പെടുന്നത്:',
        options: [
            { text: 'Practical work that needs patience', textMl: 'ക്ഷമയോടെ ചെയ്യേണ്ട പ്രായോഗിക പണികൾ', isCorrect: false, scoreValue: 1 },
            { text: 'Written or spoken work', textMl: 'എഴുത്തോ സംസാരമോ ആവശ്യമായ പണികൾ', isCorrect: false, scoreValue: 0 },
        ],
    },

    // ===== INVESTIGATIVE (8 questions) =====
    {
        section: 'INVESTIGATIVE',
        text: 'You enjoy activities where you:',
        textMl: 'നിങ്ങൾക്ക് കൂടുതൽ താല്പര്യം തോന്നുക:',
        options: [
            { text: 'Find out why something happens', textMl: 'ഒരു കാര്യം എന്തുകൊണ്ടാണ് നടക്കുന്നത് എന്ന് അന്വേഷിച്ചു കണ്ടെത്താൻ', isCorrect: false, scoreValue: 1 },
            { text: 'Follow instructions given by others', textMl: 'മറ്റുള്ളവർ നൽകുന്ന നിർദ്ദേശങ്ങൾ പാലിക്കാൻ', isCorrect: false, scoreValue: 0 },
        ],
    },
    {
        section: 'INVESTIGATIVE',
        text: "When something doesn't work, you usually:",
        textMl: 'ഒരു സാധനം പ്രവർത്തിക്കുന്നില്ലെങ്കിൽ നിങ്ങൾ എന്ത് ചെയ്യും?',
        options: [
            { text: 'Try to understand the reason', textMl: 'അത് എന്തുകൊണ്ട് കേടായി എന്ന് ചിന്തിക്കും', isCorrect: false, scoreValue: 1 },
            { text: 'Ask someone else to fix it', textMl: 'മറ്റാരോടെങ്കിലും അത് ശരിയാക്കാൻ ആവശ്യപ്പെടും', isCorrect: false, scoreValue: 0 },
        ],
    },
    {
        section: 'INVESTIGATIVE',
        text: 'You like questions that:',
        textMl: 'എങ്ങനെയുള്ള ചോദ്യങ്ങളാണ് നിങ്ങൾക്കിഷ്ടം?',
        options: [
            { text: 'Make you think deeply', textMl: 'ആഴത്തിൽ ചിന്തിക്കാൻ പ്രേരിപ്പിക്കുന്നത്', isCorrect: false, scoreValue: 1 },
            { text: 'Have quick, direct answers', textMl: 'പെട്ടെന്ന് ഉത്തരം കിട്ടുന്ന ലളിതമായവ', isCorrect: false, scoreValue: 0 },
        ],
    },
    {
        section: 'INVESTIGATIVE',
        text: 'You can choose one task:',
        textMl: 'ഇതിൽ ഏത് ജോലി തിരഞ്ഞെടുക്കും?',
        options: [
            { text: 'Solving a puzzle or logical problem', textMl: 'ഒരു കടങ്കഥയോ ലോജിക് ആവശ്യമുള്ള പ്രശ്നമോ പരിഹരിക്കുന്നത്', isCorrect: false, scoreValue: 1 },
            { text: 'Decorating a classroom board', textMl: 'ക്ലാസ്സ് മുറി അലങ്കരിക്കുന്നത്', isCorrect: false, scoreValue: 0 },
        ],
    },
    {
        section: 'INVESTIGATIVE',
        text: 'In studies, you enjoy subjects where you:',
        textMl: 'പഠിക്കുമ്പോൾ നിങ്ങൾക്ക് കൂടുതൽ ഇഷ്ടം:',
        options: [
            { text: 'Analyze and understand concepts', textMl: 'കാര്യങ്ങൾ ആഴത്തിൽ മനസ്സിലാക്കി പഠിക്കാൻ', isCorrect: false, scoreValue: 1 },
            { text: 'Memorize and reproduce information', textMl: 'കാര്യങ്ങൾ കാണാപ്പാഠം പഠിച്ചു എഴുതാൻ', isCorrect: false, scoreValue: 0 },
        ],
    },
    {
        section: 'INVESTIGATIVE',
        text: 'Which feels more interesting?',
        textMl: 'ഇതിൽ ഏതാണ് നിങ്ങൾക്ക് കൂടുതൽ രസകരമായി തോന്നുന്നത്?',
        options: [
            { text: 'Doing experiments or investigations', textMl: 'പരീക്ഷണങ്ങൾ ചെയ്യുകയോ കാരണങ്ങൾ അന്വേഷിക്കുകയോ ചെയ്യുന്നത്', isCorrect: false, scoreValue: 1 },
            { text: 'Participating in group discussions', textMl: 'കൂട്ടുകാരോടൊപ്പമുള്ള ചർച്ചകളിൽ പങ്കെടുക്കുന്നത്', isCorrect: false, scoreValue: 0 },
        ],
    },
    {
        section: 'INVESTIGATIVE',
        text: 'Even if others find it boring, you enjoy:',
        textMl: 'മറ്റുള്ളവർക്ക് ബോറാണെന്ന് തോന്നിയാലും നിങ്ങൾക്കിഷ്ടം:',
        options: [
            { text: 'Spending time thinking about a problem', textMl: 'ഒരു പ്രശ്നത്തെക്കുറിച്ച് കുറേനേരം ചിന്തിച്ചിരിക്കുന്നത്', isCorrect: false, scoreValue: 1 },
            { text: 'Finishing tasks quickly and moving on', textMl: 'പണി വേഗം തീർത്ത് അടുത്തതിലേക്ക് പോകുന്നത്', isCorrect: false, scoreValue: 0 },
        ],
    },
    {
        section: 'INVESTIGATIVE',
        text: 'You prefer tasks where:',
        textMl: 'നിങ്ങൾക്ക് എങ്ങനെയുള്ള പണികളാണ് ഇഷ്ടം?',
        options: [
            { text: 'Answers are discovered step-by-step', textMl: 'ഓരോ ഘട്ടമായി ഉത്തരങ്ങൾ സ്വയം കണ്ടെത്തുന്നത്', isCorrect: false, scoreValue: 1 },
            { text: 'Answers are already clear', textMl: 'ഉത്തരം നേരത്തെ തന്നെ വ്യക്തമായ കാര്യങ്ങൾ ചെയ്യുന്നത്', isCorrect: false, scoreValue: 0 },
        ],
    },

    // ===== ARTISTIC (8 questions) =====
    {
        section: 'ARTISTIC',
        text: 'You enjoy activities like:',
        textMl: 'നിങ്ങൾക്ക് താല്പര്യം തോന്നുന്ന കാര്യങ്ങൾ:',
        options: [
            { text: 'Drawing, designing, or creating', textMl: 'ചിത്രം വരയ്ക്കുക, ഡിസൈൻ ചെയ്യുക, പുതിയതായി എന്തെങ്കിലും ഉണ്ടാക്കുക', isCorrect: false, scoreValue: 1 },
            { text: 'Following fixed rules', textMl: 'കൃത്യമായ നിയമങ്ങൾ അനുസരിച്ചു പണി എടുക്കുക', isCorrect: false, scoreValue: 0 },
        ],
    },
    {
        section: 'ARTISTIC',
        text: 'You like expressing ideas through:',
        textMl: 'ഐഡിയകൾ പ്രകടിപ്പിക്കാൻ നിങ്ങൾ ഏതാണ് ഇഷ്ടപ്പെടുക?',
        options: [
            { text: 'Art, writing, music, or visuals', textMl: 'കല, എഴുത്ത്, സംഗീതം അല്ലെങ്കിൽ ദൃശ്യങ്ങൾ', isCorrect: false, scoreValue: 1 },
            { text: 'Numbers or instructions', textMl: 'അക്കങ്ങൾ അല്ലെങ്കിൽ നിർദ്ദേശങ്ങൾ', isCorrect: false, scoreValue: 0 },
        ],
    },
    {
        section: 'ARTISTIC',
        text: 'In school events, you are more interested in:',
        textMl: 'സ്കൂൾ പരിപാടികളിൽ നിങ്ങൾക്കിഷ്ടം:',
        options: [
            { text: 'Creative roles', textMl: 'അവതരണം അല്ലെങ്കിൽ ക്രിയേറ്റീവ് ആയ കാര്യങ്ങൾ', isCorrect: false, scoreValue: 1 },
            { text: 'Organizing or managing roles', textMl: 'അത് നിയന്ത്രിക്കുകയോ പ്ലാൻ ചെയ്യുകയോ ചെയ്യുന്നത്', isCorrect: false, scoreValue: 0 },
        ],
    },
    {
        section: 'ARTISTIC',
        text: 'You can choose one task:',
        textMl: 'ഇതിൽ ഏത് ജോലി തിരഞ്ഞെടുക്കും?',
        options: [
            { text: 'Creating a story, design, or performance', textMl: 'കഥയോ ഡിസൈനോ അല്ലെങ്കിൽ ഒരു കലാപ്രകടനമോ തയ്യാറാക്കുന്നത്', isCorrect: false, scoreValue: 1 },
            { text: 'Preparing a timetable or list', textMl: 'ഒരു ടൈംടേബിളോ ലിസ്റ്റോ തയ്യാറാക്കുന്നത്', isCorrect: false, scoreValue: 0 },
        ],
    },
    {
        section: 'ARTISTIC',
        text: 'You prefer assignments that:',
        textMl: 'എങ്ങനെയുള്ള അസൈൻമെന്റുകളാണ് നിങ്ങൾക്കിഷ്ടം?',
        options: [
            { text: 'Allow personal expression', textMl: 'സ്വന്തം ഇഷ്ടത്തിനനുസരിച്ച് ചെയ്യാൻ കഴിയുന്നവ', isCorrect: false, scoreValue: 1 },
            { text: 'Have one correct format', textMl: 'ഒരു പ്രത്യേക രീതിയിൽ മാത്രം ചെയ്യേണ്ടവ', isCorrect: false, scoreValue: 0 },
        ],
    },
    {
        section: 'ARTISTIC',
        text: 'Which excites you more?',
        textMl: 'ഇതിൽ ഏതാണ് നിങ്ങൾക്ക് കൂടുതൽ ആവേശം നൽകുന്നത്?',
        options: [
            { text: 'Trying new creative ideas', textMl: 'പുതിയ പുതിയ ക്രിയേറ്റീവ് ഐഡിയകൾ പരീക്ഷിക്കുന്നത്', isCorrect: false, scoreValue: 1 },
            { text: 'Repeating a proven method', textMl: 'നേരത്തെ വിജയിച്ച രീതികൾ തന്നെ ചെയ്യുന്നത്', isCorrect: false, scoreValue: 0 },
        ],
    },
    {
        section: 'ARTISTIC',
        text: 'Even if marks are uncertain, you like tasks where you:',
        textMl: 'മാർക്ക് കിട്ടുമോ എന്ന് ഉറപ്പില്ലെങ്കിലും നിങ്ങൾക്ക് ഇഷ്ടം:',
        options: [
            { text: 'Express originality', textMl: 'പുതുമയുള്ള കാര്യങ്ങൾ സ്വന്തമായി ചെയ്യുന്നത്', isCorrect: false, scoreValue: 1 },
            { text: 'Follow clear instructions', textMl: 'വ്യക്തമായ നിർദ്ദേശങ്ങൾ അനുസരിക്കുന്നത്', isCorrect: false, scoreValue: 0 },
        ],
    },
    {
        section: 'ARTISTIC',
        text: 'You are comfortable when work is:',
        textMl: 'പണി ചെയ്യുമ്പോൾ എപ്പോഴാണ് നിങ്ങൾക്ക് കൂടുതൽ സന്തോഷം?',
        options: [
            { text: 'Open-ended and flexible', textMl: 'നമുക്ക് ഇഷ്ടമുള്ള പോലെ മാറ്റങ്ങൾ വരുത്താൻ കഴിയുമ്പോൾ', isCorrect: false, scoreValue: 1 },
            { text: 'Fixed and structured', textMl: 'കൃത്യമായ രീതി നിശ്ചയിച്ചിട്ടുള്ളപ്പോൾ', isCorrect: false, scoreValue: 0 },
        ],
    },

    // ===== SOCIAL (8 questions) =====
    {
        section: 'SOCIAL',
        text: 'You feel happy when you:',
        textMl: 'നിങ്ങൾക്ക് എപ്പോഴാണ് സന്തോഷം തോന്നുക?',
        options: [
            { text: 'Help someone understand something', textMl: 'ഒരാൾക്ക് ഒരു കാര്യം മനസ്സിലാക്കി കൊടുക്കുമ്പോൾ', isCorrect: false, scoreValue: 1 },
            { text: 'Finish work alone', textMl: 'ഒരു പണി തനിയെ ചെയ്തു തീരുമ്പോൾ', isCorrect: false, scoreValue: 0 },
        ],
    },
    {
        section: 'SOCIAL',
        text: 'Friends often come to you for:',
        textMl: 'കൂട്ടുകാർ സാധാരണ എന്തിനാണ് നിങ്ങളെ സമീപിക്കാറുള്ളത്?',
        options: [
            { text: 'Advice or support', textMl: 'ഉപദേശത്തിനോ സഹായത്തിനോ', isCorrect: false, scoreValue: 1 },
            { text: 'Sharing fun activities', textMl: 'തമാശകൾക്കും കളികൾക്കും', isCorrect: false, scoreValue: 0 },
        ],
    },
    {
        section: 'SOCIAL',
        text: 'You enjoy activities that involve:',
        textMl: 'നിങ്ങൾക്ക് ഇഷ്ടമുള്ള പ്രവർത്തനങ്ങൾ:',
        options: [
            { text: 'Working with people', textMl: 'ആളുകളുമായി ചേർന്ന് പണിയെടുക്കുന്നത്', isCorrect: false, scoreValue: 1 },
            { text: 'Working with things', textMl: 'സാധനങ്ങളോ മെഷീനുകളോ ഉപയോഗിച്ച് പണിയെടുക്കുന്നത്', isCorrect: false, scoreValue: 0 },
        ],
    },
    {
        section: 'SOCIAL',
        text: 'You can choose one role:',
        textMl: 'ഇതിൽ ഏത് റോൾ തിരഞ്ഞെടുക്കും?',
        options: [
            { text: 'Explaining topics to others', textMl: 'മറ്റുള്ളവർക്ക് കാര്യങ്ങൾ വിവരിച്ചു കൊടുക്കുന്നത്', isCorrect: false, scoreValue: 1 },
            { text: 'Completing tasks independently', textMl: 'സ്വന്തമായി ഉത്തരവാദിത്തങ്ങൾ തീർക്കുന്നത്', isCorrect: false, scoreValue: 0 },
        ],
    },
    {
        section: 'SOCIAL',
        text: 'You prefer group activities where you:',
        textMl: 'ഗ്രൂപ്പ് പ്രവർത്തനങ്ങളിൽ നിങ്ങൾക്കിഷ്ടം:',
        options: [
            { text: 'Support and guide others', textMl: 'മറ്റുള്ളവരെ സഹായിക്കുകയും അവർക്ക് വഴി കാണിക്കുകയും ചെയ്യുന്നത്', isCorrect: false, scoreValue: 1 },
            { text: 'Focus only on your part', textMl: 'എന്റെ പണിയിൽ മാത്രം ശ്രദ്ധ കേന്ദ്രീകരിക്കുന്നത്', isCorrect: false, scoreValue: 0 },
        ],
    },
    {
        section: 'SOCIAL',
        text: 'Which feels more meaningful?',
        textMl: 'ഇതിൽ ഏതാണ് നിങ്ങൾക്ക് കൂടുതൽ അർത്ഥവത്തായി തോന്നുന്നത്?',
        options: [
            { text: 'Helping someone improve', textMl: 'ഒരാളെ മെച്ചപ്പെടാൻ സഹായിക്കുന്നത്', isCorrect: false, scoreValue: 1 },
            { text: 'Achieving personal success', textMl: 'സ്വന്തം വിജയം നേടുന്നത്', isCorrect: false, scoreValue: 0 },
        ],
    },
    {
        section: 'SOCIAL',
        text: 'Even if it takes emotional effort, you like:',
        textMl: 'മനസ്സിന് കുറച്ച് പ്രയാസം തോന്നിയാലും നിങ്ങൾക്കിഷ്ടം:',
        options: [
            { text: 'Listening and supporting others', textMl: 'മറ്റുള്ളവരുടെ സങ്കടങ്ങൾ കേൾക്കാനും അവരെ ആശ്വസിപ്പിക്കാനും', isCorrect: false, scoreValue: 1 },
            { text: "Avoiding people's problems", textMl: 'മറ്റുള്ളവരുടെ പ്രശ്നങ്ങളിൽ നിന്ന് വിട്ടുനിൽക്കാൻ', isCorrect: false, scoreValue: 0 },
        ],
    },
    {
        section: 'SOCIAL',
        text: 'You feel satisfied when:',
        textMl: 'നിങ്ങൾക്ക് എപ്പോഴാണ് സംതൃപ്തി തോന്നുക?',
        options: [
            { text: 'Others benefit from your effort', textMl: 'നിങ്ങളുടെ പ്രയത്നം കൊണ്ട് മറ്റൊരാൾക്ക് ഉപകാരം ലഭിക്കുമ്പോൾ', isCorrect: false, scoreValue: 1 },
            { text: 'Tasks are completed quickly', textMl: 'പണികൾ പെട്ടെന്ന് തീർക്കുമ്പോൾ', isCorrect: false, scoreValue: 0 },
        ],
    },

    // ===== ENTERPRISING (8 questions) =====
    {
        section: 'ENTERPRISING',
        text: 'You like activities where you:',
        textMl: 'എങ്ങനെയുള്ള കാര്യങ്ങളാണ് നിങ്ങൾക്കിഷ്ടം?',
        options: [
            { text: 'Take initiative', textMl: 'മുന്നിൽ നിന്ന് കാര്യങ്ങൾ ചെയ്യാൻ', isCorrect: false, scoreValue: 1 },
            { text: 'Follow given plans', textMl: 'തന്നിട്ടുള്ള പ്ലാനുകൾ അനുസരിക്കാൻ', isCorrect: false, scoreValue: 0 },
        ],
    },
    {
        section: 'ENTERPRISING',
        text: 'In group work, you often:',
        textMl: 'ഒരു ഗ്രൂപ്പിൽ നിങ്ങൾ സാധാരണയായി:',
        options: [
            { text: 'Suggest ideas or directions', textMl: 'പുതിയ ഐഡിയകൾ പറയുകയോ മറ്റുള്ളവർക്ക് വഴി കാണിക്കുകയോ ചെയ്യുന്നു', isCorrect: false, scoreValue: 1 },
            { text: 'Wait for instructions', textMl: 'നിർദ്ദേശങ്ങൾക്കായി കാത്തുനിൽക്കുന്നു', isCorrect: false, scoreValue: 0 },
        ],
    },
    {
        section: 'ENTERPRISING',
        text: 'You enjoy convincing others about:',
        textMl: 'മറ്റുള്ളവരെ പറഞ്ഞു ബോധിപ്പിക്കാൻ നിങ്ങൾക്കിഷ്ടം:',
        options: [
            { text: 'Your ideas', textMl: 'നിങ്ങളുടെ ഐഡിയകൾ ശരിയാണെന്ന്', isCorrect: false, scoreValue: 1 },
            { text: 'Completed work', textMl: 'ചെയ്ത പണി നല്ലതാണെന്ന്', isCorrect: false, scoreValue: 0 },
        ],
    },
    {
        section: 'ENTERPRISING',
        text: 'You can choose one role:',
        textMl: 'ഇതിൽ ഏത് റോൾ തിരഞ്ഞെടുക്കും?',
        options: [
            { text: 'Coordinating people', textMl: 'ആളുകളെ ഏകോപിപ്പിച്ചു മുന്നോട്ട് പോകുന്നത്', isCorrect: false, scoreValue: 1 },
            { text: 'Completing assigned tasks', textMl: 'ഏല്പിച്ച പണികൾ മാത്രം തീർക്കുന്നത്', isCorrect: false, scoreValue: 0 },
        ],
    },
    {
        section: 'ENTERPRISING',
        text: 'You enjoy situations where you:',
        textMl: 'എങ്ങനെയുള്ള സാഹചര്യങ്ങളാണ് നിങ്ങൾക്കിഷ്ടപ്പെടുക?',
        options: [
            { text: 'Take responsibility', textMl: 'തീരുമാനങ്ങൾ എടുക്കാനുള്ള ചുമതല ഏറ്റെടുക്കുന്നത്', isCorrect: false, scoreValue: 1 },
            { text: 'Work without decision pressure', textMl: 'തീരുമാനങ്ങൾ എടുക്കേണ്ടി വരാത്ത ജോലി ചെയ്യുന്നത്', isCorrect: false, scoreValue: 0 },
        ],
    },
    {
        section: 'ENTERPRISING',
        text: 'Which excites you more?',
        textMl: 'ഇതിൽ ഏതാണ് നിങ്ങൾക്ക് കൂടുതൽ താല്പര്യം?',
        options: [
            { text: 'Starting something new', textMl: 'പുതിയതായി എന്തെങ്കിലും തുടങ്ങുന്നത്', isCorrect: false, scoreValue: 1 },
            { text: 'Maintaining existing systems', textMl: 'നിലവിലുള്ള രീതികൾ തന്നെ തുടർന്ന് പോകുന്നത്', isCorrect: false, scoreValue: 0 },
        ],
    },
    {
        section: 'ENTERPRISING',
        text: 'Even if there is risk of failure, you prefer:',
        textMl: 'പരാജയപ്പെട്ടേക്കാം എന്ന പേടിയുണ്ടെങ്കിലും നിങ്ങൾക്കിഷ്ടം:',
        options: [
            { text: 'Taking charge', textMl: 'കാര്യങ്ങളുടെ ചുമതല ഏറ്റെടുക്കാൻ', isCorrect: false, scoreValue: 1 },
            { text: 'Staying in a safe role', textMl: 'റിസ്കില്ലാത്ത പണികൾ ചെയ്യാൻ', isCorrect: false, scoreValue: 0 },
        ],
    },
    {
        section: 'ENTERPRISING',
        text: 'You feel motivated when you:',
        textMl: 'നിങ്ങൾക്ക് എപ്പോഴാണ് ആവേശം തോന്നുക?',
        options: [
            { text: 'Influence outcomes', textMl: 'കാര്യങ്ങൾ മാറ്റാൻ എനിക്ക് കഴിയുമെന്ന് തോന്നുമ്പോൾ', isCorrect: false, scoreValue: 1 },
            { text: 'Follow stable routines', textMl: 'പതിവ് രീതികൾ മാത്രം അനുസരിച്ചു പോകുമ്പോൾ', isCorrect: false, scoreValue: 0 },
        ],
    },

    // ===== CONVENTIONAL (8 questions) =====
    {
        section: 'CONVENTIONAL',
        text: 'You enjoy activities where you:',
        textMl: 'നിങ്ങൾക്ക് താല്പര്യം:',
        options: [
            { text: 'Organize things neatly', textMl: 'സാധനങ്ങൾ ഭംഗിയായി അടുക്കി വെക്കാൻ', isCorrect: false, scoreValue: 1 },
            { text: 'Work without structure', textMl: 'കൃത്യമായ നിയമങ്ങളില്ലാതെ പണിയെടുക്കാൻ', isCorrect: false, scoreValue: 0 },
        ],
    },
    {
        section: 'CONVENTIONAL',
        text: 'You prefer tasks that:',
        textMl: 'എങ്ങനെയുള്ള ജോലികളാണ് നിങ്ങൾക്കിഷ്ടം?',
        options: [
            { text: 'Have clear steps', textMl: 'കൃത്യമായ ഘട്ടങ്ങളുള്ളവ', isCorrect: false, scoreValue: 1 },
            { text: 'Change often', textMl: 'ഇടയ്ക്കിടെ മാറിക്കൊണ്ടിരിക്കുന്നവ', isCorrect: false, scoreValue: 0 },
        ],
    },
    {
        section: 'CONVENTIONAL',
        text: 'You like keeping track of:',
        textMl: 'കാര്യങ്ങൾ എങ്ങനെയുള്ള രീതിയിൽ രേഖപ്പെടുത്താനാണ് ഇഷ്ടം?',
        options: [
            { text: 'Details and records', textMl: 'വിശദാംശങ്ങളും കണക്കുകളും', isCorrect: false, scoreValue: 1 },
            { text: 'Big ideas only', textMl: 'പ്രധാന കാര്യങ്ങൾ മാത്രം', isCorrect: false, scoreValue: 0 },
        ],
    },
    {
        section: 'CONVENTIONAL',
        text: 'You can choose one task:',
        textMl: 'ഇതിൽ ഏത് പണി തിരഞ്ഞെടുക്കും?',
        options: [
            { text: 'Managing lists or schedules', textMl: 'ലിസ്റ്റുകൾ തയ്യാറാക്കുകയോ സമയം ക്രമീകരിക്കുകയോ ചെയ്യുന്നത്', isCorrect: false, scoreValue: 1 },
            { text: 'Creating new ideas', textMl: 'പുതിയ ഐഡിയകൾ ഉണ്ടാക്കുന്നത്', isCorrect: false, scoreValue: 0 },
        ],
    },
    {
        section: 'CONVENTIONAL',
        text: 'You feel comfortable when work is:',
        textMl: 'പണി ചെയ്യുമ്പോൾ എപ്പോഴാണ് സമാധാനം തോന്നുക?',
        options: [
            { text: 'Well-organized', textMl: 'നന്നായി പ്ലാൻ ചെയ്ത രീതിയിലാകുമ്പോൾ', isCorrect: false, scoreValue: 1 },
            { text: 'Flexible and open', textMl: 'എപ്പോൾ വേണമെങ്കിലും മാറ്റാൻ കഴിയുന്നതാകുമ്പോൾ', isCorrect: false, scoreValue: 0 },
        ],
    },
    {
        section: 'CONVENTIONAL',
        text: 'Which feels easier?',
        textMl: 'ഏതാണ് നിങ്ങൾക്ക് എളുപ്പമായി തോന്നുന്നത്?',
        options: [
            { text: 'Following systems', textMl: 'നിലവിലുള്ള രീതികൾ പിന്തുടരുന്നത്', isCorrect: false, scoreValue: 1 },
            { text: 'Creating systems', textMl: 'പുതിയ രീതികൾ ഉണ്ടാക്കുന്നത്', isCorrect: false, scoreValue: 0 },
        ],
    },
    {
        section: 'CONVENTIONAL',
        text: 'Even if it feels repetitive, you like:',
        textMl: 'ആവർത്തനപ്പണിയാണെങ്കിലും നിങ്ങൾക്കിഷ്ടം:',
        options: [
            { text: 'Order and accuracy', textMl: 'കൃത്യതയും അടുക്കും ചിട്ടയും', isCorrect: false, scoreValue: 1 },
            { text: 'Variety and change', textMl: 'വ്യത്യസ്തതയും മാറ്റങ്ങളും', isCorrect: false, scoreValue: 0 },
        ],
    },
    {
        section: 'CONVENTIONAL',
        text: 'You prefer environments where:',
        textMl: 'എങ്ങനെയുള്ള അന്തരീക്ഷമാണ് നിങ്ങൾക്കിഷ്ടം?',
        options: [
            { text: 'Rules are clear', textMl: 'നിയമങ്ങൾ വ്യക്തമായിട്ടുള്ള ഇടങ്ങൾ', isCorrect: false, scoreValue: 1 },
            { text: 'Rules are minimal', textMl: 'നിയമങ്ങൾ കുറവായ ഇടങ്ങൾ', isCorrect: false, scoreValue: 0 },
        ],
    },
];
