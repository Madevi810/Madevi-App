-- ============================================================
-- Madevi artikel batch 48 (idempoten, ON CONFLICT DO NOTHING)
-- 6 artikel: 2 Tutorial + 2 Explore + 2 School
-- ============================================================
BEGIN;

-- TUT-ELEKTRONIK6-001: Sensor Suhu DHT11 dengan Arduino: Ukur Suhu Ruangan Sendiri
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, access_level, is_indexed, status, owner_notes, attribution_type, version, is_test, created_by, updated_by)
VALUES ('e4800001-0000-4000-8000-000000000001', 'TUT-ELEKTRONIK6-001', 'b4444444-4444-4444-4444-444444444444', 'Sensor Suhu DHT11 dengan Arduino: Ukur Suhu Ruangan Sendiri', 'sensor-suhu-dht11-dengan-arduino', 'Panduan lengkap membaca suhu dan kelembaban memakai sensor DHT11 dan Arduino: dari wiring, instalasi library, sampai kode program dan troubleshooting.', 'id', 8, 'PUBLIC', true, 'DRAFT', 'Batch 48 autonomous content', 'DEVELOPED_BY', 1, false, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DELETE FROM madevi.article_blocks WHERE article_id = 'e4800001-0000-4000-8000-000000000001';
INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content)
VALUES (gen_random_uuid(), 'e4800001-0000-4000-8000-000000000001', 'HEADING', 1, '{"text": "Masalah: Ingin Membuat Alat Ukur Suhu tapi Bingung Mulai dari Mana"}'::jsonb)
ON CONFLICT DO NOTHING;
INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content)
VALUES (gen_random_uuid(), 'e4800001-0000-4000-8000-000000000001', 'PARAGRAPH', 2, '{"text": "Banyak proyek elektronik membutuhkan data suhu dan kelembaban: inkubator telur, pengering pakaian, monitoring ruangan server, sampai sistem penyiram tanaman otomatis. Sensor DHT11 adalah pilihan paling populer untuk pemula karena murah, mudah didapat, dan outputnya digital sehingga tidak perlu kalibrasi rumit. Artikel ini memandumu dari nol sampai sensor berhasil menampilkan angka suhu di layar komputer."}'::jsonb)
ON CONFLICT DO NOTHING;
INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content)
VALUES (gen_random_uuid(), 'e4800001-0000-4000-8000-000000000001', 'HEADING', 3, '{"text": "Mengenal Sensor DHT11"}'::jsonb)
ON CONFLICT DO NOTHING;
INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content)
VALUES (gen_random_uuid(), 'e4800001-0000-4000-8000-000000000001', 'PARAGRAPH', 4, '{"text": "DHT11 adalah sensor digital yang mengukur suhu dan kelembaban relatif udara. Spesifikasinya: rentang suhu 0 sampai 50 derajat Celsius dengan akurasi plus-minus 2 derajat, dan kelembaban 20 sampai 90 persen dengan akurasi plus-minus 5 persen. Ia hanya bisa dibaca maksimal sekali setiap 2 detik. Untuk kebutuhan presisi yang lebih tinggi, ada saudaranya DHT22 dengan rentang dan akurasi lebih baik, tetapi harganya lebih mahal."}'::jsonb)
ON CONFLICT DO NOTHING;
INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content)
VALUES (gen_random_uuid(), 'e4800001-0000-4000-8000-000000000001', 'HEADING', 5, '{"text": "Alat dan Bahan yang Dibutuhkan"}'::jsonb)
ON CONFLICT DO NOTHING;
INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content)
VALUES (gen_random_uuid(), 'e4800001-0000-4000-8000-000000000001', 'LIST', 6, '{"items": ["Board Arduino Uno (atau Nano) beserta kabel USB", "Sensor DHT11 (versi modul 3 pin lebih mudah dipakai)", "Kabel jumper male-to-male secukupnya", "Breadboard untuk merangkai tanpa solder", "Laptop atau PC dengan Arduino IDE terinstal", "Library DHT sensor library buatan Adafruit"]}'::jsonb)
ON CONFLICT DO NOTHING;
INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content)
VALUES (gen_random_uuid(), 'e4800001-0000-4000-8000-000000000001', 'HEADING', 7, '{"text": "Langkah 1 sampai 3: Merangkai Kabel (Wiring)"}'::jsonb)
ON CONFLICT DO NOTHING;
INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content)
VALUES (gen_random_uuid(), 'e4800001-0000-4000-8000-000000000001', 'PARAGRAPH', 8, '{"text": "Sambungkan pin VCC sensor ke 5V Arduino, pin GND ke GND, dan pin DATA ke pin digital 2 pada Arduino. Jika memakai sensor DHT11 telanjang (4 pin), tambahkan resistor pull-up 10 kilo-ohm antara VCC dan DATA agar sinyal stabil; versi modul biasanya sudah memilikinya. Periksa ulang setiap sambungan sebelum board dicolokkan ke USB, karena kabel yang salah tempat adalah penyebab kegagalan paling umum."}'::jsonb)
ON CONFLICT DO NOTHING;
INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content)
VALUES (gen_random_uuid(), 'e4800001-0000-4000-8000-000000000001', 'HEADING', 9, '{"text": "Langkah 4 sampai 6: Instal Library dan Upload Program"}'::jsonb)
ON CONFLICT DO NOTHING;
INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content)
VALUES (gen_random_uuid(), 'e4800001-0000-4000-8000-000000000001', 'PARAGRAPH', 10, '{"text": "Buka Arduino IDE, masuk ke menu Sketch lalu Include Library lalu Manage Libraries, cari DHT sensor library lalu instal. Buka contoh program dari menu File lalu Examples lalu DHT sensor library lalu DHTtester. Ubah baris DHTPIN menjadi 2 dan DHTTYPE menjadi DHT11. Klik tombol Upload, tunggu sampai muncul pesan Done uploading, lalu buka Serial Monitor dengan baud rate 9600. Dalam beberapa detik, angka suhu dan kelembaban akan muncul dan diperbarui setiap 2 detik."}'::jsonb)
ON CONFLICT DO NOTHING;
INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content)
VALUES (gen_random_uuid(), 'e4800001-0000-4000-8000-000000000001', 'HEADING', 11, '{"text": "Risiko, Kesalahan Umum, dan Pemeriksaan Hasil"}'::jsonb)
ON CONFLICT DO NOTHING;
INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content)
VALUES (gen_random_uuid(), 'e4800001-0000-4000-8000-000000000001', 'LIST', 12, '{"items": ["Pembacaan NaN (bukan angka): kabel longgar atau pin DATA salah, periksa wiring dan pastikan pin pada kode sesuai", "Jangan membaca sensor lebih cepat dari 2 detik sekali, karena DHT11 butuh jeda untuk menyiapkan data baru", "Jangan memberi tegangan di atas 5,5 volt ke sensor karena bisa merusaknya permanen", "Akurasi plus-minus 2 derajat tidak cocok untuk keperluan medis atau laboratorium; gunakan sensor yang lebih presisi bila dibutuhkan", "Pemeriksaan hasil: Serial Monitor menampilkan suhu masuk akal (misalnya 27-32 derajat C) dan kelembaban 40-80 persen; hembuskan napas ke sensor, angka kelembaban harus naik", "Tindak lanjut: tampilkan data di LCD, simpan ke kartu SD, atau kirim ke internet memakai modul WiFi"]}'::jsonb)
ON CONFLICT DO NOTHING;

