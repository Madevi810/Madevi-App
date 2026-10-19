-- Batch 152: 1 artikel Keuangan (Dana Darurat) — idempoten
-- Dibuat: 2026-10-19 (Siklus Abadi putaran 31)

INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('b1b1b1b1-0010-4000-8000-000000000010', 'EXP-KEU-160', 'b8888888-8888-8888-8888-888888888888', 'Dana Darurat: Berapa dan Di Mana Menyimpannya', 'dana-darurat-berapa-dimana', 'Besaran ideal dana darurat untuk lajang, menikah, dan freelancer — plus tempat penyimpanan yang tepat.', 'id', 7, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-KEU-160';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
    (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', 'Besaran Ideal')),
    (gen_random_uuid(), v_id, 'LIST', 1, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Lajang: 3x pengeluaran bulanan$li$,
      $li$Menikah 1 penghasilan: 6x$li$,
      $li$Menikah 2 penghasilan: 4x$li$,
      $li$Freelancer/usaha: 6-12x (penghasilan fluktuatif)$li$
    ]))),
    (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', 'Di Mana Menyimpan')),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 3, jsonb_build_object('text', $txt$Pisahkan dari rekening harian. Pilihan: tabungan terpisah, deposito, atau reksa dana pasar uang (cair 1-2 hari). Jangan di saham/crypto — terlalu fluktuatif untuk dana darurat.$txt$)),
    (gen_random_uuid(), v_id, 'HEADING', 4, jsonb_build_object('text', 'Cara Mengumpulkan')),
    (gen_random_uuid(), v_id, 'LIST', 5, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Sisihkan 10-20% gaji otomatis tiap gajian$li$,
      $li$Mulai dari target kecil: 1 juta pertama$li$,
      $li$Bonus/THR: alokasikan 50% ke dana darurat$li$,
      $li$Jangan dipakai untuk diskon atau liburan$li$
    ])));
END $doblk$;
