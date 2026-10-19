-- Batch 341: 1 artikel Sejarah (Sumpah Pemuda) — idempoten
-- Dibuat: 2026-10-19 (Siklus Abadi putaran 662)

INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('b1b1b1b1-0199-4000-8000-000000000199', 'EXP-SEJ-349', 'b8888888-8888-8888-8888-888888888888', 'Sumpah Pemuda 1928: Satu Nusa Satu Bangsa', 'sumpah-pemuda-1928', 'Kongres Pemuda II & ikrar yang menyatukan Indonesia.', 'id', 8, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-SEJ-349';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
    (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', 'Ikrar')),
    (gen_random_uuid(), v_id, 'LIST', 1, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Satu tanah air: Indonesia$li$,
      $li$Satu bangsa: Indonesia$li$,
      $li$Satu bahasa: Indonesia$li$
    ]))),
    (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', 'Kongres')),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 3, jsonb_build_object('text', $txt$27-28 Oktober 1928, Jakarta. Dipimpin Soegondo Djojopoespito. WR Supratman perkenalkan Indonesia Raya.$txt$)),
    (gen_random_uuid(), v_id, 'HEADING', 4, jsonb_build_object('text', 'Makna')),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 5, jsonb_build_object('text', $txt$Tonggak persatuan. Diperingati tiap 28 Oktober sebagai Hari Sumpah Pemuda.$txt$));
END $doblk$;
