-- Batch 126: 5 artikel Teknologi - Komputer (idempoten)
-- Dibuat: 2026-10-19 (Fase 4, Explore)

-- EXP-TEK-126: Bagaimana Komputer Bekerja? Dari Input hingga Output
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('d5d5d5d5-0001-4000-8000-000000000001', 'EXP-TEK-126', 'b8888888-8888-8888-8888-888888888888', 'Bagaimana Komputer Bekerja? Dari Input hingga Output', 'bagaimana-komputer-bekerja', 'Siklus IPO (Input-Proses-Output): komponen komputer, cara CPU memproses data, dan peran memori.', 'id', 7, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;

DO $doblk$
DECLARE v_id uuid;
BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-TEK-126';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', $txt$Siklus IPO$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 1, jsonb_build_object('text', $txt$Semua komputer bekerja dalam siklus: Input (data masuk lewat keyboard, mouse, kamera), Proses (CPU mengolah data), Output (hasil tampil di layar, speaker, printer). Ditambah Penyimpanan (data disimpan di SSD/hard disk) dan ada siklus lengkapnya.$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', $txt$Komponen Utama$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'LIST', 3, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$CPU (prosesor): "otak" yang menjalankan instruksi, diukur dalam GHz$li$,
      $li$RAM: memori kerja sementara; makin besar makin lancar multitasking$li$,
      $li$Penyimpanan (SSD/HDD): data permanen; SSD jauh lebih cepat dari HDD$li$,
      $li$GPU: pengolah grafis, penting untuk game dan desain$li$,
      $li$Motherboard: papan utama penghubung semua komponen$li$
  ])));
END $doblk$;

-- EXP-TEK-127: Internet: Bagaimana Data Berkeliling Dunia
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('d5d5d5d5-0002-4000-8000-000000000002', 'EXP-TEK-127', 'b8888888-8888-8888-8888-888888888888', 'Internet: Bagaimana Data Berkeliling Dunia', 'internet-data-berkeliling-dunia', 'Perjalanan data internet: dari HP kamu ke server dan kembali, peran kabel bawah laut, WiFi, dan IP address.', 'id', 8, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;

DO $doblk$
DECLARE v_id uuid;
BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-TEK-127';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', $txt$Perjalanan Satu Klik$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 1, jsonb_build_object('text', $txt$Saat kamu buka website: HP mengirim permintaan lewat WiFi ke router, diteruskan ke ISP, melintasi kabel serat optik (sebagian di dasar laut!), sampai ke server. Server mengirim balik data website melewati rute yang sama. Semua dalam sepersekian detik.$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', $txt$Konsep Kunci$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'LIST', 3, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$IP Address: "alamat rumah" tiap perangkat di internet, misalnya 192.168.1.1$li$,
      $li$DNS: "buku telepon" yang mengubah nama (google.com) menjadi IP$li$,
      $li$Paket data: data dipecah kecil-kecil, dikirim terpisah, disusun ulang di tujuan$li$,
      $li$Kabel bawah laut: 99% data antar-benua lewat kabel serat optik di dasar laut$li$
  ])));
END $doblk$;

-- EXP-TEK-128: Keamanan Digital: Password, Phishing, dan Malware
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('d5d5d5d5-0003-4000-8000-000000000003', 'EXP-TEK-128', 'b8888888-8888-8888-8888-888888888888', 'Keamanan Digital: Password, Phishing, dan Malware', 'keamanan-digital-password-phishing', 'Melindungi diri di dunia digital: password kuat, mengenali phishing, menghindari malware, dan verifikasi dua langkah.', 'id', 8, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;

DO $doblk$
DECLARE v_id uuid;
BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-TEK-128';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', $txt$Password Kuat$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'LIST', 1, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Minimal 12 karakter, campur huruf besar-kecil, angka, simbol$li$,
      $li$Jangan pakai tanggal lahir, nama, atau "123456"$li$,
      $li$Beda password untuk tiap akun penting$li$,
      $li$Aktifkan verifikasi dua langkah (2FA) di email dan bank$li$
  ])));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', $txt$Mengenali Phishing$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 3, jsonb_build_object('text', $txt$Phishing adalah penipuan yang menyamar sebagai pihak terpercaya (bank, marketplace) untuk mencuri data. Ciri-cirinya: pesan mendesak ("akun diblokir!"), link aneh, minta data pribadi. Aturan: jangan klik link dari pesan mencurigakan; buka aplikasi resmi langsung.$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 4, jsonb_build_object('text', $txt$Malware$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 5, jsonb_build_object('text', $txt$Malware (virus, ransomware, spyware) menyusup lewat aplikasi bajakan, lampiran email, atau link. Pencegahan: unduh hanya dari Play Store/App Store resmi, jangan install APK sembarangan, perbarui sistem operasi.$txt$));
