import React from 'react';

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <header>
        <p className="text-sm uppercase text-slate-500">Portal settings</p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-900">System & preferences</h1>
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Business settings</h2>
          <p className="mt-2 text-sm text-slate-600">Configure your business profile, notification rules, and app integrations.</p>
          <div className="mt-6 space-y-4 text-sm text-slate-600">
            <div className="rounded-2xl bg-slate-50 p-4">Brand settings, logos, and public profile management.</div>
            <div className="rounded-2xl bg-slate-50 p-4">Notification preferences for bookings, payments, and system alerts.</div>
            <div className="rounded-2xl bg-slate-50 p-4">API integrations, payment providers, and channel manager connections.</div>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Security</h2>
          <p className="mt-2 text-sm text-slate-600">Manage access, authentication, and portal security settings.</p>
          <div className="mt-6 space-y-4 text-sm text-slate-600">
            <div className="rounded-2xl bg-slate-50 p-4">Password management and two-factor authentication.</div>
            <div className="rounded-2xl bg-slate-50 p-4">Team permissions and role-based access control.</div>
            <div className="rounded-2xl bg-slate-50 p-4">Compliance controls and data privacy configuration.</div>
          </div>
        </section>
      </div>
    </div>
  );
}
