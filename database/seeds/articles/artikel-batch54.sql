-- ============================================================
-- Madevi — Artikel Batch 54 (6 artikel, DRAFT, id)
-- Idempoten: aman dijalankan ulang bila DB di-reset.
-- ============================================================
BEGIN;

-- ------------------------------------------------------------
-- 1) Artikel
-- ------------------------------------------------------------
INSERT INTO madevi.articles
  (id, business_code, taxonomy_node_id, title, slug, summary, language,
   reading_minutes, creator_principal_id, created_by, updated_by, status)
VALUES
  ('e5411111-1111-4111-8111-111111111111', 'TUT-ELEKTRONIK8-001',
   'b4444444-4444-4444-4444-444444444444',
   'Transistor: Saklar Elektronik',
   'transistor-saklar-elektronik',
   'Pelajari transistor sebagai sakelar elektronik: cara kerja NPN, tiga kakinya, merangkai dengan Arduino, dan kesalahan umum yang harus dihindari.',
   'id', 8,
   'f7125028-187e-44e0-b95b-88b69b8d5c9a',
   'f7125028-187e-44e0-b95b-88b69b8d5c9a',
   'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT'),
  ('e5422222-2222-4222-8222-222222222222', 'TUT-MASAK13-001',
   'b7777777-7777-7777-7777-777777777777',
   'Pempek Palembang: Resep Ikan Tenggiri',
   'pempek-palembang-resep-ikan-tenggiri',
   'Resep pempek Palembang autentik dari ikan tenggiri: adonan kenyal tidak amis, teknik membentuk lenjer dan kapal selam, plus cuko yang kental dan pedas.',
   'id', 7,
   'f7125028-187e-44e0-b95b-88b69b8d5c9a',
   'f7125028-187e-44e0-b95b-88b69b8d5c9a',
   'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT'),
  ('e5433333-3333-4333-8333-333333333333', 'EXP-KIMIA12-001',
   'c4444444-4444-4444-4444-444444444444',
   'Garam Dapur: NaCl',
   'garam-dapur-nacl',
   'Mengenal garam dapur (NaCl): ikatan ionik natrium dan klorin, proses pembuatannya dari laut, peran bagi tubuh, dan bahaya konsumsi berlebihan.',
   'id', 6,
   'f7125028-187e-44e0-b95b-88b69b8d5c9a',
   'f7125028-187e-44e0-b95b-88b69b8d5c9a',
   'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT'),
  ('e5444444-4444-4444-8444-444444444444', 'EXP-SEJARAH14-001',
   'c8888888-8888-8888-8888-888888888888',
   'G30S 1965: Malam Berdarah',
   'g30s-1965-malam-berdarah',
   'Peristiwa G30S 1965: latar belakang ketegangan politik Orde Lama, malam penculikan para perwira, penumpasan, dan dampaknya bagi perjalanan bangsa Indonesia.',
   'id', 7,
   'f7125028-187e-44e0-b95b-88b69b8d5c9a',
   'f7125028-187e-44e0-b95b-88b69b8d5c9a',
   'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT'),
  ('e5455555-5555-4555-8555-555555555555', 'SCH-SMA-EKO4-001',
   'd5555555-5555-5555-5555-555555555555',
   'Ekonomi Kelas 10: Kebutuhan Manusia',
   'ekonomi-kelas-10-kebutuhan-manusia',
   'Materi Ekonomi kelas 10: pengertian kebutuhan manusia, jenis-jenis kebutuhan, faktor yang memengaruhinya, dan alat pemuas kebutuhan — lengkap dengan latihan soal dan kunci jawaban.',
   'id', 10,
   'f7125028-187e-44e0-b95b-88b69b8d5c9a',
   'f7125028-187e-44e0-b95b-88b69b8d5c9a',
   'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT'),
  ('e5466666-6666-4666-8666-666666666666', 'SCH-SD-IPS10-001',
   'd3333333-3333-3333-3333-333333333333',
   'IPS Kelas 6: Peninggalan Sejarah',
   'ips-kelas-6-peninggalan-sejarah',
   'Materi IPS kelas 6: mengenal peninggalan sejarah Indonesia dari masa Hindu-Buddha, Islam, hingga kolonial — lengkap dengan latihan soal dan kunci jawaban.',
   'id', 9,
   'f7125028-187e-44e0-b95b-88b69b8d5c9a',
   'f7125028-187e-44e0-b95b-88b69b8d5c9a',
   'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT')
ON CONFLICT (id) DO NOTHING;

-- ------------------------------------------------------------
-- 2) Hapus block lama agar re-run bersih (idempoten)
-- ------------------------------------------------------------
DELETE FROM madevi.article_blocks WHERE article_id IN
  ('e5411111-1111-4111-8111-111111111111',
   'e5422222-2222-4222-8222-222222222222',
   'e5433333-3333-4333-8333-333333333333',
   'e5444444-4444-4444-8444-444444444444',
   'e5455555-5555-4555-8555-555555555555',
   'e5466666-6666-4666-8666-666666666666');

