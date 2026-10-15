-- Artikel konten Madevi batch 17 — 2026-10-13
-- Owner principal: f7125028-187e-44e0-b95b-88b69b8d5c9a

-- ============ TUT-SOSMED-001 ============
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, status, created_by, updated_by)
VALUES ('6c3f1f55-d2b3-47ea-8fa7-8cb029b70051', 'TUT-SOSMED-001', 'b2222222-2222-2222-2222-222222222222',
'Detoks Media Sosial: 7 Hari Lebih Tenang', 'detoks-media-sosial-7-hari-lebih-tenang',
'Panduan praktis mengurangi kecanduan media sosial dalam 7 hari: dari audit waktu layar hingga membangun kebiasaan digital yang sehat.',
'id', 7, 'DRAFT', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (id) DO NOTHING;

INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
(gen_random_uuid(), '6c3f1f55-d2b3-47ea-8fa7-8cb029b70051', 'HEADING', 1, jsonb_build_object('text', $$Masalah: Kecanduan Scroll Tanpa Sadar$$)),
(gen_random_uuid(), '6c3f1f55-d2b3-47ea-8fa7-8cb029b70051', 'PARAGRAPH', 2, jsonb_build_object('text', $$Kamu membuka HP hanya untuk cek satu notifikasi, tapi 45 menit kemudian masih scroll tanpa tujuan. Rata-rata orang Indonesia menghabiskan lebih dari 3 jam sehari di media sosial. Akibatnya: susah fokus, tidur berantakan, mudah cemas, dan produktivitas anjlok.$$)),
(gen_random_uuid(), '6c3f1f55-d2b3-47ea-8fa7-8cb029b70051', 'HEADING', 3, jsonb_build_object('text', $$Penjelasan: Kenapa Sulit Berhenti$$)),
(gen_random_uuid(), '6c3f1f55-d2b3-47ea-8fa7-8cb029b70051', 'PARAGRAPH', 4, jsonb_build_object('text', $$Aplikasi dirancang memakai prinsip variable reward — seperti mesin slot: kadang dapat konten lucu, kadang tidak. Ketidakpastian inilah yang memicu dopamin dan membuat otak terus ingin scroll. Notifikasi merah, autoplay, dan infinite scroll semuanya disengaja agar kamu betah.$$)),
(gen_random_uuid(), '6c3f1f55-d2b3-47ea-8fa7-8cb029b70051', 'HEADING', 5, jsonb_build_object('text', $$Alat yang Dibutuhkan$$)),
(gen_random_uuid(), '6c3f1f55-d2b3-47ea-8fa7-8cb029b70051', 'LIST', 6, jsonb_build_object('items', ARRAY[$$Fitur Screen Time / Digital Wellbeing di HP$$, $$Timer atau jam weker$$, $$Buku/catatan kecil sebagai pengganti HP$$, $$Satu teman yang mau ikut tantangan (opsional tapi membantu)$$])),
(gen_random_uuid(), '6c3f1f55-d2b3-47ea-8fa7-8cb029b70051', 'HEADING', 7, jsonb_build_object('text', $$Langkah: Program Detoks 7 Hari$$)),
(gen_random_uuid(), '6c3f1f55-d2b3-47ea-8fa7-8cb029b70051', 'LIST', 8, jsonb_build_object('items', ARRAY[$$Hari 1: Cek Screen Time, catat total jam dan 3 aplikasi teratas. Matikan semua notifikasi non-penting.$$, $$Hari 2: Hapus aplikasi media sosial dari home screen (jangan uninstall dulu). Atur batas 1 jam per aplikasi.$$, $$Hari 3: Tetapkan zona bebas HP: kamar tidur dan meja makan. Ganti scrolling pagi dengan 10 menit jalan kaki.$$, $$Hari 4: Unfollow/unfriend 50 akun yang tidak memberi nilai. Kurangi sumber godaan.$$, $$Hari 5: Coba puasa total 24 jam dari satu aplikasi yang paling menyita waktu.$$, $$Hari 6: Isi waktu luang dengan satu aktivitas offline: baca buku, olahraga, atau masak.$$, $$Hari 7: Evaluasi. Bandingkan Screen Time dengan hari 1. Tentukan aturan permanen, misalnya maksimal 1 jam per hari.$$])),
(gen_random_uuid(), '6c3f1f55-d2b3-47ea-8fa7-8cb029b70051', 'HEADING', 9, jsonb_build_object('text', $$Risiko$$)),
(gen_random_uuid(), '6c3f1f55-d2b3-47ea-8fa7-8cb029b70051', 'PARAGRAPH', 10, jsonb_build_object('text', $$FOMO (fear of missing out) akan muncul di hari 2-3 — itu normal dan biasanya hilang setelah 48 jam. Jangan umumkan detoks di media sosial lalu tetap buka untuk cek komentar; itu menggagalkan tujuan. Jika pekerjaanmu butuh media sosial, pisahkan akun kerja dan batasi hanya di jam kerja.$$)),
(gen_random_uuid(), '6c3f1f55-d2b3-47ea-8fa7-8cb029b70051', 'HEADING', 11, jsonb_build_object('text', $$Penyelesaian$$)),
(gen_random_uuid(), '6c3f1f55-d2b3-47ea-8fa7-8cb029b70051', 'PARAGRAPH', 12, jsonb_build_object('text', $$Ukur keberhasilan: Screen Time turun minimal 40 persen, tidur lebih cepat 30 menit, dan kamu bisa fokus 25 menit tanpa cek HP. Pertahankan aturan 1 jam per hari. Jika kambuh, ulangi program 7 hari — detoks bukan sekali jalan, melainkan kebiasaan yang dilatih.$$))
ON CONFLICT (id) DO NOTHING;

-- ============ TUT-BELANJA-001 ============
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, status, created_by, updated_by)
VALUES ('9b16589a-d870-4c4a-ad5c-0039a64bf0e0', 'TUT-BELANJA-001', 'b8888888-8888-8888-8888-888888888888',
'Belanja Cerdas: Hindari Jebakan Diskon', 'belanja-cerdas-hindari-jebakan-diskon',
'Kenali trik psikologi diskon dan terapkan strategi belanja cerdas agar hemat tanpa merasa tersiksa.',
'id', 6, 'DRAFT', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (id) DO NOTHING;

INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
(gen_random_uuid(), '9b16589a-d870-4c4a-ad5c-0039a64bf0e0', 'HEADING', 1, jsonb_build_object('text', $$Masalah: Selalu Kalap Saat Diskon$$)),
(gen_random_uuid(), '9b16589a-d870-4c4a-ad5c-0039a64bf0e0', 'PARAGRAPH', 2, jsonb_build_object('text', $$Lihat tulisan 70 persen langsung checkout, padahal barangnya tidak dibutuhkan. Akhir bulan dompet kosong, lemari penuh barang tak terpakai. Diskon memang menggoda — dan itu disengaja.$$)),
(gen_random_uuid(), '9b16589a-d870-4c4a-ad5c-0039a64bf0e0', 'HEADING', 3, jsonb_build_object('text', $$Penjelasan: Trik Psikologi di Balik Diskon$$)),
(gen_random_uuid(), '9b16589a-d870-4c4a-ad5c-0039a64bf0e0', 'PARAGRAPH', 4, jsonb_build_object('text', $$Penjual memakai anchoring: harga coret Rp500 ribu membuat harga Rp150 ribu terasa murah, padahal harga wajarnya memang segitu. Scarcity (stok tinggal 2!) dan urgency (berakhir dalam 1 jam!) menekanmu memutuskan cepat tanpa berpikir. Flash sale adalah mesin FOMO.$$)),
(gen_random_uuid(), '9b16589a-d870-4c4a-ad5c-0039a64bf0e0', 'HEADING', 5, jsonb_build_object('text', $$Alat yang Dibutuhkan$$)),
(gen_random_uuid(), '9b16589a-d870-4c4a-ad5c-0039a64bf0e0', 'LIST', 6, jsonb_build_object('items', ARRAY[$$Daftar belanja tertulis sebelum buka aplikasi$$, $$Anggaran belanja bulanan yang jelas$$, $$Aturan 30 hari untuk barang non-esensial$$, $$Aplikasi pencatat pengeluaran$$])),
(gen_random_uuid(), '9b16589a-d870-4c4a-ad5c-0039a64bf0e0', 'HEADING', 7, jsonb_build_object('text', $$Langkah: Strategi Belanja Cerdas$$)),
(gen_random_uuid(), '9b16589a-d870-4c4a-ad5c-0039a64bf0e0', 'LIST', 8, jsonb_build_object('items', ARRAY[$$1. Buat daftar belanja dulu, baru buka marketplace — bukan sebaliknya.$$, $$2. Terapkan aturan 30 hari: barang non-esensial di atas Rp200 ribu wajib ditunda 30 hari. Kalau masih diinginkan, baru beli.$$, $$3. Bandingkan harga di 3 toko berbeda sebelum checkout.$$, $$4. Hitung cost per use: jaket Rp600 ribu dipakai 100 kali = Rp6 ribu per pakai (murah). Gaun pesta Rp600 ribu dipakai sekali = mahal.$$, $$5. Manfaatkan diskon hanya untuk barang yang memang sudah ada di daftar.$$])),
(gen_random_uuid(), '9b16589a-d870-4c4a-ad5c-0039a64bf0e0', 'HEADING', 9, jsonb_build_object('text', $$Risiko$$)),
(gen_random_uuid(), '9b16589a-d870-4c4a-ad5c-0039a64bf0e0', 'PARAGRAPH', 10, jsonb_build_object('text', $$Jangan berutang (paylater/kartu kredit) demi mengejar diskon — bunga cicilan menghapus semua penghematan. Waspadai gratis ongkir yang membuatmu menambah barang agar mencapai minimum belanja; itu justru menambah pengeluaran.$$)),
(gen_random_uuid(), '9b16589a-d870-4c4a-ad5c-0039a64bf0e0', 'HEADING', 11, jsonb_build_object('text', $$Penyelesaian$$)),
(gen_random_uuid(), '9b16589a-d870-4c4a-ad5c-0039a64bf0e0', 'PARAGRAPH', 12, jsonb_build_object('text', $$Target realistis: pengeluaran impulsif turun 50 persen dalam 2 bulan. Uang yang hemat dialihkan ke tabungan atau dana darurat. Belanja cerdas bukan berarti tidak boleh belanja — melainkan setiap rupiah keluar untuk sesuatu yang benar-benar bernilai bagimu.$$))
ON CONFLICT (id) DO NOTHING;

-- ============ EXP-NEUROSAINS-001 ============
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, status, created_by, updated_by)
VALUES ('22075819-be99-401b-b8af-d5963a5e957f', 'EXP-NEUROSAINS-001', 'c2222222-2222-2222-2222-222222222222',
'Otak Remaja: Mengapa Emosi Meledak-ledak', 'otak-remaja-mengapa-emosi-meledak-ledak',
'Penjelasan sains di balik emosi remaja yang naik-turun: peran amigdala, korteks prefrontal, dan pruning sinaptik.',
'id', 6, 'DRAFT', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (id) DO NOTHING;

INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
(gen_random_uuid(), '22075819-be99-401b-b8af-d5963a5e957f', 'HEADING', 1, jsonb_build_object('text', $$Bukan Sekadar Drama: Ini Sains$$)),
(gen_random_uuid(), '22075819-be99-401b-b8af-d5963a5e957f', 'PARAGRAPH', 2, jsonb_build_object('text', $$Remaja menangis karena hal sepele, marah meledak-ledak, lalu tertawa lima menit kemudian. Orang dewasa sering menyebutnya lebay. Padahal, ada penjelasan neurologis yang nyata: otak remaja sedang dalam masa konstruksi besar-besaran.$$)),
(gen_random_uuid(), '22075819-be99-401b-b8af-d5963a5e957f', 'HEADING', 3, jsonb_build_object('text', $$Amigdala vs Korteks Prefrontal$$)),
(gen_random_uuid(), '22075819-be99-401b-b8af-d5963a5e957f', 'PARAGRAPH', 4, jsonb_build_object('text', $$Amigdala adalah pusat emosi yang bereaksi cepat terhadap ancaman dan hadiah. Korteks prefrontal adalah pusat logika, perencanaan, dan pengendalian diri. Pada remaja, amigdala sudah aktif penuh, tetapi korteks prefrontal belum matang — seperti mobil dengan gas kencang tapi rem belum terpasang sempurna.$$)),
(gen_random_uuid(), '22075819-be99-401b-b8af-d5963a5e957f', 'HEADING', 5, jsonb_build_object('text', $$Pruning Sinaptik: Pangkas yang Tak Terpakai$$)),
(gen_random_uuid(), '22075819-be99-401b-b8af-d5963a5e957f', 'PARAGRAPH', 6, jsonb_build_object('text', $$Otak remaja memproduksi sinapsis (sambungan antar neuron) berlebihan di masa kanak-kanak, lalu memangkas yang jarang dipakai — disebut synaptic pruning. Proses ini membuat otak lebih efisien, tetapi juga membuat remaja lebih sensitif terhadap pengalaman: yang sering dilatih menguat, yang tidak akan hilang.$$)),
(gen_random_uuid(), '22075819-be99-401b-b8af-d5963a5e957f', 'HEADING', 7, jsonb_build_object('text', $$Dopamin dan Haus Sensasi$$)),
(gen_random_uuid(), '22075819-be99-401b-b8af-d5963a5e957f', 'PARAGRAPH', 8, jsonb_build_object('text', $$Sistem reward remaja sangat peka terhadap dopamin. Itulah sebabnya remaja mencari sensasi: balapan liar, tantangan berbahaya, atau sekadar begadang. Bukan karena tidak tahu bahaya, melainkan karena hadiahnya terasa jauh lebih besar dibanding risikonya.$$)),
(gen_random_uuid(), '22075819-be99-401b-b8af-d5963a5e957f', 'HEADING', 9, jsonb_build_object('text', $$Kapan Otak Benar-benar Matang?$$)),
(gen_random_uuid(), '22075819-be99-401b-b8af-d5963a5e957f', 'PARAGRAPH', 10, jsonb_build_object('text', $$Korteks prefrontal baru matang sekitar usia 25 tahun. Artinya, perilaku impulsif remaja adalah fase perkembangan normal, bukan cacat karakter. Memahami ini membantu orang tua dan guru merespons dengan bimbingan, bukan sekadar hukuman — dan membantu remaja sendiri memahami dirinya.$$))
ON CONFLICT (id) DO NOTHING;

-- ============ EXP-PERTANIAN-001 ============
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, status, created_by, updated_by)
VALUES ('cbfcc601-95e0-403c-8e89-3f7d03de8883', 'EXP-PERTANIAN-001', 'c1000003-0000-0000-0000-000000000003',
'Hidroponik: Bertani Tanpa Tanah', 'hidroponik-bertani-tanpa-tanah',
'Mengenal hidroponik: prinsip, 6 sistem populer, nutrisi AB mix, dan potensinya untuk Indonesia.',
'id', 6, 'DRAFT', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (id) DO NOTHING;

INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
(gen_random_uuid(), 'cbfcc601-95e0-403c-8e89-3f7d03de8883', 'HEADING', 1, jsonb_build_object('text', $$Bertani Tanpa Tanah? Bisa.$$)),
(gen_random_uuid(), 'cbfcc601-95e0-403c-8e89-3f7d03de8883', 'PARAGRAPH', 2, jsonb_build_object('text', $$Hidroponik adalah metode menanam tanpa tanah: akar tanaman direndam atau dialiri larutan nutrisi. Teknik ini sudah dipakai sejak Kebun Gantung Babilonia, dan kini menjadi solusi pertanian di lahan sempit perkotaan.$$)),
(gen_random_uuid(), 'cbfcc601-95e0-403c-8e89-3f7d03de8883', 'HEADING', 3, jsonb_build_object('text', $$Prinsip Dasar$$)),
(gen_random_uuid(), 'cbfcc601-95e0-403c-8e89-3f7d03de8883', 'PARAGRAPH', 4, jsonb_build_object('text', $$Tanaman sebenarnya tidak butuh tanah — yang dibutuhkan adalah air, nutrisi mineral, oksigen, cahaya, dan penyangga. Hidroponik mengganti tanah dengan larutan nutrisi yang komposisinya bisa diatur presisi, sehingga tanaman tumbuh lebih cepat 30-50 persen dibanding cara konvensional.$$)),
(gen_random_uuid(), 'cbfcc601-95e0-403c-8e89-3f7d03de8883', 'HEADING', 5, jsonb_build_object('text', $$Enam Sistem Hidroponik Populer$$)),
(gen_random_uuid(), 'cbfcc601-95e0-403c-8e89-3f7d03de8883', 'PARAGRAPH', 6, jsonb_build_object('text', $$Wick (sumbu): paling sederhana, nutrisi naik lewat sumbu kain — cocok untuk pemula. DFT (deep flow technique): akar terendam larutan yang mengalir. NFT (nutrient film technique): lapisan tipis nutrisi mengalir di talang. Ebb and flow: media direndam lalu dikeringkan berkala. Drip: tetesan nutrisi ke tiap tanaman. Aeroponik: akar disemprot kabut nutrisi — paling efisien tapi paling mahal.$$)),
(gen_random_uuid(), 'cbfcc601-95e0-403c-8e89-3f7d03de8883', 'HEADING', 7, jsonb_build_object('text', $$Nutrisi AB Mix$$)),
(gen_random_uuid(), 'cbfcc601-95e0-403c-8e89-3f7d03de8883', 'PARAGRAPH', 8, jsonb_build_object('text', $$Nutrisi hidroponik dijual sebagai AB mix: dua bubuk pekat (A berisi kalsium, B berisi fosfat dan sulfat) yang dilarutkan terpisah lalu dicampur sesuai takaran. Kuncinya adalah EC (electrical conductivity) untuk kadar nutrisi dan pH 5,5-6,5 agar nutrisi terserap optimal.$$)),
(gen_random_uuid(), 'cbfcc601-95e0-403c-8e89-3f7d03de8883', 'HEADING', 9, jsonb_build_object('text', $$Potensi untuk Indonesia$$)),
(gen_random_uuid(), 'cbfcc601-95e0-403c-8e89-3f7d03de8883', 'PARAGRAPH', 10, jsonb_build_object('text', $$Dengan lahan pertanian menyusut dan urbanisasi meningkat, hidroponik memungkinkan panen sayur di atap rumah, halaman sempit, bahkan dalam ruangan dengan lampu LED. Kangkung, selada, dan pakcoy bisa panen dalam 25-35 hari. Ini bukan sekadar hobi — melainkan salah satu jawaban ketahanan pangan masa depan.$$))
ON CONFLICT (id) DO NOTHING;

-- ============ SCH-SMA-SOS-001 ============
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, status, created_by, updated_by)
VALUES ('991d0f50-28c1-4496-b3c2-d57c84e8736b', 'SCH-SMA-SOS-001', 'd5555555-5555-5555-5555-555555555555',
'Sosiologi Kelas 10: Interaksi Sosial', 'sosiologi-kelas-10-interaksi-sosial',
'Materi sosiologi kelas 10: pengertian interaksi sosial, syarat terjadinya, serta bentuk asosiatif dan disosiatif beserta contohnya.',
'id', 8, 'DRAFT', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (id) DO NOTHING;

INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
(gen_random_uuid(), '991d0f50-28c1-4496-b3c2-d57c84e8736b', 'HEADING', 1, jsonb_build_object('text', $$Tujuan Pembelajaran$$)),
(gen_random_uuid(), '991d0f50-28c1-4496-b3c2-d57c84e8736b', 'PARAGRAPH', 2, jsonb_build_object('text', $$Setelah mempelajari materi ini, kamu diharapkan mampu: (1) menjelaskan pengertian interaksi sosial, (2) menyebutkan dua syarat terjadinya interaksi sosial, (3) membedakan bentuk interaksi asosiatif dan disosiatif beserta contohnya.$$)),
(gen_random_uuid(), '991d0f50-28c1-4496-b3c2-d57c84e8736b', 'HEADING', 3, jsonb_build_object('text', $$Pengertian Interaksi Sosial$$)),
(gen_random_uuid(), '991d0f50-28c1-4496-b3c2-d57c84e8736b', 'PARAGRAPH', 4, jsonb_build_object('text', $$Interaksi sosial adalah hubungan timbal balik antara individu dengan individu, individu dengan kelompok, atau kelompok dengan kelompok. Menurut Soerjono Soekanto, interaksi sosial merupakan kunci dari seluruh kehidupan sosial — tanpa interaksi, tidak ada masyarakat. Contoh sederhana: kamu menyapa teman, lalu teman membalas sapaanmu.$$)),
(gen_random_uuid(), '991d0f50-28c1-4496-b3c2-d57c84e8736b', 'HEADING', 5, jsonb_build_object('text', $$Dua Syarat Interaksi Sosial$$)),
(gen_random_uuid(), '991d0f50-28c1-4496-b3c2-d57c84e8736b', 'PARAGRAPH', 6, jsonb_build_object('text', $$Interaksi sosial hanya terjadi jika ada kontak sosial dan komunikasi. Kontak sosial adalah hubungan fisik maupun nonfisik, misalnya bertemu langsung, menelepon, atau berkirim pesan. Komunikasi adalah penyampaian pesan yang dipahami maknanya oleh penerima — jika pesan tidak dimengerti, interaksi belum terjadi.$$)),
(gen_random_uuid(), '991d0f50-28c1-4496-b3c2-d57c84e8736b', 'HEADING', 7, jsonb_build_object('text', $$Bentuk Asosiatif: Menuju Persatuan$$)),
(gen_random_uuid(), '991d0f50-28c1-4496-b3c2-d57c84e8736b', 'PARAGRAPH', 8, jsonb_build_object('text', $$Interaksi asosiatif mengarah pada persatuan dan kerja sama. Bentuknya: (1) Kerja sama (cooperation), misalnya gotong royong membersihkan lingkungan. (2) Akomodasi, yaitu penyelesaian konflik secara damai, misalnya mediasi. (3) Asimilasi, peleburan dua kebudayaan menjadi satu, misalnya pernikahan antarsuku. (4) Akulturasi, perpaduan budaya tanpa menghilangkan ciri asli, misalnya musik dangdut koplo.$$)),
(gen_random_uuid(), '991d0f50-28c1-4496-b3c2-d57c84e8736b', 'HEADING', 9, jsonb_build_object('text', $$Bentuk Disosiatif: Menuju Perpecahan$$)),
(gen_random_uuid(), '991d0f50-28c1-4496-b3c2-d57c84e8736b', 'PARAGRAPH', 10, jsonb_build_object('text', $$Interaksi disosiatif mengarah pada perpecahan. Bentuknya: (1) Persaingan (competition), misalnya dua warung bersaing harga secara sehat. (2) Kontravensi, perasaan tidak suka yang tersembunyi, misalnya gosip. (3) Konflik (pertentangan), misalnya tawuran antarpelajar. Perlu diingat: persaingan yang sehat justru bisa memacu kemajuan.$$)),
(gen_random_uuid(), '991d0f50-28c1-4496-b3c2-d57c84e8736b', 'HEADING', 11, jsonb_build_object('text', $$Latihan Soal$$)),
(gen_random_uuid(), '991d0f50-28c1-4496-b3c2-d57c84e8736b', 'LIST', 12, jsonb_build_object('items', ARRAY[$$1. Sebutkan dua syarat terjadinya interaksi sosial!$$, $$2. Berikan satu contoh interaksi asosiatif dan satu contoh interaksi disosiatif dari kehidupan sehari-harimu!$$, $$3. Mengapa komunikasi yang tidak dipahami penerima belum bisa disebut interaksi sosial? Jelaskan!$$])),
(gen_random_uuid(), '991d0f50-28c1-4496-b3c2-d57c84e8736b', 'HEADING', 13, jsonb_build_object('text', $$Kunci Jawaban$$)),
(gen_random_uuid(), '991d0f50-28c1-4496-b3c2-d57c84e8736b', 'PARAGRAPH', 14, jsonb_build_object('text', $$1. Kontak sosial dan komunikasi. 2. Asosiatif: kerja kelompok mengerjakan tugas. Disosiatif: bersaing memperebutkan juara kelas. (Jawaban lain yang tepat juga benar.) 3. Karena syarat komunikasi adalah pesan yang disampaikan harus dimengerti maknanya oleh penerima; tanpa pemahaman bersama, tidak terjadi hubungan timbal balik.$$))
ON CONFLICT (id) DO NOTHING;

-- ============ SCH-SD-IPA3-001 ============
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, status, created_by, updated_by)
VALUES ('e5df4b82-745b-48d7-9ad6-ed16afaf368b', 'SCH-SD-IPA3-001', 'd3333333-3333-3333-3333-333333333333',
'IPA Kelas 6: Tata Surya', 'ipa-kelas-6-tata-surya',
'Materi IPA kelas 6 SD: Matahari sebagai pusat tata surya, delapan planet, Bulan, dan benda langit lainnya.',
'id', 7, 'DRAFT', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (id) DO NOTHING;

INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
(gen_random_uuid(), 'e5df4b82-745b-48d7-9ad6-ed16afaf368b', 'HEADING', 1, jsonb_build_object('text', $$Tujuan Pembelajaran$$)),
(gen_random_uuid(), 'e5df4b82-745b-48d7-9ad6-ed16afaf368b', 'PARAGRAPH', 2, jsonb_build_object('text', $$Setelah belajar materi ini, kamu diharapkan mampu: (1) menjelaskan Matahari sebagai pusat tata surya, (2) menyebutkan delapan planet secara berurutan, (3) menjelaskan peran Bulan sebagai satelit Bumi, (4) menyebutkan benda langit selain planet.$$)),
(gen_random_uuid(), 'e5df4b82-745b-48d7-9ad6-ed16afaf368b', 'HEADING', 3, jsonb_build_object('text', $$Matahari, Pusat Tata Surya$$)),
(gen_random_uuid(), 'e5df4b82-745b-48d7-9ad6-ed16afaf368b', 'PARAGRAPH', 4, jsonb_build_object('text', $$Tata surya adalah kumpulan benda langit yang berputar mengelilingi Matahari. Matahari adalah bintang raksasa yang menjadi pusat dan sumber energi. Cahaya Matahari sampai ke Bumi dalam waktu sekitar 8 menit. Semua planet bergerak mengelilingi Matahari karena gaya gravitasinya yang sangat besar.$$)),
(gen_random_uuid(), 'e5df4b82-745b-48d7-9ad6-ed16afaf368b', 'HEADING', 5, jsonb_build_object('text', $$Delapan Planet$$)),
(gen_random_uuid(), 'e5df4b82-745b-48d7-9ad6-ed16afaf368b', 'PARAGRAPH', 6, jsonb_build_object('text', $$Urut dari yang terdekat dengan Matahari: Merkurius, Venus, Bumi, Mars, Jupiter, Saturnus, Uranus, Neptunus. Empat planet pertama berbatu dan kecil (Merkurius, Venus, Bumi, Mars). Empat planet berikutnya adalah raksasa gas yang sangat besar (Jupiter, Saturnus, Uranus, Neptunus). Bumi adalah satu-satunya planet yang diketahui memiliki kehidupan. Cara mudah menghafal: Me-Ve-Bu-Ma-Ju-Sa-Ur-Ne.$$)),
(gen_random_uuid(), 'e5df4b82-745b-48d7-9ad6-ed16afaf368b', 'HEADING', 7, jsonb_build_object('text', $$Bulan, Satelit Bumi$$)),
(gen_random_uuid(), 'e5df4b82-745b-48d7-9ad6-ed16afaf368b', 'PARAGRAPH', 8, jsonb_build_object('text', $$Bulan adalah satelit alami Bumi, yaitu benda langit yang mengelilingi planet. Bulan tidak memancarkan cahaya sendiri — cahaya Bulan yang kita lihat adalah pantulan cahaya Matahari. Bulan mengelilingi Bumi dalam waktu sekitar 29,5 hari, dan inilah yang menyebabkan terjadinya pasang surut air laut.$$)),
(gen_random_uuid(), 'e5df4b82-745b-48d7-9ad6-ed16afaf368b', 'HEADING', 9, jsonb_build_object('text', $$Benda Langit Lainnya$$)),
(gen_random_uuid(), 'e5df4b82-745b-48d7-9ad6-ed16afaf368b', 'PARAGRAPH', 10, jsonb_build_object('text', $$Selain planet, tata surya juga memiliki: asteroid (batuan kecil yang banyak terdapat di antara Mars dan Jupiter), komet (benda berekor es yang indah saat mendekati Matahari), dan meteor (batuan yang terbakar saat masuk atmosfer Bumi, disebut bintang jatuh).$$)),
(gen_random_uuid(), 'e5df4b82-745b-48d7-9ad6-ed16afaf368b', 'HEADING', 11, jsonb_build_object('text', $$Latihan Soal$$)),
(gen_random_uuid(), 'e5df4b82-745b-48d7-9ad6-ed16afaf368b', 'LIST', 12, jsonb_build_object('items', ARRAY[$$1. Sebutkan delapan planet secara berurutan dari yang terdekat dengan Matahari!$$, $$2. Mengapa Bulan terlihat bercahaya pada malam hari?$$, $$3. Apa perbedaan planet berbatu dan planet raksasa gas? Sebutkan contohnya!$$])),
(gen_random_uuid(), 'e5df4b82-745b-48d7-9ad6-ed16afaf368b', 'HEADING', 13, jsonb_build_object('text', $$Kunci Jawaban$$)),
(gen_random_uuid(), 'e5df4b82-745b-48d7-9ad6-ed16afaf368b', 'PARAGRAPH', 14, jsonb_build_object('text', $$1. Merkurius, Venus, Bumi, Mars, Jupiter, Saturnus, Uranus, Neptunus. 2. Karena Bulan memantulkan cahaya Matahari, bukan menghasilkan cahaya sendiri. 3. Planet berbatu berukuran kecil dan permukaannya padat (contoh: Bumi, Mars); planet raksasa gas berukuran sangat besar dan tersusun dari gas (contoh: Jupiter, Saturnus).$$))
ON CONFLICT (id) DO NOTHING;
