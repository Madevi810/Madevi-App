-- Batch 135: 9 artikel Matematika tambahan (idempoten)
-- Dibuat: 2026-10-19 (Fase 4, Explore)

-- EXP-MTK-135: Aljabar Dasar: Variabel dan Persamaan
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('f2f2f2f2-0001-4000-8000-000000000001', 'EXP-MTK-135', 'b8888888-8888-8888-8888-888888888888', 'Aljabar Dasar: Variabel dan Persamaan', 'aljabar-dasar-variabel-persamaan', 'Pengertian variabel, koefisien, konstanta — dan cara menyelesaikan persamaan linear satu variabel.', 'id', 7, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-MTK-135';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 0, jsonb_build_object('text', $txt$Variabel adalah simbol (biasanya huruf) untuk bilangan yang belum diketahui. Dalam 3x + 5: x = variabel, 3 = koefisien, 5 = konstanta. Persamaan linear satu variabel diselesaikan dengan operasi invers: 3x + 5 = 20 → 3x = 15 → x = 5.$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'LIST', 1, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Pindahkan ruas: + menjadi -, x menjadi : (dan sebaliknya)$li$,
      $li$Contoh: 2x - 7 = 9 → 2x = 16 → x = 8$li$,
      $li$Cek: masukkan kembali x ke persamaan awal$li$
  ])));
END $doblk$;

-- EXP-MTK-136: Perbandingan: Senilai dan Berbalik Nilai
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('f2f2f2f2-0002-4000-8000-000000000002', 'EXP-MTK-136', 'b8888888-8888-8888-8888-888888888888', 'Perbandingan: Senilai dan Berbalik Nilai', 'perbandingan-senilai-berbalik-nilai', 'Dua jenis perbandingan dengan contoh nyata: resep masakan vs pekerja dan waktu.', 'id', 6, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-MTK-136';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'LIST', 0, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Senilai: keduanya naik/turun bersama. Contoh: 2 kg beras Rp24rb → 5 kg = Rp60rb. Rumus: a1/b1 = a2/b2$li$,
      $li$Berbalik nilai: satu naik, satu turun. Contoh: 6 pekerja 12 hari → 9 pekerja = 8 hari. Rumus: a1×b1 = a2×b2$li$,
      $li$Trik: tanya "makin banyak X, makin banyak/banyak berkurang Y?"$li$
  ])));
END $doblk$;

-- EXP-MTK-137: Bangun Ruang: Volume dan Luas Permukaan
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('f2f2f2f2-0003-4000-8000-000000000003', 'EXP-MTK-137', 'b8888888-8888-8888-8888-888888888888', 'Bangun Ruang: Volume dan Luas Permukaan', 'bangun-ruang-volume-luas', 'Rumus volume dan luas permukaan kubus, balok, tabung, kerucut, bola, prisma, limas.', 'id', 8, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-MTK-137';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'LIST', 0, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Kubus: V = s³; LP = 6s²$li$,
      $li$Balok: V = p×l×t; LP = 2(pl+pt+lt)$li$,
      $li$Tabung: V = πr²t; LP = 2πr(r+t)$li$,
      $li$Kerucut: V = ⅓πr²t$li$,
      $li$Bola: V = ⁴/₃πr³; LP = 4πr²$li$,
      $li$Prisma: V = luas alas × tinggi$li$,
      $li$Limas: V = ⅓ × luas alas × tinggi$li$
  ])));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 1, jsonb_build_object('text', $txt$Contoh: tandon air tabung diameter 1 m, tinggi 1,5 m. Jari-jari 0,5 m. V = 3,14 × 0,25 × 1,5 = 1,1775 m³ ≈ 1.178 liter.$txt$));
END $doblk$;

-- EXP-MTK-138: Statistika Dasar: Mean, Median, Modus
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('f2f2f2f2-0004-4000-8000-000000000004', 'EXP-MTK-138', 'b8888888-8888-8888-8888-888888888888', 'Statistika Dasar: Mean, Median, Modus', 'statistika-mean-median-modus', 'Tiga ukuran pemusatan data dengan contoh nilai ujian — plus kapan memakai masing-masing.', 'id', 6, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-MTK-138';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 0, jsonb_build_object('text', $txt$Data nilai: 6, 7, 7, 8, 9. Mean (rata-rata) = jumlah/n = 37/5 = 7,4. Median (tengah setelah diurutkan) = 7. Modus (paling sering) = 7.$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'LIST', 1, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Mean: sensitif terhadap pencilan (satu nilai 100 mengubah rata-rata drastis)$li$,
      $li$Median: aman dari pencilan — dipakai untuk harga rumah, gaji$li$,
      $li$Modus: untuk data kategori (warna favorit, ukuran baju terlaris)$li$
  ])));
END $doblk$;

