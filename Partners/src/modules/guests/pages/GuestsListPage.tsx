import React from 'react';
import { useQuery } from '@tanstack/react-query';
import * as guestsService from '../services/guestsService';

export default function GuestsListPage() {
  const { data: guests, isLoading } = useQuery({
    queryKey: ['guests'],
    queryFn: guestsService.fetchGuests,
  });

  if (isLoading) return <div>Loading guests...</div>;

  return (
    <div className="space-y-6">
      <header>
        <p className="text-sm uppercase text-slate-500">Guest Profiles</p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-900">Guest Management</h1>
      </header>

      <div className="grid gap-4">
        {guests?.map((guest) => (
          <div key={guest.id} className="rounded-2xl border border-slate-200 bg-white p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">{guest.firstName} {guest.lastName}</h3>
                <p className="mt-1 text-sm text-slate-600">{guest.email}</p>
                <p className="text-sm text-slate-600">{guest.phone}</p>
              </div>
              <div className="text-right">
                {guest.vip && <span className="inline-block px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-medium">VIP</span>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
