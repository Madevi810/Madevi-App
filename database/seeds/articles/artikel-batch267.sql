-- Batch 267: 1 artikel Agama (Shalat Qashar) — idempoten
-- Dibuat: 2026-10-19 (Siklus Abadi putaran 416)

INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('b1b1b1b1-0125-4000-8000-000000000125', 'EXP-AGA-275', 'b8888888-8888-8888-8888-888888888888', 'Shalat Qashar dan Jamak bagi Musafir', 'shalat-qashar-jamak-musafir', 'Keringanan shalat saat safar: syarat, cara qashar & jamak.', 'id', 7, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-AGA-275';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
    (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', 'Syarat Musafir')),
    (gen_random_uuid(), v_id, 'LIST', 1, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Jarak ≥ 80 km (mayoritas)$li$,
      $li$Tujuan jelas, bukan maksiat$li$,
      $li$Keluar dari batas kota$li$
    ]))),
    (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', 'Qashar')),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 3, jsonb_build_object('text', $txt$Shalat 4 rakaat jadi 2 (Dzuhur, Ashar, Isya). Maghrib & Subuh tidak diqashar.$txt$)),
    (gen_random_uuid(), v_id, 'HEADING', 4, jsonb_build_object('text', 'Jamak')),
    (gen_random_uuid(), v_id, 'LIST', 5, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Jamak taqdim: di waktu pertama$li$,
      $li$Jamak takhir: di waktu kedua$li$,
      $li$Dzuhur+Ashar, Maghrib+Isya$li$
    ])));
END $doblk$;
