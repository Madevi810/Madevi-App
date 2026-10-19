-- Batch 183: 1 artikel Kesehatan (Diabetes) — idempoten
-- Dibuat: 2026-10-19 (Siklus Abadi putaran 136)

INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('b1b1b1b1-0041-4000-8000-000000000041', 'EXP-KES-191', 'b8888888-8888-8888-8888-888888888888', 'Diabetes: Kenali Gejala dan Pencegahannya', 'diabetes-gejala-pencegahan', 'Gejala awal diabetes, faktor risiko, dan pola hidup pencegahannya.', 'id', 8, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-KES-191';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
    (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', 'Gejala Awal (3P)')),
    (gen_random_uuid(), v_id, 'LIST', 1, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Polidipsi: sering haus$li$,
      $li$Poliuri: sering kencing$li$,
      $li$Polifagi: sering lapar$li$,
      $li$Berat turun tanpa sebab$li$,
      $li$Luka sulit sembuh$li$
    ]))),
    (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', 'Pencegahan')),
    (gen_random_uuid(), v_id, 'LIST', 3, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Batasi gula <4 sdm/hari$li$,
      $li$Olahraga rutin$li$,
      $li$Jaga berat badan ideal$li$,
      $li$Cek gula darah berkala bila berisiko$li$
    ]))),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 4, jsonb_build_object('text', $txt$Diabetes tipe 2 bisa dicegah 80% dengan gaya hidup. Bila ada gejala, periksa ke dokter — jangan diagnosis sendiri.$txt$));
END $doblk$;
