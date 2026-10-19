-- Batch 375: 1 artikel Agama (Doa) — idempoten
-- Dibuat: 2026-10-19 (Siklus Abadi putaran 776)

INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('b1b1b1b1-0233-4000-8000-000000000233', 'EXP-AGA-383', 'b8888888-8888-8888-8888-888888888888', 'Adab Berdoa: Agar Mustajab', 'adab-berdoa-mustajab', 'Waktu mustajab, adab, & penghalang terkabulnya doa.', 'id', 6, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-AGA-383';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
    (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', 'Waktu Mustajab')),
    (gen_random_uuid(), v_id, 'LIST', 1, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Sepertiga malam terakhir$li$,
      $li$Antara adzan & iqamah$li$,
      $li$Saat sujud$li$,
      $li$Hari Jumat$li$
    ]))),
    (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', 'Adab')),
    (gen_random_uuid(), v_id, 'LIST', 3, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Awali hamdalah & shalawat$li$,
      $li$Angkat tangan$li$,
      $li$Yakin dikabulkan$li$
    ]))),
    (gen_random_uuid(), v_id, 'HEADING', 4, jsonb_build_object('text', 'Penghalang')),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 5, jsonb_build_object('text', $txt$Makanan haram & tergesa-gesa ingin dikabulkan.$txt$));
END $doblk$;
