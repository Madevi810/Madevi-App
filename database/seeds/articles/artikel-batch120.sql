-- Batch 120: 6 artikel (idempoten)
-- Dibuat: 2026-10-13

-- TUT-ELEKTRONIK30-001: ESP32: WiFi dan Bluetooth dalam Satu Chip
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('e120c04d-0544-4872-866e-896d04bd4397', 'TUT-ELEKTRONIK30-001', 'b4444444-4444-4444-4444-444444444444', 'ESP32: WiFi dan Bluetooth dalam Satu Chip', 'esp32-wifi-dan-bluetooth', 'Tutorial memakai mikrokontroler ESP32: fitur, persiapan, cara koneksi WiFi dan Bluetooth, contoh proyek, hingga troubleshooting.', 'id', 12, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;

DO $doblk$
DECLARE v_id uuid;
BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'TUT-ELEKTRONIK30-001';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', $txt$Masalah yang Diselesaikan ESP32$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 1, jsonb_build_object('text', $txt$ESP32 adalah mikrokontroler murah yang sudah memiliki WiFi dan Bluetooth di dalamnya. Dengan satu chip kecil seharga puluhan ribu rupiah, Anda bisa membuat lampu yang dikendalikan dari HP, sensor suhu yang mengirim data ke internet, atau pintu yang dibuka lewat Bluetooth. ESP32 memiliki dua core prosesor, puluhan pin GPIO, serta dukungan Arduino IDE, menjadikannya pintu masuk paling murah ke dunia Internet of Things (IoT).$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', $txt$Alat dan Bahan yang Dibutuhkan$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'LIST', 3, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Board ESP32 DevKit (30 pin)$li$,
      $li$Kabel data micro USB yang bagus (bukan kabel charge saja)$li$,
      $li$Komputer dengan Arduino IDE terinstal$li$,
      $li$Board manager ESP32 by Espressif$li$,
      $li$LED dan resistor 220 ohm (untuk latihan pertama)$li$,
      $li$Koneksi WiFi 2,4 GHz (ESP32 tidak mendukung 5 GHz)$li$
  ])));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 4, jsonb_build_object('text', $txt$Langkah 1: Instalasi dan Persiapan$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'LIST', 5, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Instal Arduino IDE dari situs resminya$li$,
      $li$Tambahkan URL board ESP32 di File > Preferences > Additional Boards Manager URLs$li$,
      $li$Instal "esp32 by Espressif Systems" dari Boards Manager$li$,
      $li$Colokkan ESP32, pilih board "ESP32 Dev Module" dan port yang benar$li$,
      $li$Coba sketch Blink bawaan untuk memastikan board terdeteksi$li$
  ])));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 6, jsonb_build_object('text', $txt$Langkah 2: Koneksi WiFi dan Bluetooth$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'CODE', 7, jsonb_build_object('text', $txt$#include <WiFi.h>
const char* ssid = "NamaWiFi";
const char* password = "PasswordWiFi";
void setup() {
  Serial.begin(115200);
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500); Serial.print(".");
  }
  Serial.println(WiFi.localIP());
}
void loop() {}$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 8, jsonb_build_object('text', $txt$Risiko dan Hal yang Perlu Diwaspadai$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'LIST', 9, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$ESP32 hanya bekerja pada WiFi 2,4 GHz, bukan 5 GHz$li$,
      $li$Pin ESP32 bekerja pada 3,3V, jangan beri tegangan 5V langsung ke pin GPIO$li$,
      $li$Gunakan catu daya yang stabil; USB laptop yang lemah bisa membuat ESP32 reset sendiri$li$,
      $li$Beberapa pin memiliki fungsi khusus saat booting, hindari pin 6-11 yang terhubung ke flash internal$li$
  ])));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 10, jsonb_build_object('text', $txt$Pemeriksaan Hasil dan Tindak Lanjut$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 11, jsonb_build_object('text', $txt$Anda berhasil jika monitor serial menampilkan alamat IP setelah ESP32 tersambung ke WiFi, dan perangkat Bluetooth ESP32 muncul di HP (coba contoh sketch "SerialToSerialBT" untuk Bluetooth Classic, atau library BLE untuk yang hemat daya). Langkah berikutnya: buat web server sederhana di ESP32 untuk menyalakan LED dari browser HP, lalu kembangkan ke sensor DHT22 dan pengiriman data ke platform IoT gratis.$txt$));
