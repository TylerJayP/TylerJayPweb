import type { CSSProperties, MouseEvent } from 'react';
import { site } from '../../content/site';
import { useTheme } from '../../hooks/useTheme';
import { classNames } from '../../lib/classNames';
import { MoonIcon, SunIcon } from '../icons';
import { Logo } from './Logo';
import styles from './Header.module.css';

interface HeaderProps {
  onOpenResume: (event: MouseEvent) => void;
}

/** When the name starts typing (ms after the intro starts), and the gap between characters. */
const NAME_TYPING = { startMs: 1800, gapMs: 28 };

/** Inner links slide in first, outer ones just after (ms after the intro starts). */
const navIn = (from: 'navL' | 'navR', at: number): CSSProperties => ({
  '--nav-from': from,
  '--nav-at': `${at}ms`,
});

export function Header({ onOpenResume }: HeaderProps) {
  const { theme, toggleTheme } = useTheme();
  const themeLabel = theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';

  return (
    <header id="top" className={styles.header}>
      <nav aria-label="Site sections" className={classNames(styles.nav, styles.navLeft)}>
        <a href="#work" className={classNames(styles.link, 'intro-nav')} style={navIn('navL', 2050)}>
          Projects
        </a>
        <a href="#experience" className={classNames(styles.link, 'intro-nav')} style={navIn('navL', 1970)}>
          Experience
        </a>
      </nav>

      <a href="#top" aria-label={`${site.name}, home`} className={styles.home}>
        <Logo />
        <TypedName />
      </a>

      <nav aria-label="Resume and contact" className={classNames(styles.nav, styles.navRight)}>
        <a
          href="#resume"
          onClick={onOpenResume}
          aria-haspopup="dialog"
          className={classNames(styles.link, 'intro-nav')}
          style={navIn('navR', 1970)}
        >
          Resume
        </a>
        <a href="#contact" className={classNames(styles.link, 'intro-nav')} style={navIn('navR', 2050)}>
          Contact
        </a>
        <button
          type="button"
          className={classNames(styles.themeToggle, 'intro-nav')}
          style={navIn('navR', 2050)}
          onClick={toggleTheme}
          aria-label={themeLabel}
          title={themeLabel}
        >
          {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
        </button>
      </nav>
    </header>
  );
}

/** Splits text into words, with where each word starts, so every character knows its place in order. */
function wordsWithPositions(text: string) {
  const words: { word: string; start: number }[] = [];
  let start = 0;
  for (const word of text.split(' ')) {
    words.push({ word, start });
    start += word.length + 1;
  }
  return words;
}

/** The typing delay for the character at `position` in my name. */
const typedAt = (position: number): CSSProperties => ({
  '--char-at': `${NAME_TYPING.startMs + position * NAME_TYPING.gapMs}ms`,
});

/** My name, typed one character at a time right after the logo finishes. */
function TypedName() {
  return (
    <span className={styles.name}>
      {wordsWithPositions(site.name).map(({ word, start }) => (
        <span key={word}>
          {start > 0 && (
            <span className={classNames(styles.char, styles.space, 'intro-char')} style={typedAt(start - 1)}>
              {' '}
            </span>
          )}
          {[...word].map((letter, i) => (
            <span key={i} className={classNames(styles.char, 'intro-char')} style={typedAt(start + i)}>
              {letter}
            </span>
          ))}
        </span>
      ))}
    </span>
  );
}
