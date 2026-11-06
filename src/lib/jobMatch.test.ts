import { createJobMatcher } from './jobMatch';
import { samplePostings, skillGaps, skills } from '../content/skills';

const match = createJobMatcher(
  [
    { name: 'C#', patterns: ['c#', 'csharp'], evidence: 'Virtual Dyno', clipAt: 147.51 },
    { name: 'C', patterns: ['\\bc\\b(?![#+])'], evidence: 'I TA CS 1380' },
    { name: 'React', patterns: ['react'], evidence: 'TrulyOkay' },
  ],
  [{ name: 'Rust', patterns: ['\\brust\\b'] }],
);

describe('createJobMatcher', () => {
  it('returns nothing for an empty posting', () => {
    expect(match('   ')).toEqual({ hits: [], gaps: [], percent: 0 });
  });

  it('matches case-insensitively and keeps video timestamps', () => {
    const result = match('We use C# and REACT daily.');
    expect(result.hits.map((h) => h.name)).toEqual(['C#', 'React']);
    expect(result.hits[0]?.clipAt).toBe(147.51);
    expect(result.hits[1]).not.toHaveProperty('clipAt');
  });

  it('does not count C# or C++ as plain C', () => {
    expect(match('C# and C++').hits.map((h) => h.name)).toEqual(['C#']);
    expect(match('Strong C skills').hits.map((h) => h.name)).toEqual(['C']);
  });

  it('reports gaps and the share that matched', () => {
    const result = match('React and Rust');
    expect(result.gaps).toEqual(['Rust']);
    expect(result.percent).toBe(50);
  });

  it('matches every skill in the .NET sample posting', () => {
    const real = createJobMatcher(skills, skillGaps);
    const result = real(samplePostings[0]!.text);
    expect(result.hits.length).toBeGreaterThan(5);
    expect(result.percent).toBe(100);
  });
});
