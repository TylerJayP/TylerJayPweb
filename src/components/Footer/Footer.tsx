import type { MouseEvent } from 'react';
import { MARK_PATHS, MARK_VIEWBOX, site } from '../../content/site';
import { revealDelay, useReveal } from '../../hooks/useReveal';
import { classNames } from '../../lib/classNames';
import styles from './Footer.module.css';

/** The footer mark draws one letter after another, this far apart. */
const MARK_LETTER_GAP_MS = 130;

interface FooterProps {
  onOpenResume: (event: MouseEvent) => void;
}

export function Footer({ onOpenResume }: FooterProps) {
  const reveal = useReveal('footer');

  return (
    <footer ref={reveal.ref} className={classNames(reveal.className, styles.footer)}>
      <div className={styles.inner}>
        {/* The mark draws itself, letter by letter, as the footer scrolls in. */}
        <svg
          className={styles.mark}
          viewBox={MARK_VIEWBOX}
          width={52}
          height={32}
          fill="currentColor"
          aria-hidden="true"
        >
          {MARK_PATHS.map((d, i) => (
            <path
              key={d}
              className="rfp"
              style={{ '--rvd': `${i * MARK_LETTER_GAP_MS}ms` }}
              pathLength={1}
              stroke="currentColor"
              strokeWidth={30}
              strokeLinejoin="round"
              d={d}
            />
          ))}
        </svg>
        <nav aria-label="Elsewhere" className={classNames('rvi', styles.links)} style={revealDelay(8)}>
          <a href={`mailto:${site.email}`}>Email</a>
          <a href={site.linkedin.url} target="_blank" rel="noopener noreferrer">
            LinkedIn
          </a>
          <a href={site.github.url} target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
          <a href="#resume" onClick={onOpenResume} aria-haspopup="dialog">
            Resume
          </a>
        </nav>
        <span className="rvi" style={revealDelay(10)}>
          © 2026 {site.name} · {site.location}
        </span>
      </div>
    </footer>
  );
}