-- TUT-MASAK11-001: Sop Buntut: Resep Kuah Gurih dan Daging Empuk
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, access_level, is_indexed, status, owner_notes, attribution_type, version, is_test, created_by, updated_by)
VALUES ('e4800002-0000-4000-8000-000000000001', 'TUT-MASAK11-001', 'b7777777-7777-7777-7777-777777777777', 'Sop Buntut: Resep Kuah Gurih dan Daging Empuk', 'sop-buntut-resep-kuah-gurih', 'Resep sop buntut sapi dengan kuah bening gurih: teknik merebus dua tahap, bumbu rempah yang pas, dan cara membuat daging empuk tanpa presto.', 'id', 7, 'PUBLIC', true, 'DRAFT', 'Batch 48 autonomous content', 'DEVELOPED_BY', 1, false, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DELETE FROM madevi.article_blocks WHERE article_id = 'e4800002-0000-4000-8000-000000000001';
INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content)
VALUES (gen_random_uuid(), 'e4800002-0000-4000-8000-000000000001', 'HEADING', 1, '{"text": "Masalah: Sop Buntut Bau Amis, Kuah Keruh, Daging Keras"}'::jsonb)
ON CONFLICT DO NOTHING;
INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content)
VALUES (gen_random_uuid(), 'e4800002-0000-4000-8000-000000000001', 'PARAGRAPH', 2, '{"text": "Sop buntut yang enak punya tiga ciri: kuah bening tapi gurih, daging empuk sampai lepas dari tulang, dan aroma rempah yang wangi tanpa bau amis. Kegagalan paling sering adalah merebus buntut langsung lama tanpa membuang kotoran, sehingga kuah keruh dan berbau. Artikel ini memakai teknik rebus dua tahap yang dipakai banyak warung sop buntut legendaris."}'::jsonb)
ON CONFLICT DO NOTHING;
INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content)
VALUES (gen_random_uuid(), 'e4800002-0000-4000-8000-000000000001', 'HEADING', 3, '{"text": "Mengapa Buntut Sapi Cocok untuk Sop"}'::jsonb)
ON CONFLICT DO NOTHING;
INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content)
VALUES (gen_random_uuid(), 'e4800002-0000-4000-8000-000000000001', 'PARAGRAPH', 4, '{"text": "Buntut sapi kaya kolagen dan sumsum tulang. Saat direbus lama, kolagen berubah menjadi gelatin yang memberi rasa gurih alami dan tekstur kuah yang sedikit kental di lidah, sementara sumsum menambah kekayaan rasa. Inilah alasan kuah sop buntut terasa lebih dalam dibanding sop daging biasa, meski bumbunya sederhana."}'::jsonb)
ON CONFLICT DO NOTHING;
INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content)
VALUES (gen_random_uuid(), 'e4800002-0000-4000-8000-000000000001', 'HEADING', 5, '{"text": "Bahan-bahan"}'::jsonb)
ON CONFLICT DO NOTHING;
INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content)
VALUES (gen_random_uuid(), 'e4800002-0000-4000-8000-000000000001', 'LIST', 6, '{"items": ["1 kg buntut sapi, potong per ruas", "2 liter air untuk rebusan kedua", "3 siung bawang putih, 5 butir bawang merah", "2 cm jahe, digeprek", "1/2 butir pala, 3 butir cengkeh, 3 cm kayu manis", "2 buah wortel dan 2 buah kentang, potong dadu", "Daun bawang, seledri, bawang goreng untuk taburan", "Garam, merica bubuk, dan gula secukupnya"]}'::jsonb)
ON CONFLICT DO NOTHING;
INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content)
VALUES (gen_random_uuid(), 'e4800002-0000-4000-8000-000000000001', 'HEADING', 7, '{"text": "Langkah 1 sampai 3: Rebus Pertama, Buang Kotoran"}'::jsonb)
ON CONFLICT DO NOTHING;
INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content)
VALUES (gen_random_uuid(), 'e4800002-0000-4000-8000-000000000001', 'PARAGRAPH', 8, '{"text": "Masukkan potongan buntut ke panci berisi air secukupnya, rebus dengan api besar selama 10 menit sampai muncul buih dan kotoran ke permukaan. Buang seluruh air rebusan pertama ini, lalu bilas potongan buntut dengan air bersih. Langkah ini adalah kunci kuah bening dan bebas bau amis; jangan dilewatkan."}'::jsonb)
ON CONFLICT DO NOTHING;
INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content)
VALUES (gen_random_uuid(), 'e4800002-0000-4000-8000-000000000001', 'HEADING', 9, '{"text": "Langkah 4 sampai 6: Rebus Lama dan Bumbui"}'::jsonb)
ON CONFLICT DO NOTHING;
INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content)
VALUES (gen_random_uuid(), 'e4800002-0000-4000-8000-000000000001', 'PARAGRAPH', 10, '{"text": "Masukkan buntut ke 2 liter air bersih, tambahkan jahe, pala, cengkeh, dan kayu manis. Rebus dengan api kecil selama 2 sampai 3 jam sampai daging empuk, atau 30 sampai 45 menit bila memakai panci presto. Sambil menunggu, tumis bawang merah dan bawang putih yang dihaluskan sampai harum, lalu masukkan ke kuah. Terakhir masukkan wortel dan kentang, masak sampai sayuran empuk, lalu bumbui garam, merica, dan sedikit gula. Koreksi rasa sebelum diangkat."}'::jsonb)
ON CONFLICT DO NOTHING;
INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content)
VALUES (gen_random_uuid(), 'e4800002-0000-4000-8000-000000000001', 'HEADING', 11, '{"text": "Risiko, Tips Penting, dan Penyajian"}'::jsonb)
ON CONFLICT DO NOTHING;
INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content)
VALUES (gen_random_uuid(), 'e4800002-0000-4000-8000-000000000001', 'LIST', 12, '{"items": ["Jangan menambah air dingin ke rebusan yang sedang berjalan karena daging bisa alot; gunakan air panas bila perlu", "Buang kelebihan lemak yang mengambang bila kuah terlalu berminyak, terutama untuk yang menjaga kolesterol", "Jangan memasukkan sayuran terlalu awal agar tidak hancur sebelum daging empuk", "Sisa sop buntut justru makin enak keesokan harinya setelah bumbu meresap; simpan di kulkas maksimal 2 hari", "Sajikan panas-panas dengan nasi putih hangat, sambal rawit, jeruk nipis, dan emping melinjo; resep 1 kg buntut ini menghasilkan sekitar 6 porsi"]}'::jsonb)
ON CONFLICT DO NOTHING;

