-- Batch 114: 6 artikel (12/12/10/10/12/12), idempoten

DO $dobl$
DECLARE v_id uuid;
BEGIN
  INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, status, attribution_type, created_by, updated_by, creator_principal_id)
  VALUES ('e114eb37-875e-4855-a9e6-c87ce26274c9', 'TUT-ELEKTRONIK28-001', 'b4444444-4444-4444-4444-444444444444', $body$L298N: Driver Motor DC untuk Arduino$body$, 'l298n-driver-motor-dc', $body$Cara menggerakkan motor DC dengan modul driver L298N: sambungan, arah putar, dan pengaturan kecepatan.$body$, 'id', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
  ON CONFLICT (business_code) DO NOTHING
  RETURNING id INTO v_id;
  IF v_id IS NULL THEN SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'TUT-ELEKTRONIK28-001'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content)
  VALUES
    (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', $body$Masalah yang Diselesaikan$body$)),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 1, jsonb_build_object('text', $body$Pin Arduino hanya sanggup mengeluarkan arus sekitar 40 mA, sedangkan motor DC butuh arus ratusan miliampere hingga beberapa ampere. Menyambung motor langsung ke pin Arduino bisa membakar board. Modul L298N adalah driver H-bridge yang memungkinkan Arduino mengendalikan motor DC berdaya besar dengan aman.$body$)),
    (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', $body$Penjelasan Singkat$body$)),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 3, jsonb_build_object('text', $body$L298N berisi dua jembatan-H (H-bridge) sehingga bisa menggerakkan dua motor DC sekaligus, masing-masing dengan kontrol arah (maju/mundur) dan kecepatan (PWM). Modul ini menerima tegangan motor 5-35 V dan menyediakan regulator 5 V untuk logika. Arduino hanya mengirim sinyal kontrol berarus kecil, sedangkan arus besar mengalir dari catu daya eksternal melalui L298N ke motor.$body$)),
    (gen_random_uuid(), v_id, 'HEADING', 4, jsonb_build_object('text', $body$Persiapan Alat dan Bahan$body$)),
    (gen_random_uuid(), v_id, 'LIST', 5, jsonb_build_object('items', ARRAY[$li$Modul driver L298N$li$, $li$Arduino Uno/Nano$li$, $li$Motor DC 6-12 V (1-2 buah)$li$, $li$Catu daya eksternal sesuai motor (baterai/adaptor)$li$, $li$Kabel jumper male-female dan male-male$li$, $li$Obeng kecil$li$]::text[])),
    (gen_random_uuid(), v_id, 'HEADING', 6, jsonb_build_object('text', $body$Langkah-Langkah$body$)),
    (gen_random_uuid(), v_id, 'LIST', 7, jsonb_build_object('items', ARRAY[$li$Sambungkan OUT1 dan OUT2 L298N ke kedua kabel motor DC.$li$, $li$Hubungkan 12 V dan GND L298N ke catu daya eksternal motor.$li$, $li$Sambungkan GND Arduino ke GND L298N (wajib, agar referensi tegangan sama).$li$, $li$Sambungkan IN1 ke pin 8 dan IN2 ke pin 9 Arduino, ENA ke pin 10 (PWM).$li$, $li$Pasang jumper 5 V-EN jika motor memakai tegangan 7-12 V (regulator aktif).$li$, $li$Program Arduino: IN1=HIGH, IN2=LOW untuk maju; balik untuk mundur.$li$, $li$Atur kecepatan dengan analogWrite pada pin ENA (0-255).$li$, $li$Uji dengan motor tanpa beban dulu sebelum dipasang ke roda robot.$li$]::text[])),
    (gen_random_uuid(), v_id, 'HEADING', 8, jsonb_build_object('text', $body$Risiko dan Cara Menghindarinya$body$)),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 9, jsonb_build_object('text', $body$WARNING: jangan mencatu motor dari pin 5V Arduino lewat modul — catu daya motor harus terpisah. Pastikan polaritas catu daya tidak terbalik karena bisa merusak modul. L298N menjadi panas saat beban berat; pasang heatsink bawaannya dan jangan sentuh saat beroperasi. Lepas jumper 5 V-EN jika tegangan motor di atas 12 V agar regulator tidak overheat.$body$)),
    (gen_random_uuid(), v_id, 'HEADING', 10, jsonb_build_object('text', $body$Pemeriksaan Hasil dan Tindak Lanjut$body$)),
    (gen_random_uuid(), v_id, 'LIST', 11, jsonb_build_object('items', ARRAY[$li$Motor berputar saat program dijalankan dan berhenti saat diperintah.$li$, $li$Arah putar berubah sesuai logika IN1/IN2.$li$, $li$Kecepatan berubah mulus saat nilai PWM diubah.$li$, $li$Modul tidak berbau gosong dan tidak terlalu panas.$li$, $li$Tindak lanjut: tambahkan sensor ultrasonik untuk robot penghindar rintangan, atau gunakan driver kedua untuk sistem 4 roda. Simpan wiring diagram dan kode sebagai dokumentasi proyek.$li$]::text[]));
END $dobl$;

DO $dobl$
DECLARE v_id uuid;
BEGIN
  INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, status, attribution_type, created_by, updated_by, creator_principal_id)
  VALUES ('e1148b66-3b2b-4849-86c1-5a303cfffcc7', 'TUT-MASAK33-001', 'b7777777-7777-7777-7777-777777777777', $body$Gudeg: Resep Khas Jogja yang Manis Gurih$body$, 'gudeg-resep-jogja', $body$Resep gudeg nangka muda khas Yogyakarta: manis, gurih, dan empuk dengan santan dan gula aren.$body$, 'id', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
  ON CONFLICT (business_code) DO NOTHING
  RETURNING id INTO v_id;
  IF v_id IS NULL THEN SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'TUT-MASAK33-001'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content)
  VALUES
    (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', $body$Masalah yang Diselesaikan$body$)),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 1, jsonb_build_object('text', $body$Gudeg buatan rumah sering gagal: nangka keras, kuah encer, atau rasa manisnya tidak meresap. Padahal kunci gudeg enak ada pada proses memasak yang lama dan perlahan agar bumbu meresap sempurna ke dalam nangka muda.$body$)),
    (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', $body$Penjelasan Singkat$body$)),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 3, jsonb_build_object('text', $body$Gudeg adalah masakan tradisional Yogyakarta dari nangka muda yang dimasak berjam-jam dengan santan, gula aren, dan rempah. Warna cokelat khasnya berasal dari gula aren dan daun jati (opsional). Gudeg biasanya disajikan dengan ayam opor, telur pindang, tahu-tempe bacem, dan sambal krecek.$body$)),
    (gen_random_uuid(), v_id, 'HEADING', 4, jsonb_build_object('text', $body$Persiapan Bahan$body$)),
    (gen_random_uuid(), v_id, 'LIST', 5, jsonb_build_object('items', ARRAY[$li$1 kg nangka muda, potong-potong$li$, $li$500 ml santan kental + 500 ml santan encer$li$, $li$150 g gula aren, sisir halus$li$, $li$5 butir telur rebus (untuk pindang)$li$, $li$Bumbu halus: 8 bawang merah, 5 bawang putih, 4 kemiri, 1 sdt ketumbar$li$, $li$3 lembar daun salam, 2 batang serai, lengkuas, garam secukupnya$li$, $li$Daun jati 3-4 lembar (opsional, untuk warna)$li$]::text[])),
    (gen_random_uuid(), v_id, 'HEADING', 6, jsonb_build_object('text', $body$Langkah-Langkah$body$)),
    (gen_random_uuid(), v_id, 'LIST', 7, jsonb_build_object('items', ARRAY[$li$Rebus nangka muda 15 menit, tiriskan untuk menghilangkan getah.$li$, $li$Tumis bumbu halus hingga harum, masukkan daun salam, serai, dan lengkuas.$li$, $li$Masukkan nangka, gula aren, dan garam; aduk rata.$li$, $li$Tuang santan encer, masak dengan api kecil 1,5-2 jam sambil sesekali diaduk.$li$, $li$Masukkan santan kental dan telur rebus, masak lagi 30-45 menit hingga kuah menyusut.$li$, $li$Koreksi rasa: manis gurih seimbang, nangka empuk dan berwarna cokelat.$li$, $li$Angkat dan sajikan dengan lauk pendamping.$li$]::text[])),
    (gen_random_uuid(), v_id, 'HEADING', 8, jsonb_build_object('text', $body$Risiko dan Cara Menghindarinya$body$)),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 9, jsonb_build_object('text', $body$Santan bisa pecah jika api terlalu besar atau jarang diaduk — gunakan api kecil dan aduk perlahan. Nangka bisa pahit jika getahnya tidak direbus dulu. Jangan tambah air terlalu banyak di akhir agar kuah tidak encer. Hati-hati saat mengaduk panci besar berisi cairan panas.$body$)),
    (gen_random_uuid(), v_id, 'HEADING', 10, jsonb_build_object('text', $body$Pemeriksaan Hasil dan Tindak Lanjut$body$)),
    (gen_random_uuid(), v_id, 'LIST', 11, jsonb_build_object('items', ARRAY[$li$Nangka empuk dan mudah dipotong sendok.$li$, $li$Warna cokelat merata, bukan pucat.$li$, $li$Rasa manis dan gurih seimbang, tidak hambar.$li$, $li$Kuah kental, tidak encer berair.$li$, $li$Sisa gudeg bisa disimpan di kulkas 3-4 hari dan makin meresap saat dipanaskan ulang. Tindak lanjut: coba varian gudeg manggar atau buat krecek pedas sebagai pendamping.$li$]::text[]));
END $dobl$;

DO $dobl$
DECLARE v_id uuid;
BEGIN
  INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, status, attribution_type, created_by, updated_by, creator_principal_id)
  VALUES ('e1140251-03f6-49c8-94bb-b35e18433352', 'EXP-KIMIA49-001', 'c4444444-4444-4444-4444-444444444444', $body$Silikon: Unsur di Balik Chip Komputer$body$, 'silikon-dasar-chip', $body$Mengenal silikon, unsur semikonduktor yang menjadi fondasi chip komputer dan panel surya.$body$, 'id', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
  ON CONFLICT (business_code) DO NOTHING
  RETURNING id INTO v_id;
  IF v_id IS NULL THEN SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-KIMIA49-001'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content)
  VALUES
    (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', $body$Apa Itu Silikon?$body$)),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 1, jsonb_build_object('text', $body$Silikon (simbol Si, nomor atom 14) adalah unsur metaloid — sifatnya di antara logam dan nonlogam. Ia adalah unsur kedua terbanyak di kerak bumi setelah oksigen, terutama dalam bentuk pasir (silika) dan kuarsa. Sifat terpenting silikon adalah sebagai semikonduktor: daya hantar listriknya bisa diatur.$body$)),
    (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', $body$Sifat Semikonduktor$body$)),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 3, jsonb_build_object('text', $body$Silikon murni hampir tidak menghantarkan listrik, tetapi dengan menambahkan sedikit unsur lain (doping, misalnya fosfor atau boron), daya hantarnya bisa dikendalikan dengan presisi. Sifat inilah yang memungkinkan pembuatan transistor — sakelar mikroskopis yang menjadi dasar semua chip komputer.$body$)),
    (gen_random_uuid(), v_id, 'HEADING', 4, jsonb_build_object('text', $body$Dari Pasir Menjadi Chip$body$)),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 5, jsonb_build_object('text', $body$Pasir kuarsa dimurnikan menjadi silikon metalurgi, lalu dimurnikan lagi menjadi silikon polysilicon berkemurnian sangat tinggi. Silikon dilelehkan dan ditarik menjadi kristal silinder tunggal (ingot), dipotong tipis menjadi wafer, dan di atas wafer inilah miliaran transistor dicetak dengan teknologi litografi.$body$)),
    (gen_random_uuid(), v_id, 'HEADING', 6, jsonb_build_object('text', $body$Kegunaan Sehari-hari$body$)),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 7, jsonb_build_object('text', $body$Selain chip komputer dan ponsel, silikon dipakai pada panel surya (sel fotovoltaik mengubah cahaya menjadi listrik), kaca, keramik, silikon sealant untuk bangunan, serta minyak silikon pada kosmetik dan pelumas. Senyawa silikon juga menjadi bahan implan medis karena biokompatibel.$body$)),
    (gen_random_uuid(), v_id, 'HEADING', 8, jsonb_build_object('text', $body$Fakta Menarik$body$)),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 9, jsonb_build_object('text', $body$Satu wafer silikon berdiameter 30 cm bisa memuat ratusan chip prosesor. Transistor modern berukuran hanya beberapa nanometer — puluhan ribu kali lebih tipis dari rambut manusia. Istilah Silicon Valley berasal dari banyaknya perusahaan semikonduktor yang memakai silikon di kawasan itu.$body$));
