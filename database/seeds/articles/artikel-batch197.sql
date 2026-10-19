-- Batch 197: 1 artikel Teknologi (Hoaks) — idempoten
-- Dibuat: 2026-10-19 (Siklus Abadi putaran 182)

INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('b1b1b1b1-0055-4000-8000-000000000055', 'EXP-TEK-205', 'b8888888-8888-8888-8888-888888888888', 'Mengenali Hoaks: Cek Fakta Sebelum Share', 'mengenali-hoaks-cek-fakta', 'Ciri hoaks, cara verifikasi, dan tools cek fakta Indonesia.', 'id', 7, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-TEK-205';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
    (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', 'Ciri Hoaks')),
    (gen_random_uuid(), v_id, 'LIST', 1, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Judul bombastis + huruf kapital semua$li$,
      $li$Sumber tidak jelas ("katanya", "viralkan!")$li$,
      $li$Memancing emosi: takut/marah$li$,
      $li$Foto/video tidak terkait (cek reverse image)$li$
    ]))),
    (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', 'Cara Verifikasi')),
    (gen_random_uuid(), v_id, 'LIST', 3, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Cek di turnbackhoax.id / cekfakta.com$li$,
      $li$Cari berita di media kredibel$li$,
      $li$Reverse image search untuk foto$li$,
      $li$Tanya ke yang ahli bila ragu$li$
    ]))),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 4, jsonb_build_object('text', $txt$Aturan emas: bila ragu, jangan share. Penyebar hoaks bisa kena UU ITE.$txt$));
END $doblk$;
