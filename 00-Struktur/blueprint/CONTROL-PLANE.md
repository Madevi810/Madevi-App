# Control Plane 5-Agent Madevi

## Prinsip operasi

Lima peran membentuk satu sistem: **Rencana → Eksekusi → Audit → Revisi → Kontrol**.
Mereka dapat berjalan sebagai agent fisik terpisah bila slot tersedia atau sebagai peran
berurutan oleh satu agent. Peran dan file otoritatifnya tetap sama; tidak ada asumsi bahwa lima
proses selalu hidup bersamaan.

Agent 1 adalah jalur prioritas yang terus memperkaya blueprint selama runner aktif. Ia dapat
berjalan serentak dengan siklus Agent 2–5 hanya pada dokumen draft/backlog dan area baca yang
tidak mengganggu lock. Agent 5 menilai usul matang; Agent 2 langsung mengeksekusi item yang
sudah aktif dan siap. Perencanaan baru tidak boleh menahan pekerjaan aman yang telah dirancang,
dan ide baru tidak menyela implementasi/audit yang sedang berjalan.

| Peran | Mandat | Boleh menulis | Tidak boleh |
|---|---|---|---|
| Agent 1 — Perencana | Menyusun satu hasil ringkas per bidang dan mencatat kandidat baru. | `../memory/BACKLOG.md`, draft blueprint tanpa status aktif. | Mengubah source, lock, atau rencana aktif. |
| Agent 2 — Eksekusi | Membaca item/QA lalu membuat perubahan ujung-ke-ujung. | Source dalam lock, bukti implementasi, `INDEX.md` untuk `PROSES`. | Mengaudit dirinya atau mengubah guardrail. |
| Agent 3 — Audit | Memeriksa source terhadap blueprint dan acceptance criteria. | `qa/audits/<ID>.md`. | Mengubah source atau status INDEX. |
| Agent 4 — Audit-Revisi | Menutup finding Agent 3 sampai ambang lulus. | Source dalam lock, bukti revisi, `INDEX.md` untuk `REVISI`/`PASS`. | Mengubah guardrail atau mengabaikan finding. |
| Agent 5 — Kontrol | Menegakkan guardrail, lock, konflik, escalasi, dan checkpoint. | `INDEX.md` untuk keputusan supervisor, `../memory/DECISIONS.md`, checkpoint. | Menyelinap mengerjakan item yang sedang ia awasi. |

## Batas yang dapat dijalankan dengan jujur

- Owner memulai atau menyediakan runner untuk sistem. Setiap agent yang masuk melanjutkan
  checkpoint terakhir, bukan membuat ulang rencana.
- “Otonom” berarti tidak meminta persetujuan untuk langkah teknis yang aman dan telah dibatasi
  blueprint. Kerja latar belakang dan kelanjutan otomatis hanya berlangsung selama runner,
  perangkat, koneksi, dan kuota tersedia; dokumen ini sendiri tidak menjalankan proses.
- Agent 5 tidak dapat mendeteksi seluruh kondisi eksternal. Ia menggantikannya dengan checkpoint
  fase, review gate, dan prosedur graceful-stop di `WORKFLOW.md`.
- Setiap file QA dan item memakai ID. Tanpa ID, pekerjaan hanya ide backlog, bukan item aktif.

## Sumber kebenaran

| Kebutuhan | Lokasi kanonis |
|---|---|
| Status, urutan, dependency, lock | `INDEX.md` |
| Aturan yang tidak boleh dilanggar | `GUARDRAIL.md` |
| Blueprint domain | subfolder `desain/` sampai `security/` |
| Acceptance criteria/audit evidence | `qa/` |
| Fakta lingkungan dan source | `../memory/STATE.md` |
| Titik lanjut granular | `../memory/CHECKPOINT.md` |
| Ide Agent 1 | `../memory/BACKLOG.md` |
| Keputusan Agent 5/Owner | `../memory/DECISIONS.md` |
| Riwayat yang telah terjadi | `../memory/CHANGELOG.md`, `../memory/CYCLE-LOG.md` |

Rencana ringkas per bidang ada di [ROADMAP-DAN-DEPENDENSI.md](produk/ROADMAP-DAN-DEPENDENSI.md).
Rincian handoff dan bukti ada di [WORKFLOW.md](WORKFLOW.md). Pemetaan blueprint lama ada di
[LEGACY-MIGRATION.md](LEGACY-MIGRATION.md).
