import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LabelList } from 'recharts';

interface Slice {
    name: string;
    value: number;
}

const defaultColors = ['#ef4444', '#f97316', '#facc15', '#22c55e', '#3b82f6'];

const render3DBar = ({ x, y, width, height, fill }: any) => {
    const depth = 16;
    const color = fill || '#ef4444';
    const topColor = 'rgba(255,255,255,0.25)';
    const rightColor = 'rgba(15,23,42,0.26)';

    return (
        <g>
            <path
                d={`M${x},${y} L${x + depth},${y - depth} L${x + width + depth},${y - depth} L${x + width},${y} Z`}
                fill={topColor}
            />
            <path
                d={`M${x + width},${y} L${x + width + depth},${y - depth} L${x + width + depth},${y + height - depth} L${x + width},${y + height} Z`}
                fill={rightColor}
            />
            <rect x={x} y={y} width={width} height={height} rx={10} fill={color} />
            <path d={`M${x + depth},${y - depth} L${x + width + depth},${y - depth} L${x + width},${y} L${x},${y} Z`} fill={topColor} />
        </g>
    );
};

const Transport3DBar: React.FC<{ data: Slice[]; height?: number | string; colors?: string[] }> = ({ data, height = '100%', colors = defaultColors }) => {
    const displayData = data && data.some((item) => item.value > 0) ? [...data].sort((a, b) => a.value - b.value) : [{ name: 'No data', value: 1 }];
    const hasNoData = displayData.length === 1 && displayData[0].name.toLowerCase().includes('no data');
    const fillColors = hasNoData ? ['#22c55e'] : colors;

    return (
        <div style={{ width: '100%', height, minHeight: 240, backgroundColor: '#0f172a' }} className="relative rounded-3xl p-4 shadow-xl shadow-black/10">
            <div className="absolute left-4 top-4 text-xs uppercase tracking-[0.24em] text-slate-300">Wallet growth</div>
            <div className="absolute right-4 top-4 text-xs uppercase tracking-[0.24em] text-slate-300">3D trend</div>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={displayData} margin={{ top: 32, right: 16, left: 0, bottom: 18 }} barGap={18} maxBarSize={50}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#cbd5e1', fontSize: 12 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#cbd5e1', fontSize: 12 }} width={34} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#f8fafc' }} itemStyle={{ color: '#f8fafc' }} formatter={(value: any) => [value, 'Total']} />
                    <Bar dataKey="value" shape={render3DBar} radius={[12, 12, 0, 0]}>
                        {displayData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                        ))}
                        <LabelList dataKey="value" position="top" fill="#f8fafc" fontSize={12} fontWeight={700} />
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default Transport3DBar;
