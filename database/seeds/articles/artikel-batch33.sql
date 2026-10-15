-- Artikel konten Madevi batch 33 — 2026-10-13
-- Owner principal: f7125028-187e-44e0-b95b-88b69b8d5c9a

-- ============ 1. TUT-MUSIK2-001 ============
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, status, created_by, updated_by)
VALUES ('e3300001-0000-4000-8000-000000000001', 'TUT-MUSIK2-001', 'b6666666-6666-6666-6666-666666666666',
'Piano untuk Pemula: Akord Dasar',
'piano-untuk-pemula-akord-dasar',
'Panduan belajar piano dari nol: posisi duduk, membaca not balok sederhana, akord mayor-minor, dan latihan 15 menit sehari.',
'id', 7, 'DRAFT', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (id) DO NOTHING;

INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
(gen_random_uuid(), 'e3300001-0000-4000-8000-000000000001', 'HEADING', 1, jsonb_build_object('text', $$Masalah: Ingin Main Piano tapi Bingung Mulai dari Mana$$)),
(gen_random_uuid(), 'e3300001-0000-4000-8000-000000000001', 'PARAGRAPH', 2, jsonb_build_object('text', $$Banyak pemula menyerah karena langsung mencoba lagu sulit tanpa fondasi. Padahal kunci piano bisa dikuasai dengan urutan belajar yang benar: postur, nada dasar, lalu akord. Artikel ini menyusun jalur paling sederhana untuk pemula dewasa maupun anak.$$)),
(gen_random_uuid(), 'e3300001-0000-4000-8000-000000000001', 'HEADING', 3, jsonb_build_object('text', $$Penjelasan: Cara Kerja Nada dan Akord$$)),
(gen_random_uuid(), 'e3300001-0000-4000-8000-000000000001', 'PARAGRAPH', 4, jsonb_build_object('text', $$Piano memiliki 88 tuts yang tersusun dari oktaf berulang: C, D, E, F, G, A, B lalu kembali C. Akord adalah gabungan tiga nada atau lebih yang dibunyikan bersamaan. Akord C mayor misalnya terdiri dari C, E, dan G. Dengan 5–6 akord dasar (C, G, Am, F, D, Em) kamu sudah bisa mengiringi ratusan lagu populer.$$)),
(gen_random_uuid(), 'e3300001-0000-4000-8000-000000000001', 'HEADING', 5, jsonb_build_object('text', $$Alat yang Dibutuhkan$$)),
(gen_random_uuid(), 'e3300001-0000-4000-8000-000000000001', 'LIST', 6, jsonb_build_object('items', ARRAY[$$Keyboard elektrik minimal 61 tuts (lebih murah dari piano akustik untuk pemula)$$, $$Kursi atau bangku dengan tinggi yang membuat siku sejajar tuts$$, $$Metronome (bisa aplikasi gratis di HP)$$, $$Buku atau aplikasi latihan akord$$])),
(gen_random_uuid(), 'e3300001-0000-4000-8000-000000000001', 'HEADING', 7, jsonb_build_object('text', $$Langkah Belajar$$)),
(gen_random_uuid(), 'e3300001-0000-4000-8000-000000000001', 'LIST', 8, jsonb_build_object('items', ARRAY[$$1. Duduk tegak, kedua kaki menapak lantai, jari melengkung rileks seperti memegang bola$$, $$2. Kenali tuts C: cari pola dua tuts hitam berdekatan — tuts putih tepat di kiri pola itu adalah C$$, $$3. Latih skala C mayor (C-D-E-F-G-A-B-C) tangan kanan dengan tempo lambat$$, $$4. Pelajari akord C mayor: tekan C, E, G bersamaan (jari 1-3-5)$$, $$5. Tambah akord G (G-B-D) dan Am (A-C-E), latih perpindahan C → G → Am$$, $$6. Latih progresi C-G-Am-F dengan metronome kecepatan 60 BPM, naikkan bertahap$$, $$7. Coba mainkan lagu sederhana yang hanya memakai 3–4 akord$$])),
(gen_random_uuid(), 'e3300001-0000-4000-8000-000000000001', 'HEADING', 9, jsonb_build_object('text', $$Risiko$$)),
(gen_random_uuid(), 'e3300001-0000-4000-8000-000000000001', 'PARAGRAPH', 10, jsonb_build_object('text', $$Postur salah (bahu tegang, pergelangan ditekuk) bisa menyebabkan nyeri sendi bila dibiasakan. Jangan memaksakan latihan berjam-jam sekaligus — jari yang kelelahan justru menghafal gerakan yang salah. Latihan 15–20 menit fokus setiap hari jauh lebih efektif daripada 3 jam seminggu sekali.$$)),
(gen_random_uuid(), 'e3300001-0000-4000-8000-000000000001', 'HEADING', 11, jsonb_build_object('text', $$Penyelesaian$$)),
(gen_random_uuid(), 'e3300001-0000-4000-8000-000000000001', 'PARAGRAPH', 12, jsonb_build_object('text', $$Target realistis: dalam 30 hari konsisten kamu bisa memainkan 4–5 akord dasar dan mengiringi lagu sederhana. Setelah itu lanjutkan ke pola ritme tangan kanan, lagu dua tangan, dan teori dasar (interval, tangga nada minor). Konsistensi harian adalah penentu utama, bukan bakat bawaan.$$))
ON CONFLICT (id) DO NOTHING;

-- ============ 2. TUT-KESEHATAN3-001 ============
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, status, created_by, updated_by)
VALUES ('e3300002-0000-4000-8000-000000000002', 'TUT-KESEHATAN3-001', 'b5555555-5555-5555-5555-555555555555',
'Tidur Berkualitas: Atasi Insomnia',
'tidur-berkualitas-atasi-insomnia',
'Panduan umum memahami insomnia dan memperbaiki kualitas tidur: kebiasaan malam yang benar, kapan perlu waspada, dan kapan harus ke dokter.',
'id', 7, 'DRAFT', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (id) DO NOTHING;

INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
(gen_random_uuid(), 'e3300002-0000-4000-8000-000000000002', 'HEADING', 1, jsonb_build_object('text', $$Masalah: Sulit Tidur di Malam Hari$$)),
(gen_random_uuid(), 'e3300002-0000-4000-8000-000000000002', 'PARAGRAPH', 2, jsonb_build_object('text', $$Sudah berbaring berjam-jam tapi mata tetap terbuka, atau terbangun tengah malam lalu tidak bisa tidur lagi. Keesokan harinya badan lemas, sulit fokus, dan emosi mudah tersulut. Ini gambaran umum insomnia — gangguan tidur yang dialami banyak orang dewasa.$$)),
(gen_random_uuid(), 'e3300002-0000-4000-8000-000000000002', 'HEADING', 3, jsonb_build_object('text', $$Penjelasan: Mengapa Tidur Itu Penting$$)),
(gen_random_uuid(), 'e3300002-0000-4000-8000-000000000002', 'PARAGRAPH', 4, jsonb_build_object('text', $$Tidur bukan sekadar istirahat. Saat tidur nyenyak, otak mengonsolidasikan memori, tubuh memperbaiki jaringan, dan sistem imun bekerja. Orang dewasa umumnya butuh 7–9 jam tidur. Kurang tidur kronis dikaitkan dengan menurunnya daya tahan tubuh, gangguan konsentrasi, dan risiko masalah kesehatan jangka panjang.$$)),
(gen_random_uuid(), 'e3300002-0000-4000-8000-000000000002', 'HEADING', 5, jsonb_build_object('text', $$Penyebab Umum Sulit Tidur$$)),
(gen_random_uuid(), 'e3300002-0000-4000-8000-000000000002', 'LIST', 6, jsonb_build_object('items', ARRAY[$$Pikiran tidak berhenti: stres kerja, cemas, overthinking$$, $$Layar HP/laptop sebelum tidur (cahaya biru menekan hormon melatonin)$$, $$Kafein sore-malam: kopi, teh pekat, minuman energi$$, $$Jadwal tidur tidak teratur, termasuk begadang lalu tidur siang terlalu lama$$, $$Kondisi medis: nyeri kronis, asam lambung, sleep apnea$$])),
(gen_random_uuid(), 'e3300002-0000-4000-8000-000000000002', 'HEADING', 7, jsonb_build_object('text', $$Langkah Memperbaiki Tidur$$)),
(gen_random_uuid(), 'e3300002-0000-4000-8000-000000000002', 'LIST', 8, jsonb_build_object('items', ARRAY[$$1. Tetapkan jam tidur dan bangun yang sama setiap hari, termasuk akhir pekan$$, $$2. Matikan layar 30–60 menit sebelum tidur; ganti dengan baca buku atau peregangan ringan$$, $$3. Buat kamar gelap, sejuk, dan tenang$$, $$4. Batasi kafein setelah jam 2 siang dan hindari makan berat dekat waktu tidur$$, $$5. Olahraga rutin di pagi/siang hari, jangan olahraga berat 3 jam sebelum tidur$$, $$6. Tulis daftar kekhawatiran di kertas sebelum tidur agar pikiran tidak berputar$$, $$7. Bila 20 menit belum tertidur, bangun dan lakukan aktivitas tenang sampai mengantuk$$])),
(gen_random_uuid(), 'e3300002-0000-4000-8000-000000000002', 'HEADING', 9, jsonb_build_object('text', $$Risiko$$)),
(gen_random_uuid(), 'e3300002-0000-4000-8000-000000000002', 'PARAGRAPH', 10, jsonb_build_object('text', $$Jangan mengonsumsi obat tidur tanpa resep dokter — sebagian menimbulkan ketergantungan dan efek samping di pagi hari. Alkohol memang membuat mengantuk, tetapi merusak kualitas tidur dalam. Suplemen melatonin sebaiknya dikonsultasikan ke dokter, bukan diminum sembarangan.$$)),
(gen_random_uuid(), 'e3300002-0000-4000-8000-000000000002', 'HEADING', 11, jsonb_build_object('text', $$Kapan ke Dokter$$)),
(gen_random_uuid(), 'e3300002-0000-4000-8000-000000000002', 'PARAGRAPH', 12, jsonb_build_object('text', $$Konsultasi ke dokter bila sulit tidur berlangsung lebih dari 3 minggu, disertai dengkuran keras dan henti napas (gejala sleep apnea), atau mengganggu aktivitas harian secara signifikan. Artikel ini bersifat informasi umum dan BUKAN pengganti nasihat medis profesional.$$))
ON CONFLICT (id) DO NOTHING;

-- ============ 3. EXP-TEKNOLOGI4-001 ============
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, status, created_by, updated_by)
VALUES ('e3300003-0000-4000-8000-000000000003', 'EXP-TEKNOLOGI4-001', 'c5000004-0000-0000-0000-000000000004',
'AI Generatif: Cara Kerja Chatbot',
'ai-generatif-cara-kerja-chatbot',
'Menjelaskan cara kerja chatbot AI generatif: model bahasa, token, pelatihan data, hingga keterbatasan dan cara menggunakannya dengan bijak.',
'id', 7, 'DRAFT', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (id) DO NOTHING;

INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
(gen_random_uuid(), 'e3300003-0000-4000-8000-000000000003', 'HEADING', 1, jsonb_build_object('text', $$Apa Itu AI Generatif$$)),
(gen_random_uuid(), 'e3300003-0000-4000-8000-000000000003', 'PARAGRAPH', 2, jsonb_build_object('text', $$AI generatif adalah kecerdasan buatan yang bisa menghasilkan konten baru: teks, gambar, suara, bahkan video. Chatbot seperti yang kamu kenal adalah salah satu bentuknya — ia menerima pertanyaan dalam bahasa manusia dan menjawab dengan kalimat yang tersusun secara alami.$$)),
(gen_random_uuid(), 'e3300003-0000-4000-8000-000000000003', 'HEADING', 3, jsonb_build_object('text', $$Model Bahasa: Mesin Penebak Kata$$)),
(gen_random_uuid(), 'e3300003-0000-4000-8000-000000000003', 'PARAGRAPH', 4, jsonb_build_object('text', $$Di balik chatbot ada model bahasa besar (large language model). Cara kerjanya sederhana secara konsep: ia memecah teks menjadi potongan kecil bernama token, lalu menebak token berikutnya yang paling mungkin. Tebakan ini diulang ratusan kali hingga terbentuk kalimat utuh. Model dilatih dengan membaca miliaran halaman teks dari internet dan buku, sehingga ia belajar pola bahasa, fakta umum, dan gaya penulisan.$$)),
(gen_random_uuid(), 'e3300003-0000-4000-8000-000000000003', 'HEADING', 5, jsonb_build_object('text', $$Dari Pelatihan ke Percakapan$$)),
(gen_random_uuid(), 'e3300003-0000-4000-8000-000000000003', 'PARAGRAPH', 6, jsonb_build_object('text', $$Setelah belajar pola bahasa, model disempurnakan lewat umpan balik manusia: penilai menilai mana jawaban yang baik dan buruk, lalu model menyesuaikan diri. Hasilnya adalah chatbot yang bisa mengikuti instruksi, menolak permintaan berbahaya, dan menyesuaikan nada bicara. Proses ini disebut penyelarasan (alignment).$$)),
(gen_random_uuid(), 'e3300003-0000-4000-8000-000000000003', 'HEADING', 7, jsonb_build_object('text', $$Keterbatasan yang Perlu Diketahui$$)),
(gen_random_uuid(), 'e3300003-0000-4000-8000-000000000003', 'PARAGRAPH', 8, jsonb_build_object('text', $$Chatbot tidak memahami dunia seperti manusia — ia hanya sangat pandai merangkai kata. Karena itu ia bisa berhalusinasi: menjawab dengan percaya diri padahal salah. Pengetahuannya juga terbatas pada data pelatihannya, sehingga bisa ketinggalan peristiwa terbaru. Selalu verifikasi informasi penting dari sumber primer.$$)),
(gen_random_uuid(), 'e3300003-0000-4000-8000-000000000003', 'HEADING', 9, jsonb_build_object('text', $$Menggunakannya dengan Bijak$$)),
(gen_random_uuid(), 'e3300003-0000-4000-8000-000000000003', 'PARAGRAPH', 10, jsonb_build_object('text', $$AI generatif adalah alat bantu yang kuat untuk belajar, menulis draf, menerjemahkan, dan bertukar ide. Gunakan untuk mempercepat pekerjaan, bukan menggantikan pemahamanmu. Jangan memasukkan data pribadi atau rahasia ke chatbot publik, dan tetap berpikir kritis terhadap setiap jawabannya.$$))
ON CONFLICT (id) DO NOTHING;

-- ============ 4. EXP-GEOGRAFI2-001 ============
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, status, created_by, updated_by)
VALUES ('e3300004-0000-4000-8000-000000000004', 'EXP-GEOGRAFI2-001', 'c6000001-0000-0000-0000-000000000001',
'Samudra: 70 Persen Permukaan Bumi',
'samudra-70-persen-permukaan-bumi',
'Menjelajah lima samudra dunia: zona kedalaman, arus, kehidupan laut, dan peran samudra dalam mengatur iklim planet.',
'id', 7, 'DRAFT', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (id) DO NOTHING;

INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
(gen_random_uuid(), 'e3300004-0000-4000-8000-000000000004', 'HEADING', 1, jsonb_build_object('text', $$Planet Biru$$)),
(gen_random_uuid(), 'e3300004-0000-4000-8000-000000000004', 'PARAGRAPH', 2, jsonb_build_object('text', $$Sekitar 71 persen permukaan Bumi tertutup air, sebagian besar berupa samudra. Jika dilihat dari luar angkasa, planet kita tampak biru karena pantulan cahaya matahari oleh hamparan air ini. Samudra menyimpan sekitar 97 persen seluruh air di Bumi.$$)),
(gen_random_uuid(), 'e3300004-0000-4000-8000-000000000004', 'HEADING', 3, jsonb_build_object('text', $$Lima Samudra Dunia$$)),
(gen_random_uuid(), 'e3300004-0000-4000-8000-000000000004', 'PARAGRAPH', 4, jsonb_build_object('text', $$Samudra Pasifik adalah yang terbesar dan terdalam — luasnya melebihi seluruh daratan Bumi jika digabung. Samudra Atlantik memisahkan Amerika dari Eropa-Afrika. Samudra Hindia membasahi pesisir Indonesia. Samudra Arktik yang sebagian membeku mengelilingi Kutub Utara, dan Samudra Selatan mengelilingi Antarktika. Sebenarnya kelimanya saling terhubung menjadi satu samudra global.$$)),
(gen_random_uuid(), 'e3300004-0000-4000-8000-000000000004', 'HEADING', 5, jsonb_build_object('text', $$Zona Kedalaman$$)),
(gen_random_uuid(), 'e3300004-0000-4000-8000-000000000004', 'PARAGRAPH', 6, jsonb_build_object('text', $$Semakin dalam, cahaya matahari semakin hilang. Zona sinar matahari (0–200 meter) penuh kehidupan. Di bawahnya zona senja, lalu zona tengah malam yang gelap total, hingga zona hadal di palung-palung terdalam. Palung Mariana di Pasifik mencapai sekitar 11.000 meter — lebih dalam dari tinggi Gunung Everest.$$)),
(gen_random_uuid(), 'e3300004-0000-4000-8000-000000000004', 'HEADING', 7, jsonb_build_object('text', $$Arus dan Iklim$$)),
(gen_random_uuid(), 'e3300004-0000-4000-8000-000000000004', 'PARAGRAPH', 8, jsonb_build_object('text', $$Arus samudra bekerja seperti sabuk konveyor raksasa yang mengangkut panas ke seluruh planet, sehingga iklim di berbagai benua menjadi lebih seimbang. Samudra juga menyerap sebagian besar kelebihan panas dan karbon dioksida dari aktivitas manusia — peran yang membuatnya dijuluki paru-paru dan pendingin Bumi.$$)),
(gen_random_uuid(), 'e3300004-0000-4000-8000-000000000004', 'HEADING', 9, jsonb_build_object('text', $$Ancaman dan Harapan$$)),
(gen_random_uuid(), 'e3300004-0000-4000-8000-000000000004', 'PARAGRAPH', 10, jsonb_build_object('text', $$Samudra menghadapi sampah plastik, penangkapan ikan berlebih, dan pemanasan yang memutihkan terumbu karang. Namun kabar baiknya: kawasan konservasi laut terbukti memulihkan populasi ikan dalam beberapa tahun, dan teknologi pembersih samudra terus berkembang. Laut yang sehat dimulai dari pilihan kecil kita di darat.$$))
ON CONFLICT (id) DO NOTHING;

-- ============ 5. SCH-SMA-KIM3-001 ============
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, status, created_by, updated_by)
VALUES ('e3300005-0000-4000-8000-000000000005', 'SCH-SMA-KIM3-001', 'd5555555-5555-5555-5555-555555555555',
'Kimia Kelas 12: Asam Basa',
'kimia-kelas-12-asam-basa',
'Materi kimia kelas 12: teori asam basa, skala pH, reaksi netralisasi, titrasi, dan larutan penyangga beserta contoh soal.',
'id', 8, 'DRAFT', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (id) DO NOTHING;

INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
(gen_random_uuid(), 'e3300005-0000-4000-8000-000000000005', 'HEADING', 1, jsonb_build_object('text', $$Tujuan Pembelajaran$$)),
(gen_random_uuid(), 'e3300005-0000-4000-8000-000000000005', 'PARAGRAPH', 2, jsonb_build_object('text', $$Setelah mempelajari bab ini, kamu diharapkan mampu menjelaskan tiga teori asam basa, menentukan pH larutan, menulis persamaan reaksi netralisasi, memahami prinsip titrasi asam basa, dan menjelaskan cara kerja larutan penyangga.$$)),
(gen_random_uuid(), 'e3300005-0000-4000-8000-000000000005', 'HEADING', 3, jsonb_build_object('text', $$Tiga Teori Asam Basa$$)),
(gen_random_uuid(), 'e3300005-0000-4000-8000-000000000005', 'PARAGRAPH', 4, jsonb_build_object('text', $$Teori Arrhenius: asam menghasilkan ion H+ dan basa menghasilkan ion OH- dalam air. Teori Bronsted-Lowry (lebih luas): asam adalah donor proton (H+), basa adalah akseptor proton — contohnya NH3 menerima H+ menjadi NH4+. Teori Lewis (paling luas): asam adalah akseptor pasangan elektron, basa adalah donor pasangan elektron.$$)),
(gen_random_uuid(), 'e3300005-0000-4000-8000-000000000005', 'HEADING', 5, jsonb_build_object('text', $$Skala pH$$)),
(gen_random_uuid(), 'e3300005-0000-4000-8000-000000000005', 'PARAGRAPH', 6, jsonb_build_object('text', $$pH = -log [H+]. Skala pH 0–14: di bawah 7 bersifat asam, 7 netral, di atas 7 basa. Setiap selisih 1 pH berarti konsentrasi ion H+ berbeda 10 kali lipat. Contoh: air aki pH sekitar 1, jus lemon sekitar 2, air murni 7, sabun sekitar 10, dan pemutih sekitar 13.$$)),
(gen_random_uuid(), 'e3300005-0000-4000-8000-000000000005', 'HEADING', 7, jsonb_build_object('text', $$Reaksi Netralisasi dan Titrasi$$)),
(gen_random_uuid(), 'e3300005-0000-4000-8000-000000000005', 'PARAGRAPH', 8, jsonb_build_object('text', $$Asam + basa menghasilkan garam + air, misalnya HCl + NaOH menjadi NaCl + H2O. Titrasi adalah teknik menentukan konsentrasi larutan tak dikenal dengan menambahkan larutan baku setetes demi setetes sampai titik ekuivalen, ditandai perubahan warna indikator seperti fenolftalein.$$)),
(gen_random_uuid(), 'e3300005-0000-4000-8000-000000000005', 'HEADING', 9, jsonb_build_object('text', $$Larutan Penyangga$$)),
(gen_random_uuid(), 'e3300005-0000-4000-8000-000000000005', 'PARAGRAPH', 10, jsonb_build_object('text', $$Larutan penyangga (buffer) mempertahankan pH hampir tetap saat ditambah sedikit asam atau basa. Contoh dalam tubuh: sistem penyangga darah menjaga pH sekitar 7,4. Buffer dibuat dari asam lemah + garamnya, atau basa lemah + garamnya.$$)),
(gen_random_uuid(), 'e3300005-0000-4000-8000-000000000005', 'HEADING', 11, jsonb_build_object('text', $$Latihan$$)),
(gen_random_uuid(), 'e3300005-0000-4000-8000-000000000005', 'LIST', 12, jsonb_build_object('items', ARRAY[$$1. Hitung pH larutan HCl 0,01 M! (Jawaban: [H+] = 0,01 = 10^-2, pH = 2)$$, $$2. Sebutkan perbedaan asam menurut Arrhenius dan Bronsted-Lowry beserta contohnya! (Jawaban: Arrhenius hanya dalam air menghasilkan H+/OH-; Bronsted-Lowry donor/akseptor proton, misal NH3 sebagai basa)$$, $$3. Mengapa darah membutuhkan sistem penyangga? (Jawaban: agar pH tetap sekitar 7,4 karena perubahan pH kecil bisa mengganggu kerja enzim dan organ)$$]))
ON CONFLICT (id) DO NOTHING;

-- ============ 6. SCH-SD-SENI3-001 ============
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, status, created_by, updated_by)
VALUES ('e3300006-0000-4000-8000-000000000006', 'SCH-SD-SENI3-001', 'd3333333-3333-3333-3333-333333333333',
'Seni Budaya Kelas 6: Musik Daerah',
'seni-budaya-kelas-6-musik-daerah',
'Materi SBdP kelas 6: mengenal alat musik daerah Indonesia, lagu daerah, dan cara menghargai keberagaman budaya nusantara.',
'id', 6, 'DRAFT', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (id) DO NOTHING;

INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
(gen_random_uuid(), 'e3300006-0000-4000-8000-000000000006', 'HEADING', 1, jsonb_build_object('text', $$Tujuan Pembelajaran$$)),
(gen_random_uuid(), 'e3300006-0000-4000-8000-000000000006', 'PARAGRAPH', 2, jsonb_build_object('text', $$Setelah belajar bab ini, kamu bisa menyebutkan contoh alat musik daerah beserta asal daerahnya, menyanyikan lagu daerah dengan tepat, dan menjelaskan mengapa kita harus melestarikan musik tradisional Indonesia.$$)),
(gen_random_uuid(), 'e3300006-0000-4000-8000-000000000006', 'HEADING', 3, jsonb_build_object('text', $$Apa Itu Musik Daerah$$)),
(gen_random_uuid(), 'e3300006-0000-4000-8000-000000000006', 'PARAGRAPH', 4, jsonb_build_object('text', $$Musik daerah adalah musik yang lahir dan berkembang di suatu daerah, diwariskan turun-temurun. Musik daerah biasanya dimainkan dengan alat musik tradisional dan menceritakan kehidupan, alam, atau nasihat dari masyarakat setempat.$$)),
(gen_random_uuid(), 'e3300006-0000-4000-8000-000000000006', 'HEADING', 5, jsonb_build_object('text', $$Alat Musik Daerah Nusantara$$)),
(gen_random_uuid(), 'e3300006-0000-4000-8000-000000000006', 'LIST', 6, jsonb_build_object('items', ARRAY[$$Angklung — Jawa Barat, terbuat dari bambu, dimainkan dengan cara digoyang$$, $$Gamelan — Jawa dan Bali, seperangkat gong, saron, dan kenong$$, $$Sasando — Nusa Tenggara Timur, alat petik dari daun lontar$$, $$Tifa — Papua dan Maluku, gendang yang dipukul$$, $$Kolintang — Sulawesi Utara, bilah kayu yang dipukul seperti gambang$$, $$Saluang — Sumatra Barat, seruling bambu khas Minangkabau$$])),
(gen_random_uuid(), 'e3300006-0000-4000-8000-000000000006', 'HEADING', 7, jsonb_build_object('text', $$Lagu Daerah$$)),
(gen_random_uuid(), 'e3300006-0000-4000-8000-000000000006', 'PARAGRAPH', 8, jsonb_build_object('text', $$Contoh lagu daerah: Ampar-Ampar Pisang (Kalimantan Selatan), Yamko Rambe Yamko (Papua), Bungong Jeumpa (Aceh), Rasa Sayange (Maluku), dan Cublak-Cublak Suweng (Jawa Tengah). Setiap lagu memiliki makna dan irama khas daerahnya.$$)),
(gen_random_uuid(), 'e3300006-0000-4000-8000-000000000006', 'HEADING', 9, jsonb_build_object('text', $$Melestarikan Musik Daerah$$)),
(gen_random_uuid(), 'e3300006-0000-4000-8000-000000000006', 'PARAGRAPH', 10, jsonb_build_object('text', $$Kita bisa melestarikan musik daerah dengan mempelajarinya, memainkannya dalam acara sekolah, dan tidak malu menyanyikan lagu daerah. Angklung bahkan diakui UNESCO sebagai warisan budaya dunia — bukti bahwa musik Indonesia dihargai dunia.$$)),
(gen_random_uuid(), 'e3300006-0000-4000-8000-000000000006', 'HEADING', 11, jsonb_build_object('text', $$Latihan$$)),
(gen_random_uuid(), 'e3300006-0000-4000-8000-000000000006', 'LIST', 12, jsonb_build_object('items', ARRAY[$$1. Sebutkan 3 alat musik daerah beserta asal daerahnya! (Jawaban: contoh — angklung dari Jawa Barat, sasando dari NTT, tifa dari Papua)$$, $$2. Apa yang dimaksud dengan musik daerah? (Jawaban: musik yang lahir dan berkembang di suatu daerah, diwariskan turun-temurun)$$, $$3. Sebutkan 2 cara melestarikan musik daerah! (Jawaban: mempelajarinya dan memainkannya, tidak malu menyanyikan lagu daerah)$$]))
ON CONFLICT (id) DO NOTHING;
