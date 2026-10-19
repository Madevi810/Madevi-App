-- Batch 132: 5 artikel Keterampilan (idempoten)
-- Dibuat: 2026-10-19 (Fase 4, Explore)

-- EXP-KET-132: Memasak Nasi Sempurna: Tips dan Trik
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('e2e2e2e2-0001-4000-8000-000000000001', 'EXP-KET-132', 'b8888888-8888-8888-8888-888888888888', 'Memasak Nasi Sempurna: Tips dan Trik', 'memasak-nasi-sempurna', 'Takaran air, jenis beras, dan trik agar nasi pulen tidak lembek — dengan rice cooker maupun panci.', 'id', 5, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-KET-132';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', $txt$Takaran$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'LIST', 1, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Beras biasa: 1 gelas beras : 1,2 gelas air (atau se-ruas jari)$li$,
      $li$Beras pera: kurangi air sedikit; beras pulen (Jepang): tambah sedikit$li$,
      $li$Cuci 2-3x sampai air agak jernih; rendam 15-30 menit untuk hasil pulen$li$
  ])));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 2, jsonb_build_object('text', $txt$Trik: setelah matang, diamkan 10 menit (jangan langsung dibuka) lalu aduk dengan centong kayu agar uap merata. Nasi sisa? Simpan di kulkas, kukus/aron ulang — jangan dibiarkan di suhu ruang lebih dari 2 jam.$txt$));
END $doblk$;

-- EXP-KET-133: Berkebun di Lahan Sempit: Hidroponik Sederhana
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('e2e2e2e2-0002-4000-8000-000000000002', 'EXP-KET-133', 'b8888888-8888-8888-8888-888888888888', 'Berkebun di Lahan Sempit: Hidroponik Sederhana', 'hidroponik-sederhana-lahan-sempit', 'Mulai hidroponik wick system dengan botol bekas: alat, nutrisi AB mix, dan tanaman yang cocok.', 'id', 7, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-KET-133';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', $txt$Sistem Wick$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 1, jsonb_build_object('text', $txt$Sistem sumbu (wick) paling sederhana: nutrisi naik lewat sumbu kain ke media tanam. Cocok untuk pemula, tanpa pompa listrik.$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', $txt$Alat dan Bahan$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'LIST', 3, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Botol bekas 1,5L dipotong, netpot, sumbu kain flanel$li$,
      $li$Media: rockwool atau arang sekam$li$,
      $li$Nutrisi AB mix (beli online, murah)$li$,
      $li$Benih: kangkung, bayam, selada, sawi (mudah)$li$
  ])));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 4, jsonb_build_object('text', $txt$Langkah: semai benih di rockwool lembap 3-5 hari; pindah ke netpot; isi botol nutrisi (ikuti dosis kemasan); letak di tempat terang 4-6 jam matahari. Panen kangkung 20-25 hari. Ganti nutrisi tiap 1-2 minggu.$txt$));
END $doblk$;

-- EXP-KET-134: Menjahit Dasar: Tusuk Tangan untuk Pemula
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('e2e2e2e2-0003-4000-8000-000000000003', 'EXP-KET-134', 'b8888888-8888-8888-8888-888888888888', 'Menjahit Dasar: Tusuk Tangan untuk Pemula', 'menjahit-dasar-tusuk-tangan', 'Lima tusuk tangan dasar: jelujur, tikam jejak, feston, sum, dan sembunyi — plus cara memasang kancing.', 'id', 6, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-KET-134';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', $txt$Lima Tusuk Dasar$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'LIST', 1, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Jelujur: tusuk lurus berjarak — untuk sementara/menandai$li$,
      $li$Tikam jejak (backstitch): kuat, untuk jahitan permanen$li$,
      $li$Feston (blanket stitch): merapikan tepi kain$li$,
      $li$Sum: menyambung lipatan tak terlihat (kelim)$li$,
      $li$Sembunyi (slip stitch): menyatukan dua lipatan tanpa terlihat$li$
  ])));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 2, jsonb_build_object('text', $txt$Pasang kancing: tandai posisi, tusuk dari dalam 4-6x melalui lubang kancing, lilit benang di pangkal untuk tangkai, kunci dengan tusuk kecil. Alat: jarum, benang, gunting, kapur jahit, meteran.$txt$));
END $doblk$;

-- EXP-KET-135: Fotografi HP: Komposisi dan Cahaya
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('e2e2e2e2-0004-4000-8000-000000000004', 'EXP-KET-135', 'b8888888-8888-8888-8888-888888888888', 'Fotografi HP: Komposisi dan Cahaya', 'fotografi-hp-komposisi-cahaya', 'Foto bagus dengan HP: rule of thirds, cahaya alami, dan 5 kesalahan umum yang harus dihindari.', 'id', 6, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-KET-135';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', $txt$Komposisi$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'LIST', 1, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Rule of thirds: aktifkan grid, letakkan subjek di garis/titik potong$li$,
      $li$Leading lines: manfaatkan jalan, rel, pagar mengarah ke subjek$li$,
      $li$Ruang pandang: beri ruang di arah hadap/gerak subjek$li$,
      $li$Hindari background berantakan (tiang "tumbuh" dari kepala)$li$
  ])));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 2, jsonb_build_object('text', $txt$Cahaya: golden hour (pagi/sore) terbaik — hangat dan lembut. Hindari matahari tepat atas kepala (bayangan keras). Untuk indoor, dekatkan ke jendela. Ketuk layar untuk fokus + geser untuk exposure sebelum jepret.$txt$));
END $doblk$;

-- EXP-KET-136: Servis Motor Ringan Sendiri
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('e2e2e2e2-0005-4000-8000-000000000005', 'EXP-KET-136', 'b8888888-8888-8888-8888-888888888888', 'Servis Motor Ringan Sendiri', 'servis-motor-ringan-sendiri', 'Perawatan motor yang bisa dilakukan sendiri: oli, rantai, busi, filter udara — hemat biaya bengkel.', 'id', 7, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-KET-136';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', $txt$Jadwal Rutin$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'LIST', 1, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Oli mesin: tiap 2.000-3.000 km (pakai SAE sesuai manual)$li$,
      $li$Rantai: lumasi tiap 500 km, setel kekencangan (jarak main 2-3 cm)$li$,
      $li$Busi: cek/bersihkan tiap 8.000 km, ganti tiap 12.000 km$li$,
      $li$Filter udara: bersihkan tiap 4.000 km, ganti tiap 16.000 km$li$,
      $li$Ban: cek tekanan tiap minggu (lihat stiker di motor)$li$
  ])));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 2, jsonb_build_object('text', $txt$Ganti oli sendiri: panaskan mesin 2 menit, buka baut tap (wadahi oli bekas!), ganti ring, isi oli baru sesuai takaran. Oli bekas JANGAN dibuang sembarangan — kumpulkan, serahkan ke bengkel/tukang oli. Yang butuh bengkel: turun mesin, kelistrikan rumit, rem bermasalah.$txt$));
END $doblk$;
