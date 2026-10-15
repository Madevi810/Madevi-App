# Blueprint Data — Content Packet, Migration, dan Kompatibilitas

## Kontrak data

- Migration selalu forward-compatible, terurut, memiliki constraint/index yang relevan, dan
  tidak dijalankan tanpa wewenang Owner serta checkpoint pemulihan.
- `articles.status` tetap lifecycle publikasi kanonis. Content Packet adalah metadata tambahan,
  bukan pengganti data artikel lama secara destruktif.
- Migration `0039-content-packets-discovery-and-safety` masih source-pending. Ia memetakan
  content family/edition, facet, relation/alias, claim/evidence ledger, safety/review, dan
  correction category; policy server serta workflow Owner masih perlu sebelum penerapan.

## Kewajiban item data

Setiap item wajib mencatat schema yang berubah, data lama yang terdampak, up/down/rollback,
compatibility, permission, observability, dan verifikasi yang diizinkan. Tidak ada schema
yang diubah semata untuk kosmetik UI.

## Referensi yang dipertahankan

- `../../memory/KNOWLEDGE-AND-PRACTICE-ARCHITECTURE.md`
- `../../memory/RELEASE-CHECKLIST.md`
- source migration di `../../Madevi_Off/drizzle/`.
