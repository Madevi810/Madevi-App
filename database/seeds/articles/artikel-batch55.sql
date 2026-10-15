-- ============================================================================
-- Madevi Content Batch 55 — 6 artikel (2 Tutorial, 2 Explore, 2 School)
-- Idempoten: ON CONFLICT DO NOTHING pada artikel; block lama dihapus dulu.
-- Owner: f7125028-187e-44e0-b95b-88b69b8d5c9a | status DRAFT | language id
-- ============================================================================
BEGIN;

-- --------------------------------------------------------------------------
-- 1. TUT-KOMPUTER10-001 — "Email Profesional: Etiket Digital" (12 block)
-- Node: R1.D3.K7 Komputer & Laptop (baaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa)
-- --------------------------------------------------------------------------
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_name, creator_principal_id, access_level, status, created_by, updated_by)
VALUES (
  'e5555551-5551-4551-8551-555555555551',
  'TUT-KOMPUTER10-001',
  'baaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  'Email Profesional: Etiket Digital',
  'email-profesional-etiket-digital',
  'Panduan menulis email profesional: subjek, sapaan, struktur isi, hingga kesalahan yang harus dihindari.',
  'id', 6, 'Madevi', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'MEMBER', 'DRAFT',
  'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a'
) ON CONFLICT (business_code) DO NOTHING;

DELETE FROM madevi.article_blocks WHERE article_id = 'e5555551-5551-4551-8551-555555555551';

INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
(gen_random_uuid(), 'e5555551-5551-4551-8551-555555555551', 'HEADING', 0, jsonb_build_object('text', $$Masalah: Email yang Membuat Kesan Buruk$$)),
(gen_random_uuid(), 'e5555551-5551-4551-8551-555555555551', 'PARAGRAPH', 1, jsonb_build_object('text', $$Banyak orang kehilangan kesempatan kerja atau klien hanya karena email yang tidak sopan: tanpa subjek, ejaan berantakan, atau lampiran yang tidak dijelaskan. Email adalah "wajah digital" Anda di dunia profesional, dan kesan pertama terbentuk dalam hitungan detik dari cara Anda menulis.$$)),
(gen_random_uuid(), 'e5555551-5551-4551-8551-555555555551', 'HEADING', 2, jsonb_build_object('text', $$Mengapa Etiket Email Itu Penting$$)),
(gen_random_uuid(), 'e5555551-5551-4551-8551-555555555551', 'PARAGRAPH', 3, jsonb_build_object('text', $$Berbeda dengan chat, email bersifat formal, tercatat, dan sering diteruskan ke banyak orang. Satu email yang rapi menunjukkan Anda menghargai waktu penerima dan berpikir sistematis. Sebaliknya, email yang asal-asalan membuat penerima enggan membalas atau bahkan mencoret nama Anda dari daftar kandidat.$$)),
(gen_random_uuid(), 'e5555551-5551-4551-8551-555555555551', 'HEADING', 4, jsonb_build_object('text', $$Persiapan: Alamat dan Tanda Tangan$$)),
(gen_random_uuid(), 'e5555551-5551-4551-8551-555555555551', 'LIST', 5, jsonb_build_object('items', $$["Gunakan alamat email yang sopan: nama asli, bukan nama panggilan seperti \"gamerkita123\"", "Buat tanda tangan email berisi nama lengkap, jabatan/institusi, dan nomor kontak", "Siapkan template sapaan formal: \"Yth. Bapak/Ibu ...\" dan penutup \"Hormat saya\""]$$)),
(gen_random_uuid(), 'e5555551-5551-4551-8551-555555555551', 'HEADING', 6, jsonb_build_object('text', $$Langkah 1: Tulis Subjek yang Jelas$$)),
(gen_random_uuid(), 'e5555551-5551-4551-8551-555555555551', 'PARAGRAPH', 7, jsonb_build_object('text', $$Subjek menentukan apakah email Anda dibuka atau terabaikan. Tulis subjek yang spesifik dan informatif, misalnya "Lamaran Magang Desain Grafis — Nama Anda" atau "Permintaan Revisi Proposal, 13 Oktober 2026". Hindari subjek kosong atau hanya "Halo" dan "Penting".$$)),
(gen_random_uuid(), 'e5555551-5551-4551-8551-555555555551', 'HEADING', 8, jsonb_build_object('text', $$Langkah 2: Struktur Isi yang Rapi$$)),
(gen_random_uuid(), 'e5555551-5551-4551-8551-555555555551', 'LIST', 9, jsonb_build_object('items', $$["Sapaan pembuka yang sesuai: \"Yth. Bapak/Ibu [Nama],\" atau \"Selamat pagi, Bapak/Ibu ...\"", "Paragraf pertama: perkenalkan diri dan maksud email dalam 1–2 kalimat", "Isi utama: sampaikan inti pesan secara berurutan; gunakan penomoran jika ada beberapa poin", "Penutup: tulis harapan/tindak lanjut, misalnya \"Mohon konfirmasinya\" atau \"Terima kasih atas perhatiannya\"", "Lampiran: sebutkan nama file di badan email, misalnya \"Terlampir CV saya dalam format PDF\""]$$)),
(gen_random_uuid(), 'e5555551-5551-4551-8551-555555555551', 'HEADING', 10, jsonb_build_object('text', $$Risiko dan Kesalahan yang Harus Dihindari$$)),
(gen_random_uuid(), 'e5555551-5551-4551-8551-555555555551', 'LIST', 11, jsonb_build_object('items', $$["Mengirim email tanpa membaca ulang: kesalahan ketik pada nama penerima sangat fatal", "Menggunakan huruf KAPITAL SEMUA: terbaca seperti berteriak", "Melampirkan file besar tanpa menyebutkannya: gunakan PDF dan beri nama file yang jelas", "Menekan \"Reply All\" sembarangan: periksa kembali daftar penerima sebelum mengirim", "Membalas dengan emosi: jika kesal, tulis dulu sebagai draft lalu baca ulang setelah tenang"]$$));

