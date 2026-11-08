import type { Cue } from '../content/types';

/** The caption showing at `time` seconds, or an empty string between lines. */
export function captionAt(cues: readonly Cue[], time: number): string {
  return cues.find((cue) => time >= cue.start && time < cue.end)?.text ?? '';
}