END $doblk$;

-- EXP-TEK-129: Kecerdasan Buatan (AI): Cara Kerja Sederhana
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('d5d5d5d5-0004-4000-8000-000000000004', 'EXP-TEK-129', 'b8888888-8888-8888-8888-888888888888', 'Kecerdasan Buatan (AI): Cara Kerja Sederhana', 'kecerdasan-buatan-cara-kerja', 'Apa itu AI dan machine learning: cara AI belajar dari data, contoh penerapan, keterbatasan, dan etika.', 'id', 7, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;

DO $doblk$
DECLARE v_id uuid;
BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-TEK-129';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', $txt$Cara AI Belajar$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 1, jsonb_build_object('text', $txt$AI (machine learning) belajar dari contoh, bukan dari aturan yang diprogram manual. Diberi jutaan gambar kucing, AI menemukan sendiri pola "kucing". Makin banyak data berkualitas, makin pintar. Ini disebut "pelatihan model".$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', $txt$Contoh Penerapan$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'LIST', 3, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Asisten suara dan chatbot$li$,
      $li$Rekomendasi film dan belanja$li$,
      $li$Face unlock di HP$li$,
      $li$Deteksi penyakit dari foto medis$li$,
      $li$Terjemahan bahasa otomatis$li$
  ])));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 4, jsonb_build_object('text', $txt$Keterbatasan$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 5, jsonb_build_object('text', $txt$AI bisa salah (halusinasi), bias dari data latih, dan tidak benar-benar "paham". Selalu verifikasi info penting dari AI. AI adalah alat bantu, bukan pengganti penilaian manusia.$txt$));
END $doblk$;

-- EXP-TEK-130: Merawat HP Agar Awet dan Cepat
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('d5d5d5d5-0005-4000-8000-000000000005', 'EXP-TEK-130', 'b8888888-8888-8888-8888-888888888888', 'Merawat HP Agar Awet dan Cepat', 'merawat-hp-awet-cepat', 'Tips praktis merawat HP: baterai, penyimpanan, keamanan, dan kapan harus ganti — agar HP awet bertahun-tahun.', 'id', 6, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;

DO $doblk$
DECLARE v_id uuid;
BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-TEK-130';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', $txt$Baterai$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'LIST', 1, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Jaga di rentang 20-80% untuk umur baterai optimal$li$,
      $li$Hindari panas berlebih (main game sambil ngecas)$li$,
      $li$Pakai charger asli atau bersertifikat$li$
  ])));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', $txt$Performa$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'LIST', 3, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Hapus aplikasi tak terpakai; sisakan 15-20% penyimpanan kosong$li$,
      $li$Perbarui sistem operasi (kecuali ada bug yang diketahui)$li$,
      $li$Restart berkala seminggu sekali$li$,
      $li$Bersihkan cache aplikasi yang membengkak$li$
  ])));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 4, jsonb_build_object('text', $txt$Fisik$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 5, jsonb_build_object('text', $txt$Pakai case dan tempered glass. Jauhkan dari air dan debu berlebih. Jika baterai kembung, segera ke service center — jangan ditusuk atau ditekan.$txt$));
END $doblk$;
