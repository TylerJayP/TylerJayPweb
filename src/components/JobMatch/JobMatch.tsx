import { useMemo, useState } from 'react';
import { samplePostings, skillGaps, skills } from '../../content/skills';
import { createJobMatcher } from '../../lib/jobMatch';
import { formatClock } from '../../lib/format';
import { revealDelay, useReveal } from '../../hooks/reveal';
import { RevealWords } from '../common/RevealWords';
import { SmallPlayIcon } from '../icons';
import styles from './JobMatch.module.css';

const matchPosting = createJobMatcher(skills, skillGaps);
/** Phones show this many matches before "Show all". */
const COLLAPSED_COUNT = 3;

interface JobMatchProps {
  /** Plays the part of the intro video where I talk about a skill. */
  onHear: (seconds: number) => void;
}

/** "Hiring?": paste a job posting and see which of its skills I can show, all in the browser. */
export function JobMatch({ onHear }: JobMatchProps) {
  const [posting, setPosting] = useState(samplePostings[0]?.text ?? '');
  const [showAll, setShowAll] = useState(false);
  const result = useMemo(() => matchPosting(posting), [posting]);
  const reveal = useReveal('job');
  const total = result.hits.length + result.gaps.length;

  return (
    <div ref={reveal.ref} className={`rv rpanel ${reveal.className} ${styles.panel}`}>
      <div className={styles.top}>
        <div className={styles.titles}>
          <p className={`eyebrow rvi ${styles.kicker}`} style={revealDelay(4)}>
            Hiring?
          </p>
          <h2 className={`display ${styles.title}`}>
            <RevealWords text="Paste your job posting" from={5} />
          </h2>
        </div>
        <p className={`rvi ${styles.intro}`} style={revealDelay(9)}>
          I'll show you where my experience lines up, with the project or job that proves it. Nothing leaves
          your browser.
        </p>
      </div>

      <div className={`rvi ${styles.input}`} style={revealDelay(10)}>
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
        <div className={`rchips ${styles.samples}`}>
          <span className={styles.samplesLabel}>Or try a sample:</span>
          {samplePostings.map((sample) => (
            <button
              key={sample.label}
              type="button"
              className={styles.sample}
              aria-pressed={posting === sample.text}
              onClick={() => setPosting(sample.text)}
            >
              {sample.label}
            </button>
          ))}
          <button type="button" className={styles.clear} onClick={() => setPosting('')}>
            Clear
          </button>
        </div>
      </div>

      <div className={`rvi ${styles.results}`} style={revealDelay(12)}>
        {result.hits.length > 0 ? (
          <div className={styles.result}>
            <div className={styles.summary}>
              <p className={`display ${styles.headline}`}>
                {result.hits.length} of the {total} skills I found in this posting match my experience
              </p>
              <div className={styles.meter} aria-hidden="true">
                <div className={styles.meterFill} style={{ width: `${result.percent}%` }} />
              </div>
            </div>
            <div className={`${styles.hits} ${showAll ? '' : styles.collapsed}`}>
              {result.hits.map((hit) => (
                <div key={hit.name} className={styles.hit}>
                  <p className={styles.hitName}>
                    <span className={styles.check} aria-hidden="true">
                      ✓
                    </span>
                    {hit.name}
                  </p>
                  <p className={styles.evidence}>{hit.evidence}</p>
                  {hit.clipAt !== undefined && (
                    <button type="button" className={styles.hear} onClick={() => onHear(hit.clipAt! + 0.05)}>
                      <SmallPlayIcon />
                      Hear it · {formatClock(hit.clipAt)}
                    </button>
                  )}
                </div>
              ))}
            </div>
            {result.hits.length > COLLAPSED_COUNT && (
              <button type="button" className={styles.more} onClick={() => setShowAll((all) => !all)}>
                {showAll ? 'Show fewer' : `Show all ${result.hits.length} matches`}
              </button>
            )}
            {result.gaps.length > 0 && (
              <p className={styles.gaps}>
                <strong>Not on this site yet:</strong> {result.gaps.join(', ')}.{' '}
                <a href="#contact">Ask me about them</a>.
              </p>
            )}
          </div>
        ) : (
          <p className={styles.empty}>
            {posting.trim()
              ? "I didn't spot any skills I could match in that one. Try pasting the requirements section."
              : 'Paste a posting above, or tap a sample, and your matches show up here.'}
          </p>
        )}
      </div>
    </div>
  );
}
