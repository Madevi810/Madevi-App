# Blueprint API — Kontrak Lokal dan Permission

## Aturan

- Runtime API tetap lokal; tidak ada endpoint eksternal wajib tanpa keputusan Owner.
- Endpoint sensitif memeriksa authorization, ownership/IDOR, CSRF, validasi, rate limit, audit,
  error recovery, dan response yang tidak membocorkan data.
- UI tidak boleh menebak route/permission/data. Ia memakai kontrak server yang tersedia dan
  menampilkan loading, empty, error, forbidden/locked, serta success secara jujur.
- Perubahan request/response memerlukan ID item, kompatibilitas klien lama, dan acceptance
  criteria API di `../qa/`.

## Prioritas audit

Search permission-aware (`SEARCH-001`), profil/CSRF (`PROFILE-001`), Admin (`ADMIN-001`), dan
assessment versioned (`ASSESS-001`) adalah irisan API berikutnya dalam `../INDEX.md`.
