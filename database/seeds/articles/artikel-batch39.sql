-- Batch 39: 6 artikel (DRAFT, id) — idempoten via ON CONFLICT DO NOTHING
-- Owner: f7125028-187e-44e0-b95b-88b69b8d5c9a

BEGIN;

-- ============================================================
-- 1. TUT-KOMPUTER5-001 — Word untuk Pemula: Format Dokumen (R1.D3.K7)
-- ============================================================
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, created_by, updated_by)
VALUES (
  '4e1c03a0-471d-4dff-a071-66ce58c6eb16',
  'TUT-KOMPUTER5-001',
  'baaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  'Word untuk Pemula: Format Dokumen yang Rapi',
  'tut-komputer5-001-word-pemula-format-dokumen',
  'Panduan memformat dokumen Word dari nol: ukuran kertas, margin, font, heading, dan spasi agar hasil cetak rapi dan profesional.',
  'id', 6, NULL,
  'f7125028-187e-44e0-b95b-88b69b8d5c9a',
  'f7125028-187e-44e0-b95b-88b69b8d5c9a'
) ON CONFLICT (business_code) DO NOTHING;

INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
(gen_random_uuid(), '4e1c03a0-471d-4dff-a071-66ce58c6eb16', 'HEADING', 1, jsonb_build_object('text', $$Masalahnya: Dokumen Berantakan Saat Dicetak$$)),
(gen_random_uuid(), '4e1c03a0-471d-4dff-a071-66ce58c6eb16', 'PARAGRAPH', 2, jsonb_build_object('text', $$Di layar dokumen terlihat rapi, tapi saat dicetak barisnya terpotong, judul tidak sejajar, dan spasi tidak konsisten. Masalah ini hampir selalu berasal dari pengaturan format yang tidak disengaja: ukuran kertas salah, margin terlalu sempit, atau font yang berbeda di tiap paragraf.$$)),
(gen_random_uuid(), '4e1c03a0-471d-4dff-a071-66ce58c6eb16', 'HEADING', 3, jsonb_build_object('text', $$Kenapa Format Dokumen Itu Penting$$)),
(gen_random_uuid(), '4e1c03a0-471d-4dff-a071-66ce58c6eb16', 'PARAGRAPH', 4, jsonb_build_object('text', $$Format yang konsisten membuat dokumen mudah dibaca dan terlihat profesional. Sekolah, kampus, dan kantor umumnya menetapkan aturan format baku: kertas A4, margin tertentu, dan font standar seperti Times New Roman ukuran 12. Menguasai dasar-dasarnya membuat tugas dan laporanmu diterima tanpa revisi teknis.$$)),
(gen_random_uuid(), '4e1c03a0-471d-4dff-a071-66ce58c6eb16', 'HEADING', 5, jsonb_build_object('text', $$Yang Perlu Disiapkan$$)),
(gen_random_uuid(), '4e1c03a0-471d-4dff-a071-66ce58c6eb16', 'LIST', 6, jsonb_build_object('text', $$["Aplikasi pengolah kata: Microsoft Word, WPS Office, atau LibreOffice Writer (gratis)", "Naskah mentah yang sudah diketik, atau dokumen lama yang ingin dirapikan", "Catatan aturan format dari guru/dosen/kantor bila ada"]$$)),
(gen_random_uuid(), '4e1c03a0-471d-4dff-a071-66ce58c6eb16', 'HEADING', 7, jsonb_build_object('text', $$Langkah 1–3: Ukuran Kertas dan Margin$$)),
(gen_random_uuid(), '4e1c03a0-471d-4dff-a071-66ce58c6eb16', 'PARAGRAPH', 8, jsonb_build_object('text', $$Buka menu Layout lalu Page Setup. Atur ukuran kertas ke A4 (21 x 29,7 cm) karena itu standar di Indonesia. Kemudian atur margin: pola umum tugas sekolah adalah 4-3-3-3 (kiri 4 cm, atas-kanan-bawah 3 cm). Lakukan ini SEBELUM mengetik panjang agar tata letak tidak bergeser di tengah jalan.$$)),
(gen_random_uuid(), '4e1c03a0-471d-4dff-a071-66ce58c6eb16', 'HEADING', 9, jsonb_build_object('text', $$Langkah 4–6: Font, Heading, dan Spasi$$)),
(gen_random_uuid(), '4e1c03a0-471d-4dff-a071-66ce58c6eb16', 'PARAGRAPH', 10, jsonb_build_object('text', $$Pilih seluruh teks (Ctrl+A) lalu terapkan satu font untuk isi: Times New Roman 12 untuk karya ilmiah, atau Calibri 11 untuk dokumen kantor. Gunakan fitur Styles (Heading 1, Heading 2) untuk judul bab, bukan memperbesar font manual — ini membuat daftar isi otomatis bisa dibuat. Atur spasi baris (line spacing) ke 1,5 atau 2 sesuai aturan, dan aktifkan rata kanan-kiri (justify) untuk paragraf isi.$$)),
(gen_random_uuid(), '4e1c03a0-471d-4dff-a071-66ce58c6eb16', 'HEADING', 11, jsonb_build_object('text', $$Risiko dan Kesalahan Umum$$)),
(gen_random_uuid(), '4e1c03a0-471d-4dff-a071-66ce58c6eb16', 'LIST', 12, jsonb_build_object('text', $$["Menekan Enter berkali-kali untuk pindah halaman — gunakan Page Break (Ctrl+Enter) agar tidak bergeser saat teks berubah", "Menggunakan spasi berulang untuk meratakan teks — gunakan Tab atau perataan paragraf", "Beda font di tiap bab — selalu mulai dengan memilih seluruh teks lalu menerapkan font yang sama", "Lupa menyimpan: biasakan menekan Ctrl+S tiap beberapa menit, atau aktifkan penyimpanan otomatis"]$$))
ON CONFLICT (article_id, position) DO NOTHING;

