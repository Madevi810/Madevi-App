-- Madevi artikel batch 40 (idempotent, ON CONFLICT DO NOTHING)
-- Owner: f7125028-187e-44e0-b95b-88b69b8d5c9a
BEGIN;

-- ============ 1. TUT-BAHASA4-001 ============
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, status, created_by, updated_by)
VALUES ('e4000001-4000-4000-4000-000000000001', 'TUT-BAHASA4-001', 'b6666666-6666-6666-6666-666666666666',
  'Bahasa Inggris: Tenses Paling Sering Dipakai',
  'bahasa-inggris-tenses-paling-sering-dipakai',
  'Tidak perlu menghafal 16 tenses sekaligus. Artikel ini membahas 5 tenses yang paling sering dipakai dalam percakapan sehari-hari beserta rumus, contoh, rencana belajar 30 hari, dan kesalahan umum pembelajar Indonesia.',
  'id', 8, 'DRAFT', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;

DELETE FROM madevi.article_blocks WHERE article_id = (SELECT id FROM madevi.articles WHERE business_code = 'TUT-BAHASA4-001');

WITH art AS (SELECT id FROM madevi.articles WHERE business_code = 'TUT-BAHASA4-001')
INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content)
SELECT gen_random_uuid(), art.id, v.bt, v.pos, v.c FROM art CROSS JOIN (VALUES
  ('HEADING', 1, jsonb_build_object('text', $$Masalah: Pusing Menghafal 16 Tenses$$)),
  ('PARAGRAPH', 2, jsonb_build_object('text', $$Kebanyakan pembelajar Indonesia menyerah di bab tenses karena disuruh menghafal 16 pola sekaligus. Padahal dalam percakapan sehari-hari, penutur asli pun 90 persen waktunya hanya memakai 5 tenses. Kuncinya bukan menghafal semua, tapi menguasai yang paling sering dipakai sampai menjadi otomatis.$$)),
  ('HEADING', 3, jsonb_build_object('text', $$Penjelasan: 5 Tenses yang Menutupi Hampir Semua Kebutuhan$$)),
  ('LIST', 4, jsonb_build_object('items', ARRAY[
    $$Simple Present: fakta dan kebiasaan. Rumus: S + V1. Contoh: I work every day. She likes coffee.$$,
    $$Present Continuous: sedang berlangsung. Rumus: S + am/is/are + V-ing. Contoh: I am studying now.$$,
    $$Simple Past: kejadian selesai di masa lalu. Rumus: S + V2. Contoh: We watched a movie last night.$$,
    $$Present Perfect: pengalaman atau hasil yang masih terasa. Rumus: S + have/has + V3. Contoh: I have finished my homework.$$,
    $$Simple Future: rencana dan janji. Rumus: S + will + V1. Contoh: I will call you tomorrow.$$
  ])),
  ('HEADING', 5, jsonb_build_object('text', $$Alat yang Dibutuhkan$$)),
  ('LIST', 6, jsonb_build_object('items', ARRAY[
    $$Kamus Inggris-Indonesia (buku atau aplikasi).$$,
    $$Aplikasi latihan tenses dengan koreksi otomatis.$$,
    $$Buku catatan khusus untuk menulis 10 kalimat setiap hari.$$,
    $$Teman latihan atau komunitas belajar bahasa Inggris.$$
  ])),
  ('HEADING', 7, jsonb_build_object('text', $$Langkah Belajar: Rencana 30 Hari$$)),
  ('LIST', 8, jsonb_build_object('items', ARRAY[
    $$Hari 1-6: kuasai Simple Present. Buat 10 kalimat tentang rutinitasmu setiap hari.$$,
    $$Hari 7-12: kuasai Present Continuous. Ceritakan apa yang sedang kamu lakukan setiap jam.$$,
    $$Hari 13-18: kuasai Simple Past. Tulis diary 5 kalimat tentang kejadian kemarin.$$,
    $$Hari 19-24: kuasai Present Perfect. Ceritakan 3 pengalaman yang pernah kamu alami.$$,
    $$Hari 25-30: kuasai Simple Future. Tulis 5 rencanamu minggu depan, lalu campur semua tenses dalam satu paragraf.$$
  ])),
  ('HEADING', 9, jsonb_build_object('text', $$Kesalahan Umum Pembelajar Indonesia$$)),
  ('LIST', 10, jsonb_build_object('items', ARRAY[
    $$Tertukar V2 dan V3: went adalah V2 untuk Simple Past, sedangkan gone adalah V3 untuk Present Perfect.$$,
    $$Lupa aturan -s/-es: She likes benar, tetapi kalimat negatifnya She does not like, bukan does not likes.$$,
    $$Memakai Present Perfect untuk waktu lampau yang jelas: katakan I met him yesterday, bukan I have met him yesterday.$$
  ])),
  ('HEADING', 11, jsonb_build_object('text', $$Risiko dan Cara Menghindarinya$$)),
  ('PARAGRAPH', 12, jsonb_build_object('text', $$Risiko terbesar adalah berhenti di tengah jalan karena merasa tidak ada kemajuan. Tenses itu seperti otot: ia menjadi kuat karena dipakai, bukan karena dihafal. Setelah 5 tenses ini berjalan otomatis, barulah pelajari sisanya satu per satu sesuai kebutuhan, misalnya Past Continuous untuk bercerita atau Future Perfect untuk target. Konsistensi 15 menit sehari mengalahkan belajar 5 jam seminggu sekali.$$))
) AS v(bt, pos, c);

