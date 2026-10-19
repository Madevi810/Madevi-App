-- Batch 346: 1 artikel Lingkungan (Hutan) — idempoten
-- Dibuat: 2026-10-19 (Siklus Abadi putaran 679)

INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('b1b1b1b1-0204-4000-8000-000000000204', 'EXP-LING-354', 'b8888888-8888-8888-8888-888888888888', 'Deforestasi: Penyebab & Solusi', 'deforestasi-penyebab-solusi', 'Laju deforestasi Indonesia & upaya mengatasinya.', 'id', 8, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-LING-354';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
    (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', 'Penyebab')),
    (gen_random_uuid(), v_id, 'LIST', 1, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Perkebunan & pertambangan$li$,
      $li$Pembalakan liar$li$,
      $li$Kebakaran hutan$li$
    ]))),
    (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', 'Dampak')),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 3, jsonb_build_object('text', $txt$Banjir, longsor, emisi karbon, hilangnya habitat orangutan.$txt$)),
    (gen_random_uuid(), v_id, 'HEADING', 4, jsonb_build_object('text', 'Solusi')),
    (gen_random_uuid(), v_id, 'LIST', 5, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Reboisasi & agroforestri$li$,
      $li$Sertifikasi SVLK$li$,
      $li$Moratorium izin baru$li$
    ])));
END $doblk$;
