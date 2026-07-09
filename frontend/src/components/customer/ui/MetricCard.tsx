import React from "react";

interface MetricCardProps {
  label: string;
  value: string;
  detail?: string;
  icon?: React.ReactNode;
  className?: string;
}

const MetricCard = ({ label, value, detail, icon, className }: MetricCardProps) => {
  const isDark = className?.includes("bg-slate-900") ?? false;

  return (
    <div className={`rounded-2xl border p-5 shadow-sm transition-transform transform hover:-translate-y-1 hover:shadow-md ${className ?? ""}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className={`text-xs uppercase tracking-[0.24em] ${isDark ? "text-slate-400" : "text-slate-500"}`}>{label}</p>
          <p className={`mt-3 text-3xl font-semibold ${isDark ? "text-slate-100" : "text-slate-900"}`}>{value}</p>
          {detail ? <p className={`mt-2 text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}>{detail}</p> : null}
        </div>
        {icon ? <div className={`ml-4 inline-flex h-12 w-12 items-center justify-center rounded-lg text-xl ${isDark ? "bg-slate-800 text-slate-200" : "bg-gray-50 text-slate-700"}`}>{icon}</div> : null}
      </div>
    </div>
  );
};

export default MetricCard;
