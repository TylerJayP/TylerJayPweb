import type { ComponentType } from 'react';
import { MARK_PATHS, MARK_VIEWBOX, site } from '../../content/site';
import { useTheme } from '../../hooks/useTheme';
import { classNames } from '../../lib/classNames';
import type { CardView, useCardRig } from './useCardRig';
import styles from './BusinessCard.module.css';

type Rig = ReturnType<typeof useCardRig>;

interface CardLayer {
  name: string;
  /** One line on how it is made; `accent` is the foil color for the current theme. */
  spec: (accent: string) => string;
  /** Where its leader-line dot sits, as a percentage of the card. */
  dot: { left: number; top: number };
  Content: ComponentType;
}

/**
 * The card's print layers, bottom first, in stacking order. Each one gets its label, dot and leader line
 * from this list. Their depths in the stack live in cardPhysics.ts (STACKED_DEPTHS), one per layer.
 */
const LAYERS: readonly CardLayer[] = [
  {
    name: 'Back print',
    spec: () => 'Email, GitHub, LinkedIn and website.',
    dot: { left: 96, top: 88 },
    Content: BackLayer,
  },
  {
    name: 'Card stock',
    spec: () => 'Heavy 32 pt board, 3.5 by 2 inches.',
    dot: { left: 100, top: 58 },
    Content: StockLayer,
  },
  {
    name: 'Painted edge',
    spec: (accent) => `All four edges painted ${accent}.`,
    dot: { left: 100, top: 8 },
    Content: EdgeLayer,
  },
  {
    name: 'Ink',
    spec: () => 'Name and title, printed in one color.',
    dot: { left: 83, top: 67 },
    Content: InkLayer,
  },
  {
    name: 'Foil mark',
    spec: (accent) => `The TJP monogram, stamped in ${accent} foil.`,
    dot: { left: 66, top: 22 },
    Content: FoilLayer,
  },
  {
    name: 'Spot gloss',
    spec: () => 'Clear gloss on the mark only, so it catches the light.',
    dot: { left: 62, top: 14 },
    Content: GlossLayer,
  },
];

const MODEL_LABEL = `My business card, shown as its ${LAYERS.length} layers: ${new Intl.ListFormat(
  'en',
).format(LAYERS.map((layer) => layer.name.toLowerCase()))}`;

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
export function BusinessCard({ rig, className }: BusinessCardProps) {
  const { view, refs } = rig;
  return (
    <div
      ref={refs.stage}
      className={classNames(
        styles.stage,
        view.exploded && styles.exploded,
        view.flipped && styles.flipped,
        className,
      )}
    >
      <div className={styles.scene}>
        <CardModel rig={rig} />
      </div>
      <LeaderLines rig={rig} />
      <LayerLabels rig={rig} />
    </div>
  );
}

const isActive = (view: CardView, layer: number) => view.pinned === layer || view.highlighted === layer;

/** The stacked layers themselves. Their positions are written by the rig each animation frame. */
function CardModel({ rig }: { rig: Rig }) {
  const { view, refs, actions } = rig;
  return (
    <div ref={refs.model} className={styles.model} role="img" aria-label={MODEL_LABEL}>
      {LAYERS.map(({ name, dot, Content }, i) => (
        <div
          key={name}
          ref={(element) => {
            refs.layers.current[i] = element;
          }}
          className={classNames(
            styles.layer,
            isActive(view, i) && styles.active,
            view.pinned >= 0 && view.pinned !== i && styles.dimmed,
          )}
          onPointerEnter={() => actions.highlight(i)}
          onPointerLeave={() => actions.highlight(-1)}
          onClick={() => actions.pick(i)}
        >
          <Content />
          <span className={styles.plane} aria-hidden="true" />
          <span
            ref={(element) => {
              refs.dots.current[i] = element;
            }}
            className={styles.dot}
            style={{ left: `${dot.left}%`, top: `${dot.top}%` }}
            aria-hidden="true"
          />
        </div>
      ))}
    </div>
  );
}

/** One line per layer from its dot to its label. The rig draws the paths. */
function LeaderLines({ rig }: { rig: Rig }) {
  const { view, refs } = rig;
  return (
    <svg className={styles.lines} aria-hidden="true">
      {LAYERS.map(({ name }, i) => (
        <path
          key={name}
          ref={(element) => {
            refs.lines.current[i] = element;
          }}
          className={classNames(styles.line, isActive(view, i) && styles.lineActive)}
          d="M0 0"
          opacity={0}
        />
      ))}
    </svg>
  );
}

/** The layer names, top layer first. Choosing one lifts that layer out and shows how it is made. */
function LayerLabels({ rig }: { rig: Rig }) {
  const { view, refs, actions } = rig;
  const { theme } = useTheme();
  const accent = theme === 'dark' ? 'red' : 'pink';
  const topFirst = LAYERS.map((layer, i) => ({ layer, i })).reverse();

  return (
    <ol className={styles.labels}>
      {topFirst.map(({ layer, i }, row) => {
        const pinned = view.pinned === i;
        return (
          <li key={layer.name}>
            <button
              type="button"
              ref={(element) => {
                refs.labels.current[row] = element;
              }}
              className={classNames(
                styles.label,
                isActive(view, i) && styles.labelActive,
                pinned && styles.labelPinned,
              )}
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
              {pinned && <span className={styles.labelSpec}>{layer.spec(accent)}</span>}
            </button>
          </li>
        );
      })}
    </ol>
  );
}

function BackLayer() {
  return (
    <>
      <div className={classNames(styles.face, styles.back)}>
        <div className={styles.backGhost}>
          <BackPrint />
        </div>
      </div>
      <div className={classNames(styles.face, styles.back, styles.backFlipped)}>
        <BackPrint />
      </div>
    </>
  );
}

function StockLayer() {
  return (
    <>
      <div className={classNames(styles.face, styles.slab)} style={{ transform: 'translateZ(-2px)' }} />
      <div className={classNames(styles.face, styles.slab)} style={{ transform: 'translateZ(-1px)' }} />
      <div className={classNames(styles.face, styles.stock)} />
      <Dimensions />
    </>
  );
}

function EdgeLayer() {
  return <div className={classNames(styles.face, styles.edge)} />;
}

function InkLayer() {
  return (
    <div className={styles.face}>
      <div className={styles.ink}>
        <span className={styles.inkName}>{site.name}</span>
        <span className={styles.inkTag}>Software developer · Salt Lake City</span>
      </div>
    </div>
  );
}

function FoilLayer() {
  return (
    <div className={styles.markSlot}>
      <span className={styles.foil} />
    </div>
  );
}

function GlossLayer() {
  return (
    <div className={styles.markSlot}>
      <span className={styles.gloss} />
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
