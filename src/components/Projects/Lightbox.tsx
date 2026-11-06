import { useRef } from 'react';
import type { Screenshot } from '../../content/types';
import { useExitAnimation, useModal } from '../../hooks/useDialog';
import { ChevronLeftIcon, ChevronRightIcon, CloseIcon } from '../icons';
import styles from './Lightbox.module.css';

interface LightboxProps {
  open: boolean;
  projectName: string;
  screenshots: readonly Screenshot[];
  current: number;
  onStep: (delta: number) => void;
  onClose: () => void;
}

const EXIT_MS = 180;

/** Full-size screenshots. Arrow keys step through them; Escape or the backdrop closes it. */
export function Lightbox({ open, projectName, screenshots, current, onStep, onClose }: LightboxProps) {
  const { mounted, closing } = useExitAnimation(open, EXIT_MS);
  const container = useRef<HTMLDivElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);

  useModal(open, {
    containerRef: container,
    initialFocusRef: closeButton,
    onClose,
    onKeyDown: (event) => {
      if (event.key === 'ArrowLeft') onStep(-1);
      if (event.key === 'ArrowRight') onStep(1);
    },
  });

  const shot = screenshots[current];
  if (!mounted || !shot) return null;
  const many = screenshots.length > 1;

  return (
    <div
      ref={container}
      className={`${styles.lightbox} ${closing ? styles.closing : ''}`}
      role="dialog"
      aria-modal="true"
      aria-label={`Screenshots of ${projectName}`}
    >
      <div className={styles.backdrop} onClick={onClose} />
      <div className={styles.top}>
        <span className={styles.label}>
          <span className={styles.project}>{projectName}</span>
          <span className={styles.counter}>
            {' '}
            · {current + 1} of {screenshots.length}
          </span>
        </span>
        <button
          ref={closeButton}
          type="button"
          className={styles.button}
          onClick={onClose}
          aria-label="Close screenshots"
        >
          <CloseIcon />
        </button>
      </div>
      <figure className={styles.figure}>
        <img
          className={styles.image}
          src={shot.src}
          alt={shot.caption}
          width={shot.width}
          height={shot.height}
          decoding="async"
        />
        <figcaption className={styles.caption}>{shot.caption}</figcaption>
      </figure>
      {many && (
        <>
          <button
            type="button"
            className={`${styles.button} ${styles.nav} ${styles.prev}`}
            onClick={() => onStep(-1)}
            aria-label="Previous screenshot"
          >
            <ChevronLeftIcon />
          </button>
          <button
            type="button"
            className={`${styles.button} ${styles.nav} ${styles.next}`}
            onClick={() => onStep(1)}
            aria-label="Next screenshot"
          >
            <ChevronRightIcon />
          </button>
        </>
      )}
    </div>
  );
}
