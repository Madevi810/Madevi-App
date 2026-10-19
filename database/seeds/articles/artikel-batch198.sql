-- Batch 198: 1 artikel Lingkungan (Sampah Elektronik) — idempoten
-- Dibuat: 2026-10-19 (Siklus Abadi putaran 186)

INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('b1b1b1b1-0056-4000-8000-000000000056', 'EXP-LING-206', 'b8888888-8888-8888-8888-888888888888', 'Sampah Elektronik: Buang ke Mana', 'sampah-elektronik-buang', 'Bahaya e-waste dan cara membuang HP, baterai, dan elektronik bekas dengan benar.', 'id', 6, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-LING-206';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
    (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', 'Bahaya E-Waste')),
    (gen_random_uuid(), v_id, 'LIST', 1, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Timbal & merkuri mencemari tanah/air$li$,
      $li$Baterai bisa meledak bila dibakar$li$,
      $li$1 HP mengandung 30+ bahan berbahaya$li$
    ]))),
    (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', 'Cara Buang Benar')),
    (gen_random_uuid(), v_id, 'LIST', 3, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Dropbox e-waste di mall/kantor$li$,
      $li$Program trade-in produsen$li$,
      $li$Bank sampah elektronik$li$,
      $li$Jangan buang ke tempat sampah biasa$li$
    ]))),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 4, jsonb_build_object('text', $txt$Hapus data dulu sebelum buang/jual: factory reset + timpa data.$txt$));
END $doblk$;
