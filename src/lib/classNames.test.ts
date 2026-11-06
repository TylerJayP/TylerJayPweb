import { classNames } from './classNames';

describe('classNames', () => {
  it('joins the names that are switched on', () => {
    expect(classNames('card', false, 'open', undefined, null, 'dark')).toBe('card open dark');
  });

  it('skips empty strings so there are no stray spaces', () => {
    expect(classNames('card', '')).toBe('card');
  });

  it('returns an empty string when nothing is on', () => {
    expect(classNames(false, undefined)).toBe('');
  });
});
