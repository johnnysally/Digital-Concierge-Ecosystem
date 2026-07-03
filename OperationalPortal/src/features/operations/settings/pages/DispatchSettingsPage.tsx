function DispatchSettingsPage() {
  return (
    <section className="space-y-6">
      <div className="rounded-[32px] bg-slate-50 p-8 shadow-sm ring-1 ring-slate-200/80">
        <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Dispatch control</p>
        <h1 className="mt-4 text-3xl font-semibold text-slate-900">Dispatch Settings</h1>
        <p className="mt-2 text-slate-500">Configure dispatch behavior, assignment logic, and operator controls for the delivery network.</p>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="rounded-[28px] border border-slate-200 bg-white p-6">
            <h2 className="text-lg font-semibold text-slate-900">Assignment strategy</h2>
            <p className="mt-2 text-sm text-slate-600">Choose between auto-dispatch, manual dispatch, or hybrid workflows.</p>
            <ul className="mt-4 space-y-2 text-sm text-slate-700">
              <li>Auto-assign based on nearest driver</li>
              <li>Priority-based dispatch sequencing</li>
              <li>Manual override enablement</li>
            </ul>
          </div>
          <div className="rounded-[28px] border border-slate-200 bg-white p-6">
            <h2 className="text-lg font-semibold text-slate-900">Route optimization</h2>
            <p className="mt-2 text-sm text-slate-600">Set route cost weights, service windows, and shift batching rules.</p>
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <div className="rounded-[28px] border border-slate-200 bg-white p-6">
            <h3 className="text-base font-semibold text-slate-900">Dispatch queuing</h3>
            <p className="mt-2 text-sm text-slate-600">Control queue priorities, max waiting times, and batch dispatch sizes.</p>
          </div>
          <div className="rounded-[28px] border border-slate-200 bg-white p-6">
            <h3 className="text-base font-semibold text-slate-900">Driver engagement</h3>
            <p className="mt-2 text-sm text-slate-600">Define driver selection rules and capacity thresholds during peak periods.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default DispatchSettingsPage;
