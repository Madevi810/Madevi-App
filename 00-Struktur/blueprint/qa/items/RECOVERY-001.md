# RECOVERY-001 — Rancang drill restore non-production dan rollback plan

## Scope dan dependency

- **Tujuan pengguna:** keandalan data dapat dipertanggungjawabkan — ada rencana restore dan
  rollback yang nyata, tidak hanya klaim "ada backup".
- **Batas perubahan:** `memory/RECOVERY-PLAN.md` (baru; dokumen perencanaan), serta jika
  diizinkan: `scripts/` drill restore. **Tidak mengubah** source aplikasi, route, API, auth,
  migration yang sudah ada, atau data produksi lokal tanpa izin Owner.
- **Dependency:** `SEC-001` (PASS) — backup exposure sudah diaudit.
- **Fakta awal:** database lokal Postgres (schema `madevi`), 35 migrasi `applied:true`,
  migration source 0036–0039 `PENDING / TIDAK-DIJALANKAN`. `scripts/postgres-termux.mjs`
  (`status|start`) dan `scripts/migrate.mjs` (`status|up`) sudah ada. Backup belum punya
  rencana restore teruji.
- **Izin eksplisit Owner diperlukan** untuk drill restore sungguhan (menjalankan restore
  non-production). Bagian "rancang" bersifat statis dan boleh dikerjakan sekarang.

## Rancangan

1. Inventarisasi yang harus dipulihkan: schema `madevi` + migration state (`schema_migrations`
   atau tabel serupa) + `content-local/` (taxonomy, paket) + konfigurasi env non-rahasia.
2. Definisikan titik pemulihan: per migration batch (misal setelah `0035`), dan per paket
   taxonomy (revisi aktif).
3. Prosedur restore bertingkat: (a) restore schema via `migrate up` dari nol ke titik target;
   (b) restore data via backup snapshot bila tersedia; (c) verifikasi `migrate status` sesuai;
   (d) verifikasi kontrak dasar (route 200, search merespons) — hanya saat izin proses.
4. Definisikan rollback: turunkan migration satu per satu hanya pada lingkungan drill,
   never pada data pengguna; catat bahwa rollback mundur dapat memutus data yang sudah
   disisipkan oleh migration yang lebih baru (tidak aman untuk schema data pengguna).
5. Dokumentasikan uji coba (drill) sebagai prosedur tertulis + checklist hasil, dengan kolom
   hasil tetap kosong sampai Owner mengizinkan eksekusi.

## Acceptance criteria wajib

- [ ] AC-01 — `RECOVERY-PLAN.md` mencakup: inventaris aset, titik pemulihan, prosedur
  restore, prosedur rollback, dan batasan risikonya.
- [ ] AC-02 — Plan membedakan jelas lingkungan drill non-production dari data pengguna;
  tidak ada langkah yang dapat menyentuh data pengguna.
- [ ] AC-03 — Plan jujur tentang apa yang belum diverifikasi: eksekusi drill tetap
  menunggu izin Owner; tidak ada klaim "restore teruji" sebelum drill dijalankan.
- [ ] AC-04 — Tidak ada fitur/status/tombol/menu/angka palsu yang ditambahkan ke source
  aplikasi; perubahan hanya pada dokumen perencanaan (dan `scripts/` bila diizinkan).
- [ ] AC-05 — Auth/session/CSRF/migration aktif/route tidak berubah.

## Acceptance criteria terukur

| ID | Unit | Metode | Ambang | Hasil |
|---|---:|---|---:|---|
| M-01 | 5 bagian plan | Inspeksi dokumen | 5/5 ada | belum |
| M-02 | Inventaris aset | Inspeksi source (scripts, migration, content) | 0 aset terlewat | belum |
| M-03 | Batas drill vs produksi | Inspeksi prosedur | pemisahan eksplisit | belum |
| M-04 | Klaim verifikasi | Inspeksi kejujuran dokumen | 0 klaim drill teruji | belum |

## Verifikasi yang diizinkan

- **Statis:** inspeksi source `scripts/`, `database/migrations/`, `content-local/`; baca
  manifest package; tulis dokumen perencanaan.
- **Runtime (HANYA jika Owner mengizinkan):** drill restore di lingkungan non-production
  terpisah; catat hasil aktual di checklist.
- **Yang sengaja tidak dijalankan:** restore sungguhan, migrate down pada data aktif, atau
  apapun yang menyentuh data pengguna.

## Risiko dan rollback

- **Risiko:** drill yang salah konfigurasi dapat menimpa database aktif. Mitigasi: plan
  mewajibkan lingkungan/database terpisah (misal schema `madevi_drill`) dan pemeriksaan
  nama schema sebelum setiap perintah.
- **Rollback dokumen:** hapus `RECOVERY-PLAN.md`; tidak ada source/data yang terlibat.
