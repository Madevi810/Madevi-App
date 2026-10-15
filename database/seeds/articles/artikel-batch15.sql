-- Artikel konten Madevi batch 15 — 2026-10-13
-- Owner principal: f7125028-187e-44e0-b95b-88b69b8d5c9a

-- ============ 1. TUT-MOTIVASI-001 ============
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, status, created_by, updated_by)
VALUES ('f1000001-0000-0000-0000-000000000001', 'TUT-MOTIVASI-001', 'b5555555-5555-5555-5555-555555555555',
'Tetap Semangat Saat Gagal: Cara Bangkit Lagi', 'tetap-semangat-saat-gagal-bangkit-lagi',
'Panduan praktis menghadapi kegagalan: menerima, memproses, memetik pelajaran, dan bangkit dengan langkah konkret.',
'id', 7, 'DRAFT', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (id) DO NOTHING;

INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
(gen_random_uuid(), 'f1000001-0000-0000-0000-000000000001', 'HEADING', 1, jsonb_build_object('text', $$Masalah: Terpuruk Setelah Gagal$$)),
(gen_random_uuid(), 'f1000001-0000-0000-0000-000000000001', 'PARAGRAPH', 2, jsonb_build_object('text', $$Gagal ujian, gagal bisnis, ditolak kerja, atau rencana berantakan — rasanya ingin menyerah. Pikiran dipenuhi rasa malu, kecewa, dan takut mencoba lagi. Ini wajar, tapi jangan biarkan berlarut-larut.$$)),
(gen_random_uuid(), 'f1000001-0000-0000-0000-000000000001', 'HEADING', 3, jsonb_build_object('text', $$Penjelasan: Kegagalan Bukan Identitas$$)),
(gen_random_uuid(), 'f1000001-0000-0000-0000-000000000001', 'PARAGRAPH', 4, jsonb_build_object('text', $$Kegagalan adalah peristiwa, bukan identitas. Otak kita cenderung membesar-besarkan (negativity bias) — satu kegagalan terasa menghapus semua keberhasilan. Kenyataannya, hampir semua orang sukses pernah gagal berulang kali sebelum berhasil.$$)),
(gen_random_uuid(), 'f1000001-0000-0000-0000-000000000001', 'HEADING', 5, jsonb_build_object('text', $$Alat yang Dibutuhkan$$)),
(gen_random_uuid(), 'f1000001-0000-0000-0000-000000000001', 'LIST', 6, jsonb_build_object('items', ARRAY[$$Buku catatan atau aplikasi catatan$$, $$Waktu tenang 30 menit tanpa gangguan$$, $$Satu orang yang bisa diajak bicara jujur$$])),
(gen_random_uuid(), 'f1000001-0000-0000-0000-000000000001', 'HEADING', 7, jsonb_build_object('text', $$Langkah Bangkit$$)),
(gen_random_uuid(), 'f1000001-0000-0000-0000-000000000001', 'LIST', 8, jsonb_build_object('items', ARRAY[$$1. Akui perasaan — tulis apa yang dirasakan tanpa sensor, 10 menit$$, $$2. Pisahkan fakta dari cerita — apa yang benar-benar terjadi vs apa yang ditakutkan$$, $$3. Cari 1 pelajaran konkret — apa yang bisa dilakukan berbeda lain kali?$$, $$4. Buat rencana kecil 7 hari — langkah sekecil mungkin yang bisa dilakukan besok$$, $$5. Lakukan langkah pertama dalam 48 jam — momentum mengalahkan motivasi$$])),
(gen_random_uuid(), 'f1000001-0000-0000-0000-000000000001', 'HEADING', 9, jsonb_build_object('text', $$Risiko$$)),
(gen_random_uuid(), 'f1000001-0000-0000-0000-000000000001', 'PARAGRAPH', 10, jsonb_build_object('text', $$Jangan terburu-buru "move on" tanpa memproses — emosi yang ditahan akan meledak nanti. Sebaliknya, jangan juga terjebak meratapi terlalu lama; batasi masa berkabung maksimal 1-2 minggu lalu bergerak. Jika sedih berkepanjangan lebih dari sebulan dan mengganggu fungsi sehari-hari, pertimbangkan konseling profesional.$$)),
(gen_random_uuid(), 'f1000001-0000-0000-0000-000000000001', 'HEADING', 11, jsonb_build_object('text', $$Penyelesaian$$)),
(gen_random_uuid(), 'f1000001-0000-0000-0000-000000000001', 'PARAGRAPH', 12, jsonb_build_object('text', $$Bangkit bukan berarti langsung berhasil — artinya berani mencoba lagi dengan bekal pelajaran. Rayakan setiap langkah kecil. Ingat: orang yang tidak pernah gagal adalah orang yang tidak pernah mencoba hal berarti.$$))
ON CONFLICT (id) DO NOTHING;

-- ============ 2. TUT-HEWAN-001 ============
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, status, created_by, updated_by)
VALUES ('f1000002-0000-0000-0000-000000000002', 'TUT-HEWAN-001', 'b2222222-2222-2222-2222-222222222222',
'Merawat Kucing untuk Pemula: Panduan Lengkap', 'merawat-kucing-untuk-pemula-panduan',
'Panduan lengkap merawat kucing untuk pemilik baru: makanan, litter box, vaksinasi, dan tanda kucing sehat.',
'id', 8, 'DRAFT', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (id) DO NOTHING;

INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
(gen_random_uuid(), 'f1000002-0000-0000-0000-000000000002', 'HEADING', 1, jsonb_build_object('text', $$Masalah: Bingung Merawat Kucing Pertama$$)),
(gen_random_uuid(), 'f1000002-0000-0000-0000-000000000002', 'PARAGRAPH', 2, jsonb_build_object('text', $$Baru adopsi kucing tapi tidak tahu harus mulai dari mana — makanan apa, seberapa sering makan, perlu vaksin apa, dan bagaimana tahu kucing sehat atau sakit.$$)),
(gen_random_uuid(), 'f1000002-0000-0000-0000-000000000002', 'HEADING', 3, jsonb_build_object('text', $$Penjelasan: Kebutuhan Dasar Kucing$$)),
(gen_random_uuid(), 'f1000002-0000-0000-0000-000000000002', 'PARAGRAPH', 4, jsonb_build_object('text', $$Kucing butuh 5 hal pokok: makanan bergizi, air bersih, tempat buang air (litter box), tempat tidur aman, dan perawatan kesehatan rutin. Kucing adalah karnivora obligat — mereka wajib makan protein hewani.$$)),
(gen_random_uuid(), 'f1000002-0000-0000-0000-000000000002', 'HEADING', 5, jsonb_build_object('text', $$Alat yang Dibutuhkan$$)),
(gen_random_uuid(), 'f1000002-0000-0000-0000-000000000002', 'LIST', 6, jsonb_build_object('items', ARRAY[$$Makanan kucing (dry food + wet food)$$, $$Litter box + pasir kucing$$, $$Mangkok makan dan minum (stainless/ceramic)$$, $$Carrier untuk ke dokter hewan$$, $$Sisir bulu dan mainan$$])),
(gen_random_uuid(), 'f1000002-0000-0000-0000-000000000002', 'HEADING', 7, jsonb_build_object('text', $$Langkah Perawatan Harian$$)),
(gen_random_uuid(), 'f1000002-0000-0000-0000-000000000002', 'LIST', 8, jsonb_build_object('items', ARRAY[$$1. Beri makan 2-3 kali sehari sesuai usia (kitten butuh lebih sering)$$, $$2. Ganti air minum setiap hari, cuci mangkoknya$$, $$3. Bersihkan litter box minimal 1 kali sehari$$, $$4. Sisir bulu 2-3 kali seminggu (setiap hari untuk ras berbulu panjang)$$, $$5. Ajak bermain 15 menit sehari untuk stimulasi$$, $$6. Vaksinasi rutin: F3/F4 tahunan + rabies sesuai jadwal dokter$$])),
(gen_random_uuid(), 'f1000002-0000-0000-0000-000000000002', 'HEADING', 9, jsonb_build_object('text', $$Risiko$$)),
(gen_random_uuid(), 'f1000002-0000-0000-0000-000000000002', 'PARAGRAPH', 10, jsonb_build_object('text', $$Jangan beri susu sapi (kebanyakan kucing intoleran laktosa), cokelat, bawang, atau tulang ikan yang bisa melukai. Jangan mandikan terlalu sering — kucing membersihkan diri sendiri. Waspadai tanda sakit: tidak mau makan 24 jam, lesu, muntah/diare berulang — segera ke dokter hewan.$$)),
(gen_random_uuid(), 'f1000002-0000-0000-0000-000000000002', 'HEADING', 11, jsonb_build_object('text', $$Penyelesaian$$)),
(gen_random_uuid(), 'f1000002-0000-0000-0000-000000000002', 'PARAGRAPH', 12, jsonb_build_object('text', $$Kucing yang dirawat baik bisa hidup 12-18 tahun. Biaya bulanan rata-rata Rp300-600 ribu untuk makanan dan pasir. Sterilisasi dianjurkan untuk kucing yang tidak dikembangbiakkan — lebih sehat dan mengurangi perilaku bermasalah.$$))
ON CONFLICT (id) DO NOTHING;

-- ============ 3. EXP-MIKROBIOLOGI-001 ============
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, status, created_by, updated_by)
VALUES ('f1000003-0000-0000-0000-000000000003', 'EXP-MIKROBIOLOGI-001', 'cabbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
'Bakteri: Kawan dan Lawan Manusia', 'bakteri-kawan-dan-lawan-manusia',
'Mengenal dunia bakteri: struktur, jenis menguntungkan dan berbahaya, serta peran bakteri dalam kehidupan.',
'id', 6, 'DRAFT', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (id) DO NOTHING;

INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
(gen_random_uuid(), 'f1000003-0000-0000-0000-000000000003', 'HEADING', 1, jsonb_build_object('text', $$Apa Itu Bakteri$$)),
(gen_random_uuid(), 'f1000003-0000-0000-0000-000000000003', 'PARAGRAPH', 2, jsonb_build_object('text', $$Bakteri adalah mikroorganisme bersel satu (prokariota) yang tidak memiliki membran inti. Ukurannya 0,5-5 mikrometer — sekitar 100 kali lebih kecil dari sel manusia. Bakteri ada di mana-mana: tanah, air, udara, bahkan di dalam tubuh kita — jumlah sel bakteri di tubuh manusia hampir sama banyaknya dengan sel manusia itu sendiri.$$)),
(gen_random_uuid(), 'f1000003-0000-0000-0000-000000000003', 'HEADING', 3, jsonb_build_object('text', $$Struktur dan Bentuk$$)),
(gen_random_uuid(), 'f1000003-0000-0000-0000-000000000003', 'PARAGRAPH', 4, jsonb_build_object('text', $$Bakteri punya dinding sel, membran, sitoplasma, ribosom, dan DNA melingkar (nukleoid). Bentuknya tiga macam: kokus (bulat, mis. Staphylococcus), basil (batang, mis. E. coli), dan spiril (spiral, mis. penyebab sifilis).$$)),
(gen_random_uuid(), 'f1000003-0000-0000-0000-000000000003', 'HEADING', 5, jsonb_build_object('text', $$Bakteri Kawan$$)),
(gen_random_uuid(), 'f1000003-0000-0000-0000-000000000003', 'PARAGRAPH', 6, jsonb_build_object('text', $$Sebagian besar bakteri tidak berbahaya, bahkan bermanfaat. Lactobacillus membuat yoghurt dan membantu pencernaan. Rhizobium di akar kacang-kacangan mengikat nitrogen untuk tanah. Bakteri usus (mikrobioma) membantu mencerna makanan dan melatih sistem imun.$$)),
(gen_random_uuid(), 'f1000003-0000-0000-0000-000000000003', 'HEADING', 7, jsonb_build_object('text', $$Bakteri Lawan$$)),
(gen_random_uuid(), 'f1000003-0000-0000-0000-000000000003', 'PARAGRAPH', 8, jsonb_build_object('text', $$Sebagian kecil bakteri menyebabkan penyakit (patogen): Mycobacterium tuberculosis (TBC), Vibrio cholerae (kolera), Salmonella (tifus/keracunan makanan). Antibiotik membunuh bakteri, tetapi penggunaan sembarangan memicu resistensi antibiotik — ancaman kesehatan global.$$)),
(gen_random_uuid(), 'f1000003-0000-0000-0000-000000000003', 'HEADING', 9, jsonb_build_object('text', $$Peran dalam Kehidupan$$)),
(gen_random_uuid(), 'f1000003-0000-0000-0000-000000000003', 'PARAGRAPH', 10, jsonb_build_object('text', $$Tanpa bakteri, kehidupan kolaps: mereka mengurai sampah organik, mendaur ulang nitrogen dan karbon, memfermentasi makanan (tempe, keju, kimchi), dan dipakai di bioteknologi untuk membuat insulin dan enzim. Louis Pasteur membuktikan kaitan bakteri-penyakit lewat teori kuman pada abad ke-19.$$))
ON CONFLICT (id) DO NOTHING;

-- ============ 4. EXP-TEKNOLOGI2-001 ============
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, status, created_by, updated_by)
VALUES ('f1000004-0000-0000-0000-000000000004', 'EXP-TEKNOLOGI2-001', 'c7777777-7777-7777-7777-777777777777',
'Blockchain: Lebih dari Sekadar Kripto', 'blockchain-lebih-dari-sekadar-kripto',
'Memahami teknologi blockchain: cara kerja, keunggulan, dan penerapannya di luar mata uang kripto.',
'id', 6, 'DRAFT', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (id) DO NOTHING;

INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
(gen_random_uuid(), 'f1000004-0000-0000-0000-000000000004', 'HEADING', 1, jsonb_build_object('text', $$Apa Itu Blockchain$$)),
(gen_random_uuid(), 'f1000004-0000-0000-0000-000000000004', 'PARAGRAPH', 2, jsonb_build_object('text', $$Blockchain adalah buku kas digital terdistribusi: catatan transaksi disimpan dalam "blok" yang dirantai secara kriptografis, dan salinannya tersebar di ribuan komputer (node). Tidak ada satu pihak pun yang mengendalikan — inilah yang membuatnya sulit dipalsukan.$$)),
(gen_random_uuid(), 'f1000004-0000-0000-0000-000000000004', 'HEADING', 3, jsonb_build_object('text', $$Cara Kerja$$)),
(gen_random_uuid(), 'f1000004-0000-0000-0000-000000000004', 'PARAGRAPH', 4, jsonb_build_object('text', $$Setiap blok berisi data transaksi, cap waktu, dan hash blok sebelumnya — seperti rantai yang saling mengunci. Untuk mengubah satu blok, penyerang harus mengubah semua blok setelahnya di mayoritas node sekaligus: praktis mustahil. Mekanisme konsensus (Proof of Work, Proof of Stake) memastikan semua node sepakat pada satu versi kebenaran.$$)),
(gen_random_uuid(), 'f1000004-0000-0000-0000-000000000004', 'HEADING', 5, jsonb_build_object('text', $$Tiga Sifat Kunci$$)),
(gen_random_uuid(), 'f1000004-0000-0000-0000-000000000004', 'PARAGRAPH', 6, jsonb_build_object('text', $$Desentralisasi (tanpa otoritas tunggal), transparansi (semua bisa memverifikasi), dan immutabilitas (catatan tidak bisa diubah mundur). Kombinasi ini menciptakan "kepercayaan tanpa perantara".$$)),
(gen_random_uuid(), 'f1000004-0000-0000-0000-000000000004', 'HEADING', 7, jsonb_build_object('text', $$Di Luar Kripto$$)),
(gen_random_uuid(), 'f1000004-0000-0000-0000-000000000004', 'PARAGRAPH', 8, jsonb_build_object('text', $$Smart contract (Ethereum) mengeksekusi perjanjian otomatis tanpa notaris. Supply chain memakai blockchain untuk melacak asal barang. Sertifikat tanah, ijazah, dan identitas digital bisa diverifikasi tanpa birokrasi berlapis. Bahkan voting elektronik sedang diujicobakan di beberapa negara.$$)),
(gen_random_uuid(), 'f1000004-0000-0000-0000-000000000004', 'HEADING', 9, jsonb_build_object('text', $$Keterbatasan$$)),
(gen_random_uuid(), 'f1000004-0000-0000-0000-000000000004', 'PARAGRAPH', 10, jsonb_build_object('text', $$Blockchain lambat dibanding database biasa (Bitcoin ~7 transaksi/detik vs Visa ~24.000). Proof of Work boros energi. Dan "kode adalah hukum" berarti bug di smart contract bisa berakibat fatal tanpa jalan banding. Teknologi ini alat, bukan sihir — cocok untuk kasus yang butuh kepercayaan tanpa perantara, berlebihan untuk yang tidak.$$))
ON CONFLICT (id) DO NOTHING;

-- ============ 5. SCH-SMP-ING-001 ============
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, status, created_by, updated_by)
VALUES ('f1000005-0000-0000-0000-000000000005', 'SCH-SMP-ING-001', 'd4444444-4444-4444-4444-444444444444',
'Bahasa Inggris Kelas 8: Simple Past Tense', 'bahasa-inggris-kelas-8-simple-past-tense',
'Materi simple past tense kelas 8 SMP: rumus, regular vs irregular verbs, contoh kalimat, dan latihan soal.',
'id', 7, 'DRAFT', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (id) DO NOTHING;

INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
(gen_random_uuid(), 'f1000005-0000-0000-0000-000000000005', 'HEADING', 1, jsonb_build_object('text', $$Tujuan Pembelajaran$$)),
(gen_random_uuid(), 'f1000005-0000-0000-0000-000000000005', 'PARAGRAPH', 2, jsonb_build_object('text', $$Setelah mempelajari materi ini, kamu dapat: (1) menjelaskan fungsi simple past tense, (2) membedakan regular dan irregular verbs, (3) membuat kalimat positif, negatif, dan tanya dalam simple past tense.$$)),
(gen_random_uuid(), 'f1000005-0000-0000-0000-000000000005', 'HEADING', 3, jsonb_build_object('text', $$Kapan Dipakai$$)),
(gen_random_uuid(), 'f1000005-0000-0000-0000-000000000005', 'PARAGRAPH', 4, jsonb_build_object('text', $$Simple past tense dipakai untuk kejadian yang sudah selesai di masa lalu, biasanya disertai keterangan waktu: yesterday, last night, two days ago, in 2020. Contoh: "I visited my grandmother yesterday."$$)),
(gen_random_uuid(), 'f1000005-0000-0000-0000-000000000005', 'HEADING', 5, jsonb_build_object('text', $$Rumus$$)),
(gen_random_uuid(), 'f1000005-0000-0000-0000-000000000005', 'LIST', 6, jsonb_build_object('items', ARRAY[$$Positif: Subject + Verb-2 + Object (I played football)$$, $$Negatif: Subject + did not + Verb-1 (I did not play football)$$, $$Tanya: Did + Subject + Verb-1? (Did you play football?)$$])),
(gen_random_uuid(), 'f1000005-0000-0000-0000-000000000005', 'HEADING', 7, jsonb_build_object('text', $$Regular vs Irregular Verbs$$)),
(gen_random_uuid(), 'f1000005-0000-0000-0000-000000000005', 'PARAGRAPH', 8, jsonb_build_object('text', $$Regular verbs: tambah -ed (play → played, watch → watched, study → studied). Irregular verbs: bentuknya berubah dan harus dihafal (go → went, eat → ate, buy → bought, see → saw). Daftar 20 irregular verbs paling umum wajib dihafal.$$)),
(gen_random_uuid(), 'f1000005-0000-0000-0000-000000000005', 'HEADING', 9, jsonb_build_object('text', $$Contoh Kalimat$$)),
(gen_random_uuid(), 'f1000005-0000-0000-0000-000000000005', 'LIST', 10, jsonb_build_object('items', ARRAY[$$She cooked rendang last night. (Dia memasak rendang tadi malam.)$$, $$They did not come to the party. (Mereka tidak datang ke pesta.)$$, $$Did he finish his homework? (Apakah dia menyelesaikan PR-nya?)$$])),
(gen_random_uuid(), 'f1000005-0000-0000-0000-000000000005', 'HEADING', 11, jsonb_build_object('text', $$Latihan Soal$$)),
(gen_random_uuid(), 'f1000005-0000-0000-0000-000000000005', 'LIST', 12, jsonb_build_object('items', ARRAY[$$1. Ubah ke past tense: "She (go) to school by bus yesterday."$$, $$2. Buat kalimat negatif: "We watched a movie last weekend."$$, $$3. Buat kalimat tanya: "He bought a new bike."$$])),
(gen_random_uuid(), 'f1000005-0000-0000-0000-000000000005', 'HEADING', 13, jsonb_build_object('text', $$Kunci Jawaban$$)),
(gen_random_uuid(), 'f1000005-0000-0000-0000-000000000005', 'LIST', 14, jsonb_build_object('items', ARRAY[$$1. She went to school by bus yesterday. (go → went, irregular)$$, $$2. We did not watch a movie last weekend. (did not + verb-1)$$, $$3. Did he buy a new bike? (did + subject + verb-1)$$]))
ON CONFLICT (id) DO NOTHING;

-- ============ 6. SCH-SD-IPA2-001 ============
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, status, created_by, updated_by)
VALUES ('f1000006-0000-0000-0000-000000000006', 'SCH-SD-IPA2-001', 'd1000003-0000-0000-0000-000000000003',
'IPA Kelas 5: Rantai Makanan dan Jaring-jaring Makanan', 'ipa-kelas-5-rantai-makanan',
'Materi IPA kelas 5 SD: rantai makanan, peran produsen-konsumen-pengurai, dan contoh rantai makanan di sawah.',
'id', 7, 'DRAFT', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (id) DO NOTHING;

INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
(gen_random_uuid(), 'f1000006-0000-0000-0000-000000000006', 'HEADING', 1, jsonb_build_object('text', $$Tujuan Pembelajaran$$)),
(gen_random_uuid(), 'f1000006-0000-0000-0000-000000000006', 'PARAGRAPH', 2, jsonb_build_object('text', $$Setelah belajar, kamu dapat: (1) menjelaskan apa itu rantai makanan, (2) menyebutkan peran produsen, konsumen, dan pengurai, (3) memberi contoh rantai makanan di lingkungan sekitar.$$)),
(gen_random_uuid(), 'f1000006-0000-0000-0000-000000000006', 'HEADING', 3, jsonb_build_object('text', $$Apa Itu Rantai Makanan$$)),
(gen_random_uuid(), 'f1000006-0000-0000-0000-000000000006', 'PARAGRAPH', 4, jsonb_build_object('text', $$Rantai makanan adalah urutan "siapa makan siapa" di alam. Energi mengalir dari satu makhluk ke makhluk lain: tumbuhan dimakan hewan, hewan dimakan hewan lain, dan seterusnya. Panah rantai makanan selalu menunjuk ke arah pemakan.$$)),
(gen_random_uuid(), 'f1000006-0000-0000-0000-000000000006', 'HEADING', 5, jsonb_build_object('text', $$Tiga Peran Penting$$)),
(gen_random_uuid(), 'f1000006-0000-0000-0000-000000000006', 'LIST', 6, jsonb_build_object('items', ARRAY[$$Produsen: membuat makanan sendiri lewat fotosintesis — contoh: padi, rumput, ganggang$$, $$Konsumen: memakan makhluk lain — konsumen I (herbivora: belalang, kelinci), konsumen II (karnivora: katak, burung), konsumen III (elang, ular)$$, $$Pengurai (dekomposer): menguraikan sisa makhluk mati — contoh: jamur, bakteri$$])),
(gen_random_uuid(), 'f1000006-0000-0000-0000-000000000006', 'HEADING', 7, jsonb_build_object('text', $$Contoh: Rantai Makanan di Sawah$$)),
(gen_random_uuid(), 'f1000006-0000-0000-0000-000000000006', 'PARAGRAPH', 8, jsonb_build_object('text', $$Padi → belalang → katak → ular → elang. Padi (produsen) dimakan belalang (konsumen I), belalang dimakan katak (konsumen II), katak dimakan ular (konsumen III), ular dimakan elang (konsumen puncak).$$)),
(gen_random_uuid(), 'f1000006-0000-0000-0000-000000000006', 'HEADING', 9, jsonb_build_object('text', $$Jaring-jaring Makanan$$)),
(gen_random_uuid(), 'f1000006-0000-0000-0000-000000000006', 'PARAGRAPH', 10, jsonb_build_object('text', $$Di alam nyata, satu hewan bisa makan banyak jenis makanan — gabungan beberapa rantai makanan disebut jaring-jaring makanan. Makin beragam, makin seimbang ekosistemnya. Jika satu jenis punah, jaring-jaring bisa terganggu.$$)),
(gen_random_uuid(), 'f1000006-0000-0000-0000-000000000006', 'HEADING', 11, jsonb_build_object('text', $$Latihan Soal$$)),
(gen_random_uuid(), 'f1000006-0000-0000-0000-000000000006', 'LIST', 12, jsonb_build_object('items', ARRAY[$$1. Sebutkan 3 contoh produsen!$$, $$2. Dalam rantai "rumput → kelinci → rubah", siapa konsumen I?$$, $$3. Apa peran jamur dalam rantai makanan?$$])),
(gen_random_uuid(), 'f1000006-0000-0000-0000-000000000006', 'HEADING', 13, jsonb_build_object('text', $$Kunci Jawaban$$)),
(gen_random_uuid(), 'f1000006-0000-0000-0000-000000000006', 'LIST', 14, jsonb_build_object('items', ARRAY[$$1. Padi, rumput, ganggang (tumbuhan hijau yang berfotosintesis)$$, $$2. Kelinci — karena memakan produsen (rumput)$$, $$3. Pengurai — menguraikan sisa makhluk hidup yang mati$$]))
ON CONFLICT (id) DO NOTHING;
