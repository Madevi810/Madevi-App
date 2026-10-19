# Rencana Induk: Tutorial & Problem Solve (19 Okt 2026)

## Taxonomy & Hierarki
10 kategori masalah (dari riset):

1. **Perbaikan Rumah** → Listrik, Air, Furniture
2. **Gadget & Komputer** → HP, Laptop, Internet
3. **Kendaraan** → Motor, Mobil, Sepeda
4. **Kesehatan** → P3K, Pola Hidup, Mental
5. **Keuangan** → Darurat, Utang, Menabung
6. **Masakan** → Dasar, Hemat, Acara
7. **Berkebun** → Tanaman, Hama, Panen
8. **Pekerjaan** → Lamaran, Produktivitas, Konflik
9. **Belajar** → Ujian, Bahasa, Skripsi
10. **Darurat** → Bencana, Kecelakaan, Kehilangan

Total: **60 tutorial** (lantai Bagian 10), 6 per kategori.

## Format Baku (wajib tiap tutorial)
1. Intisari 30-detik
2. Masalah → Penjelasan → Persiapan (alat/bahan) → Cara (langkah bernomor)
3. Risiko + "hentikan jika..." + "kapan panggil profesional"
4. Penyelesaian (wajib ada — aturan #11)
5. Tabel "bila bermasalah": gejala → penyebab → solusi
6. Estimasi waktu + tingkat kesulitan
7. Diagram SVG bila perlu

## Daftar Item & Target
| Item | Target | Status |
|---|---|---|
| Tutorial berlangkah | 60 | 1 (contoh bohlam) |
| Diagram SVG | 20 | 0 |

## Fitur & Kriteria Terukur
### F-T1: Daftar tutorial per kategori
- **Route**: /tutorial, /tutorial/[kategori] (sudah ada)
- **Kriteria**: 10 kategori tampil; tiap kategori daftar 6 tutorial; 0 kosong.

### F-T2: Halaman baca tutorial
- **Route**: /tutorial/[kategori]/[slug] (sudah ada TutorialView)
- **Kriteria**: Format baku tampil lengkap; checklist progres tersimpan; penyelesaian tersembunyi sampai diklik.

### F-T3: Pencarian masalah
- **API**: static-search (sudah ada) + DB
- **Kriteria**: Ketik gejala → tutorial relevan tampil.

### F-T4: "Bila bermasalah" interaktif
- **Kriteria**: Pilih gejala → penyebab + solusi tampil.

## Urutan & Dependensi
1. F-T1 → 2. F-T2 → 3. Tulis 60 tutorial (konten) → 4. F-T3 → 5. F-T4

## Test
- Content floor check: 60 tutorial, tiap dengan penyelesaian.
- Validasi: validasiTutorial() wajib lulus semua.
- Audit: ikuti 1 tutorial sampai selesai sebagai pengguna.
