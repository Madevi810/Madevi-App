-- Batch 127: 5 artikel Kesehatan - Tubuh (idempoten)
-- Dibuat: 2026-10-19 (Fase 4, Explore)
-- CATATAN: konten edukasi umum, bukan pengganti saran medis profesional.

-- EXP-KES-127: Gizi Seimbang: Isi Piringku
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('d6d6d6d6-0001-4000-8000-000000000001', 'EXP-KES-127', 'b8888888-8888-8888-8888-888888888888', 'Gizi Seimbang: Isi Piringku', 'gizi-seimbang-isi-piringku', 'Panduan gizi seimbang ala Kemenkes: komposisi piring, makro dan mikronutrien, plus tips hemat makan sehat.', 'id', 7, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;

DO $doblk$
DECLARE v_id uuid;
BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-KES-127';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', $txt$Isi Piringku$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 1, jsonb_build_object('text', $txt$Kemenkes menganjurkan: setengah piring berisi sayur dan buah, seperempat lauk (protein), seperempat makanan pokok (karbohidrat). Lengkapi dengan air putih 8 gelas sehari, batasi gula-garam-lemak.$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', $txt$Makronutrien$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'LIST', 3, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Karbohidrat: sumber energi utama — nasi, roti, ubi, jagung$li$,
      $li$Protein: pembangun tubuh — telur, ikan, ayam, tempe, tahu$li$,
      $li$Lemak: cadangan energi dan pelindung organ — alpukat, kacang, minyak (secukupnya)$li$
  ])));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 4, jsonb_build_object('text', $txt$Tips Hemat$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 5, jsonb_build_object('text', $txt$Tempe dan telur adalah protein murah berkualitas tinggi. Sayur musiman lebih murah dan segar. Masak sendiri jauh lebih hemat dan sehat daripada jajan. Catatan: ini edukasi umum; konsultasikan ke dokter/ahli gizi untuk kondisi khusus.$txt$));
END $doblk$;

-- EXP-KES-128: Tidur Berkualitas: Mengapa dan Bagaimana
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('d6d6d6d6-0002-4000-8000-000000000002', 'EXP-KES-128', 'b8888888-8888-8888-8888-888888888888', 'Tidur Berkualitas: Mengapa dan Bagaimana', 'tidur-berkualitas-mengapa-bagaimana', 'Ilmu tidur: siklus tidur, kebutuhan per usia, dampak kurang tidur, dan 7 kebiasaan sleep hygiene.', 'id', 7, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;

DO $doblk$
DECLARE v_id uuid;
BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-KES-128';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', $txt$Kebutuhan Tidur$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'LIST', 1, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Dewasa: 7-9 jam per malam$li$,
      $li$Remaja: 8-10 jam$li$,
      $li$Anak: 9-12 jam$li$,
      $li$Kualitas sama pentingnya dengan kuantitas$li$
  ])));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', $txt$Sleep Hygiene$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'LIST', 3, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Tidur dan bangun di jam yang sama tiap hari$li$,
      $li$Jauhi layar HP 1 jam sebelum tidur (cahaya biru menekan melatonin)$li$,
      $li$Kamar gelap, sejuk, dan tenang$li$,
      $li$Hindari kafein setelah jam 2 siang$li$,
      $li$Olahraga rutin, tapi tidak menjelang tidur$li$
  ])));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 4, jsonb_build_object('text', $txt$Dampak Kurang Tidur$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 5, jsonb_build_object('text', $txt$Kurang tidur kronis menurunkan konsentrasi, daya tahan tubuh, dan meningkatkan risiko obesitas, diabetes, dan gangguan mental. Jika sulit tidur berkepanjangan, konsultasikan ke dokter.$txt$));
END $doblk$;

