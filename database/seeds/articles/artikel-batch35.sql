-- Batch 35: 6 artikel baru (idempotent, aman dijalankan ulang)
-- Owner: f7125028-187e-44e0-b95b-88b69b8d5c9a

-- ============ 1. TUT-BAHASA3-001 ============
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, status, created_by, updated_by)
SELECT gen_random_uuid(), 'TUT-BAHASA3-001', 'b6666666-6666-6666-6666-666666666666',
  'Bahasa Korea Dasar: Hangul dan Sapaan',
  'bahasa-korea-dasar-hangul-dan-sapaan',
  'Panduan pemula menguasai huruf Hangul dan sapaan dasar bahasa Korea dalam langkah sederhana.',
  'id', 'DRAFT',
  'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a'
WHERE NOT EXISTS (SELECT 1 FROM madevi.articles WHERE business_code = 'TUT-BAHASA3-001');

INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content)
SELECT gen_random_uuid(), a.id, x.block_type, x.position, x.content
FROM madevi.articles a
CROSS JOIN (VALUES
  ('HEADING', 0, jsonb_build_object('text', $$Masalah: Huruf Korea Terlihat Menakutkan$$)),
  ('PARAGRAPH', 1, jsonb_build_object('text', $$Banyak orang ingin belajar bahasa Korea karena K-drama atau K-pop, tapi langsung mundur begitu melihat huruf Hangul. Padahal Hangul justru salah satu sistem tulis paling logis di dunia. Ia bukan huruf bergambar seperti aksara Mandarin, melainkan alfabet fonetik: setiap simbol melambangkan bunyi. Raja Sejong dari Joseon menciptakannya pada tahun 1443 agar rakyat biasa bisa belajar membaca. Jika kamu bisa membaca alfabet Latin, kamu sanggup menguasai Hangul dalam hitungan hari, bukan bulan.$$)),
  ('HEADING', 2, jsonb_build_object('text', $$Persiapan Alat$$)),
  ('LIST', 3, jsonb_build_object('text', $$Aplikasi kamus Korea-Indonesia (misalnya Naver Dictionary versi web).||Kartu hafalan (flashcard) fisik atau digital untuk latihan konsonan dan vokal.||Buku catatan khusus untuk menulis ulang setiap huruf sampai tangan terbiasa.||Video pelafalan dari penutur asli agar telinga terbiasa dengan bunyi yang tidak ada di bahasa Indonesia.$$)),
  ('HEADING', 4, jsonb_build_object('text', $$Langkah 1: Kuasai 14 Konsonan Dasar$$)),
  ('PARAGRAPH', 5, jsonb_build_object('text', $$Konsonan dasar Hangul berjumlah 14: ㄱ (g/k), ㄴ (n), ㄷ (d/t), ㄹ (r/l), ㅁ (m), ㅂ (b/p), ㅅ (s), ㅇ (ng/senyap di awal suku kata), ㅈ (j), ㅊ (ch), ㅋ (kh), ㅌ (th), ㅍ (ph), ㅎ (h). Bentuknya meniru posisi mulut dan lidah saat mengucapkan bunyinya. Latih dengan menulis setiap huruf 20 kali sambil mengucapkan bunyinya keras-keras. Jangan hafal berurutan saja; acak urutannya dengan flashcard supaya ingatanmu tidak bergantung pada pola urutan.$$)),
  ('HEADING', 6, jsonb_build_object('text', $$Langkah 2: Kuasai 10 Vokal Dasar$$)),
  ('PARAGRAPH', 7, jsonb_build_object('text', $$Vokal dasar ada 10: ㅏ (a), ㅑ (ya), ㅓ (eo, seperti e pepet), ㅕ (yeo), ㅗ (o), ㅛ (yo), ㅜ (u), ㅠ (yu), ㅡ (eu, vokal khas Korea), ㅣ (i). Vokal digabung dengan konsonan membentuk suku kata dalam satu kotak, misalnya 가 dibaca "ga" dan 한 dibaca "han". Latih membaca kata sederhana seperti 한국 (hanguk = Korea) dan 사랑 (sarang = cinta). Target realistis: dalam 3 hari kamu sudah bisa membaca tulisan Korea walau belum paham artinya.$$)),
  ('HEADING', 8, jsonb_build_object('text', $$Langkah 3: Hafalkan Sapaan Dasar$$)),
  ('LIST', 9, jsonb_build_object('text', $$안녕하세요 (annyeonghaseyo) — halo / selamat pagi-siang-sore, bentuk sopan.||감사합니다 (gamsahamnida) — terima kasih, bentuk formal.||죄송합니다 (joesonghamnida) — maaf, bentuk formal.||네 / 아니요 (ne / aniyo) — ya / tidak.||제 이름은 ... 입니다 (je ireumeun ... imnida) — nama saya ....||한국어를 배우고 있어요 (hangugeoreul baeugo isseoyo) — saya sedang belajar bahasa Korea.$$)),
  ('HEADING', 10, jsonb_build_object('text', $$Risiko dan Kesalahan Umum$$)),
  ('PARAGRAPH', 11, jsonb_build_object('text', $$Penyelesaian: konsistensi mengalahkan intensitas. Latih 15 menit setiap hari lebih efektif daripada 3 jam seminggu sekali. Kesalahan umum pemula: (1) mengabaikan pelafalan ㅓ/ㅗ dan ㅡ yang tidak ada padanannya di Indonesia — dengarkan audio penutur asli; (2) langsung menghafal kosakata tanpa menguasai Hangul — hasilnya kamu tergantung romanisasi selamanya; (3) malu berbicara — cari teman latihan atau rekam suaramu sendiri. Checklist selesai: kamu bisa membaca paragraf Korea sederhana tanpa romanisasi, menulis namamu dalam Hangul, dan melakukan perkenalan diri 1 menit. Setelah itu lanjut ke tata bahasa dasar seperti partikel 은/는 dan 이/가.$$))
) AS x(block_type, position, content)
WHERE a.business_code = 'TUT-BAHASA3-001'
AND NOT EXISTS (SELECT 1 FROM madevi.article_blocks b WHERE b.article_id = a.id);

