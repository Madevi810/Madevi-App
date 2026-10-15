-- ============================================================================
-- Madevi Content Batch 56 — 6 artikel (2 Tutorial, 2 Explore, 2 School)
-- Idempoten: ON CONFLICT DO NOTHING pada artikel; block lama dihapus dulu.
-- Owner: f7125028-187e-44e0-b95b-88b69b8d5c9a | status DRAFT | language id
-- ============================================================================
BEGIN;

-- --------------------------------------------------------------------------
-- 1. TUT-BAHASA8-001 — "Bahasa Prancis: Sapaan Dasar" (12 block)
-- Node: R1.D5 Belajar & Pendidikan (b6666666-6666-6666-666666666666)
-- --------------------------------------------------------------------------
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_name, creator_principal_id, access_level, status, created_by, updated_by)
VALUES (
  'e5656561-5656-4565-8565-565656565651',
  'TUT-BAHASA8-001',
  'b6666666-6666-6666-6666-666666666666',
  'Bahasa Prancis: Sapaan Dasar',
  'bahasa-prancis-sapaan-dasar',
  'Pelajari sapaan dasar bahasa Prancis: bonjour, merci, hingga cara memperkenalkan diri dengan percaya diri.',
  'id', 6, 'Madevi', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'MEMBER', 'DRAFT',
  'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a'
) ON CONFLICT (business_code) DO NOTHING;

DELETE FROM madevi.article_blocks WHERE article_id = 'e5656561-5656-4565-8565-565656565651';

INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
(gen_random_uuid(), 'e5656561-5656-4565-8565-565656565651', 'HEADING', 0, jsonb_build_object('text', $$Masalah: Bahasa Prancis Terdengar Menakutkan$$)),
(gen_random_uuid(), 'e5656561-5656-4565-8565-565656565651', 'PARAGRAPH', 1, jsonb_build_object('text', $$Banyak orang ingin belajar bahasa Prancis — bahasa diplomatik dan budaya — tetapi mundur duluan karena pelafalannya terlihat sulit: huruf yang tidak dibaca, bunyi sengau "r", dan aksen yang asing di telinga. Padahal untuk sekadar menyapa dan berkenalan, Anda hanya perlu menguasai sekitar 15 frasa dan satu aturan baca yang konsisten.$$)),
(gen_random_uuid(), 'e5656561-5656-4565-8565-565656565651', 'HEADING', 2, jsonb_build_object('text', $$Mengapa Sapaan Penting dalam Budaya Prancis$$)),
(gen_random_uuid(), 'e5656561-5656-4565-8565-565656565651', 'PARAGRAPH', 3, jsonb_build_object('text', $$Di Prancis, menyapa bukan sekadar basa-basi — ini kewajiban sosial. Masuk toko tanpa mengucapkan "bonjour" dianggap tidak sopan. Orang Prancis menghargai siapa pun yang berusaha berbicara bahasa mereka, walau terbata-bata. Sapaan yang tepat membuka pintu: percakapan, bantuan, bahkan pertemanan.$$)),
(gen_random_uuid(), 'e5656561-5656-4565-8565-565656565651', 'HEADING', 4, jsonb_build_object('text', $$Persiapan: Alat dan Cara Membaca$$)),
(gen_random_uuid(), 'e5656561-5656-4565-8565-565656565651', 'LIST', 5, jsonb_build_object('items', $$["Aplikasi kamus Prancis-Indonesia dengan audio pelafalan (misalnya aplikasi kamus daring atau Google Translate)", "Satu aturan kunci: sebagian besar huruf konsonan di akhir kata TIDAK dibaca — contoh: \"bonjour\" dibaca \"bon-zhur\", \"merci\" dibaca \"mehr-si\"", "Latih bunyi \"r\" sengau: seperti berkumur ringan, bukan \"r\" Indonesia yang digetarkan", "Rekam suara Anda lalu bandingkan dengan audio penutur asli"]$$)),
(gen_random_uuid(), 'e5656561-5656-4565-8565-565656565651', 'HEADING', 6, jsonb_build_object('text', $$Langkah 1: Sapaan Sehari-hari$$)),
(gen_random_uuid(), 'e5656561-5656-4565-8565-565656565651', 'LIST', 7, jsonb_build_object('items', $$["Bonjour (bon-zhur) — halo/selamat pagi, sapaan paling wajib dipakai kapan pun sebelum sore", "Bonsoir (bon-swar) — selamat malam, dipakai mulai sore hari", "Salut (sa-lyu) — hai, versi santai untuk teman sebaya", "Merci (mehr-si) — terima kasih; tambah \"beaucoup\" (bo-ku) untuk \"terima kasih banyak\"", "S'il vous plait (sil-vu-ple) — tolong/silakan, kata ajaib kesopanan"]$$)),
(gen_random_uuid(), 'e5656561-5656-4565-8565-565656565651', 'HEADING', 8, jsonb_build_object('text', $$Langkah 2: Memperkenalkan Diri$$)),
(gen_random_uuid(), 'e5656561-5656-4565-8565-565656565651', 'PARAGRAPH', 9, jsonb_build_object('text', $$Setelah menyapa, lanjutkan dengan perkenalan sederhana: "Je m'appelle ..." (zhe ma-pel) artinya "nama saya ...". Lalu tanyakan balik: "Et vous ?" (e vu) — "kalau Anda?". Untuk berpamitan, ucapkan "Au revoir" (o ruh-vwar) yang artinya "sampai jumpa". Tiga kalimat ini saja sudah cukup untuk percakapan pertama yang sopan.$$)),
(gen_random_uuid(), 'e5656561-5656-4565-8565-565656565651', 'HEADING', 10, jsonb_build_object('text', $$Kesalahan Umum dan Etiket$$)),
(gen_random_uuid(), 'e5656561-5656-4565-8565-565656565651', 'LIST', 11, jsonb_build_object('items', $$["Langsung memakai \"salut\" ke orang yang lebih tua atau belum dikenal — pakai \"bonjour\" agar aman", "Membaca semua huruf akhir kata: \"merci\" bukan \"mer-ki\", \"bonjour\" bukan \"bon-jour\"", "Lupa mengucapkan \"bonjour\" saat masuk toko atau memulai percakapan — ini dianggap tidak sopan", "Takut salah lalu tidak mencoba sama sekali: orang Prancis justru menghargai usaha Anda"]$$));

