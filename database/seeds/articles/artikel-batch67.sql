-- Batch 67 Madevi: 6 artikel (TUT x2, EXP x2, SCH x2)
-- Idempoten: ON CONFLICT DO NOTHING + hapus block lama sebelum insert
BEGIN;

DO $do$ BEGIN
  IF EXISTS (SELECT 1 FROM madevi.articles WHERE business_code = 'TUT-KOMPUTER14-001') THEN
    RAISE NOTICE 'skip TUT-KOMPUTER14-001 sudah ada';
  ELSE
    INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_name, creator_principal_id, access_level, is_indexed, status, attribution_type, version, is_test, created_by, updated_by)
    VALUES ('e6711111-1111-4111-8111-111111111111', 'TUT-KOMPUTER14-001', 'baaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', $$Google Sheets: Rumus Penting untuk Pemula$$, 'google-sheets-rumus-penting-pemula', $$Kuasai 5 rumus Google Sheets paling sering dipakai: SUM, AVERAGE, IF, COUNT, dan VLOOKUP dengan contoh nyata.$$, 'id', 8, 'Madevi', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'MEMBER', true, 'DRAFT', 'DEVELOPED_BY', 1, false, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a');
  END IF;
END $do$;

DO $do$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'TUT-KOMPUTER14-001';
  IF v_id IS NOT NULL THEN
    DELETE FROM madevi.article_blocks WHERE article_id = v_id;
    INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', $$Masalah: Takut Salah Hitung di Spreadsheet$$));
    INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 1, jsonb_build_object('text', $$Banyak orang mengandalkan kalkulator manual atau menghitung satu per satu di Google Sheets, padahal datanya ratusan baris. Hasilnya: lambat, capek, dan rawan salah hitung. Padahal dengan beberapa rumus sederhana, pekerjaan hitung-menghitung bisa selesai dalam hitungan detik.$$));
    INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', $$Penjelasan: Rumus Adalah Otak Spreadsheet$$));
    INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 3, jsonb_build_object('text', $$Rumus di Google Sheets selalu diawali tanda sama dengan (=), lalu nama fungsi dan argumen di dalam kurung, misalnya =SUM(A1:A10). Google Sheets menghitung otomatis dan memperbarui hasil setiap kali data berubah. Lima rumus di bawah ini mencakup hampir 80 persen kebutuhan sehari-hari: penjumlahan, rata-rata, hitung data, dan logika sederhana.$$));
    INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 4, jsonb_build_object('text', $$Alat yang Perlu Disiapkan$$));
    INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'LIST', 5, jsonb_build_object('items', ARRAY[$$Akun Google yang sudah login$$,$$Browser (Chrome, Edge, atau Firefox)$$,$$Satu file Google Sheets berisi contoh data, misalnya daftar belanja atau nilai siswa$$,$$Koneksi internet yang stabil$$]::text[]));
    INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 6, jsonb_build_object('text', $$Langkah: 5 Rumus Wajib Dikuasai$$));
    INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'LIST', 7, jsonb_build_object('items', ARRAY[$$SUM: =SUM(B2:B20) menjumlahkan semua angka di rentang B2 sampai B20.$$,$$AVERAGE: =AVERAGE(B2:B20) menghitung rata-rata, cocok untuk nilai atau pengeluaran.$$,$$COUNT: =COUNT(B2:B20) menghitung berapa sel berisi angka, berguna untuk rekap kehadiran.$$,$$IF: =IF(C2>=75;"Lulus";"Remedial") memberi keputusan otomatis berdasarkan syarat.$$,$$VLOOKUP: =VLOOKUP(A2;$E$2:$F$100;2;FALSE) mencari data di tabel lain berdasarkan kunci, misalnya nama barang ke harga.$$]::text[]));
    INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 8, jsonb_build_object('text', $$Risiko: Kesalahan Umum Pemula$$));
    INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'LIST', 9, jsonb_build_object('items', ARRAY[$$Lupa tanda = di awal sehingga rumus terbaca sebagai teks biasa.$$,$$Error #REF! karena menghapus baris/kolom yang dirujuk rumus.$$,$$VLOOKUP gagal karena kunci pencarian tidak ada di kolom pertama tabel.$$,$$Tanda $ (absolute reference) lupa dipakai sehingga rumus bergeser saat disalin ke bawah.$$]::text[]));
    INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 10, jsonb_build_object('text', $$Penyelesaian: Checklist Penguasaan$$));
    INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 11, jsonb_build_object('text', $$Anda sudah menguasai dasar Google Sheets jika bisa: menjumlahkan kolom dengan SUM, menghitung rata-rata dengan AVERAGE, memakai IF untuk keputusan otomatis, dan mencari data dengan VLOOKUP tanpa error. Latihan terbaik adalah memakai data nyata Anda sendiri, misalnya rekap pengeluaran bulanan.$$));
  END IF;
