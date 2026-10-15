-- Batch 43: 6 artikel Madevi (2 Tutorial + 2 Explore + 2 School)
-- Idempotent: re-run aman (hapus block lama lalu insert ulang per artikel)
BEGIN;

DO $do$
DECLARE
  a1 uuid; a2 uuid; a3 uuid; a4 uuid; a5 uuid; a6 uuid;
  owner uuid := 'f7125028-187e-44e0-b95b-88b69b8d5c9a';
BEGIN
  -- 1. TUT-KOMPUTER6-001 -> R1.D3.K7 Komputer & Laptop
  INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, created_by, updated_by)
  VALUES (gen_random_uuid(), 'TUT-KOMPUTER6-001', 'baaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Install Ulang Windows: Panduan Lengkap', 'install-ulang-windows-panduan-lengkap',
    'Panduan install ulang Windows dari nol: backup data, buat USB bootable, instalasi, dan pemulihan driver.', 'id', 9, owner, 'DRAFT', owner, owner)
  ON CONFLICT (business_code) DO NOTHING RETURNING id INTO a1;
  IF a1 IS NULL THEN SELECT id INTO a1 FROM madevi.articles WHERE business_code = 'TUT-KOMPUTER6-001'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = a1;

  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
  (gen_random_uuid(), a1, 'HEADING', 1, jsonb_build_object('text', $t$Masalah: Laptop Lemot Parah, Penuh Virus, atau Error Terus$t$)),
  (gen_random_uuid(), a1, 'PARAGRAPH', 2, jsonb_build_object('text', $t$Windows yang dipakai bertahun-tahun biasanya menumpuk sampah: program yang jarang dipakai, malware, registry berantakan, dan driver konflik. Kalau sudah sering blue screen, booting lebih dari 3 menit, atau antivirus tidak mampu membersihkan virus, install ulang adalah solusi paling bersih — mengembalikan sistem ke kondisi seperti baru tanpa biaya servis.$t$)),
  (gen_random_uuid(), a1, 'HEADING', 3, jsonb_build_object('text', $t$Penjelasan: Apa yang Terjadi Saat Install Ulang$t$)),
  (gen_random_uuid(), a1, 'PARAGRAPH', 4, jsonb_build_object('text', $t$Install ulang menghapus seluruh partisi sistem (biasanya drive C) lalu memasang salinan Windows yang segar. Data di drive lain (D, E) umumnya aman, tetapi tetap wajib di-backup karena satu kesalahan memilih partisi bisa menghapus semuanya. Prosesnya terdiri dari empat tahap: persiapan (backup + unduh driver), pembuatan media instalasi, instalasi, dan pasca-instalasi (driver, update, program).$t$)),
  (gen_random_uuid(), a1, 'HEADING', 5, jsonb_build_object('text', $t$Alat dan Bahan yang Dibutuhkan$t$)),
  (gen_random_uuid(), a1, 'LIST', 6, jsonb_build_object('items', ARRAY[
    $t$Flashdisk minimal 8 GB (data di dalamnya akan terhapus)$t$,
    $t$Koneksi internet untuk mengunduh ISO Windows dari situs resmi Microsoft$t$,
    $t$Catat lisensi Windows (product key) dan password akun penting$t$,
    $t$Driver laptop dari situs resmi produsen (simpan di flashdisk kedua atau partisi D)$t$,
    $t$Waktu luang 2–3 jam dan charger/colokan listrik yang stabil$t$
  ])),
  (gen_random_uuid(), a1, 'HEADING', 7, jsonb_build_object('text', $t$Tahap 1: Backup Data Penting$t$)),
  (gen_random_uuid(), a1, 'LIST', 8, jsonb_build_object('items', ARRAY[
    $t$Salin dokumen, foto, dan video dari Desktop, Documents, dan Downloads ke drive D atau harddisk eksternal.$t$,
    $t$Ekspor bookmark browser dan catat daftar aplikasi yang biasa dipakai.$t$,
    $t$Pastikan tidak ada data penting yang hanya tersimpan di drive C.$t$
  ])),
  (gen_random_uuid(), a1, 'HEADING', 9, jsonb_build_object('text', $t$Tahap 2–4: Buat USB Bootable, Install, dan Pemulihan$t$)),
  (gen_random_uuid(), a1, 'LIST', 10, jsonb_build_object('items', ARRAY[
    $t$Unduh Media Creation Tool dari situs resmi Microsoft, jalankan, pilih flashdisk sebagai media.$t$,
    $t$Restart laptop, masuk ke boot menu (biasanya F12/F2/Del), pilih boot dari flashdisk.$t$,
    $t$Pada pilihan partisi, format HANYA partisi sistem (drive C). Jangan sentuh partisi data.$t$,
    $t$Ikuti wizard instalasi hingga selesai, lalu install driver chipset, VGA, WiFi, dan audio.$t$,
    $t$Jalankan Windows Update hingga tuntas, baru install aplikasi satu per satu.$t$
  ])),
  (gen_random_uuid(), a1, 'HEADING', 11, jsonb_build_object('text', $t$Risiko dan Kesalahan Umum$t$)),
  (gen_random_uuid(), a1, 'LIST', 12, jsonb_build_object('items', ARRAY[
    $t$Salah format partisi: selalu periksa ukuran dan label partisi sebelum menekan Format.$t$,
    $t$Driver WiFi hilang: tanpa driver WiFi tidak bisa internet — unduh dan simpan driver SEBELUM install ulang.$t$,
    $t$ISO dari situs bajakan: berisiko disusupi malware — unduh hanya dari situs resmi Microsoft.$t$,
    $t$Lisensi hilang: pastikan akun Microsoft terhubung atau catat product key sebelum mulai.$t$
  ]));

  -- 2. TUT-MASAK8-001 -> R1.D1.K4 Rumah Tangga
  INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, created_by, updated_by)
  VALUES (gen_random_uuid(), 'TUT-MASAK8-001', 'b7777777-7777-7777-7777-777777777777', 'Gado-gado: Resep Bumbu Kacang', 'gado-gado-resep-bumbu-kacang',
    'Resep gado-gado sayur dengan bumbu kacang kental gurih, emping, dan lontong — lengkap dengan takaran.', 'id', 7, owner, 'DRAFT', owner, owner)
  ON CONFLICT (business_code) DO NOTHING RETURNING id INTO a2;
  IF a2 IS NULL THEN SELECT id INTO a2 FROM madevi.articles WHERE business_code = 'TUT-MASAK8-001'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = a2;

  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
  (gen_random_uuid(), a2, 'HEADING', 1, jsonb_build_object('text', $t$Masalah: Bumbu Kacang Encer, Hambar, atau Cepat Basi$t$)),
  (gen_random_uuid(), a2, 'PARAGRAPH', 2, jsonb_build_object('text', $t$Bumbu kacang gado-gado yang gagal biasanya encer seperti kuah, rasanya hambar, atau basi dalam hitungan jam. Penyebabnya sepele: kacang digoreng kurang matang, santan tidak dimasak sampai tanak, atau perbandingan gula dan asam tidak pas. Padahal bumbu kacang yang benar itu kental, berminyak di permukaan, dan manis-gurih-pedas seimbang.$t$)),
  (gen_random_uuid(), a2, 'HEADING', 3, jsonb_build_object('text', $t$Penjelasan: Kunci Bumbu Kacang yang Kental$t$)),
  (gen_random_uuid(), a2, 'PARAGRAPH', 4, jsonb_build_object('text', $t$Kekentalan bumbu kacang berasal dari kacang tanah yang digiling halus dan dimasak bersama santan hingga mengental. Minyak alami kacang akan keluar dan mengapung — itu tanda bumbu matang sempurna, bukan basi. Gula merah memberi warna cokelat karamel dan rasa manis legit, sedangkan asam jawa menyeimbangkan rasa agar tidak enek. Bumbu yang dimasak hingga tanak (benar-benar matang) bisa tahan 2–3 hari di suhu ruang.$t$)),
  (gen_random_uuid(), a2, 'HEADING', 5, jsonb_build_object('text', $t$Bahan Sayuran (untuk 4–5 porsi)$t$)),
  (gen_random_uuid(), a2, 'LIST', 6, jsonb_build_object('items', ARRAY[
    $t$200 g tauge, 200 g kangkung, 200 g kacang panjang — rebus sebentar, tiriskan$t$,
    $t$2 buah kentang rebus, potong-potong; 2 butir telur rebus, belah dua$t$,
    $t$1 buah timun, iris; 200 g kol, iris lalu rebus sebentar$t$,
    $t$Lontong secukupnya, emping, dan bawang goreng untuk taburan$t$
  ])),
  (gen_random_uuid(), a2, 'HEADING', 7, jsonb_build_object('text', $t$Bumbu Kacang$t$)),
  (gen_random_uuid(), a2, 'LIST', 8, jsonb_build_object('items', ARRAY[
    $t$250 g kacang tanah, goreng hingga matang kecokelatan$t$,
    $t$5 buah cabai merah keriting, 3 siung bawang putih, 2 cm kencur$t$,
    $t$150 g gula merah, disisir; 1 sdt asam jawa larutkan dengan air$t$,
    $t$500 ml santan dari 1/2 butir kelapa; 1 sdt garam$t$
  ])),
  (gen_random_uuid(), a2, 'HEADING', 9, jsonb_build_object('text', $t$Langkah Membuat$t$)),
  (gen_random_uuid(), a2, 'LIST', 10, jsonb_build_object('items', ARRAY[
    $t$1. Haluskan kacang goreng, cabai, bawang putih, dan kencur hingga benar-benar lembut.$t$,
    $t$2. Masak bumbu halus bersama santan, gula merah, dan air asam dengan api sedang.$t$,
    $t$3. Aduk terus agar santan tidak pecah, masak hingga mengental dan minyak keluar ke permukaan.$t$,
    $t$4. Koreksi rasa: manis dari gula merah, gurih asin, dan sedikit asam segar.$t$,
    $t$5. Tata lontong dan sayuran di piring, siram bumbu kacang, taburi emping dan bawang goreng.$t$
  ])),
  (gen_random_uuid(), a2, 'HEADING', 11, jsonb_build_object('text', $t$Risiko dan Kesalahan Umum$t$)),
  (gen_random_uuid(), a2, 'LIST', 12, jsonb_build_object('items', ARRAY[
    $t$Bumbu encer: kacang kurang halus atau santan terlalu banyak — tambah kacang giling bila perlu.$t$,
    $t$Rasa langu: bumbu tidak dimasak sampai tanak — lanjutkan memasak hingga minyak keluar.$t$,
    $t$Cepat basi: jangan campur bumbu dengan sayuran jauh sebelum disajikan.$t$,
    $t$Terlalu pedas untuk anak: sisihkan sebagian bumbu sebelum menambah cabai.$t$
  ]));

  -- 3. EXP-MATEMATIKA4-001 -> R2.D9 Matematika
  INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, created_by, updated_by)
  VALUES (gen_random_uuid(), 'EXP-MATEMATIKA4-001', 'c5555555-5555-5555-5555-555555555555', 'Fraktal: Keindahan Matematika', 'fraktal-keindahan-matematika',
    'Mengenal fraktal: pola yang berulang di setiap skala, dari segitiga Sierpinski hingga pola di alam.', 'id', 6, owner, 'DRAFT', owner, owner)
  ON CONFLICT (business_code) DO NOTHING RETURNING id INTO a3;
  IF a3 IS NULL THEN SELECT id INTO a3 FROM madevi.articles WHERE business_code = 'EXP-MATEMATIKA4-001'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = a3;

  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
  (gen_random_uuid(), a3, 'HEADING', 1, jsonb_build_object('text', $t$Apa Itu Fraktal?$t$)),
  (gen_random_uuid(), a3, 'PARAGRAPH', 2, jsonb_build_object('text', $t$Fraktal adalah pola yang tampak sama di setiap skala pembesaran — zoom sejauh apapun, strukturnya tetap berulang. Istilah ini dipopulerkan matematikawan Benoit Mandelbrot pada tahun 1975. Ciri khasnya disebut keserupaan diri (self-similarity): bagian kecil menyerupai keseluruhan, seperti ranting pohon yang bercabang dengan pola sama seperti cabang besarnya.$t$)),
  (gen_random_uuid(), a3, 'HEADING', 3, jsonb_build_object('text', $t$Segitiga Sierpinski: Dibuat dengan Menghapus$t$)),
  (gen_random_uuid(), a3, 'PARAGRAPH', 4, jsonb_build_object('text', $t$Ambil segitiga sama sisi, lalu hapus segitiga tengahnya sehingga tersisa tiga segitiga kecil. Ulangi pada tiap segitiga kecil, terus menerus. Hasilnya adalah segitiga Sierpinski — pola lubang-lubang segitiga yang berulang hingga tak terhingga. Anehnya, luasnya mendekati nol namun kelilingnya tak terhingga.$t$)),
  (gen_random_uuid(), a3, 'HEADING', 5, jsonb_build_object('text', $t$Himpunan Mandelbrot: Rumus Satu Baris$t$)),
  (gen_random_uuid(), a3, 'PARAGRAPH', 6, jsonb_build_object('text', $t$Himpunan Mandelbrot lahir dari rumus sederhana z = z^2 + c yang diulang terus menerus dengan bilangan kompleks. Hasilnya adalah gambar paling terkenal dalam matematika: bentuk seperti kumbang dengan pusaran tak berujung di tepinya. Zoom ke tepinya sejauh apapun, selalu muncul pola baru yang rumit — kompleksitas tak terbatas dari aturan yang sangat sederhana.$t$)),
  (gen_random_uuid(), a3, 'HEADING', 7, jsonb_build_object('text', $t$Fraktal di Alam Sekitar$t$)),
  (gen_random_uuid(), a3, 'LIST', 8, jsonb_build_object('items', ARRAY[
    $t$Brokoli romanesco: kuntumnya tersusun spiral logaritmik yang berulang sempurna$t$,
    $t$Garis pantai: panjangnya bertambah saat diukur dengan penggaris lebih kecil — paradoks garis pantai$t$,
    $t$Petir, sungai bercabang, pembuluh darah, dan kepingan salju$t$,
    $t$Daun pakis: setiap anak daun menyerupai daun utuh$t$
  ])),
  (gen_random_uuid(), a3, 'HEADING', 9, jsonb_build_object('text', $t$Kegunaan di Dunia Nyata$t$)),
  (gen_random_uuid(), a3, 'PARAGRAPH', 10, jsonb_build_object('text', $t$Fraktal bukan sekadar gambar indah. Antena fraktal di ponsel memakai pola berulang agar menangkap banyak frekuensi dalam ukuran kecil. Kompresi gambar, pemodelan medan dan awan di film, analisis pasar saham, hingga pemodelan pertumbuhan tumor memakai geometri fraktal. Dimensi fraktal bahkan bukan bilangan bulat — garis pantai Inggris misalnya berdimensi sekitar 1,25, di antara garis (1) dan bidang (2).$t$));

  -- 4. EXP-SEJARAH9-001 -> R2.D12 Sejarah & Peradaban
  INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, created_by, updated_by)
  VALUES (gen_random_uuid(), 'EXP-SEJARAH9-001', 'c8888888-8888-8888-8888-888888888888', 'Bandung Lautan Api 1946', 'bandung-lautan-api-1946',
    'Kisah pembumihangusan Bandung 24 Maret 1946: latar belakang, jalannya peristiwa, dan maknanya bagi kemerdekaan.', 'id', 6, owner, 'DRAFT', owner, owner)
  ON CONFLICT (business_code) DO NOTHING RETURNING id INTO a4;
  IF a4 IS NULL THEN SELECT id INTO a4 FROM madevi.articles WHERE business_code = 'EXP-SEJARAH9-001'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = a4;

  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
  (gen_random_uuid(), a4, 'HEADING', 1, jsonb_build_object('text', $t$Bandung Terbakar pada 24 Maret 1946$t$)),
  (gen_random_uuid(), a4, 'PARAGRAPH', 2, jsonb_build_object('text', $t$Pada malam 24 Maret 1946, kota Bandung berubah menjadi lautan api. Rakyat membakar rumah dan gedung mereka sendiri sebelum mundur ke selatan, agar tidak jatuh ke tangan pasukan Sekutu dan NICA Belanda. Peristiwa ini dikenal sebagai Bandung Lautan Api — salah satu momen paling dramatis dalam perjuangan mempertahankan kemerdekaan Indonesia.$t$)),
  (gen_random_uuid(), a4, 'HEADING', 3, jsonb_build_object('text', $t$Latar Belakang: Ultimatum Sekutu$t$)),
  (gen_random_uuid(), a4, 'PARAGRAPH', 4, jsonb_build_object('text', $t$Setelah proklamasi 1945, pasukan Sekutu (Inggris) mendarat di Indonesia dengan misi melucuti Jepang — tetapi diboncengi Belanda (NICA) yang ingin kembali berkuasa. Di Bandung, Sekutu mengeluarkan ultimatum: pejuang Indonesia harus meninggalkan Bandung Utara. TRI (Tentara Republik Indonesia) menolak menyerah begitu saja dan memilih strategi bumi hangus.$t$)),
  (gen_random_uuid(), a4, 'HEADING', 5, jsonb_build_object('text', $t$Jalannya Peristiwa$t$)),
  (gen_random_uuid(), a4, 'LIST', 6, jsonb_build_object('items', ARRAY[
    $t$23 Maret 1946: TRI dan para pejuang memutuskan membumihanguskan Bandung Utara$t$,
    $t$24 Maret malam: sekitar 200.000 penduduk mengungsi ke selatan sambil membakar rumah dan fasilitas$t$,
    $t$Api membumbung di seluruh kota — terlihat dari kejauhan seperti lautan api$t$,
    $t$Pasukan Sekutu yang masuk hanya menemukan kota kosong yang terbakar$t$
  ])),
  (gen_random_uuid(), a4, 'HEADING', 7, jsonb_build_object('text', $t$Mohammad Toha dan Ramdan$t$)),
  (gen_random_uuid(), a4, 'PARAGRAPH', 8, jsonb_build_object('text', $t$Dua pejuang, Mohammad Toha dan Ramdan, gugur saat meledakkan gudang mesiu Sekutu di Dayeuhkolot agar tidak direbut musuh. Pengorbanan mereka menjadi simbol keberanian peristiwa ini. Untuk mengenang Bandung Lautan Api, Ismail Marzuki menciptakan lagu Halo-Halo Bandung yang masih dinyanyikan hingga kini.$t$)),
  (gen_random_uuid(), a4, 'HEADING', 9, jsonb_build_object('text', $t$Makna bagi Perjuangan Kemerdekaan$t$)),
  (gen_random_uuid(), a4, 'PARAGRAPH', 10, jsonb_build_object('text', $t$Bandung Lautan Api menunjukkan tekad rakyat: lebih baik kehilangan harta benda daripada kembali dijajah. Strategi bumi hangus berhasil menggagalkan rencana Sekutu menjadikan Bandung basis militer yang utuh. Peristiwa ini menjadi bukti bahwa kemerdekaan dipertahankan dengan pengorbanan nyata, dan dikenang setiap tahun sebagai bagian dari sejarah perjuangan bangsa.$t$));

  -- 5. SCH-SMA-SOS3-001 -> R3.D16 SMA
  INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, created_by, updated_by)
  VALUES (gen_random_uuid(), 'SCH-SMA-SOS3-001', 'd5555555-5555-5555-5555-555555555555', 'Sosiologi Kelas 12: Perubahan Sosial', 'sosiologi-kelas-12-perubahan-sosial',
    'Materi sosiologi kelas 12: pengertian perubahan sosial, bentuk, faktor pendorong-penghambat, dan contoh di Indonesia.', 'id', 8, owner, 'DRAFT', owner, owner)
  ON CONFLICT (business_code) DO NOTHING RETURNING id INTO a5;
  IF a5 IS NULL THEN SELECT id INTO a5 FROM madevi.articles WHERE business_code = 'SCH-SMA-SOS3-001'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = a5;

  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
  (gen_random_uuid(), a5, 'HEADING', 1, jsonb_build_object('text', $t$Tujuan Pembelajaran$t$)),
  (gen_random_uuid(), a5, 'LIST', 2, jsonb_build_object('items', ARRAY[
    $t$Siswa mampu menjelaskan pengertian perubahan sosial menurut para ahli$t$,
    $t$Siswa mampu mengidentifikasi bentuk-bentuk perubahan sosial$t$,
    $t$Siswa mampu menganalisis faktor pendorong dan penghambat perubahan sosial$t$
  ])),
  (gen_random_uuid(), a5, 'HEADING', 3, jsonb_build_object('text', $t$Pengertian Perubahan Sosial$t$)),
  (gen_random_uuid(), a5, 'PARAGRAPH', 4, jsonb_build_object('text', $t$Perubahan sosial adalah perubahan pada struktur dan fungsi masyarakat, mencakup nilai, norma, lembaga, dan pola perilaku. Menurut Selo Soemardjan, perubahan sosial adalah perubahan pada lembaga kemasyarakatan yang memengaruhi sistem sosialnya. Perubahan selalu terjadi — masyarakat yang tidak berubah justru tidak ada — tetapi kecepatan dan arahnya berbeda-beda.$t$)),
  (gen_random_uuid(), a5, 'HEADING', 5, jsonb_build_object('text', $t$Bentuk-Bentuk Perubahan Sosial$t$)),
  (gen_random_uuid(), a5, 'LIST', 6, jsonb_build_object('items', ARRAY[
    $t$Perubahan lambat (evolusi) vs perubahan cepat (revolusi)$t$,
    $t$Perubahan kecil vs perubahan besar (berdampak luas pada sendi kehidupan)$t$,
    $t$Perubahan yang direncanakan (planned change) vs tidak direncanakan$t$,
    $t$Perubahan progresif (ke arah kemajuan) vs regresif (kemunduran)$t$
  ])),
  (gen_random_uuid(), a5, 'HEADING', 7, jsonb_build_object('text', $t$Faktor Pendorong dan Penghambat$t$)),
  (gen_random_uuid(), a5, 'LIST', 8, jsonb_build_object('items', ARRAY[
    $t$Pendorong: kontak dengan budaya lain, pendidikan maju, toleransi, sistem terbuka, penduduk heterogen$t$,
    $t$Penghambat: adat istiadat kuat, prasangka terhadap hal baru, kepentingan yang tertanam, trauma masa lalu$t$,
    $t$Contoh di Indonesia: masuknya internet mengubah cara berdagang (e-commerce) dan berkomunikasi$t$
  ])),
  (gen_random_uuid(), a5, 'HEADING', 9, jsonb_build_object('text', $t$Contoh Perubahan Sosial di Indonesia$t$)),
  (gen_random_uuid(), a5, 'PARAGRAPH', 10, jsonb_build_object('text', $t$Digitalisasi adalah perubahan sosial terbesar satu dekade terakhir: ojek pangkalan menjadi ojek online, pasar tradisional bersaing dengan marketplace, dan gotong royong fisik bergeser ke donasi daring. Perubahan ini direncanakan sebagian (program pemerintah) dan tidak direncanakan sebagian (adopsi spontan masyarakat). Dampaknya ganda: efisiensi meningkat tetapi kesenjangan digital muncul antara kota dan desa.$t$)),
  (gen_random_uuid(), a5, 'HEADING', 11, jsonb_build_object('text', $t$Latihan$t$)),
  (gen_random_uuid(), a5, 'LIST', 12, jsonb_build_object('items', ARRAY[
    $t$1. Jelaskan perbedaan perubahan evolusi dan revolusi beserta contohnya!$t$,
    $t$2. Sebutkan tiga faktor pendorong dan tiga faktor penghambat perubahan sosial!$t$,
    $t$3. Analisis satu perubahan sosial di lingkunganmu: termasuk bentuk apa dan apa dampaknya?$t$
  ]));

  -- 6. SCH-SD-MAT10-001 -> R3.D14 SD
  INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, created_by, updated_by)
  VALUES (gen_random_uuid(), 'SCH-SD-MAT10-001', 'd3333333-3333-3333-3333-333333333333', 'Matematika Kelas 5: KPK dan FPB', 'matematika-kelas-5-kpk-dan-fpb',
    'Materi matematika kelas 5: pengertian KPK dan FPB, cara mencari dengan faktorisasi prima, dan soal cerita.', 'id', 7, owner, 'DRAFT', owner, owner)
  ON CONFLICT (business_code) DO NOTHING RETURNING id INTO a6;
  IF a6 IS NULL THEN SELECT id INTO a6 FROM madevi.articles WHERE business_code = 'SCH-SD-MAT10-001'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = a6;

  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
  (gen_random_uuid(), a6, 'HEADING', 1, jsonb_build_object('text', $t$Tujuan Pembelajaran$t$)),
  (gen_random_uuid(), a6, 'LIST', 2, jsonb_build_object('items', ARRAY[
    $t$Siswa memahami pengertian kelipatan, faktor, KPK, dan FPB$t$,
    $t$Siswa mampu mencari KPK dan FPB dengan faktorisasi prima$t$,
    $t$Siswa mampu menyelesaikan soal cerita KPK dan FPB$t$
  ])),
  (gen_random_uuid(), a6, 'HEADING', 3, jsonb_build_object('text', $t$Kelipatan dan Faktor$t$)),
  (gen_random_uuid(), a6, 'PARAGRAPH', 4, jsonb_build_object('text', $t$Kelipatan suatu bilangan adalah hasil perkalian bilangan itu dengan bilangan asli. Contoh: kelipatan 4 adalah 4, 8, 12, 16, 20, ... Faktor suatu bilangan adalah bilangan yang membagi habis bilangan itu. Contoh: faktor 12 adalah 1, 2, 3, 4, 6, 12. Pahami dulu dua konsep ini sebelum lanjut ke KPK dan FPB.$t$)),
  (gen_random_uuid(), a6, 'HEADING', 5, jsonb_build_object('text', $t$KPK: Kelipatan Persekutuan Terkecil$t$)),
  (gen_random_uuid(), a6, 'PARAGRAPH', 6, jsonb_build_object('text', $t$KPK adalah kelipatan bersama terkecil dari dua bilangan atau lebih. Contoh: kelipatan 4 = 4, 8, 12, 16, 20, 24...; kelipatan 6 = 6, 12, 18, 24... Kelipatan bersamanya adalah 12, 24, ... sehingga KPK(4, 6) = 12. Cara cepat: faktorisasi prima, lalu kalikan semua faktor prima dengan pangkat terbesar. KPK(4, 6): 4 = 2^2, 6 = 2 x 3, maka KPK = 2^2 x 3 = 12.$t$)),
  (gen_random_uuid(), a6, 'HEADING', 7, jsonb_build_object('text', $t$FPB: Faktor Persekutuan Terbesar$t$)),
  (gen_random_uuid(), a6, 'PARAGRAPH', 8, jsonb_build_object('text', $t$FPB adalah faktor bersama terbesar dari dua bilangan atau lebih. Contoh: faktor 12 = 1, 2, 3, 4, 6, 12; faktor 18 = 1, 2, 3, 6, 9, 18. Faktor bersamanya adalah 1, 2, 3, 6 sehingga FPB(12, 18) = 6. Cara cepat: faktorisasi prima, lalu kalikan faktor prima yang sama dengan pangkat terkecil. FPB(12, 18): 12 = 2^2 x 3, 18 = 2 x 3^2, maka FPB = 2 x 3 = 6.$t$)),
  (gen_random_uuid(), a6, 'HEADING', 9, jsonb_build_object('text', $t$Soal Cerita$t$)),
  (gen_random_uuid(), a6, 'LIST', 10, jsonb_build_object('items', ARRAY[
    $t$Lampu A menyala tiap 4 detik, lampu B tiap 6 detik. Kapan keduanya menyala bersama? (KPK = 12 detik)$t$,
    $t$Ibu punya 12 apel dan 18 jeruk, ingin dibuat parsel sama banyak. Berapa parsel terbanyak? (FPB = 6 parsel)$t$
  ])),
  (gen_random_uuid(), a6, 'HEADING', 11, jsonb_build_object('text', $t$Latihan dan Kunci Jawaban$t$)),
  (gen_random_uuid(), a6, 'LIST', 12, jsonb_build_object('items', ARRAY[
    $t$1. KPK dari 6 dan 8 = 24$t$,
    $t$2. FPB dari 15 dan 25 = 5$t$,
    $t$3. KPK dari 9 dan 12 = 36; FPB dari 9 dan 12 = 3$t$
  ]));
END;
$do$;

COMMIT;
