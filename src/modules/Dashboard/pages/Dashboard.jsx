import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Layout from '../../../shared/components/Layout.jsx';
import StatusBadge from '../../../shared/components/hr/StatusBadge.jsx';
import Icon from '../../../shared/components/Icon.jsx';
import { ErrorState } from '../../../shared/components/hr/HrPage.jsx';
import { useAuth } from '../../../shared/context/AuthContext.jsx';
import ApplyLeaveModal from '../../Leave/components/ApplyLeaveModal.jsx';
import { getProfile } from '../../Profile/services/profileService.js';
import { listAttendance } from '../../Attendance/services/attendanceService.js';
import { getBalances, getLeaveList } from '../../Leave/services/leaveService.js';
import { formatDateRange, formatTime } from '../../../shared/utils/date.js';

const SERVICES = [
  { to: '/profile', label: 'My Profile', desc: 'View and update your profile', icon: 'user' },
  { to: '/attendance', label: 'Attendance', desc: 'View attendance records', icon: 'calendarClock' },
  { to: '/leave', label: 'Leave Requests', desc: 'Apply for leave or check balance', icon: 'calendar' },
  { to: '/payslips', label: 'Payroll', desc: 'View your salary slips', icon: 'receipt' },
  { to: '/documents', label: 'Documents', desc: 'Access company documents', icon: 'file' },
  { to: '/directory', label: 'Directory', desc: 'Find employees and contact', icon: 'users' },
];

const ANNOUNCEMENTS = [
  { tag: 'Company', title: 'Biztras opens Dubai delivery centre', body: 'Our second UAE office goes live in September, adding capacity for ERP delivery.', date: '18 Aug 2026', c: '#16264D', icon: 'globe' },
  { tag: 'HR', title: 'Q3 performance reviews open', body: 'Self-assessments are due by 31 August.', date: '17 Aug 2026', c: '#D91C35', icon: 'award' },
  { tag: 'IT', title: 'Scheduled VPN maintenance', body: 'Unavailable Friday 22 August, 11 PM to 2 AM GST.', date: '15 Aug 2026', c: '#21366D', icon: 'shield' },
];

const LEAVE_BAR_COLORS = ['#16264D', '#34518F', '#D91C35', '#4A6BA8', '#A8142C'];
const PENDING_STATES = ['confirm', 'validate1'];

