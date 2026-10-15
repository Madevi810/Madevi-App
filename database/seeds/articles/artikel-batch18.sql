-- Artikel konten Madevi batch 18 — 2026-10-13
-- Owner principal: f7125028-187e-44e0-b95b-88b69b8d5c9a
-- Idempoten: ON CONFLICT DO NOTHING

-- ============ 1. TUT-MASAK2-001 ============
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, status, created_by, updated_by)
VALUES ('9c138388-a1cc-43b7-ab24-2bfe0e391d37', 'TUT-MASAK2-001', 'b7777777-7777-7777-7777-777777777777',
'Ayam Goreng Krispi: Rahasia Tepung Renyah',
'ayam-goreng-krispi-rahasia-tepung-renyah',
'Panduan membuat ayam goreng krispi renyah tahan lama: teknik marinasi, racikan tepung dua lapis, dan suhu minyak yang tepat.',
'id', 8, 'DRAFT', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (id) DO NOTHING;

INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
(gen_random_uuid(), '9c138388-a1cc-43b7-ab24-2bfe0e391d37', 'HEADING', 1, jsonb_build_object('text', $$Masalah: Ayam Goreng Lembek dan Tidak Renyah$$)),
(gen_random_uuid(), '9c138388-a1cc-43b7-ab24-2bfe0e391d37', 'PARAGRAPH', 2, jsonb_build_object('text', $$Ayam goreng buatan sendiri sering lembek begitu dingin, tepungnya rontok saat digoreng, atau dagingnya hambar. Penyebab utamanya: marinasi kurang lama, adonan tepung salah, dan suhu minyak tidak stabil.$$)),
(gen_random_uuid(), '9c138388-a1cc-43b7-ab24-2bfe0e391d37', 'HEADING', 3, jsonb_build_object('text', $$Penjelasan: Ilmu di Balik Kerenyahan$$)),
(gen_random_uuid(), '9c138388-a1cc-43b7-ab24-2bfe0e391d37', 'PARAGRAPH', 4, jsonb_build_object('text', $$Kerenyahan berasal dari lapisan tepung yang mengering cepat saat terkena minyak panas (150-170°C). Tepung terigu protein sedang dicampur tepung beras atau maizena menghasilkan struktur berpori yang renyah. Teknik double coating — celup adonan basah lalu gulingkan ke tepung kering — menciptakan lapisan tebal yang tahan lembek.$$)),
(gen_random_uuid(), '9c138388-a1cc-43b7-ab24-2bfe0e391d37', 'HEADING', 5, jsonb_build_object('text', $$Alat dan Bahan yang Dibutuhkan$$)),
(gen_random_uuid(), '9c138388-a1cc-43b7-ab24-2bfe0e391d37', 'LIST', 6, jsonb_build_object('items', ARRAY[$$1 kg ayam potong$$, $$Tepung terigu protein sedang 250 g$$, $$Tepung beras atau maizena 100 g$$, $$Bawang putih, garam, merica, kaldu bubuk$$, $$Minyak goreng secukupnya$$, $$Wajan cekung dan termometer dapur (opsional)$$])),
(gen_random_uuid(), '9c138388-a1cc-43b7-ab24-2bfe0e391d37', 'HEADING', 7, jsonb_build_object('text', $$Langkah Membuat$$)),
(gen_random_uuid(), '9c138388-a1cc-43b7-ab24-2bfe0e391d37', 'LIST', 8, jsonb_build_object('items', ARRAY[$$1. Marinasi ayam dengan bawang putih halus, garam, merica, dan kaldu bubuk minimal 1 jam (lebih baik semalaman di kulkas).$$, $$2. Campur tepung terigu, tepung beras, dan sedikit baking powder untuk adonan kering. Ambil 3 sendok adonan, tambah air es untuk adonan basah.$$, $$3. Celup ayam ke adonan basah, lalu gulingkan ke adonan kering sambil sedikit diremas agar bertekstur keriting.$$, $$4. Panaskan minyak hingga 160°C. Goreng ayam 12-15 menit sampai keemasan, jangan terlalu penuh agar suhu stabil.$$, $$5. Tiriskan di rak kawat (bukan tisu) supaya uap tidak membuat lapisan lembek.$$])),
(gen_random_uuid(), '9c138388-a1cc-43b7-ab24-2bfe0e391d37', 'HEADING', 9, jsonb_build_object('text', $$Risiko$$)),
(gen_random_uuid(), '9c138388-a1cc-43b7-ab24-2bfe0e391d37', 'PARAGRAPH', 10, jsonb_build_object('text', $$Minyak terlalu panas (di atas 180°C) membuat luar gosong tapi dalam mentah. Minyak kurang panas membuat ayam berminyak dan lembek. Jangan menggoreng ayam beku — cairkan dulu agar matang merata dan tidak meletup berbahaya.$$)),
(gen_random_uuid(), '9c138388-a1cc-43b7-ab24-2bfe0e391d37', 'HEADING', 11, jsonb_build_object('text', $$Penyelesaian$$)),
(gen_random_uuid(), '9c138388-a1cc-43b7-ab24-2bfe0e391d37', 'PARAGRAPH', 12, jsonb_build_object('text', $$Ayam goreng krispi yang benar bertahan renyah 2-3 jam di suhu ruang. Simpan sisa di wadah tertutup dan panaskan kembali di oven atau air fryer 5 menit — jangan microwave karena membuat lapisan lembek.$$))
ON CONFLICT (id) DO NOTHING;

-- ============ 2. TUT-TANAMAN-001 ============
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, status, created_by, updated_by)
VALUES ('aab2e25f-07f3-4f5d-9757-667ea4f848c7', 'TUT-TANAMAN-001', 'b7777777-7777-7777-7777-777777777777',
'Tanaman Hias Anti Mati untuk Pemula',
'tanaman-hias-anti-mati-untuk-pemula',
'7 tanaman hias paling bandel untuk pemula: lidah mertua, sirih gading, hingga kaktus — lengkap dengan cara merawatnya.',
'id', 7, 'DRAFT', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (id) DO NOTHING;

INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
(gen_random_uuid(), 'aab2e25f-07f3-4f5d-9757-667ea4f848c7', 'HEADING', 1, jsonb_build_object('text', $$Masalah: Tanaman Hias Selalu Mati$$)),
(gen_random_uuid(), 'aab2e25f-07f3-4f5d-9757-667ea4f848c7', 'PARAGRAPH', 2, jsonb_build_object('text', $$Pemula sering membeli tanaman cantik yang layu dalam dua minggu. Penyebab kematian nomor satu bukan kurang cinta, melainkan terlalu sering disiram — akar membusuk karena media selalu basah.$$)),
(gen_random_uuid(), 'aab2e25f-07f3-4f5d-9757-667ea4f848c7', 'HEADING', 3, jsonb_build_object('text', $$Penjelasan: Prinsip Dasar Merawat Tanaman$$)),
(gen_random_uuid(), 'aab2e25f-07f3-4f5d-9757-667ea4f848c7', 'PARAGRAPH', 4, jsonb_build_object('text', $$Tiga kebutuhan utama tanaman: cahaya, air, dan drainase. Kebanyakan tanaman hias tropis suka cahaya terang tidak langsung dan media yang kering di antara penyiraman. Aturan jempol: tusuk jari 2 cm ke media — siram hanya jika kering.$$)),
(gen_random_uuid(), 'aab2e25f-07f3-4f5d-9757-667ea4f848c7', 'HEADING', 5, jsonb_build_object('text', $$Alat yang Dibutuhkan$$)),
(gen_random_uuid(), 'aab2e25f-07f3-4f5d-9757-667ea4f848c7', 'LIST', 6, jsonb_build_object('items', ARRAY[$$Pot berlubang drainase$$, $$Media tanam porous (campuran tanah, sekam, cocopeat)$$, $$Penyiram (sprayer atau gembor kecil)$$, $$Pupuk cair seimbang (opsional)$$])),
(gen_random_uuid(), 'aab2e25f-07f3-4f5d-9757-667ea4f848c7', 'HEADING', 7, jsonb_build_object('text', $$7 Tanaman Paling Bandel$$)),
(gen_random_uuid(), 'aab2e25f-07f3-4f5d-9757-667ea4f848c7', 'LIST', 8, jsonb_build_object('items', ARRAY[$$1. Lidah mertua (Sansevieria) — siram 2 minggu sekali, tahan gelap.$$ , $$2. Sirih gading (Pothos) — tumbuh di air maupun tanah, cepat merambat.$$ , $$3. Lidah buaya — sukulen, siram saat media benar-benar kering.$$ , $$4. ZZ plant — daun mengkilap, nyaris tidak butuh perhatian.$$ , $$5. Kaktus mini — siram sebulan sekali, butuh sinar matahari.$$ , $$6. Sri rejeki (Aglaonema) — toleran cahaya rendah, daun berwarna-warni.$$ , $$7. Monstera — ikonik, cukup cahaya terang tidak langsung.$$])),
(gen_random_uuid(), 'aab2e25f-07f3-4f5d-9757-667ea4f848c7', 'HEADING', 9, jsonb_build_object('text', $$Risiko$$)),
(gen_random_uuid(), 'aab2e25f-07f3-4f5d-9757-667ea4f848c7', 'PARAGRAPH', 10, jsonb_build_object('text', $$Overwatering membunuh lebih banyak tanaman daripada kekeringan. Waspadai juga hama seperti kutu putih — semprot dengan air sabun cair encer. Beberapa tanaman (misalnya lidah buaya mentah, dieffenbachia) beracun jika tertelan hewan peliharaan atau anak kecil.$$)),
(gen_random_uuid(), 'aab2e25f-07f3-4f5d-9757-667ea4f848c7', 'HEADING', 11, jsonb_build_object('text', $$Penyelesaian$$)),
(gen_random_uuid(), 'aab2e25f-07f3-4f5d-9757-667ea4f848c7', 'PARAGRAPH', 12, jsonb_build_object('text', $$Mulailah dengan 1-2 tanaman dari daftar di atas. Setelah 3 bulan berhasil tanpa kematian, naikkan level ke tanaman yang lebih menantang seperti calathea atau anggrek. Konsistensi jadwal siram lebih penting daripada pupuk mahal.$$))
ON CONFLICT (id) DO NOTHING;

-- ============ 3. EXP-SEJARAH2-001 ============
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, status, created_by, updated_by)
VALUES ('dc241b20-5b61-4d04-9574-d7538ea8ba12', 'EXP-SEJARAH2-001', 'c8888888-8888-8888-8888-888888888888',
'Majapahit: Kerajaan Terbesar Nusantara',
'majapahit-kerajaan-terbesar-nusantara',
'Sejarah Kerajaan Majapahit: dari pendirian Raden Wijaya, kejayaan Hayam Wuruk dan Gajah Mada, hingga keruntuhannya.',
'id', 7, 'DRAFT', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (id) DO NOTHING;

INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
(gen_random_uuid(), 'dc241b20-5b61-4d04-9574-d7538ea8ba12', 'HEADING', 1, jsonb_build_object('text', $$Pendirian: Dari Reruntuhan Singasari$$)),
(gen_random_uuid(), 'dc241b20-5b61-4d04-9574-d7538ea8ba12', 'PARAGRAPH', 2, jsonb_build_object('text', $$Majapahit didirikan tahun 1293 oleh Raden Wijaya setelah runtuhnya Singasari akibat serangan Jayakatwang dan invasi Mongol. Ibukotanya di Trowulan, Jawa Timur — kini situs arkeologi seluas 100 km persegi.$$)),
(gen_random_uuid(), 'dc241b20-5b61-4d04-9574-d7538ea8ba12', 'HEADING', 3, jsonb_build_object('text', $$Sumpah Palapa Gajah Mada$$)),
(gen_random_uuid(), 'dc241b20-5b61-4d04-9574-d7538ea8ba12', 'PARAGRAPH', 4, jsonb_build_object('text', $$Pada 1336, Mahapatih Gajah Mada mengucapkan Sumpah Palapa: tidak akan beristirahat sebelum Nusantara bersatu di bawah Majapahit. Ekspedisi militer dan diplomasi pun menyatukan wilayah dari Sumatra hingga Papua — konsep yang kemudian menginspirasi semboyan Bhinneka Tunggal Ika.$$)),
(gen_random_uuid(), 'dc241b20-5b61-4d04-9574-d7538ea8ba12', 'HEADING', 5, jsonb_build_object('text', $$Puncak Kejayaan: Hayam Wuruk$$)),
(gen_random_uuid(), 'dc241b20-5b61-4d04-9574-d7538ea8ba12', 'PARAGRAPH', 6, jsonb_build_object('text', $$Di bawah Raja Hayam Wuruk (1350-1389) dan Gajah Mada, Majapahit mencapai puncak: pusat perdagangan rempah dunia, armada laut kuat, serta karya sastra besar seperti Nagarakretagama karya Mpu Prapanca dan Sutasoma karya Mpu Tantular — sumber frasa Bhinneka Tunggal Ika.$$)),
(gen_random_uuid(), 'dc241b20-5b61-4d04-9574-d7538ea8ba12', 'HEADING', 7, jsonb_build_object('text', $$Sistem Pemerintahan dan Ekonomi$$)),
(gen_random_uuid(), 'dc241b20-5b61-4d04-9574-d7538ea8ba12', 'PARAGRAPH', 8, jsonb_build_object('text', $$Majapahit memakai sistem mandala: pusat kuat dengan daerah bawahan yang otonom. Ekonominya bertumpu pada pertanian sawah irigasi dan perdagangan maritim — lada, pala, dan cengkeh ditukar dengan keramik Tiongkok dan kain India. Mata uangnya kepeng (koin berlubang).$$)),
(gen_random_uuid(), 'dc241b20-5b61-4d04-9574-d7538ea8ba12', 'HEADING', 9, jsonb_build_object('text', $$Keruntuhan$$)),
(gen_random_uuid(), 'dc241b20-5b61-4d04-9574-d7538ea8ba12', 'PARAGRAPH', 10, jsonb_build_object('text', $$Sepeninggal Hayam Wuruk dan Gajah Mada, perang saudara Paregreg (1404-1406) melemahkan kerajaan. Ditambah kebangkitan kesultanan Islam pesisir seperti Demak, Majapahit runtuh sekitar awal abad ke-16. Warisannya hidup: konsep Nusantara menjadi dasar Negara Kesatuan Republik Indonesia.$$))
ON CONFLICT (id) DO NOTHING;

-- ============ 4. EXP-KIMIA3-001 ============
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, status, created_by, updated_by)
VALUES ('010e5bef-2a21-4014-a49f-f1f767b9147e', 'EXP-KIMIA3-001', 'c4444444-4444-4444-4444-444444444444',
'Polimer: Dari Plastik hingga DNA',
'polimer-dari-plastik-hingga-dna',
'Apa itu polimer: rantai molekul raksasa yang membentuk plastik, karet, protein, hingga DNA — plus cara kerja polimerisasi.',
'id', 7, 'DRAFT', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (id) DO NOTHING;

INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
(gen_random_uuid(), '010e5bef-2a21-4014-a49f-f1f767b9147e', 'HEADING', 1, jsonb_build_object('text', $$Definisi: Rantai Molekul Raksasa$$)),
(gen_random_uuid(), '010e5bef-2a21-4014-a49f-f1f767b9147e', 'PARAGRAPH', 2, jsonb_build_object('text', $$Polimer adalah molekul besar yang tersusun dari ribuan unit kecil berulang bernama monomer — seperti rantai yang terbuat dari mata rantai identik. Satu molekul plastik bisa mengandung 10.000 hingga 100.000 monomer.$$)),
(gen_random_uuid(), '010e5bef-2a21-4014-a49f-f1f767b9147e', 'HEADING', 3, jsonb_build_object('text', $$Dua Cara Pembentukan: Adisi dan Kondensasi$$)),
(gen_random_uuid(), '010e5bef-2a21-4014-a49f-f1f767b9147e', 'PARAGRAPH', 4, jsonb_build_object('text', $$Polimerisasi adisi menyambung monomer berikatan rangkap (misalnya etilena menjadi polietilena) tanpa produk samping. Polimerisasi kondensasi menggabungkan monomer sambil melepaskan molekul kecil seperti air — contohnya nilon dan poliester. Pemahaman ini penting untuk industri plastik.$$)),
(gen_random_uuid(), '010e5bef-2a21-4014-a49f-f1f767b9147e', 'HEADING', 5, jsonb_build_object('text', $$Polimer Sintetis di Sekitar Kita$$)),
(gen_random_uuid(), '010e5bef-2a21-4014-a49f-f1f767b9147e', 'LIST', 6, jsonb_build_object('items', ARRAY[$$Polietilena (PE) — kantong plastik, botol.$$ , $$Polipropilena (PP) — wadah makanan, tali.$$ , $$PVC — pipa, kabel.$$ , $$Polistirena — styrofoam.$$ , $$Karet sintetis — ban kendaraan.$$])),
(gen_random_uuid(), '010e5bef-2a21-4014-a49f-f1f767b9147e', 'HEADING', 7, jsonb_build_object('text', $$Polimer Alami: Mahakarya Evolusi$$)),
(gen_random_uuid(), '010e5bef-2a21-4014-a49f-f1f767b9147e', 'PARAGRAPH', 8, jsonb_build_object('text', $$Jauh sebelum pabrik plastik ada, alam sudah membuat polimer: protein (rantai asam amino), DNA (rantai nukleotida), selulosa (rantai glukosa penyusun dinding sel tumbuhan), dan kitin (cangkang serangga). Tubuh manusia sendiri adalah kumpulan polimer yang bekerja sama.$$)),
(gen_random_uuid(), '010e5bef-2a21-4014-a49f-f1f767b9147e', 'HEADING', 9, jsonb_build_object('text', $$Masalah Lingkungan dan Solusinya$$)),
(gen_random_uuid(), '010e5bef-2a21-4014-a49f-f1f767b9147e', 'PARAGRAPH', 10, jsonb_build_object('text', $$Plastik sekali pakai membutuhkan ratusan tahun untuk terurai dan mencemari laut. Solusinya: kurangi (reduce), pakai ulang (reuse), daur ulang (recycle), dan kembangkan bioplastik dari pati atau selulosa yang dapat terurai oleh mikroorganisme.$$))
ON CONFLICT (id) DO NOTHING;

-- ============ 5. SCH-SMA-MAT-001 ============
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, status, created_by, updated_by)
VALUES ('ef82eed8-8061-4bce-bd2e-df2d49503772', 'SCH-SMA-MAT-001', 'd5555555-5555-5555-5555-555555555555',
'Matematika Kelas 11: Fungsi Kuadrat',
'matematika-kelas-11-fungsi-kuadrat',
'Materi fungsi kuadrat kelas 11: bentuk umum, grafik parabola, titik puncak, dan cara mencari akar dengan pemfaktoran dan rumus ABC.',
'id', 9, 'DRAFT', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (id) DO NOTHING;

INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
(gen_random_uuid(), 'ef82eed8-8061-4bce-bd2e-df2d49503772', 'HEADING', 1, jsonb_build_object('text', $$Tujuan Pembelajaran$$)),
(gen_random_uuid(), 'ef82eed8-8061-4bce-bd2e-df2d49503772', 'PARAGRAPH', 2, jsonb_build_object('text', $$Setelah mempelajari materi ini, siswa mampu menentukan bentuk umum fungsi kuadrat, menggambar grafik parabola, menentukan titik puncak, serta mencari akar-akar persamaan kuadrat.$$)),
(gen_random_uuid(), 'ef82eed8-8061-4bce-bd2e-df2d49503772', 'HEADING', 3, jsonb_build_object('text', $$Bentuk Umum dan Grafik$$)),
(gen_random_uuid(), 'ef82eed8-8061-4bce-bd2e-df2d49503772', 'PARAGRAPH', 4, jsonb_build_object('text', $$Fungsi kuadrat berbentuk f(x) = ax² + bx + c dengan a ≠ 0. Grafiknya parabola: terbuka ke atas jika a > 0, terbuka ke bawah jika a < 0. Titik potong sumbu-y selalu di (0, c).$$)),
(gen_random_uuid(), 'ef82eed8-8061-4bce-bd2e-df2d49503772', 'HEADING', 5, jsonb_build_object('text', $$Titik Puncak$$)),
(gen_random_uuid(), 'ef82eed8-8061-4bce-bd2e-df2d49503772', 'PARAGRAPH', 6, jsonb_build_object('text', $$Titik puncak (xp, yp) dihitung dengan xp = -b/(2a), lalu yp = f(xp). Titik ini adalah nilai maksimum (jika a < 0) atau minimum (jika a > 0) fungsi. Contoh: f(x) = x² - 4x + 3 → xp = 4/2 = 2, yp = 4 - 8 + 3 = -1, jadi puncak di (2, -1).$$)),
(gen_random_uuid(), 'ef82eed8-8061-4bce-bd2e-df2d49503772', 'HEADING', 7, jsonb_build_object('text', $$Mencari Akar: Pemfaktoran dan Rumus ABC$$)),
(gen_random_uuid(), 'ef82eed8-8061-4bce-bd2e-df2d49503772', 'PARAGRAPH', 8, jsonb_build_object('text', $$Akar adalah nilai x saat f(x) = 0. Cara pertama: pemfaktoran, misalnya x² - 4x + 3 = (x-1)(x-3) = 0, akarnya x = 1 dan x = 3. Cara umum: rumus ABC x = (-b ± √(b²-4ac)) / 2a. Nilai diskriminan D = b²-4ac menentukan: D > 0 dua akar real, D = 0 satu akar kembar, D < 0 tidak ada akar real.$$)),
(gen_random_uuid(), 'ef82eed8-8061-4bce-bd2e-df2d49503772', 'HEADING', 9, jsonb_build_object('text', $$Contoh Soal$$)),
(gen_random_uuid(), 'ef82eed8-8061-4bce-bd2e-df2d49503772', 'PARAGRAPH', 10, jsonb_build_object('text', $$Tentukan titik puncak dan akar dari f(x) = 2x² - 8x + 6. Penyelesaian: a=2, b=-8, c=6. xp = 8/4 = 2; yp = 8 - 16 + 6 = -2 → puncak (2,-2). D = 64 - 48 = 16 > 0 → dua akar: x = (8 ± 4)/4 → x = 3 atau x = 1.$$)),
(gen_random_uuid(), 'ef82eed8-8061-4bce-bd2e-df2d49503772', 'HEADING', 11, jsonb_build_object('text', $$Latihan Soal$$)),
(gen_random_uuid(), 'ef82eed8-8061-4bce-bd2e-df2d49503772', 'LIST', 12, jsonb_build_object('items', ARRAY[$$1. Tentukan titik puncak f(x) = -x² + 6x - 5. (Kunci: (3, 4), maksimum)$$ , $$2. Carilah akar-akar x² + 5x + 6 = 0. (Kunci: x = -2 atau x = -3)$$ , $$3. Berapa nilai diskriminan dari 3x² - 2x + 5 = 0? Apa artinya? (Kunci: D = -56 < 0, tidak ada akar real)$$]))
ON CONFLICT (id) DO NOTHING;

-- ============ 6. SCH-SD-IPS2-001 ============
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, status, created_by, updated_by)
VALUES ('c392a9a9-e3e8-4398-b7ea-b2e63b4acf94', 'SCH-SD-IPS2-001', 'd3333333-3333-3333-3333-333333333333',
'IPS Kelas 5: Keragaman Suku Bangsa Indonesia',
'ips-kelas-5-keragaman-suku-bangsa',
'Materi IPS kelas 5: mengenal keragaman suku bangsa Indonesia, contoh suku besar, dan pentingnya sikap toleransi.',
'id', 7, 'DRAFT', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (id) DO NOTHING;

INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
(gen_random_uuid(), 'c392a9a9-e3e8-4398-b7ea-b2e63b4acf94', 'HEADING', 1, jsonb_build_object('text', $$Tujuan Pembelajaran$$)),
(gen_random_uuid(), 'c392a9a9-e3e8-4398-b7ea-b2e63b4acf94', 'PARAGRAPH', 2, jsonb_build_object('text', $$Setelah mempelajari materi ini, siswa mampu menyebutkan contoh suku bangsa di Indonesia, menjelaskan ciri khas beberapa suku besar, dan menunjukkan sikap menghargai keragaman.$$)),
(gen_random_uuid(), 'c392a9a9-e3e8-4398-b7ea-b2e63b4acf94', 'HEADING', 3, jsonb_build_object('text', $$Indonesia: 1.340 Suku Bangsa$$)),
(gen_random_uuid(), 'c392a9a9-e3e8-4398-b7ea-b2e63b4acf94', 'PARAGRAPH', 4, jsonb_build_object('text', $$Menurut sensus BPS, Indonesia memiliki lebih dari 1.340 suku bangsa. Setiap suku punya bahasa daerah, adat istiadat, pakaian, rumah, dan makanan khas sendiri. Keragaman ini adalah kekayaan sekaligus tantangan untuk dijaga persatuannya.$$)),
(gen_random_uuid(), 'c392a9a9-e3e8-4398-b7ea-b2e63b4acf94', 'HEADING', 5, jsonb_build_object('text', $$Contoh Suku Bangsa Besar$$)),
(gen_random_uuid(), 'c392a9a9-e3e8-4398-b7ea-b2e63b4acf94', 'LIST', 6, jsonb_build_object('items', ARRAY[$$Suku Jawa — terbesar, bahasa Jawa, rumah joglo, batik.$$ , $$Suku Sunda — Jawa Barat, bahasa Sunda, angklung.$$ , $$Suku Batak — Sumatra Utara, marga, rumah bolon, ulos.$$ , $$Suku Minangkabau — Sumatra Barat, sistem matrilineal, rumah gadang, rendang.$$ , $$Suku Bugis — Sulawesi Selatan, pelaut ulung, perahu pinisi.$$ , $$Suku Dayak — Kalimantan, rumah betang, ukiran.$$ , $$Suku Asmat — Papua, seni ukir kayu mendunia.$$])),
(gen_random_uuid(), 'c392a9a9-e3e8-4398-b7ea-b2e63b4acf94', 'HEADING', 7, jsonb_build_object('text', $$Bhinneka Tunggal Ika$$)),
(gen_random_uuid(), 'c392a9a9-e3e8-4398-b7ea-b2e63b4acf94', 'PARAGRAPH', 8, jsonb_build_object('text', $$Semboyan negara "Bhinneka Tunggal Ika" artinya berbeda-beda tetapi tetap satu. Berasal dari kitab Sutasoma zaman Majapahit. Sikap yang benar: menghormati perbedaan, tidak mengejek adat suku lain, dan bangga menjadi bagian dari Indonesia.$$)),
(gen_random_uuid(), 'c392a9a9-e3e8-4398-b7ea-b2e63b4acf94', 'HEADING', 9, jsonb_build_object('text', $$Contoh dalam Kehidupan$$)),
(gen_random_uuid(), 'c392a9a9-e3e8-4398-b7ea-b2e63b4acf94', 'PARAGRAPH', 10, jsonb_build_object('text', $$Di sekolah, temanmu mungkin berasal dari suku berbeda dengan makanan bekal yang berbeda — itu hal yang menarik untuk dipelajari, bukan diejek. Festival budaya dan pertukaran pelajar adalah cara seru mengenal keragaman.$$)),
(gen_random_uuid(), 'c392a9a9-e3e8-4398-b7ea-b2e63b4acf94', 'HEADING', 11, jsonb_build_object('text', $$Latihan Soal$$)),
(gen_random_uuid(), 'c392a9a9-e3e8-4398-b7ea-b2e63b4acf94', 'LIST', 12, jsonb_build_object('items', ARRAY[$$1. Sebutkan 5 suku bangsa di Indonesia beserta daerah asalnya! (Kunci: Jawa-Jawa Tengah/Timur, Sunda-Jawa Barat, Batak-Sumatra Utara, Minangkabau-Sumatra Barat, Bugis-Sulawesi Selatan)$$ , $$2. Apa arti semboyan Bhinneka Tunggal Ika? (Kunci: berbeda-beda tetapi tetap satu)$$ , $$3. Tuliskan 2 contoh sikap menghargai keragaman suku di sekolah! (Kunci: tidak mengejek bahasa/adat teman; ikut serta dalam kegiatan budaya)$$]))
ON CONFLICT (id) DO NOTHING;
