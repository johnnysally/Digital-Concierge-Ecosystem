import { useEffect, useState } from 'react';
import { getPromotions, createPromotion, updatePromotion, deletePromotion } from '../../api/transport/promotionApi';

const PromotionsPage = () => {
    const [promos, setPromos] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState<any>(null);
    const [form, setForm] = useState({ code: '', discountType: 'percentage', discountValue: '', expiryDate: '', isActive: true });

    const load = () => {
        setLoading(true);
        getPromotions().then((res) => setPromos(res.promotions || [])).catch(() => {}).finally(() => setLoading(false));
    };

    useEffect(() => { load(); }, []);

    const handleSave = async () => {
        const data = { ...form, discountValue: Number(form.discountValue) };
        if (editing) await updatePromotion(editing._id, data);
        else await createPromotion(data);
        setShowForm(false);
        setEditing(null);
        setForm({ code: '', discountType: 'percentage', discountValue: '', expiryDate: '', isActive: true });
        load();
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete?')) return;
        await deletePromotion(id);
        load();
    };

    return (
        <div className="space-y-6">
            <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6">
                <p className="text-sm font-semibold uppercase tracking-[0.35em] text-emerald-400">Marketing</p>
                <h2 className="mt-2 text-3xl font-semibold text-white">Promotions</h2>
            </div>

            <div className="flex justify-end">
                <button onClick={() => { setEditing(null); setForm({ code: '', discountType: 'percentage', discountValue: '', expiryDate: '', isActive: true }); setShowForm(true); }} className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-500">+ New Promo</button>
            </div>

            {showForm && (
                <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-6 space-y-4">
                    <h3 className="text-lg font-semibold text-white">{editing ? 'Edit' : 'New'} Promotion</h3>
                    <div className="grid gap-4 sm:grid-cols-2">
                        <input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} placeholder="Code (e.g. SAVE10)" className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white" />
                        <select value={form.discountType} onChange={(e) => setForm({ ...form, discountType: e.target.value })} className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white">
                            <option value="percentage">Percentage</option>
                            <option value="fixed">Fixed Amount</option>
                        </select>
                        <input value={form.discountValue} onChange={(e) => setForm({ ...form, discountValue: e.target.value })} type="number" placeholder={form.discountType === 'percentage' ? 'Discount %' : 'Amount (KES)'} className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white" />
                        <input value={form.expiryDate} onChange={(e) => setForm({ ...form, expiryDate: e.target.value })} type="date" className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white" />
                    </div>
                    <div className="flex gap-3">
                        <button onClick={handleSave} className="rounded-xl bg-emerald-600 px-6 py-2 text-sm font-semibold text-white hover:bg-emerald-500">Save</button>
                        <button onClick={() => { setShowForm(false); setEditing(null); }} className="rounded-xl bg-slate-700 px-6 py-2 text-sm text-white hover:bg-slate-600">Cancel</button>
                    </div>
                </div>
            )}

            {loading ? <div className="text-slate-400 py-8 text-center">Loading...</div> : promos.length === 0 ? (
                <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-10 text-center text-slate-400">No promotions.</div>
            ) : (
                <div className="overflow-x-auto rounded-3xl border border-slate-800 bg-slate-950/80">
                    <table className="min-w-full divide-y divide-slate-800 text-sm">
                        <thead className="bg-slate-900 text-slate-400">
                            <tr>
                                <th className="px-4 py-3 text-left">Code</th>
                                <th className="px-4 py-3 text-left">Discount</th>
                                <th className="px-4 py-3 text-left">Expiry</th>
                                <th className="px-4 py-3 text-left">Status</th>
                                <th className="px-4 py-3 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {promos.map((p) => (
                                <tr key={p._id} className="hover:bg-slate-900">
                                    <td className="px-4 py-3 text-white font-mono">{p.code}</td>
                                    <td className="px-4 py-3 text-slate-300">{p.discountType === 'percentage' ? `${p.discountValue}%` : `KES ${p.discountValue}`}</td>
                                    <td className="px-4 py-3 text-slate-300">{p.expiryDate ? new Date(p.expiryDate).toLocaleDateString() : '—'}</td>
                                    <td className="px-4 py-3"><span className={`px-2 py-1 rounded-full text-xs ${p.isActive ? 'bg-emerald-500/10 text-emerald-300' : 'bg-slate-500/10 text-slate-400'}`}>{p.isActive ? 'Active' : 'Inactive'}</span></td>
                                    <td className="px-4 py-3 space-x-2">
                                        <button onClick={() => { setEditing(p); setForm({ code: p.code, discountType: p.discountType, discountValue: String(p.discountValue), expiryDate: p.expiryDate ? p.expiryDate.split('T')[0] : '', isActive: p.isActive }); setShowForm(true); }} className="text-sky-400 hover:underline text-xs">Edit</button>
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

export default PromotionsPage;