-- ------------------------------------------------------------
-- 3) Block artikel 1: TUT-ELEKTRONIK8-001 (12 block Tutorial)
-- ------------------------------------------------------------
INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content)
VALUES
  (gen_random_uuid(), 'e5411111-1111-4111-8111-111111111111', 'HEADING', 1,
   jsonb_build_object('text', $$Masalahnya: Sinyal Kecil Tidak Kuat Menyalakan Beban$$)),
  (gen_random_uuid(), 'e5411111-1111-4111-8111-111111111111', 'PARAGRAPH', 2,
   jsonb_build_object('text', $$Pin digital Arduino hanya mampu mengeluarkan arus sekitar 20–40 mA. Itu cukup untuk menyalakan satu LED kecil, tetapi tidak cukup untuk motor DC, kipas 12V, atau rangkaian lampu yang lebih besar. Jika dipaksa, pin mikrokontroler bisa rusak permanen. Solusinya bukan relay yang besar dan mahal untuk setiap proyek kecil — melainkan transistor, komponen seharga seribuan rupiah yang berfungsi sebagai sakelar elektronik: arus kecil di satu kaki mengendalikan arus besar di kaki lainnya.$$)),
  (gen_random_uuid(), 'e5411111-1111-4111-8111-111111111111', 'HEADING', 3,
   jsonb_build_object('text', $$Apa Itu Transistor?$$)),
  (gen_random_uuid(), 'e5411111-1111-4111-8111-111111111111', 'PARAGRAPH', 4,
   jsonb_build_object('text', $$Transistor adalah komponen semikonduktor dengan tiga kaki: kolektor (C), basis (B), dan emitor (E). Analoginya seperti keran air: arus kecil yang masuk ke basis ibarat putaran keran, yang membuka aliran arus besar dari kolektor ke emitor. Jenis yang paling umum dipakai pemula adalah transistor NPN seperti BC547 atau 2N2222. Ketika basis diberi tegangan (misalnya HIGH dari Arduino lewat resistor), transistor "menyala" dan arus mengalir dari kolektor ke emitor — menyalakan beban yang terpasang di jalur kolektor. Ketika basis LOW, transistor mati dan beban padam.$$)),
  (gen_random_uuid(), 'e5411111-1111-4111-8111-111111111111', 'HEADING', 5,
   jsonb_build_object('text', $$Alat dan Bahan$$)),
  (gen_random_uuid(), 'e5411111-1111-4111-8111-111111111111', 'LIST', 6,
   jsonb_build_object('text', $$• Transistor NPN BC547 atau 2N2222 (1 buah)
• Resistor 1k ohm untuk kaki basis (wajib, jangan dilewatkan)
• LED + resistor 220 ohm sebagai beban latihan
• Breadboard dan kabel jumper
• Arduino Uno atau sumber 5V lain
• Multimeter (opsional, untuk memeriksa kaki transistor)$$)),
  (gen_random_uuid(), 'e5411111-1111-4111-8111-111111111111', 'HEADING', 7,
   jsonb_build_object('text', $$Langkah Merangkai$$)),
  (gen_random_uuid(), 'e5411111-1111-4111-8111-111111111111', 'LIST', 8,
   jsonb_build_object('text', $$1. Kenali kaki transistor: pegang transistor dengan sisi datar menghadapmu — dari kiri ke kanan biasanya Kolektor, Basis, Emitor (cek datasheet untuk memastikan).
2. Tancapkan transistor di breadboard. Sambungkan kaki EMITOR ke GND Arduino.
3. Sambungkan kaki KOLEKTOR ke kaki negatif LED (lewat resistor 220 ohm), lalu kaki positif LED ke 5V.
4. Sambungkan kaki BASIS ke pin digital Arduino (misal pin 7) MELALUI resistor 1k ohm. Resistor ini membatasi arus basis agar transistor tidak jebol.
5. Tulis program sederhana: digitalWrite(7, HIGH) untuk menyalakan beban, digitalWrite(7, LOW) untuk mematikan.
6. Upload dan amati: LED menyala saat pin HIGH, padam saat LOW — padahal pin Arduino tidak tersambung langsung ke LED.$$)),
  (gen_random_uuid(), 'e5411111-1111-4111-8111-111111111111', 'HEADING', 9,
   jsonb_build_object('text', $$Kesalahan Umum dan Risikonya$$)),
  (gen_random_uuid(), 'e5411111-1111-4111-8111-111111111111', 'PARAGRAPH', 10,
   jsonb_build_object('text', $$Kesalahan paling fatal adalah menghubungkan basis langsung ke pin Arduino TANPA resistor — arus basis tak terbatas akan membakar transistor dan bisa merusak pin mikrokontroler. Kesalahan kedua adalah tertukar kaki kolektor dan emitor; rangkaian tidak bekerja dan transistor cepat panas. Kesalahan ketiga adalah memakai transistor kecil (BC547, maks ~100 mA) untuk beban besar seperti motor — transistor akan panas dan jebol; untuk beban besar gunakan transistor daya (TIP120) atau MOSFET. Selalu sentuh transistor setelah beberapa detik menyala: hangat wajar, panas menyengat berarti ada yang salah — matikan dan periksa rangkaian.$$)),
  (gen_random_uuid(), 'e5411111-1111-4111-8111-111111111111', 'HEADING', 11,
   jsonb_build_object('text', $$Memeriksa Hasil$$)),
  (gen_random_uuid(), 'e5411111-1111-4111-8111-111111111111', 'PARAGRAPH', 12,
   jsonb_build_object('text', $$Rangkaian berhasil jika: LED menyala penuh saat pin HIGH dan padam total saat LOW, transistor hanya hangat (tidak panas), dan pin Arduino tetap berfungsi normal setelah rangkaian dilepas. Tindak lanjut: ganti LED dengan motor DC kecil (tambah dioda flyback 1N4007 paralel motor untuk keamanan), atau kendalikan kipas 12V memakai sumber eksternal di jalur kolektor. Setelah paham transistor, konsep relay dan MOSFET akan terasa jauh lebih mudah.$$))