-- ============================================================
-- 2. TUT-KESEHATAN5-001 — Demam pada Anak: Pertolongan Pertama (R1.D4)
-- ============================================================
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, created_by, updated_by)
VALUES (
  '9cc93a04-2a6e-4617-852b-98fc71d0ea99',
  'TUT-KESEHATAN5-001',
  'b5555555-5555-5555-5555-555555555555',
  'Demam pada Anak: Pertolongan Pertama di Rumah',
  'tut-kesehatan5-001-demam-anak-pertolongan-pertama',
  'Langkah aman menangani demam anak di rumah: mengukur suhu, kompres, cairan, dan tanda bahaya yang mengharuskan ke dokter. Informasi umum, bukan pengganti nasihat medis.',
  'id', 6, NULL,
  'f7125028-187e-44e0-b95b-88b69b8d5c9a',
  'f7125028-187e-44e0-b95b-88b69b8d5c9a'
) ON CONFLICT (business_code) DO NOTHING;

INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
(gen_random_uuid(), '9cc93a04-2a6e-4617-852b-98fc71d0ea99', 'HEADING', 1, jsonb_build_object('text', $$Masalahnya: Anak Demam Tengah Malam$$)),
(gen_random_uuid(), '9cc93a04-2a6e-4617-852b-98fc71d0ea99', 'PARAGRAPH', 2, jsonb_build_object('text', $$Badan anak terasa panas, ia rewel dan tidak mau makan. Orang tua panik: harus dibawa ke IGD sekarang atau bisa ditangani di rumah dulu? Demam sebenarnya adalah respons alami tubuh melawan infeksi, dan sebagian besar demam pada anak bisa dipantau di rumah selama orang tua tahu batas amannya.$$)),
(gen_random_uuid(), '9cc93a04-2a6e-4617-852b-98fc71d0ea99', 'HEADING', 3, jsonb_build_object('text', $$Memahami Demam pada Anak$$)),
(gen_random_uuid(), '9cc93a04-2a6e-4617-852b-98fc71d0ea99', 'PARAGRAPH', 4, jsonb_build_object('text', $$Demam didefinisikan sebagai suhu tubuh 38 derajat Celsius atau lebih yang diukur dengan termometer. Yang lebih penting dari angka suhunya adalah kondisi anak: anak yang masih aktif, mau minum, dan bermain umumnya tidak dalam bahaya segera. Sebaliknya, anak yang lemas, sesak, atau tidak mau minum perlu perhatian cepat berapa pun suhunya.$$)),
(gen_random_uuid(), '9cc93a04-2a6e-4617-852b-98fc71d0ea99', 'HEADING', 5, jsonb_build_object('text', $$Yang Perlu Disiapkan$$)),
(gen_random_uuid(), '9cc93a04-2a6e-4617-852b-98fc71d0ea99', 'LIST', 6, jsonb_build_object('text', $$["Termometer digital (lebih aman dan akurat daripada termometer raksa)", "Air hangat dan handuk kecil untuk kompres", "Air putih, ASI, atau oralit untuk menjaga cairan tubuh", "Obat penurun panas anak (paracetamol/ibuprofen) sesuai anjuran dosis di kemasan atau resep dokter"]$$)),
(gen_random_uuid(), '9cc93a04-2a6e-4617-852b-98fc71d0ea99', 'HEADING', 7, jsonb_build_object('text', $$Langkah Pertolongan di Rumah$$)),
(gen_random_uuid(), '9cc93a04-2a6e-4617-852b-98fc71d0ea99', 'PARAGRAPH', 8, jsonb_build_object('text', $$Ukur suhu dengan termometer untuk memastikan. Beri anak pakaian tipis dan kompres hangat (bukan es) di dahi, ketiak, dan lipat paha. Pastikan anak cukup minum karena demam mempercepat kehilangan cairan. Obat penurun panas boleh diberikan sesuai dosis berat badan bila anak tampak tidak nyaman. Pantau suhu dan kondisi anak setiap beberapa jam.$$)),
(gen_random_uuid(), '9cc93a04-2a6e-4617-852b-98fc71d0ea99', 'HEADING', 9, jsonb_build_object('text', $$Tanda Bahaya: Segera ke Dokter$$)),
(gen_random_uuid(), '9cc93a04-2a6e-4617-852b-98fc71d0ea99', 'LIST', 10, jsonb_build_object('text', $$["Bayi di bawah 3 bulan dengan suhu 38 derajat atau lebih", "Kejang demam, leher kaku, atau ruam yang tidak hilang saat ditekan", "Sesak napas, muntah terus-menerus, atau tidak mau minum sama sekali", "Demam lebih dari 3 hari tanpa perbaikan, atau anak tampak semakin lemas"]$$)),
(gen_random_uuid(), '9cc93a04-2a6e-4617-852b-98fc71d0ea99', 'HEADING', 11, jsonb_build_object('text', $$Hal yang Harus Dihindari$$)),
(gen_random_uuid(), '9cc93a04-2a6e-4617-852b-98fc71d0ea99', 'PARAGRAPH', 12, jsonb_build_object('text', $$Jangan menyelimuti anak tebal-tebal karena justru menaikkan suhu. Jangan memberi aspirin pada anak karena berisiko sindrom Reye. Jangan memaksa makan bila anak tidak mau, yang penting cairan tercukupi. Artikel ini adalah informasi umum dan bukan pengganti nasihat medis — bila ragu, konsultasikan ke dokter atau puskesmas terdekat.$$))
ON CONFLICT (article_id, position) DO NOTHING;

