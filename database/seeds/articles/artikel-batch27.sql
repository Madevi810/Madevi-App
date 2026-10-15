-- Batch 27 artikel Madevi
-- Owner: f7125028-187e-44e0-b95b-88b69b8d5c9a

-- ===== 1. TUT-KOMPUTER2-001: Backup Data =====
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, status, created_by, updated_by)
VALUES ('2c5504b5-11e6-46ec-98ff-567e981852b0', 'TUT-KOMPUTER2-001', 'baaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
'Backup Data: Jangan Sampai Menyesal', 'backup-data-jangan-sampai-menyesal',
'Panduan lengkap mencadangkan data penting: metode 3-2-1, pilihan media, dan cara memulihkan data saat bencana.', 'id', 8, 'DRAFT',
'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (id) DO NOTHING;

INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
(gen_random_uuid(), '2c5504b5-11e6-46ec-98ff-567e981852b0', 'HEADING', 1, jsonb_build_object('text', 'Masalah: Data Penting Hilang Tanpa Cadangan')),
(gen_random_uuid(), '2c5504b5-11e6-46ec-98ff-567e981852b0', 'PARAGRAPH', 2, jsonb_build_object('text', 'Harddisk rusak, HP hilang, atau ransomware menyerang — semua data hilang karena tidak pernah dibackup. Foto keluarga, dokumen kerja, tugas sekolah: lenyap tanpa jejak.')),
(gen_random_uuid(), '2c5504b5-11e6-46ec-98ff-567e981852b0', 'HEADING', 3, jsonb_build_object('text', 'Penjelasan: Aturan 3-2-1')),
(gen_random_uuid(), '2c5504b5-11e6-46ec-98ff-567e981852b0', 'PARAGRAPH', 4, jsonb_build_object('text', 'Aturan emas backup: 3 salinan data, di 2 media berbeda, 1 di lokasi berbeda (misalnya cloud). Satu salinan saja tidak cukup — harddisk eksternal pun bisa rusak.')),
(gen_random_uuid(), '2c5504b5-11e6-46ec-98ff-567e981852b0', 'HEADING', 5, jsonb_build_object('text', 'Persiapan Alat')),
(gen_random_uuid(), '2c5504b5-11e6-46ec-98ff-567e981852b0', 'LIST', 6, jsonb_build_object('items', ARRAY['Harddisk eksternal atau SSD (1-2 TB)', 'Akun cloud gratis: Google Drive 15 GB, OneDrive 5 GB, Mega 20 GB', 'Aplikasi sinkronisasi (opsional): Duplicati, FreeFileSync'])),
(gen_random_uuid(), '2c5504b5-11e6-46ec-98ff-567e981852b0', 'HEADING', 7, jsonb_build_object('text', 'Langkah')),
(gen_random_uuid(), '2c5504b5-11e6-46ec-98ff-567e981852b0', 'LIST', 8, jsonb_build_object('items', ARRAY['1. Pisahkan data penting: dokumen, foto, pekerjaan — taruh dalam satu folder "PENTING"', '2. Salin folder PENTING ke harddisk eksternal', '3. Unggah salinan yang sama ke layanan cloud', '4. Aktifkan backup otomatis (Google Backup & Sync / OneDrive folder sync)', '5. Jadwalkan pengingat bulanan untuk mengecek backup'])),
(gen_random_uuid(), '2c5504b5-11e6-46ec-98ff-567e981852b0', 'HEADING', 9, jsonb_build_object('text', 'Risiko')),
(gen_random_uuid(), '2c5504b5-11e6-46ec-98ff-567e981852b0', 'PARAGRAPH', 10, jsonb_build_object('text', 'Jangan menyimpan semua salinan di satu rumah jika ada risiko kebakaran/banjir — cloud mengatasi ini. Hati-hati dengan privasi: enkripsi file sensitif sebelum diunggah ke cloud.')),
(gen_random_uuid(), '2c5504b5-11e6-46ec-98ff-567e981852b0', 'HEADING', 11, jsonb_build_object('text', 'Penyelesaian: Tes Pemulihan')),
(gen_random_uuid(), '2c5504b5-11e6-46ec-98ff-567e981852b0', 'PARAGRAPH', 12, jsonb_build_object('text', 'Backup yang tidak pernah diuji sama dengan tidak ada backup. Sesekali unduh satu file dari cloud dan buka — pastikan tidak rusak. Mulai hari ini, bukan setelah kehilangan data.'));

-- ===== 2. TUT-MASAK3-001: Sambal Bawang =====
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, status, created_by, updated_by)
VALUES ('d135b877-fa5a-4f91-8742-43c2721741e6', 'TUT-MASAK3-001', 'b2222222-2222-2222-2222-222222222222',
'Sambal Bawang: Resep Pedas Nikmat', 'sambal-bawang-resep-pedas-nikmat',
'Resep sambal bawang ala rumahan: bahan sederhana, langkah jelas, plus tips agar awet dan tidak pahit.', 'id', 6, 'DRAFT',
'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (id) DO NOTHING;

INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
(gen_random_uuid(), 'd135b877-fa5a-4f91-8742-43c2721741e6', 'HEADING', 1, jsonb_build_object('text', 'Masalah: Sambal Bawang Pahit atau Cepat Basi')),
(gen_random_uuid(), 'd135b877-fa5a-4f91-8742-43c2721741e6', 'PARAGRAPH', 2, jsonb_build_object('text', 'Sambal bawang sering gagal: pahit karena bawang gosong, atau basi dalam sehari karena minyak kurang panas dan wadah tidak steril.')),
(gen_random_uuid(), 'd135b877-fa5a-4f91-8742-43c2721741e6', 'HEADING', 3, jsonb_build_object('text', 'Penjelasan: Kunci Rasa dan Awet')),
(gen_random_uuid(), 'd135b877-fa5a-4f91-8742-43c2721741e6', 'PARAGRAPH', 4, jsonb_build_object('text', 'Rasa sambal bawang datang dari bawang putih yang digoreng pas (keemasan, tidak cokelat), cabai rawit segar, dan minyak panas yang "mematangkan" sambal. Minyak yang cukup juga jadi pengawet alami.')),
(gen_random_uuid(), 'd135b877-fa5a-4f91-8742-43c2721741e6', 'HEADING', 5, jsonb_build_object('text', 'Persiapan Alat dan Bahan')),
(gen_random_uuid(), 'd135b877-fa5a-4f91-8742-43c2721741e6', 'LIST', 6, jsonb_build_object('items', ARRAY['15 siung bawang putih, iris tipis', '20 buah cabai rawit merah (sesuai selera)', '1 sdt garam, 1 sdt gula pasir', '200 ml minyak goreng', 'Cobek atau chopper, wajan, botol kaca steril'])),
(gen_random_uuid(), 'd135b877-fa5a-4f91-8742-43c2721741e6', 'HEADING', 7, jsonb_build_object('text', 'Langkah')),
(gen_random_uuid(), 'd135b877-fa5a-4f91-8742-43c2721741e6', 'LIST', 8, jsonb_build_object('items', ARRAY['1. Goreng irisan bawang putih dengan api kecil hingga keemasan, angkat dan tiriskan', '2. Ulek kasar cabai rawit, bawang putih goreng, garam, dan gula', '3. Panaskan minyak hingga benar-benar panas (berasap tipis), lalu siram ke atas ulekan', '4. Aduk rata, biarkan dingin, masukkan ke botol kaca'])),
(gen_random_uuid(), 'd135b877-fa5a-4f91-8742-43c2721741e6', 'HEADING', 9, jsonb_build_object('text', 'Risiko')),
(gen_random_uuid(), 'd135b877-fa5a-4f91-8742-43c2721741e6', 'PARAGRAPH', 10, jsonb_build_object('text', 'Hati-hati saat menyiram minyak panas — bisa muncrat. Gunakan sendok bergagang panjang. Jangan memasukkan sambal hangat ke botol tertutup; uap air mempercepat basi.')),
(gen_random_uuid(), 'd135b877-fa5a-4f91-8742-43c2721741e6', 'HEADING', 11, jsonb_build_object('text', 'Penyelesaian: Penyimpanan')),
(gen_random_uuid(), 'd135b877-fa5a-4f91-8742-43c2721741e6', 'PARAGRAPH', 12, jsonb_build_object('text', 'Sambal bawang tahan 2-4 minggu di suhu ruang jika terendam minyak dan wadah steril, lebih lama di kulkas. Ambil dengan sendok kering dan bersih setiap kali.'));

-- ===== 3. EXP-MATEMATIKA3-001: Bilangan Prima =====
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, status, created_by, updated_by)
VALUES ('767be3b8-36af-40ac-97bf-58f17f2523a7', 'EXP-MATEMATIKA3-001', 'c5555555-5555-5555-5555-555555555555',
'Bilangan Prima: Misteri Tak Terpecahkan', 'bilangan-prima-misteri-tak-terpecahkan',
'Mengenal bilangan prima: definisi, cara menemukan, sebaran misterius, dan perannya dalam keamanan digital modern.', 'id', 7, 'DRAFT',
'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (id) DO NOTHING;

INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
(gen_random_uuid(), '767be3b8-36af-40ac-97bf-58f17f2523a7', 'HEADING', 1, jsonb_build_object('text', 'Apa Itu Bilangan Prima?')),
(gen_random_uuid(), '767be3b8-36af-40ac-97bf-58f17f2523a7', 'PARAGRAPH', 2, jsonb_build_object('text', 'Bilangan prima adalah bilangan asli lebih dari 1 yang hanya habis dibagi 1 dan dirinya sendiri. Contoh: 2, 3, 5, 7, 11, 13. Angka 1 bukan prima, angka 4 bukan prima karena habis dibagi 2.')),
(gen_random_uuid(), '767be3b8-36af-40ac-97bf-58f17f2523a7', 'HEADING', 3, jsonb_build_object('text', 'Saringan Eratosthenes')),
(gen_random_uuid(), '767be3b8-36af-40ac-97bf-58f17f2523a7', 'PARAGRAPH', 4, jsonb_build_object('text', 'Cara kuno menemukan prima: tulis angka 2 sampai N, coret kelipatan 2, lalu kelipatan 3, kelipatan 5, dan seterusnya. Yang tersisa adalah prima. Metode dari Yunani kuno ini masih dipakai komputer modern dalam bentuk yang dioptimasi.')),
(gen_random_uuid(), '767be3b8-36af-40ac-97bf-58f17f2523a7', 'HEADING', 5, jsonb_build_object('text', 'Ada Berapa Banyak?')),
(gen_random_uuid(), '767be3b8-36af-40ac-97bf-58f17f2523a7', 'PARAGRAPH', 6, jsonb_build_object('text', 'Euclid membuktikan 2.300 tahun lalu bahwa bilangan prima tidak ada habisnya. Namun sebarannya misterius: kadang berdekatan (11 dan 13), kadang berjauhan ratusan angka. Pola pastinya belum ditemukan.')),
(gen_random_uuid(), '767be3b8-36af-40ac-97bf-58f17f2523a7', 'HEADING', 7, jsonb_build_object('text', 'Hipotesis Riemann')),
(gen_random_uuid(), '767be3b8-36af-40ac-97bf-58f17f2523a7', 'PARAGRAPH', 8, jsonb_build_object('text', 'Hipotesis Riemann (1859) mengklaim pola tersembunyi di balik sebaran prima. Belum terbukti hingga kini dan menjadi salah satu Masalah Milenium berhadiah 1 juta dolar. Jika terbukti, banyak hal tentang prima akan terungkap.')),
(gen_random_uuid(), '767be3b8-36af-40ac-97bf-58f17f2523a7', 'HEADING', 9, jsonb_build_object('text', 'Prima Melindungi Internet')),
(gen_random_uuid(), '767be3b8-36af-40ac-97bf-58f17f2523a7', 'PARAGRAPH', 10, jsonb_build_object('text', 'Enkripsi RSA memakai dua prima raksasa (ratusan digit). Mengalikan mudah, memfaktorkan kembali nyaris mustahil — inilah yang menjaga password dan transaksi bank Anda aman setiap hari.'));

-- ===== 4. EXP-SEJARAH4-001: Perang Diponegoro =====
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, status, created_by, updated_by)
VALUES ('46f93b96-4c71-4feb-b370-00a13e8826b3', 'EXP-SEJARAH4-001', 'c8888888-8888-8888-8888-888888888888',
'Perang Diponegoro: Perlawanan Terbesar', 'perang-diponegoro-perlawanan-terbesar',
'Kisah Perang Jawa 1825-1830: sebab meletusnya, strategi gerilya Diponegoro, dan dampaknya bagi Indonesia dan Belanda.', 'id', 7, 'DRAFT',
'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (id) DO NOTHING;

INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
(gen_random_uuid(), '46f93b96-4c71-4feb-b370-00a13e8826b3', 'HEADING', 1, jsonb_build_object('text', 'Latar Belakang')),
(gen_random_uuid(), '46f93b96-4c71-4feb-b370-00a13e8826b3', 'PARAGRAPH', 2, jsonb_build_object('text', 'Awal abad ke-19, Belanda di bawah Daendels dan Raffles memaksakan pajak tanah dan sewa tanah yang memberatkan rakyat Jawa. Pangeran Diponegoro, putra Sultan Hamengkubuwono III, muak melihat bangsawan Jawa tunduk pada Belanda dan rakyat menderita.')),
(gen_random_uuid(), '46f93b96-4c71-4feb-b370-00a13e8826b3', 'HEADING', 3, jsonb_build_object('text', 'Pemicu: Patok Jalan Tegalrejo')),
(gen_random_uuid(), '46f93b96-4c71-4feb-b370-00a13e8826b3', 'PARAGRAPH', 4, jsonb_build_object('text', 'Pada 1825, Belanda memasang patok untuk membangun jalan melewati makam leluhur Diponegoro di Tegalrejo tanpa izin. Bagi Diponegoro ini penghinaan terakhir — ia menyatakan perang suci melawan Belanda.')),
(gen_random_uuid(), '46f93b96-4c71-4feb-b370-00a13e8826b3', 'HEADING', 5, jsonb_build_object('text', 'Strategi Gerilya')),
(gen_random_uuid(), '46f93b96-4c71-4feb-b370-00a13e8826b3', 'PARAGRAPH', 6, jsonb_build_object('text', 'Diponegoro menghindari pertempuran terbuka melawan tentara Belanda yang bersenjata modern. Ia memakai taktik gerilya: serangan kilat, lalu menghilang ke hutan dan desa. Rakyat mendukung penuh — memberi makanan, informasi, dan tempat sembunyi.')),
(gen_random_uuid(), '46f93b96-4c71-4feb-b370-00a13e8826b3', 'HEADING', 7, jsonb_build_object('text', 'Lima Tahun Perang')),
(gen_random_uuid(), '46f93b96-4c71-4feb-b370-00a13e8826b3', 'PARAGRAPH', 8, jsonb_build_object('text', 'Perang berlangsung 1825-1830 dan meluas ke seluruh Jawa Tengah dan Timur. Belanda mengerahkan 50.000 tentara dengan biaya 20 juta gulden — perang termahal mereka di Hindia Belanda. Benteng-benteng Belanda (benteng stelsel) dibangun untuk mempersempit ruang gerak Diponegoro.')),
(gen_random_uuid(), '46f93b96-4c71-4feb-b370-00a13e8826b3', 'HEADING', 9, jsonb_build_object('text', 'Akhir Perang dan Dampaknya')),
(gen_random_uuid(), '46f93b96-4c71-4feb-b370-00a13e8826b3', 'PARAGRAPH', 10, jsonb_build_object('text', 'Tahun 1830 Diponegoro ditangkap lewat tipu muslihat perundingan di Magelang, lalu diasingkan ke Manado dan Makassar hingga wafat 1855. Akibat kekalahan ini, Belanda menerapkan Tanam Paksa (Cultuurstelsel) — penderitaan baru bagi rakyat Jawa. Namun semangat perlawanan Diponegoro menjadi inspirasi perjuangan kemerdekaan Indonesia.'));

-- ===== 5. SCH-SMP-FIS-001: Gaya dan Hukum Newton =====
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, status, created_by, updated_by)
VALUES ('12e57e79-928d-4394-8ad2-3e513e3ac9d5', 'SCH-SMP-FIS-001', 'd4444444-4444-4444-4444-444444444444',
'IPA Kelas 8: Gaya dan Hukum Newton', 'ipa-kelas-8-gaya-dan-hukum-newton',
'Materi IPA kelas 8: pengertian gaya, tiga hukum Newton, dengan contoh soal dan latihan beserta kunci jawaban.', 'id', 9, 'DRAFT',
'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (id) DO NOTHING;

INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
(gen_random_uuid(), '12e57e79-928d-4394-8ad2-3e513e3ac9d5', 'HEADING', 1, jsonb_build_object('text', 'Tujuan Pembelajaran')),
(gen_random_uuid(), '12e57e79-928d-4394-8ad2-3e513e3ac9d5', 'PARAGRAPH', 2, jsonb_build_object('text', 'Setelah mempelajari materi ini, siswa mampu menjelaskan pengertian gaya, menyebutkan tiga hukum Newton, dan menghitung gaya dengan rumus F = m × a.')),
(gen_random_uuid(), '12e57e79-928d-4394-8ad2-3e513e3ac9d5', 'HEADING', 3, jsonb_build_object('text', 'Apa Itu Gaya?')),
(gen_random_uuid(), '12e57e79-928d-4394-8ad2-3e513e3ac9d5', 'PARAGRAPH', 4, jsonb_build_object('text', 'Gaya adalah tarikan atau dorongan yang dapat mengubah bentuk, arah, atau kecepatan benda. Satuannya newton (N), diambil dari nama Isaac Newton. Contoh: gaya otot saat mendorong meja, gaya gravitasi yang menarik buah jatuh.')),
(gen_random_uuid(), '12e57e79-928d-4394-8ad2-3e513e3ac9d5', 'HEADING', 5, jsonb_build_object('text', 'Hukum I Newton: Kelembaman')),
(gen_random_uuid(), '12e57e79-928d-4394-8ad2-3e513e3ac9d5', 'PARAGRAPH', 6, jsonb_build_object('text', 'Benda cenderung mempertahankan keadaannya: yang diam tetap diam, yang bergerak lurus beraturan tetap bergerak — kecuali ada gaya luar. Contoh: penumpang terdorong ke depan saat bus direm mendadak.')),
(gen_random_uuid(), '12e57e79-928d-4394-8ad2-3e513e3ac9d5', 'HEADING', 7, jsonb_build_object('text', 'Hukum II Newton: F = m × a')),
(gen_random_uuid(), '12e57e79-928d-4394-8ad2-3e513e3ac9d5', 'PARAGRAPH', 8, jsonb_build_object('text', 'Percepatan benda sebanding dengan gaya dan berbanding terbalik dengan massa: F = m × a. Contoh: gaya 10 N pada massa 2 kg menghasilkan percepatan a = F/m = 10/2 = 5 m/s².')),
(gen_random_uuid(), '12e57e79-928d-4394-8ad2-3e513e3ac9d5', 'HEADING', 9, jsonb_build_object('text', 'Hukum III Newton: Aksi-Reaksi')),
(gen_random_uuid(), '12e57e79-928d-4394-8ad2-3e513e3ac9d5', 'PARAGRAPH', 10, jsonb_build_object('text', 'Setiap aksi menimbulkan reaksi yang sama besar dan berlawanan arah. Contoh: roket melesat ke atas karena gas didorong ke bawah; saat berenang, tangan mendorong air ke belakang, tubuh melaju ke depan.')),
(gen_random_uuid(), '12e57e79-928d-4394-8ad2-3e513e3ac9d5', 'HEADING', 11, jsonb_build_object('text', 'Latihan Soal')),
(gen_random_uuid(), '12e57e79-928d-4394-8ad2-3e513e3ac9d5', 'LIST', 12, jsonb_build_object('items', ARRAY['1. Sebuah benda 5 kg didorong gaya 20 N. Berapa percepatannya? Kunci: a = F/m = 20/5 = 4 m/s².', '2. Sebutkan contoh Hukum I Newton dalam kehidupan sehari-hari! Kunci: gelas di atas meja tetap diam; penumpang bus terdorong saat bus berhenti mendadak.', '3. Mengapa pendayung perahu mendorong air ke belakang? Kunci: Hukum III Newton — aksi mendorong air ke belakang menimbulkan reaksi yang mendorong perahu ke depan.']));

-- ===== 6. SCH-SD-MAT6-001: Pengurangan Bersusun =====
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, status, created_by, updated_by)
VALUES ('5e9c6a16-26ba-4b70-a320-53c3b89ebe5b', 'SCH-SD-MAT6-001', 'd1000002-0000-0000-0000-000000000002',
'Matematika Kelas 2: Pengurangan Bersusun', 'matematika-kelas-2-pengurangan-bersusun',
'Materi matematika kelas 2 SD: cara mengurangkan bilangan dengan teknik bersusun dan meminjam, plus latihan dan kunci jawaban.', 'id', 8, 'DRAFT',
'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (id) DO NOTHING;

INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
(gen_random_uuid(), '5e9c6a16-26ba-4b70-a320-53c3b89ebe5b', 'HEADING', 1, jsonb_build_object('text', 'Tujuan Pembelajaran')),
(gen_random_uuid(), '5e9c6a16-26ba-4b70-a320-53c3b89ebe5b', 'PARAGRAPH', 2, jsonb_build_object('text', 'Siswa mampu mengurangkan bilangan dua angka dengan cara bersusun, termasuk teknik meminjam (borrowing) saat angka atas lebih kecil dari angka bawah.')),
(gen_random_uuid(), '5e9c6a16-26ba-4b70-a320-53c3b89ebe5b', 'HEADING', 3, jsonb_build_object('text', 'Pengurangan Bersusun Sederhana')),
(gen_random_uuid(), '5e9c6a16-26ba-4b70-a320-53c3b89ebe5b', 'PARAGRAPH', 4, jsonb_build_object('text', 'Tulis angka sejajar: satuan di bawah satuan, puluhan di bawah puluhan. Kurangkan dari kanan (satuan) ke kiri (puluhan). Contoh: 47 − 23. Satuan: 7 − 3 = 4. Puluhan: 4 − 2 = 2. Hasil: 24.')),
(gen_random_uuid(), '5e9c6a16-26ba-4b70-a320-53c3b89ebe5b', 'HEADING', 5, jsonb_build_object('text', 'Teknik Meminjam')),
(gen_random_uuid(), '5e9c6a16-26ba-4b70-a320-53c3b89ebe5b', 'PARAGRAPH', 6, jsonb_build_object('text', 'Jika angka atas lebih kecil, pinjam 1 puluhan dari kiri (= 10 satuan). Contoh: 52 − 28. Satuan: 2 − 8 tidak bisa, pinjam dari 5 → 12 − 8 = 4. Puluhan tinggal 4, lalu 4 − 2 = 2. Hasil: 24.')),
(gen_random_uuid(), '5e9c6a16-26ba-4b70-a320-53c3b89ebe5b', 'HEADING', 7, jsonb_build_object('text', 'Contoh Langkah Demi Langkah')),
(gen_random_uuid(), '5e9c6a16-26ba-4b70-a320-53c3b89ebe5b', 'LIST', 8, jsonb_build_object('items', ARRAY['Soal: 81 − 46', 'Satuan: 1 − 6 tidak bisa → pinjam → 11 − 6 = 5', 'Puluhan: 8 dipinjam 1 tinggal 7 → 7 − 4 = 3', 'Hasil: 35', 'Cek: 35 + 46 = 81 ✓ (benar!)'])),
(gen_random_uuid(), '5e9c6a16-26ba-4b70-a320-53c3b89ebe5b', 'HEADING', 9, jsonb_build_object('text', 'Tips Cepat')),
(gen_random_uuid(), '5e9c6a16-26ba-4b70-a320-53c3b89ebe5b', 'PARAGRAPH', 10, jsonb_build_object('text', 'Selalu cek jawaban dengan penjumlahan balik: hasil + pengurang harus sama dengan bilangan awal. Tulis angka rapi dan sejajar agar tidak salah kolom.')),
(gen_random_uuid(), '5e9c6a16-26ba-4b70-a320-53c3b89ebe5b', 'HEADING', 11, jsonb_build_object('text', 'Latihan Soal')),
(gen_random_uuid(), '5e9c6a16-26ba-4b70-a320-53c3b89ebe5b', 'LIST', 12, jsonb_build_object('items', ARRAY['1. 65 − 38 = ? Kunci: 27 (satuan: 15−8=7, puluhan: 5−3=2)', '2. 90 − 47 = ? Kunci: 43 (satuan: 10−7=3, puluhan: 8−4=4)', '3. Ibu punya 73 apel, 29 diberikan ke tetangga. Sisa berapa? Kunci: 44 apel (73−29, satuan: 13−9=4, puluhan: 6−2=4)']));
