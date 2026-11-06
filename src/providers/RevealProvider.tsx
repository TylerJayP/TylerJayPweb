import { type ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { prefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import { isOnScreen, revealDecision, type RevealKey, type ScrollState } from '../lib/reveal';
import { type Registration, RevealContext } from './revealContext';
import { type ShowOptions, useShownBlocks } from './useShownBlocks';

/**
 * Scroll reveals. The rules for when a block shows or hides live in lib/reveal.ts and the effects are
 * styled in styles/reveal.css; useShownBlocks keeps track of what is showing. This provider measures
 * the page and connects the two.
 *
 * Blocks that arrive together stagger, and while the intro plays, blocks at the top wait for the build
 * terminal so everything comes in together.
 */

/** While the intro is holding, blocks within this much of the top (as a share of the screen) wait. */
const HELD_ZONE = 0.6;
/** Scroll movement smaller than this (px) doesn't change the direction. */
const SCROLL_JITTER = 1;
/** How close to the bottom (px) counts as the end of the page. */
const END_SLACK = 4;

interface ProviderProps {
  children: ReactNode;
  /** While true, blocks near the top of the page wait (the intro is still playing). */
  held: boolean;
}

const nearTop = () => window.scrollY <= window.innerHeight * HELD_ZONE;

/**
 * Calls `callback` at most once per animation frame while the page scrolls or resizes, and once right
 * away. Returns a function that stops watching.
 */
function watchViewport(callback: () => void): () => void {
  let frame = 0;
  const schedule = () => {
    if (frame) {
      return;
    }
    frame = requestAnimationFrame(() => {
      frame = 0;
      callback();
    });
  };
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule);
  schedule();
  return () => {
    cancelAnimationFrame(frame);
    window.removeEventListener('scroll', schedule);
    window.removeEventListener('resize', schedule);
  };
}

export function RevealProvider({ children, held }: ProviderProps) {
  const [enabled] = useState(() => !prefersReducedMotion());
  const blocks = useShownBlocks();
  const { show, hide, forget, shownKeys } = blocks;
  const entries = useRef(new Map<RevealKey, Registration>());
  const lastY = useRef(0);
  const heldRef = useRef(held);

  const reveal = useCallback(
    (key: RevealKey, options: ShowOptions = {}) => {
      // Keyboard focus doesn't wait for the intro: a focused control must always be visible.
      const waitingForIntro = heldRef.current && nearTop() && !options.instant;
      if (!waitingForIntro && show(key, options)) {
        entries.current.get(key)?.onReveal?.();
      }
    },
    [show],
  );

  const conceal = useCallback(
    (key: RevealKey) => {
      if (hide(key)) {
        entries.current.get(key)?.onHide?.();
      }
    },
    [hide],
  );

  /** Reads which way the page is scrolling and whether it has reached the bottom. */
  const readScroll = useCallback((): ScrollState => {
    const y = window.scrollY;
    const height = window.innerHeight;
    const scrollingUp = y < lastY.current - SCROLL_JITTER;
    if (Math.abs(y - lastY.current) > SCROLL_JITTER) {
      lastY.current = y;
    }
    const atEnd = y + height >= document.documentElement.scrollHeight - END_SLACK;
    return { height, scrollingUp, atEnd };
  }, []);

  /** Shows or hides every block for where it is now. */
  const check = useCallback(() => {
    const scroll = readScroll();
    entries.current.forEach(({ element }, key) => {
      const decision = revealDecision(element.getBoundingClientRect(), scroll);
      if (decision === 'show') {
        reveal(key, { scrollingUp: scroll.scrollingUp });
      }
      // A block holding keyboard focus stays shown, even while the page is still scrolling it into view.
      if (decision === 'hide' && !element.contains(document.activeElement)) {
        conceal(key);
      }
    });
  }, [conceal, readScroll, reveal]);

  const revealEverythingOnScreen = useCallback(() => {
    entries.current.forEach(({ element }, key) => {
      if (isOnScreen(element.getBoundingClientRect(), window.innerHeight)) {
        reveal(key);
      }
    });
  }, [reveal]);

  // Holding: what's on screen at the top goes back to waiting; letting go brings in everything visible.
  useEffect(() => {
    heldRef.current = held;
    if (!enabled) {
      return;
    }
    if (!held) {
      revealEverythingOnScreen();
    } else if (nearTop()) {
      shownKeys().forEach(conceal);
    }
  }, [held, enabled, conceal, revealEverythingOnScreen, shownKeys]);

  useEffect(() => {
    if (!enabled) {
      return undefined;
    }
    lastY.current = window.scrollY;
    return watchViewport(check);
  }, [enabled, check]);

  const register = useCallback(
    (key: RevealKey, registration: Registration) => {
      const { element } = registration;
      // Tabbing into a block that hasn't played yet shows it straight away, so focus never lands on
      // something invisible.
      const showOnFocus = () => reveal(key, { instant: true });
      entries.current.set(key, registration);
      element.addEventListener('focusin', showOnFocus);
      requestAnimationFrame(check);
      return () => {
        element.removeEventListener('focusin', showOnFocus);
        entries.current.delete(key);
        forget(key);
      };
    },
    [check, forget, reveal],
  );

  const value = useMemo(
    () => ({ enabled, classes: blocks.classes, register }),
    [enabled, blocks.classes, register],
  );
  return <RevealContext.Provider value={value}>{children}</RevealContext.Provider>;
}
