import axios from '../../../config/axios.js';
import { parseOdooTimestamp, toApiDate } from '../../../shared/utils/date.js';

/** Lists attendance punches between two dates (inclusive), newest first. */
export const listAttendance = async ({ dateFrom, dateTo, limit = 62 }) => {
  const data = await axios.get('/attendance/list', {
    params: { date_from: toApiDate(dateFrom), date_to: toApiDate(dateTo), limit },
  });
  return data.records
    .map((r) => ({
      id: r.id,
      checkIn: parseOdooTimestamp(r.check_in),
      checkOut: parseOdooTimestamp(r.check_out),
      checkInCoords: r.in_latitude != null && r.in_longitude != null ? { latitude: r.in_latitude, longitude: r.in_longitude } : null,
      checkOutCoords: r.out_latitude != null && r.out_longitude != null ? { latitude: r.out_latitude, longitude: r.out_longitude } : null,
      workedHours: typeof r.worked_hours === 'number' ? r.worked_hours : null,
    }))
    .sort((a, b) => (b.checkIn?.getTime() || 0) - (a.checkIn?.getTime() || 0));
};

/** Sends a check-in or check-out only when the attendance punch includes valid coordinates. */
export const punchAttendance = async ({ action, latitude, longitude }) => {
  if (!Number.isFinite(latitude) || latitude < -90 || latitude > 90 || !Number.isFinite(longitude) || longitude < -180 || longitude > 180) {
    throw new Error('A valid location is mandatory for check-in and check-out.');
  }
  if (action === 'in') return axios.post('/attendance/checkin', { latitude, longitude });
  if (action === 'out') return axios.post('/attendance/checkout', { latitude, longitude });
  throw new Error('Invalid attendance action.');
};
