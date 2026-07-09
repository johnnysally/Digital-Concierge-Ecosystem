import React, { useMemo } from "react";

interface Slice {
  label: string;
  value: number;
  color?: string;
}

interface Pie3DCardProps {
  title?: string;
  slices?: Slice[];
  theme?: "light" | "dark";
}

function polarToCartesian(cx: number, cy: number, r: number, angleInDegrees: number) {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
  return { x: cx + r * Math.cos(angleInRadians), y: cy + r * Math.sin(angleInRadians) };
}

function describeArc(cx: number, cy: number, r: number, startAngle: number, endAngle: number) {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArcFlag} 0 ${end.x} ${end.y} L ${cx} ${cy} Z`;
}

const Pie3DCard: React.FC<Pie3DCardProps> = ({ title = "Activity Breakdown", slices, theme = "light" }) => {
  const isDark = theme === "dark";
  const data = useMemo<Slice[]>(() => {
    if (slices && slices.length) return slices;
    return [
      { label: "Bookings", value: 45, color: "#f97316" },
      { label: "Orders", value: 25, color: "#f43f5e" },
      { label: "Rides", value: 20, color: "#34d399" },
      { label: "Messages", value: 10, color: "#60a5fa" },
    ];
  }, [slices]);

  const total = data.reduce((s, d) => s + d.value, 0);
  let angle = 0;

  const cx = 120;
  const cy = 80;
  const r = 64;
  const depth = 12; // vertical offset for 3D effect
  const chartSize = 300;

  const parts = data.map((s) => {
    const start = angle;
    const portion = (s.value / total) * 360;
    angle += portion;
    const end = angle;
    return { slice: s, start, end };
  });

  return (
    <div className={`flex h-full min-h-[320px] flex-col overflow-visible rounded-xl border p-4 ${isDark ? "border-slate-800 bg-slate-950/80" : "border-slate-200/70 bg-white/90"}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className={`text-sm font-medium ${isDark ? "text-slate-100" : "text-slate-900"}`}>{title}</p>
          <p className={`mt-1 text-xs ${isDark ? "text-slate-400" : "text-slate-600"}`}>Customer activity</p>
        </div>
        <div className="text-right">
          <p className={`text-lg font-semibold ${isDark ? "text-slate-100" : "text-slate-900"}`}>{total}</p>
          <p className="text-xs text-slate-500">Total actions</p>
        </div>
      </div>

      <div className="mt-3 flex flex-1 flex-col gap-4 lg:flex-row lg:items-center">
        <div className="flex w-full items-center justify-center lg:w-[300px] lg:flex-shrink-0">
          <svg viewBox={`0 0 ${cx * 2} ${cy + depth + 70}`} className="h-auto w-full max-w-[260px] sm:max-w-[300px]" preserveAspectRatio="xMidYMid meet" style={{ maxHeight: `${chartSize}px` }}>
          <defs>
            <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#000" floodOpacity="0.08" />
            </filter>
          </defs>

          {/* bottom layer (depth) */}
          <g transform={`translate(0, ${depth + 6})`} filter="url(#shadow)">
            {parts.map((p, i) => (
              <path key={`b-${i}`} d={describeArc(cx, cy, r, p.start, p.end)} fill={p.slice.color || "#ddd"} opacity={0.6} />
            ))}
          </g>

          {/* top layer */}
          <g>
            {parts.map((p, i) => (
              <path key={`t-${i}`} d={describeArc(cx, cy, r, p.start, p.end)} fill={p.slice.color || "#ddd"} style={{ transition: "transform 0.7s cubic-bezier(.2,.9,.2,1)", transformOrigin: `${cx}px ${cy}px` }} />
            ))}

            {/* inner hole to make donut */}
            <circle cx={cx} cy={cy + 6} r={r * 0.5} fill={isDark ? "#0f172a" : "#fff"} />
          </g>
        </svg>

        </div>

        <div className="w-full flex-1 min-w-0">
          <ul className="space-y-2 text-sm">
            {data.map((d, i) => (
              <li key={d.label} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span style={{ background: d.color }} className="inline-block h-3 w-3 rounded-full" />
                  <span className={isDark ? "text-slate-300" : "text-slate-700"}>{d.label}</span>
                </div>
                <div className={`font-semibold ${isDark ? "text-slate-100" : "text-slate-900"}`}>{Math.round((d.value / total) * 100)}%</div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <style>{`
        @keyframes popIn {
          from { transform: scale(0.96); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .pie-pop { animation: popIn 400ms cubic-bezier(.2,.9,.2,1) both; }
      `}</style>
    </div>
  );
};

export default Pie3DCard;
