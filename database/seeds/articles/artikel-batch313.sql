-- Batch 313: 1 artikel Kesehatan (Diabetes) — idempoten
-- Dibuat: 2026-10-19 (Siklus Abadi putaran 569)

INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('b1b1b1b1-0171-4000-8000-000000000171', 'EXP-KES-321', 'b8888888-8888-8888-8888-888888888888', 'Diabetes: Manis yang Berbahaya', 'diabetes-manis-berbahaya', 'Tipe 1 vs 2, gejala 3P, dan cara mengendalikannya.', 'id', 8, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-KES-321';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
    (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', 'Tipe')),
    (gen_random_uuid(), v_id, 'LIST', 1, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Tipe 1: autoimun, butuh insulin$li$,
      $li$Tipe 2: resistensi insulin (90% kasus)$li$
    ]))),
    (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', 'Gejala 3P')),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 3, jsonb_build_object('text', $txt$Polidipsi (haus), poliuri (kencing), polifagi (lapar). Plus BB turun & luka sulit sembuh.$txt$)),
    (gen_random_uuid(), v_id, 'HEADING', 4, jsonb_build_object('text', 'Kendali')),
    (gen_random_uuid(), v_id, 'LIST', 5, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Diet rendah gula & karbo$li$,
      $li$Olahraga rutin$li$,
      $li$Obat/insulin teratur$li$,
      $li$Cek gula berkala$li$
    ])));
END $doblk$;
