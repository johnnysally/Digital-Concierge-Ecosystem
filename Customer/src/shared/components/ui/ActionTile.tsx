import type { ReactNode } from 'react';

type ActionTileProps = {
  title: string;
  description: string;
  icon: ReactNode;
  href: string;
};

export default function ActionTile({ title, description, icon, href }: ActionTileProps) {
  return (
    <a href={href} className="group block rounded-3xl border border-slate-200 bg-white p-6 transition hover:-translate-y-1 hover:border-slate-300 hover:shadow-lg">
      <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-900 transition group-hover:bg-slate-900 group-hover:text-white">
        {icon}
      </div>
      <h4 className="mt-5 text-lg font-semibold text-slate-900">{title}</h4>
      <p className="mt-2 text-sm leading-6 text-slate-500">{description}</p>
    </a>
  );
}
