-- ============================================================
-- Madevi content batch 53 — idempoten, aman dijalankan ulang
-- 6 artikel DRAFT, language id, owner principal f7125028
-- ============================================================
BEGIN;

-- Hapus block lama bila batch dijalankan ulang
DELETE FROM madevi.article_blocks WHERE article_id IN (
  'e5300001-0000-4000-8000-000000000001',
  'e5300002-0000-4000-8000-000000000002',
  'e5300003-0000-4000-8000-000000000003',
  'e5300004-0000-4000-8000-000000000004',
  'e5300005-0000-4000-8000-000000000005',
  'e5300006-0000-4000-8000-000000000006'
);

-- ============================================================
-- ARTIKEL 1: TUT-BAHASA7-001
-- ============================================================
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, created_by, updated_by)
VALUES (
  'e5300001-0000-4000-8000-000000000001',
  'TUT-BAHASA7-001',
  'b6666666-6666-6666-6666-666666666666',
  'Bahasa Jerman: Sapaan dan Perkenalan',
  'bahasa-jerman-sapaan-dan-perkenalan',
  'Panduan praktis mempelajari sapaan dan perkenalan diri dalam bahasa Jerman untuk pemula: Guten Morgen, sich vorstellen, hingga perkenalan di kelas.',
  'id', 8,
  'f7125028-187e-44e0-b95b-88b69b8d5c9a',
  'DRAFT',
  'f7125028-187e-44e0-b95b-88b69b8d5c9a',
  'f7125028-187e-44e0-b95b-88b69b8d5c9a'
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
(gen_random_uuid(), 'e5300001-0000-4000-8000-000000000001', 'HEADING', 0, jsonb_build_object('text', $$Masalah: Bahasa Jerman Terdengar Menakutkan$$)),
(gen_random_uuid(), 'e5300001-0000-4000-8000-000000000001', 'PARAGRAPH', 1, jsonb_build_object('text', $$Banyak orang mundur sebelum mulai belajar bahasa Jerman karena kata-katanya panjang dan pengucapannya asing, misalnya "Donaudampfschifffahrt". Padahal pengucapan bahasa Jerman justru konsisten dan logis: setiap huruf hampir selalu dibaca sama. Dengan menguasai sapaan dan perkenalan diri, pemula langsung bisa berkomunikasi dalam situasi sehari-hari.$$)),
(gen_random_uuid(), 'e5300001-0000-4000-8000-000000000001', 'HEADING', 2, jsonb_build_object('text', $$Penjelasan: Sapaan Berdasarkan Waktu$$)),
(gen_random_uuid(), 'e5300001-0000-4000-8000-000000000001', 'PARAGRAPH', 3, jsonb_build_object('text', $$Bahasa Jerman membedakan sapaan formal (Sie) dan informal (du). Untuk pemula, hafalkan dulu sapaan berdasarkan waktu: Guten Morgen (selamat pagi), Guten Tag (selamat siang), Guten Abend (selamat malam), dan Gute Nacht (selamat tidur, hanya untuk pamitan tidur). Sapaan santai antar teman: Hallo! atau Hi! Perkenalan diri memakai pola: Ich heiße ... (nama saya ...) dan Ich komme aus Indonesien (saya berasal dari Indonesia).$$)),
(gen_random_uuid(), 'e5300001-0000-4000-8000-000000000001', 'HEADING', 4, jsonb_build_object('text', $$Persiapan Alat$$)),
(gen_random_uuid(), 'e5300001-0000-4000-8000-000000000001', 'LIST', 5, jsonb_build_object('items', ARRAY[
  'Aplikasi kamus Jerman-Indonesia (misalnya aplikasi kamus digital gratis)',
  'Audio pelafalan: dengarkan penutur asli minimal 10 menit sehari',
  'Catatan kecil berisi 20 sapaan dan frasa perkenalan',
  'Partner latihan atau cermin untuk berlatih mengucapkan'
])),
(gen_random_uuid(), 'e5300001-0000-4000-8000-000000000001', 'HEADING', 6, jsonb_build_object('text', $$Langkah: Berlatih Perkenalan Diri$$)),
(gen_random_uuid(), 'e5300001-0000-4000-8000-000000000001', 'LIST', 7, jsonb_build_object('items', ARRAY[
  'Langkah 1: Hafalkan 4 sapaan waktu (Guten Morgen, Guten Tag, Guten Abend, Gute Nacht) beserta pengucapannya.',
  'Langkah 2: Latih kalimat perkenalan: "Hallo! Ich heiße Budi. Ich komme aus Indonesien. Ich lerne Deutsch."',
  'Langkah 3: Tambahkan frasa tanya: "Wie heißt du?" (siapa namamu?), "Woher kommst du?" (dari mana asalmu?), "Wie geht es dir?" (apa kabarmu?).',
  'Langkah 4: Latih dialog pendek 1 menit setiap pagi: sapa, perkenalkan diri, tanya kabar, pamit ("Tschüss!" atau "Auf Wiedersehen!").',
  'Langkah 5: Rekam suaramu dan bandingkan dengan audio penutur asli; perbaiki pengucapan huruf ä, ö, ü, dan ß.',
  'Langkah 6: Praktikkan pada teman atau komunitas belajar bahasa Jerman setiap minggu.'
])),
(gen_random_uuid(), 'e5300001-0000-4000-8000-000000000001', 'HEADING', 8, jsonb_build_object('text', $$Risiko dan Kesalahan Umum$$)),
(gen_random_uuid(), 'e5300001-0000-4000-8000-000000000001', 'LIST', 9, jsonb_build_object('items', ARRAY[
  'Mengucapkan Gute Nacht saat baru bertemu di malam hari — itu untuk pamitan tidur, gunakan Guten Abend.',
  'Mencampur Sie dan du: pada orang yang baru dikenal dan lebih tua, gunakan Sie sampai dipersilakan memakai du.',
  'Melafalkan w seperti bahasa Inggris "w"; dalam bahasa Jerman w dibaca seperti "v".',
  'Terlalu lama menghafal tanpa praktik berbicara — kelancaran hanya datang dari latihan lisan.'
])),
(gen_random_uuid(), 'e5300001-0000-4000-8000-000000000001', 'HEADING', 10, jsonb_build_object('text', $$Pemeriksaan Hasil dan Tindak Lanjut$$)),
(gen_random_uuid(), 'e5300001-0000-4000-8000-000000000001', 'PARAGRAPH', 11, jsonb_build_object('text', $$Uji dirimu: bisakah kamu memperkenalkan diri dalam bahasa Jerman selama 30 detik tanpa teks? Bisakah kamu menyapa sesuai waktu dengan benar? Jika ya, target tercapai. Tindak lanjut: pelajari angka 1–100 dan hari dalam seminggu, lalu lanjutkan ke kalimat perkenalan yang lebih lengkap (umur, pekerjaan, hobi). Konsistensi 15 menit sehari lebih efektif daripada belajar 3 jam seminggu sekali.$$));

-- ============================================================
-- ARTIKEL 2: TUT-KESEHATAN14-001
-- ============================================================
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, created_by, updated_by)
VALUES (
  'e5300002-0000-4000-8000-000000000002',
  'TUT-KESEHATAN14-001',
  'b5555555-5555-5555-5555-555555555555',
  'Sakit Punggung: Peregangan Harian',
  'sakit-punggung-peregangan-harian',
  'Panduan mengatasi sakit punggung akibat duduk terlalu lama dengan peregangan harian yang aman, plus tanda bahaya kapan harus ke dokter.',
  'id', 7,
  'f7125028-187e-44e0-b95b-88b69b8d5c9a',
  'DRAFT',
  'f7125028-187e-44e0-b95b-88b69b8d5c9a',
  'f7125028-187e-44e0-b95b-88b69b8d5c9a'
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
(gen_random_uuid(), 'e5300002-0000-4000-8000-000000000002', 'HEADING', 0, jsonb_build_object('text', $$Masalah: Punggung Pegel Setelah Duduk Seharian$$)),
(gen_random_uuid(), 'e5300002-0000-4000-8000-000000000002', 'PARAGRAPH', 1, jsonb_build_object('text', $$Bekerja di depan komputer 8 jam sehari membuat punggung kaku, pegal, bahkan nyeri menjalar. Otot punggung melemah karena jarang digerakkan, postur membungkuk memperparah tekanan pada tulang belakang. Kabar baiknya: sebagian besar sakit punggung akibat gaya hidup membaik dengan peregangan rutin dan perbaikan postur.$$)),
(gen_random_uuid(), 'e5300002-0000-4000-8000-000000000002', 'HEADING', 2, jsonb_build_object('text', $$Penjelasan: Mengapa Punggung Sakit$$)),
(gen_random_uuid(), 'e5300002-0000-4000-8000-000000000002', 'PARAGRAPH', 3, jsonb_build_object('text', $$Tulang belakang ditopang otot inti (core) dan otot punggung. Duduk terlalu lama membuat otot fleksor pinggul memendek dan otot punggung meregang terus-menerus hingga kelelahan. Kurang gerak juga mengurangi aliran darah ke jaringan. Peregangan harian mengembalikan panjang otot yang normal, melancarkan sirkulasi, dan mengurangi ketegangan saraf. Artikel ini berisi informasi umum dan bukan pengganti nasihat medis; konsultasikan ke dokter bila nyeri menetap.$$)),
(gen_random_uuid(), 'e5300002-0000-4000-8000-000000000002', 'HEADING', 4, jsonb_build_object('text', $$Persiapan Alat$$)),
(gen_random_uuid(), 'e5300002-0000-4000-8000-000000000002', 'LIST', 5, jsonb_build_object('items', ARRAY[
  'Matras atau alas empuk untuk peregangan di lantai',
  'Kursi yang stabil untuk peregangan sambil duduk',
  'Timer: cukup 10 menit per sesi',
  'Bantal kecil untuk menyangga pinggang saat duduk'
])),
(gen_random_uuid(), 'e5300002-0000-4000-8000-000000000002', 'HEADING', 6, jsonb_build_object('text', $$Langkah: Rutinitas Peregangan Harian$$)),
(gen_random_uuid(), 'e5300002-0000-4000-8000-000000000002', 'LIST', 7, jsonb_build_object('items', ARRAY[
  'Langkah 1: Child pose — berlutut, rentangkan tangan ke depan, turunkan dada ke lantai, tahan 30 detik, ulangi 3 kali.',
  'Langkah 2: Cat-cow — posisi merangkak, lengkungkan punggung ke atas lalu ke bawah perlahan, 10 kali.',
  'Langkah 3: Knee-to-chest — berbaring, tarik satu lutut ke dada, tahan 20 detik tiap kaki.',
  'Langkah 4: Seated twist — duduk di kursi, putar badan ke kanan sambil berpegangan pada sandaran, tahan 20 detik, ganti sisi.',
  'Langkah 5: Shoulder blade squeeze — duduk tegak, rapatkan kedua tulang belikat ke belakang, tahan 5 detik, ulangi 10 kali.',
  'Langkah 6: Lakukan 2 kali sehari (pagi dan sore); setiap 1 jam duduk, berdiri dan jalan 2 menit.'
])),
(gen_random_uuid(), 'e5300002-0000-4000-8000-000000000002', 'HEADING', 8, jsonb_build_object('text', $$Risiko dan Tanda Bahaya$$)),
(gen_random_uuid(), 'e5300002-0000-4000-8000-000000000002', 'LIST', 9, jsonb_build_object('items', ARRAY[
  'Jangan memaksakan gerakan yang menimbulkan nyeri tajam; peregangan seharusnya terasa menarik, bukan sakit.',
  'Segera ke dokter bila: nyeri setelah cedera/jatuh, mati rasa atau kesemutan di kaki, sulit menahan buang air, nyeri tidak membaik setelah 2 minggu, atau disertai demam dan penurunan berat badan.',
  'Hindari mengangkat beban berat dengan punggung membungkuk selama masa nyeri.'
])),
(gen_random_uuid(), 'e5300002-0000-4000-8000-000000000002', 'HEADING', 10, jsonb_build_object('text', $$Pemeriksaan Hasil dan Tindak Lanjut$$)),
(gen_random_uuid(), 'e5300002-0000-4000-8000-000000000002', 'PARAGRAPH', 11, jsonb_build_object('text', $$Evaluasi setelah 2 minggu rutin: apakah kekakuan pagi berkurang? Apakah bisa duduk lebih lama tanpa pegal? Jika membaik, lanjutkan sebagai kebiasaan dan tambah latihan penguatan otot inti (plank ringan). Jika tidak membaik atau memburuk, hentikan peregangan mandiri dan konsultasikan ke dokter atau fisioterapis untuk diagnosis yang tepat.$$));

-- ============================================================
-- ARTIKEL 3: EXP-GEOGRAFI7-001
-- ============================================================
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, created_by, updated_by)
VALUES (
  'e5300003-0000-4000-8000-000000000003',
  'EXP-GEOGRAFI7-001',
  'c6000001-0000-0000-0000-000000000001',
  'Lembah dan Ngarai Terdalam',
  'lembah-dan-ngarai-terdalam',
  'Mengenal lembah dan ngarai terdalam di dunia: Grand Canyon, Ngarai Yarlung Tsangpo, hingga Ngarai Sianok di Indonesia.',
  'id', 6,
  'f7125028-187e-44e0-b95b-88b69b8d5c9a',
  'DRAFT',
  'f7125028-187e-44e0-b95b-88b69b8d5c9a',
  'f7125028-187e-44e0-b95b-88b69b8d5c9a'
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
(gen_random_uuid(), 'e5300003-0000-4000-8000-000000000003', 'HEADING', 0, jsonb_build_object('text', $$Apa Itu Lembah dan Ngarai?$$)),
(gen_random_uuid(), 'e5300003-0000-4000-8000-000000000003', 'PARAGRAPH', 1, jsonb_build_object('text', $$Lembah adalah cekungan memanjang di permukaan bumi yang umumnya dialiri sungai. Ngarai (canyon) adalah lembah yang dalam dan sempit dengan dinding curam, terbentuk oleh erosi sungai yang mengiris batuan selama jutaan tahun. Perbedaan keduanya terletak pada kedalaman, kecuraman dinding, dan proses pembentukannya.$$)),
(gen_random_uuid(), 'e5300003-0000-4000-8000-000000000003', 'HEADING', 2, jsonb_build_object('text', $$Ngarai Yarlung Tsangpo: Yang Terdalam di Dunia$$)),
(gen_random_uuid(), 'e5300003-0000-4000-8000-000000000003', 'PARAGRAPH', 3, jsonb_build_object('text', $$Ngarai Yarlung Tsangpo di Tibet memegang rekor ngarai terdalam di dunia dengan kedalaman mencapai sekitar 5.300 meter — tiga kali lebih dalam dari Grand Canyon. Ngarai ini terbentuk oleh Sungai Yarlung Tsangpo yang memotong Himalaya, menciptakan dinding hampir vertikal dan ekosistem unik dari hutan subtropis hingga gletser dalam jarak yang pendek.$$)),
(gen_random_uuid(), 'e5300003-0000-4000-8000-000000000003', 'HEADING', 4, jsonb_build_object('text', $$Grand Canyon: Yang Paling Terkenal$$)),
(gen_random_uuid(), 'e5300003-0000-4000-8000-000000000003', 'PARAGRAPH', 5, jsonb_build_object('text', $$Grand Canyon di Arizona, Amerika Serikat, membentang 446 kilometer dengan kedalaman hingga 1.857 meter. Sungai Colorado mengikis batuan selama sekitar 6 juta tahun, menyingkap lapisan batuan berusia hampir 2 miliar tahun. Dinding ngarai ini adalah buku sejarah geologi terbuka yang menunjukkan evolusi bumi lapis demi lapis.$$)),
(gen_random_uuid(), 'e5300003-0000-4000-8000-000000000003', 'HEADING', 6, jsonb_build_object('text', $$Ngarai di Indonesia: Sianok dan Lainnya$$)),
(gen_random_uuid(), 'e5300003-0000-4000-8000-000000000003', 'PARAGRAPH', 7, jsonb_build_object('text', $$Indonesia memiliki Ngarai Sianok di Bukittinggi, Sumatera Barat — lembah curam sepanjang 15 kilometer dengan kedalaman sekitar 100 meter, diapit tebing dan dialiri Batang Sianok. Ada pula Lembah Baliem di Papua dan Ngarai di kawasan karst Maros, Sulawesi Selatan. Ngarai-ngarai ini menjadi habitat endemik sekaligus destinasi wisata alam.$$)),
(gen_random_uuid(), 'e5300003-0000-4000-8000-000000000003', 'HEADING', 8, jsonb_build_object('text', $$Proses Terbentuknya Ngarai$$)),
(gen_random_uuid(), 'e5300003-0000-4000-8000-000000000003', 'PARAGRAPH', 9, jsonb_build_object('text', $$Ngarai terbentuk melalui tiga mekanisme utama: erosi sungai yang terus mengiris ke bawah, pengangkatan tektonik yang membuat sungai mengukir lebih dalam, dan pelapukan dinding yang memperlebar celah. Kombinasi ketiganya selama jutaan tahun menghasilkan bentang alam dramatis yang kita lihat hari ini — pengingat bahwa air yang lembut pun bisa membelah batu jika diberi waktu.$$));

-- ============================================================
-- ARTIKEL 4: EXP-TEKNOLOGI9-001
-- ============================================================
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, created_by, updated_by)
VALUES (
  'e5300004-0000-4000-8000-000000000004',
  'EXP-TEKNOLOGI9-001',
  'c7777777-7777-7777-7777-777777777777',
  'Cloud Computing: Komputer di Awan',
  'cloud-computing-komputer-di-awan',
  'Memahami cloud computing: cara kerja server raksasa di pusat data, jenis layanan IaaS PaaS SaaS, manfaat, dan risikonya.',
  'id', 6,
  'f7125028-187e-44e0-b95b-88b69b8d5c9a',
  'DRAFT',
  'f7125028-187e-44e0-b95b-88b69b8d5c9a',
  'f7125028-187e-44e0-b95b-88b69b8d5c9a'
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
(gen_random_uuid(), 'e5300004-0000-4000-8000-000000000004', 'HEADING', 0, jsonb_build_object('text', $$Apa Itu Cloud Computing?$$)),
(gen_random_uuid(), 'e5300004-0000-4000-8000-000000000004', 'PARAGRAPH', 1, jsonb_build_object('text', $$Cloud computing adalah penyewaan sumber daya komputasi — server, penyimpanan, dan perangkat lunak — melalui internet, alih-alih memilikinya sendiri. Saat kamu menyimpan foto di layanan penyimpanan online atau menonton film streaming, kamu sedang memakai cloud. Data disimpan di pusat data raksasa yang dijaga 24 jam, bukan di perangkatmu.$$)),
(gen_random_uuid(), 'e5300004-0000-4000-8000-000000000004', 'HEADING', 2, jsonb_build_object('text', $$Tiga Model Layanan Utama$$)),
(gen_random_uuid(), 'e5300004-0000-4000-8000-000000000004', 'LIST', 3, jsonb_build_object('items', ARRAY[
  'IaaS (Infrastructure as a Service): menyewa mesin virtual dan jaringan mentah, misalnya untuk menjalankan server web sendiri.',
  'PaaS (Platform as a Service): menyewa platform siap pakai untuk membangun aplikasi tanpa mengurus server.',
  'SaaS (Software as a Service): memakai aplikasi langsung lewat browser, misalnya email, dokumen online, dan konferensi video.'
])),
(gen_random_uuid(), 'e5300004-0000-4000-8000-000000000004', 'HEADING', 4, jsonb_build_object('text', $$Mengapa Perusahaan Beralih ke Cloud?$$)),
(gen_random_uuid(), 'e5300004-0000-4000-8000-000000000004', 'PARAGRAPH', 5, jsonb_build_object('text', $$Cloud mengubah belanja modal menjadi biaya operasional: tidak perlu membeli server mahal di awal, cukup bayar sesuai pemakaian. Kapasitas bisa diperbesar dalam hitungan menit saat trafik melonjak (misalnya saat harbolnas) dan diperkecil lagi setelahnya. Perusahaan juga mendapat keandalan tinggi karena data direplikasi di beberapa lokasi — jika satu pusat data bermasalah, layanan tetap berjalan dari lokasi lain.$$)),
(gen_random_uuid(), 'e5300004-0000-4000-8000-000000000004', 'HEADING', 6, jsonb_build_object('text', $$Risiko dan Tantangan$$)),
(gen_random_uuid(), 'e5300004-0000-4000-8000-000000000004', 'PARAGRAPH', 7, jsonb_build_object('text', $$Ketergantungan pada koneksi internet adalah risiko utama: tanpa internet, layanan cloud tidak bisa diakses. Ada pula isu kedaulatan data — data penting negara atau perusahaan tersimpan di server yang bisa berada di luar negeri. Keamanan menjadi tanggung jawab bersama: penyedia mengamankan infrastruktur, tetapi pengguna wajib menjaga kata sandi dan mengatur izin akses dengan benar. Biaya yang tidak terkontrol juga bisa membengkak jika pemakaian tidak dipantau.$$)),
(gen_random_uuid(), 'e5300004-0000-4000-8000-000000000004', 'HEADING', 8, jsonb_build_object('text', $$Cloud dalam Kehidupan Sehari-hari$$)),
(gen_random_uuid(), 'e5300004-0000-4000-8000-000000000004', 'PARAGRAPH', 9, jsonb_build_object('text', $$Tanpa disadari, hampir semua orang memakai cloud setiap hari: cadangan foto otomatis di HP, dokumen yang bisa dibuka dari mana saja, ojek online yang menghitung rute di server, hingga asisten suara yang memproses perintah di pusat data. Cloud telah menjadi infrastruktur tak terlihat yang menopang kehidupan digital modern — dan pemahamannya menjadi bekal penting bagi siapa pun yang ingin berkarier di bidang teknologi.$$));

-- ============================================================
-- ARTIKEL 5: SCH-SMP-MAT6-001
-- ============================================================
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, created_by, updated_by)
VALUES (
  'e5300005-0000-4000-8000-000000000005',
  'SCH-SMP-MAT6-001',
  'd4444444-4444-4444-4444-444444444444',
  'Matematika Kelas 7: Garis dan Sudut',
  'matematika-kelas-7-garis-dan-sudut',
  'Materi garis dan sudut untuk kelas 7: pengertian garis, jenis sudut, hubungan antar sudut, contoh soal, latihan, dan kunci jawaban.',
  'id', 9,
  'f7125028-187e-44e0-b95b-88b69b8d5c9a',
  'DRAFT',
  'f7125028-187e-44e0-b95b-88b69b8d5c9a',
  'f7125028-187e-44e0-b95b-88b69b8d5c9a'
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
(gen_random_uuid(), 'e5300005-0000-4000-8000-000000000005', 'HEADING', 0, jsonb_build_object('text', $$Tujuan Pembelajaran$$)),
(gen_random_uuid(), 'e5300005-0000-4000-8000-000000000005', 'PARAGRAPH', 1, jsonb_build_object('text', $$Setelah mempelajari materi ini, siswa diharapkan mampu: (1) menjelaskan pengertian garis, ruas garis, sinar garis; (2) mengidentifikasi jenis-jenis sudut berdasarkan besarnya; (3) menentukan hubungan antar sudut (berpenyiku, berpelurus, bertolak belakang); (4) menyelesaikan soal perhitungan sudut.$$)),
(gen_random_uuid(), 'e5300005-0000-4000-8000-000000000005', 'HEADING', 2, jsonb_build_object('text', $$Pengertian Garis$$)),
(gen_random_uuid(), 'e5300005-0000-4000-8000-000000000005', 'PARAGRAPH', 3, jsonb_build_object('text', $$Garis adalah himpunan titik-titik yang memanjang tanpa ujung ke dua arah, biasanya diberi nama dengan huruf kecil seperti garis g atau garis l. Ruas garis adalah bagian garis yang dibatasi dua titik ujung (misalnya ruas garis AB). Sinar garis dimulai dari satu titik pangkal dan memanjang ke satu arah tanpa batas. Dua garis dikatakan sejajar jika tidak pernah berpotongan, berpotongan jika bertemu di satu titik, dan berhimpit jika terletak tepat di atas satu sama lain.$$)),
(gen_random_uuid(), 'e5300005-0000-4000-8000-000000000005', 'HEADING', 4, jsonb_build_object('text', $$Jenis-jenis Sudut$$)),
(gen_random_uuid(), 'e5300005-0000-4000-8000-000000000005', 'LIST', 5, jsonb_build_object('items', ARRAY[
  'Sudut lancip: besarnya antara 0° dan 90° (misalnya 45°).',
  'Sudut siku-siku: tepat 90°.',
  'Sudut tumpul: antara 90° dan 180° (misalnya 120°).',
  'Sudut lurus: tepat 180°.',
  'Sudut refleks: antara 180° dan 360°.'
])),
(gen_random_uuid(), 'e5300005-0000-4000-8000-000000000005', 'HEADING', 6, jsonb_build_object('text', $$Hubungan Antar Sudut$$)),
(gen_random_uuid(), 'e5300005-0000-4000-8000-000000000005', 'PARAGRAPH', 7, jsonb_build_object('text', $$Dua sudut yang jumlahnya 90° disebut saling berpenyiku (komplemen); yang jumlahnya 180° disebut saling berpelurus (suplemen). Sudut yang bertolak belakang (berhadapan saat dua garis berpotongan) besarnya selalu sama. Jika dua garis sejajar dipotong garis lain, terbentuk pasangan sudut sehadap (sama besar), berseberangan (sama besar), dan sepihak (jumlahnya 180°).$$)),
(gen_random_uuid(), 'e5300005-0000-4000-8000-000000000005', 'HEADING', 8, jsonb_build_object('text', $$Contoh Soal$$)),
(gen_random_uuid(), 'e5300005-0000-4000-8000-000000000005', 'PARAGRAPH', 9, jsonb_build_object('text', $$Contoh 1: Diketahui sudut A = 35°. Tentukan penyiku dan pelurus sudut A. Penyelesaian: penyiku = 90° − 35° = 55°; pelurus = 180° − 35° = 145°. Contoh 2: Dua garis sejajar dipotong garis transversal membentuk sudut 110°. Tentukan sudut sehadapnya. Penyelesaian: sudut sehadap besarnya sama, yaitu 110°.$$)),
(gen_random_uuid(), 'e5300005-0000-4000-8000-000000000005', 'HEADING', 10, jsonb_build_object('text', $$Latihan dan Kunci Jawaban$$)),
(gen_random_uuid(), 'e5300005-0000-4000-8000-000000000005', 'LIST', 11, jsonb_build_object('items', ARRAY[
  'Soal 1: Sudut 28° termasuk jenis sudut apa? Kunci: sudut lancip.',
  'Soal 2: Tentukan pelurus dari sudut 67°. Kunci: 180° − 67° = 113°.',
  'Soal 3: Dua sudut saling berpenyiku, salah satunya 41°. Berapa besar sudut lainnya? Kunci: 90° − 41° = 49°.'
]));

-- ============================================================
-- ARTIKEL 6: SCH-SD-SENI4-001
-- ============================================================
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, created_by, updated_by)
VALUES (
  'e5300006-0000-4000-8000-000000000006',
  'SCH-SD-SENI4-001',
  'd3333333-3333-3333-3333-333333333333',
  'Seni Budaya Kelas 3: Menggambar',
  'seni-budaya-kelas-3-menggambar',
  'Materi menggambar untuk kelas 3 SD: unsur garis dan warna, teknik menggambar sederhana, contoh karya, latihan, dan kunci jawaban.',
  'id', 7,
  'f7125028-187e-44e0-b95b-88b69b8d5c9a',
  'DRAFT',
  'f7125028-187e-44e0-b95b-88b69b8d5c9a',
  'f7125028-187e-44e0-b95b-88b69b8d5c9a'
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
(gen_random_uuid(), 'e5300006-0000-4000-8000-000000000006', 'HEADING', 0, jsonb_build_object('text', $$Tujuan Pembelajaran$$)),
(gen_random_uuid(), 'e5300006-0000-4000-8000-000000000006', 'PARAGRAPH', 1, jsonb_build_object('text', $$Setelah belajar materi ini, siswa kelas 3 diharapkan mampu: (1) menyebutkan unsur-unsur gambar (garis, bentuk, warna); (2) menggambar bebas dengan tema lingkungan sekitar; (3) mewarnai gambar dengan rapi; (4) menceritakan hasil gambarnya di depan kelas dengan percaya diri.$$)),
(gen_random_uuid(), 'e5300006-0000-4000-8000-000000000006', 'HEADING', 2, jsonb_build_object('text', $$Unsur-unsur Menggambar$$)),
(gen_random_uuid(), 'e5300006-0000-4000-8000-000000000006', 'PARAGRAPH', 3, jsonb_build_object('text', $$Menggambar dimulai dari garis. Ada garis lurus, garis lengkung, garis zigzag, dan garis spiral. Dari garis terbentuk bidang seperti lingkaran, segitiga, dan persegi. Warna membuat gambar hidup: warna primer (merah, kuning, biru) bisa dicampur menjadi warna sekunder (jingga, hijau, ungu). Warna juga menyampaikan perasaan — merah terasa berani, biru terasa tenang.$$)),
(gen_random_uuid(), 'e5300006-0000-4000-8000-000000000006', 'HEADING', 4, jsonb_build_object('text', $$Teknik Menggambar Sederhana$$)),
(gen_random_uuid(), 'e5300006-0000-4000-8000-000000000006', 'LIST', 5, jsonb_build_object('items', ARRAY[
  'Siapkan kertas gambar, pensil, penghapus, dan crayon atau pensil warna.',
  'Buat sketsa ringan dengan pensil: mulai dari bentuk besar (misalnya lingkaran untuk matahari, persegi untuk rumah).',
  'Tambahkan detail: jendela, pintu, pohon, burung di langit.',
  'Tebalkan garis yang sudah benar, hapus garis bantu yang tidak perlu.',
  'Warnai dari area besar ke kecil, dengan arah yang sama agar rapi.'
])),
(gen_random_uuid(), 'e5300006-0000-4000-8000-000000000006', 'HEADING', 6, jsonb_build_object('text', $$Contoh: Menggambar Rumahku$$)),
(gen_random_uuid(), 'e5300006-0000-4000-8000-000000000006', 'PARAGRAPH', 7, jsonb_build_object('text', $$Gambarlah rumah dengan tema "Rumahku". Buat persegi untuk badan rumah, segitiga untuk atap, persegi panjang untuk pintu dan jendela. Tambahkan matahari tersenyum di sudut langit, awan berbentuk bulat, dan bunga di halaman. Warnai atap dengan merah, dinding dengan kuning muda, dan langit dengan biru muda. Tidak ada gambar yang salah — yang penting berani mencoba!$$)),
(gen_random_uuid(), 'e5300006-0000-4000-8000-000000000006', 'HEADING', 8, jsonb_build_object('text', $$Latihan$$)),
(gen_random_uuid(), 'e5300006-0000-4000-8000-000000000006', 'LIST', 9, jsonb_build_object('items', ARRAY[
  'Tugas 1: Gambarlah pemandangan sekolahmu di kertas gambar, lalu warnai dengan rapi.',
  'Tugas 2: Buatlah gambar bebas bertema "Hewan Kesukaanku" menggunakan minimal 3 warna.',
  'Tugas 3: Ceritakan di depan kelas tentang gambar yang kamu buat: apa judulnya dan mengapa kamu menggambarnya.'
])),
(gen_random_uuid(), 'e5300006-0000-4000-8000-000000000006', 'HEADING', 10, jsonb_build_object('text', $$Penilaian dan Kunci$$)),
(gen_random_uuid(), 'e5300006-0000-4000-8000-000000000006', 'PARAGRAPH', 11, jsonb_build_object('text', $$Penilaian menggambar bersifat apresiatif: guru menilai keberanian berekspresi, kelengkapan unsur gambar (garis, bentuk, warna), kerapian mewarnai, dan kemampuan bercerita. Tidak ada jawaban tunggal yang benar — setiap karya anak dihargai sebagai ungkapan kreativitas. Beri bintang pada karya teman sebagai bentuk apresiasi!$$));

COMMIT;
