import { useCallback, useImperativeHandle, useRef, useState, type Ref } from 'react';
import { buildFrame, TERMINAL_GONE_AT, type BuildFrame } from '../../lib/buildTerminal';
import { useElapsed } from '../../hooks/useIntro';
import { classNames } from '../../lib/classNames';
import { formatClock } from '../../lib/format';
import { ReplayIcon } from '../icons';
import { IntroPlayer, type IntroPlayerHandle } from './IntroPlayer';
import playerStyles from './IntroPlayer.module.css';
import styles from './Intro.module.css';

export interface IntroHandle {
  /** Plays the intro from `seconds`, skipping the build if it is still running. */
  hearAt: (seconds: number) => void;
}

interface IntroProps {
  ref?: Ref<IntroHandle>;
  buildStartsAt: number;
  rebuild: boolean;
  onReplay: () => void;
  onSkipToVideo: () => void;
}

/** The hero: a fake build in a terminal, which hands over to my intro video, then an end screen. */
export function Intro({ ref, buildStartsAt, rebuild, onReplay, onSkipToVideo }: IntroProps) {
  const elapsed = useElapsed(buildStartsAt, TERMINAL_GONE_AT + 0.2);
  const frame = buildFrame(elapsed, rebuild, buildStartsAt + elapsed * 1000);
  const player = useRef<IntroPlayerHandle>(null);
  const [pendingClip, setPendingClip] = useState<number>();
  const [ended, setEnded] = useState({ ended: false, duration: 0 });

  useImperativeHandle(
    ref,
    () => ({
      hearAt(seconds) {
        if (player.current) {
          player.current.playFrom(seconds);
        } else {
          setPendingClip(seconds);
          onSkipToVideo();
        }
      },
    }),
    [onSkipToVideo],
  );

  const onEnded = useCallback((isEnded: boolean, duration: number) => {
    setEnded((current) =>
      current.ended === isEnded && current.duration === duration ? current : { ended: isEnded, duration },
    );
  }, []);

  const watchAgain = () => {
    setEnded({ ended: false, duration: ended.duration });
    player.current?.playFrom(0);
  };

  const replay = () => {
    setPendingClip(undefined);
    setEnded({ ended: false, duration: 0 });
    onReplay();
  };

  return (
    <div className={classNames(styles.hero, 'intro-hero')}>
      <div className={styles.stage}>
        {frame.showTerminal && <BuildTerminal frame={frame} />}
        {frame.showPlayer && (
          <>
            <div className={classNames(playerStyles.player, styles.wipeIn)}>
              <IntroPlayer ref={player} startAt={pendingClip} onEnded={onEnded} key={buildStartsAt} />
            </div>
            <div className={styles.wipeLine} aria-hidden="true" />
          </>
        )}
        {frame.showPlayer && ended.ended && (
          <>
            <EndScreen duration={ended.duration} onWatchAgain={watchAgain} />
            <div className={styles.wipeLineDown} aria-hidden="true" />
          </>
        )}
      </div>
      <div className={styles.actions}>
        <button type="button" className={styles.replay} onClick={replay}>
          <ReplayIcon />
          Rebuild project
        </button>
      </div>
    </div>
  );
}

function Cursor() {
  return <span className={styles.cursor} aria-hidden="true" />;
}

function BuildTerminal({ frame }: { frame: BuildFrame }) {
  return (
    <div className={styles.terminal}>
      <div className={styles.titleBar}>
        <span>tjp ~/portfolio</span>
        <span className={styles.clock}>{frame.clock}</span>
      </div>
      <div className={styles.log} aria-live="polite">
        <p className={styles.command}>
          <span className={styles.prompt}>$ </span>
          {frame.command}
          {frame.commandTyping && <Cursor />}
        </p>
        {frame.steps.map((step) => (
          <p key={step.number} className={styles.step}>
            <span className={styles.stepNumber}>[{step.number}]&nbsp;</span>
            <span className={styles.stepLabel}>
              {step.text}
              {step.active && <Cursor />}
            </span>
            <span
              className={classNames(styles.leader, step.showLeader && styles.leaderOn)}
              aria-hidden="true"
            />
            <span className={classNames(styles.status, step.done && styles.statusDone)}>{step.status}</span>
          </p>
        ))}
        {frame.built && <p className={styles.doneMessage}>{frame.doneMessage}</p>}
      </div>
      <div className={styles.progress} aria-hidden="true">
        {frame.progress.map((fill, i) => (
          <div key={i} className={styles.segment}>
            <div className={styles.segmentFill} style={{ width: `${(fill * 100).toFixed(1)}%` }} />
          </div>
        ))}
      </div>
    </div>
  );
}

function EndScreen({ duration, onWatchAgain }: { duration: number; onWatchAgain: () => void }) {
  return (
    <div className={classNames(styles.terminal, styles.wipeDown)}>
      <div className={styles.titleBar}>
        <span>tjp ~/portfolio</span>
        <span>exit 0</span>
      </div>
      <div className={styles.endBody} aria-live="polite">
        <div>
          <p className={styles.finished}>intro finished · {formatClock(duration)}</p>
          <p>
            <span className={styles.prompt}>$ </span>what next?
            <Cursor />
          </p>
        </div>
        <div className={styles.choices}>
          <a href="#contact" className={classNames(styles.choice, styles.choicePrimary)}>
            <span className={styles.choiceKey}>[1]</span>Get in touch
          </a>
          <a href="#work" className={styles.choice}>
            <span className={styles.choiceKey}>[2]</span>See my projects
          </a>
          <button type="button" className={styles.choice} onClick={onWatchAgain}>
            <span className={styles.choiceKey}>[3]</span>Watch again
          </button>
        </div>
      </div>
    </div>
  );
}
