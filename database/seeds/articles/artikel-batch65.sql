-- Batch 65 Madevi: 6 artikel, 68 block (idempoten, re-runnable)
BEGIN;

-- TUT-BAHASA11-001: Bahasa Belanda: Dasar untuk Pemula
DO $do$
DECLARE v_id uuid;
BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'TUT-BAHASA11-001';
  IF v_id IS NULL THEN
    v_id := 'e6500001-0065-4001-8001-000000000001';
    INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_name, creator_principal_id, access_level, status, created_by, updated_by)
    VALUES (
      'e6500001-0065-4001-8001-000000000001',
      'TUT-BAHASA11-001',
      'b6666666-6666-6666-6666-666666666666',
      $txt$Bahasa Belanda: Dasar untuk Pemula$txt$,
      'tutorial-bahasa-belanda-dasar-untuk-pemula',
      $txt$Panduan belajar bahasa Belanda dari nol: alfabet, sapaan, angka, kata kerja dasar, dan jebakan kata serapan yang artinya berbeda.$txt$,
      'id',
      8,
      'Madevi',
      'f7125028-187e-44e0-b95b-88b69b8d5c9a',
      'MEMBER',
      'DRAFT',
      'f7125028-187e-44e0-b95b-88b69b8d5c9a',
      'f7125028-187e-44e0-b95b-88b69b8d5c9a'
    );
  END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
    (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', $txt$Bahasa Belanda: Dasar untuk Pemula$txt$)),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 1, jsonb_build_object('text', $txt$Banyak orang Indonesia merasa bahasa Belanda itu sulit, padahal kita sudah mengenal ratusan kata Belandanya tanpa sadar: kantor, bioskop, sepeda, handuk, sampai kulkas. Masalahnya, sebagian kata itu artinya sudah bergeser dari bahasa aslinya, dan tata bahasanya punya jebakan yang tidak ada di bahasa Indonesia. Artikel ini menuntunmu dari nol sampai bisa percakapan dasar.$txt$)),
    (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', $txt$Mengapa Belajar Bahasa Belanda?$txt$)),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 3, jsonb_build_object('text', $txt$Selama lebih dari tiga abad, bahasa Belanda meninggalkan jejak besar di Indonesia. Bahasa Indonesia menyerap ribuan kata dari bahasa Belanda, terutama di bidang hukum (advokat, vonis), administrasi (kantor, arsip), teknologi lama (bengkel, las), dan kehidupan sehari-hari (sepeda, wortel, handuk). Artinya kamu sudah punya modal awal tanpa menghafal dari nol. Selain itu, bahasa Belanda adalah pintu menuju literatur hukum Indonesia, arsip sejarah, dan peluang beasiswa di Belanda dan Belgia.$txt$)),
    (gen_random_uuid(), v_id, 'HEADING', 4, jsonb_build_object('text', $txt$Alat yang Perlu Disiapkan$txt$)),
    (gen_random_uuid(), v_id, 'LIST', 5, jsonb_build_object('items', jsonb_build_array($txt$Kamus online Belanda-Indonesia untuk mengecek arti kata dengan cepat$txt$, $txt$Aplikasi flashcard digital untuk latihan kosakata harian$txt$, $txt$Buku catatan khusus daftar kata serapan versus arti aslinya$txt$, $txt$Video percakapan dasar bahasa Belanda untuk melatih telinga$txt$, $txt$Teman latihan atau komunitas belajar bahasa Belanda daring$txt$))),
    (gen_random_uuid(), v_id, 'HEADING', 6, jsonb_build_object('text', $txt$Langkah Belajar dari Nol$txt$)),
    (gen_random_uuid(), v_id, 'LIST', 7, jsonb_build_object('items', jsonb_build_array($txt$Kuasai alfabet dan huruf G yang dilafalkan dari tenggorokan seperti berkumur, serta vokal gabungan EI, OU, dan UI.$txt$, $txt$Hafalkan sapaan dasar: Goedemorgen (selamat pagi), Hoe gaat het? (apa kabar?), Dank je wel (terima kasih), Tot ziens (sampai jumpa).$txt$, $txt$Kuasai angka 1-10: een, twee, drie, vier, vijf, zes, zeven, acht, negen, tien.$txt$, $txt$Hafalkan kata benda selalu bersama jenisnya: de man (laki-laki), het huis (rumah); de/het tidak bisa ditebak.$txt$, $txt$Latih pola kalimat subjek-kata kerja-objek: Ik drink water (Saya minum air).$txt$, $txt$Kuasai kata kerja beraturan: ik werk, jij werkt, wij werken (saya/kamu/kami bekerja).$txt$, $txt$Buat 10 kalimat sederhana setiap hari memakai kosakata yang sudah dipelajari.$txt$))),
    (gen_random_uuid(), v_id, 'HEADING', 8, jsonb_build_object('text', $txt$Risiko dan Kesalahan Umum$txt$)),
    (gen_random_uuid(), v_id, 'LIST', 9, jsonb_build_object('items', jsonb_build_array($txt$Teman palsu (valse vrienden): winkel artinya toko bukan bengkel kecil, spoor artinya rel kereta.$txt$, $txt$Menerjemahkan kata per kata dari Indonesia; urutan kata dalam kalimat tanya berbeda.$txt$, $txt$Pengucapan G yang salah membuat penutur asli sulit memahami; latih sejak awal.$txt$, $txt$Menghafal kata benda tanpa de/het-nya akan menyulitkan selamanya.$txt$))),
    (gen_random_uuid(), v_id, 'HEADING', 10, jsonb_build_object('text', $txt$Penyelesaian: Checklist 30 Hari$txt$)),
    (gen_random_uuid(), v_id, 'LIST', 11, jsonb_build_object('items', jsonb_build_array($txt$Hari 1-7: hafal alfabet, vokal gabungan, dan 20 sapaan dasar.$txt$, $txt$Hari 8-14: kuasai angka 1-100 dan 30 kata benda beserta de/het-nya.$txt$, $txt$Hari 15-21: pelajari 20 kata kerja beraturan dan tulis 10 kalimat per hari.$txt$, $txt$Hari 22-30: latihan percakapan pendek tentang perkenalan, arah, dan memesan makanan.$txt$, $txt$Target akhir: mampu bercakap-cakap dasar selama 3 menit tanpa teks.$txt$)));
END $do$;

-- TUT-KESEHATAN22-001: Luka Bakar Ringan: Pertolongan Pertama di Rumah
DO $do$
DECLARE v_id uuid;
BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'TUT-KESEHATAN22-001';
  IF v_id IS NULL THEN
    v_id := 'e6500002-0065-4001-8001-000000000002';
    INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_name, creator_principal_id, access_level, status, created_by, updated_by)
    VALUES (
      'e6500002-0065-4001-8001-000000000002',
      'TUT-KESEHATAN22-001',
      'b5555555-5555-5555-5555-555555555555',
      $txt$Luka Bakar Ringan: Pertolongan Pertama di Rumah$txt$,
      'tutorial-luka-bakar-ringan-pertolongan-pertama',
      $txt$Cara menangani luka bakar ringan di rumah dengan benar: pendinginan, perawatan luka, dan tanda bahaya yang mewajibkan ke dokter.$txt$,
      'id',
      7,
      'Madevi',
      'f7125028-187e-44e0-b95b-88b69b8d5c9a',
      'MEMBER',
      'DRAFT',
      'f7125028-187e-44e0-b95b-88b69b8d5c9a',
      'f7125028-187e-44e0-b95b-88b69b8d5c9a'
    );
  END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
    (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', $txt$Luka Bakar Ringan: Pertolongan Pertama di Rumah$txt$)),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 1, jsonb_build_object('text', $txt$Percikan minyak panas, tersentuh knalpot, atau menyentuh panci tanpa sarung tangan adalah kejadian sehari-hari. Kebanyakan kasus adalah luka bakar ringan (derajat satu) yang bisa ditangani di rumah. Namun penanganan yang salah, seperti mengolesi pasta gigi atau kecap, justru memperparah luka dan menimbulkan infeksi. Artikel ini bersifat informasi umum dan bukan pengganti nasihat medis; bila ragu, konsultasikan ke dokter.$txt$)),
    (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', $txt$Kenali Tingkat Luka Bakar$txt$)),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 3, jsonb_build_object('text', $txt$Luka bakar derajat satu hanya mengenai lapisan kulit terluar: kulit kemerahan dan perih tanpa lepuh, misalnya tersengat matahari ringan. Derajat dua menimbulkan lepuh berisi cairan dan nyeri hebat. Derajat tiga merusak seluruh lapisan kulit hingga tampak putih atau menghitam dan bisa tidak terasa nyeri karena saraf rusak. Panduan ini hanya untuk derajat satu dan lepuh kecil derajat dua. Luka bakar luas, di wajah, tangan, kaki, sendi, atau area genital harus ke fasilitas kesehatan.$txt$)),
    (gen_random_uuid(), v_id, 'HEADING', 4, jsonb_build_object('text', $txt$Alat Pertolongan yang Perlu Disiapkan$txt$)),
    (gen_random_uuid(), v_id, 'LIST', 5, jsonb_build_object('items', jsonb_build_array($txt$Air mengalir bersih bersuhu ruangan, bukan air es$txt$, $txt$Kain kasa steril dan plester luka$txt$, $txt$Salep luka bakar ringan atau pelembap tanpa pewangi sesuai anjuran apoteker$txt$, $txt$Obat pereda nyeri yang dijual bebas bila diperlukan$txt$, $txt$Sabun lembut untuk mencuci tangan sebelum merawat luka$txt$))),
    (gen_random_uuid(), v_id, 'HEADING', 6, jsonb_build_object('text', $txt$Langkah Pertolongan Pertama$txt$)),
    (gen_random_uuid(), v_id, 'LIST', 7, jsonb_build_object('items', jsonb_build_array($txt$Jauhkan sumber panas, lalu dinginkan luka di bawah air mengalir bersuhu ruangan selama 10-20 menit.$txt$, $txt$Lepaskan perhiasan atau pakaian di sekitar luka sebelum area membengkak, kecuali kain yang menempel.$txt$, $txt$Jangan memecahkan lepuh; lepuh adalah pelindung alami dari infeksi.$txt$, $txt$Oleskan tipis pelembap atau salep, lalu tutup longgar dengan kasa steril bila bergesekan dengan pakaian.$txt$, $txt$Ganti balutan 1-2 kali sehari dan jaga luka tetap bersih dan kering.$txt$))),
    (gen_random_uuid(), v_id, 'HEADING', 8, jsonb_build_object('text', $txt$Risiko dan Kesalahan Umum$txt$)),
    (gen_random_uuid(), v_id, 'LIST', 9, jsonb_build_object('items', jsonb_build_array($txt$Mengoleskan pasta gigi, kecap, mentega, minyak, atau putih telur ke luka.$txt$, $txt$Mendinginkan dengan es batu atau air es secara langsung ke kulit.$txt$, $txt$Memecahkan lepuh dengan tangan kotor sehingga terjadi infeksi.$txt$, $txt$Menutup luka terlalu rapat hingga lembap dan menjadi sarang kuman.$txt$, $txt$Mengabaikan tanda infeksi: nanah, bau tidak sedap, nyeri bertambah, atau demam.$txt$))),
    (gen_random_uuid(), v_id, 'HEADING', 10, jsonb_build_object('text', $txt$Kapan Harus ke Dokter dan Pencegahan$txt$)),
    (gen_random_uuid(), v_id, 'LIST', 11, jsonb_build_object('items', jsonb_build_array($txt$Luka lebih luas dari telapak tangan, melingkar di jari, atau di wajah, sendi, dan area genital.$txt$, $txt$Lepuh besar, kulit tampak putih atau menghitam, atau tidak terasa nyeri sama sekali.$txt$, $txt$Tanda infeksi, korban bayi, lansia, atau penderita diabetes.$txt$, $txt$Luka bakar akibat listrik, bahan kimia, atau ledakan gas.$txt$, $txt$Pencegahan: gunakan sarung tangan oven, jauhkan gagang panci dari tepi kompor, awasi anak di dapur.$txt$, $txt$Lindungi area yang sembuh dari sinar matahari langsung selama beberapa minggu.$txt$)));
END $do$;

-- EXP-GEOGRAFI11-001: Pulau Terbesar di Dunia: Dari Greenland hingga Papua
DO $do$
DECLARE v_id uuid;
BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-GEOGRAFI11-001';
  IF v_id IS NULL THEN
    v_id := 'e6500003-0065-4001-8001-000000000003';
    INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_name, creator_principal_id, access_level, status, created_by, updated_by)
    VALUES (
      'e6500003-0065-4001-8001-000000000003',
      'EXP-GEOGRAFI11-001',
      'c6000001-0000-0000-0000-000000000001',
      $txt$Pulau Terbesar di Dunia: Dari Greenland hingga Papua$txt$,
      'eksplorasi-pulau-terbesar-di-dunia',
      $txt$Mengenal pulau-pulau terbesar di dunia: mengapa Australia bukan pulau, keunikan Greenland, dan posisi Papua di peta dunia.$txt$,
      'id',
      6,
      'Madevi',
      'f7125028-187e-44e0-b95b-88b69b8d5c9a',
      'MEMBER',
      'DRAFT',
      'f7125028-187e-44e0-b95b-88b69b8d5c9a',
      'f7125028-187e-44e0-b95b-88b69b8d5c9a'
    );
  END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
    (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', $txt$Pulau Terbesar di Dunia: Dari Greenland hingga Papua$txt$)),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 1, jsonb_build_object('text', $txt$Ketika ditanya pulau terbesar di dunia, banyak orang menjawab Australia. Jawaban yang benar adalah Greenland. Australia tidak dihitung sebagai pulau melainkan sebagai benua terkecil. Perbedaan antara pulau dan benua menjadi kunci memahami daftar pulau terbesar di planet ini.$txt$)),
    (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', $txt$Mengapa Australia Bukan Pulau?$txt$)),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 3, jsonb_build_object('text', $txt$Secara definisi, pulau adalah daratan yang dikelilingi air dan lebih kecil dari benua. Australia dianggap benua karena memiliki lempeng tektonik sendiri, keanekaragaman geologi khas benua, dan luasnya jauh melampaui pulau mana pun. Greenland yang luasnya sekitar 2,16 juta kilometer persegi menjadi pulau terbesar dunia karena tidak memenuhi kriteria benua.$txt$)),
    (gen_random_uuid(), v_id, 'HEADING', 4, jsonb_build_object('text', $txt$Greenland: Raksasa Es di Utara$txt$)),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 5, jsonb_build_object('text', $txt$Greenland terletak di antara Samudra Arktik dan Atlantik; sebagian besar wilayahnya tertutup lapisan es setebal rata-rata 1,5 kilometer yang menyimpan sekitar 10 persen air tawar dunia. Penduduknya hanya sekitar 56 ribu jiwa, sebagian besar suku Inuit. Sebagai wilayah otonom Denmark, Greenland menjadi sorotan dunia karena pencairan esnya berkaitan langsung dengan kenaikan permukaan laut global.$txt$)),
    (gen_random_uuid(), v_id, 'HEADING', 6, jsonb_build_object('text', $txt$Pulau-pulau Raksasa Nusantara$txt$)),
    (gen_random_uuid(), v_id, 'LIST', 7, jsonb_build_object('items', jsonb_build_array($txt$Papua (New Guinea), sekitar 785 ribu km persegi, adalah pulau terbesar kedua dunia; terbagi antara Indonesia dan Papua Nugini, dengan Puncak Jaya sebagai satu-satunya gletser tropis Indonesia.$txt$, $txt$Kalimantan (Borneo), sekitar 743 ribu km persegi, adalah pulau terbesar ketiga dunia; hutannya termasuk tertua di dunia dan rumah orangutan.$txt$, $txt$Sumatra adalah pulau terbesar keenam dunia; terkenal dengan Danau Toba, danau vulkanik terbesar di dunia.$txt$, $txt$Indonesia memiliki tiga pulau dalam daftar sepuluh besar dunia, sebuah alasan untuk bangga sekaligus bertanggung jawab menjaganya.$txt$))),
    (gen_random_uuid(), v_id, 'HEADING', 8, jsonb_build_object('text', $txt$Ancaman dan Tanggung Jawab$txt$)),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 9, jsonb_build_object('text', $txt$Pulau-pulau besar menghadapi ancaman serius: pencairan es di Greenland menaikkan permukaan laut, deforestasi di Kalimantan dan Papua mengancam paru-paru dunia, dan perubahan iklim mengubah pola cuaca di kawasan tropis. Fakta menarik: Madagaskar, pulau terbesar keempat, terpisah dari Afrika sekitar 88 juta tahun lalu sehingga 90 persen satwanya endemik. Dari Greenland yang membeku hingga Papua yang hijau, pulau-pulau terbesar dunia adalah laboratorium alam yang menunjukkan betapa beragamnya planet kita, dan melindunginya berarti melindungi jutaan manusia yang bergantung padanya.$txt$));
END $do$;

-- EXP-TEKNOLOGI13-001: Realitas Virtual: Dunia Digital yang Bisa Dimasuki
DO $do$
DECLARE v_id uuid;
BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-TEKNOLOGI13-001';
  IF v_id IS NULL THEN
    v_id := 'e6500004-0065-4001-8001-000000000004';
    INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_name, creator_principal_id, access_level, status, created_by, updated_by)
    VALUES (
      'e6500004-0065-4001-8001-000000000004',
      'EXP-TEKNOLOGI13-001',
      'c7777777-7777-7777-7777-777777777777',
      $txt$Realitas Virtual: Dunia Digital yang Bisa Dimasuki$txt$,
      'eksplorasi-realitas-virtual-dunia-digital',
      $txt$Memahami teknologi realitas virtual: cara kerja headset VR, perbedaan VR-AR-MR, dan penerapannya di pendidikan hingga industri.$txt$,
      'id',
      6,
      'Madevi',
      'f7125028-187e-44e0-b95b-88b69b8d5c9a',
      'MEMBER',
      'DRAFT',
      'f7125028-187e-44e0-b95b-88b69b8d5c9a',
      'f7125028-187e-44e0-b95b-88b69b8d5c9a'
    );
  END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
    (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', $txt$Realitas Virtual: Dunia Digital yang Bisa Dimasuki$txt$)),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 1, jsonb_build_object('text', $txt$Bayangkan berdiri di puncak Menara Eiffel padahal kakimu menginjak lantai kamarmu. Itulah janji realitas virtual (virtual reality/VR): teknologi yang menggantikan dunia nyata di depan matamu dengan dunia digital tiga dimensi yang bisa dijelajahi. Dalam satu dekade terakhir, VR berubah dari mainan mahal menjadi alat serius di pendidikan, kedokteran, dan industri.$txt$)),
    (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', $txt$Cara Kerja Headset VR$txt$)),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 3, jsonb_build_object('text', $txt$Headset VR menempatkan layar kecil di depan setiap mata yang menampilkan gambar sedikit berbeda, meniru cara kedua mata manusia melihat dunia (stereoskopis). Sensor gerak melacak perputaran kepalamu sehingga saat menoleh, pandangan virtual ikut berubah real-time. Refresh rate tinggi, 90 Hz ke atas, penting agar otak tidak merasakan jeda yang menimbulkan pusing.$txt$)),
    (gen_random_uuid(), v_id, 'HEADING', 4, jsonb_build_object('text', $txt$VR vs AR vs MR$txt$)),
    (gen_random_uuid(), v_id, 'LIST', 5, jsonb_build_object('items', jsonb_build_array($txt$VR (Virtual Reality): sepenuhnya menggantikan pandangan dengan dunia digital, misalnya tur virtual museum.$txt$, $txt$AR (Augmented Reality): menambahkan objek digital di atas dunia nyata, misalnya filter wajah dan penunjuk arah di kamera HP.$txt$, $txt$MR (Mixed Reality): objek digital berinteraksi dengan dunia nyata secara real-time, misalnya furnitur virtual yang tetap di tempatnya.$txt$, $txt$XR (Extended Reality): istilah payung untuk ketiganya.$txt$))),
    (gen_random_uuid(), v_id, 'HEADING', 6, jsonb_build_object('text', $txt$Penerapan di Dunia Nyata$txt$)),
    (gen_random_uuid(), v_id, 'LIST', 7, jsonb_build_object('items', jsonb_build_array($txt$Pendidikan: siswa membedah katak virtual, berjalan di dalam sel raksasa, atau menyaksikan letusan gunung dari jarak aman.$txt$, $txt$Kedokteran: calon dokter berlatih operasi di VR sebelum menyentuh pasien sungguhan; terapi fobia memakai paparan bertahap yang terkendali.$txt$, $txt$Industri: arsitek memandu klien di gedung yang belum dibangun; teknisi berlatih merakit mesin berbahaya dengan aman.$txt$, $txt$Hiburan: game dan film imersif yang menempatkan penonton di tengah cerita.$txt$))),
    (gen_random_uuid(), v_id, 'HEADING', 8, jsonb_build_object('text', $txt$Tantangan dan Tips Aman$txt$)),
    (gen_random_uuid(), v_id, 'LIST', 9, jsonb_build_object('items', jsonb_build_array($txt$Motion sickness, rasa pusing karena konflik sinyal mata dan telinga bagian dalam; atasi dengan frame rate tinggi dan sesi singkat bagi pemula.$txt$, $txt$Harga perangkat dan kebutuhan komputer yang kuat, meski headset mandiri kini semakin terjangkau.$txt$, $txt$Bersihkan area bermain dari furnitur dan benda tajam sebelum memakai headset.$txt$, $txt$Berhenti bila pusing atau mual, dan istirahatkan mata setiap 30 menit.$txt$, $txt$Anak di bawah usia anjuran produsen sebaiknya didampingi orang tua.$txt$)));
END $do$;

-- SCH-SMP-MAT8-001: Matematika Kelas 9: Peluang
DO $do$
DECLARE v_id uuid;
BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'SCH-SMP-MAT8-001';
  IF v_id IS NULL THEN
    v_id := 'e6500005-0065-4001-8001-000000000005';
    INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_name, creator_principal_id, access_level, status, created_by, updated_by)
    VALUES (
      'e6500005-0065-4001-8001-000000000005',
      'SCH-SMP-MAT8-001',
      'd4444444-4444-4444-4444-444444444444',
      $txt$Matematika Kelas 9: Peluang$txt$,
      'matematika-kelas-9-peluang',
      $txt$Materi peluang kelas 9 SMP: ruang sampel, titik sampel, peluang teoretis dan empiris, frekuensi harapan, beserta latihan dan kunci jawaban.$txt$,
      'id',
      7,
      'Madevi',
      'f7125028-187e-44e0-b95b-88b69b8d5c9a',
      'MEMBER',
      'DRAFT',
      'f7125028-187e-44e0-b95b-88b69b8d5c9a',
      'f7125028-187e-44e0-b95b-88b69b8d5c9a'
    );
  END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
    (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', $txt$Matematika Kelas 9: Peluang$txt$)),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 1, jsonb_build_object('text', $txt$Tujuan pembelajaran: setelah mempelajari materi ini, kamu diharapkan mampu menentukan ruang sampel dan titik sampel suatu percobaan, menghitung peluang teoretis dan empiris suatu kejadian, serta menentukan frekuensi harapan dari suatu percobaan.$txt$)),
    (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', $txt$Ruang Sampel dan Titik Sampel$txt$)),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 3, jsonb_build_object('text', $txt$Percobaan adalah kegiatan yang hasilnya tidak dapat dipastikan sebelumnya, misalnya melempar koin atau dadu. Titik sampel adalah setiap hasil yang mungkin, sedangkan ruang sampel (S) adalah himpunan semua titik sampel. Contoh: pada pelemparan sebuah dadu, ruang sampelnya S = {1, 2, 3, 4, 5, 6} sehingga n(S) = 6.$txt$)),
    (gen_random_uuid(), v_id, 'HEADING', 4, jsonb_build_object('text', $txt$Peluang Teoretis$txt$)),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 5, jsonb_build_object('text', $txt$Peluang teoretis kejadian A dirumuskan P(A) = n(A) / n(S). Nilai peluang selalu antara 0 dan 1; 0 berarti mustahil, 1 berarti pasti terjadi. Contoh: peluang muncul mata dadu 4 adalah 1/6 karena hanya ada satu sisi bermata 4 dari enam sisi.$txt$)),
    (gen_random_uuid(), v_id, 'HEADING', 6, jsonb_build_object('text', $txt$Contoh Soal Terpecahkan$txt$)),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 7, jsonb_build_object('text', $txt$Soal 1: Sebuah kotak berisi 5 bola merah dan 3 bola biru. Sebuah bola diambil acak. Tentukan peluang terambil bola merah. Penyelesaian: n(S) = 8, n(merah) = 5, maka P = 5/8. Soal 2: Dua koin dilempar bersamaan. Tentukan peluang muncul tepat satu gambar. Penyelesaian: S = {AA, AG, GA, GG}, n(S) = 4; kejadian tepat satu gambar = {AG, GA} sehingga P = 2/4 = 1/2.$txt$)),
    (gen_random_uuid(), v_id, 'HEADING', 8, jsonb_build_object('text', $txt$Peluang Empiris dan Frekuensi Harapan$txt$)),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 9, jsonb_build_object('text', $txt$Peluang empiris dihitung dari hasil percobaan nyata: banyak kejadian muncul dibagi banyak percobaan. Semakin banyak percobaan, peluang empiris semakin mendekati peluang teoretis. Frekuensi harapan memprediksi banyak kejadian dari sejumlah percobaan: Fh = P(A) x banyak percobaan. Contoh: dadu dilempar 60 kali, frekuensi harapan muncul mata 5 adalah 1/6 x 60 = 10 kali.$txt$)),
    (gen_random_uuid(), v_id, 'HEADING', 10, jsonb_build_object('text', $txt$Latihan dan Kunci Jawaban$txt$)),
    (gen_random_uuid(), v_id, 'LIST', 11, jsonb_build_object('items', jsonb_build_array($txt$Soal 1: Sebuah dadu dilempar sekali. Tentukan peluang muncul mata dadu bilangan prima. Jawaban: {2, 3, 5} sehingga P = 3/6 = 1/2.$txt$, $txt$Soal 2: Dalam kantong ada 4 kelereng hijau dan 6 kelereng kuning. Diambil satu kelereng acak. Tentukan peluang terambil kelereng kuning. Jawaban: P = 6/10 = 3/5.$txt$, $txt$Soal 3: Tiga keping uang logam dilempar bersamaan. Tentukan peluang muncul dua angka satu gambar. Jawaban: ruang sampel 8 kemungkinan, kejadian yang memenuhi ada 3, maka P = 3/8.$txt$)));
END $do$;

-- SCH-SD-BIN11-001: Bahasa Indonesia Kelas 2: Mengenal Kalimat
DO $do$
DECLARE v_id uuid;
BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'SCH-SD-BIN11-001';
  IF v_id IS NULL THEN
    v_id := 'e6500006-0065-4001-8001-000000000006';
    INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_name, creator_principal_id, access_level, status, created_by, updated_by)
    VALUES (
      'e6500006-0065-4001-8001-000000000006',
      'SCH-SD-BIN11-001',
      'd3333333-3333-3333-3333-333333333333',
      $txt$Bahasa Indonesia Kelas 2: Mengenal Kalimat$txt$,
      'bahasa-indonesia-kelas-2-kalimat',
      $txt$Materi kalimat untuk kelas 2 SD: pengertian kalimat, huruf kapital dan tanda titik, jenis kalimat, beserta latihan dan kunci jawaban.$txt$,
      'id',
      6,
      'Madevi',
      'f7125028-187e-44e0-b95b-88b69b8d5c9a',
      'MEMBER',
      'DRAFT',
      'f7125028-187e-44e0-b95b-88b69b8d5c9a',
      'f7125028-187e-44e0-b95b-88b69b8d5c9a'
    );
  END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
    (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', $txt$Bahasa Indonesia Kelas 2: Mengenal Kalimat$txt$)),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 1, jsonb_build_object('text', $txt$Tujuan pembelajaran: setelah belajar materi ini, kamu dapat menjelaskan apa itu kalimat, menulis kalimat dengan huruf kapital dan tanda titik yang benar, serta membedakan kalimat berita, kalimat tanya, dan kalimat perintah.$txt$)),
    (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', $txt$Apa Itu Kalimat?$txt$)),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 3, jsonb_build_object('text', $txt$Kalimat adalah kumpulan kata yang memiliki arti lengkap. Contohnya: Ibu memasak nasi. Kalimat ini punya arti yang jelas. Bandingkan dengan susunan memasak nasi ibu yang terbalik sehingga membingungkan. Syarat kalimat yang baik: susunan katanya tepat, diawali huruf kapital, dan diakhiri tanda baca yang sesuai.$txt$)),
    (gen_random_uuid(), v_id, 'HEADING', 4, jsonb_build_object('text', $txt$Huruf Kapital dan Tanda Baca$txt$)),
    (gen_random_uuid(), v_id, 'LIST', 5, jsonb_build_object('items', jsonb_build_array($txt$Huruf pertama kalimat selalu huruf kapital. Contoh: Ayah membaca koran.$txt$, $txt$Nama orang, nama hari, dan nama bulan diawali huruf kapital. Contoh: Budi, Senin, Januari.$txt$, $txt$Kalimat berita diakhiri tanda titik. Contoh: Kucing itu lucu.$txt$, $txt$Kalimat tanya diakhiri tanda tanya. Contoh: Di mana tasmu?$txt$, $txt$Kalimat perintah atau seruan diakhiri tanda seru. Contoh: Tutup pintunya!$txt$))),
    (gen_random_uuid(), v_id, 'HEADING', 6, jsonb_build_object('text', $txt$Tiga Jenis Kalimat$txt$)),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 7, jsonb_build_object('text', $txt$Kalimat berita memberitahukan sesuatu, misalnya: Hari ini hujan. Kalimat tanya menanyakan sesuatu, misalnya: Kapan kamu pulang? Kalimat perintah menyuruh atau meminta, misalnya: Ambilkan bukuku! Perhatikan tanda baca di akhir setiap jenis kalimat karena itulah pembedanya.$txt$)),
    (gen_random_uuid(), v_id, 'HEADING', 8, jsonb_build_object('text', $txt$Contoh Menyusun Kalimat$txt$)),
    (gen_random_uuid(), v_id, 'LIST', 9, jsonb_build_object('items', jsonb_build_array($txt$Kata acak sekolah - pergi - ke - Sinta menjadi: Sinta pergi ke sekolah.$txt$, $txt$Kata acak bola - menendang - Andi menjadi: Andi menendang bola.$txt$, $txt$Ubah menjadi kalimat tanya: Kamu suka apel menjadi Apakah kamu suka apel?$txt$, $txt$Ubah menjadi kalimat perintah: Kamu duduk di sini menjadi Duduklah di sini!$txt$))),
    (gen_random_uuid(), v_id, 'HEADING', 10, jsonb_build_object('text', $txt$Latihan dan Kunci Jawaban$txt$)),
    (gen_random_uuid(), v_id, 'LIST', 11, jsonb_build_object('items', jsonb_build_array($txt$Soal 1: Susun kata-kata berikut menjadi kalimat yang benar: membaca - buku - Dita. Jawaban: Dita membaca buku.$txt$, $txt$Soal 2: Perbaiki kalimat ini dengan huruf kapital dan tanda baca yang tepat: ibu pergi ke pasar. Jawaban: Ibu pergi ke pasar.$txt$, $txt$Soal 3: Buatlah satu kalimat tanya tentang hewan kesukaanmu! Jawaban contoh: Apa hewan kesukaanmu?$txt$)));
END $do$;

COMMIT;
