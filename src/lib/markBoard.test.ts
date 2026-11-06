import { initialPlacement, placeAll, placePart, placedCount, viewLabel } from './markBoard';

describe('mark board', () => {
  it('starts with only the first part in place', () => {
    expect(initialPlacement()).toEqual([true, false, false, false, false, false]);
    expect(viewLabel(initialPlacement())).toBe('Exploded');
  });

  it('places a part without mutating the old state', () => {
    const before = initialPlacement();
    const after = placePart(before, 3);
    expect(before[3]).toBe(false);
    expect(placedCount(after)).toBe(2);
    expect(viewLabel(after)).toBe('Going together');
  });

  it('is assembled once every part is placed', () => {
    expect(viewLabel(placeAll())).toBe('Assembled');
  });
});