-- --------------------------------------------------------------------------
-- 2. TUT-KESEHATAN16-001 — "Alergi: Kenali Pemicunya" (12 block)
-- Node: R1.D4 Kesehatan & Mental (b5555555-5555-5555-5555-555555555555)
-- --------------------------------------------------------------------------
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_name, creator_principal_id, access_level, status, created_by, updated_by)
VALUES (
  'e5656562-5656-4565-8565-565656565652',
  'TUT-KESEHATAN16-001',
  'b5555555-5555-5555-5555-555555555555',
  'Alergi: Kenali Pemicunya',
  'alergi-kenali-pemicunya',
  'Memahami alergi: pemicu umum, cara mengenali pola gejala, dan langkah penanganan. Informasi umum, anjuran konsultasi dokter.',
  'id', 6, 'Madevi', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'MEMBER', 'DRAFT',
  'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a'
) ON CONFLICT (business_code) DO NOTHING;

DELETE FROM madevi.article_blocks WHERE article_id = 'e5656562-5656-4565-8565-565656565652';

INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
(gen_random_uuid(), 'e5656562-5656-4565-8565-565656565652', 'HEADING', 0, jsonb_build_object('text', $$Masalah: Bersin dan Gatal yang Berulang$$)),
(gen_random_uuid(), 'e5656562-5656-4565-8565-565656565652', 'PARAGRAPH', 1, jsonb_build_object('text', $$Setiap pagi Anda bersin-bersin tanpa henti, hidung gatal, atau kulit bentol setelah makan sesuatu. Gejalanya hilang timbul, dan Anda tidak tahu pasti penyebabnya. Alergi sering disangka flu biasa, padahal penanganannya berbeda: alergi tidak sembuh dengan antibiotik, melainkan dengan menghindari pemicunya.$$)),
(gen_random_uuid(), 'e5656562-5656-4565-8565-565656565652', 'HEADING', 2, jsonb_build_object('text', $$Apa Sebenarnya Alergi Itu$$)),
(gen_random_uuid(), 'e5656562-5656-4565-8565-565656565652', 'PARAGRAPH', 3, jsonb_build_object('text', $$Alergi adalah reaksi berlebihan sistem kekebalan tubuh terhadap zat yang sebenarnya tidak berbahaya — disebut alergen. Tubuh melepaskan histamin yang memicu bersin, gatal, mata berair, hingga sesak napas. Alergi berbeda dengan intoleransi: alergi melibatkan sistem imun dan bisa berbahaya, sedangkan intoleransi biasanya hanya gangguan pencernaan.$$)),
(gen_random_uuid(), 'e5656562-5656-4565-8565-565656565652', 'HEADING', 4, jsonb_build_object('text', $$Persiapan: Catatan dan Alat Bantu$$)),
(gen_random_uuid(), 'e5656562-5656-4565-8565-565656565652', 'LIST', 5, jsonb_build_object('items', $$["Buku catatan atau aplikasi ponsel untuk mencatat gejala: kapan muncul, apa yang dimakan/dilakukan sebelumnya", "Perhatikan pola selama 1–2 minggu: waktu, lokasi, makanan, dan aktivitas sebelum gejala", "Siapkan daftar riwayat alergi keluarga — alergi cenderung menurun"]$$)),
(gen_random_uuid(), 'e5656562-5656-4565-8565-565656565652', 'HEADING', 6, jsonb_build_object('text', $$Langkah 1: Kenali Pemicu Umum$$)),
(gen_random_uuid(), 'e5656562-5656-4565-8565-565656565652', 'LIST', 7, jsonb_build_object('items', $$["Debu dan tungau: bersin di pagi hari atau saat membersihkan rumah", "Serbuk sari: gejala musiman, mata gatal dan hidung tersumbat", "Makanan: udang, telur, susu sapi, kacang, dan ikan adalah pemicu umum — gejala muncul 30 menit hingga 2 jam setelah makan", "Bulu hewan: kucing dan anjing memicu bersin dan mata berair pada sebagian orang", "Obat-obatan tertentu: antibiotik golongan penisilin dan obat nyeri bisa memicu reaksi alergi"]$$)),
(gen_random_uuid(), 'e5656562-5656-4565-8565-565656565652', 'HEADING', 8, jsonb_build_object('text', $$Langkah 2: Langkah Penanganan Mandiri$$)),
(gen_random_uuid(), 'e5656562-5656-4565-8565-565656565652', 'PARAGRAPH', 9, jsonb_build_object('text', $$Cara paling efektif menangani alergi adalah menghindari pemicunya: ganti seprai rutin jika alergi tungau, batasi paparan serbuk sari di musimnya, dan baca label makanan jika alergi makanan. Untuk gejala ringan, antihistamin yang dijual bebas dapat membantu, tetapi ikuti aturan pakai pada kemasan dan jangan mengandalkan obat terus-menerus tanpa mencari tahu penyebabnya.$$)),
(gen_random_uuid(), 'e5656562-5656-4565-8565-565656565652', 'HEADING', 10, jsonb_build_object('text', $$Tanda Bahaya: Kapan Harus ke Dokter$$)),
(gen_random_uuid(), 'e5656562-5656-4565-8565-565656565652', 'LIST', 11, jsonb_build_object('items', $$["Segera ke IGD jika: bibir atau lidah membengkak, sesak napas, pusing hebat, atau pingsan setelah terpapar alergen — ini bisa jadi syok anafilaksis yang mengancam jiwa", "Ke dokter jika gejala mengganggu aktivitas sehari-hari lebih dari 2 minggu walau sudah menghindari pemicu", "Artikel ini adalah informasi umum dan bukan pengganti nasihat medis — konsultasikan kondisi Anda ke dokter untuk diagnosis dan penanganan yang tepat"]$$));