END $dobl$;

DO $dobl$
DECLARE v_id uuid;
BEGIN
  INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, status, attribution_type, created_by, updated_by, creator_principal_id)
  VALUES ('e1148b43-1eee-4a6e-9104-b3b9ffdb3a84', 'EXP-SEJARAH34-001', 'c8888888-8888-8888-8888-888888888888', $body$Perang Diponegoro: Perlawanan Terbesar Abad ke-19$body$, 'perang-diponegoro', $body$Kisah Perang Jawa 1825-1830 yang dipimpin Pangeran Diponegoro melawan pemerintah kolonial Belanda.$body$, 'id', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
  ON CONFLICT (business_code) DO NOTHING
  RETURNING id INTO v_id;
  IF v_id IS NULL THEN SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-SEJARAH34-001'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content)
  VALUES
    (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', $body$Latar Belakang$body$)),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 1, jsonb_build_object('text', $body$Perang Diponegoro, atau Perang Jawa, berlangsung tahun 1825-1830. Pemicunya antara lain pemasangan patok jalan oleh Belanda yang melintasi makam leluhur Diponegoro di Tegalrejo, beban pajak yang memberatkan rakyat, serta campur tangan Belanda dalam urusan keraton Yogyakarta. Pangeran Diponegoro, putra sulung Sultan Hamengku Buwono III, memimpin perlawanan.$body$)),
    (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', $body$Jalannya Perang$body$)),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 3, jsonb_build_object('text', $body$Perang dimulai dari Tegalrejo dan meluas ke hampir seluruh Jawa Tengah dan sebagian Jawa Timur. Pasukan Diponegoro menggunakan taktik gerilya: menyerang cepat lalu menghilang ke hutan dan gunung. Perang ini melibatkan puluhan ribu pejuang dan menjadi perang kolonial terbesar dan termahal bagi Belanda di abad ke-19.$body$)),
    (gen_random_uuid(), v_id, 'HEADING', 4, jsonb_build_object('text', $body$Strategi Belanda$body$)),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 5, jsonb_build_object('text', $body$Belanda di bawah Jenderal De Kock menerapkan strategi benteng stelsel — membangun benteng-benteng kecil yang saling terhubung untuk mempersempit ruang gerak pasukan Diponegoro. Strategi ini lambat namun efektif memutus jalur logistik dan komunikasi para pejuang.$body$)),
    (gen_random_uuid(), v_id, 'HEADING', 6, jsonb_build_object('text', $body$Akhir Perang$body$)),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 7, jsonb_build_object('text', $body$Pada Maret 1830, Diponegoro ditangkap secara licik saat perundingan di Magelang setelah dijanjikan perundingan damai. Ia kemudian diasingkan ke Manado dan akhirnya ke Makassar, tempat ia wafat pada 8 Januari 1855. Perang berakhir dengan kemenangan Belanda, tetapi dengan biaya sangat besar.$body$)),
    (gen_random_uuid(), v_id, 'HEADING', 8, jsonb_build_object('text', $body$Dampak dan Warisan$body$)),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 9, jsonb_build_object('text', $body$Perang Diponegoro menelan korban ratusan ribu jiwa dan menguras kas Belanda hingga memicu perubahan kebijakan kolonial, termasuk lahirnya Sistem Tanam Paksa. Bagi Indonesia, Diponegoro dikenang sebagai pahlawan nasional dan simbol perlawanan terhadap penjajahan. Catatan sejarah ini disajikan faktual-netral berdasarkan sumber-sumber sejarah yang umum dirujuk.$body$));
