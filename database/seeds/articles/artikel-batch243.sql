-- Batch 243: 1 artikel Agama (Tayamum) — idempoten
-- Dibuat: 2026-10-19 (Siklus Abadi putaran 336)

INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('b1b1b1b1-0101-4000-8000-000000000101', 'EXP-AGA-251', 'b8888888-8888-8888-8888-888888888888', 'Tayamum: Bersuci Tanpa Air', 'tayamum-bersuci-tanpa-air', 'Syarat, tata cara, dan pembatal tayamum.', 'id', 6, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-AGA-251';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
    (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', 'Kapan Boleh')),
    (gen_random_uuid(), v_id, 'LIST', 1, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Tidak ada air$li$,
      $li$Sakit bila kena air$li$,
      $li$Air hanya cukup untuk minum$li$
    ]))),
    (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', 'Tata Cara')),
    (gen_random_uuid(), v_id, 'LIST', 3, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Niat$li$,
      $li$Tepuk debu 1x → usap wajah$li$,
      $li$Tepuk lagi → usap tangan sampai siku$li$
    ]))),
    (gen_random_uuid(), v_id, 'HEADING', 4, jsonb_build_object('text', 'Pembatal')),
    (gen_random_uuid(), v_id, 'LIST', 5, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Hal yang membatalkan wudhu$li$,
      $li$Menemukan air$li$,
      $li$Sembuh dari sakit$li$
    ])));
END $doblk$;
