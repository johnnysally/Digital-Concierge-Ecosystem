import React, { useEffect, useState } from 'react';
import SectionHeader from '../../components/customer/ui/SectionHeader';
import { getVehicles } from '../../api/customer/vehicleApi';
import { formatCurrency } from '../../utils/formatCurrency';
import { api } from '../../api/axios';

const TransportDashboardPage = () => {
    const [vehicles, setVehicles] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [vehicleType, setVehicleType] = useState('');
    const [booking, setBooking] = useState<any>(null);
    const [pickup, setPickup] = useState('');
    const [dropoff, setDropoff] = useState('');

    useEffect(() => {
        getVehicles(vehicleType ? { type: vehicleType } : {})
            .then((res) => setVehicles(res.vehicles || []))
            .catch(() => setVehicles([]))
            .finally(() => setLoading(false));
    }, [vehicleType]);

    const bookRide = async (vehicleId: string) => {
        try {
            const res = await api.post('/customer/rides', { vehicleId, pickup: { address: pickup }, dropoff: { address: dropoff } });
            setBooking(res.data);
        } catch {}
    };

    const types = ['', 'sedan', 'suv', 'van', 'bus', 'bike'];

    return (
        <div className="space-y-8">
            <SectionHeader title="Transport booking" subtitle="Book taxis, transfers, and ride-hailing services with live tracking." />

            <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
                <div className="grid gap-4 sm:grid-cols-2">
                    <input value={pickup} onChange={(e) => setPickup(e.target.value)} placeholder="Pickup address"
                        className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-sky-500" />
                    <input value={dropoff} onChange={(e) => setDropoff(e.target.value)} placeholder="Dropoff address"
                        className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-sky-500" />
                </div>
            </div>

            <div className="flex gap-2 flex-wrap">
                {types.map((t) => (
                    <button key={t} onClick={() => setVehicleType(t)}
                        className={`rounded-xl px-4 py-2 text-sm font-medium capitalize transition-colors ${vehicleType === t ? 'bg-sky-500 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}>
                        {t || 'All'}
                    </button>
                ))}
            </div>

            {loading ? (
                <div className="text-slate-400">Loading vehicles...</div>
            ) : vehicles.length === 0 ? (
                <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 text-slate-400">No vehicles available.</div>
            ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {vehicles.map((v) => (
                        <div key={v._id} className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
                            <h3 className="text-lg font-semibold text-white capitalize">{v.make} {v.model}</h3>
                            <p className="text-sm text-slate-400 mt-1 capitalize">{v.type} · {v.plateNumber}</p>
                            <p className="text-sm text-slate-400">Capacity: {v.capacity}</p>
                            <p className="text-2xl font-bold text-white mt-3">{formatCurrency(v.pricePerKm)}<span className="text-sm text-slate-400">/km</span></p>
                            <button onClick={() => bookRide(v._id)} disabled={!pickup || !dropoff}
                                className="mt-4 w-full rounded-xl bg-sky-600 px-4 py-3 text-sm font-semibold text-white hover:bg-sky-500 disabled:opacity-50">
                                Book Ride
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {booking && (
                <div className="rounded-3xl border border-emerald-800 bg-emerald-950/50 p-6">
                    <h3 className="text-lg font-semibold text-emerald-400">Ride Booked!</h3>
                    <p className="text-sm text-emerald-300 mt-2">Your ride has been requested. Track status in your bookings.</p>
                </div>
            )}
        </div>
    );
};

export default TransportDashboardPage;