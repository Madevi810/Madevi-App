-- Batch 329: 1 artikel Sejarah (Tanam Paksa) — idempoten
-- Dibuat: 2026-10-19 (Siklus Abadi putaran 622)

INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('b1b1b1b1-0187-4000-8000-000000000187', 'EXP-SEJ-337', 'b8888888-8888-8888-8888-888888888888', 'Tanam Paksa: Cultuurstelsel', 'tanam-paksa-cultuurstelsel', 'Sistem tanam paksa 1830-1870 & penderitaannya.', 'id', 8, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-SEJ-337';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
    (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', 'Sistem')),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 1, jsonb_build_object('text', $txt$1830: Van den Bosch. 1/5 tanah untuk tanaman ekspor (kopi, tebu, nila).$txt$)),
    (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', 'Penderitaan')),
    (gen_random_uuid(), v_id, 'LIST', 3, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Kelaparan meluas$li$,
      $li$Kerja paksa$li$,
      $li$Tanah dirampas$li$
    ]))),
    (gen_random_uuid(), v_id, 'HEADING', 4, jsonb_build_object('text', 'Akhir')),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 5, jsonb_build_object('text', $txt$Protes (Multatuli: Max Havelaar) → dihapus 1870, diganti politik liberal.$txt$));
END $doblk$;
