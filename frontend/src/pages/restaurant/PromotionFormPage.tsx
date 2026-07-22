import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createPromotion, getPromotion, updatePromotion } from '../../api/restaurant/promotionApi';
import { getStoredRestaurantTheme } from '../../components/restaurant/layout/theme';

const initialState = {
    code: '',
    description: '',
    discountType: 'percentage',
    discountValue: '',
    minAmount: '',
    maxUses: '',
    isActive: true,
    startDate: '',
    expiryDate: '',
};

const discountTypeOptions = ['percentage', 'fixed', 'buy_one_get_one'];
const formatDateInput = (value?: string) => (value ? new Date(value).toISOString().slice(0, 10) : '');

const PromotionFormPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [form, setForm] = useState(initialState);
    const [loading, setLoading] = useState(Boolean(id));
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const isLight = getStoredRestaurantTheme() === 'light';

    useEffect(() => {
        if (!id) {
            setLoading(false);
            return;
        }

        const loadPromotion = async () => {
            try {
                const response = await getPromotion(id);
                const promotion = response.promotion;
                setForm({
                    code: promotion.code || '',
                    description: promotion.description || '',
                    discountType: promotion.discountType || 'percentage',
                    discountValue: promotion.discountValue?.toString() || '',
                    minAmount: promotion.minAmount?.toString() || '',
                    maxUses: promotion.maxUses?.toString() || '',
                    isActive: promotion.isActive ?? true,
                    startDate: formatDateInput(promotion.startDate),
                    expiryDate: formatDateInput(promotion.expiryDate),
                });
            } catch (err: any) {
                setError(err?.response?.data?.message || 'Promotion not found.');
            } finally {
                setLoading(false);
            }
        };

        loadPromotion();
    }, [id]);

    const onSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setSaving(true);
        setError('');

        const payload = {
            ...form,
            discountValue: Number(form.discountValue),
            minAmount: Number(form.minAmount || 0),
            maxUses: form.maxUses ? Number(form.maxUses) : 0,
            startDate: form.startDate ? new Date(form.startDate).toISOString() : '',
            expiryDate: form.expiryDate ? new Date(form.expiryDate).toISOString() : '',
        };

        try {
            if (id) {
                await updatePromotion(id, payload);
            } else {
                await createPromotion(payload);
            }
            navigate('/restaurant-admin/promotions');
        } catch (err: any) {
            setError(err?.response?.data?.message || 'Unable to save promotion.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <p className="text-sm font-semibold uppercase tracking-[0.35em] text-amber-400">Promotions</p>
                <h1 className={`mt-2 text-3xl font-semibold ${isLight ? 'text-slate-900' : 'text-white'}`}>{id ? 'Edit promotion' : 'Create promotion'}</h1>
            </div>

            {error ? <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-300">{error}</div> : null}

            <form className={`grid gap-4 rounded-[24px] border p-6 ${isLight ? 'border-slate-200 bg-white/90' : 'border-slate-800 bg-slate-900/80'}`} onSubmit={onSubmit}>
                <label className={`block text-sm ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                    <span className="mb-2 block">Code</span>
                    <input required className={`w-full rounded-2xl border px-4 py-3 ${isLight ? 'border-slate-200 bg-white text-slate-900' : 'border-slate-700 bg-slate-950/70 text-white'}`} value={form.code} onChange={(event) => setForm({ ...form, code: event.target.value })} />
                </label>
                <label className={`block text-sm ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                    <span className="mb-2 block">Description</span>
                    <textarea rows={3} className={`w-full rounded-2xl border px-4 py-3 ${isLight ? 'border-slate-200 bg-white text-slate-900' : 'border-slate-700 bg-slate-950/70 text-white'}`} value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} />
                </label>
                <div className="grid gap-4 md:grid-cols-2">
                    <label className={`block text-sm ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                        <span className="mb-2 block">Discount type</span>
                        <select required className={`w-full rounded-2xl border px-4 py-3 ${isLight ? 'border-slate-200 bg-white text-slate-900' : 'border-slate-700 bg-slate-950/70 text-white'}`} value={form.discountType} onChange={(event) => setForm({ ...form, discountType: event.target.value })}>
                            {discountTypeOptions.map((option) => <option key={option} value={option}>{option}</option>)}
                        </select>
                    </label>
                    <label className={`block text-sm ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                        <span className="mb-2 block">Discount value</span>
                        <input type="number" min="0" required className={`w-full rounded-2xl border px-4 py-3 ${isLight ? 'border-slate-200 bg-white text-slate-900' : 'border-slate-700 bg-slate-950/70 text-white'}`} value={form.discountValue} onChange={(event) => setForm({ ...form, discountValue: event.target.value })} />
                    </label>
                </div>
                <div className="grid gap-4 md:grid-cols-3">
                    <label className={`block text-sm ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                        <span className="mb-2 block">Minimum amount</span>
                        <input type="number" min="0" className={`w-full rounded-2xl border px-4 py-3 ${isLight ? 'border-slate-200 bg-white text-slate-900' : 'border-slate-700 bg-slate-950/70 text-white'}`} value={form.minAmount} onChange={(event) => setForm({ ...form, minAmount: event.target.value })} />
                    </label>
                    <label className={`block text-sm ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                        <span className="mb-2 block">Max uses</span>
                        <input type="number" min="0" className={`w-full rounded-2xl border px-4 py-3 ${isLight ? 'border-slate-200 bg-white text-slate-900' : 'border-slate-700 bg-slate-950/70 text-white'}`} value={form.maxUses} onChange={(event) => setForm({ ...form, maxUses: event.target.value })} />
                    </label>
                    <label className={`block text-sm ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                        <span className="mb-2 block">Start date</span>
                        <input type="date" className={`w-full rounded-2xl border px-4 py-3 ${isLight ? 'border-slate-200 bg-white text-slate-900' : 'border-slate-700 bg-slate-950/70 text-white'}`} value={form.startDate} onChange={(event) => setForm({ ...form, startDate: event.target.value })} />
                    </label>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                    <label className={`block text-sm ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                        <span className="mb-2 block">Expiry date</span>
                        <input type="date" required className={`w-full rounded-2xl border px-4 py-3 ${isLight ? 'border-slate-200 bg-white text-slate-900' : 'border-slate-700 bg-slate-950/70 text-white'}`} value={form.expiryDate} onChange={(event) => setForm({ ...form, expiryDate: event.target.value })} />
                    </label>
                    <label className={`flex items-center gap-3 pt-8 text-sm ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                        <input type="checkbox" checked={form.isActive} onChange={(event) => setForm({ ...form, isActive: event.target.checked })} />
                        Active
                    </label>
                </div>
                <div className="flex items-center gap-3">
                    <button type="submit" disabled={saving || loading} className="rounded-2xl bg-amber-500 px-4 py-3 font-semibold text-slate-950 transition hover:bg-amber-400 disabled:opacity-70">
                        {saving ? 'Saving...' : id ? 'Save changes' : 'Create promotion'}
                    </button>
                    <button type="button" onClick={() => navigate('/restaurant-admin/promotions')} className={`rounded-2xl border px-4 py-3 text-sm ${isLight ? 'border-slate-200 bg-slate-50 text-slate-700' : 'border-slate-700 bg-slate-950 text-slate-200'}`}>Cancel</button>
                </div>
            </form>
        </div>
    );
};

export default PromotionFormPage;
