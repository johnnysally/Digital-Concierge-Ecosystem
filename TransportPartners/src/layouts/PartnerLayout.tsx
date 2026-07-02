import { Outlet } from 'react-router-dom';

export default function PartnerLayout() {
  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 border-r border-slate-200 bg-white">
        <div className="border-b border-slate-200 p-6">
          <h1 className="text-2xl font-bold text-slate-900">Transport Portal</h1>
        </div>
        <nav className="space-y-1 p-4">
          <a href="/" className="block rounded-2xl px-4 py-3 text-slate-700 transition hover:bg-slate-50">
            Dashboard
          </a>
          <a href="/deliveries" className="block rounded-2xl px-4 py-3 text-slate-700 transition hover:bg-slate-50">
            Deliveries
          </a>
          <a href="/earnings" className="block rounded-2xl px-4 py-3 text-slate-700 transition hover:bg-slate-50">
            Earnings
          </a>
          <a href="/profile" className="block rounded-2xl px-4 py-3 text-slate-700 transition hover:bg-slate-50">
            Profile
          </a>
          <a href="/ratings" className="block rounded-2xl px-4 py-3 text-slate-700 transition hover:bg-slate-50">
            Ratings
          </a>
          <a href="/analytics" className="block rounded-2xl px-4 py-3 text-slate-700 transition hover:bg-slate-50">
            Analytics
          </a>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
