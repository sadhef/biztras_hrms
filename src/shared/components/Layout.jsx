import { useState } from 'react';
import Sidebar from './Sidebar.jsx';
import Header from './Header.jsx';
import { useAuth } from '../context/AuthContext.jsx';

/**
 * Standard page shell: responsive sidebar rail, top header, scrollable content, and footer.
 * @param {React.ReactNode} children - Page content rendered in the main area.
 */
const Layout = ({ children }) => {
  const { logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-full overflow-hidden bg-[var(--bg)]">
      {mobileOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          className="fixed inset-0 z-[199] cursor-default border-0 bg-black/30 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} onLogout={logout} />

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <Header onMobileMenuToggle={() => setMobileOpen((m) => !m)} />

        <main className="bz-fade relative z-[1] min-h-0 flex-1 overflow-auto px-4 pb-5 pt-2 sm:px-6 sm:pb-6 lg:px-8 xl:px-10 xl:pt-3.5">
          {children}
        </main>

        <footer className="relative z-[1] flex flex-shrink-0 flex-col items-start justify-between gap-1.5 border-t border-[var(--border)] bg-[var(--bg)] px-4 py-2.5 text-[12px] text-[var(--tx3)] sm:flex-row sm:items-center sm:gap-x-8 sm:gap-y-2 sm:px-6 sm:text-[13px] lg:px-8 xl:px-10">
          <div className="flex flex-wrap items-center gap-x-8 gap-y-1">
            <span>&copy; {new Date().getFullYear()} Biztras. All rights reserved.</span>
            <span className="flex items-center gap-3">
              <a href="#privacy" className="text-[var(--tx2)] hover:text-[var(--pri)]">Privacy Policy</a>
              <span className="text-[var(--border-2)]">|</span>
              <a href="#terms" className="text-[var(--tx2)] hover:text-[var(--pri)]">Terms of Use</a>
              <span className="text-[var(--border-2)]">|</span>
              <a href="#status" className="text-[var(--tx2)] hover:text-[var(--pri)]">System Status</a>
            </span>
          </div>
          <img src="/brand/biztras-logo.svg" alt="Biztras" className="hidden h-5 opacity-55 lg:block" />
        </footer>
      </div>
    </div>
  );
};

export default Layout;
