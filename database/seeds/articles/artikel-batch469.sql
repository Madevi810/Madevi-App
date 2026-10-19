-- Batch 469: 1 artikel Kesehatan (Jantung) — idempoten
-- Dibuat: 2026-10-19 (Siklus Abadi putaran 1089)

INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('b1b1b1b1-0327-4000-8000-000000000327', 'EXP-KES-477', 'b8888888-8888-8888-8888-888888888888', 'Jantung Sehat: 7 Kebiasaan', 'jantung-sehat-7-kebiasaan', 'Menjaga jantung sejak muda.', 'id', 7, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-KES-477';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
    (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', '7 Kebiasaan')),
    (gen_random_uuid(), v_id, 'LIST', 1, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Olahraga 150 mnt/minggu$li$,
      $li$Kurangi garam & gorengan$li$,
      $li$Berhenti merokok$li$,
      $li$Tidur cukup$li$,
      $li$Kelola stres$li$,
      $li$Cek tensi rutin$li$,
      $li$Jaga berat badan$li$
    ]))),
    (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', 'Gejala Serangan')),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 3, jsonb_build_object('text', $txt$Nyeri dada, keringat dingin, sesak. Segera ke IGD.$txt$)),
    (gen_random_uuid(), v_id, 'HEADING', 4, jsonb_build_object('text', 'Fakta')),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 5, jsonb_build_object('text', $txt$Penyebab kematian no 1 di Indonesia.$txt$));
END $doblk$;
