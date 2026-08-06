import { useEffect, useState } from 'react';
import { getTowns } from '../api/locationApi';
import { getDestinations, createDestination, updateDestination, deleteDestination } from '../api/locationApi';

const destTypes = ['stage', 'landmark', 'estate', 'mall', 'office', 'other'];

const DestinationsPage = () => {
    const [towns, setTowns] = useState<any[]>([]);
    const [selectedTown, setSelectedTown] = useState('');
    const [destinations, setDestinations] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState<any>(null);
    const [form, setForm] = useState({ town: '', name: '', type: 'stage' });
    const [message, setMessage] = useState('');

    useEffect(() => {
        getTowns().then((res) => setTowns(res.towns || [])).catch(() => {});
    }, []);

    const loadDestinations = (townId: string) => {
        setLoading(true);
        setSelectedTown(townId);
        getDestinations({ town: townId }).then((res) => setDestinations(res.destinations || [])).catch(() => {}).finally(() => setLoading(false));
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (editing) await updateDestination(editing._id, form);
        else await createDestination(form);
        setShowForm(false);
        setEditing(null);
        setForm({ town: selectedTown, name: '', type: 'stage' });
        setMessage('Saved');
        loadDestinations(selectedTown);
        setTimeout(() => setMessage(''), 3000);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this destination?')) return;
        await deleteDestination(id);
        loadDestinations(selectedTown);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Destinations</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Manage pickup/dropoff points within towns.</p>
                </div>
            </div>

            <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Select Town</label>
                <select value={selectedTown} onChange={(e) => { setSelectedTown(e.target.value); loadDestinations(e.target.value); }} className="mt-1 w-full sm:w-64 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3 text-sm text-slate-900 dark:text-white">
                    <option value="">Choose a town...</option>
                    {towns.filter(t => t.isActive).map((t) => <option key={t._id} value={t._id}>{t.name}</option>)}
                </select>
            </div>

            {message && <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/30 p-3 text-sm text-emerald-400">{message}</div>}

            {selectedTown && (
                <>
                    <button onClick={() => { setEditing(null); setForm({ town: selectedTown, name: '', type: 'stage' }); setShowForm(true); }} className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500">+ Add Destination</button>

                    {showForm && (
                        <form onSubmit={handleSave} className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-6 space-y-4">
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{editing ? 'Edit' : 'New'} Destination</h3>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Destination name" required className="rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3 text-sm text-slate-900 dark:text-white" />
                                <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3 text-sm text-slate-900 dark:text-white">
                                    {destTypes.map((t) => <option key={t} value={t}>{t}</option>)}
                                </select>
                            </div>
                            <div className="flex gap-3">
                                <button type="submit" className="rounded-xl bg-indigo-600 px-6 py-2 text-sm font-semibold text-white hover:bg-indigo-500">Save</button>
                                <button type="button" onClick={() => { setShowForm(false); setEditing(null); }} className="rounded-xl bg-slate-200 dark:bg-slate-800 px-6 py-2 text-sm text-slate-700 dark:text-slate-300">Cancel</button>
                            </div>
                        </form>
                    )}
                </>
            )}

            {selectedTown && loading ? <div className="text-center py-8 text-slate-400">Loading...</div> : selectedTown && destinations.length === 0 ? (
                <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-10 text-center text-slate-400">No destinations added for this town.</div>
            ) : selectedTown && (
                <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 overflow-hidden">
                    <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800 text-sm">
                        <thead className="bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400">
                            <tr>
                                <th className="px-4 py-3 text-left">Name</th>
                                <th className="px-4 py-3 text-left">Type</th>
                                <th className="px-4 py-3 text-left">Status</th>
                                <th className="px-4 py-3 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                            {destinations.map((d) => (
                                <tr key={d._id} className="hover:bg-slate-50 dark:hover:bg-slate-900">
                                    <td className="px-4 py-3 text-slate-900 dark:text-white font-medium">{d.name}</td>
                                    <td className="px-4 py-3 text-slate-500 capitalize">{d.type}</td>
                                    <td className="px-4 py-3"><span className={`px-2 py-1 rounded-full text-xs ${d.isActive ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300' : 'bg-slate-100 text-slate-500 dark:bg-slate-500/10 dark:text-slate-400'}`}>{d.isActive ? 'Active' : 'Inactive'}</span></td>
                                    <td className="px-4 py-3 space-x-2">
                                        <button onClick={() => { setEditing(d); setForm({ town: d.town?._id || d.town, name: d.name, type: d.type }); setShowForm(true); }} className="text-indigo-500 hover:underline text-xs">Edit</button>
                                        <button onClick={() => handleDelete(d._id)} className="text-red-500 hover:underline text-xs">Delete</button>
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

export default DestinationsPage;