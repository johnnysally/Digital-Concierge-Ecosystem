import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { deletePromotion, getPromotions } from '../../api/transport/promotionApi';
import { getTransportPath } from '../../utils/transportRoutes';

const PromotionsPage = () => {
    const [promotions, setPromotions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [busyId, setBusyId] = useState<string | null>(null);

    const loadPromotions = () => {
        setLoading(true);
        getPromotions()
            .then((data) => setPromotions(Array.isArray(data) ? data : data.promotions ?? []))
            .catch(() => setPromotions([]))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        loadPromotions();
    }, []);

    const handleDelete = async (id: string) => {
        if (!window.confirm('Delete this promotion?')) return;
        setBusyId(id);

        try {
            await deletePromotion(id);
            setPromotions((current) => current.filter((promo) => promo._id !== id && promo.id !== id));
        } catch {
            window.alert('Unable to delete promotion. Try again later.');
        } finally {
            setBusyId(null);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-2xl shadow-black/10 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.35em] text-emerald-400">Promotions</p>
                    <h2 className="mt-2 text-3xl font-semibold text-white">Manage your transport campaigns</h2>
                    <p className="mt-2 text-sm text-slate-400">Create offers and promotions to improve ride uptake.</p>
                </div>
                <Link
                    to={getTransportPath('/promotions/new')}
                    className="inline-flex items-center justify-center rounded-2xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400"
                >
                    New promotion
                </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {loading ? (
                    <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-8 text-center text-slate-400">Loading promotions...</div>
                ) : promotions.length === 0 ? (
                    <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-8 text-center text-slate-400">No promotions available.</div>
                ) : (
                    promotions.map((promo) => {
                        const promoId = promo._id || promo.id;
                        return (
                            <div key={promoId} className="space-y-4 rounded-3xl border border-slate-800 bg-slate-950/70 p-5 shadow-sm">
                                <div>
                                    <h3 className="text-lg font-semibold text-white">{promo.title || promo.name || promo.code}</h3>
                                    <p className="mt-2 text-sm text-slate-400">{promo.description || 'No description available.'}</p>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    <Link
                                        to={getTransportPath(`/promotions/${promoId}/edit`)}
                                        className="rounded-2xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs font-medium text-slate-200 hover:bg-slate-900"
                                    >
                                        Edit
                                    </Link>
                                    <button
                                        type="button"
                                        disabled={busyId === promoId}
                                        onClick={() => handleDelete(promoId)}
                                        className="rounded-2xl border border-rose-200 bg-rose-500/10 px-3 py-2 text-xs font-medium text-rose-200 hover:bg-rose-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        {busyId === promoId ? 'Deleting…' : 'Delete'}
                                    </button>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default PromotionsPage;
