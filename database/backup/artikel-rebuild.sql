-- Artikel konten Madevi (rekonstruksi pasca-reset) — 2026-10-13
-- Owner principal: f7125028-187e-44e0-b95b-88b69b8d5c9a

-- ============ 1. TUT-HP-CHARGE-001 ============
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, status, created_by, updated_by)
VALUES ('e1111111-1111-1111-1111-111111111111', 'TUT-HP-CHARGE-001', 'b1000002-0000-0000-0000-000000000002',
'HP Tidak Bisa Di-charge: Diagnosis dan Solusi Lengkap', 'hp-tidak-bisa-di-charge-diagnosis-solusi',
'Panduan lengkap mendiagnosis dan memperbaiki HP yang tidak bisa di-charge: dari masalah kabel hingga IC charge.',
'id', 8, 'DRAFT', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (id) DO NOTHING;

INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
(gen_random_uuid(), 'e1111111-1111-1111-1111-111111111111', 'HEADING', 1, jsonb_build_object('text', $$Masalah: HP Tidak Bisa Di-charge$$)),
(gen_random_uuid(), 'e1111111-1111-1111-1111-111111111111', 'PARAGRAPH', 2, jsonb_build_object('text', $$HP dicolok charger tapi tidak ada indikator mengisi daya, atau persentase baterai tidak bertambah. Masalah ini bisa disebabkan oleh kabel rusak, adaptor bermasalah, port USB kotor, baterai drop, hingga IC charge yang rusak.$$)),
(gen_random_uuid(), 'e1111111-1111-1111-1111-111111111111', 'HEADING', 3, jsonb_build_object('text', $$Penjelasan: Alur Pengisian Daya$$)),
(gen_random_uuid(), 'e1111111-1111-1111-1111-111111111111', 'PARAGRAPH', 4, jsonb_build_object('text', $$Arus dari adaptor mengalir melalui kabel USB ke port charge HP, lalu diatur oleh IC charge sebelum masuk ke baterai. Gangguan di salah satu titik akan menghentikan pengisian.$$)),
(gen_random_uuid(), 'e1111111-1111-1111-1111-111111111111', 'HEADING', 5, jsonb_build_object('text', $$Alat yang Dibutuhkan$$)),
(gen_random_uuid(), 'e1111111-1111-1111-1111-111111111111', 'LIST', 6, jsonb_build_object('items', ARRAY[$$Kabel USB cadangan yang masih bagus$$, $$Adaptor charger cadangan$$, $$Tusuk gigi / sikat gigi bekas (untuk membersihkan port)$$, $$Multimeter (opsional, untuk cek tegangan)$$])),
(gen_random_uuid(), 'e1111111-1111-1111-1111-111111111111', 'HEADING', 7, jsonb_build_object('text', $$Langkah Perbaikan$$)),
(gen_random_uuid(), 'e1111111-1111-1111-1111-111111111111', 'LIST', 8, jsonb_build_object('items', ARRAY[$$1. Coba kabel dan adaptor lain yang sudah terbukti bagus$$, $$2. Bersihkan port USB HP dari debu dengan tusuk gigi secara perlahan$$, $$3. Restart HP, lalu coba charge dalam keadaan mati$$, $$4. Cek apakah HP panas berlebih saat di-charge (tanda IC bermasalah)$$, $$5. Jika tetap tidak bisa, bawa ke teknisi untuk cek IC charge/baterai$$])),
(gen_random_uuid(), 'e1111111-1111-1111-1111-111111111111', 'HEADING', 9, jsonb_build_object('text', $$Risiko$$)),
(gen_random_uuid(), 'e1111111-1111-1111-1111-111111111111', 'PARAGRAPH', 10, jsonb_build_object('text', $$Jangan congkel port USB dengan benda logam saat HP menyala (risiko korsleting). Jangan gunakan charger abal-abal dengan tegangan tidak stabil — bisa merusak IC charge permanen.$$)),
(gen_random_uuid(), 'e1111111-1111-1111-1111-111111111111', 'HEADING', 11, jsonb_build_object('text', $$Penyelesaian$$)),
(gen_random_uuid(), 'e1111111-1111-1111-1111-111111111111', 'PARAGRAPH', 12, jsonb_build_object('text', $$80% kasus selesai di langkah 1-3 (kabel/adaptor/port kotor). Jika masalah berlanjut setelah semua langkah, kemungkinan besar IC charge atau baterai yang perlu diganti teknisi. Estimasi biaya servis IC charge: Rp150-300 ribu tergantung tipe HP.$$));

-- ============ 2. TUT-KERAN-001 ============
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, status, created_by, updated_by)
VALUES ('e2222222-2222-2222-2222-222222222222', 'TUT-KERAN-001', 'b1000001-0000-0000-0000-000000000001',
'Keran Air Bocor: Cara Memperbaiki Sendiri', 'keran-air-bocor-cara-memperbaiki',
'Panduan memperbaiki keran air yang menetes terus: dari diagnosis seal hingga penggantian sparepart.',
'id', 6, 'DRAFT', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (id) DO NOTHING;

INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
(gen_random_uuid(), 'e2222222-2222-2222-2222-222222222222', 'HEADING', 1, jsonb_build_object('text', $$Masalah: Keran Menetes Terus$$)),
(gen_random_uuid(), 'e2222222-2222-2222-2222-222222222222', 'PARAGRAPH', 2, jsonb_build_object('text', $$Keran sudah diputar mentok tapi air masih menetes. Selain boros, tetesan terus-menerus bisa merusak wastafel dan menambah tagihan air.$$)),
(gen_random_uuid(), 'e2222222-2222-2222-2222-222222222222', 'HEADING', 3, jsonb_build_object('text', $$Penjelasan: Penyebab Umum$$)),
(gen_random_uuid(), 'e2222222-2222-2222-2222-222222222222', 'PARAGRAPH', 4, jsonb_build_object('text', $$90% keran bocor disebabkan seal/karet washer yang aus atau mengeras. Sisanya: ulir dol, atau cartridge rusak (untuk keran model tuas).$$)),
(gen_random_uuid(), 'e2222222-2222-2222-2222-222222222222', 'HEADING', 5, jsonb_build_object('text', $$Alat yang Dibutuhkan$$)),
(gen_random_uuid(), 'e2222222-2222-2222-2222-222222222222', 'LIST', 6, jsonb_build_object('items', ARRAY[$$Kunci inggris / kunci pas$$, $$Obeng plus dan minus$$, $$Seal/karet washer cadangan (bawa contoh ke toko)$$, $$Isolasi pipa (seal tape)$$])),
(gen_random_uuid(), 'e2222222-2222-2222-2222-222222222222', 'HEADING', 7, jsonb_build_object('text', $$Langkah Perbaikan$$)),
(gen_random_uuid(), 'e2222222-2222-2222-2222-222222222222', 'LIST', 8, jsonb_build_object('items', ARRAY[$$1. Tutup keran utama air$$, $$2. Buka tutup keran, lepas baut pegangan$$, $$3. Lepas mur pengunci dengan kunci inggris$$, $$4. Angkat as keran, periksa karet washer di ujungnya$$, $$5. Ganti washer yang aus/pecah dengan yang baru$$, $$6. Pasang kembali, buka keran utama, tes$$])),
(gen_random_uuid(), 'e2222222-2222-2222-2222-222222222222', 'HEADING', 9, jsonb_build_object('text', $$Risiko$$)),
(gen_random_uuid(), 'e2222222-2222-2222-2222-222222222222', 'PARAGRAPH', 10, jsonb_build_object('text', $$Jangan paksa memutar mur yang macet — bisa patah dan merusak dudukan keran. Jika ulir sudah dol, lebih baik ganti keran baru daripada dipaksa.$$)),
(gen_random_uuid(), 'e2222222-2222-2222-2222-222222222222', 'HEADING', 11, jsonb_build_object('text', $$Penyelesaian$$)),
(gen_random_uuid(), 'e2222222-2222-2222-2222-222222222222', 'PARAGRAPH', 12, jsonb_build_object('text', $$Biaya washer cadangan: Rp5-15 ribu. Waktu pengerjaan: 15-30 menit. Jika setelah ganti washer masih bocor, kemungkinan cartridge/ulir yang rusak — pertimbangkan ganti keran baru (Rp50-150 ribu).$$));

-- ============ 3. TUT-LAPTOP-001 ============
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, status, created_by, updated_by)
VALUES ('e3333333-3333-3333-3333-333333333333', 'TUT-LAPTOP-001', 'b1000003-0000-0000-0000-000000000003',
'Laptop Lemot Setelah Update: Solusi Bertahap', 'laptop-lemot-setelah-update-solusi',
'Laptop jadi lambat setelah update Windows? Ikuti diagnosis bertahap dari yang paling ringan hingga solusi terakhir.',
'id', 7, 'DRAFT', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (id) DO NOTHING;

INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
(gen_random_uuid(), 'e3333333-3333-3333-3333-333333333333', 'HEADING', 1, jsonb_build_object('text', $$Masalah: Laptop Melambat Drastis$$)),
(gen_random_uuid(), 'e3333333-3333-3333-3333-333333333333', 'PARAGRAPH', 2, jsonb_build_object('text', $$Setelah update Windows, laptop butuh waktu lama untuk booting, aplikasi sering not responding, dan kipas berputar kencang terus.$$)),
(gen_random_uuid(), 'e3333333-3333-3333-3333-333333333333', 'HEADING', 3, jsonb_build_object('text', $$Penjelasan: Kenapa Bisa Lemot$$)),
(gen_random_uuid(), 'e3333333-3333-3333-3333-333333333333', 'PARAGRAPH', 4, jsonb_build_object('text', $$Update sering menambah service background, mengaktifkan ulang fitur yang tidak perlu, atau tidak cocok dengan driver lama. Disk 100% di Task Manager adalah gejala paling umum.$$)),
(gen_random_uuid(), 'e3333333-3333-3333-3333-333333333333', 'HEADING', 5, jsonb_build_object('text', $$Alat yang Dibutuhkan$$)),
(gen_random_uuid(), 'e3333333-3333-3333-3333-333333333333', 'LIST', 6, jsonb_build_object('items', ARRAY[$$Akses administrator$$, $$Koneksi internet (untuk update driver)$$, $$Waktu 30-60 menit$$])),
(gen_random_uuid(), 'e3333333-3333-3333-3333-333333333333', 'HEADING', 7, jsonb_build_object('text', $$Langkah Perbaikan (Urut dari Ringan)$$)),
(gen_random_uuid(), 'e3333333-3333-3333-3333-333333333333', 'LIST', 8, jsonb_build_object('items', ARRAY[$$1. Buka Task Manager, cek aplikasi yang memakan CPU/Disk tinggi — end task yang tidak perlu$$, $$2. Matikan startup program yang tidak penting (Task Manager > Startup)$$, $$3. Jalankan Disk Cleanup untuk hapus file update lama$$, $$4. Update driver (terutama storage/chipset) dari situs resmi produsen laptop$$, $$5. Jika masih lemot: pertimbangkan upgrade ke SSD (solusi paling efektif untuk HDD lama)$$, $$6. Opsi terakhir: reset Windows dengan opsi keep my files$$])),
(gen_random_uuid(), 'e3333333-3333-3333-3333-333333333333', 'HEADING', 9, jsonb_build_object('text', $$Risiko$$)),
(gen_random_uuid(), 'e3333333-3333-3333-3333-333333333333', 'PARAGRAPH', 10, jsonb_build_object('text', $$Jangan matikan paksa saat update berjalan (risiko corrupt). Backup data penting sebelum reset Windows. Jangan install optimizer abal-abal — kebanyakan justru menambah masalah.$$)),
(gen_random_uuid(), 'e3333333-3333-3333-3333-333333333333', 'HEADING', 11, jsonb_build_object('text', $$Penyelesaian$$)),
(gen_random_uuid(), 'e3333333-3333-3333-3333-333333333333', 'PARAGRAPH', 12, jsonb_build_object('text', $$Langkah 1-4 gratis dan menyelesaikan 70% kasus. Upgrade SSD (Rp400-800 ribu) adalah investasi terbaik untuk laptop HDD yang sudah berumur 3+ tahun.$$));

-- ============ 4. EXP-CHORDATA-001 ============
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, status, created_by, updated_by)
VALUES ('e4444444-4444-4444-4444-444444444444', 'EXP-CHORDATA-001', 'c1000001-0000-0000-0000-000000000001',
'Chordata: Filum Hewan Bertulang Belakang', 'chordata-filum-hewan-bertulang-belakang',
'Mengenal filum Chordata: lima ciri khas, klasifikasi lima kelas vertebrata, dan peran ekologisnya.',
'id', 7, 'DRAFT', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (id) DO NOTHING;

INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
(gen_random_uuid(), 'e4444444-4444-4444-4444-444444444444', 'HEADING', 1, jsonb_build_object('text', $$Pengertian Filum Chordata$$)),
(gen_random_uuid(), 'e4444444-4444-4444-4444-444444444444', 'PARAGRAPH', 2, jsonb_build_object('text', $$Chordata adalah filum hewan yang memiliki notokorda (batang penyangga lentur) pada suatu tahap hidupnya. Filum ini mencakup semua hewan bertulang belakang (vertebrata) seperti ikan, katak, ular, burung, dan manusia, serta kelompok invertebrata seperti tunikata dan lancelet.$$)),
(gen_random_uuid(), 'e4444444-4444-4444-4444-444444444444', 'HEADING', 3, jsonb_build_object('text', $$Lima Ciri Khas Chordata$$)),
(gen_random_uuid(), 'e4444444-4444-4444-4444-444444444444', 'LIST', 4, jsonb_build_object('items', ARRAY[$$Notokorda: batang penyangga lentur di sepanjang punggung, kelak digantikan tulang belakang pada vertebrata$$, $$Tali saraf dorsal berongga: cikal bakal otak dan sumsum tulang belakang$$, $$Celah faring: celah pada tenggorokan, berkembang menjadi insang pada ikan atau telinga tengah pada mamalia$$, $$Ekor post-anal: ekor yang memanjang melewati anus$$, $$Endostyle: alur bersilia pada faring, cikal bakal kelenjar tiroid pada vertebrata$$])),
(gen_random_uuid(), 'e4444444-4444-4444-4444-444444444444', 'HEADING', 5, jsonb_build_object('text', $$Klasifikasi: Lima Kelas Vertebrata$$)),
(gen_random_uuid(), 'e4444444-4444-4444-4444-444444444444', 'LIST', 6, jsonb_build_object('items', ARRAY[$$Pisces (ikan): bernapas dengan insang, berdarah dingin. Contoh: ikan mas, hiu, pari$$, $$Amphibia (amfibi): hidup di dua alam, metamorfosis. Contoh: katak, salamander$$, $$Reptilia (reptil): bersisik kering, bertelur di darat. Contoh: ular, kadal, buaya$$, $$Aves (burung): berbulu, berdarah panas, bisa terbang. Contoh: elang, merpati, penguin$$, $$Mammalia (mamalia): berambut, menyusui. Contoh: kucing, paus, manusia$$])),
(gen_random_uuid(), 'e4444444-4444-4444-4444-444444444444', 'HEADING', 7, jsonb_build_object('text', $$Sistem Organ Utama$$)),
(gen_random_uuid(), 'e4444444-4444-4444-4444-444444444444', 'PARAGRAPH', 8, jsonb_build_object('text', $$Vertebrata memiliki sistem peredaran darah tertutup dengan jantung beruang, sistem pencernaan lengkap dari mulut hingga anus, sistem saraf terpusat (otak dan sumsum tulang belakang), serta kerangka dalam (endoskeleton) dari tulang atau tulang rawan.$$)),
(gen_random_uuid(), 'e4444444-4444-4444-4444-444444444444', 'HEADING', 9, jsonb_build_object('text', $$Peran Ekologis Chordata$$)),
(gen_random_uuid(), 'e4444444-4444-4444-4444-444444444444', 'PARAGRAPH', 10, jsonb_build_object('text', $$Chordata menempati hampir semua relung ekologi: predator puncak (singa, elang), herbivora besar (gajah, sapi), hingga plankton (larva tunikata). Ikan menjadi sumber protein utama manusia, burung membantu penyerbukan dan penyebaran biji, dan mamalia berperan dalam rantai makanan di darat maupun laut.$$));

-- ============ 5. EXP-ARTHROPODA-001 ============
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, status, created_by, updated_by)
VALUES ('e5555555-5555-5555-5555-555555555555', 'EXP-ARTHROPODA-001', 'c1000002-0000-0000-0000-000000000002',
'Arthropoda: Filum Hewan Berbuku-buku Terbesar', 'arthropoda-filum-hewan-berbuku-buku',
'Mengenal filum Arthropoda: ciri diagnostik, empat subfilum, kelas Insecta, metamorfosis, dan perannya.',
'id', 7, 'DRAFT', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (id) DO NOTHING;

INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
(gen_random_uuid(), 'e5555555-5555-5555-5555-555555555555', 'HEADING', 1, jsonb_build_object('text', $$Pengertian Filum Arthropoda$$)),
(gen_random_uuid(), 'e5555555-5555-5555-5555-555555555555', 'PARAGRAPH', 2, jsonb_build_object('text', $$Arthropoda adalah filum hewan terbesar di Bumi — lebih dari 80% spesies hewan yang diketahui adalah arthropoda. Namanya berarti kaki beruas (arthro = ruas, poda = kaki). Kelompok ini mencakup serangga, laba-laba, udang, kepiting, dan lipan.$$)),
(gen_random_uuid(), 'e5555555-5555-5555-5555-555555555555', 'HEADING', 3, jsonb_build_object('text', $$Empat Ciri Diagnostik$$)),
(gen_random_uuid(), 'e5555555-5555-5555-5555-555555555555', 'LIST', 4, jsonb_build_object('items', ARRAY[$$Eksoskeleton kitin: rangka luar keras yang melindungi tubuh dan tempat melekatnya otot$$, $$Kaki beruas (artikulasi): anggota tubuh bersendi yang memungkinkan gerak lincah$$, $$Ekdisis (ganti kulit): melepaskan eksoskeleton lama agar bisa tumbuh$$, $$Peredaran darah terbuka: hemolimfa mengalir bebas di rongga tubuh (hemocoel)$$])),
(gen_random_uuid(), 'e5555555-5555-5555-5555-555555555555', 'HEADING', 5, jsonb_build_object('text', $$Klasifikasi: Empat Subfilum$$)),
(gen_random_uuid(), 'e5555555-5555-5555-5555-555555555555', 'LIST', 6, jsonb_build_object('items', ARRAY[$$Chelicerata: laba-laba, kalajengking, tungau — memiliki kelisera (capit)$$, $$Myriapoda: lipan dan luwing — tubuh bersegmen banyak dengan banyak kaki$$, $$Crustacea: udang, kepiting, lobster — umumnya hidup di air, dua pasang antena$$, $$Hexapoda: serangga — enam kaki, tubuh tiga bagian (kepala, dada, perut). Contoh: kupu-kupu, semut, kumbang$$])),
(gen_random_uuid(), 'e5555555-5555-5555-5555-555555555555', 'HEADING', 7, jsonb_build_object('text', $$Kelas Insecta dan Metamorfosis$$)),
(gen_random_uuid(), 'e5555555-5555-5555-5555-555555555555', 'PARAGRAPH', 8, jsonb_build_object('text', $$Serangga mengalami metamorfosis: sempurna (telur → larva → pupa → imago, misal kupu-kupu) atau tidak sempurna (telur → nimfa → imago, misal belalang). Metamorfosis sempurna memungkinkan larva dan dewasa menempati relung berbeda sehingga tidak bersaing makanan.$$)),
(gen_random_uuid(), 'e5555555-5555-5555-5555-555555555555', 'HEADING', 9, jsonb_build_object('text', $$Peran Ekologis dan Ekonomi$$)),
(gen_random_uuid(), 'e5555555-5555-5555-5555-555555555555', 'PARAGRAPH', 10, jsonb_build_object('text', $$Arthropoda adalah penyerbuk utama tanaman (lebah), pengurai sampah organik, sumber protein (udang, kepiting), penghasil madu dan sutra, namun juga hama pertanian dan vektor penyakit (nyamuk pembawa malaria dan demam berdarah).$$));

-- ============ 6. EXP-ANGIOSPERMAE-001 ============
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, status, created_by, updated_by)
VALUES ('e6666666-6666-6666-6666-666666666666', 'EXP-ANGIOSPERMAE-001', 'c1000003-0000-0000-0000-000000000003',
'Angiospermae: Tumbuhan Berbunga', 'angiospermae-tumbuhan-berbunga',
'Mengenal tumbuhan berbunga: ciri khas, monokotil vs dikotil, pembuahan ganda, dan peran bagi peradaban.',
'id', 6, 'DRAFT', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (id) DO NOTHING;

INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
(gen_random_uuid(), 'e6666666-6666-6666-6666-666666666666', 'HEADING', 1, jsonb_build_object('text', $$Pengertian Angiospermae$$)),
(gen_random_uuid(), 'e6666666-6666-6666-6666-666666666666', 'PARAGRAPH', 2, jsonb_build_object('text', $$Angiospermae (tumbuhan berbunga) adalah kelompok tumbuhan paling dominan di darat saat ini, dengan sekitar 300.000 spesies. Ciri utamanya: bakal biji terlindungi di dalam bakal buah (ovarium), sehingga disebut tumbuhan berbiji tertutup.$$)),
(gen_random_uuid(), 'e6666666-6666-6666-6666-666666666666', 'HEADING', 3, jsonb_build_object('text', $$Lima Ciri Khas$$)),
(gen_random_uuid(), 'e6666666-6666-6666-6666-666666666666', 'LIST', 4, jsonb_build_object('items', ARRAY[$$Bunga: organ reproduksi dengan benang sari dan putik$$, $$Ovul terlindung: bakal biji berada di dalam bakal buah (ovarium)$$, $$Pembuahan ganda: satu sperma membuahi sel telur, satu lagi membentuk endosperma$$, $$Buah: bakal buah berkembang menjadi buah yang melindungi dan menyebarkan biji$$, $$Xilem vessel: pembuluh angkut air yang efisien$$])),
(gen_random_uuid(), 'e6666666-6666-6666-6666-666666666666', 'HEADING', 5, jsonb_build_object('text', $$Monokotil vs Dikotil$$)),
(gen_random_uuid(), 'e6666666-6666-6666-6666-666666666666', 'LIST', 6, jsonb_build_object('items', ARRAY[$$Monokotil: satu keping biji, tulang daun sejajar, akar serabut, bunga kelipatan 3. Contoh: padi, jagung, kelapa$$, $$Dikotil: dua keping biji, tulang daun menyirip/menjari, akar tunggang, bunga kelipatan 4 atau 5. Contoh: mangga, kacang tanah, tomat$$])),
(gen_random_uuid(), 'e6666666-6666-6666-6666-666666666666', 'HEADING', 7, jsonb_build_object('text', $$Reproduksi: Pembuahan Ganda$$)),
(gen_random_uuid(), 'e6666666-6666-6666-6666-666666666666', 'PARAGRAPH', 8, jsonb_build_object('text', $$Penyerbukan membawa serbuk sari ke kepala putik. Tabung polen tumbuh menuju bakal biji; dua sel sperma dilepas: satu membuahi sel telur menjadi zigot (embrio), satunya membuahi inti kandung lembaga sekunder menjadi endosperma (cadangan makanan). Bakal buah lalu berkembang menjadi buah dan biji tersebar oleh hewan, angin, atau air.$$)),
(gen_random_uuid(), 'e6666666-6666-6666-6666-666666666666', 'HEADING', 9, jsonb_build_object('text', $$Peran bagi Peradaban$$)),
(gen_random_uuid(), 'e6666666-6666-6666-6666-666666666666', 'PARAGRAPH', 10, jsonb_build_object('text', $$Hampir semua bahan pangan manusia berasal dari angiospermae: padi, gandum, jagung (serealia), buah-buahan, sayuran, dan kacang-kacangan. Kayu, kapas, karet, minyak nabati, obat-obatan (misal kina, aspirin dari willow), hingga oksigen yang kita hirup — semuanya jasa tumbuhan berbunga.$$));

-- ============ 7. SCH-MAT-1-001 ============
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, status, created_by, updated_by)
VALUES ('e7777777-7777-7777-7777-777777777777', 'SCH-MAT-1-001', 'd2000001-0000-0000-0000-000000000001',
'Berhitung 1 sampai 20: Penjumlahan dan Pengurangan', 'berhitung-1-20-kelas-1',
'Materi matematika kelas 1 SD: berhitung 1-20, penjumlahan dan pengurangan sederhana dengan contoh dan latihan.',
'id', 6, 'DRAFT', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (id) DO NOTHING;

INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
(gen_random_uuid(), 'e7777777-7777-7777-7777-777777777777', 'HEADING', 1, jsonb_build_object('text', $$Tujuan Pembelajaran$$)),
(gen_random_uuid(), 'e7777777-7777-7777-7777-777777777777', 'PARAGRAPH', 2, jsonb_build_object('text', $$Setelah mempelajari materi ini, kamu bisa berhitung 1 sampai 20, menjumlahkan dua bilangan kecil, dan mengurangkan bilangan kecil dengan benar.$$)),
(gen_random_uuid(), 'e7777777-7777-7777-7777-777777777777', 'HEADING', 3, jsonb_build_object('text', $$Berhitung 1 sampai 20$$)),
(gen_random_uuid(), 'e7777777-7777-7777-7777-777777777777', 'PARAGRAPH', 4, jsonb_build_object('text', $$Ayo berhitung bersama: 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20. Coba hitung jarimu: tangan kanan 5, tangan kiri 5, jadi 10 jari. Tambah 10 lagi dengan menghitung benda di sekitarmu sampai 20!$$)),
(gen_random_uuid(), 'e7777777-7777-7777-7777-777777777777', 'HEADING', 5, jsonb_build_object('text', $$Penjumlahan Sederhana$$)),
(gen_random_uuid(), 'e7777777-7777-7777-7777-777777777777', 'PARAGRAPH', 6, jsonb_build_object('text', $$Penjumlahan artinya menggabungkan. Contoh: 3 + 4. Langkahnya: (1) siapkan 3 kelereng, (2) tambah 4 kelereng lagi, (3) hitung semuanya: 1, 2, 3, 4, 5, 6, 7. Jadi 3 + 4 = 7. Contoh lain: 5 + 2 = 7, 6 + 3 = 9, 10 + 5 = 15.$$)),
(gen_random_uuid(), 'e7777777-7777-7777-7777-777777777777', 'HEADING', 7, jsonb_build_object('text', $$Pengurangan Sederhana$$)),
(gen_random_uuid(), 'e7777777-7777-7777-7777-777777777777', 'PARAGRAPH', 8, jsonb_build_object('text', $$Pengurangan artinya mengambil sebagian. Contoh: 8 − 3. Langkahnya: (1) siapkan 8 permen, (2) ambil 3 permen, (3) hitung sisanya: 1, 2, 3, 4, 5. Jadi 8 − 3 = 5. Contoh lain: 10 − 4 = 6, 7 − 2 = 5, 15 − 5 = 10.$$)),
(gen_random_uuid(), 'e7777777-7777-7777-7777-777777777777', 'HEADING', 9, jsonb_build_object('text', $$Latihan Soal$$)),
(gen_random_uuid(), 'e7777777-7777-7777-7777-777777777777', 'LIST', 10, jsonb_build_object('items', ARRAY[$$1. 4 + 5 = ...$$, $$2. 12 − 6 = ...$$, $$3. Ibu punya 7 apel, dimakan ayah 2 apel. Sisa apel ibu ada ...$$])),
(gen_random_uuid(), 'e7777777-7777-7777-7777-777777777777', 'HEADING', 11, jsonb_build_object('text', $$Kunci Jawaban$$)),
(gen_random_uuid(), 'e7777777-7777-7777-7777-777777777777', 'LIST', 12, jsonb_build_object('items', ARRAY[$$1. 4 + 5 = 9$$, $$2. 12 − 6 = 6$$, $$3. 7 − 2 = 5 apel$$]));

-- ============ 8. SCH-BIN-1-001 ============
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, status, created_by, updated_by)
VALUES ('e8888888-8888-8888-8888-888888888888', 'SCH-BIN-1-001', 'd2000002-0000-0000-0000-000000000002',
'Mengenal Huruf Vokal dan Suku Kata', 'huruf-vokal-suku-kata-kelas-1',
'Materi bahasa Indonesia kelas 1 SD: mengenal lima huruf vokal, huruf konsonan, dan membaca suku kata sederhana.',
'id', 6, 'DRAFT', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (id) DO NOTHING;

INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
(gen_random_uuid(), 'e8888888-8888-8888-8888-888888888888', 'HEADING', 1, jsonb_build_object('text', $$Tujuan Pembelajaran$$)),
(gen_random_uuid(), 'e8888888-8888-8888-8888-888888888888', 'PARAGRAPH', 2, jsonb_build_object('text', $$Setelah mempelajari materi ini, kamu bisa menyebutkan lima huruf vokal, membedakan huruf konsonan, dan membaca suku kata sederhana seperti ba, bi, bu, be, bo.$$)),
(gen_random_uuid(), 'e8888888-8888-8888-8888-888888888888', 'HEADING', 3, jsonb_build_object('text', $$Huruf Vokal$$)),
(gen_random_uuid(), 'e8888888-8888-8888-8888-888888888888', 'PARAGRAPH', 4, jsonb_build_object('text', $$Huruf vokal ada lima: a, i, u, e, o. Huruf vokal adalah nyawa kata — setiap suku kata pasti punya huruf vokal. Coba ucapkan: a (mulut terbuka lebar), i (mulut menyeringai), u (bibir maju), e (seperti pada kata enak), o (bibir membulat).$$)),
(gen_random_uuid(), 'e8888888-8888-8888-8888-888888888888', 'HEADING', 5, jsonb_build_object('text', $$Huruf Konsonan$$)),
(gen_random_uuid(), 'e8888888-8888-8888-8888-888888888888', 'PARAGRAPH', 6, jsonb_build_object('text', $$Huruf konsonan adalah semua huruf selain vokal: b, c, d, f, g, h, j, k, l, m, n, p, q, r, s, t, v, w, x, y, z. Huruf konsonan biasanya dibaca bersama huruf vokal menjadi suku kata, misalnya b + a dibaca ba.$$)),
(gen_random_uuid(), 'e8888888-8888-8888-8888-888888888888', 'HEADING', 7, jsonb_build_object('text', $$Suku Kata ba-bi-bu-be-bo$$)),
(gen_random_uuid(), 'e8888888-8888-8888-8888-888888888888', 'PARAGRAPH', 8, jsonb_build_object('text', $$Gabungkan huruf b dengan setiap vokal: ba, bi, bu, be, bo. Ayo baca: ba-ju (baju), bu-ku (buku), bo-la (bola), be-li (beli), bi-ru (biru). Suku kata bisa digabung menjadi kata: ba + ju = baju, bu + ku = buku. Coba baca kata lain: sa + pu = sapu, me + ja = meja!$$)),
(gen_random_uuid(), 'e8888888-8888-8888-8888-888888888888', 'HEADING', 9, jsonb_build_object('text', $$Latihan Soal$$)),
(gen_random_uuid(), 'e8888888-8888-8888-8888-888888888888', 'LIST', 10, jsonb_build_object('items', ARRAY[$$1. Sebutkan lima huruf vokal!$$, $$2. Gabungkan suku kata: ka + ki menjadi ...$$, $$3. Pisahkan kata bola menjadi suku kata: ... + ...$$])),
(gen_random_uuid(), 'e8888888-8888-8888-8888-888888888888', 'HEADING', 11, jsonb_build_object('text', $$Kunci Jawaban$$)),
(gen_random_uuid(), 'e8888888-8888-8888-8888-888888888888', 'LIST', 12, jsonb_build_object('items', ARRAY[$$1. a, i, u, e, o$$, $$2. ka + ki = kaki$$, $$3. bola = bo + la$$]));
