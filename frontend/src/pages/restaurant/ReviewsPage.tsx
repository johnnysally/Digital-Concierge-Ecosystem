import { useEffect, useState } from 'react';
import { getProfile } from '../../api/restaurant/authApi';
import { getStoredRestaurantTheme } from '../../components/restaurant/layout/theme';

const ReviewsPage = () => {
    const [summary, setSummary] = useState({ rating: 0, reviewCount: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const isLight = getStoredRestaurantTheme() === 'light';

    useEffect(() => {
        const loadSummary = async () => {
            try {
                const profile = await getProfile();
                setSummary({ rating: profile.rating || 0, reviewCount: profile.reviewCount || 0 });
            } catch (err: any) {
                setError(err?.response?.data?.message || 'Unable to load review summary.');
            } finally {
                setLoading(false);
            }
        };

        loadSummary();
    }, []);

    return (
        <div className="space-y-6">
            <div>
                <p className="text-sm font-semibold uppercase tracking-[0.35em] text-amber-400">Reviews</p>
                <h1 className={`mt-2 text-3xl font-semibold ${isLight ? 'text-slate-900' : 'text-white'}`}>Customer feedback</h1>
                <p className={`mt-2 text-sm ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>These ratings are loaded directly from the restaurant profile record stored in the backend.</p>
            </div>

            {error ? <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-300">{error}</div> : null}

            <div className="grid gap-4 md:grid-cols-2">
                {loading ? <div className={`rounded-[24px] border p-5 text-sm ${isLight ? 'border-slate-200 bg-white/90 text-slate-600' : 'border-slate-800 bg-slate-900/80 text-slate-400'}`}>Loading review summary...</div> : (
                    <>
                        <div className={`rounded-[24px] border p-5 ${isLight ? 'border-slate-200 bg-white/90' : 'border-slate-800 bg-slate-900/80'}`}>
                            <p className={`text-sm uppercase tracking-[0.24em] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Average rating</p>
                            <p className={`mt-3 text-4xl font-semibold ${isLight ? 'text-slate-900' : 'text-white'}`}>{summary.rating.toFixed(1)} / 5</p>
                        </div>
                        <div className={`rounded-[24px] border p-5 ${isLight ? 'border-slate-200 bg-white/90' : 'border-slate-800 bg-slate-900/80'}`}>
                            <p className={`text-sm uppercase tracking-[0.24em] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Review count</p>
                            <p className={`mt-3 text-4xl font-semibold ${isLight ? 'text-slate-900' : 'text-white'}`}>{summary.reviewCount}</p>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default ReviewsPage;
