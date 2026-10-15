# Audit Agent 3 — ASSESS-001

**Tanggal:** 2026-09-28  
**Metode:** inspeksi statis source, pencarian literal terarah, inspeksi kontrak service/API read-only, dan parser Babel TypeScript/TSX. Tidak ada server, browser/runtime, request API, database, migration, test runner, lint, build, atau full typecheck dijalankan.

## Ringkasan keputusan

**Hasil statis: PASS untuk AC-01–AC-05 dan M-01–M-03, dengan batasan verifikasi runtime yang tetap `BELUM-DIVERIFIKASI`.**

Perubahan yang diaudit hanya:

- `Madevi_Off/src/components/exam-attempt.tsx`
- `Madevi_Off/src/components/owner-exam-panel.tsx`

Tidak ditemukan angka aturan ujian yang di-hardcode kembali. UI memakai panjang array soal yang diterima, nilai/poin yang diterima pada attempt, serta status `passed` dan score dari server; tidak ada ambang waktu client yang dipresentasikan sebagai kebijakan.

## Bukti kontrak server/policy read-only

- `src/services/exam.ts:126-149`: `loadPolicy()` membaca `assessment_policies` aktif atau versi eksplisit dan mengambil `max_attempts`, `duration_minutes`, `mc_count`, `essay_count`, serta `essay_max_score`.
- `src/services/exam.ts:1343-1421`: `loadAttemptView()` menghitung `remainingSeconds` dari deadline server; membentuk `mcQuestions` dan `essayQuestions` dari baris attempt; hanya ketika hasil boleh dibuka ia mengirim `points`, rubric, score, dan `passed`.
- `src/services/exam.ts:813-864`: grading memakai snapshot policy attempt untuk jumlah dan maksimum nilai esai; `passed` dihitung server dan dikirim sebagai boolean. UI tidak mengulang ambang tersebut.

## Audit acceptance criteria

| ID | Hasil | Bukti statis |
|---|---|---|
| AC-01 | **PASS** | Tidak ada literal aturan `20 × 3`, `5 × maks`, `≥80`, `/20 PG`, `/5 esai`, `maks 8`, `/8`, `0–8`, `25 wajib`, atau `300` pada dua komponen. Header attempt memakai `attempt.mcQuestions.length` dan `attempt.essayQuestions.length`; poin/score hanya merender `q.points`, `q.score`, dan `attempt.scores` yang diterima. Label kelulusan hanya memakai `attempt.scores.passed`. |
| AC-02 | **PASS** | Konfirmasi submit dan ringkasan memakai `attempt.mcQuestions.length`, `attempt.essayQuestions.length`, dan jumlah total dari kedua array yang diterima. Tidak ada klaim jumlah/poin konfigurasi ketika field policy tidak ada. `q.points` hanya ditampilkan bila server mengirim nilai numerik. |
| AC-03 | **PASS** | Timer memakai `remainingSeconds` yang diterima server lalu menghitung menit/detik untuk tampilan dan auto-submit hanya pada nol. Tidak ada `secondsLeft < 300`, label urgent, atau konstanta threshold waktu. Copy secara eksplisit menyebut waktu berasal dari server (`Waktu tersisa (server)` / `Time left (server)`). |
| AC-04 | **PASS** | Copy Owner akurat: “Pilihan ganda dinilai otomatis; esai dinilai manual oleh Admin berdasarkan rubrik ilmiah pada tiap soal.” Tidak ada angka konfigurasi pada penjelasan, kolom, label, atau input grading. Nilai yang ditampilkan pada antrean adalah `row.score` yang diterima; jika null, UI menyatakan `Menunggu esai`. |
| AC-05 | **PASS secara inspeksi statis** | Dua file hanya mempertahankan fetch/route yang sudah ada untuk attempt, answer PATCH, submit, queue, claim, dan grade. Header CSRF tetap digunakan (`madevi_csrf` dan `madevi_owner_csrf`), auth/denied handling tetap ada, dan tidak ada import/rujukan migration, service, route handler, session, logout, atau token/CSS tema yang ditambahkan. Kontrak server/service dibaca read-only dan tidak diubah. Pemeriksaan runtime/diff repository tidak dilakukan. |

## Audit metrik

| ID | Hasil | Bukti |
|---|---|---|
| M-01 | **PASS — 0 literal aturan ditemukan** | Pencarian terarah pada dua komponen untuk `20 × 3`, `5 × maks`, `≥80`, `/20`, `/5`, `300`, `/8`, `0–8`, `25 wajib`, dan variasi `maks 8` tidak menghasilkan kecocokan. Angka yang tersisa adalah format waktu (`60`, `1000`, `2500`), textarea/UI (`5`, `10000`), posisi/ukuran SVG, dan jumlah aktual dari array; tidak dipresentasikan sebagai aturan assessment. |
| M-02 | **PASS — 2/2 parser bersih** | Babel parser dengan plugin `typescript` + `jsx` menghasilkan `BABEL_PARSE_OK` untuk `exam-attempt.tsx` dan `owner-exam-panel.tsx`; 0 diagnostic parser. |
| M-03 | **PASS secara inspeksi scope statis** | Hanya dua komponen locked yang dibaca sebagai target perubahan. Referensi endpoint, CSRF cookie, dan payload pada komponen tetap sesuai pola sebelumnya; service `exam.ts` dibaca sebagai kontrak read-only dan menunjukkan sumber policy/hasil tetap server-side. Tidak ada bukti statis perubahan route/API/auth/CSRF/logout/migration/theme dalam scope audit. Git diff, runtime, dan request tidak dijalankan. |

## Pemeriksaan khusus

- **Data server/policy dipertahankan:** tidak ada policy fallback baru, angka pengganti, fixture, atau inferensi konfigurasi. Poin PG yang tampil adalah `points_earned` dari attempt view, bukan `3` buatan UI; nilai esai adalah `score_given`/score server atau input Admin yang divalidasi server.
- **Question count:** semua count presentasi berasal dari `mcQuestions`/`essayQuestions` yang diterima. `total` pada dialog submit adalah penjumlahan array tersebut, bukan konstanta.
- **Timing:** countdown tetap berdasarkan `remainingSeconds` server dan deadline server. Tidak ada ambang “mendesak” baru maupun klaim bahwa angka tampilan adalah policy duration.
- **Copy grading Owner:** membedakan otomatis untuk pilihan ganda dan manual berbasis rubrik untuk esai; tidak mengklaim denominator, maksimum, atau pass threshold tertentu.
- **Parser safety:** kedua file berhasil diparse sebagai TSX. Tidak ada eksekusi aplikasi dilakukan, sehingga validitas tipe penuh dan perilaku browser tidak diklaim.

## BELUM-DIVERIFIKASI

- Rendering nyata pada policy assessment versi berbeda.
- Respons API aktual, auth/permission, CSRF/logout, persistence, dan perilaku timeout/autosubmit.
- Tampilan browser/visual dan full typecheck, lint, build, serta test runner.
- Diff Git repository penuh; kesimpulan AC-05/M-03 dibatasi pada inspeksi file scope, referensi kontrak read-only, dan checkpoint/lock yang tersedia.

**Kesimpulan Agent 3:** tidak ada FAIL statis pada AC-01–AC-05 atau M-01–M-03. Hasil ini adalah audit statis saja; status item tetap mengikuti `blueprint/INDEX.md` dan tidak diubah oleh laporan ini.
