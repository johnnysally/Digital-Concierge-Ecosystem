import { useQuery } from '@tanstack/react-query';
import { SparkIcon } from '../../../../shared/components/ui/Icons';
import { fetchTravelerProfiles, TravelerProfile } from '../../../../shared/services/customerService';

export default function UserProfilesPage() {
  const { data: travelers = [], isLoading, error } = useQuery<TravelerProfile[]>({
    queryKey: ['travelerProfiles'],
    queryFn: fetchTravelerProfiles,
  });

  return (
    <div className="space-y-8">
      <header className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-slate-400">Companion profiles</p>
            <h2 className="mt-3 text-3xl font-semibold text-slate-900">Manage travelers in your network</h2>
            <p className="mt-2 max-w-2xl text-sm text-slate-500">Keep traveler details, preferences, and shared journeys organized for effortless booking and concierge planning.</p>
          </div>
          <button className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-700">
            <SparkIcon className="h-5 w-5" />
            Add new profile
          </button>
        </div>
      </header>

      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm">
          <div className="mb-6 flex items-center justify-between gap-3">
            <h3 className="text-xl font-semibold text-slate-900">Active traveler profiles</h3>
            <span className="rounded-full bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700">{travelers.length} profiles</span>
          </div>

          {isLoading ? (
            <p className="text-sm text-slate-500">Loading profiles...</p>
          ) : error ? (
            <p className="text-sm text-red-500">Unable to load traveler profiles.</p>
          ) : (
            <div className="space-y-4">
              {travelers.map((traveler) => (
                <div key={traveler.name} className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-base font-semibold text-slate-900">{traveler.name}</p>
                      <p className="mt-1 text-sm text-slate-500">{traveler.relation} • {traveler.lastTrip}</p>
                    </div>
                    <span className="rounded-full bg-white px-4 py-2 text-sm font-medium text-slate-700 ring-1 ring-slate-200">{traveler.status}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm">
          <h3 className="text-xl font-semibold text-slate-900">Profile settings</h3>
          <div className="mt-6 space-y-4 text-sm text-slate-600">
            <p>Configure trusted traveler permissions, preferred seating, dietary preferences, and contact sharing for each profile.</p>
            <p>Make it easier to book services for family, friends, and business guests without re-entering details.</p>
            <button className="mt-4 inline-flex rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700">
              Review profile permissions
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