END $do$;

DO $do$ BEGIN
  IF EXISTS (SELECT 1 FROM madevi.articles WHERE business_code = 'TUT-KESEHATAN23-001') THEN
    RAISE NOTICE 'skip TUT-KESEHATAN23-001 sudah ada';
  ELSE
    INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_name, creator_principal_id, access_level, is_indexed, status, attribution_type, version, is_test, created_by, updated_by)
    VALUES ('e6722222-2222-4222-8222-222222222222', 'TUT-KESEHATAN23-001', 'b5555555-5555-5555-5555-555555555555', $$Bibir Pecah-pecah: Perawatan di Rumah$$, 'bibir-pecah-pecah-perawatan-rumah', $$Penyebab bibir pecah-pecah dan cara merawatnya di rumah dengan aman, plus tanda kapan harus ke dokter.$$, 'id', 6, 'Madevi', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'MEMBER', true, 'DRAFT', 'DEVELOPED_BY', 1, false, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a');
  END IF;
END $do$;

DO $do$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'TUT-KESEHATAN23-001';
  IF v_id IS NOT NULL THEN
    DELETE FROM madevi.article_blocks WHERE article_id = v_id;
    INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', $$Masalah: Bibir Kering, Perih, dan Mengelupas$$));
    INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 1, jsonb_build_object('text', $$Bibir pecah-pecah terasa perih saat makan, minum, bahkan tersenyum. Banyak orang tergoda mengelupas kulit bibir yang kering atau menjilat bibir terus-menerus, padahal kedua kebiasaan itu justru memperparah kondisi.$$));
    INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', $$Penjelasan: Mengapa Bibir Mudah Kering$$));
    INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 3, jsonb_build_object('text', $$Kulit bibir jauh lebih tipis daripada kulit wajah dan tidak memiliki kelenjar minyak sendiri, sehingga sangat bergantung pada kelembapan dari luar. Penyebab umum bibir pecah-pecah adalah cuaca panas atau ber-AC, kurang minum air, kebiasaan menjilat bibir, lipstik yang mengeringkan, dan kekurangan vitamin B.$$));
    INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 4, jsonb_build_object('text', $$Alat dan Bahan yang Perlu Disiapkan$$));
    INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'LIST', 5, jsonb_build_object('items', ARRAY[$$Lip balm tanpa pewangi (petroleum jelly atau yang mengandung shea butter)$$,$$Air putih yang cukup$$,$$Madu murni (opsional, sebagai pelembap alami)$$,$$Handuk bersih yang lembut$$]::text[]));
    INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 6, jsonb_build_object('text', $$Langkah: Merawat Bibir Pecah-pecah$$));
    INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'LIST', 7, jsonb_build_object('items', ARRAY[$$Berhenti menjilat atau mengelupas kulit bibir yang kering.$$,$$Kompres bibir dengan handuk hangat selama 2-3 menit untuk melunakkan kulit mati.$$,$$Oleskan lip balm atau petroleum jelly tipis-tipis, ulangi setiap beberapa jam.$$,$$Minum air putih yang cukup sepanjang hari, jangan menunggu haus.$$,$$Hindari lipstik matte atau produk bibir berpewangi selama bibir masih pecah-pecah.$$,$$Oleskan madu tipis sebelum tidur sebagai pelembap alami semalaman.$$]::text[]));
    INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 8, jsonb_build_object('text', $$Risiko: Kapan Harus ke Dokter$$));
    INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'LIST', 9, jsonb_build_object('items', ARRAY[$$Pecah-pecah tidak membaik setelah 2-3 minggu perawatan mandiri.$$,$$Ada luka dalam, berdarah terus, atau bengkak.$$,$$Muncul di sudut bibir terus-menerus (angular cheilitis) yang bisa menandakan infeksi jamur.$$,$$Disertai gejala lain seperti sariawan berat atau ruam.$$]::text[]));
    INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 10, jsonb_build_object('text', $$Penyelesaian: Bibir Sehat Kembali$$));
    INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 11, jsonb_build_object('text', $$Bibir pecah-pecah ringan umumnya membaik dalam beberapa hari dengan pelembap rutin dan cukup minum. Jadikan lip balm kebiasaan harian, terutama di ruangan ber-AC. Artikel ini bersifat informasi umum dan bukan pengganti nasihat medis; konsultasikan ke dokter jika keluhan berlanjut atau memburuk.$$));
  END IF;
