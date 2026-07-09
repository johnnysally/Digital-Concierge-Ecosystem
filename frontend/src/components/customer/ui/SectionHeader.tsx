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
      <div className="flex items-center justify-between gap-4">
        <h2 className={`text-2xl font-semibold ${isDark ? "text-slate-100" : "text-slate-900"}`}>{title}</h2>
      </div>
      {subtitle ? <p className={`text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}>{subtitle}</p> : null}
    </div>
  );
};

export default SectionHeader;
