/** Base stroke paths, ported verbatim from the Biztras HR reference design's icon set. */
const ICONS = {
  grid: "<rect x='3' y='3' width='7.5' height='7.5' rx='1.4'/><rect x='13.5' y='3' width='7.5' height='7.5' rx='1.4'/><rect x='3' y='13.5' width='7.5' height='7.5' rx='1.4'/><rect x='13.5' y='13.5' width='7.5' height='7.5' rx='1.4'/>",
  user: "<path d='M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2'/><circle cx='12' cy='7' r='4'/>",
  clock: "<circle cx='12' cy='12' r='9'/><path d='M12 7v5l3 2'/>",
  calendarClock: "<path d='M21 9.5V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h6'/><path d='M16 2v4M8 2v4M3 10h18'/><circle cx='17.5' cy='16.5' r='4.5'/><path d='M17.5 14.6v2l1.4 1'/>",
  calendar: "<rect x='3' y='4' width='18' height='17' rx='2'/><path d='M16 2v4M8 2v4M3 10h18'/>",
  fileClock: "<path d='M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z'/><path d='M14 2v6h6'/><circle cx='9.5' cy='15.5' r='3.2'/><path d='M9.5 13.9v1.7l1.2.9'/>",
  receipt: "<path d='M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z'/><path d='M8 8h8M8 12h8M8 16h5'/>",
  file: "<path d='M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7z'/><path d='M15 2v5h5'/><path d='M8 13h8M8 17h5'/>",
  megaphone: "<path d='m3 11 18-5v12L3 14v-3z'/><path d='M11.6 16.8a3 3 0 1 1-5.8-1.6'/>",
  users: "<path d='M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2'/><circle cx='9' cy='7' r='4'/><path d='M22 21v-2a4 4 0 0 0-3-3.87'/><path d='M16 3.13a4 4 0 0 1 0 7.75'/>",
  help: "<circle cx='12' cy='12' r='9'/><path d='M9.2 9.3a3 3 0 0 1 5.8 1c0 2-3 2.7-3 2.7'/><path d='M12 17h.01'/>",
  settings: "<path d='M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z'/><circle cx='12' cy='12' r='3'/>",
  logout: "<path d='M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4'/><path d='m16 17 5-5-5-5'/><path d='M21 12H9'/>",
  bell: "<path d='M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9'/><path d='M10.3 21a1.94 1.94 0 0 0 3.4 0'/>",
  search: "<circle cx='11' cy='11' r='7.5'/><path d='m21 21-4.3-4.3'/>",
  check: "<path d='M20 6 9 17l-5-5'/>",
  folder: "<path d='M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z'/>",
  shield: "<path d='M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z'/>",
  globe: "<circle cx='12' cy='12' r='9'/><path d='M3 12h18'/><path d='M12 3a15.3 15.3 0 0 1 4 9 15.3 15.3 0 0 1-4 9 15.3 15.3 0 0 1-4-9 15.3 15.3 0 0 1 4-9z'/>",
  monitor: "<rect width='20' height='14' x='2' y='3' rx='2'/><path d='M8 21h8M12 17v4'/>",
  heart: "<path d='M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z'/><path d='M3.3 13h6.2l.5-1 2 4.5 2-7 1.5 3.5h5.2'/>",
  home: "<path d='m3 10 9-7 9 7v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z'/><path d='M9 21v-8h6v8'/>",
  chart: "<path d='M3 3v16a2 2 0 0 0 2 2h16'/><path d='m7 15 4-5 3 3 5-7'/>",
  chevronDown: "<path d='m6 9 6 6 6-6'/>",
  chevronRight: "<path d='m9 18 6-6-6-6'/>",
  code: "<path d='m16 18 6-6-6-6'/><path d='m8 6-6 6 6 6'/>",
  ticket: "<path d='M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2z'/><path d='M13 5v2M13 17v2M13 11v2'/>",
  award: "<circle cx='12' cy='8' r='6'/><path d='M15.5 13.5 17 22l-5-3-5 3 1.5-8.5'/>",
};

