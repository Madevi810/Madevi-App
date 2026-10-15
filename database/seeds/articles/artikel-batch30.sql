-- Artikel konten Madevi batch 30 — 2026-10-13
-- Owner principal: f7125028-187e-44e0-b95b-88b69b8d5c9a
-- Idempotent: ON CONFLICT DO NOTHING

-- ============ 1. TUT-RUMAH2-001 ============
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, status, created_by, updated_by)
VALUES ('e4000001-0000-0000-0000-000000000001', 'TUT-RUMAH2-001', 'b7777777-7777-7777-7777-777777777777',
'Renovasi Rumah: Menyusun Rencana Anggaran yang Realistis', 'renovasi-rumah-rencana-anggaran',
'Panduan menyusun rencana anggaran renovasi rumah: dari survei kebutuhan, estimasi biaya material dan tukang, hingga cadangan dana tak terduga.',
'id', 9, 'DRAFT', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (id) DO NOTHING;

INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
(gen_random_uuid(), 'e4000001-0000-0000-0000-000000000001', 'HEADING', 1, jsonb_build_object('text', $$Masalah: Renovasi Membengkak Tanpa Rencana$$)),
(gen_random_uuid(), 'e4000001-0000-0000-0000-000000000001', 'PARAGRAPH', 2, jsonb_build_object('text', $$Banyak renovasi rumah berhenti di tengah jalan karena dana habis sebelum pekerjaan selesai. Penyebab utamanya bukan harga material yang naik, melainkan tidak adanya rencana anggaran tertulis sejak awal. Tanpa RAB (Rencana Anggaran Biaya), setiap keputusan dibeli secara impulsif dan biaya membengkak 30-50 persen dari perkiraan awal.$$)),
(gen_random_uuid(), 'e4000001-0000-0000-0000-000000000001', 'HEADING', 3, jsonb_build_object('text', $$Penjelasan: Struktur Biaya Renovasi$$)),
(gen_random_uuid(), 'e4000001-0000-0000-0000-000000000001', 'PARAGRAPH', 4, jsonb_build_object('text', $$Biaya renovasi terdiri dari empat komponen: material (40-50 persen), jasa tukang (25-35 persen), biaya tak terduga (10-15 persen), dan biaya perizinan serta administrasi (5 persen). Material dibagi lagi menjadi struktural (semen, besi, bata), finishing (cat, keramik, plafon), dan instalasi (listrik, pipa). Memahami proporsi ini membuat Anda bisa memangkas di pos yang tepat tanpa mengorbankan kualitas struktur.$$)),
(gen_random_uuid(), 'e4000001-0000-0000-0000-000000000001', 'HEADING', 5, jsonb_build_object('text', $$Alat dan Persiapan$$)),
(gen_random_uuid(), 'e4000001-0000-0000-0000-000000000001', 'LIST', 6, jsonb_build_object('items', ARRAY[$$Meteran dan kertas gambar denah$$, $$Kalkulator atau spreadsheet RAB$$, $$Daftar harga material dari minimal 3 toko bangunan$$, $$Contoh kontrak kerja tukang (borongan vs harian)$$])),
(gen_random_uuid(), 'e4000001-0000-0000-0000-000000000001', 'HEADING', 7, jsonb_build_object('text', $$Langkah Menyusun RAB$$)),
(gen_random_uuid(), 'e4000001-0000-0000-0000-000000000001', 'LIST', 8, jsonb_build_object('items', ARRAY[$$1. Ukur dan gambar denah area yang direnovasi, catat luas dalam meter persegi$$, $$2. Daftar semua pekerjaan per item (bongkar, pasang bata, plester, cat, instalasi)$$, $$3. Untuk tiap item, tulis volume, harga satuan material, dan harga satuan jasa$$, $$4. Kalikan volume dengan harga satuan, jumlahkan menjadi subtotal per item$$, $$5. Tambahkan cadangan 10-15 persen untuk biaya tak terduga$$, $$6. Bandingkan total dengan dana yang tersedia; jika lebih, pangkas di pos finishing dulu, bukan struktur$$])),
(gen_random_uuid(), 'e4000001-0000-0000-0000-000000000001', 'HEADING', 9, jsonb_build_object('text', $$Risiko$$)),
(gen_random_uuid(), 'e4000001-0000-0000-0000-000000000001', 'PARAGRAPH', 10, jsonb_build_object('text', $$Jangan pernah membayar tukang 100 persen di muka — maksimal 30 persen sebagai uang muka dengan kwitansi. Waspadai penawaran harga jauh di bawah pasar karena sering berujung pada material oplosan atau pekerjaan mangkir. Renovasi struktural (tambah lantai, geser dinding penyangga) wajib dikonsultasikan ke ahli, bukan sekadar tukang.$$)),
(gen_random_uuid(), 'e4000001-0000-0000-0000-000000000001', 'HEADING', 11, jsonb_build_object('text', $$Penyelesaian$$)),
(gen_random_uuid(), 'e4000001-0000-0000-0000-000000000001', 'PARAGRAPH', 12, jsonb_build_object('text', $$Dengan RAB tertulis, Anda bisa menegosiasikan harga per item, memantau progres mingguan, dan tahu persis kapan dana cadangan boleh dipakai. Renovasi kecil (satu kamar) umumnya selesai dalam 2-4 minggu dengan anggaran Rp15-40 juta tergantung finishing. Simpan semua nota dan foto progres sebagai bukti jika terjadi sengketa.$$))
ON CONFLICT (id) DO NOTHING;

-- ============ 2. TUT-KULIAH-001 ============
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, status, created_by, updated_by)
VALUES ('e4000002-0000-0000-0000-000000000002', 'TUT-KULIAH-001', 'b6666666-6666-6666-6666-666666666666',
'Memilih Jurusan Kuliah yang Tepat: Panduan Anti Salah Jurusan', 'memilih-jurusan-kuliah-yang-tepat',
'Cara memilih jurusan kuliah yang sesuai minat, kemampuan, dan prospek kerja: kenali diri, riset kampus, dan hindari jebakan ikut-ikutan teman.',
'id', 8, 'DRAFT', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (id) DO NOTHING;

INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
(gen_random_uuid(), 'e4000002-0000-0000-0000-000000000002', 'HEADING', 1, jsonb_build_object('text', $$Masalah: Takut Salah Jurusan$$)),
(gen_random_uuid(), 'e4000002-0000-0000-0000-000000000002', 'PARAGRAPH', 2, jsonb_build_object('text', $$Salah jurusan adalah salah satu penyesalan terbesar mahasiswa Indonesia — kuliah terasa berat, nilai jeblok, dan lulus tanpa arah karier. Akar masalahnya: memilih jurusan karena ikut teman, gengsi nama kampus, atau tekanan orang tua, bukan karena pemahaman tentang diri sendiri dan isi jurusannya.$$)),
(gen_random_uuid(), 'e4000002-0000-0000-0000-000000000002', 'HEADING', 3, jsonb_build_object('text', $$Penjelasan: Tiga Pilar Pilihan Tepat$$)),
(gen_random_uuid(), 'e4000002-0000-0000-0000-000000000002', 'PARAGRAPH', 4, jsonb_build_object('text', $$Jurusan yang tepat berdiri di atas tiga pilar: minat (apa yang Anda sukai berjam-jam tanpa bosan), kemampuan (mata pelajaran apa yang nilai Anda konsisten bagus), dan prospek (pekerjaan apa yang tersedia dan tumbuh 5-10 tahun ke depan). Jurusan ideal adalah irisan ketiganya. Jika hanya mengejar prospek tanpa minat, Anda akan kelelahan di tengah jalan; jika hanya minat tanpa prospek, Anda perlu strategi karier yang lebih kreatif.$$)),
(gen_random_uuid(), 'e4000002-0000-0000-0000-000000000002', 'HEADING', 5, jsonb_build_object('text', $$Alat dan Persiapan$$)),
(gen_random_uuid(), 'e4000002-0000-0000-0000-000000000002', 'LIST', 6, jsonb_build_object('items', ARRAY[$$Hasil rapor 3 tahun terakhir (lihat pola nilai, bukan sekadar rata-rata)$$, $$Tes minat bakat (bisa dari BK sekolah atau tes online terstandar)$$, $$Daftar 10 jurusan incaran beserta kurikulumnya dari situs resmi kampus$$, $$Kontak 2-3 kakak tingkat atau alumni tiap jurusan incaran$$])),
(gen_random_uuid(), 'e4000002-0000-0000-0000-000000000002', 'HEADING', 7, jsonb_build_object('text', $$Langkah Memilih$$)),
(gen_random_uuid(), 'e4000002-0000-0000-0000-000000000002', 'LIST', 8, jsonb_build_object('items', ARRAY[$$1. Petakan minat: tulis 5 aktivitas yang membuat Anda lupa waktu$$, $$2. Petakan kemampuan: mata pelajaran apa yang Anda kuasai dengan usaha wajar$$, $$3. Riset 5-10 jurusan: baca kurikulum semester 1-8, bukan sekadar nama jurusannya$$, $$4. Wawancarai alumni: tanya pekerjaan sehari-hari lulusan, bukan sekadar gaji$$, $$5. Cek akreditasi program studi dan biaya total sampai lulus$$, $$6. Buat peringkat 3 jurusan: pilihan utama, cadangan realistis, dan cadangan aman$$])),
(gen_random_uuid(), 'e4000002-0000-0000-0000-000000000002', 'HEADING', 9, jsonb_build_object('text', $$Risiko$$)),
(gen_random_uuid(), 'e4000002-0000-0000-0000-000000000002', 'PARAGRAPH', 10, jsonb_build_object('text', $$Jangan memilih jurusan hanya karena passing grade-nya rendah (mudah masuk belum tentu mudah lulus dan bekerja). Jangan pula memilih kampus dulu baru jurusan — jurusan menentukan 4 tahun hidup Anda, nama kampus hanya salah satu faktor. Waspadai jurusan yang kurikulumnya tidak Anda pahami: jika membaca daftar mata kuliahnya saja sudah membuat Anda mengantuk, itu sinyal kuat.$$)),
(gen_random_uuid(), 'e4000002-0000-0000-0000-000000000002', 'HEADING', 11, jsonb_build_object('text', $$Penyelesaian$$)),
(gen_random_uuid(), 'e4000002-0000-0000-0000-000000000002', 'PARAGRAPH', 12, jsonb_build_object('text', $$Keputusan final idealnya dibuat 6 bulan sebelum pendaftaran, memberi waktu untuk persiapan ujian masuk. Ingat: tidak ada jurusan yang 100 persen menjamin sukses — yang ada adalah jurusan yang membuat Anda cukup bertahan dan berkembang selama 4 tahun. Jika terlanjur salah jurusan di semester awal, pindah jurusan di tahun pertama jauh lebih murah daripada memaksakan sampai lulus.$$))
ON CONFLICT (id) DO NOTHING;

-- ============ 3. EXP-SENI-001 ============
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, status, created_by, updated_by)
VALUES ('e4000003-0000-0000-0000-000000000003', 'EXP-SENI-001', 'c8888888-8888-8888-8888-888888888888',
'Batik: Warisan Budaya Dunia dari Indonesia', 'batik-warisan-budaya-dunia-indonesia',
'Mengenal batik: sejarah, teknik pembuatan tulis dan cap, makna motif, hingga pengakuan UNESCO sebagai Warisan Budaya Takbenda.',
'id', 7, 'DRAFT', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (id) DO NOTHING;

INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
(gen_random_uuid(), 'e4000003-0000-0000-0000-000000000003', 'HEADING', 1, jsonb_build_object('text', $$Apa Itu Batik$$)),
(gen_random_uuid(), 'e4000003-0000-0000-0000-000000000003', 'PARAGRAPH', 2, jsonb_build_object('text', $$Batik adalah teknik menghias kain dengan malam (lilin) sebagai perintang warna. Kata batik berasal dari bahasa Jawa: amba (menulis) dan titik. Berbeda dengan kain bermotif cetak biasa, setiap helai batik tulis dikerjakan dengan tangan menggunakan canting, sehingga tidak ada dua helai yang persis sama. Pada 2 Oktober 2009, UNESCO menetapkan batik Indonesia sebagai Warisan Budaya Takbenda Dunia.$$)),
(gen_random_uuid(), 'e4000003-0000-0000-0000-000000000003', 'HEADING', 3, jsonb_build_object('text', $$Sejarah Singkat$$)),
(gen_random_uuid(), 'e4000003-0000-0000-0000-000000000003', 'PARAGRAPH', 4, jsonb_build_object('text', $$Batik berkembang pesat di keraton-keraton Jawa (Surakarta, Yogyakarta) sejak abad ke-17, awalnya sebagai busana bangsawan dengan motif yang diatur ketat maknanya. Motif parang misalnya hanya boleh dipakai kalangan tertentu. Seiring waktu, batik menyebar ke pesisir (Pekalongan, Cirebon, Lasem) yang menyerap pengaruh Tionghoa, Arab, dan Eropa, menghasilkan warna-warna cerah berbeda dari batik keraton yang cenderung sogan (cokelat kehitaman).$$)),
(gen_random_uuid(), 'e4000003-0000-0000-0000-000000000003', 'HEADING', 5, jsonb_build_object('text', $$Teknik Pembuatan$$)),
(gen_random_uuid(), 'e4000003-0000-0000-0000-000000000003', 'PARAGRAPH', 6, jsonb_build_object('text', $$Ada tiga teknik utama. Batik tulis: malam panas dilukis dengan canting mengikuti pola — paling halus dan mahal, sehelai kain bisa memakan waktu berminggu-minggu. Batik cap: pola dicetak dengan cap tembaga — lebih cepat dan terjangkau. Batik printing: motif dicetak mesin — secara teknis bukan batik menurut pakem UNESCO karena tanpa malam, meski di pasaran sering disebut batik. Proses pewarnaan batik tulis bisa diulang 5-10 kali untuk menghasilkan gradasi warna yang dalam.$$)),
(gen_random_uuid(), 'e4000003-0000-0000-0000-000000000003', 'HEADING', 7, jsonb_build_object('text', $$Makna Motif$$)),
(gen_random_uuid(), 'e4000003-0000-0000-0000-000000000003', 'PARAGRAPH', 8, jsonb_build_object('text', $$Setiap motif batik klasik mengandung filosofi. Kawung melambangkan keadilan dan umur panjang. Mega mendung dari Cirebon menggambarkan ketenangan setelah mendung kehidupan. Truntum bermakna cinta yang tumbuh tanpa henti. Memahami makna motif mengubah batik dari sekadar kain menjadi teks budaya yang bisa dibaca.$$)),
(gen_random_uuid(), 'e4000003-0000-0000-0000-000000000003', 'HEADING', 9, jsonb_build_object('text', $$Batik Hari Ini$$)),
(gen_random_uuid(), 'e4000003-0000-0000-0000-000000000003', 'PARAGRAPH', 10, jsonb_build_object('text', $$Batik kini dipakai dalam diplomasi (hadiah kenegaraan), fashion global, dan ditetapkan sebagai pakaian resmi setiap Jumat di banyak instansi Indonesia. Tantangannya: regenerasi pembatik tulis yang semakin sedikit dan membanjirnya tekstil printing murah. Melestarikan batik berarti menghargai prosesnya — membeli batik tulis asli sama dengan menghidupi rantai perajin dari petani kapas hingga pewarna alam.$$))
ON CONFLICT (id) DO NOTHING;

-- ============ 4. EXP-FISIKA5-001 ============
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, status, created_by, updated_by)
VALUES ('e4000004-0000-0000-0000-000000000004', 'EXP-FISIKA5-001', 'c3333333-3333-3333-3333-333333333333',
'Termodinamika: Hukum Kekekalan Energi dan Mesin Panas', 'termodinamika-hukum-kekekalan-energi',
'Memahami termodinamika: hukum kekekalan energi, entropi, dan cara kerja mesin panas dari mesin uap hingga kulkas.',
'id', 7, 'DRAFT', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (id) DO NOTHING;

INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
(gen_random_uuid(), 'e4000004-0000-0000-0000-000000000004', 'HEADING', 1, jsonb_build_object('text', $$Apa Itu Termodinamika$$)),
(gen_random_uuid(), 'e4000004-0000-0000-0000-000000000004', 'PARAGRAPH', 2, jsonb_build_object('text', $$Termodinamika adalah cabang fisika yang mempelajari hubungan antara panas, kerja, dan energi. Lahir dari kebutuhan praktis abad ke-19 — membuat mesin uap lebih efisien — termodinamika kini menjadi fondasi pemahaman tentang mengapa proses alam berjalan ke satu arah dan mengapa tidak ada mesin yang 100 persen efisien.$$)),
(gen_random_uuid(), 'e4000004-0000-0000-0000-000000000004', 'HEADING', 3, jsonb_build_object('text', $$Hukum Pertama: Kekekalan Energi$$)),
(gen_random_uuid(), 'e4000004-0000-0000-0000-000000000004', 'PARAGRAPH', 4, jsonb_build_object('text', $$Hukum pertama menyatakan energi tidak dapat diciptakan atau dimusnahkan, hanya berubah bentuk. Secara matematis: perubahan energi dalam sistem sama dengan panas yang masuk dikurangi kerja yang dilakukan sistem. Ketika bensin terbakar di mesin mobil, energi kimia berubah menjadi panas, lalu sebagian menjadi kerja menggerakkan piston dan sisanya terbuang sebagai panas knalpot. Totalnya tetap sama — tidak ada yang hilang, hanya berpindah bentuk.$$)),
(gen_random_uuid(), 'e4000004-0000-0000-0000-000000000004', 'HEADING', 5, jsonb_build_object('text', $$Hukum Kedua: Entropi Selalu Naik$$)),
(gen_random_uuid(), 'e4000004-0000-0000-0000-000000000004', 'PARAGRAPH', 6, jsonb_build_object('text', $$Hukum kedua jauh lebih dalam: dalam sistem terisolasi, entropi (ukuran ketidakteraturan) selalu meningkat. Inilah alasan kopi panas mendingin sendiri tetapi kopi dingin tidak pernah memanas sendiri, dan alasan tidak ada mesin abadi. Setiap konversi energi selalu menghasilkan sebagian energi yang tidak bisa dipakai lagi — biasanya sebagai panas buangan. Efisiensi maksimum mesin panas dibatasi oleh suhu reservoir panas dan dinginnya, bukan oleh kecanggihan teknologinya.$$)),
(gen_random_uuid(), 'e4000004-0000-0000-0000-000000000004', 'HEADING', 7, jsonb_build_object('text', $$Mesin Panas dalam Kehidupan$$)),
(gen_random_uuid(), 'e4000004-0000-0000-0000-000000000004', 'PARAGRAPH', 8, jsonb_build_object('text', $$Mesin mobil bensin memiliki efisiensi sekitar 25-30 persen — 70 persen energi bensin terbuang sebagai panas. Pembangkit listrik tenaga uap mencapai 35-45 persen. Kulkas dan AC adalah mesin panas yang dibalik: memakai kerja listrik untuk memindahkan panas dari dalam ke luar. Memahami batas efisiensi ini penting agar tidak tertipu klaim produk hemat energi yang melanggar hukum fisika.$$)),
(gen_random_uuid(), 'e4000004-0000-0000-0000-000000000004', 'HEADING', 9, jsonb_build_object('text', $$Mengapa Ini Penting$$)),
(gen_random_uuid(), 'e4000004-0000-0000-0000-000000000004', 'PARAGRAPH', 10, jsonb_build_object('text', $$Termodinamika menjelaskan batas-batas fundamental teknologi energi: mengapa panel surya punya batas efisiensi teoritis, mengapa baterai selalu menghasilkan panas saat diisi cepat, dan mengapa alam semesta menuju keadaan setimbang panas. Dari dapur hingga bintang, hukum yang sama berlaku — energi kekal, tetapi kegunaannya selalu menurun.$$))
ON CONFLICT (id) DO NOTHING;

-- ============ 5. SCH-SMP-BIO3-001 ============
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, status, created_by, updated_by)
VALUES ('e4000005-0000-0000-0000-000000000005', 'SCH-SMP-BIO3-001', 'd4444444-4444-4444-4444-444444444444',
'IPA Kelas 9: Pewarisan Sifat Makhluk Hidup', 'ipa-kelas-9-pewarisan-sifat',
'Materi IPA kelas 9 SMP: kromosom, gen, DNA, Hukum Mendel, dan cara menentukan persilangan monohibrid dengan tabel Punnett.',
'id', 9, 'DRAFT', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (id) DO NOTHING;

INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
(gen_random_uuid(), 'e4000005-0000-0000-0000-000000000005', 'HEADING', 1, jsonb_build_object('text', $$Tujuan Pembelajaran$$)),
(gen_random_uuid(), 'e4000005-0000-0000-0000-000000000005', 'PARAGRAPH', 2, jsonb_build_object('text', $$Setelah mempelajari materi ini, kamu diharapkan mampu menjelaskan hubungan kromosom, gen, dan DNA; membedakan sifat dominan dan resesif; serta menentukan hasil persilangan monohibrid menggunakan tabel Punnett.$$)),
(gen_random_uuid(), 'e4000005-0000-0000-0000-000000000005', 'HEADING', 3, jsonb_build_object('text', $$Kromosom, Gen, dan DNA$$)),
(gen_random_uuid(), 'e4000005-0000-0000-0000-000000000005', 'PARAGRAPH', 4, jsonb_build_object('text', $$DNA adalah molekul pembawa informasi sifat yang tersimpan dalam inti sel. DNA yang sangat panjang dipadatkan menjadi struktur bernama kromosom — manusia memiliki 46 kromosom (23 pasang). Gen adalah segmen DNA pada kromosom yang menentukan satu sifat tertentu, misalnya warna mata. Setiap individu mewarisi satu salinan gen dari ayah dan satu dari ibu, sehingga setiap sifat ditentukan oleh sepasang alel (bentuk alternatif gen).$$)),
(gen_random_uuid(), 'e4000005-0000-0000-0000-000000000005', 'HEADING', 5, jsonb_build_object('text', $$Dominan dan Resesif$$)),
(gen_random_uuid(), 'e4000005-0000-0000-0000-000000000005', 'PARAGRAPH', 6, jsonb_build_object('text', $$Alel dominan (ditulis huruf besar, misal B) akan menutupi alel resesif (huruf kecil, misal b). Individu bergenotipe BB atau Bb akan menunjukkan sifat dominan, sedangkan hanya bb yang menunjukkan sifat resesif. Contoh: pada tanaman kacang ercis Mendel, bunga ungu (B) dominan terhadap bunga putih (b). Inilah Hukum I Mendel tentang segregasi — pasangan alel berpisah saat pembentukan gamet.$$)),
(gen_random_uuid(), 'e4000005-0000-0000-0000-000000000005', 'HEADING', 7, jsonb_build_object('text', $$Contoh: Tabel Punnett$$)),
(gen_random_uuid(), 'e4000005-0000-0000-0000-000000000005', 'PARAGRAPH', 8, jsonb_build_object('text', $$Persilangan Bb x Bb: setiap induk menghasilkan gamet B dan b. Tabel Punnett 2x2 menghasilkan BB (1), Bb (2), bb (1). Jadi perbandingan genotipe 1:2:1 dan fenotipe 3 ungu : 1 putih. Langkahnya: (1) tulis genotipe induk, (2) tentukan gamet masing-masing, (3) isi kotak tabel, (4) hitung perbandingan genotipe dan fenotipe.$$)),
(gen_random_uuid(), 'e4000005-0000-0000-0000-000000000005', 'HEADING', 9, jsonb_build_object('text', $$Latihan Soal$$)),
(gen_random_uuid(), 'e4000005-0000-0000-0000-000000000005', 'LIST', 10, jsonb_build_object('items', ARRAY[$$1. Rambut keriting (K) dominan terhadap rambut lurus (k). Tentukan fenotipe anak dari perkawinan Kk x kk.$$ , $$2. Pada marmut, bulu hitam (H) dominan terhadap bulu putih (h). Jika dua marmut heterozigot dikawinkan, berapa persen anak berbulu putih?$$, $$3. Jelaskan perbedaan genotipe dan fenotipe dengan contohmu sendiri.$$])),
(gen_random_uuid(), 'e4000005-0000-0000-0000-000000000005', 'HEADING', 11, jsonb_build_object('text', $$Kunci Jawaban$$)),
(gen_random_uuid(), 'e4000005-0000-0000-0000-000000000005', 'LIST', 12, jsonb_build_object('items', ARRAY[$$1. Gamet: K,k dari ayah dan k dari ibu. Hasil: Kk (keriting) 50 persen, kk (lurus) 50 persen.$$ , $$2. Hh x Hh menghasilkan HH, Hh, Hh, hh. Anak berbulu putih (hh) = 1 dari 4 = 25 persen.$$ , $$3. Genotipe adalah susunan gen (misal Bb), fenotipe adalah sifat yang tampak (misal bunga ungu). Individu BB dan Bb memiliki fenotipe sama tetapi genotipe berbeda.$$]))
ON CONFLICT (id) DO NOTHING;

-- ============ 6. SCH-SD-BIN5-001 ============
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, status, created_by, updated_by)
VALUES ('e4000006-0000-0000-0000-000000000006', 'SCH-SD-BIN5-001', 'd1000002-0000-0000-0000-000000000002',
'Bahasa Indonesia Kelas 2: Membaca Puisi Anak', 'bahasa-indonesia-kelas-2-membaca-puisi',
'Materi bahasa Indonesia kelas 2 SD: mengenal puisi anak, membaca dengan lafal dan intonasi yang tepat, serta memahami isi puisi sederhana.',
'id', 7, 'DRAFT', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (id) DO NOTHING;

INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
(gen_random_uuid(), 'e4000006-0000-0000-0000-000000000006', 'HEADING', 1, jsonb_build_object('text', $$Tujuan Pembelajaran$$)),
(gen_random_uuid(), 'e4000006-0000-0000-0000-000000000006', 'PARAGRAPH', 2, jsonb_build_object('text', $$Setelah belajar materi ini, kamu bisa menjelaskan apa itu puisi anak, membaca puisi dengan lafal yang jelas dan intonasi yang tepat, serta menyebutkan isi puisi yang kamu baca.$$)),
(gen_random_uuid(), 'e4000006-0000-0000-0000-000000000006', 'HEADING', 3, jsonb_build_object('text', $$Apa Itu Puisi Anak$$)),
(gen_random_uuid(), 'e4000006-0000-0000-0000-000000000006', 'PARAGRAPH', 4, jsonb_build_object('text', $$Puisi adalah karangan yang bahasanya indah dan disusun dalam baris-baris yang disebut bait. Puisi anak berisi hal-hal yang dekat dengan dunia anak: keluarga, sekolah, hewan, dan alam. Berbeda dengan cerita yang panjang, puisi menyampaikan perasaan dengan kata-kata yang singkat tetapi bermakna.$$)),
(gen_random_uuid(), 'e4000006-0000-0000-0000-000000000006', 'HEADING', 5, jsonb_build_object('text', $$Contoh Puisi$$)),
(gen_random_uuid(), 'e4000006-0000-0000-0000-000000000006', 'PARAGRAPH', 6, jsonb_build_object('text', $$Bacalah puisi ini dengan suara yang jelas: "Ibuku / Pagi hari ibu memasak / Siang hari ibu menjahit / Malam hari ibu meninabobokan aku / Terima kasih ibuku sayang". Perhatikan tanda baca: berhenti sejenak di akhir baris, dan turunkan suaramu di akhir bait.$$)),
(gen_random_uuid(), 'e4000006-0000-0000-0000-000000000006', 'HEADING', 7, jsonb_build_object('text', $$Cara Membaca Puisi yang Baik$$)),
(gen_random_uuid(), 'e4000006-0000-0000-0000-000000000006', 'LIST', 8, jsonb_build_object('items', ARRAY[$$Berdiri tegak dan pegang teks dengan mantap$$, $$Ucapkan setiap kata dengan jelas (lafal)$$, $$Naik-turunkan suaramu mengikuti isi puisi (intonasi)$$, $$Tunjukkan perasaanmu lewat wajahmu (ekspresi)$$])),
(gen_random_uuid(), 'e4000006-0000-0000-0000-000000000006', 'HEADING', 9, jsonb_build_object('text', $$Memahami Isi Puisi$$)),
(gen_random_uuid(), 'e4000006-0000-0000-0000-000000000006', 'PARAGRAPH', 10, jsonb_build_object('text', $$Setelah membaca, tanyakan pada dirimu: tentang siapakah puisi itu? Apa yang dilakukan tokohnya? Bagaimana perasaan penyairnya? Pada contoh puisi di atas, puisinya tentang ibu, kegiatannya dari pagi sampai malam, dan perasaan penyairnya adalah sayang dan berterima kasih.$$)),
(gen_random_uuid(), 'e4000006-0000-0000-0000-000000000006', 'HEADING', 11, jsonb_build_object('text', $$Latihan$$)),
(gen_random_uuid(), 'e4000006-0000-0000-0000-000000000006', 'LIST', 12, jsonb_build_object('items', ARRAY[$$1. Bacakan puisi "Ibuku" di depan kelas dengan lafal dan intonasi yang tepat.$$ , $$2. Sebutkan 3 kegiatan ibu dalam puisi tersebut.$$ , $$3. Buatlah 2 baris puisi tentang ayahmu sendiri.$$]))
ON CONFLICT (id) DO NOTHING;
