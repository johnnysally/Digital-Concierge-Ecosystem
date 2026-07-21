import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createPromotion, getPromotion, updatePromotion } from '../../api/transport/promotionApi';

const PromotionFormPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [form, setForm] = useState({
        code: '',
        description: '',
        discountType: 'percentage',
        discountValue: '',
        minAmount: '',
        maxUses: '',
        startDate: '',
        expiryDate: '',
        isActive: true,
    });
    const [loading, setLoading] = useState(Boolean(id));
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!id) return;

        setLoading(true);
        getPromotion(id)
            .then((data) => {
                const promotion = data.promotion || data;
                setForm({
                    code: promotion.code || '',
                    description: promotion.description || '',
                    discountType: promotion.discountType || 'percentage',
                    discountValue: promotion.discountValue ? String(promotion.discountValue) : '',
                    minAmount: promotion.minAmount ? String(promotion.minAmount) : '',
                    maxUses: promotion.maxUses ? String(promotion.maxUses) : '',
                    startDate: promotion.startDate ? promotion.startDate.split('T')[0] : '',
                    expiryDate: promotion.expiryDate ? promotion.expiryDate.split('T')[0] : '',
                    isActive: promotion.isActive ?? true,
                });
            })
            .catch(() => setError('Unable to load promotion details.'))
            .finally(() => setLoading(false));
    }, [id]);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setSaving(true);
        setError('');

        try {
            const payload = {
                ...form,
                discountValue: Number(form.discountValue),
                minAmount: form.minAmount ? Number(form.minAmount) : 0,
                maxUses: form.maxUses ? Number(form.maxUses) : undefined,
            };

            if (id) {
                await updatePromotion(id, payload);
            } else {
                await createPromotion(payload);
            }
            navigate('/transport-admin/promotions', { replace: true });
        } catch {
            setError('Unable to save promotion. Check the values and try again.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-2xl shadow-black/10">
                <p className="text-sm font-semibold uppercase tracking-[0.35em] text-emerald-400">{id ? 'Edit promotion' : 'New promotion'}</p>
                <h2 className="mt-2 text-3xl font-semibold text-white">{id ? 'Update promotion details' : 'Create a new promotion'}</h2>
                <p className="mt-2 text-sm text-slate-400">{id ? 'Update the promotion details.' : 'Create a new promotion campaign for transport bookings.'}</p>
            </div>

            {loading ? (
                <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-6 text-slate-400">Loading promotion details...</div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-6 rounded-3xl border border-slate-800 bg-slate-950/70 p-6 shadow-sm">
                    {error && <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-600">{error}</div>}

                    <div className="grid gap-4 sm:grid-cols-2">
                        <label className="block text-sm text-slate-400">
                            Promotion code
                            <input
                                value={form.code}
                                onChange={(event) => setForm({ ...form, code: event.target.value.toUpperCase() })}
                                required
                                className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none focus:border-emerald-500"
                            />
                        </label>
                        <label className="block text-sm text-slate-400">
                            Description
                            <textarea
                                value={form.description}
                                onChange={(event) => setForm({ ...form, description: event.target.value })}
                                rows={3}
                                className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none focus:border-emerald-500"
                            />
                        </label>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-3">
                        <label className="block text-sm text-slate-400">
                            Discount type
                            <select
                                value={form.discountType}
                                onChange={(event) => setForm({ ...form, discountType: event.target.value })}
                                className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none focus:border-emerald-500"
                            >
                                <option value="percentage">Percentage</option>
                                <option value="fixed">Fixed amount</option>
                            </select>
                        </label>
                        <label className="block text-sm text-slate-400">
                            Discount value
                            <input
                                value={form.discountValue}
                                onChange={(event) => setForm({ ...form, discountValue: event.target.value })}
                                type="number"
                                required
                                className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none focus:border-emerald-500"
                            />
                        </label>
                        <label className="block text-sm text-slate-400">
                            Minimum spend
                            <input
                                value={form.minAmount}
                                onChange={(event) => setForm({ ...form, minAmount: event.target.value })}
                                type="number"
                                className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none focus:border-emerald-500"
                            />
                        </label>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-3">
                        <label className="block text-sm text-slate-400">
                            Start date
                            <input
                                value={form.startDate}
                                onChange={(event) => setForm({ ...form, startDate: event.target.value })}
                                type="date"
                                required
                                className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none focus:border-emerald-500"
                            />
                        </label>
                        <label className="block text-sm text-slate-400">
                            Expiry date
                            <input
                                value={form.expiryDate}
                                onChange={(event) => setForm({ ...form, expiryDate: event.target.value })}
                                type="date"
                                required
                                className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none focus:border-emerald-500"
                            />
                        </label>
                        <label className="block text-sm text-slate-400">
                            Max uses
                            <input
                                value={form.maxUses}
                                onChange={(event) => setForm({ ...form, maxUses: event.target.value })}
                                type="number"
                                min={0}
                                className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none focus:border-emerald-500"
                            />
                        </label>
                    </div>

                    <label className="inline-flex items-center gap-3 text-sm text-slate-400">
                        <input
                            type="checkbox"
                            checked={form.isActive}
                            onChange={(event) => setForm({ ...form, isActive: event.target.checked })}
                            className="h-4 w-4 rounded border-slate-700 bg-slate-950 text-emerald-500 focus:ring-emerald-500"
                        />
                        Active promotion
                    </label>

                    <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                        <button
                            type="submit"
                            disabled={saving}
                            className="rounded-2xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-500 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {saving ? 'Saving...' : id ? 'Update promotion' : 'Create promotion'}
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default PromotionFormPage;
