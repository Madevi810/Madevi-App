-- Batch 371: 1 artikel Sejarah (Orde Baru) — idempoten
-- Dibuat: 2026-10-19 (Siklus Abadi putaran 762)

INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('b1b1b1b1-0229-4000-8000-000000000229', 'EXP-SEJ-379', 'b8888888-8888-8888-8888-888888888888', 'Orde Baru: Pembangunan & Otoritarianisme', 'orde-baru-pembangunan', '32 tahun Soeharto: Repelita, stabilitas, & kritiknya.', 'id', 9, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-SEJ-379';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
    (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', 'Pembangunan')),
    (gen_random_uuid(), v_id, 'LIST', 1, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Repelita I-V$li$,
      $li$Swasembada beras 1984$li$,
      $li$Inpres & transmigrasi$li$
    ]))),
    (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', 'Sisi Gelap')),
    (gen_random_uuid(), v_id, 'LIST', 3, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$KKN merajalela$li$,
      $li$Pembungkaman oposisi$li$,
      $li$Dwifungsi ABRI$li$
    ]))),
    (gen_random_uuid(), v_id, 'HEADING', 4, jsonb_build_object('text', 'Akhir')),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 5, jsonb_build_object('text', $txt$Krisis 1997-1998 → mundur 21 Mei 1998.$txt$));
END $doblk$;