END $do$;

DO $do$ BEGIN
  IF EXISTS (SELECT 1 FROM madevi.articles WHERE business_code = 'EXP-ANTROPOLOGI13-001') THEN
    RAISE NOTICE 'skip EXP-ANTROPOLOGI13-001 sudah ada';
  ELSE
    INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_name, creator_principal_id, access_level, is_indexed, status, attribution_type, version, is_test, created_by, updated_by)
    VALUES ('e6733333-3333-4333-8333-333333333333', 'EXP-ANTROPOLOGI13-001', 'c8888888-8888-8888-8888-888888888888', $$Suku Dayak: Tradisi Telingaan Panjang$$, 'suku-dayak-tradisi-telingaan-panjang', $$Mengenal tradisi telinga panjang suku Dayak di Kalimantan: makna, proses, dan nasibnya di zaman modern.$$, 'id', 7, 'Madevi', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'MEMBER', true, 'DRAFT', 'DEVELOPED_BY', 1, false, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a');
  END IF;
END $do$;

DO $do$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-ANTROPOLOGI13-001';
  IF v_id IS NOT NULL THEN
    DELETE FROM madevi.article_blocks WHERE article_id = v_id;
    INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', $$Telinga Panjang yang Ikonik$$));
    INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 1, jsonb_build_object('text', $$Salah satu citra paling dikenal dari suku Dayak di Kalimantan adalah telinga yang memanjang hingga ke bahu, dihiasi anting-anting berat dari emas atau kuningan. Tradisi ini terutama dipraktikkan oleh perempuan Dayak Kenyah, Dayak Kayan, dan Dayak Bahau di pedalaman Kalimantan.$$));
    INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', $$Makna di Balik Telinga Panjang$$));
    INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 3, jsonb_build_object('text', $$Bagi masyarakat Dayak, telinga panjang bukan sekadar hiasan. Ia adalah penanda identitas suku, status sosial, dan kecantikan. Semakin panjang telinga seorang perempuan, semakin dihormati ia di komunitasnya. Tradisi ini juga dipercaya sebagai cara membedakan manusia dengan hewan yang telinganya pendek.$$));
    INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 4, jsonb_build_object('text', $$Proses yang Panjang dan Bertahap$$));
    INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 5, jsonb_build_object('text', $$Telinga mulai dilubangi sejak anak perempuan masih kecil. Lubang kemudian diperbesar secara bertahap dengan anting-anting pemberat yang disebut hisang, terbuat dari kuningan atau perak. Berat hisang inilah yang perlahan menarik cuping telinga hingga memanjang ke bahu dalam waktu bertahun-tahun.$$));
    INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 6, jsonb_build_object('text', $$Tradisi yang Kian Langka$$));
    INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 7, jsonb_build_object('text', $$Kini tradisi telinga panjang hampir punah. Generasi muda Dayak umumnya tidak lagi memanjangkan telinga karena alasan praktis dan estetika modern. Para pemilik telinga panjang yang tersisa kini berusia lanjut. Beberapa komunitas dan pemerintah daerah berupaya mendokumentasikannya melalui museum dan festival budaya.$$));
    INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 8, jsonb_build_object('text', $$Pelajaran untuk Kita$$));
    INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 9, jsonb_build_object('text', $$Di balik bentuk fisiknya, tradisi telinga panjang mengajarkan kesabaran, ketekunan, dan kebanggaan pada identitas. Mengenalnya membantu kita menghargai keberagaman Indonesia yang luar biasa kaya, dan mengingatkan bahwa setiap budaya punya cara sendiri memaknai keindahan dan kehormatan.$$));
  END IF;
