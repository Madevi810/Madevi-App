-- Batch 275: 1 artikel Sejarah (G30S) — idempoten
-- Dibuat: 2026-10-19 (Siklus Abadi putaran 442)

INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('b1b1b1b1-0133-4000-8000-000000000133', 'EXP-SEJ-283', 'b8888888-8888-8888-8888-888888888888', 'G30S 1965: Fakta dan Kontroversinya', 'g30s-1965-fakta', 'Peristiwa 30 September 1965: kronologi dan perdebatan sejarahnya.', 'id', 9, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-SEJ-283';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
    (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', 'Kronologi')),
    (gen_random_uuid(), v_id, 'LIST', 1, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$30 Sep malam: 6 jenderal diculik$li$,
      $li$1 Okt: Untung umumkan Dewan Revolusi$li$,
      $li$Soeharto pimpin penumpasan$li$
    ]))),
    (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', 'Versi Resmi Orba')),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 3, jsonb_build_object('text', $txt$PKI didalangi. Lubang Buaya jadi monumen. Film wajib tonton era Orba.$txt$)),
    (gen_random_uuid(), v_id, 'HEADING', 4, jsonb_build_object('text', 'Perdebatan')),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 5, jsonb_build_object('text', $txt$Sejarawan berbeda: konflik internal AD? Dalang tunggal? Baca beragam sumber kritis.$txt$));
END $doblk$;
