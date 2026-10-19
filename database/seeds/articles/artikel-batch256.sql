-- Batch 256: 1 artikel Teknologi (Komputer Kuantum) — idempoten
-- Dibuat: 2026-10-19 (Siklus Abadi putaran 379)

INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('b1b1b1b1-0114-4000-8000-000000000114', 'EXP-TEK-264', 'b8888888-8888-8888-8888-888888888888', 'Komputer Kuantum: Melompat ke Era Baru', 'komputer-kuantum-era-baru', 'Qubit, superposisi, dan apa yang bisa dilakukan komputer kuantum.', 'id', 8, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-TEK-264';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
    (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', 'Qubit')),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 1, jsonb_build_object('text', $txt$Bit klasik: 0 ATAU 1. Qubit: 0 DAN 1 sekaligus (superposisi). n qubit = 2^n keadaan.$txt$)),
    (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', 'Kegunaan')),
    (gen_random_uuid(), v_id, 'LIST', 3, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Simulasi molekul obat$li$,
      $li$Optimasi logistik$li$,
      $li$Kriptografi (ancaman & peluang)$li$
    ]))),
    (gen_random_uuid(), v_id, 'HEADING', 4, jsonb_build_object('text', 'Kenyataan')),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 5, jsonb_build_object('text', $txt$Butuh suhu -273°C, error tinggi. Belum gantikan laptop — untuk masalah khusus.$txt$));
END $doblk$;
