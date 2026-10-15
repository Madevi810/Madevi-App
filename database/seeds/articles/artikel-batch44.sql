-- Batch 44: 6 artikel (DRAFT, id) — idempoten, aman dijalankan ulang
-- Owner: f7125028-187e-44e0-b95b-88b69b8d5c9a
BEGIN;

-- ============ 1. TUT-KESEHATAN8-001 — Flu: Perawatan di Rumah ============
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, status, created_by, updated_by)
VALUES (gen_random_uuid(), 'TUT-KESEHATAN8-001', 'b5555555-5555-5555-5555-555555555555',
  'Flu: Perawatan di Rumah', 'flu-perawatan-di-rumah',
  'Panduan merawat flu di rumah: memahami gejala, persiapan obat dan alat, langkah perawatan, serta tanda bahaya yang mengharuskan ke dokter.',
  'id', 'DRAFT', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;

DELETE FROM madevi.article_blocks WHERE article_id IN (SELECT id FROM madevi.articles WHERE business_code='TUT-KESEHATAN8-001');

INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content)
SELECT gen_random_uuid(), a.id, v.block_type, v.position, v.content
FROM madevi.articles a
CROSS JOIN (VALUES
  ('HEADING', 0, jsonb_build_object('text', $$Flu: Perawatan di Rumah yang Tepat$$)),
  ('PARAGRAPH', 1, jsonb_build_object('text', $$Flu menyerang tiba-tiba: demam menggigil di malam hari, pilek dan batuk di pagi hari, badan pegal semua, kepala berat. Aktivitas lumpuh total, pekerjaan tertunda, anak tidak bisa sekolah. Kabar baiknya, sebagian besar flu bisa dirawat di rumah dengan langkah yang benar — asal tahu kapan harus waspada.$$)),
  ('HEADING', 2, jsonb_build_object('text', $$Memahami Flu: Penyebab dan Gejalanya$$)),
  ('PARAGRAPH', 3, jsonb_build_object('text', $$Flu disebabkan virus influenza yang menular lewat percikan batuk dan bersin (droplet) serta sentuhan benda terkontaminasi. Berbeda dengan pilek biasa, flu datang mendadak dengan demam 38–40 derajat Celsius, nyeri otot, sakit kepala, dan rasa lemas yang berat. Gejala biasanya memuncak dalam 2–3 hari dan membaik dalam 5–7 hari.$$)),
  ('HEADING', 4, jsonb_build_object('text', $$Persiapan: Obat dan Alat di Rumah$$)),
  ('LIST', 5, jsonb_build_object('items', ARRAY['Termometer untuk memantau suhu tubuh','Obat penurun demam yang mengandung paracetamol (baca aturan pakai)','Air putih, oralit, atau sup hangat dalam jumlah cukup','Masker dan tisu untuk menutup batuk/bersin','Pelembap udara atau baskom air hangat untuk melegakan hidung','Pakaian ganti dan selimut bersih'])),
  ('HEADING', 6, jsonb_build_object('text', $$Langkah Perawatan di Rumah$$)),
  ('LIST', 7, jsonb_build_object('items', ARRAY['Istirahat total: jangan memaksakan bekerja atau beraktivitas berat','Minum banyak cairan — air putih, sup, atau oralit — untuk mencegah dehidrasi','Minum paracetamol sesuai dosis pada kemasan bila demam di atas 38,5 derajat','Kompres hangat di dahi dan ketiak untuk membantu menurunkan demam','Tutup mulut dan hidung saat batuk/bersin, buang tisu ke tempat sampah tertutup','Pisahkan diri dari anggota keluarga lain, terutama bayi dan lansia','Makan makanan bergizi walau nafsu makan menurun'])),
  ('HEADING', 8, jsonb_build_object('text', $$Risiko dan Kesalahan Umum$$)),
  ('PARAGRAPH', 9, jsonb_build_object('text', $$Kesalahan paling umum: minum antibiotik untuk flu. Antibiotik hanya membunuh bakteri, tidak mempan melawan virus, dan pemakaian sembarangan justru menimbulkan resistensi. Risiko lain adalah overdosis paracetamol karena minum beberapa merek obat flu sekaligus tanpa sadar kandungannya sama — selalu baca komposisi. Pada kelompok rentan (lansia, ibu hamil, penderita penyakit kronis), flu bisa berkembang menjadi pneumonia.$$)),
  ('HEADING', 10, jsonb_build_object('text', $$Kapan Harus ke Dokter$$)),
  ('PARAGRAPH', 11, jsonb_build_object('text', $$Segera konsultasi ke dokter atau fasilitas kesehatan bila: sesak napas atau nyeri dada, demam tidak turun setelah 3 hari, muntah terus hingga dehidrasi, atau gejala membaik lalu memburuk kembali. Bayi, lansia, ibu hamil, dan penderita penyakit kronis sebaiknya tidak menunda pemeriksaan. Artikel ini bersifat informasi umum dan bukan pengganti nasihat medis profesional.$$))
) AS v(block_type, position, content)
WHERE a.business_code = 'TUT-KESEHATAN8-001';

