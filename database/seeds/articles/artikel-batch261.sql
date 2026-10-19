-- Batch 261: 1 artikel Agama (Shalat Jumat) — idempoten
-- Dibuat: 2026-10-19 (Siklus Abadi putaran 396)

INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('b1b1b1b1-0119-4000-8000-000000000119', 'EXP-AGA-269', 'b8888888-8888-8888-8888-888888888888', 'Shalat Jumat: Syarat, Sunnah, dan Adabnya', 'shalat-jumat-syarat-sunnah', 'Ketentuan shalat Jumat: siapa wajib, sunnah sebelum-sesudah, dan adabnya.', 'id', 7, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-AGA-269';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
    (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', 'Wajib Bagi')),
    (gen_random_uuid(), v_id, 'LIST', 1, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Muslim, laki-laki, baligh, berakal$li$,
      $li$Mukim (bukan musafir)$li$,
      $li$Sehat (tidak uzur)$li$
    ]))),
    (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', 'Sunnah Jumat')),
    (gen_random_uuid(), v_id, 'LIST', 3, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Mandi, potong kuku, wangi$li$,
      $li$Datang awal$li$,
      $li$Al-Kahfi & shalawat$li$
    ]))),
    (gen_random_uuid(), v_id, 'HEADING', 4, jsonb_build_object('text', 'Adab')),
    (gen_random_uuid(), v_id, 'LIST', 5, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Jangan melangkahi jamaah$li$,
      $li$Diam saat khutbah$li$,
      $li$Shalat sunnah setelahnya$li$
    ])));
END $doblk$;
