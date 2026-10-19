-- Batch 163: 1 artikel Fisika (Listrik Statis) — idempoten
-- Dibuat: 2026-10-19 (Siklus Abadi putaran 69)

INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('b1b1b1b1-0021-4000-8000-000000000021', 'EXP-FIS-171', 'b8888888-8888-8888-8888-888888888888', 'Listrik Statis: Kenapa Kesetrum Pintu Mobil', 'listrik-statis-kesetrum', 'Muatan listrik statis: penyebab, contoh sehari-hari, dan cara menghindarinya.', 'id', 6, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-FIS-171';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
    (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', 'Apa itu Listrik Statis')),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 1, jsonb_build_object('text', $txt$Muatan listrik menumpuk di permukaan benda karena gesekan. Penggaris digosok ke rambut bisa menarik kertas kecil — itu listrik statis.$txt$)),
    (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', 'Contoh Sehari-hari')),
    (gen_random_uuid(), v_id, 'LIST', 3, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Kesetrum gagang pintu mobil$li$,
      $li$Rambut berdiri setelah lepas sweater$li$,
      $li$Petir (skala raksasa)$li$,
      $li$Debu menempel di layar TV$li$
    ]))),
    (gen_random_uuid(), v_id, 'HEADING', 4, jsonb_build_object('text', 'Cara Mengurangi')),
    (gen_random_uuid(), v_id, 'LIST', 5, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Sentuh bodi mobil dengan telapak sebelum pegang gagang$li$,
      $li$Pakai pelembap kulit (kulit kering mudah bermuatan)$li$,
      $li$Hindari pakaian sintetis saat udara kering$li$
    ])));
END $doblk$;
