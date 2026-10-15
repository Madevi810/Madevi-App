-- Artikel konten Madevi batch 6 — 2026-10-13
-- Owner principal: f7125028-187e-44e0-b95b-88b69b8d5c9a
-- Node: dipilih dari query 48 node taksonomi
-- CATATAN: artikel bertopik kesehatan mental bersifat edukasi umum, bukan pengganti bantuan profesional.

-- ============ 1. TUT-MENTAL-001 — Overthinking (node D4 b5555555) ============
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, status, created_by, updated_by)
VALUES ('b6000001-0000-0000-0000-000000000001', 'TUT-MENTAL-001', 'b5555555-5555-5555-5555-555555555555',
'Cara Mengatasi Overthinking: Teknik Praktis yang Bisa Dilakukan Hari Ini', 'cara-mengatasi-overthinking-teknik-praktis',
'Panduan praktis mengatasi overthinking: mengenali siklusnya, teknik grounding, dan langkah harian yang masuk akal.',
'id', 8, 'DRAFT', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (id) DO NOTHING;

INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
(gen_random_uuid(), 'b6000001-0000-0000-0000-000000000001', 'HEADING', 1, jsonb_build_object('text', $$Masalah: Pikiran Terus Berputar$$)),
(gen_random_uuid(), 'b6000001-0000-0000-0000-000000000001', 'PARAGRAPH', 2, jsonb_build_object('text', $$Overthinking adalah kebiasaan memutar ulang kejadian atau membayangkan skenario buruk berulang-ulang tanpa keputusan. Ciri umum: sulit tidur karena mikir, replay percakapan berjam-jam, dan sulit memulai tugas karena takut salah. Wajar dialami siapa saja; masalah bila mengganggu aktivitas harian selama berminggu-minggu.$$)),
(gen_random_uuid(), 'b6000001-0000-0000-0000-000000000001', 'HEADING', 3, jsonb_build_object('text', $$Penjelasan: Cara Kerja Siklusnya$$)),
(gen_random_uuid(), 'b6000001-0000-0000-0000-000000000001', 'PARAGRAPH', 4, jsonb_build_object('text', $$Otak menganggap pikiran yang diulang sebagai 'masalah yang harus diselesaikan', padahal sebagian besar hanya ketakutan, bukan masalah nyata. Semakin dipikirkan tanpa aksi, semakin kuat rasa gelisahnya. Memutus siklus = mengganti pikiran berputar dengan langkah kecil yang konkret.$$)),
(gen_random_uuid(), 'b6000001-0000-0000-0000-000000000001', 'HEADING', 5, jsonb_build_object('text', $$Persiapan yang Dibutuhkan$$)),
(gen_random_uuid(), 'b6000001-0000-0000-0000-000000000001', 'LIST', 6, jsonb_build_object('items', ARRAY[$$Buku/catatan atau aplikasi notes di HP$$, $$Timer 10 menit$$, $$Tempat yang tenang selama 10–15 menit$$])),
(gen_random_uuid(), 'b6000001-0000-0000-0000-000000000001', 'HEADING', 7, jsonb_build_object('text', $$Langkah: Teknik Praktis$$)),
(gen_random_uuid(), 'b6000001-0000-0000-0000-000000000001', 'LIST', 8, jsonb_build_object('items', ARRAY[$$1. Tulis dump: tuangkan semua yang dipikirkan ke catatan selama 10 menit, tanpa edit$$, $$2. Tandai yang bisa dikendalikan vs tidak: hanya yang bisa dikendalikan yang dapat aksi$$, $$3. Satu langkah kecil: pilih 1 aksi 5 menit untuk item yang bisa dikendalikan, kerjakan sekarang$$, $$4. Teknik grounding 5-4-3-2-1: sebutkan 5 hal terlihat, 4 terdengar, 3 tersentuh, 2 tercium, 1 terasa — menarik pikiran ke saat ini$$, $$5. Batas waktu: beri jadwal khusus 15 menit/hari untuk 'waktu khawatir'; di luar itu, tunda dan catat saja$$])),
(gen_random_uuid(), 'b6000001-0000-0000-0000-000000000001', 'HEADING', 9, jsonb_build_object('text', $$Risiko$$)),
(gen_random_uuid(), 'b6000001-0000-0000-0000-000000000001', 'PARAGRAPH', 10, jsonb_build_object('text', $$Artikel ini panduan mandiri umum, bukan terapi. Jika gelisah disertai sesak, jantung berdebar berat, atau pikiran menyakiti diri, segera hubungi profesional atau layanan krisis: 119 ext 8. Teknik di atas tidak menggantikan diagnosis atau pengobatan.$$)),
(gen_random_uuid(), 'b6000001-0000-0000-0000-000000000001', 'HEADING', 11, jsonb_build_object('text', $$Penyelesaian$$)),
(gen_random_uuid(), 'b6000001-0000-0000-0000-000000000001', 'PARAGRAPH', 12, jsonb_build_object('text', $$Latih teknik ini 2 minggu dan catat perubahan: waktu tidur, jumlah episode overthinking, dan satu keputusan yang akhirnya diambil. Jika tidak membaik atau memburuk, konsultasikan ke psikolog — mencari bantuan profesional adalah langkah kuat, bukan kelemahan.$$))
ON CONFLICT (id) DO NOTHING;

-- ============ 2. TUT-MASAK-001 — Nasi Goreng (node D1 b2222222) ============
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, status, created_by, updated_by)
VALUES ('b6000002-0000-0000-0000-000000000002', 'TUT-MASAK-001', 'b2222222-2222-2222-2222-222222222222',
'Nasi Goreng Sempurna: Resep dan Teknik Anti Gagal', 'nasi-goreng-sempurna-resep-teknik',
'Resep nasi goreng rumahan dengan teknik api besar, nasi pera, dan bumbu dasar yang bisa divariasi.',
'id', 7, 'DRAFT', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (id) DO NOTHING;

INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
(gen_random_uuid(), 'b6000002-0000-0000-0000-000000000002', 'HEADING', 1, jsonb_build_object('text', $$Masalah: Nasi Goreng Lembek dan Hambar$$)),
(gen_random_uuid(), 'b6000002-0000-0000-0000-000000000002', 'PARAGRAPH', 2, jsonb_build_object('text', $$Nasi goreng rumahan sering hasilnya lembek, menempel di wajan, dan bumbunya tidak merata. Padahal rahasianya hanya tiga: nasi yang tepat, api yang panas, dan urutan bumbu.$$)),
(gen_random_uuid(), 'b6000002-0000-0000-0000-000000000002', 'HEADING', 3, jsonb_build_object('text', $$Penjelasan: Kenapa Nasi Pera Penting$$)),
(gen_random_uuid(), 'b6000002-0000-0000-0000-000000000002', 'PARAGRAPH', 4, jsonb_build_object('text', $$Nasi sisa semalam (pera) kadar airnya sudah turun, jadi butirannya terpisah saat digoreng. Nasi baru masak terlalu basah — hasilnya bubur goreng. Api besar membuat permukaan butir cepat kering dan harum (aroma wok) sebelum bumbu diserap merata.$$)),
(gen_random_uuid(), 'b6000002-0000-0000-0000-000000000002', 'HEADING', 5, jsonb_build_object('text', $$Bahan dan Alat$$)),
(gen_random_uuid(), 'b6000002-0000-0000-0000-000000000002', 'LIST', 6, jsonb_build_object('items', ARRAY[$$2 piring nasi pera (sisa semalam, simpan di kulkas)$$, $$2 butir telur$$, $$3 siung bawang putih + 5 bawang merah (haluskan)$$, $$1 sdm kecap manis + 1 sdt kecap asin + garam + merica$$, $$Minyak 3 sdm, wajan besar, api besar$$, $$Pelengkap: ayam suwir, bakso, kerupuk, acar$$])),
(gen_random_uuid(), 'b6000002-0000-0000-0000-000000000002', 'HEADING', 7, jsonb_build_object('text', $$Langkah Memasak$$)),
(gen_random_uuid(), 'b6000002-0000-0000-0000-000000000002', 'LIST', 8, jsonb_build_object('items', ARRAY[$$1. Panaskan wajan dengan api BESAR sampai benar-benar panas, tuang minyak$$, $$2. Orak-arik telur hingga setengah matang, sisihkan ke pinggir wajan$$, $$3. Tumis bumbu halus hingga harum dan agak kering (1–2 menit)$$, $$4. Masukkan nasi pera, aduk tekan-tekan agar butiran terpisah$$, $$5. Tuang kecap di pinggir wajan panas (biar karamel), lalu aduk cepat 2 menit$$, $$6. Masukkan telur orak-arik + pelengkap, bumbui garam-merica, koreksi rasa$$, $$7. Sajikan panas dengan kerupuk dan acar$$])),
(gen_random_uuid(), 'b6000002-0000-0000-0000-000000000002', 'HEADING', 9, jsonb_build_object('text', $$Risiko$$)),
(gen_random_uuid(), 'b6000002-0000-0000-0000-000000000002', 'PARAGRAPH', 10, jsonb_build_object('text', $$Hati-hati minyak panas muncrat saat bumbu basah masuk wajan. Jangan tinggalkan wajan api besar tanpa pengawasan. Nasi sisa semalam wajib disimpan di kulkas (bukan suhu ruang) untuk mencegah bakteri.$$)),
(gen_random_uuid(), 'b6000002-0000-0000-0000-000000000002', 'HEADING', 11, jsonb_build_object('text', $$Penyelesaian$$)),
(gen_random_uuid(), 'b6000002-0000-0000-0000-000000000002', 'PARAGRAPH', 12, jsonb_build_object('text', $$Ciri berhasil: butiran nasi terpisah, kering di luar, aroma smoky, bumbu merata. Variasi: tambah terasi bakar untuk nasi goreng kampung, atau saus tiram untuk versi oriental. Selamat mencoba!$$))
ON CONFLICT (id) DO NOTHING;

-- ============ 3. EXP-SEJARAH-001 — Revolusi Industri (node D12 c8888888) ============
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, status, created_by, updated_by)
VALUES ('b6000003-0000-0000-0000-000000000003', 'EXP-SEJARAH-001', 'c8888888-8888-8888-8888-888888888888',
'Revolusi Industri: Awal Era Modern', 'revolusi-industri-awal-era-modern',
'Bagaimana mesin uap mengubah dunia: dari Inggris abad ke-18 hingga pabrik, kota, dan kehidupan modern.',
'id', 7, 'DRAFT', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (id) DO NOTHING;

INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
(gen_random_uuid(), 'b6000003-0000-0000-0000-000000000003', 'HEADING', 1, jsonb_build_object('text', $$Dunia Sebelum Mesin$$)),
(gen_random_uuid(), 'b6000003-0000-0000-0000-000000000003', 'PARAGRAPH', 2, jsonb_build_object('text', $$Selama ribuan tahun, hampir semua barang dibuat dengan tangan di rumah atau bengkel kecil. Tenaga yang tersedia hanya otot manusia, hewan, angin, dan air. Produksi lambat, mahal, dan terbatas.$$)),
(gen_random_uuid(), 'b6000003-0000-0000-0000-000000000003', 'HEADING', 3, jsonb_build_object('text', $$Percikan di Inggris (1760-an)$$)),
(gen_random_uuid(), 'b6000003-0000-0000-0000-000000000003', 'PARAGRAPH', 4, jsonb_build_object('text', $$Inggris punya kombinasi langka: batu bara melimpah, modal dagang, dan budaya penemuan. James Watt menyempurnakan mesin uap (1769) hingga efisien untuk tambang dan pabrik. Bersamaan, mesin tenun seperti Spinning Jenny (1764) melipatgandakan produksi kain.$$)),
(gen_random_uuid(), 'b6000003-0000-0000-0000-000000000003', 'HEADING', 5, jsonb_build_object('text', $$Pabrik Mengubah Segalanya$$)),
(gen_random_uuid(), 'b6000003-0000-0000-0000-000000000003', 'PARAGRAPH', 6, jsonb_build_object('text', $$Pabrik mengumpulkan ratusan pekerja di satu atap dengan mesin bertenaga uap. Produksi massal membuat barang — kain, besi, perkakas — jauh lebih murah. Kota industri seperti Manchester meledak penduduknya dalam puluhan tahun.$$)),
(gen_random_uuid(), 'b6000003-0000-0000-0000-000000000003', 'HEADING', 7, jsonb_build_object('text', $$Harga yang Dibayar$$)),
(gen_random_uuid(), 'b6000003-0000-0000-0000-000000000003', 'PARAGRAPH', 8, jsonb_build_object('text', $$Kemajuan datang dengan biaya: jam kerja 12–16 jam, anak-anak bekerja, permukiman kumuh, dan sungai tercemar. Dari sinilah lahir gerakan buruh, serikat pekerja, dan gagasan perlindungan tenaga kerja yang kita kenal sekarang.$$)),
(gen_random_uuid(), 'b6000003-0000-0000-0000-000000000003', 'HEADING', 9, jsonb_build_object('text', $$Gelombang Berikutnya$$)),
(gen_random_uuid(), 'b6000003-0000-0000-0000-000000000003', 'PARAGRAPH', 10, jsonb_build_object('text', $$Revolusi Industri kedua (akhir 1800-an) membawa listrik, baja murah, dan mesin pembakaran dalam — mobil dan pesawat lahir dari sini. Setiap gelombang teknologi mengikuti pola yang sama: penemuan, pabrik, kota, lalu aturan baru untuk melindungi manusia.$$))
ON CONFLICT (id) DO NOTHING;

-- ============ 4. EXP-KIMIA2-001 — Asam Basa (node D8 c4444444) ============
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, status, created_by, updated_by)
VALUES ('b6000004-0000-0000-0000-000000000004', 'EXP-KIMIA2-001', 'c4444444-4444-4444-4444-444444444444',
'Asam Basa: pH dalam Kehidupan Sehari-hari', 'asam-basa-ph-kehidupan-sehari-hari',
'Memahami asam, basa, dan skala pH lewat contoh nyata: dari jeruk, sabun, hingga lambung manusia.',
'id', 6, 'DRAFT', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (id) DO NOTHING;

INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
(gen_random_uuid(), 'b6000004-0000-0000-0000-000000000004', 'HEADING', 1, jsonb_build_object('text', $$Apa Itu Asam dan Basa?$$)),
(gen_random_uuid(), 'b6000004-0000-0000-0000-000000000004', 'PARAGRAPH', 2, jsonb_build_object('text', $$Asam adalah zat yang melepaskan ion hidrogen (H+) dalam air — rasanya masam seperti jeruk dan cuka. Basa melepaskan ion hidroksida (OH-) — rasanya pahit dan licin seperti sabun. Keduanya ada di mana-mana dalam kehidupan sehari-hari.$$)),
(gen_random_uuid(), 'b6000004-0000-0000-0000-000000000004', 'HEADING', 3, jsonb_build_object('text', $$Skala pH 0–14$$)),
(gen_random_uuid(), 'b6000004-0000-0000-0000-000000000004', 'PARAGRAPH', 4, jsonb_build_object('text', $$Skala pH mengukur keasaman: 0–6 asam, 7 netral, 8–14 basa. Skalanya logaritmik — pH 3 sepuluh kali lebih asam dari pH 4. Air murni pH 7; darah manusia dijaga ketat di 7,4 oleh tubuh.$$)),
(gen_random_uuid(), 'b6000004-0000-0000-0000-000000000004', 'HEADING', 5, jsonb_build_object('text', $$Contoh di Sekitar Kita$$)),
(gen_random_uuid(), 'b6000004-0000-0000-0000-000000000004', 'LIST', 6, jsonb_build_object('items', ARRAY[$$Asam lambung (pH 1,5–2): mencerna makanan, dibunuh kumannya$$, $$Sabun (pH 9–10): basa, makanya licin di tangan$$, $$Hujan asam (pH < 5,6): merusak bangunan dan hutan$$, $$Tanah pertanian: pH ideal 6–7,5 agar tanaman subur$$])),
(gen_random_uuid(), 'b6000004-0000-0000-0000-000000000004', 'HEADING', 7, jsonb_build_object('text', $$Netralisasi: Asam + Basa$$)),
(gen_random_uuid(), 'b6000004-0000-0000-0000-000000000004', 'PARAGRAPH', 8, jsonb_build_object('text', $$Asam dan basa saling menetralkan menjadi garam + air. Inilah prinsip obat maag (antasida menetralkan asam lambung berlebih) dan mengapa kapur ditabur ke tanah yang terlalu asam.$$)),
(gen_random_uuid(), 'b6000004-0000-0000-0000-000000000004', 'HEADING', 9, jsonb_build_object('text', $$Indikator Alami$$)),
(gen_random_uuid(), 'b6000004-0000-0000-0000-000000000004', 'PARAGRAPH', 10, jsonb_build_object('text', $$Air rebusan kubis ungu berubah warna sesuai pH: merah muda di asam, ungu di netral, hijau-kuning di basa. Eksperimen sederhana ini dipakai di banyak sekolah untuk mengenalkan konsep pH tanpa bahan kimia berbahaya.$$))
ON CONFLICT (id) DO NOTHING;

-- ============ 5. SCH-SMP-IPA-001 — Sistem Pencernaan (node D15 d4444444) ============
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, status, created_by, updated_by)
VALUES ('b6000005-0000-0000-0000-000000000005', 'SCH-SMP-IPA-001', 'd4444444-4444-4444-4444-444444444444',
'IPA Kelas 8: Sistem Pencernaan Manusia', 'ipa-kelas-8-sistem-pencernaan-manusia',
'Materi IPA kelas 8: organ pencernaan, enzim, dan proses penyerapan sari makanan — lengkap dengan latihan.',
'id', 8, 'DRAFT', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (id) DO NOTHING;

INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
(gen_random_uuid(), 'b6000005-0000-0000-0000-000000000005', 'HEADING', 1, jsonb_build_object('text', $$Tujuan Pembelajaran$$)),
(gen_random_uuid(), 'b6000005-0000-0000-0000-000000000005', 'PARAGRAPH', 2, jsonb_build_object('text', $$Setelah mempelajari materi ini, siswa dapat menyebutkan organ-organ pencernaan beserta fungsinya, menjelaskan peran enzim, dan mendeskripsikan proses penyerapan sari makanan.$$)),
(gen_random_uuid(), 'b6000005-0000-0000-0000-000000000005', 'HEADING', 3, jsonb_build_object('text', $$Urutan Organ Pencernaan$$)),
(gen_random_uuid(), 'b6000005-0000-0000-0000-000000000005', 'LIST', 4, jsonb_build_object('items', ARRAY[$$Mulut: gigi memotong-menghaluskan (mekanik), ludah mengandung amilase mencerna amilum (kimiawi)$$, $$Kerongkongan: gerak peristaltik mendorong bolus ke lambung$$, $$Lambung: asam HCl + enzim pepsin mencerna protein; dindingnya dilindungi lendir$$, $$Usus halus: pencernaan akhir + penyerapan sari makanan lewat vili$$, $$Usus besar: menyerap air, sisa dibentuk menjadi feses$$, $$Anus: mengeluarkan sisa pencernaan$$])),
(gen_random_uuid(), 'b6000005-0000-0000-0000-000000000005', 'HEADING', 5, jsonb_build_object('text', $$Kelenjar Pencernaan dan Enzimnya$$)),
(gen_random_uuid(), 'b6000005-0000-0000-0000-000000000005', 'PARAGRAPH', 6, jsonb_build_object('text', $$Hati menghasilkan empedu untuk mengemulsikan lemak. Pankreas menghasilkan amilase (amilum), tripsin (protein), dan lipase (lemak). Kelenjar ludah menghasilkan amilase. Ingat pola: tiap enzim bekerja pada jenis zat tertentu.$$)),
(gen_random_uuid(), 'b6000005-0000-0000-0000-000000000005', 'HEADING', 7, jsonb_build_object('text', $$Contoh: Perjalanan Sepotong Roti$$)),
(gen_random_uuid(), 'b6000005-0000-0000-0000-000000000005', 'PARAGRAPH', 8, jsonb_build_object('text', $$Roti (amilum) dikunyah di mulut → amilase ludah mulai bekerja. Di lambung, asam dan pepsin mengaduknya jadi bubur (kim). Di usus halus, amilase pankreas + enzim usus mengubahnya jadi glukosa → diserap vili ke darah → diedarkan ke seluruh tubuh sebagai energi.$$)),
(gen_random_uuid(), 'b6000005-0000-0000-0000-000000000005', 'HEADING', 9, jsonb_build_object('text', $$Latihan Soal$$)),
(gen_random_uuid(), 'b6000005-0000-0000-0000-000000000005', 'LIST', 10, jsonb_build_object('items', ARRAY[$$1. Sebutkan 3 enzim beserta kelenjar penghasil dan zat yang dicernanya!$$, $$2. Mengapa dinding lambung tidak ikut tercerna oleh asamnya sendiri?$$, $$3. Apa fungsi vili pada usus halus?$$])),
(gen_random_uuid(), 'b6000005-0000-0000-0000-000000000005', 'HEADING', 11, jsonb_build_object('text', $$Kunci Jawaban$$)),
(gen_random_uuid(), 'b6000005-0000-0000-0000-000000000005', 'PARAGRAPH', 12, jsonb_build_object('text', $$1. Amilase (ludah/pankreas → amilum), pepsin (lambung → protein), lipase (pankreas → lemak). 2. Dinding lambung dilapisi lendir (mukus) yang melindunginya dari HCl dan pepsin. 3. Vili memperluas permukaan usus halus sehingga penyerapan sari makanan jauh lebih efisien.$$))
ON CONFLICT (id) DO NOTHING;

-- ============ 6. SCH-SD-MAT2-001 — Perkalian Kelas 2 (node K9 d1000002) ============
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, status, created_by, updated_by)
VALUES ('b6000006-0000-0000-0000-000000000006', 'SCH-SD-MAT2-001', 'd1000002-0000-0000-0000-000000000002',
'Matematika Kelas 2: Perkalian Dasar 1–10', 'matematika-kelas-2-perkalian-dasar',
'Materi matematika kelas 2 SD: memahami perkalian sebagai penjumlahan berulang, tabel 1–10, dan latihan.',
'id', 7, 'DRAFT', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (id) DO NOTHING;

INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
(gen_random_uuid(), 'b6000006-0000-0000-0000-000000000006', 'HEADING', 1, jsonb_build_object('text', $$Tujuan Pembelajaran$$)),
(gen_random_uuid(), 'b6000006-0000-0000-0000-000000000006', 'PARAGRAPH', 2, jsonb_build_object('text', $$Setelah mempelajari materi ini, siswa dapat menjelaskan perkalian sebagai penjumlahan berulang, menghafal tabel perkalian 1–10, dan menyelesaikan soal cerita sederhana.$$)),
(gen_random_uuid(), 'b6000006-0000-0000-0000-000000000006', 'HEADING', 3, jsonb_build_object('text', $$Perkalian = Penjumlahan Berulang$$)),
(gen_random_uuid(), 'b6000006-0000-0000-0000-000000000006', 'PARAGRAPH', 4, jsonb_build_object('text', $$3 × 4 artinya 'tiga kelompok, masing-masing berisi 4': 4 + 4 + 4 = 12. Jadi 3 × 4 = 12. Angka pertama = banyak kelompok, angka kedua = isi tiap kelompok. Cara membacanya: 'tiga kali empat sama dengan dua belas'.$$)),
(gen_random_uuid(), 'b6000006-0000-0000-0000-000000000006', 'HEADING', 5, jsonb_build_object('text', $$Contoh Langkah demi Langkah$$)),
(gen_random_uuid(), 'b6000006-0000-0000-0000-000000000006', 'PARAGRAPH', 6, jsonb_build_object('text', $$Soal: 5 × 2 = ? Langkah: (1) artinya 5 kelompok berisi 2 → 2 + 2 + 2 + 2 + 2; (2) hitung: 2, 4, 6, 8, 10; (3) jawab: 5 × 2 = 10. Coba dengan gambar: gambar 5 kotak, isi tiap kotak dengan 2 bintang, lalu hitung semua bintang.$$)),
(gen_random_uuid(), 'b6000006-0000-0000-0000-000000000006', 'HEADING', 7, jsonb_build_object('text', $$Tabel Perkalian 1–5$$)),
(gen_random_uuid(), 'b6000006-0000-0000-0000-000000000006', 'LIST', 8, jsonb_build_object('items', ARRAY[$$×1: hasilnya sama dengan angka itu (3 × 1 = 3)$$, $$×2: dua kali lipat (4 × 2 = 8)$$, $$×3: jumlahkan tiga kali (2 × 3 = 6)$$, $$×4: dua kali lipat dari ×2 (3 × 4 = 12)$$, $$×5: selalu berakhir 0 atau 5 (6 × 5 = 30)$$])),
(gen_random_uuid(), 'b6000006-0000-0000-0000-000000000006', 'HEADING', 9, jsonb_build_object('text', $$Latihan Soal$$)),
(gen_random_uuid(), 'b6000006-0000-0000-0000-000000000006', 'LIST', 10, jsonb_build_object('items', ARRAY[$$1. 4 × 3 = ?$$, $$2. Ibu membeli 5 bungkus permen. Tiap bungkus isi 4 permen. Berapa jumlah semua permen?$$, $$3. 7 × 2 = ?$$])),
(gen_random_uuid(), 'b6000006-0000-0000-0000-000000000006', 'HEADING', 11, jsonb_build_object('text', $$Kunci Jawaban$$)),
(gen_random_uuid(), 'b6000006-0000-0000-0000-000000000006', 'PARAGRAPH', 12, jsonb_build_object('text', $$1. 4 × 3 = 3 + 3 + 3 + 3 = 12. 2. 5 × 4 = 20 permen. 3. 7 × 2 = 14. Tips menghafal: latih 5 menit setiap hari, mulai dari ×1, ×2, ×5 yang paling mudah!$$))
ON CONFLICT (id) DO NOTHING;
