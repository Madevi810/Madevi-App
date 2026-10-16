-- Artikel Batch 23 — 2026-10-13
-- 6 artikel baru: 2 Tutorial, 2 Explore, 2 School
-- Node taksonomi dipilih dari query langsung (48+ node tersedia)

BEGIN;

-- ================= ARTIKEL 1: TUT-KEBERSIHAN-001 =================
WITH art AS (
  INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, status, created_by, updated_by)
  VALUES (
    gen_random_uuid(),
    'TUT-KEBERSIHAN-001',
    'b7777777-7777-7777-7777-777777777777',
    'Rumah Rapi dalam 15 Menit Sehari',
    'rumah-rapi-15-menit-sehari',
    'Metode 15 menit sehari agar rumah tetap rapi tanpa bersih-bersih maraton di akhir pekan: sistem, rotasi ruangan, dan aturan sentuh sekali.',
    'id', 6, 'DRAFT',
    'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a'
  )
  ON CONFLICT (business_code) DO UPDATE SET title = EXCLUDED.title
  RETURNING id
),
del AS (
  DELETE FROM madevi.article_blocks b USING art WHERE b.article_id = art.id RETURNING b.id
)
INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content)
SELECT gen_random_uuid(), art.id, b.block_type, b.position,
  CASE WHEN b.kind = 'text' THEN jsonb_build_object('text', b.body)
       ELSE jsonb_build_object('items', string_to_array(b.body, E'\n'))
  END
FROM art, (VALUES
  ('HEADING','text',1, $$Masalah: Rumah Berantakan Padahal Sudah Dibereskan$$),
  ('PARAGRAPH','text',2, $$Pagi hari rumah baru dibereskan, sore harinya sudah berantakan lagi. Mainan berserakan, pakaian menumpuk di kursi, piring kotor di wastafel, dan barang-barang kecil entah di mana. Membersihkan sekaligus di akhir pekan terasa melelahkan dan menghabiskan waktu berjam-jam, lalu siklusnya berulang lagi minggu depan.$$),
  ('HEADING','text',3, $$Penjelasan: Kenapa Rumah Cepat Berantakan$$),
  ('PARAGRAPH','text',4, $$Kekacauan rumah biasanya bukan karena penghuninya malas, melainkan karena tidak ada sistem. Setiap barang yang tidak punya "rumah" tetap akan berakhir di sembarang tempat. Kuncinya bukan membersihkan lebih keras, melainkan mencegah kekacauan menumpuk: sedikit setiap hari mengalahkan bersih-bersih besar sesekali.$$),
  ('HEADING','text',5, $$Alat yang Dibutuhkan$$),
  ('LIST','list',6, $$Satu keranjang atau box untuk tiap ruangan
Timer (cukup pakai HP)
Lap microfiber 2–3 lembar
Sapu dan pel
Kantong sampah kecil
Label atau stiker (opsional)$$),
  ('HEADING','text',7, $$Langkah: Metode 15 Menit Sehari$$),
  ('LIST','list',8, $$1. Set timer 15 menit. Berhenti saat timer bunyi — tidak boleh lembur, agar kebiasaan ini bertahan lama.
2. Terapkan aturan "sentuh sekali": setiap barang yang dipegang langsung dikembalikan ke tempatnya, bukan ditaruh "nanti saja".
3. Sediakan keranjang "transit" di tiap ruangan untuk barang yang bukan milik ruangan itu; kosongkan keranjang saat lewat.
4. Rotasi satu ruangan per hari (Senin: ruang tamu, Selasa: dapur, dan seterusnya) untuk beberes yang lebih dalam.
5. Libatkan seluruh penghuni rumah — anak kecil pun bisa memasukkan mainannya sendiri ke box.$$),
  ('HEADING','text',9, $$Risiko$$),
  ('PARAGRAPH','text',10, $$Jangan membersihkan sampai kelelahan atau begadang — 15 menit sudah cukup dan justru membuat kebiasaan ini bertahan. Jangan membuang barang orang lain tanpa izin; siapkan box "donasi/buang" dan diskusikan bersama keluarga seminggu sekali.$$),
  ('HEADING','text',11, $$Penyelesaian$$),
  ('PARAGRAPH','text',12, $$Dalam dua minggu, rumah akan terasa jauh lebih rapi dengan usaha yang jauh lebih ringan. Kuncinya adalah konsistensi, bukan kesempurnaan: rumah yang "cukup rapi setiap hari" lebih nyaman daripada rumah yang "sempurna sekali sebulan".$$)
) AS b(block_type, kind, position, body);

