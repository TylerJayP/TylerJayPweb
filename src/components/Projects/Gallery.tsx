import type { Screenshot } from '../../content/types';
import { revealDelay } from '../../hooks/useReveal';
import { classNames } from '../../lib/classNames';
import { ChevronLeftIcon, ChevronRightIcon, ExpandIcon } from '../icons';
import styles from './Gallery.module.css';

interface GalleryProps {
  projectName: string;
  screenshots: readonly Screenshot[];
  current: number;
  onSelect: (index: number) => void;
  onOpen: () => void;
  className?: string;
}

/** A project's screenshots: the current one in a window frame, a caption with arrows, and thumbnails. */
export function Gallery({ projectName, screenshots, current, onSelect, onOpen, className }: GalleryProps) {
  const shot = screenshots[current];
  if (!shot) {
    return null;
  }
  const many = screenshots.length > 1;

  return (
    <figure
      className={classNames('rvi', styles.gallery, className)}
      style={revealDelay(3)}
      aria-label={`Screenshots of ${projectName}`}
    >
      <button
        type="button"
        className={styles.window}
        onClick={onOpen}
        aria-label={`Open screenshot full size: ${shot.caption}`}
      >
        <span className={styles.titleBar}>
          <span className={styles.dots} aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
          <span className={styles.title}>{shot.title}</span>
          <span className={styles.zoom}>
            <ExpandIcon />
          </span>
        </span>
        <span className={styles.view} style={{ backgroundColor: shot.background }}>
          {screenshots.map((s, i) => (
            <img
              key={s.src}
              className={classNames(styles.image, i === current && styles.imageShown)}
              src={s.src}
              alt={s.caption}
              width={s.width}
              height={s.height}
              loading="lazy"
              decoding="async"
              style={{ objectPosition: s.position }}
            />
          ))}
        </span>
      </button>

      <GalleryCaption shot={shot} current={current} count={screenshots.length} onSelect={onSelect} />
      {many && <Thumbnails screenshots={screenshots} current={current} onSelect={onSelect} />}
    </figure>
  );
}

interface GalleryCaptionProps {
  shot: Screenshot;
  current: number;
  count: number;
  onSelect: (index: number) => void;
}

/** "Fig. 2 of 5", the caption, and arrows to step through the screenshots. */
function GalleryCaption({ shot, current, count, onSelect }: GalleryCaptionProps) {
  const many = count > 1;
  return (
    <figcaption className={styles.caption}>
      <span className={styles.figure}>
        Fig. {current + 1}
        {many && ` of ${count}`}
      </span>
      <span className={styles.captionText}>{shot.caption}</span>
      {many && (
        <span className={styles.arrows}>
          <button
            type="button"
            className={styles.arrow}
            onClick={() => onSelect(current - 1)}
            aria-label="Previous screenshot"
          >
            <ChevronLeftIcon />
          </button>
          <button
            type="button"
            className={styles.arrow}
            onClick={() => onSelect(current + 1)}
            aria-label="Next screenshot"
          >
            <ChevronRightIcon />
          </button>
        </span>
      )}
    </figcaption>
  );
}

interface ThumbnailsProps {
  screenshots: readonly Screenshot[];
  current: number;
  onSelect: (index: number) => void;
}

function Thumbnails({ screenshots, current, onSelect }: ThumbnailsProps) {
  return (
    <div className={styles.thumbs}>
      {screenshots.map((s, i) => (
        <button
          key={s.thumb}
          type="button"
          className={classNames(styles.thumb, i === current && styles.thumbCurrent)}
          style={{ background: s.background }}
          onClick={() => onSelect(i)}
          aria-pressed={i === current}
          aria-label={`Screenshot ${i + 1}: ${s.title}`}
        >
          <img src={s.thumb} alt="" loading="lazy" decoding="async" />
        </button>
      ))}
    </div>
  );
}
