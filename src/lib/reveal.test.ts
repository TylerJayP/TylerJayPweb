import { isOnScreen, revealDecision, shownClasses, staggerStep } from './reveal';

const scroll = { height: 1000, scrollingUp: false, atEnd: false };

describe('revealDecision', () => {
  it('hides a block that is completely off-screen', () => {
    expect(revealDecision({ top: 1200, bottom: 1500 }, scroll)).toBe('hide');
    expect(revealDecision({ top: -400, bottom: 0 }, scroll)).toBe('hide');
  });

  it('shows a block once its top passes the trigger line', () => {
    expect(revealDecision({ top: 650, bottom: 900 }, scroll)).toBe('show');
    expect(revealDecision({ top: 750, bottom: 1100 }, scroll)).toBe('wait');
  });

  it('uses the bottom edge when scrolling up', () => {
    const up = { ...scroll, scrollingUp: true };
    expect(revealDecision({ top: -200, bottom: 350 }, up)).toBe('show');
    expect(revealDecision({ top: -200, bottom: 250 }, up)).toBe('wait');
  });

  it('shows everything left on screen at the bottom of the page', () => {
    expect(revealDecision({ top: 900, bottom: 1100 }, { ...scroll, atEnd: true })).toBe('show');
  });
});

describe('isOnScreen', () => {
  it('counts any overlap with the screen', () => {
    expect(isOnScreen({ top: 990, bottom: 1300 }, 1000)).toBe(true);
    expect(isOnScreen({ top: 1000, bottom: 1300 }, 1000)).toBe(false);
  });
});

describe('staggerStep', () => {
  it('counts up through a batch and then holds', () => {
    expect([0, 1, 2, 3, 4, 5, 9].map(staggerStep)).toEqual([0, 1, 2, 3, 4, 4, 4]);
  });
});

describe('shownClasses', () => {
  it('marks the stagger, direction and whether it has settled', () => {
    expect(shownClasses({ stagger: 0, scrollingUp: false, instant: false, settled: false })).toBe(
      'rvin rvb0',
    );
    expect(shownClasses({ stagger: 2, scrollingUp: true, instant: false, settled: true })).toBe(
      'rvin rvb2 rvup rvdone',
    );
  });

  it('marks a block shown by keyboard focus so it skips its entrance', () => {
    expect(shownClasses({ stagger: 0, scrollingUp: false, instant: true, settled: false })).toBe(
      'rvin rvb0 rvnow',
    );
  });
});
