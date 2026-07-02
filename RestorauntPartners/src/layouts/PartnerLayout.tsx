import { useMemo } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';

const navItems = [
  { name: 'Dashboard', to: '/restaurant/dashboard' },
  { name: 'Orders', to: '/restaurant/orders' },
  { name: 'Menu', to: '/restaurant/menu' },
  { name: 'Promotions', to: '/restaurant/promotions' },
  { name: 'Analytics', to: '/restaurant/analytics' },
  { name: 'Delivery', to: '/restaurant/delivery' },
  { name: 'Payments', to: '/restaurant/payments' },
  { name: 'Notifications', to: '/restaurant/notifications' },
  { name: 'AI Assistant', to: '/restaurant/ai' },
  { name: 'Reviews', to: '/restaurant/reviews' },
  { name: 'Profile', to: '/restaurant/profile' },
  { name: 'Settings', to: '/restaurant/settings' },
];

export default function PartnerLayout() {
  const location = useLocation();

  const currentPage = useMemo(() => {
    const active = navItems.find((item) => location.pathname.startsWith(item.to));
    return active?.name ?? 'Restaurant Portal';
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[260px_minmax(0,1fr)]">
        <aside className="border-r border-slate-200 bg-white p-6">
          <div className="mb-6 flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center">R</div>
            <div>
              <p className="text-sm text-slate-500">Restaurant Partner</p>
              <h2 className="text-lg font-semibold">Partner Portal</h2>
            </div>
          </div>

          <nav className="flex flex-col gap-2">
            {navItems.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`rounded-2xl px-4 py-3 text-sm font-medium transition ${
                  location.pathname.startsWith(link.to)
                    ? 'bg-slate-900 text-white shadow'
                    : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </aside>

        <main className="p-6">
          <div className="mb-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-slate-500">Current page</p>
                <h1 className="text-2xl font-semibold text-slate-900">{currentPage}</h1>
              </div>
              <div className="rounded-3xl bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700">
                Light mode active
              </div>
            </div>
          </div>

          <Outlet />
        </main>
      </div>
    </div>
  );
}
