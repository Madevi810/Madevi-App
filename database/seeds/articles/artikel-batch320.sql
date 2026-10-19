-- Batch 320: 1 artikel Teknologi (AI) — idempoten
-- Dibuat: 2026-10-19 (Siklus Abadi putaran 592)

INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('b1b1b1b1-0178-4000-8000-000000000178', 'EXP-TEK-328', 'b8888888-8888-8888-8888-888888888888', 'AI Generatif: Cara Kerja & Batasnya', 'ai-generatif-cara-kerja', 'LLM, difusi, halusinasi, & etika penggunaan AI.', 'id', 8, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-TEK-328';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
    (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', 'Cara Kerja')),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 1, jsonb_build_object('text', $txt$LLM memprediksi kata berikutnya dari pola data latih. Difusi: gambar dari noise.$txt$)),
    (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', 'Batasan')),
    (gen_random_uuid(), v_id, 'LIST', 3, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Halusinasi: bisa mengarang$li$,
      $li$Bias data latih$li$,
      $li$Cutoff pengetahuan$li$
    ]))),
    (gen_random_uuid(), v_id, 'HEADING', 4, jsonb_build_object('text', 'Etika Pakai')),
    (gen_random_uuid(), v_id, 'LIST', 5, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Verifikasi fakta penting$li$,
      $li$Jangan untuk keputusan kritis$li$,
      $li$Transparan bila AI-assisted$li$
    ])));
END $doblk$;
