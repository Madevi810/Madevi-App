-- Batch 327: 1 artikel Agama (Mandi Wajib) — idempoten
-- Dibuat: 2026-10-19 (Siklus Abadi putaran 616)

INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('b1b1b1b1-0185-4000-8000-000000000185', 'EXP-AGA-335', 'b8888888-8888-8888-8888-888888888888', 'Mandi Wajib: Tata Cara & Penyebab', 'mandi-wajib-tata-cara', 'Kapan wajib mandi & bagaimana tata caranya.', 'id', 7, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-AGA-335';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
    (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', 'Penyebab')),
    (gen_random_uuid(), v_id, 'LIST', 1, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Junub$li$,
      $li$Haid & nifas$li$,
      $li$Masuk Islam, meninggal$li$
    ]))),
    (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', 'Tata Cara')),
    (gen_random_uuid(), v_id, 'LIST', 3, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Niat$li$,
      $li$Basuh seluruh tubuh$li$,
      $li$Tertib$li$
    ]))),
    (gen_random_uuid(), v_id, 'HEADING', 4, jsonb_build_object('text', 'Sunnah')),
    (gen_random_uuid(), v_id, 'LIST', 5, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Wudhu dulu$li$,
      $li$Mulai dari kanan$li$,
      $li$Gosok sela-sela$li$
    ])));
END $doblk$;
