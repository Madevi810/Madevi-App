# Audit P06-SHELL-A11Y-001 — Public shell focus and reduced-motion contract

- **Item:** P06-SHELL-A11Y-001
- **Auditor:** Agent 3
- **Date:** 2026-09-28
- **Method:** Static source inspection, focused Babel parser inspection, and PostCSS parser inspection only.
- **Canonical implementation root confirmed:** `/sdcard/project/Madevi/Madevi_Off`
- **Locked source inspected:**
  `src/components/public-shell.tsx`, `src/components/header.tsx`,
  `src/components/sidebar.tsx`, `src/components/dialog-behavior.ts`,
  `src/styles/globals.css`, and `src/styles/interface-refresh.css`.
- **Overall disposition:** **REVISI — static finding on dialog focus fallback; other criteria are statically supported.**

## Verification boundary

No server, runtime, browser, visual viewport, keyboard/screen-reader, API/request,
database/migration, performance, test runner, lint, build, full typecheck, emulator,
worker/solver, or background process was run. Runtime/browser/screen-reader/performance/API/
database/test/lint/build/full-typecheck evidence remains **BELUM-DIVERIFIKASI**. No LCP,
INP, or CLS value is invented.

## Static parser result

| File | Result |
|---|---|
| `src/components/public-shell.tsx` | `BABEL_PARSE_OK` |
| `src/components/header.tsx` | `BABEL_PARSE_OK` |
| `src/components/sidebar.tsx` | `BABEL_PARSE_OK` |
| `src/components/dialog-behavior.ts` | `BABEL_PARSE_OK` |
| `src/styles/globals.css` | `POSTCSS_PARSE_OK` |
| `src/styles/interface-refresh.css` | `POSTCSS_PARSE_OK` |

## Acceptance criteria

### AC-01 — dialog semantics, entry, trap, Escape, and restoration: **REVISI**

- Search is a named modal dialog in `header.tsx:124-132` with `role="dialog"`,
  `aria-modal="true"`, an `aria-label`, and a `tabIndex={-1}`. It uses the shared hook
  with `searchInputRef` as initial focus and `searchBtnRef` as the return target
  (`header.tsx:115-120`).
- Sidebar is a named modal dialog in `sidebar.tsx:171-180`, and uses the shared hook for
  initial panel focus, Escape, and bounded Tab/Shift+Tab. Its menu and profile content has
  labelled navigation/tab/tabpanel structure (`sidebar.tsx:207-271`).
- `dialog-behavior.ts:81-110` handles Escape and wraps focus at both ends of the queried
  dialog subtree. The focus selector excludes disabled controls and `aria-hidden="true"`
  elements. Scroll locking is reference-counted (`:15-29`).
- Search has an explicit connected-trigger restoration path. `header.tsx:54-71` also has a
  second restoration effect, so the search trigger is restored after close when connected.
- **Finding:** the shared restore routine (`dialog-behavior.ts:44-53`) uses the previous
  element as its only fallback when `returnFocusRef` is absent. It focuses only when that
  element is connected; otherwise it silently leaves focus wherever it is. Sidebar invokes
  `useDialogBehavior` without `returnFocusRef` (`sidebar.tsx:75-78`) and supplies no defined
  fallback. Therefore the required “connected trigger or defined fallback” guarantee is not
  statically established for all sidebar open paths (including a custom event opener or a
  trigger removed during close).
- Sidebar settings has a return ref for its nested `SettingsPopup`, but the popup's
  implementation is outside this six-file lock and was not audited. The sidebar itself must
  still have an explicit connected-trigger/fallback contract.

**Required revision:** provide the sidebar hook a stable trigger ref where available and/or
an explicit connected fallback in the shared hook/consumer. Preserve the existing single
overlay owner and do not broaden the lock. Then re-audit AC-01.

### AC-02 — visible focus, overlay clipping, scoped scroll lock: **PASS statically**

- Global `:focus-visible` has a 3px outline and 2px offset (`globals.css:137-145`). The
  intentional `:focus:not(:focus-visible)` rule is a generic modality fallback, not a scoped
  shell suppression.
- Shell chrome controls get a 3px focus ring, 3px offset, and elevated stacking context
  (`interface-refresh.css:3666-3678`). Search inputs and form controls receive explicit
  focus-visible border/outline treatment (`:121-128`). Navigation cards retain a
  `:focus-visible` state (`:299-304` and later shell layers).
