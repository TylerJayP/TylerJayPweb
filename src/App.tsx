import { useCallback, useRef, type ReactNode } from 'react';
import { Contact } from './components/Contact/Contact';
import { Experience } from './components/Experience/Experience';
import { Footer } from './components/Footer/Footer';
import { Header } from './components/Header/Header';
import { Intro, type IntroHandle } from './components/Intro/Intro';
import { JobMatch } from './components/JobMatch/JobMatch';
import { Projects } from './components/Projects/Projects';
import { ResumeDialog } from './components/Resume/ResumeDialog';
import { site } from './content/site';
import { useHashDialog } from './hooks/useHashDialog';
import { useIntro } from './hooks/useIntro';
import { useRevealEnabled } from './hooks/useReveal';
import { classNames } from './lib/classNames';
import { RevealProvider } from './providers/RevealProvider';
import { ThemeProvider } from './providers/ThemeProvider';
import styles from './App.module.css';

export function App() {
  return (
    <ThemeProvider>
      <Page />
    </ThemeProvider>
  );
}

function Page() {
  const intro = useIntro();
  const introPlayer = useRef<IntroHandle>(null);
  // An address ending in #resume opens the resume, so it can be linked to directly.
  const resume = useHashDialog('#resume');

  const hearAt = useCallback((seconds: number) => introPlayer.current?.hearAt(seconds), []);

  return (
    <RevealProvider held={intro.holding}>
      <PageRoot phase={intro.phase}>
        <Header onOpenResume={resume.openFromLink} />
        <main>
          <h1 className="visually-hidden">
            {site.name}, {site.role.toLowerCase()}
          </h1>
          <section aria-label="Introduction" className={styles.introSection}>
            <Intro
              ref={introPlayer}
              buildStartsAt={intro.buildStartsAt}
              rebuild={intro.rebuild}
              onReplay={intro.replay}
              onSkipToVideo={intro.skipToVideo}
            />
            <JobMatch onHear={hearAt} />
          </section>
          <Projects />
          <Experience onOpenResume={resume.openFromLink} />
          <Contact />
        </main>
        <Footer onOpenResume={resume.openFromLink} />
        <ResumeDialog open={resume.open} onClose={resume.close} />
      </PageRoot>
    </RevealProvider>
  );
}

/** Carries the classes the intro (`intro reset|go`) and the scroll reveals (`sr`) are styled from. */
function PageRoot({ phase, children }: { phase: 'reset' | 'go'; children: ReactNode }) {
  const revealsOn = useRevealEnabled();
  return <div className={classNames(styles.root, 'intro', phase, revealsOn && 'sr')}>{children}</div>;
}
