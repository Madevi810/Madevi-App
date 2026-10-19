-- Batch 235: 1 artikel Lingkungan (Udara) — idempoten
-- Dibuat: 2026-10-19 (Siklus Abadi putaran 309)

INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('b1b1b1b1-0093-4000-8000-000000000093', 'EXP-LING-243', 'b8888888-8888-8888-8888-888888888888', 'Polusi Udara: Pembunuh Tak Terlihat', 'polusi-udara-pembunuh', 'Sumber polusi udara, dampak kesehatan, dan cara melindungi diri.', 'id', 7, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-LING-243';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
    (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', 'Sumber')),
    (gen_random_uuid(), v_id, 'LIST', 1, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Kendaraan bermotor$li$,
      $li$Pabrik & PLTU$li$,
      $li$Pembakaran sampah$li$,
      $li$Kebakaran hutan$li$
    ]))),
    (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', 'Dampak')),
    (gen_random_uuid(), v_id, 'LIST', 3, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$ISPA & asma$li$,
      $li$Jantung & stroke$li$,
      $li$7 juta kematian/tahun (WHO)$li$
    ]))),
    (gen_random_uuid(), v_id, 'HEADING', 4, jsonb_build_object('text', 'Melindungi Diri')),
    (gen_random_uuid(), v_id, 'LIST', 5, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Cek AQI sebelum keluar$li$,
      $li$Masker saat polusi tinggi$li$,
      $li$Tanaman indoor$li$,
      $li$Kurangi kendaraan pribadi$li$
    ])));
END $doblk$;
