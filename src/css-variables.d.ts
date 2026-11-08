import 'react';

/** Lets inline styles set CSS custom properties (`--rvd`, `--draw-at`, …) without casting. */
declare module 'react' {
  interface CSSProperties {
    [variable: `--${string}`]: string | number | undefined;
  }
}