-- ============ 2. TUT-KOMPUTER4-001 ============
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, status, created_by, updated_by)
SELECT gen_random_uuid(), 'TUT-KOMPUTER4-001', 'baaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  'PowerPoint Menarik: Desain Presentasi yang Tidak Membosankan',
  'powerpoint-menarik-desain-presentasi',
  'Teknik praktis membuat slide presentasi yang jelas, menarik, dan membuat audiens tetap fokus.',
  'id', 'DRAFT',
  'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a'
WHERE NOT EXISTS (SELECT 1 FROM madevi.articles WHERE business_code = 'TUT-KOMPUTER4-001');

INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content)
SELECT gen_random_uuid(), a.id, x.block_type, x.position, x.content
FROM madevi.articles a
CROSS JOIN (VALUES
  ('HEADING', 0, jsonb_build_object('text', $$Masalah: Slide Membosankan, Audiens Tertidur$$)),
  ('PARAGRAPH', 1, jsonb_build_object('text', $$Hampir semua orang pernah duduk di presentasi yang slidenya penuh teks kecil, dibacakan kata per kata oleh pembicara, lalu setengah ruangan mulai main ponsel. Masalahnya bukan pada topiknya, melainkan pada desain slide. Slide yang baik bukan dokumen yang diproyeksikan ke layar, melainkan alat bantu visual yang memperkuat ucapan pembicara. Kabar baiknya: kamu tidak perlu bakat desain untuk membuat slide yang bagus. Kamu hanya perlu mengikuti beberapa prinsip sederhana yang terbukti bekerja.$$)),
  ('HEADING', 2, jsonb_build_object('text', $$Persiapan Alat$$)),
  ('LIST', 3, jsonb_build_object('text', $$Microsoft PowerPoint atau Google Slides (gratis) sebagai aplikasi utama.||Sumber gambar gratis berkualitas seperti Unsplash atau Pexels untuk visual pendukung.||Palet warna sederhana: pilih 1 warna utama, 1 warna aksen, plus hitam-putih.||Font yang mudah dibaca dari jauh, misalnya Montserrat, Lato, atau Calibri ukuran minimal 24pt.$$)),
  ('HEADING', 4, jsonb_build_object('text', $$Langkah 1: Satu Slide, Satu Ide$$)),
  ('PARAGRAPH', 5, jsonb_build_object('text', $$Aturan emas presentasi: setiap slide hanya menyampaikan satu gagasan. Jika sebuah slide butuh dua judul, pecah menjadi dua slide. Otak audiens memproses informasi visual dan verbal secara bersamaan; slide yang padat memaksa mereka memilih antara membaca slide atau mendengarkanmu, dan kamu kalah di keduanya. Buang semua kalimat lengkap, sisakan kata kunci dan frasa pendek. Detail penjelasan ada di mulutmu, bukan di layar.$$)),
  ('HEADING', 6, jsonb_build_object('text', $$Langkah 2: Perbesar Visual, Perkecil Teks$$)),
  ('PARAGRAPH', 7, jsonb_build_object('text', $$Ganti paragraf dengan gambar, ikon, atau grafik yang relevan. Satu foto besar yang tepat lebih kuat daripada sepuluh bullet point. Untuk data angka, gunakan grafik batang atau garis sederhana, bukan tabel mentah. Pastikan kontras warna cukup: teks gelap di latar terang, atau teks putih di latar gelap. Beri ruang kosong (white space) yang lega; slide yang sesak terlihat murah dan melelahkan dibaca. Ukuran font judul minimal 32pt dan isi minimal 24pt agar terbaca dari baris belakang.$$)),
  ('HEADING', 8, jsonb_build_object('text', $$Langkah 3: Konsisten dari Awal sampai Akhir$$)),
  ('PARAGRAPH', 9, jsonb_build_object('text', $$Pilih satu template dan pakai untuk seluruh presentasi: posisi judul sama, gaya bullet sama, warna sama. Konsistensi membuat presentasi terlihat profesional walau desainnya sederhana. Batasi animasi dan transisi: gunakan hanya "Fade" atau "Appear" yang halus, dan hanya bila ada alasan (misalnya memunculkan poin satu per satu agar audiens tidak membaca duluan). Hindari animasi berputar, memantul, atau suara efek yang mengalihkan perhatian dari isi.$$)),
  ('HEADING', 10, jsonb_build_object('text', $$Risiko: Jebakan yang Sering Terjadi$$)),
  ('LIST', 11, jsonb_build_object('text', $$Membaca slide kata per kata — audiens bisa membaca sendiri dan akan merasa direndahkan.||Menjejalkan 8 baris teks kecil — tidak ada yang bisa membacanya dari jarak 5 meter.||Clip art dan template bawaan yang norak — merusak kredibilitas seketika.||Terlalu banyak warna dan font berbeda — terlihat kacau dan tidak fokus.||Slide "terima kasih" sebagai penutup — ganti dengan slide kesimpulan berisi pesan utama yang ingin diingat audiens. Selesaikan dengan checklist: setiap slide lolos uji "dapat dipahami dalam 3 detik", total teks di bawah 40 kata per slide, dan kamu sudah latihan dengan timer sebelum tampil.$$))
) AS x(block_type, position, content)
WHERE a.business_code = 'TUT-KOMPUTER4-001'
AND NOT EXISTS (SELECT 1 FROM madevi.article_blocks b WHERE b.article_id = a.id);

