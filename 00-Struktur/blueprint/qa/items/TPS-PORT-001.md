# TPS-PORT-001 — Port Tutorial & Problem Solve dari zip (category cards + timeline)

**Status:** PASS (typecheck + runtime browser)
**Tanggal:** 2026-10-13
**Pemegang lock:** Operator otonom (mandat Owner, KOREKSI-01: port dari zip)

## Ringkasan

Ruang Tutorial & Problem Solve di live memakai menu datar. Versi zip memakai
**category cards** dengan badge "Jalur/Path" vs "Panduan/Guide", badge waktu
baca, dan **timeline** untuk navigasi bertingkat. Zip menang untuk ruang ini.

## File yang di-port

- `src/components/tutorial-problem-foundation.tsx` (dasar zip)
- `src/styles/room-tps-school.css` (byte-identik; berisi `.tps-category-card`,
  `.tps-badge`, `.tps-timeline`, `.tps-guide-card`)
- `src/app/layout.tsx` — tambah import `room-tps-school.css`

## Merge retention live

- `BreadcrumbBar` (live) dipertahankan: import + blok render di posisi awal.

## Fitur zip baru yang sekarang live

1. Kategori = card dengan badge diferensiasi: node dengan child → "Jalur/Path",
   tanpa child → "Panduan/Guide" (membantu user membedakan jalur bertingkat vs
   panduan tunggal).
2. Timeline `.tps-timeline__node` untuk navigasi level demi level.
3. Guide card dengan badge waktu baca (ikon jam + reading_minutes, label
   "mnt/min"), bukan nomor urut datar.
4. Penyaringan kategori `.tutorial-problem__guide-list` tanpa index artifisial.

## Bukti verifikasi

### 1. Typecheck
`tsc --noEmit` → **EXIT=0** (0 error)

### 2. HTTP
`GET /ruang/tutorial-problem-solve` → **HTTP 200** (26.818 byte)

### 3. Browser nyata (setelah compile dev)
- `h1`: "Tutorial & Problem Solve" ✓
- Breadcrumb: "Beranda / Tutorial & Problem Solve" ✓
- Section "PETA TINDAKAN" + "Pilih kebutuhan" ✓
- Peringatan batas aman: "Listrik bertegangan, gas, rem kendaraan, obat, dan
  kondisi berbahaya hanya boleh memiliki panduan yang telah direview serta
  tanda berhenti yang jelas." ✓ (selaras aturan keras #4: verifikasi berlapis)
- Empty state jujur: "FONDASI KATALOG · BELUM TERBIT — Taxonomy lokal belum
  dipublikasikan. Menu ini adalah fondasi yang nyata untuk menyusun jalur,
  bukan daftar panduan yang sudah tersedia." ✓ (tidak mengarang konten)
- `pathCount: 7` item menu fondasi

## Catatan
- `kategoriCards: 0` di query pertama adalah karena katalog taxonomy lokal
  memang belum diterbitkan (data nyata), BUKAN bug render. Komponen merender
  menu fondasi 7 item + empty state yang jujur — perilaku yang diharapkan
  sesuai prinsip "isi konten taksonomi setelah taksonomi rapi".
- Jangan mengarang kategori panduan: isi harus mengikuti publish flow taksonomi
  (rule #4 Prompt-Agent-Madevi).
