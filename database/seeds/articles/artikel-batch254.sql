-- Batch 254: 1 artikel Sejarah (Tanam Paksa) — idempoten
-- Dibuat: 2026-10-19 (Siklus Abadi putaran 372)

INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('b1b1b1b1-0112-4000-8000-000000000112', 'EXP-SEJ-262', 'b8888888-8888-8888-8888-888888888888', 'Tanam Paksa: Penderitaan di Balik Keuntungan Belanda', 'tanam-paksa-cultuurstelsel', 'Cultuurstelsel 1830-1870: aturan, penyimpangan, dan dampaknya.', 'id', 8, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-SEJ-262';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
    (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', 'Aturan Resmi')),
    (gen_random_uuid(), v_id, 'LIST', 1, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$1/5 tanah untuk tanaman ekspor$li$,
      $li$Pajak tanah dibebaskan$li$,
      $li$Kelebihan hasil dikembalikan$li$
    ]))),
    (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', 'Kenyataan')),
    (gen_random_uuid(), v_id, 'LIST', 3, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Tanah dirampas lebih dari 1/5$li$,
      $li$Kerja rodi tanpa upah$li$,
      $li$Kelaparan meluas$li$
    ]))),
    (gen_random_uuid(), v_id, 'HEADING', 4, jsonb_build_object('text', 'Akhir')),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 5, jsonb_build_object('text', $txt$Protes (Multatuli, Max Havelaar) → UU Agraria 1870: era liberal. Belanda untung 823 juta gulden.$txt$));
END $doblk$;
