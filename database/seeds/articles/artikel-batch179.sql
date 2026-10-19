-- Batch 179: 1 artikel Teknologi (Backup) — idempoten
-- Dibuat: 2026-10-19 (Siklus Abadi putaran 122)

INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('b1b1b1b1-0037-4000-8000-000000000037', 'EXP-TEK-187', 'b8888888-8888-8888-8888-888888888888', 'Aturan Backup 3-2-1: Data Aman Selamanya', 'aturan-backup-3-2-1', 'Strategi backup profesional: 3 salinan, 2 media, 1 offsite.', 'id', 6, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-TEK-187';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
    (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', 'Aturan 3-2-1')),
    (gen_random_uuid(), v_id, 'LIST', 1, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$3 salinan data penting$li$,
      $li$2 media berbeda (HP + harddisk, mis.)$li$,
      $li$1 salinan di lokasi lain (cloud)$li$
    ]))),
    (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', 'Jadwal Praktis')),
    (gen_random_uuid(), v_id, 'LIST', 3, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Foto: auto-backup cloud tiap hari$li$,
      $li$Dokumen penting: backup mingguan ke harddisk$li$,
      $li$Arsip tahunan: 1x setahun ke 2 tempat$li$
    ]))),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 4, jsonb_build_object('text', $txt$Tes restore sesekali: backup yang tidak pernah dites = belum tentu bisa dipakai.$txt$));
END $doblk$;
