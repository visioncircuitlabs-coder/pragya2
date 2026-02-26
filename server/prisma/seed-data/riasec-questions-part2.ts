/**
 * RIASEC Part 2: Social, Enterprising, Conventional (24 Questions)
 */

const riasecQuestionsPart2 = [
    // SOCIAL (8 questions)
    {
        section: 'SOCIAL',
        text: 'I enjoy helping others solve their problems.',
        textMl: 'മറ്റുള്ളവരുടെ പ്രശ്നങ്ങൾ പരിഹരിക്കാൻ സഹായിക്കുന്നത് എനിക്കിഷ്ടമാണ്.',
        options: [
            { text: 'Strongly Dislike', textMl: 'ഒട്ടും ഇഷ്ടമല്ല', isCorrect: false, scoreValue: 1 },
            { text: 'Dislike', textMl: 'ഇഷ്ടമല്ല', isCorrect: false, scoreValue: 2 },
            { text: 'Like', textMl: 'ഇഷ്ടമാണ്', isCorrect: false, scoreValue: 3 },
            { text: 'Strongly Like', textMl: 'വളരെ ഇഷ്ടമാണ്', isCorrect: false, scoreValue: 4 },
        ],
    },
    {
        section: 'SOCIAL',
        text: 'I like working closely with people rather than things.',
        textMl: 'വസ്തുക്കളേക്കാൾ ആളുകളുമായി അടുത്ത് പ്രവർത്തിക്കാനാണ് എനിക്കിഷ്ടം.',
        options: [
            { text: 'Strongly Dislike', textMl: 'ഒട്ടും ഇഷ്ടമല്ല', isCorrect: false, scoreValue: 1 },
            { text: 'Dislike', textMl: 'ഇഷ്ടമല്ല', isCorrect: false, scoreValue: 2 },
            { text: 'Like', textMl: 'ഇഷ്ടമാണ്', isCorrect: false, scoreValue: 3 },
            { text: 'Strongly Like', textMl: 'വളരെ ഇഷ്ടമാണ്', isCorrect: false, scoreValue: 4 },
        ],
    },
    {
        section: 'SOCIAL',
        text: 'I enjoy teaching, training, or guiding others.',
        textMl: 'മറ്റുള്ളവരെ പഠിപ്പിക്കാനോ പരിശീലിപ്പിക്കാനോ മാർഗ്ഗനിർദ്ദേശം നൽകാനോ എനിക്കിഷ്ടമാണ്.',
        options: [
            { text: 'Strongly Dislike', textMl: 'ഒട്ടും ഇഷ്ടമല്ല', isCorrect: false, scoreValue: 1 },
            { text: 'Dislike', textMl: 'ഇഷ്ടമല്ല', isCorrect: false, scoreValue: 2 },
            { text: 'Like', textMl: 'ഇഷ്ടമാണ്', isCorrect: false, scoreValue: 3 },
            { text: 'Strongly Like', textMl: 'വളരെ ഇഷ്ടമാണ്', isCorrect: false, scoreValue: 4 },
        ],
    },
    {
        section: 'SOCIAL',
        text: 'I feel satisfied when I help someone improve.',
        textMl: 'ആരെയെങ്കിലും മെച്ചപ്പെടാൻ സഹായിക്കുമ്പോൾ എനിക്ക് സംതൃപ്തി തോന്നുന്നു.',
        options: [
            { text: 'Strongly Dislike', textMl: 'ഒട്ടും ഇഷ്ടമല്ല', isCorrect: false, scoreValue: 1 },
            { text: 'Dislike', textMl: 'ഇഷ്ടമല്ല', isCorrect: false, scoreValue: 2 },
            { text: 'Like', textMl: 'ഇഷ്ടമാണ്', isCorrect: false, scoreValue: 3 },
            { text: 'Strongly Like', textMl: 'വളരെ ഇഷ്ടമാണ്', isCorrect: false, scoreValue: 4 },
        ],
    },
    {
        section: 'SOCIAL',
        text: 'I am comfortable interacting with strangers.',
        textMl: 'അപരിചിതരുമായി ഇടപഴകുന്നത് എനിക്ക് സുഖമാണ്.',
        options: [
            { text: 'Strongly Dislike', textMl: 'ഒട്ടും ഇഷ്ടമല്ല', isCorrect: false, scoreValue: 1 },
            { text: 'Dislike', textMl: 'ഇഷ്ടമല്ല', isCorrect: false, scoreValue: 2 },
            { text: 'Like', textMl: 'ഇഷ്ടമാണ്', isCorrect: false, scoreValue: 3 },
            { text: 'Strongly Like', textMl: 'വളരെ ഇഷ്ടമാണ്', isCorrect: false, scoreValue: 4 },
        ],
    },
    {
        section: 'SOCIAL',
        text: 'I enjoy working in healthcare, education, or social services.',
        textMl: 'ആരോഗ്യ സേവനം, വിദ്യാഭ്യാസം, അല്ലെങ്കിൽ സാമൂഹിക സേവനങ്ങളിൽ പ്രവർത്തിക്കാൻ എനിക്കിഷ്ടമാണ്.',
        options: [
            { text: 'Strongly Dislike', textMl: 'ഒട്ടും ഇഷ്ടമല്ല', isCorrect: false, scoreValue: 1 },
            { text: 'Dislike', textMl: 'ഇഷ്ടമല്ല', isCorrect: false, scoreValue: 2 },
            { text: 'Like', textMl: 'ഇഷ്ടമാണ്', isCorrect: false, scoreValue: 3 },
            { text: 'Strongly Like', textMl: 'വളരെ ഇഷ്ടമാണ്', isCorrect: false, scoreValue: 4 },
        ],
    },
    {
        section: 'SOCIAL',
        text: 'I like roles that involve counseling or advising people.',
        textMl: 'ആളുകളെ കൌൺസിലിംഗ് ചെയ്യുകയോ ഉപദേശിക്കുകയോ ചെയ്യുന്ന റോളുകൾ എനിക്കിഷ്ടമാണ്.',
        options: [
            { text: 'Strongly Dislike', textMl: 'ഒട്ടും ഇഷ്ടമല്ല', isCorrect: false, scoreValue: 1 },
            { text: 'Dislike', textMl: 'ഇഷ്ടമല്ല', isCorrect: false, scoreValue: 2 },
            { text: 'Like', textMl: 'ഇഷ്ടമാണ്', isCorrect: false, scoreValue: 3 },
            { text: 'Strongly Like', textMl: 'വളരെ ഇഷ്ടമാണ്', isCorrect: false, scoreValue: 4 },
        ],
    },
    {
        section: 'SOCIAL',
        text: 'I prefer teamwork over individual contributions.',
        textMl: 'വ്യക്തിഗത സംഭാവനകളേക്കാൾ ടീംവർക്ക് ആണ് എനിക്കിഷ്ടം.',
        options: [
            { text: 'Strongly Dislike', textMl: 'ഒട്ടും ഇഷ്ടമല്ല', isCorrect: false, scoreValue: 1 },
            { text: 'Dislike', textMl: 'ഇഷ്ടമല്ല', isCorrect: false, scoreValue: 2 },
            { text: 'Like', textMl: 'ഇഷ്ടമാണ്', isCorrect: false, scoreValue: 3 },
            { text: 'Strongly Like', textMl: 'വളരെ ഇഷ്ടമാണ്', isCorrect: false, scoreValue: 4 },
        ],
    },

    // ENTERPRISING (8 questions)
    {
        section: 'ENTERPRISING',
        text: 'I like persuading or influencing others.',
        textMl: 'മറ്റുള്ളവരെ പ്രേരിപ്പിക്കാനോ സ്വാധീനിക്കാനോ എനിക്കിഷ്ടമാണ്.',
        options: [
            { text: 'Strongly Dislike', textMl: 'ഒട്ടും ഇഷ്ടമല്ല', isCorrect: false, scoreValue: 1 },
            { text: 'Dislike', textMl: 'ഇഷ്ടമല്ല', isCorrect: false, scoreValue: 2 },
            { text: 'Like', textMl: 'ഇഷ്ടമാണ്', isCorrect: false, scoreValue: 3 },
            { text: 'Strongly Like', textMl: 'വളരെ ഇഷ്ടമാണ്', isCorrect: false, scoreValue: 4 },
        ],
    },
    {
        section: 'ENTERPRISING',
        text: 'I enjoy taking on leadership roles.',
        textMl: 'നേതൃത്വ റോളുകൾ ഏറ്റെടുക്കാൻ എനിക്കിഷ്ടമാണ്.',
        options: [
            { text: 'Strongly Dislike', textMl: 'ഒട്ടും ഇഷ്ടമല്ല', isCorrect: false, scoreValue: 1 },
            { text: 'Dislike', textMl: 'ഇഷ്ടമല്ല', isCorrect: false, scoreValue: 2 },
            { text: 'Like', textMl: 'ഇഷ്ടമാണ്', isCorrect: false, scoreValue: 3 },
            { text: 'Strongly Like', textMl: 'വളരെ ഇഷ്ടമാണ്', isCorrect: false, scoreValue: 4 },
        ],
    },
    {
        section: 'ENTERPRISING',
        text: 'I am comfortable speaking in front of a group.',
        textMl: 'ഒരു ഗ്രൂപ്പിന് മുന്നിൽ സംസാരിക്കുന്നത് എനിക്ക് സുഖമാണ്.',
        options: [
            { text: 'Strongly Dislike', textMl: 'ഒട്ടും ഇഷ്ടമല്ല', isCorrect: false, scoreValue: 1 },
            { text: 'Dislike', textMl: 'ഇഷ്ടമല്ല', isCorrect: false, scoreValue: 2 },
            { text: 'Like', textMl: 'ഇഷ്ടമാണ്', isCorrect: false, scoreValue: 3 },
            { text: 'Strongly Like', textMl: 'വളരെ ഇഷ്ടമാണ്', isCorrect: false, scoreValue: 4 },
        ],
    },
    {
        section: 'ENTERPRISING',
        text: 'I enjoy selling products, services, or ideas.',
        textMl: 'ഉൽപ്പന്നങ്ങൾ, സേവനങ്ങൾ, അല്ലെങ്കിൽ ആശയങ്ങൾ വിൽക്കുന്നത് എനിക്കിഷ്ടമാണ്.',
        options: [
            { text: 'Strongly Dislike', textMl: 'ഒട്ടും ഇഷ്ടമല്ല', isCorrect: false, scoreValue: 1 },
            { text: 'Dislike', textMl: 'ഇഷ്ടമല്ല', isCorrect: false, scoreValue: 2 },
            { text: 'Like', textMl: 'ഇഷ്ടമാണ്', isCorrect: false, scoreValue: 3 },
            { text: 'Strongly Like', textMl: 'വളരെ ഇഷ്ടമാണ്', isCorrect: false, scoreValue: 4 },
        ],
    },
    {
        section: 'ENTERPRISING',
        text: 'I would enjoy running my own business.',
        textMl: 'എന്റെ സ്വന്തം ബിസിനസ്സ് നടത്താൻ എനിക്കിഷ്ടമാകും.',
        options: [
            { text: 'Strongly Dislike', textMl: 'ഒട്ടും ഇഷ്ടമല്ല', isCorrect: false, scoreValue: 1 },
            { text: 'Dislike', textMl: 'ഇഷ്ടമല്ല', isCorrect: false, scoreValue: 2 },
            { text: 'Like', textMl: 'ഇഷ്ടമാണ്', isCorrect: false, scoreValue: 3 },
            { text: 'Strongly Like', textMl: 'വളരെ ഇഷ്ടമാണ്', isCorrect: false, scoreValue: 4 },
        ],
    },
    {
        section: 'ENTERPRISING',
        text: 'I like making quick decisions in fast-paced environments.',
        textMl: 'വേഗതയേറിയ അന്തരീക്ഷങ്ങളിൽ വേഗത്തിൽ തീരുമാനങ്ങൾ എടുക്കാൻ എനിക്കിഷ്ടമാണ്.',
        options: [
            { text: 'Strongly Dislike', textMl: 'ഒട്ടും ഇഷ്ടമല്ല', isCorrect: false, scoreValue: 1 },
            { text: 'Dislike', textMl: 'ഇഷ്ടമല്ല', isCorrect: false, scoreValue: 2 },
            { text: 'Like', textMl: 'ഇഷ്ടമാണ്', isCorrect: false, scoreValue: 3 },
            { text: 'Strongly Like', textMl: 'വളരെ ഇഷ്ടമാണ്', isCorrect: false, scoreValue: 4 },
        ],
    },
    {
        section: 'ENTERPRISING',
        text: 'I enjoy negotiating or making deals.',
        textMl: 'ചർച്ച ചെയ്യാനോ കരാറുകൾ ഉണ്ടാക്കാനോ എനിക്കിഷ്ടമാണ്.',
        options: [
            { text: 'Strongly Dislike', textMl: 'ഒട്ടും ഇഷ്ടമല്ല', isCorrect: false, scoreValue: 1 },
            { text: 'Dislike', textMl: 'ഇഷ്ടമല്ല', isCorrect: false, scoreValue: 2 },
            { text: 'Like', textMl: 'ഇഷ്ടമാണ്', isCorrect: false, scoreValue: 3 },
            { text: 'Strongly Like', textMl: 'വളരെ ഇഷ്ടമാണ്', isCorrect: false, scoreValue: 4 },
        ],
    },
    {
        section: 'ENTERPRISING',
        text: 'I prefer goal-oriented and competitive environments.',
        textMl: 'ലക്ഷ്യാധിഷ്ഠിതവും മത്സരാധിഷ്ഠിതവുമായ അന്തരീക്ഷങ്ങളാണ് എനിക്കിഷ്ടം.',
        options: [
            { text: 'Strongly Dislike', textMl: 'ഒട്ടും ഇഷ്ടമല്ല', isCorrect: false, scoreValue: 1 },
            { text: 'Dislike', textMl: 'ഇഷ്ടമല്ല', isCorrect: false, scoreValue: 2 },
            { text: 'Like', textMl: 'ഇഷ്ടമാണ്', isCorrect: false, scoreValue: 3 },
            { text: 'Strongly Like', textMl: 'വളരെ ഇഷ്ടമാണ്', isCorrect: false, scoreValue: 4 },
        ],
    },

    // CONVENTIONAL (8 questions)
    {
        section: 'CONVENTIONAL',
        text: 'I enjoy following clear rules, systems, and procedures.',
        textMl: 'വ്യക്തമായ നിയമങ്ങളും സിസ്റ്റങ്ങളും നടപടിക്രമങ്ങളും പിന്തുടരാൻ എനിക്കിഷ്ടമാണ്.',
        options: [
            { text: 'Strongly Dislike', textMl: 'ഒട്ടും ഇഷ്ടമല്ല', isCorrect: false, scoreValue: 1 },
            { text: 'Dislike', textMl: 'ഇഷ്ടമല്ല', isCorrect: false, scoreValue: 2 },
            { text: 'Like', textMl: 'ഇഷ്ടമാണ്', isCorrect: false, scoreValue: 3 },
            { text: 'Strongly Like', textMl: 'വളരെ ഇഷ്ടമാണ്', isCorrect: false, scoreValue: 4 },
        ],
    },
    {
        section: 'CONVENTIONAL',
        text: 'I like organizing files, records, or data.',
        textMl: 'ഫയലുകൾ, റെക്കോർഡുകൾ, അല്ലെങ്കിൽ ഡാറ്റ ഓർഗനൈസ് ചെയ്യാൻ എനിക്കിഷ്ടമാണ്.',
        options: [
            { text: 'Strongly Dislike', textMl: 'ഒട്ടും ഇഷ്ടമല്ല', isCorrect: false, scoreValue: 1 },
            { text: 'Dislike', textMl: 'ഇഷ്ടമല്ല', isCorrect: false, scoreValue: 2 },
            { text: 'Like', textMl: 'ഇഷ്ടമാണ്', isCorrect: false, scoreValue: 3 },
            { text: 'Strongly Like', textMl: 'വളരെ ഇഷ്ടമാണ്', isCorrect: false, scoreValue: 4 },
        ],
    },
    {
        section: 'CONVENTIONAL',
        text: 'I prefer tasks with clear instructions and deadlines.',
        textMl: 'വ്യക്തമായ നിർദ്ദേശങ്ങളും സമയപരിധികളും ഉള്ള ടാസ്ക്കുകളാണ് എനിക്കിഷ്ടം.',
        options: [
            { text: 'Strongly Dislike', textMl: 'ഒട്ടും ഇഷ്ടമല്ല', isCorrect: false, scoreValue: 1 },
            { text: 'Dislike', textMl: 'ഇഷ്ടമല്ല', isCorrect: false, scoreValue: 2 },
            { text: 'Like', textMl: 'ഇഷ്ടമാണ്', isCorrect: false, scoreValue: 3 },
            { text: 'Strongly Like', textMl: 'വളരെ ഇഷ്ടമാണ്', isCorrect: false, scoreValue: 4 },
        ],
    },
    {
        section: 'CONVENTIONAL',
        text: 'I enjoy detailed administrative work.',
        textMl: 'വിശദമായ അഡ്മിനിസ്ട്രേറ്റീവ് ജോലി എനിക്കിഷ്ടമാണ്.',
        options: [
            { text: 'Strongly Dislike', textMl: 'ഒട്ടും ഇഷ്ടമല്ല', isCorrect: false, scoreValue: 1 },
            { text: 'Dislike', textMl: 'ഇഷ്ടമല്ല', isCorrect: false, scoreValue: 2 },
            { text: 'Like', textMl: 'ഇഷ്ടമാണ്', isCorrect: false, scoreValue: 3 },
            { text: 'Strongly Like', textMl: 'വളരെ ഇഷ്ടമാണ്', isCorrect: false, scoreValue: 4 },
        ],
    },
    {
        section: 'CONVENTIONAL',
        text: 'I like working with numbers, spreadsheets, or accounts.',
        textMl: 'നമ്പറുകൾ, സ്പ്രെഡ്ഷീറ്റുകൾ, അല്ലെങ്കിൽ അക്കൌണ്ടുകളുമായി ജോലി ചെയ്യാൻ എനിക്കിഷ്ടമാണ്.',
        options: [
            { text: 'Strongly Dislike', textMl: 'ഒട്ടും ഇഷ്ടമല്ല', isCorrect: false, scoreValue: 1 },
            { text: 'Dislike', textMl: 'ഇഷ്ടമല്ല', isCorrect: false, scoreValue: 2 },
            { text: 'Like', textMl: 'ഇഷ്ടമാണ്', isCorrect: false, scoreValue: 3 },
            { text: 'Strongly Like', textMl: 'വളരെ ഇഷ്ടമാണ്', isCorrect: false, scoreValue: 4 },
        ],
    },
    {
        section: 'CONVENTIONAL',
        text: 'I am comfortable working in structured office settings.',
        textMl: 'ഘടനാപരമായ ഓഫീസ് സെറ്റിംഗുകളിൽ പ്രവർത്തിക്കുന്നത് എനിക്ക് സുഖമാണ്.',
        options: [
            { text: 'Strongly Dislike', textMl: 'ഒട്ടും ഇഷ്ടമല്ല', isCorrect: false, scoreValue: 1 },
            { text: 'Dislike', textMl: 'ഇഷ്ടമല്ല', isCorrect: false, scoreValue: 2 },
            { text: 'Like', textMl: 'ഇഷ്ടമാണ്', isCorrect: false, scoreValue: 3 },
            { text: 'Strongly Like', textMl: 'വളരെ ഇഷ്ടമാണ്', isCorrect: false, scoreValue: 4 },
        ],
    },
    {
        section: 'CONVENTIONAL',
        text: 'I enjoy working with forms, reports, or documentation.',
        textMl: 'ഫോമുകൾ, റിപ്പോർട്ടുകൾ, അല്ലെങ്കിൽ ഡോക്യുമെന്റേഷൻ കൈകാര്യം ചെയ്യാൻ എനിക്കിഷ്ടമാണ്.',
        options: [
            { text: 'Strongly Dislike', textMl: 'ഒട്ടും ഇഷ്ടമല്ല', isCorrect: false, scoreValue: 1 },
            { text: 'Dislike', textMl: 'ഇഷ്ടമല്ല', isCorrect: false, scoreValue: 2 },
            { text: 'Like', textMl: 'ഇഷ്ടമാണ്', isCorrect: false, scoreValue: 3 },
            { text: 'Strongly Like', textMl: 'വളരെ ഇഷ്ടമാണ്', isCorrect: false, scoreValue: 4 },
        ],
    },
    {
        section: 'CONVENTIONAL',
        text: 'I prefer consistency and routine over variety.',
        textMl: 'വൈവിധ്യത്തേക്കാൾ സ്ഥിരതയും റൂട്ടീനും ആണ് എനിക്കിഷ്ടം.',
        options: [
            { text: 'Strongly Dislike', textMl: 'ഒട്ടും ഇഷ്ടമല്ല', isCorrect: false, scoreValue: 1 },
            { text: 'Dislike', textMl: 'ഇഷ്ടമല്ല', isCorrect: false, scoreValue: 2 },
            { text: 'Like', textMl: 'ഇഷ്ടമാണ്', isCorrect: false, scoreValue: 3 },
            { text: 'Strongly Like', textMl: 'വളരെ ഇഷ്ടമാണ്', isCorrect: false, scoreValue: 4 },
        ],
    },
];

export { riasecQuestionsPart2 };
