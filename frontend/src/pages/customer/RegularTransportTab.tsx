import { useEffect, useState, useCallback } from 'react';
import SectionHeader from '../../components/customer/ui/SectionHeader';
import { getVehicles } from '../../api/customer/vehicleApi';
import { calculateFare } from '../../api/customer/pricingApi';
import { getTowns, getDestinations } from '../../api/customer/locationApi';
import { formatCurrency } from '../../utils/formatCurrency';
import { useAuth } from '../../context/customer/AuthContext';
import PaymentModal from '../../components/customer/ui/PaymentModal';

const vehicleTypes = ['', 'sedan', 'suv', 'bike', 'tuk_tuk'];

type Props = { onBack: () => void };

const RegularTransportTab = ({ onBack }: Props) => {
    const { user } = useAuth();
    const [vehicles, setVehicles] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [vehicleType, setVehicleType] = useState('');
    const [vehicleFares, setVehicleFares] = useState<Record<string, any>>({});
    const [loadingFares, setLoadingFares] = useState<Record<string, boolean>>({});

    const [towns, setTowns] = useState<any[]>([]);
    const [selectedTown, setSelectedTown] = useState('');
    const [destinations, setDestinations] = useState<any[]>([]);
    const [pickup, setPickup] = useState('');
    const [pickupNote, setPickupNote] = useState('');
    const [dropoff, setDropoff] = useState('');
    const [dropoffNote, setDropoffNote] = useState('');
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

    useEffect(() => {
        getTowns().then((res) => {
            const t = res.towns || [];
            setTowns(t);
            const customerTown = user?.town?._id || user?.town;
            if (customerTown) setSelectedTown(customerTown);
        }).catch(() => {});
    }, []);

    useEffect(() => {
        if (selectedTown) {
            getDestinations(selectedTown).then((res) => setDestinations(res.destinations || [])).catch(() => {});
            setLoading(true);
            setVehicleFares({});
            getVehicles({ isLongDistance: false, town: selectedTown, ...(vehicleType ? { type: vehicleType } : {}) })
                .then((res) => setVehicles(res.vehicles || []))
                .catch(() => setVehicles([]))
                .finally(() => setLoading(false));
        }
    }, [selectedTown, vehicleType]);

    const fetchFareForVehicle = useCallback(async (vehicle: any) => {
        if (!pickup || !dropoff) return;
        const partnerId = vehicle.partner?._id || vehicle.partner;
        setLoadingFares((prev) => ({ ...prev, [vehicle._id]: true }));
        try {
            const res = await calculateFare({
                from: pickup, to: dropoff, vehicleType: vehicle.type,
                town: selectedTown, partner: partnerId,
                pickupCoords: pickupCoords || undefined, dropoffCoords: dropoffCoords || undefined,
                manualDistance: manualDistance ? Number(manualDistance) : undefined,
            });
            setVehicleFares((prev) => ({ ...prev, [vehicle._id]: res.success ? res.fare : null }));
        } catch {
            setVehicleFares((prev) => ({ ...prev, [vehicle._id]: null }));
        } finally {
            setLoadingFares((prev) => ({ ...prev, [vehicle._id]: false }));
        }
    }, [pickup, dropoff, selectedTown, pickupCoords, dropoffCoords, manualDistance]);

    useEffect(() => {
        if (!pickup || !dropoff || vehicles.length === 0) { setVehicleFares({}); return; }
        vehicles.forEach((v) => fetchFareForVehicle(v));
    }, [pickup, dropoff, vehicles, fetchFareForVehicle]);

    const handlePayNow = (vehicle: any) => {
        if (!pickup || !dropoff) { setRideError('Please select pickup and dropoff.'); return; }
        const fare = vehicleFares[vehicle._id];
        if (!fare) { setRideError('Fare not available for this vehicle. Please contact the partner.'); return; }
        setRideError('');
        setSelectedVehicle(vehicle);
        setPaymentAmount(fare.estimatedTotal || fare.price || vehicle.pricePerKm * 5 + (vehicle.baseFare || 0));
        setShowPayment(true);
    };

    const handlePaymentSuccess = () => {
        setShowPayment(false);
        setPickup(''); setPickupNote(''); setDropoff(''); setDropoffNote('');
        setPickupCoords(''); setDropoffCoords(''); setManualDistance(''); setScheduledTime('');
        setVehicleFares({});
    };

    return (
        <div className="space-y-6">
            <button onClick={onBack} className="text-sm text-slate-400 hover:text-white mb-2">← Back</button>
            <SectionHeader title="Short Distance" subtitle="Quick rides — taxi, sedan, SUV, bike, or tuk-tuk." />

            <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 space-y-4">
                <div>
                    <label className="text-sm text-slate-400 mb-1 block">Town</label>
                    <select value={selectedTown} onChange={(e) => { setSelectedTown(e.target.value); setPickup(''); setDropoff(''); }} className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white">
                        <option value="">Select town</option>
                        {towns.map((t) => <option key={t._id} value={t._id}>{t.name}</option>)}
                    </select>
                </div>
                {selectedTown && (
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                            <label className="text-sm text-slate-400 mb-1 block">Pickup destination</label>
                            <select value={pickup} onChange={(e) => setPickup(e.target.value)} className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white">
                                <option value="">Pickup point</option>
                                {destinations.map((d) => <option key={d._id} value={d.name}>{d.name}</option>)}
                            </select>
                            <input value={pickupNote} onChange={(e) => setPickupNote(e.target.value)} placeholder="Specific location (e.g. Outside KCB, Stage 3)" className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white" />
                        </div>
                        <div>
                            <label className="text-sm text-slate-400 mb-1 block">Dropoff destination</label>
                            <select value={dropoff} onChange={(e) => setDropoff(e.target.value)} className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white">
                                <option value="">Dropoff point</option>
                                {destinations.map((d) => <option key={d._id} value={d.name}>{d.name}</option>)}
                            </select>
                            <input value={dropoffNote} onChange={(e) => setDropoffNote(e.target.value)} placeholder="Specific location (e.g. Near Post Office)" className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white" />
                        </div>
                    </div>
                )}
                <details className="text-sm text-slate-400">
                    <summary className="cursor-pointer hover:text-slate-300">Advanced (coordinates, manual distance)</summary>
                    <div className="grid gap-4 sm:grid-cols-3 mt-3">
                        <input value={pickupCoords} onChange={(e) => setPickupCoords(e.target.value)} placeholder="Pickup coords" className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white" />
                        <input value={dropoffCoords} onChange={(e) => setDropoffCoords(e.target.value)} placeholder="Dropoff coords" className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white" />
                        <input value={manualDistance} onChange={(e) => setManualDistance(e.target.value)} type="number" placeholder="Manual km" className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white" />
                    </div>
                </details>
            </div>

            {rideError && <div className="rounded-xl bg-red-500/10 border border-red-500/30 p-3 text-sm text-red-400">{rideError}</div>}

            <div className="flex gap-2 flex-wrap">
                {vehicleTypes.map((t) => (
                    <button key={t} onClick={() => setVehicleType(t)} className={`rounded-xl px-4 py-2 text-sm font-medium capitalize transition ${vehicleType === t ? 'bg-sky-500 text-white' : 'bg-slate-800 text-slate-400'}`}>{t || 'All'}</button>
                ))}
            </div>

            {!selectedTown ? (
                <div className="rounded-3xl border border-slate-800 bg-slate-900 p-10 text-center text-slate-400">Select a town to see available vehicles.</div>
            ) : loading ? (
                <div className="text-slate-400 py-12 text-center">Loading vehicles...</div>
            ) : vehicles.length === 0 ? (
                <div className="rounded-3xl border border-slate-800 bg-slate-900 p-10 text-center"><div className="text-5xl mb-4">🚗</div><h3 className="text-xl font-semibold text-white">No vehicles available in this town</h3></div>
            ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {vehicles.map((v) => {
                        const fare = vehicleFares[v._id];
                        const fareLoading = loadingFares[v._id];
                        const p = v.partner;
                        return (
                            <div key={v._id} className="rounded-3xl border border-slate-800 bg-slate-900 overflow-hidden hover:border-slate-700 transition">
                                {v.image ? (
                                    <img src={v.image} className="w-full h-44 object-cover" />
                                ) : (
                                    <div className="w-full h-44 bg-slate-800 flex items-center justify-center text-4xl text-slate-600">🚗</div>
                                )}
                                <div className="p-5">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h3 className="text-lg font-semibold text-white capitalize">{v.make} {v.model}</h3>
                                            <p className="text-sm text-slate-400 mt-1">{v.type} · {v.plateNumber}</p>
                                        </div>
                                        {p?.businessName && (
                                            <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 rounded-full px-2 py-1 border border-emerald-500/20">{p.businessName}</span>
                                        )}
                                    </div>
                                    <div className="mt-3 flex items-baseline gap-1">
                                        <span className="text-2xl font-bold text-white">{formatCurrency(v.pricePerKm)}</span>
                                        <span className="text-sm text-slate-400">/km</span>
                                        {v.baseFare > 0 && <span className="text-xs text-slate-500 ml-2">+ {formatCurrency(v.baseFare)} base</span>}
                                    </div>

                                    {fareLoading ? (
                                        <div className="mt-3 rounded-xl bg-slate-800/50 p-3 text-xs text-slate-400 flex items-center gap-2">
                                            <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                                            Calculating fare...
                                        </div>
                                    ) : fare ? (
                                        <div className="mt-3 rounded-xl bg-emerald-500/5 border border-emerald-500/20 p-3 space-y-1">
                                            <div className="flex items-center justify-between text-xs"><span className="text-slate-400">Fare</span><span className="text-emerald-400 font-bold text-lg">{formatCurrency(fare.estimatedTotal || fare.price)}</span></div>
                                            {fare.distanceKm && <div className="flex items-center justify-between text-xs"><span className="text-slate-500">Distance</span><span className="text-slate-300">{fare.distanceKm} km</span></div>}
                                            {fare.durationMinutes && <div className="flex items-center justify-between text-xs"><span className="text-slate-500">Duration</span><span className="text-slate-300">{fare.durationMinutes} min</span></div>}
                                            {fare.legs && (
                                                <div className="mt-2 pt-2 border-t border-emerald-500/10">
                                                    <p className="text-slate-500 mb-1">Via {fare.legs[0]?.to}</p>
                                                    {fare.legs.map((leg: any, i: number) => (
                                                        <div key={i} className="flex items-center justify-between text-xs"><span className="text-slate-500">{leg.from} → {leg.to}</span><span className="text-slate-300">{formatCurrency(leg.price)}</span></div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ) : fare === null && pickup && dropoff ? (
                                        <div className="mt-3 rounded-xl bg-amber-500/5 border border-amber-500/20 p-3 text-xs text-amber-400">
                                            Fare unavailable — contact {p?.businessName || 'partner'} below
                                        </div>
                                    ) : null}

                                    {p && (p.phone || p.supportPhone || p.email || p.supportEmail) && (
                                        <div className="mt-3 rounded-xl bg-slate-800/50 p-3 space-y-1 text-xs">
                                            <p className="text-slate-400 font-medium">Contact {p.businessName}</p>
                                            {(p.phone || p.supportPhone) && <p className="text-slate-300">📞 {p.supportPhone || p.phone}</p>}
                                            {(p.email || p.supportEmail) && <p className="text-slate-300">✉️ {p.supportEmail || p.email}</p>}
                                        </div>
                                    )}

                                    <button onClick={() => handlePayNow(v)} disabled={!pickup || !dropoff || fareLoading || !fare} className="mt-3 w-full rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition">
                                        {!pickup || !dropoff ? 'Select route' : fareLoading ? 'Calculating...' : fare ? `Pay & Book - ${formatCurrency(fare.estimatedTotal || fare.price)}` : 'Fare unavailable'}
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {showPayment && selectedVehicle && (
                <PaymentModal amount={paymentAmount} rideData={{
                    vehicleId: selectedVehicle._id,
                    pickup: { address: pickup, note: pickupNote, coordinates: pickupCoords || undefined },
                    dropoff: { address: dropoff, note: dropoffNote, coordinates: dropoffCoords || undefined },
                    rideType, scheduledTime, customerPhone: phone, fare: vehicleFares[selectedVehicle._id], seats: 1
                }} onSuccess={handlePaymentSuccess} onCancel={() => setShowPayment(false)} />
            )}
        </div>
    );
};

export default RegularTransportTab;