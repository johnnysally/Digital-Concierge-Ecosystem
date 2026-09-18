import React from "react";

interface MetricCardProps {
  label: string;
  value: string | number;
  detail?: string;
  icon?: React.ReactNode;
  className?: string;
  isDark?: boolean;
}

const MetricCard = ({ label, value, detail, icon, className, isDark = false }: MetricCardProps) => {
  return (
    <div className={`group relative overflow-hidden rounded-[22px] border p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${className ?? ""}`}>
      <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${isDark ? 'from-sky-400/80 via-cyan-300/40 to-transparent' : 'from-sky-500 via-cyan-400 to-transparent'} opacity-70`} />
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className={`text-[11px] font-semibold uppercase tracking-[0.24em] ${isDark ? "text-slate-300" : "text-slate-500"}`}>{label}</p>
          <p className={`mt-3 text-3xl font-semibold leading-tight ${isDark ? "text-white" : "text-slate-900"}`}>{value}</p>
          {detail ? <p className={`mt-2 text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}>{detail}</p> : null}
        </div>
        {icon ? <div className={`ml-4 inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border text-xl shadow-sm transition-transform duration-300 group-hover:scale-110 ${isDark ? "border-slate-700 bg-slate-800/90 text-slate-100" : "border-white bg-white/90 text-slate-700"}`}>{icon}</div> : null}
      </div>
    </div>
  );
};

export default MetricCard;
