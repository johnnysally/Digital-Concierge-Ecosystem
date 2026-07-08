import React from "react";

interface ActionTileProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
}

const ActionTile = ({ title, description, icon }: ActionTileProps) => {
  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900 p-5 text-slate-100 shadow-xl shadow-slate-900/20">
      <div className="flex items-center gap-3">
        {icon && <div className="text-sky-400">{icon}</div>}
        <div>
          <p className="font-semibold text-white">{title}</p>
          <p className="mt-1 text-sm text-slate-400">{description}</p>
        </div>
      </div>
    </div>
  );
};

export default ActionTile;
