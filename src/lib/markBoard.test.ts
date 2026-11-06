import {
  boardReducer,
  initialBoard,
  initialPlacement,
  placeAll,
  placePart,
  placedCount,
  viewLabel,
} from './markBoard';

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

describe('boardReducer', () => {
  it('opens a project, places its part and starts at its first screenshot', () => {
    const start = { ...initialBoard(), shot: 2 };
    const next = boardReducer(start, { type: 'open', project: 4 });
    expect(next.current).toBe(4);
    expect(next.placed[4]).toBe(true);
    expect(next.shot).toBe(0);
  });

  it('keeps the screenshot when the open project is picked again', () => {
    const start = { ...initialBoard(), shot: 2 };
    expect(boardReducer(start, { type: 'open', project: 0 }).shot).toBe(2);
  });

  it('wraps around when stepping through screenshots', () => {
    const start = initialBoard();
    expect(boardReducer(start, { type: 'showShot', shot: -1, shotCount: 5 }).shot).toBe(4);
    expect(boardReducer(start, { type: 'showShot', shot: 5, shotCount: 5 }).shot).toBe(0);
  });

  it('places everything, or takes it back to the start', () => {
    const assembled = boardReducer(initialBoard(), { type: 'placeAll' });
    expect(placedCount(assembled.placed)).toBe(6);
    const opened = boardReducer(assembled, { type: 'open', project: 3 });
    expect(boardReducer(opened, { type: 'reset' })).toEqual(initialBoard());
  });
});
