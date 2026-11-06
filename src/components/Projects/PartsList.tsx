import { site } from '../../content/site';
import type { Project } from '../../content/types';
import { revealDelay, useReveal } from '../../hooks/useReveal';
import { classNames } from '../../lib/classNames';
import { placedCount } from '../../lib/markBoard';
import { CodeIcon, ExternalIcon } from '../icons';
import styles from './PartsList.module.css';

interface PartsListProps {
  projects: readonly Project[];
  placed: readonly boolean[];
  current: number;
  onPick: (index: number) => void;
}

/** " · 3 screens" after a project with screenshots; nothing for one without. */
function screensNote(count: number): string {
  if (!count) {
    return '';
  }
  return ` · ${count} ${count === 1 ? 'screen' : 'screens'}`;
}

/** The six projects as a parts list, with a progress bar of how many parts are in place. */
export function PartsList({ projects, placed, current, onPick }: PartsListProps) {
  const reveal = useReveal('parts-list');
  return (
    <div ref={reveal.ref} className={classNames(reveal.className, styles.parts)}>
      <div className={classNames('rvi', styles.header)} style={revealDelay(0)}>
        <p className="eyebrow">Parts list</p>
        <p className={styles.count}>
          {placedCount(placed)} of {placed.length} in place
        </p>
      </div>

      <div className={classNames('rseg', styles.bars)} aria-hidden="true">
        {projects.map((project, i) => (
          <span
            key={project.piece}
            className={classNames(
              styles.bar,
              placed[i] && styles.barPlaced,
              i === current && styles.barCurrent,
            )}
          />
        ))}
      </div>

      <ol className={classNames('rlist', styles.list)}>
        {projects.map((project, i) => (
          <li key={project.piece}>
            <PartRow
              project={project}
              number={i + 1}
              inPlace={placed[i] ?? false}
              current={i === current}
              onPick={() => onPick(i)}
            />
          </li>
        ))}
      </ol>

      <a
        href={site.github.url}
        target="_blank"
        rel="noopener noreferrer"
        className={classNames('pill-link', 'rvi', styles.github)}
        style={revealDelay(12)}
      >
        <CodeIcon />
        See all my code on GitHub
        <ExternalIcon />
      </a>
    </div>
  );
}

interface PartRowProps {
  project: Project;
  number: number;
  inPlace: boolean;
  current: boolean;
  onPick: () => void;
}

function PartRow({ project, number, inPlace, current, onPick }: PartRowProps) {
  return (
    <button
      type="button"
      className={classNames(styles.row, current && styles.rowCurrent)}
      aria-pressed={current}
      onClick={onPick}
    >
      <span className={styles.number} aria-hidden="true">
        {number}
      </span>
      <svg
        className={classNames(styles.icon, inPlace && styles.iconPlaced)}
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
      <span className={classNames(styles.tick, inPlace && styles.tickPlaced)}>
        {inPlace ? 'In place' : 'Loose'}
      </span>
    </button>
  );
}
