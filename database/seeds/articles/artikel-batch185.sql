-- Batch 185: 1 artikel Teknologi (e-Wallet) — idempoten
-- Dibuat: 2026-10-19 (Siklus Abadi putaran 142)

INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('b1b1b1b1-0043-4000-8000-000000000043', 'EXP-TEK-193', 'b8888888-8888-8888-8888-888888888888', 'Dompet Digital: Aman Bertransaksi Non-Tunai', 'dompet-digital-aman', 'Memilih e-wallet, mengamankan akun, dan tips transaksi QRIS yang aman.', 'id', 6, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-TEK-193';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
    (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', 'Keuntungan Non-Tunai')),
    (gen_random_uuid(), v_id, 'LIST', 1, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Praktis: cukup HP$li$,
      $li$Catatan transaksi otomatis$li$,
      $li$Promo cashback$li$,
      $li$Higienis (tanpa sentuh uang)$li$
    ]))),
    (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', 'Amankan Akunmu')),
    (gen_random_uuid(), v_id, 'LIST', 3, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Aktifkan PIN + biometrik$li$,
      $li$Jangan share OTP ke siapapun$li$,
      $li$Cek mutasi berkala$li$,
      $li$Logout dari HP lama sebelum ganti$li$
    ]))),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 4, jsonb_build_object('text', $txt$QRIS: pastikan nama merchant sesuai sebelum bayar. Waspada QR palsu yang ditempel di atas QR asli.$txt$));
END $doblk$;
