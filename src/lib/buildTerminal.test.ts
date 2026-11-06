import { buildFrame } from './buildTerminal';

describe('buildFrame', () => {
  it('starts by typing the command', () => {
    const frame = buildFrame(0.1, false, 0);
    expect(frame.command.length).toBeGreaterThan(0);
    expect(frame.command.length).toBeLessThan('tjp build --all'.length);
    expect(frame.commandTyping).toBe(true);
    expect(frame.steps).toHaveLength(0);
  });

  it('counts steps down from 5 and marks finished ones ok', () => {
    const frame = buildFrame(2.5, false, 0);
    expect(frame.steps.map((s) => s.number)).toEqual([5, 4, 3]);
    expect(frame.steps.slice(0, 2).every((s) => s.done && s.status === 'ok')).toBe(true);
    expect(frame.steps[2]?.active).toBe(true);
    expect(frame.progress.slice(0, 3)).toEqual([1, 1, 0.5]);
  });

  it('finishes, then hands over to the video', () => {
    expect(buildFrame(5, false, 0)).toMatchObject({ built: true, showPlayer: false, showTerminal: true });
    expect(buildFrame(5.8, false, 0)).toMatchObject({ showPlayer: true, showTerminal: true });
    expect(buildFrame(6.4, false, 0)).toMatchObject({ showPlayer: true, showTerminal: false });
  });

  it('says rebuild when replayed', () => {
    const frame = buildFrame(6, true, 0);
    expect(frame.command).toBe('tjp rebuild --all');
    expect(frame.steps[0]?.text).toBe('rebuilding TrulyOkay');
    expect(frame.doneMessage).toMatch(/^Rebuild succeeded/);
  });

  it('counts the clock down to zero', () => {
    expect(buildFrame(0, false, 0).clock).toBe('00:05.00');
    expect(buildFrame(9, false, 0).clock).toBe('00:00.00');
  });
});
