import SectionHeader from '../../../../shared/components/ui/SectionHeader';
import Badge from '../../../../shared/components/ui/Badge';

export default function MapsDashboardPage() {
  return (
    <div className="space-y-8">
      <SectionHeader title="Maps & location services" description="Interactive routing, nearby recommendations, and live geofencing for your booked stay." />

      <div className="grid gap-6 xl:grid-cols-[1.4fr_0.6fr]">
        <div className="rounded-[32px] bg-white p-8 shadow-sm ring-1 ring-slate-200/80">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Arrival zone map</h2>
              <p className="mt-2 text-sm text-slate-500">See the hotel, dining, and ride pickup areas around your destination.</p>
            </div>
            <Badge variant="success">Live</Badge>
          </div>
          <div className="mt-6 h-[420px] rounded-[28px] bg-slate-100 text-center text-slate-500 shadow-inner">Map component placeholder</div>
        </div>

        <aside className="space-y-6">
          <div className="rounded-[32px] bg-white p-8 shadow-sm ring-1 ring-slate-200/80">
            <h3 className="text-lg font-semibold text-slate-900">Nearby services</h3>
            <ul className="mt-6 space-y-4 text-sm text-slate-700">
              {['Restaurants', 'Taxi ranks', 'Attractions', 'Pharmacies', 'ATMs'].map((item) => (
                <li key={item} className="rounded-3xl border border-slate-200 bg-slate-50 p-4">{item}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-[32px] bg-slate-950 p-8 text-white shadow-xl ring-1 ring-white/10">
            <h3 className="text-lg font-semibold">Location intelligence</h3>
            <p className="mt-3 text-sm leading-6 text-slate-300">Geolocation-driven recommendations adjust in real time to your itinerary and booked accommodation.</p>
          </div>
        </aside>
      </div>
    </div>
  );
}