-- ============ 2. TUT-KESEHATAN6-001 ============
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, status, created_by, updated_by)
VALUES ('e4000002-4000-4000-4000-000000000002', 'TUT-KESEHATAN6-001', 'b5555555-5555-5555-5555-555555555555',
  'Maag Kambuh: Pertolongan Pertama',
  'maag-kambuh-pertolongan-pertama',
  'Panduan pertolongan pertama saat maag kambuh: langkah meredakan gejala, hal yang harus dihindari, tanda bahaya yang mengharuskan ke dokter, dan pencegahan jangka panjang. Informasi umum, bukan pengganti nasihat medis.',
  'id', 8, 'DRAFT', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;

DELETE FROM madevi.article_blocks WHERE article_id = (SELECT id FROM madevi.articles WHERE business_code = 'TUT-KESEHATAN6-001');

WITH art AS (SELECT id FROM madevi.articles WHERE business_code = 'TUT-KESEHATAN6-001')
INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content)
SELECT gen_random_uuid(), art.id, v.bt, v.pos, v.c FROM art CROSS JOIN (VALUES
  ('HEADING', 1, jsonb_build_object('text', $$Masalah: Nyeri Ulu Hati Mendadak$$)),
  ('PARAGRAPH', 2, jsonb_build_object('text', $$Maag kambuh ditandai nyeri atau perih di ulu hati, kembung, mual, dan rasa penuh. Pemicu yang umum: telat makan, makanan pedas atau asam, kopi, stres, dan obat pereda nyeri tertentu. Artikel ini berisi informasi umum pertolongan pertama, bukan diagnosis, dan bukan pengganti nasihat dokter. Bila ragu, konsultasikan ke dokter atau fasilitas kesehatan terdekat.$$)),
  ('HEADING', 3, jsonb_build_object('text', $$Penjelasan: Apa yang Terjadi di Lambung$$)),
  ('PARAGRAPH', 4, jsonb_build_object('text', $$Lambung menghasilkan asam untuk mencerna makanan dan dilindungi lapisan lendir pelindung. Saat pola makan kacau atau stres berkepanjangan, keseimbangan ini terganggu: asam berlebih mengiritasi dinding lambung. Iritasi itulah sumber rasa perih dan mual yang kamu rasakan.$$)),
  ('HEADING', 5, jsonb_build_object('text', $$Langkah Pertolongan Pertama$$)),
  ('LIST', 6, jsonb_build_object('items', ARRAY[
    $$Makan porsi kecil yang lembut: bubur, roti tawar, atau pisang. Jangan biarkan perut kosong terlalu lama.$$,
    $$Hindari pemicu selama 1-2 hari: makanan pedas, asam, gorengan, kopi, teh pekat, dan minuman bersoda.$$,
    $$Minum air putih hangat sedikit-sedikit. Jahe hangat juga membantu sebagian orang meredakan mual.$$,
    $$Istirahat dan kelola stres, karena kecemasan memperburuk gejala maag.$$,
    $$Obat maag bebas seperti antasida boleh dipakai sesuai aturan pada kemasan untuk meredakan gejala ringan sementara.$$
  ])),
  ('HEADING', 7, jsonb_build_object('text', $$Alat dan Persiapan$$)),
  ('LIST', 8, jsonb_build_object('items', ARRAY[
    $$Stok makanan lembut siap saji di rumah: bubur instan, roti tawar, pisang.$$,
    $$Air putih hangat yang mudah diakses.$$,
    $$Obat maag bebas dengan aturan pakai yang jelas pada kemasan.$$,
    $$Nomor kontak dokter, klinik, atau puskesmas terdekat.$$
  ])),
  ('HEADING', 9, jsonb_build_object('text', $$Risiko: Kapan Harus ke Dokter$$)),
  ('LIST', 10, jsonb_build_object('items', ARRAY[
    $$Nyeri hebat yang tidak membaik, muntah darah, atau BAB berwarna hitam seperti aspal: segera ke IGD.$$,
    $$Gejala berulang lebih dari 2 minggu, berat badan turun tanpa sebab, atau sulit menelan: periksakan ke dokter.$$,
    $$Hindari obat pereda nyeri seperti ibuprofen atau aspirin tanpa saran dokter saat maag kambuh, karena dapat memperparah iritasi lambung.$$,
    $$Ibu hamil, penderita penyakit jantung atau ginjal: konsultasikan dulu ke dokter sebelum minum obat apa pun.$$
  ])),
  ('HEADING', 11, jsonb_build_object('text', $$Pencegahan Jangka Panjang$$)),
  ('PARAGRAPH', 12, jsonb_build_object('text', $$Pola makan teratur adalah pertahanan terbaik: jangan telat makan lebih dari 4-5 jam, batasi kopi dan makanan pedas, berhenti merokok, dan kelola stres dengan tidur cukup. Jika maag sering kambuh padahal pola makan sudah rapi, jangan menunda pemeriksaan ke dokter. Bisa jadi ada penyebab lain seperti infeksi bakteri Helicobacter pylori yang membutuhkan penanganan khusus.$$))
) AS v(bt, pos, c);

