// ============================================================
// 🕊️ Elegant line-art icon set
// ============================================================
// Replaces raw platform emoji (💖✨💕🌸💌 etc.) with delicate,
// single-color SVG icons that inherit `currentColor`. Platform
// emoji render as bold multi-color glyphs that differ per device
// and clash with the site's refined gold/pink/cream palette —
// these icons keep every accent consistent with the theme instead.
// ============================================================

import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement>;

export function HeartIcon({ className, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} {...props}>
      <path d="M12 21s-7.5-4.6-10.2-9.3C.2 8.9 1.4 5.4 4.6 4.4c2-.6 4 .1 5.4 1.9 1.4-1.8 3.4-2.5 5.4-1.9 3.2 1 4.4 4.5 2.8 7.3C19.5 16.4 12 21 12 21z" />
    </svg>
  );
}

export function HeartOutlineIcon({ className, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className} {...props}>
      <path d="M12 21s-7.5-4.6-10.2-9.3C.2 8.9 1.4 5.4 4.6 4.4c2-.6 4 .1 5.4 1.9 1.4-1.8 3.4-2.5 5.4-1.9 3.2 1 4.4 4.5 2.8 7.3C19.5 16.4 12 21 12 21z" />
    </svg>
  );
}

export function SparkleIcon({ className, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} {...props}>
      <path d="M12 2c.6 3.6 1.4 6 2.8 7.5S18.4 11.4 22 12c-3.6.6-6 1.4-7.5 2.8S12.6 18.4 12 22c-.6-3.6-1.4-6-2.8-7.5S5.6 12.6 2 12c3.6-.6 6-1.4 7.5-2.8S11.4 5.6 12 2z" />
    </svg>
  );
}

export function FlowerIcon({ className, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" className={className} {...props}>
      <circle cx="12" cy="12" r="2.4" fill="currentColor" stroke="none" />
      {[0, 60, 120, 180, 240, 300].map((deg) => (
        <ellipse
          key={deg}
          cx="12"
          cy="6.4"
          rx="2.1"
          ry="3.2"
          transform={`rotate(${deg} 12 12)`}
        />
      ))}
    </svg>
  );
}

export function MailIcon({ className, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <rect x="2.5" y="5" width="19" height="14" rx="2.2" />
      <path d="M3.5 6.5 12 13l8.5-6.5" />
    </svg>
  );
}

export function ChevronDownIcon({ className, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

export function ChevronLeftIcon({ className, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}

export function ChevronRightIcon({ className, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <path d="M9 6l6 6-6 6" />
    </svg>
  );
}

export function CloseIcon({ className, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className={className} {...props}>
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

export function Volume2Icon({ className, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <path d="M4 9v6h4l5 4V5L8 9H4z" fill="currentColor" stroke="none" />
      <path d="M16.5 9a4.5 4.5 0 010 6M19.3 6.2a8.5 8.5 0 010 11.6" />
    </svg>
  );
}

export function VolumeXIcon({ className, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <path d="M4 9v6h4l5 4V5L8 9H4z" fill="currentColor" stroke="none" />
      <path d="M16 9l5 6M21 9l-5 6" />
    </svg>
  );
}

export function PlayIcon({ className, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} {...props}>
      <path d="M7 4.5v15l13-7.5-13-7.5z" />
    </svg>
  );
}

export function PauseIcon({ className, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} {...props}>
      <rect x="6" y="4.5" width="4.2" height="15" rx="1" />
      <rect x="13.8" y="4.5" width="4.2" height="15" rx="1" />
    </svg>
  );
}

export function MessageIcon({ className, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" />
    </svg>
  );
}

export function RefreshIcon({ className, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <path d="M3 12a9 9 0 0115.4-6.4M21 12a9 9 0 01-15.4 6.4" />
      <path d="M18.4 3.6v4.6H13.8M5.6 20.4v-4.6h4.6" />
    </svg>
  );
}

export function TapIcon({ className, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <path d="M9 11.5V5.2a1.6 1.6 0 013.2 0v5.3" />
      <path d="M12.2 10.4V4a1.6 1.6 0 013.2 0v6.6" />
      <path d="M15.4 10.7V6.1a1.6 1.6 0 013.2 0v8.4c0 3.6-2.2 6.5-6 6.5-2.4 0-3.7-.8-5-2.3l-3-3.6c-.6-.8-.5-1.9.3-2.5.7-.5 1.7-.4 2.3.2l1.8 1.8" />
      <path d="M2.5 3.5c-.9 1.4-1.4 2.8-1.4 4.5" opacity=".6" />
      <path d="M5.3 5c-.5.9-.8 1.8-.8 2.9" opacity=".6" />
    </svg>
  );
}

export function CoupleDoodleIcon({ className, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 120 70" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      {/* Left figure */}
      <circle cx="42" cy="14" r="7.5" />
      <path d="M42 21.5v20c-4 3-6 8-6.5 15M42 41.5c4 3 6 8 6.5 15" />
      <path d="M35.5 30c2.5 3 5 4 6.5 4s4-1 6.5-4" />
      {/* Right figure, leaning in */}
      <circle cx="63" cy="15.5" r="7.5" />
      <path d="M63 23v19c3.5 3 5 8 5.5 14.5M63 42c-3.5 3-5.5 7.5-6.5 14.5" />
      <path d="M56.5 31c2.3 2.8 4.6 3.8 6.5 3.8s4.2-1 6.5-3.8" />
      {/* joined hands */}
      <path d="M48.5 39c1.8 1.6 3.6 2.2 5 2.2s3.2-.6 5-2.2" />
      {/* small floating hearts */}
      <path d="M52 6c-1-1.6-3.2-1.7-3.9-.2-.7-1.5-2.9-1.4-3.9.2-1.2 1.9.9 3.8 3.9 5.8 3-2 5.1-3.9 3.9-5.8z" transform="translate(2 -3) scale(0.55)" />
      <path d="M52 6c-1-1.6-3.2-1.7-3.9-.2-.7-1.5-2.9-1.4-3.9.2-1.2 1.9.9 3.8 3.9 5.8 3-2 5.1-3.9 3.9-5.8z" transform="translate(58 -2) scale(0.5)" />
    </svg>
  );
}

export function MusicNoteIcon({ className, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} {...props}>
      <path d="M9 18a3 3 0 100-6 3 3 0 000 6zm0 0V5.5L20 3v11" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="17" cy="14" r="3" />
    </svg>
  );
}

