import { useState, useEffect } from 'react';
import SectionHeader from '../components/ui/SectionHeader';
import RevenueChart from '../components/features/RevenueChart';
import PlatformHealth from '../components/features/PlatformHealth';
import MetricCard from '../components/ui/MetricCard';
import { api } from '../api/axios';
import { formatCurrency } from '../utils/formatCurrency';

const ReportsPage = () => {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/admin/reports/dashboard')
            .then((res) => setStats(res.data.stats))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return (
        <div className="space-y-6">
            <SectionHeader title="Reports" subtitle="Platform analytics and insights" />
            <div className="text-slate-400">Loading reports...</div>
        </div>
    );

    return (
        <div className="space-y-8">
            <SectionHeader title="Reports" subtitle="Platform analytics, revenue trends, and performance insights" />

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
                <MetricCard label="Total Partners" value={stats?.totalPartners || 0} icon="🏨" />
                <MetricCard label="Total Customers" value={stats?.totalCustomers || 0} icon="👥" />
                <MetricCard label="Properties" value={stats?.totalProperties || 0} icon="🏘️" />
                <MetricCard label="Bookings" value={stats?.totalBookings || 0} icon="📋" />
                <MetricCard label="Revenue" value={formatCurrency(stats?.totalRevenue || 0)} icon="💰" />
            </div>

            <div className="grid gap-6 xl:grid-cols-2">
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Revenue Trend</h2>
                            <p className="text-sm text-slate-500">Daily revenue over the last 7 days</p>
                        </div>
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs uppercase tracking-[0.18em] text-slate-500 dark:bg-slate-800 dark:text-slate-300">Trend</span>
                    </div>
                    <div className="mt-6">
                        <RevenueChart />
                    </div>
                </div>
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Platform Overview</h2>
                            <p className="text-sm text-slate-500">System-wide metrics</p>
                        </div>
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs uppercase tracking-[0.18em] text-slate-500 dark:bg-slate-800 dark:text-slate-300">Overview</span>
                    </div>
                    <div className="mt-6">
                        <PlatformHealth />
                    </div>
                </div>
            </div>

            <div className="grid gap-6 xl:grid-cols-3">
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <h2 className="text-lg font-semibold mb-4 text-slate-900 dark:text-white">📊 Quick Stats</h2>
                    <div className="space-y-3 text-sm">
                        <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                            <span className="text-slate-500">Total Revenue</span>
                            <span className="font-semibold">{formatCurrency(stats?.totalRevenue || 0)}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                            <span className="text-slate-500">Total Bookings</span>
                            <span className="font-semibold">{stats?.totalBookings || 0}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                            <span className="text-slate-500">Avg. per Booking</span>
                            <span className="font-semibold">{stats?.totalBookings > 0 ? formatCurrency((stats?.totalRevenue || 0) / stats?.totalBookings) : 'N/A'}</span>
                        </div>
                        <div className="flex justify-between py-2">
                            <span className="text-slate-500">Properties</span>
                            <span className="font-semibold">{stats?.totalProperties || 0}</span>
                        </div>
                    </div>
                </div>

                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <h2 className="text-lg font-semibold mb-4 text-slate-900 dark:text-white">👥 User Growth</h2>
                    <div className="space-y-3 text-sm">
                        <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                            <span className="text-slate-500">Total Customers</span>
                            <span className="font-semibold">{stats?.totalCustomers || 0}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                            <span className="text-slate-500">Total Partners</span>
                            <span className="font-semibold">{stats?.totalPartners || 0}</span>
                        </div>
                        <div className="flex justify-between py-2">
                            <span className="text-slate-500">Ratio</span>
                            <span className="font-semibold">{stats?.totalPartners > 0 ? `${(stats?.totalCustomers / stats?.totalPartners).toFixed(1)}:1` : 'N/A'}</span>
                        </div>
                    </div>
                </div>

                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <h2 className="text-lg font-semibold mb-4 text-slate-900 dark:text-white">📈 Export Reports</h2>
                    <p className="text-sm text-slate-500 mb-4">Download detailed reports for your records.</p>
                    <div className="space-y-2">
                        <button className="w-full rounded-xl bg-slate-100 dark:bg-slate-800 px-4 py-3 text-sm font-medium hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                            📄 Revenue Report (CSV)
                        </button>
                        <button className="w-full rounded-xl bg-slate-100 dark:bg-slate-800 px-4 py-3 text-sm font-medium hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                            👥 Customer Report (CSV)
                        </button>
                        <button className="w-full rounded-xl bg-slate-100 dark:bg-slate-800 px-4 py-3 text-sm font-medium hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                            🏨 Partner Report (CSV)
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReportsPage;