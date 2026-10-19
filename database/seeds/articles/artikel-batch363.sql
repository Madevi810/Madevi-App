-- Batch 363: 1 artikel Agama (Wakaf) — idempoten
-- Dibuat: 2026-10-19 (Siklus Abadi putaran 736)

INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('b1b1b1b1-0221-4000-8000-000000000221', 'EXP-AGA-371', 'b8888888-8888-8888-8888-888888888888', 'Wakaf: Sedekah Jariyah', 'wakaf-sedekah-jariyah', 'Rukun wakaf, jenis, & cara berwakaf yang sah.', 'id', 7, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-AGA-371';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
    (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', 'Rukun')),
    (gen_random_uuid(), v_id, 'LIST', 1, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Wakif (pemberi)$li$,
      $li$Mauquf (harta)$li$,
      $li$Mauquf alaih (penerima manfaat)$li$,
      $li$Sighat (akad)$li$
    ]))),
    (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', 'Jenis')),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 3, jsonb_build_object('text', $txt$Tanah, bangunan, uang (wakaf tunai). Nazhir mengelola.$txt$)),
    (gen_random_uuid(), v_id, 'HEADING', 4, jsonb_build_object('text', 'Cara Sah')),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 5, jsonb_build_object('text', $txt$Akta ikrar wakaf di KUA. Daftar ke BWI untuk wakaf uang.$txt$));
END $doblk$;
