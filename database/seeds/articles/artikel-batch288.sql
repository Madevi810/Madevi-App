-- Batch 288: 1 artikel Agama (Shalat Sunnah) — idempoten
-- Dibuat: 2026-10-19 (Siklus Abadi putaran 486)

INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('b1b1b1b1-0146-4000-8000-000000000146', 'EXP-AGA-296', 'b8888888-8888-8888-8888-888888888888', 'Shalat Sunnah Rawatib & Lainnya', 'shalat-sunnah-rawatib', 'Jenis shalat sunnah: rawatib, dhuha, tahajud, witir, dan lainnya.', 'id', 7, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-AGA-296';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
    (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', 'Rawatib')),
    (gen_random_uuid(), v_id, 'LIST', 1, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Qabliyah Subuh (2)$li$,
      $li$Qabliyah & badiyah Dzuhur (2+2)$li$,
      $li$Badiyah Maghrib (2), badiyah Isya (2)$li$
    ]))),
    (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', 'Lainnya')),
    (gen_random_uuid(), v_id, 'LIST', 3, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Dhuha: 2-12 rakaat$li$,
      $li$Tahajud & witir$li$,
      $li$Tahiyatul masjid, istikharah, hajat$li$
    ]))),
    (gen_random_uuid(), v_id, 'HEADING', 4, jsonb_build_object('text', 'Keutamaan')),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 5, jsonb_build_object('text', $txt$Penyempurna shalat wajib. 12 rakaat rawatib = dibangunkan rumah di surga (HR. Muslim).$txt$));
END $doblk$;
