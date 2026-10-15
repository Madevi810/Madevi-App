# Supplemental Audit — EMULATOR-001 Live Announcement Wiring

**Tanggal:** 2026-09-28  
**Auditor:** Agent 3 Auditor  
**Scope:** only the latest live-announcement enhancement in
`/sdcard/project/Madevi/Madevi_Off/src/components/circuit-emulator.tsx`, with its
existing visually-hidden CSS rule in
`/sdcard/project/Madevi/Madevi_Off/src/components/circuit-emulator.module.css`.

## Verification limits

- Static source inspection and call-site review only.
- Parser safety is recorded from the implementation checkpoint: Babel TSX parser
  passed (`BABEL_PARSE_OK`). No source parser/test runner was rerun here.
- No server, browser, API, database, migration, test runner, lint, build, full
  typecheck, or screen-reader verification was performed.
- Runtime/browser, screen-reader, and full typecheck remain
  **BELUM-DIVERIFIKASI**.
- This audit does not modify source, INDEX, QA item, guardrail, or checkpoint.

## Disposition

| Check | Result | Static evidence |
|---|---|---|
| Exactly one new announcement region | **PASS** | One new `liveAnnouncement` state and one rendered announcement node at `circuit-emulator.tsx:957`. |
| `aria-live`/status semantics with no duplicate status | **FAIL** | The new node has `role="status" aria-live="polite" aria-atomic="true"`, but the same component also renders `role="status"` at the solver pill (`788`) and workspace status (`828`). `role="status"` carries implicit polite live semantics, so there are three status/live regions, not one. |
| Visually hidden accessibility | **PASS** | The new node uses `styles.srOnly`; CSS clips it, constrains it to 1px, hides overflow, and prevents wrapping (`circuit-emulator.module.css:123-130`). It is not `display:none`/`visibility:hidden`. |
| Bilingual content | **PASS** | Announcement branches consistently use `isId` and provide Indonesian/English text for selection, wire mode, first terminal, wire creation, undo, redo, and deletion (`162-182`, `267-285`, `434-476`, `511-531`, `846-855`). |
| Discrete actions | **PASS** | Selection, wire-mode toggling, first-terminal selection, wire creation, undo/redo, and component/wire deletion explicitly call `announce`/`announceSelection`. The deletion paths share `removeSelection()`. |
| No drag/re-render announcement spam | **PASS statically** | Pointer drag handlers update circuit/selection but contain no announcement call (`483-509`). Ordinary `commitCircuit`/render paths also do not call `announce`; announcements occur only at explicit discrete handlers. Actual browser event sequencing remains unverified. |
| No solver/API/history changes | **PASS** | The enhancement adds announcement state/helpers/call sites only. Solver worker calls, persistence payloads/API calls, and history mutation paths are not changed by the live wiring. |
| Parser safety | **PASS** | Checkpoint records `BABEL_PARSE_OK` for the modified TSX; the JSX/TS additions are structurally bounded to the component. |

## Finding and minimal revision

### FAIL-LIVE-01 — Multiple implicit live/status regions

The new announcement node is correctly configured, but `statusPill` and
`workspaceStatus` retain `role="status"`. This duplicates polite status/live
semantics and can cause assistive technology to announce solver/workspace updates
alongside the intended discrete-action channel. The checkpoint’s claim of exactly
one live announcement region is therefore not satisfied by the current source.

**Minimal revision:** keep the single hidden node at line 957 as the only
`role="status"`/`aria-live` announcement channel for this enhancement, and remove
`role="status"` from the visible solver pill and workspace-status paragraph (or
otherwise make those visible display elements explicitly non-live without adding
another status region). Preserve their visual text and existing state logic.

## Final disposition

**FAIL — supplemental static audit of the live announcement wiring.** All bounded
announcement content/action, bilingual, hidden-accessibility, no-drag-spam,
scope-preservation, and parser checks pass statically. The audit cannot pass the
“exactly one/no duplicate status” requirement until the two additional
`role="status"` elements are made non-live. Runtime/browser, screen-reader, and
full typecheck verification remain **BELUM-DIVERIFIKASI**.
