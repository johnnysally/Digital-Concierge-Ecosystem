import { useEffect, useState } from 'react';
import { getActiveVehicles, getVehicleLocation, getActiveTrips } from '../../api/transport/mapApi';

const LiveMapPage = () => {
    const [vehicles, setVehicles] = useState<any[]>([]);
    const [trips, setTrips] = useState<any[]>([]);
    const [selectedVehicle, setSelectedVehicle] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'vehicles' | 'trips'>('vehicles');

    const loadData = async () => {
        try {
            const [vRes, tRes] = await Promise.all([getActiveVehicles(), getActiveTrips()]);
            setVehicles(vRes.vehicles || []);
            setTrips(tRes.rides || []);
        } catch {}
        setLoading(false);
    };

    useEffect(() => { loadData(); const interval = setInterval(loadData, 30000); return () => clearInterval(interval); }, []);

    const handleSelectVehicle = async (id: string) => {
        try {
            const res = await getVehicleLocation(id);
            setSelectedVehicle(res.vehicle);
        } catch {}
    };

    if (loading) return <div className="text-slate-400 py-12 text-center">Loading map data...</div>;

    return (
        <div className="space-y-6">
            <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6">
                <p className="text-sm font-semibold uppercase tracking-[0.35em] text-emerald-400">Tracking</p>
                <h2 className="mt-2 text-3xl font-semibold text-white">Live Map</h2>
            </div>

            <div className="flex gap-2">
                <button onClick={() => setActiveTab('vehicles')} className={`rounded-xl px-4 py-2 text-sm font-medium ${activeTab === 'vehicles' ? 'bg-sky-500 text-white' : 'bg-slate-800 text-slate-400'}`}>Vehicles ({vehicles.length})</button>
                <button onClick={() => setActiveTab('trips')} className={`rounded-xl px-4 py-2 text-sm font-medium ${activeTab === 'trips' ? 'bg-sky-500 text-white' : 'bg-slate-800 text-slate-400'}`}>Active Trips ({trips.length})</button>
            </div>

            {activeTab === 'vehicles' ? (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {vehicles.map((v) => (
                        <div key={v._id} onClick={() => handleSelectVehicle(v._id)} className="rounded-3xl border border-slate-800 bg-slate-950/80 p-5 cursor-pointer hover:border-sky-500/50 transition">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h4 className="text-white font-semibold">{v.make} {v.model}</h4>
                                    <p className="text-xs text-slate-400">{v.plateNumber} · {v.type}</p>
                                </div>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${v.status === 'idle' ? 'bg-emerald-500/10 text-emerald-300' : v.status === 'on_trip' ? 'bg-sky-500/10 text-sky-300' : 'bg-amber-500/10 text-amber-300'}`}>{v.status}</span>
                            </div>
                            <div className="mt-3 text-xs text-slate-500">
                                <p>Dispatch: {v.dispatchStatus}</p>
                                {v.driver && <p>Driver: {v.driver.firstName} {v.driver.lastName}</p>}
                                <p>Location: {v.location?.coordinates?.join(', ') || 'N/A'}</p>
                            </div>
                        </div>
                    ))}
                    {vehicles.length === 0 && <div className="col-span-full text-center text-slate-400 py-8">No active vehicles.</div>}
                </div>
            ) : (
                <div className="space-y-3">
                    {trips.map((t) => (
                        <div key={t._id} className="rounded-3xl border border-slate-800 bg-slate-950/80 p-5">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h4 className="text-white font-semibold">{t.vehicle?.make} {t.vehicle?.model} · {t.vehicle?.plateNumber}</h4>
                                    <p className="text-xs text-slate-400">{t.customer?.firstName} {t.customer?.lastName}</p>
                                </div>
                                <span className="px-2 py-1 rounded-full text-xs font-medium bg-sky-500/10 text-sky-300">{t.status}</span>
                            </div>
                            <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-slate-400">
                                <p>From: {t.pickup?.address}</p>
                                <p>To: {t.dropoff?.address}</p>
                                <p>Distance: {t.distance ? `${t.distance} km` : 'N/A'}</p>
                                <p>Fare: KES {t.fare?.total?.toLocaleString()}</p>
                            </div>
                        </div>
                    ))}
                    {trips.length === 0 && <div className="text-center text-slate-400 py-8">No active trips.</div>}
                </div>
            )}
        </div>
    );
};

export default LiveMapPage;