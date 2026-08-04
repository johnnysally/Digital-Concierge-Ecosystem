import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getMyProperties } from '../../api/accommodation/propertyApi';

interface PropertyItem {
    _id: string;
    name: string;
    city?: string;
    type?: string;
    published?: boolean;
    photos?: string[];
}

const PropertyListPage = () => {
    const [properties, setProperties] = useState<PropertyItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

    useEffect(() => {
        const fetchProperties = async () => {
            try {
                const response = await getMyProperties();
                setProperties(response.properties || []);
            } catch (err: any) {
                setError(err?.response?.data?.message || 'Unable to load properties');
            } finally {
                setLoading(false);
            }
        };

        fetchProperties();
    }, []);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.35em] text-emerald-400">Properties</p>
                    <h2 className="mt-2 text-2xl font-semibold text-white">Manage your accommodation inventory</h2>
                </div>
                <Link
                    to="/accommodation/properties/new"
                    className="rounded-xl bg-emerald-500 px-4 py-2 text-sm font-medium text-slate-950 transition hover:bg-emerald-400"
                >
                    Add property
                </Link>
            </div>

            {error ? <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-300">{error}</div> : null}

            <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
                {loading ? (
                    <p className="text-sm text-slate-400">Loading properties...</p>
                ) : properties.length === 0 ? (
                    <p className="text-sm text-slate-400">No properties yet.</p>
                ) : (
                    <div className="space-y-3">
                        {properties.map((property) => (
                            <Link key={property._id} to={`/accommodation/properties/${property._id}`} className="block rounded-2xl border border-slate-800 bg-slate-950/70 p-4 transition hover:border-emerald-500">
                                <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                                    <div className="flex-shrink-0">
                                        {property.photos?.length ? (
                                            <img
                                                src={property.photos[0]}
                                                alt={property.name}
                                                className="h-24 w-32 rounded-xl border border-slate-800 object-cover"
                                                onClick={(event) => {
                                                    event.preventDefault();
                                                    event.stopPropagation();
                                                    setSelectedPhoto(property.photos?.[0] || null);
                                                }}
                                            />
                                        ) : (
                                            <div className="flex h-24 w-32 items-center justify-center rounded-xl border border-dashed border-slate-700 bg-slate-900/70 text-xs text-slate-500">
                                                No image
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between gap-3">
                                            <div>
                                                <p className="font-medium text-white">{property.name}</p>
                                                <p className="text-sm text-slate-400">{property.city || 'Location pending'} • {property.type || 'Accommodation'}</p>
                                            </div>
                                            <span className={`rounded-full px-2.5 py-1 text-xs ${property.published ? 'bg-emerald-500/15 text-emerald-300' : 'bg-slate-800 text-slate-300'}`}>
                                                {property.published ? 'Published' : 'Draft'}
                                            </span>
                                        </div>
                                        {property.photos?.length ? (
                                            <p className="mt-2 text-xs text-slate-400">{property.photos.length} uploaded image{property.photos.length > 1 ? 's' : ''}</p>
                                        ) : null}
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>

            {selectedPhoto && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4" onClick={() => setSelectedPhoto(null)}>
                    <div className="relative max-w-4xl max-h-[90vh]" onClick={(event) => event.stopPropagation()}>
                        <img src={selectedPhoto} alt="Property preview" className="max-h-[85vh] max-w-full rounded-2xl object-contain" />
                        <button type="button" onClick={() => setSelectedPhoto(null)} className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-black/70 text-xl text-white">×</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PropertyListPage;
