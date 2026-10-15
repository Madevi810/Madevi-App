-- Artikel konten Madevi batch 26 — 2026-10-13
-- Owner principal: f7125028-187e-44e0-b95b-88b69b8d5c9a
-- Idempotent: ON CONFLICT DO NOTHING

-- ============ 1. TUT-ANAK-001 ============
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, status, created_by, updated_by)
VALUES ('25ad376d-3669-4611-8d26-3cf6a601e4a1', 'TUT-ANAK-001', 'b5555555-5555-5555-5555-555555555555',
'Anak Tantrum: Cara Tenang Menghadapinya', 'anak-tantrum-cara-tenang-menghadapinya',
'Tantrum adalah ledakan emosi normal pada anak usia 1-4 tahun. Panduan tenang menghadapi, menenangkan, dan mencegah tantrum berulang.',
'id', 7, 'DRAFT', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (id) DO NOTHING;

INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
(gen_random_uuid(), '25ad376d-3669-4611-8d26-3cf6a601e4a1', 'HEADING', 1, jsonb_build_object('text', $$Masalah: Anak Tantrum Tiba-tiba$$)),
(gen_random_uuid(), '25ad376d-3669-4611-8d26-3cf6a601e4a1', 'PARAGRAPH', 2, jsonb_build_object('text', $$Anak menangis keras, berguling, memukul, atau melempar barang saat keinginannya tidak dipenuhi. Orang tua panik, malu di depan umum, lalu membentak atau menyerah dan memberi apa yang diminta. Pola ini justru membuat tantrum makin sering.$$)),
(gen_random_uuid(), '25ad376d-3669-4611-8d26-3cf6a601e4a1', 'HEADING', 3, jsonb_build_object('text', $$Penjelasan: Kenapa Tantrum Terjadi$$)),
(gen_random_uuid(), '25ad376d-3669-4611-8d26-3cf6a601e4a1', 'PARAGRAPH', 4, jsonb_build_object('text', $$Otak anak usia 1-4 tahun belum bisa mengatur emosi dan menyampaikan keinginan dengan kata-kata. Lapar, lelah, sakit, atau lingkungan baru memperburuk ledakan. Tantrum adalah fase perkembangan normal, bukan kenakalan$$)),
(gen_random_uuid(), '25ad376d-3669-4611-8d26-3cf6a601e4a1', 'HEADING', 5, jsonb_build_object('text', $$Persiapan: Tenangkan Diri Sendiri$$)),
(gen_random_uuid(), '25ad376d-3669-4611-8d26-3cf6a601e4a1', 'LIST', 6, jsonb_build_object('items', ARRAY[$$Tarik napas panjang sebelum bereaksi$$, $$Jauhkan benda berbahaya dari jangkauan anak$$, $$Pindah ke tempat yang tenang jika di depan umum$$])),
(gen_random_uuid(), '25ad376d-3669-4611-8d26-3cf6a601e4a1', 'HEADING', 7, jsonb_build_object('text', $$Langkah Menghadapi Tantrum$$)),
(gen_random_uuid(), '25ad376d-3669-4611-8d26-3cf6a601e4a1', 'LIST', 8, jsonb_build_object('items', ARRAY[$$1. Tetap tenang dan diam dekat anak, jangan ikut emosi$$, $$2. Akui perasaannya: "Kamu kesal karena mainannya direbut, ya"$$, $$3. Jangan ceramahi saat tantrum; otak anak tidak bisa menerima logika saat itu$$, $$4. Tunggu ledakan mereda, lalu tawarkan pelukan$$, $$5. Setelah tenang, bantu anak bicara: "Kalau marah, bilang pakai kata-kata, jangan lempar"$$, $$6. Konsisten: jangan mengabulkan keinginan yang dituntut dengan tantrum$$])),
(gen_random_uuid(), '25ad376d-3669-4611-8d26-3cf6a601e4a1', 'HEADING', 9, jsonb_build_object('text', $$Risiko yang Harus Dihindari$$)),
(gen_random_uuid(), '25ad376d-3669-4611-8d26-3cf6a601e4a1', 'PARAGRAPH', 10, jsonb_build_object('text', $$Jangan memukul, menyentak, atau mengunci anak di ruangan gelap — melanggar martabat anak dan memperburuk trauma. Jangan menyuap dengan gadget atau jajan setiap tantrum; anak belajar bahwa tantrum = hadiah$$)),
(gen_random_uuid(), '25ad376d-3669-4611-8d26-3cf6a601e4a1', 'HEADING', 11, jsonb_build_object('text', $$Mencegah Tantrum Berulang$$)),
(gen_random_uuid(), '25ad376d-3669-4611-8d26-3cf6a601e4a1', 'LIST', 12, jsonb_build_object('items', ARRAY[$$Terapkan jadwal makan dan tidur teratur$$, $$Beri pilihan terbatas: "Mau baju merah atau biru?"$$, $$Siapkan anak sebelum transisi: "Lima menit lagi kita pulang"$$, $$Beri perhatian positif saat anak bersikap baik$$]))
ON CONFLICT (id) DO NOTHING;

-- ============ 2. TUT-LANSIA-001 ============
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, status, created_by, updated_by)
VALUES ('84896fbd-fb4c-4907-af7f-e478c02a2a44', 'TUT-LANSIA-001', 'b2222222-2222-2222-2222-222222222222',
'Merawat Orang Tua Lansia di Rumah', 'merawat-orang-tua-lansia-di-rumah',
'Panduan praktis merawat orang tua lanjut usia di rumah: kebutuhan harian, keamanan, kesehatan, dan menjaga kewarasan perawat keluarga.',
'id', 8, 'DRAFT', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (id) DO NOTHING;

INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
(gen_random_uuid(), '84896fbd-fb4c-4907-af7f-e478c02a2a44', 'HEADING', 1, jsonb_build_object('text', $$Masalah: Orang Tua Makin Rentan$$)),
(gen_random_uuid(), '84896fbd-fb4c-4907-af7f-e478c02a2a44', 'PARAGRAPH', 2, jsonb_build_object('text', $$Orang tua sering jatuh, lupa minum obat, nafsu makan menurun, dan mulai menarik diri. Anak yang merawat kewalahan membagi waktu antara pekerjaan, anak sendiri, dan orang tua. Rasa bersalah dan lelah menumpuk$$)),
(gen_random_uuid(), '84896fbd-fb4c-4907-af7f-e478c02a2a44', 'HEADING', 3, jsonb_build_object('text', $$Penjelasan: Perubahan pada Lansia$$)),
(gen_random_uuid(), '84896fbd-fb4c-4907-af7f-e478c02a2a44', 'PARAGRAPH', 4, jsonb_build_object('text', $$Penuaan menurunkan massa otot, keseimbangan, daya ingat, dan fungsi organ. Bukan kemunduran yang bisa "disembuhkan", melainkan kondisi yang dikelola. Tujuan perawatan: aman, nyaman, dan bermartabat$$)),
(gen_random_uuid(), '84896fbd-fb4c-4907-af7f-e478c02a2a44', 'HEADING', 5, jsonb_build_object('text', $$Persiapan Rumah yang Aman$$)),
(gen_random_uuid(), '84896fbd-fb4c-4907-af7f-e478c02a2a44', 'LIST', 6, jsonb_build_object('items', ARRAY[$$Pasang pegangan (handrail) di kamar mandi dan tangga$$, $$Singkirkan karpet licin dan kabel melintang$$, $$Pencahayaan cukup, lampu malam di koridor$$, $$Kotak obat mingguan (pill organizer) berlabel hari$$])),
(gen_random_uuid(), '84896fbd-fb4c-4907-af7f-e478c02a2a44', 'HEADING', 7, jsonb_build_object('text', $$Langkah Perawatan Harian$$)),
(gen_random_uuid(), '84896fbd-fb4c-4907-af7f-e478c02a2a44', 'LIST', 8, jsonb_build_object('items', ARRAY[$$1. Atur jadwal obat dan catat setiap dosis yang diminum$$, $$2. Pastikan makan 3x dengan protein dan sayur; pantau berat badan$$, $$3. Ajak bergerak ringan tiap hari: jalan 10-15 menit atau senam lansia$$, $$4. Jaga kebersihan diri: mandi, ganti pakaian, potong kuku$$, $$5. Ajak bicara dan libatkan dalam kegiatan keluarga agar tidak kesepian$$, $$6. Kontrol rutin ke dokter; bawa catatan tekanan darah/gula jika ada$$])),
(gen_random_uuid(), '84896fbd-fb4c-4907-af7f-e478c02a2a44', 'HEADING', 9, jsonb_build_object('text', $$Risiko: Kelelahan Perawat (Caregiver Burnout)$$)),
(gen_random_uuid(), '84896fbd-fb4c-4907-af7f-e478c02a2a44', 'PARAGRAPH', 10, jsonb_build_object('text', $$Merawat sendirian tanpa istirahat memicu stres, emosi meledak, bahkan kekerasan pada lansia. Jangan merasa bersalah meminta bantuan: gantian dengan saudara, sewa perawat home care paruh waktu, atau manfaatkan posyandu lansia di puskesmas$$)),
(gen_random_uuid(), '84896fbd-fb4c-4907-af7f-e478c02a2a44', 'HEADING', 11, jsonb_build_object('text', $$Tanda Bahaya: Segera ke Dokter$$)),
(gen_random_uuid(), '84896fbd-fb4c-4907-af7f-e478c02a2a44', 'LIST', 12, jsonb_build_object('items', ARRAY[$$Jatuh hingga tidak bisa bangun atau pusing berputar$$, $$Sesak napas, nyeri dada, atau bicara pelo mendadak$$, $$Tidak buang air kecil >8 jam atau demam >38,5 derajat$$, $$Perubahan kesadaran: bingung berat atau sulit dibangunkan$$]))
ON CONFLICT (id) DO NOTHING;

-- ============ 3. EXP-ARKTEK-001 ============
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, status, created_by, updated_by)
VALUES ('dd3df960-d984-42b4-9c74-8eb1e184b272', 'EXP-ARKTEK-001', 'c8888888-8888-8888-8888-888888888888',
'Arsitektur Vernakular Indonesia: Rumah Adat', 'arsitektur-vernakular-indonesia-rumah-adat',
'Rumah adat Nusantara adalah teknologi bangunan tanpa arsitek: tahan gempa, sejuk alami, dan sarat makna budaya. Jelajah prinsip dan contohnya.',
'id', 7, 'DRAFT', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (id) DO NOTHING;

INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
(gen_random_uuid(), 'dd3df960-d984-42b4-9c74-8eb1e184b272', 'HEADING', 1, jsonb_build_object('text', $$Apa Itu Arsitektur Vernakular$$)),
(gen_random_uuid(), 'dd3df960-d984-42b4-9c74-8eb1e184b272', 'PARAGRAPH', 2, jsonb_build_object('text', $$Arsitektur vernakular adalah bangunan yang lahir dari kearifan lokal: dirancang masyarakat sendiri tanpa arsitek formal, memakai material setempat, dan disesuaikan dengan iklim serta budaya. Indonesia punya ratusan ragamnya$$)),
(gen_random_uuid(), 'dd3df960-d984-42b4-9c74-8eb1e184b272', 'HEADING', 3, jsonb_build_object('text', $$Prinsip Konstruksi Cerdas$$)),
(gen_random_uuid(), 'dd3df960-d984-42b4-9c74-8eb1e184b272', 'PARAGRAPH', 4, jsonb_build_object('text', $$Rumah panggung menghindari banjir dan binatang, atap tinggi melancarkan sirkulasi udara panas, sambungan kayu tanpa paku (pasak) membuat bangunan lentur saat gempa. Rumah adat Nias dan Minangkabau terbukti selamat dari gempa besar$$)),
(gen_random_uuid(), 'dd3df960-d984-42b4-9c74-8eb1e184b272', 'HEADING', 5, jsonb_build_object('text', $$Contoh Rumah Adat Nusantara$$)),
(gen_random_uuid(), 'dd3df960-d984-42b4-9c74-8eb1e184b272', 'LIST', 6, jsonb_build_object('items', ARRAY[$$Rumah Gadang (Minangkabau): atap gonjong melengkung seperti tanduk kerbau$$, $$Joglo (Jawa): empat saka guru menopang atap tumpang bertingkat$$, $$Tongkonan (Toraja): atap perahu raksasa, simbol status sosial$$, $$Honai (Papua): bundar dari kayu dan jerami, hangat di pegunungan dingin$$, $$Rumah Limas (Sumatera Selatan): bertingkat lima melambangkan jenjang kehidupan$$])),
(gen_random_uuid(), 'dd3df960-d984-42b4-9c74-8eb1e184b272', 'HEADING', 7, jsonb_build_object('text', $$Makna Simbolis$$)),
(gen_random_uuid(), 'dd3df960-d984-42b4-9c74-8eb1e184b272', 'PARAGRAPH', 8, jsonb_build_object('text', $$Denah rumah adat mencerminkan kosmologi: pembagian ruang sakral dan profan, orientasi menghadap gunung atau matahari terbit, serta ukiran yang menceritakan silsilah dan nilai leluhur$$)),
(gen_random_uuid(), 'dd3df960-d984-42b4-9c74-8eb1e184b272', 'HEADING', 9, jsonb_build_object('text', $$Pelajaran untuk Arsitektur Modern$$)),
(gen_random_uuid(), 'dd3df960-d984-42b4-9c74-8eb1e184b272', 'PARAGRAPH', 10, jsonb_build_object('text', $$Arsitek modern kini meniru prinsip vernakular: ventilasi silang alami, material lokal rendah karbon, dan desain tahan bencana. Rumah adat membuktikan teknologi tidak harus mahal untuk cerdas dan berkelanjutan$$))
ON CONFLICT (id) DO NOTHING;

-- ============ 4. EXP-OSEANOGRAFI3-001 ============
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, status, created_by, updated_by)
VALUES ('ef0c32e4-4ac1-4d59-a17b-82c376d9ad64', 'EXP-OSEANOGRAFI3-001', 'c6000001-0000-0000-0000-000000000001',
'Arus Laut: Konveyor Raksasa Bumi', 'arus-laut-konveyor-raksasa-bumi',
'Arus laut mengangkut panas, nutrisi, dan oksigen mengelilingi planet. Kenali arus permukaan, arus dalam, dan perannya bagi iklim Indonesia.',
'id', 7, 'DRAFT', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (id) DO NOTHING;

INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
(gen_random_uuid(), 'ef0c32e4-4ac1-4d59-a17b-82c376d9ad64', 'HEADING', 1, jsonb_build_object('text', $$Laut Tidak Pernah Diam$$)),
(gen_random_uuid(), 'ef0c32e4-4ac1-4d59-a17b-82c376d9ad64', 'PARAGRAPH', 2, jsonb_build_object('text', $$Air laut bergerak dalam pola raksasa yang disebut arus. Arus permukaan digerakkan angin dan berputar membentuk pusaran (gyre) di setiap samudra, sementara arus dalam digerakkan perbedaan suhu dan kadar garam$$)),
(gen_random_uuid(), 'ef0c32e4-4ac1-4d59-a17b-82c376d9ad64', 'HEADING', 3, jsonb_build_object('text', $$Sirkulasi Termohalin: Konveyor Global$$)),
(gen_random_uuid(), 'ef0c32e4-4ac1-4d59-a17b-82c376d9ad64', 'PARAGRAPH', 4, jsonb_build_object('text', $$Air dingin dan asin di Atlantik Utara tenggelam ke dasar laut, lalu mengalir perlahan mengelilingi dunia dalam perjalanan 1.000 tahun. Sabuk konveyor ini mendistribusikan panas dan membuat Eropa Barat lebih hangat dari seharusnya$$)),
(gen_random_uuid(), 'ef0c32e4-4ac1-4d59-a17b-82c376d9ad64', 'HEADING', 5, jsonb_build_object('text', $$Arus di Sekitar Indonesia$$)),
(gen_random_uuid(), 'ef0c32e4-4ac1-4d59-a17b-82c376d9ad64', 'LIST', 6, jsonb_build_object('items', ARRAY[$$Arus Lintas Indonesia (Arlindo): memindahkan air Pasifik ke Hindia lewat selat Indonesia$$, $$Upwelling di selatan Jawa dan Banda: air dalam kaya nutrisi naik, memicu ledakan plankton dan ikan$$, $$Arus musiman: arahnya berbalik mengikuti musim barat dan timur$$])),
(gen_random_uuid(), 'ef0c32e4-4ac1-4d59-a17b-82c376d9ad64', 'HEADING', 7, jsonb_build_object('text', $$El Nino dan La Nina$$)),
(gen_random_uuid(), 'ef0c32e4-4ac1-4d59-a17b-82c376d9ad64', 'PARAGRAPH', 8, jsonb_build_object('text', $$Saat El Nino, air hangat Pasifik bergeser ke timur: Indonesia kekeringan, kebakaran hutan meningkat. La Nina sebaliknya membawa hujan berlebih dan banjir. Keduanya dipicu perubahan arus dan suhu permukaan laut$$)),
(gen_random_uuid(), 'ef0c32e4-4ac1-4d59-a17b-82c376d9ad64', 'HEADING', 9, jsonb_build_object('text', $$Ancaman Perubahan Iklim$$)),
(gen_random_uuid(), 'ef0c32e4-4ac1-4d59-a17b-82c376d9ad64', 'PARAGRAPH', 10, jsonb_build_object('text', $$Es kutub yang mencair mengencerkan air asin Atlantik Utara dan dapat melemahkan konveyor global. Ilmuwan memantau terus: berhentinya sirkulasi ini bisa mengubah iklim dunia secara drastis$$))
ON CONFLICT (id) DO NOTHING;

-- ============ 5. SCH-SMA-SOS2-001 ============
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, status, created_by, updated_by)
VALUES ('e88c133b-4bcf-43f2-bf65-ed533207044f', 'SCH-SMA-SOS2-001', 'd5555555-5555-5555-5555-555555555555',
'Sosiologi Kelas 11: Konflik Sosial', 'sosiologi-kelas-11-konflik-sosial',
'Materi sosiologi kelas 11: pengertian konflik sosial, faktor penyebab, bentuk-bentuk, dan cara penyelesaiannya. Dilengkapi contoh dan latihan soal.',
'id', 8, 'DRAFT', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (id) DO NOTHING;

INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
(gen_random_uuid(), 'e88c133b-4bcf-43f2-bf65-ed533207044f', 'HEADING', 1, jsonb_build_object('text', $$Tujuan Pembelajaran$$)),
(gen_random_uuid(), 'e88c133b-4bcf-43f2-bf65-ed533207044f', 'PARAGRAPH', 2, jsonb_build_object('text', $$Setelah mempelajari materi ini, kamu diharapkan mampu menjelaskan pengertian konflik sosial, mengidentifikasi faktor penyebabnya, membedakan bentuk-bentuk konflik, dan menganalisis upaya penyelesaiannya$$)),
(gen_random_uuid(), 'e88c133b-4bcf-43f2-bf65-ed533207044f', 'HEADING', 3, jsonb_build_object('text', $$Pengertian Konflik Sosial$$)),
(gen_random_uuid(), 'e88c133b-4bcf-43f2-bf65-ed533207044f', 'PARAGRAPH', 4, jsonb_build_object('text', $$Konflik sosial adalah proses sosial antara dua pihak atau lebih yang saling menentang karena perbedaan kepentingan, nilai, atau tujuan. Berbeda dengan kompetisi yang sehat, konflik bersifat disosiatif: merenggangkan hubungan$$)),
(gen_random_uuid(), 'e88c133b-4bcf-43f2-bf65-ed533207044f', 'HEADING', 5, jsonb_build_object('text', $$Faktor Penyebab Konflik$$)),
(gen_random_uuid(), 'e88c133b-4bcf-43f2-bf65-ed533207044f', 'LIST', 6, jsonb_build_object('items', ARRAY[$$Perbedaan individu: pendirian, kepentingan, dan kebudayaan$$, $$Perbedaan latar belakang kebudayaan (cultural shock)$$, $$Perbedaan kepentingan ekonomi dan politik$$, $$Perubahan sosial yang terlalu cepat$$])),
(gen_random_uuid(), 'e88c133b-4bcf-43f2-bf65-ed533207044f', 'HEADING', 7, jsonb_build_object('text', $$Bentuk-bentuk Konflik$$)),
(gen_random_uuid(), 'e88c133b-4bcf-43f2-bf65-ed533207044f', 'LIST', 8, jsonb_build_object('items', ARRAY[$$Konflik pribadi: antarindividu, misalnya pertengkaran tetangga$$, $$Konflik rasial: antarkelompok etnis$$, $$Konflik antarkelas sosial: buruh vs pengusaha$$, $$Konflik politik: antarkelompok kepentingan kekuasaan$$, $$Konflik internasional: antarnegara$$])),
(gen_random_uuid(), 'e88c133b-4bcf-43f2-bf65-ed533207044f', 'HEADING', 9, jsonb_build_object('text', $$Upaya Penyelesaian Konflik$$)),
(gen_random_uuid(), 'e88c133b-4bcf-43f2-bf65-ed533207044f', 'PARAGRAPH', 10, jsonb_build_object('text', $$Lima cara penyelesaian: konsiliasi (mempertemukan pihak), mediasi (pihak ketiga netral), arbitrasi (wasit yang keputusannya mengikat), adjudikasi (melalui pengadilan), dan toleransi serta saling menghormati dalam kehidupan sehari-hari$$)),
(gen_random_uuid(), 'e88c133b-4bcf-43f2-bf65-ed533207044f', 'HEADING', 11, jsonb_build_object('text', $$Latihan Soal$$)),
(gen_random_uuid(), 'e88c133b-4bcf-43f2-bf65-ed533207044f', 'LIST', 12, jsonb_build_object('items', ARRAY[$$1. Sebutkan dua faktor penyebab konflik sosial dan berikan contohnya! Kunci: perbedaan kepentingan (contoh: sengketa lahan) dan perbedaan kebudayaan (contoh: bentrok adat)$$, $$2. Apa perbedaan mediasi dan arbitrasi? Kunci: mediasi memakai pihak ketiga netral tanpa keputusan mengikat; arbitrasi memakai wasit yang keputusannya wajib ditaati$$, $$3. Berikan contoh konflik antarkelas sosial di masyarakat! Kunci: unjuk rasa buruh menuntut kenaikan upah kepada pengusaha$$]))
ON CONFLICT (id) DO NOTHING;

-- ============ 6. SCH-SD-IPS3-001 ============
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, status, created_by, updated_by)
VALUES ('ef1e9c88-15e4-4a65-8e9c-9920cf1b97d8', 'SCH-SD-IPS3-001', 'd3333333-3333-3333-3333-333333333333',
'IPS Kelas 6: ASEAN', 'ips-kelas-6-asean',
'Materi IPS kelas 6 SD: mengenal ASEAN — negara anggota, tujuan, dan kerja samanya. Dilengkapi latihan soal dan kunci jawaban.',
'id', 7, 'DRAFT', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (id) DO NOTHING;

INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
(gen_random_uuid(), 'ef1e9c88-15e4-4a65-8e9c-9920cf1b97d8', 'HEADING', 1, jsonb_build_object('text', $$Tujuan Pembelajaran$$)),
(gen_random_uuid(), 'ef1e9c88-15e4-4a65-8e9c-9920cf1b97d8', 'PARAGRAPH', 2, jsonb_build_object('text', $$Setelah belajar materi ini, kamu bisa menyebutkan negara-negara anggota ASEAN, menjelaskan tujuan berdirinya ASEAN, dan memberi contoh kerja sama antarnegara ASEAN$$)),
(gen_random_uuid(), 'ef1e9c88-15e4-4a65-8e9c-9920cf1b97d8', 'HEADING', 3, jsonb_build_object('text', $$Apa Itu ASEAN$$)),
(gen_random_uuid(), 'ef1e9c88-15e4-4a65-8e9c-9920cf1b97d8', 'PARAGRAPH', 4, jsonb_build_object('text', $$ASEAN (Association of Southeast Asian Nations) adalah organisasi negara-negara Asia Tenggara. Berdiri pada 8 Agustus 1967 di Bangkok, Thailand, melalui Deklarasi Bangkok oleh lima negara pendiri$$)),
(gen_random_uuid(), 'ef1e9c88-15e4-4a65-8e9c-9920cf1b97d8', 'HEADING', 5, jsonb_build_object('text', $$10 Negara Anggota ASEAN$$)),
(gen_random_uuid(), 'ef1e9c88-15e4-4a65-8e9c-9920cf1b97d8', 'LIST', 6, jsonb_build_object('items', ARRAY[$$Indonesia — Jakarta$$, $$Malaysia — Kuala Lumpur$$, $$Singapura — Singapura$$, $$Thailand — Bangkok$$, $$Filipina — Manila$$, $$Brunei Darussalam — Bandar Seri Begawan$$, $$Vietnam — Hanoi$$, $$Laos — Vientiane$$, $$Myanmar — Naypyidaw$$, $$Kamboja — Phnom Penh$$])),
(gen_random_uuid(), 'ef1e9c88-15e4-4a65-8e9c-9920cf1b97d8', 'HEADING', 7, jsonb_build_object('text', $$Tujuan ASEAN$$)),
(gen_random_uuid(), 'ef1e9c88-15e4-4a65-8e9c-9920cf1b97d8', 'PARAGRAPH', 8, jsonb_build_object('text', $$Menjaga perdamaian dan stabilitas kawasan, mempercepat pertumbuhan ekonomi dan kemajuan sosial budaya, serta memajukan kerja sama aktif antarnegara anggota$$)),
(gen_random_uuid(), 'ef1e9c88-15e4-4a65-8e9c-9920cf1b97d8', 'HEADING', 9, jsonb_build_object('text', $$Contoh Kerja Sama$$)),
(gen_random_uuid(), 'ef1e9c88-15e4-4a65-8e9c-9920cf1b97d8', 'LIST', 10, jsonb_build_object('items', ARRAY[$$Ekonomi: kawasan perdagangan bebas AFTA$$, $$Pendidikan: pertukaran pelajar dan beasiswa$$, $$Olahraga: SEA Games$$, $$Kesehatan: bantuan saat bencana alam$$])),
(gen_random_uuid(), 'ef1e9c88-15e4-4a65-8e9c-9920cf1b97d8', 'HEADING', 11, jsonb_build_object('text', $$Latihan Soal$$)),
(gen_random_uuid(), 'ef1e9c88-15e4-4a65-8e9c-9920cf1b97d8', 'LIST', 12, jsonb_build_object('items', ARRAY[$$1. ASEAN berdiri pada tanggal berapa dan di kota apa? Kunci: 8 Agustus 1967 di Bangkok, Thailand$$, $$2. Sebutkan 3 negara pendiri ASEAN! Kunci: Indonesia, Malaysia, Thailand (juga Singapura dan Filipina)$$, $$3. Apa kepanjangan ASEAN? Kunci: Association of Southeast Asian Nations / Perhimpunan Bangsa-bangsa Asia Tenggara$$]))
ON CONFLICT (id) DO NOTHING;
