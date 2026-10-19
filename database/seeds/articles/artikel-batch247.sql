-- Batch 247: 1 artikel Lingkungan (Hutan Mangrove) — idempoten
-- Dibuat: 2026-10-19 (Siklus Abadi putaran 349)

INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('b1b1b1b1-0105-4000-8000-000000000105', 'EXP-LING-255', 'b8888888-8888-8888-8888-888888888888', 'Mangrove: Benteng Pesisir Indonesia', 'mangrove-benteng-pesisir', 'Fungsi hutan mangrove dan upaya restorasinya.', 'id', 7, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-LING-255';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
    (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', 'Fungsi Mangrove')),
    (gen_random_uuid(), v_id, 'LIST', 1, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Penahan abrasi & tsunami$li$,
      $li$Tempat ikan bertelur$li$,
      $li$Penyerap karbon 4x hutan biasa$li$,
      $li$Ekowisata$li$
    ]))),
    (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', 'Ancaman')),
    (gen_random_uuid(), v_id, 'LIST', 3, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Tambak ilegal$li$,
      $li$Reklamasi$li$,
      $li$Sampah plastik$li$
    ]))),
    (gen_random_uuid(), v_id, 'HEADING', 4, jsonb_build_object('text', 'Restorasi')),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 5, jsonb_build_object('text', $txt$Indonesia target rehabilitasi 600 ribu ha mangrove. Ikut menanam via komunitas pesisir.$txt$));
END $doblk$;
