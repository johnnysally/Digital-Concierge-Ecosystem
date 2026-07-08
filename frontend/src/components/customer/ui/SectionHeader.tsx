import React from "react";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
}

const SectionHeader = ({ title, subtitle }: SectionHeaderProps) => {
  return (
    <div className="mb-6 flex flex-col gap-2">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-2xl font-semibold text-white">{title}</h2>
      </div>
      {subtitle ? <p className="text-sm text-slate-400">{subtitle}</p> : null}
    </div>
  );
};

export default SectionHeader;
