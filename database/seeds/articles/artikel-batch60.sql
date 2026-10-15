-- ============================================================================
-- Madevi Content Batch 60 — 6 artikel (2 Tutorial, 2 Explore, 2 School)
-- Idempoten: ON CONFLICT DO NOTHING pada artikel; block lama dihapus dulu.
-- Owner: f7125028-187e-44e0-b95b-88b69b8d5c9a | status DRAFT | language id
-- ============================================================================
BEGIN;

-- --------------------------------------------------------------------------
-- 1. TUT-ELEKTRONIK10-001 — "Dioda: Penyearah Arus" (12 block)
-- Node: R1.D3 Teknologi & Gadget (b4444444-4444-4444-4444-444444444444)
-- --------------------------------------------------------------------------
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_name, creator_principal_id, access_level, status, created_by, updated_by)
VALUES (
  'e6060601-6060-4606-8606-606060606061',
  'TUT-ELEKTRONIK10-001',
  'b4444444-4444-4444-4444-444444444444',
  'Dioda: Penyearah Arus',
  'dioda-penyearah-arus',
  'Kenali dioda: komponen mungil yang hanya meloloskan arus satu arah, fondasi penyearah, proteksi polaritas, dan catu daya.',
  'id', 6, 'Madevi', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'MEMBER', 'DRAFT',
  'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a'
) ON CONFLICT (business_code) DO NOTHING;

DELETE FROM madevi.article_blocks WHERE article_id = 'e6060601-6060-4606-8606-606060606061';

INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
(gen_random_uuid(), 'e6060601-6060-4606-8606-606060606061', 'HEADING', 0, jsonb_build_object('text', $$Masalah: Komponen Rusak karena Arus Bolak-balik$$)),
(gen_random_uuid(), 'e6060601-6060-4606-8606-606060606061', 'PARAGRAPH', 1, jsonb_build_object('text', $$Banyak perangkat elektronik — dari charger HP hingga radio — membutuhkan arus searah (DC), sementara listrik PLN adalah arus bolak-balik (AC). Tanpa komponen penyearah, arus AC yang masuk akan merusak rangkaian DC: LED mati, kapasitor meledak, IC terbakar. Solusinya adalah dioda, komponen semikonduktor yang bekerja seperti katup satu arah untuk arus listrik.$$)),
(gen_random_uuid(), 'e6060601-6060-4606-8606-606060606061', 'HEADING', 2, jsonb_build_object('text', $$Apa Itu Dioda$$)),
(gen_random_uuid(), 'e6060601-6060-4606-8606-606060606061', 'PARAGRAPH', 3, jsonb_build_object('text', $$Dioda terbuat dari sambungan dua bahan semikonduktor tipe P dan tipe N. Ia hanya menghantar arus ketika diberi tegangan maju (forward bias): kaki anoda (+) lebih positif dari katoda (-). Pada kondisi ini ada tegangan jatuh sekitar 0,7 volt untuk dioda silikon dan 0,2–0,3 volt untuk dioda germanium. Jika polaritas dibalik (reverse bias), dioda menyumbat arus — kecuali tegangannya melampaui batas tegangan balik maksimum, yang bisa merusak dioda secara permanen.$$)),
(gen_random_uuid(), 'e6060601-6060-4606-8606-606060606061', 'HEADING', 4, jsonb_build_object('text', $$Alat dan Bahan$$)),
(gen_random_uuid(), 'e6060601-6060-4606-8606-606060606061', 'LIST', 5, jsonb_build_object('items', $$["Dioda 1N4007 (dioda penyearah umum, 1A/1000V) — 4 buah", "LED merah dan resistor 330 ohm sebagai indikator", "Breadboard dan kabel jumper", "Baterai 9V dengan konektor", "Multimeter digital", "Trafo kecil 6V CT bila ingin mencoba penyearah AC (opsional, dengan pendamping)"]$$)),
(gen_random_uuid(), 'e6060601-6060-4606-8606-606060606061', 'HEADING', 6, jsonb_build_object('text', $$Langkah: Uji Sifat Satu Arah Dioda$$)),
(gen_random_uuid(), 'e6060601-6060-4606-8606-606060606061', 'PARAGRAPH', 7, jsonb_build_object('text', $$Pertama, kenali kaki dioda: garis putih pada badan dioda menandai katoda. Rangkai LED, resistor 330 ohm, dan dioda secara seri ke baterai 9V dengan anoda dioda menghadap kutub positif — LED menyala, artinya arus mengalir. Kedua, balik posisi dioda — LED padam, artinya arus tersumbat. Ketiga, ukur dengan multimeter mode dioda: probe merah ke anoda dan hitam ke katoda menampilkan angka sekitar 0,5–0,7 (tegangan maju), sedangkan posisi terbalik menampilkan OL (tidak menghantar). Inilah bukti kerja satu arah. Untuk penyearah gelombang penuh, rangkai 4 dioda membentuk jembatan (bridge): dua terminal AC masuk, dua terminal DC keluar — arus keluaran selalu searah walau masukan bolak-balik.$$)),
(gen_random_uuid(), 'e6060601-6060-4606-8606-606060606061', 'HEADING', 8, jsonb_build_object('text', $$Risiko dan Kesalahan Umum$$)),
(gen_random_uuid(), 'e6060601-6060-4606-8606-606060606061', 'LIST', 9, jsonb_build_object('items', $$["Polaritas terbalik pada tegangan tinggi: tegangan balik berlebih menembus dioda hingga short-circuit — selalu cek rating PIV dioda", "Arus berlebih tanpa pembatas: dioda 1N4007 hanya tahan 1A, beban besar butuh dioda berating lebih tinggi atau heatsink", "Lupa resistor seri pada LED uji: LED langsung ke baterai akan terbakar dalam hitungan detik", "Menyentuh rangkaian yang tersambung ke listrik PLN langsung — JANGAN pernah bereksperimen langsung dengan 220V tanpa isolasi trafo dan pendamping berpengalaman", "Dioda panas berlebih saat dipakai terus-menerus dekat batas arusnya"]$$)),
(gen_random_uuid(), 'e6060601-6060-4606-8606-606060606061', 'HEADING', 10, jsonb_build_object('text', $$Pemeriksaan Hasil$$)),
(gen_random_uuid(), 'e6060601-6060-4606-8606-606060606061', 'PARAGRAPH', 11, jsonb_build_object('text', $$Berhasil jika: LED menyala hanya pada satu arah pemasangan dioda, multimeter menunjukkan tegangan maju 0,5–0,7V dan OL pada arah balik, serta rangkaian jembatan 4 dioda menghasilkan tegangan DC (terukur stabil di multimeter mode DC) dari sumber AC. Tindak lanjut: tambahkan kapasitor elektrolit 1000uF/25V di keluaran bridge untuk meratakan riak menjadi catu daya DC sederhana, lalu pelajari dioda zener sebagai penstabil tegangan dan LED sebagai dioda pemancar cahaya.$$));

