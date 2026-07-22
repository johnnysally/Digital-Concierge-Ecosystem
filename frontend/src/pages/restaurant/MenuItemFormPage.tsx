import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createItem, getItem, updateItem } from '../../api/restaurant/menuApi';
import { getStoredRestaurantTheme } from '../../components/restaurant/layout/theme';

const initialState = {
    name: '',
    description: '',
    category: 'main',
    price: '',
    available: true,
};

const categoryOptions = ['appetizer', 'main', 'dessert', 'beverage', 'side', 'combo'];

const MenuItemFormPage = () => {
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

        const loadItem = async () => {
            try {
                const response = await getItem(id);
                const item = response.item;
                setForm({
                    name: item.name || '',
                    description: item.description || '',
                    category: item.category || 'main',
                    price: item.price?.toString() || '',
                    available: item.available ?? true,
                });
            } catch (err: any) {
                setError(err?.response?.data?.message || 'Menu item not found.');
            } finally {
                setLoading(false);
            }
        };

        loadItem();
    }, [id]);

    const onSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setSaving(true);
        setError('');

        const payload = {
            ...form,
            price: Number(form.price),
        };

        try {
            if (id) {
                await updateItem(id, payload);
            } else {
                await createItem(payload);
            }
            navigate('/restaurant-admin/menu');
        } catch (err: any) {
            setError(err?.response?.data?.message || 'Unable to save menu item.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <p className="text-sm font-semibold uppercase tracking-[0.35em] text-amber-400">Menu</p>
                <h1 className={`mt-2 text-3xl font-semibold ${isLight ? 'text-slate-900' : 'text-white'}`}>{id ? 'Edit menu item' : 'Create menu item'}</h1>
            </div>

            {error ? <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-300">{error}</div> : null}

            <form className={`grid gap-4 rounded-[24px] border p-6 ${isLight ? 'border-slate-200 bg-white/90' : 'border-slate-800 bg-slate-900/80'}`} onSubmit={onSubmit}>
                <label className={`block text-sm ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                    <span className="mb-2 block">Name</span>
                    <input required className={`w-full rounded-2xl border px-4 py-3 ${isLight ? 'border-slate-200 bg-white text-slate-900' : 'border-slate-700 bg-slate-950/70 text-white'}`} value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
                </label>
                <label className={`block text-sm ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                    <span className="mb-2 block">Description</span>
                    <textarea rows={4} className={`w-full rounded-2xl border px-4 py-3 ${isLight ? 'border-slate-200 bg-white text-slate-900' : 'border-slate-700 bg-slate-950/70 text-white'}`} value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} />
                </label>
                <div className="grid gap-4 md:grid-cols-2">
                    <label className={`block text-sm ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                        <span className="mb-2 block">Category</span>
                        <select className={`w-full rounded-2xl border px-4 py-3 ${isLight ? 'border-slate-200 bg-white text-slate-900' : 'border-slate-700 bg-slate-950/70 text-white'}`} value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })}>
                            {categoryOptions.map((option) => (
                                <option key={option} value={option}>{option}</option>
                            ))}
                        </select>
                    </label>
                    <label className={`block text-sm ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                        <span className="mb-2 block">Price</span>
                        <input type="number" min="0" step="0.01" required className={`w-full rounded-2xl border px-4 py-3 ${isLight ? 'border-slate-200 bg-white text-slate-900' : 'border-slate-700 bg-slate-950/70 text-white'}`} value={form.price} onChange={(event) => setForm({ ...form, price: event.target.value })} />
                    </label>
                </div>
                <label className={`flex items-center gap-3 text-sm ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                    <input type="checkbox" checked={form.available} onChange={(event) => setForm({ ...form, available: event.target.checked })} />
                    Available for ordering
                </label>
                <div className="flex items-center gap-3">
                    <button type="submit" disabled={saving || loading} className="rounded-2xl bg-amber-500 px-4 py-3 font-semibold text-slate-950 transition hover:bg-amber-400 disabled:opacity-70">
                        {saving ? 'Saving...' : id ? 'Save changes' : 'Create item'}
                    </button>
                    <button type="button" onClick={() => navigate('/restaurant-admin/menu')} className={`rounded-2xl border px-4 py-3 text-sm ${isLight ? 'border-slate-200 bg-slate-50 text-slate-700' : 'border-slate-700 bg-slate-950 text-slate-200'}`}>Cancel</button>
                </div>
            </form>
        </div>
    );
};

export default MenuItemFormPage;
