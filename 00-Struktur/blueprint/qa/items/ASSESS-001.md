# ASSESS-001 — Presentasi aturan assessment versioned pada UI

> **Status promosi:** PROSES. Bounded vertical slice P-03 dari rekomendasi Agent 1 dan checkpoint
> Agent 5. Audit yang sudah ada adalah baseline historis; siklus ini tetap harus diaudit ulang.
> Tidak ada perubahan source aplikasi pada tahap promosi.

## Scope dan dependency

- **Tujuan pengguna:** angka aturan ujian (jumlah PG, jumlah esai, poin per soal, nilai minimum,
  dan ambang waktu mendesak) yang ditampilkan kepada pengguna maupun Admin harus berasal dari
  konfigurasi `assessment_policies` yang ter-versioned di server, bukan tersebar sebagai angka
  hardcode pada UI. Jika angka pada UI tidak dapat dijamin dari server, UI harus menampilkan
  keterangan yang tidak memalsukan konfigurasi.
- **Batas perubahan:** hanya `Madevi_Off/src/components/exam-attempt.tsx` dan
  `Madevi_Off/src/components/owner-exam-panel.tsx` untuk implementasi, serta bukti control/QA
  yang tercantum di lock. Kontrak API route, `services/exam.ts`, auth/session, migration, data
  pengguna, atau token/CSS tema tidak diubah.
- **Dependency / blueprint terkait:** `SEARCH-001` (PASS), `blueprint/GUARDRAIL.md`,
  `blueprint/data/CONTENT-PACKET.md`, `blueprint/security/SAFETY-DAN-AKSES.md`.
- **Fakta awal:** `ExamService.loadPolicy()` (services/exam.ts:126-149) adalah satu-satunya sumber
  `max_attempts`, `duration_minutes`, `mc_count`, `essay_count`, `essay_max_score`; server
  menghitung `passed = totalScore >= 80` (L863). Akan tetapi UI `exam-attempt.tsx` dan
  `owner-exam-panel.tsx` menuliskan angka tersebut secara literal: `20 × 3 poin`, `5 × maks 8`,
  `≥80`, `/20 PG`, `/5 esai`, serta ambang mendesak `300` detik.

## Batas lock dan handoff

- Lock hanya mencakup `exam-attempt.tsx`, `owner-exam-panel.tsx`, item QA ini, audit QA ini,
  `blueprint/INDEX.md`, dan `memory/CHECKPOINT.md`. Tidak ada irisan dengan lock aktif
  `EMULATOR-001`.
- Agent 2 mengimplementasikan; Agent 3 mengaudit; Agent 4 hanya menangani FAIL; Agent 5
  mengendalikan status dan pelepasan lock.

## Acceptance criteria wajib

- [ ] AC-01 — Tidak ada angka aturan ujian yang ditulis literal pada UI; setiap angka yang
  ditampilkan berasal dari data attempt/policy yang dikirim server, atau ditampilkan sebagai
  keterangan tanpa angka yang memalsukan konfigurasi.
- [ ] AC-02 — Jika server tidak mengirim jumlah/poin soal pada attempt view, UI tidak
  mengklaim jumlah atau poin spesifik; ia memakai jumlah aktual dari array soal yang diterima.
- [ ] AC-03 — Ambang "mendesak"/urgent tidak memalsukan kebijakan server; jika server tidak
  mengirim ambang, keterangan waktu tetap akurat tanpa memakai konstanta yang disebut sebagai
  aturan ujian.
- [ ] AC-04 — Panel Admin menjelaskan proses penilaian (PG otomatis, esai manual) tanpa
  menuliskan angka konfigurasi yang tidak berasal dari data.
- [ ] AC-05 — Kontrak route, API response, auth/session, CSRF/logout, migration, dan token tema
  tidak berubah.

## Acceptance criteria terukur

| ID | Unit | Metode | Ambang | Hasil |
|---|---:|---|---:|---|
| M-01 | 8 angka aturan yang tersebar (2 file) | Pencarian literal `20 × 3`, `5 × maks`, `≥80`, `/20 PG`, `/5 esai`, `300` | 0 angka aturan hardcode | belum |
| M-02 | 2 komponen TSX | Parser TypeScript `transpileModule` | 0 diagnostic | belum |
| M-03 | 5 kontrak (route/api/auth/csrf/tema) | Inspeksi statis diff perubahan | 0 kontrak berubah | belum |

## Verifikasi yang diizinkan

- **Statis:** inspeksi source, pencarian literal angka aturan, dan parser TypeScript untuk
  komponen yang diubah.
- **Runtime (jika Owner mengizinkan):** halaman ujian pada policy versi berbeda menampilkan angka
  yang sesuai; panel Admin tidak menyebut angka konfigurasi.
- **Yang sengaja tidak dijalankan dan alasannya:** npm, lint, build, test, server, database, atau
  request API, browser/runtime, migration, full typecheck, dan background process, karena
  guardrail Owner masih melarang proses tersebut.

## Exclusions

- Tidak mengubah route handler, response/API DTO, `src/services/exam.ts`, policy/schema,
  auth/session/permission, CSRF/logout, data pengguna, question-bank editor, token tema, atau CSS.
- Tidak menambah endpoint policy, fallback angka baru, fixture, mock, atau klaim runtime.
- Tidak memperluas pekerjaan ke `EMULATOR-001`, item PASS lain, atau temuan di luar dua komponen.

## Risiko dan rollback

- **Risiko:** Menghapus angka dari heading dapat mengurangi informasi pemetaan jika server tidak
  mengirim policy. Mitigasi: hitung dari array soal aktual (`mcQuestions.length`,
  `essayQuestions.length`) yang sudah pasti dikirim oleh `loadAttemptView`, sehingga angka tetap
  benar tanpa hardcode konfigurasi.
- **Compatibility/migration:** Tidak ada schema, route, atau kontrak server yang diubah.
- **Recovery:** Kembalikan dua komponen beserta item revisi ini; tidak ada data atau migrasi yang
  terlibat. Jika sumber angka tidak dapat dijamin, hapus klaim angka dan tampilkan keterangan
  jujur; jangan mengubah kontrak server sebagai rollback.
