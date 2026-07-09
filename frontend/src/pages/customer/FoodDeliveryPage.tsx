import React, { useEffect, useState } from "react";
import SectionHeader from "../../components/customer/ui/SectionHeader";
import SkeletonLoader from "../../components/customer/ui/SkeletonLoader";

const FoodDeliveryPage = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 600);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div className="space-y-8">
      <SectionHeader title="Restaurant marketplace" subtitle="Browse menus, place orders, and track deliveries in one flow." />
      {loading ? (
        <div className="space-y-4">
          <SkeletonLoader className="h-40 w-full" />
          <div className="grid gap-4 md:grid-cols-2">
            <SkeletonLoader className="h-32 w-full" />
            <SkeletonLoader className="h-32 w-full" />
          </div>
        </div>
      ) : (
        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 text-slate-400">
          <p className="text-white">Restaurant listings and menu items will be loaded from the backend when available.</p>
        </div>
      )}
    </div>
  );
};

export default FoodDeliveryPage;
