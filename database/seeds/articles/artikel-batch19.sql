-- Artikel konten batch 19 Madevi — 2026-10-13
-- Owner principal: f7125028-187e-44e0-b95b-88b69b8d5c9a
-- Semua: status='DRAFT', language='id'. Block via jsonb_build_object (JSON dijamin valid).

-- ============ 1. TUT-OLAHRAGA-001: Lari untuk Pemula ============
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, status, created_by, updated_by)
VALUES ('11111119-1111-4111-8111-111111111111', 'TUT-OLAHRAGA-001', 'b5555555-5555-5555-5555-555555555555',
'Lari untuk Pemula: Dari 0 ke 5K dalam 8 Minggu', 'lari-untuk-pemula-dari-0-ke-5k',
'Program latihan lari bertahap untuk pemula: dari jalan kaki sampai mampu lari 5 kilometer tanpa berhenti.',
'id', 10, 'DRAFT', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (id) DO NOTHING;

INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
(gen_random_uuid(), '11111119-1111-4111-8111-111111111111', 'HEADING', 1, jsonb_build_object('text', $$Masalah: Ingin Mulai Lari tapi Tidak Kuat$$)),
(gen_random_uuid(), '11111119-1111-4111-8111-111111111111', 'PARAGRAPH', 2, jsonb_build_object('text', $$Banyak orang ingin mulai lari tapi menyerah di minggu pertama: napas ngos-ngosan setelah 2 menit, kaki pegal berhari-hari, dan lutut sakit. Masalahnya bukan karena Anda tidak berbakat — melainkan karena mulai terlalu cepat.$$)),
(gen_random_uuid(), '11111119-1111-4111-8111-111111111111', 'HEADING', 3, jsonb_build_object('text', $$Penjelasan: Prinsip Adaptasi Bertahap$$)),
(gen_random_uuid(), '11111119-1111-4111-8111-111111111111', 'PARAGRAPH', 4, jsonb_build_object('text', $$Tubuh butuh waktu beradaptasi. Jantung, paru-paru, otot, dan tulang menguat lewat beban yang naik perlahan. Aturan emas pelari: naikkan total jarak mingguan maksimal 10% per minggu. Metode lari-jalan (run-walk) adalah cara paling aman untuk pemula.$$)),
(gen_random_uuid(), '11111119-1111-4111-8111-111111111111', 'HEADING', 5, jsonb_build_object('text', $$Alat yang Dibutuhkan$$)),
(gen_random_uuid(), '11111119-1111-4111-8111-111111111111', 'LIST', 6, jsonb_build_object('items', ARRAY[$$Sepatu lari yang pas (bukan sepatu skate atau futsal)$$, $$Pakaian olahraga yang menyerap keringat$$, $$Aplikasi pencatat lari di HP (opsional)$$, $$Botol air minum$$])),
(gen_random_uuid(), '11111119-1111-4111-8111-111111111111', 'HEADING', 7, jsonb_build_object('text', $$Program 8 Minggu: Dari 0 ke 5K$$)),
(gen_random_uuid(), '11111119-1111-4111-8111-111111111111', 'LIST', 8, jsonb_build_object('items', ARRAY[$$Minggu 1-2: jalan cepat 5 menit pemanasan, lalu ulangi 8x (lari 1 menit + jalan 2 menit), pendinginan 5 menit. 3x seminggu.$$ , $$Minggu 3-4: lari 2 menit + jalan 1 menit, ulangi 8x. Mulai terasa napas lebih stabil.$$ , $$Minggu 5-6: lari 5 menit + jalan 1 menit, ulangi 5x. Total lari ±25 menit.$$ , $$Minggu 7: lari 10 menit + jalan 1 menit, ulangi 3x. Target 3,5 km.$$ , $$Minggu 8: lari 5 km penuh tanpa berhenti! Rata-rata pemula selesai dalam 35-45 menit.$$])),
(gen_random_uuid(), '11111119-1111-4111-8111-111111111111', 'HEADING', 9, jsonb_build_object('text', $$Teknik Dasar yang Benar$$)),
(gen_random_uuid(), '11111119-1111-4111-8111-111111111111', 'PARAGRAPH', 10, jsonb_build_object('text', $$Jaga postur tegak, pandangan ke depan, bahu rileks. Mendarat dengan telapak tengah kaki (bukan tumit menghentak). Bernapaslah dengan ritme: tarik napas 3 langkah, buang napas 2 langkah. Kecepatan harus cukup pelan sampai Anda masih bisa bicara (uji bicara).$$)),
(gen_random_uuid(), '11111119-1111-4111-8111-111111111111', 'HEADING', 11, jsonb_build_object('text', $$Risiko dan Pencegahan Cedera$$)),
(gen_random_uuid(), '11111119-1111-4111-8111-111111111111', 'PARAGRAPH', 12, jsonb_build_object('text', $$Jangan lari saat lutut atau pergelangan kaki sakit tajam — istirahat 2-3 hari. Selalu pemanasan 5 menit dan pendinginan. Jika punya riwayat penyakit jantung atau asma, konsultasi dokter dulu sebelum mulai. Sepatu yang salah adalah penyebab cedera nomor satu pada pemula.$$))
ON CONFLICT (id) DO NOTHING;

-- ============ 2. TUT-MUSIK-001: Belajar Gitar dari Nol ============
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, status, created_by, updated_by)
VALUES ('22222229-2222-4222-8222-222222222222', 'TUT-MUSIK-001', 'b6666666-6666-6666-6666-666666666666',
'Belajar Gitar dari Nol: 30 Hari Bisa Main Lagu', 'belajar-gitar-dari-nol-30-hari-bisa',
'Panduan belajar gitar akustik untuk pemula total: dari stem gitar, kunci dasar, sampai memainkan lagu pertama dalam 30 hari.',
'id', 11, 'DRAFT', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (id) DO NOTHING;

INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
(gen_random_uuid(), '22222229-2222-4222-8222-222222222222', 'HEADING', 1, jsonb_build_object('text', $$Masalah: Gitar Nganggur di Pojokan$$)),
(gen_random_uuid(), '22222229-2222-4222-8222-222222222222', 'PARAGRAPH', 2, jsonb_build_object('text', $$Punya gitar tapi jari sakit saat menekan senar, bunyi fals, dan tidak tahu harus mulai dari mana. Akhirnya gitar jadi pajangan. Kabar baik: jari sakit itu normal dan hilang dalam 2 minggu jika latihan rutin.$$)),
(gen_random_uuid(), '22222229-2222-4222-8222-222222222222', 'HEADING', 3, jsonb_build_object('text', $$Penjelasan: Anatomi Gitar Akustik$$)),
(gen_random_uuid(), '22222229-2222-4222-8222-222222222222', 'PARAGRAPH', 4, jsonb_build_object('text', $$Gitar standar punya 6 senar bernomor 1 (paling bawah/tipis, nada E tinggi) sampai 6 (paling atas/tebal, nada E rendah). Leher gitar dibagi fret (kolom). Kunci (chord) adalah kombinasi jari yang menekan beberapa senar sekaligus sehingga berbunyi harmonis.$$)),
(gen_random_uuid(), '22222229-2222-4222-8222-222222222222', 'HEADING', 5, jsonb_build_object('text', $$Alat yang Dibutuhkan$$)),
(gen_random_uuid(), '22222229-2222-4222-8222-222222222222', 'LIST', 6, jsonb_build_object('items', ARRAY[$$Gitar akustik (senar nilon lebih ramah jari pemula)$$, $$Tuner (aplikasi HP gratis, mis. untuk stem senar)$$, $$Pick/plektrum (opsional)$$, $$Kapodaster/capo (opsional, untuk minggu ke-3)$$])),
(gen_random_uuid(), '22222229-2222-4222-8222-222222222222', 'HEADING', 7, jsonb_build_object('text', $$Langkah 30 Hari$$)),
(gen_random_uuid(), '22222229-2222-4222-8222-222222222222', 'LIST', 8, jsonb_build_object('items', ARRAY[$$Hari 1-3: stem gitar (E-A-D-G-B-E), latihan petik tiap senar, biasakan posisi duduk.$$ , $$Hari 4-10: kunci Em dan Am. Latihan pindah Em-Am-Em-Am sampai lancar, 15 menit/hari.$$ , $$Hari 11-17: tambah kunci C, G, D. Latihan strumming pola bawah-atas dengan metronom lambat.$$ , $$Hari 18-24: gabungkan 4 kunci dalam progresi G-Em-C-D. Mainkan lagu sederhana (mis. "Oasis - Wonderwall" versi mudah).$$ , $$Hari 25-30: mainkan 1 lagu penuh dari awal sampai akhir. Rekam dan dengarkan sendiri untuk evaluasi.$$])),
(gen_random_uuid(), '22222229-2222-4222-8222-222222222222', 'HEADING', 9, jsonb_build_object('text', $$Diagram Kunci Dasar$$)),
(gen_random_uuid(), '22222229-2222-4222-8222-222222222222', 'PARAGRAPH', 10, jsonb_build_object('text', $$Em: jari tengah fret 2 senar 5, jari manis fret 2 senar 4. Am: jari telunjuk fret 1 senar 2, jari tengah fret 2 senar 4, jari manis fret 2 senar 3. C: jari manis fret 3 senar 5, jari tengah fret 2 senar 4, jari telunjuk fret 1 senar 2. G: jari tengah fret 3 senar 6, jari telunjuk fret 2 senar 5, jari manis fret 3 senar 1.$$)),
(gen_random_uuid(), '22222229-2222-4222-8222-222222222222', 'HEADING', 11, jsonb_build_object('text', $$Risiko dan Kesalahan Umum$$)),
(gen_random_uuid(), '22222229-2222-4222-8222-222222222222', 'PARAGRAPH', 12, jsonb_build_object('text', $$Jangan latihan lebih dari 30 menit/hari di minggu pertama — jari bisa lecet dan kapalan berlebihan. Jangan menekan senar terlalu keras; cukup sampai bunyi bersih. Hindari belajar kunci F (barre chord) di bulan pertama karena paling sulit dan bikin frustrasi.$$))
ON CONFLICT (id) DO NOTHING;

-- ============ 3. EXP-FISIKA3-001: Relativitas Einstein ============
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, status, created_by, updated_by)
VALUES ('33333339-3333-4333-8333-333333333333', 'EXP-FISIKA3-001', 'c3333333-3333-3333-3333-333333333333',
'Relativitas Einstein: Mengapa Waktu Itu Relatif', 'relativitas-einstein-waktu-itu-relatif',
'Penjelasan teori relativitas khusus dan umum Einstein dengan bahasa sederhana: dilatasi waktu, kontraksi panjang, dan E=mc².',
'id', 8, 'DRAFT', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (id) DO NOTHING;

INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
(gen_random_uuid(), '33333339-3333-4333-8333-333333333333', 'HEADING', 1, jsonb_build_object('text', $$Tahun Ajaib 1905$$)),
(gen_random_uuid(), '33333339-3333-4333-8333-333333333333', 'PARAGRAPH', 2, jsonb_build_object('text', $$Pada 1905, Albert Einstein — pegawai kantor paten berusia 26 tahun — menerbitkan empat makalah yang mengubah fisika selamanya. Salah satunya adalah teori relativitas khusus, yang menyatakan bahwa waktu dan ruang tidak mutlak, melainkan relatif terhadap pengamat.$$)),
(gen_random_uuid(), '33333339-3333-4333-8333-333333333333', 'HEADING', 3, jsonb_build_object('text', $$Postulat 1: Hukum Fisika Sama di Mana Saja$$)),
(gen_random_uuid(), '33333339-3333-4333-8333-333333333333', 'PARAGRAPH', 4, jsonb_build_object('text', $$Tidak ada kerangka acuan yang istimewa. Eksperimen fisika di kereta yang melaju konstan memberi hasil sama seperti di laboratorium diam. Ini memperluas prinsip relativitas Galileo ke seluruh fisika, termasuk elektromagnetisme.$$)),
(gen_random_uuid(), '33333339-3333-4333-8333-333333333333', 'HEADING', 5, jsonb_build_object('text', $$Postulat 2: Kecepatan Cahaya Itu Mutlak$$)),
(gen_random_uuid(), '33333339-3333-4333-8333-333333333333', 'PARAGRAPH', 6, jsonb_build_object('text', $$Laju cahaya di vakum (c = 299.792.458 m/s) sama untuk semua pengamat, seberapa pun cepat mereka bergerak. Ini aneh: jika Anda berlari 100 km/jam mengejar cahaya, cahaya tetap menjauhi Anda dengan kecepatan c, bukan c minus 100 km/jam. Agar ini konsisten, ruang dan waktu sendiri harus "melentur".$$)),
(gen_random_uuid(), '33333339-3333-4333-8333-333333333333', 'HEADING', 7, jsonb_build_object('text', $$Dilatasi Waktu: Jam Bergerak Berdetak Lebih Lambat$$)),
(gen_random_uuid(), '33333339-3333-4333-8333-333333333333', 'PARAGRAPH', 8, jsonb_build_object('text', $$Rumusnya: t' = t / √(1 − v²/c²). Astronot yang melaju 90% kecepatan cahaya menua lebih lambat dibanding orang di Bumi — ini disebut paradoks kembar. Efeknya nyata dan terukur: jam atom di satelit GPS harus dikoreksi setiap hari karena berdetak lebih cepat di orbit (kombinasi relativitas khusus dan umum).$$)),
(gen_random_uuid(), '33333339-3333-4333-8333-333333333333', 'HEADING', 9, jsonb_build_object('text', $$E = mc² dan Relativitas Umum$$)),
(gen_random_uuid(), '33333339-3333-4333-8333-333333333333', 'PARAGRAPH', 10, jsonb_build_object('text', $$Persamaan paling terkenal di dunia: massa adalah bentuk energi yang terkonsentrasi. Inilah prinsip di balik energi nuklir dan mengapa Matahari bersinar. Sepuluh tahun kemudian (1915), Einstein melahirkan relativitas umum: gravitasi bukanlah gaya, melainkan kelengkungan ruang-waktu oleh massa. Terbukti saat gerhana 1919 — cahaya bintang melengkung melewati Matahari persis seperti diprediksi.$$))
ON CONFLICT (id) DO NOTHING;

-- ============ 4. EXP-BOTANI-001: Tumbuhan Karnivora ============
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, status, created_by, updated_by)
VALUES ('44444449-4444-4434-8444-444444444444', 'EXP-BOTANI-001', 'caaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
'Tumbuhan Karnivora: Pemburu Serangga dari Dunia Tumbuhan', 'tumbuhan-karnivora-pemburu-serangga',
'Mengenal tumbuhan pemakan serangga: kantong semar, venus flytrap, sundew, dan strategi berburu mereka yang menakjubkan.',
'id', 7, 'DRAFT', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (id) DO NOTHING;

INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
(gen_random_uuid(), '44444449-4444-4434-8444-444444444444', 'HEADING', 1, jsonb_build_object('text', $$Mengapa Ada Tumbuhan Pemakan Daging?$$)),
(gen_random_uuid(), '44444449-4444-4434-8444-444444444444', 'PARAGRAPH', 2, jsonb_build_object('text', $$Tumbuhan karnivora hidup di tanah miskin nitrogen — misalnya rawa gambut dan tebing kapur. Karena akarnya tak cukup menyerap nitrogen dari tanah, mereka berevolusi "berburu": menangkap serangga lalu mencernanya untuk mendapatkan nitrogen dan fosfor. Fotosintesis tetap berjalan; serangga hanyalah suplemen nutrisi.$$)),
(gen_random_uuid(), '44444449-4444-4434-8444-444444444444', 'HEADING', 3, jsonb_build_object('text', $$Kantong Semar (Nepenthes): Jebakan Pasif$$)),
(gen_random_uuid(), '44444449-4444-4434-8444-444444444444', 'PARAGRAPH', 4, jsonb_build_object('text', $$Daunnya berubah menjadi kantong berisi cairan pencerna. Bibir kantong mengeluarkan nektar manis; serangga yang terpeleset jatuh ke dalam dan tenggelam. Dinding dalam yang licin mencegahnya memanjat keluar. Indonesia adalah pusat keanekaragaman kantong semar dunia — lebih dari 60 spesies, terbanyak di Kalimantan dan Sumatra.$$)),
(gen_random_uuid(), '44444449-4444-4434-8444-444444444444', 'HEADING', 5, jsonb_build_object('text', $$Venus Flytrap: Jebakan Aktif Tercepat$$)),
(gen_random_uuid(), '44444449-4444-4434-8444-444444444444', 'PARAGRAPH', 6, jsonb_build_object('text', $$Dionaea muscipula menutup dua daunnya dalam 0,1 detik saat rambut pemicu disentuh dua kali dalam 20 detik — mekanisme cerdas agar tidak menutup sia-sia karena tetesan hujan. Setelah menutup, ia mengeluarkan enzim dan mencerna mangsa selama 1-2 minggu, lalu membuka kembali menyisakan kerangka serangga.$$)),
(gen_random_uuid(), '44444449-4444-4434-8444-444444444444', 'HEADING', 7, jsonb_build_object('text', $$Sundew dan Butterwort: Jebakan Lengket$$)),
(gen_random_uuid(), '44444449-4444-4434-8444-444444444444', 'PARAGRAPH', 8, jsonb_build_object('text', $$Drosera (embun matahari) memiliki tentakel berlendir yang berkilau seperti embun pagi. Serangga yang menempel akan dililit tentakel lain yang melengkung ke arahnya. Pinguicula (butterwort) memakai daun lengket seperti kertas lalat — sederhana tapi efektif.$$)),
(gen_random_uuid(), '44444449-4444-4434-8444-444444444444', 'HEADING', 9, jsonb_build_object('text', $$Bladderwort: Jebakan Vakum Terkecil$$)),
(gen_random_uuid(), '44444449-4444-4434-8444-444444444444', 'PARAGRAPH', 10, jsonb_build_object('text', $$Utricularia hidup di air dan punya kantong mikroskopis bertekanan negatif. Saat mangsa kecil menyentuh rambut pemicu, katup terbuka dan air tersedot masuk dalam 0,01 detik — salah satu gerakan tercepat di dunia tumbuhan. Satu tanaman bisa punya ratusan perangkap mungil ini.$$))
ON CONFLICT (id) DO NOTHING;

-- ============ 5. SCH-SMA-BIN-001: Teks Argumentasi Kelas 11 ============
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, status, created_by, updated_by)
VALUES ('55555559-5555-4555-8555-555555555555', 'SCH-SMA-BIN-001', 'd5555555-5555-5555-5555-555555555555',
'Bahasa Indonesia Kelas 11: Menulis Teks Argumentasi yang Meyakinkan', 'bahasa-indonesia-kelas-11-teks-argumentasi',
'Materi teks argumentasi: struktur, kaidah kebahasaan, jenis argumen, contoh, dan latihan soal beserta kunci jawaban.',
'id', 9, 'DRAFT', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (id) DO NOTHING;

INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
(gen_random_uuid(), '55555559-5555-4555-8555-555555555555', 'HEADING', 1, jsonb_build_object('text', $$Tujuan Pembelajaran$$)),
(gen_random_uuid(), '55555559-5555-4555-8555-555555555555', 'PARAGRAPH', 2, jsonb_build_object('text', $$Setelah mempelajari materi ini, kamu diharapkan mampu: (1) mengidentifikasi struktur teks argumentasi, (2) menganalisis kaidah kebahasaan yang digunakan, (3) menulis teks argumentasi dengan argumen yang logis dan bukti yang kuat.$$)),
(gen_random_uuid(), '55555559-5555-4555-8555-555555555555', 'HEADING', 3, jsonb_build_object('text', $$Pengertian Teks Argumentasi$$)),
(gen_random_uuid(), '55555559-5555-4555-8555-555555555555', 'PARAGRAPH', 4, jsonb_build_object('text', $$Teks argumentasi adalah teks yang bertujuan meyakinkan pembaca tentang suatu pendapat (tesis) dengan menyajikan alasan-alasan logis dan bukti yang dapat dipertanggungjawabkan. Berbeda dengan persuasi yang mengandalkan emosi, argumentasi bertumpu pada logika.$$)),
(gen_random_uuid(), '55555559-5555-4555-8555-555555555555', 'HEADING', 5, jsonb_build_object('text', $$Struktur Teks Argumentasi$$)),
(gen_random_uuid(), '55555559-5555-4555-8555-555555555555', 'LIST', 6, jsonb_build_object('items', ARRAY[$$Pendahuluan: latar belakang isu dan tesis (pendapat penulis).$$, $$Tubuh argumen: 2-3 argumen pendukung, masing-masing disertai bukti (data, fakta, contoh, hasil penelitian).$$, $$Kontra-argumen (opsional): pendapat lawan yang kemudian dibantah untuk memperkuat posisi penulis.$$ , $$Simpulan: penegasan kembali tesis dengan bahasa yang berbeda.$$])),
(gen_random_uuid(), '55555559-5555-4555-8555-555555555555', 'HEADING', 7, jsonb_build_object('text', $$Jenis-Jenis Argumen$$)),
(gen_random_uuid(), '55555559-5555-4555-8555-555555555555', 'PARAGRAPH', 8, jsonb_build_object('text', $$Ada tiga pola penalaran utama. Argumen sebab-akibat: "Penggunaan gawai berlebihan menyebabkan menurunnya interaksi sosial karena..." Argumen perbandingan: "Dibanding belajar kelompok, belajar mandiri lebih efektif untuk..." Argumen generalisasi: mengambil kesimpulan umum dari beberapa contoh khusus yang representatif.$$)),
(gen_random_uuid(), '55555559-5555-4555-8555-555555555555', 'HEADING', 9, jsonb_build_object('text', $$Contoh Paragraf Argumentasi$$)),
(gen_random_uuid(), '55555559-5555-4555-8555-555555555555', 'PARAGRAPH', 10, jsonb_build_object('text', $$"Transportasi umum harus menjadi prioritas pembangunan kota. Data Dinas Perhubungan (2024) menunjukkan 70% kemacetan disebabkan kendaraan pribadi. Kota-kota yang berinvestasi pada MRT seperti Jakarta mengalami penurunan waktu tempuh rata-rata 25%. Dengan demikian, alokasi anggaran untuk transportasi umum bukan sekadar pilihan, melainkan kebutuhan mendesak."$$)),
(gen_random_uuid(), '55555559-5555-4555-8555-555555555555', 'HEADING', 11, jsonb_build_object('text', $$Latihan Soal$$)),
(gen_random_uuid(), '55555559-5555-4555-8555-555555555555', 'LIST', 12, jsonb_build_object('items', ARRAY[$$1. Sebutkan 3 perbedaan teks argumentasi dan teks persuasi!$$, $$2. Identifikasi tesis dan argumen pada paragraf contoh di atas!$$, $$3. Tulislah satu paragraf argumentasi (5-7 kalimat) dengan tema "pentingnya literasi digital"!$$, $$KUNCI: 1. Argumentasi bertumpu pada logika/bukti, persuasi pada emosi; argumentasi menyajikan data, persuasi ajakan; argumentasi bisa memuat kontra-argumen. 2. Tesis: transportasi umum harus jadi prioritas. Argumen: 70% kemacetan dari kendaraan pribadi; MRT menurunkan waktu tempuh 25%. 3. Dinilai dari: kejelasan tesis, minimal 2 argumen logis, ada bukti pendukung, struktur runtut.$$]))
ON CONFLICT (id) DO NOTHING;

-- ============ 6. SCH-SMP-IPA2-001: Listrik Statis dan Dinamis ============
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, status, created_by, updated_by)
VALUES ('66666669-6666-4666-8666-666666666666', 'SCH-SMP-IPA2-001', 'd4444444-4444-4444-4444-444444444444',
'IPA Kelas 9: Listrik Statis dan Listrik Dinamis', 'ipa-kelas-9-listrik-statis-dan-dinamis',
'Materi listrik statis dan dinamis: muatan listrik, hukum Coulomb, arus, tegangan, hambatan, hukum Ohm, dan rangkaian.',
'id', 10, 'DRAFT', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (id) DO NOTHING;

INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
(gen_random_uuid(), '66666669-6666-4666-8666-666666666666', 'HEADING', 1, jsonb_build_object('text', $$Tujuan Pembelajaran$$)),
(gen_random_uuid(), '66666669-6666-4666-8666-666666666666', 'PARAGRAPH', 2, jsonb_build_object('text', $$Setelah mempelajari materi ini, kamu diharapkan mampu: (1) menjelaskan konsep muatan listrik dan hukum Coulomb, (2) membedakan listrik statis dan dinamis, (3) menghitung kuat arus, tegangan, dan hambatan dengan hukum Ohm, (4) menganalisis rangkaian seri dan paralel.$$)),
(gen_random_uuid(), '66666669-6666-4666-8666-666666666666', 'HEADING', 3, jsonb_build_object('text', $$Listrik Statis: Muatan yang Diam$$)),
(gen_random_uuid(), '66666669-6666-4666-8666-666666666666', 'PARAGRAPH', 4, jsonb_build_object('text', $$Semua benda tersusun dari atom yang punya proton (+) dan elektron (−). Menggosok balon ke rambut memindahkan elektron ke balon — balon bermuatan negatif dan bisa menempel di dinding. Muatan sejenis tolak-menolak, muatan berbeda tarik-menarik. Besar gaya antar dua muatan dirumuskan hukum Coulomb: F = k·q₁·q₂/r², dengan k = 9×10⁹ N·m²/C².$$)),
(gen_random_uuid(), '66666669-6666-4666-8666-666666666666', 'HEADING', 5, jsonb_build_object('text', $$Listrik Dinamis: Muatan yang Mengalir$$)),
(gen_random_uuid(), '66666669-6666-4666-8666-666666666666', 'PARAGRAPH', 6, jsonb_build_object('text', $$Arus listrik (I) adalah aliran muatan per detik, satuannya ampere (A). Agar arus mengalir butuh beda potensial/tegangan (V, satuan volt) dan rangkaian tertutup. Hambatan (R, satuan ohm) menghambat aliran arus — misalnya filamen lampu yang mengubah energi listrik menjadi cahaya dan panas.$$)),
(gen_random_uuid(), '66666669-6666-4666-8666-666666666666', 'HEADING', 7, jsonb_build_object('text', $$Hukum Ohm$$)),
(gen_random_uuid(), '66666669-6666-4666-8666-666666666666', 'PARAGRAPH', 8, jsonb_build_object('text', $$V = I × R. Contoh: lampu dengan hambatan 10 Ω dipasang pada baterai 12 V, maka arusnya I = V/R = 12/10 = 1,2 A. Daya listriknya P = V × I = 12 × 1,2 = 14,4 watt. Tiga besaran ini saling terkait — jika dua diketahui, yang ketiga bisa dihitung.$$)),
(gen_random_uuid(), '66666669-6666-4666-8666-666666666666', 'HEADING', 9, jsonb_build_object('text', $$Rangkaian Seri vs Paralel$$)),
(gen_random_uuid(), '66666669-6666-4666-8666-666666666666', 'PARAGRAPH', 10, jsonb_build_object('text', $$Seri: komponen disusun berurutan, arus sama di semua titik, tegangan terbagi. Jika satu lampu mati, semua mati (seperti lampu hias pohon Natal model lama). Paralel: tiap komponen punya cabang sendiri, tegangan sama, arus terbagi. Lampu rumah dipasang paralel — satu mati, yang lain tetap menyala.$$)),
(gen_random_uuid(), '66666669-6666-4666-8666-666666666666', 'HEADING', 11, jsonb_build_object('text', $$Latihan Soal$$)),
(gen_random_uuid(), '66666669-6666-4666-8666-666666666666', 'LIST', 12, jsonb_build_object('items', ARRAY[$$1. Sebuah setrika memiliki hambatan 40 Ω dan dipasang pada tegangan 220 V. Hitung kuat arusnya!$$, $$2. Jelaskan mengapa burung bisa bertengger di kabel listrik tegangan tinggi tanpa tersetrum!$$, $$3. Dua lampu masing-masing 6 Ω dipasang seri pada baterai 12 V. Hitung hambatan total dan arus yang mengalir!$$, $$KUNCI: 1. I = V/R = 220/40 = 5,5 A. 2. Burung hanya menyentuh satu kabel sehingga tidak ada beda potensial di tubuhnya; arus butuh jalur masuk-keluar. 3. R total = 6+6 = 12 Ω; I = 12/12 = 1 A.$$]))
ON CONFLICT (id) DO NOTHING;
