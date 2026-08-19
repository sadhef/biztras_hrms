import StatusBadge from './StatusBadge.jsx';
import Icon from '../Icon.jsx';

/** Centered placeholder used while a page's primary query is loading. */
export const LoadingState = ({ label = 'Loading...' }) => (
  <div className="grid place-items-center rounded-[20px] border border-[var(--border)] bg-[var(--surface)] px-4 py-12 text-center text-sm text-[var(--tx3)] sm:py-16">
    {label}
  </div>
);

/** Centered placeholder shown when a page's primary query fails, with a retry action. */
export const ErrorState = ({ message = 'Something went wrong.', onRetry }) => (
  <div className="flex flex-col items-center gap-3 rounded-[20px] border border-[var(--border)] bg-[var(--surface)] px-4 py-12 text-center sm:py-16">
    <p className="m-0 text-sm text-[#A6392F]">{message}</p>
    {onRetry && (
      <button
        type="button"
        onClick={onRetry}
        className="cursor-pointer rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-sm text-[var(--tx)] hover:bg-[var(--surface-2)]"
      >
        Try again
      </button>
    )}
  </div>
);

/** Centered placeholder shown when a query succeeds but returns no rows. */
export const EmptyState = ({ label }) => (
  <div className="grid place-items-center rounded-[20px] border border-[var(--border)] bg-[var(--surface)] px-4 py-12 text-center text-sm text-[var(--tx3)] sm:py-16">
    {label}
  </div>
);

/** Page title, subtitle, and an optional primary action button — shared header for every HR content page. */
export const PageHeader = ({ title, subtitle, actionLabel, onAction }) => (
  <div className="flex flex-wrap items-start justify-between gap-4 sm:items-end sm:gap-5">
    <div className="min-w-0">
      <h1 className="m-0 break-words text-[26px] font-medium tracking-[-0.01em] text-[var(--tx)] sm:text-[30px]">{title}</h1>
      {subtitle && <p className="m-0 mt-1.5 text-[15px] text-[var(--tx2)]">{subtitle}</p>}
    </div>
    {actionLabel && (
      <button
        type="button"
        onClick={onAction}
        className="min-h-11 w-full cursor-pointer rounded-xl border-0 bg-[var(--pri)] px-[22px] py-3 text-[15px] text-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_24px_rgba(217,28,53,0.28)] sm:w-auto"
      >
        {actionLabel}
      </button>
    )}
  </div>
);

/** Pill tab bar used for the All / status / period filters at the top of each list page. */
export const TabBar = ({ tabs, active, onChange }) => (
  <div className="no-scrollbar -mx-1 flex max-w-full gap-2 overflow-x-auto px-1 pb-1">
    {tabs.map((tab) => (
      <button
        key={tab}
        type="button"
        onClick={() => onChange(tab)}
        className={[
          'min-h-11 flex-none cursor-pointer whitespace-nowrap rounded-full border px-5 py-2 text-[14.5px] font-medium transition-colors duration-200',
          tab === active
            ? 'border-[var(--ink)] bg-[var(--ink)] text-white'
            : 'border-[var(--border)] bg-[var(--surface)] text-[var(--tx2)] hover:border-[var(--border-2)]',
        ].join(' ')}
      >
        {tab}
      </button>
    ))}
  </div>
);

/** KPI tile grid, matching the Dashboard stat card treatment — auto-fills so an arbitrary (backend-driven) tile count never leaves a lopsided last row. */
export const MetricGrid = ({ metrics }) => (
  <div className="grid grid-cols-1 gap-4 sm:grid-cols-[repeat(auto-fill,minmax(220px,1fr))] sm:gap-5">
    {metrics.map((m, i) => (
      <div
        key={m.label}
        className="bz-fade rounded-[14px] border border-[var(--border)] bg-[var(--surface)] p-5 transition-[transform,box-shadow] duration-200 hover:-translate-y-1 hover:shadow-[0_12px_26px_rgba(27,27,43,0.09)]"
        style={{ animationDelay: `${i * 0.05}s` }}
      >
        <div className="text-[12.5px] font-semibold uppercase tracking-[0.08em] text-[var(--tx2)]">{m.label}</div>
        <div className="mt-2 text-[28px] font-bold tabular-nums tracking-[-0.02em] text-[var(--ink)]">{m.value}</div>
        <div className="mt-1 text-[12.5px] text-[var(--tx3)]">{m.note}</div>
      </div>
    ))}
  </div>
);

