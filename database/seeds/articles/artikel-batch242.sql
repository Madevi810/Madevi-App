-- Batch 242: 1 artikel Sejarah (Majapahit) — idempoten
-- Dibuat: 2026-10-19 (Siklus Abadi putaran 332)

INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('b1b1b1b1-0100-4000-8000-000000000100', 'EXP-SEJ-250', 'b8888888-8888-8888-8888-888888888888', 'Majapahit: Kejayaan Nusantara Abad 14', 'majapahit-kejayaan-nusantara', 'Berdirinya Majapahit, Gajah Mada, dan warisannya.', 'id', 8, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-SEJ-250';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
    (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', 'Berdiri')),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 1, jsonb_build_object('text', $txt$1293: Raden Wijaya mendirikan Majapahit setelah mengusir Mongol. Ibukota di Trowulan, Jawa Timur.$txt$)),
    (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', 'Puncak Kejayaan')),
    (gen_random_uuid(), v_id, 'LIST', 3, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Hayam Wuruk + Gajah Mada (1350-1389)$li$,
      $li$Sumpah Palapa: menyatukan nusantara$li$,
      $li$Negarakertagama karya Mpu Prapanca$li$
    ]))),
    (gen_random_uuid(), v_id, 'HEADING', 4, jsonb_build_object('text', 'Warisan')),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 5, jsonb_build_object('text', $txt$Bhinneka Tunggal Ika dari kakawin Sutasoma era Majapahit. Inspirasi nama & semangat persatuan Indonesia.$txt$));
END $doblk$;
