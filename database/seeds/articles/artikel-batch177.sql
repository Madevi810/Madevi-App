-- Batch 177: 1 artikel Lingkungan (Polusi Udara) — idempoten
-- Dibuat: 2026-10-19 (Siklus Abadi putaran 116)

INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('b1b1b1b1-0035-4000-8000-000000000035', 'EXP-LING-185', 'b8888888-8888-8888-8888-888888888888', 'Polusi Udara: Sumber, Dampak, dan Perlindungan', 'polusi-udara-dampak', 'PM2.5, ISPU, dan cara melindungi keluarga saat kualitas udara buruk.', 'id', 7, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-LING-185';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
    (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', 'Sumber Utama')),
    (gen_random_uuid(), v_id, 'LIST', 1, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Kendaraan bermotor$li$,
      $li$Pembakaran sampah & hutan$li$,
      $li$Industri & PLTU$li$,
      $li$Debu konstruksi$li$
    ]))),
    (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', 'Membaca ISPU')),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 3, jsonb_build_object('text', $txt$ISPU 0-50 baik, 51-100 sedang, 101-200 tidak sehat, >200 berbahaya. Cek di aplikasi kualitas udara sebelum olahraga luar.$txt$)),
    (gen_random_uuid(), v_id, 'HEADING', 4, jsonb_build_object('text', 'Perlindungan')),
    (gen_random_uuid(), v_id, 'LIST', 5, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Masker N95/KN95 saat ISPU >100$li$,
      $li$Tutup jendela, pakai air purifier bila ada$li$,
      $li$Kurangi aktivitas luar untuk anak & lansia$li$,
      $li$Tanaman dalam ruangan membantu sedikit$li$
    ])));
END $doblk$;
