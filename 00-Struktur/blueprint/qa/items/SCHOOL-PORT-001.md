# SCHOOL-PORT-001 — Port dashboard jenjang Madevi School dari zip

**Status:** PASS (typecheck bersih, per INSTRUKSI-02: verifikasi statis saja)
**Tanggal:** 2026-10-13
**Pemegang lock:** Operator otonom (mandat Owner, KOREKSI-01: port dari zip)

## Ringkasan

Madevi School (R1 Pendidikan Navigator) di live hanya menampilkan navigasi
jenjang dasar. Versi zip menambahkan **dashboard jenjang** — gambaran sekolah
sekilas dengan kartu per jenjang + pintasan langsung ke jalur pembelajaran —
serta redesign visual unit card & class card. Zip menang untuk ruang ini.

## File yang di-port

- `src/components/r1-navigator.tsx` (byte-identik dengan zip, 1277 baris)

Tidak ada merge tambahan: `BreadcrumbBar` tidak ada di kedua versi (PublicShell
yang menyediakan navigasi global), jadi port langsung aman.

## Fitur zip baru yang sekarang live

1. **Dashboard jenjang** (`tps-jenjang-dashboard`, tampil saat `!mode`):
   - Grid 7 kartu: PAUD, SD, SMP, SMA, Perguruan Tinggi, Spesialis, Nonformal
     (`[...JENJANG_LIST, NONFORMAL]`).
   - Ikon SVG unik per jenjang (`JenjangIcon`): bayi/anak (paud), buku (dasar),
     topi wisuda (menengah-atas), gedung kampus (tinggi), jam+pita (spesialis),
     kotak centang (default).
   - Meta: `N unit · N kelas` (akumulasi `u.classes.length`).
   - Pintasan `quickJenjang(j)`: langsung set mode PEMBELAJARAN + jenjang aktif
     — state sama seperti alur kapsul → popup manual.
2. **Unit card redesign** (`tps-unit-card`):
   - Badge jenjang `.tps-badge--jenjang` di bagian atas.
   - Count kelas (`classCount > 0` baru ditampilkan — hemat ruang).
   - Chevron SVG (menggantikan teks ▾/▸), state `--open` saat terbuka.
3. **Class card redesign** (`tps-class-card`):
   - Nomor urut `String(kelasIndex + 1).padStart(2, '0')` (sebelumnya tanpa nomor).
   - Label kelas `<strong>` + badge unit.
   - **Progress bar ARIA** `.tps-progress` `role="img"` dengan
     `aria-label="Progres belajar: belum dimulai"` — aksesibilitas progres.

## Bukti verifikasi (statis, per INSTRUKSI-02)

### 1. Typecheck
`tsc --noEmit` → **EXIT=0** (0 error)

### 2. Analisis diff (baca kode)
- Zip adalah **superset murni**: semua baris `<` (hanya di zip) adalah kode baru;
  tidak ada blok live yang hilang selain yang digantikan versi zip
  (chevron teks → SVG, card datar → card ber-badge/progress).
- CSS pendukung `.tps-jenjang-card`, `.tps-jenjang-dashboard`, `.tps-unit-card`,
  `.tps-class-card`, `.tps-progress` — 15 match di `room-tps-school.css`
  yang **sudah di-port pada TPS-PORT-001** sesi ini. Tidak ada CSS tambahan.
- Route `/ruang/pendidikan-sekolah` (yang merender `R1PendidikanNavigator`)
  — `src/app/ruang/[slug]/page.tsx` baris 40: `rootBase === 'pendidikan-sekolah'`
  → `<R1PendidikanNavigator fullSlug={slug} />`. Tidak berubah.
- `belajar/`, `ujian/`, `brosur-sekolah/`, `software/` — `diff -rq` zip vs live
  = SAME (tidak ada perbedaan).

## Catatan
- Per INSTRUKSI-02, tidak ada verifikasi browser. Dashboard jenjang & ikon SVG
  **butuh verifikasi runtime oleh Muse** — terutama:
  - tampilan awal dashboard (mode null) dan transisi `quickJenjang`.
  - progress bar render benar saat data kelas nyata.
- Urutan jenjang mengikuti JENJANG_LIST zip: PAUD → SD → SMP → SMA → PT,
  lalu Nonformal — sesuai visi Owner (jenjang PAUD→Perguruan Tinggi, sekolah
  kebutuhan khusus & agama, SMK/Diploma kejuruan).
