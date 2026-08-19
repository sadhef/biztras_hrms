/** Odoo returns UTC timestamps with no timezone marker (e.g. "2026-08-08T08:06:49"); append Z before parsing. */
export const parseOdooTimestamp = (value) => {
  if (!value) return null;
  const iso = value.endsWith('Z') ? value : `${value}Z`;
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? null : date;
};

/** Formats a Date/date-string as "12 May 2025", or a dash when absent. */
export const formatDate = (value) => {
  if (!value) return '-';
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return '-';
  return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
};

/** Formats a from/to date pair as a single date, or a "12 May 2025 - 16 May 2025" range. */
export const formatDateRange = (from, to) => {
  if (!from) return '-';
  if (!to || from === to) return formatDate(from);
  return `${formatDate(from)} - ${formatDate(to)}`;
};

/** Formats a Date as "08:32 AM", or a dash when absent. */
export const formatTime = (date) => {
  if (!date) return '-';
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
};

/** Formats a Date as the "YYYY-MM-DD" the backend expects for query params and leave requests. */
export const toApiDate = (date) => date.toISOString().slice(0, 10);

/** Start-of-month, end-of-month, and start-of-year helpers used to build the Attendance page's date-range tabs. */
export const startOfMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1);
export const startOfPreviousMonth = (date) => new Date(date.getFullYear(), date.getMonth() - 1, 1);
export const endOfPreviousMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 0);
export const startOfYear = (date) => new Date(date.getFullYear(), 0, 1);
