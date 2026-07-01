import SectionHeader from '../../../../shared/components/ui/SectionHeader';
import Badge from '../../../../shared/components/ui/Badge';

export default function BookingOverviewPage() {
  return (
    <div className="space-y-8">
      <SectionHeader title="Booking management" description="Review upcoming, ongoing, and past bookings in one place." />

      <div className="grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">
        <div className="space-y-6">
          {[
            {
              title: 'Hilton Grand Suite',
              subtitle: 'Hotel confirmed • Paris city center',
              status: 'Upcoming',
              date: 'May 12 - May 17',
              amount: '$1,840',
            },
            {
              title: 'Airport transfer',
              subtitle: 'Ride scheduled • Charles de Gaulle Airport',
              status: 'Scheduled',
              date: 'May 12, 08:30',
              amount: '$45',
            },
            {
              title: 'Dinner order',
              subtitle: 'Food delivery • Bistro Lane',
              status: 'Delivered',
              date: 'May 11, 19:20',
              amount: '$38',
            },
          ].map((booking) => (
            <article key={booking.title} className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h3 className="text-2xl font-semibold text-slate-900">{booking.title}</h3>
                  <p className="mt-2 text-sm text-slate-500">{booking.subtitle}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={booking.status === 'Delivered' ? 'success' : 'secondary'}>{booking.status}</Badge>
                  <p className="text-sm font-semibold text-slate-900">{booking.amount}</p>
                </div>
              </div>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl bg-slate-50 p-5">
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Date</p>
                  <p className="mt-2 text-sm font-semibold text-slate-900">{booking.date}</p>
                </div>
                <div className="rounded-3xl bg-slate-50 p-5">
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Action</p>
                  <button className="mt-2 rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700">Manage</button>
                </div>
              </div>
            </article>
          ))}
        </div>

        <aside className="space-y-6">
          <div className="rounded-[32px] bg-white p-8 shadow-sm ring-1 ring-slate-200/80">
            <h3 className="text-lg font-semibold text-slate-900">Booking summary</h3>
            <p className="mt-3 text-sm text-slate-500">All your itineraries, invoices, and changes are accessible from the customer portal.</p>
            <div className="mt-6 space-y-4 text-sm text-slate-700">
              <div className="flex items-center justify-between rounded-3xl bg-slate-50 p-4">
                <span>Upcoming stays</span>
                <strong>2</strong>
              </div>
              <div className="flex items-center justify-between rounded-3xl bg-slate-50 p-4">
                <span>Active rides</span>
                <strong>1</strong>
              </div>
              <div className="flex items-center justify-between rounded-3xl bg-slate-50 p-4">
                <span>Pending payments</span>
                <strong>$45</strong>
              </div>
            </div>
          </div>

          <div className="rounded-[32px] bg-slate-950 p-8 text-white shadow-xl ring-1 ring-white/10">
            <h3 className="text-lg font-semibold">Trip timeline</h3>
            <div className="mt-6 space-y-4 text-sm leading-6 text-slate-300">
              <p>• May 12, 08:30 — Airport pickup confirmed</p>
              <p>• May 12, 14:00 — Hotel check-in</p>
              <p>• May 13, 18:00 — Dinner reservation at Bistro Lane</p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
