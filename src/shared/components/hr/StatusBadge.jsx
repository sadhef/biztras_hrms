const TONE_BY_STATUS = {
  Approved: 'bg-[#E7F7EE] text-[#06A645]',
  Present: 'bg-[#E7F7EE] text-[#06A645]',
  Paid: 'bg-[#E7F7EE] text-[#06A645]',
  Pending: 'bg-[#FFF1E6] text-[#FD7B14]',
  Late: 'bg-[#FFF1E6] text-[#FD7B14]',
  Open: 'bg-[#FFF1E6] text-[#FD7B14]',
  'In Progress': 'bg-[#FFF1E6] text-[#FD7B14]',
  Rejected: 'bg-[#FBE8EA] text-[#A81529]',
  Absent: 'bg-[#FBE8EA] text-[#A81529]',
  HR: 'bg-[#FBE8EA] text-[#A81529]',
  Remote: 'bg-[#E7F0FE] text-[#2F6FED]',
  Company: 'bg-[#E7F0FE] text-[#2F6FED]',
  IT: 'bg-[#E7F0FE] text-[#2F6FED]',
};

/** Status/category pill used across every HR list, table, and card grid — tone keyed by the label's exact text. */
const StatusBadge = ({ children }) => (
  <span className={`inline-flex items-center whitespace-nowrap rounded-md px-3 py-[5px] text-xs font-semibold tracking-[0.03em] ${TONE_BY_STATUS[children] || 'bg-[var(--ink-bg)] text-[#3A3550]'}`}>
    {children}
  </span>
);

export default StatusBadge;
