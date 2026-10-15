# CONTENT-001 — Petakan policy server/workflow Owner untuk Content Packet 0039

## Scope dan dependency
- Tujuan pengguna: Menyiapkan rancangan policy server dan workflow (arsitektur dan data kontrak) untuk mengimplementasikan Content Packet 0039 secara aman, sebelum dijalankan migrasi DB.
- Batas perubahan: Hanya menambahkan dokumen rancangan/policy di folder dokumentasi arsitektur atau memory, belum mengubah kode runtime.
- Dependency / blueprint terkait: UX-001, migration 0039.
- File/kontrak diperkirakan: `memory/CONTENT-PLAN.md` atau setara.

## Acceptance criteria wajib
- [ ] AC-01 — Dokumen rancangan workflow Owner untuk pembuatan, update, dan penerbitan Content Packet selesai.
- [ ] AC-02 — Rancangan mencakup pemetaan lifecycle (Draft -> Review -> Published).
- [ ] AC-03 — Policy server untuk safety review profil R7 didefinisikan.

## Acceptance criteria terukur
| ID | Unit | Metode | Ambang | Hasil |
|---|---:|---|---:|---|
| M-01 | File markdown | Review struktural | Memuat lifecycle & safety R7 | belum |

## Verifikasi yang diizinkan
- Statis: Review dokumen.
- Runtime (jika Owner mengizinkan): N/A
- Yang sengaja tidak dijalankan dan alasannya: Tidak mengeksekusi migrasi 0039 atau membuat file di `src/app` karena tugas ini adalah "pemetaan" (mapping).

## Risiko dan rollback
- Risiko: Salah definisi kontrak bisa menyusahkan implementasi.
- Compatibility/migration: Tidak ada risiko, karena tidak ada kode yang diubah.
- Recovery: Hapus dokumen rancangan.