/** Accent overlay paths (drawn in `accent` on top of the base stroke) for the same icon set. */
const ACCENTS = {
  grid: "<rect x='13.5' y='13.5' width='7.5' height='7.5' rx='1.4'/>",
  user: "<circle cx='12' cy='7' r='4'/>",
  clock: "<path d='M12 7.4V12l3 2'/>",
  calendarClock: "<circle cx='17.5' cy='16.5' r='4.5'/><path d='M17.5 14.6v2l1.4 1'/>",
  calendar: "<path d='M7.5 14h3v3h-3z'/>",
  fileClock: "<circle cx='9.5' cy='15.5' r='3.2'/><path d='M9.5 13.9v1.7l1.2.9'/>",
  receipt: "<path d='M8 8h8'/><path d='M8 12h8'/>",
  file: "<path d='M14.5 2.2V7.5a1 1 0 0 0 1 1h5.3'/>",
  megaphone: "<path d='M11.6 16.8a3 3 0 1 1-5.8-1.6'/>",
  users: "<circle cx='9' cy='7' r='4'/>",
  help: "<path d='M9.2 9.3a3 3 0 0 1 5.8 1c0 2-3 2.7-3 2.7'/><path d='M12 17h.01'/>",
  settings: "<circle cx='12' cy='12' r='3'/>",
  bell: "<path d='M10.3 21a1.94 1.94 0 0 0 3.4 0'/>",
  folder: "<path d='M2 8h20'/>",
  shield: "<path d='m9.2 12.1 2 2 3.6-3.9'/>",
  globe: "<path d='M12 3a15.3 15.3 0 0 1 4 9 15.3 15.3 0 0 1-4 9'/>",
  monitor: "<path d='M8 21h8M12 17v4'/>",
  home: "<path d='M9.3 21v-7.4h5.4V21'/>",
  chart: "<path d='m7 15 4-5 3 3 5-7'/>",
  code: "<path d='m16 18 6-6-6-6'/>",
  ticket: "<path d='M13 5v2M13 11v2M13 17v2'/>",
  award: "<path d='M15.5 13.5 17 22l-5-3-5 3 1.5-8.5'/>",
  heart: "<path d='M3.3 13h6.2l.5-1 2 4.5 2-7 1.5 3.5h5.2'/>",
  logout: "<path d='m16 17 5-5-5-5'/><path d='M21 12H9'/>",
  search: "<path d='m21 21-4.3-4.3'/>",
};

const ACCENT_RED = '#D91C35';

/**
 * Duotone line icon matching the Biztras HR reference design: a base stroke in `color`, with a
 * second, slightly heavier stroke in `accent` drawn on top of one highlighted sub-part (a clock
 * hand, a calendar cell, a folder tab). Pass `flat` for the handful of reference icons that have
 * no accent overlay (search, chevrons, the notification check mark).
 * @param {keyof typeof ICONS} name - Icon key from the reference set.
 * @param {number} [size] - Width/height in px.
 * @param {string} [color] - Base stroke colour.
 * @param {string} [accent] - Accent stroke colour; defaults to the brand red unless `flat`.
 * @param {boolean} [flat] - Suppresses the accent overlay entirely.
 * @param {number} [weight] - Base stroke width; the accent stroke is `weight + 0.5`.
 */
const Icon = ({ name, size = 20, color = 'currentColor', accent, flat = false, weight = 1.7, className }) => {
  const base = ICONS[name];
  if (!base) return null;
  const accentColor = flat ? null : accent || ACCENT_RED;
  const accentPaths = accentColor ? ACCENTS[name] : null;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={{ display: 'block', flex: 'none' }}
    >
      <g stroke={color} strokeWidth={weight} dangerouslySetInnerHTML={{ __html: base }} />
      {accentPaths && <g stroke={accentColor} strokeWidth={weight + 0.5} dangerouslySetInnerHTML={{ __html: accentPaths }} />}
    </svg>
  );
};

export default Icon;