END $dobl$;

DO $dobl$
DECLARE v_id uuid;
BEGIN
  INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, status, attribution_type, created_by, updated_by, creator_principal_id)
  VALUES ('e1142319-5425-4059-bf6e-f6553a566bc3', 'SCH-SMA-EKO7-001', 'd5555555-5555-5555-5555-555555555555', $body$Ekonomi Kelas 11: APBN dan APBD$body$, 'ekonomi-kelas-11-apbn', $body$Memahami APBN dan APBD: pengertian, fungsi, sumber pendapatan, dan jenis belanja negara.$body$, 'id', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
  ON CONFLICT (business_code) DO NOTHING
  RETURNING id INTO v_id;
  IF v_id IS NULL THEN SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'SCH-SMA-EKO7-001'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content)
  VALUES
    (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', $body$Tujuan Pembelajaran$body$)),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 1, jsonb_build_object('text', $body$Setelah mempelajari materi ini, siswa diharapkan mampu menjelaskan pengertian APBN dan APBD, menyebutkan fungsi-fungsinya, mengidentifikasi sumber pendapatan negara, serta membedakan jenis-jenis belanja negara.$body$)),
    (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', $body$Pengertian APBN dan APBD$body$)),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 3, jsonb_build_object('text', $body$APBN (Anggaran Pendapatan dan Belanja Negara) adalah rencana keuangan tahunan pemerintah pusat yang disetujui DPR. APBD (Anggaran Pendapatan dan Belanja Daerah) adalah rencana keuangan tahunan pemerintah daerah yang disetujui DPRD. Keduanya menjadi pedoman penerimaan dan pengeluaran negara/daerah selama satu tahun anggaran.$body$)),
    (gen_random_uuid(), v_id, 'HEADING', 4, jsonb_build_object('text', $body$Fungsi APBN/APBD$body$)),
    (gen_random_uuid(), v_id, 'LIST', 5, jsonb_build_object('items', ARRAY[$li$Fungsi otorisasi: menjadi dasar hukum pelaksanaan pendapatan dan belanja.$li$, $li$Fungsi perencanaan: pedoman kegiatan yang akan dilaksanakan pemerintah.$li$, $li$Fungsi pengawasan: alat menilai apakah kegiatan sesuai rencana.$li$, $li$Fungsi alokasi: mengarahkan dana ke sektor prioritas pembangunan.$li$, $li$Fungsi distribusi: memperhatikan keadilan dan pemerataan.$li$, $li$Fungsi stabilisasi: menjaga keseimbangan ekonomi makro.$li$]::text[])),
    (gen_random_uuid(), v_id, 'HEADING', 6, jsonb_build_object('text', $body$Sumber Pendapatan Negara$body$)),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 7, jsonb_build_object('text', $body$Pendapatan negara terdiri dari penerimaan perpajakan (pajak penghasilan, PPN, cukai, bea masuk), penerimaan negara bukan pajak/PNBP (sumber daya alam, dividen BUMN, denda), dan hibah. Pajak merupakan sumber terbesar APBN Indonesia.$body$)),
    (gen_random_uuid(), v_id, 'HEADING', 8, jsonb_build_object('text', $body$Jenis Belanja Negara$body$)),
    (gen_random_uuid(), v_id, 'LIST', 9, jsonb_build_object('items', ARRAY[$li$Belanja pemerintah pusat: belanja pegawai (misal gaji guru PNS), belanja barang, belanja modal (misal pembangunan jalan tol), pembayaran bunga utang, subsidi.$li$, $li$Transfer ke daerah: dana bagi hasil, dana alokasi umum (DAU), dana alokasi khusus (DAK) — contohnya dana BOS untuk sekolah.$li$, $li$Defisit terjadi jika belanja lebih besar dari pendapatan, dan ditutup dengan pembiayaan seperti penerbitan surat utang negara.$li$]::text[])),
    (gen_random_uuid(), v_id, 'HEADING', 10, jsonb_build_object('text', $body$Latihan Soal dan Kunci Jawaban$body$)),
    (gen_random_uuid(), v_id, 'LIST', 11, jsonb_build_object('items', ARRAY[$li$Soal 1: Jelaskan perbedaan APBN dan APBD! — Jawaban: APBN untuk pemerintah pusat disetujui DPR; APBD untuk pemerintah daerah disetujui DPRD.$li$, $li$Soal 2: Sebutkan tiga fungsi APBN! — Jawaban: otorisasi (dasar hukum), perencanaan (pedoman kegiatan), pengawasan (alat penilaian); plus alokasi, distribusi, stabilisasi.$li$, $li$Soal 3: Apa sumber pendapatan negara terbesar? — Jawaban: pajak (PPh, PPN, cukai, dan lain-lain).$li$, $li$Soal 4: Belanja Rp2.500 T dan pendapatan Rp2.200 T — berapa defisit dan cara menutupnya? — Jawaban: defisit Rp300 T; ditutup dengan pembiayaan, misalnya penerbitan surat berharga negara.$li$]::text[]));
END $dobl$;

DO $dobl$
DECLARE v_id uuid;
BEGIN
  INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, status, attribution_type, created_by, updated_by, creator_principal_id)
  VALUES ('e114025c-4146-45ca-be08-6b52516a305a', 'SCH-SD-IPS32-001', 'd3333333-3333-3333-3333-333333333333', $body$IPS Kelas 5: Mengenal Kenampakan Alam$body$, 'mengenal-kenampakan-alam-ips-kelas-5', $body$Mengenal kenampakan alam daratan dan perairan Indonesia beserta manfaatnya bagi manusia.$body$, 'id', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
  ON CONFLICT (business_code) DO NOTHING
  RETURNING id INTO v_id;
  IF v_id IS NULL THEN SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'SCH-SD-IPS32-001'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content)
  VALUES
    (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', $body$Tujuan Pembelajaran$body$)),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 1, jsonb_build_object('text', $body$Setelah belajar, siswa dapat menyebutkan contoh kenampakan alam daratan dan perairan, menjelaskan manfaatnya, serta menunjukkan sikap menjaga kelestarian alam.$body$)),
    (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', $body$Apa Itu Kenampakan Alam?$body$)),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 3, jsonb_build_object('text', $body$Kenampakan alam adalah segala sesuatu di permukaan bumi yang terbentuk secara alami, bukan buatan manusia. Kenampakan alam dibagi dua: kenampakan alam daratan dan kenampakan alam perairan. Indonesia yang luas memiliki keduanya dengan sangat beragam.$body$)),
    (gen_random_uuid(), v_id, 'HEADING', 4, jsonb_build_object('text', $body$Kenampakan Alam Daratan$body$)),
    (gen_random_uuid(), v_id, 'LIST', 5, jsonb_build_object('items', ARRAY[$li$Dataran rendah: cocok untuk pertanian, perkebunan, dan permukiman.$li$, $li$Dataran tinggi: berhawa sejuk, cocok untuk sayuran dan wisata.$li$, $li$Gunung: sumber air, hasil tambang, dan wisata pendakian.$li$, $li$Bukit dan lembah: perkebunan dan pemandangan indah.$li$, $li$Pantai: wisata, perikanan, dan pelabuhan.$li$]::text[])),
    (gen_random_uuid(), v_id, 'HEADING', 6, jsonb_build_object('text', $body$Kenampakan Alam Perairan$body$)),
    (gen_random_uuid(), v_id, 'LIST', 7, jsonb_build_object('items', ARRAY[$li$Sungai: sumber air, irigasi, transportasi, dan listrik (PLTA).$li$, $li$Danau: wisata, perikanan, dan cadangan air.$li$, $li$Rawa: habitat hewan dan tumbuhan khas.$li$, $li$Laut: perikanan, pelayaran, dan wisata bahari.$li$, $li$Selat dan teluk: jalur pelayaran dan pelabuhan alami.$li$]::text[])),
    (gen_random_uuid(), v_id, 'HEADING', 8, jsonb_build_object('text', $body$Manfaat dan Cara Menjaga Alam$body$)),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 9, jsonb_build_object('text', $body$Kenampakan alam memberi banyak manfaat: tanah subur untuk bertani, air untuk minum dan irigasi, ikan sebagai sumber protein, serta keindahan untuk wisata. Karena itu manusia harus memanfaatkannya dengan bijak: tidak membuang sampah ke sungai, tidak menebang pohon sembarangan, menanam pohon (reboisasi), dan menghemat air. Alam yang lestari membuat hidup manusia nyaman dan sejahtera.$body$)),
    (gen_random_uuid(), v_id, 'HEADING', 10, jsonb_build_object('text', $body$Latihan Soal dan Kunci Jawaban$body$)),
    (gen_random_uuid(), v_id, 'LIST', 11, jsonb_build_object('items', ARRAY[$li$Soal 1: Sebutkan tiga contoh kenampakan alam daratan! — Jawaban: dataran rendah, gunung, pantai (atau bukit, lembah, dataran tinggi).$li$, $li$Soal 2: Sebutkan tiga contoh kenampakan alam perairan! — Jawaban: sungai, danau, laut (atau rawa, selat, teluk).$li$, $li$Soal 3: Apa manfaat sungai bagi manusia? — Jawaban: sumber air minum, irigasi sawah, transportasi, pembangkit listrik.$li$, $li$Soal 4: Tuliskan dua cara menjaga kelestarian alam! — Jawaban: tidak membuang sampah sembarangan dan menanam pohon.$li$]::text[]));
END $dobl$;
