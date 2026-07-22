import React, { useEffect, useState } from 'react';
import { getActiveTrips } from '../../api/transport/mapApi';
import { getVehicles, updateDispatchStatus } from '../../api/transport/vehicleApi';
import { getDrivers } from '../../api/transport/driverApi';

const DispatchPage = () => {
    const [trips, setTrips] = useState<any[]>([]);
    const [vehicles, setVehicles] = useState<any[]>([]);
    const [drivers, setDrivers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');

    useEffect(() => {
        Promise.all([getActiveTrips(), getVehicles(), getDrivers()])
            .then(([t, v, d]) => {
                setTrips(t.rides || []);
                setVehicles(v.vehicles || []);
                setDrivers(d.drivers || []);
            })
            .finally(() => setLoading(false));
    }, []);

    const handleDispatch = async (vehicleId: string, status: string) => {
        try {
            await updateDispatchStatus(vehicleId, status);
            setMessage(`Vehicle dispatch status updated to ${status.replace('_', ' ')}.`);
            const v = await getVehicles();
            setVehicles(v.vehicles || []);
            setTimeout(() => setMessage(''), 3000);
        } catch { setMessage('Failed to update dispatch status.'); }
    };

    if (loading) return <div className="p-8 text-slate-400">Loading dispatch data...</div>;

    return (
        <div className="space-y-8">
            <div>
                <p className="text-sm font-semibold uppercase tracking-[0.35em] text-emerald-400">Dispatch</p>
                <h1 className="mt-3 text-3xl font-semibold text-white">Dispatch center</h1>
                <p className="mt-3 max-w-2xl text-sm text-slate-400">Assign rides, choose drivers, and oversee transport dispatch operations.</p>
            </div>

            {message && <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/30 p-3 text-sm text-emerald-400">{message}</div>}

            <div className="grid gap-6 lg:grid-cols-2">
                <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Active Trips ({trips.length})</h3>
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                        {trips.length === 0 ? (
                            <p className="text-sm text-slate-400">No active trips to dispatch.</p>
                        ) : (
                            trips.map((trip) => (
                                <div key={trip._id} className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-semibold text-emerald-400 capitalize">{trip.status.replace('_', ' ')}</span>
                                        <span className="text-xs text-slate-500">{trip.vehicle?.plateNumber || 'Unassigned'}</span>
                                    </div>
                                    <p className="text-sm text-white mt-2">{trip.customer?.firstName} {trip.customer?.lastName}</p>
                                    <p className="text-xs text-slate-400 mt-1">{trip.pickup?.address} → {trip.dropoff?.address}</p>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Fleet Control ({vehicles.length})</h3>
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                        {vehicles.map((v) => (
                            <div key={v._id} className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-semibold text-white text-sm">{v.make} {v.model}</p>
                                        <p className="text-xs text-slate-400">{v.plateNumber} · {(v.dispatchStatus || v.status).replace('_', ' ')}</p>
                                    </div>
                                    <select value={v.dispatchStatus || v.status}
                                        onChange={(e) => handleDispatch(v._id, e.target.value)}
                                        className="rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-white">
                                        <option value="available">Available</option>
                                        <option value="dispatched">Dispatched</option>
                                        <option value="en_route">En Route</option>
                                        <option value="arrived">Arrived</option>
                                        <option value="in_service">In Service</option>
                                        <option value="completed">Completed</option>
                                    </select>
                                </div>
                                {v.driver && <p className="text-xs text-slate-400 mt-2">🚗 {v.driver.firstName} {v.driver.lastName}</p>}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DispatchPage;