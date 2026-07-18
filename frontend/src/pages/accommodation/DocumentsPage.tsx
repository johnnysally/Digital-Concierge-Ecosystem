import { useEffect, useState, type FormEvent } from 'react';
import { getDocuments, createDocument, deleteDocument } from '../../api/accommodation/documentApi';
import { getMyProperties } from '../../api/accommodation/propertyApi';

const DocumentsPage = () => {
    const [documents, setDocuments] = useState<any[]>([]);
    const [properties, setProperties] = useState<any[]>([]);
    const [form, setForm] = useState({
        title: '',
        type: 'license',
        fileUrl: '',
        fileType: '',
        expiryDate: '',
        status: 'active',
        property: '',
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const fetchDocuments = async () => {
        try {
            const [documentsResponse, propertiesResponse] = await Promise.all([
                getDocuments(),
                getMyProperties(),
            ]);
            setDocuments(documentsResponse.documents || []);
            setProperties(propertiesResponse.properties || []);
        } catch (err: any) {
            setError(err?.response?.data?.message || 'Unable to load documents');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDocuments();
    }, []);

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        setSaving(true);
        setError('');
        setMessage('');

        try {
            const payload: any = {
                title: form.title,
                type: form.type,
                fileUrl: form.fileUrl,
                fileType: form.fileType,
                expiryDate: form.expiryDate || undefined,
                status: form.status,
            };
            if (form.property) payload.property = form.property;

            await createDocument(payload);
            setMessage('Document added successfully.');
            setForm({ title: '', type: 'license', fileUrl: '', fileType: '', expiryDate: '', status: 'active', property: '' });
            await fetchDocuments();
        } catch (err: any) {
            setError(err?.response?.data?.message || 'Unable to add document');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Delete this document?')) return;
        try {
            setLoading(true);
            await deleteDocument(id);
            await fetchDocuments();
        } catch (err: any) {
            setError(err?.response?.data?.message || 'Unable to delete document');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <p className="text-sm font-semibold uppercase tracking-[0.35em] text-emerald-400">Documents</p>
                <h2 className="mt-2 text-2xl font-semibold text-white">Maintain property documentation</h2>
            </div>

            {error ? <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-300">{error}</div> : null}
            {message ? <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-300">{message}</div> : null}

            <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
                <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
                    <h3 className="text-lg font-semibold text-white">Add document</h3>
                    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                        <div>
                            <label className="mb-2 block text-sm text-slate-300">Title</label>
                            <input
                                value={form.title}
                                onChange={(e) => setForm({ ...form, title: e.target.value })}
                                required
                                className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white"
                            />
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div>
                                <label className="mb-2 block text-sm text-slate-300">Type</label>
                                <select
                                    value={form.type}
                                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                                    className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white"
                                >
                                    <option value="license">License</option>
                                    <option value="insurance">Insurance</option>
                                    <option value="contract">Contract</option>
                                    <option value="tax">Tax</option>
                                    <option value="invoice">Invoice</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                            <div>
                                <label className="mb-2 block text-sm text-slate-300">Property</label>
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
                        <div>
                            <label className="mb-2 block text-sm text-slate-300">File URL</label>
                            <input
                                value={form.fileUrl}
                                onChange={(e) => setForm({ ...form, fileUrl: e.target.value })}
                                required
                                className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white"
                            />
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div>
                                <label className="mb-2 block text-sm text-slate-300">File type</label>
                                <input
                                    value={form.fileType}
                                    onChange={(e) => setForm({ ...form, fileType: e.target.value })}
                                    className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white"
                                />
                            </div>
                            <div>
                                <label className="mb-2 block text-sm text-slate-300">Expiry date</label>
                                <input
                                    value={form.expiryDate}
                                    onChange={(e) => setForm({ ...form, expiryDate: e.target.value })}
                                    type="date"
                                    className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="mb-2 block text-sm text-slate-300">Status</label>
                            <select
                                value={form.status}
                                onChange={(e) => setForm({ ...form, status: e.target.value })}
                                className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white"
                            >
                                <option value="active">Active</option>
                                <option value="expired">Expired</option>
                                <option value="archived">Archived</option>
                            </select>
                        </div>
                        <button
                            type="submit"
                            disabled={saving}
                            className="rounded-2xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:opacity-60"
                        >
                            {saving ? 'Saving...' : 'Add document'}
                        </button>
                    </form>
                </div>

                <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
                    <h3 className="text-lg font-semibold text-white">Your documents</h3>
                    {loading ? (
                        <p className="mt-4 text-sm text-slate-400">Loading documents...</p>
                    ) : documents.length === 0 ? (
                        <p className="mt-4 text-sm text-slate-400">No documents have been added yet.</p>
                    ) : (
                        <div className="mt-4 space-y-3">
                            {documents.map((document) => (
                                <div key={document._id} className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
                                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                        <div>
                                            <p className="font-medium text-white">{document.title}</p>
                                            <p className="text-sm text-slate-400">{document.type} • {document.status}</p>
                                            <p className="text-sm text-slate-400">{document.property || 'General'}</p>
                                        </div>
                                        <div className="flex flex-wrap gap-2 text-sm">
                                            <a href={document.fileUrl} target="_blank" rel="noreferrer" className="rounded-full border border-slate-700 px-3 py-1 text-slate-200 transition hover:border-emerald-500 hover:text-white">
                                                View
                                            </a>
                                            <button
                                                type="button"
                                                onClick={() => handleDelete(document._id)}
                                                className="rounded-full border border-rose-500 px-3 py-1 text-rose-300 transition hover:bg-rose-500/10"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DocumentsPage;
