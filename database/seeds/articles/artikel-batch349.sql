-- Batch 349: 1 artikel Kesehatan (Stunting) — idempoten
-- Dibuat: 2026-10-19 (Siklus Abadi putaran 689)

INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('b1b1b1b1-0207-4000-8000-000000000207', 'EXP-KES-357', 'b8888888-8888-8888-8888-888888888888', 'Stunting: Cegah Sejak 1000 HPK', 'stunting-cegah-1000-hpk', 'Penyebab stunting & intervensi 1000 hari pertama kehidupan.', 'id', 8, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-KES-357';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
    (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', 'Apa Itu')),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 1, jsonb_build_object('text', $txt$Gagal tumbuh akibat kurang gizi kronis. Tinggi < -2 SD standar WHO.$txt$)),
    (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', '1000 HPK')),
    (gen_random_uuid(), v_id, 'LIST', 3, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Hamil: TTD + gizi ibu$li$,
      $li$0-6 bln: ASI eksklusif$li$,
      $li$6-24 bln: MPASI bergizi$li$
    ]))),
    (gen_random_uuid(), v_id, 'HEADING', 4, jsonb_build_object('text', 'Cegah')),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 5, jsonb_build_object('text', $txt$Posyandu rutin, jamban sehat, cuci tangan pakai sabun.$txt$));
END $doblk$;
