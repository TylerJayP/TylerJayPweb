/** Keeps `value` between `min` and `max`. */
export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

/** Keeps `value` between 0 and 1, for progress and easing amounts. */
export function clamp01(value: number): number {
  return clamp(value, 0, 1);
}
