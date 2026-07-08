import React from "react";
import SectionHeader from "../../components/customer/ui/SectionHeader";

const TransportDashboardPage = () => {
  return (
    <div className="space-y-8">
      <SectionHeader title="Transport booking" subtitle="Book taxis, transfers, and ride-hailing services with live tracking." />
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
          <h3 className="text-lg font-semibold text-white">Airport transfer</h3>
          <p className="mt-3 text-sm text-slate-400">Reserve your vehicle and connect to flights seamlessly.</p>
        </div>
        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
          <h3 className="text-lg font-semibold text-white">Ride-hailing</h3>
          <p className="mt-3 text-sm text-slate-400">Book local drivers with route previews and transparent fares.</p>
        </div>
        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
          <h3 className="text-lg font-semibold text-white">Live tracking</h3>
          <p className="mt-3 text-sm text-slate-400">Track your vehicle from pickup to drop-off in real time.</p>
        </div>
      </div>
    </div>
  );
};

export default TransportDashboardPage;
