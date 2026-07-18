import { useEffect, useState } from 'react';
import { getProfile } from '../../api/accommodation/authApi';

const SettingsPage = () => {
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const loadProfile = async () => {
            try {
                const response = await getProfile();
                setProfile(response);
            } catch (err: any) {
                setError(err?.response?.data?.message || 'Unable to load account settings');
            } finally {
                setLoading(false);
            }
        };

        loadProfile();
    }, []);

    return (
        <div className="space-y-6">
            <div>
                <p className="text-sm font-semibold uppercase tracking-[0.35em] text-emerald-400">Settings</p>
                <h2 className="mt-2 text-2xl font-semibold text-white">Account and portal configuration</h2>
            </div>

            {error ? <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-300">{error}</div> : null}

            <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
                {loading ? (
                    <p className="text-sm text-slate-400">Loading account details...</p>
                ) : profile ? (
                    <div className="space-y-4 text-sm text-slate-300">
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div>
                                <p className="text-slate-400">Business name</p>
                                <p className="mt-1 font-medium text-white">{profile.businessName || 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-slate-400">Contact</p>
                                <p className="mt-1 font-medium text-white">{profile.email || 'N/A'}</p>
                            </div>
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
                                <p className="font-medium text-white">Portal access</p>
                                <p className="mt-2 text-slate-400">Manage your properties, reservations, guests, and operations from the main dashboard.</p>
                            </div>
                            <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
                                <p className="font-medium text-white">Account status</p>
                                <p className="mt-2 text-emerald-300">Active • Connected to accommodation services</p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <p className="text-sm text-slate-400">No account settings available.</p>
                )}
            </div>
        </div>
    );
};

export default SettingsPage;
