import { useCallback, useImperativeHandle, useRef, useState, type Ref } from 'react';
import { introCaptions } from '../../content/captions';
import { site } from '../../content/site';
import { captionAt } from '../../lib/captions';
import { formatClock } from '../../lib/format';
import { prefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { MutedIcon, PauseIcon, PlayIcon, SoundIcon } from '../icons';
import styles from './IntroPlayer.module.css';

export interface IntroPlayerHandle {
  /** Plays from `seconds` with sound, scrolling the video into view if needed. */
  playFrom: (seconds: number) => void;
}

interface PlaybackState {
  current: number;
  duration: number;
  playing: boolean;
  muted: boolean;
  ended: boolean;
}

interface IntroPlayerProps {
  ref?: Ref<IntroPlayerHandle>;
  /** A clip someone asked for before the video was on screen. */
  startAt?: number;
  onEnded: (ended: boolean, duration: number) => void;
}

/**
 * The intro video with custom controls and captions. It starts muted (browsers only autoplay silent
 * video) with a "Tap for sound" button over it.
 */
export function IntroPlayer({ ref, startAt, onEnded }: IntroPlayerProps) {
  const video = useRef<HTMLVideoElement | null>(null);
  const [state, setState] = useState<PlaybackState>({
    current: 0,
    duration: 0,
    playing: false,
    muted: true,
    ended: false,
  });
  const [captionsOn, setCaptionsOn] = useState(true);

  const sync = useCallback(() => {
    const v = video.current;
    if (!v) return;
    const next = {
      current: v.currentTime,
      duration: Number.isFinite(v.duration) ? v.duration : 0,
      playing: !v.paused && !v.ended,
      muted: v.muted,
      ended: v.ended,
    };
    setState(next);
    onEnded(next.ended, next.duration);
  }, [onEnded]);

  const playFrom = useCallback(
    (seconds: number) => {
      const v = video.current;
      if (!v) return;
      v.currentTime = seconds;
      v.muted = false;
      v.play().catch(() => {
        // Sound needs a user gesture on some browsers: fall back to playing muted.
        v.muted = true;
        v.play().catch(() => sync());
      });
      const box = v.getBoundingClientRect();
      if (box.top < 0 || box.bottom > window.innerHeight)
        v.scrollIntoView({ block: 'center', behavior: 'smooth' });
    },
    [sync],
  );

  useImperativeHandle(ref, () => ({ playFrom }), [playFrom]);

  const attach = useCallback(
    (element: HTMLVideoElement | null) => {
      video.current = element;
      if (!element) return;
      if (startAt !== undefined) {
        playFrom(startAt);
        return;
      }
      element.muted = true;
      if (!prefersReducedMotion()) element.play().catch(() => sync());
    },
    // Attach once per element; startAt only matters at that moment.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const togglePlay = () => {
    const v = video.current;
    if (!v) return;
    if (v.paused || v.ended) v.play().catch(() => {});
    else v.pause();
  };

  const toggleMute = () => {
    const v = video.current;
    if (!v) return;
    v.muted = !v.muted;
    if (!v.muted && v.paused) v.play().catch(() => {});
  };

  const caption = captionsOn && !state.ended ? captionAt(introCaptions, state.current) : '';
  const time = formatClock(state.current);
  const total = formatClock(state.duration);

  return (
    <>
      <video
        ref={attach}
        className={styles.video}
        src={site.introVideo}
        playsInline
        preload="auto"
        aria-label={`Intro video from ${site.name}`}
        onClick={togglePlay}
        onTimeUpdate={sync}
        onLoadedMetadata={sync}
        onDurationChange={sync}
        onPlay={sync}
        onPause={sync}
        onEnded={sync}
        onVolumeChange={sync}
      />
      {state.muted && (
        <button type="button" className={styles.soundPrompt} onClick={toggleMute}>
          <MutedIcon size={18} />
          Tap for sound
        </button>
      )}
      {caption && (
        <p className={styles.caption} aria-hidden="true">
          <span>{caption}</span>
        </p>
      )}
      <div className={styles.controls}>
        <button
          type="button"
          className={styles.control}
          onClick={togglePlay}
          aria-label={state.playing ? 'Pause' : 'Play'}
        >
          {state.playing ? <PauseIcon /> : <PlayIcon />}
        </button>
        <input
          type="range"
          className={styles.seek}
          min={0}
          max={state.duration}
          step={0.1}
          value={state.current}
          onChange={(event) => {
            if (video.current) video.current.currentTime = Number(event.target.value) || 0;
          }}
          aria-label="Seek"
          aria-valuetext={`${time} of ${total}`}
        />
        <span className={styles.time}>
          {time} / {total}
        </span>
        <button
          type="button"
          className={`${styles.control} ${styles.cc} ${captionsOn ? '' : styles.ccOff}`}
          onClick={() => setCaptionsOn((on) => !on)}
          aria-pressed={captionsOn}
          aria-label="Captions"
        >
          CC
        </button>
        <button
          type="button"
          className={styles.control}
          onClick={toggleMute}
          aria-label={state.muted ? 'Turn sound on' : 'Mute'}
        >
          {state.muted ? <MutedIcon /> : <SoundIcon />}
        </button>
      </div>
    </>
  );
}
