-- Batch 232: 1 artikel Kesehatan (Maag) — idempoten
-- Dibuat: 2026-10-19 (Siklus Abadi putaran 299)

INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('b1b1b1b1-0090-4000-8000-000000000090', 'EXP-KES-240', 'b8888888-8888-8888-8888-888888888888', 'Maag & GERD: Atasi Asam Lambung Naik', 'maag-gerd-asam-lambung', 'Bedanya maag dan GERD, pemicu, dan cara mengatasinya.', 'id', 7, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-KES-240';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
    (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', 'Maag vs GERD')),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 1, jsonb_build_object('text', $txt$Maag: radang lambung. GERD: asam naik ke kerongkongan (rasa terbakar di dada). Bisa terjadi bersamaan.$txt$)),
    (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', 'Pemicu')),
    (gen_random_uuid(), v_id, 'LIST', 3, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Telat makan$li$,
      $li$Kopi, pedas, asam, gorengan$li$,
      $li$Stres$li$,
      $li$Tidur setelah makan$li$
    ]))),
    (gen_random_uuid(), v_id, 'HEADING', 4, jsonb_build_object('text', 'Atasi')),
    (gen_random_uuid(), v_id, 'LIST', 5, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Makan teratur porsi kecil$li$,
      $li$Hindari pemicu$li$,
      $li$Tinggikan bantal$li$,
      $li$Antasida untuk darurat$li$,
      $li$Ke dokter bila muntah darah / BB turun$li$
    ])));
END $doblk$;
