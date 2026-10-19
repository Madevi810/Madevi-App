-- Batch 423: 1 artikel Agama (Shalat) — idempoten
-- Dibuat: 2026-10-19 (Siklus Abadi putaran 936)

INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('b1b1b1b1-0281-4000-8000-000000000281', 'EXP-AGA-431', 'b8888888-8888-8888-8888-888888888888', 'Shalat Wajib: Rukun & Syarat', 'shalat-wajib-rukun-syarat', 'Rukun, syarat sah, & yang membatalkan shalat.', 'id', 8, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-AGA-431';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
    (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', 'Syarat Sah')),
    (gen_random_uuid(), v_id, 'LIST', 1, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Suci dari hadas & najis$li$,
      $li$Tutup aurat$li$,
      $li$Menghadap kiblat$li$,
      $li$Masuk waktu$li$
    ]))),
    (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', 'Rukun (13)')),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 3, jsonb_build_object('text', $txt$Niat, takbiratul ihram, berdiri, Fatihah, ruku, iktidal, sujud, duduk, tasyahud, shalawat, salam, tertib.$txt$)),
    (gen_random_uuid(), v_id, 'HEADING', 4, jsonb_build_object('text', 'Pembatal')),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 5, jsonb_build_object('text', $txt$Bicara sengaja, makan minum, bergerak banyak.$txt$));
END $doblk$;