-- ============ 3. EXP-ANTROPOLOGI4-001 ============
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, status, created_by, updated_by)
SELECT gen_random_uuid(), 'EXP-ANTROPOLOGI4-001', 'c8888888-8888-8888-8888-888888888888',
  'Suku Baduy: Masyarakat yang Menolak Modernisasi',
  'suku-baduy-menolak-modernisasi',
  'Mengenal masyarakat adat Baduy di Banten yang teguh menjaga tradisi di tengah arus modernisasi.',
  'id', 'DRAFT',
  'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a'
WHERE NOT EXISTS (SELECT 1 FROM madevi.articles WHERE business_code = 'EXP-ANTROPOLOGI4-001');

INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content)
SELECT gen_random_uuid(), a.id, x.block_type, x.position, x.content
FROM madevi.articles a
CROSS JOIN (VALUES
  ('HEADING', 0, jsonb_build_object('text', $$Siapa Suku Baduy?$$)),
  ('PARAGRAPH', 1, jsonb_build_object('text', $$Suku Baduy adalah masyarakat adat yang bermukim di Desa Kanekes, Kecamatan Leuwidamar, Kabupaten Lebak, Banten. Mereka menyebut diri Urang Kanekes. Populasinya sekitar belasan ribu jiwa yang hidup di kawasan pegunungan Kendeng. Yang membuat mereka istimewa: di tengah Indonesia yang serba digital, masyarakat Baduy secara sadar menolak sebagian besar teknologi modern demi menjaga adat warisan leluhur. Mereka bukan tertinggal zaman karena tidak tahu, melainkan memilih jalan hidup yang berbeda secara sadar.$$)),
  ('HEADING', 2, jsonb_build_object('text', $$Baduy Dalam dan Baduy Luar$$)),
  ('PARAGRAPH', 3, jsonb_build_object('text', $$Masyarakat Baduy terbagi dua. Baduy Dalam tinggal di tiga kampung inti (Cibeo, Cikertawana, Cikeusik) dan memegang adat paling ketat: dilarang memakai alas kaki, kendaraan, listrik, sabun, bahkan berfoto. Baduy Luar tinggal di puluhan kampung penyangga di sekelilingnya dengan aturan lebih longgar: boleh memakai pakaian berwarna, menerima tamu menginap, dan menggunakan sebagian barang modern. Keduanya dipimpin oleh Puun, pemimpin adat tertinggi yang keputusannya bersifat mutlak.$$)),
  ('HEADING', 4, jsonb_build_object('text', $$Pikukuh: Hukum Adat yang Sakral$$)),
  ('PARAGRAPH', 5, jsonb_build_object('text', $$Seluruh kehidupan Baduy diatur oleh pikukuh, hukum adat yang diwariskan turun-temurun. Isinya antara lain larangan mengubah bentuk alam: gunung tidak boleh dilebur, lembah tidak boleh ditimbun, dan hutan lindung tidak boleh dirusak. Mereka bertani dengan sistem ladang berpindah (huma) menanam padi huma setahun sekali tanpa pupuk kimia dan tanpa irigasi. Hasilnya mengejutkan para peneliti: hutan di wilayah Baduy termasuk yang paling lestari di Jawa, menjadi bukti bahwa kearifan adat bisa lebih efektif menjaga lingkungan daripada regulasi modern.$$)),
  ('HEADING', 6, jsonb_build_object('text', $$Kehidupan Sehari-hari$$)),
  ('PARAGRAPH', 7, jsonb_build_object('text', $$Rumah Baduy adalah rumah panggung dari bambu dan kayu dengan atap ijuk, menghadap utara-selatan. Pakaian khas mereka adalah baju kampret putih polos untuk Baduy Dalam dan batik biru tua untuk Baduy Luar, selalu tanpa jahitan kantong dan kancing. Mereka berjalan kaki ke mana-mana, termasuk saat menjual hasil kerajinan seperti kain tenun, koja (tas anyaman), dan madu hutan ke kota. Menariknya, meski menolak teknologi untuk diri sendiri, mereka tidak anti terhadap orang luar; wisatawan boleh berkunjung dengan aturan ketat, misalnya tidak boleh membawa sabun atau alat elektronik ke wilayah Baduy Dalam.$$)),
  ('HEADING', 8, jsonb_build_object('text', $$Pelajaran dari Baduy untuk Dunia Modern$$)),
  ('PARAGRAPH', 9, jsonb_build_object('text', $$Setiap tahun masyarakat Baduy juga menjalankan kawalu, masa puasa dan pantang tiga bulan tanpa tamu dari luar sebagai laku spiritual sekaligus masa istirahat lahan. Kisah Baduy menantang asumsi bahwa kemajuan selalu berarti mengadopsi teknologi terbaru: mereka membuktikan masyarakat bisa hidup sejahtera, rukun, dan lestari tanpa listrik dan gawai. Prinsipnya relevan untuk semua orang: konsumsi secukupnya, jaga hutan sebagai sumber kehidupan, dan pegang teguh nilai komunitas. Di era krisis iklim, kearifan seperti pikukuh Baduy justru dipelajari para ilmuwan lingkungan sebagai model konservasi berbasis masyarakat adat.$$))
) AS x(block_type, position, content)
WHERE a.business_code = 'EXP-ANTROPOLOGI4-001'
AND NOT EXISTS (SELECT 1 FROM madevi.article_blocks b WHERE b.article_id = a.id);

