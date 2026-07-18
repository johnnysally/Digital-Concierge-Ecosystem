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

const COLORS = ['#059669', '#F59E0B', '#EF4444', '#64748B', '#0EA5E9', '#8B5CF6'];

const StatsCharts: React.FC = () => {
    const [pieData, setPieData] = useState<any[]>([]);
    const [barData, setBarData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [occupancy, setOccupancy] = useState(0);

    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true);
                const res = await getAccommodationAnalytics();
                const analytics = res.analytics || {};

                const statusCounts = analytics.statusCounts || {};
                const pie = Object.entries(statusCounts).map(([name, value]) => ({ name, value: Number(value) || 0 }));

                const bar = (analytics.monthlyRevenue || []).map((item: any) => ({
                    month: item.month,
                    revenue: Number(item.revenue) || 0,
                }));

                setPieData(pie.length ? pie : [{ name: 'No data', value: 1 }]);
                setBarData(bar.length ? bar : [{ month: 'No data', revenue: 0 }]);
                setOccupancy(Number(analytics.occupancy) || 0);
            } catch (err) {
                setPieData([{ name: 'No data', value: 1 }]);
                setBarData([{ month: 'No data', revenue: 0 }]);
                setOccupancy(0);
            } finally {
                setLoading(false);
            }
        };

        load();
    }, []);

    return (
        <div className="space-y-6">
            <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-4">
                <div className="mb-4 flex items-center justify-between">
                    <h4 className="text-sm font-semibold text-white">Performance snapshot</h4>
                    <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-sm font-medium text-emerald-300">
                        Occupancy {occupancy}%
                    </span>
                </div>
                <div className="grid gap-6 lg:grid-cols-3">
                    <div className="col-span-2 rounded-3xl border border-slate-800 bg-slate-950/60 p-4">
                        <h4 className="text-sm font-semibold text-white">Monthly revenue</h4>
                        <div style={{ width: '100%', height: 260 }}>
                            {loading ? (
                                <div className="flex h-full items-center justify-center text-sm text-slate-400">Loading analytics…</div>
                            ) : (
                                <ResponsiveContainer>
                                    <BarChart data={barData} margin={{ top: 20, right: 10, left: -10, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#0f172a33" />
                                        <XAxis dataKey="month" stroke="#94a3b8" />
                                        <YAxis stroke="#94a3b8" />
                                        <Tooltip />
                                        <Bar dataKey="revenue" fill="#06b6d4" radius={[6, 6, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            )}
                        </div>
                    </div>

                    <div className="rounded-3xl border border-slate-800 bg-slate-950/60 p-4">
                        <h4 className="text-sm font-semibold text-white">Reservation status</h4>
                        <div style={{ width: '100%', height: 260 }}>
                            {loading ? (
                                <div className="flex h-full items-center justify-center text-sm text-slate-400">Loading analytics…</div>
                            ) : (
                                <ResponsiveContainer>
                                    <PieChart>
                                        <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={50} outerRadius={90} paddingAngle={3}>
                                            {pieData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                        <Legend verticalAlign="bottom" wrapperStyle={{ color: '#94a3b8' }} />
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
