import type { SVGProps } from 'react';

/** Small line icons used across the page. All are decorative: the control they sit in has the label. */

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function Line({ size = 16, viewBox = '0 0 16 16', strokeWidth = 1.8, children, ...rest }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox={viewBox}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...rest}
    >
      {children}
    </svg>
  );
}

export const SunIcon = (p: IconProps) => (
  <Line size={18} strokeWidth={1.6} {...p}>
    <circle cx="8" cy="8" r="3" />
    <path d="M8 1.5v1.6M8 12.9v1.6M1.5 8h1.6M12.9 8h1.6M3.4 3.4l1.1 1.1M11.5 11.5l1.1 1.1M3.4 12.6l1.1-1.1M11.5 4.5l1.1-1.1" />
  </Line>
);

export const MoonIcon = ({ size = 18 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
    <path d="M13.5 10.2A5.8 5.8 0 0 1 5.8 2.5a5.8 5.8 0 1 0 7.7 7.7z" />
  </svg>
);

export const PlayIcon = ({ size = 20 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
    <path d="M6 4l10 6-10 6z" />
  </svg>
);

export const SmallPlayIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" aria-hidden="true">
    <path d="M3 1.5v9l7.5-4.5z" />
  </svg>
);

export const PauseIcon = ({ size = 20 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
    <path d="M5 4h3v12H5zM12 4h3v12h-3z" />
  </svg>
);

export const MutedIcon = (p: IconProps) => (
  <Line size={20} viewBox="0 0 20 20" {...p}>
    <path d="M3 8v4h3l4 3V5L6 8H3z" />
    <path d="M14 8l4 4M18 8l-4 4" />
  </Line>
);

export const SoundIcon = (p: IconProps) => (
  <Line size={20} viewBox="0 0 20 20" {...p}>
    <path d="M3 8v4h3l4 3V5L6 8H3z" />
    <path d="M13.5 7.5a3.5 3.5 0 0 1 0 5M15.5 5.5a6.5 6.5 0 0 1 0 9" />
  </Line>
);

export const ReplayIcon = () => (
  <Line>
    <path d="M2.5 8a5.5 5.5 0 1 0 1.6-3.9" />
    <path d="M2.5 2.5v3h3" />
  </Line>
);

export const ArrowRightIcon = ({ size = 14 }: IconProps) => (
  <Line size={size}>
    <path d="M3 8h10M9 4l4 4-4 4" />
  </Line>
);

export const ExternalIcon = () => (
  <Line size={13}>
    <path d="M5 11l6-6M6 5h5v5" />
  </Line>
);

export const CodeIcon = ({ size = 18 }: IconProps) => (
  <Line size={size} viewBox="0 0 20 20">
    <path d="M7 6l-4 4 4 4M13 6l4 4-4 4M11 4l-2 12" />
  </Line>
);

export const DocumentIcon = () => (
  <Line strokeWidth={1.6}>
    <path d="M9.5 1.8H4.2A1.4 1.4 0 0 0 2.8 3.2v9.6a1.4 1.4 0 0 0 1.4 1.4h7.6a1.4 1.4 0 0 0 1.4-1.4V5.6Z" />
    <path d="M9.5 1.8v3.8h3.7" />
    <path d="M5.6 8.6h4.8M5.6 11.2h3.2" />
  </Line>
);

export const DownloadIcon = ({ strokeWidth = 1.8 }: IconProps) => (
  <Line strokeWidth={strokeWidth}>
    <path d="M8 2v8.4" />
    <path d="m4.6 7 3.4 3.4L11.4 7" />
    <path d="M2.6 13.8h10.8" />
  </Line>
);

export const CloseIcon = () => (
  <Line strokeWidth={1.9}>
    <path d="M3.5 3.5l9 9M12.5 3.5l-9 9" />
  </Line>
);

export const ChevronLeftIcon = () => (
  <Line strokeWidth={1.9}>
    <path d="M10 3 5 8l5 5" />
  </Line>
);

export const ChevronRightIcon = () => (
  <Line strokeWidth={1.9}>
    <path d="m6 3 5 5-5 5" />
  </Line>
);

export const ExpandIcon = () => (
  <Line size={14} strokeWidth={1.7}>
    <path d="M9.5 2.5h4v4M6.5 13.5h-4v-4M13.5 2.5 9 7M2.5 13.5 7 9" />
  </Line>
);

export const CopyIcon = () => (
  <Line strokeWidth={1.6}>
    <rect x="5.2" y="5.2" width="8.8" height="8.8" rx="2" />
    <path d="M10.8 5.2V3.6A1.6 1.6 0 0 0 9.2 2H3.6A1.6 1.6 0 0 0 2 3.6v5.6a1.6 1.6 0 0 0 1.6 1.6h1.6" />
  </Line>
);

export const ShareIcon = () => (
  <Line strokeWidth={1.6}>
    <circle cx="12" cy="3.6" r="1.8" />
    <circle cx="4" cy="8" r="1.8" />
    <circle cx="12" cy="12.4" r="1.8" />
    <path d="m5.6 7.1 4.8-2.6M5.6 8.9l4.8 2.6" />
  </Line>
);

export const LayersIcon = () => (
  <Line strokeWidth={1.6}>
    <path d="M8 1.8 1.6 5.2 8 8.6l6.4-3.4Z" />
    <path d="M1.6 8.2 8 11.6l6.4-3.4" />
    <path d="M1.6 11.2 8 14.6l6.4-3.4" />
  </Line>
);

export const FlipIcon = () => (
  <Line strokeWidth={1.6}>
    <path d="M2.6 7.4a5.4 5.4 0 0 1 9.5-3.1l1.2 1.2" />
    <path d="M13.3 2v3.5H9.8" />
    <path d="M13.4 8.6a5.4 5.4 0 0 1-9.5 3.1l-1.2-1.2" />
    <path d="M2.7 14v-3.5h3.5" />
  </Line>
);

export const MailIcon = () => (
  <Line strokeWidth={1.6}>
    <rect x="1.8" y="3.2" width="12.4" height="9.6" rx="1.6" />
    <path d="m2.4 4.2 5.6 4.4 5.6-4.4" />
  </Line>
);

export const LinkedInIcon = () => (
  <Line strokeWidth={1.6}>
    <rect x="1.8" y="1.8" width="12.4" height="12.4" rx="2.4" />
    <path d="M5.2 7.2v4.2" />
    <path d="M5.2 4.9v.1" />
    <path d="M8.2 11.4V7.2" />
    <path d="M8.2 9.2c0-1.3.8-2.1 1.9-2.1s1.7.8 1.7 2v2.3" />
  </Line>
);