-- EXP-KIMIA9-001: Logam Alkali: Unsur Paling Reaktif di Tabel Periodik
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, access_level, is_indexed, status, owner_notes, attribution_type, version, is_test, created_by, updated_by)
VALUES ('e4800003-0000-4000-8000-000000000001', 'EXP-KIMIA9-001', 'c4444444-4444-4444-4444-444444444444', 'Logam Alkali: Unsur Paling Reaktif di Tabel Periodik', 'logam-alkali-reaktif-dan-bermanfaat', 'Mengenal golongan 1A: litium, natrium, kalium, rubidium, cesium, dan fransium. Mengapa sangat reaktif, bagaimana reaksinya dengan air, dan perannya dalam tubuh serta teknologi.', 'id', 6, 'PUBLIC', true, 'DRAFT', 'Batch 48 autonomous content', 'DEVELOPED_BY', 1, false, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DELETE FROM madevi.article_blocks WHERE article_id = 'e4800003-0000-4000-8000-000000000001';
INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content)
VALUES (gen_random_uuid(), 'e4800003-0000-4000-8000-000000000001', 'HEADING', 1, '{"text": "Apa Itu Logam Alkali?"}'::jsonb)
ON CONFLICT DO NOTHING;
INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content)
VALUES (gen_random_uuid(), 'e4800003-0000-4000-8000-000000000001', 'PARAGRAPH', 2, '{"text": "Logam alkali adalah enam unsur pada golongan 1A tabel periodik: litium (Li), natrium (Na), kalium (K), rubidium (Rb), cesium (Cs), dan fransium (Fr). Semuanya berwujud logam lunak yang bisa diiris dengan pisau, mengilap saat baru dipotong, tetapi cepat kusam di udara. Namanya berasal dari bahasa Arab al-qali yang berarti abu tumbuhan, karena senyawanya dulu dibuat dari abu."}'::jsonb)
ON CONFLICT DO NOTHING;
INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content)
VALUES (gen_random_uuid(), 'e4800003-0000-4000-8000-000000000001', 'HEADING', 3, '{"text": "Mengapa Sangat Reaktif?"}'::jsonb)
ON CONFLICT DO NOTHING;
INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content)
VALUES (gen_random_uuid(), 'e4800003-0000-4000-8000-000000000001', 'PARAGRAPH', 4, '{"text": "Rahasianya ada pada satu elektron valensi di kulit terluar. Atom logam alkali sangat mudah melepaskan elektron itu untuk mencapai konfigurasi stabil, membentuk ion bermuatan positif satu. Karena elektron terluar makin jauh dari inti pada unsur yang lebih berat, kereaktifan meningkat dari atas ke bawah: cesium jauh lebih reaktif dibanding litium."}'::jsonb)
ON CONFLICT DO NOTHING;
INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content)
VALUES (gen_random_uuid(), 'e4800003-0000-4000-8000-000000000001', 'HEADING', 5, '{"text": "Reaksi dengan Air: Drama Kimia yang Terkenal"}'::jsonb)
ON CONFLICT DO NOTHING;
INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content)
VALUES (gen_random_uuid(), 'e4800003-0000-4000-8000-000000000001', 'PARAGRAPH', 6, '{"text": "Saat dimasukkan ke air, logam alkali bereaksi menghasilkan gas hidrogen dan larutan basa. Persamaan untuk natrium: 2Na + 2H2O menjadi 2NaOH + H2. Litium bereaksi tenang dengan desis, natrium meleleh sambil berputar dan terbakar kuning, sedangkan kalium langsung terbakar dengan api ungu. Cesium bahkan meledak saat menyentuh air, sehingga percobaan ini hanya boleh dilakukan guru dengan pengamanan."}'::jsonb)
ON CONFLICT DO NOTHING;
INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content)
VALUES (gen_random_uuid(), 'e4800003-0000-4000-8000-000000000001', 'HEADING', 7, '{"text": "Natrium dan Kalium di Dalam Tubuhmu"}'::jsonb)
ON CONFLICT DO NOTHING;
INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content)
VALUES (gen_random_uuid(), 'e4800003-0000-4000-8000-000000000001', 'PARAGRAPH', 8, '{"text": "Tubuh manusia sangat bergantung pada natrium dan kalium sebagai elektrolit. Pompa natrium-kalium di membran sel menjaga keseimbangan cairan dan memungkinkan impuls saraf berjalan. Kekurangan kalium bisa menyebabkan kram otot dan gangguan jantung, sedangkan kelebihan natrium berkaitan dengan tekanan darah tinggi. Inilah alasan minuman isotonik mengandung keduanya setelah berolahraga berat."}'::jsonb)
ON CONFLICT DO NOTHING;
INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content)
VALUES (gen_random_uuid(), 'e4800003-0000-4000-8000-000000000001', 'HEADING', 9, '{"text": "Manfaat dalam Kehidupan Sehari-hari"}'::jsonb)
ON CONFLICT DO NOTHING;
INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content)
VALUES (gen_random_uuid(), 'e4800003-0000-4000-8000-000000000001', 'LIST', 10, '{"items": ["Garam dapur (NaCl) dan soda kue (NaHCO3) berasal dari senyawa natrium", "Sabun dibuat dari reaksi lemak dengan natrium atau kalium hidroksida", "Baterai litium-ion di ponsel dan laptop memakai litium karena ringan dan reaktif", "Pupuk kalium (KCl) penting untuk pertumbuhan tanaman", "Lampu jalan berwarna kuning memakai uap natrium yang efisien"]}'::jsonb)
ON CONFLICT DO NOTHING;

