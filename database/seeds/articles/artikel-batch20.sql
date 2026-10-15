-- Batch 20 — 2026-10-13
-- Owner: f7125028-187e-44e0-b95b-88b69b8d5c9a

-- ============ 1. TUT-FOTOGRAFI-001 ============
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, status, created_by, updated_by)
VALUES ('7a1f0001-0000-4000-8000-000000000001', 'TUT-FOTOGRAFI-001', 'b9999999-9999-9999-9999-999999999999',
'Fotografi HP: Hasilkan Foto Profesional', 'fotografi-hp-hasilkan-foto-profesional',
'Panduan fotografi dengan HP: komposisi, cahaya, fokus, hingga editing agar hasil setara kamera profesional.',
'id', 8, 'DRAFT', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (id) DO NOTHING;

INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
(gen_random_uuid(), '7a1f0001-0000-4000-8000-000000000001', 'HEADING', 1, jsonb_build_object('text', $$Masalah: Foto HP Biasa Saja$$)),
(gen_random_uuid(), '7a1f0001-0000-4000-8000-000000000001', 'PARAGRAPH', 2, jsonb_build_object('text', $$HP sudah mahal tapi hasil foto tetap biasa: gelap, blur, atau tidak menarik. Masalahnya bukan di HP-nya, melainkan di teknik pengambilan dan pengolahan cahayanya.$$)),
(gen_random_uuid(), '7a1f0001-0000-4000-8000-000000000001', 'HEADING', 3, jsonb_build_object('text', $$Penjelasan: Tiga Pilar Foto Bagus$$)),
(gen_random_uuid(), '7a1f0001-0000-4000-8000-000000000001', 'PARAGRAPH', 4, jsonb_build_object('text', $$Foto bagus ditentukan tiga hal: cahaya (lighting), komposisi (framing), dan momen. Sensor HP kecil, sehingga ia sangat bergantung pada cahaya yang cukup — inilah alasan foto malam hari sering buruk.$$)),
(gen_random_uuid(), '7a1f0001-0000-4000-8000-000000000001', 'HEADING', 5, jsonb_build_object('text', $$Persiapan dan Alat$$)),
(gen_random_uuid(), '7a1f0001-0000-4000-8000-000000000001', 'LIST', 6, jsonb_build_object('items', ARRAY[$$HP dengan mode Pro/Manual$$, $$Kain microfiber untuk membersihkan lensa$$, $$Tripod mini atau tumpuan stabil (opsional)$$, $$Aplikasi edit gratis: Snapseed atau Lightroom Mobile$$])),
(gen_random_uuid(), '7a1f0001-0000-4000-8000-000000000001', 'HEADING', 7, jsonb_build_object('text', $$Langkah Pengambilan Foto$$)),
(gen_random_uuid(), '7a1f0001-0000-4000-8000-000000000001', 'LIST', 8, jsonb_build_object('items', ARRAY[$$1. Bersihkan lensa dulu — 90% foto blur karena lensa kotor$$, $$2. Cari cahaya: hadapkan subjek ke sumber cahaya (jendela/pagi-sore), hindari backlight$$, $$3. Aktifkan grid, terapkan rule of thirds: subjek di sepertiga frame$$, $$4. Ketuk layar untuk fokus, lalu geser untuk atur exposure$$, $$5. Tahan napas / gunakan timer 3 detik agar tidak goyang$$, $$6. Ambil beberapa sudut, pilih yang terbaik$$])),
(gen_random_uuid(), '7a1f0001-0000-4000-8000-000000000001', 'HEADING', 9, jsonb_build_object('text', $$Editing Dasar$$)),
(gen_random_uuid(), '7a1f0001-0000-4000-8000-000000000001', 'LIST', 10, jsonb_build_object('items', ARRAY[$$Crop dan luruskan horizon$$, $$Naikkan sedikit brightness/shadow, jangan berlebihan$$, $$Sesuaikan white balance bila warna kekuningan$$, $$Pertajam (sharpening) secukupnya$$])),
(gen_random_uuid(), '7a1f0001-0000-4000-8000-000000000001', 'HEADING', 11, jsonb_build_object('text', $$Risiko$$)),
(gen_random_uuid(), '7a1f0001-0000-4000-8000-000000000001', 'PARAGRAPH', 12, jsonb_build_object('text', $$Jangan over-edit: saturasi berlebihan membuat foto terlihat palsu. Jangan gunakan flash LED bawaan untuk potret orang — hasilnya keras dan tidak natural; cari cahaya alami saja.$$));

-- ============ 2. TUT-DEKORASI-001 ============
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, status, created_by, updated_by)
VALUES ('7a1f0002-0000-4000-8000-000000000002', 'TUT-DEKORASI-001', 'b2222222-2222-2222-2222-222222222222',
'Dekorasi Kamar Kost: Murah tapi Estetik', 'dekorasi-kamar-kost-murah-estetik',
'Kamar kost sempit bisa terlihat estetik dengan budget di bawah 200 ribu: penataan, cahaya, dan sentuhan personal.',
'id', 7, 'DRAFT', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (id) DO NOTHING;

INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
(gen_random_uuid(), '7a1f0002-0000-4000-8000-000000000002', 'HEADING', 1, jsonb_build_object('text', $$Masalah: Kamar Kost Sempit dan Membosankan$$)),
(gen_random_uuid(), '7a1f0002-0000-4000-8000-000000000002', 'PARAGRAPH', 2, jsonb_build_object('text', $$Kamar kost rata-rata 3x4 meter terasa pengap dan tidak betah. Budget terbatas, tidak boleh paku dinding, dan barang bawaan banyak — bagaimana membuatnya nyaman?$$)),
(gen_random_uuid(), '7a1f0002-0000-4000-8000-000000000002', 'HEADING', 3, jsonb_build_object('text', $$Penjelasan: Prinsip Ruang Kecil$$)),
(gen_random_uuid(), '7a1f0002-0000-4000-8000-000000000002', 'PARAGRAPH', 4, jsonb_build_object('text', $$Kunci kamar kecil: zona (tidur, kerja, santai), vertikal (manfaatkan dinding), dan cahaya hangat. Warna terang membuat ruang terasa lega; barang berserakan membuatnya terasa 2x lebih sempit.$$)),
(gen_random_uuid(), '7a1f0002-0000-4000-8000-000000000002', 'HEADING', 5, jsonb_build_object('text', $$Alat dan Budget$$)),
(gen_random_uuid(), '7a1f0002-0000-4000-8000-000000000002', 'LIST', 6, jsonb_build_object('items', ARRAY[$$Lampu tumblr / fairy light (± Rp30 ribu)$$, $$Stiker dinding removable / poster (± Rp20-50 ribu)$$, $$Kotak penyimpanan lipat (± Rp15 ribu/pcs)$$, $$Tanaman kecil / kaktus (± Rp10-25 ribu)$$, $$Karpet bulu kecil (± Rp40 ribu)$$, $$Total estimasi: Rp150-200 ribu$$])),
(gen_random_uuid(), '7a1f0002-0000-4000-8000-000000000002', 'HEADING', 7, jsonb_build_object('text', $$Langkah Dekorasi$$)),
(gen_random_uuid(), '7a1f0002-0000-4000-8000-000000000002', 'LIST', 8, jsonb_build_object('items', ARRAY[$$1. Bereskan total: buang/sumbangkan barang tak terpakai$$, $$2. Tentukan zona: kasur, meja kerja, sudut santai$$, $$3. Pasang fairy light di sekeliling kasur/dinding untuk cahaya hangat$$, $$4. Tempel poster/stiker dengan perekat removable (tanpa paku)$$, $$5. Kelompokkan barang ke kotak penyimpanan berlabel$$, $$6. Tambahkan 1-2 tanaman dan karpet kecil sebagai aksen$$])),
(gen_random_uuid(), '7a1f0002-0000-4000-8000-000000000002', 'HEADING', 9, jsonb_build_object('text', $$Risiko$$)),
(gen_random_uuid(), '7a1f0002-0000-4000-8000-000000000002', 'PARAGRAPH', 10, jsonb_build_object('text', $$Cek aturan kost: sebagian melarang menempel apapun di dinding. Jangan menumpuk kabel fairy light dekat bahan mudah terbakar, dan matikan saat tidur/bepergian.$$)),
(gen_random_uuid(), '7a1f0002-0000-4000-8000-000000000002', 'HEADING', 11, jsonb_build_object('text', $$Penyelesaian$$)),
(gen_random_uuid(), '7a1f0002-0000-4000-8000-000000000002', 'PARAGRAPH', 12, jsonb_build_object('text', $$Dengan Rp200 ribu dan satu sore pengerjaan, kamar kost berubah dari sekadar tempat tidur menjadi ruang yang betah untuk belajar dan istirahat. Kunci jangka panjang: disiplin merapikan 5 menit tiap hari.$$));

-- ============ 3. EXP-ZOOLOGI-001 ============
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, status, created_by, updated_by)
VALUES ('7a1f0003-0000-4000-8000-000000000003', 'EXP-ZOOLOGI-001', 'c1000001-0000-0000-0000-000000000001',
'Komodo: Naga Terakhir di Bumi', 'komodo-naga-terakhir-di-bumi',
'Varanus komodoensis: kadal terbesar di dunia, predator puncak endemik Indonesia, dan fosil hidup dari zaman purba.',
'id', 7, 'DRAFT', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (id) DO NOTHING;

INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
(gen_random_uuid(), '7a1f0003-0000-4000-8000-000000000003', 'HEADING', 1, jsonb_build_object('text', $$Pengantar: Raksasa dari Timur Indonesia$$)),
(gen_random_uuid(), '7a1f0003-0000-4000-8000-000000000003', 'PARAGRAPH', 2, jsonb_build_object('text', $$Komodo (Varanus komodoensis) adalah kadal terbesar yang masih hidup: jantan dewasa mencapai 3 meter dan 70 kg. Ia hanya hidup di segelintir pulau di Nusa Tenggara Timur — Komodo, Rinca, Flores, Gili Motang, dan Padar.$$)),
(gen_random_uuid(), '7a1f0003-0000-4000-8000-000000000003', 'HEADING', 3, jsonb_build_object('text', $$Klasifikasi$$)),
(gen_random_uuid(), '7a1f0003-0000-4000-8000-000000000003', 'LIST', 4, jsonb_build_object('items', ARRAY[$$Filum: Chordata — bertulang belakang$$, $$Kelas: Reptilia — reptil bersisik$$, $$Ordo: Squamata — kadal dan ular$$, $$Famili: Varanidae — biawak$$, $$Spesies: Varanus komodoensis$$])),
(gen_random_uuid(), '7a1f0003-0000-4000-8000-000000000003', 'HEADING', 5, jsonb_build_object('text', $$Senjata Mematikan: Bisa, Bukan Bakteri$$)),
(gen_random_uuid(), '7a1f0003-0000-4000-8000-000000000003', 'PARAGRAPH', 6, jsonb_build_object('text', $$Dulu diyakini mangsa komodo mati karena bakteri air liurnya. Penelitian modern membuktikan komodo memiliki kelenjar bisa: racunnya mencegah pembekuan darah dan menurunkan tekanan darah mangsa hingga syok. Gigitan yang terlihat ringan pun bisa berakibat fatal dalam hitungan jam.$$)),
(gen_random_uuid(), '7a1f0003-0000-4000-8000-000000000003', 'HEADING', 7, jsonb_build_object('text', $$Strategi Berburu$$)),
(gen_random_uuid(), '7a1f0003-0000-4000-8000-000000000003', 'PARAGRAPH', 8, jsonb_build_object('text', $$Komodo adalah predator penyergap yang sabar. Ia menunggu berjam-jam di jalur hewan, lalu menerkam dan menggigit sekali — setelah itu ia cukup mengikuti jejak mangsa yang melemah. Satu ekor rusa bisa dimakan bersama-sama, dan komodo mampu menelan 80% berat badannya dalam sekali makan.$$)),
(gen_random_uuid(), '7a1f0003-0000-4000-8000-000000000003', 'HEADING', 9, jsonb_build_object('text', $$Reproduksi Unik$$)),
(gen_random_uuid(), '7a1f0003-0000-4000-8000-000000000003', 'PARAGRAPH', 10, jsonb_build_object('text', $$Betina komodo bisa bereproduksi secara partenogenesis — bertelur tanpa kawin — dan semua anaknya jantan. Kemampuan langka ini membantu kolonisasi pulau baru oleh satu individu betina.$$)),
(gen_random_uuid(), '7a1f0003-0000-4000-8000-000000000003', 'HEADING', 11, jsonb_build_object('text', $$Status Konservasi$$)),
(gen_random_uuid(), '7a1f0003-0000-4000-8000-000000000003', 'PARAGRAPH', 12, jsonb_build_object('text', $$IUCN mengklasifikasikan komodo sebagai Terancam Punah (Endangered): populasi liar diperkirakan 3.000-5.000 ekor dan menurun akibat hilangnya habitat serta berkurangnya mangsa. Taman Nasional Komodo, situs Warisan Dunia UNESCO, adalah benteng terakhirnya.$$));

-- ============ 4. EXP-METEOROLOGI-001 ============
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, status, created_by, updated_by)
VALUES ('7a1f0004-0000-4000-8000-000000000004', 'EXP-METEOROLOGI-001', 'c6000001-0000-0000-0000-000000000001',
'Prakiraan Cuaca: Cara Membaca Langit', 'prakiraan-cuaca-cara-membaca-langit',
'Memahami awan, angin, dan tekanan udara untuk memprakirakan cuaca sendiri — ilmu meteorologi praktis sehari-hari.',
'id', 7, 'DRAFT', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (id) DO NOTHING;

INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
(gen_random_uuid(), '7a1f0004-0000-4000-8000-000000000004', 'HEADING', 1, jsonb_build_object('text', $$Pengantar: Langit sebagai Buku$$)),
(gen_random_uuid(), '7a1f0004-0000-4000-8000-000000000004', 'PARAGRAPH', 2, jsonb_build_object('text', $$Sebelum ada aplikasi cuaca, nelayan dan petani membaca langit. Keterampilan itu tetap berguna: baterai habis atau sinyal hilang bukan alasan buta cuaca. Tiga hal yang perlu dibaca: awan, angin, dan tekanan udara.$$)),
(gen_random_uuid(), '7a1f0004-0000-4000-8000-000000000004', 'HEADING', 3, jsonb_build_object('text', $$Membaca Awan$$)),
(gen_random_uuid(), '7a1f0004-0000-4000-8000-000000000004', 'LIST', 4, jsonb_build_object('items', ARRAY[$$Cirrus (serat putih tinggi): cuaca baik 24 jam ke depan, tapi waspada jika menebal$$, $$Cumulus (gumpalan putih): cuaca cerah; jika tumbuh menjulang jadi Cumulonimbus → hujan badai$$, $$Stratus (lapisan kelabu merata): gerimis atau mendung berkepanjangan$$, $$Cumulonimbus (menara gelap): hujan lebat, petir, angin kencang — segera berteduh$$])),
(gen_random_uuid(), '7a1f0004-0000-4000-8000-000000000004', 'HEADING', 5, jsonb_build_object('text', $$Membaca Angin$$)),
(gen_random_uuid(), '7a1f0004-0000-4000-8000-000000000004', 'PARAGRAPH', 6, jsonb_build_object('text', $$Di Indonesia, angin muson menentukan musim: angin bertiup dari barat (Oktober-April) membawa hujan — musim hujan; dari timur (Mei-September) membawa udara kering — musim kemarau. Perubahan arah angin yang tiba-tiba sering mendahului perubahan cuaca 6-12 jam.$$)),
(gen_random_uuid(), '7a1f0004-0000-4000-8000-000000000004', 'HEADING', 7, jsonb_build_object('text', $$Tekanan Udara$$)),
(gen_random_uuid(), '7a1f0004-0000-4000-8000-000000000004', 'PARAGRAPH', 8, jsonb_build_object('text', $$Tekanan tinggi = udara turun = cuaca cerah dan stabil. Tekanan rendah = udara naik = awan terbentuk = hujan. Barometer sederhana di HP bisa menunjukkan tren: tekanan turun cepat berarti badai mendekat.$$)),
(gen_random_uuid(), '7a1f0004-0000-4000-8000-000000000004', 'HEADING', 9, jsonb_build_object('text', $$Tanda Alam Lainnya$$)),
(gen_random_uuid(), '7a1f0004-0000-4000-8000-000000000004', 'LIST', 10, jsonb_build_object('items', ARRAY[$$Embun pagi tebal: hari akan cerah$$, $$Langit merah saat senja: "red sky at night" — cuaca baik besok$$, $$Suara terdengar lebih jauh dari biasa: kelembapan tinggi, hujan mungkin dekat$$, $$Hewan gelisah / burung terbang rendah: tekanan turun$$]));

-- ============ 5. SCH-SMA-KIM2-001 ============
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, status, created_by, updated_by)
VALUES ('7a1f0005-0000-4000-8000-000000000005', 'SCH-SMA-KIM2-001', 'd5555555-5555-5555-5555-555555555555',
'Kimia Kelas 11: Ikatan Kimia', 'kimia-kelas-11-ikatan-kimia',
'Materi ikatan kimia kelas 11: ionik, kovalen, kovalen koordinasi, logam — dan cara menentukan jenis ikatan dari konfigurasi elektron.',
'id', 9, 'DRAFT', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (id) DO NOTHING;

INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
(gen_random_uuid(), '7a1f0005-0000-4000-8000-000000000005', 'HEADING', 1, jsonb_build_object('text', $$Tujuan Pembelajaran$$)),
(gen_random_uuid(), '7a1f0005-0000-4000-8000-000000000005', 'PARAGRAPH', 2, jsonb_build_object('text', $$Setelah mempelajari materi ini, kamu dapat: (1) menjelaskan kecenderungan unsur mencapai kestabilan (aturan oktet/duplet), (2) membedakan ikatan ionik, kovalen, kovalen koordinasi, dan logam, (3) menentukan jenis ikatan suatu senyawa.$$)),
(gen_random_uuid(), '7a1f0005-0000-4000-8000-000000000005', 'HEADING', 3, jsonb_build_object('text', $$Aturan Oktet: Motivasi Berikatan$$)),
(gen_random_uuid(), '7a1f0005-0000-4000-8000-000000000005', 'PARAGRAPH', 4, jsonb_build_object('text', $$Unsur cenderung memiliki 8 elektron valensi (oktet) seperti gas mulia — atau 2 elektron (duplet) seperti helium. Untuk mencapainya, unsur melepaskan, menerima, atau berbagi elektron. Inilah alasan ikatan kimia terbentuk.$$)),
(gen_random_uuid(), '7a1f0005-0000-4000-8000-000000000005', 'HEADING', 5, jsonb_build_object('text', $$Ikatan Ionik$$)),
(gen_random_uuid(), '7a1f0005-0000-4000-8000-000000000005', 'PARAGRAPH', 6, jsonb_build_object('text', $$Terjadi antara logam dan nonlogam melalui SERAH TERIMA elektron. Contoh: Na melepaskan 1 elektron menjadi Na+, Cl menerima 1 elektron menjadi Cl−; keduanya stabil lalu saling tarik-menarik membentuk NaCl. Ciri: titik leleh tinggi, menghantar listrik saat leleh/larutan, rapuh.$$)),
(gen_random_uuid(), '7a1f0005-0000-4000-8000-000000000005', 'HEADING', 7, jsonb_build_object('text', $$Ikatan Kovalen$$)),
(gen_random_uuid(), '7a1f0005-0000-4000-8000-000000000005', 'PARAGRAPH', 8, jsonb_build_object('text', $$Terjadi antara sesama nonlogam melalui BERBAGI pasangan elektron. Contoh: H2 (berbagi 1 pasang), O2 (2 pasang), N2 (3 pasang). Jika pasangan elektron berasal dari SATU atom saja, disebut kovalen koordinasi — contoh: NH4+ dan H3O+.$$)),
(gen_random_uuid(), '7a1f0005-0000-4000-8000-000000000005', 'HEADING', 9, jsonb_build_object('text', $$Ikatan Logam$$)),
(gen_random_uuid(), '7a1f0005-0000-4000-8000-000000000005', 'PARAGRAPH', 10, jsonb_build_object('text', $$Atom-atom logam tersusun rapat dalam "lautan elektron" yang bergerak bebas. Ini menjelaskan sifat logam: menghantar listrik dan panas, mengilap, serta dapat ditempa/dibentuk tanpa patah.$$)),
(gen_random_uuid(), '7a1f0005-0000-4000-8000-000000000005', 'HEADING', 11, jsonb_build_object('text', $$Latihan Soal$$)),
(gen_random_uuid(), '7a1f0005-0000-4000-8000-000000000005', 'LIST', 12, jsonb_build_object('items', ARRAY[$$1. Tentukan jenis ikatan pada MgO dan jelaskan alasannya.$$ , $$2. Gambarkan struktur Lewis H2O dan tentukan jumlah pasangan elektron bebas pada O.$$ , $$3. Mengapa NaCl padat tidak menghantar listrik tetapi lelehannya menghantar?$$])),
(gen_random_uuid(), '7a1f0005-0000-4000-8000-000000000005', 'HEADING', 13, jsonb_build_object('text', $$Kunci Jawaban$$)),
(gen_random_uuid(), '7a1f0005-0000-4000-8000-000000000005', 'LIST', 14, jsonb_build_object('items', ARRAY[$$1. Ikatan ionik: Mg (logam) melepaskan 2e−, O (nonlogam) menerima 2e−.$$ , $$2. O dikelilingi 2 pasang ikatan (dengan 2 H) + 2 pasang elektron bebas.$$ , $$3. Padat: ion terkunci dalam kisi kristal. Leleh: ion bebas bergerak membawa muatan.$$]));

-- ============ 6. SCH-SD-PENJAS-001 ============
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, status, created_by, updated_by)
VALUES ('7a1f0006-0000-4000-8000-000000000006', 'SCH-SD-PENJAS-001', 'd3333333-3333-3333-3333-333333333333',
'Penjas Kelas 4: Gerak Dasar Lokomotor', 'penjas-kelas-4-gerak-dasar-lokomotor',
'Materi PJOK kelas 4 SD: gerak lokomotor (berjalan, berlari, melompat, meloncat) dengan teknik yang benar dan permainan seru.',
'id', 7, 'DRAFT', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (id) DO NOTHING;

INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
(gen_random_uuid(), '7a1f0006-0000-4000-8000-000000000006', 'HEADING', 1, jsonb_build_object('text', $$Tujuan Pembelajaran$$)),
(gen_random_uuid(), '7a1f0006-0000-4000-8000-000000000006', 'PARAGRAPH', 2, jsonb_build_object('text', $$Setelah pembelajaran ini, kamu dapat: (1) menjelaskan pengertian gerak lokomotor, (2) mempraktikkan berjalan, berlari, melompat, dan meloncat dengan teknik benar, (3) bermain permainan yang melatih gerak lokomotor dengan sportif.$$)),
(gen_random_uuid(), '7a1f0006-0000-4000-8000-000000000006', 'HEADING', 3, jsonb_build_object('text', $$Apa Itu Gerak Lokomotor?$$)),
(gen_random_uuid(), '7a1f0006-0000-4000-8000-000000000006', 'PARAGRAPH', 4, jsonb_build_object('text', $$Gerak lokomotor adalah gerak yang menyebabkan tubuh BERPINDAH TEMPAT. Lawannya gerak non-lokomotor (di tempat, misalnya membungkuk) dan manipulatif (dengan benda, misalnya melempar bola). Contoh lokomotor: berjalan, berlari, melompat.$$)),
(gen_random_uuid(), '7a1f0006-0000-4000-8000-000000000006', 'HEADING', 5, jsonb_build_object('text', $$Teknik Berjalan dan Berlari$$)),
(gen_random_uuid(), '7a1f0006-0000-4000-8000-000000000006', 'LIST', 6, jsonb_build_object('items', ARRAY[$$Berjalan: badan tegak, pandangan ke depan, ayunkan lengan berlawanan dengan kaki$$, $$Berlari: condongkan badan sedikit ke depan, langkahkan kaki lebih jauh, ayunan lengan lebih kuat$$, $$Pendaratan: telapak kaki bagian depan dulu saat berlari cepat$$])),
(gen_random_uuid(), '7a1f0006-0000-4000-8000-000000000006', 'HEADING', 7, jsonb_build_object('text', $$Melompat vs Meloncat$$)),
(gen_random_uuid(), '7a1f0006-0000-4000-8000-000000000006', 'PARAGRAPH', 8, jsonb_build_object('text', $$Melompat = tolakan SATU kaki (contoh: lompat engklek). Meloncat = tolakan DUA kaki bersamaan (contoh: loncat katak). Keduanya mendarat dengan lutut sedikit ditekuk untuk meredam benturan — ini penting agar tidak cedera.$$)),
(gen_random_uuid(), '7a1f0006-0000-4000-8000-000000000006', 'HEADING', 9, jsonb_build_object('text', $$Permainan: Estafet Bola$$)),
(gen_random_uuid(), '7a1f0006-0000-4000-8000-000000000006', 'PARAGRAPH', 10, jsonb_build_object('text', $$Bagi kelas jadi 2 tim. Setiap anak berlari membawa bola ke titik balik, lalu oper ke teman berikutnya. Tim tercepat menang. Permainan ini melatih lari cepat, kelincahan, dan kerja sama.$$)),
(gen_random_uuid(), '7a1f0006-0000-4000-8000-000000000006', 'HEADING', 11, jsonb_build_object('text', $$Keselamatan$$)),
(gen_random_uuid(), '7a1f0006-0000-4000-8000-000000000006', 'LIST', 12, jsonb_build_object('items', ARRAY[$$Lakukan pemanasan 5-10 menit sebelum berlatih$$, $$Gunakan sepatu olahraga yang pas$$, $$Berlatih di permukaan rata dan tidak licin$$, $$Hentikan latihan jika pusing atau nyeri$$]));
