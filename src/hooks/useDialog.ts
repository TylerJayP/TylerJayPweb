import { useEffect, useRef, useState, type RefObject } from 'react';

/**
 * Keeps a dialog mounted while its closing animation plays: `open` flips immediately,
 * `mounted` follows `exitMs` later, and `closing` is true in between.
 */
export function useExitAnimation(open: boolean, exitMs: number) {
  const [mounted, setMounted] = useState(open);
  const [wasOpen, setWasOpen] = useState(open);

  // Mount as soon as it opens (adjusting state during render, as React recommends for derived state).
  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) setMounted(true);
  }

  useEffect(() => {
    if (open || !mounted) return;
    const timer = window.setTimeout(() => setMounted(false), exitMs);
    return () => window.clearTimeout(timer);
  }, [open, mounted, exitMs]);

  return { mounted, closing: mounted && !open };
}

interface ModalOptions {
  /** The dialog element; Tab stays inside it. */
  containerRef: RefObject<HTMLElement | null>;
  /** Gets focus when the dialog opens (usually its close button). */
  initialFocusRef: RefObject<HTMLElement | null>;
  onClose: () => void;
  /** Extra keys, e.g. arrows in the lightbox. */
  onKeyDown?: (event: KeyboardEvent) => void;
}

/**
 * Standard modal behavior while `active`: the page behind stops scrolling, focus moves in and is trapped,
 * Escape closes, and focus returns to whatever opened the dialog afterwards.
 */
export function useModal(
  active: boolean,
  { containerRef, initialFocusRef, onClose, onKeyDown }: ModalOptions,
) {
  const handlers = useRef({ onClose, onKeyDown });
  useEffect(() => {
    handlers.current = { onClose, onKeyDown };
  });

  useEffect(() => {
    if (!active) return;
    const opener = document.activeElement as HTMLElement | null;
    const root = document.documentElement;
    const previousOverflow = root.style.overflow;
    root.style.overflow = 'hidden';
    const focusTimer = window.setTimeout(() => initialFocusRef.current?.focus({ preventScroll: true }), 30);

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handlers.current.onClose();
        return;
      }
      if (event.key === 'Tab') trapFocus(event, containerRef.current);
      handlers.current.onKeyDown?.(event);
    };
    window.addEventListener('keydown', onKey);

    return () => {
      window.clearTimeout(focusTimer);
      window.removeEventListener('keydown', onKey);
      root.style.overflow = previousOverflow;
      opener?.focus?.({ preventScroll: true });
    };
  }, [active, containerRef, initialFocusRef]);
}

function trapFocus(event: KeyboardEvent, container: HTMLElement | null) {
  if (!container) return;
  const focusable = [...container.querySelectorAll<HTMLElement>('a[href], button:not([disabled])')];
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (!first || !last) return;
  const current = document.activeElement;
  if (event.shiftKey && (current === first || !container.contains(current))) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && current === last) {
    event.preventDefault();
    first.focus();
  }
}
