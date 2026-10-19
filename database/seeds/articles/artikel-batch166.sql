-- Batch 166: 1 artikel Teknologi (WiFi Lemot) — idempoten
-- Dibuat: 2026-10-19 (Siklus Abadi putaran 79)

INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('b1b1b1b1-0024-4000-8000-000000000024', 'EXP-TEK-174', 'b8888888-8888-8888-8888-888888888888', 'WiFi Lemot? 7 Cara Mempercepatnya', 'wifi-lemot-cara-mempercepat', 'Diagnosis WiFi lambat: posisi router, interferensi, dan kapan harus ganti paket.', 'id', 6, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-TEK-174';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
    (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', 'Diagnosis Dulu')),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 1, jsonb_build_object('text', $txt$Tes kecepatan di speedtest.net dekat router vs di kamar. Bila dekat router cepat tapi di kamar lambat = masalah jangkauan, bukan paket.$txt$)),
    (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', '7 Cara Mempercepat')),
    (gen_random_uuid(), v_id, 'LIST', 3, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Taruh router di tengah rumah, posisi tinggi$li$,
      $li$Jauhkan dari microwave & tembok beton$li$,
      $li$Restart router 1x seminggu$li$,
      $li$Ganti channel WiFi yang sepi (pakai aplikasi analyzer)$li$,
      $li$Batasi perangkat yang streaming bersamaan$li$,
      $li$Update firmware router$li$,
      $li$Pertimbangkan mesh/repeater bila rumah 2 lantai$li$
    ]))),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 4, jsonb_build_object('text', $txt$Bila semua sudah dilakukan dan tetap lambat, hubungi ISP — bisa jadi memang paketnya kurang atau ada gangguan.$txt$));
END $doblk$;
