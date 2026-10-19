-- Batch 193: 1 artikel Teknologi (AI) — idempoten
-- Dibuat: 2026-10-19 (Siklus Abadi putaran 169)

INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('b1b1b1b1-0051-4000-8000-000000000051', 'EXP-TEK-201', 'b8888888-8888-8888-8888-888888888888', 'Kecerdasan Buatan: Cara Kerja dan Batasannya', 'kecerdasan-buatan-cara-kerja', 'Memahami AI tanpa hype: cara kerja, kemampuan, keterbatasan, dan etika pakainya.', 'id', 8, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-TEK-201';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
    (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', 'Cara Kerja Sederhana')),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 1, jsonb_build_object('text', $txt$AI belajar dari jutaan contoh data, mengenali pola, lalu memprediksi. Chatbot memprediksi kata berikutnya — bukan "berpikir" seperti manusia.$txt$)),
    (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', 'Kemampuan & Batasan')),
    (gen_random_uuid(), v_id, 'LIST', 3, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Bisa: merangkum, menerjemah, menulis draf, analisis pola$li$,
      $li$Terbatas: bisa "halusinasi" (mengarang fakta)$li$,
      $li$Tidak: menggantikan penilaian manusia$li$
    ]))),
    (gen_random_uuid(), v_id, 'HEADING', 4, jsonb_build_object('text', 'Etika Pakai')),
    (gen_random_uuid(), v_id, 'LIST', 5, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Verifikasi fakta penting$li$,
      $li$Jangan unggah data pribadi$li$,
      $li$Jujur bila pakai AI untuk tugas$li$
    ])));
END $doblk$;
