-- Artikel konten Madevi batch 21 — 2026-10-13
-- Owner principal: f7125028-187e-44e0-b95b-88b69b8d5c9a

-- ============ 1. TUT-KERAJINAN-001 ============
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, status, created_by, updated_by)
VALUES (gen_random_uuid(), 'TUT-KERAJINAN-001', 'b7777777-7777-7777-7777-777777777777',
'Kerajinan Tangan dari Barang Bekas: Kreatif dan Ramah Lingkungan', 'kerajinan-tangan-dari-barang-bekas',
'Ubah botol plastik, kardus, dan kaleng bekas menjadi kerajinan tangan yang cantik dan bermanfaat.',
'id', 8, 'DRAFT', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;

DO $do$
DECLARE art_id uuid;
BEGIN
SELECT id INTO art_id FROM madevi.articles WHERE business_code = 'TUT-KERAJINAN-001';
IF art_id IS NULL THEN RETURN; END IF;
INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
(gen_random_uuid(), art_id, 'HEADING', 1, jsonb_build_object('text', $$Masalah: Sampah Menumpuk, Kreativitas Terbuang$$)),
(gen_random_uuid(), art_id, 'PARAGRAPH', 2, jsonb_build_object('text', $$Setiap rumah menghasilkan sampah botol plastik, kardus, dan kaleng setiap hari. Dibuang begitu saja, barang-barang ini menjadi beban lingkungan. Padahal dengan sedikit kreativitas, barang bekas bisa disulap menjadi kerajinan tangan yang cantik, bermanfaat, bahkan bernilai jual.$$)),
(gen_random_uuid(), art_id, 'HEADING', 3, jsonb_build_object('text', $$Penjelasan: Prinsip 3R dalam Kerajinan$$)),
(gen_random_uuid(), art_id, 'PARAGRAPH', 4, jsonb_build_object('text', $$Kerajinan dari barang bekas menerapkan prinsip Reduce, Reuse, Recycle. Kuncinya: pilih bahan yang bersih dan kuat strukturnya (botol PET, kardus tebal, kaleng), lalu kombinasikan dengan bahan penunjang murah seperti lem tembak, cat akrilik, dan tali.$$)),
(gen_random_uuid(), art_id, 'HEADING', 5, jsonb_build_object('text', $$Alat dan Bahan yang Dibutuhkan$$)),
(gen_random_uuid(), art_id, 'LIST', 6, jsonb_build_object('items', ARRAY[$$Botol plastik / kardus / kaleng bekas (cuci dan keringkan dulu)$$, $$Gunting dan cutter$$, $$Lem tembak atau lem kayu$$, $$Cat akrilik + kuas$$, $$Tali rami, kain perca, atau kertas kado untuk hiasan$$])),
(gen_random_uuid(), art_id, 'HEADING', 7, jsonb_build_object('text', $$Langkah: Membuat Pot Bunga dari Botol Bekas$$)),
(gen_random_uuid(), art_id, 'LIST', 8, jsonb_build_object('items', ARRAY[$$1. Potong botol plastik menjadi dua bagian; pakai bagian bawah sebagai badan pot$$, $$2. Lubangi dasar pot dengan paku panas untuk drainase air$$, $$3. Amplas tepi potongan agar tidak tajam$$, $$4. Cat seluruh permukaan dengan cat akrilik; biarkan kering$$, $$5. Hiasi dengan tali rami yang dililitkan memakai lem tembak$$, $$6. Isi dengan tanah dan tanami bunga atau sayur$$])),
(gen_random_uuid(), art_id, 'HEADING', 9, jsonb_build_object('text', $$Risiko$$)),
(gen_random_uuid(), art_id, 'PARAGRAPH', 10, jsonb_build_object('text', $$Hati-hati memakai cutter dan lem tembak panas — jauhkan dari anak kecil. Jangan pakai kaleng berkarat untuk wadah makanan. Cuci bersih semua bahan bekas sebelum diolah agar tidak ada sisa bahan kimia.$$)),
(gen_random_uuid(), art_id, 'HEADING', 11, jsonb_build_object('text', $$Penyelesaian$$)),
(gen_random_uuid(), art_id, 'PARAGRAPH', 12, jsonb_build_object('text', $$Satu pot bunga dari botol bekas menghemat Rp15–30 ribu dibanding beli pot baru. Kembangkan ke produk lain: tempat pensil dari kaleng, lampu hias dari sendok plastik, atau tas dari bungkus kopi — banyak yang laku dijual Rp25–100 ribu per buah di marketplace kerajinan.$$))
ON CONFLICT (id) DO NOTHING;
END $do$;

-- ============ 2. TUT-PUASA-001 ============
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, status, created_by, updated_by)
VALUES (gen_random_uuid(), 'TUT-PUASA-001', 'b5555555-5555-5555-5555-555555555555',
'Puasa Sehat: Tips Tetap Bugar Selama Ramadhan', 'puasa-sehat-tips-tetap-bugar-ramadhan',
'Panduan menjaga energi, hidrasi, dan kesehatan tubuh selama berpuasa Ramadhan.',
'id', 8, 'DRAFT', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;

DO $do$
DECLARE art_id uuid;
BEGIN
SELECT id INTO art_id FROM madevi.articles WHERE business_code = 'TUT-PUASA-001';
IF art_id IS NULL THEN RETURN; END IF;
INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
(gen_random_uuid(), art_id, 'HEADING', 1, jsonb_build_object('text', $$Masalah: Lemas dan Dehidrasi Saat Puasa$$)),
(gen_random_uuid(), art_id, 'PARAGRAPH', 2, jsonb_build_object('text', $$Banyak orang merasa lemas, pusing, atau sulit fokus saat berpuasa — terutama di minggu pertama Ramadhan. Penyebab utamanya bukan puasanya, melainkan pola makan sahur dan berbuka yang keliru serta kurangnya cairan.$$)),
(gen_random_uuid(), art_id, 'HEADING', 3, jsonb_build_object('text', $$Penjelasan: Apa yang Terjadi di Tubuh$$)),
(gen_random_uuid(), art_id, 'PARAGRAPH', 4, jsonb_build_object('text', $$Saat puasa, tubuh beralih memakai cadangan glikogen lalu lemak sebagai energi. Proses ini normal dan sehat. Masalah muncul jika asupan sahur minim serat dan protein (energi cepat habis) atau berbuka langsung makan berat berminyak (gula darah melonjak lalu drop).$$)),
(gen_random_uuid(), art_id, 'HEADING', 5, jsonb_build_object('text', $$Persiapan yang Dibutuhkan$$)),
(gen_random_uuid(), art_id, 'LIST', 6, jsonb_build_object('items', ARRAY[$$Air putih minimal 2 liter antara maghrib–subuh (pola 2-4-2: 2 gelas berbuka, 4 gelas malam, 2 gelas sahur)$$, $$Makanan sahur: karbohidrat kompleks (nasi merah/oat), protein (telur/ayam), sayur dan buah$$, $$Kurma 3 butir untuk berbuka (gula alami + serat)$$, $$Jadwal tidur yang disesuaikan: tidur lebih awal, manfaatkan tidur siang 20–30 menit$$])),
(gen_random_uuid(), art_id, 'HEADING', 7, jsonb_build_object('text', $$Langkah Menjalani Puasa Sehat$$)),
(gen_random_uuid(), art_id, 'LIST', 8, jsonb_build_object('items', ARRAY[$$1. Berbuka dengan kurma + air putih, tunggu 10–15 menit sebelum makan besar$$, $$2. Makan malam secukupnya, hindari gorengan berlebihan$$, $$3. Jangan lewatkan sahur; akhiri sahur mendekati imsak$$, $$4. Olahraga ringan (jalan 20–30 menit) setelah tarawih, bukan siang hari$$, $$5. Kurangi kafein bertahap seminggu sebelum Ramadhan agar tidak sakit kepala$$])),
(gen_random_uuid(), art_id, 'HEADING', 9, jsonb_build_object('text', $$Risiko$$)),
(gen_random_uuid(), art_id, 'PARAGRAPH', 10, jsonb_build_object('text', $$Penderita diabetes, maag kronis, ibu hamil/menyusui, dan lansia dengan penyakit tertentu WAJIB konsultasi dokter sebelum berpuasa. Jika pusing berat, pandangan berkunang, atau jantung berdebar — segera berbuka, kesehatan didahulukan (syariat memberi keringanan).$$)),
(gen_random_uuid(), art_id, 'HEADING', 11, jsonb_build_object('text', $$Penyelesaian$$)),
(gen_random_uuid(), art_id, 'PARAGRAPH', 12, jsonb_build_object('text', $$Dengan pola makan dan hidrasi yang benar, sebagian besar orang justru merasa lebih bugar setelah minggu kedua puasa — berat badan turun 1–3 kg dan pencernaan membaik. Jadikan Ramadhan momentum reset gaya hidup sehat, bukan sekadar menahan lapar.$$))
ON CONFLICT (id) DO NOTHING;
END $do$;

-- ============ 3. EXP-PALEONTOLOGI-001 ============
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, status, created_by, updated_by)
VALUES (gen_random_uuid(), 'EXP-PALEONTOLOGI-001', 'c2222222-2222-2222-2222-222222222222',
'Dinosaurus: Raksasa yang Pernah Menguasai Bumi', 'dinosaurus-raksasa-yang-punah',
'Mengenal dinosaurus: jenis-jenisnya, cara ilmuwan mempelajarinya, dan misteri kepunahannya.',
'id', 7, 'DRAFT', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;

DO $do$
DECLARE art_id uuid;
BEGIN
SELECT id INTO art_id FROM madevi.articles WHERE business_code = 'EXP-PALEONTOLOGI-001';
IF art_id IS NULL THEN RETURN; END IF;
INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
(gen_random_uuid(), art_id, 'HEADING', 1, jsonb_build_object('text', $$Apa Itu Dinosaurus?$$)),
(gen_random_uuid(), art_id, 'PARAGRAPH', 2, jsonb_build_object('text', $$Dinosaurus adalah kelompok reptil raksasa yang hidup pada Era Mesozoikum, sekitar 252 hingga 66 juta tahun lalu. Kata dinosaurus berasal dari bahasa Yunani deinos (mengerikan) dan sauros (kadal). Mereka bukan kadal biasa — kaki mereka tegak di bawah tubuh seperti mamalia, bukan menyamping seperti kadal modern.$$)),
(gen_random_uuid(), art_id, 'HEADING', 3, jsonb_build_object('text', $$Dua Kelompok Besar$$)),
(gen_random_uuid(), art_id, 'PARAGRAPH', 4, jsonb_build_object('text', $$Dinosaurus dibagi dua ordo berdasarkan struktur panggul: Saurischia (panggul kadal) mencakup pemakan tumbuhan raksasa berleher panjang seperti Brachiosaurus dan predator seperti Tyrannosaurus rex; Ornithischia (panggul burung) mencakup Triceratops, Stegosaurus, dan Ankylosaurus yang berzirah.$$)),
(gen_random_uuid(), art_id, 'HEADING', 5, jsonb_build_object('text', $$Raksasa-Raksasa Terkenal$$)),
(gen_random_uuid(), art_id, 'LIST', 6, jsonb_build_object('items', ARRAY[$$Tyrannosaurus rex: predator 12 meter, gigitan terkuat di antara hewan darat yang pernah ada$$, $$Argentinosaurus: herbivora 35 meter, 80–100 ton — hewan darat terbesar yang diketahui$$, $$Velociraptor: seukuran kalkun, cerdas, berburu berkelompok (berbeda jauh dari versi film)$$, $$Spinosaurus: lebih besar dari T. rex, hidup semi-akuatik berburu ikan$$])),
(gen_random_uuid(), art_id, 'HEADING', 7, jsonb_build_object('text', $$Bagaimana Ilmuwan Mengetahuinya?$$)),
(gen_random_uuid(), art_id, 'PARAGRAPH', 8, jsonb_build_object('text', $$Paleontolog mempelajari fosil: tulang, gigi, telur, bahkan jejak kaki yang membatu. Dari fosil, mereka merekonstruksi bentuk tubuh, pola makan (dari bentuk gigi), dan perilaku (dari jejak kaki berkelompok). Teknik penanggalan radiometrik menentukan umur lapisan batuan tempat fosil ditemukan.$$)),
(gen_random_uuid(), art_id, 'HEADING', 9, jsonb_build_object('text', $$Misteri Kepunahan 66 Juta Tahun Lalu$$)),
(gen_random_uuid(), art_id, 'PARAGRAPH', 10, jsonb_build_object('text', $$Bukti terkuat: kawah Chicxulub di Meksiko selebar 180 km, lapisan iridium global (unsur langka di Bumi tapi umum di asteroid), dan usia yang cocok. Asteroid selebar 10 km menghantam Bumi, memicu kebakaran global, tsunami raksasa, dan musim dingin nuklir bertahun-tahun. 75% spesies punah — tapi burung, keturunan dinosaurus theropoda kecil, selamat hingga kini.$$))
ON CONFLICT (id) DO NOTHING;
END $do$;

-- ============ 4. EXP-OSEANOGRAFI2-001 ============
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, status, created_by, updated_by)
VALUES (gen_random_uuid(), 'EXP-OSEANOGRAFI2-001', 'c6000001-0000-0000-0000-000000000001',
'Terumbu Karang: Hutan Hujan di Bawah Laut', 'terumbu-karang-hutan-hujan-laut',
'Ekosistem terumbu karang: pembentuknya, keanekaragaman hayatinya, dan ancaman yang dihadapinya.',
'id', 7, 'DRAFT', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;

DO $do$
DECLARE art_id uuid;
BEGIN
SELECT id INTO art_id FROM madevi.articles WHERE business_code = 'EXP-OSEANOGRAFI2-001';
IF art_id IS NULL THEN RETURN; END IF;
INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
(gen_random_uuid(), art_id, 'HEADING', 1, jsonb_build_object('text', $$Apa Itu Terumbu Karang?$$)),
(gen_random_uuid(), art_id, 'PARAGRAPH', 2, jsonb_build_object('text', $$Terumbu karang adalah struktur raksasa yang dibangun oleh koloni polip karang — hewan kecil seukuran ujung jarum yang mensekresikan kalsium karbonat. Tumbuh hanya beberapa milimeter per tahun, terumbu besar seperti Great Barrier Reef terbentuk selama jutaan tahun dan terlihat dari luar angkasa.$$)),
(gen_random_uuid(), art_id, 'HEADING', 3, jsonb_build_object('text', $$Simbiosis yang Menakjubkan$$)),
(gen_random_uuid(), art_id, 'PARAGRAPH', 4, jsonb_build_object('text', $$Polip karang hidup bersimbiosis dengan zooxanthellae, alga mikroskopis yang berfotosintesis di dalam jaringan karang. Alga memberi makanan dan warna-warni karang; karang memberi tempat tinggal dan nutrisi. Jika air terlalu panas, karang mengusir alganya — inilah pemutihan karang (coral bleaching).$$)),
(gen_random_uuid(), art_id, 'HEADING', 5, jsonb_build_object('text', $$Hutan Hujan Laut$$)),
(gen_random_uuid(), art_id, 'PARAGRAPH', 6, jsonb_build_object('text', $$Terumbu karang menutupi kurang dari 1% dasar laut, tetapi menjadi rumah bagi 25% spesies laut: ribuan jenis ikan, moluska, krustasea, dan hiu karang. Indonesia berada di jantung Segitiga Terumbu Karang (Coral Triangle) — pusat keanekaragaman karang tertinggi di dunia dengan 600+ spesies karang.$$)),
(gen_random_uuid(), art_id, 'HEADING', 7, jsonb_build_object('text', $$Manfaat bagi Manusia$$)),
(gen_random_uuid(), art_id, 'LIST', 8, jsonb_build_object('items', ARRAY[$$Melindungi pantai dari abrasi dan gelombang badai$$, $$Sumber protein: perikanan karang menopang 500 juta jiwa$$, $$Wisata bahari: menyelam dan snorkeling bernilai miliaran dolar$$, $$Apotek laut: senyawa anti-kanker dan obat ditemukan dari organisme karang$$])),
(gen_random_uuid(), art_id, 'HEADING', 9, jsonb_build_object('text', $$Ancaman dan Harapan$$)),
(gen_random_uuid(), art_id, 'PARAGRAPH', 10, jsonb_build_object('text', $$Pemanasan global adalah ancaman terbesar: pemutihan massal 2016–2017 merusak dua pertiga Great Barrier Reef. Ditambah penangkapan ikan dengan bom, polusi plastik, dan sedimentasi. Namun karang bisa pulih — kawasan lindung laut, transplantasi karang, dan penurunan emisi memberi harapan nyata. Setiap orang bisa membantu: kurangi plastik sekali pakai dan pilih wisata bahari yang bertanggung jawab.$$))
ON CONFLICT (id) DO NOTHING;
END $do$;

-- ============ 5. SCH-SMP-BIO2-001 ============
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, status, created_by, updated_by)
VALUES (gen_random_uuid(), 'SCH-SMP-BIO2-001', 'd4444444-4444-4444-4444-444444444444',
'IPA Kelas 9: Sistem Reproduksi pada Tumbuhan', 'ipa-kelas-9-sistem-reproduksi-tumbuhan',
'Materi IPA kelas 9: reproduksi generatif dan vegetatif pada tumbuhan beserta contohnya.',
'id', 9, 'DRAFT', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;

DO $do$
DECLARE art_id uuid;
BEGIN
SELECT id INTO art_id FROM madevi.articles WHERE business_code = 'SCH-SMP-BIO2-001';
IF art_id IS NULL THEN RETURN; END IF;
INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
(gen_random_uuid(), art_id, 'HEADING', 1, jsonb_build_object('text', $$Tujuan Pembelajaran$$)),
(gen_random_uuid(), art_id, 'PARAGRAPH', 2, jsonb_build_object('text', $$Setelah mempelajari materi ini, kamu diharapkan mampu: (1) membedakan reproduksi generatif dan vegetatif pada tumbuhan, (2) menjelaskan bagian-bagian bunga dan fungsinya, (3) menyebutkan contoh tumbuhan yang berkembang biak secara vegetatif alami dan buatan.$$)),
(gen_random_uuid(), art_id, 'HEADING', 3, jsonb_build_object('text', $$Reproduksi Generatif: Melalui Bunga$$)),
(gen_random_uuid(), art_id, 'PARAGRAPH', 4, jsonb_build_object('text', $$Reproduksi generatif melibatkan peleburan sel kelamin jantan (serbuk sari) dan betina (sel telur). Bagian bunga: benang sari (jantan, menghasilkan serbuk sari), putik (betina, berisi bakal biji), mahkota (menarik serangga), dan kelopak (pelindung kuncup). Penyerbukan bisa dibantu angin, air, serangga, atau manusia.$$)),
(gen_random_uuid(), art_id, 'HEADING', 5, jsonb_build_object('text', $$Pembuahan Ganda pada Angiospermae$$)),
(gen_random_uuid(), art_id, 'PARAGRAPH', 6, jsonb_build_object('text', $$Ciri khas tumbuhan berbunga: pembuahan ganda. Satu inti sperma membuahi sel telur menjadi zigot (calon tumbuhan baru), inti sperma kedua membuahi inti kandung lembaga sekunder menjadi endosperma (cadangan makanan biji). Inilah mengapa biji tumbuhan berbunga bergizi.$$)),
(gen_random_uuid(), art_id, 'HEADING', 7, jsonb_build_object('text', $$Reproduksi Vegetatif Alami$$)),
(gen_random_uuid(), art_id, 'LIST', 8, jsonb_build_object('items', ARRAY[$$Umbi batang: kentang (mata tunas)$$, $$Umbi lapis: bawang merah$$, $$Rhizoma: jahe, kunyit$$, $$Stolon/geragih: stroberi$$, $$Tunas adventif: cocor bebek (tunas di tepi daun)$$])),
(gen_random_uuid(), art_id, 'HEADING', 9, jsonb_build_object('text', $$Reproduksi Vegetatif Buatan$$)),
(gen_random_uuid(), art_id, 'LIST', 10, jsonb_build_object('items', ARRAY[$$Stek: potongan batang ditanam (singkong, mawar)$$, $$Cangkok: cabang dikuliti lalu dibungkus tanah (mangga, rambutan)$$, $$Okulasi: menempelkan mata tunas unggul ke batang bawah$$, $$Kultur jaringan: menumbuhkan tanaman dari sel di laboratorium$$])),
(gen_random_uuid(), art_id, 'HEADING', 11, jsonb_build_object('text', $$Latihan Soal$$)),
(gen_random_uuid(), art_id, 'LIST', 12, jsonb_build_object('items', ARRAY[$$1. Sebutkan perbedaan reproduksi generatif dan vegetatif! Kunci: generatif melibatkan peleburan gamet dan menghasilkan biji dengan sifat campuran induk; vegetatif tanpa gamet, keturunan identik dengan induk.$$ , $$2. Bagian bunga manakah yang berfungsi sebagai alat kelamin jantan dan betina? Kunci: jantan = benang sari, betina = putik.$$ , $$3. Berikan 2 contoh vegetatif buatan beserta tanamannya! Kunci: stek (singkong/mawar), cangkok (mangga/rambutan).$$]))
ON CONFLICT (id) DO NOTHING;
END $do$;

-- ============ 6. SCH-SD-MAT5-001 ============
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, status, created_by, updated_by)
VALUES (gen_random_uuid(), 'SCH-SD-MAT5-001', 'd3333333-3333-3333-3333-333333333333',
'Matematika Kelas 6: Volume Bangun Ruang', 'matematika-kelas-6-volume-bangun-ruang',
'Materi matematika kelas 6 SD: menghitung volume kubus, balok, prisma, tabung, dan kerucut.',
'id', 9, 'DRAFT', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;

DO $do$
DECLARE art_id uuid;
BEGIN
SELECT id INTO art_id FROM madevi.articles WHERE business_code = 'SCH-SD-MAT5-001';
IF art_id IS NULL THEN RETURN; END IF;
INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
(gen_random_uuid(), art_id, 'HEADING', 1, jsonb_build_object('text', $$Tujuan Pembelajaran$$)),
(gen_random_uuid(), art_id, 'PARAGRAPH', 2, jsonb_build_object('text', $$Setelah mempelajari materi ini, kamu diharapkan mampu: (1) menyebutkan rumus volume kubus, balok, prisma segitiga, tabung, dan kerucut, (2) menghitung volume bangun ruang dengan benar, (3) menyelesaikan soal cerita tentang volume dalam kehidupan sehari-hari.$$)),
(gen_random_uuid(), art_id, 'HEADING', 3, jsonb_build_object('text', $$Volume Kubus dan Balok$$)),
(gen_random_uuid(), art_id, 'PARAGRAPH', 4, jsonb_build_object('text', $$Kubus: V = s × s × s (s = panjang rusuk). Contoh: kubus dengan rusuk 5 cm → V = 5 × 5 × 5 = 125 cm³. Balok: V = p × l × t. Contoh: balok 8 cm × 5 cm × 4 cm → V = 8 × 5 × 4 = 160 cm³. Ingat: satuan volume selalu pangkat tiga (cm³, m³, liter).$$)),
(gen_random_uuid(), art_id, 'HEADING', 5, jsonb_build_object('text', $$Volume Prisma Segitiga$$)),
(gen_random_uuid(), art_id, 'PARAGRAPH', 6, jsonb_build_object('text', $$V = luas alas × tinggi prisma. Karena alasnya segitiga: V = (½ × a × t_alas) × t_prisma. Contoh: alas segitiga a = 6 cm, t_alas = 4 cm, tinggi prisma 10 cm → V = (½ × 6 × 4) × 10 = 12 × 10 = 120 cm³.$$)),
(gen_random_uuid(), art_id, 'HEADING', 7, jsonb_build_object('text', $$Volume Tabung$$)),
(gen_random_uuid(), art_id, 'PARAGRAPH', 8, jsonb_build_object('text', $$V = π × r² × t. Gunakan π = 22/7 jika r kelipatan 7, atau π = 3,14 jika tidak. Contoh: tabung r = 7 cm, t = 10 cm → V = 22/7 × 7 × 7 × 10 = 22 × 70 = 1.540 cm³. Contoh: r = 5 cm, t = 12 cm → V = 3,14 × 25 × 12 = 942 cm³.$$)),
(gen_random_uuid(), art_id, 'HEADING', 9, jsonb_build_object('text', $$Volume Kerucut$$)),
(gen_random_uuid(), art_id, 'PARAGRAPH', 10, jsonb_build_object('text', $$V = ⅓ × π × r² × t — sepertiga volume tabung dengan alas dan tinggi yang sama. Contoh: kerucut r = 6 cm, t = 9 cm → V = ⅓ × 3,14 × 36 × 9 = 3,14 × 108 = 339,12 cm³. Trik hafalan: kerucut itu tabung yang dibagi tiga!$$)),
(gen_random_uuid(), art_id, 'HEADING', 11, jsonb_build_object('text', $$Latihan Soal$$)),
(gen_random_uuid(), art_id, 'LIST', 12, jsonb_build_object('items', ARRAY[$$1. Sebuah akuarium berbentuk balok berukuran 60 cm × 40 cm × 50 cm. Berapa liter air yang dibutuhkan untuk mengisinya penuh? Kunci: V = 60 × 40 × 50 = 120.000 cm³ = 120 liter (1 liter = 1.000 cm³).$$, $$2. Tabung dengan jari-jari 7 cm dan tinggi 20 cm. Hitung volumenya! Kunci: V = 22/7 × 7 × 7 × 20 = 3.080 cm³.$$, $$3. Sebuah tenda berbentuk prisma segitiga dengan alas 4 m, tinggi alas 3 m, dan panjang tenda 6 m. Berapa volume udara di dalam tenda? Kunci: V = (½ × 4 × 3) × 6 = 6 × 6 = 36 m³.$$]))
ON CONFLICT (id) DO NOTHING;
END $do$;
