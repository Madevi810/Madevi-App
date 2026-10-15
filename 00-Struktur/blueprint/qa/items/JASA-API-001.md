# JASA-API-001 — Route list order Jasa yang hilang

## Scope dan dependency

- **Tujuan pengguna:** panel Owner Jasa menampilkan tiga daftar order (Undangan, Logo, dan
  Order Layanan) dari data nyata, bukan array kosong karena endpoint 404.
- **Batas perubahan:** `src/app/api/v1/admin/jasa/orders/route.ts` (baru),
  `src/components/owner-jasa-panel.tsx` (perbaikan endpoint + error yang jujur).
  **Tidak mengubah** service layer, schema, migration, auth/CSRF, route publik, atau tema.
- **Dependency:** `ROUTE-FIX-001` (PASS) — bug ditemukan saat audit route tersebut.
- **Fakta awal:** panel memanggil `GET /api/v1/admin/jasa/orders?kind=UNDANGAN|LOGO|SERVICE`
  (3 fetch), tetapi route folder `orders` hanya punya `[id]/*`; route list tidak ada.
  `JasaService` sudah punya `listAllInvitationOrders`, `listAllLogoOrders`,
  `listAllServiceOrders` — lapisan service lengkap, hanya route yang hilang. Catatan: panel
  memakai `kind=SERVICE` padahal model order layanan memakai `CUSTOM_DESIGN`/`PCB_LAYOUT`/
  `LAYOUT`; service `listAllServiceOrders` tidak memfilter kind.

## Rancangan

1. Tambah `GET /api/v1/admin/jasa/orders` route baru (atau perbaiki target panel ke endpoint
   yang ada). Route memakai `authenticateAdmin` + `successResponse`/`errorResponse` seperti
   route tetangga; `dynamic = 'force-dynamic'`.
2. Query param `kind` diterima: `UNDANGAN` → `listAllInvitationOrders`, `LOGO` →
   `listAllLogoOrders`, `SERVICE` → `listAllServiceOrders`; kind lain/absen → 400 jelas,
   bukan 200 kosong palsu.
3. Panel: hapus error ditelan — tampilkan state error lokal agar kegagalan terlihat,
   konsisten dengan ADMIN-001-REV1 (state loading/error/empty + retry).

## Acceptance criteria wajib

- [x] AC-01 — Ketiga daftar panel dimuat dari endpoint yang ada (404 hilang).
- [x] AC-02 — `kind` yang tidak dikenal mengembalikan error jelas (400), bukan 200 kosong.
- [x] AC-03 — Tidak ada angka/status/menu palsu; state empty tetap berlabel data 0.
- [x] AC-04 — Autentikasi/otorisasi admin ditegakkan di route baru; tidak membuka data ke
  non-admin.
- [x] AC-05 — Tidak ada schema/migration/route publik/data/fitur palsu yang ditambahkan;
  token tema, auth/session, CSRF tidak berubah.

## Acceptance criteria terukur

| ID | Unit | Metode | Ambang | Hasil |
|---|---:|---|---:|---|
| M-01 | 3 fetch panel | Inspeksi target endpoint | 3/3 ke route yang ada | PASS |
| M-02 | Route baru | Parser TypeScript + grep authenticateAdmin | 0 diagnostic, wajib auth | PASS |
| M-03 | 3 kind | Inspeksi pemetaan kind → service method | 3/3 terpetakan, kind lain 400 | PASS |
| M-04 | Error handling panel | Inspeksi state error tampil | error tidak ditelan | PASS |

## Verifikasi yang diizinkan

- **Statis:** inspeksi source, parser TypeScript, audit endpoint existence, audit auth.
- **Runtime (jika Owner mengizinkan):** request tiga kind dengan session admin; verifikasi
  data dan error kind tidak dikenal.
- **Yang sengaja tidak dijalankan:** npm, lint, build, test, server, database, request API
  atas guardrail Owner.

## Risiko dan rollback

- **Risiko:** `kind=SERVICE` vs `CUSTOM_DESIGN/PCB_LAYOUT/LAYOUT` — pastikan pemetaan kind
  tidak menyaring order layanan secara tidak sengaja; `listAllServiceOrders` tidak memfilter
  kind, jadi seluruh order layanan muncul.
- **Recovery:** hapus route baru dan kembalikan 3 fetch panel; tidak ada data atau migrasi.