ON CONFLICT DO NOTHING;

-- ------------------------------------------------------------
-- 4) Block artikel 2: TUT-MASAK13-001 (12 block Tutorial)
-- ------------------------------------------------------------
INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content)
VALUES
  (gen_random_uuid(), 'e5422222-2222-4222-8222-222222222222', 'HEADING', 1,
   jsonb_build_object('text', $$Masalahnya: Pempek Keras, Amis, atau Hancur$$)),
  (gen_random_uuid(), 'e5422222-2222-4222-8222-222222222222', 'PARAGRAPH', 2,
   jsonb_build_object('text', $$Banyak pempek rumahan gagal: teksturnya keras seperti karet karena terlalu banyak sagu, amis karena ikannya tidak segar atau salah penanganan, atau hancur berantakan saat direbus karena adonan kurang menyatu. Padahal pempek Palembang yang autentik itu kenyal tapi lembut, gurih ikan tenggiri, dan utuh mulus setelah direbus maupun digoreng. Rahasianya ada pada tiga hal: kesegaran ikan, perbandingan ikan dan sagu, serta teknik menguleni yang benar.$$)),
  (gen_random_uuid(), 'e5422222-2222-4222-8222-222222222222', 'HEADING', 3,
   jsonb_build_object('text', $$Mengapa Harus Ikan Tenggiri?$$)),
  (gen_random_uuid(), 'e5422222-2222-4222-8222-222222222222', 'PARAGRAPH', 4,
   jsonb_build_object('text', $$Ikan tenggiri dipilih karena dagingnya padat, putih, dan gurih dengan aroma khas yang tidak amis bila segar. Daging tenggiri yang digiling halus menghasilkan protein miofibril yang mengikat adonan dengan baik — inilah yang memberi tekstur kenyal alami tanpa perlu pengenyal buatan. Ikan harus SEGAR: ciri-cirinya mata jernih menonjol, insang merah cerah, daging kenyal kembali saat ditekan, dan tidak berbau menyengat. Jika tidak ada tenggiri, ikan gabus atau kakap bisa jadi pengganti, tetapi rasa autentiknya berbeda. Ikan yang sudah tidak segar tidak bisa diselamatkan bumbu apa pun — amisnya akan tetap terasa.$$)),
  (gen_random_uuid(), 'e5422222-2222-4222-8222-222222222222', 'HEADING', 5,
   jsonb_build_object('text', $$Bahan-bahan$$)),
  (gen_random_uuid(), 'e5422222-2222-4222-8222-222222222222', 'LIST', 6,
   jsonb_build_object('text', $$ADONAN PEMPEK:
• 500 gram daging ikan tenggiri giling (dingin dari kulkas)
• 250 gram tepung sagu tani (jangan tepung tapioka biasa bila ingin autentik)
• 200 ml air es
• 1 butir putih telur
• 2 sdt garam, 1 sdt gula pasir
• 4 siung bawang putih halus (opsional)

CUKO:
• 250 gram gula aren/gula merah, sisir halus
• 5 siung bawang putih, 8 buah cabai rawit (sesuai selera)
• 1 sdm asam jawa larutkan dengan air
• 1 sdt garam, 500 ml air$$)),
  (gen_random_uuid(), 'e5422222-2222-4222-8222-222222222222', 'HEADING', 7,
   jsonb_build_object('text', $$Langkah Membuat Adonan$$)),
  (gen_random_uuid(), 'e5422222-2222-4222-8222-222222222222', 'LIST', 8,
   jsonb_build_object('text', $$1. Campur daging ikan dingin dengan garam, gula, dan putih telur. Aduk searah hingga lengket dan kalis (sekitar 5 menit). Ikan harus tetap dingin agar proteinnya mengikat sempurna.
2. Tuang air es sedikit demi sedikit sambil terus diaduk. Adonan akan terlihat lembut dan agak encer — ini normal.
3. Masukkan tepung sagu SECARA BERTAHAP. Aduk lipat perlahan, JANGAN diuleni kuat-kuat seperti adonan roti. Menguleni berlebihan membuat pempek keras. Berhenti saat adonan bisa dibentuk (masih agak lengket).
4. Bentuk LENJER: ambil adonan, gulingkan di atas sagu taburan hingga berbentuk silinder panjang. Bentuk KAPAL SELAM: pipihkan adonan, isi dengan 1 butir telur mentah, tutup rapat dan cubit pinggirnya hingga tidak bocor.
5. Didihkan air dengan 1 sdm minyak. Masukkan pempek, rebus hingga mengapung (tanda matang), angkat dan tiriskan. Diamkan hingga dingin sebelum digoreng.
6. Goreng dalam minyak panas sedang hingga kuning keemasan. Jangan terlalu lama agar tidak keras.$$)),
  (gen_random_uuid(), 'e5422222-2222-4222-8222-222222222222', 'HEADING', 9,
   jsonb_build_object('text', $$Membuat Cuko yang Kental dan Medok$$)),
  (gen_random_uuid(), 'e5422222-2222-4222-8222-222222222222', 'PARAGRAPH', 10,
   jsonb_build_object('text', $$Haluskan bawang putih dan cabai rawit. Rebus bersama gula aren, air, dan larutan asam jawa hingga mendidih. Kecilkan api dan masak terus hingga kuah menyusut dan agak kental — cuko yang baik melapisi sendok, tidak encer seperti air. Saring, lalu cicipi: seimbangkan manis, asam, asin, dan pedas sesuai selera. Cuko yang dimasak hingga tanak tahan disimpan di kulkas sampai dua minggu dan rasanya justru makin menyatu keesokan harinya.$$)),
  (gen_random_uuid(), 'e5422222-2222-4222-8222-222222222222', 'HEADING', 11,
   jsonb_build_object('text', $$Kesalahan Umum dan Cara Menghindarinya$$)),
  (gen_random_uuid(), 'e5422222-2222-4222-8222-222222222222', 'PARAGRAPH', 12,
   jsonb_build_object('text', $$TIGA jebakan utama: (1) Terlalu banyak sagu — patokannya sagu maksimal setengah berat ikan; adonan yang benar masih agak lengket, bukan kalis mulus. (2) Ikan suhu ruang — protein ikan hangat tidak mengikat, adonan jadi lembek dan hancur saat direbus; selalu pakai ikan dingin dan air es. (3) Menguleni terlalu kuat — aduk lipat saja. Pempek rebus yang sudah dingin bisa disimpan di freezer hingga sebulan; goreng langsung dari beku dengan api sedang. Sajikan dengan cuko hangat, taburan ebi sangrai, dan irisan timun untuk pengalaman Palembang yang lengkap.$$))