/** Sums a record's worked hours, falling back to the check-in/check-out gap when the backend omits it. */
const recordHours = (r) => {
  if (typeof r.workedHours === 'number') return r.workedHours;
  if (r.checkIn && r.checkOut) return (r.checkOut.getTime() - r.checkIn.getTime()) / 3_600_000;
  return 0;
};

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [applyOpen, setApplyOpen] = useState(false);

  const profileQuery = useQuery({ queryKey: ['profile'], queryFn: getProfile });
  const todayQuery = useQuery({ queryKey: ['attendance', 'today'], queryFn: () => listAttendance({ dateFrom: new Date(), dateTo: new Date() }) });
  const weekQuery = useQuery({
    queryKey: ['attendance', 'week'],
    queryFn: () => {
      const dateTo = new Date();
      const dateFrom = new Date();
      dateFrom.setDate(dateTo.getDate() - 6);
      return listAttendance({ dateFrom, dateTo });
    },
  });
  const balancesQuery = useQuery({ queryKey: ['leave', 'balances'], queryFn: getBalances });
  const listQuery = useQuery({ queryKey: ['leave', 'list'], queryFn: getLeaveList });

  const todayRecord = todayQuery.data?.[0];
  const isCheckedIn = !!todayRecord && !todayRecord.checkOut;
  const pendingCount = (listQuery.data || []).filter((r) => PENDING_STATES.includes(r.state)).length;
  const recentRequests = useMemo(() => (listQuery.data || []).slice(0, 4), [listQuery.data]);

  const weekBars = useMemo(() => {
    const records = (weekQuery.data || []).filter((r) => r.checkIn).slice(0, 5).reverse();
    const maxHours = Math.max(10, ...records.map(recordHours));
    return records.map((r, i) => {
      const hours = recordHours(r);
      return {
        day: r.checkIn.toLocaleDateString('en-US', { weekday: 'short' }),
        hours: `${hours.toFixed(1)}h`,
        // A still-open day has no measurable duration yet; it gets a flat track rather than a
        // stub bar, so it never reads as a stray accent line across the chart.
        empty: hours === 0,
        pct: hours === 0 ? 0 : Math.max(6, Math.round((hours / maxHours) * 100)),
        last: i === records.length - 1,
      };
    });
  }, [weekQuery.data]);
  const totalWeekHours = useMemo(() => (weekQuery.data || []).reduce((sum, r) => sum + recordHours(r), 0), [weekQuery.data]);
  const totalWeekLabel = `${Math.floor(totalWeekHours)}h ${Math.round((totalWeekHours % 1) * 60)}m`;

  const firstName = (profileQuery.data?.name || user?.name || 'there').split(' ')[0];
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  const todayLabel = new Date().toLocaleDateString('en-US', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' });

  const statCards = [
    { icon: 'calendarClock', title: 'Check In', value: todayRecord ? formatTime(todayRecord.checkIn) : '-', foot: isCheckedIn ? 'Today' : 'Not checked in yet' },
    { icon: 'calendar', title: 'Leave Balance', value: balancesQuery.data ? String(balancesQuery.data.totalRemaining) : '-', foot: 'Days available' },
    { icon: 'fileClock', title: 'Pending', value: String(pendingCount).padStart(2, '0'), foot: 'Requests awaiting approval' },
    { icon: 'chart', title: 'Hours This Week', value: totalWeekLabel, foot: `Across ${weekBars.length} working days` },
  ];

  const anyError = profileQuery.isError || todayQuery.isError || balancesQuery.isError || listQuery.isError;

  return (
    <Layout>
      <div className="flex flex-col gap-[22px]">
        <div>
          <h1 className="m-0 break-words text-[27px] font-semibold tracking-[-0.02em] text-[var(--tx)] sm:text-[29px]">
            {greeting}, {firstName}
          </h1>
          <p className="m-0 mt-1.5 text-[15px] text-[var(--tx2)]">{todayLabel}</p>
        </div>

        {anyError && <ErrorState message="Some dashboard data failed to load." onRetry={() => { profileQuery.refetch(); todayQuery.refetch(); balancesQuery.refetch(); listQuery.refetch(); }} />}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-[18px] xl:grid-cols-4">
          {statCards.map(({ icon, title, value, foot }, i) => (
            <div
              key={title}
              className="bz-fade relative overflow-hidden rounded-[14px] border border-[var(--border)] bg-[var(--surface)] p-5 transition-[transform,box-shadow,border-color] duration-200 hover:-translate-y-1 hover:border-[var(--border-2)] hover:shadow-[0_14px_30px_rgba(27,27,43,0.10)]"
              style={{ animationDelay: `${i * 0.06}s` }}
            >
              <div className="absolute inset-x-0 top-0 h-[3px]" style={{ background: i === 0 ? 'var(--pri)' : 'var(--ink)' }} />
              <div className="flex items-start justify-between gap-3">
                <div className="text-[12.5px] font-semibold uppercase tracking-[0.08em] text-[var(--tx2)]">{title}</div>
                <div className="grid h-[38px] w-[38px] flex-shrink-0 place-items-center rounded-[9px] bg-[var(--ink-bg)]">
                  <Icon name={icon} size={21} color="var(--ink)" />
                </div>
              </div>
              <div className="mt-3 text-[30px] font-bold tabular-nums tracking-[-0.03em] text-[var(--ink)]">{value}</div>
              <div className="mt-[3px] text-[13.5px] text-[var(--tx2)]">{foot}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 items-start gap-[18px] xl:grid-cols-[1.7fr_1fr]">
          <section className="bz-fade rounded-[14px] border border-[var(--border)] bg-[var(--surface)] p-6" style={{ animationDelay: '0.1s' }}>
            <div className="mb-5 flex items-center gap-2.5">
              <span className="block h-[18px] w-1 bg-[var(--pri)]" />
              <h2 className="m-0 text-[17px] font-semibold tracking-[-0.01em] text-[var(--tx)]">Quick Access</h2>
            </div>
            <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
              {SERVICES.map(({ to, label, desc, icon }, i) => (
                <button
                  key={to}
                  type="button"
                  onClick={() => navigate(to)}
                  className="bz-pop flex cursor-pointer flex-col items-start gap-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-[18px] text-left transition-all duration-200 hover:-translate-y-1 hover:border-[var(--ink-2)] hover:bg-[var(--surface-2)] hover:shadow-[0_10px_22px_rgba(27,27,43,0.09)]"
                  style={{ animationDelay: `${0.1 + i * 0.04}s` }}
                >
                  <div className="grid h-[42px] w-[42px] place-items-center rounded-[10px] bg-[var(--ink-bg)]">
                    <Icon name={icon} size={22} color="var(--ink)" />
                  </div>
                  <div className="text-[14.5px] font-medium text-[var(--tx)]">{label}</div>
                  <div className="text-[12.5px] leading-[1.4] text-[var(--tx2)]">{desc}</div>
                </button>
              ))}
            </div>
          </section>

          <section className="bz-fade rounded-[14px] border border-[var(--border)] bg-[var(--surface)] p-6" style={{ animationDelay: '0.16s' }}>
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="block h-[18px] w-1 bg-[var(--pri)]" />
                <h2 className="m-0 text-[17px] font-semibold text-[var(--tx)]">Announcements</h2>
              </div>
              <button type="button" onClick={() => navigate('/announcements')} className="cursor-pointer border-0 bg-transparent text-sm font-medium text-[var(--pri)] hover:text-[var(--pri-d)]">View all</button>
            </div>
            <div className="flex flex-col gap-3.5">
              {ANNOUNCEMENTS.map((a) => (
                <div key={a.title} className="-m-2.5 flex cursor-pointer gap-3.5 rounded-[10px] p-2.5 transition-colors duration-200 hover:bg-[var(--surface-2)]">
                  <div className="grid h-14 w-14 flex-shrink-0 place-items-center rounded-[11px]" style={{ background: a.c }}>
                    <Icon name={a.icon} size={24} color="#fff" accent="#FBE8EA" weight={1.6} />
                  </div>
                  <div className="min-w-0">
                    <StatusBadge>{a.tag}</StatusBadge>
                    <div className="mt-[7px] text-[14.5px] font-medium text-[var(--tx)]">{a.title}</div>
                    <div className="mt-[3px] text-[13px] leading-[1.45] text-[var(--tx2)]">{a.body}</div>
                    <div className="mt-[5px] text-[12px] text-[var(--tx3)]">{a.date}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="grid grid-cols-1 items-start gap-[18px] xl:grid-cols-3">
          <section className="bz-fade rounded-[14px] border border-[var(--border)] bg-[var(--surface)] p-6" style={{ animationDelay: '0.22s' }}>
            <div className="mb-[18px] flex items-center gap-2.5">
              <span className="block h-[18px] w-1 bg-[var(--pri)]" />
              <h2 className="m-0 text-[17px] font-semibold text-[var(--tx)]">Leave Balance</h2>
            </div>
            {balancesQuery.data?.balances.length ? (
              <>
                <div className="flex items-baseline gap-2.5">
                  <span className="text-[40px] font-extrabold tabular-nums tracking-[-0.035em] text-[var(--ink)]">{balancesQuery.data.totalRemaining}</span>
                  <span className="text-sm text-[var(--tx2)]">days available</span>
                </div>
                <div className="mt-[18px] flex flex-col gap-3.5">
                  {balancesQuery.data.balances.map((b, i) => (
                    <div key={b.leaveTypeId}>
                      <div className="mb-1.5 flex items-baseline justify-between gap-3 text-[13.5px]">
                        <span className="min-w-0 truncate text-[#3A3550]">{b.name}</span>
                        <span className="flex-shrink-0 font-bold tabular-nums text-[var(--ink)]">
                          {b.remaining}{b.allocated ? <span className="font-medium text-[var(--tx3)]"> / {b.allocated}</span> : null}
                        </span>
                      </div>
                      <div className="h-1.5 overflow-hidden rounded-[3px] bg-[var(--ink-bg)]">
                        <i
                          className="block h-full rounded-[3px]"
                          style={{
                            width: `${b.allocated ? Math.min(100, Math.max(0, (b.remaining / b.allocated) * 100)) : 0}%`,
                            background: LEAVE_BAR_COLORS[i % LEAVE_BAR_COLORS.length],
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <p className="m-0 text-sm text-[var(--tx3)]">{balancesQuery.isLoading ? 'Loading...' : 'No leave balances found.'}</p>
            )}
            <button
              type="button"
              onClick={() => setApplyOpen(true)}
              className="mt-5 flex w-full cursor-pointer items-center justify-center gap-2 rounded-[9px] border border-[#E1E2E7] bg-white py-3 text-[14.5px] font-medium text-[var(--ink-2)] transition-all duration-200 hover:bg-[var(--ink-2)] hover:text-white hover:border-[var(--ink-2)]"
            >
              Apply Leave <Icon name="chevronRight" size={16} color="currentColor" flat />
            </button>
          </section>

          <section className="bz-fade rounded-[14px] border border-[var(--border)] bg-[var(--surface)] p-6" style={{ animationDelay: '0.28s' }}>
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="block h-[18px] w-1 bg-[var(--pri)]" />
                <h2 className="m-0 text-[17px] font-semibold text-[var(--tx)]">Recent Requests</h2>
              </div>
              <button type="button" onClick={() => navigate('/leave')} className="cursor-pointer border-0 bg-transparent text-sm font-medium text-[var(--pri)] hover:text-[var(--pri-d)]">View all</button>
            </div>
            {recentRequests.length ? recentRequests.map((r) => (
              <div key={r.id} className="-mx-2 flex items-center gap-3 rounded-[9px] px-2 py-3 transition-colors duration-200 hover:bg-[var(--surface-2)]">
                <div className="grid h-8 w-8 flex-shrink-0 place-items-center rounded-lg bg-[var(--ink-bg)]">
                  <Icon name="calendar" size={15} color="var(--ink)" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[14.5px] font-medium text-[var(--tx)]">{r.leaveTypeName}</div>
                  <div className="mt-0.5 text-[12.5px] text-[var(--tx2)]">{formatDateRange(r.dateFrom, r.dateTo)}</div>
                </div>
                <StatusBadge>{r.status}</StatusBadge>
              </div>
            )) : (
              <p className="m-0 text-sm text-[var(--tx3)]">{listQuery.isLoading ? 'Loading...' : 'No requests yet.'}</p>
            )}
          </section>

          <section className="bz-fade rounded-[14px] border border-[var(--border)] bg-[var(--surface)] p-6" style={{ animationDelay: '0.34s' }}>
            <div className="mb-[18px] flex items-center gap-2.5">
              <span className="block h-[18px] w-1 bg-[var(--pri)]" />
              <h2 className="m-0 text-[17px] font-semibold text-[var(--tx)]">This Week</h2>
            </div>
            {weekBars.length ? (
              <>
                <div className="flex h-[132px] items-end justify-between gap-2.5">
                  {weekBars.map((b) => (
                    <div key={b.day} className="flex h-full flex-1 flex-col items-center justify-end gap-2.5">
                      <span className={`text-[11.5px] font-semibold tabular-nums ${b.empty ? 'text-[var(--tx3)]' : 'text-[var(--tx2)]'}`}>{b.hours}</span>
                      {b.empty ? (
                        <div className="h-[3px] w-full rounded-full bg-[var(--border)]" />
                      ) : (
                        <div
                          className="w-full rounded-t-[5px] rounded-b-[2px]"
                          style={{ height: `${b.pct}%`, background: b.last ? 'var(--pri)' : 'var(--ink)' }}
                        />
                      )}
                      <span className="text-[12.5px] text-[var(--tx2)]">{b.day}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-[18px] flex justify-between border-t border-[var(--border)] pt-4 text-[13.5px]">
                  <span className="text-[var(--tx2)]">Total logged</span>
                  <span className="font-bold tabular-nums text-[var(--ink)]">{totalWeekLabel}</span>
                </div>
              </>
            ) : (
              <p className="m-0 text-sm text-[var(--tx3)]">{weekQuery.isLoading ? 'Loading...' : 'No punches in the last 7 days.'}</p>
            )}
          </section>
        </div>
      </div>

      <ApplyLeaveModal open={applyOpen} onClose={() => setApplyOpen(false)} />
    </Layout>
  );
};

export default Dashboard;
