# PROFILE-001 — Audit permission, CSRF, ekspor, hapus akun, dan recovery Profil

## Scope dan dependency
- Tujuan pengguna: Memastikan mekanisme profil pengguna (permission, token CSRF, ekspor data, hapus akun, pemulihan) aman, berjalan di lokal tanpa akses internet, dan tidak dapat dieksploitasi lewat manipulasi form atau endpoint.
- Batas perubahan: Audit statis kode `src/app/profil`, `src/app/recovery`, komponen CSRF, serta actions yang terkait (bukan eksekusi runtime).
- Dependency / blueprint terkait: CONTENT-001
- File/kontrak diperkirakan: `profile-dashboard.tsx`, `recovery-form.tsx`, `csrf-token.ts`, `accounts.ts`

## Acceptance criteria wajib
- [ ] AC-01 — Semua form POST yang berkaitan dengan profil dan data akun menyertakan token CSRF.
- [ ] AC-02 — Proses "hapus akun" memvalidasi sesi dan tidak secara langsung menghapus dari sisi klien, melainkan membuat permintaan *review* Admin atau menghapus lokal (lokal-Termux).
- [ ] AC-03 — Ekspor data memberikan informasi statis jujur bila fitur gagal atau belum siap dirender penuh.
- [ ] AC-04 — Pemulihan (recovery) menggunakan metode lokal inbox, tidak mengirim email/SMS lewat provider pihak ketiga.

## Acceptance criteria terukur
| ID | Unit | Metode | Ambang | Hasil |
|---|---:|---|---:|---|
| M-01 | File kode | Inspeksi manual / grep statis | CSRF terpasang pada semua mutasi Profile | belum |

## Verifikasi yang diizinkan
- Statis: Grep, review arsitektur file TypeScript.
- Runtime (jika Owner mengizinkan): N/A
- Yang sengaja tidak dijalankan dan alasannya: Penetration test atau e2e di browser karena runtime dev server tidak dijalankan.

## Risiko dan rollback
- Risiko: Audit statis tidak menangkap celah keamanan runtime.
- Compatibility/migration: N/A
- Recovery: Revert catatan audit.