-- EXP-MTK-139: Peluang Dasar
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('f2f2f2f2-0005-4000-8000-000000000005', 'EXP-MTK-139', 'b8888888-8888-8888-8888-888888888888', 'Peluang Dasar', 'peluang-dasar', 'Konsep peluang 0-1, dadu, koin, kartu — dan mengapa "hampir pasti" bukan "pasti".', 'id', 6, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-MTK-139';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 0, jsonb_build_object('text', $txt$Peluang = kejadian yang diinginkan / semua kemungkinan. Dadu muncul 6: 1/6. Koin gambar: 1/2. Kartu As dari 52: 4/52 = 1/13. Peluang 0 = mustahil, 1 = pasti.$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 1, jsonb_build_object('text', $txt$Jebakan: koin muncul gambar 5x beruntun TIDAK membuat angka "lebih mungkin" berikutnya — tiap lemparan independen (gambler's fallacy). Peluang dua dadu jumlah 7 = 6/36 = 1/6 (kombinasi terbanyak).$txt$));
END $doblk$;

-- EXP-MTK-140: Fungsi Kuadrat dan Grafiknya
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('f2f2f2f2-0006-4000-8000-000000000006', 'EXP-MTK-140', 'b8888888-8888-8888-8888-888888888888', 'Fungsi Kuadrat dan Grafiknya', 'fungsi-kuadrat-grafik', 'Bentuk umum ax²+bx+c, titik puncak, akar-akar, diskriminan — dengan kaitan ke simulasi Madevi.', 'id', 8, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-MTK-140';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 0, jsonb_build_object('text', $txt$Grafik fungsi kuadrat berbentuk parabola. a>0 terbuka ke atas (titik minimum), a<0 terbuka ke bawah (maksimum). Titik puncak: x = -b/2a. Diskriminan D = b²-4ac menentukan jumlah akar: D>0 dua akar, D=0 satu (kembar), D<0 tidak ada akar real.$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 1, jsonb_build_object('text', $txt$Coba di simulasi grafik fungsi Madevi: geser a, b, c dan amati perubahan bentuk. Contoh: y = x²-4x+3 memiliki akar x=1 dan x=3, titik puncak (2,-1).$txt$));
END $doblk$;

-- EXP-MTK-141: Teorema Pythagoras dan Tripelnya
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('f2f2f2f2-0007-4000-8000-000000000007', 'EXP-MTK-141', 'b8888888-8888-8888-8888-888888888888', 'Teorema Pythagoras dan Tripelnya', 'teorema-pythagoras-tripel', 'a²+b²=c² untuk segitiga siku-siku, tripel Pythagoras populer, dan aplikasi: jarak, diagonal, ketinggian.', 'id', 6, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-MTK-141';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 0, jsonb_build_object('text', $txt$Pada segitiga siku-siku: kuadrat sisi miring = jumlah kuadrat sisi siku-siku. a² + b² = c².$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'LIST', 1, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Tripel populer: (3,4,5), (5,12,13), (8,15,17), (7,24,25), kelipatannya$li$,
      $li$Tangga 5 m bersandar, kaki 3 m dari tembok → tinggi = 4 m$li$,
      $li$Diagonal TV 32 inci dihitung dengan Pythagoras$li$
  ])));
END $doblk$;

-- EXP-MTK-142: Barisan dan Deret Aritmetika-Geometri
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('f2f2f2f2-0008-4000-8000-000000000008', 'EXP-MTK-142', 'b8888888-8888-8888-8888-888888888888', 'Barisan dan Deret Aritmetika-Geometri', 'barisan-deret-aritmetika-geometri', 'Pola bilangan: beda tetap vs rasio tetap, rumus suku ke-n dan jumlah n suku.', 'id', 7, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-MTK-142';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'LIST', 0, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Aritmetika (beda tetap b): Un = a + (n-1)b; Sn = n/2(2a+(n-1)b). Contoh: 2,5,8,11... (b=3)$li$,
      $li$Geometri (rasio tetap r): Un = a·r^(n-1); Sn = a(r^n-1)/(r-1). Contoh: 3,6,12,24... (r=2)$li$,
      $li$Deret geometri tak hingga (|r|<1): S = a/(1-r). Contoh: 1 + 1/2 + 1/4 + ... = 2$li$
  ])));
END $doblk$;

-- EXP-MTK-143: Logika Matematika Sederhana
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('f2f2f2f2-0009-4000-8000-000000000009', 'EXP-MTK-143', 'b8888888-8888-8888-8888-888888888888', 'Logika Matematika Sederhana', 'logika-matematika-sederhana', 'Pernyataan, negasi, konjungsi, disjungsi, implikasi — dan cara menarik kesimpulan yang valid.', 'id', 7, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-MTK-143';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'LIST', 0, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Negasi: "Semua burung bisa terbang" → "Ada burung yang tidak bisa terbang"$li$,
      $li$Implikasi p→q: salah hanya jika p benar q salah. "Jika hujan maka jalan basah"$li$,
      $li$Konvers, invers, kontraposisi: yang ekuivalen dengan p→q hanyalah kontraposisi (~q→~p)$li$,
      $li$Modus ponens: p→q benar, p benar → q benar. Modus tollens: p→q benar, ~q → ~p$li$
  ])));
END $doblk$;
