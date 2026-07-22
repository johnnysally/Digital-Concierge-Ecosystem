import { useEffect, useState } from 'react';
import { getDrivers } from '../../api/transport/driverApi';
import { getVehicles } from '../../api/transport/vehicleApi';
import { getRidesWithMeta, getRides } from '../../api/transport/rideApi';
import { getPromotions } from '../../api/transport/promotionApi';
import { getPayments } from '../../api/transport/paymentApi';
import { Link } from 'react-router-dom';
import { formatCurrency } from '../../utils/formatCurrency';
import Transport3DPie from '../../components/transport/ui/Transport3DPie';
import Transport3DBar from '../../components/transport/ui/Transport3DBar';

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

    return (
        <div className="space-y-6">
            <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-2xl shadow-black/20">
                <p className="text-sm font-semibold uppercase tracking-[0.35em] text-emerald-400">Transport operations</p>
                <h2 className="mt-3 text-3xl font-semibold text-white">Welcome to your transport control center</h2>
                <p className="mt-3 max-w-2xl text-sm text-slate-400">Track vehicle availability, ride volume, promotions, and wallet activity from one unified dashboard.</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {['Drivers', 'Vehicles', 'Rides', 'Promotions'].map((label, index) => {
                    const value = [stats.drivers, stats.vehicles, stats.rides, stats.promotions][index];
                    return (
                        <div key={label} className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5 shadow-sm">
                            <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-400">{label}</p>
                            <p className="mt-4 text-4xl font-bold text-white">{loading ? '—' : value}</p>
                        </div>
                    );
                })}
            </div>

            <div className="grid gap-4 xl:grid-cols-[1.4fr_0.8fr]">
                <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-sm">
                    <div className="flex items-center justify-between gap-4">
                        <div>
                            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">Wallet</p>
                            <h3 className="mt-2 text-2xl font-semibold text-white">Payment activity</h3>
                            <p className="mt-2 text-sm text-slate-400">See recent wallet transactions and track system payments in transport.</p>
                        </div>
                        <Link
                            to="/transport-admin/wallet"
                            className="rounded-2xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400"
                        >
                            Open wallet
                        </Link>
                    </div>

                    <div className="mt-6 grid gap-4 sm:grid-cols-3">
                        <div className="rounded-3xl border border-slate-800 bg-slate-950/90 p-4">
                            <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Transactions</p>
                            <p className="mt-3 text-3xl font-semibold text-white">{loading ? '—' : walletInfo.available ? walletInfo.count : 'N/A'}</p>
                        </div>
                        <div className="rounded-3xl border border-slate-800 bg-slate-950/90 p-4">
                            <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Total amount</p>
                            <p className="mt-3 text-3xl font-semibold text-white">{loading ? '—' : walletInfo.available ? formatCurrency(walletInfo.total, 'KES') : 'N/A'}</p>
                        </div>
                        <div className="rounded-3xl border border-slate-800 bg-slate-950/90 p-4">
                            <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Last payment</p>
                            <p className="mt-3 text-3xl font-semibold text-white">{loading ? '—' : walletInfo.available ? walletInfo.latestStatus : 'Unavailable'}</p>
                        </div>
                    </div>

                    <div className="mt-6 rounded-3xl border border-slate-800 bg-slate-950/90 p-4">
                        <div className="flex items-center justify-between gap-4">
                            <p className="text-sm font-semibold text-slate-300">Wallet activity trend</p>
                            <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-emerald-300">
                                {walletInfo.available ? 'Live' : 'Unavailable'}
                            </span>
                        </div>
                        <div className="mt-4 h-44">
                            <Transport3DBar data={paymentDistribution.length ? paymentDistribution : [{ name: 'No data', value: 1 }]} />
                        </div>
                    </div>
                </div>
                <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-sm">
                    <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">Wallet health</p>
                    <p className="mt-4 text-sm text-slate-400">{walletInfo.available ? 'Wallet tracking is active for your transport payments.' : 'Wallet data is unavailable for transport at this time.'}</p>
                    <div className="mt-6 flex flex-col gap-8">
                        <div className="rounded-2xl border border-slate-800 bg-slate-950/90 p-3">
                            <p className="text-sm text-slate-300">Payment status distribution</p>
                            <div className="mt-3 h-48">
                                <Transport3DPie data={paymentDistribution} />
                            </div>
                        </div>
                        <div className="rounded-2xl border border-slate-800 bg-slate-950/90 p-3">
                            <p className="text-sm text-slate-300">Ride status distribution</p>
                            <div className="mt-3 h-72 min-h-[24rem]">
                                <Transport3DPie data={rideStatusDistribution} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-sm">
                    <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Drivers status</p>
                    <div className="mt-4 h-52">
                        <Transport3DPie data={driverStatusDistribution} />
                    </div>
                </div>
                <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-sm">
                    <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Vehicles status</p>
                    <div className="mt-4 h-52">
                        <Transport3DPie data={vehicleStatusDistribution} />
                    </div>
                </div>
                <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-sm">
                    <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Ride types</p>
                    <div className="mt-4 h-52">
                        <Transport3DPie data={rideTypeDistribution} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
