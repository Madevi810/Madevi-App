-- Batch 251: 1 artikel Teknologi (Satelit) — idempoten
-- Dibuat: 2026-10-19 (Siklus Abadi putaran 362)

INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('b1b1b1b1-0109-4000-8000-000000000109', 'EXP-TEK-259', 'b8888888-8888-8888-8888-888888888888', 'Satelit: Mata Indonesia dari Angkasa', 'satelit-mata-indonesia', 'Fungsi satelit, jenis orbit, dan satelit milik Indonesia.', 'id', 7, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-TEK-259';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
    (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', 'Fungsi')),
    (gen_random_uuid(), v_id, 'LIST', 1, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Komunikasi (TV, internet)$li$,
      $li$Navigasi (GPS)$li$,
      $li$Cuaca & bencana$li$,
      $li$Penginderaan jauh$li$
    ]))),
    (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', 'Orbit')),
    (gen_random_uuid(), v_id, 'LIST', 3, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$GEO 35.786 km: diam relatif bumi$li$,
      $li$LEO 500-2000 km: Starlink$li$,
      $li$MEO: GPS$li$
    ]))),
    (gen_random_uuid(), v_id, 'HEADING', 4, jsonb_build_object('text', 'Satelit Indonesia')),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 5, jsonb_build_object('text', $txt$Palapa (1976) → Telkom → SATRIA-2 (2023, 150 Gbps). BRIN kembangkan satelit nano.$txt$));
END $doblk$;
