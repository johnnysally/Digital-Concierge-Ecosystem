type MetricCardProps = {
  title: string;
  value: string;
  subtitle: string;
  color?: string;
};

export default function MetricCard({ title, value, subtitle, color = 'bg-slate-900 text-white' }: MetricCardProps) {
  return (
    <div className={`rounded-3xl p-6 shadow-sm ${color}`}>
      <p className="text-sm uppercase tracking-[0.3em] text-slate-300">{title}</p>
      <p className="mt-4 text-4xl font-semibold tracking-tight">{value}</p>
      <p className="mt-3 text-sm text-slate-200">{subtitle}</p>
    </div>
  );
}
