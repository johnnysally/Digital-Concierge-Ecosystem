import React, { useEffect, useState } from 'react';
import { getVehicles, addMaintenanceRecord, getMaintenanceHistory } from '../../api/transport/vehicleApi';

const MaintenancePage = () => {
    const [vehicles, setVehicles] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedVehicle, setSelectedVehicle] = useState<any>(null);
    const [history, setHistory] = useState<any[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({ type: 'routine', description: '', cost: 0, garage: '', notes: '', condition: 'good' });
    const [message, setMessage] = useState('');

    useEffect(() => {
        getVehicles().then((res) => setVehicles(res.vehicles || [])).finally(() => setLoading(false));
    }, []);

    const selectVehicle = async (vehicle: any) => {
        setSelectedVehicle(vehicle);
        try {
            const res = await getMaintenanceHistory(vehicle._id);
            setHistory(res.maintenance?.serviceHistory || []);
        } catch { setHistory([]); }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedVehicle) return;
        try {
            await addMaintenanceRecord(selectedVehicle._id, { ...form, date: new Date().toISOString() });
            setMessage('Maintenance record added.');
            setShowForm(false);
            setForm({ type: 'routine', description: '', cost: 0, garage: '', notes: '', condition: 'good' });
            selectVehicle(selectedVehicle);
            setTimeout(() => setMessage(''), 3000);
        } catch { setMessage('Failed to add record.'); }
    };

    if (loading) return <div className="p-8 text-slate-400">Loading fleet...</div>;

    return (
        <div className="space-y-8">
            <div>
                <p className="text-sm font-semibold uppercase tracking-[0.35em] text-emerald-400">Maintenance</p>
                <h1 className="mt-3 text-3xl font-semibold text-white">Vehicle maintenance</h1>
                <p className="mt-3 max-w-2xl text-sm text-slate-400">Track maintenance status, schedule checks, and manage vehicle service events.</p>
            </div>

            {message && <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/30 p-3 text-sm text-emerald-400">{message}</div>}

            <div className="grid gap-6 lg:grid-cols-3">
                <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Fleet ({vehicles.length})</h3>
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                        {vehicles.map((v) => (
                            <div key={v._id} onClick={() => selectVehicle(v)}
                                className={`rounded-2xl border p-3 cursor-pointer transition-colors ${selectedVehicle?._id === v._id ? 'border-emerald-500 bg-emerald-500/10' : 'border-slate-800 bg-slate-950 hover:border-slate-700'}`}>
                                <p className="font-medium text-white text-sm">{v.make} {v.model}</p>
                                <p className="text-xs text-slate-400">{v.plateNumber}</p>
                                <div className="flex items-center gap-2 mt-2">
                                    <span className={`px-2 py-0.5 rounded-full text-xs ${
                                        v.maintenance?.condition === 'excellent' ? 'bg-emerald-500/20 text-emerald-400' :
                                        v.maintenance?.condition === 'good' ? 'bg-sky-500/20 text-sky-400' :
                                        v.maintenance?.condition === 'fair' ? 'bg-amber-500/20 text-amber-400' :
                                        'bg-rose-500/20 text-rose-400'
                                    }`}>{v.maintenance?.condition || 'unknown'}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="lg:col-span-2 rounded-3xl border border-slate-800 bg-slate-900/80 p-6">
                    {!selectedVehicle ? (
                        <div className="flex items-center justify-center h-64 text-slate-400">Select a vehicle to view maintenance history.</div>
                    ) : (
                        <>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-white">
                                    {selectedVehicle.make} {selectedVehicle.model} - {selectedVehicle.plateNumber}
                                </h3>
                                <button onClick={() => setShowForm(!showForm)}
                                    className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-500">
                                    {showForm ? 'Cancel' : '+ Add Record'}
                                </button>
                            </div>

                            {showForm && (
                                <form onSubmit={handleSubmit} className="mb-6 p-4 rounded-2xl border border-slate-800 bg-slate-950 space-y-3">
                                    <div className="grid gap-3 sm:grid-cols-2">
                                        <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}
                                            className="rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white">
                                            <option value="routine">Routine</option>
                                            <option value="repair">Repair</option>
                                            <option value="inspection">Inspection</option>
                                            <option value="emergency">Emergency</option>
                                            <option value="parts_replacement">Parts Replacement</option>
                                        </select>
                                        <select value={form.condition} onChange={(e) => setForm({ ...form, condition: e.target.value })}
                                            className="rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white">
                                            <option value="excellent">Excellent</option>
                                            <option value="good">Good</option>
                                            <option value="fair">Fair</option>
                                            <option value="needs_service">Needs Service</option>
                                            <option value="grounded">Grounded</option>
                                        </select>
                                    </div>
                                    <input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Description" required
                                        className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white" />
                                    <div className="grid gap-3 sm:grid-cols-2">
                                        <input type="number" value={form.cost} onChange={(e) => setForm({ ...form, cost: +e.target.value })} placeholder="Cost"
                                            className="rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white" />
                                        <input value={form.garage} onChange={(e) => setForm({ ...form, garage: e.target.value })} placeholder="Garage"
                                            className="rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white" />
                                    </div>
                                    <input value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Notes"
                                        className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white" />
                                    <button type="submit" className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-500">Save Record</button>
                                </form>
                            )}

                            <div className="space-y-2 max-h-80 overflow-y-auto">
                                {history.length === 0 ? (
                                    <p className="text-sm text-slate-400">No maintenance records.</p>
                                ) : (
                                    history.map((record: any, i: number) => (
                                        <div key={i} className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs font-semibold text-emerald-400 capitalize">{record.type.replace('_', ' ')}</span>
                                                <span className="text-xs text-slate-500">{new Date(record.date).toLocaleDateString()}</span>
                                            </div>
                                            <p className="text-sm text-white mt-1">{record.description}</p>
                                            <div className="flex gap-4 mt-2 text-xs text-slate-400">
                                                {record.cost > 0 && <span>Cost: KES {record.cost.toLocaleString()}</span>}
                                                {record.garage && <span>Garage: {record.garage}</span>}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MaintenancePage;