import React from "react";
import SectionHeader from "../../components/customer/ui/SectionHeader";

const SupportCenterPage = () => {
  return (
    <div className="space-y-8">
      <SectionHeader title="Help Center" subtitle="Get support, access emergency contacts, and report issues instantly." />
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
          <h3 className="text-lg font-semibold text-white">FAQs</h3>
          <p className="mt-3 text-sm text-slate-400">Find answers to common travel questions across DigitalSafaris.</p>
        </div>
        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
          <h3 className="text-lg font-semibold text-white">Live support</h3>
          <p className="mt-3 text-sm text-slate-400">Connect with customer service for bookings, orders, and emergency assistance.</p>
        </div>
        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
          <h3 className="text-lg font-semibold text-white">Emergency</h3>
          <p className="mt-3 text-sm text-slate-400">Access safety resources and nearby emergency services when you need them.</p>
        </div>
      </div>
    </div>
  );
};

export default SupportCenterPage;
