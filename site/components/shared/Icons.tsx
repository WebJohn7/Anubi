type IconProps = { size?: number; className?: string };

export const ArrowUpRight = ({ size = 16, className }: IconProps) => (
  <svg className={className} width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M4 12L12 4M5.5 4H12V10.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="square" />
  </svg>
);

export const ArrowDownRight = ({ size = 16, className }: IconProps) => (
  <svg className={className} width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M4 4L12 12M12 5.5V12H5.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="square" />
  </svg>
);

export const ArrowDown = ({ size = 18, className }: IconProps) => (
  <svg className={className} width={size} height={size} viewBox="0 0 18 18" fill="none" aria-hidden="true">
    <path d="M9 2V16M3.5 10.5L9 16L14.5 10.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="square" />
  </svg>
);

/** Six-armed hand-drawn asterisk used across the page. */
export const Asterisk = ({ size = 40, className, color = "var(--violet)" }: IconProps & { color?: string }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 40 40" fill="none" aria-hidden="true">
    <g stroke={color} strokeWidth="6.5" strokeLinecap="round">
      <path d="M20 4.5V35.5" />
      <path d="M6.6 12.2L33.4 27.8" />
      <path d="M6.6 27.8L33.4 12.2" />
    </g>
  </svg>
);