-- ============================================================
-- 3. EXP-ANTROPOLOGI5-001 — Suku Toraja: Ritual Rambu Solo (R2.D12)
-- ============================================================
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, created_by, updated_by)
VALUES (
  '4698b233-d380-4834-ad36-a78b4f8ed415',
  'EXP-ANTROPOLOGI5-001',
  'c8888888-8888-8888-8888-888888888888',
  'Suku Toraja: Ritual Rambu Solo dan Filosofi Kematian',
  'exp-antropologi5-001-suku-toraja-rambu-solo',
  'Mengenal masyarakat Toraja di Sulawesi Selatan, rumah adat tongkonan, dan upacara pemakaman Rambu Solo yang terkenal di dunia.',
  'id', 5, NULL,
  'f7125028-187e-44e0-b95b-88b69b8d5c9a',
  'f7125028-187e-44e0-b95b-88b69b8d5c9a'
) ON CONFLICT (business_code) DO NOTHING;

INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
(gen_random_uuid(), '4698b233-d380-4834-ad36-a78b4f8ed415', 'HEADING', 1, jsonb_build_object('text', $$Siapa Orang Toraja?$$)),
(gen_random_uuid(), '4698b233-d380-4834-ad36-a78b4f8ed415', 'PARAGRAPH', 2, jsonb_build_object('text', $$Suku Toraja mendiami dataran tinggi Tana Toraja di Sulawesi Selatan. Mereka terkenal dengan rumah adat tongkonan beratap melengkung seperti perahu, ukiran kayu yang rumit, dan tradisi pemakaman yang unik. Kepercayaan asli mereka, Aluk Todolo, mengatur hampir seluruh aspek kehidupan, termasuk cara mereka memandang kematian.$$)),
(gen_random_uuid(), '4698b233-d380-4834-ad36-a78b4f8ed415', 'HEADING', 3, jsonb_build_object('text', $$Tongkonan: Rumah Para Leluhur$$)),
(gen_random_uuid(), '4698b233-d380-4834-ad36-a78b4f8ed415', 'PARAGRAPH', 4, jsonb_build_object('text', $$Tongkonan bukan sekadar rumah, melainkan pusat identitas keluarga besar. Atapnya yang menjulang melambangkan perahu leluhur, dan dindingnya dihiasi ukiran paqbarre allo dengan makna filosofis. Setiap tongkonan memiliki nama dan silsilah, diwariskan turun-temurun, serta menjadi tempat berkumpulnya keluarga besar dalam upacara adat.$$)),
(gen_random_uuid(), '4698b233-d380-4834-ad36-a78b4f8ed415', 'HEADING', 5, jsonb_build_object('text', $$Rambu Solo: Upacara Pemakaman$$)),
(gen_random_uuid(), '4698b233-d380-4834-ad36-a78b4f8ed415', 'PARAGRAPH', 6, jsonb_build_object('text', $$Rambu Solo adalah upacara pemakaman adat Toraja yang bisa berlangsung berhari-hari. Bagi masyarakat Toraja, kematian bukan akhir melainkan perjalanan menuju puya (alam roh). Jenazah yang belum diupacarai dianggap "sakit" bukan "mati", sehingga keluarga merawatnya di rumah hingga dana dan persiapan upacara terkumpul.$$)),
(gen_random_uuid(), '4698b233-d380-4834-ad36-a78b4f8ed415', 'HEADING', 7, jsonb_build_object('text', $$Rangkaian Upacara$$)),
(gen_random_uuid(), '4698b233-d380-4834-ad36-a78b4f8ed415', 'LIST', 8, jsonb_build_object('text', $$["Penerimaan tamu dan keluarga besar dari berbagai daerah", "Penyembelihan kerbau dan babi sebagai persembahan dan jamuan", "Tarian dan ratapan adat mengiringi prosesi", "Pemakaman jenazah di liang batu tebing atau patane (rumah kubur)"]$$)),
(gen_random_uuid(), '4698b233-d380-4834-ad36-a78b4f8ed415', 'HEADING', 9, jsonb_build_object('text', $$Makna di Balik Kemegahan$$)),
(gen_random_uuid(), '4698b233-d380-4834-ad36-a78b4f8ed415', 'PARAGRAPH', 10, jsonb_build_object('text', $$Semakin megah upacara, semakin tinggi penghormatan kepada yang wafat — dan semakin besar tanggung jawab sosial keluarga. Tradisi ini memperlihatkan betapa kuatnya ikatan kekerabatan dalam masyarakat Toraja: satu upacara bisa mempertemukan ratusan kerabat. Kini Rambu Solo juga menjadi daya tarik wisata budaya dunia, sehingga pelestariannya menjadi tanggung jawab bersama.$$))
ON CONFLICT (article_id, position) DO NOTHING;

