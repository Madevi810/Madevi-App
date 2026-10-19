-- Batch 230: 1 artikel Lingkungan (Karbon) — idempoten
-- Dibuat: 2026-10-19 (Siklus Abadi putaran 292)

INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('b1b1b1b1-0088-4000-8000-000000000088', 'EXP-LING-238', 'b8888888-8888-8888-8888-888888888888', 'Jejak Karbon: Hitung & Kurangi Emisimu', 'jejak-karbon-hitung', 'Apa itu jejak karbon, sumber terbesarnya, dan cara menguranginya.', 'id', 7, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-LING-238';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
    (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', 'Apa Itu Jejak Karbon')),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 1, jsonb_build_object('text', $txt$Total emisi gas rumah kaca dari aktivitasmu: listrik, kendaraan, makanan, barang. Diukur dalam kg CO2e.$txt$)),
    (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', 'Sumber Terbesar')),
    (gen_random_uuid(), v_id, 'LIST', 3, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Transportasi (pesawat >> mobil >> motor)$li$,
      $li$Listrik (batu bara)$li$,
      $li$Makanan (daging sapi tertinggi)$li$,
      $li$Barang konsumsi$li$
    ]))),
    (gen_random_uuid(), v_id, 'HEADING', 4, jsonb_build_object('text', 'Mengurangi')),
    (gen_random_uuid(), v_id, 'LIST', 5, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Naik transportasi umum / sepeda$li$,
      $li$Hemat listrik$li$,
      $li$Kurangi daging sapi$li$,
      $li$Beli yang perlu saja$li$
    ])));
END $doblk$;