-- ================= ARTIKEL 2: TUT-AIR-001 =================
WITH art AS (
  INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, status, created_by, updated_by)
  VALUES (
    gen_random_uuid(),
    'TUT-AIR-001',
    'b8888888-8888-8888-8888-888888888888',
    'Hemat Air: Tagihan PDAM Turun 40%',
    'hemat-air-tagihan-pdam-turun',
    'Langkah praktis menghemat air di rumah hingga tagihan PDAM turun 40%: cek kebocoran, perbaiki kebiasaan, dan pasang alat hemat air murah.',
    'id', 6, 'DRAFT',
    'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a'
  )
  ON CONFLICT (business_code) DO UPDATE SET title = EXCLUDED.title
  RETURNING id
),
del AS (
  DELETE FROM madevi.article_blocks b USING art WHERE b.article_id = art.id RETURNING b.id
)
INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content)
SELECT gen_random_uuid(), art.id, b.block_type, b.position,
  CASE WHEN b.kind = 'text' THEN jsonb_build_object('text', b.body)
       ELSE jsonb_build_object('items', string_to_array(b.body, E'\n'))
  END
FROM art, (VALUES
  ('HEADING','text',1, $$Masalah: Tagihan PDAM Membengkak Tiap Bulan$$),
  ('PARAGRAPH','text',2, $$Tagihan air PDAM terus naik padahal jumlah penghuni rumah tidak bertambah. Rata-rata keluarga Indonesia memakai 150–200 liter air per orang per hari, jauh di atas kebutuhan dasar. Sebagian besar air itu terbuang sia-sia tanpa disadari.$$),
  ('HEADING','text',3, $$Penjelasan: Ke Mana Saja Air Terbuang$$),
  ('PARAGRAPH','text',4, $$Tiga pencuri air terbesar di rumah: toilet (satu kali flush memakai 6–9 liter), mandi dengan shower (10–15 liter per menit), dan kebocoran kecil (keran menetes bisa membuang 30 liter sehari). Mencuci kendaraan dengan selang mengalir juga bisa menghabiskan 100 liter lebih dalam sekali cuci.$$),
  ('HEADING','text',5, $$Alat yang Dibutuhkan$$),
  ('LIST','list',6, $$Ember untuk menampung air (mandi/cuci)
Aerator keran atau shower hemat air (Rp20–50 ribu)
Pelampung toilet atau botol berisi air untuk tangki flush
Selang dengan pistol semprot untuk cuci kendaraan$$),
  ('HEADING','text',7, $$Langkah Hemat Air$$),
  ('LIST','list',8, $$1. Cek kebocoran: catat angka meteran air malam hari, cek lagi pagi hari sebelum ada yang memakai air. Jika berubah, ada kebocoran.
2. Perpendek waktu mandi: target 5 menit. Matikan shower saat bersabun.
3. Tampung air bekas cucian beras dan bilasan sayur untuk menyiram tanaman.
4. Cuci pakaian dengan muatan penuh, bukan setengah-setengah.
5. Cuci kendaraan dengan ember + spons, bilas terakhir dengan selang semprot.
6. Pasang aerator di keran — aliran tetap kencang tapi debit berkurang 30–50 persen.$$),
  ('HEADING','text',9, $$Risiko$$),
  ('PARAGRAPH','text',10, $$Jangan mengurangi air untuk kebersihan diri sampai menimbulkan masalah kesehatan. Jangan mematikan total keran darurat atau APAR. Jika memakai air hujan atau air daur ulang, jangan dipakai untuk minum atau masak tanpa pengolahan yang benar.$$),
  ('HEADING','text',11, $$Penyelesaian$$),
  ('PARAGRAPH','text',12, $$Keluarga yang konsisten menerapkan langkah di atas umumnya memangkas pemakaian 30–40 persen dalam dua bulan pertama. Pantau meteran tiap minggu agar kebocoran baru langsung ketahuan sebelum tagihan membengkak.$$)
) AS b(block_type, kind, position, body);

