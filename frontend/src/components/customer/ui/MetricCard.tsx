import React from "react";

interface MetricCardProps {
  label: string;
  value: string;
  detail?: string;
}

const MetricCard = ({ label, value, detail }: MetricCardProps) => {
  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900 p-5 shadow-xl shadow-slate-900/20">
      <p className="text-xs uppercase tracking-[0.24em] text-slate-500">{label}</p>
      <p className="mt-3 text-3xl font-semibold text-white">{value}</p>
      {detail ? <p className="mt-2 text-sm text-slate-400">{detail}</p> : null}
    </div>
  );
};

export default MetricCard;
