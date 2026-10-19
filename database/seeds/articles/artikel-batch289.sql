-- Batch 289: 1 artikel Kesehatan (Anemia) — idempoten
-- Dibuat: 2026-10-19 (Siklus Abadi putaran 489)

INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('b1b1b1b1-0147-4000-8000-000000000147', 'EXP-KES-297', 'b8888888-8888-8888-8888-888888888888', 'Anemia: Kurang Darah Bukan Kurang Semangat', 'anemia-kurang-darah', 'Penyebab anemia, gejalanya, dan cara mengatasinya.', 'id', 7, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-KES-297';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
    (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', 'Penyebab')),
    (gen_random_uuid(), v_id, 'LIST', 1, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Kekurangan zat besi (tersering)$li$,
      $li$Pendarahan kronis$li$,
      $li$Kekurangan B12/folat$li$
    ]))),
    (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', 'Gejala 5L')),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 3, jsonb_build_object('text', $txt$Lemah, letih, lesu, lunglai, lalai. Pucat, pusing, jantung berdebar.$txt$)),
    (gen_random_uuid(), v_id, 'HEADING', 4, jsonb_build_object('text', 'Atasi')),
    (gen_random_uuid(), v_id, 'LIST', 5, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Makanan kaya zat besi + vitamin C$li$,
      $li$Tablet tambah darah (ibu hamil/remaja putri)$li$,
      $li$Obati penyebabnya$li$
    ])));
END $doblk$;
