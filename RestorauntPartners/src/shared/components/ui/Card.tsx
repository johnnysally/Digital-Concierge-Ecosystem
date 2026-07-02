import { ReactNode } from 'react';

interface CardProps {
  title?: string;
  children: ReactNode;
  className?: string;
}

export default function Card({ title, children, className = '' }: CardProps) {
  return (
    <section className={`rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 ${className}`}>
      {title ? <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-50">{title}</h2> : null}
      <div className="mt-4">{children}</div>
    </section>
  );
}
