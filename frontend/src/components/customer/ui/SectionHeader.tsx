import React from "react";
import { useTheme } from "../../../context/customer/ThemeContext";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
}

const SectionHeader = ({ title, subtitle }: SectionHeaderProps) => {
  const { isDark } = useTheme();

  return (
    <div className="mb-6 flex flex-col gap-2">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <h2 className={`text-2xl font-bold tracking-tight sm:text-3xl ${isDark ? "text-slate-100" : "text-slate-900"}`}>{title}</h2>
      </div>
      {subtitle ? <p className={`text-sm leading-6 ${isDark ? "text-slate-400" : "text-slate-600"}`}>{subtitle}</p> : null}
    </div>
  );
};

export default SectionHeader;
