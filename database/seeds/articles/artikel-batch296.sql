-- Batch 296: 1 artikel Teknologi (Satelit) — idempoten
-- Dibuat: 2026-10-19 (Siklus Abadi putaran 512)

INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('b1b1b1b1-0154-4000-8000-000000000154', 'EXP-TEK-304', 'b8888888-8888-8888-8888-888888888888', 'Satelit: Mata di Angkasa', 'satelit-mata-di-angkasa', 'Jenis satelit, orbitnya, dan manfaatnya bagi Indonesia.', 'id', 7, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-TEK-304';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
    (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', 'Jenis')),
    (gen_random_uuid(), v_id, 'LIST', 1, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Komunikasi (Palapa, Satria)$li$,
      $li$Penginderaan jauh$li$,
      $li$Navigasi (GPS)$li$,
      $li$Cuaca$li$
    ]))),
    (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', 'Orbit')),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 3, jsonb_build_object('text', $txt$GEO 36.000 km (tetap), LEO 500-2.000 km (Starlink).$txt$)),
    (gen_random_uuid(), v_id, 'HEADING', 4, jsonb_build_object('text', 'Manfaat')),
    (gen_random_uuid(), v_id, 'LIST', 5, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Internet daerah 3T$li$,
      $li$Prakiraan cuaca$li$,
      $li$Pemetaan bencana$li$
    ])));
END $doblk$;
