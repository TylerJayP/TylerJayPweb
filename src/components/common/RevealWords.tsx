import { revealDelay } from '../../hooks/reveal';

interface RevealWordsProps {
  text: string;
  /** Reveal step of the first word; each next word is one step later. */
  from?: number;
}

/** A heading whose words rise one after another out of a mask when its block scrolls in. */
export function RevealWords({ text, from = 0 }: RevealWordsProps) {
  const words = text.split(' ');
  return words.map((word, i) => (
    <span key={i}>
      <span className="rw">
        <span className="rwi" style={revealDelay(from + i)}>
          {word}
        </span>
      </span>
      {i < words.length - 1 && ' '}
    </span>
  ));
}
