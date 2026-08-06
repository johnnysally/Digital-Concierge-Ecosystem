import { useEffect, useState } from 'react';
import { getTowns, createTown, updateTown, deleteTown } from '../api/locationApi';

const TownsPage = () => {
    const [towns, setTowns] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState<any>(null);
    const [form, setForm] = useState({ name: '', region: '' });
    const [message, setMessage] = useState('');

    const load = () => {
        setLoading(true);
        getTowns().then((res) => setTowns(res.towns || [])).catch(() => {}).finally(() => setLoading(false));
    };

    useEffect(() => { load(); }, []);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (editing) await updateTown(editing._id, form);
        else await createTown(form);
        setShowForm(false);
        setEditing(null);
        setForm({ name: '', region: '' });
        setMessage('Saved');
        load();
        setTimeout(() => setMessage(''), 3000);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this town and all its destinations?')) return;
        await deleteTown(id);
        load();
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Towns</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Manage supported By Digital Safaris.</p>
                </div>
                <button onClick={() => { setEditing(null); setForm({ name: '', region: '' }); setShowForm(true); }} className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500">+ Add Town</button>
            </div>

            {message && <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/30 p-3 text-sm text-emerald-400">{message}</div>}

            {showForm && (
                <form onSubmit={handleSave} className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-6 space-y-4">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{editing ? 'Edit' : 'New'} Town</h3>
                    <div className="grid gap-4 sm:grid-cols-2">
                        <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Town name" required className="rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3 text-sm text-slate-900 dark:text-white" />
                        <input value={form.region} onChange={(e) => setForm({ ...form, region: e.target.value })} placeholder="Region" className="rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3 text-sm text-slate-900 dark:text-white" />
                    </div>
                    <div className="flex gap-3">
                        <button type="submit" className="rounded-xl bg-indigo-600 px-6 py-2 text-sm font-semibold text-white hover:bg-indigo-500">Save</button>
                        <button type="button" onClick={() => { setShowForm(false); setEditing(null); }} className="rounded-xl bg-slate-200 dark:bg-slate-800 px-6 py-2 text-sm text-slate-700 dark:text-slate-300">Cancel</button>
                    </div>
                </form>
            )}

            {loading ? <div className="text-center py-8 text-slate-400">Loading...</div> : towns.length === 0 ? (
                <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-10 text-center text-slate-400">No towns added yet.</div>
            ) : (
                <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 overflow-hidden">
                    <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800 text-sm">
                        <thead className="bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400">
                            <tr>
                                <th className="px-4 py-3 text-left">Name</th>
                                <th className="px-4 py-3 text-left">Region</th>
                                <th className="px-4 py-3 text-left">Status</th>
                                <th className="px-4 py-3 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                            {towns.map((t) => (
                                <tr key={t._id} className="hover:bg-slate-50 dark:hover:bg-slate-900">
                                    <td className="px-4 py-3 text-slate-900 dark:text-white font-medium">{t.name}</td>
                                    <td className="px-4 py-3 text-slate-500">{t.region || '—'}</td>
                                    <td className="px-4 py-3"><span className={`px-2 py-1 rounded-full text-xs ${t.isActive ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300' : 'bg-slate-100 text-slate-500 dark:bg-slate-500/10 dark:text-slate-400'}`}>{t.isActive ? 'Active' : 'Inactive'}</span></td>
                                    <td className="px-4 py-3 space-x-2">
                                        <button onClick={() => { setEditing(t); setForm({ name: t.name, region: t.region }); setShowForm(true); }} className="text-indigo-500 hover:underline text-xs">Edit</button>
                                        <button onClick={() => handleDelete(t._id)} className="text-red-500 hover:underline text-xs">Delete</button>
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

export default TownsPage;