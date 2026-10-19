-- Batch 222: 1 artikel Agama (Doa Mustajab) — idempoten
-- Dibuat: 2026-10-19 (Siklus Abadi putaran 266)

INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('b1b1b1b1-0080-4000-8000-000000000080', 'EXP-AGA-230', 'b8888888-8888-8888-8888-888888888888', 'Waktu Mustajab: Kapan Doa Paling Didengar', 'waktu-mustajab-doa', 'Waktu-waktu mustajab berdoa dan adabnya menurut hadits.', 'id', 7, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-AGA-230';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
    (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', 'Waktu Mustajab')),
    (gen_random_uuid(), v_id, 'LIST', 1, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Sepertiga malam terakhir$li$,
      $li$Antara adzan & iqamah$li$,
      $li$Saat sujud$li$,
      $li$Hari Jumat (saat mustajab)$li$,
      $li$Saat berbuka puasa$li$,
      $li$Saat hujan turun$li$
    ]))),
    (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', 'Adab Berdoa')),
    (gen_random_uuid(), v_id, 'LIST', 3, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Mulai dengan pujian & shalawat$li$,
      $li$Menghadap kiblat, angkat tangan$li$,
      $li$Yakin dikabulkan$li$,
      $li$Jangan tergesa-gesa$li$
    ]))),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 4, jsonb_build_object('text', $txt$Doa dikabulkan dalam 3 bentuk: diberi langsung, ditunda, atau diganti yang lebih baik.$txt$));
END $doblk$;
