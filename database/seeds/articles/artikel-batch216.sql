-- Batch 216: 1 artikel Teknologi (Quantum) — idempoten
-- Dibuat: 2026-10-19 (Siklus Abadi putaran 246)

INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('b1b1b1b1-0074-4000-8000-000000000074', 'EXP-TEK-224', 'b8888888-8888-8888-8888-888888888888', 'Komputasi Kuantum: Komputer Masa Depan', 'komputasi-kuantum-masa-depan', 'Qubit, superposisi, dan apa yang bisa (dan tidak bisa) dilakukan komputer kuantum.', 'id', 8, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-TEK-224';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
    (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', 'Qubit vs Bit')),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 1, jsonb_build_object('text', $txt$Bit: 0 atau 1. Qubit: 0, 1, atau keduanya sekaligus (superposisi). 300 qubit bisa merepresentasikan lebih banyak keadaan daripada atom di alam semesta.$txt$)),
    (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', 'Kegunaan')),
    (gen_random_uuid(), v_id, 'LIST', 3, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Simulasi molekul obat$li$,
      $li$Optimasi logistik$li$,
      $li$Memecahkan enkripsi (ancaman!)$li$
    ]))),
    (gen_random_uuid(), v_id, 'HEADING', 4, jsonb_build_object('text', 'Kenyataan Hari Ini')),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 5, jsonb_build_object('text', $txt$Masih rapuh: butuh suhu near absolute zero, error tinggi. Bukan pengganti laptop — alat khusus masalah khusus.$txt$));
END $doblk$;
