# Rencana Induk: Madevi School (19 Okt 2026)

## Program (≥6, lantai Bagian 10)
1. **PAUD** (4-6 th) → 8 pelajaran: warna, bentuk, angka, huruf, dll
2. **SD** (kelas 1-6) → 8 pelajaran per kelas: MTK, IPA, B.Indo, dll
3. **SMP** (kelas 7-9) → 8 pelajaran per kelas
4. **SMA** (kelas 10-12) → 8 pelajaran per kelas + jurusan
5. **SMK** → 8 pelajaran kejuruan
6. **Kuliah** (semester) → 8 mata kuliah dasar
7. **Sekolah Agama** → 8 pelajaran
8. **Kebutuhan Khusus** → 8 pelajaran adaptif

Tiap pelajaran: materi + latihan + kuis + pelacakan progres.

## Fitur & Kriteria Terukur
### F-S1: Struktur jenjang → kelas → bab (sudah ada dasar)
- **Route**: /school, /school/[jenjang], /school/[jenjang]/[kelas]
- **Kriteria**: 8 program tampil; tiap program daftar kelas; tiap kelas daftar bab; 0 kosong.

### F-S2: Halaman materi bab
- **Route**: /school/[jenjang]/[kelas]/[babId] (BELUM ADA — prioritas)
- **Kriteria**: Materi tampil; latihan interaktif; kuis dengan pembahasan; progres tersimpan.

### F-S3: Ujian + kenaikan kelas (sudah ada service)
- **Kriteria**: Ujian akhir; nilai ≥ KKM → naik kelas; rapor tampil.

### F-S4: Tanya Konsep (sudah ada C3)
- **Kriteria**: Terintegrasi di tiap bab; mode bimbingan saat ujian.

### F-S5: Laporan orang tua (sudah ada service)
- **Kriteria**: Format WA; kirim via tombol.

### F-S6: Rapor + dashboard progres
- **Kriteria**: Grafik progres per topik (merah/kuning/hijau).

## Urutan & Dependensi
1. F-S2 (halaman bab — KRITIS) → 2. Seed 8 program × 8 pelajaran → 3. F-S3 → 4. F-S6

## Simulasi
- Progres, nilai, kenaikan kelas tersimpan di DB (nyata, bukan dummy).
- Tidak ada pembayaran.

## Test
- Content floor check: 8 program, tiap ≥8 pelajaran lengkap.
- Vitest: school.ts (sudah ada).
- Audit: ikuti 1 pelajaran sampai kuis sebagai siswa.
