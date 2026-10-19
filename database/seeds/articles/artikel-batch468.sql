-- Batch 468: 1 artikel Agama (Shalat Rawatib) — idempoten
-- Dibuat: 2026-10-19 (Siklus Abadi putaran 1086)

INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('b1b1b1b1-0326-4000-8000-000000000326', 'EXP-AGA-476', 'b8888888-8888-8888-8888-888888888888', 'Shalat Rawatib: Sunnah Pengiring Wajib', 'shalat-rawatib-sunnah', 'Qabliyah & badiyah: jumlah & keutamaannya.', 'id', 6, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-AGA-476';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
    (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', 'Muakkad (12)')),
    (gen_random_uuid(), v_id, 'LIST', 1, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$2 sebelum Subuh$li$,
      $li$4 sebelum & 2 sesudah Zuhur$li$,
      $li$2 sesudah Magrib$li$,
      $li$2 sesudah Isya$li$
    ]))),
    (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', 'Keutamaan')),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 3, jsonb_build_object('text', $txt$Dibangunkan rumah di surga.$txt$)),
    (gen_random_uuid(), v_id, 'HEADING', 4, jsonb_build_object('text', 'Ghairu Muakkad')),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 5, jsonb_build_object('text', $txt$Sebelum Asar, sebelum Magrib/Isya.$txt$));
END $doblk$;
