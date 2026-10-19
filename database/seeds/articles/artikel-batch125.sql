-- Batch 125: 5 artikel Matematika - Aritmetika (idempoten)
-- Dibuat: 2026-10-19 (Fase 4, Explore)

-- EXP-MTK-125: Bilangan Bulat: Operasi dan Sifatnya
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('d4d4d4d4-0001-4000-8000-000000000001', 'EXP-MTK-125', 'b8888888-8888-8888-8888-888888888888', 'Bilangan Bulat: Operasi dan Sifatnya', 'bilangan-bulat-operasi-sifat', 'Operasi bilangan bulat positif dan negatif: penjumlahan, pengurangan, perkalian, pembagian, plus trik garis bilangan.', 'id', 7, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;

DO $doblk$
DECLARE v_id uuid;
BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-MTK-125';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', $txt$Bilangan Positif dan Negatif$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 1, jsonb_build_object('text', $txt$Bilangan bulat mencakup positif (1, 2, 3...), nol, dan negatif (-1, -2, -3...). Dalam kehidupan: suhu di bawah nol, utang, lantai basement — semua memakai bilangan negatif.$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', $txt$Aturan Operasi$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'LIST', 3, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Penjumlahan beda tanda: kurangi, ikuti tanda yang lebih besar. Contoh: 5 + (-3) = 2$li$,
      $li$Pengurangan: ubah jadi penjumlahan lawan. Contoh: 5 - (-3) = 5 + 3 = 8$li$,
      $li$Perkalian/pembagian: sama tanda hasilnya positif, beda tanda negatif. Contoh: (-4) x (-3) = 12; 12 : (-3) = -4$li$
  ])));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 4, jsonb_build_object('text', $txt$Trik Garis Bilangan$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 5, jsonb_build_object('text', $txt$Bayangkan garis bilangan. Penjumlahan = melangkah ke kanan, pengurangan = ke kiri. Dari -2, tambah 5: melangkah 5 ke kanan, sampai di 3. Cara visual ini membantu menghindari salah tanda.$txt$));
END $doblk$;

-- EXP-MTK-126: Pecahan: Dari Konsep hingga Operasi
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('d4d4d4d4-0002-4000-8000-000000000002', 'EXP-MTK-126', 'b8888888-8888-8888-8888-888888888888', 'Pecahan: Dari Konsep hingga Operasi', 'pecahan-konsep-hingga-operasi', 'Memahami pecahan secara visual: senilai, menyederhanakan, penjumlahan, pengurangan, perkalian, pembagian.', 'id', 8, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;

DO $doblk$
DECLARE v_id uuid;
BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-MTK-126';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', $txt$Konsep Dasar$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 1, jsonb_build_object('text', $txt$Pecahan a/b artinya a bagian dari b bagian yang sama besar. Pembilang (atas) = bagian yang diambil; penyebut (bawah) = total bagian. Setengah pizza = 1/2.$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', $txt$Operasi Pecahan$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'LIST', 3, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Penjumlahan/pengurangan: samakan penyebut dulu. 1/3 + 1/6 = 2/6 + 1/6 = 3/6 = 1/2$li$,
      $li$Perkalian: pembilang kali pembilang, penyebut kali penyebut. 2/3 x 3/4 = 6/12 = 1/2$li$,
      $li$Pembagian: balik pecahan kedua lalu kalikan. 1/2 : 1/4 = 1/2 x 4/1 = 2$li$,
      $li$Menyederhanakan: bagi dengan FPB. 6/8 = 3/4 (bagi 2)$li$
  ])));
END $doblk$;

