-- Batch 161: 1 artikel Lingkungan (Hemat Air) — idempoten
-- Dibuat: 2026-10-19 (Siklus Abadi putaran 62)

INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('b1b1b1b1-0019-4000-8000-000000000019', 'EXP-LING-169', 'b8888888-8888-8888-8888-888888888888', 'Hemat Air di Musim Kemarau', 'hemat-air-musim-kemarau', 'Cara menghemat air bersih saat kemarau: dari mandi sampai menyiram tanaman.', 'id', 5, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-LING-169';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
    (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', 'Kenapa Harus Hemat')),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 1, jsonb_build_object('text', $txt$Sumur kering saat kemarau panjang. Satu orang butuh 60 liter/hari; mandi dengan gayung vs shower bisa beda 50 liter.$txt$)),
    (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', '7 Cara Praktis')),
    (gen_random_uuid(), v_id, 'LIST', 3, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Mandi dengan gayung, matikan keran saat sabunan$li$,
      $li$Tampung air cucian beras untuk siram tanaman$li$,
      $li$Cuci kendaraan dengan lap basah, bukan selang$li$,
      $li$Perbaiki keran bocor segera$li$,
      $li$Siram tanaman pagi/sore (minim penguapan)$li$,
      $li$Gunakan air bekas wudhu untuk pel$li$,
      $li$Buat lubang biopori untuk resapan$li$
    ])));
END $doblk$;
