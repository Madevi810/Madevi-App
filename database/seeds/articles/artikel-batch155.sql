-- Batch 155: 1 artikel Kimia (Asam Basa) — idempoten
-- Dibuat: 2026-10-19 (Siklus Abadi putaran 41)

INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('b1b1b1b1-0013-4000-8000-000000000013', 'EXP-KIM-163', 'b8888888-8888-8888-8888-888888888888', 'Asam dan Basa dalam Kehidupan Sehari-hari', 'asam-basa-sehari-hari', 'Skala pH, indikator alami, dan contoh asam-basa di dapur — plus eksperimen kubis ungu.', 'id', 7, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-KIM-163';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
    (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', 'Skala pH')),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 1, jsonb_build_object('text', $txt$Skala pH 0-14: <7 asam, 7 netral, >7 basa. Tiap selisih 1 = 10x perbedaan keasaman. Air aki pH ~0, sabun pH ~10.$txt$)),
    (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', 'Contoh di Dapur')),
    (gen_random_uuid(), v_id, 'LIST', 3, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Asam: cuka, jeruk nipis, tomat$li$,
      $li$Basa: soda kue, sabun cuci$li$,
      $li$Netral: air murni, gula$li$
    ]))),
    (gen_random_uuid(), v_id, 'HEADING', 4, jsonb_build_object('text', 'Eksperimen Kubis Ungu')),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 5, jsonb_build_object('text', $txt$Rebus kubis ungu, ambil airnya sebagai indikator. Teteskan cuka → merah muda (asam). Teteskan air sabun → hijau (basa). Aman dan murah untuk praktikum rumah.$txt$));
END $doblk$;
