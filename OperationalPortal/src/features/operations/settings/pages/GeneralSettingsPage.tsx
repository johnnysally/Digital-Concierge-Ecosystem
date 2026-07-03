function GeneralSettingsPage() {
  return (
    <section className="space-y-6">
      <div className="rounded-[32px] bg-slate-50 p-8 shadow-sm ring-1 ring-slate-200/80">
        <p className="text-sm uppercase tracking-[0.24em] text-slate-500">General configuration</p>
        <h1 className="mt-4 text-3xl font-semibold text-slate-900">Global system settings</h1>
        <p className="mt-2 text-slate-500">Set the platform defaults that apply across the operational portal and all regions.</p>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="rounded-[28px] border border-slate-200 bg-white p-6">
            <h2 className="text-lg font-semibold text-slate-900">Platform defaults</h2>
            <p className="mt-2 text-sm text-slate-600">Timezone, currency, language, date format, and default business hours.</p>
            <ul className="mt-4 space-y-3 text-sm text-slate-700">
              <li>Default timezone: UTC</li>
              <li>Currency code: USD</li>
              <li>Business hours: Mon–Sun, 06:00–22:00</li>
              <li>Maintenance mode toggle and site-wide rollout control.</li>
            </ul>
          </div>

          <div className="rounded-[28px] border border-slate-200 bg-white p-6">
            <h2 className="text-lg font-semibold text-slate-900">Organization details</h2>
            <p className="mt-2 text-sm text-slate-600">Company name, support contact, legal details, and portal branding rules.</p>
            <ul className="mt-4 space-y-3 text-sm text-slate-700">
              <li>Organization name and description</li>
              <li>Contact email and support phone</li>
              <li>Brand accent colors and logo guidelines</li>
              <li>Compliance settings and regional legal notices</li>
            </ul>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-[28px] border border-slate-200 bg-white p-6">
            <h3 className="text-base font-semibold text-slate-900">Access defaults</h3>
            <p className="mt-2 text-sm text-slate-600">Default permissions for new users and automated session policies.</p>
          </div>
          <div className="rounded-[28px] border border-slate-200 bg-white p-6">
            <h3 className="text-base font-semibold text-slate-900">Audit & logging</h3>
            <p className="mt-2 text-sm text-slate-600">Retention windows, event logging levels, and policy audit thresholds.</p>
          </div>
          <div className="rounded-[28px] border border-slate-200 bg-white p-6">
            <h3 className="text-base font-semibold text-slate-900">Service level targets</h3>
            <p className="mt-2 text-sm text-slate-600">Default SLA values and warning thresholds for operations and delivery workflows.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default GeneralSettingsPage;
