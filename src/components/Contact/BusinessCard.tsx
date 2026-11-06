import type { ReactNode } from 'react';
import { MARK_PATHS, MARK_VIEWBOX, site } from '../../content/site';
import { useTheme } from '../../hooks/theme';
import { LAYER_COUNT, type useCardRig } from './useCardRig';
import styles from './BusinessCard.module.css';

type Rig = ReturnType<typeof useCardRig>;

/** Where each layer's leader-line dot sits, as a percentage of the card. */
const DOTS: readonly [left: number, top: number][] = [
  [96, 88],
  [100, 58],
  [100, 8],
  [83, 67],
  [66, 22],
  [62, 14],
];

function layerSpecs(accent: string) {
  // Listed bottom layer first, matching the stacking order.
  return [
    { name: 'Back print', spec: 'Email, GitHub, LinkedIn and website.' },
    { name: 'Card stock', spec: 'Heavy 32 pt board, 3.5 by 2 inches.' },
    { name: 'Painted edge', spec: `All four edges painted ${accent}.` },
    { name: 'Ink', spec: 'Name and title, printed in one color.' },
    { name: 'Foil mark', spec: `The TJP monogram, stamped in ${accent} foil.` },
    { name: 'Spot gloss', spec: 'Clear gloss on the mark only, so it catches the light.' },
  ];
}

const BACK_DETAILS = [
  ['Email', site.email],
  ['GitHub', site.github.label],
  ['LinkedIn', site.linkedin.label],
  ['Website', site.website.label],
] as const;

interface BusinessCardProps {
  rig: Rig;
  className?: string;
}

/** My business card in 3D, built from its six print layers so it can be taken apart. */
export function BusinessCard({ rig, className = '' }: BusinessCardProps) {
  const { theme } = useTheme();
  const { view, refs, actions } = rig;
  const specs = layerSpecs(theme === 'dark' ? 'red' : 'pink');
  const isActive = (layer: number) => view.pinned === layer || view.highlighted === layer;

  const layers: ReactNode[] = [
    <>
      <div className={`${styles.face} ${styles.back}`}>
        <div className={styles.backGhost}>
          <BackPrint />
        </div>
      </div>
      <div className={`${styles.face} ${styles.back} ${styles.backFlipped}`}>
        <BackPrint />
      </div>
    </>,
    <>
      <div className={`${styles.face} ${styles.slab}`} style={{ transform: 'translateZ(-2px)' }} />
      <div className={`${styles.face} ${styles.slab}`} style={{ transform: 'translateZ(-1px)' }} />
      <div className={`${styles.face} ${styles.stock}`} />
      <Dimensions />
    </>,
    <div className={`${styles.face} ${styles.edge}`} />,
    <div className={styles.face}>
      <div className={styles.ink}>
        <span className={styles.inkName}>{site.name}</span>
        <span className={styles.inkTag}>Software developer · Salt Lake City</span>
      </div>
    </div>,
    <div className={styles.markSlot}>
      <span className={styles.foil} />
    </div>,
    <div className={styles.markSlot}>
      <span className={styles.gloss} />
    </div>,
  ];

  return (
    <div
      ref={refs.stage}
      className={`${styles.stage} ${view.exploded ? styles.exploded : ''} ${view.flipped ? styles.flipped : ''} ${className}`}
    >
      <div className={styles.scene}>
        <div
          ref={refs.model}
          className={styles.model}
          role="img"
          aria-label="My business card, shown as its six layers: back print, card stock, painted edge, ink, foil mark and spot gloss"
        >
          {layers.map((content, i) => (
            <div
              key={i}
              ref={(element) => {
                refs.layers.current[i] = element;
              }}
              className={`${styles.layer} ${isActive(i) ? styles.active : ''} ${
                view.pinned >= 0 && view.pinned !== i ? styles.dimmed : ''
              }`}
              onPointerEnter={() => actions.highlight(i)}
              onPointerLeave={() => actions.highlight(-1)}
              onClick={() => actions.pick(i)}
            >
              {content}
              <span className={styles.plane} aria-hidden="true" />
              <span
                ref={(element) => {
                  refs.dots.current[i] = element;
                }}
                className={styles.dot}
                style={{ left: `${DOTS[i]![0]}%`, top: `${DOTS[i]![1]}%` }}
                aria-hidden="true"
              />
            </div>
          ))}
        </div>
      </div>

      <svg className={styles.lines} aria-hidden="true">
        {Array.from({ length: LAYER_COUNT }, (_, i) => (
          <path
            key={i}
            ref={(element) => {
              refs.lines.current[i] = element;
            }}
            className={`${styles.line} ${isActive(i) ? styles.lineActive : ''}`}
            d="M0 0"
            opacity={0}
          />
        ))}
      </svg>

      <ol className={styles.labels}>
        {[...specs].reverse().map((layer, j) => {
          const i = LAYER_COUNT - 1 - j;
          const pinned = view.pinned === i;
          return (
            <li key={layer.name}>
              <button
                type="button"
                ref={(element) => {
                  refs.labels.current[j] = element;
                }}
                className={`${styles.label} ${isActive(i) ? styles.labelActive : ''} ${pinned ? styles.labelPinned : ''}`}
                onPointerEnter={() => actions.highlight(i)}
                onPointerLeave={() => actions.highlight(-1)}
                onFocus={() => actions.highlight(i)}
                onBlur={() => actions.highlight(-1)}
                onClick={() => actions.pick(i)}
                aria-pressed={pinned}
                tabIndex={view.exploded ? 0 : -1}
              >
                <span className={styles.labelHead}>
                  <span className={styles.labelNumber}>{i + 1}</span>
                  <span className={styles.labelName}>{layer.name}</span>
                </span>
                {pinned && <span className={styles.labelSpec}>{layer.spec}</span>}
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

function BackPrint() {
  return (
    <div className={styles.backPrint}>
      <span className={styles.backHead}>
        <span className={styles.backName}>{site.name}</span>
        <svg className={styles.backMark} viewBox={MARK_VIEWBOX} aria-hidden="true">
          <g fill="currentColor">
            {MARK_PATHS.map((d) => (
              <path key={d} d={d} />
            ))}
          </g>
        </svg>
      </span>
      <span className={styles.backGrid}>
        {BACK_DETAILS.map(([key, value]) => (
          <span key={key} className={styles.backItem}>
            <span className={styles.backKey}>{key}</span>
            <span className={styles.backValue}>{value}</span>
          </span>
        ))}
      </span>
    </div>
  );
}

/** Size callouts around the card stock, shown while the card is taken apart. */
function Dimensions() {
  return (
    <svg className={styles.dims} viewBox="0 0 430 300" aria-hidden="true">
      <g fill="none" strokeWidth={1.2}>
        <path d="M0 262 V286 M430 262 V286 M0 278 H430" />
        <path d="M462 0 H486 M462 246 H486 M478 0 V246" />
      </g>
      <g fill="currentColor" stroke="none">
        <path d="M0 278 l8 -4 v8 Z M430 278 l-8 -4 v8 Z M478 0 l-4 8 h8 Z M478 246 l-4 -8 h8 Z" />
      </g>
      <text className={styles.dimText} x={215} y={272} textAnchor="middle" fontSize={12}>
        3.5 in
      </text>
      <text className={styles.dimText} x={494} y={127} fontSize={12}>
        2 in
      </text>
    </svg>
  );
}
