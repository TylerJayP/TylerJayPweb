import { clamp01 } from '../../lib/math';
import { type CardState, openness } from './cardPhysics';

/** A rectangle in page coordinates, as returned by getBoundingClientRect. */
export interface Box {
  left: number;
  top: number;
  width: number;
  height: number;
}

/** Length of the short horizontal run into each label. */
const ELBOW = 22;
/** Lines only start to show once the stack is this far open, then fade in quickly. */
const FADE = { start: 0.15, rate: 1.8 };
/** Opacity of the other lines while one layer is pinned. */
const DIMMED = 0.25;

const point = (x: number, y: number) => `${x.toFixed(1)} ${y.toFixed(1)}`;

/**
 * The SVG path for one leader line: from the middle of a layer's dot to the left edge of its label, with
 * a short level run at the end. `scale` undoes any CSS scaling of the stage.
 */
export function leaderPath(dot: Box, label: Box, stage: Box, scale: number): string {
  const startX = (dot.left + dot.width / 2 - stage.left) / scale;
  const startY = (dot.top + dot.height / 2 - stage.top) / scale;
  const endX = (label.left - stage.left) / scale;
  const endY = (label.top + label.height / 2 - stage.top) / scale;
  return `M${point(startX, startY)} L${point(endX - ELBOW, endY)} L${point(endX, endY)}`;
}

/** How visible a layer's leader line is: fades in as the stack opens, dims when another layer is pinned. */
export function leaderOpacity(state: CardState, layer: number): number {
  const anotherPinned = state.pinned >= 0 && state.pinned !== layer;
  const fadeIn = clamp01((openness(state) - FADE.start) * FADE.rate);
  return (anotherPinned ? DIMMED : 1) * fadeIn;
}
