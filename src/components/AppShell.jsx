import { Link, NavLink } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import StatusBanner from './StatusBanner';

export default function AppShell({ title, subtitle, children, actions }) {
  const { user, logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState('');

  async function handleLogout() {
    setIsLoggingOut(true);
    setLogoutError('');

    try {
      await logout();
    } catch (error) {
      setLogoutError(error.message);
    } finally {
      setIsLoggingOut(false);
    }
  }

  return (
    <div className="min-h-screen px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <header className="glass-card overflow-hidden">
          <div className="flex flex-col gap-6 px-6 py-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-3 text-sm">
                <Link
                  to="/dashboard"
                  className="inline-flex items-center rounded-full bg-accent-50 px-3 py-1 font-semibold text-accent-700"
                >
                  AI Study Companion
                </Link>
                <NavLink
                  to="/dashboard"
                  className={({ isActive }) =>
                    `rounded-full px-3 py-1 transition ${
                      isActive ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'
                    }`
                  }
                >
                  Dashboard
                </NavLink>
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                  {title}
                </h1>
                {subtitle ? <p className="mt-2 max-w-2xl text-slate-600">{subtitle}</p> : null}
              </div>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="rounded-3xl bg-slate-900 px-4 py-3 text-white">
                <p className="text-xs uppercase tracking-[0.25em] text-slate-300">Signed in as</p>
                <p className="mt-1 font-medium">{user?.displayName || user?.email}</p>
              </div>
              <div className="flex flex-wrap gap-3">
                {actions}
                <button
                  type="button"
                  onClick={handleLogout}
                  className="btn-secondary"
                  disabled={isLoggingOut}
                >
                  {isLoggingOut ? 'Signing out...' : 'Logout'}
                </button>
              </div>
            </div>
          </div>
        </header>

        <main>{children}</main>
      </div>

      <div className="mx-auto mt-4 max-w-7xl px-4 sm:px-6 lg:px-8">
        <StatusBanner kind="error" message={logoutError} onDismiss={() => setLogoutError('')} />
      </div>
    </div>
  );
}
