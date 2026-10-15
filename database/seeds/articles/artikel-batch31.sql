-- Artikel konten Madevi batch 31 — 2026-10-13
-- Owner principal: f7125028-187e-44e0-b95b-88b69b8d5c9a

-- ============ 1. TUT-KESEHATAN2-001 ============
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, status, created_by, updated_by)
VALUES ('e3100001-0000-4000-8000-000000000001', 'TUT-KESEHATAN2-001', 'b5555555-5555-5555-5555-555555555555',
'Kolesterol Tinggi: Pantangan dan Solusi',
'kolesterol-tinggi-pantangan-solusi',
'Panduan umum memahami kolesterol tinggi: pantangan makanan, gaya hidup sehat, dan kapan harus konsultasi dokter.',
'id', 7, 'DRAFT', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (id) DO NOTHING;

INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
(gen_random_uuid(), 'e3100001-0000-4000-8000-000000000001', 'HEADING', 1, jsonb_build_object('text', $$Masalah: Kolesterol Tinggi$$)),
(gen_random_uuid(), 'e3100001-0000-4000-8000-000000000001', 'PARAGRAPH', 2, jsonb_build_object('text', $$Hasil cek darah menunjukkan kolesterol total atau LDL (kolesterol jahat) di atas batas normal. Kolesterol tinggi sering tidak bergejala, tetapi meningkatkan risiko penyakit jantung dan stroke dalam jangka panjang.$$)),
(gen_random_uuid(), 'e3100001-0000-4000-8000-000000000001', 'HEADING', 3, jsonb_build_object('text', $$Penjelasan: Apa Itu Kolesterol$$)),
(gen_random_uuid(), 'e3100001-0000-4000-8000-000000000001', 'PARAGRAPH', 4, jsonb_build_object('text', $$Kolesterol adalah zat lemak yang dibutuhkan tubuh untuk membangun sel dan hormon. Ada LDL (low-density lipoprotein) yang menumpuk di dinding pembuluh darah, dan HDL (high-density lipoprotein) yang membantu membersihkannya. Masalah muncul ketika LDL terlalu tinggi atau HDL terlalu rendah.$$)),
(gen_random_uuid(), 'e3100001-0000-4000-8000-000000000001', 'HEADING', 5, jsonb_build_object('text', $$Pantangan Makanan$$)),
(gen_random_uuid(), 'e3100001-0000-4000-8000-000000000001', 'LIST', 6, jsonb_build_object('items', ARRAY[$$Gorengan dan makanan bersantan kental yang dikonsumsi berlebihan$$, $$Jeroan (otak, usus, babat) yang tinggi kolesterol$$, $$Kuning telur berlebihan (batasi 1 butir per hari bila disarankan dokter)$$, $$Makanan cepat saji dan olahan berpengawet$$, $$Minuman bersoda dan alkohol$$])),
(gen_random_uuid(), 'e3100001-0000-4000-8000-000000000001', 'HEADING', 7, jsonb_build_object('text', $$Langkah Solusi$$)),
(gen_random_uuid(), 'e3100001-0000-4000-8000-000000000001', 'LIST', 8, jsonb_build_object('items', ARRAY[$$1. Perbanyak sayur, buah, dan serat (oat, kacang-kacangan)$$, $$2. Ganti minyak goreng dengan minyak zaitun atau minyak kanola$$, $$3. Pilih protein tanpa lemak: ikan, dada ayam tanpa kulit, tahu-tempe$$, $$4. Olahraga rutin minimal 150 menit per minggu (jalan cepat, bersepeda)$$, $$5. Berhenti merokok dan kelola stres$$, $$6. Cek kolesterol ulang sesuai jadwal yang ditentukan dokter$$])),
(gen_random_uuid(), 'e3100001-0000-4000-8000-000000000001', 'HEADING', 9, jsonb_build_object('text', $$Risiko$$)),
(gen_random_uuid(), 'e3100001-0000-4000-8000-000000000001', 'PARAGRAPH', 10, jsonb_build_object('text', $$Jangan menghentikan atau mengganti obat kolesterol dari dokter tanpa konsultasi. Obat herbal atau suplemen bukan pengganti terapi medis — diskusikan dengan dokter sebelum mengonsumsinya karena bisa berinteraksi dengan obat.$$)),
(gen_random_uuid(), 'e3100001-0000-4000-8000-000000000001', 'HEADING', 11, jsonb_build_object('text', $$Kapan ke Dokter$$)),
(gen_random_uuid(), 'e3100001-0000-4000-8000-000000000001', 'PARAGRAPH', 12, jsonb_build_object('text', $$Segera konsultasi dokter bila kolesterol total di atas 240 mg/dL, ada riwayat penyakit jantung di keluarga, atau muncul gejala seperti nyeri dada dan sesak napas. Artikel ini bersifat informasi umum dan BUKAN pengganti nasihat medis profesional.$$))
ON CONFLICT (id) DO NOTHING;

-- ============ 2. TUT-OTOMOTIF2-001 ============
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, status, created_by, updated_by)
VALUES ('e3100002-0000-4000-8000-000000000002', 'TUT-OTOMOTIF2-001', 'b4444444-4444-4444-4444-444444444444',
'Ganti Oli Motor Sendiri di Rumah',
'ganti-oli-motor-sendiri',
'Panduan lengkap mengganti oli sepeda motor sendiri: alat, langkah, takaran, dan tips agar mesin awet.',
'id', 6, 'DRAFT', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (id) DO NOTHING;

INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
(gen_random_uuid(), 'e3100002-0000-4000-8000-000000000002', 'HEADING', 1, jsonb_build_object('text', $$Masalah: Oli Sudah Waktunya Diganti$$)),
(gen_random_uuid(), 'e3100002-0000-4000-8000-000000000002', 'PARAGRAPH', 2, jsonb_build_object('text', $$Motor sudah menempuh 2.000–3.000 km sejak ganti oli terakhir, suara mesin mulai kasar, atau tarikan terasa berat. Oli yang kotor tidak lagi melumasi dengan baik dan mempercepat keausan mesin.$$)),
(gen_random_uuid(), 'e3100002-0000-4000-8000-000000000002', 'HEADING', 3, jsonb_build_object('text', $$Penjelasan: Fungsi Oli Mesin$$)),
(gen_random_uuid(), 'e3100002-0000-4000-8000-000000000002', 'PARAGRAPH', 4, jsonb_build_object('text', $$Oli melumasi komponen mesin yang bergesekan, mendinginkan, membersihkan kotoran, dan mencegah karat. Seiring pemakaian, oli teroksidasi dan tercampur sisa pembakaran sehingga viskositasnya menurun.$$)),
(gen_random_uuid(), 'e3100002-0000-4000-8000-000000000002', 'HEADING', 5, jsonb_build_object('text', $$Alat yang Dibutuhkan$$)),
(gen_random_uuid(), 'e3100002-0000-4000-8000-000000000002', 'LIST', 6, jsonb_build_object('items', ARRAY[$$Oli baru sesuai spesifikasi motor (cek buku manual, umumnya 0,8–1 liter)$$, $$Kunci ring/pas 12 atau 17 mm (sesuai baut tap oli)$$, $$Corong minyak$$, $$Wadah penampung oli bekas (botol bekas)$$, $$Kain lap$$])),
(gen_random_uuid(), 'e3100002-0000-4000-8000-000000000002', 'HEADING', 7, jsonb_build_object('text', $$Langkah Penggantian$$)),
(gen_random_uuid(), 'e3100002-0000-4000-8000-000000000002', 'LIST', 8, jsonb_build_object('items', ARRAY[$$1. Panaskan mesin 2–3 menit agar oli encer, lalu matikan$$, $$2. Posisikan motor dengan standar tengah di permukaan rata$$, $$3. Letakkan wadah di bawah baut tap oli, buka baut berlawanan arah jarum jam$$, $$4. Tunggu oli menetes habis (5–10 menit), miringkan motor sedikit ke kiri-kanan$$, $$5. Pasang kembali baut tap, kencangkan secukupnya (jangan berlebihan)$$, $$6. Tuang oli baru lewat lubang pengisian memakai corong sesuai takaran$$, $$7. Cek dipstick: level oli harus di antara batas bawah dan atas$$, $$8. Nyalakan mesin 1 menit, matikan, cek ulang tidak ada rembesan$$])),
(gen_random_uuid(), 'e3100002-0000-4000-8000-000000000002', 'HEADING', 9, jsonb_build_object('text', $$Risiko$$)),
(gen_random_uuid(), 'e3100002-0000-4000-8000-000000000002', 'PARAGRAPH', 10, jsonb_build_object('text', $$Jangan membuka baut tap saat mesin panas menyengat (risiko luka bakar). Jangan mengencangkan baut berlebihan karena ulir bak oli bisa dol — perbaikannya mahal. Buang oli bekas ke tempat penampungan resmi, jangan ke tanah atau selokan.$$)),
(gen_random_uuid(), 'e3100002-0000-4000-8000-000000000002', 'HEADING', 11, jsonb_build_object('text', $$Penyelesaian$$)),
(gen_random_uuid(), 'e3100002-0000-4000-8000-000000000002', 'PARAGRAPH', 12, jsonb_build_object('text', $$Biaya ganti oli sendiri hanya harga oli (Rp45–120 ribu tergantung merek) versus Rp70–150 ribu di bengkel. Catat tanggal dan kilometer penggantian; ulangi tiap 2.000–3.000 km atau 2–3 bulan, mana yang lebih dulu tercapai.$$))
ON CONFLICT (id) DO NOTHING;

-- ============ 3. EXP-ANTROPOLOGI3-001 ============
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, status, created_by, updated_by)
VALUES ('e3100003-0000-4000-8000-000000000003', 'EXP-ANTROPOLOGI3-001', 'c8888888-8888-8888-8888-888888888888',
'Suku Dayak: Penjaga Hutan Kalimantan',
'suku-dayak-penjaga-hutan-kalimantan',
'Mengenal suku Dayak: asal-usul, budaya, rumah betang, dan peran mereka menjaga hutan hujan Kalimantan.',
'id', 7, 'DRAFT', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (id) DO NOTHING;

INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
(gen_random_uuid(), 'e3100003-0000-4000-8000-000000000003', 'HEADING', 1, jsonb_build_object('text', $$Siapa Suku Dayak$$)),
(gen_random_uuid(), 'e3100003-0000-4000-8000-000000000003', 'PARAGRAPH', 2, jsonb_build_object('text', $$Dayak adalah sebutan kolektif untuk ratusan kelompok etnis asli pedalaman Kalimantan, Indonesia dan Malaysia. Kata Dayak berasal dari bahasa setempat yang berarti orang pedalaman atau orang hulu sungai. Jumlah sub-suku Dayak diperkirakan lebih dari 200 kelompok dengan bahasa dan adat yang berbeda-beda.$$)),
(gen_random_uuid(), 'e3100003-0000-4000-8000-000000000003', 'HEADING', 3, jsonb_build_object('text', $$Rumah Betang$$)),
(gen_random_uuid(), 'e3100003-0000-4000-8000-000000000003', 'PARAGRAPH', 4, jsonb_build_object('text', $$Ciri khas paling terkenal adalah rumah betang: rumah panggung panjang yang dihuni banyak keluarga sekaligus, bisa mencapai 150 meter. Rumah betang mencerminkan nilai kebersamaan — satu atap menaungi puluhan kepala keluarga yang hidup bergotong royong.$$)),
(gen_random_uuid(), 'e3100003-0000-4000-8000-000000000003', 'HEADING', 5, jsonb_build_object('text', $$Kepercayaan dan Adat$$)),
(gen_random_uuid(), 'e3100003-0000-4000-8000-000000000003', 'PARAGRAPH', 6, jsonb_build_object('text', $$Banyak sub-suku Dayak menganut Kaharingan, kepercayaan asli yang menghormati Ranying Hatalla (Tuhan) dan roh leluhur. Ritual Tiwah adalah upacara pemakaman sekunder yang megah untuk mengantarkan arwah ke alam baka. Kini sebagian besar Dayak memeluk Kristen, Katolik, atau Islam sambil tetap menjaga adat.$$)),
(gen_random_uuid(), 'e3100003-0000-4000-8000-000000000003', 'HEADING', 7, jsonb_build_object('text', $$Seni dan Simbol$$)),
(gen_random_uuid(), 'e3100003-0000-4000-8000-000000000003', 'PARAGRAPH', 8, jsonb_build_object('text', $$Tato tradisional Dayak bukan sekadar hiasan — setiap motif menandai status sosial, perjalanan hidup, dan perlindungan spiritual. Ukiran kayu, mandau (parang khas), dan tarian perang Hudoq adalah warisan seni yang masih dilestarikan dalam festival budaya.$$)),
(gen_random_uuid(), 'e3100003-0000-4000-8000-000000000003', 'HEADING', 9, jsonb_build_object('text', $$Penjaga Hutan$$)),
(gen_random_uuid(), 'e3100003-0000-4000-8000-000000000003', 'PARAGRAPH', 10, jsonb_build_object('text', $$Masyarakat Dayak mempraktikkan kearifan lokal menjaga hutan: larangan menebang di hutan adat (tana ulen), sistem ladang berpindah yang memberi waktu hutan pulih, dan pengetahuan obat-obatan dari tumbuhan hutan. Di tengah deforestasi Kalimantan, peran mereka sebagai penjaga hutan hujan tropis semakin penting bagi iklim dunia.$$))
ON CONFLICT (id) DO NOTHING;

-- ============ 4. EXP-KIMIA5-001 ============
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, status, created_by, updated_by)
VALUES ('e3100004-0000-4000-8000-000000000004', 'EXP-KIMIA5-001', 'c4444444-4444-4444-4444-444444444444',
'Garam: Lebih dari Sekadar Bumbu',
'garam-lebih-dari-sekadar-bumbu',
'Garam dapur (NaCl) dari sudut pandang kimia: struktur kristal, peran dalam tubuh, sejarah perdagangan, hingga industri.',
'id', 6, 'DRAFT', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (id) DO NOTHING;

INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
(gen_random_uuid(), 'e3100004-0000-4000-8000-000000000004', 'HEADING', 1, jsonb_build_object('text', $$Natrium Klorida$$)),
(gen_random_uuid(), 'e3100004-0000-4000-8000-000000000004', 'PARAGRAPH', 2, jsonb_build_object('text', $$Garam dapur adalah natrium klorida (NaCl), senyawa ionik dari ion natrium (Na+) dan ion klorida (Cl-). Dalam keadaan padat ia membentuk kristal kubus yang rapi; saat dilarutkan dalam air, ion-ionnya terpisah dan menghantarkan listrik — inilah alasan air garam disebut elektrolit.$$)),
(gen_random_uuid(), 'e3100004-0000-4000-8000-000000000004', 'HEADING', 3, jsonb_build_object('text', $$Dari Mana Garam Berasal$$)),
(gen_random_uuid(), 'e3100004-0000-4000-8000-000000000004', 'PARAGRAPH', 4, jsonb_build_object('text', $$Sebagian besar garam dunia berasal dari air laut yang diuapkan di tambak garam, atau ditambang dari deposit garam purba di bawah tanah. Indonesia memproduksi garam rakyat di Madura, Cirebon, dan Nusa Tenggara Timur dengan metode penjemuran tradisional.$$)),
(gen_random_uuid(), 'e3100004-0000-4000-8000-000000000004', 'HEADING', 5, jsonb_build_object('text', $$Peran dalam Tubuh$$)),
(gen_random_uuid(), 'e3100004-0000-4000-8000-000000000004', 'PARAGRAPH', 6, jsonb_build_object('text', $$Natrium menjaga keseimbangan cairan tubuh dan penting untuk kerja saraf dan otot. Namun kelebihan garam menaikkan tekanan darah. WHO menganjurkan konsumsi garam maksimal 5 gram per hari — kira-kira satu sendok teh.$$)),
(gen_random_uuid(), 'e3100004-0000-4000-8000-000000000004', 'HEADING', 7, jsonb_build_object('text', $$Sejarah: Emas Putih$$)),
(gen_random_uuid(), 'e3100004-0000-4000-8000-000000000004', 'PARAGRAPH', 8, jsonb_build_object('text', $$Sebelum ada kulkas, garam adalah pengawet makanan utama — daging dan ikan diasinkan agar tahan berbulan-bulan. Saking berharganya, garam pernah dijadikan alat tukar dan upah; kata salary (gaji) dalam bahasa Inggris berasal dari bahasa Latin salarium, tunjangan garam untuk tentara Romawi.$$)),
(gen_random_uuid(), 'e3100004-0000-4000-8000-000000000004', 'HEADING', 9, jsonb_build_object('text', $$Di Luar Dapur$$)),
(gen_random_uuid(), 'e3100004-0000-4000-8000-000000000004', 'PARAGRAPH', 10, jsonb_build_object('text', $$Industri kimia memakai garam sebagai bahan baku pembuatan klorin, soda kaustik, dan soda abu lewat proses elektrolisis. Garam juga dipakai mencairkan es di jalan bersalju, menyamak kulit, dan dalam cairan infus medis (larutan saline 0,9 persen).$$))
ON CONFLICT (id) DO NOTHING;

-- ============ 5. SCH-SMA-SEJ2-001 ============
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, status, created_by, updated_by)
VALUES ('e3100005-0000-4000-8000-000000000005', 'SCH-SMA-SEJ2-001', 'd5555555-5555-5555-5555-555555555555',
'Sejarah Kelas 11: Pergerakan Nasional Indonesia',
'sejarah-kelas-11-pergerakan-nasional',
'Materi sejarah kelas 11 SMA: latar belakang, organisasi, dan tokoh pergerakan nasional Indonesia menuju kemerdekaan.',
'id', 8, 'DRAFT', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (id) DO NOTHING;

INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
(gen_random_uuid(), 'e3100005-0000-4000-8000-000000000005', 'HEADING', 1, jsonb_build_object('text', $$Tujuan Pembelajaran$$)),
(gen_random_uuid(), 'e3100005-0000-4000-8000-000000000005', 'PARAGRAPH', 2, jsonb_build_object('text', $$Setelah mempelajari materi ini, siswa diharapkan mampu menjelaskan latar belakang lahirnya pergerakan nasional, mengidentifikasi organisasi-organisasi pergerakan beserta tokohnya, dan menganalisis peran Sumpah Pemuda 1928 dalam persatuan bangsa.$$)),
(gen_random_uuid(), 'e3100005-0000-4000-8000-000000000005', 'HEADING', 3, jsonb_build_object('text', $$Latar Belakang$$)),
(gen_random_uuid(), 'e3100005-0000-4000-8000-000000000005', 'PARAGRAPH', 4, jsonb_build_object('text', $$Pergerakan nasional lahir dari penderitaan akibat penjajahan Belanda: kerja paksa, pajak berat, dan diskriminasi. Pendidikan Barat yang diterima kaum terpelajar pribumi justru menumbuhkan kesadaran nasionalisme — mereka sadar bahwa kemerdekaan harus diperjuangkan bersama, bukan per daerah seperti perlawanan abad ke-19.$$)),
(gen_random_uuid(), 'e3100005-0000-4000-8000-000000000005', 'HEADING', 5, jsonb_build_object('text', $$Organisasi Pergerakan$$)),
(gen_random_uuid(), 'e3100005-0000-4000-8000-000000000005', 'LIST', 6, jsonb_build_object('items', ARRAY[$$Budi Utomo (1908) — pelopor, didirikan Dr. Sutomo dan para mahasiswa STOVIL$$, $$Sarekat Islam (1912) — H.O.S. Tjokroaminoto, organisasi massa terbesar$$, $$Indische Partij (1912) — Douwes Dekker, Tjipto Mangoenkoesoemo, Suwardi Suryaningrat; menuntut kemerdekaan$$, $$Perhimpunan Indonesia — di Belanda, dipimpin Mohammad Hatta$$, $$PNI (1927) — Soekarno, asas kebangsaan$$])),
(gen_random_uuid(), 'e3100005-0000-4000-8000-000000000005', 'HEADING', 7, jsonb_build_object('text', $$Sumpah Pemuda 1928$$)),
(gen_random_uuid(), 'e3100005-0000-4000-8000-000000000005', 'PARAGRAPH', 8, jsonb_build_object('text', $$Kongres Pemuda II pada 27–28 Oktober 1928 menghasilkan ikrar: satu tanah air, satu bangsa, satu bahasa — Indonesia. Lagu Indonesia Raya karya W.R. Supratman pertama kali diperdengarkan. Sumpah Pemuda menjadi tonggak persatuan melampaui batas suku dan daerah.$$)),
(gen_random_uuid(), 'e3100005-0000-4000-8000-000000000005', 'HEADING', 9, jsonb_build_object('text', $$Contoh: Menganalisis Peran Tokoh$$)),
(gen_random_uuid(), 'e3100005-0000-4000-8000-000000000005', 'PARAGRAPH', 10, jsonb_build_object('text', $$Soekarno menyatukan tiga aliran — nasionalisme, Islamisme, dan marxisme — dalam tulisannya Nasionalisme, Islamisme, dan Marxisme (1926). Strategi ini memperluas basis massa pergerakan karena merangkul kelompok yang sebelumnya berjalan sendiri-sendiri.$$)),
(gen_random_uuid(), 'e3100005-0000-4000-8000-000000000005', 'HEADING', 11, jsonb_build_object('text', $$Latihan Soal$$)),
(gen_random_uuid(), 'e3100005-0000-4000-8000-000000000005', 'LIST', 12, jsonb_build_object('items', ARRAY[$$1. Sebutkan tiga faktor pendorong lahirnya pergerakan nasional Indonesia!$$, $$2. Mengapa Budi Utomo disebut sebagai pelopor pergerakan nasional?$$, $$3. Jelaskan isi dan makna Sumpah Pemuda 1928!$$]))
ON CONFLICT (id) DO NOTHING;

-- Kunci jawaban SCH-SMA-SEJ2-001
INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
(gen_random_uuid(), 'e3100005-0000-4000-8000-000000000005', 'HEADING', 13, jsonb_build_object('text', $$Kunci Jawaban$$)),
(gen_random_uuid(), 'e3100005-0000-4000-8000-000000000005', 'LIST', 14, jsonb_build_object('items', ARRAY[$$1. Penderitaan akibat penjajahan, munculnya kaum terpelajar, kemenangan Jepang atas Rusia (1905) yang membangkitkan semangat Asia, serta pengaruh pergerakan di negara lain.$$ , $$2. Karena Budi Utomo (1908) adalah organisasi modern pertama yang berjuang dengan cara organisasi, pers, dan pendidikan — bukan perlawanan fisik kedaerahan.$$ , $$3. Ikrar satu tanah air, satu bangsa, satu bahasa Indonesia; maknanya adalah tekad persatuan seluruh pemuda Nusantara melampaui perbedaan suku, agama, dan daerah menuju Indonesia merdeka.$$]))
ON CONFLICT (id) DO NOTHING;

-- ============ 6. SCH-SD-IPA4-001 ============
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, status, created_by, updated_by)
VALUES ('e3100006-0000-4000-8000-000000000006', 'SCH-SD-IPA4-001', 'd3333333-3333-3333-3333-333333333333',
'IPA Kelas 4: Gaya dan Gerak',
'ipa-kelas-4-gaya-dan-gerak',
'Materi IPA kelas 4 SD: pengertian gaya, macam-macam gaya, pengaruh gaya terhadap gerak benda, dan contoh sehari-hari.',
'id', 6, 'DRAFT', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (id) DO NOTHING;

INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
(gen_random_uuid(), 'e3100006-0000-4000-8000-000000000006', 'HEADING', 1, jsonb_build_object('text', $$Tujuan Pembelajaran$$)),
(gen_random_uuid(), 'e3100006-0000-4000-8000-000000000006', 'PARAGRAPH', 2, jsonb_build_object('text', $$Setelah belajar materi ini, siswa dapat menjelaskan pengertian gaya, menyebutkan macam-macam gaya, dan memberi contoh pengaruh gaya terhadap gerak benda dalam kehidupan sehari-hari.$$)),
(gen_random_uuid(), 'e3100006-0000-4000-8000-000000000006', 'HEADING', 3, jsonb_build_object('text', $$Apa Itu Gaya$$)),
(gen_random_uuid(), 'e3100006-0000-4000-8000-000000000006', 'PARAGRAPH', 4, jsonb_build_object('text', $$Gaya adalah tarikan atau dorongan yang dapat mengubah gerak benda. Ketika kamu mendorong meja, melempar bola, atau menarik pintu — semuanya menggunakan gaya. Tanpa gaya, benda diam akan tetap diam dan benda bergerak akan terus bergerak lurus.$$)),
(gen_random_uuid(), 'e3100006-0000-4000-8000-000000000006', 'HEADING', 5, jsonb_build_object('text', $$Macam-macam Gaya$$)),
(gen_random_uuid(), 'e3100006-0000-4000-8000-000000000006', 'LIST', 6, jsonb_build_object('items', ARRAY[$$Gaya otot — dari tenaga manusia atau hewan, contoh: mendorong gerobak$$, $$Gaya gravitasi — tarikan bumi, contoh: buah jatuh dari pohon$$, $$Gaya gesek — hambatan antara dua permukaan, contoh: rem sepeda$$, $$Gaya magnet — tarikan magnet pada besi$$, $$Gaya pegas — dorongan pegas yang diregangkan$$])),
(gen_random_uuid(), 'e3100006-0000-4000-8000-000000000006', 'HEADING', 7, jsonb_build_object('text', $$Pengaruh Gaya pada Benda$$)),
(gen_random_uuid(), 'e3100006-0000-4000-8000-000000000006', 'LIST', 8, jsonb_build_object('items', ARRAY[$$Membuat benda diam menjadi bergerak (menendang bola)$$, $$Membuat benda bergerak menjadi diam (menangkap bola)$$, $$Mengubah arah gerak benda (membelokkan bola)$$, $$Mengubah bentuk benda (meremas plastisin)$$, $$Mempercepat atau memperlambat gerak (mengayuh sepeda)$$])),
(gen_random_uuid(), 'e3100006-0000-4000-8000-000000000006', 'HEADING', 9, jsonb_build_object('text', $$Contoh Sehari-hari$$)),
(gen_random_uuid(), 'e3100006-0000-4000-8000-000000000006', 'PARAGRAPH', 10, jsonb_build_object('text', $$Saat bermain jungkat-jungkit, gaya gravitasi menarikmu ke bawah sedangkan gaya otot kakimu mendorong ke atas. Layang-layang bisa terbang karena gaya angin mendorongnya ke atas melawan gravitasi. Kertas yang diremas berubah bentuk karena gaya otot jarimu.$$)),
(gen_random_uuid(), 'e3100006-0000-4000-8000-000000000006', 'HEADING', 11, jsonb_build_object('text', $$Latihan Soal$$)),
(gen_random_uuid(), 'e3100006-0000-4000-8000-000000000006', 'LIST', 12, jsonb_build_object('items', ARRAY[$$1. Apa yang dimaksud dengan gaya?$$, $$2. Sebutkan tiga macam gaya beserta contohnya!$$, $$3. Bola yang ditendang lalu berhenti sendiri — gaya apa yang bekerja?$$]))
ON CONFLICT (id) DO NOTHING;

-- Kunci jawaban SCH-SD-IPA4-001
INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
(gen_random_uuid(), 'e3100006-0000-4000-8000-000000000006', 'HEADING', 13, jsonb_build_object('text', $$Kunci Jawaban$$)),
(gen_random_uuid(), 'e3100006-0000-4000-8000-000000000006', 'LIST', 14, jsonb_build_object('items', ARRAY[$$1. Gaya adalah tarikan atau dorongan yang dapat mengubah gerak atau bentuk benda.$$ , $$2. Contoh: gaya otot (mendorong meja), gaya gravitasi (buah jatuh), gaya gesek (rem sepeda), gaya magnet (magnet menarik paku).$$ , $$3. Gaya gesek antara bola dan rumput/tanah yang memperlambat bola hingga berhenti.$$]))
ON CONFLICT (id) DO NOTHING;
