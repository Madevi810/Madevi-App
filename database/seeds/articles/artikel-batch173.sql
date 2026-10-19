-- Batch 173: 1 artikel Biologi (Sel) — idempoten
-- Dibuat: 2026-10-19 (Siklus Abadi putaran 102)

INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('b1b1b1b1-0031-4000-8000-000000000031', 'EXP-BIO-181', 'b8888888-8888-8888-8888-888888888888', 'Sel: Unit Terkecil Kehidupan', 'sel-unit-terkecil-kehidupan', 'Struktur sel hewan vs tumbuhan: organel dan fungsinya masing-masing.', 'id', 8, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-BIO-181';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
    (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', 'Teori Sel')),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 1, jsonb_build_object('text', $txt$Semua makhluk hidup tersusun dari sel. Sel adalah unit struktural dan fungsional terkecil. Sel berasal dari sel sebelumnya.$txt$)),
    (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', 'Organel dan Fungsi')),
    (gen_random_uuid(), v_id, 'LIST', 3, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Nukleus: pusat kendali, menyimpan DNA$li$,
      $li$Mitokondria: pembangkit energi (ATP)$li$,
      $li$Ribosom: sintesis protein$li$,
      $li$Kloroplas (tumbuhan): fotosintesis$li$,
      $li$Dinding sel (tumbuhan): pelindung kaku$li$,
      $li$Membran sel: pengatur keluar-masuk zat$li$
    ]))),
    (gen_random_uuid(), v_id, 'HEADING', 4, jsonb_build_object('text', 'Hewan vs Tumbuhan')),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 5, jsonb_build_object('text', $txt$Sel tumbuhan: ada dinding sel, kloroplas, vakuola besar. Sel hewan: vakuola kecil, tanpa dinding sel dan kloroplas.$txt$));
END $doblk$;
