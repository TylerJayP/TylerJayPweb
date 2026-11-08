import { createContext } from 'react';
import type { RevealKey } from '../lib/reveal';

export interface RevealHandlers {
  onReveal?: () => void;
  onHide?: () => void;
}

export interface Registration extends RevealHandlers {
  element: HTMLElement;
}

export interface RevealContextValue {
  /** False with reduced motion: everything just shows. */
  enabled: boolean;
  classes: Partial<Record<RevealKey, string>>;
  register: (key: RevealKey, registration: Registration) => () => void;
}

/** Shared by RevealProvider and the useReveal hooks. */
export const RevealContext = createContext<RevealContextValue | null>(null);
