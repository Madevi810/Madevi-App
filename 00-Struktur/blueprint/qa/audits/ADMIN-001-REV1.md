# Laporan Audit: ADMIN-001-REV1 (Revisi state operasi dan navigasi dashboard Admin)

**Tanggal Audit:** 2026-09-25
**Auditor:** Agent 3 (peran, dijalankan sesuai `blueprint/CONTROL-PLANE.md`)
**Item:** ADMIN-001-REV1 — revisi pasca-audit `ADMIN-001`
**Metode verifikasi:** Statis (inspeksi source + parser TypeScript `transpileModule` + pencarian `href`/target elemen)
**Status Akhir:** `PASS` (dengan batasan verifikasi statis sesuai guardrail Owner)

## Ringkasan temuan

Implementasi dalam batas file lock (`owner-console.tsx`, `owner-shell.tsx`, `src/services/admin.ts`)
memenuhi kelima acceptance criteria wajib secara statis. Pemisahan kegagalan layanan dari
sesi/otorisasi dibuktikan pada rantai kontrak server dan handler klien; fragmen navigasi tanpa
target elemen sudah dihilangkan kecuali satu fragmen yang targetnya terbukti ada pada route
tujuan. Tidak ada perubahan pada API route, auth/session, migration, data pengguna, atau token/CSS
tema (AC-05).

## Bukti kontrak server (AC-01/AC-02)

Rantai `GET /api/v1/owner/operasi` → `authenticateRequest(request, 'OWNER')` → `errorResponse`:

- `src/app/api/v1/owner/operasi/route.ts:10` memanggil `authenticateRequest(request, 'OWNER', …)`
  sebelum pool/service disentuh; kegagalan dilempar sebelum query DB.
- `src/auth/http.ts:78` — tanpa token → `ApiError('AUTHENTICATION_REQUIRED', …)`.
- `src/auth/http.ts:60/72/82` — audience tak dikenal, sesi ambigu, atau role bukan OWNER →
  `ApiError('ACCESS_DENIED', …)`.
- `src/api/errors.ts:20-21` — `AUTHENTICATION_REQUIRED: 401`, `ACCESS_DENIED: 403`.
- `src/api/response.ts:44-57` — body error selalu `{ error: { code, message, … }, requestId }`
  dengan `status: apiError.status`; kegagalan dependency (ECONNREFUSED/ETIMEDOUT/ECONNRESET/
  ENOTFOUND) dipetakan ke `DEPENDENCY_UNAVAILABLE` (bukan 401/403), error lain ke
  `INTERNAL_ERROR`. Ini membuktikan kategori HTTP bisa dipercaya di klien.

## Bukti handler klien (`owner-console.tsx`)

- L221-228: `response.status === 401` → `state='unauthenticated'`; `=== 403` → `state='forbidden'`.
  Dua state ini dirender sebagai gate akses (L282-296) dengan tautan `/owner/login` — bukan
  diklasifikasikan sebagai kegagalan layanan.
- L230-243: JSON yang tidak terbaca → `throw` pesan "Respons layanan tidak dapat dibaca";
  `!response.ok` (non-401/403) → memakai `getResponseErrorMessage(body)` fallback
  `Operasi belum dapat dimuat (HTTP <status>)`; `!isDashboardData(body.data)` → pesan
  "Respons ringkasan operasi tidak lengkap".
- L247-255: catch menangkap network failure (fetch reject) maupun throw di atas → `state='error'`
  + `setError(pesan)` + tombol "Coba lagi" (L308-310) yang menaikkan `reloadVersion`.
- L304-312: state error dibungkus `role="alert"` + `aria-labelledby` (diumumkan ke screen reader).

## Acceptance criteria wajib

