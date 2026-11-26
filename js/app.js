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
  `<section class="gate-card"><span class="gate-mark">!</span><h1>Belum bisa dibuka</h1><p>${E(m)}</p><a class="back-link" href="#/">Kembali ke beranda</a></section>`;
const mine = () =>
  Object.fromEntries(
    C.at.filter((a) => a.userId === Store.me.id).map((a) => [a.kind, a]),
  );
function auth() {
  return `<section class="auth-layout"><div class="auth-intro"><p class="eyebrow">Grammar Lab · ruang belajar</p><div class="tiles"><span>She</span><span class="on">goes</span><span>to</span><span>campus</span><span>every</span><span>day.</span></div><h1>Grammar makin paham, progres makin terlihat.</h1>
<p>Belajar lewat materi singkat, kerjakan tes, lalu lihat perubahan skormu.</p><div class="auth-highlights"><span><b>01</b> Pre-test</span><span><b>02</b> Materi belajar</span><span><b>03</b> Post-test</span></div></div>
<section class="auth-panel"><div class="auth-panel-title"><span class="brand-mark">GL</span><div><h2>Mulai belajar</h2><p>Masuk ke akunmu atau buat akun baru.</p></div></div>
<div class="seg"><button type="button" class="on" data-a="tab" data-t="login">Masuk</button><button type="button" data-a="tab" data-t="reg">Daftar</button></div><section class="forms">
<form data-f="login"><label>Email<input name="email" type="email" placeholder="nama@email.com" autocomplete="email" required></label><label>Password<input name="pw" type="password" placeholder="Password" autocomplete="current-password" required></label><button>Masuk</button><p class="err"></p>${Store.live ? "" : '<p class="hint">Mode demo. Admin: admin@demo.id / admin123</p>'}</form>
<form data-f="reg" class="hide"><label>Nama lengkap<input name="fullName" placeholder="Nama sesuai identitas" autocomplete="name" required></label><label>Program studi<input name="prodi" placeholder="Program studi" required></label><label>NIM<input name="nim" placeholder="Nomor induk mahasiswa" required></label>
<label>Email<input name="email" type="email" placeholder="nama@email.com" autocomplete="email" required></label><label>Password<input name="pw" type="password" minlength="6" placeholder="Minimal 6 karakter" autocomplete="new-password" required></label><button>Buat akun</button><p class="err"></p></form></section></section></section>`;
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
      a.pre ? "Selesai. Tidak bisa diulang" : "Kerjakan dulu sebelum belajar",
    ],
    [
      "Belajar",
      "#/belajar",
      all,
      !!a.pre,
      a.post
        ? "Bisa dibuka lagi kapan saja"
        : `${n} dari ${C.ms.length} materi dibaca`,
    ],
    [
      "Post-test",
      "#/tes/post",
      !!a.post,
      !!a.pre && all && !a.post,
      a.post
        ? "Selesai. Tidak bisa diulang"
        : "Terbuka setelah semua materi dibaca",
    ],
    ["Hasil", "#/hasil", false, !!a.post, "Lihat perubahan skormu"],
  ];
  const progress = C.ms.length ? Math.round((n / C.ms.length) * 100) : 0;
  return `<section class="dashboard"><div class="welcome-block"><p class="eyebrow">BERANDA MAHASISWA</p><h1>Halo, ${E(Store.me.fullName)}</h1><p>Siap melanjutkan latihan grammar hari ini?</p></div>
<section class="progress-card"><div class="progress-copy"><div><span class="eyebrow">PROGRES BELAJAR</span><h2>${n} dari ${C.ms.length} materi selesai</h2></div><b>${progress}%</b></div><div class="progress-track"><i style="width:${progress}%"></i></div><p>${progress === 100 ? "Semua materi sudah selesai. Post-test siap dikerjakan." : "Selesaikan semua materi untuk membuka post-test."}</p></section>
<div class="section-title"><div><h2>Langkah belajarmu</h2><p>Ikuti urutan ini untuk menyelesaikan latihan.</p></div></div>
<ol class="steps">${st.map((s, i) => {const status=s[2]?"done":s[3]?"open":"lock",content=`<span class="step-number">${s[2]?"✓":`0${i+1}`}</span><span class="step-copy"><small>LANGKAH 0${i+1}</small><b>${s[0]}</b><span>${s[4]}</span></span><span class="step-status">${s[2]?"Selesai":s[3]?"Mulai":"Terkunci"}</span>`;return `<li class="${status}">${s[3]?`<a href="${s[1]}">${content}</a>`:`<div class="step-disabled">${content}</div>`}</li>`;}).join("")}</ol></section>`;
}
async function belajar() {
  await load();
  if (!mine().pre) return gate("Kerjakan pre-test dulu sebelum belajar.");
  const rd = Store.me.read || [];
  return `<section class="page-section"><a class="back-link" href="#/">← Beranda</a><div class="page-heading"><p class="eyebrow">RUANG BELAJAR</p><h1>Materi grammar</h1><p>Tonton video, pelajari penjelasan, lalu kerjakan tiga soal latihan di tiap materi.</p></div><div class="material-list">${C.ms.map((m, i) => `<a class="material-card" href="#/m/${E(m.id)}"><span class="material-number">${String(i+1).padStart(2,"0")}</span><span class="material-copy"><b>${E(m.title)}</b><small>${rd.includes(m.id) ? "Materi sudah selesai" : `${m.youtube ? "Video" : "Materi"} · ${m.quiz ? m.quiz.length + " soal latihan" : "Baca materi"}`}</small></span><span class="material-status ${rd.includes(m.id) ? "complete" : ""}">${rd.includes(m.id) ? "Selesai ✓" : "Belum dibaca"}</span></a>`).join("") || '<p class="empty-state">Belum ada materi. Coba kembali lagi nanti.</p>'}</div></section>`;
}
async function materi(id) {
  await load();
  if (!mine().pre) return gate("Kerjakan pre-test dulu sebelum belajar.");
  const m = C.ms.find((x) => x.id === id);
  if (!m) return '<section class="gate-card"><h1>Materi tidak ditemukan</h1><a class="back-link" href="#/belajar">Kembali ke materi</a></section>';
  const videos = ytIds(m.youtube),
    quiz = shuf(m.quiz || []);
  const read = (Store.me.read || []).includes(m.id);
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
    ? `<section class="lesson-video"><h2>${E(m.videoTitle || "Video materi")}</h2><div class="vid-grid">${videos.map((video, i) => `<div class="vid"><iframe src="https://www.youtube.com/embed/${video}" title="${E(m.videoTitle || `Video ${i + 1} materi ${m.title}`)}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen loading="lazy" referrerpolicy="strict-origin-when-cross-origin"></iframe></div>`).join("")}</div></section>`
    : "";
  const quizMarkup = quiz.length
    ? `<section class="lesson-quiz"><div class="lesson-quiz-heading"><h2>Cek pemahaman</h2><p>${quiz.length} soal pilihan ganda dengan urutan dan opsi yang diacak.</p></div><form data-f="lessonQuiz" data-material="${E(m.id)}">${quiz
        .map(
          (question, i) =>
            `<fieldset data-id="${E(question.id)}"><legend>${i + 1}. ${E(question.text)}</legend>${shuf(
              question.options || [],
            )
              .map(
                (option) =>
                  `<label class="opt"><input type="radio" name="q${i}" value="${E(option)}" required>${E(option)}</label>`,
              )
              .join("")}</fieldset>`,
        )
        .join("")}<button type="submit">Periksa jawaban</button><p class="lesson-quiz-result" role="status" aria-live="polite"></p></form></section>`
    : "";
  return `<section class="page-section"><a class="back-link" href="#/belajar">← Daftar materi</a><div class="page-heading"><p class="eyebrow">MATERI GRAMMAR</p><h1>${E(m.title)}</h1></div>${videoMarkup}<article class="lesson-card"><h2>Penjelasan</h2>${body}</article>${quizMarkup}<div class="lesson-actions"><button data-a="read" data-id="${E(m.id)}" ${read ? "disabled" : ""}>${read ? "Materi selesai ✓" : "Tandai selesai"}</button><a class="back-link" href="#/belajar">Kembali ke daftar materi</a></div></section>`;
}
async function tes(kind) {
  await load();
  const a = mine();
  if (!["pre", "post"].includes(kind)) return gate("Tes tidak ditemukan.");
  if (a[kind])
    return `<section class="gate-card"><span class="gate-mark">✓</span><h1>${kind === "pre" ? "Pre-test" : "Post-test"} selesai</h1><p>Tes hanya bisa dikerjakan satu kali. Terima kasih sudah mengerjakannya.</p><a class="back-link" href="#/">Kembali ke beranda</a></section>`;
  if (
    kind === "post" &&
    (!a.pre ||
      !C.ms.length ||
      !C.ms.every((m) => (Store.me.read || []).includes(m.id)))
  )
    return gate(
      "Post-test terbuka setelah pre-test dan semua materi ditandai selesai.",
    );
  const available = C.qs.filter((q) => (q.use || []).includes(kind));
  const previousOrder =
    kind === "post" && a.pre
      ? (a.pre.detail || []).map((item) => item.q)
      : [];
  const qs = shufQuestions(available, previousOrder);
  if (!qs.length) return '<section class="gate-card"><h1>Soal belum tersedia</h1><p>Silakan kembali lagi nanti.</p><a class="back-link" href="#/">Kembali ke beranda</a></section>';
  return `<section class="page-section test-page"><a class="back-link" href="#/">← Beranda</a><div class="page-heading"><p class="eyebrow">${kind === "pre" ? "LANGKAH 01" : "LANGKAH 03"}</p><h1>${kind === "pre" ? "Pre-test" : "Post-test"}</h1><p>Urutan soal diacak; post-test berbeda dari pre-test. Jumlah soal: ${qs.length}.</p></div><form class="test-form" data-f="test" data-kind="${kind}">${qs
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
            ? `<input name="q${i}" autocomplete="off" placeholder="Jawabanmu">`
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
    .join("")}<div class="test-submit"><p>Pastikan jawabanmu sudah benar sebelum dikirim.</p><button>Kirim jawaban</button></div><p class="err"></p></form></section>`;
}
async function hasil() {
  await load();
  const a = mine();
  if (!a.pre || !a.post)
    return '<section class="gate-card"><span class="gate-mark">↗</span><h1>Hasilmu segera tersedia</h1><p>Kerjakan pre-test dan post-test untuk melihat perbandingan skor.</p><a class="back-link" href="#/">Kembali ke beranda</a></section>';
  const p = (a.pre.score / a.pre.total) * 100,
    q = (a.post.score / a.post.total) * 100,
    d = Math.round(q - p);
  return `<section class="page-section results-page"><a class="back-link" href="#/">← Beranda</a><div class="results-hero"><p class="eyebrow">HASIL LATIHAN</p><h1>Perkembanganmu</h1><div class="big"><b>${d > 0 ? "+" : ""}${d}</b><span>poin perubahan skor</span></div><p>${d > 0 ? "Bagus! Skormu meningkat setelah belajar." : d < 0 ? "Terus berlatih, kamu bisa meningkatkan hasil berikutnya." : "Skormu tetap stabil. Terus berlatih untuk berkembang."}</p></div><section class="score-comparison"><h2>Perbandingan skor</h2>${[
    ["Pre-test", a.pre, p],
    ["Post-test", a.post, q],
  ]
    .map(
      (r) =>
        `<div class="bar"><div class="bar-label"><span>${r[0]}</span><b>${Math.round(r[2])}% <small>(${r[1].score}/${r[1].total})</small></b></div><div><i style="width:${r[2]}%"></i></div></div>`,
    )
    .join("")}<p class="hint">Terima kasih sudah menyelesaikan latihan.</p></section></section>`;
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
    b = `<section class="admin-toolbar"><div><h2>Mahasiswa</h2><p>Kelola akun, profil, dan pantau hasil tes.</p></div><div class="admin-toolbar-actions"><span class="admin-count"><b>${rows.length}</b> mahasiswa</span><button class="ghost" data-a="xlsx">Ekspor Excel</button></div></section>
  <section class="admin-panel"><div class="admin-section-head"><div><h2>Data mahasiswa</h2><p>Tambahkan akun baru atau pilih Edit pada tabel untuk memperbarui profil.</p></div></div>
  <form class="admin-form" data-f="student"><input type="hidden" name="id"><div class="admin-fields">
  <label>Nama lengkap<input name="fullName" placeholder="Contoh: Siti Aminah" required></label>
  <label>Program studi<input name="prodi" placeholder="Contoh: Pendidikan Bahasa Inggris" required></label>
  <label>NIM<input name="nim" placeholder="Masukkan NIM" required></label>
  <label>Email akun<input name="email" type="email" placeholder="nama@email.com" required></label>
  <label>Password akun<input name="password" type="password" minlength="6" placeholder="Minimal 6 karakter" required><small>Wajib diisi saat membuat akun mahasiswa.</small></label>
  </div><div class="admin-form-actions"><button>Simpan mahasiswa</button><button type="button" class="ghost hide" data-a="student-reset">Batal edit</button></div><p class="err"></p></form></section>
  <section class="admin-panel"><div class="admin-section-head"><div><h2>Daftar mahasiswa</h2><p>Skor tes ditampilkan dalam persen. Tabel dapat digeser ke samping pada layar kecil.</p></div></div>
  <div class="scroll"><table class="admin-table"><thead><tr>${["NIM", "Nama", "Program studi", "Email", "Pre-test", "Post-test", "Selisih", "Aksi"].map((h) => `<th>${h}</th>`).join("")}</tr></thead><tbody>${rows.length ? rows.map((r, i) => `<tr><td class="admin-nim">${E(r.NIM)}</td><td class="admin-name">${E(r.Nama)}</td><td>${E(r.Prodi)}</td><td class="admin-email">${E(r.Email)}</td><td><span class="score-pill">${r.Pre === "" ? "—" : `${r.Pre}%`}</span></td><td><span class="score-pill">${r.Post === "" ? "—" : `${r.Post}%`}</span></td><td><span class="score-pill">${r.Selisih === "" ? "—" : `${r.Selisih > 0 ? "+" : ""}${r.Selisih}`}</span></td><td><div class="admin-row-actions"><button class="ghost" data-a="student-edit" data-id="${E(us[i].id)}">Edit</button><button class="ghost danger" data-a="student-delete" data-id="${E(us[i].id)}">Hapus</button></div></td></tr>`).join("") : '<tr><td colspan="8" class="admin-empty">Belum ada data mahasiswa.</td></tr>'}</tbody></table></div></section>`;
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
    ? (me.admin ? '<a href="#/">Admin</a>' : '<a href="#/">Beranda</a>') +
      '<button class="ghost" data-a="out">Keluar</button>'
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
      if (!lesson) throw Error("Materi kuis tidak ditemukan.");
      const answers = new FormData(f);
      let score = 0;
      const feedback = [...f.querySelectorAll("fieldset")].map((field, i) => {
        const question = (lesson.quiz || []).find(
          (item) => item.id === field.dataset.id,
        );
        if (!question) throw Error("Soal latihan tidak ditemukan.");
        const correct = norm(answers.get("q" + i) || "") === norm(question.answer);
        if (correct) score++;
        return correct
          ? `${i + 1}. Benar.`
          : `${i + 1}. Belum tepat — jawaban: ${question.answer}.`;
      });
      const result = f.querySelector(".lesson-quiz-result");
      result.textContent = `Skor ${score}/${feedback.length}. ${feedback.join(" ")}`;
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
      location.hash = "#/";
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
    location.hash = "#/belajar";
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
