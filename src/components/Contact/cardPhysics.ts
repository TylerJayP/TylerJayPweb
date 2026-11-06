/**
 * Spring physics for the 3D business card, with no DOM or React in sight, so it can be unit tested.
 *
 * The card is a stack of layers. Each frame, the camera (three rotations) and every layer's depth move
 * toward their targets on damped springs. "Exploded" spreads the layers apart and tilts the camera;
 * a pinned layer lifts out of the stack.
 */

import { clamp01 } from '../../lib/math';

/** Resting depth of each layer when stacked, bottom first, in px. */
export const STACKED_DEPTHS = [-6, 0, 1.5, 3, 4.5, 6] as const;
export const LAYER_COUNT = STACKED_DEPTHS.length;

/** Extra space between layers when exploded, per step from the middle of the stack. */
const EXPLODE_SPREAD = 44;
/** How far a pinned layer lifts out of the stack. */
const PIN_LIFT = 40;
/** Layers never get closer than this, so none can sink through the one below it. */
const MIN_GAP = 1.5;

/** Spring constants: snappy for interactions, soft while the card builds itself on first view. */
const SPRINGS = {
  camera: { snappy: { stiffness: 70, damping: 17 }, soft: { stiffness: 14, damping: 7.5 } },
  layer: { snappy: { stiffness: 160, damping: 24 }, soft: { stiffness: 20, damping: 9 } },
};

/** Thresholds below which a spring counts as at rest. */
const REST = { cameraDistance: 0.03, cameraSpeed: 0.05, layerDistance: 0.3, layerSpeed: 0.6 };

/** Camera poses: face-on when stacked, tilted when exploded (degrees). */
const POSES = { stacked: { x: 0, z: 0 }, exploded: { x: 60, z: -14 } };

/** The idle sway waits `delay` ms after the last touch, then eases in over `easeIn` ms. */
const SWAY = { stacked: { delay: 900, easeIn: 2200 }, exploded: { delay: 1200, easeIn: 2400 } };

/** After taking the card apart, the idle sway holds off this long so the layers can land first. */
const SWAY_DELAY_AFTER_EXPLODE_MS = 1200;

type Camera = [rotateX: number, rotateY: number, rotateZ: number];

export interface Spring {
  value: number;
  velocity: number;
}

export interface CardState {
  camera: Spring[];
  layers: Spring[];
  /** Depth each layer is heading for; it only switches to a new goal once its start time arrives. */
  layerTargets: number[];
  /** When each layer may start moving (ms), so they lift or settle one after another. */
  layerStartAt: number[];
  /** 0 = stacked, 1 = fully exploded. */
  spread: number;
  pinned: number;
  exploded: boolean;
  flipped: boolean;
  /** Soft springs while it assembles itself on first view. */
  soft: boolean;
  /** Last interaction (ms); the idle sway eases in after it. */
  touchedAt: number;
  swayStartedAt: number;
}

const spring = (value: number): Spring => ({ value, velocity: 0 });

export function createCardState(now: number): CardState {
  return {
    camera: [spring(0), spring(0), spring(0)],
    layers: STACKED_DEPTHS.map(spring),
    layerTargets: [...STACKED_DEPTHS],
    layerStartAt: STACKED_DEPTHS.map(() => 0),
    spread: 0,
    pinned: -1,
    exploded: false,
    flipped: false,
    soft: false,
    touchedAt: now,
    swayStartedAt: now,
  };
}

/** Where a layer settles for the current spread and pin. */
export function restingDepth(state: CardState, layer: number): number {
  const stacked = STACKED_DEPTHS[layer] ?? 0;
  const spread = state.spread * (layer - (LAYER_COUNT - 1) / 2) * EXPLODE_SPREAD;
  const lift = state.pinned === layer ? PIN_LIFT : 0;
  return stacked + spread + lift;
}

/** How far the stack has opened, 0 to 1, from the top layer's actual depth. */
export function openness(state: CardState): number {
  const top = state.layers[LAYER_COUNT - 1]?.value ?? 0;
  const fullyOpen = ((LAYER_COUNT - 1) / 2) * EXPLODE_SPREAD;
  return clamp01((top - (STACKED_DEPTHS[LAYER_COUNT - 1] ?? 0)) / fullyOpen);
}

/**
 * Where the camera wants to be. After the card has been left alone for a moment, a gentle sway eases in
 * so it never looks frozen.
 */
function cameraTarget(state: CardState, now: number, calm: boolean): Camera {
  const pose = state.exploded ? POSES.exploded : POSES.stacked;
  const target: Camera = [pose.x, state.flipped ? 180 : 0, pose.z];
  if (calm || state.soft) {
    return target;
  }
  // Two slow sine waves at unrelated speeds, so the motion never visibly repeats (amplitudes in degrees).
  const seconds = (now - state.swayStartedAt) / 1000;
  const timing = state.exploded ? SWAY.exploded : SWAY.stacked;
  const ease = clamp01((now - state.touchedAt - timing.delay) / timing.easeIn);
  if (state.exploded) {
    target[2] += 7 * ease * Math.sin(seconds * 0.55);
    target[0] += 3 * ease * Math.sin(seconds * 0.41);
  } else {
    target[1] += 9 * ease * Math.sin(seconds * 0.55);
    target[0] += 5 * ease * Math.sin(seconds * 0.41 + 1.2);
  }
  return target;
}

