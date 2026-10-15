# Template Item dan Acceptance Criteria

Setiap item material memakai satu file `qa/items/<ID>.md` atau section ekuivalen yang
direferensikan oleh `INDEX.md`.

```md
# <ID> — <nama>

## Scope dan dependency
- Tujuan pengguna:
- Batas perubahan:
- Dependency / blueprint terkait:
- File/kontrak diperkirakan:

## Acceptance criteria wajib
- [ ] AC-01 — hasil yang dapat diamati/dibuktikan
- [ ] AC-02 — security, state, atau kompatibilitas relevan

## Acceptance criteria terukur
| ID | Unit | Metode | Ambang | Hasil |
|---|---:|---|---:|---|
| M-01 | <n> | <perintah/inspeksi> | ≤1% minor, 0 critical/high | belum |

## Verifikasi yang diizinkan
- Statis:
- Runtime (jika Owner mengizinkan):
- Yang sengaja tidak dijalankan dan alasannya:

## Risiko dan rollback
- Risiko:
- Compatibility/migration:
- Recovery:
```

Agent 3 menulis hasil ke `qa/audits/<ID>.md`, bukan ke status item.
