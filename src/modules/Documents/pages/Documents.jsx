import { useState } from 'react';
import toast from 'react-hot-toast';
import Layout from '../../../shared/components/Layout.jsx';
import { PageHeader, TabBar, CardGrid } from '../../../shared/components/hr/HrPage.jsx';

const CARDS = [
  { title: 'Employee Handbook', subtitle: 'PDF · 2.1 MB', body: 'Code of conduct, working hours and workplace policies for all Biztras staff.', meta: 'Updated 04 Jun 2026', badge: 'Company', avatar: { icon: 'file' }, group: 'Company' },
  { title: 'Hybrid Work Policy', subtitle: 'PDF · 580 KB', body: 'Eligibility, remote-day limits and manager approval workflow.', meta: 'Updated 22 Jul 2026', badge: 'Company', avatar: { icon: 'home' }, group: 'Company' },
  { title: 'Employment Contract', subtitle: 'PDF · 1.0 MB', body: 'Your signed contract and the 2026 salary revision addendum.', meta: 'Issued 04 Feb 2021', badge: 'HR', avatar: { icon: 'receipt' }, group: 'Personal' },
  { title: 'Salary Certificate', subtitle: 'PDF · 190 KB', body: 'Bank-addressed certificate issued on request.', meta: 'Issued 11 Aug 2026', badge: 'HR', avatar: { icon: 'receipt' }, group: 'Personal' },
  { title: 'Health Insurance Card', subtitle: 'PDF · 165 KB', body: 'Network coverage summary and member ID.', meta: 'Valid to 31 Dec 2026', badge: 'HR', avatar: { icon: 'heart' }, group: 'Certificates' },
  { title: 'Information Security Policy', subtitle: 'PDF · 740 KB', body: 'Acceptable use, data handling and device security requirements.', meta: 'Acknowledged 12 Jan 2026', badge: 'IT', avatar: { icon: 'shield' }, group: 'Certificates' },
];

const TABS = ['Company', 'Personal', 'Certificates'];

const Documents = () => {
  const [tab, setTab] = useState(TABS[0]);
  const cards = CARDS.filter((c) => c.group === tab);

  return (
    <Layout>
      <div className="flex flex-col gap-[22px]">
        <PageHeader
          title="Documents"
          subtitle="Company policies and your personal records"
          actionLabel="Request Document"
          onAction={() => toast('Document requests aren\'t available yet, contact HR directly.')}
        />
        <TabBar tabs={TABS} active={tab} onChange={setTab} />
        <CardGrid cards={cards} columns={3} />
      </div>
    </Layout>
  );
};

export default Documents;
