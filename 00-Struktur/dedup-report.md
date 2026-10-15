# Laporan Dedup Artikel Madevi

Tanggal: 13 Okt 2026. Total artikel dipindai: 710.

## Ringkasan

- Kelompok duplikat ditemukan: 34
- Artikel diarsipkan: 35 (status ARCHIVED, tidak dihapus)
- Kanonis dipertahankan: 34 (tetap DRAFT)
- Status akhir: 665 DRAFT, 35 ARCHIVED, 10 PUBLISHED
- Verifikasi pasca-arsip: 0 duplikat eksak + 0 pasangan fuzzy (>=0.85) tersisa di DRAFT/PUBLISHED

## Metode

1. Normalisasi judul (lowercase, hapus diakritik/stopword, pertahankan angka kelas) lalu cocokkan himpunan token eksak.
2. Fuzzy Jaccard >= 0.75 untuk menangkap varian redaksi (mis. 'Gudeg Jogja' vs 'Gudeg: Resep Khas Jogja').
3. Isi block (HEADING) dibandingkan manual untuk pasangan meragukan; pasangan beda kelas (mis. Puisi Kelas 3 vs Kelas 4) atau fokus berbeda (Bangun Ruang vs Volume) TIDAK diarsipkan.
4. Kanonis = block terbanyak, tiebreak = konten terpanjang; 1 override manual: SCH-SMP-IPA2-001 (Statis+Dinamis, superset) dipilih atas SCH-SMP-BIO6-001 (Dinamis saja).
5. Artikel duplikat: status -> ARCHIVED, summary ditambah 'Duplikat dari [kode kanonis]'.

## Keputusan per kelompok

| # | Diarsipkan | Kanonis | Judul |
|---|------------|---------|-------|
| 1 | EXP-BIOLOGI2-001 | EXP-BIOLOGI7-001 | Sel: Unit Terkecil Kehidupan |
| 2 | EXP-KIMIA2-001 | EXP-KIMIA7-001 | Asam Basa: pH dalam Kehidupan Sehari-hari |
| 3 | EXP-TEKNOLOGI5-001 | EXP-TEKNOLOGI12-001 | Komputasi Kuantum: Masa Depan Komputer |
| 4 | SCH-SD-BIN4-001 | SCH-SD-BIN21-001 | Bahasa Indonesia Kelas 6: Berpidato dengan Percaya Diri |
| 5 | SCH-SD-IPS32-001 | SCH-SD-IPS14-001 | IPS Kelas 5: Mengenal Kenampakan Alam |
| 6 | SCH-SD-IPS7-001 | SCH-SD-IPS34-001 | IPS Kelas 1: Diri Sendiri |
| 7 | SCH-SD-MAT16-001 | SCH-SD-MAT28-001 | Matematika Kelas 6: Lingkaran |
| 8 | SCH-SMA-SOS7-001 | SCH-SMA-SOS-001 | Sosiologi Kelas 10: Interaksi Sosial |
| 9 | SCH-SMP-BIO13-001 | SCH-SMP-IPA4-001 | IPA Kelas 7: Klasifikasi Makhluk Hidup |
| 10 | SCH-SMP-ING8-001 | SCH-SMP-ING17-001 | Bahasa Inggris Kelas 9: Narrative Text |
| 11 | SCH-SMP-MAT7-001 | SCH-SMP-MAT-001 | Matematika Kelas 8: Teorema Pythagoras |
| 12 | SCH-SMP-MAT11-001 | SCH-SMP-MAT2-001 | Matematika Kelas 9: Bangun Ruang Sisi Lengkung |
| 13 | SCH-SMP-MAT15-001 | SCH-SMP-MAT3-001 | Matematika Kelas 7: Himpunan |
| 14 | SCH-SMP-MAT17-001 | SCH-SMP-MAT8-001 | Matematika Kelas 9: Peluang |
| 15 | SCH-SMP-SEJ13-001 | SCH-SMP-SEJ-001 | IPS Kelas 8: Perang Dunia I dan II |
| 16 | TUT-BAHASA26-001 | TUT-BAHASA17-001 | Bahasa Vietnam: Sapaan Dasar untuk Percakapan Pertama |
| 17 | TUT-BAHASA18-001 | TUT-BAHASA25-001 | Bahasa Thailand: Sapaan Dasar untuk Percakapan Pertama |
| 18 | TUT-KESEHATAN32-001 | TUT-KESEHATAN56-001 | Kulit Gatal: Penyebab Umum dan Cara Mengatasinya |
| 19 | EXP-ANTROPOLOGI5-001 | EXP-ANTROPOLOGI26-001 | Suku Toraja: Ritual Rambu Solo dan Filosofi Kematian |
| 20 | EXP-ANTROPOLOGI15-001 | EXP-ANTROPOLOGI26-001 | Suku Toraja: Rambu Solo dan Filosofi Kematian |
| 21 | SCH-SMA-BIO8-001 | SCH-SMA-BIO2-001 | Biologi Kelas 12: Genetika dan Pewarisan Sifat |
| 22 | SCH-SMP-BIO3-001 | SCH-SMP-BIO9-001 | IPA Kelas 9: Pewarisan Sifat Makhluk Hidup |
| 23 | TUT-INTERNET-001 | TUT-INTERNET2-001 | WiFi Lemot: Diagnosis dan Solusi Lengkap |
| 24 | TUT-KESEHATAN55-001 | TUT-KESEHATAN33-001 | Mata Merah: Penyebab Umum dan Penanganan di Rumah |
| 25 | TUT-MASAK33-001 | TUT-MASAK15-001 | Gudeg: Resep Khas Jogja yang Manis Gurih |
| 26 | EXP-KIMIA46-001 | EXP-KIMIA20-001 | Aluminium: Logam Ringan Serbaguna |
| 27 | EXP-KIMIA53-001 | EXP-KIMIA22-001 | Emas: Logam Mulia yang Tidak Berkarat |
| 28 | EXP-KIMIA47-001 | EXP-KIMIA26-001 | Natrium: Logam Lunak yang Reaktif |
| 29 | SCH-SD-BIN2-001 | SCH-SD-BIN11-001 | Bahasa Indonesia Kelas 2: Kalimat Sederhana |
| 30 | SCH-SD-IPS11-001 | SCH-SD-IPS30-001 | IPS Kelas 3: Pekerjaan |
| 31 | SCH-SD-MAT9-001 | SCH-SD-MAT3-001 | Matematika Kelas 4: Pecahan |
| 32 | SCH-SD-SENI-001 | SCH-SD-SENI4-001 | Seni Budaya Kelas 3: Menggambar Bentuk Dasar |
| 33 | SCH-SMP-MAT12-001 | SCH-SMP-001 | Matematika Kelas 7: Aljabar |
| 34 | SCH-SMP-BIO6-001 | SCH-SMP-IPA2-001 | IPA Kelas 9: Listrik Dinamis |
| 35 | SCH-SMP-IPA-001 | SCH-SMP-IPA3-001 | IPA Kelas 8: Sistem Pencernaan Manusia |

