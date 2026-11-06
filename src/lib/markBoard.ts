/** State rules for the "put the mark together" board in Selected Projects. */

export const PART_COUNT = 6;

/** Only the first part starts in place. */
export const initialPlacement = (): boolean[] => Array.from({ length: PART_COUNT }, (_, i) => i === 0);

export const placeAll = (): boolean[] => Array.from({ length: PART_COUNT }, () => true);

/** Opening a project snaps its part into place. */
export function placePart(placed: readonly boolean[], index: number): boolean[] {
  return placed.map((value, i) => value || i === index);
}

export function placedCount(placed: readonly boolean[]): number {
  return placed.filter(Boolean).length;
}

/** The "View" line in the board's title block. */
export function viewLabel(placed: readonly boolean[]): 'Exploded' | 'Going together' | 'Assembled' {
  const count = placedCount(placed);
  if (count === placed.length) return 'Assembled';
  return count <= 1 ? 'Exploded' : 'Going together';
}
