import React, { useEffect, useState } from 'react';
import {
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
} from 'recharts';
import { getAccommodationAnalytics } from '../../../api/accommodation/analyticsApi';
import { useAccommodationTheme } from '../../../context/accommodation/ThemeContext';

const DEFAULT_COLORS = ['#059669', '#F59E0B', '#EF4444', '#64748B', '#0EA5E9', '#8B5CF6'];

const StatsCharts: React.FC = () => {
    const { accentColor, secondaryColor, isDark, themePreset } = useAccommodationTheme();
    const [pieData, setPieData] = useState<any[]>([]);
    const [barData, setBarData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [occupancy, setOccupancy] = useState(0);
    const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' ? window.innerWidth < 640 : false);

    const metricSeries = React.useMemo(() => {
        const visible = [
            { key: 'revenue', label: 'Revenue', color: accentColor },
            { key: 'reservations', label: 'Reservations', color: secondaryColor },
            { key: 'properties', label: 'Properties', color: '#38bdf8' },
            { key: 'occupancy', label: 'Occupancy', color: '#f59e0b' },
        ].filter((series) => barData.some((item) => Number(item[series.key]) > 0));

        return visible.length ? visible : [{ key: 'revenue', label: 'Revenue', color: accentColor }];
    }, [accentColor, barData, secondaryColor]);

    const chartColors = React.useMemo(() => {
        return [accentColor, secondaryColor, '#38bdf8', '#a78bfa', '#f59e0b', '#fb7185'];
    }, [accentColor, secondaryColor]);

    const chartTheme = React.useMemo(() => ({
        grid: isDark ? '#334155' : '#cbd5e1',
        axis: isDark ? '#cbd5e1' : '#475569',
        surface: isDark ? '#020617' : '#f8fafc',
        text: isDark ? '#f8fafc' : '#0f172a',
        cardBorder: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(15, 23, 42, 0.08)',
        badge: `${accentColor}16`,
    }), [accentColor, isDark]);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 640);
        };

        handleResize();
        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true);
                const res = await getAccommodationAnalytics();
                const analytics = res.analytics || {};

                const statusCounts = analytics.statusCounts || {};
                const pie = Object.entries(statusCounts).map(([name, value]) => ({ name, value: Number(value) || 0 }));

                const monthlyMetrics = analytics.monthlyMetrics || analytics.monthlyRevenue || [];
                const bar = monthlyMetrics.map((item: any) => ({
                    month: item.month,
                    revenue: Number(item.revenue) || 0,
                    reservations: Number(item.reservations) || 0,
                    properties: Number(item.properties) || 0,
                    occupancy: Number(item.occupancy) || 0,
                }));

                setPieData(pie.length ? pie : [{ name: 'No data', value: 1 }]);
                setBarData(bar.length ? bar : [{ month: 'No data', revenue: 0, reservations: 0, properties: 0, occupancy: 0 }]);
                setOccupancy(Number(analytics.occupancy) || 0);
            } catch (err) {
                setPieData([{ name: 'No data', value: 1 }]);
                setBarData([{ month: 'No data', revenue: 0, reservations: 0, properties: 0, occupancy: 0 }]);
                setOccupancy(0);
            } finally {
                setLoading(false);
            }
        };

        load();
    }, []);

    const chartHeight = isMobile ? 220 : 260;
    const pieInnerRadius = isMobile ? 34 : 50;
    const pieOuterRadius = isMobile ? 64 : 90;

    return (
        <div className="space-y-6">
            <div
                className={`rounded-3xl border p-4 shadow-sm ${isDark ? 'border-slate-800 bg-slate-900/70' : 'border-slate-200 bg-white/90'}`}
                style={{ borderColor: chartTheme.cardBorder }}
            >
                <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <h4 className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>Performance snapshot</h4>
                    <span className="rounded-full px-3 py-1 text-sm font-medium" style={{ backgroundColor: chartTheme.badge, color: accentColor }}>
                        Occupancy {occupancy}%
                    </span>
                </div>
                <div className="grid gap-4 lg:grid-cols-3 lg:gap-6">
                    <div className={`col-span-2 rounded-3xl border p-3 sm:p-4 ${isDark ? 'border-slate-800 bg-slate-950/60' : 'border-slate-200 bg-slate-50'}`}>
                        <h4 className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>Portal activity overview</h4>
                        <div className="mt-2 h-[220px] w-full sm:h-[260px]">
                            {loading ? (
                                <div className={`flex h-full items-center justify-center text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Loading analytics…</div>
                            ) : (
                                <ResponsiveContainer>
                                    <BarChart data={barData} margin={{ top: 10, right: 8, left: isMobile ? -12 : -10, bottom: 4 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.grid} />
                                        <XAxis dataKey="month" stroke={chartTheme.axis} tick={{ fontSize: isMobile ? 10 : 12 }} minTickGap={isMobile ? 8 : 0} />
                                        <YAxis stroke={chartTheme.axis} tick={{ fontSize: isMobile ? 10 : 12 }} width={isMobile ? 32 : 40} />
                                        <Tooltip
                                            cursor={{ fill: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(15,23,42,0.04)' }}
                                            contentStyle={{
                                                backgroundColor: chartTheme.surface,
                                                border: `1px solid ${accentColor}33`,
                                                color: chartTheme.text,
                                            }}
                                        />
                                        {metricSeries.map((series) => (
                                            <Bar key={series.key} dataKey={series.key} name={series.label} fill={series.color} radius={[6, 6, 0, 0]} />
                                        ))}
                                    </BarChart>
                                </ResponsiveContainer>
                            )}
                        </div>
                    </div>

                    <div className={`rounded-3xl border p-3 sm:p-4 ${isDark ? 'border-slate-800 bg-slate-950/60' : 'border-slate-200 bg-slate-50'}`}>
                        <h4 className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>Reservation status</h4>
                        <div className="mt-2 h-[220px] w-full sm:h-[260px]">
                            {loading ? (
                                <div className={`flex h-full items-center justify-center text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Loading analytics…</div>
                            ) : (
                                <ResponsiveContainer>
                                    <PieChart>
                                        <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={pieInnerRadius} outerRadius={pieOuterRadius} paddingAngle={3}>
                                            {pieData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: chartTheme.surface,
                                                border: `1px solid ${accentColor}33`,
                                                color: chartTheme.text,
                                            }}
                                        />
                                        <Legend
                                            verticalAlign="bottom"
                                            layout={isMobile ? 'horizontal' : 'vertical'}
                                            wrapperStyle={{
                                                color: chartTheme.axis,
                                                fontSize: isMobile ? '11px' : '12px',
                                                paddingTop: isMobile ? '4px' : '8px',
                                            }}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StatsCharts;