-- ============ 2. TUT-MASAK9-001 — Ayam Bakar Kecap: Resep Empuk ============
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, status, created_by, updated_by)
VALUES (gen_random_uuid(), 'TUT-MASAK9-001', 'b7777777-7777-7777-7777-777777777777',
  'Ayam Bakar Kecap: Resep Empuk', 'ayam-bakar-kecap-resep-empuk',
  'Resep ayam bakar kecap yang empuk dan bumbunya meresap: teknik ungkep, racikan bumbu, cara membakar agar karamel sempurna tanpa gosong.',
  'id', 'DRAFT', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;

DELETE FROM madevi.article_blocks WHERE article_id IN (SELECT id FROM madevi.articles WHERE business_code='TUT-MASAK9-001');

INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content)
SELECT gen_random_uuid(), a.id, v.block_type, v.position, v.content
FROM madevi.articles a
CROSS JOIN (VALUES
  ('HEADING', 0, jsonb_build_object('text', $$Ayam Bakar Kecap: Resep Empuk dan Bumbu Meresap$$)),
  ('PARAGRAPH', 1, jsonb_build_object('text', $$Masalah klasik ayam bakar rumahan: gosong di luar tapi mentah di dalam, daging kering dan alot, bumbu hanya menempel di permukaan. Padahal rahasia ayam bakar seenak warung kaki lima sederhana saja: ungkep dulu sampai empuk, baru dibakar sebentar untuk aroma. Ikuti resep ini dan ayam bakarmu dijamin empuk sampai ke tulang.$$)),
  ('HEADING', 2, jsonb_build_object('text', $$Rahasia Ayam Bakar yang Empuk$$)),
  ('PARAGRAPH', 3, jsonb_build_object('text', $$Kunci utamanya adalah dua tahap: ungkep lalu bakar. Mengungkep (merebus dengan bumbu hingga air menyusut) membuat bumbu meresap ke dalam serat daging sekaligus mengempukkan ayam. Pembakaran kemudian hanya butuh 10–15 menit dengan api sedang — cukup untuk membentuk lapisan karamel kecap yang harum, bukan untuk mematangkan daging. Tusuk-tusuk daging dengan garpu sebelum diungkep agar bumbu lebih cepat masuk.$$)),
  ('HEADING', 4, jsonb_build_object('text', $$Bahan dan Bumbu$$)),
  ('LIST', 5, jsonb_build_object('items', ARRAY['1 ekor ayam (±1 kg), potong 8 bagian','Kecap manis 150 ml','Bawang merah 8 siung','Bawang putih 5 siung','Kemiri 4 butir, sangrai','Ketumbar 1 sendok teh','Kunyit 2 cm','Jahe 2 cm','Lengkuas 3 cm, memarkan','Daun salam 3 lembar','Serai 2 batang, memarkan','Gula merah 2 sendok makan, serut','Garam 1 sendok teh','Air 500 ml','Minyak goreng 3 sendok makan'])),
  ('HEADING', 6, jsonb_build_object('text', $$Langkah Memasak$$)),
  ('LIST', 7, jsonb_build_object('items', ARRAY['Haluskan bawang merah, bawang putih, kemiri, ketumbar, kunyit, dan jahe','Panaskan minyak, tumis bumbu halus bersama lengkuas, daun salam, dan serai hingga harum dan matang','Masukkan potongan ayam, aduk hingga berubah warna','Tuang air, kecap manis, gula merah, dan garam; aduk rata','Ungkep dengan api kecil 30–40 menit hingga air menyusut dan bumbu meresap; sisakan sedikit bumbu ungkep untuk olesan','Panaskan panggangan/teflon dengan api sedang','Bakar ayam sambil dioles sisa bumbu ungkep yang dicampur sedikit kecap, bolak-balik hingga kedua sisi berkaramel (±10–15 menit)','Angkat dan sajikan selagi hangat'])),
  ('HEADING', 8, jsonb_build_object('text', $$Risiko dan Kesalahan Umum$$)),
  ('PARAGRAPH', 9, jsonb_build_object('text', $$Kesalahan paling fatal: api terlalu besar. Kecap mengandung gula yang cepat gosong — api besar membuat permukaan hitam pahit sementara bagian dalam belum matang. Kesalahan kedua: terlalu sering membolak-balik ayam hingga lapisan bumbu rontok; cukup 2–3 kali balik. Ketiga: melewatkan tahap ungkep dan langsung membakar ayam mentah — hasilnya alot dan bumbu tidak meresap.$$)),
  ('HEADING', 10, jsonb_build_object('text', $$Penyajian dan Variasi$$)),
  ('PARAGRAPH', 11, jsonb_build_object('text', $$Sajikan ayam bakar dengan nasi hangat, lalapan segar, dan sambal terasi. Untuk variasi pedas, tambahkan 5–10 cabai rawit ke dalam bumbu halus. Versi madu: ganti separuh kecap dengan madu pada olesan bakaran untuk aroma yang lebih wangi. Sisa bumbu ungkep jangan dibuang — bisa dipakai sebagai olesan atau disiramkan ke nasi. Selamat mencoba!$$))
) AS v(block_type, position, content)
WHERE a.business_code = 'TUT-MASAK9-001';

