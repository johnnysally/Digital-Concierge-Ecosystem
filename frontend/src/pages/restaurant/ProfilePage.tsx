import { useEffect, useState } from 'react';
import { getRestaurantProfile, setRestaurantProfile } from './mockData';

const ProfilePage = () => {
    const [profile, setProfile] = useState<any>(null);
    const [form, setForm] = useState<any>({ businessName: '', cuisine: '', phone: '', isOpen: true, deliveryEnabled: true });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const profileData = getRestaurantProfile();
        setProfile(profileData);
        setForm({
            businessName: profileData.businessName || '',
            cuisine: profileData.cuisine || '',
            phone: profileData.phone || '',
            isOpen: profileData.isOpen ?? true,
            deliveryEnabled: profileData.deliveryEnabled ?? true,
        });
        setLoading(false);
    }, []);

    const onSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        setSaving(true);
        const nextProfile = { ...profile, ...form };
        setProfile(nextProfile);
        setRestaurantProfile(nextProfile);
        setSaving(false);
    };

    if (loading) return <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4 text-sm text-slate-400">Loading profile...</div>;

    return (
        <div className="space-y-6">
            <div>
                <p className="text-sm font-semibold uppercase tracking-[0.35em] text-amber-400">Profile</p>
                <h1 className="mt-2 text-3xl font-semibold text-white">Restaurant profile</h1>
            </div>

            <form className="grid gap-4 rounded-[24px] border border-slate-800 bg-slate-900/80 p-6" onSubmit={onSubmit}>
                <div className="grid gap-4 md:grid-cols-2">
                    <label className="block text-sm text-slate-300">
                        <span className="mb-2 block">Business name</span>
                        <input className="w-full rounded-2xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-white" value={form.businessName} onChange={(event) => setForm({ ...form, businessName: event.target.value })} />
                    </label>
                    <label className="block text-sm text-slate-300">
                        <span className="mb-2 block">Food type</span>
                        <select className="w-full rounded-2xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-white" value={form.cuisine} onChange={(event) => setForm({ ...form, cuisine: event.target.value })}>
                            <option value="">Select food type</option>
                            <option value="african">African</option>
                            <option value="italian">Italian</option>
                            <option value="chinese">Chinese</option>
                            <option value="indian">Indian</option>
                            <option value="fast_food">Fast food</option>
                            <option value="seafood">Seafood</option>
                            <option value="other">Other</option>
                        </select>
                    </label>
                </div>
                <label className="block text-sm text-slate-300">
                    <span className="mb-2 block">Phone</span>
                    <input className="w-full rounded-2xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-white" value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} />
                </label>
                <div className="flex flex-wrap gap-6 text-sm text-slate-300">
                    <label className="flex items-center gap-3">
                        <input type="checkbox" checked={form.isOpen} onChange={(event) => setForm({ ...form, isOpen: event.target.checked })} />
                        Open for business
                    </label>
                    <label className="flex items-center gap-3">
                        <input type="checkbox" checked={form.deliveryEnabled} onChange={(event) => setForm({ ...form, deliveryEnabled: event.target.checked })} />
                        Delivery enabled
                    </label>
                </div>
                <button type="submit" disabled={saving} className="w-fit rounded-2xl bg-amber-500 px-4 py-3 font-semibold text-slate-950 transition hover:bg-amber-400 disabled:opacity-70">
                    {saving ? 'Saving...' : 'Save profile'}
                </button>
            </form>
        </div>
    );
};

export default ProfilePage;