-- ============ 3. EXP-FISIKA8-001 ============
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, status, created_by, updated_by)
VALUES ('e4000003-4000-4000-4000-000000000003', 'EXP-FISIKA8-001', 'c3333333-3333-3333-3333-333333333333',
  'Cahaya: Gelombang atau Partikel?',
  'cahaya-gelombang-atau-partikel',
  'Apakah cahaya itu gelombang atau partikel? Telusuri eksperimen celah ganda Young, efek fotolistrik Einstein, dan konsep dualisme gelombang-partikel yang menjadi fondasi fisika kuantum dan teknologi modern.',
  'id', 6, 'DRAFT', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;

DELETE FROM madevi.article_blocks WHERE article_id = (SELECT id FROM madevi.articles WHERE business_code = 'EXP-FISIKA8-001');

WITH art AS (SELECT id FROM madevi.articles WHERE business_code = 'EXP-FISIKA8-001')
INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content)
SELECT gen_random_uuid(), art.id, v.bt, v.pos, v.c FROM art CROSS JOIN (VALUES
  ('HEADING', 1, jsonb_build_object('text', $$Teka-teki Tertua dalam Fisika$$)),
  ('PARAGRAPH', 2, jsonb_build_object('text', $$Selama ratusan tahun ilmuwan berdebat: apakah cahaya itu gelombang seperti riak air, atau partikel seperti butiran pasir? Jawabannya ternyata keduanya. Inilah konsep dualisme gelombang-partikel, salah satu ide paling aneh sekaligus paling terbukti dalam sains modern.$$)),
  ('HEADING', 3, jsonb_build_object('text', $$Bukti Cahaya adalah Gelombang$$)),
  ('PARAGRAPH', 4, jsonb_build_object('text', $$Pada tahun 1801, Thomas Young melakukan eksperimen celah ganda: cahaya yang melewati dua celah sempit membentuk pola terang-gelap bergantian di layar. Pola interferensi seperti ini hanya bisa dibuat oleh gelombang yang saling menguatkan dan melemahkan, persis seperti riak air yang bertemu satu sama lain.$$)),
  ('HEADING', 5, jsonb_build_object('text', $$Bukti Cahaya adalah Partikel$$)),
  ('PARAGRAPH', 6, jsonb_build_object('text', $$Pada tahun 1905, Einstein menjelaskan efek fotolistrik: cahaya yang mengenai logam bisa menendang elektron keluar, tetapi hanya jika frekuensinya cukup tinggi, bukan jika cahayanya terang. Ini hanya masuk akal bila cahaya datang dalam paket-paket energi diskret yang disebut foton. Satu foton menendang satu elektron, tidak peduli seberapa terang cahayanya.$$)),
  ('HEADING', 7, jsonb_build_object('text', $$Dualisme: Keduanya Benar$$)),
  ('PARAGRAPH', 8, jsonb_build_object('text', $$Cahaya merambat sebagai gelombang tetapi berinteraksi sebagai partikel. Ia bukan kadang-kadang berubah wujud, ia memang memiliki kedua sifat sekaligus, dan sifat mana yang terlihat tergantung pada eksperimen yang dilakukan. Elektron dan partikel materi lain ternyata memiliki dualisme yang sama.$$)),
  ('HEADING', 9, jsonb_build_object('text', $$Mengapa Ini Penting$$)),
  ('PARAGRAPH', 10, jsonb_build_object('text', $$Tanpa pemahaman tentang foton, tidak akan ada panel surya, laser, LED, atau kamera digital. Dualisme gelombang-partikel juga menjadi pintu gerbang menuju fisika kuantum, teori yang mendasari semikonduktor, komputer, dan hampir seluruh teknologi modern yang kita pakai hari ini.$$))
) AS v(bt, pos, c);

