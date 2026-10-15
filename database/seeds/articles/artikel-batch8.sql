-- Artikel konten Madevi batch 8 — 2026-10-13
-- Owner principal: f7125028-187e-44e0-b95b-88b69b8d5c9a
-- Termasuk 2 node taksonomi baru (R2.D13 Geografi, R2.D14 Ekonomi) agar artikel punya rumah yang tepat.

-- ============ Node taksonomi baru ============
INSERT INTO madevi.taxonomy_nodes (revision_id, node_id, parent_id, level, local_code, path_code, name, slug, path_slug, sort_order, source_file, source_line, metadata)
VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'c6000001-0000-0000-0000-000000000001', 'c1111111-1111-1111-1111-111111111111', 'D', 'D13', 'R2.D13', 'Geografi & Ilmu Bumi', 'geografi-ilmu-bumi', 'explore-learn/geografi-ilmu-bumi', 8, 'TAKSONOMI-B8', 10, '{}'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'c6000002-0000-0000-0000-000000000002', 'c1111111-1111-1111-1111-111111111111', 'D', 'D14', 'R2.D14', 'Ekonomi', 'ekonomi', 'explore-learn/ekonomi', 9, 'TAKSONOMI-B8', 11, '{}')
ON CONFLICT DO NOTHING;