END $do$;

DO $do$ BEGIN
  IF EXISTS (SELECT 1 FROM madevi.articles WHERE business_code = 'EXP-FISIKA11-001') THEN
    RAISE NOTICE 'skip EXP-FISIKA11-001 sudah ada';
  ELSE
    INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_name, creator_principal_id, access_level, is_indexed, status, attribution_type, version, is_test, created_by, updated_by)
    VALUES ('e6744444-4444-4444-8444-444444444444', 'EXP-FISIKA11-001', 'c3333333-3333-3333-3333-333333333333', $$Listrik Statis: Fenomena Sehari-hari$$, 'listrik-statis-fenomena-sehari-hari', $$Mengapa rambut tertarik sisir plastik dan kita tersetrum gagang pintu? Penjelasan fisika listrik statis dalam kehidupan sehari-hari.$$, 'id', 7, 'Madevi', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'MEMBER', true, 'DRAFT', 'DEVELOPED_BY', 1, false, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a');
  END IF;
END $do$;

DO $do$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-FISIKA11-001';
  IF v_id IS NOT NULL THEN
    DELETE FROM madevi.article_blocks WHERE article_id = v_id;
    INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', $$Sengatan Kecil yang Misterius$$));
    INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 1, jsonb_build_object('text', $$Pernah tersetrum ringan saat menyentuh gagang pintu logam, atau melihat rambut tertarik mengikuti sisir plastik? Itu adalah listrik statis, salah satu fenomena fisika yang paling sering kita alami tanpa kita sadari.$$));
    INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', $$Apa Itu Listrik Statis$$));
    INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 3, jsonb_build_object('text', $$Listrik statis adalah ketidakseimbangan muatan listrik pada permukaan suatu benda. Ketika dua benda bergesekan, elektron bisa berpindah dari satu benda ke benda lain, menciptakan kelebihan muatan. Kaca dan rambut cenderung melepas elektron (menjadi positif), sedangkan plastik dan karet cenderung menangkap elektron (menjadi negatif) — inilah mengapa sisir plastik yang digosokkan ke rambut menarik rambut.$$));
    INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 4, jsonb_build_object('text', $$Contoh di Rumah$$));
    INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 5, jsonb_build_object('text', $$Contoh listrik statis ada di mana-mana: pakaian yang saling menempel setelah keluar dari mesin cuci, balon yang menempel di dinding setelah digosok ke rambut, dan percikan kecil saat menyentuh benda logam di ruangan ber-AC. Udara kering membuat muatan sulit mengalir pergi sehingga menumpuk di tubuh, lalu meloncat sekaligus saat menyentuh logam.$$));
    INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 6, jsonb_build_object('text', $$Petir: Listrik Statis Raksasa$$));
    INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 7, jsonb_build_object('text', $$Petir adalah versi raksasa dari fenomena yang sama. Di dalam awan badai, gesekan tetes air dan kristal es memisahkan muatan dalam skala besar. Ketika beda muatan antara awan dan tanah cukup besar, terjadi lompatan muatan raksasa yang kita lihat sebagai kilat.$$));
    INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 8, jsonb_build_object('text', $$Manfaat dan Eksperimen Sederhana$$));
    INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 9, jsonb_build_object('text', $$Prinsip listrik statis dipakai dalam pengecatan semprot mobil, penyaring udara elektrostatik, mesin fotokopi, dan printer laser. Coba eksperimen: gosokkan penggaris plastik ke rambut kering, lalu dekatkan ke potongan kertas kecil — kertas akan tertarik dan menempel. Di pom bensin, percikan statis bisa berbahaya sehingga ada aturan mematikan mesin saat mengisi bensin.$$));
  END IF;
