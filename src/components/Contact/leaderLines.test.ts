import { createCardState, snapToWaitingPose } from './cardPhysics';
import { leaderOpacity, leaderPath } from './leaderLines';

const box = (left: number, top: number, width: number, height: number) => ({ left, top, width, height });

describe('leaderPath', () => {
  it('runs from the middle of the dot to the left edge of the label', () => {
    const path = leaderPath(box(110, 60, 10, 10), box(300, 80, 100, 20), box(100, 50, 500, 300), 1);
    expect(path).toBe('M15.0 15.0 L178.0 40.0 L200.0 40.0');
  });

  it('undoes the stage scale', () => {
    const path = leaderPath(box(110, 60, 10, 10), box(300, 80, 100, 20), box(100, 50, 250, 150), 0.5);
    expect(path).toBe('M30.0 30.0 L378.0 80.0 L400.0 80.0');
  });
});

describe('leaderOpacity', () => {
  it('is hidden while the card is stacked', () => {
    expect(leaderOpacity(createCardState(0), 0)).toBe(0);
  });

  it('is fully visible once the card is open', () => {
    const state = createCardState(0);
    snapToWaitingPose(state, 0);
    expect(leaderOpacity(state, 3)).toBe(1);
  });

  it('dims the other lines while one layer is pinned', () => {
    const state = createCardState(0);
    snapToWaitingPose(state, 0);
    state.pinned = 2;
    expect(leaderOpacity(state, 2)).toBe(1);
    expect(leaderOpacity(state, 4)).toBe(0.25);
  });
});
