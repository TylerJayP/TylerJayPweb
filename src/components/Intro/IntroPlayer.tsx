import { useCallback, useImperativeHandle, useRef, useState, type Ref } from 'react';
import { introCaptions } from '../../content/captions';
import { site } from '../../content/site';
import { useLatest } from '../../hooks/useLatest';
import { prefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { captionAt } from '../../lib/captions';
import { classNames } from '../../lib/classNames';
import { formatClock } from '../../lib/format';
import { clamp } from '../../lib/math';
import { MutedIcon, PauseIcon, PlayIcon, SoundIcon } from '../icons';
import {
  INITIAL_PLAYBACK,
  type PlaybackState,
  playWithSound,
  readPlayback,
  scrollIntoViewIfHidden,
  seekTo,
  togglePlayback,
  toggleSound,
  tryPlay,
} from './videoControls';
import styles from './IntroPlayer.module.css';

export interface IntroPlayerHandle {
  /** Plays from `seconds` with sound, scrolling the video into view if needed. */
  playFrom: (seconds: number) => void;
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
  const [state, setState] = useState(INITIAL_PLAYBACK);
  const [captionsOn, setCaptionsOn] = useState(true);

  /** Copies the video's state into React whenever one of its events fires. */
  const sync = useCallback(() => {
    if (!video.current) {
      return;
    }
    const next = readPlayback(video.current);
    setState(next);
    onEnded(next.ended, next.duration);
  }, [onEnded]);

  const playFrom = useCallback(
    (seconds: number) => {
      const element = video.current;
      if (!element) {
        return;
      }
      seekTo(element, seconds);
      playWithSound(element, sync);
      scrollIntoViewIfHidden(element);
    },
    [sync],
  );

  useImperativeHandle(ref, () => ({ playFrom }), [playFrom]);

  // The video starts once, when it is attached: from a requested clip, or muted from the top.
  const onAttach = useLatest({ startAt, playFrom, sync });
  const attach = useCallback(
    (element: HTMLVideoElement | null) => {
      video.current = element;
      if (!element) {
        return;
      }
      const { startAt: clip, playFrom: playClip, sync: update } = onAttach.current;
      if (clip !== undefined) {
        playClip(clip);
        return;
      }
      element.muted = true;
      if (!prefersReducedMotion()) {
        tryPlay(element, update);
      }
    },
    [onAttach],
  );

  /** Runs a control on the video, if it is there. */
  const withVideo = (action: (element: HTMLVideoElement) => void) => {
    if (video.current) {
      action(video.current);
    }
  };
  const togglePlay = () => withVideo(togglePlayback);
  const toggleMute = () => withVideo(toggleSound);
  // Sync straight after seeking, so the slider shows the new position before React restores the old one.
  const seek = (seconds: number) =>
    withVideo((element) => {
      seekTo(element, seconds);
      sync();
    });

  const caption = captionsOn && !state.ended ? captionAt(introCaptions, state.current) : '';

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
      <PlayerControls
        playback={state}
        captionsOn={captionsOn}
        onTogglePlay={togglePlay}
        onSeek={seek}
        onToggleCaptions={() => setCaptionsOn((on) => !on)}
        onToggleMute={toggleMute}
      />
    </>
  );
}

/** Arrow keys on the seek bar jump this many seconds, like most video players. */
const SEEK_STEP_SECONDS = 5;
const SEEK_KEYS: Partial<Record<string, number>> = {
  ArrowLeft: -SEEK_STEP_SECONDS,
  ArrowDown: -SEEK_STEP_SECONDS,
  ArrowRight: SEEK_STEP_SECONDS,
  ArrowUp: SEEK_STEP_SECONDS,
};

interface PlayerControlsProps {
  playback: PlaybackState;
  captionsOn: boolean;
  onTogglePlay: () => void;
  onSeek: (seconds: number) => void;
  onToggleCaptions: () => void;
  onToggleMute: () => void;
}

/** Play/pause, the seek bar, the time, captions and sound. */
function PlayerControls({
  playback,
  captionsOn,
  onTogglePlay,
  onSeek,
  onToggleCaptions,
  onToggleMute,
}: PlayerControlsProps) {
  const time = formatClock(playback.current);
  const total = formatClock(playback.duration);

  return (
    <div className={styles.controls}>
      <button
        type="button"
        className={styles.control}
        onClick={onTogglePlay}
        aria-label={playback.playing ? 'Pause' : 'Play'}
      >
        {playback.playing ? <PauseIcon /> : <PlayIcon />}
      </button>
      <input
        type="range"
        className={styles.seek}
        min={0}
        max={playback.duration}
        step={0.1}
        value={playback.current}
        onChange={(event) => onSeek(Number(event.target.value) || 0)}
        onKeyDown={(event) => {
          const delta = SEEK_KEYS[event.key];
          if (delta !== undefined) {
            event.preventDefault();
            onSeek(clamp(playback.current + delta, 0, playback.duration));
          }
        }}
        aria-label="Seek"
        aria-valuetext={`${time} of ${total}`}
      />
      <span className={styles.time}>
        {time} / {total}
      </span>
      <button
        type="button"
        className={classNames(styles.control, styles.cc, !captionsOn && styles.ccOff)}
        onClick={onToggleCaptions}
        aria-pressed={captionsOn}
        aria-label="Captions"
      >
        CC
      </button>
      <button
        type="button"
        className={styles.control}
        onClick={onToggleMute}
        aria-label={playback.muted ? 'Turn sound on' : 'Mute'}
      >
        {playback.muted ? <MutedIcon /> : <SoundIcon />}
      </button>
    </div>
  );
}
