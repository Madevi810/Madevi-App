-- Batch 331: 1 artikel Kesehatan (Kolesterol) — idempoten
-- Dibuat: 2026-10-19 (Siklus Abadi putaran 629)

INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('b1b1b1b1-0189-4000-8000-000000000189', 'EXP-KES-339', 'b8888888-8888-8888-8888-888888888888', 'Kolesterol: Baik vs Jahat', 'kolesterol-baik-vs-jahat', 'HDL vs LDL, angka normal, & cara menjaganya.', 'id', 7, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-KES-339';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
    (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', 'Dua Jenis')),
    (gen_random_uuid(), v_id, 'LIST', 1, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$HDL: baik, bersihkan pembuluh$li$,
      $li$LDL: jahat, bentuk plak$li$
    ]))),
    (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', 'Angka Normal')),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 3, jsonb_build_object('text', $txt$Total <200, LDL <100, HDL >40 (pria) / >50 (wanita) mg/dL.$txt$)),
    (gen_random_uuid(), v_id, 'HEADING', 4, jsonb_build_object('text', 'Jaga')),
    (gen_random_uuid(), v_id, 'LIST', 5, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Kurangi lemak jenuh$li$,
      $li$Olahraga naikkan HDL$li$,
      $li$Berhenti merokok$li$
    ])));
END $doblk$;
