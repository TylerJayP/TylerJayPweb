import { useCallback, useEffect, useRef, useState } from 'react';
import { prefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

/**
 * Physics for the 3D business card. The card is six stacked layers (back print, stock, painted edge, ink,
 * foil, gloss). "Take apart" lifts them into an exploded, tilted view with a leader line from each layer
 * to its label; "Put together" stacks them again. Everything moves on damped springs and is written
 * straight to the DOM each animation frame, so React only re-renders when the mode changes.
 */

export const LAYER_COUNT = 6;
/** Resting depth of each layer when stacked, in px. */
const STACKED_Z = [-6, 0, 1.5, 3, 4.5, 6];
/** Extra spacing between layers when exploded, in px per step from the middle. */
const EXPLODE_SPREAD = 44;
/** How far a pinned layer lifts out of the stack. */
const PIN_LIFT = 40;

type Camera = [rotateX: number, rotateY: number, rotateZ: number];

interface Rig {
  camera: Camera;
  velocity: Camera;
  z: number[];
  velocityZ: number[];
  targetZ: number[];
  /** When each layer starts moving (ms), so they lift or settle one after another. */
  startAt: number[];
  amount: number;
  pinned: number;
  exploded: boolean;
  flipped: boolean;
  /** Softer springs while it assembles itself on first view. */
  slow: boolean;
  /** Last interaction; the idle sway eases in after it. */
  touchedAt: number;
  swayStart: number;
}

export interface CardView {
  exploded: boolean;
  pinned: number;
  flipped: boolean;
  highlighted: number;
}

const now = () => performance.now();

function createRig(): Rig {
  const t = now();
  return {
    camera: [0, 0, 0],
    velocity: [0, 0, 0],
    z: [...STACKED_Z],
    velocityZ: Array(LAYER_COUNT).fill(0),
    targetZ: [...STACKED_Z],
    startAt: Array(LAYER_COUNT).fill(0),
    amount: 0,
    pinned: -1,
    exploded: false,
    flipped: false,
    slow: false,
    touchedAt: t,
    swayStart: t,
  };
}

const restingZ = (rig: Rig, layer: number) =>
  (STACKED_Z[layer] ?? 0) +
  rig.amount * (layer - 2.5) * EXPLODE_SPREAD +
  (rig.pinned === layer ? PIN_LIFT : 0);

/** Where the camera wants to be: face-on when stacked, tilted when exploded, with a gentle idle sway. */
function cameraTarget(rig: Rig, t: number, calm: boolean): Camera {
  const target: Camera = rig.exploded ? [60, rig.flipped ? 180 : 0, -14] : [0, rig.flipped ? 180 : 0, 0];
  if (calm || rig.slow) return target;
  const k = (t - rig.swayStart) / 1000;
  if (rig.exploded) {
    const ease = Math.max(0, Math.min(1, (t - rig.touchedAt - 1200) / 2400));
    target[2] += 7 * ease * Math.sin(k * 0.55);
    target[0] += 3 * ease * Math.sin(k * 0.41);
  } else {
    const ease = Math.max(0, Math.min(1, (t - rig.touchedAt - 900) / 2200));
    target[1] += 9 * ease * Math.sin(k * 0.55);
    target[0] += 5 * ease * Math.sin(k * 0.41 + 1.2);
  }
  return target;
}

export function useCardRig() {
  const rig = useRef<Rig>(createRig());
  const calm = useRef(false);
  const frame = useRef(0);
  const lastFrame = useRef(0);
  const visible = useRef(true);
  const introTimer = useRef(0);

  const stage = useRef<HTMLDivElement | null>(null);
  const model = useRef<HTMLDivElement | null>(null);
  const layers = useRef<(HTMLElement | null)[]>([]);
  const dots = useRef<(HTMLElement | null)[]>([]);
  const lines = useRef<(SVGPathElement | null)[]>([]);
  const labels = useRef<(HTMLElement | null)[]>([]);

  const [view, setView] = useState<CardView>({
    exploded: false,
    pinned: -1,
    flipped: false,
    highlighted: -1,
  });
  const viewRef = useRef(view);
  useEffect(() => {
    viewRef.current = view;
  });

  /** Writes the current physics state to the DOM. */
  const paint = useCallback(() => {
    const r = rig.current;
    const [rx, ry, rz] = r.camera;
    if (model.current)
      model.current.style.transform = `rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) rotateZ(${rz.toFixed(2)}deg)`;
    layers.current.forEach((layer, i) => {
      if (layer) layer.style.transform = `translateZ(${(r.z[i] ?? 0).toFixed(2)}px)`;
    });

    // Leader lines from each layer's dot to its label (labels are listed top layer first).
    const box = stage.current?.getBoundingClientRect();
    const spread = Math.max(0, Math.min(1, ((r.z[5] ?? 0) - 6) / (2.5 * EXPLODE_SPREAD)));
    lines.current.forEach((line, i) => {
      if (!line) return;
      const dot = dots.current[i];
      const label = labels.current[LAYER_COUNT - 1 - i];
      if (!viewRef.current.exploded || !box || !dot || !label) {
        line.setAttribute('opacity', '0');
        return;
      }
      const scale = stage.current?.offsetWidth ? box.width / stage.current.offsetWidth : 1;
      const a = dot.getBoundingClientRect();
      const b = label.getBoundingClientRect();
      const x1 = (a.left + a.width / 2 - box.left) / scale;
      const y1 = (a.top + a.height / 2 - box.top) / scale;
      const x2 = (b.left - box.left) / scale;
      const y2 = (b.top + b.height / 2 - box.top) / scale;
      line.setAttribute(
        'd',
        `M${x1.toFixed(1)} ${y1.toFixed(1)} L${(x2 - 22).toFixed(1)} ${y2.toFixed(1)} L${x2.toFixed(1)} ${y2.toFixed(1)}`,
      );
      const dimmed = r.pinned >= 0 && r.pinned !== i ? 0.25 : 1;
      line.setAttribute('opacity', String(dimmed * Math.min(1, Math.max(0, spread - 0.15) * 1.8)));
    });
  }, []);

  /** One animation frame: springs move toward their targets; stops once everything is still. */
  const step = useCallback(
    (timestamp: number) => {
      const r = rig.current;
      const dt = Math.min(
        0.033,
        lastFrame.current ? Math.max(0.001, (timestamp - lastFrame.current) / 1000) : 0.016,
      );
      lastFrame.current = timestamp;
      const t = now();
      const target = cameraTarget(r, t, calm.current);

      let still = true;
      for (let j = 0; j < 3; j++) {
        if (calm.current) {
          r.camera[j] = target[j]!;
          r.velocity[j] = 0;
          continue;
        }
        const stiffness = r.slow ? 14 : 70;
        const damping = r.slow ? 7.5 : 17;
        r.velocity[j]! += ((target[j]! - r.camera[j]!) * stiffness - damping * r.velocity[j]!) * dt;
        r.camera[j]! += r.velocity[j]! * dt;
        if (Math.abs(target[j]! - r.camera[j]!) > 0.03 || Math.abs(r.velocity[j]!) > 0.05) still = false;
      }

      for (let i = 0; i < LAYER_COUNT; i++) {
        if (t >= r.startAt[i]!) r.targetZ[i] = restingZ(r, i);
        if (calm.current) {
          r.z[i] = r.targetZ[i]!;
          r.velocityZ[i] = 0;
          continue;
        }
        const stiffness = r.slow ? 20 : 160;
        const damping = r.slow ? 9 : 24;
        r.velocityZ[i]! += ((r.targetZ[i]! - r.z[i]!) * stiffness - damping * r.velocityZ[i]!) * dt;
        r.z[i]! += r.velocityZ[i]! * dt;
      }
      // A layer never sinks through the one below it, so nothing pops in and out while settling.
      for (let i = 1; i < LAYER_COUNT; i++) {
        if (r.z[i]! < r.z[i - 1]! + 1.5) {
          r.z[i] = r.z[i - 1]! + 1.5;
          r.velocityZ[i] = Math.max(r.velocityZ[i]!, r.velocityZ[i - 1]!);
        }
      }
      const settled = r.z.every(
        (z, i) =>
          t >= r.startAt[i]! && Math.abs(restingZ(r, i) - z) <= 0.3 && Math.abs(r.velocityZ[i]!) <= 0.6,
      );
      if (settled && still && r.slow) {
        r.slow = false;
        r.touchedAt = t;
        r.swayStart = t;
      }

      paint();
      const swaying = !calm.current && !r.slow;
      if (!visible.current || (still && settled && !swaying)) {
        frame.current = 0;
        return;
      }
      frame.current = requestAnimationFrame(step);
    },
    [paint],
  );

  const start = useCallback(() => {
    if (frame.current || !visible.current) return;
    lastFrame.current = 0;
    frame.current = requestAnimationFrame(step);
  }, [step]);

  /** Sets how exploded the stack is, staggering the layers bottom-up or top-down. */
  const setAmount = (amount: number, order: 'up' | 'down') => {
    const r = rig.current;
    r.amount = amount;
    const t = now();
    const gap = r.slow ? 170 : 65;
    r.startAt = r.startAt.map((_, i) => t + (order === 'up' ? i * 80 : (LAYER_COUNT - 1 - i) * gap));
  };

  const explode = useCallback(() => {
    const r = rig.current;
    r.exploded = true;
    r.pinned = -1;
    r.slow = false;
    r.swayStart = now() + 1200;
    setAmount(1, 'up');
    r.touchedAt = now();
    setView((v) => ({ ...v, exploded: true, pinned: -1 }));
    start();
  }, [start]);

  const assemble = useCallback(() => {
    const r = rig.current;
    r.exploded = false;
    r.pinned = -1;
    setAmount(0, 'down');
    r.touchedAt = now();
    setView((v) => ({ ...v, exploded: false, pinned: -1 }));
    start();
  }, [start]);

  /** Off-screen: waits exploded and tilted, ready to put itself together when it scrolls into view. */
  const prepare = useCallback(() => {
    if (calm.current) return;
    window.clearTimeout(introTimer.current);
    const r = rig.current;
    Object.assign(r, { exploded: true, flipped: false, pinned: -1, amount: 1, slow: false });
    const t = now();
    for (let i = 0; i < LAYER_COUNT; i++) {
      r.startAt[i] = 0;
      r.z[i] = r.targetZ[i] = restingZ(r, i);
      r.velocityZ[i] = 0;
    }
    r.camera = [60, 0, -14];
    r.velocity = [0, 0, 0];
    r.touchedAt = t;
    r.swayStart = t;
    setView((v) => ({ ...v, exploded: false, pinned: -1, flipped: false }));
    paint();
  }, [paint]);

  /** On screen: after a beat, it slowly assembles itself. */
  const introduce = useCallback(() => {
    if (calm.current) return;
    window.clearTimeout(introTimer.current);
    introTimer.current = window.setTimeout(() => {
      rig.current.slow = true;
      assemble();
    }, 750);
  }, [assemble]);

  const toggleApart = useCallback(() => {
    window.clearTimeout(introTimer.current);
    if (rig.current.exploded && viewRef.current.exploded) assemble();
    else explode();
  }, [assemble, explode]);

  const flip = useCallback(() => {
    const r = rig.current;
    r.flipped = !r.flipped;
    r.touchedAt = now();
    setView((v) => ({ ...v, flipped: r.flipped }));
    start();
  }, [start]);

  /** Clicking a layer explodes the card, or, once exploded, pins that layer out of the stack. */
  const pick = useCallback(
    (layer: number) => {
      const r = rig.current;
      if (!r.exploded || !viewRef.current.exploded) {
        window.clearTimeout(introTimer.current);
        explode();
        return;
      }
      r.pinned = r.pinned === layer ? -1 : layer;
      r.startAt = r.startAt.map((at) => Math.min(at, now()));
      r.touchedAt = now();
      setView((v) => ({ ...v, pinned: r.pinned }));
      start();
    },
    [explode, start],
  );

  const highlight = useCallback((layer: number) => setView((v) => ({ ...v, highlighted: layer })), []);

  // Only animate while the card is on screen; clean up on unmount.
  useEffect(() => {
    calm.current = prefersReducedMotion();
    const element = stage.current;
    let observer: IntersectionObserver | undefined;
    if (element && 'IntersectionObserver' in window) {
      observer = new IntersectionObserver(([entry]) => {
        visible.current = entry?.isIntersecting ?? true;
        if (visible.current) start();
      });
      observer.observe(element);
    }
    paint();
    return () => {
      observer?.disconnect();
      cancelAnimationFrame(frame.current);
      frame.current = 0;
      window.clearTimeout(introTimer.current);
    };
  }, [paint, start]);

  return {
    view,
    refs: { stage, model, layers, dots, lines, labels },
    actions: { toggleApart, flip, pick, highlight, prepare, introduce },
  };
}