ON CONFLICT DO NOTHING;

-- ------------------------------------------------------------
-- 5) Block artikel 3: EXP-KIMIA12-001 (10 block edukatif)
-- ------------------------------------------------------------
INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content)
VALUES
  (gen_random_uuid(), 'e5433333-3333-4333-8333-333333333333', 'HEADING', 1,
   jsonb_build_object('text', $$Apa Itu Garam Dapur?$$)),
  (gen_random_uuid(), 'e5433333-3333-4333-8333-333333333333', 'PARAGRAPH', 2,
   jsonb_build_object('text', $$Garam dapur adalah natrium klorida dengan rumus kimia NaCl — senyawa yang terbentuk dari satu atom natrium (Na) dan satu atom klorin (Cl). Dalam bentuk murni ia berupa kristal putih bening yang larut sempurna dalam air. Hampir setiap masakan di dunia memakainya, dan tubuh manusia pun tidak bisa hidup tanpanya. Namun di balik kesederhanaannya, garam menyimpan kisah kimia yang menarik: ia lahir dari "pernikahan" dua unsur yang masing-masing sangat berbahaya bila berdiri sendiri.$$)),
  (gen_random_uuid(), 'e5433333-3333-4333-8333-333333333333', 'HEADING', 3,
   jsonb_build_object('text', $$Ikatan Ionik: Pernikahan Natrium dan Klorin$$)),
  (gen_random_uuid(), 'e5433333-3333-4333-8333-333333333333', 'PARAGRAPH', 4,
   jsonb_build_object('text', $$Natrium adalah logam lunak yang meledak bila kena air; klorin adalah gas beracun berwarna kuning kehijauan. Namun ketika atom natrium MELEPASKAN satu elektron terluarnya dan atom klorin MENERIMA elektron itu, keduanya menjadi ion yang stabil: Na+ dan Cl-. Muatan berlawanan membuat mereka saling menarik dan tersusun dalam kristal kubus yang rapi — inilah ikatan ionik. Hasilnya justru senyawa yang aman dimakan. Pelajaran kimianya: sifat senyawa sama sekali berbeda dari sifat unsur penyusunnya.$$)),
  (gen_random_uuid(), 'e5433333-3333-4333-8333-333333333333', 'HEADING', 5,
   jsonb_build_object('text', $$Dari Laut ke Meja Makan$$)),
  (gen_random_uuid(), 'e5433333-3333-4333-8333-333333333333', 'PARAGRAPH', 6,
   jsonb_build_object('text', $$Air laut mengandung sekitar 3,5% garam terlarut. Di Indonesia, garam dibuat di tambak-tambak pesisir: air laut dialirkan ke petak-petak dangkal lalu dijemur matahari hingga airnya menguap dan kristal garam tertinggal. Proses ini memakan waktu berminggu-minggu dan sangat bergantung pada musim kemarau. Selain dari laut, garam juga ditambang dari endapan garam purba di bawah tanah (misalnya di Jerman dan Amerika Serikat). Garam yang kita beli biasanya sudah dicuci, dikeringkan, dan ditambah yodium (KIO3) untuk mencegah penyakit gondok — itulah "garam beryodium" yang dianjurkan pemerintah.$$)),
  (gen_random_uuid(), 'e5433333-3333-4333-8333-333333333333', 'HEADING', 7,
   jsonb_build_object('text', $$Peran Garam bagi Tubuh$$)),
  (gen_random_uuid(), 'e5433333-3333-4333-8333-333333333333', 'PARAGRAPH', 8,
   jsonb_build_object('text', $$Natrium adalah elektrolit utama cairan di luar sel tubuh. Ia menjaga keseimbangan cairan, membantu saraf menghantarkan impuls listrik, dan memungkinkan otot berkontraksi. Tanpa natrium yang cukup, tubuh mengalami kram, pusing, bahkan gangguan fungsi otak. Klorida pun berperan dalam cairan lambung (asam klorida/HCl) yang membantu mencerna makanan. Singkatnya: garam dalam jumlah TEPAT adalah kebutuhan vital, bukan musuh.$$)),
  (gen_random_uuid(), 'e5433333-3333-4333-8333-333333333333', 'HEADING', 9,
   jsonb_build_object('text', $$Terlalu Banyak Garam?$$)),
  (gen_random_uuid(), 'e5433333-3333-4333-8333-333333333333', 'PARAGRAPH', 10,
   jsonb_build_object('text', $$Masalah muncul ketika konsumsi berlebihan. Kelebihan natrium menahan air dalam pembuluh darah sehingga volume darah naik — inilah salah satu pemicu tekanan darah tinggi (hipertensi), yang dalam jangka panjang merusak jantung, ginjal, dan pembuluh darah. Organisasi Kesehatan Dunia (WHO) menganjurkan konsumsi garam maksimal 5 gram per hari (sekitar satu sendok teh), sementara rata-rata orang Indonesia mengonsumsi jauh di atas itu, terutama dari makanan olahan, mi instan, dan jajanan asin. Kuncinya bukan menghindari garam sama sekali, melainkan mengendalikannya: masak sendiri, baca label nutrisi, dan kurangi makanan kemasan.$$))
