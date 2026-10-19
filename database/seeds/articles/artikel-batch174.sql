-- Batch 174: 1 artikel Kesehatan (Jantung) — idempoten
-- Dibuat: 2026-10-19 (Siklus Abadi putaran 106)

INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('b1b1b1b1-0032-4000-8000-000000000032', 'EXP-KES-182', 'b8888888-8888-8888-8888-888888888888', 'Menjaga Kesehatan Jantung Sejak Muda', 'jaga-kesehatan-jantung', 'Faktor risiko penyakit jantung dan 7 kebiasaan pencegahannya.', 'id', 7, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-KES-182';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
    (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', 'Faktor Risiko')),
    (gen_random_uuid(), v_id, 'LIST', 1, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Merokok$li$,
      $li$Kurang gerak$li$,
      $li$Makanan tinggi lemak jenuh & gula$li$,
      $li$Stres kronis$li$,
      $li$Kurang tidur$li$
    ]))),
    (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', '7 Kebiasaan Baik')),
    (gen_random_uuid(), v_id, 'LIST', 3, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Olahraga 150 menit/minggu$li$,
      $li$Berhenti merokok$li$,
      $li$Kurangi gorengan & minuman manis$li$,
      $li$Tidur 7-8 jam$li$,
      $li$Kelola stres$li$,
      $li$Cek tekanan darah rutin$li$,
      $li$Batasi alkohol$li$
    ]))),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 4, jsonb_build_object('text', $txt$Nyeri dada menjalar ke lengan kiri + keringat dingin + sesak = kemungkinan serangan jantung. Segera ke IGD, jangan tunggu.$txt$));
END $doblk$;
