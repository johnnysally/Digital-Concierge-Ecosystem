function RegionalSettingsPage() {
  return (
    <section className="space-y-6">
      <div className="rounded-[32px] bg-slate-50 p-8 shadow-sm ring-1 ring-slate-200/80">
        <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Regional operations</p>
        <h1 className="mt-4 text-3xl font-semibold text-slate-900">Regional Settings</h1>
        <p className="mt-2 text-slate-500">Manage market-specific settings, service zones, and localized defaults for each region.</p>

        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          <div className="rounded-[28px] border border-slate-200 bg-white p-6">
            <h2 className="text-lg font-semibold text-slate-900">Region definitions</h2>
            <p className="mt-2 text-sm text-slate-600">Add or adjust service regions, business areas, and regional identifiers.</p>
          </div>
          <div className="rounded-[28px] border border-slate-200 bg-white p-6">
            <h2 className="text-lg font-semibold text-slate-900">Locale settings</h2>
            <p className="mt-2 text-sm text-slate-600">Configure date, time, currency and language defaults per region.</p>
          </div>
          <div className="rounded-[28px] border border-slate-200 bg-white p-6">
            <h2 className="text-lg font-semibold text-slate-900">Local service controls</h2>
            <p className="mt-2 text-sm text-slate-600">Enable or disable local delivery types, operating windows, and market availability.</p>
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <div className="rounded-[28px] border border-slate-200 bg-white p-6">
            <h3 className="text-base font-semibold text-slate-900">Region-specific dispatch rules</h3>
            <p className="mt-2 text-sm text-slate-600">Override dispatch behavior for high-demand or restricted areas.</p>
          </div>
          <div className="rounded-[28px] border border-slate-200 bg-white p-6">
            <h3 className="text-base font-semibold text-slate-900">Local compliance</h3>
            <p className="mt-2 text-sm text-slate-600">Manage tax, licensing, and local regulatory requirements per market.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default RegionalSettingsPage;
