-- Batch 141: 9 artikel Lingkungan tambahan (idempoten)
-- Dibuat: 2026-10-19 (Fase 4, Explore)

-- EXP-LING-141: Banjir Jakarta: Penyebab dan Solusi
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('f8f8f8f8-0001-4000-8000-000000000001', 'EXP-LING-141', 'b8888888-8888-8888-8888-888888888888', 'Banjir Jakarta: Penyebab dan Solusi', 'banjir-jakarta-penyebab-solusi', 'Mengapa Jakarta banjir: penurunan tanah, sampah, berkurangnya resapan — dan solusi jangka panjang.', 'id', 7, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-LING-141';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'LIST', 0, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Penurunan tanah (subsidence): 10-25 cm/tahun di utara akibat pompa air tanah$li$,
      $li$13 sungai melintasi Jakarta; sedimentasi mendangkalkan$li$,
      $li$Ruang terbuka hijau <10% (ideal 30%)$li$,
      $li$Solusi: sumur resapan, normalisasi sungai, hentikan pompa liar, giant sea wall$li$
  ])));
END $doblk$;

-- EXP-LING-142: Polusi Udara: Sumber dan Dampak Kesehatan
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('f8f8f8f8-0002-4000-8000-000000000002', 'EXP-LING-142', 'b8888888-8888-8888-8888-888888888888', 'Polusi Udara: Sumber dan Dampak', 'polusi-udara-sumber-dampak', 'PM2.5, sumber polusi kota Indonesia, dampak kesehatan, dan cara melindungi diri.', 'id', 6, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-LING-142';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'LIST', 0, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$PM2.5: partikel <2,5 mikron, masuk ke paru dan darah$li$,
      $li$Sumber: kendaraan, PLTU batubara, pembakaran sampah, karhutla$li$,
      $li$Dampak: ISPA, asma, jantung, stunting pada anak$li$,
      $li$Lindungi diri: masker N95/KN95 saat AQI buruk, air purifier indoor$li$,
      $li$Cek kualitas udara: aplikasi Nafas, IQAir$li$
  ])));
END $doblk$;

-- EXP-LING-143: Terumbu Karang Indonesia
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('f8f8f8f8-0003-4000-8000-000000000003', 'EXP-LING-143', 'b8888888-8888-8888-8888-888888888888', 'Terumbu Karang Indonesia', 'terumbu-karang-indonesia', 'Segitiga karang dunia: keanekaragaman, fungsi, ancaman, dan restorasi.', 'id', 6, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-LING-143';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 0, jsonb_build_object('text', $txt$Indonesia di pusat Coral Triangle: 600+ jenis karang, 3000+ jenis ikan. Karang = hewan (polip) bersimbiosis dengan alga zooxanthellae. Fungsi: rumah ikan, pelindung pantai dari abrasi, sumber perikanan. Ancaman: pemutihan (air panas), bom ikan, sampah plastik. Jangan injak karang saat snorkeling!$txt$));
END $doblk$;

-- EXP-LING-144: Satwa Langka Indonesia
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('f8f8f8f8-0004-4000-8000-000000000004', 'EXP-LING-144', 'b8888888-8888-8888-8888-888888888888', 'Satwa Langka Indonesia', 'satwa-langka-indonesia', 'Orangutan, komodo, badak jawa, harimau sumatra: status, ancaman, dan upaya konservasi.', 'id', 7, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-LING-144';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'LIST', 0, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Orangutan (Kalimantan, Sumatra): kritis; habitat hilang untuk sawit$li$,
      $li$Komodo: hanya di NTT; rentan$li$,
      $li$Badak jawa (Ujung Kulon): <80 ekor, paling langka$li$,
      $li$Harimau sumatra: <400 ekor; konflik dengan manusia$li$,
      $li$Jangan beli satwa dilindungi; lapor perburuan ke BKSDA$li$
  ])));
END $doblk$;

