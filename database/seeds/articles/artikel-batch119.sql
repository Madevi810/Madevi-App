-- Batch 119: 6 artikel, 68 blocks (2 tutorial + 2 explore + 2 school)
-- Idempoten: ON CONFLICT (business_code) DO NOTHING + hapus block lama per artikel

BEGIN;

-- TUT-BAHASA29-001: Bahasa Jerman: Sapaan Dasar untuk Percakapan Pertama
INSERT INTO madevi.articles (id, taxonomy_node_id, business_code, slug, title, summary, status, language, attribution_type, created_by, updated_by, creator_principal_id)
VALUES ('e119a101-ae49-45b5-9446-e12f930e4435', 'b6666666-6666-6666-6666-666666666666', 'TUT-BAHASA29-001', 'bahasa-jerman-sapaan-dasar-percakapan-pertama', 'Bahasa Jerman: Sapaan Dasar untuk Percakapan Pertama', 'Pelajari sapaan dan salam dasar bahasa Jerman: Hallo, Guten Morgen, Danke, hingga perkenalan diri sederhana.', 'DRAFT', 'id', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;

DO $doblk$
DECLARE v_id uuid;
BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'TUT-BAHASA29-001';
  IF v_id IS NOT NULL THEN
    DELETE FROM madevi.article_blocks WHERE article_id = v_id;
    INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', $txt$Masalah: Ingin Menyapa dalam Bahasa Jerman tapi Bingung Mulai dari Mana$txt$));
    INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 1, jsonb_build_object('text', $txt$Bahasa Jerman adalah bahasa ibu bagi sekitar 100 juta orang dan bahasa penting di Eropa. Banyak pemula merasa terintimidasi oleh pengucapan dan tatabahasanya, padahal sapaan dasar sangat mudah dipelajari. Artikel ini memandu kamu menguasai sapaan dan salam dasar Jerman langkah demi langkah.$txt$));
    INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', $txt$Penjelasan: Sapaan dalam Bahasa Jerman$txt$));
    INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 3, jsonb_build_object('text', $txt$Sapaan Jerman memiliki dua tingkat: formal (Sie, untuk orang yang belum dikenal atau situasi resmi) dan informal (du, untuk teman dan keluarga). Kata "Hallo" bersifat netral dan aman dipakai di mana saja. Ucapan terima kasih "Danke" dan "Danke schön" (terima kasih banyak) dipakai setiap hari. Penting: pengucapan huruf v seperti f, w seperti v, dan umlaut ä/ö/ü punya bunyi khas.$txt$));
    INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 4, jsonb_build_object('text', $txt$Persiapan yang Dibutuhkan$txt$));
    INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'LIST', 5, jsonb_build_object('items', to_jsonb(ARRAY[$li$Waktu 15–20 menit untuk latihan pengucapan$li$, $li$Cermin kecil untuk melihat gerakan bibir$li$, $li$Aplikasi kamus atau penerjemah sebagai rujukan$li$, $li$Teman atau rekaman suara untuk berlatih dialog$li$])));
    INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 6, jsonb_build_object('text', $txt$Langkah 1: Sapaan Waktu dan Sapaan Umum$txt$));
    INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'LIST', 7, jsonb_build_object('items', to_jsonb(ARRAY[$li$Guten Morgen (pagi hari) / Guten Tag (siang) / Guten Abend (sore/malam)$li$, $li$Gute Nacht (selamat tidur — hanya untuk berpamitan, bukan menyapa)$li$, $li$Hallo! (halo — netral, aman dipakai) / Tschüss! (dadah — informal) / Auf Wiedersehen (sampai jumpa — formal)$li$, $li$Ich heiße ... (nama saya ...) / Wie heißt du? (siapa namamu? — informal) / Freut mich! (senang bertemu denganmu!)$li$])));
    INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 8, jsonb_build_object('text', $txt$Langkah 2: Kata Sopan Sehari-hari$txt$));
    INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'LIST', 9, jsonb_build_object('items', to_jsonb(ARRAY[$li$Bitte (tolong / sama-sama) dan Danke / Danke schön (terima kasih / banyak)$li$, $li$Entschuldigung (permisi / maaf) dan Ja / Nein (ya / tidak)$li$])));
    INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 10, jsonb_build_object('text', $txt$Risiko, Pemeriksaan Hasil, dan Tindak Lanjut$txt$));
    INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 11, jsonb_build_object('text', $txt$Hindari memakai "du" ke orang asing atau atasan (gunakan Sie agar sopan), jangan ucapkan Gute Nacht saat datang di malam hari, dan ucapkan "w" seperti "v". Kamu berhasil jika bisa: (1) menyapa sesuai waktu dengan benar, (2) memperkenalkan nama dan bertanya nama orang lain, (3) mengucapkan terima kasih dan berpamitan secara sopan. Uji dengan dialog mini bersama teman atau rekaman suara sendiri. Tindak lanjut: lanjutkan ke angka 1–20, lalu kalimat tanya sederhana seperti "Woher kommen Sie?" (Anda berasal dari mana?). Latih 10 menit sehari.$txt$));
  END IF;
