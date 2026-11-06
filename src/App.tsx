import { useCallback, useRef, useState, type MouseEvent, type ReactNode } from 'react';
import { Contact } from './components/Contact/Contact';
import { Experience } from './components/Experience/Experience';
import { Footer } from './components/Footer/Footer';
import { Header } from './components/Header/Header';
import { Intro, type IntroHandle } from './components/Intro/Intro';
import { JobMatch } from './components/JobMatch/JobMatch';
import { Projects } from './components/Projects/Projects';
import { ResumeDialog } from './components/Resume/ResumeDialog';
import { site } from './content/site';
import { RevealProvider, useRevealEnabled } from './hooks/reveal';
import { ThemeProvider } from './hooks/theme';
import { useIntro } from './hooks/useIntro';
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
  // A link straight to /#resume opens the resume.
  const [resumeOpen, setResumeOpen] = useState(() => window.location.hash === '#resume');

  const openResume = useCallback((event: MouseEvent) => {
    event.preventDefault();
    setResumeOpen(true);
  }, []);

  const hearAt = useCallback((seconds: number) => introPlayer.current?.hearAt(seconds), []);

  return (
    <RevealProvider held={intro.holding}>
      <PageRoot phase={intro.phase}>
        <h1 className="visually-hidden">
          {site.name}, {site.role.toLowerCase()}
        </h1>
        <Header onOpenResume={openResume} />
        <main>
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
          <Experience onOpenResume={openResume} />
          <Contact />
        </main>
        <Footer onOpenResume={openResume} />
        <ResumeDialog open={resumeOpen} onClose={() => setResumeOpen(false)} />
      </PageRoot>
    </RevealProvider>
  );
}

/** Carries the classes the intro (`intro reset|go`) and the scroll reveals (`sr`) are styled from. */
function PageRoot({ phase, children }: { phase: 'reset' | 'go'; children: ReactNode }) {
  const revealsOn = useRevealEnabled();
  return <div className={`${styles.root} intro ${phase} ${revealsOn ? 'sr' : ''}`}>{children}</div>;
}
