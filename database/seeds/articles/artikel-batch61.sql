-- ============================================================
-- Madevi Content Batch 61 (idempotent)
-- 6 artikel: 2 Tutorial (12 block) + 2 Explore (10 block) + 2 School (12 block)
-- Owner: f7125028-187e-44e0-b95b-88b69b8d5c9a
-- ============================================================
BEGIN;

-- ============ ARTIKEL 1: TUT-KOMPUTER12-001 ============
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, access_level, status, created_by, updated_by)
VALUES ('e6100001-0000-4000-8000-000000000001', 'TUT-KOMPUTER12-001', 'baaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
'VPN: Amankan Koneksi Internet', 'vpn-amankan-koneksi-internet',
'Panduan menggunakan VPN untuk melindungi data saat memakai WiFi publik: pengertian, cara memilih layanan, langkah pemasangan, dan batasannya.',
'id', 8, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'MEMBER', 'DRAFT',
'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (id) DO NOTHING;
DELETE FROM madevi.article_blocks WHERE article_id = 'e6100001-0000-4000-8000-000000000001';
INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
(gen_random_uuid(), 'e6100001-0000-4000-8000-000000000001', 'HEADING', 1, jsonb_build_object('text', $txt$Masalah: WiFi Publik Itu Berbahaya$txt$)),
(gen_random_uuid(), 'e6100001-0000-4000-8000-000000000001', 'PARAGRAPH', 2, jsonb_build_object('text', $txt$WiFi gratis di kafe, bandara, atau kampus memang praktis, tetapi jaringannya terbuka dan bisa dimanfaatkan pihak jahat untuk mengintip data yang lewat, misalnya kata sandi atau isi pesan. Banyak orang tidak sadar bahwa sekali tersambung ke WiFi publik tanpa perlindungan, aktivitas onlinenya berpotensi terpantau.$txt$)),
(gen_random_uuid(), 'e6100001-0000-4000-8000-000000000001', 'HEADING', 3, jsonb_build_object('text', $txt$Penjelasan: Apa Itu VPN?$txt$)),
(gen_random_uuid(), 'e6100001-0000-4000-8000-000000000001', 'PARAGRAPH', 4, jsonb_build_object('text', $txt$VPN (Virtual Private Network) membuat terowongan terenkripsi antara perangkatmu dan server VPN. Semua data yang keluar-masuk melewati terowongan ini sehingga sulit dibaca pihak lain di jaringan yang sama. Alamat IP-mu juga ikut tersamarkan karena situs yang kamu kunjungi hanya melihat IP server VPN.$txt$)),
(gen_random_uuid(), 'e6100001-0000-4000-8000-000000000001', 'HEADING', 5, jsonb_build_object('text', $txt$Persiapan Alat$txt$)),
(gen_random_uuid(), 'e6100001-0000-4000-8000-000000000001', 'LIST', 6, jsonb_build_object('items', ARRAY['HP atau laptop yang akan dipakai', 'Koneksi internet (WiFi atau data seluler)', 'Aplikasi VPN dari penyedia terpercaya (gratis atau berbayar)', 'Alamat email untuk pendaftaran akun', 'Ruang penyimpanan cukup untuk instalasi aplikasi'])),
(gen_random_uuid(), 'e6100001-0000-4000-8000-000000000001', 'HEADING', 7, jsonb_build_object('text', $txt$Langkah-langkah Menggunakan VPN$txt$)),
(gen_random_uuid(), 'e6100001-0000-4000-8000-000000000001', 'LIST', 8, jsonb_build_object('items', ARRAY['Pilih penyedia VPN yang jelas kebijakan privasinya, hindari yang asal-asalan', 'Unduh aplikasi hanya dari situs resmi penyedia atau toko aplikasi resmi', 'Pasang aplikasi lalu buat akun dengan email yang valid', 'Masuk ke aplikasi dan pilih lokasi server (pilih yang terdekat agar cepat)', 'Tekan tombol sambung dan tunggu sampai status menunjukkan terhubung', 'Buka situs pemeriksa IP untuk memastikan alamat IP-mu sudah berubah'])),
(gen_random_uuid(), 'e6100001-0000-4000-8000-000000000001', 'HEADING', 9, jsonb_build_object('text', $txt$Risiko dan Batasan$txt$)),
(gen_random_uuid(), 'e6100001-0000-4000-8000-000000000001', 'PARAGRAPH', 10, jsonb_build_object('text', $txt$VPN bukan tameng sempurna. Layanan VPN gratis sering membatasi kecepatan dan sebagian mencatat aktivitas pengguna untuk dijual sebagai iklan, jadi baca kebijakannya. Kecepatan internet biasanya sedikit menurun karena data dirutekan lewat server lain. VPN juga tidak melindungimu dari situs palsu atau lampiran berbahaya, jadi kewaspadaan tetap diperlukan.$txt$)),
(gen_random_uuid(), 'e6100001-0000-4000-8000-000000000001', 'HEADING', 11, jsonb_build_object('text', $txt$Pemeriksaan Hasil dan Penyelesaian$txt$)),
(gen_random_uuid(), 'e6100001-0000-4000-8000-000000000001', 'PARAGRAPH', 12, jsonb_build_object('text', $txt$VPN bekerja dengan baik bila ikon status menunjukkan terhubung dan situs pemeriksa IP menampilkan lokasi server, bukan lokasimu. Biasakan menyalakan VPN sebelum membuka WiFi publik, dan matikan hanya setelah terputus dari jaringan tersebut. Untuk perlindungan jangka panjang, pertimbangkan layanan berbayar dari penyedia bereputasi.$txt$));

-- ============ ARTIKEL 2: TUT-KESEHATAN19-001 ============
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, access_level, status, created_by, updated_by)
VALUES ('e6100002-0000-4000-8000-000000000002', 'TUT-KESEHATAN19-001', 'b5555555-5555-5555-5555-555555555555',
'Kram Otot: Penyebab dan Penanganan', 'kram-otot-penyebab-dan-penanganan',
'Panduan mengenali penyebab kram otot dan cara menanganinya di rumah dengan aman, lengkap dengan tanda bahaya kapan harus ke dokter. Informasi umum, bukan pengganti nasihat medis.',
'id', 7, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'MEMBER', 'DRAFT',
'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (id) DO NOTHING;
DELETE FROM madevi.article_blocks WHERE article_id = 'e6100002-0000-4000-8000-000000000002';
INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
(gen_random_uuid(), 'e6100002-0000-4000-8000-000000000002', 'HEADING', 1, jsonb_build_object('text', $txt$Masalah: Otot Tiba-tiba Kejang dan Nyeri$txt$)),
(gen_random_uuid(), 'e6100002-0000-4000-8000-000000000002', 'PARAGRAPH', 2, jsonb_build_object('text', $txt$Kram otot adalah kontraksi mendadak yang tidak disengaja dan terasa nyeri, paling sering di betis, paha, atau kaki. Kram bisa muncul saat olahraga, di malam hari, atau setelah duduk terlalu lama. Meski umumnya tidak berbahaya, kram yang sering kambuh bisa mengganggu aktivitas dan tidur.$txt$)),
(gen_random_uuid(), 'e6100002-0000-4000-8000-000000000002', 'HEADING', 3, jsonb_build_object('text', $txt$Penjelasan: Mengapa Kram Bisa Terjadi?$txt$)),
(gen_random_uuid(), 'e6100002-0000-4000-8000-000000000002', 'PARAGRAPH', 4, jsonb_build_object('text', $txt$Penyebab umum kram antara lain kekurangan cairan, kelelahan otot setelah aktivitas berat, pemanasan yang kurang, dan posisi tubuh yang sama terlalu lama. Cuaca panas yang membuat banyak berkeringat juga bisa memicu kram karena tubuh kehilangan cairan dan mineral. Pada sebagian orang, kram berkaitan dengan kondisi medis tertentu, sehingga kram yang berulang perlu diperhatikan.$txt$)),
(gen_random_uuid(), 'e6100002-0000-4000-8000-000000000002', 'HEADING', 5, jsonb_build_object('text', $txt$Persiapan$txt$)),
(gen_random_uuid(), 'e6100002-0000-4000-8000-000000000002', 'LIST', 6, jsonb_build_object('items', ARRAY['Air minum yang cukup', 'Handuk hangat atau botol air hangat', 'Tempat duduk atau berbaring yang nyaman', 'Bantal kecil untuk menyangga kaki'])),
(gen_random_uuid(), 'e6100002-0000-4000-8000-000000000002', 'HEADING', 7, jsonb_build_object('text', $txt$Langkah Penanganan Saat Kram$txt$)),
(gen_random_uuid(), 'e6100002-0000-4000-8000-000000000002', 'LIST', 8, jsonb_build_object('items', ARRAY['Hentikan aktivitas dan duduk atau berbaring dengan tenang', 'Regangkan otot yang kram secara perlahan, misalnya tarik ujung kaki ke arah tubuh untuk kram betis', 'Pijat area yang kram dengan lembut memakai tangan', 'Tempelkan handuk hangat untuk membantu otot rileks', 'Minum air putih secukupnya', 'Istirahatkan otot tersebut sebelum beraktivitas kembali'])),
(gen_random_uuid(), 'e6100002-0000-4000-8000-000000000002', 'HEADING', 9, jsonb_build_object('text', $txt$Risiko dan Tanda Bahaya$txt$)),
(gen_random_uuid(), 'e6100002-0000-4000-8000-000000000002', 'PARAGRAPH', 10, jsonb_build_object('text', $txt$Segera konsultasikan ke dokter bila kram terjadi sangat sering, disertai bengkak atau kemerahan, kelemahan otot, atau nyeri hebat yang tidak reda. Jangan memijat terlalu keras karena bisa memperparah nyeri. Artikel ini berisi informasi umum dan bukan pengganti nasihat medis profesional.$txt$)),
(gen_random_uuid(), 'e6100002-0000-4000-8000-000000000002', 'HEADING', 11, jsonb_build_object('text', $txt$Pencegahan dan Penyelesaian$txt$)),
(gen_random_uuid(), 'e6100002-0000-4000-8000-000000000002', 'PARAGRAPH', 12, jsonb_build_object('text', $txt$Cegah kram dengan pemanasan sebelum olahraga, peregangan rutin setiap hari, dan minum air yang cukup terutama saat cuaca panas. Hindari duduk atau berdiri dalam satu posisi terlalu lama. Jika kram malam sering mengganggu tidur, catat polanya dan diskusikan dengan dokter untuk penanganan lebih lanjut.$txt$));

-- ============ ARTIKEL 3: EXP-ANTROPOLOGI11-001 ============
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, access_level, status, created_by, updated_by)
VALUES ('e6100003-0000-4000-8000-000000000003', 'EXP-ANTROPOLOGI11-001', 'c8888888-8888-8888-8888-888888888888',
'Suku Asmat: Seni Ukir Kayu', 'suku-asmat-seni-ukir-kayu',
'Mengenal Suku Asmat di Papua dan seni ukir kayunya yang mendunia: makna spiritual, teknik pembuatan, dan warisan budayanya.',
'id', 6, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'MEMBER', 'DRAFT',
'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (id) DO NOTHING;
DELETE FROM madevi.article_blocks WHERE article_id = 'e6100003-0000-4000-8000-000000000003';
INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
(gen_random_uuid(), 'e6100003-0000-4000-8000-000000000003', 'HEADING', 1, jsonb_build_object('text', $txt$Siapa Suku Asmat?$txt$)),
(gen_random_uuid(), 'e6100003-0000-4000-8000-000000000003', 'PARAGRAPH', 2, jsonb_build_object('text', $txt$Suku Asmat mendiami wilayah pesisir barat daya Papua, di antara sungai-sungai besar dan hutan bakau. Mereka adalah salah satu kelompok etnis terbesar di Papua dan terkenal di seluruh dunia bukan karena jumlahnya, melainkan karena karya seni ukir kayunya yang luar biasa.$txt$)),
(gen_random_uuid(), 'e6100003-0000-4000-8000-000000000003', 'HEADING', 3, jsonb_build_object('text', $txt$Ukiran Sebagai Bahasa Spiritual$txt$)),
(gen_random_uuid(), 'e6100003-0000-4000-8000-000000000003', 'PARAGRAPH', 4, jsonb_build_object('text', $txt$Bagi masyarakat Asmat, mengukir bukan sekadar membuat hiasan. Setiap ukiran adalah jembatan antara dunia manusia dan dunia leluhur. Tiang mbis yang menjulang tinggi, misalnya, didirikan untuk mengenang leluhur dan menjaga keseimbangan hubungan dengan alam roh.$txt$)),
(gen_random_uuid(), 'e6100003-0000-4000-8000-000000000003', 'LIST', 5, jsonb_build_object('items', ARRAY['Tiang mbis: tiang kayu raksasa berukir manusia bertumpuk', 'Perahu lesung: perahu bercadik untuk upacara dan perang', 'Topeng dan tameng: dipakai dalam ritual', 'Tifa dan alat musik: pengiring upacara adat', 'Ornamen rumah: tiang dan papan berukir di rumah adat jew'])),
(gen_random_uuid(), 'e6100003-0000-4000-8000-000000000003', 'HEADING', 6, jsonb_build_object('text', $txt$Teknik dan Bahan$txt$)),
(gen_random_uuid(), 'e6100003-0000-4000-8000-000000000003', 'PARAGRAPH', 7, jsonb_build_object('text', $txt$Bahan utama ukiran Asmat adalah kayu bakau yang banyak tumbuh di wilayah mereka. Dahulu pengukir memakai kapak batu dan tulang, kini memakai alat besi. Menariknya, para pengukir tidak membuat sketsa terlebih dahulu: bentuk sudah hidup di kepala mereka sebelum pahat menyentuh kayu.$txt$)),
(gen_random_uuid(), 'e6100003-0000-4000-8000-000000000003', 'HEADING', 8, jsonb_build_object('text', $txt$Makna di Balik Motif$txt$)),
(gen_random_uuid(), 'e6100003-0000-4000-8000-000000000003', 'PARAGRAPH', 9, jsonb_build_object('text', $txt$Motif yang paling dikenal adalah kelelawar terbang (flying fox) yang melambangkan roh leluhur yang menjaga keturunannya. Sosok manusia yang bertumpuk menggambarkan silsilah dan kebersamaan komunitas. Tidak ada ukiran yang asal-asalan: semuanya membawa pesan tentang asal-usul, keberanian, dan hubungan dengan alam.$txt$)),
(gen_random_uuid(), 'e6100003-0000-4000-8000-000000000003', 'PARAGRAPH', 10, jsonb_build_object('text', $txt$Kini karya ukir Asmat dipamerkan di museum-museum dunia dan dikoleksi para pencinta seni. Di Agats berdiri Museum Kebudayaan dan Kemajuan Asmat yang menyimpan ribuan koleksi. Setiap bulan Oktober digelar Festival Budaya Asmat yang menjadi ajang para pengukir menunjukkan karya terbaiknya sekaligus menjaga tradisi tetap hidup.$txt$));

-- ============ ARTIKEL 4: EXP-KIMIA17-001 ============
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, access_level, status, created_by, updated_by)
VALUES ('e6100004-0000-4000-8000-000000000004', 'EXP-KIMIA17-001', 'c4444444-4444-4444-4444-444444444444',
'Nitrogen: Gas Terbanyak di Udara', 'nitrogen-gas-terbanyak-di-udara',
'Mengenal nitrogen, gas yang mengisi 78 persen udara: sifatnya, siklusnya di alam, dan perannya bagi kehidupan.',
'id', 6, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'MEMBER', 'DRAFT',
'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (id) DO NOTHING;
DELETE FROM madevi.article_blocks WHERE article_id = 'e6100004-0000-4000-8000-000000000004';
INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
(gen_random_uuid(), 'e6100004-0000-4000-8000-000000000004', 'HEADING', 1, jsonb_build_object('text', $txt$78 Persen Udara Adalah Nitrogen$txt$)),
(gen_random_uuid(), 'e6100004-0000-4000-8000-000000000004', 'PARAGRAPH', 2, jsonb_build_object('text', $txt$Setiap kali bernapas, sebagian besar yang masuk ke paru-parumu bukanlah oksigen, melainkan nitrogen. Udara kering tersusun atas sekitar 78 persen nitrogen, 21 persen oksigen, dan sisanya gas-gas lain seperti argon dan karbon dioksida. Meski paling melimpah, nitrogen justru jarang dibicarakan.$txt$)),
(gen_random_uuid(), 'e6100004-0000-4000-8000-000000000004', 'HEADING', 3, jsonb_build_object('text', $txt$Sifat Nitrogen$txt$)),
(gen_random_uuid(), 'e6100004-0000-4000-8000-000000000004', 'PARAGRAPH', 4, jsonb_build_object('text', $txt$Nitrogen adalah gas tak berwarna dan tak berbau yang sangat sulit bereaksi. Dua atom nitrogen terikat oleh ikatan rangkap tiga yang sangat kuat, sehingga molekulnya stabil. Sifat inilah yang membuat nitrogen sering dipakai sebagai gas pelindung dalam industri, misalnya untuk mencegah oksidasi saat pengemasan makanan.$txt$)),
(gen_random_uuid(), 'e6100004-0000-4000-8000-000000000004', 'HEADING', 5, jsonb_build_object('text', $txt$Siklus Nitrogen di Alam$txt$)),
(gen_random_uuid(), 'e6100004-0000-4000-8000-000000000004', 'PARAGRAPH', 6, jsonb_build_object('text', $txt$Meski melimpah di udara, tumbuhan tidak bisa langsung memakai nitrogen bebas. Bakteri di tanah dan di akar kacang-kacangan mengubahnya menjadi amonia, lalu menjadi nitrit dan nitrat yang bisa diserap tumbuhan. Hewan memperoleh nitrogen dari tumbuhan yang dimakan, dan ketika makhluk hidup mati, bakteri pengurai mengembalikan nitrogen ke udara. Inilah siklus nitrogen.$txt$)),
(gen_random_uuid(), 'e6100004-0000-4000-8000-000000000004', 'HEADING', 7, jsonb_build_object('text', $txt$Manfaat bagi Manusia$txt$)),
(gen_random_uuid(), 'e6100004-0000-4000-8000-000000000004', 'LIST', 8, jsonb_build_object('items', ARRAY['Pupuk urea dan ZA untuk menyuburkan tanaman', 'Nitrogen cair sebagai pendingin super dingin di laboratorium dan medis', 'Pengemasan makanan agar awet tanpa oksigen', 'Bahan baku amonia untuk industri kimia', 'Pengisi ban pesawat dan mobil balap agar tekanan stabil'])),
(gen_random_uuid(), 'e6100004-0000-4000-8000-000000000004', 'HEADING', 9, jsonb_build_object('text', $txt$Nitrogen dan Kehidupan$txt$)),
(gen_random_uuid(), 'e6100004-0000-4000-8000-000000000004', 'PARAGRAPH', 10, jsonb_build_object('text', $txt$Setiap protein di tubuhmu dan setiap untai DNA mengandung nitrogen. Tanpa siklus nitrogen yang bekerja terus-menerus, tumbuhan tidak bisa tumbuh dan rantai makanan akan runtuh. Gas yang tak terlihat dan tak terasa ini ternyata adalah salah satu fondasi kehidupan di Bumi.$txt$));

-- ============ ARTIKEL 5: SCH-SMP-SEJ5-001 ============
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, access_level, status, created_by, updated_by)
VALUES ('e6100005-0000-4000-8000-000000000005', 'SCH-SMP-SEJ5-001', 'd4444444-4444-4444-4444-444444444444',
'IPS Kelas 9: Perang Dingin', 'ips-kelas-9-perang-dingin',
'Materi IPS kelas 9 tentang Perang Dingin: pengertian, latar belakang, peristiwa penting, dampak bagi Indonesia, dan latihan soal.',
'id', 10, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'MEMBER', 'DRAFT',
'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (id) DO NOTHING;
DELETE FROM madevi.article_blocks WHERE article_id = 'e6100005-0000-4000-8000-000000000005';
INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
(gen_random_uuid(), 'e6100005-0000-4000-8000-000000000005', 'HEADING', 1, jsonb_build_object('text', $txt$Tujuan Pembelajaran$txt$)),
(gen_random_uuid(), 'e6100005-0000-4000-8000-000000000005', 'PARAGRAPH', 2, jsonb_build_object('text', $txt$Setelah mempelajari materi ini, kamu diharapkan mampu menjelaskan pengertian Perang Dingin, menyebutkan latar belakang terjadinya, mengidentifikasi peristiwa-peristiwa pentingnya, serta menganalisis dampaknya bagi Indonesia.$txt$)),
(gen_random_uuid(), 'e6100005-0000-4000-8000-000000000005', 'HEADING', 3, jsonb_build_object('text', $txt$Apa Itu Perang Dingin?$txt$)),
(gen_random_uuid(), 'e6100005-0000-4000-8000-000000000005', 'PARAGRAPH', 4, jsonb_build_object('text', $txt$Perang Dingin adalah persaingan politik, ideologi, dan militer antara Amerika Serikat dan Uni Soviet yang berlangsung sekitar tahun 1947 hingga 1991. Disebut dingin karena kedua negara adidaya tidak pernah berperang langsung satu sama lain, melainkan bersaing lewat pengaruh, persenjataan, teknologi, dan perang proksi di berbagai belahan dunia.$txt$)),
(gen_random_uuid(), 'e6100005-0000-4000-8000-000000000005', 'HEADING', 5, jsonb_build_object('text', $txt$Latar Belakang$txt$)),
(gen_random_uuid(), 'e6100005-0000-4000-8000-000000000005', 'PARAGRAPH', 6, jsonb_build_object('text', $txt$Setelah Perang Dunia II berakhir, Amerika Serikat menganut paham kapitalisme liberal sedangkan Uni Soviet menganut komunisme. Keduanya sama-sama ingin memperluas pengaruhnya ke negara-negara lain. Ketidakpercayaan ini memuncak ketika Uni Soviet memasang pemerintahan komunis di Eropa Timur, sementara Amerika Serikat meluncurkan Doktrin Truman dan Rencana Marshall untuk membendungnya.$txt$)),
(gen_random_uuid(), 'e6100005-0000-4000-8000-000000000005', 'HEADING', 7, jsonb_build_object('text', $txt$Peristiwa-Peristiwa Penting$txt$)),
(gen_random_uuid(), 'e6100005-0000-4000-8000-000000000005', 'LIST', 8, jsonb_build_object('items', ARRAY['Blokade Berlin (1948): Uni Soviet menutup akses ke Berlin Barat', 'Perang Korea (1950-1953): Korea Utara yang komunis melawan Korea Selatan', 'Krisis Misil Kuba (1962): dunia nyaris pecah perang nuklir', 'Perang Vietnam (1955-1975): Amerika Serikat terlibat melawan Vietnam Utara', 'Perlombaan antariksa: Uni Soviet meluncurkan Sputnik, AS mendaratkan manusia di Bulan'])),
(gen_random_uuid(), 'e6100005-0000-4000-8000-000000000005', 'HEADING', 9, jsonb_build_object('text', $txt$Dampak bagi Indonesia$txt$)),
(gen_random_uuid(), 'e6100005-0000-4000-8000-000000000005', 'PARAGRAPH', 10, jsonb_build_object('text', $txt$Indonesia memilih politik luar negeri bebas aktif: tidak memihak blok mana pun. Sikap ini diwujudkan lewat Konferensi Asia Afrika di Bandung tahun 1955 dan pendirian Gerakan Non-Blok tahun 1961. Namun persaingan dua blok tetap terasa, misalnya dalam dinamika politik dalam negeri dan bantuan luar negeri yang ditawarkan kedua belah pihak.$txt$)),
(gen_random_uuid(), 'e6100005-0000-4000-8000-000000000005', 'HEADING', 11, jsonb_build_object('text', $txt$Latihan Soal$txt$)),
(gen_random_uuid(), 'e6100005-0000-4000-8000-000000000005', 'PARAGRAPH', 12, jsonb_build_object('text', $txt$1. Jelaskan mengapa persaingan AS dan Uni Soviet disebut Perang Dingin! 2. Sebutkan tiga peristiwa penting Perang Dingin beserta tahunnya! 3. Bagaimana Indonesia menyikapi Perang Dingin? Jelaskan dengan contoh! Kunci jawaban: 1. Karena tidak ada perang terbuka langsung antara keduanya, hanya persaingan pengaruh, senjata, dan teknologi. 2. Blokade Berlin 1948, Perang Korea 1950-1953, Krisis Kuba 1962, Perang Vietnam 1955-1975, perlombaan antariksa. 3. Dengan politik bebas aktif: Konferensi Asia Afrika 1955 dan Gerakan Non-Blok 1961.$txt$));

-- ============ ARTIKEL 6: SCH-SD-MAT15-001 ============
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, access_level, status, created_by, updated_by)
VALUES ('e6100006-0000-4000-8000-000000000006', 'SCH-SD-MAT15-001', 'd3333333-3333-3333-3333-333333333333',
'Matematika Kelas 5: Bangun Ruang', 'matematika-kelas-5-bangun-ruang',
'Materi matematika kelas 5 tentang bangun ruang: pengertian, macam-macam, ciri-ciri, dan cara menghitung volume kubus dan balok.',
'id', 10, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'MEMBER', 'DRAFT',
'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (id) DO NOTHING;
DELETE FROM madevi.article_blocks WHERE article_id = 'e6100006-0000-4000-8000-000000000006';
INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
(gen_random_uuid(), 'e6100006-0000-4000-8000-000000000006', 'HEADING', 1, jsonb_build_object('text', $txt$Tujuan Pembelajaran$txt$)),
(gen_random_uuid(), 'e6100006-0000-4000-8000-000000000006', 'PARAGRAPH', 2, jsonb_build_object('text', $txt$Setelah mempelajari materi ini, kamu diharapkan mampu menyebutkan macam-macam bangun ruang, menjelaskan ciri-cirinya, serta menghitung volume kubus dan balok dengan benar.$txt$)),
(gen_random_uuid(), 'e6100006-0000-4000-8000-000000000006', 'HEADING', 3, jsonb_build_object('text', $txt$Apa Itu Bangun Ruang?$txt$)),
(gen_random_uuid(), 'e6100006-0000-4000-8000-000000000006', 'PARAGRAPH', 4, jsonb_build_object('text', $txt$Bangun ruang adalah bangun tiga dimensi yang memiliki panjang, lebar, dan tinggi, sehingga memiliki isi atau volume. Contohnya ada di sekitarmu: dadu berbentuk kubus, kardus berbentuk balok, dan kaleng susu berbentuk tabung.$txt$)),
(gen_random_uuid(), 'e6100006-0000-4000-8000-000000000006', 'HEADING', 5, jsonb_build_object('text', $txt$Macam-macam Bangun Ruang$txt$)),
(gen_random_uuid(), 'e6100006-0000-4000-8000-000000000006', 'LIST', 6, jsonb_build_object('items', ARRAY['Kubus: seperti dadu', 'Balok: seperti kardus dan batu bata', 'Tabung: seperti kaleng dan gelas', 'Kerucut: seperti topi ulang tahun', 'Bola: seperti bola sepak', 'Prisma dan limas: alasnya segitiga atau segiempat'])),
(gen_random_uuid(), 'e6100006-0000-4000-8000-000000000006', 'HEADING', 7, jsonb_build_object('text', $txt$Ciri-ciri Bangun Ruang$txt$)),
(gen_random_uuid(), 'e6100006-0000-4000-8000-000000000006', 'PARAGRAPH', 8, jsonb_build_object('text', $txt$Bangun ruang memiliki sisi (bidang pembatas), rusuk (garis pertemuan dua sisi), dan titik sudut (titik pertemuan rusuk). Kubus memiliki 6 sisi yang sama besar, 12 rusuk yang sama panjang, dan 8 titik sudut. Balok memiliki 6 sisi berbentuk persegi panjang, 12 rusuk, dan 8 titik sudut.$txt$)),
(gen_random_uuid(), 'e6100006-0000-4000-8000-000000000006', 'HEADING', 9, jsonb_build_object('text', $txt$Volume Kubus dan Balok$txt$)),
(gen_random_uuid(), 'e6100006-0000-4000-8000-000000000006', 'PARAGRAPH', 10, jsonb_build_object('text', $txt$Volume kubus = sisi x sisi x sisi. Contoh: kubus dengan sisi 5 cm, volumenya 5 x 5 x 5 = 125 cm3. Volume balok = panjang x lebar x tinggi. Contoh: balok dengan panjang 8 cm, lebar 4 cm, dan tinggi 3 cm, volumenya 8 x 4 x 3 = 96 cm3.$txt$)),
(gen_random_uuid(), 'e6100006-0000-4000-8000-000000000006', 'HEADING', 11, jsonb_build_object('text', $txt$Latihan Soal$txt$)),
(gen_random_uuid(), 'e6100006-0000-4000-8000-000000000006', 'PARAGRAPH', 12, jsonb_build_object('text', $txt$1. Sebuah dadu memiliki sisi 6 cm. Berapa volumenya? 2. Kardus berukuran panjang 10 cm, lebar 6 cm, tinggi 5 cm. Berapa volumenya? 3. Sebutkan 3 perbedaan kubus dan balok! Kunci jawaban: 1. 6 x 6 x 6 = 216 cm3. 2. 10 x 6 x 5 = 300 cm3. 3. Sisi kubus semuanya persegi sama besar, sisi balok persegi panjang; semua rusuk kubus sama panjang, rusuk balok tidak semuanya sama; contoh bendanya berbeda.$txt$));

COMMIT;

-- Verifikasi batch 61
-- SELECT business_code, title FROM madevi.articles WHERE business_code LIKE '%-001' AND business_code IN ('TUT-KOMPUTER12-001','TUT-KESEHATAN19-001','EXP-ANTROPOLOGI11-001','EXP-KIMIA17-001','SCH-SMP-SEJ5-001','SCH-SD-MAT15-001');