END;
$doblk$;

-- TUT-KESEHATAN58-001: Mual: Penyebab Umum dan Cara Mengatasinya di Rumah
INSERT INTO madevi.articles (id, taxonomy_node_id, business_code, slug, title, summary, status, language, attribution_type, created_by, updated_by, creator_principal_id)
VALUES ('e1195ce6-5e0c-45f3-bfd4-3dffa0134245', 'b5555555-5555-5555-5555-555555555555', 'TUT-KESEHATAN58-001', 'mual-penyebab-umum-dan-cara-mengatasi', 'Mual: Penyebab Umum dan Cara Mengatasinya di Rumah', 'Mual bisa disebabkan masuk angin, mabuk perjalanan, hingga gangguan lambung. Kenali penyebab umum, pertolongan pertama, dan tanda bahaya.', 'DRAFT', 'id', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;

DO $doblk$
DECLARE v_id uuid;
BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'TUT-KESEHATAN58-001';
  IF v_id IS NOT NULL THEN
    DELETE FROM madevi.article_blocks WHERE article_id = v_id;
    INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', $txt$Masalah: Mual yang Mengganggu Aktivitas$txt$));
    INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 1, jsonb_build_object('text', $txt$Mual adalah sensasi tidak nyaman di perut yang sering membuat ingin muntah. Hampir semua orang pernah mengalaminya, dari mabuk perjalanan hingga telat makan. Sebagian besar mual ringan bisa ditangani di rumah. Informasi ini bersifat umum dan bukan pengganti nasihat dokter.$txt$));
    INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', $txt$Penjelasan: Apa Itu Mual$txt$));
    INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 3, jsonb_build_object('text', $txt$Mual terjadi ketika pusat muntah di otak menerima sinyal dari lambung, telinga dalam (keseimbangan), atau aliran darah. Penyebab umum: masuk angin dan telat makan, mabuk perjalanan, GERD atau maag, kehamilan (morning sickness), migrain, infeksi saluran cerna, efek samping obat, dan stres berat. Mual akut biasanya sembuh sendiri dalam hitungan jam.$txt$));
    INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 4, jsonb_build_object('text', $txt$Persiapan yang Dibutuhkan$txt$));
    INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'LIST', 5, jsonb_build_object('items', to_jsonb(ARRAY[$li$Air putih hangat atau teh jahe hangat$li$, $li$Tempat istirahat yang tenang dan berventilasi baik$li$, $li$Makanan ringan yang mudah dicerna (biskuit, roti, bubur)$li$, $li$Kantung atau wadah jika muntah tidak tertahankan$li$])));
    INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 6, jsonb_build_object('text', $txt$Langkah 1: Tenangkan Diri, Hidrasi, dan Makanan Ringan$txt$));
    INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'LIST', 7, jsonb_build_object('items', to_jsonb(ARRAY[$li$Berbaring/duduk nyaman, hindari bergerak tiba-tiba; hirup udara segar dan hindari bau menyengat$li$, $li$Minum sedikit-sedikit air putih hangat atau teh jahe hangat; hindari soda, kafein, dan alkohol$li$, $li$Setelah agak membaik, makan porsi kecil: biskuit, roti tawar, atau bubur; hindari yang berminyak dan pedas$li$])));
    INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 8, jsonb_build_object('text', $txt$Langkah 2: Atasi Penyebab Spesifik$txt$));
    INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'LIST', 9, jsonb_build_object('items', to_jsonb(ARRAY[$li$Mabuk perjalanan: duduk stabil, tatap horizon, jangan membaca di kendaraan$li$, $li$Telat makan: makan porsi kecil perlahan, jangan langsung kenyang$li$, $li$Mual hamil: camilan kering sebelum bangun, makan sedikit tapi sering$li$, $li$Stres berat: istirahat dan relaksasi sebelum makan$li$])));
    INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 10, jsonb_build_object('text', $txt$Risiko, Tanda Bahaya, dan Tindak Lanjut$txt$));
    INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 11, jsonb_build_object('text', $txt$Jangan langsung minum obat anti-mual tanpa tahu penyebabnya dan jangan menahan muntah terlalu keras. Waspadai dehidrasi (mulut kering, jarang buang air kecil, pusing berdiri). SEGERA ke dokter/IGD jika: muntah darah atau seperti ampas kopi; nyeri dada, nyeri perut hebat, atau leher kaku; tidak buang air kecil 8 jam lebih; demam tinggi dengan muntah terus; atau mual setelah cedera kepala. Mual ringan umumnya membaik dalam beberapa jam. Catat pemicunya agar bisa dihindari; jika berulang berhari-hari, disertai penurunan berat badan, atau muntah terus lebih dari 24 jam pada anak, segera konsultasi dokter.$txt$));
  END IF;
