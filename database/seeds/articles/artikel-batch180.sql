-- Batch 180: 1 artikel Agama (Haji) — idempoten
-- Dibuat: 2026-10-19 (Siklus Abadi putaran 126)

INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('b1b1b1b1-0038-4000-8000-000000000038', 'EXP-AGA-188', 'b8888888-8888-8888-8888-888888888888', 'Rukun Haji dan Umrah: Panduan Ringkas', 'rukun-haji-umrah', 'Rukun, wajib, dan sunnah haji/umrah plus persiapan fisik dan dokumen.', 'id', 8, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-AGA-188';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
    (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', 'Rukun Haji')),
    (gen_random_uuid(), v_id, 'LIST', 1, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Ihram$li$,
      $li$Wukuf di Arafah$li$,
      $li$Thawaf ifadah$li$,
      $li$Sa i$li$,
      $li$Tahallul$li$,
      $li$Tertib$li$
    ]))),
    (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', 'Bedanya dengan Umrah')),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 3, jsonb_build_object('text', $txt$Umrah: ihram, thawaf, sa i, tahallul — tanpa wukuf, bisa kapan saja. Haji: ada wukuf, hanya di bulan haji.$txt$)),
    (gen_random_uuid(), v_id, 'HEADING', 4, jsonb_build_object('text', 'Persiapan')),
    (gen_random_uuid(), v_id, 'LIST', 5, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Fisik: latihan jalan jauh$li$,
      $li$Dokumen: paspor, visa, vaksin$li$,
      $li$Ilmu: ikut manasik$li$,
      $li$Keuangan: daftar via travel resmi berizin$li$
    ])));
END $doblk$;
