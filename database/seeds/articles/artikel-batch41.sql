-- Batch 41: 6 artikel baru (idempoten, ON CONFLICT DO NOTHING + delete block lama)
-- Owner principal: f7125028-187e-44e0-b95b-88b69b8d5c9a

DO $do$
DECLARE v_article_id uuid;
BEGIN
  INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, status, created_by, updated_by)
  VALUES (gen_random_uuid(), 'TUT-MUSIK3-001', 'b6666666-6666-6666-6666-666666666666',
    'Drum untuk Pemula: Ritme Dasar', 'drum-untuk-pemula-ritme-dasar',
    'Panduan belajar drum dari nol: postur, pegangan stick, latihan single stroke dengan metronome, hingga pola rock dasar. Format masalah ke penyelesaian.',
    'id', 8, 'DRAFT', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
  ON CONFLICT (business_code) DO NOTHING;
  SELECT id INTO v_article_id FROM madevi.articles WHERE business_code = 'TUT-MUSIK3-001';
  DELETE FROM madevi.article_blocks WHERE article_id = v_article_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
  (gen_random_uuid(), v_article_id, 'HEADING', 1, jsonb_build_object('text', $txt$Masalah: Ingin Main Drum, Tapi Bingung Mulai dari Mana$txt$)),
  (gen_random_uuid(), v_article_id, 'PARAGRAPH', 2, jsonb_build_object('text', $txt$Banyak pemula tertarik bermain drum setelah melihat drummer tampil energik di panggung, tetapi langsung menyerah begitu duduk di depan drum set. Semua anggota tubuh harus bergerak bersamaan: tangan kanan dan kiri memainkan pola berbeda, kaki kanan menginjak pedal bass drum, kaki kiri mengontrol hi-hat. Kabar baiknya, koordinasi ini bukan bakat bawaan, melainkan keterampilan yang bisa dilatih langkah demi langkah.$txt$)),
  (gen_random_uuid(), v_article_id, 'HEADING', 3, jsonb_build_object('text', $txt$Penjelasan: Apa Itu Ritme Dasar$txt$)),
  (gen_random_uuid(), v_article_id, 'PARAGRAPH', 4, jsonb_build_object('text', $txt$Ritme adalah pola ketukan yang berulang dalam musik. Satuan terkecilnya adalah ketukan (beat) yang dihitung 1-2-3-4 dalam satu birama 4/4, pola paling umum di musik pop dan rock. Not seperempat berbunyi satu ketukan, sedangkan not seperdelapan berbunyi setengah ketukan. Tempo adalah kecepatan ketukan, diukur dalam BPM (beats per minute). Lagu pop umumnya 90 sampai 120 BPM, sedangkan pemula sebaiknya berlatih di 60 sampai 80 BPM.$txt$)),
  (gen_random_uuid(), v_article_id, 'HEADING', 5, jsonb_build_object('text', $txt$Persiapan Alat$txt$)),
  (gen_random_uuid(), v_article_id, 'LIST', 6, jsonb_build_object('text', $txt$1. Drum pad latihan atau drum set asli — pad latihan cukup untuk 2 bulan pertama dan jauh lebih murah serta tidak berisik.
2. Stick drum ukuran 5A — ukuran standar yang seimbang untuk pemula.
3. Metronome — aplikasi metronome gratis di HP sudah cukup, ini alat terpenting.
4. Kursi drum (drum throne) atau kursi kokoh dengan tinggi yang pas — paha sejajar lantai.
5. Earplug atau pelindung telinga jika berlatih dengan drum akustik asli.$txt$)),
  (gen_random_uuid(), v_article_id, 'HEADING', 7, jsonb_build_object('text', $txt$Langkah-langkah Latihan$txt$)),
  (gen_random_uuid(), v_article_id, 'LIST', 8, jsonb_build_object('text', $txt$1. Atur postur: duduk tegak, punggung tidak membungkuk, kaki menapak pedal dengan rileks.
2. Pelajari matched grip: kedua tangan memegang stick dengan cara sama, ibu jari dan telunjuk membentuk titik tumpu, jari lain membungkus longgar.
3. Latihan single stroke: pukul bergantian kanan-kiri-kanan-kiri (R-L-R-L) mengikuti metronome 60 BPM selama 5 menit. Fokus pada bunyi yang rata, bukan kecepatan.
4. Tambahkan kaki kanan: setiap ketukan ke-1 dan ke-3, injak pedal bass drum sambil tangan tetap single stroke.
5. Pola rock dasar: tangan kanan memukul hi-hat tiap ketukan, tangan kiri memukul snare pada ketukan 2 dan 4, kaki kanan bass drum pada ketukan 1 dan 3.
6. Naikkan tempo 5 BPM setiap kali pola sudah stabil selama 2 menit tanpa kesalahan.$txt$)),
  (gen_random_uuid(), v_article_id, 'HEADING', 9, jsonb_build_object('text', $txt$Risiko dan Kesalahan Umum$txt$)),
  (gen_random_uuid(), v_article_id, 'LIST', 10, jsonb_build_object('text', $txt$1. Postur membungkuk terlalu lama menyebabkan nyeri punggung dan bahu — periksa postur tiap 10 menit.
2. Langsung berlatih cepat membuat pola berantakan dan membentuk kebiasaan buruk yang sulit diperbaiki.
3. Berlatih tanpa metronome membuat tempo goyang; saat bermain dengan band akan ketahuan.
4. Latihan lebih dari 45 menit tanpa istirahat berisiko kelelahan otot pergelangan tangan — istirahat 5 menit tiap 20 menit latihan.
5. Memukul terlalu keras sejak awal — volume datang dari teknik pantulan stick, bukan tenaga otot.$txt$)),
  (gen_random_uuid(), v_article_id, 'HEADING', 11, jsonb_build_object('text', $txt$Pemeriksaan Hasil$txt$)),
  (gen_random_uuid(), v_article_id, 'PARAGRAPH', 12, jsonb_build_object('text', $txt$Uji kemampuan Anda dengan checklist ini: (1) bisa memainkan pola rock dasar selama 2 menit penuh tanpa berhenti mengikuti metronome 80 BPM; (2) bunyi pukulan kanan dan kiri terdengar seimbang; (3) bisa berpindah dari single stroke ke pola rock tanpa jeda panjang. Jika ketiganya terpenuhi, Anda siap lanjut ke materi berikutnya: fill-in sederhana dan variasi hi-hat. Jika belum, turunkan tempo 10 BPM dan ulangi latihan langkah 3 sampai 5 selama seminggu.$txt$));
END $do$;

DO $do$
DECLARE v_article_id uuid;
BEGIN
  INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, status, created_by, updated_by)
  VALUES (gen_random_uuid(), 'TUT-KESEHATAN7-001', 'b5555555-5555-5555-5555-555555555555',
    'Sakit Kepala: Penyebab dan Penanganan', 'sakit-kepala-penyebab-dan-penanganan',
    'Panduan mengenali jenis sakit kepala, mencatat pola pemicunya, langkah penanganan mandiri, dan tanda bahaya yang mewajibkan ke dokter. Informasi umum, bukan pengganti nasihat medis.',
    'id', 7, 'DRAFT', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
  ON CONFLICT (business_code) DO NOTHING;
  SELECT id INTO v_article_id FROM madevi.articles WHERE business_code = 'TUT-KESEHATAN7-001';
  DELETE FROM madevi.article_blocks WHERE article_id = v_article_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
  (gen_random_uuid(), v_article_id, 'HEADING', 1, jsonb_build_object('text', $txt$Masalah: Sakit Kepala yang Mengganggu Aktivitas$txt$)),
  (gen_random_uuid(), v_article_id, 'PARAGRAPH', 2, jsonb_build_object('text', $txt$Hampir semua orang pernah mengalami sakit kepala: rasa nyeri, tegang, atau berdenyut di kepala yang membuat sulit fokus bekerja atau belajar. Sebagian besar sakit kepala tidak berbahaya dan bisa ditangani sendiri, tetapi sebagian kecil merupakan tanda kondisi serius yang butuh penanganan medis segera. Karena itu langkah pertama bukan panik, melainkan mengenali jenis dan polanya.$txt$)),
  (gen_random_uuid(), v_article_id, 'HEADING', 3, jsonb_build_object('text', $txt$Penjelasan: Jenis-jenis Sakit Kepala$txt$)),
  (gen_random_uuid(), v_article_id, 'PARAGRAPH', 4, jsonb_build_object('text', $txt$Ada empat jenis umum. Sakit kepala tegang terasa seperti kepala diikat kencang di kedua sisi, biasanya dipicu stres dan kelelahan. Migrain terasa berdenyut di satu sisi, bisa disertai mual dan sensitif terhadap cahaya atau suara, dan bisa berlangsung 4 sampai 72 jam. Sakit kepala cluster terasa sangat tajam di sekitar satu mata dan datang berkelompok dalam periode tertentu. Sakit kepala sinus terasa menekan di dahi dan pipi, biasanya menyertai pilek atau infeksi sinus.$txt$)),
  (gen_random_uuid(), v_article_id, 'HEADING', 5, jsonb_build_object('text', $txt$Persiapan: Kenali Pola Sakit Kepala Anda$txt$)),
  (gen_random_uuid(), v_article_id, 'LIST', 6, jsonb_build_object('text', $txt$Catat hal berikut setiap kali sakit kepala muncul, minimal selama dua minggu:
1. Kapan mulai dan berapa lama berlangsung.
2. Lokasi nyeri: satu sisi, kedua sisi, dahi, belakang kepala, atau sekitar mata.
3. Sifat nyeri: berdenyut, menekan, tajam, atau tumpul.
4. Pemicu yang dicurigai: kurang tidur, dehidrasi, telat makan, stres, terlalu lama menatap layar, atau makanan tertentu.
5. Gejala penyerta: mual, muntah, gangguan penglihatan, atau demam.
Catatan ini sangat membantu dokter menegakkan diagnosis jika Anda akhirnya berkonsultasi.$txt$)),
  (gen_random_uuid(), v_article_id, 'HEADING', 7, jsonb_build_object('text', $txt$Langkah Penanganan Mandiri$txt$)),
  (gen_random_uuid(), v_article_id, 'LIST', 8, jsonb_build_object('text', $txt$1. Beristirahatlah di ruangan yang tenang, redup, dan sejuk selama 20 sampai 30 menit.
2. Minum air putih yang cukup — dehidrasi ringan adalah pemicu yang sering diremehkan.
3. Kompres dingin di dahi untuk migrain, atau kompres hangat di leher dan bahu untuk sakit kepala tegang.
4. Lakukan relaksasi: tarik napas dalam perlahan, regangkan leher dan bahu yang kaku.
5. Obat pereda nyeri bebas (seperti parasetamol) boleh digunakan sesuai aturan pakai pada kemasan — jangan melebihi dosis dan jangan dipakai setiap hari dalam jangka panjang.
6. Hindari pemicu yang sudah teridentifikasi dari catatan Anda, misalnya begadang atau melewatkan makan.$txt$)),
  (gen_random_uuid(), v_article_id, 'HEADING', 9, jsonb_build_object('text', $txt$Risiko: Tanda Bahaya yang Wajib Diwaspadai$txt$)),
  (gen_random_uuid(), v_article_id, 'LIST', 10, jsonb_build_object('text', $txt$Segera ke dokter atau IGD jika mengalami salah satu dari ini:
1. Sakit kepala tiba-tiba sangat hebat, seperti belum pernah dirasakan sebelumnya.
2. Disertai demam tinggi dan kaku leher.
3. Disertai gangguan bicara, penglihatan ganda, kelemahan separuh tubuh, atau kejang.
4. Terjadi setelah cedera atau benturan di kepala.
5. Tidak membaik setelah beberapa hari atau frekuensinya makin sering dan makin berat.
6. Muncul pertama kali pada usia di atas 50 tahun dengan pola yang tidak biasa.
Tanda-tanda ini bisa menunjukkan kondisi serius seperti perdarahan otak, infeksi selaput otak, atau stroke.$txt$)),
  (gen_random_uuid(), v_article_id, 'HEADING', 11, jsonb_build_object('text', $txt$Pemeriksaan Hasil$txt$)),
  (gen_random_uuid(), v_article_id, 'PARAGRAPH', 12, jsonb_build_object('text', $txt$Evaluasi setelah dua minggu menerapkan langkah di atas: apakah frekuensi sakit kepala berkurang, apakah pemicu utamanya sudah teridentifikasi, dan apakah penanganan mandiri cukup meredakan. Jika sakit kepala masih sering kambuh meski pemicu sudah dihindari, atau Anda membutuhkan obat pereda nyeri lebih dari dua kali seminggu, jadwalkan konsultasi ke dokter untuk evaluasi lebih lanjut. Catatan penting: artikel ini bersifat informasi umum dan bukan pengganti nasihat medis profesional. Jika ragu, selalu konsultasikan kondisi Anda ke dokter atau tenaga kesehatan.$txt$));
END $do$;

DO $do$
DECLARE v_article_id uuid;
BEGIN
  INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, status, created_by, updated_by)
  VALUES (gen_random_uuid(), 'EXP-GEOGRAFI4-001', 'c6000001-0000-0000-0000-000000000001',
    'Gurun: Bukan Sekadar Pasir', 'gurun-bukan-sekadar-pasir',
    'Mengenal gurun lebih dalam: definisi ilmiahnya, jenis-jenis gurun panas dan dingin, proses terbentuknya, kehidupan yang beradaptasi, hingga ancaman desertifikasi.',
    'id', 6, 'DRAFT', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
  ON CONFLICT (business_code) DO NOTHING;
  SELECT id INTO v_article_id FROM madevi.articles WHERE business_code = 'EXP-GEOGRAFI4-001';
  DELETE FROM madevi.article_blocks WHERE article_id = v_article_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
  (gen_random_uuid(), v_article_id, 'HEADING', 1, jsonb_build_object('text', $txt$Gurun: Bukan Sekadar Pasir$txt$)),
  (gen_random_uuid(), v_article_id, 'PARAGRAPH', 2, jsonb_build_object('text', $txt$Mendengar kata gurun, kebanyakan orang membayangkan hamparan pasir panas yang tak berujung. Padahal definisi ilmiah gurun tidak ada hubungannya dengan pasir atau panas: gurun adalah wilayah dengan curah hujan sangat rendah, kurang dari 250 milimeter per tahun. Sekitar sepertiga permukaan daratan Bumi adalah gurun, dan sebagian di antaranya justru dingin dan membeku.$txt$)),
  (gen_random_uuid(), v_article_id, 'HEADING', 3, jsonb_build_object('text', $txt$Jenis-jenis Gurun$txt$)),
  (gen_random_uuid(), v_article_id, 'PARAGRAPH', 4, jsonb_build_object('text', $txt$Gurun panas seperti Sahara di Afrika dan Arab memiliki suhu siang yang ekstrem tetapi malam yang dingin. Gurun dingin seperti Gobi di Mongolia dan Tiongkok mengalami musim dingin bersalju. Gurun pesisir seperti Atacama di Chili adalah tempat terkering di Bumi karena pengaruh arus laut dingin, sebagian wilayahnya tidak hujan selama puluhan tahun. Dan gurun terbesar di dunia sebenarnya adalah Antartika — gurun kutub yang hampir seluruhnya es, tetapi curah hujannya sangat minim.$txt$)),
  (gen_random_uuid(), v_article_id, 'HEADING', 5, jsonb_build_object('text', $txt$Mengapa Gurun Terbentuk$txt$)),
  (gen_random_uuid(), v_article_id, 'PARAGRAPH', 6, jsonb_build_object('text', $txt$Tiga mekanisme utama menciptakan gurun. Pertama, sabuk tekanan tinggi subtropis di sekitar 30 derajat lintang utara dan selatan membuat udara turun dan menghangat sehingga awan sulit terbentuk — inilah yang menciptakan Sahara dan gurun Australia. Kedua, efek bayangan hujan: pegunungan menghalangi awan sehingga sisi di baliknya kering, seperti Gurun Gobi di balik Himalaya. Ketiga, arus laut dingin mendinginkan udara di atasnya sehingga kelembapan mengembun sebelum mencapai darat, menciptakan gurun pesisir seperti Atacama dan Namib.$txt$)),
  (gen_random_uuid(), v_article_id, 'HEADING', 7, jsonb_build_object('text', $txt$Kehidupan yang Beradaptasi$txt$)),
  (gen_random_uuid(), v_article_id, 'PARAGRAPH', 8, jsonb_build_object('text', $txt$Gurun bukan tanah mati. Kaktus menyimpan air di batangnya yang tebal dan membuka pori daun hanya di malam hari untuk mengurangi penguapan. Unta menyimpan lemak di punuknya sebagai cadangan energi dan dapat bertahan berhari-hari tanpa minum. Rubah fennec memiliki telinga besar untuk melepaskan panas tubuh. Di titik-titik air tanah muncul oasis — kantong kehidupan tempat tumbuhan dan manusia bertahan di tengah gurun.$txt$)),
  (gen_random_uuid(), v_article_id, 'HEADING', 9, jsonb_build_object('text', $txt$Gurun dan Manusia$txt$)),
  (gen_random_uuid(), v_article_id, 'PARAGRAPH', 10, jsonb_build_object('text', $txt$Peradaban besar tumbuh di tepi gurun: Mesir di tepi Sahara, kota-kota jalur sutra di tepi Gobi. Kini gurun menjadi lokasi pembangkit listrik tenaga surya raksasa karena paparan mataharinya yang melimpah. Namun gurun juga meluas akibat ulah manusia — penggundulan hutan dan pertanian berlebihan mengubah lahan subur menjadi gurun dalam proses yang disebut desertifikasi. Memahami gurun berarti memahami bahwa batas antara subur dan tandus lebih tipis dari yang kita kira.$txt$));
END $do$;

DO $do$
DECLARE v_article_id uuid;
BEGIN
  INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, status, created_by, updated_by)
  VALUES (gen_random_uuid(), 'EXP-TEKNOLOGI6-001', 'c7777777-7777-7777-7777-777777777777',
    'Robotika: Dari Pabrik ke Rumah', 'robotika-dari-pabrik-ke-rumah',
    'Perjalanan robot dari lengan mekanik pabrik mobil tahun 1961 hingga robot penyedot debu di ruang tamu, plus masa depan dan tantangannya.',
    'id', 6, 'DRAFT', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
  ON CONFLICT (business_code) DO NOTHING;
  SELECT id INTO v_article_id FROM madevi.articles WHERE business_code = 'EXP-TEKNOLOGI6-001';
  DELETE FROM madevi.article_blocks WHERE article_id = v_article_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
  (gen_random_uuid(), v_article_id, 'HEADING', 1, jsonb_build_object('text', $txt$Robotika: Dari Pabrik ke Rumah$txt$)),
  (gen_random_uuid(), v_article_id, 'PARAGRAPH', 2, jsonb_build_object('text', $txt$Robot bukan sekadar mesin berbentuk manusia seperti di film. Definisi teknisnya sederhana: mesin yang dapat merasakan lingkungannya melalui sensor, memproses informasi, lalu bertindak untuk mencapai tujuan. Dengan definisi ini, robot penyedot debu yang memetakan ruangan Anda adalah robot sejati, sama seperti lengan mekanik raksasa di pabrik mobil.$txt$)),
  (gen_random_uuid(), v_article_id, 'HEADING', 3, jsonb_build_object('text', $txt$Sejarah Singkat Robot$txt$)),
  (gen_random_uuid(), v_article_id, 'PARAGRAPH', 4, jsonb_build_object('text', $txt$Robot industri pertama, Unimate, mulai bekerja di pabrik General Motors pada tahun 1961 untuk mengangkat logam panas yang berbahaya bagi manusia. Selama puluhan tahun robot hanya hidup di pabrik: mengelas, mengecat, dan merakit dengan presisi yang tak bisa ditandingi tangan manusia. Baru pada era 2000-an robot mulai keluar dari pabrik berkat sensor yang makin murah dan komputasi yang makin kuat.$txt$)),
  (gen_random_uuid(), v_article_id, 'HEADING', 5, jsonb_build_object('text', $txt$Robot di Industri$txt$)),
  (gen_random_uuid(), v_article_id, 'PARAGRAPH', 6, jsonb_build_object('text', $txt$Di pabrik modern, lengan robot merakit mobil dengan ketelitian sepersekian milimeter, bekerja 24 jam tanpa lelah. Robot gudang mengambil dan mengemas barang ribuan kali sehari. Robot bedah membantu dokter melakukan operasi dengan sayatan lebih kecil dan presisi lebih tinggi. Keunggulan robot industri bukan kecerdasan, melainkan konsistensi: ia mengulang gerakan yang sama persis jutaan kali tanpa kesalahan.$txt$)),
  (gen_random_uuid(), v_article_id, 'HEADING', 7, jsonb_build_object('text', $txt$Robot Masuk ke Rumah$txt$)),
  (gen_random_uuid(), v_article_id, 'PARAGRAPH', 8, jsonb_build_object('text', $txt$Robot rumah tangga pertama yang sukses adalah penyedot debu otomatis yang memetakan ruangan dengan sensor dan kembali sendiri ke dok pengisian daya. Kini ada robot pel, robot pemotong rumput, dan asisten berbentuk speaker yang menjawab perintah suara. Robot edukasi mengajarkan anak memprogram dengan cara bermain. Perbedaan utama robot rumah dengan robot pabrik: ia harus aman berada di dekat manusia yang tidak terlatih, termasuk anak kecil dan hewan peliharaan.$txt$)),
  (gen_random_uuid(), v_article_id, 'HEADING', 9, jsonb_build_object('text', $txt$Masa Depan dan Tantangan$txt$)),
  (gen_random_uuid(), v_article_id, 'PARAGRAPH', 10, jsonb_build_object('text', $txt$Kombinasi robotika dengan kecerdasan buatan melahirkan robot humanoid yang bisa berjalan, membawa barang, dan memahami perintah bahasa sehari-hari. Tantangannya besar: baterai yang tahan lama, tangan robot yang selentur tangan manusia, dan pertanyaan etika — siapa bertanggung jawab jika robot otonom membuat kesalahan, dan bagaimana melindungi lapangan kerja manusia. Satu hal pasti: robot tidak lagi hanya milik pabrik, ia sedang menjadi bagian dari kehidupan sehari-hari.$txt$));
END $do$;

DO $do$
DECLARE v_article_id uuid;
BEGIN
  INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, status, created_by, updated_by)
  VALUES (gen_random_uuid(), 'SCH-SMP-IPA3-001', 'd4444444-4444-4444-4444-444444444444',
    'IPA Kelas 8: Sistem Pencernaan', 'ipa-kelas-8-sistem-pencernaan',
    'Materi IPA kelas 8: organ-organ sistem pencernaan manusia, pencernaan mekanik dan kimiawi, enzim-enzim penting, gangguan pencernaan, latihan soal, dan kunci jawaban.',
    'id', 9, 'DRAFT', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
  ON CONFLICT (business_code) DO NOTHING;
  SELECT id INTO v_article_id FROM madevi.articles WHERE business_code = 'SCH-SMP-IPA3-001';
  DELETE FROM madevi.article_blocks WHERE article_id = v_article_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
  (gen_random_uuid(), v_article_id, 'HEADING', 1, jsonb_build_object('text', $txt$Tujuan Pembelajaran$txt$)),
  (gen_random_uuid(), v_article_id, 'LIST', 2, jsonb_build_object('text', $txt$Setelah mempelajari materi ini, kamu diharapkan mampu:
1. Menyebutkan organ-organ penyusun sistem pencernaan manusia secara berurutan.
2. Menjelaskan fungsi masing-masing organ pencernaan.
3. Membedakan pencernaan mekanik dan pencernaan kimiawi beserta contohnya.
4. Menyebutkan enzim-enzim pencernaan dan fungsinya.$txt$)),
  (gen_random_uuid(), v_article_id, 'HEADING', 3, jsonb_build_object('text', $txt$Pengertian Sistem Pencernaan$txt$)),
  (gen_random_uuid(), v_article_id, 'PARAGRAPH', 4, jsonb_build_object('text', $txt$Sistem pencernaan adalah rangkaian organ yang bekerja sama mengubah makanan yang kita makan menjadi sari-sari makanan berukuran kecil sehingga dapat diserap darah dan diedarkan ke seluruh tubuh sebagai sumber energi dan bahan pembangun sel. Sisa makanan yang tidak tercerna kemudian dikeluarkan sebagai kotoran.$txt$)),
  (gen_random_uuid(), v_article_id, 'HEADING', 5, jsonb_build_object('text', $txt$Organ-organ Pencernaan$txt$)),
  (gen_random_uuid(), v_article_id, 'LIST', 6, jsonb_build_object('text', $txt$1. Mulut: makanan dikunyah gigi dan dicampur air liur yang mengandung enzim amilase untuk mencerna karbohidrat.
2. Kerongkongan: menyalurkan makanan ke lambung dengan gerakan meremas yang disebut gerak peristaltik.
3. Lambung: mengaduk makanan dan mencernanya dengan asam lambung serta enzim pepsin yang memecah protein.
4. Usus halus: tempat utama penyerapan sari makanan; dibantu enzim dari pankreas (amilase, lipase, tripsin) dan cairan empedu dari hati yang memecah lemak.
5. Usus besar: menyerap air dan mineral dari sisa makanan.
6. Rektum dan anus: menampung dan mengeluarkan sisa pencernaan.$txt$)),
  (gen_random_uuid(), v_article_id, 'HEADING', 7, jsonb_build_object('text', $txt$Pencernaan Mekanik dan Kimiawi$txt$)),
  (gen_random_uuid(), v_article_id, 'PARAGRAPH', 8, jsonb_build_object('text', $txt$Pencernaan mekanik adalah proses fisik memperkecil makanan: mengunyah di mulut, mengaduk di lambung, dan gerak peristaltik di sepanjang saluran cerna. Pencernaan kimiawi adalah penguraian zat makanan oleh enzim menjadi molekul sederhana: amilase mengubah karbohidrat menjadi gula sederhana, pepsin dan tripsin mengubah protein menjadi asam amino, dan lipase mengubah lemak menjadi asam lemak dan gliserol. Keduanya selalu bekerja bersama — makanan harus diperkecil dulu secara mekanik agar enzim bisa bekerja efektif.$txt$)),
  (gen_random_uuid(), v_article_id, 'HEADING', 9, jsonb_build_object('text', $txt$Gangguan Sistem Pencernaan$txt$)),
  (gen_random_uuid(), v_article_id, 'PARAGRAPH', 10, jsonb_build_object('text', $txt$Gangguan yang umum antara lain maag (radang lambung), diare, sembelit, dan usus buntu. Sistem pencernaan dapat dijaga dengan makan makanan berserat, minum air yang cukup, makan teratur, mencuci tangan sebelum makan, dan menghindari jajan sembarangan. Jika gangguan berlangsung lebih dari beberapa hari atau disertai gejala berat, segera periksakan diri ke puskesmas atau dokter.$txt$)),
  (gen_random_uuid(), v_article_id, 'HEADING', 11, jsonb_build_object('text', $txt$Latihan Soal$txt$)),
  (gen_random_uuid(), v_article_id, 'LIST', 12, jsonb_build_object('text', $txt$1. Urutkan organ yang dilalui makanan dari mulut hingga anus!
   Kunci: mulut - kerongkongan - lambung - usus halus - usus besar - rektum - anus.
2. Jelaskan perbedaan pencernaan mekanik dan kimiawi beserta satu contoh masing-masing!
   Kunci: mekanik = proses fisik memperkecil makanan (contoh: mengunyah); kimiawi = penguraian oleh enzim (contoh: amilase mencerna karbohidrat di mulut).
3. Enzim apa yang dihasilkan lambung dan apa fungsinya?
   Kunci: pepsin, berfungsi memecah protein menjadi pepton (dibantu asam lambung).$txt$));
END $do$;

DO $do$
DECLARE v_article_id uuid;
BEGIN
  INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, status, created_by, updated_by)
  VALUES (gen_random_uuid(), 'SCH-SD-PENJAS2-001', 'd3333333-3333-3333-3333-333333333333',
    'Penjas Kelas 5: Permainan Bola Besar', 'penjas-kelas-5-permainan-bola-besar',
    'Materi Penjas kelas 5: mengenal permainan bola besar (sepak bola, bola voli, bola basket), gerak dasar masing-masing, kerja sama tim, sportivitas, dan keselamatan berlatih.',
    'id', 8, 'DRAFT', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
  ON CONFLICT (business_code) DO NOTHING;
  SELECT id INTO v_article_id FROM madevi.articles WHERE business_code = 'SCH-SD-PENJAS2-001';
  DELETE FROM madevi.article_blocks WHERE article_id = v_article_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
  (gen_random_uuid(), v_article_id, 'HEADING', 1, jsonb_build_object('text', $txt$Tujuan Pembelajaran$txt$)),
  (gen_random_uuid(), v_article_id, 'LIST', 2, jsonb_build_object('text', $txt$Setelah mempelajari materi ini, kamu diharapkan mampu:
1. Menyebutkan tiga jenis permainan bola besar beserta ciri-cirinya.
2. Mempraktikkan gerak dasar sepak bola, bola voli, dan bola basket dengan benar.
3. Menunjukkan kerja sama tim dan sportivitas saat bermain.
4. Menerapkan aturan keselamatan saat berlatih dan bertanding.$txt$)),
  (gen_random_uuid(), v_article_id, 'HEADING', 3, jsonb_build_object('text', $txt$Apa Itu Permainan Bola Besar$txt$)),
  (gen_random_uuid(), v_article_id, 'PARAGRAPH', 4, jsonb_build_object('text', $txt$Permainan bola besar adalah cabang olahraga yang menggunakan bola berukuran besar dan dimainkan secara beregu. Tiga yang paling populer adalah sepak bola, bola voli, dan bola basket. Ketiganya melatih kekuatan, kelincahan, ketepatan, dan yang paling penting: kerja sama tim. Tidak ada pemain yang bisa menang sendirian dalam permainan beregu.$txt$)),
  (gen_random_uuid(), v_article_id, 'HEADING', 5, jsonb_build_object('text', $txt$Gerak Dasar Sepak Bola$txt$)),
  (gen_random_uuid(), v_article_id, 'LIST', 6, jsonb_build_object('text', $txt$1. Menendang (kicking): gunakan kaki bagian dalam untuk umpan akurat, punggung kaki untuk tendangan keras.
2. Menggiring (dribbling): membawa bola sambil berlari dengan sentuhan-sentuhan kecil agar bola tetap dekat.
3. Menghentikan bola (stopping): menahan laju bola dengan kaki bagian dalam atau telapak kaki.
4. Menyundul (heading): memantulkan bola dengan dahi, bukan dengan ubun-ubun kepala.$txt$)),
  (gen_random_uuid(), v_article_id, 'HEADING', 7, jsonb_build_object('text', $txt$Gerak Dasar Bola Voli$txt$)),
  (gen_random_uuid(), v_article_id, 'LIST', 8, jsonb_build_object('text', $txt$1. Servis: pukulan awal untuk memulai permainan, bisa servis bawah (lebih mudah) atau servis atas.
2. Passing bawah: menerima bola dengan kedua lengan yang dirapatkan, perkenaan di lengan bawah.
3. Passing atas: mengumpan bola dengan ujung jari-jari kedua tangan di atas dahi.
4. Smash: pukulan keras menukik ke daerah lawan untuk mencetak angka.
5. Blocking: melompat di dekat net untuk menahan smash lawan.$txt$)),
  (gen_random_uuid(), v_article_id, 'HEADING', 9, jsonb_build_object('text', $txt$Gerak Dasar Bola Basket$txt$)),
  (gen_random_uuid(), v_article_id, 'LIST', 10, jsonb_build_object('text', $txt$1. Dribbling: memantulkan bola ke lantai sambil berjalan atau berlari, bergantian tangan kanan dan kiri.
2. Passing: mengoper bola ke teman — chest pass (dari dada), bounce pass (memantul ke lantai), dan overhead pass (dari atas kepala).
3. Shooting: menembak bola ke ring, awali dari jarak dekat sebelum mencoba jarak jauh.
4. Pivot: berputar dengan satu kaki sebagai tumpuan sambil memegang bola.$txt$)),
  (gen_random_uuid(), v_article_id, 'HEADING', 11, jsonb_build_object('text', $txt$Latihan, Keselamatan, dan Sportivitas$txt$)),
  (gen_random_uuid(), v_article_id, 'LIST', 12, jsonb_build_object('text', $txt$1. Selalu lakukan pemanasan 5 sampai 10 menit sebelum bermain agar otot tidak kaget.
2. Gunakan lapangan dan peralatan yang aman; singkirkan benda berbahaya di sekitar area bermain.
3. Minum air putih saat istirahat dan hentikan permainan jika merasa pusing atau nyeri.
4. Junjung sportivitas: patuhi aturan, hormati wasit dan lawan, berjabat tangan setelah bertanding menang maupun kalah.
Latihan mandiri: pilih satu gerak dasar (misalnya passing bawah bola voli), latih 15 menit setiap hari selama seminggu, lalu catat perkembanganmu — berapa kali berhasil berturut-turut pada hari pertama dibanding hari ketujuh.$txt$));
END $do$;
