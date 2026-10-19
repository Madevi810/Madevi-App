-- Batch 171: 1 artikel Kimia (Larutan) — idempoten
-- Dibuat: 2026-10-19 (Siklus Abadi putaran 96)

INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('b1b1b1b1-0029-4000-8000-000000000029', 'EXP-KIM-179', 'b8888888-8888-8888-8888-888888888888', 'Larutan: Jenuh, Tak Jenuh, dan Lewat Jenuh', 'larutan-jenuh-tak-jenuh', 'Konsep kelarutan dengan contoh gula-teh: faktor suhu dan cara menghitung konsentrasi.', 'id', 7, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-KIM-179';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
    (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', 'Tiga Jenis Larutan')),
    (gen_random_uuid(), v_id, 'LIST', 1, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Tak jenuh: masih bisa melarutkan (teh tawar + sedikit gula)$li$,
      $li$Jenuh: sudah maksimal (gula tidak larut lagi)$li$,
      $li$Lewat jenuh: dipanaskan dulu, didinginkan perlahan (madu mengkristal)$li$
    ]))),
    (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', 'Faktor Kelarutan')),
    (gen_random_uuid(), v_id, 'LIST', 3, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Suhu: umumnya naik bila dipanaskan$li$,
      $li$Pengadukan: mempercepat, tidak menambah jumlah$li$,
      $li$Ukuran partikel: gula halus lebih cepat larut$li$
    ]))),
    (gen_random_uuid(), v_id, 'HEADING', 4, jsonb_build_object('text', 'Hitung Konsentrasi')),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 5, jsonb_build_object('text', $txt$% massa = (massa zat / massa larutan) × 100%. Contoh: 10 g gula dalam 100 g teh manis = 10%.$txt$));
END $doblk$;