-- EXP-KES-129: Kesehatan Mental: Stres, Cemas, dan Cara Mengelolanya
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('d6d6d6d6-0003-4000-8000-000000000003', 'EXP-KES-129', 'b8888888-8888-8888-8888-888888888888', 'Kesehatan Mental: Stres, Cemas, dan Cara Mengelolanya', 'kesehatan-mental-stres-cemas', 'Memahami stres dan kecemasan: tanda-tandanya, teknik pengelolaan mandiri, dan kapan harus mencari bantuan profesional.', 'id', 8, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;

DO $doblk$
DECLARE v_id uuid;
BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-KES-129';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', $txt$Mengenali Tanda$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'LIST', 1, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Fisik: sakit kepala, otot tegang, sulit tidur, nafsu makan berubah$li$,
      $li$Emosi: mudah marah, sedih berkepanjangan, merasa kewalahan$li$,
      $li$Perilaku: menarik diri, menunda pekerjaan, menghindar$li$
  ])));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', $txt$Teknik Mandiri$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'LIST', 3, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Napas 4-7-8: tarik 4 detik, tahan 7, hembus 8$li$,
      $li$Olahraga 30 menit: menurunkan hormon stres$li$,
      $li$Tulis jurnal: keluarkan pikiran ke kertas$li$,
      $li$Batasi kafein dan alkohol$li$,
      $li$Cerita ke orang terpercaya$li$
  ])));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 4, jsonb_build_object('text', $txt$Kapan Cari Bantuan$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 5, jsonb_build_object('text', $txt$Jika gejala mengganggu aktivitas harian lebih dari 2 minggu, atau ada pikiran menyakiti diri, SEGERA hubungi profesional: Kemenkes 119 ext 8 (24 jam, gratis). Mencari bantuan adalah tanda kekuatan, bukan kelemahan.$txt$));
END $doblk$;

-- EXP-KES-130: Olahraga untuk Pemula: Mulai dari Nol
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('d6d6d6d6-0004-4000-8000-000000000004', 'EXP-KES-130', 'b8888888-8888-8888-8888-888888888888', 'Olahraga untuk Pemula: Mulai dari Nol', 'olahraga-pemula-mulai-nol', 'Panduan olahraga untuk yang tidak pernah olahraga: jenis, frekuensi, intensitas, dan cara membangun kebiasaan.', 'id', 6, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;

DO $doblk$
DECLARE v_id uuid;
BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-KES-130';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', $txt$Mulai Kecil$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 1, jsonb_build_object('text', $txt$WHO menganjurkan 150 menit aktivitas sedang per minggu (misalnya jalan cepat 30 menit x 5 hari). Untuk pemula: mulai 10 menit sehari, tambah bertahap. Konsistensi mengalahkan intensitas.$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', $txt$Jenis Olahraga$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'LIST', 3, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Kardio: jalan cepat, jogging, bersepeda, berenang — untuk jantung$li$,
      $li$Kekuatan: push-up, squat, plank — untuk otot dan tulang$li$,
      $li$Fleksibilitas: peregangan, yoga — mencegah cedera$li$,
      $li$Pilih yang kamu nikmati agar bertahan lama$li$
  ])));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 4, jsonb_build_object('text', $txt$Aman$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 5, jsonb_build_object('text', $txt$Pemanasan 5 menit sebelum, pendinginan setelah. Hentikan jika nyeri tajam, pusing, atau sesak. Jika punya kondisi kesehatan (jantung, diabetes), konsultasi dokter dulu sebelum mulai program baru.$txt$));
END $doblk$;

-- EXP-KES-131: P3K Dasar di Rumah
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('d6d6d6d6-0005-4000-8000-000000000005', 'EXP-KES-131', 'b8888888-8888-8888-8888-888888888888', 'P3K Dasar di Rumah', 'p3k-dasar-di-rumah', 'Pertolongan pertama untuk luka ringan, luka bakar, tersedak, dan mimisan — plus isi kotak P3K yang wajib ada.', 'id', 7, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;

DO $doblk$
DECLARE v_id uuid;
BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-KES-131';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', $txt$Isi Kotak P3K$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'LIST', 1, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Plester, kasa steril, perban$li$,
      $li$Antiseptik (povidone iodine)$li$,
      $li$Gunting kecil, pinset$li$,
      $li$Sarung tangan sekali pakai$li$,
      $li$Obat dasar: paracetamol, oralit$li$
  ])));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', $txt$Penanganan$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'LIST', 3, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Luka ringan: tekan dengan kasa bersih, bersihkan dengan air mengalir, oles antiseptik, tutup plester$li$,
      $li$Luka bakar ringan: dinginkan dengan air mengalir 10-20 menit, JANGAN oles odol/mentega$li$,
      $li$Mimisan: duduk tegak, condong ke depan, pencet hidung 10-15 menit$li$,
      $li$Tersedak (sadar): dorong perut ke atas dari belakang (manuver Heimlich)$li$
  ])));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 4, jsonb_build_object('text', $txt$Kapan ke RS$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 5, jsonb_build_object('text', $txt$Segera ke IGD jika: perdarahan tak berhenti, luka dalam/lebar, luka bakar luas, pingsan, sesak napas, atau curiga patah tulang. Nomor darurat: 119.$txt$));
END $doblk$;
