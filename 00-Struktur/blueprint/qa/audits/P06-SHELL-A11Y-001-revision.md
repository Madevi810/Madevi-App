# Audit P06-SHELL-A11Y-001 — Revision

- **Item:** P06-SHELL-A11Y-001
- **Auditor:** Agent 3
- **Date:** 2026-09-28
- **Method:** Static source inspection, focused Babel parser inspection, and PostCSS parser inspection only.
- **Canonical implementation root:** `/sdcard/project/Madevi/Madevi_Off`
- **Locked source inspected:**
  `src/components/public-shell.tsx`, `src/components/header.tsx`,
  `src/components/sidebar.tsx`, `src/components/dialog-behavior.ts`,
  `src/styles/globals.css`, and `src/styles/interface-refresh.css`.
- **Overall disposition:** **PASS secara statis** for the bounded AC/M checks; runtime and other
  deferred verification remain **BELUM-DIVERIFIKASI**.

## Verification boundary

No server, runtime, browser, visual viewport, keyboard/screen-reader, API/request, database,
migration, performance, test runner, lint, build, full typecheck, emulator, worker/solver, or
background process was run. Runtime/browser/screen-reader/performance/API/database/test/lint/
build/full-typecheck evidence remains **BELUM-DIVERIFIKASI**. No LCP, INP, or CLS value is
invented.

## Static parser result

| File | Result |
|---|---|
| `src/components/public-shell.tsx` | `BABEL_PARSE_OK` |
| `src/components/header.tsx` | `BABEL_PARSE_OK` |
| `src/components/sidebar.tsx` | `BABEL_PARSE_OK` |
| `src/components/dialog-behavior.ts` | `BABEL_PARSE_OK` |
| `src/styles/globals.css` | `POSTCSS_PARSE_OK` |
| `src/styles/interface-refresh.css` | `POSTCSS_PARSE_OK` |

## Revision finding and AC-01 re-audit

The prior finding is resolved in the locked canonical files. Sidebar now uses the same shared
dialog restoration path as search:

- `sidebar.tsx:46-48` defines a stable `sidebarFallbackFocus` callback returning `document.body`.
- `sidebar.tsx:76-81` supplies that callback to `useDialogBehavior` as `fallbackFocus`, including
  custom-event opening through `madevi:open-sidebar` (`sidebar.tsx:125-132`).
- `dialog-behavior.ts:44-53` first prefers `returnFocusRef.current` when it is connected, then
  invokes the consumer fallback, then uses the captured previous focus element. The final target
  is focused only when `target.isConnected` is true.
- Search retains its connected trigger ref at `header.tsx:40,115-120`; its existing close effect
  also restores the connected trigger at `header.tsx:54-71`.

This establishes the required connected-trigger-or-defined-fallback contract for both shell
dialogs without adding a second overlay owner. Search and sidebar retain named modal semantics,
initial focus, Escape handling, and the shared bounded Tab/Shift+Tab handler. Sidebar's nested
settings popup remains an external dependency and is not claimed as audited implementation scope;
the sidebar itself now has the required fallback contract.

### AC-01 — dialog semantics, entry, trap, Escape, and restoration: **PASS statically**

Search is a named `role="dialog"` with `aria-modal="true"`, an accessible label, and a focusable
dialog root (`header.tsx:122-132`). Its input is the initial focus target and its connected search
button is the return target (`header.tsx:115-120`). Sidebar is a named modal dialog with a focusable
root and labelled tab/navigation structure (`sidebar.tsx:174-184,210-274`). The shared hook locks
scroll with reference counting, focuses the initial target, closes on Escape, and wraps both ends
of the dialog focusable list (`dialog-behavior.ts:15-29,72-115`). Restoration now checks a
connected trigger where supplied and falls back to connected `document.body` for sidebar paths.

### AC-02 — visible focus, overlay clipping, scoped scroll lock: **PASS statically**

