import { type RefObject, useEffect, useState } from 'react';
import { useLatest } from './useLatest';

/** Focus moves into a dialog after this long, once it has started to appear. */
const FOCUS_DELAY_MS = 30;
/** What Tab can land on inside a dialog. */
const FOCUSABLE = 'a[href], button:not([disabled])';

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
    if (open) {
      setMounted(true);
    }
  }

  useEffect(() => {
    if (open || !mounted) {
      return undefined;
    }
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
  useScrollLock(active);
  useFocusHandoff(active, initialFocusRef);
  useDialogKeys(active, containerRef, { onClose, onKeyDown });
}

/** Stops the page behind from scrolling while `active`. */
function useScrollLock(active: boolean) {
  useEffect(() => {
    if (!active) {
      return undefined;
    }
    const root = document.documentElement;
    const previous = root.style.overflow;
    root.style.overflow = 'hidden';
    return () => {
      root.style.overflow = previous;
    };
  }, [active]);
}

/** Moves focus to `target` while `active`, and back to whatever had it before afterwards. */
function useFocusHandoff(active: boolean, target: RefObject<HTMLElement | null>) {
  useEffect(() => {
    if (!active) {
      return undefined;
    }
    const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const timer = window.setTimeout(() => target.current?.focus({ preventScroll: true }), FOCUS_DELAY_MS);
    return () => {
      window.clearTimeout(timer);
      opener?.focus({ preventScroll: true });
    };
  }, [active, target]);
}

/** While `active`: Escape closes, Tab stays inside the container, and other keys go to `onKeyDown`. */
function useDialogKeys(
  active: boolean,
  containerRef: RefObject<HTMLElement | null>,
  handlers: Pick<ModalOptions, 'onClose' | 'onKeyDown'>,
) {
  const latest = useLatest(handlers);
  useEffect(() => {
    if (!active) {
      return undefined;
    }
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        latest.current.onClose();
        return;
      }
      if (event.key === 'Tab') {
        trapFocus(event, containerRef.current);
      }
      latest.current.onKeyDown?.(event);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [active, containerRef, latest]);
}

/** Wraps Tab from the last control back to the first (and Shift+Tab the other way). */
function trapFocus(event: KeyboardEvent, container: HTMLElement | null) {
  const focusable = container ? [...container.querySelectorAll<HTMLElement>(FOCUSABLE)] : [];
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (!container || !first || !last) {
    return;
  }
  const current = document.activeElement;
  const leavingBackward = event.shiftKey && (current === first || !container.contains(current));
  const leavingForward = !event.shiftKey && current === last;
  if (leavingBackward) {
    event.preventDefault();
    last.focus();
  }
  if (leavingForward) {
    event.preventDefault();
    first.focus();
  }
}
