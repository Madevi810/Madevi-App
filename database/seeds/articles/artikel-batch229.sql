-- Batch 229: 1 artikel Kesehatan (Anemia) — idempoten
-- Dibuat: 2026-10-19 (Siklus Abadi putaran 289)

INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('b1b1b1b1-0087-4000-8000-000000000087', 'EXP-KES-237', 'b8888888-8888-8888-8888-888888888888', 'Anemia: Kenapa Mudah Lelah dan Pucat', 'anemia-mudah-lelah', 'Penyebab anemia, gejala, dan cara mengatasinya dengan makanan.', 'id', 6, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-KES-237';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
    (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', 'Gejala')),
    (gen_random_uuid(), v_id, 'LIST', 1, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$5L: lemah, letih, lesu, lunglai$li$,
      $li$Pucat (kelopak mata, kuku)$li$,
      $li$Pusing & jantung berdebar$li$
    ]))),
    (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', 'Penyebab Umum')),
    (gen_random_uuid(), v_id, 'LIST', 3, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Kurang zat besi (tersering)$li$,
      $li$Kehilangan darah (haid berat)$li$,
      $li$Kurang B12/folat$li$
    ]))),
    (gen_random_uuid(), v_id, 'HEADING', 4, jsonb_build_object('text', 'Atasi')),
    (gen_random_uuid(), v_id, 'LIST', 5, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Hati, daging merah, bayam, kacang$li$,
      $li$Vitamin C bantu serap zat besi$li$,
      $li$Tablet tambah darah (ibu hamil)$li$,
      $li$Periksa Hb bila gejala menetap$li$
    ])));
END $doblk$;
