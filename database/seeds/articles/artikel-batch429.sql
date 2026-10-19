-- Batch 429: 1 artikel Agama (Puasa Sunnah) — idempoten
-- Dibuat: 2026-10-19 (Siklus Abadi putaran 956)

INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('b1b1b1b1-0287-4000-8000-000000000287', 'EXP-AGA-437', 'b8888888-8888-8888-8888-888888888888', 'Puasa Sunnah: Senin-Kamis & Daud', 'puasa-sunnah-senin-kamis', 'Macam puasa sunnah & keutamaannya.', 'id', 6, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-AGA-437';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
    (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', 'Macam')),
    (gen_random_uuid(), v_id, 'LIST', 1, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Senin-Kamis$li$,
      $li$Daud (sehari puasa sehari tidak)$li$,
      $li$Arafah & Asyura$li$,
      $li$Syawal 6 hari$li$
    ]))),
    (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', 'Keutamaan')),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 3, jsonb_build_object('text', $txt$Dijauhkan dari neraka 70 tahun. Puasa Daud paling utama.$txt$)),
    (gen_random_uuid(), v_id, 'HEADING', 4, jsonb_build_object('text', 'Niat')),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 5, jsonb_build_object('text', $txt$Boleh pagi hari sebelum zawal.$txt$));
END $doblk$;
