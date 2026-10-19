-- Batch 252: 1 artikel Agama (Zakat Fitrah) — idempoten
-- Dibuat: 2026-10-19 (Siklus Abadi putaran 366)

INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('b1b1b1b1-0110-4000-8000-000000000110', 'EXP-AGA-260', 'b8888888-8888-8888-8888-888888888888', 'Zakat Fitrah: Takaran, Waktu, dan Penerimanya', 'zakat-fitrah-takaran-waktu', 'Ketentuan zakat fitrah: 1 sha, waktu bayar, dan 8 asnaf.', 'id', 7, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-AGA-260';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
    (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', 'Takaran')),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 1, jsonb_build_object('text', $txt$1 sha = ±2,5-3 kg makanan pokok (beras). Boleh uang senilai (khilafiyah — mayoritas: makanan).$txt$)),
    (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', 'Waktu')),
    (gen_random_uuid(), v_id, 'LIST', 3, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Wajib: tenggelam matahari akhir Ramadhan$li$,
      $li$Afdhal: pagi hari raya sebelum shalat$li$,
      $li$Makruh: setelah shalat Id$li$,
      $li$Haram: setelah hari raya (jadi qadha)$li$
    ]))),
    (gen_random_uuid(), v_id, 'HEADING', 4, jsonb_build_object('text', 'Penerima')),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 5, jsonb_build_object('text', $txt$8 asnaf: fakir, miskin, amil, muallaf, riqab, gharim, fisabilillah, ibnu sabil.$txt$));
END $doblk$;
