const incidents = [
  { id: 'OV-1082', severity: 'Critical', status: 'Active', location: 'City Transit Hub', team: 'Tactical Response', timestamp: '3m ago' },
  { id: 'OV-1091', severity: 'High', status: 'Investigating', location: 'East Logistics Park', team: 'Operations Desk', timestamp: '12m ago' },
  { id: 'OV-1100', severity: 'Medium', status: 'Mitigated', location: 'Northport Warehouse', team: 'Recovery', timestamp: '29m ago' },
];

function IncidentsPage() {
  return (
    <section className="space-y-8">
      <div className="rounded-[32px] bg-white p-8 shadow-sm ring-1 ring-slate-200/80">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Incidents</p>
            <h2 className="text-3xl font-semibold text-slate-900">Incident triage</h2>
            <p className="max-w-2xl text-slate-500">Review active cases, assign response teams, and track operational recovery status.</p>
          </div>
          <button className="rounded-3xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-400 shadow-sm">
            New incident
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-sm ring-1 ring-slate-200/80">
        <div className="grid grid-cols-6 gap-4 border-b border-slate-200 px-6 py-4 text-sm uppercase tracking-[0.2em] text-slate-500">
          <div className="col-span-1">ID</div>
          <div className="col-span-1">Severity</div>
          <div className="col-span-1">Status</div>
          <div className="col-span-1">Location</div>
          <div className="col-span-1">Team</div>
          <div className="col-span-1">Updated</div>
        </div>
        {incidents.map((incident) => (
          <div key={incident.id} className="grid grid-cols-6 gap-4 border-b border-slate-200 px-6 py-4 text-sm text-slate-700 last:border-b-0 hover:bg-slate-50">
            <div>{incident.id}</div>
            <div>{incident.severity}</div>
            <div>{incident.status}</div>
            <div>{incident.location}</div>
            <div>{incident.team}</div>
            <div>{incident.timestamp}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default IncidentsPage;
