-- Batch 223: 1 artikel Lingkungan (Laut) — idempoten
-- Dibuat: 2026-10-19 (Siklus Abadi putaran 269)

INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('b1b1b1b1-0081-4000-8000-000000000081', 'EXP-LING-231', 'b8888888-8888-8888-8888-888888888888', 'Laut Indonesia: Harta Karun yang Terancam', 'laut-indonesia-harta-karun', 'Kekayaan laut Indonesia: terumbu karang, perikanan, dan ancamannya.', 'id', 8, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-LING-231';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
    (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', 'Kekayaan Laut')),
    (gen_random_uuid(), v_id, 'LIST', 1, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Segitiga karang: pusat keanekaragaman dunia$li$,
      $li$Potensi perikanan 12 juta ton/tahun$li$,
      $li$17.000+ pulau$li$
    ]))),
    (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', 'Ancaman')),
    (gen_random_uuid(), v_id, 'LIST', 3, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Illegal fishing$li$,
      $li$Bom & potasium$li$,
      $li$Pemanasan laut (pemutihan karang)$li$,
      $li$Sampah plastik$li$
    ]))),
    (gen_random_uuid(), v_id, 'HEADING', 4, jsonb_build_object('text', 'Menjaga')),
    (gen_random_uuid(), v_id, 'LIST', 5, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Beli ikan dari nelayan legal$li$,
      $li$Jangan buang sampah ke laut$li$,
      $li$Dukung kawasan konservasi$li$,
      $li$Wisata bahari bertanggung jawab$li$
    ])));
END $doblk$;
