-- Batch 189: 1 artikel Lingkungan (Banjir) — idempoten
-- Dibuat: 2026-10-19 (Siklus Abadi putaran 156)

INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('b1b1b1b1-0047-4000-8000-000000000047', 'EXP-LING-197', 'b8888888-8888-8888-8888-888888888888', 'Banjir: Penyebab, Mitigasi, dan Siaga', 'banjir-penyebab-mitigasi', 'Kenapa banjir makin sering dan apa yang bisa dilakukan warga.', 'id', 8, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-LING-197';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
    (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', 'Penyebab')),
    (gen_random_uuid(), v_id, 'LIST', 1, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Curah hujan ekstrem$li$,
      $li$Drainase tersumbat sampah$li$,
      $li$Alih fungsi lahan resapan$li$,
      $li$Bantaran sungai dibangun$li$
    ]))),
    (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', 'Mitigasi Warga')),
    (gen_random_uuid(), v_id, 'LIST', 3, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Jangan buang sampah ke selokan$li$,
      $li$Buat biopori & sumur resapan$li$,
      $li$Tanam pohon di lahan kosong$li$,
      $li$Pantau info cuaca BMKG$li$
    ]))),
    (gen_random_uuid(), v_id, 'HEADING', 4, jsonb_build_object('text', 'Tas Siaga Banjir')),
    (gen_random_uuid(), v_id, 'LIST', 5, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Dokumen penting dalam plastik$li$,
      $li$Obat-obatan & P3K$li$,
      $li$Senter + powerbank$li$,
      $li$Pakaian ganti & makanan kering$li$
    ])));
END $doblk$;
