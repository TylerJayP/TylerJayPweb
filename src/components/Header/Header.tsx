import type { CSSProperties, MouseEvent } from 'react';
import { site } from '../../content/site';
import { useTheme } from '../../hooks/theme';
import { MoonIcon, SunIcon } from '../icons';
import { Logo } from './Logo';
import styles from './Header.module.css';

interface HeaderProps {
  onOpenResume: (event: MouseEvent) => void;
}

/** Inner links slide in first, outer ones just after (ms after the intro starts). */
const navIn = (from: 'navL' | 'navR', at: number) =>
  ({ '--nav-from': from, '--nav-at': `${at}ms` }) as CSSProperties;

export function Header({ onOpenResume }: HeaderProps) {
  const { theme, toggleTheme } = useTheme();
  const themeLabel = theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';

  return (
    <header id="top" className={styles.header}>
      <nav aria-label="Site sections" className={`${styles.nav} ${styles.navLeft}`}>
        <a href="#work" className={`${styles.link} intro-nav`} style={navIn('navL', 2050)}>
          Projects
        </a>
        <a href="#experience" className={`${styles.link} intro-nav`} style={navIn('navL', 1970)}>
          Experience
        </a>
      </nav>

      <a href="#top" aria-label={`${site.name}, home`} className={styles.home}>
        <Logo />
        <TypedName />
      </a>

      <nav aria-label="Resume and contact" className={`${styles.nav} ${styles.navRight}`}>
        <a
          href="#resume"
          onClick={onOpenResume}
          aria-haspopup="dialog"
          className={`${styles.link} intro-nav`}
          style={navIn('navR', 1970)}
        >
          Resume
        </a>
        <a href="#contact" className={`${styles.link} intro-nav`} style={navIn('navR', 2050)}>
          Contact
        </a>
        <button
          type="button"
          className={`${styles.themeToggle} intro-nav`}
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

/** My name, one letter at a time, 28 ms apart, right after the logo finishes. */
function TypedName() {
  const words = site.name.split(' ');
  let index = 0;
  const next = () => ({ '--char-at': `${1800 + index++ * 28}ms` }) as CSSProperties;

  return (
    <span className={styles.name}>
      {words.map((word, w) => (
        <span key={word}>
          {w > 0 && <span className={`${styles.char} ${styles.space} intro-char`} style={next()} />}
          {[...word].map((letter, i) => (
            <span key={i} className={`${styles.char} intro-char`} style={next()}>
              {letter}
            </span>
          ))}
        </span>
      ))}
    </span>
  );
}
