import { useCallback, useEffect, useRef } from 'react';
import { clamp } from '../lib/math';
import { useLatest } from './useLatest';

/** Frame time limits (s): a dropped frame or a background tab can't make an animation jump. */
const FRAME = { first: 1 / 60, min: 0.001, max: 0.033 };

/** Seconds since the previous animation frame, kept within sensible limits. */
function frameSeconds(timestamp: number, previous: number): number {
  if (!previous) {
    return FRAME.first;
  }
  return clamp((timestamp - previous) / 1000, FRAME.min, FRAME.max);
}

/**
 * Calls `step` once per animation frame with the seconds since the last one, for as long as it returns
 * true. `start` wakes the loop after a change; while paused (say, off screen) it doesn't run at all.
 */
export function useAnimationLoop(step: (seconds: number) => boolean) {
  const frame = useRef(0);
  const lastFrameAt = useRef(0);
  const paused = useRef(false);
  const latestStep = useLatest(step);

  const tick = useCallback(
    (timestamp: number) => {
      const seconds = frameSeconds(timestamp, lastFrameAt.current);
      lastFrameAt.current = timestamp;
      const keepGoing = latestStep.current(seconds) && !paused.current;
      frame.current = keepGoing ? requestAnimationFrame(tick) : 0;
    },
    [latestStep],
  );

  const start = useCallback(() => {
    if (frame.current || paused.current) {
      return;
    }
    lastFrameAt.current = 0;
    frame.current = requestAnimationFrame(tick);
  }, [tick]);

  const setPaused = useCallback(
    (isPaused: boolean) => {
      paused.current = isPaused;
      if (!isPaused) {
        start();
      }
    },
    [start],
  );

  useEffect(
    () => () => {
      cancelAnimationFrame(frame.current);
      frame.current = 0;
    },
    [],
  );

  return { start, setPaused };
}
