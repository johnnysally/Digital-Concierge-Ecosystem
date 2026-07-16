import React from "react";

interface MetricCardProps {
  label: string;
  value: string | number;
  detail?: string;
  icon?: React.ReactNode;
  className?: string;
}

const MetricCard = ({ label, value, detail, icon, className }: MetricCardProps) => {
  const isDark = className?.includes("bg") ?? false;

  return (
    <div className={`rounded-2xl border p-5 shadow-sm transition-transform transform hover:-translate-y-1 hover:shadow-md ${className ?? ""}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className={`text-[11px] font-semibold uppercase tracking-[0.24em] ${isDark ? "text-slate-300" : "text-slate-500"}`}>{label}</p>
          <p className={`mt-3 text-3xl font-semibold leading-tight ${isDark ? "text-white" : "text-slate-900"}`}>{value}</p>
          {detail ? <p className={`mt-2 text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}>{detail}</p> : null}
        </div>
        {icon ? <div className={`ml-4 inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border text-xl ${isDark ? "border-slate-700 bg-slate-800/90 text-slate-100" : "border-slate-200 bg-gray-50 text-slate-700"}`}>{icon}</div> : null}
      </div>
    </div>
  );
};

export default MetricCard;
