-- ============================================================
-- Artikel batch 4 — Madevi (2026-10-13)
-- 4 artikel: 1 Tutorial karier, 2 Explore edukatif, 1 School IPA
-- Semua: status DRAFT, language id, owner principal
-- Jalankan sebagai satu transaksi.
-- ============================================================

BEGIN;

-- ==================== Artikel 1 ====================
-- TUT-WAWANCARA-001 — Tips Lolos Wawancara Kerja
-- Node: R1.D2 Pekerjaan & Karier | 12 block format Tutorial
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, status, created_by, updated_by)
VALUES (
  'f1000001-0000-4000-8000-000000000001',
  'TUT-WAWANCARA-001',
  'b3333333-3333-3333-3333-333333333333',
  'Tips Lolos Wawancara Kerja: Persiapan hingga Follow-up',
  'tips-lolos-wawancara-kerja-persiapan-follow-up',
  'Panduan lengkap wawancara kerja: riset perusahaan, menjawab pertanyaan jebakan, bahasa tubuh, hingga follow-up yang benar.',
  'id', 9, 'DRAFT',
  'f7125028-187e-44e0-b95b-88b69b8d5c9a',
  'f7125028-187e-44e0-b95b-88b69b8d5c9a'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
(gen_random_uuid(), 'f1000001-0000-4000-8000-000000000001', 'HEADING', 1, jsonb_build_object('text', $$Masalah: Grogi dan Bingung Menjawab di Wawancara$$)),
(gen_random_uuid(), 'f1000001-0000-4000-8000-000000000001', 'PARAGRAPH', 2, jsonb_build_object('text', $$Banyak pelamar gagal bukan karena tidak kompeten, melainkan karena tidak siap: gugup berlebihan, menjawab bertele-tele, tidak tahu tentang perusahaan, atau tidak punya pertanyaan balik. Masalah ini bisa diatasi dengan persiapan yang sistematis.$$)),
(gen_random_uuid(), 'f1000001-0000-4000-8000-000000000001', 'HEADING', 3, jsonb_build_object('text', $$Penjelasan: Apa yang Dinilai Pewawancara$$)),
(gen_random_uuid(), 'f1000001-0000-4000-8000-000000000001', 'PARAGRAPH', 4, jsonb_build_object('text', $$Pewawancara menilai tiga hal: (1) kompetensi — apakah kamu bisa mengerjakan pekerjaan ini; (2) kecocokan — apakah kamu cocok dengan budaya tim; (3) motivasi — apakah kamu benar-benar ingin posisi ini. Jawaban yang baik menyentuh ketiganya sekaligus.$$)),
(gen_random_uuid(), 'f1000001-0000-4000-8000-000000000001', 'HEADING', 5, jsonb_build_object('text', $$Persiapan: Alat dan Bahan$$)),
(gen_random_uuid(), 'f1000001-0000-4000-8000-000000000001', 'LIST', 6, jsonb_build_object('items', ARRAY[$$CV terbaru yang sudah dicetak/rapi$$, $$Riset: profil perusahaan, produk/jasa, visi-misi$$, $$Daftar 5 pertanyaan jebakan + jawaban latihannya$$, $$Pakaian rapi sesuai budaya perusahaan$$, $$2-3 pertanyaan balik yang cerdas$$])),
(gen_random_uuid(), 'f1000001-0000-4000-8000-000000000001', 'HEADING', 7, jsonb_build_object('text', $$Langkah: Cara Menjawab Pertanyaan Jebakan$$)),
(gen_random_uuid(), 'f1000001-0000-4000-8000-000000000001', 'LIST', 8, jsonb_build_object('items', ARRAY[$$"Ceritakan tentang dirimu" → jawab 2 menit: latar belakang, pengalaman relevan, kenapa melamar. Jangan curhat panjang.$$ , $$"Apa kelemahanmu?" → pilih kelemahan nyata tapi tidak fatal, lalu tunjukkan cara kamu mengatasinya.$$ , $$"Kenapa kami harus menerima kamu?" → hubungkan skill-mu dengan kebutuhan posisi, beri contoh konkret.$$ , $$"Berapa gaji yang diinginkan?" → sebut rentang berdasarkan riset pasar, bukan angka mati.$$ , $$Gunakan metode STAR (Situation, Task, Action, Result) untuk pertanyaan pengalaman.$$])),
(gen_random_uuid(), 'f1000001-0000-4000-8000-000000000001', 'HEADING', 9, jsonb_build_object('text', $$Risiko: Kesalahan Fatal yang Harus Dihindari$$)),
(gen_random_uuid(), 'f1000001-0000-4000-8000-000000000001', 'PARAGRAPH', 10, jsonb_build_object('text', $$Jangan menjelekkan atasan/perusahaan lama — pewawancara akan curiga kamu akan melakukan hal yang sama. Jangan berbohong tentang pengalaman; kebohongan mudah terbongkar saat pertanyaan pendalaman. Jangan datang terlambat dan jangan memainkan HP selama menunggu.$$)),
(gen_random_uuid(), 'f1000001-0000-4000-8000-000000000001', 'HEADING', 11, jsonb_build_object('text', $$Penyelesaian: Follow-up Setelah Wawancara$$)),
(gen_random_uuid(), 'f1000001-0000-4000-8000-000000000001', 'PARAGRAPH', 12, jsonb_build_object('text', $$Kirim email terima kasih dalam 24 jam: ucapkan terima kasih atas waktunya, tegaskan ketertarikanmu, dan sebut satu poin menarik dari percakapan. Jika dalam 1-2 minggu tidak ada kabar, kirim satu email tindak lanjut yang sopan. Follow-up yang baik bisa menjadi pembeda di antara kandidat yang seimbang.$$))
ON CONFLICT (id) DO NOTHING;

-- ==================== Artikel 2 ====================
-- EXP-MATEMATIKA-001 — Aljabar: Bahasa Simbol Matematika
-- Node: R2.D9 Matematika | 10 block edukatif
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, status, created_by, updated_by)
VALUES (
  'f1000002-0000-4000-8000-000000000002',
  'EXP-MATEMATIKA-001',
  'c5555555-5555-5555-5555-555555555555',
  'Aljabar: Bahasa Simbol Matematika',
  'aljabar-bahasa-simbol-matematika',
  'Memahami aljabar dari nol: variabel, suku, persamaan linear, hingga pertidaksamaan — dengan contoh langkah demi langkah.',
  'id', 7, 'DRAFT',
  'f7125028-187e-44e0-b95b-88b69b8d5c9a',
  'f7125028-187e-44e0-b95b-88b69b8d5c9a'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
(gen_random_uuid(), 'f1000002-0000-4000-8000-000000000002', 'HEADING', 1, jsonb_build_object('text', $$Apa Itu Aljabar?$$)),
(gen_random_uuid(), 'f1000002-0000-4000-8000-000000000002', 'PARAGRAPH', 2, jsonb_build_object('text', $$Aljabar adalah cabang matematika yang menggunakan simbol — biasanya huruf seperti x, y, a, b — untuk mewakili bilangan yang belum diketahui atau dapat berubah. Jika aritmetika bekerja dengan angka konkret (3 + 5 = 8), aljabar bekerja dengan pola umum (a + b = b + a). Ini memungkinkan kita menyelesaikan masalah yang belum diketahui nilainya.$$)),
(gen_random_uuid(), 'f1000002-0000-4000-8000-000000000002', 'HEADING', 3, jsonb_build_object('text', $$Variabel, Koefisien, dan Suku$$)),
(gen_random_uuid(), 'f1000002-0000-4000-8000-000000000002', 'PARAGRAPH', 4, jsonb_build_object('text', $$Dalam bentuk 5x + 7: huruf x disebut variabel (nilainya bisa berubah), angka 5 disebut koefisien (pengali variabel), dan angka 7 disebut konstanta (nilainya tetap). Gabungan seperti 5x dan 7 disebut suku. Suku-suku sejenis — misalnya 5x dan 3x — dapat dijumlahkan menjadi 8x.$$)),
(gen_random_uuid(), 'f1000002-0000-4000-8000-000000000002', 'HEADING', 5, jsonb_build_object('text', $$Persamaan Linear Satu Variabel$$)),
(gen_random_uuid(), 'f1000002-0000-4000-8000-000000000002', 'PARAGRAPH', 6, jsonb_build_object('text', $$Persamaan adalah pernyataan bahwa dua hal sama, ditandai dengan =. Contoh: 2x + 6 = 14. Cara menyelesaikan: kurangi kedua sisi dengan 6 → 2x = 8, lalu bagi kedua sisi dengan 2 → x = 4. Aturan emasnya: apa yang dilakukan pada satu sisi, harus dilakukan pada sisi lainnya agar persamaan tetap seimbang.$$)),
(gen_random_uuid(), 'f1000002-0000-4000-8000-000000000002', 'HEADING', 7, jsonb_build_object('text', $$Pertidaksamaan: Ketika Tidak Sama Dengan$$)),
(gen_random_uuid(), 'f1000002-0000-4000-8000-000000000002', 'PARAGRAPH', 8, jsonb_build_object('text', $$Pertidaksamaan memakai tanda < (kurang dari), > (lebih dari), ≤, dan ≥. Contoh: 3x − 9 > 12. Selesaikan seperti persamaan: tambah 9 → 3x > 21, bagi 3 → x > 7. Perhatian: jika mengalikan atau membagi kedua sisi dengan bilangan negatif, tanda pertidaksamaan dibalik. Contoh: −2x < 10 menjadi x > −5.$$)),
(gen_random_uuid(), 'f1000002-0000-4000-8000-000000000002', 'HEADING', 9, jsonb_build_object('text', $$Contoh Soal$$)),
(gen_random_uuid(), 'f1000002-0000-4000-8000-000000000002', 'LIST', 10, jsonb_build_object('items', ARRAY[$$Selesaikan: 4x − 7 = 25. Jawab: 4x = 32, maka x = 8.$$ , $$Selesaikan: 2(x + 3) = 16. Jawab: 2x + 6 = 16, 2x = 10, maka x = 5.$$ , $$Tentukan x jika 5x + 2 ≥ 27. Jawab: 5x ≥ 25, maka x ≥ 5.$$]))
ON CONFLICT (id) DO NOTHING;

-- ==================== Artikel 3 ====================
-- EXP-BIOLOGI-001 — Fotosintesis: Dapur Energi Tumbuhan
-- Node: R2.D6.K2 Tumbuhan (Plantae) | 10 block edukatif
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, status, created_by, updated_by)
VALUES (
  'f1000003-0000-4000-8000-000000000003',
  'EXP-BIOLOGI-001',
  'caaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  'Fotosintesis: Dapur Energi Tumbuhan',
  'fotosintesis-dapur-energi-tumbuhan',
  'Bagaimana tumbuhan membuat makanan dari cahaya matahari: peran klorofil, reaksi terang dan gelap, serta faktor yang mempengaruhinya.',
  'id', 7, 'DRAFT',
  'f7125028-187e-44e0-b95b-88b69b8d5c9a',
  'f7125028-187e-44e0-b95b-88b69b8d5c9a'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
(gen_random_uuid(), 'f1000003-0000-4000-8000-000000000003', 'HEADING', 1, jsonb_build_object('text', $$Fotosintesis dalam Satu Kalimat$$)),
(gen_random_uuid(), 'f1000003-0000-4000-8000-000000000003', 'PARAGRAPH', 2, jsonb_build_object('text', $$Fotosintesis adalah proses tumbuhan hijau mengubah energi cahaya matahari menjadi energi kimia dalam bentuk glukosa (gula). Persamaan sederhananya: karbon dioksida + air → (dengan cahaya dan klorofil) → glukosa + oksigen. Oksigen yang kita hirup setiap hari adalah hasil sampingan dari proses ini.$$)),
(gen_random_uuid(), 'f1000003-0000-4000-8000-000000000003', 'HEADING', 3, jsonb_build_object('text', $$Klorofil: Pigmen Penangkap Cahaya$$)),
(gen_random_uuid(), 'f1000003-0000-4000-8000-000000000003', 'PARAGRAPH', 4, jsonb_build_object('text', $$Klorofil adalah pigmen hijau di dalam kloroplas daun yang menangkap energi cahaya. Ia menyerap kuat cahaya merah dan biru, tetapi memantulkan cahaya hijau — itulah sebabnya daun terlihat hijau. Tanpa klorofil, tumbuhan tidak bisa memulai fotosintesis sama sekali.$$)),
(gen_random_uuid(), 'f1000003-0000-4000-8000-000000000003', 'HEADING', 5, jsonb_build_object('text', $$Reaksi Terang: Menangkap Energi$$)),
(gen_random_uuid(), 'f1000003-0000-4000-8000-000000000003', 'PARAGRAPH', 6, jsonb_build_object('text', $$Reaksi terang terjadi di membran tilakoid kloroplas dan membutuhkan cahaya langsung. Energi cahaya memecah molekul air (fotolisis) menjadi oksigen, proton, dan elektron. Energi yang ditangkap disimpan sementara dalam dua pembawa energi: ATP dan NADPH. Oksigen dilepas ke udara melalui stomata.$$)),
(gen_random_uuid(), 'f1000003-0000-4000-8000-000000000003', 'HEADING', 7, jsonb_build_object('text', $$Reaksi Gelap (Siklus Calvin): Membuat Gula$$)),
(gen_random_uuid(), 'f1000003-0000-4000-8000-000000000003', 'PARAGRAPH', 8, jsonb_build_object('text', $$Reaksi gelap terjadi di stroma kloroplas dan tidak membutuhkan cahaya langsung — ia memakai ATP dan NADPH dari reaksi terang. Karbon dioksida dari udara "difiksasi" dan dirangkai menjadi glukosa melalui siklus Calvin. Satu molekul glukosa membutuhkan 6 putaran siklus ini.$$)),
(gen_random_uuid(), 'f1000003-0000-4000-8000-000000000003', 'HEADING', 9, jsonb_build_object('text', $$Faktor yang Mempengaruhi Fotosintesis$$)),
(gen_random_uuid(), 'f1000003-0000-4000-8000-000000000003', 'LIST', 10, jsonb_build_object('items', ARRAY[$$Intensitas cahaya: semakin terang (sampai titik jenuh), semakin cepat fotosintesis.$$ , $$Kadar CO2: lebih banyak CO2 tersedia → lebih banyak gula yang bisa dibuat.$$ , $$Suhu: enzim fotosintesis bekerja optimal sekitar 25–35°C; terlalu panas merusaknya.$$ , $$Ketersediaan air: kekurangan air menutup stomata, menghambat masuknya CO2.$$ , $$Klorofil: daun yang kekurangan unsur hara (mis. nitrogen, magnesium) menguning dan fotosintesisnya menurun.$$]))
ON CONFLICT (id) DO NOTHING;

-- ==================== Artikel 4 ====================
-- SCH-SD-IPA-001 — IPA Kelas 3: Bagian Tumbuhan dan Fungsinya
-- Node: R3.D14.K10 Kelas 3 SD | 12 block format sekolah
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, status, created_by, updated_by)
VALUES (
  'f1000004-0000-4000-8000-000000000004',
  'SCH-SD-IPA-001',
  'd1000003-0000-0000-0000-000000000003',
  'IPA Kelas 3: Bagian Tumbuhan dan Fungsinya',
  'ipa-kelas-3-bagian-tumbuhan-dan-fungsinya',
  'Materi IPA kelas 3 SD: mengenal akar, batang, daun, bunga, dan buah beserta fungsi masing-masing, lengkap dengan latihan.',
  'id', 6, 'DRAFT',
  'f7125028-187e-44e0-b95b-88b69b8d5c9a',
  'f7125028-187e-44e0-b95b-88b69b8d5c9a'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
(gen_random_uuid(), 'f1000004-0000-4000-8000-000000000004', 'HEADING', 1, jsonb_build_object('text', $$Tujuan Pembelajaran$$)),
(gen_random_uuid(), 'f1000004-0000-4000-8000-000000000004', 'PARAGRAPH', 2, jsonb_build_object('text', $$Setelah mempelajari materi ini, kamu diharapkan mampu: (1) menyebutkan bagian-bagian tumbuhan; (2) menjelaskan fungsi akar, batang, daun, bunga, dan buah; (3) memberi contoh tumbuhan di sekitarmu beserta bagian-bagiannya.$$)),
(gen_random_uuid(), 'f1000004-0000-4000-8000-000000000004', 'HEADING', 3, jsonb_build_object('text', $$Akar: Jangkar dan Penyedot$$)),
(gen_random_uuid(), 'f1000004-0000-4000-8000-000000000004', 'PARAGRAPH', 4, jsonb_build_object('text', $$Akar tumbuh di dalam tanah dan memiliki dua fungsi utama: menancapkan tumbuhan agar tidak roboh, dan menyerap air serta zat hara dari tanah. Ada dua jenis akar: akar tunggang (satu akar besar dengan cabang, contoh: mangga, wortel) dan akar serabut (banyak akar kecil menyebar, contoh: padi, jagung).$$)),
(gen_random_uuid(), 'f1000004-0000-4000-8000-000000000004', 'HEADING', 5, jsonb_build_object('text', $$Batang dan Daun$$)),
(gen_random_uuid(), 'f1000004-0000-4000-8000-000000000004', 'PARAGRAPH', 6, jsonb_build_object('text', $$Batang berfungsi menopang daun, bunga, dan buah, serta menjadi jalan air dan zat hara dari akar ke seluruh tumbuhan. Daun adalah "dapur" tumbuhan: di sinilah fotosintesis terjadi sehingga tumbuhan bisa membuat makanannya sendiri. Daun yang lebar dan tipis membantu menangkap lebih banyak cahaya matahari.$$)),
(gen_random_uuid(), 'f1000004-0000-4000-8000-000000000004', 'HEADING', 7, jsonb_build_object('text', $$Bunga dan Buah$$)),
(gen_random_uuid(), 'f1000004-0000-4000-8000-000000000004', 'PARAGRAPH', 8, jsonb_build_object('text', $$Bunga berfungsi sebagai alat perkembangbiakan tumbuhan. Setelah penyerbukan, bunga akan berkembang menjadi buah. Buah melindungi biji di dalamnya dan membantu penyebaran biji — misalnya buah mangga yang dimakan hewan, bijinya ikut tersebar ke tempat lain.$$)),
(gen_random_uuid(), 'f1000004-0000-4000-8000-000000000004', 'HEADING', 9, jsonb_build_object('text', $$Contoh di Sekitar Kita$$)),
(gen_random_uuid(), 'f1000004-0000-4000-8000-000000000004', 'PARAGRAPH', 10, jsonb_build_object('text', $$Perhatikan pohon pisang di halaman: akarnya serabut, batangnya lunak dan berair, daunnya lebar untuk menangkap cahaya, dan buahnya tumbuh dari bunga. Coba amati satu tumbuhan di rumahmu dan catat bagian-bagiannya!$$)),
(gen_random_uuid(), 'f1000004-0000-4000-8000-000000000004', 'HEADING', 11, jsonb_build_object('text', $$Latihan Soal$$)),
(gen_random_uuid(), 'f1000004-0000-4000-8000-000000000004', 'LIST', 12, jsonb_build_object('items', ARRAY[$$1. Sebutkan 5 bagian tumbuhan!$$ , $$2. Apa fungsi akar bagi tumbuhan?$$ , $$3. Di bagian tumbuhan manakah fotosintesis terjadi?$$ , $$Kunci jawaban: 1. Akar, batang, daun, bunga, buah. 2. Menancapkan tumbuhan dan menyerap air serta zat hara. 3. Daun.$$]))
ON CONFLICT (id) DO NOTHING;

COMMIT;
