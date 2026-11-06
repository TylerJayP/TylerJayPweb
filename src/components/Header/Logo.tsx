import type { CSSProperties } from 'react';
import { projects } from '../../content/projects';
import styles from './Logo.module.css';

/** Each piece starts drawing 110 ms after the one before it. */
const DRAW_STEP_MS = 110;

/**
 * The TJP monogram. In the intro its six pieces draw themselves in turn, fill, and then a foil layer
 * sweeps across (see styles/intro.css). The pieces are the same six parts as the Selected Projects board.
 */
export function Logo() {
  return (
    <span className={styles.logo} aria-hidden="true">
      <svg viewBox="270 234 1037 635">
        {projects.map((project, i) => (
          <path
            key={project.piece}
            className="logo-piece"
            style={{ '--draw-at': `${i * DRAW_STEP_MS}ms` } as CSSProperties}
            d={project.path}
            pathLength={1}
            strokeWidth={9}
            strokeLinejoin="round"
          />
        ))}
      </svg>
      <span className={`${styles.foilWrap} logo-foil-wrap`}>
        <span className={`${styles.foil} logo-foil`} />
      </span>
    </span>
  );
}
