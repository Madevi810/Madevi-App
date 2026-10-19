-- Batch 164: 1 artikel Kesehatan (Posisi Duduk) — idempoten
-- Dibuat: 2026-10-19 (Siklus Abadi putaran 72)

INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('b1b1b1b1-0022-4000-8000-000000000022', 'EXP-KES-172', 'b8888888-8888-8888-8888-888888888888', 'Posisi Duduk yang Benar Biar Tidak Sakit Pinggang', 'posisi-duduk-benar', 'Ergonomi duduk: kursi, meja, layar, dan stretching tiap 30 menit.', 'id', 6, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-KES-172';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
    (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', 'Posisi Ideal')),
    (gen_random_uuid(), v_id, 'LIST', 1, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Punggung tegak menempel sandaran$li$,
      $li$Layar sejajar mata, jarak 50-70 cm$li$,
      $li$Kaki menapak lantai, lutut 90 derajat$li$,
      $li$Siku 90 derajat, pergelangan netral$li$
    ]))),
    (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', 'Aturan 30 Menit')),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 3, jsonb_build_object('text', $txt$Tiap 30 menit: berdiri, jalan 1-2 menit, stretching leher-bahu. Duduk 8 jam tanpa jeda = risiko nyeri kronis.$txt$)),
    (gen_random_uuid(), v_id, 'HEADING', 4, jsonb_build_object('text', 'Stretching Cepat')),
    (gen_random_uuid(), v_id, 'LIST', 5, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Putar leher perlahan 4 arah$li$,
      $li$Angkat bahu ke telinga, tahan 5 detik$li$,
      $li$Putar pergelangan tangan$li$,
      $li$Berdiri, raih langit-langit$li$
    ])));
END $doblk$;
