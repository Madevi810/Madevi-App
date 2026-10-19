-- Batch 281: 1 artikel Sejarah (Reformasi) — idempoten
-- Dibuat: 2026-10-19 (Siklus Abadi putaran 462)

INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('b1b1b1b1-0139-4000-8000-000000000139', 'EXP-SEJ-289', 'b8888888-8888-8888-8888-888888888888', 'Reformasi 1998: Tumbangnya Orde Baru', 'reformasi-1998-orde-baru', 'Krisis 1997-98, tragedi Trisakti, dan lahirnya era reformasi.', 'id', 9, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-SEJ-289';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
    (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', 'Krisis')),
    (gen_random_uuid(), v_id, 'LIST', 1, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Krisis moneter Asia 1997$li$,
      $li$Rupiah anjlok, harga melambung$li$,
      $li$KKN merajalela$li$
    ]))),
    (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', 'Puncak')),
    (gen_random_uuid(), v_id, 'LIST', 3, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$12 Mei 1998: tragedi Trisakti$li$,
      $li$Kerusuhan Mei$li$,
      $li$21 Mei 1998: Soeharto mundur$li$
    ]))),
    (gen_random_uuid(), v_id, 'HEADING', 4, jsonb_build_object('text', 'Hasil')),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 5, jsonb_build_object('text', $txt$Demokrasi, otonomi daerah, kebebasan pers. Agenda reformasi belum tuntas.$txt$));
END $doblk$;