END;
$doblk$;

-- EXP-GEOGRAFI29-001: Sungai Terpanjang di Dunia: Persaingan Nil dan Amazon
INSERT INTO madevi.articles (id, taxonomy_node_id, business_code, slug, title, summary, status, language, attribution_type, created_by, updated_by, creator_principal_id)
VALUES ('e1194f7c-d207-47ea-8d9c-c0d67d654d37', 'c6000001-0000-0000-0000-000000000001', 'EXP-GEOGRAFI29-001', 'sungai-terpanjang-di-dunia', 'Sungai Terpanjang di Dunia: Persaingan Nil dan Amazon', 'Mana sungai terpanjang di dunia: Nil atau Amazon? Jelajahi daftar sungai terpanjang, cara mengukurnya, dan perannya bagi peradaban.', 'DRAFT', 'id', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;

DO $doblk$
DECLARE v_id uuid;
BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-GEOGRAFI29-001';
  IF v_id IS NOT NULL THEN
    DELETE FROM madevi.article_blocks WHERE article_id = v_id;
    INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', $txt$Mengapa Panjang Sungai Sulit Diukur?$txt$));
    INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 1, jsonb_build_object('text', $txt$Panjang sungai tidak semudah mengukur jalan raya. Para ilmuwan harus menentukan titik hulu (sumber) yang tepat, dan hulu sungai sering berpindah atau terdiri dari banyak anak sungai. Karena itu, peringkat sungai terpanjang dunia masih diperdebatkan, terutama antara Sungai Nil di Afrika dan Sungai Amazon di Amerika Selatan.$txt$));
    INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', $txt$Sungai Nil: Raksasa Afrika$txt$));
    INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 3, jsonb_build_object('text', $txt$Sungai Nil mengalir sekitar 6.650 km dari Danau Victoria di Afrika Timur hingga Laut Mediterania di Mesir, melewati 11 negara. Nil adalah nadi peradaban Mesir kuno — banjir tahunannya menyuburkan tanah pertanian dan menjadi dasar kalender serta kepercayaan mereka. Hingga kini Nil menopang kehidupan jutaan penduduk Mesir dan Sudan.$txt$));
    INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 4, jsonb_build_object('text', $txt$Sungai Amazon: Sang Penantang$txt$));
    INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 5, jsonb_build_object('text', $txt$Sungai Amazon di Amerika Selatan memiliki panjang sekitar 6.400–6.990 km menurut berbagai penelitian, dengan sebagian ilmuwan mengklaimnya lebih panjang dari Nil. Yang pasti, Amazon adalah sungai dengan debit air terbesar di dunia dan dikelilingi hutan hujan terluas di planet ini. Cekungannya menyimpan seperlima air tawar permukaan bumi.$txt$));
    INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 6, jsonb_build_object('text', $txt$Sungai-Sungai Panjang Lainnya$txt$));
    INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 7, jsonb_build_object('text', $txt$Di bawah dua raksasa itu ada Sungai Yangtze di Tiongkok (sekitar 6.300 km, sungai terpanjang di Asia), Sungai Mississippi-Missouri di Amerika Serikat (sekitar 6.275 km), Sungai Yenisei di Siberia (sekitar 5.539 km), dan Sungai Kuning (Huang He) di Tiongkok (sekitar 5.464 km). Setiap sungai besar ini melahirkan peradaban dan kota-kota penting.$txt$));
    INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 8, jsonb_build_object('text', $txt$Peran Sungai bagi Peradaban$txt$));
    INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 9, jsonb_build_object('text', $txt$Sungai adalah ibu kota peradaban: air minum, irigasi, transportasi, dan perdagangan. Kota-kota besar dunia tumbuh di tepi sungai — Kairo di Nil, Shanghai di Yangtze, dan Baghdad di Tigris. Sungai juga menjadi sumber energi lewat pembangkit listrik tenaga air dan penopang keanekaragaman hayati.$txt$));
  END IF;
