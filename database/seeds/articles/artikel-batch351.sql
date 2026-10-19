-- Batch 351: 1 artikel Agama (Haji) — idempoten
-- Dibuat: 2026-10-19 (Siklus Abadi putaran 696)

INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('b1b1b1b1-0209-4000-8000-000000000209', 'EXP-AGA-359', 'b8888888-8888-8888-8888-888888888888', 'Haji: Rukun & Wajib Haji', 'haji-rukun-wajib', 'Rukun, wajib, & sunnah haji + tips persiapan.', 'id', 9, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-AGA-359';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
    (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', 'Rukun')),
    (gen_random_uuid(), v_id, 'LIST', 1, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Ihram$li$,
      $li$Wukuf di Arafah$li$,
      $li$Thawaf ifadah$li$,
      $li$Sai$li$,
      $li$Tahallul$li$,
      $li$Tertib$li$
    ]))),
    (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', 'Wajib')),
    (gen_random_uuid(), v_id, 'LIST', 3, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Ihram dari miqat$li$,
      $li$Mabit Muzdalifah & Mina$li$,
      $li$Lempar jumrah$li$,
      $li$Thawaf wada$li$
    ]))),
    (gen_random_uuid(), v_id, 'HEADING', 4, jsonb_build_object('text', 'Persiapan')),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 5, jsonb_build_object('text', $txt$Manasik, fisik (jalan 10rb langkah), & mental. Antrean Indonesia belasan tahun.$txt$));
END $doblk$;
