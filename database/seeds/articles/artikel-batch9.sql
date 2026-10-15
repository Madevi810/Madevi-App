-- Artikel konten Madevi batch 9 — 2026-10-13
-- Owner principal: f7125028-187e-44e0-b95b-88b69b8d5c9a

-- ============ 1. TUT-KESEHATAN-001 ============
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, status, created_by, updated_by)
VALUES ('a1000001-0000-4000-8000-000000000001', 'TUT-KESEHATAN-001', 'b5555555-5555-5555-5555-555555555555',
'Demam pada Anak: Kapan ke Dokter',
'demam-pada-anak-kapan-ke-dokter',
'Informasi umum tentang demam pada anak: cara mengukur suhu, perawatan di rumah, dan tanda bahaya yang mengharuskan ke dokter.',
'id', 7, 'DRAFT', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (id) DO NOTHING;

INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
(gen_random_uuid(), 'a1000001-0000-4000-8000-000000000001', 'HEADING', 1, jsonb_build_object('text', $$Masalah: Anak Demam, Orang Tua Panik$$)),
(gen_random_uuid(), 'a1000001-0000-4000-8000-000000000001', 'PARAGRAPH', 2, jsonb_build_object('text', $$Demam adalah respons alami tubuh melawan infeksi. Sebagian besar demam pada anak tidak berbahaya dan sembuh sendiri, tetapi orang tua perlu tahu kapan demam bisa ditangani di rumah dan kapan harus segera ke dokter. Artikel ini bersifat informasi umum, bukan pengganti diagnosis medis.$$)),
(gen_random_uuid(), 'a1000001-0000-4000-8000-000000000001', 'HEADING', 3, jsonb_build_object('text', $$Penjelasan: Apa Itu Demam$$)),
(gen_random_uuid(), 'a1000001-0000-4000-8000-000000000001', 'PARAGRAPH', 4, jsonb_build_object('text', $$Demam didefinisikan sebagai suhu tubuh di atas 38°C bila diukur dengan termometer. Suhu tubuh normal berkisar 36,5–37,5°C. Demam sendiri bukan penyakit, melainkan gejala bahwa sistem imun sedang bekerja melawan virus atau bakteri.$$)),
(gen_random_uuid(), 'a1000001-0000-4000-8000-000000000001', 'HEADING', 5, jsonb_build_object('text', $$Alat yang Dibutuhkan$$)),
(gen_random_uuid(), 'a1000001-0000-4000-8000-000000000001', 'LIST', 6, jsonb_build_object('items', ARRAY[$$Termometer digital (ketiak atau dahi)$$, $$Air minum yang cukup$$, $$Pakaian tipis dan nyaman$$, $$Kompres air hangat (bukan air dingin/es)$$, $$Obat penurun panas anak (paracetamol/ibuprofen) sesuai dosis berat badan$$])),
(gen_random_uuid(), 'a1000001-0000-4000-8000-000000000001', 'HEADING', 7, jsonb_build_object('text', $$Langkah Perawatan di Rumah$$)),
(gen_random_uuid(), 'a1000001-0000-4000-8000-000000000001', 'LIST', 8, jsonb_build_object('items', ARRAY[$$1. Ukur suhu dengan termometer, catat hasilnya beserta waktunya$$, $$2. Beri minum lebih sering agar tidak dehidrasi$$, $$3. Pakaikan baju tipis; jangan diselimuti tebal$$, $$4. Kompres dahi dengan air hangat suam-suam kuku$$, $$5. Beri penurun panas sesuai dosis bila anak rewel atau suhu di atas 38,5°C$$, $$6. Biarkan anak istirahat; pantau setiap 2–4 jam$$])),
(gen_random_uuid(), 'a1000001-0000-4000-8000-000000000001', 'HEADING', 9, jsonb_build_object('text', $$Risiko dan Tanda Bahaya$$)),
(gen_random_uuid(), 'a1000001-0000-4000-8000-000000000001', 'PARAGRAPH', 10, jsonb_build_object('text', $$SEGERA ke dokter atau IGD bila: bayi di bawah 3 bulan demam ≥38°C; demam di atas 40°C; kejang; anak lemas/sulit dibangunkan; muntah terus; sesak napas; ruam yang tidak hilang saat ditekan; demam lebih dari 3 hari. Jangan memberi aspirin pada anak, dan jangan mengompres dengan alkohol.$$)),
(gen_random_uuid(), 'a1000001-0000-4000-8000-000000000001', 'HEADING', 11, jsonb_build_object('text', $$Penyelesaian$$)),
(gen_random_uuid(), 'a1000001-0000-4000-8000-000000000001', 'PARAGRAPH', 12, jsonb_build_object('text', $$Sebagian besar demam karena infeksi virus ringan membaik dalam 2–3 hari dengan perawatan di rumah. Kuncinya: ukur suhu dengan benar, jaga cairan, dan kenali tanda bahaya. Bila ragu, selalu lebih aman berkonsultasi ke dokter atau puskesmas terdekat.$$))
ON CONFLICT (id) DO NOTHING;

-- ============ 2. TUT-RUMAH-001 ============
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, status, created_by, updated_by)
VALUES ('a1000002-0000-4000-8000-000000000002', 'TUT-RUMAH-001', 'b7777777-7777-7777-7777-777777777777',
'Atap Bocor: Perbaikan Sementara dan Permanen',
'atap-bocor-perbaikan-sementara-permanen',
'Panduan menangani atap bocor: tambalan darurat saat hujan, lalu perbaikan permanen saat cuaca cerah.',
'id', 7, 'DRAFT', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (id) DO NOTHING;

INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
(gen_random_uuid(), 'a1000002-0000-4000-8000-000000000002', 'HEADING', 1, jsonb_build_object('text', $$Masalah: Atap Bocor Saat Hujan$$)),
(gen_random_uuid(), 'a1000002-0000-4000-8000-000000000002', 'PARAGRAPH', 2, jsonb_build_object('text', $$Tetesan air dari plafon saat hujan deras bisa merusak perabot, korsleting listrik, dan menumbuhkan jamur. Perbaikan permanen idealnya dilakukan saat cuaca kering, tetapi ada cara darurat untuk menghentikan kebocoran sementara.$$)),
(gen_random_uuid(), 'a1000002-0000-4000-8000-000000000002', 'HEADING', 3, jsonb_build_object('text', $$Penjelasan: Sumber Kebocoran Umum$$)),
(gen_random_uuid(), 'a1000002-0000-4000-8000-000000000002', 'PARAGRAPH', 4, jsonb_build_object('text', $$Kebocoran biasanya berasal dari: genteng retak/geser, sambungan (nok) yang terbuka, talang tersumbat hingga air meluap ke dalam, atau lapisan waterproofing dak beton yang retak. Air bisa merembes jauh dari titik bocor aslinya, jadi lacak dari dalam loteng saat hujan.$$)),
(gen_random_uuid(), 'a1000002-0000-4000-8000-000000000002', 'HEADING', 5, jsonb_build_object('text', $$Alat yang Dibutuhkan$$)),
(gen_random_uuid(), 'a1000002-0000-4000-8000-000000000002', 'LIST', 6, jsonb_build_object('items', ARRAY[$$Terpal plastik / plastik cor$$, $$Lakban / tali$$, $$Ember dan kain pel$$, $$Senter$$, $$Untuk permanen: genteng cadangan, semen instan, kuas, dan cat waterproofing$$])),
(gen_random_uuid(), 'a1000002-0000-4000-8000-000000000002', 'HEADING', 7, jsonb_build_object('text', $$Langkah Darurat (Saat Hujan)$$)),
(gen_random_uuid(), 'a1000002-0000-4000-8000-000000000002', 'LIST', 8, jsonb_build_object('items', ARRAY[$$1. Amankan listrik: matikan MCB area yang terkena rembesan$$, $$2. Tampung tetesan dengan ember; geser perabot$$, $$3. Dari dalam loteng, lacak titik rembesan dengan senter$$, $$4. Jika aman dijangkau, tutup area bocor dari dalam dengan terpal plastik$$, $$5. Jangan naik ke atap saat hujan atau atap licin$$])),
(gen_random_uuid(), 'a1000002-0000-4000-8000-000000000002', 'HEADING', 9, jsonb_build_object('text', $$Risiko$$)),
(gen_random_uuid(), 'a1000002-0000-4000-8000-000000000002', 'PARAGRAPH', 10, jsonb_build_object('text', $$Naik atap saat basah sangat berbahaya (licin, risiko jatuh). Jangan injak genteng tanah liat di tengah — injak di bagian tulangan. Air + listrik = bahaya sengatan; selalu matikan listrik di area bocor.$$)),
(gen_random_uuid(), 'a1000002-0000-4000-8000-000000000002', 'HEADING', 11, jsonb_build_object('text', $$Perbaikan Permanen (Cuaca Cerah)$$)),
(gen_random_uuid(), 'a1000002-0000-4000-8000-000000000002', 'PARAGRAPH', 12, jsonb_build_object('text', $$Saat kering: ganti genteng retak, rapatkan kembali nok dengan adukan semen, bersihkan talang dari sampah, dan lapisi dak beton retak dengan waterproofing 2 lapis. Jika kebocoran luas atau struktur kayu lapuk, panggil tukang atap profesional — biaya perbaikan kecil jauh lebih murah daripada kerusakan plafon dan perabot.$$))
ON CONFLICT (id) DO NOTHING;

-- ============ 3. EXP-SOSIOLOGI-001 ============
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, status, created_by, updated_by)
VALUES ('a1000003-0000-4000-8000-000000000003', 'EXP-SOSIOLOGI-001', 'c8888888-8888-8888-8888-888888888888',
'Gotong Royong: Kearifan Lokal Indonesia',
'gotong-royong-kearifan-lokal-indonesia',
'Mengenal gotong royong sebagai sistem kerja sama masyarakat Indonesia: sejarah, bentuk, dan relevansinya di era modern.',
'id', 6, 'DRAFT', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (id) DO NOTHING;

INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
(gen_random_uuid(), 'a1000003-0000-4000-8000-000000000003', 'HEADING', 1, jsonb_build_object('text', $$Apa Itu Gotong Royong$$)),
(gen_random_uuid(), 'a1000003-0000-4000-8000-000000000003', 'PARAGRAPH', 2, jsonb_build_object('text', $$Gotong royong adalah sistem kerja sama sukarela dalam masyarakat Indonesia untuk mencapai tujuan bersama. Istilah ini berasal dari bahasa Jawa: gotong (mengangkat) dan royong (bersama). Nilai ini bahkan tercantum dalam sila ketiga Pancasila, Persatuan Indonesia.$$)),
(gen_random_uuid(), 'a1000003-0000-4000-8000-000000000003', 'HEADING', 3, jsonb_build_object('text', $$Akar Sejarah$$)),
(gen_random_uuid(), 'a1000003-0000-4000-8000-000000000003', 'PARAGRAPH', 4, jsonb_build_object('text', $$Praktik gotong royong sudah ada sejak masyarakat agraris Nusantara: membuka lahan, menanam, hingga memanen padi dilakukan bersama. Setiap daerah punya istilahnya sendiri — mapalus di Minahasa, subak di Bali (irigasi), sambatan di Jawa, dan aleut di Sunda.$$)),
(gen_random_uuid(), 'a1000003-0000-4000-8000-000000000003', 'HEADING', 5, jsonb_build_object('text', $$Bentuk-Bentuk Gotong Royong$$)),
(gen_random_uuid(), 'a1000003-0000-4000-8000-000000000003', 'LIST', 6, jsonb_build_object('items', ARRAY[$$Kerja bakti: membersihkan lingkungan, memperbaiki jalan atau masjid bersama$$, $$Tolong-menolong hajatan: membantu tetangga yang punya acara pernikahan atau khitanan$$, $$Siskamling: ronda malam menjaga keamanan lingkungan$$, $$Arisan dan simpan pinjam: gotong royong di bidang ekonomi$$, $$Tanggap bencana: penggalangan bantuan saat banjir atau gempa$$])),
(gen_random_uuid(), 'a1000003-0000-4000-8000-000000000003', 'HEADING', 7, jsonb_build_object('text', $$Nilai yang Terkandung$$)),
(gen_random_uuid(), 'a1000003-0000-4000-8000-000000000003', 'PARAGRAPH', 8, jsonb_build_object('text', $$Gotong royong menanamkan solidaritas, empati, dan rasa memiliki terhadap komunitas. Sosiolog melihatnya sebagai modal sosial (social capital): jaringan kepercayaan yang membuat masyarakat lebih tangguh menghadapi krisis.$$)),
(gen_random_uuid(), 'a1000003-0000-4000-8000-000000000003', 'HEADING', 9, jsonb_build_object('text', $$Tantangan di Era Modern$$)),
(gen_random_uuid(), 'a1000003-0000-4000-8000-000000000003', 'PARAGRAPH', 10, jsonb_build_object('text', $$Urbanisasi dan gaya hidup individualistis mengikis praktik gotong royong di kota besar. Namun bentuk barunya muncul: crowdfunding, komunitas relawan digital, dan aksi sosial media. Esensinya sama — hanya medianya yang berubah. Melestarikan gotong royong berarti menjaga jaring pengaman sosial Indonesia.$$))
ON CONFLICT (id) DO NOTHING;

-- ============ 4. EXP-PSIKOLOGI-001 ============
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, status, created_by, updated_by)
VALUES ('a1000004-0000-4000-8000-000000000004', 'EXP-PSIKOLOGI-001', 'c2222222-2222-2222-2222-222222222222',
'Memori: Cara Otak Menyimpan Informasi',
'memori-cara-otak-menyimpan-informasi',
'Bagaimana otak menyimpan dan mengingat informasi: memori sensorik, jangka pendek, jangka panjang, dan cara memperkuat ingatan.',
'id', 6, 'DRAFT', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (id) DO NOTHING;

INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
(gen_random_uuid(), 'a1000004-0000-4000-8000-000000000004', 'HEADING', 1, jsonb_build_object('text', $$Tiga Tahap Memori$$)),
(gen_random_uuid(), 'a1000004-0000-4000-8000-000000000004', 'PARAGRAPH', 2, jsonb_build_object('text', $$Psikolog membagi memori menjadi tiga tahap berurutan. Pertama, memori sensorik: kesan indra yang bertahan kurang dari satu detik (misalnya bayangan lampu setelah berkedip). Kedua, memori jangka pendek: informasi yang sedang dipikirkan, kapasitasnya hanya sekitar 7 item dan bertahan belasan detik. Ketiga, memori jangka panjang: penyimpanan yang relatif permanen dengan kapasitas hampir tak terbatas.$$)),
(gen_random_uuid(), 'a1000004-0000-4000-8000-000000000004', 'HEADING', 3, jsonb_build_object('text', $$Encoding: Mengubah Pengalaman Menjadi Kode$$)),
(gen_random_uuid(), 'a1000004-0000-4000-8000-000000000004', 'PARAGRAPH', 4, jsonb_build_object('text', $$Agar informasi masuk ke memori jangka panjang, otak harus meng-encoding-nya — mengubah pengalaman menjadi kode saraf. Encoding paling kuat adalah encoding semantik (memahami makna), bukan sekadar menghafal bunyi. Itulah sebabnya memahami pelajaran jauh lebih awet daripada menghafal mati.$$)),
(gen_random_uuid(), 'a1000004-0000-4000-8000-000000000004', 'HEADING', 5, jsonb_build_object('text', $$Konsolidasi Saat Tidur$$)),
(gen_random_uuid(), 'a1000004-0000-4000-8000-000000000004', 'PARAGRAPH', 6, jsonb_build_object('text', $$Saat tidur, terutama tidur dalam (deep sleep), otak memutar ulang dan memperkuat koneksi saraf dari pengalaman hari itu — proses yang disebut konsolidasi memori. Inilah alasan ilmiah mengapa begadang sebelum ujian justru merusak ingatan.$$)),
(gen_random_uuid(), 'a1000004-0000-4000-8000-000000000004', 'HEADING', 7, jsonb_build_object('text', $$Mengapa Kita Lupa$$)),
(gen_random_uuid(), 'a1000004-0000-4000-8000-000000000004', 'LIST', 8, jsonb_build_object('items', ARRAY[$$Peluruhan: koneksi saraf melemah bila tidak pernah diakses$$, $$Interferensi: informasi baru menimpa yang lama (atau sebaliknya)$$, $$Kegagalan retrieval: informasi tersimpan tetapi petunjuk mengingatnya hilang — fenomena "di ujung lidah"$$, $$Motivasi dan emosi: kita lebih mudah mengingat hal yang bermakna emosional$$])),
(gen_random_uuid(), 'a1000004-0000-4000-8000-000000000004', 'HEADING', 9, jsonb_build_object('text', $$Cara Memperkuat Ingatan$$)),
(gen_random_uuid(), 'a1000004-0000-4000-8000-000000000004', 'PARAGRAPH', 10, jsonb_build_object('text', $$Teknik yang terbukti: pengulangan berjarak (spaced repetition) — mengulang materi dengan jeda hari, bukan sekaligus; elaborasi — mengaitkan informasi baru dengan pengetahuan lama; pengujian diri (retrieval practice) — mencoba mengingat tanpa melihat catatan; dan tidur cukup. Keempatnya jauh lebih efektif daripada membaca ulang berkali-kali.$$))
ON CONFLICT (id) DO NOTHING;

-- ============ 5. SCH-SD-IPS-001 ============
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, status, created_by, updated_by)
VALUES ('a1000005-0000-4000-8000-000000000005', 'SCH-SD-IPS-001', 'd3333333-3333-3333-3333-333333333333',
'IPS Kelas 4: Peta dan Kenampakan Alam',
'ips-kelas-4-peta-kenampakan-alam',
'Materi IPS kelas 4 SD: membaca peta, simbol-simbol peta, dan kenampakan alam Indonesia beserta latihan soal.',
'id', 6, 'DRAFT', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (id) DO NOTHING;

INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
(gen_random_uuid(), 'a1000005-0000-4000-8000-000000000005', 'HEADING', 1, jsonb_build_object('text', $$Tujuan Pembelajaran$$)),
(gen_random_uuid(), 'a1000005-0000-4000-8000-000000000005', 'PARAGRAPH', 2, jsonb_build_object('text', $$Setelah mempelajari materi ini, kamu diharapkan mampu: (1) menjelaskan pengertian peta, (2) menyebutkan unsur-unsur peta, (3) membaca simbol pada peta, dan (4) mengidentifikasi kenampakan alam di Indonesia.$$)),
(gen_random_uuid(), 'a1000005-0000-4000-8000-000000000005', 'HEADING', 3, jsonb_build_object('text', $$Apa Itu Peta$$)),
(gen_random_uuid(), 'a1000005-0000-4000-8000-000000000005', 'PARAGRAPH', 4, jsonb_build_object('text', $$Peta adalah gambaran permukaan bumi pada bidang datar dengan skala tertentu. Peta dibuat lebih kecil dari aslinya — perbandingannya disebut skala. Contoh: skala 1:100.000 artinya 1 cm pada peta sama dengan 100.000 cm (1 km) di dunia nyata.$$)),
(gen_random_uuid(), 'a1000005-0000-4000-8000-000000000005', 'HEADING', 5, jsonb_build_object('text', $$Unsur-Unsur Peta$$)),
(gen_random_uuid(), 'a1000005-0000-4000-8000-000000000005', 'LIST', 6, jsonb_build_object('items', ARRAY[$$Judul peta: menerangkan isi peta$$, $$Skala: perbandingan jarak pada peta dengan jarak sebenarnya$$, $$Legenda: keterangan simbol-simbol pada peta$$, $$Mata angin: penunjuk arah (utara, selatan, timur, barat)$$, $$Simbol: gambar yang mewakili kenampakan (gunung = segitiga, sungai = garis biru)$$, $$Warna: biru untuk perairan, hijau untuk dataran rendah, cokelat untuk pegunungan$$])),
(gen_random_uuid(), 'a1000005-0000-4000-8000-000000000005', 'HEADING', 7, jsonb_build_object('text', $$Kenampakan Alam Indonesia$$)),
(gen_random_uuid(), 'a1000005-0000-4000-8000-000000000005', 'PARAGRAPH', 8, jsonb_build_object('text', $$Indonesia memiliki kenampakan alam yang beragam. Daratan: dataran rendah (pantai utara Jawa), dataran tinggi (Dieng), gunung (Semeru, Rinjani), dan lembah. Perairan: sungai (Kapuas, Mahakam), danau (Toba, Sentani), selat, dan laut. Kenampakan ini memengaruhi mata pencaharian penduduk — nelayan di pesisir, petani di dataran.$$)),
(gen_random_uuid(), 'a1000005-0000-4000-8000-000000000005', 'HEADING', 9, jsonb_build_object('text', $$Latihan Soal$$)),
(gen_random_uuid(), 'a1000005-0000-4000-8000-000000000005', 'LIST', 10, jsonb_build_object('items', ARRAY[$$1. Apa yang dimaksud dengan skala pada peta?$$, $$2. Sebutkan 3 unsur peta beserta fungsinya!$$, $$3. Warna apa yang menunjukkan pegunungan pada peta? Sebutkan satu contoh gunung di Indonesia!$$])),
(gen_random_uuid(), 'a1000005-0000-4000-8000-000000000005', 'HEADING', 11, jsonb_build_object('text', $$Kunci Jawaban$$)),
(gen_random_uuid(), 'a1000005-0000-4000-8000-000000000005', 'PARAGRAPH', 12, jsonb_build_object('text', $$1. Skala adalah perbandingan jarak pada peta dengan jarak sebenarnya di permukaan bumi. 2. Contoh: judul (isi peta), legenda (keterangan simbol), mata angin (penunjuk arah). 3. Cokelat; contoh: Gunung Semeru di Jawa Timur atau Gunung Rinjani di Lombok.$$))
ON CONFLICT (id) DO NOTHING;

-- ============ 6. SCH-SMA-FIS2-001 ============
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, status, created_by, updated_by)
VALUES ('a1000006-0000-4000-8000-000000000006', 'SCH-SMA-FIS2-001', 'd5555555-5555-5555-5555-555555555555',
'Fisika Kelas 11: Hukum Newton tentang Gravitasi',
'fisika-kelas-11-hukum-newton-gravitasi',
'Materi fisika kelas 11 SMA: hukum gravitasi Newton, percepatan gravitasi, dan penerapannya beserta contoh soal.',
'id', 7, 'DRAFT', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (id) DO NOTHING;

INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
(gen_random_uuid(), 'a1000006-0000-4000-8000-000000000006', 'HEADING', 1, jsonb_build_object('text', $$Tujuan Pembelajaran$$)),
(gen_random_uuid(), 'a1000006-0000-4000-8000-000000000006', 'PARAGRAPH', 2, jsonb_build_object('text', $$Setelah mempelajari materi ini, kamu diharapkan mampu: (1) menyatakan bunyi hukum gravitasi Newton, (2) menghitung gaya gravitasi antara dua benda, (3) menjelaskan percepatan gravitasi bumi, dan (4) menganalisis gerak satelit.$$)),
(gen_random_uuid(), 'a1000006-0000-4000-8000-000000000006', 'HEADING', 3, jsonb_build_object('text', $$Bunyi Hukum Gravitasi Newton$$)),
(gen_random_uuid(), 'a1000006-0000-4000-8000-000000000006', 'PARAGRAPH', 4, jsonb_build_object('text', $$"Setiap dua benda bermassa saling menarik dengan gaya yang sebanding dengan hasil kali massa keduanya dan berbanding terbalik dengan kuadrat jarak antara keduanya." Rumusnya: F = G × m₁ × m₂ / r², dengan G = 6,67 × 10⁻¹¹ N·m²/kg² (tetapan gravitasi umum).$$)),
(gen_random_uuid(), 'a1000006-0000-4000-8000-000000000006', 'HEADING', 5, jsonb_build_object('text', $$Percepatan Gravitasi Bumi$$)),
(gen_random_uuid(), 'a1000006-0000-4000-8000-000000000006', 'PARAGRAPH', 6, jsonb_build_object('text', $$Di permukaan bumi, percepatan gravitasi g ≈ 9,8 m/s² (sering dibulatkan 10 m/s² untuk soal). Nilai ini didapat dari rumus gravitasi dengan massa bumi M = 5,97 × 10²⁴ kg dan jari-jari bumi R = 6,37 × 10⁶ m: g = G × M / R². Gravitasi berkurang dengan ketinggian — di puncak gunung sedikit lebih kecil daripada di pantai.$$)),
(gen_random_uuid(), 'a1000006-0000-4000-8000-000000000006', 'HEADING', 7, jsonb_build_object('text', $$Contoh Soal 1$$)),
(gen_random_uuid(), 'a1000006-0000-4000-8000-000000000006', 'PARAGRAPH', 8, jsonb_build_object('text', $$Dua benda masing-masing 2 kg dan 3 kg terpisah 1 meter. Berapa gaya gravitasinya? Penyelesaian: F = G × m₁ × m₂ / r² = 6,67×10⁻¹¹ × 2 × 3 / 1² = 4,0 × 10⁻¹⁰ N. Sangat kecil — gravitasi antar benda sehari-hari memang tidak terasa; yang terasa adalah gravitasi bumi karena massanya raksasa.$$)),
(gen_random_uuid(), 'a1000006-0000-4000-8000-000000000006', 'HEADING', 9, jsonb_build_object('text', $$Contoh Soal 2: Berat di Bulan$$)),
(gen_random_uuid(), 'a1000006-0000-4000-8000-000000000006', 'PARAGRAPH', 10, jsonb_build_object('text', $$Gravitasi bulan ≈ 1/6 gravitasi bumi (≈1,6 m/s²). Seorang astronot bermassa 60 kg beratnya di bumi W = m × g = 60 × 9,8 = 588 N, sedangkan di bulan W = 60 × 1,6 = 96 N. Itulah sebabnya astronot bisa melompat tinggi di bulan — massanya tetap, beratnya yang berubah.$$)),
(gen_random_uuid(), 'a1000006-0000-4000-8000-000000000006', 'HEADING', 11, jsonb_build_object('text', $$Latihan dan Kunci$$)),
(gen_random_uuid(), 'a1000006-0000-4000-8000-000000000006', 'PARAGRAPH', 12, jsonb_build_object('text', $$Soal: (1) Tuliskan rumus hukum gravitasi Newton beserta keterangannya. (2) Jika jarak dua benda dijadikan 2 kali semula, berapa kali gaya gravitasinya? Kunci: (1) F = G·m₁·m₂/r²; F = gaya (N), G = tetapan, m = massa (kg), r = jarak (m). (2) Menjadi 1/4 kali semula, karena berbanding terbalik dengan kuadrat jarak: F' = F/(2²) = F/4.$$))
ON CONFLICT (id) DO NOTHING;
