import { useDashboardStats } from '../../hooks/useReports';
import StatsCard from '../ui/StatsCard';

const PlatformHealth = () => {
    const { stats, loading } = useDashboardStats();

    if (loading) return <div className="p-4 text-slate-400">Loading...</div>;
    if (!stats) return null;

    return (
        <div className="grid gap-3 sm:grid-cols-2">
            <StatsCard title="Properties" value={stats.totalProperties} />
            <StatsCard title="Bookings" value={stats.totalBookings} />
            <StatsCard title="Partners" value={stats.totalPartners} />
            <StatsCard title="Customers" value={stats.totalCustomers} />
        </div>
    );
};

export default PlatformHealth;