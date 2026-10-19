-- Batch 355: 1 artikel Kesehatan (Diabetes) — idempoten
-- Dibuat: 2026-10-19 (Siklus Abadi putaran 709)

INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('b1b1b1b1-0213-4000-8000-000000000213', 'EXP-KES-363', 'b8888888-8888-8888-8888-888888888888', 'Diabetes Melitus: Kenali & Kendalikan', 'diabetes-melitus-kenali', 'Tipe, gejala, & pengelolaan diabetes sehari-hari.', 'id', 9, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-KES-363';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
    (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', 'Tipe')),
    (gen_random_uuid(), v_id, 'LIST', 1, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Tipe 1: autoimun, butuh insulin$li$,
      $li$Tipe 2: resistensi insulin (terbanyak)$li$,
      $li$Gestational: saat hamil$li$
    ]))),
    (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', 'Gejala 3P')),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 3, jsonb_build_object('text', $txt$Polidipsi (haus), poliuri (sering kencing), polifagi (lapar). Gula puasa ≥126 mg/dL.$txt$)),
    (gen_random_uuid(), v_id, 'HEADING', 4, jsonb_build_object('text', 'Kelola')),
    (gen_random_uuid(), v_id, 'LIST', 5, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Diet 3J: jumlah, jenis, jadwal$li$,
      $li$Olahraga rutin$li$,
      $li$Obat teratur$li$
    ])));
END $doblk$;
