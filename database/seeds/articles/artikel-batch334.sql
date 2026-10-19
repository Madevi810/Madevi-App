-- Batch 334: 1 artikel Lingkungan (Polusi Udara) — idempoten
-- Dibuat: 2026-10-19 (Siklus Abadi putaran 639)

INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('b1b1b1b1-0192-4000-8000-000000000192', 'EXP-LING-342', 'b8888888-8888-8888-8888-888888888888', 'Indeks Kualitas Udara (AQI)', 'indeks-kualitas-udara-aqi', 'Membaca AQI, kategorinya, & apa yang harus dilakukan.', 'id', 7, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-LING-342';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
    (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', 'Kategori AQI')),
    (gen_random_uuid(), v_id, 'LIST', 1, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$0-50: baik (hijau)$li$,
      $li$51-100: sedang (kuning)$li$,
      $li$101-150: tidak sehat sensitif (oranye)$li$,
      $li$151+: tidak sehat - berbahaya$li$
    ]))),
    (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', 'Yang Harus Dilakukan')),
    (gen_random_uuid(), v_id, 'LIST', 3, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$>100: masker & kurangi aktivitas luar$li$,
      $li$>150: tutup jendela, air purifier$li$
    ]))),
    (gen_random_uuid(), v_id, 'HEADING', 4, jsonb_build_object('text', 'Cek')),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 5, jsonb_build_object('text', $txt$Aplikasi: IQAir, Nafas. Cek tiap pagi sebelum beraktivitas.$txt$));
END $doblk$;
