# Audit JASA-ROUTE-001 — Pemisahan form dan tracking pesanan Jasa

- **Item:** JASA-ROUTE-001
- **Tanggal:** 2026-09-28
- **Auditor:** Agent 3 (gpt-6-luna)
- **Metode:** Inspeksi source/inventaris statis dan parser TSX (`@babel/parser`). Tidak menjalankan runtime, server, database, lint, build, atau test runner sesuai guardrail Owner.
- **Hasil awal:** **GAGAL-AUDIT** — AC-01 tidak terpenuhi end-to-end; AC lain 3/3 lulus.
- **Audit ulang:** **PASS secara statis** — compatibility redirect menutup AC-01. Tidak ada bukti runtime.

## Ringkasan

`src/app/jasa/tracking/page.tsx` sudah memuat `PrivateOrderViewer`, membaca `?token=`, mengambil order Undangan/Logo, dan menetapkan `robots: { index: false, follow: false }`. `/jasa/undangan/order` sudah menjadi halaman stub form tanpa viewer token, dan inventaris menyebut kedua tujuan route dengan benar.

Komponen lama masih dapat menghasilkan URL `/jasa/undangan/order?token=...`, tetapi halaman tersebut kini mengalihkan token ke `/jasa/tracking?token=...` dengan encoding aman. Kunjungan tanpa token tetap menjadi form. Ini inspeksi alur source, bukan reproduksi runtime.

Rekomendasi revisi terkecil dalam batas lock: pertahankan `/jasa/undangan/order` sebagai form untuk kunjungan biasa; bila menerima `?token=`, lakukan redirect server ke `/jasa/tracking?token=...`. Dengan begitu tautan lama maupun tautan yang masih dibuat komponen saat ini mencapai route kanonis, dan page form tidak merender `PrivateOrderViewer`. Jangan mengubah komponen pembuat tautan karena keduanya di luar batas lock yang tercatat.

## Acceptance criteria wajib

- [x] **AC-01 — PASS secara statis.** Route tracking memanggil `PrivateOrderViewer` dan meneruskan token. Route form mendeteksi token dan mengalihkan ke `/jasa/tracking?token=...` memakai `encodeURIComponent` (`src/app/jasa/undangan/order/page.tsx:8-20`).
- [x] **AC-02 — PASS.** Halaman `/jasa/undangan/order` berjudul “Pesan Undangan Baru” dan tidak mengimpor, memanggil, atau menginjeksi token ke `PrivateOrderViewer` (`src/app/jasa/undangan/order/page.tsx:1-17`).
- [x] **AC-03 — PASS.** Metadata tracking menetapkan `robots: { index: false, follow: false }` (`src/app/jasa/tracking/page.tsx:12-16`).
- [x] **AC-04 — PASS.** Inventaris mencatat `/jasa/tracking` sebagai pelacakan via token dan `/jasa/undangan/order` sebagai form (`Madevi-Control/blueprint/produk/INVENTARIS-HALAMAN.md:58-59`).

## Acceptance criteria terukur

| ID | Ambang | Hasil |
|---|---|---|
| M-01 | `/jasa/tracking` memanggil `PrivateOrderViewer` | **PASS** — komponen diberi `invitation`, `logo`, `hasToken`, dan `token` (`tracking/page.tsx:50-55`). |
| M-02 | Form tidak memuat viewer/token | **PASS** — halaman order hanya merender shell, judul, dan teks form placeholder (`undangan/order/page.tsx:1-17`). |
| M-03 | Inventaris memuat route tracking | **PASS** — baris `/jasa/tracking` dan `/jasa/undangan/order` ada (`INVENTARIS-HALAMAN.md:58-59`). |

## Bukti dan batas

- Parser TSX `@babel/parser` mem-parse `src/app/jasa/undangan/order/page.tsx` dan `src/app/jasa/tracking/page.tsx`: **2/2 syntax PASS, 0 error parse**.
- Link token lama diperiksa langsung pada kedua pembuat tautan di atas; tidak ada proses aplikasi yang dijalankan.
- Runtime/browser, lint, build, dan test runner: **BELUM-DIVERIFIKASI** atas guardrail Owner. Metrik parser statis tidak membuktikan perilaku runtime.
- Agent 3 tidak mengubah source, lock, maupun status INDEX. Handoff revisi/status menjadi kewenangan Agent 5 dan Agent 4 sesuai workflow.
-
## Audit ulang setelah Owner takeover

- Compatibility redirect berada di `src/app/jasa/undangan/order/page.tsx:8-20`.
- Dengan `token`, route mengalihkan ke `/jasa/tracking?token=...` menggunakan `encodeURIComponent`; tanpa token, form tetap dirender.
- Parser TSX kedua route: **2/2 PASS**.
- AC-01: **PASS secara statis**. AC-02—AC-04 dan M-01—M-03 tetap PASS.
- Runtime/browser, lint, build, dan test runner tetap **BELUM-DIVERIFIKASI** sesuai guardrail.
