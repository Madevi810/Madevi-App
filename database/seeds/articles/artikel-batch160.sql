-- Batch 160: 1 artikel Sejarah (Kemerdekaan Daerah) — idempoten
-- Dibuat: 2026-10-19 (Siklus Abadi putaran 59)

INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('b1b1b1b1-0018-4000-8000-000000000018', 'EXP-SEJ-168', 'b8888888-8888-8888-8888-888888888888', 'Perjuangan Daerah Mempertahankan Kemerdekaan', 'perjuangan-daerah-kemerdekaan', 'Dari Bandung Lautan Api hingga Puputan Margarana: perjuangan daerah 1945-1949.', 'id', 8, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-SEJ-168';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
    (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', 'Peristiwa Heroik')),
    (gen_random_uuid(), v_id, 'LIST', 1, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Bandung Lautan Api (Mar 1946): bumi hangus Bandung selatan$li$,
      $li$Pertempuran Surabaya (Nov 1945): 10 November = Hari Pahlawan$li$,
      $li$Puputan Margarana, Bali (Nov 1946): I Gusti Ngurah Rai$li$,
      $li$Serangan Umum 1 Maret 1949: Yogyakarta$li$
    ]))),
    (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', 'Makna Perjuangan Daerah')),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 3, jsonb_build_object('text', $txt$Kemerdekaan bukan hadiah — dipertahankan dengan darah di seluruh nusantara. Semangat ini yang melahirkan Bhinneka Tunggal Ika sebagai perekat.$txt$)),
    (gen_random_uuid(), v_id, 'HEADING', 4, jsonb_build_object('text', 'Mengenang dengan Tindakan')),
    (gen_random_uuid(), v_id, 'LIST', 5, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Kunjungi museum/monumen perjuangan$li$,
      $li$Ceritakan ke generasi muda$li$,
      $li$Isi kemerdekaan dengan karya nyata$li$
    ])));
END $doblk$;
