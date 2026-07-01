import React from 'react';

export default function AiPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold">AI Assistant</h1>
      <p className="text-sm text-slate-600 mt-1">Recommendations to optimize pricing and occupancy.</p>

      <div className="mt-6 space-y-4">
        <div className="p-4 bg-white rounded shadow">Price recommendation: Increase by 8% for next weekend.</div>
        <div className="p-4 bg-white rounded shadow">Occupancy forecast: 82% next month.</div>
      </div>
    </div>
  );
}
