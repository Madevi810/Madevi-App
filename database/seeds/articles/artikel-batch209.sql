-- Batch 209: 1 artikel Teknologi (5G) — idempoten
-- Dibuat: 2026-10-19 (Siklus Abadi putaran 222)

INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('b1b1b1b1-0067-4000-8000-000000000067', 'EXP-TEK-217', 'b8888888-8888-8888-8888-888888888888', 'Teknologi 5G: Lebih dari Sekadar Cepat', 'teknologi-5g-lebih-cepat', 'Apa bedanya 5G dengan 4G: latensi, IoT, dan dampaknya.', 'id', 7, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-TEK-217';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
    (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', 'Bedanya dengan 4G')),
    (gen_random_uuid(), v_id, 'LIST', 1, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Kecepatan: hingga 10x$li$,
      $li$Latensi: <10ms (4G ~50ms)$li$,
      $li$Kapasitas: 1 juta device/km²$li$
    ]))),
    (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', 'Dampak Nyata')),
    (gen_random_uuid(), v_id, 'LIST', 3, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$IoT massal: smart city, pertanian presisi$li$,
      $li$Telemedicine & operasi jarak jauh$li$,
      $li$Kendaraan otonom$li$
    ]))),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 4, jsonb_build_object('text', $txt$Untuk HP sehari-hari, bedanya belum terasa signifikan. Manfaat besar 5G ada di industri.$txt$));
END $doblk$;