Global `:focus-visible` retains a visible 3px outline with offset (`globals.css:137-145`). Shell
chrome, inputs, navigation cards, dialog controls, and panel controls have explicit focus-visible
paths in the locked CSS, including the finishing shell rules (`interface-refresh.css:121-128,
299-304,3666-3688` and related selectors). The intentional generic
`:focus:not(:focus-visible)` rule is not a shell focus suppression. Overlay sizing uses bounded
width/min-width-safe rules; sidebar clips only horizontal content and uses contained overscroll.
Document scroll lock is owned by the shared dialog hook and restores the prior body overflow.
Actual focus visibility and viewport clipping remain runtime-unverified.

### AC-03 — reduced motion and information availability: **PASS statically**

`public-shell.tsx:35-118` gates meteor timers/WAAPI motion and parallax updates on reduced-motion,
visibility, route/theme state, and cleanup. `globals.css:147-163` disables scoped animation and
transition motion under `prefers-reduced-motion: reduce`; shell-specific rules cover header,
sidebar, search, and menu-card movement (`interface-refresh.css:3690-3696`), with additional
ambient/decorative coverage in the locked sheet. Labels, menus, results, dialogs, and error/status
content remain represented by JSX and are not hidden by the reduced-motion rules.

### AC-04 — 44px target token and overflow/breakpoints: **PASS statically**

Global button-like controls use the touch-target minimum (`globals.css:41-47,257-258`). Primary
public-shell search, menu, settings, and close controls use
`var(--touch-target-min, 44px)` (`interface-refresh.css:3666-3671`), with finishing-layer
`2.75rem` minimums for shell controls/inputs. Search and sidebar surfaces use `min-width: 0`,
`max-width: 100vw`, safe descendant wrapping, and bounded overflow rules
(`interface-refresh.css:3680-3705`). The document body uses `overflow-x: clip` (`globals.css:30-39`),
and responsive breakpoint rules do not introduce a locked-width overlay. Static inspection cannot
prove behavior at actual viewport sizes.

### AC-05 — presentation/accessibility-only scope and non-overlap: **PASS statically**

Evidence is confined to the six locked canonical source files under `Madevi_Off`. The revision
adds only shared focus restoration/fallback behavior and the sidebar consumer fallback; the
remaining inspected contracts are dialog semantics, focus styling, target sizing, overflow, and
motion presentation. No route, API/request, auth/session, CSRF, persistence/data, migration,
database, or unrelated theme contract is evidenced as changed or required.

There is no overlap with `EMULATOR-001`: none of its locked emulator page/component/module CSS,
emulator library, worker/solver, utilities workspace API, migration, or unit-test paths is among
the six inspected files, and no emulator behavior is claimed here.

## Metrics

| ID | Result | Static basis |
|---|---|---|
| **M-01** | **PASS (2/2 static)** | Search and sidebar each have role/name, initial focus, Escape, bounded Tab/Shift+Tab, and restoration. Search uses a connected trigger ref; sidebar uses the shared connected-target check plus defined `document.body` fallback. |
| **M-02** | **PASS (static)** | No scoped focus-visible suppression found in the six locked files; shell focus paths and reduced-motion CSS/JS coverage are present. |
| **M-03** | **PASS (3/3 static groups)** | Header chrome, sidebar chrome, and primary shell button/input groups use the 44px token or equivalent `2.75rem` minimum. |
| **M-04** | **PASS (3/3 static areas)** | Body, sidebar, and search/overlay result surfaces use clipping or bounded/min-width-safe rules; no locked-width shell rule forcing horizontal document overflow was found. |
| **M-05** | **BELUM-DIVERIFIKASI** | No performance measurement was run; no LCP/INP/CLS values were invented. |

## Handoff

The prior sidebar restoration finding is resolved by the shared `fallbackFocus` contract and its
connected-target guard. AC-01 through AC-05 and M-01 through M-04 pass on the permitted static
evidence. M-05 remains **BELUM-DIVERIFIKASI**, as do runtime/browser/screen-reader, viewport,
performance, API, database, test, lint, build, and full typecheck gates. No source, QA item,
guardrail, INDEX, checkpoint, or `EMULATOR-001` file was modified by this audit.
