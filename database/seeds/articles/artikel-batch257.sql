-- Batch 257: 1 artikel Sejarah (Ethical Politic) — idempoten
-- Dibuat: 2026-10-19 (Siklus Abadi putaran 382)

INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('b1b1b1b1-0115-4000-8000-000000000115', 'EXP-SEJ-265', 'b8888888-8888-8888-8888-888888888888', 'Politik Etis: Sekolah untuk Pribumi', 'politik-etis-sekolah', 'Politik Etis 1901: irigasi, edukasi, emigrasi — dan lahirnya kaum terpelajar.', 'id', 7, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-SEJ-265';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
    (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', 'Trilogi van Deventer')),
    (gen_random_uuid(), v_id, 'LIST', 1, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Irigasi$li$,
      $li$Edukasi$li$,
      $li$Emigrasi (transmigrasi)$li$
    ]))),
    (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', 'Edukasi')),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 3, jsonb_build_object('text', $txt$Sekolah desa, HIS, MULO, AMS, STOVIL. Kartini & sekolah perempuan.$txt$)),
    (gen_random_uuid(), v_id, 'HEADING', 4, jsonb_build_object('text', 'Bumerang')),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 5, jsonb_build_object('text', $txt$Kaum terpelajar (Budi Utomo 1908, Sumpah Pemuda 1928) justru memimpin perlawanan.$txt$));
END $doblk$;
