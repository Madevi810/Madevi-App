# Audit PKG-REF-001 — Konsistensi referensi paket konten

- **Item:** PKG-REF-001
- **Tanggal:** 2026-09-28
- **Auditor:** Agent 3 (Audit)
- **Metode:** Inspeksi statis/parser dan pemeriksaan keberadaan path lokal saja
- **Hasil:** **PASS secara statis** (4/4 AC wajib, 3/3 M)
- **Runtime:** **BELUM-DIVERIFIKASI** — server, browser, request API, database,
  migration, test runner, lint, build, dan full typecheck tidak dijalankan.

## Batas dan bukti yang diperiksa

- Sumber status: `/sdcard/project/Madevi/Madevi-Control/blueprint/INDEX.md`;
  lock `PKG-REF-001` membatasi audit pada panel, route Owner content-packages,
  service/contract runtime-content, dan taxonomy lokal.
- QA item:
  `/sdcard/project/Madevi/Madevi-Control/blueprint/qa/items/PKG-REF-001.md`.
- Checkpoint:
  `/sdcard/project/Madevi/Madevi-Control/memory/CHECKPOINT.md`, khususnya bagian
  Agent 2 Execution — PKG-REF-001.
- Source yang dibaca:
  `/sdcard/project/Madevi/Madevi_Off/src/components/feature-package-panel.tsx`,
  `src/app/api/v1/owner/content-packages/route.ts`,
  `src/contracts/runtime-content.ts`, dan `src/services/runtime-content.ts`.
- Path lokal yang diperiksa: `/sdcard/project/Madevi/Madevi_Off/content-local/packages/taxonomy/`.
  `madevi-explore-pilot-v1.json` dan README ada; root `Fitur-Template/`, `Menu/`,
  dan `Artikel/` tidak ada.
- Parser Babel lokal berhasil untuk keempat file source yang diperiksa
  (`BABEL_PARSE_OK`). Ini adalah pemeriksaan sintaks, bukan full typecheck.

## Acceptance criteria wajib

- [x] **AC-01 — PASS.** Tiga fixture pada `feature-package-panel.tsx:42-46`
  tetap menampilkan `sourceRef`, tetapi `classifySource()` pada baris 32-40
  hanya memberi `AVAILABLE` untuk allow-list yang telah diverifikasi. Ketiga ref
  fixture aktual (`Fitur-Template/...`, `Menu/Export/menu-canonical...`, dan
  `Artikel/...`) tidak masuk allow-list sehingga tidak dipromosikan sebagai
  sumber lokal. Tidak ada path external folder yang dipakai sebagai manifest
  lokal. Satu manifest allow-list yang ada (`Menu/Export/menu-pilot-explore-import-v1.json`)
  dipetakan eksplisit ke
  `content-local/packages/taxonomy/madevi-explore-pilot-v1.json`, yang ada.

- [x] **AC-02 — PASS.** Untuk ref yang tidak terbukti lokal, panel menghasilkan
  `UNAVAILABLE` dan teks `manifest lokal tidak tersedia`
  (`feature-package-panel.tsx:90-97`). Tidak ada inferensi path dari string ref;
  lookup hanya memakai `VERIFIED_LOCAL_MANIFESTS` (`:23-39`). Error storage juga
  menyatakan fixture tetap tampil dan status storage tidak diketahui (`:79-87`),
  bukan mengklaim sumber valid.

- [x] **AC-03 — PASS.** Route mengembalikan wrapper
  `successResponse({ packages: valid, invalid }, requestId)`
  (`route.ts:24-25`). Service mendeklarasikan `valid: RuntimePackageView[]` dan
  `invalid: Array<{ packageId: string; reason: string }>` serta menambahkan setiap
  baris gagal ke `invalid`, bukan membuangnya (`runtime-content.ts:30-49`). Panel
  mempertahankan `data.invalid` dan merender setiap baris invalid sebagai alert
  (`feature-package-panel.tsx:71-74,100-108`). Dukungan array lama di panel tidak
  mengubah bentuk route kanonis; wrapper `{ packages, invalid }` tetap ditangani.

- [x] **AC-04 — PASS secara inspeksi scope.** Route tetap memanggil
  `authenticateRequest(request, 'OWNER', { humanActivity: true })`
  (`route.ts:16-20`). Contract tetap memvalidasi `source_ref`, `license_ref`,
  `rollback_reference`, checksum, status, dan `published_at`
  (`runtime-content.ts:66-121`); service tetap memfilter hanya `PUBLISHED` untuk
  menu runtime (`runtime-content.ts:52-56`). Tidak ada perubahan yang terlihat
  pada database/migration, payload, status publikasi, atau route lain dalam
  perubahan PKG-REF-001; checkpoint mencatat implementasi source hanya pada panel.

## Acceptance criteria terukur

| ID | Ambang | Hasil |
|---|---|---|
| **M-01** | 0 ref external/pensiun; 3/3 resolved atau honest-unresolved | **PASS** — ketiga fixture di `feature-package-panel.tsx:43-45` menjadi `UNAVAILABLE` secara eksplisit; tidak ada path rekaan. |
| **M-02** | 1/1 shape `packages` + `invalid` konsisten | **PASS** — `route.ts:24-25`, service `:31-49`, contract DTO `:14-27`, dan panel `:71-74` konsisten. |
| **M-03** | 0 file DB/migration/auth/route lain berubah | **PASS secara bukti scope yang tersedia** — checkpoint mencatat source implementasi hanya panel; audit tidak menemukan perubahan/rujukan perubahan di luar batas item. Pemeriksaan ini tidak memakai git dan tidak mengklaim verifikasi runtime. |

## Temuan dan revisi

Tidak ada FAIL statis. Tidak ada revisi minimal yang diperlukan.

Catatan batas: keberadaan manifest dan alur response telah diperiksa secara
statis; keberhasilan request nyata, autentikasi nyata, isi database, dan rendering
runtime tetap **BELUM-DIVERIFIKASI** sesuai guardrail.