END$doblk$;

-- TUT-MASAK35-001: Pempek: Resep Khas Palembang yang Kenyal
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('e1200443-3dab-4ded-9ebd-c59c34f2bd03', 'TUT-MASAK35-001', 'b7777777-7777-7777-7777-777777777777', 'Pempek: Resep Khas Palembang yang Kenyal', 'pempek-resep-palembang', 'Resep pempek ikan tenggiri khas Palembang: adonan kenyal, cuko pedas manis, dan tips agar tidak alot.', 'id', 10, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;

DO $doblk$
DECLARE v_id uuid;
BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'TUT-MASAK35-001';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', $txt$Masalah: Pempek Keras atau Amis$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 1, jsonb_build_object('text', $txt$Pempek yang gagal biasanya keras seperti karet, amis, atau hancur saat direbus. Padahal kunci pempek enak hanya tiga: ikan tenggiri segar yang dingin, perbandingan sagu yang tepat, dan pengulenan searah hingga kalis. Cuko dibuat dari gula aren asli Palembang agar rasanya pekat dan tidak sekadar manis.$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', $txt$Bahan-bahan$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'LIST', 3, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$500 gram daging ikan tenggiri giling (dingin dari kulkas)$li$,
      $li$300 gram sagu tani berkualitas baik$li$,
      $li$200 ml air es$li$,
      $li$2 butir telur untuk isian pempek kapal selam$li$,
      $li$4 siung bawang putih halus, garam dan gula secukupnya$li$,
      $li$Bahan cuko: 250 gram gula aren, 5 cabai rawit, 3 siung bawang putih, asam jawa, garam$li$
  ])));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 4, jsonb_build_object('text', $txt$Langkah 1: Membuat Adonan$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'LIST', 5, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Campur ikan giling dingin dengan air es, garam, dan bawang putih$li$,
      $li$Aduk searah dengan sendok kayu hingga lengket dan kalis$li$,
      $li$Masukkan sagu sedikit demi sedikit sambil diaduk perlahan$li$,
      $li$Berhenti saat adonan bisa dibentuk; jangan tambahkan sagu berlebihan$li$
  ])));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 6, jsonb_build_object('text', $txt$Langkah 2: Merebus, Menggoreng, dan Membuat Cuko$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'LIST', 7, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Bentuk lenjer: gulung adonan memanjang sebesar jempol$li$,
      $li$Bentuk kapal selam: buat cekungan, isi telur, tutup rapat$li$,
      $li$Rebus dalam air mendidih hingga pempek mengapung, angkat dan tiriskan$li$,
      $li$Goreng dalam minyak panas hingga kuning keemasan sebelum disajikan$li$,
      $li$Cuko: rebus gula aren, air, asam jawa, dan garam hingga larut; masukkan cabai rawit dan bawang putih halus, masak hingga agak mengental$li$,
      $li$Saring dan dinginkan; cuko yang baik berwarna cokelat gelap dengan rasa pedas, asam, dan manis seimbang$li$
  ])));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 8, jsonb_build_object('text', $txt$Risiko dan Kesalahan Umum$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'LIST', 9, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Terlalu banyak sagu membuat pempek keras dan alot$li$,
      $li$Menguleni terlalu lama setelah sagu masuk membuat adonan liat$li$,
      $li$Air rebusan kurang mendidih membuat pempek lembek dan hancur$li$,
      $li$Ikan tidak segar atau bersuhu ruang membuat adonan amis$li$
  ])));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 10, jsonb_build_object('text', $txt$Pemeriksaan Hasil dan Penyajian$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 11, jsonb_build_object('text', $txt$Pempek berhasil jika kenyal saat digigit, tidak alot, dan tidak amis. Sajikan dengan cuko hangat, irisan timun, dan mie kuning. Sisa pempek rebus bisa disimpan di freezer hingga dua minggu; goreng langsung dari beku dengan api sedang.$txt$));
END$doblk$;

