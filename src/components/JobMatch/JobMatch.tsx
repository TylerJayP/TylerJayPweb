import { useMemo, useState } from 'react';
import { samplePostings, skillGaps, skills } from '../../content/skills';
import { revealDelay, useReveal } from '../../hooks/useReveal';
import { classNames } from '../../lib/classNames';
import { formatClock } from '../../lib/format';
import { createJobMatcher, type MatchResult, type SkillHit } from '../../lib/jobMatch';
import { RevealWords } from '../common/RevealWords';
import { SmallPlayIcon } from '../icons';
import styles from './JobMatch.module.css';

const matchPosting = createJobMatcher(skills, skillGaps);
/** Phones show this many matches before "Show all". */
const COLLAPSED_COUNT = 3;
/** "Hear it" starts a hair after the cue, so the first word isn't clipped. */
const CLIP_LEAD_IN = 0.05;

type HearHandler = (seconds: number) => void;

interface JobMatchProps {
  /** Plays the part of the intro video where I talk about a skill. */
  onHear: HearHandler;
}

/** "Hiring?": paste a job posting and see which of its skills I can show, all in the browser. */
export function JobMatch({ onHear }: JobMatchProps) {
  const [posting, setPosting] = useState(samplePostings[0]?.text ?? '');
  const result = useMemo(() => matchPosting(posting), [posting]);
  const reveal = useReveal('job-match');

  return (
    <div ref={reveal.ref} className={classNames(reveal.className, 'rpanel', styles.panel)}>
      <div className={styles.top}>
        <div className={styles.titles}>
          <p className={classNames('eyebrow', 'rvi', styles.kicker)} style={revealDelay(4)}>
            Hiring?
          </p>
          <h2 className={classNames('display', styles.title)}>
            <RevealWords text="Paste your job posting" from={5} />
          </h2>
        </div>
        <p className={classNames('rvi', styles.intro)} style={revealDelay(9)}>
          I'll show you where my experience lines up, with the project or job that proves it. Nothing leaves
          your browser.
        </p>
      </div>

      <div className={classNames('rvi', styles.input)} style={revealDelay(10)}>
        <label className="visually-hidden" htmlFor="job-posting">
          Job description
        </label>
        <textarea
          id="job-posting"
          className={styles.posting}
          rows={5}
          value={posting}
          onChange={(event) => setPosting(event.target.value)}
          placeholder="Paste a job description here"
        />
        <SamplePicker posting={posting} onPick={setPosting} />
      </div>

      <div className={classNames('rvi', styles.results)} style={revealDelay(12)}>
        {result.hits.length > 0 ? (
          <Matches result={result} onHear={onHear} />
        ) : (
          <p className={styles.empty}>{emptyMessage(posting)}</p>
        )}
      </div>
    </div>
  );
}

function emptyMessage(posting: string): string {
  if (posting.trim()) {
    return "I didn't spot any skills I could match in that one. Try pasting the requirements section.";
  }
  return 'Paste a posting above, or tap a sample, and your matches show up here.';
}

/** Sample postings to try, and a way to clear the box. */
function SamplePicker({ posting, onPick }: { posting: string; onPick: (text: string) => void }) {
  return (
    <div className={classNames('rchips', styles.samples)}>
      <span className={styles.samplesLabel}>Or try a sample:</span>
      {samplePostings.map((sample) => (
        <button
          key={sample.label}
          type="button"
          className={styles.sample}
          aria-pressed={posting === sample.text}
          onClick={() => onPick(sample.text)}
        >
          {sample.label}
        </button>
      ))}
      <button type="button" className={styles.clear} onClick={() => onPick('')}>
        Clear
      </button>
    </div>
  );
}

/** How many skills match, each with its evidence, and the ones I can't show yet. */
function Matches({ result, onHear }: { result: MatchResult; onHear: HearHandler }) {
  const [showAll, setShowAll] = useState(false);
  const { hits, gaps, percent } = result;
  const total = hits.length + gaps.length;

  return (
    <div className={styles.result}>
      <div className={styles.summary}>
        <p className={classNames('display', styles.headline)}>
          {hits.length} of the {total} skills I found in this posting match my experience
        </p>
        <div className={styles.meter} aria-hidden="true">
          <div className={styles.meterFill} style={{ width: `${percent}%` }} />
        </div>
      </div>
      <div className={classNames(styles.hits, !showAll && styles.collapsed)}>
        {hits.map((hit) => (
          <MatchedSkill key={hit.name} hit={hit} onHear={onHear} />
        ))}
      </div>
      {hits.length > COLLAPSED_COUNT && (
        <button type="button" className={styles.more} onClick={() => setShowAll((all) => !all)}>
          {showAll ? 'Show fewer' : `Show all ${hits.length} matches`}
        </button>
      )}
      {gaps.length > 0 && (
        <p className={styles.gaps}>
          <strong>Not on this site yet:</strong> {gaps.join(', ')}. <a href="#contact">Ask me about them</a>.
        </p>
      )}
    </div>
  );
}

function MatchedSkill({ hit, onHear }: { hit: SkillHit; onHear: HearHandler }) {
  const { name, evidence, clipAt } = hit;
  return (
    <div className={styles.hit}>
      <p className={styles.hitName}>
        <span className={styles.check} aria-hidden="true">
          ✓
        </span>
        {name}
      </p>
      <p className={styles.evidence}>{evidence}</p>
      {clipAt !== undefined && (
        <button type="button" className={styles.hear} onClick={() => onHear(clipAt + CLIP_LEAD_IN)}>
          <SmallPlayIcon />
          Hear it · {formatClock(clipAt)}
        </button>
      )}
    </div>
  );
}
