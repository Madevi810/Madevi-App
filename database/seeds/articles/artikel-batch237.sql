-- Batch 237: 1 artikel Agama (Birrul Walidain) — idempoten
-- Dibuat: 2026-10-19 (Siklus Abadi putaran 316)

INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('b1b1b1b1-0095-4000-8000-000000000095', 'EXP-AGA-245', 'b8888888-8888-8888-8888-888888888888', 'Birrul Walidain: Berbakti kepada Orang Tua', 'birrul-walidain-berbakti', 'Kedudukan orang tua dalam Islam dan cara berbakti.', 'id', 7, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-AGA-245';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
    (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', 'Kedudukan Orang Tua')),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 1, jsonb_build_object('text', $txt$"Dan Tuhanmu telah memerintahkan agar kamu jangan menyembah selain Dia dan hendaklah berbuat baik kepada ibu bapak" (QS. Al-Isra: 23). Ridha Allah pada ridha orang tua.$txt$)),
    (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', 'Cara Berbakti')),
    (gen_random_uuid(), v_id, 'LIST', 3, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Bicara lembut, jangan membentak$li$,
      $li$Penuhi kebutuhan mereka$li$,
      $li$Luangkan waktu$li$,
      $li$Doakan tiap selesai shalat$li$,
      $li$Jaga nama baik keluarga$li$
    ]))),
    (gen_random_uuid(), v_id, 'HEADING', 4, jsonb_build_object('text', 'Bila Sudah Tiada')),
    (gen_random_uuid(), v_id, 'LIST', 5, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Doa & istighfar untuk mereka$li$,
      $li$Sedekah atas nama mereka$li$,
      $li$Sambung silaturahmi kerabatnya$li$
    ])));
END $doblk$;
