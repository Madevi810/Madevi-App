-- Batch 221: 1 artikel Teknologi (Robot) — idempoten
-- Dibuat: 2026-10-19 (Siklus Abadi putaran 262)

INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('b1b1b1b1-0079-4000-8000-000000000079', 'EXP-TEK-229', 'b8888888-8888-8888-8888-888888888888', 'Robotika: Dari Pabrik sampai Rumah Sakit', 'robotika-pabrik-rumah-sakit', 'Jenis robot, cara kerja sensor-aktuator, dan dampaknya bagi pekerjaan.', 'id', 8, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-TEK-229';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
    (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', 'Anatomi Robot')),
    (gen_random_uuid(), v_id, 'LIST', 1, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Sensor: mata & telinga (kamera, lidar)$li$,
      $li$Aktuator: otot (motor, hidrolik)$li$,
      $li$Kontroler: otak (prosesor + AI)$li$
    ]))),
    (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', 'Di Mana Dipakai')),
    (gen_random_uuid(), v_id, 'LIST', 3, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Pabrik: las, cat, perakitan$li$,
      $li$Medis: bedah presisi, farmasi$li$,
      $li$Logistik: gudang otomatis$li$,
      $li$Rumah: vacuum cleaner robot$li$
    ]))),
    (gen_random_uuid(), v_id, 'HEADING', 4, jsonb_build_object('text', 'Dampak Pekerjaan')),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 5, jsonb_build_object('text', $txt$Robot menggantikan tugas repetitif, bukan semua pekerjaan. Skill yang aman: kreativitas, empati, keputusan kompleks.$txt$));
END $doblk$;
