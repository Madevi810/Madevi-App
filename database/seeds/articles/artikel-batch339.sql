-- Batch 339: 1 artikel Agama (Wudhu) — idempoten
-- Dibuat: 2026-10-19 (Siklus Abadi putaran 656)

INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('b1b1b1b1-0197-4000-8000-000000000197', 'EXP-AGA-347', 'b8888888-8888-8888-8888-888888888888', 'Wudhu: Tata Cara & Pembatal', 'wudhu-tata-cara-pembatal', 'Rukun, sunnah, & hal yang membatalkan wudhu.', 'id', 7, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-AGA-347';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
    (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', 'Rukun')),
    (gen_random_uuid(), v_id, 'LIST', 1, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Niat$li$,
      $li$Basuh wajah$li$,
      $li$Basuh tangan sampai siku$li$,
      $li$Usap kepala$li$,
      $li$Basuh kaki$li$,
      $li$Tertib$li$
    ]))),
    (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', 'Pembatal')),
    (gen_random_uuid(), v_id, 'LIST', 3, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Keluar dari 2 jalan$li$,
      $li$Tidur nyenyak$li$,
      $li$Hilang akal$li$,
      $li$Sentuh lawan jenis (menurut sebagian)$li$
    ]))),
    (gen_random_uuid(), v_id, 'HEADING', 4, jsonb_build_object('text', 'Sunnah')),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 5, jsonb_build_object('text', $txt$Basmalah, siwak, 3x basuhan, doa setelah wudhu.$txt$));
END $doblk$;
