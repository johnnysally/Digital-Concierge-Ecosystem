const responseTeams = [
  { name: 'Tactical Response', status: 'Ready', eta: '2 min', location: 'City Center' },
  { name: 'Infrastructure Support', status: 'Standby', eta: '6 min', location: 'North Terminal' },
  { name: 'Recovery Unit', status: 'Ready', eta: '4 min', location: 'East Logistics' },
];

function ResponsePage() {
  return (
    <section className="space-y-8">
      <div className="rounded-[32px] bg-white p-8 shadow-sm ring-1 ring-slate-200/80">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Response</p>
            <h2 className="text-3xl font-semibold text-slate-900">Response coordination</h2>
            <p className="max-w-2xl text-slate-500">Coordinate field teams, dispatch resources, and monitor readiness metrics.</p>
          </div>
          <button className="rounded-3xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 shadow-sm">
            Dispatch update
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-sm ring-1 ring-slate-200/80">
        <div className="grid grid-cols-4 gap-4 border-b border-slate-200 bg-slate-50 px-6 py-4 text-sm uppercase tracking-[0.2em] text-slate-500">
          <div>Team</div>
          <div>Status</div>
          <div>ETA</div>
          <div>Location</div>
        </div>
        {responseTeams.map((team) => (
          <div key={team.name} className="grid grid-cols-4 gap-4 border-b border-slate-200 px-6 py-4 text-sm text-slate-700 last:border-b-0 hover:bg-slate-50">
            <div>{team.name}</div>
            <div>{team.status}</div>
            <div>{team.eta}</div>
            <div>{team.location}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default ResponsePage;
