'use client';

import { useCallback, useEffect, useRef } from 'react';
import type { KeyboardEvent as ReactKeyboardEvent, RefObject } from 'react';

const FOCUSABLE = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

let scrollLockCount = 0;
let overflowBeforeLock = '';

function lockDocumentScroll() {
  if (scrollLockCount === 0) {
    overflowBeforeLock = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
  }
  scrollLockCount += 1;
}

function unlockDocumentScroll() {
  scrollLockCount = Math.max(0, scrollLockCount - 1);
  if (scrollLockCount === 0) document.body.style.overflow = overflowBeforeLock;
}

function scheduleFocus(callback: () => void) {
  if (typeof globalThis.requestAnimationFrame === 'function') {
    globalThis.requestAnimationFrame(callback);
    return;
  }
  globalThis.setTimeout(callback, 0);
}

function focusSoon(element: HTMLElement | null) {
  if (!element) return;
  scheduleFocus(() => element.focus());
}

function restoreFocusSoon(
  returnFocusRef: RefObject<HTMLElement | null> | undefined,
  fallback: HTMLElement | null,
  definedFallback: (() => HTMLElement | null) | undefined,
) {
  scheduleFocus(() => {
    const candidate = returnFocusRef?.current;
    const target = candidate?.isConnected ? candidate : definedFallback?.() ?? fallback;
    if (target?.isConnected) target.focus();
  });
}

/**
 * Trap Tab/Shift+Tab secara deterministik di dalam dialog.
 *
 * Catatan: querySelectorAll('button, a, input, ...') TIDAK menjamin urutan
 * tababilitas karena elemen dengan tabIndex positif didahulukan oleh browser
 * sesuai nilai tabIndex-nya, baru urutan DOM. Karena itu di sini kita memakai
 * Comparator HTML "tabindex" (0/positif) agar loop fokus selalu deterministik.
 */
function tabOrderedFocusables(root: HTMLElement | null): HTMLElement[] {
  if (!root) return [];
  const elements = Array.from(
    root.querySelectorAll<HTMLElement>(FOCUSABLE),
  ).filter(
    (element) => element.tabIndex >= 0 && element.getAttribute('aria-hidden') !== 'true',
  );
  return elements.sort((a, b) => {
    const ta = a.tabIndex;
    const tb = b.tabIndex;
    if (ta !== tb) return ta - tb; // tabindex positif duluan, lalu urutan DOM
    return 0; // stabil sort: pertahankan urutan DOM
  });
}

export function useDialogBehavior<T extends HTMLElement>({
  open,
  onClose,
  initialFocusRef,
  returnFocusRef,
  fallbackFocus,
}: {
  open: boolean;
  onClose: () => void;
  initialFocusRef?: RefObject<HTMLElement | null>;
  returnFocusRef?: RefObject<HTMLElement | null>;
  fallbackFocus?: () => HTMLElement | null;
}) {
  const dialogRef = useRef<T>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;
    previousFocusRef.current = returnFocusRef?.current ?? (document.activeElement as HTMLElement);
    lockDocumentScroll();
    focusSoon(initialFocusRef?.current ?? dialogRef.current);

    return () => {
      unlockDocumentScroll();
      restoreFocusSoon(returnFocusRef, previousFocusRef.current, fallbackFocus);
    };
  }, [fallbackFocus, initialFocusRef, open, returnFocusRef]);

  const onKeyDown = useCallback(
    (event: ReactKeyboardEvent<T>) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        event.stopPropagation();
        onClose();
        return;
      }
      if (event.key !== 'Tab') return;

      const focusable = tabOrderedFocusables(dialogRef.current);
      if (focusable.length === 0) {
        event.preventDefault();
        dialogRef.current?.focus();
        return;
      }

      // Jika fokus berada di luar dialog (mis. tombol header/sidebar yang
      // juga dirender di pohon React induk), kembalikan ke dalam dialog.
      const insideDialog = dialogRef.current?.contains(document.activeElement) ?? false;
      if (!insideDialog) {
        event.preventDefault();
        (event.shiftKey ? focusable.at(-1) : focusable[0])?.focus();
        return;
      }

      const first = focusable[0]!;
      const last = focusable.at(-1)!;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    },
    [onClose],
  );

  return { dialogRef, onKeyDown };
}
