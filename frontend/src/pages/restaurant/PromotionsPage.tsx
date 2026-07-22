import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getPromotions, deletePromotion } from '../../api/restaurant/promotionApi';
import { getStoredRestaurantTheme } from '../../components/restaurant/layout/theme';

const PromotionsPage = () => {
    const [promotions, setPromotions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const isLight = getStoredRestaurantTheme() === 'light';

    useEffect(() => {
        const loadPromotions = async () => {
            try {
                const response = await getPromotions({ limit: 50 });
                setPromotions(response.promotions || []);
            } catch (err: any) {
                setError(err?.response?.data?.message || 'Unable to load promotions.');
            } finally {
                setLoading(false);
            }
        };

        loadPromotions();
    }, []);

    const handleDelete = async (id: string) => {
        try {
            await deletePromotion(id);
            setPromotions((current) => current.filter((promotion) => promotion._id !== id));
        } catch (err: any) {
            setError(err?.response?.data?.message || 'Unable to delete promotion.');
        }
    };

    return (
        <div className="space-y-6">
            <div className={`flex flex-col gap-4 rounded-[24px] border p-6 sm:flex-row sm:items-end sm:justify-between ${isLight ? 'border-slate-200 bg-white/90' : 'border-slate-800 bg-slate-950/70'}`}>
                <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.35em] text-amber-400">Promotions</p>
                    <h1 className={`mt-2 text-3xl font-semibold ${isLight ? 'text-slate-900' : 'text-white'}`}>Launch partner promotions</h1>
                    <p className={`mt-2 text-sm ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Create offers that match your restaurant growth plan and sync with the promotions API.</p>
                </div>
                <Link to="/restaurant-admin/promotions/new" className="rounded-2xl bg-amber-500 px-4 py-3 text-sm font-semibold text-slate-950">Add promotion</Link>
            </div>

            {error ? <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-300">{error}</div> : null}

            <div className="grid gap-4">
                {loading ? <div className={`rounded-2xl border p-3 text-sm ${isLight ? 'border-slate-200 bg-white/90 text-slate-600' : 'border-slate-800 bg-slate-950/70 text-slate-400'}`}>Loading promotions...</div> : promotions.length ? promotions.map((promotion) => (
                    <div key={promotion._id} className={`rounded-[24px] border p-5 shadow-sm ${isLight ? 'border-slate-200 bg-white/90' : 'border-slate-800 bg-slate-900/80'}`}>
                        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                            <div>
                                <p className={`text-lg font-semibold ${isLight ? 'text-slate-900' : 'text-white'}`}>{promotion.code || 'Promotion'}</p>
                                <p className={`mt-2 text-sm ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>{promotion.description || 'No description provided.'}</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] ${isLight ? 'bg-amber-100 text-amber-700' : 'bg-amber-500/10 text-amber-300'}`}>{promotion.discountType || 'offer'}</span>
                                <Link to={`/restaurant-admin/promotions/${promotion._id}/edit`} className={`rounded-2xl border px-3 py-2 text-sm ${isLight ? 'border-slate-200 bg-slate-50 text-slate-700' : 'border-slate-700 bg-slate-950 text-slate-200'}`}>Edit</Link>
                                <button type="button" onClick={() => handleDelete(promotion._id)} className="rounded-2xl border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-600">Delete</button>
                            </div>
                        </div>
                    </div>
                )) : <div className={`rounded-2xl border p-3 text-sm ${isLight ? 'border-slate-200 bg-white/90 text-slate-600' : 'border-slate-800 bg-slate-950/70 text-slate-400'}`}>No promotions created.</div>}
            </div>
        </div>
    );
};

export default PromotionsPage;
