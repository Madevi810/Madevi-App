-- Batch 200: 1 artikel Keterampilan (Public Speaking 2) — idempoten
-- Dibuat: 2026-10-19 (Siklus Abadi putaran 192)

INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('b1b1b1b1-0058-4000-8000-000000000058', 'EXP-KET-208', 'b8888888-8888-8888-8888-888888888888', 'Storytelling: Seni Bercerita yang Memikat', 'storytelling-memikat', 'Struktur cerita, teknik hook, dan latihan bercerita untuk presentasi.', 'id', 7, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-KET-208';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
    (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', 'Kenapa Cerita')),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 1, jsonb_build_object('text', $txt$Otak mengingat cerita 22x lebih baik dari fakta mentah. Presentasi terbaik selalu punya cerita.$txt$)),
    (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', 'Struktur 4 Bagian')),
    (gen_random_uuid(), v_id, 'LIST', 3, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Konteks: siapa, kapan, di mana$li$,
      $li$Konflik: masalahnya apa$li$,
      $li$Klimaks: titik balik$li$,
      $li$Resolusi: pelajaran$li$
    ]))),
    (gen_random_uuid(), v_id, 'HEADING', 4, jsonb_build_object('text', 'Latihan')),
    (gen_random_uuid(), v_id, 'LIST', 5, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Ceritakan pengalaman 2 menit$li$,
      $li$Rekam & dengarkan ulang$li$,
      $li$Minta feedback 1 orang$li$
    ])));
END $doblk$;