-- --------------------------------------------------------------------------
-- 2. TUT-KESEHATAN15-001 — "Sariawan: Penyebab dan Obat" (12 block)
-- Node: R1.D4 Kesehatan & Mental (b5555555-5555-5555-5555-555555555555)
-- --------------------------------------------------------------------------
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_name, creator_principal_id, access_level, status, created_by, updated_by)
VALUES (
  'e5555552-5552-4552-8552-555555555552',
  'TUT-KESEHATAN15-001',
  'b5555555-5555-5555-5555-555555555555',
  'Sariawan: Penyebab dan Obat',
  'sariawan-penyebab-dan-obat',
  'Mengenal penyebab sariawan, cara merawat di rumah, dan kapan harus ke dokter. Informasi umum, bukan pengganti nasihat medis.',
  'id', 6, 'Madevi', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'MEMBER', 'DRAFT',
  'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a'
) ON CONFLICT (business_code) DO NOTHING;

DELETE FROM madevi.article_blocks WHERE article_id = 'e5555552-5552-4552-8552-555555555552';

INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
(gen_random_uuid(), 'e5555552-5552-4552-8552-555555555552', 'HEADING', 0, jsonb_build_object('text', $$Masalah: Luka Kecil yang Sangat Mengganggu$$)),
(gen_random_uuid(), 'e5555552-5552-4552-8552-555555555552', 'PARAGRAPH', 1, jsonb_build_object('text', $$Sariawan adalah luka kecil berwarna putih kekuningan di dalam mulut — di lidah, bibir bagian dalam, atau pipi — yang membuat makan, minum, dan berbicara terasa perih. Umumnya sariawan sembuh sendiri dalam 7–14 hari, tetapi rasa nyerinya sering mengganggu aktivitas sehari-hari.$$)),
(gen_random_uuid(), 'e5555552-5552-4552-8552-555555555552', 'HEADING', 2, jsonb_build_object('text', $$Penyebab Sariawan$$)),
(gen_random_uuid(), 'e5555552-5552-4552-8552-555555555552', 'LIST', 3, jsonb_build_object('items', $$["Luka mekanis: tergigit lidah/pipi, sikat gigi terlalu keras, atau gigi tajam", "Stres dan kurang tidur: menurunkan daya tahan tubuh", "Kekurangan nutrisi: vitamin B12, zat besi, asam folat, atau zinc", "Iritasi makanan: makanan terlalu asam, pedas, atau panas", "Perubahan hormon dan kondisi tertentu seperti alergi atau gangguan pencernaan"]$$)),
(gen_random_uuid(), 'e5555552-5552-4552-8552-555555555552', 'HEADING', 4, jsonb_build_object('text', $$Perawatan di Rumah$$)),
(gen_random_uuid(), 'e5555552-5552-4552-8552-555555555552', 'LIST', 5, jsonb_build_object('items', $$["Berkumur air garam hangat (setengah sendok teh dalam segelas air) 2–3 kali sehari", "Hindari makanan pedas, asam, dan terlalu panas sampai luka membaik", "Jaga kebersihan mulut: sikat gigi lembut dan hindari pasta gigi berbusa berlebihan", "Cukupi cairan dan istirahat; kompres dingin bisa meredakan nyeri", "Obat oles sariawan bebas resep dapat dipakai sesuai aturan pada kemasan"]$$)),
(gen_random_uuid(), 'e5555552-5552-4552-8552-555555555552', 'HEADING', 6, jsonb_build_object('text', $$Langkah Mencegah Sariawan Kambuh$$)),
(gen_random_uuid(), 'e5555552-5552-4552-8552-555555555552', 'PARAGRAPH', 7, jsonb_build_object('text', $$Kelola stres dan cukupi tidur 7–8 jam sehari. Makan bergizi seimbang dengan cukup buah, sayur, dan protein. Jika Anda sering tergigit saat mengunyah, periksa posisi gigi ke dokter gigi — gigi yang tidak rata bisa menjadi penyebab sariawan berulang.$$)),
(gen_random_uuid(), 'e5555552-5552-4552-8552-555555555552', 'HEADING', 8, jsonb_build_object('text', $$Risiko: Jangan Sepelekan Jika...$$)),
(gen_random_uuid(), 'e5555552-5552-4552-8552-555555555552', 'LIST', 9, jsonb_build_object('items', $$["Sariawan tidak sembuh setelah 2–3 minggu", "Luka sangat besar, sangat banyak, atau berdarah", "Disertai demam tinggi atau sulit menelan", "Sariawan kambuh terus-menerus dalam waktu singkat"]$$)),
(gen_random_uuid(), 'e5555552-5552-4552-8552-555555555552', 'HEADING', 10, jsonb_build_object('text', $$Penyelesaian: Kapan ke Dokter$$)),
(gen_random_uuid(), 'e5555552-5552-4552-8552-555555555552', 'PARAGRAPH', 11, jsonb_build_object('text', $$Artikel ini adalah informasi umum dan bukan pengganti nasihat medis. Jika sariawan tidak kunjung sembuh atau menunjukkan tanda-tanda di atas, segera konsultasikan ke dokter atau dokter gigi untuk pemeriksaan lebih lanjut.$$));

