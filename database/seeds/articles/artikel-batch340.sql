-- Batch 340: 1 artikel Lingkungan (Sampah) — idempoten
-- Dibuat: 2026-10-19 (Siklus Abadi putaran 659)

INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('b1b1b1b1-0198-4000-8000-000000000198', 'EXP-LING-348', 'b8888888-8888-8888-8888-888888888888', 'Bank Sampah: Ubah Sampah Jadi Rupiah', 'bank-sampah-ubah-jadi-rupiah', 'Cara kerja bank sampah & keuntungannya.', 'id', 7, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-LING-348';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
    (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', 'Cara Kerja')),
    (gen_random_uuid(), v_id, 'LIST', 1, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Pilah sampah anorganik$li$,
      $li$Setor ke bank sampah$li$,
      $li$Ditimbang & dicatat di buku$li$,
      $li$Bisa ditarik tunai$li$
    ]))),
    (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', 'Harga')),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 3, jsonb_build_object('text', $txt$Kardus ±Rp2.000/kg, botol PET ±Rp4.000/kg, besi ±Rp5.000/kg (bervariasi).$txt$)),
    (gen_random_uuid(), v_id, 'HEADING', 4, jsonb_build_object('text', 'Manfaat')),
    (gen_random_uuid(), v_id, 'LIST', 5, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Dapat uang$li$,
      $li$Lingkungan bersih$li$,
      $li$Pemberdayaan warga$li$
    ])));
END $doblk$;
