import React from "react";

interface BadgeProps {
  label: string;
  variant?: "primary" | "secondary" | "success";
}

const variantClasses = {
  primary: "bg-sky-600 text-white",
  secondary: "bg-slate-700 text-slate-200",
  success: "bg-emerald-500 text-slate-950",
};

const Badge = ({ label, variant = "primary" }: BadgeProps) => {
  return <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${variantClasses[variant]}`}>{label}</span>;
};

export default Badge;
