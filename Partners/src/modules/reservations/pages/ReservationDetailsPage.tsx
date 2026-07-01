import React from 'react';
import { useParams, Link } from 'react-router-dom';

export default function ReservationDetailsPage() {
  const { id } = useParams();

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <p className="text-sm uppercase text-slate-500">Reservation detail</p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-900">Reservation {id}</h1>
        </div>
        <Link to=".." className="rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800">
          Back to reservations
        </Link>
      </header>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Guest</p>
            <p className="mt-2 text-lg font-semibold text-slate-900">Alex Rivera</p>
            <p className="mt-1 text-sm text-slate-600">alex.rivera@example.com</p>
          </div>
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Room</p>
            <p className="mt-2 text-lg font-semibold text-slate-900">Suite 402</p>
            <p className="mt-1 text-sm text-slate-600">2 adults · 1 child</p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-3xl bg-slate-50 p-4">
            <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Check-in</p>
            <p className="mt-2 text-lg font-semibold text-slate-900">2026-07-05</p>
          </div>
          <div className="rounded-3xl bg-slate-50 p-4">
            <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Check-out</p>
            <p className="mt-2 text-lg font-semibold text-slate-900">2026-07-10</p>
          </div>
          <div className="rounded-3xl bg-slate-50 p-4">
            <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Status</p>
            <p className="mt-2 text-lg font-semibold text-emerald-700">Confirmed</p>
          </div>
        </div>
      </section>
    </div>
  );
}
