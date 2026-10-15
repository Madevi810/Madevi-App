-- =====================================================
-- MADEVI - Artikel Batch 58 (idempoten)
-- 6 artikel: 2 Tutorial, 2 Explore, 2 School
-- Semua status DRAFT, language id, owner principal
-- =====================================================
BEGIN;

-- ---------- 1. TUT-KOMPUTER11-001 : Backup Cloud: Google Drive Otomatis ----------
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, created_by, updated_by)
VALUES ('e5800001-0001-0001-0001-000000000001', 'TUT-KOMPUTER11-001', 'baaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
 'Backup Cloud: Google Drive Otomatis', 'tut-backup-cloud-google-drive-otomatis',
 'Panduan mengatur backup otomatis ke Google Drive agar data tidak hilang saat perangkat rusak atau dicuri.', 'id', 8,
 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT',
 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;

DELETE FROM madevi.article_blocks WHERE article_id = 'e5800001-0001-0001-0001-000000000001';
INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
(gen_random_uuid(), 'e5800001-0001-0001-0001-000000000001', 'HEADING', 0, jsonb_build_object('text', $$Masalah: Data Hilang Saat HP Rusak$$)),
(gen_random_uuid(), 'e5800001-0001-0001-0001-000000000001', 'PARAGRAPH', 1, jsonb_build_object('text', $$HP jatuh ke air, laptop dicuri, atau flashdisk korup — semua bisa menghapus foto, dokumen, dan tugas sekolah dalam sekejap. Kebanyakan orang baru sadar pentingnya backup setelah datanya hilang.$$)),
(gen_random_uuid(), 'e5800001-0001-0001-0001-000000000001', 'HEADING', 2, jsonb_build_object('text', $$Apa Itu Backup Otomatis Cloud?$$)),
(gen_random_uuid(), 'e5800001-0001-0001-0001-000000000001', 'PARAGRAPH', 3, jsonb_build_object('text', $$Backup otomatis menyimpan salinan data Anda ke server internet (cloud) secara terjadwal, tanpa perlu diingat-ingat. Google Drive memberi ruang gratis 15 GB yang dibagikan dengan Gmail dan Google Foto.$$)),
(gen_random_uuid(), 'e5800001-0001-0001-0001-000000000001', 'HEADING', 4, jsonb_build_object('text', $$Persiapan$$)),
(gen_random_uuid(), 'e5800001-0001-0001-0001-000000000001', 'LIST', 5, jsonb_build_object('items', ARRAY['Akun Google aktif', 'Aplikasi Google Drive di HP/laptop', 'Koneksi WiFi yang stabil', 'Cek sisa kuota penyimpanan 15 GB gratis'])),
(gen_random_uuid(), 'e5800001-0001-0001-0001-000000000001', 'HEADING', 6, jsonb_build_object('text', $$Langkah-langkah$$)),
(gen_random_uuid(), 'e5800001-0001-0001-0001-000000000001', 'LIST', 7, jsonb_build_object('items', ARRAY['Buka aplikasi Google Drive, masuk dengan akun Google Anda', 'Aktifkan sinkronisasi foto: Foto > Pengaturan > Backup', 'Atur backup hanya saat WiFi agar kuota data tidak jebol', 'Di laptop, unduh Google Drive for Desktop dan pilih folder penting (Dokumen, Tugas)', 'Nyalakan verifikasi dua langkah (2FA) pada akun Google', 'Uji: tambahkan satu file, lalu cek dari perangkat lain apakah sudah muncul'])),
(gen_random_uuid(), 'e5800001-0001-0001-0001-000000000001', 'HEADING', 8, jsonb_build_object('text', $$Risiko yang Perlu Diperhatikan$$)),
(gen_random_uuid(), 'e5800001-0001-0001-0001-000000000001', 'PARAGRAPH', 9, jsonb_build_object('text', $$Jangan menyimpan satu-satunya salinan dokumen rahasia (KTP, ijazah) hanya di cloud tanpa pengamanan 2FA. Data di cloud tetap bisa diakses bila password bocor. Enkripsi atau folder terkunci menambah perlindungan.$$)),
(gen_random_uuid(), 'e5800001-0001-0001-0001-000000000001', 'HEADING', 10, jsonb_build_object('text', $$Pemeriksaan Hasil$$)),
(gen_random_uuid(), 'e5800001-0001-0001-0001-000000000001', 'LIST', 11, jsonb_build_object('items', ARRAY['Foto baru muncul otomatis di drive.google.com', 'File dari laptop bisa dibuka di HP', 'Notifikasi backup selesai muncul tiap hari', 'Sisa penyimpanan terpantau di menu Penyimpanan']));

-- ---------- 2. TUT-KESEHATAN17-001 : Dehidrasi: Tanda dan Penanganan ----------
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, created_by, updated_by)
VALUES ('e5800002-0002-0002-0002-000000000002', 'TUT-KESEHATAN17-001', 'b5555555-5555-5555-5555-555555555555',
 'Dehidrasi: Tanda dan Penanganan', 'tut-dehidrasi-tanda-dan-penanganan',
 'Kenali tanda-tanda dehidrasi sejak dini dan cara penanganan yang benar di rumah. Info umum, bukan pengganti nasihat medis.', 'id', 8,
 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT',
 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;

DELETE FROM madevi.article_blocks WHERE article_id = 'e5800002-0002-0002-0002-000000000002';
INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
(gen_random_uuid(), 'e5800002-0002-0002-0002-000000000002', 'HEADING', 0, jsonb_build_object('text', $$Masalah: Kurang Minum Tanpa Disadari$$)),
(gen_random_uuid(), 'e5800002-0002-0002-0002-000000000002', 'PARAGRAPH', 1, jsonb_build_object('text', $$Dehidrasi terjadi saat tubuh kehilangan cairan lebih banyak daripada yang masuk. Di iklim tropis Indonesia, keringat berlebih, diare, atau demam bisa memicu dehidrasi dalam hitungan jam.$$)),
(gen_random_uuid(), 'e5800002-0002-0002-0002-000000000002', 'HEADING', 2, jsonb_build_object('text', $$Tanda-tanda Dehidrasi$$)),
(gen_random_uuid(), 'e5800002-0002-0002-0002-000000000002', 'LIST', 3, jsonb_build_object('items', ARRAY['Ringan: haus, mulut kering, urine berwarna kuning pekat, jarang buang air kecil', 'Sedang: pusing, lemas, sakit kepala, kulit kering dan kurang elastis', 'Berat: jantung berdebar, napas cepat, bingung, pingsan — SEGERA ke dokter/IGD'])),
(gen_random_uuid(), 'e5800002-0002-0002-0002-000000000002', 'HEADING', 4, jsonb_build_object('text', $$Persiapan di Rumah$$)),
(gen_random_uuid(), 'e5800002-0002-0002-0002-000000000002', 'LIST', 5, jsonb_build_object('items', ARRAY['Air putih matang', 'Oralit (tersedia di apotek dan puskesmas)', 'Buah berair: semangka, jeruk, kelapa muda', 'Catat frekuensi buang air kecil dan warna urine'])),
(gen_random_uuid(), 'e5800002-0002-0002-0002-000000000002', 'HEADING', 6, jsonb_build_object('text', $$Langkah Penanganan$$)),
(gen_random_uuid(), 'e5800002-0002-0002-0002-000000000002', 'LIST', 7, jsonb_build_object('items', ARRAY['Minum air putih sedikit-sedikit tapi sering, jangan langsung banyak sekaligus', 'Untuk diare/muntah, beri oralit sesuai takaran kemasan', 'Istirahat di tempat sejuk, hindari aktivitas berat', 'Pada anak dan lansia, pantau lebih ketat karena lebih cepat memburuk', 'Bila muntah terus atau tidak sadar, JANGAN paksakan minum — bawa ke fasilitas kesehatan'])),
(gen_random_uuid(), 'e5800002-0002-0002-0002-000000000002', 'HEADING', 8, jsonb_build_object('text', $$Risiko dan Kapan ke Dokter$$)),
(gen_random_uuid(), 'e5800002-0002-0002-0002-000000000002', 'PARAGRAPH', 9, jsonb_build_object('text', $$Hindari minuman bersoda atau berkafein tinggi saat dehidrasi karena bersifat diuretik. Segera ke dokter bila ada tanda berat, pada bayi, ibu hamil, atau penderita penyakit kronis.$$)),
(gen_random_uuid(), 'e5800002-0002-0002-0002-000000000002', 'HEADING', 10, jsonb_build_object('text', $$Catatan Penting$$)),
(gen_random_uuid(), 'e5800002-0002-0002-0002-000000000002', 'PARAGRAPH', 11, jsonb_build_object('text', $$Artikel ini berisi informasi umum dan bukan pengganti nasihat medis profesional. Bila gejala berlanjut atau memburuk, konsultasikan ke dokter atau puskesmas terdekat.$$));

-- ---------- 3. EXP-ANTROPOLOGI10-001 : Suku Dani: Tradisi Bakar Batu ----------
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, created_by, updated_by)
VALUES ('e5800003-0003-0003-0003-000000000003', 'EXP-ANTROPOLOGI10-001', 'c8888888-8888-8888-8888-888888888888',
 'Suku Dani: Tradisi Bakar Batu', 'exp-suku-dani-tradisi-bakar-batu',
 'Mengenal Suku Dani di Lembah Baliem, Papua, dan tradisi bakar batu sebagai cara memasak sekaligus perekat persaudaraan.', 'id', 8,
 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT',
 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;

DELETE FROM madevi.article_blocks WHERE article_id = 'e5800003-0003-0003-0003-000000000003';
INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
(gen_random_uuid(), 'e5800003-0003-0003-0003-000000000003', 'HEADING', 0, jsonb_build_object('text', $$Siapa Suku Dani?$$)),
(gen_random_uuid(), 'e5800003-0003-0003-0003-000000000003', 'PARAGRAPH', 1, jsonb_build_object('text', $$Suku Dani (atau Hubula) mendiami Lembah Baliem di Pegunungan Tengah Papua, pada ketinggian sekitar 1.600 meter. Mereka hidup dari bertani ubi jalar dan beternak babi, dengan sistem sosial yang kuat dan adat yang masih dijaga.$$)),
(gen_random_uuid(), 'e5800003-0003-0003-0003-000000000003', 'HEADING', 2, jsonb_build_object('text', $$Apa Itu Bakar Batu?$$)),
(gen_random_uuid(), 'e5800003-0003-0003-0003-000000000003', 'PARAGRAPH', 3, jsonb_build_object('text', $$Bakar batu adalah tradisi memasak bersama dengan cara memanaskan batu di atas api hingga membara, lalu menumpuknya di atas makanan (ubi, sayur, babi) yang dibungkus daun. Panas batu mematangkan makanan secara perlahan dan merata.$$)),
(gen_random_uuid(), 'e5800003-0003-0003-0003-000000000003', 'HEADING', 4, jsonb_build_object('text', $$Tahapan Bakar Batu$$)),
(gen_random_uuid(), 'e5800003-0003-0003-0003-000000000003', 'LIST', 5, jsonb_build_object('items', ARRAY['Gali lubang dan susun batu khusus yang tahan panas', 'Bakar kayu di atas batu hingga batu membara merah', 'Pisahkan batu, susun makanan berlapis di atasnya', 'Tutup dengan daun dan tanah, tunggu 1–2 jam', 'Buka bersama-sama, makan sebagai satu keluarga besar'])),
(gen_random_uuid(), 'e5800003-0003-0003-0003-000000000003', 'HEADING', 6, jsonb_build_object('text', $$Makna Sosial$$)),
(gen_random_uuid(), 'e5800003-0003-0003-0003-000000000003', 'PARAGRAPH', 7, jsonb_build_object('text', $$Bakar batu bukan sekadar cara memasak — ia adalah upacara perdamaian, syukuran panen, penyambutan tamu, hingga pengikat janji antar-suku. Seluruh kampung terlibat, dari menyiapkan bahan sampai menyantap hasilnya.$$)),
(gen_random_uuid(), 'e5800003-0003-0003-0003-000000000003', 'HEADING', 8, jsonb_build_object('text', $$Kehidupan Sehari-hari$$)),
(gen_random_uuid(), 'e5800003-0003-0003-0003-000000000003', 'PARAGRAPH', 9, jsonb_build_object('text', $$Rumah khas mereka disebut honai — gubuk bundar beratap jerami. Pria dewasa mengenakan koteka, sementara perempuan memakai rok rumbai. Kini Festival Lembah Baliem tiap Agustus menampilkan perang-perangan adat dan bakar batu untuk wisatawan.$$));

-- ---------- 4. EXP-KIMIA15-001 : Oksigen: Gas Kehidupan ----------
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, created_by, updated_by)
VALUES ('e5800004-0004-0004-0004-000000000004', 'EXP-KIMIA15-001', 'c4444444-4444-4444-4444-444444444444',
 'Oksigen: Gas Kehidupan', 'exp-oksigen-gas-kehidupan',
 'Mengapa oksigen begitu penting bagi kehidupan? Dari fotosintesis hingga pernapasan, kenali unsur paling vital di atmosfer Bumi.', 'id', 8,
 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT',
 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;

DELETE FROM madevi.article_blocks WHERE article_id = 'e5800004-0004-0004-0004-000000000004';
INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
(gen_random_uuid(), 'e5800004-0004-0004-0004-000000000004', 'HEADING', 0, jsonb_build_object('text', $$Oksigen, Unsur yang Tak Terlihat$$)),
(gen_random_uuid(), 'e5800004-0004-0004-0004-000000000004', 'PARAGRAPH', 1, jsonb_build_object('text', $$Oksigen (O) adalah unsur nomor atom 8 di tabel periodik. Di udara bebas ia berbentuk molekul O2 — gas tak berwarna dan tak berbau yang menyusun sekitar 21 persen atmosfer Bumi.$$)),
(gen_random_uuid(), 'e5800004-0004-0004-0004-000000000004', 'HEADING', 2, jsonb_build_object('text', $$Dari Mana Oksigen Berasal?$$)),
(gen_random_uuid(), 'e5800004-0004-0004-0004-000000000004', 'PARAGRAPH', 3, jsonb_build_object('text', $$Sebagian besar oksigen atmosfer dihasilkan oleh fotosintesis tumbuhan dan fitoplankton laut. Persamaan fotosintesis melepaskan O2 sebagai produk samping: 6CO2 + 6H2O + cahaya → C6H12O6 + 6O2.$$)),
(gen_random_uuid(), 'e5800004-0004-0004-0004-000000000004', 'HEADING', 4, jsonb_build_object('text', $$Peran dalam Tubuh$$)),
(gen_random_uuid(), 'e5800004-0004-0004-0004-000000000004', 'LIST', 5, jsonb_build_object('items', ARRAY['Respirasi sel: glukosa + O2 → energi (ATP) + CO2 + air', 'Otak sangat peka kekurangan oksigen — beberapa menit tanpa oksigen merusak sel otak', 'Hemoglobin darah mengikat O2 di paru-paru dan melepaskannya di jaringan', 'Olahraga meningkatkan kebutuhan oksigen sehingga napas menjadi lebih cepat'])),
(gen_random_uuid(), 'e5800004-0004-0004-0004-000000000004', 'HEADING', 6, jsonb_build_object('text', $$Ozon, Saudara Oksigen$$)),
(gen_random_uuid(), 'e5800004-0004-0004-0004-000000000004', 'PARAGRAPH', 7, jsonb_build_object('text', $$Tiga atom oksigen membentuk ozon (O3). Lapisan ozon di stratosfer melindungi Bumi dari radiasi ultraviolet berbahaya matahari.$$)),
(gen_random_uuid(), 'e5800004-0004-0004-0004-000000000004', 'HEADING', 8, jsonb_build_object('text', $$Oksigen dalam Kehidupan Modern$$)),
(gen_random_uuid(), 'e5800004-0004-0004-0004-000000000004', 'PARAGRAPH', 9, jsonb_build_object('text', $$Oksigen medis dipakai di rumah sakit dan tabung oksigen darurat. Di industri, oksigen dipakai untuk pengelasan dan pembuatan baja. Kekurangan oksigen di perairan (zona mati) mengancam kehidupan laut.$$));

-- ---------- 5. SCH-SMP-MAT7-001 : Matematika Kelas 8: Teorema Pythagoras ----------
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, created_by, updated_by)
VALUES ('e5800005-0005-0005-0005-000000000005', 'SCH-SMP-MAT7-001', 'd4444444-4444-4444-4444-444444444444',
 'Matematika Kelas 8: Teorema Pythagoras', 'sch-matematika-kelas-8-teorema-pythagoras',
 'Materi Teorema Pythagoras untuk kelas 8 SMP: bunyi teorema, triple Pythagoras, contoh soal, latihan, dan kunci jawaban.', 'id', 10,
 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT',
 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;

DELETE FROM madevi.article_blocks WHERE article_id = 'e5800005-0005-0005-0005-000000000005';
INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
(gen_random_uuid(), 'e5800005-0005-0005-0005-000000000005', 'HEADING', 0, jsonb_build_object('text', $$Tujuan Pembelajaran$$)),
(gen_random_uuid(), 'e5800005-0005-0005-0005-000000000005', 'PARAGRAPH', 1, jsonb_build_object('text', $$Setelah mempelajari materi ini, kamu diharapkan mampu: menyatakan bunyi Teorema Pythagoras, menentukan sisi segitiga siku-siku, mengenali triple Pythagoras, dan menyelesaikan soal cerita yang berkaitan.$$)),
(gen_random_uuid(), 'e5800005-0005-0005-0005-000000000005', 'HEADING', 2, jsonb_build_object('text', $$Bunyi Teorema Pythagoras$$)),
(gen_random_uuid(), 'e5800005-0005-0005-0005-000000000005', 'PARAGRAPH', 3, jsonb_build_object('text', $$Pada segitiga siku-siku, kuadrat sisi miring (hipotenusa) sama dengan jumlah kuadrat kedua sisi siku-sikunya. Rumus: c² = a² + b², dengan c adalah sisi miring.$$)),
(gen_random_uuid(), 'e5800005-0005-0005-0005-000000000005', 'HEADING', 4, jsonb_build_object('text', $$Triple Pythagoras$$)),
(gen_random_uuid(), 'e5800005-0005-0005-0005-000000000005', 'LIST', 5, jsonb_build_object('items', ARRAY['3, 4, 5 (karena 9 + 16 = 25)', '6, 8, 10 (kelipatan 3, 4, 5)', '5, 12, 13 (karena 25 + 144 = 169)', '9, 12, 15 dan 8, 15, 17 juga termasuk triple Pythagoras'])),
(gen_random_uuid(), 'e5800005-0005-0005-0005-000000000005', 'HEADING', 6, jsonb_build_object('text', $$Contoh Soal$$)),
(gen_random_uuid(), 'e5800005-0005-0005-0005-000000000005', 'PARAGRAPH', 7, jsonb_build_object('text', $$Contoh 1: Sebuah segitiga siku-siku memiliki sisi a = 6 cm dan b = 8 cm. Tentukan sisi miringnya! Jawab: c² = 6² + 8² = 36 + 64 = 100, sehingga c = √100 = 10 cm. Contoh 2: Sisi miring 13 cm dan satu sisi siku-siku 5 cm, tentukan sisi lainnya! Jawab: a² = 13² − 5² = 169 − 25 = 144, sehingga a = 12 cm.$$)),
(gen_random_uuid(), 'e5800005-0005-0005-0005-000000000005', 'HEADING', 8, jsonb_build_object('text', $$Latihan$$)),
(gen_random_uuid(), 'e5800005-0005-0005-0005-000000000005', 'LIST', 9, jsonb_build_object('items', ARRAY['Tentukan sisi miring segitiga siku-siku dengan sisi 9 cm dan 12 cm!', 'Diketahui sisi miring 25 cm dan satu sisi 7 cm. Berapa sisi siku-siku yang lain?', 'Sebuah tangga sepanjang 5 m bersandar pada tembok. Kaki tangga 3 m dari tembok. Berapa tinggi tembok yang dicapai tangga?'])),
(gen_random_uuid(), 'e5800005-0005-0005-0005-000000000005', 'HEADING', 10, jsonb_build_object('text', $$Kunci Jawaban$$)),
(gen_random_uuid(), 'e5800005-0005-0005-0005-000000000005', 'LIST', 11, jsonb_build_object('items', ARRAY['c = 15 cm (karena 81 + 144 = 225)', 'a = 24 cm (karena 625 − 49 = 576)', 'Tinggi tembok = 4 m (karena 25 − 9 = 16)']));

-- ---------- 6. SCH-SD-BIN10-001 : Bahasa Indonesia Kelas 1: Huruf Vokal ----------
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, created_by, updated_by)
VALUES ('e5800006-0006-0006-0006-000000000006', 'SCH-SD-BIN10-001', 'd1000001-0000-0000-0000-000000000001',
 'Bahasa Indonesia Kelas 1: Huruf Vokal', 'sch-bahasa-indonesia-kelas-1-huruf-vokal',
 'Materi huruf vokal (a, i, u, e, o) untuk kelas 1 SD dengan contoh kata, latihan membaca, dan kunci jawaban.', 'id', 8,
 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT',
 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;

DELETE FROM madevi.article_blocks WHERE article_id = 'e5800006-0006-0006-0006-000000000006';
INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
(gen_random_uuid(), 'e5800006-0006-0006-0006-000000000006', 'HEADING', 0, jsonb_build_object('text', $$Tujuan Pembelajaran$$)),
(gen_random_uuid(), 'e5800006-0006-0006-0006-000000000006', 'PARAGRAPH', 1, jsonb_build_object('text', $$Anak-anak, hari ini kita berkenalan dengan lima huruf vokal: a, i, u, e, dan o. Setelah belajar, kalian bisa menyebutkan huruf vokal dan membaca kata sederhana yang mengandungnya.$$)),
(gen_random_uuid(), 'e5800006-0006-0006-0006-000000000006', 'HEADING', 2, jsonb_build_object('text', $$Apa Itu Huruf Vokal?$$)),
(gen_random_uuid(), 'e5800006-0006-0006-0006-000000000006', 'PARAGRAPH', 3, jsonb_build_object('text', $$Huruf vokal adalah huruf yang bunyinya keluar dengan lancar tanpa hambatan di mulut. Ada lima: a, i, u, e, o. Huruf lainnya disebut huruf konsonan, misalnya b, c, d.$$)),
(gen_random_uuid(), 'e5800006-0006-0006-0006-000000000006', 'HEADING', 4, jsonb_build_object('text', $$Contoh Kata$$)),
(gen_random_uuid(), 'e5800006-0006-0006-0006-000000000006', 'LIST', 5, jsonb_build_object('items', ARRAY['a: ayah, apel, anak', 'i: ibu, ikan, itu', 'u: ubi, udang, ulang', 'e: ember, enak, esok', 'o: obat, orang, oleh'])),
(gen_random_uuid(), 'e5800006-0006-0006-0006-000000000006', 'HEADING', 6, jsonb_build_object('text', $$Ayo Berlatih Membaca$$)),
(gen_random_uuid(), 'e5800006-0006-0006-0006-000000000006', 'PARAGRAPH', 7, jsonb_build_object('text', $$Bacalah kata-kata ini dengan suara lantang: a-pi, i-kan, u-bi, e-nak, o-rang. Perhatikan bunyi huruf vokalnya!$$)),
(gen_random_uuid(), 'e5800006-0006-0006-0006-000000000006', 'HEADING', 8, jsonb_build_object('text', $$Latihan$$)),
(gen_random_uuid(), 'e5800006-0006-0006-0006-000000000006', 'LIST', 9, jsonb_build_object('items', ARRAY['Lingkari huruf vokal pada kata: bola, buku, meja!', 'Tuliskan 3 kata yang diawali huruf a!', 'Sebutkan huruf vokal pada namamu sendiri!'])),
(gen_random_uuid(), 'e5800006-0006-0006-0006-000000000006', 'HEADING', 10, jsonb_build_object('text', $$Kunci Jawaban$$)),
(gen_random_uuid(), 'e5800006-0006-0006-0006-000000000006', 'LIST', 11, jsonb_build_object('items', ARRAY['bola: o, a | buku: u, u | meja: e, a', 'Contoh: apel, anak, ayah', 'Jawaban menyesuaikan nama masing-masing anak']));

COMMIT;
