import { type CSSProperties, useCallback, useContext } from 'react';
import { classNames } from '../lib/classNames';
import type { RevealKey } from '../lib/reveal';
import { type RevealHandlers, RevealContext } from '../providers/revealContext';
import { useLatest } from './useLatest';

/**
 * Marks a block for scroll reveal. Put the ref and class on the block, adding its own classes alongside:
 *   const reveal = useReveal('contact-heading');
 *   <div ref={reveal.ref} className={classNames(reveal.className, styles.heading)}>…</div>
 */
export function useReveal(key: RevealKey, handlers: RevealHandlers = {}) {
  const context = useContext(RevealContext);
  if (!context) {
    throw new Error('useReveal must be used inside <RevealProvider>');
  }
  const { register, classes } = context;

  const latest = useLatest(handlers);

  const ref = useCallback(
    (element: HTMLElement | null) => {
      if (!element) {
        return undefined;
      }
      return register(key, {
        element,
        onReveal: () => latest.current.onReveal?.(),
        onHide: () => latest.current.onHide?.(),
      });
    },
    [key, latest, register],
  );

  return { ref, className: classNames('rv', classes[key]) };
}

/** True when reveals are running (so the page root should carry `.sr`). */
export function useRevealEnabled(): boolean {
  return useContext(RevealContext)?.enabled ?? false;
}

/** Each stagger step inside a revealed block starts this much later. */
const STEP_MS = 60;

/** Stagger for a child inside a revealed block: step n starts n × 60 ms after the block. */
export function revealDelay(step: number): CSSProperties {
  return { '--rvd': `${step * STEP_MS}ms` };
}