-- ============ 4. EXP-SEJARAH7-001 ============
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, status, created_by, updated_by)
VALUES ('e4000004-4000-4000-4000-000000000004', 'EXP-SEJARAH7-001', 'c8888888-8888-8888-8888-888888888888',
  'Kerajaan Demak: Islam Pertama di Jawa',
  'kerajaan-demak-islam-pertama-di-jawa',
  'Mengenal Kesultanan Demak, kerajaan Islam pertama di Jawa: Raden Patah, peran Walisongo, Masjid Agung Demak, kejayaan Sultan Trenggana, dan warisannya bagi Indonesia.',
  'id', 6, 'DRAFT', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;

DELETE FROM madevi.article_blocks WHERE article_id = (SELECT id FROM madevi.articles WHERE business_code = 'EXP-SEJARAH7-001');

WITH art AS (SELECT id FROM madevi.articles WHERE business_code = 'EXP-SEJARAH7-001')
INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content)
SELECT gen_random_uuid(), art.id, v.bt, v.pos, v.c FROM art CROSS JOIN (VALUES
  ('HEADING', 1, jsonb_build_object('text', $$Lahirnya Kerajaan Islam Pertama di Jawa$$)),
  ('PARAGRAPH', 2, jsonb_build_object('text', $$Pada akhir abad ke-15, saat Majapahit melemah, sebuah kekuatan baru muncul di pesisir utara Jawa: Kesultanan Demak. Didirikan sekitar tahun 1478 oleh Raden Patah, Demak menjadi kerajaan Islam pertama di Jawa dan pintu masuk penyebaran Islam ke pedalaman.$$)),
  ('HEADING', 3, jsonb_build_object('text', $$Raden Patah dan Para Wali$$)),
  ('PARAGRAPH', 4, jsonb_build_object('text', $$Raden Patah adalah putra raja Majapahit terakhir yang memeluk Islam. Penyebaran Islam di Demak tidak lepas dari peran Walisongo, sembilan wali penyebar Islam di Jawa seperti Sunan Kalijaga dan Sunan Kudus, yang berdakwah dengan pendekatan budaya, seni, dan perdagangan, bukan dengan paksaan.$$)),
  ('HEADING', 5, jsonb_build_object('text', $$Masjid Agung Demak: Saksi Sejarah$$)),
  ('PARAGRAPH', 6, jsonb_build_object('text', $$Dibangun pada tahun 1479, Masjid Agung Demak adalah salah satu masjid tertua di Indonesia. Konon salah satu tiang utamanya, yang disebut Saka Tatal, dibuat Sunan Kalijaga dari serpihan-serpihan kayu. Atapnya yang bertingkat tiga memadukan arsitektur Jawa dengan fungsi Islam, simbol akulturasi budaya yang harmonis.$$)),
  ('HEADING', 7, jsonb_build_object('text', $$Puncak Kejayaan di Bawah Sultan Trenggana$$)),
  ('PARAGRAPH', 8, jsonb_build_object('text', $$Di bawah Sultan Trenggana yang memerintah tahun 1521 sampai 1546, Demak mencapai puncak kejayaan: menguasai pelabuhan-pelabuhan penting, menaklukkan Sunda Kelapa yang kemudian menjadi Jayakarta oleh Fatahillah pada tahun 1527, dan menyebarkan pengaruh Islam hingga ke Kalimantan dan Maluku.$$)),
  ('HEADING', 9, jsonb_build_object('text', $$Warisan Demak untuk Indonesia$$)),
  ('PARAGRAPH', 10, jsonb_build_object('text', $$Meski runtuh akibat konflik internal pada pertengahan abad ke-16 dan digantikan Pajang lalu Mataram, warisan Demak abadi: Islam menjadi agama mayoritas di Jawa, tradisi dakwah kultural Walisongo terus hidup, dan Masjid Agung Demak masih berdiri hingga kini sebagai pusat ziarah dan kebanggaan sejarah Islam Nusantara.$$))
) AS v(bt, pos, c);

