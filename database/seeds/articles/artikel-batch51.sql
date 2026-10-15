-- ============================================================
-- Madevi — Artikel Batch 51 (6 artikel, DRAFT, id)
-- Idempoten: aman dijalankan ulang bila DB di-reset.
-- ============================================================
BEGIN;

-- ------------------------------------------------------------
-- 1) Artikel
-- ------------------------------------------------------------
INSERT INTO madevi.articles
  (id, business_code, taxonomy_node_id, title, slug, summary, language,
   reading_minutes, creator_principal_id, created_by, updated_by, status)
VALUES
  ('e5111111-1111-4111-8111-111111111111', 'TUT-ELEKTRONIK7-001',
   'b4444444-4444-4444-4444-444444444444',
   'Relay: Kendalikan Listrik Besar',
   'relay-kendalikan-listrik-besar',
   'Pelajari cara kerja relay sebagai sakelar elektromagnetik: mengendalikan lampu atau pompa 220V dengan aman memakai sinyal kecil dari mikrokontroler.',
   'id', 8,
   'f7125028-187e-44e0-b95b-88b69b8d5c9a',
   'f7125028-187e-44e0-b95b-88b69b8d5c9a',
   'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT'),
  ('e5122222-2222-4222-8222-222222222222', 'TUT-MASAK12-001',
   'b7777777-7777-7777-7777-777777777777',
   'Tempe Mendoan: Resep Banyumas',
   'tempe-mendoan-resep-banyumas',
   'Resep tempe mendoan khas Banyumas yang tipis, lembut setengah matang, dan gurih dengan bumbu kencur — lengkap dengan tips anti gagal.',
   'id', 6,
   'f7125028-187e-44e0-b95b-88b69b8d5c9a',
   'f7125028-187e-44e0-b95b-88b69b8d5c9a',
   'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT'),
  ('e5133333-3333-4333-8333-333333333333', 'EXP-KIMIA10-001',
   'c4444444-4444-4444-4444-444444444444',
   'Asam Kuat dan Basa Kuat',
   'asam-kuat-dan-basa-kuat',
   'Mengenal asam kuat dan basa kuat: mengapa disebut kuat, contoh dalam kehidupan sehari-hari, cara menghitung pH, dan keselamatan menggunakannya.',
   'id', 7,
   'f7125028-187e-44e0-b95b-88b69b8d5c9a',
   'f7125028-187e-44e0-b95b-88b69b8d5c9a',
   'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT'),
  ('e5144444-4444-4444-8444-444444444444', 'EXP-SEJARAH13-001',
   'c8888888-8888-8888-8888-888888888888',
   'Dekrit Presiden 5 Juli 1959',
   'dekrit-presiden-5-juli-1959',
   'Latar belakang, isi, dan dampak Dekrit Presiden 5 Juli 1959 yang membubarkan Konstituante dan memberlakukan kembali UUD 1945.',
   'id', 7,
   'f7125028-187e-44e0-b95b-88b69b8d5c9a',
   'f7125028-187e-44e0-b95b-88b69b8d5c9a',
   'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT'),
  ('e5155555-5555-4555-8555-555555555555', 'SCH-SMA-GEO4-001',
   'd5555555-5555-5555-5555-555555555555',
   'Geografi Kelas 11: Flora Fauna',
   'geografi-kelas-11-flora-fauna',
   'Materi Geografi kelas 11: persebaran flora dan fauna Indonesia, garis Wallace dan Weber, tiga wilayah fauna, faktor persebaran, dan pelestarian.',
   'id', 10,
   'f7125028-187e-44e0-b95b-88b69b8d5c9a',
   'f7125028-187e-44e0-b95b-88b69b8d5c9a',
   'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT'),
  ('e5166666-6666-4666-8666-666666666666', 'SCH-SD-AGAMA4-001',
   'd9999999-9999-9999-9999-999999999999',
   'Pendidikan Agama Kelas 2: Doa Sehari-hari',
   'pendidikan-agama-kelas-2-doa-sehari-hari',
   'Materi Pendidikan Agama Islam kelas 2 SD: doa sebelum dan sesudah belajar, doa makan, doa bangun tidur dan sebelum tidur beserta artinya.',
   'id', 8,
   'f7125028-187e-44e0-b95b-88b69b8d5c9a',
   'f7125028-187e-44e0-b95b-88b69b8d5c9a',
   'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT')
ON CONFLICT (id) DO NOTHING;

