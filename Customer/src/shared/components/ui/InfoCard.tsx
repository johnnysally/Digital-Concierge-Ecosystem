type BenefitCardProps = {
  title: string;
  description: string;
  badge?: string;
};

export function BenefitCard({ title, description, badge }: BenefitCardProps) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 transition hover:shadow-lg">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xl font-semibold text-slate-900">{title}</p>
          <p className="mt-3 text-sm leading-6 text-slate-600">{description}</p>
        </div>
        {badge ? (
          <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white">
            {badge}
          </span>
        ) : null}
      </div>
    </div>
  );
}
