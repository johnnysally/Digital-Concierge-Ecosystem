import React, { useEffect, useState } from 'react';
import SectionHeader from '../../components/customer/ui/SectionHeader';
import { getVehicles } from '../../api/customer/vehicleApi';
import { formatCurrency } from '../../utils/formatCurrency';
import { useAuth } from '../../context/customer/AuthContext';
import PaymentModal from '../../components/customer/ui/PaymentModal';

const TransportDashboardPage = () => {
    const { user } = useAuth();
    const [vehicles, setVehicles] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [vehicleType, setVehicleType] = useState('');
    const [pickup, setPickup] = useState('');
    const [dropoff, setDropoff] = useState('');
    const [pickupCity, setPickupCity] = useState('');
    const [dropoffCity, setDropoffCity] = useState('');
    const [phone, setPhone] = useState(user?.phone || '');
    const [rideType, setRideType] = useState('immediate');
    const [scheduledTime, setScheduledTime] = useState('');
    const [rideError, setRideError] = useState('');
    const [selectedVehicle, setSelectedVehicle] = useState<any>(null);
    const [showPayment, setShowPayment] = useState(false);
    const [paymentAmount, setPaymentAmount] = useState(0);

    useEffect(() => {
        getVehicles(vehicleType ? { type: vehicleType } : {}).then((res) => setVehicles(res.vehicles || [])).catch(() => setVehicles([])).finally(() => setLoading(false));
    }, [vehicleType]);

    const handlePayNow = (vehicle: any) => {
        if (!pickup || !dropoff) { setRideError('Please enter pickup and dropoff.'); return; }
        setRideError('');
        setSelectedVehicle(vehicle);
        setPaymentAmount(vehicle.pricePerKm * 5 + (vehicle.baseFare || 0));
        setShowPayment(true);
    };

    const handlePaymentSuccess = () => {
        setShowPayment(false);
        setPickup(''); setDropoff(''); setPickupCity(''); setDropoffCity(''); setScheduledTime('');
    };

    const types = ['', 'sedan', 'suv', 'van', 'bus', 'bike'];

    return (
        <div className="space-y-8">
            <SectionHeader title="Transport booking" subtitle="Book taxis, transfers, and ride-hailing services." />
            <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
                <div className="grid gap-4 sm:grid-cols-2">
                    <input value={pickup} onChange={(e) => setPickup(e.target.value)} placeholder="Pickup address *" className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white" />
                    <input value={dropoff} onChange={(e) => setDropoff(e.target.value)} placeholder="Dropoff address *" className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white" />
                </div>
            </div>
            {rideError && <div className="rounded-xl bg-red-500/10 border border-red-500/30 p-3 text-sm text-red-400">{rideError}</div>}
            <div className="flex gap-2 flex-wrap">{types.map((t) => <button key={t} onClick={() => setVehicleType(t)} className={`rounded-xl px-4 py-2 text-sm font-medium capitalize ${vehicleType === t ? 'bg-sky-500 text-white' : 'bg-slate-800 text-slate-400'}`}>{t || 'All'}</button>)}</div>
            {loading ? <div className="text-slate-400 py-8 text-center">Loading...</div> : vehicles.length === 0 ? <div className="rounded-3xl border border-slate-800 bg-slate-900 p-10 text-center"><div className="text-5xl mb-4">🚗</div><h3 className="text-xl font-semibold text-white">No vehicles</h3></div> :
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {vehicles.map((v) => (
                    <div key={v._id} className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
                        <h3 className="text-lg font-semibold text-white capitalize">{v.make} {v.model}</h3>
                        <p className="text-sm text-slate-400 mt-1">{v.type} · {v.plateNumber}</p>
                        <p className="text-2xl font-bold text-white mt-3">{formatCurrency(v.pricePerKm)}<span className="text-sm text-slate-400">/km</span></p>
                        <button onClick={() => handlePayNow(v)} disabled={!pickup || !dropoff}
                            className="mt-4 w-full rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-500 disabled:opacity-50">
                            Pay & Book - ~{formatCurrency(v.pricePerKm * 5 + (v.baseFare || 0))}
                        </button>
                    </div>
                ))}
            </div>}
            {showPayment && selectedVehicle && (
                <PaymentModal amount={paymentAmount} rideData={{ vehicleId: selectedVehicle._id, pickup: { address: pickup, city: pickupCity }, dropoff: { address: dropoff, city: dropoffCity }, rideType, scheduledTime, customerPhone: phone }}
                    onSuccess={handlePaymentSuccess} onCancel={() => setShowPayment(false)} />
            )}
        </div>
    );
};

export default TransportDashboardPage;