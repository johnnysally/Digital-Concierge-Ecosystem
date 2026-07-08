import React from "react";
import SectionHeader from "../../components/customer/ui/SectionHeader";

const FoodDeliveryPage = () => {
  return (
    <div className="space-y-8">
      <SectionHeader title="Restaurant marketplace" subtitle="Browse menus, place orders, and track deliveries in one flow." />
      <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 text-slate-400">
        <p className="text-white">Restaurant listings and menu items will be loaded from the backend when available.</p>
      </div>
    </div>
  );
};

export default FoodDeliveryPage;
