-- Batch 368: 1 artikel Teknologi (Robot) — idempoten
-- Dibuat: 2026-10-19 (Siklus Abadi putaran 752)

INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('b1b1b1b1-0226-4000-8000-000000000226', 'EXP-TEK-376', 'b8888888-8888-8888-8888-888888888888', 'Robot: Dari Pabrik ke Rumah', 'robot-dari-pabrik-ke-rumah', 'Jenis robot & perannya di industri dan rumah tangga.', 'id', 7, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-TEK-376';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
    (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', 'Jenis')),
    (gen_random_uuid(), v_id, 'LIST', 1, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Industri: lengan robot$li$,
      $li$Rumah: vacuum cleaner$li$,
      $li$Medis: bedah presisi$li$
    ]))),
    (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', 'Di Indonesia')),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 3, jsonb_build_object('text', $txt$Pabrik otomotif & elektronik. Kontes robot mahasiswa (KRI) tiap tahun.$txt$)),
    (gen_random_uuid(), v_id, 'HEADING', 4, jsonb_build_object('text', 'Masa Depan')),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 5, jsonb_build_object('text', $txt$Kolaborasi manusia-robot (cobot). Pekerjaan baru: teknisi robot.$txt$));
END $doblk$;
