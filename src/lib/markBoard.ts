/** State rules for the "put the mark together" board in Selected Projects. */

import { wrapIndex } from './format';

const PART_COUNT = 6;

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
  if (count === placed.length) {
    return 'Assembled';
  }
  return count <= 1 ? 'Exploded' : 'Going together';
}

export interface BoardState {
  /** The open project. */
  current: number;
  placed: boolean[];
  /** The screenshot showing for the open project. */
  shot: number;
}

export type BoardAction =
  | { type: 'open'; project: number }
  | { type: 'placeAll' }
  | { type: 'reset' }
  | { type: 'showShot'; shot: number; shotCount: number };

export const initialBoard = (): BoardState => ({ current: 0, placed: initialPlacement(), shot: 0 });

/** Every change the Selected Projects section can make, as a pure function for useReducer. */
export function boardReducer(state: BoardState, action: BoardAction): BoardState {
  switch (action.type) {
    case 'open':
      return {
        current: action.project,
        placed: placePart(state.placed, action.project),
        // Reopening the same project keeps its screenshot; a new one starts from the first.
        shot: action.project === state.current ? state.shot : 0,
      };
    case 'placeAll':
      return { ...state, placed: placeAll() };
    case 'reset':
      return initialBoard();
    case 'showShot':
      return { ...state, shot: wrapIndex(action.shot, action.shotCount) };
  }
}
