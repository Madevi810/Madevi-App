-- Batch 357: 1 artikel Agama (Aqiqah) — idempoten
-- Dibuat: 2026-10-19 (Siklus Abadi putaran 716)

INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('b1b1b1b1-0215-4000-8000-000000000215', 'EXP-AGA-365', 'b8888888-8888-8888-8888-888888888888', 'Aqiqah: Hukum & Tata Cara', 'aqiqah-hukum-tata-cara', 'Hukum aqiqah, jumlah kambing, & waktunya.', 'id', 7, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-AGA-365';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
    (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', 'Hukum')),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 1, jsonb_build_object('text', $txt$Sunnah muakkad. 2 kambing (laki-laki), 1 kambing (perempuan).$txt$)),
    (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', 'Waktu')),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 3, jsonb_build_object('text', $txt$Hari ke-7 kelahiran. Bila terlewat, kapan saja sebelum baligh.$txt$)),
    (gen_random_uuid(), v_id, 'HEADING', 4, jsonb_build_object('text', 'Tata Cara')),
    (gen_random_uuid(), v_id, 'LIST', 5, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Sembelih & niat$li$,
      $li$Cukur rambut bayi$li$,
      $li$Sedekah seberat rambut (emas/perak)$li$,
      $li$Beri nama baik$li$
    ])));
END $doblk$;