END;
$doblk$;

-- EXP-TEKNOLOGI31-001: Teknologi VR: Cara Kerja Virtual Reality dan Masa Depannya
INSERT INTO madevi.articles (id, taxonomy_node_id, business_code, slug, title, summary, status, language, attribution_type, created_by, updated_by, creator_principal_id)
VALUES ('e11952ca-b5ea-4324-83d6-6d4a09dc9d5f', 'c7777777-7777-7777-7777-777777777777', 'EXP-TEKNOLOGI31-001', 'teknologi-vr-virtual-reality-cara-kerja', 'Teknologi VR: Cara Kerja Virtual Reality dan Masa Depannya', 'Bagaimana VR membuatmu merasa berada di dunia lain? Pelajari cara kerja headset VR, penerapannya, dan perkembangan teknologi imersif.', 'DRAFT', 'id', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;

DO $doblk$
DECLARE v_id uuid;
BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-TEKNOLOGI31-001';
  IF v_id IS NOT NULL THEN
    DELETE FROM madevi.article_blocks WHERE article_id = v_id;
    INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', $txt$Apa Itu Virtual Reality?$txt$));
    INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 1, jsonb_build_object('text', $txt$Virtual Reality (VR) adalah teknologi yang menciptakan lingkungan digital tiga dimensi yang terasa nyata, diakses lewat headset khusus. Berbeda dari menonton layar biasa, VR mengelilingi seluruh bidang pandang sehingga otak merasa benar-benar berada di dalam dunia virtual.$txt$));
    INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', $txt$Cara Kerja Headset VR$txt$));
    INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 3, jsonb_build_object('text', $txt$Headset VR menampilkan dua gambar yang sedikit berbeda — satu untuk mata kiri, satu untuk mata kanan — sehingga otak menggabungkannya menjadi penglihatan 3D (stereoskopi). Sensor gerak melacak pergerakan kepala agar pandangan berubah secara alami saat kamu menoleh. Pengontrol tangan menambah interaksi seperti menggenggam objek virtual.$txt$));
    INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 4, jsonb_build_object('text', $txt$Penerapan VR Saat Ini$txt$));
    INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 5, jsonb_build_object('text', $txt$VR kini dipakai jauh melampaui game: pelatihan pilot dan dokter bedah, simulasi keselamatan kerja di pabrik dan tambang, tur virtual properti dan museum, terapi fobia dan rehabilitasi, hingga ruang kerja virtual untuk rapat jarak jauh. Di Indonesia, VR mulai dipakai untuk pelatihan vokasi dan promosi pariwisata.$txt$));
    INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 6, jsonb_build_object('text', $txt$Tantangan Teknologi VR$txt$));
    INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 7, jsonb_build_object('text', $txt$Tantangan VR meliputi motion sickness (mual karena ketidaksesuaian gerak mata dan tubuh), harga perangkat yang masih mahal, resolusi yang belum setajam mata manusia, dan kebutuhan komputer berkemampuan tinggi. Penggunaan berlebihan juga bisa menyebabkan kelelahan mata dan isolasi sosial.$txt$));
    INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 8, jsonb_build_object('text', $txt$Masa Depan VR dan Teknologi Imersif$txt$));
    INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 9, jsonb_build_object('text', $txt$Masa depan VR mengarah ke perangkat yang lebih ringan dan nirkabel, resolusi mendekati penglihatan manusia, umpan balik sentuhan (haptic) yang realistis, dan integrasi dengan AR (Augmented Reality) menjadi perangkat campuran. Metaverse dan kolaborasi virtual diperkirakan menjadi pendorong utama adopsi dalam satu dekade ke depan.$txt$));
  END IF;
END;
$doblk$;

