function IntegrationSettingsPage() {
  return (
    <section className="space-y-6">
      <div className="rounded-[32px] bg-slate-50 p-8 shadow-sm ring-1 ring-slate-200/80">
        <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Integration hub</p>
        <h1 className="mt-4 text-3xl font-semibold text-slate-900">Integration Settings</h1>
        <p className="mt-2 text-slate-500">Configure the systems and services connected to the operations portal.</p>

        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          <div className="rounded-[28px] border border-slate-200 bg-white p-6">
            <h2 className="text-lg font-semibold text-slate-900">Payments</h2>
            <p className="mt-2 text-sm text-slate-600">Connect payment gateways, payout services, and reconciliation tools.</p>
          </div>
          <div className="rounded-[28px] border border-slate-200 bg-white p-6">
            <h2 className="text-lg font-semibold text-slate-900">CRM & partners</h2>
            <p className="mt-2 text-sm text-slate-600">Manage partner APIs, supplier feeds, and customer relationship systems.</p>
          </div>
          <div className="rounded-[28px] border border-slate-200 bg-white p-6">
            <h2 className="text-lg font-semibold text-slate-900">Analytics & reporting</h2>
            <p className="mt-2 text-sm text-slate-600">Enable dashboards, export endpoints, and data warehouse integrations.</p>
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <div className="rounded-[28px] border border-slate-200 bg-white p-6">
            <h3 className="text-base font-semibold text-slate-900">Webhooks & APIs</h3>
            <p className="mt-2 text-sm text-slate-600">Configure callback endpoints, API keys, and developer access.</p>
          </div>
          <div className="rounded-[28px] border border-slate-200 bg-white p-6">
            <h3 className="text-base font-semibold text-slate-900">Third-party services</h3>
            <p className="mt-2 text-sm text-slate-600">Manage integrations for messaging, identity, and geolocation services.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default IntegrationSettingsPage;
