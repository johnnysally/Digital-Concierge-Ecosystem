import useDisputes from '../../hooks/useDisputes';
import StatusBadge from '../ui/StatusBadge';
import { timeAgo } from '../../utils/formatDate';

const priorityColor: Record<string, 'danger' | 'warning' | 'info' | 'neutral'> = {
    urgent: 'danger',
    high: 'warning',
    medium: 'info',
    low: 'neutral',
};

const DisputeList = () => {
    const { disputes, loading } = useDisputes();

    if (loading) return <div className="p-4 text-slate-400">Loading disputes...</div>;
    if (!disputes.length) return <div className="p-4 text-slate-400">No open disputes.</div>;

    return (
        <div className="space-y-3">
            {disputes.slice(0, 5).map((d) => (
                <div key={d._id} className="flex items-center justify-between rounded-xl border border-slate-200 dark:border-slate-800 p-4">
                    <div>
                        <p className="font-medium text-sm">{d.subject}</p>
                        <p className="text-xs text-slate-500 mt-1">{d.raisedBy} &middot; {timeAgo(d.createdAt)}</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <StatusBadge status={d.priority} type={priorityColor[d.priority]} />
                        <StatusBadge status={d.status} type={d.status === 'open' ? 'warning' : 'info'} />
                    </div>
                </div>
            ))}
        </div>
    );
};

export default DisputeList;