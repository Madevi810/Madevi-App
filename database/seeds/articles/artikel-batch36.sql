-- Batch 36: 6 artikel Madevi (2 Tutorial + 2 Explore + 2 School)
-- Idempotent: re-run aman (hapus block lama lalu insert ulang per artikel)
BEGIN;

DO $do$
DECLARE
  a1 uuid; a2 uuid; a3 uuid; a4 uuid; a5 uuid; a6 uuid;
  owner uuid := 'f7125028-187e-44e0-b95b-88b69b8d5c9a';
BEGIN
  -- 1. TUT-MASAK4-001 -> R1.D1.K4 Rumah Tangga
  INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, created_by, updated_by)
  VALUES (gen_random_uuid(), 'TUT-MASAK4-001', 'b7777777-7777-7777-7777-777777777777', 'Rendang Daging: Resep Minang Autentik', 'rendang-daging-resep-minang-autentik',
    'Resep rendang daging sapi empuk dengan bumbu meresap, langkah bertahap, dan tips anti gagal.', 'id', 8, owner, 'DRAFT', owner, owner)
  ON CONFLICT (business_code) DO NOTHING RETURNING id INTO a1;
  IF a1 IS NULL THEN SELECT id INTO a1 FROM madevi.articles WHERE business_code = 'TUT-MASAK4-001'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = a1;

  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
  (gen_random_uuid(), a1, 'HEADING', 1, jsonb_build_object('text', $t$Masalah: Rendang Keras, Kering, dan Bumbu Kurang Meresap$t$)),
  (gen_random_uuid(), a1, 'PARAGRAPH', 2, jsonb_build_object('text', $t$Rendang yang dimasak terburu-buru biasanya berakhir sebagai semur gosong: dagingnya keras, santannya pecah, dan bumbu hanya menempel di luar. Padahal rendang asli Minangkabau justru sederhana — daging sapi, santan, dan bumbu — yang dimasak perlahan hingga kering dan berwarna cokelat kehitaman.$t$)),
  (gen_random_uuid(), a1, 'HEADING', 3, jsonb_build_object('text', $t$Penjelasan: Rendang Butuh Kesabaran, Bukan Api Besar$t$)),
  (gen_random_uuid(), a1, 'PARAGRAPH', 4, jsonb_build_object('text', $t$Rendang matang melalui proses penguapan santan yang sangat lama (4–6 jam). Santan mengental menjadi minyak, gula dalam santan mengalami karamelisasi, dan bumbu meresap perlahan ke serat daging. Api besar hanya membakar bumbu sebelum daging empuk — itu bedanya rendang dengan kalio (rendang setengah kering). Daging terbaik adalah bagian paha atau sandung lamur yang berlemak sedikit.$t$)),
  (gen_random_uuid(), a1, 'HEADING', 5, jsonb_build_object('text', $t$Bahan Utama (untuk 1 kg daging)$t$)),
  (gen_random_uuid(), a1, 'LIST', 6, jsonb_build_object('items', ARRAY[
    $t$1 kg daging sapi (paha/sandung lamur), potong 20–25 potong ukuran sedang$t$,
    $t$2 liter santan dari 3 butir kelapa tua (pisahkan santan kental dan encer)$t$,
    $t$2 batang serai, memarkan$t$,
    $t$4 lembar daun jeruk, 2 lembar daun kunyit, 2 lembar daun salam$t$,
    $t$2 ruas lengkuas, memarkan; 1 sdm garam dan 1 sdt gula$t$
  ])),
  (gen_random_uuid(), a1, 'HEADING', 7, jsonb_build_object('text', $t$Bumbu Halus$t$)),
  (gen_random_uuid(), a1, 'LIST', 8, jsonb_build_object('items', ARRAY[
    $t$15 butir bawang merah, 8 siung bawang putih$t$,
    $t$10 buah cabai merah keriting (tambah rawit bila suka pedas)$t$,
    $t$2 ruas jahe, 2 ruas kunyit$t$,
    $t$1 sdt ketumbar sangrai, 1/2 sdt jintan, 1/2 sdt merica$t$
  ])),
  (gen_random_uuid(), a1, 'HEADING', 9, jsonb_build_object('text', $t$Langkah Memasak$t$)),
  (gen_random_uuid(), a1, 'LIST', 10, jsonb_build_object('items', ARRAY[
    $t$1. Tumis bumbu halus hingga harum dan berminyak, masukkan serai, lengkuas, dan daun-daun.$t$,
    $t$2. Masukkan daging, aduk hingga berubah warna dan terlumuri bumbu merata.$t$,
    $t$3. Tuang santan encer, masak dengan api sedang sambil sesekali diaduk agar santan tidak pecah.$t$,
    $t$4. Setelah menyusut setengah, tuang santan kental. Kecilkan api.$t$,
    $t$5. Masak 4–5 jam dengan api kecil, aduk berkala. Bumbu akan mengental menjadi kalio lalu mengering menjadi rendang.$t$,
    $t$6. Rendang matang saat berwarna cokelat kehitaman, berminyak, dan daging empuk saat ditusuk garpu.$t$
  ])),
  (gen_random_uuid(), a1, 'HEADING', 11, jsonb_build_object('text', $t$Risiko dan Kesalahan Umum$t$)),
  (gen_random_uuid(), a1, 'LIST', 12, jsonb_build_object('items', ARRAY[
    $t$Santan pecah: penyebabnya api terlalu besar di awal dan jarang diaduk — gunakan api sedang lalu kecil.$t$,
    $t$Daging keras: biasanya karena santan ditambah air putih; gunakan santan encer sebagai pengganti air.$t$,
    $t$Gosong di dasar: aduk hingga dasar wajan terutama pada 2 jam terakhir.$t$,
    $t$Terlalu asin: bumbu meresap membuat rasa makin kuat saat kering — bumbui secukupnya di awal, koreksi di akhir.$t$
  ]));

  -- 2. TUT-KESEHATAN4-001 -> R1.D4 Kesehatan & Mental
  INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, created_by, updated_by)
  VALUES (gen_random_uuid(), 'TUT-KESEHATAN4-001', 'b5555555-5555-5555-5555-555555555555', 'Imunisasi Anak: Jadwal Lengkap', 'imunisasi-anak-jadwal-lengkap',
    'Jadwal imunisasi dasar dan lanjutan untuk anak, persiapan sebelum imunisasi, dan penanganan KIPI yang wajar.', 'id', 7, owner, 'DRAFT', owner, owner)
  ON CONFLICT (business_code) DO NOTHING RETURNING id INTO a2;
  IF a2 IS NULL THEN SELECT id INTO a2 FROM madevi.articles WHERE business_code = 'TUT-KESEHATAN4-001'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = a2;

  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
  (gen_random_uuid(), a2, 'HEADING', 1, jsonb_build_object('text', $t$Masalah: Orang Tua Bingung Mengikuti Jadwal Imunisasi$t$)),
  (gen_random_uuid(), a2, 'PARAGRAPH', 2, jsonb_build_object('text', $t$Banyak orang tua melewatkan imunisasi anak karena lupa jadwal, takut efek samping, atau bingung membedakan imunisasi wajib dan tambahan. Padahal jadwal imunisasi sudah disusun pemerintah mengikuti rekomendasi IDAI dan bisa didapatkan gratis di puskesmas.$t$)),
  (gen_random_uuid(), a2, 'HEADING', 3, jsonb_build_object('text', $t$Penjelasan: Imunisasi Dasar Lengkap (IDL)$t$)),
  (gen_random_uuid(), a2, 'PARAGRAPH', 4, jsonb_build_object('text', $t$Imunisasi melatih sistem kekebalan mengenali kuman berbahaya tanpa harus sakit dulu. Imunisasi Dasar Lengkap diberikan sejak bayi baru lahir hingga usia 18 bulan dan menjadi syarat masuk sekolah di banyak daerah. Artikel ini berisi informasi umum — untuk kondisi khusus anak (prematur, alergi berat, sakit kronis), selalu konsultasikan jadwal dengan dokter anak atau petugas puskesmas.$t$)),
  (gen_random_uuid(), a2, 'HEADING', 5, jsonb_build_object('text', $t$Jadwal Imunisasi Dasar 0–18 Bulan$t$)),
  (gen_random_uuid(), a2, 'LIST', 6, jsonb_build_object('items', ARRAY[
    $t$0–7 hari: Hepatitis B dosis 0 (segera setelah lahir)$t$,
    $t$1 bulan: BCG dan Polio 1$t$,
    $t$2 bulan: DPT-HB-Hib 1 dan Polio 2$t$,
    $t$3 bulan: DPT-HB-Hib 2 dan Polio 3$t$,
    $t$4 bulan: DPT-HB-Hib 3, Polio 4, dan IPV (polio suntik)$t$,
    $t$9 bulan: Campak atau MR$t$,
    $t$10–18 bulan: PCV (pneumokokus) sesuai jadwal dokter/puskesmas$t$,
    $t$18 bulan: DPT-HB-Hib ulangan (booster) dan Campak/MR ulangan$t$
  ])),
  (gen_random_uuid(), a2, 'HEADING', 7, jsonb_build_object('text', $t$Imunisasi Lanjutan$t$)),
  (gen_random_uuid(), a2, 'LIST', 8, jsonb_build_object('items', ARRAY[
    $t$Kelas 1 SD: DT (difteri-tetanus) melalui program BIAS di sekolah$t$,
    $t$Kelas 2 SD: Td (tetanus-difteri)$t$,
    $t$Kelas 5 SD: Td (khusus anak perempuan) sesuai program BIAS$t$,
    $t$Imunisasi tambahan (berbayar/dokter): influenza tahunan, tifoid, hepatitis A, varisela, dan HPV untuk remaja putri$t$
  ])),
  (gen_random_uuid(), a2, 'HEADING', 9, jsonb_build_object('text', $t$Persiapan Sebelum Imunisasi$t$)),
  (gen_random_uuid(), a2, 'LIST', 10, jsonb_build_object('items', ARRAY[
    $t$Pastikan anak dalam kondisi sehat (tidak demam, tidak diare berat)$t$,
    $t$Bawa buku KIA atau kartu imunisasi untuk dicatat$t$,
    $t$Berikan ASI/makan seperti biasa — anak tidak perlu puasa$t$,
    $t$Informasikan riwayat alergi atau reaksi imunisasi sebelumnya kepada petugas$t$
  ])),
  (gen_random_uuid(), a2, 'HEADING', 11, jsonb_build_object('text', $t$Setelah Imunisasi: KIPI yang Wajar$t$)),
  (gen_random_uuid(), a2, 'LIST', 12, jsonb_build_object('items', ARRAY[
    $t$Demam ringan dan rewel 1–2 hari: wajar, kompres hangat dan beri banyak cairan$t$,
    $t$Bengkak kecil di bekas suntikan: kompres dingin, biasanya hilang dalam beberapa hari$t$,
    $t$Segera ke fasilitas kesehatan bila: demam tinggi lebih dari 2 hari, kejang, sesak napas, atau bengkak meluas$t$,
    $t$Catatan: artikel ini bukan pengganti nasihat medis — konsultasikan selalu ke dokter anak atau puskesmas$t$
  ]));

  -- 3. EXP-GEOGRAFI3-001 -> R2.D13 Geografi & Ilmu Bumi
  INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, created_by, updated_by)
  VALUES (gen_random_uuid(), 'EXP-GEOGRAFI3-001', 'c6000001-0000-0000-0000-000000000001', 'Delta Sungai: Tanah Subur dari Lumpur', 'delta-sungai-tanah-subur-dari-lumpur',
    'Bagaimana delta sungai terbentuk, jenis-jenisnya, delta besar dunia, dan manfaatnya bagi manusia.', 'id', 6, owner, 'DRAFT', owner, owner)
  ON CONFLICT (business_code) DO NOTHING RETURNING id INTO a3;
  IF a3 IS NULL THEN SELECT id INTO a3 FROM madevi.articles WHERE business_code = 'EXP-GEOGRAFI3-001'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = a3;

  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
  (gen_random_uuid(), a3, 'HEADING', 1, jsonb_build_object('text', $t$Apa Itu Delta Sungai?$t$)),
  (gen_random_uuid(), a3, 'PARAGRAPH', 2, jsonb_build_object('text', $t$Delta adalah daratan yang terbentuk di muara sungai akibat timbunan sedimen (lumpur, pasir, kerikil) yang dibawa aliran sungai selama ribuan tahun. Namanya berasal dari huruf Yunani delta (Δ) karena bentuknya yang menyerupai segitiga melebar ke arah laut atau danau.$t$)),
  (gen_random_uuid(), a3, 'HEADING', 3, jsonb_build_object('text', $t$Cara Terbentuknya Delta$t$)),
  (gen_random_uuid(), a3, 'PARAGRAPH', 4, jsonb_build_object('text', $t$Sungai mengikis batuan di hulu dan mengangkut materialnya ke hilir. Saat mencapai muara, kecepatan aliran menurun drastis karena bertemu air laut atau danau yang tenang. Material berat mengendap lebih dulu, material halus terbawa lebih jauh — tumpukan inilah yang perlahan membentuk daratan baru yang terus meluas ke arah laut.$t$)),
  (gen_random_uuid(), a3, 'HEADING', 5, jsonb_build_object('text', $t$Jenis-jenis Delta$t$)),
  (gen_random_uuid(), a3, 'LIST', 6, jsonb_build_object('items', ARRAY[
    $t$Delta kaki burung (bird foot): menjorok jauh ke laut seperti jari — contoh: Sungai Mississippi, AS$t$,
    $t$Delta kipas/lengkung (arcuate): melebar melengkung seperti kipas — contoh: Sungai Nil, Mesir$t$,
    $t$Delta runcing (cuspate): berbentuk gigi/runcing karena gelombang laut kuat — contoh: Sungai Ebro, Spanyol$t$,
    $t$Delta estuari: sedimen mengendap di muara yang tertekan/tergenang pasang surut$t$
  ])),
  (gen_random_uuid(), a3, 'HEADING', 7, jsonb_build_object('text', $t$Delta Besar di Dunia dan Indonesia$t$)),
  (gen_random_uuid(), a3, 'LIST', 8, jsonb_build_object('items', ARRAY[
    $t$Gangga–Brahmaputra (Bangladesh/India): delta terbesar di dunia$t$,
    $t$Sungai Nil (Mesir) dan Mississippi (AS): delta klasik yang dipelajari di sekolah$t$,
    $t$Sungai Mekong (Vietnam): lumbung padi Asia Tenggara$t$,
    $t$Indonesia: Delta Mahakam (Kalimantan Timur), Muara Kapuas (Kalimantan Barat), dan Muara Musi (Sumatera Selatan)$t$
  ])),
  (gen_random_uuid(), a3, 'HEADING', 9, jsonb_build_object('text', $t$Kesuburan, Manfaat, dan Ancaman$t$)),
  (gen_random_uuid(), a3, 'PARAGRAPH', 10, jsonb_build_object('text', $t$Tanah delta sangat subur karena kaya unsur hara dari endapan sungai — cocok untuk sawah, perkebunan, dan tambak. Namun delta juga rawan banjir, abrasi, penurunan muka tanah (subsidence), dan intrusi air laut. Bendungan di hulu yang menahan sedimen justru membuat banyak delta di dunia menyusut, sehingga pengelolaannya butuh keseimbangan antara pembangunan dan aliran sedimen alami.$t$));

  -- 4. EXP-TEKNOLOGI5-001 -> R2.D11 Teknologi
  INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, created_by, updated_by)
  VALUES (gen_random_uuid(), 'EXP-TEKNOLOGI5-001', 'c7777777-7777-7777-7777-777777777777', 'Komputasi Kuantum: Masa Depan Komputer', 'komputasi-kuantum-masa-depan-komputer',
    'Pengertian komputasi kuantum, perbedaan qubit dan bit, kegunaan praktis, serta tantangannya.', 'id', 6, owner, 'DRAFT', owner, owner)
  ON CONFLICT (business_code) DO NOTHING RETURNING id INTO a4;
  IF a4 IS NULL THEN SELECT id INTO a4 FROM madevi.articles WHERE business_code = 'EXP-TEKNOLOGI5-001'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = a4;

  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
  (gen_random_uuid(), a4, 'HEADING', 1, jsonb_build_object('text', $t$Apa Itu Komputasi Kuantum?$t$)),
  (gen_random_uuid(), a4, 'PARAGRAPH', 2, jsonb_build_object('text', $t$Komputasi kuantum adalah cara menghitung yang memakai sifat-sifat fisika kuantum — perilaku partikel super kecil seperti elektron dan foton. Komputer biasa memakai bit (0 atau 1), sedangkan komputer kuantum memakai qubit yang bisa berada dalam banyak keadaan sekaligus. Untuk jenis soal tertentu, ia bisa jauh lebih cepat dari superkomputer tercepat sekalipun.$t$)),
  (gen_random_uuid(), a4, 'HEADING', 3, jsonb_build_object('text', $t$Bit Lawan Qubit$t$)),
  (gen_random_uuid(), a4, 'PARAGRAPH', 4, jsonb_build_object('text', $t$Bit klasik seperti sakelar lampu: mati (0) atau nyala (1). Qubit seperti koin yang berputar: selama berputar ia bukan kepala maupun ekor, melainkan gabungan keduanya. Dengan 2 qubit, komputer kuantum bisa mewakili 4 keadaan sekaligus; dengan 300 qubit, keadaannya lebih banyak daripada jumlah atom di alam semesta yang teramati — inilah sumber kekuatannya.$t$)),
  (gen_random_uuid(), a4, 'HEADING', 5, jsonb_build_object('text', $t$Superposisi dan Keterikatan Kuantum$t$)),
  (gen_random_uuid(), a4, 'PARAGRAPH', 6, jsonb_build_object('text', $t$Dua sifat utama qubit adalah superposisi (berada di banyak keadaan sekaligus) dan keterikatan/entanglement (dua qubit terhubung sehingga mengubah satu langsung memengaruhi yang lain, sejauh apa pun). Algoritme kuantum seperti algoritme Shor dan Grover memanfaatkan kedua sifat ini untuk memecahkan soal-soal yang mustahil bagi komputer biasa.$t$)),
  (gen_random_uuid(), a4, 'HEADING', 7, jsonb_build_object('text', $t$Untuk Apa Komputer Kuantum Berguna?$t$)),
  (gen_random_uuid(), a4, 'LIST', 8, jsonb_build_object('items', ARRAY[
    $t$Simulasi molekul untuk penemuan obat dan material baru$t$,
    $t$Optimasi kompleks: rute logistik, portofolio keuangan, jadwal$t$,
    $t$Kriptografi: memecahkan sandi RSA suatu hari nanti — sekaligus mendorong kriptografi tahan kuantum$t$,
    $t$Kecerdasan buatan: mempercepat jenis perhitungan pembelajaran mesin tertentu$t$
  ])),
  (gen_random_uuid(), a4, 'HEADING', 9, jsonb_build_object('text', $t$Tantangan Besar$t$)),
  (gen_random_uuid(), a4, 'PARAGRAPH', 10, jsonb_build_object('text', $t$Qubit sangat rapuh: getaran, panas, bahkan cahaya bisa merusak perhitungannya (disebut dekoherensi). Komputer kuantum harus didinginkan mendekati nol mutlak dan butuh koreksi kesalahan yang masif. Ia juga bukan pengganti laptop — ia unggul hanya pada soal tertentu. Para ahli memperkirakan komputer kuantum praktis untuk industri masih butuh belasan tahun pengembangan.$t$));

  -- 5. SCH-SMA-GEO3-001 -> R3.D16 SMA
  INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, created_by, updated_by)
  VALUES (gen_random_uuid(), 'SCH-SMA-GEO3-001', 'd5555555-5555-5555-5555-555555555555', 'Geografi Kelas 10: Litosfer', 'geografi-kelas-10-litosfer',
    'Materi litosfer: lapisan bumi, lempeng tektonik, jenis batas lempeng, dan tenaga pembentuk relief.', 'id', 7, owner, 'DRAFT', owner, owner)
  ON CONFLICT (business_code) DO NOTHING RETURNING id INTO a5;
  IF a5 IS NULL THEN SELECT id INTO a5 FROM madevi.articles WHERE business_code = 'SCH-SMA-GEO3-001'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = a5;

  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
  (gen_random_uuid(), a5, 'HEADING', 1, jsonb_build_object('text', $t$Tujuan Pembelajaran$t$)),
  (gen_random_uuid(), a5, 'LIST', 2, jsonb_build_object('items', ARRAY[
    $t$Menjelaskan pengertian litosfer dan lapisan-lapisan bumi$t$,
    $t$Mengidentifikasi lempeng tektonik utama dan arah pergerakannya$t$,
    $t$Menganalisis jenis batas lempeng dan relief yang dihasilkannya$t$
  ])),
  (gen_random_uuid(), a5, 'HEADING', 3, jsonb_build_object('text', $t$Pengertian Litosfer$t$)),
  (gen_random_uuid(), a5, 'PARAGRAPH', 4, jsonb_build_object('text', $t$Litosfer berasal dari kata lithos (batuan) dan sphaira (lapisan). Litosfer adalah lapisan batuan terluar bumi yang terdiri atas kerak bumi dan bagian atas mantel yang kaku. Tebalnya sekitar 50–100 km dan terpecah menjadi lempeng-lempeng tektonik yang bergerak di atas lapisan astenosfer yang plastis.$t$)),
  (gen_random_uuid(), a5, 'HEADING', 5, jsonb_build_object('text', $t$Lapisan-lapisan Bumi$t$)),
  (gen_random_uuid(), a5, 'LIST', 6, jsonb_build_object('items', ARRAY[
    $t$Kerak bumi (0–70 km): tempat kita tinggal; kerak benua lebih tebal dari kerak samudra$t$,
    $t$Mantel (±2.900 km): batuan panas yang mengalir sangat lambat, sumber gerakan lempeng$t$,
    $t$Inti luar (±2.200 km): besi-nikel cair, menghasilkan medan magnet bumi$t$,
    $t$Inti dalam (±1.200 km): besi-nikel padat dengan suhu mencapai ±5.500°C$t$
  ])),
  (gen_random_uuid(), a5, 'HEADING', 7, jsonb_build_object('text', $t$Lempeng Tektonik$t$)),
  (gen_random_uuid(), a5, 'PARAGRAPH', 8, jsonb_build_object('text', $t$Litosfer terpecah menjadi lempeng besar (Pasifik, Indo-Australia, Eurasia, Amerika, Afrika, Antarktika) dan lempeng kecil. Lempeng bergerak beberapa sentimeter per tahun karena arus konveksi di mantel. Indonesia berada di pertemuan tiga lempeng besar — itulah sebabnya rawan gempa dan gunung berapi.$t$)),
  (gen_random_uuid(), a5, 'HEADING', 9, jsonb_build_object('text', $t$Jenis Batas Lempeng$t$)),
  (gen_random_uuid(), a5, 'LIST', 10, jsonb_build_object('items', ARRAY[
    $t$Divergen (saling menjauh): membentuk punggung tengah samudra dan lembah retakan$t$,
    $t$Konvergen (saling mendekat): membentuk palung laut, pegunungan, dan busur vulkanik$t$,
    $t$Transform (saling bergeser): membentuk sesar/patahan, contoh Sesar San Andreas$t$
  ])),
  (gen_random_uuid(), a5, 'HEADING', 11, jsonb_build_object('text', $t$Latihan Soal$t$)),
  (gen_random_uuid(), a5, 'LIST', 12, jsonb_build_object('items', ARRAY[
    $t$1. Jelaskan perbedaan kerak benua dan kerak samudra! Kunci: kerak benua tebal (±35–70 km, granit), kerak samudra tipis (±5–10 km, basalt).$t$,
    $t$2. Mengapa Indonesia sering mengalami gempa bumi? Kunci: berada di pertemuan Lempeng Indo-Australia, Eurasia, dan Pasifik.$t$,
    $t$3. Sebutkan relief yang terbentuk pada batas lempeng konvergen! Kunci: palung laut, pegunungan lipatan, dan gunung berapi.$t$
  ]));

  -- 6. SCH-SD-BIN6-001 -> R3.D14.K10 Kelas 3 SD
  INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, created_by, updated_by)
  VALUES (gen_random_uuid(), 'SCH-SD-BIN6-001', 'd1000003-0000-0000-0000-000000000003', 'Bahasa Indonesia Kelas 3: Menulis Surat', 'bahasa-indonesia-kelas-3-menulis-surat',
    'Belajar bagian-bagian surat pribadi, contoh surat untuk guru, dan langkah menulis surat yang baik.', 'id', 6, owner, 'DRAFT', owner, owner)
  ON CONFLICT (business_code) DO NOTHING RETURNING id INTO a6;
  IF a6 IS NULL THEN SELECT id INTO a6 FROM madevi.articles WHERE business_code = 'SCH-SD-BIN6-001'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = a6;

  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
  (gen_random_uuid(), a6, 'HEADING', 1, jsonb_build_object('text', $t$Tujuan Pembelajaran$t$)),
  (gen_random_uuid(), a6, 'LIST', 2, jsonb_build_object('items', ARRAY[
    $t$Siswa dapat menyebutkan bagian-bagian surat pribadi$t$,
    $t$Siswa dapat menulis surat sederhana kepada guru atau teman dengan bahasa yang santun$t$
  ])),
  (gen_random_uuid(), a6, 'HEADING', 3, jsonb_build_object('text', $t$Apa Itu Surat?$t$)),
  (gen_random_uuid(), a6, 'PARAGRAPH', 4, jsonb_build_object('text', $t$Surat adalah pesan tertulis yang dikirim kepada orang lain. Ada surat pribadi (untuk keluarga, guru, teman) dan surat resmi (untuk instansi). Hari ini kita belajar menulis surat pribadi yang bahasanya bebas dan hangat.$t$)),
  (gen_random_uuid(), a6, 'HEADING', 5, jsonb_build_object('text', $t$Bagian-bagian Surat Pribadi$t$)),
  (gen_random_uuid(), a6, 'LIST', 6, jsonb_build_object('items', ARRAY[
    $t$Tempat dan tanggal surat ditulis (pojok kanan atas)$t$,
    $t$Salam pembuka, misalnya: Salam sayang,$t$,
    $t$Isi surat: kabar, maksud, dan cerita$t$,
    $t$Salam penutup, misalnya: Hormat saya,$t$,
    $t$Nama pengirim surat$t$
  ])),
  (gen_random_uuid(), a6, 'HEADING', 7, jsonb_build_object('text', $t$Contoh Surat untuk Guru$t$)),
  (gen_random_uuid(), a6, 'PARAGRAPH', 8, jsonb_build_object('text', $t$Jakarta, 13 Oktober 2026. Salam hormat, Ibu Guru yang saya sayangi. Ibu, terima kasih sudah mengajari saya membaca dengan sabar. Sekarang saya sudah bisa membaca buku cerita sendiri. Semoga Ibu sehat selalu. Hormat saya, Sinta.$t$)),
  (gen_random_uuid(), a6, 'HEADING', 9, jsonb_build_object('text', $t$Langkah Menulis Surat$t$)),
  (gen_random_uuid(), a6, 'LIST', 10, jsonb_build_object('items', ARRAY[
    $t$Tentukan kepada siapa surat ditujukan$t$,
    $t$Tulis tempat dan tanggal di kanan atas$t$,
    $t$Tulis salam pembuka yang sopan$t$,
    $t$Tulis isi dengan kalimat yang jelas dan runtut$t$,
    $t$Akhiri dengan salam penutup dan nama pengirim$t$
  ])),
  (gen_random_uuid(), a6, 'HEADING', 11, jsonb_build_object('text', $t$Latihan Soal$t$)),
  (gen_random_uuid(), a6, 'LIST', 12, jsonb_build_object('items', ARRAY[
    $t$1. Sebutkan 5 bagian surat pribadi! Kunci: tempat-tanggal, salam pembuka, isi, salam penutup, nama pengirim.$t$,
    $t$2. Di mana letak tempat dan tanggal surat? Kunci: di pojok kanan atas.$t$,
    $t$3. Tulislah surat pendek untuk temanmu yang sedang sakit! Kunci: memuat salam pembuka, isi (doa cepat sembuh), salam penutup, dan nama pengirim.$t$
  ]));
END $do$;

COMMIT;
