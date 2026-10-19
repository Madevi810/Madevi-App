-- Batch 175: 1 artikel Agama (Zakat Mal) — idempoten
-- Dibuat: 2026-10-19 (Siklus Abadi putaran 109)

INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('b1b1b1b1-0033-4000-8000-000000000033', 'EXP-AGA-183', 'b8888888-8888-8888-8888-888888888888', 'Zakat Mal: Syarat, Nisab, dan Cara Menghitung', 'zakat-mal-syarat-nisab', 'Panduan zakat harta: syarat wajib, nisab emas/perak, dan contoh perhitungan.', 'id', 8, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-AGA-183';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
    (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', 'Syarat Wajib Zakat')),
    (gen_random_uuid(), v_id, 'LIST', 1, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Muslim dan merdeka$li$,
      $li$Harta milik penuh$li$,
      $li$Mencapai nisab$li$,
      $li$Haul: dimiliki 1 tahun hijriah$li$
    ]))),
    (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', 'Nisab dan Kadar')),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 3, jsonb_build_object('text', $txt$Nisab emas: 85 gram. Kadar zakat: 2,5%. Contoh: tabungan Rp100 juta (di atas nisab, genap setahun) → zakat Rp2,5 juta.$txt$)),
    (gen_random_uuid(), v_id, 'HEADING', 4, jsonb_build_object('text', 'Kepada Siapa')),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 5, jsonb_build_object('text', $txt$8 asnaf: fakir, miskin, amil, muallaf, riqab, gharim, fisabilillah, ibnu sabil. Salurkan via amil terpercaya (BAZNAS/LAZ).$txt$));
END $doblk$;