-- --------------------------------------------------------------------------
-- 2. TUT-MASAK15-001 — "Gudeg Jogja: Resep Manis Gurih" (12 block)
-- Node: R1.D1.K4 Rumah Tangga (b7777777-7777-7777-7777-777777777777)
-- --------------------------------------------------------------------------
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_name, creator_principal_id, access_level, status, created_by, updated_by)
VALUES (
  'e6060602-6060-4606-8606-606060606062',
  'TUT-MASAK15-001',
  'b7777777-7777-7777-7777-777777777777',
  'Gudeg Jogja: Resep Manis Gurih',
  'gudeg-jogja-resep-manis-gurih',
  'Masak gudeg Jogja autentik di rumah: nangka muda empuk, kuah santan manis gurih, dan warna cokelat cantik dari daun jati.',
  'id', 7, 'Madevi', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'MEMBER', 'DRAFT',
  'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a'
) ON CONFLICT (business_code) DO NOTHING;

DELETE FROM madevi.article_blocks WHERE article_id = 'e6060602-6060-4606-8606-606060606062';

INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
(gen_random_uuid(), 'e6060602-6060-4606-8606-606060606062', 'HEADING', 0, jsonb_build_object('text', $$Masalah: Gudeg Keras, Pucat, dan Kurang Meresap$$)),
(gen_random_uuid(), 'e6060602-6060-4606-8606-606060606062', 'PARAGRAPH', 1, jsonb_build_object('text', $$Gudeg buatan rumah sering gagal: nangka keras dan berserat, kuah encer pucat, rasa manis tidak meresap sampai ke dalam. Padahal gudeg Jogja yang enak itu empuk, berwarna cokelat kemerahan cantik, dan manis-gurihnya terasa di setiap gigitan. Kuncinya bukan bumbu mahal, melainkan teknik: pemilihan nangka yang tepat, waktu masak yang lama dengan api kecil, dan urutan memasukkan bahan yang benar.$$)),
(gen_random_uuid(), 'e6060602-6060-4606-8606-606060606062', 'HEADING', 2, jsonb_build_object('text', $$Rahasia Gudeg Jogja yang Autentik$$)),
(gen_random_uuid(), 'e6060602-6060-4606-8606-606060606062', 'PARAGRAPH', 3, jsonb_build_object('text', $$Gudeg asli dimasak sangat lama — 4 sampai 5 jam — hingga nangka hancur lembut dan bumbu meresap sempurna. Warna cokelat khasnya berasal dari daun jati yang direbus bersama (bisa diganti teh celup pekat bila sulit didapat), bukan dari kecap. Rasa manisnya datang dari gula aren asli, bukan gula pasir, sehingga ada aroma karamel yang dalam. Santan kental dimasukkan belakangan agar tidak pecah, dan telur rebus ikut dimasak lama hingga berwarna cokelat serta kenyal — inilah telur pindang pendamping gudeg.$$)),
(gen_random_uuid(), 'e6060602-6060-4606-8606-606060606062', 'HEADING', 4, jsonb_build_object('text', $$Bahan dan Bumbu (untuk 6 porsi)$$)),
(gen_random_uuid(), 'e6060602-6060-4606-8606-606060606062', 'LIST', 5, jsonb_build_object('items', $$["1 kg nangka muda, potong-potong, rebus 15 menit lalu tiriskan untuk menghilangkan getah", "500 ml santan kental + 750 ml santan encer dari 1 butir kelapa", "150 gram gula aren, sisir halus", "5 lembar daun jati (atau 3 kantong teh celup pekat sebagai pewarna alami)", "6 butir telur rebus, kupas", "Bumbu halus: 8 siung bawang merah, 5 siung bawang putih, 4 butir kemiri sangrai, 1 sdm ketumbar, 3 cm lengkuas", "3 lembar daun salam, 2 batang serai memarkan, garam secukupnya"]$$)),
(gen_random_uuid(), 'e6060602-6060-4606-8606-606060606062', 'HEADING', 6, jsonb_build_object('text', $$Langkah Memasak$$)),
(gen_random_uuid(), 'e6060602-6060-4606-8606-606060606062', 'PARAGRAPH', 7, jsonb_build_object('text', $$Pertama, tata daun jati di dasar panci tanah liat atau panci tebal — ini mencegah gosong sekaligus memberi warna. Kedua, masukkan nangka, bumbu halus, daun salam, serai, gula aren, dan garam, lalu tuang santan encer hingga semua terendam. Ketiga, masak dengan api sangat kecil selama 3 jam sambil sesekali diaduk perlahan agar tidak gosong di dasar; jangan diaduk terlalu sering agar nangka tidak hancur. Keempat, masukkan telur rebus dan tuang santan kental, lanjutkan memasak 1–2 jam lagi hingga kuah menyusut, nangka empuk, dan warna cokelat merata. Kelima, cicipi dan koreksi rasa: manis gula aren harus dominan dengan gurih santan sebagai penyeimbang, bukan manis menyengat seperti permen.$$)),
(gen_random_uuid(), 'e6060602-6060-4606-8606-606060606062', 'HEADING', 8, jsonb_build_object('text', $$Risiko dan Jebakan$$)),
(gen_random_uuid(), 'e6060602-6060-4606-8606-606060606062', 'LIST', 9, jsonb_build_object('items', $$["Api terlalu besar: santan pecah dan nangka gosong di dasar — selalu gunakan api paling kecil", "Nangka tua: berserat kasar dan tidak bisa empuk walau dimasak lama — pilih nangka muda yang masih putih", "Gula pasir sebagai pengganti gula aren: rasa manisnya datar, tidak ada aroma karamel khas gudeg", "Santan kental dimasukkan sejak awal: pecah dan berminyak — masukkan di 1–2 jam terakhir", "Tidak sabar: gudeg yang dimasak kurang dari 3 jam tidak akan pernah seenak yang dimasak 5 jam"]$$)),
(gen_random_uuid(), 'e6060602-6060-4606-8606-606060606062', 'HEADING', 10, jsonb_build_object('text', $$Penyajian dan Penyimpanan$$)),
(gen_random_uuid(), 'e6060602-6060-4606-8606-606060606062', 'PARAGRAPH', 11, jsonb_build_object('text', $$Sajikan gudeg hangat dengan nasi putih, telur pindang, tahu-tempe bacem, ayam opor suwir, dan sambal goreng krecek — komplet seperti di warung Jogja. Gudeg justru semakin enak keesokan harinya karena bumbu makin meresap; simpan dalam wadah tertutup di kulkas dan hangatkan dengan api kecil saat akan disajikan, tahan 3–4 hari. Untuk stok lebih lama, bekukan dalam porsi sekali makan — tahan hingga 1 bulan. Tindak lanjut: coba varian gudeg manggar (bunga kelapa) atau gudeg Solo yang kuahnya lebih encer dan tidak terlalu manis.$$));