-- ============ 4. EXP-FISIKA6-001 ============
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, status, created_by, updated_by)
SELECT gen_random_uuid(), 'EXP-FISIKA6-001', 'c3333333-3333-3333-3333-333333333333',
  'Gelombang: Dari Suara hingga Cahaya',
  'gelombang-dari-suara-hingga-cahaya',
  'Memahami konsep gelombang, jenis-jenisnya, dan perannya dalam suara, cahaya, hingga teknologi modern.',
  'id', 'DRAFT',
  'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a'
WHERE NOT EXISTS (SELECT 1 FROM madevi.articles WHERE business_code = 'EXP-FISIKA6-001');

INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content)
SELECT gen_random_uuid(), a.id, x.block_type, x.position, x.content
FROM madevi.articles a
CROSS JOIN (VALUES
  ('HEADING', 0, jsonb_build_object('text', $$Apa Itu Gelombang?$$)),
  ('PARAGRAPH', 1, jsonb_build_object('text', $$Gelombang adalah getaran yang merambat membawa energi dari satu tempat ke tempat lain tanpa memindahkan materi secara permanen. Bayangkan sehelai tali yang kamu goyangkan: simpul-simpul tali bergerak naik turun di tempat, tetapi pola goyangannya berjalan sepanjang tali. Itulah esensi gelombang. Hampir semua informasi yang kamu terima setiap hari sampai lewat gelombang: suara lewat gelombang bunyi, gambar lewat gelombang cahaya, dan pesan WhatsApp lewat gelombang radio.$$)),
  ('HEADING', 2, jsonb_build_object('text', $$Dua Keluarga Besar Gelombang$$)),
  ('PARAGRAPH', 3, jsonb_build_object('text', $$Berdasarkan mediumnya, gelombang terbagi dua. Gelombang mekanik butuh medium untuk merambat, contohnya bunyi yang butuh udara dan gelombang air yang butuh air; di ruang hampa udara, bunyi tidak bisa terdengar. Gelombang elektromagnetik tidak butuh medium dan bisa merambat di ruang hampa dengan kecepatan cahaya, contohnya cahaya tampak, gelombang radio, sinar-X, dan sinar gamma. Berdasarkan arah getarnya, ada gelombang transversal (getaran tegak lurus arah rambat, seperti gelombang tali dan cahaya) dan gelombang longitudinal (getaran searah rambat, seperti bunyi yang merambat lewat rapatan dan regangan udara).$$)),
  ('HEADING', 4, jsonb_build_object('text', $$Besaran-besaran Gelombang$$)),
  ('PARAGRAPH', 5, jsonb_build_object('text', $$Setiap gelombang punya empat besaran kunci. Amplitudo adalah simpangan maksimum, menentukan kuat-lemahnya: pada bunyi berarti keras-pelan, pada cahaya berarti terang-redup. Panjang gelombang adalah jarak antara dua puncak berurutan. Frekuensi adalah jumlah getaran per detik, satuannya hertz (Hz). Ketiganya dihubungkan rumus cepat rambat v = panjang gelombang × frekuensi. Bunyi merambat di udara sekitar 340 meter per detik, sedangkan cahaya merambat 300.000 kilometer per detik, itulah sebabnya kamu melihat kilat dulu baru mendengar guntur.$$)),
  ('HEADING', 6, jsonb_build_object('text', $$Gelombang Bunyi$$)),
  ('PARAGRAPH', 7, jsonb_build_object('text', $$Bunyi adalah gelombang longitudinal yang dihasilkan benda bergetar. Telinga manusia normal mendengar frekuensi 20 Hz sampai 20.000 Hz. Di bawah itu disebut infrasonik (dipakai gajah berkomunikasi jarak jauh), di atasnya ultrasonik (dipakai kelelawar, dan manusia memakainya untuk USG medis serta sonar). Tinggi-rendahnya nada ditentukan frekuensi, sedangkan keras-lemahnya ditentukan amplitudo. Karena butuh medium, bunyi merambat lebih cepat di zat padat daripada di udara: di baja kecepatannya sekitar 5.000 meter per detik.$$)),
  ('HEADING', 8, jsonb_build_object('text', $$Cahaya, Sifat Gelombang, dan Teknologi$$)),
  ('PARAGRAPH', 9, jsonb_build_object('text', $$Cahaya tampak hanyalah pita sempit dari spektrum elektromagnetik: radio, mikro, inframerah, cahaya tampak (merah hingga ungu), ultraviolet, sinar-X, dan sinar gamma. Setiap pita punya kegunaan: radio untuk komunikasi, mikro untuk memasak dan radar, sinar-X untuk foto tulang. Gelombang juga punya sifat ajaib: refleksi (gema, cermin), refraksi (sedotan terlihat patah di gelas), difraksi (mendengar suara dari balik tikungan), interferensi (prinsip headphone noise cancelling), dan polarisasi (kacamata anti silau). Peradaban modern berdiri di atas rekayasa gelombang: sinyal 4G/5G, WiFi, serat optik, hingga MRI medis. Memahami gelombang berarti memahami fondasi hampir semua teknologi komunikasi yang kamu pakai hari ini.$$))
) AS x(block_type, position, content)
WHERE a.business_code = 'EXP-FISIKA6-001'
AND NOT EXISTS (SELECT 1 FROM madevi.article_blocks b WHERE b.article_id = a.id);

