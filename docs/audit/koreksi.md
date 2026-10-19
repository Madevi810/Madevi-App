# Koreksi Dasar — 19 Oktober 2026

Perintah Lanjutan Bagian A. Verifikasi jujur atas klaim laporan sebelumnya.
Metode: query LANGSUNG ke Supabase (via tunnel, bukan via file seed).

## A1. Query Supabase — Hasil

```
madevi.articles:        702 baris (status: 702 DRAFT, 0 PUBLISHED)
madevi.article_blocks:  8008 baris
madevi.taxonomy_nodes:  43 baris
madevi.quiz_questions:  TIDAK ADA (tabel belum dibuat)
madevi.user_streaks:    TIDAK ADA (tabel belum dibuat)
madevi.line_profiles:   TIDAK ADA (tabel belum dibuat)
madevi.line_posts:      TIDAK ADA (tabel belum dibuat)
madevi.line_comments:   TIDAK ADA (tabel belum dibuat)
```

Migration 0054 (tabel quiz_questions, user_streaks, line_*) BELUM diterapkan ke Supabase.

## A2. Tabel Klaim vs Kenyataan

| # | Klaim laporan lalu | Kenyataan di Supabase | Kenyataan di file | Status klaim |
|---|-------------------|----------------------|-------------------|--------------|
| 1 | Explore: 151 artikel | **0** (seed SQL belum dijalankan; 702 artikel lama semua DRAFT, tak tampil di API publik) | 151 di 27 file `database/seeds/articles/` | SALAH — angka file seed, bukan DB |
| 2 | Tutorial: 60 tutorial | **0** (tidak ada tabel tutorial di DB) | 60 di `src/content/tutorials-data.ts` | SALAH — data di file TS, bukan DB |
| 3 | School: 64 bab | **0** (tidak ada tabel school di DB) | 64 di `src/content/school-data.ts` | SALAH — data di file TS, bukan DB |
| 4 | Tools: 72 tool | **0** (tidak ada tabel tools di DB) | 72 di `src/services/tools-registry-data.ts` | SALAH — registry di file TS, bukan DB |
| 5 | Services: 12 layanan | **0** (tidak ada tabel services di DB) | 12 di `src/content/services-data.ts` | SALAH — data di file TS, bukan DB |
| 6 | Line: 30 profil / 50 kiriman / 100 komentar / 20 percakapan | **0** (tabel belum ada) | 30/50/100/20 di `src/content/line-data.ts` | SALAH — data di file TS, tabel belum ada |

**Pengakuan**: klaim "151 artikel", "60 tutorial", dst. sebagai capaian database adalah TIDAK BENAR.
Yang benar: konten ada di file (seed SQL / TypeScript), BELUM masuk Supabase.
Pernyataan "Explore SELESAI: 151 artikel" dikoreksi menjadi "151 artikel tertulis di file seed, 0 di database".

## A3. Audit Route (dev server, 19 Okt 2026)

| Route | HTTP | Isi |
|-------|------|-----|
| /tutorial | 200 | Daftar kategori (data TS) |
| /school | 200 | Daftar jenjang (data TS) |
| /school/sd/4/sd4-pecahan | 200 | Materi + latihan tampil |
| /tools | 200 | Daftar tool (data TS) |
| /tools/kalkulator-pecahan | 200 | Tool berfungsi |
| /services | 200 | 12 layanan (data TS) |
| /services/undangan-digital | 200 | Detail + tier tampil |
| /sosial | 200 | Perlu login (wajar) |
| /api/v1/articles | 500 lokal* | [] di produksi (semua DRAFT) |
| /api/v1/taxonomy | 500 lokal* | 43 node, articleCount 0 di produksi |

*500 di lokal karena pool app tanpa SSL via forwarder; bukan cacat produk
(production Vercel normal). Perlu perbaikan pool SSL untuk dev lokal — masuk backlog.

**Temuan**: tidak ada halaman kosong di 6 ruang untuk konten TS. API artikel publik kosong
karena 702 artikel berstatus DRAFT — ini temuan lama yang belum diperbaiki.

## A4. Test & Kode Usang

- Unit test `env.test.ts` ("menolak mode Online") DIPERBAIKI: `parseServerEnv` kini
  menolak `APP_ENV=production` di luar Vercel. Hasil: 778 passed, 0 failed.
- Integration test: DIBLOKIR — butuh koneksi DB langsung; forwarder proxy kini tersedia
  (127.0.0.1:5433), tapi test masih assert workspace Termux. Perbaikan parsial:
  `MADEVI_WORKSPACE_ROOT` override ditambahkan. Full run integration vs Supabase:
  belum dijalankan (risiko menulis ke DB produksi dari test).
- Deteksi kode usang: `tsc --noUnusedLocals --noUnusedParameters` menemukan 41 deklarasi
  tak terpakai → SEMUA DIHAPUS (commit 7f4f5b0). Hasil akhir: 0 error.

## A5. Koreksi INDEX.md

Bagian "Fase 4 SELESAI" dikoreksi: angka konten = jumlah di FILE, bukan di database.
Kolom baru "di Supabase" ditambahkan ke tabel lantai.

## Tindak Lanjut (masuk backlog)

1. Jalankan seed 151 artikel ke Supabase (saat Siklus Rilis, via migration/seed idempotent).
2. Terapkan migration 0054 ke Supabase (tabel quiz/line).
3. Putuskan: konten TS (tutorial/school/tools/services/line) tetap di file atau pindah ke DB.
4. Perbaiki pool SSL untuk dev lokal via forwarder.
5. Integration test vs Supabase: butuh strategi aman (schema terpisah, bukan DB produksi).
6. 702 artikel DRAFT: tentukan nasibnya (publish? arsip?).
