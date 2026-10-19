-- Batch 361: 1 artikel Lingkungan (Air) — idempoten
-- Dibuat: 2026-10-19 (Siklus Abadi putaran 729)

INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('b1b1b1b1-0219-4000-8000-000000000219', 'EXP-LING-369', 'b8888888-8888-8888-8888-888888888888', 'Krisis Air Bersih: Penyebab & Solusi', 'krisis-air-bersih', 'Mengapa air bersih langka & cara menghematnya.', 'id', 8, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-LING-369';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
    (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', 'Penyebab')),
    (gen_random_uuid(), v_id, 'LIST', 1, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Pencemaran industri & domestik$li$,
      $li$Intrusi air laut$li$,
      $li$Kemarau panjang$li$
    ]))),
    (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', 'Dampak')),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 3, jsonb_build_object('text', $txt$27 juta warga sulit air bersih (BPS). Diare & stunting meningkat.$txt$)),
    (gen_random_uuid(), v_id, 'HEADING', 4, jsonb_build_object('text', 'Solusi')),
    (gen_random_uuid(), v_id, 'LIST', 5, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Sumur resapan & biopori$li$,
      $li$Hemat: shower 5 menit$li$,
      $li$IPAL komunal$li$
    ])));
END $doblk$;