-- ------------------------------------------------------------
-- 2) Hapus block lama agar re-run bersih (idempoten)
-- ------------------------------------------------------------
DELETE FROM madevi.article_blocks WHERE article_id IN
  ('e5111111-1111-4111-8111-111111111111',
   'e5122222-2222-4222-8222-222222222222',
   'e5133333-3333-4333-8333-333333333333',
   'e5144444-4444-4444-8444-444444444444',
   'e5155555-5555-4555-8555-555555555555',
   'e5166666-6666-4666-8666-666666666666');

-- ------------------------------------------------------------
-- 3) Block artikel 1: TUT-ELEKTRONIK7-001 (12 block Tutorial)
-- ------------------------------------------------------------
INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content)
VALUES
  (gen_random_uuid(), 'e5111111-1111-4111-8111-111111111111', 'HEADING', 1,
   jsonb_build_object('text', $$Masalahnya: Mikrokontroler Tidak Kuat Menyalakan Beban Besar$$)),
  (gen_random_uuid(), 'e5111111-1111-4111-8111-111111111111', 'PARAGRAPH', 2,
   jsonb_build_object('text', $$Pin digital Arduino atau ESP32 hanya mampu mengalirkan arus sekitar 20–40 mA pada tegangan 5V atau 3,3V. Sementara lampu rumah, pompa air, atau kipas angin bekerja pada tegangan 220V dengan arus yang jauh lebih besar. Menyambungkan keduanya secara langsung akan membakar mikrokontroler dalam sekejap. Di sinilah relay berperan: ia menjadi jembatan yang aman antara sinyal kecil dan beban besar.$$)),
  (gen_random_uuid(), 'e5111111-1111-4111-8111-111111111111', 'HEADING', 3,
   jsonb_build_object('text', $$Apa Itu Relay?$$)),
  (gen_random_uuid(), 'e5111111-1111-4111-8111-111111111111', 'PARAGRAPH', 4,
   jsonb_build_object('text', $$Relay adalah sakelar yang digerakkan secara elektromagnetik. Di dalamnya ada kumparan kawat (koil) dan kontak logam. Ketika kumparan dialiri arus kecil dari mikrokontroler, ia menjadi magnet dan menarik kontak logam sehingga sirkuit beban yang besar tersambung atau terputus. Kuncinya: sisi kontrol (5V) dan sisi beban (220V) terpisah secara listrik, sehingga mikrokontroler tetap aman. Modul relay yang umum dipakai adalah modul 1 channel 5V dengan tiga terminal beban: COM (common), NO (normally open), dan NC (normally closed).$$)),
  (gen_random_uuid(), 'e5111111-1111-4111-8111-111111111111', 'HEADING', 5,
   jsonb_build_object('text', $$Alat dan Bahan$$)),
  (gen_random_uuid(), 'e5111111-1111-4111-8111-111111111111', 'LIST', 6,
   jsonb_build_object('text', $$• Modul relay 1 channel 5V (ada LED indikator dan optocoupler lebih baik)
• Arduino Uno / ESP32 / mikrokontroler lain
• Kabel jumper male-female
• Beban untuk latihan: lampu LED + baterai (tahap aman) lalu lampu 220V (tahap akhir)
• Kabel listrik, steker, dan fitting lampu
• Obeng kecil dan isolasi listrik / heatshrink$$)),
  (gen_random_uuid(), 'e5111111-1111-4111-8111-111111111111', 'HEADING', 7,
   jsonb_build_object('text', $$Langkah Pemasangan$$)),
  (gen_random_uuid(), 'e5111111-1111-4111-8111-111111111111', 'LIST', 8,
   jsonb_build_object('text', $$1. LATIHAN AMAN DULU: sambungkan VCC relay ke 5V Arduino, GND ke GND, dan pin IN ke pin digital 7. Pasang beban kecil (LED + resistor) di terminal COM dan NO.
2. Tulis program sederhana: digitalWrite(7, HIGH) untuk menyalakan relay (terdengar bunyi "klik"), digitalWrite(7, LOW) untuk mematikan.
3. Amati LED indikator pada modul: menyala saat relay aktif.
4. Setelah paham, ganti beban kecil dengan lampu 220V: putus salah satu kabel lampu, sambungkan kedua ujungnya ke COM dan NO. Kabel satunya tetap langsung ke steker.
5. Pastikan semua sambungan 220V terbungkus isolasi dan modul tidak menyentuh benda logam.
6. Jalankan program kembali: lampu rumah kini dikendalikan dari kode program.$$)),
  (gen_random_uuid(), 'e5111111-1111-4111-8111-111111111111', 'HEADING', 9,
   jsonb_build_object('text', $$Peringatan Keselamatan Listrik — Wajib Dibaca$$)),
  (gen_random_uuid(), 'e5111111-1111-4111-8111-111111111111', 'PARAGRAPH', 10,
   jsonb_build_object('text', $$Listrik 220V DAPAT MEMBUNUH. Jangan pernah merangkai atau menyentuh terminal beban saat kabel tercolok ke stopkontak — cabut dulu, rangkai, periksa dua kali, baru colokkan. Jangan menyentuh modul relay saat sistem menyala. Gunakan kabel yang layak (tidak terkelupas), bungkus sambungan dengan isolasi, dan letakkan modul di kotak pelindung. Pahami perbedaan NO dan NC sebelum memasang: beban di NO berarti mati saat relay tidak aktif (pilihan aman untuk lampu), sedangkan di NC berarti menyala saat relay tidak aktif. Jika ragu sedikit pun, minta bantuan teknisi listrik. Keselamatan selalu lebih penting daripada proyek yang selesai.$$)),
  (gen_random_uuid(), 'e5111111-1111-4111-8111-111111111111', 'HEADING', 11,
   jsonb_build_object('text', $$Memeriksa Hasil$$)),
  (gen_random_uuid(), 'e5111111-1111-4111-8111-111111111111', 'PARAGRAPH', 12,
   jsonb_build_object('text', $$Rangkaian berhasil jika: terdengar bunyi klik setiap kali relay aktif, lampu menyala saat pin diberi HIGH dan padam saat LOW, modul relay tidak panas berlebihan, dan tidak ada bau gosong. Tindak lanjut: coba kendalikan relay otomatis memakai sensor — misalnya lampu menyala sendiri saat ruangan gelap memakai sensor cahaya (LDR), atau pompa menyala saat tanah kering memakai sensor kelembapan.$$))
