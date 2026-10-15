-- Artikel konten Madevi batch 13 — 2026-10-13
-- Owner principal: f7125028-187e-44e0-b95b-88b69b8d5c9a

-- ============ 1. TUT-DIGITAL-001 ============
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, status, created_by, updated_by)
VALUES ('b2000001-0000-4000-8000-000000000001', 'TUT-DIGITAL-001', 'b4444444-4444-4444-4444-444444444444',
'Keamanan Digital: Lindungi Akun dari Hacker', 'keamanan-digital-lindungi-akun-dari-hacker',
'Panduan praktis mengamankan akun digital: password manager, autentikasi dua faktor, dan cara mengenali phishing.',
'id', 7, 'DRAFT', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (id) DO NOTHING;

INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
(gen_random_uuid(), 'b2000001-0000-4000-8000-000000000001', 'HEADING', 1, jsonb_build_object('text', $$Masalah: Akun Diretas$$)),
(gen_random_uuid(), 'b2000001-0000-4000-8000-000000000001', 'PARAGRAPH', 2, jsonb_build_object('text', $$Pagi ini kamu tidak bisa login ke email atau media sosial. Password ditolak, padahal kamu yakin benar. Kemungkinan besar akunmu diretas: peretas mengubah password dan nomor pemulihan. Data pribadi, foto, bahkan akses ke rekening bank yang terhubung bisa dicuri.$$)),
(gen_random_uuid(), 'b2000001-0000-4000-8000-000000000001', 'HEADING', 3, jsonb_build_object('text', $$Penjelasan: Bagaimana Hacker Bekerja$$)),
(gen_random_uuid(), 'b2000001-0000-4000-8000-000000000001', 'PARAGRAPH', 4, jsonb_build_object('text', $$Tiga cara paling umum: (1) Phishing — kamu dikirimi link palsu yang mirip situs asli, lalu memasukkan password di sana. (2) Credential stuffing — password yang bocor dari satu situs dicoba ke situs lain karena kamu memakai password yang sama di mana-mana. (3) Brute force — password lemah seperti tanggal lahir ditebak otomatis dalam hitungan detik.$$)),
(gen_random_uuid(), 'b2000001-0000-4000-8000-000000000001', 'HEADING', 5, jsonb_build_object('text', $$Alat yang Dibutuhkan$$)),
(gen_random_uuid(), 'b2000001-0000-4000-8000-000000000001', 'LIST', 6, jsonb_build_object('items', ARRAY[$$Aplikasi password manager (mis. Bitwarden, gratis)$$, $$Aplikasi authenticator (Google Authenticator / Authy)$$, $$Akses ke pengaturan keamanan tiap akun penting$$])),
(gen_random_uuid(), 'b2000001-0000-4000-8000-000000000001', 'HEADING', 7, jsonb_build_object('text', $$Langkah Pengamanan$$)),
(gen_random_uuid(), 'b2000001-0000-4000-8000-000000000001', 'LIST', 8, jsonb_build_object('items', ARRAY[$$1. Ganti semua password penting dengan password unik minimal 12 karakter — simpan di password manager, jangan dihafal$$, $$2. Aktifkan autentikasi dua faktor (2FA) di email, bank, dan media sosial — pilih aplikasi authenticator, bukan SMS$$, $$3. Periksa email pemulihan dan nomor HP di setiap akun, pastikan masih milikmu$$, $$4. Cek kebocoran di situs haveibeenpwned.com; ganti password akun yang bocor$$, $$5. Jangan pernah klik link login dari email/SMS — ketik alamat situs manual di browser$$])),
(gen_random_uuid(), 'b2000001-0000-4000-8000-000000000001', 'HEADING', 9, jsonb_build_object('text', $$Risiko$$)),
(gen_random_uuid(), 'b2000001-0000-4000-8000-000000000001', 'PARAGRAPH', 10, jsonb_build_object('text', $$Jangan simpan kode pemulihan 2FA di HP yang sama dengan akunnya — jika HP hilang, peretas dapat semuanya. Jangan percaya telepon yang mengaku dari bank dan meminta kode OTP: bank tidak pernah meminta kode lewat telepon.$$)),
(gen_random_uuid(), 'b2000001-0000-4000-8000-000000000001', 'HEADING', 11, jsonb_build_object('text', $$Penyelesaian$$)),
(gen_random_uuid(), 'b2000001-0000-4000-8000-000000000001', 'PARAGRAPH', 12, jsonb_build_object('text', $$Checklist selesai: semua password unik + tersimpan di manager, 2FA aktif di akun penting, tidak ada akun yang bocor tanpa diganti passwordnya. Ulangi pemeriksaan kebocoran tiap 6 bulan. Jika akun sudah diretas, segera gunakan fitur pemulihan resmi, lalu amankan seperti langkah di atas.$$))
ON CONFLICT (id) DO NOTHING;

-- ============ 2. TUT-KERJA-001 ============
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, status, created_by, updated_by)
VALUES ('b2000002-0000-4000-8000-000000000002', 'TUT-KERJA-001', 'b3333333-3333-3333-3333-333333333333',
'Freelance untuk Pemula: Dapat Klien Pertama', 'freelance-untuk-pemula-dapat-klien-pertama',
'Panduan mulai freelance dari nol: memilih skill, membuat portofolio, dan strategi mendapatkan klien pertama.',
'id', 8, 'DRAFT', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (id) DO NOTHING;

INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
(gen_random_uuid(), 'b2000002-0000-4000-8000-000000000002', 'HEADING', 1, jsonb_build_object('text', $$Masalah: Ingin Freelance tapi Tidak Tahu Mulai dari Mana$$)),
(gen_random_uuid(), 'b2000002-0000-4000-8000-000000000002', 'PARAGRAPH', 2, jsonb_build_object('text', $$Kamu punya skill — menulis, desain, coding, atau edit video — tapi bingung cara mengubahnya jadi penghasilan. Platform freelance penuh kompetitor berpengalaman, dan kamu belum punya portofolio maupun testimoni.$$)),
(gen_random_uuid(), 'b2000002-0000-4000-8000-000000000002', 'HEADING', 3, jsonb_build_object('text', $$Penjelasan: Cara Kerja Pasar Freelance$$)),
(gen_random_uuid(), 'b2000002-0000-4000-8000-000000000002', 'PARAGRAPH', 4, jsonb_build_object('text', $$Klien membeli kepercayaan, bukan sekadar skill. Mereka memilih freelancer yang buktinya jelas: contoh kerja yang relevan, komunikasi cepat dan profesional, serta harga yang masuk akal. Klien pertama adalah yang tersulit — setelah ada 2–3 testimoni, order berikutnya jauh lebih mudah.$$)),
(gen_random_uuid(), 'b2000002-0000-4000-8000-000000000002', 'HEADING', 5, jsonb_build_object('text', $$Alat yang Dibutuhkan$$)),
(gen_random_uuid(), 'b2000002-0000-4000-8000-000000000002', 'LIST', 6, jsonb_build_object('items', ARRAY[$$3–5 contoh kerja (bisa proyek fiktif/latihan)$$, $$Akun di 1–2 platform (Sribulancer, Projects.co.id, Upwork)$$, $$Template proposal singkat$$, $$Rekening/e-wallet untuk menerima pembayaran$$])),
(gen_random_uuid(), 'b2000002-0000-4000-8000-000000000002', 'HEADING', 7, jsonb_build_object('text', $$Langkah Mendapat Klien Pertama$$)),
(gen_random_uuid(), 'b2000002-0000-4000-8000-000000000002', 'LIST', 8, jsonb_build_object('items', ARRAY[$$1. Pilih SATU jasa spesifik, mis. bukan desain grafis umum tapi desain logo untuk UMKM kuliner$$, $$2. Buat 3–5 contoh kerja seolah-olah untuk klien nyata, tampilkan di portofolio sederhana$$, $$3. Tentukan harga awal 30–50% di bawah pasar untuk 3 proyek pertama — tujuannya testimoni, bukan profit$$, $$4. Kirim 5–10 proposal per hari; tiap proposal sebutkan masalah spesifik klien, bukan template generik$$, $$5. Setelah dapat proyek, kerjakan melebihi ekspektasi dan minta testimoni tertulis$$])),
(gen_random_uuid(), 'b2000002-0000-4000-8000-000000000002', 'HEADING', 9, jsonb_build_object('text', $$Risiko$$)),
(gen_random_uuid(), 'b2000002-0000-4000-8000-000000000002', 'PARAGRAPH', 10, jsonb_build_object('text', $$Waspadai klien yang meminta kerja gratis sebagai tes berlebihan atau menolak DP — minta minimal 30–50% di muka untuk proyek baru. Jangan ambil terlalu banyak order sekaligus; satu ulasan buruk di awal merusak reputasi lama.$$)),
(gen_random_uuid(), 'b2000002-0000-4000-8000-000000000002', 'HEADING', 11, jsonb_build_object('text', $$Penyelesaian$$)),
(gen_random_uuid(), 'b2000002-0000-4000-8000-000000000002', 'PARAGRAPH', 12, jsonb_build_object('text', $$Target realistis: klien pertama dalam 2–4 minggu dengan konsistensi kirim proposal. Setelah 3 testimoni positif, naikkan harga ke tarif pasar dan perluas ke niche yang lebih menguntungkan. Freelance adalah maraton — reputasi dibangun proyek demi proyek.$$))
ON CONFLICT (id) DO NOTHING;

-- ============ 3. EXP-ASTRONOMI2-001 ============
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, status, created_by, updated_by)
VALUES ('b2000003-0000-4000-8000-000000000003', 'EXP-ASTRONOMI2-001', 'c5000002-0000-0000-0000-000000000002',
'Lubang Hitam: Monster Tak Terlihat di Alam Semesta', 'lubang-hitam-monster-tak-terlihat',
'Mengenal lubang hitam: cara terbentuk, horizon peristiwa, dan bagaimana ilmuwan memotret sesuatu yang tak terlihat.',
'id', 6, 'DRAFT', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (id) DO NOTHING;

INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
(gen_random_uuid(), 'b2000003-0000-4000-8000-000000000003', 'HEADING', 1, jsonb_build_object('text', $$Apa Itu Lubang Hitam?$$)),
(gen_random_uuid(), 'b2000003-0000-4000-8000-000000000003', 'PARAGRAPH', 2, jsonb_build_object('text', $$Lubang hitam adalah wilayah ruang-waktu di mana gravitasi begitu kuat sehingga tidak ada — bahkan cahaya, yang tercepat di alam semesta — yang bisa lolos. Ia terbentuk ketika bintang sangat masif runtuh oleh gravitasinya sendiri di akhir hidupnya.$$)),
(gen_random_uuid(), 'b2000003-0000-4000-8000-000000000003', 'HEADING', 3, jsonb_build_object('text', $$Horizon Peristiwa: Titik Tanpa Kembali$$)),
(gen_random_uuid(), 'b2000003-0000-4000-8000-000000000003', 'PARAGRAPH', 4, jsonb_build_object('text', $$Batas di sekeliling lubang hitam disebut horizon peristiwa (event horizon). Sekali melewatinya, tidak ada jalan kembali — bukan karena dinding fisik, melainkan karena semua jalur di ruang-waktu mengarah ke dalam. Dari luar, kita hanya bisa melihat efeknya pada materi di sekitarnya.$$)),
(gen_random_uuid(), 'b2000003-0000-4000-8000-000000000003', 'HEADING', 5, jsonb_build_object('text', $$Jenis-jenis Lubang Hitam$$)),
(gen_random_uuid(), 'b2000003-0000-4000-8000-000000000003', 'LIST', 6, jsonb_build_object('items', ARRAY[$$Lubang hitam bintang: massa 3–100 kali Matahari, sisa ledakan supernova$$, $$Lubang hitam supermasif: jutaan hingga miliaran kali massa Matahari, ada di pusat hampir semua galaksi termasuk Bima Sakti (Sagitarius A*)$$, $$Lubang hitam menengah: ratusan–ribuan massa Matahari, masih misterius dan jarang terkonfirmasi$$])),
(gen_random_uuid(), 'b2000003-0000-4000-8000-000000000003', 'HEADING', 7, jsonb_build_object('text', $$Bagaimana Ilmuwan Memotretnya?$$)),
(gen_random_uuid(), 'b2000003-0000-4000-8000-000000000003', 'PARAGRAPH', 8, jsonb_build_object('text', $$Pada 2019, kolaborasi Event Horizon Telescope merilis foto pertama lubang hitam di galaksi M87: cincin cahaya oranye mengelilingi bayangan gelap. Yang difoto bukan lubang hitamnya, melainkan cahaya gas panas yang berputar di sekitarnya sebelum jatuh masuk — bayangan di tengahnya adalah horizon peristiwa.$$)),
(gen_random_uuid(), 'b2000003-0000-4000-8000-000000000003', 'HEADING', 9, jsonb_build_object('text', $$Apakah Berbahaya bagi Bumi?$$)),
(gen_random_uuid(), 'b2000003-0000-4000-8000-000000000003', 'PARAGRAPH', 10, jsonb_build_object('text', $$Tidak. Lubang hitam terdekat berjarak sekitar 1.500 tahun cahaya — terlalu jauh untuk memengaruhi kita. Lubang hitam tidak menyedot seperti penyedot debu; dari jarak aman, gravitasinya sama seperti bintang biasa bermassa setara. Bumi aman.$$))
ON CONFLICT (id) DO NOTHING;

-- ============ 4. EXP-GENETIKA-001 ============
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, status, created_by, updated_by)
VALUES ('b2000004-0000-4000-8000-000000000004', 'EXP-GENETIKA-001', 'c2222222-2222-2222-2222-222222222222',
'DNA: Buku Petunjuk Kehidupan', 'dna-buku-petunjuk-kehidupan',
'Memahami DNA: struktur heliks ganda, cara menyimpan informasi genetik, dan perannya dalam pewarisan sifat.',
'id', 6, 'DRAFT', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (id) DO NOTHING;

INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
(gen_random_uuid(), 'b2000004-0000-4000-8000-000000000004', 'HEADING', 1, jsonb_build_object('text', $$DNA: Arsip Informasi Tubuh$$)),
(gen_random_uuid(), 'b2000004-0000-4000-8000-000000000004', 'PARAGRAPH', 2, jsonb_build_object('text', $$DNA (asam deoksiribonukleat) adalah molekul yang menyimpan seluruh instruksi membangun dan menjalankan tubuh makhluk hidup — warna mata, golongan darah, hingga kerentanan terhadap penyakit tertentu. Jika diurai, DNA satu sel manusia panjangnya sekitar 2 meter, padat dalam inti sel yang mikroskopis.$$)),
(gen_random_uuid(), 'b2000004-0000-4000-8000-000000000004', 'HEADING', 3, jsonb_build_object('text', $$Struktur Heliks Ganda$$)),
(gen_random_uuid(), 'b2000004-0000-4000-8000-000000000004', 'PARAGRAPH', 4, jsonb_build_object('text', $$Ditemukan Watson dan Crick pada 1953 (berdasar data Rosalind Franklin), DNA berbentuk tangga berpilin: dua rantai gula-fosfat sebagai tiang, dan empat basa nitrogen sebagai anak tangga — Adenin (A), Timin (T), Guanin (G), Sitosin (C). Aturan pasangan selalu A–T dan G–C, seperti kunci dan gembok.$$)),
(gen_random_uuid(), 'b2000004-0000-4000-8000-000000000004', 'HEADING', 5, jsonb_build_object('text', $$Dari DNA ke Sifat: Cara Kerjanya$$)),
(gen_random_uuid(), 'b2000004-0000-4000-8000-000000000004', 'LIST', 6, jsonb_build_object('items', ARRAY[$$Gen: segmen DNA yang berisi resep satu protein$$, $$Transkripsi: gen disalin menjadi RNA pembawa pesan$$, $$Translasi: RNA dibaca ribosom untuk merangkai protein$$, $$Protein inilah yang membangun jaringan dan menjalankan fungsi tubuh — sifat yang terlihat adalah hasil kerja protein$$])),
(gen_random_uuid(), 'b2000004-0000-4000-8000-000000000004', 'HEADING', 7, jsonb_build_object('text', $$Pewarisan: Kenapa Mirip Orang Tua$$)),
(gen_random_uuid(), 'b2000004-0000-4000-8000-000000000004', 'PARAGRAPH', 8, jsonb_build_object('text', $$Kamu mewarisi separuh DNA dari ayah dan separuh dari ibu — itulah kenapa sifatmu campuran keduanya. Gregor Mendel, biarawan abad ke-19 yang menyilangkan kacang polong, menemukan pola pewarisan ini jauh sebelum DNA diketahui bentuknya.$$)),
(gen_random_uuid(), 'b2000004-0000-4000-8000-000000000004', 'HEADING', 9, jsonb_build_object('text', $$Mutasi dan Keragaman$$)),
(gen_random_uuid(), 'b2000004-0000-4000-8000-000000000004', 'PARAGRAPH', 10, jsonb_build_object('text', $$Kesalahan salin DNA disebut mutasi — sebagian besar tidak berpengaruh, sebagian berbahaya, dan sebagian kecil justru menguntungkan sehingga diwariskan (inilah bahan bakar evolusi). Teknologi baca DNA modern memungkinkan diagnosis penyakit genetik dan terapi yang disesuaikan dengan gen pasien.$$))
ON CONFLICT (id) DO NOTHING;

-- ============ 5. SCH-SMP-SEJ-001 ============
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, status, created_by, updated_by)
VALUES ('b2000005-0000-4000-8000-000000000005', 'SCH-SMP-SEJ-001', 'd4444444-4444-4444-4444-444444444444',
'IPS Kelas 8: Perang Dunia II', 'ips-kelas-8-perang-dunia-ii',
'Materi IPS kelas 8: latar belakang, jalannya, dan dampak Perang Dunia II bagi dunia dan Indonesia.',
'id', 8, 'DRAFT', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (id) DO NOTHING;

INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
(gen_random_uuid(), 'b2000005-0000-4000-8000-000000000005', 'HEADING', 1, jsonb_build_object('text', $$Tujuan Pembelajaran$$)),
(gen_random_uuid(), 'b2000005-0000-4000-8000-000000000005', 'PARAGRAPH', 2, jsonb_build_object('text', $$Setelah mempelajari materi ini, kamu dapat menjelaskan latar belakang terjadinya Perang Dunia II, mengidentifikasi blok-blok yang bertikai, serta menganalisis dampaknya bagi Indonesia.$$)),
(gen_random_uuid(), 'b2000005-0000-4000-8000-000000000005', 'HEADING', 3, jsonb_build_object('text', $$Latar Belakang$$)),
(gen_random_uuid(), 'b2000005-0000-4000-8000-000000000005', 'PARAGRAPH', 4, jsonb_build_object('text', $$Perang Dunia II (1939–1945) berakar pada kekecewaan Jerman atas Perjanjian Versailles 1919 yang memberatkan mereka pasca PD I, krisis ekonomi dunia 1929, serta bangkitnya fasisme: Nazi di Jerman (Hitler), fasis di Italia (Mussolini), dan militerisme di Jepang. Ketiganya membentuk Blok Poros (Axis).$$)),
(gen_random_uuid(), 'b2000005-0000-4000-8000-000000000005', 'HEADING', 5, jsonb_build_object('text', $$Jalannya Perang$$)),
(gen_random_uuid(), 'b2000005-0000-4000-8000-000000000005', 'LIST', 6, jsonb_build_object('items', ARRAY[$$1939: Jerman menyerbu Polandia — Inggris dan Prancis menyatakan perang$$, $$1941: Jepang menyerang Pearl Harbor — Amerika Serikat ikut perang$$, $$1942–1943: titik balik di Stalingrad dan Midway$$, $$1945: Jerman menyerah (Mei); bom atom di Hiroshima dan Nagasaki — Jepang menyerah (Agustus)$$])),
(gen_random_uuid(), 'b2000005-0000-4000-8000-000000000005', 'HEADING', 7, jsonb_build_object('text', $$Blok yang Bertikai$$)),
(gen_random_uuid(), 'b2000005-0000-4000-8000-000000000005', 'PARAGRAPH', 8, jsonb_build_object('text', $$Blok Poros: Jerman, Italia, Jepang. Blok Sekutu: Inggris, Uni Soviet, Amerika Serikat, dan kemudian Prancis serta Tiongkok. Perang ini menelan 70–85 juta korban jiwa — konflik paling mematikan dalam sejarah manusia.$$)),
(gen_random_uuid(), 'b2000005-0000-4000-8000-000000000005', 'HEADING', 9, jsonb_build_object('text', $$Dampak bagi Indonesia$$)),
(gen_random_uuid(), 'b2000005-0000-4000-8000-000000000005', 'PARAGRAPH', 10, jsonb_build_object('text', $$Jepang menduduki Indonesia (1942–1945) menggantikan Belanda. Pendudukan yang kejam justru membangkitkan kesadaran nasional: pemuda dilatih militer (PETA), bahasa Indonesia makin meluas, dan kekosongan kekuasaan pasca menyerahnya Jepang membuka jalan bagi Proklamasi 17 Agustus 1945.$$)),
(gen_random_uuid(), 'b2000005-0000-4000-8000-000000000005', 'HEADING', 11, jsonb_build_object('text', $$Latihan$$)),
(gen_random_uuid(), 'b2000005-0000-4000-8000-000000000005', 'LIST', 12, jsonb_build_object('items', ARRAY[$$1. Sebutkan tiga negara Blok Poros!$$, $$2. Peristiwa apa yang membuat Amerika Serikat ikut Perang Dunia II?$$, $$3. Jelaskan hubungan antara kekalahan Jepang dan Proklamasi Kemerdekaan Indonesia!$$]))
ON CONFLICT (id) DO NOTHING;

-- ============ 6. SCH-SD-AGAMA-001 ============
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, status, created_by, updated_by)
VALUES ('b2000006-0000-4000-8000-000000000006', 'SCH-SD-AGAMA-001', 'd9999999-9999-9999-9999-999999999999',
'Pendidikan Agama Kelas 3: Rukun Iman', 'pendidikan-agama-kelas-3-rukun-iman',
'Materi pendidikan agama Islam kelas 3 SD: mengenal enam rukun iman beserta contoh pengamalannya.',
'id', 6, 'DRAFT', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (id) DO NOTHING;

INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
(gen_random_uuid(), 'b2000006-0000-4000-8000-000000000006', 'HEADING', 1, jsonb_build_object('text', $$Tujuan Pembelajaran$$)),
(gen_random_uuid(), 'b2000006-0000-4000-8000-000000000006', 'PARAGRAPH', 2, jsonb_build_object('text', $$Setelah belajar, kamu dapat menyebutkan enam rukun iman dengan benar dan memberi contoh cara mengamalkannya dalam kehidupan sehari-hari.$$)),
(gen_random_uuid(), 'b2000006-0000-4000-8000-000000000006', 'HEADING', 3, jsonb_build_object('text', $$Apa Itu Rukun Iman?$$)),
(gen_random_uuid(), 'b2000006-0000-4000-8000-000000000006', 'PARAGRAPH', 4, jsonb_build_object('text', $$Iman artinya percaya dengan sepenuh hati. Rukun iman ada enam — seperti enam tiang penyangga rumah; jika satu hilang, keimanan tidak sempurna. Mari kita hafalkan satu per satu!$$)),
(gen_random_uuid(), 'b2000006-0000-4000-8000-000000000006', 'HEADING', 5, jsonb_build_object('text', $$Enam Rukun Iman$$)),
(gen_random_uuid(), 'b2000006-0000-4000-8000-000000000006', 'LIST', 6, jsonb_build_object('items', ARRAY[$$1. Iman kepada Allah — percaya Allah itu ada, Maha Pencipta segala sesuatu$$, $$2. Iman kepada malaikat — percaya malaikat diciptakan dari cahaya dan taat pada Allah$$, $$3. Iman kepada kitab-kitab Allah — percaya pada Al-Qur'an, Taurat, Zabur, dan Injil$$, $$4. Iman kepada rasul — percaya para nabi dan rasul utusan Allah, Nabi Muhammad penutupnya$$, $$5. Iman kepada hari kiamat — percaya akan datangnya hari pembalasan$$, $$6. Iman kepada qada dan qadar — percaya segala ketentuan baik dan buruk dari Allah$$])),
(gen_random_uuid(), 'b2000006-0000-4000-8000-000000000006', 'HEADING', 7, jsonb_build_object('text', $$Contoh Pengamalan$$)),
(gen_random_uuid(), 'b2000006-0000-4000-8000-000000000006', 'PARAGRAPH', 8, jsonb_build_object('text', $$Iman bukan hanya diucapkan, tapi dibuktikan: rajin salat dan berdoa (iman kepada Allah), jujur karena merasa diawasi malaikat Raqib dan Atid (iman kepada malaikat), membaca Al-Qur'an setiap hari (iman kepada kitab), meneladani akhlak Nabi Muhammad seperti jujur dan amanah (iman kepada rasul).$$)),
(gen_random_uuid(), 'b2000006-0000-4000-8000-000000000006', 'HEADING', 9, jsonb_build_object('text', $$Cara Menghafal$$)),
(gen_random_uuid(), 'b2000006-0000-4000-8000-000000000006', 'PARAGRAPH', 10, jsonb_build_object('text', $$Gunakan singkatan: Allah – Malaikat – Kitab – Rasul – Kiamat – Qada Qadar. Ucapkan berulang sambil bertepuk tangan, atau buat lagu pendek. Minta temanmu mengetes hafalanmu!$$)),
(gen_random_uuid(), 'b2000006-0000-4000-8000-000000000006', 'HEADING', 11, jsonb_build_object('text', $$Latihan$$)),
(gen_random_uuid(), 'b2000006-0000-4000-8000-000000000006', 'LIST', 12, jsonb_build_object('items', ARRAY[$$1. Sebutkan enam rukun iman secara berurutan!$$, $$2. Malaikat diciptakan Allah dari apa?$$, $$3. Sebutkan satu contoh mengamalkan iman kepada rasul dalam kehidupan sehari-hari!$$]))
ON CONFLICT (id) DO NOTHING;