-- --------------------------------------------------------------------------
-- 3. EXP-ANTROPOLOGI9-001 — "Suku Sasak: Tradisi Bau Nyale" (10 block)
-- Node: R2.D12 Sejarah & Peradaban (c8888888-8888-8888-8888-888888888888)
-- --------------------------------------------------------------------------
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_name, creator_principal_id, access_level, status, created_by, updated_by)
VALUES (
  'e5555553-5553-4553-8553-555555555553',
  'EXP-ANTROPOLOGI9-001',
  'c8888888-8888-8888-8888-888888888888',
  'Suku Sasak: Tradisi Bau Nyale',
  'suku-sasak-tradisi-bau-nyale',
  'Mengenal suku Sasak di Lombok dan tradisi Bau Nyale: perayaan menangkap cacing laut yang penuh legenda.',
  'id', 5, 'Madevi', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'MEMBER', 'DRAFT',
  'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a'
) ON CONFLICT (business_code) DO NOTHING;

DELETE FROM madevi.article_blocks WHERE article_id = 'e5555553-5553-4553-8553-555555555553';

INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
(gen_random_uuid(), 'e5555553-5553-4553-8553-555555555553', 'HEADING', 0, jsonb_build_object('text', $$Siapa Suku Sasak?$$)),
(gen_random_uuid(), 'e5555553-5553-4553-8553-555555555553', 'PARAGRAPH', 1, jsonb_build_object('text', $$Suku Sasak adalah penduduk asli Pulau Lombok, Nusa Tenggara Barat, dengan jumlah lebih dari 3 juta jiwa. Bahasa Sasak memiliki beberapa dialek, dan mayoritas masyarakatnya memeluk Islam sambil tetap melestarikan adat leluhur dalam kehidupan sehari-hari.$$)),
(gen_random_uuid(), 'e5555553-5553-4553-8553-555555555553', 'HEADING', 2, jsonb_build_object('text', $$Legenda Putri Mandalika$$)),
(gen_random_uuid(), 'e5555553-5553-4553-8553-555555555553', 'PARAGRAPH', 3, jsonb_build_object('text', $$Tradisi Bau Nyale lahir dari legenda Putri Mandalika, putri cantik yang diperebutkan banyak pangeran. Untuk menghindari perang, sang putri memilih menceburkan diri ke laut Pantai Seger. Masyarakat percaya tubuhnya berubah menjadi nyale — cacing laut berwarna-warni yang muncul setahun sekali.$$)),
(gen_random_uuid(), 'e5555553-5553-4553-8553-555555555553', 'HEADING', 4, jsonb_build_object('text', $$Apa Itu Bau Nyale?$$)),
(gen_random_uuid(), 'e5555553-5553-4553-8553-555555555553', 'PARAGRAPH', 5, jsonb_build_object('text', $$"Bau" berarti menangkap, "nyale" adalah cacing laut dari suku Palola yang muncul di perairan selatan Lombok setiap bulan Februari–Maret. Ribuan warga turun ke pantai pada dini hari untuk menangkap nyale dengan tangan atau jaring kecil, lalu memasak dan memakannya bersama keluarga.$$)),
(gen_random_uuid(), 'e5555553-5553-4553-8553-555555555553', 'HEADING', 6, jsonb_build_object('text', $$Makna bagi Masyarakat$$)),
(gen_random_uuid(), 'e5555553-5553-4553-8553-555555555553', 'LIST', 7, jsonb_build_object('items', $$["Pengorbanan: mengenang Putri Mandalika yang rela berkorban demi kedamaian", "Kesuburan: banyaknya nyale dipercaya menandakan panen yang baik tahun itu", "Kebersamaan: seluruh desa berkumpul di pantai, mempererat tali persaudaraan"]$$)),
(gen_random_uuid(), 'e5555553-5553-4553-8553-555555555553', 'HEADING', 8, jsonb_build_object('text', $$Bau Nyale Kini$$)),
(gen_random_uuid(), 'e5555553-5553-4553-8553-555555555553', 'PARAGRAPH', 9, jsonb_build_object('text', $$Kini Bau Nyale menjadi festival budaya tahunan yang menarik wisatawan dari dalam dan luar negeri, lengkap dengan pertunjukan seni dan peresean (tarung tongkat khas Sasak). Tradisi ini menunjukkan bagaimana legenda, kepercayaan, dan pariwisata bisa berjalan beriringan menjaga identitas sebuah suku bangsa.$$));

