-- Batch 338: 1 artikel Teknologi (Satelit) — idempoten
-- Dibuat: 2026-10-19 (Siklus Abadi putaran 652)

INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('b1b1b1b1-0196-4000-8000-000000000196', 'EXP-TEK-346', 'b8888888-8888-8888-8888-888888888888', 'Satelit Palapa: Kebanggaan Indonesia', 'satelit-palapa-indonesia', 'Sejarah satelit Palapa & perannya menyatukan nusantara.', 'id', 7, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-TEK-346';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
    (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', 'Sejarah')),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 1, jsonb_build_object('text', $txt$1976: Palapa A1 meluncur. Indonesia negara berkembang pertama dengan satelit sendiri.$txt$)),
    (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', 'Generasi')),
    (gen_random_uuid(), v_id, 'LIST', 3, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Palapa A, B, C$li$,
      $li$Telkom 1, 2, 3S$li$,
      $li$Satria-1 (2023)$li$
    ]))),
    (gen_random_uuid(), v_id, 'HEADING', 4, jsonb_build_object('text', 'Manfaat')),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 5, jsonb_build_object('text', $txt$TV, telepon, internet ke pelosok. Menyatukan 17.000 pulau.$txt$));
END $doblk$;
