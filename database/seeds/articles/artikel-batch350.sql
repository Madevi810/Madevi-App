-- Batch 350: 1 artikel Teknologi (AI) — idempoten
-- Dibuat: 2026-10-19 (Siklus Abadi putaran 692)

INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('b1b1b1b1-0208-4000-8000-000000000208', 'EXP-TEK-358', 'b8888888-8888-8888-8888-888888888888', 'AI Generatif: Cara Kerja & Batasnya', 'ai-generatif-cara-kerja', 'LLM, cara kerja, & batasan yang perlu dipahami.', 'id', 9, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-TEK-358';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
    (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', 'Cara Kerja')),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 1, jsonb_build_object('text', $txt$Model memprediksi kata berikutnya dari pola data latih. Bukan "berpikir" seperti manusia.$txt$)),
    (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', 'Batasan')),
    (gen_random_uuid(), v_id, 'LIST', 3, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Bisa berhalusinasi (ngarang fakta)$li$,
      $li$Pengetahuan ada batas waktu$li$,
      $li$Bias dari data latih$li$
    ]))),
    (gen_random_uuid(), v_id, 'HEADING', 4, jsonb_build_object('text', 'Pakai Bijak')),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 5, jsonb_build_object('text', $txt$Verifikasi fakta penting. Jangan bagikan data pribadi.$txt$));
END $doblk$;
