import { useState } from 'react';
import Layout from '../../../shared/components/Layout.jsx';
import { PageHeader, TabBar, CardGrid } from '../../../shared/components/hr/HrPage.jsx';

const CARDS = [
  { title: 'Biztras opens Dubai delivery centre', subtitle: 'Corporate Communications', body: 'Our second UAE office goes live in September, adding capacity for ERP and managed-services delivery.', meta: '18 Aug 2026', badge: 'Company', avatar: { icon: 'globe' }, group: 'Company' },
  { title: 'Q3 performance reviews open', subtitle: 'Human Resources', body: 'Self-assessments are due by 31 August. Your manager review follows in the first week of September.', meta: '17 Aug 2026', badge: 'HR', avatar: { icon: 'award' }, group: 'HR' },
  { title: 'Scheduled VPN maintenance', subtitle: 'IT Service Desk', body: 'The corporate VPN will be unavailable on Friday 22 August, 11 PM to 2 AM GST.', meta: '15 Aug 2026', badge: 'IT', avatar: { icon: 'shield' }, group: 'IT' },
  { title: 'Certification reimbursement', subtitle: 'People & Culture', body: 'Odoo and cloud certifications are now fully reimbursed on first-attempt pass. Apply via Service Desk.', meta: '11 Aug 2026', badge: 'HR', avatar: { icon: 'award' }, group: 'HR' },
];

const TABS = ['All', 'Company', 'HR', 'IT'];

const Announcements = () => {
  const [tab, setTab] = useState(TABS[0]);
  const cards = tab === 'All' ? CARDS : CARDS.filter((c) => c.group === tab);

  return (
    <Layout>
      <div className="flex flex-col gap-[22px]">
        <PageHeader title="Announcements" subtitle="Company news and updates" />
        <TabBar tabs={TABS} active={tab} onChange={setTab} />
        <CardGrid cards={cards} columns={2} />
      </div>
    </Layout>
  );
};

export default Announcements;