-- EXP-KIMIA53-001: Emas: Logam Mulia yang Tidak Berkarat
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('e1204f02-4ce5-4e9a-a5ff-26dff214f973', 'EXP-KIMIA53-001', 'c4444444-4444-4444-4444-444444444444', 'Emas: Logam Mulia yang Tidak Berkarat', 'emas-logam-mulia-2', 'Mengenal emas: sifat kimia, asal usul dari bintang, kadar karat, hingga perannya dalam ekonomi dan teknologi.', 'id', 8, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;

DO $doblk$
DECLARE v_id uuid;
BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-KIMIA53-001';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', $txt$Apa Itu Emas?$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 1, jsonb_build_object('text', $txt$Emas adalah unsur kimia dengan simbol Au (dari bahasa Latin aurum) dan nomor atom 79. Ia termasuk logam mulia karena sangat tahan terhadap korosi dan reaksi kimia: emas tidak berkarat seperti besi dan tidak menghitam seperti perak. Sifat inilah yang membuatnya berharga sejak ribuan tahun lalu.$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', $txt$Sifat Fisika yang Istimewa$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 3, jsonb_build_object('text', $txt$Emas adalah logam yang paling mudah ditempa di dunia. Satu gram emas bisa dipipihkan menjadi lembaran seluas satu meter persegi, atau ditarik menjadi kawat sepanjang tiga kilometer. Emas murni berwarna kuning mengilap, lunak, dan merupakan penghantar listrik yang sangat baik.$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 4, jsonb_build_object('text', $txt$Dari Mana Emas Berasal?$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 5, jsonb_build_object('text', $txt$Emas tidak terbentuk di Bumi. Para ilmuwan meyakini emas terbentuk dari tabrakan bintang neutron di luar angkasa, lalu terbawa ke Bumi oleh meteorit miliaran tahun lalu. Inilah sebabnya emas langka: seluruh emas yang pernah ditambang manusia hanya cukup mengisi sekitar tiga kolam renang ukuran Olimpiade.$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 6, jsonb_build_object('text', $txt$Memahami Kadar Karat$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 7, jsonb_build_object('text', $txt$Kadar emas dinyatakan dalam karat. Emas 24 karat berarti emas murni 99,9 persen, tetapi terlalu lunak untuk perhiasan. Emas 22 karat, 18 karat, hingga 14 karat adalah campuran emas dengan logam lain seperti tembaga atau perak agar lebih keras. Semakin tinggi karat, semakin murni dan semakin mahal.$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 8, jsonb_build_object('text', $txt$Emas dalam Kehidupan Modern$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 9, jsonb_build_object('text', $txt$Selain perhiasan dan investasi, emas dipakai dalam industri elektronik karena tidak berkarat: kontak konektor, chip komputer, dan komponen HP memakai lapisan emas tipis. Emas juga dipakai dalam kedokteran gigi, satelit antariksa, dan bahkan terapi medis tertentu.$txt$));
END$doblk$;

-- EXP-SEJARAH36-001: Proklamasi Kemerdekaan Indonesia 17 Agustus 1945
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('e120894c-127d-47cc-a5f6-3133b7de42a3', 'EXP-SEJARAH36-001', 'c8888888-8888-8888-8888-888888888888', 'Proklamasi Kemerdekaan Indonesia 17 Agustus 1945', 'proklamasi-kemerdekaan', 'Kisah di balik Proklamasi 17 Agustus 1945: dari Rengasdengklok hingga pembacaan teks di Pegangsaan Timur.', 'id', 8, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;

DO $doblk$
DECLARE v_id uuid;
BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-SEJARAH36-001';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', $txt$Latar Belakang: Kekosongan Kekuasaan$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 1, jsonb_build_object('text', $txt$Pada Agustus 1945, Jepang menyerah kepada Sekutu setelah bom atom dijatuhkan di Hiroshima dan Nagasaki. Kekalahan Jepang menciptakan kekosongan kekuasaan di Indonesia. Para pemuda mendesak Soekarno-Hatta segera memproklamasikan kemerdekaan tanpa menunggu janji Jepang.$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', $txt$Peristiwa Rengasdengklok$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 3, jsonb_build_object('text', $txt$Pada 16 Agustus 1945 dini hari, para pemuda membawa Soekarno dan Hatta ke Rengasdengklok, Karawang. Tujuannya memastikan keduanya tidak terpengaruh Jepang dan mau memproklamasikan kemerdekaan secepatnya. Setelah tercapai kesepakatan, mereka kembali ke Jakarta malam harinya.$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 4, jsonb_build_object('text', $txt$Perumusan Teks Proklamasi$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 5, jsonb_build_object('text', $txt$Teks proklamasi dirumuskan pada malam 16 Agustus di rumah Laksamana Maeda, Jalan Imam Bonjol nomor 1, Jakarta. Soekarno, Hatta, dan Ahmad Soebardjo menyusun kalimatnya, lalu Sayuti Melik mengetik naskah final. Teksnya singkat namun padat, diakhiri tanggal dan nama Soekarno-Hatta.$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 6, jsonb_build_object('text', $txt$Detik-detik Pembacaan$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 7, jsonb_build_object('text', $txt$Pada 17 Agustus 1945 pukul 10.00 WIB, Soekarno membacakan teks Proklamasi di halaman rumahnya di Jalan Pegangsaan Timur nomor 56, Jakarta, didampingi Hatta. Bendera Merah Putih dikibarkan oleh Latief Hendraningrat dan Suhud, diiringi lagu Indonesia Raya.$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 8, jsonb_build_object('text', $txt$Makna Proklamasi bagi Indonesia$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 9, jsonb_build_object('text', $txt$Proklamasi menandai lahirnya Negara Kesatuan Republik Indonesia sebagai negara merdeka dan berdaulat. Sejak saat itu, 17 Agustus diperingati sebagai Hari Kemerdekaan Indonesia setiap tahun. Proklamasi juga menjadi titik awal perjuangan mempertahankan kemerdekaan dari upaya penjajahan kembali.$txt$));
END$doblk$;

-- SCH-SMA-BIO8-001: Biologi Kelas 12: Genetika dan Pewarisan Sifat
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('e120611c-1716-48f2-9108-0a8e750c3401', 'SCH-SMA-BIO8-001', 'd5555555-5555-5555-5555-555555555555', 'Biologi Kelas 12: Genetika dan Pewarisan Sifat', 'biologi-kelas-12-genetika', 'Materi genetika kelas 12: hukum Mendel, persilangan monohibrid dan dihibrid, hingga penyimpangan semu hukum Mendel.', 'id', 15, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;

DO $doblk$
DECLARE v_id uuid;
BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'SCH-SMA-BIO8-001';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', $txt$Tujuan Pembelajaran$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 1, jsonb_build_object('text', $txt$Setelah mempelajari materi ini, siswa diharapkan mampu menjelaskan konsep gen dan alel, menerapkan hukum Mendel dalam persilangan, menghitung rasio fenotipe dan genotipe, serta menganalisis penyimpangan semu hukum Mendel.$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', $txt$Gen, Alel, dan Kromosom$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 3, jsonb_build_object('text', $txt$Gen adalah unit pewarisan sifat yang terletak di kromosom. Setiap individu memiliki dua salinan gen (alel) untuk tiap sifat, satu dari ayah dan satu dari ibu. Alel dominan (misal A) menutupi alel resesif (a). Kombinasi alel disebut genotipe, sedangkan sifat yang tampak disebut fenotipe.$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 4, jsonb_build_object('text', $txt$Hukum I dan II Mendel$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 5, jsonb_build_object('text', $txt$Hukum I (segregasi): pasangan alel memisah saat pembentukan gamet. Pada Aa x Aa dihasilkan rasio genotipe 1 AA : 2 Aa : 1 aa dan rasio fenotipe 3 : 1. Hukum II (pengelompokan bebas): alel dari gen berbeda mengelompok bebas saat pembentukan gamet; pada AaBb x AaBb dihasilkan rasio fenotipe klasik 9 : 3 : 3 : 1 untuk gen pada kromosom berbeda.$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 6, jsonb_build_object('text', $txt$Contoh Soal Persilangan$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'EXAMPLE', 7, jsonb_build_object('text', $txt$Kacang ercis berbiji bulat kuning (BBKK) disilangkan dengan berbiji keriput hijau (bbkk). Bulat (B) dominan terhadap keriput (b), kuning (K) dominan terhadap hijau (k). Tentukan rasio fenotipe F2! Jawab: F1 semuanya BbKk (bulat kuning). F2 menghasilkan rasio 9 bulat kuning : 3 bulat hijau : 3 keriput kuning : 1 keriput hijau.$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 8, jsonb_build_object('text', $txt$Penyimpangan Semu Hukum Mendel$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'LIST', 9, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Epistasis: satu gen menutupi ekspresi gen lain, rasio 12:3:1 atau 9:3:4$li$,
      $li$Kriptomeri: gen saling menutupi hingga sifat induk muncul kembali, rasio 9:3:4$li$,
      $li$Polimeri: beberapa gen bekerja sama menentukan satu sifat, rasio 15:1$li$,
      $li$Komplementer: dua gen saling melengkapi, rasio 9:7$li$
  ])));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 10, jsonb_build_object('text', $txt$Latihan Soal dan Kunci Jawaban$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'LIST', 11, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$1. Jelaskan perbedaan genotipe dan fenotipe! Jawab: genotipe = susunan alel (misal Aa); fenotipe = sifat tampak$li$,
      $li$2. Pada Aa x Aa, berapa persen keturunan homozigot? Jawab: 50 persen (25 persen AA + 25 persen aa)$li$,
      $li$3. Sebutkan tiga penyimpangan semu hukum Mendel! Jawab: epistasis 12:3:1, kriptomeri 9:3:4, polimeri 15:1$li$,
      $li$4. Mengapa hukum II Mendel tidak berlaku untuk gen terpaut? Jawab: gen terpaut cenderung diwariskan bersama$li$
  ])));
END$doblk$;

-- SCH-SD-IPS35-001: IPS Kelas 2: Gotong Royong di Lingkungan Sekitar
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('e120ac86-edf5-4a0b-a764-eb3a44e1b3d3', 'SCH-SD-IPS35-001', 'd3333333-3333-3333-3333-333333333333', 'IPS Kelas 2: Gotong Royong di Lingkungan Sekitar', 'ips-kelas-2-gotong-royong', 'Materi IPS kelas 2 SD: pengertian gotong royong, contoh kegiatan, dan manfaatnya dalam kehidupan sehari-hari.', 'id', 10, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;

DO $doblk$
DECLARE v_id uuid;
BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'SCH-SD-IPS35-001';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', $txt$Tujuan Pembelajaran$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 1, jsonb_build_object('text', $txt$Setelah belajar materi ini, adik-adik diharapkan bisa menjelaskan apa itu gotong royong, menyebutkan contoh kegiatan gotong royong di rumah dan sekolah, serta mau ikut bergotong royong dalam kehidupan sehari-hari.$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', $txt$Apa Itu Gotong Royong?$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 3, jsonb_build_object('text', $txt$Gotong royong adalah bekerja sama untuk mencapai tujuan bersama, kebiasaan baik bangsa Indonesia sejak zaman dahulu. Contohnya membersihkan kelas bersama teman-teman, atau membantu ibu membersihkan rumah.$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 4, jsonb_build_object('text', $txt$Contoh Gotong Royong di Rumah dan Sekolah$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'LIST', 5, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Membantu ibu mencuci piring setelah makan$li$,
      $li$Merapikan mainan bersama kakak atau adik$li$,
      $li$Menyiram tanaman bersama ayah di sore hari$li$,
      $li$Piket kelas membersihkan ruang kelas bersama$li$,
      $li$Kerja bakti membersihkan halaman sekolah$li$,
      $li$Membantu teman yang kesulitan membawa barang$li$
  ])));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 6, jsonb_build_object('text', $txt$Manfaat Gotong Royong$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 7, jsonb_build_object('text', $txt$Dengan gotong royong, pekerjaan berat menjadi ringan dan cepat selesai. Kita juga menjadi lebih akrab dengan teman dan tetangga, belajar tolong-menolong, dan lingkungan menjadi bersih dan nyaman.$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 8, jsonb_build_object('text', $txt$Latihan Soal$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'LIST', 9, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Apa yang dimaksud dengan gotong royong?$li$,
      $li$Sebutkan dua contoh gotong royong di rumah!$li$,
      $li$Sebutkan dua contoh gotong royong di sekolah!$li$,
      $li$Apa manfaat gotong royong bagi kita?$li$
  ])));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 10, jsonb_build_object('text', $txt$Kunci Jawaban$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'LIST', 11, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Gotong royong adalah bekerja sama untuk mencapai tujuan bersama$li$,
      $li$Contoh: membantu mencuci piring, merapikan mainan (jawaban bisa berbeda)$li$,
      $li$Contoh: piket kelas, kerja bakti sekolah (jawaban bisa berbeda)$li$,
      $li$Pekerjaan cepat selesai, persaudaraan erat, lingkungan bersih$li$
  ])));
END$doblk$;
