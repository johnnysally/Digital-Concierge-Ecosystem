import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getRestaurantMenu, setRestaurantMenu } from './mockData';

const MenuListPage = () => {
    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setItems(getRestaurantMenu());
        setLoading(false);
    }, []);

    const handleDelete = (id: string) => {
        const nextItems = items.filter((item) => item._id !== id);
        setItems(nextItems);
        setRestaurantMenu(nextItems);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 rounded-[24px] border border-slate-800 bg-slate-950/70 p-6 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.35em] text-amber-400">Menu</p>
                    <h1 className="mt-2 text-3xl font-semibold text-white">Manage your menu</h1>
                    <p className="mt-2 text-sm text-slate-400">Keep the kitchen catalog fresh and aligned with the backend menu service.</p>
                </div>
                <Link to="/restaurant-admin/menu/new" className="rounded-2xl bg-amber-500 px-4 py-3 text-sm font-semibold text-slate-950">Add menu item</Link>
            </div>

            <div className="grid gap-4">
                {loading ? <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-3 text-sm text-slate-400">Loading menu...</div> : items.length ? items.map((item) => (
                    <div key={item._id} className="rounded-[24px] border border-slate-800 bg-slate-900/80 p-5 shadow-sm">
                        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                            <div>
                                <div className="flex flex-wrap items-center gap-2">
                                    <p className="text-lg font-semibold text-white">{item.name}</p>
                                    <span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] ${item.available ? 'bg-emerald-500/10 text-emerald-300' : 'bg-slate-800 text-slate-300'}`}>{item.available ? 'Available' : 'Hidden'}</span>
                                </div>
                                <p className="mt-2 text-sm text-slate-400">{item.description || 'No description provided.'}</p>
                                <div className="mt-3 flex flex-wrap gap-2">
                                    <span className="rounded-full bg-slate-800 px-2 py-1 text-[10px] uppercase tracking-[0.2em] text-slate-300">{item.category || 'General'}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-lg font-semibold text-amber-300">{item.price ? `${item.price}` : '—'}</span>
                                <Link to={`/restaurant-admin/menu/${item._id}/edit`} className="rounded-2xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200">Edit</Link>
                                <button type="button" onClick={() => handleDelete(item._id)} className="rounded-2xl border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-300">Delete</button>
                            </div>
                        </div>
                    </div>
                )) : <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-3 text-sm text-slate-400">No menu items yet.</div>}
            </div>
        </div>
    );
};

export default MenuListPage;
