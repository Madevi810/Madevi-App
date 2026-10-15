-- ============================================================
-- Madevi artikel batch 34 — 6 artikel (DRAFT, id)
-- Owner: f7125028-187e-44e0-b95b-88b69b8d5c9a
-- Idempoten: ON CONFLICT DO NOTHING + guard block ganda
-- ============================================================

DO $do$
DECLARE
  aid uuid;
BEGIN
  INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, created_by, updated_by)
  VALUES (gen_random_uuid(), 'TUT-ELEKTRONIK2-001', 'b4444444-4444-4444-4444-444444444444', 'Solder untuk Pemula: Teknik Dasar', 'solder-untuk-pemula-teknik-dasar',
    'Panduan menyolder untuk pemula: alat, teknik yang benar, kesalahan umum, dan keselamatan kerja.',
    'id', 8, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT',
    'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
  ON CONFLICT (business_code) DO NOTHING;

  SELECT id INTO aid FROM madevi.articles WHERE business_code = 'TUT-ELEKTRONIK2-001';

  IF aid IS NOT NULL AND NOT EXISTS (SELECT 1 FROM madevi.article_blocks WHERE article_id = aid) THEN
    INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
    (gen_random_uuid(), aid, 'HEADING', 0, jsonb_build_object('text', $txt$Solder untuk Pemula: Teknik Dasar$txt$)),
    (gen_random_uuid(), aid, 'PARAGRAPH', 1, jsonb_build_object('text', $txt$Banyak perangkat elektronik rusak bukan karena komponennya mati, melainkan karena sambungan soldernya retak atau lepas. Kabel headphone putus, tombol remote tidak responsif, lampu LED mati sebelah — semua itu sering kali hanya soal titik solder yang buruk. Membawanya ke tukang servis tentu bisa, tetapi biayanya kadang lebih mahal dari kerusakannya. Kabar baiknya: menyolder adalah keterampilan yang bisa dipelajari siapa pun dalam satu sore latihan.$txt$)),
    (gen_random_uuid(), aid, 'HEADING', 2, jsonb_build_object('text', $txt$Kenapa Kamu Perlu Bisa Menyolder$txt$)),
    (gen_random_uuid(), aid, 'PARAGRAPH', 3, jsonb_build_object('text', $txt$Menyolder adalah cara menyambungkan kaki komponen elektronik ke papan sirkuit (PCB) menggunakan timah yang dilelehkan. Sambungan solder yang baik punya tiga ciri: permukaannya mengilap (bukan kusam), bentuknya seperti kerucut kecil yang membungkus kaki komponen, dan tidak goyang saat disentuh. Sambungan yang buruk — disebut cold joint atau solder dingin — terlihat kusam, berbutir, dan gampang retak. Inilah penyebab sebagian besar kerusakan "misterius" pada perangkat elektronik.$txt$)),
    (gen_random_uuid(), aid, 'HEADING', 4, jsonb_build_object('text', $txt$Alat dan Bahan yang Disiapkan$txt$)),
    (gen_random_uuid(), aid, 'LIST', 5, jsonb_build_object('text', $txt$Solder listrik 30–40 watt (cukup untuk pemula, jangan yang terlalu besar) | Timah solder (tenol) diameter 0,8–1 mm | Flux atau pasta solder untuk membantu timah menempel | Spons basah atau kawat pembersih untuk membersihkan mata solder | Tang potong kecil untuk memotong sisa kaki komponen | Multimeter untuk memeriksa hasil sambungan | Kacamata pelindung dan bekerja di tempat berventilasi baik$txt$)),
    (gen_random_uuid(), aid, 'HEADING', 6, jsonb_build_object('text', $txt$Langkah Menyolder yang Benar$txt$)),
    (gen_random_uuid(), aid, 'LIST', 7, jsonb_build_object('text', $txt$Panaskan solder dan bersihkan mata soldernya pada spons basah hingga mengilap. | Tempelkan mata solder ke kaki komponen DAN lubang PCB secara bersamaan selama 2–3 detik agar keduanya panas. | Sentuhkan timah ke sambungan (bukan ke mata solder) hingga meleleh dan membungkus kaki komponen secukupnya. | Angkat timah terlebih dulu, lalu angkat solder — urutan ini penting. | Tahan posisi komponen diam selama 3–5 detik sampai timah mengeras dan mengilap. | Periksa hasilnya: harus mengilap dan berbentuk kerucut. | Potong sisa kaki komponen yang kepanjangan dengan tang potong.$txt$)),
    (gen_random_uuid(), aid, 'HEADING', 8, jsonb_build_object('text', $txt$Kesalahan Umum Pemula$txt$)),
    (gen_random_uuid(), aid, 'LIST', 9, jsonb_build_object('text', $txt$Solder dingin (cold joint): sambungan tidak dipanaskan cukup lama sehingga timah hanya menempel di permukaan, bukan menyatu — hasilnya kusam dan rapuh. | Terlalu banyak timah: timah menggumpal seperti bola dan bisa menghubungkan dua jalur yang seharusnya terpisah (korsleting). | Mata solder kotor: timah tidak mau menempel pada mata solder yang berkerak — selalu bersihkan sebelum dan sesudah dipakai. | Memanaskan terlalu lama: komponen sensitif seperti transistor dan IC bisa rusak jika dipanaskan lebih dari 5 detik.$txt$)),
    (gen_random_uuid(), aid, 'HEADING', 10, jsonb_build_object('text', $txt$Risiko, Keselamatan, dan Langkah Berikutnya$txt$)),
    (gen_random_uuid(), aid, 'PARAGRAPH', 11, jsonb_build_object('text', $txt$Risiko utama menyolder adalah luka bakar (mata solder bersuhu di atas 300 derajat Celsius) dan asap timah yang tidak sehat dihirup terus-menerus — selalu bekerja di ruangan berventilasi dan jangan menyentuh mata solder. Jangan berlatih langsung pada perangkat yang masih dipakai; gunakan PCB bekas atau kit latihan yang murah. Setelah mahir membuat sambungan dasar, langkah berikutnya adalah belajar melepas solder (desoldering) dengan penyedot timah, lalu mencoba proyek sederhana seperti merakit lampu LED atau memperbaiki kabel yang putus. Keterampilan kecil ini akan menghemat banyak biaya servis seumur hidup.$txt$));
  END IF;
END $do$;

DO $do$
DECLARE
  aid uuid;
BEGIN
  INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, created_by, updated_by)
  VALUES (gen_random_uuid(), 'TUT-INTERNET2-001', 'c5000003-0000-0000-0000-000000000003', 'WiFi Lemot: Diagnosis dan Solusi', 'wifi-lemot-diagnosis-dan-solusi',
    'Cara mendiagnosis sendiri penyebab WiFi lemot dan solusinya, langkah demi langkah.',
    'id', 7, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT',
    'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
  ON CONFLICT (business_code) DO NOTHING;

  SELECT id INTO aid FROM madevi.articles WHERE business_code = 'TUT-INTERNET2-001';

  IF aid IS NOT NULL AND NOT EXISTS (SELECT 1 FROM madevi.article_blocks WHERE article_id = aid) THEN
    INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
    (gen_random_uuid(), aid, 'HEADING', 0, jsonb_build_object('text', $txt$WiFi Lemot: Diagnosis dan Solusi$txt$)),
    (gen_random_uuid(), aid, 'PARAGRAPH', 1, jsonb_build_object('text', $txt$Sudah bayar paket internet mahal tapi video masih buffering dan game sering lag? Sebelum buru-buru menyalahkan provider atau membeli router baru, ketahuilah bahwa sebagian besar masalah WiFi lemot sebenarnya bisa didiagnosis dan diperbaiki sendiri dalam waktu kurang dari satu jam. Kuncinya adalah menemukan dulu di mana tepatnya masalahnya berada.$txt$)),
    (gen_random_uuid(), aid, 'HEADING', 2, jsonb_build_object('text', $txt$Pahami Dulu: Di Mana Letak Masalahnya$txt$)),
    (gen_random_uuid(), aid, 'PARAGRAPH', 3, jsonb_build_object('text', $txt$Ada dua jenis "lemot" yang berbeda dan solusinya pun berbeda. Pertama, internet lambat dari provider (ISP): kecepatan yang masuk ke rumah memang kecil. Kedua, WiFi lambat di dalam rumah: internet dari ISP kencang, tetapi sinyal WiFi tidak tersampaikan dengan baik ke perangkatmu. Cara membedakannya sederhana: colokkan laptop langsung ke router dengan kabel LAN, lalu jalankan tes kecepatan. Jika hasilnya kencang, masalahnya ada di WiFi rumahmu. Jika tetap lambat, masalahnya ada di sisi provider.$txt$)),
    (gen_random_uuid(), aid, 'HEADING', 4, jsonb_build_object('text', $txt$Diagnosis Mandiri Langkah demi Langkah$txt$)),
    (gen_random_uuid(), aid, 'LIST', 5, jsonb_build_object('text', $txt$Uji kecepatan tepat di samping router, lalu uji lagi dari ruangan terjauh — selisih besar berarti masalah jangkauan sinyal. | Uji dengan kabel LAN untuk memastikan kecepatan asli dari provider sesuai paket yang dibayar. | Hitung perangkat yang terhubung: puluhan perangkat aktif (CCTV, smart TV, HP keluarga) bisa menghabiskan bandwidth. | Perhatikan waktu: lemot hanya di jam sibuk (malam hari) biasanya berarti jaringan provider padat. | Restart router (cabut 30 detik lalu colok lagi) — ini memperbaiki banyak masalah sementara. | Cek kanal WiFi dengan aplikasi penganalisis WiFi: kanal yang penuh sesak oleh WiFi tetangga memperlambat koneksi.$txt$)),
    (gen_random_uuid(), aid, 'HEADING', 6, jsonb_build_object('text', $txt$Solusi Berdasarkan Hasil Diagnosis$txt$)),
    (gen_random_uuid(), aid, 'LIST', 7, jsonb_build_object('text', $txt$Masalah jangkauan: pindahkan router ke posisi tengah rumah dan tempat tinggi, jauh dari tembok beton dan perangkat elektronik besar. | Interferensi kanal: pindah ke kanal yang sepi atau aktifkan pita 5 GHz yang lebih lega untuk perangkat dekat router. | Terlalu banyak perangkat: batasi perangkat prioritas rendah atau jadwalkan unduhan besar di malam hari. | Router tua: router berumur di atas 5 tahun sering tidak sanggup menangani banyak perangkat modern — pertimbangkan upgrade atau tambah access point. | Masalah provider: jika kecepatan kabel LAN jauh di bawah paket yang dibayar, hubungi ISP dengan bukti hasil tes kecepatan.$txt$)),
    (gen_random_uuid(), aid, 'HEADING', 8, jsonb_build_object('text', $txt$Hal yang Sering Disalahpahami$txt$)),
    (gen_random_uuid(), aid, 'LIST', 9, jsonb_build_object('text', $txt$Mbps bukan MBps: paket 50 Mbps artinya kecepatan unduh maksimal sekitar 6 MB per detik — huruf "b" kecil dan besar beda 8 kali lipat. | FUP (batas pemakaian wajar): sebagian paket menurunkan kecepatan setelah kuota tertentu terpakai. | WiFi tetangga: di apartemen padat, puluhan WiFi berebut kanal yang sama sehingga semua melambat. | Server tujuan: kadang yang lambat bukan internetmu, melainkan server situs atau game yang sedang bermasalah.$txt$)),
    (gen_random_uuid(), aid, 'HEADING', 10, jsonb_build_object('text', $txt$Risiko dan Batasan$txt$)),
    (gen_random_uuid(), aid, 'PARAGRAPH', 11, jsonb_build_object('text', $txt$Hati-hati menekan tombol reset pada router jika kamu tidak tahu pengaturan login provider (seperti username dan password PPPoE) — reset akan menghapus semua pengaturan dan internet bisa mati total sampai dikonfigurasi ulang. Catat hasil tes kecepatan sebelum dan sesudah perbaikan agar kamu tahu solusi mana yang benar-benar berhasil. Jika semua langkah sudah dicoba dan kecepatan kabel LAN tetap jauh di bawah paket berbayar, itu saatnya menuntut hakmu sebagai pelanggan ke provider, bukan membeli perangkat baru.$txt$));
  END IF;
END $do$;

DO $do$
DECLARE
  aid uuid;
BEGIN
  INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, created_by, updated_by)
  VALUES (gen_random_uuid(), 'EXP-ASTRONOMI4-001', 'c5000002-0000-0000-0000-000000000002', 'Nebula: Pabrik Bintang', 'nebula-pabrik-bintang',
    'Mengenal nebula: awan gas raksasa tempat bintang-bintang dilahirkan.',
    'id', 6, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT',
    'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
  ON CONFLICT (business_code) DO NOTHING;

  SELECT id INTO aid FROM madevi.articles WHERE business_code = 'EXP-ASTRONOMI4-001';

  IF aid IS NOT NULL AND NOT EXISTS (SELECT 1 FROM madevi.article_blocks WHERE article_id = aid) THEN
    INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
    (gen_random_uuid(), aid, 'HEADING', 0, jsonb_build_object('text', $txt$Nebula: Pabrik Bintang$txt$)),
    (gen_random_uuid(), aid, 'PARAGRAPH', 1, jsonb_build_object('text', $txt$Lihatlah foto-foto luar angkasa yang berwarna-warni dengan awan raksasa berbentuk sayap atau pilar — itulah nebula. Nebula adalah awan gas dan debu raksasa yang tersebar di antara bintang-bintang, dan ia punya julukan indah: pabrik bintang. Hampir semua bintang yang kamu lihat di langit malam, termasuk Matahari kita, lahir dari sebuah nebula.$txt$)),
    (gen_random_uuid(), aid, 'HEADING', 2, jsonb_build_object('text', $txt$Tiga Jenis Nebula$txt$)),
    (gen_random_uuid(), aid, 'LIST', 3, jsonb_build_object('text', $txt$Nebula emisi: awan gas yang berpijar karena disinari bintang panas di dalamnya — contohnya Nebula Orion yang berwarna kemerahan. | Nebula refleksi: awan debu yang tidak berpijar sendiri, melainkan memantulkan cahaya bintang di dekatnya sehingga tampak kebiruan. | Nebula planetari: cangkang gas yang dilepaskan bintang sekarat berukuran sedang — namanya menyesatkan karena tidak ada hubungannya dengan planet.$txt$)),
    (gen_random_uuid(), aid, 'PARAGRAPH', 4, jsonb_build_object('text', $txt$Bagaimana bintang lahir dari nebula? Semuanya dimulai dari gravitasi. Bagian awan yang sedikit lebih padat menarik materi di sekitarnya hingga runtuh ke dalam. Saat runtuh, inti awan semakin panas dan padat selama jutaan tahun, sampai akhirnya suhu dan tekanannya cukup tinggi untuk menyalakan reaksi fusi nuklir — hidrogen berubah menjadi helium dan melepaskan energi raksasa. Pada momen itulah sebuah bintang "menyala" dan mulai bersinar.$txt$)),
    (gen_random_uuid(), aid, 'HEADING', 5, jsonb_build_object('text', $txt$Nebula Terkenal yang Bisa Kamu Kenali$txt$)),
    (gen_random_uuid(), aid, 'LIST', 6, jsonb_build_object('text', $txt$Nebula Orion (M42): pabrik bintang terdekat dari Bumi, bisa dilihat dengan teropong kecil di rasi Orion. | Nebula Elang: rumah bagi "Pilar Penciptaan" yang terkenal dari foto Teleskop Hubble. | Nebula Cincin: nebula planetari berbentuk cincin sempurna di rasi Lyra. | Nebula Kepiting: sisa ledakan supernova yang disaksikan manusia pada tahun 1054.$txt$)),
    (gen_random_uuid(), aid, 'PARAGRAPH', 7, jsonb_build_object('text', $txt$Nebula juga adalah kuburan sekaligus tempat daur ulang bintang. Bintang yang mati — lewat ledakan supernova atau hembusan angin bintang — melemparkan materinya kembali ke angkasa dan memperkaya nebula di sekitarnya dengan unsur-unsur berat seperti karbon, oksigen, dan besi. Dari nebula yang diperkaya inilah generasi bintang berikutnya lahir. Siklus ini sudah berputar miliaran tahun, dan Matahari kita adalah bintang generasi kesekian dari daur ulang kosmik ini.$txt$)),
    (gen_random_uuid(), aid, 'HEADING', 8, jsonb_build_object('text', $txt$Fakta Menarik tentang Nebula$txt$)),
    (gen_random_uuid(), aid, 'LIST', 9, jsonb_build_object('text', $txt$Ukurannya tidak masuk akal: satu nebula bisa membentang puluhan hingga ratusan tahun cahaya — jauh lebih besar dari seluruh tata surya. | Warnanya punya arti: merah biasanya gas hidrogen yang berpijar, biru-hijau sering kali oksigen. | Kamu terbuat dari debu bintang: unsur pembentuk tubuhmu — karbon, kalsium, zat besi — ditempa di dalam bintang dan disebar lewat nebula.$txt$));
  END IF;
END $do$;

DO $do$
DECLARE
  aid uuid;
BEGIN
  INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, created_by, updated_by)
  VALUES (gen_random_uuid(), 'EXP-SEJARAH5-001', 'c8888888-8888-8888-8888-888888888888', 'Majapahit: Puncak Kejayaan Nusantara', 'majapahit-puncak-kejayaan-nusantara',
    'Sejarah Kerajaan Majapahit: dari berdiri, masa keemasan Gajah Mada, hingga warisannya bagi Indonesia.',
    'id', 7, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT',
    'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
  ON CONFLICT (business_code) DO NOTHING;

  SELECT id INTO aid FROM madevi.articles WHERE business_code = 'EXP-SEJARAH5-001';

  IF aid IS NOT NULL AND NOT EXISTS (SELECT 1 FROM madevi.article_blocks WHERE article_id = aid) THEN
    INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
    (gen_random_uuid(), aid, 'HEADING', 0, jsonb_build_object('text', $txt$Majapahit: Puncak Kejayaan Nusantara$txt$)),
    (gen_random_uuid(), aid, 'PARAGRAPH', 1, jsonb_build_object('text', $txt$Pada abad ke-14, dari sebuah kota di pedalaman Jawa Timur bernama Trowulan, berdiri kerajaan terbesar yang pernah dikenal Nusantara: Majapahit. Kerajaan Hindu-Buddha ini menguasai jalur perdagangan maritim, mempersatukan wilayah yang membentang dari Sumatra hingga Papua dalam jaringan kekuasaannya, dan meninggalkan warisan budaya yang masih hidup hingga hari ini. Kisah Majapahit adalah kisah tentang bagaimana Nusantara pernah menjadi kekuatan besar dunia.$txt$)),
    (gen_random_uuid(), aid, 'HEADING', 2, jsonb_build_object('text', $txt$Awal Berdiri: Dari Runtuhan Singasari$txt$)),
    (gen_random_uuid(), aid, 'PARAGRAPH', 3, jsonb_build_object('text', $txt$Majapahit lahir dari kekacauan. Pada 1292, Kerajaan Singasari runtuh diserang Jayakatwang dari Kediri. Menantu raja Singasari, Raden Wijaya, melarikan diri dan membangun desa kecil bernama Majapahit. Setahun kemudian, pasukan Mongol dari Tiongkok datang menyerang Jawa — Raden Wijaya dengan cerdik bersekutu dengan mereka untuk menghancurkan Jayakatwang, lalu berbalik mengusir pasukan Mongol itu sendiri. Pada 1293 ia dinobatkan sebagai raja pertama Majapahit dengan gelar Kertarajasa Jayawardhana.$txt$)),
    (gen_random_uuid(), aid, 'HEADING', 4, jsonb_build_object('text', $txt$Masa Keemasan: Gajah Mada dan Sumpah Palapa$txt$)),
    (gen_random_uuid(), aid, 'LIST', 5, jsonb_build_object('text', $txt$Sumpah Palapa (1336): Mahapatih Gajah Mada bersumpah tidak akan menikmati kesenangan sebelum Nusantara bersatu di bawah Majapahit. | Raja Hayam Wuruk: memerintah pada puncak kejayaan (1350–1389), didampingi Gajah Mada sebagai mahapatih. | Kakawin Nagarakretagama: karya sastra Mpu Prapanca (1365) yang mencatat wilayah kekuasaan Majapahit mencakup hampir seluruh Nusantara. | Armada laut yang kuat: Majapahit menguasai jalur perdagangan rempah dan menjalin hubungan dagang hingga ke Tiongkok dan India.$txt$)),
    (gen_random_uuid(), aid, 'PARAGRAPH', 6, jsonb_build_object('text', $txt$Di balik kejayaan militernya, Majapahit adalah negara dagang yang makmur. Pelabuhan-pelabuhannya ramai oleh kapal dari berbagai bangsa, pajak perdagangan mengisi kas kerajaan, dan sistem irigasi yang maju membuat lumbung padi Jawa Timur melimpah. Pemerintahan dijalankan dengan birokrasi yang rapi: raja dibantu mahapatih, dewan menteri, dan penguasa daerah (bhre) yang kebanyakan masih kerabat istana.$txt$)),
    (gen_random_uuid(), aid, 'HEADING', 7, jsonb_build_object('text', $txt$Warisan Budaya Majapahit$txt$)),
    (gen_random_uuid(), aid, 'LIST', 8, jsonb_build_object('text', $txt$Candi-candi megah: Candi Penataran di Blitar dan kompleks Trowulan sebagai ibu kota. | Kesusastraan: Nagarakretagama dan Sutasoma — dari Sutasoma lahir semboyan "Bhinneka Tunggal Ika". | Bahasa: bahasa Jawa Kuno dan Melayu berkembang sebagai bahasa pergaulan antarpulau. | Sistem pertanian: teknik irigasi dan sawah yang menjadi fondasi ketahanan pangan Jawa.$txt$)),
    (gen_random_uuid(), aid, 'PARAGRAPH', 9, jsonb_build_object('text', $txt$Tidak ada kerajaan yang abadi. Setelah Gajah Mada dan Hayam Wuruk wafat, Majapahit melemah: perang saudara Paregreg (1404–1406) menguras kekuatan, dan pengaruh Islam yang tumbuh melahirkan Kesultanan Demak yang akhirnya mengambil alih hegemoni Jawa sekitar awal abad ke-16. Namun gagasan "Nusantara" yang dipersatukan Majapahit tidak mati — ia hidup kembali berabad-abad kemudian sebagai inspirasi bagi para pendiri Indonesia. Ketika kita menyebut Bhinneka Tunggal Ika hari ini, kita sedang mengutip warisan Majapahit.$txt$));
  END IF;
END $do$;

DO $do$
DECLARE
  aid uuid;
BEGIN
  INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, created_by, updated_by)
  VALUES (gen_random_uuid(), 'SCH-SMP-MAT3-001', 'd4444444-4444-4444-4444-444444444444', 'Matematika Kelas 7: Himpunan', 'matematika-kelas-7-himpunan',
    'Materi himpunan untuk kelas 7 SMP: pengertian, cara menyatakan, himpunan kosong dan semesta, operasi himpunan, latihan soal beserta kunci jawaban.',
    'id', 10, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT',
    'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
  ON CONFLICT (business_code) DO NOTHING;

  SELECT id INTO aid FROM madevi.articles WHERE business_code = 'SCH-SMP-MAT3-001';

  IF aid IS NOT NULL AND NOT EXISTS (SELECT 1 FROM madevi.article_blocks WHERE article_id = aid) THEN
    INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
    (gen_random_uuid(), aid, 'HEADING', 0, jsonb_build_object('text', $txt$Matematika Kelas 7: Himpunan$txt$)),
    (gen_random_uuid(), aid, 'PARAGRAPH', 1, jsonb_build_object('text', $txt$Tujuan pembelajaran: setelah mempelajari bab ini, kamu diharapkan dapat menjelaskan pengertian himpunan, menyatakan suatu himpunan dengan tiga cara, menentukan himpunan kosong dan himpunan semesta, serta melakukan operasi irisan, gabungan, selisih, dan komplemen pada himpunan.$txt$)),
    (gen_random_uuid(), aid, 'HEADING', 2, jsonb_build_object('text', $txt$Apa Itu Himpunan?$txt$)),
    (gen_random_uuid(), aid, 'PARAGRAPH', 3, jsonb_build_object('text', $txt$Himpunan adalah kumpulan objek yang terdefinisi dengan jelas, artinya setiap orang sepakat tentang objek apa saja yang menjadi anggotanya. Contoh: "himpunan bilangan genap kurang dari 10" adalah himpunan, karena jelas anggotanya: 2, 4, 6, 8. Sebaliknya, "kumpulan makanan enak" bukan himpunan, karena "enak" berbeda-beda menurut tiap orang. Anggota himpunan ditulis di dalam kurung kurawal, misalnya A = {2, 4, 6, 8}.$txt$)),
    (gen_random_uuid(), aid, 'HEADING', 4, jsonb_build_object('text', $txt$Tiga Cara Menyatakan Himpunan$txt$)),
    (gen_random_uuid(), aid, 'LIST', 5, jsonb_build_object('text', $txt$Enumerasi (mendaftar anggota): B = {Senin, Selasa, Rabu, Kamis, Jumat} — cocok jika anggotanya sedikit. | Notasi pembentuk himpunan: C = {x | x adalah huruf vokal} dibaca "himpunan x sedemikian hingga x adalah huruf vokal". | Menyatakan dengan kata-kata: D adalah himpunan bilangan prima kurang dari 12.$txt$)),
    (gen_random_uuid(), aid, 'HEADING', 6, jsonb_build_object('text', $txt$Himpunan Kosong dan Himpunan Semesta$txt$)),
    (gen_random_uuid(), aid, 'PARAGRAPH', 7, jsonb_build_object('text', $txt$Himpunan kosong adalah himpunan yang tidak memiliki anggota, ditulis {} atau ∅ (dibaca "phi"). Contoh: himpunan bilangan genap antara 3 dan 5 — tidak ada, jadi himpunan kosong. Himpunan semesta (S) adalah himpunan yang memuat semua anggota yang sedang dibicarakan. Misalnya jika kita membahas himpunan hewan berkaki empat, semestanya bisa berupa himpunan semua hewan.$txt$)),
    (gen_random_uuid(), aid, 'HEADING', 8, jsonb_build_object('text', $txt$Operasi pada Himpunan$txt$)),
    (gen_random_uuid(), aid, 'LIST', 9, jsonb_build_object('text', $txt$Irisan (A ∩ B): anggota yang dimiliki KEDUA himpunan. Contoh: A = {1,2,3,4}, B = {3,4,5} maka A ∩ B = {3,4}. | Gabungan (A ∪ B): semua anggota dari kedua himpunan tanpa pengulangan. Contoh: A ∪ B = {1,2,3,4,5}. | Selisih (A − B): anggota A yang bukan anggota B. Contoh: A − B = {1,2}. | Komplemen (Aᶜ): anggota semesta yang bukan anggota A.$txt$)),
    (gen_random_uuid(), aid, 'HEADING', 10, jsonb_build_object('text', $txt$Latihan Soal dan Kunci Jawaban$txt$)),
    (gen_random_uuid(), aid, 'LIST', 11, jsonb_build_object('text', $txt$Soal 1: Diketahui P = {a, b, c, d} dan Q = {c, d, e, f}. Tentukan P ∩ Q dan P ∪ Q! Kunci: P ∩ Q = {c, d}; P ∪ Q = {a, b, c, d, e, f}. | Soal 2: Dari 40 siswa, 25 suka matematika, 20 suka IPA, dan 10 suka keduanya. Berapa siswa yang tidak suka keduanya? Kunci: yang suka salah satu = 25 + 20 − 10 = 35; yang tidak suka keduanya = 40 − 35 = 5 siswa. | Soal 3: Apakah "kumpulan siswa tertinggi di kelas" merupakan himpunan? Jelaskan! Kunci: Bukan himpunan, karena "tertinggi" tidak terdefinisi jelas (berapa cm batasnya?) sehingga orang bisa berbeda pendapat.$txt$));
  END IF;
END $do$;

DO $do$
DECLARE
  aid uuid;
BEGIN
  INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, created_by, updated_by)
  VALUES (gen_random_uuid(), 'SCH-SD-IPS5-001', 'd3333333-3333-3333-3333-333333333333', 'IPS Kelas 3: Lingkungan Sekitar', 'ips-kelas-3-lingkungan-sekitar',
    'Materi IPS kelas 3 SD: mengenal lingkungan alam dan lingkungan buatan, manfaatnya, dan cara menjaganya, lengkap dengan latihan soal dan kunci jawaban.',
    'id', 8, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT',
    'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
  ON CONFLICT (business_code) DO NOTHING;

  SELECT id INTO aid FROM madevi.articles WHERE business_code = 'SCH-SD-IPS5-001';

  IF aid IS NOT NULL AND NOT EXISTS (SELECT 1 FROM madevi.article_blocks WHERE article_id = aid) THEN
    INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
    (gen_random_uuid(), aid, 'HEADING', 0, jsonb_build_object('text', $txt$IPS Kelas 3: Lingkungan Sekitar$txt$)),
    (gen_random_uuid(), aid, 'PARAGRAPH', 1, jsonb_build_object('text', $txt$Tujuan pembelajaran: setelah mempelajari bab ini, kamu dapat menjelaskan pengertian lingkungan, membedakan lingkungan alam dan lingkungan buatan, menyebutkan manfaat lingkungan bagi manusia, serta menunjukkan cara menjaga lingkungan sekitarmu.$txt$)),
    (gen_random_uuid(), aid, 'HEADING', 2, jsonb_build_object('text', $txt$Apa Itu Lingkungan?$txt$)),
    (gen_random_uuid(), aid, 'PARAGRAPH', 3, jsonb_build_object('text', $txt$Coba lihat sekelilingmu sekarang! Ada rumah, jalan, pohon, mungkin sungai atau sawah. Semua yang ada di sekitarmu itulah yang disebut lingkungan. Lingkungan adalah segala sesuatu yang ada di sekitar manusia dan memengaruhi kehidupannya. Lingkungan dibagi menjadi dua: lingkungan alam yang terbentuk sendiri oleh alam, dan lingkungan buatan yang dibuat oleh manusia.$txt$)),
    (gen_random_uuid(), aid, 'HEADING', 4, jsonb_build_object('text', $txt$Lingkungan Alam$txt$)),
    (gen_random_uuid(), aid, 'LIST', 5, jsonb_build_object('text', $txt$Gunung: sumber air dan tanah yang subur untuk bertani. | Sungai dan danau: sumber air minum, tempat ikan hidup, dan sarana transportasi. | Laut: sumber ikan dan garam, serta jalur pelayaran. | Hutan: paru-paru dunia yang menghasilkan udara bersih dan rumah bagi hewan.$txt$)),
    (gen_random_uuid(), aid, 'HEADING', 6, jsonb_build_object('text', $txt$Lingkungan Buatan$txt$)),
    (gen_random_uuid(), aid, 'LIST', 7, jsonb_build_object('text', $txt$Rumah dan sekolah: tempat tinggal dan belajar yang dibangun manusia. | Jalan dan jembatan: dibuat agar orang mudah bepergian. | Sawah dan kebun: lahan yang diolah manusia untuk menanam padi dan sayuran. | Waduk dan saluran air: dibuat untuk menampung dan menyalurkan air.$txt$)),
    (gen_random_uuid(), aid, 'HEADING', 8, jsonb_build_object('text', $txt$Cara Menjaga Lingkungan Sekitar$txt$)),
    (gen_random_uuid(), aid, 'LIST', 9, jsonb_build_object('text', $txt$Buang sampah pada tempatnya dan biasakan memilah sampah. | Menanam pohon dan merawat tanaman di sekitar rumah dan sekolah. | Menghemat air: matikan keran setelah dipakai. | Tidak merusak fasilitas umum seperti bangku taman dan pagar sekolah. | Mengikuti kerja bakti membersihkan lingkungan bersama tetangga.$txt$)),
    (gen_random_uuid(), aid, 'HEADING', 10, jsonb_build_object('text', $txt$Latihan Soal dan Kunci Jawaban$txt$)),
    (gen_random_uuid(), aid, 'LIST', 11, jsonb_build_object('text', $txt$Soal 1: Sebutkan 3 contoh lingkungan alam dan 3 contoh lingkungan buatan! Kunci: Alam — gunung, sungai, hutan (atau laut/danau); Buatan — rumah, jalan, sawah (atau sekolah/jembatan). | Soal 2: Apa perbedaan lingkungan alam dan lingkungan buatan? Kunci: Lingkungan alam terbentuk sendiri oleh alam, sedangkan lingkungan buatan dibuat oleh manusia untuk memenuhi kebutuhannya. | Soal 3: Sebutkan 3 cara menjaga kebersihan lingkungan sekolah! Kunci: membuang sampah pada tempatnya, mengikuti piket kelas, merawat tanaman sekolah (atau tidak mencoret-coret meja dan dinding).$txt$));
  END IF;
END $do$;