ON CONFLICT DO NOTHING;

-- ------------------------------------------------------------
-- 4) Block artikel 2: TUT-MASAK12-001 (12 block Tutorial)
-- ------------------------------------------------------------
INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content)
VALUES
  (gen_random_uuid(), 'e5122222-2222-4222-8222-222222222222', 'HEADING', 1,
   jsonb_build_object('text', $$Masalahnya: Mendoan Keras dan Berminyak$$)),
  (gen_random_uuid(), 'e5122222-2222-4222-8222-222222222222', 'PARAGRAPH', 2,
   jsonb_build_object('text', $$Banyak orang menggoreng tempe bertepung lalu menyebutnya mendoan, padahal hasilnya keras seperti kerupuk atau lembek berminyak. Mendoan asli Banyumas — dari kata "mendo" yang berarti setengah matang — harus tipis, lembut, gurih dengan aroma kencur dan daun bawang, digoreng sebentar saja dalam minyak panas yang banyak.$$)),
  (gen_random_uuid(), 'e5122222-2222-4222-8222-222222222222', 'HEADING', 3,
   jsonb_build_object('text', $$Rahasia Mendoan Banyumas$$)),
  (gen_random_uuid(), 'e5122222-2222-4222-8222-222222222222', 'PARAGRAPH', 4,
   jsonb_build_object('text', $$Tiga kunci mendoan autentik: pertama, tempe diiris tipis dan lebar (sekitar 3–4 mm) agar cepat matang. Kedua, adonan tepung dibuat encer dengan bumbu ketumbar, bawang putih, dan kencur — kencur inilah ciri khas aroma mendoan Banyumas. Ketiga, goreng dalam minyak banyak yang benar-benar panas, cukup 1–2 menit per sisi hingga berwarna kuning keemasan pucat, bukan cokelat tua.$$)),
  (gen_random_uuid(), 'e5122222-2222-4222-8222-222222222222', 'HEADING', 5,
   jsonb_build_object('text', $$Bahan-bahan (untuk 10–12 lembar)$$)),
  (gen_random_uuid(), 'e5122222-2222-4222-8222-222222222222', 'LIST', 6,
   jsonb_build_object('text', $$• 1 papan tempe, iris tipis lebar
• 150 gram tepung terigu
• 2 sendok makan tepung beras (agar renyah tipis, tidak keras)
• 4 siung bawang putih
• 1 sendok teh ketumbar butir
• 2 cm kencur
• Sejumput kunyit bubuk (opsional, untuk warna)
• 2 batang daun bawang, iris halus
• Garam secukupnya
• Air secukupnya hingga adonan encer
• Minyak goreng yang banyak$$)),
  (gen_random_uuid(), 'e5122222-2222-4222-8222-222222222222', 'HEADING', 7,
   jsonb_build_object('text', $$Langkah Membuat$$)),
  (gen_random_uuid(), 'e5122222-2222-4222-8222-222222222222', 'LIST', 8,
   jsonb_build_object('text', $$1. Haluskan bawang putih, ketumbar, kencur, dan garam.
2. Campur tepung terigu, tepung beras, bumbu halus, dan daun bawang. Tuangi air sedikit demi sedikit sambil diaduk hingga adonan encer melapisi sendok tipis-tipis.
3. Panaskan minyak yang banyak dengan api sedang-besar hingga benar-benar panas (tes: tetesan adonan langsung mengapung dan berdesis).
4. Celupkan irisan tempe ke adonan, pastikan terlapisi tipis dan rata.
5. Goreng 1–2 menit per sisi. Angkat saat berwarna kuning keemasan pucat — jangan menunggu cokelat.
6. Tiriskan di atas tisu atau saringan kawat agar minyak berlebih turun.$$)),
  (gen_random_uuid(), 'e5122222-2222-4222-8222-222222222222', 'HEADING', 9,
   jsonb_build_object('text', $$Risiko dan Kesalahan Umum$$)),
  (gen_random_uuid(), 'e5122222-2222-4222-8222-222222222222', 'PARAGRAPH', 10,
   jsonb_build_object('text', $$Minyak kurang panas adalah kesalahan paling umum: tempe menyerap minyak dan hasilnya lembek berminyak. Adonan terlalu kental membuat lapisan tebal dan keras seperti tempe goreng biasa. Menggoreng terlalu lama menghilangkan ciri "mendo" — hasilnya jadi kering. Irisan tempe terlalu tebal membuat bagian dalam mentah tepung. Hati-hati juga saat menggoreng: minyak panas bisa memercik, jadi masukkan tempe perlahan dari sisi wajan menjauhi tubuh.$$)),
  (gen_random_uuid(), 'e5122222-2222-4222-8222-222222222222', 'HEADING', 11,
   jsonb_build_object('text', $$Memeriksa Hasil$$)),
  (gen_random_uuid(), 'e5122222-2222-4222-8222-222222222222', 'PARAGRAPH', 12,
   jsonb_build_object('text', $$Mendoan berhasil jika warnanya kuning keemasan pucat, teksturnya lembut (tidak keras saat digigit), aroma kencur terasa, dan tidak berminyak berlebihan di tangan. Sajikan selagi hangat dengan cabai rawit hijau atau sambal kecap. Tindak lanjut: variasikan dengan isian — misalnya mendoan isi keju atau mendoan dengan tambahan irisan cabai dalam adonan untuk versi pedas.$$))
