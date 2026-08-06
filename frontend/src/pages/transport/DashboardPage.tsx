import { useEffect, useState } from 'react';
import { getRides } from '../../api/transport/rideApi';
import { getVehicles } from '../../api/transport/vehicleApi';
import { getDrivers } from '../../api/transport/driverApi';
import { formatCurrency } from '../../utils/formatCurrency';

const getStoredTransportSession = () => {
    try {
        const stored = localStorage.getItem('digitalsafaris_transport');
        return stored ? JSON.parse(stored) : null;
    } catch { return null; }
};

const DashboardPage = () => {
    const session = getStoredTransportSession();
    const isShuttle = session?.user?.businessType === 'shuttle';
    const businessName = session?.user?.businessName || 'Partner';

    const [stats, setStats] = useState({ rides: 0, vehicles: 0, drivers: 0, revenue: 0 });
    const [recentRides, setRecentRides] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const [ridesRes, vehiclesRes, driversRes] = await Promise.all([
                    getRides({ limit: 10 }),
                    getVehicles({ isLongDistance: isShuttle }),
                    getDrivers(),
                ]);

                const rides = ridesRes.rides || [];
                const vehicles = vehiclesRes.vehicles || [];
                const drivers = driversRes.drivers || [];

                const totalRevenue = rides
                    .filter((r: any) => r.paymentStatus === 'paid')
                    .reduce((sum: number, r: any) => sum + (r.fare?.total || 0), 0);

                setStats({
                    rides: ridesRes.total || rides.length,
                    vehicles: vehicles.length,
                    drivers: drivers.length,
                    revenue: totalRevenue,
                });
                setRecentRides(rides.slice(0, 5));
            } catch (e) {
                // silent
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [isShuttle]);

    const statusColors: Record<string, string> = {
        requested: 'bg-amber-500/10 text-amber-300',
        accepted: 'bg-sky-500/10 text-sky-300',
        arrived: 'bg-violet-500/10 text-violet-300',
        in_progress: 'bg-blue-500/10 text-blue-300',
        completed: 'bg-emerald-500/10 text-emerald-300',
        cancelled: 'bg-red-500/10 text-red-300',
    };

    const cards = [
        { label: isShuttle ? 'Total Bookings' : 'Total Rides', value: stats.rides, icon: '📥', color: 'from-sky-500 to-blue-600' },
        { label: isShuttle ? 'Shuttles' : 'Vehicles', value: stats.vehicles, icon: isShuttle ? '🚌' : '🚘', color: 'from-emerald-500 to-teal-600' },
        { label: 'Drivers', value: stats.drivers, icon: '👥', color: 'from-violet-500 to-purple-600' },
        { label: 'Revenue', value: formatCurrency(stats.revenue), icon: '💰', color: 'from-amber-500 to-orange-600' },
    ];

    return (
        <div className="space-y-6">
            <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-2xl shadow-black/10">
                <p className="text-sm font-semibold uppercase tracking-[0.35em] text-emerald-400">
                    {isShuttle ? 'Shuttle Dashboard' : 'Transport Dashboard'}
                </p>
                <h2 className="mt-2 text-3xl font-semibold text-white">Welcome back, {businessName}</h2>
                <p className="mt-2 text-sm text-slate-400">
                    {isShuttle ? 'Overview of your shuttle operations and bookings.' : 'Overview of your transport fleet and ride requests.'}
                </p>
            </div>

            {loading ? (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="rounded-3xl border border-slate-800 bg-slate-950/80 p-5 animate-pulse">
                            <div className="h-4 w-20 bg-slate-800 rounded mb-3" />
                            <div className="h-8 w-16 bg-slate-800 rounded" />
                        </div>
                    ))}
                </div>
            ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {cards.map((card) => (
                        <div key={card.label} className="rounded-3xl border border-slate-800 bg-slate-950/80 p-5 hover:border-slate-700 transition">
                            <div className="flex items-center justify-between">
                                <p className="text-xs uppercase tracking-[0.24em] text-slate-400">{card.label}</p>
                                <span className={`inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${card.color} text-lg shadow-lg`}>
                                    {card.icon}
                                </span>
                            </div>
                            <p className="mt-3 text-3xl font-semibold text-white">{card.value}</p>
                        </div>
                    ))}
                </div>
            )}

            <div className="rounded-3xl border border-slate-800 bg-slate-950/80 overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-800">
                    <h3 className="text-lg font-semibold text-white">
                        {isShuttle ? 'Recent Bookings' : 'Recent Ride Requests'}
                    </h3>
                </div>
                {recentRides.length === 0 ? (
                    <div className="p-6 text-center text-slate-400">
                        {isShuttle ? 'No bookings yet.' : 'No ride requests yet.'}
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-800 text-sm">
                            <thead className="bg-slate-900 text-slate-400">
                                <tr>
                                    <th className="px-4 py-3 text-left">Customer</th>
                                    <th className="px-4 py-3 text-left">Pickup</th>
                                    <th className="px-4 py-3 text-left">Dropoff</th>
                                    {isShuttle && <th className="px-4 py-3 text-left">Seats</th>}
                                    <th className="px-4 py-3 text-left">Fare</th>
                                    <th className="px-4 py-3 text-left">Status</th>
                                    <th className="px-4 py-3 text-left">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800">
                                {recentRides.map((ride: any) => (
                                    <tr key={ride._id} className="hover:bg-slate-900">
                                        <td className="px-4 py-3 text-white">
                                            {ride.customer?.firstName} {ride.customer?.lastName}
                                        </td>
                                        <td className="px-4 py-3 text-slate-300 text-xs truncate max-w-[120px]">
                                            {ride.pickup?.address}
                                        </td>
                                        <td className="px-4 py-3 text-slate-300 text-xs truncate max-w-[120px]">
                                            {ride.dropoff?.address}
                                        </td>
                                        {isShuttle && (
                                            <td className="px-4 py-3 text-slate-300">{ride.seats || 1}</td>
                                        )}
                                        <td className="px-4 py-3 text-emerald-400 font-semibold">
                                            {formatCurrency(ride.fare?.total || 0)}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${statusColors[ride.status] || 'bg-slate-500/10 text-slate-300'}`}>
                                                {ride.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-slate-400 text-xs">
                                            {ride.createdAt ? new Date(ride.createdAt).toLocaleDateString() : '—'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DashboardPage;