-- --------------------------------------------------------------------------
-- 3. EXP-KIMIA16-001 — "Hidrogen: Unsur Paling Ringan" (10 block)
-- Node: R2.D8 Kimia (c4444444-4444-4444-4444-444444444444)
-- --------------------------------------------------------------------------
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_name, creator_principal_id, access_level, status, created_by, updated_by)
VALUES (
  'e6060603-6060-4606-8606-606060606063',
  'EXP-KIMIA16-001',
  'c4444444-4444-4444-4444-444444444444',
  'Hidrogen: Unsur Paling Ringan',
  'hidrogen-unsur-paling-ringan',
  'Mengenal hidrogen: unsur nomor satu, paling melimpah di alam semesta, bahan bakar bintang, dan kandidat energi masa depan.',
  'id', 5, 'Madevi', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'MEMBER', 'DRAFT',
  'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a'
) ON CONFLICT (business_code) DO NOTHING;

DELETE FROM madevi.article_blocks WHERE article_id = 'e6060603-6060-4606-8606-606060606063';

INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
(gen_random_uuid(), 'e6060603-6060-4606-8606-606060606063', 'HEADING', 0, jsonb_build_object('text', $$Unsur Nomor Satu$$)),
(gen_random_uuid(), 'e6060603-6060-4606-8606-606060606063', 'PARAGRAPH', 1, jsonb_build_object('text', $$Hidrogen (simbol H) menempati posisi pertama tabel periodik: atomnya hanya terdiri dari satu proton dan satu elektron, menjadikannya unsur paling sederhana sekaligus paling ringan. Satu molekul gas hidrogen (H2) 14 kali lebih ringan dari udara. Ditemukan sebagai unsur oleh Henry Cavendish pada 1766 dan dinamai hydrogen oleh Lavoisier dari bahasa Yunani hydro (air) dan genes (pembentuk) — karena pembakarannya menghasilkan air.$$)),
(gen_random_uuid(), 'e6060603-6060-4606-8606-606060606063', 'HEADING', 2, jsonb_build_object('text', $$Sifat-sifat Hidrogen$$)),
(gen_random_uuid(), 'e6060603-6060-4606-8606-606060606063', 'PARAGRAPH', 3, jsonb_build_object('text', $$Pada suhu ruang hidrogen berupa gas tidak berwarna, tidak berbau, dan tidak berasa. Ia sangat mudah terbakar: campuran hidrogen dan oksigen meledak dengan nyala hampir tak terlihat — inilah penyebab tragedi balon udara Hindenburg 1937. Hidrogen juga merupakan pereduksi kuat dan mudah berikatan: dengan oksigen membentuk air (H2O), dengan karbon membentuk senyawa organik, dan dengan logam membentuk hidrida. Sifat uniknya, hidrogen dapat lolos menembus celah sangat kecil, sehingga penyimpanannya butuh wadah khusus.$$)),
(gen_random_uuid(), 'e6060603-6060-4606-8606-606060606063', 'HEADING', 4, jsonb_build_object('text', $$Hidrogen di Alam Semesta$$)),
(gen_random_uuid(), 'e6060603-6060-4606-8606-606060606063', 'PARAGRAPH', 5, jsonb_build_object('text', $$Sekitar 75 persen massa materi normal di alam semesta adalah hidrogen. Bintang — termasuk Matahari — adalah bola gas hidrogen raksasa yang mengubah hidrogen menjadi helium lewat fusi nuklir, melepaskan energi cahaya dan panas yang menghidupi Bumi. Di Bumi sendiri hidrogen jarang ditemukan bebas; ia terikat dalam air, gas alam, dan semua makhluk hidup — tubuh manusia dewasa mengandung sekitar 7 kilogram hidrogen, terutama dalam air dan molekul organik.$$)),
(gen_random_uuid(), 'e6060603-6060-4606-8606-606060606063', 'HEADING', 6, jsonb_build_object('text', $$Manfaat bagi Manusia$$)),
(gen_random_uuid(), 'e6060603-6060-4606-8606-606060606063', 'PARAGRAPH', 7, jsonb_build_object('text', $$Industri memakai hidrogen untuk membuat amonia (bahan pupuk), memurnikan minyak bumi, dan menghidrogenasi minyak nabati menjadi margarin. Yang paling menjanjikan adalah perannya sebagai energi bersih: sel bahan bakar (fuel cell) mengubah hidrogen dan oksigen menjadi listrik dengan produk samping hanya air — tanpa asap sama sekali. Jepang dan Korea Selatan sudah mengoperasikan bus dan mobil hidrogen, dan Indonesia meneliti potensinya sebagai bagian transisi energi.$$)),
(gen_random_uuid(), 'e6060603-6060-4606-8606-606060606063', 'HEADING', 8, jsonb_build_object('text', $$Bahaya dan Keselamatan$$)),
(gen_random_uuid(), 'e6060603-6060-4606-8606-606060606063', 'PARAGRAPH', 9, jsonb_build_object('text', $$Karena sangat mudah terbakar dan meledak dalam rentang konsentrasi lebar (4–75 persen di udara), hidrogen harus ditangani dengan protokol ketat: jauhkan dari api dan percikan, pastikan ventilasi baik karena gasnya naik dan terakumulasi di langit-langit, dan gunakan detektor kebocoran khusus. Inilah alasan balon udara modern memakai helium yang tidak mudah terbakar, bukan hidrogen. Dengan penanganan benar, hidrogen adalah unsur luar biasa — bahan bakar bintang yang suatu hari mungkin menggerakkan kendaraan kita tanpa polusi.$$));

