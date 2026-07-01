import React from 'react';
import { useParams, Link } from 'react-router-dom';

export default function GuestDetailsPage() {
  const { id } = useParams();

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <p className="text-sm uppercase text-slate-500">Guest profile</p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-900">Guest {id}</h1>
        </div>
        <Link to=".." className="rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800">
          Back to guests
        </Link>
      </header>
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-900">Profile details</h2>
        <div className="mt-4 grid gap-4 text-sm text-slate-600 sm:grid-cols-2">
          <div>
            <p className="font-semibold text-slate-900">Email</p>
            <p>guest@example.com</p>
          </div>
          <div>
            <p className="font-semibold text-slate-900">Phone</p>
            <p>+1 234 567 890</p>
          </div>
          <div>
            <p className="font-semibold text-slate-900">VIP status</p>
            <p>Gold</p>
          </div>
          <div>
            <p className="font-semibold text-slate-900">Preferences</p>
            <p>Late check-in, near elevator</p>
          </div>
        </div>
      </section>
    </div>
  );
}
