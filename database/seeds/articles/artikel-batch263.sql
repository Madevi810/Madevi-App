-- Batch 263: 1 artikel Sejarah (Agresi Militer) — idempoten
-- Dibuat: 2026-10-19 (Siklus Abadi putaran 402)

INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('b1b1b1b1-0121-4000-8000-000000000121', 'EXP-SEJ-271', 'b8888888-8888-8888-8888-888888888888', 'Agresi Militer Belanda I & II', 'agresi-militer-belanda', 'Dua agresi militer Belanda 1947 & 1948 dan perjuangan diplomasi Indonesia.', 'id', 8, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-SEJ-271';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
    (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', 'Agresi I (1947)')),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 1, jsonb_build_object('text', $txt$21 Juli 1947: Belanda serang Jawa & Sumatera. Dalih "aksi polisionil". Indonesia protes ke PBB.$txt$)),
    (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', 'Agresi II (1948)')),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 3, jsonb_build_object('text', $txt$19 Des 1948: Yogyakarta diduduki, Soekarno-Hatta ditawan. PDRI di Bukittinggi & Serangan Umum 1 Maret 1949.$txt$)),
    (gen_random_uuid(), v_id, 'HEADING', 4, jsonb_build_object('text', 'Hasil')),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 5, jsonb_build_object('text', $txt$Tekanan dunia → KMB 1949 → kedaulatan 27 Des 1949.$txt$));
END $doblk$;
