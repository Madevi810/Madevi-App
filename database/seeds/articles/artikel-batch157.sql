-- Batch 157: 1 artikel Agama (Puasa Sunnah) — idempoten
-- Dibuat: 2026-10-19 (Siklus Abadi putaran 49)

INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('b1b1b1b1-0015-4000-8000-000000000015', 'EXP-AGA-165', 'b8888888-8888-8888-8888-888888888888', 'Puasa Sunnah: Jenis, Niat, dan Keutamaannya', 'puasa-sunnah-jenis-niat', 'Panduan puasa Senin-Kamis, Ayyamul Bidh, dan lainnya: niat, tata cara, dan keutamaan.', 'id', 7, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-AGA-165';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
    (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', 'Jenis Puasa Sunnah')),
    (gen_random_uuid(), v_id, 'LIST', 1, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Senin & Kamis$li$,
      $li$Ayyamul Bidh (13, 14, 15 tiap bulan Hijriah)$li$,
      $li$Puasa Daud (sehari puasa sehari tidak)$li$,
      $li$Puasa Syawal (6 hari)$li$,
      $li$Puasa Arafah (9 Dzulhijjah)$li$
    ]))),
    (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', 'Niat')),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 3, jsonb_build_object('text', $txt$Niat puasa sunnah boleh dilakukan pagi hari sebelum zawal bila belum makan/minum. Contoh: "Nawaitu shauma ghadin sunnatan lillahi taala" (aku niat puasa sunnah esok hari karena Allah).$txt$)),
    (gen_random_uuid(), v_id, 'HEADING', 4, jsonb_build_object('text', 'Keutamaan')),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 5, jsonb_build_object('text', $txt$Puasa adalah perisai (HR. Bukhari Muslim). Puasa Arafah menghapus dosa setahun lalu dan setahun akan datang (HR. Muslim). Selain pahala, puasa melatih kesabaran dan empati.$txt$));
END $doblk$;
