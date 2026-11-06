/**
 * The decisions behind scroll reveals, kept free of the DOM so they can be tested. The provider in
 * hooks/reveal.tsx measures the page and applies the results.
 */

import { classNames } from './classNames';

/** Every block on the page that reveals on scroll. A typo is a compile error rather than a silent no-op. */
export type RevealKey =
  | 'work-heading'
  | 'mark-board'
  | 'parts-list'
  | 'project-detail'
  | 'experience-heading'
  | `job-${number}`
  | 'education-heading'
  | `school-${number}`
  | 'job-match'
  | 'contact-heading'
  | 'business-card'
  | 'message-form'
  | 'footer';

/** A block shows once its top passes this far down the screen (or its bottom, scrolling up). */
const TRIGGER_LINE = 0.7;
/** Blocks that arrive together stagger, up to this many steps. */
const MAX_STAGGER = 4;

export interface Edges {
  top: number;
  bottom: number;
}

export interface ScrollState {
  /** Height of the screen. */
  height: number;
  scrollingUp: boolean;
  /** At the bottom of the page, where blocks can't scroll any higher, so everything left shows. */
  atEnd: boolean;
}

export type RevealDecision = 'show' | 'hide' | 'wait';

export function isOnScreen(box: Edges, height: number): boolean {
  return box.bottom > 0 && box.top < height;
}

/**
 * What a block should do for where it is: hide once it is completely off-screen (so it plays again on the
 * way back), show once it crosses the trigger line, otherwise wait.
 */
export function revealDecision(box: Edges, scroll: ScrollState): RevealDecision {
  if (!isOnScreen(box, scroll.height)) {
    return 'hide';
  }
  const line = scroll.height * TRIGGER_LINE;
  const crossed = scroll.scrollingUp ? box.bottom > scroll.height - line : box.top < line;
  return crossed || scroll.atEnd ? 'show' : 'wait';
}

/** The stagger step for the next block in a batch that arrives together. */
export function staggerStep(alreadyInBatch: number): number {
  return Math.min(alreadyInBatch, MAX_STAGGER);
}

export interface ShownBlock {
  stagger: number;
  scrollingUp: boolean;
  /** Its animation has finished playing. */
  settled: boolean;
}

/** The classes a shown block carries (styled in styles/reveal.css). */
export function shownClasses(block: ShownBlock): string {
  return classNames('rvin', `rvb${block.stagger}`, block.scrollingUp && 'rvup', block.settled && 'rvdone');
}
