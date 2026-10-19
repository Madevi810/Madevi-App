# Rencana Induk: Madevi Line (19 Okt 2026)

## Konten (lantai Bagian 10)
- **30 profil fiktif**: nama Indonesia beragam, avatar SVG prosedural, bio. TIDAK meniru orang nyata.
- **50 kiriman**: 25 karya + 25 curhat (campuran).
- **100 komentar**: tersebar di kiriman.
- **20 percakapan**: inbox antar profil.
- **Notifikasi**: suka, komentar, mention.

## Fitur & Kriteria Terukur
### F-L1: Feed (sudah ada dasar)
- **Route**: /line (sudah ada)
- **Kriteria**: Feed tampil 50 kiriman; filter karya/curhat; suka tersimpan.

### F-L2: Profil
- **Route**: /line/u/[id]
- **Data**: profiles (tabel)
- **Kriteria**: 30 profil tampil; tiap profil ada kiriman, bio, level reputasi.

### F-L3: Kirim posting (dengan gerbang)
- **Kriteria**: Login (simulasi) → setuju 7 aturan → akun ≥24 jam → bisa posting. Validasi + pra-moderasi.

### F-L4: Komentar + notifikasi
- **Kriteria**: Komentar tersimpan; notifikasi masuk ke kotak pengguna.

### F-L5: Grup/komunitas
- **Route**: /line/grup/[id]
- **Kriteria**: 5 grup; tiap grup ada anggota + kiriman.

### F-L6: Inbox
- **Route**: /line/pesan
- **Kriteria**: 20 percakapan; kirim pesan tersimpan.

### F-L7: 5 fitur komunitas (sudah ada di service)
- **Kriteria**: Ritual, reputasi, gerbang, sanksi, karya pilihan — terintegrasi di UI (sebagian sudah).

## Urutan & Dependensi
1. Seed 30 profil + 50 kiriman + 100 komentar → 2. F-L2 → 3. F-L3 → 4. F-L4 → 5. F-L5 → 6. F-L6

## Simulasi & Keamanan
- Semua profil fiktif, label jelas.
- Pra-moderasi: deteksi krisis → hotline 119 ext 8.
- Tangga sanksi berlaku.

## Test
- Content floor check: 30 profil, 50 kiriman, 100 komentar, 20 percakapan.
- Vitest: line.ts (sudah ada).
- Audit: posting, komentar, kirim pesan sebagai pengguna; cek moderasi.