-- --------------------------------------------------------------------------
-- 4. EXP-SEJARAH16-001 — "Reformasi 1998: Tumbangnya Orde Baru" (10 block)
-- Node: R2.D12 Sejarah & Peradaban (c8888888-8888-8888-8888-888888888888)
-- --------------------------------------------------------------------------
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_name, creator_principal_id, access_level, status, created_by, updated_by)
VALUES (
  'e6060604-6060-4606-8606-606060606064',
  'EXP-SEJARAH16-001',
  'c8888888-8888-8888-8888-888888888888',
  'Reformasi 1998: Tumbangnya Orde Baru',
  'reformasi-1998-tumbangnya-orde-baru',
  'Kronologi Reformasi 1998: dari krisis moneter hingga mundurnya Soeharto pada 21 Mei 1998 dan lahirnya era demokrasi Indonesia.',
  'id', 6, 'Madevi', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'MEMBER', 'DRAFT',
  'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a'
) ON CONFLICT (business_code) DO NOTHING;

DELETE FROM madevi.article_blocks WHERE article_id = 'e6060604-6060-4606-8606-606060606064';

INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
(gen_random_uuid(), 'e6060604-6060-4606-8606-606060606064', 'HEADING', 0, jsonb_build_object('text', $$Akhir Sebuah Era$$)),
(gen_random_uuid(), 'e6060604-6060-4606-8606-606060606064', 'PARAGRAPH', 1, jsonb_build_object('text', $$Pada 21 Mei 1998, Presiden Soeharto mengumumkan pengunduran dirinya setelah 32 tahun berkuasa. Peristiwa ini menutup babak Orde Baru dan membuka Era Reformasi — masa transisi Indonesia menuju demokrasi. Reformasi lahir dari gabungan krisis ekonomi parah, tuntutan politik yang lama terpendam, dan gerakan mahasiswa yang berani turun ke jalan.$$)),
(gen_random_uuid(), 'e6060604-6060-4606-8606-606060606064', 'HEADING', 2, jsonb_build_object('text', $$Latar Belakang: Krisis Moneter 1997$$)),
(gen_random_uuid(), 'e6060604-6060-4606-8606-606060606064', 'PARAGRAPH', 3, jsonb_build_object('text', $$Krisis finansial Asia yang bermula di Thailand pada Juli 1997 menghantam Indonesia paling keras. Nilai tukar rupiah anjlok dari sekitar Rp2.400 menjadi lebih dari Rp14.000 per dolar AS. Harga kebutuhan pokok melambung, puluhan bank dilikuidasi, pengangguran melonjak, dan kemiskinan meluas. Krisis ekonomi ini meruntuhkan legitimasi pemerintah yang selama ini bersandar pada klaim keberhasilan pembangunan. Ketika perut lapar, kesabaran politik rakyat pun habis.$$)),
(gen_random_uuid(), 'e6060604-6060-4606-8606-606060606064', 'HEADING', 4, jsonb_build_object('text', $$Gelombang Demonstrasi Mahasiswa$$)),
(gen_random_uuid(), 'e6060604-6060-4606-8606-606060606064', 'PARAGRAPH', 5, jsonb_build_object('text', $$Sejak awal 1998 mahasiswa di berbagai kota menggelar aksi menuntut reformasi total: pemberantasan korupsi, kolusi, dan nepotisme (KKN), pencabutan dwifungsi ABRI, penegakan supremasi hukum, dan suksesi kepemimpinan nasional. Kampus-kampus menjadi pusat perlawanan damai. Tuntutan mereka sederhana namun fundamental: Soeharto mundur. Gerakan ini mendapat simpati luas dari masyarakat, akademisi, hingga sebagian elite politik.$$)),
(gen_random_uuid(), 'e6060604-6060-4606-8606-606060606064', 'HEADING', 6, jsonb_build_object('text', $$Tragedi Trisakti dan Kerusuhan Mei$$)),
(gen_random_uuid(), 'e6060604-6060-4606-8606-606060606064', 'PARAGRAPH', 7, jsonb_build_object('text', $$Pada 12 Mei 1998, empat mahasiswa Universitas Trisakti — Elang Mulia Lesmana, Heri Hertanto, Hafidin Royan, dan Hendriawan Sie — tewas tertembak dalam aksi damai. Kematian mereka memicu kemarahan nasional. Sejak 13 Mei, kerusuhan besar melanda Jakarta dan beberapa kota: penjarahan, pembakaran, dan kekerasan yang menelan ratusan korban jiwa. Peristiwa ini menjadi titik balik: dukungan terhadap Soeharto runtuh bahkan di kalangan pendukungnya sendiri, termasuk para menteri dan pimpinan DPR/MPR.$$)),
(gen_random_uuid(), 'e6060604-6060-4606-8606-606060606064', 'HEADING', 8, jsonb_build_object('text', $$21 Mei 1998: Soeharto Mundur$$)),
(gen_random_uuid(), 'e6060604-6060-4606-8606-606060606064', 'PARAGRAPH', 9, jsonb_build_object('text', $$Ditinggal para pembantunya dan didesak pimpinan lembaga negara, Soeharto menyatakan berhenti sebagai presiden pada pagi 21 Mei 1998 di Istana Merdeka. Wakil Presiden B.J. Habibie langsung dilantik sebagai presiden. Indonesia memasuki masa transisi: kebebasan pers dibuka, tahanan politik dibebaskan, pemilu multipartai disiapkan, dan amandemen UUD 1945 dimulai. Reformasi mengajarkan pelajaran abadi: kekuasaan yang terlalu lama tanpa kontrol akan rapuh ketika krisis datang, dan perubahan damai selalu lebih baik daripada perubahan yang dibayar dengan darah.$$));

