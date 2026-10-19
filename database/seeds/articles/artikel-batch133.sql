-- Batch 133: 5 artikel Agama & Etika (idempoten)
-- Dibuat: 2026-10-19 (Fase 4, Explore)
-- Konten umum yang menghormati keberagaman; untuk fikih spesifik rujuk ustaz/ulama.

-- EXP-AGA-133: Rukun Islam dan Rukun Iman
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('e3e3e3e3-0001-4000-8000-000000000001', 'EXP-AGA-133', 'b8888888-8888-8888-8888-888888888888', 'Rukun Islam dan Rukun Iman', 'rukun-islam-rukun-iman', 'Lima rukun Islam dan enam rukun iman: pengertian ringkas tiap rukun sebagai fondasi pemahaman.', 'id', 6, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-AGA-133';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', $txt$Rukun Islam (5)$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'LIST', 1, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Syahadat: bersaksi tiada Tuhan selain Allah dan Muhammad utusan Allah$li$,
      $li$Salat: lima waktu sehari semalam$li$,
      $li$Zakat: 2,5% harta yang mencapai nisab$li$,
      $li$Puasa: Ramadan sebulan penuh$li$,
      $li$Haji: bagi yang mampu$li$
  ])));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', $txt$Rukun Iman (6)$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'LIST', 3, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Iman kepada Allah, malaikat-malaikat-Nya, kitab-kitab-Nya$li$,
      $li$Iman kepada rasul-rasul-Nya, hari akhir, qada dan qadar$li$
  ])));
END $doblk$;

-- EXP-AGA-134: Tata Cara Wudu dan Salat yang Benar
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('e3e3e3e3-0002-4000-8000-000000000002', 'EXP-AGA-134', 'b8888888-8888-8888-8888-888888888888', 'Tata Cara Wudu dan Salat yang Benar', 'tata-cara-wudu-salat', 'Langkah wudu dan gerakan salat berurutan sesuai tuntunan umum — untuk pemula dan pengingat.', 'id', 8, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-AGA-134';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', $txt$Wudu$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'LIST', 1, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Niat dalam hati$li$,
      $li$Cuci telapak tangan 3x$li$,
      $li$Berkumur dan istinsyaq (hirup air ke hidung) 3x$li$,
      $li$Cuci muka 3x (dari dahi ke dagu, telinga ke telinga)$li$,
      $li$Cuci tangan hingga siku 3x, kanan dulu$li$,
      $li$Usap kepala dan telinga$li$,
      $li$Cuci kaki hingga mata kaki 3x, kanan dulu$li$,
      $li$Doa setelah wudu$li$
  ])));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', $txt$Salat (2 rakaat contoh Subuh)$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'LIST', 3, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Niat, takbiratul ihram$li$,
      $li$Berdiri: Al-Fatihah + surat pendek$li$,
      $li$Ruku, iktidal, sujud (2x), duduk di antara sujud$li$,
      $li$Rakaat kedua sama; diakhiri tahiyat akhir dan salam$li$
  ])));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 4, jsonb_build_object('text', $txt$Catatan: terdapat perbedaan detail antar mazhab; ikuti guru/ulama yang kamu ikuti. Artikel ini panduan umum.$txt$));
END $doblk$;

-- EXP-AGA-135: Akhlak Sehari-hari: Jujur, Amanah, dan Menepati Janji
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('e3e3e3e3-0003-4000-8000-000000000003', 'EXP-AGA-135', 'b8888888-8888-8888-8888-888888888888', 'Akhlak Sehari-hari: Jujur, Amanah, dan Menepati Janji', 'akhlak-jujur-amanah-janji', 'Akhlak mulia dalam interaksi: jujur, amanah, menepati janji, dan adab bertetangga — nilai universal lintas agama.', 'id', 6, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-AGA-135';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', $txt$Tiga Pilar$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'LIST', 1, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Jujur (sidq): berkata dan berbuat benar, meski merugikan diri. Lawannya dusta — awal banyak masalah$li$,
      $li$Amanah: menjaga titipan (barang, rahasia, jabatan). Khianat menghancurkan kepercayaan$li$,
      $li$Menepati janji: janji adalah utang. Jika berhalangan, kabari sebelum waktunya$li$
  ])));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 2, jsonb_build_object('text', $txt$Adab bertetangga: tidak berisik di malam hari, berbagi makanan, menjenguk yang sakit, menjaga kebersihan lingkungan bersama. Nilai-nilai ini diakui semua agama dan budaya.$txt$));
END $doblk$;

-- EXP-AGA-136: Puasa Ramadan: Persiapan dan Tips
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('e3e3e3e3-0004-4000-8000-000000000004', 'EXP-AGA-136', 'b8888888-8888-8888-8888-888888888888', 'Puasa Ramadan: Persiapan dan Tips', 'puasa-ramadan-persiapan-tips', 'Menyambut Ramadan: persiapan fisik dan spiritual, tips sahur-buka, serta amalan yang dianjurkan.', 'id', 6, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-AGA-136';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', $txt$Persiapan$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'LIST', 1, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Fisik: biasakan pola makan teratur 1-2 minggu sebelumnya; cukupi cairan$li$,
      $li$Ilmu: pelajari hal yang membatalkan dan tidak membatalkan puasa$li$,
      $li$Target: buat target tilawah, tarawih, sedekah$li$
  ])));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', $txt$Tips Sahur dan Buka$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'LIST', 3, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Sahur: karbohidrat kompleks (oat, nasi merah) + protein agar kenyang lama$li$,
      $li$Buka: kurma + air putih dulu, jeda, baru makan besar (jangan kalap)$li$,
      $li$Hindari gorengan berlebihan dan minuman bersoda saat buka$li$
  ])));
END $doblk$;

-- EXP-AGA-137: Toleransi Beragama di Indonesia
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('e3e3e3e3-0005-4000-8000-000000000005', 'EXP-AGA-137', 'b8888888-8888-8888-8888-888888888888', 'Toleransi Beragama di Indonesia', 'toleransi-beragama-indonesia', 'Hidup rukun dalam keberagaman: prinsip toleransi, contoh nyata Indonesia, dan adab berbeda pendapat.', 'id', 6, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-AGA-137';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', $txt$Bhinneka Tunggal Ika$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 1, jsonb_build_object('text', $txt$Indonesia mengakui 6 agama resmi plus kepercayaan lokal. Semboyan "berbeda-beda tetapi tetap satu" bukan slogan kosong — ia fondasi negara. Toleransi artinya menghormati keyakinan orang lain tanpa harus mengikuti, dan tidak memaksakan keyakinan sendiri.$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', $txt$Praktik$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'LIST', 3, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Ucapkan selamat hari raya tetangga beda agama dengan tulus$li$,
      $li$Jaga ketenangan saat orang lain beribadah$li$,
      $li$Diskusi agama dengan adab: dengar dulu, jangan menghakimi$li$,
      $li$Gotong royong tanpa memandang agama$li$
  ])));
END $doblk$;
