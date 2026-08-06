import { useEffect, useState } from 'react';
import { getVehicles, addMaintenanceRecord, getMaintenanceHistory } from '../../api/transport/vehicleApi';

const MaintenancePage = () => {
    const [vehicles, setVehicles] = useState<any[]>([]);
    const [selectedVehicle, setSelectedVehicle] = useState<any>(null);
    const [history, setHistory] = useState<any[]>([]);
    const [form, setForm] = useState({ type: 'routine', description: '', cost: '', garage: '', notes: '', condition: 'good' });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        getVehicles().then((res) => setVehicles(res.vehicles || [])).catch(() => {}).finally(() => setLoading(false));
    }, []);

    const handleSelectVehicle = async (id: string) => {
        try {
            const res = await getMaintenanceHistory(id);
            setSelectedVehicle(id);
            setHistory(res.maintenance?.serviceHistory || []);
        } catch {}
    };

    const handleAddRecord = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedVehicle) return;
        setSaving(true);
        try {
            await addMaintenanceRecord(selectedVehicle, { ...form, cost: Number(form.cost) || 0 });
            setMessage('Record added');
            setForm({ type: 'routine', description: '', cost: '', garage: '', notes: '', condition: 'good' });
            const res = await getMaintenanceHistory(selectedVehicle);
            setHistory(res.maintenance?.serviceHistory || []);
            setTimeout(() => setMessage(''), 3000);
        } catch {}
        setSaving(false);
    };

    if (loading) return <div className="text-slate-400 py-12 text-center">Loading...</div>;

    return (
        <div className="space-y-6">
            <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6">
                <p className="text-sm font-semibold uppercase tracking-[0.35em] text-emerald-400">Fleet Care</p>
                <h2 className="mt-2 text-3xl font-semibold text-white">Maintenance</h2>
            </div>

            {message && <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/30 p-4 text-sm text-emerald-400">{message}</div>}

            <div className="grid gap-6 lg:grid-cols-3">
                <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-5">
                    <h3 className="text-sm font-semibold text-white mb-3">Select Vehicle</h3>
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                        {vehicles.map((v) => (
                            <button key={v._id} onClick={() => handleSelectVehicle(v._id)}
                                className={`w-full text-left p-3 rounded-xl text-sm transition ${selectedVehicle === v._id ? 'bg-sky-500/20 text-white border border-sky-500/50' : 'bg-slate-900 text-slate-300 hover:bg-slate-800'}`}>
                                {v.make} {v.model} · {v.plateNumber}
                                <span className="block text-xs text-slate-500">{v.type} · {v.status}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="lg:col-span-2 space-y-6">
                    {selectedVehicle && (
                        <form onSubmit={handleAddRecord} className="rounded-3xl border border-slate-800 bg-slate-950/80 p-6 space-y-4">
                            <h3 className="text-lg font-semibold text-white">Add Record</h3>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white">
                                    <option value="routine">Routine</option>
                                    <option value="repair">Repair</option>
                                    <option value="inspection">Inspection</option>
                                    <option value="emergency">Emergency</option>
                                    <option value="parts_replacement">Parts Replacement</option>
                                </select>
                                <input value={form.cost} onChange={(e) => setForm({ ...form, cost: e.target.value })} type="number" placeholder="Cost (KES)" className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white" />
                                <input value={form.garage} onChange={(e) => setForm({ ...form, garage: e.target.value })} placeholder="Garage" className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white" />
                                <select value={form.condition} onChange={(e) => setForm({ ...form, condition: e.target.value })} className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white">
                                    <option value="excellent">Excellent</option>
                                    <option value="good">Good</option>
                                    <option value="fair">Fair</option>
                                    <option value="needs_service">Needs Service</option>
                                    <option value="grounded">Grounded</option>
                                </select>
                                <input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Description" className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white" />
                                <input value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Notes" className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white" />
                            </div>
                            <button type="submit" disabled={saving} className="rounded-xl bg-sky-600 px-6 py-3 text-sm font-semibold text-white hover:bg-sky-500 disabled:opacity-50">{saving ? 'Saving...' : 'Add Record'}</button>
                        </form>
                    )}

                    {history.length > 0 && (
                        <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-6">
                            <h3 className="text-lg font-semibold text-white mb-4">Service History</h3>
                            <div className="space-y-3">
                                {history.map((h: any, i: number) => (
                                    <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-slate-900">
                                        <div>
                                            <p className="text-white text-sm capitalize">{h.type}</p>
                                            <p className="text-xs text-slate-400">{h.description} {h.garage && `· ${h.garage}`}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-emerald-400 text-sm font-semibold">{h.cost ? `KES ${h.cost}` : ''}</p>
                                            <p className="text-xs text-slate-500">{new Date(h.date).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MaintenancePage;