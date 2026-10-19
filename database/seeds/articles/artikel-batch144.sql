-- Batch 144: 1 artikel Matematika (Trigonometri Dasar) — melengkapi 15/kategori (idempoten)
-- Dibuat: 2026-10-19 (Siklus Abadi putaran 1, backlog B4)

-- EXP-MTK-144: Trigonometri Dasar: Sin, Cos, Tan
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('b1b1b1b1-0001-4000-8000-000000000001', 'EXP-MTK-144', 'b8888888-8888-8888-8888-888888888888', 'Trigonometri Dasar: Sin, Cos, Tan', 'trigonometri-dasar-sin-cos-tan', 'Perbandingan sisi segitiga siku-siku: sinus, cosinus, tangen — dengan contoh soal dan tabel sudut istimewa.', 'id', 8, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-MTK-144';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
    (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', 'Tiga Perbandingan Dasar')),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 1, jsonb_build_object('text', $txt$Pada segitiga siku-siku, untuk sudut lancip: sin = depan/miring (demi), cos = samping/miring (sami), tan = depan/samping (desa). Hafalkan dengan "demi-sami-desa".$txt$)),
    (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', 'Sudut Istimewa')),
    (gen_random_uuid(), v_id, 'LIST', 3, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$sin 30° = 1/2, sin 45° = √2/2, sin 60° = √3/2$li$,
      $li$cos 30° = √3/2, cos 45° = √2/2, cos 60° = 1/2$li$,
      $li$tan 30° = √3/3, tan 45° = 1, tan 60° = √3$li$
    ]))),
    (gen_random_uuid(), v_id, 'HEADING', 4, jsonb_build_object('text', 'Contoh Soal')),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 5, jsonb_build_object('text', $txt$Tangga 5 m bersandar ke tembok membentuk sudut 60° dengan lantai. Tinggi tembok yang dicapai = 5 × sin 60° = 5 × √3/2 ≈ 4,33 m.$txt$)),
    (gen_random_uuid(), v_id, 'HEADING', 6, jsonb_build_object('text', 'Kegunaan Nyata')),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 7, jsonb_build_object('text', $txt$Trigonometri dipakai di survei tanah, navigasi, astronomi, dan grafika komputer (game). Konsep ini fondasi untuk gelombang dan getaran di fisika.$txt$));
END $doblk$;