-- EXP-SEJARAH12-001: Pemberontakan PKI Madiun 1948: Latar, Jalannya, dan Akhirnya
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, access_level, is_indexed, status, owner_notes, attribution_type, version, is_test, created_by, updated_by)
VALUES ('e4800004-0000-4000-8000-000000000001', 'EXP-SEJARAH12-001', 'c8888888-8888-8888-8888-888888888888', 'Pemberontakan PKI Madiun 1948: Latar, Jalannya, dan Akhirnya', 'pemberontakan-pki-madiun-1948', 'Memahami peristiwa Madiun 1948: dari ketegangan politik pasca Perjanjian Renville, proklamasi Muso, hingga penumpasannya oleh TNI dan dampaknya bagi Indonesia.', 'id', 7, 'PUBLIC', true, 'DRAFT', 'Batch 48 autonomous content', 'DEVELOPED_BY', 1, false, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DELETE FROM madevi.article_blocks WHERE article_id = 'e4800004-0000-4000-8000-000000000001';
INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content)
VALUES (gen_random_uuid(), 'e4800004-0000-4000-8000-000000000001', 'HEADING', 1, '{"text": "Indonesia 1948: Negara Baru yang Rapuh"}'::jsonb)
ON CONFLICT DO NOTHING;
INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content)
VALUES (gen_random_uuid(), 'e4800004-0000-4000-8000-000000000001', 'PARAGRAPH', 2, '{"text": "Tiga tahun setelah proklamasi, Indonesia masih berjuang mempertahankan kemerdekaan. Perjanjian Renville awal 1948 memaksa TNI hijrah dari Jawa Barat, menimbulkan kekecewaan di kalangan tentara dan kelompok kiri. Kabinet Hatta menjalankan program rasionalisasi yang memangkas jumlah tentara, membuat ribuan prajurit kecewa. Di tengah ketegangan inilah Muso, tokoh komunis, kembali dari Uni Soviet pada Agustus 1948."}'::jsonb)
ON CONFLICT DO NOTHING;
INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content)
VALUES (gen_random_uuid(), 'e4800004-0000-4000-8000-000000000001', 'HEADING', 3, '{"text": "Siapa Muso dan Front Demokrasi Rakyat?"}'::jsonb)
ON CONFLICT DO NOTHING;
INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content)
VALUES (gen_random_uuid(), 'e4800004-0000-4000-8000-000000000001', 'PARAGRAPH', 4, '{"text": "Muso adalah tokoh Partai Komunis Indonesia era 1920-an yang lama berada di Moskow. Sekembalinya, ia menyatukan berbagai kelompok kiri ke dalam Front Demokrasi Rakyat (FDR) dan mengambil alih kepemimpinan PKI. Muso menuntut kabinet Hatta diganti dengan kabinet front nasional dan menolak Perjanjian Renville, sehingga pertentangan dengan pemerintah kian tajam."}'::jsonb)
ON CONFLICT DO NOTHING;
INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content)
VALUES (gen_random_uuid(), 'e4800004-0000-4000-8000-000000000001', 'HEADING', 5, '{"text": "Pemicu: Bentrok Berdarah di Madiun"}'::jsonb)
ON CONFLICT DO NOTHING;
INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content)
VALUES (gen_random_uuid(), 'e4800004-0000-4000-8000-000000000001', 'PARAGRAPH', 6, '{"text": "Ketegangan meledak pada 18 September 1948 ketika kelompok pro-FDR merebut Madiun dan memproklamasikan berdirinya negara Soviet Indonesia. Sebelumnya sudah terjadi penculikan dan pembunuhan terhadap tokoh yang berseberangan, termasuk di Solo. Pemerintah menilai ini sebagai pemberontakan terhadap negara yang sah."}'::jsonb)
ON CONFLICT DO NOTHING;
INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content)
VALUES (gen_random_uuid(), 'e4800004-0000-4000-8000-000000000001', 'HEADING', 7, '{"text": "Respons Pemerintah: Pidato Hatta dan Operasi Militer"}'::jsonb)
ON CONFLICT DO NOTHING;
INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content)
VALUES (gen_random_uuid(), 'e4800004-0000-4000-8000-000000000001', 'PARAGRAPH', 8, '{"text": "Presiden Soekarno lewat pidato radio 19 September 1948 meminta rakyat memilih: ikut Muso atau ikut Soekarno-Hatta. Pemerintah mengerahkan TNI di bawah komando Kolonel Sungkono dengan strategi dari Panglima Besar Sudirman dan A.H. Nasution. Operasi penumpasan berjalan cepat karena pemberontak tidak mendapat dukungan luas dari rakyat dan tentara."}'::jsonb)
ON CONFLICT DO NOTHING;
INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content)
VALUES (gen_random_uuid(), 'e4800004-0000-4000-8000-000000000001', 'HEADING', 9, '{"text": "Akhir Pemberontakan dan Pelajarannya"}'::jsonb)
ON CONFLICT DO NOTHING;
INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content)
VALUES (gen_random_uuid(), 'e4800004-0000-4000-8000-000000000001', 'PARAGRAPH', 10, '{"text": "Pada akhir September 1948 Madiun direbut kembali. Muso tewas dalam pengejaran, sedangkan Amir Sjarifuddin dan para pemimpin lain ditangkap dan kemudian dieksekusi. Peristiwa ini meninggalkan pelajaran penting: di tengah perjuangan mempertahankan kemerdekaan dari Belanda, perpecahan internal justru melemahkan bangsa. Madiun 1948 juga menjadi salah satu alasan kecurigaan panjang terhadap komunisme dalam sejarah politik Indonesia."}'::jsonb)
ON CONFLICT DO NOTHING;

