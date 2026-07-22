import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getItems, deleteItem } from '../../api/restaurant/menuApi';
import { getStoredRestaurantTheme } from '../../components/restaurant/layout/theme';

const MenuListPage = () => {
    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const isLight = getStoredRestaurantTheme() === 'light';

    useEffect(() => {
        const loadItems = async () => {
            try {
                const response = await getItems({ limit: 50 });
                setItems(response.items || []);
            } catch (err: any) {
                setError(err?.response?.data?.message || 'Unable to load menu items.');
            } finally {
                setLoading(false);
            }
        };

        loadItems();
    }, []);

    const handleDelete = async (id: string) => {
        try {
            await deleteItem(id);
            setItems((current) => current.filter((item) => item._id !== id));
        } catch (err: any) {
            setError(err?.response?.data?.message || 'Unable to delete menu item.');
        }
    };

    return (
        <div className="space-y-6">
            <div className={`flex flex-col gap-4 rounded-[24px] border p-4 sm:p-6 sm:flex-row sm:items-end sm:justify-between ${isLight ? 'border-slate-200 bg-white/90' : 'border-slate-800 bg-slate-900/80'}`}>
                <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.35em] text-amber-400">Menu</p>
                    <h1 className={`mt-2 text-2xl font-semibold sm:text-3xl ${isLight ? 'text-slate-900' : 'text-white'}`}>Manage your menu</h1>
                    <p className={`mt-2 text-sm ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Keep the kitchen catalog fresh and aligned with the backend menu service.</p>
                </div>
                <Link to="/restaurant-admin/menu/new" className="w-full rounded-2xl bg-amber-500 px-4 py-3 text-center text-sm font-semibold text-slate-950 sm:w-auto">Add menu item</Link>
            </div>

            {error ? <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-300">{error}</div> : null}

            <div className="grid gap-4">
                {loading ? <div className={`rounded-2xl border p-3 text-sm ${isLight ? 'border-slate-200 bg-white/90 text-slate-600' : 'border-slate-800 bg-slate-950/70 text-slate-400'}`}>Loading menu...</div> : items.length ? items.map((item) => (
                    <div key={item._id} className={`rounded-[24px] border p-5 shadow-sm ${isLight ? 'border-slate-200 bg-white/90' : 'border-slate-800 bg-slate-900/80'}`}>
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <div className="flex flex-wrap items-center gap-2">
                                    <p className={`text-lg font-semibold ${isLight ? 'text-slate-900' : 'text-white'}`}>{item.name}</p>
                                    <span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] ${item.available ? 'bg-emerald-500/10 text-emerald-600' : 'bg-slate-200 text-slate-600'}`}>{item.available ? 'Available' : 'Hidden'}</span>
                                </div>
                                <p className={`mt-2 text-sm ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>{item.description || 'No description provided.'}</p>
                                <div className="mt-3 flex flex-wrap gap-2">
                                    <span className={`rounded-full px-2 py-1 text-[10px] uppercase tracking-[0.2em] ${isLight ? 'bg-slate-100 text-slate-600' : 'bg-slate-800 text-slate-300'}`}>{item.category || 'General'}</span>
                                </div>
                            </div>
                            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                                <span className={`text-lg font-semibold ${isLight ? 'text-amber-700' : 'text-amber-300'}`}>{item.price ? `KES ${Number(item.price).toFixed(2)}` : '—'}</span>
                                <Link to={`/restaurant-admin/menu/${item._id}/edit`} className={`rounded-2xl border px-3 py-2 text-sm ${isLight ? 'border-slate-200 bg-slate-50 text-slate-700' : 'border-slate-700 bg-slate-950 text-slate-200'}`}>Edit</Link>
                                <button type="button" onClick={() => handleDelete(item._id)} className="rounded-2xl border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-600">Delete</button>
                            </div>
                        </div>
                    </div>
                )) : <div className={`rounded-2xl border p-3 text-sm ${isLight ? 'border-slate-200 bg-white/90 text-slate-600' : 'border-slate-800 bg-slate-950/70 text-slate-400'}`}>No menu items yet.</div>}
            </div>
        </div>
    );
};

export default MenuListPage;