-- --------------------------------------------------------------------------
-- 4. EXP-KIMIA13-001 — "Polimer: Plastik di Sekitar Kita" (10 block)
-- Node: R2.D8 Kimia (c4444444-4444-4444-4444-444444444444)
-- --------------------------------------------------------------------------
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_name, creator_principal_id, access_level, status, created_by, updated_by)
VALUES (
  'e5555554-5554-4554-8554-555555555554',
  'EXP-KIMIA13-001',
  'c4444444-4444-4444-4444-444444444444',
  'Polimer: Plastik di Sekitar Kita',
  'polimer-plastik-di-sekitar-kita',
  'Apa itu polimer, jenis-jenis plastik, dan mengapa plastik sulit terurai? Penjelasan kimia yang mudah dipahami.',
  'id', 5, 'Madevi', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'MEMBER', 'DRAFT',
  'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a'
) ON CONFLICT (business_code) DO NOTHING;

DELETE FROM madevi.article_blocks WHERE article_id = 'e5555554-5554-4554-8554-555555555554';

INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
(gen_random_uuid(), 'e5555554-5554-4554-8554-555555555554', 'HEADING', 0, jsonb_build_object('text', $$Apa Itu Polimer?$$)),
(gen_random_uuid(), 'e5555554-5554-4554-8554-555555555554', 'PARAGRAPH', 1, jsonb_build_object('text', $$Polimer adalah molekul raksasa yang tersusun dari ribuan unit kecil berulang yang disebut monomer — seperti rantai panjang dari manik-manik yang sama. Kata "polimer" berasal dari bahasa Yunani: poly (banyak) dan meros (bagian). Plastik, karet, dan serat sintetis semuanya adalah polimer buatan manusia.$$)),
(gen_random_uuid(), 'e5555554-5554-4554-8554-555555555554', 'HEADING', 2, jsonb_build_object('text', $$Jenis-Jenis Plastik$$)),
(gen_random_uuid(), 'e5555554-5554-4554-8554-555555555554', 'LIST', 3, jsonb_build_object('items', $$["PET: botol minuman, ringan dan transparan", "HDPE: jeriken, botol sampo, kuat dan tahan bahan kimia", "PVC: pipa air dan kabel, kaku dan tahan lama", "LDPE: kantong plastik, lentur dan tipis", "PP: wadah makanan dan tutup botol, tahan panas"]$$)),
(gen_random_uuid(), 'e5555554-5554-4554-8554-555555555554', 'HEADING', 4, jsonb_build_object('text', $$Polimer Alami di Sekitar Kita$$)),
(gen_random_uuid(), 'e5555554-5554-4554-8554-555555555554', 'PARAGRAPH', 5, jsonb_build_object('text', $$Polimer bukan hanya buatan pabrik. Selulosa di kayu dan kapas, protein di rambut dan kuku, pati di nasi, hingga DNA di dalam sel tubuh kita — semuanya polimer alami. Alam sudah "menemukan" polimer miliaran tahun sebelum manusia membuat plastik pertama.$$)),
(gen_random_uuid(), 'e5555554-5554-4554-8554-555555555554', 'HEADING', 6, jsonb_build_object('text', $$Mengapa Plastik Sulit Terurai?$$)),
(gen_random_uuid(), 'e5555554-5554-4554-8554-555555555554', 'PARAGRAPH', 7, jsonb_build_object('text', $$Rantai karbon plastik sangat panjang dan kuat, sehingga mikroorganisme tidak bisa memutusnya dengan mudah. Kantong plastik bisa bertahan 10–20 tahun, botol plastik hingga 450 tahun di alam. Inilah alasan sampah plastik menumpuk dan menjadi masalah lingkungan global.$$)),
(gen_random_uuid(), 'e5555554-5554-4554-8554-555555555554', 'HEADING', 8, jsonb_build_object('text', $$Solusi: Bijak Memakai Plastik$$)),
(gen_random_uuid(), 'e5555554-5554-4554-8554-555555555554', 'LIST', 9, jsonb_build_object('items', $$["Kurangi: bawa tas belanja dan botol minum sendiri", "Gunakan ulang: manfaatkan wadah plastik berkali-kali", "Daur ulang: pilah sampah plastik sesuai jenisnya", "Ilmuwan juga mengembangkan bioplastik dari pati dan selulosa yang lebih mudah terurai"]$$));