-- ============ 5. SCH-SMA-FIS4-001 ============
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, status, created_by, updated_by)
VALUES ('e4000005-4000-4000-4000-000000000005', 'SCH-SMA-FIS4-001', 'd5555555-5555-5555-5555-555555555555',
  'Fisika Kelas 11: Gerak Parabola',
  'fisika-kelas-11-gerak-parabola',
  'Materi Fisika kelas 11 tentang gerak parabola: konsep gabungan GLB dan GLBB, rumus ketinggian maksimum dan jarak terjauh, contoh soal terpecahkan, dan latihan mandiri beserta kunci jawaban.',
  'id', 8, 'DRAFT', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;

DELETE FROM madevi.article_blocks WHERE article_id = (SELECT id FROM madevi.articles WHERE business_code = 'SCH-SMA-FIS4-001');

WITH art AS (SELECT id FROM madevi.articles WHERE business_code = 'SCH-SMA-FIS4-001')
INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content)
SELECT gen_random_uuid(), art.id, v.bt, v.pos, v.c FROM art CROSS JOIN (VALUES
  ('HEADING', 1, jsonb_build_object('text', $$Tujuan Pembelajaran$$)),
  ('PARAGRAPH', 2, jsonb_build_object('text', $$Setelah mempelajari materi ini, kamu diharapkan mampu: (1) menjelaskan konsep gerak parabola sebagai gabungan GLB dan GLBB; (2) menghitung kecepatan awal, ketinggian maksimum, dan jarak terjauh; (3) menganalisis contoh gerak parabola dalam kehidupan sehari-hari.$$)),
  ('HEADING', 3, jsonb_build_object('text', $$Konsep Dasar: Dua Gerak dalam Satu$$)),
  ('PARAGRAPH', 4, jsonb_build_object('text', $$Gerak parabola adalah gerak benda yang lintasannya melengkung seperti busur, misalnya bola yang ditendang atau peluru yang ditembakkan miring. Rahasianya: gerak ini gabungan dua gerak lurus yang saling tegak lurus. Arah horizontal (sumbu-x) adalah GLB karena kecepatannya tetap, tidak ada gaya yang bekerja. Arah vertikal (sumbu-y) adalah GLBB karena dipengaruhi gravitasi (g = 10 m/s2) yang memperlambat gerak naik lalu mempercepat gerak turun.$$)),
  ('HEADING', 5, jsonb_build_object('text', $$Rumus-Rumus Penting$$)),
  ('LIST', 6, jsonb_build_object('items', ARRAY[
    $$Kecepatan awal diuraikan menjadi: vx = v0 cosinus theta, vy = v0 sinus theta.$$,
    $$Posisi tiap saat: x = v0 cosinus theta dikali t; y = v0 sinus theta dikali t dikurangi setengah g t kuadrat.$$,
    $$Waktu mencapai titik tertinggi: t puncak = (v0 sinus theta) / g.$$,
    $$Tinggi maksimum: h maks = (v0 kuadrat dikali sinus kuadrat theta) / (2g).$$,
    $$Jarak terjauh: R = (v0 kuadrat dikali sinus 2 theta) / g, maksimum saat theta = 45 derajat.$$
  ])),
  ('HEADING', 7, jsonb_build_object('text', $$Contoh Soal 1: Tinggi Maksimum$$)),
  ('PARAGRAPH', 8, jsonb_build_object('text', $$Sebuah bola ditendang dengan kecepatan awal 20 m/s membentuk sudut 30 derajat terhadap tanah (g = 10 m/s2). Berapa tinggi maksimumnya? Jawab: h maks = (v0 kuadrat x sinus kuadrat theta) / (2g) = (400 x 0,25) / 20 = 100 / 20 = 5 meter.$$)),
  ('HEADING', 9, jsonb_build_object('text', $$Contoh Soal 2: Jarak Terjauh$$)),
  ('PARAGRAPH', 10, jsonb_build_object('text', $$Dengan data yang sama, berapa jarak mendatar terjauh bola? Jawab: R = (v0 kuadrat x sinus 2 theta) / g = (400 x sinus 60 derajat) / 10 = (400 x 0,866) / 10 = 34,64 meter.$$)),
  ('HEADING', 11, jsonb_build_object('text', $$Latihan Mandiri$$)),
  ('LIST', 12, jsonb_build_object('items', ARRAY[
    $$Soal 1: Peluru ditembakkan dengan v0 = 40 m/s, sudut 45 derajat, g = 10 m/s2. Hitung tinggi maksimum dan jarak terjauh! (Kunci: h maks = 40 m; R = 160 m)$$,
    $$Soal 2: Mengapa sudut 45 derajat menghasilkan jarak terjauh? Jelaskan dengan rumus! (Kunci: karena sinus 2 theta mencapai maksimum = 1 saat 2 theta = 90 derajat)$$,
    $$Soal 3: Sebutkan 3 contoh gerak parabola dalam olahraga! (Kunci: tendangan bebas sepak bola, lemparan bola basket, lompat jauh)$$
  ]))
) AS v(bt, pos, c);