## Tidak diarsipkan (sengaja dipertahankan)

- SCH-SD-BIN12-001 vs SCH-SD-BIN19-001 (Puisi Kelas 3 vs Kelas 4 — beda kelas)
- SCH-SD-BIN14-001 (Kelas 5 Pidato) vs SCH-SD-BIN21-001/SCH-SD-BIN4-001 (Kelas 6 Pidato — beda kelas)
- SCH-SD-IPS9-001 (Kelas 5 Hindu-Buddha) vs SCH-SMP-SEJ12-001 (Kelas 7 Hindu-Buddha — beda kelas)
- SCH-SD-MAT15-001 (Kelas 5 Bangun Ruang umum) vs SCH-SD-MAT21-001 (Kelas 5 Volume — fokus berbeda)
- SCH-SD-MAT18-001 (Kelas 2 Pengurangan) vs SCH-SD-MAT6-001 (Kelas 2 Pengurangan Bersusun — teknik berbeda)
- TUT-KESEHATAN34-001 (Tangan Kesemutan) vs TUT-KESEHATAN48-001 (Jari Tangan Kesemutan — cakupan berbeda)
- EXP-MATEMATIKA-001 (Explore: Aljabar sebagai bahasa simbol) vs artikel School Aljabar Kelas 7 (ruang berbeda)

## Catatan

- 3 slug duplikat sempat ditemukan dan diperbaiki terpisah sebelum dedup (batch 106/108/110/115).
- Audit fakta/sumber isi artikel belum dilakukan — dedup ini hanya soal topik ganda, bukan kebenaran konten.
- Rekomendasi lanjutan: sebelum publikasi massal, audit fakta per artikel kanonis + perbaiki taksonomi (artikel antropologi/bahasa masih menempel di node induk terdekat).
