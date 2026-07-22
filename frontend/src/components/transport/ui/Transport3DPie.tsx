import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

type Slice = { name: string; value: number };

const defaultColors = ['#16a34a', '#14b8a6', '#38bdf8', '#7c3aed', '#f97316'];

const Transport3DPie = ({ data, colors = defaultColors, height = '100%' }: { data: Slice[]; colors?: string[]; height?: number | string }) => {
    const displayData = data && data.some((item) => item.value > 0) ? data : [{ name: 'No data', value: 1 }];
    const total = displayData.reduce((s, d) => s + d.value, 0) || 1;
    const chartColors = displayData.length === 1 ? ['#22c55e'] : colors;

    const renderLabel = ({ cx, cy, midAngle, outerRadius, percent, index }: any) => {
        const entry = displayData[index];
        const percentText = `${Math.round(percent * 100)}%`;

        if (displayData.length === 1) {
            return (
                <text x={cx} y={cy} fill="#ffffff" textAnchor="middle" dominantBaseline="central" fontSize={14} fontWeight={800}>
                    {`${entry.name} ${percentText}`}
                </text>
            );
        }

        const RADIAN = Math.PI / 180;
        const radius = outerRadius + 34;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);
        const textAnchor = x > cx ? 'start' : 'end';

        const lineStartX = cx + (outerRadius - 4) * Math.cos(-midAngle * RADIAN);
        const lineStartY = cy + (outerRadius - 4) * Math.sin(-midAngle * RADIAN);

        return (
            <g>
                <polyline
                    points={`${lineStartX},${lineStartY} ${x},${y}`}
                    fill="none"
                    stroke="#ffffff"
                    strokeWidth={1.4}
                />
                <text x={x} y={y} fill="#ffffff" textAnchor={textAnchor} dominantBaseline="central" fontSize={12} fontWeight={700}>
                    {`${entry.name} ${percentText}`}
                </text>
            </g>
        );
    };

    return (
        <div style={{ width: '100%', height, minHeight: 320, backgroundColor: '#0f172a' }} className="relative rounded-3xl p-3 shadow-xl shadow-black/20">
            <div className="absolute left-4 top-4 text-xs uppercase tracking-[0.24em] text-slate-300">Distribution</div>
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <defs>
                        {chartColors.map((c, i) => (
                            <linearGradient key={i} id={`g-${i}`} x1="0" x2="0" y1="0" y2="1">
                                <stop offset="0%" stopColor={c} stopOpacity={0.98} />
                                <stop offset="100%" stopColor={c} stopOpacity={0.7} />
                            </linearGradient>
                        ))}
                    </defs>

                    <Pie
                        data={displayData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius="25%"
                        outerRadius="65%"
                        paddingAngle={4}
                        stroke="#0f172a"
                        strokeWidth={3}
                        isAnimationActive={false}
                        labelLine={false}
                        label={renderLabel}
                    >
                        {displayData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={`url(#g-${index % chartColors.length})`} />
                        ))}
                    </Pie>

                    <Tooltip formatter={(value: any) => [`${value}`, `${Math.round((value / total) * 100)}%`]} cursor={false} contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#f8fafc' }} itemStyle={{ color: '#f8fafc' }} />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};

export default Transport3DPie;