-- --------------------------------------------------------------------------
-- 3. EXP-GEOGRAFI8-001 — "Pegunungan Tertinggi di Dunia" (10 block)
-- Node: R2.D13 Geografi & Ilmu Bumi (c6000001-0000-0000-0000-000000000001)
-- --------------------------------------------------------------------------
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_name, creator_principal_id, access_level, status, created_by, updated_by)
VALUES (
  'e5656563-5656-4565-8565-565656565653',
  'EXP-GEOGRAFI8-001',
  'c6000001-0000-0000-0000-000000000001',
  'Pegunungan Tertinggi di Dunia',
  'pegunungan-tertinggi-di-dunia',
  'Menjelajahi pegunungan tertinggi di dunia: Himalaya, Andes, hingga barisan pegunungan Indonesia.',
  'id', 5, 'Madevi', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'MEMBER', 'DRAFT',
  'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a'
) ON CONFLICT (business_code) DO NOTHING;

DELETE FROM madevi.article_blocks WHERE article_id = 'e5656563-5656-4565-8565-565656565653';

INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
(gen_random_uuid(), 'e5656563-5656-4565-8565-565656565653', 'HEADING', 0, jsonb_build_object('text', $$Menara-Menara Batu Raksasa Bumi$$)),
(gen_random_uuid(), 'e5656563-5656-4565-8565-565656565653', 'PARAGRAPH', 1, jsonb_build_object('text', $$Pegunungan adalah hasil pertemuan dahsyat lempeng tektonik selama jutaan tahun. Beberapa puncaknya menembus awan, tertutup salju abadi, dan menjadi tantangan terbesar bagi para pendaki. Mari mengenal pegunungan tertinggi di dunia dan rahasia di baliknya.$$)),
(gen_random_uuid(), 'e5656563-5656-4565-8565-565656565653', 'HEADING', 2, jsonb_build_object('text', $$Himalaya: Atap Dunia$$)),
(gen_random_uuid(), 'e5656563-5656-4565-8565-565656565653', 'PARAGRAPH', 3, jsonb_build_object('text', $$Pegunungan Himalaya membentang sepanjang 2.400 km di Asia dan menjadi rumah bagi 14 puncak di atas 8.000 meter — termasuk Gunung Everest (8.848 m), titik tertinggi di permukaan Bumi. Himalaya terbentuk dari tumbukan lempeng India dan Eurasia yang masih berlangsung hingga kini, sehingga puncaknya terus tumbuh beberapa milimeter setiap tahun.$$)),
(gen_random_uuid(), 'e5656563-5656-4565-8565-565656565653', 'HEADING', 4, jsonb_build_object('text', $$Andes dan Pegunungan Besar Lainnya$$)),
(gen_random_uuid(), 'e5656563-5656-4565-8565-565656565653', 'LIST', 5, jsonb_build_object('items', $$["Andes (Amerika Selatan): pegunungan terpanjang di dunia, ±7.000 km, puncak tertinggi Aconcagua 6.961 m", "Alpen (Eropa): pegunungan ikonik dengan puncak Mont Blanc 4.808 m", "Karakoram (Asia): rumah K2 (8.611 m), gunung paling mematikan bagi pendaki", "Pegunungan di Indonesia: Puncak Jaya (4.884 m) di Papua — satu-satunya gletser tropis yang tersisa di Indonesia"]$$)),
(gen_random_uuid(), 'e5656563-5656-4565-8565-565656565653', 'HEADING', 6, jsonb_build_object('text', $$Mengapa Pegunungan Penting bagi Manusia$$)),
(gen_random_uuid(), 'e5656563-5656-4565-8565-565656565653', 'PARAGRAPH', 7, jsonb_build_object('text', $$Pegunungan bukan sekadar pemandangan. Ia adalah "menara air" dunia: salju dan gletser di puncaknya mencair menjadi sungai yang menghidupi miliaran manusia di dataran rendah. Pegunungan juga menciptakan keanekaragaman hayati luar biasa dan memengaruhi pola cuaca serta curah hujan di sekitarnya.$$)),
(gen_random_uuid(), 'e5656563-5656-4565-8565-565656565653', 'HEADING', 8, jsonb_build_object('text', $$Ancaman dan Pelestarian$$)),
(gen_random_uuid(), 'e5656563-5656-4565-8565-565656565653', 'PARAGRAPH', 9, jsonb_build_object('text', $$Pemanasan global mencairkan gletser pegunungan dengan cepat — termasuk gletser tropis Puncak Jaya yang diprediksi hilang dalam beberapa dekade. Menjaga pegunungan berarti menjaga sumber air, keanekaragaman hayati, dan warisan alam bagi generasi berikutnya.$$));