-- --------------------------------------------------------------------------
-- 5. SCH-SMA-BIO4-001 — "Biologi Kelas 10: Sel" (12 block)
-- Node: R3.D16 SMA (d5555555-5555-5555-5555-555555555555)
-- --------------------------------------------------------------------------
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_name, creator_principal_id, access_level, status, created_by, updated_by)
VALUES (
  'e6060605-6060-4606-8606-606060606065',
  'SCH-SMA-BIO4-001',
  'd5555555-5555-5555-5555-555555555555',
  'Biologi Kelas 10: Sel',
  'biologi-kelas-10-sel',
  'Materi Biologi kelas 10: pengertian sel, struktur dan organel sel, perbedaan sel hewan dan tumbuhan, plus latihan dan kunci jawaban.',
  'id', 7, 'Madevi', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'MEMBER', 'DRAFT',
  'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a'
) ON CONFLICT (business_code) DO NOTHING;

DELETE FROM madevi.article_blocks WHERE article_id = 'e6060605-6060-4606-8606-606060606065';

INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
(gen_random_uuid(), 'e6060605-6060-4606-8606-606060606065', 'HEADING', 0, jsonb_build_object('text', $$Tujuan Pembelajaran$$)),
(gen_random_uuid(), 'e6060605-6060-4606-8606-606060606065', 'LIST', 1, jsonb_build_object('items', $$["Menjelaskan pengertian sel sebagai unit terkecil kehidupan", "Mengidentifikasi struktur dan fungsi organel-organel sel", "Membedakan sel hewan dan sel tumbuhan", "Menjelaskan hubungan struktur sel dengan fungsinya"]$$)),
(gen_random_uuid(), 'e6060605-6060-4606-8606-606060606065', 'HEADING', 2, jsonb_build_object('text', $$Pengertian Sel$$)),
(gen_random_uuid(), 'e6060605-6060-4606-8606-606060606065', 'PARAGRAPH', 3, jsonb_build_object('text', $$Sel adalah unit struktural dan fungsional terkecil penyusun makhluk hidup. Istilah sel pertama kali dipakai Robert Hooke (1665) yang melihat ruang-ruang kecil pada gabus seperti sel penjara. Teori sel menyatakan: semua makhluk hidup tersusun dari sel, sel adalah unit dasar kehidupan, dan semua sel berasal dari sel sebelumnya (omnis cellula e cellula — Rudolf Virchow). Makhluk hidup ada yang uniseluler (satu sel, misalnya bakteri dan Amoeba) dan multiseluler (banyak sel, misalnya manusia yang tersusun dari sekitar 30 triliun sel).$$)),
(gen_random_uuid(), 'e6060605-6060-4606-8606-606060606065', 'HEADING', 4, jsonb_build_object('text', $$Struktur dan Organel Sel$$)),
(gen_random_uuid(), 'e6060605-6060-4606-8606-606060606065', 'PARAGRAPH', 5, jsonb_build_object('text', $$Sel eukariotik (sel hewan dan tumbuhan) memiliki organel dengan tugas masing-masing. Membran sel adalah lapisan selektif yang mengatur keluar-masuk zat. Nukleus (inti sel) menyimpan DNA dan mengendalikan seluruh aktivitas sel; di dalamnya ada nukleolus pembuat ribosom. Sitoplasma adalah cairan tempat organel melayang. Mitokondria menghasilkan energi (ATP) lewat respirasi sel — disebut pembangkit tenaga sel. Ribosom merakit protein. Retikulum endoplasma (kasar dan halus) menyalurkan dan memodifikasi protein serta lipid. Badan Golgi mengemas dan mengirim protein. Lisosom mencerna sisa dan benda asing dengan enzim. Vakuola menyimpan cadangan; pada tumbuhan vakuolanya besar. Kloroplas hanya ada pada tumbuhan — tempat fotosintesis. Dinding sel (tumbuhan) memberi bentuk kaku dari selulosa.$$)),
(gen_random_uuid(), 'e6060605-6060-4606-8606-606060606065', 'HEADING', 6, jsonb_build_object('text', $$Sel Hewan vs Sel Tumbuhan$$)),
(gen_random_uuid(), 'e6060605-6060-4606-8606-606060606065', 'PARAGRAPH', 7, jsonb_build_object('text', $$Keduanya sel eukariotik, tetapi berbeda pada beberapa bagian. Sel tumbuhan memiliki dinding sel, kloroplas, dan vakuola besar di tengah; bentuknya cenderung tetap/kotak. Sel hewan tidak punya ketiganya — vakuolanya kecil — tetapi memiliki sentriol yang berperan dalam pembelahan sel; bentuknya lebih lentur dan beragam. Persamaannya: sama-sama punya membran sel, nukleus, mitokondria, ribosom, RE, dan badan Golgi. Cara mengingatnya: yang berfotosintesis (tumbuhan) butuh kloroplas; yang butuh kekakuan (tumbuhan) punya dinding sel.$$)),
(gen_random_uuid(), 'e6060605-6060-4606-8606-606060606065', 'HEADING', 8, jsonb_build_object('text', $$Contoh dalam Kehidupan$$)),
(gen_random_uuid(), 'e6060605-6060-4606-8606-606060606065', 'PARAGRAPH', 9, jsonb_build_object('text', $$Saat mengamati irisan bawang merah di bawah mikroskop, kamu melihat sel tumbuhan berbentuk kotak tersusun rapi dengan dinding sel jelas. Sel darah merah manusia berbentuk cakram cekung tanpa nukleus — adaptasi agar bisa membawa oksigen maksimal. Sel otot memanjang dan penuh mitokondria karena butuh banyak energi untuk berkontraksi. Setiap bentuk sel adalah jawaban evolusi atas pekerjaannya: struktur selalu melayani fungsi.$$)),
(gen_random_uuid(), 'e6060605-6060-4606-8606-606060606065', 'HEADING', 10, jsonb_build_object('text', $$Latihan$$)),
(gen_random_uuid(), 'e6060605-6060-4606-8606-606060606065', 'LIST', 11, jsonb_build_object('items', $$["Soal 1: Sebutkan 3 organel sel beserta fungsinya masing-masing! Kunci: Mitokondria — menghasilkan energi/ATP; Ribosom — merakit protein; Nukleus — menyimpan DNA dan mengendalikan aktivitas sel (jawaban lain yang benar juga diterima).", "Soal 2: Jelaskan 3 perbedaan sel hewan dan sel tumbuhan! Kunci: (1) Tumbuhan punya dinding sel, hewan tidak; (2) Tumbuhan punya kloroplas, hewan tidak; (3) Vakuola tumbuhan besar di tengah, hewan kecil.", "Soal 3: Mengapa sel otot mengandung banyak mitokondria? Kunci: Karena kontraksi otot membutuhkan energi (ATP) yang besar, dan mitokondria adalah organel penghasil energi."]$$));