- Primary shell controls are not hidden by the shell's overflow rules: overlays are bounded
  with `max-width:100vw`, while sidebar only clips horizontal content and uses contained
  overscroll (`interface-refresh.css:3680-3688`). This is static evidence only; actual
  viewport clipping remains unverified.
- Scroll lock is owned by `useDialogBehavior`, reference-counted, and restored to the prior
  body overflow value (`dialog-behavior.ts:15-29,69-79`).

### AC-03 — reduced motion and information availability: **PASS statically**

- `public-shell.tsx:35-118` checks `prefers-reduced-motion`, document visibility, route/theme
  state, and cancels meteor timers/WAAPI animations. The parallax listener does not update the
  custom property when reduced motion is active (`:93-107`).
- Global reduced-motion rules disable animation/transition and set scrolling to `auto`
  (`globals.css:147-163`). Shell-specific rules disable movement for header, sidebar, search,
  and menu cards (`interface-refresh.css:3690-3696`). Additional Madevi On rules stop meteor,
  star, atlas, scan, and decorative motion (`interface-refresh.css:5034-5048,6060-6077`).
- The JSX keeps labels, menus, results, dialogs, and error/status content in the DOM; motion
  controls are decorative or presentation-only. No static evidence indicates that reduced
  motion hides shell information.

### AC-04 — 44px target token and overflow/breakpoints: **PASS statically**

- Global button-like controls use `min-height:44px` (`globals.css:41-47`). The shell's search,
  menu, settings, and close controls explicitly use `var(--touch-target-min, 44px)` for both
  dimensions (`interface-refresh.css:3668-3671`). Shell buttons, inputs, and `.button` use
  `2.75rem` minimums in the finishing layer (`:5150-5162`).
- Search/sidebar surfaces use `min-width:0`, `max-width:100vw`; sidebar uses horizontal
  clipping and contained overscroll (`interface-refresh.css:3680-3688`). Search result/filter
  descendants also set `min-width:0` (`:3698-3705`), and long shell text has wrapping rules.
- `body` uses `overflow-x:clip` (`globals.css:30-39`), and the shell CSS contains responsive
  width rules and no locked-width requirement for these overlays. This supports no forced
  horizontal document overflow by static inspection, not by viewport testing.
- The 44px evidence applies to primary shell controls. Small visual/icon variants elsewhere
  (`.mdv-button--sm`) are not treated as primary shell controls.

### AC-05 — presentation/accessibility-only scope: **PASS statically**

- The implementation paths inspected are all under the canonical `Madevi_Off` root and match
  the six-file lock in the QA item/checkpoint. No `web/src` or other wrong-scope path was used
  as implementation evidence. The prior wrong-scope rejection is not used as evidence.
- The inspected changes/contracts are limited to dialog behavior, focus semantics, target sizing,
  overflow, and motion/presentation CSS. No route, API/request, auth/session/CSRF, persistence,
  migration/database, emulator/worker/solver, or unrelated theme contract is evidenced here.
- `SearchOverlay` and `SettingsPopup` are referenced dependencies outside the six-file lock;
  they were not modified or claimed as audited implementation scope. Their runtime behavior
  must not be inferred from this report.

## Metrics

| ID | Result | Static basis |
|---|---|---|
| **M-01** | **REVISI (1/2 complete)** | Search meets role/name, entry, Escape, bounded Tab, and explicit connected return ref. Sidebar meets role/name, entry, Escape, and bounded Tab, but lacks a defined fallback/explicit return ref for every close path. |
| **M-02** | **PASS (static)** | No scoped focus-visible suppression found in the six files; shell controls, fields, navigation, and panel controls have visible focus paths. All inspected shell motion has reduced-motion CSS/JS coverage. |
| **M-03** | **PASS (3/3 static groups)** | Header chrome, sidebar chrome, and primary button/input controls use 44px or `2.75rem`/token minimums. |
| **M-04** | **PASS (3/3 static areas)** | Document body, sidebar, and search overlay/result surfaces use clipping or bounded/min-width-safe rules; no locked-width shell rule was found that forces horizontal overflow. |
| **M-05** | **BELUM-DIVERIFIKASI as required** | No performance measurement was run and no LCP/INP/CLS numbers were invented. |

## Handoff

This is a static audit only. AC-02–AC-05 and M-02–M-04 are statically supported; AC-01/M-01
require revision for the sidebar's absent defined focus fallback. Keep the item `PROSES` until
the bounded revision is audited. Runtime/browser/screen-reader, viewport, performance, API,
database, test, lint, build, and full typecheck gates remain **BELUM-DIVERIFIKASI**.
