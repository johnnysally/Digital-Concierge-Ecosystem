import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createStaff, getStaffMember, updateStaff } from '../../api/restaurant/staffApi';
import { getStoredRestaurantTheme } from '../../components/restaurant/layout/theme';

const initialState = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: 'other',
    active: true,
};

const roleOptions = ['manager', 'chef', 'waiter', 'delivery', 'cashier', 'other'];

const StaffFormPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [form, setForm] = useState(initialState);
    const [loading, setLoading] = useState(Boolean(id));
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const isLight = getStoredRestaurantTheme() === 'light';

    useEffect(() => {
        if (!id) {
            setLoading(false);
            return;
        }

        const loadMember = async () => {
            try {
                const response = await getStaffMember(id);
                const member = response.staff;
                setForm({
                    firstName: member.firstName || '',
                    lastName: member.lastName || '',
                    email: member.email || '',
                    phone: member.phone || '',
                    role: member.role || 'other',
                    active: member.active ?? true,
                });
            } catch (err: any) {
                setError(err?.response?.data?.message || 'Staff member not found.');
            } finally {
                setLoading(false);
            }
        };

        loadMember();
    }, [id]);

    const onSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setSaving(true);
        setError('');

        try {
            if (id) {
                await updateStaff(id, form);
            } else {
                await createStaff(form);
            }
            navigate('/restaurant-admin/staff');
        } catch (err: any) {
            setError(err?.response?.data?.message || 'Unable to save staff member.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <p className="text-sm font-semibold uppercase tracking-[0.35em] text-amber-400">Staff</p>
                <h1 className={`mt-2 text-3xl font-semibold ${isLight ? 'text-slate-900' : 'text-white'}`}>{id ? 'Edit staff member' : 'Add staff member'}</h1>
            </div>

            {error ? <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-300">{error}</div> : null}

            <form className={`grid gap-4 rounded-[24px] border p-6 ${isLight ? 'border-slate-200 bg-white/90' : 'border-slate-800 bg-slate-900/80'}`} onSubmit={onSubmit}>
                <div className="grid gap-4 md:grid-cols-2">
                    <label className={`block text-sm ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                        <span className="mb-2 block">First name</span>
                        <input required className={`w-full rounded-2xl border px-4 py-3 ${isLight ? 'border-slate-200 bg-white text-slate-900' : 'border-slate-700 bg-slate-950/70 text-white'}`} value={form.firstName} onChange={(event) => setForm({ ...form, firstName: event.target.value })} />
                    </label>
                    <label className={`block text-sm ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                        <span className="mb-2 block">Last name</span>
                        <input required className={`w-full rounded-2xl border px-4 py-3 ${isLight ? 'border-slate-200 bg-white text-slate-900' : 'border-slate-700 bg-slate-950/70 text-white'}`} value={form.lastName} onChange={(event) => setForm({ ...form, lastName: event.target.value })} />
                    </label>
                </div>
                <label className={`block text-sm ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                    <span className="mb-2 block">Email</span>
                    <input type="email" required className={`w-full rounded-2xl border px-4 py-3 ${isLight ? 'border-slate-200 bg-white text-slate-900' : 'border-slate-700 bg-slate-950/70 text-white'}`} value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
                </label>
                <div className="grid gap-4 md:grid-cols-2">
                    <label className={`block text-sm ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                        <span className="mb-2 block">Role</span>
                        <select required className={`w-full rounded-2xl border px-4 py-3 ${isLight ? 'border-slate-200 bg-white text-slate-900' : 'border-slate-700 bg-slate-950/70 text-white'}`} value={form.role} onChange={(event) => setForm({ ...form, role: event.target.value })}>
                            {roleOptions.map((option) => <option key={option} value={option}>{option}</option>)}
                        </select>
                    </label>
                    <label className={`block text-sm ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                        <span className="mb-2 block">Phone</span>
                        <input className={`w-full rounded-2xl border px-4 py-3 ${isLight ? 'border-slate-200 bg-white text-slate-900' : 'border-slate-700 bg-slate-950/70 text-white'}`} value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} />
                    </label>
                </div>
                <label className={`flex items-center gap-3 text-sm ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                    <input type="checkbox" checked={form.active} onChange={(event) => setForm({ ...form, active: event.target.checked })} />
                    Active
                </label>
                <div className="flex items-center gap-3">
                    <button type="submit" disabled={saving || loading} className="rounded-2xl bg-amber-500 px-4 py-3 font-semibold text-slate-950 transition hover:bg-amber-400 disabled:opacity-70">
                        {saving ? 'Saving...' : id ? 'Save changes' : 'Add staff'}
                    </button>
                    <button type="button" onClick={() => navigate('/restaurant-admin/staff')} className={`rounded-2xl border px-4 py-3 text-sm ${isLight ? 'border-slate-200 bg-slate-50 text-slate-700' : 'border-slate-700 bg-slate-950 text-slate-200'}`}>Cancel</button>
                </div>
            </form>
        </div>
    );
};

export default StaffFormPage;
