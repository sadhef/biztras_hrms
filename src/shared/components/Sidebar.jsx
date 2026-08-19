import { NavLink } from 'react-router-dom';
import { XIcon } from '@phosphor-icons/react';
import Icon from './Icon.jsx';
import BrandChevronTrail from './BrandChevronTrail.jsx';

/** Flat top-level nav — the reference design has no grouped/accordion sections. */
const NAV_ITEMS = [
  { to: '/', label: 'Dashboard', icon: 'grid', end: true },
  { to: '/profile', label: 'My Profile', icon: 'user' },
  { to: '/attendance', label: 'Attendance', icon: 'clock' },
  { to: '/leave', label: 'Leave Requests', icon: 'calendar' },
  { to: '/payslips', label: 'Payroll', icon: 'receipt' },
  { to: '/documents', label: 'Documents', icon: 'file' },
  { to: '/announcements', label: 'Announcements', icon: 'megaphone' },
  { to: '/directory', label: 'Team Directory', icon: 'users' },
];

/**
 * Primary navigation rail: a fixed-width navy gradient rail matching the Biztras HR reference
 * design (logo, flat nav with an active left accent bar, sign out at the bottom), sliding in as
 * an overlay below the `lg` breakpoint. The signed-in user's identity lives in the header instead
 * of being repeated here.
 * @param {boolean} mobileOpen - Whether the mobile overlay is currently open.
 * @param {() => void} onClose - Closes the mobile overlay (called on nav-link click and the close button).
 * @param {() => void} onLogout - Signs the current user out.
 */
const Sidebar = ({ mobileOpen, onClose, onLogout }) => {
  return (
    <aside
      className={[
        'fixed inset-y-0 left-0 z-[200] flex w-[258px] max-w-[calc(100vw-24px)] flex-shrink-0 flex-col overflow-hidden',
        'px-3.5 pb-[18px] pt-[26px] text-[#EDF1F9]',
        'transition-transform duration-300 lg:relative lg:z-auto lg:translate-x-0',
        mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
      ].join(' ')}
      style={{ backgroundImage: 'linear-gradient(160deg, #16264D 0%, #21366D 62%, #2C4A85 100%)' }}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.04) 1px,transparent 1px)',
          backgroundSize: '52px 52px',
        }}
      />
      {/* Slipstream, vertical: gives the rail below the nav a deliberate brand presence instead
          of an empty navy void. */}
      <BrandChevronTrail variant="rail" className="bz-drift pointer-events-none absolute inset-0 h-full w-full" />
      <div
        className="bz-breathe pointer-events-none absolute -bottom-[70px] -left-[60px] h-[240px] w-[240px] rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(217,28,53,.26), transparent 70%)' }}
      />

      <button
        type="button"
        onClick={onClose}
        aria-label="Close menu"
        className="absolute right-3 top-3 z-10 flex h-11 w-11 cursor-pointer items-center justify-center rounded-full text-[#A9B7D6] hover:bg-white/10 lg:hidden"
      >
        <XIcon size={16} />
      </button>

      <div className="relative px-2.5 pb-[26px] pt-1.5">
        <img src="/brand/biztras-logo-white.svg" alt="Biztras" className="block w-[148px]" />
      </div>

      <nav className="relative flex min-h-0 flex-1 flex-col gap-0.5 overflow-y-auto pr-0.5">
        {NAV_ITEMS.map(({ to, label, icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={onClose}
            className={({ isActive }) =>
              [
                'relative flex w-full items-center gap-[13px] rounded-[9px] px-3.5 py-[11px] text-left transition-colors duration-200',
                isActive ? 'bg-white/[0.11] text-white' : 'text-[#A9B7D6] hover:bg-white/[0.07] hover:text-white',
              ].join(' ')
            }
          >
            {({ isActive }) => (
              <>
                <span
                  className={`absolute left-0 top-1/2 h-4 w-[3px] -translate-y-1/2 rounded-r-full bg-[var(--pri)] transition-opacity duration-200 ${isActive ? 'opacity-100' : 'opacity-0'}`}
                />
                <Icon name={icon} size={19} color={isActive ? '#fff' : '#A9B7D6'} accent={isActive ? 'var(--pri)' : '#7D8FBC'} className="flex-shrink-0" />
                <span className="text-[15px] font-medium leading-none">{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="relative mt-auto pt-4">
        <button
          type="button"
          onClick={onLogout}
          className="flex w-full cursor-pointer items-center gap-[13px] rounded-[10px] border-0 bg-transparent px-3.5 py-[11px] text-[15px] text-[#A9B7D6] transition-colors duration-200 hover:bg-[rgba(217,28,53,0.18)] hover:text-[#F5A3AE]"
        >
          <Icon name="logout" size={19} color="#A9B7D6" className="flex-shrink-0" />
          Sign Out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
