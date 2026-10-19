-- Batch 332: 1 artikel Teknologi (Drone) — idempoten
-- Dibuat: 2026-10-19 (Siklus Abadi putaran 632)

INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('b1b1b1b1-0190-4000-8000-000000000190', 'EXP-TEK-340', 'b8888888-8888-8888-8888-888888888888', 'Drone: Aturan & Kegunaan', 'drone-aturan-kegunaan', 'Jenis drone, aturan terbang di Indonesia, & kegunaannya.', 'id', 7, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-TEK-340';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
    (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', 'Kegunaan')),
    (gen_random_uuid(), v_id, 'LIST', 1, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Fotografi & videografi$li$,
      $li$Pemetaan & survei$li$,
      $li$Pertanian presisi$li$,
      $li$Pengiriman$li$
    ]))),
    (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', 'Aturan Indonesia')),
    (gen_random_uuid(), v_id, 'LIST', 3, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Maks 120 m (PM 37/2020)$li$,
      $li$Dilarang di zona terlarang$li$,
      $li$Registrasi bila >250g$li$
    ]))),
    (gen_random_uuid(), v_id, 'HEADING', 4, jsonb_build_object('text', 'Tips Aman')),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 5, jsonb_build_object('text', $txt$Cek baterai, cuaca, & jauh dari keramaian.$txt$));
END $doblk$;