-- ================= ARTIKEL 3: EXP-ANTROPOLOGI2-001 =================
WITH art AS (
  INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, status, created_by, updated_by)
  VALUES (
    gen_random_uuid(),
    'EXP-ANTROPOLOGI2-001',
    'c8888888-8888-8888-8888-888888888888',
    'Suku Asmat: Seni Ukir Mendunia',
    'suku-asmat-seni-ukir-mendunia',
    'Mengenal suku Asmat di Papua: filosofi manusia pohon, tiang mbish setinggi 10 meter, dan perjalanan seni ukirnya hingga ke museum-museum dunia.',
    'id', 7, 'DRAFT',
    'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a'
  )
  ON CONFLICT (business_code) DO UPDATE SET title = EXCLUDED.title
  RETURNING id
),
del AS (
  DELETE FROM madevi.article_blocks b USING art WHERE b.article_id = art.id RETURNING b.id
)
INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content)
SELECT gen_random_uuid(), art.id, b.block_type, b.position,
  CASE WHEN b.kind = 'text' THEN jsonb_build_object('text', b.body)
       ELSE jsonb_build_object('items', string_to_array(b.body, E'\n'))
  END
FROM art, (VALUES
  ('HEADING','text',1, $$Siapa Suku Asmat?$$),
  ('PARAGRAPH','text',2, $$Suku Asmat mendiami wilayah pesisir barat daya Papua, tepatnya Kabupaten Asmat — daerah rawa bakau yang luas dengan sungai-sungai besar. Dengan populasi ratusan ribu jiwa, mereka adalah salah satu kelompok etnis terbesar di Papua dan terkenal di seluruh dunia karena seni ukir kayunya yang luar biasa.$$),
  ('HEADING','text',3, $$Filosofi: Manusia Pohon$$),
  ('PARAGRAPH','text',4, $$Nama "Asmat" berasal dari ungkapan "As Akat" yang berarti manusia pohon. Bagi masyarakat Asmat, pohon — khususnya pohon bakau — adalah sumber kehidupan: batangnya jadi perahu dan rumah, buahnya jadi makanan, dan kayunya jadi media ukiran. Pohon yang ditebang untuk ukiran dianggap "dilahirkan kembali" dalam bentuk karya seni yang abadi.$$),
  ('HEADING','text',5, $$Tiang Mbish: Mahakarya Setinggi 10 Meter$$),
  ('PARAGRAPH','text',6, $$Karya paling terkenal suku Asmat adalah tiang mbish (mbis pole): tiang kayu setinggi 5 hingga 10 meter yang diukir penuh dari pangkal sampai ujung. Ukiran itu menggambarkan leluhur yang saling bertumpuk — kaki sosok di atas bertumpu pada kepala sosok di bawahnya — melambangkan kesinambungan generasi. Satu tiang bisa dikerjakan beramai-ramai selama berbulan-bulan dalam upacara adat yang sakral.$$),
  ('HEADING','text',7, $$Perahu Lesung dan Perisai Perang$$),
  ('PARAGRAPH','text',8, $$Selain tiang mbish, masyarakat Asmat membuat perahu lesung (wuramon) yang dipahat dari satu batang pohon utuh dan dihiasi ukiran kepala burung kasuari di haluannya. Perisai perang mereka juga diukir dengan motif spiral dan figur manusia yang dipercaya memberi kekuatan spiritual bagi pembawanya.$$),
  ('HEADING','text',9, $$Dari Hutan Papua ke Museum Dunia$$),
  ('PARAGRAPH','text',10, $$Sejak pertengahan abad ke-20, seni ukir Asmat menarik perhatian dunia. Koleksi besar tersimpan di Museum of Primitive Art di New York dan museum-museum etnografi di Belanda dan Jerman. Di Indonesia sendiri, Festival Budaya Asmat yang digelar tiap tahun menjadi panggung bagi para pengukir untuk memamerkan karya sekaligus menjualnya — menjaga tradisi tetap hidup dan memberi penghasilan bagi masyarakat.$$)
) AS b(block_type, kind, position, body);