-- SCH-SMP-MAT19-001: Matematika Kelas 8: Statistika — Mengolah dan Membaca Data
INSERT INTO madevi.articles (id, taxonomy_node_id, business_code, slug, title, summary, status, language, attribution_type, created_by, updated_by, creator_principal_id)
VALUES ('e1194ffc-8057-4c3c-b62b-b88adcd50686', 'd4444444-4444-4444-4444-444444444444', 'SCH-SMP-MAT19-001', 'matematika-kelas-8-statistika-data', 'Matematika Kelas 8: Statistika — Mengolah dan Membaca Data', 'Pelajari statistika kelas 8: mean, median, modus, penyajian data dalam tabel dan diagram, beserta latihan soal dan kunci jawaban.', 'DRAFT', 'id', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;

DO $doblk$
DECLARE v_id uuid;
BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'SCH-SMP-MAT19-001';
  IF v_id IS NOT NULL THEN
    DELETE FROM madevi.article_blocks WHERE article_id = v_id;
    INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', $txt$Tujuan Pembelajaran$txt$));
    INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 1, jsonb_build_object('text', $txt$Setelah mempelajari materi ini, kamu diharapkan mampu: (1) menentukan mean, median, dan modus dari sekumpulan data, (2) menyajikan data dalam bentuk tabel, diagram batang, diagram garis, dan diagram lingkaran, (3) membaca dan menafsirkan data yang disajikan.$txt$));
    INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', $txt$Materi 1: Mean, Median, dan Modus$txt$));
    INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 3, jsonb_build_object('text', $txt$Mean (rata-rata) = jumlah seluruh data dibagi banyaknya data. Median = nilai tengah setelah data diurutkan. Modus = nilai yang paling sering muncul. Contoh: data nilai 6, 7, 7, 8, 9. Mean = (6+7+7+8+9) ÷ 5 = 7,4. Median = 7 (nilai tengah). Modus = 7 (muncul dua kali).$txt$));
    INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 4, jsonb_build_object('text', $txt$Materi 2: Penyajian Data$txt$));
    INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 5, jsonb_build_object('text', $txt$Data dapat disajikan dalam: tabel frekuensi (daftar nilai dan jumlah kemunculannya), diagram batang (membandingkan jumlah), diagram garis (menunjukkan perubahan dari waktu ke waktu), dan diagram lingkaran (menunjukkan bagian dari keseluruhan dalam persen atau derajat). Pilih diagram sesuai pesan yang ingin disampaikan.$txt$));
    INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 6, jsonb_build_object('text', $txt$Contoh Soal 1$txt$));
    INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 7, jsonb_build_object('text', $txt$Data berat badan (kg) 10 siswa: 40, 42, 38, 45, 40, 44, 39, 41, 43, 38. Tentukan mean, median, dan modus! Jawab: Jumlah = 410, mean = 410 ÷ 10 = 41 kg. Data terurut: 38, 38, 39, 40, 40, 41, 42, 43, 44, 45. Median = rata-rata data ke-5 dan ke-6 = (40+41) ÷ 2 = 40,5 kg. Modus = 38 dan 40 (keduanya muncul dua kali).$txt$));
    INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 8, jsonb_build_object('text', $txt$Contoh Soal 2$txt$));
    INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 9, jsonb_build_object('text', $txt$Dalam satu kelas, 12 siswa suka sepak bola, 8 suka basket, 6 suka voli, dan 4 suka badminton. Sajikan dalam diagram lingkaran! Jawab: total 30 siswa. Sepak bola = 12/30 × 360° = 144°. Basket = 8/30 × 360° = 96°. Voli = 6/30 × 360° = 72°. Badminton = 4/30 × 360° = 48°. Jumlah sudut = 360°.$txt$));
    INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 10, jsonb_build_object('text', $txt$Latihan Soal dan Kunci Jawaban$txt$));
    INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'LIST', 11, jsonb_build_object('items', to_jsonb(ARRAY[$li$Data: 5, 8, 6, 9, 7, 8, 5. Tentukan mean, median, modus! (Kunci: mean ≈ 6,86; terurut 5,5,6,7,8,8,9; median = 7; modus = 5 dan 8.)$li$, $li$Nilai ulangan 20 siswa rata-ratanya 75 dan total nilai 1.500 — apakah konsisten? (Kunci: ya, karena 1.500 ÷ 20 = 75.)$li$, $li$Sajikan dalam diagram batang: Senin 10, Selasa 15, Rabu 12, Kamis 18, Jumat 20. (Kunci: sumbu x = hari, sumbu y = jumlah; batang Jumat tertinggi.)$li$, $li$Dua data memiliki mean sama 70. Apa kesimpulannya? (Kunci: mean sama tidak berarti datanya sama — lihat median, modus, dan rentang.)$li$])));
  END IF;
END;
$doblk$;

