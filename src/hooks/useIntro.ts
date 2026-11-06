import { useCallback, useEffect, useState } from 'react';

/** The build terminal starts once the logo has drawn and the hero has faded in. */
const TERMINAL_DELAY_MS = 1800;
/** Long enough for the browser to paint the reset state before the animations start again. */
const RESTART_GAP_MS = 60;

export interface IntroState {
  /** Root class: `reset` holds everything at its start, `go` plays the opening animations. */
  phase: 'reset' | 'go';
  /** When the build terminal starts counting (ms since epoch). */
  buildStartsAt: number;
  /** Replays say "rebuild" instead of "build". */
  rebuild: boolean;
  /** True until the terminal appears; scroll reveals at the top wait for it. */
  holding: boolean;
  replay: () => void;
  /** Jumps straight to the video (used by "Hear it" while the build is still running). */
  skipToVideo: () => void;
}

/** Runs the opening sequence. It plays on every visit, and again from "Rebuild project". */
export function useIntro(): IntroState {
  const [phase, setPhase] = useState<'reset' | 'go'>('reset');
  const [run, setRun] = useState(() => ({ startsAt: Date.now() + TERMINAL_DELAY_MS, rebuild: false }));
  const [holding, setHolding] = useState(true);

  useEffect(() => {
    if (phase !== 'reset') return;
    const timer = window.setTimeout(() => setPhase('go'), RESTART_GAP_MS);
    return () => window.clearTimeout(timer);
  }, [phase]);

  useEffect(() => {
    const wait = run.startsAt - Date.now();
    if (wait <= 0) {
      setHolding(false);
      return;
    }
    setHolding(true);
    const timer = window.setTimeout(() => setHolding(false), wait);
    return () => window.clearTimeout(timer);
  }, [run.startsAt]);

  const replay = useCallback(() => {
    setPhase('reset');
    setRun({ startsAt: Date.now() + TERMINAL_DELAY_MS, rebuild: true });
  }, []);

  const skipToVideo = useCallback(() => {
    setRun((current) => ({ ...current, startsAt: Date.now() - 7000 }));
  }, []);

  return { phase, buildStartsAt: run.startsAt, rebuild: run.rebuild, holding, replay, skipToVideo };
}

/** Seconds since `startsAt`, updated every 50 ms until `untilSeconds` has passed. */
export function useElapsed(startsAt: number, untilSeconds: number): number {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    setNow(Date.now());
    const timer = window.setInterval(() => {
      const current = Date.now();
      setNow(current);
      if ((current - startsAt) / 1000 > untilSeconds) window.clearInterval(timer);
    }, 50);
    return () => window.clearInterval(timer);
  }, [startsAt, untilSeconds]);

  return Math.max(0, (now - startsAt) / 1000);
}
