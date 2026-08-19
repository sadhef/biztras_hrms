import { useState } from 'react';
import Layout from '../../../shared/components/Layout.jsx';
import { PageHeader, TabBar, CardGrid } from '../../../shared/components/hr/HrPage.jsx';

const CARDS = [
  { title: 'Meera Suresh', subtitle: 'Delivery Manager', body: 'meera.suresh@biztras.com · +971 2 000 4410', meta: 'Delivery', badge: 'Company', avatar: 'MS', group: 'Delivery' },
  { title: 'Anand Pillai', subtitle: 'Head of Technology', body: 'anand.pillai@biztras.com · +971 2 000 4423', meta: 'Technology', badge: 'Company', avatar: 'AP', group: 'Technology' },
  { title: 'Fatima Al Hosani', subtitle: 'HR Business Partner', body: 'fatima.alhosani@biztras.com · +971 2 000 4402', meta: 'Corporate', badge: 'HR', avatar: 'FH', group: 'Corporate' },
  { title: 'Vishnu Menon', subtitle: 'Senior Odoo Developer', body: 'vishnu.menon@biztras.com · +971 2 000 4438', meta: 'Technology · Dubai', badge: 'Company', avatar: 'VM', group: 'Technology' },
  { title: 'Sana Iqbal', subtitle: 'QA Lead', body: 'sana.iqbal@biztras.com · +971 2 000 4441', meta: 'Technology', badge: 'Company', avatar: 'SI', group: 'Technology' },
  { title: 'Joseph Thomas', subtitle: 'IT Infrastructure Engineer', body: 'joseph.thomas@biztras.com · +971 2 000 4455', meta: 'Technology', badge: 'IT', avatar: 'JT', group: 'Technology' },
];

const TABS = ['All', 'Technology', 'Delivery', 'Corporate'];

const Directory = () => {
  const [tab, setTab] = useState(TABS[0]);
  const cards = tab === 'All' ? CARDS : CARDS.filter((c) => c.group === tab);

  return (
    <Layout>
      <div className="flex flex-col gap-[22px]">
        <PageHeader title="Team Directory" subtitle="Find colleagues across teams and offices" />
        <TabBar tabs={TABS} active={tab} onChange={setTab} />
        <CardGrid cards={cards} columns={3} />
      </div>
    </Layout>
  );
};

export default Directory;
