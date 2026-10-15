-- Artikel konten Madevi batch 10 — 2026-10-13
-- Owner principal: f7125028-187e-44e0-b95b-88b69b8d5c9a

-- ============ 1. TUT-FINANSIAL-001: Investasi untuk Pemula ============
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, status, created_by, updated_by)
VALUES ('36c2b49d-29a6-4358-81e0-3338f669f9e4', 'TUT-FINANSIAL-001', 'b8888888-8888-8888-8888-888888888888',
'Investasi untuk Pemula: Mulai dari Rp10 Ribu', 'investasi-untuk-pemula',
'Panduan investasi untuk pemula: mulai dari Rp10 ribu, pahami reksa dana, DCA, dan hindari jebakan utang konsumtif.',
'id', 8, 'DRAFT', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (id) DO NOTHING;

INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
(gen_random_uuid(), '36c2b49d-29a6-4358-81e0-3338f669f9e4', 'HEADING', 1, jsonb_build_object('text', $$Masalah: Gaji Habis, Tabungan Nol$$)),
(gen_random_uuid(), '36c2b49d-29a6-4358-81e0-3338f669f9e4', 'PARAGRAPH', 2, jsonb_build_object('text', $$Banyak orang merasa gajinya "bocor": akhir bulan selalu pas-pasan, tabungan tidak pernah bertambah. Uang yang diam di rekening tabungan pun tergerus inflasi sekitar 3-5 persen per tahun — artinya daya belinya menyusut diam-diam.$$)),
(gen_random_uuid(), '36c2b49d-29a6-4358-81e0-3338f669f9e4', 'HEADING', 3, jsonb_build_object('text', $$Penjelasan: Kenapa Investasi, Bukan Sekadar Menabung$$)),
(gen_random_uuid(), '36c2b49d-29a6-4358-81e0-3338f669f9e4', 'PARAGRAPH', 4, jsonb_build_object('text', $$Menabung menyimpan nilai, berinvestasi menumbuhkan nilai. Kuncinya adalah bunga majemuk (compounding): keuntungan yang diinvestasikan kembali ikut menghasilkan keuntungan. Rp100 ribu per bulan dengan imbal hasil 8 persen per tahun menjadi sekitar Rp18,4 juta dalam 10 tahun — jauh di atas total setoran Rp12 juta.$$)),
(gen_random_uuid(), '36c2b49d-29a6-4358-81e0-3338f669f9e4', 'HEADING', 5, jsonb_build_object('text', $$Persiapan: Syarat Sebelum Mulai$$)),
(gen_random_uuid(), '36c2b49d-29a6-4358-81e0-3338f669f9e4', 'LIST', 6, jsonb_build_object('items', ARRAY[$$KTP dan rekening bank atas nama sendiri$$, $$Dana darurat 3-6 kali pengeluaran bulanan (di tabungan terpisah)$$, $$Bebas utang konsumtif berbunga tinggi (paylater, kartu kredit)$$, $$Aplikasi investasi resmi yang terdaftar di OJK$$])),
(gen_random_uuid(), '36c2b49d-29a6-4358-81e0-3338f669f9e4', 'HEADING', 7, jsonb_build_object('text', $$Langkah: Mulai Investasi dari Rp10 Ribu$$)),
(gen_random_uuid(), '36c2b49d-29a6-4358-81e0-3338f669f9e4', 'LIST', 8, jsonb_build_object('items', ARRAY[$$1. Mulai dari reksa dana pasar uang — risikonya paling rendah, cocok untuk pemula$$, $$2. Terapkan DCA (Dollar Cost Averaging): setor rutin tiap bulan, misal Rp100 ribu, tanpa peduli naik-turun pasar$$, $$3. Setelah 6-12 bulan dan makin paham, pelajari reksa dana obligasi atau saham$$, $$4. Naikkan nominal bertahap, bukan sekaligus — konsistensi lebih penting dari jumlah$$, $$5. Catat semua transaksi dan evaluasi tiap 6 bulan$$])),
(gen_random_uuid(), '36c2b49d-29a6-4358-81e0-3338f669f9e4', 'HEADING', 9, jsonb_build_object('text', $$Risiko$$)),
(gen_random_uuid(), '36c2b49d-29a6-4358-81e0-3338f669f9e4', 'PARAGRAPH', 10, jsonb_build_object('text', $$Jangan investasikan dana darurat atau uang kebutuhan pokok. Waspadai tawaran "pasti untung" dengan imbal hasil tidak masuk akal — itu ciri investasi bodong. Periksa selalu legalitas di situs OJK. Jangan panik saat pasar turun; itulah saat DCA justru membeli lebih banyak unit dengan harga murah.$$)),
(gen_random_uuid(), '36c2b49d-29a6-4358-81e0-3338f669f9e4', 'HEADING', 11, jsonb_build_object('text', $$Penyelesaian$$)),
(gen_random_uuid(), '36c2b49d-29a6-4358-81e0-3338f669f9e4', 'PARAGRAPH', 12, jsonb_build_object('text', $$Target realistis tahun pertama: punya kebiasaan setor rutin dan portofolio reksa dana pasar uang senilai 6-12 kali setoran bulanan. Setelah disiplin terbentuk, barulah naik kelas ke instrumen yang lebih agresif. Ingat: waktu di pasar mengalahkan timing pasar.$$))
ON CONFLICT (id) DO NOTHING;

-- ============ 2. TUT-PRODUKTIF-001: Teknik Pomodoro ============
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, status, created_by, updated_by)
VALUES ('44ebf222-d987-4c31-a225-8f402a6e26e7', 'TUT-PRODUKTIF-001', 'b6666666-6666-6666-6666-666666666666',
'Manajemen Waktu: Teknik Pomodoro yang Benar', 'manajemen-waktu-teknik-pomodoro',
'Panduan teknik Pomodoro yang benar: kerja fokus 25 menit, istirahat 5 menit, dan cara menghindari kesalahan umum.',
'id', 7, 'DRAFT', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (id) DO NOTHING;

INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
(gen_random_uuid(), '44ebf222-d987-4c31-a225-8f402a6e26e7', 'HEADING', 1, jsonb_build_object('text', $$Masalah: Sibuk Seharian tapi Tak Selesai Apa-apa$$)),
(gen_random_uuid(), '44ebf222-d987-4c31-a225-8f402a6e26e7', 'PARAGRAPH', 2, jsonb_build_object('text', $$Seharian menatap layar, membalas chat, dan "sibuk", tetapi daftar tugas tidak berkurang. Otak lelah padahal output minim — ini gejala kerja tanpa struktur fokus.$$)),
(gen_random_uuid(), '44ebf222-d987-4c31-a225-8f402a6e26e7', 'HEADING', 3, jsonb_build_object('text', $$Penjelasan: Cara Kerja Pomodoro$$)),
(gen_random_uuid(), '44ebf222-d987-4c31-a225-8f402a6e26e7', 'PARAGRAPH', 4, jsonb_build_object('text', $$Teknik Pomodoro ditemukan Francesco Cirillo pada 1980-an: kerja fokus 25 menit (1 pomodoro), lalu istirahat 5 menit. Setelah 4 pomodoro, istirahat panjang 15-30 menit. Otak bekerja paling baik dalam sprint pendek dengan jeda pemulihan, bukan maraton tanpa henti.$$)),
(gen_random_uuid(), '44ebf222-d987-4c31-a225-8f402a6e26e7', 'HEADING', 5, jsonb_build_object('text', $$Alat yang Dibutuhkan$$)),
(gen_random_uuid(), '44ebf222-d987-4c31-a225-8f402a6e26e7', 'LIST', 6, jsonb_build_object('items', ARRAY[$$Timer (HP, aplikasi, atau timer dapur)$$, $$Daftar tugas yang sudah dipecah kecil-kecil$$, $$Mode jangan ganggu di HP selama pomodoro berjalan$$])),
(gen_random_uuid(), '44ebf222-d987-4c31-a225-8f402a6e26e7', 'HEADING', 7, jsonb_build_object('text', $$Langkah Melakukan Pomodoro$$)),
(gen_random_uuid(), '44ebf222-d987-4c31-a225-8f402a6e26e7', 'LIST', 8, jsonb_build_object('items', ARRAY[$$1. Pilih SATU tugas, tulis target kecil yang selesai dalam 25 menit$$, $$2. Set timer 25 menit, singkirkan HP dan notifikasi$$, $$3. Kerja sampai timer bunyi — gangguan dicatat, bukan dikerjakan$$, $$4. Istirahat 5 menit: berdiri, minum, jauh dari layar$$, $$5. Ulangi; setelah 4 pomodoro, istirahat panjang 15-30 menit$$])),
(gen_random_uuid(), '44ebf222-d987-4c31-a225-8f402a6e26e7', 'HEADING', 9, jsonb_build_object('text', $$Kesalahan Umum$$)),
(gen_random_uuid(), '44ebf222-d987-4c31-a225-8f402a6e26e7', 'PARAGRAPH', 10, jsonb_build_object('text', $$Melewatkan istirahat ("nanggung, lanjut aja") merusak ritme dan membuat sesi berikutnya anjlok. Mengecek HP saat istirahat 5 menit membuat otak tidak benar-benar pulih. Memaksakan 25 menit untuk tugas kreatif yang butuh pemanasan — sesuaikan jadi 45-50 menit bila perlu, asal polanya tetap: fokus lalu jeda.$$)),
(gen_random_uuid(), '44ebf222-d987-4c31-a225-8f402a6e26e7', 'HEADING', 11, jsonb_build_object('text', $$Penyelesaian$$)),
(gen_random_uuid(), '44ebf222-d987-4c31-a225-8f402a6e26e7', 'PARAGRAPH', 12, jsonb_build_object('text', $$Mulai dengan target 4 pomodoro per hari (sekitar 2 jam fokus murni). Catat berapa pomodoro selesai tiap hari selama seminggu — kebanyakan orang kaget melihat betapa sedikit waktu fokus murni mereka selama ini, dan betapa besar perubahannya setelah disiplin timer.$$))
ON CONFLICT (id) DO NOTHING;

-- ============ 3. EXP-ANTROPOLOGI-001: Suku Baduy ============
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, status, created_by, updated_by)
VALUES ('40c5967f-6692-4ddb-ab56-505aee08d32f', 'EXP-ANTROPOLOGI-001', 'c8888888-8888-8888-8888-888888888888',
'Suku Baduy: Menjaga Tradisi di Era Digital', 'suku-baduy-tradisi-era-digital',
'Mengenal suku Baduy di Banten: pikukuh adat, perbedaan Baduy Dalam dan Luar, dan cara mereka bertahan di era digital.',
'id', 7, 'DRAFT', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (id) DO NOTHING;

INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
(gen_random_uuid(), '40c5967f-6692-4ddb-ab56-505aee08d32f', 'HEADING', 1, jsonb_build_object('text', $$Siapa Suku Baduy?$$)),
(gen_random_uuid(), '40c5967f-6692-4ddb-ab56-505aee08d32f', 'PARAGRAPH', 2, jsonb_build_object('text', $$Suku Baduy (Urang Kanekes) adalah masyarakat adat yang tinggal di Desa Kanekes, Kecamatan Leuwidamar, Kabupaten Lebak, Banten. Mereka dikenal memegang teguh adat dan menolak banyak unsur kehidupan modern — sebuah pilihan sadar, bukan ketertinggalan.$$)),
(gen_random_uuid(), '40c5967f-6692-4ddb-ab56-505aee08d32f', 'HEADING', 3, jsonb_build_object('text', $$Baduy Dalam dan Baduy Luar$$)),
(gen_random_uuid(), '40c5967f-6692-4ddb-ab56-505aee08d32f', 'PARAGRAPH', 4, jsonb_build_object('text', $$Baduy terbagi dua: Baduy Dalam (Tangtu) yang tinggal di tiga kampung inti — Cibeo, Cikeusik, Cikertawana — dengan aturan paling ketat, dan Baduy Luar (Panamping) di puluhan kampung sekitar yang aturannya lebih longgar dan menjadi penyangga sekaligus penghubung dengan dunia luar.$$)),
(gen_random_uuid(), '40c5967f-6692-4ddb-ab56-505aee08d32f', 'HEADING', 5, jsonb_build_object('text', $$Pikukuh: Hukum Adat yang Dijaga$$)),
(gen_random_uuid(), '40c5967f-6692-4ddb-ab56-505aee08d32f', 'PARAGRAPH', 6, jsonb_build_object('text', $$Pikukuh adalah amanat leluhur yang mengatur seluruh aspek hidup: dilarang merusak hutan, dilarang mengubah bentuk alam, wajib menjaga keseimbangan. Pelanggaran dikenai sanksi adat — dari denda hingga pengusiran dari kampung.$$)),
(gen_random_uuid(), '40c5967f-6692-4ddb-ab56-505aee08d32f', 'HEADING', 7, jsonb_build_object('text', $$Larangan Teknologi$$)),
(gen_random_uuid(), '40c5967f-6692-4ddb-ab56-505aee08d32f', 'PARAGRAPH', 8, jsonb_build_object('text', $$Baduy Dalam dilarang memakai listrik, kendaraan bermotor, alas kaki, sabun, bahkan berfoto. Larangan ini menjaga kesederhanaan dan kemandirian: mereka tidak bergantung pada sistem dari luar. Baduy Luar lebih fleksibel — sebagian memakai HP dan berdagang ke kota.$$)),
(gen_random_uuid(), '40c5967f-6692-4ddb-ab56-505aee08d32f', 'HEADING', 9, jsonb_build_object('text', $$Hidup dari Huma dan Hutan$$)),
(gen_random_uuid(), '40c5967f-6692-4ddb-ab56-505aee08d32f', 'PARAGRAPH', 10, jsonb_build_object('text', $$Mata pencaharian utama adalah huma — berladang padi secara berpindah dengan sistem gilir yang menjaga kesuburan tanah. Mereka juga menenun, membuat kerajinan bambu dan madu hutan yang dijual ke wisatawan. Setiap tahun ada Kawalu (puasa adat) dan Seba — kirab membawa hasil bumi ke pendopo bupati dan gubernur sebagai bentuk penghormatan.$$))
ON CONFLICT (id) DO NOTHING;

-- ============ 4. EXP-OSEANOGRAFI-001: Palung Mariana ============
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, status, created_by, updated_by)
VALUES ('c2692b70-f90d-4e24-a37f-b6e02b4b8456', 'EXP-OSEANOGRAFI-001', 'c2222222-2222-2222-2222-222222222222',
'Palung Mariana: Titik Terdalam Bumi', 'palung-mariana-titik-terdalam-bumi',
'Menjelajahi Palung Mariana sedalam hampir 11 km: tekanan penghancur, kehidupan aneh di kegelapan, dan misi penyelamannya.',
'id', 7, 'DRAFT', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (id) DO NOTHING;

INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
(gen_random_uuid(), 'c2692b70-f90d-4e24-a37f-b6e02b4b8456', 'HEADING', 1, jsonb_build_object('text', $$Palung Terdalam di Planet Ini$$)),
(gen_random_uuid(), 'c2692b70-f90d-4e24-a37f-b6e02b4b8456', 'PARAGRAPH', 2, jsonb_build_object('text', $$Palung Mariana di Samudra Pasifik barat menyimpan titik terdalam Bumi: Challenger Deep, sekitar 10.935 meter di bawah permukaan laut. Jika Gunung Everest dimasukkan ke dalamnya, puncaknya masih tenggelam sekitar 2 kilometer di bawah permukaan.$$)),
(gen_random_uuid(), 'c2692b70-f90d-4e24-a37f-b6e02b4b8456', 'HEADING', 3, jsonb_build_object('text', $$Bagaimana Palung Terbentuk$$)),
(gen_random_uuid(), 'c2692b70-f90d-4e24-a37f-b6e02b4b8456', 'PARAGRAPH', 4, jsonb_build_object('text', $$Palung terbentuk di zona subduksi: Lempeng Pasifik yang tua dan berat menunjam ke bawah Lempeng Filipina. Proses tektonik inilah yang "menarik" dasar laut hingga nyaris 11 kilometer — dan menjadikannya salah satu wilayah paling aktif gempa di dunia.$$)),
(gen_random_uuid(), 'c2692b70-f90d-4e24-a37f-b6e02b4b8456', 'HEADING', 5, jsonb_build_object('text', $$Tekanan yang Menghancurkan$$)),
(gen_random_uuid(), 'c2692b70-f90d-4e24-a37f-b6e02b4b8456', 'PARAGRAPH', 6, jsonb_build_object('text', $$Di dasar palung, tekanan air mencapai lebih dari 1.000 bar — setara 1.000 kilogram menekan setiap sentimeter persegi, atau sekitar 50 pesawat jet jumbo menumpuk di atas tubuh manusia. Suhu air hanya 1-4 derajat Celsius dan gelap total: cahaya matahari tak pernah sampai.$$)),
(gen_random_uuid(), 'c2692b70-f90d-4e24-a37f-b6e02b4b8456', 'HEADING', 7, jsonb_build_object('text', $$Kehidupan di Kegelapan$$)),
(gen_random_uuid(), 'c2692b70-f90d-4e24-a37f-b6e02b4b8456', 'PARAGRAPH', 8, jsonb_build_object('text', $$Anehnya, palung tidak mati. Hidup di sana xenophyophore (organisme bersel satu raksasa sebesar kepalan tangan), amfipoda transparan, dan ikan snailfish pucat yang bertahan berkat protein antifreeze dan tubuh tanpa rongga udara. Mereka makan "salju laut" — sisa organik yang gugur dari permukaan.$$)),
(gen_random_uuid(), 'c2692b70-f90d-4e24-a37f-b6e02b4b8456', 'HEADING', 9, jsonb_build_object('text', $$Manusia yang Pernah Turun$$)),
(gen_random_uuid(), 'c2692b70-f90d-4e24-a37f-b6e02b4b8456', 'PARAGRAPH', 10, jsonb_build_object('text', $$Baru segelintir manusia pernah ke dasarnya: Jacques Piccard dan Don Walsh dengan bathyscaphe Trieste pada 1960, sutradara James Cameron solo dengan Deepsea Challenger pada 2012, dan Victor Vescovo pada 2019 yang mencatat kedalaman sekitar 10.927 meter. Setiap misi membuktikan satu hal: teknologi kita masih kalah jauh dari misteri lautan.$$))
ON CONFLICT (id) DO NOTHING;

-- ============ 5. SCH-SMA-EKO-001: Kebutuhan dan Kelangkaan ============
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, status, created_by, updated_by)
VALUES ('bc3743d9-8117-4cd2-b811-f64a0a1209aa', 'SCH-SMA-EKO-001', 'd5555555-5555-5555-5555-555555555555',
'Ekonomi Kelas 10: Kebutuhan dan Kelangkaan', 'ekonomi-kelas-10-kebutuhan-kelangkaan',
'Materi ekonomi kelas 10 SMA: pengertian kebutuhan, macam-macamnya, kelangkaan, dan biaya peluang — lengkap dengan latihan soal.',
'id', 8, 'DRAFT', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (id) DO NOTHING;

INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
(gen_random_uuid(), 'bc3743d9-8117-4cd2-b811-f64a0a1209aa', 'HEADING', 1, jsonb_build_object('text', $$Tujuan Pembelajaran$$)),
(gen_random_uuid(), 'bc3743d9-8117-4cd2-b811-f64a0a1209aa', 'PARAGRAPH', 2, jsonb_build_object('text', $$Setelah mempelajari materi ini, kamu diharapkan mampu: (1) menjelaskan pengertian kebutuhan manusia, (2) mengelompokkan kebutuhan menurut intensitas dan sifatnya, (3) menjelaskan konsep kelangkaan dan hubungannya dengan pilihan ekonomi.$$)),
(gen_random_uuid(), 'bc3743d9-8117-4cd2-b811-f64a0a1209aa', 'HEADING', 3, jsonb_build_object('text', $$Pengertian Kebutuhan$$)),
(gen_random_uuid(), 'bc3743d9-8117-4cd2-b811-f64a0a1209aa', 'PARAGRAPH', 4, jsonb_build_object('text', $$Kebutuhan adalah segala sesuatu yang diperlukan manusia untuk mempertahankan hidup dan mencapai kesejahteraan. Ciri kebutuhan: jumlahnya tidak terbatas, selalu bertambah seiring perkembangan zaman, dan antarindividu berbeda-beda tergantung lingkungan serta pendapatan.$$)),
(gen_random_uuid(), 'bc3743d9-8117-4cd2-b811-f64a0a1209aa', 'HEADING', 5, jsonb_build_object('text', $$Macam-macam Kebutuhan$$)),
(gen_random_uuid(), 'bc3743d9-8117-4cd2-b811-f64a0a1209aa', 'PARAGRAPH', 6, jsonb_build_object('text', $$Menurut intensitasnya: kebutuhan PRIMER (sandang, pangan, papan — wajib terpenuhi), SEKUNDER (TV, sepeda motor — menunjang kenyamanan), dan TERSIER (perhiasan, mobil mewah — kemewahan). Menurut sifatnya: jasmani (makan, pakaian) dan rohani (ibadah, rekreasi, pendidikan).$$)),
(gen_random_uuid(), 'bc3743d9-8117-4cd2-b811-f64a0a1209aa', 'HEADING', 7, jsonb_build_object('text', $$Kelangkaan (Scarcity)$$)),
(gen_random_uuid(), 'bc3743d9-8117-4cd2-b811-f64a0a1209aa', 'PARAGRAPH', 8, jsonb_build_object('text', $$Kelangkaan adalah kondisi ketika sumber daya terbatas sedangkan kebutuhan tidak terbatas. Inilah masalah pokok ekonomi. Karena langka, manusia harus MEMILIH — dan setiap pilihan punya BIAYA PELUANG (opportunity cost): nilai alternatif terbaik yang dikorbankan. Contoh: uang Rp50 ribu dipakai beli buku, maka biaya peluangnya adalah jajan yang tidak jadi dibeli.$$)),
(gen_random_uuid(), 'bc3743d9-8117-4cd2-b811-f64a0a1209aa', 'HEADING', 9, jsonb_build_object('text', $$Contoh Kelangkaan di Sekitar Kita$$)),
(gen_random_uuid(), 'bc3743d9-8117-4cd2-b811-f64a0a1209aa', 'LIST', 10, jsonb_build_object('items', ARRAY[$$Air bersih saat musim kemarau — sumur kering, harga air galon naik$$, $$Kursi di kelas favorit — pendaftar lebih banyak dari bangku tersedia$$, $$Waktu 24 jam sehari — dipakai belajar berarti tidak bisa dipakai bermain$$])),
(gen_random_uuid(), 'bc3743d9-8117-4cd2-b811-f64a0a1209aa', 'HEADING', 11, jsonb_build_object('text', $$Latihan Soal$$)),
(gen_random_uuid(), 'bc3743d9-8117-4cd2-b811-f64a0a1209aa', 'PARAGRAPH', 12, jsonb_build_object('text', $$1. Sebutkan 3 contoh kebutuhan primer dan 3 contoh kebutuhan tersier! 2. Jelaskan apa yang dimaksud biaya peluang beserta contohnya! 3. Mengapa kelangkaan disebut masalah pokok ekonomi? — Kunci: 1. Primer: beras, pakaian seragam, rumah; Tersier: jam tangan mewah, mobil sport, perhiasan berlian. 2. Biaya peluang = nilai alternatif terbaik yang dikorbankan saat memilih; contoh: memilih les matematika berarti mengorbankan waktu bermain. 3. Karena sumber daya terbatas sedangkan kebutuhan manusia tidak terbatas, sehingga manusia terpaksa memilih dan mengorbankan alternatif lain.$$))
ON CONFLICT (id) DO NOTHING;

-- ============ 6. SCH-SD-PKN-001: Pancasila ============
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, status, created_by, updated_by)
VALUES ('49bf6b0f-1352-425f-bddf-b604b110e54d', 'SCH-SD-PKN-001', 'd1000003-0000-0000-0000-000000000003',
'PKN Kelas 3: Pancasila dan Pengamalannya', 'pkn-kelas-3-pancasila',
'Materi PKN kelas 3 SD: mengenal Pancasila, lima silanya, dan contoh pengamalan dalam kehidupan sehari-hari.',
'id', 6, 'DRAFT', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (id) DO NOTHING;

INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
(gen_random_uuid(), '49bf6b0f-1352-425f-bddf-b604b110e54d', 'HEADING', 1, jsonb_build_object('text', $$Tujuan Pembelajaran$$)),
(gen_random_uuid(), '49bf6b0f-1352-425f-bddf-b604b110e54d', 'PARAGRAPH', 2, jsonb_build_object('text', $$Setelah belajar, kamu diharapkan bisa: (1) menyebutkan bunyi lima sila Pancasila dengan benar, (2) menjelaskan arti setiap sila dengan bahasa sendiri, (3) memberi contoh pengamalan Pancasila di rumah dan di sekolah.$$)),
(gen_random_uuid(), '49bf6b0f-1352-425f-bddf-b604b110e54d', 'HEADING', 3, jsonb_build_object('text', $$Apa itu Pancasila?$$)),
(gen_random_uuid(), '49bf6b0f-1352-425f-bddf-b604b110e54d', 'PARAGRAPH', 4, jsonb_build_object('text', $$Pancasila adalah dasar negara Indonesia. Kata "Pancasila" berasal dari bahasa Sanskerta: panca artinya lima, sila artinya dasar atau prinsip. Pancasila digali oleh Ir. Soekarno dan ditetapkan sebagai dasar negara pada 18 Agustus 1945, sehari setelah kemerdekaan.$$)),
(gen_random_uuid(), '49bf6b0f-1352-425f-bddf-b604b110e54d', 'HEADING', 5, jsonb_build_object('text', $$Sila Pertama dan Kedua$$)),
(gen_random_uuid(), '49bf6b0f-1352-425f-bddf-b604b110e54d', 'PARAGRAPH', 6, jsonb_build_object('text', $$Sila 1: Ketuhanan Yang Maha Esa — kita wajib beribadah sesuai agama masing-masing dan menghormati teman yang berbeda agama. Lambangnya bintang. Sila 2: Kemanusiaan yang Adil dan Beradab — kita harus saling menolong dan bersikap adil kepada siapa pun. Lambangnya rantai.$$)),
(gen_random_uuid(), '49bf6b0f-1352-425f-bddf-b604b110e54d', 'HEADING', 7, jsonb_build_object('text', $$Sila Ketiga, Keempat, dan Kelima$$)),
(gen_random_uuid(), '49bf6b0f-1352-425f-bddf-b604b110e54d', 'PARAGRAPH', 8, jsonb_build_object('text', $$Sila 3: Persatuan Indonesia (lambang pohon beringin) — kita cinta tanah air dan rukun dengan semua suku. Sila 4: Kerakyatan yang Dipimpin oleh Hikmat Kebijaksanaan dalam Permusyawaratan/Perwakilan (lambang kepala banteng) — menyelesaikan masalah dengan musyawarah. Sila 5: Keadilan Sosial bagi Seluruh Rakyat Indonesia (lambang padi dan kapas) — bersikap adil dan suka berbagi.$$)),
(gen_random_uuid(), '49bf6b0f-1352-425f-bddf-b604b110e54d', 'HEADING', 9, jsonb_build_object('text', $$Pengamalan di Rumah dan Sekolah$$)),
(gen_random_uuid(), '49bf6b0f-1352-425f-bddf-b604b110e54d', 'LIST', 10, jsonb_build_object('items', ARRAY[$$Berdoa sebelum belajar (sila 1)$$, $$Menolong teman yang jatuh (sila 2)$$, $$Ikut upacara bendera dengan tertib (sila 3)$$, $$Bermusyawarah memilih ketua kelas (sila 4)$$, $$Berbagi bekal dengan teman (sila 5)$$])),
(gen_random_uuid(), '49bf6b0f-1352-425f-bddf-b604b110e54d', 'HEADING', 11, jsonb_build_object('text', $$Latihan Soal$$)),
(gen_random_uuid(), '49bf6b0f-1352-425f-bddf-b604b110e54d', 'PARAGRAPH', 12, jsonb_build_object('text', $$1. Sebutkan bunyi sila ke-3 Pancasila! 2. Apa lambang sila ke-2? 3. Beri 2 contoh pengamalan sila ke-5 di sekolah! — Kunci: 1. Persatuan Indonesia. 2. Rantai. 3. Contoh: berbagi bekal, antre dengan tertib, tidak membeda-bedakan teman.$$))
ON CONFLICT (id) DO NOTHING;
