-- Batch 215: 1 artikel Kesehatan (Jantung) — idempoten
-- Dibuat: 2026-10-19 (Siklus Abadi putaran 242)

INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('b1b1b1b1-0073-4000-8000-000000000073', 'EXP-KES-223', 'b8888888-8888-8888-8888-888888888888', 'Jantung Sehat: Pencegahan Penyakit No. 1', 'jantung-sehat-pencegahan', 'Penyakit jantung pembunuh no. 1: faktor risiko, gejala serangan, dan pencegahan.', 'id', 8, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-KES-223';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
    (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', 'Gejala Serangan')),
    (gen_random_uuid(), v_id, 'LIST', 1, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Nyeri dada seperti ditekan$li$,
      $li$Menjalar ke lengan kiri/leher$li$,
      $li$Keringat dingin, mual$li$,
      $li$Sesak napas$li$
    ]))),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 2, jsonb_build_object('text', $txt$Gejala pada perempuan bisa samar: kelelahan ekstrem, nyeri punggung. Jangan abaikan!$txt$)),
    (gen_random_uuid(), v_id, 'HEADING', 3, jsonb_build_object('text', 'Pencegahan')),
    (gen_random_uuid(), v_id, 'LIST', 4, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Stop merokok (risiko turun 50% dalam 1 tahun)$li$,
      $li$Olahraga 150 mnt/minggu$li$,
      $li$Kelola stres & tidur cukup$li$,
      $li$Cek kolesterol & tekanan rutin$li$
    ]))),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 5, jsonb_build_object('text', $txt$Darurat: hubungi 119. Tiap menit berharga — jangan tunda ke RS.$txt$));
END $doblk$;
