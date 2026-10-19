-- Batch 181: 1 artikel Keterampilan (Fotografi HP) — idempoten
-- Dibuat: 2026-10-19 (Siklus Abadi putaran 129)

INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('b1b1b1b1-0039-4000-8000-000000000039', 'EXP-KET-189', 'b8888888-8888-8888-8888-888888888888', 'Fotografi HP: Dari Jepret Biasa ke Luar Biasa', 'fotografi-hp-pemula', 'Komposisi, cahaya, dan editing dasar untuk foto HP yang memukau.', 'id', 7, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-KET-189';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
    (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', 'Aturan Komposisi')),
    (gen_random_uuid(), v_id, 'LIST', 1, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Rule of thirds: objek di titik potong garis$li$,
      $li$Leading lines: manfaatkan garis jalan/rel$li$,
      $li$Framing: bingkai alami (jendela, dahan)$li$,
      $li$Ruang negatif: jangan penuhi frame$li$
    ]))),
    (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', 'Cahaya Terbaik')),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 3, jsonb_build_object('text', $txt$Golden hour (pagi/sore) memberi cahaya hangat. Hindari tengah hari yang keras. Mendung = softbox alami.$txt$)),
    (gen_random_uuid(), v_id, 'HEADING', 4, jsonb_build_object('text', 'Editing Dasar')),
    (gen_random_uuid(), v_id, 'LIST', 5, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Crop & luruskan horizon$li$,
      $li$Naikkan sedikit brightness/contrast$li$,
      $li$Jangan over-filter$li$
    ])));
END $doblk$;
