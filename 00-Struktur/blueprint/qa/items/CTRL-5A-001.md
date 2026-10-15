# CTRL-5A-001 — Migrasi Control-Plane 5-Agent

## Scope

Memindahkan operasi Madevi-Control dari protokol single-agent yang tersebar ke control-plane
lima peran, tanpa mengubah source aplikasi, kontrak runtime, data, atau database.

## Dependency dan batas file

- Dependensi: —
- Batas file: `Madevi-Control/**` saja.
- Tidak boleh: menjalankan runtime, npm, lint, build, test, server, database, ataupun mengubah
  `../Madevi_Off`.

## Acceptance criteria

| ID | Wajib | Kriteria | Bukti yang diizinkan |
|---|---|---|---|
| AC-01 | Ya | `blueprint/INDEX.md` menyatakan status sah, kewenangan perubahan, urutan aktif, dan lock tunggal. | inspeksi statis dokumen |
| AC-02 | Ya | Lima peran, batas kewenangan, koordinasi state, dan batas fisik sesi terdokumentasi. | `CONTROL-PLANE.md` + role card |
| AC-03 | Ya | Guardrail lintas produk/safety/runtime berlaku bagi seluruh peran. | `GUARDRAIL.md` + `AGENTS.md` |
| AC-04 | Ya | Siklus Agent 2 → 3 → 4, ambang 1%, dua retry, eskalasi, dan checkpoint dapat diikuti tanpa chat. | `WORKFLOW.md` |
| AC-05 | Ya | Blueprint lama yang relevan memiliki tujuan/peta migrasi, sedangkan protokol duplikat tidak lagi menjadi entrypoint aktif. | `LEGACY-MIGRATION.md` + root index |
| AC-06 | Ya | Memory menyatakan bahwa INDEX adalah sumber status tunggal dan menyimpan riwayat tanpa mengklaim status aktif. | `memory/STATE.md`, `CHECKPOINT.md`, `BACKLOG.md` |
| AC-07 | Ya | Tidak ada source aplikasi atau proses runtime yang disentuh/ diklaim berjalan. | batas file + changelog/checkpoint |

## Bukti implementasi

- Struktur dan dokumen control-plane dibuat di `blueprint/`.
- Perubahan status, keputusan, changelog, dan checkpoint hanya dicatat pada control-plane/memory.
- Audit statis dicatat di `../audits/CTRL-5A-001.md`.