-- EXP-MTK-127: Persen: Hitung Diskon, Untung, dan Bunga
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('d4d4d4d4-0003-4000-8000-000000000003', 'EXP-MTK-127', 'b8888888-8888-8888-8888-888888888888', 'Persen: Hitung Diskon, Untung, dan Bunga', 'persen-diskon-untung-bunga', 'Persen dalam kehidupan: menghitung diskon belanja, keuntungan dagang, dan bunga tabungan dengan cepat.', 'id', 6, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;

DO $doblk$
DECLARE v_id uuid;
BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-MTK-127';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', $txt$Konsep Persen$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 1, jsonb_build_object('text', $txt$Persen artinya per seratus. 25% = 25/100 = 1/4. Untuk menghitung: (persen/100) x nilai. Contoh: 20% dari Rp50.000 = 0,2 x 50.000 = Rp10.000.$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', $txt$Diskon dan Untung$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'LIST', 3, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Diskon 30% untuk baju Rp200.000: bayar 200.000 - 60.000 = Rp140.000$li$,
      $li$Untung 25%: modal Rp80.000, jual 80.000 + 20.000 = Rp100.000$li$,
      $li$Rugi 10%: modal Rp50.000, jual 50.000 - 5.000 = Rp45.000$li$,
      $li$Trik cepat: diskon 20% = bayar 80% = kalikan 0,8$li$
  ])));
END $doblk$;

-- EXP-MTK-128: FPB dan KPK: Cara Cepat dan Kegunaannya
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('d4d4d4d4-0004-4000-8000-000000000004', 'EXP-MTK-128', 'b8888888-8888-8888-8888-888888888888', 'FPB dan KPK: Cara Cepat dan Kegunaannya', 'fpb-kpk-cara-cepat', 'Faktor persekutuan terbesar dan kelipatan persekutuan terkecil: pohon faktor, cara cepat, dan aplikasi nyata.', 'id', 7, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;

DO $doblk$
DECLARE v_id uuid;
BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-MTK-128';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', $txt$Pohon Faktor$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 1, jsonb_build_object('text', $txt$Uraikan bilangan menjadi faktor prima dengan pohon faktor. Contoh: 12 = 2 x 2 x 3; 18 = 2 x 3 x 3. FPB = kalikan faktor yang sama dengan pangkat terkecil: 2 x 3 = 6. KPK = kalikan semua faktor dengan pangkat terbesar: 2^2 x 3^2 = 36.$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', $txt$Kegunaan Nyata$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'LIST', 3, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$FPB: membagi 12 apel dan 18 jeruk ke kantong sama banyak → 6 kantong, tiap isi 2 apel + 3 jeruk$li$,
      $li$KPK: lampu A menyala tiap 4 detik, B tiap 6 detik → menyala bersama tiap 12 detik$li$,
      $li$FPB: menyederhanakan pecahan 12/18 = 2/3 (bagi 6)$li$
  ])));
END $doblk$;

-- EXP-MTK-129: Bangun Datar: Luas dan Keliling
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('d4d4d4d4-0005-4000-8000-000000000005', 'EXP-MTK-129', 'b8888888-8888-8888-8888-888888888888', 'Bangun Datar: Luas dan Keliling', 'bangun-datar-luas-keliling', 'Rumus luas dan keliling 7 bangun datar: persegi, persegi panjang, segitiga, lingkaran, jajar genjang, trapesium, belah ketupat.', 'id', 8, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;

DO $doblk$
DECLARE v_id uuid;
BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-MTK-129';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', $txt$Rumus Lengkap$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'LIST', 1, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Persegi: luas = s x s; keliling = 4s$li$,
      $li$Persegi panjang: luas = p x l; keliling = 2(p+l)$li$,
      $li$Segitiga: luas = 1/2 x a x t; keliling = jumlah ketiga sisi$li$,
      $li$Lingkaran: luas = phi x r^2; keliling = 2 x phi x r (phi = 22/7 atau 3,14)$li$,
      $li$Jajar genjang: luas = a x t; keliling = 2(a+b)$li$,
      $li$Trapesium: luas = 1/2 x (a+b) x t$li$,
      $li$Belah ketupat: luas = 1/2 x d1 x d2$li$
  ])));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', $txt$Contoh$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 3, jsonb_build_object('text', $txt$Kolam lingkaran diameter 14 m: jari-jari 7 m, luas = 22/7 x 7 x 7 = 154 m2. Sawah persegi panjang 100m x 50m: luas 5.000 m2, keliling 300 m (butuh 300 m pagar).$txt$));
END $doblk$;
