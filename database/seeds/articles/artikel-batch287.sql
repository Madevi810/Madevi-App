-- Batch 287: 1 artikel Sejarah (BPUPKI) — idempoten
-- Dibuat: 2026-10-19 (Siklus Abadi putaran 482)

INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('b1b1b1b1-0145-4000-8000-000000000145', 'EXP-SEJ-295', 'b8888888-8888-8888-8888-888888888888', 'BPUPKI: Merumuskan Dasar Negara', 'bpupki-merumuskan-dasar-negara', 'Sidang BPUPKI Mei-Juni 1945: dari usulan hingga Pancasila.', 'id', 8, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-SEJ-295';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
    (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', 'Sidang I')),
    (gen_random_uuid(), v_id, 'LIST', 1, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$29 Mei - 1 Juni 1945$li$,
      $li$Yamin, Soepomo, Soekarno usulkan dasar$li$,
      $li$1 Juni: lahir Pancasila$li$
    ]))),
    (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', 'Sidang II')),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 3, jsonb_build_object('text', $txt$10-17 Juli 1945: bahas UUD. Panitia 9 rumuskan Piagam Jakarta.$txt$)),
    (gen_random_uuid(), v_id, 'HEADING', 4, jsonb_build_object('text', 'Hasil')),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 5, jsonb_build_object('text', $txt$Dasar negara + rancangan UUD → disahkan PPKI 18 Agustus 1945.$txt$));
END $doblk$;
