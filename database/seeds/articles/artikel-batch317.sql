-- Batch 317: 1 artikel Sejarah (Reformasi) — idempoten
-- Dibuat: 2026-10-19 (Siklus Abadi putaran 582)

INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('b1b1b1b1-0175-4000-8000-000000000175', 'EXP-SEJ-325', 'b8888888-8888-8888-8888-888888888888', 'Reformasi 1998: Jatuhnya Orde Baru', 'reformasi-1998-jatuhnya-orde-baru', 'Krisis moneter, gerakan mahasiswa, & lahirnya era reformasi.', 'id', 8, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-SEJ-325';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
    (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', 'Krisis')),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 1, jsonb_build_object('text', $txt$1997: rupiah anjlok, harga melambung, KKN memuncak.$txt$)),
    (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', 'Gerakan')),
    (gen_random_uuid(), v_id, 'LIST', 3, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Mahasiswa duduki DPR$li$,
      $li$Tragedi Trisakti 12 Mei 1998$li$,
      $li$Kerusuhan Mei$li$
    ]))),
    (gen_random_uuid(), v_id, 'HEADING', 4, jsonb_build_object('text', 'Hasil')),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 5, jsonb_build_object('text', $txt$21 Mei 1998: Soeharto mundur. Habibie naik, era reformasi dimulai.$txt$));
END $doblk$;