-- --------------------------------------------------------------------------
-- 5. SCH-SMP-ING5-001 — "Bahasa Inggris Kelas 9: Report Text" (12 block)
-- Node: R3.D15 SMP (d4444444-4444-4444-4444-444444444444)
-- --------------------------------------------------------------------------
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_name, creator_principal_id, access_level, status, created_by, updated_by)
VALUES (
  'e5555555-5555-4555-8555-555555555555',
  'SCH-SMP-ING5-001',
  'd4444444-4444-4444-4444-444444444444',
  'Bahasa Inggris Kelas 9: Report Text',
  'bahasa-inggris-kelas-9-report-text',
  'Materi report text untuk kelas 9: pengertian, struktur, ciri kebahasaan, contoh, latihan, dan kunci jawaban.',
  'id', 6, 'Madevi', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'MEMBER', 'DRAFT',
  'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a'
) ON CONFLICT (business_code) DO NOTHING;

DELETE FROM madevi.article_blocks WHERE article_id = 'e5555555-5555-4555-8555-555555555555';

INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
(gen_random_uuid(), 'e5555555-5555-4555-8555-555555555555', 'HEADING', 0, jsonb_build_object('text', $$Tujuan Pembelajaran$$)),
(gen_random_uuid(), 'e5555555-5555-4555-8555-555555555555', 'PARAGRAPH', 1, jsonb_build_object('text', $$Setelah mempelajari materi ini, kamu diharapkan mampu: (1) menjelaskan pengertian dan tujuan report text, (2) mengidentifikasi struktur report text, (3) mengenali ciri kebahasaan report text, dan (4) menulis report text sederhana tentang hewan atau benda.$$)),
(gen_random_uuid(), 'e5555555-5555-4555-8555-555555555555', 'HEADING', 2, jsonb_build_object('text', $$Pengertian Report Text$$)),
(gen_random_uuid(), 'e5555555-5555-4555-8555-555555555555', 'PARAGRAPH', 3, jsonb_build_object('text', $$Report text adalah teks yang mendeskripsikan sesuatu secara umum berdasarkan fakta — misalnya hewan, tumbuhan, atau fenomena alam. Bedanya dengan descriptive text: descriptive text membahas satu objek spesifik ("my cat"), sedangkan report text membahas kelompok secara umum ("cats").$$)),
(gen_random_uuid(), 'e5555555-5555-4555-8555-555555555555', 'HEADING', 4, jsonb_build_object('text', $$Struktur Report Text$$)),
(gen_random_uuid(), 'e5555555-5555-4555-8555-555555555555', 'LIST', 5, jsonb_build_object('items', $$["General classification: pengenalan umum tentang topik, misalnya \"Whales are the largest mammals in the world.\"", "Description: penjelasan rinci tentang ciri, habitat, kebiasaan, atau bagian-bagiannya"]$$)),
(gen_random_uuid(), 'e5555555-5555-4555-8555-555555555555', 'HEADING', 6, jsonb_build_object('text', $$Ciri Kebahasaan$$)),
(gen_random_uuid(), 'e5555555-5555-4555-8555-555555555555', 'LIST', 7, jsonb_build_object('items', $$["Menggunakan Simple Present Tense: \"A kangaroo lives in Australia.\"", "Kata benda umum, bukan spesifik: \"dolphins\", bukan \"my dolphin\"", "Kata kerja penghubung (linking verbs): is, are, has, have", "Istilah teknis sesuai topik: \"mammal\", \"habitat\", \"nocturnal\""]$$)),
(gen_random_uuid(), 'e5555555-5555-4555-8555-555555555555', 'HEADING', 8, jsonb_build_object('text', $$Contoh: Komodo Dragons$$)),
(gen_random_uuid(), 'e5555555-5555-4555-8555-555555555555', 'PARAGRAPH', 9, jsonb_build_object('text', $$"Komodo dragons are the largest lizards in the world. They live on Komodo Island in Indonesia. Komodo dragons have strong claws and sharp teeth. They are carnivores and can eat large prey such as deer. A Komodo dragon can grow up to 3 meters long."$$)),
(gen_random_uuid(), 'e5555555-5555-4555-8555-555555555555', 'HEADING', 10, jsonb_build_object('text', $$Latihan$$)),
(gen_random_uuid(), 'e5555555-5555-4555-8555-555555555555', 'LIST', 11, jsonb_build_object('items', $$["1. Apa perbedaan utama report text dan descriptive text?", "2. Sebutkan dua bagian struktur report text!", "3. Tulis satu kalimat general classification tentang \"elephants\"!", "4. Ubah kalimat ini menjadi ciri report text: \"My rabbit is very cute.\"", "5. Tulis report text singkat (3–4 kalimat) tentang hewan favoritmu!"]$$));

