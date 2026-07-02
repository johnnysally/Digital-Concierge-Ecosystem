interface StatusBadgeProps {
  status: string;
}

const statusStyles: Record<string, string> = {
  New: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200',
  Responded: 'bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-100',
  Preparing: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
  Ready: 'bg-sky-100 text-sky-800 dark:bg-sky-900 dark:text-sky-200',
  Delivered: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200',
  Cancelled: 'bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-200',
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  return <span className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${statusStyles[status] ?? 'bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-100'}`}>{status}</span>;
}
