import {
  createCardState,
  LAYER_COUNT,
  openness,
  restingDepth,
  setSpread,
  snapToWaitingPose,
  STACKED_DEPTHS,
  stepCard,
  stepSpring,
} from './cardPhysics';

/** Runs the simulation at 60 fps for `seconds`, returning whether it was still moving at the end. */
function simulate(state: ReturnType<typeof createCardState>, seconds: number, calm = false) {
  let moving = true;
  const frames = Math.round(seconds * 60);
  for (let frame = 1; frame <= frames; frame++) {
    moving = stepCard(state, 1 / 60, (frame * 1000) / 60, calm);
  }
  return moving;
}

describe('stepSpring', () => {
  it('converges on its target', () => {
    const s = { value: 0, velocity: 0 };
    for (let i = 0; i < 600; i++) {
      stepSpring(s, 10, { stiffness: 70, damping: 17 }, 1 / 60);
    }
    expect(s.value).toBeCloseTo(10, 3);
    expect(Math.abs(s.velocity)).toBeLessThan(0.001);
  });
});

describe('card physics', () => {
  it('starts stacked at the resting depths', () => {
    const state = createCardState(0);
    expect(state.layers.map((l) => l.value)).toEqual([...STACKED_DEPTHS]);
    expect(openness(state)).toBe(0);
  });

  it('spreads the layers apart symmetrically when exploded', () => {
    const state = createCardState(0);
    state.exploded = true;
    setSpread(state, 1, 0);
    simulate(state, 3);
    const depths = state.layers.map((l) => l.value);
    expect(depths[LAYER_COUNT - 1]).toBeCloseTo(restingDepth(state, LAYER_COUNT - 1), 0);
    expect(openness(state)).toBeGreaterThan(0.95);
  });

  it('never lets a layer pass through the one below it', () => {
    const state = createCardState(0);
    state.exploded = true;
    setSpread(state, 1, 0);
    for (let frame = 1; frame <= 120; frame++) {
      stepCard(state, 1 / 60, (frame * 1000) / 60, false);
      const depths = state.layers.map((l) => l.value);
      depths
        .slice(1)
        .forEach((depth, i) => expect(depth).toBeGreaterThanOrEqual((depths[i] ?? 0) + 1.5 - 1e-9));
    }
  });

  it('lifts a pinned layer out of the stack', () => {
    const state = createCardState(0);
    state.pinned = 2;
    expect(restingDepth(state, 2) - (STACKED_DEPTHS[2] ?? 0)).toBe(40);
  });

  it('jumps straight to its targets with reduced motion', () => {
    const state = createCardState(0);
    state.exploded = true;
    setSpread(state, 1, 0);
    simulate(state, 1.5, true);
    expect(state.camera[0]?.value).toBe(60);
    expect(state.layers.map((l, i) => l.value - restingDepth(state, i))).toEqual(Array(LAYER_COUNT).fill(0));
  });

  it('waits exploded and tilted until it is shown', () => {
    const state = createCardState(0);
    snapToWaitingPose(state, 0);
    expect(state.exploded).toBe(true);
    expect(state.camera.map((c) => c.value)).toEqual([60, 0, -14]);
    expect(openness(state)).toBe(1);
  });
});
