import MetricCard from '../components/MetricCard';
import InsightCard from '../components/InsightCard';

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <section className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <div className="rounded-[2.5rem] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Business overview</p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">Your accommodation pulse</h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
                Live occupancy, revenue performance, guest flow and operational alerts for your properties across the ecosystem.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <button className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
                Sync now
              </button>
              <button className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50">
                Business insights
              </button>
            </div>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <MetricCard label="Total properties" value="24" trend="+8% this week" icon={<span>🏨</span>} />
            <MetricCard label="Occupied rooms" value="184" trend="+6%" icon={<span>🛏️</span>} />
            <MetricCard label="Revenue today" value="$13.8k" trend="+14%" icon={<span>💰</span>} />
            <MetricCard label="Occupancy rate" value="86%" trend="Stable" icon={<span>📈</span>} />
          </div>
        </div>

        <div className="grid gap-6">
          <div className="rounded-[2.5rem] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Operational status</p>
                <h3 className="mt-2 text-2xl font-semibold text-slate-900">Today's highlights</h3>
              </div>
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-700">Healthy</span>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Check-ins</p>
                <p className="mt-2 text-3xl font-semibold text-slate-900">39</p>
              </div>
              <div className="rounded-3xl bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Check-outs</p>
                <p className="mt-2 text-3xl font-semibold text-slate-900">22</p>
              </div>
            </div>
          </div>

          <div className="rounded-[2.5rem] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-slate-500">AI business assistant</p>
                <h3 className="mt-2 text-2xl font-semibold text-slate-900">Recommendation engine</h3>
              </div>
              <span className="text-2xl">🤖</span>
            </div>
            <div className="mt-6 space-y-4">
              <InsightCard
                title="Dynamic pricing recommendation"
                description="Occupancy is trending up 12%. Increase weekend rates by 8% to maximize yield across top properties."
              />
              <InsightCard
                title="Demand forecast"
                description="Advanced bookings are 22% above baseline. Add promotional visibility for last-minute suites to capture higher ADR."
              />
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[2.5rem] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Property performance</p>
              <h3 className="mt-2 text-2xl font-semibold text-slate-900">Top room categories</h3>
            </div>
            <button className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white">View report</button>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-3xl bg-slate-50 p-5">
              <p className="text-sm uppercase tracking-[0.22em] text-slate-400">Suite bookings</p>
              <p className="mt-3 text-3xl font-semibold text-slate-900">92%</p>
            </div>
            <div className="rounded-3xl bg-slate-50 p-5">
              <p className="text-sm uppercase tracking-[0.22em] text-slate-400">Standard rooms</p>
              <p className="mt-3 text-3xl font-semibold text-slate-900">76%</p>
            </div>
            <div className="rounded-3xl bg-slate-50 p-5">
              <p className="text-sm uppercase tracking-[0.22em] text-slate-400">Family rooms</p>
              <p className="mt-3 text-3xl font-semibold text-slate-900">81%</p>
            </div>
          </div>
        </div>

        <div className="rounded-[2.5rem] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Service health</p>
              <h3 className="mt-2 text-2xl font-semibold text-slate-900">Live operational alerts</h3>
            </div>
              <span className="text-2xl">⏱️</span>
            <p className="rounded-3xl bg-sky-50 p-4">Last-minute booking demand up 18% for city center suites.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