ON CONFLICT DO NOTHING;

-- ------------------------------------------------------------
-- 5) Block artikel 3: EXP-KIMIA10-001 (10 block edukatif)
-- ------------------------------------------------------------
INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content)
VALUES
  (gen_random_uuid(), 'e5133333-3333-4333-8333-333333333333', 'HEADING', 1,
   jsonb_build_object('text', $$Apa Itu Asam Kuat dan Basa Kuat?$$)),
  (gen_random_uuid(), 'e5133333-3333-4333-8333-333333333333', 'PARAGRAPH', 2,
   jsonb_build_object('text', $$Asam kuat adalah asam yang terionisasi sempurna (100%) dalam air, melepaskan seluruh ion H+ miliknya. Contohnya asam klorida (HCl), asam sulfat (H2SO4), dan asam nitrat (HNO3). Basa kuat pun demikian: natrium hidroksida (NaOH), kalium hidroksida (KOH), dan kalsium hidroksida (Ca(OH)2) melepaskan seluruh ion OH- dalam air. Lawan mereka adalah asam dan basa lemah — seperti asam cuka atau amonia — yang hanya terionisasi sebagian.$$)),
  (gen_random_uuid(), 'e5133333-3333-4333-8333-333333333333', 'HEADING', 3,
   jsonb_build_object('text', $$Mengapa Disebut "Kuat"?$$)),
  (gen_random_uuid(), 'e5133333-3333-4333-8333-333333333333', 'PARAGRAPH', 4,
   jsonb_build_object('text', $$Kata "kuat" di sini tidak berarti pekat atau berbahaya, melainkan merujuk pada derajat ionisasi. Asam kuat 0,01 M justru lebih encer daripada asam lemah 5 M, tetapi ia melepaskan 100% ion H+ miliknya. Reaksi ionisasinya berjalan satu arah dan tidak bisa balik — itulah yang membuatnya "kuat" secara kimia.$$)),
  (gen_random_uuid(), 'e5133333-3333-4333-8333-333333333333', 'HEADING', 5,
   jsonb_build_object('text', $$Contoh dalam Kehidupan Sehari-hari$$)),
  (gen_random_uuid(), 'e5133333-3333-4333-8333-333333333333', 'LIST', 6,
   jsonb_build_object('text', $$• Asam lambung: HCl encer yang membantu mencerna makanan
• Aki kendaraan: larutan H2SO4 sebagai elektrolit
• Pembersih saluran air mampet: NaOH yang melarutkan lemak dan rambut
• Kapur tohor: Ca(OH)2 untuk bahan bangunan dan pengapuran tanah pertanian$$)),
  (gen_random_uuid(), 'e5133333-3333-4333-8333-333333333333', 'HEADING', 7,
   jsonb_build_object('text', $$Menghitung pH Asam Kuat dan Basa Kuat$$)),
  (gen_random_uuid(), 'e5133333-3333-4333-8333-333333333333', 'PARAGRAPH', 8,
   jsonb_build_object('text', $$Karena terionisasi sempurna, pH-nya mudah dihitung dengan rumus pH = -log[H+]. Larutan HCl 0,1 M menghasilkan [H+] = 0,1 M, sehingga pH-nya = 1. Untuk basa kuat, hitung dulu pOH = -log[OH-], lalu pH = 14 - pOH. Larutan NaOH 0,1 M memiliki pOH = 1, sehingga pH-nya = 13. Perhatikan: H2SO4 melepaskan 2 ion H+ per molekul, jadi perhitungannya disesuaikan.$$)),
  (gen_random_uuid(), 'e5133333-3333-4333-8333-333333333333', 'HEADING', 9,
   jsonb_build_object('text', $$Bahaya dan Keselamatan$$)),
  (gen_random_uuid(), 'e5133333-3333-4333-8333-333333333333', 'PARAGRAPH', 10,
   jsonb_build_object('text', $$Asam kuat dan basa kuat bersifat korosif: dapat melukai kulit, mata, dan merusak pakaian. Aturan emas laboratorium: selalu tuangkan ASAM ke dalam AIR (bukan sebaliknya) agar panas pelarutan tidak memercikkan asam pekat. Gunakan sarung tangan dan kacamata pelindung. Jangan pernah mencampur pemutih (mengandung basa) dengan pembersih toilet yang mengandung asam — campurannya menghasilkan gas klorin yang beracun. Jika terkena kulit, bilas dengan air mengalir yang banyak dan cari bantuan medis.$$))
