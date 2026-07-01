import React from 'react';

export default function AnalyticsPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold">Analytics</h1>
      <p className="text-sm text-slate-600 mt-1">Occupancy, revenue, and trend insights.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <div className="p-4 bg-white rounded shadow"> 
          <div className="text-sm text-slate-500">Occupancy</div>
          <div className="text-2xl font-bold mt-2">78%</div>
        </div>
        <div className="p-4 bg-white rounded shadow"> 
          <div className="text-sm text-slate-500">Monthly Revenue</div>
          <div className="text-2xl font-bold mt-2">$12,450</div>
        </div>
        <div className="p-4 bg-white rounded shadow"> 
          <div className="text-sm text-slate-500">Avg. Daily Rate</div>
          <div className="text-2xl font-bold mt-2">$145</div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-white rounded shadow">
        <div className="text-sm text-slate-500">Bookings trend (last 30 days)</div>
        <div className="h-40 bg-slate-100 rounded mt-3 flex items-center justify-center text-slate-400">Chart placeholder</div>
      </div>
    </div>
  );
}
