import { useQuery } from '@tanstack/react-query';
import { fetchSettings } from '../../settings/services/settingsService';

export default function SettingsPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['restaurant-settings'],
    queryFn: fetchSettings,
  });

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-50">Settings</h2>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Configure notifications, language, currency, and security.</p>
      </div>

      {isLoading ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <p className="text-sm text-slate-500 dark:text-slate-400">Loading settings…</p>
        </div>
      ) : isError ? (
        <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-sm text-red-700 shadow-sm dark:border-red-900 dark:bg-red-950 dark:text-red-300">
          Unable to load settings. Please refresh the page.
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h3 className="text-sm text-slate-500 dark:text-slate-400">Language</h3>
            <p className="mt-2 text-lg font-semibold text-slate-900 dark:text-slate-50">{data?.language ?? 'N/A'}</p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h3 className="text-sm text-slate-500 dark:text-slate-400">Currency</h3>
            <p className="mt-2 text-lg font-semibold text-slate-900 dark:text-slate-50">{data?.currency ?? 'N/A'}</p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h3 className="text-sm text-slate-500 dark:text-slate-400">Notifications</h3>
            <p className="mt-2 text-lg font-semibold text-slate-900 dark:text-slate-50">
              {data?.notifications ? 'Enabled' : 'Disabled'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
