# database/seeds/

Satu standar seed untuk Madevi (full simulasi, tanpa pembeda).

## Isi

- `articles/` — 120 file SQL batch artikel (710 artikel)
  Dipakai oleh `00-Termux/madevi-rebuild.sh`
- `taxonomy/` — 4 file JSON taksonomi (bahan mentah)
  Dipakai oleh `scripts/taxonomy-import.mjs`
- `scripts/` — 10 file .mjs (perlu audit lanjutan)
  - `seed.mjs` — seed umum (dipakai `npm run db:seed:test`)
  - `seed-simulation.mjs` — data simulasi
  - `seed-articles-pilot-explore.mjs` — artikel pilot
  - `seed-runtime-content-packages.mjs` — paket konten runtime
  - `seed-article-*.mjs` (6 file) — artikel per jenjang (perlu audit)

## Catatan

File .mjs di `scripts/` belum diaudit penuh — dipindah ke sini agar tidak hilang.
Audit lanjutan: tentukan mana yang masih perlu vs bisa dihapus.
