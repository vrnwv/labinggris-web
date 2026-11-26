# Grammar Lab
Web latihan grammar Inggris: pre-test, belajar, post-test, lalu hasil perbandingan skor. HTML/CSS/JS murni + Firebase (Auth + Firestore). Cocok di-host di GitHub Pages.

## Coba cepat (mode demo)
Buka `index.html` (atau pakai Live Server). Data di localStorage. Admin demo: `admin@demo.id` / `admin123`.

## Sambungkan ke Firebase
1. Buat project, aktifkan Authentication (Email/Password) dan Firestore.
2. Isi `js/config.js` dengan config web app.
3. Salin isi `firestore.rules` ke Firestore > Rules, lalu Publish.
4. Daftar akun lewat web, lalu di Firestore Console buat dokumen `admins/{UID akun itu}` (isi field bebas, mis. `ok: true`). Akun itu jadi admin. UID ada di Authentication > Users.
5. Untuk CRUD akun mahasiswa, aktifkan billing Blaze. Pasang Firebase CLI dengan `npm install -g firebase-tools`, lalu jalankan `firebase login`. Dari folder proyek, jalankan `firebase use --add` dan pilih project `grammar-lab-34e2c`, kemudian `npm install --prefix functions` dan `firebase deploy --only functions`.
6. Login sebagai admin, klik "Perbarui 8 materi & soal" dua kali untuk mengimpor materi video, soal latihan, dan 30 soal pre/post bawaan.
7. GitHub Pages: push repo, Settings > Pages > Deploy from branch. Tambahkan domain `username.github.io` di Authentication > Settings > Authorized domains.

## Update materi dan soal
- Bagian belajar memiliki 8 materi video: dua video untuk masing-masing Simple Present, Present Continuous, Simple Past, dan Simple Future. Setiap materi menampilkan video, penjelasan berdasarkan catatan video di file Markdown, dan 3 soal latihan dengan urutan soal serta pilihan jawaban yang diacak.
- Latihan per materi adalah cek pemahaman dan tidak menggantikan 30 soal pre-test/post-test.
- Admin dapat mengimpor materi bawaan dari tombol di panel. Impor mengganti materi bawaan lama dengan 8 materi video; progres baca materi lama perlu diselesaikan kembali. Data tambahan buatan admin tidak dihapus. Soal bawaan dengan ID yang sama akan diperbarui.

## Aturan alur
- Pre-test sekali saja dan tidak bisa diulang, bahkan setelah post-test.
- Materi terbuka setelah pre-test. Post-test terbuka setelah semua materi ditandai selesai, sekali saja.
- Setelah post-test, materi tetap bisa dibuka dan dikerjakan ulang kapan saja.
- Security Rules menjaga: tes tidak bisa ditimpa atau dihapus, dan post-test hanya bisa dibuat kalau pre-test sudah ada. Syarat "semua materi dibaca" dijaga di sisi aplikasi saja.

## Catatan
- Kunci jawaban ikut tersimpan di dokumen soal pre/post dan data kuis pada materi, sehingga bisa dibaca user yang login lewat devtools. Untuk skala 100-200 responden biasanya cukup. Kalau perlu lebih ketat, nilai di Cloud Function.
- Belum ada reset tes per responden dan uji statistik. Ekspor Excel `.xlsx` di tab responden untuk dianalisis.
- Tab responden mendukung tambah, edit, dan hapus akun/profil mahasiswa. Hapus mahasiswa juga menghapus seluruh histori tesnya secara permanen.
- Fungsi CRUD akun memakai Cloud Functions dan Admin SDK. Jangan memberi kredensial Admin SDK ke aplikasi browser.
