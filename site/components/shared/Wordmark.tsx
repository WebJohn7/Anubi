import { BRAND } from "@/lib/brand";

/** Big wordmark drawn as SVG text in the display font, stretched to the 597×92 box the layout was measured with. */
export const Wordmark = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 597 92" width={597} height={92} role="img" aria-label={BRAND}>
    <text
      x="0"
      y="88"
      textLength="597"
      lengthAdjust="spacingAndGlyphs"
      fill="currentColor"
      style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 122, letterSpacing: "-0.04em" }}
    >
      {BRAND.toUpperCase()}
    </text>
  </svg>
);

/** Square brand mark for the header and favicon: black tile with a white N. */
export const BrandMark = ({ size = 34, className }: { size?: number; className?: string }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 34 34" aria-hidden="true">
    <rect width="34" height="34" rx="7" fill="#0f0f0f" />
    <path d="M10 25V9h2.6l8.8 11.6V9H24v16h-2.6L12.6 13.4V25z" fill="#fcfcfa" />
  </svg>
);
