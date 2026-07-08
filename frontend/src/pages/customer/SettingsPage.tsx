import React from "react";
import SectionHeader from "../../components/customer/ui/SectionHeader";

const SettingsPage = () => {
  return (
    <div className="space-y-8">
      <SectionHeader title="Settings" subtitle="Configure your DigitalSafaris account, preferences and security options." />
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
          <h3 className="text-lg font-semibold text-white">Account settings</h3>
          <p className="mt-3 text-sm text-slate-400">Manage language, currency, notifications and security.</p>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
