-- Batch 377: 1 artikel Sejarah (BPUPKI) — idempoten
-- Dibuat: 2026-10-19 (Siklus Abadi putaran 782)

INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('b1b1b1b1-0235-4000-8000-000000000235', 'EXP-SEJ-385', 'b8888888-8888-8888-8888-888888888888', 'BPUPKI: Lahirnya Pancasila', 'bpupki-lahirnya-pancasila', 'Sidang BPUPKI & pidato 1 Juni 1945.', 'id', 8, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-SEJ-385';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
    (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', 'Sidang I')),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 1, jsonb_build_object('text', $txt$29 Mei-1 Jun 1945. Bahas dasar negara. 1 Juni: Soekarno pidato Pancasila.$txt$)),
    (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', 'Tokoh')),
    (gen_random_uuid(), v_id, 'LIST', 3, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Soekarno: Pancasila$li$,
      $li$Soepomo: negara integralistik$li$,
      $li$Hatta & Yamin$li$
    ]))),
    (gen_random_uuid(), v_id, 'HEADING', 4, jsonb_build_object('text', 'Hasil')),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 5, jsonb_build_object('text', $txt$Panitia Sembilan → Piagam Jakarta → PPKI sahkan UUD 1945.$txt$));
END $doblk$;
