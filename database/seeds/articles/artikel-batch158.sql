-- Batch 158: 1 artikel Teknologi (Cloud Storage) — idempoten
-- Dibuat: 2026-10-19 (Siklus Abadi putaran 52)

INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('b1b1b1b1-0016-4000-8000-000000000016', 'EXP-TEK-166', 'b8888888-8888-8888-8888-888888888888', 'Cloud Storage: Google Drive vs Alternatifnya', 'cloud-storage-drive-alternatif', 'Memahami penyimpanan awan: kapasitas gratis, keamanan, dan cara memilih yang tepat.', 'id', 6, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-TEK-166';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
    (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', 'Apa itu Cloud Storage')),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 1, jsonb_build_object('text', $txt$File disimpan di server internet, bisa diakses dari HP/laptop mana pun. Gratis terbatas, bayar untuk kapasitas besar.$txt$)),
    (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', 'Perbandingan Kapasitas Gratis')),
    (gen_random_uuid(), v_id, 'LIST', 3, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Google Drive: 15 GB (berbagi dengan Gmail & Photos)$li$,
      $li$OneDrive: 5 GB$li$,
      $li$Dropbox: 2 GB$li$,
      $li$Mega: 20 GB$li$
    ]))),
    (gen_random_uuid(), v_id, 'HEADING', 4, jsonb_build_object('text', 'Tips Aman')),
    (gen_random_uuid(), v_id, 'LIST', 5, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Aktifkan 2FA di akun$li$,
      $li$Jangan simpan password di file teks biasa$li$,
      $li$Backup penting di 2 tempat (cloud + harddisk)$li$
    ])));
END $doblk$;
