-- Batch 236: 1 artikel Sejarah (BPUPKI) — idempoten
-- Dibuat: 2026-10-19 (Siklus Abadi putaran 312)

INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('b1b1b1b1-0094-4000-8000-000000000094', 'EXP-SEJ-244', 'b8888888-8888-8888-8888-888888888888', 'BPUPKI & PPKI: Lahirnya Dasar Negara', 'bpupki-ppki-dasar-negara', 'Sidang BPUPKI, Piagam Jakarta, dan lahirnya Pancasila & UUD 1945.', 'id', 8, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-SEJ-244';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
    (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', 'Sidang BPUPKI')),
    (gen_random_uuid(), v_id, 'LIST', 1, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$29 Mei-1 Juni 1945: bahas dasar negara$li$,
      $li$1 Juni: Soekarno pidato Pancasila$li$,
      $li$22 Juni: Piagam Jakarta$li$
    ]))),
    (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', 'Piagam Jakarta → Pancasila')),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 3, jsonb_build_object('text', $txt$Sila 1 diubah: "Ketuhanan dengan kewajiban menjalankan syariat Islam" → "Ketuhanan Yang Maha Esa" demi persatuan.$txt$)),
    (gen_random_uuid(), v_id, 'HEADING', 4, jsonb_build_object('text', 'PPKI')),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 5, jsonb_build_object('text', $txt$18 Agustus 1945: mengesahkan UUD 1945, memilih Soekarno-Hatta. Indonesia resmi bernegara.$txt$));
END $doblk$;
