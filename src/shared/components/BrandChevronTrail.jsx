/**
 * The two strokes of the ">" in the Biztras logo, lifted verbatim from `biztras-logo.svg`.
 * Wrapped in a symbol whose viewBox is the mark's own bounding box, so a `<use>` can be placed
 * with plain x/y/width/height instead of nested translate+scale transforms.
 */
const CHEVRON_VIEWBOX = '0 14.839 16.805 25.417';

/** Mark aspect: height is this multiple of width. Used to keep every `<use>` undistorted. */
const RATIO = 25.417 / 16.805;

/** Diagonal trail across the login brand panel: small at the top left, accelerating into the
 *  oversized red mark that bleeds off the bottom right corner. */
const PANEL_TRAIL = [
  { x: 6, y: 52, w: 34, o: 0.055 },
  { x: 58, y: 112, w: 48, o: 0.065 },
  { x: 124, y: 182, w: 66, o: 0.08 },
  { x: 178, y: 244, w: 90, o: 0.095 },
];

/** Vertical descent down the narrow sidebar rail, filling the space below the nav. */
const RAIL_TRAIL = [
  { x: -14, y: 470, w: 70, o: 0.055 },
  { x: 40, y: 556, w: 96, o: 0.07 },
  { x: 112, y: 650, w: 130, o: 0.05 },
];

const VARIANTS = {
  panel: {
    viewBox: '0 0 400 560',
    trail: PANEL_TRAIL,
    anchor: { x: 268, y: 352, w: 175, o: 0.26 },
  },
  rail: {
    viewBox: '0 0 258 800',
    trail: RAIL_TRAIL,
    anchor: null,
  },
};

/**
 * Ambient brand artwork: the logo chevron repeated as a receding trail, reading as forward motion.
 * Sits behind panel content and is purely decorative.
 * @param {'panel'|'rail'} variant - Which composition to draw; see VARIANTS.
 * @param {string} [className] - Positioning classes applied to the svg.
 */
const BrandChevronTrail = ({ variant, className = '' }) => {
  const { viewBox, trail, anchor } = VARIANTS[variant];
  const symbolId = `bz-chevron-${variant}`;

  return (
    <svg
      className={className}
      viewBox={viewBox}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      focusable="false"
    >
      <symbol id={symbolId} viewBox={CHEVRON_VIEWBOX}>
        <path d="M0 34.229v6.027l16.805-9.694v-6.027L0 34.229Z" />
        <path d="M0 14.839v6.025l16.805 9.694v-6.025L0 14.839Z" />
      </symbol>

      {trail.map(({ x, y, w, o }) => (
        <use key={`${x}-${y}`} href={`#${symbolId}`} x={x} y={y} width={w} height={w * RATIO} fill="#fff" opacity={o} />
      ))}

      {anchor && (
        <use
          href={`#${symbolId}`}
          x={anchor.x}
          y={anchor.y}
          width={anchor.w}
          height={anchor.w * RATIO}
          fill="#D91C35"
          opacity={anchor.o}
        />
      )}
    </svg>
  );
};

export default BrandChevronTrail;
