-- Batch 258: 1 artikel Agama (Puasa Ramadhan) — idempoten
-- Dibuat: 2026-10-19 (Siklus Abadi putaran 386)

INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('b1b1b1b1-0116-4000-8000-000000000116', 'EXP-AGA-266', 'b8888888-8888-8888-8888-888888888888', 'Puasa Ramadhan: Rukun, Sunnah, dan Pembatalnya', 'puasa-ramadhan-rukun-sunnah', 'Ketentuan puasa Ramadhan lengkap: rukun, sunnah, pembatal, dan qadha.', 'id', 8, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-AGA-266';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
    (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', 'Rukun')),
    (gen_random_uuid(), v_id, 'LIST', 1, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Niat (malam hari)$li$,
      $li$Menahan dari terbit fajar sampai maghrib$li$
    ]))),
    (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', 'Sunnah')),
    (gen_random_uuid(), v_id, 'LIST', 3, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Sahur & mengakhirkan$li$,
      $li$Segera berbuka$li$,
      $li$Tarawih & tadarus$li$,
      $li$Iktikaf 10 malam terakhir$li$
    ]))),
    (gen_random_uuid(), v_id, 'HEADING', 4, jsonb_build_object('text', 'Pembatal & Qadha')),
    (gen_random_uuid(), v_id, 'LIST', 5, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Makan/minum sengaja, muntah sengaja$li$,
      $li$Haid/nifas → wajib qadha$li$,
      $li$Sakit/musafir → boleh tidak puasa, qadha$li$
    ])));
END $doblk$;
