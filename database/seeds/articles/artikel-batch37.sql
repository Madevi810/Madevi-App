-- Artikel konten Madevi batch 37 — 2026-10-13
-- Owner principal: f7125028-187e-44e0-b95b-88b69b8d5c9a

-- ============ 1. TUT-ELEKTRONIK3-001 ============
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, status, created_by, updated_by)
VALUES ('e3700001-0000-4000-8000-000000000001', 'TUT-ELEKTRONIK3-001', 'b4444444-4444-4444-4444-444444444444',
'Multimeter: Cara Mengukur Listrik',
'multimeter-cara-mengukur-listrik',
'Panduan memakai multimeter digital dengan aman: mengukur tegangan baterai, resistansi resistor, dan mengecek kabel putus tanpa tersengat listrik.',
'id', 7, 'DRAFT', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (id) DO NOTHING;

INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
(gen_random_uuid(), 'e3700001-0000-4000-8000-000000000001', 'HEADING', 1, jsonb_build_object('text', $$Masalah: Takut Mengukur Listrik Sendiri$$)),
(gen_random_uuid(), 'e3700001-0000-4000-8000-000000000001', 'PARAGRAPH', 2, jsonb_build_object('text', $$Baterai remote habis, lampu tidak menyala, atau kabel dicurigai putus — semua bisa dicek dalam hitungan detik dengan multimeter. Masalahnya, banyak orang takut memegang alat ukur listrik karena khawatir tersengat. Padahal multimeter justru alat yang membuatmu AMAN: ia memberitahu ada tidaknya tegangan sebelum kamu menyentuh apa pun.$$)),
(gen_random_uuid(), 'e3700001-0000-4000-8000-000000000001', 'HEADING', 3, jsonb_build_object('text', $$Penjelasan: Apa Itu Multimeter$$)),
(gen_random_uuid(), 'e3700001-0000-4000-8000-000000000001', 'PARAGRAPH', 4, jsonb_build_object('text', $$Multimeter digital mengukur tiga besaran utama: tegangan (volt, V), arus (ampere, A), dan resistansi (ohm, Ω). Ia punya dua probe: hitam (negatif/COM) dan merah (positif). Kenop putar memilih mode pengukuran. Versi digital menampilkan angka di layar sehingga mudah dibaca pemula; versi analog memakai jarum dan butuh latihan membaca skala.$$)),
(gen_random_uuid(), 'e3700001-0000-4000-8000-000000000001', 'HEADING', 5, jsonb_build_object('text', $$Alat yang Dibutuhkan$$)),
(gen_random_uuid(), 'e3700001-0000-4000-8000-000000000001', 'LIST', 6, jsonb_build_object('items', ARRAY[$$Multimeter digital (harga mulai Rp50 ribuan sudah cukup untuk pemula)$$, $$Probe merah dan hitam bawaan alat$$, $$Baterai 9V atau AA sebagai bahan latihan$$, $$Resistor bekas atau lampu kecil untuk latihan ukur resistansi$$, $$Tangan kering dan area kerja yang terang$$])),
(gen_random_uuid(), 'e3700001-0000-4000-8000-000000000001', 'HEADING', 7, jsonb_build_object('text', $$Langkah Mengukur$$)),
(gen_random_uuid(), 'e3700001-0000-4000-8000-000000000001', 'LIST', 8, jsonb_build_object('items', ARRAY[$$1. Colok probe hitam ke port COM, probe merah ke port VΩmA$$, $$2. Putar kenop ke mode tegangan DC (simbol V dengan garis lurus) pada rentang 20V$$, $$3. Tempel probe merah ke kutub positif baterai, hitam ke negatif — layar harus menunjukkan sekitar 9V atau 1,5V$$, $$4. Untuk mengukur resistor: putar ke mode ohm (simbol Ω), tempel kedua probe ke kedua kaki resistor$$, $$5. Untuk mengecek kabel putus: putar ke mode continuity (simbol bunyi), tempel ke dua ujung kabel — bunyi beep berarti kabel tersambung$$, $$6. Setelah selesai, kembalikan kenop ke posisi OFF$$])),
(gen_random_uuid(), 'e3700001-0000-4000-8000-000000000001', 'HEADING', 9, jsonb_build_object('text', $$Risiko$$)),
(gen_random_uuid(), 'e3700001-0000-4000-8000-000000000001', 'PARAGRAPH', 10, jsonb_build_object('text', $$JANGAN pernah memakai mode ampere (A) untuk mengukur stopkontak — mode arus punya resistansi hampir nol dan akan menyebabkan hubung singkat plus percikan. Jangan mengukur tegangan AC 220V bila belum yakin caranya; minta dampingan teknisi. Pegang probe pada bagian gagangnya yang berisolasi, bukan ujung logamnya. Pastikan tangan kering.$$)),
(gen_random_uuid(), 'e3700001-0000-4000-8000-000000000001', 'HEADING', 11, jsonb_build_object('text', $$Penyelesaian$$)),
(gen_random_uuid(), 'e3700001-0000-4000-8000-000000000001', 'PARAGRAPH', 12, jsonb_build_object('text', $$Latihan rutin: cek semua baterai di rumah setiap 3 bulan, buang yang tegangannya turun jauh di bawah nominal. Mode continuity sangat berguna untuk mencari kabel yang putus di dalam tanpa mengupasnya. Setelah mahir mengukur baterai dan resistor, kamu siap belajar mengukur tegangan adaptor charger dan aki motor — tetap dengan pendampingan bila menyentuh instalasi rumah 220V.$$))
ON CONFLICT (id) DO NOTHING;

-- ============ 2. TUT-MASAK5-001 ============
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, status, created_by, updated_by)
VALUES ('e3700002-0000-4000-8000-000000000002', 'TUT-MASAK5-001', 'b7777777-7777-7777-7777-777777777777',
'Nasi Goreng Spesial: Resep Warteg',
'nasi-goreng-spesial-resep-warteg',
'Resep nasi goreng ala warteg yang gurih dan tidak lembek: rahasia nasi dingin, api besar, bumbu halus, dan urutan memasak yang benar.',
'id', 8, 'DRAFT', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (id) DO NOTHING;

INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
(gen_random_uuid(), 'e3700002-0000-4000-8000-000000000002', 'HEADING', 1, jsonb_build_object('text', $$Masalah: Nasi Goreng Bikin Sendiri Selalu Lembek$$)),
(gen_random_uuid(), 'e3700002-0000-4000-8000-000000000002', 'PARAGRAPH', 2, jsonb_build_object('text', $$Nasi goreng buatan sendiri sering berakhir lembek, menggumpal, dan rasanya hambar — jauh dari nasi goreng warteg yang gurih, butirannya terpisah, dan beraroma smoky. Penyebab utamanya bukan bumbu, melainkan nasi yang dipakai dan teknik memasak yang salah.$$)),
(gen_random_uuid(), 'e3700002-0000-4000-8000-000000000002', 'HEADING', 3, jsonb_build_object('text', $$Penjelasan: Rahasia Nasi Goreng Warteg$$)),
(gen_random_uuid(), 'e3700002-0000-4000-8000-000000000002', 'PARAGRAPH', 4, jsonb_build_object('text', $$Tiga rahasia utama: pertama, pakai nasi SISA semalam yang disimpan di kulkas — nasi dingin lebih kering sehingga tidak lengket. Kedua, api BESAR dan wajan benar-benar panas sebelum nasi masuk, menciptakan aroma gosong khas (wok hei). Ketiga, bumbu diulek halus dan ditumis sampai matang sebelum nasi masuk, bukan dicampur mentah.$$)),
(gen_random_uuid(), 'e3700002-0000-4000-8000-000000000002', 'HEADING', 5, jsonb_build_object('text', $$Bahan dan Alat$$)),
(gen_random_uuid(), 'e3700002-0000-4000-8000-000000000002', 'LIST', 6, jsonb_build_object('items', ARRAY[$$2 piring nasi sisa semalam (dingin dari kulkas)$$, $$3 siung bawang putih + 4 butir bawang merah, diulek halus$$, $$2 butir telur$$, $$2 sdm kecap manis$$, $$1 sdt garam, 1/2 sdt merica, penyedap secukupnya$$, $$Ayam suwir, sosis, atau bakso sebagai topping$$, $$Minyak goreng dan wajan cekung (lebih baik dari teflon datar)$$])),
(gen_random_uuid(), 'e3700002-0000-4000-8000-000000000002', 'HEADING', 7, jsonb_build_object('text', $$Langkah Memasak$$)),
(gen_random_uuid(), 'e3700002-0000-4000-8000-000000000002', 'LIST', 8, jsonb_build_object('items', ARRAY[$$1. Panaskan wajan dengan api besar sampai benar-benar panas, tuang 2 sdm minyak$$, $$2. Tumis bumbu halus sampai harum dan berubah warna keemasan (sekitar 1 menit)$$, $$3. Masukkan telur, orak-arik cepat sampai setengah matang$$, $$4. Masukkan nasi dingin, tekan-tekan gumpalan dengan sodet sampai terurai$$, $$5. Tambahkan kecap manis, garam, merica — aduk cepat 2–3 menit sampai semua tercampur rata$$, $$6. Masukkan topping (ayam/sosis), aduk 1 menit lagi, angkat dan sajikan panas$$])),
(gen_random_uuid(), 'e3700002-0000-4000-8000-000000000002', 'HEADING', 9, jsonb_build_object('text', $$Risiko$$)),
(gen_random_uuid(), 'e3700002-0000-4000-8000-000000000002', 'PARAGRAPH', 10, jsonb_build_object('text', $$Api besar plus minyak panas bisa menciprat — jauhkan wajah dan pakai sodet bergagang panjang. Jangan memakai nasi yang baru matang dan masih panas karena pasti lembek. Nasi sisa jangan disimpan lebih dari 2 hari di kulkas; nasi basi berisiko keracunan. Penyedap dan kecap dipakai secukupnya, jangan berlebihan.$$)),
(gen_random_uuid(), 'e3700002-0000-4000-8000-000000000002', 'HEADING', 11, jsonb_build_object('text', $$Penyelesaian$$)),
(gen_random_uuid(), 'e3700002-0000-4000-8000-000000000002', 'PARAGRAPH', 12, jsonb_build_object('text', $$Sajikan dengan kerupuk, acar timun, dan irisan tomat seperti di warteg. Variasikan dengan nasi goreng kambing (tambah daging kambing dan minyak samin), nasi goreng mawut (campur mi), atau nasi goreng teri Medan. Setelah menguasai teknik dasar ini, semua varian nasi goreng tinggal mengganti topping dan bumbunya.$$))
ON CONFLICT (id) DO NOTHING;

-- ============ 3. EXP-BIOLOGI5-001 ============
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, status, created_by, updated_by)
VALUES ('e3700003-0000-4000-8000-000000000003', 'EXP-BIOLOGI5-001', 'c2222222-2222-2222-2222-222222222222',
'Jamur: Bukan Tumbuhan, Bukan Hewan',
'jamur-bukan-tumbuhan-bukan-hewan',
'Jamur punya kingdom sendiri dalam klasifikasi makhluk hidup: mengenal hifa, miselium, cara jamur makan, jamur yang bisa dimakan, dan yang beracun.',
'id', 6, 'DRAFT', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (id) DO NOTHING;

INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
(gen_random_uuid(), 'e3700003-0000-4000-8000-000000000003', 'HEADING', 1, jsonb_build_object('text', $$Bukan Tumbuhan, Bukan Hewan$$)),
(gen_random_uuid(), 'e3700003-0000-4000-8000-000000000003', 'PARAGRAPH', 2, jsonb_build_object('text', $$Jamur sering dikira tumbuhan karena tumbuh di tanah dan tidak bergerak. Padahal jamur tidak berfotosintesis dan dinding selnya terbuat dari kitin — zat yang sama dengan cangkang serangga, bukan selulosa seperti tumbuhan. Karena keunikannya, ilmuwan menempatkan jamur di kingdom tersendiri: Fungi, sejajar dengan Animalia dan Plantae.$$)),
(gen_random_uuid(), 'e3700003-0000-4000-8000-000000000003', 'HEADING', 3, jsonb_build_object('text', $$Hifa dan Miselium: Tubuh Jamur yang Sebenarnya$$)),
(gen_random_uuid(), 'e3700003-0000-4000-8000-000000000003', 'PARAGRAPH', 4, jsonb_build_object('text', $$Bagian jamur yang kita lihat — payung dan tangkainya — hanyalah organ reproduksi yang disebut tubuh buah. Tubuh jamur yang sebenarnya adalah jaringan benang halus bernama hifa yang menjalar di dalam tanah atau kayu, berkumpul menjadi miselium. Satu individu jamur bisa memiliki miselium seluas ratusan meter persegi; jamur madu (Armillaria) di Amerika bahkan tercatat sebagai salah satu organisme terbesar di dunia.$$)),
(gen_random_uuid(), 'e3700003-0000-4000-8000-000000000003', 'HEADING', 5, jsonb_build_object('text', $$Cara Jamur Makan: Pengurai Ulung$$)),
(gen_random_uuid(), 'e3700003-0000-4000-8000-000000000003', 'PARAGRAPH', 6, jsonb_build_object('text', $$Jamur tidak bisa membuat makanan sendiri dan tidak punya mulut. Ia mengeluarkan enzim pencernaan ke lingkungannya, menguraikan kayu lapuk, daun gugur, atau sisa organisme menjadi molekul sederhana, lalu menyerapnya. Peran sebagai pengurai (dekomposer) membuat jamur sangat penting: tanpa jamur, hutan akan tertimbun tumpukan kayu mati dan nutrisi tidak kembali ke tanah.$$)),
(gen_random_uuid(), 'e3700003-0000-4000-8000-000000000003', 'HEADING', 7, jsonb_build_object('text', $$Jamur yang Kita Makan$$)),
(gen_random_uuid(), 'e3700003-0000-4000-8000-000000000003', 'PARAGRAPH', 8, jsonb_build_object('text', $$Jamur tiram, jamur merang, jamur kuping, dan jamur kancing adalah sumber protein nabati yang populer. Ragi (yeast) — jamur bersel satu — membuat roti mengembang dan mengubah gula menjadi alkohol dalam pembuatan tape. Kapang Rhizopus mengubah kedelai menjadi tempe lewat fermentasi. Bahkan antibiotik penisilin pertama kali ditemukan dari kapang Penicillium.$$)),
(gen_random_uuid(), 'e3700003-0000-4000-8000-000000000003', 'HEADING', 9, jsonb_build_object('text', $$Jamur Beracun: Jangan Asal Petik$$)),
(gen_random_uuid(), 'e3700003-0000-4000-8000-000000000003', 'PARAGRAPH', 10, jsonb_build_object('text', $$Tidak semua jamur aman dimakan. Jamur Amanita phalloides (death cap) mirip jamur yang bisa dimakan tetapi racunnya dapat merusak hati hingga fatal, dan racunnya tidak hilang walau dimasak. Aturan praktisnya: jangan pernah memakan jamur liar kecuali diidentifikasi oleh ahli. Jamur yang dijual di pasar dan supermarket sudah melalui budidaya yang aman.$$))
ON CONFLICT (id) DO NOTHING;

-- ============ 4. EXP-FISIKA7-001 ============
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, status, created_by, updated_by)
VALUES ('e3700004-0000-4000-8000-000000000004', 'EXP-FISIKA7-001', 'c3333333-3333-3333-3333-333333333333',
'Magnet: Gaya Tak Terlihat',
'magnet-gaya-tak-terlihat',
'Mengenal magnet: kutub utara-selatan, medan magnet Bumi, kompas, elektromagnet, dan peran magnet dalam teknologi sehari-hari.',
'id', 6, 'DRAFT', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (id) DO NOTHING;

INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
(gen_random_uuid(), 'e3700004-0000-4000-8000-000000000004', 'HEADING', 1, jsonb_build_object('text', $$Gaya yang Tak Terlihat$$)),
(gen_random_uuid(), 'e3700004-0000-4000-8000-000000000004', 'PARAGRAPH', 2, jsonb_build_object('text', $$Dekatkan magnet ke paku besi: paku melompat menempel tanpa disentuh. Magnet menghasilkan gaya yang bekerja dari jarak jauh — fenomena yang sudah dikenal sejak zaman Yunani kuno ketika batu magnet (magnetit) ditemukan di wilayah Magnesia. Gaya magnet hanya bekerja pada bahan tertentu, terutama besi, nikel, dan kobalt.$$)),
(gen_random_uuid(), 'e3700004-0000-4000-8000-000000000004', 'HEADING', 3, jsonb_build_object('text', $$Kutub Utara dan Kutub Selatan$$)),
(gen_random_uuid(), 'e3700004-0000-4000-8000-000000000004', 'PARAGRAPH', 4, jsonb_build_object('text', $$Setiap magnet selalu punya dua kutub: utara dan selatan. Kutub senama saling tolak-menolak, kutub berbeda saling tarik-menarik. Keunikan magnet: bila dipotong menjadi dua, setiap potongan justru menjadi magnet baru yang lengkap dengan dua kutubnya. Para fisikawan belum pernah menemukan kutub magnet tunggal (monopole magnetik) di alam.$$)),
(gen_random_uuid(), 'e3700004-0000-4000-8000-000000000004', 'HEADING', 5, jsonb_build_object('text', $$Medan Magnet Bumi$$)),
(gen_random_uuid(), 'e3700004-0000-4000-8000-000000000004', 'PARAGRAPH', 6, jsonb_build_object('text', $$Bumi sendiri adalah magnet raksasa. Inti besi cair yang berputar menghasilkan medan magnet yang melindungi kita dari angin matahari — partikel bermuatan dari Matahari yang dibelokkan medan magnet, lalu bertabrakan dengan atmosfer dan menciptakan aurora di kutub. Jarum kompas selalu menunjuk utara karena ia magnet kecil yang sejajar dengan medan magnet Bumi.$$)),
(gen_random_uuid(), 'e3700004-0000-4000-8000-000000000004', 'HEADING', 7, jsonb_build_object('text', $$Elektromagnet: Magnet yang Bisa Dimatikan$$)),
(gen_random_uuid(), 'e3700004-0000-4000-8000-000000000004', 'PARAGRAPH', 8, jsonb_build_object('text', $$Aliran listrik yang melewati kumparan kawat menghasilkan medan magnet — inilah elektromagnet. Kelebihannya: kekuatannya bisa diatur dan dimatikan dengan memutus arus. Prinsip ini dipakai di motor listrik (magnet berputar karena medan berubah), bel listrik, dan derek magnet raksasa di tempat rongsokan yang mengangkat mobil hanya dengan menyalakan arus.$$)),
(gen_random_uuid(), 'e3700004-0000-4000-8000-000000000004', 'HEADING', 9, jsonb_build_object('text', $$Magnet dalam Kehidupan Sehari-hari$$)),
(gen_random_uuid(), 'e3700004-0000-4000-8000-000000000004', 'PARAGRAPH', 10, jsonb_build_object('text', $$Magnet ada di mana-mana: speaker mengubah sinyal listrik menjadi suara lewat magnet, pintu kulkas menutup rapat karena magnet, kartu ATM menyimpan data pada strip magnetik, dan mesin MRI di rumah sakit memakai magnet super kuat untuk memotret organ tubuh. Dari mainan anak hingga teknologi medis, gaya tak terlihat ini menopang peradaban modern.$$))
ON CONFLICT (id) DO NOTHING;

-- ============ 5. SCH-SMP-SEJ3-001 ============
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, status, created_by, updated_by)
VALUES ('e3700005-0000-4000-8000-000000000005', 'SCH-SMP-SEJ3-001', 'd4444444-4444-4444-4444-444444444444',
'IPS Kelas 7: Peta ASEAN',
'ips-kelas-7-peta-asean',
'Materi IPS kelas 7: mengenal peta ASEAN, 10 negara anggota, cara membaca simbol dan skala peta, serta letak geografis Asia Tenggara.',
'id', 8, 'DRAFT', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (id) DO NOTHING;

INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
(gen_random_uuid(), 'e3700005-0000-4000-8000-000000000005', 'HEADING', 1, jsonb_build_object('text', $$Tujuan Pembelajaran$$)),
(gen_random_uuid(), 'e3700005-0000-4000-8000-000000000005', 'PARAGRAPH', 2, jsonb_build_object('text', $$Setelah mempelajari materi ini, kamu diharapkan mampu: (1) menyebutkan 10 negara anggota ASEAN beserta ibu kotanya; (2) membaca simbol, warna, dan skala pada peta ASEAN; (3) menjelaskan letak geografis dan astronomis Asia Tenggara serta pengaruhnya terhadap kehidupan.$$)),
(gen_random_uuid(), 'e3700005-0000-4000-8000-000000000005', 'HEADING', 3, jsonb_build_object('text', $$Apa Itu Peta ASEAN$$)),
(gen_random_uuid(), 'e3700005-0000-4000-8000-000000000005', 'PARAGRAPH', 4, jsonb_build_object('text', $$Peta ASEAN adalah gambaran wilayah Asia Tenggara yang menunjukkan batas negara, ibu kota, bentang alam, dan perairan di sekitarnya. ASEAN (Association of Southeast Asian Nations) adalah organisasi kerja sama negara-negara Asia Tenggara yang didirikan pada 8 Agustus 1967 di Bangkok, Thailand. Indonesia adalah salah satu dari lima negara pendirinya.$$)),
(gen_random_uuid(), 'e3700005-0000-4000-8000-000000000005', 'HEADING', 5, jsonb_build_object('text', $$10 Negara Anggota ASEAN$$)),
(gen_random_uuid(), 'e3700005-0000-4000-8000-000000000005', 'LIST', 6, jsonb_build_object('items', ARRAY[$$Indonesia — ibu kota: Jakarta (Nusantara)$$, $$Malaysia — ibu kota: Kuala Lumpur$$, $$Singapura — ibu kota: Singapura$$, $$Thailand — ibu kota: Bangkok$$, $$Filipina — ibu kota: Manila$$, $$Vietnam — ibu kota: Hanoi$$, $$Myanmar — ibu kota: Naypyidaw$$, $$Laos — ibu kota: Vientiane$$, $$Kamboja — ibu kota: Phnom Penh$$, $$Brunei Darussalam — ibu kota: Bandar Seri Begawan$$])),
(gen_random_uuid(), 'e3700005-0000-4000-8000-000000000005', 'HEADING', 7, jsonb_build_object('text', $$Membaca Peta: Simbol, Warna, dan Skala$$)),
(gen_random_uuid(), 'e3700005-0000-4000-8000-000000000005', 'PARAGRAPH', 8, jsonb_build_object('text', $$Peta punya bahasa sendiri. Titik hitam biasanya menandai ibu kota, garis tegas menandai batas negara, dan warna hijau-kuning-cokelat menunjukkan ketinggian daratan (hijau = rendah, cokelat = pegunungan). Legenda di sudut peta menjelaskan arti setiap simbol. Skala — misalnya 1:10.000.000 — berarti 1 cm di peta sama dengan 100 km di dunia nyata. Dengan skala, kamu bisa memperkirakan jarak Jakarta ke Kuala Lumpur langsung dari peta.$$)),
(gen_random_uuid(), 'e3700005-0000-4000-8000-000000000005', 'HEADING', 9, jsonb_build_object('text', $$Letak Geografis dan Astronomis$$)),
(gen_random_uuid(), 'e3700005-0000-4000-8000-000000000005', 'PARAGRAPH', 10, jsonb_build_object('text', $$Secara geografis, Asia Tenggara terletak di antara dua benua (Asia dan Australia) dan dua samudra (Hindia dan Pasifik) — posisi silang yang membuatnya menjadi jalur perdagangan dunia sejak zaman dahulu. Secara astronomis, kawasan ini berada di sekitar garis khatulistiwa, sehingga beriklim tropis dengan dua musim (hujan dan kemarau) dan sinar matahari sepanjang tahun.$$)),
(gen_random_uuid(), 'e3700005-0000-4000-8000-000000000005', 'HEADING', 11, jsonb_build_object('text', $$Latihan$$)),
(gen_random_uuid(), 'e3700005-0000-4000-8000-000000000005', 'LIST', 12, jsonb_build_object('items', ARRAY[$$1. Sebutkan 5 negara pendiri ASEAN! Kunci: Indonesia, Malaysia, Singapura, Thailand, Filipina.$$ , $$2. Apa arti skala 1:5.000.000 pada peta? Kunci: 1 cm di peta = 50 km jarak sebenarnya.$$ , $$3. Mengapa letak geografis Asia Tenggara disebut strategis? Kunci: berada di persilangan jalur perdagangan antara Benua Asia–Australia dan Samudra Hindia–Pasifik.$$]))
ON CONFLICT (id) DO NOTHING;

-- ============ 6. SCH-SD-IPA5-001 ============
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, status, created_by, updated_by)
VALUES ('e3700006-0000-4000-8000-000000000006', 'SCH-SD-IPA5-001', 'd3333333-3333-3333-3333-333333333333',
'IPA Kelas 5: Organ Tubuh Manusia',
'ipa-kelas-5-organ-tubuh-manusia',
'Materi IPA kelas 5 SD: mengenal organ tubuh manusia dan fungsinya, sistem pencernaan, serta cara menjaga kesehatan organ tubuh.',
'id', 8, 'DRAFT', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (id) DO NOTHING;

INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
(gen_random_uuid(), 'e3700006-0000-4000-8000-000000000006', 'HEADING', 1, jsonb_build_object('text', $$Tujuan Pembelajaran$$)),
(gen_random_uuid(), 'e3700006-0000-4000-8000-000000000006', 'PARAGRAPH', 2, jsonb_build_object('text', $$Setelah belajar materi ini, kamu diharapkan mampu: (1) menyebutkan organ-organ penting tubuh manusia beserta fungsinya; (2) menjelaskan urutan sistem pencernaan makanan; (3) menyebutkan cara-cara menjaga kesehatan organ tubuh dalam kehidupan sehari-hari.$$)),
(gen_random_uuid(), 'e3700006-0000-4000-8000-000000000006', 'HEADING', 3, jsonb_build_object('text', $$Organ Tubuh dan Fungsinya$$)),
(gen_random_uuid(), 'e3700006-0000-4000-8000-000000000006', 'PARAGRAPH', 4, jsonb_build_object('text', $$Tubuh kita seperti mesin yang tersusun dari bagian-bagian yang bekerja sama. Setiap bagian yang punya tugas khusus disebut organ. Jantung memompa darah, paru-paru mengambil oksigen, dan lambung mencerna makanan — semuanya bekerja tanpa kita perintah, siang dan malam.$$)),
(gen_random_uuid(), 'e3700006-0000-4000-8000-000000000006', 'HEADING', 5, jsonb_build_object('text', $$Organ Dalam yang Penting$$)),
(gen_random_uuid(), 'e3700006-0000-4000-8000-000000000006', 'LIST', 6, jsonb_build_object('items', ARRAY[$$Jantung: memompa darah ke seluruh tubuh, berdenyut sekitar 100.000 kali sehari$$, $$Paru-paru: mengambil oksigen dari udara dan membuang karbon dioksida$$, $$Lambung: mencerna makanan dengan bantuan asam dan enzim$$, $$Hati: menyaring racun dari darah dan menghasilkan cairan empedu$$, $$Ginjal: menyaring darah dan membuang sisa lewat urine$$, $$Usus: menyerap sari makanan untuk diedarkan ke tubuh$$, $$Otak: pusat kendali seluruh gerak dan pikiran$$])),
(gen_random_uuid(), 'e3700006-0000-4000-8000-000000000006', 'HEADING', 7, jsonb_build_object('text', $$Sistem Pencernaan Makanan$$)),
(gen_random_uuid(), 'e3700006-0000-4000-8000-000000000006', 'PARAGRAPH', 8, jsonb_build_object('text', $$Perjalanan makanan dimulai dari mulut: gigi mengunyah, lidah mendorong, lalu makanan turun lewat kerongkongan ke lambung. Di lambung, makanan diaduk dan dicerna menjadi bubur. Bubur makanan masuk ke usus halus untuk diserap sarinya, sisa yang tidak berguna diteruskan ke usus besar dan akhirnya dibuang. Karena itu, mengunyah makanan sampai halus sangat membantu kerja lambung.$$)),
(gen_random_uuid(), 'e3700006-0000-4000-8000-000000000006', 'HEADING', 9, jsonb_build_object('text', $$Menjaga Kesehatan Organ Tubuh$$)),
(gen_random_uuid(), 'e3700006-0000-4000-8000-000000000006', 'PARAGRAPH', 10, jsonb_build_object('text', $$Organ tubuh butuh dirawat: makan bergizi seimbang, minum air putih cukup, olahraga teratur, tidur cukup, dan tidak merokok. Cuci tangan sebelum makan membantu mencegah kuman masuk ke sistem pencernaan. Bila ada keluhan — misalnya sakit perut berkepanjangan atau sesak napas — segera beri tahu orang tua atau guru agar diperiksa ke dokter.$$)),
(gen_random_uuid(), 'e3700006-0000-4000-8000-000000000006', 'HEADING', 11, jsonb_build_object('text', $$Latihan$$)),
(gen_random_uuid(), 'e3700006-0000-4000-8000-000000000006', 'LIST', 12, jsonb_build_object('items', ARRAY[$$1. Organ apa yang berfungsi memompa darah ke seluruh tubuh? Kunci: jantung.$$ , $$2. Urutkan perjalanan makanan: mulut → ? → ? → usus halus → usus besar. Kunci: kerongkongan → lambung.$$ , $$3. Sebutkan 3 cara menjaga kesehatan organ pencernaan! Kunci: mengunyah makanan sampai halus, makan bergizi, cuci tangan sebelum makan.$$]))
ON CONFLICT (id) DO NOTHING;
