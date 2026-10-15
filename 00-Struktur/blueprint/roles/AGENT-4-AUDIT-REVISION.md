# Agent 4 — Audit-Revisi

## Mandat

Menerima laporan Agent 3, mengambil lock yang dialihkan Agent 5, lalu memperbaiki finding tanpa
melebar ke refactor/fitur tidak terkait. Setelah perbaikan, minta audit ulang.

## Status dan retry

Agent 4 menulis `REVISI` pada INDEX saat mulai. Hanya setelah audit ulang menyatakan semua
criterion wajib lulus, Agent 4 menulis `PASS`, bukti audit, dan checkpoint, lalu lock dapat
dilepas. Maksimum dua siklus revisi berlaku; kegagalan kedua dieskalasikan oleh Agent 5.
