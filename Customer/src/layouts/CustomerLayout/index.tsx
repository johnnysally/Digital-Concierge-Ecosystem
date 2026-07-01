import { Link, Outlet, useLocation } from 'react-router-dom';

const navItems = [
  { path: '/', label: 'Dashboard', icon: '🏠' },
  { path: '/accommodation', label: 'Accommodation', icon: '🏨' },
  { path: '/transport', label: 'Transport', icon: '🚗' },
  { path: '/food', label: 'Food', icon: '🍽️' },
  { path: '/wallet', label: 'Wallet', icon: '💳' },
  { path: '/payments', label: 'Payments', icon: '💰' },
  { path: '/maps', label: 'Maps', icon: '🗺️' },
  { path: '/chat', label: 'AI Concierge', icon: '🤖' },
  { path: '/notifications', label: 'Notifications', icon: '🔔' },
  { path: '/reviews', label: 'Reviews', icon: '⭐' },
  { path: '/support', label: 'Support', icon: '🛟' },
  { path: '/promotions', label: 'Promotions', icon: '🎁' },
  { path: '/traveler-profiles', label: 'Traveler Profiles', icon: '🧳' },
  { path: '/settings', label: 'Settings', icon: '⚙️' },
  { path: '/profile', label: 'Profile', icon: '👤' },
];

export default function CustomerLayout() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[300px_minmax(0,1fr)]">
        <aside className="border-r border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-10 flex items-center gap-3 rounded-3xl bg-slate-50 p-4 shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white">
              D
            </div>
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Customer Portal</p>
              <h1 className="text-xl font-semibold text-slate-900">Digital Concierge</h1>
            </div>
          </div>

          <nav className="space-y-2">
            {navItems.map((item) => {
              const active = location.pathname === item.path;
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 rounded-3xl px-4 py-3 text-sm font-medium transition ${
                    active ? 'bg-slate-900 text-white shadow-xl' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <span className="text-base">{item.icon}</span>
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="mt-12 rounded-3xl bg-slate-50 p-5 shadow-sm">
            <h2 className="text-xs uppercase tracking-[0.3em] text-slate-400">Pro Tip</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Use the AI Concierge to quickly personalize recommendations across hotels, rides, and dining in one place.
            </p>
          </div>
        </aside>

        <main className="bg-slate-100 p-6">
          <div className="mb-6 flex flex-col gap-4 rounded-3xl bg-white p-5 shadow-sm md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm text-slate-500">Welcome back, Victoria.</p>
              <h2 className="text-2xl font-semibold tracking-tight text-slate-900">{location.pathname === '/' ? 'Your travel command center' : 'Customer Portal'}</h2>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <span className="rounded-2xl bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-700">Premium Member</span>
              <span className="rounded-2xl bg-slate-100 px-4 py-2 text-sm text-slate-600">Live trip score: 94</span>
            </div>
          </div>

          <Outlet />
        </main>
      </div>
    </div>
  );
}
