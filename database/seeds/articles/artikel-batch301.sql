-- Batch 301: 1 artikel Kesehatan (Hipertensi) — idempoten
-- Dibuat: 2026-10-19 (Siklus Abadi putaran 529)

INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('b1b1b1b1-0159-4000-8000-000000000159', 'EXP-KES-309', 'b8888888-8888-8888-8888-888888888888', 'Hipertensi: Pembunuh Senyap', 'hipertensi-pembunuh-senyap', 'Kenapa disebut silent killer, cara ukur benar, dan pengendaliannya.', 'id', 8, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-KES-309';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
    (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', 'Silent Killer')),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 1, jsonb_build_object('text', $txt$Sering tanpa gejala. Komplikasi: stroke, jantung, ginjal.$txt$)),
    (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', 'Ukur Benar')),
    (gen_random_uuid(), v_id, 'LIST', 3, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Istirahat 5 menit dulu$li$,
      $li$Jangan kopi/rokok 30 menit sebelumnya$li$,
      $li$Ukur 2x, ambil rata-rata$li$
    ]))),
    (gen_random_uuid(), v_id, 'HEADING', 4, jsonb_build_object('text', 'Kendali')),
    (gen_random_uuid(), v_id, 'LIST', 5, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Kurangi garam (<5g/hari)$li$,
      $li$Olahraga rutin$li$,
      $li$Minum obat teratur$li$
    ])));
END $doblk$;