-- ============ 3. EXP-BIOLOGI7-001 — Sel: Unit Terkecil Kehidupan ============
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, status, created_by, updated_by)
VALUES (gen_random_uuid(), 'EXP-BIOLOGI7-001', 'c2222222-2222-2222-2222-222222222222',
  'Sel: Unit Terkecil Kehidupan', 'sel-unit-terkecil-kehidupan',
  'Mengenal sel sebagai unit terkecil penyusun makhluk hidup: jenis sel, organel-organel penting, dan cara sel bekerja sama membentuk tubuh.',
  'id', 'DRAFT', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;

DELETE FROM madevi.article_blocks WHERE article_id IN (SELECT id FROM madevi.articles WHERE business_code='EXP-BIOLOGI7-001');

INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content)
SELECT gen_random_uuid(), a.id, v.block_type, v.position, v.content
FROM madevi.articles a
CROSS JOIN (VALUES
  ('HEADING', 0, jsonb_build_object('text', $$Sel: Unit Terkecil Kehidupan$$)),
  ('PARAGRAPH', 1, jsonb_build_object('text', $$Setiap makhluk hidup — dari bakteri mikroskopis hingga paus biru raksasa — tersusun dari unit terkecil bernama sel. Tubuh manusia dewasa tersusun dari sekitar 30 triliun sel. Konsep ini lahir pada tahun 1665 ketika Robert Hooke mengamati irisan gabus dengan mikroskop dan melihat ruang-ruang kecil yang ia sebut cellula (ruang kecil). Teori sel kemudian dirumuskan: semua makhluk hidup tersusun dari sel, sel adalah unit terkecil kehidupan, dan semua sel berasal dari sel sebelumnya.$$)),
  ('HEADING', 2, jsonb_build_object('text', $$Dua Jenis Sel: Prokariotik dan Eukariotik$$)),
  ('PARAGRAPH', 3, jsonb_build_object('text', $$Sel prokariotik dimiliki bakteri: sederhana, tanpa membran inti, materi genetiknya mengambang bebas di sitoplasma. Sel eukariotik dimiliki tumbuhan, hewan, jamur, dan protista: jauh lebih kompleks, materi genetiknya tersimpan rapi di dalam nukleus (inti sel) dan memiliki organel-organel khusus dengan tugas masing-masing.$$)),
  ('HEADING', 4, jsonb_build_object('text', $$Organel-organel Penting$$)),
  ('LIST', 5, jsonb_build_object('items', ARRAY['Membran sel: pembungkus selektif yang mengatur keluar-masuk zat','Sitoplasma: cairan tempat berlangsungnya reaksi kimia sel','Nukleus: pusat kendali berisi DNA, pembawa informasi genetik','Mitokondria: pembangkit energi (ATP), dapur tenaga sel','Kloroplas: tempat fotosintesis, hanya ada pada sel tumbuhan','Ribosom: pabrik pembuat protein','Dinding sel: pelindung kaku pada sel tumbuhan','Vakuola: kantong penyimpan air dan cadangan makanan'])),
  ('HEADING', 6, jsonb_build_object('text', $$Bagaimana Sel Bekerja Sama$$)),
  ('PARAGRAPH', 7, jsonb_build_object('text', $$Pada organisme multiseluler, sel tidak bekerja sendirian. Sel-sel sejenis berkelompok menjadi jaringan, jaringan membentuk organ, organ bekerja sama dalam sistem organ, dan seluruh sistem membentuk organisme. Contohnya: jutaan sel otot jantung berkontraksi serentak memompa darah, sementara sel saraf menghantarkan perintah dalam sepersekian detik. Koordinasi inilah yang membuat tubuh berfungsi sebagai satu kesatuan.$$)),
  ('HEADING', 8, jsonb_build_object('text', $$Pembelahan Sel: Cara Tubuh Tumbuh$$)),
  ('PARAGRAPH', 9, jsonb_build_object('text', $$Tubuh tumbuh dan luka sembuh berkat pembelahan sel. Melalui mitosis, satu sel membelah menjadi dua sel anak yang identik secara genetik — inilah cara kulit yang terkelupas diganti dan anak bertambah tinggi. Sementara itu meiosis menghasilkan sel kelamin (sperma dan sel telur) dengan separuh jumlah kromosom, memungkinkan pewarisan sifat dari orang tua ke anak dengan kombinasi yang selalu baru.$$))
) AS v(block_type, position, content)
WHERE a.business_code = 'EXP-BIOLOGI7-001';

