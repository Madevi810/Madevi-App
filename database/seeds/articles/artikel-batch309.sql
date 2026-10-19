-- Batch 309: 1 artikel Agama (Wakaf) — idempoten
-- Dibuat: 2026-10-19 (Siklus Abadi putaran 556)

INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('b1b1b1b1-0167-4000-8000-000000000167', 'EXP-AGA-317', 'b8888888-8888-8888-8888-888888888888', 'Wakaf: Harta yang Mengalir', 'wakaf-harta-mengalir', 'Rukun wakaf, wakaf uang, & pengelolaannya.', 'id', 7, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-AGA-317';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
    (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', 'Rukun')),
    (gen_random_uuid(), v_id, 'LIST', 1, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Wakif (pewakaf)$li$,
      $li$Mauquf (harta)$li$,
      $li$Mauquf alaih (penerima manfaat)$li$,
      $li$Sighat (ikrar)$li$
    ]))),
    (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', 'Wakaf Uang')),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 3, jsonb_build_object('text', $txt$Boleh (fatwa MUI 2002). Dikelola produktif, manfaatnya disalurkan.$txt$)),
    (gen_random_uuid(), v_id, 'HEADING', 4, jsonb_build_object('text', 'Pengelola')),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 5, jsonb_build_object('text', $txt$Nazhir: perorangan/organisasi/badan hukum. Pilih yang amanah & transparan.$txt$));
END $doblk$;
