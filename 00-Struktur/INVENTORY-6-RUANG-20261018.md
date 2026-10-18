# Inventory 6 Ruang Madevi (18 Okt 2026)
# Baseline sebelum rebuild dari 0. Setiap item harus di-port atau diberi alasan tertulis bila dibuang.

## Ringkasan hitungan
- Halaman (page.tsx): 60
- API routes: 240
- Components: 102
- Services: 89
- Contracts: 14
- Migrations: 104
- Article seed batches: 119 (+1 batch121 = 120)

## RUANG 1: Tools & Equipment (alat-bantu)
### Pages (2)
- [ ] alat-bantu/page.tsx — indeks tools
- [ ] alat-bantu/emulator/page.tsx — EMULATOR-001 simulasi sirkuit DC
### API (5)
- [ ] /api/v1/tools — list tools
- [ ] /api/v1/tools/[toolId] — detail tool
- [ ] /api/v1/tools/[toolId]/execute — eksekusi tool
- [ ] /api/v1/tools-trial — trial
- [ ] (1 lagi — cek)
### Tools terdaftar (27+ batch1-5 + bawaan)
- [ ] 27 tools batch 1-5 (cicilan, QR, password, BMI, waktu, PPN, PPh, suhu, kata, diskon, umur, zakat maal, zakat fitrah, mata uang, winrate, air, piket, THR, terbilang, haid, acak nama, lembur)
- [ ] Tools bawaan: rumus-*, pdf-*, tukang, tanah, tani, qurban, pranata mangsa, sawah, keluarga, teks, bisnis, ternak
- [ ] EMULATOR-001 (simulasi sirkuit DC, solver MNA)

## RUANG 2: Madevi Services (jasa)
### Pages (4)
- [ ] jasa/page.tsx — katalog jasa
- [ ] jasa/order/page.tsx — order jasa
- [ ] jasa/undangan/order/page.tsx — order undangan
- [ ] jasa/tracking/page.tsx — lacak order
### API (30)
- [ ] /api/v1/jasa/catalog, /api/v1/jasa/order, /api/v1/jasa/my-orders
- [ ] /api/v1/jasa/undangan/*, /api/v1/jasa/logo/*, /api/v1/jasa/custom/*, /api/v1/jasa/pcb/*, /api/v1/jasa/templates/*
### Jenis jasa
- [ ] UNDANGAN (undangan nikah digital: 2 template, form, URL publik, PDF cetak)
- [ ] LOGO/BANNER
- [ ] LAYOUT / CUSTOM_DESIGN
- [ ] PCB_LAYOUT (dengan disclaimer)
- [ ] Payment simulator (pay-simulated)

## RUANG 3: Tutorial & Problem Solve (belajar)
### Pages (2)
- [ ] belajar/page.tsx — indeks learning paths
- [ ] belajar/[pathId]/page.tsx — detail path
### API (6 learning-paths)
- [ ] /api/v1/learning-paths/*
### Format konten: masalah → penjelasan → persiapan → cara → resiko → penyelesaian

## RUANG 4: Explore & Learn (artikel/ruang)
### Pages (3)
- [ ] artikel/[id]/page.tsx — baca artikel
- [ ] ruang/[slug]/page.tsx — ruang taksonomi
- [ ] ruang/[slug]/[...path]/page.tsx — path taksonomi
### API (7 articles)
- [ ] /api/v1/articles/*
### Konten: 120 batch artikel (~710 lokal), taksonomi 7 ruang induk

## RUANG 5: Madevi School (ujian)
### Pages (3)
- [ ] ujian/page.tsx — daftar ujian
- [ ] ujian/[attemptId]/page.tsx — kerjakan ujian
- [ ] brosur-sekolah/page.tsx — brosur
### API (9 exams)
- [ ] /api/v1/exams/*
### Fitur: aturan sekolah, bab, materi, semester, soal latihan, ujian, kenaikan kelas

## RUANG 6: Madevi Line (sosial/grup)
### Pages (2)
- [ ] sosial/page.tsx — sosial karya & curhat
- [ ] grup/page.tsx — komunitas/grup
### API (23 line + 11 groups + 27 social)
- [ ] /api/v1/line/*, /api/v1/groups/*, /api/v1/social/*
### Fitur: SOSIAL KARYA, SOSIAL CURHAT, tambah teman, inbox, kirim file/foto/video, proteksi konten

## Desain system saat ini
- [ ] Kontrak visual: Madevi-Control/kontrak-visual/ (desain v15 FIX)
- [ ] 102 components — perlu audit reuse vs duplikasi
- [ ] Prinsip Ade: reuse element, jangan banyak CSS berbeda; kecil pakai kecil, besar pakai besar

## Catatan rebuild
- Shop DIKECUALIKAN dari rebuild (tetap seperti sekarang)
- 6 ruang di atas dibangun ulang dari 0 dengan karakter berbeda tapi fungsi setara/lebih baik
- Referensi: katsudoto.id (undangan), Autodesk Eagle (PCB), phet.colorado.edu (simulasi edukasi)
