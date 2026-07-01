import SectionHeader from '../../../../shared/components/ui/SectionHeader';
import Badge from '../../../../shared/components/ui/Badge';

export default function TransportDashboardPage() {
  return (
    <div className="space-y-8">
      <SectionHeader title="Transport dashboard" description="Manage your ride requests, airport transfers, and live tracking." />

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          <div className="rounded-[32px] bg-white p-8 shadow-sm ring-1 ring-slate-200/80">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">Active ride</h2>
                <p className="mt-2 text-sm text-slate-500">Scheduled pickup from your hotel to the airport.</p>
              </div>
              <Badge variant="success">On route</Badge>
            </div>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {[
                { label: 'Driver', value: 'Samuel Doe' },
                { label: 'Vehicle', value: 'Toyota Prius • Plate 540ZQ' },
                { label: 'ETA', value: '12 min' },
              ].map((item) => (
                <div key={item.label} className="rounded-3xl bg-slate-50 p-5">
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-400">{item.label}</p>
                  <p className="mt-3 text-base font-semibold text-slate-900">{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[32px] bg-white p-8 shadow-sm ring-1 ring-slate-200/80">
            <h3 className="text-lg font-semibold text-slate-900">Ride options</h3>
            <div className="mt-6 space-y-4">
              {[
                { title: 'Airport pickup', description: 'Private sedan with luggage support', tag: 'Recommended' },
                { title: 'Hotel transfer', description: 'Shared shuttle with express route', tag: 'Popular' },
                { title: 'On-demand ride', description: 'Book a nearby driver instantly', tag: 'Fastest' },
              ].map((option) => (
                <div key={option.title} className="rounded-3xl border border-slate-200 p-5 transition hover:shadow-lg">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h4 className="text-lg font-semibold text-slate-900">{option.title}</h4>
                      <p className="mt-2 text-sm text-slate-500">{option.description}</p>
                    </div>
                    <Badge variant="secondary">{option.tag}</Badge>
                  </div>
                  <button className="mt-5 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-700">
                    Request now
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="rounded-[32px] bg-white p-8 shadow-sm ring-1 ring-slate-200/80">
            <h3 className="text-lg font-semibold text-slate-900">Travel heatmap</h3>
            <p className="mt-2 text-sm text-slate-500">View nearby vehicle availability and road status near your accommodation.</p>
            <div className="mt-6 h-72 rounded-[28px] bg-slate-100 p-6 text-slate-500">Map visualization placeholder</div>
          </div>

          <div className="rounded-[32px] bg-slate-950 p-8 text-white shadow-xl ring-1 ring-white/10">
            <h3 className="text-lg font-semibold">Transport intelligence</h3>
            <ul className="mt-6 space-y-3 text-sm leading-6 text-slate-300">
              <li>Automatic nearby driver matching</li>
              <li>Estimated travel time based on traffic</li>
              <li>Airport pickup and dropoff coordination</li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