-- ================= ARTIKEL 4: EXP-FISIKA4-001 =================
WITH art AS (
  INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, status, created_by, updated_by)
  VALUES (
    gen_random_uuid(),
    'EXP-FISIKA4-001',
    'c3333333-3333-3333-3333-333333333333',
    'Listrik: Dari Petir ke Stopkontak',
    'listrik-dari-petir-ke-stopkontak',
    'Perjalanan listrik dari petir di langit hingga stopkontak di rumah: arus, tegangan, AC vs DC, pembangkit listrik, dan cara listrik sampai ke rumahmu.',
    'id', 7, 'DRAFT',
    'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a'
  )
  ON CONFLICT (business_code) DO UPDATE SET title = EXCLUDED.title
  RETURNING id
),
del AS (
  DELETE FROM madevi.article_blocks b USING art WHERE b.article_id = art.id RETURNING b.id
)
INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content)
SELECT gen_random_uuid(), art.id, b.block_type, b.position,
  CASE WHEN b.kind = 'text' THEN jsonb_build_object('text', b.body)
       ELSE jsonb_build_object('items', string_to_array(b.body, E'\n'))
  END
FROM art, (VALUES
  ('HEADING','text',1, $$Petir: Listrik Raksasa dari Langit$$),
  ('PARAGRAPH','text',2, $$Petir adalah pelepasan listrik statis raksasa. Di dalam awan badai, tetesan air dan kristal es bergesekan hingga awan bagian bawah bermuatan negatif dan tanah bermuatan positif. Ketika beda muatannya cukup besar — bisa mencapai ratusan juta volt — udara yang semula isolator jebol dan terjadilah sambaran petir: arus puluhan ribu ampere dalam sepersekian detik, dengan suhu lima kali lebih panas dari permukaan Matahari.$$),
  ('HEADING','text',3, $$Arus, Tegangan, dan Hambatan$$),
  ('PARAGRAPH','text',4, $$Listrik yang mengalir di kabel adalah hal yang sama dengan petir, hanya jauh lebih jinak dan terkendali. Arus (ampere) adalah banyaknya muatan yang mengalir tiap detik, tegangan (volt) adalah "dorongan" yang menggerakkannya, dan hambatan (ohm) adalah rintangan yang dilaluinya. Hubungan ketiganya dirumuskan Hukum Ohm: V = I × R.$$),
  ('HEADING','text',5, $$AC vs DC: Dua Jenis Arus$$),
  ('PARAGRAPH','text',6, $$Arus searah (DC) mengalir satu arah saja — inilah yang keluar dari baterai dan panel surya. Arus bolak-balik (AC) arahnya berbalik puluhan kali per detik — inilah yang mengalir di stopkontak rumah (di Indonesia 220 volt, 50 Hz). AC dipilih untuk jaringan listrik karena tegangannya mudah dinaik-turunkan dengan transformator, sehingga rugi-rugi saat disalurkan jarak jauh bisa ditekan.$$),
  ('HEADING','text',7, $$Dari Pembangkit ke Rumah$$),
  ('PARAGRAPH','text',8, $$Listrik rumahmu lahir di pembangkit: PLTA memanfaatkan air terjun, PLTU membakar batu bara atau gas, PLTS menangkap cahaya Matahari, dan PLTB menangkap angin. Listrik bertegangan tinggi (hingga 500.000 volt) disalurkan lewat menara transmisi ke gardu induk, diturunkan bertahap, dan akhirnya tiba di rumah sebagai 220 volt yang siap dipakai.$$),
  ('HEADING','text',9, $$Stopkontak di Rumahmu$$),
  ('PARAGRAPH','text',10, $$Di balik setiap stopkontak ada sistem pengaman: MCB yang memutus arus saat beban berlebih, dan kabel arde (grounding) yang membuang arus bocor ke tanah agar tidak menyetrum. Karena itu jangan pernah mencolokkan terlalu banyak peralatan ke satu stopkontak lewat terminal bertumpuk — panas berlebih adalah penyebab utama kebakaran listrik rumah tangga.$$)
) AS b(block_type, kind, position, body);

-- ================= ARTIKEL 5: SCH-SMA-EKO2-001 =================
WITH art AS (
  INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, status, created_by, updated_by)
  VALUES (
    gen_random_uuid(),
    'SCH-SMA-EKO2-001',
    'd5555555-5555-5555-5555-555555555555',
    'Ekonomi Kelas 11: Pasar dan Harga',
    'ekonomi-kelas-11-pasar-dan-harga',
    'Materi ekonomi kelas 11 SMA: pengertian pasar, hukum permintaan dan penawaran, harga keseimbangan, lengkap dengan contoh dan latihan soal.',
    'id', 8, 'DRAFT',
    'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a'
  )
  ON CONFLICT (business_code) DO UPDATE SET title = EXCLUDED.title
  RETURNING id
),
del AS (
  DELETE FROM madevi.article_blocks b USING art WHERE b.article_id = art.id RETURNING b.id
)
INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content)
SELECT gen_random_uuid(), art.id, b.block_type, b.position,
  CASE WHEN b.kind = 'text' THEN jsonb_build_object('text', b.body)
       ELSE jsonb_build_object('items', string_to_array(b.body, E'\n'))
  END
