-- Batch 433: 1 artikel Kesehatan (Demam) — idempoten
-- Dibuat: 2026-10-19 (Siklus Abadi putaran 969)

INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('b1b1b1b1-0291-4000-8000-000000000291', 'EXP-KES-441', 'b8888888-8888-8888-8888-888888888888', 'Demam: Kapan ke Dokter?', 'demam-kapan-ke-dokter', 'Menangani demam di rumah & tanda bahaya.', 'id', 7, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-KES-441';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
    (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', 'Di Rumah')),
    (gen_random_uuid(), v_id, 'LIST', 1, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Banyak minum$li$,
      $li$Kompres hangat$li$,
      $li$Paracetamol bila >38.5$li$
    ]))),
    (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', 'Tanda Bahaya')),
    (gen_random_uuid(), v_id, 'LIST', 3, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$>3 hari tidak turun$li$,
      $li$Kejang$li$,
      $li$Sesak napas$li$,
      $li$Tidak sadar$li$
    ]))),
    (gen_random_uuid(), v_id, 'HEADING', 4, jsonb_build_object('text', 'Jangan')),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 5, jsonb_build_object('text', $txt$Jangan selimuti tebal. Jangan antibiotik tanpa resep.$txt$));
END $doblk$;
