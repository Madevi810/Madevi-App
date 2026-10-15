# RECOVERY-PLAN — Rancangan drill restore non-production dan rollback Madevi

> **Status dokumen:** RANCANGAN (statis). Eksekusi drill restore menunggu izin eksplisit
> Owner. Tidak ada klaim "restore teruji" di bawah — bagian hasil sengaja dibiarkan kosong.
> Lihat batasan di `blueprint/GUARDRAIL.md` dan item QA `RECOVERY-001`.

## 1. Inventaris aset yang harus dapat dipulihkan

| Aset | Lokasi | Catatan |
|---|---|---|
| Schema database `madevi` | Postgres lokal via `scripts/postgres-termux.mjs` | 35 migrasi `applied:true` (lihat `scripts/migrate.mjs status`) |
| Migration source 0036–0039 | `database/migrations/` | `PENDING / TIDAK-DIJALANKAN` — belum bagian schema aktif |
| Dump database | `backup-local/<kode>/database.dump` | `pg_dump --format=custom --no-owner --no-privileges` |
| Storage runtime | `MADEVI_RUNTIME_ROOT/storage` | disalin dengan filter exclusion (log/cache/key/env dikecualikan) |
| Manifest backup | `backup-local/<kode>/manifest.json` | `status COMPLETE` + `fileListSha256` checksum |
| Paket taxonomy | `content-local/packages/taxonomy/` | sumber reproducibility; `scripts/taxonomy-import.mjs` |
| Konfigurasi non-rahasia | `.env` yang bukan kredensial | kredensial tetap hanya jalur Admin (MASTER §3.2) |

## 2. Titik pemulihan yang didukung

- **P-1 Schema aktif:** schema `madevi` pada kondisi 35 migrasi terapan.
- **P-2 Backup terakhir tersedia:** direktori `backup-local/backup-20260923142114367-2776baf4`
  (contoh nyata yang ada; tanggal sesuai manifest aktual saat drill dijalankan).
- **P-3 Paket taxonomy revisi aktif:** revisi 3 `madevi-explore-pilot-v1` (27 node, multi-root).
- **Bukan titik pemulihan:** migration `0036`–`0039` — belum diterapkan; tidak boleh diasumsikan
  ada di schema aktif.

## 3. Prosedur restore (lingkungan drill saja)

**Prasyarat isolasi (wajib, ditegakkan oleh `scripts/restore.mjs`):**
- Target runtime root harus di bawah `backup-local/restore-targets/` dan **kosong**.
- `TARGET_DATABASE_URL` harus diberikan via environment dan **berbeda** dari `DATABASE_URL`
  aktif; schema target via `--schema` (misal `madevi_drill`).
- Manifest harus `status COMPLETE` + `fileListSha256` cocok (daftar file tidak berubah).

**Langkah:**
1. `node scripts/inspect-restore.mjs --manifest <path> --target-runtime-root <path>` —
   dry-run validasi (manifest root, target isolation, checksum, disk). **Tidak menulis apa pun.**
2. Periksa output: semua finding `ok: true`. Bila ada yang false, hentikan — jangan restore.
3. `TARGET_DATABASE_URL=<db drill> node scripts/restore.mjs --manifest <path>
   --target-runtime-root <path>` — restore ke target terisolasi.
4. Verifikasi pasca-restore (lingkungan drill): `migrate status` konsisten, jumlah file storage
   cocok manifest, dan kontrak dasar dapat dijalankan terhadap drill DB.
5. Catat hasil aktual di checklist §5. Hanya setelah ini boleh disebut "restore teruji".

## 4. Prosedur rollback

- **Rollback migration (drill saja, berbahaya pada data pengguna):** `migrate.mjs` mendukung
  status/up; penurunan mundur satu per satu hanya pada schema drill. **Tidak aman** pada data
  pengguna karena migration yang lebih baru dapat sudah menyisipkan data yang bergantung pada
  schema tersebut — rollback mundur dapat memutus data. Oleh karena itu rollback data
  pengguna **harus** lewat restore dari backup (§3), bukan migrate down.
- **Rollback paket taxonomy:** kembalikan revisi sebelumnya via arsip
  `content-local/packages/taxonomy/` + `taxonomy-import.mjs` (status/preview/stage/promote);
  jangan promote tanpa verifikasi lokal.
- **Rollback dokumen ini:** hapus `RECOVERY-PLAN.md`; tidak ada source/data yang terlibat.

## 5. Checklist hasil drill (KOSONG sampai Owner mengizinkan)

| Langkah | Metode | Hasil |
|---|---|---|
| `inspect-restore.mjs` dry-run | semua finding `ok: true` | — |
| `restore.mjs` ke target terisolasi | exit 0, tidak menyentuh DB aktif | — |
| `migrate status` pada drill DB | konsisten dengan manifest | — |
| File storage cocok manifest | jumlah + checksum | — |
| Kontrak dasar pada drill DB | route/search dapat dijalankan | — |

## 6. Batasan dan kejujuran

- Dokumen ini adalah **rancangan statis**. Klaim "restore teruji" hanya sah setelah checklist
  §5 terisi dengan hasil nyata atas izin Owner.
- Tidak ada langkah di atas yang menyentuh data pengguna; `restore.mjs` sendiri menolak target
  non-isolated dan manifest non-COMPLETE.
- Kredensial/produksi/publikasi tetap butuh jalur Admin (MASTER §3.2).
