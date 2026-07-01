import { BenefitCard } from '../../../../shared/components/ui/InfoCard';

const promotions = [
  {
    title: 'Priority Lounge Access',
    description: 'Unlock airport lounges worldwide with a single concierge pass and enjoy premium rest zones before departure.',
    tag: 'Premium',
  },
  {
    title: 'Flexible Journey Credits',
    description: 'Redeem travel credit for tickets, car transfers, or dining upgrades across our partner network.',
    tag: 'Flexible',
  },
  {
    title: 'Smart Trip Bundles',
    description: 'Receive curated travel bundles with hotel, ride, and concierge support tailored to your itinerary.',
    tag: 'Recommended',
  },
];

export default function PromotionsPage() {
  return (
    <div className="space-y-8">
      <section className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-slate-400">Travel offers</p>
            <h2 className="mt-3 text-3xl font-semibold text-slate-900">Exclusive promotions for your next trip</h2>
            <p className="mt-2 max-w-2xl text-sm text-slate-500">Explore tailored offers, limited-time bundles, and concierge reward campaigns that keep your journey smooth and more valuable.</p>
          </div>
          <button className="inline-flex items-center rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-700">
            View loyalty tiers
          </button>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {promotions.map((promo) => (
            <BenefitCard key={promo.title} title={promo.title} description={promo.description} badge={promo.tag} />
          ))}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.4fr_0.9fr]">
        <div className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm">
          <h3 className="text-xl font-semibold text-slate-900">Latest service promotions</h3>
          <ul className="mt-6 space-y-5">
            <li className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <h4 className="text-base font-semibold text-slate-900">24/7 Airport Meet & Assist</h4>
              <p className="mt-2 text-sm text-slate-600">Receive personalized arrival support, baggage escort, and transit assistance for a seamless airport experience.</p>
            </li>
            <li className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <h4 className="text-base font-semibold text-slate-900">Ride upgrade guarantee</h4>
              <p className="mt-2 text-sm text-slate-600">Enjoy a free upgrade on selected ride bookings when you travel during peak hours or city events.</p>
            </li>
            <li className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <h4 className="text-base font-semibold text-slate-900">Hotel early check-in</h4>
              <p className="mt-2 text-sm text-slate-600">Reserve early check-in priorities at partner hotels for more comfortable arrivals.</p>
            </li>
          </ul>
        </div>

        <div className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm">
          <h3 className="text-xl font-semibold text-slate-900">Rewards snapshot</h3>
          <div className="mt-6 grid gap-4">
            <div className="rounded-3xl bg-slate-950 p-6 text-white">
              <p className="text-sm uppercase tracking-[0.35em] text-slate-400">Points balance</p>
              <p className="mt-4 text-4xl font-semibold">18,460</p>
              <p className="mt-2 text-sm text-slate-300">Redeem for upgrades, concierge requests, or travel credits.</p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
              <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Active campaign</p>
              <p className="mt-4 text-base font-semibold text-slate-900">Summer transfer savings</p>
              <p className="mt-2 text-sm text-slate-600">Save up to 15% on airport transfers booked through the concierge app.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
