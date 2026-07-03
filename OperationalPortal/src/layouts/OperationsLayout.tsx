import { NavLink, Outlet } from 'react-router-dom';

const navItems = [
  { label: 'Dashboard', to: '/operations/dashboard', icon: 'M12 6v6h6' },
  { label: 'Live Operations', to: '/operations/liveOperations', icon: 'M3 3h18v18H3V3z' },
  { label: 'Dispatch Center', to: '/operations/dispatchCenter', icon: 'M6 12h12M12 6v12' },
  { label: 'Accommodation Monitoring', to: '/operations/accommodationMonitoring', icon: 'M4 16l4-4 4 4 4-8 4 8' },
  { label: 'Restaurant Monitoring', to: '/operations/restaurantMonitoring', icon: 'M5 12h14M12 5v14' },
  { label: 'Rider Monitoring', to: '/operations/riderMonitoring', icon: 'M3 7h18M6 12h12M9 17h6' },
  { label: 'Customer Monitoring', to: '/operations/customerMonitoring', icon: 'M6 4h12M6 12h12M6 20h12' },
  { label: 'Maps & Tracking', to: '/operations/mapsTracking', icon: 'M12 2l7 20H5L12 2z' },
  { label: 'Incident Management', to: '/operations/incidentManagement', icon: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z' },
  { label: 'Customer Escalations', to: '/operations/customerEscalations', icon: 'M5 12l5 5L20 7' },
  { label: 'Partner Support', to: '/operations/partnerSupport', icon: 'M4 4h16v16H4V4z' },
  { label: 'SLA Monitoring', to: '/operations/slaMonitoring', icon: 'M12 12l8-4-8-4-8 4 8 4z' },
  { label: 'Performance Monitoring', to: '/operations/performanceMonitoring', icon: 'M4 16l6-6 4 4 6-6' },
  { label: 'Operations Analytics', to: '/operations/operationsAnalytics', icon: 'M12 4v16M4 12h16' },
  { label: 'AI Operations Center', to: '/operations/aiOperationsCenter', icon: 'M12 4a8 8 0 0 1 8 8' },
  { label: 'Communication Center', to: '/operations/communicationCenter', icon: 'M5 5l14 14M19 5L5 19' },
  { label: 'Notifications', to: '/operations/notifications', icon: 'M12 3v2M12 19v2M4.22 4.22l1.42 1.42M17.36 17.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M17.36 6.64l1.42-1.42' },
  { label: 'Reports', to: '/operations/reports', icon: 'M7 8h10M7 12h10M7 16h10' },
  { label: 'Audit & Compliance', to: '/operations/auditCompliance', icon: 'M12 2l9 16H3L12 2z' },
  { label: 'Platform Health', to: '/operations/platformHealth', icon: 'M4 7h16M4 12h10M4 17h6' },
  { label: 'User Management', to: '/operations/userManagement', icon: 'M9 6h6M9 12h6M9 18h6' },
  { label: 'Profile', to: '/operations/profile', icon: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm0 2c-4 0-6 2-6 4v2h12v-2c0-2-2-4-6-4z' },
  { label: 'Settings', to: '/operations/settings', icon: 'M12 3v2M12 19v2M4.22 4.22l1.42 1.42M17.36 17.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M17.36 6.64l1.42-1.42' },
];

function SidebarButton({ to, label, icon }: { to: string; label: string; icon: string }) {
  return (
    <NavLink
      to={to}
      end={to === '/dashboard'}
      className={({ isActive }) =>
        `group flex items-center gap-3 rounded-3xl px-4 py-3 text-sm font-semibold transition ${
          isActive
            ? 'bg-slate-200 text-slate-900 shadow-sm'
            : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
        }`
      }
    >
      <span className="grid h-10 w-10 place-items-center rounded-2xl bg-slate-100 text-slate-900 transition group-hover:bg-slate-200">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
          <path d={icon} />
        </svg>
      </span>
      <span>{label}</span>
    </NavLink>
  );
}

function OperationsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="flex min-h-screen">
        <aside className="sticky top-0 z-20 flex h-screen w-72 flex-col border-r border-slate-200 bg-white px-5 py-6 shadow-sm overflow-y-auto">
          <div className="mb-8 flex items-center gap-4 px-1">
            <div className="grid h-14 w-14 place-items-center rounded-3xl bg-slate-900 text-white shadow-lg shadow-slate-200/20">
              <span className="text-2xl font-black tracking-tight">O</span>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Operations</p>
              <h1 className="text-xl font-semibold text-slate-900">Concierge</h1>
            </div>
          </div>

          <nav className="flex flex-1 flex-col gap-2">
            {navItems.map((item) => (
              <SidebarButton key={item.to} to={item.to} label={item.label} icon={item.icon} />
            ))}
          </nav>

          <div className="mt-8 rounded-[28px] border border-slate-200 bg-slate-50 p-5 text-slate-600 shadow-sm">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Live status</p>
            <div className="mt-4 flex items-center gap-3">
              <div className="h-12 w-12 rounded-3xl bg-slate-200 p-3">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="h-full w-full text-slate-700">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-3.33 0-10 1.67-10 5v3h20v-3c0-3.33-6.67-5-10-5z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">Operations Team</p>
                <p className="text-xs text-emerald-600">Live platform monitoring</p>
              </div>
            </div>
          </div>
        </aside>

        <main className="flex-1 overflow-y-auto px-8 py-8">
          <div className="mb-6 rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <p className="text-sm text-slate-500">Good afternoon, Operations</p>
                <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">Unified Operations Command</h2>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="relative w-full sm:w-80">
                  <span className="pointer-events-none absolute inset-y-0 left-4 grid place-items-center text-slate-400">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
                      <path d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15z" />
                    </svg>
                  </span>
                  <input
                    type="search"
                    placeholder="Search incidents, bookings, or alerts"
                    className="w-full rounded-3xl border border-slate-200 bg-slate-50 py-3 pl-12 pr-4 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/10"
                  />
                </div>
                <button className="inline-flex items-center justify-center rounded-3xl bg-sky-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-500/20 transition hover:bg-sky-400">
                  New incident
                </button>
              </div>
            </div>
          </div>

          <div className="min-h-[calc(100vh-240px)] rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

export default OperationsLayout;
