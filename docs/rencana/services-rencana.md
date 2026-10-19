# Rencana Induk: Madevi Services (19 Okt 2026)

## 12 Jenis Layanan (lantai Bagian 10)
1. **Undangan Digital** (sudah ada: builder, 12 template, RSVP+, kelola tamu)
2. **Desain Logo** (2 tier: HEMAT 25rb, PRO 99rb)
3. **Desain Feed Sosmed** (paket 12/30 desain)
4. **PCB Layout + Cek Aman** (sudah ada cek-aman; tambah jasa layout)
5. **Pengetikan & Dokumen** (per halaman)
6. **Terjemahan** (ID↔EN, per kata)
7. **Edit Video Pendek** (TikTok/Reels)
8. **Pembuatan CV** (ATS-friendly)
9. **Konsultasi Pajak** (simulasi)
10. **Les Privat Online** (simulasi jadwal)
11. **Jasa Artikel SEO** (per artikel)
12. **Desain Kemasan** (label produk)

Tiap layanan: halaman rinci + alur pesan/brief + simulasi pembayaran + status pesanan.

## Fitur & Kriteria Terukur
### F-SV1: Halaman layanan (sudah ada dasar /services)
- **Kriteria**: 12 layanan tampil; tiap ada halaman rinci (deskripsi, tier harga, contoh, FAQ).

### F-SV2: Alur pesan → brief
- **Route**: /services/[id]/pesan
- **Data**: orders (tabel)
- **Kriteria**: Form brief tersimpan; validasi; konfirmasi tampil.

### F-SV3: Simulasi pembayaran (sudah ada simulation-engine)
- **Kriteria**: Status menunggu → berhasil/gagal; jejak tersimpan; label "Simulasi".

### F-SV4: Status pesanan + admin
- **Route**: /services/lacak, /admin/pesanan
- **Kriteria**: Pengguna lihat status; admin lihat semua pesanan (data simulasi realistis).

### F-SV5: Undangan deep-dive (sudah ada — tingkatkan)
- **Kriteria**: Builder 6 langkah penuh (langkah 3-4 sudah placeholder → isi nyata).

## Urutan & Dependensi
1. F-SV1 (12 halaman) → 2. F-SV2 → 3. F-SV3 → 4. F-SV4 → 5. F-SV5

## Simulasi (Bagian 9)
- Pembayaran: simulation-engine (sudah ada).
- OTP: kotak pesan simulasi.
- Email: kotak surat internal.

## Test
- Content floor check: 12 layanan, tiap dengan halaman rinci.
- Vitest: simulation-engine (sudah ada).
- Audit: pesan 1 layanan sampai bayar (simulasi) sebagai pengguna; cek di admin.