-- ============ 5. SCH-SMP-ING3-001 ============
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, status, created_by, updated_by)
SELECT gen_random_uuid(), 'SCH-SMP-ING3-001', 'd4444444-4444-4444-4444-444444444444',
  'Bahasa Inggris Kelas 7: Greetings (Salam dan Sapaan)',
  'bahasa-inggris-kelas-7-greetings',
  'Materi greetings untuk kelas 7: jenis salam, ungkapan perkenalan, contoh dialog, latihan, dan kunci jawaban.',
  'id', 'DRAFT',
  'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a'
WHERE NOT EXISTS (SELECT 1 FROM madevi.articles WHERE business_code = 'SCH-SMP-ING3-001');

INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content)
SELECT gen_random_uuid(), a.id, x.block_type, x.position, x.content
FROM madevi.articles a
CROSS JOIN (VALUES
  ('HEADING', 0, jsonb_build_object('text', $$Tujuan Pembelajaran$$)),
  ('PARAGRAPH', 1, jsonb_build_object('text', $$Setelah mempelajari materi ini, kamu diharapkan mampu: (1) mengidentifikasi berbagai ungkapan greeting dalam bahasa Inggris, (2) membedakan greeting formal dan informal, (3) menggunakan greeting yang tepat sesuai waktu dan situasi, serta (4) mempraktikkan dialog perkenalan sederhana dengan percaya diri.$$)),
  ('HEADING', 2, jsonb_build_object('text', $$Jenis-jenis Greeting$$)),
  ('PARAGRAPH', 3, jsonb_build_object('text', $$Greeting adalah ungkapan salam saat bertemu, memulai percakapan, atau berpisah. Pemilihan greeting dipengaruhi tiga hal: waktu (pagi, siang, malam), tingkat keakraban (formal atau informal), dan situasi (bertemu atau berpisah). Greeting formal dipakai kepada guru, orang yang lebih tua, atau orang baru dikenal: "Good morning, Mrs. Sari", "How do you do?", "It is nice to meet you". Greeting informal dipakai kepada teman sebaya: "Hi!", "Hey!", "What is up?", "How is it going?". Jawaban natural untuk "How are you?" antara lain "I am fine, thanks", "Pretty good", atau "Not bad". Memakai greeting yang tepat menunjukkan kesopanan dan penguasaan bahasa yang baik.$$)),
  ('LIST', 4, jsonb_build_object('text', $$Good morning — pagi hingga sekitar pukul 11 siang.||Good afternoon — siang hingga sore hari.||Good evening — sore menjelang malam saat bertemu.||Good night — saat berpisah di malam hari atau sebelum tidur, bukan untuk menyapa saat bertemu.||"My name is ..." / "This is my friend, ..." — memperkenalkan diri dan orang lain.||Respon perkenalan: "Nice to meet you" / "Pleased to meet you".||Saat berpisah: "Goodbye", "See you later", "Take care", "Have a nice day".$$)),
  ('HEADING', 5, jsonb_build_object('text', $$Contoh Dialog$$)),
  ('PARAGRAPH', 6, jsonb_build_object('text', $$Rina: "Good morning, Budi! How are you?" Budi: "Good morning, Rina! I am fine, thanks. How about you?" Rina: "Pretty good. By the way, this is my cousin, Sinta." Budi: "Hi, Sinta! Nice to meet you." Sinta: "Nice to meet you too, Budi." Perhatikan: Rina memakai greeting informal karena Budi temannya, lalu memakai "This is my cousin" untuk memperkenalkan Sinta, dan keduanya menutup dengan "Nice to meet you" sebagai respon perkenalan yang sopan.$$)),
  ('HEADING', 7, jsonb_build_object('text', $$Latihan Soal$$)),
  ('LIST', 8, jsonb_build_object('text', $$Kamu bertemu guru bahasa Inggrismu pukul 08.00. Greeting apa yang paling tepat?||Temanmu berkata "How is it going?". Berikan dua jawaban yang natural.||Lengkapi dialog: A: "___ to meet you." B: "Nice to meet you too."||Kamu berpisah dengan teman di malam hari sebelum tidur. Ucapkan greeting yang tepat.||Buat dialog perkenalan 4 baris antara kamu dan siswa baru di kelasmu.$$)),
  ('HEADING', 9, jsonb_build_object('text', $$Kunci Jawaban dan Tips$$)),
  ('LIST', 10, jsonb_build_object('text', $$"Good morning, Sir/Ma'am." (formal, sesuai waktu pagi, kepada guru).||"Pretty good, thanks." / "Not bad. You?" (jawaban santai yang natural).||"Nice" — lengkapnya "Nice to meet you."||"Good night!" (dipakai saat berpisah malam hari, bukan "Good evening").||Contoh jawaban: A: "Hi! My name is Andi." B: "Hello, Andi! I am Maya. Nice to meet you." A: "Nice to meet you too." B: "Where are you from?" A: "I am from Bandung." (Jawaban dialog boleh bervariasi selama memakai ungkapan greeting yang tepat.)$$)),
  ('PARAGRAPH', 11, jsonb_build_object('text', $$Tips: hafalkan pola berdasarkan situasi (pagi + formal, malam + informal, bertemu, berpisah, perkenalan), bukan satu per satu. Latih dengan bermain peran bersama teman dan rekam latihanmu untuk memperbaiki pelafalan. Dalam seminggu latihan rutin, greeting dasar akan menjadi refleks dan kamu siap lanjut ke materi asking and giving information.$$))
) AS x(block_type, position, content)
WHERE a.business_code = 'SCH-SMP-ING3-001'
AND NOT EXISTS (SELECT 1 FROM madevi.article_blocks b WHERE b.article_id = a.id);

