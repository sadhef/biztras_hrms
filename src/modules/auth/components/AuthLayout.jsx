import BrandChevronTrail from '../../../shared/components/BrandChevronTrail.jsx';

/**
 * Shared authentication shell: a navy brand panel (logo, headline, tagline) beside the form,
 * both on the app canvas, matching the Biztras HR reference login design.
 * @param {{ children: React.ReactNode }} props - The form panel's content.
 */
const AuthLayout = ({ children }) => (
  <div className="flex min-h-full w-full flex-col gap-[22px] overflow-y-auto bg-[var(--bg)] p-4 sm:p-6 lg:flex-row">
    <section
      className="bz-fade relative hidden flex-[1.05] flex-col justify-between overflow-hidden rounded-[24px] p-8 text-[#EDF1F9] lg:flex xl:p-12"
      style={{ backgroundImage: 'linear-gradient(135deg,#16264D 0%,#21366D 45%,#34518F 80%,#4A6BA8 100%)' }}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-50"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,.045) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.045) 1px,transparent 1px)',
          backgroundSize: '58px 58px',
        }}
      />
      {/* Slipstream: the logo chevron as a receding trail, accelerating into the oversized red
          mark that bleeds off the bottom right. The panel's signature, and the reason its lower
          half does not read as empty. */}
      <BrandChevronTrail variant="panel" className="bz-drift pointer-events-none absolute inset-0 h-full w-full" />
      <div
        className="bz-breathe pointer-events-none absolute -left-[90px] -bottom-[110px] h-[340px] w-[340px] rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(217,28,53,.30), transparent 68%)' }}
      />

      <div className="relative">
        <img src="/brand/biztras-logo-white.svg" alt="Biztras" className="block w-[186px]" />
      </div>

      <div className="relative max-w-[470px]">
        <div className="mb-[22px] h-1 w-[52px] bg-[var(--pri)]" />
        <h2 className="m-0 text-[46px] font-normal leading-[1.14] tracking-[-0.02em] text-[#A9B7D6]" style={{ textWrap: 'balance' }}>
          Your workday,<br />
          <span className="font-bold text-[#EDF1F9]">engineered</span> <span className="font-bold text-[var(--pri)]">simple.</span>
        </h2>
        <p className="mt-[18px] max-w-[400px] text-[16.5px] leading-[1.7] text-[#A9B7D6]" style={{ textWrap: 'pretty' }}>Attendance, leave, payroll and requests, all in one console for the whole team.</p>
      </div>

      <div className="relative text-[13px] text-[#7A8CB4]">&copy; {new Date().getFullYear()} Biztras</div>
    </section>

    <section className="flex min-h-[calc(100dvh-2rem)] flex-1 items-center justify-center p-0 sm:min-h-[calc(100dvh-3rem)] sm:p-5 lg:min-h-0">
      <div className="bz-fade w-full max-w-[404px]" style={{ animationDelay: '0.1s' }}>
        {children}
      </div>
    </section>
  </div>
);

export default AuthLayout;
