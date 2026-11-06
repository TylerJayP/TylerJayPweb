/**
 * The fake build that plays before the intro video, as a pure function of time so it is easy to test
 * and to render: given the seconds since it started, it says exactly what the terminal shows.
 */

export const BUILD_SECONDS = 5;
/** When the video starts wiping in over the terminal, and when the terminal is fully covered. */
export const PLAYER_AT = 5.6;
export const TERMINAL_GONE_AT = 6.3;

const PROJECTS = ['TrulyOkay', 'Virtual Dyno', 'OBD2 Telemetry', 'RankQuest'];
const SPINNER = ['|', '/', '-', '\\'];

export interface BuildStep {
  /** Countdown number shown in brackets: [5] down to [1]. */
  number: number;
  /** The label typed so far. */
  text: string;
  /** Still typing or running: shows the cursor. */
  active: boolean;
  done: boolean;
  /** "ok", a spinner frame, or nothing yet. */
  status: string;
  /** The dotted leader appears once the label is fully typed. */
  showLeader: boolean;
}

export interface BuildFrame {
  command: string;
  commandTyping: boolean;
  steps: BuildStep[];
  /** Fill of each progress segment, 0 to 1. */
  progress: number[];
  clock: string;
  built: boolean;
  doneMessage: string;
  showTerminal: boolean;
  showPlayer: boolean;
}

const clamp01 = (x: number) => Math.max(0, Math.min(1, x));

/** Types `full` out over `duration` seconds, starting at `from`. */
const typed = (full: string, elapsed: number, from: number, duration: number) =>
  full.slice(0, Math.max(0, Math.min(full.length, Math.floor(((elapsed - from) / duration) * full.length))));

export function buildFrame(elapsed: number, rebuild: boolean, nowMs: number): BuildFrame {
  const t = Math.max(0, elapsed);
  const verb = rebuild ? 'rebuilding ' : 'building ';
  const labels = [
    ...PROJECTS.map((name) => verb + name),
    rebuild ? 'restarting intro video' : 'starting intro video',
  ];
  const spinner = SPINNER[Math.floor(nowMs / 90) % SPINNER.length] ?? '|';

  const steps = labels
    .map((label, i) => {
      const from = i === 0 ? 0.4 : i;
      const text = typed(label, t, from, 0.3);
      const done = t >= i + 1;
      const fullyTyped = text.length >= label.length;
      return {
        visible: t >= from,
        step: {
          number: labels.length - i,
          text,
          active: t >= from && !done,
          done,
          status: done ? 'ok' : fullyTyped ? spinner : '',
          showLeader: fullyTyped,
        },
      };
    })
    .filter(({ visible }) => visible)
    .map(({ step }) => step);

  const command = rebuild ? 'tjp rebuild --all' : 'tjp build --all';
  const remaining = Math.max(0, BUILD_SECONDS - t);

  return {
    command: typed(command, t, 0, 0.35),
    commandTyping: t < 0.4,
    steps,
    progress: labels.map((_, i) => clamp01(t - i)),
    clock: `00:0${remaining.toFixed(2)}`,
    built: t >= BUILD_SECONDS,
    doneMessage: rebuild
      ? 'Rebuild succeeded in 5.00s. Relaunching video.'
      : 'Build succeeded in 5.00s. Launching video.',
    showTerminal: t < TERMINAL_GONE_AT,
    showPlayer: t >= PLAYER_AT,
  };
}
