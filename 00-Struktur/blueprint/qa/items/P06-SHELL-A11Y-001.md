# P06-SHELL-A11Y-001 — Public shell focus and reduced-motion contract

## Scope dan dependency
- **Tujuan pengguna:** keyboard users and reduced-motion users can open, use, and close the
  public search/sidebar shell without lost focus, hidden overlays, or information hidden by motion.
- **Bounded source scope:** `Madevi_Off/src/components/public-shell.tsx`,
  `Madevi_Off/src/components/header.tsx`, `Madevi_Off/src/components/sidebar.tsx`,
  `Madevi_Off/src/components/dialog-behavior.ts`, `Madevi_Off/src/styles/globals.css`, and
  `Madevi_Off/src/styles/interface-refresh.css`.
- **Dependency:** P-06 blueprint; `UX-REDESIGN-002` and `AMBIENT-001` PASS. `EMULATOR-001` is
  retained and not touched.
- **Exclusions:** owner shell, routes, API, service, auth/session, CSRF, migration, database,
  worker/solver, emulator, runtime telemetry, performance capture, and new theme contracts.

## Evidence and intended result
`Header` search and `Sidebar` use `useDialogBehavior` for initial focus, Escape, Tab loop, scroll
lock, and focus restore. `PublicShell` and shell CSS contain ambient motion and reduced-motion paths.
This item establishes one bounded accessibility contract without adding animation or inventing
performance numbers.

## Acceptance criteria
- [ ] **AC-01:** Search and sidebar have honest role/name/modal semantics; focus enters on open,
  Tab/Shift+Tab stays bounded, Escape closes, and focus restores only to a connected trigger or
  defined fallback.
- [ ] **AC-02:** `:focus-visible` remains visible for triggers, inputs, close controls, navigation,
  and panel controls; shell overlays do not clip it; scroll lock is dialog-scoped.
- [ ] **AC-03:** reduced motion disables meteor, parallax, decorative transitions/animations, and
  shell movement while labels, menus, results, dialogs, and errors remain available.
- [ ] **AC-04:** primary shell/dialog controls use the 44px product target token; dialog/sidebar
  overflow and breakpoint rules do not force horizontal document overflow.
- [ ] **AC-05:** only presentation/accessibility changes occur; route/API/auth/CSRF/persistence,
  emulator/worker/solver, data, and unrelated theme contracts remain unchanged.

## Metrics
| ID | Unit | Method | Threshold | Result |
|---|---:|---|---:|---|
| M-01 | 2 | Static inspect search and sidebar plus shared hook | 2/2 have role/name, focus entry, Escape, bounded Tab, restore path | belum |
| M-02 | 1 | Static shell selector/token inspect | 0 scoped focus-visible suppressions; all shell motion has reduced fallback | belum |
| M-03 | 3 | Static target token inspect | 3/3 control groups use token or >=44px, excluding documented non-primary controls | belum |
| M-04 | 3 | Static breakpoint/overflow inspect | 3/3 areas do not force viewport overflow | belum |
| M-05 | 0 | Performance evidence | No LCP/INP/CLS numbers invented; runtime remains BELUM-DIVERIFIKASI | belum |

## Allowed static verification and exclusions
- Allowed: reading/grep of ARIA and selectors; ref/hook inspection; focused TS/TSX/CSS parser
  checks if available without test/lint/build; token, media-query, z-index, overflow, min-height,
  and breakpoint inspection. Agent 3 records the audit in `blueprint/qa/audits/`.
- Not run/claimed: server, browser, screen reader, API/request, database, migration, test runner,
  lint, build, full typecheck, performance tooling, emulator, or background process.

## Risks and rollback
- Risks: an over-aggressive focus trap may affect nested settings/search; cascade may reduce focus
  contrast; broad reduced-motion rules may remove affordance; shell sizing may reflow Android.
- Compatibility: no migration or route/API/data change; retain `useDialogBehavior` as the shared
  focus helper and do not add a second overlay owner.
- Rollback: revert only the six locked source files; never revert `EMULATOR-001` files. Unproven
  findings remain PROSES/revision without a runtime claim.
