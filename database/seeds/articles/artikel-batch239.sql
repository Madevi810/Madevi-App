-- Batch 239: 1 artikel Teknologi (Drone) — idempoten
-- Dibuat: 2026-10-19 (Siklus Abadi putaran 322)

INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('b1b1b1b1-0097-4000-8000-000000000097', 'EXP-TEK-247', 'b8888888-8888-8888-8888-888888888888', 'Drone: Dari Mainan sampai Penyelamat', 'drone-mainan-penyelamat', 'Cara kerja drone, kegunaannya, dan aturan terbang di Indonesia.', 'id', 7, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-TEK-247';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
    (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', 'Cara Kerja')),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 1, jsonb_build_object('text', $txt$4+ baling-baling + giroskop + GPS. Flight controller menyeimbangkan 100x per detik.$txt$)),
    (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', 'Kegunaan')),
    (gen_random_uuid(), v_id, 'LIST', 3, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Fotografi & videografi udara$li$,
      $li$Pemetaan & survei tambang$li$,
      $li$Pertanian presisi$li$,
      $li$SAR & pemadam kebakaran$li$,
      $li$Pengiriman barang$li$
    ]))),
    (gen_random_uuid(), v_id, 'HEADING', 4, jsonb_build_object('text', 'Aturan Indonesia')),
    (gen_random_uuid(), v_id, 'LIST', 5, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Maks 150m, dalam pandangan$li$,
      $li$Jauhi bandara & keramaian$li$,
      $li$Izin untuk komersial (DKPPU)$li$
    ])));
END $doblk$;