-- --------------------------------------------------------------------------
-- 6. SCH-SD-MAT13-001 — "Matematika Kelas 3: Waktu" (12 block)
-- Node: R3.D14 SD (d3333333-3333-3333-3333-333333333333)
-- --------------------------------------------------------------------------
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_name, creator_principal_id, access_level, status, created_by, updated_by)
VALUES (
  'e5555556-5556-4556-8556-555555555556',
  'SCH-SD-MAT13-001',
  'd3333333-3333-3333-3333-333333333333',
  'Matematika Kelas 3: Waktu',
  'matematika-kelas-3-waktu',
  'Materi waktu untuk kelas 3 SD: membaca jam, satuan waktu, lama kegiatan, latihan, dan kunci jawaban.',
  'id', 6, 'Madevi', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'MEMBER', 'DRAFT',
  'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a'
) ON CONFLICT (business_code) DO NOTHING;

DELETE FROM madevi.article_blocks WHERE article_id = 'e5555556-5556-4556-8556-555555555556';

INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
(gen_random_uuid(), 'e5555556-5556-4556-8556-555555555556', 'HEADING', 0, jsonb_build_object('text', $$Tujuan Pembelajaran$$)),
(gen_random_uuid(), 'e5555556-5556-4556-8556-555555555556', 'PARAGRAPH', 1, jsonb_build_object('text', $$Setelah belajar materi ini, kamu bisa: (1) membaca jam dan menuliskannya, (2) mengenal satuan waktu: jam, menit, detik, (3) menghitung lama suatu kegiatan, dan (4) menyelesaikan soal cerita tentang waktu.$$)),
(gen_random_uuid(), 'e5555556-5556-4556-8556-555555555556', 'HEADING', 2, jsonb_build_object('text', $$Membaca Jam$$)),
(gen_random_uuid(), 'e5555556-5556-4556-8556-555555555556', 'PARAGRAPH', 3, jsonb_build_object('text', $$Jarum pendek menunjukkan jam, jarum panjang menunjukkan menit. Jika jarum pendek di angka 7 dan jarum panjang di angka 12, berarti pukul 07.00. Jika jarum panjang di angka 6, menitnya adalah 30 — misalnya jarum pendek di antara 7 dan 8, jarum panjang di 6, berarti pukul 07.30.$$)),
(gen_random_uuid(), 'e5555556-5556-4556-8556-555555555556', 'HEADING', 4, jsonb_build_object('text', $$Satuan Waktu$$)),
(gen_random_uuid(), 'e5555556-5556-4556-8556-555555555556', 'LIST', 5, jsonb_build_object('items', $$["1 jam = 60 menit", "1 menit = 60 detik", "1 jam = 3.600 detik", "1 hari = 24 jam", "1 minggu = 7 hari"]$$)),
(gen_random_uuid(), 'e5555556-5556-4556-8556-555555555556', 'HEADING', 6, jsonb_build_object('text', $$Menghitung Lama Kegiatan$$)),
(gen_random_uuid(), 'e5555556-5556-4556-8556-555555555556', 'PARAGRAPH', 7, jsonb_build_object('text', $$Lama kegiatan = waktu selesai − waktu mulai. Contoh: Ani mulai belajar pukul 19.00 dan selesai pukul 20.30. Lama belajar Ani = 20.30 − 19.00 = 1 jam 30 menit.$$)),
(gen_random_uuid(), 'e5555556-5556-4556-8556-555555555556', 'HEADING', 8, jsonb_build_object('text', $$Contoh Soal Cerita$$)),
(gen_random_uuid(), 'e5555556-5556-4556-8556-555555555556', 'PARAGRAPH', 9, jsonb_build_object('text', $$Budi berangkat ke sekolah pukul 06.30 dan tiba pukul 07.00. Berapa lama perjalanan Budi? Jawab: 07.00 − 06.30 = 30 menit. Jadi, perjalanan Budi memakan waktu 30 menit.$$)),
(gen_random_uuid(), 'e5555556-5556-4556-8556-555555555556', 'HEADING', 10, jsonb_build_object('text', $$Latihan$$)),
(gen_random_uuid(), 'e5555556-5556-4556-8556-555555555556', 'LIST', 11, jsonb_build_object('items', $$["1. Tuliskan waktu yang ditunjukkan jika jarum pendek di 9 dan jarum panjang di 12!", "2. 2 jam = ... menit", "3. Ibu memasak mulai pukul 10.00 dan selesai pukul 11.15. Berapa lama Ibu memasak?", "Kunci: 1. Pukul 09.00 | 2. 120 menit | 3. 1 jam 15 menit"]$$));

COMMIT;
