type SectionHeaderProps = {
  title: string;
  description?: string;
  actionLabel?: string;
  actionLink?: string;
};

export default function SectionHeader({ title, description, actionLabel, actionLink }: SectionHeaderProps) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h3 className="text-xl font-semibold text-slate-900">{title}</h3>
        {description ? <p className="mt-2 text-sm text-slate-500">{description}</p> : null}
      </div>
      {actionLabel && actionLink ? (
        <a href={actionLink} className="inline-flex items-center rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700">
          {actionLabel}
        </a>
      ) : null}
    </div>
  );
}
