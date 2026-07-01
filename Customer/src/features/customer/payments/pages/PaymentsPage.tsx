import SectionHeader from '../../../../shared/components/ui/SectionHeader';
import Badge from '../../../../shared/components/ui/Badge';

export default function PaymentsPage() {
  return (
    <div className="space-y-8">
      <SectionHeader title="Payments" description="Manage all payment methods, invoices, refunds, and transaction controls from one wallet." />

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          <div className="rounded-[32px] bg-white p-8 shadow-sm ring-1 ring-slate-200/80">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">Payment methods</h2>
                <p className="mt-2 text-sm text-slate-500">Use cards, mobile money, and in-app wallet balances seamlessly.</p>
              </div>
              <button className="rounded-3xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700">Add method</button>
            </div>

            <div className="mt-6 space-y-4">
              {[
                { label: 'Visa • 8421', status: 'Primary' },
                { label: 'M-Pesa • 07XX XXX XXX', status: 'Active' },
                { label: 'Airtel Money • 07XX XXX XXX', status: 'Active' },
              ].map((method) => (
                <div key={method.label} className="flex items-center justify-between rounded-3xl border border-slate-200 bg-slate-50 p-5">
                  <div>
                    <p className="font-semibold text-slate-900">{method.label}</p>
                    <p className="text-sm text-slate-500">{method.status}</p>
                  </div>
                  <button className="rounded-2xl bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-100">Edit</button>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[32px] bg-white p-8 shadow-sm ring-1 ring-slate-200/80">
            <h3 className="text-lg font-semibold text-slate-900">Recent transactions</h3>
            <div className="mt-6 space-y-4">
              {[
                { description: 'Hotel payment', amount: '-$290', date: '12 May' },
                { description: 'Ride service', amount: '-$45', date: '12 May' },
                { description: 'Refund credited', amount: '+$120', date: '11 May' },
              ].map((item) => (
                <div key={item.description} className="flex items-center justify-between rounded-3xl bg-slate-50 p-5">
                  <div>
                    <p className="font-semibold text-slate-900">{item.description}</p>
                    <p className="text-sm text-slate-500">{item.date}</p>
                  </div>
                  <p className="font-semibold text-slate-900">{item.amount}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="rounded-[32px] bg-slate-950 p-8 text-white shadow-xl ring-1 ring-white/10">
            <h3 className="text-lg font-semibold">Unified wallet</h3>
            <p className="mt-3 text-sm leading-6 text-slate-300">Your entire payment journey is unified across accommodations, transport, food, and services.</p>
            <div className="mt-6 rounded-3xl bg-slate-900 p-5">
              <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Available balance</p>
              <p className="mt-3 text-3xl font-semibold text-white">$1,250</p>
            </div>
          </div>

          <div className="rounded-[32px] bg-white p-8 shadow-sm ring-1 ring-slate-200/80">
            <h3 className="text-lg font-semibold text-slate-900">Payment intelligence</h3>
            <ul className="mt-6 space-y-3 text-sm text-slate-700">
              <li>Smart routing between cards and mobile wallets.</li>
              <li>Automatic promo application.</li>
              <li>Refund tracking with notifications.</li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
