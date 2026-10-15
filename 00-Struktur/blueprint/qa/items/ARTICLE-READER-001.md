# ARTICLE-READER-001 — Kenyamanan Membaca Artikel

## Scope dan dependency
- Tujuan pengguna: membaca artikel dengan ukuran teks yang nyaman dan gangguan visual lebih sedikit, tanpa mengubah sumber/isi artikel.
- Batas perubahan: kontrol pembaca bersama untuk artikel database dan starter `CONTOH · DRAFT`.
- Dependency / blueprint terkait: item bebas/tidak ada source bertabrakan; `RENCANA-PENGALAMAN-ARTIKEL-UNDANGAN-DAN-RUANG.md`; spesifikasi halaman publik; guardrail aksesibilitas dan tanpa data palsu.
- File/kontrak diperkirakan:
  - `Madevi_Off/src/components/article-page-client.tsx`
  - `Madevi_Off/src/components/starter-article-page.tsx`
  - `Madevi_Off/src/components/article-reading-tools.tsx` (baru)
  - `Madevi_Off/src/components/article-reading-tools.module.css` (baru)
  - `Madevi_Off/tests/unit/article-reading-tools.test.tsx` (baru)
  - item ini, `blueprint/INDEX.md`, dan `memory/CHECKPOINT.md`.
- Tidak menyentuh API, auth, data artikel, database/migrasi, route ID, ataupun bug yang sebelumnya dikecualikan.

## Acceptance criteria wajib
- [x] AC-01 — Artikel database dan starter draft menyediakan tombol aksesibel untuk mengecilkan, memperbesar, dan mereset ukuran teks dengan rentang terbatas; semua teks badan yang dirender (paragraf, daftar, tabel, formula/kode, langkah, caption, keselamatan, dan sumber) mengikuti skala, sementara judul/artikel chrome tidak ikut membesar.
- [x] AC-02 — Mode fokus dapat diaktifkan/dimatikan secara aksesibel dan mempersempit lebar bacaan tanpa menyembunyikan isi, sumber, keselamatan, daftar isi, atau navigasi esensial.
- [x] AC-03 — Default tetap berfungsi tanpa JavaScript lebih dari perilaku halaman saat ini; kontrol client tidak mengubah isi/provenance atau menambah penyimpanan preferensi.
- [x] AC-04 — Layout toolbar membungkus pada layar sempit, fokus keyboard terlihat, target kontrol dapat dipakai, dan `prefers-reduced-motion` tidak memperkenalkan gerak.
- [x] AC-05 — Perubahan mempertahankan route, kontrak artikel, permission, dan seluruh label `CONTOH · DRAFT`.

## Acceptance criteria terukur
| ID | Unit | Metode | Ambang | Hasil |
|---|---:|---|---:|---|
| M-01 | 3 skala batas | Tes interaksi ukuran | 3/3 (minimum, default, maksimum) | PASS — suite reader 4/4, 2026-10-09 |
| M-02 | 2 status mode | Tes aksesibilitas tombol dan state | 2/2 | PASS — toggle ARIA on/off diperiksa oleh suite reader 4/4, 2026-10-09 |
| M-03 | build + typecheck | Perintah proyek | exit 0 | PASS — `next build --turbopack` + `tsc --noEmit`, 2026-10-09; 4 warning tracing filesystem yang telah ada |

## Keputusan status

| Kriteria | Hasil | Batas bukti |
|---|---|---|
| AC-01 — Skala isi lengkap | PASS (statis) | Audit Agent 3 final; starter diuji di browser implementer. Route DB dengan artikel nyata belum diuji (API lokal memberi daftar kosong). |
| AC-02 — Mode fokus | PASS (statis) | `aria-pressed`, lebar reader, konten esensial tidak disembunyikan. |
| AC-03 — Tanpa JS/provenance | PASS terbatas (statis + HTML starter) | Response awal starter memuat draft, isi, safety, source; tanpa-JS database dan Termux belum diuji. |
| AC-04 — Responsif/fokus/reduced motion | PASS (statis) | Browser starter tanpa overflow; matriks lengkap device/theme belum dijalankan. |
| AC-05 — Route/permission/label draft | PASS (statis) | Jalur fetch dan label draft terlihat dipertahankan. |

**Keputusan:** `PASS` untuk hasil statis setelah audit independen. Ini bukan klaim bahwa database runtime, no-JS database, Termux, suite penuh, tema/perangkat, atau seluruh situs telah lolos verifikasi. Lihat `../audits/ARTICLE-READER-001.md` untuk rincian bukti.

## Verifikasi yang diizinkan
- Statis: inspeksi diff file terbatas dan pemeriksaan route/provenance.
- Runtime lokal: unit test terarah, typecheck, build, dan browser smoke localhost karena Owner secara eksplisit meminta pengerjaan seluruh isi web dan verifikasi hasil.
- Yang sengaja tidak dijalankan: test suite penuh yang sebelumnya macet; server/DB/migrasi eksternal, Termux, serta perubahan API/data.

## Risiko dan rollback
- Risiko: selector reader CSS dapat berpengaruh ke teks yang bukan badan artikel atau ukuran tidak mengikuti tema.
- Compatibility/migration: tidak ada; tidak mengubah route atau data.
- Recovery: revert hanya file dalam lock item ini; jangan menyentuh lock UX shell atau emulator.