ON CONFLICT DO NOTHING;

-- ------------------------------------------------------------
-- 6) Block artikel 4: EXP-SEJARAH13-001 (10 block edukatif)
-- ------------------------------------------------------------
INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content)
VALUES
  (gen_random_uuid(), 'e5144444-4444-4444-8444-444444444444', 'HEADING', 1,
   jsonb_build_object('text', $$Indonesia di Ujung Tanduk$$)),
  (gen_random_uuid(), 'e5144444-4444-4444-8444-444444444444', 'PARAGRAPH', 2,
   jsonb_build_object('text', $$Akhir tahun 1950-an, Indonesia berada dalam krisis berlapis. Konstituante — badan yang dipilih rakyat pada pemilu 1955 untuk menyusun undang-undang dasar baru — gagal mencapai kesepakatan setelah bersidang lebih dari dua tahun. Di daerah, meletus pemberontakan PRRI di Sumatra dan Permesta di Sulawesi. Ekonomi memburuk, kabinet silih berganti, dan stabilitas politik nyaris runtuh.$$)),
  (gen_random_uuid(), 'e5144444-4444-4444-8444-444444444444', 'HEADING', 3,
   jsonb_build_object('text', $$Apa Isi Dekrit 5 Juli 1959?$$)),
  (gen_random_uuid(), 'e5144444-4444-4444-8444-444444444444', 'PARAGRAPH', 4,
   jsonb_build_object('text', $$Pada 5 Juli 1959, Presiden Soekarno membacakan dekrit di Istana Merdeka, Jakarta. Dekrit ini berisi tiga hal: pertama, membubarkan Konstituante; kedua, memberlakukan kembali UUD 1945 dan tidak berlakunya lagi UUDS 1950; ketiga, membentuk MPRS (Majelis Permusyawaratan Rakyat Sementara) dan DPAS (Dewan Pertimbangan Agung Sementara) dalam waktu sesingkat-singkatnya.$$)),
  (gen_random_uuid(), 'e5144444-4444-4444-8444-444444444444', 'HEADING', 5,
   jsonb_build_object('text', $$Mengapa Soekarno Mengeluarkan Dekrit?$$)),
  (gen_random_uuid(), 'e5144444-4444-4444-8444-444444444444', 'LIST', 6,
   jsonb_build_object('text', $$• Konstituante mengalami kebuntuan (deadlock): pemungutan suara tidak pernah mencapai dua pertiga suara yang disyaratkan
• Ancaman disintegrasi bangsa akibat pemberontakan daerah yang meluas
• Dukungan Angkatan Darat, termasuk dari KSAD Jenderal A.H. Nasution
• Keyakinan Soekarno bahwa kembali ke UUD 1945 adalah jalan keluar dari krisis$$)),
  (gen_random_uuid(), 'e5144444-4444-4444-8444-444444444444', 'HEADING', 7,
   jsonb_build_object('text', $$Dampak Dekrit$$)),
  (gen_random_uuid(), 'e5144444-4444-4444-8444-444444444444', 'PARAGRAPH', 8,
   jsonb_build_object('text', $$Dekrit 5 Juli 1959 menandai berakhirnya era Demokrasi Liberal dan dimulainya era Demokrasi Terpimpin. Kekuasaan presiden menjadi sangat besar karena UUD 1945 memberi peran sentral kepada presiden. Pada 1963, MPRS bahkan mengangkat Soekarno sebagai presiden seumur hidup. Di sisi lain, stabilitas politik jangka pendek berhasil dipulihkan dan pemberontakan daerah dapat ditumpas.$$)),
  (gen_random_uuid(), 'e5144444-4444-4444-8444-444444444444', 'HEADING', 9,
   jsonb_build_object('text', $$Makna bagi Indonesia Kini$$)),
  (gen_random_uuid(), 'e5144444-4444-4444-8444-444444444444', 'PARAGRAPH', 10,
   jsonb_build_object('text', $$UUD 1945 yang berlaku hingga hari ini — termasuk setelah empat kali amandemen pada 1999–2002 — adalah konstitusi yang diberlakukan kembali lewat dekrit ini. Peristiwa 5 Juli 1959 menjadi pelajaran berharga: kebuntuan politik yang berlarut-larut dapat membuka jalan bagi pemusatan kekuasaan. Karena itu, mekanisme demokrasi yang sehat dan kemampuan berkompromi antar-kekuatan politik adalah benteng agar sejarah tidak berulang.$$))
