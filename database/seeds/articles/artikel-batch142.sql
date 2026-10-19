-- Batch 142: 9 artikel Keterampilan tambahan (idempoten)
-- Dibuat: 2026-10-19 (Fase 4, Explore)

-- EXP-KET-142: Memasak Telur: 5 Teknik Dasar
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('f9f9f9f9-0001-4000-8000-000000000001', 'EXP-KET-142', 'b8888888-8888-8888-8888-888888888888', 'Memasak Telur: 5 Teknik Dasar', 'memasak-telur-5-teknik', 'Ceplok, dadar, rebus, orak-arik, poached — teknik dan timing tiap jenis masakan telur.', 'id', 5, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-KET-142';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'LIST', 0, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Ceplok: minyak panas, api sedang, 2-3 menit; tutup untuk kuning setengah matang$li$,
      $li$Dadar: kocok + garam; api kecil, gulung$li$,
      $li$Rebus: air mendidih, 6 mnt (setengah), 9-10 mnt (matang); rendam air es agar mudah kupas$li$,
      $li$Orak-arik: api sedang, aduk terus, angkat saat masih creamy$li$,
      $li$Telur segar tenggelam di air; yang mengapung sudah tidak segar$li$
  ])));
END $doblk$;

-- EXP-KET-143: Menyeterika Baju dengan Benar
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('f9f9f9f9-0002-4000-8000-000000000002', 'EXP-KET-143', 'b8888888-8888-8888-8888-888888888888', 'Menyeterika Baju dengan Benar', 'menyeterika-baju-benar', 'Urutan menyeterika, suhu per bahan, dan trik licin tanpa lengket.', 'id', 5, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-KET-143';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'LIST', 0, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Urutan: kerah → bahu → lengan → badan (dari suhu rendah ke tinggi)$li$,
      $li$Sutra/sintetis: suhu rendah; katun/linen: tinggi + uap$li$,
      $li$Semprot air untuk kusut membandel; setrika dari dalam untuk sablon$li$,
      $li$Bersihkan kerak: gosokkan ke daun pisang / garam kasar$li$
  ])));
END $doblk$;

-- EXP-KET-144: Merawat Sepatu Kulit dan Sneakers
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('f9f9f9f9-0003-4000-8000-000000000003', 'EXP-KET-144', 'b8888888-8888-8888-8888-888888888888', 'Merawat Sepatu', 'merawat-sepatu-kulit-sneakers', 'Cuci sneakers tanpa mesin, semir kulit, dan menghilangkan bau.', 'id', 5, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-KET-144';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'LIST', 0, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Sneakers: sikat lembut + sabun, jangan mesin cuci; keringkan angin (bukan matahari langsung)$li$,
      $li$Kulit: bersihkan debu, oles conditioner/semir sewarna, buff$li$,
      $li$Bau: tabur baking soda semalaman, kibas pagi$li$,
      $li$Simpan dengan shoe tree/gulungan koran agar bentuk terjaga$li$
  ])));
END $doblk$;

-- EXP-KET-145: Membuat Kopi Tubruk dan V60 Sederhana
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('f9f9f9f9-0004-4000-8000-000000000004', 'EXP-KET-145', 'b8888888-8888-8888-8888-888888888888', 'Membuat Kopi Tubruk dan V60', 'kopi-tubruk-v60-sederhana', 'Rasio kopi-air, suhu, dan teknik seduh untuk kopi enak di rumah tanpa alat mahal.', 'id', 5, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-KET-145';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'LIST', 0, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Tubruk: 10-12 gr kopi + 150 ml air 90-96°C; aduk, tunggu 4 menit$li$,
      $li$V60: rasio 1:15 (15 gr : 225 ml); tuang melingkar 3 tahap$li$,
      $li$Gilingan: tubruk halus, V60 medium$li$,
      $li$Air terlalu panas = pahit; terlalu dingin = asam hambar$li$
  ])));
END $doblk$;

