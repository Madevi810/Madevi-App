-- Batch 188: 1 artikel Keterampilan (Menjahit) — idempoten
-- Dibuat: 2026-10-19 (Siklus Abadi putaran 152)

INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('b1b1b1b1-0046-4000-8000-000000000046', 'EXP-KET-196', 'b8888888-8888-8888-8888-888888888888', 'Menjahit Tangan Dasar: Tusuk yang Wajib Dikuasai', 'menjahit-tangan-dasar', 'Tusuk jelujur, tusuk balik, dan tusuk feston — plus proyek pertama: sarung bantal.', 'id', 7, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-KET-196';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
    (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', 'Alat Dasar')),
    (gen_random_uuid(), v_id, 'LIST', 1, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Jarum jahit tangan$li$,
      $li$Benang jahit$li$,
      $li$Gunting kain$li$,
      $li$Peniti & kapur jahit$li$,
      $li$Bidangan (opsional)$li$
    ]))),
    (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', '3 Tusuk Wajib')),
    (gen_random_uuid(), v_id, 'LIST', 3, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Jelujur: tusuk lurus berjarak, untuk sementara$li$,
      $li$Tusuk balik (backstitch): kuat, untuk jahitan permanen$li$,
      $li$Feston: untuk tepi kain agar tidak berumbai$li$
    ]))),
    (gen_random_uuid(), v_id, 'HEADING', 4, jsonb_build_object('text', 'Proyek Pertama')),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 5, jsonb_build_object('text', $txt$Sarung bantal: potong kain 2x ukuran bantal + kampuh 2cm, jahit 3 sisi dengan tusuk balik, balik, selesai!$txt$));
END $doblk$;
