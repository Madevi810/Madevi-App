-- Batch 196: 1 artikel Agama (Sabar) — idempoten
-- Dibuat: 2026-10-19 (Siklus Abadi putaran 179)

INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('b1b1b1b1-0054-4000-8000-000000000054', 'EXP-AGA-204', 'b8888888-8888-8888-8888-888888888888', 'Sabar: Kunci Menghadapi Ujian Hidup', 'sabar-kunci-ujian-hidup', 'Makna sabar dalam Islam: jenis-jenisnya dan cara melatihnya.', 'id', 7, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-AGA-204';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
    (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', 'Tiga Jenis Sabar')),
    (gen_random_uuid(), v_id, 'LIST', 1, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Sabar dalam ketaatan (istiqamah ibadah)$li$,
      $li$Sabar menjauhi maksiat$li$,
      $li$Sabar menghadapi musibah$li$
    ]))),
    (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', 'Janji Allah')),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 3, jsonb_build_object('text', $txt$"Sesungguhnya Allah beserta orang-orang yang sabar" (QS. Al-Baqarah: 153). "Sesungguhnya hanya orang-orang yang bersabarlah yang disempurnakan pahala mereka tanpa batas" (QS. Az-Zumar: 10).$txt$)),
    (gen_random_uuid(), v_id, 'HEADING', 4, jsonb_build_object('text', 'Melatih Sabar')),
    (gen_random_uuid(), v_id, 'LIST', 5, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Ingat ujian = penghapus dosa$li$,
      $li$Jangan mengeluh berlebihan$li$,
      $li$Berdoa & bertawakal$li$,
      $li$Lihat yang lebih berat ujiannya$li$
    ])));
END $doblk$;
