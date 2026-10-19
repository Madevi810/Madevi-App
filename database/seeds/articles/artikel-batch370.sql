-- Batch 370: 1 artikel Lingkungan (Sampah Plastik) — idempoten
-- Dibuat: 2026-10-19 (Siklus Abadi putaran 759)

INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('b1b1b1b1-0228-4000-8000-000000000228', 'EXP-LING-378', 'b8888888-8888-8888-8888-888888888888', 'Sampah Plastik: Fakta & Solusi', 'sampah-plastik-fakta-solusi', 'Indonesia darurat sampah plastik & cara menguranginya.', 'id', 8, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-LING-378';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
    (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', 'Fakta')),
    (gen_random_uuid(), v_id, 'LIST', 1, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Indonesia penghasil sampah plastik laut terbesar ke-2$li$,
      $li$Plastik butuh 400+ tahun terurai$li$
    ]))),
    (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', 'Kurangi')),
    (gen_random_uuid(), v_id, 'LIST', 3, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Tas belanja kain$li$,
      $li$Tumbler & sedotan stainless$li$,
      $li$Refill, bukan sachet$li$
    ]))),
    (gen_random_uuid(), v_id, 'HEADING', 4, jsonb_build_object('text', 'Kebijakan')),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 5, jsonb_build_object('text', $txt$Larangan kantong plastik di banyak daerah. Daur ulang via bank sampah.$txt$));
END $doblk$;