ON CONFLICT DO NOTHING;

-- ------------------------------------------------------------
-- 7) Block artikel 5: SCH-SMA-GEO4-001 (12 block sekolah)
-- ------------------------------------------------------------
INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content)
VALUES
  (gen_random_uuid(), 'e5155555-5555-4555-8555-555555555555', 'HEADING', 1,
   jsonb_build_object('text', $$Tujuan Pembelajaran$$)),
  (gen_random_uuid(), 'e5155555-5555-4555-8555-555555555555', 'PARAGRAPH', 2,
   jsonb_build_object('text', $$Setelah mempelajari bab ini, peserta didik diharapkan mampu: (1) menjelaskan persebaran flora dan fauna di Indonesia, (2) menganalisis garis Wallace dan garis Weber, (3) mengidentifikasi tiga wilayah fauna Indonesia beserta contohnya, (4) menjelaskan faktor-faktor yang memengaruhi persebaran flora fauna, dan (5) mengusulkan upaya pelestarian keanekaragaman hayati.$$)),
  (gen_random_uuid(), 'e5155555-5555-4555-8555-555555555555', 'HEADING', 3,
   jsonb_build_object('text', $$Keanekaragaman Flora dan Fauna Indonesia$$)),
  (gen_random_uuid(), 'e5155555-5555-4555-8555-555555555555', 'PARAGRAPH', 4,
   jsonb_build_object('text', $$Indonesia termasuk negara megabiodiversitas: sekitar 10 persen spesies tumbuhan dan hewan dunia hidup di sini. Flora khas antara lain rafflesia arnoldii (bunga terbesar di dunia), ratusan jenis anggrek, dan pohon meranti. Fauna khas antara lain komodo, orangutan, anoa, dan burung cendrawasih. Keunikan ini terjadi karena posisi Indonesia di antara dua benua dan dua samudra, serta sejarah geologinya yang kompleks.$$)),
  (gen_random_uuid(), 'e5155555-5555-4555-8555-555555555555', 'HEADING', 5,
   jsonb_build_object('text', $$Garis Wallace dan Garis Weber$$)),
  (gen_random_uuid(), 'e5155555-5555-4555-8555-555555555555', 'PARAGRAPH', 6,
   jsonb_build_object('text', $$Alfred Russel Wallace menemukan bahwa fauna di barat Indonesia (Sumatra, Jawa, Kalimantan) mirip fauna Asia, sedangkan di timur (Papua) mirip fauna Australia. Batasnya — garis Wallace — membentang di antara Kalimantan/Sulawesi dan antara Bali/Lombok. Max Weber kemudian menarik garis kedua lebih ke timur (garis Weber) yang dianggap batas paling tepat antara fauna Asiatis dan Australis. Wilayah di antara kedua garis disebut zona peralihan atau zona Wallacea, meliputi Sulawesi, Nusa Tenggara, dan Maluku.$$)),
  (gen_random_uuid(), 'e5155555-5555-4555-8555-555555555555', 'HEADING', 7,
   jsonb_build_object('text', $$Tiga Wilayah Fauna Indonesia$$)),
  (gen_random_uuid(), 'e5155555-5555-4555-8555-555555555555', 'LIST', 8,
   jsonb_build_object('text', $$• Fauna Asiatis (barat): gajah, harimau, orangutan, badak bercula satu, bekantan — berbulu tebal, menyusui
• Fauna peralihan (tengah): anoa, komodo, babi rusa, burung maleo — campuran ciri Asia dan Australia
• Fauna Australis (timur): kanguru pohon, cendrawasih, kasuari, kuskus — berkantung, berbulu jarang$$)),
  (gen_random_uuid(), 'e5155555-5555-4555-8555-555555555555', 'HEADING', 9,
   jsonb_build_object('text', $$Faktor yang Memengaruhi Persebaran$$)),
  (gen_random_uuid(), 'e5155555-5555-4555-8555-555555555555', 'LIST', 10,
   jsonb_build_object('text', $$• Iklim: curah hujan dan suhu menentukan jenis tumbuhan yang tumbuh, lalu memengaruhi hewan yang hidup di sana
• Relief dan tanah: dataran rendah, pegunungan, dan jenis tanah menciptakan habitat berbeda
• Adaptasi: makhluk hidup menyesuaikan diri dengan lingkungannya selama ribuan tahun
• Sejarah geologi: Paparan Sunda (barat) pernah menyatu dengan Asia, Paparan Sahul (timur) pernah menyatu dengan Australia$$)),
  (gen_random_uuid(), 'e5155555-5555-4555-8555-555555555555', 'HEADING', 11,
   jsonb_build_object('text', $$Latihan Soal$$)),
  (gen_random_uuid(), 'e5155555-5555-4555-8555-555555555555', 'PARAGRAPH', 12,
   jsonb_build_object('text', $$1. Jelaskan perbedaan fauna Asiatis dan fauna Australis beserta masing-masing dua contohnya! Kunci: Asiatis di barat (gajah, harimau/orangutan), Australis di timur (kanguru pohon, cendrawasih/kasuari); Asiatis umumnya mamalia besar menyusui, Australis banyak berkantung. 2. Di wilayah manakah komodo hidup dan mengapa ia termasuk fauna peralihan? Kunci: Nusa Tenggara (zona Wallacea); komodo memiliki ciri campuran dan endemik di zona peralihan. 3. Sebutkan dua upaya pelestarian flora fauna yang dapat dilakukan pelajar! Kunci: tidak membeli produk dari satwa dilindungi, ikut kampanye konservasi, menanam pohon, melaporkan perburuan liar.$$))
