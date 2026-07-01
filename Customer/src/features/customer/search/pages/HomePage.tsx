import ActionTile from '../../../../shared/components/ui/ActionTile';
import Badge from '../../../../shared/components/ui/Badge';
import MetricCard from '../../../../shared/components/ui/MetricCard';
import SectionHeader from '../../../../shared/components/ui/SectionHeader';

export default function HomePage() {
  return (
    <div className="space-y-8">
      <section className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="rounded-[32px] bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-8 text-white shadow-xl ring-1 ring-slate-200/5">
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-start">
            <div>
              <span className="inline-flex rounded-full bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.35em] text-slate-200">AI Concierge</span>
              <h1 className="mt-6 text-4xl font-semibold tracking-tight">Your complete trip command center</h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300">
                Plan stay, transport, dining, and local services with one intelligent customer portal tailored to your itinerary.
              </p>
            </div>
            <div className="rounded-3xl bg-slate-900/90 p-6 shadow-lg ring-1 ring-white/10">
              <h3 className="text-sm uppercase tracking-[0.35em] text-slate-400">Next departure</h3>
              <p className="mt-3 text-3xl font-semibold text-white">Paris, 12 May</p>
              <p className="mt-2 text-sm text-slate-400">Arrival 08:30</p>
            </div>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            <MetricCard title="Upcoming trips" value="3" subtitle="Trips in the next 30 days" />
            <MetricCard title="Wallet balance" value="$1,250" subtitle="Available across cards and wallets" color="bg-emerald-900 text-white" />
            <MetricCard title="Active bookings" value="8" subtitle="Accommodation, rides and food" color="bg-sky-900 text-white" />
            <MetricCard title="Live score" value="94" subtitle="Travel confidence index" color="bg-amber-900 text-white" />
          </div>
        </div>

        <div className="grid gap-5">
          <div className="rounded-[32px] bg-white p-8 shadow-sm ring-1 ring-slate-200/80">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">Recent activity</h2>
                <p className="mt-2 text-sm text-slate-500">Track every trip, booking, and payment in one timeline.</p>
              </div>
              <Badge variant="success">On track</Badge>
            </div>
            <div className="mt-8 space-y-6">
              {['Hotel confirmed', 'Ride scheduled', 'Food delivery in progress'].map((item) => (
                <div key={item} className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                  <p className="text-sm font-semibold text-slate-900">{item}</p>
                  <p className="mt-2 text-sm text-slate-500">Detailed status updates and quick access controls for each active item.</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[32px] bg-white p-8 shadow-sm ring-1 ring-slate-200/80">
            <SectionHeader title="Quick actions" description="Jump into the most important travel tasks." />
            <div className="grid gap-4 sm:grid-cols-2">
              <ActionTile href="/accommodation" icon={<span>🏨</span>} title="Find accommodation" description="Search hotels, BnBs, apartments and vacation homes." />
              <ActionTile href="/transport" icon={<span>🚗</span>} title="Request transport" description="Book airport pickup, rides, and hotel transfers." />
              <ActionTile href="/food" icon={<span>🍽️</span>} title="Order food" description="Browse local restaurants and track delivery." />
              <ActionTile href="/chat" icon={<span>🤖</span>} title="Ask AI Concierge" description="Get real-time travel advice and recommendations." />
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          <div className="rounded-[32px] bg-white p-8 shadow-sm ring-1 ring-slate-200/80">
            <SectionHeader title="Recommended stays" description="Curated properties based on your travel preferences." actionLabel="View all" actionLink="/accommodation" />
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {['Hotel Atlas', 'Riverside BnB', 'Modern Studio'].map((property) => (
                <div key={property} className="rounded-3xl border border-slate-200 p-6 transition hover:shadow-lg">
                  <p className="text-lg font-semibold text-slate-900">{property}</p>
                  <p className="mt-2 text-sm text-slate-500">Premium location, curated amenities, and flexible booking policies.</p>
                  <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-500">
                    <Badge variant="secondary">4.9</Badge>
                    <Badge variant="secondary">City center</Badge>
                    <Badge variant="secondary">Free breakfast</Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[32px] bg-white p-8 shadow-sm ring-1 ring-slate-200/80">
            <SectionHeader title="Nearby dining" description="Restaurants selected for your upcoming stay." actionLabel="Explore" actionLink="/food" />
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {['Bistro Lane', 'Skyline Sushi', 'Market Grill'].map((restaurant) => (
                <div key={restaurant} className="rounded-3xl border border-slate-200 p-5">
                  <p className="text-lg font-semibold text-slate-900">{restaurant}</p>
                  <p className="mt-2 text-sm text-slate-500">Delivery to your accommodation with live order tracking.</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-[32px] bg-white p-8 shadow-sm ring-1 ring-slate-200/80">
            <SectionHeader title="Location intelligence" description="Intelligent suggestions based on your booked accommodation." />
            <div className="mt-6 grid gap-4">
              {['Nearby taxis', 'Local attractions', 'Pharmacies and ATMs'].map((item) => (
                <div key={item} className="rounded-3xl border border-slate-200 p-5">
                  <p className="font-semibold text-slate-900">{item}</p>
                  <p className="mt-2 text-sm text-slate-500">Context-aware services ready for your arrival.</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[32px] bg-white p-8 shadow-sm ring-1 ring-slate-200/80">
            <SectionHeader title="Wallet status" description="One wallet for payments, rewards, and loyalty." actionLabel="Open wallet" actionLink="/wallet" />
            <div className="mt-6 grid gap-4">
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                <p className="text-sm text-slate-500">Available balance</p>
                <p className="mt-3 text-3xl font-semibold text-slate-900">$1,250.00</p>
                <p className="mt-2 text-sm text-slate-500">Includes M-Pesa, cards, and rewards.</p>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                <p className="text-sm text-slate-500">Latest transactions</p>
                <ul className="mt-4 space-y-3 text-sm text-slate-700">
                  <li className="flex items-center justify-between">
                    <span>Hotel deposit</span>
                    <span className="font-semibold">-$290</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span>Ride payment</span>
                    <span className="font-semibold">-$42</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span>Food order</span>
                    <span className="font-semibold">-$18</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
