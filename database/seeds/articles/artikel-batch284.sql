-- Batch 284: 1 artikel Teknologi (IoT) — idempoten
-- Dibuat: 2026-10-19 (Siklus Abadi putaran 472)

INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('b1b1b1b1-0142-4000-8000-000000000142', 'EXP-TEK-292', 'b8888888-8888-8888-8888-888888888888', 'IoT: Semua Benda Terhubung', 'iot-semua-benda-terhubung', 'Internet of Things: konsep, contoh, dan risikonya.', 'id', 7, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-TEK-292';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
    (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', 'Konsep')),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 1, jsonb_build_object('text', $txt$Perangkat fisik + sensor + internet. 15+ miliar perangkat IoT di dunia.$txt$)),
    (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', 'Contoh')),
    (gen_random_uuid(), v_id, 'LIST', 3, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Smart home: lampu, CCTV$li$,
      $li$Wearable: smartwatch$li$,
      $li$Smart farming$li$,
      $li$Industri 4.0$li$
    ]))),
    (gen_random_uuid(), v_id, 'HEADING', 4, jsonb_build_object('text', 'Risiko')),
    (gen_random_uuid(), v_id, 'LIST', 5, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Privasi: data bocor$li$,
      $li$Keamanan: diretas$li$,
      $li$Ganti password default!$li$
    ])));
END $doblk$;
