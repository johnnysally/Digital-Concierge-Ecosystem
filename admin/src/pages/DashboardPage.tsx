import { DashboardProvider, useDashboard } from '../context/DashboardContext';
import SectionHeader from '../components/ui/SectionHeader';
import MetricCard from '../components/ui/MetricCard';
import RevenueChart from '../components/features/RevenueChart';
import DisputeList from '../components/features/DisputeList';
import PlatformHealth from '../components/features/PlatformHealth';
import { formatCurrency } from '../utils/formatCurrency';

const DashboardContent = () => {
    const { stats, loading } = useDashboard();

    return (
        <div className="space-y-8">
            <SectionHeader title="Dashboard" subtitle="Platform overview and key metrics" />
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <MetricCard label="Total Partners" value={stats.totalPartners} trend="All types" icon="🏨" />
                <MetricCard label="Total Customers" value={stats.totalCustomers} trend="Active users" icon="👥" />
                <MetricCard label="Total Bookings" value={stats.totalBookings} trend="All time" icon="📋" />
                <MetricCard label="Total Revenue" value={formatCurrency(stats.totalRevenue)} trend="Completed payments" icon="💰" />
            </div>
            <div className="grid gap-6 xl:grid-cols-2">
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Revenue Trend</h2>
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs uppercase tracking-[0.18em] text-slate-500 dark:bg-slate-800 dark:text-slate-300">Live</span>
                    </div>
                    <div className="mt-6">
                        <RevenueChart />
                    </div>
                </div>
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Recent Disputes</h2>
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs uppercase tracking-[0.18em] text-slate-500 dark:bg-slate-800 dark:text-slate-300">Latest</span>
                    </div>
                    <div className="mt-6">
                        <DisputeList />
                    </div>
                </div>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Platform Health</h2>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs uppercase tracking-[0.18em] text-slate-500 dark:bg-slate-800 dark:text-slate-300">Status</span>
                </div>
                <div className="mt-6">
                    <PlatformHealth />
                </div>
            </div>
        </div>
    );
};

const DashboardPage = () => (
    <DashboardProvider>
        <DashboardContent />
    </DashboardProvider>
);

export default DashboardPage;