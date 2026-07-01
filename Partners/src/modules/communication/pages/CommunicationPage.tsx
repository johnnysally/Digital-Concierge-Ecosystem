import React from 'react';

export default function CommunicationPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold">Communication</h1>
      <p className="text-sm text-slate-600 mt-1">Chat with guests and manage message templates.</p>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="col-span-1 bg-white rounded shadow p-4">Conversations list (placeholder)</div>
        <div className="col-span-2 bg-white rounded shadow p-4">Selected conversation (placeholder)</div>
      </div>
    </div>
  );
}
