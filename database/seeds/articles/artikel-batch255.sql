-- Batch 255: 1 artikel Agama (Mandi Wajib) — idempoten
-- Dibuat: 2026-10-19 (Siklus Abadi putaran 376)

INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('b1b1b1b1-0113-4000-8000-000000000113', 'EXP-AGA-263', 'b8888888-8888-8888-8888-888888888888', 'Mandi Wajib: Sebab dan Tata Caranya', 'mandi-wajib-sebab-tata-cara', 'Hal yang mewajibkan mandi dan rukunnya.', 'id', 6, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-AGA-263';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
    (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', 'Penyebab Wajib')),
    (gen_random_uuid(), v_id, 'LIST', 1, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Junub$li$,
      $li$Haid & nifas$li$,
      $li$Masuk Islam$li$,
      $li$Meninggal (dimandikan)$li$
    ]))),
    (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', 'Rukun')),
    (gen_random_uuid(), v_id, 'LIST', 3, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Niat$li$,
      $li$Meratakan air ke seluruh tubuh$li$
    ]))),
    (gen_random_uuid(), v_id, 'HEADING', 4, jsonb_build_object('text', 'Sunnah')),
    (gen_random_uuid(), v_id, 'LIST', 5, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Wudhu dulu$li$,
      $li$Mendahulukan kanan$li$,
      $li$3x basuhan$li$
    ])));
END $doblk$;
