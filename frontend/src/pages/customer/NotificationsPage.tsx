import React from "react";
import SectionHeader from "../../components/customer/ui/SectionHeader";

const NotificationsPage = () => {
  return (
    <div className="space-y-8">
      <SectionHeader title="Notifications" subtitle="Stay updated on bookings, orders, rides, and promotions." />
      <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 text-slate-400">
        <p className="text-white">Notification history will appear here after the backend provides your alerts.</p>
      </div>
    </div>
  );
};

export default NotificationsPage;
