import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Layout from '../../../shared/components/Layout.jsx';
import { PageHeader, TabBar, MetricGrid, DataTable, LoadingState, ErrorState, EmptyState } from '../../../shared/components/hr/HrPage.jsx';
import ApplyLeaveModal from '../components/ApplyLeaveModal.jsx';
import { getBalances, getLeaveList } from '../services/leaveService.js';
import { formatDateRange } from '../../../shared/utils/date.js';

const TABS = ['All', 'Approved', 'Pending', 'Rejected'];

const Leave = () => {
  const [tab, setTab] = useState(TABS[0]);
  const [applyOpen, setApplyOpen] = useState(false);

  const balancesQuery = useQuery({ queryKey: ['leave', 'balances'], queryFn: getBalances });
  const listQuery = useQuery({ queryKey: ['leave', 'list'], queryFn: getLeaveList });

  const metrics = useMemo(
    () => (balancesQuery.data?.balances || []).map((b) => ({ label: b.name, value: String(b.remaining), note: 'Days available' })),
    [balancesQuery.data]
  );

  const rows = useMemo(() => {
    const list = listQuery.data || [];
    const filtered = tab === 'All' ? list : list.filter((r) => r.status === tab);
    return filtered.map((r) => [
      r.leaveTypeName,
      formatDateRange(r.dateFrom, r.dateTo),
      String(r.numberOfDays),
      r.description || '-',
      r.status,
    ]);
  }, [listQuery.data, tab]);

  return (
    <Layout>
      <div className="flex flex-col gap-[22px]">
        <PageHeader
          title="Leave Requests"
          subtitle="Balances, history and new requests"
          actionLabel="Apply Leave"
          onAction={() => setApplyOpen(true)}
        />
        <TabBar tabs={TABS} active={tab} onChange={setTab} />

        {balancesQuery.isLoading ? (
          <LoadingState label="Loading leave balances..." />
        ) : balancesQuery.isError ? (
          <ErrorState message={balancesQuery.error.message} onRetry={balancesQuery.refetch} />
        ) : (
          <MetricGrid metrics={metrics} />
        )}

        {listQuery.isLoading ? (
          <LoadingState label="Loading leave history..." />
        ) : listQuery.isError ? (
          <ErrorState message={listQuery.error.message} onRetry={listQuery.refetch} />
        ) : rows.length ? (
          <DataTable columns={['Leave Type', 'Dates', 'Days', 'Description', 'Status']} rows={rows} statusColumn={4} />
        ) : (
          <EmptyState label="No leave requests here yet." />
        )}
      </div>

      <ApplyLeaveModal open={applyOpen} onClose={() => setApplyOpen(false)} />
    </Layout>
  );
};

export default Leave;
