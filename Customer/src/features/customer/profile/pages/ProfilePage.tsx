import SectionHeader from '../../../../shared/components/ui/SectionHeader';
import Badge from '../../../../shared/components/ui/Badge';

export default function ProfilePage() {
  return (
    <div className="space-y-8">
      <SectionHeader title="Profile settings" description="Manage your identity, security, payment methods, and travel preferences." />

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          <div className="rounded-[32px] bg-white p-8 shadow-sm ring-1 ring-slate-200/80">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">Personal details</h2>
                <p className="mt-2 text-sm text-slate-500">Update your name, language, and emergency contact preferences.</p>
              </div>
              <Badge variant="success">Verified</Badge>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {[
                { label: 'Name', value: 'Victoria Summers' },
                { label: 'Email', value: 'victoria@travelmail.com' },
                { label: 'Phone', value: '+44 20 7946 0958' },
                { label: 'Language', value: 'English' },
              ].map((field) => (
                <div key={field.label} className="rounded-3xl bg-slate-50 p-5">
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-400">{field.label}</p>
                  <p className="mt-2 text-base font-semibold text-slate-900">{field.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[32px] bg-white p-8 shadow-sm ring-1 ring-slate-200/80">
            <h3 className="text-lg font-semibold text-slate-900">Security</h3>
            <div className="mt-6 space-y-4">
              {[
                { label: 'Password', value: 'Last changed 3 days ago' },
                { label: 'Two-factor auth', value: 'Enabled' },
                { label: 'Identity verification', value: 'Verified' },
              ].map((item) => (
                <div key={item.label} className="rounded-3xl border border-slate-200 p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-slate-900">{item.label}</p>
                      <p className="mt-1 text-sm text-slate-500">{item.value}</p>
                    </div>
                    <button className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700">Manage</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="rounded-[32px] bg-slate-950 p-8 text-white shadow-xl ring-1 ring-white/10">
            <h3 className="text-lg font-semibold">Preferences</h3>
            <p className="mt-3 text-sm leading-6 text-slate-300">Personalize notifications, currency, and travel preferences for a smoother journey.</p>
            <div className="mt-6 space-y-4 text-sm text-slate-200">
              <div className="rounded-3xl bg-slate-900 p-4">
                <p className="text-sm">Currency</p>
                <p className="mt-2 font-semibold">EUR</p>
              </div>
              <div className="rounded-3xl bg-slate-900 p-4">
                <p className="text-sm">Notification preferences</p>
                <p className="mt-2 font-semibold">Email, SMS, Push</p>
              </div>
            </div>
          </div>

          <div className="rounded-[32px] bg-white p-8 shadow-sm ring-1 ring-slate-200/80">
            <h3 className="text-lg font-semibold text-slate-900">Saved addresses</h3>
            <div className="mt-6 space-y-4 text-sm text-slate-700">
              <div className="rounded-3xl border border-slate-200 p-5">
                <p className="font-semibold">Home</p>
                <p className="mt-1 text-slate-500">221B Baker Street, London</p>
              </div>
              <div className="rounded-3xl border border-slate-200 p-5">
                <p className="font-semibold">Work</p>
                <p className="mt-1 text-slate-500">Canary Wharf, London</p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