FROM art, (VALUES
  ('HEADING','text',1, $$Tujuan Pembelajaran$$),
  ('PARAGRAPH','text',2, $$Setelah mempelajari materi ini, kamu diharapkan mampu: (1) menjelaskan pengertian pasar dan fungsinya dalam perekonomian; (2) menjelaskan hukum permintaan dan hukum penawaran beserta kurvanya; (3) menentukan harga keseimbangan dari tabel atau kurva; (4) menganalisis faktor-faktor yang menggeser kurva permintaan dan penawaran.$$),
  ('HEADING','text',3, $$Pengertian Pasar$$),
  ('PARAGRAPH','text',4, $$Dalam ilmu ekonomi, pasar bukan sekadar tempat fisik seperti pasar tradisional. Pasar adalah mekanisme bertemunya permintaan (pembeli) dan penawaran (penjual) sehingga terbentuk harga. Pasar memiliki tiga fungsi utama: fungsi pembentukan harga, fungsi distribusi (menyalurkan barang dari produsen ke konsumen), dan fungsi promosi.$$),
  ('HEADING','text',5, $$Hukum Permintaan dan Hukum Penawaran$$),
  ('PARAGRAPH','text',6, $$Hukum permintaan berbunyi: semakin rendah harga suatu barang, semakin banyak jumlah barang yang diminta — dengan syarat faktor lain tetap (ceteris paribus). Kurva permintaan miring ke bawah dari kiri atas ke kanan bawah. Sebaliknya, hukum penawaran berbunyi: semakin tinggi harga, semakin banyak jumlah barang yang ditawarkan. Kurva penawaran miring ke atas dari kiri bawah ke kanan atas.$$),
  ('HEADING','text',7, $$Harga Keseimbangan$$),
  ('PARAGRAPH','text',8, $$Harga keseimbangan (equilibrium price) terjadi pada titik temu kurva permintaan dan kurva penawaran — di titik inilah jumlah yang diminta sama dengan jumlah yang ditawarkan. Jika harga di atas titik keseimbangan, terjadi surplus (kelebihan penawaran) sehingga harga cenderung turun. Jika harga di bawahnya, terjadi kekurangan (shortage) sehingga harga cenderung naik.$$),
  ('HEADING','text',9, $$Contoh: Pasar Cabai$$),
  ('PARAGRAPH','text',10, $$Misalkan pada harga Rp20.000/kg, pembeli meminta 100 kg cabai tetapi petani hanya menawarkan 40 kg — terjadi kekurangan 60 kg sehingga harga naik. Pada harga Rp50.000/kg, pembeli hanya meminta 30 kg tetapi petani menawarkan 120 kg — terjadi surplus 90 kg sehingga harga turun. Titik keseimbangan misalnya di Rp35.000/kg dengan jumlah 70 kg, di mana tidak ada surplus maupun kekurangan.$$),
  ('HEADING','text',11, $$Latihan Soal$$),
  ('LIST','list',12, $$1. Jelaskan perbedaan pergeseran kurva permintaan dengan pergerakan di sepanjang kurva permintaan!
2. Harga beras naik dari Rp12.000 menjadi Rp15.000 per kg, jumlah yang diminta turun dari 500 ton menjadi 400 ton. Apakah peristiwa ini sesuai hukum permintaan? Jelaskan!
3. Kunci jawaban: (1) Pergeseran kurva terjadi karena faktor selain harga (pendapatan, selera, harga barang lain); pergerakan di sepanjang kurva terjadi karena perubahan harga barang itu sendiri. (2) Ya, sesuai hukum permintaan: harga naik maka jumlah yang diminta turun, ceteris paribus.$$)
) AS b(block_type, kind, position, body);

