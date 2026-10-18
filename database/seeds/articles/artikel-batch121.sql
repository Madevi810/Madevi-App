-- Batch 121: 5 artikel pendamping tools (idempoten)
-- Dibuat: 2026-10-18

-- TUT-KEUANGAN-121: Flat vs Anuitas: Pilih Cicilan yang Paling Menguntungkan
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('c0c3b85b-e90a-4dfd-841c-85afb3c276c4', 'TUT-KEUANGAN-121', 'b8888888-8888-8888-8888-888888888888', 'Flat vs Anuitas: Pilih Cicilan yang Paling Menguntungkan', 'flat-vs-anuitas-pilih-cicilan', 'Panduan memahami perbedaan bunga flat dan anuitas pada cicilan — lengkap dengan contoh hitungan dan kapan masing-masing menguntungkan.', 'id', 7, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;

DO $doblk$
DECLARE v_id uuid;
BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'TUT-KEUANGAN-121';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', $txt$Masalah: Cicilan Terasa Berat, Total Bayar Membengkak$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 1, jsonb_build_object('text', $txt$Banyak orang kaget saat menghitung total yang dibayar selama masa cicilan: pinjam Rp100 juta, total bayar bisa Rp130-140 juta. Sebagian karena tidak paham metode bunga yang dipakai bank atau leasing — flat atau anuitas — sehingga salah membandingkan penawaran.$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', $txt$Penjelasan: Beda Flat dan Anuitas$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 3, jsonb_build_object('text', $txt$Bunga flat dihitung dari pokok awal selama seluruh tenor — total bunga dibagi rata per bulan. Bunga anuitas dihitung dari sisa pokok tiap bulan, sehingga porsi bunga besar di awal dan mengecil di akhir, tetapi total bunga lebih kecil untuk tenor yang sama. Contoh: pinjam Rp120 juta, bunga 12% per tahun, tenor 12 bulan. Flat: cicilan Rp11,2 juta/bulan, total bunga Rp14,4 juta. Anuitas: cicilan sekitar Rp10,66 juta/bulan, total bunga sekitar Rp7,9 juta.$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 4, jsonb_build_object('text', $txt$Persiapan: Data yang Dibutuhkan$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'LIST', 5, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Nominal pokok pinjaman$li$,
      $li$Bunga per tahun (tanyakan apakah flat atau efektif/anuitas)$li$,
      $li$Tenor dalam bulan$li$,
      $li$Biaya-biaya lain: provisi, asuransi, administrasi$li$
  ])));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 6, jsonb_build_object('text', $txt$Langkah: Membandingkan Penawaran$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'LIST', 7, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$1. Minta simulasi cicilan tertulis dari tiap bank/leasing$li$,
      $li$2. Tanyakan eksplisit: bunganya flat atau anuitas/efektif?$li$,
      $li$3. Hitung total bayar = cicilan per bulan x tenor$li$,
      $li$4. Tambahkan semua biaya ke perbandingan$li$,
      $li$5. Pilih total bayar terkecil dengan cicilan maksimal 30% penghasilan$li$
  ])));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 8, jsonb_build_object('text', $txt$Risiko$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 9, jsonb_build_object('text', $txt$Waspadai bunga flat yang terlihat kecil tetapi setara bunga efektif yang jauh lebih tinggi. Jangan tergiur tenor panjang yang cicilannya kecil tetapi total bunganya berlipat.$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 10, jsonb_build_object('text', $txt$Penyelesaian$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 11, jsonb_build_object('text', $txt$Gunakan Kalkulator Cicilan di Madevi untuk mensimulasikan kedua metode sebelum tanda tangan. Aturan praktis: untuk tenor di atas 2 tahun, anuitas hampir selalu lebih murah.$txt$));
END $doblk$;

-- TUT-KEAMANAN-121: Password Aman: Cara Membuat dan Mengelolanya
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('ac0dc0fe-1542-4780-b0f3-a67a9930267d', 'TUT-KEAMANAN-121', 'b6666666-6666-6666-6666-666666666666', 'Password Aman: Cara Membuat dan Mengelolanya', 'password-aman-cara-membuat-mengelola', 'Panduan membuat password kuat, memakai password manager, dan mengaktifkan verifikasi dua langkah untuk semua akun penting.', 'id', 6, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;

DO $doblk$
DECLARE v_id uuid;
BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'TUT-KEAMANAN-121';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', $txt$Masalah: Satu Password untuk Semua Akun$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 1, jsonb_build_object('text', $txt$Kebanyakan orang memakai satu password yang sama untuk email, bank, dan media sosial. Sekali bocor di satu layanan, semua akun ikut jebol.$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', $txt$Penjelasan: Apa yang Membuat Password Kuat$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 3, jsonb_build_object('text', $txt$Kekuatan password diukur dari entropi: kombinasi panjang dan variasi karakter. Password 8 karakter huruf kecil hanya punya 37 bit entropi — bisa dibobol dalam hitungan jam. Password 16 karakter campuran mencapai 100+ bit — butuh miliaran tahun untuk brute force.$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 4, jsonb_build_object('text', $txt$Persiapan$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'LIST', 5, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Daftar akun penting: email utama, bank/e-wallet, media sosial$li$,
      $li$Install password manager (mis. Bitwarden — gratis)$li$,
      $li$Aktifkan verifikasi dua langkah (2FA) di akun penting$li$
  ])));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 6, jsonb_build_object('text', $txt$Langkah$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'LIST', 7, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$1. Buat password unik minimal 16 karakter untuk tiap akun penting$li$,
      $li$2. Simpan di password manager, bukan catatan HP$li$,
      $li$3. Aktifkan 2FA (aplikasi authenticator lebih aman dari SMS)$li$,
      $li$4. Ganti password yang dipakai ulang, mulai dari email utama$li$,
      $li$5. Cek kebocoran di haveibeenpwned.com berkala$li$
  ])));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 8, jsonb_build_object('text', $txt$Risiko$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 9, jsonb_build_object('text', $txt$Jangan pernah membagikan password lewat chat atau email. Waspadai phishing: cek alamat situs sebelum login.$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 10, jsonb_build_object('text', $txt$Penyelesaian$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 11, jsonb_build_object('text', $txt$Target realistis: dalam seminggu, semua akun penting sudah berpassword unik 16+ karakter dan ber-2FA. Keamanan bukan soal ingatan kuat, melainkan sistem yang benar.$txt$));
END $doblk$;

-- TUT-UMKM-121: PPN dan PPh untuk UMKM: Kapan Wajib, Berapa Tarifnya
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('0701c763-abe6-4b3b-a150-b0cfbcb7ff22', 'TUT-UMKM-121', 'b8888888-8888-8888-8888-888888888888', 'PPN dan PPh untuk UMKM: Kapan Wajib, Berapa Tarifnya', 'ppn-pph-untuk-umkm', 'Panduan pajak untuk pelaku UMKM: kapan wajib pungut PPN 11%, tarif PPh final 0,5%, dan cara menghitungnya.', 'id', 8, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;

DO $doblk$
DECLARE v_id uuid;
BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'TUT-UMKM-121';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', $txt$Masalah: Takut Salah Hitung Pajak$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 1, jsonb_build_object('text', $txt$Banyak pelaku UMKM bingung: apakah harga jual harus ditambah PPN? Berapa pajak yang harus disetor tiap bulan? Ketidaktahuan berujung menanggung pajak dari kantong sendiri atau terkena denda.$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', $txt$Penjelasan: Dua Pajak yang Berbeda$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 3, jsonb_build_object('text', $txt$PPN 11% dipungut dari pembeli — Anda hanya perantara yang menyetorkannya ke negara. Kewajiban PKP berlaku bila omzet melebihi Rp4,8 miliar per tahun. PPh Final UMKM 0,5% dikenakan atas omzet bruto per bulan bagi UMKM beromzet sampai Rp4,8 miliar/tahun.$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 4, jsonb_build_object('text', $txt$Persiapan$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'LIST', 5, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Catat omzet bulanan dengan rapi$li$,
      $li$Pisahkan harga jual dan PPN di nota bila sudah PKP$li$,
      $li$Siapkan NPWP dan akun DJP Online$li$
  ])));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 6, jsonb_build_object('text', $txt$Langkah$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'LIST', 7, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$1. Cek omzet tahunan: di bawah Rp4,8 M pakai PPh final 0,5% dari omzet bulanan$li$,
      $li$2. Setor PPh final tiap bulan via DJP Online$li$,
      $li$3. Bila omzet mendekati Rp4,8 M, siapkan diri menjadi PKP$li$,
      $li$4. Gunakan Kalkulator PPN di Madevi untuk memisahkan DPP dan PPN$li$,
      $li$5. Simpan semua bukti setor$li$
  ])));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 8, jsonb_build_object('text', $txt$Risiko$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 9, jsonb_build_object('text', $txt$Jangan mencampur uang pajak dengan uang usaha. Keterlambatan lapor dan setor kena denda dan bunga.$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 10, jsonb_build_object('text', $txt$Penyelesaian$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 11, jsonb_build_object('text', $txt$Dengan pembukuan rapi dan setor tepat waktu, pajak menjadi biaya rutin yang terprediksi. Mulai bulan ini: catat omzet harian, hitung 0,5%-nya, dan sisihkan langsung.$txt$));
END $doblk$;

-- TUT-SEHAT-121: BMI: Cara Membaca Indeks Massa Tubuh dengan Benar
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('d2b5dc8c-b20a-49e9-94c6-1dfb739924f1', 'TUT-SEHAT-121', 'b7777777-7777-7777-7777-777777777777', 'BMI: Cara Membaca Indeks Massa Tubuh dengan Benar', 'bmi-cara-membaca-indeks-massa-tubuh', 'Panduan memahami BMI: cara menghitung, arti tiap kategori, keterbatasannya, dan langkah realistis menuju berat ideal.', 'id', 5, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;

DO $doblk$
DECLARE v_id uuid;
BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'TUT-SEHAT-121';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', $txt$Masalah: Angka Timbangan Naik-Turun Tanpa Arti$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 1, jsonb_build_object('text', $txt$Berat 70 kg bisa berarti ideal bagi yang tingginya 175 cm, tetapi berlebih bagi yang tingginya 160 cm. Tanpa pembanding terhadap tinggi badan, angka timbangan tidak memberi informasi kesehatan yang berguna.$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', $txt$Penjelasan: Rumus dan Kategori BMI$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 3, jsonb_build_object('text', $txt$BMI = berat (kg) dibagi tinggi (m) kuadrat. Kategori: di bawah 18,5 kurus; 18,5-24,9 normal; 25-29,9 gemuk; 30 ke atas obesitas. Contoh: 65 kg / (1,7 x 1,7) = 22,5 = normal.$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 4, jsonb_build_object('text', $txt$Persiapan$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'LIST', 5, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Timbangan badan dan meteran tinggi$li$,
      $li$Catat berat dan tinggi dengan jujur$li$,
      $li$Kalkulator BMI di Madevi$li$
  ])));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 6, jsonb_build_object('text', $txt$Langkah$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'LIST', 7, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$1. Hitung BMI dengan Kalkulator BMI di Madevi$li$,
      $li$2. Lihat rentang berat ideal untuk tinggi Anda$li$,
      $li$3. Target realistis: 0,5 kg per minggu$li$,
      $li$4. Fokus kebiasaan: porsi makan, aktivitas 150 menit/minggu$li$,
      $li$5. Timbang ulang tiap 2 minggu$li$
  ])));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 8, jsonb_build_object('text', $txt$Risiko$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 9, jsonb_build_object('text', $txt$Hindari diet ekstrem lebih dari 1 kg per minggu. BMI tidak akurat untuk anak, ibu hamil, lansia, dan atlet. Bila BMI di atas 30, konsultasikan ke dokter.$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 10, jsonb_build_object('text', $txt$Penyelesaian$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 11, jsonb_build_object('text', $txt$Perubahan kecil yang konsisten dalam 3 bulan menggeser BMI lebih pasti daripada diet ketat seminggu.$txt$));
END $doblk$;

-- TUT-BELANJA-121: Diskon 50% + 20% Bukan 70%: Membaca Promo dengan Cerdas
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('144df178-ac37-442d-9c86-a0e49ffa07fa', 'TUT-BELANJA-121', 'b8888888-8888-8888-8888-888888888888', 'Diskon 50% + 20% Bukan 70%: Membaca Promo dengan Cerdas', 'diskon-cara-membaca-promo-cerdas', 'Panduan membaca diskon bertingkat, membedakan promo asli dan harga yang dinaikkan dulu, serta strategi belanja hemat.', 'id', 5, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;

DO $doblk$
DECLARE v_id uuid;
BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'TUT-BELANJA-121';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', $txt$Masalah: Merasa Hemat, Ternyata Tidak$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 1, jsonb_build_object('text', $txt$Label "diskon 50% + 20%" membuat kita merasa hemat 70%. Faktanya: Rp100 ribu didiskon 50% menjadi Rp50 ribu, lalu 20% menjadi Rp40 ribu — total hemat 60%, bukan 70%.$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', $txt$Penjelasan: Matematika Diskon Bertingkat$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 3, jsonb_build_object('text', $txt$Setiap lapisan diskon dihitung dari harga setelah diskon sebelumnya. Rumus: harga akhir = harga awal x (1-d1) x (1-d2). Contoh: 100.000 x 0,5 x 0,8 = 40.000.$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 4, jsonb_build_object('text', $txt$Persiapan$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'LIST', 5, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Catat harga normal barang incaran sebelum musim promo$li$,
      $li$Bandingkan harga di 2-3 toko$li$,
      $li$Kalkulator Diskon di Madevi$li$
  ])));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 6, jsonb_build_object('text', $txt$Langkah$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'LIST', 7, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$1. Masukkan harga dan diskon ke Kalkulator Diskon di Madevi$li$,
      $li$2. Lihat persen efektif — itulah hemat sebenarnya$li$,
      $li$3. Bandingkan dengan toko lain$li$,
      $li$4. Cek syarat: minimum belanja, ongkir$li$,
      $li$5. Beli karena butuh dan harganya turun$li$
  ])));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 8, jsonb_build_object('text', $txt$Risiko$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 9, jsonb_build_object('text', $txt$Promo hitung mundur dirancang memicu keputusan impulsif. Barang yang tidak dipakai adalah pemborosan 100%, berapapun diskonnya.$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 10, jsonb_build_object('text', $txt$Penyelesaian$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 11, jsonb_build_object('text', $txt$Pembeli cerdas tidak anti-diskon — ia hanya menghitung dulu. Setiap rupiah yang dihemat benar-benar kembali ke kantong Anda.$txt$));
END $doblk$;
