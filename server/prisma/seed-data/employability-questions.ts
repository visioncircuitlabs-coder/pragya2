/**
 * Employability Skills Assessment (24 Questions)
 * Core, Functional, and Behavioral Skills
 * Scoring: Each option gets a unique score 1-4 (worst to best)
 */

const employabilityQuestions = [
    // CORE SKILLS (8 questions)
    {
        section: 'Core Skills',
        text: 'Your team receives negative feedback from a client. How do you respond?',
        textMl: 'നിങ്ങളുടെ ടീമിന് ക്ലയന്റിൽ നിന്ന് നെഗറ്റീവ് ഫീഡ്ബാക്ക് ലഭിക്കുന്നു. നിങ്ങൾ എങ്ങനെ പ്രതികരിക്കും?',
        options: [
            // Worst: deflects blame onto the client
            { text: 'Blame the client for misunderstanding', textMl: 'തെറ്റിദ്ധാരണയ്ക്ക് ക്ലയന്റിനെ കുറ്റപ്പെടുത്തുക', isCorrect: false, scoreValue: 1 },
            // Poor: passive avoidance
            { text: 'Ignore and continue work', textMl: 'അവഗണിച്ച് ജോലി തുടരുക', isCorrect: false, scoreValue: 2 },
            // Best: proactive, constructive, takes ownership
            { text: 'Acknowledge, analyze, and improve', textMl: 'അംഗീകരിക്കുക, വിശകലനം ചെയ്യുക, മെച്ചപ്പെടുത്തുക', isCorrect: true, scoreValue: 4 },
            // Decent: takes action but doesn't try to solve it themselves first
            { text: 'Escalate immediately to supervisor', textMl: 'ഉടൻ മേലധികാരിയിലേക്ക് എസ്കലേറ്റ് ചെയ്യുക', isCorrect: false, scoreValue: 3 },
        ],
    },
    {
        section: 'Core Skills',
        text: 'You need to explain a technical issue to a non-technical colleague. What do you do?',
        textMl: 'ഒരു സാങ്കേതിക വിഷയം സാങ്കേതികമല്ലാത്ത സഹപ്രവർത്തകന് വിശദീകരിക്കണം. നിങ്ങൾ എന്ത് ചെയ്യും?',
        options: [
            // Worst: no effort to communicate effectively
            { text: 'Use jargon and expect them to learn', textMl: 'ടെക്നിക്കൽ പദങ്ങൾ ഉപയോഗിച്ച് പഠിക്കാൻ പറയുക', isCorrect: false, scoreValue: 1 },
            // Best: adapts communication to audience
            { text: 'Use simple language and analogies', textMl: 'ലളിതമായ ഭാഷയും ഉദാഹരണങ്ങളും ഉപയോഗിക്കുക', isCorrect: true, scoreValue: 4 },
            // Poor: avoids responsibility entirely
            { text: 'Ask someone else to explain', textMl: 'മറ്റൊരാളോട് വിശദീകരിക്കാൻ പറയുക', isCorrect: false, scoreValue: 2 },
            // Decent: makes effort but less interactive than face-to-face
            { text: 'Send an email with details', textMl: 'വിശദാംശങ്ങളുമായി ഇമെയിൽ അയയ്ക്കുക', isCorrect: false, scoreValue: 3 },
        ],
    },
    {
        section: 'Core Skills',
        text: 'You are assigned a task you have never done before. What is your approach?',
        textMl: 'മുമ്പ് ചെയ്തിട്ടില്ലാത്ത ഒരു ടാസ്ക് നിങ്ങൾക്ക് ലഭിക്കുന്നു. നിങ്ങളുടെ സമീപനം എന്താണ്?',
        options: [
            // Worst: refuses to try
            { text: 'Refuse because I lack experience', textMl: 'അനുഭവമില്ലാത്തതിനാൽ നിരസിക്കുക', isCorrect: false, scoreValue: 1 },
            // Best: self-driven learning
            { text: 'Research, learn, then start', textMl: 'ഗവേഷണം ചെയ്യുക, പഠിക്കുക, തുടങ്ങുക', isCorrect: true, scoreValue: 4 },
            // Poor: pushes work away without trying
            { text: 'Delegate to someone else', textMl: 'മറ്റൊരാൾക്ക് നൽകുക', isCorrect: false, scoreValue: 2 },
            // Decent: willing but reckless approach
            { text: 'Start without preparation', textMl: 'തയ്യാറെടുപ്പില്ലാതെ തുടങ്ങുക', isCorrect: false, scoreValue: 3 },
        ],
    },
    {
        section: 'Core Skills',
        text: 'You notice a pattern of errors in reports. What do you do?',
        textMl: 'റിപ്പോർട്ടുകളിൽ ഒരു പിഴവിന്റെ പാറ്റേൺ നിങ്ങൾ ശ്രദ്ധിക്കുന്നു. നിങ്ങൾ എന്ത് ചെയ്യും?',
        options: [
            // Worst: complete inaction
            { text: 'Wait for someone else to notice', textMl: 'മറ്റൊരാൾ ശ്രദ്ധിക്കുന്നതുവരെ കാത്തിരിക്കുക', isCorrect: false, scoreValue: 1 },
            // Best: identifies pattern AND suggests solution
            { text: 'Report pattern and suggest fix', textMl: 'പാറ്റേൺ റിപ്പോർട്ട് ചെയ്ത് പരിഹാരം നിർദ്ദേശിക്കുക', isCorrect: true, scoreValue: 4 },
            // Decent: fixes but doesn't share knowledge with team
            { text: 'Fix silently without telling anyone', textMl: 'ആരോടും പറയാതെ മൗനമായി ശരിയാക്കുക', isCorrect: false, scoreValue: 3 },
            // Poor: apathy, not my problem attitude
            { text: 'Ignore - not my responsibility', textMl: 'അവഗണിക്കുക - എന്റെ ഉത്തരവാദിത്തമല്ല', isCorrect: false, scoreValue: 2 },
        ],
    },
    {
        section: 'Core Skills',
        text: 'You have multiple deadlines on the same day. How do you prioritize?',
        textMl: 'ഒരേ ദിവസം നിരവധി ഡെഡ്ലൈനുകൾ ഉണ്ട്. നിങ്ങൾ എങ്ങനെ മുൻഗണന നൽകും?',
        options: [
            // Decent: has a system but not the most strategic one
            { text: 'Work on easiest first', textMl: 'ഏറ്റവും എളുപ്പമുള്ളത് ആദ്യം ചെയ്യുക', isCorrect: false, scoreValue: 3 },
            // Best: strategic, impact-driven prioritization
            { text: 'Rank by impact and urgency', textMl: 'ആഘാതവും അടിയന്തിരതയും അനുസരിച്ച് റാങ്ക് ചെയ്യുക', isCorrect: true, scoreValue: 4 },
            // Poor: seeks help but doesn't try to manage independently
            { text: 'Ask manager to reduce work', textMl: 'ജോലി കുറയ്ക്കാൻ മാനേജരോട് പറയുക', isCorrect: false, scoreValue: 2 },
            // Worst: no strategy at all
            { text: 'Work randomly', textMl: 'ക്രമമില്ലാതെ ജോലി ചെയ്യുക', isCorrect: false, scoreValue: 1 },
        ],
    },
    {
        section: 'Core Skills',
        text: 'Your colleague disagrees with your approach. What do you do?',
        textMl: 'നിങ്ങളുടെ സമീപനത്തോട് സഹപ്രവർത്തകൻ വിയോജിക്കുന്നു. നിങ്ങൾ എന്ത് ചെയ്യും?',
        options: [
            // Worst: rigid, no collaboration
            { text: 'Insist my way is correct', textMl: 'എന്റെ വഴി ശരിയാണെന്ന് നിർബന്ധിക്കുക', isCorrect: false, scoreValue: 1 },
            // Best: collaborative problem-solving
            { text: 'Listen, discuss, find best solution', textMl: 'കേൾക്കുക, ചർച്ച ചെയ്യുക, മികച്ച പരിഹാരം കണ്ടെത്തുക', isCorrect: true, scoreValue: 4 },
            // Poor: avoids confrontation entirely
            { text: 'Avoid the discussion', textMl: 'ചർച്ച ഒഴിവാക്കുക', isCorrect: false, scoreValue: 2 },
            // Decent: seeks resolution but lacks initiative
            { text: 'Let manager decide', textMl: 'മാനേജറിനെ തീരുമാനിക്കാൻ അനുവദിക്കുക', isCorrect: false, scoreValue: 3 },
        ],
    },
    {
        section: 'Core Skills',
        text: 'You need to use a new software tool for your work. What is your approach?',
        textMl: 'നിങ്ങളുടെ ജോലിക്ക് ഒരു പുതിയ സോഫ്റ്റ്വെയർ ഉപകരണം ഉപയോഗിക്കേണ്ടതുണ്ട്. നിങ്ങളുടെ സമീപനം എന്താണ്?',
        options: [
            // Worst: resists change entirely
            { text: 'Avoid it and use old methods', textMl: 'ഒഴിവാക്കി പഴയ രീതികൾ ഉപയോഗിക്കുക', isCorrect: false, scoreValue: 1 },
            // Best: proactive self-learning
            { text: 'Learn basics and apply immediately', textMl: 'അടിസ്ഥാനകാര്യങ്ങൾ പഠിച്ച് ഉടൻ പ്രയോഗിക്കുക', isCorrect: true, scoreValue: 4 },
            // Decent: willing but waits passively
            { text: 'Wait for training', textMl: 'പരിശീലനത്തിനായി കാത്തിരിക്കുക', isCorrect: false, scoreValue: 3 },
            // Poor: avoids learning, depends on others
            { text: 'Ask colleague to do it for me', textMl: 'സഹപ്രവർത്തകനോട് ചെയ്യാൻ പറയുക', isCorrect: false, scoreValue: 2 },
        ],
    },
    {
        section: 'Core Skills',
        text: 'You are running late on a project deadline. What do you do?',
        textMl: 'പ്രോജക്ട് ഡെഡ്ലൈനിൽ നിങ്ങൾ വൈകുന്നു. നിങ്ങൾ എന്ത് ചെയ്യും?',
        options: [
            // Best: transparent, proactive communication
            { text: 'Communicate early and propose plan', textMl: 'നേരത്തെ അറിയിച്ച് പ്ലാൻ നിർദ്ദേശിക്കുക', isCorrect: true, scoreValue: 4 },
            // Worst: dishonest, hides the problem
            { text: 'Hope no one notices', textMl: 'ആരും ശ്രദ്ധിക്കില്ലെന്ന് പ്രതീക്ഷിക്കുക', isCorrect: false, scoreValue: 1 },
            // Poor: blames others instead of taking ownership
            { text: 'Blame external factors', textMl: 'ബാഹ്യ ഘടകങ്ങളെ കുറ്റപ്പെടുത്തുക', isCorrect: false, scoreValue: 2 },
            // Decent: tries to finish but sacrifices quality
            { text: 'Rush and compromise quality', textMl: 'തിരക്കിട്ട് ഗുണനിലവാരം കുറയ്ക്കുക', isCorrect: false, scoreValue: 3 },
        ],
    },

    // FUNCTIONAL SKILLS (8 questions)
    {
        section: 'Functional Skills',
        text: 'You receive incomplete data for a report. What do you do?',
        textMl: 'ഒരു റിപ്പോർട്ടിനായി അപൂർണ്ണമായ ഡാറ്റ ലഭിക്കുന്നു. നിങ്ങൾ എന്ത് ചെയ്യും?',
        options: [
            // Poor: submits low-quality work knowingly
            { text: 'Submit incomplete report', textMl: 'അപൂർണ്ണ റിപ്പോർട്ട് സമർപ്പിക്കുക', isCorrect: false, scoreValue: 2 },
            // Best: verifies data before proceeding
            { text: 'Request missing data before proceeding', textMl: 'മുന്നോട്ട് പോകുന്നതിന് മുമ്പ് കാണാതായ ഡാറ്റ ആവശ്യപ്പെടുക', isCorrect: true, scoreValue: 4 },
            // Worst: fabricates data
            { text: 'Guess the missing values', textMl: 'കാണാതായ മൂല്യങ്ങൾ ഊഹിക്കുക', isCorrect: false, scoreValue: 1 },
            // Decent: cautious but causes unnecessary delay
            { text: 'Delay indefinitely', textMl: 'അനിശ്ചിതമായി വൈകിപ്പിക്കുക', isCorrect: false, scoreValue: 3 },
        ],
    },
    {
        section: 'Functional Skills',
        text: 'A customer is angry about a delay. How do you handle it?',
        textMl: 'ഒരു ഉപഭോക്താവ് കാലതാമസത്തെക്കുറിച്ച് ദേഷ്യത്തിലാണ്. നിങ്ങൾ എങ്ങനെ കൈകാര്യം ചെയ്യും?',
        options: [
            // Worst: escalates the conflict
            { text: 'Argue back', textMl: 'തിരിച്ച് തർക്കിക്കുക', isCorrect: false, scoreValue: 1 },
            // Best: professional, empathetic, solution-oriented
            { text: 'Apologize, explain, and offer solution', textMl: 'ക്ഷമാപണം നടത്തുക, വിശദീകരിക്കുക, പരിഹാരം നിർദ്ദേശിക്കുക', isCorrect: true, scoreValue: 4 },
            // Decent: seeks help but doesn't own the situation
            { text: 'Transfer to another person', textMl: 'മറ്റൊരാൾക്ക് കൈമാറുക', isCorrect: false, scoreValue: 3 },
            // Poor: dismissive
            { text: 'Ignore the complaint', textMl: 'പരാതി അവഗണിക്കുക', isCorrect: false, scoreValue: 2 },
        ],
    },
    {
        section: 'Functional Skills',
        text: 'You identify a step in a process that seems unnecessary. What do you do?',
        textMl: 'ഒരു പ്രക്രിയയിൽ അനാവശ്യമെന്ന് തോന്നുന്ന ഒരു ഘട്ടം നിങ്ങൾ തിരിച്ചറിയുന്നു. നിങ്ങൾ എന്ത് ചെയ്യും?',
        options: [
            // Worst: unilateral action without approval
            { text: 'Skip it silently', textMl: 'മൗനമായി ഒഴിവാക്കുക', isCorrect: false, scoreValue: 1 },
            // Best: constructive initiative
            { text: 'Suggest improvement to team/manager', textMl: 'ടീമിന്/മാനേജർക്ക് മെച്ചപ്പെടുത്തൽ നിർദ്ദേശിക്കുക', isCorrect: true, scoreValue: 4 },
            // Poor: negative energy without solution
            { text: 'Complain about it', textMl: 'അതിനെക്കുറിച്ച് പരാതിപ്പെടുക', isCorrect: false, scoreValue: 2 },
            // Decent: compliant but lacks critical thinking
            { text: 'Follow blindly', textMl: 'അന്ധമായി പിന്തുടരുക', isCorrect: false, scoreValue: 3 },
        ],
    },
    {
        section: 'Functional Skills',
        text: 'A new system is implemented but causes confusion. What do you do?',
        textMl: 'ഒരു പുതിയ സിസ്റ്റം നടപ്പാക്കിയെങ്കിലും ആശയക്കുഴപ്പം ഉണ്ടാക്കുന്നു. നിങ്ങൾ എന്ത് ചെയ്യും?',
        options: [
            // Worst: actively resists change
            { text: 'Reject the system', textMl: 'സിസ്റ്റം നിരസിക്കുക', isCorrect: false, scoreValue: 1 },
            // Best: adapts AND helps others
            { text: 'Learn, adapt, and help others', textMl: 'പഠിക്കുക, പൊരുത്തപ്പെടുക, മറ്റുള്ളവരെ സഹായിക്കുക', isCorrect: true, scoreValue: 4 },
            // Poor: passive, waits for others
            { text: 'Wait for someone to fix it', textMl: 'ആരെങ്കിലും ശരിയാക്കുന്നതുവരെ കാത്തിരിക്കുക', isCorrect: false, scoreValue: 2 },
            // Decent: at least continues working but undermines the change
            { text: 'Use old system secretly', textMl: 'പഴയ സിസ്റ്റം രഹസ്യമായി ഉപയോഗിക്കുക', isCorrect: false, scoreValue: 3 },
        ],
    },
    {
        section: 'Functional Skills',
        text: 'You notice a trend in customer complaints. What do you do?',
        textMl: 'ഉപഭോക്തൃ പരാതികളിൽ ഒരു ട്രെൻഡ് നിങ്ങൾ ശ്രദ്ധിക്കുന്നു. നിങ്ങൾ എന്ത് ചെയ്യും?',
        options: [
            // Best: data-driven escalation
            { text: 'Report pattern with data to manager', textMl: 'ഡാറ്റയോടെ പാറ്റേൺ മാനേജർക്ക് റിപ്പോർട്ട് ചെയ്യുക', isCorrect: true, scoreValue: 4 },
            // Decent: handles it but misses the bigger picture
            { text: 'Handle each complaint individually', textMl: 'ഓരോ പരാതിയും വ്യക്തിഗതമായി കൈകാര്യം ചെയ്യുക', isCorrect: false, scoreValue: 3 },
            // Poor: ignores the signal
            { text: 'Ignore the pattern', textMl: 'പാറ്റേൺ അവഗണിക്കുക', isCorrect: false, scoreValue: 2 },
            // Worst: blames the victims
            { text: 'Blame customers', textMl: 'ഉപഭോക്താക്കളെ കുറ്റപ്പെടുത്തുക', isCorrect: false, scoreValue: 1 },
        ],
    },
    {
        section: 'Functional Skills',
        text: 'A process has multiple steps requiring different skills. How do you approach it?',
        textMl: 'ഒരു പ്രക്രിയയ്ക്ക് വ്യത്യസ്ത കഴിവുകൾ ആവശ്യമായ നിരവധി ഘട്ടങ്ങളുണ്ട്. നിങ്ങൾ എങ്ങനെ സമീപിക്കും?',
        options: [
            // Poor: limits contribution, doesn't grow
            { text: 'Do only what I know', textMl: 'എനിക്കറിയാവുന്നത് മാത്രം ചെയ്യുക', isCorrect: false, scoreValue: 2 },
            // Best: leverages team strengths
            { text: 'Collaborate with team members', textMl: 'ടീം അംഗങ്ങളുമായി സഹകരിക്കുക', isCorrect: true, scoreValue: 4 },
            // Worst: complete avoidance
            { text: 'Avoid the task entirely', textMl: 'ടാസ്ക് പൂർണ്ണമായും ഒഴിവാക്കുക', isCorrect: false, scoreValue: 1 },
            // Decent: tries but lacks the skill to do it well
            { text: 'Do everything alone poorly', textMl: 'എല്ലാം തനിയെ മോശമായി ചെയ്യുക', isCorrect: false, scoreValue: 3 },
        ],
    },
    {
        section: 'Functional Skills',
        text: 'You are asked to handle a customer query outside your knowledge. What do you do?',
        textMl: 'നിങ്ങളുടെ അറിവിന് പുറത്തുള്ള ഒരു ഉപഭോക്തൃ ചോദ്യം കൈകാര്യം ചെയ്യാൻ ആവശ്യപ്പെടുന്നു. നിങ്ങൾ എന്ത് ചെയ്യും?',
        options: [
            // Worst: provides false information
            { text: 'Make up an answer', textMl: 'ഒരു ഉത്തരം ഉണ്ടാക്കുക', isCorrect: false, scoreValue: 1 },
            // Best: honest AND resourceful
            { text: 'Acknowledge limitation and find correct info', textMl: 'പരിമിതി അംഗീകരിച്ച് ശരിയായ വിവരം കണ്ടെത്തുക', isCorrect: true, scoreValue: 4 },
            // Poor: dismissive, no effort to help
            { text: 'Ignore the customer', textMl: 'ഉപഭോക്താവിനെ അവഗണിക്കുക', isCorrect: false, scoreValue: 2 },
            // Decent: passes to right person but poor handoff
            { text: 'Transfer without explaining', textMl: 'വിശദീകരിക്കാതെ കൈമാറുക', isCorrect: false, scoreValue: 3 },
        ],
    },
    {
        section: 'Functional Skills',
        text: 'You are given access to sensitive company data. How do you handle it?',
        textMl: 'സെൻസിറ്റീവ് കമ്പനി ഡാറ്റയിലേക്ക് നിങ്ങൾക്ക് ആക്സസ് ലഭിക്കുന്നു. നിങ്ങൾ എങ്ങനെ കൈകാര്യം ചെയ്യും?',
        options: [
            // Worst: deliberate breach
            { text: 'Share with friends', textMl: 'സുഹൃത്തുക്കളുമായി പങ്കിടുക', isCorrect: false, scoreValue: 1 },
            // Best: follows security protocols
            { text: 'Follow data security protocols strictly', textMl: 'ഡാറ്റ സുരക്ഷ പ്രോട്ടോക്കോളുകൾ കർശനമായി പാലിക്കുക', isCorrect: true, scoreValue: 4 },
            // Poor: risky storage practice
            { text: 'Store on personal device', textMl: 'സ്വന്തം ഉപകരണത്തിൽ സൂക്ഷിക്കുക', isCorrect: false, scoreValue: 2 },
            // Decent: careless but no malicious intent
            { text: 'Discuss openly', textMl: 'തുറന്ന് ചർച്ച ചെയ്യുക', isCorrect: false, scoreValue: 3 },
        ],
    },

    // BEHAVIORAL SKILLS (8 questions)
    {
        section: 'Behavioral Skills',
        text: 'A team member is struggling with their task. What do you do?',
        textMl: 'ഒരു ടീം അംഗം അവരുടെ ടാസ്കിൽ ബുദ്ധിമുട്ടുന്നു. നിങ്ങൾ എന്ത് ചെയ്യും?',
        options: [
            // Worst: no empathy or teamwork
            { text: 'Ignore - not my problem', textMl: 'അവഗണിക്കുക - എന്റെ പ്രശ്നമല്ല', isCorrect: false, scoreValue: 1 },
            // Best: supportive, empowering
            { text: 'Offer support and guidance', textMl: 'പിന്തുണയും മാർഗ്ഗനിർദ്ദേശവും നൽകുക', isCorrect: true, scoreValue: 4 },
            // Decent: alerts management but doesn't help directly
            { text: 'Report to manager immediately', textMl: 'ഉടൻ മാനേജർക്ക് റിപ്പോർട്ട് ചെയ്യുക', isCorrect: false, scoreValue: 2 },
            // Good: helpful but takes away their learning opportunity
            { text: 'Take over their work', textMl: 'അവരുടെ ജോലി ഏറ്റെടുക്കുക', isCorrect: false, scoreValue: 3 },
        ],
    },
    {
        section: 'Behavioral Skills',
        text: 'You make a mistake that affects the team. What do you do?',
        textMl: 'ടീമിനെ ബാധിക്കുന്ന ഒരു തെറ്റ് നിങ്ങൾ ചെയ്യുന്നു. നിങ്ങൾ എന്ത് ചെയ്യും?',
        options: [
            // Poor: active deception
            { text: 'Hide it', textMl: 'ഒളിപ്പിക്കുക', isCorrect: false, scoreValue: 2 },
            // Best: owns up and acts
            { text: 'Own up and help fix it', textMl: 'ഏറ്റുപറഞ്ഞ് ശരിയാക്കാൻ സഹായിക്കുക', isCorrect: true, scoreValue: 4 },
            // Worst: deflects blame maliciously
            { text: 'Blame someone else', textMl: 'മറ്റൊരാളെ കുറ്റപ്പെടുത്തുക', isCorrect: false, scoreValue: 1 },
            // Decent: passive but not malicious
            { text: 'Wait for someone to discover', textMl: 'ആരെങ്കിലും കണ്ടെത്തുന്നതുവരെ കാത്തിരിക്കുക', isCorrect: false, scoreValue: 3 },
        ],
    },
    {
        section: 'Behavioral Skills',
        text: 'You see an opportunity to improve workflow. What do you do?',
        textMl: 'വർക്ക്ഫ്ലോ മെച്ചപ്പെടുത്താനുള്ള അവസരം നിങ്ങൾ കാണുന്നു. നിങ്ങൾ എന്ത് ചെയ്യും?',
        options: [
            // Worst: no initiative
            { text: 'Stay quiet - not my job', textMl: 'മിണ്ടാതിരിക്കുക - എന്റെ ജോലിയല്ല', isCorrect: false, scoreValue: 1 },
            // Best: collaborative initiative
            { text: 'Propose the idea with reasoning', textMl: 'ന്യായയുക്തിയോടെ ആശയം നിർദ്ദേശിക്കുക', isCorrect: true, scoreValue: 4 },
            // Decent: initiative but no teamwork
            { text: 'Implement without telling anyone', textMl: 'ആരോടും പറയാതെ നടപ്പിലാക്കുക', isCorrect: false, scoreValue: 3 },
            // Poor: passive
            { text: 'Wait for someone else to suggest', textMl: 'മറ്റൊരാൾ നിർദ്ദേശിക്കുന്നതുവരെ കാത്തിരിക്കുക', isCorrect: false, scoreValue: 2 },
        ],
    },
    {
        section: 'Behavioral Skills',
        text: 'You receive constructive criticism from your supervisor. How do you react?',
        textMl: 'മേലധികാരിയിൽ നിന്ന് ക്രിയാത്മക വിമർശനം ലഭിക്കുന്നു. നിങ്ങൾ എങ്ങനെ പ്രതികരിക്കും?',
        options: [
            // Poor: emotional, unproductive reaction
            { text: 'Get defensive', textMl: 'പ്രതിരോധത്തിലാവുക', isCorrect: false, scoreValue: 2 },
            // Best: growth mindset
            { text: 'Listen, reflect, and improve', textMl: 'കേൾക്കുക, പ്രതിഫലിക്കുക, മെച്ചപ്പെടുത്തുക', isCorrect: true, scoreValue: 4 },
            // Decent: doesn't escalate but doesn't learn either
            { text: 'Ignore it', textMl: 'അവഗണിക്കുക', isCorrect: false, scoreValue: 3 },
            // Worst: toxic, creates workplace negativity
            { text: 'Complain to colleagues', textMl: 'സഹപ്രവർത്തകരോട് പരാതിപ്പെടുക', isCorrect: false, scoreValue: 1 },
        ],
    },
    {
        section: 'Behavioral Skills',
        text: 'A new team member joins. What is your approach?',
        textMl: 'ഒരു പുതിയ ടീം അംഗം ചേരുന്നു. നിങ്ങളുടെ സമീപനം എന്താണ്?',
        options: [
            // Worst: hostile
            { text: 'Ignore them', textMl: 'അവരെ അവഗണിക്കുക', isCorrect: false, scoreValue: 1 },
            // Best: welcoming, supportive
            { text: 'Welcome and help them settle', textMl: 'സ്വാഗതം ചെയ്യുകയും ഇണങ്ങാൻ സഹായിക്കുകയും ചെയ്യുക', isCorrect: true, scoreValue: 4 },
            // Poor: toxic mindset
            { text: 'See them as competition', textMl: 'അവരെ മത്സരമായി കാണുക', isCorrect: false, scoreValue: 2 },
            // Decent: neutral, not hostile but not welcoming
            { text: 'Wait for them to approach', textMl: 'അവർ സമീപിക്കുന്നതുവരെ കാത്തിരിക്കുക', isCorrect: false, scoreValue: 3 },
        ],
    },
    {
        section: 'Behavioral Skills',
        text: 'You are asked to learn a new skill for your job. What do you do?',
        textMl: 'നിങ്ങളുടെ ജോലിക്ക് ഒരു പുതിയ കഴിവ് പഠിക്കാൻ ആവശ്യപ്പെടുന്നു. നിങ്ങൾ എന്ത് ചെയ്യും?',
        options: [
            // Worst: outright refusal
            { text: 'Refuse to learn', textMl: 'പഠിക്കാൻ വിസമ്മതിക്കുക', isCorrect: false, scoreValue: 1 },
            // Best: enthusiastic learner
            { text: 'Embrace learning opportunity', textMl: 'പഠന അവസരം സ്വീകരിക്കുക', isCorrect: true, scoreValue: 4 },
            // Decent: does the minimum
            { text: 'Do minimum required', textMl: 'ആവശ്യമായ കുറഞ്ഞത് മാത്രം ചെയ്യുക', isCorrect: false, scoreValue: 3 },
            // Poor: delays and avoids
            { text: 'Procrastinate', textMl: 'മാറ്റിവയ്ക്കുക', isCorrect: false, scoreValue: 2 },
        ],
    },
    {
        section: 'Behavioral Skills',
        text: 'Your team disagrees on approach. Deadline is near. What do you do?',
        textMl: 'നിങ്ങളുടെ ടീം സമീപനത്തിൽ വിയോജിക്കുന്നു. ഡെഡ്ലൈൻ അടുത്തു. നിങ്ങൾ എന്ത് ചെയ്യും?',
        options: [
            // Poor: authoritarian, damages team
            { text: 'Force my opinion', textMl: 'എന്റെ അഭിപ്രായം നിർബന്ധിക്കുക', isCorrect: false, scoreValue: 2 },
            // Best: facilitative leadership
            { text: 'Facilitate quick decision together', textMl: 'ഒരുമിച്ച് വേഗത്തിലുള്ള തീരുമാനം സുഗമമാക്കുക', isCorrect: true, scoreValue: 4 },
            // Worst: sabotage through inaction
            { text: 'Let it fail', textMl: 'പരാജയപ്പെടാൻ അനുവദിക്കുക', isCorrect: false, scoreValue: 1 },
            // Decent: gets something done but ignores the team
            { text: 'Work alone', textMl: 'തനിയെ പ്രവർത്തിക്കുക', isCorrect: false, scoreValue: 3 },
        ],
    },
    {
        section: 'Behavioral Skills',
        text: 'You notice unethical behavior by a colleague. What do you do?',
        textMl: 'ഒരു സഹപ്രവർത്തകന്റെ അധാർമ്മിക പെരുമാറ്റം നിങ്ങൾ ശ്രദ്ധിക്കുന്നു. നിങ്ങൾ എന്ത് ചെയ്യും?',
        options: [
            // Poor: passive complicity
            { text: 'Ignore it', textMl: 'അവഗണിക്കുക', isCorrect: false, scoreValue: 2 },
            // Best: responsible, follows proper channels
            { text: 'Report through appropriate channels', textMl: 'ഉചിതമായ ചാനലുകളിലൂടെ റിപ്പോർട്ട് ചെയ്യുക', isCorrect: true, scoreValue: 4 },
            // Worst: spreads gossip, toxic behavior
            { text: 'Gossip about it', textMl: 'അതിനെക്കുറിച്ച് ഗോസിപ്പ് പറയുക', isCorrect: false, scoreValue: 1 },
            // Decent: addresses it but in a harmful way
            { text: 'Confront aggressively', textMl: 'ആക്രമണാത്മകമായി നേരിടുക', isCorrect: false, scoreValue: 3 },
        ],
    },
];

export { employabilityQuestions };
