-- Batch 276: 1 artikel Agama (Sumpah) — idempoten
-- Dibuat: 2026-10-19 (Siklus Abadi putaran 446)

INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('b1b1b1b1-0134-4000-8000-000000000134', 'EXP-AGA-284', 'b8888888-8888-8888-8888-888888888888', 'Sumpah dalam Islam: Hukum dan Kafaratnya', 'sumpah-dalam-islam', 'Syarat sumpah yang sah dan kafarat bila melanggar.', 'id', 6, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-AGA-284';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
    (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', 'Syarat Sah')),
    (gen_random_uuid(), v_id, 'LIST', 1, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Dengan nama Allah$li$,
      $li$Disengaja (bukan main-main)$li$,
      $li$Perkara mungkin dilakukan$li$
    ]))),
    (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', 'Lagwu')),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 3, jsonb_build_object('text', $txt$Sumpah main-main / tidak disengaja = tidak dianggap (QS Al-Maidah 89).$txt$)),
    (gen_random_uuid(), v_id, 'HEADING', 4, jsonb_build_object('text', 'Kafarat')),
    (gen_random_uuid(), v_id, 'LIST', 5, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Beri makan 10 miskin$li$,
      $li$atau pakaian mereka$li$,
      $li$atau bebaskan budak$li$,
      $li$atau puasa 3 hari$li$
    ])));
END $doblk$;
