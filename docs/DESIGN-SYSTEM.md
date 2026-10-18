# Panduan Design System Madevi

**Fase A2** — 18 Okt 2026

## Token CSS

Token terpusat di `src/styles/tokens.css`, dimuat pertama di `layout.tsx`.
Struktur 3 lapis:

1. **Primitive** (`--pr-*`): warna dasar, spacing 8pt, radius, tipografi
2. **Semantic** (`--accent`, `--text`, `--surface`, dll.): makna, bukan nilai mentah
3. **Component** (`--mdv-button-*`, dll.): spesifik komponen

### Aturan pakai

- Komponen baru WAJIB pakai token, bukan nilai hardcode.
- Warna: pakai `--accent`, `--text`, `--surface-*`, bukan `#0ea5e9` langsung.
- Spacing: pakai `--pr-space-*` (kelipatan 8pt).
- Ukuran proporsional: objek kecil → token kecil (`--pr-space-1/2`, `sm`),
  objek besar → token besar (`--pr-space-6/8`, `lg`).

## Komponen Reusable

Satu definisi per komponen di `src/components/ui/`, varian via props:

| Komponen | File | Varian |
|---|---|---|
| Button | `ui/button.tsx` | variant, size, asChild |
| Card | `ui/card.tsx` | variant (default/elevated/interactive/floating) |
| Badge | `ui/badge.tsx` | variant (6), size (sm/md/lg) |
| ParamSlider | `ui/param-slider.tsx` | label, unit, min/max/step |
| SimControls | `ui/sim-controls.tsx` | playing, onStep opsional |
| EmptyState | `ui/empty-state.tsx` | size (sm/md/lg) |
| Input/Dialog/Dropdown | `ui/input.tsx` dst. | standar |

CSS komponen baru di `src/styles/ui-components.css` — JANGAN tambah ke file lama.

## Duplikasi CSS (diketahui)

12 file CSS lama (~27.000 baris) punya duplikasi:
- `.sidebar`: 6 definisi
- `.home-space-card`: 5 definisi
- `.public-shell :is(...)`: 7 definisi

**Kebijakan**: jangan hapus massal (risiko merusak tema/responsif).
Konsolidasi bertahap: komponen baru pakai `ui-components.css` + token.
File lama disentuh hanya jika ada bug visual spesifik.
