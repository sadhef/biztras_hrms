import { useQuery } from '@tanstack/react-query';
import Layout from '../../../shared/components/Layout.jsx';
import { LoadingState, ErrorState } from '../../../shared/components/hr/HrPage.jsx';
import { getProfile } from '../services/profileService.js';
import { formatDate } from '../../../shared/utils/date.js';

/** Label/value row used across every info card on this page. */
const InfoRow = ({ label, value }) => (
  <div className="flex flex-col items-start gap-1 border-b border-[var(--border)] py-3 text-[14.5px] last:border-b-0 sm:flex-row sm:justify-between sm:gap-5">
    <span className="flex-shrink-0 text-[var(--tx3)]">{label}</span>
    <span className="min-w-0 break-words text-left text-[var(--tx)] sm:text-right">{value || '-'}</span>
  </div>
);

/** My Profile page: identity hero and the employee's HR record grouped into four info cards. */
const Profile = () => {
  const { data: profile, isLoading, isError, error, refetch } = useQuery({ queryKey: ['profile'], queryFn: getProfile });

  if (isLoading) return <Layout><LoadingState label="Loading your profile..." /></Layout>;
  if (isError) return <Layout><ErrorState message={error.message} onRetry={refetch} /></Layout>;

  const initials = (profile.name || '?').split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2);

  const sections = [
    { title: 'Personal Information', fields: [
      { k: 'Legal Name', v: profile.legalName },
      { k: 'Date of Birth', v: formatDate(profile.birthday) },
      { k: 'Gender', v: profile.gender },
      { k: 'Marital Status', v: profile.maritalStatus },
    ] },
    { title: 'Contact', fields: [
      { k: 'Work Email', v: profile.workEmail },
      { k: 'Mobile', v: profile.mobilePhone },
      { k: 'Emergency Contact', v: profile.emergencyContact ? `${profile.emergencyContact} · ${profile.emergencyPhone || ''}` : null },
      { k: 'Address', v: profile.address },
    ] },
    { title: 'Employment', fields: [
      { k: 'Employee Code', v: profile.employeeCode },
      { k: 'Employee Type', v: profile.employeeType },
      { k: 'Department', v: profile.department },
      { k: 'Manager', v: profile.manager },
    ] },
    { title: 'Documents & IDs', fields: [
      { k: 'Identification No.', v: profile.identificationNo },
      { k: 'Passport No.', v: profile.passportNo },
      { k: 'Visa No.', v: profile.visaNo },
      { k: 'Visa Expiry', v: formatDate(profile.visaExpirationDate) },
    ] },
  ];

  return (
    <Layout>
      <div className="flex flex-col gap-[22px]">
        <section
          className="relative overflow-hidden rounded-[14px] p-5 text-[#EDF1F9] sm:p-7 lg:p-9"
          style={{ backgroundImage: 'linear-gradient(135deg,#152A57 0%,#2E4E8C 50%,#4A6BA8 100%)' }}
        >
          <div
            className="pointer-events-none absolute inset-0 opacity-50"
            style={{
              backgroundImage:
                'linear-gradient(rgba(255,255,255,.045) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.045) 1px,transparent 1px)',
              backgroundSize: '52px 52px',
            }}
          />
          <div
            className="bz-breathe pointer-events-none absolute -right-[70px] -top-[60px] h-[280px] w-[280px] rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(217,28,53,.34), transparent 68%)' }}
          />
          <div className="relative flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:gap-6">
            {profile.imageUrl ? (
              <img src={profile.imageUrl} alt={profile.name} className="h-[88px] w-[88px] flex-shrink-0 rounded-2xl border-2 border-white/35 object-cover" />
            ) : (
              <div className="grid h-[88px] w-[88px] flex-shrink-0 place-items-center rounded-2xl bg-[var(--pri)] text-[28px] font-extrabold tabular-nums text-white">
                {initials}
              </div>
            )}
            <div className="min-w-0">
              <div className="break-words text-[27px] font-semibold tracking-[-0.02em]">{profile.name}</div>
              <div className="mt-1 break-words text-[15px] text-[#A9B7D6]">{[profile.jobTitle, profile.department].filter(Boolean).join(' · ')}</div>
              <div className="mt-3.5 flex flex-wrap gap-2.5">
                {profile.employeeCode && <span className="rounded-[7px] bg-white/10 px-3.5 py-1.5 text-[12.5px] font-semibold tabular-nums">{profile.employeeCode}</span>}
                {profile.company && <span className="rounded-[7px] bg-white/10 px-3.5 py-1.5 text-[13px]">{profile.company}</span>}
              </div>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-5">
          {sections.map((s) => (
            <section key={s.title} className="bz-fade min-w-0 rounded-[14px] border border-[var(--border)] bg-[var(--surface)] p-[22px]">
              <div className="mb-1.5 flex items-center gap-2.5">
                <span className="block h-4 w-1 bg-[var(--pri)]" />
                <h2 className="m-0 text-[16.5px] font-semibold text-[var(--tx)]">{s.title}</h2>
              </div>
              {s.fields.map((f) => <InfoRow key={f.k} label={f.k} value={f.v} />)}
            </section>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
