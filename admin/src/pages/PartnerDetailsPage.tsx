import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPartner, approvePartner, suspendPartner, activatePartner, deletePartner } from '../api/partnerApi';
import SectionHeader from '../components/ui/SectionHeader';
import StatusBadge from '../components/ui/StatusBadge';
import StatsCard from '../components/ui/StatsCard';
import { formatDate } from '../utils/formatDate';

const PartnerDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [partner, setPartner] = useState<any>(null);
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;
        getPartner(id).then((res) => {
            setPartner(res.partner);
            setProperties(res.properties || []);
        }).finally(() => setLoading(false));
    }, [id]);

    const handleDelete = async () => {
        if (!confirm('Delete this partner permanently? This action cannot be undone.')) return;
        await deletePartner(id!);
        navigate('/partners');
    };

    if (loading) return <div className="p-8 text-slate-400">Loading...</div>;
    if (!partner) return <div className="p-8 text-slate-400">Partner not found.</div>;

    return (
        <div className="space-y-6">
            <SectionHeader
                title={`${partner.firstName} ${partner.lastName}`}
                subtitle={partner.businessName}
                action={<button onClick={() => navigate('/partners')} className="text-sm text-primary-500 hover:underline">← Back to Partners</button>}
            />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatsCard title="Type" value={partner.partnerType || partner.businessType || 'N/A'} />
                <StatsCard title="Email" value={partner.email} />
                <StatsCard title="Joined" value={formatDate(partner.createdAt)} />
                <StatsCard
                    title="Status"
                    value={partner.isActive ? 'Active' : 'Suspended'}
                    subtitle={partner.isVerified ? 'Verified' : 'Unverified'}
                />
            </div>
            <div className="flex gap-3">
                {!partner.isVerified && (
                    <button onClick={() => approvePartner(id!).then(() => setPartner({ ...partner, isVerified: true }))}
                        className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700">Approve</button>
                )}
                {partner.isActive ? (
                    <button onClick={() => suspendPartner(id!).then(() => setPartner({ ...partner, isActive: false }))}
                        className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700">Suspend</button>
                ) : (
                    <button onClick={() => activatePartner(id!).then(() => setPartner({ ...partner, isActive: true }))}
                        className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700">Activate</button>
                )}
                <button onClick={handleDelete}
                    className="rounded-xl bg-slate-200 dark:bg-slate-700 px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600">Delete</button>
            </div>
            {properties.length > 0 && (
                <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
                    <h2 className="text-lg font-semibold mb-4">Properties ({properties.length})</h2>
                    <div className="space-y-3">
                        {properties.map((p: any) => (
                            <div key={p._id} className="flex justify-between items-center p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
                                <span className="font-medium">{p.name}</span>
                                <StatusBadge status={p.published ? 'Published' : 'Draft'} type={p.published ? 'success' : 'neutral'} />
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default PartnerDetailsPage;