ON CONFLICT DO NOTHING;

-- ------------------------------------------------------------
-- 6) Block artikel 4: EXP-SEJARAH14-001 (10 block edukatif)
-- ------------------------------------------------------------
INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content)
VALUES
  (gen_random_uuid(), 'e5444444-4444-4444-8444-444444444444', 'HEADING', 1,
   jsonb_build_object('text', $$Apa Itu G30S?$$)),
  (gen_random_uuid(), 'e5444444-4444-4444-8444-444444444444', 'PARAGRAPH', 2,
   jsonb_build_object('text', $$G30S adalah singkatan dari Gerakan 30 September — peristiwa pada malam 30 September hingga dini hari 1 Oktober 1965 ketika sekelompok pasukan menculik dan membunuh enam jenderal TNI Angkatan Darat serta satu perwira pertama di Jakarta. Jenazah mereka kemudian ditemukan di sebuah sumur tua di daerah Lubang Buaya, Jakarta Timur. Peristiwa berdarah ini menjadi titik balik terbesar dalam sejarah Indonesia modern: ia mengakhiri era Demokrasi Terpimpin Presiden Soekarno dan membuka jalan bagi lahirnya Orde Baru di bawah Soeharto.$$)),
  (gen_random_uuid(), 'e5444444-4444-4444-8444-444444444444', 'HEADING', 3,
   jsonb_build_object('text', $$Latar Belakang: Indonesia yang Terbelah$$)),
  (gen_random_uuid(), 'e5444444-4444-4444-8444-444444444444', 'PARAGRAPH', 4,
   jsonb_build_object('text', $$Pertengahan 1960-an, Indonesia berada dalam ketegangan politik yang tajam. Presiden Soekarno menjalankan politik Nasakom (Nasionalisme, Agama, Komunisme) yang memberi ruang besar bagi Partai Komunis Indonesia (PKI) — saat itu partai komunis terbesar di luar Uni Soviet dan Tiongkok. Di sisi lain, TNI Angkatan Darat yang anti-komunis bersaing sengit dengan PKI memperebutkan pengaruh atas Soekarno. Ekonomi memburuk, konfrontasi dengan Malaysia menguras sumber daya, dan isu "Dewan Jenderal" yang disebut-sebut akan mengkudeta Soekarno beredar luas. Dalam suasana saling curiga inilah gerakan 30 September meletus.$$)),
  (gen_random_uuid(), 'e5444444-4444-4444-8444-444444444444', 'HEADING', 5,
   jsonb_build_object('text', $$Malam 30 September 1965$$)),
  (gen_random_uuid(), 'e5444444-4444-4444-8444-444444444444', 'PARAGRAPH', 6,
   jsonb_build_object('text', $$Pasukan yang menamakan diri Gerakan 30 September, dipimpin Letkol Untung Syamsuri dari Resimen Tjakrabirawa (pasukan pengawal presiden), bergerak menculik tujuh perwira tinggi TNI AD dari rumah mereka masing-masing. Enam jenderal — Ahmad Yani, M.T. Haryono, S. Parman, Suprapto, Sutoyo Siswomiharjo, dan D.I. Panjaitan — serta Lettu Pierre Tendean (ajudan Jenderal Nasution yang disangka Nasution sendiri) dibunuh dan jasadnya dibuang ke sumur Lubang Buaya. Jenderal A.H. Nasution lolos dari upaya penculikan meski putrinya Ade Irma menjadi korban. Pada pagi 1 Oktober, gerakan ini mengumumkan pembentukan "Dewan Revolusi" melalui siaran RRI.$$)),
  (gen_random_uuid(), 'e5444444-4444-4444-8444-444444444444', 'HEADING', 7,
   jsonb_build_object('text', $$Penumpasan dan Runtuhnya PKI$$)),
  (gen_random_uuid(), 'e5444444-4444-4444-8444-444444444444', 'PARAGRAPH', 8,
   jsonb_build_object('text', $$Mayor Jenderal Soeharto, Panglima Kostrad, dengan cepat mengambil alih komando dan menumpas gerakan tersebut dalam waktu kurang dari dua hari. Pemerintah Orde Baru kemudian menetapkan bahwa dalang gerakan ini adalah PKI. Menyusul peristiwa itu terjadi pembubaran PKI, penangkapan massal, dan kekerasan anti-komunis di berbagai daerah yang menelan ratusan ribu korban jiwa — salah satu tragedi kemanusiaan terbesar dalam sejarah Indonesia. Pada 11 Maret 1966, Soekarno menandatangani Surat Perintah 11 Maret (Supersemar) yang memberi Soeharto wewenang mengambil tindakan, yang kemudian menjadi dasar peralihan kekuasaan ke Orde Baru.$$)),
  (gen_random_uuid(), 'e5444444-4444-4444-8444-444444444444', 'HEADING', 9,
   jsonb_build_object('text', $$Dampak bagi Indonesia$$)),
  (gen_random_uuid(), 'e5444444-4444-4444-8444-444444444444', 'PARAGRAPH', 10,
   jsonb_build_object('text', $$G30S mengubah total arah bangsa: berakhirnya Demokrasi Terpimpin, lahirnya Orde Baru yang berkuasa 32 tahun, dibubarkannya PKI beserta larangan ajaran komunisme, dan pergeseran haluan politik luar negeri Indonesia. Monumen Pancasila Sakti di Lubang Buaya kini berdiri sebagai pengingat peristiwa itu, dan setiap 1 Oktober diperingati sebagai Hari Kesaktian Pancasila. Pelajaran terpentingnya bagi generasi kini: perbedaan politik yang diselesaikan dengan kekerasan hanya melahirkan luka berkepanjangan — demokrasi yang sehat membutuhkan dialog, bukan senjata.$$))
