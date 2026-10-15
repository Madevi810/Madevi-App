-- Batch 115: 6 artikel (12/12/10/10/12/12 block), idempoten
-- Dibuat: 2026-10-13

-- TUT-KOMPUTER30-001
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, created_by, updated_by, attribution_type, status)
VALUES ('e11508b8-b783-4049-96e1-63bd8e81d376', 'TUT-KOMPUTER30-001', 'baaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', $txt$Keyboard Shortcut: Bekerja Lebih Cepat Tanpa Mouse$txt$, 'keyboard-shortcut-kerja-cepat', $txt$Panduan praktis menguasai keyboard shortcut Windows, browser, dan aplikasi agar bekerja dua kali lebih cepat.$txt$, 'id', 8, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DEVELOPED_BY', 'DRAFT')
ON CONFLICT (business_code) DO NOTHING;

DO $doblk$
DECLARE v_id uuid;
BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'TUT-KOMPUTER30-001';
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
      (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', $txt$Masalah: Semua Pekerjaan Terasa Lambat karena Terlalu Bergantung pada Mouse$txt$)),
      (gen_random_uuid(), v_id, 'PARAGRAPH', 1, jsonb_build_object('text', $txt$Banyak pengguna komputer menghabiskan waktu berulang untuk hal sepele: mencari menu, mengklik ikon, atau membuka jendela baru. Setiap klik memang hanya memakan satu detik, tetapi dalam sehari kerja, ratusan klik kecil itu menumpuk menjadi puluhan menit yang hilang. Solusinya bukan komputer yang lebih cepat, melainkan cara kerja yang lebih cepat: keyboard shortcut.$txt$)),
      (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', $txt$Mengapa Shortcut Begitu Efektif$txt$)),
      (gen_random_uuid(), v_id, 'PARAGRAPH', 3, jsonb_build_object('text', $txt$Tangan tidak perlu berpindah dari keyboard ke mouse dan kembali lagi. Kombinasi tombol memungkinkan satu tindakan hanya dalam sepersekian detik, dan dilakukan tanpa melihat layar. Penelitian ergonomi menunjukkan pengguna mahir dapat menghemat 20 sampai 30 persen waktu untuk pekerjaan kantor rutin seperti mengetik dokumen, mengelola file, dan menjelajah internet.$txt$)),
      (gen_random_uuid(), v_id, 'HEADING', 4, jsonb_build_object('text', $txt$Shortcut Windows yang Wajib Dikuasai$txt$)),
      (gen_random_uuid(), v_id, 'LIST', 5, to_jsonb(ARRAY[
        $li$Ctrl + C / Ctrl + X / Ctrl + V: salin, potong, tempel.$li$,
        $li$Ctrl + Z: batalkan tindakan terakhir; Ctrl + Y: ulangi lagi.$li$,
        $li$Ctrl + S: simpan pekerjaan; Ctrl + P: cetak.$li$,
        $li$Alt + Tab: berpindah antar jendela yang terbuka.$li$,
        $li$Windows + D: tampilkan desktop; Windows + L: kunci layar.$li$,
        $li$Windows + E: buka File Explorer; Windows + Shift + S: tangkap layar (snipping).$li$
      ])),
      (gen_random_uuid(), v_id, 'HEADING', 6, jsonb_build_object('text', $txt$Shortcut Browser dan Aplikasi Kantor$txt$)),
      (gen_random_uuid(), v_id, 'LIST', 7, to_jsonb(ARRAY[
        $li$Ctrl + T: tab baru; Ctrl + W: tutup tab; Ctrl + Shift + T: buka kembali tab yang baru ditutup.$li$,
        $li$Ctrl + F: cari kata di halaman atau dokumen.$li$,
        $li$Ctrl + B / Ctrl + I / Ctrl + U: tebal, miring, garis bawah di pengolah kata.$li$,
        $li$F5 atau Ctrl + R: muat ulang halaman browser.$li$,
        $li$Ctrl + Enter: lompat ke baris baru tanpa mengirim pesan di banyak aplikasi chat.$li$
      ])),
      (gen_random_uuid(), v_id, 'HEADING', 8, jsonb_build_object('text', $txt$Risiko dan Kesalahan Umum$txt$)),
      (gen_random_uuid(), v_id, 'PARAGRAPH', 9, jsonb_build_object('text', $txt$Beberapa kombinasi berbahaya jika ditekan tanpa sengaja: Alt + F4 menutup aplikasi aktif, dan Ctrl + Shift + Delete di browser membuka dialog hapus data. Jangan mencoba shortcut acak saat bekerja dengan dokumen penting yang belum disimpan. Biasakan menekan Ctrl + S setiap beberapa menit agar pekerjaan aman sebelum bereksperimen.$txt$)),
      (gen_random_uuid(), v_id, 'HEADING', 10, jsonb_build_object('text', $txt$Rencana Latihan 7 Hari$txt$)),
      (gen_random_uuid(), v_id, 'LIST', 11, to_jsonb(ARRAY[
        $li$Hari 1-2: hafalkan 5 shortcut dasar (salin, tempel, simpan, batalkan, cari).$li$,
        $li$Hari 3-4: tambah Alt + Tab, Windows + D, dan tangkap layar.$li$,
        $li$Hari 5-6: praktikkan shortcut browser saat riset internet.$li$,
        $li$Hari 7: tulis daftar 10 shortcut favorit di kertas dan tempel di dekat monitor.$li$,
        $li$Setelah seminggu, ukur: pekerjaan yang dulu 1 jam seharusnya terasa lebih ringan.$li$
      ]));
END $doblk$;

-- TUT-KESEHATAN55-001
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, created_by, updated_by, attribution_type, status)
VALUES ('e115dc21-a736-4638-ac65-e44f410ab761', 'TUT-KESEHATAN55-001', 'b5555555-5555-5555-5555-555555555555', $txt$Mata Merah: Penyebab Umum dan Penanganan di Rumah$txt$, 'mata-merah-penyebab-dan-penanganan', $txt$Kenali penyebab umum mata merah, pertolongan pertama yang aman di rumah, dan tanda bahaya yang mengharuskan ke dokter.$txt$, 'id', 7, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DEVELOPED_BY', 'DRAFT')
ON CONFLICT (business_code) DO NOTHING;

DO $doblk$
DECLARE v_id uuid;
BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'TUT-KESEHATAN55-001';
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
      (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', $txt$Masalah: Mata Tiba-Tiba Merah dan Tidak Nyaman$txt$)),
      (gen_random_uuid(), v_id, 'PARAGRAPH', 1, jsonb_build_object('text', $txt$Mata merah adalah keluhan yang sangat umum: bangun tidur mata memerah, atau setelah seharian menatap layar mata terasa perih dan berair. Sebagian besar kasus memang ringan dan sembuh sendiri, tetapi sebagian kecil bisa menjadi tanda infeksi atau kondisi serius. Artikel ini membantu membedakan keduanya dan memberi langkah aman yang bisa dilakukan di rumah.$txt$)),
      (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', $txt$Penyebab Umum Mata Merah$txt$)),
      (gen_random_uuid(), v_id, 'LIST', 3, to_jsonb(ARRAY[
        $li$Kelelahan mata dan mata kering, terutama setelah lama menatap layar.$li$,
        $li$Iritasi debu, asap, klorin kolam renang, atau kosmetik.$li$,
        $li$Alergi: biasanya gatal dan berair, sering disertai bersin.$li$,
        $li$Konjungtivitis (mata belekan): mata merah dengan kotoran mata lengket, bisa menular.$li$,
        $li$Bintitan atau peradangan kelopak mata.$li$,
        $li$Benda asing masuk ke mata atau goresan kornea.$li$
      ])),
      (gen_random_uuid(), v_id, 'HEADING', 4, jsonb_build_object('text', $txt$Pertolongan Pertama yang Aman di Rumah$txt$)),
      (gen_random_uuid(), v_id, 'LIST', 5, to_jsonb(ARRAY[
        $li$Istirahatkan mata: kurangi layar dan cahaya terang untuk sementara.$li$,
        $li$Kompres dingin dengan kain bersih selama 10-15 menit untuk meredakan peradangan.$li$,
        $li$Bilas mata dengan air bersih mengalir jika ada debu atau iritan masuk.$li$,
        $li$Jangan mengucek mata karena dapat memperparah iritasi.$li$,
        $li$Lepas lensa kontak sementara sampai mata pulih.$li$,
        $li$Gunakan tetes mata pelumas (air mata buatan) bila mata terasa kering.$li$
      ])),
      (gen_random_uuid(), v_id, 'HEADING', 6, jsonb_build_object('text', $txt$Hal yang Harus Dihindari$txt$)),
      (gen_random_uuid(), v_id, 'LIST', 7, to_jsonb(ARRAY[
        $li$Jangan memakai obat tetes mata bekas orang lain atau sisa resep lama.$li$,
        $li$Jangan memakai tetes mata pemutih (dekongestan) terus-menerus tanpa anjuran dokter.$li$,
        $li$Jangan meneteskan bahan tradisional seperti air sirih atau getah tanaman ke mata.$li$,
        $li$Jangan berbagi handuk atau bantal saat mata berinfeksi agar tidak menular.$li$
      ])),
      (gen_random_uuid(), v_id, 'HEADING', 8, jsonb_build_object('text', $txt$Tanda Bahaya: Segera ke Dokter Mata$txt$)),
      (gen_random_uuid(), v_id, 'LIST', 9, to_jsonb(ARRAY[
        $li$Nyeri mata hebat, bukan sekadar perih ringan.$li$,
        $li$Gangguan penglihatan: kabur, berbayang, atau sensitif cahaya berat.$li$,
        $li$Mata merah setelah benturan atau cedera.$li$,
        $li$Keluar nanah kental berwarna kuning-hijau dalam jumlah banyak.$li$,
        $li$Mata merah tidak membaik setelah 2-3 hari perawatan rumahan.$li$,
        $li$Demam disertai mata bengkak dan nyeri saat menggerakkan bola mata.$li$
      ])),
      (gen_random_uuid(), v_id, 'HEADING', 10, jsonb_build_object('text', $txt$Pemeriksaan Hasil dan Tindak Lanjut$txt$)),
      (gen_random_uuid(), v_id, 'PARAGRAPH', 11, jsonb_build_object('text', $txt$Catat kapan mata mulai merah, apa yang sedang dilakukan sebelumnya, dan gejala penyerta. Informasi ini sangat membantu dokter menegakkan diagnosis. Jika mata membaik dalam 1-2 hari, lanjutkan istirahat mata dan jaga kebersihan tangan. Artikel ini bersifat informasi umum dan bukan pengganti nasihat medis; bila ragu, konsultasikan ke dokter atau fasilitas kesehatan terdekat.$txt$));
END $doblk$;

-- EXP-ANTROPOLOGI29-001
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, created_by, updated_by, attribution_type, status)
VALUES ('e115bd9c-4e38-4af2-9dc2-058dcdd7989b', 'EXP-ANTROPOLOGI29-001', 'c8888888-8888-8888-8888-888888888888', $txt$Suku Asmat: Ukiran Kayu yang Menyimpan Jiwa Leluhur$txt$, 'suku-asmat-ukiran', $txt$Mengenal suku Asmat di Papua, ukiran kayunya yang mendunia, dan tradisi mbis yang sakral.$txt$, 'id', 6, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DEVELOPED_BY', 'DRAFT')
ON CONFLICT (business_code) DO NOTHING;

DO $doblk$
DECLARE v_id uuid;
BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-ANTROPOLOGI29-001';
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
      (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', $txt$Siapa Suku Asmat$txt$)),
      (gen_random_uuid(), v_id, 'PARAGRAPH', 1, jsonb_build_object('text', $txt$Suku Asmat mendiami wilayah rawa pesisir selatan Papua, Indonesia. Mereka adalah salah satu kelompok etnis terbesar di Papua dan terkenal di seluruh dunia karena ukiran kayunya yang ekspresif. Kehidupan tradisional Asmat sangat bergantung pada sungai dan hutan sagu, dengan perahu lesung sebagai sarana transportasi utama.$txt$)),
      (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', $txt$Ukiran Asmat: Seni Penuh Makna$txt$)),
      (gen_random_uuid(), v_id, 'PARAGRAPH', 3, jsonb_build_object('text', $txt$Ukiran Asmat bukan sekadar hiasan. Setiap motif manusia bertumpuk, burung, dan pola geometris menyimpan makna tentang leluhur, kesuburan, dan keseimbangan alam. Tiang mbis, tiang kayu raksasa setinggi belasan meter yang dipahat dari satu batang pohon, adalah karya paling terkenal: ia didirikan untuk mengenang arwah leluhur dalam upacara adat.$txt$)),
      (gen_random_uuid(), v_id, 'HEADING', 4, jsonb_build_object('text', $txt$Upacara Mbis yang Sakral$txt$)),
      (gen_random_uuid(), v_id, 'PARAGRAPH', 5, jsonb_build_object('text', $txt$Upacara mbis adalah ritual besar untuk menghormati arwah para leluhur yang telah tiada. Seluruh kampung terlibat: menebang pohon, memahat tiang selama berminggu-minggu, lalu mendirikannya disertai tarian dan nyanyian adat. Setelah upacara selesai, tiang mbis dibiarkan lapuk kembali ke tanah sebagai simbol siklus kehidupan.$txt$)),
      (gen_random_uuid(), v_id, 'HEADING', 6, jsonb_build_object('text', $txt$Rumah Jew dan Kehidupan Komunal$txt$)),
      (gen_random_uuid(), v_id, 'PARAGRAPH', 7, jsonb_build_object('text', $txt$Rumah jew adalah rumah adat panjang tempat para lelaki dewasa tinggal dan berkumpul. Di sinilah keputusan adat diambil, cerita leluhur dituturkan, dan para pemuda belajar memahat serta berburu. Struktur rumah jew mencerminkan nilai kebersamaan yang menjadi fondasi masyarakat Asmat.$txt$)),
      (gen_random_uuid(), v_id, 'HEADING', 8, jsonb_build_object('text', $txt$Asmat Hari Ini$txt$)),
      (gen_random_uuid(), v_id, 'PARAGRAPH', 9, jsonb_build_object('text', $txt$Kini ukiran Asmat dipamerkan di museum-museum dunia dan menjadi sumber penghidupan para pemahat. Festival Budaya Asmat yang rutin digelar di Agats menarik wisatawan dan kolektor seni. Tantangan modern seperti perubahan lingkungan dan pergeseran generasi membuat pelestarian tradisi ini semakin penting, dan para tetua adat terus mewariskannya kepada generasi muda.$txt$));
END $doblk$;

-- EXP-KIMIA50-001
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, created_by, updated_by, attribution_type, status)
VALUES ('e1159793-b2f9-411c-8269-2090f28e33b8', 'EXP-KIMIA50-001', 'c4444444-4444-4444-4444-444444444444', $txt$Besi dan Baja: Logam yang Membangun Peradaban Modern$txt$, 'besi-dan-baja-logam-konstruksi', $txt$Dari bijih besi hingga baja: sifat, pengolahan, dan peran logam ini dalam sejarah manusia.$txt$, 'id', 6, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DEVELOPED_BY', 'DRAFT')
ON CONFLICT (business_code) DO NOTHING;

DO $doblk$
DECLARE v_id uuid;
BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-KIMIA50-001';
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
      (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', $txt$Besi di Sekitar Kita$txt$)),
      (gen_random_uuid(), v_id, 'PARAGRAPH', 1, jsonb_build_object('text', $txt$Hampir setiap benda besar di sekitar kita mengandung besi: rangka gedung, jembatan, kendaraan, peralatan dapur, hingga paku terkecil. Besi adalah logam yang paling banyak digunakan manusia sepanjang sejarah, dan paduannya dengan karbon menghasilkan baja, material tulang punggung industri modern.$txt$)),
      (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', $txt$Sifat-Sifat Besi$txt$)),
      (gen_random_uuid(), v_id, 'PARAGRAPH', 3, jsonb_build_object('text', $txt$Besi murni berwarna keperakan, bersifat magnetis, dan dapat ditempa menjadi berbagai bentuk. Namun besi murni relatif lunak dan mudah berkarat. Dengan menambahkan sedikit karbon dan unsur lain, manusia menciptakan baja yang jauh lebih kuat dan keras, cocok untuk konstruksi dan mesin.$txt$)),
      (gen_random_uuid(), v_id, 'HEADING', 4, jsonb_build_object('text', $txt$Dari Bijih ke Logam: Cara Pengolahan$txt$)),
      (gen_random_uuid(), v_id, 'PARAGRAPH', 5, jsonb_build_object('text', $txt$Besi tidak ditemukan murni di alam, melainkan sebagai bijih seperti hematit dan magnetit. Bijih dilebur dalam tanur tinggi bersama kokas dan batu kapur pada suhu di atas 1500 derajat Celsius. Hasilnya adalah besi kasar yang kemudian dimurnikan dan dicampur karbon dalam tungku pembuatan baja.$txt$)),
      (gen_random_uuid(), v_id, 'HEADING', 6, jsonb_build_object('text', $txt$Zaman Besi dan Peradaban Manusia$txt$)),
      (gen_random_uuid(), v_id, 'PARAGRAPH', 7, jsonb_build_object('text', $txt$Sekitar 3000 tahun lalu manusia mulai menguasai peleburan besi, mengakhiri Zaman Perunggu. Alat dan senjata besi yang lebih kuat dan murah mengubah pertanian, peperangan, dan perdagangan. Revolusi Industri abad ke-18 kemudian menjadikan baja murah dalam jumlah besar, memungkinkan rel kereta api, gedung pencakar langit, dan mesin modern.$txt$)),
      (gen_random_uuid(), v_id, 'HEADING', 8, jsonb_build_object('text', $txt$Besi Modern dan Masa Depan$txt$)),
      (gen_random_uuid(), v_id, 'PARAGRAPH', 9, jsonb_build_object('text', $txt$Saat ini dunia memproduksi hampir 2 miliar ton baja per tahun. Tantangan terbesarnya adalah emisi karbon dari proses peleburan. Industri kini mengembangkan baja hijau dengan hidrogen sebagai pengganti kokas, agar logam yang membangun peradaban ini tidak merusak planet tempat peradaban itu hidup.$txt$));
END $doblk$;

-- SCH-SMP-MAT18-001
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, created_by, updated_by, attribution_type, status)
VALUES ('e11500c9-cfdf-4baa-a814-c73ceff97063', 'SCH-SMP-MAT18-001', 'd4444444-4444-4444-4444-444444444444', $txt$Matematika Kelas 7: Mengenal Pecahan$txt$, 'matematika-kelas-7-pecahan', $txt$Materi pecahan kelas 7 SMP: pengertian, jenis, penyederhanaan, dan operasi hitung beserta latihan soal dan kunci jawaban.$txt$, 'id', 10, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DEVELOPED_BY', 'DRAFT')
ON CONFLICT (business_code) DO NOTHING;

DO $doblk$
DECLARE v_id uuid;
BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'SCH-SMP-MAT18-001';
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
      (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', $txt$Tujuan Pembelajaran$txt$)),
      (gen_random_uuid(), v_id, 'LIST', 1, to_jsonb(ARRAY[
        $li$Siswa memahami pengertian pecahan sebagai bagian dari keseluruhan.$li$,
        $li$Siswa dapat membedakan jenis-jenis pecahan.$li$,
        $li$Siswa dapat menyederhanakan pecahan dengan benar.$li$,
        $li$Siswa dapat melakukan operasi penjumlahan, pengurangan, perkalian, dan pembagian pecahan.$li$
      ])),
      (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', $txt$Pengertian Pecahan$txt$)),
      (gen_random_uuid(), v_id, 'PARAGRAPH', 3, jsonb_build_object('text', $txt$Pecahan adalah bilangan yang menyatakan bagian dari suatu keseluruhan. Ditulis dalam bentuk a per b, dengan a disebut pembilang dan b disebut penyebut. Contoh: satu per dua artinya satu bagian dari dua bagian yang sama besar, seperti setengah potong kue. Penyebut tidak boleh nol.$txt$)),
      (gen_random_uuid(), v_id, 'HEADING', 4, jsonb_build_object('text', $txt$Jenis-Jenis Pecahan$txt$)),
      (gen_random_uuid(), v_id, 'LIST', 5, to_jsonb(ARRAY[
        $li$Pecahan biasa: pembilang lebih kecil dari penyebut, contoh 3/4.$li$,
        $li$Pecahan campuran: gabungan bilangan bulat dan pecahan, contoh 2 1/3.$li$,
        $li$Pecahan desimal: ditulis dengan koma, contoh 0,75.$li$,
        $li$Persen: pecahan berpenyebut 100, contoh 50% sama dengan 1/2.$li$
      ])),
      (gen_random_uuid(), v_id, 'HEADING', 6, jsonb_build_object('text', $txt$Menyederhanakan Pecahan$txt$)),
      (gen_random_uuid(), v_id, 'PARAGRAPH', 7, jsonb_build_object('text', $txt$Pecahan disederhanakan dengan membagi pembilang dan penyebut dengan bilangan yang sama, yaitu faktor persekutuan terbesar (FPB) keduanya. Contoh: 6/8 disederhanakan menjadi 3/4 karena 6 dan 8 sama-sama habis dibagi 2. Pecahan paling sederhana adalah pecahan yang pembilang dan penyebutnya tidak punya faktor persekutuan selain 1.$txt$)),
      (gen_random_uuid(), v_id, 'HEADING', 8, jsonb_build_object('text', $txt$Operasi Hitung Pecahan$txt$)),
      (gen_random_uuid(), v_id, 'PARAGRAPH', 9, jsonb_build_object('text', $txt$Penjumlahan dan pengurangan: samakan penyebut dulu dengan KPK, lalu jumlahkan atau kurangkan pembilangnya. Contoh: 1/4 + 2/4 = 3/4. Perkalian: kalikan pembilang dengan pembilang dan penyebut dengan penyebut. Pembagian: balik pecahan kedua lalu kalikan. Contoh: 1/2 : 1/4 = 1/2 x 4/1 = 2.$txt$)),
      (gen_random_uuid(), v_id, 'HEADING', 10, jsonb_build_object('text', $txt$Latihan Soal dan Kunci Jawaban$txt$)),
      (gen_random_uuid(), v_id, 'LIST', 11, to_jsonb(ARRAY[
        $li$Soal 1: Sederhanakan 12/18. Kunci: 2/3.$li$,
        $li$Soal 2: Hitung 2/5 + 1/10. Kunci: 1/2.$li$,
        $li$Soal 3: Hitung 3/4 - 1/8. Kunci: 5/8.$li$,
        $li$Soal 4: Hitung 2/3 x 3/5. Kunci: 2/5.$li$,
        $li$Soal 5: Hitung 5/6 : 5/12. Kunci: 2.$li$
      ]));
END $doblk$;

-- SCH-SD-IPS33-001
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, created_by, updated_by, attribution_type, status)
VALUES ('e115599e-56b4-4672-9057-6888fbc418f0', 'SCH-SD-IPS33-001', 'd3333333-3333-3333-3333-333333333333', $txt$Mengenal ASEAN: Organisasi Negara-Negara Asia Tenggara$txt$, 'mengenal-asean-ips-kelas-6', $txt$Materi IPS kelas 6 SD: pengertian ASEAN, negara anggota, tujuan, dan peran Indonesia, plus latihan soal dan kunci.$txt$, 'id', 8, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DEVELOPED_BY', 'DRAFT')
ON CONFLICT (business_code) DO NOTHING;

DO $doblk$
DECLARE v_id uuid;
BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'SCH-SD-IPS33-001';
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
      (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', $txt$Tujuan Pembelajaran$txt$)),
      (gen_random_uuid(), v_id, 'LIST', 1, to_jsonb(ARRAY[
        $li$Siswa dapat menjelaskan pengertian ASEAN.$li$,
        $li$Siswa dapat menyebutkan negara-negara anggota ASEAN.$li$,
        $li$Siswa dapat menjelaskan tujuan berdirinya ASEAN.$li$,
        $li$Siswa dapat menjelaskan peran Indonesia dalam ASEAN.$li$
      ])),
      (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', $txt$Apa itu ASEAN$txt$)),
      (gen_random_uuid(), v_id, 'PARAGRAPH', 3, jsonb_build_object('text', $txt$ASEAN adalah singkatan dari Association of Southeast Asian Nations, yaitu organisasi negara-negara di kawasan Asia Tenggara. ASEAN didirikan pada tanggal 8 Agustus 1967 di Bangkok, Thailand, melalui penandatanganan Deklarasi Bangkok oleh lima negara pendiri: Indonesia, Malaysia, Filipina, Singapura, dan Thailand.$txt$)),
      (gen_random_uuid(), v_id, 'HEADING', 4, jsonb_build_object('text', $txt$Negara-Negara Anggota ASEAN$txt$)),
      (gen_random_uuid(), v_id, 'LIST', 5, to_jsonb(ARRAY[
        $li$Lima negara pendiri: Indonesia, Malaysia, Filipina, Singapura, Thailand.$li$,
        $li$Brunei Darussalam (bergabung 1984).$li$,
        $li$Vietnam (1995), Laos dan Myanmar (1997), Kamboja (1999).$li$,
        $li$Timor Leste menjadi anggota kesebelas pada tahun 2025.$li$
      ])),
      (gen_random_uuid(), v_id, 'HEADING', 6, jsonb_build_object('text', $txt$Tujuan dan Manfaat ASEAN$txt$)),
      (gen_random_uuid(), v_id, 'PARAGRAPH', 7, jsonb_build_object('text', $txt$Tujuan utama ASEAN adalah menciptakan perdamaian dan stabilitas di kawasan, mempercepat pertumbuhan ekonomi, serta meningkatkan kerja sama sosial dan budaya antarnegara anggota. Manfaat nyatanya antara lain perdagangan bebas antarnegara ASEAN, kemudahan bepergian tanpa visa untuk wisata, dan pertukaran pelajar serta budaya.$txt$)),
      (gen_random_uuid(), v_id, 'HEADING', 8, jsonb_build_object('text', $txt$Peran Indonesia di ASEAN$txt$)),
      (gen_random_uuid(), v_id, 'PARAGRAPH', 9, jsonb_build_object('text', $txt$Indonesia adalah salah satu pendiri ASEAN dan sering menjadi tuan rumah pertemuan penting seperti KTT ASEAN. Jakarta juga menjadi lokasi Sekretariat ASEAN. Indonesia aktif mendorong perdamaian kawasan dan kerja sama ekonomi, sehingga dijuluki sebagai kakak tertua di antara negara-negara ASEAN.$txt$)),
      (gen_random_uuid(), v_id, 'HEADING', 10, jsonb_build_object('text', $txt$Latihan Soal dan Kunci Jawaban$txt$)),
      (gen_random_uuid(), v_id, 'LIST', 11, to_jsonb(ARRAY[
        $li$Soal 1: Kapan ASEAN didirikan? Kunci: 8 Agustus 1967.$li$,
        $li$Soal 2: Sebutkan 5 negara pendiri ASEAN. Kunci: Indonesia, Malaysia, Filipina, Singapura, Thailand.$li$,
        $li$Soal 3: Di kota apa Deklarasi Bangkok ditandatangani? Kunci: Bangkok, Thailand.$li$,
        $li$Soal 4: Negara apa yang menjadi anggota ASEAN paling baru? Kunci: Timor Leste.$li$,
        $li$Soal 5: Sebutkan 2 manfaat ASEAN bagi Indonesia. Kunci: perdagangan bebas dan bebas visa wisata (jawaban lain yang tepat diterima).$li$
      ]));
END $doblk$;

