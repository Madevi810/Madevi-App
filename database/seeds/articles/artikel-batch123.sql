-- Batch 123: 5 artikel Kimia - Sains (idempoten)
-- Dibuat: 2026-10-19 (Fase 4, Explore)

-- EXP-KIMIA-123: Zat dan Perubahannya: Fisika vs Kimia
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('d2d2d2d2-0001-4000-8000-000000000001', 'EXP-KIMIA-123', 'b8888888-8888-8888-8888-888888888888', 'Zat dan Perubahannya: Fisika vs Kimia', 'zat-dan-perubahannya-fisika-kimia', 'Membedakan perubahan fisika dan kimia dengan contoh sehari-hari: dari es mencair hingga nasi menjadi basi.', 'id', 6, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;

DO $doblk$
DECLARE v_id uuid;
BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-KIMIA-123';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', $txt$Perubahan Fisika$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 1, jsonb_build_object('text', $txt$Perubahan fisika mengubah bentuk atau wujud zat TANPA menghasilkan zat baru. Contoh: es mencair menjadi air, air menguap, kertas disobek, gula larut dalam teh. Zatnya tetap sama, hanya bentuknya berubah — dan umumnya bisa kembali (reversibel).$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', $txt$Perubahan Kimia$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 3, jsonb_build_object('text', $txt$Perubahan kimia menghasilkan ZAT BARU dengan sifat berbeda. Contoh: nasi menjadi basi, besi berkarat, kayu dibakar menjadi abu, susu menjadi yogurt. Ciri-cirinya: timbul gas, berubah warna, timbul endapan, atau keluar panas/cahaya.$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 4, jsonb_build_object('text', $txt$Cara Membedakan$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 5, jsonb_build_object('text', $txt$Tanya: apakah zatnya berubah menjadi zat lain? Menggoreng telur: putih telur cair menjadi padat dan tidak bisa kembali cair — itu perubahan kimia. Memotong wortel: bentuk berubah tapi tetap wortel — itu perubahan fisika.$txt$));
END $doblk$;

-- EXP-KIMIA-124: Asam, Basa, dan pH dalam Kehidupan
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('d2d2d2d2-0002-4000-8000-000000000002', 'EXP-KIMIA-124', 'b8888888-8888-8888-8888-888888888888', 'Asam, Basa, dan pH dalam Kehidupan', 'asam-basa-ph-kehidupan', 'Mengenal asam dan basa dari dapur hingga lambung: sifat, contoh, skala pH, dan cara menetralkannya.', 'id', 7, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;

DO $doblk$
DECLARE v_id uuid;
BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-KIMIA-124';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', $txt$Sifat Asam dan Basa$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'LIST', 1, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Asam: rasanya masam, pH kurang dari 7. Contoh: jeruk nipis, cuka, asam lambung$li$,
      $li$Basa: rasanya pahit dan licin di tangan, pH lebih dari 7. Contoh: sabun, pasta gigi, obat maag$li$,
      $li$Netral: pH tepat 7, misalnya air murni$li$
  ])));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', $txt$Skala pH$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 3, jsonb_build_object('text', $txt$Skala pH dari 0 sampai 14 mengukur keasaman. Setiap turun 1 angka pH berarti 10 kali lebih asam (skala logaritma). Asam lambung pH-nya sekitar 2 — sangat asam untuk mencerna makanan. Sabun pH-nya sekitar 9-10.$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 4, jsonb_build_object('text', $txt$Netralisasi$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 5, jsonb_build_object('text', $txt$Asam + basa menghasilkan garam + air (netral). Inilah cara kerja obat maag: zat basa menetralkan kelebihan asam lambung. Jangan coba mencampur asam dan basa kuat di rumah tanpa pengawasan — reaksinya bisa panas dan berbahaya.$txt$));
END $doblk$;

