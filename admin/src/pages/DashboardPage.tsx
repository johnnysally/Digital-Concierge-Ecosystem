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
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <MetricCard label="Total Partners" value={stats.totalPartners} trend="All types" icon="🏨" />
                <MetricCard label="Total Customers" value={stats.totalCustomers} trend="Active users" icon="👥" />
                <MetricCard label="Total Bookings" value={stats.totalBookings} trend="All time" icon="📋" />
                <MetricCard label="Total Revenue" value={formatCurrency(stats.totalRevenue)} trend="Completed payments" icon="💰" />
            </div>
            <div className="grid gap-6 lg:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
                    <h2 className="text-lg font-semibold mb-4">Revenue Trend</h2>
                    <RevenueChart />
                </div>
                <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
                    <h2 className="text-lg font-semibold mb-4">Recent Disputes</h2>
                    <DisputeList />
                </div>
            </div>
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
                <h2 className="text-lg font-semibold mb-4">Platform Health</h2>
                <PlatformHealth />
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