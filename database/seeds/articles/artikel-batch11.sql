-- Artikel konten Madevi batch 11 — 2026-10-13
-- Owner principal: f7125028-187e-44e0-b95b-88b69b8d5c9a

-- ============ 1. TUT-BAHASA-001 ============
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, status, created_by, updated_by)
VALUES ('b1111111-2222-3333-4444-555555555551', 'TUT-BAHASA-001', 'b6666666-6666-6666-6666-666666666666',
'Belajar Bahasa Inggris dari Nol: Roadmap 3 Bulan', 'belajar-bahasa-inggris-dari-nol-roadmap-3-bulan',
'Panduan belajar bahasa Inggris dari nol sampai bisa percakapan dasar dalam 3 bulan: target harian, metode, dan kesalahan umum yang harus dihindari.',
'id', 9, 'DRAFT', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (id) DO NOTHING;

INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
(gen_random_uuid(), 'b1111111-2222-3333-4444-555555555551', 'HEADING', 1, jsonb_build_object('text', $$Masalah: Ingin Bisa Bahasa Inggris tapi Bingung Mulai$$)),
(gen_random_uuid(), 'b1111111-2222-3333-4444-555555555551', 'PARAGRAPH', 2, jsonb_build_object('text', $$Banyak orang ingin bisa bahasa Inggris untuk kerja atau kuliah, tetapi mandek karena tidak tahu harus mulai dari mana, takut grammar, dan merasa sudah terlambat. Akibatnya belajar jalan di tempat bertahun-tahun.$$)),
(gen_random_uuid(), 'b1111111-2222-3333-4444-555555555551', 'HEADING', 3, jsonb_build_object('text', $$Penjelasan: Bahasa Inggris = Keterampilan, Bukan Pelajaran$$)),
(gen_random_uuid(), 'b1111111-2222-3333-4444-555555555551', 'PARAGRAPH', 4, jsonb_build_object('text', $$Bahasa adalah keterampilan seperti berenang — dikuasai lewat latihan, bukan hafalan teori. Penelitian menunjukkan 30 menit latihan aktif setiap hari jauh lebih efektif daripada 3 jam belajar pasif seminggu sekali. Target realistis 3 bulan: percakapan dasar sehari-hari, bukan fasih seperti penutur asli.$$)),
(gen_random_uuid(), 'b1111111-2222-3333-4444-555555555551', 'HEADING', 5, jsonb_build_object('text', $$Alat yang Dibutuhkan$$)),
(gen_random_uuid(), 'b1111111-2222-3333-4444-555555555551', 'LIST', 6, jsonb_build_object('items', ARRAY[$$Aplikasi kamus (gratis)$$, $$Aplikasi latihan kosakata dengan pengulangan terjadwal (spaced repetition)$$, $$Buku catatan kecil atau aplikasi catatan$$, $$Akses video/serial berbahasa Inggris dengan subtitle$$])),
(gen_random_uuid(), 'b1111111-2222-3333-4444-555555555551', 'HEADING', 7, jsonb_build_object('text', $$Roadmap 3 Bulan$$)),
(gen_random_uuid(), 'b1111111-2222-3333-4444-555555555551', 'LIST', 8, jsonb_build_object('items', ARRAY[$$Bulan 1 — Fondasi: hafalkan 300 kata paling sering dipakai + pola kalimat S-V-O. Latihan: sebutkan benda di sekitarmu dalam bahasa Inggris.$$ , $$Bulan 2 — Percakapan: kuasai 5 tenses dasar (present, past, future, continuous, perfect sederhana). Latihan: ceritakan kegiatan harianmu 2 menit setiap pagi.$$ , $$Bulan 3 — Kelancaran: tonton video tanpa subtitle Indonesia, tirukan (shadowing) 10 menit sehari. Latihan: cari teman latihan atau bicara sendiri di depan cermin.$$])),
(gen_random_uuid(), 'b1111111-2222-3333-4444-555555555551', 'HEADING', 9, jsonb_build_object('text', $$Risiko / Kesalahan Umum$$)),
(gen_random_uuid(), 'b1111111-2222-3333-4444-555555555551', 'PARAGRAPH', 10, jsonb_build_object('text', $$Jangan menghafal grammar tanpa praktik bicara — itu jebakan terbesar pemula. Jangan menunggu "siap" untuk mulai bicara; keberanian bicara dengan salah lebih berharga daripada diam menunggu sempurna. Hindari gonta-ganti metode tiap minggu; konsistensi mengalahkan metode terbaik.$$)),
(gen_random_uuid(), 'b1111111-2222-3333-4444-555555555551', 'HEADING', 11, jsonb_build_object('text', $$Penyelesaian: Target Terukur$$)),
(gen_random_uuid(), 'b1111111-2222-3333-4444-555555555551', 'PARAGRAPH', 12, jsonb_build_object('text', $$Setelah 3 bulan, ukur hasil: bisakah kamu memperkenalkan diri, memesan makanan, dan bertanya arah dalam bahasa Inggris? Jika ya, fondasimu kuat — lanjutkan ke level menengah (menulis email, presentasi). Jika belum, ulangi bulan 2 dengan menambah jam praktik bicara, bukan menambah teori.$$));

-- ============ 2. TUT-KOMUNIKASI-001 ============
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, status, created_by, updated_by)
VALUES ('b1111111-2222-3333-4444-555555555552', 'TUT-KOMUNIKASI-001', 'b3333333-3333-3333-3333-333333333333',
'Public Speaking: Hilangkan Grogi dalam 7 Hari', 'public-speaking-hilangkan-grogi-7-hari',
'Program latihan 7 hari untuk mengatasi grogi bicara di depan umum: teknik napas, struktur materi, dan simulasi bertahap.',
'id', 8, 'DRAFT', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (id) DO NOTHING;

INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
(gen_random_uuid(), 'b1111111-2222-3333-4444-555555555552', 'HEADING', 1, jsonb_build_object('text', $$Masalah: Grogi Saat Bicara di Depan Umum$$)),
(gen_random_uuid(), 'b1111111-2222-3333-4444-555555555552', 'PARAGRAPH', 2, jsonb_build_object('text', $$Jantung berdebar, tangan berkeringat, suara bergetar, pikiran blank — hampir semua orang pernah merasakannya saat presentasi, wawancara, atau pidato. Grogi bukan tanda tidak mampu; itu respons tubuh yang normal dan bisa dilatih.$$)),
(gen_random_uuid(), 'b1111111-2222-3333-4444-555555555552', 'HEADING', 3, jsonb_build_object('text', $$Penjelasan: Kenapa Kita Grogi$$)),
(gen_random_uuid(), 'b1111111-2222-3333-4444-555555555552', 'PARAGRAPH', 4, jsonb_build_object('text', $$Otak menganggap "dinilai banyak orang" sebagai ancaman, lalu memicu adrenalin. Adrenalin sebenarnya menambah energi — masalahnya muncul saat kita melawannya, bukan menyalurkannya. Pembicara hebat bukan yang tidak grogi, melainkan yang tahu cara memakai energi itu.$$)),
(gen_random_uuid(), 'b1111111-2222-3333-4444-555555555552', 'HEADING', 5, jsonb_build_object('text', $$Alat / Persiapan$$)),
(gen_random_uuid(), 'b1111111-2222-3333-4444-555555555552', 'LIST', 6, jsonb_build_object('items', ARRAY[$$Cermin atau kamera HP untuk latihan$$, $$Stopwatch / timer$$, $$Catatan poin-poin (bukan naskah penuh)$$, $$Satu orang teman untuk jadi audiens latihan$$])),
(gen_random_uuid(), 'b1111111-2222-3333-4444-555555555552', 'HEADING', 7, jsonb_build_object('text', $$Program 7 Hari$$)),
(gen_random_uuid(), 'b1111111-2222-3333-4444-555555555552', 'LIST', 8, jsonb_build_object('items', ARRAY[$$Hari 1-2 — Napas: latihan pernapasan diafragma (tarik 4 detik, tahan 4, buang 6) 5 menit pagi dan malam. Ini menurunkan detak jantung secara langsung.$$ , $$Hari 3-4 — Struktur: susun materi dengan pola pembuka-masalah-solusi-penutup. Latihan bicara 3 menit di depan cermin, fokus pada kontak mata dengan diri sendiri.$$ , $$Hari 5-6 — Simulasi: rekam dirimu presentasi 5 menit, tonton, catat 3 hal yang diperbaiki. Ulangi sampai nyaman melihat rekaman sendiri.$$ , $$Hari 7 — Gladi: presentasi di depan 1-2 teman. Minta umpan balik jujur. Rayakan — kamu sudah melewati bagian tersulit.$$])),
(gen_random_uuid(), 'b1111111-2222-3333-4444-555555555552', 'HEADING', 9, jsonb_build_object('text', $$Risiko$$)),
(gen_random_uuid(), 'b1111111-2222-3333-4444-555555555552', 'PARAGRAPH', 10, jsonb_build_object('text', $$Jangan menghafal naskah kata per kata — saat lupa satu kalimat, semuanya runtuh. Gunakan poin-poin agar terdengar alami. Jangan minum obat penenang tanpa resep dokter; teknik napas sudah terbukti cukup untuk kebanyakan orang.$$)),
(gen_random_uuid(), 'b1111111-2222-3333-4444-555555555552', 'HEADING', 11, jsonb_build_object('text', $$Penyelesaian$$)),
(gen_random_uuid(), 'b1111111-2222-3333-4444-555555555552', 'PARAGRAPH', 12, jsonb_build_object('text', $$Setelah 7 hari kamu belum jadi orator ulung — dan itu wajar. Targetnya: grogi turun dari "melumpuhkan" menjadi "menggetarkan tapi terkendali". Pertahankan latihan 10 menit seminggu; kemampuan bicara adalah otot yang menguat setiap dipakai.$$));

-- ============ 3. EXP-FILSAFAT-001 ============
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, status, created_by, updated_by)
VALUES ('b1111111-2222-3333-4444-555555555553', 'EXP-FILSAFAT-001', 'c8888888-8888-8888-8888-888888888888',
'Stoikisme: Filosofi Ketenangan Batin', 'stoikisme-filosofi-ketenangan-batin',
'Mengenal Stoikisme, aliran filsafat Yunani-Romawi kuno tentang ketenangan batin: dikotomi kendali, amor fati, dan penerapannya di kehidupan modern.',
'id', 7, 'DRAFT', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (id) DO NOTHING;

INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
(gen_random_uuid(), 'b1111111-2222-3333-4444-555555555553', 'HEADING', 1, jsonb_build_object('text', $$Apa Itu Stoikisme$$)),
(gen_random_uuid(), 'b1111111-2222-3333-4444-555555555553', 'PARAGRAPH', 2, jsonb_build_object('text', $$Stoikisme adalah aliran filsafat yang lahir di Athena sekitar 300 SM, didirikan oleh Zeno dari Citium. Namanya berasal dari "stoa" (serambi berpilar) tempat Zeno mengajar. Aliran ini mencapai puncak di Roma melalui Seneca, Epictetus, dan kaisar Marcus Aurelius. Intinya sederhana: kebahagiaan datang dari dalam, bukan dari hal-hal di luar kendali kita.$$)),
(gen_random_uuid(), 'b1111111-2222-3333-4444-555555555553', 'HEADING', 3, jsonb_build_object('text', $$Dikotomi Kendali$$)),
(gen_random_uuid(), 'b1111111-2222-3333-4444-555555555553', 'PARAGRAPH', 4, jsonb_build_object('text', $$Ajaran paling terkenal Stoikisme, dari Epictetus: "Ada hal yang bisa kita kendalikan, dan ada yang tidak." Pendapat, keinginan, dan tindakan kita — bisa dikendalikan. Cuaca, pendapat orang lain, masa lalu — tidak bisa. Penderitaan muncul saat kita menuntut hal yang tak terkendali agar sesuai keinginan kita. Tugas kita: fokuskan energi hanya pada yang pertama.$$)),
(gen_random_uuid(), 'b1111111-2222-3333-4444-555555555553', 'HEADING', 5, jsonb_build_object('text', $$Amor Fati: Cintai Takdirmu$$)),
(gen_random_uuid(), 'b1111111-2222-3333-4444-555555555553', 'PARAGRAPH', 6, jsonb_build_object('text', $$Marcus Aurelius menulis dalam "Meditations": jangan hanya menerima apa yang terjadi, tapi cintailah. "Amor fati" berarti berhenti mengeluh tentang realitas dan mulai bekerja dengannya. Macet di jalan? Itu waktu untuk mendengarkan podcast. Gagal ujian? Itu data tentang cara belajarmu yang perlu diperbaiki.$$)),
(gen_random_uuid(), 'b1111111-2222-3333-4444-555555555553', 'HEADING', 7, jsonb_build_object('text', $$Memento Mori$$)),
(gen_random_uuid(), 'b1111111-2222-3333-4444-555555555553', 'PARAGRAPH', 8, jsonb_build_object('text', $$"Ingatlah kamu akan mati." Bagi Stoik, ini bukan kesuraman melainkan kejernihan: menyadari waktu terbatas membuat kita berhenti membuangnya untuk hal remeh — dendam kecil, gengsi, scroll tanpa tujuan — dan menggunakannya untuk yang benar-benar penting.$$)),
(gen_random_uuid(), 'b1111111-2222-3333-4444-555555555553', 'HEADING', 9, jsonb_build_object('text', $$Stoikisme di Zaman Modern$$)),
(gen_random_uuid(), 'b1111111-2222-3333-4444-555555555553', 'PARAGRAPH', 10, jsonb_build_object('text', $$Prinsip Stoik hidup dalam psikologi modern: terapi perilaku kognitif (CBT) berakar pada gagasan Epictetus bahwa "bukan peristiwa yang mengganggu kita, melainkan penilaian kita tentang peristiwa itu." Atlet, pebisnis, dan tentara memakai visualisasi negatif ala Stoik — membayangkan skenario terburuk agar siap, bukan agar takut. Filosofi 2.300 tahun ini ternyata adalah manual ketahanan mental yang masih relevan.$$));

-- ============ 4. EXP-MATEMATIKA2-001 ============
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, status, created_by, updated_by)
VALUES ('b1111111-2222-3333-4444-555555555554', 'EXP-MATEMATIKA2-001', 'c5555555-5555-5555-5555-555555555555',
'Statistika: Rata-rata, Median, Modus', 'statistika-rata-rata-median-modus',
'Memahami tiga ukuran pemusatan data: mean, median, dan modus — definisi, cara menghitung, kapan memakai yang mana, dan contoh soal.',
'id', 7, 'DRAFT', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (id) DO NOTHING;

INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
(gen_random_uuid(), 'b1111111-2222-3333-4444-555555555554', 'HEADING', 1, jsonb_build_object('text', $$Kenapa Perlu Ukuran Pemusatan$$)),
(gen_random_uuid(), 'b1111111-2222-3333-4444-555555555554', 'PARAGRAPH', 2, jsonb_build_object('text', $$Bayangkan nilai ulangan 30 siswa — sulit menangkap gambaran hanya dari daftar angka. Statistika merangkumnya menjadi satu angka wakil: ukuran pemusatan. Tiga yang paling dipakai adalah rata-rata (mean), nilai tengah (median), dan nilai terbanyak (modus). Ketiganya menjawab pertanyaan berbeda tentang data yang sama.$$)),
(gen_random_uuid(), 'b1111111-2222-3333-4444-555555555554', 'HEADING', 3, jsonb_build_object('text', $$Mean (Rata-rata)$$)),
(gen_random_uuid(), 'b1111111-2222-3333-4444-555555555554', 'PARAGRAPH', 4, jsonb_build_object('text', $$Mean = jumlah semua data dibagi banyaknya data. Contoh: nilai 70, 80, 80, 90, 100. Jumlah = 420, dibagi 5 = 84. Mean memakai seluruh data sehingga informatif, tetapi sensitif terhadap pencilan (outlier): satu nilai 20 di antara nilai 90-an akan menarik mean turun jauh.$$)),
(gen_random_uuid(), 'b1111111-2222-3333-4444-555555555554', 'HEADING', 5, jsonb_build_object('text', $$Median (Nilai Tengah)$$)),
(gen_random_uuid(), 'b1111111-2222-3333-4444-555555555554', 'PARAGRAPH', 6, jsonb_build_object('text', $$Urutkan data dari kecil ke besar, lalu ambil yang di tengah. Data 70, 80, 80, 90, 100 → median = 80. Jika jumlah data genap, median adalah rata-rata dua nilai tengah: data 70, 80, 90, 100 → median = (80+90)/2 = 85. Median kebal terhadap outlier, sehingga cocok untuk data penghasilan atau harga rumah yang biasanya timpang.$$)),
(gen_random_uuid(), 'b1111111-2222-3333-4444-555555555554', 'HEADING', 7, jsonb_build_object('text', $$Modus (Nilai Terbanyak)$$)),
(gen_random_uuid(), 'b1111111-2222-3333-4444-555555555554', 'PARAGRAPH', 8, jsonb_build_object('text', $$Modus adalah nilai yang paling sering muncul. Data 70, 80, 80, 90, 100 → modus = 80. Data bisa tidak punya modus (semua unik), punya satu, atau punya lebih dari satu (bimodal). Modus satu-satunya ukuran pemusatan yang bisa dipakai untuk data kategori, misalnya warna favorit atau merek HP terlaris.$$)),
(gen_random_uuid(), 'b1111111-2222-3333-4444-555555555554', 'HEADING', 9, jsonb_build_object('text', $$Kapan Memakai yang Mana$$)),
(gen_random_uuid(), 'b1111111-2222-3333-4444-555555555554', 'PARAGRAPH', 10, jsonb_build_object('text', $$Aturan praktis: pakai mean untuk data simetris tanpa outlier (nilai ujian kelas yang normal). Pakai median untuk data timpang (gaji karyawan — segelintir gaji direktur bisa menggelembungkan mean). Pakai modus untuk data kategori atau saat ingin tahu "yang paling umum". Laporan yang jujur sering menyajikan ketiganya sekaligus agar pembaca bisa menilai sendiri.$$));

-- ============ 5. SCH-SMP-BIN-001 ============
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, status, created_by, updated_by)
VALUES ('b1111111-2222-3333-4444-555555555555', 'SCH-SMP-BIN-001', 'd4444444-4444-4444-4444-444444444444',
'Bahasa Indonesia Kelas 8: Teks Eksposisi', 'bahasa-indonesia-kelas-8-teks-eksposisi',
'Materi Bahasa Indonesia kelas 8 SMP: pengertian teks eksposisi, struktur tesis-argumen-penegasan ulang, kaidah kebahasaan, dan latihan menulis.',
'id', 10, 'DRAFT', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (id) DO NOTHING;

INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
(gen_random_uuid(), 'b1111111-2222-3333-4444-555555555555', 'HEADING', 1, jsonb_build_object('text', $$Tujuan Pembelajaran$$)),
(gen_random_uuid(), 'b1111111-2222-3333-4444-555555555555', 'PARAGRAPH', 2, jsonb_build_object('text', $$Setelah mempelajari materi ini, kamu diharapkan mampu: (1) menjelaskan pengertian dan ciri teks eksposisi, (2) mengidentifikasi struktur teks eksposisi, (3) menganalisis kaidah kebahasaannya, dan (4) menulis teks eksposisi singkat dengan struktur yang benar.$$)),
(gen_random_uuid(), 'b1111111-2222-3333-4444-555555555555', 'HEADING', 3, jsonb_build_object('text', $$Pengertian Teks Eksposisi$$)),
(gen_random_uuid(), 'b1111111-2222-3333-4444-555555555555', 'PARAGRAPH', 4, jsonb_build_object('text', $$Teks eksposisi adalah teks yang memaparkan pengetahuan atau gagasan untuk menambah wawasan pembaca. Berbeda dengan teks persuasi yang mengajak, eksposisi bersifat informatif dan objektif — penulis menyajikan fakta dan argumen logis, lalu membiarkan pembaca menilai sendiri. Contohnya: artikel ilmiah populer, tajuk rencana, dan esai informatif.$$)),
(gen_random_uuid(), 'b1111111-2222-3333-4444-555555555555', 'HEADING', 5, jsonb_build_object('text', $$Struktur Teks Eksposisi$$)),
(gen_random_uuid(), 'b1111111-2222-3333-4444-555555555555', 'LIST', 6, jsonb_build_object('items', ARRAY[$$Tesis (pernyataan pendapat): gagasan utama penulis, biasanya di paragraf pembuka. Contoh: "Sampah plastik adalah ancaman serius bagi ekosistem laut."$$ , $$Rangkaian argumen: fakta, data, dan alasan yang mendukung tesis, disusun dalam beberapa paragraf. Setiap argumen harus didukung bukti, bukan sekadar opini.$$ , $$Penegasan ulang: simpulan yang menegaskan kembali tesis dengan bahasa berbeda, di paragraf penutup.$$])),
(gen_random_uuid(), 'b1111111-2222-3333-4444-555555555555', 'HEADING', 7, jsonb_build_object('text', $$Kaidah Kebahasaan$$)),
(gen_random_uuid(), 'b1111111-2222-3333-4444-555555555555', 'LIST', 8, jsonb_build_object('items', ARRAY[$$Kata teknis/ilmiah sesuai topik (misal: ekosistem, dekomposisi, mikroplastik).$$ , $$Kata kerja mental: menyimpulkan, berpendapat, berasumsi.$$ , $$Konjungsi kausalitas: karena, sebab, oleh karena itu.$$ , $$Fakta didukung data angka bila memungkinkan.$$])),
(gen_random_uuid(), 'b1111111-2222-3333-4444-555555555555', 'HEADING', 9, jsonb_build_object('text', $$Contoh Paragraf Tesis$$)),
(gen_random_uuid(), 'b1111111-2222-3333-4444-555555555555', 'PARAGRAPH', 10, jsonb_build_object('text', $$"Setiap tahun, jutaan ton sampah plastik masuk ke lautan. Data menunjukkan seekor penyu laut berpeluang menelan kantong plastik yang dikiranya ubur-ubur, makanannya. Oleh karena itu, pengurangan plastik sekali pakai bukan lagi pilihan, melainkan kebutuhan mendesak." — Perhatikan: kalimat pertama tesis, kalimat berikutnya argumen berupa fakta, kalimat terakhir penegasan ulang.$$)),
(gen_random_uuid(), 'b1111111-2222-3333-4444-555555555555', 'HEADING', 11, jsonb_build_object('text', $$Latihan$$)),
(gen_random_uuid(), 'b1111111-2222-3333-4444-555555555555', 'LIST', 12, jsonb_build_object('items', ARRAY[$$1. Tulislah satu paragraf tesis (3-4 kalimat) bertema "pentingnya sarapan". Kunci: ada pernyataan pendapat + satu fakta pendukung.$$ , $$2. Sebutkan 3 konjungsi kausalitas selain "karena". Kunci: sebab, oleh karena itu, akibatnya, sehingga.$$ , $$3. Ubah kalimat opini "Game itu buruk" menjadi kalimat eksposisi yang didukung argumen. Kunci contoh: "Bermain game lebih dari 3 jam sehari berkaitan dengan penurunan prestasi belajar, menurut survei terhadap 500 pelajar."$$]));

-- ============ 6. SCH-SD-SENI-001 ============
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, status, created_by, updated_by)
VALUES ('b1111111-2222-3333-4444-555555555556', 'SCH-SD-SENI-001', 'd1000003-0000-0000-0000-000000000003',
'Seni Budaya Kelas 3: Menggambar Bentuk Dasar', 'seni-budaya-kelas-3-menggambar-bentuk-dasar',
'Materi Seni Budaya kelas 3 SD: mengenal bentuk dasar lingkaran, segitiga, dan segiempat, lalu menggabungkannya menjadi gambar benda sehari-hari.',
'id', 8, 'DRAFT', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (id) DO NOTHING;

INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
(gen_random_uuid(), 'b1111111-2222-3333-4444-555555555556', 'HEADING', 1, jsonb_build_object('text', $$Tujuan Pembelajaran$$)),
(gen_random_uuid(), 'b1111111-2222-3333-4444-555555555556', 'PARAGRAPH', 2, jsonb_build_object('text', $$Setelah belajar materi ini, kamu bisa: (1) menyebutkan tiga bentuk dasar gambar, (2) menggambar lingkaran, segitiga, dan segiempat dengan rapi, dan (3) menggabungkan bentuk-bentuk dasar menjadi gambar rumah, mobil, atau hewan sederhana.$$)),
(gen_random_uuid(), 'b1111111-2222-3333-4444-555555555556', 'HEADING', 3, jsonb_build_object('text', $$Tiga Bentuk Dasar$$)),
(gen_random_uuid(), 'b1111111-2222-3333-4444-555555555556', 'LIST', 4, jsonb_build_object('items', ARRAY[$$Lingkaran: garis melengkung yang bertemu ujungnya. Contoh di alam: matahari, roda, buah apel.$$ , $$Segitiga: tiga garis lurus yang saling bertemu. Contoh: atap rumah, gunung, potongan pizza.$$ , $$Segiempat: empat garis lurus. Contoh: pintu, buku, jendela.$$])),
(gen_random_uuid(), 'b1111111-2222-3333-4444-555555555556', 'HEADING', 5, jsonb_build_object('text', $$Cara Menggambar dengan Rapi$$)),
(gen_random_uuid(), 'b1111111-2222-3333-4444-555555555556', 'LIST', 6, jsonb_build_object('items', ARRAY[$$Pegang pensil dengan santai, jangan terlalu keras — garis jadi kaku dan sulit dihapus.$$ , $$Buat garis tipis dulu (sketsa). Setelah bentuknya pas, tebalkan garis yang benar.$$ , $$Untuk lingkaran: putar kertasnya, bukan tanganmu — hasilnya lebih bulat.$$ , $$Hapus garis bantu yang tidak dipakai setelah gambar jadi.$$])),
(gen_random_uuid(), 'b1111111-2222-3333-4444-555555555556', 'HEADING', 7, jsonb_build_object('text', $$Menggabungkan Bentuk: Gambar Rumah$$)),
(gen_random_uuid(), 'b1111111-2222-3333-4444-555555555556', 'PARAGRAPH', 8, jsonb_build_object('text', $$Langkah 1: gambar segiempat besar untuk badan rumah. Langkah 2: gambar segitiga di atasnya untuk atap. Langkah 3: tambah segiempat kecil untuk pintu dan jendela. Langkah 4: gambar lingkaran kecil sebagai matahari di sudut kertas. Selesai! Kamu baru saja menggambar rumah hanya dari bentuk dasar.$$)),
(gen_random_uuid(), 'b1111111-2222-3333-4444-555555555556', 'HEADING', 9, jsonb_build_object('text', $$Menggabungkan Bentuk: Gambar Mobil$$)),
(gen_random_uuid(), 'b1111111-2222-3333-4444-555555555556', 'PARAGRAPH', 10, jsonb_build_object('text', $$Gambar segiempat panjang untuk badan mobil, segiempat lebih kecil di atasnya untuk kaca, lalu dua lingkaran di bawah untuk roda. Tambahkan segitiga kecil sebagai lampu depan. Warnai dengan crayon favoritmu!$$)),
(gen_random_uuid(), 'b1111111-2222-3333-4444-555555555556', 'HEADING', 11, jsonb_build_object('text', $$Latihan$$)),
(gen_random_uuid(), 'b1111111-2222-3333-4444-555555555556', 'LIST', 12, jsonb_build_object('items', ARRAY[$$1. Gambarlah sebuah pohon hanya dari lingkaran dan segiempat. Kunci: lingkaran untuk daun (tajuk), segiempat tegak untuk batang.$$ , $$2. Sebutkan 3 benda di kelasmu yang berbentuk lingkaran! Kunci contoh: jam dinding, roda kursi, tutup botol.$$ , $$3. Gambar hewan kucing sederhana dari bentuk dasar, lalu warnai. Kunci: lingkaran untuk kepala dan badan, segitiga untuk telinga, garis untuk kumis dan ekor.$$]));
