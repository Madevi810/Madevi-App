-- Batch 124: 5 artikel Biologi - Sains (idempoten)
-- Dibuat: 2026-10-19 (Fase 4, Explore)

-- EXP-BIO-124: Sel: Unit Terkecil Kehidupan
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('d3d3d3d3-0001-4000-8000-000000000001', 'EXP-BIO-124', 'b8888888-8888-8888-8888-888888888888', 'Sel: Unit Terkecil Kehidupan', 'sel-unit-terkecil-kehidupan', 'Mengenal struktur sel tumbuhan dan hewan: membran, inti, mitokondria, kloroplas, dan fungsi masing-masing.', 'id', 7, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;

DO $doblk$
DECLARE v_id uuid;
BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-BIO-124';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', $txt$Teori Sel$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 1, jsonb_build_object('text', $txt$Semua makhluk hidup tersusun dari sel. Ada yang bersel satu (bakteri, amoeba) dan bersel banyak (manusia punya sekitar 30 triliun sel). Sel adalah unit terkecil yang masih menunjukkan ciri kehidupan: bernapas, tumbuh, dan berkembang biak.$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', $txt$Bagian-Bagian Sel$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'LIST', 3, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Membran sel: pembungkus yang mengatur keluar-masuk zat$li$,
      $li$Sitoplasma: cairan tempat organel berada$li$,
      $li$Inti sel (nukleus): pusat kendali berisi DNA$li$,
      $li$Mitokondria: "pembangkit listrik" penghasil energi$li$,
      $li$Kloroplas (tumbuhan saja): tempat fotosintesis$li$,
      $li$Dinding sel (tumbuhan saja): pelindung kaku dari selulosa$li$,
      $li$Vakuola: penyimpan cadangan (besar pada tumbuhan)$li$
  ])));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 4, jsonb_build_object('text', $txt$Sel Tumbuhan vs Hewan$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 5, jsonb_build_object('text', $txt$Sel tumbuhan punya dinding sel, kloroplas, dan vakuola besar — bentuknya kaku seperti bata. Sel hewan tidak punya ketiganya, bentuknya lentur. Keduanya sama-sama punya membran, inti, dan mitokondria.$txt$));
END $doblk$;

-- EXP-BIO-125: Fotosintesis: Dapur Makanan Tumbuhan
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('d3d3d3d3-0002-4000-8000-000000000002', 'EXP-BIO-125', 'b8888888-8888-8888-8888-888888888888', 'Fotosintesis: Dapur Makanan Tumbuhan', 'fotosintesis-dapur-makanan-tumbuhan', 'Proses tumbuhan membuat makanan dari cahaya matahari: bahan, hasil, faktor yang memengaruhi, dan mengapa penting bagi kita.', 'id', 7, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;

DO $doblk$
DECLARE v_id uuid;
BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-BIO-125';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', $txt$Persamaan Fotosintesis$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 1, jsonb_build_object('text', $txt$Air + karbon dioksida + cahaya matahari menjadi glukosa + oksigen. Tepatnya: 6H2O + 6CO2 + cahaya menjadi C6H12O6 + 6O2. Proses ini terjadi di kloroplas yang mengandung klorofil (zat hijau daun).$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', $txt$Faktor yang Memengaruhi$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'LIST', 3, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Intensitas cahaya: makin terang (sampai batas), makin cepat$li$,
      $li$Konsentrasi CO2: bahan baku, makin banyak makin cepat$li$,
      $li$Suhu: optimal sekitar 25-35 derajat; terlalu panas merusak enzim$li$,
      $li$Ketersediaan air: stomata menutup saat kekeringan, CO2 tidak masuk$li$
  ])));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 4, jsonb_build_object('text', $txt$Mengapa Penting?$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 5, jsonb_build_object('text', $txt$Hampir semua energi kehidupan berasal dari fotosintesis: tumbuhan dimakan hewan, hewan dimakan hewan lain. Oksigen yang kita hirup adalah "limbah" fotosintesis. Tanpa tumbuhan, tidak ada makanan dan tidak ada oksigen.$txt$));
END $doblk$;

