-- Batch 324: 1 artikel Agama (Iktikaf) — idempoten
-- Dibuat: 2026-10-19 (Siklus Abadi putaran 606)

INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('b1b1b1b1-0182-4000-8000-000000000182', 'EXP-AGA-332', 'b8888888-8888-8888-8888-888888888888', 'Iktikaf: Berdiam di Masjid', 'iktikaf-berdiam-di-masjid', 'Hukum, syarat, & amalan saat iktikaf.', 'id', 7, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-AGA-332';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
    (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', 'Pengertian')),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 1, jsonb_build_object('text', $txt$Berdiam di masjid dengan niat ibadah. Sunnah, terutama 10 malam terakhir Ramadhan.$txt$)),
    (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', 'Syarat')),
    (gen_random_uuid(), v_id, 'LIST', 3, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Muslim, berakal$li$,
      $li$Suci dari hadas besar$li$,
      $li$Di masjid$li$
    ]))),
    (gen_random_uuid(), v_id, 'HEADING', 4, jsonb_build_object('text', 'Amalan')),
    (gen_random_uuid(), v_id, 'LIST', 5, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Shalat, tilawah, zikir$li$,
      $li$Hindari obrolan dunia$li$,
      $li$Buru lailatul qadar$li$
    ])));
END $doblk$;
