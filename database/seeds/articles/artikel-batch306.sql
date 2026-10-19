-- Batch 306: 1 artikel Agama (Umrah) — idempoten
-- Dibuat: 2026-10-19 (Siklus Abadi putaran 546)

INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('b1b1b1b1-0164-4000-8000-000000000164', 'EXP-AGA-314', 'b8888888-8888-8888-8888-888888888888', 'Umrah: Haji Kecil', 'umrah-haji-kecil', 'Tata cara umrah, perbedaan dengan haji, & tips.', 'id', 7, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-AGA-314';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
    (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', 'Rukun')),
    (gen_random_uuid(), v_id, 'LIST', 1, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Ihram dari miqat$li$,
      $li$Thawaf 7x$li$,
      $li$Sai 7x$li$,
      $li$Tahallul$li$
    ]))),
    (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', 'Beda dengan Haji')),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 3, jsonb_build_object('text', $txt$Tanpa wukuf Arafah. Bisa kapan saja, waktu fleksibel.$txt$)),
    (gen_random_uuid(), v_id, 'HEADING', 4, jsonb_build_object('text', 'Tips')),
    (gen_random_uuid(), v_id, 'LIST', 5, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Pilih travel berizin PPIU$li$,
      $li$Siapkan fisik$li$,
      $li$Pelajari manasik$li$
    ])));
END $doblk$;