END $do$;

DO $do$ BEGIN
  IF EXISTS (SELECT 1 FROM madevi.articles WHERE business_code = 'SCH-SMP-ING8-001') THEN
    RAISE NOTICE 'skip SCH-SMP-ING8-001 sudah ada';
  ELSE
    INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_name, creator_principal_id, access_level, is_indexed, status, attribution_type, version, is_test, created_by, updated_by)
    VALUES ('e6755555-5555-4555-8555-555555555555', 'SCH-SMP-ING8-001', 'd4444444-4444-4444-4444-444444444444', $$Bahasa Inggris Kelas 9: Narrative Text$$, 'bahasa-inggris-kelas-9-narrative-text', $$Memahami narrative text: pengertian, struktur, ciri kebahasaan, contoh cerita, latihan soal, dan kunci jawaban.$$, 'id', 10, 'Madevi', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'MEMBER', true, 'DRAFT', 'DEVELOPED_BY', 1, false, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a');
  END IF;
END $do$;

DO $do$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'SCH-SMP-ING8-001';
  IF v_id IS NOT NULL THEN
    DELETE FROM madevi.article_blocks WHERE article_id = v_id;
    INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', $$Tujuan Pembelajaran$$));
    INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 1, jsonb_build_object('text', $$Setelah mempelajari materi ini, siswa diharapkan mampu: mengidentifikasi pengertian dan tujuan narrative text, menyebutkan struktur generic structure-nya, mengenali ciri kebahasaan yang digunakan, serta menulis narrative text sederhana dengan benar.$$));
    INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', $$Pengertian dan Struktur Teks$$));
    INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 3, jsonb_build_object('text', $$Narrative text adalah teks yang menceritakan rangkaian peristiwa dengan tujuan menghibur pembaca (to entertain), misalnya dongeng, legenda, dan fabel. Strukturnya terdiri dari: orientation (pengenalan tokoh, tempat, waktu), complication (munculnya masalah atau konflik), dan resolution (penyelesaian masalah, bisa happy atau sad ending).$$));
    INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 4, jsonb_build_object('text', $$Ciri Kebahasaan (Language Features)$$));
    INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'LIST', 5, jsonb_build_object('items', ARRAY[$$Menggunakan past tense (simple past, past continuous, past perfect).$$,$$Menggunakan action verbs: ran, climbed, whispered, grabbed.$$,$$Menggunakan time connectives: once upon a time, one day, suddenly, finally.$$,$$Menggunakan kalimat langsung (direct speech) untuk dialog tokoh.$$]::text[]));
    INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 6, jsonb_build_object('text', $$Contoh Narrative Text Singkat$$));
    INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 7, jsonb_build_object('text', $$The Honest Woodcutter. Orientation: Once upon a time, there lived a poor woodcutter named Bimo near a forest. Complication: One day, his axe fell into the river. He cried because it was his only tool. Suddenly, a fairy appeared and offered him a golden axe, but Bimo refused. Resolution: The fairy was pleased with his honesty and gave him both axes. Moral: Honesty always brings good fortune.$$));
    INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 8, jsonb_build_object('text', $$Latihan Soal$$));
    INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'LIST', 9, jsonb_build_object('items', ARRAY[$$Sebutkan tiga bagian utama generic structure narrative text!$$,$$Apa perbedaan complication dan resolution?$$,$$Tuliskan lima contoh time connectives dalam narrative text!$$,$$Ubah ke past tense: 'She runs to the river every morning.'$$,$$Buatlah satu paragraf orientation tentang seorang nelayan!$$]::text[]));
    INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 10, jsonb_build_object('text', $$Kunci Jawaban$$));
    INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'LIST', 11, jsonb_build_object('items', ARRAY[$$Orientation, complication, resolution.$$,$$Complication adalah munculnya masalah/konflik, resolution adalah penyelesaiannya.$$,$$Contoh: once upon a time, one day, suddenly, then, finally.$$,$$She ran to the river every morning.$$,$$Contoh: Long time ago, there lived a fisherman named Pak Harun in a small village near the sea.$$]::text[]));
  END IF;
