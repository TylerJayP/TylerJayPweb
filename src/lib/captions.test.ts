import { captionAt } from './captions';

const cues = [
  { start: 0.27, end: 2.42, text: 'Hi there' },
  { start: 2.42, end: 6.78, text: 'the build worked' },
  { start: 15.55, end: 18.29, text: 'Salt Lake City' },
];

describe('captionAt', () => {
  it('finds the line being spoken', () => {
    expect(captionAt(cues, 1)).toBe('Hi there');
    expect(captionAt(cues, 16)).toBe('Salt Lake City');
  });

  it('switches exactly at the boundary', () => {
    expect(captionAt(cues, 2.42)).toBe('the build worked');
  });

  it('is empty between lines and before the first', () => {
    expect(captionAt(cues, 0.1)).toBe('');
    expect(captionAt(cues, 10)).toBe('');
  });
});
