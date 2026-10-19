-- Batch 300: 1 artikel Agama (Sedekah) — idempoten
-- Dibuat: 2026-10-19 (Siklus Abadi putaran 526)

INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('b1b1b1b1-0158-4000-8000-000000000158', 'EXP-AGA-308', 'b8888888-8888-8888-8888-888888888888', 'Sedekah: Investasi Abadi', 'sedekah-investasi-abadi', 'Keutamaan sedekah, adab, dan sedekah jariyah.', 'id', 7, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-AGA-308';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
    (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', 'Keutamaan')),
    (gen_random_uuid(), v_id, 'LIST', 1, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Dilipatgandakan 700x (QS Al-Baqarah: 261)$li$,
      $li$Menolak bala$li$,
      $li$Naungan di hari kiamat$li$
    ]))),
    (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', 'Adab')),
    (gen_random_uuid(), v_id, 'LIST', 3, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Ikhlas, sembunyikan$li$,
      $li$Dari harta halal$li$,
      $li$Jangan mengungkit$li$
    ]))),
    (gen_random_uuid(), v_id, 'HEADING', 4, jsonb_build_object('text', 'Sedekah Jariyah')),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 5, jsonb_build_object('text', $txt$Ilmu bermanfaat, wakaf, anak saleh — pahala mengalir setelah wafat.$txt$));
END $doblk$;