-- --------------------------------------------------------------------------
-- 4. EXP-TEKNOLOGI10-001 — "Satelit: Mata di Angkasa" (10 block)
-- Node: R2.D11 Teknologi (c7777777-7777-7777-777777777777)
-- --------------------------------------------------------------------------
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_name, creator_principal_id, access_level, status, created_by, updated_by)
VALUES (
  'e5656564-5656-4565-8565-565656565654',
  'EXP-TEKNOLOGI10-001',
  'c7777777-7777-7777-7777-777777777777',
  'Satelit: Mata di Angkasa',
  'satelit-mata-di-angkasa',
  'Mengenal satelit: dari komunikasi dan cuaca hingga navigasi GPS yang kita pakai setiap hari.',
  'id', 5, 'Madevi', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'MEMBER', 'DRAFT',
  'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a'
) ON CONFLICT (business_code) DO NOTHING;

DELETE FROM madevi.article_blocks WHERE article_id = 'e5656564-5656-4565-8565-565656565654';

INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
(gen_random_uuid(), 'e5656564-5656-4565-8565-565656565654', 'HEADING', 0, jsonb_build_object('text', $$Ribuan Mata Mengorbit di Atas Kita$$)),
(gen_random_uuid(), 'e5656564-5656-4565-8565-565656565654', 'PARAGRAPH', 1, jsonb_build_object('text', $$Saat ini ribuan satelit buatan mengorbit Bumi — jauh lebih banyak dari yang bisa kita hitung dengan mata telanjang. Mereka memotret cuaca, meneruskan sinyal internet, memandu peta di ponsel kita, hingga memata-matai bencana alam. Tanpa satelit, kehidupan modern akan lumpuh.$$)),
(gen_random_uuid(), 'e5656564-5656-4565-8565-565656565654', 'HEADING', 2, jsonb_build_object('text', $$Sejarah Singkat: Dari Sputnik hingga Starlink$$)),
(gen_random_uuid(), 'e5656564-5656-4565-8565-565656565654', 'PARAGRAPH', 3, jsonb_build_object('text', $$Semuanya dimulai pada 1957 ketika Uni Soviet meluncurkan Sputnik 1, satelit buatan pertama di dunia — bola logam seberat 83 kg yang bunyi "bip"-nya mengguncang dunia. Kini, lebih dari 60 tahun kemudian, perusahaan swasta meluncurkan ribuan satelit internet dalam konstelasi raksasa seperti Starlink.$$)),
(gen_random_uuid(), 'e5656564-5656-4565-8565-565656565654', 'HEADING', 4, jsonb_build_object('text', $$Jenis-Jenis Satelit dan Fungsinya$$)),
(gen_random_uuid(), 'e5656564-5656-4565-8565-565656565654', 'LIST', 5, jsonb_build_object('items', $$["Satelit komunikasi: meneruskan sinyal TV, telepon, dan internet ke seluruh dunia", "Satelit cuaca: memotret awan dan badai untuk prakiraan cuaca harian", "Satelit navigasi (GPS): memandu peta di ponsel dengan ketelitian beberapa meter", "Satelit penginderaan jauh: memantau kebakaran hutan, banjir, dan perubahan lahan", "Satelit ilmiah: teleskop luar angkasa seperti Hubble yang mengamati alam semesta"]$$)),
(gen_random_uuid(), 'e5656564-5656-4565-8565-565656565654', 'HEADING', 6, jsonb_build_object('text', $$Bagaimana Satelit Tetap di Orbit$$)),
(gen_random_uuid(), 'e5656564-5656-4565-8565-565656565654', 'PARAGRAPH', 7, jsonb_build_object('text', $$Satelit tidak "melayang" — ia terus-menerus jatuh ke Bumi, tetapi kecepatannya yang sangat tinggi (sekitar 28.000 km/jam di orbit rendah) membuatnya selalu "jatuh melewati" lengkungan Bumi. Keseimbangan sempurna antara gravitasi dan kecepatan inilah yang disebut orbit.$$)),
(gen_random_uuid(), 'e5656564-5656-4565-8565-565656565654', 'HEADING', 8, jsonb_build_object('text', $$Sampah Antariksa: Masalah Baru$$)),
(gen_random_uuid(), 'e5656564-5656-4565-8565-565656565654', 'PARAGRAPH', 9, jsonb_build_object('text', $$Ribuan satelit mati dan pecahan roket kini menjadi sampah antariksa yang melesat 10 kali lebih cepat dari peluru. Tabrakan antar-sampah bisa memicu reaksi berantai yang membahayakan seluruh orbit Bumi — para ilmuwan menyebutnya sindrom Kessler. Masa depan teknologi antariksa bergantung pada kemampuan kita membersihkan langit.$$));

