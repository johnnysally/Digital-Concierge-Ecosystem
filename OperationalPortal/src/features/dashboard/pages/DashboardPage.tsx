const metrics = [
  { label: 'Active Incidents', value: '12', delta: '+8%' },
  { label: 'Pending Alerts', value: '24', delta: '-4%' },
  { label: 'Response Readiness', value: '93%', delta: '+2%' },
  { label: 'Resource Utilization', value: '77%', delta: '+5%' },
];

const statusCards = [
  { title: 'Event Watch', value: 'All systems nominal', description: 'No critical anomalies detected in the last 30 minutes.' },
  { title: 'Operations Intelligence', value: '67 AI events flagged', description: 'Priority stream is healthy; review the latest alert queue.' },
  { title: 'Dispatch Readiness', value: '4 teams ready', description: 'Field crews are online and mission-ready.' },
];

function DashboardPage() {
  return (
    <section className="space-y-8">
      <div className="rounded-[32px] bg-white p-8 shadow-sm ring-1 ring-slate-200/80">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Dashboard</p>
            <h2 className="text-3xl font-semibold text-slate-900">Operations overview</h2>
            <p className="max-w-2xl text-slate-500">Monitor incidents, alert throughput, and response readiness from a single command center.</p>
          </div>
          <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-600 shadow-sm">
            Updated 2 minutes ago
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <div key={metric.label} className="rounded-[32px] bg-white p-8 shadow-sm ring-1 ring-slate-200/80">
            <p className="text-sm text-slate-500">{metric.label}</p>
            <p className="mt-3 text-3xl font-semibold text-slate-900">{metric.value}</p>
            <p className="mt-2 text-sm text-emerald-600">{metric.delta}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        {statusCards.map((card) => (
          <div key={card.title} className="rounded-[32px] bg-white p-8 shadow-sm ring-1 ring-slate-200/80">
            <p className="text-sm uppercase tracking-[0.24em] text-slate-500">{card.title}</p>
            <p className="mt-4 text-xl font-semibold text-slate-900">{card.value}</p>
            <p className="mt-2 text-sm leading-6 text-slate-500">{card.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default DashboardPage;
