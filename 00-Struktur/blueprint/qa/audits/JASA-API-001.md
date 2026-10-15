# Audit JASA-API-001 — Route list order Jasa yang hilang

- **Item:** JASA-API-001
- **Tanggal:** 2026-09-25
- **Auditor:** Agent 3 (Audit)
- **Metode:** Statis (guardrail Owner melarang runtime/npm/build/test)
- **Hasil:** **PASS** (5/5 AC wajib, 4/4 M)

## Ringkasan

Route list `GET /api/v1/admin/jasa/orders` dibuat (sebelumnya tidak ada, sehingga tiga daftar
panel Owner Jasa diam-diam memuat array kosong). Lapisan service sudah lengkap
(`listAllInvitationOrders`, `listAllLogoOrders`, `listAllServiceOrders`), jadi perubahan hanya
route + penanganan error panel yang jujur.

## Acceptance criteria wajib

- [x] **AC-01 — Ketiga daftar dimuat dari endpoint yang ada.** Route baru
  `src/app/api/v1/admin/jasa/orders/route.ts` melayani `kind=UNDANGAN|LOGO|SERVICE`; ketiga
  fetch `owner-jasa-panel.tsx` menunjuk tepat ke route itu (`jasa/orders?kind=` ×3). **PASS**
- [x] **AC-02 — Kind tidak dikenal mengembalikan error jelas.** `ApiError('VALIDATION_FAILED',
  …, { kind: 'UNDANGAN | LOGO | SERVICE' })` → HTTP 400 via `errorResponse` (map
  `VALIDATION_FAILED: 400`). Bukan 200 kosong palsu. **PASS**
- [x] **AC-03 — Tidak ada angka/status/menu palsu.** Empty state yang ada memakai data nyata:
  `null` → "Memuat…", `length === 0` → "Belum ada order…". Tidak ada angka atau status baru
  yang ditambahkan. **PASS**
- [x] **AC-04 — Autentikasi admin ditegakkan.** `authenticateAdmin(request, { humanActivity:
  true })` dipanggil sebelum query param dibaca; `force-dynamic`; tidak ada data yang dibuka
  ke non-admin. **PASS**
- [x] **AC-05 — Tidak ada schema/migration/route publik palsu.** Tidak ada migration, tabel,
  route publik, atau token tema yang diubah. Service layer, auth/CSRF, dan kontrak lain utuh.
  **PASS**

## Acceptance criteria terukur

| ID | Ambang | Hasil |
|---|---|---|
| M-01 | 3/3 fetch ke route yang ada | 3× `jasa/orders?kind=` ke route baru — **PASS** |
| M-02 | Parser 0 diagnostic + wajib auth | 0 error di route.ts, panel, layout; `authenticateAdmin` ada — **PASS** |
| M-03 | 3 kind terpetakan, kind lain 400 | UNDANGAN→listAllInvitationOrders, LOGO→listAllLogoOrders, SERVICE→listAllServiceOrders; `KNOWN_KINDS` + `ApiError` — **PASS** |
| M-04 | Error tidak ditelan | `ordersLoadError` (3 pesan bilingual) + `role="alert"` di UI; `!r.ok || !Array.isArray(j.data)` melempar — **PASS** |

## Catatan

1. Catatan desain: `kind=SERVICE` di route diterima sebagai satu daftar layanan; model data
   order layanan memakai `CUSTOM_DESIGN`/`PCB_LAYOUT`/`LAYOUT`, tetapi
   `listAllServiceOrders` tidak memfilter kind, jadi seluruh order layanan muncul — tidak
   ada order yang tersaring secara tidak sengaja.
2. Runtime tetap `BELUM-DIVERIFIKASI` (guardrail). Audit ini klaim statis: route existence,
   parser, auth, dan mapping kind. Verifikasi data nyata memerlukan izin proses Owner.
3. Tidak ada temuan critical/high. Tidak ada revisi yang diperlukan.
