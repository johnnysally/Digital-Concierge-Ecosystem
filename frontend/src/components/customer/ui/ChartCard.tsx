import React, { useMemo } from "react";

interface ChartCardProps {
  title?: string;
  data?: number[];
  theme?: "light" | "dark";
}

const ChartCard: React.FC<ChartCardProps> = ({ title = "Activity", data, theme = "light" }) => {
  const isDark = theme === "dark";
  const points = useMemo(() => {
    const size = data && data.length > 1 ? data.length : 12;
    const base = data && data.length >= size ? data : Array.from({ length: size }, (_, i) => Math.round(50 + Math.sin(i / 2) * 30 + Math.random() * 10));
    const min = Math.min(...base);
    const max = Math.max(...base);
    const w = 600;
    const h = 120;
    const stepX = w / (base.length - 1);
    const scaleY = (v: number) => h - ((v - min) / (max - min || 1)) * (h - 20) - 10;
    const coords = base.map((v, i) => ({ x: Math.round(i * stepX), y: Math.round(scaleY(v)), v }));
    const path = coords.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");
    const area = `${path} L ${w},${h} L 0,${h} Z`;
    return { coords, path, area, min, max, w, h };
  }, [data]);

  const latest = points.coords[points.coords.length - 1];

  return (
    <div className={`flex h-full flex-col rounded-xl border p-4 ${isDark ? "border-slate-800 bg-slate-950/80" : "border-slate-200/70 bg-white/90"}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className={`text-sm font-medium ${isDark ? "text-slate-100" : "text-slate-900"}`}>{title}</p>
          <p className={`mt-1 text-xs ${isDark ? "text-slate-400" : "text-slate-600"}`}>Last 30 days</p>
        </div>
        <div className="text-right">
          <p className={`text-lg font-semibold ${isDark ? "text-slate-100" : "text-slate-900"}`}>{latest ? latest.v : "—"}</p>
          <p className="text-xs text-slate-500">Activity score</p>
        </div>
      </div>

      <div className="mt-3 min-h-0 flex-1">
        <div className={`h-full w-full overflow-hidden rounded-md ${isDark ? "bg-slate-900/80" : "bg-white"}`}>
          <svg viewBox={`0 0 ${points.w} ${points.h}`} className="w-full h-full" preserveAspectRatio="none">
            <defs>
              <linearGradient id="areaGrad" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#fef3c7" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#fef3c7" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="lineGrad" x1="0" x2="1">
                <stop offset="0%" stopColor="#f97316" />
                <stop offset="100%" stopColor="#f43f5e" />
              </linearGradient>
            </defs>

            <path d={points.area} fill="url(#areaGrad)" />

            <path
              d={points.path}
              fill="none"
              stroke="url(#lineGrad)"
              strokeWidth={3}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-draw"
            />

            {points.coords.map((c, i) => (
              <circle key={i} cx={c.x} cy={c.y} r={i === points.coords.length - 1 ? 4 : 2} fill={i === points.coords.length - 1 ? "#f97316" : "#fb923c"}>
                <title>{`${c.v}`}</title>
              </circle>
            ))}
          </svg>
        </div>
      </div>

      <style>{`
        @keyframes drawLine {
          from { stroke-dashoffset: 1000; }
          to { stroke-dashoffset: 0; }
        }
        .animate-draw {
          stroke-dasharray: 1000;
          stroke-dashoffset: 1000;
          animation: drawLine 1.6s cubic-bezier(.2,.9,.2,1) forwards;
        }
      `}</style>
    </div>
  );
};

export default ChartCard;
