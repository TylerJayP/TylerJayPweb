import type { Ref } from 'react';
import type { Project } from '../../content/types';
import { site } from '../../content/site';
import { placedCount } from '../../lib/markBoard';
import { revealDelay } from '../../hooks/reveal';
import { CodeIcon, ExternalIcon } from '../icons';
import styles from './PartsList.module.css';

interface PartsListProps {
  projects: readonly Project[];
  placed: readonly boolean[];
  current: number;
  onPick: (index: number) => void;
  revealRef: Ref<HTMLDivElement>;
  revealClass: string;
}

const screensNote = (count: number) => (count ? ` · ${count} ${count === 1 ? 'screen' : 'screens'}` : '');

/** The six projects as a parts list, with a progress bar of how many parts are in place. */
export function PartsList({ projects, placed, current, onPick, revealRef, revealClass }: PartsListProps) {
  return (
    <div ref={revealRef} className={`rv ${revealClass} ${styles.parts}`}>
      <div className={`rvi ${styles.header}`} style={revealDelay(0)}>
        <p className="eyebrow">Parts list</p>
        <p className={styles.count}>{placedCount(placed)} of 6 in place</p>
      </div>

      <div className={`rseg ${styles.bars}`} aria-hidden="true">
        {projects.map((project, i) => (
          <span
            key={project.piece}
            className={`${styles.bar} ${placed[i] ? styles.barPlaced : ''} ${i === current ? styles.barCurrent : ''}`}
          />
        ))}
      </div>

      <ol className={`rlist ${styles.list}`}>
        {projects.map((project, i) => {
          const isCurrent = i === current;
          const inPlace = placed[i] ?? false;
          return (
            <li key={project.piece}>
              <button
                type="button"
                className={`${styles.row} ${isCurrent ? styles.rowCurrent : ''}`}
                aria-pressed={isCurrent}
                onClick={() => onPick(i)}
              >
                <span className={styles.number} aria-hidden="true">
                  {i + 1}
                </span>
                <svg
                  className={`${styles.icon} ${inPlace ? styles.iconPlaced : ''}`}
                  viewBox={project.iconViewBox}
                  width={34}
                  height={26}
                  preserveAspectRatio="xMidYMid meet"
                  aria-hidden="true"
                >
                  <path d={project.path} />
                </svg>
                <span className={styles.text}>
                  <span className={styles.name}>{project.name}</span>
                  <span className={styles.meta}>
                    {project.piece}
                    {screensNote(project.screenshots.length)}
                  </span>
                </span>
                <span className={`${styles.tick} ${inPlace ? styles.tickPlaced : ''}`}>
                  {inPlace ? 'In place' : 'Loose'}
                </span>
              </button>
            </li>
          );
        })}
      </ol>

      <a
        href={site.github.url}
        target="_blank"
        rel="noopener noreferrer"
        className={`pill-link rvi ${styles.github}`}
        style={revealDelay(12)}
      >
        <CodeIcon />
        See all my code on GitHub
        <ExternalIcon />
      </a>
    </div>
  );
}
