import React from 'react';
import { useParams, Link } from 'react-router-dom';

export default function RoomDetailsPage() {
  const { id } = useParams();

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <p className="text-sm uppercase text-slate-500">Room details</p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-900">Room {id}</h1>
        </div>
        <Link to="../" className="rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800">
          Back to rooms
        </Link>
      </header>

      <div className="grid gap-6 md:grid-cols-2">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Room overview</h2>
          <dl className="mt-6 grid gap-4 text-sm text-slate-600">
            <div>
              <dt className="font-semibold text-slate-900">Type</dt>
              <dd>Deluxe Suite</dd>
            </div>
            <div>
              <dt className="font-semibold text-slate-900">Capacity</dt>
              <dd>2 adults, 1 child</dd>
            </div>
            <div>
              <dt className="font-semibold text-slate-900">Price per night</dt>
              <dd>$165</dd>
            </div>
            <div>
              <dt className="font-semibold text-slate-900">Status</dt>
              <dd className="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-700">Available</dd>
            </div>
          </dl>
        </section>
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Amenities</h2>
          <ul className="mt-4 space-y-2 text-sm text-slate-600">
            <li>King bed</li>
            <li>Free Wi-Fi</li>
            <li>Air conditioning</li>
            <li>Balcony view</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
