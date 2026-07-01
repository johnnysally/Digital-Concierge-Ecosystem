import { NavLink, Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';

const navItems = [
  { name: 'Dashboard', to: '/partners/accommodation' },
  { name: 'Properties', to: '/partners/accommodation/properties' },
  { name: 'Rooms', to: '/partners/accommodation/rooms' },
  { name: 'Reservations', to: '/partners/accommodation/reservations' },
  { name: 'Guests', to: '/partners/accommodation/guests' },
  { name: 'Housekeeping', to: '/partners/accommodation/housekeeping' },
  { name: 'Payments', to: '/partners/accommodation/payments' },
  { name: 'Promotions', to: '/partners/accommodation/promotions' },
  { name: 'Analytics', to: '/partners/accommodation/analytics' },
  { name: 'Notifications', to: '/partners/accommodation/notifications' },
  { name: 'Communication', to: '/partners/accommodation/communication' },
  { name: 'Documents', to: '/partners/accommodation/documents' },
  { name: 'Profile', to: '/partners/accommodation/profile' },
  { name: 'Settings', to: '/partners/accommodation/settings' },
  { name: 'AI Assistant', to: '/partners/accommodation/ai' },
];

export default function AccommodationLayout() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="border-r border-slate-200 bg-white">
          <div className="flex h-full flex-col justify-between p-6">
            <div>
              <motion.div
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
                className="mb-8"
              >
                <div className="mb-4 flex items-center gap-3 rounded-3xl bg-slate-900 px-4 py-3 text-white shadow-lg shadow-slate-900/5">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-slate-900 font-semibold">
                    U
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-slate-300">Unified Concierge</p>
                    <h1 className="text-lg font-semibold">Accommodation Portal</h1>
                  </div>
                </div>
                <p className="text-sm leading-6 text-slate-500">
                  Enterprise-grade accommodation operations, property publishing, and guest management in one unified portal.
                </p>
              </motion.div>

              <nav className="space-y-1">
                {navItems.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) =>
                      `group flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-medium transition ${
                        isActive ? 'bg-slate-900 text-white shadow-sm shadow-slate-900/10' : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                      }`
                    }
                  >
                    {item.name}
                  </NavLink>
                ))}
              </nav>
            </div>

            <div className="rounded-3xl bg-slate-900 p-5 text-white shadow-xl shadow-slate-900/10">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Partner status</p>
              <div className="mt-4 flex items-center justify-between gap-3">
                <div>
                  <p className="text-2xl font-semibold">Live</p>
                  <p className="text-sm text-slate-300">All listings active</p>
                </div>
                <div className="h-12 w-12 rounded-2xl bg-emerald-500/20 text-emerald-200 grid place-items-center">
                  ✓
                </div>
              </div>
            </div>
          </div>
        </aside>

        <main className="p-6 lg:p-8">
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Accommodation Partner Portal</p>
              <h2 className="text-3xl font-semibold text-slate-900">Operational Dashboard</h2>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <button className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50">
                Refresh data
              </button>
              <button className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-slate-900/10">
                Create new property
              </button>
            </div>
          </div>

          <Outlet />
        </main>
      </div>
    </div>
  );
}
