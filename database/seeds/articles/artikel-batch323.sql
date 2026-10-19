-- Batch 323: 1 artikel Sejarah (Agresi Militer) — idempoten
-- Dibuat: 2026-10-19 (Siklus Abadi putaran 602)

INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('b1b1b1b1-0181-4000-8000-000000000181', 'EXP-SEJ-331', 'b8888888-8888-8888-8888-888888888888', 'Agresi Militer Belanda I & II', 'agresi-militer-belanda', 'Dua agresi militer Belanda 1947 & 1948 dan perlawanan Indonesia.', 'id', 8, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-SEJ-331';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
    (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', 'Agresi I')),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 1, jsonb_build_object('text', $txt$21 Juli 1947: Belanda serang Jawa & Sumatera. Dalih: pelanggaran Linggarjati.$txt$)),
    (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', 'Agresi II')),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 3, jsonb_build_object('text', $txt$19 Des 1948: Yogya diduduki, Soekarno-Hatta ditawan. PDRI dibentuk di Bukittinggi.$txt$)),
    (gen_random_uuid(), v_id, 'HEADING', 4, jsonb_build_object('text', 'Akhir')),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 5, jsonb_build_object('text', $txt$Tekanan PBB & AS → Roem-Royen → KMB → kedaulatan.$txt$));
END $doblk$;
