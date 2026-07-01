import SectionHeader from '../../../../shared/components/ui/SectionHeader';
import Badge from '../../../../shared/components/ui/Badge';

export default function WalletPage() {
  return (
    <div className="space-y-8">
      <SectionHeader title="Wallet" description="Manage cards, wallet balance, transactions, and rewards." />

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          <div className="rounded-[32px] bg-white p-8 shadow-sm ring-1 ring-slate-200/80">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">Wallet overview</h2>
                <p className="mt-2 text-sm text-slate-500">Unified wallet for payments, rewards, and refunds.</p>
              </div>
              <Badge variant="success">Active</Badge>
            </div>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {[
                { label: 'Balance', value: '$1,250' },
                { label: 'Rewards', value: '420 points' },
                { label: 'Refunds pending', value: '$120' },
              ].map((item) => (
                <div key={item.label} className="rounded-3xl bg-slate-50 p-5">
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-400">{item.label}</p>
                  <p className="mt-2 text-xl font-semibold text-slate-900">{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[32px] bg-white p-8 shadow-sm ring-1 ring-slate-200/80">
            <h3 className="text-lg font-semibold text-slate-900">Saved payment methods</h3>
            <div className="mt-6 space-y-4">
              {[
                { type: 'Visa', masked: '**** 8421', expiry: '12/28' },
                { type: 'M-Pesa', masked: '07XX XXX XXX', expiry: 'Active' },
                { type: 'Airtel Money', masked: '07XX XXX XXX', expiry: 'Active' },
              ].map((card) => (
                <div key={card.type} className="flex items-center justify-between rounded-3xl border border-slate-200 bg-slate-50 p-5">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{card.type}</p>
                    <p className="mt-1 text-sm text-slate-500">{card.masked}</p>
                  </div>
                  <span className="text-sm text-slate-600">{card.expiry}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[32px] bg-white p-8 shadow-sm ring-1 ring-slate-200/80">
            <h3 className="text-lg font-semibold text-slate-900">Quick actions</h3>
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {['Add funds', 'Request refund', 'Apply promo'].map((item) => (
                <button key={item} className="rounded-3xl bg-slate-900 px-4 py-4 text-sm font-semibold text-white transition hover:bg-slate-700">
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="rounded-[32px] bg-slate-950 p-8 text-white shadow-xl ring-1 ring-white/10">
            <h3 className="text-lg font-semibold">Payment intelligence</h3>
            <ul className="mt-6 space-y-3 text-sm leading-6 text-slate-300">
              <li>One wallet across all travel services.</li>
              <li>Auto-selects preferred payment method.</li>
              <li>Supports cards, M-Pesa, Airtel Money and rewards.</li>
            </ul>
          </div>

          <div className="rounded-[32px] bg-white p-8 shadow-sm ring-1 ring-slate-200/80">
            <h3 className="text-lg font-semibold text-slate-900">Transaction history</h3>
            <div className="mt-6 space-y-4 text-sm text-slate-700">
              <div className="rounded-3xl bg-slate-50 p-4">
                <p className="font-semibold">Hotel booking</p>
                <p className="mt-1 text-xs text-slate-500">$290 • May 12</p>
              </div>
              <div className="rounded-3xl bg-slate-50 p-4">
                <p className="font-semibold">Ride fare</p>
                <p className="mt-1 text-xs text-slate-500">$45 • May 12</p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
