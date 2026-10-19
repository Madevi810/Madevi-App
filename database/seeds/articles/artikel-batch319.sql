-- Batch 319: 1 artikel Lingkungan (Terumbu Karang) — idempoten
-- Dibuat: 2026-10-19 (Siklus Abadi putaran 589)

INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('b1b1b1b1-0177-4000-8000-000000000177', 'EXP-LING-327', 'b8888888-8888-8888-8888-888888888888', 'Terumbu Karang: Hutan Bawah Laut', 'terumbu-karang-hutan-bawah-laut', 'Ekosistem karang Indonesia, ancamannya, & konservasinya.', 'id', 8, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-LING-327';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
    (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', 'Kekayaan')),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 1, jsonb_build_object('text', $txt$Segitiga karang: Indonesia pusat keanekaragaman karang dunia.$txt$)),
    (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', 'Ancaman')),
    (gen_random_uuid(), v_id, 'LIST', 3, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Pemutihan (bleaching)$li$,
      $li$Bom & sianida$li$,
      $li$Sedimentasi$li$
    ]))),
    (gen_random_uuid(), v_id, 'HEADING', 4, jsonb_build_object('text', 'Konservasi')),
    (gen_random_uuid(), v_id, 'LIST', 5, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Kawasan konservasi$li$,
      $li$Transplantasi karang$li$,
      $li$Wisata bahari lestari$li$
    ])));
END $doblk$;
