-- Batch 201: 1 artikel Agama (Tahajud) — idempoten
-- Dibuat: 2026-10-19 (Siklus Abadi putaran 196)

INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('b1b1b1b1-0059-4000-8000-000000000059', 'EXP-AGA-209', 'b8888888-8888-8888-8888-888888888888', 'Shalat Tahajud: Keutamaan dan Tata Cara', 'shalat-tahajud-keutamaan', 'Keutamaan qiyamul lail, tata cara, dan tips istiqamah.', 'id', 7, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-AGA-209';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
    (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', 'Keutamaan')),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 1, jsonb_build_object('text', $txt$"Dan pada sebagian malam, lakukanlah shalat tahajud (sebagai suatu ibadah) tambahan bagimu: mudah-mudahan Tuhanmu mengangkatmu ke tempat yang terpuji" (QS. Al-Isra: 79).$txt$)),
    (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', 'Tata Cara')),
    (gen_random_uuid(), v_id, 'LIST', 3, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Setelah tidur, sebelum subuh$li$,
      $li$Minimal 2 rakaat, tanpa batas$li$,
      $li$Ditutup witir$li$
    ]))),
    (gen_random_uuid(), v_id, 'HEADING', 4, jsonb_build_object('text', 'Tips Istiqamah')),
    (gen_random_uuid(), v_id, 'LIST', 5, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Tidur lebih awal$li$,
      $li$Pasang alarm$li$,
      $li$Niat kuat sebelum tidur$li$,
      $li$Mulai dari 2 rakaat$li$
    ])));
END $doblk$;