ON CONFLICT DO NOTHING;

-- ------------------------------------------------------------
-- 8) Block artikel 6: SCH-SD-AGAMA4-001 (12 block sekolah)
-- ------------------------------------------------------------
INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content)
VALUES
  (gen_random_uuid(), 'e5166666-6666-4666-8666-666666666666', 'HEADING', 1,
   jsonb_build_object('text', $$Tujuan Pembelajaran$$)),
  (gen_random_uuid(), 'e5166666-6666-4666-8666-666666666666', 'PARAGRAPH', 2,
   jsonb_build_object('text', $$Setelah mempelajari bab ini, siswa diharapkan mampu: (1) melafalkan doa sehari-hari dengan benar, (2) memahami arti doa sehari-hari, dan (3) membiasakan berdoa sebelum dan sesudah melakukan kegiatan dalam kehidupan sehari-hari.$$)),
  (gen_random_uuid(), 'e5166666-6666-4666-8666-666666666666', 'HEADING', 3,
   jsonb_build_object('text', $$Mengapa Kita Berdoa?$$)),
  (gen_random_uuid(), 'e5166666-6666-4666-8666-666666666666', 'PARAGRAPH', 4,
   jsonb_build_object('text', $$Doa artinya memohon kepada Allah SWT. Kita berdoa sebagai tanda syukur atas nikmat-Nya dan karena kita membutuhkan pertolongan-Nya dalam setiap kegiatan. Orang yang rajin berdoa hatinya menjadi tenang dan kegiatannya diberkahi. Berdoa dilakukan dengan khusyuk, mengangkat kedua tangan, dan diawali dengan basmalah.$$)),
  (gen_random_uuid(), 'e5166666-6666-4666-8666-666666666666', 'HEADING', 5,
   jsonb_build_object('text', $$Doa Sebelum dan Sesudah Belajar$$)),
  (gen_random_uuid(), 'e5166666-6666-4666-8666-666666666666', 'LIST', 6,
   jsonb_build_object('text', $$• Doa sebelum belajar: "Robbisrohlii shodrii wa yassirlii amrii wahlul 'uqdatam mil lisaanii yafqohuu qoulii." Artinya: "Ya Tuhanku, lapangkanlah dadaku, mudahkanlah urusanku, dan lepaskanlah kekakuan dari lidahku agar mereka mengerti perkataanku."
• Doa sesudah belajar: "Allahumma innii istaudi'uka maa 'allamtaniihi fardudhu ilayya 'inda haajatii ilaihi wa laa tansaniihi yaa robbal 'aalamiin." Artinya: "Ya Allah, sesungguhnya aku menitipkan kepada-Mu apa yang telah Engkau ajarkan kepadaku, maka kembalikanlah ia kepadaku saat aku membutuhkannya, dan janganlah Engkau membuatku melupakannya, wahai Tuhan semesta alam."$$)),
  (gen_random_uuid(), 'e5166666-6666-4666-8666-666666666666', 'HEADING', 7,
   jsonb_build_object('text', $$Doa Sebelum dan Sesudah Makan$$)),
  (gen_random_uuid(), 'e5166666-6666-4666-8666-666666666666', 'LIST', 8,
   jsonb_build_object('text', $$• Doa sebelum makan: "Allahumma baarik lanaa fiimaa rozaqtanaa wa qinaa 'adzaaban naar." Artinya: "Ya Allah, berkahilah rezeki yang Engkau berikan kepada kami dan peliharalah kami dari siksa api neraka."
• Doa sesudah makan: "Alhamdulillaahil ladzii ath'amanaa wa saqoonaa wa ja'alanaa minal muslimiin." Artinya: "Segala puji bagi Allah yang telah memberi kami makan dan minum serta menjadikan kami termasuk orang-orang Islam."$$)),
  (gen_random_uuid(), 'e5166666-6666-4666-8666-666666666666', 'HEADING', 9,
   jsonb_build_object('text', $$Doa Bangun Tidur dan Sebelum Tidur$$)),
  (gen_random_uuid(), 'e5166666-6666-4666-8666-666666666666', 'LIST', 10,
   jsonb_build_object('text', $$• Doa bangun tidur: "Alhamdulillaahil ladzii ahyaanaa ba'da maa amaatanaa wa ilaihin nusyuur." Artinya: "Segala puji bagi Allah yang telah menghidupkan kami setelah mematikan kami, dan kepada-Nya kami kembali."
• Doa sebelum tidur: "Bismika Allahumma ahyaa wa amuut." Artinya: "Dengan nama-Mu ya Allah, aku hidup dan aku mati."$$)),
  (gen_random_uuid(), 'e5166666-6666-4666-8666-666666666666', 'HEADING', 11,
   jsonb_build_object('text', $$Latihan$$)),
  (gen_random_uuid(), 'e5166666-6666-4666-8666-666666666666', 'PARAGRAPH', 12,
   jsonb_build_object('text', $$1. Tuliskan doa sebelum makan beserta artinya! Kunci: "Allahumma baarik lanaa fiimaa rozaqtanaa wa qinaa 'adzaaban naar" — "Ya Allah, berkahilah rezeki yang Engkau berikan kepada kami dan peliharalah kami dari siksa api neraka." 2. Kapan kita membaca doa "Bismika Allahumma ahyaa wa amuut"? Kunci: sebelum tidur. 3. Sebutkan dua manfaat membiasakan berdoa setiap hari! Kunci: hati menjadi tenang; kegiatan diberkahi Allah; melatih rasa syukur (pilih dua).$$))
ON CONFLICT DO NOTHING;

COMMIT;
