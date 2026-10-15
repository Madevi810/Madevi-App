-- Batch 113: 6 artikel (2 Tutorial, 2 Explore, 2 School) — idempoten

INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_name, creator_principal_id, access_level, status, attribution_type, created_by, updated_by) VALUES
('e1135916-2e59-4193-8895-a031827bb8df', 'TUT-BAHASA27-001', 'b6666666-6666-6666-6666-666666666666', 'Bahasa Filipina: Sapaan Dasar untuk Percakapan Pertama', 'bahasa-filipina-sapaan-dasar', 'Panduan praktis menyapa dan bercakap dasar dalam bahasa Filipina (Tagalog) untuk percakapan pertama yang percaya diri.', 'id', 6, 'Madevi', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'MEMBER', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_name, creator_principal_id, access_level, status, attribution_type, created_by, updated_by) VALUES
('e113ed00-e2a6-4e82-8f01-d4f8d7804f06', 'TUT-KESEHATAN54-001', 'b5555555-5555-5555-5555-555555555555', 'Sakit Tenggorokan: Cara Mengatasinya di Rumah', 'sakit-tenggorokan-atasi', 'Panduan mengenali penyebab sakit tenggorokan dan langkah perawatan rumahan yang aman, lengkap dengan tanda bahaya kapan harus ke dokter.', 'id', 6, 'Madevi', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'MEMBER', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_name, creator_principal_id, access_level, status, attribution_type, created_by, updated_by) VALUES
('e113bcf1-3584-4709-a731-c78b607340c0', 'EXP-GEOGRAFI27-001', 'c6000001-0000-0000-0000-000000000001', 'Pulau Terbesar di Dunia: Dari Greenland hingga Kalimantan', 'pulau-terbesar-di-dunia', 'Jelajah pulau-pulau terbesar di dunia, di mana Indonesia menempatkan dua wakilnya dalam daftar sepuluh besar.', 'id', 5, 'Madevi', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'MEMBER', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_name, creator_principal_id, access_level, status, attribution_type, created_by, updated_by) VALUES
('e1137b20-ead2-4c11-a730-2f6d59d8d50d', 'EXP-TEKNOLOGI29-001', 'c7777777-7777-7777-7777-777777777777', 'Teknologi Blockchain: Memahami Dasarnya dengan Sederhana', 'teknologi-blockchain-dasar', 'Penjelasan sederhana tentang cara kerja blockchain, mengapa sulit dipalsukan, dan kegunaannya di luar dunia kripto.', 'id', 5, 'Madevi', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'MEMBER', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_name, creator_principal_id, access_level, status, attribution_type, created_by, updated_by) VALUES
('e113605b-458c-4282-8ee0-35b96b9c3172', 'SCH-SMP-ING17-001', 'd4444444-4444-4444-4444-444444444444', 'Bahasa Inggris Kelas 9: Narrative Text', 'bahasa-inggris-kelas-9-narrative', 'Materi narrative text untuk kelas 9: pengertian, struktur orientation-complication-resolution, ciri kebahasaan, contoh, dan latihan soal.', 'id', 7, 'Madevi', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'MEMBER', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_name, creator_principal_id, access_level, status, attribution_type, created_by, updated_by) VALUES
('e1135bc7-f0d6-4310-9939-5513ad1a03d8', 'SCH-SD-BIN20-001', 'd3333333-3333-3333-3333-333333333333', 'Bahasa Indonesia Kelas 5: Menulis Surat Pribadi dan Resmi', 'bahasa-indonesia-kelas-5-surat', 'Materi surat untuk kelas 5 SD: jenis surat pribadi dan resmi, bagian-bagian surat, contoh, dan latihan menulis.', 'id', 7, 'Madevi', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'MEMBER', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;

DO $doblk$
DECLARE v_id uuid;
BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code='TUT-BAHASA27-001';
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
  (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', $txt$Masalah: Grogi Saat Bicara dengan Orang Filipina$txt$)),
  (gen_random_uuid(), v_id, 'PARAGRAPH', 1, jsonb_build_object('text', $txt$Kamu bertemu teman, rekan kerja, atau kenalan dari Filipina, lalu bingung harus menyapa apa. Bahasa Inggris memang dipakai luas di sana, tetapi menyapa dengan bahasa mereka — "Kamusta!" — langsung mencairkan suasana dan membuat lawan bicara merasa dihargai. Masalahnya, kebanyakan orang Indonesia tidak tahu harus mulai dari mana.$txt$)),
  (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', $txt$Penjelasan: Bahasa Filipina Itu Apa$txt$)),
  (gen_random_uuid(), v_id, 'PARAGRAPH', 3, jsonb_build_object('text', $txt$Bahasa Filipina (Filipino) adalah bahasa nasional Filipina yang berbasis bahasa Tagalog, dengan dua bahasa resmi: Filipino dan Inggris. Bahasa ini memakai huruf Latin seperti bahasa Indonesia, jadi cara bacanya relatif mudah ditebak. Ada sekitar 180 bahasa daerah di Filipina, tetapi Filipino dipahami di hampir seluruh negeri.$txt$)),
  (gen_random_uuid(), v_id, 'HEADING', 4, jsonb_build_object('text', $txt$Persiapan Sebelum Mulai$txt$)),
  (gen_random_uuid(), v_id, 'LIST', 5, jsonb_build_object('items', to_jsonb(ARRAY[$txt$Siapkan catatan kecil atau aplikasi notes untuk menulis frasa baru$txt$, $txt$Cari audio pelafalan penutur asli (video atau aplikasi belajar bahasa)$txt$, $txt$Luangkan 10 menit sehari untuk menghafal 3–5 frasa$txt$, $txt$Beranikan diri mempraktikkannya langsung pada kesempatan pertama$txt$]))),
  (gen_random_uuid(), v_id, 'HEADING', 6, jsonb_build_object('text', $txt$Langkah 1: Sapaan Dasar Sehari-hari$txt$)),
  (gen_random_uuid(), v_id, 'LIST', 7, jsonb_build_object('items', to_jsonb(ARRAY[$txt$Kamusta! — Halo! / Apa kabar! (sapaan paling serbaguna)$txt$, $txt$Magandang umaga — Selamat pagi$txt$, $txt$Magandang hapon — Selamat siang/sore$txt$, $txt$Magandang gabi — Selamat malam$txt$, $txt$Paalam — Selamat tinggal$txt$]))),
  (gen_random_uuid(), v_id, 'HEADING', 8, jsonb_build_object('text', $txt$Langkah 2: Kalimat Penting untuk Percakapan Pertama$txt$)),
  (gen_random_uuid(), v_id, 'LIST', 9, jsonb_build_object('items', to_jsonb(ARRAY[$txt$Salamat — Terima kasih (ucapkan "sa-LA-mat")$txt$, $txt$Walang anuman — Sama-sama$txt$, $txt$Oo — Ya | Hindi — Tidak$txt$, $txt$Ako si ... — Nama saya ...$txt$, $txt$Taga saan ka? — Kamu dari mana? | Taga Indonesia ako — Saya dari Indonesia$txt$, $txt$Pasensya na — Maaf$txt$]))),
  (gen_random_uuid(), v_id, 'HEADING', 10, jsonb_build_object('text', $txt$Risiko dan Pemeriksaan Hasil$txt$)),
  (gen_random_uuid(), v_id, 'PARAGRAPH', 11, jsonb_build_object('text', $txt$Kesalahan umum: mengucapkan "Kamusta" dengan nada datar (coba dengan nada ramah dan senyum) dan takut salah sehingga tidak berani mencoba sama sekali — padahal orang Filipina sangat menghargai usaha orang asing berbahasa mereka. Kamu berhasil jika bisa menyapa "Kamusta! Magandang umaga!" dengan percaya diri dan memperkenalkan diri dengan "Ako si ...". Tindak lanjut: pelajari angka 1–10 (isa, dalawa, tatlo...), lalu coba percakapan dua arah sederhana. Konsistensi 10 menit sehari jauh lebih efektif daripada menghafal sekaligus.$txt$));
END $doblk$;

DO $doblk$
DECLARE v_id uuid;
BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code='TUT-KESEHATAN54-001';
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
  (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', $txt$Masalah: Tenggorokan Sakit Saat Menelan$txt$)),
  (gen_random_uuid(), v_id, 'PARAGRAPH', 1, jsonb_build_object('text', $txt$Rasa perih, gatal, atau nyeri setiap menelan membuat makan, minum, bahkan bicara jadi tidak nyaman. Sakit tenggorokan adalah keluhan yang sangat umum — sebagian besar disebabkan infeksi virus ringan dan membaik sendiri dalam beberapa hari. Namun ada kalanya ia menjadi tanda kondisi yang butuh penanganan dokter.$txt$)),
  (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', $txt$Penjelasan: Penyebab Umum Sakit Tenggorokan$txt$)),
  (gen_random_uuid(), v_id, 'PARAGRAPH', 3, jsonb_build_object('text', $txt$Penyebab terbanyak adalah infeksi virus seperti flu biasa dan influenza. Penyebab lain: infeksi bakteri (misalnya radang streptokokus), alergi, udara kering, polusi atau asap rokok, berteriak berlebihan, dan naiknya asam lambung (GERD). Sakit tenggorokan karena virus biasanya disertai pilek dan batuk, sedangkan karena bakteri cenderung demam tinggi tanpa pilek.$txt$)),
  (gen_random_uuid(), v_id, 'HEADING', 4, jsonb_build_object('text', $txt$Persiapan di Rumah$txt$)),
  (gen_random_uuid(), v_id, 'LIST', 5, jsonb_build_object('items', to_jsonb(ARRAY[$txt$Air hangat dan garam dapur untuk kumur$txt$, $txt$Madu murni (untuk usia di atas 1 tahun)$txt$, $txt$Teh hangat, misalnya teh jahe atau chamomile$txt$, $txt$Pelembap udara (humidifier) bila udara ruangan kering$txt$, $txt$Termometer untuk memantau demam$txt$]))),
  (gen_random_uuid(), v_id, 'HEADING', 6, jsonb_build_object('text', $txt$Langkah: Perawatan Rumahan yang Aman$txt$)),
  (gen_random_uuid(), v_id, 'LIST', 7, jsonb_build_object('items', to_jsonb(ARRAY[$txt$Kumur air garam hangat (1/2 sendok teh garam dalam segelas air) 3–4 kali sehari$txt$, $txt$Minum cukup cairan hangat, hindari minuman terlalu panas atau berkafein berlebih$txt$, $txt$Istirahatkan suara — jangan berbisik karena justru menegangkan pita suara$txt$, $txt$Hisap permen pelega tenggorokan atau madu untuk meredakan iritasi$txt$, $txt$Jauhi asap rokok dan polusi selama masa pemulihan$txt$, $txt$Istirahat cukup agar daya tahan tubuh bekerja optimal$txt$]))),
  (gen_random_uuid(), v_id, 'HEADING', 8, jsonb_build_object('text', $txt$Risiko: Tanda Bahaya yang Perlu Diwaspadai$txt$)),
  (gen_random_uuid(), v_id, 'LIST', 9, jsonb_build_object('items', to_jsonb(ARRAY[$txt$Sulit bernapas atau menelan ludah sendiri$txt$, $txt$Demam tinggi di atas 38,5 derajat yang tidak turun 3 hari$txt$, $txt$Ada nanah atau bintik putih di amandel disertai nyeri hebat$txt$, $txt$Suara serak lebih dari 2 minggu$txt$, $txt$Leher bengkak dan kaku, atau keluar air liur terus-menerus$txt$, $txt$Sakit tenggorokan tidak membaik setelah 7–10 hari$txt$]))),
  (gen_random_uuid(), v_id, 'HEADING', 10, jsonb_build_object('text', $txt$Catatan Penting$txt$)),
  (gen_random_uuid(), v_id, 'PARAGRAPH', 11, jsonb_build_object('text', $txt$Informasi ini bersifat umum dan bukan pengganti nasihat medis profesional. Jangan mengonsumsi antibiotik tanpa resep dokter — antibiotik tidak mempan melawan virus dan pemakaian sembarangan berisiko resistensi. Jika muncul salah satu tanda bahaya di atas, atau kamu ragu dengan kondisimu, segera konsultasikan ke dokter atau fasilitas kesehatan terdekat.$txt$));
END $doblk$;

DO $doblk$
DECLARE v_id uuid;
BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code='EXP-GEOGRAFI27-001';
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
  (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', $txt$Apa Itu Pulau?$txt$)),
  (gen_random_uuid(), v_id, 'PARAGRAPH', 1, jsonb_build_object('text', $txt$Pulau adalah daratan yang dikelilingi air di semua sisinya dan lebih kecil dari benua. Australia tidak dihitung sebagai pulau karena statusnya benua. Para ahli geografi biasanya menyusun daftar pulau terbesar berdasarkan luas daratan, dan daftarnya relatif stabil selama ratusan tahun.$txt$)),
  (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', $txt$Greenland: Pulau Terbesar di Dunia$txt$)),
  (gen_random_uuid(), v_id, 'PARAGRAPH', 3, jsonb_build_object('text', $txt$Greenland menempati peringkat pertama dengan luas sekitar 2.166.086 kilometer persegi — kira-kira tiga kali luas Sumatra. Wilayah otonom Denmark ini sebagian besar tertutup lapisan es abadi, dengan populasi hanya sekitar 56 ribu jiwa yang mayoritas tinggal di pesisir barat daya.$txt$)),
  (gen_random_uuid(), v_id, 'HEADING', 4, jsonb_build_object('text', $txt$Papua: Peringkat Kedua Dunia$txt$)),
  (gen_random_uuid(), v_id, 'PARAGRAPH', 5, jsonb_build_object('text', $txt$Pulau Papua (Nugini) adalah pulau terbesar kedua dengan luas sekitar 786.000 kilometer persegi. Pulau ini terbagi dua: bagian barat milik Indonesia (Papua) dan bagian timur negara merdeka Papua Nugini. Papua menyimpan salah satu hutan hujan tropis dan keanekaragaman hayati terkaya di planet ini.$txt$)),
  (gen_random_uuid(), v_id, 'HEADING', 6, jsonb_build_object('text', $txt$Kalimantan dan Sumatra: Wakil Indonesia$txt$)),
  (gen_random_uuid(), v_id, 'PARAGRAPH', 7, jsonb_build_object('text', $txt$Kalimantan (Borneo) menempati peringkat ketiga dunia dengan luas sekitar 743.330 kilometer persegi, terbagi antara Indonesia, Malaysia, dan Brunei. Sumatra menyusul di peringkat keenam dengan sekitar 473.481 kilometer persegi. Artinya, Indonesia memiliki dua pulau dalam sepuluh besar dunia — sebuah fakta geografis yang membanggakan.$txt$)),
  (gen_random_uuid(), v_id, 'HEADING', 8, jsonb_build_object('text', $txt$Mengapa Ukuran Pulau Penting$txt$)),
  (gen_random_uuid(), v_id, 'PARAGRAPH', 9, jsonb_build_object('text', $txt$Pulau besar cenderung memiliki keanekaragaman hayati lebih tinggi, sumber daya alam lebih melimpah, dan iklim mikro yang beragam. Namun ukurannya juga membawa tantangan: infrastruktur sulit merata, sebagian wilayah rawan terisolasi, dan ekosistemnya rentan terhadap deforestasi serta perubahan iklim. Memahami skala pulau membantu kita merencanakan pembangunan yang lebih bijak.$txt$));
END $doblk$;

DO $doblk$
DECLARE v_id uuid;
BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code='EXP-TEKNOLOGI29-001';
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
  (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', $txt$Apa Itu Blockchain?$txt$)),
  (gen_random_uuid(), v_id, 'PARAGRAPH', 1, jsonb_build_object('text', $txt$Blockchain adalah buku besar digital (ledger) yang tersimpan secara terdistribusi di banyak komputer sekaligus, bukan di satu server milik satu perusahaan. Setiap catatan transaksi dikelompokkan ke dalam "blok" yang saling tersambung membentuk "rantai" — dari sinilah namanya berasal.$txt$)),
  (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', $txt$Cara Kerja: Blok demi Blok$txt$)),
  (gen_random_uuid(), v_id, 'PARAGRAPH', 3, jsonb_build_object('text', $txt$Ketika transaksi baru terjadi, ia dikumpulkan bersama transaksi lain ke dalam sebuah blok. Blok ini diberi "sidik jari" digital bernama hash yang juga mencatat hash blok sebelumnya, sehingga seluruh blok saling terkunci berurutan. Jaringan komputer (node) memverifikasi blok lewat mekanisme konsensus sebelum menambahkannya ke rantai.$txt$)),
  (gen_random_uuid(), v_id, 'HEADING', 4, jsonb_build_object('text', $txt$Mengapa Sulit Dipalsukan$txt$)),
  (gen_random_uuid(), v_id, 'PARAGRAPH', 5, jsonb_build_object('text', $txt$Untuk mengubah satu catatan lama, penyerang harus mengubah blok tersebut beserta seluruh blok sesudahnya — dan melakukannya secara bersamaan di mayoritas komputer jaringan di seluruh dunia. Pada jaringan besar, hal ini praktis mustahil secara komputasi dan ekonomi. Inilah sumber kepercayaan blockchain: bukan pada satu pihak, melainkan pada matematika dan desentralisasi.$txt$)),
  (gen_random_uuid(), v_id, 'HEADING', 6, jsonb_build_object('text', $txt$Kegunaan di Luar Mata Uang Kripto$txt$)),
  (gen_random_uuid(), v_id, 'PARAGRAPH', 7, jsonb_build_object('text', $txt$Teknologi ini dipakai untuk melacak rantai pasok (misalnya memastikan kopi benar-benar dari petani tertentu), menerbitkan sertifikat dan ijazah digital anti-palsu, mencatat kepemilikan tanah, hingga sistem voting yang transparan. Banyak perusahaan memakai blockchain privat untuk kebutuhan internal tanpa koin kripto sama sekali.$txt$)),
  (gen_random_uuid(), v_id, 'HEADING', 8, jsonb_build_object('text', $txt$Tantangan dan Kritik$txt$)),
  (gen_random_uuid(), v_id, 'PARAGRAPH', 9, jsonb_build_object('text', $txt$Blockchain bukan tanpa masalah: jaringan besar bisa boros energi, kecepatan transaksi terbatas dibanding sistem pembayaran konvensional, dan regulasinya masih berbeda-beda di tiap negara. Memahaminya secara seimbang — potensi sekaligus batasnya — adalah kunci agar tidak terjebak euforia maupun sinisme berlebihan.$txt$));
END $doblk$;

DO $doblk$
DECLARE v_id uuid;
BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code='SCH-SMP-ING17-001';
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
  (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', $txt$Tujuan Pembelajaran$txt$)),
  (gen_random_uuid(), v_id, 'PARAGRAPH', 1, jsonb_build_object('text', $txt$Setelah mempelajari materi ini, kamu diharapkan mampu: (1) mengidentifikasi tujuan dan struktur narrative text, (2) menemukan ciri kebahasaan yang khas, dan (3) menulis narrative text sederhana dengan struktur yang benar.$txt$)),
  (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', $txt$Pengertian Narrative Text$txt$)),
  (gen_random_uuid(), v_id, 'PARAGRAPH', 3, jsonb_build_object('text', $txt$Narrative text adalah teks yang menceritakan rangkaian peristiwa khayalan maupun nyata dengan tujuan menghibur pembaca (to entertain). Contohnya dongeng (fairy tale), legenda (legend), fabel (fable), dan cerita rakyat. Ciri utamanya: ada tokoh, ada konflik, dan ada penyelesaian.$txt$)),
  (gen_random_uuid(), v_id, 'HEADING', 4, jsonb_build_object('text', $txt$Struktur Teks: Orientation – Complication – Resolution$txt$)),
  (gen_random_uuid(), v_id, 'PARAGRAPH', 5, jsonb_build_object('text', $txt$Orientation memperkenalkan tokoh, latar tempat, dan waktu cerita. Complication memunculkan masalah atau konflik yang dialami tokoh — bagian ini membuat cerita menarik. Resolution berisi penyelesaian masalah, bisa berakhir bahagia (happy ending) atau sedih. Sebagian teks menambahkan coda sebagai pesan moral di akhir.$txt$)),
  (gen_random_uuid(), v_id, 'HEADING', 6, jsonb_build_object('text', $txt$Ciri Kebahasaan (Language Features)$txt$)),
  (gen_random_uuid(), v_id, 'LIST', 7, jsonb_build_object('items', to_jsonb(ARRAY[$txt$Menggunakan past tense: lived, went, saw, decided$txt$, $txt$Action verbs: ran, climbed, shouted, whispered$txt$, $txt$Kata penghubung waktu: once upon a time, then, suddenly, finally$txt$, $txt$Kata sifat dan keterangan untuk menghidupkan suasana: dark forest, bravely$txt$, $txt$Direct speech untuk dialog tokoh: "Help me!" shouted Timun Mas$txt$]))),
  (gen_random_uuid(), v_id, 'HEADING', 8, jsonb_build_object('text', $txt$Contoh Singkat$txt$)),
  (gen_random_uuid(), v_id, 'PARAGRAPH', 9, jsonb_build_object('text', $txt$Orientation: "Long ago in East Java, there lived a kind widow named Mbok Sirni." Complication: "One day, a giant named Buto Ijo demanded her daughter..." Resolution: "With her intelligence, Timun Mas defeated the giant using magical items and lived happily." Perhatikan kata kerja past tense di seluruh paragraf.$txt$)),
  (gen_random_uuid(), v_id, 'HEADING', 10, jsonb_build_object('text', $txt$Latihan Soal$txt$)),
  (gen_random_uuid(), v_id, 'LIST', 11, jsonb_build_object('items', to_jsonb(ARRAY[$txt$1. Sebutkan tiga bagian struktur narrative text beserta fungsinya! — Jawaban: orientation (perkenalan), complication (konflik), resolution (penyelesaian)$txt$, $txt$2. Ubah ke past tense: "She (go) to the river every morning." — Jawaban: went$txt$, $txt$3. Manakah yang termasuk action verb: beautiful, ran, quickly, forest? — Jawaban: ran$txt$, $txt$4. Tulis satu paragraf orientation (3 kalimat) tentang tokoh khayalanmu! — Jawaban: periksa past tense dan latar yang jelas$txt$, $txt$5. Apa tujuan utama narrative text? — Jawaban: to entertain (menghibur pembaca)$txt$])));
END $doblk$;

DO $doblk$
DECLARE v_id uuid;
BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code='SCH-SD-BIN20-001';
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
  (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', $txt$Tujuan Pembelajaran$txt$)),
  (gen_random_uuid(), v_id, 'PARAGRAPH', 1, jsonb_build_object('text', $txt$Setelah belajar materi ini, kamu diharapkan mampu: (1) membedakan surat pribadi dan surat resmi, (2) menyebutkan bagian-bagian surat dengan benar, dan (3) menulis surat pribadi sederhana dengan ejaan yang tepat.$txt$)),
  (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', $txt$Apa Itu Surat?$txt$)),
  (gen_random_uuid(), v_id, 'PARAGRAPH', 3, jsonb_build_object('text', $txt$Surat adalah sarana komunikasi tertulis untuk menyampaikan pesan, kabar, atau permohonan kepada orang lain yang jaraknya jauh. Walaupun sekarang ada pesan instan, kemampuan menulis surat tetap penting — misalnya surat izin, lamaran pekerjaan, dan undangan resmi.$txt$)),
  (gen_random_uuid(), v_id, 'HEADING', 4, jsonb_build_object('text', $txt$Jenis Surat: Pribadi dan Resmi$txt$)),
  (gen_random_uuid(), v_id, 'PARAGRAPH', 5, jsonb_build_object('text', $txt$Surat pribadi ditujukan kepada orang yang dikenal dekat, seperti sahabat atau keluarga; bahasanya santai dan akrab. Surat resmi (dinas) ditujukan kepada instansi atau orang dalam urusan formal; bahasanya baku, sopan, dan mengikuti aturan penulisan tertentu.$txt$)),
  (gen_random_uuid(), v_id, 'HEADING', 6, jsonb_build_object('text', $txt$Bagian-bagian Surat$txt$)),
  (gen_random_uuid(), v_id, 'LIST', 7, jsonb_build_object('items', to_jsonb(ARRAY[$txt$Kepala surat / tempat dan tanggal penulisan$txt$, $txt$Salam pembuka, misalnya "Salam sayang," atau "Dengan hormat,"$txt$, $txt$Paragraf pembuka sebagai pengantar$txt$, $txt$Isi surat sebagai pesan utama$txt$, $txt$Paragraf penutup$txt$, $txt$Salam penutup dan tanda tangan penulis$txt$]))),
  (gen_random_uuid(), v_id, 'HEADING', 8, jsonb_build_object('text', $txt$Contoh Surat Pribadi Singkat$txt$)),
  (gen_random_uuid(), v_id, 'PARAGRAPH', 9, jsonb_build_object('text', $txt$Bandung, 10 Oktober 2026. Salam sayang, Nabila tersayang. Apa kabarmu di Surabaya? Di sini aku baik-baik saja. Liburan kemarin aku pergi ke kebun binatang bersama keluarga — seru sekali! Kapan-kapan kamu harus ikut. Sampai jumpa di liburan berikutnya ya. Peluk hangat, Sinta.$txt$)),
  (gen_random_uuid(), v_id, 'HEADING', 10, jsonb_build_object('text', $txt$Latihan dan Kunci$txt$)),
  (gen_random_uuid(), v_id, 'LIST', 11, jsonb_build_object('items', to_jsonb(ARRAY[$txt$1. Tulis surat pribadi kepada sahabatmu tentang kegiatan akhir pekanmu! — Panduan: sertakan tanggal, salam pembuka, isi 2–3 paragraf, dan salam penutup$txt$, $txt$2. Sebutkan 3 perbedaan surat pribadi dan surat resmi! — Jawaban: tujuan, bahasa (santai vs baku), aturan penulisan$txt$, $txt$3. Susun bagian surat yang acak ini: isi, salam pembuka, penutup, tanggal! — Jawaban: tanggal, salam pembuka, isi, penutup$txt$])));
END $doblk$;
