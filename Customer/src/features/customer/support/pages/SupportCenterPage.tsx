import SectionHeader from '../../../../shared/components/ui/SectionHeader';
import Badge from '../../../../shared/components/ui/Badge';

export default function SupportCenterPage() {
  return (
    <div className="space-y-8">
      <SectionHeader title="Support Center" description="Get help with bookings, payments, transport, and trip planning." />

      <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        <div className="space-y-6">
          <div className="rounded-[32px] bg-white p-8 shadow-sm ring-1 ring-slate-200/80">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">Open support request</h2>
                <p className="mt-2 text-sm text-slate-500">Create or track support tickets across your customer journey.</p>
              </div>
              <button className="rounded-3xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700">New ticket</button>
            </div>
            <div className="mt-6 space-y-4">
              {[
                { title: 'Room upgrade request', status: 'Open' },
                { title: 'Refund follow-up', status: 'On hold' },
                { title: 'Ride issue', status: 'Resolved' },
              ].map((item) => (
                <div key={item.title} className="flex items-center justify-between rounded-3xl border border-slate-200 bg-slate-50 p-5">
                  <div>
                    <p className="font-semibold text-slate-900">{item.title}</p>
                    <p className="text-sm text-slate-500">Ticket details and agent notes</p>
                  </div>
                  <Badge variant={item.status === 'Resolved' ? 'success' : 'secondary'}>{item.status}</Badge>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[32px] bg-white p-8 shadow-sm ring-1 ring-slate-200/80">
            <h3 className="text-lg font-semibold text-slate-900">Support resources</h3>
            <div className="mt-6 space-y-4 text-sm text-slate-700">
              {['Booking FAQs', 'Payment help', 'Ride support', 'Travel advisories'].map((item) => (
                <div key={item} className="rounded-3xl border border-slate-200 bg-slate-50 p-5">{item}</div>
              ))}
            </div>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="rounded-[32px] bg-slate-950 p-8 text-white shadow-xl ring-1 ring-white/10">
            <h3 className="text-lg font-semibold">24/7 assistance</h3>
            <p className="mt-3 text-sm leading-6 text-slate-300">Our support team is available around the clock to ensure every leg of your trip is seamless.</p>
            <button className="mt-6 w-full rounded-3xl bg-emerald-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400">Contact support</button>
          </div>

          <div className="rounded-[32px] bg-white p-8 shadow-sm ring-1 ring-slate-200/80">
            <h3 className="text-lg font-semibold text-slate-900">Recent support updates</h3>
            <ul className="mt-6 space-y-4 text-sm text-slate-700">
              <li className="rounded-3xl bg-slate-50 p-4">Your refund request is under review.</li>
              <li className="rounded-3xl bg-slate-50 p-4">Driver arrival time updated.</li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
