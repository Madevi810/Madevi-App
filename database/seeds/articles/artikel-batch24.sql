-- Artikel konten Madevi batch 24 — 2026-10-13
-- Owner principal: f7125028-187e-44e0-b95b-88b69b8d5c9a
-- 6 artikel: 2 Tutorial, 2 Explore, 2 School

-- ============ 1. TUT-KOPI-001 ============
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, status, created_by, updated_by)
VALUES ('a1010101-0101-4101-8101-010101010101', 'TUT-KOPI-001', 'b2222222-2222-2222-2222-222222222222',
'Kopi Tubruk Sempurna: Teknik Seduh untuk Pemula', 'kopi-tubruk-sempurna-teknik-seduh',
'Panduan lengkap menyeduh kopi tubruk yang nikmat: dari memilih biji, menggiling, hingga teknik tuang air yang tepat.',
'id', 7, 'DRAFT', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (id) DO NOTHING;

INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
(gen_random_uuid(), 'a1010101-0101-4101-8101-010101010101', 'HEADING', 1, jsonb_build_object('text', $$Masalah: Kopi Tubruk Pahit dan Hambar$$)),
(gen_random_uuid(), 'a1010101-0101-4101-8101-010101010101', 'PARAGRAPH', 2, jsonb_build_object('text', $$Banyak orang menyeduh kopi tubruk asal-asalan: air terlalu panas, takaran ngawur, hasil akhirnya pahit menyengat atau malah hambar seperti air cucian. Padahal dengan teknik yang benar, kopi tubruk bisa seenak seduhan kafe.$$)),
(gen_random_uuid(), 'a1010101-0101-4101-8101-010101010101', 'HEADING', 3, jsonb_build_object('text', $$Penjelasan: Tiga Variabel Penentu Rasa$$)),
(gen_random_uuid(), 'a1010101-0101-4101-8101-010101010101', 'PARAGRAPH', 4, jsonb_build_object('text', $$Rasa kopi tubruk ditentukan tiga hal: rasio kopi dan air, suhu air, serta ukuran gilingan. Rasio ideal 1:15 (1 gram kopi untuk 15 ml air). Suhu air terbaik 90-96 derajat Celsius — air mendidih penuh (100 derajat) akan membakar bubuk kopi dan memunculkan rasa pahit berlebih. Gilingan kasar seperti garam laut memberi ekstraksi seimbang untuk metode tubruk.$$)),
(gen_random_uuid(), 'a1010101-0101-4101-8101-010101010101', 'HEADING', 5, jsonb_build_object('text', $$Alat dan Bahan$$)),
(gen_random_uuid(), 'a1010101-0101-4101-8101-010101010101', 'LIST', 6, jsonb_build_object('items', ARRAY[$$Biji kopi sangrai segar (arabika atau robusta sesuai selera)$$, $$Grinder atau beli bubuk gilingan kasar$$, $$Timbangan dapur (atau sendok takar)$$, $$Ceret/teko dan termometer (opsional)$$, $$Gelas atau cangkir$$, $$Air bersih/filter$$])),
(gen_random_uuid(), 'a1010101-0101-4101-8101-010101010101', 'HEADING', 7, jsonb_build_object('text', $$Langkah Menyeduh$$)),
(gen_random_uuid(), 'a1010101-0101-4101-8101-010101010101', 'LIST', 8, jsonb_build_object('items', ARRAY[$$1. Didihkan air, lalu diamkan 1-2 menit hingga suhu turun ke sekitar 92 derajat$$, $$2. Timbang 15 gram kopi (sekitar 2 sendok makan) untuk 225 ml air$$, $$3. Masukkan bubuk kopi ke gelas, tuang sedikit air panas hingga semua bubuk basah (blooming), diamkan 30 detik$$, $$4. Tuang sisa air perlahan dengan gerakan memutar$$, $$5. Aduk sekali perlahan, lalu diamkan 4 menit$$, $$6. Pecahkan kerak kopi di permukaan dengan sendok, singkirkan busanya$$, $$7. Tunggu 1-2 menit agar ampas mengendap, lalu seruput perlahan$$])),
(gen_random_uuid(), 'a1010101-0101-4101-8101-010101010101', 'HEADING', 9, jsonb_build_object('text', $$Risiko dan Kesalahan Umum$$)),
(gen_random_uuid(), 'a1010101-0101-4101-8101-010101010101', 'PARAGRAPH', 10, jsonb_build_object('text', $$Jangan menuang air yang masih mendidih langsung ke bubuk kopi — hasilnya pahit dan getir. Jangan mengaduk berkali-kali karena membuat ampas naik dan minuman keruh. Hindari menyimpan biji kopi di tempat panas atau terbuka karena aroma cepat hilang; simpan dalam wadah kedap udara di suhu ruang.$$)),
(gen_random_uuid(), 'a1010101-0101-4101-8101-010101010101', 'HEADING', 11, jsonb_build_object('text', $$Penyelesaian$$)),
(gen_random_uuid(), 'a1010101-0101-4101-8101-010101010101', 'PARAGRAPH', 12, jsonb_build_object('text', $$Jika hasilnya masih kurang pas, sesuaikan satu variabel dalam satu waktu: terlalu pahit berarti gilingan terlalu halus atau air terlalu panas; terlalu asam/hambar berarti gilingan terlalu kasar atau waktu seduh kurang lama. Catat takaran yang paling cocok dengan seleramu agar bisa diulang konsisten setiap hari.$$))
ON CONFLICT (id) DO NOTHING;

-- ============ 2. TUT-JAHIT-001 ============
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, status, created_by, updated_by)
VALUES ('a2020202-0202-4202-8202-020202020202', 'TUT-JAHIT-001', 'b7777777-7777-7777-7777-777777777777',
'Menjahit untuk Pemula: Menguasai Jahitan Dasar', 'menjahit-pemula-jahitan-dasar',
'Belajar menjahit dari nol: mengenal alat, teknik tusuk dasar, hingga bisa memperbaiki pakaian sendiri.',
'id', 8, 'DRAFT', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (id) DO NOTHING;

INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
(gen_random_uuid(), 'a2020202-0202-4202-8202-020202020202', 'HEADING', 1, jsonb_build_object('text', $$Masalah: Ingin Bisa Menjahit tapi Bingung Mulai dari Mana$$)),
(gen_random_uuid(), 'a2020202-0202-4202-8202-020202020202', 'PARAGRAPH', 2, jsonb_build_object('text', $$Kancing lepas, keliman robek, atau celana kepanjangan — hal kecil seperti ini sering membuat orang bergantung pada tukang jahit. Padahal jahitan dasar bisa dipelajari siapa saja dalam beberapa jam latihan, dan menghemat banyak biaya perbaikan pakaian.$$)),
(gen_random_uuid(), 'a2020202-0202-4202-8202-020202020202', 'HEADING', 3, jsonb_build_object('text', $$Penjelasan: Tiga Tusuk Dasar yang Wajib Dikuasai$$)),
(gen_random_uuid(), 'a2020202-0202-4202-8202-020202020202', 'PARAGRAPH', 4, jsonb_build_object('text', $$Hampir semua perbaikan pakaian hanya butuh tiga tusuk: tusuk jelujur (jahitan sementara yang longgar untuk menandai), tusuk tikam jejak atau backstitch (jahitan kuat pengganti jahitan mesin), dan tusuk feston/blanket stitch (untuk merapikan tepi kain agar tidak berumbai). Kuasai ketiganya, maka 90 persen kebutuhan menjahit sehari-hari sudah terpenuhi.$$)),
(gen_random_uuid(), 'a2020202-0202-4202-8202-020202020202', 'HEADING', 5, jsonb_build_object('text', $$Alat yang Dibutuhkan$$)),
(gen_random_uuid(), 'a2020202-0202-4202-8202-020202020202', 'LIST', 6, jsonb_build_object('items', ARRAY[$$Jarum jahit tangan (ukuran sedang)$$, $$Benang jahit sesuai warna kain$$, $$Gunting kain yang tajam$$, $$Pendedel (seam ripper) untuk membuka jahitan salah$$, $$Jarum pentul dan bantalan jarum$$, $$Meteran kain$$, $$Kapur jahit atau pensil kain$$, $$Kain perca untuk latihan$$])),
(gen_random_uuid(), 'a2020202-0202-4202-8202-020202020202', 'HEADING', 7, jsonb_build_object('text', $$Langkah Belajar$$)),
(gen_random_uuid(), 'a2020202-0202-4202-8202-020202020202', 'LIST', 8, jsonb_build_object('items', ARRAY[$$1. Latihan tusuk jelujur di kain perca: tusuk keluar-masuk dengan jarak sama, sekitar 0,5 cm$$, $$2. Latihan backstitch: tusuk ke belakang setengah langkah lalu maju satu langkah penuh, ulangi hingga membentuk garis lurus rapat$$, $$3. Latihan feston di tepi kain: tusuk dari tepi membentuk simpul melingkar yang rapi$$, $$4. Praktik nyata pertama: jahit kancing yang lepas — buat 4-6 lilitan benang lalu kunci dengan simpul$$, $$5. Praktik kedua: perbaiki keliman robek dengan backstitch mengikuti garis jahitan lama$$])),
(gen_random_uuid(), 'a2020202-0202-4202-8202-020202020202', 'HEADING', 9, jsonb_build_object('text', $$Risiko dan Kesalahan Umum$$)),
(gen_random_uuid(), 'a2020202-0202-4202-8202-020202020202', 'PARAGRAPH', 10, jsonb_build_object('text', $$Jangan menarik benang terlalu kencang karena kain akan mengerut dan jahitan tidak rata. Hati-hati menyimpan jarum — selalu tusukkan ke bantalan jarum agar tidak hilang dan membahayakan. Untuk kain yang mudah melar seperti kaos, gunakan tusuk yang agak longgar agar jahitan tidak putus saat kain ditarik.$$)),
(gen_random_uuid(), 'a2020202-0202-4202-8202-020202020202', 'HEADING', 11, jsonb_build_object('text', $$Penyelesaian$$)),
(gen_random_uuid(), 'a2020202-0202-4202-8202-020202020202', 'PARAGRAPH', 12, jsonb_build_object('text', $$Setelah tiga tusuk dasar lancar, tantang dirimu dengan proyek kecil: membuat sarung bantal, tas kain sederhana, atau memendekkan celana. Jika nanti ingin serius, barulah pertimbangkan membeli mesin jahit — tapi ingat, semua penjahit hebat berawal dari jahitan tangan yang rapi.$$))
ON CONFLICT (id) DO NOTHING;

-- ============ 3. EXP-SEJARAH3-001 ============
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, status, created_by, updated_by)
VALUES ('a3030303-0303-4303-8303-030303030303', 'EXP-SEJARAH3-001', 'c8888888-8888-8888-8888-888888888888',
'Kerajaan Sriwijaya: Penguasa Maritim Nusantara', 'kerajaan-sriwijaya-penguasa-maritim',
'Mengenal Sriwijaya, kerajaan maritim Buddha terbesar di Asia Tenggara yang menguasai jalur perdagangan selama 600 tahun.',
'id', 6, 'DRAFT', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (id) DO NOTHING;

INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
(gen_random_uuid(), 'a3030303-0303-4303-8303-030303030303', 'HEADING', 1, jsonb_build_object('text', $$Lahirnya Kekuatan Maritim$$)),
(gen_random_uuid(), 'a3030303-0303-4303-8303-030303030303', 'PARAGRAPH', 2, jsonb_build_object('text', $$Sriwijaya muncul sekitar abad ke-7 Masehi di pesisir timur Sumatra, berpusat di sekitar Palembang. Prasasti Kedukan Bukit (683 M) mencatat ekspedisi Dapunta Hyang yang menjadi tonggak berdirinya kerajaan ini. Letaknya yang strategis di Selat Malaka — jalur pelayaran tersibuk antara India dan Tiongkok — menjadi kunci kejayaannya.$$)),
(gen_random_uuid(), 'a3030303-0303-4303-8303-030303030303', 'HEADING', 3, jsonb_build_object('text', $$Menguasai Jalur Perdagangan$$)),
(gen_random_uuid(), 'a3030303-0303-4303-8303-030303030303', 'PARAGRAPH', 4, jsonb_build_object('text', $$Selama kurang lebih enam abad, Sriwijaya mengendalikan perdagangan rempah, sutra, keramik, dan kapur barus. Para pedagang asing wajib singgah dan membayar upeti di pelabuhan Sriwijaya. Catatan pendeta Buddha Tiongkok, I-Tsing, yang singgah pada 671 M dan belajar di Sriwijaya selama 7 tahun, menjadi bukti betapa majunya peradaban ini — ia menyebut Sriwijaya sebagai pusat pembelajaran agama Buddha terbesar di Asia Tenggara.$$)),
(gen_random_uuid(), 'a3030303-0303-4303-8303-030303030303', 'HEADING', 5, jsonb_build_object('text', $$Pusat Agama Buddha$$)),
(gen_random_uuid(), 'a3030303-0303-4303-8303-030303030303', 'PARAGRAPH', 6, jsonb_build_object('text', $$Sriwijaya bukan sekadar kekuatan dagang, melainkan juga pusat keilmuan. Universitas Buddha di Sriwijaya menarik ribuan biksu dari Tiongkok, India, dan Tibet. Candi Muara Takus di Riau dan kompleks candi di Jambi menjadi saksi warisan arsitektur dan spiritualitasnya. Raja-raja Sriwijaya seperti Balaputradewa bahkan membangun biara di Nalanda, India — menunjukkan pengaruhnya yang melintasi samudra.$$)),
(gen_random_uuid(), 'a3030303-0303-4303-8303-030303030303', 'HEADING', 7, jsonb_build_object('text', $$Sistem Mandala$$)),
(gen_random_uuid(), 'a3030303-0303-4303-8303-030303030303', 'PARAGRAPH', 8, jsonb_build_object('text', $$Sriwijaya memerintah dengan sistem mandala: kerajaan-kerajaan kecil di pesisir Sumatra, Jawa, Kalimantan, hingga Semenanjung Malaya menjadi bawahan yang membayar upeti. Selama mereka setia, Sriwijaya melindungi jalur dagang mereka. Sistem ini fleksibel — wilayah bisa bergabung atau melepaskan diri tergantung kekuatan pusat, mirip konfederasi maritim.$$)),
(gen_random_uuid(), 'a3030303-0303-4303-8303-030303030303', 'HEADING', 9, jsonb_build_object('text', $$Kemunduran dan Warisan$$)),
(gen_random_uuid(), 'a3030303-0303-4303-8303-030303030303', 'PARAGRAPH', 10, jsonb_build_object('text', $$Kejayaan Sriwijaya memudar sejak abad ke-11 akibat serangan Kerajaan Chola dari India (1025 M), pergeseran jalur dagang, dan bangkitnya kerajaan-kerajaan Jawa. Namun warisannya abadi: bahasa Melayu yang dipakai sebagai lingua franca perdagangan menjadi cikal bakal bahasa Indonesia, dan tradisi maritim Nusantara berakar dari era keemasan Sriwijaya ini.$$))
ON CONFLICT (id) DO NOTHING;

-- ============ 4. EXP-BIOLOGI3-001 ============
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, status, created_by, updated_by)
VALUES ('a4040404-0404-4404-8404-040404040404', 'EXP-BIOLOGI3-001', 'c2222222-2222-2222-2222-222222222222',
'Ekosistem Hutan Hujan Tropis: Paru-paru Dunia', 'ekosistem-hutan-hujan-tropis',
'Menjelajahi hutan hujan tropis: keanekaragaman hayati tertinggi di Bumi, struktur lapisan, dan perannya bagi iklim global.',
'id', 6, 'DRAFT', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (id) DO NOTHING;

INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
(gen_random_uuid(), 'a4040404-0404-4404-8404-040404040404', 'HEADING', 1, jsonb_build_object('text', $$Apa itu Hutan Hujan Tropis$$)),
(gen_random_uuid(), 'a4040404-0404-4404-8404-040404040404', 'PARAGRAPH', 2, jsonb_build_object('text', $$Hutan hujan tropis adalah ekosistem di sekitar garis khatulistiwa dengan curah hujan lebih dari 2.000 mm per tahun dan suhu hangat sepanjang tahun. Meskipun hanya menutupi sekitar 6 persen permukaan daratan Bumi, hutan ini menampung lebih dari separuh spesies tumbuhan dan hewan di dunia — termasuk hutan Amazon, Kongo, dan hutan-hutan di Kalimantan, Sumatra, serta Papua.$$)),
(gen_random_uuid(), 'a4040404-0404-4404-8404-040404040404', 'HEADING', 3, jsonb_build_object('text', $$Struktur Berlapis$$)),
(gen_random_uuid(), 'a4040404-0404-4404-8404-040404040404', 'PARAGRAPH', 4, jsonb_build_object('text', $$Hutan hujan tropis tersusun dalam empat lapisan. Lapisan emergen berisi pohon-pohon raksasa setinggi 50-70 meter yang menjulang di atas kanopi. Lapisan kanopi adalah atap hutan yang lebat, rumah bagi sebagian besar hewan. Lapisan bawah kanopi (understory) lebih gelap dan lembap, dihuni tumbuhan muda dan hewan kecil. Lapisan lantai hutan nyaris gelap, penuh serasah daun yang diurai jamur dan bakteri menjadi nutrisi.$$)),
(gen_random_uuid(), 'a4040404-0404-4404-8404-040404040404', 'HEADING', 5, jsonb_build_object('text', $$Keanekaragaman Hayati Tertinggi$$)),
(gen_random_uuid(), 'a4040404-0404-4404-8404-040404040404', 'PARAGRAPH', 6, jsonb_build_object('text', $$Dalam satu hektare hutan Amazon bisa ditemukan lebih dari 300 jenis pohon — lebih banyak dari seluruh jenis pohon asli Eropa. Indonesia sendiri memiliki orangutan, harimau Sumatra, badak Jawa, burung cendrawasih, dan bunga rafflesia arnoldii, bunga terbesar di dunia. Jutaan spesies serangga, jamur, dan mikroorganisme bahkan belum teridentifikasi oleh ilmuwan.$$)),
(gen_random_uuid(), 'a4040404-0404-4404-8404-040404040404', 'HEADING', 7, jsonb_build_object('text', $$Siklus Nutrisi yang Cepat$$)),
(gen_random_uuid(), 'a4040404-0404-4404-8404-040404040404', 'PARAGRAPH', 8, jsonb_build_object('text', $$Uniknya, tanah hutan hujan tropis justru tidak subur. Nutrisi tersimpan di dalam biomassa — pohon, hewan, dan tumbuhan hidup — bukan di tanah. Daun gugur segera diurai oleh jamur dan rayap, lalu nutrisinya langsung diserap akar. Inilah sebabnya hutan yang ditebang sulit pulih: begitu pepohonan hilang, nutrisi ikut lenyap terbawa hujan.$$)),
(gen_random_uuid(), 'a4040404-0404-4404-8404-040404040404', 'HEADING', 9, jsonb_build_object('text', $$Peran bagi Iklim Global$$)),
(gen_random_uuid(), 'a4040404-0404-4404-8404-040404040404', 'PARAGRAPH', 10, jsonb_build_object('text', $$Hutan hujan tropis dijuluki paru-paru dunia karena menyerap karbon dioksida dalam jumlah raksasa dan melepaskan oksigen melalui fotosintesis. Hutan Amazon bahkan menciptakan hujannya sendiri lewat transpirasi — fenomena flying rivers yang membawa uap air ribuan kilometer. Deforestasi melepaskan karbon tersimpan sekaligus menghilangkan penyerapnya, mempercepat perubahan iklim global. Melindungi hutan hujan tropis berarti melindungi masa depan iklim Bumi.$$))
ON CONFLICT (id) DO NOTHING;

-- ============ 5. SCH-SMP-PKN-001 ============
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, status, created_by, updated_by)
VALUES ('a5050505-0505-4505-8505-050505050505', 'SCH-SMP-PKN-001', 'd4444444-4444-4444-4444-444444444444',
'PKN Kelas 8: Memahami Demokrasi Pancasila', 'pkn-kelas-8-demokrasi-pancasila',
'Materi PKN kelas 8: pengertian demokrasi, ciri demokrasi Pancasila, dan penerapannya dalam kehidupan sehari-hari.',
'id', 8, 'DRAFT', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (id) DO NOTHING;

INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
(gen_random_uuid(), 'a5050505-0505-4505-8505-050505050505', 'HEADING', 1, jsonb_build_object('text', $$Tujuan Pembelajaran$$)),
(gen_random_uuid(), 'a5050505-0505-4505-8505-050505050505', 'PARAGRAPH', 2, jsonb_build_object('text', $$Setelah mempelajari materi ini, kamu diharapkan mampu: (1) menjelaskan pengertian demokrasi secara umum, (2) menyebutkan ciri-ciri demokrasi Pancasila, (3) membedakan demokrasi Pancasila dengan demokrasi liberal dan terpimpin, serta (4) memberi contoh penerapan nilai demokrasi dalam kehidupan sehari-hari.$$)),
(gen_random_uuid(), 'a5050505-0505-4505-8505-050505050505', 'HEADING', 3, jsonb_build_object('text', $$Pengertian Demokrasi$$)),
(gen_random_uuid(), 'a5050505-0505-4505-8505-050505050505', 'PARAGRAPH', 4, jsonb_build_object('text', $$Kata demokrasi berasal dari bahasa Yunani: demos (rakyat) dan kratos (kekuasaan). Jadi demokrasi berarti kekuasaan berada di tangan rakyat. Dalam negara demokrasi, rakyat ikut menentukan jalannya pemerintahan — misalnya melalui pemilihan umum untuk memilih pemimpin dan wakil rakyat.$$)),
(gen_random_uuid(), 'a5050505-0505-4505-8505-050505050505', 'HEADING', 5, jsonb_build_object('text', $$Ciri-ciri Demokrasi Pancasila$$)),
(gen_random_uuid(), 'a5050505-0505-4505-8505-050505050505', 'LIST', 6, jsonb_build_object('items', ARRAY[$$Bersumber pada Pancasila, terutama sila ke-4: Kerakyatan yang dipimpin oleh hikmat kebijaksanaan dalam permusyawaratan/perwakilan$$, $$Mengutamakan musyawarah untuk mufakat dalam mengambil keputusan$$, $$Menghargai hak asasi manusia dan menjunjung tinggi keadilan sosial$$, $$Tidak mengenal dominasi mayoritas maupun tirani minoritas — semua pihak dihormati$$, $$Dijiwai oleh nilai ketuhanan, kemanusiaan, persatuan, kerakyatan, dan keadilan$$])),
(gen_random_uuid(), 'a5050505-0505-4505-8505-050505050505', 'HEADING', 7, jsonb_build_object('text', $$Perbandingan dengan Demokrasi Lain$$)),
(gen_random_uuid(), 'a5050505-0505-4505-8505-050505050505', 'PARAGRAPH', 8, jsonb_build_object('text', $$Demokrasi liberal (seperti di Amerika Serikat) menekankan kebebasan individu seluas-luasnya, kadang hingga mengabaikan kepentingan bersama. Demokrasi terpimpin (era Orde Lama di Indonesia) justru memusatkan kekuasaan pada pemimpin. Demokrasi Pancasila berada di tengah: kebebasan dihormati, tetapi dibatasi oleh tanggung jawab sosial dan nilai-nilai luhur bangsa.$$)),
(gen_random_uuid(), 'a5050505-0505-4505-8505-050505050505', 'HEADING', 9, jsonb_build_object('text', $$Contoh dalam Kehidupan Sehari-hari$$)),
(gen_random_uuid(), 'a5050505-0505-4505-8505-050505050505', 'PARAGRAPH', 10, jsonb_build_object('text', $$Nilai demokrasi bisa dilatih sejak di sekolah: pemilihan ketua kelas secara jujur, musyawarah menentukan tujuan study tour, menghormati pendapat teman yang berbeda saat diskusi kelompok, dan menerima hasil keputusan bersama dengan lapang dada. Di rumah, anak diajak bermusyawarah tentang aturan keluarga. Inilah demokrasi Pancasila dalam praktik nyata.$$)),
(gen_random_uuid(), 'a5050505-0505-4505-8505-050505050505', 'HEADING', 11, jsonb_build_object('text', $$Latihan Soal$$)),
(gen_random_uuid(), 'a5050505-0505-4505-8505-050505050505', 'LIST', 12, jsonb_build_object('items', ARRAY[$$1. Jelaskan arti kata demokrasi menurut asal bahasanya!$$, $$2. Sebutkan tiga ciri demokrasi Pancasila!$$, $$3. Apa perbedaan utama demokrasi Pancasila dan demokrasi liberal?$$, $$Kunci jawaban: (1) demos = rakyat, kratos = kekuasaan, artinya kekuasaan di tangan rakyat; (2) bersumber pada Pancasila / mengutamakan musyawarah mufakat / menghargai HAM dan keadilan sosial; (3) demokrasi liberal menekankan kebebasan individu seluas-luasnya, sedangkan demokrasi Pancasila menyeimbangkan kebebasan dengan tanggung jawab sosial dan nilai luhur bangsa.$$]))
ON CONFLICT (id) DO NOTHING;

-- ============ 6. SCH-SD-AGAMA2-001 ============
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, status, created_by, updated_by)
VALUES ('a6060606-0606-4606-8606-060606060606', 'SCH-SD-AGAMA2-001', 'd9999999-9999-9999-9999-999999999999',
'Pendidikan Agama Kelas 5: Kisah Teladan Para Nabi', 'pendidikan-agama-kelas-5-kisah-nabi',
'Materi pendidikan agama kelas 5: mengenal kisah dan keteladanan para nabi sebagai pedoman akhlak mulia.',
'id', 8, 'DRAFT', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (id) DO NOTHING;

INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
(gen_random_uuid(), 'a6060606-0606-4606-8606-060606060606', 'HEADING', 1, jsonb_build_object('text', $$Tujuan Pembelajaran$$)),
(gen_random_uuid(), 'a6060606-0606-4606-8606-060606060606', 'PARAGRAPH', 2, jsonb_build_object('text', $$Setelah mempelajari materi ini, kamu diharapkan mampu: (1) menyebutkan nama-nama nabi dan rasul yang wajib diketahui, (2) menceritakan kisah keteladanan Nabi Ibrahim, Nabi Musa, dan Nabi Muhammad, serta (3) meneladani sifat-sifat mulia para nabi dalam kehidupan sehari-hari.$$)),
(gen_random_uuid(), 'a6060606-0606-4606-8606-060606060606', 'HEADING', 3, jsonb_build_object('text', $$Nabi dan Rasul yang Wajib Diketahui$$)),
(gen_random_uuid(), 'a6060606-0606-4606-8606-060606060606', 'PARAGRAPH', 4, jsonb_build_object('text', $$Ada 25 nabi dan rasul yang wajib diketahui umat Islam, dari Nabi Adam sebagai manusia pertama hingga Nabi Muhammad sebagai penutup para nabi. Di antaranya yang bergelar Ulul Azmi — nabi dengan ketabahan luar biasa — yaitu Nabi Nuh, Nabi Ibrahim, Nabi Musa, Nabi Isa, dan Nabi Muhammad. Mereka menghadapi ujian sangat berat namun tetap teguh menyampaikan kebenaran.$$)),
(gen_random_uuid(), 'a6060606-0606-4606-8606-060606060606', 'HEADING', 5, jsonb_build_object('text', $$Keteladanan Nabi Ibrahim$$)),
(gen_random_uuid(), 'a6060606-0606-4606-8606-060606060606', 'PARAGRAPH', 6, jsonb_build_object('text', $$Nabi Ibrahim dijuluki Khalilullah (kekasih Allah) karena keimanannya yang tak tergoyahkan. Ia berani menghancurkan berhala-berhala kaumnya meski harus dibakar hidup-hidup — namun Allah menyelamatkannya sehingga api menjadi dingin. Keteladanannya: berani membela kebenaran, sabar dalam ujian, dan ikhlas berkorban — seperti saat ia siap melaksanakan perintah menyembelih putranya, Nabi Ismail, sebelum Allah menggantinya dengan seekor domba. Peristiwa inilah yang diperingati setiap Iduladha.$$)),
(gen_random_uuid(), 'a6060606-0606-4606-8606-060606060606', 'HEADING', 7, jsonb_build_object('text', $$Keteladanan Nabi Musa$$)),
(gen_random_uuid(), 'a6060606-0606-4606-8606-060606060606', 'PARAGRAPH', 8, jsonb_build_object('text', $$Nabi Musa diutus untuk membebaskan Bani Israil dari perbudakan Firaun di Mesir. Dengan mukjizat tongkatnya, ia membelah Laut Merah sehingga kaumnya selamat. Keteladanannya: berani menghadapi kezaliman penguasa, memimpin kaumnya dengan sabar meski sering ditentang, dan selalu memohon pertolongan Allah dalam setiap kesulitan.$$)),
(gen_random_uuid(), 'a6060606-0606-4606-8606-060606060606', 'HEADING', 9, jsonb_build_object('text', $$Keteladanan Nabi Muhammad$$)),
(gen_random_uuid(), 'a6060606-0606-4606-8606-060606060606', 'PARAGRAPH', 10, jsonb_build_object('text', $$Nabi Muhammad adalah suri teladan terbaik (uswatun hasanah). Sejak muda ia dikenal jujur hingga dijuluki Al-Amin (yang terpercaya). Ia penyayang kepada anak-anak, pemaaf kepada musuh — bahkan ketika penduduk Thaif melemparinya dengan batu, ia justru mendoakan mereka. Sifat-sifatnya yang wajib diteladani: siddiq (jujur), amanah (dapat dipercaya), tabligh (menyampaikan kebenaran), dan fathanah (cerdas).$$)),
(gen_random_uuid(), 'a6060606-0606-4606-8606-060606060606', 'HEADING', 11, jsonb_build_object('text', $$Latihan Soal$$)),
(gen_random_uuid(), 'a6060606-0606-4606-8606-060606060606', 'LIST', 12, jsonb_build_object('items', ARRAY[$$1. Sebutkan lima nabi yang bergelar Ulul Azmi!$$, $$2. Mengapa Nabi Ibrahim dijuluki Khalilullah?$$, $$3. Sebutkan empat sifat wajib nabi yang harus kita teladani!$$, $$Kunci jawaban: (1) Nabi Nuh, Nabi Ibrahim, Nabi Musa, Nabi Isa, Nabi Muhammad; (2) karena keimanannya yang tak tergoyahkan dan ketaatannya yang total kepada Allah; (3) siddiq (jujur), amanah (dapat dipercaya), tabligh (menyampaikan kebenaran), fathanah (cerdas).$$]))
ON CONFLICT (id) DO NOTHING;
