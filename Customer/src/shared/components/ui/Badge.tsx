import type { ReactNode } from 'react';

type BadgeProps = {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'warning';
};

const variants = {
  primary: 'bg-slate-900 text-white',
  secondary: 'bg-slate-100 text-slate-700',
  success: 'bg-emerald-100 text-emerald-800',
  warning: 'bg-amber-100 text-amber-800',
};

export default function Badge({ children, variant = 'primary' }: BadgeProps) {
  return <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${variants[variant]}`}>{children}</span>;
}
