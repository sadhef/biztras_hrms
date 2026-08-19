import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import Layout from '../../../shared/components/Layout.jsx';
import { PageHeader, TabBar, MetricGrid, DataTable, LoadingState, ErrorState, EmptyState } from '../../../shared/components/hr/HrPage.jsx';
import { listAttendance, punchAttendance } from '../services/attendanceService.js';
import { getCurrentCoords } from '../../../shared/utils/geolocation.js';
import { formatDate, formatTime, startOfMonth, startOfPreviousMonth, endOfPreviousMonth, startOfYear } from '../../../shared/utils/date.js';

const TABS = ['This Month', 'Last Month', 'Year to Date'];

/** Resolves a tab label to the concrete date range the backend query needs. */
const rangeForTab = (tab) => {
  const now = new Date();
  if (tab === 'Last Month') return { dateFrom: startOfPreviousMonth(now), dateTo: endOfPreviousMonth(now) };
  if (tab === 'Year to Date') return { dateFrom: startOfYear(now), dateTo: now };
  return { dateFrom: startOfMonth(now), dateTo: now };
};

const todayRange = () => {
  const now = new Date();
  return { dateFrom: now, dateTo: now };
};

/** Punch time plus a link to the captured coordinates on a map, when the punch has a location. */
const PunchCell = ({ time, coords }) => (
  <div>
    <div>{time}</div>
    {coords && (
      <a
        href={`https://www.google.com/maps?q=${coords.latitude},${coords.longitude}`}
        target="_blank"
        rel="noreferrer"
        className="text-[12px] text-[var(--pri)] hover:text-[var(--pri-d)]"
        onClick={(e) => e.stopPropagation()}
      >
        View on map
      </a>
    )}
  </div>
);

const Attendance = () => {
  const [tab, setTab] = useState(TABS[0]);
  const queryClient = useQueryClient();
  const range = rangeForTab(tab);

  const recordsQuery = useQuery({
    queryKey: ['attendance', 'range', tab],
    queryFn: () => listAttendance(range),
  });

  const todayQuery = useQuery({
    queryKey: ['attendance', 'today'],
    queryFn: () => listAttendance(todayRange()),
  });

  const punchMutation = useMutation({
    mutationFn: async (action) => {
      const coords = await getCurrentCoords();
      return punchAttendance({ action, ...coords });
    },
    onSuccess: (_, action) => {
      toast.success(action === 'in' ? 'Checked in' : 'Checked out');
      queryClient.invalidateQueries({ queryKey: ['attendance'] });
    },
    onError: (error) => toast.error(error.message),
  });

  const todayRecord = todayQuery.data?.[0];
  const isCheckedIn = !!todayRecord && !todayRecord.checkOut;

  const metrics = useMemo(() => {
    const records = recordsQuery.data || [];
    const withHours = records.filter((r) => r.workedHours != null);
    const totalHours = withHours.reduce((sum, r) => sum + r.workedHours, 0);
    const avgHours = withHours.length ? totalHours / withHours.length : 0;
    return [
      { label: 'Days Recorded', value: String(records.length).padStart(2, '0'), note: `In ${tab.toLowerCase()}` },
      { label: 'Total Hours', value: `${totalHours.toFixed(1)}h`, note: `Across ${withHours.length} completed days` },
      { label: 'Avg. Hours / Day', value: `${avgHours.toFixed(1)}h`, note: 'On completed days' },
      { label: 'Today', value: isCheckedIn ? 'Checked In' : 'Checked Out', note: todayRecord ? formatTime(todayRecord.checkIn) : 'No punch yet' },
    ];
  }, [recordsQuery.data, tab, isCheckedIn, todayRecord]);

  const rows = (recordsQuery.data || []).map((r) => [
    formatDate(r.checkIn),
    <PunchCell key="in" time={formatTime(r.checkIn)} coords={r.checkInCoords} />,
    <PunchCell key="out" time={formatTime(r.checkOut)} coords={r.checkOutCoords} />,
    r.workedHours != null ? `${r.workedHours.toFixed(1)}h` : '-',
    r.checkOut ? 'Present' : 'In Progress',
  ]);

  return (
    <Layout>
      <div className="flex flex-col gap-[22px]">
        <PageHeader
          title="Attendance"
          subtitle={`Check-ins, timesheets and worked hours for ${new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`}
          actionLabel={isCheckedIn ? 'Check Out' : 'Check In'}
          onAction={() => punchMutation.mutate(isCheckedIn ? 'out' : 'in')}
        />
        <TabBar tabs={TABS} active={tab} onChange={setTab} />

        {recordsQuery.isLoading ? (
          <LoadingState label="Loading attendance..." />
        ) : recordsQuery.isError ? (
          <ErrorState message={recordsQuery.error.message} onRetry={recordsQuery.refetch} />
        ) : (
          <>
            <MetricGrid metrics={metrics} />
            {rows.length ? <DataTable columns={['Date', 'Check In', 'Check Out', 'Worked', 'Status']} rows={rows} statusColumn={4} /> : <EmptyState label="No attendance records in this range." />}
          </>
        )}
      </div>
    </Layout>
  );
};

export default Attendance;
