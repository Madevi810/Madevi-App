-- Batch 322: 1 artikel Lingkungan (Hutan Mangrove) — idempoten
-- Dibuat: 2026-10-19 (Siklus Abadi putaran 599)

INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('b1b1b1b1-0180-4000-8000-000000000180', 'EXP-LING-330', 'b8888888-8888-8888-8888-888888888888', 'Mangrove: Benteng Pesisir', 'mangrove-benteng-pesisir', 'Fungsi ekologis mangrove & upaya rehabilitasinya.', 'id', 7, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-LING-330';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
    (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', 'Fungsi')),
    (gen_random_uuid(), v_id, 'LIST', 1, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Penahan abrasi & tsunami$li$,
      $li$Habitat ikan & udang$li$,
      $li$Penyerap karbon (blue carbon)$li$
    ]))),
    (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', 'Kondisi')),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 3, jsonb_build_object('text', $txt$Indonesia: 3,3 juta ha (terluas dunia). Sebagian rusak akibat tambak.$txt$)),
    (gen_random_uuid(), v_id, 'HEADING', 4, jsonb_build_object('text', 'Rehabilitasi')),
    (gen_random_uuid(), v_id, 'LIST', 5, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Penanaman jenis sesuai zona$li$,
      $li$Libatkan masyarakat pesisir$li$,
      $li$Ekowisata mangrove$li$
    ])));
END $doblk$;