ON CONFLICT DO NOTHING;

-- ------------------------------------------------------------
-- 7) Block artikel 5: SCH-SMA-EKO4-001 (12 block sekolah)
-- ------------------------------------------------------------
INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content)
VALUES
  (gen_random_uuid(), 'e5455555-5555-4555-8555-555555555555', 'HEADING', 1,
   jsonb_build_object('text', $$Tujuan Pembelajaran$$)),
  (gen_random_uuid(), 'e5455555-5555-4555-8555-555555555555', 'PARAGRAPH', 2,
   jsonb_build_object('text', $$Setelah mempelajari materi ini, kamu diharapkan mampu: (1) menjelaskan pengertian kebutuhan manusia, (2) mengklasifikasikan jenis-jenis kebutuhan beserta contohnya, (3) mengidentifikasi faktor-faktor yang memengaruhi kebutuhan, dan (4) menjelaskan pengertian alat pemuas kebutuhan beserta jenisnya.$$)),
  (gen_random_uuid(), 'e5455555-5555-4555-8555-555555555555', 'HEADING', 3,
   jsonb_build_object('text', $$Pengertian Kebutuhan Manusia$$)),
  (gen_random_uuid(), 'e5455555-5555-4555-8555-555555555555', 'PARAGRAPH', 4,
   jsonb_build_object('text', $$Kebutuhan manusia adalah segala sesuatu yang diperlukan manusia untuk mempertahankan kelangsungan hidup dan mencapai kesejahteraan. Kebutuhan muncul karena manusia memiliki keinginan yang tidak terbatas, sementara alat untuk memenuhinya terbatas — inilah inti dari masalah ekonomi yang disebut KELANGKAAN (scarcity). Contoh sederhana: kamu butuh makan setiap hari agar tetap hidup, tetapi uang jajanmu terbatas sehingga harus memilih makanan mana yang dibeli. Setiap pilihan ekonomi pada dasarnya adalah upaya memenuhi kebutuhan dengan sumber daya yang terbatas.$$)),
  (gen_random_uuid(), 'e5455555-5555-4555-8555-555555555555', 'HEADING', 5,
   jsonb_build_object('text', $$Jenis-jenis Kebutuhan$$)),
  (gen_random_uuid(), 'e5455555-5555-4555-8555-555555555555', 'LIST', 6,
   jsonb_build_object('text', $$BERDASARKAN INTENSITASNYA:
• Kebutuhan primer — kebutuhan pokok untuk bertahan hidup: makanan, pakaian, tempat tinggal.
• Kebutuhan sekunder — kebutuhan pelengkap setelah primer terpenuhi: televisi, sepeda motor, perabot rumah.
• Kebutuhan tersier — kebutuhan kemewahan/prestise: mobil mewah, perhiasan, liburan ke luar negeri.

BERDASARKAN SIFATNYA:
• Kebutuhan jasmani — berhubungan dengan fisik: makan, minum, olahraga.
• Kebutuhan rohani — berhubungan dengan jiwa: beribadah, rekreasi, pendidikan.

BERDASARKAN SUBJEKNYA:
• Kebutuhan individu — kebutuhan perorangan: baju, sepatu, buku.
• Kebutuhan kolektif — kebutuhan bersama: jalan raya, rumah sakit, sekolah.

BERDASARKAN WAKTUNYA:
• Kebutuhan sekarang — harus dipenuhi saat ini: obat saat sakit.
• Kebutuhan masa depan — untuk nanti: tabungan, asuransi.$$)),
  (gen_random_uuid(), 'e5455555-5555-4555-8555-555555555555', 'HEADING', 7,
   jsonb_build_object('text', $$Faktor yang Memengaruhi Kebutuhan$$)),
  (gen_random_uuid(), 'e5455555-5555-4555-8555-555555555555', 'LIST', 8,
   jsonb_build_object('text', $$• PENDAPATAN — semakin besar pendapatan, semakin banyak dan beragam kebutuhan yang bisa dipenuhi.
• LINGKUNGAN — orang di daerah dingin butuh pakaian hangat; di daerah panas butuh pendingin.
• AGAMA DAN KEPERCAYAAN — memengaruhi kebutuhan makanan, pakaian, dan ritual.
• ADAT ISTIADAT — tradisi daerah menciptakan kebutuhan khusus, misalnya seserahan pernikahan.
• PENDIDIKAN — semakin tinggi pendidikan, kebutuhan akan buku dan informasi meningkat.
• KEMAJUAN TEKNOLOGI — memunculkan kebutuhan baru: dulu tidak ada, kini butuh smartphone dan internet.$$)),
  (gen_random_uuid(), 'e5455555-5555-4555-8555-555555555555', 'HEADING', 9,
   jsonb_build_object('text', $$Alat Pemuas Kebutuhan$$)),
  (gen_random_uuid(), 'e5455555-5555-4555-8555-555555555555', 'PARAGRAPH', 10,
   jsonb_build_object('text', $$Alat pemuas kebutuhan adalah segala sarana yang digunakan untuk memenuhi kebutuhan manusia, dibedakan menjadi BARANG (benda berwujud: nasi, baju, rumah) dan JASA (layanan tak berwujud: potong rambut, ojek online, les privat). Berdasarkan cara memperolehnya ada barang EKONOMI (didapat dengan pengorbanan, misalnya membeli) dan barang BEBAS (didapat tanpa pengorbanan, misalnya udara dan sinar matahari). Berdasarkan hubungannya dengan barang lain ada barang SUBSTITUSI (pengganti: margarin menggantikan mentega) dan barang KOMPLEMENTER (pelengkap: bensin melengkapi motor).$$)),
  (gen_random_uuid(), 'e5455555-5555-4555-8555-555555555555', 'HEADING', 11,
   jsonb_build_object('text', $$Latihan Soal$$)),
  (gen_random_uuid(), 'e5455555-5555-4555-8555-555555555555', 'PARAGRAPH', 12,
   jsonb_build_object('text', $$1. Jelaskan mengapa kebutuhan manusia dikatakan tidak terbatas sedangkan alat pemuasnya terbatas! (Kunci: keinginan manusia terus berkembang mengikuti zaman dan selalu muncul kebutuhan baru, sementara sumber daya alam, waktu, dan uang terbatas — inilah kelangkaan.)
2. Sebutkan 3 contoh kebutuhan primer, sekunder, dan tersier masing-masing! (Kunci: primer — nasi, baju, rumah; sekunder — kulkas, motor, meja belajar; tersier — berlian, yacht, liburan keliling dunia.)
3. Mengapa udara bersih termasuk barang bebas sedangkan air mineral kemasan termasuk barang ekonomi? (Kunci: udara tersedia melimpah di alam dan diperoleh tanpa pengorbanan; air mineral kemasan memerlukan proses produksi dan distribusi sehingga harus dibeli dengan pengorbanan uang.)$$))
ON CONFLICT DO NOTHING;

