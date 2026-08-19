import { useState } from 'react';
import Layout from '../../../shared/components/Layout.jsx';
import { PageHeader, TabBar, MetricGrid, DataTable } from '../../../shared/components/hr/HrPage.jsx';

const METRICS = [
  { label: 'Latest Net Pay', value: 'AED 16,240', note: 'July 2026' },
  { label: 'YTD Gross', value: 'AED 128,800', note: 'Jan to Jul 2026' },
  { label: 'Deductions YTD', value: 'AED 6,420', note: 'Incl. pension' },
  { label: 'Next Pay Date', value: '28 Aug', note: 'WPS transfer' },
];

const COLUMNS = ['Period', 'Gross', 'Deductions', 'Net Pay', 'Status'];

const ROWS = [
  ['July 2026', 'AED 18,000', 'AED 1,760', 'AED 16,240', 'Paid'],
  ['June 2026', 'AED 18,000', 'AED 1,760', 'AED 16,240', 'Paid'],
  ['May 2026', 'AED 19,400', 'AED 1,760', 'AED 17,640', 'Paid'],
  ['April 2026', 'AED 18,000', 'AED 900', 'AED 17,100', 'Paid'],
];

const TABS = ['2026', '2025'];

const Payslips = () => {
  const [tab, setTab] = useState(TABS[0]);

  return (
    <Layout>
      <div className="flex flex-col gap-[22px]">
        <PageHeader title="Payroll" subtitle="Monthly statements, WPS transfers and year-to-date totals" />
        <TabBar tabs={TABS} active={tab} onChange={setTab} />
        <MetricGrid metrics={METRICS} />
        <DataTable columns={COLUMNS} rows={tab === '2026' ? ROWS : []} statusColumn={4} />
      </div>
    </Layout>
  );
};

export default Payslips;
