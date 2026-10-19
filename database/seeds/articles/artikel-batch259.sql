-- Batch 259: 1 artikel Lingkungan (Energi Nuklir) — idempoten
-- Dibuat: 2026-10-19 (Siklus Abadi putaran 389)

INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('b1b1b1b1-0117-4000-8000-000000000117', 'EXP-LING-267', 'b8888888-8888-8888-8888-888888888888', 'Energi Nuklir: Solusi atau Ancaman', 'energi-nuklir-solusi-ancaman', 'Pro-kontra PLTN dan rencana nuklir Indonesia.', 'id', 8, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-LING-267';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
    (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', 'Pro')),
    (gen_random_uuid(), v_id, 'LIST', 1, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Emisi CO2 hampir nol$li$,
      $li$Energi padat & stabil$li$,
      $li$Lahan kecil$li$
    ]))),
    (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', 'Kontra')),
    (gen_random_uuid(), v_id, 'LIST', 3, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Limbah radioaktif ribuan tahun$li$,
      $li$Risiko kecelakaan (Chernobyl, Fukushima)$li$,
      $li$Biaya mahal$li$
    ]))),
    (gen_random_uuid(), v_id, 'HEADING', 4, jsonb_build_object('text', 'Indonesia')),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 5, jsonb_build_object('text', $txt$Rencana PLTN pertama di Kalimantan/Bangka. SMR (reaktor kecil) jadi opsi.$txt$));
END $doblk$;
