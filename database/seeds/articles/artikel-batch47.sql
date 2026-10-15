-- Batch 47: 6 artikel (2 Tutorial, 2 Explore, 2 School)
-- Idempotent: ON CONFLICT DO NOTHING, block lama dihapus sebelum insert ulang
BEGIN;

-- ============================================================
-- 1. TUT-BAHASA5-001 — Bahasa Jepang: Hiragana Dasar
-- Node: R1.D5 Belajar & Pendidikan (b6666666-6666-6666-6666-666666666666)
-- ============================================================
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, status, created_by, updated_by)
VALUES ('e4700001-0000-4000-8000-000000000001', 'TUT-BAHASA5-001', 'b6666666-6666-6666-6666-666666666666',
        'Bahasa Jepang: Hiragana Dasar',
        'bahasa-jepang-hiragana-dasar',
        'Panduan lengkap menguasai huruf hiragana Jepang dari nol: pengenalan, cara menulis, cara menghafal, dan latihan mandiri.',
        'id', 'DRAFT',
        'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (id) DO NOTHING;

DELETE FROM madevi.article_blocks WHERE article_id = 'e4700001-0000-4000-8000-000000000001';

INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
(gen_random_uuid(), 'e4700001-0000-4000-8000-000000000001', 'HEADING', 0, jsonb_build_object('text', $$Masalah: Ingin Belajar Bahasa Jepang tapi Takut dengan Hurufnya$$)),
(gen_random_uuid(), 'e4700001-0000-4000-8000-000000000001', 'PARAGRAPH', 1, jsonb_build_object('text', $$Banyak orang ingin belajar bahasa Jepang karena anime, manga, atau rencana bekerja di Jepang, tetapi mundur begitu melihat hurufnya yang asing. Padahal, huruf hiragana adalah sistem alfabet fonetik yang justru lebih mudah dipelajari daripada yang dibayangkan — setiap huruf melambangkan satu suku kata yang bunyinya konsisten.$$)),
(gen_random_uuid(), 'e4700001-0000-4000-8000-000000000001', 'HEADING', 2, jsonb_build_object('text', $$Penjelasan: Apa Itu Hiragana$$)),
(gen_random_uuid(), 'e4700001-0000-4000-8000-000000000001', 'PARAGRAPH', 3, jsonb_build_object('text', $$Hiragana adalah satu dari tiga sistem penulisan bahasa Jepang, bersama katakana dan kanji. Hiragana terdiri dari 46 huruf dasar yang melambangkan bunyi suku kata seperti あ (a), か (ka), さ (sa). Setiap huruf dibaca persis seperti ditulis — tidak ada pengecualian bunyi seperti dalam bahasa Inggris. Hiragana digunakan untuk menulis kata asli Jepang, partikel tata bahasa, dan akhiran kata kerja.$$)),
(gen_random_uuid(), 'e4700001-0000-4000-8000-000000000001', 'HEADING', 4, jsonb_build_object('text', $$Persiapan Alat$$)),
(gen_random_uuid(), 'e4700001-0000-4000-8000-000000000001', 'LIST', 5, jsonb_build_object('items', ARRAY[
  $$Tabel hiragana lengkap 46 huruf (cetak atau digital)$$,
  $$Buku tulis kotak atau aplikasi latihan menulis di HP$$,
  $$Kartu flash (flashcard) fisik atau aplikasi seperti Anki$$,
  $$Audio pengucapan dari penutur asli (aplikasi kamus atau video belajar)$$
])),
(gen_random_uuid(), 'e4700001-0000-4000-8000-000000000001', 'HEADING', 6, jsonb_build_object('text', $$Langkah-langkah Menguasai Hiragana$$)),
(gen_random_uuid(), 'e4700001-0000-4000-8000-000000000001', 'LIST', 7, jsonb_build_object('items', ARRAY[
  $$Hafalkan 5 huruf vokal dasar: あ (a), い (i), う (u), え (e), お (o) — ini fondasi semua baris huruf$$,
  $$Pelajari baris konsonan satu per satu: K (かきくけこ), S (さしすせそ), T (たちつてと), N (なにぬねの), H (はひふへほ), M (まみむめも), Y (やゆよ), R (らりるれろ), W (わを), dan ん (n)$$,
  $$Perhatikan huruf yang bunyinya berubah: し dibaca "shi" (bukan "si"), ち "chi", つ "tsu", ふ "fu" (hembusan lembut), dan を "wo"$$,
  $$Latih urutan goresan (stroke order) yang benar: tulis dari atas ke bawah, kiri ke kanan — urutan yang benar membuat tulisan rapi dan cepat$$,
  $$Gunakan mnemonik visual: misalnya き (ki) mirip kunci, さ (sa) mirip ikan salmon melompat, ぬ (nu) mirip mie yang diaduk$$,
  $$Latihan membaca kata sederhana setiap hari: さくら (sakura), すし (sushi), ねこ (neko = kucing), とり (tori = burung)$$,
  $$Uji diri dengan flashcard: lihat huruf, ucapkan bunyinya tanpa melihat catatan — targetkan 46 huruf dalam 1–2 minggu$$
])),
(gen_random_uuid(), 'e4700001-0000-4000-8000-000000000001', 'HEADING', 8, jsonb_build_object('text', $$Risiko dan Kesalahan Umum$$)),
(gen_random_uuid(), 'e4700001-0000-4000-8000-000000000001', 'LIST', 9, jsonb_build_object('items', ARRAY[
  $$Tertukar huruf yang mirip: さ (sa) dengan き (ki), ぬ (nu) dengan め (me), れ (re) dengan わ (wa) — atasi dengan latihan menulis berpasangan$$,
  $$Hanya menghafal tanpa menulis: hiragana harus dilatih lewat tangan, bukan sekadar dihafal dengan mata$$,
  $$Terburu-buru ke katakana atau kanji sebelum hiragana benar-benar lancar — fondasi yang goyah menghambat semuanya$$,
  $$Mengabaikan pengucapan: dengarkan audio penutur asli agar bunyi ふ (fu), り (ri), dan つ (tsu) tidak terpengaruh logat Indonesia$$
])),
(gen_random_uuid(), 'e4700001-0000-4000-8000-000000000001', 'HEADING', 10, jsonb_build_object('text', $$Pemeriksaan Hasil$$)),
(gen_random_uuid(), 'e4700001-0000-4000-8000-000000000001', 'PARAGRAPH', 11, jsonb_build_object('text', $$Anda berhasil jika mampu membaca 46 huruf hiragana secara acak tanpa jeda berpikir, menuliskan bunyi yang didengar (dikte) dengan benar, dan membaca kata sederhana seperti たべもの (tabemono = makanan). Langkah berikutnya: pelajari katakana dengan metode yang sama, lalu mulai kosakata dasar dan partikel は, が, を.$$));

-- ============================================================
-- 2. TUT-KESEHATAN10-001 — Diabetes: Pencegahan Sejak Dini
-- Node: R1.D4 Kesehatan & Mental (b5555555-5555-5555-5555-555555555555)
-- ============================================================
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, status, created_by, updated_by)
VALUES ('e4700002-0000-4000-8000-000000000002', 'TUT-KESEHATAN10-001', 'b5555555-5555-5555-5555-555555555555',
        'Diabetes: Pencegahan Sejak Dini',
        'diabetes-pencegahan-sejak-dini',
        'Panduan mencegah diabetes sejak dini: mengenali faktor risiko, pola makan sehat, aktivitas fisik, dan kapan harus memeriksakan diri. Info umum, bukan pengganti nasihat medis.',
        'id', 'DRAFT',
        'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (id) DO NOTHING;

DELETE FROM madevi.article_blocks WHERE article_id = 'e4700002-0000-4000-8000-000000000002';

INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
(gen_random_uuid(), 'e4700002-0000-4000-8000-000000000002', 'HEADING', 0, jsonb_build_object('text', $$Masalah: Diabetes Semakin Banyak Menyerang Usia Muda$$)),
(gen_random_uuid(), 'e4700002-0000-4000-8000-000000000002', 'PARAGRAPH', 1, jsonb_build_object('text', $$Diabetes tidak lagi penyakit orang tua. Gaya hidup modern — minuman manis setiap hari, jarang bergerak, dan berat badan berlebih — membuat diabetes tipe 2 semakin sering ditemukan pada usia 20–30-an. Kabar baiknya: diabetes tipe 2 sebagian besar dapat dicegah dengan perubahan gaya hidup sejak dini.$$)),
(gen_random_uuid(), 'e4700002-0000-4000-8000-000000000002', 'HEADING', 2, jsonb_build_object('text', $$Penjelasan: Apa Itu Diabetes$$)),
(gen_random_uuid(), 'e4700002-0000-4000-8000-000000000002', 'PARAGRAPH', 3, jsonb_build_object('text', $$Diabetes adalah kondisi ketika kadar gula darah terlalu tinggi karena tubuh tidak menghasilkan cukup insulin atau tidak merespons insulin dengan baik. Diabetes tipe 1 disebabkan faktor autoimun dan tidak dapat dicegah. Diabetes tipe 2 — yang paling umum — berkaitan erat dengan gaya hidup dan inilah yang bisa dicegah. Gejala awalnya sering samar: mudah haus, sering buang air kecil, mudah lelah, dan luka yang lama sembuh.$$)),
(gen_random_uuid(), 'e4700002-0000-4000-8000-000000000002', 'HEADING', 4, jsonb_build_object('text', $$Persiapan: Kenali Faktor Risiko Anda$$)),
(gen_random_uuid(), 'e4700002-0000-4000-8000-000000000002', 'LIST', 5, jsonb_build_object('items', ARRAY[
  $$Riwayat keluarga: orang tua atau saudara kandung menderita diabetes$$,
  $$Berat badan berlebih, terutama lemak di perut$$,
  $$Jarang beraktivitas fisik (duduk lebih dari 8 jam sehari)$$,
  $$Kebiasaan konsumsi minuman manis dan makanan tinggi gula$$,
  $$Tekanan darah tinggi atau kolesterol tinggi$$,
  $$Pernah didiagnosis prediabetes (gula darah puasa 100–125 mg/dL)$$
])),
(gen_random_uuid(), 'e4700002-0000-4000-8000-000000000002', 'HEADING', 6, jsonb_build_object('text', $$Langkah-langkah Pencegahan$$)),
(gen_random_uuid(), 'e4700002-0000-4000-8000-000000000002', 'LIST', 7, jsonb_build_object('items', ARRAY[
  $$Kurangi minuman manis: ganti soda, teh kemasan, dan kopi gula dengan air putih atau teh tawar — satu gelas minuman manis bisa mengandung 8–10 sendok teh gula$$,
  $$Terapkan pola makan seimbang: setengah piring sayur, seperempat lauk protein, seperempat karbohidrat kompleks seperti nasi merah atau ubi$$,
  $$Bergerak 30 menit sehari: jalan cepat, bersepeda, atau berenang — aktivitas fisik membuat sel tubuh lebih sensitif terhadap insulin$$,
  $$Jaga berat badan ideal: menurunkan 5–7% berat badan terbukti menurunkan risiko diabetes secara signifikan$$,
  $$Tidur cukup 7–8 jam: kurang tidur mengganggu hormon pengatur gula darah$$,
  $$Hindari rokok dan batasi alkohol: keduanya meningkatkan risiko resistensi insulin$$,
  $$Cek gula darah berkala: terutama jika punya faktor risiko — deteksi dini prediabetes masih bisa dibalikkan dengan gaya hidup$$
])),
(gen_random_uuid(), 'e4700002-0000-4000-8000-000000000002', 'HEADING', 8, jsonb_build_object('text', $$Risiko dan Hal yang Perlu Diwaspadai$$)),
(gen_random_uuid(), 'e4700002-0000-4000-8000-000000000002', 'LIST', 9, jsonb_build_object('items', ARRAY[
  $$Mengandalkan obat herbal atau suplemen tanpa bukti: tidak ada ramuan yang terbukti mencegah diabetes menggantikan pola hidup sehat$$,
  $$Diet ekstrem yang tidak berkelanjutan: diet yang terlalu ketat biasanya gagal dalam hitungan minggu — pilih perubahan kecil yang bisa dipertahankan$$,
  $$Mengabaikan gejala: haus berlebihan dan sering buang air kecil di malam hari bukan hal sepele — segera periksa ke dokter$$,
  $$Anggapan "kurus pasti aman": orang kurus pun bisa terkena diabetes jika pola makannya buruk dan jarang bergerak$$
])),
(gen_random_uuid(), 'e4700002-0000-4000-8000-000000000002', 'HEADING', 10, jsonb_build_object('text', $$Pemeriksaan Hasil dan Tindak Lanjut$$)),
(gen_random_uuid(), 'e4700002-0000-4000-8000-000000000002', 'PARAGRAPH', 11, jsonb_build_object('text', $$Artikel ini berisi informasi umum dan BUKAN pengganti nasihat medis. Jika Anda memiliki faktor risiko atau gejala yang disebutkan, konsultasikan dengan dokter atau puskesmas terdekat untuk pemeriksaan gula darah. Pencegahan terbaik dimulai hari ini: kurangi satu gelas minuman manis, tambah 30 menit jalan kaki, dan jadikan itu kebiasaan. Gaya hidup sehat adalah investasi jangka panjang yang hasilnya Anda petik puluhan tahun ke depan.$$));

COMMIT;
-- ============================================================
-- 3. EXP-GEOGRAFI5-001 — Sungai Terpanjang di Dunia
-- Node: R2.D13 Geografi & Ilmu Bumi (c6000001-0000-0000-0000-000000000001)
-- ============================================================
BEGIN;
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, status, created_by, updated_by)
VALUES ('e4700003-0000-4000-8000-000000000003', 'EXP-GEOGRAFI5-001', 'c6000001-0000-0000-0000-000000000001',
        'Sungai Terpanjang di Dunia',
        'sungai-terpanjang-di-dunia',
        'Mengenal sungai-sungai terpanjang di dunia: Sungai Nil dan Amazon, cara mengukur panjang sungai, serta peran vital sungai bagi peradaban manusia.',
        'id', 'DRAFT',
        'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (id) DO NOTHING;

DELETE FROM madevi.article_blocks WHERE article_id = 'e4700003-0000-4000-8000-000000000003';

INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
(gen_random_uuid(), 'e4700003-0000-4000-8000-000000000003', 'HEADING', 0, jsonb_build_object('text', $$Sungai Terpanjang di Dunia$$)),
(gen_random_uuid(), 'e4700003-0000-4000-8000-000000000003', 'PARAGRAPH', 1, jsonb_build_object('text', $$Sungai adalah urat nadi peradaban. Dari Mesir kuno hingga kota-kota modern, manusia selalu membangun kehidupannya di tepi sungai. Tetapi sungai mana yang paling panjang di dunia? Jawabannya ternyata masih diperdebatkan hingga hari ini.$$)),
(gen_random_uuid(), 'e4700003-0000-4000-8000-000000000003', 'HEADING', 2, jsonb_build_object('text', $$Dua Kandidat Teratas: Nil vs Amazon$$)),
(gen_random_uuid(), 'e4700003-0000-4000-8000-000000000003', 'PARAGRAPH', 3, jsonb_build_object('text', $$Sungai Nil di Afrika secara tradisional dinobatkan sebagai yang terpanjang, sekitar 6.650 km, mengalir dari danau-danau Afrika Timur menuju Laut Mediterania. Namun pengukuran modern dengan citra satelit menunjukkan Sungai Amazon di Amerika Selatan mungkin lebih panjang — sekitar 6.400 hingga 6.992 km tergantung dari mana hulunya dihitung. Perdebatan ini belum tuntas karena menentukan "titik awal" sebuah sungai ternyata rumit: apakah dari mata air terjauh, dari anak sungai terpanjang, atau dari titik yang paling jauh dari muara?$$)),
(gen_random_uuid(), 'e4700003-0000-4000-8000-000000000003', 'HEADING', 4, jsonb_build_object('text', $$Mengapa Sulit Mengukur Panjang Sungai$$)),
(gen_random_uuid(), 'e4700003-0000-4000-8000-000000000003', 'LIST', 5, jsonb_build_object('items', ARRAY[
  $$Hulu yang ambigu: sungai besar memiliki banyak anak sungai, dan memilih mana yang dianggap "sumber utama" memengaruhi hasil pengukuran$$,
  $$Aliran yang berubah: sungai bermeander (berkelok-kelok) dan jalurnya bisa bergeser akibat banjir atau erosi dari tahun ke tahun$$,
  $$Delta yang dinamis: muara sungai terus berubah bentuk karena sedimentasi, sehingga titik akhir pengukuran tidak tetap$$,
  $$Teknologi pengukuran: dulu diukur dari peta kertas dengan benang, kini memakai citra satelit dan GPS — hasilnya bisa berbeda ratusan kilometer$$
])),
(gen_random_uuid(), 'e4700003-0000-4000-8000-000000000003', 'HEADING', 6, jsonb_build_object('text', $$Sungai-sungai Raksasa Lainnya$$)),
(gen_random_uuid(), 'e4700003-0000-4000-8000-000000000003', 'LIST', 7, jsonb_build_object('items', ARRAY[
  $$Sungai Yangtze (Tiongkok, ±6.300 km): sungai terpanjang di Asia, jantung ekonomi Tiongkok$$,
  $$Sungai Mississippi-Missouri (Amerika Serikat, ±6.275 km): sistem sungai terbesar di Amerika Utara$$,
  $$Sungai Yenisei (Rusia, ±5.539 km): sungai terpanjang yang bermuara ke Samudra Arktik$$,
  $$Sungai Kongo (Afrika, ±4.700 km): sungai terdalam di dunia dan kedua terbesar debit airnya setelah Amazon$$,
  $$Sungai Kapuas (Indonesia, ±1.143 km): sungai terpanjang di Indonesia, mengalir di Kalimantan Barat$$
])),
(gen_random_uuid(), 'e4700003-0000-4000-8000-000000000003', 'HEADING', 8, jsonb_build_object('text', $$Peran Vital Sungai bagi Peradaban$$)),
(gen_random_uuid(), 'e4700003-0000-4000-8000-000000000003', 'PARAGRAPH', 9, jsonb_build_object('text', $$Sungai bukan sekadar aliran air. Banjir tahunan Sungai Nil yang membawa lumpur subur melahirkan pertanian Mesir kuno. Sungai menjadi jalur perdagangan, sumber air minum, pembangkit listrik tenaga air, dan rumah bagi ribuan spesies. Hari ini, lebih dari 2 miliar orang bergantung pada sungai untuk kebutuhan sehari-hari — itulah mengapa menjaga kebersihan sungai adalah menjaga masa depan peradaban itu sendiri.$$));
COMMIT;

-- ============================================================
-- 4. EXP-TEKNOLOGI7-001 — Internet of Things: Rumah Pintar
-- Node: R2.D11 Teknologi (c7777777-7777-7777-7777-777777777777)
-- ============================================================
BEGIN;
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, status, created_by, updated_by)
VALUES ('e4700004-0000-4000-8000-000000000004', 'EXP-TEKNOLOGI7-001', 'c7777777-7777-7777-7777-777777777777',
        'Internet of Things: Rumah Pintar',
        'internet-of-things-rumah-pintar',
        'Mengenal Internet of Things (IoT): bagaimana perangkat sehari-hari terhubung ke internet, contoh penerapannya di rumah pintar, serta manfaat dan tantangannya.',
        'id', 'DRAFT',
        'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (id) DO NOTHING;

DELETE FROM madevi.article_blocks WHERE article_id = 'e4700004-0000-4000-8000-000000000004';

INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
(gen_random_uuid(), 'e4700004-0000-4000-8000-000000000004', 'HEADING', 0, jsonb_build_object('text', $$Internet of Things: Rumah Pintar$$)),
(gen_random_uuid(), 'e4700004-0000-4000-8000-000000000004', 'PARAGRAPH', 1, jsonb_build_object('text', $$Bayangkan lampu yang menyala sendiri saat Anda pulang, AC yang menyesuaikan suhu sebelum Anda tiba, dan kulkas yang mengingatkan saat susu habis. Semua ini dimungkinkan oleh Internet of Things (IoT) — jaringan perangkat fisik yang terhubung ke internet dan saling bertukar data.$$)),
(gen_random_uuid(), 'e4700004-0000-4000-8000-000000000004', 'HEADING', 2, jsonb_build_object('text', $$Apa Itu Internet of Things$$)),
(gen_random_uuid(), 'e4700004-0000-4000-8000-000000000004', 'PARAGRAPH', 3, jsonb_build_object('text', $$Internet of Things adalah konsep di mana benda-benda sehari-hari — lampu, kunci pintu, jam tangan, bahkan mesin cuci — dilengkapi sensor, perangkat lunak, dan konektivitas sehingga dapat mengumpulkan data dan dikendalikan dari jarak jauh. Istilah ini dipopulerkan oleh Kevin Ashton pada 1999, dan kini diperkirakan ada puluhan miliar perangkat IoT yang aktif di seluruh dunia.$$)),
(gen_random_uuid(), 'e4700004-0000-4000-8000-000000000004', 'HEADING', 4, jsonb_build_object('text', $$Cara Kerja IoT$$)),
(gen_random_uuid(), 'e4700004-0000-4000-8000-000000000004', 'LIST', 5, jsonb_build_object('items', ARRAY[
  $$Sensor: perangkat mengumpulkan data dari lingkungan — suhu, cahaya, gerakan, kelembapan$$,
  $$Konektivitas: data dikirim melalui WiFi, Bluetooth, atau jaringan seluler ke server atau aplikasi$$,
  $$Pemrosesan: aplikasi atau kecerdasan buatan menganalisis data dan mengambil keputusan$$,
  $$Aksi: perintah dikirim kembali ke perangkat — misalnya menyalakan lampu atau mengunci pintu$$
])),
(gen_random_uuid(), 'e4700004-0000-4000-8000-000000000004', 'HEADING', 6, jsonb_build_object('text', $$Contoh Penerapan di Rumah Pintar$$)),
(gen_random_uuid(), 'e4700004-0000-4000-8000-000000000004', 'LIST', 7, jsonb_build_object('items', ARRAY[
  $$Pencahayaan pintar: lampu yang bisa diatur warna dan jadwalnya lewat HP, bahkan mengikuti irama musik$$,
  $$Kunci pintu pintar: buka-tutup pintu dengan sidik jari, PIN, atau dari jarak jauh saat ada tamu$$,
  $$Termostat pintar: AC dan pemanas yang belajar kebiasaan Anda untuk menghemat listrik$$,
  $$Kamera dan sensor keamanan: pantau rumah dari mana saja dan terima peringatan gerakan mencurigakan$$,
  $$Asisten suara: kendalikan semua perangkat hanya dengan perintah suara dalam bahasa sehari-hari$$,
  $$Perangkat dapur pintar: rice cooker dan mesin kopi yang bisa dinyalakan dari kamar tidur$$
])),
(gen_random_uuid(), 'e4700004-0000-4000-8000-000000000004', 'HEADING', 8, jsonb_build_object('text', $$Manfaat dan Tantangan$$)),
(gen_random_uuid(), 'e4700004-0000-4000-8000-000000000004', 'PARAGRAPH', 9, jsonb_build_object('text', $$Manfaat IoT jelas: kenyamanan, penghematan energi, dan keamanan yang lebih baik. Namun ada tantangan serius: privasi data (perangkat merekam kebiasaan Anda), keamanan siber (kamera yang diretas bisa dimata-matai), dan ketergantungan pada koneksi internet. Kunci menghadapinya: gunakan password kuat yang unik untuk setiap perangkat, perbarui firmware secara rutin, dan matikan fitur yang tidak Anda butuhkan. Teknologi pintar seharusnya melayani Anda — bukan sebaliknya.$$));
COMMIT;
-- ============================================================
-- 5. SCH-SMP-MAT5-001 — Matematika Kelas 9: Statistika
-- Node: R3.D15 SMP (d4444444-4444-4444-4444-444444444444)
-- ============================================================
BEGIN;
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, status, created_by, updated_by)
VALUES ('e4700005-0000-4000-8000-000000000005', 'SCH-SMP-MAT5-001', 'd4444444-4444-4444-4444-444444444444',
        'Matematika Kelas 9: Statistika',
        'matematika-kelas-9-statistika',
        'Materi statistika kelas 9: mean, median, modus, tabel distribusi frekuensi, diagram, dan kuartil — lengkap dengan contoh soal dan latihan.',
        'id', 'DRAFT',
        'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (id) DO NOTHING;

DELETE FROM madevi.article_blocks WHERE article_id = 'e4700005-0000-4000-8000-000000000005';

INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
(gen_random_uuid(), 'e4700005-0000-4000-8000-000000000005', 'HEADING', 0, jsonb_build_object('text', $$Tujuan Pembelajaran$$)),
(gen_random_uuid(), 'e4700005-0000-4000-8000-000000000005', 'PARAGRAPH', 1, jsonb_build_object('text', $$Setelah mempelajari materi ini, siswa diharapkan mampu: (1) menentukan mean, median, dan modus dari data tunggal maupun data berkelompok; (2) menyajikan data dalam tabel distribusi frekuensi dan diagram; (3) menentukan kuartil dan jangkauan data; (4) menafsirkan data dalam konteks kehidupan sehari-hari.$$)),
(gen_random_uuid(), 'e4700005-0000-4000-8000-000000000005', 'HEADING', 2, jsonb_build_object('text', $$Ukuran Pemusatan Data$$)),
(gen_random_uuid(), 'e4700005-0000-4000-8000-000000000005', 'PARAGRAPH', 3, jsonb_build_object('text', $$Mean (rata-rata) adalah jumlah seluruh data dibagi banyaknya data. Median adalah nilai tengah setelah data diurutkan. Modus adalah nilai yang paling sering muncul. Contoh: nilai ulangan 6, 7, 8, 8, 9, 10. Mean = (6+7+8+8+9+10)/6 = 48/6 = 8. Median = nilai tengah dari 6 data = (8+8)/2 = 8. Modus = 8 karena muncul dua kali.$$)),
(gen_random_uuid(), 'e4700005-0000-4000-8000-000000000005', 'HEADING', 4, jsonb_build_object('text', $$Tabel Distribusi Frekuensi$$)),
(gen_random_uuid(), 'e4700005-0000-4000-8000-000000000005', 'PARAGRAPH', 5, jsonb_build_object('text', $$Untuk data yang banyak, data dikelompokkan ke dalam kelas-kelas interval. Misalnya tinggi badan 40 siswa dikelompokkan: 150–154 cm (6 siswa), 155–159 cm (14 siswa), 160–164 cm (12 siswa), 165–169 cm (8 siswa). Titik tengah tiap kelas digunakan untuk menghitung mean data berkelompok: jumlah (titik tengah × frekuensi) dibagi jumlah frekuensi.$$)),
(gen_random_uuid(), 'e4700005-0000-4000-8000-000000000005', 'HEADING', 6, jsonb_build_object('text', $$Penyajian Data dalam Diagram$$)),
(gen_random_uuid(), 'e4700005-0000-4000-8000-000000000005', 'LIST', 7, jsonb_build_object('items', ARRAY[
  $$Diagram batang: membandingkan banyaknya data tiap kategori — cocok untuk data warna favorit atau jumlah siswa per kelas$$,
  $$Diagram garis: menunjukkan perubahan dari waktu ke waktu — cocok untuk data suhu harian atau penjualan bulanan$$,
  $$Diagram lingkaran: menunjukkan proporsi tiap bagian terhadap keseluruhan dalam persen atau derajat$$
])),
(gen_random_uuid(), 'e4700005-0000-4000-8000-000000000005', 'HEADING', 8, jsonb_build_object('text', $$Kuartil dan Jangkauan$$)),
(gen_random_uuid(), 'e4700005-0000-4000-8000-000000000005', 'PARAGRAPH', 9, jsonb_build_object('text', $$Kuartil membagi data terurut menjadi empat bagian sama besar: kuartil bawah (Q1), kuartil tengah/median (Q2), dan kuartil atas (Q3). Jangkauan (range) = data terbesar − data terkecil. Jangkauan antarkuartil (hamparan) = Q3 − Q1. Contoh data: 4, 5, 6, 7, 8, 9, 10. Q1 = 5, Q2 = 7, Q3 = 9, jangkauan = 10 − 4 = 6, hamparan = 9 − 5 = 4.$$)),
(gen_random_uuid(), 'e4700005-0000-4000-8000-000000000005', 'HEADING', 10, jsonb_build_object('text', $$Latihan Soal$$)),
(gen_random_uuid(), 'e4700005-0000-4000-8000-000000000005', 'LIST', 11, jsonb_build_object('items', ARRAY[
  $$Diketahui data: 5, 7, 8, 6, 9, 7, 8, 5, 10, 7. Tentukan mean, median, dan modusnya!$$,
  $$Data berat badan (kg) 30 siswa disajikan dalam tabel: 40–44 (4), 45–49 (10), 50–54 (9), 55–59 (7). Tentukan mean data berkelompok!$$,
  $$Diketahui data terurut: 3, 5, 6, 7, 8, 9, 10, 12. Tentukan Q1, Q2, Q3, dan jangkauan antarkuartilnya!$$,
  $$Kunci jawaban no.1: mean = 72/10 = 7,2; median = (7+7)/2 = 7; modus = 7$$,
  $$Kunci jawaban no.2: titik tengah 42, 47, 52, 57 → mean = (42×4 + 47×10 + 52×9 + 57×7)/30 = 1505/30 ≈ 50,17 kg$$,
  $$Kunci jawaban no.3: Q1 = (5+6)/2 = 5,5; Q2 = (7+8)/2 = 7,5; Q3 = (9+10)/2 = 9,5; hamparan = 9,5 − 5,5 = 4$$
]));
COMMIT;

-- ============================================================
-- 6. SCH-SD-PENJAS3-001 — Penjas Kelas 6: Atletik Dasar
-- Node: R3.D14 SD (d3333333-3333-3333-3333-333333333333)
-- ============================================================
BEGIN;
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, status, created_by, updated_by)
VALUES ('e4700006-0000-4000-8000-000000000006', 'SCH-SD-PENJAS3-001', 'd3333333-3333-3333-3333-333333333333',
        'Penjas Kelas 6: Atletik Dasar',
        'penjas-kelas-6-atletik-dasar',
        'Materi penjas kelas 6: gerak dasar atletik — jalan, lari, lompat, dan lempar — lengkap dengan teknik, permainan, dan keselamatan.',
        'id', 'DRAFT',
        'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (id) DO NOTHING;

DELETE FROM madevi.article_blocks WHERE article_id = 'e4700006-0000-4000-8000-000000000006';

INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
(gen_random_uuid(), 'e4700006-0000-4000-8000-000000000006', 'HEADING', 0, jsonb_build_object('text', $$Tujuan Pembelajaran$$)),
(gen_random_uuid(), 'e4700006-0000-4000-8000-000000000006', 'PARAGRAPH', 1, jsonb_build_object('text', $$Setelah mempelajari materi ini, siswa diharapkan mampu: (1) mempraktikkan gerak dasar jalan, lari, lompat, dan lempar dengan benar; (2) menjelaskan teknik dasar masing-masing nomor atletik; (3) menerapkan sikap sportif dan menjaga keselamatan saat berolahraga.$$)),
(gen_random_uuid(), 'e4700006-0000-4000-8000-000000000006', 'HEADING', 2, jsonb_build_object('text', $$Apa Itu Atletik$$)),
(gen_random_uuid(), 'e4700006-0000-4000-8000-000000000006', 'PARAGRAPH', 3, jsonb_build_object('text', $$Atletik disebut "ibu dari semua cabang olahraga" karena gerakannya — berjalan, berlari, melompat, dan melempar — menjadi dasar hampir semua olahraga. Atletik adalah cabang olahraga tertua di dunia dan selalu menjadi bagian Olimpiade sejak zaman Yunani kuno. Kabar baiknya: kamu tidak butuh alat mahal untuk mulai berlatih atletik!$$)),
(gen_random_uuid(), 'e4700006-0000-4000-8000-000000000006', 'HEADING', 4, jsonb_build_object('text', $$Gerak Dasar Jalan dan Lari$$)),
(gen_random_uuid(), 'e4700006-0000-4000-8000-000000000006', 'LIST', 5, jsonb_build_object('items', ARRAY[
  $$Jalan cepat: badan tegak, ayunan lengan aktif, dan satu kaki selalu menapak tanah$$,
  $$Lari jarak pendek (sprint): start jongkok, tolakan kuat, langkah lebar dan cepat, condongkan badan ke depan saat finis$$,
  $$Lari jarak jauh: langkah lebih santai dan teratur, atur napas lewat hidung, jaga ritme agar tidak cepat lelah$$,
  $$Lari estafet: pelari bergantian membawa tongkat — teknik memberi dan menerima tongkat harus dilatih agar tidak jatuh$$
])),
(gen_random_uuid(), 'e4700006-0000-4000-8000-000000000006', 'HEADING', 6, jsonb_build_object('text', $$Gerak Dasar Lompat$$)),
(gen_random_uuid(), 'e4700006-0000-4000-8000-000000000006', 'LIST', 7, jsonb_build_object('items', ARRAY[
  $$Lompat jauh: awalan lari cepat, tolakan satu kaki di papan tolak, melayang dengan sikap jongkok atau menggantung, mendarat dengan dua kaki di bak pasir$$,
  $$Lompat tinggi: awalan melengkung, tolakan satu kaki, lewati mistar dengan punggung (gaya flop) atau perut (gaya straddle), mendarat di matras$$,
  $$Latihan pendukung: lompat tali (skipping) dan lompat katak untuk melatih kekuatan kaki$$
])),
(gen_random_uuid(), 'e4700006-0000-4000-8000-000000000006', 'HEADING', 8, jsonb_build_object('text', $$Gerak Dasar Lempar$$)),
(gen_random_uuid(), 'e4700006-0000-4000-8000-000000000006', 'LIST', 9, jsonb_build_object('items', ARRAY[
  $$Lempar bola kecil (kasti): pegang bola dengan tiga jari, ayunkan lengan ke belakang atas, lempar dengan tolakan kaki depan$$,
  $$Tolak peluru: peluru diletakkan di leher dekat dagu, tolak (bukan lempar) dengan dorongan lengan dan putaran badan$$,
  $$Aturan keselamatan: JANGAN PERNAH melempar saat ada teman di depan — tunggu aba-aba guru dan lempar ke arah yang sama$$
])),
(gen_random_uuid(), 'e4700006-0000-4000-8000-000000000006', 'HEADING', 10, jsonb_build_object('text', $$Keselamatan dan Sportivitas$$)),
(gen_random_uuid(), 'e4700006-0000-4000-8000-000000000006', 'LIST', 11, jsonb_build_object('items', ARRAY[
  $$Selalu pemanasan 5–10 menit sebelum latihan dan pendinginan setelahnya untuk mencegah cedera$$,
  $$Gunakan sepatu olahraga yang pas — jangan berlatih atletik dengan sandal$$,
  $$Minum air putih secukupnya, jangan menunggu sampai sangat haus$$,
  $$Junjung sportivitas: beri selamat pada pemenang, terima kekalahan dengan lapang dada, dan bantu teman yang kesulitan$$
]));
COMMIT;