-- ============================================================
-- 4. EXP-KIMIA7-001 — Asam Basa dalam Kehidupan (R2.D8)
-- ============================================================
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, created_by, updated_by)
VALUES (
  '99592975-c1b2-4dcb-986a-38828ba7e004',
  'EXP-KIMIA7-001',
  'c4444444-4444-4444-4444-444444444444',
  'Asam Basa dalam Kehidupan Sehari-hari',
  'exp-kimia7-001-asam-basa-dalam-kehidupan',
  'Dari rasa asam jeruk hingga sabun yang licin: memahami konsep asam dan basa lewat benda-benda di sekitar kita.',
  'id', 5, NULL,
  'f7125028-187e-44e0-b95b-88b69b8d5c9a',
  'f7125028-187e-44e0-b95b-88b69b8d5c9a'
) ON CONFLICT (business_code) DO NOTHING;

INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
(gen_random_uuid(), '99592975-c1b2-4dcb-986a-38828ba7e004', 'HEADING', 1, jsonb_build_object('text', $$Asam dan Basa di Dapurmu$$)),
(gen_random_uuid(), '99592975-c1b2-4dcb-986a-38828ba7e004', 'PARAGRAPH', 2, jsonb_build_object('text', $$Air jeruk nipis terasa asam, sabun cuci terasa licin dan pahit. Keduanya adalah contoh asam dan basa yang kita temui setiap hari. Konsep asam-basa bukan sekadar materi kimia di sekolah — ia menjelaskan mengapa cuka bisa membersihkan kerak, mengapa lambung kita tidak melukai dirinya sendiri, dan mengapa tanah perlu dikapur.$$)),
(gen_random_uuid(), '99592975-c1b2-4dcb-986a-38828ba7e004', 'HEADING', 3, jsonb_build_object('text', $$Apa Itu Asam dan Basa?$$)),
(gen_random_uuid(), '99592975-c1b2-4dcb-986a-38828ba7e004', 'PARAGRAPH', 4, jsonb_build_object('text', $$Secara sederhana, asam adalah zat yang melepaskan ion hidrogen (H+) dalam air, sedangkan basa melepaskan ion hidroksida (OH-). Skala pH dari 0 sampai 14 mengukur keasaman: di bawah 7 berarti asam, 7 berarti netral, di atas 7 berarti basa. Air aki memiliki pH sekitar 1, air murni 7, dan pemutih pakaian sekitar 13.$$)),
(gen_random_uuid(), '99592975-c1b2-4dcb-986a-38828ba7e004', 'HEADING', 5, jsonb_build_object('text', $$Contoh di Sekitar Kita$$)),
(gen_random_uuid(), '99592975-c1b2-4dcb-986a-38828ba7e004', 'LIST', 6, jsonb_build_object('text', $$["Asam: cuka (asam asetat), jeruk (asam sitrat), lambung (asam klorida), hujan asam", "Basa: sabun, pasta gigi, baking soda, kapur pertanian", "Netral: air murni, garam dapur terlarut"]$$)),
(gen_random_uuid(), '99592975-c1b2-4dcb-986a-38828ba7e004', 'HEADING', 7, jsonb_build_object('text', $$Netralisasi: Saat Asam Bertemu Basa$$)),
(gen_random_uuid(), '99592975-c1b2-4dcb-986a-38828ba7e004', 'PARAGRAPH', 8, jsonb_build_object('text', $$Ketika asam dan basa bercampur, keduanya saling menetralkan membentuk garam dan air. Prinsip ini dipakai dalam obat maag (antacid menetralkan asam lambung berlebih) dan dalam pertanian (kapur menetralkan tanah yang terlalu asam agar tanaman tumbuh subur). Reaksi netralisasi adalah salah satu reaksi kimia paling berguna dalam kehidupan.$$)),
(gen_random_uuid(), '99592975-c1b2-4dcb-986a-38828ba7e004', 'HEADING', 9, jsonb_build_object('text', $$Asam Basa di Dalam Tubuh$$)),
(gen_random_uuid(), '99592975-c1b2-4dcb-986a-38828ba7e004', 'PARAGRAPH', 10, jsonb_build_object('text', $$Tubuh manusia menjaga pH darah pada kisaran sempit sekitar 7,4 lewat sistem penyangga (buffer). Lambung sengaja sangat asam (pH 1,5–2) untuk membunuh kuman dan mencerna makanan, dilindungi lapisan lendir. Gangguan keseimbangan asam-basa tubuh adalah kondisi medis serius — itulah mengapa pemahaman konsep ini penting jauh melampaui ruang kelas.$$))
ON CONFLICT (article_id, position) DO NOTHING;

