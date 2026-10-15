# Item QA: INVITATION-ORDER-001

**Area:** UX/Route — order undangan mandiri  
**Dependency:** `JASA-ROUTE-001`, `JASA-API-001`, `RENCANA-PENGALAMAN-ARTIKEL-UNDANGAN-DAN-RUANG.md`  
**Status awal:** PROSES; final: PASS (statis) setelah audit independen Agent 3; lock dilepas di `Madevi-Control/blueprint/INDEX.md`.

## Masalah dan tujuan

`/jasa/undangan/order` saat ini hanya menampilkan placeholder walau komponen galeri dan order form sudah tersedia. Jadikan halaman order jalur mandiri yang dapat dibuka langsung; gunakan `InvitationGallery` agar template published tetap memakai data server dan contoh lokal tidak dapat dipesan. Bila belum ada template terbit, galeri menyediakan brief custom dengan label jujur. Pertahankan compatibility redirect token lama ke tracking privat.

## Batas modifikasi

- `Madevi_Off/src/app/jasa/undangan/order/page.tsx`
- `Madevi_Off/src/components/jasa/standalone-invitation-order.tsx` (adapter client bahasa untuk route ini)
- `Madevi_Off/src/components/jasa/invitation-gallery.tsx` (prop untuk menonaktifkan form internal saat dipakai di route standalone)
- `Madevi_Off/src/components/jasa/invitation-order-form.tsx` (prefix ID unik antar form)
- `Madevi_Off/tests/unit/invitation-order-page.test.tsx` (baru)
- `Madevi_Off/tests/unit/invitation-order-form.test.tsx` (baru)
- Item QA ini, `Madevi-Control/blueprint/INDEX.md`, dan checkpoint.

Perubahan pada `InvitationGallery` dan `InvitationOrderForm` dibatasi pada opsi tampilan form fallback dan prefix ID field; API, token contract, harga, pembayaran, authentication, DB/data, CSS global, route tracking, Emulator-001 dan UX-REFINE-001 tetap tidak berubah.

## Acceptance criteria wajib

- [x] AC-01 — Kunjungan langsung tanpa token menyajikan halaman pemesanan bermakna dan galeri/form layanan yang ada, bukan placeholder.
- [x] AC-02 — Contoh lokal tetap preview-only/tidak dapat dipesan; jalur brief custom tunggal tersedia saat katalog kosong. Brief custom dan form template published memiliki label/id field unik ketika keduanya tampil.
- [x] AC-03 — Query token lama tetap mengalihkan secara aman ke `/jasa/tracking?token=...` dan halaman order tidak merender `PrivateOrderViewer`.
- [x] AC-04 — Halaman memakai `PublicShell`, judul utama jelas, dan bahasa/isi galeri mengikuti komponen yang ada.
- [x] AC-05 — Tidak ada perubahan API, DB, payment, permission, atau token semantics.

## Acceptance criteria terukur

| ID | Metode | Ambang | Hasil |
|---|---|---:|---|
| M-01 | Unit tes async page normal | halaman menampilkan InvitationGallery dan bukan placeholder | 1/1 PASS — tes route normal lulus, 2026-10-09 |
| M-02 | Unit tes page dengan token | redirect token ter-encode ke tracking | 1/1 PASS — token `a b&c` menuju tracking sebagai `a%20b%26c`, 2026-10-09 |
| M-03 | TypeScript + build + browser GET lokal | exit 0; order page menampilkan katalog/form tanpa melakukan POST | PASS — typecheck/build exit 0; GET localhost menampilkan gallery + brief form, contoh tanpa order button; 375px scrollWidth=clientWidth=375, submit target 44px; tidak submit. |

## Verifikasi

Tes terarah terlebih dahulu (RED-GREEN), typecheck dan build lokal. Browser smoke GET saja; jangan mengirim formulir atau menciptakan order. Tidak membuka server online; gunakan localhost port terpisah dan tutup proses uji yang dibuat.

## Risiko dan pemulihan

Gunakan kembali komponen katalog agar aturan published/example tidak bercabang. Jika build atau route smoke gagal, pulihkan hanya `order/page.tsx` dalam lock ini; jangan menyentuh token tracking.
