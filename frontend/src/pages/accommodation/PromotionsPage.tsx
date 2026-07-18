import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { deletePromotion, getPromotions } from '../../api/accommodation/promotionApi';

const PromotionsPage = () => {
    const [promotions, setPromotions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const loadPromotions = async () => {
        try {
            const response = await getPromotions();
            setPromotions(response.promotions || []);
        } catch (err: any) {
            setError(err?.response?.data?.message || 'Unable to load promotions');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadPromotions();
    }, []);

    const handleDelete = async (id: string) => {
        if (!window.confirm('Delete this promotion?')) return;
        try {
            setLoading(true);
            await deletePromotion(id);
            await loadPromotions();
        } catch (err: any) {
            setError(err?.response?.data?.message || 'Unable to delete promotion');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.35em] text-emerald-400">Promotions</p>
                    <h2 className="mt-2 text-2xl font-semibold text-white">Manage offers and discount codes</h2>
                </div>
                <Link
                    to="/accommodation/promotions/new"
                    className="rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400"
                >
                    Add promotion
                </Link>
            </div>

            {error ? <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-300">{error}</div> : null}

            <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
                {loading ? (
                    <p className="text-sm text-slate-400">Loading promotions...</p>
                ) : promotions.length === 0 ? (
                    <p className="text-sm text-slate-400">No promotions available yet. Create a new discount or offer code.</p>
                ) : (
                    <div className="space-y-3">
                        {promotions.map((promotion) => (
                            <div key={promotion._id} className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
                                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                    <div>
                                        <p className="font-medium text-white">{promotion.code}</p>
                                        <p className="text-sm text-slate-400">{promotion.description || 'No description'}</p>
                                        <p className="text-sm text-slate-400">
                                            {promotion.discountType === 'percentage' ? `${promotion.discountValue}% off` : `KES ${promotion.discountValue} off`}
                                            {promotion.property ? ` · property ${promotion.property}` : ''}
                                        </p>
                                    </div>
                                    <div className="flex flex-wrap gap-2 text-sm">
                                        <Link
                                            to={`/accommodation/promotions/${promotion._id}`}
                                            className="rounded-full border border-slate-700 px-3 py-1 text-slate-200 transition hover:border-emerald-500 hover:text-white"
                                        >
                                            Edit
                                        </Link>
                                        <button
                                            type="button"
                                            onClick={() => handleDelete(promotion._id)}
                                            className="rounded-full border border-rose-500 px-3 py-1 text-rose-300 transition hover:bg-rose-500/10"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                                <div className="mt-3 flex flex-wrap gap-3 text-sm text-slate-400">
                                    <span>{promotion.isActive ? 'Active' : 'Inactive'}</span>
                                    <span>Expires {promotion.expiryDate ? new Date(promotion.expiryDate).toLocaleDateString() : 'unknown'}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PromotionsPage;
