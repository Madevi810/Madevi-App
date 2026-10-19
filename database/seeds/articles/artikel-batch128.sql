-- Batch 128: 5 artikel Keuangan (idempoten)
-- Dibuat: 2026-10-19 (Fase 4, Explore)

-- EXP-KEU-128: Anggaran 50/30/20 untuk Pemula
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('d7d7d7d7-0001-4000-8000-000000000001', 'EXP-KEU-128', 'b8888888-8888-8888-8888-888888888888', 'Anggaran 50/30/20 untuk Pemula', 'anggaran-50-30-20-pemula', 'Metode budgeting sederhana: 50% kebutuhan, 30% keinginan, 20% tabungan — dengan contoh gaji UMR.', 'id', 6, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-KEU-128';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', $txt$Rumus 50/30/20$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'LIST', 1, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$50% Kebutuhan: makan, kos, transport, pulsa$li$,
      $li$30% Keinginan: jajan, hiburan, nongkrong$li$,
      $li$20% Tabungan & darurat: wajib disisihkan duluan (bayar diri sendiri)$li$
  ])));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 2, jsonb_build_object('text', $txt$Contoh gaji Rp5 juta: Rp2,5 jt kebutuhan, Rp1,5 jt keinginan, Rp1 jt tabungan. Kunci: sisihkan tabungan begitu gajian, jangan tunggu sisa. Sesuaikan proporsi dengan kondisimu — yang penting konsisten.$txt$));
END $doblk$;

-- EXP-KEU-129: Dana Darurat: Berapa dan Di Mana
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('d7d7d7d7-0002-4000-8000-000000000002', 'EXP-KEU-129', 'b8888888-8888-8888-8888-888888888888', 'Dana Darurat: Berapa dan Di Mana', 'dana-darurat-berapa-di-mana', 'Besar dana darurat ideal per status, tempat menyimpan yang tepat, dan cara membangunnya bertahap.', 'id', 6, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-KEU-129';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', $txt$Berapa Besar?$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'LIST', 1, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Lajang: 3-6x pengeluaran bulanan$li$,
      $li$Menikah tanpa anak: 6-9x$li$,
      $li$Menikah dengan anak / freelancer: 9-12x$li$
  ])));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 2, jsonb_build_object('text', $txt$Simpan di tempat likuid tapi "tidak gampang diambil": tabungan terpisah, deposito, atau reksa dana pasar uang. Bukan di saham (fluktuatif) atau di bawah bantal (tergerus inflasi). Bangun bertahap: target 1 bulan dulu, lalu tambah.$txt$));
END $doblk$;

-- EXP-KEU-130: Investasi untuk Pemula: Mulai Rp100 Ribu
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('d7d7d7d7-0003-4000-8000-000000000003', 'EXP-KEU-130', 'b8888888-8888-8888-8888-888888888888', 'Investasi untuk Pemula: Mulai Rp100 Ribu', 'investasi-pemula-100-ribu', 'Jenis investasi untuk pemula Indonesia: deposito, reksa dana, emas, SBN — plus prinsip risiko dan diversifikasi.', 'id', 8, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-KEU-130';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', $txt$Urut dari Paling Aman$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'LIST', 1, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Deposito: dijamin LPS, return kecil$li$,
      $li$SBN (ORI/Sukuk): dijamin negara, bisa mulai Rp1 juta$li$,
      $li$Reksa dana pasar uang: likuid, risiko rendah$li$,
      $li$Emas (digital/fisik): lindung nilai jangka panjang$li$,
      $li$Reksa dana saham / saham: return potensial besar, risiko besar$li$
  ])));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 2, jsonb_build_object('text', $txt$Prinsip: high return = high risk. Jangan investasikan dana darurat atau uang kebutuhan pokok. Waspada investasi bodong: janji return tetap tinggi per bulan hampir pasti penipuan — cek legalitas di OJK. Diversifikasi: jangan taruh semua di satu tempat.$txt$));
END $doblk$;

-- EXP-KEU-131: Utang: Kapan Sehat, Kapan Berbahaya
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('d7d7d7d7-0004-4000-8000-000000000004', 'EXP-KEU-131', 'b8888888-8888-8888-8888-888888888888', 'Utang: Kapan Sehat, Kapan Berbahaya', 'utang-kapan-sehat-berbahaya', 'Membedakan utang produktif vs konsumtif, aturan cicilan maksimal 30%, dan strategi melunasi utang menumpuk.', 'id', 7, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-KEU-131';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', $txt$Utang Produktif vs Konsumtif$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'LIST', 1, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Produktif: menghasilkan/menghemat — KPR, modal usaha, pendidikan$li$,
      $li$Konsumtif: habis tanpa hasil — paylater untuk gaya hidup, utang kartu kredit konsumtif$li$
  ])));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 2, jsonb_build_object('text', $txt$Aturan: total cicilan maksimal 30% penghasilan. Strategi lunasi: metode avalanche (lunasi bunga tertinggi dulu, hemat total) atau snowball (lunasi terkecil dulu, menang psikologis). Hindari gali lubang tutup lubang dengan pinjol berbunga tinggi.$txt$));
END $doblk$;

-- EXP-KEU-132: Pajak untuk Karyawan: PPh 21 Sederhana
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('d7d7d7d7-0005-4000-8000-000000000005', 'EXP-KEU-132', 'b8888888-8888-8888-8888-888888888888', 'Pajak untuk Karyawan: PPh 21 Sederhana', 'pajak-karyawan-pph21-sederhana', 'Cara kerja PPh 21: PTKP, tarif progresif, dan cara membaca slip potong — untuk karyawan Indonesia.', 'id', 7, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-KEU-132';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', $txt$Konsep Dasar$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 1, jsonb_build_object('text', $txt$PPh 21 dipotong perusahaan dari gajimu. Penghasilan kena pajak = penghasilan bruto setahun dikurangi PTKP (Rp54 juta untuk lajang). Tarif progresif: 5% (s.d. Rp60 jt), 15%, 25%, 30%, 35%. Catatan: tarif dapat berubah mengikuti UU HPP; cek pajak.go.id untuk tarif terkini.$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', $txt$Contoh$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 3, jsonb_build_object('text', $txt$Gaji Rp8 juta/bulan = Rp96 jt/tahun. PTKP Rp54 jt → PKP Rp42 jt. Pajak = 5% x 42 jt = Rp2,1 jt/tahun (±Rp175 rb/bulan). Perusahaan memotong dan melaporkan; kamu terima bukti potong 1721-A1 untuk lapor SPT tahunan.$txt$));
END $doblk$;