-- ------------------------------------------------------------
-- 8) Block artikel 6: SCH-SD-IPS10-001 (12 block sekolah)
-- ------------------------------------------------------------
INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content)
VALUES
  (gen_random_uuid(), 'e5466666-6666-4666-8666-666666666666', 'HEADING', 1,
   jsonb_build_object('text', $$Tujuan Pembelajaran$$)),
  (gen_random_uuid(), 'e5466666-6666-4666-8666-666666666666', 'PARAGRAPH', 2,
   jsonb_build_object('text', $$Setelah mempelajari materi ini, kamu diharapkan mampu: (1) menjelaskan pengertian peninggalan sejarah, (2) menyebutkan contoh peninggalan sejarah masa Hindu-Buddha, (3) menyebutkan contoh peninggalan sejarah masa Islam, (4) menyebutkan contoh peninggalan sejarah masa kolonial, dan (5) menjelaskan pentingnya melestarikan peninggalan sejarah.$$)),
  (gen_random_uuid(), 'e5466666-6666-4666-8666-666666666666', 'HEADING', 3,
   jsonb_build_object('text', $$Apa Itu Peninggalan Sejarah?$$)),
  (gen_random_uuid(), 'e5466666-6666-4666-8666-666666666666', 'PARAGRAPH', 4,
   jsonb_build_object('text', $$Peninggalan sejarah adalah benda-benda atau bangunan hasil karya manusia pada masa lalu yang masih ada hingga sekarang dan menjadi bukti perjalanan suatu bangsa. Lewat peninggalan sejarah, kita bisa mengetahui bagaimana kehidupan nenek moyang kita: apa yang mereka percayai, bagaimana mereka membangun, dan seberapa hebat peradaban mereka. Indonesia memiliki peninggalan sejarah yang sangat kaya karena pernah dilalui berbagai zaman — dari kerajaan Hindu-Buddha, kesultanan Islam, hingga masa penjajahan. Peninggalan ini wajib kita jaga agar tidak rusak atau hilang.$$)),
  (gen_random_uuid(), 'e5466666-6666-4666-8666-666666666666', 'HEADING', 5,
   jsonb_build_object('text', $$Peninggalan Masa Hindu-Buddha$$)),
  (gen_random_uuid(), 'e5466666-6666-4666-8666-666666666666', 'LIST', 6,
   jsonb_build_object('text', $$• CANDI BOROBUDUR (Magelang, Jawa Tengah) — candi Buddha terbesar di dunia, dibangun Dinasti Syailendra sekitar abad ke-8, kini menjadi Warisan Dunia UNESCO.
• CANDI PRAMBANAN (perbatasan Yogyakarta–Jawa Tengah) — candi Hindu terbesar di Indonesia, dipersembahkan untuk Trimurti (Brahma, Wisnu, Siwa).
• PRASASTI — batu bertulis berisi perintah raja, misalnya Prasasti Ciaruteun peninggalan Kerajaan Tarumanegara.
• ARCA DAN PATUNG — misalnya arca Ganesha dan Buddha yang banyak ditemukan di Jawa dan Sumatra.
• KITAB SASTRA — seperti Kitab Negarakertagama karya Mpu Prapanca yang menceritakan kejayaan Majapahit.$$)),
  (gen_random_uuid(), 'e5466666-6666-4666-8666-666666666666', 'HEADING', 7,
   jsonb_build_object('text', $$Peninggalan Masa Islam$$)),
  (gen_random_uuid(), 'e5466666-6666-4666-8666-666666666666', 'LIST', 8,
   jsonb_build_object('text', $$• MASJID AGUNG DEMAK — masjid tertua di Jawa, dibangun pada masa Kesultanan Demak dengan saka tatal (tiang dari serpihan kayu) yang terkenal.
• MASJID MENARA KUDUS — memiliki menara berbentuk seperti candi, bukti akulturasi budaya Hindu dan Islam.
• MAKAM PARA WALI — seperti makam Sunan Ampel di Surabaya dan Sunan Kalijaga di Demak yang hingga kini diziarahi banyak orang.
• KERATON — misalnya Keraton Yogyakarta dan Surakarta yang masih berfungsi hingga sekarang.
• SENI KALIGRAFI DAN BATIK — berkembang pesat dengan motif bernuansa Islami.$$)),
  (gen_random_uuid(), 'e5466666-6666-4666-8666-666666666666', 'HEADING', 9,
   jsonb_build_object('text', $$Peninggalan Masa Kolonial$$)),
  (gen_random_uuid(), 'e5466666-6666-4666-8666-666666666666', 'PARAGRAPH', 10,
   jsonb_build_object('text', $$Pada masa penjajahan Belanda, dibangun banyak benteng, gedung pemerintahan, dan jalur kereta api. Contohnya Benteng Vredeburg di Yogyakarta, Benteng Fort Rotterdam di Makassar, Gedung Sate di Bandung, serta Kota Tua Jakarta dengan bangunan-bangunan khas Belanda. Meskipun dibangun penjajah, bangunan-bangunan ini kini menjadi saksi sejarah perjuangan bangsa dan banyak yang dijadikan museum. Selain bangunan, peninggalan kolonial juga berupa dokumen, foto lama, dan sistem administrasi yang sebagian masih dipakai hingga kini.$$)),
  (gen_random_uuid(), 'e5466666-6666-4666-8666-666666666666', 'HEADING', 11,
   jsonb_build_object('text', $$Latihan Soal$$)),
  (gen_random_uuid(), 'e5466666-6666-4666-8666-666666666666', 'PARAGRAPH', 12,
   jsonb_build_object('text', $$1. Apa yang dimaksud dengan peninggalan sejarah? Berikan 2 contohnya! (Kunci: benda/bangunan hasil karya manusia masa lalu yang masih ada dan menjadi bukti perjalanan bangsa; contoh: Candi Borobudur, Masjid Agung Demak.)
2. Sebutkan 3 peninggalan sejarah dari masa Hindu-Buddha beserta daerahnya! (Kunci: Candi Borobudur — Magelang; Candi Prambanan — perbatasan DIY-Jateng; Prasasti Ciaruteun — Bogor.)
3. Mengapa kita harus melestarikan peninggalan sejarah? (Kunci: sebagai bukti dan identitas bangsa, sumber belajar sejarah, warisan untuk generasi mendatang, dan daya tarik wisata.)$$))
ON CONFLICT DO NOTHING;

COMMIT;
