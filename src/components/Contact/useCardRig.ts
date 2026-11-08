import { useCallback, useEffect, useRef, useState } from 'react';
import { useAnimationLoop } from '../../hooks/useAnimationLoop';
import { useLatest } from '../../hooks/useLatest';
import { prefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { useCardElements } from './cardElements';
import {
  assemble,
  assembleSlowly,
  type CardState,
  createCardState,
  explode,
  restartIdle,
  snapToWaitingPose,
  stepCard,
  toggleFlip,
  togglePin,
} from './cardPhysics';

/**
 * The card's behavior: what each button and click does to the physics (cardPhysics.ts), with the
 * animation loop painting the result (cardElements.ts). React only re-renders when the mode changes, and
 * the loop only runs while something is moving and the card is on screen.
 */

/** How long the card waits on screen before it starts putting itself together. */
const INTRO_DELAY_MS = 750;

export interface CardView {
  /** Taken apart, with the layer labels showing. */
  exploded: boolean;
  pinned: number;
  flipped: boolean;
  highlighted: number;
}

const INITIAL_VIEW: CardView = { exploded: false, pinned: -1, flipped: false, highlighted: -1 };

type Change = (state: CardState, now: number) => void;

const now = () => performance.now();

const isShownApart = (state: CardState, view: CardView) => state.exploded && view.exploded;

/** Calls back whenever the element enters or leaves the screen. */
function watchVisibility(element: Element | null, onChange: (visible: boolean) => void) {
  if (!element || !('IntersectionObserver' in window)) {
    return undefined;
  }
  const observer = new IntersectionObserver(([entry]) => onChange(entry?.isIntersecting ?? true));
  observer.observe(element);
  return observer;
}

export function useCardRig() {
  const physics = useRef<CardState>(createCardState(0));
  const calm = useRef(false);
  const introTimer = useRef(0);
  const [view, setView] = useState<CardView>(INITIAL_VIEW);
  const viewRef = useLatest(view);
  const { refs, paint: paintElements } = useCardElements();

  const paint = useCallback(() => {
    paintElements(physics.current, viewRef.current.exploded);
  }, [paintElements, viewRef]);

  const loop = useAnimationLoop((seconds) => {
    const moving = stepCard(physics.current, seconds, now(), calm.current);
    paint();
    return moving;
  });
  const { start } = loop;

  /** Applies a change to the physics and makes sure the animation is running to show it. */
  const move = useCallback(
    (change: Change) => {
      change(physics.current, now());
      start();
    },
    [start],
  );

  const cancelIntro = useCallback(() => {
    window.clearTimeout(introTimer.current);
  }, []);

  const takeApart = useCallback(() => {
    move(explode);
    setView((v) => ({ ...v, exploded: true, pinned: -1 }));
  }, [move]);

  const putTogether = useCallback(
    (change: Change = assemble) => {
      move(change);
      setView((v) => ({ ...v, exploded: false, pinned: -1 }));
    },
    [move],
  );

  /** Off screen: waits taken apart and tilted, ready to put itself together when it scrolls into view. */
  const prepare = useCallback(() => {
    if (calm.current) {
      return;
    }
    cancelIntro();
    snapToWaitingPose(physics.current, now());
    setView((v) => ({ ...v, exploded: false, pinned: -1, flipped: false }));
    paint();
  }, [cancelIntro, paint]);

  /** On screen: after a beat, it slowly puts itself together. */
  const introduce = useCallback(() => {
    if (calm.current) {
      return;
    }
    cancelIntro();
    introTimer.current = window.setTimeout(() => putTogether(assembleSlowly), INTRO_DELAY_MS);
  }, [cancelIntro, putTogether]);

  const toggleApart = useCallback(() => {
    cancelIntro();
    if (isShownApart(physics.current, viewRef.current)) {
      putTogether();
    } else {
      takeApart();
    }
  }, [cancelIntro, putTogether, takeApart, viewRef]);

  const flip = useCallback(() => {
    move(toggleFlip);
    setView((v) => ({ ...v, flipped: physics.current.flipped }));
  }, [move]);

  /** Clicking a layer takes the card apart or, once it is apart, lifts that layer out of the stack. */
  const pick = useCallback(
    (layer: number) => {
      if (!isShownApart(physics.current, viewRef.current)) {
        cancelIntro();
        takeApart();
        return;
      }
      move((state, at) => togglePin(state, layer, at));
      setView((v) => ({ ...v, pinned: physics.current.pinned }));
    },
    [cancelIntro, move, takeApart, viewRef],
  );

  const highlight = useCallback((layer: number) => {
    setView((v) => ({ ...v, highlighted: layer }));
  }, []);

  // Repaint once a new view has rendered, so the leader lines follow it even when nothing is moving (with
  // reduced motion the animation loop stops after a single frame, before the new view is in place).
  useEffect(() => {
    paint();
  }, [view.exploded, view.pinned, paint]);

  // Only animate while the card is on screen.
  const { setPaused } = loop;
  useEffect(() => {
    calm.current = prefersReducedMotion();
    restartIdle(physics.current, now());
    const observer = watchVisibility(refs.stage.current, (isVisible) => setPaused(!isVisible));
    paint();
    return () => {
      observer?.disconnect();
      cancelIntro();
    };
  }, [cancelIntro, paint, refs.stage, setPaused]);

  return {
    view,
    refs,
    actions: { toggleApart, flip, pick, highlight, prepare, introduce },
  };
}
