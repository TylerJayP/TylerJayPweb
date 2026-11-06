import type { CSSProperties, Ref } from 'react';
import type { Project } from '../../content/types';
import { placedCount, viewLabel } from '../../lib/markBoard';
import { revealDelay } from '../../hooks/reveal';
import styles from './MarkBoard.module.css';

interface MarkBoardProps {
  projects: readonly Project[];
  placed: readonly boolean[];
  current: number;
  onPick: (index: number) => void;
  onPlaceAll: () => void;
  onReset: () => void;
  revealRef: Ref<HTMLDivElement>;
  revealClass: string;
}

/** The TJP mark as six loose parts on a drawing board; each project snaps its part into place. */
export function MarkBoard({
  projects,
  placed,
  current,
  onPick,
  onPlaceAll,
  onReset,
  revealRef,
  revealClass,
}: MarkBoardProps) {
  const count = placedCount(placed);
  const done = count === placed.length;
  const view = viewLabel(placed);

  return (
    <div ref={revealRef} className={`rv rboard ${revealClass} ${styles.board}`}>
      <div className={`${styles.drawing} ${done ? styles.complete : ''}`}>
        <svg viewBox="110 110 1360 880" role="img" aria-label={`TJP monogram, ${count} of 6 parts in place`}>
          {projects.map((project, i) => {
            const inPlace = placed[i] ?? false;
            const offset = inPlace ? { x: 0, y: 0, rotate: 0 } : project.loose;
            const [ax, ay] = project.anchor;
            const [bx, by] = project.ball;
            return (
              <g
                key={project.piece}
                className={`bm-piece ${styles.piece} ${inPlace ? styles.placed : ''} ${i === current ? styles.current : ''}`}
                style={
                  {
                    transform: `translate(${offset.x}px, ${offset.y}px) rotate(${offset.rotate}deg)`,
                    // pieces pop onto the board one after another as it opens
                    '--rvd': `${380 + i * 95}ms`,
                  } as CSSProperties
                }
                onClick={() => onPick(i)}
              >
                <path className={styles.shape} d={project.path} />
                <line className={styles.leader} x1={ax} y1={ay} x2={bx} y2={by} />
                <circle className={styles.anchor} cx={ax} cy={ay} r={4} />
                <circle className={styles.ball} cx={bx} cy={by} r={24} />
                <text
                  className={styles.ballNumber}
                  x={bx}
                  y={by}
                  textAnchor="middle"
                  dominantBaseline="central"
                >
                  {i + 1}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <div className={`rvi ${styles.buttons}`} style={revealDelay(17)}>
        {!done && (
          <button type="button" className={`${styles.button} ${styles.primary}`} onClick={onPlaceAll}>
            Put it all together
          </button>
        )}
        {(count > 1 || current !== 0) && (
          <button type="button" className={styles.button} onClick={onReset}>
            Take it apart
          </button>
        )}
      </div>

      <div className={`rvi ${styles.spec}`} style={revealDelay(19)} aria-hidden="true">
        <span>Part</span>
        <span>TJP monogram</span>
        <span>View</span>
        <span className={done ? styles.specAssembled : ''}>{view}</span>
        <span>In place</span>
        <span>{count} of 6</span>
        <span>Drawn by</span>
        <span>T. J. Perkins</span>
      </div>
    </div>
  );
}
