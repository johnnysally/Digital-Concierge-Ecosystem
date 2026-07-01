import React from 'react';

export default function DashboardPage() {
  return (
    <div className="min-h-[400px] space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <p className="text-sm uppercase text-slate-500">Partner Dashboard</p>
          <h1 className="text-2xl font-semibold">Accommodation Business Overview</h1>
        </div>
        <div className="flex items-center gap-3">
          <button className="rounded-full bg-slate-900 px-4 py-2 text-white">New Property</button>
        </div>
      </header>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl bg-white p-4 shadow-sm">
          <p className="text-sm text-slate-500">Total Properties</p>
          <p className="mt-2 text-2xl font-semibold">12</p>
        </div>
        <div className="rounded-2xl bg-white p-4 shadow-sm">
          <p className="text-sm text-slate-500">Available Rooms</p>
          <p className="mt-2 text-2xl font-semibold">48</p>
        </div>
        <div className="rounded-2xl bg-white p-4 shadow-sm">
          <p className="text-sm text-slate-500">Revenue Today</p>
          <p className="mt-2 text-2xl font-semibold">$1,820</p>
        </div>
      </section>

      <section className="rounded-2xl bg-white p-4 shadow-sm">
        <h2 className="text-lg font-semibold">Upcoming Check-ins</h2>
        <ul className="mt-4 space-y-3 text-sm text-slate-600">
          <li>Room 101 — John Doe — 14:00</li>
          <li>Room 202 — Maria Silva — 15:30</li>
          <li>Room 310 — Akira Tanaka — 16:00</li>
        </ul>
      </section>
    </div>
  );
}