-- --------------------------------------------------------------------------
-- 5. SCH-SMP-BIO6-001 — "IPA Kelas 9: Listrik Dinamis" (12 block)
-- Node: R3.D15 Sekolah Menengah Pertama / SMP (d4444444-4444-4444-4444-444444444444)
-- --------------------------------------------------------------------------
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_name, creator_principal_id, access_level, status, created_by, updated_by)
VALUES (
  'e5656565-5656-4565-8565-565656565655',
  'SCH-SMP-BIO6-001',
  'd4444444-4444-4444-4444-444444444444',
  'IPA Kelas 9: Listrik Dinamis',
  'ipa-kelas-9-listrik-dinamis',
  'Materi IPA kelas 9: arus listrik, hukum Ohm, rangkaian seri-paralel, dan daya listrik — lengkap dengan latihan dan kunci jawaban.',
  'id', 7, 'Madevi', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'MEMBER', 'DRAFT',
  'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a'
) ON CONFLICT (business_code) DO NOTHING;

DELETE FROM madevi.article_blocks WHERE article_id = 'e5656565-5656-4565-8565-565656565655';

INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
(gen_random_uuid(), 'e5656565-5656-4565-8565-565656565655', 'HEADING', 0, jsonb_build_object('text', $$Tujuan Pembelajaran$$)),
(gen_random_uuid(), 'e5656565-5656-4565-8565-565656565655', 'LIST', 1, jsonb_build_object('items', $$["Menjelaskan pengertian arus listrik, tegangan, dan hambatan", "Menerapkan hukum Ohm untuk menghitung besaran listrik", "Membedakan rangkaian seri dan paralel beserta sifatnya", "Menghitung daya dan energi listrik dalam kehidupan sehari-hari"]$$)),
(gen_random_uuid(), 'e5656565-5656-4565-8565-565656565655', 'HEADING', 2, jsonb_build_object('text', $$Arus, Tegangan, dan Hambatan$$)),
(gen_random_uuid(), 'e5656565-5656-4565-8565-565656565655', 'PARAGRAPH', 3, jsonb_build_object('text', $$Listrik dinamis adalah aliran muatan listrik (elektron) dalam penghantar — inilah yang menyalakan lampu dan menggerakkan kipas angin. Tiga besaran utamanya: arus listrik (I, satuan ampere) adalah laju aliran muatan; tegangan (V, satuan volt) adalah "dorongan" yang menggerakkan muatan; dan hambatan (R, satuan ohm) adalah rintangan terhadap aliran muatan.$$)),
(gen_random_uuid(), 'e5656565-5656-4565-8565-565656565655', 'HEADING', 4, jsonb_build_object('text', $$Hukum Ohm$$)),
(gen_random_uuid(), 'e5656565-5656-4565-8565-565656565655', 'PARAGRAPH', 5, jsonb_build_object('text', $$Hukum Ohm menyatakan bahwa arus listrik berbanding lurus dengan tegangan dan berbanding terbalik dengan hambatan: V = I x R. Contoh: sebuah lampu dengan hambatan 10 ohm dihubungkan ke baterai 12 volt, maka arusnya I = V/R = 12/10 = 1,2 ampere. Rumus ini adalah kunci untuk semua perhitungan listrik dinamis.$$)),
(gen_random_uuid(), 'e5656565-5656-4565-8565-565656565655', 'HEADING', 6, jsonb_build_object('text', $$Rangkaian Seri dan Paralel$$)),
(gen_random_uuid(), 'e5656565-5656-4565-8565-565656565655', 'LIST', 7, jsonb_build_object('items', $$["Rangkaian seri: komponen disusun berurutan, arus sama di semua titik, jika satu lampu mati semua ikut mati (contoh: lampu hias pohon natal model lama)", "Rangkaian paralel: komponen disusun bercabang, tegangan sama di setiap cabang, satu lampu mati tidak memengaruhi yang lain (contoh: instalasi listrik rumah)", "Hambatan total seri: Rtotal = R1 + R2 + ... ; hambatan total paralel selalu LEBIH KECIL dari hambatan terkecil"]$$)),
(gen_random_uuid(), 'e5656565-5656-4565-8565-565656565655', 'HEADING', 8, jsonb_build_object('text', $$Daya dan Energi Listrik$$)),
(gen_random_uuid(), 'e5656565-5656-4565-8565-565656565655', 'PARAGRAPH', 9, jsonb_build_object('text', $$Daya listrik (P, satuan watt) adalah laju penggunaan energi: P = V x I. Lampu 60 watt berarti memakai energi 60 joule setiap detik. Energi yang dipakai dihitung W = P x t, dan inilah yang tercatat di meteran listrik rumah (kWh) lalu ditagih sebagai biaya. Mematikan alat yang tidak dipakai adalah cara paling mudah menghemat tagihan listrik.$$)),
(gen_random_uuid(), 'e5656565-5656-4565-8565-565656565655', 'HEADING', 10, jsonb_build_object('text', $$Latihan Soal$$)),
(gen_random_uuid(), 'e5656565-5656-4565-8565-565656565655', 'LIST', 11, jsonb_build_object('items', $$["Soal 1: Sebuah setrika 220 V memiliki hambatan 44 ohm. Berapa arus yang mengalir? — Kunci: I = V/R = 220/44 = 5 A", "Soal 2: Dua lampu masing-masing 6 ohm disusun seri, dihubungkan ke baterai 12 V. Berapa arus totalnya? — Kunci: Rtotal = 12 ohm, I = 12/12 = 1 A", "Soal 3: Lampu 25 W menyala 4 jam setiap hari. Berapa energi (kWh) yang dipakai dalam 30 hari? — Kunci: W = 25 x 4 x 30 = 3.000 Wh = 3 kWh"]$$));

