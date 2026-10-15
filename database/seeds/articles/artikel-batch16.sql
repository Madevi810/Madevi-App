-- Artikel konten Madevi batch 16 — 2026-10-13
-- Owner principal: f7125028-187e-44e0-b95b-88b69b8d5c9a

-- ============ 1. TUT-KELUARGA-001 ============
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, status, created_by, updated_by)
VALUES ('0c7e100b-2e24-4a2a-955d-c0d626c10741', 'TUT-KELUARGA-001', 'b2222222-2222-2222-2222-222222222222',
'Mertua dan Menantu: Jaga Hubungan Tetap Harmonis', 'mertua-menantu-hubungan-harmonis',
'Panduan praktis menjaga hubungan baik dengan mertua: batasan sehat, komunikasi jujur, dan cara menyelesaikan konflik tanpa menyakiti.',
'id', 9, 'DRAFT', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (id) DO NOTHING;

INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
(gen_random_uuid(), '0c7e100b-2e24-4a2a-955d-c0d626c10741', 'HEADING', 1, jsonb_build_object('text', $$Masalah: Hubungan Menantu–Mertua yang Tegang$$)),
(gen_random_uuid(), '0c7e100b-2e24-4a2a-955d-c0d626c10741', 'PARAGRAPH', 2, jsonb_build_object('text', $$Banyak menantu merasa serba salah: dibilang kurang perhatian, dianggap tidak mandiri, atau cara mendidik anak dikritik. Mertua pun kadang merasa anaknya direbut. Ketegangan yang dibiarkan bisa merembet ke hubungan suami istri.$$)),
(gen_random_uuid(), '0c7e100b-2e24-4a2a-955d-c0d626c10741', 'HEADING', 3, jsonb_build_object('text', $$Penjelasan: Akar Konflik yang Sering Muncul$$)),
(gen_random_uuid(), '0c7e100b-2e24-4a2a-955d-c0d626c10741', 'PARAGRAPH', 4, jsonb_build_object('text', $$Akar konflik biasanya tiga: perbedaan generasi dalam pola asuh, perebutan peran sebagai pengambil keputusan rumah tangga, dan komunikasi yang tidak langsung. Ketiganya memburuk jika masing-masing pihak memendam rasa.$$)),
(gen_random_uuid(), '0c7e100b-2e24-4a2a-955d-c0d626c10741', 'HEADING', 5, jsonb_build_object('text', $$Persiapan: Modal Sebelum Bertemu$$)),
(gen_random_uuid(), '0c7e100b-2e24-4a2a-955d-c0d626c10741', 'LIST', 6, jsonb_build_object('items', ARRAY[$$Kesepakatan dengan pasangan: satu suara, satu strategi$$, $$Daftar batasan rumah tangga yang disepakati berdua$$, $$Sikap tenang dan niat baik yang konsisten$$])),
(gen_random_uuid(), '0c7e100b-2e24-4a2a-955d-c0d626c10741', 'HEADING', 7, jsonb_build_object('text', $$Langkah: Cara Menjaga Harmoni$$)),
(gen_random_uuid(), '0c7e100b-2e24-4a2a-955d-c0d626c10741', 'LIST', 8, jsonb_build_object('items', ARRAY[$$1. Hormati cara mertua, tapi tetapkan batas: Dengarkan saran, pilih yang cocok, sampaikan keputusan dengan sopan$$, $$2. Ajak pasangan jadi jembatan: masalah dengan mertua dibicarakan lewat pasangan dulu, bukan konfrontasi langsung$$, $$3. Beri peran yang dihargai: minta mertua membantu hal yang ia kuasai, misalnya resep masakan$$, $$4. Jangan bawa konflik ke media sosial$$, $$5. Rutin silaturahmi tanpa agenda berat: makan bersama santai lebih baik daripada kunjungan formal yang kaku$$])),
(gen_random_uuid(), '0c7e100b-2e24-4a2a-955d-c0d626c10741', 'HEADING', 9, jsonb_build_object('text', $$Risiko: Yang Perlu Diwaspadai$$)),
(gen_random_uuid(), '0c7e100b-2e24-4a2a-955d-c0d626c10741', 'PARAGRAPH', 10, jsonb_build_object('text', $$Risiko terbesar adalah pasangan yang tidak kompak — mertua akan memanfaatkan celah itu tanpa sadar. Hindari juga curhat masalah mertua ke keluarga kandung sendiri karena hanya memperkeruh. Jika konflik sudah melibatkan kekerasan verbal, jangan selesaikan sendiri, cari bantuan konselor.$$)),
(gen_random_uuid(), '0c7e100b-2e24-4a2a-955d-c0d626c10741', 'HEADING', 11, jsonb_build_object('text', $$Penyelesaian: Ukur Keberhasilannya$$)),
(gen_random_uuid(), '0c7e100b-2e24-4a2a-955d-c0d626c10741', 'PARAGRAPH', 12, jsonb_build_object('text', $$Hubungan dikatakan sehat jika pertemuan keluarga tidak lagi menegangkan, saran mertua bisa didiskusikan tanpa emosi, dan pasangan merasa didukung bukan dijepit. Harmoni bukan berarti selalu setuju, melainkan mampu berbeda tanpa menyakiti.$$))
ON CONFLICT (id) DO NOTHING;

-- ============ 2. TUT-HEMAT-001 ============
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, status, created_by, updated_by)
VALUES ('a2e82c6b-cc44-4daa-a19b-eab820db5af6', 'TUT-HEMAT-001', 'b7777777-7777-7777-7777-777777777777',
'Hemat Listrik: Turunkan Tagihan 30%', 'hemat-listrik-turunkan-tagihan-30-persen',
'Strategi menurunkan tagihan listrik hingga 30%: audit pemakaian, ganti kebiasaan, dan pilih perangkat hemat energi.',
'id', 8, 'DRAFT', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (id) DO NOTHING;

INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
(gen_random_uuid(), 'a2e82c6b-cc44-4daa-a19b-eab820db5af6', 'HEADING', 1, jsonb_build_object('text', $$Masalah: Tagihan Listrik Membengkak$$)),
(gen_random_uuid(), 'a2e82c6b-cc44-4daa-a19b-eab820db5af6', 'PARAGRAPH', 2, jsonb_build_object('text', $$Tagihan listrik naik setiap bulan padahal pemakaian terasa sama. AC, kulkas, dan pompa air biasanya menyumbang 60–70 persen konsumsi rumah tangga, sisanya bocor lewat perangkat siaga (standby) yang tidak pernah dicabut.$$)),
(gen_random_uuid(), 'a2e82c6b-cc44-4daa-a19b-eab820db5af6', 'HEADING', 3, jsonb_build_object('text', $$Penjelasan: Ke Mana Perginya Listrik$$)),
(gen_random_uuid(), 'a2e82c6b-cc44-4daa-a19b-eab820db5af6', 'PARAGRAPH', 4, jsonb_build_object('text', $$Daya (watt) dikali jam pemakaian menghasilkan energi (kWh) yang ditagih. Perangkat 1000 watt yang menyala 3 jam sehari menghabiskan 3 kWh per hari atau sekitar 90 kWh per bulan. Pemahaman ini membuat penghematan bisa dihitung, bukan sekadar dugaan.$$)),
(gen_random_uuid(), 'a2e82c6b-cc44-4daa-a19b-eab820db5af6', 'HEADING', 5, jsonb_build_object('text', $$Alat yang Dibutuhkan$$)),
(gen_random_uuid(), 'a2e82c6b-cc44-4daa-a19b-eab820db5af6', 'LIST', 6, jsonb_build_object('items', ARRAY[$$Struk tagihan 3 bulan terakhir$$, $$Stopkontak dengan saklar (untuk memutus siaga)$$, $$Lampu LED pengganti$$])),
(gen_random_uuid(), 'a2e82c6b-cc44-4daa-a19b-eab820db5af6', 'HEADING', 7, jsonb_build_object('text', $$Langkah Penghematan$$)),
(gen_random_uuid(), 'a2e82c6b-cc44-4daa-a19b-eab820db5af6', 'LIST', 8, jsonb_build_object('items', ARRAY[$$1. AC: naikkan suhu ke 25–26°C, bersihkan filter tiap 2 bulan — hemat 10–15 persen$$, $$2. Kulkas: jangan buka terlalu lama, atur suhu 3–4°C, jauhkan dari dinding agar sirkulasi baik$$, $$3. Matikan total perangkat siaga: TV, charger, dan dispenser yang standby bisa memakan 5–10 persen tagihan$$, $$4. Ganti semua lampu ke LED: konsumsi turun hingga 80 persen dibanding pijar$$, $$5. Cuci dan setrika menumpuk di satu jadwal untuk menghindari pemanasan ulang$$, $$6. Pompa air: periksa kebocoran pipa — pompa yang sering hidup-mati memboroskan listrik$$])),
(gen_random_uuid(), 'a2e82c6b-cc44-4daa-a19b-eab820db5af6', 'HEADING', 9, jsonb_build_object('text', $$Risiko: Jangan Kebablasan$$)),
(gen_random_uuid(), 'a2e82c6b-cc44-4daa-a19b-eab820db5af6', 'PARAGRAPH', 10, jsonb_build_object('text', $$Jangan mematikan kulkas berjam-jam untuk menghemat — makanan basi dan kompresor bekerja lebih keras saat dinyalakan kembali. Hindari juga colokan bertumpuk berlebihan saat mematikan siaga sekaligus karena risiko panas berlebih.$$)),
(gen_random_uuid(), 'a2e82c6b-cc44-4daa-a19b-eab820db5af6', 'HEADING', 11, jsonb_build_object('text', $$Penyelesaian: Hitung Hasilnya$$)),
(gen_random_uuid(), 'a2e82c6b-cc44-4daa-a19b-eab820db5af6', 'PARAGRAPH', 12, jsonb_build_object('text', $$Bandingkan tagihan bulan ini dengan rata-rata 3 bulan sebelumnya. Penurunan 20–30 persen adalah target realistis dalam 2 bulan. Jika tagihan tidak turun, kemungkinan ada perangkat rusak (misalnya kulkas bocor freon) — saatnya panggil teknisi.$$))
ON CONFLICT (id) DO NOTHING;

-- ============ 3. EXP-LINGUISTIK-001 ============
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, status, created_by, updated_by)
VALUES ('74714261-b80b-4694-886a-f2e3becac17a', 'EXP-LINGUISTIK-001', 'c8888888-8888-8888-8888-888888888888',
'Bahasa Indonesia: Dari Melayu ke Bahasa Persatuan', 'bahasa-indonesia-dari-melayu-ke-bahasa-persatuan',
'Sejarah bahasa Indonesia: dari bahasa Melayu pasar menjadi bahasa persatuan melalui Sumpah Pemuda 1928 hingga bahasa resmi negara.',
'id', 7, 'DRAFT', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (id) DO NOTHING;

INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
(gen_random_uuid(), '74714261-b80b-4694-886a-f2e3becac17a', 'HEADING', 1, jsonb_build_object('text', $$Akar: Bahasa Melayu sebagai Lingua Franca$$)),
(gen_random_uuid(), '74714261-b80b-4694-886a-f2e3becac17a', 'PARAGRAPH', 2, jsonb_build_object('text', $$Jauh sebelum Indonesia merdeka, bahasa Melayu sudah menjadi bahasa pergaulan (lingua franca) di kepulauan Nusantara. Para pedagang dari Arab, Tiongkok, India, dan Eropa menggunakannya di pelabuhan-pelabuhan dagang. Melayu dipilih karena strukturnya relatif sederhana dan tidak terikat kasta seperti bahasa Jawa.$$)),
(gen_random_uuid(), '74714261-b80b-4694-886a-f2e3becac17a', 'HEADING', 3, jsonb_build_object('text', $$Titik Balik: Sumpah Pemuda 1928$$)),
(gen_random_uuid(), '74714261-b80b-4694-886a-f2e3becac17a', 'PARAGRAPH', 4, jsonb_build_object('text', $$Pada 28 Oktober 1928, Kongres Pemuda II mengikrarkan: "Kami putra dan putri Indonesia menjunjung bahasa persatuan, bahasa Indonesia." Sejak saat itu bahasa Melayu resmi menyandang nama baru: bahasa Indonesia. Ini keputusan politik yang jenius — bahasa mayoritas Jawa tidak dipilih agar tidak ada suku yang merasa dikuasai.$$)),
(gen_random_uuid(), '74714261-b80b-4694-886a-f2e3becac17a', 'HEADING', 5, jsonb_build_object('text', $$Standardisasi: Ejaan dan Tata Bahasa$$)),
(gen_random_uuid(), '74714261-b80b-4694-886a-f2e3becac17a', 'PARAGRAPH', 6, jsonb_build_object('text', $$Bahasa Indonesia mengalami beberapa sistem ejaan: Van Ophuijsen (1901), Soewandi (1947), hingga Ejaan Yang Disempurnakan (1972) yang dipakai sekarang dengan penyesuaian. Badan Bahasa terus memutakhirkan kosakata — kata seperti "gawai", "daring", dan "swafoto" adalah hasil penyerapan resmi era digital.$$)),
(gen_random_uuid(), '74714261-b80b-4694-886a-f2e3becac17a', 'HEADING', 7, jsonb_build_object('text', $$Ciri Khas Bahasa Indonesia$$)),
(gen_random_uuid(), '74714261-b80b-4694-886a-f2e3becac17a', 'LIST', 8, jsonb_build_object('items', ARRAY[$$Tidak mengenal tingkatan tutur (kasta bahasa) seperti Jawa atau Sunda$$, $$Sistem imbuhan (afiks) yang produktif: me-, di-, ber-, -kan, ke-an$$, $$Sangat terbuka terhadap serapan: Sanskerta, Arab, Belanda, Portugis, Inggris$$, $$Ejaan relatif fonetis: ditulis seperti dibaca$$])),
(gen_random_uuid(), '74714261-b80b-4694-886a-f2e3becac17a', 'HEADING', 9, jsonb_build_object('text', $$Status Kini: Bahasa ke-10 Terbesar Dunia$$)),
(gen_random_uuid(), '74714261-b80b-4694-886a-f2e3becac17a', 'PARAGRAPH', 10, jsonb_build_object('text', $$Dengan lebih dari 270 juta penutur, bahasa Indonesia termasuk 10 bahasa dengan penutur terbanyak di dunia. Pada 2023, UNESCO menetapkannya sebagai bahasa resmi Sidang Umum — pengakuan internasional atas peran bahasa Indonesia. Tantangannya kini: menjaga mutu di tengah banjir bahasa gaul dan campur kode di media sosial.$$))
ON CONFLICT (id) DO NOTHING;

-- ============ 4. EXP-KEDOKTERAN-001 ============
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, status, created_by, updated_by)
VALUES ('47048fa4-89e6-492b-97f1-9cde7ecf9074', 'EXP-KEDOKTERAN-001', 'c2222222-2222-2222-2222-222222222222',
'Vaksin: Cara Kerja dan Mengapa Penting', 'vaksin-cara-kerja-dan-mengapa-penting',
'Penjelasan ilmiah cara kerja vaksin: melatih sistem imun tanpa harus sakit dulu, jenis-jenis vaksin, dan konsep kekebalan kelompok.',
'id', 8, 'DRAFT', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (id) DO NOTHING;

INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
(gen_random_uuid(), '47048fa4-89e6-492b-97f1-9cde7ecf9074', 'HEADING', 1, jsonb_build_object('text', $$Prinsip Dasar: Latihan Tanpa Perang$$)),
(gen_random_uuid(), '47048fa4-89e6-492b-97f1-9cde7ecf9074', 'PARAGRAPH', 2, jsonb_build_object('text', $$Vaksin bekerja seperti latihan militer bagi sistem imun. Ia memperkenalkan "musuh tiruan" — kuman yang dilemahkan, dimatikan, atau hanya potongan proteinnya — sehingga tubuh belajar mengenalinya dan membentuk sel memori. Ketika kuman asli datang, pertahanan sudah siap dan penyakit bisa dicegah atau diperingan.$$)),
(gen_random_uuid(), '47048fa4-89e6-492b-97f1-9cde7ecf9074', 'HEADING', 3, jsonb_build_object('text', $$Sejarah Singkat: Dari Cacar Sapi$$)),
(gen_random_uuid(), '47048fa4-89e6-492b-97f1-9cde7ecf9074', 'PARAGRAPH', 4, jsonb_build_object('text', $$Pada 1796, Edward Jenner memperhatikan pemerah susu yang terkena cacar sapi kebal terhadap cacar manusia yang mematikan. Ia menguji pemberian cacar sapi ke seorang anak — dan anak itu kebal. Dari sinilah kata "vaksin" lahir (dari vacca, bahasa Latin untuk sapi). Cacar kini menjadi satu-satunya penyakit manusia yang berhasil dimusnahkan total lewat vaksinasi.$$)),
(gen_random_uuid(), '47048fa4-89e6-492b-97f1-9cde7ecf9074', 'HEADING', 5, jsonb_build_object('text', $$Jenis-Jenis Vaksin$$)),
(gen_random_uuid(), '47048fa4-89e6-492b-97f1-9cde7ecf9074', 'LIST', 6, jsonb_build_object('items', ARRAY[$$Vaksin hidup dilemahkan: campak, BCG — daya tahan lama, tidak untuk ibu hamil$$, $$Vaksin mati/inaktif: polio suntik, hepatitis A — aman tapi perlu booster$$, $$Vaksin subunit/protein: hepatitis B, HPV — hanya potongan kuman$$, $$Vaksin mRNA: sebagian vaksin COVID-19 — memberi "resep" protein ke sel tubuh$$])),
(gen_random_uuid(), '47048fa4-89e6-492b-97f1-9cde7ecf9074', 'HEADING', 7, jsonb_build_object('text', $$Kekebalan Kelompok (Herd Immunity)$$)),
(gen_random_uuid(), '47048fa4-89e6-492b-97f1-9cde7ecf9074', 'PARAGRAPH', 8, jsonb_build_object('text', $$Ketika 80–95 persen populasi kebal, kuman kehabisan "jembatan" untuk menyebar. Inilah yang melindungi bayi yang belum bisa divaksin dan orang dengan gangguan imun. Sebaliknya, jika cakupan turun di bawah ambang, penyakit yang hampir hilang bisa kembali mewabah — seperti yang terjadi pada campak di beberapa daerah.$$)),
(gen_random_uuid(), '47048fa4-89e6-492b-97f1-9cde7ecf9074', 'HEADING', 9, jsonb_build_object('text', $$Efek Samping: Fakta vs Mitos$$)),
(gen_random_uuid(), '47048fa4-89e6-492b-97f1-9cde7ecf9074', 'PARAGRAPH', 10, jsonb_build_object('text', $$Efek samping umum — demam ringan, nyeri di bekas suntikan — justru tanda sistem imun sedang bekerja dan hilang dalam 1–2 hari. Klaim bahwa vaksin menyebabkan autisme berasal dari satu penelitian tahun 1998 yang sudah ditarik dan terbukti curang; puluhan studi besar setelahnya tidak menemukan kaitan. Risiko penyakit aslinya selalu jauh lebih besar daripada risiko vaksinnya.$$))
ON CONFLICT (id) DO NOTHING;

-- ============ 5. SCH-SMP-GEO-001 ============
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, status, created_by, updated_by)
VALUES ('3eeda131-0baf-4fa3-883c-161873c7c487', 'SCH-SMP-GEO-001', 'd4444444-4444-4444-4444-444444444444',
'IPS Kelas 9: Benua dan Samudra', 'ips-kelas-9-benua-dan-samudra',
'Materi IPS kelas 9: tujuh benua dan lima samudra, ciri khas masing-masing, serta letak astronomis Indonesia.',
'id', 9, 'DRAFT', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (id) DO NOTHING;

INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
(gen_random_uuid(), '3eeda131-0baf-4fa3-883c-161873c7c487', 'HEADING', 1, jsonb_build_object('text', $$Tujuan Pembelajaran$$)),
(gen_random_uuid(), '3eeda131-0baf-4fa3-883c-161873c7c487', 'PARAGRAPH', 2, jsonb_build_object('text', $$Setelah mempelajari materi ini, kamu dapat menyebutkan tujuh benua dan lima samudra, menjelaskan ciri khas masing-masing benua, serta memahami posisi Indonesia di antara keduanya.$$)),
(gen_random_uuid(), '3eeda131-0baf-4fa3-883c-161873c7c487', 'HEADING', 3, jsonb_build_object('text', $$Tujuh Benua$$)),
(gen_random_uuid(), '3eeda131-0baf-4fa3-883c-161873c7c487', 'LIST', 4, jsonb_build_object('items', ARRAY[$$Asia: terbesar (44,5 juta km²), tempat lahir peradaban dan agama-agama besar$$, $$Afrika: benua tertua, kaya tambang, Sungai Nil terpanjang di dunia$$, $$Amerika Utara: negara maju, Danau Superior danau air tawar terbesar$$, $$Amerika Selatan: Hutan Amazon paru-paru dunia$$, $$Eropa: terkecil kedua, pusat revolusi industri$$, $$Australia: benua sekaligus negara, fauna khas kanguru dan koala$$, $$Antarktika: benua es, tidak berpenghuni tetap, cadangan air tawar terbesar$$])),
(gen_random_uuid(), '3eeda131-0baf-4fa3-883c-161873c7c487', 'HEADING', 5, jsonb_build_object('text', $$Lima Samudra$$)),
(gen_random_uuid(), '3eeda131-0baf-4fa3-883c-161873c7c487', 'LIST', 6, jsonb_build_object('items', ARRAY[$$Pasifik: terbesar dan terdalam (Palung Mariana 11 km)$$, $$Atlantik: jalur perdagangan tersibuk$$, $$Hindia: mengapit Indonesia di selatan$$, $$Arktik: samudra es di kutub utara$$, $$Selatan: mengelilingi Antarktika$$])),
(gen_random_uuid(), '3eeda131-0baf-4fa3-883c-161873c7c487', 'HEADING', 7, jsonb_build_object('text', $$Indonesia: di Persimpangan Benua dan Samudra$$)),
(gen_random_uuid(), '3eeda131-0baf-4fa3-883c-161873c7c487', 'PARAGRAPH', 8, jsonb_build_object('text', $$Indonesia terletak di antara Benua Asia dan Australia, serta Samudra Pasifik dan Hindia. Letak astronomisnya 6°LU–11°LS dan 95°BT–141°BT. Posisi silang ini membuat Indonesia menjadi jalur perdagangan dunia dan memiliki keanekaragaman hayati yang luar biasa.$$)),
(gen_random_uuid(), '3eeda131-0baf-4fa3-883c-161873c7c487', 'HEADING', 9, jsonb_build_object('text', $$Contoh: Menghafal dengan Peta$$)),
(gen_random_uuid(), '3eeda131-0baf-4fa3-883c-161873c7c487', 'PARAGRAPH', 10, jsonb_build_object('text', $$Ambil peta dunia buta (tanpa nama). Tunjuk tiap benua sambil menyebut cirinya: "Asia — terbesar", "Afrika — Nil", dan seterusnya. Ulangi 3 kali. Cara ini jauh lebih efektif daripada menghafal daftar tanpa peta.$$)),
(gen_random_uuid(), '3eeda131-0baf-4fa3-883c-161873c7c487', 'HEADING', 11, jsonb_build_object('text', $$Latihan Soal$$)),
(gen_random_uuid(), '3eeda131-0baf-4fa3-883c-161873c7c487', 'LIST', 12, jsonb_build_object('items', ARRAY[$$1. Sebutkan 7 benua dari yang terbesar!$$, $$2. Samudra apa yang mengapit Indonesia di sebelah selatan?$$, $$3. Benua apa yang tidak berpenghuni tetap dan mengapa?$$])),
(gen_random_uuid(), '3eeda131-0baf-4fa3-883c-161873c7c487', 'HEADING', 13, jsonb_build_object('text', $$Kunci Jawaban$$)),
(gen_random_uuid(), '3eeda131-0baf-4fa3-883c-161873c7c487', 'LIST', 14, jsonb_build_object('items', ARRAY[$$1. Asia, Afrika, Amerika Utara, Amerika Selatan, Antarktika, Eropa, Australia$$, $$2. Samudra Hindia$$, $$3. Antarktika — tertutup es, suhu ekstrem, tidak cocok untuk permukiman$$]))
ON CONFLICT (id) DO NOTHING;

-- ============ 6. SCH-SD-BIN3-001 ============
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, status, created_by, updated_by)
VALUES ('02baf5a7-cbc3-45a7-aeaa-81a4172c4fca', 'SCH-SD-BIN3-001', 'd3333333-3333-3333-3333-333333333333',
'Bahasa Indonesia Kelas 4: Karangan Narasi', 'bahasa-indonesia-kelas-4-karangan-narasi',
'Materi bahasa Indonesia kelas 4: menulis karangan narasi — pengertian, struktur, ciri bahasa, contoh, dan latihan.',
'id', 9, 'DRAFT', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (id) DO NOTHING;

INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
(gen_random_uuid(), '02baf5a7-cbc3-45a7-aeaa-81a4172c4fca', 'HEADING', 1, jsonb_build_object('text', $$Tujuan Pembelajaran$$)),
(gen_random_uuid(), '02baf5a7-cbc3-45a7-aeaa-81a4172c4fca', 'PARAGRAPH', 2, jsonb_build_object('text', $$Setelah belajar, kamu dapat menjelaskan pengertian karangan narasi, menyebutkan strukturnya, dan menulis karangan narasi sederhana tentang pengalamanmu sendiri.$$)),
(gen_random_uuid(), '02baf5a7-cbc3-45a7-aeaa-81a4172c4fca', 'HEADING', 3, jsonb_build_object('text', $$Apa Itu Karangan Narasi?$$)),
(gen_random_uuid(), '02baf5a7-cbc3-45a7-aeaa-81a4172c4fca', 'PARAGRAPH', 4, jsonb_build_object('text', $$Narasi adalah karangan yang menceritakan suatu kejadian atau peristiwa secara runtut dari awal sampai akhir, seperti sedang bercerita. Contoh: cerita liburan, pengalaman pertama naik sepeda, atau dongeng. Berbeda dengan deskripsi yang melukiskan, narasi menekankan urutan kejadian.$$)),
(gen_random_uuid(), '02baf5a7-cbc3-45a7-aeaa-81a4172c4fca', 'HEADING', 5, jsonb_build_object('text', $$Struktur Karangan Narasi$$)),
(gen_random_uuid(), '02baf5a7-cbc3-45a7-aeaa-81a4172c4fca', 'LIST', 6, jsonb_build_object('items', ARRAY[$$Orientasi (pembuka): siapa, kapan, di mana — contoh: "Liburan lalu, aku pergi ke rumah nenek di desa"$$, $$Komplikasi (masalah): kejadian seru atau masalah — contoh: "Di tengah jalan, sepedaku bocor"$$, $$Resolusi (penyelesaian): bagaimana masalah selesai — contoh: "Untung ada bengkel dekat sawah"$$, $$Koda (penutup, boleh ada): pesan atau kesan — contoh: "Sejak itu aku selalu membawa pompa mini"$$])),
(gen_random_uuid(), '02baf5a7-cbc3-45a7-aeaa-81a4172c4fca', 'HEADING', 7, jsonb_build_object('text', $$Ciri Bahasa Narasi$$)),
(gen_random_uuid(), '02baf5a7-cbc3-45a7-aeaa-81a4172c4fca', 'LIST', 8, jsonb_build_object('items', ARRAY[$$Menggunakan kata kerja tindakan: pergi, berlari, menangis$$, $$Menggunakan kata keterangan waktu: kemarin, tiba-tiba, akhirnya$$, $$Sudut pandang orang pertama (aku) atau ketiga (dia)$$])),
(gen_random_uuid(), '02baf5a7-cbc3-45a7-aeaa-81a4172c4fca', 'HEADING', 9, jsonb_build_object('text', $$Contoh Karangan Singkat$$)),
(gen_random_uuid(), '02baf5a7-cbc3-45a7-aeaa-81a4172c4fca', 'PARAGRAPH', 10, jsonb_build_object('text', $$"Pagi itu aku dan ayah memancing di sungai. Tiba-tiba pelampungku tenggelam! Aku menarik sekuat tenaga. Ternyata ikan nila besar! Ayah tertawa bangga. Kami pulang membawa tiga ekor ikan. Ibu menggorengnya untuk makan malam. Hari yang menyenangkan." — Perhatikan: ada orientasi (pagi, sungai), komplikasi (pelampung tenggelam), resolusi (dapat ikan).$$)),
(gen_random_uuid(), '02baf5a7-cbc3-45a7-aeaa-81a4172c4fca', 'HEADING', 11, jsonb_build_object('text', $$Latihan$$)),
(gen_random_uuid(), '02baf5a7-cbc3-45a7-aeaa-81a4172c4fca', 'LIST', 12, jsonb_build_object('items', ARRAY[$$1. Tulis karangan narasi 3 paragraf tentang pengalamanmu yang paling berkesan!$$, $$2. Tandai bagian orientasi, komplikasi, dan resolusi dalam karanganmu!$$, $$3. Ganti 3 kata kerja biasa menjadi kata kerja yang lebih hidup (contoh: "jalan" menjadi "bergegas")!$$])),
(gen_random_uuid(), '02baf5a7-cbc3-45a7-aeaa-81a4172c4fca', 'HEADING', 13, jsonb_build_object('text', $$Kunci dan Penilaian$$)),
(gen_random_uuid(), '02baf5a7-cbc3-45a7-aeaa-81a4172c4fca', 'PARAGRAPH', 14, jsonb_build_object('text', $$Karangan yang baik memuat ketiga struktur (orientasi, komplikasi, resolusi) secara runtut, memakai kata keterangan waktu, dan ejaan yang benar. Minta guru atau orang tuamu memeriksa: apakah ceritamu mudah diikuti dari awal sampai akhir?$$))
ON CONFLICT (id) DO NOTHING;
