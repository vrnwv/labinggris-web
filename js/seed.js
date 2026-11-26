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
      title: "Simple Present — Penggunaan dan Struktur",
      videoTitle: "Learn English Tenses: PRESENT SIMPLE — Learn English with Rebecca",
      youtube: "Z19NAX_gWxI",
      body: `Video ini menjelaskan present simple untuk keadaan yang relatif tetap, rutinitas, fakta umum, jadwal, dan kebiasaan yang ditandai adverbs of frequency seperti always, often, sometimes, dan never.

Kalimat positif memakai subject + verb 1. Untuk he, she, dan it, tambahkan -s atau -es: I work, tetapi he works. Kata kerja berakhiran -s, -sh, -ch, atau -x mendapat -es; konsonan + y berubah menjadi -ies. Beberapa bentuk khusus antara lain go menjadi goes dan have menjadi has.

Kalimat negatif memakai do not/don't atau does not/doesn't + verb dasar. Kalimat tanya memakai Do/Does + subject + verb dasar. Setelah does atau doesn't, kata kerja tidak memakai akhiran -s: He doesn't work. Video juga mengingatkan agar memakai kata bantu yang tepat dalam jawaban singkat, misalnya Yes, they do.`,
      quiz: [
        lessonQuiz("sp1-q1", "My sister _____ at a hospital in Jakarta.", "works", ["work", "working", "worked"]),
        lessonQuiz("sp1-q2", "Pilih bentuk negatif yang benar.", "He doesn't like spicy food.", ["He don't like spicy food.", "He doesn't likes spicy food.", "He not like spicy food."]),
        lessonQuiz("sp1-q3", "Rina _____ English every evening.", "studies", ["studys", "studyes", "study"]),
      ],
    },
    {
      id: "lesson-02",
      order: 2,
      title: "Simple Present — Kebiasaan dan Ejaan",
      videoTitle: "Present Simple Lesson — Learn English by Pocket Passport",
      youtube: "8XgvqzATGNY",
      body: `Video ini memakai contoh sehari-hari untuk menjelaskan present simple tentang keadaan saat ini, kebiasaan, dan fakta umum. Adverbs of frequency seperti often dan never menerangkan seberapa sering sesuatu terjadi.

Untuk he, she, dan it, kata kerja positif mendapat -s: She likes, he eats. Kata kerja berakhiran konsonan + y berubah menjadi -ies, seperti fly menjadi flies. Jika sebelum y ada huruf vokal, cukup tambahkan -s: play menjadi plays.

Dalam kalimat tanya dan negatif, gunakan do/does, lalu kata kerja dasar. Contohnya Does she want ice cream? dan She doesn't want chocolate. Video juga memberi contoh profil seseorang menggunakan to be, informasi diri, pekerjaan, dan kebiasaan.`,
      quiz: [
        lessonQuiz("sp2-q1", "Mengapa play menjadi plays, bukan plaies, untuk subjek he?", "Sebelum y terdapat huruf vokal.", ["Sebelum y terdapat huruf konsonan.", "Play adalah kata kerja tidak beraturan.", "Kalimatnya berbentuk negatif."]),
        lessonQuiz("sp2-q2", "Ubah menjadi pertanyaan: She wants ice cream.", "Does she want ice cream?", ["Do she wants ice cream?", "Does she wants ice cream?", "Is she want ice cream?"]),
        lessonQuiz("sp2-q3", "A bird _____ in the sky. (fly)", "flies", ["flys", "flyes", "flying"]),
      ],
    },
    {
      id: "lesson-03",
      order: 3,
      title: "Present Continuous — Struktur dan Penggunaan",
      videoTitle: "How to Use the Present Continuous — Oxford Online English",
      youtube: "0djfJqWhnpY",
      body: `Video ini menjelaskan present continuous untuk aksi yang sedang berlangsung, situasi sementara, perubahan yang sedang terjadi, rencana masa depan yang sudah diatur, dan penggunaan lain sesuai konteks.

Rumusnya subject + am/is/are + verb-ing. I memakai am, he/she/it memakai is, dan you/we/they memakai are. Bentuk negatif menambahkan not setelah be. Untuk pertanyaan, pindahkan am/is/are ke depan subject; jangan memakai do: Are you watching?

Bentuk -ing biasanya dibuat dengan menambahkan -ing, menghilangkan e terakhir (write menjadi writing), atau menggandakan konsonan pada kata pendek tertentu (run menjadi running).`,
      quiz: [
        lessonQuiz("pc1-q1", "Apa rumus dasar kalimat positif present continuous?", "Subject + am/is/are + verb-ing", ["Subject + do/does + verb-ing", "Subject + have/has + verb-ing", "Subject + verb-ing"]),
        lessonQuiz("pc1-q2", "Kalimat manakah yang menunjukkan situasi sementara?", "She is working in the marketing department this month.", ["She works in the finance department.", "She worked in the marketing department.", "She will work in the marketing department."]),
        lessonQuiz("pc1-q3", "Pilih kalimat untuk rencana yang sudah diatur.", "We're meeting outside the cinema at 8:00 tonight.", ["We meet outside the cinema at 8:00 tonight.", "We met outside the cinema at 8:00 tonight.", "We're meet outside the cinema at 8:00 tonight."]),
      ],
    },
    {
      id: "lesson-04",
      order: 4,
      title: "Present Continuous — Aksi dan Rencana",
      videoTitle: "Present Continuous — An Easy English Grammar Lesson",
      youtube: "QqxdZzOorAU",
      body: `Video ini merangkum tiga komponen present continuous: subject + be verb (am/is/are) + main verb-ing. Contohnya: I am drinking coffee dan They are having a party.

Tense ini digunakan untuk aksi yang berlangsung sekarang, situasi sementara selama beberapa hari atau bulan, serta rencana masa depan yang sudah diputuskan. Contoh rencana: I am meeting my friend tomorrow. Pilih be verb berdasarkan subject: they memakai are, she memakai is, dan I memakai am.`,
      quiz: [
        lessonQuiz("pc2-q1", "Apa tiga komponen utama present continuous?", "Subject + be verb + main verb-ing", ["Subject + will + base verb", "Subject + do/does + base verb", "Subject + had + past participle"]),
        lessonQuiz("pc2-q2", "They _____ soccer in the park.", "are playing", ["is playing", "am playing", "playing"]),
        lessonQuiz("pc2-q3", "I'm staying at my friend's house this week menunjukkan apa?", "Situasi sementara", ["Fakta ilmiah", "Kebiasaan permanen", "Kejadian masa lampau"]),
      ],
    },
    {
      id: "lesson-05",
      order: 5,
      title: "Simple Past — Kejadian Selesai",
      videoTitle: "Learn English: Simple Past Tense — Learn on the Go",
      youtube: "WmCE2Ip6XCI",
      body: `Simple past digunakan untuk tindakan yang sudah selesai di masa lampau. Penanda waktunya dapat berupa yesterday, last week, two years ago, atau in 2001.

Kalimat positif memakai verb 2. Kata kerja beraturan biasanya mendapat -ed, sedangkan irregular verbs memiliki bentuk khusus seperti go menjadi went dan eat menjadi ate. Bentuk past tetap sama untuk semua subject.

Kalimat negatif memakai subject + didn't + verb dasar. Pertanyaan memakai Did + subject + verb dasar. Karena did sudah menunjukkan waktu lampau, jangan memakai verb 2 lagi: I didn't work dan Did you work? Untuk to be, gunakan was atau were.`,
      quiz: [
        lessonQuiz("past1-q1", "Kapan simple past digunakan?", "Untuk tindakan yang sudah selesai di masa lampau.", ["Untuk kejadian yang sedang berlangsung sekarang.", "Untuk rutinitas setiap hari.", "Untuk rencana masa depan yang belum pasti."]),
        lessonQuiz("past1-q2", "Mengapa I didn't worked yesterday salah?", "Setelah didn't, kata kerja kembali ke bentuk dasar.", ["Subject I harus memakai wasn't.", "Yesterday tidak cocok dengan didn't.", "Work adalah irregular verb."]),
        lessonQuiz("past1-q3", "Pilih pertanyaan simple past yang benar.", "Did you work late last night?", ["Did you worked late last night?", "Do you worked late last night?", "Were you work late last night?"]),
      ],
    },
    {
      id: "lesson-06",
      order: 6,
      title: "Simple Past — Regular dan Irregular Verbs",
      videoTitle: "Past Simple — An Easy English Grammar Lesson",
      youtube: "kgcd4gj9zNw",
      body: `Video ini menunjukkan simple past melalui cerita aktivitas yang telah terjadi, seperti worked, studied, went, dan ate.

Regular verbs biasanya ditambah -ed. Pada pola konsonan-vokal-konsonan tertentu, konsonan terakhir digandakan sebelum -ed: stop menjadi stopped. Irregular verbs harus dipelajari bentuknya, misalnya take menjadi took, go menjadi went, dan see menjadi saw.

Untuk kalimat negatif, gunakan didn't + verb dasar. Untuk pertanyaan, gunakan Did + subject + verb dasar. Contoh: She didn't go dan Did she write a letter?`,
      quiz: [
        lessonQuiz("past2-q1", "Mengapa stop menjadi stopped?", "Akhir kata berpola konsonan-vokal-konsonan.", ["Stop adalah irregular verb.", "Subject-nya tunggal.", "Kalimatnya berbentuk negatif."]),
        lessonQuiz("past2-q2", "Apa bentuk lampau dari take?", "took", ["taked", "taken", "takes"]),
        lessonQuiz("past2-q3", "She _____ to the party last night.", "didn't go", ["didn't went", "not went", "doesn't go"]),
      ],
    },
    {
      id: "lesson-07",
      order: 7,
      title: "Simple Future — Penggunaan Will",
      videoTitle: "Learn English Tenses: FUTURE SIMPLE with WILL — Learn English with Rebecca",
      youtube: "tri7u632AaA",
      body: `Video ini membahas will untuk konteks formal, prediksi, keputusan spontan, janji, tawaran bantuan, dan kemungkinan. Dalam percakapan informal, rencana yang sudah dibuat sering memakai going to atau present continuous, sedangkan keputusan yang baru dibuat dapat memakai will.

Rumusnya subject + will + verb dasar untuk semua subject. Bentuk negatifnya will not/won't + verb dasar. Pertanyaan memakai Will + subject + verb dasar? Jawaban singkatnya, misalnya Yes, he will.

Pada conditional type 1, gunakan present simple setelah if/when dan will pada klausa utama: If I visit Bali, I will send you a postcard. Shall umum dipakai sebagai pertanyaan sopan dengan I atau we.`,
      quiz: [
        lessonQuiz("future1-q1", "Kapan will cocok dipakai dalam percakapan informal?", "Saat membuat keputusan spontan ketika berbicara.", ["Untuk rutinitas harian.", "Untuk kejadian kemarin.", "Hanya untuk rencana yang dijadwalkan bulan lalu."]),
        lessonQuiz("future1-q2", "Pilih conditional type 1 yang benar.", "If I visit Bali, I will send you a postcard.", ["If I will visit Bali, I will send you a postcard.", "If I visited Bali, I will send you a postcard.", "If I visit Bali, I send you a postcard."]),
        lessonQuiz("future1-q3", "I'll help you carry those bags menyatakan apa?", "Tawaran bantuan", ["Prediksi cuaca", "Jadwal kereta", "Kebiasaan masa lalu"]),
      ],
    },
    {
      id: "lesson-08",
      order: 8,
      title: "Simple Future — Bentuk dan Pilihan Ekspresi",
      videoTitle: "Simple Future with Will — Ellii",
      youtube: "n14zCZAvSjI",
      body: `Video ini membandingkan tiga cara membicarakan masa depan: will + verb dasar untuk keputusan saat itu, be going to + verb dasar untuk rencana, dan be + verb-ing untuk pengaturan yang sudah dijadwalkan.

Will adalah modal, jadi kata kerja setelahnya selalu bentuk dasar untuk semua subject: He will walk, bukan He will walks atau He will walking. Singkatan will adalah 'll. Gunakan bentuk seperti they'll untuk subject pronoun, tetapi tulis the students will, bukan the students'll.`,
      quiz: [
        lessonQuiz("future2-q1", "Bentuk kata kerja setelah will harus seperti apa?", "Base verb tanpa akhiran -s, -ed, atau -ing.", ["Verb-ing", "Past participle", "Verb + -s untuk he/she/it"]),
        lessonQuiz("future2-q2", "Manakah penggunaan contraction yang tepat?", "They'll drive to work tomorrow.", ["The students'll go to school on Monday.", "My brother'll walk his dog tomorrow.", "Maria'll give a presentation next week."]),
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
      "Susun kata: always / early / my sister / wakes up",
      "My sister always wakes up early.",
    ),
    order(
      "q23",
      "Susun kata: play / he / does / football / ?",
      "Does he play football?",
    ),
    order(
      "q24",
      "Susun kata: is / dinner / mother / cooking / my / now",
      "My mother is cooking dinner now.",
    ),
    order(
      "q25",
      "Susun kata: the students / are / studying / not / in the library",
      "The students are not studying in the library.",
    ),
    order(
      "q26",
      "Susun kata: visited / last week / we / our grandparents",
      "We visited our grandparents last week.",
    ),
    order(
      "q27",
      "Susun kata: did / you / what / yesterday / do / ?",
      "What did you do yesterday?",
    ),
    order(
      "q28",
      "Susun kata: will / the weather / tomorrow / be / cold",
      "The weather will be cold tomorrow.",
    ),
    order(
      "q29",
      "Susun kata: she / not / will / meet / her friend / tomorrow",
      "She will not meet her friend tomorrow.",
    ),
    order(
      "q30",
      "Susun kata: we / will / a picnic / have / next Sunday",
      "We will have a picnic next Sunday.",
    ),
  ],
};
