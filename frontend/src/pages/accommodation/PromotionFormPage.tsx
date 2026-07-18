import { useEffect, useState, type FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createPromotion, getPromotion, updatePromotion } from '../../api/accommodation/promotionApi';
import { getMyProperties } from '../../api/accommodation/propertyApi';

const PromotionFormPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [properties, setProperties] = useState<any[]>([]);
    const [form, setForm] = useState({
        property: '',
        code: '',
        description: '',
        discountType: 'percentage',
        discountValue: '',
        minAmount: '',
        maxUses: '',
        isActive: true,
        startDate: new Date().toISOString().slice(0, 10),
        expiryDate: new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
    });
    const [loading, setLoading] = useState(Boolean(id));
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchProperties = async () => {
            try {
                const response = await getMyProperties();
                setProperties(response.properties || []);
            } catch (err: any) {
                setError(err?.response?.data?.message || 'Unable to load properties');
            }
        };

        fetchProperties();
    }, []);

    useEffect(() => {
        if (!id) {
            setLoading(false);
            return;
        }

        const fetchPromotion = async () => {
            try {
                const response = await getPromotion(id);
                const promotion = response.promotion;
                setForm({
                    property: promotion.property || '',
                    code: promotion.code || '',
                    description: promotion.description || '',
                    discountType: promotion.discountType || 'percentage',
                    discountValue: promotion.discountValue?.toString() || '',
                    minAmount: promotion.minAmount?.toString() || '',
                    maxUses: promotion.maxUses?.toString() || '',
                    isActive: promotion.isActive ?? true,
                    startDate: promotion.startDate ? new Date(promotion.startDate).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10),
                    expiryDate: promotion.expiryDate ? new Date(promotion.expiryDate).toISOString().slice(0, 10) : new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
                });
            } catch (err: any) {
                setError(err?.response?.data?.message || 'Unable to load promotion');
            } finally {
                setLoading(false);
            }
        };

        fetchPromotion();
    }, [id]);

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        setSaving(true);
        setError('');
        setMessage('');

        try {
            const payload: any = {
                code: form.code,
                description: form.description,
                discountType: form.discountType,
                discountValue: Number(form.discountValue),
                minAmount: Number(form.minAmount) || 0,
                maxUses: form.maxUses ? Number(form.maxUses) : undefined,
                isActive: form.isActive,
                startDate: form.startDate,
                expiryDate: form.expiryDate,
            };
            if (form.property) payload.property = form.property;

            if (id) {
                await updatePromotion(id, payload);
                setMessage('Promotion updated successfully.');
            } else {
                await createPromotion(payload);
                setMessage('Promotion created successfully.');
            }

            setTimeout(() => navigate('/accommodation/promotions'), 700);
        } catch (err: any) {
            setError(err?.response?.data?.message || 'Unable to save promotion');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <p className="text-sm font-semibold uppercase tracking-[0.35em] text-emerald-400">Promotion</p>
                <h2 className="mt-2 text-2xl font-semibold text-white">{id ? 'Edit promotion' : 'Create promotion'}</h2>
            </div>

            {error ? <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-300">{error}</div> : null}
            {message ? <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-300">{message}</div> : null}

            <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
                {loading ? (
                    <p className="text-sm text-slate-400">Loading promotion details...</p>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="mb-2 block text-sm text-slate-300">Promotion code</label>
                            <input
                                value={form.code}
                                onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                                required
                                className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm text-slate-300">Description</label>
                            <textarea
                                value={form.description}
                                onChange={(e) => setForm({ ...form, description: e.target.value })}
                                rows={3}
                                className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none"
                            />
                        </div>

                        <div className="grid gap-4 sm:grid-cols-3">
                            <div>
                                <label className="mb-2 block text-sm text-slate-300">Discount type</label>
                                <select
                                    value={form.discountType}
                                    onChange={(e) => setForm({ ...form, discountType: e.target.value })}
                                    className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white"
                                >
                                    <option value="percentage">Percentage</option>
                                    <option value="fixed">Fixed amount</option>
                                </select>
                            </div>
                            <div>
                                <label className="mb-2 block text-sm text-slate-300">Discount value</label>
                                <input
                                    value={form.discountValue}
                                    onChange={(e) => setForm({ ...form, discountValue: e.target.value })}
                                    type="number"
                                    required
                                    className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white"
                                />
                            </div>
                            <div>
                                <label className="mb-2 block text-sm text-slate-300">Minimum spend</label>
                                <input
                                    value={form.minAmount}
                                    onChange={(e) => setForm({ ...form, minAmount: e.target.value })}
                                    type="number"
                                    className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white"
                                />
                            </div>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <div>
                                <label className="mb-2 block text-sm text-slate-300">Start date</label>
                                <input
                                    value={form.startDate}
                                    onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                                    type="date"
                                    required
                                    className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white"
                                />
                            </div>
                            <div>
                                <label className="mb-2 block text-sm text-slate-300">Expiry date</label>
                                <input
                                    value={form.expiryDate}
                                    onChange={(e) => setForm({ ...form, expiryDate: e.target.value })}
                                    type="date"
                                    required
                                    className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white"
                                />
                            </div>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <div>
                                <label className="mb-2 block text-sm text-slate-300">Max uses</label>
                                <input
                                    value={form.maxUses}
                                    onChange={(e) => setForm({ ...form, maxUses: e.target.value })}
                                    type="number"
                                    className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white"
                                />
                            </div>
                            <div>
                                <label className="mb-2 block text-sm text-slate-300">Property</label>
                                <select
                                    value={form.property}
                                    onChange={(e) => setForm({ ...form, property: e.target.value })}
                                    className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white"
                                >
                                    <option value="">All properties</option>
                                    {properties.map((property) => (
                                        <option key={property._id} value={property._id}>{property.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <input
                                id="isActive"
                                type="checkbox"
                                checked={form.isActive}
                                onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                                className="h-4 w-4 rounded border-slate-700 bg-slate-950 text-emerald-500 focus:ring-emerald-500"
                            />
                            <label htmlFor="isActive" className="text-sm text-slate-300">Activate this promotion</label>
                        </div>

                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <button
                                type="submit"
                                disabled={saving}
                                className="rounded-2xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:opacity-60"
                            >
                                {saving ? 'Saving...' : id ? 'Update promotion' : 'Create promotion'}
                            </button>
                            <button
                                type="button"
                                onClick={() => navigate('/accommodation/promotions')}
                                className="rounded-2xl border border-slate-700 bg-slate-950 px-5 py-3 text-sm text-slate-200 transition hover:border-emerald-500 hover:text-white"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default PromotionFormPage;
