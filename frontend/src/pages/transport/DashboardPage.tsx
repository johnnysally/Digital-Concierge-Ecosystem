import { useEffect, useState } from 'react';
import { getDrivers } from '../../api/transport/driverApi';
import { getVehicles } from '../../api/transport/vehicleApi';
import { getRidesWithMeta, getRides } from '../../api/transport/rideApi';
import { getPromotions } from '../../api/transport/promotionApi';
import { getPayments } from '../../api/transport/paymentApi';
import { Link } from 'react-router-dom';
import { formatCurrency } from '../../utils/formatCurrency';
import { getTransportPath } from '../../utils/transportRoutes';

const parsePayments = (data: any): any[] => {
    if (Array.isArray(data)) return data;
    if (Array.isArray(data.payments)) return data.payments;
    if (Array.isArray(data.items)) return data.items;
    if (Array.isArray(data.data)) return data.data;
    return [];
};

const DashboardPage = () => {
    const [stats, setStats] = useState({ drivers: 0, vehicles: 0, rides: 0, promotions: 0 });
    const [walletInfo, setWalletInfo] = useState({ count: 0, total: 0, latestStatus: 'N/A', available: true });
    const [loading, setLoading] = useState(true);
    const [paymentDistribution, setPaymentDistribution] = useState<{ name: string; value: number }[]>([]);
    const [rideStatusDistribution, setRideStatusDistribution] = useState<{ name: string; value: number }[]>([]);
    const [driverStatusDistribution, setDriverStatusDistribution] = useState<{ name: string; value: number }[]>([]);
    const [vehicleStatusDistribution, setVehicleStatusDistribution] = useState<{ name: string; value: number }[]>([]);
    const [rideTypeDistribution, setRideTypeDistribution] = useState<{ name: string; value: number }[]>([]);

    useEffect(() => {
        const load = async () => {
            try {
                const [drivers, vehicles, ridesMeta, promotions, paymentsResult] = await Promise.allSettled([
                    getDrivers(),
                    getVehicles(),
                    getRidesWithMeta({ limit: 1 }),
                    getPromotions(),
                    getPayments({ limit: 5 }),
                ]);

                const driversList = drivers.status === 'fulfilled' && Array.isArray(drivers.value) ? drivers.value : [];
                const vehiclesList = vehicles.status === 'fulfilled' && Array.isArray(vehicles.value) ? vehicles.value : [];
                const promotionsList = promotions.status === 'fulfilled' && Array.isArray(promotions.value) ? promotions.value : [];
                const rideCount = ridesMeta.status === 'fulfilled' ? ridesMeta.value?.total ?? (Array.isArray(ridesMeta.value) ? ridesMeta.value.length : 0) : 0;

                setStats({
                    drivers: driversList.length,
                    vehicles: vehiclesList.length,
                    rides: rideCount,
                    promotions: promotionsList.length,
                });

                if (paymentsResult.status === 'fulfilled') {
                    const paymentsList = parsePayments(paymentsResult.value);
                    const total = paymentsList.reduce((sum: number, payment: any) => sum + (Number(payment.amount) || 0), 0);
                    setWalletInfo({
                        count: paymentsList.length,
                        total,
                        latestStatus: paymentsList[0]?.status || 'N/A',
                        available: true,
                    });
                    // build payment distribution
                    const grouped = paymentsList.reduce((acc: Record<string, number>, p: any) => {
                        const key = p.status || 'unknown';
                        acc[key] = (acc[key] || 0) + 1;
                        return acc;
                    }, {});
                    setPaymentDistribution(Object.entries(grouped).map(([name, value]) => ({ name, value })));
                } else {
                    setWalletInfo((current) => ({ ...current, available: false }));
                }

                // try to build ride and entity distributions
                try {
                    const allRides = await getRides({ limit: 1000 });
                    const ridesArray = Array.isArray(allRides) ? allRides : allRides.rides ?? [];

                    const statusGroup: Record<string, number> = {};
                    const typeGroup: Record<string, number> = {};
                    ridesArray.forEach((r: any) => {
                        const s = r.status || 'unknown';
                        const t = r.rideType || 'immediate';
                        statusGroup[s] = (statusGroup[s] || 0) + 1;
                        typeGroup[t] = (typeGroup[t] || 0) + 1;
                    });
                    setRideStatusDistribution(Object.entries(statusGroup).map(([name, value]) => ({ name, value })));
                    setRideTypeDistribution(Object.entries(typeGroup).map(([name, value]) => ({ name, value })));
                } catch (e) {
                    setRideStatusDistribution([]);
                    setRideTypeDistribution([]);
                }

                try {
                    const driversList = await getDrivers();
                    const driversArray = Array.isArray(driversList) ? driversList : driversList.drivers ?? driversList;
                    const driverGroup: Record<string, number> = {};
                    driversArray.forEach((d: any) => {
                        const s = d.status || 'unknown';
                        driverGroup[s] = (driverGroup[s] || 0) + 1;
                    });
                    setDriverStatusDistribution(Object.entries(driverGroup).map(([name, value]) => ({ name, value })));
                } catch (e) {
                    setDriverStatusDistribution([]);
                }

                try {
                    const vehiclesList = await getVehicles();
                    const vehiclesArray = Array.isArray(vehiclesList) ? vehiclesList : vehiclesList.vehicles ?? vehiclesList;
                    const vehicleGroup: Record<string, number> = {};
                    vehiclesArray.forEach((v: any) => {
                        const s = v.status || 'unknown';
                        vehicleGroup[s] = (vehicleGroup[s] || 0) + 1;
                    });
                    setVehicleStatusDistribution(Object.entries(vehicleGroup).map(([name, value]) => ({ name, value })));
                } catch (e) {
                    setVehicleStatusDistribution([]);
                }
            } catch {
                setStats({ drivers: 0, vehicles: 0, rides: 0, promotions: 0 });
                setWalletInfo({ count: 0, total: 0, latestStatus: 'N/A', available: false });
            } finally {
                setLoading(false);
            }
        };

        load();
    }, []);

    const summaryCards = [
        { label: 'Drivers', value: stats.drivers, icon: '👥', hint: 'On roster' },
        { label: 'Vehicles', value: stats.vehicles, icon: '🚘', hint: 'Fleet ready' },
        { label: 'Rides', value: stats.rides, icon: '🚖', hint: 'Tracked' },
        { label: 'Promotions', value: stats.promotions, icon: '🎁', hint: 'Live offers' },
    ];

    const quickActions = [
        { label: 'Live Map', path: getTransportPath('/live'), icon: '🗺️', description: 'Monitor routes in real time' },
        { label: 'Ride Requests', path: getTransportPath('/ride-requests'), icon: '📥', description: 'Assign pickup demand' },
        { label: 'Dispatch', path: getTransportPath('/dispatch'), icon: '🎯', description: 'Coordinate the fleet' },
        { label: 'Vehicles', path: getTransportPath('/vehicles'), icon: '🚘', description: 'Check availability' },
    ];

    const spotlightItems = [
        { label: 'Payment status', value: paymentDistribution[0]?.name || 'Stable', detail: `${paymentDistribution[0]?.value || 0} recent statuses` },
        { label: 'Ride health', value: rideStatusDistribution[0]?.name || 'Live', detail: `${rideStatusDistribution[0]?.value || 0} active states` },
        { label: 'Driver readiness', value: driverStatusDistribution[0]?.name || 'Ready', detail: `${driverStatusDistribution[0]?.value || 0} current state` },
    ];

    return (
        <div className="space-y-6">
            <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                    <div className="max-w-2xl">
                        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">Transport operations</p>
                        <h2 className="mt-2 text-3xl font-semibold text-white">Operations overview</h2>
                        <p className="mt-2 text-sm text-slate-400">A lighter view of fleet activity, payments, and dispatch essentials without the extra chart clutter.</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {quickActions.slice(0, 2).map((action) => (
                            <Link key={action.label} to={action.path} className="rounded-2xl border border-slate-800 bg-slate-950 px-3 py-2 text-sm font-medium text-slate-300 transition hover:border-slate-600 hover:text-white">
                                {action.label}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {summaryCards.map((card) => (
                    <div key={card.label} className="rounded-3xl border border-slate-800 bg-slate-900 p-5">
                        <div className="flex items-center justify-between gap-3">
                            <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-400">{card.label}</p>
                            <span className="text-xl text-slate-300">{card.icon}</span>
                        </div>
                        <p className="mt-4 text-3xl font-semibold text-white">{loading ? '—' : card.value}</p>
                        <p className="mt-2 text-sm text-slate-500">{card.hint}</p>
                    </div>
                ))}
            </div>

            <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
                <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
                    <div className="flex items-center justify-between gap-3">
                        <div>
                            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">Wallet snapshot</p>
                            <h3 className="mt-2 text-xl font-semibold text-white">Payment health at a glance</h3>
                        </div>
                        <Link to={getTransportPath('/wallet')} className="text-sm font-medium text-sky-400 transition hover:text-sky-300">
                            View wallet
                        </Link>
                    </div>

                    <div className="mt-5 grid gap-4 sm:grid-cols-2">
                        <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
                            <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Transactions</p>
                            <p className="mt-3 text-2xl font-semibold text-white">{loading ? '—' : walletInfo.available ? walletInfo.count : 'N/A'}</p>
                            <p className="mt-2 text-sm text-slate-500">Recent payments recorded</p>
                        </div>
                        <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
                            <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Total value</p>
                            <p className="mt-3 text-2xl font-semibold text-white">{loading ? '—' : walletInfo.available ? formatCurrency(walletInfo.total, 'KES') : 'N/A'}</p>
                            <p className="mt-2 text-sm text-slate-500">Across the latest batch</p>
                        </div>
                    </div>
                </div>

                <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
                    <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">Quick actions</p>
                    <div className="mt-4 space-y-3">
                        {quickActions.map((action) => (
                            <Link key={action.label} to={action.path} className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-950/80 px-3 py-3 transition hover:border-slate-600 hover:bg-slate-800/80">
                                <div>
                                    <p className="text-sm font-semibold text-white">{action.label}</p>
                                    <p className="text-sm text-slate-500">{action.description}</p>
                                </div>
                                <span className="text-lg text-slate-500">↗</span>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-3xl border border-slate-800 bg-slate-900 p-5">
                    <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">Drivers</p>
                    <p className="mt-3 text-3xl font-semibold text-white">{loading ? '—' : stats.drivers}</p>
                    <p className="mt-2 text-sm text-slate-500">{driverStatusDistribution[0]?.name || 'Available'} · {driverStatusDistribution[0]?.value || 0}</p>
                </div>
                <div className="rounded-3xl border border-slate-800 bg-slate-900 p-5">
                    <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">Vehicles</p>
                    <p className="mt-3 text-3xl font-semibold text-white">{loading ? '—' : stats.vehicles}</p>
                    <p className="mt-2 text-sm text-slate-500">{vehicleStatusDistribution[0]?.name || 'Ready'} · {vehicleStatusDistribution[0]?.value || 0}</p>
                </div>
                <div className="rounded-3xl border border-slate-800 bg-slate-900 p-5">
                    <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">Rides</p>
                    <p className="mt-3 text-3xl font-semibold text-white">{loading ? '—' : stats.rides}</p>
                    <p className="mt-2 text-sm text-slate-500">{rideStatusDistribution[0]?.name || 'Live'} · {rideStatusDistribution[0]?.value || 0}</p>
                </div>
                <div className="rounded-3xl border border-slate-800 bg-slate-900 p-5">
                    <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">Promotions</p>
                    <p className="mt-3 text-3xl font-semibold text-white">{loading ? '—' : stats.promotions}</p>
                    <p className="mt-2 text-sm text-slate-500">{paymentDistribution[0]?.name || 'Active'} offers in flow</p>
                </div>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">Operations snapshot</p>
                <div className="mt-4 grid gap-3 md:grid-cols-3">
                    {spotlightItems.map((item) => (
                        <div key={item.label} className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
                            <p className="text-sm text-slate-300">{item.label}</p>
                            <p className="mt-2 text-lg font-semibold text-white">{item.value}</p>
                            <p className="mt-1 text-sm text-slate-500">{item.detail}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
