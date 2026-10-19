# Backlog Hidup Madevi — 19 Okt 2026

Diisi ulang terus. Prioritas: cacat pengalaman > ruang tipis > fitur riset > penyempurnaan.

## P1 — Cacat pengalaman
- [ ] B1: API artikel publik kosong (702 DRAFT). Putuskan nasib: publish bertahap / arsip. RISIKO: data produksi.
- [x] B2: Pool SSL via MADEVI_DB_SSL_INSECURE=1 (19 Okt 2026). Dev lokal kini konek Supabase.
- [ ] B3: 151 artikel seed belum di Supabase. Jalankan saat Siklus Rilis (seed idempotent).

## P2 — Konten mendekati lantai
- [x] B4: Matematika 14 artikel → 15 (EXP-MTK-144 Trigonometri, 19 Okt 2026)
- [x] B5-putaran4: +1 tutorial teknologi (HP Android lemot) → 61 tutorial (19 Okt 2026)

## P3 — Fitur riset
- [ ] B6: Kuis per artikel Explore (tabel quiz_questions — butuh migration 0054 diterapkan).
- [ ] B7: Streak harian (user_streaks — butuh migration 0054).
- [x] B8-putaran10: +1 simulasi Bandul Sederhana (7 simulasi, 19 Okt 2026)
- [x] B9: Builder undangan langkah 3-4 selesai (19 Okt 2026): galeri foto, love story, video/musik, RSVP + pertanyaan custom, rekening bank, e-wallet, alamat kado.

## P4 — Utang teknis
- [ ] B10: Integration test vs Supabase dengan schema terpisah (DIBLOKIR: risiko tulis produksi).
- [ ] B11: Migration 0054 belum diterapkan ke Supabase (terapkan saat Siklus Rilis).
- [ ] B12: CSS lama ±27rb baris — konsolidasi bertahap.

## Selesai
- [x] A1-A5 koreksi dasar (19 Okt 2026, docs/audit/koreksi.md)