-- ============ 6. SCH-SD-MAT8-001 ============
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, status, created_by, updated_by)
SELECT gen_random_uuid(), 'SCH-SD-MAT8-001', 'd1000003-0000-0000-0000-000000000003',
  'Matematika Kelas 3: Perkalian',
  'matematika-kelas-3-perkalian',
  'Materi perkalian untuk kelas 3 SD: konsep dasar, tabel perkalian, sifat komutatif, contoh, latihan, dan kunci jawaban.',
  'id', 'DRAFT',
  'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a'
WHERE NOT EXISTS (SELECT 1 FROM madevi.articles WHERE business_code = 'SCH-SD-MAT8-001');

INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content)
SELECT gen_random_uuid(), a.id, x.block_type, x.position, x.content
FROM madevi.articles a
CROSS JOIN (VALUES
  ('HEADING', 0, jsonb_build_object('text', $$Tujuan Pembelajaran$$)),
  ('PARAGRAPH', 1, jsonb_build_object('text', $$Setelah mempelajari materi ini, kamu diharapkan mampu: (1) menjelaskan perkalian sebagai penjumlahan berulang, (2) menghafal perkalian 1 sampai 10, (3) menggunakan sifat komutatif perkalian, serta (4) menyelesaikan soal cerita sederhana yang melibatkan perkalian.$$)),
  ('HEADING', 2, jsonb_build_object('text', $$Perkalian = Penjumlahan Berulang$$)),
  ('PARAGRAPH', 3, jsonb_build_object('text', $$Perkalian adalah cara singkat untuk menjumlahkan bilangan yang sama berulang-ulang. Contoh: ada 4 kantong, setiap kantong berisi 3 permen. Jumlah seluruh permen = 3 + 3 + 3 + 3 = 12. Ditulis singkat: 4 × 3 = 12. Angka 4 disebut banyak kelompok, angka 3 disebut isi tiap kelompok, dan 12 adalah hasilnya. Jadi 4 × 3 dibaca "empat kali tiga" yang artinya bilangan 3 dijumlahkan sebanyak 4 kali.$$)),
  ('HEADING', 4, jsonb_build_object('text', $$Tabel Perkalian 1 sampai 10$$)),
  ('LIST', 5, jsonb_build_object('text', $$Perkalian 1: hasilnya sama dengan bilangan itu sendiri (1×7=7).||Perkalian 2: jumlahkan bilangan dengan dirinya sendiri (2×6=12).||Perkalian 5: hasil selalu berakhiran 0 atau 5 (5×6=30, 5×7=35).||Perkalian 9 trik jari: tekuk jari ke-n, sisa jari kiri = puluhan, kanan = satuan (9×4=36).||Perkalian 10: tambahkan nol di belakang (10×7=70).||Contoh hafalan: 3×4=12, 4×5=20, 6×6=36, 6×7=42, 7×8=56, 8×8=64, 8×9=72.||Cara menghafal: latih 5 menit setiap hari dengan kartu soal, mulai dari yang dikuasai lalu tambah yang sulit.$$)),
  ('HEADING', 6, jsonb_build_object('text', $$Sifat Komutatif: Urutan Tidak Penting$$)),
  ('PARAGRAPH', 7, jsonb_build_object('text', $$Pada perkalian berlaku sifat komutatif: urutan bilangan boleh ditukar dan hasilnya tetap sama. Contoh: 3 × 5 = 15 dan 5 × 3 = 15. Sifat ini sangat membantu saat menghafal: kalau kamu sudah hafal 4 × 7 = 28, otomatis kamu tahu 7 × 4 = 28. Jadi dari 100 kombinasi perkalian 1 sampai 10, yang benar-benar harus dihafal hanya sekitar setengahnya. Buktikan dengan gambar: 3 baris berisi 5 titik sama banyaknya dengan 5 baris berisi 3 titik.$$)),
  ('HEADING', 8, jsonb_build_object('text', $$Soal Cerita dan Latihan$$)),
  ('PARAGRAPH', 9, jsonb_build_object('text', $$Contoh soal cerita: Ibu membeli 6 bungkus telur, setiap bungkus berisi 10 butir. Jawab: 6 × 10 = 60 butir. Di kelas ada 5 meja, setiap meja diduduki 4 anak. Jawab: 5 × 4 = 20 anak. Langkah menyelesaikan soal cerita: (1) temukan banyak kelompok, (2) temukan isi tiap kelompok, (3) kalikan, (4) tulis satuan jawabannya.$$)),
  ('LIST', 10, jsonb_build_object('text', $$Hitunglah: 6 × 4 = ...||Hitunglah: 9 × 5 = ...||Tuliskan 3 × 7 sebagai penjumlahan berulang, lalu hitung hasilnya.||Sebuah kotak berisi 8 pensil. Ada 9 kotak. Berapa pensil seluruhnya?||Benar atau salah: 6 × 8 = 8 × 6? Jelaskan dengan sifat komutatif.$$)),
  ('PARAGRAPH', 11, jsonb_build_object('text', $$Kunci jawaban: 1) 6 × 4 = 24. 2) 9 × 5 = 45. 3) 3 × 7 = 7 + 7 + 7 = 21. 4) 9 × 8 = 72 pensil. 5) Benar — sifat komutatif: 6 × 8 = 48 dan 8 × 6 = 48, urutan boleh ditukar tanpa mengubah hasil.$$))
) AS x(block_type, position, content)
WHERE a.business_code = 'SCH-SD-MAT8-001'
AND NOT EXISTS (SELECT 1 FROM madevi.article_blocks b WHERE b.article_id = a.id);