-- EXP-LING-145: Kebakaran Hutan dan Lahan (Karhutla)
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('f8f8f8f8-0005-4000-8000-000000000005', 'EXP-LING-145', 'b8888888-8888-8888-8888-888888888888', 'Kebakaran Hutan dan Lahan', 'karhutla-kebakaran-hutan', 'Karhutla tahunan di Sumatra-Kalimantan: gambut, kabut asap, dan penanggulangan.', 'id', 6, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-LING-145';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 0, jsonb_build_object('text', $txt$Gambut kering mudah terbakar dan sulit dipadamkan (api menyusup di bawah). Penyebab: pembukaan lahan sengaja + kemarau (El Nino). Dampak: kabut asap lintas negara, ISPA massal, emisi karbon raksasa. Solusi: sekat kanal (pembasahan gambut), patroli, penegakan hukum pembakar.$txt$));
END $doblk$;

-- EXP-LING-146: Pertanian Berkelanjutan
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('f8f8f8f8-0006-4000-8000-000000000006', 'EXP-LING-146', 'b8888888-8888-8888-8888-888888888888', 'Pertanian Berkelanjutan', 'pertanian-berkelanjutan', 'Tani organik, agroforestri, dan SRI: produktif tanpa merusak tanah dan air.', 'id', 6, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-LING-146';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'LIST', 0, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Organik: tanpa pestisida sintetis; pakai kompos dan pestisida nabati$li$,
      $li$SRI (padi): bibit muda 1 per lubang, tanah tidak selalu tergenang — hemat air, hasil naik$li$,
      $li$Agroforestri: campur tanaman + pohon (kopi di bawah naungan)$li$,
      $li$Rotasi tanaman mencegah hama dan menjaga kesuburan$li$
  ])));
END $doblk$;

-- EXP-LING-147: E-Waste: Sampah Elektronik
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('f8f8f8f8-0007-4000-8000-000000000007', 'EXP-LING-147', 'b8888888-8888-8888-8888-888888888888', 'E-Waste: Sampah Elektronik', 'e-waste-sampah-elektronik', 'HP dan laptop bekas mengandung racun dan logam berharga: cara buang yang benar di Indonesia.', 'id', 5, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-LING-147';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 0, jsonb_build_object('text', $txt$Satu HP mengandung timbal, merkuri, kadmium (beracun) TAPI juga emas, perak, tembaga (berharga). Jangan dibuang ke tempat sampah atau dibakar. Opsi: trade-in ke toko, donasikan jika masih layak, ke dropbox e-waste (mall, kantor produsen). Hapus data dulu (factory reset + timpa).$txt$));
END $doblk$;

-- EXP-LING-148: Menanam Pohon: Jenis dan Cara
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('f8f8f8f8-0008-4000-8000-000000000008', 'EXP-LING-148', 'b8888888-8888-8888-8888-888888888888', 'Menanam Pohon: Jenis dan Cara', 'menanam-pohon-jenis-cara', 'Pohon peneduh vs buah untuk pekarangan: jarak tanam, lubang tanam, dan perawatan tahun pertama.', 'id', 5, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-LING-148';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'LIST', 0, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Peneduh: trembesi, angsana (butuh lahan luas); tabebuya untuk jalan$li$,
      $li$Buah: mangga, jambu, rambutan — teduh + panen$li$,
      $li$Lubang 60x60x60 cm, campur kompos; siram tiap hari 2 minggu pertama$li$,
      $li$Jarak dari bangunan: minimal 3 m (akar merusak fondasi)$li$,
      $li$Hindari tanam di bawah kabel listrik$li$
  ])));
END $doblk$;

-- EXP-LING-149: Hemat Energi di Rumah
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('f8f8f8f8-0009-4000-8000-000000000009', 'EXP-LING-149', 'b8888888-8888-8888-8888-888888888888', 'Hemat Energi di Rumah', 'hemat-energi-rumah', '10 cara memangkas tagihan listrik: dari AC hingga standby power.', 'id', 5, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-LING-149';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'LIST', 0, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$AC: set 25-26°C; tiap turun 1°C = +6% konsumsi$li$,
      $li$Ganti lampu ke LED (hemat 80% vs pijar)$li$,
      $li$Cabut charger & matikan standby (TV, dispenser)$li$,
      $li$Kulkas: jangan terlalu penuh/kosong; cek karet pintu$li$,
      $li$Setrika sekaligus banyak; cuci baju air dingin$li$,
      $li$Manfaatkan cahaya alami siang hari$li$
  ])));
END $doblk$;