-- --------------------------------------------------------------------------
-- 6. SCH-SD-PENJAS4-001 — "Penjas Kelas 2: Gerak Manipulatif" (12 block)
-- Node: R3.D14.K9 Kelas 2 SD (d1000002-0000-0000-0000-000000000002)
-- --------------------------------------------------------------------------
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_name, creator_principal_id, access_level, status, created_by, updated_by)
VALUES (
  'e5656566-5656-4565-8565-565656565656',
  'SCH-SD-PENJAS4-001',
  'd1000002-0000-0000-0000-000000000002',
  'Penjas Kelas 2: Gerak Manipulatif',
  'penjas-kelas-2-gerak-manipulatif',
  'Materi Penjas kelas 2 SD: gerak manipulatif — melempar, menangkap, menendang, dan memantulkan bola dengan permainan seru.',
  'id', 5, 'Madevi', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'MEMBER', 'DRAFT',
  'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a'
) ON CONFLICT (business_code) DO NOTHING;

DELETE FROM madevi.article_blocks WHERE article_id = 'e5656566-5656-4565-8565-565656565656';

INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
(gen_random_uuid(), 'e5656566-5656-4565-8565-565656565656', 'HEADING', 0, jsonb_build_object('text', $$Tujuan Pembelajaran$$)),
(gen_random_uuid(), 'e5656566-5656-4565-8565-565656565656', 'LIST', 1, jsonb_build_object('items', $$["Menjelaskan pengertian gerak manipulatif dengan bahasa sederhana", "Melakukan gerakan melempar dan menangkap bola dengan benar", "Melakukan gerakan menendang dan memantulkan bola dengan benar", "Bermain dengan sportif dan menjaga keselamatan"]$$)),
(gen_random_uuid(), 'e5656566-5656-4565-8565-565656565656', 'HEADING', 2, jsonb_build_object('text', $$Apa Itu Gerak Manipulatif?$$)),
(gen_random_uuid(), 'e5656566-5656-4565-8565-565656565656', 'PARAGRAPH', 3, jsonb_build_object('text', $$Gerak manipulatif adalah gerakan yang melibatkan benda, misalnya bola. Contohnya melempar bola ke teman, menangkap bola yang datang, menendang bola ke gawang, dan memantulkan bola ke lantai. Gerakan ini melatih kerja sama antara mata, tangan, dan kaki kita.$$)),
(gen_random_uuid(), 'e5656566-5656-4565-8565-565656565656', 'HEADING', 4, jsonb_build_object('text', $$Melempar dan Menangkap Bola$$)),
(gen_random_uuid(), 'e5656566-5656-4565-8565-565656565656', 'LIST', 5, jsonb_build_object('items', $$["Melempar: pegang bola dengan satu tangan, ayunkan lengan ke belakang lalu lempar ke depan ke arah teman", "Menangkap: buka kedua tangan seperti mangkuk, tatap bola yang datang, lalu tangkap dan peluk ke dada", "Latihan berpasangan: berdiri berhadapan dengan jarak 3 meter, lempar-tangkap bergantian sebanyak 10 kali"]$$)),
(gen_random_uuid(), 'e5656566-5656-4565-8565-565656565656', 'HEADING', 6, jsonb_build_object('text', $$Menendang dan Memantulkan Bola$$)),
(gen_random_uuid(), 'e5656566-5656-4565-8565-565656565656', 'LIST', 7, jsonb_build_object('items', $$["Menendang: gunakan kaki bagian dalam, tatap bola, ayunkan kaki lalu tendang ke arah gawang atau teman", "Memantulkan: dorong bola ke lantai dengan telapak tangan, lalu tangkap saat bola memantul kembali", "Latihan: pantulkan bola 5 kali berturut-turut tanpa jatuh — kalau jatuh, ulangi dari awal!"]$$)),
(gen_random_uuid(), 'e5656566-5656-4565-8565-565656565656', 'HEADING', 8, jsonb_build_object('text', $$Permainan: Lempar Tangkap Berantai$$)),
(gen_random_uuid(), 'e5656566-5656-4565-8565-565656565656', 'PARAGRAPH', 9, jsonb_build_object('text', $$Anak-anak berbaris melingkar. Satu bola dilempar ke teman di sebelah kanan, lalu teman itu melempar ke sebelah kanannya lagi, begitu seterusnya sampai kembali ke anak pertama. Kelompok yang berhasil menyelesaikan satu putaran tanpa bola jatuh adalah pemenangnya. Permainan ini melatih fokus, kerja sama, dan gerak manipulatif sekaligus.$$)),
(gen_random_uuid(), 'e5656566-5656-4565-8565-565656565656', 'HEADING', 10, jsonb_build_object('text', $$Keselamatan dan Sportivitas$$)),
(gen_random_uuid(), 'e5656566-5656-4565-8565-565656565656', 'LIST', 11, jsonb_build_object('items', $$["Lakukan pemanasan sebelum bermain dan pendinginan setelahnya", "Jangan melempar bola ke arah wajah teman — arahkan ke dada atau tangan", "Bermainlah dengan jujur: akui jika bola jatuh, jangan menyalahkan teman", "Rapikan kembali bola dan peralatan setelah selesai bermain"]$$));

COMMIT;
