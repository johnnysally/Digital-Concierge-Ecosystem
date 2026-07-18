import { useEffect, useState, type FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createProperty, getProperty, updateProperty } from '../../api/accommodation/propertyApi';

const PropertyEditPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [form, setForm] = useState({
        name: '',
        type: 'hotel',
        city: '',
        country: 'Kenya',
        state: '',
        pincode: '',
        street: '',
        description: '',
        published: false,
    });
    const [loading, setLoading] = useState(Boolean(id));
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProperty = async () => {
            if (!id) {
                setLoading(false);
                return;
            }

            try {
                const response = await getProperty(id);
                const property = response.property;
                setForm({
                    name: property.name || '',
                    type: property.type || 'hotel',
                    city: property.address?.city || '',
                    country: property.address?.country || 'Kenya',
                    state: property.address?.state || '',
                    pincode: property.address?.pincode || '',
                    street: property.address?.street || '',
                    description: property.description || '',
                    published: property.published || false,
                });
            } catch (err: any) {
                setError(err?.response?.data?.message || 'Unable to load property');
            } finally {
                setLoading(false);
            }
        };

        fetchProperty();
    }, [id]);

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        setSaving(true);
        setError('');
        setMessage('');

        try {
            const payload = {
                name: form.name,
                type: form.type,
                description: form.description,
                published: form.published,
                address: {
                    street: form.street,
                    city: form.city,
                    state: form.state,
                    country: form.country,
                    pincode: form.pincode,
                },
            };

            if (id) {
                await updateProperty(id, payload);
                setMessage('Property updated successfully.');
            } else {
                await createProperty(payload);
                setMessage('Property created successfully.');
            }

            setTimeout(() => navigate('/accommodation/properties'), 700);
        } catch (err: any) {
            setError(err?.response?.data?.message || 'Unable to save property');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <p className="text-sm font-semibold uppercase tracking-[0.35em] text-emerald-400">Property</p>
                <h2 className="mt-2 text-2xl font-semibold text-white">{id ? 'Edit Property' : 'Add New Property'}</h2>
            </div>

            {error ? <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-300">{error}</div> : null}
            {message ? <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-300">{message}</div> : null}

            <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
                {loading ? (
                    <p className="text-sm text-slate-400">Loading property...</p>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div>
                                <label className="mb-2 block text-sm text-slate-300">Property name</label>
                                <input
                                    value={form.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    required
                                    className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white"
                                />
                            </div>
                            <div>
                                <label className="mb-2 block text-sm text-slate-300">Type</label>
                                <select
                                    value={form.type}
                                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                                    className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white"
                                >
                                    <option value="hotel">Hotel</option>
                                    <option value="bnb">BnB</option>
                                    <option value="apartment">Apartment</option>
                                    <option value="villa">Villa</option>
                                    <option value="hostel">Hostel</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <div>
                                <label className="mb-2 block text-sm text-slate-300">Street address</label>
                                <input
                                    value={form.street}
                                    onChange={(e) => setForm({ ...form, street: e.target.value })}
                                    className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white"
                                />
                            </div>
                            <div>
                                <label className="mb-2 block text-sm text-slate-300">City</label>
                                <input
                                    value={form.city}
                                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                                    required
                                    className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white"
                                />
                            </div>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-3">
                            <div>
                                <label className="mb-2 block text-sm text-slate-300">State</label>
                                <input
                                    value={form.state}
                                    onChange={(e) => setForm({ ...form, state: e.target.value })}
                                    className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white"
                                />
                            </div>
                            <div>
                                <label className="mb-2 block text-sm text-slate-300">Country</label>
                                <input
                                    value={form.country}
                                    onChange={(e) => setForm({ ...form, country: e.target.value })}
                                    required
                                    className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white"
                                />
                            </div>
                            <div>
                                <label className="mb-2 block text-sm text-slate-300">Postal code</label>
                                <input
                                    value={form.pincode}
                                    onChange={(e) => setForm({ ...form, pincode: e.target.value })}
                                    className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="mb-2 block text-sm text-slate-300">Description</label>
                            <textarea
                                value={form.description}
                                onChange={(e) => setForm({ ...form, description: e.target.value })}
                                rows={4}
                                className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none"
                            />
                        </div>

                        <div className="flex items-center gap-3">
                            <input
                                id="published"
                                type="checkbox"
                                checked={form.published}
                                onChange={(e) => setForm({ ...form, published: e.target.checked })}
                                className="h-4 w-4 rounded border-slate-700 bg-slate-950 text-emerald-500 focus:ring-emerald-500"
                            />
                            <label htmlFor="published" className="text-sm text-slate-300">
                                Publish this property
                            </label>
                        </div>

                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <button
                                type="submit"
                                disabled={saving}
                                className="rounded-2xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:opacity-60"
                            >
                                {saving ? 'Saving...' : id ? 'Save changes' : 'Create property'}
                            </button>
                            <button
                                type="button"
                                onClick={() => navigate('/accommodation/properties')}
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

export default PropertyEditPage;
