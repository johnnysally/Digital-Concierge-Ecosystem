import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Reservation } from '../types';

const mockReservations: Reservation[] = [
  {
    id: 'res1',
    propertyId: 'prop1',
    roomId: 'room1',
    guestId: 'guest1',
    checkIn: '2026-07-05',
    checkOut: '2026-07-10',
    status: 'confirmed',
    totalAmount: 1500,
    currency: 'USD',
  },
];

export default function ReservationsListPage() {
  const { data: reservations } = useQuery({
    queryKey: ['reservations'],
    queryFn: async () => mockReservations,
  });

  return (
    <div className="space-y-6">
      <header>
        <p className="text-sm uppercase text-slate-500">Reservation Management</p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-900">All Reservations</h1>
      </header>

      <div className="overflow-x-auto rounded-2xl bg-white shadow-sm">
        <table className="w-full">
          <thead className="border-b border-slate-200 bg-slate-50">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Guest</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Check-In</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Check-Out</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Status</th>
              <th className="px-6 py-4 text-right text-sm font-semibold text-slate-900">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {reservations?.map((res) => (
              <tr key={res.id} className="hover:bg-slate-50">
                <td className="px-6 py-4 text-sm">{res.guestId}</td>
                <td className="px-6 py-4 text-sm">{res.checkIn}</td>
                <td className="px-6 py-4 text-sm">{res.checkOut}</td>
                <td className="px-6 py-4">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                    res.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                    res.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {res.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right font-semibold">${res.totalAmount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
