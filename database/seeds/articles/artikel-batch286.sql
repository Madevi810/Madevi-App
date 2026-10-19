-- Batch 286: 1 artikel Lingkungan (Polusi Udara) — idempoten
-- Dibuat: 2026-10-19 (Siklus Abadi putaran 479)

INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('b1b1b1b1-0144-4000-8000-000000000144', 'EXP-LING-294', 'b8888888-8888-8888-8888-888888888888', 'Polusi Udara: Musuh Tak Terlihat', 'polusi-udara-musuh-tak-terlihat', 'PM2.5, sumbernya, dampak kesehatan, dan cara melindungi diri.', 'id', 8, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-LING-294';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
    (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', 'PM2.5')),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 1, jsonb_build_object('text', $txt$Partikel <2,5 mikron menembus paru-paru & darah. WHO: aman <15 µg/m³/hari.$txt$)),
    (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', 'Sumber')),
    (gen_random_uuid(), v_id, 'LIST', 3, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Kendaraan$li$,
      $li$Industri & PLTU$li$,
      $li$Pembakaran sampah$li$
    ]))),
    (gen_random_uuid(), v_id, 'HEADING', 4, jsonb_build_object('text', 'Lindungi Diri')),
    (gen_random_uuid(), v_id, 'LIST', 5, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Masker N95 saat AQI buruk$li$,
      $li$Air purifier di rumah$li$,
      $li$Kurangi aktivitas luar$li$
    ])));
END $doblk$;
