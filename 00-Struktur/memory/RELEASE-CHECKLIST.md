# RELEASE-CHECKLIST (D13)

## Prarilis lokal
- [x] Migrasi 0001–0035 applied + guard checksum aktif (`migrate status`).
- [x] Backup COMPLETE + inspect-restore 9/9 (`backup-20260923142114367-2776baf4`).
- [x] Typecheck langsung EXIT 0 (pengganti lint/build yang dilarang Admin).
- [ ] Build production lokal (butuh `npm run build` — DITUNDA instruksi Admin).
- [ ] Visual audit screenshot (TERBLOKIR — tanpa desktop browser).

## Verifikasi runtime (dev, dilakukan)
- [x] `/api/health` ok (app+db); 13 halaman inti 200; owner 5 halaman 200.
- [x] Taxonomy rev 2 ACTIVE → API + ruang + search MENU.
- [x] 3 artikel pilot PUBLISHED → `/artikel/:id` 200 + search ARTICLE.
- [x] Contract suite + integrasi per-file (sapu penuh berjalan).

## Rollback
- Database: `migrate down` per-step dengan `--confirm-schema` + manifest
  backup COMPLETE (authorizeRollback). Down 0034/0035 tersedia.
- Taxonomy: pointer revisi (promote revisi lama lagi); alias dipertahankan.
- Source: tanpa git — andalkan backup `backup-local/` + snapshot
  `/tmp/opencode/Madevi_Off-snapshot-20260920.tar.gz` (awal sesi).

## Larangan rilis
- Kredensial/produksi/publikasi nyata tetap jalur Admin (MASTER §3.2).
- Restore execute hanya di jendela khusus + pre-restore checkpoint.
