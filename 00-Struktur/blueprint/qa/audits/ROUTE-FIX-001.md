# Audit ROUTE-FIX-001 — Route /admin buntu, paket taxonomy, assertion kontrak desain

- **Item:** ROUTE-FIX-001
- **Tanggal:** 2026-09-25
- **Auditor:** Agent 3 (Audit)
- **Metode:** Statis (guardrail) + bukti runtime pra-guardril yang dicatat jujur di
  `memory/TEST-REPORT.md`
- **Hasil:** **PASS** (5/5 AC wajib, 5/5 M) — dengan satu temuan tambahan yang diperbaiki
  saat audit (reviu `admin-shell.tsx`) dan satu item baru yang dipromosikan ke INDEX.

## Ringkasan temuan

Route `/admin` buntu diperbaiki: alias pengalihan ke `/owner` kanonis, 7 href capability
dialihkan, path paket taxonomy kanonis dipakai test/script, dan 5 assertion kontrak desain
diperbarui ke nilai pasca-UX-REDESIGN-001.

## Temuan tambahan saat audit (diperbaiki + didaftarkan)

1. **`src/app/admin/layout.tsx` masih merender `AdminShell`** meskipun komentarnya menyatakan
   tidak. Karena `next.config.ts` mengalihkan `/admin/*`, shell itu secara teori dapat tampil
   untuk request yang lolos redirect dan memperlihatkan menu `/admin/*` yang 404.
   **Diperbaiki:** layout kembali merender `children` saja; import `AdminShell` dihapus.
   Parser TS 0 error.
2. **`owner-jasa-panel.tsx` memanggil `GET /api/v1/admin/jasa/orders?kind=…`** untuk tiga
   daftar (UNDANGAN/LOGO/SERVICE), tetapi route list tersebut **tidak ada** — hanya
   `/jasa/queue` dan `/jasa/orders/[id]/*`. Daftar diam-diam gagal (error ditelan → array
   kosong). **Dipromosikan ke INDEX 8.3 `JASA-API-001`** (BELUM, dependensi ROUTE-FIX-001)
   karena ini bug produk asli, bukan kesalahan verifikasi route.

## Acceptance criteria wajib

- [x] **AC-01 — Tidak ada href/menu internal ke route yang tidak ada.** 7 href capability
  `AdminService.getCapabilities()` kini `/owner/*` (5 href antrean prioritas sudah `/owner/*`
  sebelumnya). Catatan: `admin-shell.tsx` masih berisi menu `/admin/*` lama, tetapi shell itu
  **tidak lagi dirender** oleh layout mana pun (temuan #1 diperbaiki saat audit), dan redirect
  `next.config.ts` menangani semua `/admin/*`. API `/api/v1/admin/*` adalah route server yang
  valid (14 route ditemukan). **PASS**
- [x] **AC-02 — Deep link lama pulih.** `next.config.ts`: `/admin` → `/owner`,
  `/admin/:path*` → `/owner/:path*` (`permanent: false`). Curl smoke pra-guardril: 307 → 200
  untuk `/admin`, `/admin/operasi`, `/admin/pengguna`; route tak dikenal → 404. **PASS**
- [x] **AC-03 — Path paket taxonomy kanonis.** Test membaca
  `content-local/packages/taxonomy/madevi-explore-pilot-v1.json` (16 node, byte-identik);
  script hint dikomentari; tidak ada dependensi folder `Menu/` luar. **PASS**
- [x] **AC-04 — Assertion kontrak desain diperbarui, bukan dihapus (MASTER §4).** F03-04
  (tema `madevi-on`), F03-07 (`--content-width`/`--content-gap` baru), F03-10 (popup AI
  "Sumber lokal"), F03-11 (tagline footer) diperbarui ke nilai source aktual; verifikasi grep
  ke source cocok. **PASS**
- [x] **AC-05 — Tidak ada perubahan palsu.** Tidak ada route/API/data/fitur/tombol/angka baru;
  auth/session, CSRF, migration, token Light/Dark/Madevi On tidak berubah. **PASS**

## Acceptance criteria terukur

| ID | Ambang | Hasil |
|---|---|---|
| M-01 | Parser 8 file 0 diagnostic | `tsc --noEmit` EXIT 0 (pra-guardril) + `transpileModule` 0 diagnostic — **PASS** |
| M-02 | 5 deep link 307 → 200 | curl smoke 307→200 untuk `/admin`, `/admin/operasi`, `/admin/pengguna` — **PASS** |
| M-03 | 5 assertion cocok source | grep verifikasi semua cocok — **PASS** |
| M-04 | `prompt-l07` 6/6 | 6/6 PASS setelah DB dinyalakan ulang (pra-guardril, lokal non-produksi) — **PASS** |
| M-05 | Sisa link `/admin` hanya penanda/redirect | `admin-shell.tsx` tidak dirender; sisa `/api/v1/admin/*` adalah route server valid — **PASS** |

## Catatan

1. Bukti runtime di TEST-REPORT dijalankan sebelum guardrail Owner diketahui; dicatat jujur
   dan tidak diulang. Setelah guardrail, semua verifikasi statis.
2. Temuan #2 (`JASA-API-001`) adalah bug produk nyata yang ditemukan audit ini; tidak
   disembunyikan, dipromosikan ke INDEX 8.3 dengan dependensi yang jelas.
3. Runtime penuh + visual audit tetap `BELUM-DIVERIFIKASI` atas guardrail Owner.
