import Badge from '../../../../shared/components/ui/Badge';
import SectionHeader from '../../../../shared/components/ui/SectionHeader';

export default function AccommodationSearchPage() {
  return (
    <div className="space-y-8">
      <SectionHeader title="Accommodation search" description="Search and compare hotels, BnBs, apartments and vacation homes." actionLabel="New search" actionLink="/" />

      <div className="grid gap-6 xl:grid-cols-[0.7fr_0.3fr]">
        <div className="space-y-6">
          <div className="rounded-[32px] bg-white p-8 shadow-sm ring-1 ring-slate-200/80">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">Search filters</h2>
                <p className="mt-2 text-sm text-slate-500">Refine by location, budget, amenities and guest rating.</p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {['Budget', 'Rating', 'Type', 'Guests'].map((filter) => (
                  <button key={filter} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-slate-300">
                    {filter}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-5">
            {[
              {
                title: 'Skyline Suites',
                location: 'City center, 350m from landmark',
                price: '$220/night',
                rating: '4.9',
                amenities: ['Breakfast', 'Pool', 'Parking'],
              },
              {
                title: 'Riverside BnB',
                location: 'Waterfront district, near restaurants',
                price: '$180/night',
                rating: '4.8',
                amenities: ['Wi-Fi', 'Gym', 'Pet friendly'],
              },
            ].map((hotel) => (
              <article key={hotel.title} className="grid gap-5 rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm lg:grid-cols-[1fr_240px]">
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-2xl font-semibold text-slate-900">{hotel.title}</h3>
                    <Badge variant="success">{hotel.rating}</Badge>
                  </div>
                  <p className="text-sm text-slate-500">{hotel.location}</p>
                  <div className="flex flex-wrap gap-3 text-sm text-slate-500">
                    {hotel.amenities.map((tag) => (
                      <span key={tag} className="rounded-full bg-slate-100 px-3 py-2">{tag}</span>
                    ))}
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-3xl bg-slate-50 p-4">
                      <p className="text-sm uppercase tracking-[0.28em] text-slate-400">Availability</p>
                      <p className="mt-2 font-semibold text-slate-900">Available</p>
                    </div>
                    <div className="rounded-3xl bg-slate-50 p-4">
                      <p className="text-sm uppercase tracking-[0.28em] text-slate-400">Distance</p>
                      <p className="mt-2 font-semibold text-slate-900">0.5 km</p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col justify-between rounded-[28px] bg-slate-50 p-6">
                  <div>
                    <p className="text-sm text-slate-500">From</p>
                    <p className="mt-3 text-3xl font-semibold text-slate-900">{hotel.price}</p>
                  </div>
                  <button className="mt-6 rounded-3xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-700">
                    View details
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>

        <aside className="space-y-6">
          <div className="rounded-[32px] bg-white p-8 shadow-sm ring-1 ring-slate-200/80">
            <h3 className="text-lg font-semibold text-slate-900">Search summary</h3>
            <dl className="mt-6 space-y-4 text-sm text-slate-600">
              <div className="flex items-center justify-between">
                <dt>Location</dt>
                <dd className="font-semibold text-slate-900">Downtown</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt>Guests</dt>
                <dd className="font-semibold text-slate-900">2 adults</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt>Check-in</dt>
                <dd className="font-semibold text-slate-900">May 12</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt>Budget</dt>
                <dd className="font-semibold text-slate-900">$150–$250</dd>
              </div>
            </dl>
          </div>

          <div className="rounded-[32px] bg-slate-950 p-8 text-white shadow-xl ring-1 ring-white/10">
            <h3 className="text-lg font-semibold">Location intelligence</h3>
            <p className="mt-3 text-sm leading-6 text-slate-300">Automatically match on-site restaurants, ride options and local services based on the selected stay.</p>
            <ul className="mt-6 space-y-3 text-sm text-slate-200">
              <li>Nearby dining insights</li>
              <li>Optimized travel times</li>
              <li>Availability-aware pricing</li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
