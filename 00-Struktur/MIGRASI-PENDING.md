# MIGRASI-PENDING — Ditulis, BELUM Dieksekusi Runtime

Per 14 Okt 2026 16:30 WIB. Semua migrasi di bawah **sudah ditulis lengkap
(up + down)** di `database/migrations/` tetapi **belum dijalankan** karena
INSTRUKSI-02 melarang operasi DB (verifikasi statis saja; Muse pemegang
mandiat runtime).

Jalankan dengan: `node scripts/migrate.mjs up`

| Nomor | File | Tujuan | Tabel/Objek yang dibuat |
|-------|------|--------|--------------------------|
| 0041 | `0041-line-protection.up/down.sql` | Perlindungan Madevi Line (INSTRUKSI-03) | `content_reports.reason_category`, `social_posts.is_anonymous`, indeks + trigger guard |
| 0042 | `0042-kindness-story.up/down.sql` | Peta Kebaikan + Dongeng Bareng (INOVASI-0841/0940) | `kindness_report`, `story_threads`, `story_chapters`, `story_votes` |
| 0043 | `0043-shop-bundle.up/down.sql` | Bundel Ongkir Tetangga (INOVASI-0940) | `shipping_bundles`, `bundle_items` |
| 0044 | `0044-listen-turn.up/down.sql` | Giliran Dengar (INOVASI-1045) | `listen_sessions`, `listen_session_listeners`, `listen_responses` |
| 0045 | `0045-duel.up/down.sql` | Duel Produk (INOVASI-1045) | `product_duels`, `duel_points`, `duel_votes` |
| 0046 | `0046-sidang-warga.up/down.sql` | Sidang Warga (INOVASI-1145) | `sidang_sessions`, `sidang_arguments`, `sidang_votes` |
| 0047 | `0047-klinik-ide.up/down.sql` | Klinik Ide (INOVASI-1145) | `clinic_sessions`, `clinic_feedback`, `clinic_votes` |
| 0048 | `0048-silsilah-karya.up/down.sql` | Silsilah Karya (INOVASI-1245) | `social_posts.parent_karya_id`, `karya_lineage`, `karya_badges` + `refresh_karya_badges()` |
| 0049 | `0049-petition.up/down.sql` | Petisi Katalog (INOVASI-1245) | `product_petitions`, `petition_votes` |

## Catatan

- Semua migrasi memakai placeholder `__SCHEMA__` yang diganti otomatis
  oleh `getDatabaseSchema()` saat runtime (lihat `scripts/migrate.mjs`).
- DB live: `madevi_off`, data ada di schema `public` (159 tabel),
  env `DATABASE_URL` mengarah ke `madevi_local@127.0.0.1:5432/madevi_off`.
- Setelah `migrate up`: verifikasi tabel baru ada dengan
  `SELECT count(*) FROM information_schema.tables WHERE table_schema='public';`
  (seharusnya bertambah dari 159).
- Migrasi 0001–0040 SUDAH terpakai di DB live (lihat `db-dump.sql`).
