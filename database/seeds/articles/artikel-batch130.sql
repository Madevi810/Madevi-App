-- Batch 130: 5 artikel Sejarah Indonesia (idempoten)
-- Dibuat: 2026-10-19 (Fase 4, Explore)

-- EXP-SEJ-130: Proklamasi 1945: Detik-Detik Menuju Merdeka
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('d9d9d9d9-0001-4000-8000-000000000001', 'EXP-SEJ-130', 'b8888888-8888-8888-8888-888888888888', 'Proklamasi 1945: Detik-Detik Menuju Merdeka', 'proklamasi-1945-detik-merdeka', 'Rangkaian peristiwa menuju proklamasi: dari bom Hiroshima hingga pembacaan teks di Pegangsaan Timur 56.', 'id', 8, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-SEJ-130';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', $txt$Latar Belakang$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 1, jsonb_build_object('text', $txt$6 dan 9 Agustus 1945: bom atom di Hiroshima dan Nagasaki. Jepang menyerah 14 Agustus. Terjadi kevakuman kekuasaan — pemuda mendesak Soekarno-Hatta segera memproklamasikan kemerdekaan, tidak menunggu PPKI.$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', $txt$Rengasdengklok dan Perumusan$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 3, jsonb_build_object('text', $txt$16 Agustus dini hari: pemuda "menculik" Soekarno-Hatta ke Rengasdengklok agar jauh dari pengaruh Jepang. Malamnya disepakati proklamasi esok hari. Teks dirumuskan di rumah Laksamana Maeda oleh Soekarno, Hatta, dan Ahmad Soebardjo; diketik oleh Sayuti Melik.$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 4, jsonb_build_object('text', $txt$17 Agustus 1945$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 5, jsonb_build_object('text', $txt$Pukul 10.00 di Jalan Pegangsaan Timur 56, Jakarta: Soekarno membacakan teks proklamasi didampingi Hatta. Bendera Merah Putih — yang dijahit Fatmawati — dikibarkan. Indonesia merdeka. Esoknya, 18 Agustus, PPKI mengesahkan UUD 1945 dan memilih Soekarno-Hatta sebagai presiden-wakil presiden.$txt$));
END $doblk$;

-- EXP-SEJ-131: Kerajaan Nusantara: Sriwijaya dan Majapahit
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('d9d9d9d9-0002-4000-8000-000000000002', 'EXP-SEJ-131', 'b8888888-8888-8888-8888-888888888888', 'Kerajaan Nusantara: Sriwijaya dan Majapahit', 'sriwijaya-majapahit-nusantara', 'Dua kerajaan maritim terbesar Nusantara: kejayaan Sriwijaya di Selat Malaka dan Majapahit dengan Sumpah Palapa.', 'id', 8, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-SEJ-131';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', $txt$Sriwijaya (abad 7-13)$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 1, jsonb_build_object('text', $txt$Berpusat di Palembang, Sriwijaya menguasai jalur perdagangan Selat Malaka — "tol laut" antara India dan Tiongkok. Kaya dari cukai dagang, menjadi pusat belajar Buddha (pendeta I-Tsing belajar di sini). Melemah setelah serangan Chola (1025) dan munculnya kerajaan lain.$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', $txt$Majapahit (abad 13-15)$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 3, jsonb_build_object('text', $txt$Didirikan Raden Wijaya (1293), mencapai puncak di bawah Hayam Wuruk dan Mahapatih Gajah Mada. Sumpah Palapa: tidak berhenti sebelum Nusantara bersatu. Wilayahnya mencakup hampir seluruh Indonesia kini plus sebagian Asia Tenggara. Kitab Negarakertagama (Mpu Prapanca) mencatat kejayaannya.$txt$));
END $doblk$;

-- EXP-SEJ-132: Perang Kemerdekaan 1945-1949
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('d9d9d9d9-0003-4000-8000-000000000003', 'EXP-SEJ-132', 'b8888888-8888-8888-8888-888888888888', 'Perang Kemerdekaan 1945-1949', 'perang-kemerdekaan-1945-1949', 'Perjuangan mempertahankan kemerdekaan: dari pertempuran Surabaya hingga Konferensi Meja Bundar.', 'id', 8, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-SEJ-132';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', $txt$Pertempuran Besar$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'LIST', 1, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$10 November 1945: Pertempuran Surabaya — Bung Tomo membakar semangat arek-arek Suroboyo melawan Inggris (diperingati Hari Pahlawan)$li$,
      $li$Ambarawa (Des 1945): Kolonel Soedirman memimpin kemenangan$li$,
      $li$Bandung Lautan Api (Mar 1946): rakyat membakar kota agar tak dikuasai musuh$li$,
      $li$Agresi Militer I & II (1947, 1948): Belanda menyerang; Yogyakarta diduduki$li$,
      $li$Serangan Umum 1 Maret 1949: membuktikan RI masih ada — modal diplomasi$li$
  ])));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', $txt$Diplomasi$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 3, jsonb_build_object('text', $txt$Perjuangan fisik dibarengi diplomasi: Perjanjian Linggarjati, Renville, Roem-Roijen, hingga Konferensi Meja Bundar (Des 1949) — Belanda mengakui kedaulatan Indonesia. 27 Desember 1949: penyerahan kedaulatan.$txt$));
END $doblk$;

-- EXP-SEJ-133: Reformasi 1998: Akhir Orde Baru
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('d9d9d9d9-0004-4000-8000-000000000004', 'EXP-SEJ-133', 'b8888888-8888-8888-8888-888888888888', 'Reformasi 1998: Akhir Orde Baru', 'reformasi-1998-akhir-orde-baru', 'Krisis moneter, tragedi Trisakti, dan mundurnya Soeharto — lahirnya era reformasi Indonesia.', 'id', 7, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-SEJ-133';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', $txt$Krisis$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 1, jsonb_build_object('text', $txt$1997: krisis moneter Asia. Rupiah anjlok dari Rp2.500 ke Rp16.000+ per dolar. Harga melambung, PHK massal, kemarahan rakyat memuncak setelah 32 tahun Orde Baru berkuasa.$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', $txt$Tragedi dan Mundurnya Soeharto$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 3, jsonb_build_object('text', $txt$12 Mei 1998: empat mahasiswa Trisakti tewas ditembak — memicu kerusuhan. 21 Mei 1998: Soeharto mengundurkan diri, B.J. Habibie naik menjadi presiden. Tuntutan reformasi: hapus KKN, demokratisasi, otonomi daerah, kebebasan pers.$txt$));
END $doblk$;

-- EXP-SEJ-134: Candi Borobudur: Mahakarya Nusantara
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('d9d9d9d9-0005-4000-8000-000000000005', 'EXP-SEJ-134', 'b8888888-8888-8888-8888-888888888888', 'Candi Borobudur: Mahakarya Nusantara', 'candi-borobudur-mahakarya', 'Candi Buddha terbesar di dunia: sejarah pembangunan, arsitektur mandala, relief, dan status Warisan Dunia UNESCO.', 'id', 6, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-SEJ-134';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', $txt$Sejarah$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 1, jsonb_build_object('text', $txt$Dibangun abad ke-8 oleh Dinasti Syailendra (sekitar 780-825 M). Sempat terkubur abu vulkanik dan terlupakan berabad-abad, ditemukan kembali 1814 oleh Raffles. Dipugar besar-besaran 1975-1982 dengan bantuan UNESCO.$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', $txt$Arsitektur$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 3, jsonb_build_object('text', $txt$Berbentuk mandala raksasa: 9 teras (6 kotak, 3 melingkar) + stupa induk di puncak. 2.672 panel relief menceritakan ajaran Buddha — jika dibentangkan mencapai 6 km. 504 arca Buddha. Dibangun dari 2 juta balok batu tanpa semen, dikunci dengan sistem interlock.$txt$));
END $doblk$;
