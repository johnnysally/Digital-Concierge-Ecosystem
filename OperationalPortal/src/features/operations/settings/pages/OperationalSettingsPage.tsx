function OperationalSettingsPage() {
  return (
    <section className="space-y-6">
      <div className="rounded-[32px] bg-slate-50 p-8 shadow-sm ring-1 ring-slate-200/80">
        <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Operations control</p>
        <h1 className="mt-4 text-3xl font-semibold text-slate-900">Operational Settings</h1>
        <p className="mt-2 text-slate-500">Define the workflow rules that govern capacity, service goals, and operational escalation.</p>

        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          <div className="rounded-[28px] border border-slate-200 bg-white p-6">
            <h2 className="text-lg font-semibold text-slate-900">Capacity thresholds</h2>
            <p className="mt-2 text-sm text-slate-600">Set limits for orders, riders, and active dispatches to avoid overload.</p>
          </div>
          <div className="rounded-[28px] border border-slate-200 bg-white p-6">
            <h2 className="text-lg font-semibold text-slate-900">SLA targets</h2>
            <p className="mt-2 text-sm text-slate-600">Control delivery and response time targets for the operations team.</p>
          </div>
          <div className="rounded-[28px] border border-slate-200 bg-white p-6">
            <h2 className="text-lg font-semibold text-slate-900">Alerting & escalation</h2>
            <p className="mt-2 text-sm text-slate-600">Manage issue escalation rules, supervisory alerts, and operational triggers.</p>
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <div className="rounded-[28px] border border-slate-200 bg-white p-6">
            <h3 className="text-base font-semibold text-slate-900">Service controls</h3>
            <p className="mt-2 text-sm text-slate-600">Define auto-pausing, priority windows, and emergency stop conditions.</p>
          </div>
          <div className="rounded-[28px] border border-slate-200 bg-white p-6">
            <h3 className="text-base font-semibold text-slate-900">Operational workflows</h3>
            <p className="mt-2 text-sm text-slate-600">Configure the operational review cycle, approval stages, and task handoff rules.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default OperationalSettingsPage;
