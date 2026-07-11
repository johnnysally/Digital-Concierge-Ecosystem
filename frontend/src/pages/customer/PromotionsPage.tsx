import React, { useEffect, useState } from 'react';
import SectionHeader from '../../components/customer/ui/SectionHeader';
import { api } from '../../api/axios';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDate } from '../../utils/formatDate';

const PromotionsPage = () => {
    const [promotions, setPromotions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [applied, setApplied] = useState<string | null>(null);

    useEffect(() => {
        api.get('/customer/promotions')
            .then((res) => setPromotions(res.data.promotions || []))
            .catch(() => setPromotions([]))
            .finally(() => setLoading(false));
    }, []);

    const applyPromo = async (code: string) => {
        try {
            await api.post('/customer/promotions/apply', { code });
            setApplied(code);
        } catch {}
    };

    if (loading) return <div className="space-y-8"><SectionHeader title="Promotions" subtitle="Unlock offers, loyalty rewards and referral bonuses." /><div className="text-slate-400">Loading promotions...</div></div>;

    return (
        <div className="space-y-8">
            <SectionHeader title="Promotions" subtitle="Unlock offers, loyalty rewards and referral bonuses across DigitalSafaris." />

            {applied && (
                <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/30 p-4 text-sm text-emerald-400">
                    Promo code <strong>{applied}</strong> applied successfully!
                </div>
            )}

            {promotions.length === 0 ? (
                <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 text-slate-400">
                    <p className="text-white text-lg font-semibold">No active promotions</p>
                    <p className="mt-2">Check back later for new offers and discounts.</p>
                </div>
            ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {promotions.map((promo) => (
                        <div key={promo._id} className="rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950 p-6 hover:border-amber-700 transition-colors">
                            <div className="flex items-center justify-between">
                                <span className="rounded-full bg-amber-500/20 px-3 py-1 text-xs font-semibold text-amber-400 uppercase">{promo.discountType}</span>
                                <span className="text-xs text-slate-500">Expires {formatDate(promo.expiryDate)}</span>
                            </div>
                            <h3 className="text-3xl font-bold text-white mt-4">{promo.code}</h3>
                            <p className="text-lg text-amber-400 mt-1">
                                {promo.discountType === 'percentage' ? `${promo.discountValue}% OFF` : `${formatCurrency(promo.discountValue)} OFF`}
                            </p>
                            <p className="text-sm text-slate-400 mt-3">{promo.description}</p>
                            {promo.minAmount > 0 && (
                                <p className="text-xs text-slate-500 mt-2">Min spend: {formatCurrency(promo.minAmount)}</p>
                            )}
                            <button
                                onClick={() => applyPromo(promo.code)}
                                disabled={applied === promo.code}
                                className="mt-4 w-full rounded-xl bg-amber-600 px-4 py-3 text-sm font-semibold text-white hover:bg-amber-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {applied === promo.code ? 'Applied' : 'Apply Code'}
                            </button>
                        </div>
                    ))}
                </div>
            )}

            <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
                <h3 className="text-lg font-semibold text-white">Have a promo code?</h3>
                <div className="mt-4 flex gap-3">
                    <input
                        type="text"
                        placeholder="Enter promo code"
                        className="flex-1 rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-amber-500"
                    />
                    <button className="rounded-xl bg-amber-600 px-6 py-3 text-sm font-semibold text-white hover:bg-amber-500">Apply</button>
                </div>
            </div>
        </div>
    );
};

export default PromotionsPage;