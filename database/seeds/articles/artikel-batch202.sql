-- Batch 202: 1 artikel Kesehatan (Diabetes) — idempoten
-- Dibuat: 2026-10-19 (Siklus Abadi putaran 199)

INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('b1b1b1b1-0060-4000-8000-000000000060', 'EXP-KES-210', 'b8888888-8888-8888-8888-888888888888', 'Diabetes: Gejala Awal dan Pencegahannya', 'diabetes-gejala-pencegahan', 'Mengenali diabetes tipe 2 sejak dini: gejala, faktor risiko, dan pencegahan.', 'id', 7, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-KES-210';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
    (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', 'Gejala Awal')),
    (gen_random_uuid(), v_id, 'LIST', 1, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Sering haus & buang air kecil$li$,
      $li$Lapar terus tapi berat turun$li$,
      $li$Luka sulit sembuh$li$,
      $li$Pandangan kabur, kesemutan$li$
    ]))),
    (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', 'Faktor Risiko')),
    (gen_random_uuid(), v_id, 'LIST', 3, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Keturunan$li$,
      $li$Obesitas$li$,
      $li$Jarang gerak$li$,
      $li$Konsumsi gula berlebih$li$
    ]))),
    (gen_random_uuid(), v_id, 'HEADING', 4, jsonb_build_object('text', 'Pencegahan')),
    (gen_random_uuid(), v_id, 'LIST', 5, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Batasi gula <4 sdm/hari$li$,
      $li$Olahraga 150 mnt/minggu$li$,
      $li$Jaga berat ideal$li$,
      $li$Cek gula darah rutin bila berisiko$li$
    ])));
END $doblk$;
