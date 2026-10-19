-- Batch 205: 1 artikel Lingkungan (Plastik) — idempoten
-- Dibuat: 2026-10-19 (Siklus Abadi putaran 209)

INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('b1b1b1b1-0063-4000-8000-000000000063', 'EXP-LING-213', 'b8888888-8888-8888-8888-888888888888', 'Krisis Plastik: Dari Laut sampai Tubuh Kita', 'krisis-plastik-laut', 'Mikroplastik di laut dan tubuh manusia: data, dampak, dan solusi.', 'id', 8, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-LING-213';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
    (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', 'Skala Masalah')),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 1, jsonb_build_object('text', $txt$Indonesia penyumbang sampah plastik laut terbesar kedua dunia. Mikroplastik sudah ditemukan di air minum, garam, bahkan darah manusia.$txt$)),
    (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', 'Dampak')),
    (gen_random_uuid(), v_id, 'LIST', 3, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Hewan laut mati menelan plastik$li$,
      $li$Rantai makanan tercemar$li$,
      $li$Risiko kesehatan jangka panjang$li$
    ]))),
    (gen_random_uuid(), v_id, 'HEADING', 4, jsonb_build_object('text', 'Solusi Nyata')),
    (gen_random_uuid(), v_id, 'LIST', 5, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Bawa tas & botol sendiri$li$,
      $li$Tolak sedotan & kantong sekali pakai$li$,
      $li$Pilah sampah untuk daur ulang$li$,
      $li$Dukung kebijakan pengurangan plastik$li$
    ])));
END $doblk$;
