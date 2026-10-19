-- Batch 356: 1 artikel Teknologi (Blockchain) — idempoten
-- Dibuat: 2026-10-19 (Siklus Abadi putaran 712)

INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('b1b1b1b1-0214-4000-8000-000000000214', 'EXP-TEK-364', 'b8888888-8888-8888-8888-888888888888', 'Blockchain: Bukan Sekadar Kripto', 'blockchain-bukan-sekadar-kripto', 'Cara kerja blockchain & kegunaan di luar kripto.', 'id', 8, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-TEK-364';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
    (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', 'Konsep')),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 1, jsonb_build_object('text', $txt$Buku kas digital terdistribusi. Tiap blok terkunci kriptografi ke blok sebelumnya.$txt$)),
    (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', 'Kegunaan')),
    (gen_random_uuid(), v_id, 'LIST', 3, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Rantai pasok transparan$li$,
      $li$Sertifikat tanah digital$li$,
      $li$Smart contract$li$
    ]))),
    (gen_random_uuid(), v_id, 'HEADING', 4, jsonb_build_object('text', 'Risiko')),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 5, jsonb_build_object('text', $txt$Volatilitas kripto tinggi. Waspada skema ponzi berkedok investasi.$txt$));
END $doblk$;
