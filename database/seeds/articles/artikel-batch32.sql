-- Artikel konten Madevi batch 32 — 2026-10-13
-- Owner principal: f7125028-187e-44e0-b95b-88b69b8d5c9a

-- ============ 1. TUT-BAHASA2-001: Bahasa Arab untuk Pemula ============
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, status, created_by, updated_by)
VALUES ('e3200001-0000-4000-8000-000000000001', 'TUT-BAHASA2-001', 'b6666666-6666-6666-6666-666666666666',
'Bahasa Arab untuk Pemula: Menguasai Huruf Hijaiyah', 'bahasa-arab-pemula-huruf-hijaiyah',
'Panduan langkah demi langkah mengenal dan menulis 28 huruf hijaiyah untuk pemula, lengkap dengan makhraj dan latihan.',
'id', 8, 'DRAFT', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (id) DO NOTHING;

INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
(gen_random_uuid(), 'e3200001-0000-4000-8000-000000000001', 'HEADING', 1, jsonb_build_object('text', $$Masalah: Ingin Belajar Bahasa Arab tapi Bingung Mulai dari Mana$$)),
(gen_random_uuid(), 'e3200001-0000-4000-8000-000000000001', 'PARAGRAPH', 2, jsonb_build_object('text', $$Banyak orang ingin belajar bahasa Arab untuk membaca Al-Quran atau keperluan lain, tetapi merasa kewalahan melihat huruf yang asing dan ditulis dari kanan ke kiri. Kabar baiknya: fondasi bahasa Arab hanya 28 huruf hijaiyah. Kuasai ini, dan pintu menuju bacaan Arab terbuka lebar.$$)),
(gen_random_uuid(), 'e3200001-0000-4000-8000-000000000001', 'HEADING', 3, jsonb_build_object('text', $$Penjelasan: Apa Itu Huruf Hijaiyah?$$)),
(gen_random_uuid(), 'e3200001-0000-4000-8000-000000000001', 'PARAGRAPH', 4, jsonb_build_object('text', $$Huruf hijaiyah adalah 28 huruf abjad bahasa Arab, dari alif (ا) sampai ya (ي). Berbeda dengan huruf Latin, bentuk huruf Arab berubah tergantung posisinya: di awal, tengah, atau akhir kata. Setiap huruf juga memiliki makhraj, yaitu tempat keluarnya suara dari mulut atau tenggorokan.$$)),
(gen_random_uuid(), 'e3200001-0000-4000-8000-000000000001', 'HEADING', 5, jsonb_build_object('text', $$Alat yang Dibutuhkan$$)),
(gen_random_uuid(), 'e3200001-0000-4000-8000-000000000001', 'LIST', 6, jsonb_build_object('items', ARRAY[$$Buku tulis atau buku latihan khusus huruf Arab$$, $$Tabel 28 huruf hijaiyah (cetak atau digital)$$, $$Audio pelafalan huruf (aplikasi atau video)$$, $$Pensil dan penghapus$$])),
(gen_random_uuid(), 'e3200001-0000-4000-8000-000000000001', 'HEADING', 7, jsonb_build_object('text', $$Langkah Belajar Huruf Hijaiyah$$)),
(gen_random_uuid(), 'e3200001-0000-4000-8000-000000000001', 'LIST', 8, jsonb_build_object('items', ARRAY[$$1. Hafalkan 28 huruf dalam bentuk tunggal: ا ب ت ث ج ح خ د ذ ر ز س ش ص ض ط ظ ع غ ف ق ك ل م ن هـ و ي$$, $$2. Dengarkan audio pelafalan dan tirukan makhraj setiap huruf, terutama huruf tenggorokan seperti ع ح هـ$$, $$3. Latih menulis setiap huruf 10 kali sambil menyebut namanya$$, $$4. Pelajari bentuk sambung: huruf di awal, tengah, dan akhir kata (contoh: ب ـبـ ـب)$$, $$5. Latih membaca kata sederhana: باب (babun = pintu), قلم (qalamun = pena), كتاب (kitabun = buku)$$])),
(gen_random_uuid(), 'e3200001-0000-4000-8000-000000000001', 'HEADING', 9, jsonb_build_object('text', $$Kesalahan Umum Pemula$$)),
(gen_random_uuid(), 'e3200001-0000-4000-8000-000000000001', 'PARAGRAPH', 10, jsonb_build_object('text', $$Jangan tertukar antara huruf yang mirip: س dan ش (beda titik tiga), ب ت ث (beda jumlah titik), serta ج ح خ. Kesalahan lain: mengabaikan makhraj sehingga ع terdengar seperti ا. Latihan mendengar dan meniru adalah kunci memperbaikinya.$$)),
(gen_random_uuid(), 'e3200001-0000-4000-8000-000000000001', 'HEADING', 11, jsonb_build_object('text', $$Penyelesaian: Rencana 30 Hari$$)),
(gen_random_uuid(), 'e3200001-0000-4000-8000-000000000001', 'PARAGRAPH', 12, jsonb_build_object('text', $$Targetkan 1 huruf baru per hari selama 28 hari, lalu 2 hari untuk pengulangan total. Setelah 30 hari, Anda akan bisa membaca dan menulis seluruh huruf hijaiyah dalam bentuk tunggal maupun sambung — fondasi yang cukup untuk lanjut ke harakat dan tajwid.$$))
ON CONFLICT (id) DO NOTHING;

-- ============ 2. TUT-KOMPUTER3-001: Excel untuk Pemula ============
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, status, created_by, updated_by)
VALUES ('e3200002-0000-4000-8000-000000000002', 'TUT-KOMPUTER3-001', 'baaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
'Excel untuk Pemula: 5 Rumus Penting yang Wajib Dikuasai', 'excel-pemula-rumus-penting',
'Kuasai 5 rumus Excel paling sering dipakai di dunia kerja: SUM, AVERAGE, IF, COUNT, dan VLOOKUP — dengan contoh praktis.',
'id', 9, 'DRAFT', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (id) DO NOTHING;

INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
(gen_random_uuid(), 'e3200002-0000-4000-8000-000000000002', 'HEADING', 1, jsonb_build_object('text', $$Masalah: Takut dengan Excel di Dunia Kerja$$)),
(gen_random_uuid(), 'e3200002-0000-4000-8000-000000000002', 'PARAGRAPH', 2, jsonb_build_object('text', $$Hampir semua pekerjaan kantoran meminta kemampuan Excel, tetapi banyak pemula merasa rumus-rumusnya menakutkan. Padahal 80 persen pekerjaan Excel sehari-hari hanya memakai 5 rumus dasar. Kuasai lima ini, dan Anda sudah di atas rata-rata.$$)),
(gen_random_uuid(), 'e3200002-0000-4000-8000-000000000002', 'HEADING', 3, jsonb_build_object('text', $$Penjelasan: Cara Kerja Rumus Excel$$)),
(gen_random_uuid(), 'e3200002-0000-4000-8000-000000000002', 'PARAGRAPH', 4, jsonb_build_object('text', $$Setiap rumus Excel diawali tanda sama dengan (=), diikuti nama fungsi dan argumen dalam kurung. Contoh: =SUM(A1:A10) menjumlahkan sel A1 sampai A10. Excel menghitung ulang otomatis setiap data berubah — itulah kekuatan utamanya dibanding kalkulator biasa.$$)),
(gen_random_uuid(), 'e3200002-0000-4000-8000-000000000002', 'HEADING', 5, jsonb_build_object('text', $$Alat yang Dibutuhkan$$)),
(gen_random_uuid(), 'e3200002-0000-4000-8000-000000000002', 'LIST', 6, jsonb_build_object('items', ARRAY[$$Microsoft Excel atau WPS Spreadsheet atau Google Sheets (gratis)$$, $$File latihan berisi data contoh (nama dan angka)$$, $$Waktu 1 jam untuk praktik langsung$$])),
(gen_random_uuid(), 'e3200002-0000-4000-8000-000000000002', 'HEADING', 7, jsonb_build_object('text', $$5 Rumus Penting Beserta Contoh$$)),
(gen_random_uuid(), 'e3200002-0000-4000-8000-000000000002', 'LIST', 8, jsonb_build_object('items', ARRAY[$$1. SUM — menjumlahkan: =SUM(B2:B11) menjumlah total penjualan$$, $$2. AVERAGE — rata-rata: =AVERAGE(C2:C11) menghitung nilai rata-rata$$, $$3. IF — logika: =IF(D2>=70,"Lulus","Remedial") menentukan kelulusan otomatis$$, $$4. COUNT — menghitung jumlah data angka: =COUNT(E2:E20)$$, $$5. VLOOKUP — mencari data: =VLOOKUP("Budi",A2:D20,3,FALSE) mengambil kolom ke-3 dari baris bernama Budi$$])),
(gen_random_uuid(), 'e3200002-0000-4000-8000-000000000002', 'HEADING', 9, jsonb_build_object('text', $$Kesalahan Umum$$)),
(gen_random_uuid(), 'e3200002-0000-4000-8000-000000000002', 'PARAGRAPH', 10, jsonb_build_object('text', $$Jangan lupa tanda sama dengan di awal rumus — tanpa itu Excel menganggapnya teks biasa. Hati-hati dengan VLOOKUP: argumen terakhir FALSE untuk pencocokan persis, TRUE untuk perkiraan. Kesalahan referensi sel (#REF!) muncul jika baris/kolom yang dirujuk dihapus.$$)),
(gen_random_uuid(), 'e3200002-0000-4000-8000-000000000002', 'HEADING', 11, jsonb_build_object('text', $$Penyelesaian$$)),
(gen_random_uuid(), 'e3200002-0000-4000-8000-000000000002', 'PARAGRAPH', 12, jsonb_build_object('text', $$Praktikkan kelima rumus dengan data nyata milik Anda sendiri — misalnya daftar pengeluaran bulanan. Setelah lancar, lanjutkan ke SUMIF, COUNTIF, dan PivotTable untuk naik ke level menengah.$$))
ON CONFLICT (id) DO NOTHING;

-- ============ 3. EXP-FILSAFAT3-001: Utilitarianisme ============
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, status, created_by, updated_by)
VALUES ('e3200003-0000-4000-8000-000000000003', 'EXP-FILSAFAT3-001', 'c8888888-8888-8888-8888-888888888888',
'Utilitarianisme: Filsafat Kebahagiaan Terbesar', 'utilitarianisme-kebahagiaan-terbesar',
'Mengenal utilitarianisme: aliran etika yang menilai benar-salah dari seberapa besar kebahagiaan yang dihasilkan — dari Bentham hingga Mill.',
'id', 7, 'DRAFT', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (id) DO NOTHING;

INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
(gen_random_uuid(), 'e3200003-0000-4000-8000-000000000003', 'HEADING', 1, jsonb_build_object('text', $$Apa Itu Utilitarianisme?$$)),
(gen_random_uuid(), 'e3200003-0000-4000-8000-000000000003', 'PARAGRAPH', 2, jsonb_build_object('text', $$Utilitarianisme adalah aliran etika yang menyatakan: tindakan yang benar adalah tindakan yang menghasilkan kebahagiaan terbesar bagi jumlah orang terbanyak. Bukan niat atau aturan yang dinilai, melainkan akibatnya. Jika sebuah kebijakan membuat seribu orang bahagia dan hanya sepuluh orang dirugikan, maka kebijakan itu benar secara utilitarian.$$)),
(gen_random_uuid(), 'e3200003-0000-4000-8000-000000000003', 'HEADING', 3, jsonb_build_object('text', $$Jeremy Bentham dan Kalkulus Kebahagiaan$$)),
(gen_random_uuid(), 'e3200003-0000-4000-8000-000000000003', 'PARAGRAPH', 4, jsonb_build_object('text', $$Jeremy Bentham (1748-1832), pendiri utilitarianisme, bahkan mencoba mengukur kebahagiaan secara matematis lewat "kalkulus felicific" — menghitung intensitas, durasi, kepastian, dan jangkauan kenikmatan. Baginya, semua kenikmatan setara: membaca puisi sama nilainya dengan bermain congklak, selama menghasilkan kebahagiaan yang sama besarnya.$$)),
(gen_random_uuid(), 'e3200003-0000-4000-8000-000000000003', 'HEADING', 5, jsonb_build_object('text', $$John Stuart Mill: Kualitas di Atas Kuantitas$$)),
(gen_random_uuid(), 'e3200003-0000-4000-8000-000000000003', 'PARAGRAPH', 6, jsonb_build_object('text', $$John Stuart Mill (1806-1873) menyempurnakan gagasan Bentham: tidak semua kenikmatan setara. Kenikmatan intelektual dan moral lebih tinggi nilainya daripada kenikmatan fisik semata. Ucapannya yang terkenal: lebih baik menjadi manusia yang tidak puas daripada babi yang puas — karena kapasitas kebahagiaan manusia lebih dalam.$$)),
(gen_random_uuid(), 'e3200003-0000-4000-8000-000000000003', 'HEADING', 7, jsonb_build_object('text', $$Prinsip Utilitas dalam Praktik$$)),
(gen_random_uuid(), 'e3200003-0000-4000-8000-000000000003', 'PARAGRAPH', 8, jsonb_build_object('text', $$Utilitarianisme hidup dalam kebijakan publik modern: pemerintah membangun jalan tol karena manfaatnya bagi jutaan orang melebihi kerugian segelintir pemilik lahan (dengan ganti rugi). Dalam kedokteran, triase bencana memilih menyelamatkan pasien yang paling mungkin hidup — keputusan utilitarian yang pahit namun rasional.$$)),
(gen_random_uuid(), 'e3200003-0000-4000-8000-000000000003', 'HEADING', 9, jsonb_build_object('text', $$Kritik terhadap Utilitarianisme$$)),
(gen_random_uuid(), 'e3200003-0000-4000-8000-000000000003', 'PARAGRAPH', 10, jsonb_build_object('text', $$Kritik terbesar: utilitarianisme bisa mengorbankan minoritas demi mayoritas. Apakah boleh menghukum orang tak bersalah jika itu membuat masyarakat merasa aman? Para penentangnya berkata tidak — keadilan dan hak individu tidak boleh dikorbankan, seberapa pun besar kebahagiaan kolektifnya. Perdebatan ini masih hidup hingga hari ini.$$))
ON CONFLICT (id) DO NOTHING;

-- ============ 4. EXP-BIOLOGI4-001: Virus ============
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, status, created_by, updated_by)
VALUES ('e3200004-0000-4000-8000-000000000004', 'EXP-BIOLOGI4-001', 'cabbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
'Virus: Bukan Makhluk Hidup?', 'virus-bukan-makhluk-hidup',
'Mengapa para ilmuwan memperdebatkan status virus: struktur, cara berkembang biak, dan perbedaan virus dengan bakteri.',
'id', 7, 'DRAFT', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (id) DO NOTHING;

INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
(gen_random_uuid(), 'e3200004-0000-4000-8000-000000000004', 'HEADING', 1, jsonb_build_object('text', $$Apa Itu Virus?$$)),
(gen_random_uuid(), 'e3200004-0000-4000-8000-000000000004', 'PARAGRAPH', 2, jsonb_build_object('text', $$Virus adalah partikel mikroskopis yang hanya bisa berkembang biak di dalam sel makhluk hidup. Ukurannya 20 sampai 300 nanometer — sekitar 50 kali lebih kecil dari bakteri. Virus menyebabkan penyakit seperti flu, COVID-19, dan AIDS, tetapi juga berperan dalam ekosistem, misalnya memangsa bakteri di lautan.$$)),
(gen_random_uuid(), 'e3200004-0000-4000-8000-000000000004', 'HEADING', 3, jsonb_build_object('text', $$Struktur Virus$$)),
(gen_random_uuid(), 'e3200004-0000-4000-8000-000000000004', 'PARAGRAPH', 4, jsonb_build_object('text', $$Struktur virus sangat sederhana: materi genetik (DNA atau RNA) yang dibungkus kapsid protein. Sebagian virus memiliki selubung lipid di luar kapsid. Tidak ada sitoplasma, tidak ada organel, tidak ada ribosom — virus tidak punya mesin untuk membuat protein sendiri.$$)),
(gen_random_uuid(), 'e3200004-0000-4000-8000-000000000004', 'HEADING', 5, jsonb_build_object('text', $$Mengapa Virus Dianggap Bukan Makhluk Hidup?$$)),
(gen_random_uuid(), 'e3200004-0000-4000-8000-000000000004', 'PARAGRAPH', 6, jsonb_build_object('text', $$Makhluk hidup umumnya memenuhi ciri: bernapas, bergerak, tumbuh, dan berkembang biak sendiri. Virus tidak memenuhi satu pun secara mandiri: ia tidak bernapas, tidak makan, tidak tumbuh, dan tidak bisa memperbanyak diri tanpa sel inang. Di luar sel inang, virus hanyalah partikel mati yang menunggu.$$)),
(gen_random_uuid(), 'e3200004-0000-4000-8000-000000000004', 'HEADING', 7, jsonb_build_object('text', $$Cara Virus Berkembang Biak$$)),
(gen_random_uuid(), 'e3200004-0000-4000-8000-000000000004', 'PARAGRAPH', 8, jsonb_build_object('text', $$Virus menempel pada sel inang, menyuntikkan materi genetiknya, lalu membajak mesin sel untuk membuat salinan virus baru. Siklus litik menghancurkan sel inang untuk melepaskan virus baru, sedangkan siklus lisogenik menyisipkan DNA virus ke dalam DNA inang dan menunggu waktu yang tepat untuk aktif.$$)),
(gen_random_uuid(), 'e3200004-0000-4000-8000-000000000004', 'HEADING', 9, jsonb_build_object('text', $$Virus vs Bakteri$$)),
(gen_random_uuid(), 'e3200004-0000-4000-8000-000000000004', 'PARAGRAPH', 10, jsonb_build_object('text', $$Bakteri adalah sel hidup utuh yang bisa berkembang biak sendiri — karena itu antibiotik bisa membunuhnya dengan merusak dinding sel atau mesin proteinnya. Virus bukan sel, sehingga antibiotik tidak mempan terhadapnya. Inilah alasan dokter tidak meresepkan antibiotik untuk flu yang disebabkan virus.$$))
ON CONFLICT (id) DO NOTHING;

-- ============ 5. SCH-SMP-ING2-001: Passive Voice ============
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, status, created_by, updated_by)
VALUES ('e3200005-0000-4000-8000-000000000005', 'SCH-SMP-ING2-001', 'd4444444-4444-4444-4444-444444444444',
'Bahasa Inggris Kelas 9: Passive Voice', 'bahasa-inggris-kelas-9-passive-voice',
'Materi passive voice kelas 9: rumus be + past participle, contoh kalimat, kapan menggunakannya, latihan soal, dan kunci jawaban.',
'id', 8, 'DRAFT', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (id) DO NOTHING;

INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
(gen_random_uuid(), 'e3200005-0000-4000-8000-000000000005', 'HEADING', 1, jsonb_build_object('text', $$Tujuan Pembelajaran$$)),
(gen_random_uuid(), 'e3200005-0000-4000-8000-000000000005', 'PARAGRAPH', 2, jsonb_build_object('text', $$Setelah mempelajari materi ini, siswa diharapkan mampu: (1) menjelaskan pengertian passive voice, (2) mengubah kalimat active menjadi passive dengan benar, (3) menggunakan passive voice dalam konteks yang tepat.$$)),
(gen_random_uuid(), 'e3200005-0000-4000-8000-000000000005', 'HEADING', 3, jsonb_build_object('text', $$Apa Itu Passive Voice?$$)),
(gen_random_uuid(), 'e3200005-0000-4000-8000-000000000005', 'PARAGRAPH', 4, jsonb_build_object('text', $$Dalam kalimat active, subjek melakukan aksi: "Rina writes a letter" (Rina menulis surat). Dalam kalimat passive, subjek menerima aksi: "A letter is written by Rina" (Surat ditulis oleh Rina). Fokusnya berpindah dari pelaku ke objek yang dikenai tindakan.$$)),
(gen_random_uuid(), 'e3200005-0000-4000-8000-000000000005', 'HEADING', 5, jsonb_build_object('text', $$Rumus Passive Voice$$)),
(gen_random_uuid(), 'e3200005-0000-4000-8000-000000000005', 'PARAGRAPH', 6, jsonb_build_object('text', $$Rumus dasarnya: be + past participle (verb 3). Bentuk "be" menyesuaikan tenses: Simple Present memakai is/am/are (The cake is baked), Simple Past memakai was/were (The cake was baked), Present Perfect memakai has/have been (The cake has been baked), dan Future memakai will be (The cake will be baked).$$)),
(gen_random_uuid(), 'e3200005-0000-4000-8000-000000000005', 'HEADING', 7, jsonb_build_object('text', $$Contoh Kalimat$$)),
(gen_random_uuid(), 'e3200005-0000-4000-8000-000000000005', 'LIST', 8, jsonb_build_object('items', ARRAY[$$Active: "She cleans the room every day" → Passive: "The room is cleaned by her every day"$$, $$Active: "They built this bridge in 1990" → Passive: "This bridge was built in 1990"$$, $$Active: "Someone has stolen my bike" → Passive: "My bike has been stolen"$$, $$Active: "The teacher will announce the result" → Passive: "The result will be announced by the teacher"$$])),
(gen_random_uuid(), 'e3200005-0000-4000-8000-000000000005', 'HEADING', 9, jsonb_build_object('text', $$Kapan Menggunakan Passive Voice?$$)),
(gen_random_uuid(), 'e3200005-0000-4000-8000-000000000005', 'PARAGRAPH', 10, jsonb_build_object('text', $$Gunakan passive voice ketika pelaku tidak penting atau tidak diketahui ("My wallet was stolen" — siapa pencurinya tidak diketahui), ketika ingin menekankan hasil ("The temple was restored beautifully"), atau dalam tulisan formal dan ilmiah yang menghindari kata ganti orang pertama.$$)),
(gen_random_uuid(), 'e3200005-0000-4000-8000-000000000005', 'HEADING', 11, jsonb_build_object('text', $$Latihan Soal$$)),
(gen_random_uuid(), 'e3200005-0000-4000-8000-000000000005', 'PARAGRAPH', 12, jsonb_build_object('text', $$Ubahlah ke passive voice! 1) Budi eats an apple → ... 2) They repaired the car yesterday → ... 3) Sinta will finish the homework → ... Kunci jawaban: 1) An apple is eaten by Budi. 2) The car was repaired yesterday. 3) The homework will be finished by Sinta.$$))
ON CONFLICT (id) DO NOTHING;