END $do$;

DO $do$ BEGIN
  IF EXISTS (SELECT 1 FROM madevi.articles WHERE business_code = 'SCH-SD-MAT17-001') THEN
    RAISE NOTICE 'skip SCH-SD-MAT17-001 sudah ada';
  ELSE
    INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_name, creator_principal_id, access_level, is_indexed, status, attribution_type, version, is_test, created_by, updated_by)
    VALUES ('e6766666-6666-4666-8666-666666666666', 'SCH-SD-MAT17-001', 'd3333333-3333-3333-3333-333333333333', $$Matematika Kelas 1: Penjumlahan$$, 'matematika-kelas-1-penjumlahan', $$Belajar penjumlahan untuk kelas 1 SD: pengertian, cara berhitung dengan jari dan gambar, latihan soal, dan kunci jawaban.$$, 'id', 8, 'Madevi', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'MEMBER', true, 'DRAFT', 'DEVELOPED_BY', 1, false, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a');
  END IF;
END $do$;

DO $do$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'SCH-SD-MAT17-001';
  IF v_id IS NOT NULL THEN
    DELETE FROM madevi.article_blocks WHERE article_id = v_id;
    INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', $$Tujuan Pembelajaran$$));
    INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 1, jsonb_build_object('text', $$Setelah belajar materi ini, adik-adik diharapkan bisa: memahami arti penjumlahan, menjumlahkan dua bilangan sampai 20, dan menyelesaikan soal cerita sederhana tentang penjumlahan.$$));
    INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', $$Apa Itu Penjumlahan?$$));
    INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 3, jsonb_build_object('text', $$Penjumlahan artinya menggabungkan dua kelompok benda menjadi satu kelompok yang lebih banyak. Misalnya, Ibu punya 3 apel, Ayah memberi 2 apel lagi. Sekarang apel Ibu ada 5. Tanda penjumlahan ditulis seperti ini: + dan dibaca tambah.$$));
    INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 4, jsonb_build_object('text', $$Berhitung dengan Jari dan Gambar$$));
    INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 5, jsonb_build_object('text', $$Cara termudah berhitung adalah dengan jari. Contoh: 4 + 3. Angkat 4 jari di tangan kiri, tambah 3 jari di tangan kanan, lalu hitung semua: 7. Kita juga bisa menggambar, misalnya 5 bintang ditambah 2 bintang, lalu hitung semuanya: 7.$$));
    INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 6, jsonb_build_object('text', $$Penjumlahan Sampai 20$$));
    INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 7, jsonb_build_object('text', $$Hafalkan pasangan bilangan yang jumlahnya 10: 1+9, 2+8, 3+7, 4+6, 5+5. Untuk bilangan sampai 20, pakai cara menyimpan di kepala. Contoh: 8 + 5. Simpan 8 di kepala, lanjutkan menghitung dengan jari: 9, 10, 11, 12, 13. Jadi 8 + 5 = 13.$$));
    INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 8, jsonb_build_object('text', $$Latihan Soal$$));
    INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'LIST', 9, jsonb_build_object('items', ARRAY[$$3 + 4 = ...$$,$$7 + 2 = ...$$,$$5 + 5 = ...$$,$$Siti punya 4 pensil, lalu membeli 3 pensil lagi. Berapa pensil Siti sekarang?$$,$$Di keranjang ada 8 mangga, Ibu menambah 6 mangga. Berapa mangga semuanya?$$]::text[]));
    INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 10, jsonb_build_object('text', $$Kunci Jawaban$$));
    INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'LIST', 11, jsonb_build_object('items', ARRAY[$$3 + 4 = 7$$,$$7 + 2 = 9$$,$$5 + 5 = 10$$,$$4 + 3 = 7 pensil$$,$$8 + 6 = 14 mangga$$]::text[]));
  END IF;
END $do$;

COMMIT;
