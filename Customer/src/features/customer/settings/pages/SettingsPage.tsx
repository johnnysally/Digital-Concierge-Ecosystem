import SectionHeader from '../../../../shared/components/ui/SectionHeader';
import Badge from '../../../../shared/components/ui/Badge';

export default function SettingsPage() {
  return (
    <div className="space-y-8">
      <SectionHeader title="Settings" description="Configure language, currency, notification, and privacy preferences." />

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          <div className="rounded-[32px] bg-white p-8 shadow-sm ring-1 ring-slate-200/80">
            <h3 className="text-lg font-semibold text-slate-900">Preferences</h3>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {[
                { label: 'Language', value: 'English' },
                { label: 'Currency', value: 'EUR' },
                { label: 'Notification', value: 'Email, SMS, Push' },
                { label: 'Privacy', value: 'Enhanced' },
              ].map((item) => (
                <div key={item.label} className="rounded-3xl bg-slate-50 p-5">
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-400">{item.label}</p>
                  <p className="mt-2 font-semibold text-slate-900">{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[32px] bg-white p-8 shadow-sm ring-1 ring-slate-200/80">
            <h3 className="text-lg font-semibold text-slate-900">Security preferences</h3>
            <div className="mt-6 space-y-4">
              {[
                { label: 'Two-factor authentication', status: 'Enabled' },
                { label: 'Session timeout', status: '15 min' },
                { label: 'Privacy mode', status: 'Strict' },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between rounded-3xl border border-slate-200 bg-slate-50 p-5">
                  <div>
                    <p className="font-semibold text-slate-900">{item.label}</p>
                    <p className="text-sm text-slate-500">{item.status}</p>
                  </div>
                  <button className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700">Change</button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="rounded-[32px] bg-slate-950 p-8 text-white shadow-xl ring-1 ring-white/10">
            <h3 className="text-lg font-semibold">Portal behavior</h3>
            <p className="mt-3 text-sm leading-6 text-slate-300">Control your trip notifications, preferred destinations, and travel insights without leaving the app.</p>
          </div>

          <div className="rounded-[32px] bg-white p-8 shadow-sm ring-1 ring-slate-200/80">
            <h3 className="text-lg font-semibold text-slate-900">Saved preferences</h3>
            <div className="mt-6 rounded-3xl bg-slate-50 p-5 text-sm text-slate-700">
              <p>Default transport: Taxi</p>
              <p>Room type: King suite</p>
              <p>Dietary preference: Vegetarian</p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