-- ============ 6. SCH-SD-PKN2-001: Musyawarah ============
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, status, created_by, updated_by)
VALUES ('e3200006-0000-4000-8000-000000000006', 'SCH-SD-PKN2-001', 'd3333333-3333-3333-3333-333333333333',
'PKN Kelas 5: Musyawarah untuk Mufakat', 'pkn-kelas-5-musyawarah',
'Materi PKN kelas 5 tentang musyawarah: pengertian, ciri-ciri, contoh dalam kehidupan sehari-hari, manfaat, latihan soal, dan kunci jawaban.',
'id', 7, 'DRAFT', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (id) DO NOTHING;

INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
(gen_random_uuid(), 'e3200006-0000-4000-8000-000000000006', 'HEADING', 1, jsonb_build_object('text', $$Tujuan Pembelajaran$$)),
(gen_random_uuid(), 'e3200006-0000-4000-8000-000000000006', 'PARAGRAPH', 2, jsonb_build_object('text', $$Setelah mempelajari materi ini, siswa diharapkan mampu: (1) menjelaskan pengertian musyawarah, (2) menyebutkan ciri-ciri musyawarah, (3) memberi contoh musyawarah dalam kehidupan sehari-hari, (4) menjelaskan manfaat musyawarah.$$)),
(gen_random_uuid(), 'e3200006-0000-4000-8000-000000000006', 'HEADING', 3, jsonb_build_object('text', $$Apa Itu Musyawarah?$$)),
(gen_random_uuid(), 'e3200006-0000-4000-8000-000000000006', 'PARAGRAPH', 4, jsonb_build_object('text', $$Musyawarah adalah cara mengambil keputusan bersama dengan cara berdiskusi dan bertukar pendapat hingga tercapai kesepakatan (mufakat). Musyawarah merupakan pengamalan sila keempat Pancasila: "Kerakyatan yang dipimpin oleh hikmat kebijaksanaan dalam permusyawaratan/perwakilan."$$)),
(gen_random_uuid(), 'e3200006-0000-4000-8000-000000000006', 'HEADING', 5, jsonb_build_object('text', $$Ciri-ciri Musyawarah$$)),
(gen_random_uuid(), 'e3200006-0000-4000-8000-000000000006', 'LIST', 6, jsonb_build_object('items', ARRAY[$$Dilakukan dengan kepala dingin, tidak emosi$$, $$Setiap peserta boleh menyampaikan pendapat$$, $$Menghargai pendapat orang lain$$, $$Keputusan diambil untuk kepentingan bersama, bukan pribadi$$, $$Hasil keputusan dilaksanakan dengan tanggung jawab$$])),
(gen_random_uuid(), 'e3200006-0000-4000-8000-000000000006', 'HEADING', 7, jsonb_build_object('text', $$Contoh Musyawarah dalam Kehidupan Sehari-hari$$)),
(gen_random_uuid(), 'e3200006-0000-4000-8000-000000000006', 'PARAGRAPH', 8, jsonb_build_object('text', $$Di rumah: keluarga bermusyawarah menentukan tujuan liburan. Di kelas: siswa bermusyawarah memilih ketua kelas atau menentukan jadwal piket. Di masyarakat: warga bermusyawarah menentukan jadwal kerja bakti atau ronda malam.$$)),
(gen_random_uuid(), 'e3200006-0000-4000-8000-000000000006', 'HEADING', 9, jsonb_build_object('text', $$Manfaat Musyawarah$$)),
(gen_random_uuid(), 'e3200006-0000-4000-8000-000000000006', 'LIST', 10, jsonb_build_object('items', ARRAY[$$Keputusan diterima semua pihak sehingga tidak ada yang merasa dirugikan$$, $$Menumbuhkan rasa persatuan dan kebersamaan$$, $$Melatih keberanian menyampaikan pendapat$$, $$Menghasilkan keputusan yang lebih bijak karena banyak masukan$$])),
(gen_random_uuid(), 'e3200006-0000-4000-8000-000000000006', 'HEADING', 11, jsonb_build_object('text', $$Latihan Soal$$)),
(gen_random_uuid(), 'e3200006-0000-4000-8000-000000000006', 'PARAGRAPH', 12, jsonb_build_object('text', $$1) Musyawarah merupakan pengamalan sila Pancasila ke-... 2) Sebutkan dua ciri musyawarah! 3) Berikan satu contoh musyawarah di sekolah! Kunci jawaban: 1) Keempat. 2) Setiap peserta boleh berpendapat; menghargai pendapat orang lain (jawaban lain yang benar diterima). 3) Musyawarah memilih ketua kelas / menentukan jadwal piket (jawaban lain yang benar diterima).$$))
ON CONFLICT (id) DO NOTHING;
