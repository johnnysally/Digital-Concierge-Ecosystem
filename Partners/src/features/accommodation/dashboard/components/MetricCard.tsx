import { ReactNode } from 'react';

interface MetricCardProps {
  label: string;
  value: string;
  trend?: string;
  icon?: ReactNode;
}

export default function MetricCard({ label, value, trend, icon }: MetricCardProps) {
  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.22em] text-slate-400">{label}</p>
          <p className="mt-3 text-3xl font-semibold text-slate-900">{value}</p>
        </div>
        <div className="text-slate-500">{icon}</div>
      </div>
      {trend ? <p className="mt-4 text-sm text-emerald-600">{trend}</p> : null}
    </div>
  );
}
