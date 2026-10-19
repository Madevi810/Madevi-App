# Riset: Explore & Learn (19 Okt 2026)

## 15+ Sumber Dianalisis

### 1. Wikipedia (wikipedia.org)
**AMATI**: Taksonomi kategori berlapis, portal topik, artikel dengan infobox, pranala antar-artikel, riwayat revisi.
**TIRU**: Hierarki kategori yang dalam tapi bisa dijelajah; breadcrumb jelas.
**MODIFIKASI**: Madevi pakai 6 level tetap (R→D→K→M→T→J), bukan kategori bebas seperti Wikipedia (terlalu liar).
**Keputusan**: ✅ Diadopsi (pola navigasi hierarkis)

### 2. Khan Academy (khanacademy.org)
**AMATI**: Learning path berurutan, latihan + video + artikel terintegrasi, dashboard progres.
**TIRU**: Urutan belajar yang jelas; tiap topik ada "coba latihan".
**MODIFIKASI**: Madevi tidak pakai video (berat); ganti dengan artikel + simulasi interaktif.
**Keputusan**: ✅ Diadopsi (pola learning path)

### 3. Coursera (coursera.org)
**AMATI**: Katalog kursus dengan filter (level, durasi, bahasa), sertifikat, review.
**TIRU**: Filter multi-dimensi; badge penyelesaian.
**MODIFIKASI**: Tanpa sertifikat berbayar (semua simulasi); filter disederhanakan untuk HP.
**Keputusan**: ✅ Diadopsi sebagian (filter katalog)

### 4. Duolingo (duolingo.com)
**AMATI**: Gamifikasi (streak, XP, liga), pelajaran mikro, pengulangan berjarak.
**TIRU**: Streak harian; pelajaran pendek.
**MODIFIKASI**: Tanpa notifikasi mengganggu (aturan #20); streak hanya visual di profil.
**Keputusan**: ✅ Diadopsi sebagian (gamifikasi ringan)

### 5. Brilliant.org
**AMATI**: Belajar lewat soal interaktif, bukan ceramah; visualisasi konsep STEM.
**TIRU**: "Belajar dengan melakukan"; tiap konsep ada interaksi.
**MODIFIKASI**: Dipadukan dengan simulasi PhET-style yang sudah ada.
**Keputusan**: ✅ Diadopsi (pola interactive-first)

### 6. MDN Web Docs (developer.mozilla.org)
**AMATI**: Dokumentasi dengan sidebar navigasi hierarkis, breadcrumb, contoh kode live, "lihat juga".
**TIRU**: Sidebar + breadcrumb + contoh interaktif; bagian "lihat juga".
**MODIFIKASI**: Contoh kode diganti simulasi visual (audiens umum, bukan developer).
**Keputusan**: ✅ Diadopsi (pola navigasi docs)

### 7. Notion Help Center
**AMATI**: Pencarian instan, kategori visual dengan ikon, artikel pendek terstruktur.
**TIRU**: Pencarian dengan hasil instan; kategori berikon.
**MODIFIKASI**: Sudah ada static-search; tingkatkan dengan highlight kata kunci.
**Keputusan**: ✅ Diadopsi (pola help center)

### 8. MasterClass
**AMATI**: Presentasi sinematik, trailer tiap kelas, kualitas produksi tinggi.
**TIRU**: "Trailer" tiap kategori (teks + ilustrasi, bukan video).
**MODIFIKASI**: Tanpa video; pakai ilustrasi SVG prosedural.
**Keputusan**: ⚠️ Ditolak sebagian (video terlalu berat untuk target HP)

### 9. Skillshare
**AMATI**: Proyek siswa, komunitas, kelas pendek kreator.
**TIRU**: "Proyek" di akhir tiap topik (terhubung ke Line karya).
**MODIFIKASI**: Proyek dipublikasikan ke Madevi Line (SOSIAL KARYA).
**Keputusan**: ✅ Diadopsi (pola proyek akhir)

### 10. Zenius (zenius.net)
**AMATI**: Kurikulum Indonesia, video + latihan + pembahasan, zenbot.
**TIRU**: Struktur kurikulum nasional; pembahasan per soal.
**MODIFIKASI**: Konten teks + simulasi (tanpa video); "Tanya Konsep" ganti zenbot.
**Keputusan**: ✅ Diadopsi (pola kurikulum lokal)

### 11. Ruangguru
**AMATI**: Latihan adaptif, tryout, laporan orang tua.
**TIRU**: Laporan orang tua via WA (sudah ada di school.ts).
**MODIFIKASI**: Fokus ke konten, bukan tryout berbayar.
**Keputusan**: ✅ Diadopsi sebagian

### 12. Kok Bisa? (YouTube Indonesia)
**AMATI**: Penjelasan konsep kompleks dengan bahasa sederhana + animasi.
**TIRU**: Gaya bahasa sederhana; analogi sehari-hari.
**MODIFIKASI**: Terapkan di semua artikel (panduan gaya bahasa).
**Keputusan**: ✅ Diadopsi (gaya bahasa)

### 13. TED-Ed
**AMATI**: Pelajaran animasi pendek + kuis + diskusi.
**TIRU**: Kuis singkat di akhir tiap artikel.
**MODIFIKASI**: Tanpa animasi video; kuis teks interaktif.
**Keputusan**: ✅ Diadopsi (pola kuis akhir)

### 14. Stack Overflow Documentation (arsip)
**AMATI**: Contoh + penjelasan berdampingan; voting kualitas.
**TIRU**: Rating "membantu/tidak" per artikel.
**MODIFIKASI**: Sederhana: tombol "artikel ini membantu 👍/👎".
**Keputusan**: ✅ Diadopsi (feedback artikel)

### 15. Quora/Reddit ELI5
**AMATI**: Penjelasan berlapis (sederhana → mendalam); diskusi.
**TIRU**: Mode baca "ringkas/mendalam" (sudah ada di v15: kontrol font/mode baca).
**MODIFIKASI**: Tambah toggle "penjelasan sederhana".
**Keputusan**: ✅ Diadopsi (mode baca berlapis)

### 16. Google Arts & Culture
**AMATI**: Koleksi visual, tur virtual, cerita di balik artefak.
**TIRU**: Galeri ilustrasi per kategori.
**MODIFIKASI**: Ilustrasi SVG prosedural (bukan foto museum).
**Keputusan**: ⚠️ Ditolak (butuh aset foto besar)

## Daftar Ditolak
- MasterClass (video berat), Google Arts & Culture (aset foto besar)

## Fitur Terpilih untuk Explore
1. Navigasi hierarki 6 level + breadcrumb (Wikipedia, MDN)
2. Learning path berurutan (Khan Academy)
3. Filter katalog multi-dimensi (Coursera)
4. Streak harian ringan (Duolingo)
5. Interactive-first: tiap konsep ada simulasi (Brilliant, PhET)
6. Pencarian instan + highlight (Notion)
7. Proyek akhir → publikasi ke Line (Skillshare)
8. Kuis singkat tiap artikel (TED-Ed)
9. Feedback "membantu/tidak" (Stack Overflow)
10. Mode baca ringkas/mendalam (ELI5)
11. Gaya bahasa sederhana Indonesia (Kok Bisa?, Zenius)
