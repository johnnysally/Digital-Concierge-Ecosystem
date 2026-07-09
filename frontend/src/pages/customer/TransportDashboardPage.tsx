import React, { useEffect, useState } from "react";
import SectionHeader from "../../components/customer/ui/SectionHeader";
import SkeletonLoader from "../../components/customer/ui/SkeletonLoader";

const TransportDashboardPage = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 600);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div className="space-y-8">
      <SectionHeader title="Transport booking" subtitle="Book taxis, transfers, and ride-hailing services with live tracking." />
      {loading ? (
        <div className="grid gap-6 lg:grid-cols-3">
          <SkeletonLoader className="h-40 w-full" />
          <SkeletonLoader className="h-40 w-full" />
          <SkeletonLoader className="h-40 w-full" />
        </div>
      ) : (
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
      )}
    </div>
  );
};

export default TransportDashboardPage;
