-- Batch 112: 6 artikel, 68 block
-- Idempoten: ON CONFLICT (business_code) DO NOTHING + hapus block lama per artikel

-- TUT-KOMPUTER29-001: Screenshot: Cara Cepat Menangkap Layar di Windows dan HP
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, attribution_type, status, created_by, updated_by)
VALUES ('e1125c43-2a6d-470d-97ea-13175b4149b4', 'TUT-KOMPUTER29-001', 'baaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', $body$Screenshot: Cara Cepat Menangkap Layar di Windows dan HP$body$, 'screenshot-cara-cepat', $body$Panduan menangkap screenshot dengan cepat di Windows dan HP: tombol pintasan, Snipping Tool, hingga cara menyimpan dan membagikan hasil.$body$, 'id', 5, 'DEVELOPED_BY', 'DRAFT', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;

DO $do$
DECLARE
  v_id uuid := 'e1125c43-2a6d-470d-97ea-13175b4149b4';
BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'TUT-KOMPUTER29-001';
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', $txt$Masalah: Butuh Menangkap Layar dengan Cepat$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 1, jsonb_build_object('text', $txt$Anda sedang membaca artikel, melihat pesan error, atau ingin menyimpan bukti chat, tetapi tidak tahu cara mengambil screenshot dengan cepat. Buka aplikasi berat hanya untuk screenshot terasa ribet dan membuang waktu.$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', $txt$Penjelasan: Cara Kerja Screenshot$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 3, jsonb_build_object('text', $txt$Screenshot adalah foto digital dari tampilan layar perangkat. Di Windows, hasilnya bisa langsung tersimpan sebagai file atau tersalin ke clipboard. Di HP, screenshot otomatis tersimpan ke galeri. Anda hanya perlu tahu kombinasi tombol yang tepat.$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 4, jsonb_build_object('text', $txt$Alat dan Persiapan$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'LIST', 5, to_jsonb(ARRAY[$txt$Perangkat Windows 10/11 atau HP Android/iPhone$txt$, $txt$Aplikasi gambar bawaan (Paint atau Galeri)$txt$, $txt$Penyimpanan kosong beberapa MB$txt$]));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 6, jsonb_build_object('text', $txt$Langkah 1: Screenshot di Windows$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 7, jsonb_build_object('text', $txt$Tekan tombol Print Screen (PrtSc) untuk menyalin seluruh layar ke clipboard, lalu tempel ke Paint dengan Ctrl+V. Untuk menyimpan otomatis sebagai file, tekan Windows+PrtSc dan file tersimpan di folder Gambar > Screenshots. Untuk menangkap sebagian layar saja, tekan Windows+Shift+S, seret kursor pada area yang diinginkan, dan hasilnya tersalin ke clipboard sekaligus tersimpan.$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 8, jsonb_build_object('text', $txt$Langkah 2: Screenshot di HP$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 9, jsonb_build_object('text', $txt$Di HP Android, tekan tombol Power dan Volume Bawah secara bersamaan. Di iPhone dengan Face ID, tekan tombol Samping dan Volume Atas bersamaan. Hasilnya otomatis tersimpan di galeri dan bisa langsung dibagikan.$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 10, jsonb_build_object('text', $txt$Risiko dan Tindak Lanjut$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 11, jsonb_build_object('text', $txt$Hati-hati menangkap layar berisi data pribadi seperti nomor rekening atau kata sandi sebelum membagikan tangkapan layar ke orang lain; potong bagian sensitif jika perlu. Cobalah setiap metode di atas sekali untuk menemukan yang paling nyaman, lalu pasang Snipping Tool di taskbar atau gunakan gesture tiga jari di HP agar prosesnya makin cepat.$txt$));
END $do$;

-- TUT-KESEHATAN53-001: Batuk Berdahak: Cara Mengatasinya di Rumah
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, attribution_type, status, created_by, updated_by)
VALUES ('e1122041-15a1-4103-8e7c-fa5be20295d2', 'TUT-KESEHATAN53-001', 'b5555555-5555-5555-5555-555555555555', $body$Batuk Berdahak: Cara Mengatasinya di Rumah$body$, 'batuk-berdahak-atasi', $body$Panduan meredakan batuk berdahak di rumah: memahami penyebab, perawatan mandiri, tanda bahaya, dan kapan harus ke dokter.$body$, 'id', 6, 'DEVELOPED_BY', 'DRAFT', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;

DO $do$
DECLARE
  v_id uuid := 'e1122041-15a1-4103-8e7c-fa5be20295d2';
BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'TUT-KESEHATAN53-001';
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', $txt$Masalah: Batuk Berdahak yang Mengganggu$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 1, jsonb_build_object('text', $txt$Dada terasa sesak, dahak sulit keluar, dan batuk tak kunjung reda membuat sulit tidur dan beraktivitas. Banyak orang bingung: apakah cukup dengan perawatan rumahan atau sudah perlu ke dokter?$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', $txt$Penjelasan: Apa Itu Batuk Berdahak$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 3, jsonb_build_object('text', $txt$Batuk berdahak (batuk produktif) adalah respons alami tubuh untuk membersihkan saluran napas dari lendir. Umumnya disebabkan infeksi saluran napas seperti flu atau bronkitis ringan. Sebagian besar kasus membaik dalam 1-2 minggu dengan perawatan sederhana.$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 4, jsonb_build_object('text', $txt$Persiapan di Rumah$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'LIST', 5, to_jsonb(ARRAY[$txt$Air putih yang cukup$txt$, $txt$Madu untuk usia di atas 1 tahun$txt$, $txt$Humidifier atau baskom air hangat untuk uap$txt$, $txt$Obat batuk sesuai petunjuk jika perlu$txt$]));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 6, jsonb_build_object('text', $txt$Langkah 1: Encerkan Dahak dan Jaga Kelembapan$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 7, jsonb_build_object('text', $txt$Minum air hangat secara berkala untuk mengencerkan dahak agar lebih mudah dikeluarkan. Hirup uap air hangat dari baskom selama 10 menit untuk melembapkan saluran napas dan mengurangi iritasi tenggorokan.$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 8, jsonb_build_object('text', $txt$Langkah 2: Keluarkan Dahak dengan Efektif$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 9, jsonb_build_object('text', $txt$Duduk tegak, tarik napas dalam, lalu batuk dengan kuat dari dada (bukan dari tenggorokan) untuk mendorong dahak keluar; ulangi 2-3 kali. Hindari menahan batuk terus-menerus karena dahak yang menumpuk justru memperparah sumbatan. Istirahat yang cukup dan hindari asap rokok, debu, serta udara dingin yang bisa memperparah batuk.$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 10, jsonb_build_object('text', $txt$Risiko, Tanda Bahaya, dan Tindak Lanjut$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 11, jsonb_build_object('text', $txt$Segera ke dokter jika: dahak berwarna hijau pekat atau berdarah, demam tinggi lebih dari 3 hari, sesak napas, nyeri dada, atau batuk tidak membaik setelah 2 minggu; pada anak waspadai napas cepat dan lesu. Artikel ini hanya informasi umum, bukan pengganti nasihat medis — jika keluhan berlanjut atau Anda ragu, konsultasikan ke dokter atau fasilitas kesehatan terdekat.$txt$));
END $do$;

-- EXP-ANTROPOLOGI28-001: Suku Bajo: Manusia Laut yang Hidup di Atas Air
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, attribution_type, status, created_by, updated_by)
VALUES ('e112eaa0-13fb-44ed-9b89-72d5dfe2d07e', 'EXP-ANTROPOLOGI28-001', 'c8888888-8888-8888-8888-888888888888', $body$Suku Bajo: Manusia Laut yang Hidup di Atas Air$body$, 'suku-bajo-manusia-laut', $body$Mengenal Suku Bajo, komunitas pelaut Indonesia yang hidup di atas air dan terkenal dengan kemampuan menyelam luar biasa.$body$, 'id', 5, 'DEVELOPED_BY', 'DRAFT', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;

DO $do$
DECLARE
  v_id uuid := 'e112eaa0-13fb-44ed-9b89-72d5dfe2d07e';
BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-ANTROPOLOGI28-001';
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', $txt$Siapa Suku Bajo$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 1, jsonb_build_object('text', $txt$Suku Bajo (Bajau) adalah komunitas pelaut yang tersebar di pesisir Indonesia, Malaysia, dan Filipina. Di Indonesia, mereka banyak bermukim di Sulawesi, Nusa Tenggara, Kalimantan, dan Maluku. Mereka dijuluki manusia laut karena hampir seluruh hidupnya berkaitan dengan lautan.$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', $txt$Rumah di Atas Air$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 3, jsonb_build_object('text', $txt$Banyak masyarakat Bajo tinggal di rumah panggung di atas laut yang terhubung dengan jembatan kayu. Perahu adalah bagian tak terpisahkan dari kehidupan mereka: sebagai alat transportasi, tempat mencari nafkah, bahkan dulu sebagai tempat tinggal (perahu lepa).$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 4, jsonb_build_object('text', $txt$Penyelam Ulung$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 5, jsonb_build_object('text', $txt$Orang Bajo terkenal sebagai penyelam bebas yang luar biasa. Penelitian menunjukkan mereka bisa menyelam hingga kedalaman puluhan meter dan menahan napas lebih dari 10 menit. Kemampuan ini berkembang karena mereka menyelam sejak kecil untuk mencari ikan dan teripang.$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 6, jsonb_build_object('text', $txt$Adaptasi Tubuh yang Unik$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 7, jsonb_build_object('text', $txt$Studi ilmiah menemukan bahwa masyarakat Bajo memiliki limpa yang lebih besar dari rata-rata manusia. Limpa berfungsi sebagai cadangan sel darah merah beroksigen saat menyelam, sehingga mereka mampu bertahan lebih lama di bawah air. Ini contoh adaptasi manusia terhadap lingkungan.$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 8, jsonb_build_object('text', $txt$Budaya dan Kearifan Lokal$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 9, jsonb_build_object('text', $txt$Suku Bajo memiliki tradisi dan ritual laut, seperti upacara untuk keselamatan melaut. Mereka juga memegang kearifan menjaga laut: tidak menangkap ikan dengan bahan peledak dan menghormati kawasan tertentu sebagai daerah larangan tangkap agar ekosistem tetap lestari.$txt$));
END $do$;

-- EXP-KIMIA48-001: Kalium: Mineral Penting untuk Otot dan Jantung
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, attribution_type, status, created_by, updated_by)
VALUES ('e1128511-217c-4aa6-9c11-2f832e7693cc', 'EXP-KIMIA48-001', 'c4444444-4444-4444-4444-444444444444', $body$Kalium: Mineral Penting untuk Otot dan Jantung$body$, 'kalium-mineral-penting', $body$Mengenal kalium: unsur alkali penting bagi tubuh, sumber makanannya, serta peranannya dalam industri dan pertanian.$body$, 'id', 5, 'DEVELOPED_BY', 'DRAFT', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;

DO $do$
DECLARE
  v_id uuid := 'e1128511-217c-4aa6-9c11-2f832e7693cc';
BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-KIMIA48-001';
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', $txt$Apa Itu Kalium$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 1, jsonb_build_object('text', $txt$Kalium (simbol K, dari bahasa Latin kalium) adalah unsur kimia dengan nomor atom 19, termasuk golongan logam alkali. Dalam tubuh manusia, kalium adalah mineral penting yang berperan dalam fungsi otot, saraf, dan jantung.$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', $txt$Sifat Kimia Kalium$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 3, jsonb_build_object('text', $txt$Kalium adalah logam lunak berwarna keperakan yang sangat reaktif. Ia mudah bereaksi dengan air menghasilkan gas hidrogen, dan cepat teroksidasi di udara. Karena sangat reaktif, kalium murni disimpan dalam minyak mineral.$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 4, jsonb_build_object('text', $txt$Peran Kalium dalam Tubuh$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 5, jsonb_build_object('text', $txt$Kalium membantu menjaga keseimbangan cairan tubuh, mengatur tekanan darah, dan mendukung kontraksi otot termasuk otot jantung. Kekurangan kalium (hipokalemia) bisa menyebabkan kram otot, lemas, dan gangguan irama jantung.$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 6, jsonb_build_object('text', $txt$Sumber Kalium dari Makanan$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 7, jsonb_build_object('text', $txt$Kalium banyak terdapat pada pisang, kentang, bayam, alpukat, kacang-kacangan, dan ikan. Pola makan seimbang umumnya sudah mencukupi kebutuhan kalium harian orang dewasa.$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 8, jsonb_build_object('text', $txt$Kalium dalam Industri dan Pertanian$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 9, jsonb_build_object('text', $txt$Senyawa kalium seperti kalium klorida dipakai sebagai pupuk untuk meningkatkan hasil panen. Kalium hidroksida digunakan dalam pembuatan sabun dan baterai alkaline, sedangkan kalium nitrat dipakai dalam pupuk dan kembang api.$txt$));
END $do$;

-- SCH-SMP-SEJ13-001: IPS Kelas 8: Perang Dunia I dan II
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, attribution_type, status, created_by, updated_by)
VALUES ('e112a73f-b77c-4885-9404-51b947b4d746', 'SCH-SMP-SEJ13-001', 'd4444444-4444-4444-4444-444444444444', $body$IPS Kelas 8: Perang Dunia I dan II$body$, 'ips-kelas-8-perang-dunia', $body$Materi IPS kelas 8 tentang Perang Dunia I dan II: latar belakang, jalannya perang, dampak, dan kaitannya dengan kemerdekaan Indonesia.$body$, 'id', 8, 'DEVELOPED_BY', 'DRAFT', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;

DO $do$
DECLARE
  v_id uuid := 'e112a73f-b77c-4885-9404-51b947b4d746';
BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'SCH-SMP-SEJ13-001';
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', $txt$Tujuan Pembelajaran$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 1, jsonb_build_object('text', $txt$Setelah mempelajari materi ini, siswa diharapkan mampu: 1) menjelaskan latar belakang Perang Dunia I dan II, 2) mengidentifikasi negara-negara yang terlibat, 3) menganalisis dampak perang bagi dunia dan Indonesia.$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', $txt$Latar Belakang dan Blok Perang Dunia I$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 3, jsonb_build_object('text', $txt$Perang Dunia I (1914-1918) dipicu oleh persaingan antarnegara Eropa dalam memperebutkan koloni dan pengaruh, ditambah perlombaan senjata. Pemicu langsungnya adalah pembunuhan putra mahkota Austria-Hongaria, Franz Ferdinand, di Sarajevo pada 1914. Dua kubu yang bertikai: Blok Sentral (Jerman, Austria-Hongaria, Kesultanan Utsmaniyah) melawan Blok Sekutu (Inggris, Prancis, Rusia, kemudian Amerika Serikat); perang berakhir dengan kemenangan Blok Sekutu pada 1918.$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 4, jsonb_build_object('text', $txt$Latar Belakang dan Jalannya Perang Dunia II$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 5, jsonb_build_object('text', $txt$Perang Dunia II (1939-1945) berakar pada kekecewaan Jerman atas Perjanjian Versailles, krisis ekonomi dunia, dan bangkitnya fasisme; Jerman di bawah Hitler menyerbu Polandia pada 1 September 1939. Perang terjadi di dua front: Eropa (Jerman dan Italia melawan Sekutu) dan Asia-Pasifik (Jepang melawan Sekutu). Titik balik di Eropa terjadi setelah kekalahan Jerman di Stalingrad (1943), sedangkan di Pasifik setelah bom atom di Hiroshima dan Nagasaki (1945).$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 6, jsonb_build_object('text', $txt$Dampak Perang Dunia bagi Indonesia$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 7, jsonb_build_object('text', $txt$Pendudukan Jepang selama Perang Dunia II (1942-1945) justru mempercepat kesadaran nasional bangsa Indonesia. Jepang membentuk organisasi seperti BPUPKI yang kemudian menjadi jalan menuju proklamasi kemerdekaan 17 Agustus 1945.$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 8, jsonb_build_object('text', $txt$Latihan Soal$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'LIST', 9, to_jsonb(ARRAY[$txt$Jelaskan dua penyebab utama Perang Dunia I!$txt$, $txt$Sebutkan negara-negara Blok Sentral dan Blok Sekutu pada Perang Dunia II!$txt$, $txt$Bagaimana Perang Dunia II memengaruhi perjuangan kemerdekaan Indonesia?$txt$]));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 10, jsonb_build_object('text', $txt$Kunci Jawaban$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'LIST', 11, to_jsonb(ARRAY[$txt$Persaingan kolonialisme/imperialisme dan perlombaan senjata antarnegara Eropa; pemicu langsung: pembunuhan Franz Ferdinand$txt$, $txt$Blok Poros: Jerman, Italia, Jepang; Blok Sekutu: Inggris, Amerika Serikat, Uni Soviet, dan lainnya$txt$, $txt$Pendudukan Jepang menumbuhkan organisasi pergerakan dan BPUPKI yang membuka jalan ke proklamasi kemerdekaan$txt$]));
END $do$;

-- SCH-SD-MAT29-001: Matematika Kelas 1: Belajar Berhitung 1 sampai 20
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, attribution_type, status, created_by, updated_by)
VALUES ('e1120f45-d9a1-4a5c-9855-1fc9b75a426f', 'SCH-SD-MAT29-001', 'd3333333-3333-3333-3333-333333333333', $body$Matematika Kelas 1: Belajar Berhitung 1 sampai 20$body$, 'matematika-kelas-1-berhitung', $body$Materi matematika kelas 1 SD: mengenal angka 1-20, membilang, membandingkan, dan berhitung sederhana dengan cara yang menyenangkan.$body$, 'id', 6, 'DEVELOPED_BY', 'DRAFT', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;

DO $do$
DECLARE
  v_id uuid := 'e1120f45-d9a1-4a5c-9855-1fc9b75a426f';
BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'SCH-SD-MAT29-001';
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', $txt$Tujuan Pembelajaran$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 1, jsonb_build_object('text', $txt$Setelah belajar, adik-adik diharapkan bisa: 1) membilang angka 1 sampai 20 dengan benar, 2) menulis lambang bilangan, 3) membandingkan banyak benda, 4) menjumlah dan mengurang sederhana.$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', $txt$Mengenal Angka 1 sampai 20$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 3, jsonb_build_object('text', $txt$Mari berkenalan dengan angka! Satu, dua, tiga, empat, lima, enam, tujuh, delapan, sembilan, sepuluh. Lalu lanjutkan: sebelas, dua belas, tiga belas, empat belas, lima belas, enam belas, tujuh belas, delapan belas, sembilan belas, dua puluh.$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 4, jsonb_build_object('text', $txt$Membilang Benda$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 5, jsonb_build_object('text', $txt$Berhitung jadi seru dengan benda di sekitar kita. Coba hitung jarimu: ada 10 jari tangan! Hitung kelereng, pensil, atau permen satu per satu sambil menunjuk bendanya agar tidak ada yang terlewat.$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 6, jsonb_build_object('text', $txt$Membandingkan: Lebih Banyak atau Lebih Sedikit$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'LIST', 7, to_jsonb(ARRAY[$txt$5 apel lebih banyak dari 3 apel$txt$, $txt$2 kucing lebih sedikit dari 4 kucing$txt$, $txt$7 sama dengan 7, artinya sama banyak$txt$]));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 8, jsonb_build_object('text', $txt$Penjumlahan dan Pengurangan Sederhana$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 9, jsonb_build_object('text', $txt$Menjumlah artinya menggabungkan. Contoh: Ibu memberi 3 permen, ayah memberi 2 permen; jumlah semuanya: 3 + 2 = 5 permen. Mengurang artinya mengambil sebagian. Contoh: kamu punya 5 kelereng, diberikan 2 kepada teman; sisanya: 5 - 2 = 3 kelereng. Coba berlatih dengan jarimu!$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 10, jsonb_build_object('text', $txt$Latihan Soal dan Kunci Jawaban$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'LIST', 11, to_jsonb(ARRAY[$txt$Hitung ada berapa kursi di kelasmu! (minta guru memeriksa)$txt$, $txt$4 + 3 = 7$txt$, $txt$9 - 4 = 5$txt$, $txt$8 buku lebih banyak dari 6 buku$txt$]));
END $do$;
