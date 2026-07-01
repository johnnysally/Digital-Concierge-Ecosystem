import React from 'react';

const sample = [
  { id: '1', guest: 'Alice Johnson', rating: 5, text: 'Amazing stay!' },
  { id: '2', guest: 'Bob Lee', rating: 4, text: 'Great location.' },
  { id: '3', guest: '3', rating: 3, text: 'Room was okay.' },
];

export default function ReviewsPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold">Reviews</h1>
      <p className="text-sm text-slate-600 mt-1">Guest feedback and response management.</p>

      <div className="mt-6 space-y-4">
        {sample.map((r) => (
          <div key={r.id} className="p-4 bg-white rounded shadow">
            <div className="flex justify-between">
              <div className="font-medium">{r.guest}</div>
              <div className="text-sm text-slate-500">{r.rating} ⭐</div>
            </div>
            <div className="text-slate-700 mt-2">{r.text}</div>
            <div className="mt-3 text-sm">
              <button className="px-3 py-1 bg-blue-600 text-white rounded mr-2">Reply</button>
              <button className="px-3 py-1 bg-gray-100 rounded">Hide</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
