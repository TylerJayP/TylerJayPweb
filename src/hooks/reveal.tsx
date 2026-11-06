import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react';
import { prefersReducedMotion } from './usePrefersReducedMotion';

/**
 * Scroll reveals (the classes are styled in styles/reveal.css).
 *
 * A block shows once its top passes 70% of the way down the screen, or, scrolling up, once its bottom
 * passes the same line from the top. It resets when it is completely off-screen, so it plays again on
 * the way back. Blocks that arrive together stagger, and while the intro plays, blocks at the top wait
 * for the build terminal so everything comes in together.
 */

const TRIGGER_LINE = 0.7;
const SETTLE_MS = 2800;
const MAX_STAGGER = 4;

interface RevealHandlers {
  onReveal?: () => void;
  onHide?: () => void;
}

interface Registration extends RevealHandlers {
  element: HTMLElement;
}

interface RevealContextValue {
  /** False with reduced motion: everything just shows. */
  enabled: boolean;
  classes: Record<string, string>;
  register: (key: string, registration: Registration) => () => void;
}

const RevealContext = createContext<RevealContextValue | null>(null);

interface ProviderProps {
  children: ReactNode;
  /** While true, blocks near the top of the page wait (the intro is still playing). */
  held: boolean;
}

export function RevealProvider({ children, held }: ProviderProps) {
  const [enabled] = useState(() => !prefersReducedMotion());
  const [classes, setClasses] = useState<Record<string, string>>({});

  const entries = useRef(new Map<string, Registration>());
  const shown = useRef(new Map<string, string>());
  const settled = useRef(new Set<string>());
  const settleTimers = useRef(new Map<string, number>());
  const batchSize = useRef(0);
  const flushTimer = useRef(0);
  const lastY = useRef(0);
  const heldRef = useRef(held);

  const atTop = () => window.scrollY <= window.innerHeight * 0.6;

  const flush = useCallback(() => {
    if (flushTimer.current) return;
    flushTimer.current = window.setTimeout(() => {
      flushTimer.current = 0;
      batchSize.current = 0;
      const next: Record<string, string> = {};
      shown.current.forEach((stagger, key) => {
        next[key] = `rvin rvb${stagger}${settled.current.has(key) ? ' rvdone' : ''}`;
      });
      setClasses(next);
    }, 30);
  }, []);

  const reveal = useCallback(
    (key: string, scrollingUp: boolean) => {
      if (shown.current.has(key)) return;
      if (heldRef.current && atTop()) return;
      const stagger = Math.min(batchSize.current, MAX_STAGGER);
      batchSize.current += 1;
      shown.current.set(key, `${stagger}${scrollingUp ? ' rvup' : ''}`);
      window.clearTimeout(settleTimers.current.get(key));
      settleTimers.current.set(
        key,
        window.setTimeout(() => {
          if (!shown.current.has(key)) return;
          settled.current.add(key);
          flush();
        }, SETTLE_MS),
      );
      entries.current.get(key)?.onReveal?.();
      flush();
    },
    [flush],
  );

  const hide = useCallback(
    (key: string) => {
      if (!shown.current.delete(key)) return;
      settled.current.delete(key);
      window.clearTimeout(settleTimers.current.get(key));
      entries.current.get(key)?.onHide?.();
      flush();
    },
    [flush],
  );

  const check = useCallback(() => {
    const viewport = window.innerHeight;
    const y = window.scrollY;
    const scrollingUp = y < lastY.current - 1;
    if (Math.abs(y - lastY.current) > 1) lastY.current = y;
    const atEnd = y + viewport >= document.documentElement.scrollHeight - 4;
    const line = viewport * TRIGGER_LINE;

    entries.current.forEach(({ element }, key) => {
      const box = element.getBoundingClientRect();
      if (box.bottom <= 0 || box.top >= viewport) {
        hide(key);
        return;
      }
      const crossed = scrollingUp ? box.bottom > viewport - line : box.top < line;
      if (crossed || atEnd) reveal(key, scrollingUp);
    });
  }, [hide, reveal]);

  // Holding: what's on screen at the top goes back to waiting; letting go brings in everything visible.
  useEffect(() => {
    heldRef.current = held;
    if (!enabled) return;
    if (held) {
      if (atTop()) [...shown.current.keys()].forEach(hide);
    } else {
      const viewport = window.innerHeight;
      entries.current.forEach(({ element }, key) => {
        const box = element.getBoundingClientRect();
        if (box.bottom > 0 && box.top < viewport) reveal(key, false);
      });
    }
  }, [held, enabled, hide, reveal]);

  useEffect(() => {
    if (!enabled) return;
    let frame = 0;
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(() => ((frame = 0), check()));
    };
    lastY.current = window.scrollY;
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    schedule();
    const timers = settleTimers.current;
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      window.clearTimeout(flushTimer.current);
      timers.forEach((id) => window.clearTimeout(id));
    };
  }, [enabled, check]);

  const register = useCallback(
    (key: string, registration: Registration) => {
      entries.current.set(key, registration);
      requestAnimationFrame(check);
      return () => {
        entries.current.delete(key);
        shown.current.delete(key);
      };
    },
    [check],
  );

  const value = useMemo(() => ({ enabled, classes, register }), [enabled, classes, register]);
  return <RevealContext.Provider value={value}>{children}</RevealContext.Provider>;
}

/**
 * Marks a block for scroll reveal. Spread the result onto the block:
 *   const reveal = useReveal('contact');
 *   <div ref={reveal.ref} className={`rv ${reveal.className}`}>…</div>
 */
// eslint-disable-next-line react-refresh/only-export-components
export function useReveal(key: string, handlers: RevealHandlers = {}) {
  const context = useContext(RevealContext);
  if (!context) throw new Error('useReveal must be used inside <RevealProvider>');
  const { register, classes } = context;

  const handlerRef = useRef(handlers);
  useEffect(() => {
    handlerRef.current = handlers;
  });

  const ref = useCallback(
    (element: HTMLElement | null) => {
      if (!element) return;
      return register(key, {
        element,
        onReveal: () => handlerRef.current.onReveal?.(),
        onHide: () => handlerRef.current.onHide?.(),
      });
    },
    [key, register],
  );

  return { ref, className: classes[key] ?? '' };
}

/** True when reveals are running (so the page root should carry `.sr`). */
// eslint-disable-next-line react-refresh/only-export-components
export function useRevealEnabled(): boolean {
  return useContext(RevealContext)?.enabled ?? false;
}

/** Stagger for a child inside a revealed block: step n starts n × 60 ms after the block. */
// eslint-disable-next-line react-refresh/only-export-components
export function revealDelay(step: number, stepMs = 60): CSSProperties {
  return { '--rvd': `${step * stepMs}ms` } as CSSProperties;
}
