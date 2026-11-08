/**
 * Small helpers for driving a <video> element, so the player component only deals with what to show.
 *
 * `play()` returns a promise that rejects when the browser blocks playback (no user gesture yet, or
 * data saver). That's not an error here: the controls just keep showing "paused".
 */

export interface PlaybackState {
  current: number;
  duration: number;
  playing: boolean;
  muted: boolean;
  ended: boolean;
}

export const INITIAL_PLAYBACK: PlaybackState = {
  current: 0,
  duration: 0,
  playing: false,
  muted: true,
  ended: false,
};

export function readPlayback(video: HTMLVideoElement): PlaybackState {
  return {
    current: video.currentTime,
    duration: Number.isFinite(video.duration) ? video.duration : 0,
    playing: !video.paused && !video.ended,
    muted: video.muted,
    ended: video.ended,
  };
}

/** Starts playback, calling `onBlocked` if the browser refuses. */
export function tryPlay(video: HTMLVideoElement, onBlocked: () => void = () => undefined): void {
  video.play().catch(onBlocked);
}

/** Plays with sound if the browser allows it, otherwise muted. */
export function playWithSound(video: HTMLVideoElement, onBlocked: () => void): void {
  video.muted = false;
  tryPlay(video, () => {
    video.muted = true;
    tryPlay(video, onBlocked);
  });
}

export function seekTo(video: HTMLVideoElement, seconds: number): void {
  video.currentTime = seconds;
}

export function togglePlayback(video: HTMLVideoElement): void {
  if (video.paused || video.ended) {
    tryPlay(video);
  } else {
    video.pause();
  }
}

/** Turns sound on or off; turning it on also starts a paused video. */
export function toggleSound(video: HTMLVideoElement): void {
  video.muted = !video.muted;
  if (!video.muted && video.paused) {
    tryPlay(video);
  }
}

export function scrollIntoViewIfHidden(element: Element): void {
  const box = element.getBoundingClientRect();
  if (box.top < 0 || box.bottom > window.innerHeight) {
    element.scrollIntoView({ block: 'center', behavior: 'smooth' });
  }
}
