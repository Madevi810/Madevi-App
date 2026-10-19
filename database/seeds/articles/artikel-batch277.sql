-- Batch 277: 1 artikel Kesehatan (Diabetes) — idempoten
-- Dibuat: 2026-10-19 (Siklus Abadi putaran 449)

INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('b1b1b1b1-0135-4000-8000-000000000135', 'EXP-KES-285', 'b8888888-8888-8888-8888-888888888888', 'Diabetes: Manis yang Mematikan', 'diabetes-manis-mematikan', 'Tipe 1 & 2, gejala, dan cara mengendalikan gula darah.', 'id', 9, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-KES-285';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
    (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', 'Tipe')),
    (gen_random_uuid(), v_id, 'LIST', 1, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Tipe 1: autoimun, butuh insulin$li$,
      $li$Tipe 2: resistensi insulin (90% kasus)$li$
    ]))),
    (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', 'Gejala 3P')),
    (gen_random_uuid(), v_id, 'LIST', 3, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Polidipsi: haus terus$li$,
      $li$Poliuri: kencing terus$li$,
      $li$Polifagi: lapar terus$li$
    ]))),
    (gen_random_uuid(), v_id, 'HEADING', 4, jsonb_build_object('text', 'Kendali')),
    (gen_random_uuid(), v_id, 'LIST', 5, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Batasi gula & karbo olahan$li$,
      $li$Olahraga rutin$li$,
      $li$Obat/insulin sesuai resep$li$,
      $li$Cek gula rutin$li$
    ])));
END $doblk$;
