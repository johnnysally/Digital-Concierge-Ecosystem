import { useQuery } from '@tanstack/react-query';
import { fetchProfile } from '../../profile/services/profileService';

export default function ProfilePage() {
  const { data } = useQuery({ queryKey: ['restaurant-profile'], queryFn: fetchProfile });

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-50">Business Profile</h2>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Update business details, hours, and contact information.</p>
      </div>
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Name</h3>
            <p className="mt-2 text-lg font-semibold text-slate-900 dark:text-slate-50">{data?.name}</p>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Category</h3>
            <p className="mt-2 text-lg font-semibold text-slate-900 dark:text-slate-50">{data?.category}</p>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Address</h3>
            <p className="mt-2 text-lg font-semibold text-slate-900 dark:text-slate-50">{data?.address}</p>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Phone</h3>
            <p className="mt-2 text-lg font-semibold text-slate-900 dark:text-slate-50">{data?.phone}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
