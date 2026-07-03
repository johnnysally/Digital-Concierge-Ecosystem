const alertItems = [
  { id: 'AL-329', type: 'Infrastructure', source: 'Network Sensor', severity: 'High', time: '5 min ago' },
  { id: 'AL-332', type: 'Security', source: 'Access Control', severity: 'Medium', time: '14 min ago' },
  { id: 'AL-341', type: 'Compliance', source: 'Audit Pipeline', severity: 'Low', time: '26 min ago' },
];

function AlertsPage() {
  return (
    <section className="space-y-8">
      <div className="rounded-[32px] bg-white p-8 shadow-sm ring-1 ring-slate-200/80">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Alerts</p>
            <h2 className="text-3xl font-semibold text-slate-900">Alert monitoring</h2>
            <p className="max-w-2xl text-slate-500">Inspect the current alert stream and escalate high-priority events.</p>
          </div>
          <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-600 shadow-sm">
            Stream active
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {alertItems.map((alert) => (
          <div key={alert.id} className="rounded-[32px] bg-white p-8 shadow-sm ring-1 ring-slate-200/80">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm uppercase tracking-[0.24em] text-slate-500">{alert.type}</p>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs uppercase tracking-[0.24em] text-slate-600">
                {alert.severity}
              </span>
            </div>
            <p className="mt-4 text-xl font-semibold text-slate-900">{alert.source}</p>
            <p className="mt-2 text-sm leading-6 text-slate-500">Received {alert.time}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default AlertsPage;
