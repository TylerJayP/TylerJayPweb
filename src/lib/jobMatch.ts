import type { Skill, SkillGap } from '../content/types';

export interface SkillHit {
  name: string;
  evidence: string;
  clipAt?: number;
}

export interface MatchResult {
  hits: SkillHit[];
  /** Skills the posting asks for that the site has no evidence of. */
  gaps: string[];
  /** Share of recognised skills that matched, 0 to 100. */
  percent: number;
}

interface Compiled<T> {
  item: T;
  patterns: RegExp[];
}

const compile = <T extends { patterns: string[] }>(items: readonly T[]): Compiled<T>[] =>
  items.map((item) => ({ item, patterns: item.patterns.map((p) => new RegExp(p, 'i')) }));

/**
 * Builds a matcher once, so the regular expressions aren't recompiled on every keystroke.
 * Everything runs in the visitor's browser; nothing about the posting is sent anywhere.
 */
export function createJobMatcher(skills: readonly Skill[], gaps: readonly SkillGap[]) {
  const known = compile(skills);
  const unknown = compile(gaps);

  return function match(posting: string): MatchResult {
    if (!posting.trim()) {
      return { hits: [], gaps: [], percent: 0 };
    }
    // Padding lets patterns like "\bgo," see a boundary at either end.
    const text = ` ${posting.toLowerCase()} `;
    const mentions = <T>({ patterns }: Compiled<T>) => patterns.some((re) => re.test(text));

    const hits = known.filter(mentions).map(({ item }) => ({
      name: item.name,
      evidence: item.evidence,
      ...(item.clipAt !== undefined && { clipAt: item.clipAt }),
    }));
    const missing = unknown.filter(mentions).map(({ item }) => item.name);
    const total = hits.length + missing.length;

    return { hits, gaps: missing, percent: total ? Math.round((hits.length / total) * 100) : 0 };
  };
}
