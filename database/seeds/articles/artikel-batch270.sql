-- Batch 270: 1 artikel Agama (Shalat Id) — idempoten
-- Dibuat: 2026-10-19 (Siklus Abadi putaran 426)

INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('b1b1b1b1-0128-4000-8000-000000000128', 'EXP-AGA-278', 'b8888888-8888-8888-8888-888888888888', 'Shalat Idul Fitri & Idul Adha', 'shalat-idul-fitri-adha', 'Tata cara shalat Id: takbir tambahan, khutbah, dan sunnahnya.', 'id', 6, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-AGA-278';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
    (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', 'Hukum')),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 1, jsonb_build_object('text', $txt$Sunnah muakkad. 2 rakaat + khutbah setelahnya.$txt$)),
    (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', 'Takbir Tambahan')),
    (gen_random_uuid(), v_id, 'LIST', 3, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Rakaat 1: 7x takbir$li$,
      $li$Rakaat 2: 5x takbir$li$,
      $li$Di antara: tasbih$li$
    ]))),
    (gen_random_uuid(), v_id, 'HEADING', 4, jsonb_build_object('text', 'Sunnah')),
    (gen_random_uuid(), v_id, 'LIST', 5, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Mandi & pakaian terbaik$li$,
      $li$Makan dulu (Idul Fitri)$li$,
      $li$Jalan berbeda pergi-pulang$li$
    ])));
END $doblk$;
