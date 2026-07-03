function MapSettingsPage() {
  return (
    <section className="space-y-6">
      <div className="rounded-[32px] bg-slate-50 p-8 shadow-sm ring-1 ring-slate-200/80">
        <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Map configuration</p>
        <h1 className="mt-4 text-3xl font-semibold text-slate-900">Map Settings</h1>
        <p className="mt-2 text-slate-500">Manage mapping providers, traffic layers, and geofencing for live operations.</p>

        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          <div className="rounded-[28px] border border-slate-200 bg-white p-6">
            <h2 className="text-lg font-semibold text-slate-900">Provider selection</h2>
            <p className="mt-2 text-sm text-slate-600">Choose between your active map services and vendor integrations.</p>
          </div>
          <div className="rounded-[28px] border border-slate-200 bg-white p-6">
            <h2 className="text-lg font-semibold text-slate-900">Traffic & routing</h2>
            <p className="mt-2 text-sm text-slate-600">Enable live traffic, predictive routing, and service area overlays.</p>
          </div>
          <div className="rounded-[28px] border border-slate-200 bg-white p-6">
            <h2 className="text-lg font-semibold text-slate-900">Geofencing</h2>
            <p className="mt-2 text-sm text-slate-600">Configure zone boundaries, entry rules, and restricted area behavior.</p>
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <div className="rounded-[28px] border border-slate-200 bg-white p-6">
            <h3 className="text-base font-semibold text-slate-900">Default map view</h3>
            <p className="mt-2 text-sm text-slate-600">Set initial zoom, center coordinates, and default map style.</p>
          </div>
          <div className="rounded-[28px] border border-slate-200 bg-white p-6">
            <h3 className="text-base font-semibold text-slate-900">Data layers</h3>
            <p className="mt-2 text-sm text-slate-600">Control the visibility of riders, fleets, orders, and incident markers.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default MapSettingsPage;