-- SCH-SMA-KIM4-001: Kimia Kelas 10: Tabel Periodik Unsur
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, access_level, is_indexed, status, owner_notes, attribution_type, version, is_test, created_by, updated_by)
VALUES ('e4800005-0000-4000-8000-000000000001', 'SCH-SMA-KIM4-001', 'd5555555-5555-5555-5555-555555555555', 'Kimia Kelas 10: Tabel Periodik Unsur', 'kimia-kelas-10-tabel-periodik', 'Materi kimia kelas 10: sejarah tabel periodik, golongan dan periode, pengelompokan logam-nonlogam-metaloid, tren periodik, latihan soal dan kunci jawaban.', 'id', 9, 'PUBLIC', true, 'DRAFT', 'Batch 48 autonomous content', 'DEVELOPED_BY', 1, false, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DELETE FROM madevi.article_blocks WHERE article_id = 'e4800005-0000-4000-8000-000000000001';
INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content)
VALUES (gen_random_uuid(), 'e4800005-0000-4000-8000-000000000001', 'HEADING', 1, '{"text": "Tujuan Pembelajaran"}'::jsonb)
ON CONFLICT DO NOTHING;
INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content)
VALUES (gen_random_uuid(), 'e4800005-0000-4000-8000-000000000001', 'PARAGRAPH', 2, '{"text": "Setelah mempelajari materi ini, kamu diharapkan mampu: menjelaskan perkembangan tabel periodik, menentukan golongan dan periode suatu unsur, mengelompokkan unsur ke dalam logam, nonlogam, dan metaloid, serta menjelaskan tren sifat periodik seperti jari-jari atom dan keelektronegatifan."}'::jsonb)
ON CONFLICT DO NOTHING;
INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content)
VALUES (gen_random_uuid(), 'e4800005-0000-4000-8000-000000000001', 'HEADING', 3, '{"text": "Sejarah Singkat Tabel Periodik"}'::jsonb)
ON CONFLICT DO NOTHING;
INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content)
VALUES (gen_random_uuid(), 'e4800005-0000-4000-8000-000000000001', 'PARAGRAPH', 4, '{"text": "Pada 1869, Dmitri Mendeleev menyusun unsur berdasarkan kenaikan massa atom dan kemiripan sifat, bahkan berani mengosongkan kotak untuk unsur yang belum ditemukan beserta prediksinya. Kemudian Henry Moseley menyempurnakannya dengan menyusun berdasarkan nomor atom, yang menjadi dasar tabel periodik modern yang kita pakai sekarang dengan 118 unsur."}'::jsonb)
ON CONFLICT DO NOTHING;
INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content)
VALUES (gen_random_uuid(), 'e4800005-0000-4000-8000-000000000001', 'HEADING', 5, '{"text": "Golongan dan Periode"}'::jsonb)
ON CONFLICT DO NOTHING;
INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content)
VALUES (gen_random_uuid(), 'e4800005-0000-4000-8000-000000000001', 'PARAGRAPH', 6, '{"text": "Golongan adalah kolom vertikal yang berjumlah 18, menunjukkan jumlah elektron valensi sehingga unsur segolongan punya sifat kimia mirip. Contohnya golongan 1A berisi logam alkali dan golongan 7A berisi halogen. Periode adalah baris horizontal berjumlah 7, menunjukkan jumlah kulit elektron. Unsur natrium (Na) berada pada golongan 1A periode 3."}'::jsonb)
ON CONFLICT DO NOTHING;
INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content)
VALUES (gen_random_uuid(), 'e4800005-0000-4000-8000-000000000001', 'HEADING', 7, '{"text": "Logam, Nonlogam, dan Metaloid"}'::jsonb)
ON CONFLICT DO NOTHING;
INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content)
VALUES (gen_random_uuid(), 'e4800005-0000-4000-8000-000000000001', 'LIST', 8, '{"items": ["Logam: mengilap, menghantar panas dan listrik, dapat ditempa; contoh besi, tembaga, aluminium; terletak di kiri dan tengah tabel", "Nonlogam: tidak mengilap, isolator, rapuh; contoh oksigen, belerang, karbon; terletak di kanan atas tabel", "Metaloid: sifat campuran antara logam dan nonlogam, penting untuk semikonduktor; contoh silikon, germanium; terletak di garis batas keduanya"]}'::jsonb)
ON CONFLICT DO NOTHING;
INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content)
VALUES (gen_random_uuid(), 'e4800005-0000-4000-8000-000000000001', 'HEADING', 9, '{"text": "Tren Sifat Periodik"}'::jsonb)
ON CONFLICT DO NOTHING;
INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content)
VALUES (gen_random_uuid(), 'e4800005-0000-4000-8000-000000000001', 'PARAGRAPH', 10, '{"text": "Tiga tren penting perlu dihafal polanya. Jari-jari atom membesar ke bawah dan ke kiri karena kulit bertambah. Energi ionisasi, yaitu energi untuk melepas elektron, membesar ke atas dan ke kanan. Keelektronegatifan, yaitu kemampuan menarik elektron, juga membesar ke atas dan ke kanan dengan fluor sebagai yang tertinggi. Pola ini bisa diprediksi hanya dari posisi unsur di tabel."}'::jsonb)
ON CONFLICT DO NOTHING;
INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content)
VALUES (gen_random_uuid(), 'e4800005-0000-4000-8000-000000000001', 'HEADING', 11, '{"text": "Latihan Soal"}'::jsonb)
ON CONFLICT DO NOTHING;
INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content)
VALUES (gen_random_uuid(), 'e4800005-0000-4000-8000-000000000001', 'LIST', 12, '{"items": ["Soal 1: Unsur X bernomor atom 19. Tentukan golongan, periode, dan jenis unsurnya (logam/nonlogam).", "Soal 2: Urutkan unsur berikut dari jari-jari atom terkecil: Mg, Ca, Sr.", "Soal 3: Jelaskan mengapa unsur-unsur golongan 7A memiliki sifat kimia yang mirip.", "Kunci: 1) Golongan 1A, periode 4, logam alkali (kalium). 2) Mg < Ca < Sr karena jari-jari membesar ke bawah segolongan. 3) Karena sama-sama memiliki 7 elektron valensi sehingga kecenderungan menangkap satu elektron untuk stabil mirip."]}'::jsonb)
ON CONFLICT DO NOTHING;

