import SectionHeader from '../../../../shared/components/ui/SectionHeader';
import Badge from '../../../../shared/components/ui/Badge';

export default function FoodDeliveryPage() {
  return (
    <div className="space-y-8">
      <SectionHeader title="Food & dining" description="Order local cuisine and manage delivery from your accommodation." />

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          <div className="rounded-[32px] bg-white p-8 shadow-sm ring-1 ring-slate-200/80">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">Recommended restaurants</h2>
                <p className="mt-2 text-sm text-slate-500">Based on your booked accommodation and cuisine preferences.</p>
              </div>
              <Badge variant="success">Nearby</Badge>
            </div>
            <div className="mt-6 grid gap-4">
              {[
                { name: 'Bistro Lane', cuisine: 'French', eta: '22 min' },
                { name: 'Street Sushi', cuisine: 'Japanese', eta: '18 min' },
                { name: 'Market Grill', cuisine: 'International', eta: '25 min' },
              ].map((restaurant) => (
                <div key={restaurant.name} className="rounded-3xl border border-slate-200 p-5 shadow-sm transition hover:shadow-lg">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h4 className="text-lg font-semibold text-slate-900">{restaurant.name}</h4>
                      <p className="mt-1 text-sm text-slate-500">{restaurant.cuisine}</p>
                    </div>
                    <Badge variant="secondary">{restaurant.eta}</Badge>
                  </div>
                  <button className="mt-5 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-700">
                    Browse menu
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[32px] bg-white p-8 shadow-sm ring-1 ring-slate-200/80">
            <h3 className="text-lg font-semibold text-slate-900">Your delivery basket</h3>
            <div className="mt-6 space-y-4 text-sm text-slate-700">
              <div className="rounded-3xl bg-slate-50 p-5">
                <div className="flex items-center justify-between">
                  <p>Margherita pizza</p>
                  <p className="font-semibold">$12.80</p>
                </div>
                <p className="mt-2 text-xs text-slate-500">Bistro Lane • Delivery to hotel</p>
              </div>
              <div className="rounded-3xl bg-slate-50 p-5">
                <div className="flex items-center justify-between">
                  <p>Spring rolls</p>
                  <p className="font-semibold">$7.20</p>
                </div>
                <p className="mt-2 text-xs text-slate-500">Street Sushi • Scheduled delivery</p>
              </div>
              <div className="rounded-3xl bg-slate-50 p-5">
                <div className="flex items-center justify-between">
                  <p>Total</p>
                  <p className="font-semibold">$20.00</p>
                </div>
              </div>
              <button className="w-full rounded-3xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-700">
                Checkout now
              </button>
            </div>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="rounded-[32px] bg-white p-8 shadow-sm ring-1 ring-slate-200/80">
            <h3 className="text-lg font-semibold text-slate-900">Delivery insights</h3>
            <p className="mt-3 text-sm text-slate-500">Quickly see delivery times, ratings, and order history.</p>
            <div className="mt-6 grid gap-4">
              <div className="rounded-3xl bg-slate-50 p-5">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Average rating</p>
                <p className="mt-2 text-2xl font-semibold text-slate-900">4.8</p>
              </div>
              <div className="rounded-3xl bg-slate-50 p-5">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Preferred cuisine</p>
                <p className="mt-2 text-lg font-semibold text-slate-900">Fusion</p>
              </div>
            </div>
          </div>

          <div className="rounded-[32px] bg-slate-950 p-8 text-white shadow-xl ring-1 ring-white/10">
            <h3 className="text-lg font-semibold">Food concierge</h3>
            <p className="mt-3 text-sm leading-6 text-slate-300">Your digital assistant suggests meals, discounts, and delivery windows aligned with your itinerary.</p>
          </div>
        </aside>
      </div>
    </div>
  );
}
