import { useCallback, useEffect, useRef, useState } from 'react';
import { type RevealKey, shownClasses, staggerStep } from '../lib/reveal';

/** Changes from one scroll are gathered for this long, so blocks that arrive together stagger. */
const BATCH_MS = 30;
/** After this long a block's animation has finished, and it is marked settled. */
const SETTLE_MS = 2800;

interface Shown {
  stagger: number;
  scrollingUp: boolean;
}

type Classes = Partial<Record<RevealKey, string>>;

/**
 * Keeps track of which blocks are showing and turns that into their classes. Changes are batched, so
 * blocks that arrive in the same moment stagger instead of all moving at once.
 */
export function useShownBlocks() {
  const [classes, setClasses] = useState<Classes>({});
  const shown = useRef(new Map<RevealKey, Shown>());
  const settled = useRef(new Set<RevealKey>());
  const settleTimers = useRef(new Map<RevealKey, number>());
  const batchSize = useRef(0);
  const flushTimer = useRef(0);

  /** Publishes the current classes once the batch closes. */
  const flush = useCallback(() => {
    if (flushTimer.current) {
      return;
    }
    flushTimer.current = window.setTimeout(() => {
      flushTimer.current = 0;
      batchSize.current = 0;
      const next: Classes = {};
      shown.current.forEach((block, key) => {
        next[key] = shownClasses({ ...block, settled: settled.current.has(key) });
      });
      setClasses(next);
    }, BATCH_MS);
  }, []);

  const settleLater = useCallback(
    (key: RevealKey) => {
      window.clearTimeout(settleTimers.current.get(key));
      const timer = window.setTimeout(() => {
        if (shown.current.has(key)) {
          settled.current.add(key);
          flush();
        }
      }, SETTLE_MS);
      settleTimers.current.set(key, timer);
    },
    [flush],
  );

  /** Shows a block. Returns false if it was already showing. */
  const show = useCallback(
    (key: RevealKey, scrollingUp: boolean) => {
      if (shown.current.has(key)) {
        return false;
      }
      shown.current.set(key, { stagger: staggerStep(batchSize.current), scrollingUp });
      batchSize.current += 1;
      settleLater(key);
      flush();
      return true;
    },
    [flush, settleLater],
  );

  /** Hides a block so it plays again next time. Returns false if it wasn't showing. */
  const hide = useCallback(
    (key: RevealKey) => {
      if (!shown.current.delete(key)) {
        return false;
      }
      settled.current.delete(key);
      window.clearTimeout(settleTimers.current.get(key));
      flush();
      return true;
    },
    [flush],
  );

  /** Drops a block that has left the page, without animating anything. */
  const forget = useCallback((key: RevealKey) => {
    shown.current.delete(key);
    settled.current.delete(key);
  }, []);

  const shownKeys = useCallback(() => [...shown.current.keys()], []);

  useEffect(() => {
    const timers = settleTimers.current;
    return () => {
      window.clearTimeout(flushTimer.current);
      timers.forEach((id) => window.clearTimeout(id));
    };
  }, []);

  return { classes, show, hide, forget, shownKeys };
}
