import { useEffect, useState } from 'react';
import { getVehicles } from '../../api/customer/vehicleApi';
import { calculateFare } from '../../api/transport/destinationPriceApi';
import { formatCurrency } from '../../utils/formatCurrency';
import { useAuth } from '../../context/customer/AuthContext';
import PaymentModal from '../../components/customer/ui/PaymentModal';

const methodLabels: Record<string, string> = {
    destination_price: 'Fixed Price',
    google_maps: 'Google Maps',
    haversine: 'Haversine (×1.3)',
    manual: 'Manual Distance',
};

const vehicleTypes = ['', 'sedan', 'suv', 'bike', 'tuk_tuk'];

const RegularTransportTab = () => {
    const { user } = useAuth();
    const [vehicles, setVehicles] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [vehicleType, setVehicleType] = useState('');
    const [pickup, setPickup] = useState('');
    const [dropoff, setDropoff] = useState('');
    const [pickupCoords, setPickupCoords] = useState('');
    const [dropoffCoords, setDropoffCoords] = useState('');
    const [manualDistance, setManualDistance] = useState('');
    const [phone, setPhone] = useState(user?.phone || '');
    const [rideType, setRideType] = useState('immediate');
    const [scheduledTime, setScheduledTime] = useState('');
    const [rideError, setRideError] = useState('');
    const [selectedVehicle, setSelectedVehicle] = useState<any>(null);
    const [showPayment, setShowPayment] = useState(false);
    const [paymentAmount, setPaymentAmount] = useState(0);
    const [fareData, setFareData] = useState<any>(null);
    const [calculatingFare, setCalculatingFare] = useState(false);
    const [fareError, setFareError] = useState('');

    useEffect(() => {
        getVehicles(vehicleType ? { type: vehicleType } : {})
            .then((res) => setVehicles((res.vehicles || []).filter((v: any) => ['sedan', 'suv', 'bike', 'tuk_tuk'].includes(v.type))))
            .catch(() => setVehicles([]))
            .finally(() => setLoading(false));
    }, [vehicleType]);

    useEffect(() => {
        if (!pickup || !dropoff) { setFareData(null); setFareError(''); return; }
        const timeout = setTimeout(() => {
            setCalculatingFare(true);
            setFareError('');
            calculateFare({
                from: pickup, to: dropoff,
                vehicleType: vehicleType || undefined,
                pickupCoords: pickupCoords || undefined,
                dropoffCoords: dropoffCoords || undefined,
                manualDistance: manualDistance ? Number(manualDistance) : undefined,
            })
                .then((res) => { if (res.success) { setFareData(res.fare); setFareError(''); } else { setFareData(null); setFareError(res.message || 'Fare unavailable'); } })
                .catch(() => { setFareData(null); setFareError('Fare calculation failed'); })
                .finally(() => setCalculatingFare(false));
        }, 600);
        return () => clearTimeout(timeout);
    }, [pickup, dropoff, vehicleType, pickupCoords, dropoffCoords, manualDistance]);

    const handlePayNow = (vehicle: any) => {
        if (!pickup || !dropoff) { setRideError('Please enter pickup and dropoff.'); return; }
        setRideError('');
        setSelectedVehicle(vehicle);
        setPaymentAmount(fareData?.estimatedTotal || fareData?.price || vehicle.pricePerKm * 5 + (vehicle.baseFare || 0));
        setShowPayment(true);
    };

    const handlePaymentSuccess = () => {
        setShowPayment(false);
        setPickup(''); setDropoff(''); setPickupCoords(''); setDropoffCoords(''); setManualDistance(''); setScheduledTime('');
        setFareData(null); setFareError('');
    };

    return (
        <div className="space-y-6">
            <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                    <input value={pickup} onChange={(e) => setPickup(e.target.value)} placeholder="Pickup address *" className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white" />
                    <input value={dropoff} onChange={(e) => setDropoff(e.target.value)} placeholder="Dropoff address *" className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white" />
                </div>
                <details className="text-sm text-slate-400">
                    <summary className="cursor-pointer hover:text-slate-300">Advanced (coordinates, manual distance)</summary>
                    <div className="grid gap-4 sm:grid-cols-3 mt-3">
                        <input value={pickupCoords} onChange={(e) => setPickupCoords(e.target.value)} placeholder="Pickup coords (lat,lng)" className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white" />
                        <input value={dropoffCoords} onChange={(e) => setDropoffCoords(e.target.value)} placeholder="Dropoff coords (lat,lng)" className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white" />
                        <input value={manualDistance} onChange={(e) => setManualDistance(e.target.value)} type="number" placeholder="Manual distance (km)" className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white" />
                    </div>
                </details>
            </div>

            {calculatingFare && (
                <div className="rounded-xl bg-slate-800/50 border border-slate-700 p-4 text-sm text-slate-400 flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                    Calculating fare...
                </div>
            )}

            {fareData && !calculatingFare && (
                <div className="rounded-3xl border border-emerald-500/30 bg-emerald-500/5 p-5 space-y-3">
                    <p className="text-xs uppercase tracking-[0.3em] text-emerald-400 font-semibold">Fare estimate</p>
                    <div className="flex items-center justify-between"><span className="text-slate-400 text-sm">Total</span><span className="text-2xl font-bold text-emerald-400">{formatCurrency(fareData.estimatedTotal || fareData.price)}</span></div>
                    {fareData.type === 'dynamic' && (
                        <>
                            <div className="flex items-center justify-between text-sm"><span className="text-slate-400">Distance</span><span className="text-white">{fareData.distanceKm?.toFixed(1)} km</span></div>
                            {fareData.durationMinutes && <div className="flex items-center justify-between text-sm"><span className="text-slate-400">Duration</span><span className="text-white">{fareData.durationMinutes} min</span></div>}
                            <div className="flex items-center justify-between text-sm"><span className="text-slate-400">Rate</span><span className="text-white">{formatCurrency(fareData.pricePerKm)}/km + {formatCurrency(fareData.baseFare)} base</span></div>
                        </>
                    )}
                    {fareData.type === 'fixed' && fareData.durationMinutes && (
                        <div className="flex items-center justify-between text-sm"><span className="text-slate-400">Est. Duration</span><span className="text-white">{fareData.durationMinutes} min</span></div>
                    )}
                    <div className="flex items-center justify-between text-sm"><span className="text-slate-400">Method</span><span className="text-sky-300">{methodLabels[fareData.method] || fareData.method}</span></div>
                </div>
            )}

            {fareError && !calculatingFare && pickup && dropoff && (
                <div className="rounded-xl bg-amber-500/10 border border-amber-500/30 p-4 text-sm text-amber-300">{fareError}. Try adding coordinates or manual distance in Advanced settings.</div>
            )}

            {rideError && <div className="rounded-xl bg-red-500/10 border border-red-500/30 p-3 text-sm text-red-400">{rideError}</div>}

            <div className="flex gap-2 flex-wrap">
                {vehicleTypes.map((t) => (
                    <button key={t} onClick={() => setVehicleType(t)} className={`rounded-xl px-4 py-2 text-sm font-medium capitalize transition ${vehicleType === t ? 'bg-sky-500 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}>{t || 'All'}</button>
                ))}
            </div>

            {loading ? (
                <div className="text-slate-400 py-12 text-center">Loading vehicles...</div>
            ) : vehicles.length === 0 ? (
                <div className="rounded-3xl border border-slate-800 bg-slate-900 p-10 text-center"><div className="text-5xl mb-4">🚗</div><h3 className="text-xl font-semibold text-white">No vehicles available</h3></div>
            ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {vehicles.map((v) => (
                        <div key={v._id} className="rounded-3xl border border-slate-800 bg-slate-900 p-6 hover:border-slate-700 transition">
                            <div className="flex items-start justify-between">
                                <div><h3 className="text-lg font-semibold text-white capitalize">{v.make} {v.model}</h3><p className="text-sm text-slate-400 mt-1">{v.type} · {v.plateNumber}</p></div>
                                {v.partner?.businessName && <span className="text-xs text-slate-500 bg-slate-800 rounded-full px-2 py-1">{v.partner.businessName}</span>}
                            </div>
                            <div className="mt-3 flex items-baseline gap-1"><span className="text-2xl font-bold text-white">{formatCurrency(v.pricePerKm)}</span><span className="text-sm text-slate-400">/km</span>{v.baseFare > 0 && <span className="text-xs text-slate-500 ml-2">+ {formatCurrency(v.baseFare)} base</span>}</div>
                            <p className="text-xs text-slate-500 mt-1">Available</p>
                            <button onClick={() => handlePayNow(v)} disabled={!pickup || !dropoff || calculatingFare} className="mt-4 w-full rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition">
                                {!pickup || !dropoff ? 'Enter pickup & dropoff' : calculatingFare ? 'Calculating...' : fareData ? `Pay & Book - ${formatCurrency(fareData.estimatedTotal || fareData.price)}` : 'Fare unavailable'}
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {showPayment && selectedVehicle && (
                <PaymentModal amount={paymentAmount} rideData={{ vehicleId: selectedVehicle._id, pickup: { address: pickup, coordinates: pickupCoords || undefined }, dropoff: { address: dropoff, coordinates: dropoffCoords || undefined }, rideType, scheduledTime, customerPhone: phone, fare: fareData, seats: 1 }} onSuccess={handlePaymentSuccess} onCancel={() => setShowPayment(false)} />
            )}
        </div>
    );
};

export default RegularTransportTab;