-- ============================================================
-- 5. SCH-SMP-MAT4-001 — Matematika Kelas 8: Persamaan Linear (R3.D15)
-- ============================================================
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, created_by, updated_by)
VALUES (
  'f9e65913-217a-4002-b3f5-2fff53ea8cc8',
  'SCH-SMP-MAT4-001',
  'd4444444-4444-4444-4444-444444444444',
  'Matematika Kelas 8: Persamaan Linear Satu Variabel',
  'sch-smp-mat4-001-matematika-kelas-8-persamaan-linear',
  'Materi PLSV kelas 8: pengertian, cara penyelesaian langkah demi langkah, contoh soal, latihan, dan kunci jawaban.',
  'id', 6, NULL,
  'f7125028-187e-44e0-b95b-88b69b8d5c9a',
  'f7125028-187e-44e0-b95b-88b69b8d5c9a'
) ON CONFLICT (business_code) DO NOTHING;

INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
(gen_random_uuid(), 'f9e65913-217a-4002-b3f5-2fff53ea8cc8', 'HEADING', 1, jsonb_build_object('text', $$Tujuan Pembelajaran$$)),
(gen_random_uuid(), 'f9e65913-217a-4002-b3f5-2fff53ea8cc8', 'PARAGRAPH', 2, jsonb_build_object('text', $$Setelah mempelajari materi ini, kamu diharapkan mampu: (1) menjelaskan pengertian persamaan linear satu variabel (PLSV), (2) menentukan penyelesaian PLSV dengan langkah yang benar, dan (3) menyelesaikan soal cerita yang berkaitan dengan PLSV.$$)),
(gen_random_uuid(), 'f9e65913-217a-4002-b3f5-2fff53ea8cc8', 'HEADING', 3, jsonb_build_object('text', $$Apa Itu PLSV?$$)),
(gen_random_uuid(), 'f9e65913-217a-4002-b3f5-2fff53ea8cc8', 'PARAGRAPH', 4, jsonb_build_object('text', $$Persamaan linear satu variabel adalah kalimat terbuka yang memuat satu variabel berpangkat satu dan dihubungkan tanda sama dengan (=). Contoh: 3x + 5 = 14 adalah PLSV dengan variabel x. Yang bukan PLSV misalnya x^2 + 2 = 6 (pangkat dua) atau 2x + 3y = 10 (dua variabel).$$)),
(gen_random_uuid(), 'f9e65913-217a-4002-b3f5-2fff53ea8cc8', 'HEADING', 5, jsonb_build_object('text', $$Cara Menyelesaikan PLSV$$)),
(gen_random_uuid(), 'f9e65913-217a-4002-b3f5-2fff53ea8cc8', 'LIST', 6, jsonb_build_object('text', $$["Kumpulkan suku yang memuat variabel di satu ruas, konstanta di ruas lain", "Lakukan operasi yang sama pada kedua ruas (tambah, kurang, kali, bagi)", "Sederhanakan hingga variabel berdiri sendiri: x = ...", "Uji jawaban dengan memasukkan nilai x ke persamaan awal"]$$)),
(gen_random_uuid(), 'f9e65913-217a-4002-b3f5-2fff53ea8cc8', 'HEADING', 7, jsonb_build_object('text', $$Contoh Soal$$)),
(gen_random_uuid(), 'f9e65913-217a-4002-b3f5-2fff53ea8cc8', 'PARAGRAPH', 8, jsonb_build_object('text', $$Selesaikan 4x - 7 = 2x + 9. Langkah: kurangi kedua ruas dengan 2x menjadi 2x - 7 = 9. Tambah kedua ruas dengan 7 menjadi 2x = 16. Bagi kedua ruas dengan 2 menjadi x = 8. Uji: ruas kiri 4(8) - 7 = 25, ruas kanan 2(8) + 9 = 25. Terbukti benar.$$)),
(gen_random_uuid(), 'f9e65913-217a-4002-b3f5-2fff53ea8cc8', 'HEADING', 9, jsonb_build_object('text', $$Soal Cerita$$)),
(gen_random_uuid(), 'f9e65913-217a-4002-b3f5-2fff53ea8cc8', 'PARAGRAPH', 10, jsonb_build_object('text', $$Harga 3 buku tulis dan 2 pensil adalah Rp17.000,00. Harga 1 pensil Rp2.000,00. Misalkan harga 1 buku = b, maka 3b + 2(2000) = 17000, sehingga 3b + 4000 = 17000, 3b = 13000, dan b = 4333,33. Karena harga biasanya bulat, soal seperti ini melatihmu menerjemahkan cerita ke model matematika — langkah terpenting dalam pemecahan masalah.$$)),
(gen_random_uuid(), 'f9e65913-217a-4002-b3f5-2fff53ea8cc8', 'HEADING', 11, jsonb_build_object('text', $$Latihan$$)),
(gen_random_uuid(), 'f9e65913-217a-4002-b3f5-2fff53ea8cc8', 'LIST', 12, jsonb_build_object('text', $$["1. Tentukan penyelesaian dari 5x + 3 = 28. (Kunci: x = 5)", "2. Tentukan penyelesaian dari 7 - 2x = 3x + 2. (Kunci: x = 1)", "3. Jumlah dua bilangan berurutan adalah 29. Tentukan kedua bilangan itu. (Kunci: 14 dan 15)"]$$))
ON CONFLICT (article_id, position) DO NOTHING;

