interface MetricTileProps {
  label: string;
  value: string;
  description: string;
}

export default function MetricTile({ label, value, description }: MetricTileProps) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
      <p className="mt-4 text-3xl font-semibold text-slate-900 dark:text-slate-50">{value}</p>
      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{description}</p>
    </div>
  );
}
