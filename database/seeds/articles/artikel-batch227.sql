-- Batch 227: 1 artikel Teknologi (Satelit) — idempoten
-- Dibuat: 2026-10-19 (Siklus Abadi putaran 282)

INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('b1b1b1b1-0085-4000-8000-000000000085', 'EXP-TEK-235', 'b8888888-8888-8888-8888-888888888888', 'Satelit: Mata Indonesia dari Angkasa', 'satelit-mata-indonesia', 'Fungsi satelit: komunikasi, cuaca, GPS, dan program satelit Indonesia.', 'id', 7, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-TEK-235';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
    (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', 'Fungsi Satelit')),
    (gen_random_uuid(), v_id, 'LIST', 1, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Komunikasi: TV, internet, telepon$li$,
      $li$Navigasi: GPS$li$,
      $li$Cuaca & iklim$li$,
      $li$Penginderaan: peta, pantau hutan$li$
    ]))),
    (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', 'Satelit Indonesia')),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 3, jsonb_build_object('text', $txt$Palapa (1976): negara berkembang pertama pemilik satelit. Dilanjut Telkom, BRIsat, SATRIA-1 (2023) untuk internet cepat.$txt$)),
    (gen_random_uuid(), v_id, 'HEADING', 4, jsonb_build_object('text', 'Masa Depan')),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 5, jsonb_build_object('text', $txt$Ribuan satelit LEO (Starlink dkk) berlomba. Tantangan: sampah antariksa.$txt$));
END $doblk$;
