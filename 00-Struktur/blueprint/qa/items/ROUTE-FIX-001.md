# ROUTE-FIX-001 — Route /admin buntu, paket taxonomy kanonis, assertion kontrak desain

## Scope dan dependency

- **Tujuan pengguna:** navigasi Admin tidak lagi menunjuk ke route yang tidak ada; deep link
  `/admin/*` lama pulih ke `/owner/*` kanonis; test kontrak desain membaca path paket taxonomy
  yang benar.
- **Batas perubahan:** `next.config.ts` (redirects), `src/app/admin/{page,layout}.tsx`,
  `src/components/admin-shell.tsx` (penanda), `src/services/admin.ts` (7 href getCapabilities),
  `tests/unit/prompt03.test.ts` (5 assertion kontrak desain), `tests/unit/taxonomy-source.test.ts`
  + `tests/integration/prompt05-package.test.ts` (path paket kanonis),
  `scripts/taxonomy-import.mjs` + `scripts/lib/taxonomy-source.mjs` (komentar/hint).
  **Tidak mengubah** API, data, auth/CSRF, migration, atau kontrak UI publik.
- **Dependency:** `ADMIN-001-REV1` (PASS).
- **Fakta awal:** `/admin` hanya punya layout + page yang me-redirect ke `/admin/operasi`
  (tidak ada); 19 halaman Admin nyata ada di `/owner/*`; 7 href capability menunjuk `/admin/*`.

## Acceptance criteria wajib

- [x] AC-01 — Tidak ada href/menu internal yang menunjuk route yang tidak ada; semua target
  dapat dicapai dari capability AdminService.
- [x] AC-02 — Deep link `/admin/*` lama pulih: 307 ke `/owner/*` yang ada, bukan 404.
- [x] AC-03 — Path paket taxonomy kanonis (`content-local/packages/taxonomy/`) dipakai
  konsisten oleh test dan script; tidak ada dependensi folder `Menu/` lama.
- [x] AC-04 — Assertion kontrak desain `prompt03` diperbarui ke nilai pasca-UX-REDESIGN-001
  (tidak dihapus sesuai MASTER §4); nilai baru cocok source aktual.
- [x] AC-05 — Tidak ada route/API/data/fitur/tombol/angka palsu yang ditambahkan; auth/session,
  CSRF, migration, dan token Light/Dark/Madevi On tidak berubah.

## Acceptance criteria terukur

| ID | Unit | Metode | Ambang | Hasil |
|---|---:|---|---:|---|
| M-01 | 8 file berubah | Parser TypeScript `transpileModule` | 0 diagnostic | PASS |
| M-02 | 5 deep link `/admin/*` | curl smoke (pra-guardrail, lokal non-produksi) | 307 → route 200 | PASS |
| M-03 | 5 assertion prompt03 | Verifikasi grep ke source | semua cocok | PASS |
| M-04 | `prompt-l07` integration | Vitest (pra-guardrail, lokal non-produksi) | 6/6 PASS | PASS |
| M-05 | Sisa link `/admin` di source | Pencarian statis | hanya penanda/redirect | PASS |

## Verifikasi yang diizinkan

- **Statis:** parser TypeScript, verifikasi grep assertion, pencarian sisa link.
- **Runtime (dijalankan sebelum guardrail diketahui, lokal non-produksi, dicatat jujur):**
  `tsc --noEmit` EXIT 0, `migrate status` 35/35, `prompt-l07` 6/6, curl smoke 307/200/404.
- **Yang sengaja tidak dijalankan setelah guardrail:** npm, lint, build, test, server,
  database, atau request API baru.

## Risiko dan rollback

- **Risiko:** audit ulang `src/services/admin.ts` bila diperlukan; perubahan getCapabilities
  bertumpuk dengan cakupan lock SEC-001 (kini PASS). Mitigasi: perubahan hanya pada 7 href.
- **Recovery:** kembalikan `next.config.ts` redirects + 7 href capability; tidak ada data
  atau migrasi yang terlibat.