-- ============ 4. EXP-SEJARAH10-001 — Agresi Militer Belanda I dan II ============
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, status, created_by, updated_by)
VALUES (gen_random_uuid(), 'EXP-SEJARAH10-001', 'c8888888-8888-8888-8888-888888888888',
  'Agresi Militer Belanda I dan II', 'agresi-militer-belanda-i-dan-ii',
  'Kisah dua agresi militer Belanda pasca proklamasi 1945: Operatie Product, Operatie Kraai, perlawanan PDRI, hingga pengakuan kedaulatan lewat KMB.',
  'id', 'DRAFT', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;

DELETE FROM madevi.article_blocks WHERE article_id IN (SELECT id FROM madevi.articles WHERE business_code='EXP-SEJARAH10-001');

INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content)
SELECT gen_random_uuid(), a.id, v.block_type, v.position, v.content
FROM madevi.articles a
CROSS JOIN (VALUES
  ('HEADING', 0, jsonb_build_object('text', $$Agresi Militer Belanda I dan II$$)),
  ('PARAGRAPH', 1, jsonb_build_object('text', $$Setelah proklamasi kemerdekaan 17 Agustus 1945, Belanda tidak rela kehilangan Hindia Belanda dan berupaya kembali berkuasa. Berbagai perundingan ditempuh, termasuk Perjanjian Linggarjati pada November 1946 yang mengakui Republik Indonesia atas Jawa, Sumatera, dan Madura. Namun Belanda melanggar kesepakatan itu dan memilih jalan kekerasan — dua kali agresi militer dilancarkan dalam dua tahun.$$)),
  ('HEADING', 2, jsonb_build_object('text', $$Agresi Militer I: Operatie Product (21 Juli 1947)$$)),
  ('PARAGRAPH', 3, jsonb_build_object('text', $$Pada 21 Juli 1947 Belanda melancarkan Operatie Product, menyerbu wilayah Republik di Jawa dan Sumatera dengan dalih menertibkan keamanan. Sasaran utamanya adalah daerah perkebunan dan sumber ekonomi. Serangan ini menuai kecaman dunia, dan PBB turun tangan lewat resolusi Dewan Keamanan. Hasilnya adalah Perjanjian Renville (Januari 1948) yang justru merugikan Indonesia: wilayah Republik menyusut dan muncul Garis Van Mook sebagai batas demarkasi.$$)),
  ('HEADING', 4, jsonb_build_object('text', $$Agresi Militer II: Operatie Kraai (19 Desember 1948)$$)),
  ('PARAGRAPH', 5, jsonb_build_object('text', $$Belanda kembali mengingkari janji. Pada 19 Desember 1948, Operatie Kraai dilancarkan dengan serangan mendadak ke ibu kota Yogyakarta. Presiden Soekarno, Wakil Presiden Hatta, dan para pemimpin ditangkap lalu diasingkan ke Bangka. Belanda mengira Republik telah runtuh — tetapi sebelum tertangkap, para pemimpin telah menyiapkan langkah darurat: Syafruddin Prawiranegara membentuk Pemerintahan Darurat Republik Indonesia (PDRI) di Bukittinggi, Sumatera Barat, sehingga Indonesia tetap punya pemerintahan yang sah.$$)),
  ('HEADING', 6, jsonb_build_object('text', $$Perlawanan dan Tekanan Internasional$$)),
  ('PARAGRAPH', 7, jsonb_build_object('text', $$Di dalam negeri, TNI melancarkan perang gerilya dan pada 1 Maret 1949 melakukan Serangan Umum atas Yogyakarta — membuktikan kepada dunia bahwa Republik masih eksis dan berdaulat. Di luar negeri, tekanan internasional terhadap Belanda semakin kuat, termasuk dari Amerika Serikat yang mengancam menghentikan bantuan Marshall Plan. Kombinasi perlawanan bersenjata dan diplomasi memaksa Belanda kembali ke meja perundingan.$$)),
  ('HEADING', 8, jsonb_build_object('text', $$Akhir Konflik: Konferensi Meja Bundar$$)),
  ('PARAGRAPH', 9, jsonb_build_object('text', $$Konferensi Meja Bundar (KMB) digelar di Den Haag pada Agustus hingga November 1949, mempertemukan Indonesia, Belanda, dan BFO. Hasilnya: Belanda mengakui kedaulatan Indonesia pada 27 Desember 1949, Indonesia berbentuk negara federal (RIS) untuk sementara, dan persoalan Irian Barat ditunda setahun kemudian. Dua agresi militer itu menjadi bukti bahwa kemerdekaan Indonesia dipertahankan dengan darah, diplomasi, dan keteguhan para pendirinya.$$))
) AS v(block_type, position, content)
WHERE a.business_code = 'EXP-SEJARAH10-001';

