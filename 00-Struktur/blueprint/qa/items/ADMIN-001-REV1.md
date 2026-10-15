# ADMIN-001-REV1 — Revisi state operasi dan navigasi dashboard Admin

## Scope dan dependency

- **Tujuan pengguna:** Admin membedakan sesi yang perlu masuk ulang dari gangguan layanan, dapat mencoba ulang gangguan layanan, dan tidak diarahkan ke fragmen halaman yang tidak ada.
- **Batas perubahan:** Hanya `Madevi_Off/src/components/owner-console.tsx`, `Madevi_Off/src/components/owner-shell.tsx`, `Madevi_Off/src/services/admin.ts`, serta bukti control untuk item ini. Tidak mengubah API route, auth/session, migration, data pengguna, atau token/CSS tema.
- **Dependency / blueprint terkait:** `ADMIN-001` (PASS), `blueprint/GUARDRAIL.md`, `blueprint/api/KONTRAK-API-LOKAL.md`, dan kontrak `GET /api/v1/owner/operasi`.
- **File/kontrak diperkirakan:** `src/components/owner-console.tsx`, `src/components/owner-shell.tsx`, `src/services/admin.ts`; respons sukses `{ data }`, error `{ error: { code, message } }`; HTTP 401/403 untuk autentikasi/otorisasi.

## Acceptance criteria wajib

- [ ] AC-01 — Hanya HTTP 401 atau 403 yang membuka state autentikasi/otorisasi Admin; keduanya menyatakan masalah akses yang tepat.
- [ ] AC-02 — Error jaringan, JSON tidak terbaca, respons tanpa data, dan HTTP non-401/403 menghasilkan state error yang jujur, diumumkan ke pembaca layar, serta memiliki tombol coba ulang.
- [ ] AC-03 — Dashboard hanya merender ringkasan ketika bentuk data minimum (`stats.users`, `stats.newMessages`, dan `alerts`) valid.
- [ ] AC-04 — Menu dashboard tidak memuat hash/fragmen yang tidak memiliki target elemen pada route tujuan.
- [ ] AC-05 — Kontrak route, CSRF/logout, autentikasi, dan token tema tidak berubah.

## Acceptance criteria terukur

| ID | Unit | Metode | Ambang | Hasil |
|---|---:|---|---:|---|
| M-01 | 4 jalur gagal | Inspeksi handler 401/403, HTTP lain, JSON, dan jaringan | 0 jalur salah menjadi sesi tidak sah | belum |
| M-02 | 4 fragmen menu/antrean lama | Inspeksi semua `href` OwnerConsole, OwnerShell, dan priority queue | 0 fragmen tanpa target | belum |
| M-03 | 1 komponen TSX | Parser TypeScript statis | 0 diagnostic | belum |

## Verifikasi yang diizinkan

- **Statis:** inspeksi kontrak respons, parser TypeScript untuk komponen yang diubah, dan pencarian `href` fragmen pada menu dashboard.
- **Runtime (jika Owner mengizinkan):** respons 401, 403, 500/503, respons rusak, dan gagal jaringan; tombol Coba lagi; navigasi pengguna pada browser lokal.
- **Yang sengaja tidak dijalankan dan alasannya:** npm, lint, build, test, server, database, atau request API, karena guardrail Owner masih melarang proses tersebut.

## Risiko dan rollback

- **Risiko:** Perubahan klasifikasi respons dapat mengubah pesan yang diterima Admin ketika layanan lokal gagal.
- **Compatibility/migration:** Tidak ada schema, route, atau kontrak server yang diubah.
- **Recovery:** Kembalikan satu komponen beserta item revisi ini; tidak ada data atau migrasi yang terlibat.
