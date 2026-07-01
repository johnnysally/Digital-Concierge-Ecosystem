import React from 'react';

const sample = [
  { id: '1', title: 'New reservation', body: 'Booking #1023 requires confirmation.' },
  { id: '2', title: 'Payout processed', body: 'Your payout for June has been processed.' },
];

export default function NotificationsPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold">Notifications</h1>
      <p className="text-sm text-slate-600 mt-1">System and guest notifications.</p>

      <div className="mt-6 space-y-3">
        {sample.map((n) => (
          <div key={n.id} className="p-3 bg-white rounded shadow flex justify-between">
            <div>
              <div className="font-medium">{n.title}</div>
              <div className="text-sm text-slate-500">{n.body}</div>
            </div>
            <div className="flex items-center gap-2">
              <button className="px-2 py-1 bg-gray-100 rounded">Mark read</button>
              <button className="px-2 py-1 bg-red-100 text-red-600 rounded">Dismiss</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
