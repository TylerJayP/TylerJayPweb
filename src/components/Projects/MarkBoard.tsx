import type { Project } from '../../content/types';
import { revealDelay, useReveal } from '../../hooks/useReveal';
import { classNames } from '../../lib/classNames';
import { placedCount, viewLabel } from '../../lib/markBoard';
import styles from './MarkBoard.module.css';

/** Pieces pop onto the board one after another as it opens. */
const PIECE_STAGGER = { startMs: 380, gapMs: 95 };
const IN_PLACE = { x: 0, y: 0, rotate: 0 };

interface MarkBoardProps {
  projects: readonly Project[];
  placed: readonly boolean[];
  current: number;
  onPick: (index: number) => void;
  onPlaceAll: () => void;
  onReset: () => void;
}

/** The TJP mark as six loose parts on a drawing board; each project snaps its part into place. */
export function MarkBoard({ projects, placed, current, onPick, onPlaceAll, onReset }: MarkBoardProps) {
  const reveal = useReveal('mark-board');
  const count = placedCount(placed);
  const total = placed.length;
  const done = count === total;
  const canTakeApart = count > 1 || current !== 0;

  return (
    <div ref={reveal.ref} className={classNames(reveal.className, 'rboard', styles.board)}>
      <div className={classNames(styles.drawing, done && styles.complete)}>
        <svg
          viewBox="110 110 1360 880"
          role="img"
          aria-label={`TJP monogram, ${count} of ${total} parts in place`}
        >
          {projects.map((project, i) => (
            <BoardPiece
              key={project.piece}
              project={project}
              index={i}
              inPlace={placed[i] ?? false}
              current={i === current}
              onPick={() => onPick(i)}
            />
          ))}
        </svg>
      </div>

      <div className={classNames('rvi', styles.buttons)} style={revealDelay(17)}>
        {!done && (
          <button type="button" className={classNames(styles.button, styles.primary)} onClick={onPlaceAll}>
            Put it all together
          </button>
        )}
        {canTakeApart && (
          <button type="button" className={styles.button} onClick={onReset}>
            Take it apart
          </button>
        )}
      </div>

      <div className={classNames('rvi', styles.spec)} style={revealDelay(19)} aria-hidden="true">
        <span>Part</span>
        <span>TJP monogram</span>
        <span>View</span>
        <span className={classNames(done && styles.specAssembled)}>{viewLabel(placed)}</span>
        <span>In place</span>
        <span>
          {count} of {total}
        </span>
        <span>Drawn by</span>
        <span>T. J. Perkins</span>
      </div>
    </div>
  );
}

interface BoardPieceProps {
  project: Project;
  index: number;
  inPlace: boolean;
  current: boolean;
  onPick: () => void;
}

/** One part of the mark: loose and tilted until its project is opened, with a numbered callout. */
function BoardPiece({ project, index, inPlace, current, onPick }: BoardPieceProps) {
  const offset = inPlace ? IN_PLACE : project.loose;
  const [anchorX, anchorY] = project.anchor;
  const [ballX, ballY] = project.ball;
  return (
    <g
      className={classNames('bm-piece', styles.piece, inPlace && styles.placed, current && styles.current)}
      style={{
        transform: `translate(${offset.x}px, ${offset.y}px) rotate(${offset.rotate}deg)`,
        '--rvd': `${PIECE_STAGGER.startMs + index * PIECE_STAGGER.gapMs}ms`,
      }}
      onClick={onPick}
    >
      <path className={styles.shape} d={project.path} />
      <line className={styles.leader} x1={anchorX} y1={anchorY} x2={ballX} y2={ballY} />
      <circle className={styles.anchor} cx={anchorX} cy={anchorY} r={4} />
      <circle className={styles.ball} cx={ballX} cy={ballY} r={24} />
      <text className={styles.ballNumber} x={ballX} y={ballY} textAnchor="middle" dominantBaseline="central">
        {index + 1}
      </text>
    </g>
  );
}