-- ================= ARTIKEL 6: SCH-SD-SENI2-001 =================
WITH art AS (
  INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, status, created_by, updated_by)
  VALUES (
    gen_random_uuid(),
    'SCH-SD-SENI2-001',
    'd3333333-3333-3333-3333-333333333333',
    'Seni Budaya Kelas 5: Tari Tradisional',
    'seni-budaya-kelas-5-tari-tradisional',
    'Materi seni budaya kelas 5 SD: pengertian tari tradisional, contoh tari daerah Indonesia, gerakan dasar, lengkap dengan latihan soal.',
    'id', 7, 'DRAFT',
    'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a'
  )
  ON CONFLICT (business_code) DO UPDATE SET title = EXCLUDED.title
  RETURNING id
),
del AS (
  DELETE FROM madevi.article_blocks b USING art WHERE b.article_id = art.id RETURNING b.id
)
INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content)
SELECT gen_random_uuid(), art.id, b.block_type, b.position,
  CASE WHEN b.kind = 'text' THEN jsonb_build_object('text', b.body)
       ELSE jsonb_build_object('items', string_to_array(b.body, E'\n'))
  END
FROM art, (VALUES
  ('HEADING','text',1, $$Tujuan Pembelajaran$$),
  ('PARAGRAPH','text',2, $$Setelah mempelajari materi ini, kamu diharapkan mampu: (1) menjelaskan pengertian tari tradisional; (2) menyebutkan contoh tari tradisional dari berbagai daerah di Indonesia beserta daerah asalnya; (3) mengidentifikasi gerakan dasar dalam tari; (4) menjelaskan fungsi tari tradisional bagi masyarakat.$$),
  ('HEADING','text',3, $$Apa Itu Tari Tradisional?$$),
  ('PARAGRAPH','text',4, $$Tari tradisional adalah tarian yang lahir dan berkembang di suatu daerah, diwariskan turun-temurun dari generasi ke generasi. Tari tradisional biasanya memiliki aturan gerak yang baku, diiringi musik daerah, dan dikenakan dengan busana khas. Setiap gerakan memiliki makna — misalnya gerakan tangan yang lemah gemulai melambangkan kelembutan, sedangkan hentakan kaki melambangkan semangat.$$),
  ('HEADING','text',5, $$Contoh Tari Tradisional Indonesia$$),
  ('LIST','list',6, $$Tari Saman — Aceh: ditarikan duduk berbanjar dengan tepukan tangan yang kompak dan cepat
Tari Kecak — Bali: ditarikan puluhan penari laki-laki duduk melingkar sambil menyerukan "cak-cak-cak"
Tari Jaipong — Jawa Barat: tarian pergaulan yang energik dengan gerakan pinggul yang khas
Tari Tor-Tor — Sumatera Utara: tarian suku Batak dengan gerakan tangan melambai yang anggun
Tari Pendet — Bali: tarian penyambutan dengan membawa bokor berisi bunga$$),
  ('HEADING','text',7, $$Gerakan Dasar Tari$$),
  ('PARAGRAPH','text',8, $$Gerakan tari terbagi menjadi gerak kepala (menoleh, mengangguk), gerak tangan (melambai, memetik, mengepal), gerak badan (membungkuk, meliuk), dan gerak kaki (melangkah, jinjit, menghentak). Gerakan yang indah lahir dari latihan yang tekun — penari profesional berlatih bertahun-tahun sebelum tampil di panggung besar.$$),
  ('HEADING','text',9, $$Contoh: Tari Saman$$),
  ('PARAGRAPH','text',10, $$Tari Saman dari Gayo, Aceh, ditarikan oleh 8–20 orang penari yang duduk berbanjar. Keunikannya: tanpa alat musik sama sekali — irama lahir dari tepukan tangan, tepukan dada, dan petikan jari para penari sendiri. Gerakannya makin lama makin cepat sehingga membutuhkan kekompakan luar biasa. UNESCO telah menetapkan Tari Saman sebagai Warisan Budaya Takbenda dunia pada tahun 2011.$$),
  ('HEADING','text',11, $$Latihan$$),
  ('LIST','list',12, $$1. Sebutkan tiga contoh tari tradisional beserta daerah asalnya!
2. Apa perbedaan tari tradisional dengan tari modern? Jelaskan dengan bahasamu sendiri!
3. Kunci jawaban: (1) Contoh: Tari Saman–Aceh, Tari Kecak–Bali, Tari Jaipong–Jawa Barat (jawaban lain yang benar diterima). (2) Tari tradisional diwariskan turun-temurun dengan aturan gerak baku dan makna budaya; tari modern lebih bebas, mengikuti perkembangan zaman dan kreasi koreografer.$$)
) AS b(block_type, kind, position, body);

COMMIT;
