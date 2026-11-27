const $ = (s) => document.querySelector(s),
  A = $("#app");
const E = (s) =>
  String(s ?? "").replace(
    /[&<>"]/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c],
  );
const norm = (s) =>
    String(s)
      .toLowerCase()
      .replace(/[.,!?;:]/g, "")
      .replace(/\s+/g, " ")
      .trim(),
  shuf = (a) => {
    const shuffled = [...a];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  },
  shufQuestions = (questions, previousOrder = []) => {
    const shuffled = shuf(questions);
    if (
      shuffled.length > 1 &&
      shuffled.length === previousOrder.length &&
      shuffled.every((q, i) => q.id === previousOrder[i])
    ) {
      [shuffled[0], shuffled[1]] = [shuffled[1], shuffled[0]];
    }
    return shuffled;
  };
const ytIds = (v) => {
  const value = String(v || ""),
    ids = [],
    pattern = /(?:v=|youtu\.be\/|embed\/)([\w-]{11})/g;
  let match;
  while ((match = pattern.exec(value))) ids.push(match[1]);
  if (!ids.length) {
    ids.push(...value.split(/[\s,]+/).filter((id) => /^[\w-]{11}$/.test(id)));
  }
  return [...new Set(ids)];
};
let C = {},
  adminNotice = "";
const load = async () => {
  const [ms, qs, at] = await Promise.all([
    Store.list("materials"),
    Store.list("questions"),
    Store.list("attempts", !Store.me.admin),
  ]);
  ms.sort((a, b) => a.order - b.order);
  C = { ms, qs, at };
  return C;
};
const gate = (m) =>
  `<section class="gate-card"><span class="gate-mark">!</span><h1>Not available yet</h1><p>${E(m)}</p><a class="back-link" href="#/">Back to dashboard</a></section>`;
const mine = () =>
  Object.fromEntries(
    C.at.filter((a) => a.userId === Store.me.id).map((a) => [a.kind, a]),
  );
function auth() {
  return `<section class="auth-layout"><div class="auth-intro"><p class="eyebrow">Grammar Lab · learning space</p><div class="tiles"><span>She</span><span class="on">goes</span><span>to</span><span>campus</span><span>every</span><span>day.</span></div><h1>Understand grammar better. See your progress.</h1>
<p>Learn with bite-sized lessons, take the tests, and track your score improvement.</p><div class="auth-highlights"><span><b>01</b> Pre-test</span><span><b>02</b> Lessons</span><span><b>03</b> Post-test</span></div></div>
<section class="auth-panel"><div class="auth-panel-title"><span class="brand-mark">GL</span><div><h2>Start learning</h2><p>Sign in or create a new account.</p></div></div>
<div class="seg"><button type="button" class="on" data-a="tab" data-t="login">Sign in</button><button type="button" data-a="tab" data-t="reg">Register</button></div><section class="forms">
<form data-f="login"><label>Email<input name="email" type="email" placeholder="name@email.com" autocomplete="email" required></label><label>Password<input name="pw" type="password" placeholder="Password" autocomplete="current-password" required></label><button>Sign in</button><p class="err"></p>${Store.live ? "" : '<p class="hint">Demo mode. Admin: admin@demo.id / admin123</p>'}</form>
<form data-f="reg" class="hide"><label>Full name<input name="fullName" placeholder="Your full name" autocomplete="name" required></label><label>Study program<input name="prodi" placeholder="Study program" required></label><label>Student ID<input name="nim" placeholder="Enter your student ID" required></label>
<label>Email<input name="email" type="email" placeholder="name@email.com" autocomplete="email" required></label><label>Password<input name="pw" type="password" minlength="6" placeholder="At least 6 characters" autocomplete="new-password" required></label><button>Create account</button><p class="err"></p></form></section></section></section>`;
}
async function dash() {
  await load();
  const a = mine(),
    rd = Store.me.read || [],
    n = C.ms.filter((m) => rd.includes(m.id)).length,
    all = C.ms.length > 0 && n === C.ms.length;
  const st = [
    [
      "Pre-test",
      "#/tes/pre",
      !!a.pre,
      !a.pre,
      a.pre ? "Completed. Cannot be retaken" : "Complete this before starting the lessons",
    ],
    [
      "Lessons",
      "#/belajar",
      all,
      !!a.pre,
      a.post
        ? "Available to revisit anytime"
        : `${n} of ${C.ms.length} lessons completed`,
    ],
    [
      "Post-test",
      "#/tes/post",
      !!a.post,
      !!a.pre && all && !a.post,
      a.post
        ? "Completed. Cannot be retaken"
        : "Unlocks after all lessons are completed",
    ],
    ["Results", "#/hasil", false, !!a.post, "See how your score changed"],
  ];
  const progress = C.ms.length ? Math.round((n / C.ms.length) * 100) : 0;
  const nextLesson = C.ms.find((lesson) => !rd.includes(lesson.id));
  let nextAction = null;
  if (!a.pre) {
    nextAction = {
      href: "#/tes/pre",
      label: "START HERE",
      title: "Take the pre-test",
      action: "Start pre-test",
    };
  } else if (nextLesson) {
    nextAction = {
      href: `#/m/${E(nextLesson.id)}`,
      label: "NEXT LESSON",
      title: nextLesson.title,
      action: "Continue learning",
    };
  } else if (all && !a.post) {
    nextAction = {
      href: "#/tes/post",
      label: "ALL LESSONS COMPLETE",
      title: "Ready for your post-test?",
      action: "Take post-test",
    };
  } else if (a.post) {
    nextAction = {
      href: "#/hasil",
      label: "LEARNING COMPLETE",
      title: "See how your scores changed",
      action: "View results",
    };
  }
  const progressMessage = !a.pre
    ? "Take the pre-test to start your learning path."
    : all && a.post
      ? "You have completed all lessons and tests."
      : all
        ? "All lessons completed. The post-test is ready."
        : "Complete all lessons to unlock the post-test.";
  const continueMarkup = nextAction
    ? `<a class="dashboard-continue" href="${nextAction.href}"><span class="dashboard-continue-copy"><small>${nextAction.label}</small><b>${E(nextAction.title)}</b></span><span class="dashboard-continue-action">${nextAction.action}<span aria-hidden="true">→</span></span></a>`
    : "";
  return `<section class="dashboard"><div class="welcome-block"><p class="eyebrow">STUDENT DASHBOARD</p><h1>Hello, ${E(Store.me.fullName)}</h1><p>Ready to continue your grammar practice today?</p></div>
<section class="progress-card"><div class="progress-copy"><div><span class="eyebrow">LEARNING PROGRESS</span><h2>${n} of ${C.ms.length} lessons completed</h2></div><b>${progress}%</b></div><div class="progress-track"><i style="width:${progress}%"></i></div><p>${progressMessage}</p>${continueMarkup}</section>
<div class="section-title"><div><h2>Your learning path</h2><p>Follow these steps to complete your practice.</p></div></div>
<ol class="steps">${st.map((s, i) => {const status=s[2]?"done":s[3]?"open":"lock",content=`<span class="step-number">${s[2]?"✓":`0${i+1}`}</span><span class="step-copy"><small>STEP 0${i+1}</small><b>${s[0]}</b><span>${s[4]}</span></span><span class="step-status">${s[2]?"Completed":s[3]?"Start":"Locked"}</span>`;return `<li class="${status}">${s[3]?`<a href="${s[1]}">${content}</a>`:`<div class="step-disabled">${content}</div>`}</li>`;}).join("")}</ol></section>`;
}
async function belajar() {
  await load();
  if (!mine().pre) return gate("Complete the pre-test before starting the lessons.");
  const rd = Store.me.read || [];
  return `<section class="page-section"><a class="back-link" href="#/">← Dashboard</a><div class="page-heading"><p class="eyebrow">LEARNING SPACE</p><h1>Grammar lessons</h1><p>Watch the video, read the explanation, then answer three practice questions in each lesson.</p></div><div class="material-list">${C.ms.map((m, i) => `<a class="material-card" href="#/m/${E(m.id)}"><span class="material-number">${String(i+1).padStart(2,"0")}</span><span class="material-copy"><b>${E(m.title)}</b><small>${rd.includes(m.id) ? "Lesson completed" : `${m.youtube ? "Video" : "Lesson"} · ${m.quiz ? m.quiz.length + " practice questions" : "Read lesson"}`}</small></span><span class="material-status ${rd.includes(m.id) ? "complete" : ""}">${rd.includes(m.id) ? "Completed ✓" : "Not started"}</span></a>`).join("") || '<p class="empty-state">No lessons available yet. Please check back later.</p>'}</div></section>`;
}
async function materi(id) {
  await load();
  if (!mine().pre) return gate("Complete the pre-test before starting the lessons.");
  const m = C.ms.find((x) => x.id === id);
  if (!m) return '<section class="gate-card"><h1>Lesson not found</h1><a class="back-link" href="#/belajar">Back to lessons</a></section>';
  const videos = ytIds(m.youtube),
    quiz = shuf(m.quiz || []);
  const read = (Store.me.read || []).includes(m.id);
  const lessonIndex = C.ms.findIndex((lesson) => lesson.id === m.id),
    previousLesson = C.ms[lessonIndex - 1],
    nextLesson = C.ms[lessonIndex + 1],
    lessonNumber = lessonIndex + 1,
    lessonProgress = Math.round((lessonNumber / C.ms.length) * 100),
    allLessonsRead =
      C.ms.length > 0 &&
      C.ms.every((lesson) => (Store.me.read || []).includes(lesson.id)),
    previousMarkup = previousLesson
      ? `<a href="#/m/${E(previousLesson.id)}">← Previous lesson</a>`
      : '<span class="lesson-nav-spacer" aria-hidden="true"></span>',
    nextNavHref = nextLesson
      ? `#/m/${E(nextLesson.id)}`
      : allLessonsRead
        ? "#/tes/post"
        : "#/belajar",
    nextNavLabel = nextLesson
      ? "Next lesson →"
      : allLessonsRead
        ? "Go to post-test →"
        : "All lessons →",
    continueHref = nextLesson
      ? `#/m/${E(nextLesson.id)}`
      : allLessonsRead
        ? "#/tes/post"
        : "#/belajar",
    continueLabel = nextLesson
      ? "Continue to next lesson"
      : allLessonsRead
        ? "Continue to post-test"
        : "Continue to lesson list";
  const lessonNavigation = `<div class="lesson-progress"><div class="lesson-progress-label"><span>LESSON ${String(lessonNumber).padStart(2, "0")} OF ${String(C.ms.length).padStart(2, "0")}</span><b>${lessonProgress}%</b></div><div class="lesson-progress-track" role="progressbar" aria-label="Lesson progress" aria-valuemin="0" aria-valuemax="${C.ms.length}" aria-valuenow="${lessonNumber}"><span style="width:${lessonProgress}%"></span></div></div><nav class="lesson-navigation" aria-label="Lesson navigation">${previousMarkup}<a href="${nextNavHref}">${nextNavLabel}</a></nav>`;
  const body = String(m.body || "")
    .split("\n")
    .filter(Boolean)
    .map((line) =>
      line.startsWith(">")
        ? `<p class="ex">${E(line.slice(1).trim())}</p>`
        : `<p>${E(line)}</p>`,
    )
    .join("");
  const videoMarkup = videos.length
    ? `<section class="lesson-video"><h2>${E(m.videoTitle || "Lesson video")}</h2><div class="vid-grid">${videos.map((video, i) => `<div class="vid"><iframe src="https://www.youtube.com/embed/${video}" title="${E(m.videoTitle || `Video ${i + 1}: ${m.title}`)}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen loading="lazy" referrerpolicy="strict-origin-when-cross-origin"></iframe></div>`).join("")}</div></section>`
    : "";
  const quizMarkup = quiz.length
    ? `<section class="lesson-quiz"><div class="lesson-quiz-heading"><h2>Check your understanding</h2><p>${quiz.length} multiple-choice questions with randomized question and answer order.</p></div><form data-f="lessonQuiz" data-material="${E(m.id)}">${quiz
        .map(
          (question, i) =>
            `<fieldset data-id="${E(question.id)}"><legend>${i + 1}. ${E(question.text)}</legend>${shuf(
              question.options || [],
            )
              .map(
                (option) =>
                  `<label class="opt"><input type="radio" name="q${i}" value="${E(option)}" required>${E(option)}</label>`,
              )
              .join("")}<p class="lesson-question-feedback" role="status" aria-live="polite"></p></fieldset>`,
        )
        .join("")}<button type="submit">Check answers</button><p class="lesson-quiz-result" role="status" aria-live="polite"></p></form></section>`
    : "";
  const actions = read
    ? `<div class="completion-actions"><a class="completion-secondary" href="#/">Back to dashboard</a><a class="completion-primary" href="${continueHref}">${continueLabel} →</a></div>`
    : `<div class="lesson-actions"><button data-a="read" data-id="${E(m.id)}">Mark as complete</button><a class="back-link" href="#/belajar">Back to all lessons</a></div>`;
  return `<section class="page-section"><a class="back-link" href="#/belajar">← All lessons</a><div class="page-heading"><p class="eyebrow">GRAMMAR LESSON</p><h1>${E(m.title)}</h1></div>${lessonNavigation}${videoMarkup}<article class="lesson-card"><h2>Explanation</h2>${body}</article>${quizMarkup}${actions}</section>`;
}
async function tes(kind) {
  await load();
  const a = mine();
  if (!["pre", "post"].includes(kind)) return gate("Test not found.");
  if (a[kind]) {
    const nextHref = kind === "pre" ? "#/belajar" : "#/hasil",
      nextLabel = kind === "pre" ? "Continue to lessons" : "Continue to results";
    return `<section class="gate-card completion-card"><span class="gate-mark">✓</span><p class="eyebrow">${kind === "pre" ? "STEP 01 COMPLETE" : "STEP 03 COMPLETE"}</p><h1>${kind === "pre" ? "Pre-test" : "Post-test"} completed</h1><p>You can only take this test once. Thank you for completing it.</p><div class="completion-actions"><a class="completion-secondary" href="#/">Back to dashboard</a><a class="completion-primary" href="${nextHref}">${nextLabel} →</a></div></section>`;
  }
  if (
    kind === "post" &&
    (!a.pre ||
      !C.ms.length ||
      !C.ms.every((m) => (Store.me.read || []).includes(m.id)))
  )
    return gate(
      "The post-test unlocks after you complete the pre-test and mark all lessons as complete.",
    );
  const available = C.qs.filter((q) => (q.use || []).includes(kind));
  const previousOrder =
    kind === "post" && a.pre
      ? (a.pre.detail || []).map((item) => item.q)
      : [];
  const qs = shufQuestions(available, previousOrder);
  if (!qs.length) return '<section class="gate-card"><h1>No questions available</h1><p>Please check back later.</p><a class="back-link" href="#/">Back to dashboard</a></section>';
  return `<section class="page-section test-page"><a class="back-link" href="#/">← Dashboard</a><div class="page-heading"><p class="eyebrow">${kind === "pre" ? "STEP 01" : "STEP 03"}</p><h1>${kind === "pre" ? "Pre-test" : "Post-test"}</h1><p>Questions are randomized, and the post-test uses a different order. Number of questions: ${qs.length}.</p></div><form class="test-form" data-f="test" data-kind="${kind}">${qs
    .map(
      (q, i) =>
        `<fieldset data-id="${q.id}"><legend>${i + 1}. ${E(q.text)}</legend>` +
        (q.type === "mc"
          ? shuf(q.options)
              .map(
                (o) =>
                  `<label class="opt"><input type="radio" name="q${i}" value="${E(o)}">${E(o)}</label>`,
              )
              .join("")
          : q.type === "fill"
            ? `<input name="q${i}" autocomplete="off" placeholder="Your answer">`
            : `<div class="ord" data-i="${i}"><div class="ans"></div><div class="pool">${shuf(
                q.answer.split(/\s+/),
              )
                .map(
                  (w) =>
                    `<button type="button" class="chip" data-a="chip">${E(w)}</button>`,
                )
                .join("")}</div></div>`) +
        `</fieldset>`,
    )
    .join("")}<div class="test-submit"><p>Review your answers before submitting.</p><button>Submit answers</button></div><p class="err"></p></form></section>`;
}
async function hasil() {
  await load();
  const a = mine();
  if (!a.pre || !a.post)
    return '<section class="gate-card"><span class="gate-mark">↗</span><h1>Your results will be available soon</h1><p>Complete both the pre-test and post-test to compare your scores.</p><a class="back-link" href="#/">Back to dashboard</a></section>';
  const p = (a.pre.score / a.pre.total) * 100,
    q = (a.post.score / a.post.total) * 100,
    d = Math.round(q - p);
  return `<section class="page-section results-page"><a class="back-link" href="#/">← Dashboard</a><div class="results-hero"><p class="eyebrow">PRACTICE RESULTS</p><h1>Your progress</h1><div class="big"><b>${d > 0 ? "+" : ""}${d}</b><span>score change in points</span></div><p>${d > 0 ? "Great work! Your score improved after studying." : d < 0 ? "Keep practicing. You can improve your next result." : "Your score stayed the same. Keep practicing to improve."}</p></div><section class="score-comparison"><h2>Score comparison</h2>${[
    ["Pre-test", a.pre, p],
    ["Post-test", a.post, q],
  ]
    .map(
      (r) =>
        `<div class="bar"><div class="bar-label"><span>${r[0]}</span><b>${Math.round(r[2])}% <small>(${r[1].score}/${r[1].total})</small></b></div><div><i style="width:${r[2]}%"></i></div></div>`,
    )
    .join("")}<p class="hint">Thank you for completing the practice.</p></section></section>`;
}
async function admin(tab) {
  await load();
  const us = (await Store.list("users")).filter((u) => !u.admin),
    tabs = ["responden", "materi", "soal"];
  tab = tabs.includes(tab) ? tab : "responden";
  let b = "";
  if (tab === "responden") {
    window._students = us;
    const rows = us.map((u) => {
      const p = C.at.find((a) => a.userId === u.id && a.kind === "pre"),
        o = C.at.find((a) => a.userId === u.id && a.kind === "post"),
        f = (x) => (x ? Math.round((x.score / x.total) * 100) : "");
      return {
        NIM: u.nim,
        Nama: u.fullName,
        Prodi: u.prodi,
        Email: u.email,
        Pre: f(p),
        Post: f(o),
        Selisih: p && o ? f(o) - f(p) : "",
      };
    });
    window._rows = rows;
    const formatScore = (score) => (score === "" ? "—" : `${score}%`);
    const studentCards = rows
      .map((r, i) => {
        const searchText = [r.NIM, r.Nama, r.Prodi, r.Email].join(" ");
        const preTaken = r.Pre !== "",
          postTaken = r.Post !== "",
          difference =
            r.Selisih === ""
              ? "—"
              : `${r.Selisih > 0 ? "+" : ""}${r.Selisih}`;
        return `<article class="student-card" data-student-index="${i}" data-student-search="${E(searchText)}" data-pre="${preTaken}" data-post="${postTaken}">
          <div class="student-card-header"><div><small>PROFIL MAHASISWA</small><h3>${E(r.Nama) || "Tanpa nama"}</h3><span>NIM ${E(r.NIM) || "—"}</span></div><div class="admin-row-actions"><button class="ghost" data-a="student-edit" data-id="${E(us[i].id)}">Edit</button><button class="ghost danger" data-a="student-delete" data-id="${E(us[i].id)}">Hapus</button></div></div>
          <dl class="student-card-details"><div><dt>Program studi</dt><dd>${E(r.Prodi) || "—"}</dd></div><div class="student-card-email"><dt>Email</dt><dd>${E(r.Email) || "—"}</dd></div><div><dt>Pre-test</dt><dd><span class="score-pill ${preTaken ? "is-complete" : "is-pending"}">${formatScore(r.Pre)}</span></dd></div><div><dt>Post-test</dt><dd><span class="score-pill ${postTaken ? "is-complete" : "is-pending"}">${formatScore(r.Post)}</span></dd></div><div><dt>Selisih skor</dt><dd><span class="score-pill">${difference}</span></dd></div></dl>
        </article>`;
      })
      .join("");
    b = `<section class="admin-toolbar"><div><h2>Mahasiswa</h2><p>Kelola akun, profil, dan pantau hasil tes.</p></div><div class="admin-toolbar-actions"><span class="admin-count"><b>${rows.length}</b> mahasiswa</span><button class="ghost" data-a="xlsx">Ekspor Excel</button></div></section>
  <section class="admin-panel"><div class="admin-section-head"><div><h2>Data mahasiswa</h2><p>Tambahkan akun baru atau pilih Edit pada tabel untuk memperbarui profil.</p></div></div>
  <form class="admin-form" data-f="student"><input type="hidden" name="id"><div class="admin-fields">
  <label>Nama lengkap<input name="fullName" placeholder="Contoh: Siti Aminah" required></label>
  <label>Program studi<input name="prodi" placeholder="Contoh: Pendidikan Bahasa Inggris" required></label>
  <label>NIM<input name="nim" placeholder="Masukkan NIM" required></label>
  <label>Email akun<input name="email" type="email" placeholder="nama@email.com" required></label>
  <label>Password akun<input name="password" type="password" minlength="6" placeholder="Minimal 6 karakter" required><small>Wajib diisi saat membuat akun mahasiswa.</small></label>
  </div><div class="admin-form-actions"><button>Simpan mahasiswa</button><button type="button" class="ghost hide" data-a="student-reset">Batal edit</button></div><p class="err"></p></form></section>
  <section class="admin-panel"><div class="admin-section-head"><div><h2>Daftar mahasiswa</h2><p>Cari mahasiswa atau filter berdasarkan progres tes.</p></div></div>
  <div class="admin-student-filters"><label class="admin-student-search">Cari mahasiswa<input type="search" data-student-search placeholder="Nama, NIM, prodi, atau email"></label><label>Status tes<select data-student-status><option value="all">Semua mahasiswa</option><option value="not-started">Belum mengerjakan tes</option><option value="pre-taken">Pre-test selesai</option><option value="both-complete">Pre-test & post-test selesai</option></select></label><span class="admin-filter-count" role="status">Menampilkan ${rows.length} dari ${rows.length} mahasiswa</span></div>
  <p class="admin-filter-empty" role="status" hidden>Tidak ada mahasiswa yang cocok dengan pencarian ini.</p>
  <div class="scroll"><table class="admin-table"><thead><tr>${["NIM", "Nama", "Program studi", "Email", "Pre-test", "Post-test", "Selisih", "Aksi"].map((h) => `<th>${h}</th>`).join("")}</tr></thead><tbody>${rows.length ? rows.map((r, i) => `<tr data-student-index="${i}"><td class="admin-nim">${E(r.NIM)}</td><td class="admin-name">${E(r.Nama)}</td><td>${E(r.Prodi)}</td><td class="admin-email">${E(r.Email)}</td><td><span class="score-pill ${r.Pre !== "" ? "is-complete" : "is-pending"}">${formatScore(r.Pre)}</span></td><td><span class="score-pill ${r.Post !== "" ? "is-complete" : "is-pending"}">${formatScore(r.Post)}</span></td><td><span class="score-pill">${r.Selisih === "" ? "—" : `${r.Selisih > 0 ? "+" : ""}${r.Selisih}`}</span></td><td><div class="admin-row-actions"><button class="ghost" data-a="student-edit" data-id="${E(us[i].id)}">Edit</button><button class="ghost danger" data-a="student-delete" data-id="${E(us[i].id)}">Hapus</button></div></td></tr>`).join("") : '<tr><td colspan="8" class="admin-empty">Belum ada data mahasiswa.</td></tr>'}</tbody></table></div>
  <div class="student-card-list">${studentCards}</div></section>`;
  } else if (tab === "materi")
    b = `<section class="admin-panel"><div class="admin-section-head"><div><h2>Tambah atau edit materi</h2><p>Susun materi sebagai bacaan singkat yang mudah diikuti.</p></div></div><form class="admin-form" data-f="mat"><input type="hidden" name="id"><div class="admin-fields">
  <label>Judul materi<input name="title" placeholder="Contoh: Simple Present Tense" required></label><label>Urutan<input name="order" type="number" placeholder="Contoh: 1" required></label>
  <label class="field-wide">Isi materi<textarea name="body" rows="6" placeholder="Tulis materi. Baris yang diawali > akan ditampilkan sebagai contoh kalimat."></textarea></label><label class="field-wide">Video YouTube (opsional)<textarea name="youtube" rows="3" placeholder="Tempel URL atau ID video, satu per baris"></textarea></label>
  </div><div class="admin-form-actions"><button>Simpan materi</button></div></form></section>
  <section class="admin-panel"><div class="admin-section-head"><div><h2>Materi tersimpan</h2><p>${C.ms.length} materi tersedia.</p></div></div><div class="admin-item-list">${C.ms.map((m) => `<div class="admin-item"><div><small>MATERI ${String(m.order).padStart(2,"0")}</small><b>${E(m.title)}</b></div><div class="admin-row-actions"><button class="ghost" data-a="edit" data-c="ms" data-id="${E(m.id)}">Edit</button><button class="ghost danger" data-a="del" data-c="materials" data-id="${E(m.id)}">Hapus</button></div></div>`).join("") || '<p class="empty-state">Belum ada materi.</p>'}</div></section>`;
  else
    b = `<section class="admin-panel"><div class="admin-section-head"><div><h2>Tambah atau edit soal</h2><p>Pilih tipe soal dan atur tes tempat soal akan digunakan.</p></div></div><form class="admin-form" data-f="soal"><input type="hidden" name="id"><div class="admin-fields">
  <label>Tipe soal<select name="type"><option value="mc">Pilihan ganda</option><option value="fill">Isian</option><option value="order">Susun kalimat</option></select></label><label class="field-wide">Teks soal<input name="text" placeholder="Untuk soal isian, tulis ___ pada bagian yang kosong" required></label>
  <label class="field-wide">Pilihan jawaban<textarea name="options" rows="4" placeholder="Untuk pilihan ganda: satu opsi per baris, baris pertama adalah jawaban benar."></textarea></label><label class="field-wide">Jawaban benar<input name="answer" placeholder="Untuk isian, jawaban alternatif pisahkan dengan |"></label>
  </div><div class="admin-checkboxes"><label class="opt"><input type="checkbox" name="pre" checked>Dipakai di pre-test</label><label class="opt"><input type="checkbox" name="post" checked>Dipakai di post-test</label></div><div class="admin-form-actions"><button>Simpan soal</button></div></form></section>
  <section class="admin-panel"><div class="admin-section-head"><div><h2>Soal tersimpan</h2><p>${C.qs.length} soal tersedia.</p></div></div><div class="admin-item-list">${C.qs.map((q) => `<div class="admin-item"><div><small>${E(q.type.toUpperCase())}</small><b>${E(q.text)}</b></div><div class="admin-row-actions"><button class="ghost" data-a="edit" data-c="qs" data-id="${E(q.id)}">Edit</button><button class="ghost danger" data-a="del" data-c="questions" data-id="${E(q.id)}">Hapus</button></div></div>`).join("") || '<p class="empty-state">Belum ada soal.</p>'}</div></section>`;
  return `<div class="admin-heading"><div><p class="admin-kicker">GRAMMAR LAB / ADMINISTRATOR</p><h1>Panel admin</h1><p>Kelola materi, soal, dan data mahasiswa dalam satu tempat.</p></div><div class="admin-heading-actions"><button class="ghost" data-a="seed">Perbarui ${SEED.materials.length} materi & soal</button><span class="admin-import-status" role="status">${E(adminNotice)}</span></div></div><nav class="tabs admin-tabs">${tabs.map((t) => `<a class="${t === tab ? "on" : ""}" href="#/admin/${t}">${t}</a>`).join("")}</nav><div class="admin-content">${b}</div>`;
}
async function view() {
  const [, p, id] = location.hash.split("/"),
    me = Store.me;
  A.className = me && me.admin ? "wide" : me ? "user-page" : "auth-page";
  $("#nav").innerHTML = me
    ? (me.admin
        ? '<a class="nav-icon" href="#/" aria-label="Admin" title="Admin"><svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="8" height="8" rx="1.5"/><rect x="13" y="3" width="8" height="8" rx="1.5"/><rect x="13" y="13" width="8" height="8" rx="1.5"/><rect x="3" y="13" width="8" height="8" rx="1.5"/></svg></a>'
        : '<a class="nav-icon" href="#/" aria-label="Dashboard" title="Dashboard"><svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/></svg></a>') +
      '<button class="ghost nav-icon" type="button" data-a="out" aria-label="Sign out" title="Sign out"><svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg></button>'
    : "";
  try {
    A.innerHTML = !me
      ? auth()
      : me.admin
        ? await admin(p === "admin" ? id : "responden")
        : p === "belajar"
          ? await belajar()
          : p === "m"
            ? await materi(id)
            : p === "tes"
              ? await tes(id)
              : p === "hasil"
                ? await hasil()
                : await dash();
  } catch (e) {
    A.innerHTML = `<p class="err">${E(e.message)}</p>`;
  }
}
function filterStudentRecords() {
  const search = document.querySelector("[data-student-search]"),
    status = document.querySelector("[data-student-status]");
  if (!search || !status) return;
  const query = search.value.trim().toLowerCase(),
    cards = [...document.querySelectorAll(".student-card")],
    rows = [...document.querySelectorAll(".admin-table tbody tr[data-student-index]")];
  let visible = 0;
  cards.forEach((card, index) => {
    const preTaken = card.dataset.pre === "true",
      postTaken = card.dataset.post === "true";
    let matchesStatus = true;
    if (status.value === "not-started")
      matchesStatus = !preTaken && !postTaken;
    else if (status.value === "pre-taken") matchesStatus = preTaken;
    else if (status.value === "both-complete")
      matchesStatus = preTaken && postTaken;
    const matches =
      card.dataset.studentSearch.toLowerCase().includes(query) &&
      matchesStatus;
    card.classList.toggle("is-filtered", !matches);
    if (rows[index]) rows[index].classList.toggle("is-filtered", !matches);
    if (matches) visible++;
  });
  const count = document.querySelector(".admin-filter-count"),
    empty = document.querySelector(".admin-filter-empty");
  if (count)
    count.textContent = `Menampilkan ${visible} dari ${cards.length} mahasiswa`;
  if (empty) empty.hidden = cards.length === 0 || visible > 0;
}
document.addEventListener("input", (event) => {
  if (event.target.matches("[data-student-search]")) filterStudentRecords();
});
document.addEventListener("change", (event) => {
  if (event.target.matches("[data-student-status]")) filterStudentRecords();
});
document.addEventListener("submit", async (e) => {
  e.preventDefault();
  const f = e.target,
    d = Object.fromEntries(new FormData(f)),
    k = f.dataset.f,
    m = f.querySelector(".err");
  try {
    if (m) m.textContent = "";
    if (k === "login") await Store.login(d.email, d.pw);
    else if (k === "reg") {
      const { pw, ...p } = d;
      await Store.register(p, pw);
    } else if (k === "lessonQuiz") {
      const lesson = C.ms.find((item) => item.id === f.dataset.material);
      if (!lesson) throw Error("Lesson quiz not found.");
      const answers = new FormData(f);
      let score = 0;
      const fields = [...f.querySelectorAll("fieldset")];
      fields.forEach((field, i) => {
        const question = (lesson.quiz || []).find(
          (item) => item.id === field.dataset.id,
        );
        if (!question) throw Error("Practice question not found.");
        const correct = norm(answers.get("q" + i) || "") === norm(question.answer);
        if (correct) score++;
        field.querySelectorAll(".opt").forEach((option) => {
          option.classList.remove("is-correct", "is-incorrect");
        });
        const message = field.querySelector(".lesson-question-feedback");
        message.classList.remove("is-correct", "is-incorrect");
        const selected = field.querySelector("input:checked");
        if (selected) {
          selected.closest(".opt").classList.add(
            correct ? "is-correct" : "is-incorrect",
          );
        }
        message.classList.add(correct ? "is-correct" : "is-incorrect");
        message.textContent = correct
          ? "Correct!"
          : `Not quite. Correct answer: ${question.answer}.`;
      });
      const result = f.querySelector(".lesson-quiz-result");
      result.textContent = `Score ${score}/${fields.length}.`;
      return;
    } else if (k === "test") {
      const kind = f.dataset.kind,
        qs = [...f.querySelectorAll("fieldset")].map((x) =>
          C.qs.find((q) => q.id === x.dataset.id),
        );
      let sc = 0;
      const detail = qs.map((q, i) => {
        let ok = false;
        if (q.type === "mc") ok = d["q" + i] === q.options[0];
        else if (q.type === "fill")
          ok = String(q.answer)
            .split("|")
            .map(norm)
            .includes(norm(d["q" + i] || ""));
        else
          ok =
            norm(
              [...f.querySelectorAll(`.ord[data-i="${i}"] .ans .chip`)]
                .map((c) => c.textContent)
                .join(" "),
            ) === norm(q.answer);
        sc += ok;
        return { q: q.id, ok };
      });
      await Store.set("attempts", Store.me.id + "_" + kind, {
        userId: Store.me.id,
        kind,
        score: sc,
        total: qs.length,
        detail,
        at: new Date().toISOString(),
      });
      location.hash = `#/tes/${kind}`;
      await view();
      return;
    } else if (k === "mat") {
      const id = d.id || "m" + Date.now();
      const existing = C.ms.find((item) => item.id === id);
      await Store.set("materials", id, {
        title: d.title,
        order: +d.order,
        body: d.body,
        youtube: d.youtube,
        quiz: existing ? existing.quiz || [] : [],
        videoTitle: existing ? existing.videoTitle || "" : "",
      });
    } else if (k === "soal") {
      const id = d.id || "q" + Date.now(),
        o = {
          type: d.type,
          text: d.text,
          use: ["pre", "post"].filter((x) => d[x]),
        };
      if (d.type === "mc")
        o.options = d.options
          .split("\n")
          .map((s) => s.trim())
          .filter(Boolean);
      else o.answer = d.answer;
      if (d.type === "mc" && o.options.length < 2)
        throw Error("Isi minimal 2 opsi.");
      await Store.set("questions", id, o);
    } else if (k === "student") {
      const { id, password, ...student } = d;
      if (id) await Store.updateStudent(id, student);
      else await Store.createStudent(student, password);
    }
    view();
  } catch (x) {
    m ? (m.textContent = x.message) : alert(x.message);
  }
});
document.addEventListener("click", async (e) => {
  const b = e.target.closest("[data-a]");
  if (!b) return;
  const a = b.dataset.a,
    id = b.dataset.id;
  if (a === "tab") {
    document
      .querySelectorAll(".seg button")
      .forEach((x) => x.classList.toggle("on", x === b));
    document
      .querySelectorAll(".forms form")
      .forEach((f) => f.classList.toggle("hide", f.dataset.f !== b.dataset.t));
  }
  if (a === "out") {
    await Store.logout();
    location.hash = "#/";
    view();
  }
  if (a === "read") {
    await Store.markRead(id);
    await view();
  }
  if (a === "chip") {
    const o = b.closest(".ord");
    o.querySelector(
      b.parentNode.className === "pool" ? ".ans" : ".pool",
    ).append(b);
  }
  if (a === "seed") {
    if (b.dataset.confirmSeed !== "true") {
      b.dataset.confirmSeed = "true";
      b.textContent = "Klik lagi untuk impor";
      b.classList.add("confirm-seed");
      adminNotice =
        `Klik lagi untuk memperbarui ${SEED.materials.length} video materi dan ${SEED.materials.reduce((sum, item) => sum + (item.quiz || []).length, 0)} soal latihan. 30 soal pre/post tetap tersedia.`;
      const status = $(".admin-import-status");
      if (status) status.textContent = adminNotice;
      return;
    }
    b.disabled = true;
    b.textContent = "Sedang mengimpor...";
    adminNotice = `Mengirim ${SEED.materials.length} materi video, soal latihan, dan ${SEED.questions.length} soal pre/post ke Firebase...`;
    const status = $(".admin-import-status");
    if (status) status.textContent = adminNotice;
    try {
      await Store.seed();
      adminNotice = `Berhasil: ${SEED.materials.length} materi video, ${SEED.materials.reduce((sum, item) => sum + (item.quiz || []).length, 0)} soal latihan, dan ${SEED.questions.length} soal pre/post sudah diperbarui.`;
      await view();
    } catch (x) {
      b.disabled = false;
      b.dataset.confirmSeed = "";
      b.classList.remove("confirm-seed");
      b.textContent = "Perbarui data materi & soal";
      adminNotice = `Impor gagal: ${x.message}`;
      if (status) status.textContent = adminNotice;
    }
    return;
  }
  if (a === "student-edit") {
    const r = window._students.find((x) => x.id === id),
      f = $('form[data-f="student"]');
    if (!r || !f) return;
    for (const k of ["fullName", "prodi", "nim", "email"])
      f.elements[k].value = r[k] || "";
    f.elements.id.value = id;
    f.elements.password.value = "";
    f.elements.password.required = false;
    f.elements.password.disabled = true;
    f.elements.password.placeholder = "Password hanya saat membuat akun";
    f.querySelector('[data-a="student-reset"]').classList.remove("hide");
    scrollTo(0, 0);
  }
  if (a === "student-reset") {
    const f = $('form[data-f="student"]');
    f.reset();
    f.elements.id.value = "";
    f.elements.password.required = true;
    f.elements.password.disabled = false;
    f.elements.password.placeholder = "Minimal 6 karakter";
    b.classList.add("hide");
  }
  if (
    a === "student-delete" &&
    confirm(
      "Hapus akun login, profil, dan seluruh histori tes mahasiswa ini secara permanen?",
    )
  ) {
    try {
      await Store.deleteStudent(id);
      view();
    } catch (x) {
      alert(x.message);
    }
  }
  if (a === "del") {
    if (b.dataset.confirmDelete !== "true") {
      b.dataset.confirmDelete = "true";
      b.textContent = "Konfirmasi hapus";
      b.classList.add("confirm-delete");
      return;
    }
    b.disabled = true;
    b.textContent = "Menghapus...";
    try {
      await Store.del(b.dataset.c, id);
      await view();
    } catch (x) {
      b.disabled = false;
      b.textContent = "Konfirmasi hapus";
      alert(`Gagal menghapus data: ${x.message}`);
    }
    return;
  }
  if (a === "edit") {
    const r = C[b.dataset.c].find((x) => x.id === id),
      f = $("form");
    for (const k in r) {
      const el = f.elements[k];
      if (el && el.type !== "checkbox")
        el.value = Array.isArray(r[k]) ? r[k].join("\n") : r[k];
    }
    if (f.elements.pre) {
      f.elements.pre.checked = (r.use || []).includes("pre");
      f.elements.post.checked = (r.use || []).includes("post");
    }
    f.elements.id.value = id;
    scrollTo(0, 0);
  }
  if (a === "xlsx") {
    if (!window.XLSX) {
      alert(
        "Fitur ekspor Excel gagal dimuat. Periksa koneksi internet lalu coba lagi.",
      );
      return;
    }
    const headers = ["NIM", "Nama", "Prodi", "Email", "Pre", "Post", "Selisih"],
      sheet = XLSX.utils.aoa_to_sheet([
        headers,
        ...window._rows.map((r) => headers.map((h) => r[h] ?? "")),
      ]),
      book = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(book, sheet, "Responden");
    XLSX.writeFile(book, "responden.xlsx");
  }
});
addEventListener("hashchange", view);
Store.init().then(view);
