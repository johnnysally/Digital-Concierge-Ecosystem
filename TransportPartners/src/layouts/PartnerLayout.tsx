import { NavLink, Outlet } from 'react-router-dom';
import { useEffect, useState } from 'react';

const navItems = [
  { label: 'Dashboard', to: '/', icon: 'M12 6v6h6' },
  { label: 'Deliveries', to: '/deliveries', icon: 'M3 3h18v18H3V3z' },
  { label: 'Earnings', to: '/earnings', icon: 'M6 12h12M12 6v12' },
  { label: 'Analytics', to: '/analytics', icon: 'M4 16l4-4 4 4 4-8 4 8' },
  { label: 'Ratings', to: '/ratings', icon: 'M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z' },
  { label: 'Profile', to: '/profile', icon: 'M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-3.33 0-10 1.67-10 5v3h20v-3c0-3.33-6.67-5-10-5z' },
  { label: 'Settings', to: '/settings', icon: 'M12 8v4l3 3' },
];

const accentMap = {
  sky: {
    button: 'bg-sky-500 hover:bg-sky-400',
    shadow: 'shadow-sky-500/20',
  },
  emerald: {
    button: 'bg-emerald-500 hover:bg-emerald-400',
    shadow: 'shadow-emerald-500/20',
  },
  violet: {
    button: 'bg-violet-500 hover:bg-violet-400',
    shadow: 'shadow-violet-500/20',
  },
};

function SidebarButton({ to, label, icon, compact }: { to: string; label: string; icon: string; compact: boolean }) {
  return (
    <NavLink
      to={to}
      end={to === '/'}
      className={({ isActive }) =>
        `group flex items-center gap-3 rounded-3xl px-4 ${compact ? 'py-2' : 'py-3'} text-sm font-semibold transition ${
          isActive ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
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

export default function PartnerLayout() {
  const [pageSettings, setPageSettings] = useState({ accentColor: 'sky', compactMode: false, sidebarDensity: 'spacious' });

  useEffect(() => {
    const saved = localStorage.getItem('transportPageSettings');
    if (saved) {
      setPageSettings((prev) => ({ ...prev, ...JSON.parse(saved) }));
    }
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('compact-mode', pageSettings.compactMode);
  }, [pageSettings.compactMode]);

  useEffect(() => {
    const handleSettingsUpdate = (event: Event) => {
      const customEvent = event as CustomEvent<{ accentColor: string; compactMode: boolean; sidebarDensity: string }>;
      if (customEvent.detail) {
        setPageSettings((prev) => ({ ...prev, ...customEvent.detail }));
      }
    };

    window.addEventListener('transportSettingsUpdate', handleSettingsUpdate as EventListener);
    return () => window.removeEventListener('transportSettingsUpdate', handleSettingsUpdate as EventListener);
  }, []);

  const accent = accentMap[pageSettings.accentColor] ?? accentMap.sky;
  const compact = pageSettings.sidebarDensity === 'compact';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="flex min-h-screen">
        <aside className="sticky top-0 z-20 flex h-screen w-72 flex-col border-r border-slate-200 bg-white px-5 py-6 shadow-sm">
          <div className="mb-8 flex items-center gap-4 px-1">
            <div className="grid h-14 w-14 place-items-center rounded-3xl bg-slate-900 text-white shadow-lg shadow-slate-200/20">
              <span className="text-2xl font-black tracking-tight">T</span>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Transport</p>
              <h1 className="text-xl font-semibold text-slate-900">Concierge</h1>
            </div>
          </div>

          <nav className="flex flex-1 flex-col gap-2">
            {navItems.map((item) => (
              <SidebarButton key={item.to} to={item.to} label={item.label} icon={item.icon} compact={compact} />
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
                <p className="text-sm font-semibold text-slate-900">Avery Rider</p>
                <p className="text-xs text-emerald-600">Online · 3 active deliveries</p>
              </div>
            </div>
          </div>
        </aside>

        <main className="flex-1 overflow-y-auto px-8 py-8">
          <div className="mb-6 rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <p className="text-sm text-slate-500">Good afternoon, Avery</p>
                <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">Your transport command center</h2>
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
                    placeholder="Search deliveries, analytics, or riders"
                    className="w-full rounded-3xl border border-slate-200 bg-slate-50 py-3 pl-12 pr-4 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/10"
                  />
                </div>
                <button className={`inline-flex items-center justify-center rounded-3xl ${accent.button} px-5 py-3 text-sm font-semibold text-white shadow-lg ${accent.shadow} transition`}>
                  New delivery
                </button>
              </div>
            </div>
          </div>

          <div className="min-h-[calc(100vh-180px)]">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