| ID | Kriteria | Status | Bukti |
|---|---|---|---|
| AC-01 | Hanya HTTP 401/403 yang membuka state autentikasi/otorisasi; pesan tepat | **PASS** | `owner-console.tsx:221-228` memilih state dari `response.status` saja; error gate L282-296 membedakan "Sesi Admin tidak dapat diverifikasi" vs "Akses Admin tidak diizinkan" |
| AC-02 | Error jaringan/JSON tak terbaca/non-ok menghasilkan state error jujur, terumumkan, dapat dicoba ulang | **PASS** | L230-255 (4 jalur: JSON parse, non-ok, data tak valid, network) → `role="alert"` + tombol Coba lagi L308; kontrak server membuktikan error non-akses tidak menyamar 401/403 |
| AC-03 | Ringkasan hanya dirender ketika bentuk data minimum valid | **PASS** | `isDashboardData` (L187-197) memvalidasi `stats.users:number`, `stats.newMessages:number`, `alerts:array`, dan tiap queue item via `isQueueItem`; render gated `state === 'ready' && dashboard` (L313) |
| AC-04 | Menu tidak memuat hash/fragmen tanpa target elemen | **PASS** | 15 dari 16 `href` menu adalah route murni tanpa fragmen; satu-satunya fragmen `/owner#pending` targetnya ada: `id="pending"` pada `<section>` antrean prioritas (L144) di route `/owner`. Target dibuktikan ada, bukan dangling |
| AC-05 | Kontrak route, CSRF/logout, autentikasi, dan token tema tidak berubah | **PASS** | `owner-shell.tsx` hanya menghapus fragmen dari item menu (`aria-current` kini `href.split('#')[0]`); logout CSRF cookie tetap (`owner-console.tsx:86`, `owner-shell.tsx:160-167`); `services/admin.ts` tidak diubah kontraknya; tak ada sentuhan CSS/tema/migration |

## Acceptance criteria terukur

| ID | Unit | Metode | Ambang | Hasil |
|---|---:|---|---:|---|
| M-01 | 4 jalur gagal (401/403, HTTP lain, JSON, jaringan) | Inspeksi handler `loadDashboard` | 0 jalur salah menjadi sesi tidak sah | **4/4 PASS** |
| M-02 | `href` pada `OWNER_MENU` (console) + `OWNER_MENU` (shell) + 5 antrean prioritas | Pencarian fragmen dan verifikasi target | 0 fragmen tanpa target | **21/21 PASS** (1 fragmen dengan target valid; 20 route murni) |
| M-03 | 3 file dalam batas lock | Parser TypeScript `transpileModule` (jsx React) | 0 diagnostic | **3/3 PASS — 0 error** |

Catatan M-02: 16 `href` menu console + 11 item menu shell + 5 `href` antrean di `admin.ts`
(`/owner/moderasi`, `/owner/ujian`, `/owner/pengguna` ×2, `/owner/jasa`). Seluruh 15 route unik
terverifikasi memiliki `src/app/owner/<route>/page.tsx` (route root `/owner` juga ada).

## BELUM-DIVERIFIKASI (runtime/visual)

- Respons 401/403 sungguhan dari server terlihat di browser — BELUM-DIVERIFIKASI (guardrail
  Owner melarang server/request API).
- Tombol "Coba lagi" memicu permintaan ulang dan state loading terlihat — BELUM-DIVERIFIKASI.
- `role="alert"`/`aria-live` diumumkan oleh screen reader — BELUM-DIVERIFIKASI.
- Gate akses tampil benar pada viewport ≤375px — BELUM-DIVERIFIKASI.

**Justifikasi pengecualian:** Owner secara tertulis melarang background, server, npm, lint, build,
test, database, dan request API. Seluruh poin BELUM-DIVERIFIKASI adalah risiko medium (pola state
dan elemen terbukti ada di source; rantai kontrak server dibuktikan statis), bukan critical/high.
Verifikasi runtime wajib dilakukan saat izin berubah dan harus dicatat di `memory/TEST-REPORT.md`.

## Temuan yang tidak menghalangi PASS

Tidak ada temuan baru. Catatan dua hal yang konsisten dengan blueprint:

1. `services/admin.ts` `getPriorityQueue` menjaga lima sumber aksi dengan dua kategori yang
   berbeda dari gate akses; tidak ada metrik dekoratif baru (sesuai D11).
2. `owner-shell.tsx` tetap alias kompatibel ke AdminShell kanonis; tidak ada label Wali maupun
   item placeholder baru.

## Keputusan

**AUDIT: PASS (dengan pengecualian runtime Owner)**
Item dapat dilanjutkan ke Agent 4 untuk penandaan `PASS` final pada `blueprint/INDEX.md`.