-- EXP-KET-146: Packing Efisien untuk Traveling
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('f9f9f9f9-0005-4000-8000-000000000005', 'EXP-KET-146', 'b8888888-8888-8888-8888-888888888888', 'Packing Efisien untuk Traveling', 'packing-efisien-traveling', 'Teknik rolling, packing cubes, dan daftar bawaan agar koper muat dan rapi.', 'id', 5, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-KET-146';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'LIST', 0, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Rolling (gulung) hemat tempat 30% vs lipat untuk kaus$li$,
      $li$Aturan 5-4-3-2-1 (seminggu): 5 atasan, 4 bawahan, 3 pasang sepatu... sesuaikan$li$,
      $li$Cairan <100 ml di tas transparan untuk kabin$li$,
      $li$Dokumen & obat di tas kecil yang selalu dibawa$li$,
      $li$Sisakan ruang untuk oleh-oleh$li$
  ])));
END $doblk$;

-- EXP-KET-147: Dasar Pertukangan: Palu, Gergaji, Bor
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('f9f9f9f9-0006-4000-8000-000000000006', 'EXP-KET-147', 'b8888888-8888-8888-8888-888888888888', 'Dasar Pertukangan', 'dasar-pertukangan-palu-gergaji', 'Tiga perkakas wajib dan cara pakai yang aman: palu, gergaji tangan, bor listrik.', 'id', 6, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-KET-147';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'LIST', 0, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Palu: pegang ujung gagang untuk tenaga; paku dipegang miring dulu$li$,
      $li$Gergaji: tarik-dorong ringan, biarkan gigi yang bekerja; jepit kayu$li$,
      $li$Bor: tandai dulu (paku kecil); mulai pelan; pakai mata sesuai bahan$li$,
      $li$Keselamatan: kacamata, jauhkan jari dari mata pisau, cabut listrik saat ganti mata$li$
  ])));
END $doblk$;

-- EXP-KET-148: Merawat Tanaman Hias Indoor
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('f9f9f9f9-0007-4000-8000-000000000007', 'EXP-KET-148', 'b8888888-8888-8888-8888-888888888888', 'Merawat Tanaman Hias Indoor', 'tanaman-hias-indoor', 'Monstera, lidah mertua, sirih gading: cahaya, air, dan hama untuk tanaman dalam ruangan.', 'id', 5, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-KET-148';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'LIST', 0, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Cahaya: dekat jendela terang tak langsung; lidah mertua tahan gelap$li$,
      $li$Air: cek 2 cm tanah atas kering baru siram; lebih banyak mati karena overwater$li$,
      $li$Hama: kutu putih → lap alkohol; semut → cek kutu (simbiosis)$li$,
      $li$Pupuk: sebulan sekali dosis setengah$li$
  ])));
END $doblk$;

-- EXP-KET-149: Menambal Ban Tubeless Darurat
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('f9f9f9f9-0008-4000-8000-000000000008', 'EXP-KET-149', 'b8888888-8888-8888-8888-888888888888', 'Menambal Ban Tubeless Darurat', 'menambal-ban-tubeless', 'Tambal cacing (string) untuk ban tubeless bocor paku: alat, langkah, dan batasnya.', 'id', 5, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-KET-149';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'LIST', 0, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Alat: kit tambal cacing (kikir + jarum + string + lem), pompa$li$,
      $li$Cabut paku, kikir lubang, masukkan string berlem, tarik hingga sisa 1 cm, potong$li$,
      $li$Pompa; cek bocor dengan air sabun$li$,
      $li$Sementara! Segera ke tukang ban untuk tambal permanen (tip-top)$li$
  ])));
END $doblk$;

-- EXP-KET-150: Membuat Sabun Cuci Piring Sendiri
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('f9f9f9f9-0009-4000-8000-000000000009', 'EXP-KET-150', 'b8888888-8888-8888-8888-888888888888', 'Sabun Cuci Piring Alami', 'sabun-cuci-piring-alami', 'Resep sabun cuci piring dari lerak/mahkota dewa: hemat, ramah lingkungan.', 'id', 5, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-KET-150';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 0, jsonb_build_object('text', $txt$Buah lerak mengandung saponin (busa alami). Rebus 10 buah lerak + 1 liter air 30 menit, saring, tambah 1 sdm cuka sebagai pengawet. Simpan di botol, tahan 2 minggu di suhu ruang. Untuk noda berat, tetap butuh sabun pabrik — ini untuk cuci harian ringan.$txt$));
END $doblk$;