-- ============ 5. SCH-SMP-PKN2-001 — PKN Kelas 9: Kedaulatan Negara ============
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, status, created_by, updated_by)
VALUES (gen_random_uuid(), 'SCH-SMP-PKN2-001', 'd4444444-4444-4444-4444-444444444444',
  'PKN Kelas 9: Kedaulatan Negara', 'pkn-kelas-9-kedaulatan-negara',
  'Materi PKN kelas 9 tentang kedaulatan negara: pengertian, teori kedaulatan, kedaulatan rakyat Indonesia menurut UUD 1945, dan contoh penerapannya.',
  'id', 'DRAFT', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;

DELETE FROM madevi.article_blocks WHERE article_id IN (SELECT id FROM madevi.articles WHERE business_code='SCH-SMP-PKN2-001');

INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content)
SELECT gen_random_uuid(), a.id, v.block_type, v.position, v.content
FROM madevi.articles a
CROSS JOIN (VALUES
  ('HEADING', 0, jsonb_build_object('text', $$PKN Kelas 9: Kedaulatan Negara$$)),
  ('PARAGRAPH', 1, jsonb_build_object('text', $$Tujuan pembelajaran: setelah mempelajari materi ini, kamu diharapkan mampu menjelaskan pengertian kedaulatan, menyebutkan teori-teori kedaulatan, menganalisis kedaulatan rakyat di Indonesia menurut UUD 1945, serta memberi contoh penerapan kedaulatan dalam kehidupan berbangsa dan bernegara.$$)),
  ('HEADING', 2, jsonb_build_object('text', $$Pengertian Kedaulatan$$)),
  ('PARAGRAPH', 3, jsonb_build_object('text', $$Kedaulatan berasal dari kata bahasa Inggris sovereignty, artinya kekuasaan tertinggi. Negara yang berdaulat memiliki kekuasaan tertinggi untuk mengatur dirinya sendiri tanpa campur tangan negara lain. Kedaulatan berlaku ke dalam (membuat aturan dan menegakkan hukum di wilayahnya) dan ke luar (bebas menjalin hubungan dengan negara lain sebagai pihak yang sederajat).$$)),
  ('HEADING', 4, jsonb_build_object('text', $$Teori-teori Kedaulatan$$)),
  ('LIST', 5, jsonb_build_object('items', ARRAY['Teori kedaulatan Tuhan: kekuasaan tertinggi berasal dari Tuhan (misalnya kerajaan masa lalu)','Teori kedaulatan raja: kekuasaan tertinggi ada di tangan raja','Teori kedaulatan negara: negara sendiri yang memegang kekuasaan tertinggi','Teori kedaulatan hukum: hukum adalah pemegang kekuasaan tertinggi','Teori kedaulatan rakyat: kekuasaan tertinggi ada di tangan rakyat'])),
  ('HEADING', 6, jsonb_build_object('text', $$Kedaulatan Rakyat di Indonesia$$)),
  ('PARAGRAPH', 7, jsonb_build_object('text', $$Indonesia menganut teori kedaulatan rakyat, ditegaskan dalam Pasal 1 ayat (2) UUD 1945: kedaulatan berada di tangan rakyat dan dilaksanakan menurut Undang-Undang Dasar. Artinya rakyat adalah sumber kekuasaan, tetapi pelaksanaannya diatur lewat konstitusi — melalui pemilu, DPR, dan lembaga negara. Inilah dasar demokrasi Pancasila: dari rakyat, oleh rakyat, dan untuk rakyat.$$)),
  ('HEADING', 8, jsonb_build_object('text', $$Kedaulatan ke Dalam dan ke Luar$$)),
  ('LIST', 9, jsonb_build_object('items', ARRAY['Ke dalam: negara membuat undang-undang, menegakkan hukum, memungut pajak, dan mengatur seluruh wilayah','Ke luar: negara menjalin hubungan diplomatik, membuat perjanjian internasional, dan mempertahankan diri dari ancaman'])),
  ('HEADING', 10, jsonb_build_object('text', $$Latihan Soal$$)),
  ('LIST', 11, jsonb_build_object('items', ARRAY['Soal 1: Jelaskan perbedaan kedaulatan ke dalam dan kedaulatan ke luar, masing-masing dengan satu contoh!','Soal 2: Indonesia menganut teori kedaulatan apa? Tunjukkan dasar hukumnya dalam UUD 1945!','Soal 3: Sebutkan tiga contoh penerapan kedaulatan rakyat dalam kehidupan sehari-hari!','Kunci: (1) Ke dalam = mengatur wilayah sendiri, contoh membuat UU; ke luar = hubungan antarnegara, contoh diplomasi. (2) Kedaulatan rakyat, Pasal 1 ayat (2) UUD 1945. (3) Contoh: pemilu, menyampaikan aspirasi lewat wakil rakyat, otonomi daerah.']))
) AS v(block_type, position, content)
WHERE a.business_code = 'SCH-SMP-PKN2-001';