-- ============================================================
-- 6. SCH-SD-BIN7-001 — Bahasa Indonesia Kelas 4: Dongeng (R3.D14)
-- ============================================================
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, created_by, updated_by)
VALUES (
  '6f150908-4b02-4596-a253-c26e98ce2798',
  'SCH-SD-BIN7-001',
  'd3333333-3333-3333-3333-333333333333',
  'Bahasa Indonesia Kelas 4: Mengenal Dongeng',
  'sch-sd-bin7-001-bahasa-indonesia-kelas-4-dongeng',
  'Materi dongeng kelas 4 SD: pengertian, jenis-jenis dongeng, unsur cerita, contoh, latihan, dan kunci jawaban.',
  'id', 6, NULL,
  'f7125028-187e-44e0-b95b-88b69b8d5c9a',
  'f7125028-187e-44e0-b95b-88b69b8d5c9a'
) ON CONFLICT (business_code) DO NOTHING;

INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
(gen_random_uuid(), '6f150908-4b02-4596-a253-c26e98ce2798', 'HEADING', 1, jsonb_build_object('text', $$Tujuan Pembelajaran$$)),
(gen_random_uuid(), '6f150908-4b02-4596-a253-c26e98ce2798', 'PARAGRAPH', 2, jsonb_build_object('text', $$Setelah belajar materi ini, kamu bisa: (1) menjelaskan apa itu dongeng, (2) menyebutkan jenis-jenis dongeng, (3) menemukan tokoh dan pesan moral dalam sebuah dongeng, dan (4) menceritakan kembali dongeng dengan bahasamu sendiri.$$)),
(gen_random_uuid(), '6f150908-4b02-4596-a253-c26e98ce2798', 'HEADING', 3, jsonb_build_object('text', $$Apa Itu Dongeng?$$)),
(gen_random_uuid(), '6f150908-4b02-4596-a253-c26e98ce2798', 'PARAGRAPH', 4, jsonb_build_object('text', $$Dongeng adalah cerita khayalan yang diwariskan turun-temurun dari orang tua ke anak. Ceritanya tidak benar-benar terjadi, tetapi mengandung pesan baik untuk kita. Dongeng biasanya dimulai dengan kalimat seperti "Pada zaman dahulu kala..." dan tokohnya bisa manusia, hewan yang bisa berbicara, atau makhluk ajaib.$$)),
(gen_random_uuid(), '6f150908-4b02-4596-a253-c26e98ce2798', 'HEADING', 5, jsonb_build_object('text', $$Jenis-jenis Dongeng$$)),
(gen_random_uuid(), '6f150908-4b02-4596-a253-c26e98ce2798', 'LIST', 6, jsonb_build_object('text', $$["Fabel: dongeng tentang hewan yang berperilaku seperti manusia, contohnya Kancil", "Legenda: dongeng asal-usul suatu tempat atau benda, contohnya Danau Toba", "Mite: dongeng tentang dewa-dewi dan hal gaib", "Sage: dongeng tentang kepahlawanan, contohnya Hang Tuah", "Parabel: dongeng berisi nasihat keagamaan atau moral"]$$)),
(gen_random_uuid(), '6f150908-4b02-4596-a253-c26e98ce2798', 'HEADING', 7, jsonb_build_object('text', $$Unsur dalam Dongeng$$)),
(gen_random_uuid(), '6f150908-4b02-4596-a253-c26e98ce2798', 'PARAGRAPH', 8, jsonb_build_object('text', $$Setiap dongeng memiliki tokoh (siapa yang bercerita), watak tokoh (baik atau jahat), latar (di mana dan kapan cerita terjadi), dan amanat atau pesan moral (pelajaran yang bisa diambil). Saat membaca dongeng, cobalah temukan keempat unsur ini — kamu akan memahami cerita jauh lebih dalam.$$)),
(gen_random_uuid(), '6f150908-4b02-4596-a253-c26e98ce2798', 'HEADING', 9, jsonb_build_object('text', $$Contoh: Si Kancil dan Buaya$$)),
(gen_random_uuid(), '6f150908-4b02-4596-a253-c26e98ce2798', 'PARAGRAPH', 10, jsonb_build_object('text', $$Kancil yang cerdik ingin menyeberangi sungai tetapi takut pada buaya. Ia berkata kepada para buaya, "Raja hutan memerintahkanku menghitung jumlah kalian." Buaya-buaya berbaris, dan Kancil melompat dari satu punggung ke punggung lainnya sambil menghitung, hingga sampai di seberang. Pesan moralnya: kecerdikan bisa mengalahkan kekuatan bila digunakan dengan bijak.$$)),
(gen_random_uuid(), '6f150908-4b02-4596-a253-c26e98ce2798', 'HEADING', 11, jsonb_build_object('text', $$Latihan$$)),
(gen_random_uuid(), '6f150908-4b02-4596-a253-c26e98ce2798', 'LIST', 12, jsonb_build_object('text', $$["1. Sebutkan 3 jenis dongeng beserta contohnya! (Kunci: fabel-Kancil, legenda-Danau Toba, mite-Nyi Roro Kidul, dan sebagainya)", "2. Dongeng tentang hewan yang bisa berbicara disebut .... (Kunci: fabel)", "3. Apa pesan moral dari dongeng Si Kancil dan Buaya? (Kunci: gunakan kecerdikan dengan bijak; jangan mengandalkan kekuatan semata)"]$$))
ON CONFLICT (article_id, position) DO NOTHING;

COMMIT;