-- --------------------------------------------------------------------------
-- 6. SCH-SD-IPS11-001 — "IPS Kelas 3: Pekerjaan" (12 block)
-- Node: R3.D14 SD (d3333333-3333-3333-3333-333333333333)
-- --------------------------------------------------------------------------
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_name, creator_principal_id, access_level, status, created_by, updated_by)
VALUES (
  'e6060606-6060-4606-8606-606060606066',
  'SCH-SD-IPS11-001',
  'd3333333-3333-3333-3333-333333333333',
  'IPS Kelas 3: Pekerjaan',
  'ips-kelas-3-pekerjaan',
  'Materi IPS kelas 3 SD: mengenal jenis-jenis pekerjaan di sekitar kita, menghargai setiap pekerjaan, plus latihan dan kunci jawaban.',
  'id', 5, 'Madevi', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'MEMBER', 'DRAFT',
  'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a'
) ON CONFLICT (business_code) DO NOTHING;

DELETE FROM madevi.article_blocks WHERE article_id = 'e6060606-6060-4606-8606-606060606066';

INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
(gen_random_uuid(), 'e6060606-6060-4606-8606-606060606066', 'HEADING', 0, jsonb_build_object('text', $$Tujuan Pembelajaran$$)),
(gen_random_uuid(), 'e6060606-6060-4606-8606-606060606066', 'LIST', 1, jsonb_build_object('items', $$["Menjelaskan pengertian pekerjaan", "Menyebutkan jenis-jenis pekerjaan di lingkungan sekitar", "Menghargai setiap jenis pekerjaan", "Menyebutkan cita-cita pekerjaan di masa depan"]$$)),
(gen_random_uuid(), 'e6060606-6060-4606-8606-606060606066', 'HEADING', 2, jsonb_build_object('text', $$Apa Itu Pekerjaan?$$)),
(gen_random_uuid(), 'e6060606-6060-4606-8606-606060606066', 'PARAGRAPH', 3, jsonb_build_object('text', $$Pekerjaan adalah kegiatan yang dilakukan seseorang untuk mendapatkan penghasilan guna memenuhi kebutuhan hidup. Ayah dan ibumu bekerja agar keluarga bisa makan, punya rumah, dan kamu bisa sekolah. Orang bekerja dengan cara berbeda-beda: ada yang bekerja dengan tenaga, ada yang bekerja dengan pikiran, dan ada yang menggabungkan keduanya. Semua pekerjaan itu penting, karena setiap pekerjaan membantu orang lain.$$)),
(gen_random_uuid(), 'e6060606-6060-4606-8606-606060606066', 'HEADING', 4, jsonb_build_object('text', $$Jenis-jenis Pekerjaan$$)),
(gen_random_uuid(), 'e6060606-6060-4606-8606-606060606066', 'LIST', 5, jsonb_build_object('items', $$["Petani: menanam padi, sayur, dan buah di sawah atau ladang — tanpa petani kita tidak punya beras", "Nelayan: menangkap ikan di laut, sungai, atau danau", "Guru: mengajar anak-anak di sekolah agar pintar", "Dokter dan perawat: merawat orang yang sakit di rumah sakit atau puskesmas", "Pedagang: menjual barang di pasar, toko, atau warung", "Tukang: membangun rumah (tukang bangunan), memperbaiki kendaraan (montir), menjahit pakaian (penjahit)", "Sopir: mengantar orang dengan bus, taksi, atau ojek", "Polisi dan tentara: menjaga keamanan negara"]$$)),
(gen_random_uuid(), 'e6060606-6060-4606-8606-606060606066', 'HEADING', 6, jsonb_build_object('text', $$Pekerjaan di Sekitar Kita$$)),
(gen_random_uuid(), 'e6060606-6060-4606-8606-606060606066', 'PARAGRAPH', 7, jsonb_build_object('text', $$Coba perhatikan saat berangkat ke sekolah. Di jalan kamu bertemu pedagang sarapan, tukang ojek, petugas kebersihan yang menyapu jalan, dan satpam sekolah. Di sekolah ada guru, kepala sekolah, dan penjaga kantin. Di rumah sakit ada dokter dan perawat. Semua orang bekerja dan saling membutuhkan: petani butuh pembeli, pembeli butuh petani. Inilah yang disebut kerja sama dalam masyarakat — tidak ada pekerjaan yang bisa berdiri sendiri.$$)),
(gen_random_uuid(), 'e6060606-6060-4606-8606-606060606066', 'HEADING', 8, jsonb_build_object('text', $$Menghargai Setiap Pekerjaan$$)),
(gen_random_uuid(), 'e6060606-6060-4606-8606-606060606066', 'PARAGRAPH', 9, jsonb_build_object('text', $$Tidak ada pekerjaan yang hina. Tukang sampah yang membersihkan lingkungan sama mulianya dengan dokter yang menyembuhkan pasien — keduanya membuat hidup kita lebih baik. Cara menghargai pekerjaan orang lain: bersikap sopan, tidak meremehkan, mengucapkan terima kasih, dan tidak membuang sampah sembarangan agar pekerjaan petugas kebersihan lebih ringan. Kelak saat besar, pilihlah pekerjaan yang kamu sukai dan bermanfaat bagi banyak orang — itulah cita-cita.$$)),
(gen_random_uuid(), 'e6060606-6060-4606-8606-606060606066', 'HEADING', 10, jsonb_build_object('text', $$Latihan$$)),
(gen_random_uuid(), 'e6060606-6060-4606-8606-606060606066', 'LIST', 11, jsonb_build_object('items', $$["Soal 1: Sebutkan 4 jenis pekerjaan beserta tugasnya! Kunci: Guru — mengajar; Dokter — merawat orang sakit; Petani — menanam padi/sayur; Pedagang — menjual barang (jawaban lain yang benar diterima).", "Soal 2: Mengapa kita harus menghargai petugas kebersihan? Kunci: Karena mereka menjaga lingkungan tetap bersih dan sehat; tanpa mereka sampah menumpuk dan menimbulkan penyakit.", "Soal 3: Apa cita-citamu? Jelaskan mengapa kamu memilihnya! Kunci: Jawaban bebas sesuai cita-cita masing-masing, misalnya ingin menjadi guru agar bisa mengajar anak-anak menjadi pintar."]$$));

COMMIT;
