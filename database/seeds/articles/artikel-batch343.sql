-- Batch 343: 1 artikel Kesehatan (Imunisasi) — idempoten
-- Dibuat: 2026-10-19 (Siklus Abadi putaran 669)

INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('b1b1b1b1-0201-4000-8000-000000000201', 'EXP-KES-351', 'b8888888-8888-8888-8888-888888888888', 'Jadwal Imunisasi Dasar Anak', 'jadwal-imunisasi-dasar-anak', 'Imunisasi wajib 0-18 bulan & manfaatnya.', 'id', 7, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-KES-351';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
    (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', 'Jadwal')),
    (gen_random_uuid(), v_id, 'LIST', 1, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$0 bln: HB0$li$,
      $li$1 bln: BCG, Polio 1$li$,
      $li$2-4 bln: DPT-HB-Hib, Polio$li$,
      $li$9 bln: Campak$li$,
      $li$18 bln: DPT-HB-Hib lanjutan$li$
    ]))),
    (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', 'Manfaat')),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 3, jsonb_build_object('text', $txt$Cegah TBC, polio, difteri, campak. Gratis di posyandu/puskesmas.$txt$)),
    (gen_random_uuid(), v_id, 'HEADING', 4, jsonb_build_object('text', 'Efek Samping')),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 5, jsonb_build_object('text', $txt$Demam ringan wajar. Kompres & beri ASI.$txt$));
END $doblk$;
