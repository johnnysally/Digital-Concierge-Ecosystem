import { useEffect, useState } from 'react';
import { getDestinationPrices, createDestinationPrice, updateDestinationPrice, deleteDestinationPrice, calculateFare } from '../../api/transport/pricingApi';
import { getDestinations } from '../../api/customer/locationApi';
import { formatCurrency } from '../../utils/formatCurrency';

const vehicleTypes = ['sedan', 'suv', 'bike', 'tuk_tuk'];

const methodLabels: Record<string, string> = {
    destination_price: 'Fixed Price',
    google_maps: 'Google Maps',
    haversine: 'Haversine (×1.3)',
    manual: 'Manual Distance',
};

const methodColors: Record<string, string> = {
    destination_price: 'bg-emerald-500/10 text-emerald-300',
    google_maps: 'bg-sky-500/10 text-sky-300',
    haversine: 'bg-amber-500/10 text-amber-300',
    manual: 'bg-slate-500/10 text-slate-300',
};

const getStoredSession = () => {
    try { return JSON.parse(localStorage.getItem('digitalsafaris_transport') || '{}'); } catch { return {}; }
};

const ShortPricingPage = () => {
    const session = getStoredSession();
    const partnerTowns = session?.user?.towns || [];

    const [prices, setPrices] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState<any>(null);
    const [form, setForm] = useState({ from: '', to: '', price: '', estimatedDuration: '', estimatedDistance: '', vehicleType: 'sedan' });

    const [selectedTown, setSelectedTown] = useState('');
    const [fromDestinations, setFromDestinations] = useState<any[]>([]);
    const [toDestinations, setToDestinations] = useState<any[]>([]);

    const [calcTown, setCalcTown] = useState('');
    const [calcFrom, setCalcFrom] = useState('');
    const [calcTo, setCalcTo] = useState('');
    const [calcDestinations, setCalcDestinations] = useState<any[]>([]);
    const [calcVehicleType, setCalcVehicleType] = useState('sedan');
    const [pickupCoords, setPickupCoords] = useState('');
    const [dropoffCoords, setDropoffCoords] = useState('');
    const [manualDistance, setManualDistance] = useState('');
    const [fareResult, setFareResult] = useState<any>(null);
    const [calculating, setCalculating] = useState(false);

    const loadPrices = () => {
        setLoading(true);
        getDestinationPrices({ isLongDistance: false })
            .then((res) => setPrices(res.destinationPrices || []))
            .catch(() => setPrices([]))
            .finally(() => setLoading(false));
    };

    useEffect(() => { loadPrices(); }, []);

    const handleTownChange = async (townId: string) => {
        setSelectedTown(townId);
        setForm({ ...form, from: '', to: '' });
        if (townId) {
            const res = await getDestinations(townId);
            setFromDestinations(res.destinations || []);
            setToDestinations(res.destinations || []);
        } else {
            setFromDestinations([]);
            setToDestinations([]);
        }
    };

    const handleCalcTownChange = async (townId: string) => {
        setCalcTown(townId);
        setCalcFrom('');
        setCalcTo('');
        if (townId) {
            const res = await getDestinations(townId);
            setCalcDestinations(res.destinations || []);
        } else {
            setCalcDestinations([]);
        }
    };

    const handleSave = async () => {
        const data = {
            ...form,
            price: Number(form.price),
            estimatedDuration: form.estimatedDuration ? Number(form.estimatedDuration) : undefined,
            estimatedDistance: form.estimatedDistance ? Number(form.estimatedDistance) : undefined,
        };
        if (editing) await updateDestinationPrice(editing._id, data);
        else await createDestinationPrice(data);
        setShowForm(false);
        setEditing(null);
        setForm({ from: '', to: '', price: '', estimatedDuration: '', estimatedDistance: '', vehicleType: 'sedan' });
        setSelectedTown('');
        loadPrices();
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete?')) return;
        await deleteDestinationPrice(id);
        loadPrices();
    };

    const handleCalculate = async () => {
        if (!calcFrom || !calcTo) return;
        setCalculating(true);
        try {
            const res = await calculateFare({
                from: calcFrom, to: calcTo, vehicleType: calcVehicleType,
                pickupCoords: pickupCoords || undefined,
                dropoffCoords: dropoffCoords || undefined,
                manualDistance: manualDistance ? Number(manualDistance) : undefined,
            });
            setFareResult(res);
        } catch { setFareResult({ success: false, message: 'Failed' }); }
        setCalculating(false);
    };

    return (
        <div className="space-y-6">
            <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6">
                <p className="text-sm font-semibold uppercase tracking-[0.35em] text-emerald-400">Pricing</p>
                <h2 className="mt-2 text-3xl font-semibold text-white">Destination Prices</h2>
                <p className="mt-2 text-sm text-slate-400">Set fixed prices for routes within your towns.</p>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Fare Calculator</h3>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <select value={calcTown} onChange={(e) => handleCalcTownChange(e.target.value)} className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white">
                        <option value="">Select town</option>
                        {partnerTowns.map((t: any) => <option key={t._id} value={t._id}>{t.name}</option>)}
                    </select>
                    <select value={calcFrom} onChange={(e) => setCalcFrom(e.target.value)} className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white" disabled={!calcTown}>
                        <option value="">From destination</option>
                        {calcDestinations.map((d: any) => <option key={d._id} value={d.name}>{d.name}</option>)}
                    </select>
                    <select value={calcTo} onChange={(e) => setCalcTo(e.target.value)} className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white" disabled={!calcTown}>
                        <option value="">To destination</option>
                        {calcDestinations.map((d: any) => <option key={d._id} value={d.name}>{d.name}</option>)}
                    </select>
                    <select value={calcVehicleType} onChange={(e) => setCalcVehicleType(e.target.value)} className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white">
                        {vehicleTypes.map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                    <input value={pickupCoords} onChange={(e) => setPickupCoords(e.target.value)} placeholder="Pickup coords" className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white" />
                    <input value={dropoffCoords} onChange={(e) => setDropoffCoords(e.target.value)} placeholder="Dropoff coords" className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white" />
                    <input value={manualDistance} onChange={(e) => setManualDistance(e.target.value)} type="number" placeholder="Manual km" className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white" />
                </div>
                <button onClick={handleCalculate} disabled={calculating || !calcFrom || !calcTo} className="mt-4 rounded-xl bg-sky-600 px-6 py-3 text-sm font-semibold text-white hover:bg-sky-500 disabled:opacity-50">
                    {calculating ? 'Calculating...' : 'Calculate'}
                </button>
                {fareResult?.success && fareResult.fare && (
                    <div className="mt-4 rounded-2xl border border-slate-800 bg-slate-900 p-5 space-y-2">
                        <div className="flex items-center justify-between"><span className="text-slate-400">Total</span><span className="text-2xl font-bold text-emerald-400">{formatCurrency(fareResult.fare.estimatedTotal || fareResult.fare.price)}</span></div>
                        {fareResult.fare.type === 'dynamic' && (
                            <>
                                <div className="flex items-center justify-between text-sm"><span className="text-slate-400">Distance</span><span className="text-white">{fareResult.fare.distanceKm?.toFixed(1)} km</span></div>
                                {fareResult.fare.durationMinutes && <div className="flex items-center justify-between text-sm"><span className="text-slate-400">Duration</span><span className="text-white">{fareResult.fare.durationMinutes} min</span></div>}
                                <div className="flex items-center justify-between text-sm"><span className="text-slate-400">Rate</span><span className="text-white">{formatCurrency(fareResult.fare.pricePerKm)}/km</span></div>
                            </>
                        )}
                        {fareResult.fare.type === 'fixed' && (
                            <>
                                <div className="flex items-center justify-between text-sm"><span className="text-slate-400">Est. Distance</span><span className="text-white">{fareResult.fare.distanceKm ? `${fareResult.fare.distanceKm} km` : 'Unknown'}</span></div>
                                {fareResult.fare.durationMinutes && <div className="flex items-center justify-between text-sm"><span className="text-slate-400">Est. Duration</span><span className="text-white">{fareResult.fare.durationMinutes} min</span></div>}
                            </>
                        )}
                        <div className="flex items-center justify-between text-sm"><span className="text-slate-400">Method</span><span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${methodColors[fareResult.fare.method]}`}>{methodLabels[fareResult.fare.method]}</span></div>
                    </div>
                )}
                {fareResult?.success === false && <div className="mt-4 rounded-xl bg-red-500/10 border border-red-500/30 p-4 text-sm text-red-400">{fareResult.message}</div>}
            </div>

            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">Fixed Prices ({prices.length})</h3>
                <button onClick={() => { setEditing(null); setForm({ from: '', to: '', price: '', estimatedDuration: '', estimatedDistance: '', vehicleType: 'sedan' }); setSelectedTown(''); setShowForm(true); }} className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-500">+ Add Price</button>
            </div>

            {showForm && (
                <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-6 space-y-4">
                    <h3 className="text-lg font-semibold text-white">{editing ? 'Edit' : 'New'} Price</h3>
                    <div className="grid gap-4 sm:grid-cols-2">
                        <select value={selectedTown} onChange={(e) => handleTownChange(e.target.value)} className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white">
                            <option value="">Select town</option>
                            {partnerTowns.map((t: any) => <option key={t._id} value={t._id}>{t.name}</option>)}
                        </select>
                        <select value={form.from} onChange={(e) => setForm({ ...form, from: e.target.value })} className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white" disabled={!selectedTown}>
                            <option value="">From destination</option>
                            {fromDestinations.map((d: any) => <option key={d._id} value={d.name}>{d.name}</option>)}
                        </select>
                        <select value={form.to} onChange={(e) => setForm({ ...form, to: e.target.value })} className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white" disabled={!selectedTown}>
                            <option value="">To destination</option>
                            {toDestinations.map((d: any) => <option key={d._id} value={d.name}>{d.name}</option>)}
                        </select>
                        <input value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} type="number" placeholder="Price (KES)" className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white" />
                        <input value={form.estimatedDistance} onChange={(e) => setForm({ ...form, estimatedDistance: e.target.value })} type="number" placeholder="Est. distance (km)" className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white" />
                        <input value={form.estimatedDuration} onChange={(e) => setForm({ ...form, estimatedDuration: e.target.value })} type="number" placeholder="Est. duration (min)" className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white" />
                        <select value={form.vehicleType} onChange={(e) => setForm({ ...form, vehicleType: e.target.value })} className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white">
                            {vehicleTypes.map((t) => <option key={t} value={t}>{t}</option>)}
                        </select>
                    </div>
                    <div className="flex gap-3">
                        <button onClick={handleSave} className="rounded-xl bg-emerald-600 px-6 py-2 text-sm font-semibold text-white hover:bg-emerald-500">Save</button>
                        <button onClick={() => { setShowForm(false); setEditing(null); }} className="rounded-xl bg-slate-700 px-6 py-2 text-sm text-white hover:bg-slate-600">Cancel</button>
                    </div>
                </div>
            )}

            {loading ? <div className="text-slate-400 py-8 text-center">Loading...</div> : prices.length === 0 ? (
                <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-10 text-center text-slate-400">No prices set.</div>
            ) : (
                <div className="overflow-x-auto rounded-3xl border border-slate-800 bg-slate-950/80">
                    <table className="min-w-full divide-y divide-slate-800 text-sm">
                        <thead className="bg-slate-900 text-slate-400">
                            <tr>
                                <th className="px-4 py-3 text-left">From</th>
                                <th className="px-4 py-3 text-left">To</th>
                                <th className="px-4 py-3 text-left">Vehicle</th>
                                <th className="px-4 py-3 text-left">Price</th>
                                <th className="px-4 py-3 text-left">Distance</th>
                                <th className="px-4 py-3 text-left">Duration</th>
                                <th className="px-4 py-3 text-left">Status</th>
                                <th className="px-4 py-3 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {prices.map((p) => (
                                <tr key={p._id} className="hover:bg-slate-900">
                                    <td className="px-4 py-3 text-white">{p.from}</td>
                                    <td className="px-4 py-3 text-white">{p.to}</td>
                                    <td className="px-4 py-3 text-slate-300 capitalize">{p.vehicleType}</td>
                                    <td className="px-4 py-3 text-emerald-400 font-semibold">{formatCurrency(p.price)}</td>
                                    <td className="px-4 py-3 text-slate-300">{p.estimatedDistance ? `${p.estimatedDistance} km` : '—'}</td>
                                    <td className="px-4 py-3 text-slate-300">{p.estimatedDuration ? `${p.estimatedDuration} min` : '—'}</td>
                                    <td className="px-4 py-3"><span className={`px-2 py-1 rounded-full text-xs ${p.isActive ? 'bg-emerald-500/10 text-emerald-300' : 'bg-slate-500/10 text-slate-400'}`}>{p.isActive ? 'Active' : 'Inactive'}</span></td>
                                    <td className="px-4 py-3 space-x-2">
                                        <button onClick={() => { setEditing(p); setForm({ from: p.from, to: p.to, price: String(p.price), estimatedDuration: p.estimatedDuration ? String(p.estimatedDuration) : '', estimatedDistance: p.estimatedDistance ? String(p.estimatedDistance) : '', vehicleType: p.vehicleType }); setSelectedTown(''); setShowForm(true); }} className="text-sky-400 hover:underline text-xs">Edit</button>
                                        <button onClick={() => handleDelete(p._id)} className="text-red-400 hover:underline text-xs">Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default ShortPricingPage;