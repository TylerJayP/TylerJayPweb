import { clamp, clamp01 } from './math';

describe('clamp', () => {
  it('leaves values inside the range alone', () => {
    expect(clamp(5, 0, 10)).toBe(5);
  });

  it('pulls values back to the nearest edge', () => {
    expect(clamp(-3, 0, 10)).toBe(0);
    expect(clamp(14, 0, 10)).toBe(10);
  });
});

describe('clamp01', () => {
  it('keeps progress between 0 and 1', () => {
    expect(clamp01(-0.5)).toBe(0);
    expect(clamp01(0.25)).toBe(0.25);
    expect(clamp01(1.5)).toBe(1);
  });
});