-- ============ 1. TUT-PARENTING-001 ============
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, status, created_by, updated_by)
VALUES ('e4000001-4000-4000-4000-400000000001', 'TUT-PARENTING-001', 'b6666666-6666-6666-6666-666666666666',
'Anak Susah Belajar: Pendekatan yang Tepat', 'anak-susah-belajar-pendekatan-tepat',
'Panduan orang tua menghadapi anak yang sulit fokus belajar: kenali gaya belajar, bangun rutinitas, dan hindari kesalahan umum.',
'id', 7, 'DRAFT', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (id) DO NOTHING;

INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
(gen_random_uuid(), 'e4000001-4000-4000-4000-400000000001', 'HEADING', 1, jsonb_build_object('text', $$Masalah: Anak Susah Fokus Belajar$$)),
(gen_random_uuid(), 'e4000001-4000-4000-4000-400000000001', 'PARAGRAPH', 2, jsonb_build_object('text', $$Anak menunda-nunda PR, lebih memilih main HP atau game, dan nilai menurun. Dimarahi malah makin melawan atau menangis. Banyak orang tua bingung: dipaksa tidak mempan, dibiarkan makin parah.$$)),
(gen_random_uuid(), 'e4000001-4000-4000-4000-400000000001', 'HEADING', 3, jsonb_build_object('text', $$Penjelasan: Mengapa Anak Menolak Belajar$$)),
(gen_random_uuid(), 'e4000001-4000-4000-4000-400000000001', 'PARAGRAPH', 4, jsonb_build_object('text', $$Anak bukan malas — otaknya belum matang mengatur perhatian jangka panjang. Penyebab umum: kelelahan, materi terlalu sulit atau membosankan, gaya belajar tidak cocok (ada anak visual, auditori, kinestetik), atau tekanan berlebihan yang membuat belajar terasa seperti hukuman.$$)),
(gen_random_uuid(), 'e4000001-4000-4000-4000-400000000001', 'HEADING', 5, jsonb_build_object('text', $$Persiapan: Yang Perlu Disiapkan Orang Tua$$)),
(gen_random_uuid(), 'e4000001-4000-4000-4000-400000000001', 'LIST', 6, jsonb_build_object('items', ARRAY[$$Sudut belajar yang tenang dan terang$$, $$Jadwal harian yang konsisten (jam yang sama tiap hari)$$, $$Aturan gadget yang jelas saat jam belajar$$, $$Camilan dan air minum agar anak tidak lapar/haus$$, $$Kesabaran: siapkan mental untuk proses, bukan hasil instan$$])),
(gen_random_uuid(), 'e4000001-4000-4000-4000-400000000001', 'HEADING', 7, jsonb_build_object('text', $$Langkah: Pendekatan Bertahap$$)),
(gen_random_uuid(), 'e4000001-4000-4000-4000-400000000001', 'LIST', 8, jsonb_build_object('items', ARRAY[$$1. Kenali gaya belajar anak: suka gambar (visual), suka didikte (auditori), atau harus sambil gerak (kinestetik)$$, $$2. Pecah belajar jadi sesi 20-25 menit diselingi istirahat 5 menit$$, $$3. Mulai dari materi yang paling mudah agar anak merasa berhasil$$, $$4. Beri pilihan, bukan perintah: 'mau kerjakan matematika dulu atau IPA?'$$, $$5. Puji usaha dan prosesnya, bukan hanya nilai: 'kamu tekun sekali hari ini'$$])),
(gen_random_uuid(), 'e4000001-4000-4000-4000-400000000001', 'HEADING', 9, jsonb_build_object('text', $$Risiko yang Perlu Diwaspadai$$)),
(gen_random_uuid(), 'e4000001-4000-4000-4000-400000000001', 'PARAGRAPH', 10, jsonb_build_object('text', $$Jangan membandingkan anak dengan kakak, tetangga, atau teman — itu merusak kepercayaan diri. Hindari hukuman fisik dan bentakan saat belajar. Waspadai tanda gangguan belajar seperti disleksia (sulit membaca) atau ADHD (sangat hiperaktif dan tidak bisa diam): jika gejalanya kuat, konsultasikan ke psikolog anak, bukan sekadar dimarahi.$$)),
(gen_random_uuid(), 'e4000001-4000-4000-4000-400000000001', 'HEADING', 11, jsonb_build_object('text', $$Penyelesaian: Membangun Kebiasaan Jangka Panjang$$)),
(gen_random_uuid(), 'e4000001-4000-4000-4000-400000000001', 'PARAGRAPH', 12, jsonb_build_object('text', $$Kebiasaan belajar terbentuk dalam 3-9 minggu jika konsisten. Libatkan anak menyusun jadwalnya sendiri agar ia merasa memiliki. Evaluasi mingguan dengan santai: tanyakan apa yang sulit minggu ini dan apa yang ingin diperbaiki minggu depan. Tujuan akhirnya bukan anak yang patuh disuruh, tapi anak yang bisa mengatur belajarnya sendiri.$$));

-- ============ 2. TUT-KULINER-001 ============
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, status, created_by, updated_by)
VALUES ('e4000002-4000-4000-4000-400000000002', 'TUT-KULINER-001', 'b2222222-2222-2222-2222-222222222222',
'Rendang Sapi Empuk: Resep Lengkap', 'rendang-sapi-empuk-resep-lengkap',
'Resep rendang sapi empuk dan meresap: pemilihan daging, bumbu, teknik memasak api kecil, hingga penyimpanan.',
'id', 8, 'DRAFT', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (id) DO NOTHING;

INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
(gen_random_uuid(), 'e4000002-4000-4000-4000-400000000002', 'HEADING', 1, jsonb_build_object('text', $$Masalah: Rendang Keras dan Kurang Meresap$$)),
(gen_random_uuid(), 'e4000002-4000-4000-4000-400000000002', 'PARAGRAPH', 2, jsonb_build_object('text', $$Sudah dimasak berjam-jam tapi daging masih alot, bumbu tidak meresap ke dalam, atau santan pecah dan berminyak berlebihan. Rendang yang baik itu empuk, bumbunya kering meresap, dan aromanya harum rempah.$$)),
(gen_random_uuid(), 'e4000002-4000-4000-4000-400000000002', 'HEADING', 3, jsonb_build_object('text', $$Penjelasan: Kunci Rendang Empuk$$)),
(gen_random_uuid(), 'e4000002-4000-4000-4000-400000000002', 'PARAGRAPH', 4, jsonb_build_object('text', $$Tiga kunci utama: (1) pilih daging sandung lamur (brisket) yang ada lemaknya — lemak membuat empuk; (2) santan kental dari kelapa tua, bukan santan instan encer; (3) api kecil dan waktu lama 4-5 jam agar serat daging hancur perlahan dan bumbu meresap sempurna.$$)),
(gen_random_uuid(), 'e4000002-4000-4000-4000-400000000002', 'HEADING', 5, jsonb_build_object('text', $$Bahan yang Dibutuhkan (untuk 1 kg daging)$$)),
(gen_random_uuid(), 'e4000002-4000-4000-4000-400000000002', 'LIST', 6, jsonb_build_object('items', ARRAY[$$1 kg daging sapi sandung lamur, potong sesuai selera$$, $$2 liter santan kental dari 3 butir kelapa tua$$, $$Bumbu halus: 15 cabai merah, 10 bawang merah, 6 bawang putih, 3 cm jahe, 3 cm lengkuas, 2 cm kunyit$$, $$Rempah: 3 batang serai (geprek), 5 lembar daun jeruk, 3 lembar daun salam, 1 sdm ketumbar sangrai$$, $$Garam dan gula merah secukupnya$$])),
(gen_random_uuid(), 'e4000002-4000-4000-4000-400000000002', 'HEADING', 7, jsonb_build_object('text', $$Langkah Memasak$$)),
(gen_random_uuid(), 'e4000002-4000-4000-4000-400000000002', 'LIST', 8, jsonb_build_object('items', ARRAY[$$1. Tumis bumbu halus bersama serai, daun jeruk, dan daun salam hingga harum dan matang$$, $$2. Tuang santan, aduk terus hingga mendidih agar tidak pecah$$, $$3. Masukkan daging, kecilkan api$$, $$4. Masak 4-5 jam dengan api kecil, aduk sesekali agar tidak gosong di dasar$$, $$5. Tahap kalio (berkuah): setelah 2-3 jam; lanjutkan hingga kuah menyusut jadi rendang kering$$, $$6. Koreksi rasa: asin, gurih, sedikit manis$$])),
(gen_random_uuid(), 'e4000002-4000-4000-4000-400000000002', 'HEADING', 9, jsonb_build_object('text', $$Risiko dan Kesalahan Umum$$)),
(gen_random_uuid(), 'e4000002-4000-4000-4000-400000000002', 'PARAGRAPH', 10, jsonb_build_object('text', $$Santan pecah: api terlalu besar atau tidak diaduk saat awal mendidih. Daging alot: waktu kurang lama atau api terlalu besar sehingga luar gosong dalam mentah. Gosong di dasar: jarang diaduk pada jam-jam akhir saat kuah sudah kental. Jangan tambah air di tengah jalan — gunakan santan jika perlu.$$)),
(gen_random_uuid(), 'e4000002-4000-4000-4000-400000000002', 'HEADING', 11, jsonb_build_object('text', $$Penyelesaian: Penyajian dan Penyimpanan$$)),
(gen_random_uuid(), 'e4000002-4000-4000-4000-400000000002', 'PARAGRAPH', 12, jsonb_build_object('text', $$Rendang justru makin enak di hari ke-2 dan ke-3 karena bumbu makin meresap. Simpan dalam wadah tertutup di kulkas tahan 1 minggu, di freezer tahan 1 bulan. Hangatkan dengan api kecil sambil diaduk. Satu resep ini menghasilkan sekitar 8-10 porsi.$$));

-- ============ 3. EXP-GEOGRAFI-001 ============
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, status, created_by, updated_by)
VALUES ('e4000003-4000-4000-4000-400000000003', 'EXP-GEOGRAFI-001', 'c6000001-0000-0000-0000-000000000001',
'Lempeng Tektonik: Mengapa Ada Gempa', 'lempeng-tektonik-mengapa-ada-gempa',
'Memahami teori lempeng tektonik: jenis lempeng, batas pergerakannya, dan mengapa Indonesia rawan gempa.',
'id', 7, 'DRAFT', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (id) DO NOTHING;

INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
(gen_random_uuid(), 'e4000003-4000-4000-4000-400000000003', 'HEADING', 1, jsonb_build_object('text', $$Bumi yang Terus Bergerak$$)),
(gen_random_uuid(), 'e4000003-4000-4000-4000-400000000003', 'PARAGRAPH', 2, jsonb_build_object('text', $$Permukaan Bumi bukanlah batuan padat yang utuh. Kerak Bumi terpecah menjadi belasan potongan raksasa yang disebut lempeng tektonik, mengapung di atas lapisan mantel yang panas dan mengalir perlahan. Lempeng-lempeng ini bergerak beberapa sentimeter per tahun — secepat kukumu tumbuh.$$)),
(gen_random_uuid(), 'e4000003-4000-4000-4000-400000000003', 'HEADING', 3, jsonb_build_object('text', $$Tujuh Lempeng Utama$$)),
(gen_random_uuid(), 'e4000003-4000-4000-4000-400000000003', 'PARAGRAPH', 4, jsonb_build_object('text', $$Ada tujuh lempeng besar: Pasifik (terbesar, hampir seluruh Samudra Pasifik), Amerika Utara, Amerika Selatan, Eurasia, Afrika, Indo-Australia, dan Antartika. Indonesia duduk di atas lempeng Indo-Australia, tepat di zona tumbukan dengan lempeng Eurasia dan Pasifik — posisi yang membuatnya sangat aktif secara geologi.$$)),
(gen_random_uuid(), 'e4000003-4000-4000-4000-400000000003', 'HEADING', 5, jsonb_build_object('text', $$Tiga Jenis Batas Lempeng$$)),
(gen_random_uuid(), 'e4000003-4000-4000-4000-400000000003', 'PARAGRAPH', 6, jsonb_build_object('text', $$Di batas divergen, lempeng saling menjauh dan magma naik membentuk kerak baru — contohnya di tengah Samudra Atlantik. Di batas konvergen, lempeng bertumbukan; yang lebih berat menunjam ke bawah (subduksi) membentuk palung laut dan gunung api — seperti di barat Sumatra dan selatan Jawa. Di batas transform, lempeng bergeser horizontal seperti patahan San Andreas di California.$$)),
(gen_random_uuid(), 'e4000003-4000-4000-4000-400000000003', 'HEADING', 7, jsonb_build_object('text', $$Mengapa Terjadi Gempa$$)),
(gen_random_uuid(), 'e4000003-4000-4000-4000-400000000003', 'PARAGRAPH', 8, jsonb_build_object('text', $$Lempeng yang terkunci di zona subduksi menumpuk tegangan selama puluhan hingga ratusan tahun. Saat tegangan melampaui kekuatan batuan, patahan pecah tiba-tiba dan melepaskan energi sebagai gelombang seismik — itulah gempa. Titik pecahnya di dalam Bumi disebut hiposentrum (fokus), titik di permukaan tepat di atasnya disebut episentrum. Kekuatannya diukur dengan magnitudo: setiap naik 1 skala berarti energinya sekitar 32 kali lebih besar.$$)),
(gen_random_uuid(), 'e4000003-4000-4000-4000-400000000003', 'HEADING', 9, jsonb_build_object('text', $$Cincin Api Pasifik dan Indonesia$$)),
(gen_random_uuid(), 'e4000003-4000-4000-4000-400000000003', 'PARAGRAPH', 10, jsonb_build_object('text', $$Indonesia berada di Cincin Api Pasifik (Ring of Fire), jalur sepanjang 40.000 km tempat 90 persen gempa dunia terjadi. Tiga lempeng bertemu di sini: Indo-Australia menunjam di bawah Eurasia dari barat dan selatan, sementara lempeng Pasifik menekan dari timur. Akibatnya Indonesia memiliki 130 lebih gunung api aktif dan mengalami ribuan gempa tiap tahun. Mitigasinya: bangunan tahan gempa, jalur evakuasi tsunami, dan latihan kesiapsiagaan rutin.$$));

-- ============ 4. EXP-EKONOMI-001 ============
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, status, created_by, updated_by)
VALUES ('e4000004-4000-4000-4000-400000000004', 'EXP-EKONOMI-001', 'c6000002-0000-0000-0000-000000000002',
'Inflasi: Mengapa Harga Naik Terus', 'inflasi-mengapa-harga-naik-terus',
'Memahami inflasi: penyebab harga naik, cara mengukurnya, dampaknya bagi kehidupan, dan cara melindungi keuangan.',
'id', 7, 'DRAFT', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (id) DO NOTHING;

INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
(gen_random_uuid(), 'e4000004-4000-4000-4000-400000000004', 'HEADING', 1, jsonb_build_object('text', $$Harga yang Tak Pernah Turun$$)),
(gen_random_uuid(), 'e4000004-4000-4000-4000-400000000004', 'PARAGRAPH', 2, jsonb_build_object('text', $$Dua puluh tahun lalu, Rp5.000 bisa membeli semangkuk bakso. Sekarang, uang yang sama mungkin hanya cukup untuk segelas es teh. Fenomena harga yang naik terus-menerus ini disebut inflasi — dan ia memengaruhi setiap orang, dari pedagang kaki lima hingga perusahaan raksasa.$$)),
(gen_random_uuid(), 'e4000004-4000-4000-4000-400000000004', 'HEADING', 3, jsonb_build_object('text', $$Apa Itu Inflasi$$)),
(gen_random_uuid(), 'e4000004-4000-4000-4000-400000000004', 'PARAGRAPH', 4, jsonb_build_object('text', $$Inflasi adalah kenaikan harga barang dan jasa secara umum dan terus-menerus dalam periode tertentu. Artinya daya beli uang menurun: dengan Rp100.000 hari ini kamu mendapat lebih sedikit barang dibanding tahun lalu. Inflasi ringan (2-4 persen per tahun) justru dianggap sehat karena mendorong orang berbelanja dan berinvestasi, bukan menimbun uang.$$)),
(gen_random_uuid(), 'e4000004-4000-4000-4000-400000000004', 'HEADING', 5, jsonb_build_object('text', $$Penyebab Inflasi$$)),
(gen_random_uuid(), 'e4000004-4000-4000-4000-400000000004', 'PARAGRAPH', 6, jsonb_build_object('text', $$Ada tiga pemicu utama. Pertama, demand-pull: permintaan melonjak melebihi pasokan — misalnya harga tiket pesawat melambung saat mudik Lebaran. Kedua, cost-push: biaya produksi naik — ketika harga BBM naik, ongkos angkut naik, dan hampir semua harga barang ikut naik. Ketiga, ekspektasi: jika semua orang yakin harga akan naik, pedagang menaikkan harga duluan dan pekerja menuntut gaji lebih tinggi, sehingga inflasi benar-benar terjadi.$$)),
(gen_random_uuid(), 'e4000004-4000-4000-4000-400000000004', 'HEADING', 7, jsonb_build_object('text', $$Cara Mengukur: Indeks Harga Konsumen$$)),
(gen_random_uuid(), 'e4000004-4000-4000-4000-400000000004', 'PARAGRAPH', 8, jsonb_build_object('text', $$Badan Pusat Statistik (BPS) mengukur inflasi lewat Indeks Harga Konsumen (IHK): memantau harga ratusan jenis barang dan jasa — dari beras, listrik, hingga ongkos ojek — di puluhan kota setiap bulan. Bank Indonesia menargetkan inflasi Indonesia di kisaran 2-4 persen per tahun dan mengatur suku bunga untuk menjaganya.$$)),
(gen_random_uuid(), 'e4000004-4000-4000-4000-400000000004', 'HEADING', 9, jsonb_build_object('text', $$Dampak bagi Kehidupan Sehari-hari$$)),
(gen_random_uuid(), 'e4000004-4000-4000-4000-400000000004', 'PARAGRAPH', 10, jsonb_build_object('text', $$Inflasi menggerus nilai tabungan: uang Rp10 juta yang didiamkan 10 tahun dengan inflasi 4 persen hanya bernilai setara Rp6,7 juta dalam daya beli. Gaji yang tidak naik berarti sebenarnya turun. Perlindungannya: miliki dana darurat, naikkan penghasilan mengikuti inflasi, dan tempatkan kelebihan dana pada aset produktif seperti usaha atau investasi jangka panjang — bukan menimbun uang tunai.$$));

-- ============ 5. SCH-SMA-BIO-001 ============
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, status, created_by, updated_by)
VALUES ('e4000005-4000-4000-4000-400000000005', 'SCH-SMA-BIO-001', 'd5555555-5555-5555-5555-555555555555',
'Biologi Kelas 11: Sistem Peredaran Darah', 'biologi-kelas-11-sistem-peredaran-darah',
'Materi biologi SMA: komponen darah, jantung, pembuluh darah, dan mekanisme peredaran darah manusia lengkap dengan latihan.',
'id', 9, 'DRAFT', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (id) DO NOTHING;

INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
(gen_random_uuid(), 'e4000005-4000-4000-4000-400000000005', 'HEADING', 1, jsonb_build_object('text', $$Tujuan Pembelajaran$$)),
(gen_random_uuid(), 'e4000005-4000-4000-4000-400000000005', 'PARAGRAPH', 2, jsonb_build_object('text', $$Setelah mempelajari materi ini, siswa diharapkan dapat: (1) menyebutkan komponen darah beserta fungsinya, (2) menjelaskan struktur dan cara kerja jantung, (3) membedakan arteri, vena, dan kapiler, serta (4) mengurutkan aliran darah pada peredaran kecil dan besar.$$)),
(gen_random_uuid(), 'e4000005-4000-4000-4000-400000000005', 'HEADING', 3, jsonb_build_object('text', $$Fungsi Sistem Peredaran Darah$$)),
(gen_random_uuid(), 'e4000005-4000-4000-4000-400000000005', 'PARAGRAPH', 4, jsonb_build_object('text', $$Darah adalah kurir tubuh. Ia mengangkut oksigen dari paru-paru dan sari makanan dari usus ke seluruh sel, mendistribusikan hormon dari kelenjar ke organ target, serta mengangkut karbon dioksida dan sisa metabolisme ke organ pembuangan. Tanpa peredaran yang lancar, sel akan kekurangan oksigen dalam hitungan menit.$$)),
(gen_random_uuid(), 'e4000005-4000-4000-4000-400000000005', 'HEADING', 5, jsonb_build_object('text', $$Komponen Darah$$)),
(gen_random_uuid(), 'e4000005-4000-4000-4000-400000000005', 'PARAGRAPH', 6, jsonb_build_object('text', $$Darah terdiri dari plasma (55 persen, cairan kekuningan pembawa nutrisi dan hormon) dan sel-sel darah (45 persen). Sel darah merah (eritrosit) mengandung hemoglobin pengikat oksigen dan tidak berinti agar muat lebih banyak. Sel darah putih (leukosit) adalah tentara imun yang melawan kuman. Keping darah (trombosit) menutup luka lewat pembekuan darah.$$)),
(gen_random_uuid(), 'e4000005-4000-4000-4000-400000000005', 'HEADING', 7, jsonb_build_object('text', $$Jantung: Pompa Ganda$$)),
(gen_random_uuid(), 'e4000005-4000-4000-4000-400000000005', 'PARAGRAPH', 8, jsonb_build_object('text', $$Jantung sebesar kepalan tangan memiliki empat ruang: serambi (atrium) kanan-kiri di atas dan bilik (ventrikel) kanan-kiri di bawah. Katup memastikan darah mengalir satu arah. Sisi kanan memompa darah ke paru-paru (peredaran kecil/pulmonal) untuk mengambil oksigen, sisi kiri memompa darah kaya oksigen ke seluruh tubuh (peredaran besar/sistemik). Jantung berdenyut sekitar 70 kali per menit, memompa 5 liter darah tiap menitnya.$$)),
(gen_random_uuid(), 'e4000005-4000-4000-4000-400000000005', 'HEADING', 9, jsonb_build_object('text', $$Pembuluh Darah$$)),
(gen_random_uuid(), 'e4000005-4000-4000-4000-400000000005', 'PARAGRAPH', 10, jsonb_build_object('text', $$Arteri berdinding tebal dan elastis membawa darah bertekanan tinggi keluar dari jantung (umumnya kaya oksigen). Vena berdinding tipis, berkatup, mengembalikan darah ke jantung. Kapiler adalah pembuluh super halus tempat pertukaran zat sebenarnya terjadi: oksigen dan nutrisi keluar, karbon dioksida dan sisa metabolisme masuk.$$)),
(gen_random_uuid(), 'e4000005-4000-4000-4000-400000000005', 'HEADING', 11, jsonb_build_object('text', $$Latihan Soal$$)),
(gen_random_uuid(), 'e4000005-4000-4000-4000-400000000005', 'PARAGRAPH', 12, jsonb_build_object('text', $$1. Sebutkan tiga komponen sel darah beserta fungsinya masing-masing! 2. Jelaskan perbedaan peredaran darah kecil dan peredaran darah besar! 3. Mengapa dinding arteri lebih tebal daripada dinding vena? Kunci: 1. Eritrosit (angkut O2 via hemoglobin), leukosit (pertahanan tubuh), trombosit (pembekuan darah). 2. Peredaran kecil: jantung → paru-paru → jantung (ambil O2); peredaran besar: jantung → seluruh tubuh → jantung (antar O2). 3. Arteri menahan tekanan tinggi dari pompa jantung, sedangkan vena bertekanan rendah dan dibantu katup serta otot rangka.$$));

-- ============ 6. SCH-SMP-MAT-001 ============
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, status, created_by, updated_by)
VALUES ('e4000006-4000-4000-4000-400000000006', 'SCH-SMP-MAT-001', 'd4444444-4444-4444-4444-444444444444',
'Matematika Kelas 8: Teorema Pythagoras', 'matematika-kelas-8-teorema-pythagoras',
'Materi matematika SMP: bunyi teorema Pythagoras, cara mencari sisi segitiga siku-siku, tripel Pythagoras, dan latihan soal.',
'id', 9, 'DRAFT', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (id) DO NOTHING;

INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
(gen_random_uuid(), 'e4000006-4000-4000-4000-400000000006', 'HEADING', 1, jsonb_build_object('text', $$Tujuan Pembelajaran$$)),
(gen_random_uuid(), 'e4000006-4000-4000-4000-400000000006', 'PARAGRAPH', 2, jsonb_build_object('text', $$Setelah mempelajari materi ini, siswa diharapkan dapat: (1) menyatakan bunyi teorema Pythagoras, (2) menentukan sisi miring segitiga siku-siku, (3) menentukan sisi tegak jika sisi miring diketahui, dan (4) mengenali tripel Pythagoras.$$)),
(gen_random_uuid(), 'e4000006-4000-4000-4000-400000000006', 'HEADING', 3, jsonb_build_object('text', $$Bunyi Teorema Pythagoras$$)),
(gen_random_uuid(), 'e4000006-4000-4000-4000-400000000006', 'PARAGRAPH', 4, jsonb_build_object('text', $$Pada segitiga siku-siku, kuadrat sisi miring (hipotenusa) sama dengan jumlah kuadrat kedua sisi tegaknya. Rumusnya: c² = a² + b², dengan c adalah sisi miring — sisi terpanjang yang berhadapan dengan sudut siku-siku. Teorema ini ditemukan oleh matematikawan Yunani kuno, Pythagoras, sekitar 2.500 tahun lalu.$$)),
(gen_random_uuid(), 'e4000006-4000-4000-4000-400000000006', 'HEADING', 5, jsonb_build_object('text', $$Contoh 1: Mencari Sisi Miring$$)),
(gen_random_uuid(), 'e4000006-4000-4000-4000-400000000006', 'PARAGRAPH', 6, jsonb_build_object('text', $$Diketahui segitiga siku-siku dengan sisi tegak 3 cm dan 4 cm. Berapa sisi miringnya? Langkah: c² = a² + b² = 3² + 4² = 9 + 16 = 25. Maka c = √25 = 5 cm. Jadi sisi miringnya 5 cm.$$)),
(gen_random_uuid(), 'e4000006-4000-4000-4000-400000000006', 'HEADING', 7, jsonb_build_object('text', $$Contoh 2: Mencari Sisi Tegak$$)),
(gen_random_uuid(), 'e4000006-4000-4000-4000-400000000006', 'PARAGRAPH', 8, jsonb_build_object('text', $$Diketahui sisi miring 13 cm dan satu sisi tegak 5 cm. Berapa sisi tegak lainnya? Langkah: a² = c² − b² = 13² − 5² = 169 − 25 = 144. Maka a = √144 = 12 cm. Ingat: sisi yang dicari dipindah ruas menjadi pengurangan.$$)),
(gen_random_uuid(), 'e4000006-4000-4000-4000-400000000006', 'HEADING', 9, jsonb_build_object('text', $$Tripel Pythagoras$$)),
(gen_random_uuid(), 'e4000006-4000-4000-4000-400000000006', 'PARAGRAPH', 10, jsonb_build_object('text', $$Pasangan tiga bilangan bulat yang memenuhi teorema disebut tripel Pythagoras. Hafalkan yang sering keluar: (3, 4, 5), (5, 12, 13), (8, 15, 17), (7, 24, 25), dan kelipatannya seperti (6, 8, 10). Jika soal memakai angka-angka ini, jawabannya bisa langsung ditebak tanpa menghitung.$$)),
(gen_random_uuid(), 'e4000006-4000-4000-4000-400000000006', 'HEADING', 11, jsonb_build_object('text', $$Latihan Soal$$)),
(gen_random_uuid(), 'e4000006-4000-4000-4000-400000000006', 'PARAGRAPH', 12, jsonb_build_object('text', $$1. Sisi tegak sebuah segitiga siku-siku adalah 6 cm dan 8 cm. Hitung sisi miringnya! 2. Sisi miring 25 cm, satu sisi tegak 7 cm. Hitung sisi tegak lainnya! 3. Apakah (9, 12, 15) tripel Pythagoras? Buktikan! Kunci: 1. c² = 36 + 64 = 100 → c = 10 cm. 2. a² = 625 − 49 = 576 → a = 24 cm. 3. Ya: 9² + 12² = 81 + 144 = 225 = 15² (kelipatan 3 dari tripel 3-4-5).$$));