-- ============ 6. SCH-SD-IPS6-001 ============
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, status, created_by, updated_by)
VALUES ('e4000006-4000-4000-4000-000000000006', 'SCH-SD-IPS6-001', 'd1000002-0000-0000-0000-000000000002',
  'IPS Kelas 2: Keluarga Besar',
  'ips-kelas-2-keluarga-besar',
  'Materi IPS kelas 2 SD tentang keluarga besar: anggota keluarga besar, silsilah keluarga, peran setiap anggota, dan latihan soal ramah anak beserta kunci jawaban.',
  'id', 8, 'DRAFT', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;

DELETE FROM madevi.article_blocks WHERE article_id = (SELECT id FROM madevi.articles WHERE business_code = 'SCH-SD-IPS6-001');

WITH art AS (SELECT id FROM madevi.articles WHERE business_code = 'SCH-SD-IPS6-001')
INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content)
SELECT gen_random_uuid(), art.id, v.bt, v.pos, v.c FROM art CROSS JOIN (VALUES
  ('HEADING', 1, jsonb_build_object('text', $$Tujuan Pembelajaran$$)),
  ('PARAGRAPH', 2, jsonb_build_object('text', $$Halo anak-anak! Setelah belajar bab ini, kalian bisa: (1) menyebutkan anggota keluarga besar; (2) menceritakan silsilah keluargamu sendiri; (3) menjelaskan peran setiap anggota keluarga.$$)),
  ('HEADING', 3, jsonb_build_object('text', $$Siapa Saja Keluarga Besar Kita?$$)),
  ('PARAGRAPH', 4, jsonb_build_object('text', $$Keluarga inti terdiri dari ayah, ibu, dan anak. Keluarga besar lebih luas lagi: ada kakek dan nenek yaitu orang tua dari ayah atau ibu, ada paman dan bibi yaitu saudara ayah atau ibu, serta sepupu yaitu anak dari paman atau bibi. Mereka semua adalah keluarga kita!$$)),
  ('HEADING', 5, jsonb_build_object('text', $$Mengenal Silsilah Keluarga$$)),
  ('PARAGRAPH', 6, jsonb_build_object('text', $$Silsilah adalah bagan yang menunjukkan hubungan antaranggota keluarga, seperti pohon. Di puncak ada kakek dan nenek, di bawahnya ada ayah, ibu, paman, dan bibi, lalu di bawah lagi ada kamu dan sepupu-sepupumu. Coba buat silsilah keluargamu bersama orang tua di rumah!$$)),
  ('HEADING', 7, jsonb_build_object('text', $$Peran Anggota Keluarga$$)),
  ('LIST', 8, jsonb_build_object('items', ARRAY[
    $$Ayah dan ibu: bekerja mencari nafkah, merawat, dan mendidik anak.$$,
    $$Kakek dan nenek: memberi nasihat dan kasih sayang, penjaga cerita keluarga.$$,
    $$Paman dan bibi: membantu ayah dan ibu, teman bermain yang asyik.$$,
    $$Anak (yaitu kamu!): belajar rajin, membantu orang tua, dan menyayangi keluarga.$$
  ])),
  ('HEADING', 9, jsonb_build_object('text', $$Kasih Sayang dalam Keluarga Besar$$)),
  ('PARAGRAPH', 10, jsonb_build_object('text', $$Keluarga besar yang rukun itu seperti tim: saling membantu saat susah dan merayakan bersama saat senang. Berkumpul saat Lebaran atau acara keluarga membuat hubungan makin erat. Jangan lupa selalu berkata sopan kepada kakek, nenek, paman, dan bibi, ya!$$)),
  ('HEADING', 11, jsonb_build_object('text', $$Ayo Berlatih!$$)),
  ('LIST', 12, jsonb_build_object('items', ARRAY[
    $$Soal 1: Sebutkan 4 anggota keluarga besarmu selain ayah dan ibu! (Kunci: kakek, nenek, paman, bibi, sepupu, pilih 4)$$,
    $$Soal 2: Siapakah orang tua dari ayahmu? (Kunci: kakek dan nenek dari pihak ayah)$$,
    $$Soal 3: Apa peranmu sebagai anak di dalam keluarga? (Kunci: belajar rajin, membantu orang tua, menyayangi keluarga)$$
  ]))
) AS v(bt, pos, c);

COMMIT;
