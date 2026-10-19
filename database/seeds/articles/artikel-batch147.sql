-- Batch 147: 1 artikel Kesehatan (Demam pada Anak) — idempoten
-- Dibuat: 2026-10-19 (Siklus Abadi putaran 15)

INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('b1b1b1b1-0005-4000-8000-000000000005', 'EXP-KES-155', 'b8888888-8888-8888-8888-888888888888', 'Demam pada Anak: Kapan ke Dokter', 'demam-pada-anak-kapan-ke-dokter', 'Panduan orang tua: mengukur suhu, kompres yang benar, dan tanda bahaya yang wajib ke dokter.', 'id', 8, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-KES-155';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
    (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', 'Ukur dengan Benar')),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 1, jsonb_build_object('text', $txt$Demam = suhu ≥38°C. Ukur dengan termometer digital di ketiak (tambah 0,5°C) atau rektal paling akurat untuk bayi. Jangan mengandalkan rabaan tangan.$txt$)),
    (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', 'Penanganan di Rumah')),
    (gen_random_uuid(), v_id, 'LIST', 3, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Kompres hangat (bukan dingin/es) di dahi, ketiak, lipat paha$li$,
      $li$Berikan cairan cukup: ASI, air putih, oralit$li$,
      $li$Pakaian tipis, ruangan sejuk$li$,
      $li$Parasetamol sesuai dosis berat badan bila anak rewel$li$
    ]))),
    (gen_random_uuid(), v_id, 'HEADING', 4, jsonb_build_object('text', 'SEGERA ke Dokter Bila')),
    (gen_random_uuid(), v_id, 'LIST', 5, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Bayi <3 bulan demam ≥38°C$li$,
      $li$Kejang demam$li$,
      $li$Demam >3 hari tidak turun$li$,
      $li$Sesak napas, muntah terus, lemas/tidak responsif$li$,
      $li$Bintik merah yang tidak hilang saat ditekan$li$
    ]))),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 6, jsonb_build_object('text', $txt$Catatan: artikel ini informasi umum, bukan pengganti diagnosis dokter. Bila ragu, selalu konsultasikan ke tenaga medis.$txt$));
END $doblk$;
