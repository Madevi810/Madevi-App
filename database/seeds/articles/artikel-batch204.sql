-- Batch 204: 1 artikel Teknologi (Cloud) — idempoten
-- Dibuat: 2026-10-19 (Siklus Abadi putaran 206)

INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('b1b1b1b1-0062-4000-8000-000000000062', 'EXP-TEK-212', 'b8888888-8888-8888-8888-888888888888', 'Cloud Computing: Memahami Komputasi Awan', 'cloud-computing-memahami', 'Apa itu cloud: model layanan, kelebihan, dan kapan memakainya.', 'id', 7, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-TEK-212';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
    (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', 'Analogi Sederhana')),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 1, jsonb_build_object('text', $txt$Cloud = menyewa komputer orang lain lewat internet. Seperti listrik: tidak perlu bangun pembangkit sendiri.$txt$)),
    (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', 'Model Layanan')),
    (gen_random_uuid(), v_id, 'LIST', 3, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$SaaS: pakai aplikasi (Gmail, Canva)$li$,
      $li$PaaS: platform untuk developer$li$,
      $li$IaaS: sewa server mentah$li$
    ]))),
    (gen_random_uuid(), v_id, 'HEADING', 4, jsonb_build_object('text', 'Kelebihan & Kekurangan')),
    (gen_random_uuid(), v_id, 'LIST', 5, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Plus: murah awal, skalabel, akses di mana saja$li$,
      $li$Minus: butuh internet, data di pihak ketiga$li$
    ])));
END $doblk$;
