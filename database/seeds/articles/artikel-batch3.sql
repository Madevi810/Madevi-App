-- Artikel konten batch 3 — 2026-10-13
-- 4 artikel: 1 Tutorial + 2 Explore + 1 School

-- ============ ARTIKEL 1: TUT-CV-001 ============
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, status, created_by, updated_by)
VALUES (
  'a4100001-0000-4000-8000-000000000001',
  'TUT-CV-001',
  'b3333333-3333-3333-3333-333333333333',
  'Cara Membuat CV yang Dilirik HRD',
  'cara-membuat-cv-yang-dilirik-hrd',
  'Panduan menyusun CV yang lolos seleksi 7 detik HRD: dari persiapan data, struktur, hingga kesalahan yang harus dihindari.',
  'id', 6, 'DRAFT', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
('b4100001-0000-4000-8000-000000000001', 'a4100001-0000-4000-8000-000000000001', 'HEADING', 1, jsonb_build_object('text', $$Masalah: CV Bagus Tapi Tak Pernah Dipanggil$$)),
('b4100001-0000-4000-8000-000000000002', 'a4100001-0000-4000-8000-000000000001', 'PARAGRAPH', 2, jsonb_build_object('text', $$Kamu sudah melamar puluhan lowongan, tapi tidak satu pun panggilan interview. Bukan berarti kamu tidak kompeten — kemungkinan besar CV-mu gugur pada "seleksi 7 detik", pemindaian awal yang dilakukan HRD sebelum memutuskan CV mana yang dibaca lebih lanjut.$$)),
('b4100001-0000-4000-8000-000000000003', 'a4100001-0000-4000-8000-000000000001', 'HEADING', 3, jsonb_build_object('text', $$Penjelasan: Cara HRD Membaca CV$$)),
('b4100001-0000-4000-8000-000000000004', 'a4100001-0000-4000-8000-000000000001', 'PARAGRAPH', 4, jsonb_build_object('text', $$HRD rata-rata hanya meluangkan 6–8 detik untuk pemindaian awal sebuah CV. Pada detik-detik itu mereka mencari tiga hal: relevansi dengan posisi yang dibuka, pengalaman terbaru, dan kejelasan struktur. CV yang lolos saringan awal inilah yang kemudian dibaca secara detail.$$)),
('b4100001-0000-4000-8000-000000000005', 'a4100001-0000-4000-8000-000000000001', 'HEADING', 5, jsonb_build_object('text', $$Persiapan: Data yang Perlu Dikumpulkan$$)),
('b4100001-0000-4000-8000-000000000006', 'a4100001-0000-4000-8000-000000000001', 'LIST', 6, jsonb_build_object('items', ARRAY[$$Data pribadi dan kontak aktif (email + nomor HP)$$, $$Riwayat pendidikan, urut dari yang terbaru$$, $$Pengalaman kerja, magang, atau organisasi — catat angka pencapaiannya$$, $$Keterampilan teknis dan bahasa yang dikuasai$$, $$Link portofolio atau profil LinkedIn bila ada$$])),
('b4100001-0000-4000-8000-000000000007', 'a4100001-0000-4000-8000-000000000001', 'HEADING', 7, jsonb_build_object('text', $$Langkah Menyusun CV$$)),
('b4100001-0000-4000-8000-000000000008', 'a4100001-0000-4000-8000-000000000001', 'LIST', 8, jsonb_build_object('items', ARRAY[$$1. Tulis ringkasan profil 2–3 kalimat yang menyebut posisi target dan keunggulan utamamu$$, $$2. Susun pengalaman dengan pola: peran — perusahaan — periode, lalu 2–3 bullet pencapaian berangka (mis. "menaikkan penjualan 20%")$$, $$3. Cantumkan skill yang memuat kata kunci dari iklan lowongan$$, $$4. Batasi 1–2 halaman, gunakan font yang mudah dibaca, simpan sebagai PDF$$, $$5. Beri nama file yang profesional, mis. CV_Nama_Posisi.pdf$$])),
('b4100001-0000-4000-8000-000000000009', 'a4100001-0000-4000-8000-000000000001', 'HEADING', 9, jsonb_build_object('text', $$Risiko: Kesalahan yang Membuat CV Dibuang$$)),
('b4100001-0000-4000-8000-000000000010', 'a4100001-0000-4000-8000-000000000001', 'PARAGRAPH', 10, jsonb_build_object('text', $$Hindari foto yang tidak profesional, typo sekecil apa pun, dan CV generik yang dikirim sama untuk semua lamaran. Jangan memalsukan data — background check dapat membatalkan tawaran yang sudah di tangan. Desain yang terlalu ramai juga berisiko tidak terbaca oleh sistem ATS (Applicant Tracking System) perusahaan.$$)),
('b4100001-0000-4000-8000-000000000011', 'a4100001-0000-4000-8000-000000000001', 'HEADING', 11, jsonb_build_object('text', $$Penyelesaian: Dari CV ke Panggilan Interview$$)),
('b4100001-0000-4000-8000-000000000012', 'a4100001-0000-4000-8000-000000000001', 'PARAGRAPH', 12, jsonb_build_object('text', $$Sesuaikan CV untuk setiap lamaran — meluangkan 10–15 menit untuk tailoring jauh lebih efektif daripada mengirim 50 lamaran massal yang sama. Minta orang lain memeriksa ulang CV-mu, lalu kirim dan catat setiap lamaran beserta tindak lanjutnya di satu daftar.$$))
ON CONFLICT (id) DO NOTHING;

-- ============ ARTIKEL 2: EXP-FISIKA-001 ============
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, status, created_by, updated_by)
VALUES (
  'a4200001-0000-4000-8000-000000000001',
  'EXP-FISIKA-001',
  'c3333333-3333-3333-3333-333333333333',
  'Hukum Newton: Fondasi Mekanika Klasik',
  'hukum-newton-fondasi-mekanika-klasik',
  'Tiga hukum gerak Newton yang menjadi fondasi mekanika klasik: kelembaman, F = m × a, dan aksi-reaksi — lengkap dengan contoh penerapannya.',
  'id', 7, 'DRAFT', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
('b4200001-0000-4000-8000-000000000001', 'a4200001-0000-4000-8000-000000000001', 'HEADING', 1, jsonb_build_object('text', $$Tiga Hukum yang Menggerakkan Dunia$$)),
('b4200001-0000-4000-8000-000000000002', 'a4200001-0000-4000-8000-000000000001', 'PARAGRAPH', 2, jsonb_build_object('text', $$Pada tahun 1687 Isaac Newton menerbitkan Philosophiae Naturalis Principia Mathematica yang memuat tiga hukum gerak — fondasi mekanika klasik yang menjelaskan mengapa benda bergerak, berhenti, atau berubah arah. Tiga abad kemudian, hukum ini masih dipakai insinyur untuk merancang jembatan, mobil, hingga roket.$$)),
('b4200001-0000-4000-8000-000000000003', 'a4200001-0000-4000-8000-000000000001', 'HEADING', 3, jsonb_build_object('text', $$Hukum I: Kelembaman (Inersia)$$)),
('b4200001-0000-4000-8000-000000000004', 'a4200001-0000-4000-8000-000000000001', 'PARAGRAPH', 4, jsonb_build_object('text', $$"Setiap benda akan mempertahankan keadaan diam atau bergerak lurus beraturan, kecuali ada gaya yang bekerja padanya." Inilah mengapa tubuhmu terdorong ke depan saat bus mengerem mendadak: tubuh ingin mempertahankan geraknya. Sabuk pengaman adalah penerapan langsung hukum ini — ia memberi gaya yang menghentikan tubuhmu secara terkendali.$$)),
('b4200001-0000-4000-8000-000000000005', 'a4200001-0000-4000-8000-000000000001', 'HEADING', 5, jsonb_build_object('text', $$Hukum II: F = m × a$$)),
('b4200001-0000-4000-8000-000000000006', 'a4200001-0000-4000-8000-000000000001', 'PARAGRAPH', 6, jsonb_build_object('text', $$Percepatan sebuah benda berbanding lurus dengan gaya total yang bekerja dan berbanding terbalik dengan massanya: F = m × a. Contoh hitungan: mendorong gerobak 20 kg dengan gaya 40 N menghasilkan percepatan a = F/m = 40/20 = 2 m/s². Mendorong gerobak yang dua kali lebih berat dengan gaya yang sama hanya menghasilkan setengah percepatan.$$)),
('b4200001-0000-4000-8000-000000000007', 'a4200001-0000-4000-8000-000000000001', 'HEADING', 7, jsonb_build_object('text', $$Hukum III: Aksi–Reaksi$$)),
('b4200001-0000-4000-8000-000000000008', 'a4200001-0000-4000-8000-000000000001', 'PARAGRAPH', 8, jsonb_build_object('text', $$"Untuk setiap aksi selalu ada reaksi yang sama besar dan berlawanan arah." Roket melesat ke atas karena menyemburkan gas panas ke bawah; saat kamu melompat, kakimu mendorong tanah ke bawah dan tanah mendorongmu ke atas. Pasangan gaya ini selalu bekerja pada dua benda yang berbeda — itulah sebabnya keduanya tidak saling meniadakan.$$)),
('b4200001-0000-4000-8000-000000000009', 'a4200001-0000-4000-8000-000000000001', 'HEADING', 9, jsonb_build_object('text', $$Penerapan dalam Kehidupan Sehari-hari$$)),
('b4200001-0000-4000-8000-000000000010', 'a4200001-0000-4000-8000-000000000001', 'PARAGRAPH', 10, jsonb_build_object('text', $$Airbag mobil bekerja atas dasar Hukum I: ia memperlambat tubuh secara bertahap agar gaya tumbukan kecil. Helm menerapkan Hukum II: busa helm memperpanjang waktu tumbukan sehingga gaya yang diterima kepala mengecil. Berenang dan mendayung adalah Hukum III yang hidup. Ketiga hukum ini bekerja serentak dalam hampir setiap gerak yang kamu lakukan.$$))
ON CONFLICT (id) DO NOTHING;

-- ============ ARTIKEL 3: EXP-KIMIA-001 ============
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, status, created_by, updated_by)
VALUES (
  'a4300001-0000-4000-8000-000000000001',
  'EXP-KIMIA-001',
  'c4444444-4444-4444-4444-444444444444',
  'Tabel Periodik: Peta Unsur Kimia',
  'tabel-periodik-peta-unsur-kimia',
  'Mengenal tabel periodik unsur: struktur golongan dan periode, logam-nonlogam-metaloid, tren periodik, dan unsur penting dalam kehidupan.',
  'id', 7, 'DRAFT', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
('b4300001-0000-4000-8000-000000000001', 'a4300001-0000-4000-8000-000000000001', 'HEADING', 1, jsonb_build_object('text', $$Peta 118 Unsur Pembentuk Alam Semesta$$)),
('b4300001-0000-4000-8000-000000000002', 'a4300001-0000-4000-8000-000000000001', 'PARAGRAPH', 2, jsonb_build_object('text', $$Tabel periodik disusun oleh Dmitri Mendeleev pada tahun 1869 berdasarkan kenaikan massa atom dan kemiripan sifat unsur. Ia bahkan berani mengosongkan beberapa kotak untuk unsur yang belum ditemukan — dan prediksinya terbukti tepat ketika unsur-unsur itu ditemukan kemudian. Kini tabel memuat 118 unsur, dari hidrogen (H) hingga oganeson (Og).$$)),
('b4300001-0000-4000-8000-000000000003', 'a4300001-0000-4000-8000-000000000001', 'HEADING', 3, jsonb_build_object('text', $$Struktur: Golongan dan Periode$$)),
('b4300001-0000-4000-8000-000000000004', 'a4300001-0000-4000-8000-000000000001', 'PARAGRAPH', 4, jsonb_build_object('text', $$Kolom vertikal disebut golongan (ada 18 golongan): unsur-unsur segolongan memiliki sifat kimia yang mirip karena jumlah elektron valensinya sama. Baris horizontal disebut periode (ada 7 periode): menunjukkan jumlah kulit elektron suatu atom. Contoh: natrium (Na) dan kalium (K) sama-sama golongan 1 — keduanya logam lunak yang sangat reaktif terhadap air.$$)),
('b4300001-0000-4000-8000-000000000005', 'a4300001-0000-4000-8000-000000000001', 'HEADING', 5, jsonb_build_object('text', $$Logam, Nonlogam, dan Metaloid$$)),
('b4300001-0000-4000-8000-000000000006', 'a4300001-0000-4000-8000-000000000001', 'PARAGRAPH', 6, jsonb_build_object('text', $$Sebagian besar unsur adalah logam (bagian kiri dan tengah tabel): menghantarkan listrik dan panas, serta dapat ditempa — contohnya besi dan tembaga. Nonlogam (kanan atas tabel) umumnya isolator dan rapuh, seperti oksigen dan belerang. Di garis batas keduanya ada metaloid seperti silikon dan germanium yang sifatnya di antara keduanya — silikon adalah jantung industri semikonduktor.$$)),
('b4300001-0000-4000-8000-000000000007', 'a4300001-0000-4000-8000-000000000001', 'HEADING', 7, jsonb_build_object('text', $$Tren Periodik: Pola yang Teratur$$)),
('b4300001-0000-4000-8000-000000000008', 'a4300001-0000-4000-8000-000000000001', 'PARAGRAPH', 8, jsonb_build_object('text', $$Jari-jari atom mengecil dari kiri ke kanan dalam satu periode karena tarikan inti atom bertambah, dan membesar dari atas ke bawah karena kulit elektron bertambah. Elektronegativitas — kemampuan atom menarik elektron — terbesar pada fluor (F) dan terkecil pada fransium (Fr). Berkat tren inilah sifat suatu unsur dapat diprediksi bahkan tanpa eksperimen langsung.$$)),
('b4300001-0000-4000-8000-000000000009', 'a4300001-0000-4000-8000-000000000001', 'HEADING', 9, jsonb_build_object('text', $$Unsur Penting dalam Kehidupan$$)),
('b4300001-0000-4000-8000-000000000010', 'a4300001-0000-4000-8000-000000000001', 'PARAGRAPH', 10, jsonb_build_object('text', $$Oksigen (O) untuk bernapas, karbon (C) sebagai fondasi seluruh molekul kehidupan, kalsium (Ca) pembentuk tulang dan gigi, besi (Fe) pengangkut oksigen dalam darah, silikon (Si) untuk chip komputer, dan litium (Li) untuk baterai HP-mu. Hanya enam unsur ini saja sudah menopang tubuhmu sekaligus teknologimu.$$))
ON CONFLICT (id) DO NOTHING;

-- ============ ARTIKEL 4: SCH-SMP-001 ============
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, status, created_by, updated_by)
VALUES (
  'a4400001-0000-4000-8000-000000000001',
  'SCH-SMP-001',
  'd4444444-4444-4444-4444-444444444444',
  'Aljabar Dasar Kelas 7: Variabel dan Persamaan',
  'aljabar-dasar-kelas-7-variabel-persamaan',
  'Materi aljabar kelas 7 SMP: mengenal variabel, koefisien, konstanta, suku sejenis, dan menyelesaikan persamaan linear satu variabel — lengkap dengan latihan dan kunci jawaban.',
  'id', 8, 'DRAFT', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
('b4400001-0000-4000-8000-000000000001', 'a4400001-0000-4000-8000-000000000001', 'HEADING', 1, jsonb_build_object('text', $$Tujuan Pembelajaran$$)),
('b4400001-0000-4000-8000-000000000002', 'a4400001-0000-4000-8000-000000000001', 'PARAGRAPH', 2, jsonb_build_object('text', $$Setelah mempelajari materi ini kamu diharapkan mampu: (1) menjelaskan pengertian variabel, konstanta, dan koefisien; (2) mengidentifikasi suku-suku yang sejenis; (3) menyelesaikan persamaan linear satu variabel dengan langkah yang benar.$$)),
('b4400001-0000-4000-8000-000000000003', 'a4400001-0000-4000-8000-000000000001', 'HEADING', 3, jsonb_build_object('text', $$Mengenal Variabel, Konstanta, dan Koefisien$$)),
('b4400001-0000-4000-8000-000000000004', 'a4400001-0000-4000-8000-000000000001', 'PARAGRAPH', 4, jsonb_build_object('text', $$Variabel adalah lambang pengganti suatu bilangan yang nilainya belum diketahui, biasanya berupa huruf seperti x, y, atau a. Konstanta adalah bilangan tetap, misalnya angka 5 pada bentuk 3x + 5. Koefisien adalah bilangan yang menempel pada variabel: pada bentuk 3x, koefisien dari x adalah 3.$$)),
('b4400001-0000-4000-8000-000000000005', 'a4400001-0000-4000-8000-000000000001', 'HEADING', 5, jsonb_build_object('text', $$Suku dan Suku Sejenis$$)),
('b4400001-0000-4000-8000-000000000006', 'a4400001-0000-4000-8000-000000000001', 'PARAGRAPH', 6, jsonb_build_object('text', $$Suku adalah bagian dari bentuk aljabar yang dipisahkan oleh tanda tambah atau kurang. Contoh: bentuk 4x + 2y − 7 memiliki tiga suku, yaitu 4x, 2y, dan −7. Suku sejenis adalah suku-suku yang variabel dan pangkatnya sama, misalnya 5x dan −2x — keduanya dapat dijumlahkan menjadi 3x. Namun 5x dan 5y TIDAK sejenis sehingga tidak dapat digabungkan.$$)),
('b4400001-0000-4000-8000-000000000007', 'a4400001-0000-4000-8000-000000000001', 'HEADING', 7, jsonb_build_object('text', $$Menyelesaikan Persamaan Linear Satu Variabel$$)),
('b4400001-0000-4000-8000-000000000008', 'a4400001-0000-4000-8000-000000000001', 'PARAGRAPH', 8, jsonb_build_object('text', $$Contoh: selesaikan 2x + 5 = 15. Langkah 1 — pindahkan konstanta: kurangi kedua ruas dengan 5 sehingga 2x = 10. Langkah 2 — bagi kedua ruas dengan koefisien x: x = 10 ÷ 2 = 5. Pemeriksaan: substitusikan x = 5 ke persamaan awal, 2(5) + 5 = 15, benar. Prinsipnya sederhana: apa pun yang dilakukan pada ruas kiri harus dilakukan juga pada ruas kanan.$$)),
('b4400001-0000-4000-8000-000000000009', 'a4400001-0000-4000-8000-000000000001', 'HEADING', 9, jsonb_build_object('text', $$Latihan Soal$$)),
('b4400001-0000-4000-8000-000000000010', 'a4400001-0000-4000-8000-000000000001', 'LIST', 10, jsonb_build_object('items', ARRAY[$$1. Tentukan koefisien, variabel, dan konstanta dari bentuk aljabar 7a − 4b + 9.$$ , $$2. Sederhanakan bentuk aljabar berikut: 6x + 3y − 2x + 5y.$$ , $$3. Selesaikan persamaan: 3x − 7 = 11.$$])),
('b4400001-0000-4000-8000-000000000011', 'a4400001-0000-4000-8000-000000000001', 'HEADING', 11, jsonb_build_object('text', $$Kunci Jawaban$$)),
('b4400001-0000-4000-8000-000000000012', 'a4400001-0000-4000-8000-000000000001', 'PARAGRAPH', 12, jsonb_build_object('text', $$1. Koefisien: 7 (untuk a) dan −4 (untuk b); variabel: a dan b; konstanta: 9. 2. Kelompokkan suku sejenis: 6x − 2x = 4x dan 3y + 5y = 8y, hasilnya 4x + 8y. 3. Tambah 7 ke kedua ruas: 3x = 18, lalu bagi 3: x = 6. Cek: 3(6) − 7 = 11, benar.$$))
ON CONFLICT (id) DO NOTHING;
