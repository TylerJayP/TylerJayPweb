import { useEffect, useRef } from 'react';

/**
 * A ref that always holds the latest value. Event listeners set up once can read the current callbacks
 * through it, instead of being torn down and added again on every render.
 */
export function useLatest<T>(value: T) {
  const ref = useRef(value);
  useEffect(() => {
    ref.current = value;
  });
  return ref;
}
