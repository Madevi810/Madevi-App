-- Batch 293: 1 artikel Sejarah (PPKI) — idempoten
-- Dibuat: 2026-10-19 (Siklus Abadi putaran 502)

INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('b1b1b1b1-0151-4000-8000-000000000151', 'EXP-SEJ-301', 'b8888888-8888-8888-8888-888888888888', 'PPKI: Mengesahkan Kemerdekaan', 'ppki-mengesahkan-kemerdekaan', 'Sidang PPKI 18-22 Agustus 1945: UUD, presiden, & pembagian wilayah.', 'id', 7, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-SEJ-301';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
    (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', '18 Agustus')),
    (gen_random_uuid(), v_id, 'LIST', 1, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$UUD 1945 disahkan$li$,
      $li$Soekarno-Hatta jadi presiden-wapres$li$,
      $li$Piagam Jakarta diubah$li$
    ]))),
    (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', '19-22 Agustus')),
    (gen_random_uuid(), v_id, 'LIST', 3, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$8 provinsi dibentuk$li$,
      $li$KNIP, PNI, BKR dibentuk$li$
    ]))),
    (gen_random_uuid(), v_id, 'HEADING', 4, jsonb_build_object('text', 'Makna')),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 5, jsonb_build_object('text', $txt$Proklamasi jadi negara: ada konstitusi, pemimpin, & wilayah.$txt$));
END $doblk$;
