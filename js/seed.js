// Materi dan soal disusun dari dokumen Grammar Lab.
// Baris materi yang diawali ">" ditampilkan sebagai contoh.
// Video YouTube dapat berisi beberapa URL atau ID, satu per baris.
const useBoth = ["pre", "post"];
const mc = (id, text, options, answer) => ({
  id,
  type: "mc",
  text,
  options: [answer, ...options.filter((option) => option !== answer)],
  use: useBoth,
});
const fill = (id, text, answer) => ({
  id,
  type: "fill",
  text,
  answer,
  use: useBoth,
});
const order = (id, text, answer) => ({
  id,
  type: "order",
  text,
  answer,
  use: useBoth,
});
const lessonQuiz = (id, text, answer, options) => ({
  id,
  text,
  answer,
  options: [answer, ...options.filter((option) => option !== answer)],
});

window.SEED = {
  materials: [
    {
      id: "lesson-01",
      order: 1,
      title: "Simple Present — Uses and Structure",
      videoTitle: "Learn English Tenses: PRESENT SIMPLE — Learn English with Rebecca",
      youtube: "Z19NAX_gWxI",
      body: `This video explains how the present simple is used for relatively stable situations, routines, general facts, schedules, and habits. Adverbs of frequency such as always, often, sometimes, and never describe how frequently something happens.

Affirmative sentences use subject + base verb. Add -s or -es for he, she, and it: I work, but he works. Verbs ending in -s, -sh, -ch, or -x take -es; a consonant + y changes to -ies. Some special forms include go → goes and have → has.

Negative sentences use do not/don't or does not/doesn't + base verb. Questions use Do/Does + subject + base verb. After does or doesn't, the main verb does not take -s: He doesn't work. The video also reminds learners to use the correct auxiliary in short answers, such as Yes, they do.`,
      quiz: [
        lessonQuiz("sp1-q1", "My sister _____ at a hospital in Jakarta.", "works", ["work", "working", "worked"]),
        lessonQuiz("sp1-q2", "Choose the correct negative sentence.", "He doesn't like spicy food.", ["He don't like spicy food.", "He doesn't likes spicy food.", "He not like spicy food."]),
        lessonQuiz("sp1-q3", "Rina _____ English every evening.", "studies", ["studys", "studyes", "study"]),
      ],
    },
    {
      id: "lesson-02",
      order: 2,
      title: "Simple Present — Habits and Spelling",
      videoTitle: "Present Simple Lesson — Learn English by Pocket Passport",
      youtube: "8XgvqzATGNY",
      body: `This video uses everyday examples to explain how the present simple describes current situations, habits, and general facts. Adverbs of frequency such as often and never tell us how frequently something happens.

In affirmative sentences, verbs take -s with he, she, and it: She likes; he eats. A verb ending in consonant + y changes to -ies, as in fly → flies. If a vowel comes before y, simply add -s: play → plays.

Use do/does followed by the base verb in questions and negative sentences. For example: Does she want ice cream? and She doesn't want chocolate. The video also models a personal profile using to be, personal information, occupations, and habits.`,
      quiz: [
        lessonQuiz("sp2-q1", "Why does play become plays, not plaies, with the subject he?", "A vowel comes before y.", ["A consonant comes before y.", "Play is an irregular verb.", "The sentence is negative."]),
        lessonQuiz("sp2-q2", "Change this sentence into a question: She wants ice cream.", "Does she want ice cream?", ["Do she wants ice cream?", "Does she wants ice cream?", "Is she want ice cream?"]),
        lessonQuiz("sp2-q3", "A bird _____ in the sky. (fly)", "flies", ["flys", "flyes", "flying"]),
      ],
    },
    {
      id: "lesson-03",
      order: 3,
      title: "Present Continuous — Structure and Uses",
      videoTitle: "How to Use the Present Continuous — Oxford Online English",
      youtube: "0djfJqWhnpY",
      body: `This video explains how the present continuous is used for actions in progress, temporary situations, ongoing changes, arranged future plans, and other context-dependent situations.

The structure is subject + am/is/are + verb-ing. Use am with I, is with he/she/it, and are with you/we/they. Add not after be to make a negative sentence. To form a question, move am/is/are before the subject; do not use do: Are you watching?

The -ing form is usually made by adding -ing, dropping a final e (write → writing), or doubling the final consonant in certain short words (run → running).`,
      quiz: [
        lessonQuiz("pc1-q1", "What is the basic structure of an affirmative present continuous sentence?", "Subject + am/is/are + verb-ing", ["Subject + do/does + verb-ing", "Subject + have/has + verb-ing", "Subject + verb-ing"]),
        lessonQuiz("pc1-q2", "Which sentence describes a temporary situation?", "She is working in the marketing department this month.", ["She works in the finance department.", "She worked in the marketing department.", "She will work in the marketing department."]),
        lessonQuiz("pc1-q3", "Choose the sentence that describes an arranged plan.", "We're meeting outside the cinema at 8:00 tonight.", ["We meet outside the cinema at 8:00 tonight.", "We met outside the cinema at 8:00 tonight.", "We're meet outside the cinema at 8:00 tonight."]),
      ],
    },
    {
      id: "lesson-04",
      order: 4,
      title: "Present Continuous — Actions and Plans",
      videoTitle: "Present Continuous — An Easy English Grammar Lesson",
      youtube: "QqxdZzOorAU",
      body: `This video reviews the three parts of the present continuous: subject + be verb (am/is/are) + main verb-ing. Examples include: I am drinking coffee and They are having a party.

This tense is used for actions happening now, temporary situations lasting a few days or months, and decided future plans. Example: I am meeting my friend tomorrow. Choose the be verb based on the subject: use are with they, is with she, and am with I.`,
      quiz: [
        lessonQuiz("pc2-q1", "What are the three main parts of the present continuous?", "Subject + be verb + main verb-ing", ["Subject + will + base verb", "Subject + do/does + base verb", "Subject + had + past participle"]),
        lessonQuiz("pc2-q2", "They _____ soccer in the park.", "are playing", ["is playing", "am playing", "playing"]),
        lessonQuiz("pc2-q3", "What does “I'm staying at my friend's house this week” describe?", "A temporary situation", ["A scientific fact", "A permanent habit", "A past event"]),
      ],
    },
    {
      id: "lesson-05",
      order: 5,
      title: "Simple Past — Completed Events",
      videoTitle: "Learn English: Simple Past Tense — Learn on the Go",
      youtube: "WmCE2Ip6XCI",
      body: `The simple past is used for actions that were completed in the past. Time expressions can include yesterday, last week, two years ago, or in 2001.

Affirmative sentences use the past form of the verb. Regular verbs usually take -ed, while irregular verbs have special forms, such as go → went and eat → ate. The past form stays the same for every subject.

Negative sentences use subject + didn't + base verb. Questions use Did + subject + base verb. Since did already indicates the past, do not use the past form again: I didn't work and Did you work? Use was or were for to be.`,
      quiz: [
        lessonQuiz("past1-q1", "When do we use the simple past?", "For actions completed in the past.", ["For actions happening right now.", "For everyday routines.", "For uncertain future plans."]),
        lessonQuiz("past1-q2", "Why is “I didn't worked yesterday” incorrect?", "After didn't, the verb returns to its base form.", ["The subject I must use wasn't.", "Yesterday cannot be used with didn't.", "Work is an irregular verb."]),
        lessonQuiz("past1-q3", "Choose the correct simple past question.", "Did you work late last night?", ["Did you worked late last night?", "Do you worked late last night?", "Were you work late last night?"]),
      ],
    },
    {
      id: "lesson-06",
      order: 6,
      title: "Simple Past — Regular and Irregular Verbs",
      videoTitle: "Past Simple — An Easy English Grammar Lesson",
      youtube: "kgcd4gj9zNw",
      body: `This video demonstrates the simple past through stories about completed activities, using verbs such as worked, studied, went, and ate.

Regular verbs usually take -ed. With certain consonant-vowel-consonant patterns, double the final consonant before adding -ed: stop → stopped. Irregular verbs must be learned individually, for example take → took, go → went, and see → saw.

Use didn't + base verb for negative sentences. For questions, use Did + subject + base verb. Examples: She didn't go and Did she write a letter?`,
      quiz: [
        lessonQuiz("past2-q1", "Why does stop become stopped?", "It ends with a consonant-vowel-consonant pattern.", ["Stop is an irregular verb.", "The subject is singular.", "The sentence is negative."]),
        lessonQuiz("past2-q2", "What is the past form of take?", "took", ["taked", "taken", "takes"]),
        lessonQuiz("past2-q3", "She _____ to the party last night.", "didn't go", ["didn't went", "not went", "doesn't go"]),
      ],
    },
    {
      id: "lesson-07",
      order: 7,
      title: "Simple Future — Using Will",
      videoTitle: "Learn English Tenses: FUTURE SIMPLE with WILL — Learn English with Rebecca",
      youtube: "tri7u632AaA",
      body: `This video discusses how will is used in formal contexts, predictions, spontaneous decisions, promises, offers of help, and possibilities. In informal conversation, plans already made often use going to or the present continuous, while a decision made at the moment of speaking can use will.

The structure is subject + will + base verb for every subject. The negative form is will not/won't + base verb. Questions use Will + subject + base verb? A short answer could be Yes, he will.

In the first conditional, use the present simple after if/when and will in the main clause: If I visit Bali, I will send you a postcard. Shall is commonly used in polite questions with I or we.`,
      quiz: [
        lessonQuiz("future1-q1", "When is will suitable in informal conversation?", "When making a spontaneous decision while speaking.", ["For daily routines.", "For events that happened yesterday.", "Only for plans scheduled last month."]),
        lessonQuiz("future1-q2", "Choose the correct first conditional sentence.", "If I visit Bali, I will send you a postcard.", ["If I will visit Bali, I will send you a postcard.", "If I visited Bali, I will send you a postcard.", "If I visit Bali, I send you a postcard."]),
        lessonQuiz("future1-q3", "What does “I'll help you carry those bags” express?", "An offer of help", ["A weather forecast", "A train schedule", "A past habit"]),
      ],
    },
    {
      id: "lesson-08",
      order: 8,
      title: "Simple Future — Forms and Expressions",
      videoTitle: "Simple Future with Will — Ellii",
      youtube: "n14zCZAvSjI",
      body: `This video compares three ways to talk about the future: will + base verb for decisions made at the moment, be going to + base verb for plans, and be + verb-ing for arrangements that have already been scheduled.

Will is a modal, so the verb that follows is always in its base form for every subject: He will walk, not He will walks or He will walking. The contraction of will is 'll. Use forms such as they'll with subject pronouns, but write the students will, not the students'll.`,
      quiz: [
        lessonQuiz("future2-q1", "Which form of the verb follows will?", "The base verb, without -s, -ed, or -ing.", ["Verb-ing", "Past participle", "Verb + -s with he/she/it"]),
        lessonQuiz("future2-q2", "Which contraction is used correctly?", "They'll drive to work tomorrow.", ["The students'll go to school on Monday.", "My brother'll walk his dog tomorrow.", "Maria'll give a presentation next week."]),
        lessonQuiz("future2-q3", "He _____ his dog tomorrow morning.", "will walk", ["will walks", "will walked", "will walking"]),
      ],
    },
  ],
  questions: [
    mc(
      "q1",
      "My mother ____ breakfast every morning.",
      ["cook", "cooked", "cooks", "cooking"],
      "cooks",
    ),
    mc(
      "q2",
      "____ your sister play the piano?",
      ["Do", "Is", "Does", "Are"],
      "Does",
    ),
    mc(
      "q3",
      "The sun ____ in the east.",
      ["rose", "rise", "is rising", "rises"],
      "rises",
    ),
    mc(
      "q4",
      "The children ____ in the garden now.",
      ["play", "played", "are playing", "plays"],
      "are playing",
    ),
    mc(
      "q5",
      "____ they watching TV right now?",
      ["Do", "Does", "Is", "Are"],
      "Are",
    ),
    mc(
      "q6",
      "Look! It ____ outside.",
      ["rains", "is raining", "rained", "rain"],
      "is raining",
    ),
    mc(
      "q7",
      "We ____ a movie last night.",
      ["watch", "watched", "watching", "watches"],
      "watched",
    ),
    mc(
      "q8",
      "____ you go to the market last Sunday?",
      ["Do", "Does", "Are", "Did"],
      "Did",
    ),
    mc(
      "q9",
      "My father ____ me a new bicycle last year.",
      ["buy", "buys", "bought", "buying"],
      "bought",
    ),
    mc(
      "q10",
      "They ____ a party tomorrow.",
      ["has", "had", "having", "will have"],
      "will have",
    ),
    mc(
      "q11",
      "She ____ come to the party tomorrow because she is sick.",
      ["won't", "didn't", "doesn't", "isn't"],
      "won't",
    ),
    mc(
      "q12",
      "I think the weather ____ sunny tomorrow.",
      ["will be", "was", "is", "being"],
      "will be",
    ),
    fill("q13", "My father ____ (drink) coffee every morning.", "drinks"),
    fill(
      "q14",
      "Tom and Anna ____ (not / like) horror movies.",
      "don't like|do not like",
    ),
    fill(
      "q15",
      "My sister ____ (study) English every evening.",
      "studies",
    ),
    fill(
      "q16",
      "Listen! The baby ____ (cry) in the bedroom.",
      "is crying",
    ),
    fill(
      "q17",
      "My parents ____ (not / watch) TV right now.",
      "aren't watching|are not watching",
    ),
    fill(
      "q18",
      "Yesterday, I ____ (go) to the beach with my family.",
      "went",
    ),
    fill(
      "q19",
      "She ____ (not / clean) her room last Sunday.",
      "didn't clean|did not clean",
    ),
    fill("q20", "I think it ____ (rain) tomorrow.", "will rain"),
    fill(
      "q21",
      "We ____ (not / be) late for the meeting tomorrow.",
      "won't be|will not be",
    ),
    order(
      "q22",
      "Arrange the words: always / early / my sister / wakes up",
      "My sister always wakes up early.",
    ),
    order(
      "q23",
      "Arrange the words: play / he / does / football / ?",
      "Does he play football?",
    ),
    order(
      "q24",
      "Arrange the words: is / dinner / mother / cooking / my / now",
      "My mother is cooking dinner now.",
    ),
    order(
      "q25",
      "Arrange the words: the students / are / studying / not / in the library",
      "The students are not studying in the library.",
    ),
    order(
      "q26",
      "Arrange the words: visited / last week / we / our grandparents",
      "We visited our grandparents last week.",
    ),
    order(
      "q27",
      "Arrange the words: did / you / what / yesterday / do / ?",
      "What did you do yesterday?",
    ),
    order(
      "q28",
      "Arrange the words: will / the weather / tomorrow / be / cold",
      "The weather will be cold tomorrow.",
    ),
    order(
      "q29",
      "Arrange the words: she / not / will / meet / her friend / tomorrow",
      "She will not meet her friend tomorrow.",
    ),
    order(
      "q30",
      "Arrange the words: we / will / a picnic / have / next Sunday",
      "We will have a picnic next Sunday.",
    ),
  ],
};
