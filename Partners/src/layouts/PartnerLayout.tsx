import React from 'react';
import { Link, Outlet } from 'react-router-dom';

export default function PartnerLayout() {
  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[260px_minmax(0,1fr)]">
        <aside className="border-r border-slate-200 bg-white p-6">
          <div className="mb-6 flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center">P</div>
            <div>
              <p className="text-sm text-slate-500">Accommodation Partner</p>
              <h2 className="text-lg font-semibold">Partner Portal</h2>
            </div>
          </div>

          <nav className="flex flex-col gap-2">
            <Link to="/partners/accommodation" className="text-sm">Dashboard</Link>
            <Link to="/partners/accommodation/properties" className="text-sm">Properties</Link>
            <Link to="/partners/accommodation/rooms" className="text-sm">Rooms</Link>
            <Link to="/partners/accommodation/reservations" className="text-sm">Reservations</Link>
            <Link to="/partners/accommodation/guests" className="text-sm">Guests</Link>
            <Link to="/partners/accommodation/housekeeping" className="text-sm">Housekeeping</Link>
            <Link to="/partners/accommodation/payments" className="text-sm">Payments</Link>
          </nav>
        </aside>

        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
