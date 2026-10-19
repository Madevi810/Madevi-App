-- Batch 148: 1 artikel Teknologi (Keamanan Password) — idempoten
-- Dibuat: 2026-10-19 (Siklus Abadi putaran 20)

INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('b1b1b1b1-0006-4000-8000-000000000006', 'EXP-TEK-156', 'b8888888-8888-8888-8888-888888888888', 'Password Kuat Tanpa Harus Dihafal', 'password-kuat-tanpa-dihafal', 'Rahasia keamanan digital: passphrase, password manager, dan 2FA — praktis untuk semua umur.', 'id', 6, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-TEK-156';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
    (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', 'Masalah Password Umum')),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 1, jsonb_build_object('text', $txt$Password seperti "123456" atau tanggal lahir retak dalam hitungan detik oleh komputer. Solusinya bukan password rumit yang dilupakan, tapi sistem yang benar.$txt$)),
    (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', 'Metode Passphrase')),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 3, jsonb_build_object('text', $txt$Gabung 4-5 kata acak: "kuda-biru-makan-77-nasi". Panjang tapi mudah diingat dan sangat sulit ditebak. Tambahkan angka/simbol bila situs mewajibkan.$txt$)),
    (gen_random_uuid(), v_id, 'HEADING', 4, jsonb_build_object('text', 'Tiga Kebiasaan Wajib')),
    (gen_random_uuid(), v_id, 'LIST', 5, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Beda password untuk tiap akun penting (email, bank)$li$,
      $li$Aktifkan verifikasi 2 langkah (2FA) di email dan media sosial$li$,
      $li$Gunakan pengelola password bila perlu (aplikasi resmi, bukan catatan di HP)$li$
    ]))),
    (gen_random_uuid(), v_id, 'HEADING', 6, jsonb_build_object('text', 'Waspada Phising')),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 7, jsonb_build_object('text', $txt$Jangan klik tautan dari SMS/WA yang mengatasnamakan bank. Buka aplikasi resmi langsung. Bank tidak pernah meminta password lewat chat.$txt$));
END $doblk$;