-- SCH-SD-IPS8-001: IPS Kelas 4: Peta Indonesia
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, access_level, is_indexed, status, owner_notes, attribution_type, version, is_test, created_by, updated_by)
VALUES ('e4800006-0000-4000-8000-000000000001', 'SCH-SD-IPS8-001', 'd3333333-3333-3333-3333-333333333333', 'IPS Kelas 4: Peta Indonesia', 'ips-kelas-4-peta-indonesia', 'Materi IPS kelas 4 SD: pengertian peta, unsur-unsur peta, cara membaca peta Indonesia, dan memahami skala peta. Dilengkapi latihan soal dan kunci jawaban.', 'id', 6, 'PUBLIC', true, 'DRAFT', 'Batch 48 autonomous content', 'DEVELOPED_BY', 1, false, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DELETE FROM madevi.article_blocks WHERE article_id = 'e4800006-0000-4000-8000-000000000001';
INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content)
VALUES (gen_random_uuid(), 'e4800006-0000-4000-8000-000000000001', 'HEADING', 1, '{"text": "Tujuan Pembelajaran"}'::jsonb)
ON CONFLICT DO NOTHING;
INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content)
VALUES (gen_random_uuid(), 'e4800006-0000-4000-8000-000000000001', 'PARAGRAPH', 2, '{"text": "Setelah belajar materi ini, kamu diharapkan bisa menjelaskan apa itu peta, menyebutkan unsur-unsur peta, membaca peta Indonesia dengan benar, dan memahami arti skala pada peta. Semua materi disajikan dengan bahasa sederhana dan contoh yang dekat dengan kehidupanmu."}'::jsonb)
ON CONFLICT DO NOTHING;
INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content)
VALUES (gen_random_uuid(), 'e4800006-0000-4000-8000-000000000001', 'HEADING', 3, '{"text": "Apa Itu Peta?"}'::jsonb)
ON CONFLICT DO NOTHING;
INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content)
VALUES (gen_random_uuid(), 'e4800006-0000-4000-8000-000000000001', 'PARAGRAPH', 4, '{"text": "Peta adalah gambaran permukaan bumi pada bidang datar dengan skala tertentu. Dengan peta, kita bisa mengetahui letak suatu tempat tanpa harus pergi ke sana. Ada peta dunia, peta negara, peta provinsi, sampai peta desa tempat tinggalmu. Peta yang sering kamu lihat di kelas adalah peta Indonesia."}'::jsonb)
ON CONFLICT DO NOTHING;
INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content)
VALUES (gen_random_uuid(), 'e4800006-0000-4000-8000-000000000001', 'HEADING', 5, '{"text": "Unsur-unsur Peta"}'::jsonb)
ON CONFLICT DO NOTHING;
INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content)
VALUES (gen_random_uuid(), 'e4800006-0000-4000-8000-000000000001', 'LIST', 6, '{"items": ["Judul peta: menjelaskan isi peta, misalnya Peta Indonesia", "Legenda: keterangan arti simbol dan warna pada peta", "Skala: perbandingan jarak di peta dengan jarak sebenarnya", "Mata angin: penunjuk arah mata angin, utara selalu di atas", "Simbol: gambar untuk mewakili gunung, sungai, kota, dan lainnya", "Warna: hijau untuk dataran rendah, cokelat untuk dataran tinggi, biru untuk laut"]}'::jsonb)
ON CONFLICT DO NOTHING;
INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content)
VALUES (gen_random_uuid(), 'e4800006-0000-4000-8000-000000000001', 'HEADING', 7, '{"text": "Membaca Peta Indonesia"}'::jsonb)
ON CONFLICT DO NOTHING;
INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content)
VALUES (gen_random_uuid(), 'e4800006-0000-4000-8000-000000000001', 'PARAGRAPH', 8, '{"text": "Indonesia adalah negara kepulauan terbesar di dunia dengan lebih dari 17 ribu pulau. Pulau-pulau besarnya adalah Sumatra, Jawa, Kalimantan, Sulawesi, dan Papua. Ibukota negara, Jakarta, terletak di Pulau Jawa bagian barat. Laut yang mengelilingi Indonesia antara lain Laut Jawa di utara Pulau Jawa dan Samudra Hindia di selatan."}'::jsonb)
ON CONFLICT DO NOTHING;
INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content)
VALUES (gen_random_uuid(), 'e4800006-0000-4000-8000-000000000001', 'HEADING', 9, '{"text": "Memahami Skala Peta"}'::jsonb)
ON CONFLICT DO NOTHING;
INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content)
VALUES (gen_random_uuid(), 'e4800006-0000-4000-8000-000000000001', 'PARAGRAPH', 10, '{"text": "Skala 1 berbanding 1.000.000 artinya 1 cm pada peta sama dengan 1.000.000 cm atau 10 km jarak sebenarnya. Jadi kalau jarak dua kota di peta 5 cm, jarak sebenarnya adalah 5 kali 10 km sama dengan 50 km. Semakin besar angka skala, semakin kecil daerah yang digambar tetapi semakin detail."}'::jsonb)
ON CONFLICT DO NOTHING;
INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content)
VALUES (gen_random_uuid(), 'e4800006-0000-4000-8000-000000000001', 'HEADING', 11, '{"text": "Latihan Soal"}'::jsonb)
ON CONFLICT DO NOTHING;
INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content)
VALUES (gen_random_uuid(), 'e4800006-0000-4000-8000-000000000001', 'LIST', 12, '{"items": ["Soal 1: Sebutkan 5 unsur peta beserta fungsinya masing-masing!", "Soal 2: Pulau besar apa saja yang ada di Indonesia? Sebutkan minimal 4!", "Soal 3: Pada peta berskala 1:500.000, jarak kota A ke kota B adalah 8 cm. Berapa jarak sebenarnya?", "Kunci: 1) Judul, legenda, skala, mata angin, simbol, warna beserta fungsinya. 2) Sumatra, Jawa, Kalimantan, Sulawesi, Papua. 3) 8 cm x 5 km = 40 km."]}'::jsonb)
ON CONFLICT DO NOTHING;

COMMIT;
