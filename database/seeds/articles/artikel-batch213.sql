-- Batch 213: 1 artikel Teknologi (Blockchain) — idempoten
-- Dibuat: 2026-10-19 (Siklus Abadi putaran 236)

INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('b1b1b1b1-0071-4000-8000-000000000071', 'EXP-TEK-221', 'b8888888-8888-8888-8888-888888888888', 'Blockchain: Bukan Cuma Kripto', 'blockchain-bukan-kripto', 'Cara kerja blockchain dan kegunaannya di luar mata uang digital.', 'id', 7, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-TEK-221';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
    (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', 'Cara Kerja')),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 1, jsonb_build_object('text', $txt$Blockchain = buku kas digital yang disalin ke ribuan komputer. Sekali tercatat, sulit diubah — transparan & tahan sensor.$txt$)),
    (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', 'Kegunaan Non-Kripto')),
    (gen_random_uuid(), v_id, 'LIST', 3, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Supply chain: lacak asal barang$li$,
      $li$Sertifikat digital anti-palsu$li$,
      $li$Voting elektronik$li$,
      $li$Smart contract$li$
    ]))),
    (gen_random_uuid(), v_id, 'HEADING', 4, jsonb_build_object('text', 'Kritik')),
    (gen_random_uuid(), v_id, 'LIST', 5, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Boros energi (proof-of-work)$li$,
      $li$Skalabilitas terbatas$li$,
      $li$Spekulasi kripto merusak citra$li$
    ])));
END $doblk$;
