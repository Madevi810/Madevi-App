-- Batch 380: 1 artikel Teknologi (Drone) — idempoten
-- Dibuat: 2026-10-19 (Siklus Abadi putaran 792)

INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('b1b1b1b1-0238-4000-8000-000000000238', 'EXP-TEK-388', 'b8888888-8888-8888-8888-888888888888', 'Drone: Jenis & Aturan Terbang', 'drone-jenis-aturan', 'Jenis drone, aturan CASR, & tips aman.', 'id', 7, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-TEK-388';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
    (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', 'Jenis')),
    (gen_random_uuid(), v_id, 'LIST', 1, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Kamera (DJI dkk)$li$,
      $li$FPV racing$li$,
      $li$Survei & pertanian$li$
    ]))),
    (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', 'Aturan Indonesia')),
    (gen_random_uuid(), v_id, 'LIST', 3, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Maks 120 m (PM 37/2020)$li$,
      $li$Dilarang di zona terlarang$li$,
      $li$Registrasi bila >250g$li$
    ]))),
    (gen_random_uuid(), v_id, 'HEADING', 4, jsonb_build_object('text', 'Tips')),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 5, jsonb_build_object('text', $txt$Latihan di lapangan terbuka. Cek baterai & cuaca.$txt$));
END $doblk$;
