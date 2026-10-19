-- Batch 233: 1 artikel Teknologi (IoT) — idempoten
-- Dibuat: 2026-10-19 (Siklus Abadi putaran 302)

INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('b1b1b1b1-0091-4000-8000-000000000091', 'EXP-TEK-241', 'b8888888-8888-8888-8888-888888888888', 'Internet of Things: Semua Benda Terhubung', 'internet-of-things-terhubung', 'Konsep IoT, contoh penerapan, dan risiko keamanannya.', 'id', 7, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-TEK-241';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
    (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', 'Konsep')),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 1, jsonb_build_object('text', $txt$IoT = benda fisik + sensor + internet. Kulkas tahu stok habis, lampu tahu kapan menyala.$txt$)),
    (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', 'Contoh Nyata')),
    (gen_random_uuid(), v_id, 'LIST', 3, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Smart home: lampu, AC, CCTV$li$,
      $li$Wearable: smartwatch pantau jantung$li$,
      $li$Pertanian: sensor tanah otomatis siram$li$,
      $li$Industri: prediksi kerusakan mesin$li$
    ]))),
    (gen_random_uuid(), v_id, 'HEADING', 4, jsonb_build_object('text', 'Risiko')),
    (gen_random_uuid(), v_id, 'LIST', 5, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Privasi: data rumah bocor$li$,
      $li$Keamanan: kamera diretas$li$,
      $li$Solusi: ganti password default, update firmware$li$
    ])));
END $doblk$;
