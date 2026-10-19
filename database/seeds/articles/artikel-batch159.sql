-- Batch 159: 1 artikel Kesehatan (Cuci Tangan) — idempoten
-- Dibuat: 2026-10-19 (Siklus Abadi putaran 56)

INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('b1b1b1b1-0017-4000-8000-000000000017', 'EXP-KES-167', 'b8888888-8888-8888-8888-888888888888', 'Cuci Tangan 6 Langkah yang Benar', 'cuci-tangan-6-langkah', 'Teknik cuci tangan WHO: 6 langkah, 40-60 detik — kapan wajib cuci tangan.', 'id', 5, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-KES-167';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
    (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', '6 Langkah WHO')),
    (gen_random_uuid(), v_id, 'LIST', 1, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Ratakan sabun di telapak$li$,
      $li$Gosok punggung tangan bergantian$li$,
      $li$Gosok sela jari$li$,
      $li$Kunci jari, gosok$li$,
      $li$Putar ibu jari$li$,
      $li$Gosok ujung jari di telapak$li$
    ]))),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 2, jsonb_build_object('text', $txt$Durasi 40-60 detik dengan sabun dan air mengalir. Hand sanitizer (min. 60% alkohol) hanya bila tidak ada air.$txt$)),
    (gen_random_uuid(), v_id, 'HEADING', 3, jsonb_build_object('text', 'Kapan Wajib')),
    (gen_random_uuid(), v_id, 'LIST', 4, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Sebelum makan & menyiapkan makanan$li$,
      $li$Setelah dari toilet$li$,
      $li$Setelah batuk/bersin$li$,
      $li$Setelah memegang hewan$li$,
      $li$Setelah dari tempat umum$li$
    ])));
END $doblk$;
