-- Batch 218: 1 artikel Sejarah (Reformasi) — idempoten
-- Dibuat: 2026-10-19 (Siklus Abadi putaran 252)

INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('b1b1b1b1-0076-4000-8000-000000000076', 'EXP-SEJ-226', 'b8888888-8888-8888-8888-888888888888', 'Reformasi 1998: Jatuhnya Orde Baru', 'reformasi-1998-orde-baru', 'Krisis moneter, tragedi Trisakti, dan lengsernya Soeharto.', 'id', 8, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-SEJ-226';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
    (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', 'Krisis Moneter')),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 1, jsonb_build_object('text', $txt$1997: rupiah anjlok dari 2.400 ke 16.000 per dolar. Harga melambung, PHK massal.$txt$)),
    (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', 'Tragedi Mei 1998')),
    (gen_random_uuid(), v_id, 'LIST', 3, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$12 Mei: 4 mahasiswa Trisakti gugur$li$,
      $li$13-15 Mei: kerusuhan massal$li$,
      $li$21 Mei: Soeharto mundur, Habibie naik$li$
    ]))),
    (gen_random_uuid(), v_id, 'HEADING', 4, jsonb_build_object('text', 'Warisan Reformasi')),
    (gen_random_uuid(), v_id, 'LIST', 5, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Kebebasan pers$li$,
      $li$Pemilu langsung$li$,
      $li$Desentralisasi$li$,
      $li$TNI keluar dari politik praktis$li$
    ])));
END $doblk$;
