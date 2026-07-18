import { useEffect, useState } from 'react';
import { getAccommodationAnalytics } from '../../api/accommodation/analyticsApi';
import StatsCharts from '../../components/accommodation/dashboard/StatsCharts';

interface AnalyticsSummary {
    occupancy?: number;
    totalReservations?: number;
    totalProperties?: number;
    statusCounts?: Record<string, number>;
    monthlyRevenue?: Array<{ month: string; revenue: number }>;
}

const AnalyticsPage = () => {
    const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const loadAnalytics = async () => {
            try {
                const response = await getAccommodationAnalytics();
                setAnalytics(response.analytics || null);
            } catch (err: any) {
                setError(err?.response?.data?.message || 'Unable to load analytics');
            } finally {
                setLoading(false);
            }
        };

        loadAnalytics();
    }, []);

    return (
        <div className="space-y-6">
            <div>
                <p className="text-sm font-semibold uppercase tracking-[0.35em] text-emerald-400">Analytics</p>
                <h2 className="mt-2 text-2xl font-semibold text-white">Operational performance overview</h2>
                <p className="mt-2 text-sm text-slate-400">
                    Track occupancy, booking trends, and reservation health using live accommodation data.
                </p>
            </div>

            {error ? <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-300">{error}</div> : null}

            <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-5">
                    <p className="text-sm text-slate-400">Occupancy</p>
                    <p className="mt-2 text-3xl font-semibold text-white">{loading ? '...' : `${analytics?.occupancy ?? 0}%`}</p>
                </div>
                <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-5">
                    <p className="text-sm text-slate-400">Reservations</p>
                    <p className="mt-2 text-3xl font-semibold text-white">{loading ? '...' : analytics?.totalReservations ?? 0}</p>
                </div>
                <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-5">
                    <p className="text-sm text-slate-400">Properties</p>
                    <p className="mt-2 text-3xl font-semibold text-white">{loading ? '...' : analytics?.totalProperties ?? 0}</p>
                </div>
            </div>

            <StatsCharts />

            <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
                <h3 className="text-lg font-semibold text-white">Reservation status breakdown</h3>
                {loading ? (
                    <p className="mt-4 text-sm text-slate-400">Loading reservation breakdown...</p>
                ) : analytics?.statusCounts && Object.keys(analytics.statusCounts).length > 0 ? (
                    <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {Object.entries(analytics.statusCounts).map(([status, count]) => (
                            <div key={status} className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
                                <p className="text-sm text-slate-400">{status}</p>
                                <p className="mt-2 text-2xl font-semibold text-white">{count}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="mt-4 text-sm text-slate-400">No reservation data available yet.</p>
                )}
            </div>
        </div>
    );
};

export default AnalyticsPage;
