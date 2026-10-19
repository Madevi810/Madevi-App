-- Batch 217: 1 artikel Lingkungan (Banjir) — idempoten
-- Dibuat: 2026-10-19 (Siklus Abadi putaran 249)

INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('b1b1b1b1-0075-4000-8000-000000000075', 'EXP-LING-225', 'b8888888-8888-8888-8888-888888888888', 'Banjir Jakarta: Akar Masalah dan Solusinya', 'banjir-jakarta-akar-solusi', 'Kenapa banjir berulang: penurunan tanah, sampah, dan tata ruang.', 'id', 8, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-LING-225';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
    (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', 'Akar Masalah')),
    (gen_random_uuid(), v_id, 'LIST', 1, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Penurunan muka tanah (pompa air tanah)$li$,
      $li$13 sungai melintasi kota$li$,
      $li$Sampah menyumbat drainase$li$,
      $li$Alih fungsi resapan air$li$
    ]))),
    (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', 'Solusi Struktural')),
    (gen_random_uuid(), v_id, 'LIST', 3, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Normalisasi sungai & waduk$li$,
      $li$Giant sea wall$li$,
      $li$Sumur resapan massal$li$,
      $li$Batasi air tanah$li$
    ]))),
    (gen_random_uuid(), v_id, 'HEADING', 4, jsonb_build_object('text', 'Peran Warga')),
    (gen_random_uuid(), v_id, 'LIST', 5, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Jangan buang sampah ke kali$li$,
      $li$Buat biopori di rumah$li$,
      $li$Siapkan tas siaga banjir$li$
    ])));
END $doblk$;
