/**
 * The fake build that plays before the intro video, as a pure function of time so it is easy to test
 * and to render: given the seconds since it started, it says exactly what the terminal shows.
 */

import { clamp, clamp01 } from './math';

const BUILD_SECONDS = 5;
/** When the video starts wiping in over the terminal, and when the terminal is fully covered. */
const PLAYER_AT = 5.6;
export const TERMINAL_GONE_AT = 6.3;

const PROJECTS = ['TrulyOkay', 'Virtual Dyno', 'Lockbox', 'RankQuest'];
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

/** Typing and spinner timing. Each step starts at its index in seconds and finishes a second later. */
const TIMING = { commandTyping: 0.35, firstStepAt: 0.4, stepTyping: 0.3, spinnerFrameMs: 90 };

/** Types `full` out over `duration` seconds, starting at `from`. */
function typed(full: string, elapsed: number, from: number, duration: number): string {
  const characters = Math.floor(((elapsed - from) / duration) * full.length);
  return full.slice(0, clamp(characters, 0, full.length));
}

function stepLabels(rebuild: boolean): string[] {
  const verb = rebuild ? 'rebuilding' : 'building';
  return [
    ...PROJECTS.map((name) => `${verb} ${name}`),
    rebuild ? 'restarting intro video' : 'starting intro video',
  ];
}

/** The first step waits for the command to finish typing. */
const stepStartsAt = (index: number) => (index === 0 ? TIMING.firstStepAt : index);

interface StepContext {
  elapsed: number;
  total: number;
  spinner: string;
}

function stepStatus(done: boolean, fullyTyped: boolean, spinner: string): string {
  if (done) {
    return 'ok';
  }
  return fullyTyped ? spinner : '';
}

function buildStep(label: string, index: number, { elapsed, total, spinner }: StepContext): BuildStep {
  const text = typed(label, elapsed, stepStartsAt(index), TIMING.stepTyping);
  const done = elapsed >= index + 1;
  const fullyTyped = text.length >= label.length;
  return {
    number: total - index,
    text,
    active: !done,
    done,
    status: stepStatus(done, fullyTyped, spinner),
    showLeader: fullyTyped,
  };
}

/** Everything the terminal shows `elapsed` seconds into the build. `nowMs` drives the spinner. */
export function buildFrame(elapsed: number, rebuild: boolean, nowMs: number): BuildFrame {
  const t = Math.max(0, elapsed);
  const labels = stepLabels(rebuild);
  const spinner = SPINNER[Math.floor(nowMs / TIMING.spinnerFrameMs) % SPINNER.length] ?? '|';
  const context = { elapsed: t, total: labels.length, spinner };

  const steps = labels
    .map((label, index) => ({ label, index }))
    .filter(({ index }) => t >= stepStartsAt(index))
    .map(({ label, index }) => buildStep(label, index, context));

  const command = rebuild ? 'tjp rebuild --all' : 'tjp build --all';
  const remaining = Math.max(0, BUILD_SECONDS - t);

  return {
    command: typed(command, t, 0, TIMING.commandTyping),
    commandTyping: t < TIMING.firstStepAt,
    steps,
    progress: labels.map((_, index) => clamp01(t - index)),
    clock: `00:0${remaining.toFixed(2)}`,
    built: t >= BUILD_SECONDS,
    doneMessage: rebuild
      ? 'Rebuild succeeded in 5.00s. Relaunching video.'
      : 'Build succeeded in 5.00s. Launching video.',
    showTerminal: t < TERMINAL_GONE_AT,
    showPlayer: t >= PLAYER_AT,
  };
}
