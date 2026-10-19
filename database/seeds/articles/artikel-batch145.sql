-- Batch 145: 2 artikel Agama (melengkapi 30/kategori) — idempoten
-- Dibuat: 2026-10-19 (Siklus Abadi putaran 9)

-- EXP-AGA-152: Zakat Fitrah: Ketentuan dan Waktu
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('b1b1b1b1-0002-4000-8000-000000000002', 'EXP-AGA-152', 'b8888888-8888-8888-8888-888888888888', 'Zakat Fitrah: Ketentuan dan Waktu', 'zakat-fitrah-ketentuan-waktu', 'Zakat fitrah wajib bagi setiap muslim: besaran 1 sha, waktu terbaik, dan siapa penerimanya.', 'id', 7, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-AGA-152';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
    (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', 'Siapa yang Wajib')),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 1, jsonb_build_object('text', $txt$Setiap muslim, laki-laki maupun perempuan, dewasa maupun anak, wajib membayar zakat fitrah. Dibayarkan oleh kepala keluarga untuk seluruh tanggungannya.$txt$)),
    (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', 'Besaran')),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 3, jsonb_build_object('text', $txt$Besaran: 1 sha' makanan pokok (sekitar 2,5 kg beras di Indonesia) atau senilai uangnya. Dibayarkan sekali setahun di bulan Ramadan.$txt$)),
    (gen_random_uuid(), v_id, 'HEADING', 4, jsonb_build_object('text', 'Waktu Terbaik')),
    (gen_random_uuid(), v_id, 'LIST', 5, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Terbaik: pagi hari sebelum salat Idul Fitri$li$,
      $li$Boleh: sejak awal Ramadan$li$,
      $li$Makruh: setelah salat Id hingga sebelum magrib$li$,
      $li$Haram: melewati hari raya tanpa uzur$li$
    ]))),
    (gen_random_uuid(), v_id, 'HEADING', 6, jsonb_build_object('text', 'Penerima')),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 7, jsonb_build_object('text', $txt$Disalurkan kepada 8 asnaf, diutamakan fakir dan miskin di lingkungan terdekat. Bisa via amil/masjid terpercaya.$txt$));
END $doblk$;

-- EXP-AGA-153: Adab Bertamu dalam Islam
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('b1b1b1b1-0003-4000-8000-000000000003', 'EXP-AGA-153', 'b8888888-8888-8888-8888-888888888888', 'Adab Bertamu dalam Islam', 'adab-bertamu-dalam-islam', 'Tata krama bertamu: izin, salam, waktu yang tepat, dan menjaga pandangan.', 'id', 6, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-AGA-153';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
    (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', 'Minta Izin Dulu')),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 1, jsonb_build_object('text', $txt$Jangan masuk rumah orang tanpa izin. Ucapkan salam dan minta izin maksimal 3 kali; jika tak dijawab, pulanglah dengan lapang dada (QS An-Nur: 27-28).$txt$)),
    (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', 'Waktu yang Tepat')),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 3, jsonb_build_object('text', $txt$Hindari waktu istirahat (tengah malam, waktu salat). Beri kabar dulu via telepon/pesan agar tuan rumah siap.$txt$)),
    (gen_random_uuid(), v_id, 'HEADING', 4, jsonb_build_object('text', 'Di Dalam Rumah')),
    (gen_random_uuid(), v_id, 'LIST', 5, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Jaga pandangan, jangan mengintip ke ruang pribadi$li$,
      $li$Duduk di tempat yang dipersilakan$li$,
      $li$Jangan berlama-lama hingga memberatkan tuan rumah$li$,
      $li$Ucapkan terima kasih dan doakan kebaikan$li$
    ])));
END $doblk$;
