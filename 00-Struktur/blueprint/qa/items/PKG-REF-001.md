# PKG-REF-001 — Konsistensi referensi paket konten

## Scope dan dependency
- Tujuan pengguna: panel Owner menampilkan referensi paket yang dapat ditelusuri
  atau menyatakan dengan jujur bahwa sumber lokalnya belum tersedia; tidak ada
  referensi ke folder eksternal yang telah dipensiunkan.
- Batas perubahan: `src/components/feature-package-panel.tsx`, kontrak/DTO
  pembacaan `src/contracts/runtime-content.ts`, dan pembentukan response
  `src/app/api/v1/owner/content-packages/route.ts` serta
  `src/services/runtime-content.ts` hanya bila diperlukan untuk menjaga bentuk
  data `packages`/`invalid`. QA item ini tidak mengizinkan perubahan database,
  migration, seed, autentikasi, status publikasi, atau payload paket.
- Dependency / blueprint terkait: kandidat Agent 1 `memory/BACKLOG.md`
  (Konsistensi referensi); kontrak L06 runtime content package. Tidak bergantung
  pada `EMULATOR-001`; lock file-nya tidak beririsan.
- File/kontrak diperkirakan: tiga `sourceRef` fixture di panel, response Owner
  `{ data: { packages, invalid } }`, validasi `source_ref/license_ref/
  rollback_reference`, dan isi statis `content-local/packages/taxonomy/`.
- Temuan baseline statis: panel memiliki tiga ref `Fitur-Template/…`,
  `Menu/…`, dan `Artikel/…`; folder tersebut tidak ada di root aplikasi.
  Sumber lokal yang ditemukan hanya paket taxonomy di
  `content-local/packages/taxonomy/`. Karena manifest Feature Template dan
  Artikel tidak ditemukan, implementasi tidak boleh membuat path rekaan.

## Acceptance criteria wajib
- [ ] AC-01 — Setiap `sourceRef` yang ditampilkan sebagai sumber lokal cocok
  dengan file/manifest yang benar-benar berada di bawah `Madevi_Off` dan tidak
  menggunakan folder eksternal `Fitur-Template/`, `Menu/`, atau `Artikel/`.
- [ ] AC-02 — Untuk package tanpa sumber lokal yang dapat dibuktikan, panel
  menampilkan status jujur (misalnya unresolved/not available) dan tidak
  menyamarkan atau mempromosikannya sebagai sumber valid.
- [ ] AC-03 — Bentuk response API tetap kompatibel: `data.packages` adalah
  array package dan `data.invalid` adalah array `{ packageId, reason }`;
  baris invalid tetap dilaporkan, bukan diubah menjadi array kosong.
- [ ] AC-04 — Perubahan tidak mengubah auth Owner, filter package PUBLISHED,
  checksum/license/rollback validation, payload, database, migration, atau
  route lain.

## Acceptance criteria terukur
| ID | Unit | Metode | Ambang | Hasil |
|---|---:|---|---:|---|
| M-01 | 3 | inspeksi statis seluruh fixture `sourceRef` panel | 0 ref menuju folder eksternal/pensiun; 3/3 punya hasil resolved atau honest-unresolved | belum |
| M-02 | 1 | inspeksi statis route, service, dan contract response | 1/1 shape `packages` + `invalid` konsisten | belum |
| M-03 | 1 | inspeksi diff terbatas terhadap scope item | 0 file DB/migration/auth/route lain berubah | belum |

## Verifikasi yang diizinkan
- Statis: baca/grep/diff terbatas pada file scope, daftar path lokal yang
  relevan, dan inspeksi kontrak TypeScript tanpa menjalankan aplikasi.
- Runtime (jika Owner mengizinkan): tidak termasuk dalam fase ini; request API
  hanya boleh dilakukan setelah izin eksplisit dan handoff baru.
- Yang sengaja tidak dijalankan dan alasannya: server, browser, request API,
  database, migration, test runner, lint, build, dan typecheck dilarang oleh
  guardrail/scope sesi ini.

## Risiko dan rollback
- Risiko: manifest lokal yang belum ada dapat disalahartikan sebagai bug
  panel; mitigasi adalah label unresolved dan bukti path, bukan path rekaan.
- Compatibility/migration: tidak ada perubahan schema, data, migration,
  package status, atau API route; pertahankan response wrapper dan DTO L06.
- Recovery: rollback dengan membatalkan perubahan terbatas pada panel/DTO
  response bila audit menemukan regresi; jangan menghapus atau mengubah paket
  di `content-local`.