-- EXP-KIMIA-125: Tabel Periodik: Membaca Peta Unsur
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('d2d2d2d2-0003-4000-8000-000000000003', 'EXP-KIMIA-125', 'b8888888-8888-8888-8888-888888888888', 'Tabel Periodik: Membaca Peta Unsur', 'tabel-periodik-membaca-peta-unsur', 'Panduan membaca tabel periodik: golongan, periode, logam vs nonlogam, dan unsur-unsur yang sering ditemui.', 'id', 8, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;

DO $doblk$
DECLARE v_id uuid;
BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-KIMIA-125';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', $txt$Struktur Tabel$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 1, jsonb_build_object('text', $txt$Tabel periodik menyusun 118 unsur berdasarkan nomor atom. Kolom vertikal disebut golongan (sifat mirip), baris horizontal disebut periode. Unsur di golongan yang sama punya sifat kimia mirip — misalnya golongan 1 (logam alkali) semuanya reaktif dengan air.$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', $txt$Logam, Nonlogam, Metaloid$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'LIST', 3, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Logam (kiri tabel): mengkilap, menghantar panas dan listrik. Contoh: besi (Fe), aluminium (Al), emas (Au)$li$,
      $li$Nonlogam (kanan atas): tidak mengkilap, isolator. Contoh: oksigen (O), karbon (C), belerang (S)$li$,
      $li$Metaloid (perbatasan): sifat campuran, penting untuk semikonduktor. Contoh: silikon (Si)$li$,
      $li$Gas mulia (golongan 18): sangat stabil, jarang bereaksi. Contoh: helium (He), neon (Ne)$li$
  ])));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 4, jsonb_build_object('text', $txt$Unsur Sehari-hari$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 5, jsonb_build_object('text', $txt$Tubuhmu mengandung oksigen, karbon, hidrogen, kalsium (tulang), dan besi (darah). Garam dapur adalah NaCl (natrium + klor). Air adalah H2O. Memahami tabel periodik berarti memahami bahan penyusun dunia.$txt$));
END $doblk$;

-- EXP-KIMIA-126: Reaksi Kimia: Persamaan dan Jenisnya
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('d2d2d2d2-0004-4000-8000-000000000004', 'EXP-KIMIA-126', 'b8888888-8888-8888-8888-888888888888', 'Reaksi Kimia: Persamaan dan Jenisnya', 'reaksi-kimia-persamaan-jenisnya', 'Menulis dan menyetarakan persamaan reaksi kimia, plus 5 jenis reaksi dengan contoh sederhana.', 'id', 8, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;

DO $doblk$
DECLARE v_id uuid;
BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-KIMIA-126';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', $txt$Persamaan Reaksi$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 1, jsonb_build_object('text', $txt$Reaksi kimia ditulis sebagai persamaan: pereaksi (kiri) menjadi hasil reaksi (kanan). Contoh: 2H2 + O2 menjadi 2H2O. Angka di depan (koefisien) harus disetarakan agar jumlah atom kiri = kanan — sesuai hukum kekekalan massa.$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', $txt$Lima Jenis Reaksi$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'LIST', 3, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Sintesis (penggabungan): A + B menjadi AB. Contoh: besi + belerang dipanaskan$li$,
      $li$Dekomposisi (penguraian): AB menjadi A + B. Contoh: air dielektrolisis menjadi H2 + O2$li$,
      $li$Pembakaran: bahan bakar + O2 menjadi CO2 + H2O. Contoh: lilin, bensin, gas LPG$li$,
      $li$Penggantian tunggal: A + BC menjadi AC + B. Contoh: seng + asam sulfat$li$,
      $li$Netralisasi: asam + basa menjadi garam + air. Contoh: obat maag menetralkan asam lambung$li$
  ])));
END $doblk$;

-- EXP-KIMIA-127: Larutan: Konsentrasi dan Kelarutan
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('d2d2d2d2-0005-4000-8000-000000000005', 'EXP-KIMIA-127', 'b8888888-8888-8888-8888-888888888888', 'Larutan: Konsentrasi dan Kelarutan', 'larutan-konsentrasi-kelarutan', 'Apa itu larutan, bagaimana menghitung konsentrasi, dan faktor yang memengaruhi kelarutan — dari teh manis hingga infus.', 'id', 7, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;

DO $doblk$
DECLARE v_id uuid;
BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-KIMIA-127';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', $txt$Komponen Larutan$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 1, jsonb_build_object('text', $txt$Larutan terdiri dari pelarut (jumlah banyak, biasanya air) dan zat terlarut (jumlah sedikit, misalnya gula atau garam). Teh manis = air (pelarut) + gula + teh (zat terlarut).$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', $txt$Konsentrasi$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 3, jsonb_build_object('text', $txt$Konsentrasi menyatakan kepekatan larutan. Cara sederhana: persen massa = (massa zat terlarut / massa larutan) x 100%. Contoh: 10 gram garam dalam 100 gram larutan = 10%. Di laboratorium dipakai molaritas (mol per liter).$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 4, jsonb_build_object('text', $txt$Faktor Kelarutan$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'LIST', 5, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Suhu: umumnya zat padat lebih mudah larut di air panas (gula di teh panas)$li$,
      $li$Pengadukan: mempercepat pelarutan$li$,
      $li$Ukuran partikel: serbuk lebih cepat larut daripada bongkahan$li$,
      $li$Jenis zat: minyak tidak larut dalam air ("like dissolves like")$li$
  ])));
END $doblk$;