/** Bordered, column-driven data table with per-row status badge support (badge column index). */
export const DataTable = ({ columns, rows, statusColumn }) => (
  <section className="bz-fade -mx-4 max-w-[calc(100%+2rem)] overflow-hidden border-y border-[var(--border)] bg-[var(--surface)] sm:mx-0 sm:max-w-full sm:rounded-[14px] sm:border">
    <div className="table-scroll max-w-full overscroll-x-contain overflow-x-auto">
      <div
        className="grid min-w-[680px] gap-[18px] border-b border-[#ECEDF0] bg-[#F7F7FA] px-5 py-[15px] text-[11.5px] font-semibold uppercase tracking-[0.09em] text-[var(--tx2)] sm:min-w-[720px] sm:px-6"
        style={{ gridTemplateColumns: `1.6fr repeat(${columns.length - 1}, 1fr)` }}
      >
        {columns.map((c) => <div key={c} className="min-w-0 truncate">{c}</div>)}
      </div>
      {rows.map((row, ri) => (
        <div
          key={ri}
          className="bz-slide-in grid min-w-[680px] items-center gap-[18px] border-b border-[#ECEDF0] px-5 py-[15px] text-[14.5px] text-[#3A3550] transition-colors duration-150 last:border-b-0 hover:bg-[#F7F7FA] sm:min-w-[720px] sm:px-6"
          style={{ gridTemplateColumns: `1.6fr repeat(${columns.length - 1}, 1fr)`, animationDelay: `${ri * 0.035}s` }}
        >
          {row.map((cell, ci) =>
            ci === statusColumn ? (
              <div key={ci} className="min-w-0 justify-self-start"><StatusBadge>{cell}</StatusBadge></div>
            ) : (
              <div key={ci} className={`min-w-0 truncate ${ci === 0 ? 'font-semibold text-[var(--tx)]' : /^(AED|\d)/.test(String(cell)) ? 'tabular-nums text-[13.5px]' : ''}`}>{cell}</div>
            )
          )}
        </div>
      ))}
    </div>
  </section>
);

/** Grid of content cards (documents, announcements, directory entries, help articles). */
export const CardGrid = ({ cards, columns = 3 }) => (
  <div className={`grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 ${columns === 3 ? 'xl:grid-cols-3' : ''}`}>
    {cards.map((c, i) => (
      <div
        key={c.title}
        className="bz-fade flex min-w-0 cursor-pointer flex-col gap-2.5 rounded-[14px] border border-[var(--border)] bg-[var(--surface)] p-5 transition-[transform,box-shadow,border-color] duration-200 ease-[cubic-bezier(.2,.8,.3,1)] hover:-translate-y-1 hover:border-[var(--border-2)] hover:shadow-[0_14px_30px_rgba(27,27,43,0.11)]"
        style={{ animationDelay: `${i * 0.04}s` }}
      >
        <div className="flex items-center gap-3.5">
          <div
            className={`grid h-11 w-11 flex-shrink-0 place-items-center rounded-[11px] text-[14px] font-semibold ${
              typeof c.avatar === 'string' ? 'bg-[var(--ink)] text-white' : 'bg-[var(--ink-bg)]'
            }`}
          >
            {typeof c.avatar === 'string' ? c.avatar : <Icon name={c.avatar.icon} size={21} color="var(--ink)" />}
          </div>
          <div className="min-w-0">
            <div className="break-words text-[16px] font-medium text-[var(--tx)]">{c.title}</div>
            <div className="mt-0.5 truncate text-[13.5px] text-[var(--tx3)]">{c.subtitle}</div>
          </div>
        </div>
        <div className="break-words text-[13.8px] leading-[1.55] text-[var(--tx2)]">{c.body}</div>
        <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-2.5">
          <span className="text-[12.5px] text-[var(--tx3)]">{c.meta}</span>
          <StatusBadge>{c.badge}</StatusBadge>
        </div>
      </div>
    ))}
  </div>
);