-- ============ 6. SCH-SD-BIN8-001 — Bahasa Indonesia Kelas 5: Pantun ============
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, status, created_by, updated_by)
VALUES (gen_random_uuid(), 'SCH-SD-BIN8-001', 'd3333333-3333-3333-3333-333333333333',
  'Bahasa Indonesia Kelas 5: Pantun', 'bahasa-indonesia-kelas-5-pantun',
  'Materi Bahasa Indonesia kelas 5 tentang pantun: pengertian, ciri-ciri, jenis-jenis pantun, cara membuat pantun, dan latihan soal.',
  'id', 'DRAFT', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;

DELETE FROM madevi.article_blocks WHERE article_id IN (SELECT id FROM madevi.articles WHERE business_code='SCH-SD-BIN8-001');

INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content)
SELECT gen_random_uuid(), a.id, v.block_type, v.position, v.content
FROM madevi.articles a
CROSS JOIN (VALUES
  ('HEADING', 0, jsonb_build_object('text', $$Bahasa Indonesia Kelas 5: Pantun$$)),
  ('PARAGRAPH', 1, jsonb_build_object('text', $$Tujuan pembelajaran: setelah mempelajari materi ini, kamu dapat menjelaskan pengertian pantun, menyebutkan ciri-ciri pantun, membedakan jenis-jenis pantun, dan membuat pantun sederhana sendiri. Pantun adalah warisan sastra lisan Melayu yang masih hidup hingga kini — yuk kita pelajari!$$)),
  ('HEADING', 2, jsonb_build_object('text', $$Pengertian Pantun$$)),
  ('PARAGRAPH', 3, jsonb_build_object('text', $$Pantun adalah puisi lama yang terdiri atas empat baris. Dua baris pertama disebut sampiran (pembuka), dan dua baris terakhir disebut isi (maksud sebenarnya). Contoh: Pergi berlayar ke Pulau Seram / Singgah sebentar di Ternate / Rajin belajar setiap malam / Agar cita-cita tercapai. Sampiran dan isi dihubungkan oleh persamaan bunyi akhir (rima).$$)),
  ('HEADING', 4, jsonb_build_object('text', $$Ciri-ciri Pantun$$)),
  ('LIST', 5, jsonb_build_object('items', ARRAY['Terdiri atas empat baris dalam satu bait','Baris 1–2 adalah sampiran, baris 3–4 adalah isi','Bersajak a-b-a-b (baris 1 sama bunyi dengan baris 3, baris 2 sama dengan baris 4)','Setiap baris terdiri atas 8–12 suku kata','Isi pantun mengandung nasihat, jenaka, atau teka-teki'])),
  ('HEADING', 6, jsonb_build_object('text', $$Jenis-jenis Pantun$$)),
  ('LIST', 7, jsonb_build_object('items', ARRAY['Pantun nasihat: berisi petuah, contoh: Anak ayam turun ke kali / Induk ayam terbang ke dahan / Hormatilah ayah dan bunda / Agar hidup penuh berkah','Pantun jenaka: berisi humor, contoh: Buah duku buah durian / Dimakan bersama Pak Lurah / Tertawa sampai kekenyangan / Lupa PR belum dikerjakan','Pantun teka-teki: berisi tebakan, contoh: Kalau tuan muda teruna / Pakai baju beli di pasar / Kalau tuan bijak laksana / Binatang apa ekor di kepala? (jawab: gajah)','Pantun kiasan: berisi perumpamaan tentang kehidupan'])),
  ('HEADING', 8, jsonb_build_object('text', $$Cara Membuat Pantun$$)),
  ('PARAGRAPH', 9, jsonb_build_object('text', $$Langkah mudah membuat pantun: pertama, tentukan isi (pesan) yang ingin disampaikan pada baris 3 dan 4. Kedua, cari sampiran pada baris 1 dan 2 yang bunyi akhirnya sama dengan isi (pola a-b-a-b). Ketiga, hitung suku kata tiap baris, usahakan 8–12 suku kata. Contoh buatan sendiri: Burung nuri terbang tinggi (a) / Hinggap sebentar di dahan jati (b) / Jangan malas membaca buku (a) / Agar pintar seperti kancil yang sakti (b).$$)),
  ('HEADING', 10, jsonb_build_object('text', $$Latihan$$)),
  ('LIST', 11, jsonb_build_object('items', ARRAY['Latihan 1: Tentukan mana sampiran dan mana isi pada pantun: Jalan-jalan ke Kota Blitar / Jangan lupa membeli sukun / Kalau kamu ingin pintar / Rajinlah membaca dan tekun','Latihan 2: Lengkapilah pantun rumpang berikut: ... (a) / ... (b) / Belajar itu tiada henti (a) / ... (b)','Latihan 3: Buatlah satu bait pantun nasihat tentang menjaga kebersihan!','Kunci: (1) Sampiran: baris 1–2; Isi: baris 3–4. (2) Contoh jawaban: Pagi hari burung berkicau / Embun menetes di dedaunan / Belajar itu tiada henti / Untuk meraih masa depan. (3) Dinilai dari: 4 baris, pola a-b-a-b, ada pesan kebersihan.']))
) AS v(block_type, position, content)
WHERE a.business_code = 'SCH-SD-BIN8-001';

COMMIT;
