-- Batch 187: 1 artikel Sejarah (Sumpah Pemuda) — idempoten
-- Dibuat: 2026-10-19 (Siklus Abadi putaran 149)

INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('b1b1b1b1-0045-4000-8000-000000000045', 'EXP-SEJ-195', 'b8888888-8888-8888-8888-888888888888', 'Sumpah Pemuda 1928: Ikrar Persatuan', 'sumpah-pemuda-1928', 'Latar, isi ikrar, dan makna Sumpah Pemuda bagi Indonesia.', 'id', 7, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-SEJ-195';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
    (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', 'Latar Belakang')),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 1, jsonb_build_object('text', $txt$Kongres Pemuda II, 27-28 Oktober 1928, Jakarta. Pemuda dari berbagai suku berkumpul — pertama kalinya "Indonesia" diikrarkan sebagai tanah air bersama.$txt$)),
    (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', 'Isi Ikrar')),
    (gen_random_uuid(), v_id, 'LIST', 3, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Bertumpah darah satu: tanah Indonesia$li$,
      $li$Berbangsa satu: bangsa Indonesia$li$,
      $li$Menjunjung bahasa persatuan: bahasa Indonesia$li$
    ]))),
    (gen_random_uuid(), v_id, 'HEADING', 4, jsonb_build_object('text', 'Makna Kini')),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 5, jsonb_build_object('text', $txt$Semangat persatuan di atas perbedaan — relevan untuk melawan hoaks pemecah belah dan intoleransi hari ini.$txt$));
END $doblk$;
