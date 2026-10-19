-- Batch 248: 1 artikel Sejarah (Perang Diponegoro) — idempoten
-- Dibuat: 2026-10-19 (Siklus Abadi putaran 352)

INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('b1b1b1b1-0106-4000-8000-000000000106', 'EXP-SEJ-256', 'b8888888-8888-8888-8888-888888888888', 'Perang Diponegoro: Perang Jawa 1825-1830', 'perang-diponegoro-1825', 'Sebab, jalannya perang, dan akhir Perang Jawa.', 'id', 8, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-SEJ-256';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
    (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', 'Sebab')),
    (gen_random_uuid(), v_id, 'LIST', 1, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Patok jalan Tegalrejo digeser$li$,
      $li$Pajak & sewa tanah mencekik$li$,
      $li$Campur tangan keraton$li$
    ]))),
    (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', 'Perang')),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 3, jsonb_build_object('text', $txt$5 tahun perang gerilya. Belanda rugi 20 juta gulden, 8000 serdadu Eropa & 7000 pribumi tewas.$txt$)),
    (gen_random_uuid(), v_id, 'HEADING', 4, jsonb_build_object('text', 'Akhir')),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 5, jsonb_build_object('text', $txt$1830: Diponegoro ditangkap lewat tipu muslihat di Magelang, dibuang ke Makassar. Belanda lalu terapkan Tanam Paksa.$txt$));
END $doblk$;
