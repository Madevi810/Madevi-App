# database/

Semua yang berhubungan dengan database PostgreSQL Madevi.

## Struktur

- `migrations/` — 52 pasang file `.up.sql` / `.down.sql`
  Bikin dan ubah struktur tabel. Dijalankan via `npm run db:migrate`.
  Otomatis skip yang sudah pernah jalan (dicek via tabel catatan).

- `seeds/` — 1 standar seed (data awal)
  Lihat `seeds/README.md` untuk detail.

- `backup/` — file backup dan rebuild
  Lihat `backup/README.md` untuk detail.

## Prinsip

- `migrations/` = ubah STRUKTUR (bikin/ubah tabel)
- `seeds/` = isi DATA (artikel, taksonomi)
- `backup/` = CADANGAN (restore jika rusak)
