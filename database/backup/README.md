# database/backup/

File backup dan rebuild database.

- `db-dump.sql` — snapshot lengkap database (hasil `pg_dump`)
  Untuk restore jika database rusak.
- `artikel-rebuild.sql` — SQL khusus rebuild artikel saja.
