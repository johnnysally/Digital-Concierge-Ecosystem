import { useState } from 'react';
import SectionHeader from '../components/ui/SectionHeader';
import PartnerTable from '../components/features/PartnerTable';

const PartnersListPage = () => {
    const [filter, setFilter] = useState('');

    return (
        <div className="space-y-6">
            <SectionHeader title="Partners" subtitle="Manage all accommodation, restaurant, and transport partners" />

            <div className="flex gap-2 flex-wrap">
                {[
                    { key: '', label: 'All' },
                    { key: 'accommodation', label: '🏨 Accommodation' },
                    { key: 'restaurant', label: '🍽️ Restaurant' },
                    { key: 'transport', label: '🚗 Transport' },
                ].map((f) => (
                    <button
                        key={f.key}
                        onClick={() => setFilter(f.key)}
                        className={`rounded-xl px-4 py-2 text-sm font-medium transition-colors ${filter === f.key ? 'bg-primary-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}
                    >
                        {f.label}
                    </button>
                ))}
            </div>

            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
                <PartnerTable filter={filter} />
            </div>
        </div>
    );
};

export default PartnersListPage;