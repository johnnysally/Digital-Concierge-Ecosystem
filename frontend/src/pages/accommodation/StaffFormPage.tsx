import { useEffect, useState, type FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createStaff, getStaffMember, updateStaff } from '../../api/accommodation/staffApi';
import { getMyProperties } from '../../api/accommodation/propertyApi';

const StaffFormPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [properties, setProperties] = useState<any[]>([]);
    const [form, setForm] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        role: 'manager',
        property: '',
        active: true,
    });
    const [loading, setLoading] = useState(Boolean(id));
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchResources = async () => {
            try {
                const response = await getMyProperties();
                setProperties(response.properties || []);
            } catch (err: any) {
                setError(err?.response?.data?.message || 'Unable to load properties');
            }
        };

        fetchResources();
    }, []);

    useEffect(() => {
        if (!id) {
            setLoading(false);
            return;
        }

        const fetchStaff = async () => {
            try {
                const response = await getStaffMember(id);
                setForm({
                    firstName: response.staff.firstName || '',
                    lastName: response.staff.lastName || '',
                    email: response.staff.email || '',
                    phone: response.staff.phone || '',
                    role: response.staff.role || 'manager',
                    property: response.staff.property || '',
                    active: response.staff.active ?? true,
                });
            } catch (err: any) {
                setError(err?.response?.data?.message || 'Unable to load staff member');
            } finally {
                setLoading(false);
            }
        };

        fetchStaff();
    }, [id]);

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        setSaving(true);
        setError('');
        setMessage('');

        try {
            const payload = {
                firstName: form.firstName,
                lastName: form.lastName,
                email: form.email,
                phone: form.phone,
                role: form.role,
                active: form.active,
                property: form.property || undefined,
            };

            if (id) {
                await updateStaff(id, payload);
                setMessage('Staff member updated successfully.');
            } else {
                await createStaff(payload);
                setMessage('Staff member added successfully.');
            }

            setTimeout(() => navigate('/accommodation/staff'), 700);
        } catch (err: any) {
            setError(err?.response?.data?.message || 'Unable to save staff member');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <p className="text-sm font-semibold uppercase tracking-[0.35em] text-emerald-400">Staff member</p>
                <h2 className="mt-2 text-2xl font-semibold text-white">{id ? 'Edit team member' : 'Add new staff member'}</h2>
            </div>

            {error ? <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-300">{error}</div> : null}
            {message ? <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-300">{message}</div> : null}

            <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
                {loading ? (
                    <p className="text-sm text-slate-400">Loading staff details...</p>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div>
                                <label className="mb-2 block text-sm text-slate-300">First name</label>
                                <input
                                    value={form.firstName}
                                    onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                                    required
                                    className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white"
                                />
                            </div>
                            <div>
                                <label className="mb-2 block text-sm text-slate-300">Last name</label>
                                <input
                                    value={form.lastName}
                                    onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                                    required
                                    className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white"
                                />
                            </div>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <div>
                                <label className="mb-2 block text-sm text-slate-300">Email</label>
                                <input
                                    value={form.email}
                                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                                    type="email"
                                    required
                                    className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white"
                                />
                            </div>
                            <div>
                                <label className="mb-2 block text-sm text-slate-300">Phone</label>
                                <input
                                    value={form.phone}
                                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                                    className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white"
                                />
                            </div>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <div>
                                <label className="mb-2 block text-sm text-slate-300">Role</label>
                                <select
                                    value={form.role}
                                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                                    required
                                    className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white"
                                >
                                    <option value="manager">Manager</option>
                                    <option value="receptionist">Receptionist</option>
                                    <option value="housekeeping">Housekeeping</option>
                                    <option value="maintenance">Maintenance</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                            <div>
                                <label className="mb-2 block text-sm text-slate-300">Property assignment</label>
                                <select
                                    value={form.property}
                                    onChange={(e) => setForm({ ...form, property: e.target.value })}
                                    className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white"
                                >
                                    <option value="">All properties</option>
                                    {properties.map((property) => (
                                        <option key={property._id} value={property._id}>{property.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <input
                                id="active"
                                type="checkbox"
                                checked={form.active}
                                onChange={(e) => setForm({ ...form, active: e.target.checked })}
                                className="h-4 w-4 rounded border-slate-700 bg-slate-950 text-emerald-500 focus:ring-emerald-500"
                            />
                            <label htmlFor="active" className="text-sm text-slate-300">Active team member</label>
                        </div>

                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <button
                                type="submit"
                                disabled={saving}
                                className="rounded-2xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:opacity-60"
                            >
                                {saving ? 'Saving...' : id ? 'Update staff' : 'Add staff'}
                            </button>
                            <button
                                type="button"
                                onClick={() => navigate('/accommodation/staff')}
                                className="rounded-2xl border border-slate-700 bg-slate-950 px-5 py-3 text-sm text-slate-200 transition hover:border-emerald-500 hover:text-white"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default StaffFormPage;
