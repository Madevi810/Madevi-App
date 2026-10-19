-- Batch 372: 1 artikel Agama (Zikir) — idempoten
-- Dibuat: 2026-10-19 (Siklus Abadi putaran 766)

INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('b1b1b1b1-0230-4000-8000-000000000230', 'EXP-AGA-380', 'b8888888-8888-8888-8888-888888888888', 'Zikir Pagi & Petang', 'zikir-pagi-petang', 'Bacaan zikir pagi-petang & keutamaannya.', 'id', 6, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-AGA-380';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
    (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', 'Waktu')),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 1, jsonb_build_object('text', $txt$Pagi: subuh-syuruq. Petang: ashar-maghrib.$txt$)),
    (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', 'Bacaan Pokok')),
    (gen_random_uuid(), v_id, 'LIST', 3, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Ayat kursi$li$,
      $li$Al-Ikhlas, Al-Falaq, An-Nas (3x)$li$,
      $li$Sayyidul istighfar$li$,
      $li$Tasbih, tahmid, takbir (33x / 100x)$li$
    ]))),
    (gen_random_uuid(), v_id, 'HEADING', 4, jsonb_build_object('text', 'Keutamaan')),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 5, jsonb_build_object('text', $txt$Perlindungan sehari penuh. Hati tenang.$txt$));
END $doblk$;
