-- Batch 336: 1 artikel Agama (Puasa Ramadhan) — idempoten
-- Dibuat: 2026-10-19 (Siklus Abadi putaran 646)

INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('b1b1b1b1-0194-4000-8000-000000000194', 'EXP-AGA-344', 'b8888888-8888-8888-8888-888888888888', 'Puasa Ramadhan: Rukun & Hikmah', 'puasa-ramadhan-rukun-hikmah', 'Syarat, rukun, pembatal, & hikmah puasa Ramadhan.', 'id', 8, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-AGA-344';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
    (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', 'Syarat & Rukun')),
    (gen_random_uuid(), v_id, 'LIST', 1, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Muslim, baligh, berakal, mampu$li$,
      $li$Niat malam hari$li$,
      $li$Menahan dari fajar ke maghrib$li$
    ]))),
    (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', 'Pembatal')),
    (gen_random_uuid(), v_id, 'LIST', 3, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Makan/minum sengaja$li$,
      $li$Muntah sengaja$li$,
      $li$Haid/nifas$li$
    ]))),
    (gen_random_uuid(), v_id, 'HEADING', 4, jsonb_build_object('text', 'Hikmah')),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 5, jsonb_build_object('text', $txt$Takwa, empati, disiplin, & kesehatan.$txt$));
END $doblk$;
