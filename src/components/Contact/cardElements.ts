import { useCallback, useRef } from 'react';
import { type CardState, LAYER_COUNT } from './cardPhysics';
import { leaderOpacity, leaderPath } from './leaderLines';

/**
 * The card's DOM: refs for the elements the physics moves, and a paint function that writes the current
 * physics state straight to them (no React render per frame).
 */

interface LeaderElements {
  stage: HTMLElement | null;
  dots: (HTMLElement | null)[];
  lines: (SVGPathElement | null)[];
  /** Listed top layer first, the way the labels read down the page. */
  labels: (HTMLElement | null)[];
}

/** Rotates the whole card and moves each layer to its depth. */
function paintModel(state: CardState, model: HTMLElement | null, layers: (HTMLElement | null)[]) {
  if (model) {
    const [x = 0, y = 0, z = 0] = state.camera.map((axis) => axis.value);
    model.style.transform = `rotateX(${x.toFixed(2)}deg) rotateY(${y.toFixed(2)}deg) rotateZ(${z.toFixed(2)}deg)`;
  }
  layers.forEach((layer, i) => {
    if (layer) {
      layer.style.transform = `translateZ(${(state.layers[i]?.value ?? 0).toFixed(2)}px)`;
    }
  });
}

/** Draws a line from each layer's dot to its label, or hides them while the card is together. */
function paintLeaderLines(state: CardState, elements: LeaderElements, showing: boolean) {
  const { stage, dots, lines, labels } = elements;
  const box = stage?.getBoundingClientRect();
  const scale = stage?.offsetWidth && box ? box.width / stage.offsetWidth : 1;
  lines.forEach((line, i) => {
    const dot = dots[i];
    const label = labels[LAYER_COUNT - 1 - i];
    if (!line) {
      return;
    }
    if (!showing || !box || !dot || !label) {
      line.setAttribute('opacity', '0');
      return;
    }
    line.setAttribute(
      'd',
      leaderPath(dot.getBoundingClientRect(), label.getBoundingClientRect(), box, scale),
    );
    line.setAttribute('opacity', String(leaderOpacity(state, i)));
  });
}

export function useCardElements() {
  const stage = useRef<HTMLDivElement | null>(null);
  const model = useRef<HTMLDivElement | null>(null);
  const layers = useRef<(HTMLElement | null)[]>([]);
  const dots = useRef<(HTMLElement | null)[]>([]);
  const lines = useRef<(SVGPathElement | null)[]>([]);
  const labels = useRef<(HTMLElement | null)[]>([]);

  /** Moves the card and its layers, and draws the leader lines while `showLines` is on. */
  const paint = useCallback((state: CardState, showLines: boolean) => {
    paintModel(state, model.current, layers.current);
    const leaders = {
      stage: stage.current,
      dots: dots.current,
      lines: lines.current,
      labels: labels.current,
    };
    paintLeaderLines(state, leaders, showLines);
  }, []);

  return { refs: { stage, model, layers, dots, lines, labels }, paint };
}
