import { formatClock, wrapIndex } from './format';

describe('formatClock', () => {
  it('pads seconds and drops fractions', () => {
    expect(formatClock(0)).toBe('0:00');
    expect(formatClock(7.9)).toBe('0:07');
    expect(formatClock(147.51)).toBe('2:27');
  });

  it('never goes negative', () => {
    expect(formatClock(-3)).toBe('0:00');
  });
});

describe('wrapIndex', () => {
  it('wraps both ways', () => {
    expect(wrapIndex(6, 6)).toBe(0);
    expect(wrapIndex(-1, 6)).toBe(5);
    expect(wrapIndex(2, 6)).toBe(2);
  });

  it('handles an empty list', () => {
    expect(wrapIndex(3, 0)).toBe(0);
  });
});
