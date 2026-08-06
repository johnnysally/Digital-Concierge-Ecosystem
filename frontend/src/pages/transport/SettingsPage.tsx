import { useEffect, useState } from 'react';
import { getSettings, updateSettings } from '../../api/transport/settingsApi';
import { updateProfile, getProfile } from '../../api/transport/authApi';
import { getTowns } from '../../api/customer/locationApi';

const SettingsPage = () => {
    const [form, setForm] = useState<any>({});
    const [towns, setTowns] = useState<any[]>([]);
    const [selectedTowns, setSelectedTowns] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        getTowns().then((res) => setTowns(res.towns || [])).catch(() => {});
    }, []);

    useEffect(() => {
        Promise.all([getSettings(), getProfile()])
            .then(([settingsRes, profileRes]) => {
                const user = profileRes.user || profileRes;
                setForm({
                    ...settingsRes.settings,
                    payoutMethods: user?.payoutMethods || [],
                    businessType: user?.businessType || 'ride_hailing',
                });
                setSelectedTowns(user?.towns?.map((t: any) => t._id || t) || []);
            })
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            await updateSettings(form);
            await updateProfile({
                towns: selectedTowns,
                payoutMethods: form.payoutMethods,
                businessType: form.businessType,
            });
            setMessage('Settings saved');
            setTimeout(() => setMessage(''), 3000);
        } catch {}
        setSaving(false);
    };

    const toggleTown = (id: string) => {
        setSelectedTowns((prev) => prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]);
    };

    const updatePayoutMethod = (i: number, field: string, value: string) => {
        const updated = [...(form.payoutMethods || [])];
        updated[i] = { ...updated[i], [field]: value };
        setForm({ ...form, payoutMethods: updated });
    };

    const removePayoutMethod = (i: number) => {
        const updated = (form.payoutMethods || []).filter((_: any, idx: number) => idx !== i);
        setForm({ ...form, payoutMethods: updated });
    };

    const addPayoutMethod = () => {
        const updated = [...(form.payoutMethods || []), { type: 'mpesa_send', accountNumber: '', accountName: '', label: '', isDefault: false }];
        setForm({ ...form, payoutMethods: updated });
    };

    if (loading) return <div className="text-slate-400 py-12 text-center">Loading...</div>;

    return (
        <div className="space-y-6 max-w-2xl">
            <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6">
                <p className="text-sm font-semibold uppercase tracking-[0.35em] text-emerald-400">Configuration</p>
                <h2 className="mt-2 text-3xl font-semibold text-white">Settings</h2>
            </div>

            {message && <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/30 p-4 text-sm text-emerald-400">{message}</div>}

            <form onSubmit={handleSave} className="space-y-6">
                <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-6 space-y-4">
                    <h3 className="text-lg font-semibold text-white">Business</h3>
                    <div className="grid gap-4 sm:grid-cols-2">
                        <input value={form.businessName || ''} onChange={(e) => setForm({ ...form, businessName: e.target.value })} placeholder="Business name" className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white" />
                        <input value={form.contactEmail || ''} onChange={(e) => setForm({ ...form, contactEmail: e.target.value })} placeholder="Contact email" className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white" />
                        <input value={form.contactPhone || ''} onChange={(e) => setForm({ ...form, contactPhone: e.target.value })} placeholder="Contact phone" className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white" />
                        <input value={form.address || ''} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder="Address" className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white" />
                    </div>

                    <div>
                        <span className="text-sm text-slate-400 mb-2 block">Business type</span>
                        <select value={form.businessType || 'ride_hailing'} onChange={(e) => setForm({ ...form, businessType: e.target.value })} className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white w-full">
                            <option value="ride_hailing">Ride Hailing</option>
                            <option value="taxi">Taxi</option>
                            <option value="shuttle">Shuttle</option>
                            <option value="bus">Bus</option>
                            <option value="car_rental">Car Rental</option>
                        </select>
                        <p className="text-xs text-amber-400 mt-1">Changing business type will update your dashboard layout. Existing vehicles and prices may not be compatible.</p>
                    </div>

                    <div>
                        <span className="text-sm text-slate-400 mb-2 block">Towns you serve</span>
                        <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-2 rounded-xl border border-slate-700 bg-slate-950">
                            {towns.length === 0 && <p className="text-xs text-slate-500 p-2">No towns available.</p>}
                            {towns.map((t) => (
                                <button key={t._id} type="button" onClick={() => toggleTown(t._id)}
                                    className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${selectedTowns.includes(t._id) ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}>
                                    {t.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    <h3 className="text-lg font-semibold text-white mt-4">Support</h3>
                    <div className="grid gap-4 sm:grid-cols-2">
                        <input value={form.supportEmail || ''} onChange={(e) => setForm({ ...form, supportEmail: e.target.value })} placeholder="Support email" className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white" />
                        <input value={form.supportPhone || ''} onChange={(e) => setForm({ ...form, supportPhone: e.target.value })} placeholder="Support phone" className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white" />
                    </div>
                </div>

                <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-6 space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-white">Payout Methods</h3>
                        <button type="button" onClick={addPayoutMethod} className="text-sm text-sky-400 hover:text-sky-300">+ Add method</button>
                    </div>
                    {(form.payoutMethods || []).length === 0 && (
                        <p className="text-sm text-slate-500">No payout methods added yet.</p>
                    )}
                    {(form.payoutMethods || []).map((pm: any, i: number) => (
                        <div key={i} className="grid gap-3 sm:grid-cols-2 p-4 rounded-xl border border-slate-700 bg-slate-900">
                            <select value={pm.type} onChange={(e) => updatePayoutMethod(i, 'type', e.target.value)} className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white">
                                <option value="mpesa_send">M-Pesa Send</option>
                                <option value="mpesa_till">M-Pesa Till</option>
                                <option value="mpesa_paybill">M-Pesa Paybill</option>
                                <option value="bank">Bank Transfer</option>
                                <option value="cash">Cash</option>
                            </select>
                            <input value={pm.label || ''} onChange={(e) => updatePayoutMethod(i, 'label', e.target.value)} placeholder="Label (e.g. Main account)" className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white" />
                            <input value={pm.accountNumber || ''} onChange={(e) => updatePayoutMethod(i, 'accountNumber', e.target.value)} placeholder="Account number" className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white" />
                            <input value={pm.accountName || ''} onChange={(e) => updatePayoutMethod(i, 'accountName', e.target.value)} placeholder="Account name" className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white" />
                            {pm.type === 'bank' && (
                                <>
                                    <input value={pm.bankName || ''} onChange={(e) => updatePayoutMethod(i, 'bankName', e.target.value)} placeholder="Bank name" className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white" />
                                    <input value={pm.branchCode || ''} onChange={(e) => updatePayoutMethod(i, 'branchCode', e.target.value)} placeholder="Branch code" className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white" />
                                </>
                            )}
                            <div className="sm:col-span-2 flex justify-end">
                                <button type="button" onClick={() => removePayoutMethod(i)} className="text-xs text-red-400 hover:text-red-300">Remove</button>
                            </div>
                        </div>
                    ))}
                </div>

                <button type="submit" disabled={saving} className="rounded-xl bg-sky-600 px-6 py-3 text-sm font-semibold text-white hover:bg-sky-500 disabled:opacity-50">
                    {saving ? 'Saving...' : 'Save Settings'}
                </button>
            </form>
        </div>
    );
};

export default SettingsPage;