-- EXP-BIO-126: Sistem Pencernaan Manusia
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('d3d3d3d3-0003-4000-8000-000000000003', 'EXP-BIO-126', 'b8888888-8888-8888-8888-888888888888', 'Sistem Pencernaan Manusia', 'sistem-pencernaan-manusia', 'Perjalanan makanan dari mulut hingga usus: organ pencernaan, enzim, penyerapan nutrisi, dan tips menjaga kesehatan pencernaan.', 'id', 8, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;

DO $doblk$
DECLARE v_id uuid;
BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-BIO-126';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', $txt$Urutan Organ Pencernaan$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'LIST', 1, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Mulut: gigi memotong dan menghaluskan; air liur mulai mencerna karbohidrat$li$,
      $li$Kerongkongan: mendorong makanan ke lambung dengan gerak peristaltik$li$,
      $li$Lambung: asam dan enzim memecah protein; makanan menjadi bubur (kim)$li$,
      $li$Usus halus: penyerapan nutrisi ke darah (panjang sekitar 6 meter!)$li$,
      $li$Usus besar: penyerapan air; sisa menjadi feses$li$,
      $li$Rektum dan anus: pengeluaran sisa$li$
  ])));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', $txt$Organ Pembantu$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 3, jsonb_build_object('text', $txt$Hati menghasilkan empedu untuk mencerna lemak. Pankreas menghasilkan enzim pencernaan dan insulin. Kelenjar ludah menghasilkan air liur. Tanpa mereka, pencernaan tidak lengkap.$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 4, jsonb_build_object('text', $txt$Menjaga Pencernaan$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 5, jsonb_build_object('text', $txt$Kunyah makanan dengan baik, makan serat (sayur-buah), minum air cukup, dan jangan menunda makan terlalu lama agar asam lambung tidak naik. Catatan: artikel ini edukasi umum, bukan pengganti saran dokter.$txt$));
END $doblk$;

-- EXP-BIO-127: Ekosistem dan Rantai Makanan
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('d3d3d3d3-0004-4000-8000-000000000004', 'EXP-BIO-127', 'b8888888-8888-8888-8888-888888888888', 'Ekosistem dan Rantai Makanan', 'ekosistem-dan-rantai-makanan', 'Komponen ekosistem, rantai dan jaring makanan, aliran energi, dan mengapa keseimbangan alam penting.', 'id', 7, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;

DO $doblk$
DECLARE v_id uuid;
BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-BIO-127';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', $txt$Komponen Ekosistem$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'LIST', 1, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Produsen: tumbuhan yang membuat makanan sendiri (fotosintesis)$li$,
      $li$Konsumen: hewan pemakan tumbuhan (herbivora), pemakan hewan (karnivora), atau keduanya (omnivora)$li$,
      $li$Pengurai (dekomposer): bakteri dan jamur yang menguraikan sisa makhluk hidup$li$,
      $li$Komponen tak hidup: air, udara, tanah, cahaya, suhu$li$
  ])));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', $txt$Rantai dan Jaring Makanan$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 3, jsonb_build_object('text', $txt$Rantai makanan: padi dimakan tikus, tikus dimakan ular, ular dimakan elang. Di alam nyata, rantai-rantai ini saling terhubung menjadi jaring-jaring makanan yang rumit. Setiap tingkat disebut trofik.$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 4, jsonb_build_object('text', $txt$Keseimbangan$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 5, jsonb_build_object('text', $txt$Jika satu komponen hilang, ekosistem terganggu. Contoh: ular diburu habis, tikus meledak, padi habis dimakan. Inilah mengapa keanekaragaman hayati penting — semakin beragam, semakin stabil.$txt$));
END $doblk$;

-- EXP-BIO-128: Pewarisan Sifat: Genetika Dasar
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('d3d3d3d3-0005-4000-8000-000000000005', 'EXP-BIO-128', 'b8888888-8888-8888-8888-888888888888', 'Pewarisan Sifat: Genetika Dasar', 'pewarisan-sifat-genetika-dasar', 'Mengapa anak mirip orang tua? Dasar genetika: gen, kromosom, DNA, dan hukum Mendel dengan contoh sederhana.', 'id', 8, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;

DO $doblk$
DECLARE v_id uuid;
BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-BIO-128';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', $txt$DNA, Gen, Kromosom$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 1, jsonb_build_object('text', $txt$DNA adalah "buku resep" tubuh berbentuk tangga berpilin. Gen adalah bagian DNA yang mengatur satu sifat (misalnya warna mata). Kromosom adalah gulungan DNA — manusia punya 46 kromosom (23 dari ayah, 23 dari ibu).$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', $txt$Hukum Mendel$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 3, jsonb_build_object('text', $txt$Gregor Mendel menyilangkan kacang kapri dan menemukan pola: sifat dominan (misalnya biji bulat) menutupi sifat resesif (biji keriput) pada generasi pertama. Sifat resesif muncul kembali di generasi berikutnya dengan rasio khas 3:1.$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 4, jsonb_build_object('text', $txt$Contoh pada Manusia$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 5, jsonb_build_object('text', $txt$Lesung pipi, lidah bisa digulung, dan daun telinga menggantung adalah contoh sifat dominan. Jika salah satu orang tua punya sifat dominan, anak berpeluang besar mewarisinya. Golongan darah juga diwariskan dengan pola yang bisa diprediksi.$txt$));
END $doblk$;
