-- Batch 182: 1 artikel Fisika (Gaya Magnet) — idempoten
-- Dibuat: 2026-10-19 (Siklus Abadi putaran 132)

INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('b1b1b1b1-0040-4000-8000-000000000040', 'EXP-FIS-190', 'b8888888-8888-8888-8888-888888888888', 'Magnet: Kutub, Medan, dan Cara Membuatnya', 'magnet-kutub-medan', 'Sifat magnet, cara membuat magnet, dan penggunaannya dalam kehidupan.', 'id', 6, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-FIS-190';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
    (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', 'Sifat Magnet')),
    (gen_random_uuid(), v_id, 'LIST', 1, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Punya 2 kutub: utara & selatan$li$,
      $li$Senama tolak, beda tarik$li$,
      $li$Menarik besi, nikel, kobalt$li$,
      $li$Kutub tidak bisa dipisahkan$li$
    ]))),
    (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', '3 Cara Membuat Magnet')),
    (gen_random_uuid(), v_id, 'LIST', 3, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Gosok: gosok besi searah dengan magnet$li$,
      $li$Induksi: tempelkan besi ke magnet$li$,
      $li$Elektromagnet: lilit kawat + arus listrik$li$
    ]))),
    (gen_random_uuid(), v_id, 'HEADING', 4, jsonb_build_object('text', 'Penggunaan')),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 5, jsonb_build_object('text', $txt$Kompas, speaker, motor listrik, MRI, dan pintu kulkas — semua pakai magnet.$txt$));
END $doblk$;
