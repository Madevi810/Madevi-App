-- Batch 264: 1 artikel Agama (Iktikaf) — idempoten
-- Dibuat: 2026-10-19 (Siklus Abadi putaran 406)

INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('b1b1b1b1-0122-4000-8000-000000000122', 'EXP-AGA-272', 'b8888888-8888-8888-8888-888888888888', 'Iktikaf: Meraih Lailatul Qadar', 'iktikaf-lailatul-qadar', 'Hukum, syarat, dan amalan iktikaf di 10 malam terakhir Ramadhan.', 'id', 6, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-AGA-272';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
    (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', 'Pengertian')),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 1, jsonb_build_object('text', $txt$Iktikaf = berdiam di masjid untuk ibadah. Sunnah muakkad di 10 malam terakhir Ramadhan.$txt$)),
    (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', 'Syarat')),
    (gen_random_uuid(), v_id, 'LIST', 3, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Muslim, berakal$li$,
      $li$Suci dari hadas besar$li$,
      $li$Di masjid$li$,
      $li$Niat$li$
    ]))),
    (gen_random_uuid(), v_id, 'HEADING', 4, jsonb_build_object('text', 'Amalan')),
    (gen_random_uuid(), v_id, 'LIST', 5, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Shalat malam & witir$li$,
      $li$Tadarus & dzikir$li$,
      $li$Doa: "Allahumma innaka afuwwun..."$li$
    ])));
END $doblk$;
