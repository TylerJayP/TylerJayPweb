import type { Project } from '../../content/types';
import { revealDelay } from '../../hooks/reveal';
import { Gallery } from './Gallery';
import styles from './ProjectDetail.module.css';

interface ProjectDetailProps {
  project: Project;
  number: number;
  shot: number;
  onSelectShot: (index: number) => void;
  onOpenShots: () => void;
}

/** The open project: what it is, why I built it, what it's built with, and its screenshots. */
export function ProjectDetail({ project, number, shot, onSelectShot, onOpenShots }: ProjectDetailProps) {
  const hasShots = project.screenshots.length > 0;

  return (
    <article aria-live="polite" className={`bm-art ${styles.article} ${hasShots ? '' : styles.noShots}`}>
      <div className={`rvi ${styles.head}`} style={revealDelay(0)}>
        <p className={styles.meta}>
          <span className={styles.number}>{number}</span>
          {project.piece} · {project.kind} ·{' '}
          <span className={project.live ? styles.live : undefined}>{project.status}</span>
        </p>
        <h3 className={`display ${styles.name}`}>{project.name}</h3>
        <p className={styles.description}>{project.description}</p>
      </div>

      {hasShots && (
        <Gallery
          className={styles.gallery}
          projectName={project.name}
          screenshots={project.screenshots}
          current={shot}
          onSelect={onSelectShot}
          onOpen={onOpenShots}
        />
      )}

      <div className={`rvi ${styles.why}`} style={revealDelay(5)}>
        <p className={styles.whyLabel}>Why I built it</p>
        <p className={styles.whyText}>{project.why}</p>
      </div>

      <ul role="list" aria-label="Built with" className={`rvi ${styles.tags}`} style={revealDelay(7)}>
        {project.stack.map((tool) => (
          <li key={tool}>{tool}</li>
        ))}
      </ul>
    </article>
  );
}