/** Sets how far apart the layers are, staggering their start: bottom-up when opening, top-down when closing. */
export function setSpread(state: CardState, spread: number, now: number): void {
  state.spread = spread;
  const opening = spread > 0;
  const gapMs = state.soft ? 170 : 65;
  state.layerStartAt = state.layerStartAt.map((_, layer) =>
    opening ? now + layer * 80 : now + (LAYER_COUNT - 1 - layer) * gapMs,
  );
}

export interface SpringConstants {
  stiffness: number;
  damping: number;
}

/** Advances one spring by `dt` seconds toward `target`. */
export function stepSpring(
  s: Spring,
  target: number,
  { stiffness, damping }: SpringConstants,
  dt: number,
): void {
  s.velocity += ((target - s.value) * stiffness - damping * s.velocity) * dt;
  s.value += s.velocity * dt;
}

/**
 * Advances the whole card by `dt` seconds. Returns whether anything is still moving, so the animation
 * loop knows when it can stop.
 */
export function stepCard(state: CardState, dt: number, now: number, calm: boolean): boolean {
  const cameraStill = stepCamera(state, dt, now, calm);
  stepLayers(state, dt, now, calm);
  keepLayersApart(state);
  const layersSettled = layersAtRest(state, now);

  if (layersSettled && cameraStill && state.soft) {
    // The first-view build has finished: switch to snappy springs and start the idle sway from here.
    state.soft = false;
    restartIdle(state, now);
  }
  const swaying = !calm && !state.soft;
  return swaying || !cameraStill || !layersSettled;
}

function stepCamera(state: CardState, dt: number, now: number, calm: boolean): boolean {
  const target = cameraTarget(state, now, calm);
  const constants = state.soft ? SPRINGS.camera.soft : SPRINGS.camera.snappy;
  let still = true;
  state.camera.forEach((axis, i) => {
    const goal = target[i] ?? 0;
    if (calm) {
      axis.value = goal;
      axis.velocity = 0;
      return;
    }
    stepSpring(axis, goal, constants, dt);
    const moving =
      Math.abs(goal - axis.value) > REST.cameraDistance || Math.abs(axis.velocity) > REST.cameraSpeed;
    still &&= !moving;
  });
  return still;
}

function stepLayers(state: CardState, dt: number, now: number, calm: boolean): void {
  const constants = state.soft ? SPRINGS.layer.soft : SPRINGS.layer.snappy;
  state.layers.forEach((layer, i) => {
    if (now >= (state.layerStartAt[i] ?? 0)) {
      state.layerTargets[i] = restingDepth(state, i);
    }
    const goal = state.layerTargets[i] ?? layer.value;
    if (calm) {
      layer.value = goal;
      layer.velocity = 0;
      return;
    }
    stepSpring(layer, goal, constants, dt);
  });
}

/** A layer never sinks through the one below it, so nothing pops in and out while it settles. */
function keepLayersApart(state: CardState): void {
  for (let i = 1; i < state.layers.length; i++) {
    const below = state.layers[i - 1];
    const layer = state.layers[i];
    if (!below || !layer || layer.value >= below.value + MIN_GAP) {
      continue;
    }
    layer.value = below.value + MIN_GAP;
    layer.velocity = Math.max(layer.velocity, below.velocity);
  }
}

function layersAtRest(state: CardState, now: number): boolean {
  return state.layers.every((layer, i) => {
    const started = now >= (state.layerStartAt[i] ?? 0);
    const close = Math.abs(restingDepth(state, i) - layer.value) <= REST.layerDistance;
    return started && close && Math.abs(layer.velocity) <= REST.layerSpeed;
  });
}

/** Puts the card instantly in its waiting pose: exploded, tilted and unpinned (before it scrolls into view). */
export function snapToWaitingPose(state: CardState, now: number): void {
  Object.assign(state, { exploded: true, flipped: false, pinned: -1, spread: 1, soft: false });
  state.layers.forEach((layer, i) => {
    layer.value = restingDepth(state, i);
    layer.velocity = 0;
  });
  state.layerTargets = state.layers.map((layer) => layer.value);
  state.layerStartAt = state.layerStartAt.map(() => 0);
  state.camera = [spring(POSES.exploded.x), spring(0), spring(POSES.exploded.z)];
  restartIdle(state, now);
}

/** Counts as a fresh touch: the idle sway waits, then eases in from the start of its cycle. */
export function restartIdle(state: CardState, now: number): void {
  state.touchedAt = now;
  state.swayStartedAt = now;
}

/** Takes the card apart: layers lift bottom-up and the camera tilts. */
export function explode(state: CardState, now: number): void {
  state.exploded = true;
  state.pinned = -1;
  state.soft = false;
  state.swayStartedAt = now + SWAY_DELAY_AFTER_EXPLODE_MS;
  state.touchedAt = now;
  setSpread(state, 1, now);
}

/** Puts the card back together: layers settle top-down and the camera faces front. */
export function assemble(state: CardState, now: number): void {
  state.exploded = false;
  state.pinned = -1;
  state.touchedAt = now;
  setSpread(state, 0, now);
}

/** Puts the card together on soft springs, for the first time it scrolls into view. */
export function assembleSlowly(state: CardState, now: number): void {
  state.soft = true;
  assemble(state, now);
}

/** Turns the card over. */
export function toggleFlip(state: CardState, now: number): void {
  state.flipped = !state.flipped;
  state.touchedAt = now;
}

/** Lifts a layer out of the exploded stack, or drops it back if it is already lifted. */
export function togglePin(state: CardState, layer: number, now: number): void {
  state.pinned = state.pinned === layer ? -1 : layer;
  // A pin moves right away, even if the layers were still waiting for their turn.
  state.layerStartAt = state.layerStartAt.map((at) => Math.min(at, now));
  state.touchedAt = now;
}
