-- Batch 156: 1 artikel Matematika (Pecahan Campuran) — idempoten
-- Dibuat: 2026-10-19 (Siklus Abadi putaran 46)

INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('b1b1b1b1-0014-4000-8000-000000000014', 'EXP-MTK-164', 'b8888888-8888-8888-8888-888888888888', 'Pecahan Campuran: Ubah, Jumlah, Kurang', 'pecahan-campuran-ubah-jumlah', 'Mengubah pecahan campuran ke biasa, menjumlahkan, dan mengurangkan — dengan contoh langkah demi langkah.', 'id', 7, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-MTK-164';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
    (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', 'Mengubah ke Pecahan Biasa')),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 1, jsonb_build_object('text', $txt$Rumus: a b/c = (a×c + b)/c. Contoh: 2 3/4 = (2×4+3)/4 = 11/4.$txt$)),
    (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', 'Penjumlahan')),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 3, jsonb_build_object('text', $txt$Cara 1: ubah semua ke pecahan biasa dulu. 1 1/2 + 2 1/4 = 3/2 + 9/4 = 6/4 + 9/4 = 15/4 = 3 3/4. Cara 2: jumlahkan bilangan bulat dan pecahan terpisah.$txt$)),
    (gen_random_uuid(), v_id, 'HEADING', 4, jsonb_build_object('text', 'Pengurangan dengan Meminjam')),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 5, jsonb_build_object('text', $txt$3 1/4 − 1 3/4: karena 1/4 < 3/4, pinjam 1 dari 3 → 2 5/4 − 1 3/4 = 1 2/4 = 1 1/2.$txt$)),
    (gen_random_uuid(), v_id, 'HEADING', 6, jsonb_build_object('text', 'Latihan')),
    (gen_random_uuid(), v_id, 'LIST', 7, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Ubah 3 2/5 ke pecahan biasa$li$,
      $li$Hitung 2 1/3 + 1 1/6$li$,
      $li$Hitung 5 1/2 − 2 3/4$li$
    ])));
END $doblk$;