-- SCH-SD-BIN22-001: Bahasa Indonesia Kelas 1: Mengenal Huruf A sampai Z
INSERT INTO madevi.articles (id, taxonomy_node_id, business_code, slug, title, summary, status, language, attribution_type, created_by, updated_by, creator_principal_id)
VALUES ('e1197ff2-2557-4b4b-9a27-b8353b60da22', 'd3333333-3333-3333-3333-333333333333', 'SCH-SD-BIN22-001', 'bahasa-indonesia-kelas-1-mengenal-huruf', 'Bahasa Indonesia Kelas 1: Mengenal Huruf A sampai Z', 'Belajar mengenal huruf besar dan huruf kecil A–Z dengan cara yang menyenangkan: lagu, permainan, dan latihan menulis untuk kelas 1 SD.', 'DRAFT', 'id', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;

DO $doblk$
DECLARE v_id uuid;
BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'SCH-SD-BIN22-001';
  IF v_id IS NOT NULL THEN
    DELETE FROM madevi.article_blocks WHERE article_id = v_id;
    INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', $txt$Tujuan Pembelajaran$txt$));
    INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 1, jsonb_build_object('text', $txt$Setelah belajar, kamu diharapkan bisa: (1) menyebutkan nama huruf A sampai Z, (2) membedakan huruf besar dan huruf kecil, (3) menulis huruf dengan rapi, (4) menyebutkan kata yang diawali huruf tertentu. Ayo belajar sambil bermain!$txt$));
    INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', $txt$Materi 1: Huruf Besar dan Huruf Kecil$txt$));
    INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 3, jsonb_build_object('text', $txt$Abjad Indonesia ada 26 huruf: A B C D E F G H I J K L M N O P Q R S T U V W X Y Z. Setiap huruf punya pasangan huruf kecil: a b c d e f g h i j k l m n o p q r s t u v w x y z. Huruf besar dipakai di awal kalimat dan nama orang, misalnya: Budi, Ani, Jakarta.$txt$));
    INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 4, jsonb_build_object('text', $txt$Materi 2: Bunyi Huruf$txt$));
    INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 5, jsonb_build_object('text', $txt$Setiap huruf punya bunyi. Coba ucapkan: a (apel), b (bola), c (cacing), d (dadu), e (elang), f (foto), g (gajah), h (harimau), i (ikan), j (jambu), k (kucing), l (lemari), m (mangga), n (nanas), o (obat), p (pensil), q (quran), r (rambutan), s (semangka), t (tomat), u (ular), v (vas), w (wortel), x (xylophone), y (yoyo), z (zebra).$txt$));
    INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 6, jsonb_build_object('text', $txt$Permainan: Tebak Huruf$txt$));
    INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 7, jsonb_build_object('text', $txt$Ayo bermain! Guru atau orang tua menyebutkan sebuah kata, misalnya "meja", lalu kamu menyebutkan huruf pertamanya: M! Coba lagi: "sapi" → S, "topi" → T, "gajah" → G. Kamu juga bisa bermain sebaliknya: guru menyebutkan huruf, kamu mencari benda di sekitarmu yang diawali huruf itu.$txt$));
    INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 8, jsonb_build_object('text', $txt$Latihan Menulis Huruf$txt$));
    INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'LIST', 9, jsonb_build_object('items', to_jsonb(ARRAY[$li$Tulis huruf besar A sampai Z di buku tulismu, masing-masing satu baris.$li$, $li$Tulis pasangan huruf kecil a sampai z di bawahnya.$li$, $li$Lingkari huruf vokal (a, i, u, e, o) dengan pensil warna.$li$, $li$Tulis namamu dengan huruf besar di awal, contoh: Budi Santoso.$li$])));
    INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 10, jsonb_build_object('text', $txt$Latihan Soal dan Kunci Jawaban$txt$));
    INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'LIST', 11, jsonb_build_object('items', to_jsonb(ARRAY[$li$Sebutkan 5 huruf vokal! (Kunci: a, i, u, e, o.)$li$, $li$Tuliskan huruf kecil dari: B, D, F, H, J. (Kunci: b, d, f, h, j.)$li$, $li$Kata "kucing" diawali huruf apa? (Kunci: huruf K.)$li$, $li$Tuliskan 3 nama temanmu dengan huruf besar di awal! (Kunci: contoh Ani, Budi, Siti.)$li$, $li$Urutkan huruf berikut: m, a, c, b, d. (Kunci: a, b, c, d, m.)$li$])));
  END IF;
END;
$doblk$;

COMMIT;