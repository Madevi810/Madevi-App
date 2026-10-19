-- Batch 384: 1 artikel Agama (Taharah) — idempoten
-- Dibuat: 2026-10-19 (Siklus Abadi putaran 806)

INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('b1b1b1b1-0242-4000-8000-000000000242', 'EXP-AGA-392', 'b8888888-8888-8888-8888-888888888888', 'Taharah: Bersuci dalam Islam', 'taharah-bersuci-islam', 'Macam najis & cara mensucikannya.', 'id', 7, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-AGA-392';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
    (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', 'Macam Najis')),
    (gen_random_uuid(), v_id, 'LIST', 1, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Mukhaffafah (ringan): kencing bayi$li$,
      $li$Mutawassithah (sedang): darah, kotoran$li$,
      $li$Mughalladhah (berat): anjing & babi$li$
    ]))),
    (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', 'Cara Suci')),
    (gen_random_uuid(), v_id, 'LIST', 3, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Ringan: perciki air$li$,
      $li$Sedang: cuci sampai hilang$li$,
      $li$Berat: 7x, salah satunya tanah$li$
    ]))),
    (gen_random_uuid(), v_id, 'HEADING', 4, jsonb_build_object('text', 'Hadas')),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 5, jsonb_build_object('text', $txt$Kecil: wudhu. Besar: mandi wajib.$txt$));
END $doblk$;
