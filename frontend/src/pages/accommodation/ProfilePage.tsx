import { useEffect, useState } from 'react';
import { getProfile } from '../../api/accommodation/authApi';

const ProfilePage = () => {
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const user = await getProfile();
                setProfile(user);
            } catch (err: any) {
                setError(err?.response?.data?.message || 'Unable to load profile');
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    return (
        <div className="space-y-6">
            <div>
                <p className="text-sm font-semibold uppercase tracking-[0.35em] text-emerald-400">Profile</p>
                <h2 className="mt-2 text-2xl font-semibold text-white">Accommodation partner profile</h2>
            </div>

            {error ? <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-300">{error}</div> : null}

            <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
                {loading ? (
                    <p className="text-sm text-slate-400">Loading profile...</p>
                ) : profile ? (
                    <div className="space-y-3 text-sm text-slate-300">
                        <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
                            <p className="text-slate-400">Business</p>
                            <p className="mt-1 font-medium text-white">{profile.businessName || 'N/A'}</p>
                        </div>
                        <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
                            <p className="text-slate-400">Contact</p>
                            <p className="mt-1 font-medium text-white">{profile.email || 'N/A'}</p>
                            <p className="mt-1 text-slate-400">{profile.phone || 'No phone on file'}</p>
                        </div>
                    </div>
                ) : (
                    <p className="text-sm text-slate-400">No profile available.</p>
                )}
            </div>
        </div>
    );
};

export default ProfilePage;
