/**
 * RIASEC Career Interest Inventory (48 Questions)
 * Based on Holland's RIASEC Model
 * Scoring: Likert 1-4 (Strongly Dislike to Strongly Like)
 */

const riasecQuestions = [
    // REALISTIC (8 questions)
    {
        section: 'REALISTIC',
        text: 'I enjoy working with tools, equipment, or physical materials.',
        textMl: 'ഉപകരണങ്ങളോ മെഷീനുകളോ ഭൗതിക വസ്തുക്കളോ ഉപയോഗിച്ച് ജോലി ചെയ്യുന്നത് ഞാൻ ആസ്വദിക്കുന്നു.',
        options: [
            { text: 'Strongly Dislike', textMl: 'ഒട്ടും ഇഷ്ടമല്ല', isCorrect: false, scoreValue: 1 },
            { text: 'Dislike', textMl: 'ഇഷ്ടമല്ല', isCorrect: false, scoreValue: 2 },
            { text: 'Like', textMl: 'ഇഷ്ടമാണ്', isCorrect: false, scoreValue: 3 },
            { text: 'Strongly Like', textMl: 'വളരെ ഇഷ്ടമാണ്', isCorrect: false, scoreValue: 4 },
        ],
    },
    {
        section: 'REALISTIC',
        text: 'I like tasks that produce visible, tangible results.',
        textMl: 'കാണാവുന്ന, സ്പർശിക്കാവുന്ന ഫലങ്ങൾ ഉണ്ടാക്കുന്ന ജോലികൾ എനിക്കിഷ്ടമാണ്.',
        options: [
            { text: 'Strongly Dislike', textMl: 'ഒട്ടും ഇഷ്ടമല്ല', isCorrect: false, scoreValue: 1 },
            { text: 'Dislike', textMl: 'ഇഷ്ടമല്ല', isCorrect: false, scoreValue: 2 },
            { text: 'Like', textMl: 'ഇഷ്ടമാണ്', isCorrect: false, scoreValue: 3 },
            { text: 'Strongly Like', textMl: 'വളരെ ഇഷ്ടമാണ്', isCorrect: false, scoreValue: 4 },
        ],
    },
    {
        section: 'REALISTIC',
        text: 'I prefer outdoor work or fieldwork over desk jobs.',
        textMl: 'ഓഫീസ് ജോലിയേക്കാൾ പുറത്തെ ജോലിയോ ഫീൽഡ് ജോലിയോ ആണ് എനിക്കിഷ്ടം.',
        options: [
            { text: 'Strongly Dislike', textMl: 'ഒട്ടും ഇഷ്ടമല്ല', isCorrect: false, scoreValue: 1 },
            { text: 'Dislike', textMl: 'ഇഷ്ടമല്ല', isCorrect: false, scoreValue: 2 },
            { text: 'Like', textMl: 'ഇഷ്ടമാണ്', isCorrect: false, scoreValue: 3 },
            { text: 'Strongly Like', textMl: 'വളരെ ഇഷ്ടമാണ്', isCorrect: false, scoreValue: 4 },
        ],
    },
    {
        section: 'REALISTIC',
        text: 'I feel comfortable fixing or repairing things.',
        textMl: 'വസ്തുക്കൾ നന്നാക്കുന്നതിലോ റിപ്പയർ ചെയ്യുന്നതിലോ എനിക്ക് സൌകര്യമുണ്ട്.',
        options: [
            { text: 'Strongly Dislike', textMl: 'ഒട്ടും ഇഷ്ടമല്ല', isCorrect: false, scoreValue: 1 },
            { text: 'Dislike', textMl: 'ഇഷ്ടമല്ല', isCorrect: false, scoreValue: 2 },
            { text: 'Like', textMl: 'ഇഷ്ടമാണ്', isCorrect: false, scoreValue: 3 },
            { text: 'Strongly Like', textMl: 'വളരെ ഇഷ്ടമാണ്', isCorrect: false, scoreValue: 4 },
        ],
    },
    {
        section: 'REALISTIC',
        text: 'I enjoy physical activity as part of my work.',
        textMl: 'ജോലിയുടെ ഭാഗമായി ശാരീരിക പ്രവർത്തനം എനിക്കിഷ്ടമാണ്.',
        options: [
            { text: 'Strongly Dislike', textMl: 'ഒട്ടും ഇഷ്ടമല്ല', isCorrect: false, scoreValue: 1 },
            { text: 'Dislike', textMl: 'ഇഷ്ടമല്ല', isCorrect: false, scoreValue: 2 },
            { text: 'Like', textMl: 'ഇഷ്ടമാണ്', isCorrect: false, scoreValue: 3 },
            { text: 'Strongly Like', textMl: 'വളരെ ഇഷ്ടമാണ്', isCorrect: false, scoreValue: 4 },
        ],
    },
    {
        section: 'REALISTIC',
        text: 'I like to work with machines, vehicles, or technical equipment.',
        textMl: 'മെഷീനുകൾ, വാഹനങ്ങൾ, അല്ലെങ്കിൽ സാങ്കേതിക ഉപകരണങ്ങൾ കൊണ്ട് ജോലി ചെയ്യാൻ എനിക്കിഷ്ടമാണ്.',
        options: [
            { text: 'Strongly Dislike', textMl: 'ഒട്ടും ഇഷ്ടമല്ല', isCorrect: false, scoreValue: 1 },
            { text: 'Dislike', textMl: 'ഇഷ്ടമല്ല', isCorrect: false, scoreValue: 2 },
            { text: 'Like', textMl: 'ഇഷ്ടമാണ്', isCorrect: false, scoreValue: 3 },
            { text: 'Strongly Like', textMl: 'വളരെ ഇഷ്ടമാണ്', isCorrect: false, scoreValue: 4 },
        ],
    },
    {
        section: 'REALISTIC',
        text: 'I would enjoy building, assembling, or installing things.',
        textMl: 'വസ്തുക്കൾ നിർമ്മിക്കുന്നതോ കൂട്ടിച്ചേർക്കുന്നതോ ഇൻസ്റ്റാൾ ചെയ്യുന്നതോ എനിക്കിഷ്ടമാണ്.',
        options: [
            { text: 'Strongly Dislike', textMl: 'ഒട്ടും ഇഷ്ടമല്ല', isCorrect: false, scoreValue: 1 },
            { text: 'Dislike', textMl: 'ഇഷ്ടമല്ല', isCorrect: false, scoreValue: 2 },
            { text: 'Like', textMl: 'ഇഷ്ടമാണ്', isCorrect: false, scoreValue: 3 },
            { text: 'Strongly Like', textMl: 'വളരെ ഇഷ്ടമാണ്', isCorrect: false, scoreValue: 4 },
        ],
    },
    {
        section: 'REALISTIC',
        text: 'I prefer practical learning over theoretical learning.',
        textMl: 'സൈദ്ധാന്തിക പഠനത്തേക്കാൾ പ്രായോഗിക പഠനമാണ് എനിക്കിഷ്ടം.',
        options: [
            { text: 'Strongly Dislike', textMl: 'ഒട്ടും ഇഷ്ടമല്ല', isCorrect: false, scoreValue: 1 },
            { text: 'Dislike', textMl: 'ഇഷ്ടമല്ല', isCorrect: false, scoreValue: 2 },
            { text: 'Like', textMl: 'ഇഷ്ടമാണ്', isCorrect: false, scoreValue: 3 },
            { text: 'Strongly Like', textMl: 'വളരെ ഇഷ്ടമാണ്', isCorrect: false, scoreValue: 4 },
        ],
    },

    // INVESTIGATIVE (8 questions)
    {
        section: 'INVESTIGATIVE',
        text: 'I enjoy solving complex problems through logical thinking.',
        textMl: 'യുക്തിപരമായ ചിന്തയിലൂടെ സങ്കീർണ്ണ പ്രശ്നങ്ങൾ പരിഹരിക്കുന്നത് എനിക്കിഷ്ടമാണ്.',
        options: [
            { text: 'Strongly Dislike', textMl: 'ഒട്ടും ഇഷ്ടമല്ല', isCorrect: false, scoreValue: 1 },
            { text: 'Dislike', textMl: 'ഇഷ്ടമല്ല', isCorrect: false, scoreValue: 2 },
            { text: 'Like', textMl: 'ഇഷ്ടമാണ്', isCorrect: false, scoreValue: 3 },
            { text: 'Strongly Like', textMl: 'വളരെ ഇഷ്ടമാണ്', isCorrect: false, scoreValue: 4 },
        ],
    },
    {
        section: 'INVESTIGATIVE',
        text: 'I like to analyze data or information before making decisions.',
        textMl: 'തീരുമാനങ്ങൾ എടുക്കുന്നതിന് മുമ്പ് ഡാറ്റയോ വിവരങ്ങളോ വിശകലനം ചെയ്യാൻ എനിക്കിഷ്ടമാണ്.',
        options: [
            { text: 'Strongly Dislike', textMl: 'ഒട്ടും ഇഷ്ടമല്ല', isCorrect: false, scoreValue: 1 },
            { text: 'Dislike', textMl: 'ഇഷ്ടമല്ല', isCorrect: false, scoreValue: 2 },
            { text: 'Like', textMl: 'ഇഷ്ടമാണ്', isCorrect: false, scoreValue: 3 },
            { text: 'Strongly Like', textMl: 'വളരെ ഇഷ്ടമാണ്', isCorrect: false, scoreValue: 4 },
        ],
    },
    {
        section: 'INVESTIGATIVE',
        text: 'I am curious about how things work.',
        textMl: 'കാര്യങ്ങൾ എങ്ങനെ പ്രവർത്തിക്കുന്നുവെന്ന് അറിയാൻ എനിക്ക് താൽപര്യമുണ്ട്.',
        options: [
            { text: 'Strongly Dislike', textMl: 'ഒട്ടും ഇഷ്ടമല്ല', isCorrect: false, scoreValue: 1 },
            { text: 'Dislike', textMl: 'ഇഷ്ടമല്ല', isCorrect: false, scoreValue: 2 },
            { text: 'Like', textMl: 'ഇഷ്ടമാണ്', isCorrect: false, scoreValue: 3 },
            { text: 'Strongly Like', textMl: 'വളരെ ഇഷ്ടമാണ്', isCorrect: false, scoreValue: 4 },
        ],
    },
    {
        section: 'INVESTIGATIVE',
        text: 'I enjoy reading, researching, or studying new subjects.',
        textMl: 'പുതിയ വിഷയങ്ങൾ വായിക്കാനും ഗവേഷണം ചെയ്യാനും പഠിക്കാനും എനിക്കിഷ്ടമാണ്.',
        options: [
            { text: 'Strongly Dislike', textMl: 'ഒട്ടും ഇഷ്ടമല്ല', isCorrect: false, scoreValue: 1 },
            { text: 'Dislike', textMl: 'ഇഷ്ടമല്ല', isCorrect: false, scoreValue: 2 },
            { text: 'Like', textMl: 'ഇഷ്ടമാണ്', isCorrect: false, scoreValue: 3 },
            { text: 'Strongly Like', textMl: 'വളരെ ഇഷ്ടമാണ്', isCorrect: false, scoreValue: 4 },
        ],
    },
    {
        section: 'INVESTIGATIVE',
        text: 'I prefer working independently on tasks that require thinking.',
        textMl: 'ചിന്ത ആവശ്യമുള്ള ജോലികൾ സ്വതന്ത്രമായി ചെയ്യാനാണ് എനിക്കിഷ്ടം.',
        options: [
            { text: 'Strongly Dislike', textMl: 'ഒട്ടും ഇഷ്ടമല്ല', isCorrect: false, scoreValue: 1 },
            { text: 'Dislike', textMl: 'ഇഷ്ടമല്ല', isCorrect: false, scoreValue: 2 },
            { text: 'Like', textMl: 'ഇഷ്ടമാണ്', isCorrect: false, scoreValue: 3 },
            { text: 'Strongly Like', textMl: 'വളരെ ഇഷ്ടമാണ്', isCorrect: false, scoreValue: 4 },
        ],
    },
    {
        section: 'INVESTIGATIVE',
        text: 'I like exploring scientific or technical subjects.',
        textMl: 'ശാസ്ത്രീയ അല്ലെങ്കിൽ സാങ്കേതിക വിഷയങ്ങൾ പര്യവേക്ഷണം ചെയ്യാൻ എനിക്കിഷ്ടമാണ്.',
        options: [
            { text: 'Strongly Dislike', textMl: 'ഒട്ടും ഇഷ്ടമല്ല', isCorrect: false, scoreValue: 1 },
            { text: 'Dislike', textMl: 'ഇഷ്ടമല്ല', isCorrect: false, scoreValue: 2 },
            { text: 'Like', textMl: 'ഇഷ്ടമാണ്', isCorrect: false, scoreValue: 3 },
            { text: 'Strongly Like', textMl: 'വളരെ ഇഷ്ടമാണ്', isCorrect: false, scoreValue: 4 },
        ],
    },
    {
        section: 'INVESTIGATIVE',
        text: 'I would enjoy investigating data patterns or trends.',
        textMl: 'ഡാറ്റ പാറ്റേണുകളോ ട്രെൻഡുകളോ അന്വേഷിക്കുന്നത് എനിക്കിഷ്ടമാകും.',
        options: [
            { text: 'Strongly Dislike', textMl: 'ഒട്ടും ഇഷ്ടമല്ല', isCorrect: false, scoreValue: 1 },
            { text: 'Dislike', textMl: 'ഇഷ്ടമല്ല', isCorrect: false, scoreValue: 2 },
            { text: 'Like', textMl: 'ഇഷ്ടമാണ്', isCorrect: false, scoreValue: 3 },
            { text: 'Strongly Like', textMl: 'വളരെ ഇഷ്ടമാണ്', isCorrect: false, scoreValue: 4 },
        ],
    },
    {
        section: 'INVESTIGATIVE',
        text: 'I like understanding the "why" behind rules or systems.',
        textMl: 'നിയമങ്ങളുടെയോ സിസ്റ്റങ്ങളുടെയോ പിന്നിലെ "എന്തുകൊണ്ട്" മനസ്സിലാക്കാൻ എനിക്കിഷ്ടമാണ്.',
        options: [
            { text: 'Strongly Dislike', textMl: 'ഒട്ടും ഇഷ്ടമല്ല', isCorrect: false, scoreValue: 1 },
            { text: 'Dislike', textMl: 'ഇഷ്ടമല്ല', isCorrect: false, scoreValue: 2 },
            { text: 'Like', textMl: 'ഇഷ്ടമാണ്', isCorrect: false, scoreValue: 3 },
            { text: 'Strongly Like', textMl: 'വളരെ ഇഷ്ടമാണ്', isCorrect: false, scoreValue: 4 },
        ],
    },

    // ARTISTIC (8 questions)
    {
        section: 'ARTISTIC',
        text: 'I enjoy expressing myself through creative activities.',
        textMl: 'സർഗ്ഗാത്മക പ്രവർത്തനങ്ങളിലൂടെ എന്നെത്തന്നെ പ്രകടിപ്പിക്കാൻ എനിക്കിഷ്ടമാണ്.',
        options: [
            { text: 'Strongly Dislike', textMl: 'ഒട്ടും ഇഷ്ടമല്ല', isCorrect: false, scoreValue: 1 },
            { text: 'Dislike', textMl: 'ഇഷ്ടമല്ല', isCorrect: false, scoreValue: 2 },
            { text: 'Like', textMl: 'ഇഷ്ടമാണ്', isCorrect: false, scoreValue: 3 },
            { text: 'Strongly Like', textMl: 'വളരെ ഇഷ്ടമാണ്', isCorrect: false, scoreValue: 4 },
        ],
    },
    {
        section: 'ARTISTIC',
        text: 'I like to work without strict rules or procedures.',
        textMl: 'കർശനമായ നിയമങ്ങളോ നടപടിക്രമങ്ങളോ ഇല്ലാതെ ജോലി ചെയ്യാൻ എനിക്കിഷ്ടമാണ്.',
        options: [
            { text: 'Strongly Dislike', textMl: 'ഒട്ടും ഇഷ്ടമല്ല', isCorrect: false, scoreValue: 1 },
            { text: 'Dislike', textMl: 'ഇഷ്ടമല്ല', isCorrect: false, scoreValue: 2 },
            { text: 'Like', textMl: 'ഇഷ്ടമാണ്', isCorrect: false, scoreValue: 3 },
            { text: 'Strongly Like', textMl: 'വളരെ ഇഷ്ടമാണ്', isCorrect: false, scoreValue: 4 },
        ],
    },
    {
        section: 'ARTISTIC',
        text: 'I enjoy designing, writing, or visual arts.',
        textMl: 'ഡിസൈനിംഗ്, എഴുത്ത്, അല്ലെങ്കിൽ വിഷ്വൽ ആർട്സ് എനിക്കിഷ്ടമാണ്.',
        options: [
            { text: 'Strongly Dislike', textMl: 'ഒട്ടും ഇഷ്ടമല്ല', isCorrect: false, scoreValue: 1 },
            { text: 'Dislike', textMl: 'ഇഷ്ടമല്ല', isCorrect: false, scoreValue: 2 },
            { text: 'Like', textMl: 'ഇഷ്ടമാണ്', isCorrect: false, scoreValue: 3 },
            { text: 'Strongly Like', textMl: 'വളരെ ഇഷ്ടമാണ്', isCorrect: false, scoreValue: 4 },
        ],
    },
    {
        section: 'ARTISTIC',
        text: 'I prefer flexible work environments over rigid ones.',
        textMl: 'കർശനമായ അന്തരീക്ഷത്തേക്കാൾ വഴക്കമുള്ള ജോലി അന്തരീക്ഷമാണ് എനിക്കിഷ്ടം.',
        options: [
            { text: 'Strongly Dislike', textMl: 'ഒട്ടും ഇഷ്ടമല്ല', isCorrect: false, scoreValue: 1 },
            { text: 'Dislike', textMl: 'ഇഷ്ടമല്ല', isCorrect: false, scoreValue: 2 },
            { text: 'Like', textMl: 'ഇഷ്ടമാണ്', isCorrect: false, scoreValue: 3 },
            { text: 'Strongly Like', textMl: 'വളരെ ഇഷ്ടമാണ്', isCorrect: false, scoreValue: 4 },
        ],
    },
    {
        section: 'ARTISTIC',
        text: 'I enjoy creating original ideas or concepts.',
        textMl: 'യഥാർത്ഥ ആശയങ്ങളോ ആശയങ്ങളോ സൃഷ്ടിക്കാൻ എനിക്കിഷ്ടമാണ്.',
        options: [
            { text: 'Strongly Dislike', textMl: 'ഒട്ടും ഇഷ്ടമല്ല', isCorrect: false, scoreValue: 1 },
            { text: 'Dislike', textMl: 'ഇഷ്ടമല്ല', isCorrect: false, scoreValue: 2 },
            { text: 'Like', textMl: 'ഇഷ്ടമാണ്', isCorrect: false, scoreValue: 3 },
            { text: 'Strongly Like', textMl: 'വളരെ ഇഷ്ടമാണ്', isCorrect: false, scoreValue: 4 },
        ],
    },
    {
        section: 'ARTISTIC',
        text: 'I like activities like photography, music, or dance.',
        textMl: 'ഫോട്ടോഗ്രഫി, സംഗീതം, അല്ലെങ്കിൽ നൃത്തം പോലുള്ള പ്രവർത്തനങ്ങൾ എനിക്കിഷ്ടമാണ്.',
        options: [
            { text: 'Strongly Dislike', textMl: 'ഒട്ടും ഇഷ്ടമല്ല', isCorrect: false, scoreValue: 1 },
            { text: 'Dislike', textMl: 'ഇഷ്ടമല്ല', isCorrect: false, scoreValue: 2 },
            { text: 'Like', textMl: 'ഇഷ്ടമാണ്', isCorrect: false, scoreValue: 3 },
            { text: 'Strongly Like', textMl: 'വളരെ ഇഷ്ടമാണ്', isCorrect: false, scoreValue: 4 },
        ],
    },
    {
        section: 'ARTISTIC',
        text: 'I appreciate beauty or aesthetics in my surroundings.',
        textMl: 'എന്റെ ചുറ്റുപാടിലെ സൗന്ദര്യമോ സൗന്ദര്യശാസ്ത്രമോ ഞാൻ വിലമതിക്കുന്നു.',
        options: [
            { text: 'Strongly Dislike', textMl: 'ഒട്ടും ഇഷ്ടമല്ല', isCorrect: false, scoreValue: 1 },
            { text: 'Dislike', textMl: 'ഇഷ്ടമല്ല', isCorrect: false, scoreValue: 2 },
            { text: 'Like', textMl: 'ഇഷ്ടമാണ്', isCorrect: false, scoreValue: 3 },
            { text: 'Strongly Like', textMl: 'വളരെ ഇഷ്ടമാണ്', isCorrect: false, scoreValue: 4 },
        ],
    },
    {
        section: 'ARTISTIC',
        text: 'I would enjoy working in a creative or cultural industry.',
        textMl: 'ഒരു സർഗ്ഗാത്മക അല്ലെങ്കിൽ സാംസ്കാരിക വ്യവസായത്തിൽ ജോലി ചെയ്യാൻ എനിക്കിഷ്ടമാകും.',
        options: [
            { text: 'Strongly Dislike', textMl: 'ഒട്ടും ഇഷ്ടമല്ല', isCorrect: false, scoreValue: 1 },
            { text: 'Dislike', textMl: 'ഇഷ്ടമല്ല', isCorrect: false, scoreValue: 2 },
            { text: 'Like', textMl: 'ഇഷ്ടമാണ്', isCorrect: false, scoreValue: 3 },
            { text: 'Strongly Like', textMl: 'വളരെ ഇഷ്ടമാണ്', isCorrect: false, scoreValue: 4 },
        ],
    },
];

export { riasecQuestions };
