import React, { useEffect, useState } from 'react';
import SectionHeader from '../../components/customer/ui/SectionHeader';
import { getVehicles } from '../../api/customer/vehicleApi';
import { formatCurrency } from '../../utils/formatCurrency';
import { api } from '../../api/axios';
import { useAuth } from '../../context/customer/AuthContext';

const TransportDashboardPage = () => {
    const { user } = useAuth();
    const [vehicles, setVehicles] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [vehicleType, setVehicleType] = useState('');
    const [booking, setBooking] = useState<any>(null);
    const [pickup, setPickup] = useState('');
    const [dropoff, setDropoff] = useState('');
    const [pickupCity, setPickupCity] = useState('');
    const [dropoffCity, setDropoffCity] = useState('');
    const [phone, setPhone] = useState(user?.phone || '');
    const [rideType, setRideType] = useState('immediate');
    const [scheduledTime, setScheduledTime] = useState('');
    const [rideError, setRideError] = useState('');
    const [bookingId, setBookingId] = useState<string | null>(null);

    useEffect(() => {
        getVehicles(vehicleType ? { type: vehicleType } : {})
            .then((res) => setVehicles(res.vehicles || []))
            .catch(() => setVehicles([]))
            .finally(() => setLoading(false));
    }, [vehicleType]);

    const bookRide = async (vehicleId: string) => {
        if (!pickup || !dropoff) { setRideError('Please enter pickup and dropoff addresses.'); return; }
        setRideError('');
        setBookingId(vehicleId);
        try {
            const res = await api.post('/customer/rides', {
                vehicleId,
                pickup: { address: pickup, city: pickupCity },
                dropoff: { address: dropoff, city: dropoffCity },
                rideType,
                scheduledTime: rideType === 'scheduled' ? scheduledTime : undefined,
                customerPhone: phone,
            });
            setBooking(res.data);
            setPickup('');
            setDropoff('');
            setPickupCity('');
            setDropoffCity('');
            setScheduledTime('');
        } catch (err: any) {
            setRideError(err?.response?.data?.message || 'Booking failed. Please try again.');
        } finally {
            setBookingId(null);
        }
    };

    const types = ['', 'sedan', 'suv', 'van', 'bus', 'bike'];

    return (
        <div className="space-y-8">
            <SectionHeader title="Transport booking" subtitle="Book taxis, transfers, and ride-hailing services with live tracking." />

            {booking && (
                <div className="rounded-3xl border border-emerald-800 bg-emerald-950/50 p-6">
                    <h3 className="text-lg font-semibold text-emerald-400">Ride Booked!</h3>
                    <p className="text-sm text-emerald-300 mt-2">
                        Your ride has been requested. Estimated fare: {formatCurrency(booking.ride?.fare?.total || booking.ride?.totalAmount)}.
                        Track status in your bookings.
                    </p>
                </div>
            )}

            <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
                <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                        <label className="block text-sm text-slate-400 mb-2">Pickup Address *</label>
                        <input value={pickup} onChange={(e) => setPickup(e.target.value)} placeholder="Enter pickup location"
                            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-sky-500" />
                    </div>
                    <div>
                        <label className="block text-sm text-slate-400 mb-2">Dropoff Address *</label>
                        <input value={dropoff} onChange={(e) => setDropoff(e.target.value)} placeholder="Enter destination"
                            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-sky-500" />
                    </div>
                    <div>
                        <label className="block text-sm text-slate-400 mb-2">Pickup City</label>
                        <input value={pickupCity} onChange={(e) => setPickupCity(e.target.value)} placeholder="City"
                            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-sky-500" />
                    </div>
                    <div>
                        <label className="block text-sm text-slate-400 mb-2">Dropoff City</label>
                        <input value={dropoffCity} onChange={(e) => setDropoffCity(e.target.value)} placeholder="City"
                            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-sky-500" />
                    </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-3 mt-4">
                    <div>
                        <label className="block text-sm text-slate-400 mb-2">Phone Number *</label>
                        <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Your phone"
                            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-sky-500" />
                    </div>
                    <div>
                        <label className="block text-sm text-slate-400 mb-2">Ride Type</label>
                        <select value={rideType} onChange={(e) => setRideType(e.target.value)}
                            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-sky-500">
                            <option value="immediate">Now</option>
                            <option value="scheduled">Schedule</option>
                        </select>
                    </div>
                    {rideType === 'scheduled' && (
                        <div>
                            <label className="block text-sm text-slate-400 mb-2">Pickup Time</label>
                            <input type="datetime-local" value={scheduledTime} onChange={(e) => setScheduledTime(e.target.value)}
                                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-sky-500" />
                        </div>
                    )}
                </div>
            </div>

            {rideError && (
                <div className="rounded-xl bg-red-500/10 border border-red-500/30 p-4 text-sm text-red-400">{rideError}</div>
            )}

            <div className="flex gap-2 flex-wrap">
                {types.map((t) => (
                    <button key={t} onClick={() => setVehicleType(t)}
                        className={`rounded-xl px-4 py-2 text-sm font-medium capitalize transition-colors ${vehicleType === t ? 'bg-sky-500 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}>
                        {t || 'All'}
                    </button>
                ))}
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-12 gap-3">
                    <div className="w-2 h-2 bg-sky-500 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-sky-500 rounded-full animate-bounce [animation-delay:0.1s]" />
                    <div className="w-2 h-2 bg-sky-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                </div>
            ) : vehicles.length === 0 ? (
                <div className="rounded-3xl border border-slate-800 bg-slate-900 p-10 text-center">
                    <div className="text-5xl mb-4">🚗</div>
                    <h3 className="text-xl font-semibold text-white">No vehicles available</h3>
                    <p className="mt-2 text-sm text-slate-400">Check back later or adjust your filters.</p>
                </div>
            ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {vehicles.map((v) => (
                        <div key={v._id} className="rounded-3xl border border-slate-800 bg-slate-900 p-6 hover:border-sky-700 transition-colors">
                            <h3 className="text-lg font-semibold text-white capitalize">{v.make} {v.model}</h3>
                            <p className="text-sm text-slate-400 mt-1 capitalize">{v.type} · {v.plateNumber}</p>
                            <p className="text-sm text-slate-400">Capacity: {v.capacity} seats</p>
                            <p className="text-2xl font-bold text-white mt-3">
                                {formatCurrency(v.pricePerKm)}<span className="text-sm text-slate-400">/km</span>
                            </p>
                            {v.baseFare > 0 && <p className="text-xs text-slate-500 mt-1">Base fare: {formatCurrency(v.baseFare)}</p>}
                            <button onClick={() => bookRide(v._id)} disabled={!pickup || !dropoff || bookingId === v._id}
                                className="mt-4 w-full rounded-xl bg-sky-600 px-4 py-3 text-sm font-semibold text-white hover:bg-sky-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                                {bookingId === v._id ? 'Booking...' : 'Book Ride'}
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default TransportDashboardPage;