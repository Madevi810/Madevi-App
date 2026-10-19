-- Batch 265: 1 artikel Lingkungan (Banjir Jakarta) — idempoten
-- Dibuat: 2026-10-19 (Siklus Abadi putaran 409)

INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('b1b1b1b1-0123-4000-8000-000000000123', 'EXP-LING-273', 'b8888888-8888-8888-8888-888888888888', 'Banjir Jakarta: Akar Masalah dan Solusinya', 'banjir-jakarta-akar-solusi', 'Penyebab banjir Jakarta dan solusi jangka panjangnya.', 'id', 8, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-LING-273';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
    (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', 'Akar Masalah')),
    (gen_random_uuid(), v_id, 'LIST', 1, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$13 sungai melintasi kota$li$,
      $li$Tanah turun (subsidence)$li$,
      $li$Resapan hilang$li$,
      $li$Sampah menyumbat drainase$li$
    ]))),
    (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', 'Solusi')),
    (gen_random_uuid(), v_id, 'LIST', 3, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Normalisasi sungai$li$,
      $li$Sumur resapan & biopori$li$,
      $li$Banjir kanal$li$,
      $li$Ruang terbuka hijau$li$
    ]))),
    (gen_random_uuid(), v_id, 'HEADING', 4, jsonb_build_object('text', 'Peran Warga')),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 5, jsonb_build_object('text', $txt$Jangan buang sampah ke sungai. Laporkan drainase mampet. Siapkan tas siaga banjir.$txt$));
END $doblk$;
