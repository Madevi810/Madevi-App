# SEARCH-001 — Verifikasi Search Permission-Aware, Filter Ruang/Kategori, Zero-Result

## Scope dan dependency

- **Tujuan pengguna:** Pencarian mengembalikan hasil yang sesuai hak akses pengguna (tamu/member/owner), dapat difilter per ruang dan kategori, dan menangani zero-result serta error dengan panduan pemulihan.
- **Batas perubahan:** Audit statis; tidak ada perubahan source karena semua AC lulus. Jika ditemukan temuan, perbaikan dibatasi pada `src/app/api/v1/search/route.ts`, `src/services/search.ts`, `src/components/search-overlay.tsx`, `src/contracts/search.ts`.
- **Dependency / blueprint terkait:** ADMIN-001 (PASS), kontrak L06 (`contracts/search.ts`), migration 0031 (kolom space_key/target_href), `blueprint/GUARDRAIL.md`.
- **File diaudit:**
  - `src/app/api/v1/search/route.ts`
  - `src/services/search.ts`
  - `src/components/search-overlay.tsx`
  - `src/contracts/search.ts`
  - `src/services/search-projection.ts`

## Acceptance criteria wajib

- [x] AC-01 — Principal diambil dari session (bukan parameter user-supplied); tamu mendapat null.
- [x] AC-02 — Hasil MEMBER tidak bocor ke tamu: `canReadMember` false → `access_level = 'PUBLIC'` di SQL.
- [x] AC-03 — MEMBER hanya untuk login + `APPROVED` + entitlement/OWNER.
- [x] AC-04 — PROFILE/POST dari pasangan block tersaring via `social_blocks`.
- [x] AC-05 — Data fixture/is_test hanya terlihat principal fixture; tidak bocor ke pengguna nyata.
- [x] AC-06 — Fallback pra-0031 tetap menerapkan block (legacyBlock via object_id).
- [x] AC-07 — Filter `space` dan `category` dari UI disanitasi: hanya nilai whitelist yang masuk ke query.
- [x] AC-08 — Limit diklem 1–100; tidak ada query unlimited.
- [x] AC-09 — Cursor tamper → `SearchError` bukan stack trace ke klien.
- [x] AC-10 — Overlay: zero-result menampilkan pesan deskriptif + saran ganti filter.
- [x] AC-11 — Overlay: error state dengan tombol retry; debounce 300ms; abort saat query berubah.
- [x] AC-12 — Highlight query menggunakan React node (escape), bukan `innerHTML`.
- [x] AC-13 — `targetHref` tervalidasi server (whitelist allowlist); UI memakai nilai server, bukan menebak route.
- [x] AC-14 — Entry tanpa target valid tidak dirender (fail-closed: `if (!computed) continue`).
- [x] AC-15 — SPACES di overlay sinkron dengan `SearchSpaceKey` kontrak (7/7 key match).

## Acceptance criteria terukur

| ID | Unit | Metode | Ambang | Hasil |
|---|---:|---|---:|---|
| M-01 | 31 check regex statis | Script Node.js multi-file | 0 FAIL | **31/31 PASS** |
| M-02 | 10 deep check statis | Script Node.js lanjutan | 0 FAIL | **10/10 PASS** |
| M-03 | 7 SPACES keys | Cek sinkronisasi kontrak vs overlay | 0 missing/extra | **SINKRON** |
| M-04 | 4 file | Brace balance | 0 unbalanced | **4/4 PASS** |

## Verifikasi yang diizinkan

- **Statis:** semua check di atas (script Node.js non-server, inspeksi manual).
- **Runtime (jika Owner mengizinkan):** buka search overlay, ketik query, verifikasi hasil hanya PUBLIC untuk tamu, verifikasi filter ruang memfilter hasil, verifikasi zero-result state.
- **Yang sengaja tidak dijalankan:** npm, lint, build, test, dev server, request API live — sesuai arahan Owner.

## Risiko dan rollback

- **Risiko:** Migration 0031 (kolom space_key/target_href/subject_principal_id) yang belum dijalankan membuat fallback pra-0031 aktif; block social tetap ditegakkan via object_id, namun filter ruang tidak tersedia sampai migrasi dijalankan.
- **Compatibility:** fallback pra-0031 sudah ada dan aman; tidak ada perubahan diperlukan.
- **Recovery:** tidak ada perubahan source; rollback tidak relevan.
